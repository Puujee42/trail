import { getTripById } from "@/lib/mongo/trips";
import TourProductEditor from "./TourProductEditor";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const trip = await getTripById(id);

    return {
        title: `Editing ${trip?.title?.en || 'Tour'} | Portfolio Editor`,
    };
}

export default async function EditTourPage(props: { params: Promise<{ id: string, lang: string }> }) {
    const params = await props.params;
    const trip = await getTripById(params.id);

    if (!trip) {
        notFound();
    }

    // Populate default state for new features if missing in DB
    const initialData = {
        ...trip,
        itinerary: trip.itinerary || [
            {
                day: 1,
                title: { en: "The Grand Arrival", mn: "", ko: "" },
                desc: { en: "Touching down in Ulaanbaatar, the portal to the nomad life...", mn: "", ko: "" },
                accommodation: "Hotel 4*",
                meals: { B: false, L: false, D: true }
            }
        ],
        faqs: [
            {
                question: { en: "What is the best time for photography?" },
                answer: { en: "Golden hour in the Gobi desert during late August provides unparalleled light contrast." }
            }
        ],
        inclusions: ["All intra-Mongolia transportation", "English-speaking photography guide", "4* Hotel accommodation"],
        exclusions: ["International airfare", "Travel insurance", "Personal expenses"],
        seasonStart: "2025-06-01",
        seasonEnd: "2025-09-20",
        bookingStatus: "accepting",
        baseCost: 1500,
        margin: 20
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]/50 py-12">
            <TourProductEditor initialData={initialData} />
        </div>
    );
}
