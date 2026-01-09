import { getTripById } from "@/lib/mongo/trips";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BookingPage({ params }: PageProps) {
  // 1. Resolve params (Next.js 15 requirement)
  const { id } = await params;

  // 2. Fetch Trip Data
  const trip = await getTripById(id);

  // 3. Handle 404
  if (!trip) {
    return notFound();
  }

  // 4. Render Client Component
  return <BookingForm trip={trip} />;
}