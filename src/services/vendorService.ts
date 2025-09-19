import { 
  VendeurDto, 
  VendeurCreateDto, 
  VendeurUpdateDto, 
  VendeurSearchParams, 
  VendeurPageResponse,
  VendeurStats,
  VendeurEvaluation,
  VendeurDetailedStats,
  VendeurFilters,
  VendeurSortOptions,
  ApiResponse,
  ApiError
} from '../types/vendor';

import { API_ENDPOINTS, DEFAULT_HEADERS, ERROR_MESSAGES } from '../config/api';

// Configuration de l'API
const API_BASE_URL = API_ENDPOINTS.VENDORS.replace('/api/vendeurs', '');
const VENDORS_ENDPOINT = API_ENDPOINTS.VENDORS;

// Classe pour gérer les erreurs API
class ApiErrorHandler extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiErrorHandler';
  }
}

// Fonction utilitaire pour gérer les réponses HTTP
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    let errorCode: string | undefined;
    let errorDetails: any;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorCode = errorData.code;
      errorDetails = errorData.details;
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiErrorHandler(errorMessage, response.status, errorCode, errorDetails);
  }

  // Si la réponse est vide (status 204), retourner null
  if (response.status === 204) {
    return null as T;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiErrorHandler('Erreur lors du parsing de la réponse JSON');
  }
}

// Fonction utilitaire pour construire les paramètres de requête
function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  return searchParams.toString();
}

// Service principal pour les vendeurs
export class VendorService {
  // Créer un nouveau vendeur
  static async createVendor(vendorData: VendeurCreateDto): Promise<VendeurDto> {
    const response = await fetch(VENDORS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    return handleResponse<VendeurDto>(response);
  }

  // Obtenir un vendeur par ID
  static async getVendorById(id: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}`);
    return handleResponse<VendeurDto>(response);
  }

  // Obtenir un vendeur par email
  static async getVendorByEmail(email: string): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/email/${encodeURIComponent(email)}`);
    return handleResponse<VendeurDto>(response);
  }

  // Lister tous les vendeurs avec pagination
  static async getVendors(params: VendeurSearchParams = {}): Promise<VendeurPageResponse> {
    const queryParams = buildQueryParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'dateCreation',
      sortDir: params.sortDir || 'desc',
    });

    const response = await fetch(`${VENDORS_ENDPOINT}?${queryParams}`);
    return handleResponse<VendeurPageResponse>(response);
  }

  // Obtenir les vendeurs vérifiés
  static async getVerifiedVendors(): Promise<VendeurDto[]> {
    const response = await fetch(API_ENDPOINTS.VENDORS_VERIFIED, {
      headers: DEFAULT_HEADERS,
    });
    return handleResponse<VendeurDto[]>(response);
  }

  // Obtenir les vendeurs avec rating minimum
  static async getVendorsByMinimumRating(rating: number): Promise<VendeurDto[]> {
    const response = await fetch(`${VENDORS_ENDPOINT}/rating-minimum/${rating}`, {
      headers: DEFAULT_HEADERS,
    });
    return handleResponse<VendeurDto[]>(response);
  }

  // Rechercher des vendeurs
  static async searchVendors(searchTerm: string): Promise<VendeurDto[]> {
    const response = await fetch(`${API_ENDPOINTS.VENDORS_SEARCH}?terme=${encodeURIComponent(searchTerm)}`, {
      headers: DEFAULT_HEADERS,
    });
    return handleResponse<VendeurDto[]>(response);
  }

  // Mettre à jour un vendeur
  static async updateVendor(id: number, vendorData: VendeurUpdateDto): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    return handleResponse<VendeurDto>(response);
  }

  // Vérifier un vendeur
  static async verifyVendor(id: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/verifier`, {
      method: 'PATCH',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Annuler la vérification d'un vendeur
  static async unverifyVendor(id: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/annuler-verification`, {
      method: 'PATCH',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Définir une commission personnalisée
  static async setCustomCommission(id: number, tauxCommission: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/commission?tauxCommission=${tauxCommission}`, {
      method: 'PATCH',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Ajouter une évaluation à un vendeur
  static async addEvaluation(id: number, note: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/evaluation?note=${note}`, {
      method: 'POST',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Désactiver un vendeur
  static async deactivateVendor(id: number): Promise<void> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/desactiver`, {
      method: 'PATCH',
    });

    return handleResponse<void>(response);
  }

  // Activer un vendeur
  static async activateVendor(id: number): Promise<void> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/activer`, {
      method: 'PATCH',
    });

    return handleResponse<void>(response);
  }

  // Supprimer un vendeur
  static async deleteVendor(id: number): Promise<void> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    return handleResponse<void>(response);
  }

  // Obtenir les statistiques des produits d'un vendeur
  static async getVendorProductStats(id: number): Promise<number> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/statistiques/produits`);
    return handleResponse<number>(response);
  }

  // Compter les vendeurs vérifiés
  static async getVerifiedVendorsCount(): Promise<number> {
    const response = await fetch(`${VENDORS_ENDPOINT}/statistiques/count/verifies`);
    return handleResponse<number>(response);
  }

  // Vérifier la disponibilité d'un email
  static async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await fetch(`${VENDORS_ENDPOINT}/email/${encodeURIComponent(email)}/disponible`);
    return handleResponse<boolean>(response);
  }

  // Obtenir les vendeurs vedettes
  static async getFeaturedVendors(): Promise<VendeurDto[]> {
    const response = await fetch(`${VENDORS_ENDPOINT}/vedettes`);
    return handleResponse<VendeurDto[]>(response);
  }

  // Obtenir les vendeurs par spécialité
  static async getVendorsBySpecialty(specialty: string): Promise<VendeurDto[]> {
    const response = await fetch(`${VENDORS_ENDPOINT}/specialite/${encodeURIComponent(specialty)}`);
    return handleResponse<VendeurDto[]>(response);
  }

  // Marquer un vendeur comme vedette
  static async markVendorAsFeatured(id: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/vedette`, {
      method: 'PATCH',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Annuler le statut vedette d'un vendeur
  static async unmarkVendorAsFeatured(id: number): Promise<VendeurDto> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/annuler-vedette`, {
      method: 'PATCH',
    });

    return handleResponse<VendeurDto>(response);
  }

  // Méthodes avancées de recherche et filtrage
  static async searchVendorsAdvanced(filters: VendeurFilters, sortOptions?: VendeurSortOptions): Promise<VendeurDto[]> {
    const queryParams = buildQueryParams({
      ...filters,
      sortBy: sortOptions?.field,
      sortDir: sortOptions?.direction,
    });

    const response = await fetch(`${VENDORS_ENDPOINT}/recherche-avancee?${queryParams}`);
    return handleResponse<VendeurDto[]>(response);
  }

  // Obtenir les statistiques détaillées d'un vendeur
  static async getVendorDetailedStats(id: number): Promise<VendeurDetailedStats> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${id}/statistiques-detaillees`);
    return handleResponse<VendeurDetailedStats>(response);
  }

  // Obtenir les statistiques globales
  static async getGlobalStats(): Promise<VendeurStats> {
    const response = await fetch(`${VENDORS_ENDPOINT}/statistiques-globales`);
    return handleResponse<VendeurStats>(response);
  }

  // Méthodes utilitaires
  static async uploadVendorImage(vendorId: number, imageFile: File, type: 'profil' | 'couverture'): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);

    const response = await fetch(`${VENDORS_ENDPOINT}/${vendorId}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const result = await handleResponse<{ imageUrl: string }>(response);
    return result.imageUrl;
  }

  // Obtenir les évaluations d'un vendeur
  static async getVendorEvaluations(vendorId: number, page: number = 0, size: number = 10): Promise<{
    content: VendeurEvaluation[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await fetch(`${VENDORS_ENDPOINT}/${vendorId}/evaluations?page=${page}&size=${size}`);
    return handleResponse<{
      content: VendeurEvaluation[];
      totalElements: number;
      totalPages: number;
    }>(response);
  }
}

// Hook personnalisé pour la gestion des vendeurs
export const useVendorService = () => {
  return {
    // Création et lecture
    createVendor: VendorService.createVendor,
    getVendorById: VendorService.getVendorById,
    getVendorByEmail: VendorService.getVendorByEmail,
    getVendors: VendorService.getVendors,
    
    // Recherche et filtrage
    searchVendors: VendorService.searchVendors,
    searchVendorsAdvanced: VendorService.searchVendorsAdvanced,
    getVerifiedVendors: VendorService.getVerifiedVendors,
    getFeaturedVendors: VendorService.getFeaturedVendors,
    getVendorsBySpecialty: VendorService.getVendorsBySpecialty,
    getVendorsByMinimumRating: VendorService.getVendorsByMinimumRating,
    
    // Mise à jour et gestion
    updateVendor: VendorService.updateVendor,
    verifyVendor: VendorService.verifyVendor,
    unverifyVendor: VendorService.unverifyVendor,
    activateVendor: VendorService.activateVendor,
    deactivateVendor: VendorService.deactivateVendor,
    deleteVendor: VendorService.deleteVendor,
    
    // Gestion des vedettes
    markVendorAsFeatured: VendorService.markVendorAsFeatured,
    unmarkVendorAsFeatured: VendorService.unmarkVendorAsFeatured,
    
    // Commissions et évaluations
    setCustomCommission: VendorService.setCustomCommission,
    addEvaluation: VendorService.addEvaluation,
    getVendorEvaluations: VendorService.getVendorEvaluations,
    
    // Statistiques
    getVendorProductStats: VendorService.getVendorProductStats,
    getVendorDetailedStats: VendorService.getVendorDetailedStats,
    getGlobalStats: VendorService.getGlobalStats,
    getVerifiedVendorsCount: VendorService.getVerifiedVendorsCount,
    
    // Utilitaires
    checkEmailAvailability: VendorService.checkEmailAvailability,
    uploadVendorImage: VendorService.uploadVendorImage,
  };
};

// Export de la classe d'erreur pour utilisation dans les composants
export { ApiErrorHandler };
