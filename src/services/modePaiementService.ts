import { api } from "../config/api";

export interface ModePaiement {
  id: number;
  nom: string;
  code: string;
  type: TypePaiement;
  description?: string;
  logo?: string;
  actif: boolean;
  instructions?: string;
  fraisPourcentage?: number;
  fraisFixe?: number;
  montantMinimum?: number;
  montantMaximum?: number;
  paysSupportes?: string;
  delaiTraitement?: number;
  ordre: number;
  environnement: Environnement;
  dateCreation?: string;
  dateModification?: string;
}

export enum TypePaiement {
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  MOBILE_MONEY = 'MOBILE_MONEY',
  VIREMENT_BANCAIRE = 'VIREMENT_BANCAIRE',
  CASH = 'CASH',
  PORTEFEUILLE = 'PORTEFEUILLE',
  CRYPTO = 'CRYPTO',
  POINTS_FIDELITE = 'POINTS_FIDELITE'
}

export enum Environnement {
  TEST = 'TEST',
  PRODUCTION = 'PRODUCTION'
}

export interface ModePaiementCreate {
  nom: string;
  code: string;
  type: TypePaiement;
  description?: string;
  logo?: string;
  actif: boolean;
  configuration?: string;
  instructions?: string;
  fraisPourcentage?: number;
  fraisFixe?: number;
  montantMinimum?: number;
  montantMaximum?: number;
  paysSupportes?: string;
  delaiTraitement?: number;
  ordre: number;
  callbackUrl?: string;
  environnement: Environnement;
}

export interface ModePaiementUpdate {
  nom?: string;
  code?: string;
  type?: TypePaiement;
  description?: string;
  logo?: string;
  actif?: boolean;
  configuration?: string;
  instructions?: string;
  fraisPourcentage?: number;
  fraisFixe?: number;
  montantMinimum?: number;
  montantMaximum?: number;
  paysSupportes?: string;
  delaiTraitement?: number;
  ordre?: number;
  callbackUrl?: string;
  environnement?: Environnement;
}

export interface ModePaiementConfig {
  modePaiementId: number;
  configuration: string;
  callbackUrl?: string;
}

/**
 * Service pour gérer les modes de paiement
 */
const modePaiementService = {
  /**
   * Récupère tous les modes de paiement actifs (public)
   */
  getActivesModesPaiement: async (): Promise<ModePaiement[]> => {
    const response = await api.get('/public/modes-paiement');
    return response.data;
  },

  /**
   * Récupère un mode de paiement par code (public)
   */
  getModePaiementByCode: async (code: string): Promise<ModePaiement> => {
    const response = await api.get(`/public/modes-paiement/code/${code}`);
    return response.data;
  },

  /**
   * Récupère les modes de paiement par type (public)
   */
  getModesPaiementByType: async (type: TypePaiement): Promise<ModePaiement[]> => {
    const response = await api.get(`/public/modes-paiement/type/${type}`);
    return response.data;
  },

  /**
   * Récupère tous les modes de paiement (admin)
   */
  getAllModesPaiement: async (): Promise<ModePaiement[]> => {
    const response = await api.get('/admin/modes-paiement');
    return response.data;
  },

  /**
   * Récupère un mode de paiement par ID (admin)
   */
  getModePaiementById: async (id: number): Promise<ModePaiement> => {
    const response = await api.get(`/admin/modes-paiement/${id}`);
    return response.data;
  },

  /**
   * Crée un nouveau mode de paiement (admin)
   */
  createModePaiement: async (data: ModePaiementCreate): Promise<ModePaiement> => {
    const response = await api.post('/admin/modes-paiement', data);
    return response.data;
  },

  /**
   * Met à jour un mode de paiement (admin)
   */
  updateModePaiement: async (id: number, data: ModePaiementUpdate): Promise<ModePaiement> => {
    const response = await api.put(`/admin/modes-paiement/${id}`, data);
    return response.data;
  },

  /**
   * Met à jour la configuration d'un mode de paiement (admin)
   */
  updateConfiguration: async (id: number, config: ModePaiementConfig): Promise<void> => {
    await api.put(`/admin/modes-paiement/${id}/configuration`, config);
  },

  /**
   * Active ou désactive un mode de paiement (admin)
   */
  toggleActif: async (id: number, actif: boolean): Promise<void> => {
    await api.patch(`/admin/modes-paiement/${id}/toggle?actif=${actif}`);
  },

  /**
   * Supprime un mode de paiement (admin)
   */
  deleteModePaiement: async (id: number): Promise<void> => {
    await api.delete(`/admin/modes-paiement/${id}`);
  },

  /**
   * Réorganise les modes de paiement (admin)
   */
  reorderModesPaiement: async (orderedIds: number[]): Promise<void> => {
    await api.put('/admin/modes-paiement/reorder', orderedIds);
  }
};

export default modePaiementService;


