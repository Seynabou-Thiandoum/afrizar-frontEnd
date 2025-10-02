// import React, { useState } from 'react';
// import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, Settings, Crown } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import { useI18n } from '../contexts/InternationalizationContext';
// import LanguageSelector from './LanguageSelector';

// const Header = ({ onNavigate, onOpenAuth, onSearch }) => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const { t } = useI18n();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [cartCount] = useState(3);
//   const [wishlistCount] = useState(5);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       // Set global search term and navigate to catalog
//       if (onSearch) {
//         onSearch(searchTerm);
//       }
//       onNavigate('catalog');
//       setShowSearchResults(false);
//       setSearchTerm('');
//     }
//   };

//   const handleWishlistClick = () => {
//     if (isAuthenticated) {
//       onNavigate('wishlist');
//     } else {
//       onOpenAuth('login');
//     }
//   };

//   const handleNavigation = (page) => {
//     onNavigate(page);
//     setIsMenuOpen(false);
//   };

//   const handleLogout = () => {
//     logout();
//     setShowUserMenu(false);
//     handleNavigation('home');
//   };

//   const getRoleColor = (role) => {
//     const colors = {
//       client: 'from-blue-500 to-indigo-500',
//       vendor: 'from-green-500 to-emerald-500',
//       support: 'from-purple-500 to-violet-500',
//       admin: 'from-red-500 to-pink-500',
//       developer: 'from-gray-500 to-slate-500',
//       founder: 'from-yellow-500 to-orange-500'
//     };
//     return colors[role] || 'from-gray-500 to-gray-600';
//   };

//   const getRoleLabel = (role) => {
//     const labels = {
//       client: 'Client',
//       vendor: 'Vendeur',
//       support: 'Support',
//       admin: 'Admin',
//       developer: 'Développeur',
//       founder: 'Fondateur'
//     };
//     return labels[role] || role;
//   };

//   return (
//     <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100/50 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
//             <div className="flex-shrink-0 group">
//               <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:from-orange-700 group-hover:to-red-700 transition-all duration-300">
//                 Afrizar.sn
//               </h1>
//               <span className="text-xs text-gray-600 font-semibold tracking-wider uppercase">Couture Sénégalaise</span>
//             </div>
//           </div>

//           {/* Navigation Desktop */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <button 
//               onClick={() => handleNavigation('categories')}
//               className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
//             >
//               Catégories
//             </button>
//             <button 
//               onClick={() => handleNavigation('vendors')}
//               className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
//             >
//               Vendeurs
//             </button>
//             <button 
//               onClick={() => handleNavigation('accessoires')}
//               className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
//             >
//               Accessoires
//             </button>
            
//             {/* Bouton Traduction */}
//             <button onClick={toggleLanguage} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
//               <Globe className="h-4 w-4 text-gray-600" />
//               <span className="text-sm font-semibold text-gray-600">{language === 'fr' ? 'EN' : 'FR'}</span>
//             </button>
            
//             {/* Bouton Connexion */}
//             <button 
//               onClick={() => onOpenAuth('login')}
//               className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               Connexion
//             </button>
//           </nav>

//           {/* Search & Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Language Selector */}
//             <LanguageSelector className="hidden lg:block" />

//             {/* Search Bar */}
//             <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl px-4 py-3 border border-orange-100 focus-within:border-orange-300 transition-colors">
//               <Search className="h-5 w-5 text-orange-500" />
//               <input
//                 type="text"
//                 placeholder={t('common.search')}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-0 outline-none text-sm text-gray-700 placeholder-gray-500 w-64 ml-3 font-medium"
//               />
//             </form>

//             {/* Search Icon Mobile */}
//             <button 
//               onClick={() => onNavigate('catalog')}
//               className="lg:hidden p-3 rounded-2xl hover:bg-orange-50 transition-colors"
//             >
//               <Search className="h-6 w-6 text-gray-700" />
//             </button>

//             {/* Wishlist */}
//             <button 
//               onClick={handleWishlistClick}
//               className="hidden md:flex p-3 rounded-2xl hover:bg-red-50 transition-colors relative group"
//             >
//               <Heart className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
//                   {wishlistCount}
//                 </span>
//               )}
//             </button>

//             {/* Account */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                   className="hidden md:flex items-center space-x-3 p-3 rounded-2xl hover:bg-blue-50 transition-colors group"
//                 >
//                   <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
//           {/* Search & Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Language Selector */}
//             <LanguageSelector className="hidden lg:block" />

//             {/* Search Bar */}
//             <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl px-4 py-3 border border-orange-100 focus-within:border-orange-300 transition-colors">
//               <Search className="h-5 w-5 text-orange-500" />
//               <input
//                 type="text"
//                 placeholder={t('common.search')}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-0 outline-none text-sm text-gray-700 placeholder-gray-500 w-64 ml-3 font-medium"
//               />
//             </form>

//             {/* Search Icon Mobile */}
//             <button 
//               onClick={() => onNavigate('catalog')}
//               className="lg:hidden p-3 rounded-2xl hover:bg-orange-50 transition-colors"
//             >
//               <Search className="h-6 w-6 text-gray-700" />
//             </button>

//             {/* Wishlist */}
//             <button 
//               onClick={handleWishlistClick}
//               className="hidden md:flex p-3 rounded-2xl hover:bg-red-50 transition-colors relative group"
//             >
//               <Heart className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
//                   {wishlistCount}
//                 </span>
//               )}
//             </button>

//             {/* Account */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                   className="hidden md:flex items-center space-x-3 p-3 rounded-2xl hover:bg-blue-50 transition-colors group"
//                 >
//                   <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
//                     <User className="h-5 w-5 text-white" />
//                   </div>
//                   <div className="text-left">
//                     <div className="text-sm font-bold text-gray-900">{user.firstName}</div>
//                     <div className="text-xs text-gray-600">{getRoleLabel(user.role)}</div>
//                   </div>
//                 </button>

//                 {/* User Dropdown Menu */}
//                 {showUserMenu && (
//                   <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
//                     <div className="p-4 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
//                           <User className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                           <div className="font-bold text-gray-900">{user.firstName} {user.lastName}</div>
//                           <div className="text-sm text-gray-600">{user.email}</div>
//                           <div className={`inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${getRoleColor(user.role)} text-white rounded-full text-xs font-bold mt-1`}>
//                             <Crown className="h-3 w-3" />
//                             <span>{getRoleLabel(user.role)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="p-2">
//                       {user.role === 'vendor' && (
//                         <button
//                           onClick={() => {
//                             handleNavigation('vendor-dashboard');
//                             setShowUserMenu(false);
//                           }}
//                           className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
//                         >
//                           <Settings className="h-5 w-5 text-gray-600" />
//                           <span>Tableau de bord</span>
//                         </button>
//                       )}
                      
//                       <button
//                         onClick={() => {
//                           setShowUserMenu(false);
//                           onNavigate('profile');
//                         }}
//                         className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
//                       >
//                         <User className="h-5 w-5 text-gray-600" />
//                         <span>Mon Profil</span>
//                       </button>
                      
                    
//                     {user.role === 'client' && (
//                       <button
//                         onClick={() => {
//                           handleNavigation('client-dashboard');
//                           setShowUserMenu(false);
//                         }}
//                         className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
//                       >
//                         <Settings className="h-5 w-5 text-gray-600" />
//                         <span>Mon Espace</span>
//                       </button>
//                     )}

//                     {(user.role === 'admin' || user.role === 'support' || user.role === 'developer' || user.role === 'founder') && (
//                       <button
//                         onClick={() => {
//                           const dashboardPage = user.role === 'admin' ? 'admin-dashboard' : 
//                                                user.role === 'support' ? 'support-dashboard' :
//                                                user.role === 'developer' ? 'developer-dashboard' :
//                                                user.role === 'founder' ? 'founder-dashboard' : 'admin-dashboard';
//                           handleNavigation(dashboardPage);
//                           setShowUserMenu(false);
//                         }}
//                         className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
//                       >
//                         <Settings className="h-5 w-5 text-gray-600" />
//                         <span>Administration</span>
//                       </button>
//                     )}
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600"
//                       >
//                         <LogOut className="h-5 w-5" />
//                         <span>Déconnexion</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button 
//                 onClick={() => onOpenAuth('login')}
//                 className="hidden md:flex p-3 rounded-2xl hover:bg-blue-50 transition-colors group"
//               >
//                 <User className="h-6 w-6 text-gray-700 group-hover:text-blue-500 transition-colors" />
//               </button>
//             )}

//             {/* Cart */}
//             <button 
//               onClick={() => handleNavigation('cart')}
//               className="flex p-3 rounded-2xl hover:bg-orange-50 transition-colors relative group"
//             >
//               <ShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-3 rounded-2xl hover:bg-gray-50 transition-colors"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-orange-100 py-6 bg-gradient-to-b from-white to-orange-50/30">
//             <div className="flex flex-col space-y-2">
//               <button 
//                 onClick={() => handleNavigation('home')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.home')}
//               </button>
//               <button 
//                 onClick={() => handleNavigation('categories')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 Catégories
//               </button>
//               <button 
//                 onClick={() => handleNavigation('vendors')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 Vendeurs
//               </button>
//               <button 
//                 onClick={() => handleNavigation('tenues-femmes')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.women')}
//               </button>
//               <button 
//                 onClick={() => handleNavigation('tenues-hommes')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.men')}
//               </button>
//               <button 
//                 onClick={() => handleNavigation('accessoires')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.accessories')}
//               </button>
//               <button 
//                 onClick={() => handleNavigation('sur-mesure')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.custom')}
//               </button>
//               <button 
//                 onClick={() => handleNavigation('order-tracking')}
//                 className="text-gray-700 hover:text-orange-600 px-4 py-3 text-sm font-bold text-left rounded-xl hover:bg-orange-50 transition-all duration-300"
//               >
//                 {t('nav.tracking')}
//               </button>
//               <button 
//                 onClick={() => onOpenAuth('vendor-register')}
//                 className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 text-sm font-bold text-left rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 mx-2"
//               >
//                 {t('nav.become_vendor')}
//               </button>
//               <div className="flex items-center space-x-6 px-4 py-4 mt-4 border-t border-orange-100">
//                 {isAuthenticated ? (
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
//                         <User className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-bold text-gray-900">{user.firstName}</div>
//                         <div className="text-xs text-gray-600">{getRoleLabel(user.role)}</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <LogOut className="h-5 w-5" />
//                     </button>
//                   </div>
//                 ) : (
//                   <button 
//                     onClick={() => onOpenAuth('login')}
//                     className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
//                   >
//                     <User className="h-6 w-6" />
//                     <span className="text-sm font-bold">{t('nav.account')}</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={handleWishlistClick}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
//                 >
//                   <Heart className="h-6 w-6" />
//                   <span className="text-sm font-bold">{t('nav.favorites')} ({wishlistCount})</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, Settings, Crown, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/InternationalizationContext';
import LanguageSelector from './LanguageSelector';

const Header = ({ onNavigate, onOpenAuth, onSearch }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, switchLanguage, language } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      }
      onNavigate('catalog');
      setSearchTerm('');
    }
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      onNavigate('wishlist');
    } else {
      onOpenAuth('login');
    }
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };
  

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    handleNavigation('home');
  };


  const getRoleColor = (role) => {
    const colors = {
      client: 'from-blue-500 to-indigo-500',
      vendor: 'from-green-500 to-emerald-500',
      support: 'from-purple-500 to-violet-500',
      admin: 'from-red-500 to-pink-500',
      developer: 'from-gray-500 to-slate-500',
      founder: 'from-yellow-500 to-orange-500'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: 'Client',
      vendor: 'Vendeur',
      support: 'Support',
      admin: 'Admin',
      developer: 'Développeur',
      founder: 'Fondateur'
    };
    return labels[role] || role;
  };

  return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Crown className="h-8 w-8 text-orange-600 mr-2" />
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Afrizar
              </span>
            </div>

            {/* Navigation Desktop */}
            {/* <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-orange-600 font-medium transition-colors">Accueil</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Vêtements</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">{t('Accessories')}</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">{t('Vendeurs')}</a>
              
            </nav> */}
<nav className="hidden md:flex space-x-8">
  <button
    onClick={() => handleNavigation('home')}
    className="text-gray-900 hover:text-[#F99834] font-medium transition-colors"
  >
    {t('home')}
  </button>
  <button
    onClick={() => handleNavigation('vetements')}
    className="text-gray-700 hover:text-[#F99834] font-medium transition-colors"
  >
    {t('clothes')}
  </button>
  <button
    onClick={() => handleNavigation('accessoires')}
    className="text-gray-700 hover:text-[#F99834] font-medium transition-colors"
  >
    {t('accessories')}
  </button>
  <button
    onClick={() => handleNavigation('vendeurs')}
    className="text-gray-700 hover:text-[#F99834] font-medium transition-colors"
  >
    {t('vendors')}
  </button>
  <button
    onClick={() => handleNavigation('contact')}
    className="text-gray-700 hover:text-[#F99834] font-medium transition-colors"
  >
    {t('contact')}
  </button>
</nav>

            {/* Recherche et Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button onClick={switchLanguage} className="flex items-center space-x-1 text-gray-700 hover:text-[#F99834] transition-colors">
                <Globe className="h-5 w-5" />
                <span className="font-medium">{language.toUpperCase()}</span>
              </button>

              <button onClick={handleWishlistClick} className="relative text-gray-700 hover:text-red-600 transition-colors">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button className="relative text-gray-700 hover:text-orange-600 transition-colors">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mon Compte</a>
                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mes Commandes</a>
                        <hr className="my-2" />
                        <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => onOpenAuth('login')}
                        className="block w-full text-left px-4 py-2 text-orange-600 hover:bg-gray-100 font-medium"
                      >
                        {t('login')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-orange-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <nav className="space-y-2">
                <a href="#" className="block text-gray-900 font-medium">Accueil</a>
                <a href="#" className="block text-gray-700">{t('categories')}</a>
                <a href="" className="block text-gray-700">{t('accessories')}</a>
                <a href="#" className="block text-gray-700">{t('vendors')}</a>
                
              </nav>
            </div>
          </div>
        )}
      </header>
  );
};

export default Header;