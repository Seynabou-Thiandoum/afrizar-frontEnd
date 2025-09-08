import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  AlertCircle,
  Crown,
  Shield,
  Building
} from 'lucide-react';

const UserManagementModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'client',
    status: user?.status || 'active',
    businessName: user?.businessName || '',
    address: user?.address || ''
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'client', label: 'Client', description: 'Utilisateur standard' },
    { value: 'vendor', label: 'Vendeur', description: 'Artisan vendeur' },
    { value: 'support', label: 'Support', description: 'Agent de support' },
    { value: 'admin', label: 'Administrateur', description: 'Accès complet' }
  ];

  const statuses = [
    { value: 'active', label: 'Actif', color: 'text-green-600' },
    { value: 'inactive', label: 'Inactif', color: 'text-gray-600' },
    { value: 'suspended', label: 'Suspendu', color: 'text-red-600' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (formData.role === 'vendor' && !formData.businessName.trim()) {
      newErrors.businessName = 'Nom d\'atelier requis pour les vendeurs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: user?.id || Date.now(),
        isNew: !user
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-gradient-to-br from-red-50 to-pink-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-red-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                  {user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                </h2>
                <p className="text-gray-600 font-medium">Gestion des comptes utilisateurs</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+221 77 123 45 67"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Dakar, Sénégal"
                    />
                  </div>
                </div>
              </div>

              {/* Rôle et statut */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rôle et permissions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Rôle</label>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <label
                          key={role.value}
                          className={`flex items-center p-3 border-2 rounded-2xl cursor-pointer transition-all ${
                            formData.role === role.value
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className="text-red-600 focus:ring-red-500 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{role.label}</div>
                            <div className="text-sm text-gray-600">{role.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Statut</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.role === 'vendor' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'atelier</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.businessName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Atelier Fatou"
                      />
                    </div>
                    {errors.businessName && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.businessName}</span>
                      </div>
                    )}
                  </div>
                )}
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
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-red-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{user ? 'Mettre à jour' : 'Créer l\'utilisateur'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;