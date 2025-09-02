import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Heart,
  Shield,
  Truck,
  CreditCard,
  Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-orange-500 mb-2">Afrizar.sn</h3>
              <p className="text-orange-400 text-sm font-medium">Couture Sénégalaise</p>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La première plateforme dédiée à la couture sénégalaise authentique. 
              Connectant artisans passionnés et clients du monde entier.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">+221 77 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">contact@afrizar.sn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Accueil</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Catalogue</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Tenues Femmes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Tenues Hommes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Accessoires</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Sur Mesure</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Service Client</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Mon Compte</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Suivi Commande</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Guide des Tailles</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Retours & Échanges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Devenir Vendeur</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Suivez-nous</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <h5 className="text-sm font-semibold mb-3">Informations Légales</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Conditions d'Utilisation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Mentions Légales</a></li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="font-semibold text-sm">Paiement Sécurisé</div>
                <div className="text-xs text-gray-400">Transactions protégées</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-600/20 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-sm">Livraison Mondiale</div>
                <div className="text-xs text-gray-400">Dans 30+ pays</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-sm">Multi-Paiements</div>
                <div className="text-xs text-gray-400">Orange Money, Wave, PayPal</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600/20 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold text-sm">Artisanat Authentique</div>
                <div className="text-xs text-gray-400">Fait avec passion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-2">Restez Connecté</h4>
            <p className="text-gray-400 mb-6">Recevez nos dernières collections et offres exclusives</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © {currentYear} Afrizar.sn. Tous droits réservés. Fait avec <Heart className="inline h-4 w-4 text-red-500 mx-1" /> au Sénégal.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <select className="bg-transparent text-gray-400 text-sm border-none outline-none">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="wo">Wolof</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;