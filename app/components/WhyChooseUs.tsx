"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  FaShieldAlt,
  FaHeadset,
  FaWallet,
  FaGlobeAsia,
  FaArrowRight,
  FaPlane,
  FaCheckCircle
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../content";

/* ────────────────────── Main Component ────────────────────── */
const WhyChooseUs = () => {
  const { language } = useLanguage();
  const activeLang = language;

  // Helper to safely get content, falling back to English
  const getContent = (key: keyof typeof content.whyChooseUs) => {
    const item = content.whyChooseUs[key];
    // @ts-ignore - Dynamic access
    return item[activeLang] || item.en;
  };

  const t = {
    badge: getContent('badge'),
    title: getContent('title'),
    desc: getContent('desc'),
    card1Title: getContent('card1Title'),
    card1Desc: getContent('card1Desc'),
    card2Title: getContent('card2Title'),
    card2Desc: getContent('card2Desc'),
    card2Btn: getContent('card2Btn'),
    card3Title: getContent('card3Title'),
    card3Desc: getContent('card3Desc'),
    card3Badge: getContent('card3Badge'),
    card4Title: getContent('card4Title'),
    card4Desc: getContent('card4Desc'),
    card4Tags: getContent('card4Tags'),
    card5Title: getContent('card5Title'),
    card5Desc: getContent('card5Desc'),
  };

  return (
    <section className="py-16 md:py-32 bg-slate-50 relative overflow-hidden">

      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sky-200/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest">
              {t.badge as string}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-6 md:mb-12 tracking-tighter font-[var(--font-montserrat)]"
          >
            {t.title as string}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-base md:text-xl leading-relaxed font-[var(--font-inter)] font-light"
          >
            {t.desc as string}
          </motion.p>
        </div>

        {/* ─── SPOTLIGHT BENTO GRID ─── */}
        <SpotlightGrid>

          {/* Card 1: Global Reach */}
          <BentoCard className="md:col-span-2 md:row-span-2 bg-white border border-slate-200 shadow-sm hover:shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-sky-50/50 z-0" />
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              <svg className="w-full h-full text-sky-300" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
              <motion.div animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/3 left-1/3 w-3 h-3 md:w-4 md:h-4 bg-sky-500 rounded-full" />
              <motion.div animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute top-2/3 right-1/4 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 mb-4 shadow-lg shadow-sky-100 border border-sky-50">
                <FaGlobeAsia size={28} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-[var(--font-inter)] font-semibold text-slate-800 mb-2 md:mb-3">{t.card1Title as string}</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-[var(--font-inter)] font-light">{t.card1Desc as string}</p>
              </div>
              <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-6 right-6 text-sky-200 hidden sm:block">
                <FaPlane size={72} className="md:!size-[120px]" />
              </motion.div>
            </div>
          </BentoCard>

          {/* Card 2: Support */}
          <BentoCard className="md:col-span-1 md:row-span-2 bg-slate-900/90 backdrop-blur-xl text-white relative overflow-hidden border border-white/10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800/50 to-slate-950/50 z-0" />
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col items-center text-center justify-center">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-8 relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/50">
                  <FaHeadset size={36} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 animate-pulse" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-[var(--font-inter)] font-semibold mb-2 md:mb-3">{t.card2Title as string}</h3>
              <p className="text-slate-400 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed font-[var(--font-inter)] font-light">{t.card2Desc as string}</p>
              <button className="w-full py-2.5 md:py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white hover:text-slate-900 transition-all font-bold text-sm backdrop-blur-md">
                {t.card2Btn as string}
              </button>
            </div>
          </BentoCard>

          {/* Card 3: Price */}
          <BentoCard className="md:col-span-1 md:row-span-1 bg-white border border-slate-200 shadow-sm hover:shadow-xl group">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <FaWallet size={24} />
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">{t.card3Badge as string}</span>
              </div>
              <div>
                <h3 className="text-xl font-[var(--font-inter)] font-semibold text-slate-800 mb-1">{t.card3Title as string}</h3>
                <p className="text-slate-500 text-sm font-[var(--font-inter)] font-light">{t.card3Desc as string}</p>
              </div>
            </div>
          </BentoCard>

          {/* Card 4: Safety */}
          <BentoCard className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 blur-2xl transform translate-x-10" />
            <div className="p-6 md:p-8 flex items-center justify-between h-full relative z-10">
              <div className="max-w-xs">
                <h3 className="text-xl md:text-2xl font-[var(--font-inter)] font-semibold mb-2 flex items-center gap-2">
                  <FaShieldAlt /> {t.card4Title as string}
                </h3>
                <p className="text-blue-100 text-xs md:text-sm font-[var(--font-inter)] font-light">{t.card4Desc as string}</p>
              </div>
              <div className="hidden md:flex flex-col gap-2">
                {(t.card4Tags as string[]).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <FaCheckCircle className="text-green-300" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Card 5: CTA */}
          <BentoCard className="md:col-span-2 md:row-span-1 bg-white border border-slate-200 shadow-sm hover:shadow-xl group cursor-pointer">
            <div className="p-8 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                     <FaArrowRight />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-[var(--font-inter)] font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                    {t.card5Title as string}
                  </h3>
                  <p className="text-slate-500 text-sm font-[var(--font-inter)] font-light">{t.card5Desc as string}</p>
                </div>
              </div>
            </div>
          </BentoCard>

        </SpotlightGrid>
      </div>
    </section>
  );
};

/* ────────────────────── Helper Components ────────────────────── */
const SpotlightGrid = ({ children }: { children: React.ReactNode }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = divRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:grid-rows-3 gap-4 md:gap-6 h-auto md:h-[650px] group/spotlight"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

const BentoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-3xl p-1 relative z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default WhyChooseUs;
