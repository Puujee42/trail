import { Suspense } from "react";
import HeroWrapper from "./components/HeroWrapper";
import FeaturedTripsWrapper from "./components/FeaturedTripsWrapper";
import WhyChooseUs from "./components/WhyChooseUs";
import TripReviews from "./components/TripReviews";


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