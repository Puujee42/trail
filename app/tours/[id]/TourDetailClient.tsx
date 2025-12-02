"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar, 
  FaArrowLeft, 
  FaPlane, 
  FaUtensils, 
  FaPassport,      
  FaClipboardList  
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

/* ────────────────────── Types ────────────────────── */
interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
}

interface LocalizedPrice {
  mn: number;
  en: number;
  ko: number;
}

interface ItineraryItem {
  day: number;
  title: LocalizedString;
  desc: LocalizedString;
}

interface Trip {
  _id: string;
  image: string;
  title: LocalizedString;
  category: string;
  rating: number;
  location: LocalizedString;
  duration: LocalizedString;
  description?: LocalizedString;
  perks?: string[];
  itinerary?: ItineraryItem[];
  // Price can be a number (old data) or object (new data)
  price: LocalizedPrice | number; 
  oldPrice?: LocalizedPrice | number;
  seatsLeft?: number;
}

const TourDetailClient = ({ trip }: { trip: Trip }) => {
  const { language } = useLanguage();

  // 1. Helper to safely get numeric price
  // Handles both old number format and new object format
  const getPriceValue = (priceObj: any) => {
    if (typeof priceObj === 'number') return priceObj;
    if (typeof priceObj === 'object' && priceObj !== null) {
      // @ts-ignore
      return priceObj[language] || priceObj.mn || 0;
    }
    return 0;
  };

  const priceValue = getPriceValue(trip.price);
  const oldPriceValue = trip.oldPrice ? getPriceValue(trip.oldPrice) : null;

  // 2. Format Price with Currency Symbol
  const formatMoney = (amount: number) => {
    if (language === 'en') return `$${amount.toLocaleString()}`;
    if (language === 'ko') return `₩${amount.toLocaleString()}`;
    return `${amount.toLocaleString()}₮`; // Default MN
  };

  // Translations
  const t = {
    mn: {
      back: "Буцах",
      about: "Аяллын тухай",
      features: {
        flight: "Нислэг",
        food: "Хоол",
        visa: "Визний цогц үйлчилгээ",
        planning: "Аяллын төлөвлөгөө бичих үйлчилгээ"
      },
      itineraryTitle: "Аяллын хөтөлбөр",
      itineraryEmpty: "Дэлгэрэнгүй хөтөлбөр удахгүй орно.",
      priceLabel: "Нийт үнэ (1 хүн)",
      typeLabel: "Аяллын төрөл:",
      durationLabel: "Хугацаа:",
      seatsLabel: "Боломжит суудал:",
      seatsLeft: "Суудал үлдсэн",
      open: "Нээлттэй",
      bookBtn: "Захиалга өгөх",
      terms: "Захиалга өгснөөр та манай үйлчилгээний нөхцөлийг зөвшөөрч байна.",
      questionTitle: "Асуух зүйл байна уу?",
      questionDesc: "Манай менежертэй холбогдож дэлгэрэнгүй мэдээлэл аваарай."
    },
    en: {
      back: "Back",
      about: "About the Trip",
      features: {
        flight: "Flight",
        food: "Meals",
        visa: "Visa Services",
        planning: "Itinerary Planning"
      },
      itineraryTitle: "Itinerary",
      itineraryEmpty: "Detailed itinerary coming soon.",
      priceLabel: "Total Price (per person)",
      typeLabel: "Trip Type:",
      durationLabel: "Duration:",
      seatsLabel: "Available Seats:",
      seatsLeft: "Seats Left",
      open: "Open",
      bookBtn: "Book Now",
      terms: "By booking, you agree to our terms of service.",
      questionTitle: "Have Questions?",
      questionDesc: "Contact our manager for more information."
    },
    ko: {
      back: "뒤로가기",
      about: "여행 정보",
      features: {
        flight: "항공편",
        food: "식사",
        visa: "비자 서비스",
        planning: "여행 일정 계획"
      },
      itineraryTitle: "여행 일정",
      itineraryEmpty: "자세한 일정은 곧 제공됩니다.",
      priceLabel: "총 가격 (1인당)",
      typeLabel: "여행 유형:",
      durationLabel: "기간:",
      seatsLabel: "남은 좌석:",
      seatsLeft: "남은 좌석",
      open: "오픈",
      bookBtn: "지금 예약",
      terms: "예약함으로써 귀하는 당사의 서비스 약관에 동의하게 됩니다.",
      questionTitle: "질문이 있으신가요?",
      questionDesc: "자세한 정보를 원하시면 매니저에게 문의하세요."
    }
  };

  const text = t[language];
  const itinerary = trip.itinerary || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* ────────────────── HERO HEADER ────────────────── */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src={trip.image} 
             alt={trip.title[language]} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="absolute top-24 left-4 md:left-10 z-20">
          <Link href="/">
             <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 transition-all font-bold text-sm border border-white/30">
                <FaArrowLeft /> {text.back}
             </button>
          </Link>
        </div>

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
                {trip.title[language]}
              </h1>
              <div className="flex items-center gap-6 text-slate-200 font-bold text-sm md:text-base">
                 <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400" /> {trip.location[language]}</span>
                 <span className="flex items-center gap-2"><FaClock className="text-sky-400" /> {trip.duration[language]}</span>
              </div>
           </motion.div>
        </div>
      </div>

      {/* ────────────────── MAIN CONTENT ────────────────── */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
             <h2 className="text-2xl font-bold text-slate-800 mb-4">{text.about}</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               {trip.description?.[language]}
             </p>

             {/* DYNAMIC PERKS */}
             {trip.perks && (
               <div className="flex flex-wrap gap-2 mt-4">
                 {trip.perks.map((perk, i) => (
                   <span key={i} className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">
                     {perk}
                   </span>
                 ))}
               </div>
             )}

             {/* ICONS GRID */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                <FeatureIcon icon={FaPlane} label={text.features.flight} />
                <FeatureIcon icon={FaUtensils} label={text.features.food} />
                <FeatureIcon icon={FaPassport} label={text.features.visa} />
                <FeatureIcon icon={FaClipboardList} label={text.features.planning} />
             </div>

          </motion.div>

          {/* DYNAMIC ITINERARY */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">{text.itineraryTitle}</h2>
             
             {itinerary.length > 0 ? (
               <div className="space-y-0">
                  {itinerary.map((day, i) => (
                    <div key={i} className="flex gap-4 relative pb-8 last:pb-0">
                       {i !== itinerary.length - 1 && (
                         <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-100" />
                       )}
                       <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-50 border-2 border-sky-100 text-sky-600 font-bold flex items-center justify-center relative z-10">
                          {day.day}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-lg mb-1">{day.title[language]}</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">{day.desc[language]}</p>
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <p className="text-slate-500 italic">{text.itineraryEmpty}</p>
             )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
           <div className="sticky top-24">
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white rounded-3xl p-6 shadow-2xl shadow-sky-100 border border-slate-100"
              >
                 <div className="mb-6">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">{text.priceLabel}</p>
                    <div className="flex items-end gap-3">
                       
                       {/* FIXED: Display formatted price correctly */}
                       <span className="text-4xl font-black text-slate-900">
                          {formatMoney(priceValue)}
                       </span>

                       {/* FIXED: Display old price correctly if exists */}
                       {oldPriceValue && (
                         <span className="text-lg text-slate-400 line-through mb-1 decoration-red-400">
                            {formatMoney(oldPriceValue)}
                         </span>
                       )}
                    </div>
                 </div>

                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>{text.typeLabel}</span>
                       <span className="font-bold text-slate-800 capitalize">{trip.category}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>{text.durationLabel}</span>
                       <span className="font-bold text-slate-800">{trip.duration[language]}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-50">
                       <span>{text.seatsLabel}</span>
                       <span className={`font-bold ${
                         (trip.seatsLeft || 0) < 5 ? "text-red-500" : "text-green-500"
                       }`}>
                          {trip.seatsLeft ? `${trip.seatsLeft} ${text.seatsLeft}` : text.open}
                       </span>
                    </div>
                 </div>

                 <Link href={`/book/${trip._id}`}>
                    <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-sky-600 transition-all active:scale-95 mb-3">
                       {text.bookBtn}
                    </button>
                 </Link>
                 
                 <p className="text-xs text-center text-slate-400">
                    {text.terms}
                 </p>
              </motion.div>
              
              <div className="mt-6 bg-sky-50 rounded-2xl p-6 border border-sky-100 text-center">
                 <h4 className="font-bold text-sky-900 mb-2">{text.questionTitle}</h4>
                 <p className="text-sm text-sky-700 mb-4">{text.questionDesc}</p>
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

const FeatureIcon = ({ icon: Icon, label }: any) => (
  <div className="flex flex-col items-center gap-2 text-center">
     <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
        <Icon />
     </div>
     <span className="text-xs font-bold text-slate-600 leading-tight">{label}</span>
  </div>
);

export default TourDetailClient;