import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server"; // Security: Get ID and details from session
import clientPromise from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    // 1. Security: Get the logged-in user's ID
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse optional incoming data (e.g., phone number provided in a custom form)
    // If you don't have a custom form, you can skip this part
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Body is empty, which is fine
    }
    const { phone, address } = body as any;

    const client = await clientPromise;
    const db = client.db("travel_db");

    // 3. Construct the User Object
    // We use data from Clerk (verified) and merge it with optional custom data
    const email = user.emailAddresses[0]?.emailAddress;
    const name = user.fullName || `${user.firstName} ${user.lastName}`;

    // 4. Update or Insert (Upsert) into MongoDB
    // This ensures we don't create duplicates if the user hits this endpoint twice
    const result = await db.collection("users").updateOne(
      { clerkId: userId }, // Search by Clerk ID
      {
        $set: {
          email: email,
          name: name,
          image: user.imageUrl,
          // Only update these if provided, otherwise keep existing or set empty
          ...(phone && { phone }), 
          ...(address && { address }),
          lastLogin: new Date(),
        },
        $setOnInsert: {
          clerkId: userId,
          role: "user", // Default role
          createdAt: new Date(),
        },
      },
      { upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({ 
      success: true, 
      message: "User profile synced successfully",
      userId: userId
    });

  } catch (error: any) {
    console.error("Signup Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}