import { API_CONFIG } from '../config/api';

export interface Favori {
  id: number;
  clientId: number;
  produitId: number;
  produitNom: string;
  produitImageUrl: string;
  produitPrix: number;
  vendeurNom: string;
  dateAjout: string;
}

class FavorisService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async obtenirMesFavoris(): Promise<Favori[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/client/favoris`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à vos favoris');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  }

  async ajouterAuxFavoris(produitId: number): Promise<Favori> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/client/favoris`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ produitId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour ajouter aux favoris');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de l\'ajout aux favoris');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  }

  async retirerDesFavoris(favoriId: number): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/client/favoris/${favoriId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour retirer des favoris');
        }
        if (response.status === 404) {
          throw new Error('Favori non trouvé');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      throw error;
    }
  }

  async verifierEstFavori(produitId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/client/favoris/verifier/${produitId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.estFavori;
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  }

  async compterFavoris(): Promise<number> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/client/favoris/count`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Erreur lors du comptage des favoris:', error);
      return 0;
    }
  }
}

export default new FavorisService();
