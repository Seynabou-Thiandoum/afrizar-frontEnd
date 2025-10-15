import { api } from '../config/api';

export interface CategorieCombinaison {
  id: number;
  genreId: number;
  nomGenre: string;
  typeId: number;
  nomType: string;
  ordre: number;
  active: boolean;
  affichage: string;
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

export interface GenreCategorie {
  id: number;
  nom: string;
  description?: string;
  type: 'VETEMENTS' | 'ACCESSOIRES';
  imageUrl?: string;
  ordre: number;
  active: boolean;
}

export const categorieCombinaisonService = {
  // Créer une nouvelle association
  async creerAssociation(genreId: number, typeId: number): Promise<CategorieCombinaison> {
    const response = await api.post('/categories-combinaisons', null, {
      params: { genreId, typeId }
    });
    return response.data;
  },

  // Récupérer toutes les associations actives
  async obtenirToutesLesAssociations(): Promise<CategorieCombinaison[]> {
    const response = await api.get('/categories-combinaisons');
    return response.data;
  },

  // Récupérer les types d'un genre
  async obtenirTypesParGenre(genreId: number): Promise<TypeCategorie[]> {
    const response = await api.get(`/categories-combinaisons/genres/${genreId}/types`);
    return response.data;
  },

  // Récupérer les genres d'un type
  async obtenirGenresParType(typeId: number): Promise<GenreCategorie[]> {
    const response = await api.get(`/categories-combinaisons/types/${typeId}/genres`);
    return response.data;
  },

  // Récupérer les associations par type de catégorie
  async obtenirAssociationsParCategorie(type: 'VETEMENTS' | 'ACCESSOIRES'): Promise<CategorieCombinaison[]> {
    const response = await api.get(`/categories-combinaisons/par-type/${type}`);
    return response.data;
  },

  // Vérifier si une association existe
  async verifierAssociation(genreId: number, typeId: number): Promise<boolean> {
    const response = await api.get('/categories-combinaisons/verifier', {
      params: { genreId, typeId }
    });
    return response.data;
  },

  // Mettre à jour l'ordre d'une association
  async mettreAJourOrdre(id: number, ordre: number): Promise<CategorieCombinaison> {
    const response = await api.put(`/categories-combinaisons/${id}/ordre`, null, {
      params: { ordre }
    });
    return response.data;
  },

  // Activer une association
  async activerAssociation(id: number): Promise<void> {
    await api.patch(`/categories-combinaisons/${id}/activer`);
  },

  // Désactiver une association
  async desactiverAssociation(id: number): Promise<void> {
    await api.patch(`/categories-combinaisons/${id}/desactiver`);
  },

  // Supprimer une association
  async supprimerAssociation(id: number): Promise<void> {
    await api.delete(`/categories-combinaisons/${id}`);
  },

  // Supprimer toutes les associations d'un genre
  async supprimerAssociationsParGenre(genreId: number): Promise<void> {
    await api.delete(`/categories-combinaisons/genres/${genreId}`);
  },

  // Supprimer toutes les associations d'un type
  async supprimerAssociationsParType(typeId: number): Promise<void> {
    await api.delete(`/categories-combinaisons/types/${typeId}`);
  },

  // Créer des associations en lot
  async creerAssociationsEnLot(genreIds: number[], typeIds: number[]): Promise<CategorieCombinaison[]> {
    const response = await api.post('/categories-combinaisons/en-lot', null, {
      params: { 
        genreIds: genreIds.join(','), 
        typeIds: typeIds.join(',') 
      }
    });
    return response.data;
  }
};
