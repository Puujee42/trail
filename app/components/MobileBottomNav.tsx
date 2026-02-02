

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, History, User } from "lucide-react";

import { Locale } from "@/i18n-config";

interface MobileBottomNavProps {
    language: Locale;
    dictionary: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language, dictionary }) => {
    const pathname = usePathname();
    const t = dictionary || {};

    const tabs = useMemo(() => [
        { id: "home", label: t.home || "Home", href: `/${language}`, icon: Home },
        { id: "search", label: t.packages || t.course || "Search", href: `/${language}/packages`, icon: Search },
        { id: "history", label: t.about || "About", href: `/${language}/about`, icon: History },
        { id: "profile", label: t.myAccount || "Profile", href: `/${language}/dashboard`, icon: User },
    ], [language, t]);

    const activeIndex = tabs.findIndex(tab =>
        pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`)
    );

    const safeIndex = activeIndex !== -1 ? activeIndex : 0;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden flex justify-center pb-0 px-0">
            {/* Main Container with shadow for separation */}
            <div className="relative w-full bg-transparent h-[80px] drop-shadow-[0_-5px_10px_rgba(0,0,0,0.03)]">

                {/* THE SVG BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <svg
                        viewBox="0 0 400 80"
                        className="w-full h-full fill-white"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            // Smooth animation for the curve moving
                            animate={{ d: generateSmoothPath(safeIndex, tabs.length) }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </svg>
                </div>

                {/* TABS CONTAINER */}
                <div className="relative z-10 w-full h-full flex items-end justify-around pb-2">
                    {tabs.map((tab, idx) => {
                        const isActive = safeIndex === idx;
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className="relative w-16 flex flex-col items-center justify-end group tap-highlight-transparent"
                                style={{ height: '100%' }} // Full height to align baselines
                            >
                                {/* FLOATING BUTTON (Only visible when active) */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="floatingCircle"
                                            className="absolute -top-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center z-20"
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        >
                                            <Icon className="text-white w-6 h-6" strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* NORMAL STATE (Icon + Label) */}
                                <div className={`flex flex-col items-center gap-1 mb-3 transition-all duration-300 ${isActive ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={2} />
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 tracking-wide">
                                        {tab.label}
                                    </span>
                                </div>

                                {/* ACTIVE LABEL (Below the floating button) */}
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-3 text-[10px] font-black text-blue-600 tracking-wide uppercase"
                                    >
                                        {tab.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/**
 * Generates a smoother Bezier curve path for the notch
 */
function generateSmoothPath(index: number, totalTabs: number) {
    const totalWidth = 400;
    const height = 80;
    const tabWidth = totalWidth / totalTabs;
    const centerX = (tabWidth * index) + (tabWidth / 2);

    // Curve parameters
    const topY = 0;              // Top edge of the bar
    const curveWidth = 80;       // Total width of the curve influence
    const depth = 35;            // Depth of the curve (how deep the dip goes)
    const curveY = depth;        // Y position of the bottom of the curve (relative to topY)

    // Helper points for Bezier Curve
    const leftAnchor = centerX - (curveWidth / 2);
    const rightAnchor = centerX + (curveWidth / 2);

    // Control points for a smooth ease-in-out dip
    const cp1x = leftAnchor + (curveWidth * 0.25);
    const cp1y = topY;

    const cp2x = centerX - (curveWidth * 0.1);
    const cp2y = curveY;

    const cp3x = centerX + (curveWidth * 0.1);
    const cp3y = curveY;

    const cp4x = rightAnchor - (curveWidth * 0.25);
    const cp4y = topY;

    // SVG Path Command
    // M 0 0        -> Start top-left
    // L ...        -> Line to start of curve
    // C ...        -> Cubic Bezier to bottom center
    // S ...        -> Smooth Cubic Bezier to end of curve
    // L 400 0      -> Line to top-right
    // L 400 80     -> Line to bottom-right
    // L 0 80       -> Line to bottom-left
    // Z            -> Close path

    return `
      M 0 ${topY}
      L ${leftAnchor} ${topY}
      C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${centerX} ${curveY}
      C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${rightAnchor} ${topY}
      L ${totalWidth} ${topY}
      L ${totalWidth} ${height}
      L 0 ${height}
      Z
    `;
}

export default MobileBottomNav;

