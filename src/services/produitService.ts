import { API_CONFIG } from '../config/api';
import authService from './authService';

export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  categorieId: number;
  categorieNom?: string;
  imageUrl?: string; // Garde pour compatibilité
  imagesSupplementaires?: string[];
  photos?: string[]; // Nouveau champ du backend
  stock: number;
  statut: 'EN_ATTENTE' | 'ACTIF' | 'REFUSE' | 'BROUILLON';
  vendeurId: number;
  vendeurNom?: string;
  vendeurBoutique?: string;
  taille?: string;
  couleur?: string;
  matiere?: string;
  poids?: number;
  dateCreation: string;
  dateModification?: string;
}

export interface CreateProduitDto {
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  categorieId: number;
  imageUrl?: string; // Garde pour compatibilité
  imagesSupplementaires?: string[];
  photos?: string[]; // Nouveau champ attendu par le backend
  stock: number;
  vendeurId: number;
  taille?: string;
  couleur?: string;
  matiere?: string;
  poids?: number;
}

class ProduitService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/produits`;

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

  async getAllProduits(page: number = 0, size: number = 20): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getAllProduits:', error);
      throw error;
    }
  }

  async getProduitsByVendeur(vendeurId: number): Promise<Produit[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeur/${vendeurId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getProduitsByVendeur:', error);
      throw error;
    }
  }

  async createProduit(produit: CreateProduitDto): Promise<Produit> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(produit),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur createProduit:', error);
      throw error;
    }
  }

  async updateProduit(id: number, produit: Partial<CreateProduitDto>): Promise<Produit> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(produit),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur updateProduit:', error);
      throw error;
    }
  }

  async deleteProduit(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }
    } catch (error) {
      console.error('Erreur deleteProduit:', error);
      throw error;
    }
  }
}

export const produitService = new ProduitService();
export default produitService;

