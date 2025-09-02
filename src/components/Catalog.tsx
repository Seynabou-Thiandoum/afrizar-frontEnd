import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  Star, 
  Heart, 
  Eye, 
  ShoppingCart,
  MapPin,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';
import ProductModal from './ProductModal';

const Catalog = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      originalPrice: 55000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.8,
      reviews: 24,
      status: 'En stock',
      availability: 'in-stock',
      category: 'Tenues Femmes',
      quality: 'premium',
      description: 'Magnifique grand boubou avec broderies dorées fait main. Tissu wax premium importé de Côte d\'Ivoire.',
      colors: ['#FF6B35', '#004E89', '#F7C52D'],
      sizes: ['S', 'M', 'L', 'XL'],
      vendor: 'Atelier Fatou',
      delivery: '3-5 jours',
      location: 'Dakar, Sénégal',
      weight: 0.8
    },
    {
      id: 2,
      name: 'Ensemble Bazin Riche',
      price: 35000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.9,
      reviews: 18,
      status: 'Sur commande - 7 jours',
      availability: 'on-order',
      category: 'Tenues Femmes',
      quality: 'standard',
      description: 'Ensemble deux pièces en bazin riche avec motifs géométriques traditionnels.',
      colors: ['#8B5A2B', '#2E8B57', '#B22222'],
      sizes: ['S', 'M', 'L'],
      vendor: 'Couture Aminata',
      delivery: '7-10 jours',
      location: 'Thiès, Sénégal',
      weight: 0.6
    },
    {
      id: 3,
      name: 'Collier Perles Traditionnelles',
      price: 12000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.7,
      reviews: 32,
      status: 'En stock',
      availability: 'in-stock',
      category: 'Accessoires',
      quality: 'standard',
      description: 'Collier artisanal en perles de verre colorées selon la tradition sénégalaise.',
      colors: ['#FF4500', '#32CD32', '#4169E1'],
      sizes: ['Unique'],
      vendor: 'Bijoux Khadija',
      delivery: '2-3 jours',
      location: 'Saint-Louis, Sénégal',
      weight: 0.1
    },
    {
      id: 4,
      name: 'Kaftan Homme Deluxe',
      price: 38000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.6,
      reviews: 15,
      status: 'En stock',
      availability: 'in-stock',
      category: 'Tenues Hommes',
      quality: 'premium',
      description: 'Kaftan élégant pour homme avec broderies sophistiquées et finitions premium.',
      colors: ['#8B4513', '#000080', '#228B22'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      vendor: 'Maître Ibrahima',
      delivery: '3-5 jours',
      location: 'Kaolack, Sénégal',
      weight: 0.7
    },
    {
      id: 5,
      name: 'Sac à Main Cuir Artisanal',
      price: 25000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.5,
      reviews: 28,
      status: 'Stock limité',
      availability: 'limited',
      category: 'Accessoires',
      quality: 'premium',
      description: 'Sac à main en cuir véritable avec motifs traditionnels gravés à la main.',
      colors: ['#8B4513', '#000000', '#800000'],
      sizes: ['Unique'],
      vendor: 'Maroquinerie Salam',
      delivery: '3-5 jours',
      location: 'Mbour, Sénégal',
      weight: 0.5
    },
    {
      id: 6,
      name: 'Robe Wax Moderne',
      price: 22000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.4,
      reviews: 21,
      status: 'En stock',
      availability: 'in-stock',
      category: 'Tenues Femmes',
      quality: 'standard',
      description: 'Robe moderne en tissu wax avec coupe contemporaine et finitions soignées.',
      colors: ['#FF6B35', '#4169E1', '#32CD32'],
      sizes: ['XS', 'S', 'M', 'L'],
      vendor: 'Atelier Moderne',
      delivery: '2-4 jours',
      location: 'Dakar, Sénégal',
      weight: 0.4
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Tenues Femmes', label: 'Tenues Femmes' },
    { value: 'Tenues Hommes', label: 'Tenues Hommes' },
    { value: 'Accessoires', label: 'Accessoires' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'Toutes disponibilités' },
    { value: 'in-stock', label: 'En stock' },
    { value: 'on-order', label: 'Sur commande' },
    { value: 'limited', label: 'Stock limité' }
  ];

  const qualityOptions = [
    { value: 'all', label: 'Toutes qualités' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Produits vedettes' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'newest', label: 'Plus récents' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesAvailability = selectedAvailability === 'all' || product.availability === selectedAvailability;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesQuality = selectedQuality === 'all' || product.quality === selectedQuality;

      return matchesSearch && matchesCategory && matchesAvailability && matchesPrice && matchesQuality;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedAvailability, priceRange, selectedQuality, sortBy]);

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catalogue</h1>
              <p className="text-gray-600 mt-1">{filteredProducts.length} produits disponibles</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
              
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
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Disponibilité</label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  >
                    {availabilityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Quality Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Qualité</label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  >
                    {qualityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Gamme de prix: {formatPrice(priceRange[0], 'FCFA')} - {formatPrice(priceRange[1], 'FCFA')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-orange-600"
                  />
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedAvailability('all');
                    setPriceRange([0, 100000]);
                    setSelectedQuality('all');
                    setSortBy('featured');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filtres</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Trier par:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                        }`}
                      />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                        product.availability === 'in-stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.availability === 'limited'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.status}
                      </div>

                      {/* Discount Badge */}
                      {product.originalPrice && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-2 rounded-full transition-colors ${
                            wishlist.has(product.id) 
                              ? 'bg-red-600 text-white' 
                              : 'bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-orange-600 hover:text-white transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                          {product.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.vendor}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Livraison: {product.delivery}</span>
                      </div>

                      {viewMode === 'list' && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice, product.currency)}
                            </span>
                          )}
                        </div>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Catalog;