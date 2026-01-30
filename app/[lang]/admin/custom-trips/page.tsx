"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Users,
    Calendar,
    MapPin,
    DollarSign,
    Hotel,
    Mail,
    Phone,
    Clock
} from "lucide-react";

interface CustomTrip {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    nationality?: string;
    adults: number;
    children: number;
    infants: number;
    arrivalDate: string;
    duration?: string;
    budget?: string;
    interests?: string[];
    hotel?: string;
    otherIdeas?: string;
    createdAt: string;
}

export default function CustomTripsAdminPage() {
    const [trips, setTrips] = useState<CustomTrip[]>([]);
    const [loading, setLoading] = useState(true);

    // Note: We need to create this API endpoint or reuse existing if possible
    // For now, I'll assume we add a GET to /api/custom-trip or create /api/admin/custom-trips
    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await fetch("/api/admin/custom-trips");
            if (res.ok) {
                const data = await res.json();
                setTrips(data);
            }
        } catch (error) {
            console.error("Failed to fetch custom trips", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading custom inquiries...</div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Custom Trip Inquiries</h1>
                    <p className="text-slate-500">Manage bespoke travel requests</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600">
                    Total: {trips.length}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {trips.map(trip => (
                    <div key={trip._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {trip.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{trip.fullName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {trip.email}</span>
                                        {trip.phone && <span className="flex items-center gap-1"><Phone size={14} /> {trip.phone}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                Received<br />
                                <span className="font-bold text-slate-600">{format(new Date(trip.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">

                            {/* Party */}
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Party</p>
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Users size={16} className="text-blue-400" />
                                    {trip.adults} Adults, {trip.children} Kids
                                </div>
                            </div>

                            {/* Date & Budget */}
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Details</p>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Calendar size={16} className="text-blue-400" />
                                    {trip.arrivalDate || "Flexible"}
                                </div>
                                {trip.budget && (
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <DollarSign size={16} className="text-green-500" />
                                        ${trip.budget} / person
                                    </div>
                                )}
                            </div>

                            {/* Style */}
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferences</p>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Hotel size={16} className="text-orange-400" />
                                    {trip.hotel === '5stars' ? 'Luxury (5★)' : trip.hotel === '4stars' ? 'Comfort (4★)' : trip.hotel}
                                </div>
                                {trip.interests && trip.interests.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {trip.interests.map(i => (
                                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">{i}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div className="md:col-span-2 lg:col-span-1 bg-slate-50 p-3 rounded-lg border border-slate-100 italic text-slate-600 text-xs">
                                "{trip.otherIdeas || "No specific requirements mentioned."}"
                            </div>

                        </div>
                    </div>
                ))}

                {trips.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-400">No custom inquiries yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
