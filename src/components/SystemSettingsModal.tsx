import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  DollarSign, 
  Truck, 
  Shield, 
  Bell,
  Save,
  AlertCircle,
  Info
} from 'lucide-react';

const SystemSettingsModal = ({ onClose, onSave }) => {
  const [settings, setSettings] = useState({
    // Commission rates
    commissionLow: 10,
    commissionMid: 8,
    commissionHigh: 6,
    
    // Shipping rates Senegal
    senegalBaseRate: 1000,
    senegalPerKg: 500,
    senegalExpressBase: 2000,
    senegalExpressPerKg: 1000,
    
    // Shipping rates International
    internationalBaseRate: 10000,
    internationalPerKg: 3000,
    
    // Platform settings
    maintenanceMode: false,
    newVendorRegistration: true,
    autoApproveProducts: false,
    emailNotifications: true,
    smsNotifications: true,
    
    // Security
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireEmailVerification: true
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Paramètres Système
                </h2>
                <p className="text-gray-600 font-medium">Configuration de la plateforme</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Commission Settings */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Barème des Commissions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moins de 10,000 FCFA
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.commissionLow}
                        onChange={(e) => handleInputChange('commissionLow', parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      10,000 - 30,000 FCFA
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.commissionMid}
                        onChange={(e) => handleInputChange('commissionMid', parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plus de 30,000 FCFA
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.commissionHigh}
                        onChange={(e) => handleInputChange('commissionHigh', parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Settings */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Tarifs de Livraison
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sénégal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tarif de base</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={settings.senegalBaseRate}
                            onChange={(e) => handleInputChange('senegalBaseRate', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">FCFA</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Par kg</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={settings.senegalPerKg}
                            onChange={(e) => handleInputChange('senegalPerKg', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">FCFA</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">International</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tarif de base</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={settings.internationalBaseRate}
                            onChange={(e) => handleInputChange('internationalBaseRate', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">FCFA</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Par kg</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={settings.internationalPerKg}
                            onChange={(e) => handleInputChange('internationalPerKg', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">FCFA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Settings */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  Paramètres de la Plateforme
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Mode maintenance</div>
                      <div className="text-sm text-gray-600">Désactiver temporairement la plateforme</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Inscription vendeurs</div>
                      <div className="text-sm text-gray-600">Permettre les nouvelles inscriptions</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.newVendorRegistration}
                        onChange={(e) => handleInputChange('newVendorRegistration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Auto-approbation produits</div>
                      <div className="text-sm text-gray-600">Approuver automatiquement les nouveaux produits</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoApproveProducts}
                        onChange={(e) => handleInputChange('autoApproveProducts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Sécurité
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentatives de connexion max
                    </label>
                    <input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="3"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout session (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="15"
                      max="120"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Vérification email obligatoire</div>
                      <div className="text-sm text-gray-600">Exiger la vérification email pour nouveaux comptes</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireEmailVerification}
                        onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Notifications email</div>
                      <div className="text-sm text-gray-600">Envoyer les notifications par email</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Notifications SMS</div>
                      <div className="text-sm text-gray-600">Envoyer les notifications par SMS</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-medium mb-1">Attention</div>
                    <div>Les modifications des paramètres système affectent tous les utilisateurs de la plateforme. Assurez-vous de tester en environnement de développement avant d'appliquer en production.</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Sauvegarder les Paramètres</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsModal;