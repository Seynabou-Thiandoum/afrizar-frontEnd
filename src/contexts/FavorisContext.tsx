import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import favorisService, { Favori } from '../services/favorisService';
import { useAuth } from './AuthContext';

interface FavorisContextType {
  favoris: Set<number>;
  favorisDetails: Favori[];
  loading: boolean;
  ajouterFavori: (produitId: number) => Promise<void>;
  supprimerFavori: (produitId: number) => Promise<void>;
  toggleFavori: (produitId: number) => Promise<boolean>;
  estFavori: (produitId: number) => boolean;
  chargerFavoris: () => Promise<void>;
  nombreFavoris: number;
  synchroniserFavoris: () => Promise<void>;
}

const FavorisContext = createContext<FavorisContextType | undefined>(undefined);

export const useFavoris = () => {
  const context = useContext(FavorisContext);
  if (!context) {
    throw new Error('useFavoris doit être utilisé dans un FavorisProvider');
  }
  return context;
};

interface FavorisProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'afrizar_favoris_locaux';
const STORAGE_KEY_PENDING = 'afrizar_favoris_pending_sync';

export const FavorisProvider: React.FC<FavorisProviderProps> = ({ children }) => {
  const [favoris, setFavoris] = useState<Set<number>>(new Set());
  const [favorisDetails, setFavorisDetails] = useState<Favori[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // === FONCTIONS LOCALSTORAGE ===

  const chargerFavorisLocaux = useCallback(() => {
    try {
      const favorisLocaux = localStorage.getItem(STORAGE_KEY);
      if (favorisLocaux) {
        const favorisIds = JSON.parse(favorisLocaux);
        setFavoris(new Set(favorisIds));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris locaux:', error);
    }
  }, []);

  const sauvegarderFavorisLocaux = useCallback((favorisIds: number[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorisIds));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris locaux:', error);
    }
  }, []);

  const ajouterFavoriLocal = useCallback((produitId: number) => {
    setFavoris(prev => {
      const newSet = new Set(prev);
      newSet.add(produitId);
      sauvegarderFavorisLocaux(Array.from(newSet));
      return newSet;
    });
  }, [sauvegarderFavorisLocaux]);

  const supprimerFavoriLocal = useCallback((produitId: number) => {
    setFavoris(prev => {
      const newSet = new Set(prev);
      newSet.delete(produitId);
      sauvegarderFavorisLocaux(Array.from(newSet));
      return newSet;
    });
  }, [sauvegarderFavorisLocaux]);

  // === FONCTIONS SERVEUR ===

  const chargerFavoris = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const favorisData = await favorisService.obtenirFavoris();
      const favorisIds = new Set(favorisData.map(f => f.produitId));
      
      setFavoris(favorisIds);
      setFavorisDetails(favorisData);
      // Mettre à jour le localStorage avec les favoris du serveur
      sauvegarderFavorisLocaux(Array.from(favorisIds));
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      // En cas d'erreur, on garde les favoris locaux
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sauvegarderFavorisLocaux]);

  // Synchroniser les favoris locaux avec le serveur
  const synchroniserFavoris = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // Récupérer les favoris locaux
      const favorisLocaux = Array.from(favoris);
      
      // Récupérer les favoris du serveur
      const favorisServeur = await favorisService.obtenirFavoris();
      const favorisIdsServeur = favorisServeur.map(f => f.produitId);
      
      // Trouver les favoris qui sont locaux mais pas sur le serveur
      const favorisASynchroniser = favorisLocaux.filter(id => !favorisIdsServeur.includes(id));
      
      // Ajouter les favoris locaux au serveur
      for (const produitId of favorisASynchroniser) {
        try {
          await favorisService.ajouterFavori(produitId);
        } catch (error) {
          console.error(`Erreur lors de la synchronisation du favori ${produitId}:`, error);
        }
      }
      
      // Recharger les favoris après synchronisation
      await chargerFavoris();
    } catch (error) {
      console.error('Erreur lors de la synchronisation des favoris:', error);
    }
  }, [isAuthenticated, favoris, chargerFavoris]);

  // Charger les favoris locaux au démarrage
  useEffect(() => {
    chargerFavorisLocaux();
  }, [chargerFavorisLocaux]);

  // Synchroniser quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated && user) {
      synchroniserFavoris();
      chargerFavoris();
    }
  }, [isAuthenticated, user, synchroniserFavoris, chargerFavoris]);

  // Nettoyer quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      // On garde les favoris locaux pour les invités
      // Mais on vide les détails qui nécessitent une connexion
    }
  }, [isAuthenticated]);

  const ajouterFavori = async (produitId: number) => {
    // Toujours ajouter localement (même sans être connecté)
    ajouterFavoriLocal(produitId);

    // Si connecté, ajouter au serveur
    if (isAuthenticated) {
      try {
        await favorisService.ajouterFavori(produitId);
        // Recharger les détails pour avoir les infos du produit
        await chargerFavoris();
      } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris (serveur):', error);
        // On continue quand même, car le favori a été ajouté localement
      }
    }
  };

  const supprimerFavori = async (produitId: number) => {
    // Toujours supprimer localement (même sans être connecté)
    supprimerFavoriLocal(produitId);
    
    // Supprimer des détails si on a les détails en mémoire
    setFavorisDetails(prev => prev.filter(f => f.produitId !== produitId));

    // Si connecté, supprimer du serveur
    if (isAuthenticated) {
      try {
        await favorisService.supprimerFavori(produitId);
      } catch (error) {
        console.error('Erreur lors de la suppression des favoris (serveur):', error);
        // On continue quand même, car le favori a été supprimé localement
      }
    }
  };

  const toggleFavori = async (produitId: number): Promise<boolean> => {
    const estFavori = favoris.has(produitId);
    
    if (estFavori) {
      await supprimerFavori(produitId);
      return false;
    } else {
      await ajouterFavori(produitId);
      return true;
    }
  };

  const estFavori = (produitId: number): boolean => {
    return favoris.has(produitId);
  };

  const nombreFavoris = favoris.size;

  const value: FavorisContextType = {
    favoris,
    favorisDetails,
    loading,
    ajouterFavori,
    supprimerFavori,
    toggleFavori,
    estFavori,
    chargerFavoris,
    nombreFavoris,
    synchroniserFavoris,
  };

  return (
    <FavorisContext.Provider value={value}>
      {children}
    </FavorisContext.Provider>
  );
};

