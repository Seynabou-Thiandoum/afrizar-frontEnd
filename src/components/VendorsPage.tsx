import React, { useState } from 'react';
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
  ShoppingCart
} from 'lucide-react';
import VendorDetailModal from './VendorDetailModal';

const VendorsPage = ({ onBack }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const vendors = [
    {
      id: 1,
      name: 'Atelier Fatou',
      ownerName: 'Fatou Sall',
      description: 'Spécialisée dans la création de boubous traditionnels pour femmes avec broderies dorées et perles. Plus de 10 ans d\'expérience dans la couture sénégalaise.',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      reviews: 156,
      products: 24,
      orders: 342,
      location: 'Dakar, Sénégal',
      experience: '10 ans',
      specialties: ['Boubous femmes', 'Broderies dorées', 'Perles traditionnelles'],
      phone: '+221 77 123 45 67',
      email: 'fatou@atelierfatou.sn',
      website: 'www.atelierfatou.sn',
      joinDate: '2024-01-15',
      verified: true,
      featured: true,
      deliveryTime: '3-5 jours',
      priceRange: '25,000 - 85,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'Fatou a appris la couture auprès de sa grand-mère, maîtresse couturière reconnue à Dakar. Elle perpétue aujourd\'hui les techniques ancestrales tout en apportant une touche moderne à ses créations.',
      achievements: ['Meilleur Artisan 2024', 'Prix de l\'Innovation Traditionnelle', 'Certification Qualité Premium']
    },
    {
      id: 2,
      name: 'Maître Ibrahima',
      ownerName: 'Ibrahima Ndiaye',
      description: 'Atelier familial spécialisé dans les tenues masculines traditionnelles. Transmission du savoir-faire de père en fils depuis 3 générations.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      reviews: 134,
      products: 18,
      orders: 267,
      location: 'Kaolack, Sénégal',
      experience: '15 ans',
      specialties: ['Boubous hommes', 'Costumes traditionnels', 'Broderies masculines'],
      phone: '+221 78 234 56 78',
      email: 'ibrahima@maitre-couture.sn',
      website: '',
      joinDate: '2024-02-20',
      verified: true,
      featured: true,
      deliveryTime: '4-6 jours',
      priceRange: '30,000 - 75,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'L\'atelier Maître Ibrahima existe depuis 1980. Trois générations d\'artisans ont perfectionné l\'art du grand boubou masculin, créant des pièces d\'exception pour les grandes occasions.',
      achievements: ['Artisan Traditionnel Certifié', 'Fournisseur Officiel Présidence', '40 ans d\'Excellence']
    },
    {
      id: 3,
      name: 'Bijoux Khadija',
      ownerName: 'Khadija Diop',
      description: 'Création de bijoux contemporains inspirés des traditions sénégalaises. Utilisation de matériaux locaux et techniques modernes.',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/1927248/pexels-photo-1927248.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      reviews: 98,
      products: 45,
      orders: 189,
      location: 'Saint-Louis, Sénégal',
      experience: '7 ans',
      specialties: ['Bijoux contemporains', 'Matériaux locaux', 'Design moderne'],
      phone: '+221 76 345 67 89',
      email: 'khadija@bijouxmodernes.sn',
      website: 'www.bijouxmodernes.sn',
      joinDate: '2024-03-10',
      verified: true,
      featured: false,
      deliveryTime: '2-3 jours',
      priceRange: '5,000 - 35,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1927248/pexels-photo-1927248.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'Khadija combine tradition et modernité dans ses créations. Formée aux techniques ancestrales, elle innove en intégrant des matériaux contemporains pour créer des bijoux uniques.',
      achievements: ['Prix Jeune Créatrice 2023', 'Sélection Salon International', 'Mention Innovation Design']
    },
    {
      id: 4,
      name: 'Maroquinerie Salam',
      ownerName: 'Salam Ba',
      description: 'Maroquinerie artisanale de qualité supérieure. Sacs, chaussures et accessoires en cuir véritable avec finitions premium.',
      image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      reviews: 87,
      products: 32,
      orders: 156,
      location: 'Mbour, Sénégal',
      experience: '12 ans',
      specialties: ['Maroquinerie', 'Cuir véritable', 'Finitions premium'],
      phone: '+221 77 456 78 90',
      email: 'salam@maroquinerie-salam.sn',
      website: '',
      joinDate: '2024-04-05',
      verified: true,
      featured: false,
      deliveryTime: '3-5 jours',
      priceRange: '15,000 - 50,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'Salam a développé son expertise en maroquinerie en travaillant avec les meilleurs artisans du cuir. Son atelier produit des pièces durables alliant esthétique et fonctionnalité.',
      achievements: ['Certification Cuir Premium', 'Partenaire Export Europe', 'Label Qualité Artisanale']
    },
    {
      id: 5,
      name: 'Couture Royale',
      ownerName: 'Aminata Fall',
      description: 'Atelier de haute couture spécialisé dans les caftans et robes de luxe. Créations sur mesure pour occasions spéciales.',
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      reviews: 76,
      products: 15,
      orders: 123,
      location: 'Thiès, Sénégal',
      experience: '8 ans',
      specialties: ['Caftans luxe', 'Robes sur mesure', 'Occasions spéciales'],
      phone: '+221 78 567 89 01',
      email: 'aminata@couture-royale.sn',
      website: 'www.couture-royale.sn',
      joinDate: '2024-05-12',
      verified: true,
      featured: true,
      deliveryTime: '5-8 jours',
      priceRange: '40,000 - 120,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'Aminata s\'est formée dans les plus prestigieux ateliers de Dakar avant de créer Couture Royale. Elle se spécialise dans les pièces d\'exception pour mariages et cérémonies.',
      achievements: ['Couturière de l\'Année 2023', 'Créatrice Officielle Miss Sénégal', 'Prix Excellence Artisanale']
    },
    {
      id: 6,
      name: 'Cordonnerie Traditionnelle',
      ownerName: 'Moussa Diagne',
      description: 'Fabrication artisanale de chaussures traditionnelles. Babouches, sandales et chaussures en cuir selon les méthodes ancestrales.',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
      coverImage: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      reviews: 65,
      products: 28,
      orders: 145,
      location: 'Touba, Sénégal',
      experience: '20 ans',
      specialties: ['Babouches', 'Sandales cuir', 'Chaussures traditionnelles'],
      phone: '+221 77 678 90 12',
      email: 'moussa@cordonnerie-trad.sn',
      website: '',
      joinDate: '2024-06-18',
      verified: true,
      featured: false,
      deliveryTime: '4-7 jours',
      priceRange: '8,000 - 25,000 FCFA',
      gallery: [
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      story: 'Moussa perpétue l\'art de la cordonnerie traditionnelle appris de son père. Ses babouches sont réputées pour leur confort et leur durabilité exceptionnelle.',
      achievements: ['Maître Artisan Certifié', '20 ans d\'Expérience', 'Fournisseur Mosquées Officielles']
    }
  ];

  const specialties = [
    'all',
    'Boubous femmes',
    'Boubous hommes',
    'Bijoux contemporains',
    'Maroquinerie',
    'Caftans luxe',
    'Chaussures traditionnelles'
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            vendor.specialties.some(spec => spec.includes(selectedSpecialty));
    
    return matchesSearch && matchesSpecialty;
  });

  const handleContactVendor = (vendor, method) => {
    if (method === 'whatsapp') {
      const message = `Bonjour ${vendor.ownerName}, je suis intéressé(e) par vos créations de ${vendor.name}.`;
      const whatsappUrl = `https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else if (method === 'email') {
      window.location.href = `mailto:${vendor.email}?subject=Demande d'information - ${vendor.name}`;
    } else if (method === 'phone') {
      window.location.href = `tel:${vendor.phone}`;
    }
  };

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-gray-600 mt-1">Découvrez nos artisans partenaires • {filteredVendors.length} ateliers</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.filter(v => v.featured).map((vendor) => (
              <div
                key={vendor.id}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vendor.coverImage}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Vedette</span>
                  </div>

                  {/* Verified Badge */}
                  {vendor.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                      <Award className="h-4 w-4" />
                    </div>
                  )}

                  {/* Vendor Avatar */}
                  <div className="absolute bottom-4 left-4">
                    <img
                      src={vendor.image}
                      alt={vendor.ownerName}
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                      <span className="text-xs text-gray-500">({vendor.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{vendor.products} produits</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {specialty}
                      </span>
                    ))}
                    {vendor.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{vendor.specialties.length - 2}
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
        </div>

        {/* All Vendors */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tous nos Vendeurs</h2>
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
                    src={vendor.image}
                    alt={vendor.name}
                    className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                      viewMode === 'list' ? 'w-full h-48' : 'w-full h-48'
                    }`}
                  />
                  
                  {/* Verified Badge */}
                  {vendor.verified && (
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
                      {vendor.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{vendor.rating}</span>
                      <span className="text-xs text-gray-500">({vendor.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">Par {vendor.ownerName}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{vendor.location}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{vendor.products} produits</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{vendor.deliveryTime}</span>
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.specialties.slice(0, 2).map((specialty, index) => (
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