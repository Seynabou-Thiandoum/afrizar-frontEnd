import { API_CONFIG } from '../config/api';
import authService from './authService';

export interface Categorie {
  id: number;
  nom: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  icone?: string;
  active: boolean;
  ordre: number;
  genre?: 'HOMME' | 'FEMME' | 'ENFANT';
  type?: 'VETEMENTS' | 'ACCESSOIRES';
  parentId?: number;
  nomParent?: string;
  sousCategories?: Categorie[];
  nombreProduits?: number;
  dateCreation?: string;
}

class CategorieService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/categories`;

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getAllCategories(): Promise<Categorie[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getAllCategories:', error);
      throw error;
    }
  }

  async createCategorie(categorie: Partial<Categorie>): Promise<Categorie> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(categorie),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la catégorie');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur createCategorie:', error);
      throw error;
    }
  }

  async updateCategorie(id: number, categorie: Partial<Categorie>): Promise<Categorie> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(categorie),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la catégorie');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur updateCategorie:', error);
      throw error;
    }
  }

  async deleteCategorie(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la catégorie');
      }
    } catch (error) {
      console.error('Erreur deleteCategorie:', error);
      throw error;
    }
  }

  async activerCategorie(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'activation de la catégorie');
      }
    } catch (error) {
      console.error('Erreur activerCategorie:', error);
      throw error;
    }
  }

  async desactiverCategorie(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/desactiver`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la désactivation de la catégorie');
      }
    } catch (error) {
      console.error('Erreur desactiverCategorie:', error);
      throw error;
    }
  }

  // Nouvelles méthodes pour la hiérarchie
  async getCategoriesRacines(): Promise<Categorie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/racines`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories racines');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getCategoriesRacines:', error);
      throw error;
    }
  }

  async getSousCategories(parentId: number): Promise<Categorie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${parentId}/sous-categories`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des sous-catégories');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getSousCategories:', error);
      throw error;
    }
  }

  async getHierarchieComplete(): Promise<Categorie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/hierarchie`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la hiérarchie');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getHierarchieComplete:', error);
      throw error;
    }
  }

  async getCategorieBySlug(slug: string): Promise<Categorie> {
    try {
      const response = await fetch(`${this.baseUrl}/slug/${slug}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la catégorie');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getCategorieBySlug:', error);
      throw error;
    }
  }
}

export const categorieService = new CategorieService();
export default categorieService;

