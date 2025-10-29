import React, { useState, useEffect } from 'react';
import modePaiementService, { ModePaiement, TypePaiement } from '../services/modePaiementService';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  DollarSign,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

interface SelecteurModePaiementProps {
  montantTotal: number;
  onSelectMode: (mode: ModePaiement) => void;
  modeSelectionne?: ModePaiement | null;
}

const SelecteurModePaiement: React.FC<SelecteurModePaiementProps> = ({
  montantTotal,
  onSelectMode,
  modeSelectionne
}) => {
  const [modesPaiement, setModesPaiement] = useState<ModePaiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModesPaiement();
  }, []);

  const loadModesPaiement = async () => {
    try {
      setLoading(true);
      const modes = await modePaiementService.getActivesModesPaiement();
      
      // Filtrer les modes disponibles selon le montant
      const modesDisponibles = modes.filter(mode => {
        const montantValide = 
          (!mode.montantMinimum || montantTotal >= mode.montantMinimum) &&
          (!mode.montantMaximum || montantTotal <= mode.montantMaximum);
        return montantValide;
      });
      
      setModesPaiement(modesDisponibles);
      setError(null);
    } catch (err: any) {
      setError('Erreur lors du chargement des modes de paiement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: TypePaiement) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case TypePaiement.CARTE_BANCAIRE:
        return <CreditCard className={iconClass} />;
      case TypePaiement.MOBILE_MONEY:
        return <Smartphone className={iconClass} />;
      case TypePaiement.VIREMENT_BANCAIRE:
        return <Building2 className={iconClass} />;
      case TypePaiement.CASH:
        return <DollarSign className={iconClass} />;
      case TypePaiement.PORTEFEUILLE:
        return <Wallet className={iconClass} />;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  const calculerFrais = (mode: ModePaiement): number => {
    let frais = mode.fraisFixe || 0;
    if (mode.fraisPourcentage) {
      frais += (montantTotal * mode.fraisPourcentage) / 100;
    }
    return frais;
  };

  const calculerTotal = (mode: ModePaiement): number => {
    return montantTotal + calculerFrais(mode);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={loadModesPaiement}
              className="text-sm text-red-600 underline mt-1"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modesPaiement.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Aucun mode de paiement n'est disponible pour ce montant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sélectionnez un mode de paiement
      </h3>

      <div className="space-y-3">
        {modesPaiement.map((mode) => {
          const frais = calculerFrais(mode);
          const total = calculerTotal(mode);
          const isSelected = modeSelectionne?.id === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    isSelected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getTypeIcon(mode.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{mode.nom}</h4>
                      {isSelected && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    {mode.description && (
                      <p className="text-sm text-gray-600 mb-2">{mode.description}</p>
                    )}

                    {/* Frais de transaction */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm">
                        {frais > 0 ? (
                          <>
                            <span className="text-gray-600">Frais : </span>
                            <span className="font-medium text-gray-900">
                              {frais.toLocaleString()} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-green-600 font-medium">Sans frais</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Total : </span>
                        <span className="font-semibold text-gray-900">
                          {total.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    {/* Délai de traitement */}
                    {mode.delaiTraitement && (
                      <p className="text-xs text-gray-500 mt-1">
                        ⏱️ Traitement estimé : {mode.delaiTraitement}h
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions (affichées si sélectionné) */}
              {isSelected && mode.instructions && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <div className="flex items-start space-x-2 bg-blue-50 rounded-lg p-3">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">{mode.instructions}</p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Informations générales */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          🔒 Tous les paiements sont sécurisés et protégés par cryptage SSL
        </p>
      </div>
    </div>
  );
};

export default SelecteurModePaiement;


