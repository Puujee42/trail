import { getRecentTrips } from "@/lib/mongo/trips";
import { fetchTripsFromRust } from "@/lib/rust-api";
import Hero from "./Hero";

export default async function HeroWrapper() {
  // Try Rust Service First (Faster finding)
  const rustTrips = await fetchTripsFromRust({ limit: 6 });
  
  if (rustTrips && rustTrips.length > 0) {
    return <Hero trips={rustTrips} />;
  }

  // Fallback to Node.js
  const trips = await getRecentTrips();
  return <Hero trips={trips} />;
}