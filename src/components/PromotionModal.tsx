import React, { useState } from 'react';
import { 
  X, 
  Percent, 
  Calendar, 
  Package, 
  DollarSign, 
  Clock,
  Star,
  Target,
  Save,
  AlertCircle
} from 'lucide-react';

const PromotionModal = ({ onClose, onSave, products }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage', // percentage, fixed, buy-one-get-one
    value: '',
    startDate: '',
    endDate: '',
    selectedProducts: [],
    minQuantity: 1,
    maxUses: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const promotionTypes = [
    {
      value: 'percentage',
      label: 'Pourcentage de réduction',
      description: 'Ex: 20% de réduction',
      icon: Percent
    },
    {
      value: 'fixed',
      label: 'Montant fixe',
      description: 'Ex: -5000 FCFA',
      icon: DollarSign
    },
    {
      value: 'buy-one-get-one',
      label: 'Achetez 1, obtenez 1',
      description: 'Offre spéciale quantité',
      icon: Package
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.value) newErrors.value = 'Valeur requise';
    if (!formData.startDate) newErrors.startDate = 'Date de début requise';
    if (!formData.endDate) newErrors.endDate = 'Date de fin requise';
    if (formData.selectedProducts.length === 0) newErrors.products = 'Sélectionnez au moins un produit';

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const calculateDiscountPreview = (product) => {
    if (!formData.value) return product.price;
    
    if (formData.type === 'percentage') {
      return product.price * (1 - parseFloat(formData.value) / 100);
    } else if (formData.type === 'fixed') {
      return Math.max(0, product.price - parseFloat(formData.value));
    }
    return product.price;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-orange-100">
              <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Créer une Promotion
                </h2>
                <p className="text-gray-600 font-medium">Boostez vos ventes avec une offre spéciale</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Informations de base */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de la promotion</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la promotion</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Soldes d'hiver 2025"
                    />
                    {errors.name && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez votre promotion..."
                    />
                    {errors.description && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Type de promotion */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Type de promotion</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {promotionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                          formData.type === type.value
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                          formData.type === type.value
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-center mb-2">{type.label}</h4>
                        <p className="text-sm text-gray-600 text-center">{type.description}</p>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'percentage' ? 'Pourcentage de réduction (%)' : 
                     formData.type === 'fixed' ? 'Montant de réduction (FCFA)' : 
                     'Quantité gratuite'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.value ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.type === 'percentage' ? '20' : formData.type === 'fixed' ? '5000' : '1'}
                  />
                  {errors.value && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.value}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Période et conditions */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Période et conditions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.startDate}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.endDate}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantité minimum</label>
                    <input
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => handleInputChange('minQuantity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utilisations max (optionnel)</label>
                    <input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => handleInputChange('maxUses', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Illimité"
                    />
                  </div>
                </div>
              </div>

              {/* Sélection des produits */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Produits concernés</h3>
                
                {errors.products && (
                  <div className="flex items-center space-x-1 mb-4 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.products}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const isSelected = formData.selectedProducts.includes(product.id);
                    const discountedPrice = calculateDiscountPreview(product);
                    
                    return (
                      <label
                        key={product.id}
                        className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(product.id)}
                          className="text-orange-600 focus:ring-orange-500 mr-4"
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                            {formData.value && isSelected && (
                              <span className="text-lg font-bold text-green-600">
                                → {formatPrice(discountedPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                            <span className="text-sm text-gray-500">• {product.orders} ventes</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Aperçu de la promotion */}
              {formData.selectedProducts.length > 0 && formData.value && (
                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Aperçu de la promotion
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom :</strong> {formData.name || 'Nom de la promotion'}</p>
                    <p><strong>Type :</strong> {promotionTypes.find(t => t.value === formData.type)?.label}</p>
                    <p><strong>Réduction :</strong> {formData.value}{formData.type === 'percentage' ? '%' : ' FCFA'}</p>
                    <p><strong>Produits :</strong> {formData.selectedProducts.length} sélectionné{formData.selectedProducts.length > 1 ? 's' : ''}</p>
                    <p><strong>Période :</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString('fr-FR') : '...'} - {formData.endDate ? new Date(formData.endDate).toLocaleDateString('fr-FR') : '...'}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Save className="h-6 w-6" />
                  <span>Créer la Promotion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;