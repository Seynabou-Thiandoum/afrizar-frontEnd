import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../contexts/InternationalizationContext';

const LanguageSelector = ({ className = '' }) => {
  const { language, country, setLanguage, setCountry, getSupportedCountries } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const countries = getSupportedCountries();
  const currentCountry = countries.find(c => c.code === country);
  const currentLanguage = languages.find(l => l.code === language);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 hover:border-orange-300 transition-colors shadow-lg"
      >
        <Globe className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentCountry?.flag} {currentLanguage?.flag}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Language Selection */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Langue / Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                    language === lang.code
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Country Selection */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Pays / Country</h3>
            <div className="space-y-1">
              {countries.map((countryOption) => (
                <button
                  key={countryOption.code}
                  onClick={() => {
                    setCountry(countryOption.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left ${
                    country === countryOption.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{countryOption.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{countryOption.name}</div>
                      <div className="text-xs text-gray-500">{countryOption.currency}</div>
                    </div>
                  </div>
                  {country === countryOption.code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;