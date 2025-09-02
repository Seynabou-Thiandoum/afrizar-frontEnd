import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingCart, Clock, MapPin } from 'lucide-react';
import ProductModal from './ProductModal';

const FeaturedProducts = ({ onNavigate }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  const products = [
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      originalPrice: 55000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.8,
      reviews: 24,
      status: 'En stock',
      category: 'Tenues Femmes',
      description: 'Magnifique grand boubou avec broderies dorées fait main. Tissu wax premium importé de Côte d\'Ivoire.',
      colors: ['#FF6B35', '#004E89', '#F7C52D'],
      sizes: ['S', 'M', 'L', 'XL'],
      vendor: 'Atelier Fatou',
      delivery: '3-5 jours',
      location: 'Dakar, Sénégal'
    },
    {
      id: 2,
      name: 'Ensemble Bazin Riche',
      price: 35000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.9,
      reviews: 18,
      status: 'Sur commande',
      category: 'Tenues Femmes',
      description: 'Ensemble deux pièces en bazin riche avec motifs géométriques traditionnels.',
      colors: ['#8B5A2B', '#2E8B57', '#B22222'],
      sizes: ['S', 'M', 'L'],
      vendor: 'Couture Aminata',
      delivery: '7-10 jours',
      location: 'Thiès, Sénégal'
    },
    {
      id: 3,
      name: 'Collier Perles Traditionnelles',
      price: 12000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.7,
      reviews: 32,
      status: 'En stock',
      category: 'Accessoires',
      description: 'Collier artisanal en perles de verre colorées selon la tradition sénégalaise.',
      colors: ['#FF4500', '#32CD32', '#4169E1'],
      sizes: ['Unique'],
      vendor: 'Bijoux Khadija',
      delivery: '2-3 jours',
      location: 'Saint-Louis, Sénégal'
    },
    {
      id: 4,
      name: 'Kaftan Homme Deluxe',
      price: 38000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.6,
      reviews: 15,
      status: 'En stock',
      category: 'Tenues Hommes',
      description: 'Kaftan élégant pour homme avec broderies sophistiquées et finitions premium.',
      colors: ['#8B4513', '#000080', '#228B22'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      vendor: 'Maître Ibrahima',
      delivery: '3-5 jours',
      location: 'Kaolack, Sénégal'
    }
  ];

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent to-purple-600 rounded-full"></div>
          <Star className="h-6 w-6 text-purple-600 mx-4 animate-pulse fill-current" />
          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-purple-600 rounded-full"></div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
          Produits Vedettes
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Découvrez notre sélection de <span className="text-purple-600 font-semibold">créations les plus appréciées</span> par notre communauté internationale.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-6 hover:rotate-1 border border-white/50"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            
            <div className="relative overflow-hidden rounded-t-3xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 object-cover group-hover:scale-125 transition-transform duration-700"
              />
              
              {/* Status Badge */}
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-2xl text-xs font-bold backdrop-blur-md ${
                product.status === 'En stock' 
                  ? 'bg-green-500/90 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-orange-500/90 text-white shadow-lg shadow-orange-500/25'
              } transform group-hover:scale-110 transition-transform duration-300`}>
                {product.status}
              </div>

              {/* Discount Badge */}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-red-500/25 transform group-hover:scale-110 transition-transform duration-300">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </div>
              )}
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Quick Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-4">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg ${
                    wishlist.has(product.id) 
                      ? 'bg-red-500 text-white shadow-red-500/25' 
                      : 'bg-white/95 backdrop-blur-md text-gray-700 hover:bg-red-500 hover:text-white hover:shadow-red-500/25'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-orange-500/25"
                >
                  <Eye className="h-6 w-6" />
                </button>
                <button className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-gray-700 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-green-500/25">
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 relative z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-700 font-bold">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
              </div>
              
              <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-gray-700 font-medium">{product.vendor}</span>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700">Livraison: {product.delivery}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-medium">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
                  <span className="flex items-center">
                    Ajouter
                    <ShoppingCart className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </div>
              
              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 relative z-10">
        <button 
          onClick={() => onNavigate('catalog')}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <span className="relative flex items-center">
            Voir Tout le Catalogue
            <Star className="ml-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500 fill-current" />
          </span>
        </button>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;