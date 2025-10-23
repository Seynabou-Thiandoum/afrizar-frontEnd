import { API_CONFIG } from '../config/api';

export interface Actualite {
  id: number;
  titre: string;
  resume: string;
  contenu: string;
  imageUrl: string;
  auteur: string;
  datePublication: string;
  categorie: string;
  tags: string[];
  nombreLikes: number;
  nombreCommentaires: number;
  nombrePartages: number;
  estVisible: boolean;
  estTendance: boolean;
  dateCreation: string;
  dateModification?: string;
}

export interface CreateActualiteDto {
  titre: string;
  resume: string;
  contenu: string;
  imageUrl?: string;
  auteur: string;
  categorie?: string;
  tags?: string[];
  estVisible?: boolean;
  estTendance?: boolean;
}

class ActualiteService {
  private getHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Méthodes publiques (pas d'authentification requise)
  async obtenirActualitesPubliques(page: number = 0, size: number = 10): Promise<{ content: Actualite[], totalElements: number, totalPages: number }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/actualites?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      throw error;
    }
  }

  async obtenirActualitesTendance(): Promise<Actualite[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/actualites/tendances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités tendance:', error);
      throw error;
    }
  }

  async obtenirActualitesRecentes(limit: number = 5): Promise<Actualite[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/actualites/recentes?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités récentes:', error);
      throw error;
    }
  }

  async obtenirActualiteParId(id: number): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/actualites/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'actualité:', error);
      throw error;
    }
  }

  // Méthodes admin (authentification requise)
  async obtenirToutesLesActualites(page: number = 0, size: number = 20): Promise<{ content: Actualite[], totalElements: number, totalPages: number }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder à cette fonctionnalité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités admin:', error);
      throw error;
    }
  }

  async creerActualite(actualite: CreateActualiteDto): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(actualite)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour créer une actualité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'actualité:', error);
      throw error;
    }
  }

  async mettreAJourActualite(id: number, actualite: CreateActualiteDto): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(actualite)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier cette actualité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'actualité:', error);
      throw error;
    }
  }

  async supprimerActualite(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour supprimer cette actualité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'actualité:', error);
      throw error;
    }
  }

  async changerVisibiliteActualite(id: number, visible: boolean): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/${id}/visibilite?visible=${visible}`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier la visibilité');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      throw error;
    }
  }

  async marquerActualiteTendance(id: number, tendance: boolean): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/${id}/tendance?tendance=${tendance}`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier le statut tendance');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du marquage tendance:', error);
      throw error;
    }
  }

  async incrementerLikes(id: number): Promise<Actualite> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/${id}/likes`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour incrémenter les likes');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des likes:', error);
      throw error;
    }
  }

  async obtenirStatistiquesActualites(): Promise<{ totalActualites: number; actualitesVisibles: number; actualitesTendance: number }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/actualites/statistiques`, {
        method: 'GET',
        headers: this.getHeaders()
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

export default new ActualiteService();
