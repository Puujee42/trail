import { getAllTrips, getFeaturedTrips } from "@/lib/mongo/trips";
import FeaturedTrips from "./FeaturedTrips";

export default async function FeaturedTripsWrapper() {
  const trips = await getAllTrips();
  if (!trips || trips.length === 0) return null;
  return <FeaturedTrips trips={trips} />;
}