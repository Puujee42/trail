import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from 'next';
import { getDestinationBySlug } from "@/lib/mongo/destinations";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getDictionary } from "@/get-dictionary";
import DestinationTourCard from "@/app/components/trips/DestinationTourCard";
import { Locale } from "@/i18n-config";

interface PageProps {
    params: Promise<{
        slug: string;
        lang: Locale;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const destination = await getDestinationBySlug(slug);

    if (!destination) return {};

    const title = `${destination.name[lang]} Tours & Travel Guide | Mongol Trail`;
    const description = `Explore ${destination.name[lang]} with Mongol Trail. Discover the best tours, hiking trails, and adventures in ${destination.name[lang]}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: destination.images,
        }
    };
}

export default async function DestinationPage({ params }: PageProps) {
    const { slug, lang } = await params;
    const destination = await getDestinationBySlug(slug);

    if (!destination) {
        return notFound();
    }

    // Schema for Place + FAQ
    const placeSchema = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: destination.name[lang],
        description: destination.description[lang],
        image: destination.images,
        url: `https://www.mongoltrail.com/${lang}/destinations/${slug}`,
        touristType: ["Adventure Travel", "Cultural Tourism"],
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <Image
                    src={destination.images[0] || '/hero-main.jpg'}
                    alt={destination.name[lang]}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-sky-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base animate-fade-in-up">
                        Destinations
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                        {destination.name[lang]}
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-slate-100 font-medium leading-relaxed drop-shadow-md">
                        {destination.description[lang]?.slice(0, 160)}...
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-16 max-w-7xl">

                {/* Intro */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                        About {destination.name[lang]}
                    </h2>
                    <div className="prose prose-lg prose-slate mx-auto text-slate-600">
                        <p>{destination.description[lang]}</p>
                    </div>
                </div>

                {/* Tours Grid */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Tours visiting <span className="text-sky-600">{destination.name[lang]}</span>
                        </h2>
                        <span className="bg-sky-100 text-sky-700 font-bold px-4 py-2 rounded-full text-sm">
                            {destination.tours.length} Experiences
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destination.tours.map(trip => (
                            <DestinationTourCard key={trip._id} trip={trip} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* FAQ Placeholder (For Phase 2 Content Expansion) */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                        Zero-Click Answers
                    </h3>
                    <div className="space-y-6">
                        <details className="group border-b border-slate-100 pb-4">
                            <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center text-lg">
                                Best time to visit {destination.name[lang]}?
                                <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                The best time to visit {destination.name[lang]} is typically from June to September when the weather is mild and conducive to outdoor activities.
                            </p>
                        </details>
                        {/* More auto-generated FAQs will go here */}
                    </div>
                </div>

            </div>
        </div>
    );
}
