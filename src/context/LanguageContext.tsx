import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations, Translations } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('career_plate_lang') as LanguageCode;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('career_plate_lang', language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
