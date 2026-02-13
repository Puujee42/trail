"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

type Language = Locale;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(translations: { mn: T; en: T; ko: T; de?: T }) => T;
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
    if (segments.length > 1 && ['mn', 'en', 'ko', 'de'].includes(segments[1])) {
        segments[1] = lang;
    } else {
        // If path doesn't start with locale (e.g. root), prepend it or handle appropriately
        // Assuming middleware handles root, but if we are here, we likely have a locale
        segments[1] = lang; 
    }
    const newPath = segments.join('/');

    setLanguageState(lang);
    // Use shallow routing or just push. Since we use client-side dictionary for "instant" updates,
    // we want the URL to update but maybe not full reload if possible. 
    // However, Next.js App Router doesn't support shallow routing for path params easily without re-running server component.
    // But since we are updating the state `language`, the components using `useLanguage` will re-render IMMEDIATELY with new text
    // BEFORE the router.push completes and fetches new server data. This achieves the "instant" effect!
    router.push(newPath);
  };

  const t = <T,>(translations: { mn: T; en: T; ko: T; de?: T }): T => {
    // Fallback to English if German is missing
    if (language === 'de' && translations.de === undefined) {
        return translations.en;
    }
    return translations[language] || translations.en;
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