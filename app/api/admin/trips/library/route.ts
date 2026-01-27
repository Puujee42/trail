import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo";

// Security Helper
async function checkAdmin() {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function GET() {
    try {
        await checkAdmin();
        const client = await clientPromise;
        const db = client.db("travel_db");

        const trips = await db.collection("trips").find({}).sort({ title: 1 }).toArray();

        // Serialize Object IDs
        const serializedTrips = trips.map(trip => ({
            ...trip,
            _id: trip._id.toString(),
        }));

        return NextResponse.json(serializedTrips);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === "Unauthorized" ? 403 : 500 }
        );
    }
}
