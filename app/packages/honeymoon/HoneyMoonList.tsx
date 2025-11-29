"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, FaClock, FaHeart, FaArrowRight, FaGlassCheers, FaInfinity 
} from "react-icons/fa";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips"; // Import type

/* ────────────────────── Constants ────────────────────── */
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "island", label: "Арал & Далай" },
  { id: "city", label: "Романтик Хот" },
  { id: "luxury", label: "Тансаг Зэрэглэл" },
];

/* ────────────────────── Main Component ────────────────────── */
const HoneymoonList = ({ trips }: { trips: Trip[] }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = trips.filter(
    (trip) => activeTab === "all" || trip.category === activeTab
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-24 pb-20 overflow-hidden relative">
      
      {/* ────────────────── DREAMY BACKGROUND ────────────────── */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <FloatingElement icon={FaHeart} color="text-rose-400" top="15%" left="10%" size={30} delay={0} />
      <FloatingElement icon={FaGlassCheers} color="text-purple-400" top="20%" right="15%" size={40} delay={2} />
      <FloatingElement icon={FaInfinity} color="text-pink-300" bottom="30%" left="20%" size={50} delay={4} />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ────────────────── HERO SECTION ────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-sm"
          >
            <FaGlassCheers /> Бал сарын аялал
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-[900] text-slate-900 mb-6 leading-tight tracking-tight"
          >
            Хайрын түүхээ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 italic font-serif">
              Мөнхлөх Аялал
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Зөвхөн хосуудад зориулсан тансаг зэрэглэлийн багцууд. Лаатай оройн зоог, далайн эрэг дээрх үдэш, мартагдашгүй дурсамж.
          </motion.p>
        </div>

        {/* ────────────────── FILTER ────────────────── */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-xl rounded-full shadow-lg shadow-rose-100/50 border border-white/80 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === cat.id ? "text-white" : "text-rose-900/60 hover:text-rose-900"
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activeTabRose"
                    className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full shadow-md shadow-rose-300/50"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ────────────────── GRID ────────────────── */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence>
            {filtered.map((trip) => (
              <HoneymoonCard key={trip._id} trip={trip} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
           <div className="text-center py-20 opacity-50">
              <FaHeart className="text-4xl text-rose-300 mx-auto mb-4" />
              <p>Одоогоор энэ ангилалд аялал байхгүй байна.</p>
           </div>
        )}

      </div>
    </div>
  );
};

/* ────────────────────── HELPER COMPONENTS ────────────────────── */
const FloatingElement = ({ icon: Icon, color, top, bottom, left, right, size, delay }: any) => (
  <motion.div
    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 6, repeat: Infinity, delay: delay, ease: "easeInOut" }}
    className={`absolute ${color} pointer-events-none filter drop-shadow-sm`}
    style={{ top, bottom, left, right, fontSize: size }}
  >
    <Icon />
  </motion.div>
);

const HoneymoonCard = ({ trip }: { trip: Trip }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-rose-200/50 overflow-hidden flex flex-col h-full transition-all duration-500 relative"
    >
      <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-rose-100 transition-colors pointer-events-none z-30" />

      <div className="relative h-80 overflow-hidden">
        <Link href={`/tours/${trip._id}`}>
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-80" />
           <img 
             src={trip.image} 
             alt={trip.title} 
             className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
           />
        </Link>

        {trip.tag && (
          <div className="absolute top-5 left-5 z-20">
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
               {trip.tag}
             </span>
          </div>
        )}

        <div className="absolute bottom-5 right-5 z-20 text-right">
           <p className="text-white/80 text-xs font-medium mb-1">Хос багц (2 хүн)</p>
           <span className="bg-white/95 backdrop-blur text-rose-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
             {trip.price.toLocaleString()}₮
           </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
            <Link href={`/tours/${trip._id}`}>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2 leading-tight group-hover:text-rose-500 transition-colors">
                    {trip.title}
                </h3>
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FaMapMarkerAlt className="text-rose-400" /> {trip.location}
            </div>
        </div>

        <div className="space-y-3 mb-8">
           <div className="flex items-center justify-between text-sm border-b border-rose-50 pb-2">
              <span className="text-slate-500 flex items-center gap-2"><FaClock className="text-rose-300"/> Хугацаа</span>
              <span className="font-bold text-slate-700">{trip.duration}</span>
           </div>
           {trip.romanceFactor && (
            <div className="flex items-center justify-between text-sm border-b border-rose-50 pb-2">
                <span className="text-slate-500 flex items-center gap-2"><FaHeart className="text-rose-300"/> Романтик үнэлгээ</span>
                <span className="font-bold text-rose-500">{trip.romanceFactor}</span>
            </div>
           )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
           {trip.perks?.map((perk, i) => (
             <span key={i} className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
               {perk}
             </span>
           ))}
        </div>

        <div className="mt-auto">
           <Link href={`/tours/${trip._id}`}>
             <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-widest text-xs group-hover:bg-gradient-to-r group-hover:from-rose-400 group-hover:to-pink-500 transition-all shadow-lg hover:shadow-rose-300/50 flex items-center justify-center gap-2">
                Дэлгэрэнгүй <FaArrowRight />
             </button>
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HoneymoonList;