import { getAllTrips, Trip } from "./trips";

export interface Destination {
    slug: string;
    name: {
        en: string;
        mn: string;
        ko: string;
    };
    description: {
        en: string;
        mn: string;
        ko: string;
    };
    images: string[];
    tours: Trip[];
    popularity: number; // How many tours visit this place
}

/**
 * Helper to normalize string to slug
 * e.g., "Gobi Desert" -> "gobi-desert"
 */
export function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Aggregates all unique destinations from all trips
 */
export async function getAllDestinations(): Promise<Destination[]> {
    const trips = await getAllTrips();
    const destinationsMap = new Map<string, Destination>();

    for (const trip of trips) {
        if (!trip.itinerary) continue;

        for (const item of trip.itinerary) {
            const enTitle = item.title.en;
            if (!enTitle) continue;

            const slug = slugify(enTitle);

            if (!destinationsMap.has(slug)) {
                destinationsMap.set(slug, {
                    slug,
                    name: {
                        en: item.title.en,
                        mn: item.title.mn || item.title.en,
                        ko: item.title.ko || item.title.en,
                    },
                    description: {
                        en: item.desc.en,
                        mn: item.desc.mn || item.desc.en,
                        ko: item.desc.ko || item.desc.en,
                    },
                    images: item.imageUrl ? [item.imageUrl] : (trip.image ? [trip.image] : []),
                    tours: [],
                    popularity: 0
                });
            }

            const dest = destinationsMap.get(slug)!;

            // Add tour if not already added
            if (!dest.tours.find(t => t._id === trip._id)) {
                dest.tours.push(trip);
                dest.popularity++;
            }

            // Collect more images if available
            if (item.imageUrl && !dest.images.includes(item.imageUrl)) {
                dest.images.push(item.imageUrl);
            }
        }
    }

    return Array.from(destinationsMap.values()).sort((a, b) => b.popularity - a.popularity);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
    const all = await getAllDestinations();
    return all.find(d => d.slug === slug) || null;
}
