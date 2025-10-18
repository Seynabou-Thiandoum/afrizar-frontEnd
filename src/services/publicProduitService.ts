import { API_CONFIG } from '../config/api';

export interface PublicProduit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromotionnel?: number;
  imageUrl?: string;
  stock: number;
  statut: string;
  taille?: string;
  couleur?: string;
  matiere?: string;
  poids?: number;
  dateCreation: string;
  vendeur: {
    id: number;
    nom: string;
    prenom: string;
    nomBoutique: string;
    photoUrl?: string;
  };
  categorie: {
    id: number;
    nom: string;
    type: string;
    genre: string;
    imageUrl?: string;
  };
}

export interface PublicProduitFilters {
  categorieId?: number;
  type?: string;
  genre?: string;
  prixMin?: number;
  prixMax?: number;
  search?: string;
  page?: number;
  size?: number;
}

class PublicProduitService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/public`;

  async getPublishedProduits(filters: PublicProduitFilters = {}): Promise<{
    content: PublicProduit[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.categorieId) params.append('categorieId', filters.categorieId.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.prixMin) params.append('prixMin', filters.prixMin.toString());
      if (filters.prixMax) params.append('prixMax', filters.prixMax.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());

      const url = `${this.baseUrl}/produits?${params.toString()}`;
      console.log('🔍 Récupération produits publics:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Produits récupérés:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur récupération produits:', error);
      throw new Error('Erreur lors de la récupération des produits');
    }
  }

  async getPublishedProduit(id: number): Promise<PublicProduit> {
    try {
      const response = await fetch(`${this.baseUrl}/produits/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur récupération produit:', error);
      throw new Error('Erreur lors de la récupération du produit');
    }
  }

  async getCategories(): Promise<{
    id: number;
    nom: string;
    type: string;
    genre: string;
    imageUrl?: string;
    sousCategories?: any[];
  }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur récupération catégories:', error);
      throw new Error('Erreur lors de la récupération des catégories');
    }
  }
}

export default new PublicProduitService();
