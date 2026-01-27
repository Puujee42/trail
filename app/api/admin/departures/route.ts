import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createDeparture, updateDeparture, deleteDeparture, getDeparturesByTrip } from "@/lib/mongo/departures";

async function checkAdmin() {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tripId = searchParams.get("tripId");
        if (!tripId) return NextResponse.json({ error: "tripId is required" }, { status: 400 });

        const departures = await getDeparturesByTrip(tripId);
        return NextResponse.json(departures);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await checkAdmin();
        const body = await req.json();
        const id = await createDeparture(body);
        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await checkAdmin();
        const { _id, ...data } = await req.json();
        await updateDeparture(_id, data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await checkAdmin();
        const { _id } = await req.json();
        await deleteDeparture(_id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
    }
}
