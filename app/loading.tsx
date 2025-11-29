"use client";

import { motion } from "framer-motion";
import { FaPlane, FaGlobeAsia } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      
      {/* ────────────────── ANIMATION CONTAINER ────────────────── */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        {/* Central Globe */}
        <div className="absolute text-slate-200 text-4xl">
           <FaGlobeAsia />
        </div>

        {/* Orbiting Plane */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 text-2xl transform -rotate-45">
            <FaPlane />
          </div>
        </motion.div>

        {/* Orbit Path (Dashed Circle) */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 opacity-50" />
        
        {/* Pulsing Effect */}
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="absolute inset-0 rounded-full bg-sky-100 -z-10"
        />
      </div>

      {/* ────────────────── TEXT ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <h3 className="text-lg font-bold text-slate-800">Түр хүлээнэ үү...</h3>
        <p className="text-sm text-slate-500">Аяллын мэдээллийг татаж байна</p>
      </motion.div>

    </div>
  );
}

export default Loader;