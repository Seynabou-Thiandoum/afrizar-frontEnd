import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Shirt, 
  Gem, 
  Star,
  Eye,
  ShoppingCart,
  Heart,
  MapPin,
  Search,
  Grid3X3,
  List,
  Users,
  Baby,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import ProductModal from './ProductModal';
import categorieService from '../services/categorieService';
import produitService from '../services/produitService';

const CategoriesPage = ({ onBack }: { onBack: () => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Grouper les catégories par type (VETEMENTS, ACCESSOIRES)
      const categoriesVetements = categoriesData.filter(cat => 
        cat.active && cat.type === 'VETEMENTS'
      );
      const categoriesAccessoires = categoriesData.filter(cat => 
        cat.active && cat.type === 'ACCESSOIRES'
      );

      // Créer les catégories principales avec les vraies données
      const categoriesGroupees: any[] = [];

      // Vêtements
      if (categoriesVetements.length > 0) {
        const produitsVetements = (produitsData.content || produitsData || []).filter((p: any) => 
          categoriesVetements.some(cat => cat.id === p.categorieId)
        );

        categoriesGroupees.push({
          id: 'vetements',
          name: 'Vêtements',
          description: 'Hommes, Femmes, Enfants',
          icon: Shirt,
          image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
          color: 'from-blue-500 to-indigo-600',
          productCount: produitsVetements.length,
          subcategories: []
        });

        // Grouper les vêtements par genre
        const genres = ['HOMME', 'FEMME', 'ENFANT'];
        genres.forEach(genre => {
          const categoriesDuGenre = categoriesVetements.filter(cat => cat.genre === genre);
          if (categoriesDuGenre.length > 0) {
            const icon = genre === 'HOMME' ? Users : genre === 'FEMME' ? Crown : Baby;
            const nomGenre = genre === 'HOMME' ? 'Hommes' : genre === 'FEMME' ? 'Femmes' : 'Enfants';
            
            // Compter les produits pour ce genre
            const produitsDuGenre = produitsVetements.filter((p: any) => 
              categoriesDuGenre.some(cat => cat.id === p.categorieId)
            );

            categoriesGroupees[0].subcategories.push({
              id: `vetements-${genre.toLowerCase()}`,
              name: nomGenre,
              description: categoriesDuGenre.map(cat => cat.nom).join(', '),
              icon: icon,
              image: categoriesDuGenre[0]?.imageUrl || 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=400',
              productCount: produitsDuGenre.length,
              categories: categoriesDuGenre
            });
          }
        });
      }

      // Accessoires
      if (categoriesAccessoires.length > 0) {
        const produitsAccessoires = (produitsData.content || produitsData || []).filter((p: any) => 
          categoriesAccessoires.some(cat => cat.id === p.categorieId)
        );

        categoriesGroupees.push({
          id: 'accessoires',
          name: 'Accessoires',
          description: 'Bonnets/Chapeaux, Chaussures, Sacs, Bijoux',
          icon: Gem,
          image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
          color: 'from-purple-500 to-violet-600',
          productCount: produitsAccessoires.length,
          subcategories: []
        });

        // Grouper les accessoires par genre
        const genres = ['HOMME', 'FEMME', 'ENFANT'];
        genres.forEach(genre => {
          const categoriesDuGenre = categoriesAccessoires.filter(cat => cat.genre === genre);
          if (categoriesDuGenre.length > 0) {
            const icon = genre === 'HOMME' ? Users : genre === 'FEMME' ? Crown : Baby;
            const nomGenre = genre === 'HOMME' ? 'Hommes' : genre === 'FEMME' ? 'Femmes' : 'Enfants';
            
            // Compter les produits pour ce genre
            const produitsDuGenre = produitsAccessoires.filter((p: any) => 
              categoriesDuGenre.some(cat => cat.id === p.categorieId)
            );

            categoriesGroupees[1].subcategories.push({
              id: `accessoires-${genre.toLowerCase()}`,
              name: nomGenre,
              description: categoriesDuGenre.map(cat => cat.nom).join(', '),
              icon: icon,
              image: categoriesDuGenre[0]?.imageUrl || 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=400',
              productCount: produitsDuGenre.length,
              categories: categoriesDuGenre
            });
          }
        });
      }

      setCategories(categoriesGroupees);
      setProducts(produitsData.content || produitsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser les données par défaut
      setCategories(categoriesParDefaut);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Données par défaut en cas d'erreur
  const categoriesParDefaut = [
    {
      id: 'vetements',
      name: 'Vêtements',
      description: 'Hommes, Femmes, Enfants',
      icon: Shirt,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-blue-500 to-indigo-600',
      productCount: 0,
      subcategories: []
    },
    {
      id: 'accessoires',
      name: 'Accessoires',
      description: 'Bonnets/Chapeaux, Chaussures, Sacs, Bijoux',
      icon: Gem,
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-purple-500 to-violet-600',
      productCount: 0,
      subcategories: []
    }
  ];

  // Transformer les produits de l'API pour le format d'affichage
  const transformerProduit = (produit: any) => {
    const categorie = categories.find(cat => 
      cat.subcategories.some((sub: any) => 
        sub.categories?.some((c: any) => c.id === produit.categorieId)
      )
    );
    
    const sousCategorie = categorie?.subcategories.find((sub: any) => 
      sub.categories?.some((c: any) => c.id === produit.categorieId)
    );

    return {
      id: produit.id,
      name: produit.nom,
      description: produit.description || 'Produit artisanal de qualité',
      price: produit.prix,
      originalPrice: produit.prixPromo ? produit.prix : null,
      currency: 'FCFA',
      image: produit.imageUrl || 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        produit.imageUrl || 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=800',
        ...(produit.imagesSupplementaires || [])
      ],
      rating: 4.5, // Note par défaut
      reviews: Math.floor(Math.random() * 50) + 5, // Nombre d'avis aléatoire
      status: produit.statut === 'ACTIF' ? 'En stock' : 'Indisponible',
      category: categorie?.name || 'Vêtements',
      subcategory: sousCategorie?.name || 'Général',
      quality: produit.prix > 30000 ? 'Optimal' : 'Normale',
      colors: produit.couleur ? [produit.couleur] : ['#FF6B35', '#004E89', '#F7C52D'],
      sizes: produit.taille ? [produit.taille] : ['S', 'M', 'L', 'XL'],
      weight: produit.poids ? `${produit.poids} kg` : '0.5 kg',
      dimensions: 'Dimensions variables',
      vendor: produit.vendeurNom || produit.vendeurBoutique || 'Artisan Local',
      delivery: {
        express: '2-5 jours',
        normal: '5-20 jours'
      },
      location: 'Sénégal',
      customizable: true,
      history: 'Produit artisanal créé selon les traditions sénégalaises, perpétuant un savoir-faire ancestral transmis de génération en génération.'
    };
  };

  const filteredProducts = selectedCategory 
    ? products
        .filter((product: any) => {
          // Trouver la catégorie du produit
          const categorieProduit = categories.find(cat => 
            cat.subcategories.some((sub: any) => 
              sub.categories?.some((c: any) => c.id === product.categorieId)
            )
          );
          return categorieProduit?.id === selectedCategory.id;
        })
        .map(transformerProduit)
    : [];

  const toggleWishlist = (productId: number) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const handleOrderWhatsApp = (product: any) => {
    const message = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - Prix: ${formatPrice(product.price, product.currency)}`;
    const whatsappUrl = `https://wa.me/221771234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOrderForm = (product: any) => {
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
              {selectedCategory.subcategories.map((sub: any, index: number) => {
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
            {filteredProducts.map((product: any) => (
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-gray-600">Chargement des catégories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {categories.map((category: any) => {
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
                    {category.subcategories.slice(0, 3).map((sub: any, index: number) => (
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
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;