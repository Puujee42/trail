import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

// Security Helper
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// --- CREATE a new trip ---
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("travel_db");

    const result = await db.collection("trips").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
  }
}

// --- UPDATE an existing trip ---
export async function PATCH(req: Request) {
  try {
    await checkAdmin();
    const { _id, departures, ...updateData } = await req.json();

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 1. Update Trip Document
    await db.collection("trips").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    // 2. Sync Departures (if provided)
    if (departures && Array.isArray(departures)) {
      // Clear existing departures for this trip
      await db.collection("departures").deleteMany({ trip_id: _id });

      // Insert new ones (cleaning up IDs if they came from the frontend)
      if (departures.length > 0) {
        const cleanedDepartures = departures.map(({ _id, ...rest }) => ({
          ...rest,
          trip_id: _id, // Ensure trip_id is correct
          createdAt: new Date()
        })).map(d => ({ ...d, trip_id: _id })); // Fix accidental override

        await db.collection("departures").insertMany(cleanedDepartures);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
  }
}

// --- DELETE a trip ---
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { _id } = await req.json();

    const client = await clientPromise;
    const db = client.db("travel_db");

    await db.collection("trips").deleteOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
  }
}