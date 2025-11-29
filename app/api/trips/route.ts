import { NextResponse } from "next/server";
import { getAllTrips, getTripsByType, getTripById } from "@/lib/mongo/trips";

export async function GET(request: Request) {
  try {
    // 1. Get URL parameters (e.g., ?type=family or ?id=123)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    // 2. Scenario: Fetch Single Trip by ID
    if (id) {
      const trip = await getTripById(id);
      if (!trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }
      return NextResponse.json(trip, { status: 200 });
    }

    // 3. Scenario: Fetch Trips by Type
    if (type) {
      const trips = await getTripsByType(type);
      return NextResponse.json(trips, { status: 200 });
    }

    // 4. Default: Fetch All Trips
    const trips = await getAllTrips();
    return NextResponse.json(trips, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}