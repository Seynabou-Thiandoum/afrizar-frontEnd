import { API_CONFIG } from '../config/api';

export interface Ticket {
  id: number;
  numero: string;
  clientId: number;
  clientNom: string;
  clientEmail: string;
  sujet: string;
  description: string;
  statut: 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'FERME';
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
  categorie: string;
  dateCreation: string;
  dateMiseAJour: string;
  dateResolution?: string;
  assigneA?: number;
  assigneNom?: string;
  reponses: TicketReponse[];
  commandeId?: number;
  numeroCommande?: string;
}

export interface TicketReponse {
  id: number;
  ticketId: number;
  auteurId: number;
  auteurNom: string;
  auteurRole: string;
  message: string;
  dateCreation: string;
  fichiers?: string[];
}

export interface TicketStats {
  ticketsOuverts: number;
  ticketsEnCours: number;
  ticketsResolus: number;
  ticketsFermes: number;
  tempsReponseMonyen: number;
  tauxResolution: number;
  satisfactionMoyenne: number;
}

export interface ClientSupport {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  nombreCommandes: number;
  nombreTickets: number;
  dernierContactDate: string;
  statut: string;
}

class SupportService {
  private getAuthHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Tickets
  async getAllTickets(): Promise<Ticket[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tickets');
    }
    return response.json();
  }

  async getTicketById(id: number): Promise<Ticket> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Ticket non trouvé');
    }
    return response.json();
  }

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ticket),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création du ticket');
    }
    return response.json();
  }

  async updateTicketStatut(id: number, statut: string): Promise<Ticket> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets/${id}/statut`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ statut }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
    return response.json();
  }

  async assignerTicket(id: number, supportId: number): Promise<Ticket> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets/${id}/assigner`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ supportId }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'assignation du ticket");
    }
    return response.json();
  }

  async ajouterReponse(ticketId: number, message: string): Promise<TicketReponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/tickets/${ticketId}/reponses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la réponse');
    }
    return response.json();
  }

  // Statistiques
  async getStats(): Promise<TicketStats> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/statistiques`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    return response.json();
  }

  // Clients
  async getClients(): Promise<ClientSupport[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/clients`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des clients');
    }
    return response.json();
  }

  async getClientById(id: number): Promise<ClientSupport> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/clients/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Client non trouvé');
    }
    return response.json();
  }

  // Commandes
  async getCommandesProbleme(): Promise<any[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/support/commandes/probleme`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes avec problèmes');
    }
    return response.json();
  }
}

export default new SupportService();

