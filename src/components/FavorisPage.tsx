import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Trash2, Package, Star, MapPin, User } from 'lucide-react';
import { useFavoris } from '../contexts/FavorisContext';
import { usePanier } from '../contexts/PanierContext';
import { API_CONFIG } from '../config/api';

const FavorisPage = ({ onBack }: { onBack: () => void }) => {
  const { favorisDetails, loading, supprimerFavori, chargerFavoris } = useFavoris();
  const { ajouterAuPanier } = usePanier();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    chargerFavoris();
  }, []);

  const handleAjouterAuPanier = async (produit: any) => {
    try {
      setAddingToCart(produit.id);
      await ajouterAuPanier(produit);
      console.log('Produit ajouté au panier');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleSupprimerFavori = async (produitId: number) => {
    try {
      await supprimerFavori(produitId);
      console.log('Produit supprimé des favoris');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return 'https://via.placeholder.com/300x300?text=Produit';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_CONFIG.BASE_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
                <p className="text-gray-600 mt-1">
                  {favorisDetails.length} produit{favorisDetails.length > 1 ? 's' : ''} sauvegardé{favorisDetails.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorisDetails.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore ajouté de produits à vos favoris.
            </p>
            <button
              onClick={onBack}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorisDetails.map((favori) => (
              <div key={favori.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image du produit */}
                <div className="relative aspect-w-16 aspect-h-12 bg-gray-100">
                  <img
                    src={getImageUrl(favori.produit?.imageUrl)}
                    alt={favori.produit?.nom}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Bouton supprimer des favoris */}
                  <button
                    onClick={() => handleSupprimerFavori(favori.produitId)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Supprimer des favoris"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>
                </div>

                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {favori.produit?.nom}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {favori.produit?.description}
                  </p>

                  {/* Vendeur */}
                  {favori.produit?.vendeur && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <User className="h-4 w-4 mr-1" />
                      <span>{favori.produit.vendeur.nomBoutique}</span>
                    </div>
                  )}

                  {/* Prix */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-orange-600">
                      {favori.produit?.prix ? `${favori.produit.prix.toLocaleString()} F CFA` : 'Prix sur demande'}
                    </span>
                    
                    {/* Note */}
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAjouterAuPanier(favori.produit)}
                      disabled={addingToCart === favori.produitId}
                      className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      {addingToCart === favori.produitId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Panier</span>
                        </>
                      )}
                    </button>
                    
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavorisPage;

