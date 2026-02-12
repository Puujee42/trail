"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react"; // Added useMemo
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlane,
} from "react-icons/fa";
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

import Image from 'next/image';

/* ────────────────────── Main Component ────────────────────── */
const Hero = ({ trips, lang, dictionary }: { trips: Trip[], lang: "mn" | "en" | "ko", dictionary: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const activeLang = lang;

  const heroTrips = useMemo(() => trips || [], [trips]);

  const activeSlide = useMemo(() => {
    return heroTrips.length > 0 ? heroTrips[slideIndex] : null;
  }, [heroTrips, slideIndex]);

  const t = useCallback((obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[activeLang] || obj.en || "";
  }, [activeLang]);

  const getButtonText = useCallback(() => {
    if (activeLang === 'mn') return 'Дэлгэрэнгүй';
    if (activeLang === 'ko') return '자세히 보기';
    return 'Explore Tour';
  }, [activeLang]);

  useEffect(() => {
    if (!heroTrips || heroTrips.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroTrips.length);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [heroTrips]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  if (!activeSlide) return null;

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-900 text-white flex items-center justify-center overflow-hidden">
      {/* ─── 1. Background Video with Fallback Image ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover opacity-100"
          onError={(e) => {
            // Fallback to image if video fails to load
            const videoElement = e.target as HTMLVideoElement;
            videoElement.style.display = 'none';
            const fallbackImage = document.querySelector('.video-fallback-image') as HTMLElement;
            if (fallbackImage) {
              fallbackImage.style.display = 'block';
            }
          }}
        >
          <source src="https://res.cloudinary.com/dc127wztz/video/upload/hero_uzq5wr.mp4" type="video/mp4" />
        </video>
        {/* Preload critical image for LCP if video fails or loads slow */}
        <Image 
          src="/hero-poster.jpg"
          alt="Mongolia Landscape"
          fill
          priority
          className="object-cover -z-10 video-fallback-image"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMFAQEAAAAAAAAAAAABAgMABBEFBhIhMTiQf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECERIxQf/aAAwDAQACEQMRAD8AqnO7jEj2d9lc1YtG2iQf/9k="
          style={{ display: 'none' }} // Hidden by default, shown only if video fails
        />
      </div>

      {/* ─── 2. Gradient Overlays ─── */}
      {/* Top Gradient for Navbar readability */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      
      {/* General Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-black/30" /> 
      
      {/* Bottom Gradient for Content readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* ─── 3. Content ─── */}
      <div className="relative z-10 container mx-auto px-6 max-w-screen-2xl w-full grid grid-cols-12 items-center h-full">
        {/* SEO: Static H1 for search engines */}
        <h1 className="sr-only">
          {activeLang === 'mn' ? 'Монголын Аялал Жуулчлал' : activeLang === 'ko' ? '몽골 여행 및 투어' : 'Mongolia Travel & Adventure Tours'}
        </h1>

        {/* Left Column: Text Content */}
        <div className="col-span-12 lg:col-span-7 pt-24 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.article
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
                <span className="relative px-4 py-2 rounded-full overflow-hidden bg-black/30 backdrop-blur-md border border-white/20 group shadow-sm">
                  <span className="relative text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 font-sans">
                    <FaPlane className="text-sky-400" size={12} />
                    {t(activeSlide.category)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-white font-bold text-sm bg-black/30 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm font-sans">
                  <FaStar className="text-yellow-400 text-base" />
                  <span>{activeSlide.rating || 5.0}</span>
                </span>
              </motion.div>

              {/* Title (Now H2 for SEO hierarchy) */}
              <motion.h2
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] mb-6 text-white tracking-tighter drop-shadow-xl font-sans"
              >
                {t(activeSlide.title)}
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed font-medium line-clamp-3 font-sans tracking-wide"
              >
                {activeSlide.description
                  ? t(activeSlide.description)
                  : t({ mn: "Мөрөөдлийн аяллаа бидэнтэй хамт бүтээгээрэй.", en: "Create your dream journey with us.", ko: "우리와 함께 꿈의 여행을 만드세요." })}
              </motion.p>

              {/* Meta Data */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 text-white/90 mb-10 text-sm font-bold tracking-wide font-sans"
              >
                <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md">
                  <div className="p-2 bg-white/20 text-white rounded-full">
                    <FaClock className="text-sm" />
                  </div>
                  {t(activeSlide.duration)}
                </div>

                <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md">
                  <div className="p-2 bg-white/20 text-white rounded-full">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  {t(activeSlide.location)}
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <ShinyButton
                  link={`/${activeLang}/tours/${activeSlide._id}`}
                  text={getButtonText()}
                />

                {/* Secondary Button: Custom Trip */}
                <Link href={`/${activeLang}/custom-trip`}>
                  <button className="px-8 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-800 font-bold text-lg hover:bg-white/60 transition-all duration-300">
                    {activeLang === 'mn' ? 'Аялал бүтээх' : activeLang === 'ko' ? '맞춤 여행' : 'Plan Your Own'}
                  </button>
                </Link>
              </motion.div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Right Column: Pagination (Using heroTrips instead of all trips) */}
        <div className="hidden lg:flex col-span-5 h-full flex-col justify-center items-end pr-10">
          <VerticalPagination
            items={heroTrips}
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
            className={`flex-1 transition-all duration-300 ${isActive
              ? "opacity-100 translate-x-0"
              : "opacity-40 group-hover:opacity-70 translate-x-2"
              }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? "text-blue-600" : "text-slate-400"
                }`}
            >
              0{index + 1}
            </p>
            <p
              className={`text-lg font-bold truncate ${isActive ? "text-slate-900" : "text-slate-500"
                }`}
            >
              {t(item.location)}
            </p>
          </div>
          <div
            className={`w-1.5 h-14 rounded-full overflow-hidden transition-all duration-300 border ${isActive
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
                key={currentIndex} // Reset animation on slide change
              />
            )}
          </div>
        </button>
      );
    })}
  </div>
);

export default Hero;