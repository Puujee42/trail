"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar, 
  FaArrowRight, 
  FaHiking,
  FaBeer,
  FaCameraRetro,
  FaLaptop,
  FaUserAstronaut,
  FaCompass
} from "react-icons/fa";
import Link from "next/link";

/* ────────────────────── Mock Data: Solo Packages ────────────────────── */
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "adventure", label: "Адал Явалт" },
  { id: "party", label: "Party & Social" },
  { id: "nomad", label: "Digital Nomad" },
];

const soloTrips = [
  {
    id: 1,
    title: "Тайланд - Backpacking Tour",
    category: "party",
    location: "Бангкок & Ко-Панган",
    duration: "10 Өдөр",
    rating: 4.8,
    price: 2800000,
    image: "/thailand-solo.jpg", // Replace with real image
    vibe: "High Energy",
    tags: ["Hostel Life", "Full Moon Party"],
    socialScore: 95
  },
  {
    id: 2,
    title: "Вьетнам - Мото Аялал",
    category: "adventure",
    location: "Ха-Жанг, Вьетнам",
    duration: "7 Өдөр",
    rating: 4.9,
    price: 3100000,
    image: "/vietnam.jpg",
    vibe: "Adrenaline",
    tags: ["Мотоцикл", "Уулс"],
    socialScore: 80
  },
  {
    id: 3,
    title: "Бали - Coworking & Surf",
    category: "nomad",
    location: "Чангу, Бали",
    duration: "14 Өдөр",
    rating: 4.7,
    price: 4500000,
    image: "/bali-nomad.jpg",
    vibe: "Chill & Work",
    tags: ["High WiFi", "Сёрфинг"],
    socialScore: 70
  },
  {
    id: 4,
    title: "Европ - Галт тэрэгний аялал",
    category: "party",
    location: "Берлин - Прага - Будапешт",
    duration: "9 Өдөр",
    rating: 4.9,
    price: 5800000,
    image: "/eurotrip.jpg",
    vibe: "History & Bar",
    tags: ["Eurail Pass", "Pub Crawl"],
    socialScore: 90
  },
  {
    id: 5,
    title: "Монгол - Алтай Таван Богд",
    category: "adventure",
    location: "Баян-Өлгий, Монгол",
    duration: "6 Өдөр",
    rating: 5.0,
    price: 850000,
    image: "/altai.jpg",
    vibe: "Extreme",
    tags: ["Ууланд алхах", "Кемпинг"],
    socialScore: 85
  },
  {
    id: 6,
    title: "Япон - Ганцаарчилсан Аялал",
    category: "nomad",
    location: "Токио & Осака",
    duration: "7 Өдөр",
    rating: 4.8,
    price: 3900000,
    image: "/japan-solo.jpg",
    vibe: "Explore",
    tags: ["Капсул зочид буудал", "Рамен"],
    socialScore: 60
  }
];

const SoloPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = soloTrips.filter(
    (trip) => activeTab === "all" || trip.category === activeTab
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-24 pb-20 overflow-hidden relative">
      
      {/* ────────────────── DARK MODE ATMOSPHERE ────────────────── */}
      {/* Mesh Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

      {/* Floating Elements */}
      <FloatingIcon icon={FaCompass} color="text-teal-400" top="15%" left="10%" size={40} delay={0} />
      <FloatingIcon icon={FaUserAstronaut} color="text-indigo-400" top="20%" right="15%" size={50} delay={2} />
      <FloatingIcon icon={FaCameraRetro} color="text-lime-400" bottom="30%" left="20%" size={30} delay={4} />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ────────────────── HERO SECTION ────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-none border border-teal-500/50 bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-[0.3em] mb-6"
          >
            <FaHiking /> Solo Traveler Club
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Өөрийгөө <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500">
              Нээх Аялал
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Ганцаараа аялана гэдэг ганцаардахын нэр биш. Шинэ найзууд, эрх чөлөө, адал явдал таныг хүлээж байна.
          </motion.p>
        </div>

        {/* ────────────────── MODERN TABS ────────────────── */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-1.5 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === cat.id ? "text-slate-900" : "text-slate-400 hover:text-white"
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activeTabSolo"
                    className="absolute inset-0 bg-teal-400 rounded-lg shadow-[0_0_20px_rgba(45,212,191,0.5)]"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ────────────────── CARD GRID ────────────────── */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filtered.map((trip) => (
              <SoloCard key={trip.id} trip={trip} />
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

// 1. Floating Icons
const FloatingIcon = ({ icon: Icon, color, top, bottom, left, right, size, delay }: any) => (
  <motion.div
    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 7, repeat: Infinity, delay: delay, ease: "linear" }}
    className={`absolute ${color} opacity-40 pointer-events-none`}
    style={{ top, bottom, left, right, fontSize: size }}
  >
    <Icon />
  </motion.div>
);

// 2. Solo Trip Card (Cyberpunk / Modern Style)
const SoloCard = ({ trip }: { trip: any }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-300 relative shadow-2xl"
    >
      {/* Image Area */}
      <div className="relative h-72 overflow-hidden">
        <Link href={`/packages/solo/${trip.id}`}>
           <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-teal-900/20 transition-colors z-10 mix-blend-overlay" />
           <img 
             src={trip.image} 
             alt={trip.title} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0"
           />
        </Link>

        {/* Vibe Badge */}
        <div className="absolute top-4 left-4 z-20">
           <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-none uppercase tracking-wider flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${trip.vibe === 'High Energy' ? 'bg-red-500' : 'bg-teal-400'} animate-pulse`}></span>
             {trip.vibe}
           </span>
        </div>

        {/* Social Score (Unique to Solo) */}
        <div className="absolute bottom-0 right-0 z-20 bg-slate-900 px-4 py-2 rounded-tl-2xl border-t border-l border-slate-700">
           <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Social Score</div>
           <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-teal-400 to-lime-400" style={{ width: `${trip.socialScore}%` }} />
              </div>
              <span className="text-teal-400 font-bold text-xs">{trip.socialScore}%</span>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        
        <div className="flex justify-between items-start mb-3">
           <Link href={`/packages/solo/${trip.id}`}>
             <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-teal-400 transition-colors">
               {trip.title}
             </h3>
           </Link>
           <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <FaStar /> {trip.rating}
           </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-sm mb-5">
            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-teal-500" /> {trip.location}</span>
            <span className="flex items-center gap-1"><FaClock className="text-teal-500" /> {trip.duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
           {trip.tags.map((tag: string, i: number) => (
             <span key={i} className="text-[10px] font-mono text-teal-200 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
               #{tag}
             </span>
           ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
           <span className="text-xl font-black text-white">
             {trip.price.toLocaleString()}₮
           </span>
           
           <Link href={`/packages/solo/${trip.id}`}>
             <button className="h-10 w-10 bg-slate-700 hover:bg-teal-500 hover:text-slate-900 rounded-lg flex items-center justify-center transition-all text-white">
                <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform" />
             </button>
           </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default SoloPage;