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
  Calendar,
  LogOut,
  Crown,
  RefreshCw,
  Search,
  Filter,
  Building,
  Award,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserManagementModal from './UserManagementModal';
import VendorApprovalModal from './VendorApprovalModal';
import SystemSettingsModal from './SystemSettingsModal';
import UserDetailModal from './UserDetailModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendorForApproval, setSelectedVendorForApproval] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const stats = [
    {
      title: 'Utilisateurs Total',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Vendeurs Actifs',
      value: '156',
      change: '+8%',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'CA Mensuel',
      value: '45.2M FCFA',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Commissions',
      value: '3.6M FCFA',
      change: '+18%',
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

  const pendingVendors = [
    {
      id: 1,
      firstName: 'Khadija',
      lastName: 'Diop',
      email: 'khadija@atelierkhadija.sn',
      phone: '+221 77 987 65 43',
      businessName: 'Atelier Khadija',
      businessDescription: 'Spécialisée dans la création de boubous traditionnels pour femmes avec broderies dorées et perles. Plus de 10 ans d\'expérience dans la couture sénégalaise.',
      address: 'Médina, Dakar, Sénégal',
      experience: '10 ans',
      specialties: ['Boubous femmes', 'Broderies dorées', 'Perles traditionnelles'],
      submittedAt: '2025-01-15 14:30',
      status: 'pending',
      portfolio: [
        'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    },
    {
      id: 2,
      firstName: 'Mamadou',
      lastName: 'Thiam',
      email: 'mamadou@couturetradition.sn',
      phone: '+221 78 123 45 67',
      businessName: 'Couture Tradition',
      businessDescription: 'Atelier familial spécialisé dans les tenues masculines traditionnelles. Transmission du savoir-faire de père en fils depuis 3 générations.',
      address: 'Kaolack, Sénégal',
      experience: '15 ans',
      specialties: ['Boubous hommes', 'Costumes traditionnels', 'Broderies masculines'],
      submittedAt: '2025-01-14 09:15',
      status: 'pending',
      portfolio: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
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
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: 'Client',
      vendor: 'Vendeur',
      support: 'Support',
      admin: 'Admin'
    };
    return labels[role] || role;
  };

  const handleApproveVendor = (vendorId) => {
    console.log('Approuver vendeur:', vendorId);
    const vendor = pendingVendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendorForApproval(vendor);
      setShowVendorModal(true);
    }
  };

  const handleRejectVendor = (vendorId) => {
    console.log('Rejeter vendeur:', vendorId);
    const vendor = pendingVendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendorForApproval(vendor);
      setShowVendorModal(true);
    }
  };

  const handleViewUser = (userId) => {
    console.log('Voir utilisateur:', userId);
    const userToView = users.find(u => u.id === userId);
    if (userToView) {
      setSelectedUserDetail(userToView);
      setShowUserDetailModal(true);
    }
  };

  const handleEditUser = (userId) => {
    console.log('Modifier utilisateur:', userId);
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setShowUserModal(true);
    }
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      console.log('Supprimer utilisateur:', userId);
      // Logique de suppression
      alert('Utilisateur supprimé avec succès');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleExportData = () => {
    const data = {
      users: users.length,
      vendors: pendingVendors.length,
      exportDate: new Date().toISOString(),
      stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afrizar-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Export téléchargé avec succès !');
  };

  const handleSaveUser = (userData) => {
    console.log('Sauvegarder utilisateur:', userData);
    setShowUserModal(false);
    setEditingUser(null);
    alert('Utilisateur sauvegardé avec succès !');
  };

  const handleVendorAction = (action, vendorData) => {
    console.log('Action vendeur:', action, vendorData);
    setShowVendorModal(false);
    setSelectedVendorForApproval(null);
    alert(`Vendeur ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès !`);
  };

  const handleSaveSettings = (settingsData) => {
    console.log('Sauvegarder paramètres:', settingsData);
    setShowSettingsModal(false);
    alert('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec menu utilisateur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-gray-600">Gestion de la plateforme Afrizar.sn</p>
              </div>
            </div>
            
            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Administrateur</span>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
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
                        setActiveTab('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Settings className="h-5 w-5 text-gray-600" />
                      <span>Paramètres</span>
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
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'approvals', label: 'Approbations', icon: CheckCircle },
              { id: 'moderation', label: 'Modération', icon: Shield },
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouvel Utilisateur</h3>
                  <p className="text-gray-600 text-sm mb-4">Créer un compte utilisateur</p>
                  <button
                    onClick={handleCreateUser}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
                  >
                    Créer un utilisateur
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Approbations</h3>
                  <p className="text-gray-600 text-sm mb-4">{pendingVendors.length} demandes en attente</p>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
                  >
                    Gérer les demandes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-gray-600 text-sm mb-4">Exporter les données</p>
                  <button
                    onClick={handleExportData}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full"
                  >
                    Télécharger rapport
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Système</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-800">{pendingVendors.length} demandes vendeurs en attente</div>
                      <div className="text-sm text-yellow-600">Nécessite votre approbation</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Système opérationnel</div>
                      <div className="text-sm text-green-600">Tous les services fonctionnent</div>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => console.log('Rechercher utilisateurs')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Rechercher</span>
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Nouvel Utilisateur</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
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
                            <button
                              onClick={() => handleViewUser(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
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
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Approbation des Vendeurs</h2>
              <div className="flex items-center space-x-3">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pendingVendors.length} demande{pendingVendors.length > 1 ? 's' : ''} en attente
                </span>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des demandes */}
              <div className="lg:col-span-2 space-y-6">
                {pendingVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {vendor.firstName} {vendor.lastName}
                            </h3>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full">
                              En attente
                            </span>
                          </div>
                          <p className="text-orange-600 font-semibold mb-2">{vendor.businessName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{vendor.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{vendor.phone}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2 mb-3">{vendor.businessDescription}</p>
                          <div className="flex flex-wrap gap-1">
                            {vendor.specialties.map((specialty, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveVendor(vendor.id);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectVendor(vendor.id);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Détails du vendeur sélectionné */}
              <div className="lg:col-span-1">
                {selectedVendor ? (
                  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Détails du Vendeur</h3>
                      <button
                        onClick={() => setSelectedVendor(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900">{selectedVendor.businessName}</h4>
                        <p className="text-sm text-gray-600">{selectedVendor.firstName} {selectedVendor.lastName}</p>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{selectedVendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{selectedVendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{selectedVendor.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-gray-500" />
                          <span>Expérience: {selectedVendor.experience}</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Portfolio</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedVendor.portfolio.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleApproveVendor(selectedVendor.id)}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Approuver ce vendeur</span>
                        </button>
                        <button
                          onClick={() => handleRejectVendor(selectedVendor.id)}
                          className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Rejeter la demande</span>
                        </button>
                        <button
                          onClick={() => console.log('Contacter vendeur:', selectedVendor.id)}
                          className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Contacter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center sticky top-24">
                    <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez un vendeur</h3>
                    <p className="text-gray-600 text-sm">Cliquez sur une demande pour voir les détails</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Modération de Contenu</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Signalements</h3>
                  <p className="text-gray-600 text-sm mb-4">3 produits signalés</p>
                  <button
                    onClick={() => console.log('Voir signalements')}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors w-full"
                  >
                    Examiner
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comptes Bloqués</h3>
                  <p className="text-gray-600 text-sm mb-4">2 comptes suspendus</p>
                  <button
                    onClick={() => console.log('Gérer comptes bloqués')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full"
                  >
                    Gérer
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Avis Suspects</h3>
                  <p className="text-gray-600 text-sm mb-4">1 avis à vérifier</p>
                  <button
                    onClick={() => console.log('Modérer avis')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full"
                  >
                    Modérer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Paramètres de la Plateforme</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Moins de 10,000 FCFA</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="10" className="w-16 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">10,000 - 30,000 FCFA</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="8" className="w-16 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plus de 30,000 FCFA</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="6" className="w-16 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Livraison</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarif de base Sénégal</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="1000" className="w-20 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">FCFA</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Par kg Sénégal</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="500" className="w-20 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">FCFA</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">International de base</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value="10000" className="w-20 px-2 py-1 border rounded text-sm" />
                      <span className="text-sm text-gray-600">FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sauvegarder les modifications</h3>
                <button
                  onClick={() => console.log('Sauvegarder paramètres')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Settings className="h-5 w-5" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagementModal
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Vendor Approval Modal */}
      {showVendorModal && selectedVendorForApproval && (
        <VendorApprovalModal
          vendor={selectedVendorForApproval}
          onClose={() => {
            setShowVendorModal(false);
            setSelectedVendorForApproval(null);
          }}
          onAction={handleVendorAction}
        />
      )}

      {/* System Settings Modal */}
      {showSettingsModal && (
        <SystemSettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && selectedUserDetail && (
        <UserDetailModal
          user={selectedUserDetail}
          onClose={() => {
            setShowUserDetailModal(false);
            setSelectedUserDetail(null);
          }}
          onEdit={(user) => {
            setSelectedUserDetail(null);
            setShowUserDetailModal(false);
            setEditingUser(user);
            setShowUserModal(true);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;