import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Star,
  AlertCircle
} from 'lucide-react';

const OrderTracking = ({ onBack }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderData, setOrderData] = useState(null);

  const sampleOrder = {
    id: 'AFR-2025-001',
    status: 'shipped',
    items: [
      {
        name: 'Grand Boubou Brodé Premium',
        image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=200',
        vendor: 'Atelier Fatou',
        price: 45000,
        quantity: 1
      }
    ],
    timeline: [
      { status: 'confirmed', date: '2025-01-15 10:30', description: 'Commande confirmée', completed: true },
      { status: 'processing', date: '2025-01-15 14:20', description: 'En cours de préparation', completed: true },
      { status: 'shipped', date: '2025-01-16 09:15', description: 'Expédié via DHL Express', completed: true },
      { status: 'in-transit', date: '2025-01-17 08:00', description: 'En transit vers Paris', completed: false },
      { status: 'delivered', date: 'Estimé: 2025-01-19', description: 'Livraison prévue', completed: false }
    ],
    shipping: {
      method: 'DHL Express',
      trackingNumber: 'DHL123456789',
      estimatedDelivery: '19 Janvier 2025',
      currentLocation: 'Centre de tri Dakar'
    },
    vendor: {
      name: 'Atelier Fatou',
      phone: '+221 77 123 45 67',
      whatsapp: '+221 77 123 45 67'
    }
  };

  const handleTrackOrder = () => {
    if (trackingNumber) {
      setOrderData(sampleOrder);
    }
  };

  const getStatusColor = (status, completed) => {
    if (completed) return 'bg-green-500 text-white';
    if (status === 'in-transit') return 'bg-blue-500 text-white';
    return 'bg-gray-300 text-gray-600';
  };

  const getStatusIcon = (status, completed) => {
    if (completed) return CheckCircle;
    if (status === 'in-transit') return Truck;
    return Clock;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 hover:bg-white/80 rounded-2xl transition-colors shadow-lg"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              Suivi de Commande
            </h1>
            <p className="text-gray-600 font-medium">Suivez votre commande en temps réel</p>
          </div>
        </div>

        {!orderData ? (
          /* Search Form */
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rechercher votre commande</h2>
              <p className="text-gray-600">Entrez votre numéro de commande pour suivre son statut</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: AFR-2025-001"
                  className="w-full px-6 py-4 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 text-lg font-medium"
                />
              </div>
              <button
                onClick={handleTrackOrder}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105"
              >
                Suivre ma commande
              </button>
            </div>
          </div>
        ) : (
          /* Order Details */
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Commande {orderData.id}</h2>
                  <p className="text-gray-600">Expédié le 16 Janvier 2025</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Livraison estimée</div>
                  <div className="text-xl font-bold text-green-600">{orderData.shipping.estimatedDelivery}</div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.vendor}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.price.toLocaleString()} FCFA</div>
                      <div className="text-sm text-gray-600">Qté: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">{orderData.shipping.method}</div>
                    <div className="text-sm text-gray-600">N° de suivi: {orderData.shipping.trackingNumber}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>Position actuelle: {orderData.shipping.currentLocation}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Historique de la commande</h3>
              
              <div className="space-y-6">
                {orderData.timeline.map((step, index) => {
                  const StatusIcon = getStatusIcon(step.status, step.completed);
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(step.status, step.completed)} shadow-lg`}>
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900">{step.description}</h4>
                          <span className="text-sm text-gray-600">{step.date}</span>
                        </div>
                        {step.status === 'shipped' && (
                          <p className="text-sm text-gray-600 mt-1">
                            Votre commande a été expédiée et est en route vers sa destination.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Contact */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Besoin d'aide ?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">WhatsApp Support</h4>
                      <p className="text-sm text-gray-600">Assistance instantanée 24/7</p>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                    Contacter sur WhatsApp
                  </button>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">Contacter le Vendeur</h4>
                      <p className="text-sm text-gray-600">{orderData.vendor.name}</p>
                    </div>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
                    Appeler {orderData.vendor.phone}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;