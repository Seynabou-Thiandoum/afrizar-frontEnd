import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  X,
  Trash2, 
  Eye, 
  EyeOff, 
  Flame,
  Sparkles,
  Globe,
  MessageCircle,
  ThumbsUp,
  Share2,
  Star,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import tendanceService, { ProduitTendance } from '../../services/tendanceService';
import actualiteService, { Actualite as ActualiteReelle } from '../../services/actualiteService';

const AdminActualitesMode = () => {
  const [activeTab, setActiveTab] = useState<'actualites' | 'tendances' | 'produits'>('actualites');
  const [actualitesReelles, setActualitesReelles] = useState<ActualiteReelle[]>([]);
  const [produitsTendance, setProduitsTendance] = useState<ProduitTendance[]>([]);
  const [statistiquesActualites, setStatistiquesActualites] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'actualite' | 'tendance' | 'produit'>('actualite');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    chargerDonneesReelles();
  }, []);

  useEffect(() => {
    chargerDonneesReelles();
  }, [activeTab]);

  const chargerDonneesReelles = async () => {
    setLoading(true);
    try {
      if (activeTab === 'produits') {
        const produits = await tendanceService.obtenirProduitsALaModeAdmin();
        // L'API retourne probablement une structure paginée, on prend le contenu
        setProduitsTendance(produits.content || produits || []);
      } else if (activeTab === 'actualites') {
        const [actualites, stats] = await Promise.all([
          actualiteService.obtenirToutesLesActualites(),
          actualiteService.obtenirStatistiquesActualites()
        ]);
        setActualitesReelles(actualites.content);
        setStatistiquesActualites(stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerProduitTendance = async (produitId: number, tendance: boolean) => {
    try {
      const result = await tendanceService.marquerProduitTendance(produitId, tendance);
      if (result.success) {
        // Recharger les données
        chargerDonneesReelles();
      }
    } catch (error) {
      console.error('Erreur lors du marquage du produit:', error);
    }
  };


  const handleIncrementerVues = async (produitId: number) => {
    try {
      await tendanceService.incrementerVuesProduit(produitId);
      // Recharger les données
      chargerDonneesReelles();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  };

  // Fonctions pour gérer les actualités réelles
  const handleSupprimerActualite = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        await actualiteService.supprimerActualite(id);
        chargerDonneesReelles();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'actualité:', error);
      }
    }
  };

  const handleChangerVisibiliteActualite = async (id: number, visible: boolean) => {
    try {
      await actualiteService.changerVisibiliteActualite(id, visible);
      chargerDonneesReelles();
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    }
  };

  const handleMarquerActualiteTendance = async (id: number, tendance: boolean) => {
    try {
      await actualiteService.marquerActualiteTendance(id, tendance);
      chargerDonneesReelles();
    } catch (error) {
      console.error('Erreur lors du marquage comme tendance:', error);
    }
  };

  const handleIncrementerLikes = async (id: number) => {
    try {
      await actualiteService.incrementerLikes(id);
      chargerDonneesReelles();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des likes:', error);
    }
  };

  const handleCreate = (type: 'actualite' | 'tendance' | 'produit' = 'actualite') => {
    setModalType(type);
    setEditingItem(null);
    setSelectedImage(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (item: any, type: 'actualite' | 'tendance' | 'produit' = 'actualite') => {
    setModalType(type);
    setEditingItem(item);
    setSelectedImage(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreerActualite = async (actualiteData: any) => {
    try {
      await actualiteService.creerActualite(actualiteData);
      chargerDonneesReelles();
      setShowModal(false);
      alert('Actualité créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'actualité:', error);
      alert('Erreur lors de la création de l\'actualité');
    }
  };

  const handleModifierActualite = async (id: number, actualiteData: any) => {
    try {
      await actualiteService.mettreAJourActualite(id, actualiteData);
      chargerDonneesReelles();
      setShowModal(false);
      alert('Actualité modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification de l\'actualité:', error);
      alert('Erreur lors de la modification de l\'actualité');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Mode & Tendances</h1>
            <p className="text-gray-600">Gérez les actualités, tendances et produits à la mode</p>
          </div>
          <button
            onClick={() => handleCreate(activeTab === 'actualites' ? 'actualite' : activeTab === 'tendances' ? 'tendance' : 'produit')}
            className="bg-[#F99834] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer {activeTab === 'actualites' ? 'Actualité' : activeTab === 'tendances' ? 'Tendance' : 'Produit'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('actualites')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'actualites'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="h-4 w-4 mr-2" />
              Actualités Mode
            </button>
            <button
              onClick={() => setActiveTab('tendances')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'tendances'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Flame className="h-4 w-4 mr-2" />
              Tendances 2025
            </button>
            <button
              onClick={() => setActiveTab('produits')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'produits'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Produits Tendance
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'actualites' && (
        <div className="space-y-6">
          {/* Header avec bouton de rafraîchissement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Actualités Mode</h3>
                <p className="text-gray-600 text-sm">Gérez les actualités et articles de mode</p>
          </div>
              <button
                onClick={chargerDonneesReelles}
                disabled={loading}
                className="bg-[#F99834] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>

          {/* Statistiques des actualités */}
          {statistiquesActualites && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Statistiques des Actualités</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{statistiquesActualites.totalActualites}</div>
                  <div className="text-sm text-gray-600">Total Actualités</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{statistiquesActualites.actualitesVisibles}</div>
                  <div className="text-sm text-gray-600">Visibles</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{statistiquesActualites.actualitesTendance}</div>
                  <div className="text-sm text-gray-600">Tendance</div>
          </div>
        </div>
      </div>
          )}

          {/* Liste des actualités réelles */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actualités Réelles</h3>
              <p className="text-gray-600 text-sm">Gérez les actualités créées par l'admin</p>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
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
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin text-[#F99834]" />
                          <span className="ml-2 text-gray-600">Chargement...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {actualitesReelles.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="text-center py-12">
                          <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune actualité trouvée</h3>
                          <p className="text-gray-500">Les actualités créées par l'admin apparaîtront ici</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {actualitesReelles.map((actualite) => (
                  <tr key={actualite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                              src={actualite.imageUrl || '/images/placeholder-news.jpg'}
                            alt={actualite.titre}
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-news.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {actualite.titre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {actualite.categorie}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                              {actualite.estTendance && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Flame className="h-3 w-3 mr-1" />
                                Tendance
                              </span>
                            )}
                              {!actualite.estVisible && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Masqué
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {actualite.auteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(actualite.datePublication)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                            {actualite.nombreLikes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                            {actualite.nombreCommentaires}
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                            {actualite.nombrePartages}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(actualite, 'actualite')}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleChangerVisibiliteActualite(actualite.id, !actualite.estVisible)}
                          className={`p-1 rounded ${
                              actualite.estVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                            {actualite.estVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={() => handleMarquerActualiteTendance(actualite.id, !actualite.estTendance)}
                          className={`p-1 rounded ${
                              actualite.estTendance ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Flame className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(actualite)}
                          className="text-[#F99834] hover:text-[#E8892A]"
                            title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleIncrementerLikes(actualite.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Incrémenter les likes"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSupprimerActualite(actualite.id)}
                          className="text-red-600 hover:text-red-700"
                            title="Supprimer"
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

      {activeTab === 'tendances' && (
        <div className="space-y-6">
          {/* Header avec bouton de rafraîchissement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tendances 2025</h3>
                <p className="text-gray-600 text-sm">Gérez les tendances de mode pour 2025</p>
              </div>
              <div className="flex items-center space-x-3">
                  <button
                  onClick={() => handleCreate('tendance')}
                  className="bg-[#F99834] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors flex items-center"
                  >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer Tendance
                  </button>
                  <button
                  onClick={chargerDonneesReelles}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
                  >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                  </button>
              </div>
            </div>
          </div>

          {/* Contenu des tendances */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tendances 2025</h3>
              <p className="text-gray-500">Cette section sera bientôt disponible pour gérer les tendances de mode 2025</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'produits' && (
        <div className="space-y-6">
          {/* Header avec bouton de rafraîchissement */}
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Produits à la Mode</h3>
                <p className="text-gray-600 text-sm">Gérez les produits tendance et leurs promotions</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCreate('produit')}
                  className="bg-[#F99834] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer Produit
                </button>
                <button
                  onClick={chargerDonneesReelles}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          {/* Liste des produits tendance */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produits Tendance</h3>
              <p className="text-gray-600 text-sm">Gérez les produits marqués comme tendance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin text-[#F99834]" />
                          <span className="ml-2 text-gray-600">Chargement...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {Array.isArray(produitsTendance) && produitsTendance.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
          <div className="text-center py-12">
                          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
                          <p className="text-gray-500">Les produits tendance apparaîtront ici</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {Array.isArray(produitsTendance) && produitsTendance.map((produit) => (
                    <tr key={produit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={produit.photos && produit.photos.length > 0 ? produit.photos[0] : '/images/placeholder-product.jpg'}
                              alt={produit.nom}
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-product.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {produit.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {produit.nomCategorie || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produit.nomVendeur || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{produit.prix.toLocaleString()} FCFA</span>
                          {produit.prixPromo && (
                            <span className="text-red-600 font-semibold">
                              {produit.prixPromo.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {produit.nombreVues}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {produit.noteMoyenne}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMarquerProduitTendance(produit.id, true)}
                            className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            Marquer Tendance
                          </button>
                          <button
                            onClick={() => handleIncrementerVues(produit.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Incrémenter les vues"
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Modal dynamique pour créer/modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem 
                  ? `Modifier ${modalType === 'actualite' ? 'l\'actualité' : modalType === 'tendance' ? 'la tendance' : 'le produit'}`
                  : `Créer ${modalType === 'actualite' ? 'une nouvelle actualité' : modalType === 'tendance' ? 'une nouvelle tendance' : 'un nouveau produit'}`
                }
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              if (modalType === 'actualite') {
                const actualiteData = {
                  titre: formData.get('titre') as string,
                  resume: formData.get('resume') as string,
                  contenu: formData.get('contenu') as string,
                  auteur: formData.get('auteur') as string,
                  categorie: formData.get('categorie') as string,
                  estVisible: formData.get('estVisible') === 'on',
                  estTendance: formData.get('estTendance') === 'on',
                  imageFile: selectedImage
                };
                
                if (editingItem) {
                  handleModifierActualite(editingItem.id, actualiteData);
                } else {
                  handleCreerActualite(actualiteData);
                }
              } else if (modalType === 'tendance') {
                const tendanceData = {
                  nom: formData.get('nom') as string,
                  description: formData.get('description') as string,
                  saison: formData.get('saison') as string,
                  couleur: formData.get('couleur') as string,
                  popularite: parseInt(formData.get('popularite') as string),
                  tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
                  imageFile: selectedImage
                };
                
                console.log('Données de tendance:', tendanceData);
                alert('Fonctionnalité de gestion des tendances à implémenter');
              } else if (modalType === 'produit') {
                const produitData = {
                  nom: formData.get('nom') as string,
                  description: formData.get('description') as string,
                  prix: parseFloat(formData.get('prix') as string),
                  prixPromo: formData.get('prixPromo') ? parseFloat(formData.get('prixPromo') as string) : null,
                  categorie: formData.get('categorie') as string,
                  vendeur: formData.get('vendeur') as string,
                  imageFile: selectedImage
                };
                
                console.log('Données de produit:', produitData);
                alert('Fonctionnalité de gestion des produits à implémenter');
              }
            }}>
              <div className="space-y-4">
                {/* Formulaire pour Actualités */}
                {modalType === 'actualite' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                      </label>
                      <input
                        type="text"
                        name="titre"
                        required
                        defaultValue={editingItem?.titre || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Résumé
                      </label>
                      <textarea
                        name="resume"
                        rows={3}
                        defaultValue={editingItem?.resume || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contenu
                      </label>
                      <textarea
                        name="contenu"
                        rows={4}
                        defaultValue={editingItem?.contenu || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auteur *
                      </label>
                      <input
                        type="text"
                        name="auteur"
                        required
                        defaultValue={editingItem?.auteur || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <input
                        type="text"
                        name="categorie"
                        defaultValue={editingItem?.categorie || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="estVisible"
                          defaultChecked={editingItem?.estVisible !== false}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Visible</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="estTendance"
                          defaultChecked={editingItem?.estTendance || false}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Tendance</span>
                      </label>
                    </div>
                  </>
                )}

                {/* Formulaire pour Tendances */}
                {modalType === 'tendance' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la tendance *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        required
                        defaultValue={editingItem?.nom || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingItem?.description || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Saison
                      </label>
                      <select
                        name="saison"
                        defaultValue={editingItem?.saison || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      >
                        <option value="">Sélectionner une saison</option>
                        <option value="Printemps-Été">Printemps-Été</option>
                        <option value="Automne-Hiver">Automne-Hiver</option>
                        <option value="Toute l'année">Toute l'année</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur dominante
                      </label>
                      <input
                        type="color"
                        name="couleur"
                        defaultValue={editingItem?.couleur || '#FF6B35'}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Popularité (%)
                      </label>
                      <input
                        type="number"
                        name="popularite"
                        min="0"
                        max="100"
                        defaultValue={editingItem?.popularite || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={editingItem?.tags?.join(', ') || ''}
                        placeholder="ex: wax, moderne, traditionnel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Formulaire pour Produits */}
                {modalType === 'produit' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        required
                        defaultValue={editingItem?.nom || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingItem?.description || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          name="prix"
                          required
                          min="0"
                          step="0.01"
                          defaultValue={editingItem?.prix || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix promo (FCFA)
                        </label>
                        <input
                          type="number"
                          name="prixPromo"
                          min="0"
                          step="0.01"
                          defaultValue={editingItem?.prixPromo || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <input
                        type="text"
                        name="categorie"
                        defaultValue={editingItem?.nomCategorie || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendeur
                      </label>
                      <input
                        type="text"
                        name="vendeur"
                        defaultValue={editingItem?.nomVendeur || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Champ d'image commun à tous les types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {modalType === 'actualite' ? 'de l\'actualité' : modalType === 'tendance' ? 'de la tendance' : 'du produit'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  {editingItem?.imageUrl && !imagePreview && (
                    <div className="mt-2">
                      <img
                        src={editingItem.imageUrl}
                        alt="Image actuelle"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E8892A] transition-colors"
                >
                  {editingItem ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActualitesMode;