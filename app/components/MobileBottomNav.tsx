

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Info, User } from "lucide-react";
import { Locale } from "@/i18n-config";

interface MobileBottomNavProps {
  language: Locale;
  dictionary: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language, dictionary }) => {
  const pathname = usePathname();
  const t = dictionary || {};

  const tabs = useMemo(() => [
    { id: "home", label: t.home || "Нүүр", href: `/${language}`, icon: Home },
    { id: "packages", label: t.packages || "Багцууд", href: `/${language}/packages`, icon: Search },
    { id: "about", label: t.about || "Бидний тухай", href: `/${language}/about`, icon: Info },
    { id: "profile", label: t.myAccount || "Миний бүртгэл", href: `/${language}/dashboard`, icon: User },
  ], [language, t]);

  const activeIndex = tabs.findIndex(tab =>
    pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`)
  );
  
  const activeTabId = activeIndex !== -1 ? tabs[activeIndex].id : null;

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 inset-x-0 z-50 md:hidden pb-safe"
      role="navigation"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-6 py-2 pb-6">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center gap-1 p-2 group w-16"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative z-10 p-1 transition-colors duration-300 ${
                      isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon size={26} strokeWidth={isActive ? 2.5 : 1.5} />
                  </motion.div>
                </div>
                
                <span className={`text-[10px] font-bold transition-colors duration-300 font-sans tracking-wide ${
                  isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                }`}>
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;

