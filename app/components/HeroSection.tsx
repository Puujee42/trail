"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { TypeAnimation } from "react-type-animation";
import { 
  FaPlaneDeparture, 
  FaMapMarkedAlt, 
  FaSuitcaseRolling, 
  FaPassport, 
  FaSearch,
  FaStar,
  FaUmbrellaBeach,
  FaMountain
} from "react-icons/fa";

// Mocking context: Defaulting to Mongolian ('mn')
const useLanguage = () => { return { language: "mn" } }; 

const HeroSection = () => {
  // @ts-ignore
  const { language } = useLanguage();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effects for floating background elements
  const yOrb = useTransform(scrollY, [0, 500], [0, 200]);
  const yClouds = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = {
    mn: {
      badge: "Аялагчдын #1 Сонголт",
      headlinePrefix: "Дараагийн аялал тань",
      typeSequence: ["Бали руу.", "Парис руу.", "Киото руу.", "Дэлхий даяар."],
      subheadline: "Бид танд хамгийн таатай нислэг, буудал, мартагдашгүй дурсамжийг бүтээхэд тусална. Ачаагаа бэлд, бусдыг нь бидэнд даатга.",
      searchPlaceholder: "Мөрөөдлийн аяллаа хайх...",
      searchLabelDest: "Чиглэл",
      searchLabelDate: "Огноо",
      searchDateValue: "Сонгох",
      btnSearch: "Хайх",
      stats: [
        { icon: FaMapMarkedAlt, end: 150, label: "Чиглэл" },
        { icon: FaSuitcaseRolling, end: 12000, label: "Аялагчид" },
        { icon: FaStar, end: 99, label: "Сэтгэл ханамж" },
      ],
      tags: [
        { icon: FaUmbrellaBeach, text: "Амралт" },
        { icon: FaMountain, text: "Адал явдал" },
        { icon: FaPassport, text: "Соёл" },
      ]
    },
    en: {
      badge: "Travellers' #1 Choice",
      headlinePrefix: "Explore the unseen corners of",
      typeSequence: ["Bali.", "Paris.", "Kyoto.", "The World."],
      subheadline: "We curate luxury experiences and budget-friendly adventures. Pack your bags and let us handle the rest.",
      searchPlaceholder: "Where is your dream trip?",
      searchLabelDest: "Destination",
      searchLabelDate: "Date",
      searchDateValue: "Add Dates",
      btnSearch: "Search",
      stats: [
        { icon: FaMapMarkedAlt, end: 150, label: "Destinations" },
        { icon: FaSuitcaseRolling, end: 12000, label: "Travelers" },
        { icon: FaStar, end: 99, label: "Satisfaction" },
      ],
      tags: [
        { icon: FaUmbrellaBeach, text: "Relaxation" },
        { icon: FaMountain, text: "Adventure" },
        { icon: FaPassport, text: "Culture" },
      ]
    },
  };

  // @ts-ignore
  const t = content[language];

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white pt-20">
      
      {/* ────────────────── ATMOSPHERIC BACKGROUND ────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sky Gradient: Starts Sky Blue, fades to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-50 to-white" />
        
        {/* Floating Sun / Glow */}
        <motion.div
          style={{ y: yOrb }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-200/40 rounded-full blur-[100px] mix-blend-screen"
        />

        {/* Animated Clouds */}
        <motion.div 
          style={{ y: yClouds }}
          animate={{ x: [-50, 50] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-white/60 rounded-full blur-[80px]"
        />
        <motion.div 
          style={{ y: yClouds }}
          animate={{ x: [50, -50] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-[90px]"
        />

        {/* Flight Path SVG Line */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1440 800" fill="none">
          <motion.path
            d="M-100,600 C300,500 600,700 1500,200"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="12 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* ────────────────── MAIN CONTENT ────────────────── */}
      <div className="container relative z-10 px-4 py-10 text-center">
        
        {/* Floating Badge */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-sky-700 text-xs font-bold uppercase tracking-widest shadow-sm mb-8"
        >
          <FaStar className="text-yellow-400" />
          {t.badge}
        </motion.div>

        {/* Typography */}
        <div className="max-w-5xl mx-auto mb-8">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-800 leading-tight tracking-tight drop-shadow-sm"
          >
            {t.headlinePrefix} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
               <TypeAnimation
                key={language}
                sequence={[
                  t.typeSequence[0], 2000,
                  t.typeSequence[1], 2000,
                  t.typeSequence[2], 2000,
                  t.typeSequence[3], 4000,
                ]}
                speed={50}
                repeat={Infinity}
                cursor={true}
              />
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          {t.subheadline}
        </motion.p>

        {/* ────────────────── INTERACTIVE SEARCH BAR ────────────────── */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mb-16 relative z-20"
        >
          {/* Search Container */}
          <div className="p-2 bg-white rounded-3xl sm:rounded-full shadow-[0_20px_50px_rgba(8,112,184,0.15)] border border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            
            {/* Input Section */}
            <div className="flex-1 flex items-center px-6 w-full h-14">
              <FaSearch className="text-slate-300 mr-4 text-lg" />
              <div className="flex flex-col items-start w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.searchLabelDest}</label>
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder} 
                  className="w-full bg-transparent outline-none text-slate-700 font-bold placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2" />

            {/* Date Section (Visual Only) */}
            <div className="hidden sm:flex flex-1 items-center px-4 w-full h-14">
              <div className="flex flex-col items-start w-full cursor-pointer hover:bg-slate-50 rounded-lg p-2 transition-colors">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.searchLabelDate}</label>
                 <span className="text-slate-700 font-semibold text-sm flex items-center gap-2">
                    {t.searchDateValue}
                 </span>
              </div>
            </div>

            {/* Search Button */}
            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-md shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:scale-105 transition-all flex items-center justify-center gap-2">
              {t.btnSearch}
            </button>
          </div>

          {/* Quick Tags below search */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {t.tags.map((tag: any, i: number) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-full border border-slate-200 hover:border-sky-300 hover:text-sky-600 hover:bg-white cursor-pointer transition-all shadow-sm"
              >
                <tag.icon /> {tag.text}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ────────────────── FLOATING STATS ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {t.stats.map((stat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-sky-100 text-sky-600 rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform">
                <stat.icon size={20} />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">
                <CountUp end={stat.end} duration={2.5} separator="," />{stat.label.includes('%') || stat.label === 'Сэтгэл ханамж' ? '%' : '+'}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ────────────────── DECORATIVE ELEMENTS ────────────────── */}
      
      {/* Paper Plane Animation - Crossing the screen */}
      <motion.div
        animate={{ 
          x: ["-10vw", "110vw"], 
          y: ["10vh", "-40vh"],
          rotate: [10, -5]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear",
          delay: 1 
        }}
        className="absolute top-1/2 left-0 pointer-events-none z-0 text-slate-900/5"
      >
        <FaPlaneDeparture size={200} />
      </motion.div>

      {/* Bottom Gradient Fade to White (Seamless transition to next section) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      
    </section>
  );
};

export default HeroSection;