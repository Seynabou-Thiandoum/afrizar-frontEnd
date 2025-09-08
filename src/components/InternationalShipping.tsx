import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plane, 
  Ship, 
  Clock, 
  MapPin, 
  Package,
  Shield,
  Star,
  AlertCircle
} from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const InternationalShipping = ({ weight, onShippingSelect, selectedMethod }) => {
  const { country, getShippingZone, formatPrice } = useI18n();
  const [estimatedCost, setEstimatedCost] = useState(0);

  const getShippingMethods = () => {
    const zone = getShippingZone();
    const methods = [];

    switch (zone) {
      case 'senegal':
        methods.push(
          {
            id: 'senegal-express',
            name: 'Livraison Express Dakar',
            description: 'Livraison le jour même à Dakar',
            icon: Truck,
            color: 'from-red-500 to-pink-500',
            baseRate: 5000,
            perKg: 1000,
            days: '4-8 heures',
            tracking: true,
            insurance: true,
            carrier: 'Coursier Local'
          },
          {
            id: 'senegal-standard',
            name: 'Livraison Standard',
            description: 'Livraison nationale Sénégal',
            icon: Truck,
            color: 'from-blue-500 to-indigo-500',
            baseRate: 2000,
            perKg: 500,
            days: '1-3 jours',
            tracking: true,
            insurance: true,
            carrier: 'Poste Sénégalaise'
          },
          {
            id: 'senegal-economic',
            name: 'Livraison Économique',
            description: 'Livraison économique nationale',
            icon: Package,
            color: 'from-green-500 to-emerald-500',
            baseRate: 1000,
            perKg: 300,
            days: '3-5 jours',
            tracking: false,
            insurance: false,
            carrier: 'Transport Local'
          }
        );
        break;

      case 'africa':
        methods.push(
          {
            id: 'africa-express',
            name: 'DHL Express Afrique',
            description: 'Livraison express sous-région',
            icon: Plane,
            color: 'from-red-500 to-pink-500',
            baseRate: 15000,
            perKg: 3000,
            days: '2-4 jours',
            tracking: true,
            insurance: true,
            carrier: 'DHL Express'
          },
          {
            id: 'africa-standard',
            name: 'Livraison Standard Afrique',
            description: 'Via transporteurs régionaux',
            icon: Truck,
            color: 'from-blue-500 to-indigo-500',
            baseRate: 10000,
            perKg: 2000,
            days: '5-8 jours',
            tracking: true,
            insurance: true,
            carrier: 'Transporteurs Régionaux'
          },
          {
            id: 'africa-economic',
            name: 'Livraison Économique',
            description: 'Transport terrestre économique',
            icon: Ship,
            color: 'from-green-500 to-emerald-500',
            baseRate: 7000,
            perKg: 1500,
            days: '8-15 jours',
            tracking: false,
            insurance: false,
            carrier: 'Transport Terrestre'
          }
        );
        break;

      case 'international':
        if (['US', 'CA'].includes(country)) {
          methods.push(
            {
              id: 'fedex-priority',
              name: 'FedEx Priority',
              description: 'Livraison express internationale',
              icon: Plane,
              color: 'from-purple-500 to-violet-500',
              baseRate: 25000,
              perKg: 5000,
              days: '3-5 jours',
              tracking: true,
              insurance: true,
              carrier: 'FedEx International'
            },
            {
              id: 'dhl-express',
              name: 'DHL Express',
              description: 'Livraison rapide mondiale',
              icon: Plane,
              color: 'from-red-500 to-pink-500',
              baseRate: 22000,
              perKg: 4500,
              days: '4-6 jours',
              tracking: true,
              insurance: true,
              carrier: 'DHL Express'
            },
            {
              id: 'usps-priority',
              name: country === 'US' ? 'USPS Priority' : 'Canada Post',
              description: 'Service postal national',
              icon: Package,
              color: 'from-blue-500 to-indigo-500',
              baseRate: 18000,
              perKg: 3000,
              days: '7-12 jours',
              tracking: true,
              insurance: true,
              carrier: country === 'US' ? 'USPS' : 'Canada Post'
            }
          );
        } else {
          // Europe et autres pays
          methods.push(
            {
              id: 'dhl-express',
              name: 'DHL Express',
              description: 'Livraison rapide mondiale',
              icon: Plane,
              color: 'from-red-500 to-pink-500',
              baseRate: 20000,
              perKg: 4000,
              days: '4-7 jours',
              tracking: true,
              insurance: true,
              carrier: 'DHL Express'
            },
            {
              id: 'ups-standard',
              name: 'UPS Standard',
              description: 'Livraison internationale fiable',
              icon: Truck,
              color: 'from-amber-500 to-orange-500',
              baseRate: 18000,
              perKg: 3500,
              days: '6-10 jours',
              tracking: true,
              insurance: true,
              carrier: 'UPS International'
            },
            {
              id: 'postal-standard',
              name: 'Poste Internationale',
              description: 'Service postal économique',
              icon: Package,
              color: 'from-green-500 to-emerald-500',
              baseRate: 12000,
              perKg: 2500,
              days: '10-20 jours',
              tracking: false,
              insurance: false,
              carrier: 'La Poste Internationale'
            }
          );
        }
        break;
    }

    return methods;
  };

  const shippingMethods = getShippingMethods();

  const calculateShippingCost = (method) => {
    return method.baseRate + (weight * method.perKg);
  };

  useEffect(() => {
    if (selectedMethod) {
      const method = shippingMethods.find(m => m.id === selectedMethod);
      if (method) {
        setEstimatedCost(calculateShippingCost(method));
      }
    }
  }, [selectedMethod, weight]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Options de livraison</h3>
        <p className="text-gray-600">Choisissez votre mode de livraison pour {country}</p>
      </div>

      <div className="space-y-4">
        {shippingMethods.map((method) => {
          const IconComponent = method.icon;
          const cost = calculateShippingCost(method);
          
          return (
            <label
              key={method.id}
              className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => onShippingSelect && onShippingSelect(method.id)}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <div className={`p-3 bg-gradient-to-r ${method.color} rounded-2xl text-white shadow-lg`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{method.name}</h4>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{method.days}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Package className="h-4 w-4" />
                      <span>{method.carrier}</span>
                    </div>
                    {method.tracking && (
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Suivi</span>
                      </div>
                    )}
                    {method.insurance && (
                      <div className="flex items-center space-x-1 text-sm text-blue-600">
                        <Shield className="h-4 w-4" />
                        <span>Assuré</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(cost)}
                </div>
                <div className="text-sm text-gray-500">
                  {weight} kg
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Shipping Info */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Informations de livraison</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Expédition depuis Dakar, Sénégal</p>
              <p>• Emballage sécurisé inclus</p>
              <p>• Suivi en temps réel (selon option)</p>
              <p>• Support client 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🇸🇳</div>
          <div className="font-bold text-green-900">Sénégal</div>
          <div className="text-sm text-green-800">1-5 jours</div>
        </div>
        
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🌍</div>
          <div className="font-bold text-orange-900">Afrique</div>
          <div className="text-sm text-orange-800">2-15 jours</div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🌎</div>
          <div className="font-bold text-blue-900">International</div>
          <div className="text-sm text-blue-800">3-20 jours</div>
        </div>
      </div>
    </div>
  );
};

export default InternationalShipping;