"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaMapMarkerAlt, FaClock, FaStar, FaArrowLeft, FaPlane, FaHotel, FaUtensils, FaCamera 
} from "react-icons/fa";
import { Trip } from "@/lib/mongo/trips";

const TourDetailClient = ({ trip }: { trip: Trip }) => {
  
  // Mock Itinerary (Fill this with real data if you add it to DB later)
  const itinerary = [
    { day: 1, title: "Улаанбаатараас нисэх & Буудалдаа хүрэх", desc: "Бид таныг онгоцны буудлаас тосч, зочид буудалд хүргэнэ." },
    { day: 2, title: "Хотын аялал & Түүхэн дурсгалт газрууд", desc: "Хотын хамгийн алдартай музей болон дурсгалт газруудаар аялана." },
    { day: 3, title: "Чөлөөт өдөр & Шопинг", desc: "Та өөрийн хүслээр хотоор зугаалж, худалдан авалт хийх боломжтой." },
    { day: 4, title: "Буцах нислэг", desc: "Дурсамж дүүрэн аяллаа өндөрлүүлж эх орондоо буцна." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* ────────────────── 1. HERO HEADER ────────────────── */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
           <img 
             src={trip.image} 
             alt={trip.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-10 z-20">
          <Link href="/">
             <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 transition-all font-bold text-sm border border-white/30">
                <FaArrowLeft /> Буцах
             </button>
          </Link>
        </div>

        {/* Title Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 container mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-4xl"
           >
              <div className="flex flex-wrap gap-3 mb-4">
                 <span className="bg-sky-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                    {trip.category}
                 </span>
                 <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <FaStar /> {trip.rating}
                 </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight shadow-sm">
                {trip.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-200 font-bold text-sm md:text-base">
                 <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400" /> {trip.location}</span>
                 <span className="flex items-center gap-2"><FaClock className="text-sky-400" /> {trip.duration}</span>
              </div>
           </motion.div>
        </div>
      </div>

      {/* ────────────────── 2. MAIN CONTENT ────────────────── */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
             <h2 className="text-2xl font-bold text-slate-800 mb-4">Аяллын тухай</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               {trip.description || "Энэхүү аялал нь танд мартагдашгүй дурсамжийг үлдээх болно. Байгалийн үзэсгэлэнт газрууд, түүхэн дурсгалт газрууд болон амтат хоол таныг хүлээж байна."}
             </p>

             {/* Icons Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                <FeatureIcon icon={FaPlane} label="Нислэг" />
                <FeatureIcon icon={FaHotel} label="Зочид буудал" />
                <FeatureIcon icon={FaUtensils} label="Хоол" />
                <FeatureIcon icon={FaCamera} label="Зурагчин" />
             </div>
          </motion.div>

          {/* Itinerary */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Аяллын хөтөлбөр</h2>
             <div className="space-y-0">
                {itinerary.map((day, i) => (
                  <div key={i} className="flex gap-4 relative pb-8 last:pb-0">
                     {/* Timeline Line */}
                     {i !== itinerary.length - 1 && (
                       <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-100" />
                     )}
                     
                     {/* Number Bubble */}
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-50 border-2 border-sky-100 text-sky-600 font-bold flex items-center justify-center relative z-10">
                        {day.day}
                     </div>
                     
                     {/* Text */}
                     <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-1">{day.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{day.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Card */}
        <div className="lg:col-span-1">
           <div className="sticky top-24">
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white rounded-3xl p-6 shadow-2xl shadow-sky-100 border border-slate-100"
              >
                 <div className="mb-6">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Нийт үнэ (1 хүн)</p>
                    <div className="flex items-end gap-3">
                       <span className="text-4xl font-black text-slate-900">
                          {trip.price.toLocaleString()}₮
                       </span>
                       {trip.oldPrice && (
                         <span className="text-lg text-slate-400 line-through mb-1 decoration-red-400">
                            {trip.oldPrice.toLocaleString()}₮
                         </span>
                       )}
                    </div>
                 </div>

                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>Аяллын төрөл:</span>
                       <span className="font-bold text-slate-800 capitalize">{trip.category}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>Хугацаа:</span>
                       <span className="font-bold text-slate-800">{trip.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>Боломжит суудал:</span>
                       <span className="font-bold text-green-500">6 Суудал үлдсэн</span>
                    </div>
                 </div>

                 <Link href="/book">
                    <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-sky-600 transition-all active:scale-95 mb-3">
                       Захиалга өгөх
                    </button>
                 </Link>
                 
                 <p className="text-xs text-center text-slate-400">
                    Захиалга өгснөөр та манай үйлчилгээний нөхцөлийг зөвшөөрч байна.
                 </p>
              </motion.div>
              
              {/* Help Box */}
              <div className="mt-6 bg-sky-50 rounded-2xl p-6 border border-sky-100 text-center">
                 <h4 className="font-bold text-sky-900 mb-2">Асуух зүйл байна уу?</h4>
                 <p className="text-sm text-sky-700 mb-4">Манай менежертэй холбогдож дэлгэрэнгүй мэдээлэл аваарай.</p>
                 <a href="tel:+97699118888" className="text-sky-600 font-bold hover:underline">
                    +976 9911-8888
                 </a>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Helper for icons
const FeatureIcon = ({ icon: Icon, label }: any) => (
  <div className="flex flex-col items-center gap-2 text-center">
     <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
        <Icon />
     </div>
     <span className="text-xs font-bold text-slate-600">{label}</span>
  </div>
);

export default TourDetailClient;