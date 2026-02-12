"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { FaMapMarkedAlt, FaDownload } from "react-icons/fa";

const InlineGPXCTA = () => {
  const { language } = useLanguage();

  const t = {
    mn: {
      title: "Энэ замыг утсан дээрээ татаж авах уу?",
      subtitle: "Интернетгүй үед ч ажиллана. 100% Үнэгүй.",
      btn: "GPX Татах"
    },
    en: {
      title: "Want this route on your phone?",
      subtitle: "Works offline. 100% Free.",
      btn: "Download GPX"
    },
    ko: {
      title: "이 경로를 휴대폰에 다운로드하시겠습니까?",
      subtitle: "오프라인에서도 작동합니다. 100% 무료.",
      btn: "GPX 다운로드"
    }
  };

  const text = t[language] || t.en;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 my-8 group hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 text-xl group-hover:scale-110 transition-transform">
          <FaMapMarkedAlt />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{text.title}</h4>
          <p className="text-xs text-slate-500 font-medium">{text.subtitle}</p>
        </div>
      </div>
      <button className="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center gap-2 hover:border-sky-500 hover:text-sky-500 transition-colors">
        <FaDownload /> {text.btn}
      </button>
    </div>
  );
};

export default InlineGPXCTA;
