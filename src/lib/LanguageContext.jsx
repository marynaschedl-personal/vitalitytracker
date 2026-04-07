import { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/lib/translations/en';
import { ru } from '@/lib/translations/ru';

const LanguageContext = createContext();

const translations = { en, ru };

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'en' || savedLang === 'ru')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'ru') {
      setLangState(newLang);
      localStorage.setItem('language', newLang);
    }
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
