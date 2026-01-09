import { Suspense } from "react";
import HeroWrapper from "./components/HeroWrapper";
import FeaturedTripsWrapper from "./components/FeaturedTripsWrapper";
import WhyChooseUs from "./components/WhyChooseUs";
import TripReviews from "./components/TripReviews";
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Mongolia Hiking Tours & Best Trekking Routes | Mongol Trail',
  description: 'Book the best hiking tours in Mongolia with Mongol Trail. From Tavan Bogd base camp treks to Terelj National Park trails, we offer guided adventure travel and trail guides.',
  keywords: [
    'Mongolia hiking tours',
    'Best trekking routes in Mongolia',
    'Mongolia trail guide',
    'Guided hiking Mongolia',
    'Horseback riding trails Mongolia',
    'Mongolia adventure travel agency',
    'Terelj National Park hiking trails',
    'Tavan Bogd base camp trek cost',
    'Bogd Khan mountain hiking guide'
  ],
};

export default function Home() {
  // NO await here! The page loads instantly.

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Mongol Trail',
            url: 'https://www.mongoltrail.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.mongoltrail.com/packages?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
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