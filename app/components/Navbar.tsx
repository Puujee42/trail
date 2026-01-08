"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  Variants,
} from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSignInAlt,
  FaTimes,
  FaPlane,
  FaUser,
  FaChevronDown,
  FaUmbrellaBeach,
  FaPassport,
  FaCheck,
  FaTachometerAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext"; 

/* ────────────────────── Types ────────────────────── */
type Language = "mn" | "en" | "ko";

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  subMenu?: NavLinkItem[];
}

interface HoveredLink {
  width: number;
  left: number;
}

/* ────────────────────── Constants ────────────────────── */
const LANGUAGES: { code: Language; label: string }[] = [
  { code: "mn", label: "MN" },
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" }
];

/* ────────────────────── Bilingual Data ────────────────────── */
const NAV_LINKS_DATA: Record<Language, NavLinkItem[]> = {
  mn: [
    { id: "home", label: "Нүүр", href: "/" },
    {
      id: "packages",
      label: "Аялал",
      href: "/packages",
      subMenu: [
        { id: "europe", label: "Европ", href: "/packages/europe" },
        { id: "mongolia", label: "Монгол", href: "/packages/mongolia" },
      ],
    },
    { id: "blog", label: "Блог", href: "/blog" },
    { id: "about", label: "Бидний тухай", href: "/about" },
    { id: "contact", label: "Холбоо барих", href: "/contact" },
  ],
  en: [
    { id: "home", label: "Home", href: "/" },
    {
      id: "packages",
      label: "Trip",
      href: "/packages",
      subMenu: [
        { id: "europe", label: "Europe", href: "/packages/europe" },
        { id: "mongolia", label: "Mongolia", href: "/packages/mongolia" },
      ],
    },
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "about", label: "About Us", href: "/about" },
    { id: "contact", label: "Contact", href: "/contact" },
  ],
  ko: [
    { id: "home", label: "홈", href: "/" },
    {
      id: "packages",
      label: "여행",
      href: "/packages",
      subMenu: [
        { id: "europe", label: "유럽", href: "/packages/europe" },
        { id: "mongolia", label: "몽골", href: "/packages/mongolia" },
      ],
    },
    { id: "blog", label: "블로그", href: "/blog" },
    { id: "about", label: "회사 소개", href: "/about" },
    { id: "contact", label: "연락처", href: "/contact" },
  ],
};

const UI_TEXT: Record<Language, any> = {
  mn: {
    slogan: "Mongolia Trails Agency-тэй хамт дэлхийгээр аялаарай",
    login: "Нэвтрэх",
    register: "Бүртгүүлэх",
    book: "Аялал захиалах",
    menu: "Цэс",
    myAccount: "Миний бүртгэл",
    dashboard: "Хяналтын самбар",
  },
  en: {
    slogan: "Travel the world with Mongolia Trails Agency",
    login: "Login",
    register: "Register",
    book: "Book Now",
    menu: "Menu",
    myAccount: "My Account",
    dashboard: "Dashboard",
  },
  ko: {
    slogan: "Mongolia Trails Agency와 함께 세계를 여행하세요",
    login: "로그인",
    register: "회원가입",
    book: "지금 예약",
    menu: "메뉴",
    myAccount: "내 계정",
    dashboard: "대시보드",
  },
};

/* ────────────────────── Components ────────────────────── */

// 🏁 Flag Icon Component
const FlagIcon = ({ lang, className = "w-5 h-5" }: { lang: Language, className?: string }) => {
  if (lang === "mn") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className={`${className} rounded-full object-cover shadow-sm border border-white/20`}>
        <g fillRule="evenodd" strokeWidth="1pt">
          <path fill="#ce1126" d="M0 0h640v480H0z"/>
          <path fill="#003580" d="M213.3 0h213.4v480H213.3z"/>
          <path fill="#fcd116" d="M117.3 348.4L136 339l-5.7-19.7 18.7 8.3 8-18.8 3.8 20.2 19.9-5-12.7 16.2 17.6 10.6-20.2 1.7L160 372l-15-13.8-16.7 11.7 4-20.2-19 7.4zM96 117.3h21.3v85.4H96zM96 234.7h21.3v21.3H96zM117.3 224a21.3 21.3 0 100-42.7 21.3 21.3 0 000 42.7z"/>
          <path fill="#fcd116" d="M106.7 277.3l10.6-21.3 10.7 21.3H96zM106.7 106.7l-10.7 10.6h21.4z"/>
        </g>
      </svg>
    );
  }
  if (lang === "en") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className={`${className} rounded-full object-cover shadow-sm border border-white/20`}>
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
        <path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
      </svg>
    );
  }
  if (lang === "ko") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-72 -48 144 96" className={`${className} rounded-full object-cover shadow-sm border border-white/20`}>
         <path fill="#fff" d="M-72-48v96H72v-96z"/>
         <g stroke="#000" strokeWidth="4">
           <path transform="rotate(33.69006752598)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/>
           <path transform="rotate(146.30993247402)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/>
           <path transform="rotate(213.69006752598)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/>
           <path transform="rotate(326.30993247402)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/>
         </g>
         <circle r="24" fill="#c60c30"/>
         <path fill="#003478" d="M0 0a24 24 0 0 1 24 0a24 24 0 0 1-48 0z" transform="rotate(33.69) translate(0 12) scale(1 0.5)"/> 
         {/* The above path for taeguk is a hack. Let's use a proper semi-circle approach if the above circle covers background. */}
         <path fill="#003478" d="M-24,0 A24,24 0 0,0 24,0 A12,12 0 0,1 0,0 A12,12 0 0,0 -24,0 z" transform="rotate(33.69)"/>
         <path fill="#c60c30" d="M-24,0 A12,12 0 0,1 0,0 A12,12 0 0,0 24,0 A24,24 0 0,1 -24,0 z" transform="rotate(33.69)"/>
         {/* Re-drawing Taeguk over the red circle to be sure. */}
      </svg>
    );
  }
  return null;
};

const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const navItemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

/* ────────────────────── Snow Component ────────────────────── */
const NavbarSnow = () => {
  const [flakes, setFlakes] = useState<any[]>([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 7,
      delay: Math.random() * 5,
      size: 3 + Math.random() * 6,
      opacity: 0.7 + Math.random() * 0.3,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-b-[2rem]">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-15px] bg-white rounded-full"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `cartoonFall ${flake.duration}s linear infinite`,
            animationDelay: `-${flake.delay}s`,
            boxShadow: "0 0 2px rgba(255,255,255,0.8)",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes cartoonFall {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; transform: translateY(10px) translateX(-5px); }
          50% { transform: translateY(60px) translateX(5px); }
          100% { transform: translateY(120px) translateX(-5px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* ────────────────────── Language Horizontal Selector (Desktop) ────────────────────── */
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`relative flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-300 ${
              isActive ? "text-blue-900" : "text-white hover:bg-white/10"
            }`}
          >
            {/* Sliding Background Pill */}
            {isActive && (
              <motion.div
                layoutId="activeLangPill"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
            
            {/* Content (Above Background) */}
            <span className="relative z-10 flex items-center gap-1.5">
              <FlagIcon lang={lang.code} className="w-4 h-4 shadow-sm" />
              <span>{lang.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ────────────────────── Main Navbar ────────────────────── */
const Navbar: React.FC = () => {
  const { language } = useLanguage(); 

  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<HoveredLink | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) setHidden(true);
    else setHidden(false);
  });

  const backgroundOpacity = useTransform(scrollY, [0, 150], [0.85, 0.95]);
  const blurAmount = useTransform(scrollY, [0, 150], ["10px", "20px"]);

  const currentLang = language as Language;
  const currentLinks = NAV_LINKS_DATA[currentLang] || NAV_LINKS_DATA['mn'];
  const t = UI_TEXT[currentLang] || UI_TEXT['mn'];

  return (
    <>
      {/* ──────── Top Bar ──────── */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-sky-500 via-blue-500 to-teal-500 text-white shadow-lg rounded-b-[2rem] relative overflow-hidden"
      >
        <NavbarSnow />

        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-8 py-2.5 text-sm relative z-10">
          <motion.p
            className="font-medium flex items-center gap-2 text-sm md:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ rotate: [0, -45, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <FaPlane className="text-yellow-300" />
            </motion.span>
            <span className="hidden sm:inline">{t.slogan}</span>
            <span className="sm:hidden">Mongolia Trails Agency</span>
          </motion.p>

          <ul className="flex items-center gap-4 md:gap-5">
            
            {/* 🌍 Horizontal Language Selector */}
            <li>
              <LanguageSelector />
            </li>

            <li className="text-white/30 hidden md:block">|</li>

            {/* Socials & Auth */}
           <motion.li className="flex items-center gap-3 text-white/80 hidden sm:flex">
            {[
              { 
                Icon: FaFacebookF, 
                href: "https://www.facebook.com/profile.php?id=61580867289571" 
              },
              { 
                Icon: FaInstagram, 
                href: "https://www.instagram.com/euro.trails/" // 👈 Paste IG link here
              },
            ].map(({ Icon, href }, idx) => (
              <Link
                key={idx}
                href={href}
                className="hover:text-white"
              >
                <Icon />
              </Link>
            ))}
          </motion.li>
             <li className="text-white/30 hidden md:block">|</li>
            
            {/* DESKTOP AUTH - Hidden on Mobile */}
            <SignedOut>
              <li className="hidden md:flex items-center gap-5">
                <Link href="/sign-in" className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 font-medium">
                  <FaSignInAlt className="text-xs" /> <span>{t.login}</span>
                </Link>
                <Link href="/sign-up" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-sky-600 font-bold shadow-md">
                  <FaUser className="text-xs" /> <span>{t.register}</span>
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
                <li className="hidden md:block">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all font-medium text-xs border border-white/20"
                  >
                    <FaTachometerAlt />
                    <span>{t.dashboard}</span>
                  </Link>
                </li>
                <li className="hidden md:block"><UserButton afterSignOutUrl="/" /></li>
            </SignedIn>
          </ul>
        </div>
      </motion.div>

      {/* ──────── Main Navbar ──────── */}
      <motion.header
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-120%", opacity: 0 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className="fixed inset-x-0 top-14 z-40 flex justify-center pointer-events-none"
      >
        <motion.nav
          ref={navRef}
          initial="hidden"
          animate="show"
          variants={navContainerVariants}
          className="relative flex items-center justify-between w-full max-w-screen-2xl mx-auto px-6 md:px-8 py-3 bg-white/80 rounded-full shadow-lg border border-white/40 pointer-events-auto"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity.get()})`,
            backdropFilter: `blur(${blurAmount.get()})`,
          }}
        >
          <motion.div
            className="absolute -bottom-1 h-1 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full shadow-md z-0"
            animate={{ width: hoveredLink?.width || 0, left: hoveredLink?.left || 0, opacity: hoveredLink ? 1 : 0 }}
          />

          <motion.div variants={navItemVariants} className="z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg text-white shadow-lg">
                <FaPlane size={20} className="group-hover:-rotate-12 transition-transform duration-300" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-teal-600 tracking-tight">
                Mongolia Trails Agency
              </span>
            </Link>
          </motion.div>

          <div className="hidden xl:flex items-center gap-6 z-10">
            {currentLinks.map((link) => (
              <DesktopNavLink key={link.id} link={link} setHoveredLink={setHoveredLink} navRef={navRef} />
            ))}
          </div>

          <motion.div variants={navItemVariants} className="flex items-center gap-4 z-10">
            <motion.div className="hidden md:block">
             
            </motion.div>
            <motion.button onClick={() => setMobileOpen(true)} className="xl:hidden p-2.5 rounded-full bg-sky-50 text-sky-600">
              <AnimatedHamburgerIcon isOpen={mobileOpen} />
            </motion.button>
          </motion.div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} closeMenu={() => setMobileOpen(false)} links={currentLinks} t={t} language={currentLang} />
    </>
  );
};

/* ────────────────────── Helper Components ────────────────────── */

const DesktopNavLink: React.FC<any> = ({ link, setHoveredLink, navRef }) => {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <motion.div
      variants={navItemVariants}
      onMouseEnter={() => {
         if (linkRef.current) setHoveredLink({ left: linkRef.current.offsetLeft, width: linkRef.current.offsetWidth });
         if (link.subMenu) setOpen(true);
      }}
      onMouseLeave={() => { setHoveredLink(null); setOpen(false); }}
      className="relative group"
    >
      <Link ref={linkRef} href={link.href} className="flex items-center gap-1 px-3 py-2 text-[15px] font-semibold text-slate-600 hover:text-sky-600 transition-colors">
        {link.label} {link.subMenu && <FaChevronDown className="text-xs text-slate-400" />}
      </Link>
      <AnimatePresence>
        {open && link.subMenu && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-xl p-3 shadow-2xl border border-sky-100">
             {link.subMenu.map((item: any) => (
                <Link key={item.id} href={item.href} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-500"><FaUmbrellaBeach size={12} /></span>
                   <span>{item.label}</span>
                </Link>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* 
  FIXED MOBILE MENU COMPONENT
  - Added Sign Up Button
  - Added UserButton for Logout
*/
/* ────────────────────── Updated Mobile Menu (Bottom Sheet) ────────────────────── */
const MobileMenu: React.FC<any> = ({ isOpen, closeMenu, links, t, language }) => {
  const { setLanguage } = useLanguage();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999]"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 z-[1000] bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Aesthetic "Drag Handle" */}
            <div className="w-full flex justify-center py-4">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-10 overflow-y-auto">
              {/* Header inside Menu */}
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">{t.menu}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mongolia Trails Agency</p>
                 </div>
                 <button 
                  onClick={closeMenu}
                  className="p-2 bg-slate-100 rounded-full text-slate-500"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Auth Section for Mobile */}
              <div className="mb-6">
                <SignedOut>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href="/sign-in" 
                      onClick={closeMenu} 
                      className="flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-slate-700 bg-slate-100 rounded-2xl"
                    >
                      <FaSignInAlt /> {t.login}
                    </Link>
                    <Link 
                      href="/sign-up" 
                      onClick={closeMenu} 
                      className="flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-md shadow-sky-200"
                    >
                      <FaUser size={12} /> {t.register}
                    </Link>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100">
                    <div className="flex items-center gap-3">
                      <UserButton afterSignOutUrl="/" />
                      <div className="flex flex-col">
                        <span className="text-xs text-sky-600 font-bold uppercase tracking-tighter">{t.myAccount}</span>
                        <Link href="/dashboard" onClick={closeMenu} className="text-sm font-bold text-slate-700">
                          {t.dashboard}
                        </Link>
                      </div>
                    </div>
                    <FaChevronDown className="text-sky-300 -rotate-90" />
                  </div>
                </SignedIn>
              </div>

              {/* Language Selector (Modern Grid) */}
              <div className="grid grid-cols-3 gap-2 mb-8">
                {LANGUAGES.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${
                      language === lang.code 
                        ? "bg-white border-sky-500 ring-4 ring-sky-50 text-sky-600 font-bold" 
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                  >
                    <FlagIcon lang={lang.code} className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{lang.label}</span>
                  </button>
                ))}
              </div>

              {/* Main Navigation Links */}
              <nav className="space-y-1 mb-6">
                {links.map((link: any) => (
                  <MobileNavLink key={link.id} link={link} closeMenu={closeMenu} />
                ))}
              </nav>

              {/* Bottom Socials */}
              <div className="flex justify-center gap-6 py-4 border-t border-slate-50">
                <Link href="https://facebook.com" className="text-slate-300 hover:text-blue-600 transition-colors"><FaFacebookF size={20}/></Link>
                <Link href="https://instagram.com" className="text-slate-300 hover:text-pink-600 transition-colors"><FaInstagram size={20}/></Link>
                <Link href="https://twitter.com" className="text-slate-300 hover:text-sky-400 transition-colors"><FaTwitter size={20}/></Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MobileNavLink: React.FC<any> = ({ link, closeMenu }) => {
   const [open, setOpen] = useState(false);
   const hasSubMenu = link.subMenu && link.subMenu.length > 0;

   return (
     <div className="border-b border-slate-50 last:border-0">
       <div 
         onClick={() => hasSubMenu ? setOpen(!open) : null} 
         className="flex justify-between items-center py-4 px-2"
       >
         <Link 
            href={!hasSubMenu ? link.href : "#"} 
            onClick={!hasSubMenu ? closeMenu : undefined}
            className={`text-lg font-bold ${open && hasSubMenu ? 'text-sky-600' : 'text-slate-700'}`}
         >
            {link.label}
         </Link>
         {hasSubMenu && (
            <motion.div animate={{ rotate: open ? 180 : 0 }}>
               <FaChevronDown size={14} className="text-slate-300" />
            </motion.div>
         )}
       </div>

       <AnimatePresence>
         {open && hasSubMenu && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="overflow-hidden bg-slate-50 rounded-2xl mb-2"
           >
             {link.subMenu.map((it: any) => (
               <Link 
                  key={it.id} 
                  href={it.href} 
                  onClick={closeMenu} 
                  className="flex items-center gap-3 py-3.5 px-5 text-sm font-semibold text-slate-600 active:bg-sky-100"
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                 {it.label}
               </Link>
             ))}
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
};
const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="stroke-current">
    <motion.path strokeWidth="2.5" strokeLinecap="round" animate={isOpen ? { d: "M 6 18 L 18 6" } : { d: "M 4 6 L 20 6" }} />
    <motion.path strokeWidth="2.5" strokeLinecap="round" animate={isOpen ? { opacity: 0 } : { opacity: 1 }} d="M 4 12 L 20 12" />
    <motion.path strokeWidth="2.5" strokeLinecap="round" animate={isOpen ? { d: "M 6 6 L 18 18" } : { d: "M 4 18 L 20 18" }} />
  </svg>
);

export default Navbar;