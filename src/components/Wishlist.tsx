import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Eye, 
  Trash2,
  MapPin,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Favori } from '../services/favorisService';
import { useAuth } from '../contexts/AuthContext';
import { useFavoris } from '../contexts/FavorisContext';
import { getImageUrl } from '../config/api';
import Swal from 'sweetalert2';
import favorisService from '../services/favorisService';
import publicProduitService from '../services/publicProduitService';

interface WishlistProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

const Wishlist = ({ onBack, onNavigate }: WishlistProps) => {
  const { user, isAuthenticated } = useAuth();
  const { favoris: favorisIds, supprimerFavori } = useFavoris();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoris();
  }, [favorisIds]);

  const loadFavoris = async () => {
    try {
      setLoading(true);
      
      // Si l'utilisateur est connecté, charger les détails depuis le serveur
      if (isAuthenticated && user) {
        try {
          const favoris = await favorisService.obtenirFavoris();
          setWishlistItems(favoris);
          return;
        } catch (err) {
          console.error('Erreur chargement favoris depuis serveur:', err);
        }
      }
      
      // Sinon, charger depuis les IDs locaux (localStorage)
      const favorisLocaux: any[] = [];
      for (const produitId of Array.from(favorisIds)) {
        try {
          const produit = await publicProduitService.getPublishedProduit(produitId);
          if (produit) {
            favorisLocaux.push({
              id: produitId,
              produitId: produitId,
              produitNom: produit.nom,
              produitPrix: produit.prix,
              produitImageUrl: produit.imageUrl,
              vendeurNom: produit.vendeur?.nomBoutique || 'Afrizar',
              dateAjout: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error(`Erreur chargement produit ${produitId}:`, err);
        }
      }
      
      setWishlistItems(favorisLocaux);
    } catch (err) {
      console.error('Erreur chargement favoris:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (favoriId: number) => {
    try {
      // Trouver le produitId correspondant au favoriId
      const favori = wishlistItems.find(item => item.id === favoriId || item.produitId === favoriId);
      if (!favori) return;
      
      const produitId = favori.produitId || favoriId;
      
      // Utiliser le contexte pour supprimer (fonctionne avec localStorage et serveur)
      await supprimerFavori(produitId);
      
      // Mettre à jour l'état local
      setWishlistItems(items => items.filter(item => (item.id !== favoriId && item.produitId !== produitId)));
      
      Swal.fire({
        icon: 'success',
        title: 'Retiré des favoris',
        text: 'Le produit a été retiré de vos favoris',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du retrait des favoris';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage
      });
    }
  };

  const addToCart = (product: any) => {
    console.log('Ajout au panier depuis favoris:', product);
    // TODO: Implémenter l'ajout au panier
    Swal.fire({
      icon: 'info',
      title: 'Fonctionnalité à venir',
      text: 'L\'ajout au panier sera bientôt disponible'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                Mes Favoris
              </h1>
              <p className="text-gray-600 font-medium">{wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} dans vos favoris</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun favori pour le moment</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos magnifiques créations et ajoutez vos coups de cœur à vos favoris
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-red-500/25 transform hover:scale-105"
            >
              Explorer le Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(item.produitImageUrl)}
                    alt={item.produitNom}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    En stock
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onNavigate('product-detail', { productId: item.produitId })}
                      className="p-3 bg-white/90 rounded-2xl text-gray-700 hover:bg-orange-600 hover:text-white transition-colors shadow-lg"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                      {item.vendeurNom}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.produitNom}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.vendeurNom}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Ajouté le {formatDate(item.dateAjout)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.produitPrix)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-bold flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Ajouter</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  wishlistItems.forEach(item => addToCart(item));
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
              >
                Tout Ajouter au Panier
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                Continuer les Achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;