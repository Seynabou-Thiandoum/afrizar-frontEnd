import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Star, 
  Heart, 
  ShoppingBag, 
  Eye, 
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Flame,
  Zap,
  Crown,
  Sparkles,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Play,
  Bookmark,
  Share2,
  MessageCircle,
  ThumbsUp,
  Globe,
  Camera,
  Palette,
  Scissors,
  MapPin,
  Tag,
  Users,
  Award,
  Target
} from 'lucide-react';
import { usePanier } from '../contexts/PanierContext';
import { useAuth } from '../contexts/AuthContext';
import tendanceService, { ProduitTendance, ProduitsALaMode } from '../services/tendanceService';
import actualiteService, { Actualite as ActualiteReelle } from '../services/actualiteService';

interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  imageUrl: string;
  vendeur: {
    nom: string;
    logo?: string;
  };
  categorie: string;
  note: number;
  nombreAvis: number;
  vendus: number;
  tendance: boolean;
  nouveaute: boolean;
  promo: boolean;
  tags: string[];
}

interface Actualite {
  id: number;
  titre: string;
  resume: string;
  contenu: string;
  imageUrl: string;
  auteur: string;
  datePublication: string;
  categorie: string;
  tags: string[];
  likes: number;
  commentaires: number;
  partages: number;
  vue: boolean;
  tendance: boolean;
}

interface Tendance {
  id: number;
  nom: string;
  description: string;
  imageUrl: string;
  couleur: string;
  saison: string;
  popularite: number;
  tags: string[];
}

const TendancesPage = () => {
  const { ajouterAuPanier } = usePanier();
  const { user, isAuthenticated } = useAuth();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [tendances, setTendances] = useState<Tendance[]>([]);
  const [produitsReels, setProduitsReels] = useState<ProduitsALaMode | null>(null);
  const [actualitesReelles, setActualitesReelles] = useState<ActualiteReelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'actualites' | 'tendances' | 'produits'>('actualites');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'tendance' | 'ventes' | 'note' | 'prix'>('tendance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Données de démonstration pour les actualités
  const actualitesDemo: Actualite[] = [
    {
      id: 1,
      titre: "Le Wax Sénégalais Conquiert les Défilés Internationaux",
      resume: "La mode africaine s'impose sur les podiums parisiens et new-yorkais avec des créations inspirées du wax traditionnel sénégalais.",
      contenu: "Les créateurs sénégalais révolutionnent la mode internationale en réinterprétant les motifs traditionnels du wax. Cette tendance met en valeur l'héritage culturel tout en s'adaptant aux codes contemporains.",
      imageUrl: "/images/actualites/wax-international.jpg",
      auteur: "Fatou Diallo",
      datePublication: "2024-01-15",
      categorie: "Tendances",
      tags: ["wax", "international", "mode", "culture"],
      likes: 1247,
      commentaires: 89,
      partages: 156,
      vue: true,
      tendance: true
    },
    {
      id: 2,
      titre: "Nouvelle Collection Automne-Hiver 2024 : Les Couleurs à la Mode",
      resume: "Découvrez les palettes de couleurs qui vont dominer la saison automne-hiver avec des tons chauds et des accents vibrants.",
      contenu: "Cette saison, les créateurs misent sur des couleurs chaudes comme l'orange brûlé, le rouge bordeaux et le vert émeraude pour créer des looks sophistiqués et élégants.",
      imageUrl: "/images/actualites/couleurs-automne.jpg",
      auteur: "Aminata Traoré",
      datePublication: "2024-01-12",
      categorie: "Couleurs",
      tags: ["couleurs", "automne", "hiver", "palette"],
      likes: 892,
      commentaires: 67,
      partages: 134,
      vue: true,
      tendance: true
    },
    {
      id: 3,
      titre: "Mode Durable : L'Engagement des Créateurs Sénégalais",
      resume: "Les marques locales s'engagent pour une mode plus responsable avec des matériaux éco-responsables et des pratiques éthiques.",
      contenu: "De plus en plus de créateurs sénégalais adoptent des pratiques durables, utilisant des tissus recyclés et des techniques de production respectueuses de l'environnement.",
      imageUrl: "/images/actualites/mode-durable.jpg",
      auteur: "Moussa Diop",
      datePublication: "2024-01-10",
      categorie: "Développement",
      tags: ["durable", "éco-responsable", "éthique", "environnement"],
      likes: 1156,
      commentaires: 123,
      partages: 189,
      vue: true,
      tendance: false
    },
    {
      id: 4,
      titre: "Street Style Dakar : Les Influences Urbaines",
      resume: "Le style urbain dakarois influence la mode internationale avec ses créations audacieuses et ses mélanges culturels uniques.",
      contenu: "Dakar devient un véritable laboratoire de la mode urbaine, où tradition et modernité se rencontrent pour créer des looks uniques et authentiques.",
      imageUrl: "/images/actualites/street-style-dakar.jpg",
      auteur: "Khadija Fall",
      datePublication: "2024-01-08",
      categorie: "Street Style",
      tags: ["street style", "urbain", "dakar", "influence"],
      likes: 743,
      commentaires: 45,
      partages: 98,
      vue: true,
      tendance: true
    }
  ];

  // Données de démonstration pour les tendances
  const tendancesDemo: Tendance[] = [
    {
      id: 1,
      nom: "Wax Moderne",
      description: "Réinterprétation contemporaine des motifs traditionnels",
      imageUrl: "/images/tendances/wax-moderne.jpg",
      couleur: "#FF6B35",
      saison: "Printemps-Été",
      popularite: 95,
      tags: ["wax", "moderne", "traditionnel", "contemporain"]
    },
    {
      id: 2,
      nom: "Silhouettes Amples",
      description: "Retour aux formes généreuses et confortables",
      imageUrl: "/images/tendances/silhouettes-amples.jpg",
      couleur: "#2E8B57",
      saison: "Automne-Hiver",
      popularite: 87,
      tags: ["silhouette", "ample", "confort", "élégance"]
    },
    {
      id: 3,
      nom: "Couleurs Terre",
      description: "Palette de couleurs inspirée de la nature",
      imageUrl: "/images/tendances/couleurs-terre.jpg",
      couleur: "#8B4513",
      saison: "Toute l'année",
      popularite: 82,
      tags: ["couleurs", "terre", "nature", "neutres"]
    },
    {
      id: 4,
      nom: "Accessoires Minimalistes",
      description: "Simplicité et raffinement dans les accessoires",
      imageUrl: "/images/tendances/accessoires-minimalistes.jpg",
      couleur: "#708090",
      saison: "Toute l'année",
      popularite: 78,
      tags: ["accessoires", "minimaliste", "raffinement", "simplicité"]
    }
  ];

  // Données de démonstration pour les produits tendance
  const produitsTendance: Produit[] = [
    {
      id: 1,
      nom: "Robe Wax Élégante",
      description: "Magnifique robe en tissu wax traditionnel, parfaite pour les occasions spéciales",
      prix: 45000,
      prixPromo: 35000,
      imageUrl: "/images/produits/robe-wax-1.jpg",
      vendeur: {
        nom: "Boutique Awa",
        logo: "/images/vendeurs/boutique-awa.jpg"
      },
      categorie: "Robes",
      note: 4.8,
      nombreAvis: 124,
      vendus: 89,
      tendance: true,
      nouveaute: true,
      promo: true,
      tags: ["wax", "traditionnel", "élégant"]
    },
    {
      id: 2,
      nom: "Costume 3 Pièces Moderne",
      description: "Costume classique revisité avec des touches contemporaines",
      prix: 85000,
      imageUrl: "/images/produits/costume-3-pieces.jpg",
      vendeur: {
        nom: "Atelier Moderne",
        logo: "/images/vendeurs/atelier-moderne.jpg"
      },
      categorie: "Costumes",
      note: 4.9,
      nombreAvis: 67,
      vendus: 45,
      tendance: true,
      nouveaute: false,
      promo: false,
      tags: ["costume", "moderne", "élégant"]
    },
    {
      id: 3,
      nom: "Ensemble Boubou Premium",
      description: "Boubou traditionnel en coton de qualité supérieure",
      prix: 65000,
      prixPromo: 55000,
      imageUrl: "/images/produits/boubou-premium.jpg",
      vendeur: {
        nom: "Textiles Traditionnels",
        logo: "/images/vendeurs/textiles-traditionnels.jpg"
      },
      categorie: "Boubou",
      note: 4.7,
      nombreAvis: 156,
      vendus: 203,
      tendance: true,
      nouveaute: false,
      promo: true,
      tags: ["boubou", "traditionnel", "premium"]
    },
    {
      id: 4,
      nom: "Chemise Wax Casual",
      description: "Chemise décontractée en tissu wax, idéale pour le quotidien",
      prix: 25000,
      imageUrl: "/images/produits/chemise-wax-casual.jpg",
      vendeur: {
        nom: "Style Afrique",
        logo: "/images/vendeurs/style-afrique.jpg"
      },
      categorie: "Chemises",
      note: 4.6,
      nombreAvis: 89,
      vendus: 167,
      tendance: true,
      nouveaute: true,
      promo: false,
      tags: ["wax", "casual", "quotidien"]
    },
    {
      id: 5,
      nom: "Jupe Wax Longue",
      description: "Jupe longue en wax avec motif traditionnel",
      prix: 32000,
      imageUrl: "/images/produits/jupe-wax-longue.jpg",
      vendeur: {
        nom: "Fashion Sénégal",
        logo: "/images/vendeurs/fashion-senegal.jpg"
      },
      categorie: "Jupes",
      note: 4.5,
      nombreAvis: 78,
      vendus: 134,
      tendance: true,
      nouveaute: false,
      promo: false,
      tags: ["wax", "jupe", "traditionnel"]
    },
    {
      id: 6,
      nom: "Pantalon Wax Taille Haute",
      description: "Pantalon wax moderne avec taille haute",
      prix: 38000,
      prixPromo: 30000,
      imageUrl: "/images/produits/pantalon-wax-taille-haute.jpg",
      vendeur: {
        nom: "Mode Contemporaine",
        logo: "/images/vendeurs/mode-contemporaine.jpg"
      },
      categorie: "Pantalons",
      note: 4.8,
      nombreAvis: 112,
      vendus: 98,
      tendance: true,
      nouveaute: true,
      promo: true,
      tags: ["wax", "moderne", "taille haute"]
    }
  ];

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      // Charger les données réelles et fictives en parallèle
      const [produitsReelsData, actualitesReellesData] = await Promise.all([
        tendanceService.obtenirProduitsALaMode(12),
        actualiteService.obtenirActualitesRecentes(6)
      ]);
      
      setProduitsReels(produitsReelsData);
      setActualitesReelles(actualitesReellesData);
      setProduits(produitsTendance);
      setActualites(actualitesDemo);
      setTendances(tendancesDemo);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, afficher les données fictives
      setProduits(produitsTendance);
      setActualites(actualitesDemo);
      setTendances(tendancesDemo);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Robes', 'Costumes', 'Boubou', 'Chemises', 'Jupes', 'Pantalons'];

  // Fonction pour convertir les actualités réelles en format compatible
  const convertirActualiteReelle = (actualite: ActualiteReelle): Actualite => {
    return {
      id: actualite.id,
      titre: actualite.titre,
      resume: actualite.resume,
      contenu: actualite.contenu,
      imageUrl: actualite.imageUrl || '/images/placeholder-news.jpg',
      auteur: actualite.auteur,
      datePublication: actualite.datePublication,
      categorie: actualite.categorie || 'Actualités',
      tags: actualite.tags || [],
      likes: actualite.nombreLikes,
      commentaires: actualite.nombreCommentaires,
      partages: actualite.nombrePartages,
      vue: actualite.estVisible,
      tendance: actualite.estTendance
    };
  };

  // Fonction pour convertir les produits réels en format compatible
  const convertirProduitReel = (produit: ProduitTendance): Produit => {
    return {
      id: produit.id,
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      prixPromo: produit.prixPromo,
      imageUrl: produit.photos && produit.photos.length > 0 ? produit.photos[0] : '/images/placeholder-product.jpg',
      vendeur: {
        nom: produit.nomVendeur,
        logo: undefined
      },
      categorie: produit.nomCategorie || 'Sans catégorie',
      note: produit.noteMoyenne,
      nombreAvis: produit.nombreEvaluations,
      vendus: Math.floor(Math.random() * 100) + 1, // Simulation
      tendance: produit.description?.includes('[TENDANCE]') || false,
      nouveaute: false,
      promo: !!produit.prixPromo,
      tags: [produit.nomCategorie || 'mode'].filter(Boolean)
    };
  };

  const trierProduits = (produits: Produit[]) => {
    return [...produits].sort((a, b) => {
      let valeurA: number;
      let valeurB: number;

      switch (sortBy) {
        case 'tendance':
          valeurA = a.tendance ? 1 : 0;
          valeurB = b.tendance ? 1 : 0;
          break;
        case 'ventes':
          valeurA = a.vendus;
          valeurB = b.vendus;
          break;
        case 'note':
          valeurA = a.note;
          valeurB = b.note;
          break;
        case 'prix':
          valeurA = a.prixPromo || a.prix;
          valeurB = b.prixPromo || b.prix;
          break;
        default:
          valeurA = a.vendus;
          valeurB = b.vendus;
      }

      if (sortOrder === 'asc') {
        return valeurA - valeurB;
      } else {
        return valeurB - valeurA;
      }
    });
  };

  // Combiner les actualités fictives et réelles
  const toutesActualites = [
    ...actualites,
    ...(actualitesReelles.map(convertirActualiteReelle))
  ].filter((actualite, index, array) => 
    array.findIndex(a => a.id === actualite.id) === index
  );

  // Combiner les produits fictifs et réels
  const tousProduits = [
    ...produits,
    ...(produitsReels ? [
      ...produitsReels.produitsPlusVus.map(convertirProduitReel),
      ...produitsReels.produitsMieuxNotes.map(convertirProduitReel),
      ...produitsReels.produitsPromo.map(convertirProduitReel),
      ...produitsReels.produitsRecents.map(convertirProduitReel)
    ] : [])
  ];

  // Supprimer les doublons basés sur l'ID
  const produitsUniques = tousProduits.filter((produit, index, self) => 
    index === self.findIndex(p => p.id === produit.id)
  );

  const filtrerProduits = (produits: Produit[]) => {
    if (selectedCategory === 'all') {
      return produits;
    }
    return produits.filter(produit => produit.categorie === selectedCategory);
  };

  const produitsFiltres = trierProduits(filtrerProduits(produitsUniques));

  const handleAjouterAuPanier = (produit: Produit) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }
    ajouterAuPanier(produit.id, 1);
  };

  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR').format(prix);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des tendances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">À la Mode</h1>
            </div>
            <p className="text-xl md:text-2xl text-orange-100 mb-6">
              Actualités, tendances et produits du marché de la mode
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Globe className="h-5 w-5 mr-2" />
                <span className="font-semibold">Actualités</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-semibold">Tendances</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="font-semibold">Produits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('actualites')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'actualites'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Actualités Mode
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tendances')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'tendances'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendances 2024
              </div>
            </button>
            <button
              onClick={() => setActiveTab('produits')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'produits'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Produits Tendance
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'actualites' && (
          <div className="space-y-8">
            {/* Featured News */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={toutesActualites[0]?.imageUrl}
                  alt={toutesActualites[0]?.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-news.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {toutesActualites[0]?.categorie}
                    </span>
                    {toutesActualites[0]?.tendance && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Flame className="h-3 w-3 mr-1" />
                        Tendance
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{toutesActualites[0]?.titre}</h2>
                  <p className="text-lg text-gray-200 mb-4">{toutesActualites[0]?.resume}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {toutesActualites[0]?.auteur}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(toutesActualites[0]?.datePublication).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {toutesActualites[0]?.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {toutesActualites[0]?.commentaires}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toutesActualites.slice(1).map((actualite) => (
                <article key={actualite.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={actualite.imageUrl}
                      alt={actualite.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-news.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <span className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                        {actualite.categorie}
                      </span>
                      {actualite.tendance && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <Flame className="h-3 w-3 mr-1" />
                          Tendance
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{actualite.titre}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{actualite.resume}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {actualite.auteur}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(actualite.datePublication).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {actualite.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {actualite.commentaires}
                        </div>
                      </div>
                      <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center">
                        Lire la suite
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tendances' && (
          <div className="space-y-8">
            {/* Trend Overview */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-4">Tendances 2024</h2>
              <p className="text-lg text-purple-100 mb-6">
                Découvrez les tendances qui vont marquer cette année dans le monde de la mode africaine
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{tendances.length}</div>
                  <div className="text-purple-200">Tendances identifiées</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-purple-200">Popularité moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-purple-200">Saisons couvertes</div>
                </div>
              </div>
            </div>

            {/* Trends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tendances.map((tendance) => (
                <div key={tendance.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={tendance.imageUrl}
                      alt={tendance.nom}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-trend.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                        {tendance.saison}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white"
                        style={{ backgroundColor: tendance.couleur }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{tendance.nom}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tendance.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        Popularité: {tendance.popularite}%
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${tendance.popularite}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tendance.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'produits' && (
          <div className="space-y-8">
            {/* Filters and Controls */}
            <div className="bg-white shadow-sm border-b">
              <div className="py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'Toutes les catégories' : category}
                      </button>
                    ))}
                  </div>

                  {/* Sort and View Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Sort */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Trier par:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="tendance">Tendance</option>
                        <option value="ventes">Plus vendus</option>
                        <option value="note">Mieux notés</option>
                        <option value="prix">Prix</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* View Mode */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section des produits réels */}
            {produitsReels && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Produits à la Mode</h3>
                  <p className="text-gray-600">Découvrez les produits tendance de nos vendeurs</p>
                </div>

                {/* Produits les plus vus */}
                {produitsReels.produitsPlusVus.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-blue-500" />
                        Plus Vus
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {produitsReels.produitsPlusVus.slice(0, 4).map((produit) => {
                        const produitConverti = convertirProduitReel(produit);
                        return (
                          <div key={produit.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <img
                              src={produitConverti.imageUrl}
                              alt={produitConverti.nom}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-product.jpg';
                              }}
                            />
                            <h5 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                              {produitConverti.nom}
                            </h5>
                            <p className="text-orange-600 font-semibold text-sm">
                              {produitConverti.prix.toLocaleString()} FCFA
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              {produit.nombreVues} vues
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Produits en promotion */}
                {produitsReels.produitsPromo.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                        Promotions
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {produitsReels.produitsPromo.slice(0, 4).map((produit) => {
                        const produitConverti = convertirProduitReel(produit);
                        return (
                          <div key={produit.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors relative">
                            {produit.prixPromo && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                -{Math.round(((produit.prix - produit.prixPromo) / produit.prix) * 100)}%
                              </div>
                            )}
                            <img
                              src={produitConverti.imageUrl}
                              alt={produitConverti.nom}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-product.jpg';
                              }}
                            />
                            <h5 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                              {produitConverti.nom}
                            </h5>
                            <div className="flex items-center space-x-2">
                              {produit.prixPromo ? (
                                <>
                                  <p className="text-red-600 font-semibold text-sm">
                                    {produit.prixPromo.toLocaleString()} FCFA
                                  </p>
                                  <p className="text-gray-400 line-through text-xs">
                                    {produit.prix.toLocaleString()} FCFA
                                  </p>
                                </>
                              ) : (
                                <p className="text-orange-600 font-semibold text-sm">
                                  {produitConverti.prix.toLocaleString()} FCFA
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            {produitsFiltres.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {produitsFiltres.map((produit) => (
                  <div
                    key={produit.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                      <img
                        src={produit.imageUrl}
                        alt={produit.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {produit.tendance && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <Flame className="h-3 w-3 mr-1" />
                            Tendance
                          </span>
                        )}
                        {produit.nouveaute && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Nouveau
                          </span>
                        )}
                        {produit.promo && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Promo
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAjouterAuPanier(produit)}
                          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Ajouter au panier
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{produit.categorie}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{produit.note}</span>
                          <span className="text-xs text-gray-400 ml-1">({produit.nombreAvis})</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{produit.nom}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{produit.description}</p>

                      {/* Vendor */}
                      <div className="flex items-center mb-3">
                        <img
                          src={produit.vendeur.logo}
                          alt={produit.vendeur.nom}
                          className="w-6 h-6 rounded-full mr-2"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-vendor.jpg';
                          }}
                        />
                        <span className="text-sm text-gray-500">{produit.vendeur.nom}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {produit.prixPromo ? (
                            <>
                              <span className="text-lg font-bold text-orange-600">
                                {formatPrix(produit.prixPromo)} FCFA
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrix(produit.prix)} FCFA
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrix(produit.prix)} FCFA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{produit.vendus} vendus</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {produit.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'actualites' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">{toutesActualites.length}</div>
                <div className="text-gray-600">Articles publiés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {toutesActualites.reduce((sum, a) => sum + a.likes, 0)}
                </div>
                <div className="text-gray-600">Likes total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {toutesActualites.reduce((sum, a) => sum + a.commentaires, 0)}
                </div>
                <div className="text-gray-600">Commentaires</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {toutesActualites.filter(a => a.tendance).length}
                </div>
                <div className="text-gray-600">Articles tendance</div>
              </div>
            </div>
          )}

          {activeTab === 'tendances' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">{tendances.length}</div>
                <div className="text-gray-600">Tendances identifiées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {Math.round(tendances.reduce((sum, t) => sum + t.popularite, 0) / tendances.length)}%
                </div>
                <div className="text-gray-600">Popularité moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {new Set(tendances.map(t => t.saison)).size}
                </div>
                <div className="text-gray-600">Saisons couvertes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {tendances.reduce((sum, t) => sum + t.tags.length, 0)}
                </div>
                <div className="text-gray-600">Tags associés</div>
              </div>
            </div>
          )}

          {activeTab === 'produits' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">{produits.length}</div>
                <div className="text-gray-600">Produits tendance</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {produits.reduce((sum, p) => sum + p.vendus, 0)}
                </div>
                <div className="text-gray-600">Articles vendus</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-gray-600">Catégories disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {produits.filter(p => p.tendance).length}
                </div>
                <div className="text-gray-600">Produits en tendance</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TendancesPage;