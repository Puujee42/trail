"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, FaClock, FaStar, FaArrowRight, FaChild, FaUsers, 
  FaIceCream, FaCamera, FaSun
} from "react-icons/fa";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips"; // Import Type

/* ────────────────────── Constants ────────────────────── */
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "resort", label: "Амралтын газар" },
  { id: "theme_park", label: "Тоглоомын парк" },
  { id: "nature", label: "Байгаль" },
];

/* ────────────────────── Main Component ────────────────────── */
const FamilyPackagesList = ({ trips }: { trips: Trip[] }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = trips.filter(
    (trip) => activeTab === "all" || trip.category === activeTab
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden relative">
      
      {/* ────────────────── DECORATIVE BACKGROUND ────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-100/50 to-transparent pointer-events-none" />
      <FloatingIcon icon={FaSun} color="text-yellow-400" top="10%" left="5%" delay={0} />
      <FloatingIcon icon={FaIceCream} color="text-pink-400" top="15%" right="10%" delay={1} />
      <FloatingIcon icon={FaCamera} color="text-blue-400" top="30%" left="15%" delay={2} />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ────────────────── HERO SECTION ────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <FaUsers /> Гэр бүлийн багцууд
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black text-slate-800 mb-6 leading-tight"
          >
            Хайртай хүмүүстэйгээ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Нандин Дурсамж
            </span> бүтээгээрэй
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            Хүүхдэд ээлтэй, аюулгүй, хөгжилтэй хөтөлбөрүүд. Бид таны гэр бүлийн ая тухыг нэгдүгээрт тавина.
          </motion.p>
        </div>

        {/* ────────────────── FILTER TABS ────────────────── */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-white shadow-lg flex gap-1 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === cat.id ? "text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-md"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ────────────────── GRID LAYOUT ────────────────── */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filtered.map((trip) => (
              <FamilyCard key={trip._id} trip={trip} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
           <div className="text-center py-20 opacity-50">
              <p>Одоогоор энэ ангилалд аялал байхгүй байна.</p>
           </div>
        )}

      </div>
    </div>
  );
};

/* ────────────────────── HELPER COMPONENTS ────────────────────── */
const FloatingIcon = ({ icon: Icon, color, top, left, right, delay }: any) => (
  <motion.div
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 5, repeat: Infinity, delay: delay, ease: "easeInOut" }}
    className={`absolute text-4xl opacity-20 pointer-events-none ${color}`}
    style={{ top, left, right }}
  >
    <Icon />
  </motion.div>
);

const FamilyCard = ({ trip }: { trip: Trip }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100 overflow-hidden flex flex-col h-full transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <Link href={`/tours/${trip._id}`}>
           <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
           <img 
             src={trip.image} 
             alt={trip.title} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
        </Link>

        {trip.ageGroup && (
          <div className="absolute top-4 left-4 z-20">
             <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
               <FaChild className="text-orange-500" /> {trip.ageGroup}
             </span>
          </div>
        )}

        {trip.featured && (
           <div className="absolute top-4 right-4 z-20">
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                HOT
              </span>
           </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
              <FaStar /> {trip.rating}
           </div>
           <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
              <FaClock /> {trip.duration}
           </span>
        </div>

        <Link href={`/tours/${trip._id}`}>
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors">
            {trip.title}
          </h3>
        </Link>

        <p className="flex items-center gap-2 text-slate-500 text-sm mb-4">
           <FaMapMarkerAlt className="text-orange-400" /> {trip.location}
        </p>

        {/* Perks Grid */}
        <div className="flex flex-wrap gap-2 mb-6">
           {trip.perks?.map((perk, i) => (
             <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
               {perk}
             </span>
           ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <div>
              <p className="text-xs text-slate-400 font-semibold mb-0.5">Нэг хүний</p>
              <p className="text-lg font-black text-slate-900">{trip.price.toLocaleString()}₮</p>
           </div>
           
           <Link href={`/tours/${trip._id}`}>
             <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-orange-200">
                <FaArrowRight className="text-sm -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
             </button>
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyPackagesList;