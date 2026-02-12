"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search,
  User,
  Globe,
  ChevronDown,
  Map as MapIcon,
  Compass,
  Phone,
  Home,
  LogOut,
  Settings,
  Heart,
  LayoutDashboard
} from "lucide-react";
import { useCurrentUser } from "../context/UserContext";

import { useLanguage } from "../context/LanguageContext";
import { Locale } from "@/i18n-config";
import Image from "next/image";

const LANGUAGES = [
  { code: "mn", label: "MN", flag: "🇲🇳" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ko", label: "KO", flag: "🇰🇷" },
] as const;

const Navbar: React.FC<{ dictionary: any }> = ({ dictionary }) => {
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const t = dictionary || {};

  // Handle Scroll Effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { id: "home", label: t.home || "Home", href: `/${language}` },
    { id: "packages", label: t.packages || "Tour Packages", href: `/${language}/packages` },
    { id: "about", label: t.about || "About Us", href: `/${language}/about` },
    { id: "contact", label: t.contact || "Contact", href: `/${language}/contact` },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR (Hidden on Mobile) */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex fixed top-4 inset-x-0 mx-auto max-w-7xl rounded-full transition-all duration-500 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 py-3 px-8 shadow-sm z-[var(--z-navbar)]"
        role="banner"
      >
        <nav className="w-full flex items-center justify-between" aria-label="Main Navigation">
          
          {/* 1. LOGO */}
          <Link href={`/${language}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-full p-0.5 shadow-md bg-gradient-to-tr from-sky-400 to-blue-600">
               <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/image.png" 
                    alt="Mongol Trail" 
                    width={40} 
                    height={40} 
                    priority
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-xl leading-none font-sans text-slate-900">
                MONGOL
              </span>
              <span className="font-bold tracking-[0.3em] text-[10px] uppercase leading-none mt-0.5 text-sky-600">
                TRAIL
              </span>
            </div>
          </Link>

          {/* 2. CENTER MENU */}
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium tracking-wide text-slate-900 hover:text-sky-600 transition-colors relative group font-sans"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <LanguageDropdown language={language} setLanguage={setLanguage} />

            {/* User Account Section */}
            <UserAccount language={language} t={t} />
          </div>
        </nav>
      </motion.header>

      {/* MOBILE HEADER (Just Logo & Profile/Search maybe? - Keeping it minimal as requested) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-[var(--z-navbar)] p-4 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent">
         <Link href={`/${language}`} className="flex items-center gap-2">
            <div 
              className="rounded-full bg-white shadow-md p-0.5 overflow-hidden shrink-0"
              style={{ width: 36, height: 36 }}
            >
               <Image src="/image.png" alt="Logo" width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight whitespace-nowrap">MONGOL TRAIL</span>
         </Link>
         <LanguageDropdown language={language} setLanguage={setLanguage} mobile />
      </div>
    </>
  );
};

const LanguageDropdown = ({ language, setLanguage, mobile }: { language: Locale; setLanguage: (lang: Locale) => void, mobile?: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button 
        aria-label="Select Language"
        aria-expanded={open}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
        mobile 
          ? 'bg-white/80 shadow-sm backdrop-blur-sm' 
          : 'hover:bg-slate-100'
      }`}>
        <Globe size={16} className="text-slate-500" />
        <span className="text-xs font-bold uppercase text-slate-700">{language}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 z-[var(--z-dropdown)]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-sky-50 transition-colors ${
                  language === lang.code ? "text-sky-600 bg-sky-50/50" : "text-slate-600"
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-lg leading-none">{lang.flag}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserAccount = ({ language, t }: { language: string, t: any }) => {
  const { isLoaded, isSignedIn, user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside (simple version)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isOpen]);

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
    );
  }

  if (!isSignedIn) {
    return (
      <Link href={`/${language}/sign-in`}>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 group border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300">
          <User size={16} className="text-slate-400 group-hover:text-slate-600" />
          <span>{t.login || "Нэвтрэх"}</span>
        </button>
      </Link>
    );
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Account Menu"
        aria-expanded={isOpen}
        className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full border transition-all duration-300 group bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border shadow-sm relative border-slate-200">
          <Image 
            src={user.imageUrl} 
            alt={user.fullName || "User"} 
            width={32} 
            height={32} 
            className="object-cover"
          />
        </div>
        <span className="text-sm font-bold max-w-[80px] truncate text-slate-700">
          {user.firstName}
        </span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-slate-400`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden py-2 z-[var(--z-dropdown)] ring-1 ring-slate-900/5"
          >
            <div className="px-4 py-3 border-b border-slate-100/50 mb-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>

            <div className="space-y-0.5 px-1">
              <Link href={`/${language}/dashboard`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <LayoutDashboard size={16} />
                {t.myTrips || "Миний аялалууд"}
              </Link>
              <Link href={`/${language}/dashboard/saved`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <Heart size={16} />
                {t.saved || "Хадгалсан"}
              </Link>
              <Link href={`/${language}/dashboard/settings`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <Settings size={16} />
                {t.settings || "Тохиргоо"}
              </Link>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100/50 px-1">
              <LogoutButton language={language} t={t} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LogoutButton = ({ language, t }: { language: string, t: any }) => {
  const { signOut } = useCurrentUser();
  return (
    <button 
      onClick={() => signOut()}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
    >
      <LogOut size={16} />
      {t.logout || "Гарах"}
    </button>
  );
};

export default Navbar;