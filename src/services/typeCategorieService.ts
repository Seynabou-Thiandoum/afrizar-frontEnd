import { api } from '../config/api';

export interface TypeCategorie {
  id: number;
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
  nombreGenres?: number;
}

export interface TypeCategorieFormData {
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
}

export const typeCategorieService = {
  // Créer un nouveau type
  async creerType(data: TypeCategorieFormData): Promise<TypeCategorie> {
    const response = await api.post('/types-categories', data);
    return response.data;
  },

  // Récupérer tous les types actifs
  async obtenirTousLesTypes(): Promise<TypeCategorie[]> {
    const response = await api.get('/types-categories');
    return response.data;
  },

  // Récupérer les types par catégorie
  async obtenirTypesParCategorie(type: 'VETEMENTS' | 'ACCESSOIRES'): Promise<TypeCategorie[]> {
    const response = await api.get(`/types-categories/par-type/${type}`);
    return response.data;
  },

  // Rechercher des types
  async rechercherTypes(nom: string): Promise<TypeCategorie[]> {
    const response = await api.get(`/types-categories/recherche?nom=${encodeURIComponent(nom)}`);
    return response.data;
  },

  // Obtenir les types populaires
  async obtenirTypesPopulaires(): Promise<TypeCategorie[]> {
    const response = await api.get('/types-categories/populaires');
    return response.data;
  },

  // Mettre à jour un type
  async mettreAJourType(id: number, data: TypeCategorieFormData): Promise<TypeCategorie> {
    const response = await api.put(`/types-categories/${id}`, data);
    return response.data;
  },

  // Activer un type
  async activerType(id: number): Promise<void> {
    await api.patch(`/types-categories/${id}/activer`);
  },

  // Désactiver un type
  async desactiverType(id: number): Promise<void> {
    await api.patch(`/types-categories/${id}/desactiver`);
  },

  // Supprimer un type
  async supprimerType(id: number): Promise<void> {
    await api.delete(`/types-categories/${id}`);
  },

  // Vérifier la disponibilité d'un nom
  async verifierNomDisponible(nom: string): Promise<boolean> {
    const response = await api.get(`/types-categories/nom/${encodeURIComponent(nom)}/disponible`);
    return response.data;
  },

  // Obtenir le nombre de genres utilisant ce type
  async getNombreGenres(id: number): Promise<number> {
    const response = await api.get(`/types-categories/${id}/statistiques/genres`);
    return response.data;
  }
};

