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
  X
} from 'lucide-react';
import { categorieService, Categorie } from '../../services/categorieService';
import ImageUpload from '../common/ImageUpload';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [categoriesFiltres, setCategoriesFiltres] = useState<Categorie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'VETEMENTS' | 'ACCESSOIRES' | 'TOUS'>('TOUS');
  const [loading, setLoading] = useState(false);
  
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

  // Genres fixes
  const genresDisponibles = ['HOMME', 'FEMME', 'ENFANT'];

  useEffect(() => {
    chargerTypes();
  }, []);

  useEffect(() => {
    filtrerTypes();
  }, [searchTerm, filterType, categories]);

  const chargerTypes = async () => {
    setLoading(true);
    try {
      const categoriesData = await categorieService.getHierarchieComplete();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrerTypes = () => {
    const terme = searchTerm.toLowerCase();
    let categoriesFiltres = categories.filter(categorie => {
      const correspondNom = categorie.nom.toLowerCase().includes(terme);
      const correspondType = filterType === 'TOUS' || categorie.type === filterType;
      return correspondNom && correspondType;
    });
    setCategoriesFiltres(categoriesFiltres);
  };

  const resetForm = () => {
    setTypeForm({
      nom: '',
      description: '',
      type: 'VETEMENTS',
      imageUrl: '',
      ordre: 0,
      active: true,
      genres: []
    });
    setEditMode(false);
    setSelectedType(null);
  };

  const openModal = (type?: Categorie) => {
    if (type) {
      setTypeForm({
        nom: type.nom,
        description: type.description || '',
        type: type.type,
        imageUrl: type.imageUrl || '',
        ordre: type.ordre,
        active: type.active,
        genres: [] // On récupérera les genres associés si besoin
      });
      setEditMode(true);
      setSelectedType(type);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Créer ou mettre à jour le type
      const typeData: TypeCategorieFormData = {
        nom: typeForm.nom,
        description: typeForm.description,
        type: typeForm.type,
        imageUrl: typeForm.imageUrl,
        ordre: typeForm.ordre,
        active: typeForm.active
      };

      let typeId: number;
      if (editMode && selectedType) {
        const result = await typeCategorieService.mettreAJourType(selectedType.id, typeData);
        typeId = result.id;
      } else {
        const result = await typeCategorieService.creerType(typeData);
        typeId = result.id;
      }

      // Créer les associations avec les genres sélectionnés
      if (!editMode && typeForm.genres.length > 0) {
        // Récupérer tous les genres
        const allGenres = await genreCategorieService.obtenirTousLesGenres();
        
        // Filtrer les genres sélectionnés
        const genresSelectionnes = allGenres.filter(g => 
          typeForm.genres.includes(g.nom.toUpperCase()) && g.type === typeForm.type
        );

        // Créer les associations
        for (const genre of genresSelectionnes) {
          try {
            await categorieCombinaisonService.creerAssociation(genre.id, typeId);
          } catch (error) {
            console.error(`Erreur lors de l'association avec ${genre.nom}:`, error);
          }
        }
      }
      
      await chargerTypes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez que le nom n\'existe pas déjà.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (type: TypeCategorie) => {
    try {
      if (type.active) {
        await typeCategorieService.desactiverType(type.id);
      } else {
        await typeCategorieService.activerType(type.id);
      }
      await chargerTypes();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteType = async (type: TypeCategorie) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${type.nom}" ?`)) {
      try {
        await typeCategorieService.supprimerType(type.id);
        await chargerTypes();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de supprimer ce type. Il est peut-être utilisé par des produits.');
      }
    }
  };

  const toggleGenre = (genre: string) => {
    setTypeForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête moderne */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Tag className="w-10 h-10 text-red-600" />
                Gestion des Catégories
              </h1>
              <p className="text-gray-600 text-lg">
                Gérez les types de produits (Boubous, Costumes, Robes...)
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Catégorie
            </button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium"
          >
            <option value="TOUS">📦 Tous les types</option>
            <option value="VETEMENTS">👔 Vêtements</option>
            <option value="ACCESSOIRES">💎 Accessoires</option>
          </select>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total</p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <Tag className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Actives</p>
                <p className="text-3xl font-bold">{categories.filter(t => t.active).length}</p>
              </div>
              <Eye className="w-12 h-12 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Vêtements</p>
                <p className="text-3xl font-bold">{categories.filter(t => t.type === 'VETEMENTS').length}</p>
              </div>
              <Tag className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Liste des catégories */}
        {loading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesFiltres.map((type) => (
              <div key={type.id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {type.imageUrl ? (
                    <img 
                      src={type.imageUrl} 
                      alt={type.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Badge statut */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      type.active 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {type.active ? '✓ Actif' : '✗ Inactif'}
                    </span>
                  </div>

                  {/* Badge type */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      type.type === 'VETEMENTS' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {type.type === 'VETEMENTS' ? '👔 Vêtements' : '💎 Accessoires'}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {type.nom}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {type.description || 'Aucune description'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Ordre: {type.ordre}</span>
                    <span>Genres: {type.nombreGenres || 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(type)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleActive(type)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                        type.active
                          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {type.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteType(type)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucune catégorie */}
        {!loading && categoriesFiltres.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre première catégorie'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer une catégorie
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode ? '✏️ Modifier la catégorie' : '➕ Nouvelle catégorie'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={typeForm.nom}
                    onChange={(e) => setTypeForm({ ...typeForm, nom: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: Boubous, Costumes, Robes..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={typeForm.description}
                    onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Description de la catégorie..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={typeForm.type}
                      onChange={(e) => setTypeForm({ ...typeForm, type: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      <option value="VETEMENTS">👔 Vêtements</option>
                      <option value="ACCESSOIRES">💎 Accessoires</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={typeForm.ordre}
                      onChange={(e) => setTypeForm({ ...typeForm, ordre: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image de la catégorie
                  </label>
                  <ImageUpload
                    type="categorie"
                    onImageUploaded={(url) => setTypeForm({ ...typeForm, imageUrl: url })}
                    currentImageUrl={typeForm.imageUrl}
                  />
                </div>

                {!editMode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Disponible pour *
                    </label>
                    <div className="flex gap-3">
                      {genresDisponibles.map(genre => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            typeForm.genres.includes(genre)
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {typeForm.genres.includes(genre) && <Check className="w-4 h-4 inline mr-2" />}
                          {genre === 'HOMME' ? '👨 Homme' : genre === 'FEMME' ? '👩 Femme' : '👶 Enfant'}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Sélectionnez les genres pour lesquels cette catégorie sera disponible
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="active"
                    checked={typeForm.active}
                    onChange={(e) => setTypeForm({ ...typeForm, active: e.target.checked })}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-900">
                    Catégorie active (visible sur le site)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 shadow-lg"
                  >
                    {loading ? (
                      <>⏳ Sauvegarde...</>
                    ) : (
                      <>
                        <Check className="w-5 h-5 inline mr-2" />
                        {editMode ? 'Mettre à jour' : 'Créer'}
                      </>
                    )}
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

export default AdminCategories;