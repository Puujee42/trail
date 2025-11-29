// lib/mongo/trips.ts
import { ObjectId } from "mongodb";
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "trips";

export interface Trip {
  _id: string;
  title: string;
  category: string;
  location: string;
  duration: string;
  rating: number;
  image: string; // The Hero needs this!
  // Note: The DB seed didn't have a 'desc' field, so we make it optional
  description?: string; 
  price: number;
  tags: string[];
  featured: boolean;
  oldPrice?: number;
  reviews?: number;
  ageGroup?: string;  // Specific to Family
  romanceFactor?: string; // e.g. "10/10"
  perks?: string[];   // Specific to Family
  tag?:string[];
  vibe?: string;     // Specific to Solo
  socialScore?: number; // Specific to Solo
  saleMonth?: number; // 0 = Jan, 11 = Dec. Filter by this.
  seatsLeft?: number; // For urgency
}

function mapTrip(doc: any): Trip {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export async function getFeaturedTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  // Fetch only featured trips, limit to 5
  const trips = await collection
    .find({ featured: true })
    .limit(5)
    .toArray();

  return trips.map(mapTrip);
}
// lib/mongo/trips.ts
export async function getRecentTrips() {
  const client = await clientPromise;
  const collection = client.db("travel_db").collection("trips");
  
  // Sort by _id (which contains timestamp) descending to get newest
  const trips = await collection
    .find({})
    .sort({ _id: -1 }) 
    .limit(6)
    .toArray();

  return trips.map(mapTrip);
}
export async function getAllTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  // Sort by featured first, then newest
  const trips = await collection
    .find({})
    .sort({ featured: -1, _id: -1 }) 
    .toArray();

  return trips.map(mapTrip);
}
export async function getFamilyTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ type: "family" }) // Ensure your DB has { type: "family" }
    .toArray();

  return trips.map(mapTrip);
}
export async function getHoneymoonTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ type: "honeymoon" }) // Ensure your seed data uses 'type: "honeymoon"'
    .toArray();

  return trips.map(mapTrip);
}
export async function getSoloTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  const trips = await collection
    .find({ type: "solo" }) // Ensure seed data has { type: "solo" }
    .toArray();

  return trips.map(mapTrip);
}
export async function getSaleTrips() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);
  
  // Find trips where 'oldPrice' exists and is greater than 'price'
  const trips = await collection
    .find({ 
      oldPrice: { $exists: true, $ne: null } 
    })
    .sort({ price: 1 }) // Cheapest first
    .toArray();

  return trips.map(mapTrip);
}
export async function getTripById(id: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  try {
    // MongoDB requires the ID to be wrapped in ObjectId()
    const trip = await collection.findOne({ _id: new ObjectId(id) });
    
    // If found, clean the data and return it
    return trip ? mapTrip(trip) : null;
  } catch (error) {
    // If the ID format is invalid (not 24 chars), just return null
    return null;
  }
}