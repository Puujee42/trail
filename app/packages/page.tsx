import { getAllTrips } from "../../lib/mongo/trips";
import PackagesList from "./PackagesList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Our Adventure Packages | Mongol Trail',
  description: 'Discover a wide range of adventure packages, including hiking in Mongolia, cultural tours in Europe, and more. Find your perfect trip with Mongol Trail.',
  keywords: ['Mongolia tours', 'Europe travel', 'adventure packages', 'hiking trips', 'overland adventure'],
};

export default async function PackagesPage() {
  // 1. Fetch data from DB
  const trips = await getAllTrips();

  // 2. Pass to Client Component
  return <PackagesList packages={trips} />;
}