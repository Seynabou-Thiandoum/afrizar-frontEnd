import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Search,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  LogOut,
  Crown,
  RefreshCw,
  Send,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SupportDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const stats = [
    {
      title: 'Tickets Ouverts',
      value: '23',
      change: '-5%',
      icon: MessageSquare,
      color: 'bg-orange-500'
    },
    {
      title: 'Résolus Aujourd\'hui',
      value: '18',
      change: '+12%',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Temps Moyen',
      value: '2h 15m',
      change: '-8%',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const tickets = [
    {
      id: 'TK-001',
      customer: 'Aminata Diallo',
      subject: 'Problème de paiement Orange Money',
      status: 'open',
      priority: 'high',
      created: '2025-01-15 14:30',
      lastUpdate: '2025-01-15 15:45',
      category: 'payment',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Bonjour, j\'ai un problème avec mon paiement Orange Money. La transaction a été débitée mais ma commande n\'apparaît pas.',
          timestamp: '2025-01-15 14:30'
        },
        {
          id: 2,
          sender: 'support',
          message: 'Bonjour Aminata, je vais vérifier votre transaction. Pouvez-vous me donner le numéro de référence Orange Money ?',
          timestamp: '2025-01-15 14:45'
        }
      ]
    },
    {
      id: 'TK-002',
      customer: 'Jean-Pierre Martin',
      subject: 'Commande non reçue',
      status: 'in-progress',
      priority: 'medium',
      created: '2025-01-15 10:20',
      lastUpdate: '2025-01-15 16:10',
      category: 'shipping',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Ma commande CMD-002 devait arriver hier mais je n\'ai rien reçu.',
          timestamp: '2025-01-15 10:20'
        }
      ]
    },
    {
      id: 'TK-003',
      customer: 'Fatou Sall (Vendeur)',
      subject: 'Question sur les commissions',
      status: 'resolved',
      priority: 'low',
      created: '2025-01-14 16:45',
      lastUpdate: '2025-01-15 09:30',
      category: 'vendor',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Comment sont calculées les commissions sur mes ventes ?',
          timestamp: '2025-01-14 16:45'
        },
        {
          id: 2,
          sender: 'support',
          message: 'Les commissions sont calculées selon un barème dégressif : 10% pour les ventes < 10k, 8% pour 10k-30k, 6% pour > 30k.',
          timestamp: '2025-01-15 09:30'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      payment: Phone,
      shipping: Package,
      vendor: Users,
      general: MessageSquare
    };
    return icons[category] || MessageSquare;
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      'in-progress': 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé'
    };
    return labels[status] || status;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    console.log('Envoyer message:', newMessage, 'pour ticket:', selectedTicket.id);
    setNewMessage('');
  };

  const handleResolveTicket = (ticketId) => {
    console.log('Résoudre ticket:', ticketId);
    // Marquer comme résolu
  };

  const handleEscalateTicket = (ticketId) => {
    console.log('Escalader ticket:', ticketId);
    // Escalader vers admin
  };

  const handleContactCustomer = (customer) => {
    console.log('Contacter client:', customer);
    // Ouvrir chat direct
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec menu utilisateur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Client</h1>
                <p className="text-gray-600">Assistance clients et vendeurs</p>
              </div>
            </div>
            
            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Support</span>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
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
              { id: 'tickets', label: 'Tickets', icon: MessageSquare },
              { id: 'customers', label: 'Clients', icon: Users },
              { id: 'vendors', label: 'Vendeurs', icon: Package },
              { id: 'analytics', label: 'Statistiques', icon: Star }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tickets de Support</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => console.log('Rechercher tickets')}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>Rechercher</span>
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Actualiser</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {tickets.map((ticket) => {
                    const CategoryIcon = getCategoryIcon(ticket.category);
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <CategoryIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                  {getStatusLabel(ticket.status)}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h4>
                              <p className="text-sm text-gray-600 mb-2">Par {ticket.customer}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Créé: {ticket.created}</span>
                                <span>•</span>
                                <span>{ticket.messages?.length || 0} messages</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ticket Detail */}
            <div className="lg:col-span-1">
              {selectedTicket ? (
                <div className="bg-white rounded-xl shadow-sm sticky top-24">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Conversation</h3>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Ticket:</span>
                        <span className="font-semibold">{selectedTicket.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Client:</span>
                        <span className="font-semibold">{selectedTicket.customer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Statut:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusLabel(selectedTicket.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {selectedTicket.messages?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender === 'support'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'support' ? 'text-purple-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre réponse..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleResolveTicket(selectedTicket.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Marquer résolu
                      </button>
                      <button
                        onClick={() => handleEscalateTicket(selectedTicket.id)}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Escalader
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center sticky top-24">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez un ticket</h3>
                  <p className="text-gray-600 text-sm">Cliquez sur un ticket pour voir la conversation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Support Clients</h2>
              <button
                onClick={() => console.log('Contacter tous les clients')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Nouveau message</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center py-12">
                <Users className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Clients</h3>
                <p className="text-gray-600 mb-6">
                  Interface de communication directe avec les clients
                </p>
                <button
                  onClick={() => console.log('Ouvrir chat clients')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ouvrir la messagerie
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Support Vendeurs</h2>
              <button
                onClick={() => console.log('Contacter tous les vendeurs')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Nouveau message</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center py-12">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Vendeurs</h3>
                <p className="text-gray-600 mb-6">
                  Assistance technique et commerciale pour les vendeurs
                </p>
                <button
                  onClick={() => console.log('Ouvrir chat vendeurs')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ouvrir la messagerie
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiques de Performance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Client</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Très satisfait</span>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Satisfait</span>
                    </div>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Insatisfait</span>
                    </div>
                    <span className="text-sm font-medium">3%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps de Résolution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Moins de 1h</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">1h - 4h</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">4h - 24h</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plus de 24h</span>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => console.log('Créer ticket')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Nouveau Ticket</span>
                </button>
                <button
                  onClick={() => console.log('Exporter rapports')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Exporter Rapports</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;