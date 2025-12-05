import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

// ─────────────────────────────────────────────────────────────
// 1. GET: Fetch All Comments (For Admin Dashboard)
// ─────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    // 1. Security Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 2. Fetch comments (Sorted by newest first)
    const comments = await db
      .collection("comments")
      .find({})
      .sort({ createdAt: -1 }) // Newest first
      .toArray();

    return NextResponse.json({ success: true, comments });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// 2. POST: Add a Comment Manually (Admin Mode)
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // 1. Security Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { 
      name, 
      trip, 
      text, 
      location, 
      rating, 
      language, // 'mn', 'en', 'ko'
      status    // 'approved', 'pending', 'rejected'
    } = body;

    // Validation
    if (!name || !text || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 3. Construct Object
    const newComment = {
      name,
      trip: trip || "General",
      text,
      location: location || "Unknown",
      rating: Number(rating) || 5,
      language, 
      status: status || "approved", // Admin added comments are approved by default
      dateStr: new Date().toISOString().split('T')[0], // e.g., "2025-12-06"
      createdAt: new Date(),
      createdBy: userId
    };

    // 4. Insert
    const result = await db.collection("comments").insertOne(newComment);

    return NextResponse.json({ success: true, commentId: result.insertedId });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// 3. PATCH: Update Status (Approve/Reject) or Edit Content
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { commentId, status, text, rating } = body;

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    // Prepare update fields dynamically
    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (text) updateFields.text = text;
    if (rating) updateFields.rating = rating;

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// 4. DELETE: Remove a Comment
// ─────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travel_db");

    const result = await db.collection("comments").deleteOne({ 
      _id: new ObjectId(id) 
    });

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}