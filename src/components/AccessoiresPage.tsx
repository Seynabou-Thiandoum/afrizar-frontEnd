import { useState, useEffect } from 'react';
import { Heart, Search, Grid, List, Star, Eye, Plus, ArrowLeft, MessageCircle, ShoppingCart } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { usePanier } from '../contexts/PanierContext';
import categorieService from '../services/categorieService';
import produitService from '../services/produitService';
import Swal from 'sweetalert2';

const AccessoiresPage = ({ onNavigate }: { onNavigate?: any }) => {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const { ajouterAuPanier } = usePanier();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // Nouveau état pour les types
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Pour les détails produit
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Numéro WhatsApp (remplace par le vrai numéro)
  const whatsappNumber = "221123456789"; // Format international sans le +

  // Charger les données depuis l'API
  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      // Récupérer les catégories et produits en parallèle
      const [categoriesData, produitsData] = await Promise.all([
        categorieService.getAllCategories(),
        produitService.getAllProduits(0, 1000)
      ]);

      // Filtrer seulement les catégories d'accessoires
      const categoriesAccessoires = categoriesData.filter(cat => 
        cat.active && cat.type === 'ACCESSOIRES'
      );

      // Filtrer seulement les produits d'accessoires
      const produitsAccessoires = (produitsData.content || produitsData || []).filter((p: any) => 
        categoriesAccessoires.some(cat => cat.id === p.categorieId)
      );

      setCategories(categoriesAccessoires);
      setProducts(produitsAccessoires);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser des données par défaut
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (imageUrl?: string | string[]) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop';
    
    // Si c'est un tableau, prendre le premier élément
    const photo = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
    
    if (!photo) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop';
    if (photo.startsWith('http')) return photo;
    return `http://localhost:8080${photo}`;
  };

  // Transformer les produits de l'API pour le format d'affichage
  const transformerProduit = (produit: any) => {
    const categorie = categories.find(cat => cat.id === produit.categorieId);
    
    // Récupérer la première photo de la liste des photos
    const mainPhoto = produit.photos && produit.photos.length > 0 
      ? produit.photos[0] 
      : (produit.imageUrl || null);
    
    console.log('📸 Accessoire:', produit.nom, '- Photos:', produit.photos, '- MainPhoto:', mainPhoto);
    
    return {
      id: produit.id,
      name: produit.nom,
      price: `${new Intl.NumberFormat('fr-FR').format(produit.prix)} FCFA`,
      originalPrice: produit.prixPromo ? `${new Intl.NumberFormat('fr-FR').format(produit.prixPromo)} FCFA` : null,
      image: getImageUrl(mainPhoto),
      category: categorie?.nom || 'Accessoire',
      subcategory: categorie?.genre?.toLowerCase() || 'homme',
      rating: 4.5, // Note par défaut
      reviews: Math.floor(Math.random() * 50) + 5, // Nombre d'avis aléatoire
      isNew: Math.random() > 0.7, // 30% de chance d'être nouveau
      discount: produit.prixPromo ? `-${Math.round((1 - produit.prix / produit.prixPromo) * 100)}%` : null,
      colors: produit.couleur ? [produit.couleur] : ['Blanc', 'Noir', 'Marron'],
      description: produit.description || 'Accessoire artisanal de qualité supérieure.',
      sizes: produit.taille ? [produit.taille] : ['Unique'],
      gallery: produit.photos && produit.photos.length > 0
        ? produit.photos.map(photo => getImageUrl(photo))
        : [getImageUrl(mainPhoto)]
    };
  };

  // Transformer tous les produits
  const allAccessories = products.map(transformerProduit);

  // Créer les catégories dynamiquement
  const categoriesList = [
    { id: 'all', name: 'Tous', count: allAccessories.length },
    { id: 'homme', name: 'Homme', count: allAccessories.filter(p => p.subcategory === 'homme').length },
    { id: 'femme', name: 'Femme', count: allAccessories.filter(p => p.subcategory === 'femme').length },
    { id: 'enfant', name: 'Enfant', count: allAccessories.filter(p => p.subcategory === 'enfant').length }
  ];

  // Sous-catégories dynamiques basées sur les vraies catégories
  const subcategories = {
    homme: [...new Set(allAccessories.filter(p => p.subcategory === 'homme').map(p => p.category))],
    femme: [...new Set(allAccessories.filter(p => p.subcategory === 'femme').map(p => p.category))],
    enfant: [...new Set(allAccessories.filter(p => p.subcategory === 'enfant').map(p => p.category))]
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
  const handleWhatsAppOrder = (product: any) => {
    const message = `Bonjour, je suis intéressé(e) par le produit : ${product.name} au prix de ${product.price}. Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Fonction pour afficher les détails d'un produit
  const handleProductClick = (productId: any) => {
    const product = allAccessories.find(item => item.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleWishlistClick = (e: any, productId: any) => {
    e.stopPropagation();
    // Logique wishlist
    console.log('Ajouté aux favoris:', productId);
  };

  // Fonction pour ajouter au panier (SANS vérification de connexion)
  const handleAddToCart = async (e: any, item: any) => {
    e.stopPropagation();

    try {
      setAddingToCart(item.id);
      
      // Ajouter au panier (temporaire ou backend selon connexion)
      await ajouterAuPanier(
        item,
        1,
        item.sizes?.[0], // Prendre la première taille disponible
        item.colors?.[0] // Prendre la première couleur disponible
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Produit ajouté !',
        text: 'Le produit a été ajouté à votre panier',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de l\'ajout au panier',
        confirmButtonText: 'OK'
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Composant pour les détails du produit
  const ProductDetails = ({ product, onClose }: { product: any, onClose: any }) => {
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
                    {product.gallery.map((img: any, index: any) => (
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
                      {product.colors.map((color: any) => (
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
                      {product.sizes.map((size: any) => (
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
                <div className="space-y-3">
                  <button 
                    onClick={() => handleWishlistClick({stopPropagation: () => {}}, product.id)}
                    className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Heart className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Ajouter aux favoris</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={addingToCart === product.id}
                    className="w-full bg-[#F99834] text-white py-3 px-6 rounded-lg hover:bg-[#E5861A] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{addingToCart === product.id ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleWhatsAppOrder(product)}
                    className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-gray-600">Chargement des accessoires...</span>
          </div>
        </div>
      </div>
    );
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
                  {categoriesList.map((cat) => (
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
              {selectedCategory !== 'all' && (subcategories as any)[selectedCategory] && (
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
                    {(subcategories as any)[selectedCategory].map((subcat: any) => (
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