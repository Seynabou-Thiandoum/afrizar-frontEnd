import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Scissors, 
  Palette, 
  Ruler, 
  Clock, 
  Star,
  CheckCircle,
  Phone,
  MessageCircle,
  Upload,
  User,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

const SurMesure = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    style: '',
    fabric: '',
    colors: [],
    measurements: {},
    specialRequests: '',
    deadline: '',
    budget: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const steps = [
    { id: 1, title: 'Type de Vêtement', icon: Scissors },
    { id: 2, title: 'Style & Design', icon: Palette },
    { id: 3, title: 'Mesures', icon: Ruler },
    { id: 4, title: 'Finalisation', icon: CheckCircle }
  ];

  const clothingTypes = [
    {
      id: 'boubou-femme',
      name: 'Grand Boubou Femme',
      description: 'Boubou traditionnel avec broderies personnalisées',
      price: '45,000 - 85,000 FCFA',
      duration: '7-14 jours',
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'boubou-homme',
      name: 'Grand Boubou Homme',
      description: 'Boubou masculin avec finitions premium',
      price: '40,000 - 75,000 FCFA',
      duration: '7-14 jours',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'ensemble-bazin',
      name: 'Ensemble Bazin',
      description: 'Ensemble complet en bazin riche',
      price: '35,000 - 65,000 FCFA',
      duration: '5-10 jours',
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'caftan',
      name: 'Caftan Élégant',
      description: 'Caftan avec broderies perlées',
      price: '50,000 - 90,000 FCFA',
      duration: '10-15 jours',
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'costume-moderne',
      name: 'Costume Moderne',
      description: 'Costume avec motifs africains',
      price: '55,000 - 95,000 FCFA',
      duration: '10-15 jours',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'robe-moderne',
      name: 'Robe Moderne',
      description: 'Robe contemporaine en wax',
      price: '25,000 - 45,000 FCFA',
      duration: '5-8 jours',
      image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const fabrics = [
    { id: 'wax', name: 'Wax Premium', description: 'Tissu wax authentique importé' },
    { id: 'bazin', name: 'Bazin Riche', description: 'Bazin de haute qualité' },
    { id: 'soie', name: 'Soie Naturelle', description: 'Soie pure pour finitions luxe' },
    { id: 'coton', name: 'Coton Bio', description: 'Coton biologique respirant' },
    { id: 'dentelle', name: 'Dentelle Française', description: 'Dentelle fine pour détails' }
  ];

  const colors = [
    '#FF6B35', '#F97316', '#DC2626', '#B91C1C',
    '#059669', '#10B981', '#3B82F6', '#1D4ED8',
    '#7C3AED', '#A855F7', '#EC4899', '#BE185D',
    '#000000', '#374151', '#6B7280', '#F3F4F6',
    '#FFD700', '#FFA500', '#8B4513', '#800080'
  ];

  const artisans = [
    {
      id: 1,
      name: 'Atelier Fatou',
      speciality: 'Boubous Femmes Premium',
      rating: 4.9,
      orders: 156,
      location: 'Dakar',
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      name: 'Maître Ibrahima',
      speciality: 'Tenues Hommes Traditionnelles',
      rating: 4.8,
      orders: 134,
      location: 'Kaolack',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      name: 'Couture Royale',
      speciality: 'Caftans & Robes Luxe',
      rating: 4.9,
      orders: 98,
      location: 'Saint-Louis',
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const submitOrder = () => {
    console.log('Commande sur mesure:', formData);
    // Logique de soumission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Commande Sur Mesure
              </h1>
              <p className="text-gray-600 font-medium">Créez votre tenue unique avec nos artisans experts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all ${
                      activeStep >= step.id
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-600 text-white shadow-lg'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <span className={`mt-3 text-sm font-bold ${
                      activeStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full ${
                      activeStep > step.id ? 'bg-orange-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          {activeStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez le type de vêtement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clothingTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleInputChange('type', type.id)}
                    className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                      formData.type === type.id
                        ? 'ring-4 ring-orange-600 shadow-2xl'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 bg-white">
                      <h3 className="font-bold text-gray-900 mb-2">{type.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-green-600">{type.price}</span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{type.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Style et Design</h2>
                
                {/* Fabric Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choix du tissu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fabrics.map((fabric) => (
                      <label
                        key={fabric.id}
                        className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                          formData.fabric === fabric.id
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={fabric.id}
                          checked={formData.fabric === fabric.id}
                          onChange={(e) => handleInputChange('fabric', e.target.value)}
                          className="text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{fabric.name}</div>
                          <div className="text-sm text-gray-600">{fabric.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Couleurs souhaitées</h3>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`w-12 h-12 rounded-2xl border-4 transition-all transform hover:scale-110 ${
                          formData.colors.includes(color)
                            ? 'border-gray-900 scale-110 shadow-lg'
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {formData.colors.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      {formData.colors.length} couleur{formData.colors.length > 1 ? 's' : ''} sélectionnée{formData.colors.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prise de mesures</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.contactInfo.name}
                          onChange={(e) => handleContactChange('name', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleContactChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleContactChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandes spéciales</h3>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={6}
                    placeholder="Décrivez vos souhaits particuliers, broderies, motifs, etc..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                  />
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                    <h4 className="font-bold text-blue-900 mb-2">📏 Prise de mesures</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Nos artisans vous contacteront pour organiser la prise de mesures :
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• À domicile (Dakar et banlieue)</li>
                      <li>• Dans nos ateliers partenaires</li>
                      <li>• Guide de mesures par WhatsApp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalisation de votre commande</h2>
              
              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold">
                        {clothingTypes.find(t => t.id === formData.type)?.name || 'Non sélectionné'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tissu:</span>
                      <span className="font-semibold">
                        {fabrics.find(f => f.id === formData.fabric)?.name || 'Non sélectionné'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Couleurs:</span>
                      <div className="flex space-x-1">
                        {formData.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Délai souhaité</h4>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Artisans recommandés</h3>
                  <div className="space-y-4">
                    {artisans.map((artisan) => (
                      <div key={artisan.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl hover:border-orange-300 transition-colors">
                        <img
                          src={artisan.image}
                          alt={artisan.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{artisan.name}</h4>
                          <p className="text-sm text-gray-600">{artisan.speciality}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{artisan.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">{artisan.orders} commandes</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{artisan.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
            {activeStep > 1 && (
              <button
                onClick={prevStep}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Étape Précédente
              </button>
            )}
            
            <div className="ml-auto">
              {activeStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105"
                >
                  Étape Suivante
                </button>
              ) : (
                <button
                  onClick={submitOrder}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
                >
                  Envoyer la Demande
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Besoin d'aide ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-green-900 mb-2">WhatsApp</h4>
              <p className="text-green-800 text-sm mb-4">Assistance instantanée pour vos questions</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                +221 77 123 45 67
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-blue-900 mb-2">Appel Direct</h4>
              <p className="text-blue-800 text-sm mb-4">Parlez directement avec nos conseillers</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                +221 33 123 45 67
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurMesure;