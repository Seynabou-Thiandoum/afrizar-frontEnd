import { API_CONFIG } from '../config/api';

export interface ProduitTendance {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  photos: string[];
  vendeurId: number;
  nomVendeur: string;
  nomBoutique: string;
  categorieId?: number;
  nomCategorie?: string;
  nombreVues: number;
  noteMoyenne: number;
  nombreEvaluations: number;
  statut: string;
  disponibilite: string;
  dateCreation: string;
}

export interface StatistiquesTendances {
  totalProduits: number;
  produitsEnStock: number;
  produitsPromo: number;
  produitsTendance: number;
  produitsPlusVus: number;
  produitsMieuxNotes: number;
  statsParCategorie?: Record<string, number>;
}

export interface ProduitsALaMode {
  produitsPlusVus: ProduitTendance[];
  produitsMieuxNotes: ProduitTendance[];
  produitsPromo: ProduitTendance[];
  produitsRecents: ProduitTendance[];
}

class TendanceService {
  private getHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Méthodes publiques (pas d'authentification requise)
  async obtenirProduitsALaMode(limit: number = 6): Promise<ProduitsALaMode> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/tendances/produits-a-la-mode?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits à la mode:', error);
      throw error;
    }
  }

  async obtenirProduitsTendance(limit: number = 12): Promise<ProduitTendance[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/tendances/produits-tendance?limit=${limit}`, {
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
      console.error('Erreur lors de la récupération des produits tendance:', error);
      throw error;
    }
  }

  async obtenirStatistiquesTendances(): Promise<StatistiquesTendances> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/tendances/statistiques-tendances`, {
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
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Méthodes admin (authentification requise)
  async obtenirProduitsALaModeAdmin(page: number = 0, size: number = 20): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/tendances/produits-a-la-mode?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à cette fonctionnalité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des produits à la mode admin:', error);
      throw error;
    }
  }

  async marquerProduitTendance(produitId: number, tendance: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/tendances/produits/${produitId}/marquer-tendance?tendance=${tendance}`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour effectuer cette action');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du marquage du produit comme tendance:', error);
      throw error;
    }
  }

  async mettreProduitEnPromotion(produitId: number, prixPromo: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/tendances/produits/${produitId}/mettre-en-promotion?prixPromo=${prixPromo}`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour effectuer cette action');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise en promotion du produit:', error);
      throw error;
    }
  }

  async obtenirStatistiquesTendancesAdmin(): Promise<StatistiquesTendances> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/tendances/statistiques-tendances`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux statistiques');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques admin:', error);
      throw error;
    }
  }

  async incrementerVuesProduit(produitId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/tendances/produits/${produitId}/incrementer-vues`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour effectuer cette action');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      throw error;
    }
  }
}

export default new TendanceService();
