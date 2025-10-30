import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, Phone, Mail, Loader, CheckCircle, Package, Gift, Sparkles } from 'lucide-react';
import { usePanier } from '../contexts/PanierContext';
import { useAuth } from '../contexts/AuthContext';
import commandeService, { CreateCommandeDto } from '../services/commandeService';
import fraisLivraisonService, { FraisLivraison } from '../services/fraisLivraisonService';
import SelecteurModePaiement from './SelecteurModePaiement';
import { ModePaiement } from '../services/modePaiementService';
import { getImageUrl as getFullImageUrl, API_CONFIG } from '../config/api';
import Swal from 'sweetalert2';

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
  onShowAuth?: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onShowAuth }) => {
  const { panier, rafraichirPanier, synchroniserAvecBackend } = usePanier();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [commandeCreee, setCommandeCreee] = useState<any>(null);
  const [fraisLivraison, setFraisLivraison] = useState<FraisLivraison[]>([]);
  const [fraisLivraisonSelectionne, setFraisLivraisonSelectionne] = useState<FraisLivraison | null>(null);
  const [modePaiement, setModePaiement] = useState<ModePaiement | null>(null);
  const [hasVerifiedAuth, setHasVerifiedAuth] = useState(false);
  const [pointsFidelite, setPointsFidelite] = useState<number>(0);
  const [pointsUtilises, setPointsUtilises] = useState<number>(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const [formData, setFormData] = useState<CreateCommandeDto>({
    type: 'IMMEDIATE',
    adresseLivraison: '',
    ville: '',
    pays: 'Sénégal',
    codePostal: '',
    notes: '',
    pointsFideliteUtilises: 0,
  });

  const [infosLivraison, setInfosLivraison] = useState({
    nom: user?.lastName || '',
    prenom: user?.firstName || '',
    telephone: '',
    email: user?.email || '',
  });

  useEffect(() => {
    // Ne vérifier qu'une seule fois au montage du composant
    if (hasVerifiedAuth) return;

    const verifierAuthentification = async () => {
      console.log('🔍 Vérification authentification:', { isAuthenticated, role: user?.role });
      
      // Vérifier si l'utilisateur est connecté
      if (!isAuthenticated) {
        console.log('❌ Utilisateur non authentifié');
        // Rediriger vers la page de connexion avec retour vers checkout
        Swal.fire({
          title: 'Connexion requise',
          text: 'Veuillez vous connecter pour finaliser votre commande',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#F99834',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Se connecter',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            // Ouvrir le modal de connexion
            if (onShowAuth) {
              onShowAuth();
            } else {
              // Fallback: naviguer vers la page auth
              onNavigate('auth');
            }
          } else {
            onNavigate('home');
          }
        });
        return;
      }

      // Vérifier si c'est un client ou admin (pour tests)
      if (user?.role !== 'client' && user?.role !== 'admin') {
        console.log('❌ Utilisateur ne peut pas passer de commande, role:', user?.role);
        Swal.fire({
          title: 'Accès restreint',
          text: 'Seuls les clients peuvent passer des commandes',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#F99834'
        }).then(() => {
          onNavigate('home');
        });
        return;
      }

      console.log('✅ Utilisateur authentifié, rôle:', user?.role);
      setHasVerifiedAuth(true);

      // Synchroniser le panier temporaire avec le backend
      await synchroniserAvecBackend();
      await rafraichirPanier();
      
      // Charger les points de fidélité
      await chargerPointsFidelite();
      
      // Charger les frais de livraison
      await chargerFraisLivraison();
    };

    verifierAuthentification();
  }, [isAuthenticated, user, hasVerifiedAuth]);

  const chargerPointsFidelite = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('afrizar_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/clients/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const clientData = await response.json();
        setPointsFidelite(clientData.pointsFidelite || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des points de fidélité:', error);
    }
  };

  // Calculer le poids total du panier (estimation: 0.5kg par produit par défaut)
  const calculerPoidsTotal = (): number => {
    if (!panier || panier.items.length === 0) return 0.5;
    // Estimation: 0.5kg par produit (pourrait être amélioré avec poids réel depuis backend)
    return panier.items.length * 0.5;
  };

  // Mapper le nom du pays vers le code pays pour l'API
  const mapperPaysVersCode = (pays: string): string => {
    const mapping: { [key: string]: string } = {
      'Sénégal': 'SENEGAL',
      'France': 'FRANCE',
      'Mali': 'MALI',
      'Côte d\'Ivoire': 'COTE_DIVOIRE',
      'Guinée': 'GUINEE'
    };
    return mapping[pays] || 'SENEGAL';
  };

  const chargerFraisLivraison = async (pays?: string, poids?: number) => {
    try {
      setCalculatingShipping(true);
      const paysSelectionne = pays || formData.pays;
      const poidsCalcule = poids || calculerPoidsTotal();
      const codePays = mapperPaysVersCode(paysSelectionne || 'Sénégal');
      
      // Charger uniquement les types de livraison actifs configurés par l'admin
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/frais-livraison/actifs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const fraisConfigures = await response.json();
          
          // Convertir directement les frais configurés (sans filtrage strict)
          const optionsLivraison: FraisLivraison[] = fraisConfigures
            .map((frais: any) => {
              // Convertir le type FraisLivraison.TypeLivraison vers le format attendu
              const typeStr = frais.type || frais.typeNom || 'STANDARD';
              
              return {
                id: frais.id,
                nom: frais.nom || `Livraison ${typeStr}`,
                description: frais.description || `Livraison ${typeStr.toLowerCase()} vers ${paysSelectionne}`,
                type: typeStr === 'EXPRESS' ? 'EXPRESS' : typeStr === 'URGENT' ? 'EXPRESS' : 'STANDARD',
                typeNom: typeStr,
                typeDescription: frais.description || `Livraison ${typeStr.toLowerCase()}`,
                frais: typeof frais.frais === 'number' ? frais.frais : parseFloat(frais.frais.toString()),
                delaiMinJours: frais.delaiMinJours || 3,
                delaiMaxJours: frais.delaiMaxJours || 7,
                actif: frais.actif !== false,
                dateCreation: frais.dateCreation || new Date().toISOString(),
                zone: frais.zone || codePays
              };
            });
          
          setFraisLivraison(optionsLivraison);
          
          // Sélectionner le premier frais par défaut ou réinitialiser si aucun
          if (optionsLivraison.length > 0) {
            setFraisLivraisonSelectionne(optionsLivraison[0]);
          } else {
            setFraisLivraisonSelectionne(null);
          }
        } else {
          // Fallback sur la méthode précédente si l'endpoint n'est pas disponible
          console.warn('Endpoint public/frais-livraison/actifs non disponible, utilisation du fallback');
          chargerFraisLivraisonFallback(paysSelectionne || 'Sénégal', poidsCalcule, codePays);
        }
      } catch (error) {
        console.error('Erreur chargement types depuis backend:', error);
        chargerFraisLivraisonFallback(paysSelectionne || 'Sénégal', poidsCalcule, codePays);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des frais de livraison:', error);
    } finally {
      setCalculatingShipping(false);
    }
  };

  const chargerFraisLivraisonFallback = async (_pays: string, poids: number, codePays: string) => {
    // Méthode de fallback avec types hardcodés (pour compatibilité)
    const typesLivraison = ['EXPRESS', 'STANDARD', 'ECONOMIQUE'];
    const optionsLivraison: FraisLivraison[] = [];
    
    for (const type of typesLivraison) {
      try {
        const frais = await fraisLivraisonService.calculerFraisLivraison(type, poids, codePays);
        optionsLivraison.push(frais);
      } catch (error) {
        console.error(`Erreur chargement ${type}:`, error);
      }
    }
    
    setFraisLivraison(optionsLivraison);
    
    if (optionsLivraison.length > 0) {
      setFraisLivraisonSelectionne(optionsLivraison[0]);
    } else {
      setFraisLivraisonSelectionne(null);
    }
  };

  // Recharger les frais de livraison quand le pays change
  useEffect(() => {
    if (hasVerifiedAuth && formData.pays && panier && panier.items.length > 0) {
      chargerFraisLivraison(formData.pays, calculerPoidsTotal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pays, hasVerifiedAuth]);

  // Calculer la réduction avec les points de fidélité (1 point = 1 FCFA)
  const calculerReductionPoints = (): number => {
    return Math.min(pointsUtilises, pointsFidelite);
  };

  // Calculer le montant avec frais de livraison
  const calculateMontantAvecLivraison = (): number => {
    const montantPanier = panier?.montantTotal || 0;
    const fraisLiv = fraisLivraisonSelectionne?.frais || 0;
    return montantPanier + fraisLiv;
  };

  // Calculer les frais du mode de paiement
  const calculateFraisPaiement = (): number => {
    if (!modePaiement) return 0;
    
    const montantAvecLivraison = calculateMontantAvecLivraison();
    const reductionPoints = calculerReductionPoints();
    const montantAvantFraisPaiement = montantAvecLivraison - reductionPoints;
    
    let frais = modePaiement.fraisFixe || 0;
    
    if (modePaiement.fraisPourcentage) {
      frais += (montantAvantFraisPaiement * modePaiement.fraisPourcentage) / 100;
    }
    
    return frais;
  };

  // Calculer le montant total final
  const calculateMontantTotalFinal = (): number => {
    const montantAvecLivraison = calculateMontantAvecLivraison();
    const fraisPaiement = calculateFraisPaiement();
    const reductionPoints = calculerReductionPoints();
    return montantAvecLivraison + fraisPaiement - reductionPoints;
  };

  // Helper pour obtenir l'URL complète de l'image
  const getImageUrl = (photos?: string[]) => {
    return getFullImageUrl(photos);
  };

  const handleSubmitCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!panier || panier.items.length === 0) {
      Swal.fire({
        title: 'Panier vide',
        text: 'Votre panier est vide',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F99834'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📦 Soumission de la commande:', formData);
      
      // Inclure les points de fidélité utilisés dans le formData
      const commandeData = {
        ...formData,
        pointsFideliteUtilises: pointsUtilises
      };
      
      const commande = await commandeService.creerCommandeDepuisPanier(commandeData);
      
      setCommandeCreee(commande);
      setEtapeActuelle(4); // Aller à l'étape confirmation
      
      console.log('✅ Commande créée avec succès:', commande);
    } catch (error: any) {
      console.error('❌ Erreur création commande:', error);
      Swal.fire({
        title: 'Erreur',
        text: error.message || 'Erreur lors de la création de la commande',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F99834'
      });
    } finally {
      setLoading(false);
    }
  };

  // Étape 1 : Informations de livraison
  const renderEtapeLivraison = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Truck className="h-6 w-6 mr-2 text-[#F99834]" />
        Informations de livraison
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input
            type="text"
            required
            value={infosLivraison.nom}
            onChange={(e) => setInfosLivraison({ ...infosLivraison, nom: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
          <input
            type="text"
            required
            value={infosLivraison.prenom}
            onChange={(e) => setInfosLivraison({ ...infosLivraison, prenom: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
          <input
            type="tel"
            required
            value={infosLivraison.telephone}
            onChange={(e) => setInfosLivraison({ ...infosLivraison, telephone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
            placeholder="+221 77 123 45 67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={infosLivraison.email}
            onChange={(e) => setInfosLivraison({ ...infosLivraison, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison *</label>
          <textarea
            required
            value={formData.adresseLivraison}
            onChange={(e) => setFormData({ ...formData, adresseLivraison: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
            rows={3}
            placeholder="Numéro, rue, quartier..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
          <input
            type="text"
            required
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
            placeholder="Ex: Dakar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
          <select
            value={formData.pays}
            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
          >
            <option value="Sénégal">Sénégal</option>
            <option value="France">France</option>
            <option value="Mali">Mali</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="Guinée">Guinée</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes pour le vendeur (optionnel)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent"
            rows={3}
            placeholder="Instructions spéciales, préférences..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => onNavigate('panier')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour au panier
        </button>
        <button
          onClick={() => setEtapeActuelle(2)}
          className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
        >
          Continuer
        </button>
      </div>
    </div>
  );

  // Étape 2 : Frais de livraison et modes de paiement
  const renderEtape2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Truck className="h-6 w-6 mr-2 text-[#F99834]" />
        Livraison et Paiement
      </h2>
      
      {/* Points de fidélité */}
      {pointsFidelite > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-[#F99834] rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#F99834] rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Points de fidélité disponibles</h3>
                <p className="text-sm text-gray-600">
                  Vous avez <span className="font-bold text-[#F99834]">{pointsFidelite.toLocaleString()}</span> points
                  <span className="text-xs text-gray-500 ml-2">(1 point = 1 FCFA)</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              max={Math.min(pointsFidelite, Math.floor(calculateMontantAvecLivraison()))}
              value={pointsUtilises}
              onChange={(e) => {
                const valeur = parseInt(e.target.value) || 0;
                const maxUtilisable = Math.min(pointsFidelite, Math.floor(calculateMontantAvecLivraison()));
                setPointsUtilises(Math.max(0, Math.min(valeur, maxUtilisable)));
              }}
              className="flex-1 px-4 py-2 border-2 border-[#F99834] rounded-lg focus:ring-2 focus:ring-[#F99834] focus:border-transparent text-lg font-semibold"
              placeholder="0"
            />
            <button
              onClick={() => {
                const maxUtilisable = Math.min(pointsFidelite, Math.floor(calculateMontantAvecLivraison()));
                setPointsUtilises(maxUtilisable);
              }}
              className="px-4 py-2 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors font-semibold"
            >
              Utiliser tout
            </button>
            <button
              onClick={() => setPointsUtilises(0)}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
          
          {pointsUtilises > 0 && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-600">Réduction appliquée :</span>{' '}
                <span className="text-lg font-bold text-green-600">-{pointsUtilises.toLocaleString()} FCFA</span>
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Frais de livraison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Options de livraison</h3>
          {calculatingShipping && (
            <Loader className="h-5 w-5 animate-spin text-[#F99834]" />
          )}
        </div>
        
        {fraisLivraison.length > 0 ? (
          <div className="space-y-3">
            {fraisLivraison.map((frais) => (
              <div
                key={frais.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  fraisLivraisonSelectionne?.id === frais.id
                    ? 'border-[#F99834] bg-orange-50 shadow-md'
                    : 'border-gray-300 hover:border-[#F99834] hover:bg-orange-50/50'
                }`}
                onClick={() => setFraisLivraisonSelectionne(frais)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={fraisLivraisonSelectionne?.id === frais.id}
                      onChange={() => setFraisLivraisonSelectionne(frais)}
                      className="text-[#F99834] w-5 h-5"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        {frais.typeNom}
                        {frais.typeNom === 'EXPRESS' && <Sparkles className="h-4 w-4 ml-2 text-[#F99834]" />}
                      </h4>
                      <p className="text-sm text-gray-600">{frais.description}</p>
                      <p className="text-sm text-gray-500">
                        {frais.delaiMinJours} à {frais.delaiMaxJours} jours ouvrables
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#F99834]">
                      {frais.frais.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : calculatingShipping ? (
          <div className="text-center py-8">
            <Loader className="h-8 w-8 animate-spin text-[#F99834] mx-auto mb-2" />
            <p className="text-gray-500">Calcul des frais de livraison...</p>
          </div>
        ) : (
          <p className="text-gray-500">Aucune option de livraison disponible pour cette destination</p>
        )}
      </div>

      {/* Modes de paiement - Système dynamique configuré par l'admin */}
      <SelecteurModePaiement
        montantTotal={calculateMontantAvecLivraison() - calculerReductionPoints()}
        onSelectMode={setModePaiement}
        modeSelectionne={modePaiement}
      />

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setEtapeActuelle(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <button
          onClick={() => setEtapeActuelle(3)}
          disabled={!fraisLivraisonSelectionne || !modePaiement || calculatingShipping}
          className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {calculatingShipping ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </div>
  );

  // Étape 3 : Récapitulatif et validation
  const renderEtapeRecapitulatif = () => (
    <div className="space-y-6">
      {/* Récapitulatif des articles */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Package className="h-6 w-6 mr-2 text-[#F99834]" />
          Récapitulatif de votre commande
        </h2>

        <div className="space-y-4">
          {panier?.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
              <img
                src={getImageUrl(item.produitPhotos)}
                alt={item.produitNom}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.produitNom}</h4>
                <p className="text-sm text-gray-600">
                  {item.taille && `Taille: ${item.taille}`} {item.couleur && ` • Couleur: ${item.couleur}`}
                </p>
                <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{item.sousTotal.toLocaleString()} FCFA</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations de livraison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-[#F99834]" />
          Adresse de livraison
        </h3>
        <div className="text-gray-700 space-y-1">
          <p>{infosLivraison.prenom} {infosLivraison.nom}</p>
          <p>{formData.adresseLivraison}</p>
          <p>{formData.ville}, {formData.pays}</p>
          <p className="flex items-center mt-2">
            <Phone className="h-4 w-4 mr-2" />
            {infosLivraison.telephone}
          </p>
          <p className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            {infosLivraison.email}
          </p>
        </div>
      </div>

      {/* Totaux */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Sous-total articles</span>
            <span>{panier?.montantTotal.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Frais de livraison</span>
            <span className="text-green-600 font-semibold">
              {fraisLivraisonSelectionne ? `${fraisLivraisonSelectionne.frais.toLocaleString()} FCFA` : 'À sélectionner'}
            </span>
          </div>
          {modePaiement && calculateFraisPaiement() > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Frais de paiement ({modePaiement.nom})</span>
              <span className="text-blue-600 font-semibold">
                {calculateFraisPaiement().toLocaleString()} FCFA
              </span>
            </div>
          )}
          {pointsUtilises > 0 && (
            <div className="flex justify-between text-gray-700">
              <span className="flex items-center">
                <Gift className="h-4 w-4 mr-1 text-[#F99834]" />
                Réduction (points de fidélité)
              </span>
              <span className="text-green-600 font-semibold">
                -{pointsUtilises.toLocaleString()} FCFA
              </span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total à payer</span>
            <span className="text-[#F99834]">
              {calculateMontantTotalFinal().toLocaleString()} FCFA
            </span>
          </div>
          {modePaiement && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-amber-800">
                <strong>💳 Mode de paiement :</strong> {modePaiement.nom}
                {modePaiement.instructions && (
                  <span className="block mt-1 text-xs">{modePaiement.instructions}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-between">
        <button
          onClick={() => setEtapeActuelle(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <button
          onClick={handleSubmitCommande}
          disabled={loading}
          className="px-8 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirmer la commande
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Étape 3 : Confirmation
  const renderEtapeConfirmation = () => (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
        <p className="text-gray-600">Votre commande a été créée avec succès</p>
      </div>

      {commandeCreee && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
          <p className="text-2xl font-bold text-[#F99834] mb-4">{commandeCreee.numeroCommande}</p>
          <p className="text-sm text-gray-600">
            Montant total : <span className="font-bold text-gray-900">{commandeCreee.montantTotal.toLocaleString()} FCFA</span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => onNavigate('client-dashboard')}
          className="w-full px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
        >
          Voir mes commandes
        </button>
        <button
          onClick={() => onNavigate('vetements')}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  );

  // Vérifier si le panier est vide
  if (!panier || panier.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">
              Ajoutez des produits à votre panier avant de passer commande
            </p>
            <button
              onClick={() => onNavigate('vetements')}
              className="px-6 py-3 bg-[#F99834] text-white rounded-lg hover:bg-[#E5861A] transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Finaliser ma commande</h1>
          <p className="text-gray-600">
            {panier.nombreTotalArticles} article{panier.nombreTotalArticles > 1 ? 's' : ''} • {panier.montantTotal.toLocaleString()} FCFA
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((etape) => (
              <React.Fragment key={etape}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    etape < etapeActuelle ? 'bg-green-500 text-white' :
                    etape === etapeActuelle ? 'bg-[#F99834] text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {etape < etapeActuelle ? <CheckCircle className="h-6 w-6" /> : etape}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {etape === 1 && 'Livraison'}
                    {etape === 2 && 'Récapitulatif'}
                    {etape === 3 && 'Confirmation'}
                  </span>
                </div>
                {etape < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    etape < etapeActuelle ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenu selon l'étape */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {etapeActuelle === 1 && renderEtapeLivraison()}
            {etapeActuelle === 2 && renderEtape2()}
            {etapeActuelle === 3 && renderEtapeRecapitulatif()}
            {etapeActuelle >= 4 && renderEtapeConfirmation()}
          </div>

          {/* Résumé de la commande (sidebar) */}
          {etapeActuelle < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Résumé</h3>
                
                <div className="space-y-3 mb-6">
                  {panier.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={getImageUrl(item.produitPhotos)}
                        alt={item.produitNom}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.produitNom}</p>
                        <p className="text-xs text-gray-600">Qté: {item.quantite}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.sousTotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {panier.items.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{panier.items.length - 3} autre{panier.items.length - 3 > 1 ? 's' : ''} article{panier.items.length - 3 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span>{panier.montantTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Livraison</span>
                    <span className="text-sm">
                      {fraisLivraisonSelectionne ? `${fraisLivraisonSelectionne.frais.toLocaleString()} FCFA` : 'À sélectionner'}
                    </span>
                  </div>
                  {modePaiement && calculateFraisPaiement() > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span className="text-sm">Frais paiement</span>
                      <span className="text-sm">
                        {calculateFraisPaiement().toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                  {pointsUtilises > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span className="text-sm flex items-center">
                        <Gift className="h-3 w-3 mr-1 text-[#F99834]" />
                        Réduction
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        -{pointsUtilises.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#F99834]">
                      {calculateMontantTotalFinal().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

