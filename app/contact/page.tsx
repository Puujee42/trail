"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaChevronDown,
  FaClock
} from "react-icons/fa";
// 👇 1. Import Hook
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Main Page Component ────────────────────── */
const ContactPage = () => {
  // 👇 2. Get Language
  const { language } = useLanguage();

  // 👇 3. Define Translations with NEW DETAILS
  const content = {
    mn: {
      headerTitlePrefix: "Бидэнтэй",
      headerTitleSuffix: "Холбогдоорой",
      headerDesc: "Таны дараагийн аяллын талаар ярилцахад бид үргэлж бэлэн. Асуух зүйл байвал доорх хэсгийг ашиглана уу.",
      
      formTitle: "Зурвас үлдээх",
      formDesc: "Бид тантай 24 цагийн дотор эргэн холбогдох болно.",
      formName: "Нэр",
      formEmail: "И-мэйл",
      formSubject: "Гарчиг",
      formMessage: "Таны асуулт...",
      formBtn: "Илгээх",

      // 👇 Updated Info
      infoAddress: "Улаанбаатар хот, Баруун 4 зам, Эрхи Төв, 5 давхар, 502 тоот",
      infoPhone: "+976 7766-1626",
      infoEmail: "Eurotrails1@gmail.com",
      
      infoHours: "Даваа - Баасан: 09:00 - 18:00",
      infoLabels: ["Манай оффис", "Холбоо барих", "И-мэйл хаяг", "Ажиллах цагийн хуваарь"],
      mapPlaceholder: "Интерактив Газрын Зураг",

      faqTitle: "Түгээмэл Асуултууд",
      faqDesc: "Таны асуултын хариулт энд байж магадгүй.",
      faqs: [
        { q: "Аялал захиалахад урьдчилгаа төлбөр шаардлагатай юу?", a: "Тийм, ихэнх аяллын хувьд нийт үнийн дүнгийн 30%-ийн урьдчилгаа төлбөр шаардлагатай." },
        { q: "Визний материал бүрдүүлэхэд туслах уу?", a: "Мэдээж. Манай баг танд виз мэдүүлэхэд шаардлагатай бүх бичиг баримтыг бүрдүүлэхэд тусална." },
        { q: "Аяллаа цуцлах боломжтой юу?", a: "Аялал эхлэхээс 14-өөс доошгүй хоногийн өмнө цуцлахад урьдчилгаа төлбөрийг буцаан олгох боломжтой." },
        { q: "Ганцаараа аялахад аюулгүй юу?", a: "Бидний зохион байгуулдаг бүх аялал аюулгүй байдлын стандартыг бүрэн хангасан байдаг." }
      ]
    },
    en: {
      headerTitlePrefix: "Get In",
      headerTitleSuffix: "Touch",
      headerDesc: "We are always ready to discuss your next trip. Please use the form below for any inquiries.",
      
      formTitle: "Leave a Message",
      formDesc: "We will get back to you within 24 hours.",
      formName: "Name",
      formEmail: "Email",
      formSubject: "Subject",
      formMessage: "Your message...",
      formBtn: "Send",

      // 👇 Updated Info (Translated)
      infoAddress: "Room 502, 5th Floor, Erkhi Center, West 4 Intersection, Ulaanbaatar",
      infoPhone: "+976 7766-1626",
      infoEmail: "Eurotrails1@gmail.com",

      infoHours: "Mon - Fri: 09:00 - 18:00",
      infoLabels: ["Our Office", "Contact Us", "Email Address", "Working Hours"],
      mapPlaceholder: "Interactive Map",

      faqTitle: "Frequently Asked Questions",
      faqDesc: "You might find your answer here.",
      faqs: [
        { q: "Is a deposit required to book a trip?", a: "Yes, a 30% deposit of the total amount is required for most trips." },
        { q: "Do you help with visa applications?", a: "Absolutely. Our team will assist you in preparing all necessary documents for your visa application." },
        { q: "Can I cancel my trip?", a: "Deposits are refundable if cancelled at least 14 days before the trip starts." },
        { q: "Is it safe to travel alone?", a: "All our organized trips fully meet safety standards. Our experienced guides will assist you throughout the journey." }
      ]
    },
    ko: {
      headerTitlePrefix: "문의하기",
      headerTitleSuffix: "연락하세요",
      headerDesc: "다음 여행에 대해 논의할 준비가 항상 되어 있습니다. 문의 사항이 있으시면 아래 양식을 사용하십시오.",
      
      formTitle: "메시지 남기기",
      formDesc: "24시간 이내에 연락드리겠습니다.",
      formName: "이름",
      formEmail: "이메일",
      formSubject: "제목",
      formMessage: "메시지...",
      formBtn: "보내기",

      // 👇 Updated Info (Translated)
      infoAddress: "울란바토르 서부 4거리, 에르키 센터 5층 502호",
      infoPhone: "+976 7766-1626",
      infoEmail: "Eurotrails1@gmail.com",

      infoHours: "월요일 - 금요일: 09:00 - 18:00",
      infoLabels: ["우리 사무실", "문의하기", "이메일 주소", "근무 시간"],
      mapPlaceholder: "인터랙티브 지도",

      faqTitle: "자주 묻는 질문",
      faqDesc: "여기에서 답을 찾을 수 있습니다.",
      faqs: [
        { q: "여행 예약에 보증금이 필요합니까?", a: "예, 대부분의 여행에는 총 금액의 30% 보증금이 필요합니다." },
        { q: "비자 신청을 도와주나요?", a: "물론입니다. 저희 팀이 비자 신청에 필요한 모든 서류 준비를 도와드립니다." },
        { q: "여행을 취소할 수 있나요?", a: "여행 시작 최소 14일 전에 취소하는 경우 보증금은 환불됩니다." },
        { q: "혼자 여행하는 것이 안전한가요?", a: "저희가 조직하는 모든 여행은 안전 기준을 완전히 충족합니다. 경험이 풍부한 가이드가 여행 내내 도와드릴 것입니다." }
      ]
    }
  };

  const t = content[language];

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
            {t.headerTitlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">{t.headerTitleSuffix}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            {t.headerDesc}
          </motion.p>
        </div>

        {/* ─── 2. Split Screen Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ContactForm t={t} />
          <ContactInfo t={t} />
        </div>

        {/* ─── 3. FAQ Section ─── */}
        <FaqSection t={t} />

      </div>
    </div>
  );
};

/* ────────────────────── Sub-Components ────────────────────── */

// 1. Contact Form
const ContactForm = ({ t }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl shadow-sky-100/50 border border-white relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-100/50 rounded-full blur-[60px] -mr-10 -mt-10" />
    
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">{t.formTitle}</h2>
      <p className="text-slate-500 mb-8">{t.formDesc}</p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput type="text" placeholder={t.formName} />
          <FormInput type="email" placeholder={t.formEmail} />
        </div>
        <FormInput type="text" placeholder={t.formSubject} />
        <div>
          <textarea 
            placeholder={t.formMessage} 
            rows={5} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all flex items-center justify-center gap-2"
        >
          <FaPaperPlane /> {t.formBtn}
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
const ContactInfo = ({ t }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="space-y-8"
  >
    {/* Map Placeholder */}
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100">
      <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center text-slate-400 font-medium">
        {t.mapPlaceholder}
      </div>
    </div>

    {/* Contact Details */}
    <div className="space-y-6">
      <InfoBlock 
        icon={FaMapMarkerAlt} 
        title={t.infoLabels[0]}
        text={t.infoAddress}
        live={false}
      />
      <InfoBlock 
        icon={FaPhoneAlt} 
        title={t.infoLabels[1]}
        text={t.infoPhone}
        live={true}
      />
      <InfoBlock 
        icon={FaEnvelope} 
        title={t.infoLabels[2]}
        text={t.infoEmail}
        live={true}
      />
      <InfoBlock 
        icon={FaClock} 
        title={t.infoLabels[3]}
        text={t.infoHours}
        live={false}
      />
    </div>
  </motion.div>
);

const InfoBlock = ({ icon: Icon, title, text, live }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-md border border-slate-100 shrink-0">
      <Icon />
    </div>
    <div>
      <div className="flex items-center gap-2">
         <h3 className="font-bold text-slate-800">{title}</h3>
         {live && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-slate-500 leading-relaxed">{text}</p>
    </div>
  </div>
);

// 3. FAQ Section
const FaqSection = ({ t }: any) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-24 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{t.faqTitle}</h2>
        <p className="text-slate-500">{t.faqDesc}</p>
      </div>
      <div className="space-y-4">
        {t.faqs.map((faq: any, index: number) => (
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
        {faq.q}
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
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ContactPage;