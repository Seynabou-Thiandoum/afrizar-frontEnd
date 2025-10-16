import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Tag,
  Image as ImageIcon,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Users
} from 'lucide-react';
import { categorieService, Categorie } from '../../services/categorieService';
import ImageUpload from '../common/ImageUpload';

const AdminCategoriesNew: React.FC = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [categoriesFiltres, setCategoriesFiltres] = useState<Categorie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'VETEMENTS' | 'ACCESSOIRES' | 'TOUS'>('TOUS');
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  const [categorieForm, setCategorieForm] = useState({
    nom: '',
    slug: '',
    description: '',
    type: 'VETEMENTS' as 'VETEMENTS' | 'ACCESSOIRES',
    genre: 'HOMME' as 'HOMME' | 'FEMME' | 'ENFANT',
    imageUrl: '',
    ordre: 0,
    active: true,
    parentId: null as number | null
  });

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories();
  }, []);

  // Filtrer les catégories
  useEffect(() => {
    filterCategories();
  }, [searchTerm, filterType, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categorieService.getHierarchieComplete();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    const terme = searchTerm.toLowerCase();
    let categoriesFiltres = categories.filter(categorie => {
      const correspondNom = categorie.nom.toLowerCase().includes(terme);
      const correspondType = filterType === 'TOUS' || categorie.type === filterType;
      return correspondNom && correspondType;
    });
    setCategoriesFiltres(categoriesFiltres);
  };

  const resetForm = () => {
    setCategorieForm({
      nom: '',
      slug: '',
      description: '',
      type: 'VETEMENTS',
      genre: 'HOMME',
      imageUrl: '',
      ordre: 0,
      active: true,
      parentId: null
    });
    setEditMode(false);
    setSelectedCategorie(null);
  };

  const openModal = (categorie?: Categorie) => {
    if (categorie) {
      setCategorieForm({
        nom: categorie.nom,
        slug: categorie.slug || '',
        description: categorie.description || '',
        type: categorie.type || 'VETEMENTS',
        genre: categorie.genre || 'HOMME',
        imageUrl: categorie.imageUrl || '',
        ordre: categorie.ordre || 0,
        active: categorie.active,
        parentId: categorie.parentId || null
      });
      setEditMode(true);
      setSelectedCategorie(categorie);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode && selectedCategorie) {
        await categorieService.updateCategorie(selectedCategorie.id, categorieForm);
      } else {
        await categorieService.createCategorie(categorieForm);
      }
      
      await loadCategories();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categorieService.deleteCategorie(id);
        await loadCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNomChange = (nom: string) => {
    setCategorieForm(prev => ({
      ...prev,
      nom,
      slug: generateSlug(nom)
    }));
  };

  const renderCategoryTree = (categories: Categorie[], level = 0) => {
    return categories.map(categorie => (
      <div key={categorie.id} className="mb-2">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            categorie.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3">
            {categorie.sousCategories && categorie.sousCategories.length > 0 && (
              <button
                onClick={() => toggleExpanded(categorie.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(categorie.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            
            {categorie.imageUrl ? (
              <img 
                src={categorie.imageUrl} 
                alt={categorie.nom}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-gray-900">{categorie.nom}</h3>
              <p className="text-sm text-gray-500">
                {categorie.type === 'VETEMENTS' ? '👔 Vêtements' : '💎 Accessoires'} • 
                {categorie.genre === 'HOMME' ? '👨 Homme' : categorie.genre === 'FEMME' ? '👩 Femme' : '👶 Enfant'}
                {categorie.parentId && ' • Sous-catégorie'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              categorie.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {categorie.active ? 'Actif' : 'Inactif'}
            </span>
            
            <button
              onClick={() => openModal(categorie)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => handleDelete(categorie.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {categorie.sousCategories && categorie.sousCategories.length > 0 && expandedCategories.has(categorie.id) && (
          <div className="ml-4">
            {renderCategoryTree(categorie.sousCategories, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Statistiques
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.active).length;
  const vetementsCategories = categories.filter(c => c.type === 'VETEMENTS').length;
  const accessoiresCategories = categories.filter(c => c.type === 'ACCESSOIRES').length;
  const hommeCategories = categories.filter(c => c.genre === 'HOMME').length;
  const femmeCategories = categories.filter(c => c.genre === 'FEMME').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Catégories</h1>
          <p className="text-gray-600">Organisez vos catégories de produits avec une structure hiérarchique</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Actives</p>
                <p className="text-2xl font-bold text-green-600">{activeCategories}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Vêtements</p>
                <p className="text-2xl font-bold text-blue-600">{vetementsCategories}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Accessoires</p>
                <p className="text-2xl font-bold text-purple-600">{accessoiresCategories}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Homme</p>
                <p className="text-2xl font-bold text-blue-600">{hommeCategories}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Femme</p>
                <p className="text-2xl font-bold text-pink-600">{femmeCategories}</p>
              </div>
              <Users className="h-8 w-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Filtres et Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              {/* Filtre par type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TOUS">📦 Tous les types</option>
                <option value="VETEMENTS">👔 Vêtements</option>
                <option value="ACCESSOIRES">💎 Accessoires</option>
              </select>
            </div>
            
            {/* Bouton Ajouter */}
            <button
              onClick={() => openModal()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle catégorie</span>
            </button>
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : categoriesFiltres.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune catégorie trouvée</p>
              </div>
            ) : (
              <div className="space-y-2">
                {renderCategoryTree(categoriesFiltres)}
              </div>
            )}
          </div>
        </div>

        {/* Modal de création/édition */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editMode ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de la catégorie *
                    </label>
                    <input
                      type="text"
                      required
                      value={categorieForm.nom}
                      onChange={(e) => handleNomChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: Boubous, Costumes, Robes..."
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={categorieForm.slug}
                      onChange={(e) => setCategorieForm({ ...categorieForm, slug: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="boubous-homme"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={categorieForm.type}
                      onChange={(e) => setCategorieForm({ ...categorieForm, type: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="VETEMENTS">👔 Vêtements</option>
                      <option value="ACCESSOIRES">💎 Accessoires</option>
                    </select>
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Genre *
                    </label>
                    <select
                      required
                      value={categorieForm.genre}
                      onChange={(e) => setCategorieForm({ ...categorieForm, genre: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="HOMME">👨 Homme</option>
                      <option value="FEMME">👩 Femme</option>
                      <option value="ENFANT">👶 Enfant</option>
                    </select>
                  </div>

                  {/* Catégorie parent */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie parent (optionnel)
                    </label>
                    <select
                      value={categorieForm.parentId || ''}
                      onChange={(e) => setCategorieForm({ 
                        ...categorieForm, 
                        parentId: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Aucune (catégorie racine)</option>
                      {categories
                        .filter(c => !c.parentId) // Seulement les catégories racines
                        .map(categorie => (
                          <option key={categorie.id} value={categorie.id}>
                            {categorie.nom}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Ordre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={categorieForm.ordre}
                      onChange={(e) => setCategorieForm({ ...categorieForm, ordre: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categorieForm.description}
                    onChange={(e) => setCategorieForm({ ...categorieForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Description de la catégorie..."
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image de la catégorie
                  </label>
                  <ImageUpload
                    type="categorie"
                    onChange={(url) => setCategorieForm({ ...categorieForm, imageUrl: url })}
                    value={categorieForm.imageUrl}
                  />
                </div>

                {/* Statut actif */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={categorieForm.active}
                    onChange={(e) => setCategorieForm({ ...categorieForm, active: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-900">
                    Catégorie active
                  </label>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sauvegarde...' : (editMode ? 'Modifier' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesNew;
