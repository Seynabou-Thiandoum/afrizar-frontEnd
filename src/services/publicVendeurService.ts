import { API_CONFIG } from '../config/api';

export interface PublicVendeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nomBoutique: string;
  description: string;
  adresseBoutique: string;
  photoUrl?: string;
  rating: number;
  nombreEvaluations: number;
  specialites: string;
  verifie: boolean;
  publie: boolean;
}

class PublicVendeurService {
  async getPublishedVendeurs(): Promise<PublicVendeur[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/vendeurs`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des vendeurs');
    }
    return response.json();
  }

  async getPublishedVendeur(id: number): Promise<PublicVendeur> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/public/vendeurs/${id}`);
    if (!response.ok) {
      throw new Error('Vendeur non trouvé');
    }
    return response.json();
  }
}

export default new PublicVendeurService();




