import { ObjectId } from "mongodb";
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "trips";

export interface Trip {
  _id: string;
  type?: string; // Made optional as not all queries strictly return it
  title: string;
  category: string;
  location: string;
  duration: string;
  rating: number;
  image: string;
  description?: string; 
  price: number;
  tags?: string[];
  featured?: boolean;
  oldPrice?: number;
  reviews?: number;
  ageGroup?: string;
  romanceFactor?: string;
  perks?: string[];
  tag?: string; // Singular tag (used in Honeymoon)
  vibe?: string;
  socialScore?: number;
  saleMonth?: number;
  seatsLeft?: number;
  itinerary?: ItineraryItem[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  desc: string;
}

function mapTrip(doc: any): Trip {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/* ──────────────────────────────────────────────────────
   DATA FETCHING FUNCTIONS
────────────────────────────────────────────────────── */

// 1. Get ALL trips
export async function getAllTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({})
    .sort({ featured: -1, _id: -1 }) 
    .toArray();

  return trips.map(mapTrip);
}

// 2. ✨ THE MISSING FUNCTION: Get Trips by generic 'type'
export async function getTripsByType(type: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ type: type })
    .toArray();

  return trips.map(mapTrip);
}

// 3. Get Featured trips
export async function getFeaturedTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ featured: true })
    .limit(5)
    .toArray();

  return trips.map(mapTrip);
}

// 4. Get Recent trips
export async function getRecentTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({})
    .sort({ _id: -1 }) 
    .limit(6)
    .toArray();

  return trips.map(mapTrip);
}

// 5. Get Family trips
export async function getFamilyTrips() {
  return getTripsByType("family");
}

// 6. Get Honeymoon trips
export async function getHoneymoonTrips() {
  return getTripsByType("honeymoon");
}

// 7. Get Solo trips
export async function getSoloTrips() {
  return getTripsByType("solo");
}

// 8. Get Sale trips
export async function getSaleTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ 
      oldPrice: { $exists: true, $ne: null } 
    })
    .sort({ price: 1 })
    .toArray();

  return trips.map(mapTrip);
}

// 9. Get Single Trip by ID
export async function getTripById(id: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  try {
    const trip = await collection.findOne({ _id: new ObjectId(id) });
    return trip ? mapTrip(trip) : null;
  } catch (error) {
    return null;
  }
}
