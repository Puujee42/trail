import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroWrapper from "../components/HeroWrapper";
import FeaturedTripsWrapper from "../components/FeaturedTripsWrapper";
import { Metadata } from 'next';
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import StructuredData from "../components/seo/StructuredData";

// Code Splitting for below-the-fold components
const WhyChooseUs = dynamic(() => import("../components/WhyChooseUs"), { 
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" /> 
});
const TopDestinations = dynamic(() => import("../components/TopDestinations"), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});
const FAQ = dynamic(() => import("../components/FAQ"));
const TripReviews = dynamic(() => import("../components/TripReviews"), {
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />
});

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  const titles = {
    en: 'Mongol Trail - Discover the Wild Beauty of Mongolia',
    mn: 'Mongol Trail - Монголын зэрлэг байгалийг нээ',
    ko: 'Mongol Trail - 몽골의 야생의 아름다움을 발견하세요',
    de: 'Mongol Trail - Entdecken Sie die wilde Schönheit der Mongolei'
  };

  const descriptions = {
    en: 'Explore the best hiking, horse, and bike trails in Mongolia. Get GPX maps and travel tips.',
    mn: 'Монголын хамгийн шилдэг явган, морин болон дугуйн аяллын замуудтай танилц. GPX зураг болон аяллын зөвлөгөө аваарай.',
    ko: '몽골 최고의 하이킹, 승마, 자전거 코스를 탐험하세요. GPX 지도와 여행 팁을 받으세요.',
    de: 'Erkunden Sie die besten Wander-, Reit- und Radwege in der Mongolei. Holen Sie sich GPX-Karten und Reisetipps.'
  };

  const baseUrl = 'https://www.mongoltrail.com';
  return {
    title: titles[params.lang] || titles.en,
    description: descriptions[params.lang] || descriptions.en,
    keywords: [
      'Mongol Trail',
      'Mongolia Trekking',
      'Mongolia Hiking',
      'Mongolia Travel',
      'Mongolia Tours',
      'Gobi Desert Trekking',
      'Altai Mountains Hiking',
      'Mongolia Horse Riding',
      'Mongolia Bike Trails',
      'Visit Mongolia',
      'Mongolia GPX Maps',
      'Adventure Travel Mongolia',
      'Mongolia tour operator',
      'Orkhon Valley',
      'best time to visit Mongolia'
    ],
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        'mn': `${baseUrl}/mn`,
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/en`,
      }
    },
    openGraph: {
      title: titles[params.lang] || titles.en,
      description: descriptions[params.lang] || descriptions.en,
      type: 'website',
      locale: params.lang === 'mn' ? 'mn_MN' : params.lang === 'ko' ? 'ko_KR' : 'en_US',
      url: `${baseUrl}/${params.lang}`,
      siteName: 'Mongol Trail'
    }
  };
}

export default async function Home(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  return (
    <>
      {/* Organization Schema - Knowledge Graph */}
      <StructuredData
        type="Organization"
        data={{
          name: 'Mongol Trail',
          url: 'https://www.mongoltrail.com',
          logo: 'https://www.mongoltrail.com/logo.png',
          sameAs: [
            'https://www.facebook.com/mongoltrail',
            'https://www.instagram.com/mongoltrail'
          ],
          priceRange: '$$-$$$',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ulaanbaatar',
            addressCountry: 'MN'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+976-99123456',
            contactType: 'customer service',
            areaServed: 'MN',
            availableLanguage: ['en', 'mn', 'de']
          },
          description: 'Mongol Trail is Mongolia\'s premier local tour operator offering authentic, sustainable Mongolia tours and custom travel experiences. Expert local guides, flexible itineraries, and responsible tourism.'
        }}
      />

      {/* WebSite Schema - Search Action */}
      <StructuredData
        type="WebSite"
        data={{
          name: 'Mongol Trail',
          url: 'https://www.mongoltrail.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.mongoltrail.com/packages?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      {/* TouristDestination Schema */}
      <StructuredData
        type="TouristDestination"
        data={{
          '@id': 'https://www.mongoltrail.com/#mongolia',
          name: 'Mongolia',
          description: 'Discover Mongolia\'s legendary landscapes, from the Gobi Desert to the Altai Mountains, with expert local guides from Mongol Trail.',
          touristType: ['Adventure Traveler', 'Cultural Explorer', 'Luxury Tourist'],
          includesAttraction: [
            {
              '@type': 'TouristAttraction',
              name: 'Gobi Desert',
              description: 'Mongolia\'s legendary southern desert featuring singing sand dunes, flaming cliffs, and unique wildlife.'
            },
            {
              '@type': 'TouristAttraction',
              name: 'Altai Mountains',
              description: 'Majestic mountain range in western Mongolia, home to eagle hunters and pristine alpine landscapes.'
            },
            {
              '@type': 'TouristAttraction',
              name: 'Orkhon Valley',
              description: 'UNESCO World Heritage Site and historical heart of the Mongol Empire, featuring ancient capitals and monasteries.'
            }
          ]
        }}
      />

      {/* FAQ Schema - Enhanced with all questions */}
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: (dict as any).faq?.questions?.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer
            }
          })) || []
        }}
      />

      {/* Load Hero independently */}
      <Suspense fallback={<div className="h-screen w-full bg-slate-900 animate-pulse" />}>
        <HeroWrapper lang={params.lang} />
      </Suspense>

      {/* Load Featured Trips independently */}
      <Suspense fallback={<div className="min-h-[800px] w-full flex items-center justify-center bg-slate-50 animate-pulse">Loading Trips...</div>}>
        <FeaturedTripsWrapper lang={params.lang} dictionary={dict.featured} />
      </Suspense>

      <WhyChooseUs />

      {/* Top Destinations Section */}
      <TopDestinations />

      <TripReviews />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}