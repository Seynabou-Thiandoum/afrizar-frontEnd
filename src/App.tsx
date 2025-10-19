import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { InternationalizationProvider } from './contexts/InternationalizationContext';
import { PanierProvider } from './contexts/PanierContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Catalog from './components/Catalog';
import CategoryPage from './components/CategoryPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SurMesure from './components/SurMesure';
import VendorDashboard from './components/VendorDashboard';
import AdminDashboard from './components/AdminDashboardNew';
import SupportDashboard from './components/SupportDashboardComplete';
import ClientDashboard from './components/ClientDashboardNew';
import Auth from './components/Auth';
import OrderTracking from './components/OrderTracking';
import Wishlist from './components/Wishlist';
import DeferredOrder from './components/DeferredOrder';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import CategoriesPage from './components/CategoriesPage';
import VendorsPageWrapper from './components/VendorsPageWrapper';
import SimpleApiTest from './components/SimpleApiTest';
import AccessoiresPage from './components/AccessoiresPage';
import VetementsPage from './components/Vetements';
import VendeursPage from './components/Vendeurs';
import VendorProfilePage from './components/VendorProfilePage';
import TendancesPage from './components/TendancesPage';
import ContactPage from './components/ContactPage';
import PanierPage from './components/PanierPage';
import CheckoutPage from './components/CheckoutPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showDeferredOrder, setShowDeferredOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pageParams, setPageParams] = useState(null);

  // Sauvegarder la page actuelle dans localStorage
  React.useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Restaurer la page au chargement
  React.useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    const hash = window.location.hash.substring(1);
    
    if (hash && hash !== 'home') {
      setCurrentPage(hash);
    } else if (savedPage && savedPage !== 'home') {
      setCurrentPage(savedPage);
      // Mettre à jour l'URL
      window.history.replaceState({ page: savedPage }, '', `#${savedPage}`);
    }
  }, []);

  // Gestion du rafraîchissement de page
  React.useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.substring(1);
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage]);
  const handleNavigation = (page, params = null) => {
    setCurrentPage(page);
    setPageParams(params); // Stocker les paramètres
    
    // Mettre à jour l'URL pour permettre le rafraîchissement
    if (page !== 'home') {
      window.history.pushState({ page }, '', `#${page}`);
    } else {
      window.history.pushState({ page }, '', window.location.pathname);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            {/* <Categories onNavigate={setCurrentPage} />
            <FeaturedProducts onNavigate={setCurrentPage} /> */}
          </>
        );
      case 'catalog':
        return <Catalog searchTerm={globalSearchTerm} onSearchTermChange={setGlobalSearchTerm} onNavigate={setCurrentPage} />;
      case 'categories':
        return <CategoriesPage onBack={() => setCurrentPage('home')} />;
      case 'vendors':
        return <VendorsPageWrapper onBack={() => setCurrentPage('home')} />;
      case 'api-test':
        return <SimpleApiTest />;
      case 'tenues-femmes':
        return <CategoryPage category="Tenues Femmes" onBack={() => setCurrentPage('home')} />;
      case 'tenues-hommes':
        return <CategoryPage category="Tenues Hommes" onBack={() => setCurrentPage('home')} />;
      // case 'accessoires':
      //   return <CategoryPage category="Accessoires" onBack={() => setCurrentPage('home')} />;
      case 'sur-mesure':
        return <SurMesure onBack={() => setCurrentPage('home')} />;
      case 'cart':
        return <PanierPage onNavigate={setCurrentPage} />;
      case 'panier':
        return <PanierPage onNavigate={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={setCurrentPage} onShowAuth={() => setShowAuth(true)} />;
      case 'payment':
        return <Checkout onBack={() => setCurrentPage('cart')} />;
      case 'vendor-dashboard':
        return <VendorDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'client-dashboard':
        return <ClientDashboard onNavigate={setCurrentPage} />;
      case 'support-dashboard':
        return <SupportDashboard />;
      case 'order-tracking':
        return <OrderTracking onBack={() => setCurrentPage('home')} />;
      case 'wishlist':
        return <Wishlist onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
      case 'profile':
        return <UserProfile onBack={(page) => setCurrentPage(page || 'home')} />;
      case 'accessoires':
      return <AccessoiresPage onNavigate={setCurrentPage} />;
      case 'vetements':
      return <VetementsPage onNavigate={setCurrentPage} />;
      case 'vendeurs':
      return <VendeursPage onNavigate={setCurrentPage} />;
      case 'vendor-profile':
      return <VendorProfilePage onNavigate={setCurrentPage} vendorId={1} onBack={() => setCurrentPage('vendeurs')} />;
      case 'tendances':
      // Utiliser pageParams au lieu de params
      return <TendancesPage 
        products={pageParams?.products || []} 
        type={pageParams?.type || 'all'} 
        onNavigate={handleNavigation} 
      />;
    
    case 'back':
      // Gérer la navigation retour
      setCurrentPage('vetements'); // ou la page précédente
      return <VetementsPage onNavigate={handleNavigation} />;
      case 'contact':
      return <ContactPage onNavigate={handleNavigation} />;
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Categories onNavigate={setCurrentPage} />
            <FeaturedProducts onNavigate={setCurrentPage} />
          </>
        );
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const openDeferredOrder = (product) => {
    setSelectedProduct(product);
    setShowDeferredOrder(true);
  };

  const handleAddToCart = (productData) => {
    console.log('Ajout au panier:', productData);
    // Logique d'ajout au panier
  };
  return (
    <InternationalizationProvider>
      <AuthProvider>
        <PanierProvider>
          <div className="min-h-screen bg-gray-50">
            {!['cart', 'panier', 'checkout', 'vendor-dashboard', 'client-dashboard', 'admin-dashboard', 'support-dashboard', 'order-tracking'].includes(currentPage) && (
              <Header 
                onNavigate={setCurrentPage}
                onSearch={setGlobalSearchTerm}
                onOpenAuth={openAuth}
              />
            )}
            
            <main>
              {renderPage()}
            </main>
            
            {/* {currentPage === 'home' && <Footer />}
            {currentPage === 'vetements' && <Footer />} */}
            <Footer onNavigate={handleNavigation} />

            {/* Auth Modal */}
            {showAuth && (
              <Auth 
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
              />
            )}

            {/* Deferred Order Modal */}
            {showDeferredOrder && (
              <DeferredOrder
                product={selectedProduct}
                onClose={() => setShowDeferredOrder(false)}
                onAddToCart={handleAddToCart}
              />
            )}

          </div>
        </PanierProvider>
      </AuthProvider>
    </InternationalizationProvider>
  );
}

export default App;