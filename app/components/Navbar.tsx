"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Menu,
  X,
  Globe
} from "lucide-react";

import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";
import { Locale } from "@/i18n-config";
import MobileBottomNav from "./MobileBottomNav";

const LANGUAGES = [
  { code: "mn", label: "Mongolian", flag: "🇲🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
] as const;

const Navbar: React.FC<{ dictionary: any }> = ({ dictionary }) => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = dictionary || {};

  const links = [
    { id: "home", label: t.home || "Home", href: `/${language}` },
    { id: "about", label: t.about || "About Us", href: `/${language}/about` },
    { id: "services", label: t.packages || t.course || "Packages", href: `/${language}/packages` },
    { id: "custom", label: t.course || "Customized Tours", href: `/${language}/custom-trip` },
    { id: "contact", label: t.contact || "Contact Us", href: `/${language}/contact` },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex items-center justify-between">

          {/* LEFT: Logo */}
          <Link href={`/${language}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-lg bg-slate-50 border border-slate-100 p-1 group-hover:scale-105 transition-transform duration-300">
              <img src="/image.png" alt="Mongol Trail" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 tracking-tighter text-xl leading-none">MONGOL</span>
              <span className="font-bold text-sky-500 tracking-widest text-[10px] uppercase leading-none mt-0.5">TRAIL</span>
            </div>
          </Link>

          {/* CENTER: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-sky-500 transition-colors uppercase tracking-[0.15em]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT: Icons & Auth */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <button className="text-slate-600 hover:text-sky-500 transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>

              <LanguageDropdown language={language} setLanguage={setLanguage} />

              <SignedIn>
                <UserButton afterSignOutUrl={`/${language}`} />
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in" className="text-slate-600 hover:text-sky-500 transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </Link>
              </SignedOut>
            </div>

            {/* Hamburger (Mobile/Tablet) */}
            <button
              className="md:hidden text-slate-800 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed inset-0 top-[73px] bg-white z-40 md:hidden p-8 flex flex-col gap-8"
            >
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-black text-slate-800 uppercase tracking-tighter hover:text-sky-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</span>
                  <div className="flex gap-4">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setIsMenuOpen(false); }}
                        className={`text-sm font-bold ${language === lang.code ? 'text-sky-500' : 'text-slate-400'}`}
                      >
                        {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <SignedIn>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                    <UserButton />
                    <span className="font-bold text-slate-700">Manage Account</span>
                  </div>
                </SignedIn>

                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-center uppercase tracking-widest"
                  >
                    Login
                  </Link>
                </SignedOut>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* KEEP MOBILE BOTTOM NAV (OPTIONAL) */}
      <MobileBottomNav language={language} dictionary={dictionary} />
    </>
  );
};

/* ─── Language Dropdown (Desktop) ─── */
const LanguageDropdown = ({ language, setLanguage }: { language: Locale; setLanguage: (lang: Locale) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-slate-600 hover:text-sky-500 transition-colors">
        <Globe size={18} strokeWidth={1.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl py-2 border border-slate-50 overflow-hidden"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className="w-full text-left px-5 py-3 text-xs font-bold hover:bg-sky-50 flex items-center gap-3 transition-colors text-slate-600 hover:text-sky-600"
              >
                <span>{lang.flag}</span> {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;