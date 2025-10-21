import React, { useState, useEffect } from 'react';
import {
  Headphones,
  MessageSquare,
  Package,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Eye,
  Send,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import commandeService, { Commande } from '../services/commandeService';

const SupportDashboardNew = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'tickets' | 'commandes' | 'clients'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [reponse, setReponse] = useState('');

  const stats = {
    ticketsOuverts: 12,
    ticketsResolus: 45,
    commandesProbleme: 3,
    clientsActifs: 156
  };

  // Mock tickets pour démonstration
  const mockTickets = [
    {
      id: 1,
      numero: 'TICK-001',
      client: 'Marie Diop',
      email: 'marie.diop@email.com',
      sujet: 'Problème de livraison',
      description: 'Ma commande CMD-123 n\'est pas arrivée',
      statut: 'OUVERT',
      priorite: 'HAUTE',
      dateCreation: new Date().toISOString(),
      reponses: []
    },
    {
      id: 2,
      numero: 'TICK-002',
      client: 'Amadou Fall',
      email: 'amadou.fall@email.com',
      sujet: 'Question sur un produit',
      description: 'Je voudrais savoir si ce produit est disponible en bleu',
      statut: 'EN_COURS',
      priorite: 'MOYENNE',
      dateCreation: new Date().toISOString(),
      reponses: [
        {
          auteur: 'Support',
          message: 'Bonjour, je vérifie pour vous...',
          date: new Date().toISOString()
        }
      ]
    }
  ];

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const handleRepondreTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleEnvoyerReponse = () => {
    if (!reponse.trim()) return;
    
    // Ajouter la réponse au ticket
    const nouveauTicket = {
      ...selectedTicket,
      reponses: [
        ...selectedTicket.reponses,
        {
          auteur: user?.prenom + ' ' + user?.nom,
          message: reponse,
          date: new Date().toISOString()
        }
      ],
      statut: 'EN_COURS'
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? nouveauTicket : t));
    setReponse('');
    setShowModal(false);
  };

  const handleCloturerTicket = (ticketId: number) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, statut: 'RESOLU' } : t
    ));
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'OUVERT': return 'yellow';
      case 'EN_COURS': return 'blue';
      case 'RESOLU': return 'green';
      case 'FERME': return 'gray';
      default: return 'gray';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'red';
      case 'MOYENNE': return 'orange';
      case 'BASSE': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Headphones className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
                <p className="text-sm text-gray-600">Bienvenue, {user?.prenom} {user?.nom}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Vue d'ensemble</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('tickets')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'tickets'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Tickets ({tickets.filter(t => t.statut !== 'RESOLU').length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('commandes')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'commandes'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Commandes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('clients')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'clients'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clients</span>
            </div>
          </button>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Tickets Ouverts</p>
                    <p className="text-3xl font-bold mt-2">{stats.ticketsOuverts}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Tickets Résolus</p>
                    <p className="text-3xl font-bold mt-2">{stats.ticketsResolus}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Commandes Problème</p>
                    <p className="text-3xl font-bold mt-2">{stats.commandesProbleme}</p>
                  </div>
                  <AlertCircle className="h-12 w-12 text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Clients Actifs</p>
                    <p className="text-3xl font-bold mt-2">{stats.clientsActifs}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">{ticket.sujet}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatutColor(ticket.statut)}-100 text-${getStatutColor(ticket.statut)}-800`}>
                          {ticket.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{ticket.client} - {ticket.numero}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets View */}
        {activeView === 'tickets' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gestion des Tickets</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-mono text-sm text-gray-500">{ticket.numero}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatutColor(ticket.statut)}-100 text-${getStatutColor(ticket.statut)}-800`}>
                            {ticket.statut}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPrioriteColor(ticket.priorite)}-100 text-${getPrioriteColor(ticket.priorite)}-800`}>
                            {ticket.priorite}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.sujet}</h3>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.client}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{ticket.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.dateCreation).toLocaleDateString('fr-FR')}</span>
                          </span>
                        </div>
                        {ticket.reponses.length > 0 && (
                          <div className="mt-3 text-sm text-blue-600">
                            {ticket.reponses.length} réponse(s)
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleRepondreTicket(ticket)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                          <span>Répondre</span>
                        </button>
                        {ticket.statut !== 'RESOLU' && (
                          <button
                            onClick={() => handleCloturerTicket(ticket.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Résoudre</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commandes View */}
        {activeView === 'commandes' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes Nécessitant une Assistance</h2>
            <p className="text-gray-600">Cette section affichera les commandes avec des problèmes signalés par les clients.</p>
          </div>
        )}

        {/* Clients View */}
        {activeView === 'clients' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Liste des Clients</h2>
            <p className="text-gray-600">Cette section affichera la liste des clients pour consultation et assistance.</p>
          </div>
        )}
      </div>

      {/* Modal Réponse Ticket */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Répondre au Ticket</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">{selectedTicket.sujet}</p>
                    <p className="text-gray-600">{selectedTicket.description}</p>
                    <p className="text-sm text-gray-500 mt-2">De: {selectedTicket.client}</p>
                  </div>

                  {selectedTicket.reponses.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-semibold text-gray-900">Historique des réponses :</p>
                      {selectedTicket.reponses.map((rep: any, index: number) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900">{rep.auteur}</p>
                          <p className="text-gray-700">{rep.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(rep.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
                    <textarea
                      value={reponse}
                      onChange={(e) => setReponse(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Écrivez votre réponse ici..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleEnvoyerReponse}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                      <span>Envoyer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboardNew;


