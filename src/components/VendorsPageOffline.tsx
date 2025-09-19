import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, MapPin, Phone, Mail, Heart, MessageCircle } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

interface VendorsPageOfflineProps {
  onBack: () => void;
}

const VendorsPageOffline: React.FC<VendorsPageOfflineProps> = ({ onBack }) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Données de démonstration
  const mockVendors = [
    {
      id: 1,
      prenom: 'Aïcha',
      nom: 'Diop',
      nomBoutique: 'Boutique Aïcha',
      email: 'aicha@example.com',
      telephone: '+221 77 123 45 67',
      ville: 'Dakar',
      specialites: ['Tenues Femmes', 'Accessoires'],
      rating: 4.8,
      nombreAvis: 127,
      isVerified: true,
      isFeatured: true,
      description: 'Spécialiste des tenues traditionnelles sénégalaises'
    },
    {
      id: 2,
      prenom: 'Moussa',
      nom: 'Ndiaye',
      nomBoutique: 'Atelier Moussa',
      email: 'moussa@example.com',
      telephone: '+221 78 987 65 43',
      ville: 'Thiès',
      specialites: ['Tenues Hommes', 'Sur Mesure'],
      rating: 4.6,
      nombreAvis: 89,
      isVerified: true,
      isFeatured: false,
      description: 'Maître tailleur avec plus de 20 ans d\'expérience'
    },
    {
      id: 3,
      prenom: 'Fatou',
      nom: 'Sall',
      nomBoutique: 'Créations Fatou',
      email: 'fatou@example.com',
      telephone: '+221 76 555 44 33',
      ville: 'Saint-Louis',
      specialites: ['Tenues Femmes', 'Bijoux'],
      rating: 4.9,
      nombreAvis: 156,
      isVerified: true,
      isFeatured: true,
      description: 'Créatrice de bijoux et tenues contemporaines'
    }
  ];

  const specialties = ['all', 'Tenues Femmes', 'Tenues Hommes', 'Accessoires', 'Bijoux', 'Sur Mesure'];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = !searchTerm || 
      vendor.nomBoutique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
      vendor.specialites.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const handleContactVendor = (vendor: any) => {
    console.log('Contact du vendeur:', vendor);
    // Ici on pourrait ouvrir un modal de contact
  };

  const handleToggleFavorite = (vendorId: number) => {
    console.log('Ajout aux favoris:', vendorId);
    // Ici on pourrait gérer les favoris
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                Nos Vendeurs Artisans
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Mode Hors Ligne
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et Recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un vendeur, une boutique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filtre par spécialité */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">Toutes les spécialités</option>
                  {specialties.slice(1).map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Vendeurs Vedettes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendeurs Vedettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVendors.filter(v => v.isFeatured).map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.nomBoutique}</h3>
                      <p className="text-gray-600">{vendor.prenom} {vendor.nom}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(vendor.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{vendor.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                      <span className="text-sm text-gray-500">({vendor.nombreAvis} avis)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{vendor.ville}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.specialites.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {vendor.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContactVendor(vendor)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Contacter</span>
                    </button>
                    <button
                      onClick={() => console.log('Voir boutique:', vendor.id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voir Boutique
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tous les Vendeurs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tous les Vendeurs</h2>
            <span className="text-gray-600">{filteredVendors.length} vendeur(s) trouvé(s)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.nomBoutique}</h3>
                      <p className="text-gray-600">{vendor.prenom} {vendor.nom}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(vendor.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{vendor.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                      <span className="text-sm text-gray-500">({vendor.nombreAvis} avis)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{vendor.ville}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.specialites.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {vendor.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContactVendor(vendor)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Contacter</span>
                    </button>
                    <button
                      onClick={() => console.log('Voir boutique:', vendor.id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voir Boutique
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message d'information */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">ℹ</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900">Mode Hors Ligne</h3>
              <p className="text-blue-700 mt-1">
                Vous consultez actuellement une version de démonstration avec des données fictives. 
                Pour accéder aux vraies données, veuillez démarrer votre backend Spring Boot sur le port 8080.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.href = '#api-test'}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tester la connexion API →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsPageOffline;
