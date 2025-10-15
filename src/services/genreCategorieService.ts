import { api } from '../config/api';

export interface GenreCategorie {
  id: number;
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
  nombreTypes?: number;
  typesAssocies?: TypeCategorie[];
}

export interface GenreCategorieFormData {
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
}

export interface TypeCategorie {
  id: number;
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
}

export const genreCategorieService = {
  // Créer un nouveau genre
  async creerGenre(data: GenreCategorieFormData): Promise<GenreCategorie> {
    const response = await api.post('/genres-categories', data);
    return response.data;
  },

  // Récupérer tous les genres actifs
  async obtenirTousLesGenres(): Promise<GenreCategorie[]> {
    const response = await api.get('/genres-categories');
    return response.data;
  },

  // Récupérer les genres par catégorie
  async obtenirGenresParCategorie(type: 'VETEMENTS' | 'ACCESSOIRES'): Promise<GenreCategorie[]> {
    const response = await api.get(`/genres-categories/par-type/${type}`);
    return response.data;
  },

  // Rechercher des genres
  async rechercherGenres(nom: string): Promise<GenreCategorie[]> {
    const response = await api.get(`/genres-categories/recherche?nom=${encodeURIComponent(nom)}`);
    return response.data;
  },

  // Obtenir les genres populaires
  async obtenirGenresPopulaires(): Promise<GenreCategorie[]> {
    const response = await api.get('/genres-categories/populaires');
    return response.data;
  },

  // Mettre à jour un genre
  async mettreAJourGenre(id: number, data: GenreCategorieFormData): Promise<GenreCategorie> {
    const response = await api.put(`/genres-categories/${id}`, data);
    return response.data;
  },

  // Activer un genre
  async activerGenre(id: number): Promise<void> {
    await api.patch(`/genres-categories/${id}/activer`);
  },

  // Désactiver un genre
  async desactiverGenre(id: number): Promise<void> {
    await api.patch(`/genres-categories/${id}/desactiver`);
  },

  // Supprimer un genre
  async supprimerGenre(id: number): Promise<void> {
    await api.delete(`/genres-categories/${id}`);
  },

  // Vérifier la disponibilité d'un nom
  async verifierNomDisponible(nom: string): Promise<boolean> {
    const response = await api.get(`/genres-categories/nom/${encodeURIComponent(nom)}/disponible`);
    return response.data;
  },

  // Obtenir le nombre de types associés à ce genre
  async getNombreTypes(id: number): Promise<number> {
    const response = await api.get(`/genres-categories/${id}/statistiques/types`);
    return response.data;
  }
};
