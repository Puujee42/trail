"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronRight,
    ChevronDown,
    Filter,
    MapPin,
    Tag as TagIcon,
    GripVertical,
    Library
} from "lucide-react";
import { ItineraryItem, Trip } from "@/lib/mongo/trips";

interface TourLibrarySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onImportDay: (day: ItineraryItem) => void;
    initialFilter?: string;
}

const TourLibrarySidebar: React.FC<TourLibrarySidebarProps> = ({
    isOpen,
    onClose,
    onImportDay,
    initialFilter = ""
}) => {
    const [tours, setTours] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegion, setSelectedRegion] = useState(initialFilter);
    const [selectedTag, setSelectedTag] = useState("");
    const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch("/api/admin/trips/library");
                const data = await res.json();
                setTours(data);
            } catch (err) {
                console.error("Failed to fetch tour library:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const filteredTours = tours.filter(tour => {
        const matchesSearch = tour.title.en.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || tour.region === selectedRegion;
        const matchesTag = !selectedTag || tour.tags?.includes(selectedTag);
        return matchesSearch && matchesRegion && matchesTag;
    });

    const regions = Array.from(new Set(tours.map(t => t.region).filter(Boolean)));
    const allTags = Array.from(new Set(tours.flatMap(t => t.tags || []).filter(Boolean)));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-full w-80 md:w-96 bg-white shadow-2xl z-[60] border-l border-slate-200 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <Library className="w-5 h-5 text-blue-600" />
                            <h2 className="font-serif text-xl text-slate-800">Tour Library</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Search & Filters */}
                    <div className="p-4 space-y-4 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tours..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-2 text-[10px] overflow-x-auto pb-1">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-bold text-slate-500"
                            >
                                <option value="">All Regions</option>
                                {regions.map(r => <option key={r} value={r!}>{r}</option>)}
                            </select>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-bold text-slate-500"
                            >
                                <option value="">All Tags</option>
                                {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Library size={24} />
                                </motion.div>
                                <span className="text-xs font-bold uppercase tracking-widest">Loading Library...</span>
                            </div>
                        ) : filteredTours.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 italic text-sm">
                                No tours match your filters.
                            </div>
                        ) : (
                            filteredTours.map((tour) => (
                                <div
                                    key={tour._id}
                                    className={`bg-white border rounded-2xl transition-all ${expandedTourId === tour._id ? "border-blue-200 shadow-md" : "border-slate-100 hover:border-slate-300"
                                        }`}
                                >
                                    <div
                                        onClick={() => setExpandedTourId(expandedTourId === tour._id ? null : tour._id)}
                                        className="p-3 cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {tour.image && (
                                                <img src={tour.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            )}
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700">{tour.title.en}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                                                        {tour.duration.en}
                                                    </span>
                                                    {tour.region && (
                                                        <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                                                            {tour.region}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`text-slate-300 transition-transform ${expandedTourId === tour._id ? "rotate-180" : ""}`}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {expandedTourId === tour._id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-50 overflow-hidden"
                                            >
                                                <div className="p-2 space-y-1 bg-slate-50/30">
                                                    {tour.itinerary?.map((day) => (
                                                        <div
                                                            key={`${tour._id}-day-${day.day}`}
                                                            draggable
                                                            onDragStart={(e) => {
                                                                e.dataTransfer.setData("application/json", JSON.stringify(day));
                                                            }}
                                                            className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-sm transition-all cursor-grab group active:cursor-grabbing"
                                                        >
                                                            <div className="p-1 text-slate-300 group-hover:text-blue-400">
                                                                <GripVertical size={14} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center mb-0.5">
                                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Day {day.day}</span>
                                                                    <button
                                                                        onClick={() => onImportDay(day)}
                                                                        className="text-[10px] font-bold text-slate-400 hover:text-blue-500"
                                                                    >
                                                                        + Import
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-700 truncate">{day.title.en}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TourLibrarySidebar;
