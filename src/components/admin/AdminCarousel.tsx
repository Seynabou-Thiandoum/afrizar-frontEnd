import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, X } from 'lucide-react';
import adminCarouselService, { CarouselSlide } from '../../services/adminCarouselService';

const AdminCarousel = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState<Partial<CarouselSlide>>({
    titre: '',
    sousTitre: '',
    imageUrl: '',
    badge: 'HOT',
    boutonTexte: 'Découvrir',
    boutonLien: '#',
    ordreAffichage: 0,
  });

  useEffect(() => {
    chargerSlides();
  }, []);

  const chargerSlides = async () => {
    try {
      setLoading(true);
      const data = await adminCarouselService.obtenirTousLesSlides();
      setSlides(data);
    } catch (error) {
      console.error('Erreur chargement slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        await adminCarouselService.modifierSlide(editingSlide.id!, formData as CarouselSlide);
        console.log('Slide modifié avec succès');
      } else {
        await adminCarouselService.creerSlide(formData as CarouselSlide);
        console.log('Slide créé avec succès');
      }
      resetForm();
      chargerSlides();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce slide ?')) return;
    try {
      await adminCarouselService.supprimerSlide(id);
      console.log('Slide supprimé avec succès');
      chargerSlides();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleToggleActif = async (id: number) => {
    try {
      await adminCarouselService.basculerActif(id);
      chargerSlides();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      sousTitre: '',
      imageUrl: '',
      badge: 'HOT',
      boutonTexte: 'Découvrir',
      boutonLien: '#',
      ordreAffichage: 0,
    });
    setEditingSlide(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion du Carousel</h2>
          <p className="text-gray-600">Configurez les slides de votre page d'accueil</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un Slide</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun slide</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier slide</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48">
                <img
                  src={slide.imageUrl}
                  alt={slide.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Slide';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleActif(slide.id!)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full"
                  >
                    {slide.actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                {slide.badge && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {slide.badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{slide.titre}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{slide.sousTitre}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">Ordre: {slide.ordreAffichage}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
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
                {editingSlide ? 'Modifier le Slide' : 'Nouveau Slide'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-titre *
                </label>
                <input
                  type="text"
                  value={formData.sousTitre}
                  onChange={(e) => setFormData({ ...formData, sousTitre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="HOT">HOT</option>
                    <option value="NEW">NEW</option>
                    <option value="PROMO">PROMO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.ordreAffichage}
                    onChange={(e) => setFormData({ ...formData, ordreAffichage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte du bouton
                  </label>
                  <input
                    type="text"
                    value={formData.boutonTexte}
                    onChange={(e) => setFormData({ ...formData, boutonTexte: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien du bouton
                  </label>
                  <input
                    type="text"
                    value={formData.boutonLien}
                    onChange={(e) => setFormData({ ...formData, boutonLien: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingSlide ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarousel;
