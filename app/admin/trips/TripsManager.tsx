"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt, FaSpinner, FaMapSigns, FaListUl, FaTags } from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Types ---
interface ItineraryItem {
  day: number;
  title: { mn: string; en: string; ko: string };
  desc: { mn: string; en: string; ko: string };
}
type Language = 'mn' | 'en' | 'ko';

interface TrilingualInputProps {
    label: string;
    field?: keyof Trip;
    value: { mn: string; en: string; ko: string };
    onChange: (field: keyof Trip, lang: Language, value: string) => void;
}

interface Trip {
  _id: string;
  // Trilingual Fields
  title: { mn: string; en: string; ko: string };
  location: { mn: string; en: string; ko: string };
  description: { mn: string; en: string; ko: string };
  duration: { mn: string; en: string; ko: string };
  ageGroup: { mn: string; en: string; ko: string }; // NEW
  
  // Numeric/Boolean Fields
  price: { mn: number; en: number; ko: number };
  rating: number; // NEW
  saleMonth?: number; // NEW
  featured: boolean; // NEW
  seatsLeft?: number; // NEW

  // String/Array Fields
  type: string; // NEW (e.g., "family")
  region: string; // NEW (e.g., "europe")
  category: string; // NEW (e.g., "theme_park")
  image: string;
  perks: string[]; // NEW
  tags: string[]; // NEW
  
  itinerary: ItineraryItem[];
}

const BLANK_FORM_DATA: Partial<Trip> = {
    title: { mn: "", en: "", ko: "" },
    location: { mn: "", en: "", ko: "" },
    description: { mn: "", en: "", ko: "" },
    duration: { mn: "", en: "", ko: "" },
    ageGroup: { mn: "Бүх нас", en: "All Ages", ko: "전연령" },
    price: { mn: 0, en: 0, ko: 0 },
    rating: 5.0,
    type: "standard",
    region: "europe",
    category: "nature",
    featured: false,
    saleMonth: 0,
    seatsLeft: 20,
    perks: [],
    tags: [],
    image: "",
    itinerary: [],
};

export default function TripsManager({ initialTrips }: { initialTrips: Trip[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [trips, setTrips] = useState(initialTrips);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState<Partial<Trip>>(BLANK_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setFormData(BLANK_FORM_DATA);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
        ...BLANK_FORM_DATA, 
        ...trip, 
        itinerary: trip.itinerary || [] 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // --- Helper Handlers ---
  const handleTrilingualChange = (field: keyof Trip, lang: Language, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field] as any), [lang]: value }
    }));
  };

  const handlePriceChange = (lang: Language, value: string) => {
    setFormData(prev => ({
      ...prev,
      price: { ...(prev.price as any), [lang]: Number(value) || 0 }
    }));
  };

  // Convert comma-separated string to array for Perks/Tags
  const handleArrayInput = (field: 'perks' | 'tags', value: string) => {
    setFormData(prev => ({
        ...prev,
        [field]: value.split(',').map(item => item.trim())
    }));
  };

  // Itinerary Logic
  const handleItineraryChange = (index: number, lang: Language, field: 'title' | 'desc', value: string) => {
    setFormData(prev => {
        const newItinerary = [...(prev.itinerary || [])];
        newItinerary[index] = {
            ...newItinerary[index],
            [field]: { ...(newItinerary[index][field]), [lang]: value }
        };
        return { ...prev, itinerary: newItinerary };
    });
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
        ...prev,
        itinerary: [ ...(prev.itinerary || []), { day: (prev.itinerary?.length || 0) + 1, title: { mn: '', en: '', ko: '' }, desc: { mn: '', en: '', ko: '' } } ]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
        ...prev,
        itinerary: (prev.itinerary || []).filter((_, i) => i !== index)
    }));
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST", body: formPayload,
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingTrip ? "PATCH" : "POST";
    const body = editingTrip ? { ...formData, _id: editingTrip._id } : formData;

    try {
      await fetch("/api/admin/trips", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      handleCloseModal();
      router.refresh(); 
      window.location.reload(); // Hard refresh to ensure data sync
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch("/api/admin/trips", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id }),
      });
      setTrips(prev => prev.filter(t => t._id !== _id));
      router.refresh();
    } catch (err) {
      alert("An error occurred.");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Trips</h1>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700">
          <FaPlus /> Create New Trip
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title (EN)</th>
              <th className="p-4">Type/Cat</th>
              <th className="p-4">Days</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-slate-50">
                <td className="p-2"><img src={trip.image} className="w-16 h-12 rounded object-cover bg-slate-100" /></td>
                <td className="p-4 font-bold text-slate-800">{trip.title.en}</td>
                <td className="p-4 text-xs font-bold text-slate-500 uppercase">{trip.type} / {trip.category}</td>
                <td className="p-4 text-slate-600">{trip.itinerary?.length || 0} days</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenEdit(trip)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                  <button onClick={() => handleDelete(trip._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingTrip ? "Edit Trip" : "Create New Trip"}</h2>
                <button onClick={handleCloseModal}><FaTimes /></button>
              </div>

              {/* Modal Form */}
              <form id="tripForm" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-8">
                
                {/* 1. TOP SECTION: Image + Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Image Upload */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed h-48 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden bg-slate-50">
                            {uploadingImage ? <FaSpinner className="animate-spin text-2xl" /> : formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-slate-400 text-center"><FaCloudUploadAlt className="text-3xl mx-auto" /><p>Upload</p></div>}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        
                        {/* Featured Checkbox */}
                        <div className="mt-4 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                             <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                             <label className="text-sm font-bold text-yellow-800">Featured Trip (Show on Home)</label>
                        </div>
                    </div>

                    {/* Right: Metadata Inputs */}
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Type (e.g., family, standard)</label>
                            <input className="w-full border p-2 rounded text-sm" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Region (e.g., europe, mongolia)</label>
                            <input className="w-full border p-2 rounded text-sm" value={formData.region || ''} onChange={e => setFormData({...formData, region: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Category (e.g., theme_park)</label>
                            <input className="w-full border p-2 rounded text-sm" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Rating (1-5)</label>
                            <input type="number" step="0.1" className="w-full border p-2 rounded text-sm" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Seats Left</label>
                            <input type="number" className="w-full border p-2 rounded text-sm" value={formData.seatsLeft || ''} onChange={e => setFormData({...formData, seatsLeft: Number(e.target.value)})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Sale Month (0 = None, 1-12)</label>
                            <input type="number" className="w-full border p-2 rounded text-sm" value={formData.saleMonth || ''} onChange={e => setFormData({...formData, saleMonth: Number(e.target.value)})} />
                         </div>
                    </div>
                </div>

                {/* 2. TRILINGUAL SECTION */}
                <div className="space-y-4 border-t pt-6">
                    <h3 className="font-bold text-slate-800">Trilingual Details</h3>
                    <TrilingualInput label="Trip Title" field="title" value={formData.title || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
                    <TrilingualInput label="Location" field="location" value={formData.location || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
                    <TrilingualInput label="Duration" field="duration" value={formData.duration || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
                    <TrilingualInput label="Age Group" field="ageGroup" value={formData.ageGroup || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
                </div>

                {/* 3. DESCRIPTION & PRICING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    {/* Descriptions */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Description</label>
                        <textarea placeholder="MN Description" value={formData.description?.mn} onChange={e => handleTrilingualChange('description', 'mn', e.target.value)} className="w-full border p-2 rounded text-sm h-20" />
                        <textarea placeholder="EN Description" value={formData.description?.en} onChange={e => handleTrilingualChange('description', 'en', e.target.value)} className="w-full border p-2 rounded text-sm h-20" />
                        <textarea placeholder="KO Description" value={formData.description?.ko} onChange={e => handleTrilingualChange('description', 'ko', e.target.value)} className="w-full border p-2 rounded text-sm h-20" />
                    </div>
                    {/* Prices & Extras */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pricing</label>
                            <div className="grid grid-cols-3 gap-2">
                                <input type="number" value={formData.price?.mn || ''} onChange={(e) => handlePriceChange('mn', e.target.value)} placeholder="MNT" className="w-full border p-2 rounded" />
                                <input type="number" value={formData.price?.en || ''} onChange={(e) => handlePriceChange('en', e.target.value)} placeholder="USD" className="w-full border p-2 rounded" />
                                <input type="number" value={formData.price?.ko || ''} onChange={(e) => handlePriceChange('ko', e.target.value)} placeholder="KRW" className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"><FaListUl className="inline mr-1"/> Perks (Comma separated)</label>
                            <input className="w-full border p-2 rounded text-sm" placeholder="Ticket, Park, City Tour..." value={formData.perks?.join(", ") || ''} onChange={e => handleArrayInput('perks', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"><FaTags className="inline mr-1"/> Tags (Comma separated)</label>
                            <input className="w-full border p-2 rounded text-sm" placeholder="kids, park, paris..." value={formData.tags?.join(", ") || ''} onChange={e => handleArrayInput('tags', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* 4. ITINERARY */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FaMapSigns /> Itinerary</h3>
                        <button type="button" onClick={addItineraryDay} className="flex items-center gap-2 text-sm bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg hover:bg-blue-200">
                           <FaPlus /> Add Day
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.itinerary?.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                                <button type="button" onClick={() => removeItineraryDay(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full"><FaTrash size={12}/></button>
                                <p className="font-bold text-slate-600 mb-2">Day {index + 1}</p>
                                <div className="space-y-2">
                                    <TrilingualInput label="Day Title" value={item.title} onChange={(f, l, v) => handleItineraryChange(index, l, 'title', v)} />
                                    <TrilingualInput label="Day Description" value={item.desc} onChange={(f, l, v) => handleItineraryChange(index, l, 'desc', v)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t mt-auto flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded">Cancel</button>
                <button type="submit" form="tripForm" disabled={loading || uploadingImage} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Trip"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Component
const TrilingualInput: React.FC<TrilingualInputProps> = ({ label, field, value, onChange }) => {
    const currentField = field || 'title'; 
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input 
                    value={value?.mn || ''} 
                    onChange={(e) => onChange(currentField, 'mn', e.target.value)} 
                    placeholder="MN" 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                />
                <input 
                    value={value?.en || ''} 
                    onChange={(e) => onChange(currentField, 'en', e.target.value)} 
                    placeholder="EN" 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                />
                <input 
                    value={value?.ko || ''} 
                    onChange={(e) => onChange(currentField, 'ko', e.target.value)} 
                    placeholder="KO" 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                />
            </div>
        </div>
    );
};