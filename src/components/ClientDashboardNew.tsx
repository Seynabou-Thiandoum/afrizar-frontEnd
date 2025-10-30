import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Truck,
  CheckCircle,
  Clock,
  Gift,
  TrendingUp,
  ArrowLeft,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  ShoppingCart,
  Sparkles,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePanier } from '../contexts/PanierContext';
import commandeService, { Commande } from '../services/commandeService';
import favorisService, { Favori } from '../services/favorisService';
import { getImageUrl as getFullImageUrl, API_CONFIG } from '../config/api';
import Swal from 'sweetalert2';

interface ClientDashboardNewProps {
  onNavigate?: (page: string, data?: any) => void;
}

const ClientDashboardNew: React.FC<ClientDashboardNewProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { panier, modifierQuantite, retirerDuPanier, viderPanier, rafraichirPanier } = usePanier();
  const [activeView, setActiveView] = useState<'dashboard' | 'panier' | 'commandes' | 'favoris' | 'profil' | 'points'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pointsFidelite, setPointsFidelite] = useState<number>(0);

  // Charger les données au montage et quand la vue change
  useEffect(() => {
    chargerDonnees();
    if (activeView === 'panier') {
      rafraichirPanier();
    }
  }, [activeView, user]);

  const chargerDonnees = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Charger les commandes
      const commandesData = await commandeService.obtenirMesCommandes();
      const commandesList = commandesData.content || commandesData || [];
      setCommandes(commandesList);
      
      // Charger les points de fidélité
      await chargerPointsFidelite();
      
      // Charger les favoris
      try {
        const favorisData = await favorisService.obtenirFavoris();
        setFavoris(favorisData);
      } catch (error) {
        console.log('Favoris non disponibles:', error);
        setFavoris([]);
      }
      
      // Calculer les statistiques depuis les commandes
      calculerStats(commandesList);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement des données',
        confirmButtonColor: '#F99834'
      });
    } finally {
      setLoading(false);
    }
  };

  const chargerPointsFidelite = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('afrizar_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/clients/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const clientData = await response.json();
        setPointsFidelite(clientData.pointsFidelite || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des points:', error);
    }
  };

  const calculerStats = (commandesList: Commande[]) => {
    const commandesEnCours = commandesList.filter(c => 
      ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'EN_LIVRAISON'].includes(c.statut)
    ).length;
    
    const commandesLivrees = commandesList.filter(c => c.statut === 'LIVREE').length;
    
    // Calculer les réductions depuis les points utilisés (approximation)
    const totalEconomise = commandesList.reduce((sum, c) => {
      // Les points utilisés sont généralement égaux à la réduction en FCFA (1 point = 1 FCFA)
      const reduction = (c as any).pointsFideliteUtilises || 0;
      return sum + reduction;
    }, 0);
    
    setStats({
      commandesEnCours,
      commandesLivrees,
      pointsFidelite: pointsFidelite || 0,
      economise: totalEconomise,
      totalCommandes: commandesList.length
    });
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  const handleVoirDetails = (commande: Commande) => {
    setSelectedCommande(commande);
    setShowModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return { icon: Clock, color: 'yellow', label: 'En attente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      case 'CONFIRMEE':
        return { icon: CheckCircle, color: 'blue', label: 'Confirmée', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'EN_PREPARATION':
        return { icon: Package, color: 'purple', label: 'En préparation', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
      case 'EXPEDIEE':
        return { icon: Truck, color: 'indigo', label: 'Expédiée', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' };
      case 'EN_LIVRAISON':
        return { icon: Truck, color: 'orange', label: 'En livraison', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      case 'LIVREE':
        return { icon: CheckCircle, color: 'green', label: 'Livrée', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      default:
        return { icon: Clock, color: 'gray', label: statut, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Mon Espace</h1>
              <p className="text-xs text-gray-500">Afrizar.sn</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveView('commandes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'commandes'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Mes Commandes</span>
            {stats && stats.commandesEnCours > 0 && (
              <span className="ml-auto bg-[#F99834] text-white text-xs px-2 py-1 rounded-full">
                {stats.commandesEnCours}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('panier')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'panier'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Mon Panier</span>
            {panier && panier.nombreTotalArticles > 0 && (
              <span className="ml-auto bg-[#F99834] text-white text-xs px-2 py-1 rounded-full">
                {panier.nombreTotalArticles}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('favoris')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'favoris'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span>Mes Favoris</span>
            {favoris.length > 0 && (
              <span className="ml-auto bg-[#F99834] text-white text-xs px-2 py-1 rounded-full">
                {favoris.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('points')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'points'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Gift className="h-5 w-5" />
            <span>Points Fidélité</span>
            {pointsFidelite > 0 && (
              <span className="ml-auto bg-[#F99834] text-white text-xs px-2 py-1 rounded-full">
                {pointsFidelite}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('profil')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'profil'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold border-2 border-[#F99834]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Mon Profil</span>
          </button>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500">Client</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => {
                    setActiveView('profil');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Mon Profil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Tableau de bord'}
                {activeView === 'panier' && 'Mon Panier'}
                {activeView === 'commandes' && 'Mes Commandes'}
                {activeView === 'favoris' && 'Mes Favoris'}
                {activeView === 'points' && 'Points de Fidélité'}
                {activeView === 'profil' && 'Mon Profil'}
              </h2>
              <p className="text-gray-600 mt-1">
                {activeView === 'dashboard' && 'Vue d\'ensemble de votre espace client'}
                {activeView === 'panier' && 'Gérez vos articles et passez commande'}
                {activeView === 'commandes' && 'Suivez l\'état de vos commandes'}
                {activeView === 'favoris' && 'Produits sauvegardés pour plus tard'}
                {activeView === 'points' && 'Gérez vos points de fidélité'}
                {activeView === 'profil' && 'Gérez vos informations personnelles'}
              </p>
            </div>
            {activeView !== 'dashboard' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading && activeView === 'dashboard' && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F99834]"></div>
            </div>
          )}

          {activeView === 'dashboard' && !loading && (
            <div className="space-y-6">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#F99834]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commandes en cours</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.commandesEnCours}</p>
                        <p className="text-sm text-[#F99834] mt-1">En traitement</p>
                      </div>
                      <div className="bg-[#F99834] p-3 rounded-lg">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commandes livrées</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.commandesLivrees}</p>
                        <p className="text-sm text-green-600 mt-1">Terminées</p>
                      </div>
                      <div className="bg-green-500 p-3 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Points de fidélité</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{pointsFidelite.toLocaleString()}</p>
                        <p className="text-sm text-yellow-600 mt-1">Disponibles</p>
                      </div>
                      <div className="bg-yellow-500 p-3 rounded-lg">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total économisé</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.economise)}</p>
                        <p className="text-sm text-purple-600 mt-1">Avec points</p>
                      </div>
                      <div className="bg-purple-500 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('vetements');
                    } else {
                      window.location.hash = 'vetements';
                    }
                  }}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#F99834]"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-xl flex items-center justify-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuer mes achats</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Découvrez nos dernières collections
                  </p>
                  <div className="text-[#F99834] text-sm font-medium">Voir les produits →</div>
                </button>

                {panier && panier.nombreTotalArticles > 0 && (
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('cart');
                      } else {
                        window.location.hash = 'cart';
                      }
                    }}
                    className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#F99834]"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-xl flex items-center justify-center mb-4">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mon Panier</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {panier.nombreTotalArticles} article{panier.nombreTotalArticles > 1 ? 's' : ''} • {panier.montantTotal.toLocaleString()} FCFA
                    </p>
                    <div className="text-[#F99834] text-sm font-medium">Voir mon panier →</div>
                  </button>
                )}

                <button
                  onClick={() => setActiveView('commandes')}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#F99834]"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes Commandes</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {stats ? stats.totalCommandes : '...'} commande{stats && stats.totalCommandes > 1 ? 's' : ''} au total
                  </p>
                  <div className="text-[#F99834] text-sm font-medium">Voir toutes les commandes →</div>
                </button>
              </div>

              {/* Recent Orders */}
              {commandes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
                    <button
                      onClick={() => setActiveView('commandes')}
                      className="text-sm text-[#F99834] hover:text-[#E5861A] font-medium"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {commandes.slice(0, 3).map((commande) => {
                      const statutInfo = getStatutInfo(commande.statut);
                      const StatutIcon = statutInfo.icon;
                      
                      return (
                        <div key={commande.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 ${statutInfo.bgColor} rounded-lg`}>
                              <StatutIcon className={`h-6 w-6 ${statutInfo.textColor}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{commande.numeroCommande}</p>
                              <p className="text-sm text-gray-600">{formatDate(commande.dateCreation)}</p>
                              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${statutInfo.bgColor} ${statutInfo.textColor}`}>
                                {statutInfo.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatCurrency(commande.montantTotal)}</p>
                            <button
                              onClick={() => handleVoirDetails(commande)}
                              className="mt-2 flex items-center space-x-1 text-[#F99834] hover:text-[#E5861A] text-sm"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Voir détails</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'commandes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des Commandes</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F99834] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des commandes...</p>
                  </div>
                ) : commandes.length > 0 ? (
                  <div className="space-y-4">
                    {commandes.map((commande) => {
                      const statutInfo = getStatutInfo(commande.statut);
                      const StatutIcon = statutInfo.icon;
                      
                      return (
                        <div key={commande.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-mono text-lg font-bold text-gray-900">{commande.numeroCommande}</p>
                              <p className="text-sm text-gray-600 mt-1">{formatDate(commande.dateCreation)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 ${statutInfo.bgColor} rounded-lg`}>
                                <StatutIcon className={`h-5 w-5 ${statutInfo.textColor}`} />
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statutInfo.bgColor} ${statutInfo.textColor}`}>
                                {statutInfo.label}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {(commande.lignesCommande || []).map((ligne, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                  <p className="font-medium text-gray-900">{ligne.produitNom}</p>
                                  <p className="text-sm text-gray-600">Quantité: {ligne.quantite}</p>
                                </div>
                                <p className="font-semibold text-gray-900">{formatCurrency(ligne.sousTotal)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              <p>Sous-total: {formatCurrency(commande.montantHT)}</p>
                              {commande.fraisLivraison > 0 && (
                                <p>Livraison: {formatCurrency(commande.fraisLivraison)}</p>
                              )}
                              {(commande as any).pointsFideliteUtilises > 0 && (
                                <p className="text-green-600">Réduction: -{formatCurrency((commande as any).pointsFideliteUtilises)}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="text-2xl font-bold text-[#F99834]">{formatCurrency(commande.montantTotal)}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleVoirDetails(commande)}
                            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                            <span>Voir les détails</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
                    <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('vetements');
                        } else {
                          window.location.hash = 'vetements';
                        }
                      }}
                      className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors font-medium"
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'panier' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Panier</h2>
                
                {panier && panier.items.length > 0 ? (
                  <div className="space-y-4">
                    {panier.items.map((item, index) => {
                      const gallery = item.produitPhotos && item.produitPhotos.length > 0 
                        ? item.produitPhotos.map(photo => getFullImageUrl(photo))
                        : [getFullImageUrl(null)];
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            {/* Image du produit */}
                            <div className="flex-shrink-0 relative group">
                              <img
                                src={gallery[0]}
                                alt={item.produitNom}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              {/* Miniatures si plusieurs images */}
                              {gallery.length > 1 && (
                                <div className="absolute bottom-0 left-0 right-0 flex space-x-1 p-1 bg-black bg-opacity-50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  {gallery.slice(0, 3).map((img, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="flex-1 h-8 rounded overflow-hidden"
                                    >
                                      <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                  {gallery.length > 3 && (
                                    <div className="flex items-center justify-center w-8 h-8 text-white text-xs font-bold">
                                      +{gallery.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Informations du produit */}
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">{item.produitNom}</h3>
                              <p className="text-sm text-gray-600 mb-2">{item.nomBoutique}</p>
                              
                              {/* Options sélectionnées */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {item.taille && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    Taille: {item.taille}
                                  </span>
                                )}
                                {item.couleur && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    Couleur: {item.couleur}
                                  </span>
                                )}
                              </div>

                              {/* Contrôles de quantité */}
                              <div className="flex items-center space-x-3 mt-3">
                                <button
                                  onClick={async () => {
                                    if (item.quantite > 1) {
                                      try {
                                        await modifierQuantite(index, item.quantite - 1);
                                      } catch (error) {
                                        console.error('Erreur:', error);
                                      }
                                    }
                                  }}
                                  disabled={item.quantite <= 1}
                                  className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-semibold text-gray-900 w-8 text-center">{item.quantite}</span>
                                <button
                                  onClick={async () => {
                                    try {
                                      await modifierQuantite(index, item.quantite + 1);
                                    } catch (error) {
                                      console.error('Erreur:', error);
                                    }
                                  }}
                                  disabled={!!item.stockDisponible && item.quantite >= item.stockDisponible}
                                  className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                {item.stockDisponible && item.stockDisponible < 5 && (
                                  <span className="text-xs text-orange-600 font-medium">
                                    Stock limité ({item.stockDisponible} restants)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Prix et actions */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {item.prixUnitaire.toLocaleString()} FCFA
                              </p>
                              <p className="text-sm text-gray-600">
                                Sous-total: {item.sousTotal.toLocaleString()} FCFA
                              </p>
                              <button
                                onClick={async () => {
                                  const result = await Swal.fire({
                                    title: 'Retirer l\'article',
                                    text: 'Voulez-vous vraiment retirer cet article du panier ?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Oui, retirer',
                                    cancelButtonText: 'Annuler'
                                  });
                                  
                                  if (result.isConfirmed) {
                                    try {
                                      await retirerDuPanier(index);
                                      Swal.fire({
                                        icon: 'success',
                                        title: 'Article retiré',
                                        text: 'L\'article a été retiré du panier',
                                        timer: 2000,
                                        showConfirmButton: false,
                                        confirmButtonColor: '#F99834'
                                      });
                                    } catch (error: any) {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Erreur',
                                        text: error.message || 'Erreur lors du retrait',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: '#F99834'
                                      });
                                    }
                                  }
                                }}
                                className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Retirer</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total du panier */}
                    <div className="border-t pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-[#F99834]">
                          {panier.montantTotal.toLocaleString()} FCFA
                        </span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex space-x-4">
                        <button
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('checkout');
                            } else {
                              window.location.hash = 'checkout';
                            }
                          }}
                          className="flex-1 py-3 text-white rounded-lg transition-colors font-semibold bg-[#F99834] hover:bg-[#E5861A]"
                        >
                          Passer la commande
                        </button>
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: 'Vider le panier',
                              text: 'Voulez-vous vraiment vider votre panier ? Cette action est irréversible.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#d33',
                              cancelButtonColor: '#3085d6',
                              confirmButtonText: 'Oui, vider',
                              cancelButtonText: 'Annuler'
                            });
                            
                            if (result.isConfirmed) {
                              try {
                                await viderPanier();
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Panier vidé',
                                  text: 'Votre panier a été vidé',
                                  timer: 2000,
                                  showConfirmButton: false,
                                  confirmButtonColor: '#F99834'
                                });
                              } catch (error: any) {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Erreur',
                                  text: error.message || 'Erreur lors du vidage',
                                  confirmButtonText: 'OK',
                                  confirmButtonColor: '#F99834'
                                });
                              }
                            }
                          }}
                          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Vider le panier
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
                    <p className="text-gray-600 mb-6">Commencez vos achats en parcourant nos catégories</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('vetements');
                          } else {
                            window.location.hash = 'vetements';
                          }
                        }}
                        className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors font-medium"
                      >
                        Voir les Vêtements
                      </button>
                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('accessoires');
                          } else {
                            window.location.hash = 'accessoires';
                          }
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Voir les Accessoires
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'favoris' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Produits Favoris</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F99834] mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des favoris...</p>
                </div>
              ) : favoris.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoris.map((favori) => (
                    <div key={favori.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow relative">
                      <div className="relative">
                        <img
                          src={getFullImageUrl(favori.produit?.imageUrl)}
                          alt={favori.produit?.nom || 'Produit'}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <button
                          onClick={async () => {
                            try {
                              await favorisService.supprimerFavori(favori.produitId);
                              await chargerDonnees();
                              Swal.fire({
                                icon: 'success',
                                title: 'Retiré des favoris',
                                text: 'Le produit a été retiré de vos favoris',
                                timer: 2000,
                                showConfirmButton: false,
                                confirmButtonColor: '#F99834'
                              });
                            } catch (error: any) {
                              Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: error.message || 'Erreur lors du retrait',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#F99834'
                              });
                            }
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{favori.produit?.nom || 'Produit'}</h3>
                      <p className="text-sm text-gray-600 mb-2">Par {favori.produit?.vendeur?.nomBoutique || 'Afrizar'}</p>
                      <p className="text-lg font-bold text-[#F99834] mb-3">
                        {favori.produit?.prix.toLocaleString() || '0'} FCFA
                      </p>
                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('produit', { id: favori.produitId });
                          } else {
                            window.location.hash = `produit/${favori.produitId}`;
                          }
                        }}
                        className="w-full px-4 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
                      >
                        Voir le produit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori</h3>
                  <p className="text-gray-600 mb-6">Vous n'avez pas encore de produits favoris</p>
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('vetements');
                      } else {
                        window.location.hash = 'vetements';
                      }
                    }}
                    className="px-6 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
                  >
                    Découvrir les produits
                  </button>
                </div>
              )}
            </div>
          )}

          {activeView === 'points' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Points de Fidélité</h2>
                
                {/* Solde des points */}
                <div className="bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Solde actuel</p>
                      <p className="text-3xl font-bold">{pointsFidelite.toLocaleString()} points</p>
                      <p className="text-sm text-orange-200 mt-2">1 point = 1 FCFA de réduction</p>
                    </div>
                    <Gift className="h-16 w-16 text-orange-200" />
                  </div>
                </div>

                {/* Comment gagner des points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Comment gagner des points ?
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 1% du montant de chaque commande</li>
                      <li>• 50 points bonus pour votre première commande</li>
                      <li>• 25 points pour chaque avis laissé</li>
                      <li>• 100 points pour parrainer un ami</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                      <Gift className="h-5 w-5 mr-2" />
                      Comment utiliser vos points ?
                    </h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• 1 point = 1 FCFA de réduction</li>
                      <li>• Utilisable sur toutes vos commandes</li>
                      <li>• Pas de limite d'utilisation</li>
                      <li>• Points valables indéfiniment</li>
                    </ul>
                  </div>
                </div>

                {/* Historique des points */}
                {commandes.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Historique récent</h3>
                    <div className="space-y-3">
                      {commandes.slice(0, 5).map((commande) => {
                        const pointsGagnes = Math.floor(commande.montantTotal * 0.01);
                        const pointsUtilises = (commande as any).pointsFideliteUtilises || 0;
                        return (
                          <div key={commande.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{commande.numeroCommande}</span>
                              <p className="text-xs text-gray-600">{formatDate(commande.dateCreation)}</p>
                            </div>
                            <div className="text-right">
                              {pointsUtilises > 0 ? (
                                <span className="text-sm font-semibold text-red-600">-{pointsUtilises} points</span>
                              ) : (
                                <span className="text-sm font-semibold text-green-600">+{pointsGagnes} points</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'profil' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors">
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#F99834]" />
                      Prénom
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">{user?.firstName || 'Non renseigné'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#F99834]" />
                      Nom
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">{user?.lastName || 'Non renseigné'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#F99834]" />
                      Email
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[#F99834]" />
                      Téléphone
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">Non renseigné</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#F99834]" />
                  Adresse de Livraison
                </h2>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <MapPin className="h-5 w-5 text-[#F99834] mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Adresse principale</p>
                    <p className="text-gray-600 text-sm mt-1">À configurer dans vos paramètres</p>
                  </div>
                  <button className="px-3 py-1 text-sm text-[#F99834] hover:text-[#E5861A] font-medium">
                    Modifier
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#F99834]" />
                  Moyens de Paiement
                </h2>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <CreditCard className="h-5 w-5 text-[#F99834] mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Aucune carte enregistrée</p>
                    <p className="text-gray-600 text-sm mt-1">Ajoutez une carte pour un paiement plus rapide</p>
                  </div>
                  <button className="px-3 py-1 text-sm text-[#F99834] hover:text-[#E5861A] font-medium">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Commande */}
      {showModal && selectedCommande && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Détails de la Commande</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Numéro de commande</p>
                      <p className="font-mono font-bold text-gray-900">{selectedCommande.numeroCommande}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(selectedCommande.dateCreation)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      {(() => {
                        const statutInfo = getStatutInfo(selectedCommande.statut);
                        return (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statutInfo.bgColor} ${statutInfo.textColor}`}>
                            {statutInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{selectedCommande.type}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Articles commandés</h3>
                    <div className="space-y-2">
                      {(selectedCommande.lignesCommande || []).map((ligne, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900">{ligne.produitNom}</p>
                            <p className="text-sm text-gray-600">Quantité: {ligne.quantite} × {formatCurrency(ligne.prixUnitaire)}</p>
                          </div>
                          <p className="font-bold text-gray-900">{formatCurrency(ligne.sousTotal)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total :</span>
                      <span className="font-semibold">{formatCurrency(selectedCommande.montantHT)}</span>
                    </div>
                    {selectedCommande.fraisLivraison > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frais de livraison :</span>
                        <span className="font-semibold">{formatCurrency(selectedCommande.fraisLivraison)}</span>
                      </div>
                    )}
                    {(selectedCommande as any).pointsFideliteUtilises > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Réduction (points) :</span>
                        <span className="font-semibold text-green-600">-{formatCurrency((selectedCommande as any).pointsFideliteUtilises)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                      <span className="text-gray-900">Total :</span>
                      <span className="text-[#F99834]">{formatCurrency(selectedCommande.montantTotal)}</span>
                    </div>
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

export default ClientDashboardNew;
