"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt, FaSpinner,
FaMapSigns, FaCalendarAlt, FaUserPlus, FaSearch, FaUserCircle, FaMinusCircle
} from "react-icons/fa";
import { useRouter } from "next/navigation";
// --- Types ---
interface ItineraryItem {
day: number;
title: { mn: string; en: string; ko: string };
desc: { mn: string; en: string; ko: string };
}
interface TripDate {
id: string;
startDate: string;
endDate: string;
maxSeats: number;
bookedSeats: number;
}
interface Trip {
_id: string;
title: { mn: string; en: string; ko: string };
location: { mn: string; en: string; ko: string };
description: { mn: string; en: string; ko: string };
duration: { mn: string; en: string; ko: string };
ageGroup: { mn: string; en: string; ko: string };
price: { mn: number; en: number; ko: number };
rating: number;
featured: boolean;
type: string;
region: string;
category: string;
image: string;
perks: string[];
tags: string[];
itinerary: ItineraryItem[];
dates: TripDate[];
}
interface ClerkUser {
id: string;
name: string;
email: string;
image: string;
}
interface Passenger {
_id: string;
userName: string;
userEmail: string;
status: string;
}
type Language = 'mn' | 'en' | 'ko';
interface TrilingualInputProps {
label: string;
field?: keyof Trip;
value: { mn: string; en: string; ko: string };
onChange: (field: keyof Trip, lang: Language, value: string) => void;
isTextarea?: boolean;
}
interface TrilingualItinProps {
label: string;
value: { mn: string; en: string; ko: string };
onChange: (lang: Language, value: string) => void;
isTextarea?: boolean;
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
    perks: [],
    tags: [],
    image: "",
    itinerary: [],
    dates: [],
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
// --- PASSENGER MANAGEMENT STATE ---
const [managingDate, setManagingDate] = useState<TripDate | null>(null);
const [passengerSearchQuery, setPassengerSearchQuery] = useState("");
const [userSearchResults, setUserSearchResults] = useState<ClerkUser[]>([]);
const [isSearchingUsers, setIsSearchingUsers] = useState(false);
const [currentPassengers, setCurrentPassengers] = useState<Passenger[]>([]);
const [loadingPassengers, setLoadingPassengers] = useState(false);
// Prevent background scrolling when any modal is open
useEffect(() => {
  if (isModalOpen || managingDate) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isModalOpen, managingDate]);
// --- Handlers (Standard) ---
const handleOpenCreate = () => {
setEditingTrip(null);
setFormData(BLANK_FORM_DATA);
setIsModalOpen(true);
};
const handleOpenEdit = (trip: Trip) => {
setEditingTrip(trip);
setFormData({ ...BLANK_FORM_DATA, ...trip, itinerary: trip.itinerary || [], dates: trip.dates || [] });
setIsModalOpen(true);
};
const handleCloseModal = () => setIsModalOpen(false);
const handleTrilingualChange = (field: keyof Trip, lang: Language, value: string) => {
setFormData(prev => ({ ...prev, [field]: { ...(prev[field] as any), [lang]: value } }));
};
const handlePriceChange = (lang: Language, value: string) => {
setFormData(prev => ({ ...prev, price: { ...(prev.price as any), [lang]: Number(value) || 0 } }));
};
const handleArrayInput = (field: 'perks' | 'tags', value: string) => {
setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
};
const handleItineraryChange = (index: number, lang: Language, field: 'title' | 'desc', value: string) => {
setFormData(prev => {
const newItinerary = [...(prev.itinerary || [])];
newItinerary[index] = { ...newItinerary[index], [field]: { ...(newItinerary[index][field]), [lang]: value } };
return { ...prev, itinerary: newItinerary };
});
};
const addItineraryDay = () => {
setFormData(prev => ({ ...prev, itinerary: [ ...(prev.itinerary || []), { day: (prev.itinerary?.length || 0) + 1, title: { mn: '', en: '', ko: '' }, desc: { mn: '', en: '', ko: '' } } ] }));
};
const removeItineraryDay = (index: number) => {
setFormData(prev => ({ ...prev, itinerary: (prev.itinerary || []).filter((_, i) => i !== index) }));
};
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;
setUploadingImage(true);
const formPayload = new FormData();
formPayload.append("file", file);
formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");
try {
const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: "POST", body: formPayload });
const data = await res.json();
setFormData(prev => ({ ...prev, image: data.secure_url }));
} catch (err) { alert("Image upload failed."); }
finally { setUploadingImage(false); }
};
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
const method = editingTrip ? "PATCH" : "POST";
const body = editingTrip ? { ...formData, _id: editingTrip._id } : formData;
try {
await fetch("/api/admin/trips", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
handleCloseModal();
router.refresh();
window.location.reload();
} catch (err) { alert("An error occurred."); }
finally { setLoading(false); }
};
const handleDelete = async (_id: string) => {
if (!confirm("Are you sure?")) return;
try {
await fetch("/api/admin/trips", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id }) });
setTrips(prev => prev.filter(t => t._id !== _id));
router.refresh();
} catch (err) { alert("An error occurred."); }
};
// --- DATE GROUP LOGIC ---
const addDateGroup = () => {
const newGroup: TripDate = { id: crypto.randomUUID(), startDate: "", endDate: "", maxSeats: 20, bookedSeats: 0 };
setFormData(prev => ({ ...prev, dates: [...(prev.dates || []), newGroup] }));
};
const updateDateGroup = (index: number, field: keyof TripDate, value: string | number) => {
setFormData(prev => {
const newDates = [...(prev.dates || [])];
newDates[index] = { ...newDates[index], [field]: value };
return { ...prev, dates: newDates };
});
};
const removeDateGroup = (index: number) => {
setFormData(prev => ({ ...prev, dates: (prev.dates || []).filter((_, i) => i !== index) }));
};
// --- PASSENGER MANAGEMENT HANDLERS ---
// 1. Open Passenger Modal & Fetch Data
const handleManagePassengers = async (date: TripDate) => {
if (!editingTrip?._id) {
alert("Please save the trip first before managing passengers.");
return;
}
setManagingDate(date);
setLoadingPassengers(true);
setPassengerSearchQuery("");
setUserSearchResults([]);
try {
const res = await fetch(`/api/admin/bookings?tripId=${editingTrip._id}&dateId=${date.id}`);
const data = await res.json();
setCurrentPassengers(data);
} catch (error) {
console.error("Failed to load passengers", error);
} finally {
setLoadingPassengers(false);
}
};
// 2. Search Clerk Users
const handleSearchUsers = async (e: React.FormEvent) => {
e.preventDefault();
if (passengerSearchQuery.length < 3) return;
setIsSearchingUsers(true);
try {
const res = await fetch(`/api/admin/users/search?query=${passengerSearchQuery}`);
const data = await res.json();
setUserSearchResults(data);
} catch (error) {
alert("Search failed");
} finally {
setIsSearchingUsers(false);
}
};
// 3. Add User to Date (Create Booking)
const handleAddPassenger = async (user: ClerkUser) => {
if (!managingDate || !editingTrip) return;
if (!confirm(`Add ${user.name} to this trip?`)) return;
try {
const res = await fetch("/api/admin/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tripId: editingTrip._id,
                dateId: managingDate.id,
                userId: user.id,
                userEmail: user.email,
                userName: user.name,
                tripTitle: editingTrip.title,
                price: editingTrip.price?.mn || 0,
                tripImage: editingTrip.image
})
});
if (!res.ok) throw new Error("Failed");
// Refresh Lists
const refreshRes = await fetch(`/api/admin/bookings?tripId=${editingTrip._id}&dateId=${managingDate.id}`);
const refreshData = await refreshRes.json();
setCurrentPassengers(refreshData);
// Update UI Count
const dateIndex = formData.dates?.findIndex(d => d.id === managingDate.id);
if (dateIndex !== undefined && dateIndex > -1) {
updateDateGroup(dateIndex, 'bookedSeats', (formData.dates![dateIndex].bookedSeats || 0) + 1);
}
alert("Passenger added successfully");
setUserSearchResults([]);
setPassengerSearchQuery("");
} catch (error) {
alert("Failed to add passenger");
}
};
// 4. DELETE Passenger Handler (NEW)
const handleRemovePassenger = async (bookingId: string, userName: string) => {
if (!managingDate || !editingTrip) return;
if (!confirm(`Are you sure you want to remove ${userName} from this group?`)) return;
try {
const res = await fetch("/api/admin/bookings", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId })
});
if (!res.ok) throw new Error("Failed");
// Refresh List (Remove from UI)
setCurrentPassengers(prev => prev.filter(p => p._id !== bookingId));
// Update UI Count (Decrease)
const dateIndex = formData.dates?.findIndex(d => d.id === managingDate.id);
if (dateIndex !== undefined && dateIndex > -1) {
const currentSeats = formData.dates![dateIndex].bookedSeats || 0;
updateDateGroup(dateIndex, 'bookedSeats', Math.max(0, currentSeats - 1));
}
} catch (error) {
alert("Failed to remove passenger");
}
};
return (
<div>
      {/* Header & Main List */}
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
<th className="p-4">Title (EN)</th>
<th className="p-4">Dates</th>
<th className="p-4 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100">
            {trips.map((trip) => (
<tr key={trip._id} className="hover:bg-slate-50">
<td className="p-2"><img src={trip.image} className="w-16 h-12 rounded object-cover bg-slate-100" /></td>
<td className="p-4 font-bold text-slate-800">{trip.title.en}</td>
<td className="p-4 text-sm text-slate-600">
                   {trip.dates?.length > 0 ? (
<span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                           {trip.dates.length} Groups
</span>
                   ) : <span className="text-slate-400">No dates</span>}
</td>
<td className="p-4 text-right flex justify-end gap-2">
<button onClick={() => handleOpenEdit(trip)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
<button onClick={() => handleDelete(trip._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
</td>
</tr>
            ))}
</tbody>
</table>
</div>
      {/* TRIP EDITOR MODAL */}
<AnimatePresence>
        {isModalOpen && (
<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
<motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
<div className="p-6 border-b flex justify-between items-center">
<h2 className="text-xl font-bold">{editingTrip ? "Edit Trip" : "Create New Trip"}</h2>
<button onClick={handleCloseModal}><FaTimes /></button>
</div>
<form id="tripForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Top Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="col-span-1">
<label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
<div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed h-48 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden bg-slate-50">
                            {uploadingImage ? <FaSpinner className="animate-spin text-2xl" /> : formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-slate-400 text-center"><FaCloudUploadAlt className="text-3xl mx-auto" /><p>Upload</p></div>}
<input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
</div>
</div>
<div className="col-span-2 grid grid-cols-2 gap-4">
<div><label className="text-xs font-bold text-slate-500">Type</label><input className="w-full border p-2 rounded text-sm" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} /></div>
<div><label className="text-xs font-bold text-slate-500">Region</label><input className="w-full border p-2 rounded text-sm" value={formData.region || ''} onChange={e => setFormData({...formData, region: e.target.value})} /></div>
<div><label className="text-xs font-bold text-slate-500">Category</label><input className="w-full border p-2 rounded text-sm" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
<div><label className="text-xs font-bold text-slate-500">Rating</label><input type="number" step="0.1" className="w-full border p-2 rounded text-sm" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} /></div>
</div>
</div>
                {/* 2. Trilingual & Details */}
<div className="space-y-4 border-t pt-6">
<TrilingualInput label="Trip Title" field="title" value={formData.title || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
<TrilingualInput label="Location" field="location" value={formData.location || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
<TrilingualInput label="Description" field="description" value={formData.description || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} isTextarea={true} />
<TrilingualInput label="Duration" field="duration" value={formData.duration || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
<TrilingualInput label="Age Group" field="ageGroup" value={formData.ageGroup || {mn:'',en:'',ko:''}} onChange={handleTrilingualChange} />
<div className="grid grid-cols-3 gap-2">
<input type="number" value={formData.price?.mn || ''} onChange={(e) => handlePriceChange('mn', e.target.value)} placeholder="MNT" className="w-full border p-2 rounded" />
<input type="number" value={formData.price?.en || ''} onChange={(e) => handlePriceChange('en', e.target.value)} placeholder="USD" className="w-full border p-2 rounded" />
<input type="number" value={formData.price?.ko || ''} onChange={(e) => handlePriceChange('ko', e.target.value)} placeholder="KRW" className="w-full border p-2 rounded" />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1">Perks (comma separated)</label>
<input className="w-full border p-2 rounded text-sm" value={formData.perks?.join(', ') || ''} onChange={e => handleArrayInput('perks', e.target.value)} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1">Tags (comma separated)</label>
<input className="w-full border p-2 rounded text-sm" value={formData.tags?.join(', ') || ''} onChange={e => handleArrayInput('tags', e.target.value)} />
</div>
</div>
                {/* 3. DATE GROUPS SECTION (UPDATED) */}
<div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
<div className="flex justify-between items-center mb-4">
<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
<FaCalendarAlt className="text-blue-600" /> Departure Groups
</h3>
<button type="button" onClick={addDateGroup} className="flex items-center gap-2 text-sm bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm">
<FaPlus /> Add Date
</button>
</div>
                    {formData.dates && formData.dates.length > 0 ? (
<div className="grid grid-cols-1 gap-3">
                            {formData.dates.map((date, index) => (
<div key={date.id || index} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded border border-blue-200 shadow-sm">
<div className="flex-1 min-w-[150px]">
<label className="text-xs font-bold text-slate-500 block">Start Date</label>
<input type="date" value={date.startDate} onChange={(e) => updateDateGroup(index, 'startDate', e.target.value)} className="w-full border p-1 rounded text-sm" />
</div>
<div className="flex-1 min-w-[150px]">
<label className="text-xs font-bold text-slate-500 block">End Date</label>
<input type="date" value={date.endDate} onChange={(e) => updateDateGroup(index, 'endDate', e.target.value)} className="w-full border p-1 rounded text-sm" />
</div>
<div className="w-20">
<label className="text-xs font-bold text-slate-500 block">Max</label>
<input type="number" value={date.maxSeats} onChange={(e) => updateDateGroup(index, 'maxSeats', Number(e.target.value))} className="w-full border p-1 rounded text-sm" />
</div>
<div className="w-20">
<label className="text-xs font-bold text-slate-500 block">Booked</label>
<input type="number" value={date.bookedSeats} readOnly className="w-full bg-slate-100 border p-1 rounded text-sm text-slate-500 cursor-not-allowed" />
</div>
                                    {/* MANAGE PASSENGERS BUTTON */}
<button
type="button"
onClick={() => handleManagePassengers(date)}
disabled={!editingTrip}
className="mt-4 flex items-center gap-1 text-xs bg-slate-800 text-white px-3 py-2 rounded hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
>
<FaUserPlus /> Passengers
</button>
<button type="button" onClick={() => removeDateGroup(index)} className="mt-4 p-2 text-red-400 hover:bg-red-50 rounded">
<FaTrash />
</button>
</div>
                            ))}
</div>
                    ) : (
<p className="text-sm text-slate-500 italic">No dates added yet.</p>
                    )}
</div>
                {/* 4. Itinerary (Standard) */}
<div className="border-t pt-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FaMapSigns /> Itinerary</h3>
<button type="button" onClick={addItineraryDay} className="flex items-center gap-2 text-sm bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg hover:bg-slate-200">
<FaPlus /> Add Day
</button>
</div>
{formData.itinerary && formData.itinerary.length > 0 ? (
<div className="grid grid-cols-1 gap-3">
{formData.itinerary.map((item, index) => (
<div key={index} className="bg-white p-4 rounded border border-slate-200 shadow-sm">
<h4 className="text-md font-bold mb-4">Day {item.day}</h4>
<div className="space-y-4">
<TrilingualItinInput label="Title" value={item.title} onChange={(lang, value) => handleItineraryChange(index, lang, 'title', value)} />
<TrilingualItinInput label="Description" value={item.desc} onChange={(lang, value) => handleItineraryChange(index, lang, 'desc', value)} isTextarea={true} />
</div>
<div className="mt-4 flex justify-end">
<button type="button" onClick={() => removeItineraryDay(index)} className="p-2 text-red-400 hover:bg-red-50 rounded">
<FaTrash />
</button>
</div>
</div>
))}
</div>
) : (
<p className="text-sm text-slate-500 italic">No days added yet.</p>
)}
</div>
</form>
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
      {/* --- PASSENGER MANAGEMENT MODAL --- */}
<AnimatePresence>
        {managingDate && (
<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
<motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
<div className="p-4 bg-slate-50 border-b flex justify-between items-center">
<div>
<h3 className="text-lg font-bold text-slate-800">Manage Passengers</h3>
<p className="text-sm text-slate-500">
                            Trip: {editingTrip?.title.en} <br/>
                            Date: {managingDate.startDate} - {managingDate.endDate}
</p>
</div>
<button onClick={() => setManagingDate(null)} className="p-2 hover:bg-slate-200 rounded-full"><FaTimes /></button>
</div>
<div className="flex-1 overflow-y-auto p-6">
                    {/* 1. Search Section */}
<div className="mb-8">
<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Add New Passenger (Search Clerk)</label>
<form onSubmit={handleSearchUsers} className="flex gap-2">
<div className="relative flex-1">
<FaSearch className="absolute left-3 top-3 text-slate-400" />
<input
type="text"
placeholder="Search by name or email..."
value={passengerSearchQuery}
onChange={(e) => setPassengerSearchQuery(e.target.value)}
className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
/>
</div>
<button type="submit" disabled={isSearchingUsers} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                                {isSearchingUsers ? "..." : "Search"}
</button>
</form>
                        {/* Search Results */}
                        {userSearchResults.length > 0 && (
<div className="mt-2 bg-white border rounded-lg shadow-sm divide-y">
                                {userSearchResults.map(user => (
<div key={user.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
<div className="flex items-center gap-3">
<img src={user.image} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
<div>
<p className="text-sm font-bold text-slate-800">{user.name}</p>
<p className="text-xs text-slate-500">{user.email}</p>
</div>
</div>
<button onClick={() => handleAddPassenger(user)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hover:bg-green-200">
                                            Add +
</button>
</div>
                                ))}
</div>
                        )}
</div>
                    {/* 2. Current Passengers List */}
<div>
<div className="flex justify-between items-center mb-4">
<h4 className="font-bold text-slate-700">Passenger List</h4>
<span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                Total: {currentPassengers.length}
</span>
</div>
                        {loadingPassengers ? (
<div className="text-center py-10 text-slate-400"><FaSpinner className="animate-spin inline mr-2"/> Loading...</div>
                        ) : currentPassengers.length === 0 ? (
<div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed text-slate-400">
                                No passengers booked yet.
</div>
                        ) : (
<div className="space-y-2">
                                {currentPassengers.map((passenger) => (
<div key={passenger._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
<FaUserCircle size={20} />
</div>
<div>
<p className="text-sm font-bold text-slate-800">{passenger.userName}</p>
<p className="text-xs text-slate-500">{passenger.userEmail}</p>
</div>
</div>
<div className="flex items-center gap-3">
<span className="text-xs uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                {passenger.status}
</span>
                                            {/* DELETE BUTTON */}
<button
onClick={() => handleRemovePassenger(passenger._id, passenger.userName)}
className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
title="Remove Passenger"
>
<FaTrash />
</button>
</div>
</div>
                                ))}
</div>
                        )}
</div>
</div>
</motion.div>
</div>
        )}
</AnimatePresence>
</div>
  );
}
// Helper (Standard)
const TrilingualInput: React.FC<TrilingualInputProps> = ({ label, field, value, onChange, isTextarea = false }) => {
const currentField = field || 'title';
const InputComponent = isTextarea ? 'textarea' : 'input';
return (
<div className="mb-2">
<label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
<InputComponent value={value?.mn || ''} onChange={(e) => onChange(currentField, 'mn', e.target.value)} placeholder="MN" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
<InputComponent value={value?.en || ''} onChange={(e) => onChange(currentField, 'en', e.target.value)} placeholder="EN" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
<InputComponent value={value?.ko || ''} onChange={(e) => onChange(currentField, 'ko', e.target.value)} placeholder="KO" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
</div>
</div>
    );
};
// Helper for Itinerary
const TrilingualItinInput: React.FC<TrilingualItinProps> = ({ label, value, onChange, isTextarea = false }) => {
const InputComponent = isTextarea ? 'textarea' : 'input';
return (
<div className="mb-2">
<label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
<InputComponent value={value?.mn || ''} onChange={(e) => onChange('mn', e.target.value)} placeholder="MN" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
<InputComponent value={value?.en || ''} onChange={(e) => onChange('en', e.target.value)} placeholder="EN" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
<InputComponent value={value?.ko || ''} onChange={(e) => onChange('ko', e.target.value)} placeholder="KO" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none" rows={isTextarea ? 3 : undefined} />
</div>
</div>
    );
};