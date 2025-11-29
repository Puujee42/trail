
import { getFamilyTrips } from "@/lib/mongo/trips";
import FamilyPackagesList from "./FamilyPackegesList";

export default async function FamilyPage() {
  // 1. Fetch from DB
  const trips = await getFamilyTrips();

  // 2. Pass to client component
  return <FamilyPackagesList trips={trips} />;
}