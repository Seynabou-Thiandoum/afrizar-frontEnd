import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Building,
  Award,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const VendorApprovalModal = ({ vendor, onClose, onAction }) => {
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  const rejectionReasons = [
    'Documentation incomplète',
    'Qualité des produits insuffisante',
    'Informations commerciales manquantes',
    'Portfolio non conforme',
    'Coordonnées invalides',
    'Autre (préciser ci-dessous)'
  ];

  const handleApprove = () => {
    onAction('approve', {
      vendorId: vendor.id,
      notes: approvalNotes,
      approvedAt: new Date().toISOString()
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez sélectionner une raison de rejet');
      return;
    }
    
    onAction('reject', {
      vendorId: vendor.id,
      reason: rejectionReason,
      rejectedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-orange-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Approbation Vendeur
                </h2>
                <p className="text-gray-600 font-medium">{vendor.businessName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations vendeur */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations du vendeur</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Nom:</span>
                      <span className="font-medium">{vendor.firstName} {vendor.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium">{vendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Téléphone:</span>
                      <span className="font-medium">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Adresse:</span>
                      <span className="font-medium">{vendor.address}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Atelier:</span>
                      <span className="font-medium text-orange-600">{vendor.businessName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Expérience:</span>
                      <span className="font-medium">{vendor.experience}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Spécialités:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.specialties?.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description de l'activité</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-xl text-sm leading-relaxed">
                    {vendor.businessDescription}
                  </p>
                </div>
              </div>

              {/* Portfolio */}
              {vendor.portfolio && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.portfolio.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {!actionType ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActionType('approve')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Approuver ce Vendeur</span>
                  </button>
                  <button
                    onClick={() => setActionType('reject')}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-red-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-6 w-6" />
                    <span>Rejeter la Demande</span>
                  </button>
                </div>
              ) : actionType === 'approve' ? (
                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approuver le vendeur
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-2">Notes d'approbation (optionnel)</label>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="Notes internes sur l'approbation..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                      >
                        Confirmer l'approbation
                      </button>
                      <button
                        onClick={() => setActionType(null)}
                        className="px-6 border border-green-300 text-green-700 py-3 rounded-xl font-medium hover:bg-green-50 transition-colors"
                      >
                        Retour
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-2xl p-6">
                  <h4 className="font-bold text-red-900 mb-4 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Rejeter la demande
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">Raison du rejet</label>
                      <select
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Sélectionnez une raison</option>
                        {rejectionReasons.map((reason) => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>
                    {rejectionReason === 'Autre (préciser ci-dessous)' && (
                      <div>
                        <label className="block text-sm font-medium text-red-800 mb-2">Précisions</label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500"
                          placeholder="Précisez la raison du rejet..."
                        />
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                      >
                        Confirmer le rejet
                      </button>
                      <button
                        onClick={() => setActionType(null)}
                        className="px-6 border border-red-300 text-red-700 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
                      >
                        Retour
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

export default VendorApprovalModal;