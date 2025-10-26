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
  Globe,
  Crown
} from 'lucide-react';

// Import des icônes custom pour TikTok, Snapchat, WhatsApp et LinkedIn
const TikTokIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.031c0 .114.032.187.066.268.189.501.551 1.086.938 1.58.138.18.323.378.51.594.297.333.604.678.863 1.088.39.617.625 1.314.125 1.905a.96.96 0 01-.17.21c-.327.348-.868.542-1.28.643-.132.033-.265.055-.4.078-.272.045-.554.091-.81.196a.878.878 0 00-.532.609c-.053.22-.057.454-.02.69.033.212.103.432.113.698a3.965 3.965 0 01-.262 1.623c-.095.262-.21.518-.365.756a.895.895 0 01-.218.219 5.84 5.84 0 01-1.232.584c-.158.056-.323.1-.5.135-.224.047-.455.086-.687.116a.894.894 0 01-.771-.28 1.05 1.05 0 01-.212-.337c-.081-.196-.063-.325-.048-.44l.017-.128c.034-.202.083-.402.117-.607a9.67 9.67 0 00.077-1.38c0-.399-.01-.789-.038-1.188-.06-.854-.142-1.762-.443-2.597-.569-1.589-1.715-2.915-3.164-3.654-1.5-.766-3.3-.83-4.98-.417-.38.093-.793.22-1.116.442-.32.216-.593.517-.747.87-.028.064-.053.129-.073.196-.06.203-.08.424-.024.625.284 1.009 1.139 1.59 2.013 1.809.9.223 1.857.177 2.726.201.49.014.913.182 1.32.376.408.193.794.402 1.21.52.508.146.947.103 1.45.005.847-.165 1.628-.463 2.378-.857.145-.076.3-.157.46-.228.18-.078.376-.127.563-.19.23-.078.452-.162.64-.307.11-.085.2-.195.259-.323.03-.066.05-.135.06-.204.02-.138.01-.255-.022-.392-.06-.249-.2-.509-.394-.704-.15-.15-.333-.26-.536-.322a1.986 1.986 0 00-.837-.059c-.461.045-.87.283-1.214.576-.343.294-.644.635-.99.913a4.88 4.88 0 01-2.14.96c-.77.133-1.57.12-2.337-.052a4.98 4.98 0 01-3.03-1.95A5.235 5.235 0 01.61 9.638a.898.898 0 01.05-.862c.08-.138.193-.257.332-.341.14-.085.3-.13.458-.144.091-.008.183-.012.275-.012h.28c-.022-.1-.052-.198-.075-.3-.073-.333-.128-.678-.122-1.024.005-.263.024-.525.062-.784a.956.956 0 01.035-.164C2.598 3.846 5.716.793 12.206.793z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { useI18n } from '../contexts/InternationalizationContext';

const Footer = ({ onNavigate }) => {
  const { t, formatPrice } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Crown className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Afrizar
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {t('footer.about_text')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://www.facebook.com/share/16ATK1dszJ/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-600 p-3 rounded-full transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                
                <a 
                  href="https://www.instagram.com/afrizar_sn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-pink-600 p-3 rounded-full transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                
                <a 
                  href="https://x.com/afrizar_sn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-400 p-3 rounded-full transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                
                <a 
                  href="http://www.tiktok.com/@afrizarsenegal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-black p-3 rounded-full transition-colors"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>
                
                <a 
                  href="https://snapchat.com/t/CrZ6DQpl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-yellow-400 p-3 rounded-full transition-colors"
                  title="Snapchat"
                >
                  <SnapchatIcon />
                </a>
                
                <a 
                  href="https://wa.me/221710320404" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
                
                <a 
                  href="https://www.linkedin.com/company/afrizar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-700 p-3 rounded-full transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
              {/* <div className="flex space-x-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                  <Instagram className="h-5 w-5" />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
              </div> */}
              
            </div>

            {/* Liens Rapides */}
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.quick_links')}</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('home')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    {t('home')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('vetements')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    {t('clothes')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('accessoires')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    {t('accessories')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('vendeurs')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    {t('vendors')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('tendances')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    À la mode
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('contact')} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-left"
                  >
                    {t('contact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-orange-500" />
                  +221 71 032 04 04
                </li>
                <li className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-orange-500" />
                  help@afrizar.com
                </li>
                <li className="flex items-start text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-orange-500 mt-1" />
                  Dakar, Sénégal
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Afrizar.sn. {t('footer.copyright').split('©')[1]?.split('Afrizar')[1] || 'Tous droits réservés.'}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button 
                  onClick={() => onNavigate && onNavigate('home')} 
                  className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
                >
                  {t('footer.privacy')}
                </button>
                <button 
                  onClick={() => onNavigate && onNavigate('home')} 
                  className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
                >
                  {t('footer.terms')}
                </button>
                <button 
                  onClick={() => onNavigate && onNavigate('contact')} 
                  className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
                >
                  {t('footer.legal')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    // <footer className="bg-gray-900 text-white">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     {/* Main Footer Content */}
    //     <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //       {/* Company Info */}
    //       <div className="lg:col-span-1">
    //         <div className="mb-6">
    //           <h3 className="text-2xl font-bold text-orange-500 mb-2">Afrizar.sn</h3>
    //           <p className="text-orange-400 text-sm font-medium">Couture Sénégalaise</p>
    //         </div>
    //         <p className="text-gray-300 mb-6 leading-relaxed">
    //           La première plateforme dédiée à la couture sénégalaise authentique. 
    //           Connectant artisans passionnés et clients du monde entier.
    //         </p>
            
    //         <div className="space-y-3">
    //           <div className="flex items-center space-x-3">
    //             <MapPin className="h-5 w-5 text-orange-500" />
    //             <span className="text-gray-300">Dakar, Sénégal</span>
    //           </div>
    //           <div className="flex items-center space-x-3">
    //             <Phone className="h-5 w-5 text-orange-500" />
    //             <span className="text-gray-300">+221 77 123 45 67</span>
    //           </div>
    //           <div className="flex items-center space-x-3">
    //             <Mail className="h-5 w-5 text-orange-500" />
    //             <span className="text-gray-300">contact@afrizar.sn</span>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Quick Links */}
    //       <div>
    //         <h4 className="text-lg font-semibold mb-6">Navigation</h4>
    //         <ul className="space-y-3">
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Accueil</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Catalogue</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Tenues Femmes</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Tenues Hommes</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Accessoires</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Sur Mesure</a></li>
    //         </ul>
    //       </div>

    //       {/* Customer Service */}
    //       <div>
    //         <h4 className="text-lg font-semibold mb-6">Service Client</h4>
    //         <ul className="space-y-3">
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Mon Compte</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Suivi Commande</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Guide des Tailles</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Retours & Échanges</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">FAQ</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Devenir Vendeur</a></li>
    //         </ul>
    //       </div>

    //       {/* Legal & Social */}
    //       <div>
    //         <h4 className="text-lg font-semibold mb-6">Suivez-nous</h4>
    //         <div className="flex space-x-4 mb-6">
    //           <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
    //             <Facebook className="h-5 w-5" />
    //           </a>
    //           <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
    //             <Instagram className="h-5 w-5" />
    //           </a>
    //           <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
    //             <Twitter className="h-5 w-5" />
    //           </a>
    //           <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-orange-600 transition-colors">
    //             <Youtube className="h-5 w-5" />
    //           </a>
    //         </div>
            
    //         <h5 className="text-sm font-semibold mb-3">Informations Légales</h5>
    //         <ul className="space-y-2 text-sm">
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Politique de Confidentialité</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Conditions d'Utilisation</a></li>
    //           <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Mentions Légales</a></li>
    //         </ul>
    //       </div>
    //     </div>

    //     {/* Trust Indicators */}
    //     <div className="border-t border-gray-800 py-8">
    //       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    //         <div className="flex items-center space-x-3">
    //           <div className="bg-orange-600/20 p-2 rounded-lg">
    //             <Shield className="h-6 w-6 text-orange-500" />
    //           </div>
    //           <div>
    //             <div className="font-semibold text-sm">Paiement Sécurisé</div>
    //             <div className="text-xs text-gray-400">Transactions protégées</div>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center space-x-3">
    //           <div className="bg-green-600/20 p-2 rounded-lg">
    //             <Truck className="h-6 w-6 text-green-500" />
    //           </div>
    //           <div>
    //             <div className="font-semibold text-sm">Livraison Mondiale</div>
    //             <div className="text-xs text-gray-400">Dans 30+ pays</div>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center space-x-3">
    //           <div className="bg-blue-600/20 p-2 rounded-lg">
    //             <CreditCard className="h-6 w-6 text-blue-500" />
    //           </div>
    //           <div>
    //             <div className="font-semibold text-sm">Multi-Paiements</div>
    //             <div className="text-xs text-gray-400">Orange Money, Wave, PayPal</div>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center space-x-3">
    //           <div className="bg-purple-600/20 p-2 rounded-lg">
    //             <Heart className="h-6 w-6 text-purple-500" />
    //           </div>
    //           <div>
    //             <div className="font-semibold text-sm">Artisanat Authentique</div>
    //             <div className="text-xs text-gray-400">Fait avec passion</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Newsletter */}
    //     <div className="border-t border-gray-800 py-8">
    //       <div className="text-center">
    //         <h4 className="text-xl font-semibold mb-2">Restez Connecté</h4>
    //         <p className="text-gray-400 mb-6">Recevez nos dernières collections et offres exclusives</p>
    //         <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
    //           <input
    //             type="email"
    //             placeholder="Votre adresse email"
    //             className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
    //           />
    //           <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
    //             S'abonner
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Bottom Bar */}
    //     <div className="border-t border-gray-800 py-6">
    //       <div className="flex flex-col md:flex-row items-center justify-between">
    //         <p className="text-gray-400 text-sm">
    //           © {currentYear} Afrizar.sn. Tous droits réservés. Fait avec <Heart className="inline h-4 w-4 text-red-500 mx-1" /> au Sénégal.
    //         </p>
    //         <div className="flex items-center space-x-6 mt-4 md:mt-0">
    //           <div className="flex items-center space-x-2">
    //             <Globe className="h-4 w-4 text-gray-400" />
    //             <select className="bg-transparent text-gray-400 text-sm border-none outline-none">
    //               <option value="fr">Français</option>
    //               <option value="en">English</option>
    //               <option value="wo">Wolof</option>
    //             </select>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;