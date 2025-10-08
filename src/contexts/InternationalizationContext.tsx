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
  switchLanguage: () => void;
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
    'home': 'Accueil',
    'clothes': 'Vêtements',
    'accessories': 'Accessoires',
    'vendors': 'Vendeurs',
    'contact': 'Contact',
    'trends': 'Tendances',
    'search': 'Rechercher...',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'categories': 'Catégories',
    
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
    'footer.about_text': 'Votre destination privilégiée pour découvrir et acheter des créations authentiques Made in Senegal. Nous valorisons le savoir-faire artisanal sénégalais.',
    'footer.quick_links': 'Liens Rapides',
    'footer.about_link': 'À propos',
    'footer.artisans': 'Nos Artisans',
    'footer.how_it_works': 'Comment ça marche',
    'footer.blog': 'Blog',
    'footer.faq': 'FAQ',
    'footer.customer_service': 'Service Client',
    'footer.contact': 'Contact',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Recevez nos dernières nouveautés et offres spéciales',
    'footer.subscribe': 'S\'abonner',
    'footer.follow_us': 'Suivez-nous',
    'footer.payment_methods': 'Moyens de Paiement',
    'footer.shipping_countries': 'Pays de Livraison',
    'footer.copyright': '© 2024 Afrizar. Tous droits réservés.',
    'footer.made_with_love': 'Fait avec ❤️ au Sénégal',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.legal': 'Mentions légales',
    
    // Contact Page
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes là pour vous accompagner dans votre expérience Afizar. N\'hésitez pas à nous contacter pour toute question ou demande.',
    'contact.our_info': 'Nos coordonnées',
    'contact.address': 'Adresse',
    'contact.address_value': '123 Avenue Léopold Sédar Senghor\nDakar, Sénégal',
    'contact.phone': 'Téléphone',
    'contact.phone_value': '+221 33 123 45 67\n+221 77 123 45 67',
    'contact.email': 'Email',
    'contact.email_value': 'contact@afizar.com\nsupport@afizar.com',
    'contact.hours': 'Horaires',
    'contact.hours_value': 'Lundi - Vendredi : 9h - 18h\nSamedi : 10h - 16h\nDimanche : Fermé',
    'contact.whatsapp_title': 'Contact rapide',
    'contact.whatsapp_desc': 'Besoin d\'une réponse immédiate ? Contactez-nous sur WhatsApp !',
    'contact.whatsapp_button': 'Contacter sur WhatsApp',
    'contact.form_title': 'Envoyez-nous un message',
    'contact.name': 'Nom complet',
    'contact.email_placeholder': 'Votre email',
    'contact.phone_placeholder': 'Votre téléphone',
    'contact.subject': 'Sujet',
    'contact.message': 'Votre message',
    'contact.send': 'Envoyer le message',
    'contact.success': 'Message envoyé avec succès !',
    'contact.faq_title': 'Questions fréquentes',
    'contact.faq_shipping': 'Quels sont les délais de livraison ?',
    'contact.faq_shipping_answer': 'Les délais varient selon votre destination : 2-5 jours au Sénégal, 7-15 jours en Afrique, 15-30 jours à l\'international.',
    'contact.faq_payment': 'Quels modes de paiement acceptez-vous ?',
    'contact.faq_payment_answer': 'Nous acceptons les cartes bancaires, les paiements mobiles (Orange Money, Wave) et les virements bancaires.',
    'contact.faq_custom': 'Puis-je commander des tenues sur mesure ?',
    'contact.faq_custom_answer': 'Oui ! Nos artisans peuvent créer des pièces sur mesure selon vos préférences. Contactez-nous pour discuter de votre projet.',
    'contact.faq_return': 'Quelle est votre politique de retour ?',
    'contact.faq_return_answer': 'Vous pouvez retourner un article dans les 14 jours suivant la réception, à condition qu\'il soit dans son état d\'origine.',
    
    // Page Vêtements
    'clothes.page_title': 'Vêtements',
    'clothes.discover': 'Découvrez notre collection de vêtements traditionnels sénégalais',
    'clothes.search_placeholder': 'Rechercher un vêtement...',
    'clothes.all_categories': 'Toutes Catégories',
    'clothes.all_types': 'Tous les types',
    'clothes.men': 'Homme',
    'clothes.women': 'Femme',
    'clothes.all_sizes': 'Toutes les tailles',
    'clothes.all_prices': 'Tous les prix',
    'clothes.under_30k': 'Moins de 30,000 FCFA',
    'clothes.30k_60k': '30,000 - 60,000 FCFA',
    'clothes.60k_100k': '60,000 - 100,000 FCFA',
    'clothes.over_100k': 'Plus de 100,000 FCFA',
    'clothes.sort_by': 'Trier par',
    'clothes.popular': 'Populaires',
    'clothes.new': 'Nouveautés',
    'clothes.price_low': 'Prix croissant',
    'clothes.price_high': 'Prix décroissant',
    'clothes.rating': 'Meilleures notes',
    'clothes.add_to_cart': 'Ajouter au panier',
    'clothes.view_details': 'Voir les détails',
    'clothes.add_to_wishlist': 'Ajouter aux favoris',
    'clothes.order_whatsapp': 'Commander sur WhatsApp',
    'clothes.new_badge': 'Nouveau',
    'clothes.trending': 'Tendances',
    'clothes.reviews': 'avis',
    'clothes.back': 'Retour',
    'clothes.found': 'vêtement(s) trouvé(s)',
    'clothes.boubous': 'Boubous',
    'clothes.costumes': 'Costumes',
    'clothes.pants': 'Pantalons',
    'clothes.shirts': 'Chemises',
    'clothes.dresses': 'Robes',
    'clothes.skirts': 'Jupes',
    'clothes.tops': 'Hauts',
    'clothes.ensembles': 'Ensembles',
    
    // Page Accessoires
    'accessories.page_title': 'Accessoires',
    'accessories.discover': 'Découvrez notre collection d\'accessoires artisanaux',
    'accessories.search_placeholder': 'Rechercher un accessoire...',
    'accessories.all_categories': 'Toutes Catégories',
    'accessories.all_types': 'Tous les types',
    'accessories.shoes': 'Chaussures',
    'accessories.hats': 'Chapeaux',
    'accessories.belts': 'Ceintures',
    'accessories.bags': 'Sacs',
    'accessories.jewelry': 'Bijoux',
    'accessories.found': 'accessoire(s) trouvé(s)',
  },
  
  en: {
    // Navigation
    'home': 'Home',
    'clothes': 'Clothing',
    'accessories': 'Accessories',
    'vendors': 'Vendors',
    'contact': 'Contact',
    'trends': 'Trends',
    'search': 'Search...',
    'login': 'Login',
    'logout': 'Logout',
    'categories': 'Categories',
    
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
    'footer.about_text': 'Your preferred destination to discover and buy authentic Made in Senegal creations. We value Senegalese craftsmanship.',
    'footer.quick_links': 'Quick Links',
    'footer.about_link': 'About',
    'footer.artisans': 'Our Artisans',
    'footer.how_it_works': 'How it works',
    'footer.blog': 'Blog',
    'footer.faq': 'FAQ',
    'footer.customer_service': 'Customer Service',
    'footer.contact': 'Contact',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_text': 'Receive our latest news and special offers',
    'footer.subscribe': 'Subscribe',
    'footer.follow_us': 'Follow Us',
    'footer.payment_methods': 'Payment Methods',
    'footer.shipping_countries': 'Shipping Countries',
    'footer.copyright': '© 2024 Afrizar. All rights reserved.',
    'footer.made_with_love': 'Made with ❤️ in Senegal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.legal': 'Legal Notice',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to support you in your Afizar experience. Feel free to contact us for any questions or requests.',
    'contact.our_info': 'Our Contact Information',
    'contact.address': 'Address',
    'contact.address_value': '123 Léopold Sédar Senghor Avenue\nDakar, Senegal',
    'contact.phone': 'Phone',
    'contact.phone_value': '+221 33 123 45 67\n+221 77 123 45 67',
    'contact.email': 'Email',
    'contact.email_value': 'contact@afizar.com\nsupport@afizar.com',
    'contact.hours': 'Hours',
    'contact.hours_value': 'Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: Closed',
    'contact.whatsapp_title': 'Quick Contact',
    'contact.whatsapp_desc': 'Need an immediate response? Contact us on WhatsApp!',
    'contact.whatsapp_button': 'Contact on WhatsApp',
    'contact.form_title': 'Send us a message',
    'contact.name': 'Full Name',
    'contact.email_placeholder': 'Your email',
    'contact.phone_placeholder': 'Your phone',
    'contact.subject': 'Subject',
    'contact.message': 'Your message',
    'contact.send': 'Send message',
    'contact.success': 'Message sent successfully!',
    'contact.faq_title': 'Frequently Asked Questions',
    'contact.faq_shipping': 'What are the delivery times?',
    'contact.faq_shipping_answer': 'Delivery times vary by destination: 2-5 days in Senegal, 7-15 days in Africa, 15-30 days internationally.',
    'contact.faq_payment': 'What payment methods do you accept?',
    'contact.faq_payment_answer': 'We accept credit cards, mobile payments (Orange Money, Wave), and bank transfers.',
    'contact.faq_custom': 'Can I order custom-made outfits?',
    'contact.faq_custom_answer': 'Yes! Our artisans can create custom pieces according to your preferences. Contact us to discuss your project.',
    'contact.faq_return': 'What is your return policy?',
    'contact.faq_return_answer': 'You can return an item within 14 days of receipt, provided it is in its original condition.',
    
    // Clothes Page
    'clothes.page_title': 'Clothing',
    'clothes.discover': 'Discover our collection of traditional Senegalese clothing',
    'clothes.search_placeholder': 'Search for clothing...',
    'clothes.all_categories': 'All Categories',
    'clothes.all_types': 'All types',
    'clothes.men': 'Men',
    'clothes.women': 'Women',
    'clothes.all_sizes': 'All sizes',
    'clothes.all_prices': 'All prices',
    'clothes.under_30k': 'Under 30,000 FCFA',
    'clothes.30k_60k': '30,000 - 60,000 FCFA',
    'clothes.60k_100k': '60,000 - 100,000 FCFA',
    'clothes.over_100k': 'Over 100,000 FCFA',
    'clothes.sort_by': 'Sort by',
    'clothes.popular': 'Popular',
    'clothes.new': 'New arrivals',
    'clothes.price_low': 'Price: Low to High',
    'clothes.price_high': 'Price: High to Low',
    'clothes.rating': 'Best rated',
    'clothes.add_to_cart': 'Add to cart',
    'clothes.view_details': 'View details',
    'clothes.add_to_wishlist': 'Add to wishlist',
    'clothes.order_whatsapp': 'Order on WhatsApp',
    'clothes.new_badge': 'New',
    'clothes.trending': 'Trending',
    'clothes.reviews': 'reviews',
    'clothes.back': 'Back',
    'clothes.found': 'item(s) found',
    'clothes.boubous': 'Boubous',
    'clothes.costumes': 'Suits',
    'clothes.pants': 'Pants',
    'clothes.shirts': 'Shirts',
    'clothes.dresses': 'Dresses',
    'clothes.skirts': 'Skirts',
    'clothes.tops': 'Tops',
    'clothes.ensembles': 'Ensembles',
    
    // Accessories Page
    'accessories.page_title': 'Accessories',
    'accessories.discover': 'Discover our collection of handcrafted accessories',
    'accessories.search_placeholder': 'Search for accessories...',
    'accessories.all_categories': 'All Categories',
    'accessories.all_types': 'All types',
    'accessories.shoes': 'Shoes',
    'accessories.hats': 'Hats',
    'accessories.belts': 'Belts',
    'accessories.bags': 'Bags',
    'accessories.jewelry': 'Jewelry',
    'accessories.found': 'accessory(ies) found',
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

  const switchLanguage = (): void => {
    const newLanguage = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
  };

  const value: I18nContextType = {
    language,
    country,
    currency,
    setLanguage,
    setCountry,
    switchLanguage,
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