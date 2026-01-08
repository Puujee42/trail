use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalizedString {
    pub mn: Option<String>,
    pub en: Option<String>,
    pub ko: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalizedPrice {
    pub mn: Option<f64>,
    pub en: Option<f64>,
    pub ko: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TripDate {
    pub id: String,
    #[serde(rename = "startDate")]
    pub start_date: String,
    #[serde(rename = "endDate")]
    pub end_date: String,
    #[serde(rename = "maxSeats")]
    pub max_seats: i32,
    #[serde(rename = "bookedSeats")]
    pub booked_seats: i32,
    #[serde(rename = "priceModifier")]
    pub price_modifier: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ItineraryItem {
    pub day: i32,
    pub title: LocalizedString,
    pub desc: LocalizedString,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Trip {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub type_name: Option<String>, // Renamed from type to avoid keyword conflict
    pub region: Option<String>,
    
    pub title: LocalizedString,
    pub location: LocalizedString,
    pub duration: LocalizedString,
    pub description: Option<LocalizedString>,
    #[serde(rename = "ageGroup")]
    pub age_group: Option<LocalizedString>,

    pub category: String,
    pub rating: f64,
    pub image: String,
    pub price: LocalizedPrice, // Changed to support object
    pub tags: Option<Vec<String>>,
    pub featured: Option<bool>,
    #[serde(rename = "oldPrice")]
    pub old_price: Option<f64>,
    pub reviews: Option<i32>,
    pub perks: Option<Vec<String>>,
    #[serde(rename = "saleMonth")]
    pub sale_month: Option<i32>,
    #[serde(rename = "seatsLeft")]
    pub seats_left: Option<i32>,
    pub itinerary: Option<Vec<ItineraryItem>>,
    pub dates: Option<Vec<TripDate>>,
}
