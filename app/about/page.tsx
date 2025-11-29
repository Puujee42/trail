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
  FaArrowRight
} from "react-icons/fa";

/* ────────────────────── Main Page Component ────────────────────── */
const AboutPage = () => {
  return (
    <div className="bg-white text-slate-800">
      
      {/* ─── 1. Cinematic Hero Section ─── */}
      <HeroSection />
      
      {/* ─── 2. Intro Text Section ─── */}
      <IntroTextSection />

      {/* ─── 3. Services Grid ─── */}
      <ServicesSection />

      {/* ─── 4. Stats Banner ─── */}
      <StatsSection />

      {/* ─── 5. Core Values (Why Choose Us) ─── */}
      <ValuesSection />
      
      {/* ─── 6. Call to Action ─── */}
      <CtaSection />

    </div>
  );
};

/* ────────────────────── Sub-Components ────────────────────── */

// 1. Hero Section
const HeroSection = () => (
  <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
    {/* Background Video */}
    <div className="absolute inset-0 z-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 z-10" />
    
    <div className="relative z-20 container mx-auto px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto"
      >
        Тав тухтай, Аюулгүй, <span className="text-sky-400">Шударга Аялал</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium"
      >
        Таны хүсэл, цаг хугацаа, төсөвт яг тохирсон шийдлийг санал болгодог мэргэжлийн баг.
      </motion.p>
    </div>
  </section>
);

// 2. Intro Text Section (Mission Statement)
const IntroTextSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
         <h2 className="text-3xl font-bold text-slate-800 mb-6">Бидний тухай</h2>
         <p className="text-lg text-slate-600 leading-relaxed">
            Манай байгууллага таны аяллыг хамгийн <span className="text-sky-600 font-bold">тав тухтай, аюулгүй, үнэнч шударгаар</span> зохион байгуулахыг зорьдог мэргэжлийн баг юм. Бид олон улсын аялал, визний үйлчилгээ, аяллын зөвлөгөөний чиглэлээр туршлагатай бөгөөд таны хүсэл, цаг хугацаа, төсөвт яг тохирсон шийдлийг санал болгодог.
         </p>
      </motion.div>
    </div>
  </section>
);

// 3. Services Section
const ServicesSection = () => (
  <section className="py-20 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-800 mb-4">Бидний Үзүүлдэг Үйлчилгээ</h2>
        <p className="text-slate-500">Мэргэжлийн түвшинд танд дараах үйлчилгээнүүдийг үзүүлж байна.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <ServiceCard 
          icon={FaPlane} 
          title="Аяллын хөтөлбөрт болон захиалгат аялал" 
          desc="Таны сонголтод нийцүүлэн онцгой аяллын маршрутыг гаргаж, бүрэн зохион байгуулна."
        />
        
        <ServiceCard 
          icon={FaCalendarCheck} 
          title="Ярилцлагын цаг авах, материал бүрдүүлэлт" 
          desc="ЭСЯ-ны ярилцлагын цаг товлох, шаардлагатай материалуудыг мэргэжлийн түвшинд бүрдүүлж өгнө."
        />

        <ServiceCard 
          icon={FaPassport} 
          title="Визний цогц үйлчилгээ" 
          desc="Жуулчны, бизнес, оюутны зэрэг бүх төрлийн визэнд зөвлөгөө өгч, бүрэн дэмжлэг үзүүлнэ."
        />

        <ServiceCard 
          icon={FaClipboardList} 
          title="Аяллын төлөвлөгөө бичих үйлчилгээ" 
          desc="Шаардагдах бүх бичиг баримт, баталгаажуулалт, itinerary-г стандартын дагуу боловсруулж өгнө."
        />

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
const StatsSection = () => (
  <section className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={98} duration={3} />%
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Виз гарах магадлал</p>
        </div>
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={1200} duration={3} />+
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Амжилттай материал</p>
        </div>
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={24} duration={3} />/7
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Тусламж үйлчилгээ</p>
        </div>
      </div>
    </div>
  </section>
);

// 5. Core Values (Why Choose Us)
const ValuesSection = () => (
   <section className="bg-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-black text-slate-800 mb-4">Яагаад биднийг сонгох вэ?</h2>
           <p className="text-slate-500 text-lg">Бидний давуу тал.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={FaUserShield} title="Мэргэжлийн баг" text="Хариуцлагатай, туршлагатай мэргэжлийн баг танд үйлчилнэ." />
            <ValueCard icon={FaBalanceScale} title="Шударга үйлчилгээ" text="Шударга, ил тод үйлчилгээг эрхэмлэнэ." />
            <ValueCard icon={FaBolt} title="Хурдан, найдвартай" text="Цаг алдалгүй хурдан, найдвартай зөвлөгөө өгнө." />
            <ValueCard icon={FaLayerGroup} title="Цогц шийдэл" text="Аяллын бүх процессыг нэг дороос авах боломжтой." />
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

// 6. Final Call to Action
const CtaSection = () => (
   <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6"
         >
           Холбоо барих
         </motion.h2>
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg mb-10"
         >
           Бид таны мөрөөдлийн аяллыг бодит болгоход бэлэн байна.
         </motion.p>
         
         <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <a href="tel:77661626">
                <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-sky-500/30 transition-all flex items-center gap-3">
                   (+976) 7766-1626
                </button>
             </a>
             <Link href="/contact">
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full backdrop-blur-sm border border-white/20 transition-all flex items-center gap-3">
                   Зурвас илгээх <FaArrowRight />
                </button>
             </Link>
         </div>
      </div>
   </section>
);

export default AboutPage;