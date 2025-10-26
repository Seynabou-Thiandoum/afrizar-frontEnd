import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Star,
  Gift,
  TrendingUp,
  X,
  Edit,
  Mail,
  Phone,
  ShoppingCart,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePanier } from '../contexts/PanierContext';
import commandeService, { Commande } from '../services/commandeService';
import favorisService, { Favori } from '../services/favorisService';
import fraisLivraisonService, { FraisLivraison } from '../services/fraisLivraisonService';
import { getImageUrl as getFullImageUrl } from '../config/api';
import Swal from 'sweetalert2';

const ClientDashboardNew = () => {
  const { user, logout } = useAuth();
  const { panier, modifierQuantite, retirerDuPanier, viderPanier, rafraichirPanier } = usePanier();
  const [activeView, setActiveView] = useState<'dashboard' | 'panier' | 'commandes' | 'favoris' | 'profil' | 'points'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [fraisLivraison, setFraisLivraison] = useState<FraisLivraison[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stats = {
    commandesEnCours: 2,
    commandesLivrees: 15,
    pointsFidelite: 350,
    economise: 12500
  };

  // Mock commandes pour démonstration
  const mockCommandes: Commande[] = [
    {
      id: 1,
      numeroCommande: 'CMD-001',
      dateCreation: new Date().toISOString(),
      statut: 'EN_LIVRAISON',
      type: 'IMMEDIATE',
      montantHT: 45000,
      montantCommission: 3600,
      fraisLivraison: 2000,
      montantTotal: 50600,
      pointsFideliteUtilises: 0,
      reduction: 0,
      clientId: user?.id || 0,
      clientNom: user?.nom,
      clientPrenom: user?.prenom,
      lignesCommande: [
        {
          produitId: 1,
          nomProduit: 'Boubou traditionnel brodé',
          quantite: 2,
          prixUnitaire: 22500,
          prixTotal: 45000
        }
      ]
    },
    {
      id: 2,
      numeroCommande: 'CMD-002',
      dateCreation: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'LIVREE',
      type: 'IMMEDIATE',
      montantHT: 15000,
      montantCommission: 1200,
      fraisLivraison: 1500,
      montantTotal: 17700,
      pointsFideliteUtilises: 0,
      reduction: 0,
      clientId: user?.id || 0,
      clientNom: user?.nom,
      clientPrenom: user?.prenom,
      lignesCommande: [
        {
          produitId: 2,
          nomProduit: 'Collier en perles',
          quantite: 1,
          prixUnitaire: 15000,
          prixTotal: 15000
        }
      ]
    }
  ];

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      // Charger les vraies commandes du client
      const commandesData = await commandeService.obtenirMesCommandes();
      setCommandes(commandesData);
      
      // Charger les frais de livraison
      const fraisData = await fraisLivraisonService.obtenirOptionsLivraison();
      setFraisLivraison(fraisData);
      
      // Charger les favoris
      try {
        const favorisData = await favorisService.obtenirMesFavoris();
        setFavoris(favorisData);
      } catch (error) {
        console.log('Favoris non disponibles:', error);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser les données mock
      setCommandes(mockCommandes);
    } finally {
      setLoading(false);
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
        return { icon: Clock, color: 'yellow', label: 'En attente' };
      case 'CONFIRMEE':
        return { icon: CheckCircle, color: 'blue', label: 'Confirmée' };
      case 'EN_PREPARATION':
        return { icon: Package, color: 'purple', label: 'En préparation' };
      case 'EXPEDIEE':
        return { icon: Truck, color: 'indigo', label: 'Expédiée' };
      case 'EN_LIVRAISON':
        return { icon: Truck, color: 'orange', label: 'En livraison' };
      case 'LIVREE':
        return { icon: CheckCircle, color: 'green', label: 'Livrée' };
      default:
        return { icon: Clock, color: 'gray', label: statut };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Espace</h1>
                <p className="text-sm text-gray-600">Bienvenue, {user?.prenom}</p>
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
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Tableau de bord</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('commandes')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'commandes'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Mes Commandes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('panier')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'panier'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Mon Panier</span>
              {panier && panier.nombreTotalArticles > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {panier.nombreTotalArticles}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveView('favoris')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'favoris'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Mes Favoris</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('points')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'points'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Gift className="h-5 w-5" />
              <span>Points Fidélité</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('profil')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeView === 'profil'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <User className="h-5 w-5" />
              <span>Mon Profil</span>
            </div>
          </button>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Commandes en cours</p>
                    <p className="text-3xl font-bold mt-2">{stats.commandesEnCours}</p>
                  </div>
                  <Truck className="h-12 w-12 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Commandes livrées</p>
                    <p className="text-3xl font-bold mt-2">{stats.commandesLivrees}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Points fidélité</p>
                    <p className="text-3xl font-bold mt-2">{stats.pointsFidelite}</p>
                  </div>
                  <Gift className="h-12 w-12 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Économisé</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.economise)}</p>
                  </div>
                  <Star className="h-12 w-12 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes Récentes</h2>
              <div className="space-y-4">
                {Array.isArray(commandes) ? commandes.slice(0, 3).map((commande) => {
                  const statutInfo = getStatutInfo(commande.statut);
                  const StatutIcon = statutInfo.icon;
                  
                  return (
                    <div key={commande.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 bg-${statutInfo.color}-100 rounded-lg`}>
                          <StatutIcon className={`h-6 w-6 text-${statutInfo.color}-600`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{commande.numeroCommande}</p>
                          <p className="text-sm text-gray-600">{formatDate(commande.dateCreation)}</p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-${statutInfo.color}-100 text-${statutInfo.color}-800`}>
                            {statutInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(commande.montantTotal)}</p>
                        <button
                          onClick={() => handleVoirDetails(commande)}
                          className="mt-2 flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Voir détails</span>
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune commande trouvée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Commandes View */}
        {activeView === 'commandes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des Commandes</h2>
              <div className="space-y-4">
                {Array.isArray(commandes) ? commandes.map((commande) => {
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
                          <div className={`p-2 bg-${statutInfo.color}-100 rounded-lg`}>
                            <StatutIcon className={`h-5 w-5 text-${statutInfo.color}-600`} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statutInfo.color}-100 text-${statutInfo.color}-800`}>
                            {statutInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {commande.lignesCommande.map((ligne, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                              <p className="font-medium text-gray-900">{ligne.nomProduit}</p>
                              <p className="text-sm text-gray-600">Quantité: {ligne.quantite}</p>
                            </div>
                            <p className="font-semibold text-gray-900">{formatCurrency(ligne.prixTotal)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <p>Sous-total: {formatCurrency(commande.montantHT)}</p>
                          <p>Livraison: {formatCurrency(commande.fraisLivraison)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(commande.montantTotal)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleVoirDetails(commande)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                        <span>Voir les détails</span>
                      </button>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune commande trouvée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Panier View */}
        {activeView === 'panier' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Panier</h2>
              
              {panier && panier.items.length > 0 ? (
                <div className="space-y-4">
                  {panier.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {/* Image du produit */}
                        <div className="flex-shrink-0">
                          <img
                            src={getFullImageUrl(item.produitPhotos)}
                            alt={item.produitNom}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
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
                        </div>

                        {/* Prix et contrôles */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {item.prixUnitaire.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-gray-600">
                            Sous-total: {item.sousTotal.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total du panier */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {panier.montantTotal.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => window.location.hash = 'checkout'}
                      className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Passer la commande
                    </button>
                    <button
                      onClick={() => window.location.hash = 'vetements'}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-600 mb-6">Commencez vos achats en parcourant nos catégories</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => window.location.hash = 'vetements'}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Voir les Vêtements
                    </button>
                    <button
                      onClick={() => window.location.hash = 'accessoires'}
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

        {/* Favoris View */}
            {activeView === 'favoris' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Produits Favoris</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Chargement des favoris...</p>
                  </div>
                ) : favoris.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoris.map((favori) => (
                      <div key={favori.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={getFullImageUrl(favori.produitImageUrl)}
                            alt={favori.produitNom}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <button
                            onClick={async () => {
                              try {
                                await favorisService.retirerDesFavoris(favori.id);
                                await chargerDonnees();
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Retiré des favoris',
                                  text: 'Le produit a été retiré de vos favoris',
                                  timer: 2000,
                                  showConfirmButton: false
                                });
                              } catch (error: any) {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Erreur',
                                  text: error.message || 'Erreur lors du retrait',
                                  confirmButtonText: 'OK'
                                });
                              }
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{favori.produitNom}</h3>
                        <p className="text-sm text-gray-600 mb-2">Par {favori.vendeurNom}</p>
                        <p className="text-lg font-bold text-purple-600 mb-3">
                          {favori.produitPrix.toLocaleString()} FCFA
                        </p>
                        <button
                          onClick={() => window.location.hash = `produit/${favori.produitId}`}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Voir le produit
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Vous n'avez pas encore de produits favoris</p>
                    <button
                      onClick={() => window.location.hash = 'vetements'}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Découvrir les produits
                    </button>
                  </div>
                )}
              </div>
            )}

        {/* Points Fidélité View */}
        {activeView === 'points' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Points de Fidélité</h2>
              
              {/* Solde des points */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Solde actuel</p>
                    <p className="text-3xl font-bold">{stats.pointsFidelite} points</p>
                  </div>
                  <Gift className="h-12 w-12 text-purple-200" />
                </div>
              </div>

              {/* Comment gagner des points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Comment gagner des points ?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 1 point par 100 FCFA dépensés</li>
                    <li>• 50 points bonus pour votre première commande</li>
                    <li>• 25 points pour chaque avis laissé</li>
                    <li>• 100 points pour parrainer un ami</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Comment utiliser vos points ?</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 100 points = 1,000 FCFA de réduction</li>
                    <li>• 500 points = 5,000 FCFA de réduction</li>
                    <li>• 1000 points = 10,000 FCFA de réduction</li>
                    <li>• Points valables 1 an</li>
                  </ul>
                </div>
              </div>

              {/* Historique des points */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Historique récent</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Commande #CMD-001</span>
                    <span className="text-sm font-semibold text-green-600">+150 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avis produit</span>
                    <span className="text-sm font-semibold text-green-600">+25 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Utilisation commande</span>
                    <span className="text-sm font-semibold text-red-600">-100 points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profil View */}
        {activeView === 'profil' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span>Modifier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Prénom
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.prenom}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Nom
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.nom}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Téléphone
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.telephone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Adresse de Livraison</h2>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium">Adresse principale</p>
                  <p className="text-gray-600 text-sm mt-1">À configurer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Moyens de Paiement</h2>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium">Aucune carte enregistrée</p>
                  <p className="text-gray-600 text-sm mt-1">Ajoutez une carte pour un paiement plus rapide</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${getStatutInfo(selectedCommande.statut).color}-100 text-${getStatutInfo(selectedCommande.statut).color}-800`}>
                        {getStatutInfo(selectedCommande.statut).label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{selectedCommande.type}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Articles commandés</h3>
                    <div className="space-y-2">
                      {selectedCommande.lignesCommande.map((ligne, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900">{ligne.nomProduit}</p>
                            <p className="text-sm text-gray-600">Quantité: {ligne.quantite} × {formatCurrency(ligne.prixUnitaire)}</p>
                          </div>
                          <p className="font-bold text-gray-900">{formatCurrency(ligne.prixTotal)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total :</span>
                      <span className="font-semibold">{formatCurrency(selectedCommande.montantHT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Commission :</span>
                      <span className="font-semibold text-red-600">+{formatCurrency(selectedCommande.montantCommission)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de livraison :</span>
                      <span className="font-semibold">{formatCurrency(selectedCommande.fraisLivraison)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                      <span className="text-gray-900">Total :</span>
                      <span className="text-gray-900">{formatCurrency(selectedCommande.montantTotal)}</span>
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

