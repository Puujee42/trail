
import { getHoneymoonTrips } from "@/lib/mongo/trips";
import HoneymoonList from "./HoneyMoonList";

export default async function HoneymoonPage() {
  const trips = await getHoneymoonTrips();
  return <HoneymoonList trips={trips} />;
}