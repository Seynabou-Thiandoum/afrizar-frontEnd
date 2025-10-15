import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Grid3x3,
  Users
} from 'lucide-react';
import categorieService, { Categorie } from '../../services/categorieService';
import ImageUpload from '../common/ImageUpload';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [categorieForm, setCategorieForm] = useState({
    nom: '',
    description: '',
    imageUrl: '',
    type: 'VETEMENTS' as 'VETEMENTS' | 'ACCESSOIRES',
    genre: 'HOMME' as 'HOMME' | 'FEMME' | 'ENFANT',
    ordre: 0,
    active: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categorieService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des catégories' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategorie = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await categorieService.createCategorie(categorieForm);
      setMessage({ type: 'success', text: 'Catégorie créée avec succès !' });
      setShowModal(false);
      resetForm();
      loadCategories();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la création de la catégorie' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategorie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategorie) return;

    setLoading(true);
    setMessage(null);

    try {
      await categorieService.updateCategorie(selectedCategorie.id, categorieForm);
      setMessage({ type: 'success', text: 'Catégorie mise à jour avec succès !' });
      setShowModal(false);
      setEditMode(false);
      loadCategories();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour de la catégorie' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategorie = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await categorieService.deleteCategorie(id);
      setMessage({ type: 'success', text: 'Catégorie supprimée avec succès' });
      loadCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression de la catégorie' });
    }
  };

  const handleToggleActive = async (categorie: Categorie) => {
    try {
      if (categorie.active) {
        await categorieService.desactiverCategorie(categorie.id);
        setMessage({ type: 'success', text: 'Catégorie désactivée avec succès' });
      } else {
        await categorieService.activerCategorie(categorie.id);
        setMessage({ type: 'success', text: 'Catégorie activée avec succès' });
      }
      loadCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification de la catégorie' });
    }
  };

  const resetForm = () => {
    setCategorieForm({
      nom: '',
      description: '',
      imageUrl: '',
      type: 'VETEMENTS',
      genre: 'HOMME',
      ordre: 0,
      active: true
    });
  };

  const openEditModal = (categorie: Categorie) => {
    setSelectedCategorie(categorie);
    setCategorieForm({
      nom: categorie.nom,
      description: categorie.description || '',
      imageUrl: categorie.imageUrl || '',
      type: categorie.type || 'VETEMENTS',
      genre: categorie.genre || 'HOMME',
      ordre: categorie.ordre,
      active: categorie.active
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openDetailModal = (categorie: Categorie) => {
    setSelectedCategorie(categorie);
    setShowModal(true);
    setEditMode(false);
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'VETEMENTS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getGenreBadgeColor = (genre: string) => {
    switch (genre) {
      case 'HOMME':
        return 'bg-blue-100 text-blue-800';
      case 'FEMME':
        return 'bg-pink-100 text-pink-800';
      case 'ENFANT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group categories by type and genre, sorted by order
  const groupedCategories = categories
    .sort((a, b) => a.ordre - b.ordre) // Tri par ordre d'affichage
    .reduce((acc, cat) => {
      const type = cat.type || 'AUTRE';
      const genre = cat.genre || 'MIXTE';
      
      if (!acc[type]) acc[type] = {};
      if (!acc[type][genre]) acc[type][genre] = [];
      acc[type][genre].push(cat);
      return acc;
    }, {} as Record<string, Record<string, Categorie[]>>);

  // const filteredCategories = categories.filter(cat =>
  //   cat.nom.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditMode(false);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Tag className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.active).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vêtements</p>
              <p className="text-2xl font-bold text-purple-600">{categories.filter(c => c.type === 'VETEMENTS').length}</p>
            </div>
            <Grid3x3 className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accessoires</p>
              <p className="text-2xl font-bold text-blue-600">{categories.filter(c => c.type === 'ACCESSOIRES').length}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Homme</p>
              <p className="text-2xl font-bold text-blue-600">{categories.filter(c => c.genre === 'HOMME').length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Femme</p>
              <p className="text-2xl font-bold text-pink-600">{categories.filter(c => c.genre === 'FEMME').length}</p>
            </div>
            <Users className="h-8 w-8 text-pink-400" />
          </div>
        </div>
      </div>

      {/* Categories by Type and Genre */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : Object.keys(groupedCategories).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([type, genreGroups]) => (
            <div key={type} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeColor(type)}`}>
                  {type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'}
                </span>
                <span className="text-gray-400">({Object.values(genreGroups).flat().length})</span>
              </h3>

              {Object.entries(genreGroups).map(([genre, cats]) => (
                <div key={genre} className="mb-6 last:mb-0">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGenreBadgeColor(genre)}`}>
                      {genre === 'HOMME' ? 'Homme' : genre === 'FEMME' ? 'Femme' : 'Enfant'}
                    </span>
                    <span className="text-gray-400 text-sm">({cats.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cats.map((cat) => (
                      <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {cat.imageUrl ? (
                                <img
                                  src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:8080${cat.imageUrl}`}
                                  alt={cat.nom}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                                  onClick={() => openDetailModal(cat)}
                                  onLoad={() => {
                                    console.log('✅ Image de catégorie chargée:', cat.nom, cat.imageUrl);
                                  }}
                                  onError={(e) => {
                                    console.error('❌ Erreur chargement image catégorie:', cat.nom, cat.imageUrl);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center border border-gray-200">
                                  <Tag className="h-6 w-6 text-white" />
                                </div>
                              )}
                              <div>
                                <h5 className="font-bold text-gray-900">{cat.nom}</h5>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Ordre: {cat.ordre}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    cat.ordre <= 3 ? 'bg-green-100 text-green-800' : 
                                    cat.ordre <= 6 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {cat.ordre <= 3 ? 'Priorité haute' : 
                                     cat.ordre <= 6 ? 'Priorité moyenne' : 
                                     'Priorité basse'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {cat.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cat.description}</p>
                            )}
                          </div>
                          {cat.active ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => openDetailModal(cat)}
                            className="flex-1 px-3 py-1.5 text-sm border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors"
                          >
                            <Eye className="h-3 w-3 inline mr-1" />
                            Détails
                          </button>
                          <button
                            onClick={() => openEditModal(cat)}
                            className="flex-1 px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-3 w-3 inline mr-1" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleToggleActive(cat)}
                            className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
                              cat.active
                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {cat.active ? 'Désactiver' : 'Activer'}
                          </button>
                          <button
                            onClick={() => handleDeleteCategorie(cat.id)}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune catégorie trouvée</p>
              <button
                onClick={() => {
                  resetForm();
                  setEditMode(false);
                  setShowModal(true);
                }}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Créer votre première catégorie
              </button>
            </div>
          )}
        </div>
      ) : (
        // Affichage simple si pas de groupement (catégories sans type/genre)
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Toutes les catégories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:8080${cat.imageUrl}`}
                          alt={cat.nom}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                          onClick={() => openDetailModal(cat)}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center border border-gray-200">
                          <Tag className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-bold text-gray-900">{cat.nom}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Ordre: {cat.ordre}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cat.ordre <= 3 ? 'bg-green-100 text-green-800' : 
                            cat.ordre <= 6 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cat.ordre <= 3 ? 'Priorité haute' : 
                             cat.ordre <= 6 ? 'Priorité moyenne' : 
                             'Priorité basse'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {cat.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                  {cat.active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => openDetailModal(cat)}
                    className="flex-1 px-3 py-1.5 text-sm border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors"
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    Détails
                  </button>
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex-1 px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-3 w-3 inline mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
                      cat.active
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {cat.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleDeleteCategorie(cat.id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editMode ? 'Modifier la catégorie' : selectedCategorie && !editMode ? 'Détails de la catégorie' : 'Créer une nouvelle catégorie'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {selectedCategorie && !editMode ? (
                  // Modal de détails (lecture seule)
                  <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                      {selectedCategorie.imageUrl ? (
                        <img
                          src={selectedCategorie.imageUrl.startsWith('http') ? selectedCategorie.imageUrl : `http://localhost:8080${selectedCategorie.imageUrl}`}
                          alt={selectedCategorie.nom}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center border border-gray-200">
                          <Tag className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedCategorie.nom}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(selectedCategorie.type || 'VETEMENTS')}`}>
                            {selectedCategorie.type === 'VETEMENTS' ? 'Vêtements' : 'Accessoires'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreBadgeColor(selectedCategorie.genre || 'HOMME')}`}>
                            {selectedCategorie.genre === 'HOMME' ? 'Homme' : selectedCategorie.genre === 'FEMME' ? 'Femme' : 'Enfant'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedCategorie.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedCategorie.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedCategorie.description && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700">{selectedCategorie.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Ordre d'affichage</h4>
                        <p className="text-gray-700">{selectedCategorie.ordre}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Date de création</h4>
                        <p className="text-gray-700">{new Date(selectedCategorie.dateCreation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() => openEditModal(selectedCategorie)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 inline mr-2" />
                        Modifier
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modal de création/édition
                  <form onSubmit={editMode ? handleUpdateCategorie : handleCreateCategorie} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la catégorie *</label>
                    <input
                      type="text"
                      value={categorieForm.nom}
                      onChange={(e) => setCategorieForm({ ...categorieForm, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="Ex: Boubous, Chemises, Bijoux..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                      <select
                        value={categorieForm.type}
                        onChange={(e) => setCategorieForm({ ...categorieForm, type: e.target.value as 'VETEMENTS' | 'ACCESSOIRES' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="VETEMENTS">Vêtements</option>
                        <option value="ACCESSOIRES">Accessoires</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                      <select
                        value={categorieForm.genre}
                        onChange={(e) => setCategorieForm({ ...categorieForm, genre: e.target.value as 'HOMME' | 'FEMME' | 'ENFANT' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="HOMME">Homme</option>
                        <option value="FEMME">Femme</option>
                        <option value="ENFANT">Enfant</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={categorieForm.description}
                      onChange={(e) => setCategorieForm({ ...categorieForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Description de la catégorie..."
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="Image de la catégorie"
                      value={categorieForm.imageUrl}
                      onChange={(url) => setCategorieForm({ ...categorieForm, imageUrl: url })}
                      required={false}
                      type="categorie"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Cette image sera affichée pour représenter la catégorie dans l'interface utilisateur
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                      <input
                        type="number"
                        value={categorieForm.ordre}
                        onChange={(e) => setCategorieForm({ ...categorieForm, ordre: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="0"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Détermine l'ordre d'affichage des catégories (1 = premier, 2 = deuxième, etc.)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <div className="flex items-center space-x-4 pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={categorieForm.active}
                            onChange={() => setCategorieForm({ ...categorieForm, active: true })}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!categorieForm.active}
                            onChange={() => setCategorieForm({ ...categorieForm, active: false })}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-gray-700">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
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
                          <span>{editMode ? 'Modifier' : 'Créer la catégorie'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

