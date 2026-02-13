"use client";

import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaClock, FaTachometerAlt, FaRoute } from "react-icons/fa";

interface TourCardProps {
  image: string;
  badge?: "Featured" | "New" | string;
  title: string;
  location: string;
  duration: string;
  difficulty: string;
  distance: string;
  price: string;
  link: string;
  lang?: string;
}

/**
 * TourCard - A minimalist, clean tour card component
 * Features: Badge, Image zoom on hover, 3-column indicators, Price & CTA
 */
export default function TourCard({
  image,
  badge,
  title,
  location,
  duration,
  difficulty,
  distance,
  price,
  link,
  lang = "mn"
}: TourCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 w-full max-w-sm">
      {/* Image Section with Zoom Effect */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image || "/try.png"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Top Left Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title & Location */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1.5 uppercase font-bold tracking-widest">
            <FaMapMarkerAlt className="text-blue-500" />
            {location}
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </div>

        {/* Visual Indicators (3 Columns) */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 mb-6">
          <div className="flex flex-col items-center text-center">
            <FaClock className="text-slate-300 mb-1.5 text-lg" />
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Хугацаа</span>
            <span className="text-xs font-bold text-slate-700">{duration}</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-slate-100">
            <FaTachometerAlt className="text-slate-300 mb-1.5 text-lg" />
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Түвшин</span>
            <span className="text-xs font-bold text-slate-700">{difficulty}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaRoute className="text-slate-300 mb-1.5 text-lg" />
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Зай</span>
            <span className="text-xs font-bold text-slate-700">{distance}</span>
          </div>
        </div>

        {/* Price & CTA Button */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Эхлэх үнэ</span>
            <span className="text-xl font-black text-slate-900">{price}</span>
          </div>
          <Link 
            href={link}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-blue-100 flex items-center gap-2"
          >
            {lang === 'mn' ? 'Дэлгэрэнгүй' : lang === 'ko' ? '자세히 보기' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
}
