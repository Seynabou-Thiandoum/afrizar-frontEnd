import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  X
} from 'lucide-react';
import commandeService, { Commande, CommandeStatistics } from '../../services/commandeService';

const AdminOrders = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('ALL');
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statistics, setStatistics] = useState<CommandeStatistics | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const statuts = [
    { value: 'ALL', label: 'Tous', color: 'gray' },
    { value: 'EN_ATTENTE', label: 'En attente', color: 'yellow' },
    { value: 'CONFIRMEE', label: 'Confirmée', color: 'blue' },
    { value: 'EN_PREPARATION', label: 'En préparation', color: 'purple' },
    { value: 'PRETE', label: 'Prête', color: 'indigo' },
    { value: 'EXPEDIEE', label: 'Expédiée', color: 'cyan' },
    { value: 'EN_LIVRAISON', label: 'En livraison', color: 'orange' },
    { value: 'LIVREE', label: 'Livrée', color: 'green' },
    { value: 'ANNULEE', label: 'Annulée', color: 'red' },
    { value: 'RETOURNEE', label: 'Retournée', color: 'pink' },
    { value: 'REMBOURSEE', label: 'Remboursée', color: 'violet' }
  ];

  useEffect(() => {
    loadCommandes();
    loadStatistics();
  }, [currentPage, filterStatut]);

  const loadCommandes = async () => {
    setLoading(true);
    try {
      if (filterStatut === 'ALL') {
        const data = await commandeService.getAllCommandes(currentPage, 20);
        setCommandes(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        const data = await commandeService.getCommandesByStatut(filterStatut);
        setCommandes(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des commandes' });
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await commandeService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques');
    }
  };

  const handleChangeStatut = async (commandeId: number, newStatut: string) => {
    try {
      await commandeService.changeStatut(commandeId, newStatut);
      setMessage({ type: 'success', text: 'Statut modifié avec succès' });
      loadCommandes();
      if (selectedCommande && selectedCommande.id === commandeId) {
        const updated = await commandeService.getCommandeById(commandeId);
        setSelectedCommande(updated);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de statut' });
    }
  };

  const handleConfirmer = async (commandeId: number) => {
    try {
      await commandeService.confirmerCommande(commandeId);
      setMessage({ type: 'success', text: 'Commande confirmée' });
      loadCommandes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la confirmation' });
    }
  };

  const handleAnnuler = async (commandeId: number) => {
    const motif = prompt('Motif d\'annulation (optionnel):');
    try {
      await commandeService.annulerCommande(commandeId, motif || undefined);
      setMessage({ type: 'success', text: 'Commande annulée' });
      loadCommandes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'annulation' });
    }
  };

  const handleExpedier = async (commandeId: number) => {
    const numeroSuivi = prompt('Numéro de suivi:');
    const transporteur = prompt('Transporteur:');
    if (!numeroSuivi || !transporteur) return;
    try {
      await commandeService.expedierCommande(commandeId, numeroSuivi, transporteur);
      setMessage({ type: 'success', text: 'Commande expédiée' });
      loadCommandes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'expédition' });
    }
  };

  const handleLivrer = async (commandeId: number) => {
    if (!confirm('Confirmer la livraison de cette commande ?')) return;
    try {
      await commandeService.livrerCommande(commandeId);
      setMessage({ type: 'success', text: 'Commande livrée' });
      loadCommandes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la livraison' });
    }
  };

  const openDetailModal = (commande: Commande) => {
    setSelectedCommande(commande);
    setShowDetailModal(true);
  };

  const filteredCommandes = commandes.filter(commande =>
    commande.numeroCommande.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (commande.clientNom && commande.clientNom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (commande.clientPrenom && commande.clientPrenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statut: string) => {
    const status = statuts.find(s => s.value === statut);
    return status ? status.color : 'gray';
  };

  const getStatusLabel = (statut: string) => {
    const status = statuts.find(s => s.value === statut);
    return status ? status.label : statut;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Package className="h-8 w-8 text-red-600" />
            <span>Gestion des Commandes</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les commandes clients et suivez leur statut
          </p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Chiffre d'affaires</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(statistics.chiffreAffaires)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(statistics.panierMoyen)}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">En attente</p>
                <p className="text-2xl font-bold mt-2">{statistics.commandesEnAttente}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total commandes</p>
                <p className="text-2xl font-bold mt-2">{statistics.totalCommandes}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par numéro, client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatut}
              onChange={(e) => {
                setFilterStatut(e.target.value);
                setCurrentPage(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {statuts.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : filteredCommandes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {filteredCommandes.map((commande) => (
                    <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{commande.numeroCommande}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {commande.clientPrenom} {commande.clientNom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(commande.dateCreation)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(commande.montantTotal)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(commande.statut)}-100 text-${getStatusColor(commande.statut)}-800`}>
                          {getStatusLabel(commande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openDetailModal(commande)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {commande.statut === 'EN_ATTENTE' && (
                            <>
                              <button
                                onClick={() => handleConfirmer(commande.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Confirmer"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAnnuler(commande.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Annuler"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {commande.statut === 'PRETE' && (
                            <button
                              onClick={() => handleExpedier(commande.id)}
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                              title="Expédier"
                            >
                              <Truck className="h-4 w-4" />
                            </button>
                          )}
                          {commande.statut === 'EN_LIVRAISON' && (
                            <button
                              onClick={() => handleLivrer(commande.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Marquer comme livrée"
                            >
                              <PackageCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-xl shadow-sm">
              <div className="text-sm text-gray-700">
                Affichage de {currentPage * 20 + 1} à {Math.min((currentPage + 1) * 20, totalElements)} sur {totalElements} commandes
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage + 1} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCommande && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowDetailModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Info générale */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Numéro de commande</h3>
                      <p className="text-lg font-bold text-gray-900">{selectedCommande.numeroCommande}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedCommande.clientPrenom} {selectedCommande.clientNom}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date de création</h3>
                      <p className="text-base text-gray-900">{formatDate(selectedCommande.dateCreation)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(selectedCommande.statut)}-100 text-${getStatusColor(selectedCommande.statut)}-800`}>
                          {getStatusLabel(selectedCommande.statut)}
                        </span>
                        <select
                          value={selectedCommande.statut}
                          onChange={(e) => handleChangeStatut(selectedCommande.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {statuts.filter(s => s.value !== 'ALL').map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Lignes de commande */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Articles commandés</h3>
                    <div className="space-y-2">
                      {selectedCommande.lignesCommande.map((ligne, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{ligne.nomProduit}</p>
                            <p className="text-sm text-gray-600">Quantité: {ligne.quantite}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(ligne.prixTotal)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(ligne.prixUnitaire)} / unité</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totaux */}
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
                    {selectedCommande.reduction > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Réduction :</span>
                        <span className="font-semibold text-green-600">-{formatCurrency(selectedCommande.reduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                      <span className="text-gray-900">Total :</span>
                      <span className="text-gray-900">{formatCurrency(selectedCommande.montantTotal)}</span>
                    </div>
                  </div>

                  {selectedCommande.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedCommande.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;


