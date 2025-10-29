import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Plus, 
  X, 
  Package, 
  DollarSign, 
  Clock, 
  Weight,
  Star,
  Save,
  Eye
} from 'lucide-react';
import CommissionCalculator from './CommissionCalculator';
import ShippingCalculator from './ShippingCalculator';

const VendorProductForm = ({ onClose, onSave, editProduct = null }) => {
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    description: editProduct?.description || '',
    price: editProduct?.price || '',
    stock: editProduct?.stock || '',
    weight: editProduct?.weight || '',
    productionDelay: editProduct?.productionDelay || '3-5',
    quality: editProduct?.quality || 'standard',
    category: editProduct?.category || 'Tenues Femmes',
    vendeurId: editProduct?.vendeurId || '',
    colors: editProduct?.colors || ['#FF6B35'],
    sizes: editProduct?.sizes || ['M'],
    images: editProduct?.images || []
  });

  const [commission, setCommission] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Charger les catégories depuis l'API
  const [categories, setCategories] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  
  useEffect(() => {
    // Charger les catégories depuis l'API
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.content || data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Fallback vers les catégories par défaut
        setCategories([
          'Tenues Femmes',
          'Tenues Hommes', 
          'Accessoires',
          'Bijoux',
          'Chaussures',
          'Sacs'
        ]);
      }
    };
    
    // Charger les vendeurs depuis l'API (pour les admins)
    const loadVendeurs = async () => {
      try {
        const response = await fetch('/api/admin/vendeurs');
        const data = await response.json();
        setVendeurs(data.content || data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des vendeurs:', error);
      }
    };
    
    loadCategories();
    loadVendeurs();
  }, []);

  const qualityLevels = [
    { value: 'standard', label: 'Standard', description: 'Qualité artisanale classique' },
    { value: 'premium', label: 'Premium', description: 'Finitions haut de gamme' },
    { value: 'luxury', label: 'Luxe', description: 'Pièce d\'exception unique' }
  ];

  const productionDelays = [
    { value: '1-3', label: '1-3 jours', description: 'Express (stock disponible)' },
    { value: '3-5', label: '3-5 jours', description: 'Standard' },
    { value: '5-7', label: '5-7 jours', description: 'Sur commande' },
    { value: '7-14', label: '7-14 jours', description: 'Création personnalisée' }
  ];

  const colorOptions = [
    '#FF6B35', '#F97316', '#DC2626', '#B91C1C',
    '#059669', '#10B981', '#3B82F6', '#1D4ED8',
    '#7C3AED', '#A855F7', '#EC4899', '#BE185D',
    '#000000', '#374151', '#6B7280', '#F3F4F6'
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addColor = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const removeColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Simulate image upload - in real app, upload to server
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const productData = {
      ...formData,
      commission,
      estimatedShipping: shipping,
      id: editProduct?.id || Date.now()
    };
    console.log('Données du produit à sauvegarder:', productData);
    onSave(productData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" onClick={() => setPreviewMode(false)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            {/* Preview Content */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Aperçu du produit</h2>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images[0]}
                      alt={formData.name}
                      className="w-full h-80 object-cover rounded-3xl shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 rounded-3xl flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-4">
                    <span className="text-sm text-orange-600 font-bold uppercase">{formData.category}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formData.name || 'Nom du produit'}</h3>
                  </div>

                  <p className="text-gray-600 mb-6">{formData.description || 'Description du produit...'}</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Prix</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formData.price ? formatPrice(parseInt(formData.price)) : '0 FCFA'}
                      </span>
                    </div>

                    {commission && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Prix final client</span>
                        <span className="font-bold text-orange-600">
                          {formatPrice(commission.finalPrice)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Stock: {formData.stock || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formData.productionDelay} jours</span>
                      </div>
                    </div>

                    {formData.colors.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Couleurs</span>
                        <div className="flex space-x-2">
                          {formData.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.sizes.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Tailles</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-orange-100">
              <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  {editProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
                </h2>
                <p className="text-gray-600 font-medium">Ajoutez les détails de votre création</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreviewMode(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  <span>Aperçu</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Info */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de base</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Grand Boubou Brodé Premium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Décrivez votre création en détail..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">⚠️ Sélectionner une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat.id || cat} value={cat.nom || cat}>
                              {cat.nom || cat} {cat.type ? `(${cat.type} - ${cat.genre})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de qualité</label>
                        <select
                          value={formData.quality}
                          onChange={(e) => handleInputChange('quality', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                        >
                          {qualityLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Champ Vendeur pour les admins */}
                    {vendeurs.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vendeur (Admin uniquement)</label>
                        <select
                          value={formData.vendeurId || ''}
                          onChange={(e) => handleInputChange('vendeurId', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Sélectionner un vendeur (optionnel)</option>
                          {vendeurs.map(vendeur => (
                            <option key={vendeur.id} value={vendeur.id}>
                              {vendeur.nomBoutique} ({vendeur.prenom} {vendeur.nom})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Prix et Stock</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix vendeur (FCFA)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="25000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock disponible</label>
                      <div className="relative">
                        <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Délai de production</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {productionDelays.map((delay) => (
                        <label
                          key={delay.value}
                          className={`flex items-center p-3 border-2 rounded-2xl cursor-pointer transition-all ${
                            formData.productionDelay === delay.value
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={delay.value}
                            checked={formData.productionDelay === delay.value}
                            onChange={(e) => handleInputChange('productionDelay', e.target.value)}
                            className="text-orange-600 focus:ring-orange-500 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{delay.label}</div>
                            <div className="text-sm text-gray-600">{delay.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors & Sizes */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Couleurs et Tailles</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Couleurs disponibles</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {formData.colors.map((color, index) => (
                          <div key={index} className="relative">
                            <div
                              className="w-12 h-12 rounded-2xl border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <button
                              onClick={() => removeColor(color)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => addColor(color)}
                            className="w-8 h-8 rounded-xl border-2 border-gray-300 hover:border-orange-500 transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Tailles disponibles</label>
                      <div className="flex flex-wrap gap-3">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 border-2 rounded-2xl font-medium transition-all ${
                              formData.sizes.includes(size)
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-gray-300 text-gray-700 hover:border-orange-600'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Photos du produit</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Produit ${index + 1}`}
                            className="w-full h-32 object-cover rounded-2xl"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Ajouter photo</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Calculators */}
              <div className="space-y-6">
                {formData.price && (
                  <CommissionCalculator
                    basePrice={parseInt(formData.price)}
                    onCommissionCalculated={setCommission}
                  />
                )}

                {formData.weight && (
                  <ShippingCalculator
                    weight={parseFloat(formData.weight)}
                    destination="senegal"
                    shippingMethod="standard"
                    onShippingCalculated={setShipping}
                  />
                )}

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Save className="h-6 w-6" />
                  <span>{editProduct ? 'Mettre à jour' : 'Enregistrer le produit'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductForm;