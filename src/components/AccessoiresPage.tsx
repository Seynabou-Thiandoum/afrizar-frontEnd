import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, Star, ShoppingBag, Eye, Plus, ArrowLeft, MessageCircle } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const AccessoiresPage = ({ onNavigate }) => {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // Nouveau état pour les types
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // Pour les détails produit

  // Numéro WhatsApp (remplace par le vrai numéro)
  const whatsappNumber = "221123456789"; // Format international sans le +

  // Données des accessoires
  const accessories = {
    homme: [
      {
        id: 1,
        name: "Chaussures Artisanales",
        price: "45,000 FCFA",
        originalPrice: "55,000 FCFA",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        category: "Chaussures",
        subcategory: "homme",
        rating: 4.8,
        reviews: 23,
        isNew: false,
        discount: "-18%",
        colors: ["Marron", "Noir"],
        description: "Chaussures artisanales fabriquées avec du cuir de qualité supérieure. Confort et élégance pour toutes occasions.",
        sizes: ["39", "40", "41", "42", "43", "44"],
        gallery: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 2,
        name: "Chapeau Traditionnel",
        price: "15,000 FCFA",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=300&fit=crop",
        category: "Chapeaux",
        subcategory: "homme",
        rating: 4.6,
        reviews: 15,
        isNew: true,
        colors: ["Blanc", "Beige"],
        description: "Chapeau traditionnel sénégalais, parfait pour les cérémonies et occasions spéciales.",
        sizes: ["S", "M", "L", "XL"],
        gallery: [
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 3,
        name: "Ceinture Cuir Tressé",
        price: "25,000 FCFA",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Ceintures",
        subcategory: "homme",
        rating: 4.7,
        reviews: 31,
        colors: ["Marron", "Noir", "Tan"],
        description: "Ceinture en cuir véritable tressé à la main par nos artisans locaux.",
        sizes: ["85cm", "90cm", "95cm", "100cm", "105cm"],
        gallery: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 4,
        name: "Sac Bandoulière",
        price: "35,000 FCFA",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Sacs",
        subcategory: "homme",
        rating: 4.5,
        reviews: 12,
        colors: ["Marron", "Noir"],
        description: "Sac bandoulière spacieux et pratique, idéal pour le travail ou les sorties.",
        gallery: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 5,
        name: "Chaîne Traditionnelle",
        price: "28,000 FCFA",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
        category: "Bijoux",
        subcategory: "homme",
        rating: 4.9,
        reviews: 8,
        colors: ["Or", "Argent"],
        description: "Chaîne traditionnelle en métal précieux, symbole de prestige et d'élégance.",
        gallery: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 6,
        name: "Bracelet Artisanal",
        price: "12,000 FCFA",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
        category: "Bijoux",
        subcategory: "homme",
        rating: 4.4,
        reviews: 19,
        colors: ["Cuir", "Métal"],
        description: "Bracelet artisanal fait main, alliant tradition et modernité.",
        gallery: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"
        ]
      }
    ],
    femme: [
      {
        id: 7,
        name: "Chaussures Talons",
        price: "38,000 FCFA",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop",
        category: "Chaussures",
        subcategory: "femme",
        rating: 4.7,
        reviews: 45,
        colors: ["Rouge", "Noir", "Beige"],
        description: "Chaussures à talons élégantes, parfaites pour sublimer vos tenues traditionnelles.",
        sizes: ["36", "37", "38", "39", "40", "41"],
        gallery: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 8,
        name: "Foulard Wax",
        price: "18,000 FCFA",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
        category: "Foulards",
        subcategory: "femme",
        rating: 4.8,
        reviews: 67,
        isNew: true,
        colors: ["Multicolore"],
        description: "Foulard en wax authentique aux motifs traditionnels africains.",
        gallery: [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 9,
        name: "Boucles d'Oreilles",
        price: "22,000 FCFA",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
        category: "Bijoux",
        subcategory: "femme",
        rating: 4.9,
        reviews: 34,
        colors: ["Or", "Argent"],
        description: "Boucles d'oreilles traditionnelles en métal précieux, finition soignée.",
        gallery: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 10,
        name: "Sac à Main Tressé",
        price: "42,000 FCFA",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Sacs",
        subcategory: "femme",
        rating: 4.6,
        reviews: 28,
        colors: ["Naturel", "Noir", "Rouge"],
        description: "Sac à main tressé artisanalement, spacieux et résistant.",
        gallery: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 11,
        name: "Collier Perles",
        price: "35,000 FCFA",
        originalPrice: "45,000 FCFA",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
        category: "Bijoux",
        subcategory: "femme",
        rating: 4.8,
        reviews: 52,
        discount: "-22%",
        colors: ["Blanc", "Rouge", "Noir"],
        description: "Collier de perles traditionnel, symbole d'élégance et de féminité.",
        gallery: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"
        ]
      }
    ],
    enfant: [
      {
        id: 16,
        name: "Chaussures Filles",
        price: "25,000 FCFA",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop",
        category: "Chaussures",
        subcategory: "enfant",
        rating: 4.8,
        reviews: 18,
        colors: ["Rose", "Blanc", "Rouge"],
        description: "Chaussures confortables et colorées pour petites princesses.",
        sizes: ["24", "25", "26", "27", "28", "29", "30"],
        gallery: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 17,
        name: "Casquette Enfant",
        price: "12,000 FCFA",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=300&fit=crop",
        category: "Chapeaux",
        subcategory: "enfant",
        rating: 4.5,
        reviews: 9,
        isNew: true,
        colors: ["Bleu", "Rouge", "Vert"],
        description: "Casquette colorée et amusante pour protéger du soleil.",
        sizes: ["S", "M"],
        gallery: [
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop"
        ]
      },
      {
        id: 18,
        name: "Sac École",
        price: "18,000 FCFA",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Sacs",
        subcategory: "enfant",
        rating: 4.6,
        reviews: 25,
        colors: ["Bleu", "Rose", "Vert"],
        description: "Sac d'école robuste et pratique avec compartiments multiples.",
        gallery: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
        ]
      }
    ]
  };

  // Fusionner tous les accessoires
  const allAccessories = [...accessories.homme, ...accessories.femme, ...accessories.enfant];

  const categories = [
    { id: 'all', name: 'Tous', count: allAccessories.length },
    { id: 'homme', name: 'Homme', count: accessories.homme.length },
    { id: 'femme', name: 'Femme', count: accessories.femme.length },
    { id: 'enfant', name: 'Enfant', count: accessories.enfant.length }
  ];

  const subcategories = {
    homme: ["Chaussures", "Chapeaux", "Ceintures", "Sacs", "Bijoux"],
    femme: ["Chaussures", "Foulards", "Bijoux", "Sacs", "Ceintures"],
    enfant: ["Chaussures", "Chapeaux", "Sacs", "Bijoux"]
  };

  // Fonction pour filtrer les accessoires
  const filteredAccessories = allAccessories.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.subcategory === selectedCategory;
    const matchesType = selectedType === 'all' || item.category === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      switch(priceRange) {
        case 'low': matchesPrice = price < 20000; break;
        case 'medium': matchesPrice = price >= 20000 && price < 40000; break;
        case 'high': matchesPrice = price >= 40000; break;
      }
    }
    
    return matchesCategory && matchesType && matchesSearch && matchesPrice;
  });

  // Tri
  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case 'price-high': return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return b.reviews - a.reviews;
    }
  });

  // Fonction pour ouvrir WhatsApp avec message
  const handleWhatsAppOrder = (product) => {
    const message = `Bonjour, je suis intéressé(e) par le produit : ${product.name} au prix de ${product.price}. Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Fonction pour afficher les détails d'un produit
  const handleProductClick = (productId) => {
    const product = allAccessories.find(item => item.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    // Logique wishlist
    console.log('Ajouté aux favoris:', productId);
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
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <div></div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div>
                <div className="mb-4">
                  <img
                    src={product.gallery?.[selectedImageIndex] || product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
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
                    <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews} {t('clothes.reviews')})</span>
                  </div>
                  {product.isNew && (
                    <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {t('clothes.new_badge')}
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

                <div className="mb-6">
                  <p className="text-gray-700">{product.description}</p>
                </div>

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
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleWhatsAppOrder(product)}
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
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">{t('accessories.page_title')}</h1>
          <p className="text-gray-600">{t('accessories.discover')}</p>
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
                        setSelectedType('all'); // Reset type filter when category changes
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

              {/* Types/Sous-catégories */}
              {selectedCategory !== 'all' && subcategories[selectedCategory] && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Types</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedType === 'all' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Tous les types
                    </button>
                    {subcategories[selectedCategory].map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => setSelectedType(subcat)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedType === subcat 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {subcat}
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
                  <option value="low">Moins de 20,000 FCFA</option>
                  <option value="medium">20,000 - 40,000 FCFA</option>
                  <option value="high">Plus de 40,000 FCFA</option>
                </select>
              </div>

            </div>
          </div>

          {/* Contenu Principal */}
          <div className="lg:w-3/4">
            
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">{sortedAccessories.length} accessoire(s) trouvé(s)</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
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
                {sortedAccessories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {item.isNew && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Nouveau
                        </span>
                      )}
                      
                      {item.discount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {item.discount}
                        </span>
                      )}
                      
                      <button 
                        onClick={(e) => handleWishlistClick(e, item.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppOrder(item);
                          }}
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
                          <span className="text-xs text-gray-600 ml-1">{item.rating} ({item.reviews})</span>
                        </div>
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
                            {item.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-gray-300 cursor-pointer"
                                title={color}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Ici on peut ajouter une logique pour filtrer par couleur si nécessaire
                                }}
                                style={{ 
                                  backgroundColor: color === 'Multicolore' ? '#ff6b35' : 
                                                 color === 'Or' ? '#ffd700' :
                                                 color === 'Argent' ? '#c0c0c0' :
                                                 color === 'Marron' ? '#8b4513' :
                                                 color === 'Noir' ? '#000000' :
                                                 color === 'Blanc' ? '#ffffff' :
                                                 color === 'Rouge' ? '#dc2626' :
                                                 color === 'Bleu' ? '#2563eb' :
                                                 color === 'Vert' ? '#16a34a' :
                                                 color === 'Rose' ? '#ec4899' :
                                                 color === 'Beige' ? '#f5f5dc' :
                                                 color === 'Tan' ? '#d2b48c' :
                                                 color === 'Naturel' ? '#f4f1de' :
                                                 color === 'Cuir' ? '#8b4513' :
                                                 color === 'Métal' ? '#708090' :
                                                 '#6b7280' 
                                }}
                              />
                            ))}
                            {item.colors.length > 3 && (
                              <div className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center">
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
                {sortedAccessories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        {item.isNew && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Nouveau
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-orange-600 font-semibold">{item.category}</div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                              {item.name}
                            </h3>
                            
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{item.rating} ({item.reviews} avis)</span>
                              </div>
                              
                              {item.colors && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-600">Couleurs:</span>
                                  <div className="flex space-x-1">
                                    {item.colors.slice(0, 4).map((color, index) => (
                                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {color}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                              {item.originalPrice && (
                                <div className="text-sm text-gray-500 line-through">{item.originalPrice}</div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button 
                                onClick={(e) => handleWishlistClick(e, item.id)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWhatsAppOrder(item);
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
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
                ))}
              </div>
            )}

            {sortedAccessories.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun accessoire trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoiresPage;