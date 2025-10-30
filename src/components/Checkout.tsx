import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  CheckCircle,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';
import InternationalPayment from './InternationalPayment';
import InternationalShipping from './InternationalShipping';
import SelecteurModePaiement from './SelecteurModePaiement';
import { ModePaiement } from '../services/modePaiementService';
import { useI18n } from '../contexts/InternationalizationContext';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const Checkout = ({ onBack }) => {
  const { isAuthenticated } = useAuth();
  const { formatPrice, country, getShippingZone } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Info
    address: '',
    city: '',
    country: 'SN',
    postalCode: '',
    
    // Payment
    paymentMethod: 'orange-money'
  });

  const [paymentMethods] = useState([
    {
      id: 'orange-money',
      name: 'Orange Money',
      description: 'Paiement mobile sécurisé',
      icon: Smartphone,
      color: 'from-orange-500 to-orange-600',
      available: true
    },
    {
      id: 'wave',
      name: 'Wave',
      description: 'Paiement mobile rapide',
      icon: Smartphone,
      color: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement international sécurisé',
      icon: Globe,
      color: 'from-blue-600 to-indigo-600',
      available: true
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      color: 'from-gray-600 to-gray-700',
      available: true
    }
  ]);

  const cartTotal = 69000; // Example total from cart

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour passer une commande',
        confirmButtonText: 'Retour au panier',
        showCancelButton: true,
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          onBack(); // Retour au panier
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process payment
      console.log('Processing payment...', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
            <p className="text-gray-600">Étape {step} sur 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepNumber 
                    ? 'bg-orange-600 border-orange-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step > stepNumber ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepNumber ? 'bg-orange-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
              Informations
            </span>
            <span className={step >= 2 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
              Livraison
            </span>
            <span className={step >= 3 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
              Paiement
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Adresse de livraison</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                        <select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        >
                          <option value="SN">Sénégal</option>
                          <option value="FR">France</option>
                          <option value="US">États-Unis</option>
                          <option value="CA">Canada</option>
                          <option value="CI">Côte d'Ivoire</option>
                          <option value="ML">Mali</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Méthode de paiement</h2>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <div className="ml-4 flex items-center space-x-3 flex-1">
                            <div className={`p-3 bg-gradient-to-r ${method.color} rounded-2xl text-white shadow-lg`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                          {method.available && (
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">✓ Disponible</div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <div className="font-semibold mb-1">Paiement sécurisé</div>
                        <div>Vos informations de paiement sont protégées par un cryptage SSL 256 bits.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Retour
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  {step === 3 ? 'Finaliser la commande' : 'Continuer'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Product"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">Grand Boubou Brodé Premium</div>
                    <div className="text-xs text-gray-600">M, Orange × 1</div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(45000, 'FCFA')}</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Product"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">Collier Perles Traditionnelles</div>
                    <div className="text-xs text-gray-600">Unique × 2</div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(24000, 'FCFA')}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(69000, 'FCFA')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Commission</span>
                  <span>{formatPrice(5520, 'FCFA')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{formatPrice(2000, 'FCFA')}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(76520, 'FCFA')}</span>
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

export default Checkout;