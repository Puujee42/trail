import { getAllTrips } from "@/lib/mongo/trips";
import { fetchTripsFromRust } from "@/lib/rust-api";
import FeaturedTrips from "./FeaturedTrips";

export default async function FeaturedTripsWrapper() {
  // Try Rust Service First
  const rustTrips = await fetchTripsFromRust();

  if (rustTrips && rustTrips.length > 0) {
    return <FeaturedTrips trips={rustTrips} />;
  }

  // Fallback
  const trips = await getAllTrips();
  if (!trips || trips.length === 0) return null;
  return <FeaturedTrips trips={trips} />;
}