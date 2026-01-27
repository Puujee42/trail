"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Hotel,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    MessageSquare,
    User,
    Mail,
    Flag,
    Phone,
    Plus,
    Minus,
    Check
} from "lucide-react";

const CustomTripForm = ({ dictionary }: { dictionary: any }) => {
    const t = dictionary || {};

    const [formData, setFormData] = useState({
        adults: 2,
        children: 0,
        infants: 0,
        ages: [] as string[],
        hotel: "4stars",
        interests: [] as string[],
        arrivalDate: "",
        isFlexible: false,
        duration: "",
        budget: "",
        otherIdeas: "",
        fullName: "",
        email: "",
        nationality: "",
        phone: ""
    });

    const handleCounter = (field: "adults" | "children" | "infants", delta: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const hotelOptions = [
        { id: "5stars", title: t.hotelStyle?.options?.["5stars"]?.title || "5 Stars", desc: t.hotelStyle?.options?.["5stars"]?.desc || "Premium luxury" },
        { id: "4stars", title: t.hotelStyle?.options?.["4stars"]?.title || "4 Stars", desc: t.hotelStyle?.options?.["4stars"]?.desc || "High comfort" },
        { id: "3stars", title: t.hotelStyle?.options?.["3stars"]?.title || "3 Stars", desc: t.hotelStyle?.options?.["3stars"]?.desc || "Reliable standards" },
        { id: "self", title: t.hotelStyle?.options?.["self"]?.title || "Self-booking", desc: t.hotelStyle?.options?.["self"]?.desc || "I will organize my own" },
    ];

    const interestItems = t.interests?.items || {
        nature: "Nature and Wild",
        iconic: "Iconic Sites",
        adventure: "Adventure",
        history: "History",
        local: "Local Life",
        photography: "Photography",
        hiking: "Hiking"
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-sky-100/50 overflow-hidden border border-sky-50 transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-br from-sky-600 to-sky-400 p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-2xl shadow-sky-900/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="/image.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black mb-3 tracking-tight">{t.header?.title || "Create Your Masterpiece"}</h1>
                        <p className="text-sky-50 font-medium text-lg italic opacity-90 max-w-xl">
                            {t.header?.subtitle || "Tailor-made expeditions designed around your curiosity and pace."}
                        </p>
                    </div>
                </div>
                {/* Decorative gradients */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-800/20 rounded-full blur-[80px]" />
            </div>

            <form className="p-8 md:p-12 space-y-12" onSubmit={(e) => e.preventDefault()}>
                {/* Section 1: Travel Party */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <Users className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.travelParty?.title || "Travel Party"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.travelParty?.subtitle || "Who is exploring?"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: "adults", label: t.travelParty?.adults || "Adults", sub: t.travelParty?.adultsSub || "12+ years" },
                            { id: "children", label: t.travelParty?.children || "Children", sub: t.travelParty?.childrenSub || "2-11 years" },
                            { id: "infants", label: t.travelParty?.infants || "Infants", sub: t.travelParty?.infantsSub || "Under 2y" }
                        ].map((item) => (
                            <div key={item.id} className="group relative p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <p className="font-black text-slate-800 text-lg">{item.label}</p>
                                <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">{item.sub}</p>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleCounter(item.id as any, -1)}
                                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-90"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="text-2xl font-black text-slate-700 w-8 text-center">
                                        {formData[item.id as keyof typeof formData] as number}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCounter(item.id as any, 1)}
                                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Hotel & Style */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <Hotel className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.hotelStyle?.title || "Sanctuary Style"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.hotelStyle?.subtitle || "Where do you rest?"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotelOptions.map((opt) => (
                            <label
                                key={opt.id}
                                className={`relative flex flex-col p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 ${formData.hotel === opt.id
                                    ? "border-sky-500 bg-sky-50/20 ring-4 ring-sky-50"
                                    : "border-slate-50 bg-slate-50/30 hover:border-sky-200"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="hotel"
                                    className="hidden"
                                    value={opt.id}
                                    checked={formData.hotel === opt.id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hotel: e.target.value }))}
                                />
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{opt.title}</p>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.hotel === opt.id ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`}>
                                        {formData.hotel === opt.id && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-400 italic leading-tight">{opt.desc}</p>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Section 3: Interests */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <MapPin className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.interests?.title || "Curiosities"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.interests?.subtitle || "What sparks your interest?"}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(interestItems).map(([key, label]: [string, any]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggleInterest(label)}
                                className={`px-8 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-300 ${formData.interests.includes(label)
                                    ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-sky-300"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 4: Details & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{t.details?.arrivalDate || "Arrival Date"}</label>
                            <input
                                type="date"
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700"
                                value={formData.arrivalDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{t.details?.budget || "Budget Per Soul ($)"}</label>
                            <input
                                type="number"
                                placeholder={t.details?.budgetPlaceholder || "e.g. 2500"}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                value={formData.budget}
                                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{t.details?.narrative || "The Narrative"}</label>
                        <textarea
                            rows={6}
                            placeholder={t.details?.narrativePlaceholder || "Share your specific dreams or requirements for this journey..."}
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                            value={formData.otherIdeas}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherIdeas: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="p-8 bg-sky-50 rounded-[40px] border border-sky-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white text-sky-500 rounded-xl shadow-sm">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tight">{t.contact?.title || "Personal Details"}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text" placeholder={t.contact?.namePlaceholder || "Full Name"}
                            className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                        <input
                            type="email" placeholder={t.contact?.emailPlaceholder || "Email Address"}
                            className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="group relative w-full py-6 bg-slate-900 overflow-hidden rounded-[30px] font-black text-white uppercase tracking-[0.2em] shadow-2xl transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 group-hover:text-white transition-colors">{t.submit || "Dispatch Inquiry"}</span>
                </button>
            </form>
        </div>
    );
};

export default CustomTripForm;
