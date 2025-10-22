import { API_CONFIG } from '../config/api';
import authService from './authService';

export interface CreateCommandeDto {
  type?: 'IMMEDIATE' | 'DIFFEREE' | 'MIXTE';
  dateLivraisonSouhaitee?: string;
  notes?: string;
  pointsFideliteUtilises?: number;
  adresseLivraison?: string;
  ville?: string;
  pays?: string;
  codePostal?: string;
}

export interface Commande {
  id: number;
  numeroCommande: string;
  dateCreation: string;
  statut: string;
  type: string;
  montantHT: number;
  montantCommission: number;
  fraisLivraison: number;
  montantTotal: number;
  clientId: number;
  clientNom: string;
  lignesCommande: LigneCommande[];
}

export interface LigneCommande {
  id: number;
  produitId: number;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
  commission: number;
  taille?: string;
  personnalisation?: string;
}

class CommandeService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/client/commandes`;

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 CommandeService - Token ajouté:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ CommandeService - AUCUN TOKEN!');
    }

    return headers;
  }

  async creerCommandeDepuisPanier(dto: CreateCommandeDto): Promise<Commande> {
    try {
      console.log('📦 Création commande depuis panier:', dto);
      const response = await fetch(`${this.baseUrl}/depuis-panier`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors de la création de la commande');
      }

      const commande = await response.json();
      console.log('✅ Commande créée:', commande);
      return commande;
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      throw error;
    }
  }

  async obtenirMesCommandes(page: number = 0, size: number = 10): Promise<{
    content: Commande[];
    totalElements: number;
    totalPages: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/mes-commandes?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur récupération commandes:', error);
      throw error;
    }
  }

  async obtenirDetailsCommande(id: number): Promise<Commande> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur récupération commande:', error);
      throw error;
    }
  }

  async annulerCommande(id: number, motif?: string): Promise<Commande> {
    try {
      console.log(`🚫 Annulation commande ${id} - Motif:`, motif);
      const response = await fetch(`${this.baseUrl}/${id}/annuler`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: motif ? JSON.stringify(motif) : undefined,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la commande');
      }

      const commande = await response.json();
      console.log('✅ Commande annulée');
      return commande;
    } catch (error) {
      console.error('❌ Erreur annulation commande:', error);
      throw error;
    }
  }
}

export default new CommandeService();
