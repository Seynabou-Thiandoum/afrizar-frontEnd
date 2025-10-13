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
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Star,
  LogOut,
  Settings,
  Bell,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  UserCheck,
  MessageCircle,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supportService, { Ticket, TicketStats, ClientSupport } from '../services/supportService';
import commandeService, { Commande } from '../services/commandeService';

const SupportDashboardComplete = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'commandes' | 'clients' | 'rapports'>('overview');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<ClientSupport[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [reponse, setReponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  const [filterPriorite, setFilterPriorite] = useState<string>('TOUS');

  // Mock data pour développement
  const mockStats: TicketStats = {
    ticketsOuverts: 15,
    ticketsEnCours: 23,
    ticketsResolus: 142,
    ticketsFermes: 98,
    tempsReponseMonyen: 45, // minutes
    tauxResolution: 92.5,
    satisfactionMoyenne: 4.3
  };

  const mockTickets: Ticket[] = [
    {
      id: 1,
      numero: 'TICK-2024-001',
      clientId: 1,
      clientNom: 'Marie Diop',
      clientEmail: 'marie.diop@email.com',
      sujet: 'Problème de livraison - Commande non reçue',
      description: 'Ma commande CMD-123 n\'est pas arrivée à la date prévue. Pouvez-vous vérifier le statut ?',
      statut: 'OUVERT',
      priorite: 'HAUTE',
      categorie: 'Livraison',
      dateCreation: '2024-01-15T10:30:00',
      dateMiseAJour: '2024-01-15T10:30:00',
      reponses: [],
      commandeId: 123,
      numeroCommande: 'CMD-123'
    },
    {
      id: 2,
      numero: 'TICK-2024-002',
      clientId: 2,
      clientNom: 'Amadou Fall',
      clientEmail: 'amadou.fall@email.com',
      sujet: 'Question sur un produit - Disponibilité',
      description: 'Je voudrais savoir si le boubou bleu référence PRD-456 est disponible en taille XL',
      statut: 'EN_COURS',
      priorite: 'MOYENNE',
      categorie: 'Produit',
      dateCreation: '2024-01-15T09:15:00',
      dateMiseAJour: '2024-01-15T11:20:00',
      assigneA: 1,
      assigneNom: 'Support Agent',
      reponses: [
        {
          id: 1,
          ticketId: 2,
          auteurId: 1,
          auteurNom: 'Agent Support',
          auteurRole: 'support',
          message: 'Bonjour, je vérifie la disponibilité auprès du vendeur...',
          dateCreation: '2024-01-15T11:20:00'
        }
      ]
    },
    {
      id: 3,
      numero: 'TICK-2024-003',
      clientId: 3,
      clientNom: 'Fatou Sall',
      clientEmail: 'fatou.sall@email.com',
      sujet: 'Remboursement demandé',
      description: 'L\'article reçu ne correspond pas à la description. Je souhaite un remboursement.',
      statut: 'OUVERT',
      priorite: 'URGENTE',
      categorie: 'Remboursement',
      dateCreation: '2024-01-15T08:00:00',
      dateMiseAJour: '2024-01-15T08:00:00',
      reponses: [],
      commandeId: 124,
      numeroCommande: 'CMD-124'
    }
  ];

  const mockClients: ClientSupport[] = [
    {
      id: 1,
      nom: 'Diop',
      prenom: 'Marie',
      email: 'marie.diop@email.com',
      telephone: '+221 77 123 45 67',
      nombreCommandes: 8,
      nombreTickets: 3,
      dernierContactDate: '2024-01-15T10:30:00',
      statut: 'ACTIF'
    },
    {
      id: 2,
      nom: 'Fall',
      prenom: 'Amadou',
      email: 'amadou.fall@email.com',
      telephone: '+221 77 234 56 78',
      nombreCommandes: 5,
      nombreTickets: 1,
      dernierContactDate: '2024-01-15T09:15:00',
      statut: 'ACTIF'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // En production, décommenter ces lignes
      // const [statsData, ticketsData, clientsData] = await Promise.all([
      //   supportService.getStats(),
      //   supportService.getAllTickets(),
      //   supportService.getClients()
      // ]);
      // setStats(statsData);
      // setTickets(ticketsData);
      // setClients(clientsData);

      // Mock data pour développement
      setStats(mockStats);
      setTickets(mockTickets);
      setClients(mockClients);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepondreTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleEnvoyerReponse = async () => {
    if (!reponse.trim() || !selectedTicket) return;
    
    try {
      // await supportService.ajouterReponse(selectedTicket.id, reponse);
      
      // Mock: Ajouter la réponse localement
      const nouvelleReponse = {
        id: Date.now(),
        ticketId: selectedTicket.id,
        auteurId: user?.id || 0,
        auteurNom: `${user?.firstName} ${user?.lastName}`,
        auteurRole: 'support',
        message: reponse,
        dateCreation: new Date().toISOString()
      };

      const ticketMisAJour = {
        ...selectedTicket,
        reponses: [...selectedTicket.reponses, nouvelleReponse],
        statut: 'EN_COURS' as const
      };

      setTickets(tickets.map(t => t.id === selectedTicket.id ? ticketMisAJour : t));
      setReponse('');
      setShowTicketModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
    }
  };

  const handleChangerStatut = async (ticketId: number, nouveauStatut: string) => {
    try {
      // await supportService.updateTicketStatut(ticketId, nouveauStatut);
      
      // Mock: Changer le statut localement
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, statut: nouveauStatut as any } : t
      ));
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'OUVERT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EN_COURS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLU': return 'bg-green-100 text-green-800 border-green-200';
      case 'FERME': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'URGENTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'HAUTE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === 'TOUS' || ticket.statut === filterStatut;
    const matchPriorite = filterPriorite === 'TOUS' || ticket.priorite === filterPriorite;
    return matchSearch && matchStatut && matchPriorite;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Support Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Vue d'ensemble</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'tickets'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Tickets</span>
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {tickets.filter(t => t.statut === 'OUVERT').length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('commandes')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'commandes'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Commandes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'clients'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clients</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rapports')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'rapports'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Rapports</span>
            </div>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Tickets Ouverts</p>
                    <p className="text-4xl font-bold mt-2">{stats.ticketsOuverts}</p>
                    <p className="text-yellow-100 text-xs mt-2">Nécessite attention</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">En Cours</p>
                    <p className="text-4xl font-bold mt-2">{stats.ticketsEnCours}</p>
                    <p className="text-blue-100 text-xs mt-2">En traitement</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock className="h-10 w-10" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Taux Résolution</p>
                    <p className="text-4xl font-bold mt-2">{stats.tauxResolution}%</p>
                    <p className="text-green-100 text-xs mt-2">Ce mois</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Satisfaction</p>
                    <p className="text-4xl font-bold mt-2">{stats.satisfactionMoyenne}/5</p>
                    <p className="text-purple-100 text-xs mt-2">Moyenne clients</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Star className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Temps de Réponse</h3>
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">{stats.tempsReponseMonyen} min</p>
                <p className="text-sm text-gray-600 mt-2">Moyenne de réponse</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">75%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Tickets Résolus</h3>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.ticketsResolus}</p>
                <p className="text-sm text-gray-600 mt-2">Ce mois</p>
                <div className="mt-4 flex items-center space-x-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+12% vs mois dernier</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Clients Actifs</h3>
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">{clients.length}</p>
                <p className="text-sm text-gray-600 mt-2">Contacts récents</p>
                <div className="mt-4 flex items-center space-x-2 text-purple-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-semibold">Active support</span>
                </div>
              </div>
            </div>

            {/* Tickets récents prioritaires */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <span>Tickets Prioritaires</span>
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  Voir tous →
                </button>
              </div>
              <div className="space-y-3">
                {tickets
                  .filter(t => t.priorite === 'URGENTE' || t.priorite === 'HAUTE')
                  .slice(0, 5)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getPrioriteColor(ticket.priorite)}`}>
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ticket.sujet}</p>
                          <p className="text-sm text-gray-600">{ticket.clientNom} • {ticket.numero}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRepondreTicket(ticket)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        Traiter
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un ticket, client, numéro..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="TOUS">Tous les statuts</option>
                    <option value="OUVERT">Ouverts</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="RESOLU">Résolus</option>
                    <option value="FERME">Fermés</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterPriorite}
                    onChange={(e) => setFilterPriorite(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="TOUS">Toutes priorités</option>
                    <option value="URGENTE">Urgente</option>
                    <option value="HAUTE">Haute</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="BASSE">Basse</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                          {ticket.numero}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatutColor(ticket.statut)}`}>
                          {ticket.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPrioriteColor(ticket.priorite)}`}>
                          {ticket.priorite}
                        </span>
                        <span className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-lg">
                          {ticket.categorie}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.sujet}</h3>
                      <p className="text-gray-600 mb-4">{ticket.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{ticket.clientNom}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{ticket.clientEmail}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(ticket.dateCreation).toLocaleDateString('fr-FR')}</span>
                        </span>
                        {ticket.commandeId && (
                          <span className="flex items-center space-x-2 text-blue-600">
                            <ShoppingBag className="h-4 w-4" />
                            <span>{ticket.numeroCommande}</span>
                          </span>
                        )}
                      </div>
                      {ticket.reponses.length > 0 && (
                        <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                          <MessageCircle className="h-4 w-4" />
                          <span className="font-semibold">{ticket.reponses.length} réponse(s)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleRepondreTicket(ticket)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                        <span>Répondre</span>
                      </button>
                      {ticket.statut !== 'RESOLU' && (
                        <button
                          onClick={() => handleChangerStatut(ticket.id, 'RESOLU')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Résoudre</span>
                        </button>
                      )}
                      <button
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Détails</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commandes Tab */}
        {activeTab === 'commandes' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Commandes avec Problèmes</h2>
              <p className="text-gray-600 mb-6">Cette section affichera les commandes nécessitant une assistance.</p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Actualiser les données
              </button>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Liste des Clients</h2>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {client.prenom} {client.nom}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </span>
                          {client.telephone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{client.telephone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{client.nombreCommandes}</p>
                        <p className="text-gray-600">Commandes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{client.nombreTickets}</p>
                        <p className="text-gray-600">Tickets</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Contacter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rapports Tab */}
        {activeTab === 'rapports' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rapports et Analyses</h2>
              <p className="text-gray-600 mb-6">
                Statistiques détaillées et rapports de performance du support.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Générer un rapport
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Réponse Ticket */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowTicketModal(false)}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Répondre au Ticket</h2>
                    <p className="text-blue-100 mt-1">{selectedTicket.numero}</p>
                  </div>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPrioriteColor(selectedTicket.priorite)}`}>
                      {selectedTicket.priorite}
                    </span>
                    <span className="text-sm text-gray-500">{selectedTicket.categorie}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedTicket.sujet}</h3>
                  <p className="text-gray-700 mb-4">{selectedTicket.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{selectedTicket.clientNom}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{selectedTicket.clientEmail}</span>
                    </span>
                  </div>
                </div>

                {selectedTicket.reponses.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <span>Historique des réponses</span>
                    </h4>
                    {selectedTicket.reponses.map((rep, index) => (
                      <div key={index} className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-blue-900">{rep.auteurNom}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(rep.dateCreation).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <p className="text-gray-700">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Votre réponse</label>
                  <textarea
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Écrivez votre réponse ici..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleEnvoyerReponse}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    <Send className="h-5 w-5" />
                    <span>Envoyer la réponse</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboardComplete;

