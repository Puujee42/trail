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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Price {
    pub adult: LocalizedPrice,
    pub child: LocalizedPrice,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Trip {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    #[serde(rename = "type")]
    pub trip_type: Option<String>,
    pub region: Option<String>,
    
    pub title: LocalizedString,
    pub location: LocalizedString,
    pub duration: LocalizedString,
    pub description: Option<LocalizedString>,
    pub age_group: Option<LocalizedString>,

    pub category: String,
    pub rating: f64,
    pub image: String,
    pub price: Price,
    pub discount: Option<f64>,
    pub tags: Option<Vec<String>>,
    pub featured: Option<bool>,
    pub highlights: Option<Vec<LocalizedString>>,
    pub included: Vec<String>,
    pub not_included: Vec<String>,
    pub itinerary: Option<Vec<ItineraryItem>>,
    pub dates: Option<Vec<TripDate>>,
}
