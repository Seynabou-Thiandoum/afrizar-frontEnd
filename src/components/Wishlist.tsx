import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Eye, 
  Trash2,
  MapPin,
  Clock
} from 'lucide-react';

const Wishlist = ({ onBack, onNavigate }) => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      originalPrice: 55000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 24,
      status: 'En stock',
      category: 'Tenues Femmes',
      vendor: 'Atelier Fatou',
      delivery: '3-5 jours',
      addedDate: '2025-01-10'
    },
    {
      id: 3,
      name: 'Collier Perles Traditionnelles',
      price: 12000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 32,
      status: 'En stock',
      category: 'Accessoires',
      vendor: 'Bijoux Khadija',
      delivery: '2-3 jours',
      addedDate: '2025-01-12'
    },
    {
      id: 5,
      name: 'Sac à Main Cuir Artisanal',
      price: 25000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 28,
      status: 'Stock limité',
      category: 'Accessoires',
      vendor: 'Maroquinerie Salam',
      delivery: '3-5 jours',
      addedDate: '2025-01-14'
    },
    {
      id: 7,
      name: 'Caftan Élégant',
      price: 42000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 16,
      status: 'En stock',
      category: 'Tenues Femmes',
      vendor: 'Couture Royale',
      delivery: '3-5 jours',
      addedDate: '2025-01-13'
    },
    {
      id: 8,
      name: 'Grand Boubou Homme Traditionnel',
      price: 48000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 22,
      status: 'En stock',
      category: 'Tenues Hommes',
      vendor: 'Atelier Traditionnel',
      delivery: '4-6 jours',
      addedDate: '2025-01-11'
    }
  ]);

  const removeFromWishlist = (productId) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
  };

  const addToCart = (product) => {
    console.log('Ajout au panier depuis favoris:', product);
    // Logique d'ajout au panier
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                Mes Favoris
              </h1>
              <p className="text-gray-600 font-medium">{wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} dans vos favoris</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun favori pour le moment</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos magnifiques créations et ajoutez vos coups de cœur à vos favoris
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-red-500/25 transform hover:scale-105"
            >
              Explorer le Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'En stock' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'Stock limité'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {item.status}
                  </div>

                  {/* Discount Badge */}
                  {item.originalPrice && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onNavigate('product-detail', { productId: item.id })}
                      className="p-3 bg-white/90 rounded-2xl text-gray-700 hover:bg-orange-600 hover:text-white transition-colors shadow-lg"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{item.rating}</span>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.vendor}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Livraison: {item.delivery}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Ajouté le {formatDate(item.addedDate)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice, item.currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-bold flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Ajouter</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  wishlistItems.forEach(item => addToCart(item));
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
              >
                Tout Ajouter au Panier
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                Continuer les Achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;