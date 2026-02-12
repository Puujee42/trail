"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/app/context/LanguageContext";

interface ElevationProfileProps {
  data?: { distance: number; elevation: number }[];
}

const ElevationProfile = ({ data }: ElevationProfileProps) => {
  const { language } = useLanguage();
  
  // Default mock data if none provided
  const chartData = data || [
    { distance: 0, elevation: 1500 },
    { distance: 2, elevation: 1600 },
    { distance: 5, elevation: 1850 },
    { distance: 8, elevation: 1700 },
    { distance: 10, elevation: 2100 },
    { distance: 12, elevation: 2000 },
    { distance: 15, elevation: 1900 },
  ];

  const t = {
    mn: { title: "Өндрийн профиль", axisY: "Өндөр (м)", axisX: "Зай (км)" },
    en: { title: "Elevation Profile", axisY: "Elevation (m)", axisX: "Distance (km)" },
    ko: { title: "고도 프로필", axisY: "고도 (m)", axisX: "거리 (km)" },
  };

  const text = t[language] || t.en;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        ⛰️ {text.title}
      </h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="distance" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              label={{ value: text.axisX, position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94a3b8' }} 
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              domain={['auto', 'auto']}
              label={{ value: text.axisY, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="elevation" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorElevation)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElevationProfile;
