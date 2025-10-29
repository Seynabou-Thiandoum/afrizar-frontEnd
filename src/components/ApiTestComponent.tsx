import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Server, 
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { VendorService } from '../services/vendorService';
import { useVendorStats, useVerifiedVendors, useFeaturedVendors } from '../hooks/useVendors';
import { API_CONFIG } from '../config/api';

interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'loading' | 'pending';
  message: string;
  data?: any;
  error?: string;
  responseTime?: number;
}

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  // Hooks pour tester les requêtes
  const statsQuery = useVendorStats();
  const verifiedVendorsQuery = useVerifiedVendors();
  const featuredVendorsQuery = useFeaturedVendors();

  const testEndpoints = [
    {
      name: 'Statistiques globales',
      test: async () => {
        const startTime = Date.now();
        try {
          const data = await VendorService.getGlobalStats();
          return {
            endpoint: 'GET /api/vendeurs/statistiques-globales',
            status: 'success' as const,
            message: 'Statistiques récupérées avec succès',
            data,
            responseTime: Date.now() - startTime
          };
        } catch (error) {
          return {
            endpoint: 'GET /api/vendeurs/statistiques-globales',
            status: 'error' as const,
            message: 'Erreur lors de la récupération des statistiques',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            responseTime: Date.now() - startTime
          };
        }
      }
    },
    {
      name: 'Vendeurs vérifiés',
      test: async () => {
        const startTime = Date.now();
        try {
          const data = await VendorService.getVerifiedVendors();
          return {
            endpoint: 'GET /api/vendeurs/verifies',
            status: 'success' as const,
            message: `${data.length} vendeurs vérifiés trouvés`,
            data: { count: data.length },
            responseTime: Date.now() - startTime
          };
        } catch (error) {
          return {
            endpoint: 'GET /api/vendeurs/verifies',
            status: 'error' as const,
            message: 'Erreur lors de la récupération des vendeurs vérifiés',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            responseTime: Date.now() - startTime
          };
        }
      }
    },
    {
      name: 'Vendeurs vedettes',
      test: async () => {
        const startTime = Date.now();
        try {
          const data = await VendorService.getFeaturedVendors();
          return {
            endpoint: 'GET /api/vendeurs/vedettes',
            status: 'success' as const,
            message: `${data.length} vendeurs vedettes trouvés`,
            data: { count: data.length },
            responseTime: Date.now() - startTime
          };
        } catch (error) {
          return {
            endpoint: 'GET /api/vendeurs/vedettes',
            status: 'error' as const,
            message: 'Erreur lors de la récupération des vendeurs vedettes',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            responseTime: Date.now() - startTime
          };
        }
      }
    },
    {
      name: 'Liste des vendeurs (pagination)',
      test: async () => {
        const startTime = Date.now();
        try {
          const data = await VendorService.getVendors({ page: 0, size: 5 });
          return {
            endpoint: 'GET /api/vendeurs?page=0&size=5',
            status: 'success' as const,
            message: `${data.content.length} vendeurs récupérés (${data.totalElements} au total)`,
            data: { 
              currentPage: data.number,
              totalPages: data.totalPages,
              totalElements: data.totalElements,
              currentElements: data.content.length
            },
            responseTime: Date.now() - startTime
          };
        } catch (error) {
          return {
            endpoint: 'GET /api/vendeurs?page=0&size=5',
            status: 'error' as const,
            message: 'Erreur lors de la récupération de la liste des vendeurs',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            responseTime: Date.now() - startTime
          };
        }
      }
    },
    {
      name: 'Vérification email',
      test: async () => {
        const startTime = Date.now();
        try {
          const data = await VendorService.checkEmailAvailability('test@example.com');
          return {
            endpoint: 'GET /api/vendeurs/email/test@example.com/disponible',
            status: 'success' as const,
            message: `Email test@example.com ${data ? 'disponible' : 'non disponible'}`,
            data: { available: data },
            responseTime: Date.now() - startTime
          };
        } catch (error) {
          return {
            endpoint: 'GET /api/vendeurs/email/test@example.com/disponible',
            status: 'error' as const,
            message: 'Erreur lors de la vérification de l\'email',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            responseTime: Date.now() - startTime
          };
        }
      }
    }
  ];

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    setOverallStatus('unknown');

    const results: ApiTestResult[] = [];

    for (const test of testEndpoints) {
      // Marquer comme en cours
      const loadingResult: ApiTestResult = {
        endpoint: test.name,
        status: 'loading',
        message: 'Test en cours...'
      };
      
      setTestResults([...results, loadingResult]);

      // Exécuter le test
      const result = await test.test();
      results.push(result);
      setTestResults([...results]);
    }

    // Déterminer le statut global
    const hasErrors = results.some(r => r.status === 'error');
    const hasSuccess = results.some(r => r.status === 'success');
    
    if (hasSuccess && !hasErrors) {
      setOverallStatus('connected');
    } else if (hasErrors && !hasSuccess) {
      setOverallStatus('disconnected');
    } else {
      setOverallStatus('connected'); // Partiellement connecté
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'connected':
        return <Wifi className="h-6 w-6 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="h-6 w-6 text-red-500" />;
      default:
        return <Server className="h-6 w-6 text-gray-500" />;
    }
  };

  const getOverallStatusText = () => {
    switch (overallStatus) {
      case 'connected':
        return 'API Connectée';
      case 'disconnected':
        return 'API Déconnectée';
      default:
        return 'Statut Inconnu';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test de Connexion API</h2>
              <p className="text-gray-600">Vérification de la connectivité avec le backend</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getOverallStatusIcon()}
              <span className={`font-medium ${
                overallStatus === 'connected' ? 'text-green-600' :
                overallStatus === 'disconnected' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {getOverallStatusText()}
              </span>
            </div>
            
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Test en cours...' : 'Lancer les tests'}</span>
            </button>
          </div>
        </div>

        {/* Informations de configuration */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Configuration API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">URL de base:</span>
              <span className="ml-2 text-gray-600">{API_CONFIG.BASE_URL}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Endpoint vendeurs:</span>
              <span className="ml-2 text-gray-600">/api/vendeurs</span>
            </div>
          </div>
        </div>

        {/* Résultats des tests */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Résultats des Tests</h3>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Server className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun test exécuté. Cliquez sur "Lancer les tests" pour commencer.</p>
            </div>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{result.endpoint}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">Erreur: {result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  {result.responseTime && (
                    <div className="text-sm text-gray-500">
                      {result.responseTime}ms
                    </div>
                  )}
                </div>
                
                {result.data && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Données reçues:</h5>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Informations sur les hooks React Query */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">État des Hooks React Query</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                statsQuery.isLoading ? 'bg-blue-500' :
                statsQuery.isError ? 'bg-red-500' :
                statsQuery.isSuccess ? 'bg-green-500' :
                'bg-gray-400'
              }`} />
              <span>Statistiques: {statsQuery.isLoading ? 'Chargement' : statsQuery.isError ? 'Erreur' : 'OK'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                verifiedVendorsQuery.isLoading ? 'bg-blue-500' :
                verifiedVendorsQuery.isError ? 'bg-red-500' :
                verifiedVendorsQuery.isSuccess ? 'bg-green-500' :
                'bg-gray-400'
              }`} />
              <span>Vendeurs vérifiés: {verifiedVendorsQuery.isLoading ? 'Chargement' : verifiedVendorsQuery.isError ? 'Erreur' : 'OK'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                featuredVendorsQuery.isLoading ? 'bg-blue-500' :
                featuredVendorsQuery.isError ? 'bg-red-500' :
                featuredVendorsQuery.isSuccess ? 'bg-green-500' :
                'bg-gray-400'
              }`} />
              <span>Vendeurs vedettes: {featuredVendorsQuery.isLoading ? 'Chargement' : featuredVendorsQuery.isError ? 'Erreur' : 'OK'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;
