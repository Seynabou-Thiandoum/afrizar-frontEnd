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
  MessageSquare,
  User,
  LogOut,
  Settings,
  Crown,
  Upload,
  Search,
  Filter,
  Download,
  RefreshCw,
  ShoppingCart,
  Heart,
  Camera
} from 'lucide-react';

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  
  const stats = [
    {
      title: 'Ventes ce mois',
      value: '1,245,000 FCFA',
      change: '+12%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Produits actifs',
      value: '24',
      change: '+3',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Commandes',
      value: '48',
      change: '+8',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Note moyenne',
      value: '4.8',
      change: '+0.2',
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
      date: '2025-01-15',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '#CMD-002',
      customer: 'Jean-Pierre Martin',
      product: 'Ensemble Bazin Riche',
      amount: 35000,
      status: 'processing',
      date: '2025-01-14',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '#CMD-003',
      customer: 'Fatou Sall',
      product: 'Collier Perles Traditionnelles',
      amount: 12000,
      status: 'shipped',
      date: '2025-01-13',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100'
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
      views: 1247,
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
      views: 892,
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
      views: 654,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const reviews = [
    {
      id: 1,
      customer: 'Aminata Diallo',
      product: 'Grand Boubou Brodé Premium',
      rating: 5,
      comment: 'Magnifique travail ! La qualité est exceptionnelle et les broderies sont sublimes.',
      date: '2025-01-15',
      verified: true
    },
    {
      id: 2,
      customer: 'Jean-Pierre Martin',
      product: 'Ensemble Bazin Riche',
      rating: 5,
      comment: 'Très satisfait de mon achat. Livraison rapide et produit conforme.',
      date: '2025-01-12',
      verified: true
    },
    {
      id: 3,
      customer: 'Marie Dubois',
      product: 'Collier Perles Traditionnelles',
      rating: 4,
      comment: 'Beau collier, mais un peu plus petit que prévu.',
      date: '2025-01-10',
      verified: true
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      'out-of-stock': 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: CheckCircle,
      processing: Clock,
      shipped: Package,
      delivered: CheckCircle,
      active: CheckCircle,
      'out-of-stock': AlertCircle,
      draft: Clock
    };
    return icons[status] || Clock;
  };

  const getStatusLabel = (status) => {
    const labels = {
      confirmed: 'Confirmé',
      processing: 'En cours',
      shipped: 'Expédié',
      delivered: 'Livré',
      active: 'Actif',
      'out-of-stock': 'Rupture',
      draft: 'Brouillon'
    };
    return labels[status] || status;
  };

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    console.log('Modifier produit:', product);
    // Ouvrir formulaire d'édition
  };

  const handleDeleteProduct = (productId) => {
    console.log('Supprimer produit:', productId);
    // Confirmer et supprimer
  };

  const handleViewProduct = (product) => {
    console.log('Voir produit:', product);
    // Ouvrir modal de détails
  };

  const handleUpdateStock = (productId, newStock) => {
    console.log('Mettre à jour stock:', productId, newStock);
    // Mettre à jour le stock
  };

  const handleCreatePromotion = () => {
    console.log('Créer promotion');
    // Ouvrir formulaire de promotion
  };

  const handleContactCustomer = (customer) => {
    console.log('Contacter client:', customer);
    // Ouvrir chat/email
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec menu utilisateur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Espace Vendeur</h1>
                <p className="text-gray-600">{user?.businessName || 'Mon Atelier'}</p>
              </div>
            </div>
            
            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Vendeur</span>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
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
                        setActiveTab('products');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Package className="h-5 w-5 text-gray-600" />
                      <span>Mes Produits</span>
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
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'products', label: 'Mes Produits', icon: Package },
              { id: 'orders', label: 'Commandes', icon: CheckCircle },
              { id: 'reviews', label: 'Avis Clients', icon: Star },
              { id: 'analytics', label: 'Statistiques', icon: TrendingUp },
              { id: 'profile', label: 'Mon Profil', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouveau Produit</h3>
                  <p className="text-gray-600 text-sm mb-4">Ajoutez une nouvelle création</p>
                  <button
                    onClick={handleAddProduct}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
                  >
                    Ajouter un produit
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Promotion</h3>
                  <p className="text-gray-600 text-sm mb-4">Créez une offre spéciale</p>
                  <button
                    onClick={handleCreatePromotion}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors w-full"
                  >
                    Créer une promo
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistiques</h3>
                  <p className="text-gray-600 text-sm mb-4">Analysez vos performances</p>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
                  >
                    Voir les stats
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.slice(0, 5).map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.image}
                            alt={order.product}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.id}</h4>
                            <p className="text-sm text-gray-600">{order.customer} • {order.product}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{formatPrice(order.amount)}</div>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{getStatusLabel(order.status)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Produits</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => console.log('Rechercher produits')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Rechercher</span>
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouveau Produit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
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
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir</span>
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </button>
                    </div>
                    
                    {product.stock === 0 && (
                      <button
                        onClick={() => handleUpdateStock(product.id, 10)}
                        className="w-full mt-2 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        Réapprovisionner
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
              <div className="flex items-center space-x-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Tous les statuts</option>
                  <option>Confirmées</option>
                  <option>En cours</option>
                  <option>Expédiées</option>
                  <option>Livrées</option>
                </select>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
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
                            <div className="flex items-center space-x-3">
                              <img src={order.image} alt="" className="w-8 h-8 rounded object-cover" />
                              <div className="max-w-xs truncate">{order.product}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatPrice(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{getStatusLabel(order.status)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleContactCustomer(order.customer)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Contacter
                              </button>
                              <button
                                onClick={() => console.log('Gérer commande:', order.id)}
                                className="text-green-600 hover:text-green-700 font-medium"
                              >
                                Gérer
                              </button>
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

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Avis Clients</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Achat vérifié
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Produit: {review.product}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => console.log('Répondre à l\'avis:', review.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Répondre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiques de Performance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes par mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Janvier 2025</span>
                    <span className="font-bold text-green-600">1,245,000 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Décembre 2024</span>
                    <span className="font-bold text-gray-900">1,112,000 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Novembre 2024</span>
                    <span className="font-bold text-gray-900">987,000 FCFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits les plus vendus</h3>
                <div className="space-y-3">
                  {products.slice(0, 3).map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                      <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-600">{product.orders} ventes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mon Profil Vendeur</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-gray-600 mb-2">{user?.businessName}</p>
                  <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-2xl text-sm font-bold">
                    <Crown className="h-4 w-4" />
                    <span>Vendeur Certifié</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations de l'atelier</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'atelier</label>
                      <input
                        type="text"
                        value={user?.businessName || 'Atelier Fatou'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={4}
                        value="Spécialisé dans la création de boubous traditionnels avec des broderies authentiques. Plus de 10 ans d'expérience dans la couture sénégalaise."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value="+221 77 123 45 67"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <input
                          type="text"
                          value="Dakar, Sénégal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() => console.log('Sauvegarder profil')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Sauvegarder les modifications</span>
                      </button>
                    </div>
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
