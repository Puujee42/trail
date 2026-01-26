import clientPromise from "@/lib/mongo";
import AdminDashboardClient from "./AdminDashboardCleint";

export const dynamic = "force-dynamic";

import { clerkClient } from "@clerk/nextjs/server";

export default async function AdminDashboardPage() {
  const client = await clientPromise;
  const db = client.db("travel_db");

  // Fetch stats in parallel
  const [tripsCount, postsCount, bookingsCount, usersList] = await Promise.all([
    db.collection("trips").countDocuments(),
    db.collection("posts").countDocuments(),
    db.collection("bookings").countDocuments(),
    (await clerkClient()).users.getUserList({ limit: 0 })
  ]);

  const stats = {
    trips: tripsCount,
    blogs: postsCount,
    users: usersList.totalCount,
    bookings: bookingsCount
  };

  return (
    <div className="pt-24 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">A quick look at your travel site's data.</p>
      </header>
      <AdminDashboardClient stats={stats} />
    </div>
  );
}