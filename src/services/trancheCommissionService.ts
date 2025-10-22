import { API_CONFIG } from '../config/api';

export interface TrancheCommission {
  id: number;
  seuilMin: number;
  seuilMax: number | null;
  pourcentage: number;
  description: string;
  active: boolean;
  ordre: number;
}

export interface SimulationCommission {
  montant: number;
  trancheApplicable: TrancheCommission;
  pourcentageCommission: number;
  montantCommission: number;
  prixFinal: number;
  devise: string;
}

export interface StatistiquesCommission {
  nombreTotalTranches: number;
  nombreTranchesActives: number;
  nombreTranchesInactives: number;
  tranchesActives: TrancheCommission[];
  montantMinimum: number;
  montantMaximum: number | null;
}

class TrancheCommissionService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Obtenir toutes les tranches de commission
  async getAllCommissions(): Promise<TrancheCommission[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux commissions');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des commissions:', error);
      throw error;
    }
  }

  // Obtenir une tranche par ID
  async getCommissionById(id: number): Promise<TrancheCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux commissions');
        }
        if (response.status === 404) {
          throw new Error('Commission non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la commission:', error);
      throw error;
    }
  }

  // Créer une nouvelle tranche
  async createCommission(commission: Partial<TrancheCommission>): Promise<TrancheCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(commission),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour créer une commission');
        }
        if (response.status === 400) {
          throw new Error('Données invalides');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la commission:', error);
      throw error;
    }
  }

  // Mettre à jour une tranche
  async updateCommission(id: number, commission: Partial<TrancheCommission>): Promise<TrancheCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(commission),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier une commission');
        }
        if (response.status === 404) {
          throw new Error('Commission non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commission:', error);
      throw error;
    }
  }

  // Supprimer une tranche
  async deleteCommission(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour supprimer une commission');
        }
        if (response.status === 404) {
          throw new Error('Commission non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la commission:', error);
      throw error;
    }
  }

  // Activer une tranche
  async activateCommission(id: number): Promise<TrancheCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/${id}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour activer une commission');
        }
        if (response.status === 404) {
          throw new Error('Commission non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'activation de la commission:', error);
      throw error;
    }
  }

  // Désactiver une tranche
  async deactivateCommission(id: number): Promise<TrancheCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/${id}/desactiver`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour désactiver une commission');
        }
        if (response.status === 404) {
          throw new Error('Commission non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la désactivation de la commission:', error);
      throw error;
    }
  }

  // Simuler une commission
  async simulateCommission(montant: number): Promise<SimulationCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/simulation?montant=${montant}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour simuler une commission');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la simulation de la commission:', error);
      throw error;
    }
  }

  // Obtenir les statistiques
  async getStatistics(): Promise<StatistiquesCommission> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/commissions/statistiques`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux statistiques');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export default new TrancheCommissionService();
