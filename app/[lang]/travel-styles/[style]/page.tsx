import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripsByType } from '@/lib/mongo/trips';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: Promise<{
        lang: Locale;
        style: string;
    }>;
}

// 1. Define supported styles locally for now (could be DB driven later)
// This also helps with SEO titles mapping
const STYLE_MAPPING: Record<string, { title: string; desc: string; keywords: string[] }> = {
    'family': {
        title: 'Mongolia Travel for Families',
        desc: 'Discover family-friendly Mongolia tours. Safe, comfortable, and educational adventures designed for kids and parents.',
        keywords: ['Mongolia family travel', 'kids tours mongolia', 'safe family vacation mongolia']
    },
    'photography': {
        title: 'Mongolia Travel Photography Tours',
        desc: 'Capture the majestic landscapes of Mongolia. Guided photography expeditions to the Gobi, Altai, and Eagle Festival.',
        keywords: ['Mongolia photography tour', 'landscape photography mongolia', 'eagle festival photography']
    },
    'honeymoon': {
        title: 'Romantic Mongolia Honeymoons',
        desc: 'Unforgettable romantic getaways in luxury yurts under the stars. The perfect unique honeymoon destination.',
        keywords: ['Mongolia honeymoon', 'luxury ger camp', 'romantic adventure travel']
    },
    'solo': {
        title: 'Solo Travel Groups in Mongolia',
        desc: 'Join small group tours perfect for solo travelers. Meet like-minded adventurers in the safest country in Asia.',
        keywords: ['solo travel mongolia', 'group tours for singles', 'backpacking mongolia']
    }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, style } = await params;
    const styleData = STYLE_MAPPING[style];

    if (!styleData) return { title: 'Travel Style Not Found' };

    return {
        title: `${styleData.title} | Mongol Trail`,
        description: styleData.desc,
        keywords: styleData.keywords,
        alternates: {
            canonical: `https://www.mongoltrail.com/${lang}/travel-styles/${style}`
        }
    };
}

export default async function TravelStylePage({ params }: PageProps) {
    const { lang, style } = await params;
    const styleData = STYLE_MAPPING[style];

    if (!styleData) return notFound();

    // Fetch trips matching the style type
    // Note: ensure your DB 'type' field matches these keys (family, honeymoon, solo). 
    // If not, map them here.
    const trips = await getTripsByType(style);

    const breadcrumbs = [
        { label: 'Travel Styles', href: `/${lang}/packages` }, // Fallback parent
        { label: styleData.title, href: `/${lang}/travel-styles/${style}` }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <Breadcrumbs items={breadcrumbs} lang={lang} />

                <header className="mb-12 text-center max-w-3xl mx-auto">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Curated Collections</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        {styleData.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        {styleData.desc}
                    </p>
                </header>

                {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip) => (
                            <Link
                                href={`/${lang}/tours/${trip._id}`}
                                key={trip._id}
                                className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={trip.image}
                                        alt={trip.title[lang] || trip.title.en}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {trip.featured && (
                                        <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {trip.title[lang] || trip.title.en}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span>{trip.duration[lang] || trip.duration.en}</span>
                                        <span>•</span>
                                        <span>{trip.location[lang] || trip.location.en}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Starting from</p>
                                            <p className="text-2xl font-black text-slate-900">
                                                ${typeof trip.price === 'number' ? trip.price : (trip.price[lang] || trip.price.en)}
                                            </p>
                                        </div>
                                        <span className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No tours found for this style yet.</h3>
                        <p className="text-slate-500 mb-6">Our team is curating new adventures. Check back soon.</p>
                        <Link href={`/${lang}/custom-trip`} className="text-blue-600 font-bold hover:underline">
                            Request a Custom {style} Trip &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
