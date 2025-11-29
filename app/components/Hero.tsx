"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Enriched Bilingual Travel Data ────────────────────── */
const trips = [
  {
    id: 1,
    category: { mn: "Адал Явалт", en: "Adventure" },
    title: { mn: "Хөвсгөл Далайн Гайхамшигт Аялал", en: "Majestic Khuvsgul Lake Expedition" },
    desc: { mn: "Монголын хөх сувд гэгдэх Хөвсгөл далайн эрэгт амарч, цаатан иргэдийн аж амьдралтай танилцаарай.", en: "Relax on the shores of the Blue Pearl of Mongolia and experience the unique culture of the Tsaatan reindeer herders." },
    duration: { mn: "4 Өдөр / 3 Шөнө", en: "4 Days / 3 Nights" },
    location: { mn: "Хөвсгөл, Монгол", en: "Khuvsgul, Mongolia" },
    rating: 4.9,
  },
  {
    id: 2,
    category: { mn: "Хотын Аялал", en: "City Break" },
    title: { mn: "Парис: Хайрын Хотоор Аялах Нь", en: "Paris: A Journey Through the City of Love" },
    desc: { mn: "Эйфелийн цамхаг, Луврын музей болон Франц үндэстний амтат хоолыг мэдрэх мартагдашгүй аялал.", en: "Unforgettable moments at the Eiffel Tower, Louvre Museum, and exquisite French cuisine await you." },
    duration: { mn: "7 Өдөр / 6 Шөнө", en: "7 Days / 6 Nights" },
    location: { mn: "Парис, Франц", en: "Paris, France" },
    rating: 5.0,
  },
  {
    id: 3,
    category: { mn: "Далайн Эрэг", en: "Beach Resort" },
    title: { mn: "Бали Арлын Диваажин", en: "Tropical Paradise in Bali" },
    desc: { mn: "Цагаан элс, тунгалаг ус, халуун орны нар. Өвлийн хүйтнээс зугтаж зуны дэлгэр цагт очоорой.", en: "White sands, crystal clear waters, and tropical sun. Escape the cold and dive into eternal summer." },
    duration: { mn: "10 Өдөр / 9 Шөнө", en: "10 Days / 9 Nights" },
    location: { mn: "Бали, Индонез", en: "Bali, Indonesia" },
    rating: 4.8,
  },
];

const AUTOPLAY_DURATION = 7000;

/* ────────────────────── Main Hero Component ────────────────────── */
const Hero = () => {
  const { language } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const t = (obj: { mn: string; en: string }) => obj[language as 'mn' | 'en'] || obj.mn;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // FIX: This useEffect is updated for robust video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // 1. Explicitly set muted property. This is crucial for browsers.
      video.muted = true;
      
      // 2. Attempt to play the video and handle any potential promise rejection.
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully.
          })
          .catch((error) => {
            // Autoplay was prevented.
            console.error("Video autoplay failed:", error);
          });
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const startAutoplay = () => {
      timeoutRef.current = setTimeout(() => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % trips.length);
      }, AUTOPLAY_DURATION);
    };
    startAutoplay();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slideIndex]);

  const goToSlide = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSlideIndex(index);
  };

  const activeSlide = trips[slideIndex];

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-white text-slate-800 flex items-center justify-center overflow-hidden">
      {/* ─── 1. Background Video Layer ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay // Keep this attribute as a hint for the browser
          loop
          muted // Keep this attribute for initial state and non-JS fallback
          playsInline // Essential for autoplay on iOS
          preload="auto"
          className="w-full h-full object-cover"
        >
          {/* Ensure 'hero.mp4' is in your 'public' folder */}
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* ─── 2. White Gradient Overlay ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />

      {/* ─── 3. Content Container ─── */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl w-full grid grid-cols-12 items-center h-full">
        {/* Left Column: Text Content Slider */}
        <div className="col-span-12 lg:col-span-7 pt-20 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="max-w-3xl text-left"
            >
              {/* Category Tag & Rating */}
              <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50/80 border border-sky-100 px-4 py-2 rounded-full backdrop-blur-sm">
                  {t(activeSlide.category)}
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-bold text-sm bg-white/80 border border-slate-100 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                  <FaStar className="text-yellow-400" /> {activeSlide.rating}
                </span>
              </motion.div>
              {/* Headline */}
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-slate-900 tracking-tight">
                {t(activeSlide.title).split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-3 whitespace-nowrap">
                    {word}
                  </span>
                ))}
              </motion.h1>
              {/* Description */}
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
                {t(activeSlide.desc)}
              </motion.p>
              {/* Metadata Icons */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 text-slate-700 mb-10 text-sm font-bold tracking-wide">
                <span className="flex items-center gap-2 bg-white/80 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                  <FaClock className="text-sky-500 text-lg" />
                  {t(activeSlide.duration)}
                </span>
                <span className="flex items-center gap-2 bg-white/80 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                  <FaMapMarkerAlt className="text-sky-500 text-lg" />
                  {t(activeSlide.location)}
                </span>
              </motion.div>
              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <ShinyButton link={`/tours/${activeSlide.id}`} text={language === "mn" ? "Аялал захиалах" : "Book Now"} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Right Column: Desktop Vertical Pagination */}
        <div className="hidden lg:flex col-span-5 h-full flex-col justify-center items-end pr-10">
          <VerticalPagination
            items={trips}
            currentIndex={slideIndex}
            onSelect={goToSlide}
            language={language}
            t={t}
          />
        </div>
      </div>
      {/* Mobile Bottom Navigation Dots */}
      <div className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {trips.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm border border-slate-300 ${index === slideIndex ? 'w-8 bg-sky-500 border-sky-500' : 'w-2 bg-white'} h-2`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ────────────────────── Helper Components ────────────────────── */
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ShinyButton: React.FC<{link: string, text: string}> = ({link, text}) => (
    <Link href={link}>
      <motion.button
        whileHover="hover"
        className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-sky-200 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-sky-300"
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
  items: typeof trips,
  currentIndex: number,
  onSelect: (index: number) => void,
  language: string,
  t: (obj: any) => string
}> = ({ items, currentIndex, onSelect, t }) => (
  <div className="flex flex-col gap-6 w-72">
    {items.map((item, index) => {
      const isActive = index === currentIndex;
      return (
        <button
          key={item.id}
          onClick={() => onSelect(index)}
          className="group relative flex items-center gap-4 text-right transition-all duration-300"
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
                transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
              />
            )}
          </div>
        </button>
      )
    })}
  </div>
);

export default Hero;