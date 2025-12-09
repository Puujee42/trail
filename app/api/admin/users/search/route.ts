import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    // 1. Security Check (Admin only)
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 2. Get Search Query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    // 3. Search Clerk
    const client = await clerkClient();
    const users = await client.users.getUserList({
      query,
      limit: 5,
    });

    // 4. Format for UI
    const formattedUsers = users.data.map((u) => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "No Name",
      email: u.emailAddresses[0]?.emailAddress || "No Email",
      image: u.imageUrl,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}