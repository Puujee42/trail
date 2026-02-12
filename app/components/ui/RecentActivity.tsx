"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaHistory } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

const RecentActivity = () => {
  const [activity, setActivity] = useState<{ type: 'view' | 'book'; count: number; text: string } | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Show notification after 3 seconds
    const timer = setTimeout(() => {
      const randomCount = Math.floor(Math.random() * 8) + 3; // 3-10 people
      const isView = Math.random() > 0.3; // 70% chance of 'viewing'
      
      const t = {
        mn: { view: "хүн яг одоо үзэж байна", book: "цагийн өмнө захиалга хийгдсэн" },
        en: { view: "people viewing this trail", book: "hours ago last booked" },
        ko: { view: "명이 현재 보고 있습니다", book: "시간 전 예약됨" }
      };
      
      const langText = t[language] || t.en;

      if (isView) {
        setActivity({ type: 'view', count: randomCount, text: langText.view });
      } else {
        const hours = Math.floor(Math.random() * 5) + 1;
        setActivity({ type: 'book', count: hours, text: langText.book });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [language]);

  return (
    <AnimatePresence>
      {activity && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 md:bottom-8 md:left-8 md:translate-x-0 z-40 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-3"
        >
          <div className={`p-2 rounded-full ${activity.type === 'view' ? 'bg-sky-100 text-sky-600' : 'bg-green-100 text-green-600'}`}>
            {activity.type === 'view' ? <FaEye /> : <FaHistory />}
          </div>
          <p className="text-xs font-bold text-slate-700 whitespace-nowrap">
            <span className="text-slate-900 text-sm mr-1">{activity.count}</span>
            {activity.text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentActivity;
