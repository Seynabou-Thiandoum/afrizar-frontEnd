import React from 'react';
import { Shirt, Users, Baby, Crown, Gem, ArrowRight, Star, Sparkles } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const Categories = ({ onNavigate }) => {
  const { t } = useI18n();

  const categories = [
    {
      id: 1,
      name: 'Vêtements',
      description: 'Hommes, Femmes, Enfants',
      icon: Shirt,
      image: 'https://images.pexels.com/photos/1439261/pexels-photo-1439261.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-500 to-indigo-600',
      subcategories: ['Hommes', 'Femmes', 'Enfants'],
      route: 'categories'
    },
    {
      id: 2,
      name: 'Accessoires',
      description: 'Bonnets/Chapeaux, Chaussures, Sacs, Bijoux',
      icon: Gem,
      image: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-purple-500 to-violet-600',
      subcategories: ['Bonnets/Chapeaux', 'Chaussures', 'Sacs', 'Bijoux'],
      route: 'categories'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-6 py-3 mb-6">
            <Star className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-semibold">Grandes Catégories</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Explorez nos Collections
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'art de la couture sénégalaise à travers nos différentes catégories, 
            <span className="text-orange-600 font-semibold"> chacune reflétant la richesse culturelle</span> du Sénégal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto relative z-10">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => onNavigate(category.route)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-4 hover:rotate-1 border border-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  <div className="absolute top-6 right-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                      <IconComponent className="h-7 w-7 text-orange-600" />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                <div className="p-8 relative">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {category.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.subcategories.map((sub, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-orange-600 font-bold text-lg">
                      Voir la collection
                    </span>
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                      <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            );
          })}
        </div>
         */}
        {/* Call to Action */}
        {/* <div className="text-center mt-16 relative z-10">
          <button 
            onClick={() => onNavigate('catalog')}
            className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <span className="relative flex items-center">
              Découvrir Toutes les Collections
              <Sparkles className="ml-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
            </span>
          </button>
        </div> */}
      {/* </div> */}
    </section>
  );
};

export default Categories;