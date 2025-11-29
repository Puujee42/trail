"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar, 
  FaArrowRight, 
  FaPlaneDeparture,
  FaHeart
} from "react-icons/fa";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips"; // Ensure this import path is correct

/* ────────────────────── Main Component ────────────────────── */
// Accept trips as props
const FeaturedTrips = ({ trips }: { trips: Trip[] }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const xTitle = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityDesc = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  if (!trips || trips.length === 0) return null;

  return (
    <section ref={targetRef} className="py-24 bg-slate-50 relative overflow-hidden">
      
      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-100/40 rounded-full blur-[120px] mix-blend-multiply" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        
        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-block mb-4"
            >
               <span className="bg-white border border-sky-100 text-sky-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                 <FaPlaneDeparture className="text-sky-400" /> Шилдэг Санал
               </span>
            </motion.div>
            
            <motion.h2 
              style={{ x: xTitle }}
              className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[0.9]"
            >
              АЯЛЛЫН <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Ертөнц</span>
            </motion.h2>
            
            <motion.p 
              style={{ opacity: opacityDesc }}
              className="text-slate-500 text-lg md:text-xl font-medium max-w-lg"
            >
              Дэлхийн өнцөг булан бүрт болон Монгол орны үзэсгэлэнт газруудаар аялах хамгийн сонирхолтой багцуудыг танд санал болгож байна.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
          >
            <Link href="/destinations">
              <button className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-sky-100 hover:border-sky-200 transition-all duration-300">
                <span className="font-bold text-slate-700 group-hover:text-sky-600 transition-colors">Бүх аяллыг үзэх</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <FaArrowRight className="text-sm -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ─── CAROUSEL SCROLL ─── */}
        <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-2 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0">
          {trips.map((trip, i) => (
            <TripCard key={trip._id} trip={trip} index={i} />
          ))}
          <div className="min-w-[20px]" />
        </div>

      </div>
    </section>
  );
};

/* ────────────────────── 3D Tilt Card Component ────────────────────── */
const TripCard = ({ trip, index }: { trip: Trip, index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  // Format Price to MNT currency
  const formattedPrice = new Intl.NumberFormat('mn-MN').format(trip.price) + '₮';

  return (
    <motion.div 
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="min-w-[300px] md:min-w-[380px] snap-center relative group"
    >
      <div className="bg-white rounded-[2.5rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-200/40 border border-white transition-shadow duration-500 h-full flex flex-col relative z-10 overflow-hidden">
         
         {/* 1. Image Container */}
         <div className="relative h-[280px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
            
            <div className="absolute top-4 left-4 z-20 flex gap-2">
               <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                 {trip.category}
               </span>
            </div>
            
            <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all active:scale-90">
               <FaHeart />
            </button>

            <div className="absolute bottom-4 right-4 z-20">
               <div className="bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1">
                 {formattedPrice}
               </div>
            </div>

            <img 
               src={trip.image} 
               alt={trip.title}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
         </div>

         {/* 2. Content */}
         <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
               <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-sky-600 transition-colors">
                  {trip.title}
               </h3>
               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span className="text-xs font-bold text-yellow-700">{trip.rating}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
               <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-sky-400" /> {trip.location}
               </div>
               <div className="w-1 h-1 bg-slate-300 rounded-full" />
               <div className="flex items-center gap-1.5">
                  <FaClock className="text-sky-400" /> {trip.duration}
               </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex gap-2">
                  {/* Safely map tags if they exist */}
                  {trip.tags?.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase">
                      {tag}
                    </span>
                  ))}
               </div>
               <Link href={`/tours/${trip._id}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-sky-500 transition-colors shadow-lg group-hover:shadow-sky-300/50">
                     <FaArrowRight className="text-sm -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
               </Link>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default FeaturedTrips;