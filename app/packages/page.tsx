
import { getAllTrips } from "../../lib/mongo/trips";
import PackagesList from "./PackagesList";

export default async function PackagesPage() {
  // 1. Fetch data from DB
  const trips = await getAllTrips();

  // 2. Pass to Client Component
  return <PackagesList packages={trips} />;
}