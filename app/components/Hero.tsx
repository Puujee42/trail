"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { Trip } from "@/lib/mongo/trips"; // Import the type

/* ────────────────────── Animation Variants ────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AUTOPLAY_DURATION = 7000;

/* ────────────────────── Main Component ────────────────────── */
// Accept trips as a prop
const Hero = ({ trips }: { trips: Trip[] }) => {
  const { language } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to handle both DB strings and UI translations
  const t = useCallback((input: any) => {
    if (!input) return "";
    // If it's an object (like your old mock data), translate it
    if (typeof input === 'object' && (input.mn || input.en)) {
      return input[language as 'mn' | 'en'] || input.mn;
    }
    // If it's a string (from MongoDB), return it as is
    return input;
  }, [language]);

  // Handle Autoplay
  useEffect(() => {
    if (trips.length === 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % trips.length);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [trips.length]);

  // Safety check if DB returns no data
  if (!trips || trips.length === 0) {
    return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading tours...</div>;
  }

  const activeSlide = trips[slideIndex];

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-900 text-white flex items-center justify-center overflow-hidden">
      
      {/* ─── 1. Background Video ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ─── 2. Gradient Overlays ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-50/90 via-slate-50/70 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

      {/* ─── 3. Content ─── */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl w-full grid grid-cols-12 items-center h-full">
        
        {/* Left Column: Text Content */}
        <div className="col-span-12 lg:col-span-7 pt-20 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide._id} // Use MongoDB _id
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl text-left"
            >
              {/* Category & Rating */}
              <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50/80 border border-sky-100 px-4 py-2 rounded-full backdrop-blur-sm">
                  {t(activeSlide.category)}
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-bold text-sm bg-white/80 border border-slate-100 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                  <FaStar className="text-yellow-400" /> {activeSlide.rating}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-slate-800 tracking-tight">
                {t(activeSlide.title)}
              </motion.h1>

              {/* Description (Fallback to a default string if DB lacks description) */}
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
                {activeSlide.description 
                  ? t(activeSlide.description) 
                  : t({mn: "Мөрөөдлийн аяллаа бидэнтэй хамт бүтээгээрэй.", en: "Create your dream journey with us."})}
              </motion.p>

              {/* Meta Data */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 text-slate-700 mb-10 text-sm font-bold tracking-wide">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                  <FaClock className="text-sky-500 text-lg" />
                  {t(activeSlide.duration)}
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                  <FaMapMarkerAlt className="text-sky-500 text-lg" />
                  {t(activeSlide.location)}
                </div>
              </motion.div>

              {/* Button */}
              <motion.div variants={itemVariants}>
                <ShinyButton 
                  link={`/tours/${activeSlide._id}`} 
                  text={language === "mn" ? "Аялал захиалах" : "Book Now"} 
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Pagination */}
        <div className="hidden lg:flex col-span-5 h-full flex-col justify-center items-end pr-10">
          <VerticalPagination
            items={trips}
            currentIndex={slideIndex}
            onSelect={setSlideIndex}
            t={t}
          />
        </div>
      </div>
    </section>
  );
};

/* ────────────────────── Helpers ────────────────────── */

const ShinyButton: React.FC<{link: string, text: string}> = ({link, text}) => (
    <Link href={link}>
      <motion.button
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-sky-200 overflow-hidden transition-all duration-300 transform hover:shadow-sky-300"
      >
        <motion.span
          className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          variants={{hover: { left: "100%", transition: { duration: 0.5 }}}}
        />
        {text}
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
          <FaArrowRight className="text-sm -rotate-45 group-hover:-rotate-0 transition-transform duration-300" />
        </div>
      </motion.button>
    </Link>
)

const VerticalPagination: React.FC<{
  items: Trip[],
  currentIndex: number,
  onSelect: (index: number) => void,
  t: (input: any) => string
}> = ({ items, currentIndex, onSelect, t }) => (
  <div className="flex flex-col gap-6 w-72">
    {items.map((item, index) => {
      const isActive = index === currentIndex;
      return (
        <button
          key={item._id}
          onClick={() => onSelect(index)}
          className="group relative flex items-center gap-4 text-right transition-all duration-300 outline-none"
        >
          <div className={`flex-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
              0{index + 1}
            </p>
            <p className={`text-sm font-bold truncate shadow-sm ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
              {t(item.location)}
            </p>
          </div>
          <div className={`w-1.5 h-12 rounded-full overflow-hidden transition-all duration-300 border border-slate-200 ${isActive ? 'bg-slate-100 scale-y-110 shadow-inner' : 'bg-slate-50'}`}>
            {isActive && (
              <motion.div
                className="w-full bg-sky-500 origin-top shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                transition={{ duration: 7, ease: "linear" }}
              />
            )}
          </div>
        </button>
      )
    })}
  </div>
);

export default Hero;