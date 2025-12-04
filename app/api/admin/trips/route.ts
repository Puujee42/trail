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
    const { _id, ...updateData } = await req.json();

    const client = await clientPromise;
    const db = client.db("travel_db");

    await db.collection("trips").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

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