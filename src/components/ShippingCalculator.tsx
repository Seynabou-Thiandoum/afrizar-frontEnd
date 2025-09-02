import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Calculator } from 'lucide-react';

const ShippingCalculator = ({ weight, destination, shippingMethod, onShippingCalculated }) => {
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState('');

  const shippingRates = {
    senegal: {
      express: { baseRate: 2000, perKg: 1000, days: '1-2 jours' },
      standard: { baseRate: 1000, perKg: 500, days: '3-5 jours' },
      economic: { baseRate: 500, perKg: 300, days: '5-7 jours' }
    },
    africa: {
      express: { baseRate: 8000, perKg: 3000, days: '3-5 jours' },
      standard: { baseRate: 5000, perKg: 2000, days: '7-10 jours' },
      economic: { baseRate: 3000, perKg: 1500, days: '10-15 jours' }
    },
    international: {
      express: { baseRate: 15000, perKg: 5000, days: '5-7 jours' },
      standard: { baseRate: 10000, perKg: 3000, days: '10-15 jours' },
      economic: { baseRate: 6000, perKg: 2000, days: '15-25 jours' }
    }
  };

  const calculateShipping = () => {
    if (!weight || !destination || !shippingMethod) return;

    const rates = shippingRates[destination]?.[shippingMethod];
    if (!rates) return;

    const cost = rates.baseRate + (weight * rates.perKg);
    const days = rates.days;

    setShippingCost(cost);
    setEstimatedDays(days);

    if (onShippingCalculated) {
      onShippingCalculated({
        cost,
        days,
        weight,
        destination,
        method: shippingMethod
      });
    }
  };

  useEffect(() => {
    calculateShipping();
  }, [weight, destination, shippingMethod]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getDestinationName = (dest) => {
    const names = {
      senegal: 'Sénégal',
      africa: 'Afrique de l\'Ouest',
      international: 'International'
    };
    return names[dest] || dest;
  };

  const getMethodName = (method) => {
    const names = {
      express: 'Express',
      standard: 'Standard',
      economic: 'Économique'
    };
    return names[method] || method;
  };

  const getMethodColor = (method) => {
    const colors = {
      express: 'from-red-500 to-pink-500',
      standard: 'from-blue-500 to-indigo-500',
      economic: 'from-green-500 to-emerald-500'
    };
    return colors[method] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <Truck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Calcul Expédition</h3>
          <p className="text-sm text-gray-600">Coût basé sur poids et destination</p>
        </div>
      </div>

      {weight && destination && shippingMethod && (
        <div className="space-y-4">
          {/* Shipping Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Poids</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{weight} kg</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Destination</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{getDestinationName(destination)}</div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className={`bg-gradient-to-r ${getMethodColor(shippingMethod)} rounded-2xl p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{getMethodName(shippingMethod)}</div>
                <div className="text-sm opacity-90">Délai estimé: {estimatedDays}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">{formatPrice(shippingCost)}</div>
                <div className="text-sm opacity-90">Frais d'expédition</div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Détail du calcul
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Tarif de base</span>
                <span className="font-medium">{formatPrice(shippingRates[destination][shippingMethod].baseRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Poids ({weight} kg × {formatPrice(shippingRates[destination][shippingMethod].perKg)}/kg)</span>
                <span className="font-medium">+{formatPrice(weight * shippingRates[destination][shippingMethod].perKg)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                <span className="text-blue-900">Total expédition</span>
                <span className="text-blue-900">{formatPrice(shippingCost)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-900">Informations de livraison</span>
            </div>
            <div className="text-sm text-green-800">
              <p>• Suivi en temps réel inclus</p>
              <p>• Assurance colis jusqu'à 100 000 FCFA</p>
              <p>• Support WhatsApp 24/7</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;