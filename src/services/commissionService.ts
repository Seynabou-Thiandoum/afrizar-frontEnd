import { API_CONFIG } from '../config/api';

export interface Commission {
  id: number;
  clientId: number;
  commandeId: number;
  montantCommission: number;
  pourcentageCommission: number;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'PAYEE';
  dateCreation: string;
  dateValidation?: string;
  datePaiement?: string;
  commande: {
    id: number;
    numeroCommande: string;
    montantTotal: number;
    dateCreation: string;
  };
}

export interface SoldeCommission {
  soldeTotal: number;
  soldeDisponible: number;
  soldeEnAttente: number;
  soldePaye: number;
  nombreCommissions: number;
}

class CommissionService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async obtenirMesCommissions(): Promise<Commission[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions-clients/client`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à vos commissions');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des commissions:', error);
      throw error;
    }
  }

  async obtenirSoldeCommission(): Promise<SoldeCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions-clients/solde`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à votre solde');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      throw error;
    }
  }

  async demanderRetrait(montant: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions-clients/retrait`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ montant }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour demander un retrait');
        }
        if (response.status === 400) {
          throw new Error('Montant insuffisant ou invalide');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la demande de retrait:', error);
      throw error;
    }
  }

  async obtenirHistoriqueRetraits(): Promise<any[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions-clients/retraits`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à l\'historique');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }
}

export default new CommissionService();