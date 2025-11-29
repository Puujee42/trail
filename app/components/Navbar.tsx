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
} from "react-icons/fa";
// Import SignedIn and UserButton from Clerk
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";

/* ────────────────────── Types ────────────────────── */
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

/* ────────────────────── Data ────────────────────── */
const NAV_LINKS: NavLinkItem[] = [
  { id: "home", label: "Нүүр", href: "/" },
  {
    id: "packages",
    label: "Багцууд",
    href: "/packages",
    
  },
  { id: "blog", label: "Блог", href: "/blog" },
  { id: "about", label: "Бидний тухай", href: "/about" },
  { id: "contact", label: "Холбоо барих", href: "/contact" },
];

/* ────────────────────── Animation Variants ────────────────────── */
const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

/* ────────────────────── Main Navbar ────────────────────── */
const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<HoveredLink | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  
  const { scrollY } = useScroll();

  // Hide navbar on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) setHidden(true);
    else setHidden(false);
  });

  // Background transparency logic
  const backgroundOpacity = useTransform(scrollY, [0, 150], [0.85, 0.95]);
  const blurAmount = useTransform(scrollY, [0, 150], ["10px", "20px"]);

  return (
    <>
      {/* ──────── Top Bar (Sky Gradient) ──────── */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-sky-500 via-blue-500 to-teal-500 text-white shadow-lg rounded-b-[2rem]"
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-8 py-2.5 text-sm">
          {/* Slogan */}
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
            Euro trails-тэй хамт дэлхийгээр аялаарай
          </motion.p>

          <ul className="flex items-center gap-4 md:gap-5">
            {/* Social Icons */}
            <motion.li 
              className="flex items-center gap-3 text-white/80"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  variants={navItemVariants}
                  whileHover={{ scale: 1.2, y: -2, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:text-white transition-colors"
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.li>

            <motion.li 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }} 
              className="text-white/30 hidden md:block"
            >
              |
            </motion.li>

            {/* START: Clerk Authentication Integration */}
            <SignedOut>
              <li className="hidden md:flex items-center gap-5">
                <Link
                  href="/sign-in"
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-white font-medium transition-all"
                >
                  <FaSignInAlt className="text-xs group-hover:translate-x-1 transition-transform" />
                  <span>Нэвтрэх</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-sky-600 font-bold shadow-md overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-sky-50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    <FaUser className="text-xs" />
                    <span>Бүртгүүлэх</span>
                  </span>
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
              <li className="hidden md:block">
                <UserButton afterSignOutUrl="/" />
              </li>
            </SignedIn>
            {/* END: Clerk Authentication Integration */}
          </ul>
        </div>
      </motion.div>

      {/* ──────── Main Glass Navbar ──────── */}
      <motion.header
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-120%", opacity: 0 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }} // smooth easeInOutCubic
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
            backdropFilter: `blur(${blurAmount.get()})`
          }}
        >
          {/* Active Link Indicator (Ocean Blue Gradient) */}
          <motion.div
            className="absolute -bottom-1 h-1 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full shadow-md z-0"
            animate={{
              width: hoveredLink?.width || 0,
              left: hoveredLink?.left || 0,
              opacity: hoveredLink ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />

          {/* Logo */}
          <motion.div variants={navItemVariants} className="z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg text-white shadow-lg"
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaPlane size={20} className="group-hover:-rotate-12 transition-transform duration-300" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-teal-600 tracking-tight">
                Euro trails
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6 z-10">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink
                key={link.id}
                link={link}
                setHoveredLink={setHoveredLink}
                navRef={navRef}
              />
            ))}
          </div>

          {/* Right side content */}
          <motion.div variants={navItemVariants} className="flex items-center gap-4 z-10">
            {/* Desktop CTA - Breathing Animation */}
            <motion.div 
              className="hidden md:block"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link
                href="/book-now"
                className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-teal-500 text-white font-bold text-sm shadow-md hover:shadow-xl hover:shadow-sky-200 transition-all duration-300 overflow-hidden group"
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  initial={{ x: "-150%" }}
                  whileHover={{ x: "150%" }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
                <FaMapMarkedAlt className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Аялал захиалах</span>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(true)}
              className="xl:hidden p-2.5 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
            >
              <AnimatedHamburgerIcon isOpen={mobileOpen} />
            </motion.button>
          </motion.div>
        </motion.nav>
      </motion.header>

      <MobileMenu
        isOpen={mobileOpen}
        closeMenu={() => setMobileOpen(false)}
      />
    </>
  );
};

/* ────────────────────── Desktop Nav Link Component ────────────────────── */
const DesktopNavLink: React.FC<{
  link: NavLinkItem;
  setHoveredLink: (v: HoveredLink | null) => void;
  navRef: React.RefObject<HTMLDivElement | null>;
}> = ({ link, setHoveredLink, navRef }) => {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!linkRef.current || !navRef.current) return;
    const { offsetLeft, offsetWidth } = linkRef.current;
    setHoveredLink({ left: offsetLeft, width: offsetWidth });
    if (link.subMenu) setOpen(true);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
    setOpen(false);
  };

  return (
    <motion.div
      variants={navItemVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      <Link
        ref={linkRef}
        href={link.href}
        className="flex items-center gap-1 px-3 py-2 text-[15px] font-semibold text-slate-600 hover:text-sky-600 transition-colors"
      >
        {link.label}
        {link.subMenu && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-slate-400 group-hover:text-sky-500 text-xs"
          >
            <FaChevronDown />
          </motion.div>
        )}
      </Link>

      <AnimatePresence>
        {open && link.subMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-xl p-3 shadow-2xl border border-sky-100 ring-1 ring-black/5 origin-top"
          >
            {/* Tiny triangle pointer */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-sky-100" />
            
            <motion.div 
              className="relative space-y-1"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.07 } }
              }}
            >
              {link.subMenu.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    closed: { opacity: 0, x: -10 },
                    open: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all group/item"
                  >
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-500 group-hover/item:bg-sky-500 group-hover/item:text-white group-hover/item:scale-110 transition-all duration-300">
                        <FaUmbrellaBeach size={12} />
                     </span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ────────────────────── Mobile Menu Component ────────────────────── */
const MobileMenu: React.FC<{
  isOpen: boolean;
  closeMenu: () => void;
}> = ({ isOpen, closeMenu }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[999]"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden"
          >
            {/* Header of Mobile Menu */}
            <div className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white relative overflow-hidden">
               {/* Decorative Circles with Pulse */}
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" 
               />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

              <div className="flex justify-between items-center relative z-10">
                <span className="text-xl font-bold flex items-center gap-2">
                   <FaPassport className="text-yellow-300"/> Цэс
                </span>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={closeMenu}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>
              
              {/* START: Mobile Auth Buttons with Clerk */}
              <div className="mt-8 relative z-10">
                <SignedOut>
                  <div className="flex gap-3">
                    <Link
                      href="/sign-in"
                      onClick={closeMenu}
                      className="flex-1 py-2 text-center rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold transition-colors"
                    >
                      Нэвтрэх
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={closeMenu}
                      className="flex-1 py-2 text-center rounded-lg bg-white text-sky-600 text-sm font-bold shadow-sm"
                    >
                      Бүртгүүлэх
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-start">
                      <UserButton afterSignOutUrl="/" />
                      <span className="ml-4 font-semibold">Миний бүртгэл</span>
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Scrollable Links with Stagger */}
            <motion.div 
              className="flex-1 overflow-y-auto p-6 space-y-2"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
              }}
            >
              {NAV_LINKS.map((link) => (
                <MobileNavLink
                  key={link.id}
                  link={link}
                  closeMenu={closeMenu}
                />
              ))}
            </motion.div>

            {/* Footer of Mobile Menu */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/book-now"
                  className="block w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-sky-200 transition-all"
                >
                  Аялал захиалах
                </Link>
              </motion.div>
              
              <div className="flex justify-center gap-8 mt-6 text-slate-400">
                <motion.div whileHover={{ y: -3, color: "#2563EB" }}><FaFacebookF className="cursor-pointer" /></motion.div>
                <motion.div whileHover={{ y: -3, color: "#38BDF8" }}><FaTwitter className="cursor-pointer" /></motion.div>
                <motion.div whileHover={{ y: -3, color: "#EC4899" }}><FaInstagram className="cursor-pointer" /></motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ────────────────────── Mobile Nav Link Sub-Component ────────────────────── */
const MobileNavLink: React.FC<{
  link: NavLinkItem;
  closeMenu: () => void;
}> = ({ link, closeMenu }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={{
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
      }}
    >
      <div
        onClick={() => (link.subMenu ? setOpen(!open) : closeMenu())}
        className={`flex justify-between items-center py-3 px-3 cursor-pointer rounded-lg transition-all ${open ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
      >
        <Link
          href={!link.subMenu ? link.href : "#"}
          onClick={(e) => link.subMenu && e.preventDefault()}
          className={`text-base font-semibold ${open ? 'text-sky-600' : 'text-slate-700'}`}
        >
          {link.label}
        </Link>
        {link.subMenu && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            className={`text-slate-400 ${open ? 'text-sky-500' : ''}`}
          >
            <FaChevronDown size={12} />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {open && link.subMenu && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50 rounded-b-lg mb-2"
          >
            {link.subMenu.map((it) => (
              <li key={it.id}>
                <Link
                  href={it.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-3 px-6 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors border-l-2 border-transparent hover:border-sky-400"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ────────────────────── Animated Hamburger Icon ────────────────────── */
const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="stroke-current">
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M 4 6 L 20 6" },
        open: { d: "M 6 18 L 18 6" },
      }}
      animate={isOpen ? "open" : "closed"}
    />
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 4 12 L 20 12"
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 },
      }}
      animate={isOpen ? "open" : "closed"}
    />
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M 4 18 L 20 18" },
        open: { d: "M 6 6 L 18 18" },
      }}
      animate={isOpen ? "open" : "closed"}
    />
  </svg>
);

export default Navbar;