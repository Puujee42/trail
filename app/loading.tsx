"use client";

import { motion } from "framer-motion";
import { FaPlane } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
          <FaPlane className="text-4xl text-white transform -rotate-45" />
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-black text-white tracking-tight font-[var(--font-montserrat)]"
      >
        MONGOL TRAIL
      </motion.h2>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
        className="h-1 bg-sky-500 mt-4 rounded-full"
      />
    </div>
  );
}
