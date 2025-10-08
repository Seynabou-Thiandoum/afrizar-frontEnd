import React, { useState, useEffect } from 'react';
import adminService, { DashboardStats, Product, Vendor } from '../services/adminService';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const AdminDashboardNew: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [unverifiedVendors, setUnverifiedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'vendors'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
      
      // Charger les produits en attente
      const productsData = await adminService.getPendingProducts(0, 10);
      setPendingProducts(productsData.content);
      
      // Charger les vendeurs non vérifiés
      const vendorsData = await adminService.getUnverifiedVendors();
      setUnverifiedVendors(vendorsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setLoading(false);
    }
  };

  const handleValidateProduct = async (productId: number) => {
    if (!confirm('Voulez-vous valider ce produit ?')) return;
    
    try {
      await adminService.validateProduct(productId);
      alert('✅ Produit validé avec succès !');
      loadDashboardData();
    } catch (error: any) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  const handleRejectProduct = async (productId: number) => {
    const motif = prompt('Motif du rejet (optionnel):');
    
    try {
      await adminService.rejectProduct(productId, motif || undefined);
      alert('✅ Produit rejeté');
      loadDashboardData();
    } catch (error: any) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  const handleVerifyVendor = async (vendorId: number) => {
    if (!confirm('Voulez-vous vérifier ce vendeur ?')) return;
    
    try {
      await adminService.verifyVendor(vendorId);
      alert('✅ Vendeur vérifié avec succès !');
      loadDashboardData();
    } catch (error: any) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Administrateur</h1>
          <p className="text-gray-600">Gérez votre plateforme Afrizar</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={<Package className="w-8 h-8 text-blue-600" />}
              title="Produits"
              value={stats.produits.total}
              subtitle={`${stats.produits.enAttente} en attente`}
              color="blue"
            />
            <StatsCard
              icon={<Users className="w-8 h-8 text-green-600" />}
              title="Vendeurs"
              value={stats.vendeurs.total}
              subtitle={`${stats.vendeurs.nonVerifies} à vérifier`}
              color="green"
            />
            <StatsCard
              icon={<ShoppingBag className="w-8 h-8 text-purple-600" />}
              title="Clients"
              value={stats.clients.total}
              subtitle="Utilisateurs actifs"
              color="purple"
            />
            <StatsCard
              icon={<TrendingUp className="w-8 h-8 text-amber-600" />}
              title="Utilisateurs Actifs"
              value={stats.utilisateurs.actifs}
              subtitle={`/${stats.utilisateurs.total} total`}
              color="amber"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Produits en attente ({pendingProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vendors'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendeurs à vérifier ({unverifiedVendors.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produits en attente */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Produits en Attente</h2>
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun produit en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingProducts.slice(0, 3).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onValidate={handleValidateProduct}
                      onReject={handleRejectProduct}
                    />
                  ))}
                  {pendingProducts.length > 3 && (
                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full text-center text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Voir tous les produits →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Vendeurs non vérifiés */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Vendeurs à Vérifier</h2>
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              {unverifiedVendors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun vendeur en attente</p>
              ) : (
                <div className="space-y-4">
                  {unverifiedVendors.slice(0, 3).map(vendor => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onVerify={handleVerifyVendor}
                    />
                  ))}
                  {unverifiedVendors.length > 3 && (
                    <button
                      onClick={() => setActiveTab('vendors')}
                      className="w-full text-center text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Voir tous les vendeurs →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tous les Produits en Attente
              </h2>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Aucun produit en attente de validation</p>
              ) : (
                <div className="space-y-4">
                  {pendingProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onValidate={handleValidateProduct}
                      onReject={handleRejectProduct}
                      detailed
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tous les Vendeurs Non Vérifiés
              </h2>
              {unverifiedVendors.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Aucun vendeur en attente de vérification</p>
              ) : (
                <div className="space-y-4">
                  {unverifiedVendors.map(vendor => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onVerify={handleVerifyVendor}
                      detailed
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Components

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        {icon}
      </div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

interface ProductCardProps {
  product: Product;
  onValidate: (id: number) => void;
  onReject: (id: number) => void;
  detailed?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onValidate, onReject, detailed }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{product.nom}</h3>
        <p className="text-sm text-gray-600 mb-2">
          Vendeur: <span className="font-medium">{product.nomBoutique}</span>
        </p>
        <p className="text-lg font-bold text-amber-600">{product.prix.toLocaleString()} FCFA</p>
        {detailed && (
          <>
            <p className="text-sm text-gray-600 mt-2">Stock: {product.stock}</p>
            <p className="text-sm text-gray-500 mt-1">
              Créé le: {new Date(product.dateCreation).toLocaleDateString('fr-FR')}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 ml-4">
        <button
          onClick={() => onValidate(product.id)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Valider
        </button>
        <button
          onClick={() => onReject(product.id)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Rejeter
        </button>
      </div>
    </div>
  </div>
);

interface VendorCardProps {
  vendor: Vendor;
  onVerify: (id: number) => void;
  detailed?: boolean;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onVerify, detailed }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{vendor.nomBoutique}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {vendor.prenom} {vendor.nom}
        </p>
        <p className="text-sm text-gray-600 mb-2">{vendor.email}</p>
        {detailed && (
          <>
            <p className="text-sm text-gray-600 mb-1">Téléphone: {vendor.telephone}</p>
            <p className="text-sm text-gray-500">
              Inscrit le: {new Date(vendor.dateCreation).toLocaleDateString('fr-FR')}
            </p>
            {vendor.description && (
              <p className="text-sm text-gray-600 mt-2">{vendor.description}</p>
            )}
          </>
        )}
      </div>
      <button
        onClick={() => onVerify(vendor.id)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-4"
      >
        <CheckCircle className="w-4 h-4" />
        Vérifier
      </button>
    </div>
  </div>
);

export default AdminDashboardNew;
