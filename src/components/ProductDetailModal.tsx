import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Clock, 
  Weight,
  Palette,
  Ruler,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  ShoppingCart
} from 'lucide-react';

const ProductDetailModal = ({ product, onClose, onEdit }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mockAnalytics = {
    views: 1247,
    favorites: 89,
    cartAdds: 156,
    purchases: 24,
    conversionRate: 15.4,
    revenue: product.price * 24
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-orange-100">
              <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Détails du Produit
                </h2>
                <p className="text-gray-600 font-medium">Informations complètes et statistiques</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Images et infos principales */}
              <div className="space-y-6">
                {/* Image principale */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-3xl shadow-xl"
                  />
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-2xl text-sm font-bold ${getStatusColor(product.status)}`}>
                    {product.status === 'active' ? 'Actif' : product.status === 'out-of-stock' ? 'Rupture' : 'Brouillon'}
                  </div>
                </div>

                {/* Informations de base */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</div>
                          <div className="text-sm text-green-800">Prix de vente</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{product.stock}</div>
                          <div className="text-sm text-blue-800">En stock</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <Star className="h-8 w-8 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{product.rating}</div>
                          <div className="text-sm text-yellow-800">Note moyenne</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{product.orders}</div>
                          <div className="text-sm text-purple-800">Ventes</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Détails techniques */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <Weight className="h-4 w-4" />
                        <span>Poids</span>
                      </span>
                      <span className="font-semibold">0.8 kg</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Délai de production</span>
                      </span>
                      <span className="font-semibold">3-5 jours</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Localisation</span>
                      </span>
                      <span className="font-semibold">Dakar, Sénégal</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le</span>
                      </span>
                      <span className="font-semibold">15 Jan 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques et options */}
              <div className="space-y-6">
                {/* Statistiques de performance */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <span>Statistiques de Performance</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{mockAnalytics.views}</div>
                      <div className="text-sm text-blue-800">Vues</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-2xl">
                      <div className="text-2xl font-bold text-red-600">{mockAnalytics.favorites}</div>
                      <div className="text-sm text-red-800">Favoris</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-2xl">
                      <div className="text-2xl font-bold text-green-600">{mockAnalytics.cartAdds}</div>
                      <div className="text-sm text-green-800">Ajouts panier</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-2xl">
                      <div className="text-2xl font-bold text-purple-600">{mockAnalytics.conversionRate}%</div>
                      <div className="text-sm text-purple-800">Conversion</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                    <div className="text-center">
                      <div className="text-3xl font-black mb-2">{formatPrice(mockAnalytics.revenue)}</div>
                      <div className="text-green-100">Chiffre d'affaires généré</div>
                    </div>
                  </div>
                </div>

                {/* Couleurs et tailles */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Palette className="h-6 w-6 text-purple-600" />
                    <span>Variantes</span>
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Couleurs disponibles</label>
                      <div className="flex space-x-3">
                        {['#FF6B35', '#004E89', '#F7C52D'].map((color, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-2xl border-2 border-gray-300 shadow-lg"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Tailles disponibles</label>
                      <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                          <span
                            key={size}
                            className="px-4 py-2 bg-gray-100 rounded-2xl text-sm font-medium border border-gray-200"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Actions</h4>
                  
                  <div className="space-y-3">
                    <button
                      onClick={onEdit}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-6 w-6" />
                      <span>Modifier le produit</span>
                    </button>
                    
                    <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Dupliquer</span>
                    </button>
                    
                    <button 
                      onClick={() => console.log('Supprimer produit:', product.id)}
                      className="w-full border-2 border-red-300 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;