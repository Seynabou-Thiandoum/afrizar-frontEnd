import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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
import AdminDashboard from './components/AdminDashboard';
import SupportDashboard from './components/SupportDashboard';
import Auth from './components/Auth';
import OrderTracking from './components/OrderTracking';
import Wishlist from './components/Wishlist';
import DeferredOrder from './components/DeferredOrder';
import VendorProductForm from './components/VendorProductForm';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showDeferredOrder, setShowDeferredOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Categories onNavigate={setCurrentPage} />
            <FeaturedProducts onNavigate={setCurrentPage} />
          </>
        );
      case 'catalog':
        return <Catalog searchTerm={globalSearchTerm} onSearchTermChange={setGlobalSearchTerm} onNavigate={setCurrentPage} />;
      case 'tenues-femmes':
        return <CategoryPage category="Tenues Femmes" onBack={() => setCurrentPage('home')} />;
      case 'tenues-hommes':
        return <CategoryPage category="Tenues Hommes" onBack={() => setCurrentPage('home')} />;
      case 'accessoires':
        return <CategoryPage category="Accessoires" onBack={() => setCurrentPage('home')} />;
      case 'sur-mesure':
        return <SurMesure onBack={() => setCurrentPage('home')} />;
      case 'cart':
        return <Cart onClose={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
      case 'checkout':
        return <Checkout onBack={() => setCurrentPage('cart')} />;
      case 'payment':
        return <Checkout onBack={() => setCurrentPage('cart')} />;
      case 'vendor-dashboard':
        return <VendorDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'support-dashboard':
        return <SupportDashboard />;
      case 'order-tracking':
        return <OrderTracking onBack={() => setCurrentPage('home')} />;
      case 'wishlist':
        return <Wishlist onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
      case 'profile':
        return <UserProfile onBack={(page) => setCurrentPage(page || 'home')} />;
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
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {!['cart', 'checkout', 'vendor-dashboard', 'admin-dashboard', 'support-dashboard', 'order-tracking'].includes(currentPage) && (
        {!['cart', 'checkout', 'vendor-dashboard', 'client-dashboard', 'admin-dashboard', 'support-dashboard', 'order-tracking'].includes(currentPage) && (
          <Header 
            onNavigate={setCurrentPage}
            onSearch={setGlobalSearchTerm}
            onOpenAuth={openAuth}
          />
        )}
        
        <main>
          {renderPage()}
        </main>
        
        {currentPage === 'home' && <Footer />}

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

        {/* Vendor Product Form */}
        {showProductForm && (
          <VendorProductForm
            onClose={() => setShowProductForm(false)}
            onSave={(productData) => {
              console.log('Nouveau produit:', productData);
              setShowProductForm(false);
            }}
          />
        )}
      </div>
    )
    }
    </AuthProvider>
  );
}

export default App;