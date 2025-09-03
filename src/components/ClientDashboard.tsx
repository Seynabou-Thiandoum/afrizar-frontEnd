import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Heart, 
  Star, 
  Clock, 
  MapPin,
  Eye,
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  CreditCard,
  Gift,
  Award,
  User,
  Mail,
  Phone
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Commandes totales',
      value: '12',
      change: '+3 ce mois',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Montant dépensé',
      value: '450,000 FCFA',
      change: '+45,000 ce mois',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Produits favoris',
      value: '8',
      change: '+2 cette semaine',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Points fidélité',
      value: '2,450',
      change: '+150 récents',
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  const recentOrders = [
    {
      id: 'CMD-001',
      date: '2025-01-15',
      vendor: 'Atelier Fatou',
      items: [
        { name: 'Grand Boubou Brodé Premium', price: 45000, image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ],
      total: 47000,
      status: 'delivered',
      tracking: 'DHL123456789'
    },
    {
      id: 'CMD-002',
      date: '2025-01-10',
      vendor: 'Bijoux Khadija',
      items: [
        { name: 'Collier Perles Traditionnelles', price: 12000, image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { name: 'Bracelet Argent', price: 8000, image: 'https://images.pexels.com/photos/1927248/pexels-photo-1927248.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ],
      total: 22000,
      status: 'shipped',
      tracking: 'DHL987654321'
    },
    {
      id: 'CMD-003',
      date: '2025-01-05',
      vendor: 'Maroquinerie Salam',
      items: [
        { name: 'Sac à Main Cuir Artisanal', price: 25000, image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ],
      total: 27000,
      status: 'delivered',
      tracking: 'DHL456789123'
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      name: 'Caftan Élégant',
      price: 42000,
      vendor: 'Couture Royale',
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.7,
      status: 'En stock'
    },
    {
      id: 2,
      name: 'Chaussures Cuir Babouches',
      price: 18000,
      vendor: 'Cordonnerie Traditionnelle',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.3,
      status: 'En stock'
    }
  ];

  const recommendations = [
    {
      id: 1,
      name: 'Robe Wax Moderne',
      price: 22000,
      vendor: 'Atelier Moderne',
      image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.4,
      reason: 'Basé sur vos achats récents'
    },
    {
      id: 2,
      name: 'Ensemble Bazin Riche',
      price: 35000,
      vendor: 'Couture Aminata',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.9,
      reason: 'Populaire dans votre région'
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: CheckCircle,
      shipped: Truck,
      processing: Clock,
      cancelled: AlertCircle
    };
    return icons[status] || Clock;
  };

  const getStatusLabel = (status) => {
    const labels = {
      delivered: 'Livré',
      shipped: 'Expédié',
      processing: 'En cours',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
              <p className="text-gray-600 mt-1">Bienvenue {user?.firstName} ! Gérez vos commandes et découvertes</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Continuer mes achats</span>
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
              { id: 'orders', label: 'Mes Commandes', icon: Package },
              { id: 'wishlist', label: 'Mes Favoris', icon: Heart },
              { id: 'recommendations', label: 'Recommandations', icon: Star }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouvelle Commande</h3>
                  <p className="text-gray-600 text-sm mb-4">Découvrez nos dernières créations</p>
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors w-full">
                    Explorer le Catalogue
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi Commande</h3>
                  <p className="text-gray-600 text-sm mb-4">Suivez vos livraisons en temps réel</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full">
                    Suivre mes Commandes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sur Mesure</h3>
                  <p className="text-gray-600 text-sm mb-4">Créez votre tenue unique</p>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full">
                    Commander Sur Mesure
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                        <div className="flex-shrink-0">
                          <img
                            src={order.items[0].image}
                            alt={order.items[0].name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{order.id}</h4>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{getStatusLabel(order.status)}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{order.vendor} • {order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                            <span className="text-sm text-gray-500">{order.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {recentOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{order.date}</span>
                          <span>•</span>
                          <span>{order.vendor}</span>
                          <span>•</span>
                          <span>Suivi: {order.tracking}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-1">{formatPrice(order.total)}</div>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{getStatusLabel(order.status)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                              <Heart className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-green-600 font-medium uppercase">{item.status}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.vendor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{formatPrice(item.price)}</span>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Recommandations personnalisées</h3>
              <p className="text-orange-100">Basées sur vos goûts et achats précédents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-blue-600 font-medium">{item.reason}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{item.vendor}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">{formatPrice(item.price)}</span>
                        <div className="flex space-x-2">
                          <button className="p-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                            Voir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;