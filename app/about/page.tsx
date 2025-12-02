"use client";

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
// 👇 1. Import Hook
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Main Page Component ────────────────────── */
const AboutPage = () => {
  // 👇 2. Get Language
  const { language } = useLanguage();

  // 👇 3. Define Translations
  const content = {
    mn: {
      heroTitlePrefix: "Тав тухтай, Аюулгүй,",
      heroTitleSuffix: "Шударга Аялал",
      heroDesc: "Таны хүсэл, цаг хугацаа, төсөвт яг тохирсон шийдлийг санал болгодог мэргэжлийн баг.",
      
      introTitle: "Бидний тухай",
      introText1: "Манай байгууллага таны аяллыг хамгийн",
      introHighlight: "тав тухтай, аюулгүй, үнэнч шударгаар",
      introText2: "зохион байгуулахыг зорьдог мэргэжлийн баг юм.",

      servicesTitle: "Бидний Үзүүлдэг Үйлчилгээ",
      servicesDesc: "Мэргэжлийн түвшинд танд дараах үйлчилгээнүүдийг үзүүлж байна.",
      serviceItems: [
        { icon: FaPlane, title: "Аяллын хөтөлбөрт болон захиалгат аялал", desc: "Таны сонголтод нийцүүлэн онцгой аяллын маршрутыг гаргаж, бүрэн зохион байгуулна." },
        { icon: FaCalendarCheck, title: "Ярилцлагын цаг авах, материал бүрдүүлэлт", desc: "ЭСЯ-ны ярилцлагын цаг товлох, шаардлагатай материалуудыг мэргэжлийн түвшинд бүрдүүлж өгнө." },
        { icon: FaPassport, title: "Визний цогц үйлчилгээ", desc: "Жуулчны, бизнес, оюутны зэрэг бүх төрлийн визэнд зөвлөгөө өгч, бүрэн дэмжлэг үзүүлнэ." },
        { icon: FaClipboardList, title: "Аяллын төлөвлөгөө бичих үйлчилгээ", desc: "Шаардагдах бүх бичиг баримт, баталгаажуулалт, itinerary-г стандартын дагуу боловсруулж өгнө." }
      ],

      stats: [
        { end: 98, suffix: "%", label: "Виз гарах магадлал" },
        { end: 1200, suffix: "+", label: "Амжилттай материал" },
        { end: 24, suffix: "/7", label: "Тусламж үйлчилгээ" }
      ],

      valuesTitle: "Яагаад биднийг сонгох вэ?",
      valuesDesc: "Бидний давуу тал.",
      valueItems: [
        { icon: FaUserShield, title: "Мэргэжлийн баг", text: "Хариуцлагатай, туршлагатай мэргэжлийн баг танд үйлчилнэ." },
        { icon: FaBalanceScale, title: "Шударга үйлчилгээ", text: "Шударга, ил тод үйлчилгээг эрхэмлэнэ." },
        { icon: FaBolt, title: "Хурдан, найдвартай", text: "Цаг алдалгүй хурдан, найдвартай зөвлөгөө өгнө." },
        { icon: FaLayerGroup, title: "Цогц шийдэл", text: "Аяллын бүх процессыг нэг дороос авах боломжтой." }
      ],

      ctaTitle: "Холбоо барих",
      ctaDesc: "Бид таны мөрөөдлийн аяллыг бодит болгоход бэлэн байна.",
      ctaPhone: "+976 7766-1626", // Updated Phone
      ctaBtnMsg: "Зурвас илгээх"
    },
    en: {
      heroTitlePrefix: "Comfortable, Safe,",
      heroTitleSuffix: "Honest Travel",
      heroDesc: "A professional team offering solutions tailored exactly to your wishes, time, and budget.",
      
      introTitle: "About Us",
      introText1: "Our organization is a professional team aiming to organize your trip most",
      introHighlight: "comfortably, safely, and honestly.",
      introText2: "We are experienced in international travel, visa services, and travel consulting.",

      servicesTitle: "Our Services",
      servicesDesc: "We provide the following services at a professional level.",
      serviceItems: [
        { icon: FaPlane, title: "Custom & Programmed Tours", desc: "We create and organize unique travel routes tailored to your choices." },
        { icon: FaCalendarCheck, title: "Interview Scheduling & Document Preparation", desc: "Booking embassy interviews and professionally preparing required documents." },
        { icon: FaPassport, title: "Comprehensive Visa Services", desc: "Consulting and full support for tourist, business, and student visas." },
        { icon: FaClipboardList, title: "Travel Itinerary Planning", desc: "Preparing all necessary documents, confirmations, and standard itineraries." }
      ],

      stats: [
        { end: 98, suffix: "%", label: "Visa Approval Rate" },
        { end: 1200, suffix: "+", label: "Successful Applications" },
        { end: 24, suffix: "/7", label: "Support Service" }
      ],

      valuesTitle: "Why Choose Us?",
      valuesDesc: "Our Advantages.",
      valueItems: [
        { icon: FaUserShield, title: "Professional Team", text: "A responsible and experienced team at your service." },
        { icon: FaBalanceScale, title: "Honest Service", text: "We value fair and transparent service." },
        { icon: FaBolt, title: "Fast & Reliable", text: "Providing timely, fast, and reliable advice." },
        { icon: FaLayerGroup, title: "Comprehensive Solutions", text: "All travel processes available in one place." }
      ],

      ctaTitle: "Contact Us",
      ctaDesc: "We are ready to make your dream trip a reality.",
      ctaPhone: "+976 7766-1626",
      ctaBtnMsg: "Send Message"
    },
    ko: {
      heroTitlePrefix: "편안하고, 안전하며,",
      heroTitleSuffix: "정직한 여행",
      heroDesc: "고객님의 희망, 시간, 예산에 딱 맞는 솔루션을 제공하는 전문 팀입니다.",
      
      introTitle: "회사 소개",
      introText1: "저희는 고객님의 여행을 가장",
      introHighlight: "편안하고, 안전하며, 정직하게",
      introText2: "계획하는 것을 목표로 하는 전문 팀입니다.",

      servicesTitle: "제공 서비스",
      servicesDesc: "전문적인 수준의 다양한 서비스를 제공합니다.",
      serviceItems: [
        { icon: FaPlane, title: "맞춤형 및 기획 여행", desc: "고객님의 선택에 맞춘 특별한 여행 경로를 기획하고 구성합니다." },
        { icon: FaCalendarCheck, title: "인터뷰 예약 및 서류 준비", desc: "대사관 인터뷰 예약 및 필요한 서류를 전문적으로 준비해 드립니다." },
        { icon: FaPassport, title: "종합 비자 서비스", desc: "관광, 비즈니스, 학생 등 모든 유형의 비자에 대한 상담 및 전폭적인 지원." },
        { icon: FaClipboardList, title: "여행 일정 계획 서비스", desc: "필요한 모든 서류, 예약 확인 및 표준 여행 일정을 작성해 드립니다." }
      ],

      stats: [
        { end: 98, suffix: "%", label: "비자 승인율" },
        { end: 1200, suffix: "+", label: "성공적인 신청" },
        { end: 24, suffix: "/7", label: "고객 지원" }
      ],

      valuesTitle: "왜 우리를 선택해야 할까요?",
      valuesDesc: "우리의 장점.",
      valueItems: [
        { icon: FaUserShield, title: "전문 팀", text: "책임감 있고 경험이 풍부한 팀이 서비스를 제공합니다." },
        { icon: FaBalanceScale, title: "정직한 서비스", text: "공정하고 투명한 서비스를 중요시합니다." },
        { icon: FaBolt, title: "신속 & 정확", text: "지체 없이 빠르고 신뢰할 수 있는 조언을 제공합니다." },
        { icon: FaLayerGroup, title: "통합 솔루션", text: "모든 여행 절차를 한곳에서 해결할 수 있습니다." }
      ],

      ctaTitle: "문의하기",
      ctaDesc: "당신의 꿈꾸던 여행을 현실로 만들어 드릴 준비가 되어 있습니다.",
      ctaPhone: "+976 7766-1626",
      ctaBtnMsg: "메시지 보내기"
    }
  };

  const t = content[language];

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
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 z-10" />
    
    <div className="relative z-20 container mx-auto px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto"
      >
        {t.heroTitlePrefix} <span className="text-sky-400">{t.heroTitleSuffix}</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium"
      >
        {t.heroDesc}
      </motion.p>
    </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all group"
  >
     <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
        <Icon size={24} />
     </div>
     <h3 className="font-bold text-lg text-slate-800 mb-3 min-h-[56px] flex items-center">{title}</h3>
     <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// 4. Stats Section
const StatsSection = ({ t }: any) => (
  <section className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {t.stats.map((stat: any, i: number) => (
          <div key={i} className="p-4">
            <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
              <CountUp end={stat.end} duration={3} />{stat.suffix}
            </h3>
            <p className="text-sky-100 font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. Core Values
const ValuesSection = ({ t }: any) => (
   <section className="bg-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-black text-slate-800 mb-4">{t.valuesTitle}</h2>
           <p className="text-slate-500 text-lg">{t.valuesDesc}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default AboutPage;