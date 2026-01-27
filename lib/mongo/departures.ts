import { ObjectId } from "mongodb";
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "departures";

export interface TripDeparture {
    _id: string;
    trip_id: string;
    start_date: string; // ISO string "2026-06-18"
    end_date: string;   // ISO string "2026-06-28"
    status: 'Available' | 'Sold Out' | 'Guaranteed';
}

function mapDeparture(doc: any): TripDeparture {
    return {
        ...doc,
        _id: doc._id.toString(),
    };
}

export async function getDeparturesByTrip(tripId: string) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const departures = await db.collection(COLLECTION)
        .find({ trip_id: tripId })
        .sort({ start_date: 1 })
        .toArray();
    return departures.map(mapDeparture);
}

export async function getAllDepartures() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const departures = await db.collection(COLLECTION)
        .find({})
        .sort({ start_date: 1 })
        .toArray();
    return departures.map(mapDeparture);
}

export async function createDeparture(data: Partial<TripDeparture>) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { _id, ...insertData } = data;
    const result = await db.collection(COLLECTION).insertOne({
        ...insertData,
        createdAt: new Date(),
    });
    return result.insertedId;
}

export async function updateDeparture(id: string, data: Partial<TripDeparture>) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { _id, ...updateData } = data;
    await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
}

export async function deleteDeparture(id: string) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
