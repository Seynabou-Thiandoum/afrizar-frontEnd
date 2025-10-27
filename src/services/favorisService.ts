import { API_CONFIG } from '../config/api';

export interface Favori {
  id: number;
  produitId: number;
  utilisateurId: number;
  dateAjout: string;
  produit?: {
    id: number;
    nom: string;
    prix: number;
    imageUrl: string;
    description: string;
    vendeur: {
      nomBoutique: string;
    };
  };
}

class FavorisService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/client/favoris`;

  // Obtenir les favoris de l'utilisateur
  async obtenirFavoris(): Promise<Favori[]> {
    try {
      const token = localStorage.getItem('afrizar_token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${this.baseUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des favoris');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  }

  // Ajouter un produit aux favoris
  async ajouterFavori(produitId: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('afrizar_token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produitId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout aux favoris');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  }

  // Supprimer un produit des favoris
  async supprimerFavori(produitId: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('afrizar_token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${this.baseUrl}/${produitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des favoris');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  }

  // Vérifier si un produit est en favori
  async estFavori(produitId: number): Promise<boolean> {
    try {
      const favoris = await this.obtenirFavoris();
      return favoris.some(favori => favori.produitId === produitId);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
      return false;
    }
  }

  // Toggle favori (ajouter ou supprimer)
  async toggleFavori(produitId: number): Promise<boolean> {
    try {
      const estFavori = await this.estFavori(produitId);
      
      if (estFavori) {
        await this.supprimerFavori(produitId);
        return false;
      } else {
        await this.ajouterFavori(produitId);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
      throw error;
    }
  }

  // Compter le nombre de favoris
  async compterFavoris(): Promise<number> {
    try {
      const favoris = await this.obtenirFavoris();
      return favoris.length;
    } catch (error) {
      console.error('Erreur lors du comptage des favoris:', error);
      return 0;
    }
  }
}

export default new FavorisService();