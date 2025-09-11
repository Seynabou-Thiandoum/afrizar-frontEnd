import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Shirt, 
  Gem, 
  Star,
  Eye,
  ShoppingCart,
  Heart,
  Clock,
  MapPin,
  Filter,
  Search,
  Grid3X3,
  List,
  Users,
  Baby
} from 'lucide-react';
import ProductModal from './ProductModal';

const CategoriesPage = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 'vetements',
      name: 'Vêtements',
      description: 'Hommes, Femmes, Enfants',
      icon: Shirt,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-blue-500 to-indigo-600',
      productCount: 120,
      subcategories: [
        {
          id: 'hommes',
          name: 'Hommes',
          description: 'Grands boubous, costumes traditionnels, kaftans',
          icon: Users,
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 45
        },
        {
          id: 'femmes',
          name: 'Femmes',
          description: 'Boubous, robes, ensembles bazin, caftans',
          icon: Crown,
          image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 65
        },
        {
          id: 'enfants',
          name: 'Enfants',
          description: 'Tenues traditionnelles pour enfants',
          icon: Baby,
          image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 10
        }
      ]
    },
    {
      id: 'accessoires',
      name: 'Accessoires',
      description: 'Bonnets/Chapeaux, Chaussures, Sacs, Bijoux',
      icon: Gem,
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-purple-500 to-violet-600',
      productCount: 85,
      subcategories: [
        {
          id: 'bonnets-chapeaux',
          name: 'Bonnets/Chapeaux',
          description: 'Couvre-chefs traditionnels et modernes',
          icon: Crown,
          image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 15
        },
        {
          id: 'chaussures',
          name: 'Chaussures',
          description: 'Babouches, sandales, chaussures artisanales',
          icon: Shirt,
          image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 25
        },
        {
          id: 'sacs',
          name: 'Sacs',
          description: 'Sacs à main, besaces, maroquinerie',
          icon: Gem,
          image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 20
        },
        {
          id: 'bijoux',
          name: 'Bijoux',
          description: 'Colliers, bracelets, boucles d\'oreilles',
          icon: Star,
          image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=400',
          productCount: 25
        }
      ]
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      description: 'Magnifique grand boubou avec broderies dorées fait main. Tissu wax premium importé de Côte d\'Ivoire. Pièce unique créée selon les traditions ancestrales sénégalaises.',
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
      category: 'Vêtements',
      subcategory: 'Femmes',
      quality: 'Optimal',
      colors: ['#FF6B35', '#004E89', '#F7C52D'],
      sizes: ['S', 'M', 'L', 'XL'],
      weight: '0.8 kg',
      dimensions: 'L: 150cm, l: 120cm',
      vendor: 'Atelier Fatou',
      delivery: {
        express: '2-5 jours',
        normal: '5-20 jours'
      },
      location: 'Dakar, Sénégal',
      customizable: true,
      history: 'Le grand boubou est un vêtement traditionnel sénégalais porté lors des grandes occasions. Cette pièce perpétue un savoir-faire ancestral transmis de génération en génération.'
    },
    {
      id: 2,
      name: 'Kaftan Homme Traditionnel',
      description: 'Kaftan élégant pour homme avec broderies sophistiquées et finitions premium. Coupe traditionnelle adaptée aux morphologies modernes.',
      price: 38000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.6,
      reviews: 15,
      status: 'En stock',
      category: 'Vêtements',
      subcategory: 'Hommes',
      quality: 'Normale',
      colors: ['#8B4513', '#000080', '#228B22'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      weight: '0.7 kg',
      dimensions: 'L: 140cm, l: 110cm',
      vendor: 'Maître Ibrahima',
      delivery: {
        express: '3-5 jours',
        normal: '7-15 jours'
      },
      location: 'Kaolack, Sénégal',
      customizable: true,
      history: 'Le kaftan masculin est une tenue d\'apparat portée lors des cérémonies importantes. Sa coupe ample offre confort et élégance.'
    },
    {
      id: 3,
      name: 'Ensemble Enfant Coloré',
      description: 'Adorable ensemble traditionnel pour enfant en tissu wax coloré. Parfait pour les fêtes et cérémonies familiales.',
      price: 18000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.9,
      reviews: 12,
      status: 'En stock',
      category: 'Vêtements',
      subcategory: 'Enfants',
      quality: 'Normale',
      colors: ['#FF6B35', '#32CD32', '#4169E1'],
      sizes: ['2-4 ans', '4-6 ans', '6-8 ans', '8-10 ans'],
      weight: '0.3 kg',
      dimensions: 'Selon âge',
      vendor: 'Couture Enfantine',
      delivery: {
        express: '2-4 jours',
        normal: '5-12 jours'
      },
      location: 'Dakar, Sénégal',
      customizable: false,
      history: 'Les tenues traditionnelles pour enfants initient les plus jeunes à la richesse culturelle sénégalaise dès le plus jeune âge.'
    },
    {
      id: 4,
      name: 'Bonnet Traditionnel Brodé',
      description: 'Bonnet traditionnel sénégalais avec broderies dorées. Accessoire indispensable pour compléter une tenue traditionnelle masculine.',
      price: 8000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.5,
      reviews: 28,
      status: 'En stock',
      category: 'Accessoires',
      subcategory: 'Bonnets/Chapeaux',
      quality: 'Normale',
      colors: ['#000000', '#8B4513', '#FF6B35'],
      sizes: ['S', 'M', 'L'],
      weight: '0.1 kg',
      dimensions: 'Tour de tête: 54-60cm',
      vendor: 'Accessoires Traditionnels',
      delivery: {
        express: '1-3 jours',
        normal: '3-10 jours'
      },
      location: 'Saint-Louis, Sénégal',
      customizable: true,
      history: 'Le bonnet traditionnel, appelé "calotte", est un symbole de respect et de tradition dans la culture sénégalaise.'
    },
    {
      id: 5,
      name: 'Babouches Cuir Artisanales',
      description: 'Babouches traditionnelles en cuir véritable, confectionnées selon les méthodes ancestrales. Confort et élégance pour tous les jours.',
      price: 15000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.3,
      reviews: 19,
      status: 'En stock',
      category: 'Accessoires',
      subcategory: 'Chaussures',
      quality: 'Normale',
      colors: ['#8B4513', '#000000', '#FF6B35'],
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
      weight: '0.6 kg',
      dimensions: 'Pointures européennes',
      vendor: 'Cordonnerie Traditionnelle',
      delivery: {
        express: '2-4 jours',
        normal: '5-15 jours'
      },
      location: 'Touba, Sénégal',
      customizable: false,
      history: 'Les babouches sont des chaussures traditionnelles d\'Afrique du Nord adoptées et adaptées par l\'artisanat sénégalais.'
    },
    {
      id: 6,
      name: 'Sac à Main Cuir Artisanal',
      description: 'Sac à main en cuir véritable avec motifs traditionnels gravés à la main. Maroquinerie de qualité supérieure alliant tradition et modernité.',
      price: 25000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.5,
      reviews: 28,
      status: 'Stock limité',
      category: 'Accessoires',
      subcategory: 'Sacs',
      quality: 'Optimal',
      colors: ['#8B4513', '#000000', '#800000'],
      sizes: ['Unique'],
      weight: '0.5 kg',
      dimensions: 'L: 30cm, H: 25cm, P: 12cm',
      vendor: 'Maroquinerie Salam',
      delivery: {
        express: '2-5 jours',
        normal: '5-15 jours'
      },
      location: 'Mbour, Sénégal',
      customizable: false,
      history: 'La maroquinerie sénégalaise puise ses techniques dans l\'artisanat traditionnel du travail du cuir, perfectionnées au fil des générations.'
    },
    {
      id: 7,
      name: 'Collier Perles Traditionnelles',
      description: 'Collier artisanal en perles de verre colorées selon la tradition sénégalaise. Chaque perle est sélectionnée et assemblée à la main par nos artisans bijoutiers.',
      price: 12000,
      currency: 'FCFA',
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.7,
      reviews: 32,
      status: 'En stock',
      category: 'Accessoires',
      subcategory: 'Bijoux',
      quality: 'Normale',
      colors: ['#FF4500', '#32CD32', '#4169E1'],
      sizes: ['Unique'],
      weight: '0.1 kg',
      dimensions: 'Longueur: 45cm',
      vendor: 'Bijoux Khadija',
      delivery: {
        express: '1-3 jours',
        normal: '2-10 jours'
      },
      location: 'Saint-Louis, Sénégal',
      customizable: true,
      history: 'Les perles de verre sont un art ancestral au Sénégal, utilisées dans les parures traditionnelles depuis des siècles.'
    }
  ];

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory.name)
    : [];

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

  const handleOrderWhatsApp = (product) => {
    const message = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - Prix: ${formatPrice(product.price, product.currency)}`;
    const whatsappUrl = `https://wa.me/221771234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOrderForm = (product) => {
    console.log('Commande via formulaire:', product);
    // Redirection vers formulaire de commande
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedCategory.name}</h1>
                <p className="text-gray-600 mt-1">{selectedCategory.description} • {filteredProducts.length} produits</p>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
          {/* Subcategories */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sous-catégories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCategory.subcategories.map((sub, index) => {
                const IconComponent = sub.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{sub.name}</h4>
                        <p className="text-xs text-gray-500">{sub.productCount} produits</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{sub.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
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
                  
                  {/* Quality Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                    product.quality === 'Optimal' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.quality}
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Customizable Badge */}
                  {product.customizable && (
                    <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Personnalisable
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
                    <button 
                      onClick={() => handleOrderWhatsApp(product)}
                      className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                      {product.subcategory}
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

                  {/* Spécifications */}
                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <div><strong>Poids:</strong> {product.weight}</div>
                    <div><strong>Dimensions:</strong> {product.dimensions}</div>
                    {product.customizable && (
                      <div className="text-purple-600 font-medium">✨ Personnalisation disponible</div>
                    )}
                  </div>

                  {viewMode === 'list' && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h5 className="font-semibold text-blue-900 text-sm mb-1">Histoire & Tradition</h5>
                        <p className="text-blue-800 text-xs line-clamp-2">{product.history}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
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
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">📦 Express:</span>
                      <span className="font-medium text-red-600">{product.delivery.express}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🚚 Normal:</span>
                      <span className="font-medium text-blue-600">{product.delivery.normal}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOrderWhatsApp(product)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => handleOrderForm(product)}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Formulaire
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-600 mt-1">Explorez nos collections par catégorie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-4 hover:rotate-1 border border-white/50"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg">
                    <div className="text-sm font-bold text-gray-900">{category.productCount}</div>
                    <div className="text-xs text-gray-600">produits</div>
                  </div>
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                      <IconComponent className="h-7 w-7 text-orange-600" />
                    </div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                <div className="p-8 relative">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {category.description}
                  </p>
                  
                  {/* Subcategories Preview */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        +{category.subcategories.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-orange-600 font-bold text-lg">
                      Voir la collection
                    </span>
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                      <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;