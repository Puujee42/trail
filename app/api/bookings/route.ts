import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Security: Get ID from session
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // 1. Security: Get the logged-in user's ID
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the incoming data
    const body = await req.json();
    const { tripId, date, travelers, guestName, guestEmail, guestPhone } = body;

    if (!tripId || !date || !travelers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 3. Fetch the Trip details from DB (Don't trust client-sent prices!)
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // 4. Calculate Price Server-Side (Safety)
    // Default to MN price for calculation base, or you can store the currency used
    const basePrice = trip.price.mn || 0; 
    const totalPrice = basePrice * Number(travelers);

    // 5. Construct the Booking Object
    // We snapshot the title/image so if the trip changes later, the booking history stays accurate
    const newBooking = {
      userId, // The Clerk ID
      tripId,
      tripTitle: trip.title, // Save the trilingual title snapshot
      tripImage: trip.image,
      date,
      travelers: Number(travelers),
      totalPrice,
      currency: "MNT", // You can make this dynamic if needed
      guestDetails: {
        name: guestName,
        email: guestEmail,
        phone: guestPhone
      },
      status: "pending", // Default status
      createdAt: new Date(),
    };

    // 6. Insert into MongoDB
    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json({ success: true, bookingId: result.insertedId });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}