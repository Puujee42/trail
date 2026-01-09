"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FaSuitcaseRolling, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaUser, FaSignOutAlt 
} from "react-icons/fa";
import { useClerk } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";
import { Booking } from "@/lib/mongo/bookings";

interface DashboardProps {
  bookings: Booking[];
  userName: string;
  userImage: string;
}

export default function DashboardClient({ 
  bookings = [], // 👈 FIX: Default to empty array
  userName, 
  userImage 
}: DashboardProps) {
  const { language } = useLanguage();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Filter Bookings (Safe now because bookings is guaranteed to be an array)
  const today = new Date().toISOString().split("T")[0];
  
  const upcomingTrips = bookings.filter((b) => b.date >= today && b.status !== "cancelled");
  const pastTrips = bookings.filter((b) => b.date < today || b.status === "completed");

  const currentList = activeTab === "upcoming" ? upcomingTrips : pastTrips;

  // ... (Rest of your translations and return statement remain the same)
  // ...
  
  // (Adding truncated version of the rest for context - copy your previous UI logic here)
  const t = {
    mn: {
      welcome: `Сайн байна уу, ${userName}!`,
      subtitle: "Таны аяллын түүх болон захиалгууд.",
      tabs: { upcoming: "Ирээдүйн аялал", past: "Өнгөрсөн аялал" },
      empty: "Одоогоор захиалга алга байна.",
      browseBtn: "Аялал хайх",
      status: { confirmed: "Баталгаажсан", pending: "Хүлээгдэж буй", completed: "Дууссан", cancelled: "Цуцлагдсан" },
      travelers: "Аялагч",
      total: "Нийт дүн",
      logout: "Гарах"
    },
    en: {
      welcome: `Welcome back, ${userName}!`,
      subtitle: "Your travel history and bookings.",
      tabs: { upcoming: "Upcoming Trips", past: "Past Trips" },
      empty: "No bookings found.",
      browseBtn: "Browse Trips",
      status: { confirmed: "Confirmed", pending: "Pending", completed: "Completed", cancelled: "Cancelled" },
      travelers: "Travelers",
      total: "Total",
      logout: "Sign Out"
    },
    ko: {
      welcome: `환영합니다, ${userName}님!`,
      subtitle: "여행 기록 및 예약 내역.",
      tabs: { upcoming: "다가오는 여행", past: "지난 여행" },
      empty: "예약 내역이 없습니다.",
      browseBtn: "여행 찾아보기",
      status: { confirmed: "확정됨", pending: "대기 중", completed: "완료됨", cancelled: "취소됨" },
      travelers: "여행자",
      total: "총 금액",
      logout: "로그아웃"
    }
  };

  const text = t[language as "mn" | "en" | "ko"] || t.mn;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="relative">
               <img src={userImage} alt={userName} className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-md" />
               <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800">{text.welcome}</h1>
              <p className="text-slate-500">{text.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt /> {text.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-2 text-lg font-bold transition-all relative ${
              activeTab === "upcoming" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {text.tabs.upcoming}
            {activeTab === "upcoming" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-2 text-lg font-bold transition-all relative ${
              activeTab === "past" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {text.tabs.past}
            {activeTab === "past" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentList.length > 0 ? (
              currentList.map((booking) => (
                <BookingCard key={booking._id} booking={booking} text={text} language={language} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FaSuitcaseRolling size={30} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{text.empty}</h3>
                <Link href="/packages">
                  <button className="text-blue-600 font-bold hover:underline">{text.browseBtn} →</button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

const BookingCard = ({ booking, text, language }: { booking: Booking; text: any; language: string }) => {
  const statusColors: any = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons: any = {
    confirmed: <FaCheckCircle />,
    pending: <FaClock />,
    completed: <FaSuitcaseRolling />,
    cancelled: <FaTimesCircle />,
  };

  const tripTitle = booking.tripTitle 
    ? (booking.tripTitle[language as "mn"|"en"|"ko"] || booking.tripTitle.mn)
    : "Unknown Trip";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center"
    >
      <div className="relative w-full md:w-48 h-32 md:h-32 rounded-xl overflow-hidden shrink-0">
        <img src={booking.tripImage} alt={tripTitle} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
           <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${statusColors[booking.status]}`}>
              {statusIcons[booking.status]} {text.status[booking.status]}
           </span>
        </div>
      </div>
      <div className="flex-1 w-full text-center md:text-left">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{tripTitle}</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 mb-4">
           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
              <FaCalendarAlt className="text-blue-400" />
              <span className="font-bold text-slate-700">{booking.date}</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
              <FaUser className="text-blue-400" />
              <span>{booking.travelers} {text.travelers}</span>
           </div>
        </div>
      </div>
      <div className="text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
         <p className="text-xs text-slate-400 uppercase font-bold mb-1">{text.total}</p>
         <p className="text-2xl font-black text-slate-900 mb-4">
           {booking.totalPrice.toLocaleString()}₮
         </p>
         <Link href={`/tours/${booking.tripId}`}>
           <button className="w-full md:w-auto px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors">
             View Details
           </button>
         </Link>
      </div>
    </motion.div>
  );
};