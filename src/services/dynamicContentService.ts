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
  actif?: boolean;
}

export interface ProduitVenteFlash {
  produitId: number;
  nomProduit: string;
  imageUrl: string;
  prixOriginal: number;
  prixPromotionnel: number;
  pourcentageReduction: number;
  quantiteStock: number;
  quantiteVendue: number;
}

export interface VenteFlash {
  id?: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  actif?: boolean;
  pourcentageReductionParDefaut: number;
  tempsRestantMillisecondes?: number; // Timer en millisecondes
  estEnCours?: boolean;
  produits?: ProduitVenteFlash[];
}

class DynamicContentService {
  private baseUrl = API_CONFIG.BASE_URL;

  // ===== CAROUSEL =====
  async obtenirSlidesCarousel(): Promise<CarouselSlide[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/public/carousel/slides`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des slides du carousel');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des slides:', error);
      return [];
    }
  }

  // ===== VENTES FLASH =====
  async obtenirVenteFlashActive(): Promise<VenteFlash | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/public/ventes-flash/active`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Aucune vente flash active
        }
        throw new Error('Erreur lors de la récupération de la vente flash active');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la vente flash active:', error);
      return null;
    }
  }

  async obtenirVenteFlashAvecProduits(id: number): Promise<VenteFlash | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/public/ventes-flash/${id}/produits`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la vente flash avec produits');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la vente flash:', error);
      return null;
    }
  }

  async obtenirVentesFlashActives(): Promise<VenteFlash[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/public/ventes-flash/toutes`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des ventes flash');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes flash:', error);
      return [];
    }
  }

  // ===== UTILITAIRES =====
  formaterTimer(milliseconds: number): { heures: number; minutes: number; secondes: number } {
    const totalSecondes = Math.floor(milliseconds / 1000);
    const heures = Math.floor(totalSecondes / 3600);
    const minutes = Math.floor((totalSecondes % 3600) / 60);
    const secondes = totalSecondes % 60;
    
    return { heures, minutes, secondes };
  }

  formatTimerString(milliseconds: number): string {
    const { heures, minutes, secondes } = this.formaterTimer(milliseconds);
    return `${String(heures).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondes).padStart(2, '0')}`;
  }
}

export default new DynamicContentService();
