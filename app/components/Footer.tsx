"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaPaperPlane, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaPlane
} from "react-icons/fa";
// 👇 1. Import Hook
import { useLanguage } from "../context/LanguageContext"; 

const Footer = () => {
  // 👇 2. Get Language
  const { language } = useLanguage();

  // 👇 3. Define Bilingual Content
  const content = {
    mn: {
      newsletterTitle: "Аяллын мэдээ авах уу?",
      newsletterDesc: "Шинэ хямдрал, урамшууллын мэдээллийг цаг алдалгүй аваарай.",
      emailPlaceholder: "И-мэйл хаяг...",
      brandDesc: "Бид танд дэлхийн өнцөг булан бүрт хүрэх хамгийн таатай, аюулгүй, мартагдашгүй аяллыг санал болгож байна.",
      menuTitle: "Цэс",
      menuItems: [
        { label: "Нүүр", href: "/" },
        { label: "Чиглэлүүд", href: "/packages" },
        { label: "Багцууд", href: "/packages" },
        { label: "Блог", href: "/blog" },
        { label: "Бидний тухай", href: "/about" },
      ],
      trendingTitle: "Эрэлттэй",
      trendingItems: [
        { label: "Европ", href: "/packages/europe" },
        { label: "Швейцарь", href: "/packages/europe" },
      ],
      contactTitle: "Холбоо барих",
      address: "Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Blue Sky Tower, 4 давхар",
      copyright: "© 2025 Euro trails. Бүх эрх хуулиар хамгаалагдсан.",
      policy: "Нууцлалын бодлого",
      terms: "Үйлчилгээний нөхцөл"
    },
    en: {
      newsletterTitle: "Subscribe to Newsletter?",
      newsletterDesc: "Get the latest updates on sales and promotions instantly.",
      emailPlaceholder: "Email address...",
      brandDesc: "We offer you the most pleasant, safe, and unforgettable journeys to every corner of the world.",
      menuTitle: "Menu",
      menuItems: [
        { label: "Home", href: "/" },
        { label: "Destinations", href: "/packages" },
        { label: "Packages", href: "/packages" },
        { label: "Blog", href: "/blog" },
        { label: "About Us", href: "/about" },
      ],
      trendingTitle: "Trending",
      trendingItems: [
        { label: "Europe", href: "/packages/europe" },
        { label: "Switzerland", href: "/packages/europe" },
      ],
      contactTitle: "Contact Us",
      address: "Blue Sky Tower, 4th Floor, 1st Khoroo, Sukhbaatar District, Ulaanbaatar",
      copyright: "© 2025 Euro trails. All rights reserved.",
      policy: "Privacy Policy",
      terms: "Terms of Service"
    }
  };

  const t = content[language];

  return (
    <footer className="relative bg-slate-900 pt-32 pb-10 overflow-hidden">
      
      {/* ─── 1. CURVED TOP WAVE (Seamless Transition) ─── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px] fill-slate-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* ─── 2. FLOATING NEWSLETTER "TICKET" ─── */}
      <div className="container mx-auto px-4 relative z-20 -mt-24 mb-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Decorative Circles */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full" />
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

          <div className="text-white relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black mb-2">{t.newsletterTitle}</h3>
            <p className="text-blue-100 font-medium">{t.newsletterDesc}</p>
          </div>

          <div className="flex w-full md:w-auto relative z-10 bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur-sm">
             <input 
               type="email" 
               placeholder={t.emailPlaceholder} 
               className="bg-transparent border-none text-white placeholder:text-blue-200 focus:ring-0 px-6 py-3 w-full md:w-80 outline-none"
             />
             <button className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <FaPaperPlane />
             </button>
          </div>
        </motion.div>
      </div>

      {/* ─── 3. MAIN FOOTER CONTENT ─── */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                <FaPlane size={20} />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Euro trails
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.brandDesc}
            </p>
            <div className="flex gap-4">
               <SocialIcon icon={FaFacebookF} />
               <SocialIcon icon={FaInstagram} />
               <SocialIcon icon={FaTwitter} />
               <SocialIcon icon={FaYoutube} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.menuTitle}</h4>
            <ul className="space-y-4">
              {t.menuItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Destinations */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.trendingTitle}</h4>
            <ul className="space-y-4">
              {t.trendingItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.contactTitle}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FaMapMarkerAlt className="text-sky-500 mt-1 flex-shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaPhoneAlt className="text-sky-500 flex-shrink-0" />
                <span>+976 7711-8888</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaEnvelope className="text-sky-500 flex-shrink-0" />
                <span>info@Euro trails.mn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ─── 4. BOTTOM BAR ─── */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>{t.copyright}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">{t.policy}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>

      {/* ─── 5. BACKGROUND DECORATION ─── */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-cover mix-blend-overlay" />
      
      <motion.div
        animate={{ x: ["-10vw", "110vw"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-0 text-slate-800 opacity-20 pointer-events-none"
      >
        <FaPlane size={150} />
      </motion.div>

    </footer>
  );
};

/* ─── Social Icon Helper ─── */
const SocialIcon = ({ icon: Icon }: { icon: any }) => (
  <motion.a 
    href="#"
    whileHover={{ y: -5 }}
    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-colors shadow-lg border border-slate-700 hover:border-sky-400"
  >
    <Icon size={16} />
  </motion.a>
);

export default Footer;