import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Mail, Phone, Package, Users, Award, Heart } from 'lucide-react';
import publicVendeurService, { PublicVendeur } from '../services/publicVendeurService';
import { API_CONFIG } from '../config/api';

// Helper pour construire l'URL complète de l'image
const getImageUrl = (photoUrl: string | undefined): string | undefined => {
  if (!photoUrl) return undefined;
  if (photoUrl.startsWith('http')) return photoUrl;
  return `${API_CONFIG.BASE_URL}${photoUrl}`;
};

interface VendorProfilePageProps {
  vendorId: number;
  onBack: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

const VendorProfilePage = ({ vendorId, onBack, onNavigate }: VendorProfilePageProps) => {
  const [vendor, setVendor] = useState<PublicVendeur | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendor();
  }, [vendorId]);

  const loadVendor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les informations du vendeur
      const vendorData = await publicVendeurService.getPublishedVendeur(vendorId);
      setVendor(vendorData);
      
      // Charger les produits du vendeur
      try {
        const productsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/produits/vendeur/${vendorId}`);
        const productsData = await productsResponse.json();
        setProducts(productsData.content || productsData || []);
      } catch (productErr) {
        console.error('Erreur chargement produits:', productErr);
        setProducts([]);
      }
    } catch (err) {
      setError('Vendeur non trouvé ou non publié');
      console.error('Erreur chargement vendeur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendeur non trouvé</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux vendeurs
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profil principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Photo de profil */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={getImageUrl(vendor.photoProfil) || 'https://via.placeholder.com/128x128?text=Photo'}
                    alt={vendor.nomBoutique}
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-100"
                    onLoad={() => {
                      console.log('✅ Image du vendeur chargée avec succès');
                    }}
                    onError={() => {
                      console.error('❌ Erreur chargement image vendeur');
                    }}
                  />
                  {vendor.verifie && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.nomBoutique}</h1>
                    <p className="text-xl text-orange-600 font-semibold">{vendor.prenom} {vendor.nom}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>Ajouter aux favoris</span>
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-xl font-bold ml-1">{Number(vendor.rating || 0).toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">({vendor.nombreEvaluations || 0} évaluations)</span>
                </div>

                {/* Description */}
                {vendor.description && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{vendor.description}</p>
                )}

                {/* Informations publiques uniquement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {vendor.adresseBoutique && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{vendor.adresseBoutique}</span>
                    </div>
                  )}
                  
                  {/* Biographie du vendeur */}
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-gray-700 font-medium">À propos</span>
                      <p className="text-gray-600 text-sm mt-1">
                        {vendor.biographie || vendor.description || 'Artisan passionné par la création de pièces uniques.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spécialités */}
                {vendor.specialites && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Spécialités</h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialites.split(',').map((spec, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section produits */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits de {vendor.nomBoutique}</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit disponible</h3>
              <p className="text-gray-600">Ce vendeur n'a pas encore publié de produits.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                    <img
                      src={product.imageUrl ? `${API_CONFIG.BASE_URL}${product.imageUrl}` : 'https://via.placeholder.com/300x300?text=Produit'}
                      alt={product.nom}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.nom}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        {product.prix ? `${product.prix.toLocaleString()} F CFA` : 'Prix sur demande'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.noteMoyenne ? Number(product.noteMoyenne).toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                    {product.stock > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          En stock ({product.stock})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Number(vendor.rating || 0).toFixed(1)}</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{vendor.nombreEvaluations || 0}</p>
                <p className="text-sm text-gray-600">Évaluations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">✓</p>
                <p className="text-sm text-gray-600">Vendeur vérifié</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;