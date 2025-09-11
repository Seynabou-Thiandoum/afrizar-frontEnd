import React from 'react';
import { Shirt, Watch, Gem, Sparkles, Crown, Star, ArrowRight } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const Categories = ({ onNavigate }) => {
  const { t } = useI18n();

  const categories = [
    {
      id: 1,
      name: 'Tenues Femmes',
      description: 'Boubous, Robes, Ensembles élégants',
      icon: Crown,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-pink-500 to-rose-600',
      route: 'tenues-femmes'
    },
    {
      id: 2,
      name: 'Tenues Hommes',
      description: 'Grands boubous, Costumes traditionnels',
      icon: Shirt,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-500 to-indigo-600',
      route: 'tenues-hommes'
    },
    {
      id: 3,
      name: 'Accessoires',
      description: 'Bonnets/Chapeaux, Chaussures, Sacs, Bijoux',
      icon: Gem,
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-purple-500 to-violet-600',
      route: 'accessoires'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent to-orange-600 rounded-full"></div>
          <Sparkles className="h-6 w-6 text-orange-600 mx-4 animate-pulse" />
          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-orange-600 rounded-full"></div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
          {t('categories.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('categories.subtitle')}
          <span className="text-orange-600 font-semibold">{t('categories.cultural_richness')}</span> {t('categories.of_senegal')}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => onNavigate(category.route)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-4 hover:rotate-1 border border-white/50"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-56 overflow-hidden rounded-t-3xl">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                
                {/* Floating Icon */}
                <div className="absolute top-6 right-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                    <IconComponent className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              
              <div className="p-8 relative">
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-orange-600 font-bold">
                    {t('categories.view_collection')}
                  </span>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                    <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Call to Action */}
      <div className="text-center mt-16 relative z-10">
        <button 
          onClick={() => onNavigate('catalog')}
          className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <span className="relative flex items-center">
            {t('categories.discover_all')}
            <Sparkles className="ml-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default Categories;