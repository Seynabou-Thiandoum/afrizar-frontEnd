import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  statut: 'ACTIF' | 'INACTIF' | 'ARCHIVE' | 'EN_ATTENTE_VALIDATION';
  vendeurId: number;
  nomVendeur: string;
  nomBoutique: string;
  dateCreation: string;
  photos?: string[];
}

export interface Vendor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nomBoutique: string;
  description: string;
  verifie: boolean;
  actif: boolean;
  rating: number;
  nombreEvaluations: number;
  dateCreation: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT';
  actif: boolean;
  dateCreation: string;
  derniereConnexion: string;
}

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

class AdminService {
  // ===================== GESTION DES PRODUITS =====================

  async getPendingProducts(page = 0, size = 20): Promise<{ content: Product[]; totalPages: number; totalElements: number }> {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_PRODUCTS_PENDING}?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits en attente');
    }

    return response.json();
  }

  async getAllProducts(page = 0, size = 20, statut?: string): Promise<{ content: Product[]; totalPages: number; totalElements: number }> {
    let url = `${API_ENDPOINTS.ADMIN_PRODUCTS_ALL}?page=${page}&size=${size}`;
    if (statut) {
      url += `&statut=${statut}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }

    return response.json();
  }

  async validateProduct(productId: number): Promise<Product> {
    const response = await fetch(API_ENDPOINTS.ADMIN_PRODUCT_VALIDATE(productId), {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation du produit');
    }

    return response.json();
  }

  async rejectProduct(productId: number, motif?: string): Promise<void> {
    let url = API_ENDPOINTS.ADMIN_PRODUCT_REJECT(productId);
    if (motif) {
      url += `?motif=${encodeURIComponent(motif)}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du rejet du produit');
    }
  }

  // ===================== GESTION DES VENDEURS =====================

  async getAllVendors(page = 0, size = 20, includeNonVerifies = true): Promise<{ content: Vendor[]; totalPages: number; totalElements: number }> {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_VENDORS_ALL}?page=${page}&size=${size}&includeNonVerifies=${includeNonVerifies}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des vendeurs');
    }

    return response.json();
  }

  async getUnverifiedVendors(): Promise<Vendor[]> {
    const response = await fetch(API_ENDPOINTS.ADMIN_VENDORS_UNVERIFIED, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des vendeurs non vérifiés');
    }

    return response.json();
  }

  async verifyVendor(vendorId: number): Promise<Vendor> {
    const response = await fetch(API_ENDPOINTS.ADMIN_VENDOR_VERIFY(vendorId), {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du vendeur');
    }

    return response.json();
  }

  async deactivateVendor(vendorId: number, motif?: string): Promise<void> {
    let url = API_ENDPOINTS.ADMIN_VENDOR_DEACTIVATE(vendorId);
    if (motif) {
      url += `?motif=${encodeURIComponent(motif)}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la désactivation du vendeur');
    }
  }

  async activateVendor(vendorId: number): Promise<Vendor> {
    const response = await fetch(API_ENDPOINTS.ADMIN_VENDOR_ACTIVATE(vendorId), {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'activation du vendeur');
    }

    return response.json();
  }

  // ===================== GESTION DES UTILISATEURS =====================

  async getAllUsers(page = 0, size = 20, role?: string): Promise<{ content: User[]; totalPages: number; totalElements: number }> {
    let url = `${API_ENDPOINTS.ADMIN_USERS_ALL}?page=${page}&size=${size}`;
    if (role) {
      url += `&role=${role}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return response.json();
  }

  async deactivateUser(userId: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.ADMIN_USER_DEACTIVATE(userId), {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la désactivation de l\'utilisateur');
    }
  }

  async activateUser(userId: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.ADMIN_USER_ACTIVATE(userId), {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'activation de l\'utilisateur');
    }
  }

  // ===================== STATISTIQUES =====================

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(API_ENDPOINTS.ADMIN_STATS_DASHBOARD, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }

    return response.json();
  }
}

export const adminService = new AdminService();
export default adminService;
