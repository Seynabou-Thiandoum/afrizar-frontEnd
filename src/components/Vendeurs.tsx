import React, { useState } from 'react';
import { Star, MapPin, Package, Users, Heart, Search, Filter, Grid, List, Award, ShoppingBag } from 'lucide-react';

const VendeursPage = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Données des vendeurs avec plus de détails
  const vendors = [
    {
      id: 1,
      name: "Atelier Fatou",
      specialty: "Boubous Femmes",
      description: "Spécialiste des tenues traditionnelles féminines avec broderies artisanales",
      image: "https://images.unsplash.com/photo-1494790108755-2616c64c6e1e?w=300&h=300&fit=crop",
      location: "Dakar, Plateau",
      rating: 4.9,
      reviews: 127,
      products: 45,
      yearsExperience: 8,
      specialties: ["Boubous", "Robes", "Broderie"],
      priceRange: "25,000 - 85,000 FCFA",
      isVerified: true,
      sales: 234
    },
    {
      id: 2,
      name: "Maison Moussa",
      specialty: "Costumes Hommes",
      description: "Création de costumes traditionnels et modernes pour hommes",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      location: "Thiès Centre",
      rating: 4.8,
      reviews: 89,
      products: 62,
      yearsExperience: 12,
      specialties: ["Grands Boubous", "Costumes", "Chemises"],
      priceRange: "35,000 - 120,000 FCFA",
      isVerified: true,
      sales: 189
    },
    {
      id: 3,
      name: "Bijoux Aminata",
      specialty: "Bijoux & Accessoires",
      description: "Créatrice de bijoux traditionnels en or et argent",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      location: "Saint-Louis",
      rating: 4.7,
      reviews: 156,
      products: 78,
      yearsExperience: 6,
      specialties: ["Bijoux", "Sacs", "Accessoires"],
      priceRange: "8,000 - 45,000 FCFA",
      isVerified: true,
      sales: 312
    },
    {
      id: 4,
      name: "Couture Khadija",
      specialty: "Mode Enfant",
      description: "Vêtements colorés et confortables pour enfants",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop",
      location: "Kaolack",
      rating: 4.6,
      reviews: 73,
      products: 34,
      yearsExperience: 4,
      specialties: ["Enfants", "Bébés", "Accessoires"],
      priceRange: "12,000 - 35,000 FCFA",
      isVerified: false,
      sales: 98
    },
    {
      id: 5,
      name: "Atelier Babacar",
      specialty: "Maroquinerie",
      description: "Sacs et accessoires en cuir fait main",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      location: "Ziguinchor",
      rating: 4.5,
      reviews: 45,
      products: 28,
      yearsExperience: 7,
      specialties: ["Sacs", "Ceintures", "Chaussures"],
      priceRange: "15,000 - 65,000 FCFA",
      isVerified: true,
      sales: 67
    },
    {
      id: 6,
      name: "Créations Rama",
      specialty: "Wax Moderne",
      description: "Designs modernes avec tissus wax authentiques",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
      location: "Dakar, Almadies",
      rating: 4.8,
      reviews: 92,
      products: 51,
      yearsExperience: 5,
      specialties: ["Wax", "Robes", "Ensembles"],
      priceRange: "20,000 - 75,000 FCFA",
      isVerified: true,
      sales: 145
    }
  ];

  const specialties = ["all", "Boubous", "Bijoux", "Sacs", "Enfants", "Wax", "Costumes"];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            vendor.specialties.some(spec => spec.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    
    return matchesSearch && matchesSpecialty;
  });

  const handleVendorClick = (vendorId) => {
    if (onNavigate) {
      onNavigate('vendor-profile', { id: vendorId });
    }
  };

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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
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
                <p className="text-2xl font-bold text-gray-900">500+</p>
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
                <p className="text-2xl font-bold text-gray-900">4.8</p>
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
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-600">Commandes livrées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des vendeurs */}
        <div className="mb-4">
          <p className="text-gray-600">{filteredVendors.length} vendeur(s) trouvé(s)</p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-orange-100"
                  />
                  {vendor.isVerified && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{vendor.name}</h3>
                  <p className="text-orange-600 font-semibold mb-2">{vendor.specialty}</p>
                  <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
                  
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{vendor.location}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{vendor.rating}</span>
                      <span className="text-gray-500 ml-1">({vendor.reviews})</span>
                    </div>
                    <div className="text-gray-600">{vendor.products} produits</div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Prix: </span>{vendor.priceRange}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialties.slice(0, 3).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
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
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-orange-100"
                    />
                    {vendor.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Award className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                          {vendor.name}
                        </h3>
                        <p className="text-orange-600 font-semibold mb-2">{vendor.specialty}</p>
                        <p className="text-gray-600 mb-3">{vendor.description}</p>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{vendor.location}</span>
                          <span className="mx-2">•</span>
                          <span className="text-sm">{vendor.yearsExperience} ans d'expérience</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-semibold">{vendor.rating}</span>
                          <span className="text-gray-500 ml-1 text-sm">({vendor.reviews})</span>
                        </div>
                        <p className="text-sm text-gray-600">{vendor.products} produits</p>
                        <p className="text-sm text-gray-600">{vendor.sales} ventes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-2">
                        {vendor.specialties.slice(0, 4).map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                          >
                            {spec}
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

        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun vendeur trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeursPage;