import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }
    const user = await currentUser();
    const wishlist = Array.isArray(user?.publicMetadata?.wishlist)
      ? (user!.publicMetadata!.wishlist as string[])
      : [];
    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { tripId, action } = body as { tripId: string; action: "add" | "remove" };
    if (!tripId || !["add", "remove"].includes(action)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const current = Array.isArray(user.publicMetadata?.wishlist)
      ? (user.publicMetadata!.wishlist as string[])
      : [];

    let next: string[] = current;
    if (action === "add") {
      next = current.includes(tripId) ? current : [...current, tripId];
    } else {
      next = current.filter((id) => id !== tripId);
    }

    await client.users.updateUser(userId, {
      publicMetadata: { ...user.publicMetadata, wishlist: next },
    });

    return NextResponse.json({ wishlist: next }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
