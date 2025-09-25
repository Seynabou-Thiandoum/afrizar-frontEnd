import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Package, 
  ShoppingBag, 
  Heart, 
  Eye, 
  Calendar,
  Award,
  Users,
  Clock,
  ArrowLeft,
  Filter,
  Grid,
  List,
  Share2,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Crown
} from 'lucide-react';

const VendorProfilePage = ({ vendorId, onNavigate, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showContactForm, setShowContactForm] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Données du vendeur (normalement récupérées via API avec vendorId)
  const vendor = {
    id: vendorId || 1,
    name: "Fatou Diallo",
    businessName: "Atelier Fatou Couture",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop",
    location: "Dakar, Parcelles Assainies",
    phone: "+221 77 123 45 67",
    email: "fatou@atelierfatou.sn",
    description: "Spécialisée dans la création de vêtements traditionnels sénégalais depuis plus de 15 ans. Mon atelier propose des créations uniques alliant tradition et modernité, avec un savoir-faire artisanal transmis de génération en génération.",
    rating: 4.9,
    totalReviews: 156,
    totalSales: 1247,
    joinDate: "2020-03-15",
    responseTime: "2h",
    categories: ["Boubous", "Robes", "Ensembles", "Accessoires"],
    badges: ["Vendeur Certifié", "Top Rated", "Livraison Rapide"],
    stats: {
      products: 32,
      orders: 1247,
      customers: 456,
      rating: 4.9
    },
    socialMedia: {
      instagram: "@atelierfatou",
      facebook: "Atelier Fatou Couture",
      whatsapp: "+221771234567"
    }
  };

  // Produits du vendeur
  const vendorProducts = [
    {
      id: 1,
      name: "Grand Boubou Brodé Premium",
      price: 65000,
      originalPrice: 80000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      category: "Boubous",
      rating: 4.9,
      reviews: 34,
      sold: 89,
      isNew: false,
      discount: "-19%",
      inStock: true
    },
    {
      id: 2,
      name: "Robe Wax Élégante",
      price: 45000,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
      category: "Robes",
      rating: 4.8,
      reviews: 28,
      sold: 67,
      isNew: true,
      inStock: true
    },
    {
      id: 3,
      name: "Ensemble Bazin Riche",
      price: 58000,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
      category: "Ensembles",
      rating: 4.7,
      reviews: 19,
      sold: 43,
      inStock: true
    },
    {
      id: 4,
      name: "Collier Perles Traditionnelles",
      price: 22000,
      originalPrice: 28000,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      category: "Accessoires",
      rating: 4.6,
      reviews: 15,
      sold: 156,
      discount: "-21%",
      inStock: true
    },
    {
      id: 5,
      name: "Boubou Femme Brodé",
      price: 52000,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
      category: "Boubous",
      rating: 4.8,
      reviews: 22,
      sold: 78,
      inStock: true
    },
    {
      id: 6,
      name: "Pantalon Traditionnel",
      price: 35000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      category: "Ensembles",
      rating: 4.5,
      reviews: 12,
      sold: 34,
      inStock: false
    }
  ];

  // Avis clients
  const reviews = [
    {
      id: 1,
      customer: "Aminata Ba",
      rating: 5,
      comment: "Travail exceptionnel ! Le boubou est magnifique et la qualité est au rendez-vous. Fatou est très professionnelle.",
      date: "2025-01-10",
      verified: true,
      product: "Grand Boubou Brodé Premium"
    },
    {
      id: 2,
      customer: "Marie Dupont",
      rating: 5,
      comment: "Très satisfaite de mon achat. La robe est encore plus belle qu'en photo. Livraison rapide.",
      date: "2025-01-08",
      verified: true,
      product: "Robe Wax Élégante"
    },
    {
      id: 3,
      customer: "Ousmane Diop",
      rating: 4,
      comment: "Belle qualité, conforme à la description. Petit délai de livraison mais le résultat en vaut la peine.",
      date: "2025-01-05",
      verified: true,
      product: "Ensemble Bazin Riche"
    }
  ];

  const filteredProducts = vendorProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.isNew ? 1 : -1;
      case 'bestseller': return b.sold - a.sold;
      default: return b.reviews - a.reviews;
    }
  });

  const handleWishlist = (e, productId) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlistItems);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlistItems(newWishlist);
  };

  const handleProductClick = (product) => {
    if (onNavigate) {
      onNavigate('product', { id: product.id, vendorId: vendor.id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de couverture */}
      <div className="relative">
        <img
          src={vendor.coverImage}
          alt="Couverture boutique"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Bouton retour */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Boutons d'action */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setShowContactForm(true)}
            className="bg-[#F99834] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E5861A] transition-colors font-medium"
          >
            Contacter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profil vendeur */}
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#F99834] p-2 rounded-full">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.businessName}</h1>
                    <p className="text-xl text-gray-600 mb-2">{vendor.name}</p>
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.floor(vendor.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-bold text-gray-900">{vendor.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.totalReviews} avis</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.badges.map((badge, index) => (
                    <span key={index} className="bg-[#F99834] bg-opacity-10 text-[#F99834] px-3 py-1 rounded-full text-sm font-medium">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">{vendor.description}</p>

                {/* Statistiques */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{vendor.stats.products}</div>
                    <div className="text-sm text-gray-600">Produits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{vendor.stats.orders}</div>
                    <div className="text-sm text-gray-600">Ventes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{vendor.stats.customers}</div>
                    <div className="text-sm text-gray-600">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#F99834]">{vendor.responseTime}</div>
                    <div className="text-sm text-gray-600">Réponse</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation et filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Produits de la boutique</h2>
              <p className="text-gray-600">{sortedProducts.length} produit(s) disponible(s)</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Filtre catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
              >
                <option value="all">Toutes catégories</option>
                {vendor.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
              >
                <option value="popular">Plus populaires</option>
                <option value="newest">Plus récents</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
                <option value="bestseller">Meilleures ventes</option>
              </select>

              {/* Vue */}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal - Produits */}
          <div className="lg:col-span-3">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {product.isNew && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Nouveau
                        </span>
                      )}
                      
                      {product.discount && !product.isNew && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {product.discount}
                        </span>
                      )}

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Rupture de stock
                          </span>
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => handleWishlist(e, product.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${
                          wishlistItems.has(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600 hover:text-red-500'
                        }`} />
                      </button>
                      
                      <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-[#F99834] hover:bg-opacity-10 transition-colors">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        {product.inStock && (
                          <button className="bg-[#F99834] text-white p-2 rounded-full shadow-lg hover:bg-[#E5861A] transition-colors">
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-xs text-[#F99834] font-semibold mb-1">{product.category}</div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#F99834] transition-colors line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-auto">{product.sold} vendus</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice.toLocaleString()} FCFA</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vue Liste */
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        {product.isNew && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Nouveau
                          </span>
                        )}
                        {product.discount && !product.isNew && (
                          <span className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {product.discount}
                          </span>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">Rupture</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm text-[#F99834] font-semibold">{product.category}</div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#F99834] transition-colors mb-2">
                              {product.name}
                            </h3>
                            
                            <div className="flex items-center space-x-6 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews} avis)</span>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                {product.sold} vendus
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through ml-3">{product.originalPrice.toLocaleString()} FCFA</span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={(e) => handleWishlist(e, product.id)}
                                  className="p-2 rounded-full border border-gray-300 hover:bg-red-50 transition-colors"
                                >
                                  <Heart className={`h-5 w-5 transition-colors ${
                                    wishlistItems.has(product.id) 
                                      ? 'text-red-500 fill-current' 
                                      : 'text-gray-600 hover:text-red-500'
                                  }`} />
                                </button>
                                
                                <button className="p-2 rounded-full border border-gray-300 hover:bg-[#F99834] hover:bg-opacity-10 transition-colors">
                                  <Eye className="h-5 w-5 text-gray-600" />
                                </button>
                                
                                {product.inStock ? (
                                  <button className="px-6 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors flex items-center space-x-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>Ajouter au panier</span>
                                  </button>
                                ) : (
                                  <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                                    Rupture de stock
                                  </button>
                                )}
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

            {/* Message si aucun produit */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">Aucun produit ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>

          {/* Sidebar droite - Infos vendeur */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Informations de contact */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{vendor.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{vendor.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{vendor.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Répond en {vendor.responseTime}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full mt-6 bg-[#F99834] text-white py-3 rounded-lg hover:bg-[#E5861A] transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contacter le vendeur</span>
                </button>
              </div>

              {/* Spécialités */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spécialités</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F99834] bg-opacity-10 text-[#F99834] rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membre depuis:</span>
                    <span className="font-medium">{new Date(vendor.joinDate).getFullYear()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commandes traitées:</span>
                    <span className="font-medium">{vendor.totalSales}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note moyenne:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{vendor.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                
                <div className="space-y-2">
                  {Object.entries(vendor.socialMedia).map(([platform, handle]) => (
                    <a
                      key={platform}
                      href="#"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#F99834] bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-[#F99834] text-xs font-bold">
                          {platform[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm">{handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis clients */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Avis clients</h2>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-xl font-bold text-gray-900">{vendor.rating}</span>
              <span className="text-gray-600">({vendor.totalReviews} avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Achat vérifié
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">Produit: {review.product}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-[#F99834] hover:text-[#E5861A] font-medium">
              Voir tous les avis ({vendor.totalReviews})
            </button>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contacter {vendor.name}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre nom</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent">
                  <option>Question sur un produit</option>
                  <option>Commande personnalisée</option>
                  <option>Information générale</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfilePage;