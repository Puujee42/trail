import { getRecentTrips } from "@/lib/mongo/trips";
import Hero from "./Hero";

export default async function HeroWrapper() {
  const trips = await getRecentTrips();
  return <Hero trips={trips} />;
}