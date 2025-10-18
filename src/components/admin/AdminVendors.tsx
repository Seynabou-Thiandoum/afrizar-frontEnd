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
  Trash2,
  Phone,
  MapPin,
  X,
  Save,
  AlertCircle,
  Building,
  Package
} from 'lucide-react';
import adminService, { Vendeur, PageResponse } from '../../services/adminService';
import produitService from '../../services/produitService';
import categorieService from '../../services/categorieService';
import ImageUpload from '../common/ImageUpload';
import { API_CONFIG } from '../../config/api';

// Helper pour construire l'URL complète de l'image
const getImageUrl = (photoUrl: string | undefined): string | undefined => {
  console.log('🔍 getImageUrl - Input photoUrl:', photoUrl);
  if (!photoUrl) {
    console.log('❌ photoUrl est vide ou undefined');
    return undefined;
  }
  if (photoUrl.startsWith('http')) {
    console.log('✅ URL complète détectée:', photoUrl);
    return photoUrl;
  }
  const fullUrl = `${API_CONFIG.BASE_URL}${photoUrl}`;
  console.log('🔗 URL construite:', fullUrl);
  return fullUrl;
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
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productForm, setProductForm] = useState({
    nom: '',
    description: '',
    prix: 0,
    prixPromo: 0,
    categorieId: 0,
    imageUrl: '',
    imagesSupplementaires: [] as string[],
    stock: 0,
    taille: '',
    couleur: '',
    matiere: '',
    poids: 0
  });
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
      console.log('📋 Vendeurs chargés:', response.content);
      console.log('📸 Photos des vendeurs:', response.content.map(v => ({ 
        id: v.id, 
        nom: v.nomBoutique, 
        photoUrl: v.photoUrl 
      })));
      setVendors(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Erreur chargement vendeurs:', error);
      
      // Si erreur 401, le token a expiré - rediriger vers la connexion
      if (error.message && error.message.includes('401')) {
        setMessage({ type: 'error', text: 'Session expirée. Veuillez vous reconnecter.' });
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.hash = '#';
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des vendeurs. Essayez de rafraîchir la page (F5).' });
      }
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
      console.log('📸 PhotoUrl envoyé au backend:', vendorForm.photoUrl);
      const requestBody = {
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
      };
      console.log('📦 Données complètes envoyées:', requestBody);
      
      const response = await fetch('http://localhost:8080/api/auth/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erreur || 'Erreur lors de la création du vendeur');
      }

      const result = await response.json();
      console.log('✅ Vendeur créé - Réponse du backend:', result);
      console.log('📸 PhotoUrl dans la réponse:', result.user?.photoUrl);

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
      console.log('📝 Mise à jour vendeur ID:', selectedVendor.id);
      console.log('📸 PhotoUrl à envoyer:', vendorForm.photoUrl);
      
      const updatedVendor = await adminService.updateVendeur(selectedVendor.id, {
        ...vendorForm,
        id: selectedVendor.id
      });
      
      console.log('✅ Vendeur mis à jour - Réponse:', updatedVendor);
      console.log('📸 PhotoUrl dans la réponse:', updatedVendor.photoUrl);
      
      setMessage({ type: 'success', text: 'Vendeur mis à jour avec succès !' });
      setShowModal(false);
      setEditMode(false);
      loadVendors();
    } catch (error: any) {
      console.error('❌ Erreur mise à jour vendeur:', error);
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

  const loadVendorProducts = async (vendorId: number) => {
    try {
      console.log('Chargement des produits pour le vendeur:', vendorId);
      const products = await produitService.getProduitsByVendeur(vendorId);
      console.log('Produits trouvés:', products);
      setVendorProducts(products || []);
    } catch (error) {
      console.error('Erreur chargement produits du vendeur:', error);
      setVendorProducts([]);
    }
  };

  const openDetailModal = async (vendor: Vendeur) => {
    setSelectedVendor(vendor);
    setShowModal(true);
    setActiveTab('details');
    setEditMode(false);
    
    // Charger les produits du vendeur et les catégories
    await loadVendorProducts(vendor.id);
    
    // Charger les catégories si pas encore chargées
    if (categories.length === 0) {
      try {
        const cats = await categorieService.getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    }
  };

  const openAddProductModal = (vendor: Vendeur) => {
    setActiveTab('products');
    setShowAddProduct(true);
    // Réinitialiser le formulaire
    setProductForm({
      nom: '',
      description: '',
      prix: 0,
      prixPromo: 0,
      categorieId: 0,
      imageUrl: '',
      imagesSupplementaires: [],
      stock: 0,
      taille: '',
      couleur: '',
      matiere: '',
      poids: 0
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setLoading(true);
    try {
      // Préparer les photos pour le backend (liste)
      const photos = [];
      if (productForm.imageUrl) {
        photos.push(productForm.imageUrl);
      }
      if (productForm.imagesSupplementaires && productForm.imagesSupplementaires.length > 0) {
        photos.push(...productForm.imagesSupplementaires);
      }

      console.log('📸 Création produit - Photos envoyées:', photos);

      await produitService.createProduit({
        ...productForm,
        photos: photos, // Envoyer la liste des photos
        vendeurId: selectedVendor.id
      });
      
      setMessage({ type: 'success', text: 'Produit créé avec succès !' });
      setShowAddProduct(false);
      
      // Recharger les produits du vendeur
      await loadVendorProducts(selectedVendor.id);
      
      // Réinitialiser le formulaire
      setProductForm({
        nom: '',
        description: '',
        prix: 0,
        prixPromo: 0,
        categorieId: 0,
        imageUrl: '',
        imagesSupplementaires: [],
        stock: 0,
        taille: '',
        couleur: '',
        matiere: '',
        poids: 0
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création du produit' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      nom: product.nom || '',
      description: product.description || '',
      prix: product.prix || 0,
      prixPromo: product.prixPromo || 0,
      categorieId: product.categorieId || 0,
      imageUrl: product.imageUrl || '',
      imagesSupplementaires: product.imagesSupplementaires || [],
      stock: product.stock || 0,
      delaiProduction: product.delaiProduction || 0,
      poids: product.poids || 0,
      taille: product.taille || '',
      couleur: product.couleur || '',
      matiere: product.matiere || ''
    });
    setShowEditProduct(true);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !selectedVendor) return;

    setLoading(true);
    try {
      // Préparer les photos pour le backend (liste)
      const photos = [];
      if (productForm.imageUrl) {
        photos.push(productForm.imageUrl);
      }
      if (productForm.imagesSupplementaires && productForm.imagesSupplementaires.length > 0) {
        photos.push(...productForm.imagesSupplementaires);
      }

      console.log('📸 Modification produit - Photos envoyées:', photos);

      await produitService.updateProduit(editingProduct.id, {
        ...productForm,
        photos: photos, // Envoyer la liste des photos
        vendeurId: selectedVendor.id
      });
      
      setMessage({ type: 'success', text: 'Produit modifié avec succès !' });
      setShowEditProduct(false);
      setEditingProduct(null);
      
      // Recharger les produits du vendeur
      await loadVendorProducts(selectedVendor.id);
      
      // Réinitialiser le formulaire
      setProductForm({
        nom: '',
        description: '',
        prix: 0,
        prixPromo: 0,
        categorieId: 0,
        imageUrl: '',
        imagesSupplementaires: [],
        stock: 0,
        taille: '',
        couleur: '',
        matiere: '',
        poids: 0
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la modification du produit' });
    } finally {
      setLoading(false);
    }
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
                  onClick={() => openDetailModal(vendor)}
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
                      type="vendeur"
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

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedVendor.nomBoutique}</h2>
                    <div className="flex space-x-2 border-l pl-4">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'details' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'products' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Produits ({vendorProducts.length})
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Onglet Détails */}
                {activeTab === 'details' && (
                <>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center overflow-hidden">
                      {getImageUrl((selectedVendor as any).photoUrl) ? (
                        <img
                          src={getImageUrl((selectedVendor as any).photoUrl)}
                          alt={selectedVendor.nomBoutique}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('❌ Erreur photo vendeur:', (selectedVendor as any).photoUrl);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('✅ Photo vendeur chargée:', getImageUrl((selectedVendor as any).photoUrl));
                          }}
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

                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <button
                    onClick={() => openAddProductModal(selectedVendor)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Ajouter des produits
                  </button>
                  
                  <div className="flex space-x-3">
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
                  </div>
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
                </>
                )}

                {/* Onglet Produits */}
                {activeTab === 'products' && (
                <div className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                      Produits de {selectedVendor.nomBoutique}
                    </h3>
                    <button
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      {showAddProduct ? 'Annuler' : 'Nouveau produit'}
                    </button>
                  </div>

                  {showAddProduct ? (
                    <form onSubmit={handleCreateProduct} className="bg-white border border-gray-200 rounded-lg p-6 mb-4 space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Vendeur :</strong> {selectedVendor.nomBoutique}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                          <input
                            type="text"
                            required
                            value={productForm.nom}
                            onChange={(e) => setProductForm({ ...productForm, nom: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Boubou Grand Brodé"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                          <select
                            required
                            value={productForm.categorieId}
                            onChange={(e) => setProductForm({ ...productForm, categorieId: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.nom}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                          required
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Description détaillée du produit..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={productForm.prix}
                            onChange={(e) => setProductForm({ ...productForm, prix: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prix Promo (FCFA)</label>
                          <input
                            type="number"
                            min="0"
                            value={productForm.prixPromo}
                            onChange={(e) => setProductForm({ ...productForm, prixPromo: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUpload
                          label="Image principale du produit *"
                          value={productForm.imageUrl}
                          onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                          required={true}
                          type="produit"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                          <input
                            type="text"
                            value={productForm.taille}
                            onChange={(e) => setProductForm({ ...productForm, taille: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: L, XL, 42..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                          <input
                            type="text"
                            value={productForm.couleur}
                            onChange={(e) => setProductForm({ ...productForm, couleur: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Bleu, Rouge..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                          <input
                            type="text"
                            value={productForm.matiere}
                            onChange={(e) => setProductForm({ ...productForm, matiere: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Coton, Soie..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                          type="button"
                          onClick={() => setShowAddProduct(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Création...' : 'Créer le produit'}
                        </button>
                      </div>
                    </form>
                  ) : showEditProduct ? (
                    <form onSubmit={handleUpdateProduct} className="bg-white border border-gray-200 rounded-lg p-6 mb-4 space-y-4">
                      <div className="bg-orange-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-orange-800">
                          <strong>Modification du produit :</strong> {editingProduct?.nom}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                          <input
                            type="text"
                            required
                            value={productForm.nom}
                            onChange={(e) => setProductForm({ ...productForm, nom: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                          <select
                            required
                            value={productForm.categorieId}
                            onChange={(e) => setProductForm({ ...productForm, categorieId: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.nom}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                          <input
                            type="number"
                            required
                            value={productForm.prix}
                            onChange={(e) => setProductForm({ ...productForm, prix: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                          <input
                            type="text"
                            value={productForm.taille}
                            onChange={(e) => setProductForm({ ...productForm, taille: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="S, M, L, XL..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                          <input
                            type="text"
                            value={productForm.couleur}
                            onChange={(e) => setProductForm({ ...productForm, couleur: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Rouge, Bleu..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                          <input
                            type="text"
                            value={productForm.matiere}
                            onChange={(e) => setProductForm({ ...productForm, matiere: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Coton, Soie..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.poids}
                            onChange={(e) => setProductForm({ ...productForm, poids: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                        <ImageUpload
                          type="produit"
                          onImageUploaded={(url) => setProductForm({ ...productForm, imageUrl: url })}
                          currentImageUrl={productForm.imageUrl}
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                          {loading ? 'Modification...' : 'Modifier le produit'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    vendorProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendorProducts.map((product: any) => (
                          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`}
                                alt={product.nom}
                                className="w-full h-32 object-cover rounded-lg mb-2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Pas+d%27image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900 truncate">{product.nom}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.statut === 'ACTIF' ? 'bg-green-100 text-green-800' :
                                product.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                product.statut === 'REFUSE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {product.statut || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex flex-col">
                                <span className="text-lg font-bold text-green-600">{product.prix} FCFA</span>
                                {product.prixPromo && product.prixPromo > 0 && (
                                  <span className="text-sm text-gray-400 line-through">{product.prixPromo} FCFA</span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                            </div>
                            
                            {/* Détails du produit */}
                            <div className="space-y-1 mb-3">
                              {product.taille && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Taille:</span>
                                  <span className="text-xs font-medium text-gray-700">{product.taille}</span>
                                </div>
                              )}
                              {product.couleur && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Couleur:</span>
                                  <span className="text-xs font-medium text-gray-700">{product.couleur}</span>
                                </div>
                              )}
                              {product.matiere && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Matière:</span>
                                  <span className="text-xs font-medium text-gray-700">{product.matiere}</span>
                                </div>
                              )}
                              {product.poids && product.poids > 0 && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Poids:</span>
                                  <span className="text-xs font-medium text-gray-700">{product.poids} kg</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Boutons d'action */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Modifier</span>
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Implémenter la suppression du produit
                                  console.log('Supprimer produit:', product.id);
                                }}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucun produit pour ce vendeur</p>
                        <button
                          onClick={() => setShowAddProduct(true)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Ajouter le premier produit
                        </button>
                      </div>
                    )
                  )}

                  <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;

