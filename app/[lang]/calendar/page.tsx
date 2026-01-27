import React from "react";
import { Calendar, Users, MapPin, ChevronRight, Info } from "lucide-react";

const privateTours = [
    { name: "Genghis Khan Statue Complex – Terelj National Park Tour", days: 1, availability: "Year around" },
    { name: "Day Trip: Hustai National Park (Wild Horse Park)", days: 1, availability: "Year around" },
    { name: "National Parks Around UB - 2 days Tour", days: 2, availability: "Year around" },
    { name: "National Parks Around UB - 3 days tour", days: 3, availability: "Year around" },
    { name: "Khuvsgul Lake Short Tour", days: 3, availability: "10 Jun -10 Sep" },
    { name: "Gobi Desert Short Tour - 4 days", days: 4, availability: "1 Jun - 10 Sep" },
    { name: "Highlights of Central Mongolia", days: 7, availability: "10 May - 01 Oct" },
    { name: "Gobi Desert Classic Tour", days: 7, availability: "01 Jun - 15 Sep" },
    { name: "Mongolia Highglights - 7 days Muslim Tour", days: 7, availability: "01 Jun - 20 Sep" },
    { name: "Mongolia, Nomadic by Nature", days: 8, availability: "01 Jun - 15 Sep" },
    { name: "Highlights of Mongolian Winter", days: 8, availability: "1 Nov - 1 Apr" },
    { name: "Eastern Mongolia & Birthplace of Genghis Khan", days: 9, availability: "01 Jun - 15 Sep" },
    { name: "Signature of Mongolia 10 days tour", days: 10, availability: "25 Jun - 10 Sep" },
    { name: "Taste of Mongolia (Northern & Central Mongolia)", days: 12, availability: "10 June - 20 Sep" },
    { name: "Treasures of Mongolia (Southern & Central Mongolia)", days: 14, availability: "25 May - 25 Sep" },
    { name: "Golden Circle (Southern, Central & Northern Mongolia)", days: 18, availability: "01 Jun - 15 Sep" },
];

const departures = [
    {
        month: "2026 MARCH - Winter season", tours: [
            { name: "Mongolia Winter Tour & Spring Golden Eagle Festival 2024", days: 9, date: "06 Mar - 13 Mar", space: "Check availability" }
        ]
    },
    {
        month: "2026 JUNE - SUMMER SEASON", tours: [
            { name: "Best of Mongolia -11 days Tour", days: 11, date: "18 Jun- 28 Jun", space: "Check availability" },
            { name: "Mongolia Golden Circle Discovery - 15 days Tour", days: 15, date: "10 Jun- 24 Jun", space: "Check availability" },
            { name: "Mongolia Golden Circle & Naadam Festival - 16 days Tour", days: 16, date: "29 Jun- 14 Jul", space: "Check availability" }
        ]
    },
    {
        month: "2026 JULY - SUMMER & HIGH SEASON", tours: [
            { name: "Naadam Festival & National Parks Around UB", days: 7, date: "09 Jul -15 Jul", space: "Check availability" },
            { name: "Naadam Festival & Gobi Desert Classic Tour", days: 8, date: "10 Jul -17 Jul", space: "Check availability" },
            { name: "Naadam Festival & Khovsgol Lake Tour", days: 8, date: "06 Jul -13 Jul", space: "Check availability" },
            { name: "Naadam Festival & Gobi Desert + National Parks", days: 10, date: "08 Jul -17 Jul", space: "Check availability" },
            { name: "Naadam Festival & Mongolia, Nomadic by Nature", days: 10, date: "10 Jul -19 Jul", space: "Check availability" },
            { name: "Naadam Festival & Best of Mongolia", days: 11, date: "02 Jul - 12 Jul", space: "Check availability" },
            { name: "Naadam Festival & Best of Mongolia -II", days: 11, date: "10 Jul - 19 Jul", space: "Check availability" },
            { name: "Naadam Festival & Highlights of Mongolia", days: 13, date: "09 Jul - 21 Jul", space: "Check availability" },
            { name: "Naadam Festival & Signature of Mongolia", days: 14, date: "06 Jul - 19 Jul", space: "Check availability" },
            { name: "Mongolia Golden Circle Discovery - 15 days tour", days: 15, date: "15 Jul - 29 Jul", space: "Check availability" },
            { name: "Best of Mongolia 11 days tour", days: 11, date: "23 Jul - 02 Aug", space: "Check availability" },
        ]
    },
    {
        month: "2026 AUGUST - Summer & High Season", tours: [
            { name: "Mongolia Golden Circle Discovery -15 days tour", days: 15, date: "05 Aug - 19 Aug", space: "Check availability" },
            { name: "Best of Mongolia 11 days tour", days: 11, date: "27 Aug - 06 Sep", space: "Check availability" },
        ]
    },
    {
        month: "2026 SEP & OCT – Autumn & Shoulder Season", tours: [
            { name: "Best of Mongolia 11 days tour", days: 11, date: "07 Sep - 17 Sep", space: "Check availability" },
            { name: "Mongolia & Golden Eagle Festival 2024 - 9 days tour", days: 9, date: "29 Sep - 07 Oct", space: "Check availability" },
            { name: "Mongolia & Golden Eagle Festival 2024- 9 days tour", days: 9, date: "28 Sep - 06 Oct", space: "Check availability" },
        ]
    }
];

export default function CalendarPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-24 font-sans text-[#2C362B]">
            {/* Hero Section */}
            <section className="bg-[#4B5E4A] text-white py-24 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="uppercase tracking-[0.3em] text-xs font-bold opacity-80 mb-4 block">Travel Season 2025/2026</span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Mongolia Tour Calendar</h1>
                    <p className="max-w-2xl mx-auto text-lg opacity-80 font-serif italic">
                        "The desert is a natural extension of the inner silence of the soul."
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D2B48C]/10 rounded-full blur-3xl -ml-32 -mb-32" />
            </section>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 space-y-20">

                {/* 1. Private Tours Section */}
                <section>
                    <div className="bg-white rounded-[40px] shadow-xl border border-[#E8E2D9] overflow-hidden">
                        <div className="p-10 border-b border-[#FDFBF7] bg-white">
                            <h2 className="text-3xl font-serif mb-2">Private Journeys</h2>
                            <p className="text-slate-500 font-serif italic">Flexibility to choose your own travel dates.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FDFBF7]">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Mongolia Private Tours</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Days</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Availability</th>
                                        <th className="px-6 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E2D9]/50">
                                    {privateTours.map((tour, i) => (
                                        <tr key={i} className="hover:bg-[#FDFBF7]/80 transition-colors group">
                                            <td className="px-10 py-6 font-bold text-lg">{tour.name}</td>
                                            <td className="px-6 py-6 text-center font-serif italic text-slate-400">{tour.days}</td>
                                            <td className="px-10 py-6">
                                                <span className="px-4 py-1.5 bg-[#4B5E4A]/10 text-[#4B5E4A] rounded-full text-xs font-bold whitespace-nowrap">
                                                    {tour.availability}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <button className="p-3 text-[#D2B48C] group-hover:translate-x-1 transition-transform">
                                                    <ChevronRight size={20} />
                                                </button>
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
                        <h2 className="text-4xl font-serif">Small-Group Departures</h2>
                        <p className="text-slate-500 max-w-xl mx-auto mt-2 italic font-serif">Fixed-date expeditions with guaranteed departures.</p>
                    </header>

                    <div className="space-y-12">
                        {departures.map((group, idx) => (
                            <div key={idx} className="space-y-6">
                                <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-[#4B5E4A] ml-2 flex items-center gap-3">
                                    <Calendar size={18} /> {group.month}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {group.tours.map((tour, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[36px] border border-[#E8E2D9] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{tour.days} Days Discovery</span>
                                                <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#D2B48C] group-hover:bg-[#D2B48C] group-hover:text-white transition-colors">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-serif mb-4 line-clamp-2 leading-snug">{tour.name}</h4>
                                            <div className="pt-6 border-t border-[#E8E2D9]/50 flex justify-between items-center text-sm">
                                                <span className="font-bold flex items-center gap-2"><Calendar size={14} className="opacity-40" /> {tour.date}</span>
                                                <span className="text-maroon-800 font-bold bg-red-50 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">{tour.space}</span>
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
                        <button className="px-12 py-4 bg-[#D2B48C] text-white rounded-full font-bold hover:bg-[#b89a74] transition-all shadow-lg text-sm uppercase tracking-widest">
                            Request Custom Itinerary
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                </section>
            </div>
        </div>
    );
}
