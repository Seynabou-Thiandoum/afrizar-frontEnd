import { API_CONFIG } from '../config/api';

export interface FraisLivraison {
  id: number;
  nom: string;
  description: string;
  type: 'EXPRESS' | 'STANDARD';
  typeNom: string;
  typeDescription: string;
  frais: number;
  delaiMinJours: number;
  delaiMaxJours: number;
  actif: boolean;
  dateCreation: string;
  dateModification?: string;
  poidsMin?: number;
  poidsMax?: number;
  zone?: string;
}

export interface CalculFraisLivraisonRequest {
  type: string;
  poids?: number;
  zone?: string;
}

class FraisLivraisonService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // API publique (pas d'authentification requise)
  async obtenirOptionsLivraison(): Promise<FraisLivraison[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/frais-livraison`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des options de livraison:', error);
      throw error;
    }
  }

  async calculerFraisLivraison(type: string, poids?: number, zone?: string): Promise<FraisLivraison> {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      if (poids) params.append('poids', poids.toString());
      if (zone) params.append('zone', zone);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/frais-livraison/calculer?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du calcul des frais de livraison:', error);
      throw error;
    }
  }

  async obtenirTypesLivraison(): Promise<FraisLivraison[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/frais-livraison/types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des types de livraison:', error);
      throw error;
    }
  }

  // API admin (authentification requise)
  async obtenirTousLesFraisLivraison(page: number = 0, size: number = 20): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des frais de livraison:', error);
      throw error;
    }
  }

  async creerFraisLivraison(fraisLivraison: Partial<FraisLivraison>): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(fraisLivraison)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour créer des frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création des frais de livraison:', error);
      throw error;
    }
  }

  async mettreAJourFraisLivraison(id: number, fraisLivraison: Partial<FraisLivraison>): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(fraisLivraison)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des frais de livraison:', error);
      throw error;
    }
  }

  async supprimerFraisLivraison(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour supprimer les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des frais de livraison:', error);
      throw error;
    }
  }

  async activerFraisLivraison(id: number): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour activer les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'activation des frais de livraison:', error);
      throw error;
    }
  }

  async desactiverFraisLivraison(id: number): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}/desactiver`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour désactiver les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la désactivation des frais de livraison:', error);
      throw error;
    }
  }
}

export default new FraisLivraisonService();
