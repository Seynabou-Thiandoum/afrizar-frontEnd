import { API_CONFIG } from '../config/api';

export interface CarouselSlide {
  id?: number;
  titre: string;
  sousTitre: string;
  imageUrl: string;
  badge: string;
  boutonTexte: string;
  boutonLien: string;
  ordreAffichage: number;
}

class AdminCarouselService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async getHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Obtenir tous les slides
  async obtenirTousLesSlides(): Promise<CarouselSlide[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/carousel`, {
        headers: await this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des slides');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Créer un nouveau slide
  async creerSlide(slide: CarouselSlide): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/carousel`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(slide),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Modifier un slide
  async modifierSlide(id: number, slide: CarouselSlide): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/carousel/${id}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(slide),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Supprimer un slide
  async supprimerSlide(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/carousel/${id}`, {
        method: 'DELETE',
        headers: await this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du slide');
      }
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }

  // Basculer l'état actif/inactif
  async basculerActif(id: number): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/carousel/${id}/toggle`, {
        method: 'PATCH',
        headers: await this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Erreur lors du basculement');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}

export default new AdminCarouselService();
