use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use dotenv::dotenv;
use mongodb::{Client, options::ClientOptions};
use std::env;
use futures::stream::TryStreamExt;
use mongodb::bson::{doc, Document};

mod models;
use models::Trip;

struct AppState {
    db: mongodb::Database,
}

#[get("/trips")]
async fn get_trips(data: web::Data<AppState>, query: web::Query<std::collections::HashMap<String, String>>) -> impl Responder {
    let collection = data.db.collection::<Trip>("trips");
    
    let mut filter = doc! {};
    
    if let Some(trip_type) = query.get("type") {
        filter.insert("type", trip_type);
    }
    
    if let Some(region) = query.get("region") {
        filter.insert("region", region);
    }

    if let Some(id) = query.get("id") {
        if let Ok(oid) = mongodb::bson::oid::ObjectId::parse_str(id) {
             filter.insert("_id", oid);
        }
    }

    let mut find_options = mongodb::options::FindOptions::builder()
        .sort(doc! { "featured": -1, "_id": -1 })
        .build();

    if let Some(limit_str) = query.get("limit") {
        if let Ok(limit_val) = limit_str.parse::<i64>() {
            find_options.limit = Some(limit_val);
        }
    }

    let mut cursor = match collection.find(filter, find_options).await {
        Ok(cursor) => cursor,
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };

    let mut trips: Vec<Trip> = Vec::new();
    while let Ok(Some(trip)) = cursor.try_next().await {
        trips.push(trip);
    }

    HttpResponse::Ok().json(trips)
}

#[get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("Rust Service is Running")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    
    let mut client_options = ClientOptions::parse(&database_url).await.unwrap();
    client_options.app_name = Some("RustTripsService".to_string());
    
    let client = Client::with_options(client_options).unwrap();
    let db = client.database("travel_db"); 

    println!("🚀 Rust Server running on http://localhost:8080");

    HttpServer::new(move || {
        let cors = Cors::permissive(); // Allow all for prototype simplicity

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(AppState { db: db.clone() }))
            .service(get_trips)
            .service(health_check)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
