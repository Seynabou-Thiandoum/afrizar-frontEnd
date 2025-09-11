import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Package, 
  Clock, 
  Award,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Calendar,
  User,
  Building,
  Heart,
  ShoppingCart,
  Eye,
  Crown,
  Truck,
  Shield
} from 'lucide-react';

const VendorDetailModal = ({ vendor, isOpen, onClose, onContact }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) return null;

  const mockProducts = [
    {
      id: 1,
      name: 'Grand Boubou Brodé Premium',
      price: 45000,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      orders: 24
    },
    {
      id: 2,
      name: 'Caftan Élégant Perlé',
      price: 52000,
      image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      orders: 18
    },
    {
      id: 3,
      name: 'Ensemble Bazin Deluxe',
      price: 38000,
      image: 'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      orders: 15
    }
  ];

  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header avec image de couverture */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={vendor.coverImage}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-2xl hover:bg-white transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>

              {/* Vendor Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end space-x-4">
                  <img
                    src={vendor.image}
                    alt={vendor.ownerName}
                    className="w-24 h-24 rounded-3xl border-4 border-white shadow-2xl object-cover"
                  />
                  <div className="flex-1 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-black">{vendor.name}</h1>
                      {vendor.verified && (
                        <div className="bg-green-500 p-2 rounded-full">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                      {vendor.featured && (
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full flex items-center space-x-1">
                          <Crown className="h-4 w-4" />
                          <span className="text-sm font-bold">Vedette</span>
                        </div>
                      )}
                    </div>
                    <p className="text-lg font-medium text-orange-200">Par {vendor.ownerName}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-bold">{vendor.rating}</span>
                        <span className="text-orange-200">({vendor.reviews} avis)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-5 w-5" />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
              <div className="flex space-x-8 px-8">
                {[
                  { id: 'about', label: 'À propos', icon: Building },
                  { id: 'products', label: 'Produits', icon: Package },
                  { id: 'reviews', label: 'Avis', icon: Star },
                  { id: 'contact', label: 'Contact', icon: MessageSquare }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-600 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Histoire de l'atelier</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">{vendor.story}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Expérience:</span>
                          <div className="font-bold text-gray-900">{vendor.experience}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Membre depuis:</span>
                          <div className="font-bold text-gray-900">{formatDate(vendor.joinDate)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Commandes:</span>
                          <div className="font-bold text-gray-900">{vendor.orders}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Gamme de prix:</span>
                          <div className="font-bold text-gray-900">{vendor.priceRange}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Spécialités</h3>
                      <div className="flex flex-wrap gap-3">
                        {vendor.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-2xl text-sm font-medium border border-orange-200"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Récompenses</h3>
                      <div className="space-y-3">
                        {vendor.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Galerie</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {vendor.gallery.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Création ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setSelectedImage(index)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Garanties</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Qualité artisanale garantie</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">Livraison sécurisée avec suivi</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                          <span className="text-gray-700">Support WhatsApp 24/7</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <span className="text-gray-700">Vendeur vérifié et certifié</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Produits de {vendor.name}</h3>
                    <span className="text-gray-600">{mockProducts.length} produits disponibles</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                            <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-red-600 hover:text-white transition-colors">
                              <Heart className="h-5 w-5" />
                            </button>
                            <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-orange-600 hover:text-white transition-colors">
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                              <ShoppingCart className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{product.orders} ventes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Avis Clients</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">{vendor.rating}</span>
                      <span className="text-gray-600">sur 5 ({vendor.reviews} avis)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        customer: 'Aminata Diallo',
                        rating: 5,
                        comment: 'Travail exceptionnel ! La qualité est au rendez-vous et les finitions sont parfaites. Je recommande vivement cet atelier.',
                        date: '2025-01-10',
                        product: 'Grand Boubou Brodé Premium'
                      },
                      {
                        customer: 'Jean-Pierre Martin',
                        rating: 5,
                        comment: 'Service client excellent et produit conforme à mes attentes. Livraison rapide et soignée.',
                        date: '2025-01-08',
                        product: 'Caftan Élégant Perlé'
                      },
                      {
                        customer: 'Marie Dubois',
                        rating: 4,
                        comment: 'Très beau travail artisanal. Quelques petits détails à améliorer mais dans l\'ensemble très satisfaite.',
                        date: '2025-01-05',
                        product: 'Ensemble Bazin Deluxe'
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900">{review.customer}</h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Produit: {review.product}</p>
                            <p className="text-gray-700 mb-2">"{review.comment}"</p>
                            <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900">{vendor.phone}</div>
                            <div className="text-sm text-gray-600">Téléphone principal</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900">{vendor.email}</div>
                            <div className="text-sm text-gray-600">Email professionnel</div>
                          </div>
                        </div>
                        {vendor.website && (
                          <div className="flex items-center space-x-3">
                            <Globe className="h-5 w-5 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">{vendor.website}</div>
                              <div className="text-sm text-gray-600">Site web</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900">{vendor.location}</div>
                            <div className="text-sm text-gray-600">Localisation de l'atelier</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Horaires et livraison</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Délai de livraison:</span>
                          <span className="font-bold text-gray-900">{vendor.deliveryTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Horaires atelier:</span>
                          <span className="font-bold text-gray-900">Lun-Sam 8h-18h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Consultation:</span>
                          <span className="font-bold text-gray-900">Sur rendez-vous</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Contacter {vendor.ownerName}</h3>
                      
                      <div className="space-y-4">
                        <button
                          onClick={() => onContact(vendor, 'whatsapp')}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <MessageSquare className="h-6 w-6" />
                          <span>WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => onContact(vendor, 'phone')}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Phone className="h-6 w-6" />
                          <span>Appeler</span>
                        </button>
                        
                        <button
                          onClick={() => onContact(vendor, 'email')}
                          className="w-full border-2 border-orange-600 text-orange-600 py-4 rounded-2xl font-bold hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Mail className="h-6 w-6" />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                      <h4 className="font-bold text-lg mb-3">Commande personnalisée</h4>
                      <p className="text-orange-100 text-sm mb-4">
                        Discutez directement avec {vendor.ownerName} pour une création sur mesure adaptée à vos besoins.
                      </p>
                      <button
                        onClick={() => onContact(vendor, 'whatsapp')}
                        className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors w-full"
                      >
                        Demander un devis
                      </button>
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

export default VendorDetailModal;