import React, { createContext, useContext, useState, useEffect } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number; // Taux de change par rapport au FCFA
}

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  languages: string[];
  shippingZone: 'senegal' | 'africa' | 'international';
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface I18nContextType {
  language: string;
  country: string;
  currency: string;
  setLanguage: (lang: string) => void;
  setCountry: (country: string) => void;
  t: (key: string) => string;
  formatPrice: (price: number, currencyCode?: string) => string;
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => number;
  getShippingZone: () => string;
  getSupportedCountries: () => Country[];
  getSupportedCurrencies: () => Currency[];
}

const currencies: Currency[] = [
  { code: 'XOF', symbol: 'FCFA', rate: 1 }, // Base currency
  { code: 'USD', symbol: '$', rate: 0.0016 }, // 1 FCFA = 0.0016 USD
  { code: 'CAD', symbol: 'C$', rate: 0.0022 }, // 1 FCFA = 0.0022 CAD
  { code: 'EUR', symbol: '€', rate: 0.0015 }, // 1 FCFA = 0.0015 EUR
];

const countries: Country[] = [
  // Sénégal et Afrique de l'Ouest
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', languages: ['fr', 'wo'], shippingZone: 'senegal' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', currency: 'XOF', languages: ['fr', 'en'], shippingZone: 'africa' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'CF', name: 'République Centrafricaine', flag: '🇨🇫', currency: 'XOF', languages: ['fr'], shippingZone: 'africa' },
  
  // Amérique du Nord
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', currency: 'USD', languages: ['en'], shippingZone: 'international' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', languages: ['en', 'fr'], shippingZone: 'international' },
  
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', languages: ['fr'], shippingZone: 'international' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', currency: 'EUR', languages: ['fr', 'en'], shippingZone: 'international' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', currency: 'EUR', languages: ['fr', 'en'], shippingZone: 'international' },
  
  // Autres pays d'Afrique
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'EUR', languages: ['fr'], shippingZone: 'africa' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', currency: 'EUR', languages: ['fr'], shippingZone: 'africa' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', currency: 'EUR', languages: ['fr'], shippingZone: 'africa' },
];

const translations: Translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.catalog': 'Catalogue',
    'nav.women': 'Tenues Femmes',
    'nav.men': 'Tenues Hommes',
    'nav.accessories': 'Accessoires',
    'nav.custom': 'Sur Mesure',
    'nav.tracking': 'Suivi Commande',
    'nav.become_vendor': 'Devenir Vendeur',
    
    // Hero Section
    'hero.title': 'L\'élégance sénégalaise à portée de main',
    'hero.subtitle': 'Découvrez une collection exceptionnelle de tenues traditionnelles et d\'accessoires artisanaux, créés par des artisans passionnés du Sénégal.',
    'hero.cta_catalog': 'Explorer le Catalogue',
    'hero.cta_custom': 'Commande Sur Mesure',
    
    // Common
    'common.price': 'Prix',
    'common.add_to_cart': 'Ajouter au Panier',
    'common.buy_now': 'Acheter Maintenant',
    'common.view_details': 'Voir Détails',
    'common.in_stock': 'En stock',
    'common.out_of_stock': 'Rupture de stock',
    'common.limited_stock': 'Stock limité',
    'common.on_order': 'Sur commande',
    'common.delivery': 'Livraison',
    'common.vendor': 'Vendeur',
    'common.rating': 'Note',
    'common.reviews': 'avis',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    
    // Cart & Checkout
    'cart.title': 'Mon Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.subtotal': 'Sous-total',
    'cart.commission': 'Commission plateforme',
    'cart.shipping': 'Livraison',
    'cart.total': 'Total',
    'cart.proceed_payment': 'Procéder au paiement',
    'cart.continue_shopping': 'Continuer les achats',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.vendor_register': 'Devenir Vendeur',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirm_password': 'Confirmer le mot de passe',
    'auth.first_name': 'Prénom',
    'auth.last_name': 'Nom',
    'auth.phone': 'Téléphone',
    'auth.address': 'Adresse',
    'auth.business_name': 'Nom de l\'atelier',
    'auth.business_description': 'Description de l\'activité',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.overview': 'Vue d\'ensemble',
    'dashboard.products': 'Mes Produits',
    'dashboard.orders': 'Commandes',
    'dashboard.analytics': 'Statistiques',
    'dashboard.profile': 'Mon Profil',
    'dashboard.logout': 'Déconnexion',
    
    // Footer
    'footer.about': 'À propos',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.made_with_love': 'Fait avec ❤️ au Sénégal',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.women': 'Women\'s Wear',
    'nav.men': 'Men\'s Wear',
    'nav.accessories': 'Accessories',
    'nav.custom': 'Custom Made',
    'nav.tracking': 'Order Tracking',
    'nav.become_vendor': 'Become a Vendor',
    
    // Hero Section
    'hero.title': 'Senegalese elegance at your fingertips',
    'hero.subtitle': 'Discover an exceptional collection of traditional outfits and handcrafted accessories, created by passionate artisans from Senegal.',
    'hero.cta_catalog': 'Explore Catalog',
    'hero.cta_custom': 'Custom Order',
    
    // Common
    'common.price': 'Price',
    'common.add_to_cart': 'Add to Cart',
    'common.buy_now': 'Buy Now',
    'common.view_details': 'View Details',
    'common.in_stock': 'In Stock',
    'common.out_of_stock': 'Out of Stock',
    'common.limited_stock': 'Limited Stock',
    'common.on_order': 'On Order',
    'common.delivery': 'Delivery',
    'common.vendor': 'Vendor',
    'common.rating': 'Rating',
    'common.reviews': 'reviews',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Cart & Checkout
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.commission': 'Platform Commission',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.proceed_payment': 'Proceed to Payment',
    'cart.continue_shopping': 'Continue Shopping',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Sign Up',
    'auth.vendor_register': 'Become a Vendor',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.first_name': 'First Name',
    'auth.last_name': 'Last Name',
    'auth.phone': 'Phone',
    'auth.address': 'Address',
    'auth.business_name': 'Workshop Name',
    'auth.business_description': 'Business Description',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.products': 'My Products',
    'dashboard.orders': 'Orders',
    'dashboard.analytics': 'Analytics',
    'dashboard.profile': 'My Profile',
    'dashboard.logout': 'Logout',
    
    // Footer
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.made_with_love': 'Made with ❤️ in Senegal',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  const [country, setCountry] = useState('SN');

  // Détecter la langue du navigateur au premier chargement
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('afrizar_language');
    const savedCountry = localStorage.getItem('afrizar_country');
    
    if (savedLang) {
      setLanguage(savedLang);
    } else if (['fr', 'en'].includes(browserLang)) {
      setLanguage(browserLang);
    }
    
    if (savedCountry) {
      setCountry(savedCountry);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('afrizar_language', lang);
  };

  const handleSetCountry = (countryCode: string) => {
    setCountry(countryCode);
    localStorage.setItem('afrizar_country', countryCode);
    
    // Auto-switch language based on country
    const selectedCountry = countries.find(c => c.code === countryCode);
    if (selectedCountry) {
      if (selectedCountry.languages.includes('en') && !selectedCountry.languages.includes('fr')) {
        handleSetLanguage('en');
      } else if (selectedCountry.languages.includes('fr')) {
        handleSetLanguage('fr');
      }
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['fr'][key] || key;
  };

  const getCurrentCurrency = (): string => {
    const selectedCountry = countries.find(c => c.code === country);
    return selectedCountry?.currency || 'XOF';
  };

  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    
    // Convert to FCFA first, then to target currency
    const fcfaPrice = price / fromRate;
    return fcfaPrice * toRate;
  };

  const formatPrice = (price: number, currencyCode?: string): string => {
    const targetCurrency = currencyCode || getCurrentCurrency();
    const convertedPrice = convertPrice(price, 'XOF', targetCurrency);
    const currency = currencies.find(c => c.code === targetCurrency);
    
    if (!currency) return `${price} FCFA`;
    
    // Format selon la devise
    switch (targetCurrency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(convertedPrice);
      case 'CAD':
        return new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }).format(convertedPrice);
      case 'EUR':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(convertedPrice);
      default:
        return new Intl.NumberFormat('fr-FR').format(convertedPrice) + ' FCFA';
    }
  };

  const getShippingZone = (): string => {
    const selectedCountry = countries.find(c => c.code === country);
    return selectedCountry?.shippingZone || 'international';
  };

  const getSupportedCountries = (): Country[] => {
    return countries;
  };

  const getSupportedCurrencies = (): Currency[] => {
    return currencies;
  };

  return (
    <I18nContext.Provider value={{
      language,
      country,
      currency: getCurrentCurrency(),
      setLanguage: handleSetLanguage,
      setCountry: handleSetCountry,
      t,
      formatPrice,
      convertPrice,
      getShippingZone,
      getSupportedCountries,
      getSupportedCurrencies
    }}>
      {children}
    </I18nContext.Provider>
  );
};