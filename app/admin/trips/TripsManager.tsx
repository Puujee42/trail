"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt, FaSpinner, FaMapSigns, FaRegCalendarAlt } from "react-icons/fa";
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
    field?: keyof Trip; // 'field' can be optional if you only pass it for some
    value: {
        mn: string;
        en: string;
        ko: string;
    };
    // Define the function signature for onChange
    onChange: (field: keyof Trip, lang: Language, value: string) => void;
}


interface Trip {
  _id: string;
  title: { mn: string; en: string; ko: string };
  location: { mn: string; en: string; ko: string };
  description: { mn: string; en: string; ko: string };
  price: { mn: number; en: number; ko: number };
  duration: { mn: string; en: string; ko: string };
  image: string;
  itinerary: ItineraryItem[]; // Added
}

const BLANK_FORM_DATA = {
    title: { mn: "", en: "", ko: "" },
    location: { mn: "", en: "", ko: "" },
    description: { mn: "", en: "", ko: "" },
    duration: { mn: "", en: "", ko: "" },
    price: { mn: 0, en: 0, ko: 0 },
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
        ...BLANK_FORM_DATA, // Start with defaults
        ...trip, // Override with trip data
        itinerary: trip.itinerary || [] // Ensure itinerary is always an array
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // --- NEW: Itinerary Handlers ---
  const handleItineraryChange = (index: number, lang: 'mn' | 'en' | 'ko', field: 'title' | 'desc', value: string) => {
    setFormData(prev => {
        const newItinerary = [...(prev.itinerary || [])];
        newItinerary[index] = {
            ...newItinerary[index],
            [field]: {
                ...(newItinerary[index][field]),
                [lang]: value
            }
        };
        return { ...prev, itinerary: newItinerary };
    });
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
        ...prev,
        itinerary: [
            ...(prev.itinerary || []),
            { 
                day: (prev.itinerary?.length || 0) + 1, 
                title: { mn: '', en: '', ko: '' },
                desc: { mn: '', en: '', ko: '' }
            }
        ]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
        ...prev,
        itinerary: (prev.itinerary || []).filter((_, i) => i !== index)
    }));
  };

  // --- Cloudinary & Form Handlers ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTrilingualChange = (field: keyof Trip, lang: 'mn' | 'en' | 'ko', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field] as any), [lang]: value }
    }));
  };

  const handlePriceChange = (lang: 'mn' | 'en' | 'ko', value: string) => {
    setFormData(prev => ({
      ...prev,
      price: { ...(prev.price as any), [lang]: Number(value) || 0 }
    }));
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Trips</h1>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700">
          <FaPlus /> Create New Trip
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Trip Title (EN)</th>
              <th className="p-4">Days</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-slate-50">
                <td className="p-2"><img src={trip.image} className="w-16 h-12 rounded object-cover" /></td>
                <td className="p-4 font-bold text-slate-800">{trip.title.en}</td>
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingTrip ? "Edit Trip" : "Create New Trip"}</h2>
                <button onClick={handleCloseModal}><FaTimes /></button>
              </div>
              <form id="tripForm" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                
                {/* --- IMAGE & BASIC INFO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed h-full rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                            {uploadingImage ? <FaSpinner className="animate-spin text-2xl" /> : formData.image ? <img src={formData.image} className="h-40 rounded object-cover" /> : <div className="text-slate-400 text-center"><FaCloudUploadAlt className="text-3xl mx-auto" /><p>Upload</p></div>}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>
                    {/* Basic Fields */}
                    <div className="space-y-4">
                        <TrilingualInput label="Title" field="title" value={formData.title || { mn: '', en: '', ko: '' }} onChange={handleTrilingualChange} />
                        <TrilingualInput label="Location" field="location" value={formData.location || { mn: '', en: '', ko: '' }} onChange={handleTrilingualChange} />
                        <TrilingualInput label="Duration" field="duration" value={formData.duration || { mn: '', en: '', ko: '' }} onChange={handleTrilingualChange} />
                    </div>
                </div>

                {/* --- DESCRIPTION & PRICE --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description (EN)</label>
                        <textarea value={formData.description?.en || ''} onChange={(e) => handleTrilingualChange('description', 'en', e.target.value)} rows={4} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Price</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" value={formData.price?.mn || ''} onChange={(e) => handlePriceChange('mn', e.target.value)} placeholder="MNT" className="w-full border p-2 rounded" />
                            <input type="number" value={formData.price?.en || ''} onChange={(e) => handlePriceChange('en', e.target.value)} placeholder="USD" className="w-full border p-2 rounded" />
                            <input type="number" value={formData.price?.ko || ''} onChange={(e) => handlePriceChange('ko', e.target.value)} placeholder="KRW" className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>
                
                {/* --- DYNAMIC ITINERARY SECTION --- */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FaMapSigns /> Itinerary</h3>
                        <button type="button" onClick={addItineraryDay} className="flex items-center gap-2 text-sm bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg hover:bg-blue-200">
                           <FaPlus /> Add Day
                        </button>
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
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
              <div className="p-6 border-t mt-auto flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button>
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

const TrilingualInput: React.FC<TrilingualInputProps> = ({ label, field, value, onChange }) => {
    // We need a fallback for the field name if it's not passed (for itinerary)
    const currentField = field || 'title'; // 'title' is just a placeholder

    return (
        <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input 
                    value={value?.mn || ''} 
                    onChange={(e) => onChange(currentField, 'mn', e.target.value)} 
                    placeholder="MN" 
                    className="w-full border p-2 rounded text-sm" 
                />
                <input 
                    value={value?.en || ''} 
                    onChange={(e) => onChange(currentField, 'en', e.target.value)} 
                    placeholder="EN" 
                    className="w-full border p-2 rounded text-sm" 
                />
                <input 
                    value={value?.ko || ''} 
                    onChange={(e) => onChange(currentField, 'ko', e.target.value)} 
                    placeholder="KO" 
                    className="w-full border p-2 rounded text-sm" 
                />
            </div>
        </div>
    );
};