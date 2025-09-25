import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, Star, ShoppingBag, Eye, Plus, ArrowLeft, MessageCircle, TrendingUp, Flame, Award } from 'lucide-react';

const TendancesPage = ({ products = [], type = 'all', onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Numéro WhatsApp
  const whatsappNumber = "221123456789";

  // Filtrer et organiser les produits tendances
  const allProducts = products.length > 0 ? products : [
    // Données de fallback si pas de produits transmis
    {
      id: 1,
      name: "Boubou Grand Modèle",
      price: "65,000 FCFA",
      originalPrice: "80,000 FCFA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      category: "Boubous",
      subcategory: "homme",
      rating: 4.8,
      reviews: 34,
      discount: "-19%",
      sizes: ["L", "XL", "XXL"],
      colors: ["Blanc", "Bleu", "Beige"],
      description: "Boubou traditionnel brodé main avec finitions de qualité supérieure."
    }
  ];

  // Catégories dynamiques basées sur les produits
  const categories = [
    { id: 'all', name: 'Tous', count: allProducts.length },
    { id: 'homme', name: 'Homme', count: allProducts.filter(p => p.subcategory === 'homme').length },
    { id: 'femme', name: 'Femme', count: allProducts.filter(p => p.subcategory === 'femme').length },
    { id: 'enfant', name: 'Enfant', count: allProducts.filter(p => p.subcategory === 'enfant').length }
  ].filter(cat => cat.count > 0);

  // Types uniques des produits
  const availableTypes = [...new Set(allProducts.map(p => p.category))];

  // Filtrage des produits
  const filteredProducts = allProducts.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.subcategory === selectedCategory;
    const matchesType = selectedType === 'all' || item.category === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      switch(priceRange) {
        case 'low': matchesPrice = price < 35000; break;
        case 'medium': matchesPrice = price >= 35000 && price < 60000; break;
        case 'high': matchesPrice = price >= 60000; break;
      }
    }
    
    return matchesCategory && matchesType && matchesSearch && matchesPrice;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case 'price-high': return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      case 'name': return a.name.localeCompare(b.name);
      default: return b.rating - a.rating;
    }
  });

  // Statistiques des tendances
  const stats = {
    avgRating: (allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1),
    totalReviews: allProducts.reduce((sum, p) => sum + p.reviews, 0),
    topRated: Math.max(...allProducts.map(p => p.rating)),
    mostReviewed: Math.max(...allProducts.map(p => p.reviews))
  };

  const handleWhatsAppOrder = (e, item) => {
    e.stopPropagation();
    const message = `Bonjour ! Je suis intéressé(e) par cet article TENDANCE :\n\n🔥 ${item.name}\n💰 Prix: ${item.price}\n⭐ Note: ${item.rating}/5 (${item.reviews} avis)\n📋 Catégorie: ${item.category}\n\nPouvez-vous me donner plus d'informations ?\n\nMerci !`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleProductClick = (productId) => {
    const product = allProducts.find(item => item.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlistItems);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlistItems(newWishlist);
  };

  const getColorStyle = (color) => {
    const colorMap = {
      'Multicolore': '#ff6b35',
      'Wax multicolore': '#ff6b35',
      'Or': '#ffd700',
      'Argent': '#c0c0c0',
      'Marine': '#1e3a8a',
      'Bordeaux': '#7f1d1d',
      'Blanc': '#ffffff',
      'Noir': '#000000',
      'Rouge': '#dc2626',
      'Bleu': '#2563eb',
      'Bleu clair': '#60a5fa',
      'Vert': '#16a34a',
      'Rose': '#ec4899',
      'Violet': '#7c3aed',
      'Lilas': '#c084fc',
      'Beige': '#d4a574',
      'Kaki': '#8b7c47',
      'Gris': '#6b7280'
    };
    return colorMap[color] || '#6b7280';
  };

  // Composant pour les détails du produit
  const ProductDetails = ({ product, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            </div>
            <div></div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div>
                <div className="mb-4 relative">
                  <img
                    src={product.gallery?.[selectedImageIndex] || product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {/* Badge Tendance */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🔥 TENDANCE
                    </span>
                  </div>
                </div>
                {product.gallery && product.gallery.length > 1 && (
                  <div className="flex space-x-2">
                    {product.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? 'border-orange-500' : 'border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Détails */}
              <div>
                <div className="mb-4">
                  <span className="text-sm text-orange-600 font-semibold">{product.category}</span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews} avis)</span>
                  </div>
                  {product.rating >= 4.8 && (
                    <span className="ml-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Top Rated
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                          {product.discount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div className="mb-6">
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                )}

                {/* Couleurs */}
                {product.colors && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Couleur</h3>
                    <div className="flex space-x-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedColor === color
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tailles */}
                {product.sizes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Taille</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleWishlistClick({stopPropagation: () => {}}, product.id)}
                    className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${wishlistItems.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={(e) => handleWhatsAppOrder(e, product)}
                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Commander sur WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Si un produit est sélectionné, afficher ses détails
  if (selectedProduct) {
    return <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header avec navigation retour */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate && onNavigate('back')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-full p-3">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Tendances</h1>
              <p className="text-gray-600">Les articles les plus populaires du moment</p>
            </div>
          </div>

          {/* Statistiques des tendances */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-xl font-bold text-gray-900">{stats.avgRating}/5</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Total avis</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalReviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Meilleure note</p>
                  <p className="text-xl font-bold text-gray-900">{stats.topRated}/5</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Articles</p>
                  <p className="text-xl font-bold text-gray-900">{allProducts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtres */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              
              {/* Recherche */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom, catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Catégories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedType('all');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-sm text-gray-500">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Types */}
              {availableTypes.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Types</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedType === 'all' 
                          ? 'bg-orange-500 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Tous les types
                    </button>
                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedType === type 
                            ? 'bg-orange-500 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prix */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prix</h3>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tous les prix</option>
                  <option value="low">Moins de 35,000 FCFA</option>
                  <option value="medium">35,000 - 60,000 FCFA</option>
                  <option value="high">Plus de 60,000 FCFA</option>
                </select>
              </div>

            </div>
          </div>

          {/* Contenu Principal */}
          <div className="lg:w-3/4">
            
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  <span className="font-semibold">{sortedProducts.length}</span> article(s) tendance(s)
                  {selectedCategory !== 'all' && <span> dans <span className="text-orange-600 font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span></span>}
                  {selectedType !== 'all' && <span> - <span className="text-orange-600 font-medium">{selectedType}</span></span>}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="rating">Mieux notés</option>
                  <option value="reviews">Plus populaires</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
                
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

            {/* Grille Produits */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group relative"
                  >
                    {/* Rang de tendance */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        #{index + 1} <Flame className="h-3 w-3 ml-1" />
                      </span>
                    </div>

                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {item.discount && (
                        <span className="absolute top-12 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {item.discount}
                        </span>
                      )}
                      
                      <button 
                        onClick={(e) => handleWishlistClick(e, item.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${
                          wishlistItems.has(item.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600 hover:text-red-500'
                        }`} />
                      </button>
                      
                      <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(item.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-orange-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={(e) => handleWhatsAppOrder(e, item)}
                          className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-xs text-orange-600 font-semibold mb-1">{item.category}</div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{item.rating} ({item.reviews} avis)</span>
                        </div>
                        {item.rating >= 4.8 && (
                          <Award className="h-3 w-3 text-yellow-500 ml-2" title="Top Rated" />
                        )}
                      </div>

                      {/* Barre de popularité */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((item.reviews / stats.mostReviewed) * 100, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                          )}
                        </div>
                        
                        {item.colors && (
                          <div className="flex space-x-1">
                            {item.colors.slice(0, 3).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-3 h-3 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: getColorStyle(color) }}
                                title={color}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ))}
                            {item.colors.length > 3 && (
                              <div 
                                className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                onClick={(e) => e.stopPropagation()}
                                title={`+${item.colors.length - 3} couleurs`}
                              >
                                <Plus className="h-2 w-2 text-gray-500" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vue Liste */
              <div className="space-y-4">
                {sortedProducts.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group relative"
                  >
                    {/* Badge rang */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-32 h-40 object-cover rounded-lg"
                        />
                        {item.discount && (
                          <span className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {item.discount}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm text-orange-600 font-semibold">{item.category}</span>
                              <Flame className="h-4 w-4 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                              {item.name}
                            </h3>
                            
                            {item.description && (
                              <p className="text-gray-600 mb-3">{item.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-6 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{item.rating} ({item.reviews} avis)</span>
                                {item.rating >= 4.8 && (
                                  <Award className="h-4 w-4 text-yellow-500 ml-2" title="Top Rated" />
                                )}
                              </div>

                              {/* Barre de popularité */}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Popularité:</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
                                    style={{ width: `${Math.min((item.reviews / stats.mostReviewed) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                              
                              {item.colors && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-600">Couleurs:</span>
                                  <div className="flex space-x-1">
                                    {item.colors.slice(0, 3).map((color, colorIndex) => (
                                      <span key={colorIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {color}
                                      </span>
                                    ))}
                                    {item.colors.length > 3 && <span className="text-xs text-gray-500">+{item.colors.length - 3}</span>}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                                {item.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through ml-3">{item.originalPrice}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={(e) => handleWishlistClick(e, item.id)}
                                  className="p-2 rounded-full border border-gray-300 hover:bg-red-50 transition-colors"
                                >
                                  <Heart className={`h-5 w-5 transition-colors ${
                                    wishlistItems.has(item.id) 
                                      ? 'text-red-500 fill-current' 
                                      : 'text-gray-600 hover:text-red-500'
                                  }`} />
                                </button>
                                
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(item.id);
                                  }}
                                  className="p-2 rounded-full border border-gray-300 hover:bg-orange-50 transition-colors"
                                >
                                  <Eye className="h-5 w-5 text-gray-600" />
                                </button>
                                
                                <button 
                                  onClick={(e) => handleWhatsAppOrder(e, item)}
                                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>Commander</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message si aucun résultat */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm p-12">
                  <Flame className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune tendance trouvée</h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche ou de filtrage.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedType('all');
                      setPriceRange('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Section Call-to-action */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4">
                <Flame className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Ne ratez pas ces tendances !</h2>
            <p className="text-lg mb-6 text-orange-100">
              Ces articles sont les plus demandés actuellement. Commandez maintenant avant qu'ils ne soient en rupture de stock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const topItem = sortedProducts[0];
                  if (topItem) handleWhatsAppOrder({stopPropagation: () => {}}, topItem);
                }}
                className="px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Commander le #1</span>
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('back')}
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
              >
                Continuer à explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TendancesPage;