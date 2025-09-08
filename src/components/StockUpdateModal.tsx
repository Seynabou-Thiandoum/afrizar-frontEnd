import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Save,
  AlertCircle
} from 'lucide-react';

const StockUpdateModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentStock: product.stock,
    newStock: product.stock,
    reason: '',
    notifyCustomers: true,
    autoRestock: false,
    restockThreshold: 5
  });

  const [errors, setErrors] = useState({});

  const reasons = [
    'Réapprovisionnement normal',
    'Nouvelle production terminée',
    'Correction d\'inventaire',
    'Retour de commande annulée',
    'Stock de sécurité',
    'Promotion spéciale',
    'Autre'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleQuickUpdate = (amount) => {
    const newStock = Math.max(0, formData.newStock + amount);
    setFormData(prev => ({ ...prev, newStock }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.newStock < 0) {
      newErrors.newStock = 'Le stock ne peut pas être négatif';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Veuillez indiquer la raison de la modification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        productId: product.id,
        previousStock: formData.currentStock,
        newStock: formData.newStock,
        reason: formData.reason,
        notifyCustomers: formData.notifyCustomers,
        autoRestock: formData.autoRestock,
        restockThreshold: formData.restockThreshold,
        timestamp: new Date().toISOString()
      });
    }
  };

  const stockDifference = formData.newStock - formData.currentStock;
  const isIncrease = stockDifference > 0;
  const isDecrease = stockDifference < 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Gestion du Stock
                </h2>
                <p className="text-gray-600 font-medium">{product.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Produit info */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>Stock actuel: {formData.currentStock}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{product.rating} ({product.orders} ventes)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mise à jour du stock */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Nouveau stock</h4>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={() => handleQuickUpdate(-10)}
                    className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-colors"
                  >
                    <Minus className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickUpdate(-1)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <div className="text-center">
                    <input
                      type="number"
                      value={formData.newStock}
                      onChange={(e) => handleInputChange('newStock', parseInt(e.target.value) || 0)}
                      className={`w-24 text-center text-3xl font-bold border-2 rounded-2xl py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.newStock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="0"
                    />
                    <div className="text-sm text-gray-600 mt-1">unités</div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleQuickUpdate(1)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickUpdate(10)}
                    className="p-3 bg-green-100 text-green-600 rounded-2xl hover:bg-green-200 transition-colors"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </div>

                {errors.newStock && (
                  <div className="flex items-center space-x-1 mb-4 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.newStock}</span>
                  </div>
                )}

                {/* Indicateur de changement */}
                {stockDifference !== 0 && (
                  <div className={`p-4 rounded-2xl mb-4 ${
                    isIncrease ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {isIncrease ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncrease ? '+' : ''}{stockDifference} unité{Math.abs(stockDifference) > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${isIncrease ? 'text-green-700' : 'text-red-700'}`}>
                      {isIncrease 
                        ? 'Augmentation du stock - Les clients en liste d\'attente seront notifiés'
                        : 'Diminution du stock - Vérifiez que vous avez suffisamment d\'unités'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Raison et options */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Raison de la modification</label>
                    <select
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.reason ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez une raison</option>
                      {reasons.map((reason) => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                    {errors.reason && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.reason}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.notifyCustomers}
                        onChange={(e) => handleInputChange('notifyCustomers', e.target.checked)}
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Notifier les clients en liste d'attente (si stock augmente)
                      </span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.autoRestock}
                        onChange={(e) => handleInputChange('autoRestock', e.target.checked)}
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Activer le réapprovisionnement automatique
                      </span>
                    </label>

                    {formData.autoRestock && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seuil de réapprovisionnement
                        </label>
                        <input
                          type="number"
                          value={formData.restockThreshold}
                          onChange={(e) => handleInputChange('restockThreshold', parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Alerte quand le stock descend sous ce seuil
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Mettre à Jour le Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateModal;