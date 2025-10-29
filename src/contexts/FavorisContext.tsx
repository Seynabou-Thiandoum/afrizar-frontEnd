import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export const FavorisProvider: React.FC<FavorisProviderProps> = ({ children }) => {
  const [favoris, setFavoris] = useState<Set<number>>(new Set());
  const [favorisDetails, setFavorisDetails] = useState<Favori[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Charger les favoris au démarrage
  useEffect(() => {
    if (isAuthenticated && user) {
      chargerFavoris();
    } else {
      // Nettoyer les favoris si l'utilisateur n'est pas connecté
      setFavoris(new Set());
      setFavorisDetails([]);
    }
  }, [isAuthenticated, user]);

  const chargerFavoris = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const favorisData = await favorisService.obtenirFavoris();
      const favorisIds = new Set(favorisData.map(f => f.produitId));
      
      setFavoris(favorisIds);
      setFavorisDetails(favorisData);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      // En cas d'erreur, on garde les favoris locaux
    } finally {
      setLoading(false);
    }
  };

  const ajouterFavori = async (produitId: number) => {
    try {
      await favorisService.ajouterFavori(produitId);
      setFavoris(prev => new Set([...prev, produitId]));
      
      // Recharger les détails pour avoir les infos du produit
      await chargerFavoris();
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  };

  const supprimerFavori = async (produitId: number) => {
    try {
      await favorisService.supprimerFavori(produitId);
      setFavoris(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
      
      setFavorisDetails(prev => prev.filter(f => f.produitId !== produitId));
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  };

  const toggleFavori = async (produitId: number): Promise<boolean> => {
    try {
      const estFavori = favoris.has(produitId);
      
      if (estFavori) {
        await supprimerFavori(produitId);
        return false;
      } else {
        await ajouterFavori(produitId);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
      throw error;
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
  };

  return (
    <FavorisContext.Provider value={value}>
      {children}
    </FavorisContext.Provider>
  );
};

