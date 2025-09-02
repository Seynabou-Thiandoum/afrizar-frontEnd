import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone,
  MapPin,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Auth = ({ onClose, initialMode = 'login' }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'vendor-register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    businessName: '',
    businessDescription: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères';
    }

    if (mode !== 'login') {
      if (!formData.firstName) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName) newErrors.lastName = 'Nom requis';
      if (!formData.phone) newErrors.phone = 'Téléphone requis';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      if (mode === 'vendor-register') {
        if (!formData.businessName) newErrors.businessName = 'Nom de l\'atelier requis';
        if (!formData.businessDescription) newErrors.businessDescription = 'Description requise';
        if (!formData.address) newErrors.address = 'Adresse requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setLoginError('');
    
    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setLoginError('Email ou mot de passe incorrect');
        }
      } else if (mode === 'register') {
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Inscription client:', formData);
        onClose();
      } else {
        // Simulate vendor registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Inscription vendeur:', formData);
        onClose();
      }
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' && 'Connexion'}
                  {mode === 'register' && 'Créer un compte'}
                  {mode === 'vendor-register' && 'Devenir vendeur'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {mode === 'login' && 'Connectez-vous à votre compte'}
                  {mode === 'register' && 'Rejoignez la communauté Afrizar'}
                  {mode === 'vendor-register' && 'Vendez vos créations'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {mode !== 'login' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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

              {mode !== 'login' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+221 77 123 45 67"
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {mode === 'vendor-register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'atelier</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Atelier Fatou"
                    />
                    {errors.businessName && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.businessName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description de votre activité</label>
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Spécialisé dans les boubous traditionnels..."
                    />
                    {errors.businessDescription && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.businessDescription}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de l'atelier</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Dakar, Sénégal"
                      />
                    </div>
                    {errors.address && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.address}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {mode !== 'login' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              )}

              {mode === 'login' && loginError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{loginError}</span>
                </div>
              )}

              {errors.submit && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{errors.submit}</span>
                </div>
              )}

              {mode === 'login' && (
                <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-bold text-blue-900 mb-2">Comptes de démonstration :</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div><strong>Client:</strong> client@afrizar.sn</div>
                    <div><strong>Vendeur:</strong> vendor@afrizar.sn</div>
                    <div><strong>Support:</strong> support@afrizar.sn</div>
                    <div><strong>Admin:</strong> admin@afrizar.sn</div>
                    <div><strong>Développeur:</strong> dev@afrizar.sn</div>
                    <div><strong>Fondateur:</strong> founder@afrizar.sn</div>
                    <div className="mt-2"><strong>Mot de passe:</strong> demo123</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </div>
                ) : (
                  <>
                    {mode === 'login' && 'Se connecter'}
                    {mode === 'register' && 'Créer mon compte'}
                    {mode === 'vendor-register' && 'Devenir vendeur'}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-6">
              {mode === 'login' ? (
                <div className="text-center space-y-3">
                  <button
                    onClick={() => setMode('register')}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Pas encore de compte ? Inscrivez-vous
                  </button>
                  <div className="text-gray-400 text-sm">ou</div>
                  <button
                    onClick={() => setMode('vendor-register')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Vous êtes artisan ? Devenez vendeur
                  </button>
                </div>
              ) : mode === 'register' ? (
                <div className="text-center space-y-3">
                  <button
                    onClick={() => setMode('login')}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Déjà un compte ? Connectez-vous
                  </button>
                  <div className="text-gray-400 text-sm">ou</div>
                  <button
                    onClick={() => setMode('vendor-register')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Vous êtes artisan ? Devenez vendeur
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => setMode('login')}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Retour à la connexion
                  </button>
                </div>
              )}

              {mode === 'vendor-register' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-medium">Avantages vendeur:</div>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Tableau de bord complet</li>
                        <li>• Commission attractive</li>
                        <li>• Support dédié</li>
                        <li>• Visibilité internationale</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;