import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import panierService, { Panier, AjouterAuPanierDto } from '../services/panierService';
import { useAuth } from './AuthContext';

interface PanierItem {
  id?: number; // Optionnel pour items temporaires
  produitId: number;
  produitNom: string;
  produitDescription: string;
  produitPhotos: string[];
  prixUnitaire: number;
  quantite: number;
  taille?: string;
  couleur?: string;
  sousTotal: number;
  stockDisponible?: number;
  vendeurNom?: string;
  nomBoutique?: string;
  temporaire?: boolean; // Indique si c'est un item temporaire
}

interface PanierLocal {
  items: PanierItem[];
  montantTotal: number;
  nombreTotalArticles: number;
}

interface PanierContextType {
  panier: PanierLocal;
  loading: boolean;
  nombreArticles: number;
  ajouterAuPanier: (produit: any, quantite: number, taille?: string, couleur?: string) => Promise<void>;
  modifierQuantite: (itemIndex: number, quantite: number) => Promise<void>;
  retirerDuPanier: (itemIndex: number) => Promise<void>;
  viderPanier: () => Promise<void>;
  synchroniserAvecBackend: () => Promise<void>;
  rafraichirPanier: () => Promise<void>;
}

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier doit être utilisé dans un PanierProvider');
  }
  return context;
};

interface PanierProviderProps {
  children: ReactNode;
}

const PANIER_STORAGE_KEY = 'afrizar_panier_temporaire';

export const PanierProvider: React.FC<PanierProviderProps> = ({ children }) => {
  const [panier, setPanier] = useState<PanierLocal>({
    items: [],
    montantTotal: 0,
    nombreTotalArticles: 0,
  });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Charger le panier au démarrage
  useEffect(() => {
    chargerPanierInitial();
  }, []);

  // Synchroniser avec le backend quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated && user?.role === 'client') {
      synchroniserAvecBackend();
    }
  }, [isAuthenticated, user]);

  const chargerPanierInitial = async () => {
    // Si l'utilisateur est connecté et est un client, charger depuis le backend
    if (isAuthenticated && user?.role === 'client') {
      try {
        const panierBackend = await panierService.obtenirMonPanier();
        setPanierDepuisBackend(panierBackend);
      } catch (error) {
        console.error('Erreur chargement panier backend:', error);
        // Fallback sur localStorage
        chargerDepuisLocalStorage();
      }
    } else {
      // Sinon, charger depuis localStorage
      chargerDepuisLocalStorage();
    }
  };

  const chargerDepuisLocalStorage = () => {
    try {
      const panierSauvegarde = localStorage.getItem(PANIER_STORAGE_KEY);
      if (panierSauvegarde) {
        const panierParse = JSON.parse(panierSauvegarde);
        setPanier(panierParse);
        console.log('📦 Panier chargé depuis localStorage:', panierParse);
      }
    } catch (error) {
      console.error('Erreur chargement panier localStorage:', error);
    }
  };

  const sauvegarderDansLocalStorage = (nouveauPanier: PanierLocal) => {
    try {
      localStorage.setItem(PANIER_STORAGE_KEY, JSON.stringify(nouveauPanier));
      console.log('💾 Panier sauvegardé dans localStorage');
    } catch (error) {
      console.error('Erreur sauvegarde panier localStorage:', error);
    }
  };

  const setPanierDepuisBackend = (panierBackend: Panier) => {
    const panierLocal: PanierLocal = {
      items: panierBackend.items.map(item => ({
        id: item.id,
        produitId: item.produitId,
        produitNom: item.produitNom,
        produitDescription: item.produitDescription,
        produitPhotos: item.produitPhotos,
        prixUnitaire: item.prixUnitaire,
        quantite: item.quantite,
        taille: item.taille,
        couleur: item.couleur,
        sousTotal: item.sousTotal,
        stockDisponible: item.stockDisponible,
        vendeurNom: item.vendeurNom,
        nomBoutique: item.nomBoutique,
        temporaire: false,
      })),
      montantTotal: panierBackend.montantTotal,
      nombreTotalArticles: panierBackend.nombreTotalArticles,
    };
    setPanier(panierLocal);
  };

  const calculerTotaux = (items: PanierItem[]): PanierLocal => {
    const montantTotal = items.reduce((sum, item) => sum + item.sousTotal, 0);
    const nombreTotalArticles = items.reduce((sum, item) => sum + item.quantite, 0);
    
    return {
      items,
      montantTotal,
      nombreTotalArticles,
    };
  };

  const rafraichirPanier = async () => {
    await chargerPanierInitial();
  };

  const ajouterAuPanier = async (produit: any, quantite: number = 1, taille?: string, couleur?: string) => {
    try {
      setLoading(true);

      // Si l'utilisateur est connecté et est un client, ajouter au backend
      if (isAuthenticated && user?.role === 'client') {
        const panierBackend = await panierService.ajouterAuPanier({
          produitId: produit.id,
          quantite,
          taille,
          couleur,
        });
        setPanierDepuisBackend(panierBackend);
      } else {
        // Sinon, ajouter au panier local (localStorage)
        const nouvelItem: PanierItem = {
          produitId: produit.id,
          produitNom: produit.name || produit.nom,
          produitDescription: produit.description,
          produitPhotos: produit.images || produit.photos || [],
          prixUnitaire: typeof produit.price === 'string' 
            ? parseFloat(produit.price.replace(/[^\d]/g, '')) 
            : produit.prix,
          quantite,
          taille,
          couleur,
          sousTotal: (typeof produit.price === 'string' 
            ? parseFloat(produit.price.replace(/[^\d]/g, '')) 
            : produit.prix) * quantite,
          temporaire: true,
        };

        // Vérifier si l'item existe déjà
        const itemExistantIndex = panier.items.findIndex(
          item => item.produitId === produit.id && 
                  item.taille === taille && 
                  item.couleur === couleur
        );

        let nouveauxItems;
        if (itemExistantIndex >= 0) {
          // Incrémenter la quantité
          nouveauxItems = [...panier.items];
          nouveauxItems[itemExistantIndex].quantite += quantite;
          nouveauxItems[itemExistantIndex].sousTotal = 
            nouveauxItems[itemExistantIndex].prixUnitaire * nouveauxItems[itemExistantIndex].quantite;
        } else {
          // Ajouter un nouvel item
          nouveauxItems = [...panier.items, nouvelItem];
        }

        const nouveauPanier = calculerTotaux(nouveauxItems);
        setPanier(nouveauPanier);
        sauvegarderDansLocalStorage(nouveauPanier);
        console.log('✅ Produit ajouté au panier temporaire');
      }
    } catch (error: any) {
      console.error('Erreur ajout au panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const modifierQuantite = async (itemIndex: number, nouvelleQuantite: number) => {
    try {
      setLoading(true);

      if (nouvelleQuantite <= 0) {
        return retirerDuPanier(itemIndex);
      }

      const item = panier.items[itemIndex];

      // Si l'utilisateur est connecté et l'item a un ID, modifier sur le backend
      if (isAuthenticated && user?.role === 'client' && item.id) {
        const panierBackend = await panierService.modifierQuantite(item.id, nouvelleQuantite);
        setPanierDepuisBackend(panierBackend);
      } else {
        // Sinon, modifier dans localStorage
        const nouveauxItems = [...panier.items];
        nouveauxItems[itemIndex].quantite = nouvelleQuantite;
        nouveauxItems[itemIndex].sousTotal = 
          nouveauxItems[itemIndex].prixUnitaire * nouvelleQuantite;

        const nouveauPanier = calculerTotaux(nouveauxItems);
        setPanier(nouveauPanier);
        sauvegarderDansLocalStorage(nouveauPanier);
      }
    } catch (error: any) {
      console.error('Erreur modification quantité:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const retirerDuPanier = async (itemIndex: number) => {
    try {
      setLoading(true);

      const item = panier.items[itemIndex];

      // Si l'utilisateur est connecté et l'item a un ID, retirer du backend
      if (isAuthenticated && user?.role === 'client' && item.id) {
        const panierBackend = await panierService.retirerDuPanier(item.id);
        setPanierDepuisBackend(panierBackend);
      } else {
        // Sinon, retirer du localStorage
        const nouveauxItems = panier.items.filter((_, index) => index !== itemIndex);
        const nouveauPanier = calculerTotaux(nouveauxItems);
        setPanier(nouveauPanier);
        sauvegarderDansLocalStorage(nouveauPanier);
      }

      console.log('✅ Article retiré du panier');
    } catch (error: any) {
      console.error('Erreur retrait panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const viderPanier = async () => {
    try {
      setLoading(true);

      // Si l'utilisateur est connecté, vider le backend
      if (isAuthenticated && user?.role === 'client') {
        await panierService.viderPanier();
      }

      // Vider le panier local
      const panierVide: PanierLocal = {
        items: [],
        montantTotal: 0,
        nombreTotalArticles: 0,
      };
      setPanier(panierVide);
      localStorage.removeItem(PANIER_STORAGE_KEY);
      console.log('✅ Panier vidé');
    } catch (error: any) {
      console.error('Erreur vidage panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const synchroniserAvecBackend = async () => {
    if (!isAuthenticated || user?.role !== 'client') {
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Synchronisation du panier avec le backend...');

      // Récupérer le panier backend
      const panierBackend = await panierService.obtenirMonPanier();
      
      // Récupérer le panier local
      const panierLocalStr = localStorage.getItem(PANIER_STORAGE_KEY);
      
      if (panierLocalStr) {
        const panierLocal: PanierLocal = JSON.parse(panierLocalStr);
        
        // Fusionner : ajouter les items locaux au backend
        for (const item of panierLocal.items) {
          if (item.temporaire) {
            try {
              await panierService.ajouterAuPanier({
                produitId: item.produitId,
                quantite: item.quantite,
                taille: item.taille,
                couleur: item.couleur,
              });
              console.log('✅ Item temporaire ajouté au backend:', item.produitNom);
            } catch (error) {
              console.error('❌ Erreur ajout item au backend:', error);
            }
          }
        }
        
        // Recharger le panier depuis le backend
        const panierMisAJour = await panierService.obtenirMonPanier();
        setPanierDepuisBackend(panierMisAJour);
        
        // Nettoyer le localStorage
        localStorage.removeItem(PANIER_STORAGE_KEY);
        console.log('✅ Panier synchronisé avec le backend');
      } else {
        setPanierDepuisBackend(panierBackend);
      }
    } catch (error: any) {
      console.error('❌ Erreur synchronisation panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: PanierContextType = {
    panier,
    loading,
    nombreArticles: panier.nombreTotalArticles,
    ajouterAuPanier,
    modifierQuantite,
    retirerDuPanier,
    viderPanier,
    synchroniserAvecBackend,
    rafraichirPanier,
  };

  return <PanierContext.Provider value={value}>{children}</PanierContext.Provider>;
};
