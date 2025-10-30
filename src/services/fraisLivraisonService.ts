import { API_CONFIG } from '../config/api';

export interface FraisLivraison {
  id: number;
  nom: string;
  description: string;
  type: 'RETRAIT_MAGASIN' | 'STANDARD' | 'EXPRESS' | 'URGENT';
  typeNom: string;
  typeDescription: string;
  frais: number;
  delaiMinJours: number;
  delaiMaxJours: number;
  actif: boolean;
  dateCreation: string;
  dateModification?: string;
  poidsMin?: number;
  poidsMax?: number;
  zone?: string;
}

export interface CalculFraisLivraisonRequest {
  type: string;
  poids?: number;
  zone?: string;
}

class FraisLivraisonService {
  private getHeaders() {
    const token = localStorage.getItem('afrizar_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // API publique (pas d'authentification requise)
  async obtenirOptionsLivraison(): Promise<FraisLivraison[]> {
    try {
      // Utiliser l'API existante pour obtenir la grille des tarifs
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/calculs/expedition/grille-tarifs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const grilleTarifs = await response.json();
      
      // Convertir la grille en format FraisLivraison[]
      const optionsLivraison: FraisLivraison[] = [];
      
      // Parcourir les destinations et types pour créer les options
      Object.keys(grilleTarifs).forEach(destination => {
        if (destination === 'notes') return; // Ignorer les notes
        
        const tarifsDestination = grilleTarifs[destination];
        Object.keys(tarifsDestination).forEach(type => {
          const detail = tarifsDestination[type];
          optionsLivraison.push({
            id: optionsLivraison.length + 1,
            nom: `${type} - ${destination}`,
            description: detail.description || `Livraison ${type.toLowerCase()} vers ${destination}`,
            type: type as any,
            typeNom: type,
            typeDescription: `Livraison ${type.toLowerCase()}`,
            frais: parseFloat(detail.coutPar1kg) || 0,
            delaiMinJours: Math.max(1, detail.delaiJours - 1),
            delaiMaxJours: detail.delaiJours + 1,
            actif: true,
            dateCreation: new Date().toISOString(),
            zone: destination
          });
        });
      });

      return optionsLivraison;
    } catch (error) {
      console.error('Erreur lors de la récupération des options de livraison:', error);
      throw error;
    }
  }

  async calculerFraisLivraison(type: string, poids?: number, zone?: string): Promise<FraisLivraison> {
    try {
      const params = new URLSearchParams();
      params.append('poids', (poids || 1).toString());
      params.append('pays', zone || 'SENEGAL');
      params.append('type', type);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/calculs/expedition?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const resultat = await response.json();
      
      // Convertir le résultat en format FraisLivraison
      return {
        id: 1,
        nom: `${type} - ${zone || 'SENEGAL'}`,
        description: `Livraison ${type.toLowerCase()} vers ${zone || 'SENEGAL'}`,
        type: type as any,
        typeNom: type,
        typeDescription: `Livraison ${type.toLowerCase()}`,
        frais: parseFloat(resultat.cout) || 0,
        delaiMinJours: 1,
        delaiMaxJours: 7,
        actif: true,
        dateCreation: new Date().toISOString(),
        zone: zone || 'SENEGAL'
      };
    } catch (error) {
      console.error('Erreur lors du calcul des frais de livraison:', error);
      throw error;
    }
  }

  async obtenirTypesLivraison(): Promise<FraisLivraison[]> {
    try {
      // Utiliser l'API existante pour obtenir tous les types
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/calculs/expedition/tous-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const types = await response.json();
      
      // Convertir en format FraisLivraison[]
      return types.map((type: any, index: number) => ({
        id: index + 1,
        nom: type.nom || type.type,
        description: type.description || `Type de livraison ${type.type}`,
        type: type.type,
        typeNom: type.nom || type.type,
        typeDescription: type.description || `Type de livraison ${type.type}`,
        frais: 0, // Sera calculé selon la destination
        delaiMinJours: type.delaiMin || 1,
        delaiMaxJours: type.delaiMax || 7,
        actif: true,
        dateCreation: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des types de livraison:', error);
      throw error;
    }
  }

  // API admin (authentification requise)
  async obtenirTousLesFraisLivraison(page: number = 0, size: number = 20): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour accéder aux frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des frais de livraison:', error);
      throw error;
    }
  }

  async creerFraisLivraison(fraisLivraison: Partial<FraisLivraison>): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(fraisLivraison)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour créer des frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création des frais de livraison:', error);
      throw error;
    }
  }

  async mettreAJourFraisLivraison(id: number, fraisLivraison: Partial<FraisLivraison>): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(fraisLivraison)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour modifier les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des frais de livraison:', error);
      throw error;
    }
  }

  async supprimerFraisLivraison(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour supprimer les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des frais de livraison:', error);
      throw error;
    }
  }

  async activerFraisLivraison(id: number): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}/activer`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour activer les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'activation des frais de livraison:', error);
      throw error;
    }
  }

  async desactiverFraisLivraison(id: number): Promise<FraisLivraison> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/frais-livraison/${id}/desactiver`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Veuillez vous connecter pour désactiver les frais de livraison');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la désactivation des frais de livraison:', error);
      throw error;
    }
  }
}

export default new FraisLivraisonService();


