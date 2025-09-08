import React, { useState } from 'react';
import { 
  X, 
  Star, 
  User, 
  MessageSquare, 
  Send,
  Heart,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

const ReviewResponseModal = ({ review, onClose, onSave }) => {
  const [response, setResponse] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!response.trim()) {
      setErrors({ response: 'Veuillez écrire une réponse' });
      return;
    }

    onSave({
      reviewId: review.id,
      response: response.trim(),
      isPublic,
      timestamp: new Date().toISOString()
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const suggestedResponses = [
    "Merci beaucoup pour votre avis ! Nous sommes ravis que vous soyez satisfait(e) de votre achat.",
    "Nous vous remercions pour vos commentaires constructifs. Nous prenons note pour améliorer nos créations.",
    "C'est un plaisir de savoir que notre travail artisanal vous plaît ! Merci pour votre confiance.",
    "Nous apprécions votre retour et espérons vous revoir bientôt pour de nouvelles créations."
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Répondre à l'avis client
                </h2>
                <p className="text-gray-600 font-medium">Montrez votre professionnalisme</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avis original */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">{review.customer}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          ✓ Achat vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Produit: {review.product}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-xl italic">"{review.comment}"</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(review.date)}</p>
                  </div>
                </div>
              </div>

              {/* Réponses suggérées */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Réponses suggérées
                </h4>
                <div className="space-y-2">
                  {suggestedResponses.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setResponse(suggestion)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-sm text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire de réponse */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Votre réponse</label>
                  <textarea
                    value={response}
                    onChange={(e) => {
                      setResponse(e.target.value);
                      if (errors.response) setErrors({});
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.response ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rédigez votre réponse professionnelle..."
                  />
                  {errors.response && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.response}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Réponse publique (visible par tous les clients)
                    </label>
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
                    <span>Envoyer la Réponse</span>
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

export default ReviewResponseModal;