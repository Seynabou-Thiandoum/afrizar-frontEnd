import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, User, Star } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const ContactPage = ({ onNavigate }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleWhatsAppContact = () => {
    const message = "Bonjour ! Je souhaite obtenir plus d'informations sur vos services Afizar.";
    const phoneNumber = "221123456789"; // Remplace par ton vrai numéro
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.our_info')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#F99834] bg-opacity-10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#F99834]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('contact.address')}</h3>
                    <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>{t('contact.address_value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#F99834] bg-opacity-10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#F99834]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('contact.phone')}</h3>
                    <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>{t('contact.phone_value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#F99834] bg-opacity-10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#F99834]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('contact.email')}</h3>
                    <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>{t('contact.email_value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#F99834] bg-opacity-10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#F99834]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('contact.hours')}</h3>
                    <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>
                      {t('contact.hours_value')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact rapide WhatsApp */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">{t('contact.whatsapp_title')}</h3>
                </div>
                <p className="text-green-700 mb-4">
                  {t('contact.whatsapp_desc')}
                </p>
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{t('contact.whatsapp_button')}</span>
                </button>
              </div>
            </div>

            {/* Avis clients */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce que disent nos clients</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#F99834] pl-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "Service client exceptionnel ! L'équipe Afizar est toujours à l'écoute et très réactive."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Aminata D.</p>
                </div>

                <div className="border-l-4 border-[#F99834] pl-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "J'ai eu une question sur ma commande, ils ont répondu en moins de 30 minutes. Top !"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Moussa S.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.form_title')}</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Send className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">{t('contact.success')}</h3>
                <p className="text-green-700">
                  {t('contact.subtitle')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.name')} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                        placeholder={t('contact.name')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.email')} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                        placeholder={t('contact.email_placeholder')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                      placeholder={t('contact.phone_placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.subject')} *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Information produit</option>
                    <option value="livraison">Livraison</option>
                    <option value="retour">Retour/Échange</option>
                    <option value="partenariat">Partenariat vendeur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent resize-none"
                    placeholder={t('contact.message')}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#F99834] text-white py-4 px-6 rounded-lg hover:bg-[#E5861A] transition-colors flex items-center justify-center space-x-2 font-semibold"
                >
                  <Send className="h-5 w-5" />
                  <span>{t('contact.send')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section FAQ */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Questions fréquentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Comment passer une commande ?</h3>
                <p className="text-gray-600">
                  Parcourez nos collections, ajoutez vos articles préférés au panier et suivez les étapes de commande. 
                  Vous pouvez aussi commander directement via WhatsApp.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quels sont les délais de livraison ?</h3>
                <p className="text-gray-600">
                  Livraison gratuite à Dakar sous 24-48h. Pour les autres régions du Sénégal, comptez 3-5 jours ouvrés.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je échanger un article ?</h3>
                <p className="text-gray-600">
                  Oui, vous avez 7 jours pour échanger un article non porté avec ses étiquettes d'origine.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Comment devenir vendeur partenaire ?</h3>
                <p className="text-gray-600">
                  Contactez-nous via le formulaire en sélectionnant "Partenariat vendeur" ou appelez-nous directement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Acceptez-vous les paiements mobiles ?</h3>
                <p className="text-gray-600">
                  Oui, nous acceptons Orange Money, Wave, et tous les modes de paiement mobiles populaires au Sénégal.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Les tailles correspondent-elles aux standards ?</h3>
                <p className="text-gray-600">
                  Nos vêtements sont taillés selon les mensurations africaines. Un guide des tailles est disponible sur chaque fiche produit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action final */}
        <div className="mt-16 bg-gradient-to-r from-[#F99834] to-[#E5861A] rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Une question ? Nous sommes là !</h2>
          <p className="text-lg mb-6 opacity-90">
            Notre équipe est disponible pour vous accompagner dans votre expérience Afrizar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsAppContact}
              className="px-8 py-3 bg-white text-[#F99834] rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#F99834] transition-colors font-semibold"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;