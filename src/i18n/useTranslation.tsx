// contexts/InternationalizationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const InternationalizationContext = createContext<TranslationContextType | undefined>(undefined);

// Dictionnaire de traductions basique
const translations = {
  fr: {
    'header.home': 'Accueil',
    'header.catalog': 'Catalogue',
    'header.categories': 'Catégories',
    'header.cart': 'Panier',
    'header.profile': 'Profil',
    // Ajoutez vos clés de traduction ici
  },
  en: {
    'header.home': 'Home',
    'header.catalog': 'Catalog',
    'header.categories': 'Categories',
    'header.cart': 'Cart',
    'header.profile': 'Profile',
    // Ajoutez vos clés de traduction ici
  }
};

export const InternationalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <InternationalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </InternationalizationContext.Provider>
  );
};

// Hook useTranslation correctement implémenté
export const useTranslation = () => {
  const context = useContext(InternationalizationContext);
  if (!context) {
    throw new Error('useTranslation doit être utilisé dans un InternationalizationProvider');
  }
  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage
  };
};