"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { 
  FaShieldAlt, 
  FaHeadset, 
  FaWallet, 
  FaGlobeAsia,
  FaArrowRight,
  FaPlane,
  FaCheckCircle
} from "react-icons/fa";

/* ────────────────────── Main Component ────────────────────── */
const WhyChooseUs = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sky-200/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest">
              Бидний Давуу Тал
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Яагаад <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Euro trails</span> гэж?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-xl leading-relaxed"
          >
            Бид зүгээр нэг аялал зардаггүй. Бид танд насан туршид мартагдашгүй дурсамж, аюулгүй байдал, дээд зэргийн үйлчилгээг амлаж байна.
          </motion.p>
        </div>

        {/* ─── SPOTLIGHT BENTO GRID ─── */}
        <SpotlightGrid>
          
          {/* Card 1: Global Reach (Map Radar) */}
          <BentoCard className="md:col-span-2 md:row-span-2 bg-white relative overflow-hidden group">
             <div className="absolute inset-0 bg-sky-50/50 z-0" />
             
             {/* Animated Radar Map Background */}
             <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <svg className="w-full h-full text-sky-300" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" />
                   </pattern>
                   <rect width="100" height="100" fill="url(#grid)" />
                </svg>
                {/* Pulsing Beacons */}
                <motion.div 
                  animate={{ scale: [1, 2], opacity: [1, 0] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/3 left-1/3 w-4 h-4 bg-sky-500 rounded-full" 
                />
                <motion.div 
                  animate={{ scale: [1, 2], opacity: [1, 0] }} 
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute top-2/3 right-1/4 w-4 h-4 bg-blue-500 rounded-full" 
                />
             </div>

             <div className="relative z-10 h-full flex flex-col justify-between p-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 mb-4 shadow-lg shadow-sky-100 border border-sky-50">
                   <FaGlobeAsia size={28} />
                </div>
                <div>
                   <h3 className="text-3xl font-bold text-slate-800 mb-3">Дэлхийн хязгааргүй аялал</h3>
                   <p className="text-slate-600 text-lg leading-relaxed">
                     Бид дэлхийн 50+ улс, Монгол орны 21 аймагт албан ёсны түншүүдтэй хамтран ажиллаж, таныг хаа ч хүргэнэ.
                   </p>
                </div>
                {/* Visual Decorative Plane */}
                <motion.div 
                  animate={{ x: [0, 20, 0], y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 right-8 text-sky-200"
                >
                   <FaPlane size={120} />
                </motion.div>
             </div>
          </BentoCard>

          {/* Card 2: 24/7 Support (Chat UI) */}
          <BentoCard className="md:col-span-1 md:row-span-2 bg-slate-900 text-white relative overflow-hidden">
             {/* Decorative Gradient */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-950 z-0" />
             
             <div className="relative z-10 p-8 h-full flex flex-col items-center text-center justify-center">
                
                {/* Floating Chat Bubble Animation */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8 relative"
                >
                   <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/50">
                      <FaHeadset size={36} className="text-white" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 animate-pulse" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-3">24/7 Дэмжлэг</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Аяллын турш бид тантай хамт. Асуудал гарвал хэзээ ч, хаана ч холбогд.
                </p>
                
                <button className="w-full py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white hover:text-slate-900 transition-all font-bold text-sm backdrop-blur-md">
                   Чатлах
                </button>
             </div>
          </BentoCard>

          {/* Card 3: Best Price (Wallet) */}
          <BentoCard className="md:col-span-1 md:row-span-1 bg-white border border-slate-100 group">
             <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <FaWallet size={24} />
                   </div>
                   <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">-20% OFF</span>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-1">Хямд Үнэ</h3>
                   <p className="text-slate-500 text-sm">Зах зээлийн хамгийн бодит үнэ.</p>
                </div>
             </div>
          </BentoCard>

          {/* Card 4: Safety (Shield) */}
          <BentoCard className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white relative overflow-hidden">
             <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 blur-2xl transform translate-x-10" />
             
             <div className="p-8 flex items-center justify-between h-full relative z-10">
                <div className="max-w-xs">
                   <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                     <FaShieldAlt /> 100% Даатгал
                   </h3>
                   <p className="text-blue-100 text-sm">
                     Таны аюулгүй байдал бидний нэн тэргүүний зорилт. Бүх аялагчид бүрэн даатгагдсан.
                   </p>
                </div>
                <div className="hidden md:flex flex-col gap-2">
                   {["Гэнэтийн осол", "Эрүүл мэнд", "Ачаа тээш"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                         <FaCheckCircle className="text-green-300" /> {item}
                      </div>
                   ))}
                </div>
             </div>
          </BentoCard>

          {/* Card 5: Call to Action */}
          <BentoCard className="md:col-span-2 md:row-span-1 bg-white border border-slate-100 group cursor-pointer">
             <div className="p-8 flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <FaArrowRight className="group-hover:-rotate-45 transition-transform duration-300" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                        Бидэнтэй нэгдэх үү?
                      </h3>
                      <p className="text-slate-500 text-sm">Шинэ аяллын мэдээллийг цаг алдалгүй аваарай.</p>
                   </div>
                </div>
             </div>
          </BentoCard>

        </SpotlightGrid>
      </div>
    </section>
  );
};

/* ────────────────────── Spotlight Grid Wrapper ────────────────────── */
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
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-3 gap-6 h-[1100px] md:h-[650px] group/spotlight"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
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

/* ────────────────────── 3D Tilt Card Component ────────────────────── */
const BentoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useMotionTemplate`${mouseY}deg`;
  const rotateY = useMotionTemplate`${mouseX}deg`;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const xPos = event.clientX - left;
    const yPos = event.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const rotateXValue = ((yPos - centerY) / centerY) * -5; // Max 5 deg
    const rotateYValue = ((xPos - centerX) / centerX) * 5;  // Max 5 deg

    x.set(rotateYValue);
    y.set(rotateXValue);
  }

  return (
    <motion.div
      style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-[2rem] shadow-sm border border-slate-200/60 bg-clip-padding backdrop-filter transition-shadow hover:shadow-2xl hover:shadow-sky-100/50 z-10 ${className}`}
    >
      {/* Glare Effect */}
      <motion.div 
         style={{ 
           background: useMotionTemplate`radial-gradient(
             circle at 50% 0%, 
             rgba(255,255,255,0.8) 0%, 
             transparent 60%
           )`,
           opacity: x.get() !== 0 ? 0.3 : 0,
         }}
         className="absolute inset-0 rounded-[2rem] pointer-events-none z-20 transition-opacity duration-300"
      />
      
      {/* Content */}
      <div style={{ transform: "translateZ(20px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;