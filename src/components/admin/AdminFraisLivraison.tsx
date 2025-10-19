import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Truck, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import fraisLivraisonService, { FraisLivraison } from '../../services/fraisLivraisonService';
import Swal from 'sweetalert2';

const AdminFraisLivraison = () => {
  const [fraisLivraison, setFraisLivraison] = useState<FraisLivraison[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFrais, setEditingFrais] = useState<FraisLivraison | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: 'EXPRESS' as 'EXPRESS' | 'STANDARD',
    frais: 0,
    delaiMinJours: 0,
    delaiMaxJours: 0,
    actif: true,
    poidsMin: 0,
    poidsMax: 0,
    zone: 'DAKAR'
  });

  useEffect(() => {
    chargerFraisLivraison();
  }, []);

  const chargerFraisLivraison = async () => {
    try {
      setLoading(true);
      const data = await fraisLivraisonService.obtenirTousLesFraisLivraison();
      setFraisLivraison(data.content || data);
    } catch (error) {
      console.error('Erreur lors du chargement des frais de livraison:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les frais de livraison',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingFrais) {
        await fraisLivraisonService.mettreAJourFraisLivraison(editingFrais.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Frais de livraison mis à jour avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await fraisLivraisonService.creerFraisLivraison(formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Frais de livraison créé avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      setShowModal(false);
      setEditingFrais(null);
      resetForm();
      chargerFraisLivraison();
      
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la sauvegarde',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (frais: FraisLivraison) => {
    setEditingFrais(frais);
    setFormData({
      nom: frais.nom,
      description: frais.description,
      type: frais.type,
      frais: frais.frais,
      delaiMinJours: frais.delaiMinJours,
      delaiMaxJours: frais.delaiMaxJours,
      actif: frais.actif,
      poidsMin: frais.poidsMin || 0,
      poidsMax: frais.poidsMax || 0,
      zone: frais.zone || 'DAKAR'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Supprimer les frais de livraison',
      text: 'Êtes-vous sûr de vouloir supprimer ces frais de livraison ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await fraisLivraisonService.supprimerFraisLivraison(id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Frais de livraison supprimé avec succès',
          timer: 2000,
          showConfirmButton: false
        });
        chargerFraisLivraison();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.message || 'Erreur lors de la suppression',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleToggleStatus = async (id: number, actif: boolean) => {
    try {
      if (actif) {
        await fraisLivraisonService.desactiverFraisLivraison(id);
      } else {
        await fraisLivraisonService.activerFraisLivraison(id);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Statut modifié',
        text: `Frais de livraison ${actif ? 'désactivé' : 'activé'} avec succès`,
        timer: 2000,
        showConfirmButton: false
      });
      
      chargerFraisLivraison();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la modification du statut',
        confirmButtonText: 'OK'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      type: 'EXPRESS',
      frais: 0,
      delaiMinJours: 0,
      delaiMaxJours: 0,
      actif: true,
      poidsMin: 0,
      poidsMax: 0,
      zone: 'DAKAR'
    });
  };

  const handleNewFrais = () => {
    setEditingFrais(null);
    resetForm();
    setShowModal(true);
  };

  const filteredFrais = fraisLivraison.filter(frais => {
    const matchesSearch = frais.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frais.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || frais.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'active' && frais.actif) ||
                        (filterStatus === 'inactive' && !frais.actif);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frais de Livraison</h1>
          <p className="text-gray-600">Gérez les options de livraison et leurs frais</p>
        </div>
        <button
          onClick={handleNewFrais}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveaux frais</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="EXPRESS">Express</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={chargerFraisLivraison}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des frais de livraison */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600">Chargement des frais de livraison...</p>
          </div>
        ) : filteredFrais.length === 0 ? (
          <div className="p-8 text-center">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aucun frais de livraison trouvé</p>
            <button
              onClick={handleNewFrais}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer le premier frais de livraison
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frais de livraison
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Délai
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
                {filteredFrais.map((frais) => (
                  <tr key={frais.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{frais.nom}</div>
                        <div className="text-sm text-gray-500">{frais.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        frais.type === 'EXPRESS' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {frais.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {frais.frais.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {frais.delaiMinJours} - {frais.delaiMaxJours} jours
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(frais.id, frais.actif)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          frais.actif 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {frais.actif ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Actif
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(frais)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(frais.id)}
                          className="text-red-600 hover:text-red-900"
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
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingFrais ? 'Modifier les frais de livraison' : 'Nouveaux frais de livraison'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Livraison Express Dakar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'EXPRESS' | 'STANDARD' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="EXPRESS">Express</option>
                      <option value="STANDARD">Standard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description des frais de livraison..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.frais}
                      onChange={(e) => setFormData({ ...formData, frais: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai min (jours) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.delaiMinJours}
                      onChange={(e) => setFormData({ ...formData, delaiMinJours: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai max (jours) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.delaiMaxJours}
                      onChange={(e) => setFormData({ ...formData, delaiMaxJours: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zone
                    </label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="DAKAR">Dakar</option>
                      <option value="AUTRES_VILLES">Autres villes</option>
                      <option value="INTERNATIONAL">International</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids min (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.poidsMin}
                      onChange={(e) => setFormData({ ...formData, poidsMin: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids max (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.poidsMax}
                      onChange={(e) => setFormData({ ...formData, poidsMax: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={formData.actif}
                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="actif" className="ml-2 block text-sm text-gray-900">
                    Actif (visible pour les clients)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <span>{editingFrais ? 'Modifier' : 'Créer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFraisLivraison;
