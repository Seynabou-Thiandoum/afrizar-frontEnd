import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Zap, X, Clock, Percent, Package } from 'lucide-react';
import adminVentesFlashService, { VenteFlash } from '../../services/adminVentesFlashService';

const AdminVentesFlash = () => {
  const [ventesFlash, setVentesFlash] = useState<VenteFlash[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingVente, setEditingVente] = useState<VenteFlash | null>(null);
  const [formData, setFormData] = useState<Partial<VenteFlash>>({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    actif: true,
    pourcentageReductionParDefaut: 0,
  });
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedVenteFlash, setSelectedVenteFlash] = useState<VenteFlash | null>(null);
  const [produitsFlash, setProduitsFlash] = useState<any[]>([]);
  const [produitsDisponibles, setProduitsDisponibles] = useState<any[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState<any>(null);
  const [productFormData, setProductFormData] = useState({
    prixPromotionnel: '',
    pourcentageReduction: '',
    quantiteStock: '',
  });

  useEffect(() => {
    chargerVentesFlash();
  }, []);

  const chargerVentesFlash = async () => {
    try {
      setLoading(true);
      const data = await adminVentesFlashService.obtenirToutesLesVentesFlash();
      setVentesFlash(data);
    } catch (error) {
      console.error('Erreur chargement ventes flash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVente && editingVente.id) {
        await adminVentesFlashService.modifierVenteFlash(editingVente.id, formData as VenteFlash);
        console.log('Vente flash modifiée avec succès');
      } else {
        await adminVentesFlashService.creerVenteFlash(formData as VenteFlash);
        console.log('Vente flash créée avec succès');
      }
      resetForm();
      chargerVentesFlash();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (vente: VenteFlash) => {
    setEditingVente(vente);
    setFormData(vente);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vente flash ?')) return;
    try {
      await adminVentesFlashService.supprimerVenteFlash(id);
      console.log('Vente flash supprimée avec succès');
      chargerVentesFlash();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      actif: true,
      pourcentageReductionParDefaut: 0,
    });
    setEditingVente(null);
    setShowModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = (dateDebut: string, dateFin: string) => {
    const now = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    return now >= debut && now <= fin;
  };

  const handleManageProducts = async (vente: VenteFlash) => {
    setSelectedVenteFlash(vente);
    setShowProductsModal(true);
    await chargerProduitsFlash(vente.id!);
    await chargerProduitsDisponibles();
  };

  const closeProductsModal = () => {
    setShowProductsModal(false);
    setSelectedVenteFlash(null);
    setProduitsFlash([]);
    setShowAddProductModal(false);
  };

  const chargerProduitsFlash = async (venteFlashId: number) => {
    try {
      const data = await adminVentesFlashService.obtenirProduits(venteFlashId);
      setProduitsFlash(data);
    } catch (error) {
      console.error('Erreur chargement produits flash:', error);
    }
  };

  const chargerProduitsDisponibles = async () => {
    try {
      const token = localStorage.getItem('afrizar_token');
      const response = await fetch('http://localhost:8080/api/produits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Données reçues:', data);
      
      // Vérifier si data est un tableau ou un objet Page
      if (Array.isArray(data)) {
        setProduitsDisponibles(data);
      } else if (data.content && Array.isArray(data.content)) {
        setProduitsDisponibles(data.content);
      } else {
        console.error('Format de données inattendu:', data);
        setProduitsDisponibles([]);
      }
    } catch (error) {
      console.error('Erreur chargement produits disponibles:', error);
      setProduitsDisponibles([]);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduit || !selectedVenteFlash?.id) return;

    try {
      await adminVentesFlashService.ajouterProduit(
        selectedVenteFlash.id,
        selectedProduit.id,
        {
          prixPromotionnel: parseFloat(productFormData.prixPromotionnel),
          pourcentageReduction: parseInt(productFormData.pourcentageReduction),
          quantiteStock: productFormData.quantiteStock ? parseInt(productFormData.quantiteStock) : undefined,
        }
      );
      console.log('Produit ajouté avec succès');
      await chargerProduitsFlash(selectedVenteFlash.id);
      setShowAddProductModal(false);
      setSelectedProduit(null);
      setProductFormData({ prixPromotionnel: '', pourcentageReduction: '', quantiteStock: '' });
    } catch (error) {
      console.error('Erreur ajout produit:', error);
    }
  };

  const handleRemoveProduct = async (produitId: number) => {
    if (!selectedVenteFlash?.id || !confirm('Êtes-vous sûr de retirer ce produit ?')) return;

    try {
      await adminVentesFlashService.retirerProduit(selectedVenteFlash.id, produitId);
      console.log('Produit retiré avec succès');
      await chargerProduitsFlash(selectedVenteFlash.id);
    } catch (error) {
      console.error('Erreur retrait produit:', error);
    }
  };

  const openAddProductModal = () => {
    setShowAddProductModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Ventes Flash</h2>
          <p className="text-gray-600">Créez et gérez les ventes flash de votre boutique</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle Vente Flash</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : ventesFlash.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune vente flash</h3>
          <p className="text-gray-600 mb-4">Créez votre première vente flash pour attirer les clients</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventesFlash.map((vente) => (
            <div key={vente.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-bold text-white">{vente.nom}</h3>
                  </div>
                  {vente.actif && isActive(vente.dateDebut, vente.dateFin) && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      EN COURS
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vente.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Du {formatDate(vente.dateDebut)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Au {formatDate(vente.dateFin)}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600 font-semibold">
                    <Percent className="h-4 w-4 mr-2" />
                    <span>-{vente.pourcentageReductionParDefaut}% par défaut</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleManageProducts(vente)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                    title="Gérer les produits"
                  >
                    <Package className="h-4 w-4" />
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(vente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vente.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingVente ? 'Modifier la Vente Flash' : 'Nouvelle Vente Flash'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la vente flash *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Black Friday 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Décrivez votre vente flash..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage de réduction par défaut
                </label>
                <input
                  type="number"
                  value={formData.pourcentageReductionParDefaut}
                  onChange={(e) => setFormData({ ...formData, pourcentageReductionParDefaut: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  max="100"
                  placeholder="Ex: 30"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Activer immédiatement
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingVente ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de gestion des produits */}
      {showProductsModal && selectedVenteFlash && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Gérer les produits - {selectedVenteFlash.nom}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ajoutez et gérez les produits de cette vente flash
                </p>
              </div>
              <button onClick={closeProductsModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Produits ({produitsFlash.length})</h4>
                <button
                  onClick={openAddProductModal}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un produit</span>
                </button>
              </div>

              {produitsFlash.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun produit dans cette vente flash</p>
                  <p className="text-sm text-gray-500 mt-1">Cliquez sur "Ajouter un produit" pour commencer</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {produitsFlash.map((produit) => (
                    <div key={produit.produitId} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        {produit.imageUrl && (
                          <img
                            src={produit.imageUrl}
                            alt={produit.nomProduit}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{produit.nomProduit}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">Prix original:</span>
                              <span className="font-semibold">{produit.prixOriginal} F CFA</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">Prix promo:</span>
                              <span className="font-semibold text-orange-600">{produit.prixPromotionnel} F CFA</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">Réduction:</span>
                              <span className="font-semibold text-green-600">-{produit.pourcentageReduction}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">Stock:</span>
                              <span className="font-semibold">{produit.quantiteStock}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(produit.produitId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Retirer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un produit</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Sélection du produit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisir un produit *
                </label>
                <select
                  onChange={(e) => {
                    const produit = produitsDisponibles.find(p => p.id === parseInt(e.target.value));
                    setSelectedProduit(produit);
                    if (produit && selectedVenteFlash) {
                      // Utiliser le pourcentage de réduction par défaut de la vente flash
                      const reduction = selectedVenteFlash.pourcentageReductionParDefaut || 10;
                      const prixPromo = produit.prix * (1 - reduction / 100);
                      setProductFormData({
                        prixPromotionnel: prixPromo.toFixed(2),
                        pourcentageReduction: reduction.toString(),
                        quantiteStock: produit.stock?.toString() || '',
                      });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {Array.isArray(produitsDisponibles) && produitsDisponibles.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nom} - {prod.prix} F CFA
                    </option>
                  ))}
                </select>
              </div>

              {/* Formulaire de prix et réduction */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix promotionnel *
                  </label>
                  <input
                    type="number"
                    value={productFormData.prixPromotionnel}
                    onChange={(e) => setProductFormData({ ...productFormData, prixPromotionnel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourcentage de réduction *
                  </label>
                  <input
                    type="number"
                    value={productFormData.pourcentageReduction}
                    onChange={(e) => {
                      const nouveauPourcentage = e.target.value;
                      if (selectedProduit && nouveauPourcentage) {
                        const prixPromo = selectedProduit.prix * (1 - parseInt(nouveauPourcentage) / 100);
                        setProductFormData({ 
                          ...productFormData, 
                          pourcentageReduction: nouveauPourcentage,
                          prixPromotionnel: prixPromo.toFixed(2)
                        });
                      } else {
                        setProductFormData({ ...productFormData, pourcentageReduction: nouveauPourcentage });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité en stock (optionnel)
                </label>
                <input
                  type="number"
                  value={productFormData.quantiteStock}
                  onChange={(e) => setProductFormData({ ...productFormData, quantiteStock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                />
              </div>

              {/* Prévisualisation */}
              {selectedProduit && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Aperçu</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix original:</span>
                      <span className="font-semibold">{selectedProduit.prix} F CFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix promo:</span>
                      <span className="font-semibold text-orange-600">{productFormData.prixPromotionnel} F CFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Économie:</span>
                      <span className="font-semibold text-green-600">-{productFormData.pourcentageReduction}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  disabled={!selectedProduit || !productFormData.prixPromotionnel || !productFormData.pourcentageReduction}
                >
                  Ajouter le produit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVentesFlash;
