import { getTripById } from "@/lib/mongo/trips";
import { notFound } from "next/navigation";
import TourDetailClient from "./TourDetailClient";

// Define props for Next.js 15+
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TourPage(props: PageProps) {
  // 1. Await the params (Required in Next.js 15)
  const params = await props.params;
  
  // 2. Fetch data from MongoDB using the ID
  const trip = await getTripById(params.id);

  // 3. If no trip found, show 404 page
  if (!trip) {
    notFound();
  }

  // 4. Pass the data to the Client Component
  return <TourDetailClient trip={trip} />;
}