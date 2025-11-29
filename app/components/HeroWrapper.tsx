import { getFeaturedTrips } from "@/lib/mongo/trips";
import Hero from "./Hero";

export default async function HeroWrapper() {
  const trips = await getFeaturedTrips();
  return <Hero trips={trips} />;
}