import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

// GET: Fetch passengers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");
    const dateId = searchParams.get("dateId");

    const client = await clientPromise;
    const db = client.db("travel_db");

    // Only show active bookings (not cancelled ones)
    const bookings = await db.collection("bookings").find({ 
        tripId: tripId, 
        dateId: dateId,
        status: { $ne: "cancelled" }
    }).toArray();

    return NextResponse.json(bookings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Add passenger
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripId, dateId, userId, userEmail, userName, tripTitle, price, tripImage } = body;

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 1. Create Booking
    await db.collection("bookings").insertOne({
      userId,
      userEmail,
      userName,
      tripId,
      dateId,
      tripTitle,
      tripImage,
      totalPrice: price,
      travelers: 1,
      status: "confirmed",
      date: new Date().toISOString(),
      createdAt: new Date(),
    });

    // 2. Increase Seat Count
    await db.collection("trips").updateOne(
      { _id: new ObjectId(tripId), "dates.id": dateId },
      { $inc: { "dates.$.bookedSeats": 1, seatsLeft: -1 } }
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE: Remove passenger (Cancel Booking)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 1. Find the booking to know which Trip and Date Group it belongs to
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Mark Booking as Cancelled (Soft Delete)
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: "cancelled" } }
    );

    // 3. Decrease Seat Count (Free up the seat)
    await db.collection("trips").updateOne(
      { _id: new ObjectId(booking.tripId), "dates.id": booking.dateId },
      { $inc: { "dates.$.bookedSeats": -1, seatsLeft: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}