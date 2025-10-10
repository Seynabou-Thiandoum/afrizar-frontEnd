import { API_CONFIG } from '../config/api';

export interface LigneCommande {
  id?: number;
  produitId: number;
  nomProduit: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export interface Commande {
  id: number;
  numeroCommande: string;
  dateCreation: string;
  statut: string;
  type: string;
  dateLivraisonSouhaitee?: string;
  dateLivraisonEstimee?: string;
  montantHT: number;
  montantCommission: number;
  fraisLivraison: number;
  montantTotal: number;
  pointsFideliteUtilises: number;
  reduction: number;
  notes?: string;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
  lignesCommande: LigneCommande[];
}

export interface CommandePage {
  content: Commande[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CommandeStatistics {
  chiffreAffaires: number;
  panierMoyen: number;
  totalCommandes: number;
  commandesEnAttente: number;
  commandesConfirmees: number;
  commandesLivrees: number;
}

class CommandeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getAllCommandes(page = 0, size = 20): Promise<CommandePage> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    return response.json();
  }

  async getCommandeById(id: number): Promise<Commande> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Commande non trouvée');
    }
    return response.json();
  }

  async getCommandesByClient(clientId: number, page = 0, size = 10): Promise<CommandePage> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/client/${clientId}?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes du client');
    }
    return response.json();
  }

  async getCommandesByStatut(statut: string): Promise<Commande[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/statut/${statut}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes par statut');
    }
    return response.json();
  }

  async changeStatut(id: number, statut: string): Promise<Commande> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/${id}/statut?statut=${statut}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du changement de statut');
    }
    return response.json();
  }

  async confirmerCommande(id: number): Promise<Commande> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/${id}/confirmer`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la confirmation de la commande');
    }
    return response.json();
  }

  async annulerCommande(id: number, motif?: string): Promise<Commande> {
    const url = motif 
      ? `${API_CONFIG.BASE_URL}/commandes/${id}/annuler?motif=${encodeURIComponent(motif)}`
      : `${API_CONFIG.BASE_URL}/commandes/${id}/annuler`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'annulation de la commande");
    }
    return response.json();
  }

  async expedierCommande(id: number, numeroSuivi: string, transporteur: string): Promise<Commande> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/commandes/${id}/expedier?numeroSuivi=${encodeURIComponent(numeroSuivi)}&transporteur=${encodeURIComponent(transporteur)}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors de l'expédition de la commande");
    }
    return response.json();
  }

  async livrerCommande(id: number): Promise<Commande> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/${id}/livrer`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la livraison de la commande');
    }
    return response.json();
  }

  async getCommandesEnRetard(): Promise<Commande[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/en-retard`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes en retard');
    }
    return response.json();
  }

  async getChiffreAffaires(): Promise<number> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/statistiques/chiffre-affaires`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du chiffre d\'affaires');
    }
    return response.json();
  }

  async getPanierMoyen(): Promise<number> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/statistiques/panier-moyen`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du panier moyen');
    }
    return response.json();
  }

  async getCountByStatut(statut: string): Promise<number> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/commandes/statistiques/count/${statut}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du comptage des commandes');
    }
    return response.json();
  }

  async getStatistics(): Promise<CommandeStatistics> {
    try {
      const [
        chiffreAffaires,
        panierMoyen,
        enAttente,
        confirmees,
        livrees
      ] = await Promise.all([
        this.getChiffreAffaires(),
        this.getPanierMoyen(),
        this.getCountByStatut('EN_ATTENTE'),
        this.getCountByStatut('CONFIRMEE'),
        this.getCountByStatut('LIVREE')
      ]);

      return {
        chiffreAffaires,
        panierMoyen,
        totalCommandes: enAttente + confirmees + livrees,
        commandesEnAttente: enAttente,
        commandesConfirmees: confirmees,
        commandesLivrees: livrees
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }
}

export default new CommandeService();

