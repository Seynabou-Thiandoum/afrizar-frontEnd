import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  MessageSquare
} from 'lucide-react';

const VendorDashboard = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    {
      title: 'Ventes ce mois',
      value: '1,245,000 FCFA',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Produits vendus',
      value: '48',
      change: '+8%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Nouveaux clients',
      value: '23',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Note moyenne',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  const recentOrders = [
    {
      id: '#CMD-001',
      customer: 'Aminata Diallo',
      product: 'Grand Boubou Brodé Premium',
      amount: 45000,
      status: 'confirmed',
      date: '2025-01-15'
    },
    {
      id: '#CMD-002',
      customer: 'Jean-Pierre Martin',
      product: 'Ensemble Bazin Riche',
      amount: 35000,
      status: 'processing',
      date: '2025-01-14'
    },
    {
      id: '#CMD-003',
      customer: 'Fatou Sall',
      product: 'Collier Perles Traditionnelles',
      amount: 12000,
      status: 'shipped',
      date: '2025-01-13'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      stock: 12,
      status: 'active',
      orders: 24,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 2,
      name: 'Ensemble Bazin Riche',
      price: 35000,
      stock: 8,
      status: 'active',
      orders: 18,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 3,
      name: 'Kaftan Homme Deluxe',
      price: 38000,
      stock: 0,
      status: 'out-of-stock',
      orders: 15,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'processing': return Clock;
      case 'shipped': return Package;
      case 'delivered': return CheckCircle;
      default: return AlertCircle;
    }
  };

  // Désactivé temporairement pour les tests d'interface
  // if (!hasPermission('manage_products')) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
  //         <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à l'espace vendeur.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord vendeur</h1>
              <p className="text-gray-600 mt-1">Gérez vos produits et commandes</p>
            </div>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Nouveau Produit</span>
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'products', label: 'Mes Produits', icon: Package },
              { id: 'orders', label: 'Commandes', icon: CheckCircle },
              { id: 'messages', label: 'Messages', icon: MessageSquare }
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
                        <div className={`flex items-center space-x-1 mt-2 text-sm ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="h-4 w-4" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="max-w-xs truncate">{order.product}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatPrice(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Actif' : 'Rupture'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Prix:</span> {formatPrice(product.price)}
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span> {product.stock}
                      </div>
                      <div>
                        <span className="font-medium">Ventes:</span> {product.orders}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Voir</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Toutes les commandes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="max-w-xs truncate">{order.product}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(order.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-600 hover:text-orange-700 font-medium">
                            Gérer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center py-12">
              <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages clients</h3>
              <p className="text-gray-600 mb-6">
                Communiquez directement avec vos clients via le support intégré
              </p>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Ouvrir la messagerie
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;