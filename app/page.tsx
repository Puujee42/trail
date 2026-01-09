import { Suspense } from "react";
import HeroWrapper from "./components/HeroWrapper";
import FeaturedTripsWrapper from "./components/FeaturedTripsWrapper";
import WhyChooseUs from "./components/WhyChooseUs";
import TripReviews from "./components/TripReviews";
import { Metadata } from 'next';

export const revalidate = 3600; 

export const metadata: Metadata = {
  title: 'Mongol Trail | Adventure Tours & Hiking in Mongolia & Europe',
  description: 'Discover unforgettable adventure tours with Mongol Trail. From hiking in the Mongolian wilderness to exploring European trails, we provide premier travel experiences.',
  keywords: ['Mongolia tours', 'hiking Mongolia', 'Europe adventure', 'travel agency Mongolia', 'Mongol Trail', 'overland travel'],
};

export default function Home() {
  // NO await here! The page loads instantly.
  
  return (
    <>
      {/* Load Hero independently */}
      <Suspense fallback={<div className="h-screen bg-slate-900" />}>
        <HeroWrapper />
      </Suspense>

      {/* Load Featured Trips independently */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Trips...</div>}>
        <FeaturedTripsWrapper />
      </Suspense>

      <WhyChooseUs />
      <TripReviews />
    </>
  );
}