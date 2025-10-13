// import React, { useState, useEffect } from 'react';
// import { ArrowRight, Sparkles, ShoppingBag, Star, Award, ChevronLeft, ChevronRight, Play } from 'lucide-react';
// import { useI18n } from '../contexts/InternationalizationContext';

// const Hero = ({ onNavigate }) => {
//   const { t } = useI18n();
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     {
//       image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=1200',
//       title: 'Élégance Féminine Traditionnelle',
//       description: 'Découvrez nos magnifiques boubous brodés'
//     },
//     {
//       image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1200',
//       title: 'Distinction Masculine',
//       description: 'Grands boubous et costumes traditionnels'
//     },
//     {
//       image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200',
//       title: 'Accessoires Authentiques',
//       description: 'Bijoux et accessoires artisanaux'
//     },
//     {
//       image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=1200',
//       title: 'Créations Sur Mesure',
//       description: 'Personnalisez vos tenues selon vos goûts'
//     }
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   return (
//     <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-hidden min-h-screen">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-red-100/10 rounded-full blur-3xl animate-spin-slow"></div>
//       </div>
      
//       {/* Floating Particles */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-orange-300/40 rounded-full animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`
//             }}
//           />
//         ))}
//       </div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Présentation Afrizar */}
//           <div className="text-center lg:text-left">
//             <div className="flex items-center justify-center lg:justify-start mb-8 group">
//               <div className="relative">
//                 <Sparkles className="h-6 w-6 text-orange-600 mr-3 animate-pulse" />
//                 <div className="absolute inset-0 bg-orange-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
//               </div>
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-bold text-sm uppercase tracking-widest">
//                 Made in Senegal
//               </span>
//             </div>
            
//             <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 block animate-gradient-x">
//                 Afrizar.sn
//               </span>
//               <span className="text-gray-700 text-4xl sm:text-5xl lg:text-6xl">Vitrine Digitale</span>
//             </h1>
            
//             <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 mb-10 shadow-2xl border border-orange-100">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
//               <p className="text-lg text-gray-700 leading-relaxed mb-4">
//                 <span className="text-orange-600 font-semibold">Afrizar.sn</span> est une vitrine digitale dédiée à la 
//                 <span className="text-red-600 font-semibold"> valorisation des produits Made in Senegal</span>.
//               </p>
//               <p className="text-gray-600 leading-relaxed">
//                 Nous connectons les <span className="font-semibold text-orange-600">artisans passionnés</span> du Sénégal 
//                 avec une clientèle internationale, en mettant en valeur l'authenticité et la qualité de l\'artisanat sénégalais.
//               </p>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
//               <button 
//                 onClick={() => onNavigate('categories')}
//                 className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center group shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
//                 <span className="relative">Explorer les Catégories</span>
//                 <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform relative" />
//               </button>
//               <button 
//                 onClick={() => onNavigate('vendors')}
//                 className="relative border-3 border-orange-600 text-orange-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-orange-600 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105"
//               >
//                 <span className="relative">Découvrir nos Artisans</span>
//               </button>
//             </div>
            
//             <div className="grid grid-cols-3 gap-8 justify-center lg:justify-start">
//               <div className="text-center group cursor-pointer">
//                 <div className="relative mb-3">
//                   <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">500+</div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 </div>
//                 <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Créations Uniques</div>
//               </div>
//               <div className="text-center group cursor-pointer">
//                 <div className="relative mb-3">
//                   <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">50+</div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 </div>
//                 <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Artisans Experts</div>
//               </div>
//               <div className="text-center group cursor-pointer">
//                 <div className="relative mb-3">
//                   <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">30+</div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 </div>
//                 <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Pays Desservis</div>
//               </div>
//             </div>
//           </div>
          
//           {/* Slider d'images */}
//           <div className="relative">
//             <div className="relative z-10 group">
//               <div className="relative overflow-hidden rounded-3xl shadow-2xl">
//                 <div className="relative h-96 lg:h-[600px]">
//                   {slides.map((slide, index) => (
//                     <div
//                       key={index}
//                       className={`absolute inset-0 transition-all duration-1000 ${
//                         index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
//                       }`}
//                     >
//                       <img
//                         src={slide.image}
//                         alt={slide.title}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
//                       {/* Slide Content */}
//                       <div className="absolute bottom-8 left-8 right-8 text-white">
//                         <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
//                         <p className="text-orange-200">{slide.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 {/* Navigation Arrows */}
//                 <button
//                   onClick={prevSlide}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
//                 >
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
//                 <button
//                   onClick={nextSlide}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
//                 >
//                   <ChevronRight className="h-6 w-6" />
//                 </button>
                
//                 {/* Slide Indicators */}
//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                   {slides.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentSlide(index)}
//                       className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                         index === currentSlide 
//                           ? 'bg-white scale-125' 
//                           : 'bg-white/50 hover:bg-white/75'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
              
//               {/* Floating Badge - Quality */}
//               <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-orange-100">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
//                     <Award className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-bold text-gray-900">Made in Senegal</div>
//                     <div className="text-xs text-gray-600">Artisanat authentique</div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Floating Badge - Delivery */}
//               <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-green-100">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
//                     <ShoppingBag className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-bold text-gray-900">Livraison Mondiale</div>
//                     <div className="text-xs text-gray-600">Partout dans le monde</div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Floating Badge - Rating */}
//               <div className="absolute top-1/2 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-yellow-100">
//                 <div className="flex items-center space-x-2">
//                   <Star className="h-5 w-5 text-yellow-500 fill-current" />
//                   <div>
//                     <div className="text-lg font-black text-gray-900">4.9</div>
//                     <div className="text-xs text-gray-600">Excellence</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Background Decorative Elements */}
//             <div className="absolute inset-0 -z-10">
//               <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-300/30 to-red-300/30 rounded-full blur-2xl animate-pulse"></div>
//               <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
//             </div>
//           </div>
//         </div>
        
//         {/* Trust Indicators */}
//         <div className="mt-20 pt-12 border-t border-orange-200/50">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <div className="text-center group">
//               <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-orange-500/25 transform group-hover:scale-110 transition-all duration-300">
//                 <Award className="h-8 w-8 text-white" />
//               </div>
//               <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Qualité Certifiée</div>
//               <div className="text-sm text-gray-600">Artisanat authentique</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-green-500/25 transform group-hover:scale-110 transition-all duration-300">
//                 <ShoppingBag className="h-8 w-8 text-white" />
//               </div>
//               <div className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Livraison Rapide</div>
//               <div className="text-sm text-gray-600">Expédition mondiale</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-blue-500/25 transform group-hover:scale-110 transition-all duration-300">
//                 <Star className="h-8 w-8 text-white" />
//               </div>
//               <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Excellence</div>
//               <div className="text-sm text-gray-600">Note 4.9/5</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-purple-500/25 transform group-hover:scale-110 transition-all duration-300">
//                 <Sparkles className="h-8 w-8 text-white" />
//               </div>
//               <div className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Sur Mesure</div>
//               <div className="text-sm text-gray-600">Personnalisation</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;


















// import React, { useState, useEffect } from 'react';
// import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, Settings, Crown, ChevronLeft, ChevronRight, Globe, ArrowRight, Sparkles, Star, Award, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Users, Package, Shield } from 'lucide-react';

// const Afrizar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [language, setLanguage] = useState('fr');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [cartCount] = useState(3);
//   const [wishlistCount] = useState(5);
  
//   // Données pour le carrousel principal (Teaser)
//   const heroSlides = [
//     {
//       id: 1,
//       image: "https://images.unsplash.com/photo-1583745800992-0d82e55ae8b5?w=1200&h=600&fit=crop",
//       title: "Élégance Féminine Traditionnelle",
//       subtitle: "Découvrez nos magnifiques boubous brodés"
//     },
//     {
//       id: 2,
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
//       title: "Distinction Masculine",
//       subtitle: "Grands boubous et costumes traditionnels"
//     },
//     {
//       id: 3,
//       image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop",
//       title: "Accessoires Authentiques",
//       subtitle: "Bijoux et accessoires artisanaux"
//     }
//   ];

//   // Produits à la une
//   const featuredProducts = [
//     {
//       id: 1,
//       name: "Boubou Traditionnel",
//       price: "45,000 FCFA",
//       originalPrice: "60,000 FCFA",
//       image: "https://images.unsplash.com/photo-1583745800992-0d82e55ae8b5?w=300&h=300&fit=crop",
//       category: "Hommes",
//       isNew: true
//     },
//     {
//       id: 2,
//       name: "Robe Wax Moderne",
//       price: "35,000 FCFA",
//       image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
//       category: "Femmes",
//       discount: "-20%"
//     },
//     {
//       id: 3,
//       name: "Ensemble Enfant",
//       price: "25,000 FCFA",
//       image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=300&h=300&fit=crop",
//       category: "Enfants"
//     }
//   ];

//   // Vêtements par catégorie
//   const clothingCategories = [
//     {
//       title: "Vêtements Hommes",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
//       count: "150+ articles",
//       popular: ["Boubous", "Costumes", "Chemises"]
//     },
//     {
//       title: "Vêtements Femmes", 
//       image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
//       count: "200+ articles",
//       popular: ["Robes", "Boubous", "Ensembles"]
//     },
//     {
//       title: "Vêtements Enfants",
//       image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=300&fit=crop", 
//       count: "80+ articles",
//       popular: ["Garçons", "Filles", "Bébés"]
//     }
//   ];

//   // Accessoires
//   const accessories = [
//     {
//       name: "Sac en Cuir Artisanal",
//       price: "25,000 FCFA",
//       image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
//       category: "Sacs"
//     },
//     {
//       name: "Bijoux Traditionnels",
//       price: "15,000 FCFA",
//       image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
//       category: "Bijoux"
//     },
//     {
//       name: "Chaussures Artisanales",
//       price: "30,000 FCFA",
//       image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
//       category: "Chaussures"
//     },
//     {
//       name: "Bonnet Traditionnel",
//       price: "12,000 FCFA",
//       image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=200&h=200&fit=crop",
//       category: "Chapeaux"
//     }
//   ];

//   // Vendeurs
//   const vendors = [
//     {
//       id: 1,
//       name: "Atelier Fatou",
//       specialty: "Boubous Femmes",
//       image: "https://images.unsplash.com/photo-1494790108755-2616c64c6e1e?w=150&h=150&fit=crop",
//       location: "Dakar",
//       rating: 4.9,
//       products: 25
//     },
//     {
//       id: 2,
//       name: "Maison Moussa",
//       specialty: "Costumes Hommes",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
//       location: "Thiès",
//       rating: 4.8,
//       products: 40
//     },
//     {
//       id: 3,
//       name: "Bijoux Aminata",
//       specialty: "Bijoux & Accessoires",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
//       location: "Saint-Louis",
//       rating: 4.7,
//       products: 60
//     }
//   ];

//   // Auto-play du carrousel
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [heroSlides.length]);

//   const texts = {
//     fr: {
//       categories: "Catégories",
//       vendors: "Vendeurs", 
//       accessories: "Accessoires",
//       login: "Connexion",
//       search: "Rechercher...",
//       heroTitle: "Afrizar.sn",
//       heroSubtitle: "Vitrine digitale dédiée à la valorisation des produits Made in Senegal",
//       featuredTitle: "Produits à la Une",
//       categoryTitle: "Nos Catégories de Vêtements",
//       shopNow: "Acheter",
//       presentation: "African Market",
//       presentationText: "Afrizar.sn est une vitrine digitale dédiée à la valorisation des produits Made in Senegal. Nous connectons les artisans passionnés du Sénégal avec une clientèle internationale.",
//       accessoriesTitle: "Accessoires",
//       vendorsTitle: "Nos Vendeurs",
//       viewAll: "Voir Tout"
//     },
//     en: {
//       categories: "Categories",
//       vendors: "Vendors",
//       accessories: "Accessories", 
//       login: "Login",
//       search: "Search...",
//       heroTitle: "Afrizar.sn",
//       heroSubtitle: "Digital showcase dedicated to promoting Made in Senegal products",
//       featuredTitle: "Featured Products",
//       categoryTitle: "Our Clothing Categories",
//       shopNow: "Shop Now",
//       presentation: "African Market",
//       presentationText: "Afrizar.sn is a digital showcase dedicated to promoting Made in Senegal products. We connect passionate artisans from Senegal with an international clientele.",
//       accessoriesTitle: "Accessories",
//       vendorsTitle: "Our Vendors",
//       viewAll: "View All"
//     }
//   };

//   const t = (key) => texts[language][key] || key;

//   const toggleLanguage = () => {
//     setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
//   };

//   const handleWishlistClick = () => {
//     if (!isAuthenticated) {
//       alert('Veuillez vous connecter pour accéder à vos favoris');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
    

//       {/* Hero Section - Teaser */}
//       <section className="relative h-96 overflow-hidden">
//         <div className="absolute inset-0">
//           {heroSlides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={`absolute inset-0 transition-opacity duration-1000 ${
//                 index === currentSlide ? 'opacity-100' : 'opacity-0'
//               }`}
//             >
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/50"></div>
//             </div>
//           ))}
//         </div>

//         <div className="relative h-full flex items-center justify-center text-center text-white px-4">
//           <div className="max-w-3xl">
//             <h1 className="text-4xl md:text-6xl font-black mb-4">
//               {heroSlides[currentSlide]?.title}
//             </h1>
//             <p className="text-lg md:text-xl mb-6 text-white/90">
//               {heroSlides[currentSlide]?.subtitle}
//             </p>
//             <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all">
//               Découvrir
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30"
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30"
//         >
//           <ChevronRight className="h-5 w-5" />
//         </button>

//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {heroSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-2 h-2 rounded-full transition-colors ${
//                 index === currentSlide ? 'bg-white' : 'bg-white/50'
//               }`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* African Market Section */}
//       <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex items-center justify-center mb-4">
//             <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
//             <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">
//               Made in Senegal
//             </span>
//           </div>
          
//           <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
//             {t('presentation')}
//           </h2>
          
//           <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
//             {t('presentationText')}
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Users className="h-8 w-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">50+ Artisans</h3>
//               <p className="text-gray-600">Créateurs passionnés</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Package className="h-8 w-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">500+ Produits</h3>
//               <p className="text-gray-600">Créations authentiques</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Shield className="h-8 w-8 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">100% Qualité</h3>
//               <p className="text-gray-600">Garantie artisanale</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Produits à la Une */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-12">
//             <h2 className="text-3xl font-black text-gray-900">
//               {t('featuredTitle')}
//             </h2>
//             <button className="text-orange-600 hover:text-orange-700 font-semibold flex items-center">
//               {t('viewAll')}
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {featuredProducts.map((product) => (
//               <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   {product.isNew && (
//                     <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       Nouveau
//                     </span>
//                   )}
//                   {product.discount && (
//                     <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       {product.discount}
//                     </span>
//                   )}
//                   <button 
//                     onClick={handleWishlistClick}
//                     className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
//                   >
//                     <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
//                   </button>
//                 </div>
//                 <div className="p-6">
//                   <div className="text-sm text-orange-600 font-semibold mb-2">{product.category}</div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <span className="text-2xl font-black text-orange-600">{product.price}</span>
//                       {product.originalPrice && (
//                         <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
//                       )}
//                     </div>
//                     <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
//                       {t('shopNow')}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Vêtements */}
//       <section className="py-16 bg-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-black text-gray-900 mb-4">
//               {t('categoryTitle')}
//             </h2>
//             <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {clothingCategories.map((category, index) => (
//               <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={category.image}
//                     alt={category.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                   <div className="absolute bottom-4 left-4 text-white">
//                     <h3 className="text-xl font-bold mb-1">{category.title}</h3>
//                     <p className="text-sm text-white/80">{category.count}</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="flex flex-wrap gap-2">
//                     {category.popular.map((item, itemIndex) => (
//                       <span 
//                         key={itemIndex}
//                         className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 cursor-pointer transition-colors"
//                       >
//                         {item}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Accessoires */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-12">
//             <h2 className="text-3xl font-black text-gray-900">
//               {t('accessoriesTitle')}
//             </h2>
//             <button className="text-orange-600 hover:text-orange-700 font-semibold flex items-center">
//               {t('viewAll')}
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {accessories.map((accessory, index) => (
//               <div key={index} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={accessory.image}
//                     alt={accessory.name}
//                     className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <div className="text-xs text-orange-600 font-semibold mb-1">{accessory.category}</div>
//                   <h3 className="text-sm font-bold text-gray-900 mb-2">{accessory.name}</h3>
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-black text-orange-600">{accessory.price}</span>
//                     <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
//                       <ShoppingBag className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Vendeurs */}
//       <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-black text-gray-900 mb-4">
//               {t('vendorsTitle')}
//             </h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Découvrez nos artisans talentueux qui créent des pièces uniques avec passion et savoir-faire
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {vendors.map((vendor) => (
//               <div key={vendor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
//                 <div className="relative inline-block mb-4">
//                   <img
//                     src={vendor.image}
//                     alt={vendor.name}
//                     className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-orange-100"
//                   />
//                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.name}</h3>
//                 <p className="text-orange-600 font-semibold mb-2">{vendor.specialty}</p>
//                 <div className="flex items-center justify-center text-gray-600 mb-3">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   <span className="text-sm">{vendor.location}</span>
//                 </div>
//                 <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
//                   <div className="flex items-center">
//                     <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
//                     <span>{vendor.rating}</span>
//                   </div>
//                   <div>{vendor.products} produits</div>
//                 </div>
//                 <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
//                   Voir la boutique
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
      
//     </div>
//   );
// };

// export default Afrizar;



import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Star, MapPin, Users, Package, Shield, Zap, Clock, TrendingUp, Gift, Tag, Bell, X, MessageSquare, Phone, Mail } from 'lucide-react';

interface AfrizarHomepageProps {
  onNavigate?: (page: string) => void;
}

const AfrizarHomepage = ({ onNavigate }: AfrizarHomepageProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowNewsletter(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const heroSlides = [
    { id: 1, image: "https://images.unsplash.com/photo-1583745800992-0d82e55ae8b5?w=1200&h=600&fit=crop", title: "MEGA SOLDES", subtitle: "Jusqu'à -50% sur toute la collection", badge: "HOT" },
    { id: 2, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop", title: "Nouvelle Collection", subtitle: "Découvrez les dernières tendances africaines", badge: "NEW" },
    { id: 3, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop", title: "Livraison Gratuite", subtitle: "Pour toute commande supérieure à 50,000 FCFA", badge: "PROMO" }
  ];

  const flashSales = [
    { id: 1, name: "Boubou Grand Brodé", price: "30,000 FCFA", originalPrice: "60,000 FCFA", discount: "-50%", image: "https://images.unsplash.com/photo-1583745800992-0d82e55ae8b5?w=300&h=300&fit=crop", stock: "3 restants", sold: 45 },
    { id: 2, name: "Ensemble Wax Premium", price: "25,000 FCFA", originalPrice: "40,000 FCFA", discount: "-37%", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop", stock: "Stock limité", sold: 32 },
    { id: 3, name: "Costume 3 Pièces", price: "45,000 FCFA", originalPrice: "75,000 FCFA", discount: "-40%", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", stock: "Dernières pièces", sold: 28 },
    { id: 4, name: "Robe Traditionnelle", price: "20,000 FCFA", originalPrice: "35,000 FCFA", discount: "-43%", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop", stock: "5 restants", sold: 51 }
  ];

  const featuredProducts = [
    { id: 1, name: "Boubou Traditionnel Deluxe", price: "45,000 FCFA", originalPrice: "55,000 FCFA", image: "https://images.unsplash.com/photo-1583745800992-0d82e55ae8b5?w=300&h=300&fit=crop", badge: "NOUVEAU", badgeColor: "green", rating: 4.9, reviews: 128 },
    { id: 2, name: "Robe Wax Moderne", price: "28,000 FCFA", originalPrice: "40,000 FCFA", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop", badge: "-30%", badgeColor: "red", rating: 4.8, reviews: 95 },
    { id: 3, name: "Ensemble Premium", price: "35,000 FCFA", image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=300&h=300&fit=crop", badge: "TOP VENTE", badgeColor: "orange", rating: 5.0, reviews: 203 }
  ];

  const clothingCategories = [
    { title: "Vêtements Hommes", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", count: "150+ articles" },
    { title: "Vêtements Femmes", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop", count: "200+ articles" },
    { title: "Vêtements Enfants", image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=300&fit=crop", count: "80+ articles" }
  ];

  const accessories = [
    { name: "Sac Cuir Artisanal", price: "25,000 FCFA", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
    { name: "Bijoux Traditionnels", price: "15,000 FCFA", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
    { name: "Chaussures Artisanales", price: "30,000 FCFA", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" },
    { name: "Bonnet Traditionnel", price: "12,000 FCFA", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=200&h=200&fit=crop" }
  ];

  const vendors = [
    { id: 1, name: "Atelier Fatou", specialty: "Boubous Femmes", image: "https://images.unsplash.com/photo-1494790108755-2616c64c6e1e?w=150&h=150&fit=crop", location: "Dakar", rating: 4.9, products: 25 },
    { id: 2, name: "Maison Moussa", specialty: "Costumes Hommes", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop", location: "Thiès", rating: 4.8, products: 40 },
    { id: 3, name: "Bijoux Aminata", specialty: "Bijoux & Accessoires", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", location: "Saint-Louis", rating: 4.7, products: 60 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const getBadgeColor = (color: string) => {
    const colors: { [key: string]: string } = { green: 'bg-green-500', red: 'bg-red-500', orange: 'bg-orange-500' };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2.5 text-center text-sm font-bold">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="h-4 w-4 animate-pulse" />
          <span>MEGA SOLDES : Jusqu'à -50% sur tout le site !</span>
          <Zap className="h-4 w-4 animate-pulse" />
        </div>
      </div>

      <section className="relative h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <span className={`${slide.badge === 'HOT' ? 'bg-red-600' : slide.badge === 'NEW' ? 'bg-green-600' : 'bg-orange-600'} text-white px-4 py-1 rounded-full text-sm font-bold inline-block mb-4 animate-pulse`}>{slide.badge}</span>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">{slide.title}</h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8">{slide.subtitle}</p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all shadow-2xl">
                    Découvrir <ArrowRight className="inline ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30"><ChevronLeft className="h-6 w-6" /></button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30"><ChevronRight className="h-6 w-6" /></button>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">Made in Senegal</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">African Market</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Afrizar.sn est une vitrine digitale dédiée à la valorisation des produits Made in Senegal. Nous connectons les artisans passionnés du Sénégal avec une clientèle internationale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600 font-medium">Artisans Experts</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600 font-medium">Créations Uniques</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600 font-medium">Qualité Garantie</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Zap className="h-8 w-8 text-red-600 animate-pulse" />
              <div>
                <h2 className="text-3xl font-black text-gray-900">Ventes Flash</h2>
                <p className="text-gray-600">Offres limitées - Dépêchez-vous !</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full px-6 py-3 shadow-lg border-2 border-red-200">
              <Clock className="h-5 w-5 text-red-600" />
              <div className="flex space-x-2 text-lg font-bold text-gray-900">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span><span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span><span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {flashSales.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-red-200">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">{product.discount}</span>
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-50 transition-colors shadow-lg">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center text-white text-xs font-semibold">
                      <TrendingUp className="h-3 w-3 mr-1" /><span>{product.sold} vendus</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-black text-red-600">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="text-xs text-orange-600 font-bold mb-3 flex items-center">
                    <Zap className="h-3 w-3 mr-1" />{product.stock}
                  </div>
                  <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2.5 rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-md">Acheter</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Gift className="h-6 w-6" />
            <span className="font-bold text-lg">Code Promo : AFRIZAR2025 pour -15% supplémentaires</span>
            <Tag className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Produits à la Une</h2>
              <p className="text-gray-600">Nos meilleures ventes</p>
            </div>
            <button 
              onClick={() => onNavigate?.('vetements')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center group cursor-pointer"
            >
              Voir tout<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-4 left-4 ${getBadgeColor(product.badgeColor)} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>{product.badge}</span>
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-red-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-black text-orange-600">{product.price}</span>
                    {product.originalPrice && <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>}
                  </div>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-md">Ajouter au panier</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Vêtements</h2>
              <p className="text-gray-600">Nos catégories de vêtements</p>
            </div>
            <button 
              onClick={() => onNavigate?.('vetements')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center group cursor-pointer"
            >
              Tout voir<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clothingCategories.map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src={category.image} alt={category.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-black mb-2">{category.title}</h3>
                  <p className="text-white/90 mb-4">{category.count}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors">Explorer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Accessoires</h2>
              <p className="text-gray-600">Complétez votre style</p>
            </div>
            <button 
              onClick={() => onNavigate?.('accessoires')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center group cursor-pointer"
            >
              Voir plus<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {accessories.map((accessory, index) => (
              <div key={index} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img src={accessory.image} alt={accessory.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-50 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{accessory.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-orange-600">{accessory.price}</span>
                    <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors shadow-md">
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Nos Vendeurs</h2>
              <p className="text-gray-600">Découvrez nos artisans talentueux</p>
            </div>
            <button 
              onClick={() => onNavigate?.('vendeurs')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center group cursor-pointer"
            >
              Tous les vendeurs<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group cursor-pointer">
                <div className="relative inline-block mb-4">
                  <img src={vendor.image} alt={vendor.name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-orange-100 group-hover:border-orange-300 transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.name}</h3>
                <p className="text-orange-600 font-semibold mb-3">{vendor.specialty}</p>
                <div className="flex items-center justify-center text-gray-600 mb-3 text-sm">
                  <MapPin className="h-4 w-4 mr-1" /><span>{vendor.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold">{vendor.rating}</span>
                  </div>
                  <div className="font-medium">{vendor.products} produits</div>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-md">
                  Voir la boutique
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Contact Section */}
      <section className="py-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="flex flex-col items-center justify-center p-3">
              <Shield className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-black text-gray-900 text-sm mb-1">PAIEMENT SÉCURISÉ</h3>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <Clock className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-black text-gray-900 text-sm mb-1">24/7 SERVICE CLIENT</h3>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-black text-gray-900 text-sm mb-1">IMPACT BUSINESS</h3>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <Zap className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-black text-gray-900 text-sm mb-1">LIVRAISON RAPIDE</h3>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <Gift className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-black text-gray-900 text-sm mb-1">15 JOURS POUR RETOUR</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Service Client */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">SERVICE CLIENT</h3>
              <p className="text-gray-600 font-medium">7j/7j de 8H à 20H</p>
            </div>

            {/* Contacter Nous */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">CONTACTER NOUS</h3>
              <p className="text-gray-600 font-medium">+221 77 XXX XX XX</p>
              <p className="text-sm text-gray-500">(WhatsApp)</p>
            </div>

            {/* Nous Écrire */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">NOUS ÉCRIRE</h3>
              <a href="mailto:contact@afrizar.sn" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                contact@afrizar.sn
              </a>
            </div>

            {/* Nos Adresses */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">NOS ADRESSES</h3>
              <p className="text-gray-600 font-medium">Dakar, Paris et Tunis</p>
            </div>
          </div>
        </div>
      </section>

      {showNewsletter && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowNewsletter(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Ne ratez rien !</h3>
              <p className="text-gray-600 mb-6">Inscrivez-vous et recevez <span className="font-bold text-orange-600">-10%</span> sur votre première commande</p>
              <input type="email" placeholder="Votre email" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg mb-3">
                S'inscrire maintenant
              </button>
              <button onClick={() => setShowNewsletter(false)} className="text-sm text-gray-500 hover:text-gray-700">
                Non merci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfrizarHomepage;