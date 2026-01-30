import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/index"; // Ensure this path is correct

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("travel_db");

        // Assuming 'custom_trips' is the collection name used in createCustomTripInquiry
        // If different, this needs to match lib/mongo/custom-trips.ts
        const inquiries = await db.collection("custom_trips")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(inquiries);
    } catch (error) {
        console.error("Failed to fetch custom trips:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
