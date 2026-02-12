"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlaneDeparture,
  FaHeart,
  FaCheckCircle
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Trip } from "@/lib/mongo/trips";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Main Component ────────────────────── */
const FeaturedTrips = ({ trips, lang, dictionary }: { trips: Trip[], lang: string, dictionary: any }) => {
  const language = lang as "mn" | "en" | "ko"; // Use prop
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const xTitle = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityDesc = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  if (!trips || trips.length === 0) return null;

  const text = dictionary;

  return (
    <section ref={targetRef} className="py-24 bg-slate-50 relative overflow-hidden">

      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-100/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 px-4 md:px-0">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-3"
            >
              <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-sans">
                <FaPlaneDeparture className="text-slate-400" /> {text.bestOffer}
              </span>
            </motion.div>

            <motion.h2
              style={{ x: xTitle }}
              className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-none font-sans"
            >
              {text.titleMain} <span className="text-slate-500">{text.titleAccent}</span>
            </motion.h2>

            <motion.p
              style={{ opacity: opacityDesc }}
              className="text-slate-500 text-base md:text-lg font-medium max-w-lg font-sans"
            >
              {text.desc}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link href="/packages">
              <button className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="font-bold text-sm">
                  {text.viewAll}
                </span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ─── CAROUSEL SCROLL ─── */}
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-12 pt-4 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0">
          {trips.map((trip, i) => (
            <TripCard key={trip._id} trip={trip} index={i} language={language as "mn" | "en" | "ko"} />
          ))}
          <div className="min-w-[20px]" />
        </div>

      </div>
    </section>
  );
};

/* ────────────────────── 3D Tilt Card Component ────────────────────── */
const TripCard = ({ trip, index, language }: { trip: Trip, index: number, language: "mn" | "en" | "ko" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  // ────────────────── PRICE CALCULATION FIX ──────────────────
  // Helper to safely get price number
  const getLocalizedPrice = (priceObj: any) => {
    if (typeof priceObj === 'number') return priceObj;
    if (typeof priceObj === 'object' && priceObj !== null) {
      // @ts-ignore - Handle dynamic key access safely
      return priceObj[language] || priceObj.mn || 0;
    }
    return 0;
  };

  const adultPrice = getLocalizedPrice(trip.priceAdult) || getLocalizedPrice(trip.price);
  const salePrice = getLocalizedPrice(trip.salePrice);
  const hasDiscount = salePrice > 0 && salePrice < adultPrice;
  const finalPrice = hasDiscount ? salePrice : adultPrice;
  const discountPercentage = hasDiscount ? Math.round(((adultPrice - salePrice) / adultPrice) * 100) : 0;

  // Format based on currency
  const formattedPrice =
    language === 'en' ? `$${finalPrice.toLocaleString()}` :
      language === 'ko' ? `₩${finalPrice.toLocaleString()}` :
        `${finalPrice.toLocaleString()}₮`;
  // ──────────────────────────────────────────────────────────

  // Fallback image logic
  const imageSrc = trip.image && trip.image.trim() !== "" ? trip.image : "/try.png";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="min-w-[280px] w-[280px] md:min-w-[340px] snap-center relative group"
    >
      <div className="bg-white rounded-2xl p-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col relative z-10 overflow-hidden border border-slate-100">

        {/* 1. Image Container */}
        <div className="relative h-[200px] md:h-[240px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60" />

          <div className="absolute top-3 left-3 z-20 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-sans">
              {trip.category}
            </span>
          </div>

          <button className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all active:scale-90">
            <FaHeart size={12} />
          </button>

          {/* Glassmorphism Info Box */}
          <div className="absolute bottom-3 left-3 right-3 z-20">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                   <FaClock className="text-white/70" size={10} />
                   <span className="text-xs font-medium">{trip.duration[language] || trip.duration["mn"]}</span>
                </div>
                <div className="font-bold text-sm">
                   {formattedPrice}
                </div>
             </div>
          </div>

          <Image
            src={imageSrc}
            alt={`${trip.title[language] || trip.title["mn"]} - Mongol Trail Adventure`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* 2. Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 font-sans tracking-tight">
              {trip.title[language] || trip.title["mn"]}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-bold text-slate-700">{trip.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4 font-medium">
            <FaMapMarkerAlt className="text-slate-400" size={10} /> 
            {trip.location[language] || trip.location["mn"]}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedTrips;