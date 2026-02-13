"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";
import { FaArrowRight, FaClock, FaFire, FaMapMarkerAlt, FaSearch, FaStar, FaExchangeAlt, FaFilter, FaHeart } from "react-icons/fa";
import { formatPrice } from "@/app/utils/currency";
import { content } from "@/app/content";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/* ────────────────────── Interfaces ────────────────────── */
interface PackagesListProps {
  packages: Trip[];
  title?: { mn: string; en: string; ko: string; de?: string };
  subtitle?: { mn: string; en: string; ko: string; de?: string };
}

/* ────────────────────── Main Component ────────────────────── */
const PackagesList = ({
  packages,
  title,
  subtitle
}: PackagesListProps) => {

  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  // Content from centralized source
  const t = content.packagesPage;
  const cats = t.categories;
  // @ts-ignore
  const priceFilter = t.priceFilter;

  // Transform categories object to array for mapping
  const categoriesList = [
    { id: "all", label: cats.all },
    { id: "mongolia", label: cats.mongolia },
    { id: "europe", label: cats.europe },
    { id: "nature", label: cats.nature },
    { id: "city", label: cats.city },
    { id: "beach", label: cats.beach },
    { id: "culture", label: cats.culture },
    { id: "theme_park", label: cats.theme_park },
    { id: "resort", label: cats.resort },
  ];

  // Default texts based on language
  const displayTitle = title
    ? (title[language] || title.en)
    : (t.title[language] || t.title.en);

  const displaySubtitle = subtitle
    ? (subtitle[language] || subtitle.en)
    : (t.subtitle[language] || t.subtitle.en);

  const noResultsText = t.noResults[language] || t.noResults.en;
  const searchPlaceholder = t.searchPlaceholder[language] || t.searchPlaceholder.en;

  // Filtering Logic
  const filteredPackages = packages.filter((pkg) => {
    // UPDATED: Check for region match if activeTab is a region, otherwise check category
    const matchesRegion = (activeTab === "mongolia" || activeTab === "europe")
      ? pkg.region?.toLowerCase() === activeTab
      : false;

    const matchesCategory = activeTab === "all" || pkg.category === activeTab || matchesRegion;

    // Safe access for trilingual titles/locations
    const currentTitle = pkg.title?.[language] || pkg.title?.en || "";
    const currentLocation = pkg.location?.[language] || pkg.location?.en || "";

    // ─── Filter by Price ───
    // Always convert to USD for consistent filtering regardless of display currency
    const baseMNT = typeof pkg.price === 'number' 
      ? pkg.price 
      : (pkg.price?.mn || 0);
    
    const priceInUSD = baseMNT / 3450;

    const matchesPrice = 
      priceRange === "all" ||
      (priceRange === "under1000" && priceInUSD < 1000) ||
      (priceRange === "1000-2000" && priceInUSD >= 1000 && priceInUSD <= 2000) ||
      (priceRange === "above2000" && priceInUSD > 2000);

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      currentTitle.toLowerCase().includes(searchLower) ||
      currentLocation.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32 relative z-0">

      {/* ────────────────── HEADER ────────────────── */}
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h1
            key={language}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              {displayTitle}
            </span>
          </motion.h1>
          <motion.p
            key={`${language}-sub`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            {displaySubtitle}
          </motion.p>
        </div>
      </div>

      {/* ────────────────── FILTER BAR ────────────────── */}
      <div className="relative md:sticky md:top-24 z-40 px-4 mb-8 md:mb-12">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] p-2 shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row items-center gap-3">

          <div className="flex-1 flex gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide p-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-[13px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors flex-shrink-0 font-[var(--font-inter)] ${activeTab === cat.id ? "text-sky-600" : "text-slate-500 hover:bg-slate-100"
                  }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-x-4 bottom-1 h-0.5 bg-sky-500/50 blur-[2px] rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {/* Active Indicator Line (Sharper) */}
                {activeTab === cat.id && (
                    <motion.div
                        layoutId="activePillLine"
                        className="absolute inset-x-4 bottom-1 h-[2px] bg-sky-500 rounded-full"
                    />
                )}
                
                {/* Safe access for category label */}
                <span className="relative z-10">{cat.label[language] || cat.label.mn}</span>
              </button>
            ))}
          </div>

          <div className="w-full md:w-auto flex items-center gap-2 relative z-50">
            <div className="relative group min-w-[180px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
                <FaFilter className="text-xs" />
              </div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-full pl-10 pr-8 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors shadow-sm cursor-pointer hover:bg-slate-50"
              >
                <option value="all">{priceFilter.all[language] || priceFilter.all.en}</option>
                <option value="under1000">{priceFilter.under1000[language] || priceFilter.under1000.en}</option>
                <option value="1000-2000">{priceFilter.range1000_2000[language] || priceFilter.range1000_2000.en}</option>
                <option value="above2000">{priceFilter.above2000[language] || priceFilter.above2000.en}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors shadow-sm placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* ────────────────── PACKAGE GRID ────────────────── */}
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg, index) => (
                <PackageCard key={pkg._id} pkg={pkg} language={language} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-bold text-slate-700">
                  {noResultsText}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
};

/* ────────────────────── PACKAGE CARD (FIXED PRICE LOGIC) ────────────────────── */
const PackageCard = ({ pkg, language, index }: { pkg: Trip, language: "mn" | "en" | "ko" | "de", index: number }) => {

  const t = content.packagesPage;
  const { user } = useUser();
  const wished = Array.isArray(user?.publicMetadata?.wishlist) && (user?.publicMetadata?.wishlist as string[]).includes(pkg._id);
  const [toast, setToast] = useState<string | null>(null);
  const { openSignIn } = useClerk();
  const router = useRouter();

  // 1. Helper to extract numeric price safely (BASE MNT)
  const getBaseMNTPrice = (priceObj: any) => {
    if (typeof priceObj === 'number') return priceObj; // Already number (assumed MNT)
    if (typeof priceObj === 'object') return priceObj.mn || 0; // Use MN price as base
    return 0;
  };

  const basePrice = getBaseMNTPrice(pkg.price);
  const oldBasePrice = pkg.oldPrice ? getBaseMNTPrice(pkg.oldPrice) : null;

  // 2. Format with Currency Symbol (Luxury Styling)
  const renderPrice = (amount: number, isOldPrice: boolean = false) => {
    const parts = formatPrice(amount, language);
    return (
      <span className="flex items-baseline gap-0.5">
        {parts.map((part, i) => (
          <span 
            key={i} 
            className={`
              ${part.type === 'currency' 
                ? (isOldPrice ? 'text-[10px] text-slate-400 opacity-80' : 'text-sm text-slate-400 font-bold') 
                : ''}
            `}
          >
            {part.value}
          </span>
        ))}
      </span>
    );
  };

  const imageSrc = pkg.image && pkg.image.trim() !== "" ? pkg.image : "/try.png";

  return (
    <motion.div
      layout
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }
        })
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <Link href={`/tours/${pkg._id}`}>
          <img
            src={imageSrc}
            alt={pkg.title[language] || pkg.title.en || "Trip"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
          />
        </Link>
        {/* Wishlist Heart */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) {
              openSignIn({ redirectUrl: window.location.href });
              return;
            }
            const action = wished ? "remove" : "add";
            try {
              const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tripId: pkg._id, action })
              });
              if (!res.ok) return;
              
              await user.reload();
              router.refresh();
              router.push(`/${language}/dashboard/wishlist`);
              setToast(action === "add" ? "Аяллыг хүслийн жагсаалтад нэмлээ" : "Аяллыг жагсаалтаас хаслаа");
              setTimeout(() => setToast(null), 2000);
            } catch (_) {}
          }}
          className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${wished ? "bg-red-500 text-white shadow-red-500/30" : "bg-black/20 text-white hover:bg-white hover:text-red-500"}`}
        >
          <motion.span
            initial={false}
            animate={wished ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaHeart size={12} />
          </motion.span>
        </motion.button>
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {pkg.tags?.slice(0, 2).map((tag, i) => (
            <span key={i} className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm border border-white/50 font-[var(--font-inter)]">
              {tag}
            </span>
          ))}
        </div>
        {pkg.featured && (
          <div className="absolute bottom-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30 uppercase tracking-widest font-[var(--font-inter)]">
            <FaFire /> {t.featured[language] || t.featured.en}
          </div>
        )}

        {/* Compare Button (Hidden Gem) */}
        <button 
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-500 hover:text-sky-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          title={t.compare.add[language] || t.compare.add.en}
        >
          <FaExchangeAlt className="text-xs" />
        </button>

        {/* OVERLAY BADGES (Duration & Location) - Similar to Hero style but adapted for Card */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-sm">
                <FaClock className="text-sky-400 text-[10px]" />
                <span className="text-white text-[10px] font-bold tracking-wide font-[var(--font-inter)]">
                   {pkg.duration[language] || pkg.duration.en}
                </span>
             </div>
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-sm">
                <FaMapMarkerAlt className="text-emerald-400 text-[10px]" />
                <span className="text-white text-[10px] font-bold tracking-wide font-[var(--font-inter)] line-clamp-1 max-w-[200px]">
                   {pkg.location[language] || pkg.location.en}
                </span>
             </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold font-[var(--font-inter)]">
            <FaStar /> {pkg.rating} <span className="text-slate-300 font-medium">({pkg.reviews || 0} {t.compare.reviews[language] || "reviews"})</span>
          </div>
          <div className="flex items-center gap-1 text-sky-500 text-[10px] font-bold bg-sky-50 px-2 py-1 rounded-md uppercase tracking-widest font-[var(--font-inter)]">
            <FaClock /> {pkg.duration[language] || pkg.duration.en}
          </div>
        </div>

        <Link href={`/tours/${pkg._id}`}>
          <h3 className="text-lg font-semibold text-slate-800 mb-2 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[50px] font-[var(--font-montserrat)]">
            {pkg.title[language] || pkg.title.en}
          </h3>
        </Link>

        <p className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-[var(--font-inter)]">
          <FaMapMarkerAlt className="text-slate-300" /> {pkg.location[language] || pkg.location.en}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {/* FIXED: Old Price Logic */}
            {oldBasePrice && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5 font-[var(--font-inter)]">
                  {t.save[language] || t.save.en} {Math.round(((oldBasePrice - basePrice) / oldBasePrice) * 100)}%
                </span>
                <span className="flex text-xs text-slate-400 line-through decoration-slate-300">
                  {renderPrice(oldBasePrice, true)}
                </span>
              </div>
            )}

            {/* FIXED: Current Price Logic */}
            <div className={`text-xl font-black ${oldBasePrice ? 'text-rose-600' : 'text-slate-900'} font-[var(--font-inter)]`}>
              {renderPrice(basePrice)}
            </div>
          </div>
          <Link href={`/tours/${pkg._id}`}>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-sky-300">
              <FaArrowRight className="text-sm -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </button>
          </Link>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PackagesList;
