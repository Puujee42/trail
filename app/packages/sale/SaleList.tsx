"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFire, 
  FaClock, 
  FaTag, 
  FaArrowRight, 
  FaPercentage,
  FaCalendarAlt,
  FaPlaneDeparture
} from "react-icons/fa";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips";

/* ────────────────────── Constants ────────────────────── */
const monthNames = [
  "1-р сарын", "2-р сарын", "3-р сарын", "4-р сарын", "5-р сарын", "6-р сарын",
  "7-р сарын", "8-р сарын", "9-р сарын", "10-р сарын", "11-р сарын", "12-р сарын"
];

/* ────────────────────── Main Component ────────────────────── */
const SaleList = ({ trips }: { trips: Trip[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [filter, setFilter] = useState<"current" | "all">("current");

  // Filter Logic: Show sales relevant to current month vs All sales
  const filteredTrips = trips.filter(trip => {
    // If filtering by current month, check if trip has specific sale month or if it's a general sale
    if (filter === "current") {
        // If trip has a specific saleMonth, match it. If not, include it in all sales.
        return trip.saleMonth === undefined || trip.saleMonth === currentMonth;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden relative">
      
      {/* ────────────────── DYNAMIC BACKGROUND ────────────────── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-[80px] pointer-events-none -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ────────────────── HERO HEADER ────────────────── */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 text-white text-sm font-bold uppercase tracking-widest mb-6 shadow-lg shadow-red-500/30"
          >
            <FaFire className="animate-pulse" /> Limited Time Offers
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-none"
          >
            {monthNames[currentMonth]} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              ОНЦГОЙ ХЯМДРАЛ
            </span>
          </motion.h1>

          {/* Filter Toggles */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
                onClick={() => setFilter("current")}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'current' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
                Энэ сарын хямдрал
            </button>
            <button 
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
                Бүх хямдралууд
            </button>
          </div>
        </div>

        {/* ────────────────── SALE GRID ────────────────── */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredTrips.map((trip) => (
              <SaleCard key={trip._id} trip={trip} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <FaTag className="text-4xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Одоогоор хямдрал алга</h3>
              <p className="text-slate-500">Дараа сарын хямдралыг хүлээгээрэй!</p>
           </div>
        )}

      </div>
    </div>
  );
};

/* ────────────────────── SALE CARD COMPONENT ────────────────────── */
const SaleCard = ({ trip }: { trip: Trip }) => {
  // Calculate Discount
  const discountPercent = trip.oldPrice 
    ? Math.round(((trip.oldPrice - trip.price) / trip.oldPrice) * 100) 
    : 0;

  const saveAmount = trip.oldPrice ? trip.oldPrice - trip.price : 0;

  // Fake "Seats Left" logic if not in DB, strictly for visual demo
  const seatsLeft = trip.seatsLeft || Math.floor(Math.random() * 5) + 2;
  const totalSeats = 20;
  const progress = ((totalSeats - seatsLeft) / totalSeats) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-red-200/50 border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 relative"
    >
      {/* ─── IMAGE SECTION ─── */}
      <div className="relative h-64 overflow-hidden">
        <Link href={`/tours/${trip._id}`}>
           <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
           <img 
             src={trip.image} 
             alt={trip.title} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
        </Link>

        {/* Discount Badge - Top Left */}
        <div className="absolute top-0 left-0 z-20 bg-red-600 text-white px-4 py-2 rounded-br-2xl shadow-lg">
           <div className="flex items-center gap-1 font-black text-lg">
             <FaPercentage /> {discountPercent} OFF
           </div>
        </div>

        {/* Timer/Month Badge - Top Right */}
        <div className="absolute top-4 right-4 z-20">
           <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
             <FaClock className="text-orange-500" /> {trip.duration}
           </span>
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <div className="p-6 flex flex-col flex-grow relative">
        
        {/* Urgency Bar */}
        <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                <span>Борлуулалт</span>
                <span className="text-red-500">Сүүлийн {seatsLeft} суудал!</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>

        <Link href={`/tours/${trip._id}`}>
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-red-600 transition-colors">
            {trip.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 flex items-center gap-2 mb-6">
            <FaPlaneDeparture className="text-slate-300" /> {trip.location}
        </p>

        {/* Pricing Area */}
        <div className="mt-auto bg-red-50 p-4 rounded-xl border border-red-100">
           <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-red-400 font-bold uppercase">Та хэмнэнэ:</span>
              <span className="text-xs text-slate-400 line-through font-medium">
                {trip.oldPrice?.toLocaleString()}₮
              </span>
           </div>
           
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-red-500 bg-white px-2 py-0.5 rounded border border-red-100">
                 -{saveAmount.toLocaleString()}₮
              </span>
              <span className="text-2xl font-black text-slate-900">
                {trip.price.toLocaleString()}₮
              </span>
           </div>
        </div>

        <div className="mt-4">
             <Link href={`/tours/${trip._id}`}>
               <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                  Захиалах <FaArrowRight />
               </button>
             </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default SaleList;