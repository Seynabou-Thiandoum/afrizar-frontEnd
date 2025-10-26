import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { API_CONFIG } from '../config/api';

const SimpleApiTest = () => {
  const [testResults, setTestResults] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    data?: any;
  }>({
    status: 'idle',
    message: 'Prêt à tester la connexion API'
  });

  const testApiConnection = async () => {
    setTestResults({
      status: 'loading',
      message: 'Test de connexion en cours...'
    });

    try {
      // Test simple de connexion au backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/vendeurs/verifies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults({
          status: 'success',
          message: `Connexion réussie ! ${data.length} vendeurs vérifiés trouvés.`,
          data: data
        });
      } else {
        setTestResults({
          status: 'error',
          message: `Erreur HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    }
  };

  const getStatusIcon = () => {
    switch (testResults.status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      default:
        return <RefreshCw className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (testResults.status) {
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Test de Connexion API</h2>
            <p className="text-gray-600">Test simple de connectivité avec le backend</p>
          </div>
          
          <button
            onClick={testApiConnection}
            disabled={testResults.status === 'loading'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${testResults.status === 'loading' ? 'animate-spin' : ''}`} />
            <span>Tester la connexion</span>
          </button>
        </div>

        <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-gray-900">Statut de la connexion</h3>
              <p className="text-sm text-gray-600">{testResults.message}</p>
            </div>
          </div>
          
          {testResults.data && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Données reçues:</h4>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(testResults.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Configuration</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>URL de l'API:</strong> {API_CONFIG.BASE_URL}</div>
            <div><strong>Endpoint testé:</strong> /api/vendeurs/verifies</div>
            <div><strong>Méthode:</strong> GET</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleApiTest;
