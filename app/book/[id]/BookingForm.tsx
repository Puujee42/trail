"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  FaCalendarAlt, FaUserFriends, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaPlane 
} from "react-icons/fa";
import { Trip } from "@/lib/mongo/trips";
// 👇 1. Import Hook
import { useLanguage } from "../../context/LanguageContext";

export default function BookingForm({ trip }: { trip: Trip }) {
  // 👇 2. Get Language
  const { language } = useLanguage();
  
  const { user } = useUser();
  const router = useRouter();

  // State
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 👇 3. Define Translations
  const content = {
    mn: {
      header: "Захиалга баталгаажуулах",
      
      // Success View
      successTitle: "Захиалга амжилттай!",
      successDesc: "Таны захиалгыг хүлээн авлаа. Бид тантай удахгүй холбогдож баталгаажуулах болно.",
      backHome: "Нүүр хуудас руу буцах",

      // Form
      travelerInfo: "Аялагчийн мэдээлэл",
      nameLabel: "Овог нэр",
      namePlace: "Жишээ: Бат-Эрдэнэ",
      phoneLabel: "Утасны дугаар",
      phonePlace: "9911-XXXX",
      emailLabel: "И-мэйл хаяг",
      emailPlace: "name@email.com",
      
      tripSchedule: "Аяллын тов",
      selectDate: "Эхлэх өдөр сонгох",
      travelerCount: "Аялагчийн тоо",
      
      submitBtn: "Захиалга илгээх",
      errorDate: "Аяллын өдрөө сонгоно уу.",

      // Summary
      pricePerPerson: "Нэг хүний үнэ:",
      travelerCountLabel: "Аялагчийн тоо:",
      totalLabel: "Нийт дүн:",
      
      trustTitle: "Төлбөрийн баталгаа",
      trustDesc: "Таны захиалга илгээгдсэний дараа манай менежер холбогдож төлбөрийн нөхцөлийг танилцуулна."
    },
    en: {
      header: "Confirm Booking",
      
      // Success View
      successTitle: "Booking Successful!",
      successDesc: "We have received your booking. We will contact you shortly to confirm details.",
      backHome: "Back to Home",

      // Form
      travelerInfo: "Traveler Information",
      nameLabel: "Full Name",
      namePlace: "Ex: John Doe",
      phoneLabel: "Phone Number",
      phonePlace: "+1 234 567 890",
      emailLabel: "Email Address",
      emailPlace: "name@email.com",
      
      tripSchedule: "Trip Schedule",
      selectDate: "Select Start Date",
      travelerCount: "Travelers",
      
      submitBtn: "Submit Booking",
      errorDate: "Please select a start date.",

      // Summary
      pricePerPerson: "Price per person:",
      travelerCountLabel: "Travelers:",
      totalLabel: "Total Amount:",
      
      trustTitle: "Payment Security",
      trustDesc: "After submitting your order, our manager will contact you with payment terms and confirmation."
    }
  };

  const t = content[language];

  // Generate next 3 upcoming dates (Mock logic)
  const upcomingDates = [
    "2025-06-15", 
    "2025-07-20", 
    "2025-08-10"
  ];

  const totalPrice = trip.price * travelers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Booking Submitted", { tripId: trip._id, travelers, selectedDate, price: totalPrice });

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{t.successTitle}</h2>
          <p className="text-slate-500 mb-8">
            {t.successDesc}
          </p>
          <Link href="/">
            <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
              {t.backHome}
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/tours/${trip._id}`}>
            <button className="p-3 bg-white rounded-full text-slate-500 hover:text-sky-600 shadow-sm border border-slate-200 transition-colors">
              <FaArrowLeft />
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">{t.header}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ──────────────── LEFT: BOOKING FORM ──────────────── */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaUserFriends className="text-sky-500" /> {t.travelerInfo}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.nameLabel}</label>
                    <input 
                      type="text" 
                      required
                      defaultValue={user?.fullName || ""}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder={t.namePlace}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.phoneLabel}</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder={t.phonePlace}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">{t.emailLabel}</label>
                    <input 
                      type="email" 
                      required
                      defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder={t.emailPlace}
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                {/* Trip Details */}
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-sky-500" /> {t.tripSchedule}
                </h2>

                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-600">{t.selectDate}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {upcomingDates.map((date) => (
                        <div 
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                            selectedDate === date 
                              ? "border-sky-500 bg-sky-50 text-sky-700" 
                              : "border-slate-100 hover:border-sky-200 text-slate-600"
                          }`}
                        >
                          <div className="text-sm font-bold">{date}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Travelers Count */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.travelerCount}</label>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-black text-slate-800 w-12 text-center">{travelers}</span>
                      <button 
                        type="button"
                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading || !selectedDate}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {t.submitBtn} <FaPlane />
                      </>
                    )}
                  </button>
                  {!selectedDate && (
                    <p className="text-red-500 text-xs mt-2 text-center">{t.errorDate}</p>
                  )}
                </div>

              </form>
            </motion.div>
          </div>

          {/* ──────────────── RIGHT: ORDER SUMMARY ──────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Card */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200"
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 relative">
                  <img src={trip.image} alt={trip.title[language]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">
                  {trip.title[language]}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                  <FaPlane className="text-sky-500" /> {trip.duration[language]}
                </p>

                <div className="space-y-3 py-4 border-t border-dashed border-slate-200">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{t.pricePerPerson}</span>
                    <span className="font-bold">{trip.price.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{t.travelerCountLabel}</span>
                    <span className="font-bold">x {travelers}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-500">{t.totalLabel}</span>
                    <span className="text-3xl font-black text-sky-600">
                      {totalPrice.toLocaleString()}₮
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <div className="bg-sky-50 rounded-2xl p-4 flex items-start gap-3 border border-sky-100">
                <FaShieldAlt className="text-sky-500 text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sky-900 text-sm">{t.trustTitle}</h4>
                  <p className="text-xs text-sky-700 mt-1 leading-relaxed">
                    {t.trustDesc}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}