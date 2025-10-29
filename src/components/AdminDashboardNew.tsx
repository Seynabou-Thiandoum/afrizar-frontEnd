import { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShoppingBag,
  Shield,
  User,
  LogOut,
  LayoutDashboard,
  UserCog,
  Store,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  TrendingUp,
  ArrowLeft,
  Truck,
  CreditCard,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import adminService from '../services/adminService';
import AdminProfile from './admin/AdminProfile';
import AdminUsers from './admin/AdminUsers';
import AdminVendors from './admin/AdminVendors';
import AdminCategoriesNew from './admin/AdminCategoriesNew';
import AdminProducts from './admin/AdminProducts';
import AdminCommissions from './admin/AdminCommissions';
import AdminOrders from './admin/AdminOrders';
import AdminFraisLivraison from './admin/AdminFraisLivraison';
import AdminModesPaiement from './admin/AdminModesPaiement';
import AdminActualitesMode from './admin/AdminActualitesMode';

const AdminDashboardNew = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'users' | 'vendors' | 'products' | 'categories' | 'commissions' | 'orders' | 'frais-livraison' | 'modes-paiement' | 'actualites-mode'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Charger les statistiques au chargement
  useEffect(() => {
    if (activeView === 'dashboard') {
      loadDashboardStats();
    }
  }, [activeView]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Administration</h1>
              <p className="text-xs text-gray-500">Afrizar.sn</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'profile'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Mon Profil</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Gestion</p>
          </div>

          <button
            onClick={() => setActiveView('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'users'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserCog className="h-5 w-5" />
            <span>Utilisateurs</span>
          </button>

          <button
            onClick={() => setActiveView('vendors')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'vendors'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Store className="h-5 w-5" />
            <span>Vendeurs</span>
          </button>

          <button
            onClick={() => setActiveView('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'products'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Produits</span>
          </button>

          <button
            onClick={() => setActiveView('categories')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'categories'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Tag className="h-5 w-5" />
            <span>Catégories</span>
          </button>

          <button
            onClick={() => setActiveView('commissions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'commissions'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Commissions</span>
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'orders'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Commandes</span>
          </button>

          <button
            onClick={() => setActiveView('frais-livraison')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'frais-livraison'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Truck className="h-5 w-5" />
            <span>Frais de Livraison</span>
          </button>

          <button
            onClick={() => setActiveView('modes-paiement')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'modes-paiement'
                ? 'bg-amber-50 text-amber-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Modes de Paiement</span>
          </button>

          <button
            onClick={() => setActiveView('actualites-mode')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'actualites-mode'
                ? 'bg-[#F99834]/10 text-[#F99834] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Globe className="h-5 w-5" />
            <span>Actualités Mode</span>
          </button>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => {
                    setActiveView('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Mon Profil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Tableau de bord'}
                {activeView === 'profile' && 'Mon Profil'}
                {activeView === 'users' && 'Gestion des Utilisateurs'}
                {activeView === 'vendors' && 'Gestion des Vendeurs'}
                {activeView === 'products' && 'Gestion des Produits'}
                {activeView === 'categories' && 'Gestion des Catégories'}
                {activeView === 'commissions' && 'Gestion des Commissions'}
                {activeView === 'orders' && 'Gestion des Commandes'}
                {activeView === 'actualites-mode' && 'Actualités Mode & Tendances'}
              </h2>
              <p className="text-gray-600 mt-1">
                {activeView === 'dashboard' && 'Vue d\'ensemble de votre plateforme'}
                {activeView === 'profile' && 'Gérez vos informations personnelles'}
                {activeView === 'users' && 'Gérez les clients et le personnel support'}
                {activeView === 'vendors' && 'Approuvez et gérez les vendeurs'}
                {activeView === 'products' && 'Validez et publiez les produits'}
                {activeView === 'categories' && 'Organisez vos produits par catégories'}
                {activeView === 'commissions' && 'Configurez les tranches de commission'}
                {activeView === 'orders' && 'Suivez toutes les commandes clients'}
                {activeView === 'actualites-mode' && 'Gérez les actualités, tendances et produits à la mode'}
              </p>
            </div>
            {activeView !== 'dashboard' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.utilisateurs.total}</p>
                        <p className="text-sm text-green-600 mt-1">{stats.utilisateurs.actifs} actifs</p>
                      </div>
                      <div className="bg-blue-500 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vendeurs</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.vendeurs.total}</p>
                        <p className="text-sm text-orange-600 mt-1">{stats.vendeurs.nonVerifies} en attente</p>
                      </div>
                      <div className="bg-green-500 p-3 rounded-lg">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Produits</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.produits.total}</p>
                        <p className="text-sm text-orange-600 mt-1">{stats.produits.enAttente} à valider</p>
                      </div>
                      <div className="bg-purple-500 p-3 rounded-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Clients</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.clients.total}</p>
                        <p className="text-sm text-gray-600 mt-1">Inscrits</p>
                      </div>
                      <div className="bg-orange-500 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveView('vendors')}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Approuver les vendeurs</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {stats ? stats.vendeurs.nonVerifies : '...'} demandes en attente
                  </p>
                  <div className="text-red-600 text-sm font-medium">Voir les demandes →</div>
                </button>

                <button
                  onClick={() => setActiveView('products')}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Valider les produits</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {stats ? stats.produits.enAttente : '...'} produits à valider
                  </p>
                  <div className="text-red-600 text-sm font-medium">Gérer les produits →</div>
                </button>

                <button
                  onClick={() => setActiveView('users')}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <UserCog className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gérer les utilisateurs</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {stats ? stats.utilisateurs.total : '...'} utilisateurs au total
                  </p>
                  <div className="text-red-600 text-sm font-medium">Voir tous les utilisateurs →</div>
                </button>
              </div>

              {/* Alerts */}
              {stats && (stats.vendeurs.nonVerifies > 0 || stats.produits.enAttente > 0) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span>Actions requises</span>
                  </h3>
                  <div className="space-y-3">
                    {stats.vendeurs.nonVerifies > 0 && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="font-medium text-orange-900">{stats.vendeurs.nonVerifies} demandes vendeurs en attente</div>
                            <div className="text-sm text-orange-600">Ces demandes nécessitent votre approbation</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveView('vendors')}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                        >
                          Examiner
                        </button>
                      </div>
                    )}
                    {stats.produits.enAttente > 0 && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-purple-900">{stats.produits.enAttente} produits à valider</div>
                            <div className="text-sm text-purple-600">Produits en attente de publication</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveView('products')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'profile' && <AdminProfile />}
          {activeView === 'users' && <AdminUsers />}
          {activeView === 'vendors' && <AdminVendors />}
          {activeView === 'modes-paiement' && <AdminModesPaiement />}
          {activeView === 'products' && <AdminProducts />}
          {activeView === 'categories' && <AdminCategoriesNew />}
          {activeView === 'commissions' && <AdminCommissions />}
          {activeView === 'orders' && <AdminOrders />}
          {activeView === 'frais-livraison' && <AdminFraisLivraison />}
          {activeView === 'actualites-mode' && <AdminActualitesMode />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;





