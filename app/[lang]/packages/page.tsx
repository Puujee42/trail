import { getAllTrips } from "../../../lib/mongo/trips";
import PackagesList from "./PackagesList";
import { Metadata } from 'next';

import { Locale } from "@/i18n-config";

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  return {
    title: 'Explore Our Adventure Packages | Mongol Trail',
    description: 'Discover a wide range of adventure packages, including hiking in Mongolia, cultural tours in Europe, and more. Find your perfect trip with Mongol Trail.',
    keywords: ['Mongolia tours', 'Europe travel', 'adventure packages', 'hiking trips', 'overland adventure'],
    alternates: {
      canonical: `https://www.mongoltrail.com/${params.lang}/packages`,
      languages: {
        'mn': 'https://www.mongoltrail.com/mn/packages',
        'en': 'https://www.mongoltrail.com/en/packages',
        'ko': 'https://www.mongoltrail.com/ko/packages',
      }
    }
  };
}

import StructuredData from "@/app/components/seo/StructuredData";

export default async function PackagesPage(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const lang = params.lang;
  
  // 1. Fetch data from DB
  const trips = await getAllTrips();

  // 2. Pass to Client Component
  return (
    <>
      <StructuredData
        type="CollectionPage"
        data={{
          name: 'Adventure Packages | Mongol Trail',
          description: 'Discover a wide range of adventure packages, including hiking in Mongolia, cultural tours in Europe, and more.',
          url: `https://www.mongoltrail.com/${lang}/packages`,
          hasPart: trips.map(trip => ({
            '@type': 'TouristTrip',
            name: trip.title[lang] || trip.title.en,
            url: `https://www.mongoltrail.com/${lang}/tours/${trip._id}`,
            image: trip.image,
            description: trip.description?.[lang] || trip.description?.en,
            offers: {
              '@type': 'Offer',
              price: typeof trip.price === 'number' ? trip.price : (trip.price?.[lang] || trip.price?.en || 0),
              priceCurrency: 'USD'
            }
          }))
        }}
      />
      <PackagesList packages={trips} />
    </>
  );
}