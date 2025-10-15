import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Link,
  Unlink,
  Users,
  Tag,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { typeCategorieService, TypeCategorie, TypeCategorieFormData } from '../../services/typeCategorieService';
import { genreCategorieService, GenreCategorie, GenreCategorieFormData } from '../../services/genreCategorieService';
import { categorieCombinaisonService, CategorieCombinaison } from '../../services/categorieCombinaisonService';

const AdminCategories: React.FC = () => {
  // États pour les types
  const [types, setTypes] = useState<TypeCategorie[]>([]);
  const [typesFiltres, setTypesFiltres] = useState<TypeCategorie[]>([]);
  const [typeForm, setTypeForm] = useState<TypeCategorieFormData>({
    nom: '',
    description: '',
    type: 'VETEMENTS',
    imageUrl: '',
    ordre: 0,
    active: true
  });

  // États pour les genres
  const [genres, setGenres] = useState<GenreCategorie[]>([]);
  const [genresFiltres, setGenresFiltres] = useState<GenreCategorie[]>([]);
  const [genreForm, setGenreForm] = useState<GenreCategorieFormData>({
    nom: '',
    description: '',
    type: 'VETEMENTS',
    imageUrl: '',
    ordre: 0,
    active: true
  });

  // États pour les associations
  const [associations, setAssociations] = useState<CategorieCombinaison[]>([]);
  const [associationsFiltrees, setAssociationsFiltrees] = useState<CategorieCombinaison[]>([]);

  // États pour l'interface
  const [activeTab, setActiveTab] = useState<'types' | 'genres' | 'associations'>('types');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showAssociationModal, setShowAssociationModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedType, setSelectedType] = useState<TypeCategorie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<GenreCategorie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'VETEMENTS' | 'ACCESSOIRES' | 'TOUS'>('TOUS');
  const [loading, setLoading] = useState(false);

  // Charger les données
  useEffect(() => {
    chargerDonnees();
  }, []);

  // Filtrer les données
  useEffect(() => {
    filtrerDonnees();
  }, [searchTerm, filterType, types, genres, associations]);

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [typesData, genresData, associationsData] = await Promise.all([
        typeCategorieService.obtenirTousLesTypes(),
        genreCategorieService.obtenirTousLesGenres(),
        categorieCombinaisonService.obtenirToutesLesAssociations()
      ]);
      
      setTypes(typesData);
      setGenres(genresData);
      setAssociations(associationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrerDonnees = () => {
    const terme = searchTerm.toLowerCase();
    
    // Filtrer les types
    let typesFiltres = types.filter(type => {
      const correspondNom = type.nom.toLowerCase().includes(terme);
      const correspondType = filterType === 'TOUS' || type.type === filterType;
      return correspondNom && correspondType;
    });
    setTypesFiltres(typesFiltres);

    // Filtrer les genres
    let genresFiltres = genres.filter(genre => {
      const correspondNom = genre.nom.toLowerCase().includes(terme);
      const correspondType = filterType === 'TOUS' || genre.type === filterType;
      return correspondNom && correspondType;
    });
    setGenresFiltres(genresFiltres);

    // Filtrer les associations
    let associationsFiltrees = associations.filter(association => {
      const correspondNom = association.affichage.toLowerCase().includes(terme);
      return correspondNom;
    });
    setAssociationsFiltrees(associationsFiltrees);
  };

  // Gestion des types
  const resetTypeForm = () => {
    setTypeForm({
      nom: '',
      description: '',
      type: 'VETEMENTS',
      imageUrl: '',
      ordre: 0,
      active: true
    });
    setEditMode(false);
    setSelectedType(null);
  };

  const openTypeModal = (type?: TypeCategorie) => {
    if (type) {
      setTypeForm({
        nom: type.nom,
        description: type.description || '',
        type: type.type,
        imageUrl: type.imageUrl || '',
        ordre: type.ordre,
        active: type.active
      });
      setEditMode(true);
      setSelectedType(type);
    } else {
      resetTypeForm();
    }
    setShowTypeModal(true);
  };

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode && selectedType) {
        await typeCategorieService.mettreAJourType(selectedType.id, typeForm);
      } else {
        await typeCategorieService.creerType(typeForm);
      }
      
      await chargerDonnees();
      setShowTypeModal(false);
      resetTypeForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du type:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des genres
  const resetGenreForm = () => {
    setGenreForm({
      nom: '',
      description: '',
      type: 'VETEMENTS',
      imageUrl: '',
      ordre: 0,
      active: true
    });
    setEditMode(false);
    setSelectedGenre(null);
  };

  const openGenreModal = (genre?: GenreCategorie) => {
    if (genre) {
      setGenreForm({
        nom: genre.nom,
        description: genre.description || '',
        type: genre.type,
        imageUrl: genre.imageUrl || '',
        ordre: genre.ordre,
        active: genre.active
      });
      setEditMode(true);
      setSelectedGenre(genre);
    } else {
      resetGenreForm();
    }
    setShowGenreModal(true);
  };

  const handleGenreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode && selectedGenre) {
        await genreCategorieService.mettreAJourGenre(selectedGenre.id, genreForm);
      } else {
        await genreCategorieService.creerGenre(genreForm);
      }
      
      await chargerDonnees();
      setShowGenreModal(false);
      resetGenreForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du genre:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des associations
  const openAssociationModal = () => {
    setShowAssociationModal(true);
  };

  const handleAssociationSubmit = async (genreId: number, typeId: number) => {
    setLoading(true);
    
    try {
      await categorieCombinaisonService.creerAssociation(genreId, typeId);
      await chargerDonnees();
      setShowAssociationModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'association:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actions sur les types
  const toggleTypeActive = async (type: TypeCategorie) => {
    try {
      if (type.active) {
        await typeCategorieService.desactiverType(type.id);
      } else {
        await typeCategorieService.activerType(type.id);
      }
      await chargerDonnees();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const deleteType = async (type: TypeCategorie) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le type "${type.nom}" ?`)) {
      try {
        await typeCategorieService.supprimerType(type.id);
        await chargerDonnees();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Actions sur les genres
  const toggleGenreActive = async (genre: GenreCategorie) => {
    try {
      if (genre.active) {
        await genreCategorieService.desactiverGenre(genre.id);
      } else {
        await genreCategorieService.activerGenre(genre.id);
      }
      await chargerDonnees();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const deleteGenre = async (genre: GenreCategorie) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le genre "${genre.nom}" ?`)) {
      try {
        await genreCategorieService.supprimerGenre(genre.id);
        await chargerDonnees();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Actions sur les associations
  const toggleAssociationActive = async (association: CategorieCombinaison) => {
    try {
      if (association.active) {
        await categorieCombinaisonService.desactiverAssociation(association.id);
      } else {
        await categorieCombinaisonService.activerAssociation(association.id);
      }
      await chargerDonnees();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const deleteAssociation = async (association: CategorieCombinaison) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'association "${association.affichage}" ?`)) {
      try {
        await categorieCombinaisonService.supprimerAssociation(association.id);
        await chargerDonnees();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Catégories - Nouvelle Approche
          </h1>
          <p className="text-gray-600">
            Gérez les types, genres et associations de manière intelligente
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('types')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'types'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Tag className="inline w-4 h-4 mr-2" />
                Types ({typesFiltres.length})
              </button>
              <button
                onClick={() => setActiveTab('genres')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'genres'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline w-4 h-4 mr-2" />
                Genres ({genresFiltres.length})
              </button>
              <button
                onClick={() => setActiveTab('associations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'associations'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Link className="inline w-4 h-4 mr-2" />
                Associations ({associationsFiltrees.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'VETEMENTS' | 'ACCESSOIRES' | 'TOUS')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="TOUS">Tous les types</option>
              <option value="VETEMENTS">Vêtements</option>
              <option value="ACCESSOIRES">Accessoires</option>
            </select>
            <button
              onClick={() => setActiveTab('types')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Type
            </button>
            <button
              onClick={() => setActiveTab('genres')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Genre
            </button>
            <button
              onClick={openAssociationModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              Nouvelle Association
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typesFiltres.map((type) => (
              <div key={type.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {type.nom}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {type.description || 'Aucune description'}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        type.type === 'VETEMENTS' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {type.type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        type.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {type.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ordre: {type.ordre} | Genres: {type.nombreGenres || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openTypeModal(type)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => toggleTypeActive(type)}
                    className={`px-3 py-2 text-sm rounded flex items-center justify-center gap-1 ${
                      type.active
                        ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {type.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteType(type)}
                    className="px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'genres' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genresFiltres.map((genre) => (
              <div key={genre.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {genre.nom}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {genre.description || 'Aucune description'}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        genre.type === 'VETEMENTS' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {genre.type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        genre.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {genre.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ordre: {genre.ordre} | Types: {genre.nombreTypes || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openGenreModal(genre)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => toggleGenreActive(genre)}
                    className={`px-3 py-2 text-sm rounded flex items-center justify-center gap-1 ${
                      genre.active
                        ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {genre.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteGenre(genre)}
                    className="px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'associations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associationsFiltrees.map((association) => (
              <div key={association.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {association.affichage}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {association.nomGenre} + {association.nomType}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        association.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {association.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ordre: {association.ordre}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAssociationActive(association)}
                    className={`flex-1 px-3 py-2 text-sm rounded flex items-center justify-center gap-1 ${
                      association.active
                        ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {association.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {association.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => deleteAssociation(association)}
                    className="px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modales */}
        {/* Modal Type */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? 'Modifier le Type' : 'Nouveau Type'}
              </h2>
              <form onSubmit={handleTypeSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Type
                    </label>
                    <input
                      type="text"
                      value={typeForm.nom}
                      onChange={(e) => setTypeForm({ ...typeForm, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={typeForm.description}
                      onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de Catégorie
                    </label>
                    <select
                      value={typeForm.type}
                      onChange={(e) => setTypeForm({ ...typeForm, type: e.target.value as 'VETEMENTS' | 'ACCESSOIRES' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="VETEMENTS">Vêtements</option>
                      <option value="ACCESSOIRES">Accessoires</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'Image
                    </label>
                    <input
                      type="url"
                      value={typeForm.imageUrl}
                      onChange={(e) => setTypeForm({ ...typeForm, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre
                    </label>
                    <input
                      type="number"
                      value={typeForm.ordre}
                      onChange={(e) => setTypeForm({ ...typeForm, ordre: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="typeActive"
                      checked={typeForm.active}
                      onChange={(e) => setTypeForm({ ...typeForm, active: e.target.checked })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="typeActive" className="ml-2 block text-sm text-gray-900">
                      Type actif
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowTypeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : (editMode ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Genre */}
        {showGenreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? 'Modifier le Genre' : 'Nouveau Genre'}
              </h2>
              <form onSubmit={handleGenreSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Genre
                    </label>
                    <input
                      type="text"
                      value={genreForm.nom}
                      onChange={(e) => setGenreForm({ ...genreForm, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={genreForm.description}
                      onChange={(e) => setGenreForm({ ...genreForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de Catégorie
                    </label>
                    <select
                      value={genreForm.type}
                      onChange={(e) => setGenreForm({ ...genreForm, type: e.target.value as 'VETEMENTS' | 'ACCESSOIRES' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="VETEMENTS">Vêtements</option>
                      <option value="ACCESSOIRES">Accessoires</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'Image
                    </label>
                    <input
                      type="url"
                      value={genreForm.imageUrl}
                      onChange={(e) => setGenreForm({ ...genreForm, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre
                    </label>
                    <input
                      type="number"
                      value={genreForm.ordre}
                      onChange={(e) => setGenreForm({ ...genreForm, ordre: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="genreActive"
                      checked={genreForm.active}
                      onChange={(e) => setGenreForm({ ...genreForm, active: e.target.checked })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="genreActive" className="ml-2 block text-sm text-gray-900">
                      Genre actif
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowGenreModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : (editMode ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Association */}
        {showAssociationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Nouvelle Association Genre + Type
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    id="genreSelect"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un genre</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>
                        {genre.nom} ({genre.type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    id="typeSelect"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un type</option>
                    {types.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.nom} ({type.type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssociationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const genreSelect = document.getElementById('genreSelect') as HTMLSelectElement;
                    const typeSelect = document.getElementById('typeSelect') as HTMLSelectElement;
                    const genreId = parseInt(genreSelect.value);
                    const typeId = parseInt(typeSelect.value);
                    
                    if (genreId && typeId) {
                      handleAssociationSubmit(genreId, typeId);
                    } else {
                      alert('Veuillez sélectionner un genre et un type');
                    }
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer l\'Association'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
