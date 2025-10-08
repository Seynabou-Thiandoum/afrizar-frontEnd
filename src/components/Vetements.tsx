import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, Star, ShoppingBag, Eye, Plus, Shirt, ArrowLeft, MessageCircle } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const VetementsPage = ({ onNavigate }) => {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // Changé de selectedSubcategory
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null); // Pour les détails produit

  // Numéro WhatsApp (remplace par le vrai numéro)
  const whatsappNumber = "221770450099"; // Format international sans le +

  // Données des vêtements organisées selon le schéma
  const vetements = {
    homme: [
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
        isNew: false,
        discount: "-19%",
        sizes: ["L", "XL", "XXL"],
        colors: ["Blanc", "Bleu", "Beige"],
        description: "Boubou traditionnel brodé main avec finitions de qualité supérieure. Parfait pour les cérémonies et occasions spéciales.",
        gallery: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
          "https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&h=600&fit=crop",
          "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 2,
        name: "Ensemble Costume Africain",
        price: "85,000 FCFA",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        category: "Costumes",
        subcategory: "homme",
        rating: 4.9,
        reviews: 28,
        sizes: ["M", "L", "XL"],
        colors: ["Noir", "Marine", "Gris"],
        description: "Costume moderne avec motifs traditionnels, coupe ajustée et tissus de qualité.",
        gallery: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 3,
        name: "Pantalon Traditionnel",
        price: "35,000 FCFA",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        category: "Pantalons",
        subcategory: "homme",
        rating: 4.6,
        reviews: 19,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Blanc", "Beige", "Kaki"],
        isNew: true,
        description: "Pantalon coupe droite en coton, confortable et élégant.",
        gallery: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 4,
        name: "Chemise Brodée",
        price: "28,000 FCFA",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        category: "Chemises",
        subcategory: "homme",
        rating: 4.5,
        reviews: 42,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blanc", "Bleu clair", "Beige"],
        description: "Chemise avec broderies artisanales, parfaite pour un look raffiné.",
        gallery: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
        ]
      }
    ],
    femme: [
      {
        id: 5,
        name: "Robe Wax Élégante",
        price: "45,000 FCFA",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        category: "Robes",
        subcategory: "femme",
        rating: 4.7,
        reviews: 56,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Multicolore", "Rouge", "Bleu"],
        description: "Robe en tissu wax authentique, coupe moderne et confortable.",
        gallery: [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 6,
        name: "Boubou Femme Brodé",
        price: "58,000 FCFA",
        originalPrice: "70,000 FCFA",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        category: "Boubous",
        subcategory: "femme",
        rating: 4.8,
        reviews: 73,
        discount: "-17%",
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Blanc", "Rose", "Violet"],
        description: "Boubou avec broderies dorées, élégance et tradition.",
        gallery: [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 7,
        name: "Ensemble Jupe-Haut",
        price: "42,000 FCFA",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        category: "Ensembles",
        subcategory: "femme",
        rating: 4.6,
        reviews: 31,
        isNew: true,
        sizes: ["S", "M", "L"],
        colors: ["Wax multicolore", "Rouge", "Vert"],
        description: "Ensemble coordonné moderne, style africain contemporain.",
        gallery: [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 8,
        name: "Robe de Cérémonie",
        price: "75,000 FCFA",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        category: "Robes",
        subcategory: "femme",
        rating: 4.9,
        reviews: 22,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Or", "Bordeaux", "Marine"],
        description: "Robe élégante pour occasions spéciales, finitions luxueuses.",
        gallery: [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop"
        ]
      }
    ],
    enfant: [
      {
        id: 9,
        name: "Ensemble Garçon Traditionnel",
        price: "32,000 FCFA",
        image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=500&fit=crop",
        category: "Garçons",
        subcategory: "enfant",
        rating: 4.7,
        reviews: 25,
        sizes: ["2 ans", "4 ans", "6 ans", "8 ans"],
        colors: ["Bleu", "Vert", "Rouge"],
        description: "Ensemble traditionnel pour garçon, confort et style.",
        gallery: [
          "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 10,
        name: "Robe Fille Wax",
        price: "28,000 FCFA",
        image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=500&fit=crop",
        category: "Filles",
        subcategory: "enfant",
        rating: 4.6,
        reviews: 33,
        isNew: true,
        sizes: ["2 ans", "4 ans", "6 ans", "8 ans", "10 ans"],
        colors: ["Rose", "Multicolore", "Violet"],
        description: "Robe colorée en wax pour fillette, douce et confortable.",
        gallery: [
          "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 11,
        name: "Costume Garçon Cérémonie",
        price: "45,000 FCFA",
        image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=500&fit=crop",
        category: "Garçons",
        subcategory: "enfant",
        rating: 4.8,
        reviews: 18,
        sizes: ["4 ans", "6 ans", "8 ans", "10 ans"],
        colors: ["Marine", "Noir", "Gris"],
        description: "Costume élégant pour garçon, parfait pour les cérémonies.",
        gallery: [
          "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=500&h=600&fit=crop"
        ]
      },
      {
        id: 12,
        name: "Ensemble Fille Brodé",
        price: "38,000 FCFA",
        originalPrice: "45,000 FCFA",
        image: "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=400&h=500&fit=crop",
        category: "Filles",
        subcategory: "enfant",
        rating: 4.5,
        reviews: 27,
        discount: "-16%",
        sizes: ["3 ans", "5 ans", "7 ans", "9 ans"],
        colors: ["Rose", "Blanc", "Lilas"],
        description: "Ensemble avec broderies délicates, douceur et élégance.",
        gallery: [
          "https://images.unsplash.com/photo-1503944168730-28e2a3ba9b19?w=500&h=600&fit=crop"
        ]
      }
    ]
  };

  // Fusionner tous les vêtements
  const allVetements = [...vetements.homme, ...vetements.femme, ...vetements.enfant];

  const categories = [
    { id: 'all', name: 'Tous', count: allVetements.length },
    { id: 'homme', name: 'Homme', count: vetements.homme.length },
    { id: 'femme', name: 'Femme', count: vetements.femme.length },
    { id: 'enfant', name: 'Enfant', count: vetements.enfant.length }
  ];

  // Sous-catégories selon le schéma
  const subcategories = {
    homme: ["Boubous", "Costumes", "Pantalons", "Chemises"],
    femme: ["Robes", "Boubous", "Ensembles"],
    enfant: ["Garçons", "Filles"]
  };

  const filteredVetements = allVetements.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.subcategory === selectedCategory;
    const matchesType = selectedType === 'all' || item.category === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = selectedSize === 'all' || item.sizes.includes(selectedSize);
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      switch(priceRange) {
        case 'low': matchesPrice = price < 35000; break;
        case 'medium': matchesPrice = price >= 35000 && price < 60000; break;
        case 'high': matchesPrice = price >= 60000; break;
      }
    }
    
    return matchesCategory && matchesType && matchesSearch && matchesSize && matchesPrice;
  });

  // Tri
  const sortedVetements = [...filteredVetements].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case 'price-high': return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return b.reviews - a.reviews;
    }
  });

  // Fonction pour ouvrir WhatsApp avec message
  const handleWhatsAppOrder = (e, item) => {
    e.stopPropagation();
    const message = `Bonjour ! Je suis intéressé(e) par cet article :\n\n📦 ${item.name}\n💰 Prix: ${item.price}\n📋 Catégorie: ${item.category}\n\nPouvez-vous me donner plus d'informations sur la disponibilité et les options de livraison ?\n\nMerci !`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Fonction pour afficher les détails d'un produit
  const handleProductClick = (productId) => {
    const product = allVetements.find(item => item.id === productId);
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
              <span>{t('clothes.back')}</span>
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
                  <span className="text-sm text-[#F99834] font-semibold">{product.category}</span>
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
                              ? 'border-[#F99834] bg-orange-50 text-[#F99834]'
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
                              ? 'border-[#F99834] bg-orange-50 text-[#F99834]'
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
                    <span>{t('clothes.order_whatsapp')}</span>
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
          <h1 className="text-4xl font-black text-gray-900 mb-2">{t('clothes.page_title')}</h1>
          <p className="text-gray-600">{t('clothes.discover')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtres */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              
              {/* Recherche */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('search')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('clothes.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Catégories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('categories')}</h3>
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
                          ? 'bg-[#F99834] bg-opacity-10 text-[#F99834] border border-[#F99834] border-opacity-30' 
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
                          ? 'bg-[#F99834] text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {t('clothes.all_types')}
                    </button>
                    {subcategories[selectedCategory].map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => setSelectedType(subcat)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedType === subcat 
                            ? 'bg-[#F99834] text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailles */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('clothes.all_sizes')}</h3>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                >
                  <option value="all">{t('clothes.all_sizes')}</option>
                  <optgroup label="Adultes">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </optgroup>
                  <optgroup label="Enfants">
                    <option value="2 ans">2 ans</option>
                    <option value="3 ans">3 ans</option>
                    <option value="4 ans">4 ans</option>
                    <option value="5 ans">5 ans</option>
                    <option value="6 ans">6 ans</option>
                    <option value="7 ans">7 ans</option>
                    <option value="8 ans">8 ans</option>
                    <option value="9 ans">9 ans</option>
                    <option value="10 ans">10 ans</option>
                  </optgroup>
                </select>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('clothes.all_prices')}</h3>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                >
                  <option value="all">{t('clothes.all_prices')}</option>
                  <option value="low">{t('clothes.under_30k')}</option>
                  <option value="medium">{t('clothes.30k_60k')}</option>
                  <option value="high">{t('clothes.over_100k')}</option>
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
                  <span className="font-semibold">{sortedVetements.length}</span> {t('clothes.found')}
                  {selectedCategory !== 'all' && <span> dans <span className="text-[#F99834] font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span></span>}
                  {selectedType !== 'all' && <span> - <span className="text-[#F99834] font-medium">{selectedType}</span></span>}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                >
                  <option value="popular">{t('clothes.popular')}</option>
                  <option value="price-low">{t('clothes.price_low')}</option>
                  <option value="price-high">{t('clothes.price_high')}</option>
                  <option value="rating">{t('clothes.rating')}</option>
                  <option value="name">A-Z</option>
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
                {sortedVetements.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {item.isNew && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {t('clothes.new_badge')}
                        </span>
                      )}
                      
                      {item.discount && !item.isNew && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-[#F99834] hover:bg-opacity-10 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={(e) => handleWhatsAppOrder(e, item)}
                          className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                          title="Commander sur WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-xs text-[#F99834] font-semibold mb-1">{item.category}</div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#F99834] transition-colors">{item.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{item.rating} ({item.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      {/* Tailles disponibles */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.sizes.slice(0, 4).map((size, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {size}
                          </span>
                        ))}
                        {item.sizes.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{item.sizes.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                          )}
                        </div>
                        
                        {item.colors && (
                          <div 
                            className="flex space-x-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
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
                {sortedVetements.map((item) => (
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
                          className="w-32 h-40 object-cover rounded-lg"
                        />
                        {item.isNew && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {t('clothes.new_badge')}
                          </span>
                        )}
                        {item.discount && !item.isNew && (
                          <span className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {item.discount}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm text-[#F99834] font-semibold">{item.category}</div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#F99834] transition-colors mb-2">
                              {item.name}
                            </h3>
                            
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            
                            <div className="flex items-center space-x-6 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{item.rating} ({item.reviews} avis)</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Shirt className="h-4 w-4 text-gray-500" />
                                <div className="flex flex-wrap gap-1">
                                  {item.sizes.map((size, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {item.colors && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-600">Couleurs:</span>
                                  <div className="flex space-x-1">
                                    {item.colors.slice(0, 3).map((color, index) => (
                                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
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
                                  className="p-2 rounded-full border border-gray-300 hover:bg-[#F99834] hover:bg-opacity-10 transition-colors"
                                >
                                  <Eye className="h-5 w-5 text-gray-600" />
                                </button>
                                
                                <button 
                                  onClick={(e) => handleWhatsAppOrder(e, item)}
                                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                  title="Commander sur WhatsApp"
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
            {sortedVetements.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm p-12">
                  <Shirt className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun vêtement trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche ou de filtrage.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedType('all');
                      setSelectedSize('all');
                      setPriceRange('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer - Section Tendances */}
        <div className="mt-16 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tendances du Moment</h2>
              <p className="text-[#F99834] text-opacity-70">Les pièces les plus populaires de notre collection</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 rounded-full p-4">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Articles tendance - sélection intelligente */}
            {(() => {
              // Tri par rating puis par nombre de reviews pour éviter les doublons
              const topItems = allVetements
                .filter(item => item.rating >= 4.6) // Critère plus large
                .sort((a, b) => {
                  if (b.rating === a.rating) {
                    return b.reviews - a.reviews; // Si même rating, privilégier plus de reviews
                  }
                  return b.rating - a.rating;
                })
                .slice(0, 8); // Prendre plus d'options

              // Assurer une diversité des catégories
              const diverseItems = [];
              const usedCategories = new Set();
              
              // D'abord, prendre un item de chaque catégorie principale
              ['homme', 'femme', 'enfant'].forEach(category => {
                const categoryItem = topItems.find(item => 
                  item.subcategory === category && !diverseItems.includes(item)
                );
                if (categoryItem) {
                  diverseItems.push(categoryItem);
                  usedCategories.add(category);
                }
              });
              
              // Compléter avec les meilleurs items restants
              topItems.forEach(item => {
                if (diverseItems.length < 4 && !diverseItems.includes(item)) {
                  diverseItems.push(item);
                }
              });
              
              // Garantir au minimum 4 items même si peu d'items de qualité
              while (diverseItems.length < 4 && diverseItems.length < allVetements.length) {
                const remainingItems = allVetements
                  .filter(item => !diverseItems.includes(item))
                  .sort((a, b) => b.rating - a.rating);
                
                if (remainingItems.length > 0) {
                  diverseItems.push(remainingItems[0]);
                } else {
                  break;
                }
              }
              
              return diverseItems.slice(0, 4);
            })().map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group relative"
                >
                  {/* Badge Tendance */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-pink-500 to-[#F99834] text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 TENDANCE
                    </span>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
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
                    
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleWhatsAppOrder(e, item)}
                        className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                        title="Commander sur WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-[#F99834] font-semibold mb-1">{item.category}</div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#F99834] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{item.price}</div>
                    </div>
                    
                    {/* Indicateur de popularité */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-[#F99834] to-[#E5861A] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(item.rating / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.reviews} commandes cette semaine</p>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Bouton voir plus de tendances si nécessaire */}
          {allVetements.filter(item => item.rating >= 4.6).length > 4 && (
            <div className="text-center mt-8">
              <button 
                onClick={() => {
                  // Naviguer vers une page dédiée aux tendances
                  if (onNavigate) {
                    onNavigate('tendances', { 
                    products: allVetements.filter(item => item.rating >= 4.6),
                    type: 'vetements'
                    });
                  }
                }}
                className="px-6 py-3 bg-white text-[#F99834] rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-md"
              >
                Voir toutes les tendances ({allVetements.filter(item => item.rating >= 4.6).length} articles)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetementsPage;