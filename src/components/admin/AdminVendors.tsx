import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  X,
  Save,
  AlertCircle,
  Building
} from 'lucide-react';
import adminService, { Vendeur, PageResponse } from '../../services/adminService';
import ImageUpload from '../common/ImageUpload';
import { API_CONFIG } from '../../config/api';

// Helper pour construire l'URL complète de l'image
const getImageUrl = (photoUrl: string | undefined): string | undefined => {
  if (!photoUrl) return undefined;
  if (photoUrl.startsWith('http')) return photoUrl;
  return `${API_CONFIG.BASE_URL}${photoUrl}`;
};

const AdminVendors = () => {
  const [vendors, setVendors] = useState<Vendeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendeur | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [vendorForm, setVendorForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    nomBoutique: '',
    description: '',
    adresseBoutique: '',
    specialites: '',
    photoUrl: '',
    publie: false
  });

  useEffect(() => {
    loadVendors();
  }, [currentPage]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response: PageResponse<Vendeur> = await adminService.getTousLesVendeurs(
        currentPage,
        20,
        true
      );
      setVendors(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erreur chargement vendeurs:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des vendeurs' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Appeler le service d'inscription avec le rôle VENDEUR
      const response = await fetch('http://localhost:8080/api/auth/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: vendorForm.nom,
          prenom: vendorForm.prenom,
          email: vendorForm.email,
          motDePasse: vendorForm.motDePasse,
          telephone: vendorForm.telephone,
          role: 'VENDEUR',
          nomBoutique: vendorForm.nomBoutique,
          description: vendorForm.description,
          adresseBoutique: vendorForm.adresseBoutique,
          specialites: vendorForm.specialites,
          photoUrl: vendorForm.photoUrl,
          publie: vendorForm.publie
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erreur || 'Erreur lors de la création du vendeur');
      }

      setMessage({ type: 'success', text: 'Vendeur créé avec succès !' });
      setShowCreateModal(false);
      resetForm();
      loadVendors();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création du vendeur' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implémenter la mise à jour via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Vendeur mis à jour avec succès !' });
      setShowModal(false);
      setEditMode(false);
      loadVendors();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour du vendeur' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId: number) => {
    try {
      await adminService.verifierVendeur(vendorId);
      setMessage({ type: 'success', text: 'Vendeur vérifié avec succès' });
      loadVendors();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la vérification du vendeur' });
    }
  };

  const handleToggleActive = async (vendor: Vendeur) => {
    try {
      if (vendor.actif) {
        await adminService.desactiverVendeur(vendor.id);
        setMessage({ type: 'success', text: 'Vendeur désactivé avec succès' });
      } else {
        await adminService.activerVendeur(vendor.id);
        setMessage({ type: 'success', text: 'Vendeur activé avec succès' });
      }
      loadVendors();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification du vendeur' });
    }
  };

  const resetForm = () => {
    setVendorForm({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      telephone: '',
      nomBoutique: '',
      description: '',
      adresseBoutique: '',
      specialites: '',
      photoUrl: '',
      publie: false
    });
  };

  const openEditModal = (vendor: Vendeur) => {
    setSelectedVendor(vendor);
    setVendorForm({
      nom: vendor.nom,
      prenom: vendor.prenom,
      email: vendor.email,
      motDePasse: '',
      telephone: vendor.telephone,
      nomBoutique: vendor.nomBoutique,
      description: vendor.description || '',
      adresseBoutique: vendor.adresseBoutique || '',
      specialites: vendor.specialites || '',
      photoUrl: (vendor as any).photoUrl || '',
      publie: (vendor as any).publie || false
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleTogglePublish = async (vendor: Vendeur) => {
    try {
      if ((vendor as any).publie) {
        await adminService.depublierVendeur(vendor.id);
        setMessage({ type: 'success', text: 'Vendeur retiré de la page publique' });
      } else {
        await adminService.publierVendeur(vendor.id);
        setMessage({ type: 'success', text: 'Vendeur publié sur la page publique' });
      }
      loadVendors();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de statut de publication' });
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.nomBoutique.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Message d'alerte */}
      {message && (
        <div className={`rounded-lg p-4 flex items-center justify-between ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un vendeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau vendeur</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
            </div>
            <Store className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vérifiés</p>
              <p className="text-2xl font-bold text-green-600">{vendors.filter(v => v.verifie).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non vérifiés</p>
              <p className="text-2xl font-bold text-orange-600">{vendors.filter(v => !v.verifie).length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-blue-600">{vendors.filter(v => v.actif).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun vendeur trouvé</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center overflow-hidden">
                    {getImageUrl((vendor as any).photoUrl) ? (
                      <img
                        src={getImageUrl((vendor as any).photoUrl)}
                        alt={vendor.nomBoutique}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{vendor.nomBoutique}</h3>
                    <p className="text-sm text-gray-600">{vendor.prenom} {vendor.nom}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {vendor.verifie ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Non vérifié
                    </span>
                  )}
                  {(vendor as any).publie ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      👁️ Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      🔒 Non publié
                    </span>
                  )}
                </div>
              </div>

              {vendor.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.telephone}</span>
                </div>
                {vendor.adresseBoutique && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{vendor.adresseBoutique}</span>
                  </div>
                )}
              </div>

              {vendor.specialites && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialites.split(',').map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setEditMode(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  Voir
                </button>
                <button
                  onClick={() => openEditModal(vendor)}
                  className="flex-1 px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="h-4 w-4 inline mr-1" />
                  Modifier
                </button>
                {!vendor.verifie && (
                  <button
                    onClick={() => handleVerifyVendor(vendor.id)}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Vérifier
                  </button>
                )}
                <button
                  onClick={() => handleTogglePublish(vendor)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    (vendor as any).publie
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {(vendor as any).publie ? '🔒 Retirer' : '👁️ Publier'}
                </button>
                <button
                  onClick={() => handleToggleActive(vendor)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    vendor.actif
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title={vendor.actif ? 'Désactiver' : 'Activer'}
                >
                  {vendor.actif ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="text-gray-600">
            Page {currentPage + 1} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Create/Edit Vendor Modal */}
      {(showCreateModal || (showModal && editMode)) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => {
              setShowCreateModal(false);
              setShowModal(false);
              setEditMode(false);
            }}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editMode ? 'Modifier le vendeur' : 'Créer un nouveau vendeur'}
                  </h2>
                  <button onClick={() => {
                    setShowCreateModal(false);
                    setShowModal(false);
                    setEditMode(false);
                  }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={editMode ? handleUpdateVendor : handleCreateVendor} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        value={vendorForm.prenom}
                        onChange={(e) => setVendorForm({ ...vendorForm, prenom: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        value={vendorForm.nom}
                        onChange={(e) => setVendorForm({ ...vendorForm, nom: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique *</label>
                    <input
                      type="text"
                      value={vendorForm.nomBoutique}
                      onChange={(e) => setVendorForm({ ...vendorForm, nomBoutique: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="Atelier Fatou"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={vendorForm.email}
                      onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={editMode}
                    />
                  </div>

                  {!editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                      <input
                        type="password"
                        value={vendorForm.motDePasse}
                        onChange={(e) => setVendorForm({ ...vendorForm, motDePasse: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        minLength={8}
                        placeholder="Minimum 8 caractères"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={vendorForm.telephone}
                      onChange={(e) => setVendorForm({ ...vendorForm, telephone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="+221 77 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de la boutique</label>
                    <input
                      type="text"
                      value={vendorForm.adresseBoutique}
                      onChange={(e) => setVendorForm({ ...vendorForm, adresseBoutique: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Dakar, Sénégal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={vendorForm.description}
                      onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Description de l'activité du vendeur..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialités</label>
                    <input
                      type="text"
                      value={vendorForm.specialites}
                      onChange={(e) => setVendorForm({ ...vendorForm, specialites: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Boubous, Broderies, Perles (séparés par des virgules)"
                    />
                    <p className="mt-1 text-sm text-gray-500">Séparez les spécialités par des virgules</p>
                  </div>

                  <div>
                    <ImageUpload
                      label="Photo de profil (optionnel)"
                      value={vendorForm.photoUrl}
                      onChange={(url) => setVendorForm({ ...vendorForm, photoUrl: url })}
                      required={false}
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="publier"
                      checked={vendorForm.publie}
                      onChange={(e) => setVendorForm({ ...vendorForm, publie: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="publier" className="text-sm font-medium text-gray-700 cursor-pointer">
                      👁️ Publier ce vendeur sur la page publique (le vendeur doit être vérifié et actif)
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowModal(false);
                        setEditMode(false);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{editMode ? 'Modification...' : 'Création...'}</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>{editMode ? 'Modifier' : 'Créer le vendeur'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Vendor Modal */}
      {showModal && !editMode && selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Détails du vendeur</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center overflow-hidden">
                      {getImageUrl((selectedVendor as any).photoUrl) ? (
                        <img
                          src={getImageUrl((selectedVendor as any).photoUrl)}
                          alt={selectedVendor.nomBoutique}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedVendor.nomBoutique}</h3>
                      <p className="text-gray-600">{selectedVendor.prenom} {selectedVendor.nom}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedVendor.verifie ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Non vérifié
                          </span>
                        )}
                        {selectedVendor.actif ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedVendor.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{selectedVendor.description}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{selectedVendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{selectedVendor.telephone}</span>
                    </div>
                    {selectedVendor.adresseBoutique && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{selectedVendor.adresseBoutique}</span>
                      </div>
                    )}
                  </div>

                  {selectedVendor.specialites && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Spécialités</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.specialites.split(',').map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 pt-4 border-t">
                    Inscrit le {new Date(selectedVendor.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => openEditModal(selectedVendor)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Modifier
                  </button>
                  {!selectedVendor.verifie && (
                    <button
                      onClick={() => {
                        handleVerifyVendor(selectedVendor.id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Vérifier
                    </button>
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

export default AdminVendors;

