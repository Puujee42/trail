"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    Plus,
    Trash2,
    ChevronDown,
    Map,
    DollarSign,
    HelpCircle,
    FileText,
    Utensils,
    Hotel,
    FileDown,
    Info,
    Calendar,
    Layers,
    PieChart,
    Clock,
    Navigation,
    Tag,
    Users,
    Library
} from "lucide-react";
import TourLibrarySidebar from "../../../../../components/admin/TourLibrarySidebar";
import { ItineraryItem, Trip } from "@/lib/mongo/trips";

interface LocalizedString {
    mn: string;
    en: string;
    ko: string;
    de: string;
}

interface ItineraryDay {
    day: number;
    title: LocalizedString;
    desc: LocalizedString;
    accommodation: string;
    meals: { B: boolean; L: boolean; D: boolean };
    imageUrl?: string;
}

interface FAQItem {
    question: LocalizedString;
    answer: LocalizedString;
}

interface TourProductEditorProps {
    initialData: any;
}

const TourProductEditor: React.FC<TourProductEditorProps> = ({ initialData }) => {
    const [activeTab, setActiveTab] = useState<"details" | "itinerary" | "financials" | "faq" | "schedule">("details");
    const [formData, setFormData] = useState({
        ...initialData,
        itinerary: initialData.itinerary || [],
        faqs: initialData.faqs || [],
        inclusions: initialData.inclusions || [],
        exclusions: initialData.exclusions || [],
        seasonStart: initialData.seasonStart || "2025-06-01",
        seasonEnd: initialData.seasonEnd || "2025-09-20",
        bookingStatus: initialData.bookingStatus || "accepting",
        baseCost: initialData.baseCost || 1500,
        margin: initialData.margin || 20,
        map_image_url: initialData.map_image_url || "",
        tour_code: initialData.tour_code || "",
        availability_text: initialData.availability_text || "",
        start_location: initialData.start_location || "",
        duration: initialData.duration || { en: "10 days / 9 nights", mn: "", ko: "" }
    });

    const [expandedDay, setExpandedDay] = useState<number | null>(0);
    const [isUploadingDay, setIsUploadingDay] = useState<number | null>(null);
    const [isUploadingMap, setIsUploadingMap] = useState(false);
    const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Smart Import Features
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [libraryTours, setLibraryTours] = useState<Trip[]>([]);
    const [showTemplateMenu, setShowTemplateMenu] = useState(false);

    useEffect(() => {
        fetch("/api/admin/trips/library")
            .then(res => res.json())
            .then(data => setLibraryTours(data))
            .catch(err => console.error("Library load error:", err));
    }, []);

    // Fetch Departures on Mount
    React.useEffect(() => {
        if (formData._id) {
            fetch(`/api/admin/departures?tripId=${formData._id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setFormData((prev: any) => ({ ...prev, departures: data }));
                    }
                });
        }
    }, [formData._id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Save Main Trip Data
            const tripRes = await fetch('/api/admin/trips', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!tripRes.ok) throw new Error("Failed to save trip");

            // 2. Sync Departures (Atomic Replace Strategy)
            // Note: This is a simplified strategy. For production, consider delta updates.
            // We'll send the entire departures array and let the server handle it.
            // Actually, we'll just iterate for now since our API is simple.

            // First, get current departures to see what to delete? 
            // Or just have the API handle a batch update. 
            // Let's keep it simple: we already have an API that takes a tripId.
            // I'll add a 'PUT' or similar to handle batch if needed, 
            // but for now, I'll just save them alongside if I update the trip API.

            // BETTER: Update the Trip API to handle its own departures if present.

            alert("Changes saved successfully!");
        } catch (error: any) {
            alert("Error saving: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Vault Calculations
    const financials = useMemo(() => {
        const sellingPrice = formData.price?.mn || 2880; // Assuming MNT or USD depending on state
        const taxRate = 0.10;
        const operations = formData.baseCost;
        const tax = sellingPrice * taxRate;
        const profit = sellingPrice - operations - tax;

        return { operations, tax, profit, total: sellingPrice };
    }, [formData.price?.mn, formData.baseCost]);

    const handleUpdateDay = (index: number, updates: Partial<ItineraryDay>) => {
        setFormData((prev: any) => {
            const newItin = [...prev.itinerary];
            newItin[index] = { ...newItin[index], ...updates };
            return { ...prev, itinerary: newItin };
        });
    };

    const handleItineraryImageUpload = async (index: number, file: File) => {
        setIsUploadingDay(index);
        const formPayload = new FormData();
        formPayload.append("file", file);
        formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                method: "POST",
                body: formPayload
            });
            const data = await res.json();
            handleUpdateDay(index, { imageUrl: data.secure_url });
        } catch (err) {
            console.error("Itinerary image upload error:", err);
            alert("Image upload failed.");
        } finally {
            setIsUploadingDay(null);
        }
    };

    const handleMapUpload = async (file: File) => {
        setIsUploadingMap(true);
        const formPayload = new FormData();
        formPayload.append("file", file);
        formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                method: "POST",
                body: formPayload
            });
            const data = await res.json();
            setFormData({ ...formData, map_image_url: data.secure_url });
        } catch (err) {
            console.error("Map upload error:", err);
            alert("Map upload failed.");
        } finally {
            setIsUploadingMap(false);
        }
    };

    const handleMainImageUpload = async (file: File) => {
        setIsUploadingMainImage(true);
        const formPayload = new FormData();
        formPayload.append("file", file);
        formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                method: "POST",
                body: formPayload
            });
            const data = await res.json();
            setFormData({ ...formData, image: data.secure_url });
        } catch (err) {
            console.error("Main image upload error:", err);
            alert("Main image upload failed.");
        } finally {
            setIsUploadingMainImage(false);
        }
    };

    const addItineraryDay = () => {
        const newDay = {
            day: formData.itinerary.length + 1,
            title: { mn: "", en: "", ko: "" },
            desc: { mn: "", en: "", ko: "" },
            accommodation: "Hotel 4*",
            meals: { B: true, L: false, D: true },
            imageUrl: ""
        };
        setFormData((prev: any) => ({ ...prev, itinerary: [...prev.itinerary, newDay] }));
        setExpandedDay(formData.itinerary.length);
    };

    const removeItineraryDay = (index: number) => {
        setFormData((prev: any) => {
            const newItin = prev.itinerary.filter((_: any, i: number) => i !== index).map((d: any, idx: number) => ({ ...d, day: idx + 1 }));
            // Recalculate base cost if days had costs
            const newBaseCost = newItin.reduce((acc: number, day: any) => acc + (day.hotelCost || 0) + (day.transportCost || 0), 0);
            return { ...prev, itinerary: newItin, baseCost: newBaseCost > 0 ? newBaseCost : prev.baseCost };
        });
    };

    const handleImportDay = (dayData: any) => {
        const newDay = {
            ...dayData,
            day: formData.itinerary.length + 1,
            // Ensure we keep the localized strings structure
            title: typeof dayData.title === 'string' ? { en: dayData.title, mn: "", ko: "" } : dayData.title,
            desc: typeof dayData.desc === 'string' ? { en: dayData.desc, mn: "", ko: "" } : dayData.desc,
        };

        setFormData((prev: any) => {
            const newItin = [...prev.itinerary, newDay];
            // Update base cost if cost data exists
            const additionalCost = (dayData.hotelCost || 0) + (dayData.transportCost || 0);
            return {
                ...prev,
                itinerary: newItin,
                baseCost: additionalCost > 0 ? (prev.baseCost || 0) + additionalCost : prev.baseCost
            };
        });
        setExpandedDay(formData.itinerary.length);
        alert(`Imported: ${newDay.title.en}`);
    };

    const handleStartFromTemplate = (templateId: string) => {
        const template = libraryTours.find(t => t._id === templateId);
        if (!template) return;

        if (confirm(`Populate entire itinerary from "${template.title.en}"? Current changes will be overwritten.`)) {
            setFormData((prev: any) => ({
                ...prev,
                title: template.title,
                location: template.location,
                description: template.description || prev.description,
                duration: template.duration,
                itinerary: template.itinerary || [],
                baseCost: template.itinerary?.reduce((acc: number, day: any) => acc + (day.hotelCost || 0) + (day.transportCost || 0), 0) || template.price?.en || 0
            }));
            setShowTemplateMenu(false);
        }
    };

    const tabs = [
        { id: "details", label: "General Details", icon: Info },
        { id: "itinerary", label: "Itinerary Builder", icon: Map },
        { id: "schedule", label: "Schedule & Departures", icon: Calendar },
        { id: "financials", label: "Financials / Vault", icon: DollarSign },
        { id: "faq", label: "FAQ Builder", icon: HelpCircle },
    ];

    const printItinerary = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 font-sans selection:bg-[#D2B48C]/30 text-slate-800 print:bg-white print:p-0">

            {/* Print-only layout for PDF Export */}
            <div className="hidden print:block font-serif p-10 space-y-8">
                <h1 className="text-4xl text-[#2C362B] border-b pb-4">{formData.title?.en} - Itinerary</h1>
                <p className="italic text-slate-500 font-sans">Season {formData.seasonStart} to {formData.seasonEnd}</p>
                {formData.itinerary.map((day: any) => (
                    <div key={day.day} className="space-y-4 border-b pb-8 break-inside-avoid">
                        <h2 className="text-2xl font-serif">Day {day.day}: {day.title.en}</h2>
                        {day.imageUrl && (
                            <img src={day.imageUrl} alt={`Day ${day.day}`} className="w-full h-64 object-cover rounded-2xl" />
                        )}
                        <p className="text-sm text-slate-600 leading-relaxed font-sans">{day.desc.en}</p>
                        <div className="flex gap-4 text-xs font-bold text-slate-400 font-sans uppercase tracking-widest">
                            <span>Accommodation: {day.accommodation}</span>
                            <span>Meals: {day.meals.B && 'B '}{day.meals.L && 'L '}{day.meals.D && 'D'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="print:hidden">
                {/* HEADER SECTION: Travel Journal Aesthetic */}
                <header className="mb-12 bg-[#FDFBF7] p-10 rounded-[40px] shadow-sm border border-[#E8E2D9] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Layers size={180} className="text-[#4B5E4A]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <span className="text-[#4B5E4A] font-bold uppercase tracking-[0.2em] text-xs">Tour Management Portfolio</span>
                                <h1 className="text-4xl md:text-5xl font-serif text-[#2C362B] mt-2 mb-4">Edit Custom Discovery</h1>
                                <p className="font-serif italic text-slate-500 text-lg">Season 2025/26 Collection</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#4B5E4A] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#3d4d3c] transition-all font-bold disabled:opacity-50"
                                >
                                    <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={printItinerary}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#4B5E4A] border border-[#4B5E4A]/20 rounded-full hover:bg-slate-50 transition-all font-bold"
                                >
                                    <FileDown size={18} /> Export PDF
                                </button>
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-bold"
                                >
                                    <Library size={18} /> Tour Library
                                </button>
                            </div>
                        </div>

                        {/* TEMPLATE DROP BUTTON */}
                        <div className="flex gap-4 mb-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-xs font-black uppercase tracking-widest"
                                >
                                    <Layers size={14} /> Start from Template
                                </button>
                                <AnimatePresence>
                                    {showTemplateMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 max-h-64 overflow-y-auto"
                                        >
                                            <p className="p-3 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b mb-1">Select Base Tour</p>
                                            {libraryTours.map(t => (
                                                <button
                                                    key={t._id}
                                                    onClick={() => handleStartFromTemplate(t._id)}
                                                    className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-colors group"
                                                >
                                                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{t.title.en}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black">{t.duration.en}</p>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#E8E2D9]">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Tour Code</label>
                                <input
                                    type="text"
                                    value={formData.tour_code}
                                    onChange={(e) => setFormData({ ...formData, tour_code: e.target.value })}
                                    placeholder="e.g. P10-1"
                                    className="w-full bg-white border border-[#D2B48C]/30 p-2 rounded-xl text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Availability</label>
                                <input
                                    type="text"
                                    value={formData.availability_text}
                                    onChange={(e) => setFormData({ ...formData, availability_text: e.target.value })}
                                    placeholder="e.g. 1 June - 20 Sep"
                                    className="w-full bg-white border border-[#D2B48C]/30 p-2 rounded-xl text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Start Location</label>
                                <input
                                    type="text"
                                    value={formData.start_location}
                                    onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                                    placeholder="e.g. Ulaanbaatar"
                                    className="w-full bg-white border border-[#D2B48C]/30 p-2 rounded-xl text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Booking Status</label>
                                <select
                                    value={formData.bookingStatus}
                                    onChange={(e) => setFormData({ ...formData, bookingStatus: e.target.value })}
                                    className="w-full bg-white border border-[#D2B48C]/30 p-2 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#4B5E4A] tracking-tight"
                                >
                                    <option value="accepting">Accepting Inquiries</option>
                                    <option value="soldout">Sold Out</option>
                                    <option value="seasonal">Seasonal Closure</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </header>

                <TourLibrarySidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onImportDay={handleImportDay}
                    initialFilter={formData.tags?.[0] || ""}
                />

                {/* NAVIGATION TABS */}
                <nav className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 px-4 justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-[#D2B48C] text-white shadow-md"
                                : "bg-white text-slate-500 hover:bg-[#FDFBF7]"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* CONTENT AREA */}
                <div className="px-4">
                    <AnimatePresence mode="wait">
                        {activeTab === "itinerary" && (
                            <motion.div
                                key="itinerary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-serif text-[#2C362B]">Storyline Builder</h2>
                                    <button
                                        onClick={addItineraryDay}
                                        className="flex items-center gap-2 px-6 py-2 bg-[#D2B48C]/10 text-[#2C362B] border border-[#D2B48C]/30 rounded-xl hover:bg-[#D2B48C]/20 transition-all font-bold"
                                    >
                                        <Plus size={18} /> Append Day
                                    </button>
                                </div>

                                <div
                                    className="min-h-[100px] border-2 border-dashed border-slate-200 rounded-[40px] p-6 bg-slate-50/20"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        try {
                                            const data = JSON.parse(e.dataTransfer.getData("application/json"));
                                            handleImportDay(data);
                                        } catch (err) {
                                            console.error("Drop failed:", err);
                                        }
                                    }}
                                >
                                    <div className="text-center py-4 mb-4">
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest italic">Drop Library Items Here ↓</p>
                                    </div>

                                    {formData.itinerary.map((day: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`bg-white rounded-3xl border border-[#E8E2D9] overflow-hidden transition-all duration-500 ${expandedDay === idx ? "shadow-2xl ring-1 ring-[#D2B48C]/20" : "shadow-sm hover:border-[#D2B48C]/40"
                                                }`}
                                        >
                                            <div
                                                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                                                className="p-6 cursor-pointer flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-[#FDFBF7] border border-[#E8E2D9] rounded-2xl flex items-center justify-center font-serif text-xl text-[#4B5E4A]">
                                                        {day.day}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-serif text-xl group-hover:text-[#4B5E4A] transition-colors">
                                                            {day.title.en || <span className="text-slate-300 italic">Day {day.day}: Untitled Chapter</span>}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">
                                                            {day.accommodation} • {day.meals.B ? 'B' : '-'}{day.meals.L ? 'L' : '-'}{day.meals.D ? 'D' : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeItineraryDay(idx); }}
                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <motion.div animate={{ rotate: expandedDay === idx ? 180 : 0 }}>
                                                        <ChevronDown className="text-slate-300" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedDay === idx && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-[#FDFBF7]"
                                                    >
                                                        <div className="p-8 bg-[#FDFBF7]/30 space-y-8">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div className="space-y-6">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Chapter Title (English)</label>
                                                                        <input
                                                                            value={day.title.en}
                                                                            onChange={(e) => handleUpdateDay(idx, { title: { ...day.title, en: e.target.value } })}
                                                                            className="w-full bg-white border border-[#E8E2D9] p-4 rounded-2xl focus:ring-2 focus:ring-[#D2B48C] outline-none font-serif text-lg"
                                                                            placeholder="..."
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Visual Atmosphere</label>
                                                                        {day.imageUrl ? (
                                                                            <div className="relative group rounded-3xl overflow-hidden border border-[#E8E2D9]">
                                                                                <img src={day.imageUrl} alt={`Day ${day.day}`} className="w-full h-48 object-cover" />
                                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                    <button
                                                                                        onClick={() => handleUpdateDay(idx, { imageUrl: "" })}
                                                                                        className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                                                                                    >
                                                                                        <Trash2 size={20} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="relative">
                                                                                {isUploadingDay === idx ? (
                                                                                    <div className="w-full h-48 rounded-3xl bg-[#FDFBF7] border-2 border-dashed border-[#D2B48C]/30 flex items-center justify-center">
                                                                                        <motion.div
                                                                                            animate={{ rotate: 360 }}
                                                                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                                                        >
                                                                                            <Save size={24} className="text-[#D2B48C]" />
                                                                                        </motion.div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            const input = document.createElement('input');
                                                                                            input.type = 'file';
                                                                                            input.accept = 'image/*';
                                                                                            input.onchange = (e: any) => {
                                                                                                const file = e.target.files?.[0];
                                                                                                if (file) handleItineraryImageUpload(idx, file);
                                                                                            };
                                                                                            input.click();
                                                                                        }}
                                                                                        className="w-full h-48 rounded-3xl bg-white border-2 border-dashed border-[#D2B48C]/30 hover:border-[#D2B48C] hover:bg-[#FDFBF7]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                                                                                    >
                                                                                        <Plus size={24} className="text-[#D2B48C] group-hover:scale-110 transition-transform" />
                                                                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Add Discovery Photo</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-4 pt-6">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Accommodation</label>
                                                                            <select
                                                                                value={day.accommodation}
                                                                                onChange={(e) => handleUpdateDay(idx, { accommodation: e.target.value })}
                                                                                className="w-full bg-white border border-[#E8E2D9] p-4 rounded-2xl text-sm font-bold"
                                                                            >
                                                                                <option>Hotel 4*</option>
                                                                                <option>Tourist Camp</option>
                                                                                <option>High-end Ger Camp</option>
                                                                                <option>Self-booking</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Meals Provided</label>
                                                                            <div className="flex gap-4 p-4 bg-white border border-[#E8E2D9] rounded-2xl h-[58px] items-center justify-center">
                                                                                {['B', 'L', 'D'].map((m) => (
                                                                                    <label key={m} className="flex items-center gap-1 cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={day.meals[m as keyof typeof day.meals]}
                                                                                            onChange={(e) => handleUpdateDay(idx, { meals: { ...day.meals, [m]: e.target.checked } })}
                                                                                            className="w-4 h-4 accent-[#4B5E4A]"
                                                                                        />
                                                                                        <span className="text-xs font-bold text-slate-600">{m}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2 pt-2">
                                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Daily Storyline Description</label>
                                                                        <textarea
                                                                            rows={8}
                                                                            value={day.desc.en}
                                                                            onChange={(e) => handleUpdateDay(idx, { desc: { ...day.desc, en: e.target.value } })}
                                                                            className="w-full bg-white border border-[#E8E2D9] p-6 rounded-3xl focus:ring-2 focus:ring-[#D2B48C] outline-none text-slate-600 leading-relaxed font-sans"
                                                                            placeholder="Describe the journey for this day..."
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "financials" && (
                            <motion.div
                                key="financials"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            >
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-[40px] p-8 border border-[#E8E2D9] shadow-sm">
                                        <h3 className="text-2xl font-serif text-[#2C362B] mb-8">Vault Allocation Strategy</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Base Cost Per Traveler</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="number"
                                                        value={formData.baseCost}
                                                        onChange={(e) => setFormData({ ...formData, baseCost: Number(e.target.value) })}
                                                        className="w-full pl-10 p-4 border border-[#E8E2D9] rounded-2xl bg-[#FDFBF7]/50 focus:ring-2 focus:ring-[#D2B48C] outline-none font-bold"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 italic px-2">Aggregated costs for Hotel, Transport & Guide</p>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Desired Profit Margin (%)</label>
                                                <input
                                                    type="number"
                                                    value={formData.margin}
                                                    onChange={(e) => setFormData({ ...formData, margin: Number(e.target.value) })}
                                                    className="w-full p-4 border border-[#E8E2D9] rounded-2xl bg-[#FDFBF7]/50 focus:ring-2 focus:ring-[#D2B48C] outline-none font-bold text-center"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-[#2C362B] rounded-[30px] text-white">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-[#D2B48C] tracking-[0.2em]">Recommended Market Price</p>
                                                    <h4 className="text-5xl font-serif mt-1">${financials.total.toLocaleString()}</h4>
                                                </div>
                                                <PieChart size={48} className="text-[#D2B48C]/30" />
                                            </div>
                                            <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden flex gap-0.5 mt-8 border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(financials.operations / financials.total) * 100}%` }}
                                                    className="h-full bg-slate-300"
                                                    title="Operations Vault"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(financials.tax / financials.total) * 100}%` }}
                                                    className="h-full bg-red-400/80"
                                                    title="Tax Vault"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(financials.profit / financials.total) * 100}%` }}
                                                    className="h-full bg-[#D2B48C]"
                                                    title="Profit Vault"
                                                />
                                            </div>
                                            <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-100 rounded-full" /> Operations</span>
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-400 rounded-full" /> Tax (10%)</span>
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#D2B48C] rounded-full" /> Net Margin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-[#FDFBF7] p-8 rounded-[40px] border border-[#E8E2D9]">
                                        <h5 className="font-serif text-xl mb-4 text-[#2C362B]">Vault Distribution</h5>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                                                <span className="text-xs font-bold text-slate-500">OPERATIONS VAULT</span>
                                                <span className="font-bold text-lg text-slate-700">${financials.operations.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                                                <span className="text-xs font-bold text-slate-500">TAX PROVISION</span>
                                                <span className="font-bold text-lg text-red-500">${financials.tax.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-[#D2B48C]">NET EARNINGS</span>
                                                <span className="font-black text-2xl text-[#4B5E4A]">${financials.profit.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[40px] border border-[#E8E2D9] shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Landmark size={24} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Automation Note</p>
                                                <p className="text-sm font-serif italic text-slate-600 mt-1 leading-relaxed">
                                                    Funds will be automatically released to vaults upon final booking confirmation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Details / Inclusions Exclusions */}
                        {activeTab === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Route Map Image Section */}
                                <div className="bg-white rounded-[40px] p-8 border border-[#E8E2D9] shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-serif text-[#2C362B]">Route Map Image</h3>
                                        {formData.map_image_url && (
                                            <button
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e: any) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleMapUpload(file);
                                                    };
                                                    input.click();
                                                }}
                                                className="text-xs font-bold text-[#4B5E4A] hover:underline"
                                            >
                                                Replace Map
                                            </button>
                                        )}
                                    </div>

                                    {isUploadingMap ? (
                                        <div className="w-full h-64 rounded-3xl bg-[#FDFBF7] border-2 border-dashed border-[#D2B48C]/30 flex flex-col items-center justify-center gap-4">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                                <Save size={32} className="text-[#D2B48C]" />
                                            </motion.div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimizing Map Data...</span>
                                        </div>
                                    ) : formData.map_image_url ? (
                                        <div className="relative group rounded-3xl overflow-hidden border border-[#E8E2D9] max-w-2xl mx-auto bg-slate-50">
                                            <img src={formData.map_image_url} alt="Tour Map" className="w-full h-auto object-contain max-h-[400px] block" />
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setFormData({ ...formData, map_image_url: "" })} className="p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white shadow">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e: any) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleMapUpload(file);
                                                };
                                                input.click();
                                            }}
                                            className="w-full h-64 rounded-3xl bg-white border-2 border-dashed border-[#D2B48C]/30 hover:border-[#D2B48C] hover:bg-[#FDFBF7]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                                        >
                                            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#D2B48C] group-hover:scale-110 transition-transform shadow-sm border border-[#E8E2D9]">
                                                <Map size={32} />
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-sm font-black uppercase text-slate-400 tracking-widest">Upload Route Map</span>
                                                <span className="text-[10px] text-slate-300 uppercase font-bold mt-1 block tracking-[0.2em]">SVG or PNG preferred</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Main Tour Image Section */}
                                <div className="bg-white rounded-[40px] p-8 border border-[#E8E2D9] shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-serif text-[#2C362B]">Main Tour Image</h3>
                                        {formData.image && (
                                            <button
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e: any) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleMainImageUpload(file);
                                                    };
                                                    input.click();
                                                }}
                                                className="text-xs font-bold text-[#4B5E4A] hover:underline"
                                            >
                                                Replace Image
                                            </button>
                                        )}
                                    </div>

                                    {isUploadingMainImage ? (
                                        <div className="w-full h-64 rounded-3xl bg-[#FDFBF7] border-2 border-dashed border-[#D2B48C]/30 flex flex-col items-center justify-center gap-4">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                                <Save size={32} className="text-[#D2B48C]" />
                                            </motion.div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uploading Cover...</span>
                                        </div>
                                    ) : formData.image ? (
                                        <div className="relative group rounded-3xl overflow-hidden border border-[#E8E2D9] max-w-2xl mx-auto bg-slate-50">
                                            <img src={formData.image} alt="Main Tour Cover" className="w-full h-auto object-contain max-h-[400px] block" />
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setFormData({ ...formData, image: "" })} className="p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white shadow">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e: any) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleMainImageUpload(file);
                                                };
                                                input.click();
                                            }}
                                            className="w-full h-64 rounded-3xl bg-white border-2 border-dashed border-[#D2B48C]/30 hover:border-[#D2B48C] hover:bg-[#FDFBF7]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                                        >
                                            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#D2B48C] group-hover:scale-110 transition-transform shadow-sm border border-[#E8E2D9]">
                                                <div className="relative">
                                                    <Map size={32} />
                                                    <Plus className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 text-[#4B5E4A] w-5 h-5" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-sm font-black uppercase text-slate-400 tracking-widest">Upload Cover Photo</span>
                                                <span className="text-[10px] text-slate-300 uppercase font-bold mt-1 block tracking-[0.2em]">High Res Landscape</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[40px] p-8 border border-[#E8E2D9] shadow-sm">
                                        <h3 className="text-2xl font-serif text-[#2C362B] mb-6">Service Inclusions</h3>
                                        <div className="space-y-3">
                                            {formData.inclusions.map((item: string, i: number) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input
                                                        value={item}
                                                        className="flex-1 bg-[#FDFBF7] border border-[#E8E2D9] p-3 rounded-xl text-sm"
                                                        onChange={(e) => {
                                                            const newInc = [...formData.inclusions];
                                                            newInc[i] = e.target.value;
                                                            setFormData({ ...formData, inclusions: newInc });
                                                        }}
                                                    />
                                                    <button onClick={() => setFormData({ ...formData, inclusions: formData.inclusions.filter((_: any, idx: number) => i !== idx) })} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setFormData({ ...formData, inclusions: [...formData.inclusions, ""] })} className="text-xs font-bold text-[#4B5E4A] mt-2">+ Add Inclusion</button>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-[40px] p-8 border border-[#E8E2D9] shadow-sm">
                                        <h3 className="text-2xl font-serif text-[#2C362B] mb-6">Service Exclusions</h3>
                                        <div className="space-y-3">
                                            {formData.exclusions.map((item: string, i: number) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input
                                                        value={item}
                                                        className="flex-1 bg-[#FDFBF7] border border-[#E8E2D9] p-3 rounded-xl text-sm outline-none"
                                                        onChange={(e) => {
                                                            const newExc = [...formData.exclusions];
                                                            newExc[i] = e.target.value;
                                                            setFormData({ ...formData, exclusions: newExc });
                                                        }}
                                                    />
                                                    <button onClick={() => setFormData({ ...formData, exclusions: formData.exclusions.filter((_: any, idx: number) => i !== idx) })} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setFormData({ ...formData, exclusions: [...formData.exclusions, ""] })} className="text-xs font-bold text-[#4B5E4A] mt-2">+ Add Exclusion</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "faq" && (
                            <motion.div
                                key="faq"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto space-y-4"
                            >
                                <div className="flex justify-between items-center mb-6 px-4">
                                    <h2 className="text-3xl font-serif text-[#2C362B]">Curated Q&A Explorer</h2>
                                    <button
                                        onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: { en: "" }, answer: { en: "" } }] })}
                                        className="flex items-center gap-2 px-6 py-2 bg-[#4B5E4A]/10 text-[#4B5E4A] border border-[#4B5E4A]/20 rounded-xl hover:bg-[#4B5E4A]/20 transition-all font-bold"
                                    >
                                        <Plus size={18} /> New Question
                                    </button>
                                </div>

                                {formData.faqs.map((faq: any, i: number) => (
                                    <div key={i} className="bg-white p-8 rounded-[30px] border border-[#E8E2D9] shadow-sm space-y-4">
                                        <input
                                            value={faq.question.en}
                                            placeholder="Enter the question here..."
                                            className="w-full text-xl font-serif bg-transparent outline-none border-b border-transparent focus:border-[#D2B48C]/50 transition-colors"
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[i].question.en = e.target.value;
                                                setFormData({ ...formData, faqs: newFaqs });
                                            }}
                                        />
                                        <textarea
                                            rows={3}
                                            value={faq.answer.en}
                                            placeholder="Provide the detail response..."
                                            className="w-full text-slate-500 italic bg-[#FDFBF7] p-4 rounded-2xl outline-none"
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[i].answer.en = e.target.value;
                                                setFormData({ ...formData, faqs: newFaqs });
                                            }}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                        {activeTab === "schedule" && (
                            <motion.div
                                key="schedule"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* PRIVATE AVAILABILITY */}
                                <section className="bg-white p-10 rounded-[40px] border border-[#E8E2D9] shadow-sm">
                                    <h3 className="text-2xl font-serif text-[#2C362B] mb-6 flex items-center gap-3">
                                        <Info className="text-[#D2B48C]" /> Private Tour Availability
                                    </h3>
                                    <div className="max-w-md">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Season Availability Text</label>
                                        <input
                                            type="text"
                                            value={formData.season_availability || ""}
                                            onChange={(e) => setFormData({ ...formData, season_availability: e.target.value })}
                                            placeholder="e.g. Year around or 10 Jun - 10 Sep"
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D2B48C] outline-none"
                                        />
                                        <p className="mt-2 text-xs text-slate-400 italic">This will appear in the "Mongolia Private Tours" table on the calendar page.</p>
                                    </div>
                                </section>

                                {/* GROUP DEPARTURES */}
                                <section className="bg-white p-10 rounded-[40px] border border-[#E8E2D9] shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-2xl font-serif text-[#2C362B] flex items-center gap-3">
                                            <Users className="text-[#4B5E4A]" /> Small-Group Departures
                                        </h3>
                                    </div>

                                    {/* DEPARTURE LIST */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4 px-6 mb-2">
                                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Start Date</span>
                                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">End Date</span>
                                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Status</span>
                                            <span></span>
                                        </div>

                                        {(formData.departures || []).map((dep: any, idx: number) => (
                                            <div key={idx} className="flex grid grid-cols-4 items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                                <div className="font-bold text-sm text-[#4B5E4A]">{dep.start_date}</div>
                                                <div className="font-bold text-sm text-[#4B5E4A]">{dep.end_date}</div>
                                                <div>
                                                    <select
                                                        value={dep.status}
                                                        onChange={(e) => {
                                                            const newDeps = [...(formData.departures || [])];
                                                            newDeps[idx].status = e.target.value;
                                                            setFormData({ ...formData, departures: newDeps });
                                                        }}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none focus:ring-0 ${dep.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                            dep.status === 'Sold Out' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}
                                                    >
                                                        <option value="Available">Available</option>
                                                        <option value="Sold Out">Sold Out</option>
                                                        <option value="Guaranteed">Guaranteed</option>
                                                    </select>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => {
                                                            const newDeps = (formData.departures || []).filter((_: any, i: number) => i !== idx);
                                                            setFormData({ ...formData, departures: newDeps });
                                                        }}
                                                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {(!formData.departures || formData.departures.length === 0) && (
                                            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 text-sm italic">No scheduled departures yet.</p>
                                            </div>
                                        )}

                                        {/* ADD NEW DEPARTURE FORM */}
                                        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-4 gap-4 items-end bg-[#FDFBF7]/50 p-6 rounded-3xl">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">New Start</label>
                                                <input type="date" id="new_start" className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">New End</label>
                                                <input type="date" id="new_end" className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Set Status</label>
                                                <select id="new_status" className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold">
                                                    <option value="Available">Available</option>
                                                    <option value="Guaranteed">Guaranteed</option>
                                                    <option value="Sold Out">Sold Out</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const start = (document.getElementById('new_start') as HTMLInputElement).value;
                                                    const end = (document.getElementById('new_end') as HTMLInputElement).value;
                                                    const status = (document.getElementById('new_status') as HTMLSelectElement).value;
                                                    if (!start || !end) return alert("Please select dates");

                                                    const newDeparture = { trip_id: formData._id, start_date: start, end_date: end, status };
                                                    setFormData({ ...formData, departures: [...(formData.departures || []), newDeparture] });

                                                    // Reset
                                                    (document.getElementById('new_start') as HTMLInputElement).value = "";
                                                    (document.getElementById('new_end') as HTMLInputElement).value = "";
                                                }}
                                                className="w-full py-2.5 bg-[#4B5E4A] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3d4d3c] transition-all"
                                            >
                                                Add Departure
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

const Landmark = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark">
        <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7 12 2" />
    </svg>
)

export default TourProductEditor;
