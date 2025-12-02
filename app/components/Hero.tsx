"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlane,
} from "react-icons/fa";
// Make sure to import your Context and Types correctly
import { useLanguage } from "../context/LanguageContext";
import { Trip } from "@/lib/mongo/trips";

/* ────────────────────── Animation Variants ────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AUTOPLAY_DURATION = 7000;

/* ────────────────────── Main Component ────────────────────── */
const Hero = ({ trips }: { trips: Trip[] }) => {
  const { language } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to handle DB strings and UI translations (Updated for Korean)
  const t = useCallback(
    (input: any) => {
      if (!input) return "";
      // Check if it's a translation object
      if (typeof input === "object" && (input.mn || input.en || input.ko)) {
        // Return current language, fallback to English, then Mongolian
        return input[language as "mn" | "en" | "ko"] || input.en || input.mn || "";
      }
      return input; // Return string as-is
    },
    [language]
  );

  // Handle Autoplay
  useEffect(() => {
    if (!trips || trips.length === 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % trips.length);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [trips.length]);

  // Safety check if DB returns no data
  if (!trips || trips.length === 0) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading tours...
      </div>
    );
  }

  const activeSlide = trips[slideIndex];

  // Button Text Logic
  const getButtonText = () => {
    if (language === "mn") return "Аялал захиалах";
    if (language === "ko") return "예약하기";
    return "Book Now";
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-900 text-slate-800 flex items-center justify-center overflow-hidden">
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

      {/* ─── 2. Blue Gradient Overlays ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-100/95 via-sky-50/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent" />

      {/* ─── 3. Content ─── */}
      <div className="relative z-10 container mx-auto px-6 max-w-screen-2xl w-full grid grid-cols-12 items-center h-full">
        {/* Left Column: Text Content */}
        <div className="col-span-12 lg:col-span-7 pt-24 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide._id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl text-left"
            >
              {/* Category & Rating */}
              <motion.div
                variants={itemVariants}
                className="mb-6 flex flex-wrap items-center gap-4"
              >
                {/* Category Badge */}
                <span className="relative px-4 py-2 rounded-full overflow-hidden bg-white/60 backdrop-blur-md border border-sky-200 group">
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-100 opacity-50" />
                    <span className="relative text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 flex items-center gap-2">
                      <FaPlane className="text-sky-500" size={10} />
                      {t(activeSlide.category)}
                    </span>
                </span>

                {/* Rating Badge */}
                <span className="flex items-center gap-1.5 text-slate-700 font-bold text-sm bg-white/60 border border-white/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                  <FaStar className="text-yellow-400 text-base" /> 
                  <span>{activeSlide.rating}</span>
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6 text-slate-900 tracking-tight drop-shadow-sm"
              >
                {t(activeSlide.title)}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium"
              >
                {activeSlide.description
                  ? t(activeSlide.description)
                  : t({
                      mn: "Мөрөөдлийн аяллаа бидэнтэй хамт бүтээгээрэй.",
                      en: "Create your dream journey with us.",
                      ko: "우리와 함께 꿈의 여행을 만들어보세요."
                    })}
              </motion.p>

              {/* Meta Data (Duration & Location) */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 text-slate-700 mb-10 text-sm font-bold tracking-wide"
              >
                <div className="flex items-center gap-3 bg-gradient-to-br from-white/80 to-blue-50/50 px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-900/5 border border-white/60 backdrop-blur-xl hover:border-sky-300 transition-colors group cursor-default">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                     <FaClock className="text-sm" />
                  </div>
                  {t(activeSlide.duration)}
                </div>
                
                <div className="flex items-center gap-3 bg-gradient-to-br from-white/80 to-blue-50/50 px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-900/5 border border-white/60 backdrop-blur-xl hover:border-teal-300 transition-colors group cursor-default">
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  {t(activeSlide.location)}
                </div>
              </motion.div>

              {/* Button */}
              <motion.div variants={itemVariants}>
                <ShinyButton
                  link={`/tours/${activeSlide._id}`}
                  text={getButtonText()}
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

const ShinyButton: React.FC<{ link: string; text: string }> = ({
  link,
  text,
}) => (
  <Link href={link}>
    <motion.button
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-500 text-white font-bold text-lg shadow-xl shadow-blue-500/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
    >
      <motion.div
        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
        variants={{ hover: { translateX: "100%", transition: { duration: 0.6 } } }}
      />
      
      <span className="relative z-10 drop-shadow-md">{text}</span>
      
      <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
        <FaArrowRight className="text-sm -rotate-45 group-hover:-rotate-0 transition-transform duration-300" />
      </div>
    </motion.button>
  </Link>
);

const VerticalPagination: React.FC<{
  items: Trip[];
  currentIndex: number;
  onSelect: (index: number) => void;
  t: (input: any) => string;
}> = ({ items, currentIndex, onSelect, t }) => (
  <div className="flex flex-col gap-6 w-80">
    {items.map((item, index) => {
      const isActive = index === currentIndex;
      return (
        <button
          key={item._id}
          onClick={() => onSelect(index)}
          className="group relative flex items-center gap-5 text-right transition-all duration-300 outline-none"
        >
          <div
            className={`flex-1 transition-all duration-300 ${
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-40 group-hover:opacity-70 translate-x-2"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            >
              0{index + 1}
            </p>
            <p
              className={`text-lg font-bold truncate ${
                isActive ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {t(item.location)}
            </p>
          </div>
          
          <div
            className={`w-1.5 h-14 rounded-full overflow-hidden transition-all duration-300 border ${
              isActive
                ? "border-transparent shadow-lg shadow-blue-500/20 scale-y-110"
                : "border-slate-300 bg-white/30"
            }`}
          >
            {isActive && (
              <motion.div
                className="w-full h-full bg-gradient-to-b from-sky-400 to-blue-600 origin-top"
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
              />
            )}
          </div>
        </button>
      );
    })}
  </div>
);

export default Hero;