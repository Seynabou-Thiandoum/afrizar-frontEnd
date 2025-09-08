import React from 'react';
import { ArrowRight, Sparkles, ShoppingBag, Star, Award } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const Hero = ({ onNavigate }) => {
  const { t } = useI18n();

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-red-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-300/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8 group">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-orange-600 mr-3 animate-pulse" />
                <div className="absolute inset-0 bg-orange-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-bold text-sm uppercase tracking-widest">
                {t('hero.authentic_couture')}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
              {t('hero.elegance')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 block animate-gradient-x">
                {t('hero.senegalese')}
              </span>
              <span className="text-gray-700">{t('hero.at_your_fingertips')}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
              <span className="text-orange-600 font-medium">{t('hero.passionate_artisans')}</span> {t('hero.from_senegal')}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
              <button 
                onClick={() => onNavigate('catalog')}
                className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center group shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <span className="relative">{t('hero.cta_catalog')}</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform relative" />
              </button>
              <button className="relative border-3 border-orange-600 text-orange-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-orange-600 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105">
                <span className="relative">{t('hero.cta_custom')}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 justify-center lg:justify-start">
              <div className="text-center group cursor-pointer">
                <div className="relative mb-3">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">500+</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Créations Uniques</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="relative mb-3">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">50+</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Artisans Experts</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="relative mb-3">
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110 transition-transform">30+</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Pays Desservis</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-700">
                <img
                  src="https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Couture sénégalaise"
                  className="w-full object-cover h-96 lg:h-[600px] group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Badge - Quality */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-orange-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Qualité Premium</div>
                    <div className="text-xs text-gray-600">Artisanat authentique</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge - Delivery */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Livraison Mondiale</div>
                    <div className="text-xs text-gray-600">Partout dans le monde</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge - Rating */}
              <div className="absolute top-1/2 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 border border-yellow-100">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <div>
                    <div className="text-lg font-black text-gray-900">4.9</div>
                    <div className="text-xs text-gray-600">Excellence</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-300/30 to-red-300/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-20 pt-12 border-t border-orange-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-orange-500/25 transform group-hover:scale-110 transition-all duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Qualité Certifiée</div>
              <div className="text-sm text-gray-600">Artisanat authentique</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-green-500/25 transform group-hover:scale-110 transition-all duration-300">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Livraison Rapide</div>
              <div className="text-sm text-gray-600">Expédition mondiale</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-blue-500/25 transform group-hover:scale-110 transition-all duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Excellence</div>
              <div className="text-sm text-gray-600">Note 4.9/5</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-purple-500/25 transform group-hover:scale-110 transition-all duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Sur Mesure</div>
              <div className="text-sm text-gray-600">Personnalisation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;