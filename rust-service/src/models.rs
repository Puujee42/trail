use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

// 1. Added Clone here
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LocalizedString {
    pub mn: Option<String>,
    pub en: Option<String>,
    pub ko: Option<String>,
}

// 2. Added Clone here
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LocalizedPrice {
    pub mn: Option<f64>,
    pub en: Option<f64>,
    pub ko: Option<f64>,
}

// 3. Added Clone here
#[derive(Debug, Serialize, Deserialize, Clone)]
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

// 4. Added Clone here
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItineraryItem {
    pub day: i32,
    pub title: LocalizedString,
    pub desc: LocalizedString,
}

// Price already has Clone, but it needs its child (LocalizedPrice) to have it too
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Price {
    pub adult: LocalizedPrice,
    pub child: LocalizedPrice,
    pub infant: LocalizedPrice,
    pub senior: LocalizedPrice,
    pub pet: LocalizedPrice,
    pub discount: LocalizedPrice,
    pub total: LocalizedPrice,
    pub currency: String,
}

// Trip already has Clone, but it needs ALL its children to have it too
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