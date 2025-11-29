import { getTripById } from "@/lib/mongo/trips";
import { notFound } from "next/navigation";
import TourDetailClient from "./TourDetailClient"; 

// 1. Update the type definition to be a Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TourPage({ params }: PageProps) {
  // 2. Await the params to get the ID
  const { id } = await params;

  // 3. Now fetch the data using the resolved ID
  const trip = await getTripById(id);

  // 4. Handle 404 if trip is not found
  if (!trip) {
    return notFound();
  }

  // 5. Pass data to Client Component
  return <TourDetailClient trip={trip} />;
}