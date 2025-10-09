import { API_CONFIG } from '../config/api';

export interface Commission {
  id?: number;
  seuilMin: number;
  seuilMax: number | null;
  pourcentage: number;
  description: string;
  active: boolean;
  ordre: number;
}

export interface CalculCommissionResponse {
  montant: number;
  commission: number;
  total: number;
}

class CommissionService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getAllCommissions(): Promise<Commission[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commissions');
    }
    return response.json();
  }

  async getCommissionById(id: number): Promise<Commission> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Commission non trouvée');
    }
    return response.json();
  }

  async createCommission(commission: Omit<Commission, 'id'>): Promise<Commission> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(commission),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la commission');
    }
    return response.json();
  }

  async updateCommission(id: number, commission: Omit<Commission, 'id'>): Promise<Commission> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(commission),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la commission');
    }
    return response.json();
  }

  async deleteCommission(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la commission');
    }
  }

  async activateCommission(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/${id}/activer`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'activation de la commission");
    }
  }

  async deactivateCommission(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/${id}/desactiver`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la désactivation de la commission');
    }
  }

  async calculateCommission(montant: number): Promise<CalculCommissionResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/calculer?montant=${montant}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du calcul de la commission');
    }
    return response.json();
  }

  async initializeDefaultCommissions(): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/commissions/initialiser`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'initialisation des commissions');
    }
  }
}

export default new CommissionService();

