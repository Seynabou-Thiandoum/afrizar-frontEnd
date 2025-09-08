import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  Shield, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Banknote
} from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const InternationalPayment = ({ amount, onPaymentSelect, selectedMethod }) => {
  const { country, currency, formatPrice, getShippingZone } = useI18n();
  const [loading, setLoading] = useState(false);

  const getPaymentMethods = () => {
    const zone = getShippingZone();
    const methods = [];

    // Méthodes communes à tous
    methods.push({
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement international sécurisé',
      icon: Globe,
      color: 'from-blue-600 to-indigo-600',
      available: true,
      fees: 3.5,
      currencies: ['USD', 'CAD', 'EUR', 'XOF']
    });

    methods.push({
      id: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      color: 'from-gray-600 to-gray-700',
      available: true,
      fees: 2.9,
      currencies: ['USD', 'CAD', 'EUR', 'XOF']
    });

    // Méthodes spécifiques à l'Afrique
    if (zone === 'senegal' || zone === 'africa') {
      methods.push({
        id: 'orange-money',
        name: 'Orange Money',
        description: 'Paiement mobile sécurisé',
        icon: Smartphone,
        color: 'from-orange-500 to-orange-600',
        available: true,
        fees: 1.5,
        currencies: ['XOF']
      });

      methods.push({
        id: 'wave',
        name: 'Wave',
        description: 'Paiement mobile rapide',
        icon: Smartphone,
        color: 'from-blue-500 to-blue-600',
        available: true,
        fees: 1.0,
        currencies: ['XOF']
      });

      methods.push({
        id: 'mtn-money',
        name: 'MTN Mobile Money',
        description: 'Paiement mobile MTN',
        icon: Smartphone,
        color: 'from-yellow-500 to-yellow-600',
        available: zone === 'africa',
        fees: 1.5,
        currencies: ['XOF']
      });
    }

    // Méthodes spécifiques USA/Canada
    if (zone === 'international') {
      methods.push({
        id: 'apple-pay',
        name: 'Apple Pay',
        description: 'Paiement rapide et sécurisé',
        icon: Smartphone,
        color: 'from-gray-800 to-black',
        available: ['US', 'CA'].includes(country),
        fees: 2.9,
        currencies: ['USD', 'CAD']
      });

      methods.push({
        id: 'google-pay',
        name: 'Google Pay',
        description: 'Paiement en un clic',
        icon: Smartphone,
        color: 'from-green-500 to-green-600',
        available: true,
        fees: 2.9,
        currencies: ['USD', 'CAD', 'EUR']
      });

      if (country === 'CA') {
        methods.push({
          id: 'interac',
          name: 'Interac e-Transfer',
          description: 'Virement bancaire canadien',
          icon: Banknote,
          color: 'from-red-600 to-red-700',
          available: true,
          fees: 1.5,
          currencies: ['CAD']
        });
      }
    }

    return methods.filter(method => 
      method.available && method.currencies.includes(currency)
    );
  };

  const paymentMethods = getPaymentMethods();

  const calculateFees = (method) => {
    return (amount * method.fees) / 100;
  };

  const calculateTotal = (method) => {
    return amount + calculateFees(method);
  };

  const handlePaymentSelect = (method) => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentSelect({
        method: method.id,
        amount: calculateTotal(method),
        fees: calculateFees(method),
        currency
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choisir le mode de paiement</h3>
        <p className="text-gray-600">Sélectionnez votre méthode de paiement préférée</p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const fees = calculateFees(method);
          const total = calculateTotal(method);
          
          return (
            <div
              key={method.id}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => !loading && onPaymentSelect && onPaymentSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 bg-gradient-to-r ${method.color} rounded-2xl text-white shadow-lg`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{method.name}</h4>
                    <p className="text-gray-600">{method.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center space-x-1 text-green-600">
                        <Shield className="h-4 w-4" />
                        <span>Sécurisé</span>
                      </div>
                      <div className="text-gray-500">
                        Frais: {method.fees}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </div>
                  {fees > 0 && (
                    <div className="text-sm text-gray-500">
                      +{formatPrice(fees)} frais
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Montant: {formatPrice(amount)}
                  </div>
                </div>
              </div>

              {selectedMethod === method.id && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <button
                    onClick={() => handlePaymentSelect(method)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Traitement...</span>
                      </div>
                    ) : (
                      `Payer ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Paiement 100% sécurisé</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Cryptage SSL 256 bits</li>
              <li>• Conformité PCI DSS</li>
              <li>• Protection contre la fraude</li>
              <li>• Remboursement garanti</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Supported Currencies */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Devises acceptées</p>
        <div className="flex items-center justify-center space-x-4">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">FCFA</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">USD $</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">CAD $</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">EUR €</span>
        </div>
      </div>
    </div>
  );
};

export default InternationalPayment;