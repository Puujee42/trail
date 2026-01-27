"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Percent, TrendingUp, ShieldCheck, Wallet, Landmark } from "lucide-react";

interface TourPriceCalculatorProps {
    onPriceCalculated?: (price: number) => void;
    onAllocate?: (data: { operations: number; tax: number; profit: number; totalPrice: number }) => void;
}

const TourPriceCalculator: React.FC<TourPriceCalculatorProps> = ({ onPriceCalculated, onAllocate }) => {
    const [costs, setCosts] = useState({
        hotel: 0,
        transport: 0,
        guide: 0,
        other: 0,
    });
    const [margin, setMargin] = useState(20); // Default 20%
    const [taxRate, setTaxRate] = useState(10); // Default 10%
    const [loading, setLoading] = useState(false);

    const baseCosts = useMemo(() => {
        return costs.hotel + costs.transport + costs.guide + costs.other;
    }, [costs]);

    // Formula: Selling Price = Base Costs / (1 - Margin%)
    const recommendedPrice = useMemo(() => {
        if (margin >= 100) return 0;
        const priceWithMargin = baseCosts / (1 - margin / 100);
        return Math.round(priceWithMargin);
    }, [baseCosts, margin]);

    const allocation = useMemo(() => {
        const tax = Math.round(recommendedPrice * (taxRate / 100));
        const operations = baseCosts;
        const profit = recommendedPrice - operations - tax;
        return { operations, tax, profit };
    }, [recommendedPrice, baseCosts, taxRate]);

    const handleInputChange = (field: keyof typeof costs, value: string) => {
        setCosts(prev => ({ ...prev, [field]: Number(value) || 0 }));
    };

    const handleAllocate = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/vaults", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...allocation,
                    totalPrice: recommendedPrice
                }),
            });

            if (response.ok) {
                alert("Allocation successful!");
                onAllocate?.({ ...allocation, totalPrice: recommendedPrice });
            } else {
                alert("Allocation failed.");
            }
        } catch (error) {
            console.error("Allocation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-50 p-4 border-b flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Tour Price Calculator & Vault Allocation</h3>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Hotel Cost</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={costs.hotel || ''}
                                    onChange={(e) => handleInputChange('hotel', e.target.value)}
                                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Transport Cost</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={costs.transport || ''}
                                    onChange={(e) => handleInputChange('transport', e.target.value)}
                                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Guide Fee</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={costs.guide || ''}
                                    onChange={(e) => handleInputChange('guide', e.target.value)}
                                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Other Ops</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={costs.other || ''}
                                    onChange={(e) => handleInputChange('other', e.target.value)}
                                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-800 uppercase block mb-1">Profit Margin %</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <input
                                    type="number"
                                    value={margin}
                                    onChange={(e) => setMargin(Number(e.target.value) || 0)}
                                    className="w-full pl-9 p-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-900"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-800 uppercase block mb-1">Tax Rate %</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <input
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                                    className="w-full pl-9 p-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Recommended Selling Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">${recommendedPrice.toLocaleString()}</span>
                                <span className="text-slate-400 text-sm">/ person</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <Wallet className="w-3 h-3 text-orange-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Operations</span>
                                </div>
                                <p className="text-lg font-bold text-slate-800">${allocation.operations.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <Landmark className="w-3 h-3 text-red-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tax Allocation</span>
                                </div>
                                <p className="text-lg font-bold text-slate-800">${allocation.tax.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Net Profit</span>
                                </div>
                                <p className="text-lg font-bold text-slate-800">${allocation.profit.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading || recommendedPrice === 0}
                        onClick={handleAllocate}
                        className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : (
                            <>
                                <ShieldCheck className="w-5 h-5" />
                                Finalize & Allocate to Vaults
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourPriceCalculator;
