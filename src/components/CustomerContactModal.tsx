import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send,
  Clock,
  Package,
  Star,
  AlertCircle
} from 'lucide-react';

const CustomerContactModal = ({ customer, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    method: 'email' // email, sms, whatsapp
  });

  const [errors, setErrors] = useState({});

  const contactMethods = [
    {
      value: 'email',
      label: 'Email',
      description: 'Envoi par email',
      icon: Mail,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      value: 'sms',
      label: 'SMS',
      description: 'Message texte',
      icon: Phone,
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp',
      description: 'Message WhatsApp',
      icon: MessageSquare,
      color: 'from-green-600 to-green-700'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'Urgent', color: 'text-red-600' }
  ];

  const messageTemplates = [
    {
      subject: 'Mise à jour de votre commande',
      message: 'Bonjour,\n\nNous vous contactons concernant votre commande. Votre produit est en cours de préparation et sera expédié sous peu.\n\nCordialement,\nL\'équipe Atelier'
    },
    {
      subject: 'Produit de nouveau en stock',
      message: 'Bonne nouvelle !\n\nLe produit que vous aviez consulté est maintenant disponible. N\'hésitez pas à passer commande.\n\nCordialement,\nL\'équipe Atelier'
    },
    {
      subject: 'Offre spéciale personnalisée',
      message: 'Bonjour,\n\nNous avons une offre spéciale qui pourrait vous intéresser sur nos dernières créations.\n\nCordialement,\nL\'équipe Atelier'
    },
    {
      subject: 'Demande de retour d\'expérience',
      message: 'Bonjour,\n\nNous espérons que vous êtes satisfait(e) de votre achat. Votre avis nous aiderait beaucoup à améliorer nos services.\n\nCordialement,\nL\'équipe Atelier'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Sujet requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSend({
        customer,
        ...formData,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Mock customer data
  const customerData = {
    name: customer,
    email: 'client@example.com',
    phone: '+221 77 123 45 67',
    lastOrder: '2025-01-15',
    totalOrders: 3,
    totalSpent: 125000
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Contacter le Client
                </h2>
                <p className="text-gray-600 font-medium">Communication directe avec {customerData.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Informations client</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{customerData.name}</div>
                      <div className="text-sm text-gray-600">Client depuis 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{customerData.email}</div>
                      <div className="text-sm text-gray-600">Email principal</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{customerData.totalOrders} commandes</div>
                      <div className="text-sm text-gray-600">Dernière: {customerData.lastOrder}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <div>
                      <div className="font-medium text-gray-900">{customerData.totalSpent.toLocaleString()} FCFA</div>
                      <div className="text-sm text-gray-600">Total dépensé</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modèles de messages */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Modèles de messages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {messageTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors"
                    >
                      <div className="font-medium text-blue-900 mb-1">{template.subject}</div>
                      <div className="text-sm text-blue-700 line-clamp-2">
                        {template.message.substring(0, 80)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire de message */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Méthode de contact */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Méthode de contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {contactMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <label
                          key={method.value}
                          className={`flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                            formData.method === method.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={method.value}
                            checked={formData.method === method.value}
                            onChange={(e) => handleInputChange('method', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mb-3`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="font-bold text-gray-900">{method.label}</div>
                          <div className="text-sm text-gray-600 text-center">{method.description}</div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Objet de votre message"
                      />
                      {errors.subject && (
                        <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.subject}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Rédigez votre message..."
                      />
                      {errors.message && (
                        <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
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
                    <Send className="h-5 w-5" />
                    <span>Envoyer le Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerContactModal;