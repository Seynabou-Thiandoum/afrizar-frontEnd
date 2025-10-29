import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface VenteFlash {
  id?: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  actif?: boolean;
  pourcentageReductionParDefaut: number;
  tempsRestantMillisecondes?: number;
  estEnCours?: boolean;
}

const adminVentesFlashService = {
  getHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  async obtenirToutesLesVentesFlash(): Promise<VenteFlash[]> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/ventes-flash`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes flash:', error);
      throw error;
    }
  },

  async obtenirVenteFlash(id: number): Promise<VenteFlash> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${id}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la vente flash:', error);
      throw error;
    }
  },

  async creerVenteFlash(venteFlash: VenteFlash): Promise<VenteFlash> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash`,
        venteFlash,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la vente flash:', error);
      throw error;
    }
  },

  async modifierVenteFlash(id: number, venteFlash: VenteFlash): Promise<VenteFlash> {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${id}`,
        venteFlash,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de la vente flash:', error);
      throw error;
    }
  },

  async supprimerVenteFlash(id: number): Promise<void> {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la vente flash:', error);
      throw error;
    }
  },

  async basculerActif(id: number): Promise<VenteFlash> {
    try {
      const response = await axios.patch(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${id}/toggle`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du basculement actif:', error);
      throw error;
    }
  },

  // Gestion des produits
  async obtenirProduits(venteFlashId: number): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${venteFlashId}/produits`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  async ajouterProduit(venteFlashId: number, produitId: number, data: {
    prixPromotionnel: number;
    pourcentageReduction: number;
    quantiteStock?: number;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${venteFlashId}/produits/${produitId}`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  },

  async modifierProduit(venteFlashId: number, produitId: number, data: {
    prixPromotionnel: number;
    pourcentageReduction: number;
    quantiteStock?: number;
  }): Promise<any> {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${venteFlashId}/produits/${produitId}`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      throw error;
    }
  },

  async retirerProduit(venteFlashId: number, produitId: number): Promise<void> {
    try {
      await axios.delete(
        `${API_CONFIG.BASE_URL}/api/admin/ventes-flash/${venteFlashId}/produits/${produitId}`,
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Erreur lors du retrait du produit:', error);
      throw error;
    }
  },
};

export default adminVentesFlashService;
