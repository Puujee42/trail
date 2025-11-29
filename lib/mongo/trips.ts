// lib/mongo/trips.ts
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