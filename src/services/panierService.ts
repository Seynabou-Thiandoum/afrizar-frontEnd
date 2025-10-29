import { API_CONFIG } from '../config/api';
import authService from './authService';

export interface PanierItem {
  id: number;
  produitId: number;
  produitNom: string;
  produitDescription: string;
  produitPhotos: string[];
  prixUnitaire: number;
  quantite: number;
  taille?: string;
  couleur?: string;
  optionsPersonnalisation?: string;
  sousTotal: number;
  dateAjout: string;
  stockDisponible: number;
  vendeurNom: string;
  nomBoutique: string;
}

export interface Panier {
  id: number;
  clientId: number;
  clientNom: string;
  items: PanierItem[];
  montantTotal: number;
  nombreTotalArticles: number;
  dateCreation: string;
  dateModification?: string;
  actif: boolean;
}

export interface AjouterAuPanierDto {
  produitId: number;
  quantite: number;
  taille?: string;
  couleur?: string;
  optionsPersonnalisation?: string;
}

class PanierService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/panier`;

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

  async obtenirMonPanier(): Promise<Panier> {
    try {
      console.log('📦 Récupération du panier...');
      const response = await fetch(`${this.baseUrl}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à votre panier');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const panier = await response.json();
      console.log('✅ Panier récupéré:', panier);
      return panier;
    } catch (error) {
      console.error('❌ Erreur récupération panier:', error);
      throw error;
    }
  }

  async ajouterAuPanier(dto: AjouterAuPanierDto): Promise<Panier> {
    try {
      console.log('➕ Ajout au panier:', dto);
      const response = await fetch(`${this.baseUrl}/ajouter`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors de l\'ajout au panier');
      }

      const panier = await response.json();
      console.log('✅ Produit ajouté au panier');
      return panier;
    } catch (error) {
      console.error('❌ Erreur ajout panier:', error);
      throw error;
    }
  }

  async modifierQuantite(itemId: number, quantite: number): Promise<Panier> {
    try {
      console.log(`🔢 Modification quantité - Item: ${itemId}, Quantité: ${quantite}`);
      const response = await fetch(`${this.baseUrl}/item/${itemId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ quantite }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors de la modification');
      }

      const panier = await response.json();
      console.log('✅ Quantité modifiée');
      return panier;
    } catch (error) {
      console.error('❌ Erreur modification quantité:', error);
      throw error;
    }
  }

  async retirerDuPanier(itemId: number): Promise<Panier> {
    try {
      console.log(`🗑️ Retrait du panier - Item: ${itemId}`);
      const response = await fetch(`${this.baseUrl}/item/${itemId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors du retrait');
      }

      const panier = await response.json();
      console.log('✅ Article retiré du panier');
      return panier;
    } catch (error) {
      console.error('❌ Erreur retrait panier:', error);
      throw error;
    }
  }

  async viderPanier(): Promise<void> {
    try {
      console.log('🗑️ Vidage du panier...');
      const response = await fetch(`${this.baseUrl}/vider`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du vidage du panier');
      }

      console.log('✅ Panier vidé');
    } catch (error) {
      console.error('❌ Erreur vidage panier:', error);
      throw error;
    }
  }

  async synchroniserPanier(): Promise<Panier> {
    try {
      console.log('🔄 Synchronisation du panier...');
      const response = await fetch(`${this.baseUrl}/synchroniser`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation');
      }

      const panier = await response.json();
      console.log('✅ Panier synchronisé');
      return panier;
    } catch (error) {
      console.error('❌ Erreur synchronisation panier:', error);
      throw error;
    }
  }

  async obtenirNombreArticles(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/nombre-articles`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.nombreArticles || 0;
    } catch (error) {
      console.error('❌ Erreur nombre articles:', error);
      return 0;
    }
  }
}

export default new PanierService();




