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
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', currency: 'GNF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲', currency: 'GMD', languages: ['en'], shippingZone: 'africa' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', currency: 'XOF', languages: ['pt'], shippingZone: 'africa' },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻', currency: 'CVE', languages: ['pt'], shippingZone: 'africa' },
  
  // Afrique centrale et orientale
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', currency: 'XAF', languages: ['fr', 'en'], shippingZone: 'africa' },
  { code: 'CD', name: 'RDC', flag: '🇨🇩', currency: 'CDF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', currency: 'XAF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'CF', name: 'RCA', flag: '🇨🇫', currency: 'XAF', languages: ['fr'], shippingZone: 'africa' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', currency: 'XAF', languages: ['fr', 'ar'], shippingZone: 'africa' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶', currency: 'XAF', languages: ['es', 'fr'], shippingZone: 'africa' },
  
  // Afrique du Nord
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', languages: ['ar', 'fr'], shippingZone: 'africa' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', currency: 'DZD', languages: ['ar', 'fr'], shippingZone: 'africa' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', currency: 'TND', languages: ['ar', 'fr'], shippingZone: 'africa' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', currency: 'LYD', languages: ['ar'], shippingZone: 'africa' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', currency: 'EGP', languages: ['ar'], shippingZone: 'africa' },
  
  // Afrique de l'Est
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', currency: 'ETB', languages: ['am'], shippingZone: 'africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', languages: ['sw', 'en'], shippingZone: 'africa' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', currency: 'TZS', languages: ['sw', 'en'], shippingZone: 'africa' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', currency: 'UGX', languages: ['en'], shippingZone: 'africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', languages: ['rw', 'fr', 'en'], shippingZone: 'africa' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF', languages: ['rn', 'fr'], shippingZone: 'africa' },
  
  // Afrique du Sud
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', currency: 'ZAR', languages: ['en', 'zu', 'af'], shippingZone: 'africa' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', currency: 'BWP', languages: ['en'], shippingZone: 'africa' },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦', currency: 'NAD', languages: ['en'], shippingZone: 'africa' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', languages: ['en'], shippingZone: 'africa' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', currency: 'ZMW', languages: ['en'], shippingZone: 'africa' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: 'MWK', languages: ['en'], shippingZone: 'africa' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', languages: ['pt'], shippingZone: 'africa' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', currency: 'MGA', languages: ['mg', 'fr'], shippingZone: 'africa' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', currency: 'MUR', languages: ['en', 'fr'], shippingZone: 'africa' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', currency: 'SCR', languages: ['en', 'fr'], shippingZone: 'africa' },
  
  // Amérique du Nord
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', languages: ['en', 'fr'], shippingZone: 'international' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', currency: 'USD', languages: ['en'], shippingZone: 'international' },
  
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', languages: ['fr'], shippingZone: 'international' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', currency: 'EUR', languages: ['fr', 'nl'], shippingZone: 'international' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', currency: 'CHF', languages: ['fr', 'de', 'it'], shippingZone: 'international' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', currency: 'EUR', languages: ['de'], shippingZone: 'international' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', currency: 'EUR', languages: ['it'], shippingZone: 'international' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', currency: 'EUR', languages: ['es'], shippingZone: 'international' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', languages: ['pt'], shippingZone: 'international' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', currency: 'EUR', languages: ['nl'], shippingZone: 'international' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', currency: 'GBP', languages: ['en'], shippingZone: 'international' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', currency: 'EUR', languages: ['en'], shippingZone: 'international' },
];

const translations: Translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.catalog': 'Catalogue',
    'nav.custom': 'Sur Mesure',
    'nav.vendors': 'Vendeurs',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.language': 'Langue',
    'nav.currency': 'Devise',
    'nav.country': 'Pays',
    'nav.search': 'Rechercher...',
    'nav.cart': 'Panier',
    'nav.profile': 'Profil',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.logout': 'Déconnexion',
    
    // Hero
    'hero.authentic_couture': 'Couture Authentique',
    'hero.elegance': 'Élégance',
    'hero.senegalese': 'sénégalaise',
    'hero.at_your_fingertips': 'à portée de main',
    'hero.subtitle': 'Découvrez une collection exceptionnelle de tenues traditionnelles et d\'accessoires artisanaux,',
    'hero.passionate_artisans': 'créés par des artisans passionnés',
    'hero.from_senegal': 'du Sénégal',
    'hero.cta_catalog': 'Explorer le Catalogue',
    'hero.cta_custom': 'Commande Sur Mesure',
    
    // Categories
    'categories.title': 'Explorez nos Collections',
    'categories.subtitle': 'Découvrez l\'art de la couture sénégalaise à travers nos différentes catégories,',
    'categories.cultural_richness': 'chacune reflétant la richesse culturelle',
    'categories.of_senegal': 'du Sénégal',
    'categories.women_wear': 'Tenues Femmes',
    'categories.women_description': 'Boubous, robes, ensembles élégants',
    'categories.men_wear': 'Tenues Hommes',
    'categories.men_description': 'Grands boubous, costumes traditionnels',
    'categories.accessories': 'Accessoires',
    'categories.accessories_description': 'Bijoux, sacs, chaussures artisanales',
    'categories.watches_jewelry': 'Montres & Bijoux',
    'categories.watches_description': 'Montres, bracelets, colliers uniques',
    'categories.premium_collection': 'Collection Premium',
    'categories.premium_description': 'Pièces exclusives et limitées',
    'categories.custom_made': 'Sur Mesure',
    'categories.custom_description': 'Créations personnalisées à vos mesures',
    'categories.view_collection': 'Voir la collection',
    'categories.discover_all': 'Découvrir Toutes les Collections',
    
    // Dashboard Vendor
    'dashboard.monthly_sales': 'Ventes ce mois',
    'dashboard.active_products': 'Produits actifs',
    'dashboard.orders': 'Commandes',
    'dashboard.average_rating': 'Note moyenne',
    'dashboard.vendor_space': 'Espace Vendeur',
    'dashboard.my_workshop': 'Mon Atelier',
    'dashboard.quick_actions': 'Actions Rapides',
    'dashboard.recent_orders': 'Commandes Récentes',
    'dashboard.product_management': 'Gestion des Produits',
    'dashboard.analytics': 'Analytiques',
    'dashboard.settings': 'Paramètres',
    
    // Footer
    'footer.about': 'À Propos',
    'footer.about_text': 'Afrizar est votre destination pour découvrir l\'artisanat sénégalais authentique.',
    'footer.quick_links': 'Liens Rapides',
    'footer.customer_service': 'Service Client',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Recevez nos dernières nouveautés et offres spéciales',
    'footer.subscribe': 'S\'abonner',
    'footer.follow_us': 'Suivez-nous',
    'footer.payment_methods': 'Moyens de Paiement',
    'footer.shipping_countries': 'Pays de Livraison',
    'footer.copyright': '© 2024 Afrizar. Tous droits réservés.',
    'footer.made_with_love': 'Fait avec ❤️ au Sénégal',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.custom': 'Custom',
    'nav.vendors': 'Vendors',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.language': 'Language',
    'nav.currency': 'Currency',
    'nav.country': 'Country',
    'nav.search': 'Search...',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.authentic_couture': 'Authentic Couture',
    'hero.elegance': 'Senegalese',
    'hero.senegalese': 'elegance',
    'hero.at_your_fingertips': 'at your fingertips',
    'hero.subtitle': 'Discover an exceptional collection of traditional outfits and handcrafted accessories,',
    'hero.passionate_artisans': 'created by passionate artisans',
    'hero.from_senegal': 'from Senegal',
    'hero.cta_catalog': 'Explore Catalog',
    'hero.cta_custom': 'Custom Order',
    
    // Categories
    'categories.title': 'Explore Our Collections',
    'categories.subtitle': 'Discover the art of Senegalese tailoring through our different categories,',
    'categories.cultural_richness': 'each reflecting the cultural richness',
    'categories.of_senegal': 'of Senegal',
    'categories.women_wear': 'Women\'s Wear',
    'categories.women_description': 'Boubous, dresses, elegant ensembles',
    'categories.men_wear': 'Men\'s Wear',
    'categories.men_description': 'Grand boubous, traditional suits',
    'categories.accessories': 'Accessories',
    'categories.accessories_description': 'Jewelry, bags, handcrafted shoes',
    'categories.watches_jewelry': 'Watches & Jewelry',
    'categories.watches_description': 'Watches, bracelets, unique necklaces',
    'categories.premium_collection': 'Premium Collection',
    'categories.premium_description': 'Exclusive and limited pieces',
    'categories.custom_made': 'Custom Made',
    'categories.custom_description': 'Personalized creations to your measurements',
    'categories.view_collection': 'View collection',
    'categories.discover_all': 'Discover All Collections',
    
    // Dashboard Vendor
    'dashboard.monthly_sales': 'Monthly Sales',
    'dashboard.active_products': 'Active Products',
    'dashboard.orders': 'Orders',
    'dashboard.average_rating': 'Average Rating',
    'dashboard.vendor_space': 'Vendor Space',
    'dashboard.my_workshop': 'My Workshop',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.recent_orders': 'Recent Orders',
    'dashboard.product_management': 'Product Management',
    'dashboard.analytics': 'Analytics',
    'dashboard.settings': 'Settings',
    
    // Footer
    'footer.about': 'About',
    'footer.about_text': 'Afrizar is your destination to discover authentic Senegalese craftsmanship.',
    'footer.quick_links': 'Quick Links',
    'footer.customer_service': 'Customer Service',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Receive our latest news and special offers',
    'footer.subscribe': 'Subscribe',
    'footer.follow_us': 'Follow Us',
    'footer.payment_methods': 'Payment Methods',
    'footer.shipping_countries': 'Shipping Countries',
    'footer.copyright': '© 2024 Afrizar. All rights reserved.',
    'footer.made_with_love': 'Made with ❤️ in Senegal',
  }
};

const InternationalizationContext = createContext<I18nContextType | undefined>(undefined);

export const InternationalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  const [country, setCountry] = useState('SN');
  const [currency, setCurrency] = useState('XOF');

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedLanguage = localStorage.getItem('afrizar_language') || 'fr';
    const savedCountry = localStorage.getItem('afrizar_country') || 'SN';
    const savedCurrency = localStorage.getItem('afrizar_currency') || 'XOF';

    setLanguage(savedLanguage);
    setCountry(savedCountry);
    setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    // Sauvegarder les préférences
    localStorage.setItem('afrizar_language', language);
    localStorage.setItem('afrizar_country', country);
    localStorage.setItem('afrizar_currency', currency);
  }, [language, country, currency]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const formatPrice = (price: number, currencyCode?: string): string => {
    const code = currencyCode || currency;
    const currencyData = currencies.find(c => c.code === code);
    
    if (!currencyData) {
      return `${price.toLocaleString()} ${code}`;
    }

    const convertedPrice = price * currencyData.rate;
    
    if (code === 'XOF') {
      return `${convertedPrice.toLocaleString()} ${currencyData.symbol}`;
    }
    
    return `${currencyData.symbol}${convertedPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
    const toCurrencyData = currencies.find(c => c.code === toCurrency);
    
    if (!fromCurrencyData || !toCurrencyData) {
      return price;
    }

    // Convertir vers FCFA puis vers la devise cible
    const priceInFCFA = price / fromCurrencyData.rate;
    return priceInFCFA * toCurrencyData.rate;
  };

  const getShippingZone = (): string => {
    const countryData = countries.find(c => c.code === country);
    return countryData?.shippingZone || 'international';
  };

  const getSupportedCountries = (): Country[] => {
    return countries;
  };

  const getSupportedCurrencies = (): Currency[] => {
    return currencies;
  };

  const value: I18nContextType = {
    language,
    country,
    currency,
    setLanguage,
    setCountry,
    t,
    formatPrice,
    convertPrice,
    getShippingZone,
    getSupportedCountries,
    getSupportedCurrencies,
  };

  return (
    <InternationalizationContext.Provider value={value}>
      {children}
    </InternationalizationContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(InternationalizationContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an InternationalizationProvider');
  }
  return context;
};