import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Package,
  DollarSign,
  Star,
  Clock,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Download,
  RefreshCw,
  Crown,
  Building
} from 'lucide-react';

const UserDetailModal = ({ user, onClose, onEdit }) => {
  const [activeSection, setActiveSection] = useState('info');

  const mockUserStats = {
    totalOrders: user.role === 'client' ? 12 : 0,
    totalSpent: user.role === 'client' ? 450000 : 0,
    totalProducts: user.role === 'vendor' ? 24 : 0,
    totalRevenue: user.role === 'vendor' ? 1200000 : 0,
    averageRating: user.role === 'vendor' ? 4.8 : 0,
    joinDate: '2024-12-15',
    lastActivity: '2025-01-15 14:30',
    ticketsResolved: user.role === 'support' ? 156 : 0,
    supportRating: user.role === 'support' ? 4.9 : 0
  };

  const mockOrders = [
    {
      id: 'CMD-001',
      date: '2025-01-15',
      amount: 45000,
      status: 'delivered',
      vendor: 'Atelier Fatou'
    },
    {
      id: 'CMD-002',
      date: '2025-01-10',
      amount: 25000,
      status: 'shipped',
      vendor: 'Bijoux Khadija'
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getRoleColor = (role) => {
    const colors = {
      client: 'from-blue-500 to-indigo-500',
      vendor: 'from-green-500 to-emerald-500',
      support: 'from-purple-500 to-violet-500',
      admin: 'from-red-500 to-pink-500'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
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

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSuspendUser = () => {
    if (confirm(`Êtes-vous sûr de vouloir suspendre ${user.name} ?`)) {
      console.log('Suspendre utilisateur:', user.id);
      alert('Utilisateur suspendu');
    }
  };

  const handleActivateUser = () => {
    console.log('Activer utilisateur:', user.id);
    alert('Utilisateur activé');
  };

  const handleSendMessage = () => {
    console.log('Envoyer message à:', user.name);
    alert('Fonctionnalité de messagerie à implémenter');
  };

  const handleExportUserData = () => {
    const userData = {
      ...user,
      stats: mockUserStats,
      orders: user.role === 'client' ? mockOrders : [],
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-${user.id}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Données utilisateur exportées !');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {user.name}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <p className="text-gray-600 font-medium">{user.email}</p>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                      <Crown className="h-3 w-3" />
                      <span>{getRoleLabel(user.role)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onEdit(user)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Navigation */}
              <div className="flex space-x-4 border-b border-gray-200">
                {[
                  { id: 'info', label: 'Informations', icon: User },
                  { id: 'activity', label: 'Activité', icon: Clock },
                  { id: 'stats', label: 'Statistiques', icon: Star }
                ].map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium transition-colors ${
                        activeSection === section.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              {activeSection === 'info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                    <h4 className="font-bold text-gray-900 mb-4">Informations personnelles</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Téléphone:</span>
                        <span className="font-medium">+221 77 123 45 67</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Adresse:</span>
                        <span className="font-medium">Dakar, Sénégal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Inscrit le:</span>
                        <span className="font-medium">{mockUserStats.joinDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Dernière activité:</span>
                        <span className="font-medium">{mockUserStats.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  {user.role === 'vendor' && (
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h4 className="font-bold text-gray-900 mb-4">Informations vendeur</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Atelier:</span>
                          <span className="font-medium text-orange-600">{user.businessName || 'Atelier Fatou'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Produits:</span>
                          <span className="font-medium">{mockUserStats.totalProducts}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">CA total:</span>
                          <span className="font-medium">{formatPrice(mockUserStats.totalRevenue)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">Note moyenne:</span>
                          <span className="font-medium">{mockUserStats.averageRating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'activity' && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                  <h4 className="font-bold text-gray-900 mb-4">Activité récente</h4>
                  {user.role === 'client' && (
                    <div className="space-y-3">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900">{order.id}</div>
                            <div className="text-sm text-gray-600">{order.date} • {order.vendor}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatPrice(order.amount)}</div>
                            <div className="text-sm text-green-600">{order.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {user.role === 'vendor' && (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Activité vendeur - Produits et ventes</p>
                    </div>
                  )}
                  {user.role === 'support' && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Tickets résolus: {mockUserStats.ticketsResolved}</p>
                      <p className="text-gray-600">Note support: {mockUserStats.supportRating}/5</p>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.role === 'client' && (
                    <>
                      <div className="bg-blue-50 rounded-2xl p-6 text-center">
                        <Package className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-blue-600">{mockUserStats.totalOrders}</div>
                        <div className="text-blue-800 font-medium">Commandes totales</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-6 text-center">
                        <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-green-600">{formatPrice(mockUserStats.totalSpent)}</div>
                        <div className="text-green-800 font-medium">Montant total</div>
                      </div>
                    </>
                  )}
                  
                  {user.role === 'vendor' && (
                    <>
                      <div className="bg-orange-50 rounded-2xl p-6 text-center">
                        <Package className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-orange-600">{mockUserStats.totalProducts}</div>
                        <div className="text-orange-800 font-medium">Produits actifs</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-6 text-center">
                        <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-green-600">{formatPrice(mockUserStats.totalRevenue)}</div>
                        <div className="text-green-800 font-medium">Chiffre d'affaires</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h4 className="font-bold text-gray-900 mb-4">Actions administrateur</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  
                  <button
                    onClick={handleExportUserData}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                  </button>
                  
                  {user.status === 'active' ? (
                    <button
                      onClick={handleSuspendUser}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Suspendre</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleActivateUser}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Activer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;