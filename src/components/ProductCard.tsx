import React from 'react';
import { Star, Heart, Eye, ShoppingCart, Clock, MapPin } from 'lucide-react';

const ProductCard = ({ product, onView, onToggleWishlist, isWishlisted }) => {
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
          product.availability === 'in-stock' 
            ? 'bg-green-100 text-green-800' 
            : product.availability === 'limited'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-orange-100 text-orange-800'
        }`}>
          {product.status}
        </div>

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              isWishlisted 
                ? 'bg-red-600 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(product);
            }}
            className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-orange-600 hover:text-white transition-colors"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{product.vendor}</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Livraison: {product.delivery}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;