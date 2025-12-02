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
  FaMapMarkedAlt,
  FaUmbrellaBeach,
  FaPassport,
  FaGlobe, 
} from "react-icons/fa";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
// 👇 IMPORT THE HOOK
import { useLanguage } from "../context/LanguageContext"; 

/* ────────────────────── Types ────────────────────── */
// Use the type from context if available, or define locally matches
type Language = "mn" | "en";

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

/* ────────────────────── Bilingual Data ────────────────────── */
// Same data as before...
const NAV_LINKS_DATA: Record<Language, NavLinkItem[]> = {
  mn: [
    { id: "home", label: "Нүүр", href: "/" },
    {
      id: "packages",
      label: "Багцууд",
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
      label: "Packages",
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
};

const UI_TEXT: Record<Language, any> = {
  mn: {
    slogan: "Euro trails-тэй хамт дэлхийгээр аялаарай",
    login: "Нэвтрэх",
    register: "Бүртгүүлэх",
    book: "Аялал захиалах",
    menu: "Цэс",
    myAccount: "Миний бүртгэл",
  },
  en: {
    slogan: "Travel the world with Euro trails",
    login: "Login",
    register: "Register",
    book: "Book Now",
    menu: "Menu",
    myAccount: "My Account",
  },
};

/* ────────────────────── Animation Variants ────────────────────── */
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

/* ────────────────────── Main Navbar ────────────────────── */
const Navbar: React.FC = () => {
  // 👇 FIX: Use Global Context instead of local useState
  const { language, setLanguage } = useLanguage(); 

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

  // Helpers to get current language data
  const currentLinks = NAV_LINKS_DATA[language];
  const t = UI_TEXT[language];

  // 👇 FIX: Toggle function uses the context setter
  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

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
            <span className="sm:hidden">Euro Trails</span>
          </motion.p>

          <ul className="flex items-center gap-4 md:gap-5">
            
            {/* 🌍 Language Toggler (Connected to Global Context) */}
            <li>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-all text-xs font-bold uppercase tracking-wider border border-white/20 cursor-pointer"
              >
                <FaGlobe className="text-yellow-300" />
                {language}
              </button>
            </li>

            <li className="text-white/30 hidden md:block">|</li>

            {/* Socials & Auth ... (Rest of code remains same) */}
            <motion.li className="flex items-center gap-3 text-white/80 hidden sm:flex">
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, idx) => (
                <motion.a
                  key={idx} href="#" whileHover={{ scale: 1.2 }} className="hover:text-white"
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.li>
             <li className="text-white/30 hidden md:block">|</li>
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
          {/* Active Link Indicator */}
          <motion.div
            className="absolute -bottom-1 h-1 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full shadow-md z-0"
            animate={{ width: hoveredLink?.width || 0, left: hoveredLink?.left || 0, opacity: hoveredLink ? 1 : 0 }}
          />

          {/* Logo */}
          <motion.div variants={navItemVariants} className="z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg text-white shadow-lg">
                <FaPlane size={20} className="group-hover:-rotate-12 transition-transform duration-300" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-teal-600 tracking-tight">
                Euro trails
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-6 z-10">
            {currentLinks.map((link) => (
              <DesktopNavLink key={link.id} link={link} setHoveredLink={setHoveredLink} navRef={navRef} />
            ))}
          </div>

          {/* Right Side */}
          <motion.div variants={navItemVariants} className="flex items-center gap-4 z-10">
            <motion.div className="hidden md:block">
              <Link href="/book-now" className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-teal-500 text-white font-bold text-sm shadow-md hover:shadow-xl group overflow-hidden">
                <FaMapMarkedAlt className="relative z-10" /> <span className="relative z-10 uppercase text-xs">{t.book}</span>
              </Link>
            </motion.div>
            <motion.button onClick={() => setMobileOpen(true)} className="xl:hidden p-2.5 rounded-full bg-sky-50 text-sky-600">
              <AnimatedHamburgerIcon isOpen={mobileOpen} />
            </motion.button>
          </motion.div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} closeMenu={() => setMobileOpen(false)} links={currentLinks} t={t} />
    </>
  );
};

/* ────────────────────── Helper Components ────────────────────── */
// (Keep DesktopNavLink, MobileMenu, MobileNavLink, AnimatedHamburgerIcon EXACTLY as they were in previous code)
// They will automatically work because they receive 'links' and 't' as props from the parent Navbar
// which is now correctly updating via context.

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

const MobileMenu: React.FC<any> = ({ isOpen, closeMenu, links, t }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[1000] overflow-y-auto">
        <div className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white flex justify-between items-center">
           <span className="text-xl font-bold flex gap-2"><FaPassport className="text-yellow-300"/> {t.menu}</span>
           <button onClick={closeMenu}><FaTimes size={18} /></button>
        </div>
        <div className="p-6 space-y-2">
           {links.map((link: any) => <MobileNavLink key={link.id} link={link} closeMenu={closeMenu} />)}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MobileNavLink: React.FC<any> = ({ link, closeMenu }) => {
   const [open, setOpen] = useState(false);
   return (
     <div>
       <div onClick={() => link.subMenu ? setOpen(!open) : closeMenu()} className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-slate-50 cursor-pointer">
         <Link href={!link.subMenu ? link.href : "#"} className="text-base font-semibold text-slate-700">{link.label}</Link>
         {link.subMenu && <FaChevronDown size={12} className="text-slate-400" />}
       </div>
       {open && link.subMenu && (
         <div className="bg-slate-50/50 rounded-b-lg mb-2">
           {link.subMenu.map((it: any) => (
             <Link key={it.id} href={it.href} onClick={closeMenu} className="block py-3 px-6 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50">{it.label}</Link>
           ))}
         </div>
       )}
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