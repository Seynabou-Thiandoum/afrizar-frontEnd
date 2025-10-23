import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Tag, 
  Image as ImageIcon,
  Save,
  X,
  Flame,
  TrendingUp,
  Sparkles,
  Globe,
  MessageCircle,
  ThumbsUp,
  Share2,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

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

const AdminActualitesMode = () => {
  const [activeTab, setActiveTab] = useState<'actualites' | 'tendances' | 'produits'>('actualites');
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [tendances, setTendances] = useState<Tendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Actualite | Tendance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'popularite' | 'titre'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Données de démonstration
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
    }
  ];

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
    }
  ];

  useEffect(() => {
    setActualites(actualitesDemo);
    setTendances(tendancesDemo);
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: Actualite | Tendance) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (activeTab === 'actualites') {
      setActualites(actualites.filter(a => a.id !== id));
    } else if (activeTab === 'tendances') {
      setTendances(tendances.filter(t => t.id !== id));
    }
  };

  const handleToggleVisibility = (id: number) => {
    if (activeTab === 'actualites') {
      setActualites(actualites.map(a => 
        a.id === id ? { ...a, vue: !a.vue } : a
      ));
    }
  };

  const handleToggleTrend = (id: number) => {
    if (activeTab === 'actualites') {
      setActualites(actualites.map(a => 
        a.id === id ? { ...a, tendance: !a.tendance } : a
      ));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filteredActualites = actualites.filter(actualite =>
    actualite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actualite.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actualite.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTendances = tendances.filter(tendance =>
    tendance.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tendance.saison.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tendance.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Mode & Tendances</h1>
            <p className="text-gray-600">Gérez les actualités, tendances et produits à la mode</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#F99834] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('actualites')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'actualites'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="h-4 w-4 mr-2" />
              Actualités Mode
            </button>
            <button
              onClick={() => setActiveTab('tendances')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'tendances'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendances 2024
            </button>
            <button
              onClick={() => setActiveTab('produits')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'produits'
                  ? 'border-[#F99834] text-[#F99834]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Produits Tendance
            </button>
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="popularite">Popularité</option>
                <option value="titre">Titre</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'actualites' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActualites.map((actualite) => (
                  <tr key={actualite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={actualite.imageUrl}
                            alt={actualite.titre}
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-news.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {actualite.titre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {actualite.categorie}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {actualite.tendance && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Flame className="h-3 w-3 mr-1" />
                                Tendance
                              </span>
                            )}
                            {!actualite.vue && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Masqué
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {actualite.auteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(actualite.datePublication)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {actualite.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {actualite.commentaires}
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          {actualite.partages}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(actualite.id)}
                          className={`p-1 rounded ${
                            actualite.vue ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {actualite.vue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleTrend(actualite.id)}
                          className={`p-1 rounded ${
                            actualite.tendance ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Flame className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(actualite)}
                          className="text-[#F99834] hover:text-[#E8892A]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(actualite.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tendances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTendances.map((tendance) => (
            <div key={tendance.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
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
                      className="bg-[#F99834] h-2 rounded-full"
                      style={{ width: `${tendance.popularite}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {tendance.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleEdit(tendance)}
                    className="text-[#F99834] hover:text-[#E8892A] flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(tendance.id)}
                    className="text-red-600 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'produits' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Gestion des Produits Tendance</h3>
            <p className="text-gray-500 mb-6">
              Cette section sera intégrée avec la gestion des produits existante
            </p>
            <button className="bg-[#F99834] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E8892A] transition-colors">
              Voir les Produits
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F99834] mb-1">{actualites.length}</div>
            <div className="text-sm text-gray-600">Articles publiés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F99834] mb-1">{tendances.length}</div>
            <div className="text-sm text-gray-600">Tendances actives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F99834] mb-1">
              {actualites.reduce((sum, a) => sum + a.likes, 0)}
            </div>
            <div className="text-sm text-gray-600">Likes total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F99834] mb-1">
              {actualites.filter(a => a.tendance).length}
            </div>
            <div className="text-sm text-gray-600">Articles tendance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActualitesMode;
