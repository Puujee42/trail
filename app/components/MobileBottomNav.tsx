

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Search, Info, User, Heart, Menu, X } from "lucide-react";
import { Locale } from "@/i18n-config";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

interface MobileBottomNavProps {
  language: Locale;
  dictionary: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language, dictionary }) => {
  const pathname = usePathname();
  const t = dictionary || {};
  const { isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const sheetY = useRef(0);
  const { language: activeLang, setLanguage } = useLanguage();
  const wishlistCount = Array.isArray(user?.publicMetadata?.wishlist)
    ? (user?.publicMetadata?.wishlist as string[]).length
    : 0;

  const tabs = useMemo(() => [
    { id: "home", label: t.home || "Нүүр", href: `/${language}`, icon: Home },
    { id: "packages", label: t.packages || "Багцууд", href: `/${language}/packages`, icon: Search },
    // Center iOS-like menu button (opens sheet)
    { id: "menu", label: "Menu", href: "", icon: Menu },
    { id: "wishlist", label: t.wishlist || "Хүслийн жагсаалт", href: `/${language}/dashboard/wishlist`, icon: Heart },
    { id: "profile", label: t.myAccount || "Миний бүртгэл", href: `/${language}/dashboard`, icon: User },
  ], [language, t]);

  const activeIndex = tabs.findIndex(tab =>
    tab.id !== "menu" && (pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`))
  );

  const activeTabId = activeIndex !== -1 ? tabs[activeIndex].id : null;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[calc(var(--z-navbar)+20)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          >
            {/* Backdrop */}
            <button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />

            {/* iOS-style bottom sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 220 }}
              dragElastic={0.06}
              onDrag={(e, info) => {
                sheetY.current = info.offset.y;
              }}
              onDragEnd={(e, info) => {
                const shouldClose = info.velocity.y > 800 || info.offset.y > 120;
                if (shouldClose) setMenuOpen(false);
              }}
            >
              <div className="mx-3 mb-3 rounded-[28px] bg-white/88 backdrop-blur-2xl border border-white/35 shadow-[0_22px_70px_rgba(0,0,0,0.28)] overflow-hidden">
                {/* Drag handle (native iOS feel) */}
                <div className="pt-3 pb-2 flex items-center justify-center">
                  <div className="h-1.5 w-10 rounded-full bg-slate-400/40" />
                </div>

                <div className="flex items-center justify-between px-5 pb-3">
                  <div className="text-[15px] font-semibold tracking-tight text-slate-800">Menu</div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-900/5 hover:bg-slate-900/10 active:scale-95 transition flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X size={18} className="text-slate-800" />
                  </button>
                </div>

                {/* Grouped list (iOS Settings vibe) */}
                <div className="px-3 pb-4">
                  {/* Language pills (native "segmented control" vibe) */}
                  <div className="px-1 pb-3">
                    <div className="rounded-2xl bg-white/70 border border-slate-200/50 p-1 flex items-center justify-between">
                      {(["mn", "en", "ko", "de"] as const).map((code) => {
                        const selected = activeLang === code;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setLanguage(code)}
                            className={`flex-1 h-10 rounded-xl text-[13px] font-bold transition ${
                              selected
                                ? "bg-white shadow-sm text-slate-900"
                                : "text-slate-600 active:bg-white/70"
                            }`}
                            aria-pressed={selected}
                          >
                            {code.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/70 border border-slate-200/50 overflow-hidden">
                    <SheetRow href={`/${language}`} onClick={() => setMenuOpen(false)} label={t.home || "Нүүр"} icon={<Home size={18} />} />
                    <Divider />
                    <SheetRow href={`/${language}/packages`} onClick={() => setMenuOpen(false)} label={t.packages || "Багцууд"} icon={<Search size={18} />} />
                    <Divider />
                    <SheetRow href={`/${language}/about`} onClick={() => setMenuOpen(false)} label={t.about || "Бидний тухай"} icon={<Info size={18} />} />
                    <Divider />
                    <SheetRow href={`/${language}/contact`} onClick={() => setMenuOpen(false)} label={t.contact || "Холбоо барих"} icon={<span className="text-[18px] leading-none">✉️</span>} />
                  </div>

                  <div className="h-3" />

                  <div className="rounded-2xl bg-white/70 border border-slate-200/50 overflow-hidden">
                    <SheetRow href={`/${language}/dashboard/wishlist`} onClick={() => setMenuOpen(false)} label={t.wishlist || "Wishlist"} icon={<Heart size={18} />} badge={wishlistCount > 0 ? String(wishlistCount) : undefined} />
                    <Divider />
                    <SheetRow href={`/${language}/dashboard`} onClick={() => setMenuOpen(false)} label={t.myAccount || "Dashboard"} icon={<User size={18} />} />
                  </div>

                  <div className="h-3" />

                  {/* Account actions */}
                  <div className="rounded-2xl bg-white/70 border border-slate-200/50 overflow-hidden">
                    <SignedIn>
                      <div className="flex items-center justify-between px-4 py-4">
                        <div className="text-[15px] font-semibold text-slate-800">Account</div>
                        <div className="scale-100">
                          <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                              elements: { avatarBox: "w-9 h-9" },
                              variables: { colorPrimary: "#2563eb" },
                            }}
                          />
                        </div>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <SheetRow
                        href={`/${language}/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
                        onClick={() => setMenuOpen(false)}
                        label={t.login || "Нэвтрэх"}
                        icon={<User size={18} />}
                      />
                    </SignedOut>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 inset-x-0 z-[var(--z-navbar)] md:hidden pb-6 pb-[env(safe-area-inset-bottom)] mobile-bottom-nav"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="mx-4 mb-6 rounded-2xl bg-white/70 backdrop-blur-md border-t border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] px-6 py-3 min-h-[80px]">
          <div className="flex items-center justify-between">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              const Icon = tab.icon;

              if (tab.id === "menu") {
                const isMenuActive = menuOpen;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="relative flex flex-col items-center gap-1 p-2 group min-w-[44px] min-h-[44px] justify-center"
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                    aria-haspopup="dialog"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      animate={isMenuActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="relative z-10"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-700 shadow-lg shadow-slate-900/25 flex items-center justify-center">
                        <Icon size={22} className="text-white" />
                      </div>
                    </motion.div>
                    {isMenuActive && (
                      <motion.div
                        layoutId="activeTabDot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              }

            // 1. If it's the Profile tab and user is Signed In -> Show Clerk UserButton
            if (tab.id === 'profile' && isSignedIn) {
              return (
                <div key={tab.id} className="relative flex flex-col items-center gap-1 p-2 min-w-[44px] min-h-[44px] justify-center" aria-label="Profile" role="button">
                  <div className={`p-0.5 rounded-full border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}>
                    <UserButton
                      afterSignOutUrl={`/`}
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 mx-auto",
                          userButtonPopoverCard: "w-[calc(100vw-32px)] max-w-[360px] mx-auto font-[var(--font-inter)]",
                          userButtonPopoverActionButton: "text-blue-600 hover:text-blue-700",
                          userButtonPopoverActionButtonIcon: "text-blue-600"
                        },
                        variables: {
                          colorPrimary: '#2563eb',
                          fontFamily: 'var(--font-inter)'
                        }
                      }}
                    />
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center gap-1 p-2 group min-w-[44px] min-h-[44px] justify-center"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <div className="relative flex flex-col items-center">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { scale: 1.12, y: -1 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative z-10 px-2 py-1 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-blue-700 bg-blue-500/10"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon size={28} strokeWidth={isActive ? 2.5 : 1.5} />
                  </motion.div>

                  {/* Badge Polish */}
                  {tab.id === "wishlist" && wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={wishlistCount} // Trigger animation on count change
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white min-w-[16px] text-center flex items-center justify-center h-4"
                    >
                      {wishlistCount}
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                    </motion.span>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.45)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          </div>
        </div>
      </motion.nav>
    </>
  );
};

function Divider() {
  return <div className="h-px bg-slate-200/60 mx-4" aria-hidden="true" />;
}

function SheetRow({
  href,
  label,
  icon,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-4 active:bg-slate-50 transition"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-900/5 flex items-center justify-center text-slate-700 shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-[16px] font-semibold tracking-tight text-slate-800">
        {label}
      </div>
      {badge && (
        <div className="min-w-6 h-6 px-2 rounded-full bg-red-500 text-white text-[12px] font-black flex items-center justify-center">
          {badge}
        </div>
      )}
      <div className="text-slate-400 text-[18px] leading-none">›</div>
    </Link>
  );
}

export default MobileBottomNav;

