import React from "react";
import { getAllTrips } from "@/lib/mongo/trips";
import { getAllDepartures } from "@/lib/mongo/departures";
import { format, parseISO, startOfMonth } from "date-fns";
import { Calendar, Users, ChevronRight, Info } from "lucide-react";
import Link from "next/link";

export default async function TourCalendarPage({ params: { lang } }: { params: { lang: string } }) {
    const trips = await getAllTrips();
    const allDepartures = await getAllDepartures();

    // Group departures by month/year
    const groupedDepartures: { [key: string]: any[] } = {};

    allDepartures.forEach(dep => {
        const date = parseISO(dep.start_date);
        const monthKey = format(date, "yyyy MMMM").toUpperCase();

        // Find corresponding trip for display info
        const trip = trips.find(t => t._id === dep.trip_id);
        if (trip) {
            if (!groupedDepartures[monthKey]) groupedDepartures[monthKey] = [];
            groupedDepartures[monthKey].push({ ...dep, trip });
        }
    });

    const monthKeys = Object.keys(groupedDepartures).sort();

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-24 font-sans text-[#2C362B]">
            {/* Hero Section */}
            <section className="bg-[#4B5E4A] text-white py-24 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="uppercase tracking-[0.3em] text-xs font-bold opacity-80 mb-4 block">Travel Season 2026/2027</span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Mongolia Tour Calendar</h1>
                    <p className="max-w-2xl mx-auto text-lg opacity-80 font-serif italic">
                        "Experience the vast landscapes and nomadic traditions of Mongolia."
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            </section>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 space-y-20">
                {/* 1. Private Tours Section */}
                <section>
                    <div className="bg-white rounded-[40px] shadow-xl border border-[#E8E2D9] overflow-hidden">
                        <div className="p-10 border-b border-[#FDFBF7] bg-white">
                            <h2 className="text-3xl font-serif mb-2">Mongolia Private Tours 2026/2027</h2>
                            <p className="text-slate-500 font-serif italic">Flexibility to choose your own travel dates.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FDFBF7]">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Trip Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Days</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Availability</th>
                                        <th className="px-6 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E2D9]/50">
                                    {trips.filter(t => t.season_availability).map((trip) => (
                                        <tr key={trip._id} className="hover:bg-[#FDFBF7]/80 transition-colors group">
                                            <td className="px-10 py-6 font-bold text-lg">
                                                <Link href={`/${lang}/tours/${trip._id}`}>{trip.title[lang === 'ko' ? 'ko' : 'en']}</Link>
                                            </td>
                                            <td className="px-6 py-6 text-center font-serif italic text-slate-400">
                                                {trip.duration[lang === 'ko' ? 'ko' : 'en']}
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="px-4 py-1.5 bg-[#4B5E4A]/10 text-[#4B5E4A] rounded-full text-xs font-bold whitespace-nowrap">
                                                    {trip.season_availability}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <Link href={`/${lang}/tours/${trip._id}`} className="p-3 text-[#D2B48C] group-hover:translate-x-1 transition-transform inline-block">
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 2. Small-Group Departures Section */}
                <section className="space-y-10">
                    <header className="text-center">
                        <span className="inline-block p-2 bg-[#D2B48C]/10 rounded-2xl mb-4">
                            <Users size={32} className="text-[#D2B48C]" />
                        </span>
                        <h2 className="text-4xl font-serif">Mongolia Small-Group Departures</h2>
                        <p className="text-slate-500 max-w-xl mx-auto mt-2 italic font-serif">Fixed-date expeditions with guaranteed departures.</p>
                    </header>

                    <div className="space-y-12">
                        {monthKeys.map((monthKey) => (
                            <div key={monthKey} className="space-y-6">
                                <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-[#4B5E4A] ml-2 flex items-center gap-3">
                                    <Calendar size={18} /> {monthKey}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupedDepartures[monthKey].map((dep, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[36px] border border-[#E8E2D9] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                                    {dep.trip.duration.en} Discovery
                                                </span>
                                                <Link href={`/${lang}/tours/${dep.trip_id}`} className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#D2B48C] group-hover:bg-[#D2B48C] group-hover:text-white transition-colors">
                                                    <ChevronRight size={18} />
                                                </Link>
                                            </div>
                                            <h4 className="text-xl font-serif mb-4 line-clamp-2 leading-snug">
                                                {dep.trip.title.en}
                                            </h4>
                                            <div className="pt-6 border-t border-[#E8E2D9]/50 flex justify-between items-center text-sm">
                                                <span className="font-bold flex items-center gap-2">
                                                    <Calendar size={14} className="opacity-40" />
                                                    {format(parseISO(dep.start_date), "dd MMM")} - {format(parseISO(dep.end_date), "dd MMM")}
                                                </span>
                                                <span className={`font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${dep.status === 'Sold Out' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                    {dep.status === 'Sold Out' ? 'Sold Out' : 'Check Availability'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Booking Notice */}
                <section className="bg-[#2C362B] rounded-[40px] p-12 text-white text-center relative overflow-hidden">
                    <div className="max-w-2xl mx-auto relative z-10">
                        <Info className="mx-auto mb-6 opacity-40" size={48} />
                        <h3 className="text-3xl font-serif mb-4">Can't find your dates?</h3>
                        <p className="opacity-80 font-serif italic mb-8">
                            We specialize in tailor-made expeditions. If our scheduled departures don't align with your plans, our travel designers will create a custom itinerary for you.
                        </p>
                        <Link href={`/${lang}/contact`} className="inline-block px-12 py-4 bg-[#D2B48C] text-white rounded-full font-bold hover:bg-[#b89a74] transition-all shadow-lg text-sm uppercase tracking-widest">
                            Request Custom Itinerary
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
