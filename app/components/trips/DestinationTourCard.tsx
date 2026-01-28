"use client";

import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaClock, FaStar, FaArrowRight } from "react-icons/fa";
import { Trip } from "@/lib/mongo/trips";

export default function DestinationTourCard({ trip, lang }: { trip: Trip, lang: "en" | "mn" | "ko" }) {
    // Price formatting helper
    const getLocalizedPrice = (priceObj: any) => {
        if (typeof priceObj === 'number') return priceObj;
        if (typeof priceObj === 'object' && priceObj !== null) {
            return priceObj[lang] || priceObj.mn || 0;
        }
        return 0;
    };

    const adultPrice = getLocalizedPrice(trip.priceAdult) || getLocalizedPrice(trip.price);
    const formattedPrice = lang === 'en' ? `$${adultPrice.toLocaleString()}` :
        lang === 'ko' ? `₩${adultPrice.toLocaleString()}` :
            `${adultPrice.toLocaleString()}₮`;

    return (
        <Link href={`/${lang}/tours/${trip._id}`} className="group block h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 border border-slate-100 h-full flex flex-col">

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={trip.image || "/try.png"}
                        alt={trip.title[lang] || trip.title.en}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                    <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {trip.category}
                        </span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                        {formattedPrice}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                            {trip.title[lang] || trip.title.en}
                        </h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 flex-shrink-0 ml-2">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs font-bold text-yellow-700">{trip.rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                        <div className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-sky-400" />
                            <span className="truncate max-w-[100px]">{trip.location[lang] || trip.location.en}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <div className="flex items-center gap-1.5">
                            <FaClock className="text-sky-400" /> {trip.duration[lang] || trip.duration.en}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex gap-2">
                            {trip.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-colors">
                            <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
