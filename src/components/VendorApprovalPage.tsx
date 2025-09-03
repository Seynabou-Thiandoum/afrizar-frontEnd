import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Eye,
  MessageSquare,
  AlertTriangle,
  Award,
  Building,
  Globe
} from 'lucide-react';

const VendorApprovalPage = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [filter, setFilter] = useState('pending');

  const pendingVendors = [
    {
      id: 1,
      firstName: 'Khadija',
      lastName: 'Diop',
      email: 'khadija@atelierkhadija.sn',
      phone: '+221 77 987 65 43',
      businessName: 'Atelier Khadija',
      businessDescription: 'Spécialisée dans la création de boubous traditionnels pour femmes avec broderies dorées et perles. Plus de 10 ans d\'expérience dans la couture sénégalaise.',
      address: 'Médina, Dakar, Sénégal',
      website: 'www.atelierkhadija.sn',
      experience: '10 ans',
      specialties: ['Boubous femmes', 'Broderies dorées', 'Perles traditionnelles'],
      submittedAt: '2025-01-15 14:30',
      status: 'pending',
      documents: ['Carte d\'identité', 'Registre de commerce', 'Photos atelier'],
      portfolio: [
        'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    },
    {
      id: 2,
      firstName: 'Mamadou',
      lastName: 'Thiam',
      email: 'mamadou@couturetradition.sn',
      phone: '+221 78 123 45 67',
      businessName: 'Couture Tradition',
      businessDescription: 'Atelier familial spécialisé dans les tenues masculines traditionnelles. Transmission du savoir-faire de père en fils depuis 3 générations.',
      address: 'Kaolack, Sénégal',
      website: '',
      experience: '15 ans',
      specialties: ['Boubous hommes', 'Costumes traditionnels', 'Broderies masculines'],
      submittedAt: '2025-01-14 09:15',
      status: 'pending',
      documents: ['Carte d\'identité', 'Attestation artisan'],
      portfolio: [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    },
    {
      id: 3,
      firstName: 'Aïssatou',
      lastName: 'Ba',
      email: 'aissatou@bijouxmodernes.sn',
      phone: '+221 76 555 44 33',
      businessName: 'Bijoux Modernes',
      businessDescription: 'Création de bijoux contemporains inspirés des traditions sénégalaises. Utilisation de matériaux locaux et techniques modernes.',
      address: 'Thiès, Sénégal',
      website: 'www.bijouxmodernes.sn',
      experience: '7 ans',
      specialties: ['Bijoux contemporains', 'Matériaux locaux', 'Design moderne'],
      submittedAt: '2025-01-13 16:45',
      status: 'pending',
      documents: ['Carte d\'identité', 'Portfolio', 'Certificat formation'],
      portfolio: [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1927248/pexels-photo-1927248.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    }
  ];

  const approvedVendors = [
    {
      id: 4,
      firstName: 'Fatou',
      lastName: 'Sall',
      email: 'fatou@atelierfatou.sn',
      businessName: 'Atelier Fatou',
      approvedAt: '2024-12-20 10:30',
      status: 'approved',
      products: 24,
      revenue: 1200000
    }
  ];

  const rejectedVendors = [
    {
      id: 5,
      firstName: 'Omar',
      lastName: 'Ndiaye',
      email: 'omar@test.sn',
      businessName: 'Test Atelier',
      rejectedAt: '2025-01-10 15:20',
      status: 'rejected',
      reason: 'Documentation incomplète'
    }
  ];

  const handleApprove = (vendorId) => {
    console.log('Approuver vendeur:', vendorId);
    // Logique d'approbation
  };

  const handleReject = (vendorId, reason) => {
    console.log('Rejeter vendeur:', vendorId, 'Raison:', reason);
    // Logique de rejet
  };

  const getFilteredVendors = () => {
    switch (filter) {
      case 'pending':
        return pendingVendors;
      case 'approved':
        return approvedVendors;
      case 'rejected':
        return rejectedVendors;
      default:
        return [...pendingVendors, ...approvedVendors, ...rejectedVendors];
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };
    return icons[status] || Clock;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Vendeurs</h1>
              <p className="text-gray-600 mt-1">Approuvez et gérez les demandes de vendeurs</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { value: 'pending', label: 'En attente', count: pendingVendors.length },
                  { value: 'approved', label: 'Approuvés', count: approvedVendors.length },
                  { value: 'rejected', label: 'Rejetés', count: rejectedVendors.length }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vendors List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {getFilteredVendors().map((vendor) => {
                const StatusIcon = getStatusIcon(vendor.status);
                return (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {vendor.firstName} {vendor.lastName}
                            </h3>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="capitalize">{vendor.status === 'pending' ? 'En attente' : vendor.status === 'approved' ? 'Approuvé' : 'Rejeté'}</span>
                            </span>
                          </div>
                          <p className="text-orange-600 font-semibold mb-2">{vendor.businessName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{vendor.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{vendor.phone}</span>
                            </div>
                          </div>
                          {vendor.status === 'pending' && (
                            <p className="text-gray-700 text-sm line-clamp-2">{vendor.businessDescription}</p>
                          )}
                          {vendor.status === 'approved' && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{vendor.products} produits</span>
                              <span>•</span>
                              <span>{new Intl.NumberFormat('fr-FR').format(vendor.revenue)} FCFA de CA</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {vendor.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(vendor.id);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approuver</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(vendor.id, 'Raison du rejet');
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Rejeter</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vendor Details */}
          <div className="lg:col-span-1">
            {selectedVendor ? (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Détails du Vendeur</h3>
                  <button
                    onClick={() => setSelectedVendor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{selectedVendor.firstName} {selectedVendor.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedVendor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedVendor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedVendor.address}</span>
                      </div>
                      {selectedVendor.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span>{selectedVendor.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations professionnelles</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Nom de l'atelier</label>
                        <p className="font-medium text-orange-600">{selectedVendor.businessName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Expérience</label>
                        <p className="font-medium">{selectedVendor.experience}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Spécialités</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVendor.specialties?.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Description</label>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedVendor.businessDescription}</p>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio */}
                  {selectedVendor.portfolio && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Portfolio</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedVendor.portfolio.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Documents fournis</h4>
                    <div className="space-y-2">
                      {selectedVendor.documents?.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedVendor.status === 'pending' && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleApprove(selectedVendor.id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Approuver ce vendeur</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedVendor.id, 'Raison du rejet')}
                        className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-5 w-5" />
                        <span>Rejeter la demande</span>
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Contacter le vendeur</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center sticky top-24">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez un vendeur</h3>
                <p className="text-gray-600 text-sm">Cliquez sur un vendeur pour voir ses détails et gérer sa demande</p>
                
                {filter === 'pending' && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium text-sm">
                        {pendingVendors.length} demande{pendingVendors.length > 1 ? 's' : ''} en attente
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorApprovalPage;