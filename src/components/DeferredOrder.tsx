import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Info
} from 'lucide-react';

const DeferredOrder = ({ product, onClose, onAddToCart }) => {
  const [selectedDelay, setSelectedDelay] = useState('7-10');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#FF6B35');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');

  const delayOptions = [
    {
      value: '7-10',
      label: '7-10 jours',
      price: 0,
      description: 'Délai standard de production',
      popular: true
    },
    {
      value: '5-7',
      label: '5-7 jours',
      price: 5000,
      description: 'Production prioritaire',
      popular: false
    },
    {
      value: '3-5',
      label: '3-5 jours',
      price: 10000,
      description: 'Production express',
      popular: false
    }
  ];

  const calculateTotal = () => {
    const basePrice = product?.price || 0;
    const delayPrice = delayOptions.find(d => d.value === selectedDelay)?.price || 0;
    return (basePrice + delayPrice) * quantity;
  };

  const handleOrder = () => {
    const orderData = {
      ...product,
      quantity,
      selectedColor,
      selectedSize,
      selectedDelay,
      totalPrice: calculateTotal(),
      orderType: 'deferred'
    };
    onAddToCart(orderData);
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-orange-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                    Commande Différée
                  </h2>
                  <p className="text-gray-600 font-medium">Produit actuellement hors stock</p>
                </div>
              </div>
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-2xl text-sm font-bold">
                <Clock className="h-4 w-4 inline mr-2" />
                Sur Commande
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Info */}
              <div>
                <div className="relative mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-3xl shadow-xl"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-2xl text-sm font-bold">
                    Hors Stock
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews} avis)</span>
                  </div>
                  <div className="text-gray-600">
                    Par {product.vendor}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Comment ça marche ?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Vous commandez maintenant avec un délai de production</li>
                        <li>• L'artisan commence la création de votre pièce</li>
                        <li>• Vous recevez des mises à jour régulières</li>
                        <li>• Livraison dès que votre commande est prête</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Configuration */}
              <div className="space-y-6">
                {/* Delay Selection */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Choisir le délai de production</h4>
                  <div className="space-y-3">
                    {delayOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                          selectedDelay === option.value
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            value={option.value}
                            checked={selectedDelay === option.value}
                            onChange={(e) => setSelectedDelay(e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900">{option.label}</span>
                              {option.popular && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                  Populaire
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {option.price > 0 ? (
                            <div className="font-bold text-orange-600">+{option.price.toLocaleString()} FCFA</div>
                          ) : (
                            <div className="font-bold text-green-600">Gratuit</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Couleur</h4>
                  <div className="flex space-x-3">
                    {product.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-2xl border-4 transition-all ${
                          selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Taille</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 rounded-2xl font-bold transition-all ${
                          selectedSize === size
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-orange-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Quantité</h4>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix de base</span>
                      <span>{(product.price * quantity).toLocaleString()} FCFA</span>
                    </div>
                    {delayOptions.find(d => d.value === selectedDelay)?.price > 0 && (
                      <div className="flex justify-between">
                        <span>Supplément délai</span>
                        <span>+{(delayOptions.find(d => d.value === selectedDelay)?.price * quantity).toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">{calculateTotal().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleOrder}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>Commander Maintenant</span>
                  </button>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Paiement sécurisé • Satisfaction garantie</span>
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

export default DeferredOrder;