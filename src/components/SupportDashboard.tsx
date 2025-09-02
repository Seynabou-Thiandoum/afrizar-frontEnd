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
  ThumbsDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SupportDashboard = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const stats = [
    {
      title: 'Tickets Ouverts',
      value: '23',
      change: '-5%',
      trend: 'down',
      icon: MessageSquare,
      color: 'bg-orange-500'
    },
    {
      title: 'Résolus Aujourd\'hui',
      value: '18',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Temps Moyen',
      value: '2h 15m',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
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
      messages: 3
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
      messages: 5
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
      messages: 2
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

  if (!hasPermission('customer_support')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder au support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Client</h1>
              <p className="text-gray-600 mt-1">Assistance clients et vendeurs</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Nouveau Ticket</span>
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tickets de Support</h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
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
                                  {ticket.status}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h4>
                              <p className="text-sm text-gray-600 mb-2">Par {ticket.customer}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Créé: {ticket.created}</span>
                                <span>•</span>
                                <span>{ticket.messages} messages</span>
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
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Détails du Ticket</h3>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ID</label>
                      <p className="font-semibold">{selectedTicket.id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Client</label>
                      <p className="font-semibold">{selectedTicket.customer}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sujet</label>
                      <p className="font-semibold">{selectedTicket.subject}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut</label>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priorité</label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTicket.priority)}`}></div>
                        <span className="capitalize">{selectedTicket.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Répondre
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Marquer comme résolu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Sélectionnez un ticket pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques de Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Satisfaction Client</h4>
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
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Temps de Résolution</h4>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;