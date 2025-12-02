// lib/mongo/bookings.ts
import clientPromise from "./index";
import { Trip } from "./trips";

const DB_NAME = "travel_db";
const COLLECTION = "bookings";

export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  tripTitle: { mn: string; en: string; ko: string }; // Snapshot of title
  tripImage: string;
  date: string;
  filter: string;
  travelers: number;
  totalPrice: number; // Stored as a single number (usually base currency)
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

export async function getUserBookings(userId: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  // 1. Try to find real bookings
  const bookings = await collection
    .find({ userId })
    .sort({ date: -1 })
    .toArray();

  // 2. IF NO BOOKINGS EXIST (For testing purposes), return Mock Data
  if (bookings.length === 0) {
    return [
      {
        _id: "mock_1",
        userId,
        tripId: "mock_trip_1",
        tripTitle: { mn: "Швейцарийн Glacier Express", en: "Swiss Glacier Express", ko: "스위스 빙하 특급" },
        tripImage: "/glacier.png",
        date: "2025-06-15",
        travelers: 2,
        totalPrice: 1900000,
        filter: "luxury",
        status: "confirmed"
      },
      {
        _id: "mock_2",
        userId,
        tripId: "mock_trip_2",
        tripTitle: { mn: "Токио Диснейленд", en: "Tokyo Disneyland", ko: "도쿄 디즈니랜드" },
        tripImage: "/tokyo.jpg",
        date: "2024-12-10",
        travelers: 4,
        totalPrice: 15200000,
        status: "completed",
        filter: "family"
      }
    ];
  }

  // Map MongoDB _id to string
  return bookings.map((b) => ({
    ...b,
    _id: b._id.toString(),
  }));
}