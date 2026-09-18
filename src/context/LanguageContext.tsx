import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations';
import type { SupportedLanguage, TranslationDictionary } from '../translations';

export type { SupportedLanguage };

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

export const FUTURE_TRIBAL_LANGUAGES = [
  'Santali (Ol Chiki)',
  'Gondi',
  'Bhili',
  'Ho (Warang Chiti)',
  'Mundari',
  'Khasi',
  'Garo',
  'Mizo'
];

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
  isTribalLanguageNoticeOpen: boolean;
  setIsTribalLanguageNoticeOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('scholarsetu_lang') as SupportedLanguage;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const [isTribalLanguageNoticeOpen, setIsTribalLanguageNoticeOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('scholarsetu_lang', language);
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    // Normalization / legacy alias support:
    let lookupKey = key;
    if (key === 'app.name') lookupKey = 'common.appName';
    if (key === 'app.subheading') lookupKey = 'common.motaTitle';
    if (key === 'brand.mota') lookupKey = 'common.motaTitle';
    if (key === 'hero.headline') lookupKey = 'hero.title';
    if (key === 'hero.subcopy') lookupKey = 'hero.subtitle';
    if (key === 'hero.cta.explore') lookupKey = 'hero.exploreBtn';
    if (key === 'hero.cta.create') lookupKey = 'hero.createBtn';
    if (key === 'problem.heading') lookupKey = 'problem.title';

    const currentDict = translations[language];
    if (currentDict && currentDict[lookupKey]) {
      return currentDict[lookupKey];
    }
    const enDict = translations['en'];
    if (enDict && enDict[lookupKey]) {
      return enDict[lookupKey];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isTribalLanguageNoticeOpen,
        setIsTribalLanguageNoticeOpen
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
