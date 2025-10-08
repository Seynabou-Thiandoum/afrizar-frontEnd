import { API_CONFIG } from '../config/api';

// Types
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role: 'CLIENT' | 'VENDEUR';
  // Champs pour client
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  // Champs pour vendeur
  nomBoutique?: string;
  description?: string;
  adresseBoutique?: string;
  specialites?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  utilisateurId: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT';
  actif: boolean;
  // Propriétés spécifiques selon le rôle
  nomBoutique?: string;
  verifie?: boolean;
  pointsFidelite?: number;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT';
  actif: boolean;
  nomBoutique?: string;
  verifie?: boolean;
  pointsFidelite?: number;
}

class AuthService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/auth`;

  // Stocker le token
  setToken(token: string): void {
    localStorage.setItem('afrizar_token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('afrizar_token');
  }

  // Supprimer le token
  removeToken(): void {
    localStorage.removeItem('afrizar_token');
    localStorage.removeItem('afrizar_user');
  }

  // Stocker l'utilisateur
  setUser(user: User): void {
    localStorage.setItem('afrizar_user', JSON.stringify(user));
  }

  // Récupérer l'utilisateur
  getUser(): User | null {
    const userStr = localStorage.getItem('afrizar_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Headers avec authentification
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Connexion
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/connexion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          motDePasse: password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erreur || 'Erreur de connexion');
      }

      const data: AuthResponse = await response.json();
      
      // Stocker le token et les infos utilisateur
      this.setToken(data.token);
      const user: User = {
        id: data.utilisateurId,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
        actif: data.actif,
        nomBoutique: data.nomBoutique,
        verifie: data.verifie,
        pointsFidelite: data.pointsFidelite,
      };
      this.setUser(user);

      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erreur || 'Erreur d\'inscription');
      }

      const data: AuthResponse = await response.json();
      
      // Stocker le token et les infos utilisateur
      this.setToken(data.token);
      const user: User = {
        id: data.utilisateurId,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
        actif: data.actif,
        nomBoutique: data.nomBoutique,
        verifie: data.verifie,
        pointsFidelite: data.pointsFidelite,
      };
      this.setUser(user);

      return data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/deconnexion`, {
          method: 'POST',
          headers: this.getHeaders(),
        });
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      this.removeToken();
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Vérifier le rôle de l'utilisateur
  hasRole(role: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT'): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Vérifier si c'est un admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Vérifier si c'est un vendeur
  isVendeur(): boolean {
    return this.hasRole('VENDEUR');
  }

  // Vérifier si c'est un client
  isClient(): boolean {
    return this.hasRole('CLIENT');
  }

  // Vérifier si c'est un support
  isSupport(): boolean {
    return this.hasRole('SUPPORT');
  }

  // Valider le token
  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/valider-token`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valide === true;
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      return false;
    }
  }

  // Obtenir le profil
  async getProfile(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/profil`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
