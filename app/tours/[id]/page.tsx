import { getTripById } from "@/lib/mongo/trips";
import { notFound } from "next/navigation";
import TourDetailClient from "./TourDetailClient"; 
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) return {};

  const title = `${trip.title.en} | Mongol Trail`;
  const description = trip.description?.en || `Join our ${trip.title.en} tour. Explore ${trip.location.en} for ${trip.duration.en}. Book your adventure with Mongol Trail.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [trip.image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [trip.image],
    },
  };
}

export default async function TourPage({ params }: PageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    return notFound();
  }

  // JSON-LD for Tour/Product SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: trip.title.en,
    image: trip.image,
    description: trip.description?.en || trip.title.en,
    brand: {
      '@type': 'Brand',
      name: 'Mongol Trail',
    },
    offers: {
      '@type': 'Offer',
      price: typeof trip.price === 'number' ? trip.price : (trip.price?.en || 0),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://www.mongoltrail.com/tours/${id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: trip.rating || 5,
      reviewCount: 10,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.mongoltrail.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Packages',
        item: 'https://www.mongoltrail.com/packages',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: trip.title.en,
        item: `https://www.mongoltrail.com/tours/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TourDetailClient trip={trip} />
    </>
  );
}
