import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Star, 
  MapPin, 
  Package, 
  Clock, 
  Award,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Search,
  Filter,
  Grid3X3,
  List,
  Crown,
  Building,
  Truck,
  Heart,
  ShoppingCart,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import VendorDetailModal from './VendorDetailModal';
import { useVendors, useFeaturedVendors, useVendorManagement, useVendorErrorHandler } from '../hooks/useVendors';
import { VendeurDto, VendeurFilters } from '../types/vendor';

const VendorsPage = ({ onBack }) => {
  const [selectedVendor, setSelectedVendor] = useState<VendeurDto | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  
  // Hooks pour la gestion des vendeurs
  const { error, handleError, clearError } = useVendorErrorHandler();
  const featuredVendorsQuery = useFeaturedVendors();
  const vendorManagement = useVendorManagement();
  
  // État local pour les filtres
  const [filters, setFilters] = useState<VendeurFilters>({});

  // Effet pour mettre à jour les filtres quand la recherche change
  useEffect(() => {
    const newFilters: VendeurFilters = {};
    
    if (searchTerm) {
      // Pour l'instant, on utilise la recherche simple
      // Dans une version plus avancée, on pourrait utiliser searchVendorsAdvanced
    }
    
    if (selectedSpecialty !== 'all') {
      newFilters.specialites = [selectedSpecialty];
    }
    
    setFilters(newFilters);
    vendorManagement.handleSearch(newFilters);
  }, [searchTerm, selectedSpecialty]); // Supprimé vendorManagement des dépendances

  // Gestion des erreurs
  useEffect(() => {
    if (vendorManagement.error) {
      handleError(vendorManagement.error);
    }
    if (featuredVendorsQuery.error) {
      handleError(featuredVendorsQuery.error);
    }
  }, [vendorManagement.error, featuredVendorsQuery.error, handleError]);

  const specialties = [
    'all',
    'Boubous femmes',
    'Boubous hommes',
    'Bijoux contemporains',
    'Maroquinerie',
    'Caftans luxe',
    'Chaussures traditionnelles'
  ];

  // Utiliser les données du backend
  const allVendors = vendorManagement.vendors?.content || [];
  const featuredVendors = featuredVendorsQuery.data || [];
  
  // Filtrer les vendeurs localement si nécessaire (pour la recherche par terme)
  const filteredVendors = allVendors.filter(vendor => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      vendor.nomBoutique.toLowerCase().includes(searchLower) ||
      `${vendor.nom} ${vendor.prenom}`.toLowerCase().includes(searchLower) ||
      vendor.description?.toLowerCase().includes(searchLower) ||
      vendor.specialites?.some(spec => spec.toLowerCase().includes(searchLower))
    );
  });

  const handleContactVendor = (vendor: VendeurDto, method: string) => {
    if (method === 'whatsapp') {
      const message = `Bonjour ${vendor.prenom} ${vendor.nom}, je suis intéressé(e) par vos créations de ${vendor.nomBoutique}.`;
      const phoneNumber = vendor.telephone?.replace(/[^0-9]/g, '') || '';
      if (phoneNumber) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    } else if (method === 'email') {
      window.location.href = `mailto:${vendor.email}?subject=Demande d'information - ${vendor.nomBoutique}`;
    } else if (method === 'phone' && vendor.telephone) {
      window.location.href = `tel:${vendor.telephone}`;
    }
  };

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nos Vendeurs</h1>
              <p className="text-gray-600 mt-1">
                Découvrez nos artisans partenaires • {vendorManagement.isLoading ? '...' : filteredVendors.length} ateliers
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un vendeur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
              
              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Toutes spécialités</option>
                {specialties.slice(1).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Vendors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendeurs Vedettes</h2>
          
          {featuredVendorsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Chargement des vendeurs vedettes...</span>
            </div>
          ) : featuredVendorsQuery.isError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600">Erreur lors du chargement des vendeurs vedettes</p>
              <button
                onClick={() => featuredVendorsQuery.refetch()}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vendor.imageCouverture || vendor.imageProfil || 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={vendor.nomBoutique}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Featured Badge */}
                  {vendor.vedette && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Crown className="h-3 w-3" />
                      <span>Vedette</span>
                    </div>
                  )}

                  {/* Verified Badge */}
                  {vendor.verifie && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                      <Award className="h-4 w-4" />
                    </div>
                  )}

                  {/* Vendor Avatar */}
                  <div className="absolute bottom-4 left-4">
                    <img
                      src={vendor.imageProfil || 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500'}
                      alt={`${vendor.prenom} ${vendor.nom}`}
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {vendor.nomBoutique}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-xs text-gray-500">({vendor.nombreEvaluations || 0})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description || 'Aucune description disponible'}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.ville || 'Non spécifié'}, {vendor.pays || 'Sénégal'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{vendor.nombreProduits || 0} produits</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.specialites?.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {specialty}
                      </span>
                    ))}
                    {vendor.specialites && vendor.specialites.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{vendor.specialites.length - 2}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVendor(vendor);
                    }}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Voir l'atelier
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* All Vendors */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tous nos Vendeurs</h2>
          
          {vendorManagement.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Chargement des vendeurs...</span>
            </div>
          ) : vendorManagement.isError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600">Erreur lors du chargement des vendeurs</p>
              <button
                onClick={() => vendorManagement.refetch()}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun vendeur trouvé</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-2">
                  Essayez de modifier vos critères de recherche
                </p>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img
                    src={vendor.imageProfil || 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500'}
                    alt={vendor.nomBoutique}
                    className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                      viewMode === 'list' ? 'w-full h-48' : 'w-full h-48'
                    }`}
                  />
                  
                  {/* Verified Badge */}
                  {vendor.verifie && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                      <Award className="h-4 w-4" />
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactVendor(vendor, 'whatsapp');
                      }}
                      className="p-2 bg-green-600 rounded-full text-white hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVendor(vendor);
                      }}
                      className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactVendor(vendor, 'phone');
                      }}
                      className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {vendor.nomBoutique}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{vendor.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-xs text-gray-500">({vendor.nombreEvaluations || 0})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">Par {vendor.prenom} {vendor.nom}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{vendor.ville || 'Non spécifié'}, {vendor.pays || 'Sénégal'}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{vendor.nombreProduits || 0} produits</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{vendor.delaiLivraison || 'Non spécifié'}</span>
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description || 'Aucune description disponible'}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.specialites?.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactVendor(vendor, 'whatsapp');
                      }}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVendor(vendor);
                      }}
                      className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Voir l'atelier
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
          
          {/* Pagination */}
          {vendorManagement.vendors && vendorManagement.vendors.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => vendorManagement.handlePageChange(vendorManagement.currentPage - 1)}
                disabled={vendorManagement.currentPage === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, vendorManagement.vendors.totalPages) }, (_, i) => {
                  const page = i;
                  return (
                    <button
                      key={page}
                      onClick={() => vendorManagement.handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        vendorManagement.currentPage === page
                          ? 'bg-orange-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => vendorManagement.handlePageChange(vendorManagement.currentPage + 1)}
                disabled={vendorManagement.currentPage >= vendorManagement.vendors.totalPages - 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onContact={handleContactVendor}
        />
      )}
    </div>
  );
};

export default VendorsPage;