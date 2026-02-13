"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaMap } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

interface StickyBookNavProps {
  onBook: () => void;
  price: string;
  onDownloadGpx?: () => void;
}

const StickyBookNav = ({ onBook, price, onDownloadGpx }: StickyBookNavProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  const t = {
    mn: { book: "Захиалах", map: "Газрын зураг", from: "Эхлэх үнэ" },
    en: { book: "Book Now", map: "Download GPX", from: "From" },
    ko: { book: "예약하기", map: "GPX 다운로드", from: "시작 가격" },
    de: { book: "Buchen", map: "GPX herunterladen", from: "Ab" }
  };

  const text = t[language as keyof typeof t] || t.en;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      // Show after scrolling 500px (past hero section roughly)
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 md:left-auto md:right-8 md:bottom-8 w-full md:w-auto bg-white/95 backdrop-blur-md border-t md:border border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl p-4 px-6 md:p-5 md:rounded-2xl z-50 safe-area-bottom"
        >
          <div className="flex items-center justify-between md:gap-8 gap-4">
            {/* Price Info */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{text.from}</span>
              <span className="text-xl font-black text-slate-800 leading-none">{price}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={onDownloadGpx}
                className="flex items-center gap-2 px-4 h-12 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all text-sm font-bold whitespace-nowrap"
                aria-label={text.map}
              >
                <FaMap /> <span className="hidden sm:inline">{text.map}</span>
              </button>
              <button
                onClick={onBook}
                className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-sky-200 active:scale-95 transition-all whitespace-nowrap"
              >
                <FaCalendarAlt /> {text.book}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBookNav;
