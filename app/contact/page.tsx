"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaChevronDown,
  FaChevronUp,
  FaClock
} from "react-icons/fa";

/* ────────────────────── Mock Data ────────────────────── */
const faqs = [
  {
    question: "Аялал захиалахад урьдчилгаа төлбөр шаардлагатай юу?",
    answer: "Тийм, ихэнх аяллын хувьд нийт үнийн дүнгийн 30%-ийн урьдчилгаа төлбөр шаардлагатай. Энэ нь таны нислэгийн тийз болон зочид буудлын захиалгыг баталгаажуулахад ашиглагдана."
  },
  {
    question: "Визний материал бүрдүүлэхэд туслах уу?",
    answer: "Мэдээж. Манай баг танд виз мэдүүлэхэд шаардлагатай бүх бичиг баримтыг бүрдүүлэх, анкет бөглөх, цаг товлоход мэргэжлийн зөвлөгөө өгч, тусална."
  },
  {
    question: "Аяллаа цуцлах боломжтой юу?",
    answer: "Аялал эхлэхээс 14-өөс доошгүй хоногийн өмнө цуцлахад урьдчилгаа төлбөрийг буцаан олгох боломжтой. Дэлгэрэнгүй мэдээллийг манай үйлчилгээний нөхцөлөөс харна уу."
  },
  {
    question: "Ганцаараа аялахад аюулгүй юу?",
    answer: "Бидний зохион байгуулдаг бүх аялал аюулгүй байдлын стандартыг бүрэн хангасан байдаг. Манай туршлагатай хөтөч таны аяллын турш хамт байж, туслалцаа үзүүлнэ."
  }
];

/* ────────────────────── Main Page Component ────────────────────── */
const ContactPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ─── 1. Header ─── */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-800 mb-4"
          >
            Бидэнтэй <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Холбогдоорой</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Таны дараагийн аяллын талаар ярилцахад бид үргэлж бэлэн. Асуух зүйл байвал доорх хэсгийг ашиглана уу.
          </motion.p>
        </div>

        {/* ─── 2. Split Screen Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Side: Contact Form */}
          <ContactForm />
          
          {/* Right Side: Contact Info & Map */}
          <ContactInfo />
        </div>

        {/* ─── 3. FAQ Section ─── */}
        <FaqSection />

      </div>
    </div>
  );
};

/* ────────────────────── Sub-Components ────────────────────── */

// 1. Contact Form
const ContactForm = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl shadow-sky-100/50 border border-white relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-100/50 rounded-full blur-[60px] -mr-10 -mt-10" />
    
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Зурвас үлдээх</h2>
      <p className="text-slate-500 mb-8">Бид тантай 24 цагийн дотор эргэн холбогдох болно.</p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput type="text" placeholder="Нэр" />
          <FormInput type="email" placeholder="И-мэйл" />
        </div>
        <FormInput type="text" placeholder="Гарчиг" />
        <div>
          <textarea 
            placeholder="Таны асуулт..." 
            rows={5} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all flex items-center justify-center gap-2"
        >
          <FaPaperPlane /> Илгээх
        </motion.button>
      </form>
    </div>
  </motion.div>
);

const FormInput = ({ type, placeholder }: { type: string; placeholder: string }) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all"
  />
);

// 2. Contact Info
const ContactInfo = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="space-y-8"
  >
    {/* Map Placeholder */}
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100">
      <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center text-slate-400">
        (Интерактив Газрын Зураг)
      </div>
    </div>

    {/* Contact Details */}
    <div className="space-y-6">
      <InfoBlock 
        icon={FaMapMarkerAlt} 
        title="Манай оффис"
        text="Улаанбаатар хот, Сүхбаатар дүүрэг, Blue Sky Tower, 4 давхар"
        live={false}
      />
      <InfoBlock 
        icon={FaPhoneAlt} 
        title="Холбоо барих"
        text="+976 7711-8888"
        live={true}
      />
      <InfoBlock 
        icon={FaEnvelope} 
        title="И-мэйл хаяг"
        text="info@tripexplorer.mn"
        live={true}
      />
      <InfoBlock 
        icon={FaClock} 
        title="Ажиллах цагийн хуваарь"
        text="Даваа - Баасан: 09:00 - 18:00"
        live={false}
      />
    </div>
  </motion.div>
);

const InfoBlock = ({ icon: Icon, title, text, live }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-md border border-slate-100">
      <Icon />
    </div>
    <div>
      <div className="flex items-center gap-2">
         <h3 className="font-bold text-slate-800">{title}</h3>
         {live && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-slate-500">{text}</p>
    </div>
  </div>
);

// 3. FAQ Section
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-24 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Түгээмэл Асуултууд</h2>
        <p className="text-slate-500">Таны асуултын хариулт энд байж магадгүй.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem 
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

const FaqItem = ({ faq, isOpen, onClick }: any) => (
  <motion.div 
    initial={false}
    animate={{ backgroundColor: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)" }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
  >
    <button onClick={onClick} className="w-full flex justify-between items-center p-6 text-left">
      <h3 className={`font-bold text-lg transition-colors ${isOpen ? 'text-sky-600' : 'text-slate-800'}`}>
        {faq.question}
      </h3>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`text-slate-400 ${isOpen ? 'text-sky-500' : ''}`}>
        <FaChevronDown />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 pt-2 text-slate-600 border-t border-slate-100">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ContactPage;