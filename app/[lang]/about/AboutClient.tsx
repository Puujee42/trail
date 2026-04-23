"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import {
    FaPlane,
    FaCalendarCheck,
    FaPassport,
    FaClipboardList,
    FaUserShield,
    FaBalanceScale,
    FaBolt,
    FaLayerGroup,
    FaArrowRight,
    FaPhoneAlt
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

import { content } from "../../content";

/* ────────────────────── Main Page Component ────────────────────── */
const AboutClient = () => {
    const { language } = useLanguage();

    // Map icons to arrays to reconstruct the object structure
    const serviceIcons = [FaPlane, FaCalendarCheck, FaPassport, FaClipboardList];
    const valueIcons = [FaUserShield, FaBalanceScale, FaBolt, FaLayerGroup];

    // Helper to resolve language
    const tRaw = content.aboutPage;
    
    // Construct the 't' object to match the structure expected by components
    const t = {
        heroTitlePrefix: tRaw.heroTitlePrefix[language] || tRaw.heroTitlePrefix.en,
        heroTitleSuffix: tRaw.heroTitleSuffix[language] || tRaw.heroTitleSuffix.en,
        heroDesc: tRaw.heroDesc[language] || tRaw.heroDesc.en,
        introTitle: tRaw.introTitle[language] || tRaw.introTitle.en,
        introText1: tRaw.introText1[language] || tRaw.introText1.en,
        introHighlight: tRaw.introHighlight[language] || tRaw.introHighlight.en,
        introText2: tRaw.introText2[language] || tRaw.introText2.en,
        servicesTitle: tRaw.servicesTitle[language] || tRaw.servicesTitle.en,
        servicesDesc: tRaw.servicesDesc[language] || tRaw.servicesDesc.en,
        serviceItems: tRaw.serviceItems.map((item, i) => ({
            icon: serviceIcons[i],
            title: item.title[language] || item.title.en,
            desc: item.desc[language] || item.desc.en
        })),
        stats: tRaw.stats.map(item => ({
             end: item.end,
             suffix: item.suffix,
             label: item.label[language] || item.label.en
        })),
        valuesTitle: tRaw.valuesTitle[language] || tRaw.valuesTitle.en,
        valuesDesc: tRaw.valuesDesc[language] || tRaw.valuesDesc.en,
        valueItems: tRaw.valueItems.map((item, i) => ({
            icon: valueIcons[i],
            title: item.title[language] || item.title.en,
            text: item.text[language] || item.text.en
        })),
        ctaTitle: tRaw.ctaTitle[language] || tRaw.ctaTitle.en,
        ctaDesc: tRaw.ctaDesc[language] || tRaw.ctaDesc.en,
        ctaPhone: tRaw.ctaPhone,
        ctaBtnMsg: tRaw.ctaBtnMsg[language] || tRaw.ctaBtnMsg.en
    };

    return (
        <div className="bg-white text-slate-800">
            <HeroSection t={t} />
            <IntroTextSection t={t} />
            <ServicesSection t={t} />
            <StatsSection t={t} />
            <ValuesSection t={t} />
            <CtaSection t={t} />
        </div>
    );
};

/* ────────────────────── Sub-Components ────────────────────── */

// 1. Hero Section
const HeroSection = ({ t }: any) => (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                <source
                    src="https://res.cloudinary.com/dc127wztz/video/upload/f_auto,q_auto,w_1280,ac_none/hero_uzq5wr.mp4"
                    type="video/mp4"
                />
            </video>
        </div>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 z-10" />

        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="relative z-20 container mx-auto px-4"
        >
            <motion.div
                variants={{ hidden: { opacity: 0, y: -12 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl inline-block px-6 py-4 mx-auto"
            >
                <h1 className="text-4xl md:text-6xl font-[var(--font-montserrat)] font-bold leading-tight">
                    {t.heroTitlePrefix} <span className="text-sky-400">{t.heroTitleSuffix}</span>
                </h1>
            </motion.div>
            <motion.p
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4"
            >
                {t.heroDesc}
            </motion.p>
        </motion.div>
    </section>
);

// 2. Intro Text Section
const IntroTextSection = ({ t }: any) => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold text-slate-800 mb-6">{t.introTitle}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    {t.introText1} <span className="text-sky-600 font-bold">{t.introHighlight}</span> {t.introText2}
                </p>
            </motion.div>
        </div>
    </section>
);

// 3. Services Section
const ServicesSection = ({ t }: any) => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-800 mb-4">{t.servicesTitle}</h2>
                <p className="text-slate-500">{t.servicesDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {t.serviceItems.map((item: any, i: number) => (
                    <ServiceCard key={i} icon={item.icon} title={item.title} desc={item.desc} />
                ))}
            </div>
        </div>
    </section>
);

const ServiceCard = ({ icon: Icon, title, desc }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 transition-all group mb-4 md:mb-0"
    >
        <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors relative">
            <div className="absolute inset-0 bg-sky-400/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon size={24} className="relative z-10 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-3 min-h-[56px] flex items-center">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

// 4. Stats Section
const StatsSection = ({ t }: any) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(true);
                        observer.disconnect();
                    }
                });
            },
            { root: null, threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {t.stats.map((stat: any, i: number) => (
                        <div key={i} className="p-4">
                            <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
                                {active ? <CountUp end={stat.end} duration={2.5} /> : 0}{stat.suffix}
                            </h3>
                            <p className="text-sky-100 font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 5. Core Values
const ValuesSection = ({ t }: any) => (
    <section className="bg-white py-24">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-800 mb-4">{t.valuesTitle}</h2>
                <p className="text-slate-500 text-lg">{t.valuesDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {t.valueItems.map((val: any, i: number) => (
                    <ValueCard key={i} icon={val.icon} title={val.title} text={val.text} />
                ))}
            </div>
        </div>
    </section>
);

const ValueCard = ({ icon: Icon, title, text }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors"
    >
        <div className="w-16 h-16 bg-white text-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Icon size={28} />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm">{text}</p>
    </motion.div>
);

// 6. Call to Action
const CtaSection = ({ t }: any) => (
    <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black mb-6"
            >
                {t.ctaTitle}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 text-lg mb-10"
            >
                {t.ctaDesc}
            </motion.p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Updated Phone Link */}
                <a href={`tel:${t.ctaPhone.replace(/\s+/g, '')}`}>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-sky-500/30 transition-all flex items-center gap-3">
                        <FaPhoneAlt /> {t.ctaPhone}
                    </button>
                </a>
                <Link href="/contact">
                    <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full backdrop-blur-sm border border-white/20 transition-all flex items-center gap-3">
                        {t.ctaBtnMsg} <FaArrowRight />
                    </button>
                </Link>
            </div>
        </div>
    </section>
);

export default AboutClient;
