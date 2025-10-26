import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag, AlertCircle, Loader } from 'lucide-react';
import { usePanier } from '../contexts/PanierContext';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl as getFullImageUrl } from '../config/api';
import Swal from 'sweetalert2';

interface PanierPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const PanierPage: React.FC<PanierPageProps> = ({ onNavigate }) => {
  const { panier, loading, modifierQuantite, retirerDuPanier, viderPanier, rafraichirPanier } = usePanier();
  const { user, isAuthenticated } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    rafraichirPanier();
  }, []);

  // Helper pour obtenir l'URL complète de l'image
  const getImageUrl = (photos?: string[]) => {
    return getFullImageUrl(photos);
  };

  const handleModifierQuantite = async (itemIndex: number, nouvelleQuantite: number) => {
    try {
      setActionLoading(`quantity-${itemIndex}`);
      await modifierQuantite(itemIndex, nouvelleQuantite);
      Swal.fire({
        icon: 'success',
        title: 'Quantité modifiée',
        text: 'La quantité a été mise à jour avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la modification',
        confirmButtonText: 'OK'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetirerDuPanier = async (itemIndex: number) => {
    const result = await Swal.fire({
      title: 'Retirer l\'article',
      text: 'Voulez-vous vraiment retirer cet article du panier ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      setActionLoading(`remove-${itemIndex}`);
      await retirerDuPanier(itemIndex);
      Swal.fire({
        icon: 'success',
        title: 'Article retiré',
        text: 'L\'article a été retiré du panier',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors du retrait',
        confirmButtonText: 'OK'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViderPanier = async () => {
    const result = await Swal.fire({
      title: 'Vider le panier',
      text: 'Voulez-vous vraiment vider votre panier ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, vider',
      cancelButtonText: 'Annuler'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      setActionLoading('clear-cart');
      await viderPanier();
      Swal.fire({
        icon: 'success',
        title: 'Panier vidé',
        text: 'Votre panier a été vidé avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors du vidage du panier',
        confirmButtonText: 'OK'
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Chargement initial
  if (loading && !panier) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader className="h-12 w-12 text-[#F99834] mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Chargement de votre panier...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Panier vide
  if (!panier || panier.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">
              Commencez vos achats en parcourant nos catégories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('vetements')}
                className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors font-medium"
              >
                Voir les Vêtements
              </button>
              <button
                onClick={() => onNavigate('accessoires')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Voir les Accessoires
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('vetements')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continuer mes achats
          </button>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Mon Panier</h1>
          <p className="text-gray-600">{panier.nombreTotalArticles} article{panier.nombreTotalArticles > 1 ? 's' : ''} dans votre panier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {panier.items.map((item, index) => (
              <div key={item.id || index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  
                  {/* Image du produit */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.photos)}
                      alt={item.produitNom}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Informations du produit */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.produitNom}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.nomBoutique}</p>
                        
                        {/* Options sélectionnées */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.taille && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Taille: {item.taille}
                            </span>
                          )}
                          {item.couleur && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Couleur: {item.couleur}
                            </span>
                          )}
                        </div>

                        {/* Stock disponible */}
                        {item.stockDisponible < 5 && (
                          <div className="flex items-center text-orange-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Seulement {item.stockDisponible} en stock</span>
                          </div>
                        )}
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {item.prixUnitaire.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    {/* Contrôles quantité */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleModifierQuantite(index, item.quantite - 1)}
                          disabled={actionLoading === `quantity-${index}` || item.quantite <= 1}
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantite}
                        </span>
                        
                        <button
                          onClick={() => handleModifierQuantite(index, item.quantite + 1)}
                          disabled={actionLoading === `quantity-${index}` || (item.stockDisponible && item.quantite >= item.stockDisponible)}
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Sous-total et suppression */}
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-bold text-gray-900">
                          {item.sousTotal.toLocaleString()} FCFA
                        </p>
                        <button
                          onClick={() => handleRetirerDuPanier(index)}
                          disabled={actionLoading === `remove-${index}`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Retirer du panier"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bouton vider le panier */}
            {panier.items.length > 0 && (
              <button
                onClick={handleViderPanier}
                disabled={actionLoading === 'clear-cart'}
                className="w-full py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {actionLoading === 'clear-cart' ? (
                  <span className="flex items-center justify-center">
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Vidage en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Vider le panier
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold text-gray-900">
                    {panier.montantTotal.toLocaleString()} FCFA
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-sm text-gray-500">Calculée à l'étape suivante</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#F99834]">
                      {panier.montantTotal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>💡 Information :</strong> Les frais de livraison seront calculés en fonction de votre adresse
                </p>
              </div>

              {/* Bouton commander */}
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Passer la commande</span>
              </button>

              {/* Continuer les achats */}
              <button
                onClick={() => onNavigate('vetements')}
                className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continuer mes achats
              </button>

              {/* Garanties */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Livraison suivie</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Retour sous 14 jours</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PanierPage;

