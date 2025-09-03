import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Utilisateurs Total',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Vendeurs Actifs',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'CA Mensuel',
      value: '45.2M FCFA',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Commissions',
      value: '3.6M FCFA',
      change: '+18%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'Aminata Diallo',
      email: 'aminata@example.com',
      role: 'client',
      status: 'active',
      orders: 12,
      totalSpent: 450000,
      joinDate: '2024-12-15'
    },
    {
      id: 2,
      name: 'Fatou Sall',
      email: 'fatou@atelierfatou.sn',
      role: 'vendor',
      status: 'active',
      products: 24,
      revenue: 1200000,
      joinDate: '2024-11-20'
    },
    {
      id: 3,
      name: 'Moussa Ba',
      email: 'moussa@afrizar.sn',
      role: 'support',
      status: 'active',
      tickets: 156,
      rating: 4.8,
      joinDate: '2024-10-01'
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getRoleColor = (role) => {
    const colors = {
      client: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      support: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      developer: 'bg-gray-100 text-gray-800',
      founder: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: 'Client',
      vendor: 'Vendeur',
      support: 'Support',
      admin: 'Admin',
      developer: 'Développeur',
      founder: 'Fondateur'
    };
    return labels[role] || role;
  };

  // Désactivé temporairement pour les tests d'interface
  // if (!hasPermission('manage_users')) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Shield className="h-24 w-24 text-gray-300 mx-auto mb-6" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
  //         <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600 mt-1">Gestion de la plateforme Afrizar.sn</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Nouvel Utilisateur</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Exporter</span>
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'vendors', label: 'Vendeurs', icon: Package },
              { id: 'settings', label: 'Paramètres', icon: Settings }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
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

            {/* Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Système</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-800">Maintenance programmée</div>
                      <div className="text-sm text-yellow-600">Dimanche 2h-4h du matin</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Sauvegarde réussie</div>
                      <div className="text-sm text-green-600">Il y a 2 heures</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Nouveau vendeur inscrit:</span> Atelier Khadija
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Commande importante:</span> 250,000 FCFA
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Support ticket:</span> Problème de paiement résolu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des Utilisateurs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-900 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'client' && `${user.orders} commandes`}
                        {user.role === 'vendor' && `${user.products} produits`}
                        {user.role === 'support' && `${user.tickets} tickets`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <VendorApprovalPage />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres Système</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Commission</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Moins de 10,000 FCFA</span>
                    <input type="number" value="10" className="w-20 px-3 py-1 border rounded text-sm" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">10,000 - 30,000 FCFA</span>
                    <input type="number" value="8" className="w-20 px-3 py-1 border rounded text-sm" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plus de 30,000 FCFA</span>
                    <input type="number" value="6" className="w-20 px-3 py-1 border rounded text-sm" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Livraison</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarif de base Sénégal</span>
                    <input type="number" value="1000" className="w-24 px-3 py-1 border rounded text-sm" />
                    <span className="text-sm text-gray-600">FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Par kg Sénégal</span>
                    <input type="number" value="500" className="w-24 px-3 py-1 border rounded text-sm" />
                    <span className="text-sm text-gray-600">FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Sauvegarder les Paramètres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;