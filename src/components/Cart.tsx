import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Truck,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300',
      vendor: 'Atelier Fatou',
      selectedColor: '#FF6B35',
      selectedSize: 'M',
      quantity: 1,
      weight: 0.8,
      delivery: '3-5 jours'
    },
    {
      id: 3,
      name: 'Collier Perles Traditionnelles',
      price: 12000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=300',
      vendor: 'Bijoux Khadija',
      selectedColor: '#FF4500',
      selectedSize: 'Unique',
      quantity: 2,
      weight: 0.1,
      delivery: '2-3 jours'
    }
  ]);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [destination, setDestination] = useState('senegal');

  const shippingOptions = {
    senegal: {
      express: { price: 5000, days: '1-2 jours', description: 'Livraison express Dakar' },
      standard: { price: 2000, days: '3-5 jours', description: 'Livraison standard nationale' },
      economic: { price: 1000, days: '5-7 jours', description: 'Livraison économique' }
    },
    africa: {
      express: { price: 15000, days: '3-5 jours', description: 'Express Afrique de l\'Ouest' },
      standard: { price: 10000, days: '7-10 jours', description: 'Standard Afrique' },
      economic: { price: 7000, days: '10-15 jours', description: 'Économique Afrique' }
    },
    international: {
      express: { price: 25000, days: '5-7 jours', description: 'Express International' },
      standard: { price: 18000, days: '10-15 jours', description: 'Standard International' },
      economic: { price: 12000, days: '15-25 jours', description: 'Économique International' }
    }
  };

  const calculateCommission = (price) => {
    if (price < 10000) return price * 0.1;
    if (price < 30000) return price * 0.08;
    return price * 0.06;
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCommission = cartItems.reduce((sum, item) => 
    sum + (calculateCommission(item.price) * item.quantity), 0
  );
  const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  const shippingCost = shippingOptions[destination][shippingMethod].price;
  const total = subtotal + totalCommission + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">Découvrez nos magnifiques créations sénégalaises</p>
          <button
            onClick={onClose}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
              <p className="text-gray-600">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.vendor}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Couleur: <span 
                            className="inline-block w-4 h-4 rounded-full ml-1 border border-gray-300"
                            style={{ backgroundColor: item.selectedColor }}
                          ></span></span>
                          <span>Taille: {item.selectedSize}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>Livraison: {item.delivery}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price, item.currency)} × {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Résumé de commande</h3>
              
              {/* Destination */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="senegal">Sénégal</option>
                  <option value="africa">Afrique de l'Ouest</option>
                  <option value="international">International</option>
                </select>
              </div>

              {/* Shipping Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Mode de livraison</label>
                <div className="space-y-2">
                  {Object.entries(shippingOptions[destination]).map(([key, option]) => (
                    <label key={key} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        value={key}
                        checked={shippingMethod === key}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 capitalize">{key}</span>
                          <span className="font-bold text-gray-900">{formatPrice(option.price, 'FCFA')}</span>
                        </div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                        <div className="text-xs text-gray-500">{option.days}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, 'FCFA')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Commission plateforme</span>
                  <span>{formatPrice(totalCommission, 'FCFA')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison ({totalWeight.toFixed(1)} kg)</span>
                  <span>{formatPrice(shippingCost, 'FCFA')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total, 'FCFA')}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Livraison avec suivi</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Support WhatsApp 24/7</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => onNavigate('checkout')}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Procéder au paiement</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continuer les achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;