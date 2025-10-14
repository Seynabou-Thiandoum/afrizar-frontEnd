import { useState, useEffect } from 'react';
import { Star, MapPin, Package, Users, Search, Filter, Grid, List, Award, ShoppingBag } from 'lucide-react';
import publicVendeurService, { PublicVendeur } from '../services/publicVendeurService';
import { API_CONFIG } from '../config/api';
import VendorProfilePage from './VendorProfilePage';

// Helper pour construire l'URL complète de l'image (temporairement commenté pour debug)
// const getImageUrl = (photoUrl: string | undefined): string | undefined => {
//   if (!photoUrl) return undefined;
//   if (photoUrl.startsWith('http')) return photoUrl;
//   return `${API_CONFIG.BASE_URL}${photoUrl}`;
// };

interface VendeursPageProps {
  onNavigate?: (page: string, data?: any) => void;
}

const VendeursPage = ({ onNavigate }: VendeursPageProps) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [vendors, setVendors] = useState<PublicVendeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicVendeurService.getPublishedVendeurs();
      setVendors(data);
    } catch (err) {
      setError('Erreur lors du chargement des vendeurs');
      console.error('Erreur chargement vendeurs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extraire toutes les spécialités uniques des vendeurs
  const getAllSpecialties = () => {
    const specialtiesSet = new Set<string>();
    vendors.forEach(vendor => {
      if (vendor.specialites) {
        vendor.specialites.split(',').forEach(spec => {
          specialtiesSet.add(spec.trim());
        });
      }
    });
    return Array.from(specialtiesSet);
  };

  const specialties = ["all", ...getAllSpecialties()];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.nomBoutique.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.nom + ' ' + vendor.prenom).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.adresseBoutique || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            (vendor.specialites && vendor.specialites.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    
    return matchesSearch && matchesSpecialty;
  });

  const handleVendorClick = (vendorId: number) => {
    setSelectedVendorId(vendorId);
  };

  const handleBackToList = () => {
    setSelectedVendorId(null);
  };

  // Si un vendeur est sélectionné, afficher sa page de profil
  if (selectedVendorId) {
    return (
      <VendorProfilePage
        vendorId={selectedVendorId}
        onBack={handleBackToList}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Nos Vendeurs</h1>
              <p className="text-gray-600">Découvrez nos artisans talentueux et leurs créations uniques</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres et Recherche */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un vendeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Toutes spécialités</option>
                {specialties.slice(1).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              
              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Plus de filtres</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Statistiques */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                    <p className="text-sm text-gray-600">Vendeurs actifs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-600">Produits disponibles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {vendors.length > 0 
                        ? (vendors.reduce((acc, v) => acc + Number(v.rating || 0), 0) / vendors.length).toFixed(1)
                        : '-'
                      }
                    </p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {vendors.reduce((acc, v) => acc + (v.nombreEvaluations || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Évaluations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des vendeurs */}
            <div className="mb-4">
              <p className="text-gray-600">{filteredVendors.length} vendeur(s) trouvé(s)</p>
            </div>
          </>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
              >
                <div className="relative mb-4">
                  {/* Forcer l'affichage de l'image connue pour debug */}
                  <img
                    src="http://localhost:8080/api/files/2decb2a5-f52a-4b75-875f-718e7e45be44.png"
                    alt={vendor.nomBoutique}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-orange-100"
                    onLoad={() => {
                      console.log('✅ Image forcée chargée dans la liste des vendeurs');
                    }}
                    onError={() => {
                      console.error('❌ Erreur même avec l\'image forcée dans la liste');
                    }}
                  />
                  {vendor.verifie && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{vendor.nomBoutique}</h3>
                  <p className="text-orange-600 font-semibold mb-2">{vendor.prenom} {vendor.nom}</p>
                  {vendor.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vendor.description}</p>
                  )}
                  
                  {vendor.adresseBoutique && (
                    <div className="flex items-center justify-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{vendor.adresseBoutique}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-center text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{Number(vendor.rating || 0).toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({vendor.nombreEvaluations || 0})</span>
                    </div>
                  </div>
                  
                  {vendor.specialites && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {vendor.specialites.split(',').slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
                  Voir la boutique
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group"
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    {/* Forcer l'affichage de l'image connue pour debug - Vue liste */}
                    <img
                      src="http://localhost:8080/api/files/2decb2a5-f52a-4b75-875f-718e7e45be44.png"
                      alt={vendor.nomBoutique}
                      className="w-16 h-16 rounded-full object-cover border-3 border-orange-100"
                      onLoad={() => {
                        console.log('✅ Image forcée chargée dans la vue liste des vendeurs');
                      }}
                      onError={() => {
                        console.error('❌ Erreur même avec l\'image forcée dans la vue liste');
                      }}
                    />
                    {vendor.verifie && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Award className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                          {vendor.nomBoutique}
                        </h3>
                        <p className="text-orange-600 font-semibold mb-2">{vendor.prenom} {vendor.nom}</p>
                        {vendor.description && (
                          <p className="text-gray-600 mb-3">{vendor.description}</p>
                        )}
                        
                        {vendor.adresseBoutique && (
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{vendor.adresseBoutique}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-semibold">{Number(vendor.rating || 0).toFixed(1)}</span>
                          <span className="text-gray-500 ml-1 text-sm">({vendor.nombreEvaluations || 0})</span>
                        </div>
                        {vendor.verifie && (
                          <p className="text-sm text-green-600 font-medium">✓ Vérifié</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-2">
                        {vendor.specialites && vendor.specialites.split(',').slice(0, 4).map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                          >
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                      
                      <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
                        Voir la boutique
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun vendeur trouvé</h3>
            <p className="text-gray-600">
              {vendors.length === 0 
                ? "Aucun vendeur n'est encore publié sur la plateforme"
                : "Essayez de modifier vos critères de recherche"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeursPage;