import { API_CONFIG } from '../config/api';
import authService from './authService';

// Types
export interface DashboardStats {
  produits: {
    total: number;
    actifs: number;
    enAttente: number;
  };
  vendeurs: {
    total: number;
    verifies: number;
    nonVerifies: number;
  };
  clients: {
    total: number;
  };
  utilisateurs: {
    total: number;
    actifs: number;
    inactifs: number;
  };
}

export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  categorie: string;
  imageUrl?: string;
  stock: number;
  statut: 'EN_ATTENTE' | 'ACTIF' | 'REFUSE' | 'BROUILLON';
  vendeurId: number;
  vendeurNom?: string;
  dateCreation: string;
  dateModification?: string;
}

export interface Vendeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nomBoutique: string;
  description?: string;
  adresseBoutique?: string;
  specialites?: string;
  verifie: boolean;
  actif: boolean;
  dateCreation: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT';
  actif: boolean;
  dateCreation: string;
  derniereConnexion?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class AdminService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/admin`;

  // Headers avec authentification
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

  // ===================== STATISTIQUES =====================

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/statistiques/dashboard`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getDashboardStats:', error);
      throw error;
    }
  }

  // ===================== GESTION DES PRODUITS =====================

  async getProduitsEnAttente(page: number = 0, size: number = 20): Promise<PageResponse<Produit>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/produits/en-attente?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits en attente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getProduitsEnAttente:', error);
      throw error;
    }
  }

  async getTousLesProduits(
    page: number = 0,
    size: number = 20,
    statut?: string
  ): Promise<PageResponse<Produit>> {
    try {
      let url = `${this.baseUrl}/produits/tous?page=${page}&size=${size}`;
      if (statut) {
        url += `&statut=${statut}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getTousLesProduits:', error);
      throw error;
    }
  }

  async validerProduit(produitId: number): Promise<Produit> {
    try {
      const response = await fetch(`${this.baseUrl}/produits/${produitId}/valider`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la validation du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur validerProduit:', error);
      throw error;
    }
  }

  async rejeterProduit(produitId: number, motif?: string): Promise<{ message: string; motif: string }> {
    try {
      let url = `${this.baseUrl}/produits/${produitId}/rejeter`;
      if (motif) {
        url += `?motif=${encodeURIComponent(motif)}`;
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rejet du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur rejeterProduit:', error);
      throw error;
    }
  }

  // ===================== GESTION DES VENDEURS =====================

  async getTousLesVendeurs(
    page: number = 0,
    size: number = 20,
    includeNonVerifies: boolean = true
  ): Promise<PageResponse<Vendeur>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/vendeurs/tous?page=${page}&size=${size}&includeNonVerifies=${includeNonVerifies}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vendeurs');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getTousLesVendeurs:', error);
      throw error;
    }
  }

  async getVendeursNonVerifies(): Promise<Vendeur[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeurs/non-verifies`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vendeurs non vérifiés');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getVendeursNonVerifies:', error);
      throw error;
    }
  }

  async verifierVendeur(vendeurId: number): Promise<Vendeur> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeurs/${vendeurId}/verifier`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur verifierVendeur:', error);
      throw error;
    }
  }

  async desactiverVendeur(vendeurId: number, motif?: string): Promise<{ message: string; motif: string }> {
    try {
      let url = `${this.baseUrl}/vendeurs/${vendeurId}/desactiver`;
      if (motif) {
        url += `?motif=${encodeURIComponent(motif)}`;
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la désactivation du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur desactiverVendeur:', error);
      throw error;
    }
  }

  async activerVendeur(vendeurId: number): Promise<Vendeur> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeurs/${vendeurId}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'activation du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur activerVendeur:', error);
      throw error;
    }
  }

  // ===================== GESTION DES UTILISATEURS =====================

  async getTousLesUtilisateurs(
    page: number = 0,
    size: number = 20,
    role?: string
  ): Promise<PageResponse<Utilisateur>> {
    try {
      let url = `${this.baseUrl}/utilisateurs/tous?page=${page}&size=${size}`;
      if (role) {
        url += `&role=${role}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getTousLesUtilisateurs:', error);
      throw error;
    }
  }

  async desactiverUtilisateur(utilisateurId: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${utilisateurId}/desactiver`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la désactivation de l\'utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur desactiverUtilisateur:', error);
      throw error;
    }
  }

  async activerUtilisateur(utilisateurId: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${utilisateurId}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'activation de l\'utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur activerUtilisateur:', error);
      throw error;
    }
  }

  async publierVendeur(vendeurId: number): Promise<Vendeur> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeurs/${vendeurId}/publier`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la publication du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur publierVendeur:', error);
      throw error;
    }
  }

  async depublierVendeur(vendeurId: number): Promise<Vendeur> {
    try {
      const response = await fetch(`${this.baseUrl}/vendeurs/${vendeurId}/depublier`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la dépublication du vendeur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur depublierVendeur:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;

