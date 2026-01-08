"use client";

import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

const LANGUAGES = [
  { code: "mn", label: "MN" },
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" }
] as const;

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`relative px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeLanguage"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
            <span className="relative z-10">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;