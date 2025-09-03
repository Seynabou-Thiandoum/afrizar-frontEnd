import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Clock, 
  User, 
  CreditCard, 
  Star, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle,
  Heart,
  ShoppingCart,
  MessageSquare,
  Camera,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  LogOut,
  Settings,
  Crown
} from 'lucide-react';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const stats = [
    {
      title: 'Commandes totales',
      value: '12',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'En cours',
      value: '3',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Montant total',
      value: '450,000 FCFA',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Points fidélité',
      value: '2,450',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const orders = [
    {
      id: 'CMD-001',
      date: '2025-01-15',
      vendor: 'Atelier Fatou',
      items: [
        { 
          name: 'Grand Boubou Brodé Premium', 
          price: 45000, 
          quantity: 1,
          image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ],
      total: 47000,
      status: 'delivered',
      tracking: 'DHL123456789',
      canReview: true
    },
    {
      id: 'CMD-002',
      date: '2025-01-10',
      vendor: 'Bijoux Khadija',
      items: [
        { 
          name: 'Collier Perles Traditionnelles', 
          price: 12000, 
          quantity: 2,
          image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ],
      total: 26000,
      status: 'shipped',
      tracking: 'DHL987654321',
      canReview: false
    },
    {
      id: 'CMD-003',
      date: '2025-01-05',
      vendor: 'Maroquinerie Salam',
      items: [
        { 
          name: 'Sac à Main Cuir Artisanal', 
          price: 25000, 
          quantity: 1,
          image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ],
      total: 27000,
      status: 'processing',
      tracking: 'DHL456789123',
      canReview: false
    }
  ];

  const payments = [
    {
      id: 'PAY-001',
      orderId: 'CMD-001',
      amount: 47000,
      method: 'Orange Money',
      status: 'completed',
      date: '2025-01-15 10:30',
      reference: 'OM123456789'
    },
    {
      id: 'PAY-002',
      orderId: 'CMD-002',
      amount: 26000,
      method: 'Wave',
      status: 'completed',
      date: '2025-01-10 14:20',
      reference: 'WV987654321'
    },
    {
      id: 'PAY-003',
      orderId: 'CMD-003',
      amount: 27000,
      method: 'PayPal',
      status: 'pending',
      date: '2025-01-05 16:45',
      reference: 'PP456789123'
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
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: CheckCircle,
      shipped: Truck,
      processing: Clock,
      cancelled: XCircle,
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle
    };
    return icons[status] || Clock;
  };

  const getStatusLabel = (status) => {
    const labels = {
      delivered: 'Livré',
      shipped: 'Expédié',
      processing: 'En cours',
      cancelled: 'Annulé',
      completed: 'Payé',
      pending: 'En attente',
      failed: 'Échec'
    };
    return labels[status] || status;
  };

  const handleTrackOrder = (tracking) => {
    console.log('Suivi commande:', tracking);
    // Redirection vers page de suivi
  };

  const handleReorder = (order) => {
    console.log('Recommander:', order);
    // Ajouter les articles au panier
  };

  const handleLeaveReview = (order) => {
    console.log('Laisser un avis pour:', order);
    // Ouvrir modal d'avis
  };

  const handleContactSupport = () => {
    console.log('Contacter le support');
    // Ouvrir chat support
  };

  const handleDownloadInvoice = (orderId) => {
    console.log('Télécharger facture:', orderId);
    // Télécharger la facture
  };

  const handleRetryPayment = (paymentId) => {
    console.log('Réessayer paiement:', paymentId);
    // Relancer le paiement
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec menu utilisateur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Espace Client</h1>
                <p className="text-gray-600">Bienvenue {user?.firstName} !</p>
              </div>
            </div>
            
            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Client</span>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-600">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <User className="h-5 w-5 text-gray-600" />
                      <span>Mon Profil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Package className="h-5 w-5 text-gray-600" />
                      <span>Mes Commandes</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'orders', label: 'Mes Commandes', icon: Package },
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'payments', label: 'Paiements', icon: CreditCard },
              { id: 'profile', label: 'Mon Profil', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </button>
                <button
                  onClick={handleContactSupport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Support</span>
                </button>
              </div>
            </div>

            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
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
                    
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Quantité: {item.quantity}</span>
                              <span>Prix: {formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleTrackOrder(order.tracking)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Truck className="h-4 w-4" />
                        <span>Suivre</span>
                      </button>
                      
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Recommander</span>
                      </button>
                      
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Facture</span>
                      </button>
                      
                      {order.canReview && (
                        <button
                          onClick={() => handleLeaveReview(order)}
                          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                          <span>Laisser un avis</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleContactSupport}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Signaler un problème</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Historique des Commandes</h2>
            
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Toutes mes commandes</h3>
                  <div className="flex items-center space-x-3">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Tous les statuts</option>
                      <option>Livrées</option>
                      <option>En cours</option>
                      <option>Annulées</option>
                    </select>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4" />
                      <span>Filtrer</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.date} • {order.vendor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Paiements</h2>
              <button
                onClick={() => console.log('Ajouter méthode de paiement')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Ajouter une méthode</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Historique des paiements</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {payments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            payment.status === 'completed' ? 'bg-green-500' : 
                            payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{payment.id}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Commande: {payment.orderId}</span>
                              <span>•</span>
                              <span>{payment.method}</span>
                              <span>•</span>
                              <span>{payment.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Référence: {payment.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 mb-1">{formatPrice(payment.amount)}</div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{getStatusLabel(payment.status)}</span>
                            </span>
                            {payment.status === 'pending' && (
                              <button
                                onClick={() => handleRetryPayment(payment.id)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                Réessayer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-2xl text-sm font-bold">
                    <Crown className="h-4 w-4" />
                    <span>Client Premium</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={user?.firstName || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={user?.lastName || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value="+221 77 123 45 67"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value="Dakar, Sénégal"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => console.log('Modifier profil')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Modifier mes informations</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;