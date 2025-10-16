import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Store
} from 'lucide-react';
import produitService, { Produit, CreateProduitDto } from '../../services/produitService';
import adminService, { Vendeur } from '../../services/adminService';
import categorieService, { Categorie } from '../../services/categorieService';
import ImageUpload from '../common/ImageUpload';
import { API_CONFIG } from '../../config/api';

// Helper pour construire l'URL complète de l'image
const getImageUrl = (imageUrl: string | undefined): string | undefined => {
  console.log('🔍 getImageUrl - Input imageUrl:', imageUrl);
  if (!imageUrl) {
    console.log('❌ imageUrl est vide ou undefined');
    return undefined;
  }
  if (imageUrl.startsWith('http')) {
    console.log('✅ URL complète détectée:', imageUrl);
    return imageUrl;
  }
  const fullUrl = `${API_CONFIG.BASE_URL}${imageUrl}`;
  console.log('🔗 URL construite:', fullUrl);
  return fullUrl;
};

const AdminProducts = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendeur, setFilterVendeur] = useState<number | ''>('');
  const [filterCategorie, setFilterCategorie] = useState<number | ''>('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [productForm, setProductForm] = useState<CreateProduitDto>({
    nom: '',
    description: '',
    prix: 0,
    prixPromo: undefined,
    categorieId: 0,
    imageUrl: '',
    imagesSupplementaires: [],
    stock: 0,
    vendeurId: 0,
    taille: '',
    couleur: '',
    matiere: '',
    poids: 0
  });

  const [imageInputs, setImageInputs] = useState<string[]>(['']);

  useEffect(() => {
    loadData();
    
    // Vérifier si un vendeur a été pré-sélectionné depuis AdminVendors
    const selectedVendeurId = localStorage.getItem('selectedVendeurId');
    const selectedVendeurNom = localStorage.getItem('selectedVendeurNom');
    
    if (selectedVendeurId && selectedVendeurNom) {
      // Pré-sélectionner le vendeur
      setProductForm(prev => ({
        ...prev,
        vendeurId: parseInt(selectedVendeurId)
      }));
      
      // Ouvrir le modal de création
      setShowModal(true);
      setEditMode(false);
      
      // Afficher un message
      setMessage({ 
        type: 'success', 
        text: `Ajout de produit pour le vendeur: ${selectedVendeurNom}` 
      });
      
      // Nettoyer le localStorage
      localStorage.removeItem('selectedVendeurId');
      localStorage.removeItem('selectedVendeurNom');
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [produitsData, vendeursData, categoriesData] = await Promise.all([
        produitService.getAllProduits(0, 1000),
        adminService.getTousLesVendeurs(0, 1000, true),
        categorieService.getAllCategories()
      ]);
      
      setProduits(produitsData.content || produitsData);
      setVendeurs(vendeursData.content || []);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validation du vendeur
      if (productForm.vendeurId === 0) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner un vendeur' });
        setLoading(false);
        return;
      }

      // Validation de la catégorie
      if (productForm.categorieId === 0) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une catégorie' });
        setLoading(false);
        return;
      }

      // Filtrer les images supplémentaires vides
      const imagesSupp = imageInputs.filter(img => img.trim() !== '');
      
      await produitService.createProduit({
        ...productForm,
        imagesSupplementaires: imagesSupp
      });
      
      setMessage({ type: 'success', text: 'Produit créé avec succès !' });
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création du produit' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduit) return;

    setLoading(true);
    setMessage(null);

    try {
      const imagesSupp = imageInputs.filter(img => img.trim() !== '');
      
      await produitService.updateProduit(selectedProduit.id, {
        ...productForm,
        imagesSupplementaires: imagesSupp
      });
      
      setMessage({ type: 'success', text: 'Produit mis à jour avec succès !' });
      setShowModal(false);
      setEditMode(false);
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour du produit' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await produitService.deleteProduit(id);
      setMessage({ type: 'success', text: 'Produit supprimé avec succès' });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du produit' });
    }
  };

  const handlePublishProduct = async (produit: Produit) => {
    try {
      await adminService.validerProduit(produit.id);
      setMessage({ type: 'success', text: 'Produit publié avec succès' });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la publication du produit' });
    }
  };

  const handleRejectProduct = async (produit: Produit) => {
    const motif = prompt('Motif du rejet (optionnel):');
    try {
      await adminService.rejeterProduit(produit.id, motif || undefined);
      setMessage({ type: 'success', text: 'Produit rejeté' });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du rejet du produit' });
    }
  };

  const resetForm = () => {
    setProductForm({
      nom: '',
      description: '',
      prix: 0,
      prixPromo: undefined,
      categorieId: 0,
      imageUrl: '',
      imagesSupplementaires: [],
      stock: 0,
      vendeurId: 0,
      taille: '',
      couleur: '',
      matiere: '',
      poids: 0
    });
    setImageInputs(['']);
  };

  const openEditModal = (produit: Produit) => {
    setSelectedProduit(produit);
    setProductForm({
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      prixPromo: produit.prixPromo,
      categorieId: produit.categorieId,
      imageUrl: produit.imageUrl || '',
      stock: produit.stock,
      vendeurId: produit.vendeurId,
      taille: produit.taille || '',
      couleur: produit.couleur || '',
      matiere: produit.matiere || '',
      poids: produit.poids || 0
    });
    setImageInputs(produit.imagesSupplementaires && produit.imagesSupplementaires.length > 0 ? produit.imagesSupplementaires : ['']);
    setEditMode(true);
    setShowModal(true);
  };

  const addImageInput = () => {
    setImageInputs([...imageInputs, '']);
  };

  const removeImageInput = (index: number) => {
    setImageInputs(imageInputs.filter((_, i) => i !== index));
  };

  const updateImageInput = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Publié
        </span>;
      case 'EN_ATTENTE':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          En attente
        </span>;
      case 'REFUSE':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeté
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Brouillon
        </span>;
    }
  };

  const filteredProducts = produits.filter(prod => {
    const matchSearch = prod.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVendeur = !filterVendeur || prod.vendeurId === filterVendeur;
    const matchCategorie = !filterCategorie || prod.categorieId === filterCategorie;
    const matchStatut = !filterStatut || prod.statut === filterStatut;
    
    return matchSearch && matchVendeur && matchCategorie && matchStatut;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterVendeur}
            onChange={(e) => setFilterVendeur(e.target.value ? Number(e.target.value) : '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="">Tous les vendeurs</option>
            {vendeurs.map(v => (
              <option key={v.id} value={v.id}>{v.nomBoutique}</option>
            ))}
          </select>

          <select
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value ? Number(e.target.value) : '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIF">Publié</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="REFUSE">Rejeté</option>
            <option value="BROUILLON">Brouillon</option>
          </select>

          <button
            onClick={() => {
              resetForm();
              setEditMode(false);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{produits.length}</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-green-600">{produits.filter(p => p.statut === 'ACTIF').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-orange-600">{produits.filter(p => p.statut === 'EN_ATTENTE').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">{produits.filter(p => p.statut === 'REFUSE').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock total</p>
              <p className="text-2xl font-bold text-blue-600">{produits.reduce((sum, p) => sum + p.stock, 0)}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((produit) => (
            <div key={produit.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {getImageUrl(produit.imageUrl) ? (
                  <img
                    src={getImageUrl(produit.imageUrl)}
                    alt={produit.nom}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Image produit chargée:', produit.nom)}
                    onError={() => console.error('❌ Erreur chargement image:', produit.nom, getImageUrl(produit.imageUrl))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatutBadge(produit.statut)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{produit.nom}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{produit.description}</p>

                <div className="flex items-center space-x-2 mb-2">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{produit.vendeurBoutique}</span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{produit.categorieNom}</span>
                </div>

                {/* Détails du produit */}
                <div className="space-y-1 mb-3">
                  {produit.taille && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Taille:</span>
                      <span className="text-xs font-medium text-gray-700">{produit.taille}</span>
                    </div>
                  )}
                  {produit.couleur && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Couleur:</span>
                      <span className="text-xs font-medium text-gray-700">{produit.couleur}</span>
                    </div>
                  )}
                  {produit.matiere && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Matière:</span>
                      <span className="text-xs font-medium text-gray-700">{produit.matiere}</span>
                    </div>
                  )}
                  {produit.poids && produit.poids > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Poids:</span>
                      <span className="text-xs font-medium text-gray-700">{produit.poids} kg</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formatPrice(produit.prix)}</div>
                    {produit.prixPromo && (
                      <div className="text-sm text-gray-500 line-through">{formatPrice(produit.prixPromo)}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stock: <span className="font-semibold">{produit.stock}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                  {produit.statut === 'EN_ATTENTE' && (
                    <>
                      <button
                        onClick={() => handlePublishProduct(produit)}
                        className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        title="Publier"
                      >
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Publier
                      </button>
                      <button
                        onClick={() => handleRejectProduct(produit)}
                        className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Rejeter"
                      >
                        <XCircle className="h-3 w-3 inline mr-1" />
                        Rejeter
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openEditModal(produit)}
                    className="flex-1 px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-3 w-3 inline mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(produit.id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editMode ? 'Modifier le produit' : 'Créer un nouveau produit'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={editMode ? handleUpdateProduct : handleCreateProduct} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vendeur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Store className="h-4 w-4 text-red-600" />
                        Vendeur *
                      </label>
                      <select
                        value={productForm.vendeurId}
                        onChange={(e) => setProductForm({ ...productForm, vendeurId: Number(e.target.value) })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          productForm.vendeurId === 0 ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value={0}>⚠️ Sélectionner un vendeur</option>
                        {vendeurs.map(v => (
                          <option key={v.id} value={v.id}>{v.nomBoutique} ({v.prenom} {v.nom})</option>
                        ))}
                      </select>
                      {productForm.vendeurId === 0 && (
                        <p className="mt-1 text-xs text-orange-600">⚠️ Ce champ est obligatoire</p>
                      )}
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-red-600" />
                        Catégorie *
                      </label>
                      <select
                        value={productForm.categorieId}
                        onChange={(e) => setProductForm({ ...productForm, categorieId: Number(e.target.value) })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          productForm.categorieId === 0 ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value={0}>⚠️ Sélectionner une catégorie</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nom} ({c.type} - {c.genre})
                          </option>
                        ))}
                      </select>
                      {productForm.categorieId === 0 && (
                        <p className="mt-1 text-xs text-orange-600">⚠️ Ce champ est obligatoire</p>
                      )}
                    </div>
                  </div>

                  {/* Nom du produit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                    <input
                      type="text"
                      value={productForm.nom}
                      onChange={(e) => setProductForm({ ...productForm, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="Ex: Boubou traditionnel brodé"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="Description détaillée du produit..."
                    />
                  </div>

                  {/* Prix et Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                      <input
                        type="number"
                        value={productForm.prix}
                        onChange={(e) => setProductForm({ ...productForm, prix: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix promo (FCFA)</label>
                      <input
                        type="number"
                        value={productForm.prixPromo || ''}
                        onChange={(e) => setProductForm({ ...productForm, prixPromo: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="0"
                        placeholder="Optionnel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Image principale */}
                  <div>
                    <ImageUpload
                      label="Image principale"
                      value={productForm.imageUrl}
                      onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                      required={true}
                      type="produit"
                    />
                  </div>

                  {/* Images supplémentaires */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Images supplémentaires</label>
                    <div className="space-y-4">
                      {imageInputs.map((img, index) => (
                        <div key={index} className="relative">
                          <ImageUpload
                            value={img}
                            onChange={(url) => updateImageInput(index, url)}
                            required={false}
                            type="produit"
                          />
                          {imageInputs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageInput(index)}
                              className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImageInput}
                        className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-colors w-full justify-center"
                      >
                        <Plus className="h-5 w-5" />
                        <span className="font-medium">Ajouter une image supplémentaire</span>
                      </button>
                    </div>
                  </div>

                  {/* Caractéristiques optionnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                      <input
                        type="text"
                        value={productForm.taille}
                        onChange={(e) => setProductForm({ ...productForm, taille: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="S, M, L, XL..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                      <input
                        type="text"
                        value={productForm.couleur}
                        onChange={(e) => setProductForm({ ...productForm, couleur: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Rouge, Bleu..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                      <input
                        type="text"
                        value={productForm.matiere}
                        onChange={(e) => setProductForm({ ...productForm, matiere: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Coton, Soie..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={productForm.poids}
                        onChange={(e) => setProductForm({ ...productForm, poids: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="0.5"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
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
                          <span>{editMode ? 'Modifier' : 'Créer le produit'}</span>
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
    </div>
  );
};

export default AdminProducts;

