// Types pour les vendeurs basés sur le backend VendeurController

export interface VendeurDto {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  nomBoutique: string;
  description?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  specialites?: string[];
  rating?: number;
  nombreEvaluations?: number;
  verifie?: boolean;
  vedette?: boolean;
  actif?: boolean;
  dateCreation?: string;
  dateModification?: string;
  tauxCommission?: number;
  nombreProduits?: number;
  nombreCommandes?: number;
  chiffreAffaires?: number;
  imageProfil?: string;
  imageCouverture?: string;
  siteWeb?: string;
  reseauxSociaux?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  horairesOuverture?: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  delaiLivraison?: string;
  fraisLivraison?: number;
  politiqueRetour?: string;
  certifications?: string[];
  languesParlees?: string[];
}

export interface VendeurCreateDto {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  nomBoutique: string;
  description?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  specialites?: string[];
  motDePasse: string;
}

export interface VendeurUpdateDto {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  nomBoutique?: string;
  description?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  specialites?: string[];
  imageProfil?: string;
  imageCouverture?: string;
  siteWeb?: string;
  reseauxSociaux?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  horairesOuverture?: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  delaiLivraison?: string;
  fraisLivraison?: number;
  politiqueRetour?: string;
  certifications?: string[];
  languesParlees?: string[];
}

export interface VendeurSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  terme?: string;
  specialite?: string;
  ville?: string;
  verifie?: boolean;
  vedette?: boolean;
  ratingMinimum?: number;
}

export interface VendeurPageResponse {
  content: VendeurDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface VendeurStats {
  nombreVendeursVerifies: number;
  nombreVendeursVedettes: number;
  nombreTotalVendeurs: number;
  chiffreAffairesTotal: number;
  moyenneRating: number;
}

export interface VendeurEvaluation {
  id?: number;
  vendeurId: number;
  clientId: number;
  note: number;
  commentaire?: string;
  dateCreation?: string;
  verifie?: boolean;
}

export interface VendeurCommission {
  vendeurId: number;
  tauxCommission: number;
  montantCommission: number;
  dateCalcul?: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Types pour les filtres et recherche
export interface VendeurFilters {
  specialites?: string[];
  villes?: string[];
  ratingMinimum?: number;
  prixMinimum?: number;
  prixMaximum?: number;
  verifie?: boolean;
  vedette?: boolean;
  actif?: boolean;
}

export interface VendeurSortOptions {
  field: 'nomBoutique' | 'rating' | 'dateCreation' | 'nombreProduits' | 'chiffreAffaires';
  direction: 'asc' | 'desc';
}

// Types pour les actions d'administration
export interface VendeurAdminAction {
  type: 'verifier' | 'annuler_verification' | 'marquer_vedette' | 'annuler_vedette' | 'activer' | 'desactiver' | 'supprimer';
  vendeurId: number;
  raison?: string;
  tauxCommission?: number;
}

// Types pour les statistiques détaillées
export interface VendeurDetailedStats {
  vendeur: VendeurDto;
  nombreProduits: number;
  nombreCommandes: number;
  chiffreAffaires: number;
  moyenneRating: number;
  nombreEvaluations: number;
  produitsPopulaires: Array<{
    id: number;
    nom: string;
    nombreVentes: number;
    chiffreAffaires: number;
  }>;
  evolutionVentes: Array<{
    mois: string;
    nombreCommandes: number;
    chiffreAffaires: number;
  }>;
  evaluationsRecentes: VendeurEvaluation[];
}
