"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

type Language = Locale;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(translations: { mn: T; en: T, ko: T }) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, initialLang }: { children: ReactNode, initialLang: Language }) => {
  const [language, setLanguageState] = useState<Language>(initialLang);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setLanguageState(initialLang);
  }, [initialLang]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;

    // Construct new path
    const segments = pathname.split('/');
    // segments[1] is the locale
    segments[1] = lang;
    const newPath = segments.join('/');

    setLanguageState(lang);
    router.push(newPath);
  };

  const t = <T,>(translations: { mn: T; en: T, ko: T }): T => {
    return translations[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};