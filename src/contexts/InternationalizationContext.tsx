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
    
    // Hero
    'hero.authentic_couture': 'Couture Authentique',
    'hero.elegance': 'L\'élégance',
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
    'dashboard.add_product': 'Ajouter un produit',
    'dashboard.create_promotion': 'Créer une promo',
    'dashboard.view_stats': 'Voir les stats',
    'dashboard.recent_orders': 'Commandes récentes',
    'dashboard.my_products': 'Mes Produits',
    'dashboard.search': 'Rechercher',
    'dashboard.new_product': 'Nouveau Produit',
    'dashboard.view': 'Voir',
    'dashboard.edit': 'Modifier',
    'dashboard.restock': 'Réapprovisionner',
    'dashboard.order_management': 'Gestion des Commandes',
    'dashboard.all_statuses': 'Tous les statuts',
    'dashboard.confirmed': 'Confirmées',
    'dashboard.processing': 'En cours',
    'dashboard.shipped': 'Expédiées',
    'dashboard.delivered': 'Livrées',
    'dashboard.refresh': 'Actualiser',
    'dashboard.contact': 'Contacter',
    'dashboard.manage': 'Gérer',
    'dashboard.customer_reviews': 'Avis Clients',
    'dashboard.respond': 'Répondre',
    'dashboard.performance_stats': 'Statistiques de Performance',
    'dashboard.sales_by_month': 'Ventes par mois',
    'dashboard.best_selling': 'Produits les plus vendus',
    'dashboard.vendor_profile': 'Mon Profil Vendeur',
    'dashboard.workshop_info': 'Informations de l\'atelier',
    'dashboard.workshop_name': 'Nom de l\'atelier',
    'dashboard.description': 'Description',
    'dashboard.phone': 'Téléphone',
    'dashboard.address': 'Adresse',
    'dashboard.save_changes': 'Sauvegarder les modifications',
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
    'dashboard.add_product': 'Add Product',
    'dashboard.create_promotion': 'Create Promotion',
    'dashboard.view_stats': 'View Stats',
    'dashboard.recent_orders': 'Recent Orders',
    'dashboard.my_products': 'My Products',
    'dashboard.search': 'Search',
    'dashboard.new_product': 'New Product',
    'dashboard.view': 'View',
    'dashboard.edit': 'Edit',
    'dashboard.restock': 'Restock',
    'dashboard.order_management': 'Order Management',
    'dashboard.all_statuses': 'All Statuses',
    'dashboard.confirmed': 'Confirmed',
    'dashboard.processing': 'Processing',
    'dashboard.shipped': 'Shipped',
    'dashboard.delivered': 'Delivered',
    'dashboard.refresh': 'Refresh',
    'dashboard.contact': 'Contact',
    'dashboard.manage': 'Manage',
    'dashboard.customer_reviews': 'Customer Reviews',
    'dashboard.respond': 'Respond',
    'dashboard.performance_stats': 'Performance Statistics',
    'dashboard.sales_by_month': 'Sales by Month',
    'dashboard.best_selling': 'Best Selling Products',
    'dashboard.vendor_profile': 'My Vendor Profile',
    'dashboard.workshop_info': 'Workshop Information',
    'dashboard.workshop_name': 'Workshop Name',
    'dashboard.description': 'Description',
    'dashboard.phone': 'Phone',
    'dashboard.address': 'Address',
    'dashboard.save_changes': 'Save Changes',
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