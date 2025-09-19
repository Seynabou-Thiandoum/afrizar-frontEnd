import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  VendeurDto, 
  VendeurCreateDto, 
  VendeurUpdateDto, 
  VendeurSearchParams, 
  VendeurPageResponse,
  VendeurFilters,
  VendeurSortOptions,
  VendeurDetailedStats,
  VendeurStats
} from '../types/vendor';
import { VendorService, ApiErrorHandler } from '../services/vendorService';

// Clés de requête pour React Query
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (params: VendeurSearchParams) => [...vendorKeys.lists(), params] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: number) => [...vendorKeys.details(), id] as const,
  verified: () => [...vendorKeys.all, 'verified'] as const,
  featured: () => [...vendorKeys.all, 'featured'] as const,
  bySpecialty: (specialty: string) => [...vendorKeys.all, 'specialty', specialty] as const,
  stats: () => [...vendorKeys.all, 'stats'] as const,
  detailedStats: (id: number) => [...vendorKeys.all, 'detailedStats', id] as const,
  search: (term: string) => [...vendorKeys.all, 'search', term] as const,
  emailCheck: (email: string) => [...vendorKeys.all, 'emailCheck', email] as const,
};

// Hook pour obtenir la liste des vendeurs avec pagination
export const useVendors = (params: VendeurSearchParams = {}) => {
  return useQuery({
    queryKey: vendorKeys.list(params),
    queryFn: () => VendorService.getVendors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook pour obtenir un vendeur par ID
export const useVendor = (id: number) => {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => VendorService.getVendorById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour obtenir un vendeur par email
export const useVendorByEmail = (email: string) => {
  return useQuery({
    queryKey: vendorKeys.emailCheck(email),
    queryFn: () => VendorService.getVendorByEmail(email),
    enabled: !!email,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook pour obtenir les vendeurs vérifiés
export const useVerifiedVendors = () => {
  return useQuery({
    queryKey: vendorKeys.verified(),
    queryFn: () => VendorService.getVerifiedVendors(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook pour obtenir les vendeurs vedettes
export const useFeaturedVendors = () => {
  return useQuery({
    queryKey: vendorKeys.featured(),
    queryFn: () => VendorService.getFeaturedVendors(),
    staleTime: 15 * 60 * 1000,
  });
};

// Hook pour obtenir les vendeurs par spécialité
export const useVendorsBySpecialty = (specialty: string) => {
  return useQuery({
    queryKey: vendorKeys.bySpecialty(specialty),
    queryFn: () => VendorService.getVendorsBySpecialty(specialty),
    enabled: !!specialty,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook pour rechercher des vendeurs
export const useSearchVendors = (searchTerm: string) => {
  return useQuery({
    queryKey: vendorKeys.search(searchTerm),
    queryFn: () => VendorService.searchVendors(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour obtenir les statistiques globales
export const useVendorStats = () => {
  return useQuery({
    queryKey: vendorKeys.stats(),
    queryFn: () => VendorService.getGlobalStats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook pour obtenir les statistiques détaillées d'un vendeur
export const useVendorDetailedStats = (id: number) => {
  return useQuery({
    queryKey: vendorKeys.detailedStats(id),
    queryFn: () => VendorService.getVendorDetailedStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour vérifier la disponibilité d'un email
export const useEmailAvailability = (email: string) => {
  return useQuery({
    queryKey: vendorKeys.emailCheck(email),
    queryFn: () => VendorService.checkEmailAvailability(email),
    enabled: !!email && email.includes('@'),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook pour les mutations (création, mise à jour, suppression)
export const useVendorMutations = () => {
  const queryClient = useQueryClient();

  // Créer un vendeur
  const createVendorMutation = useMutation({
    mutationFn: (vendorData: VendeurCreateDto) => VendorService.createVendor(vendorData),
    onSuccess: () => {
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.stats() });
    },
  });

  // Mettre à jour un vendeur
  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VendeurUpdateDto }) => 
      VendorService.updateVendor(id, data),
    onSuccess: (data, variables) => {
      // Mettre à jour le cache du vendeur spécifique
      queryClient.setQueryData(vendorKeys.detail(variables.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Supprimer un vendeur
  const deleteVendorMutation = useMutation({
    mutationFn: (id: number) => VendorService.deleteVendor(id),
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: vendorKeys.detail(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.stats() });
    },
  });

  // Vérifier un vendeur
  const verifyVendorMutation = useMutation({
    mutationFn: (id: number) => VendorService.verifyVendor(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(vendorKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.verified() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Annuler la vérification d'un vendeur
  const unverifyVendorMutation = useMutation({
    mutationFn: (id: number) => VendorService.unverifyVendor(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(vendorKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.verified() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Marquer comme vedette
  const markFeaturedMutation = useMutation({
    mutationFn: (id: number) => VendorService.markVendorAsFeatured(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(vendorKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.featured() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Annuler le statut vedette
  const unmarkFeaturedMutation = useMutation({
    mutationFn: (id: number) => VendorService.unmarkVendorAsFeatured(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(vendorKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.featured() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Activer/Désactiver un vendeur
  const activateVendorMutation = useMutation({
    mutationFn: (id: number) => VendorService.activateVendor(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  const deactivateVendorMutation = useMutation({
    mutationFn: (id: number) => VendorService.deactivateVendor(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });

  // Ajouter une évaluation
  const addEvaluationMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note: number }) => 
      VendorService.addEvaluation(id, note),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(vendorKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.detailedStats(variables.id) });
    },
  });

  // Définir une commission personnalisée
  const setCommissionMutation = useMutation({
    mutationFn: ({ id, taux }: { id: number; taux: number }) => 
      VendorService.setCustomCommission(id, taux),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(vendorKeys.detail(variables.id), data);
    },
  });

  return {
    createVendor: createVendorMutation,
    updateVendor: updateVendorMutation,
    deleteVendor: deleteVendorMutation,
    verifyVendor: verifyVendorMutation,
    unverifyVendor: unverifyVendorMutation,
    markFeatured: markFeaturedMutation,
    unmarkFeatured: unmarkFeaturedMutation,
    activateVendor: activateVendorMutation,
    deactivateVendor: deactivateVendorMutation,
    addEvaluation: addEvaluationMutation,
    setCommission: setCommissionMutation,
  };
};

// Hook personnalisé pour la gestion des vendeurs avec état local
export const useVendorManagement = () => {
  const [selectedVendor, setSelectedVendor] = useState<VendeurDto | null>(null);
  const [searchFilters, setSearchFilters] = useState<VendeurFilters>({});
  const [sortOptions, setSortOptions] = useState<VendeurSortOptions>({
    field: 'dateCreation',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Construire les paramètres de recherche
  const searchParams: VendeurSearchParams = {
    page: currentPage,
    size: pageSize,
    sortBy: sortOptions.field,
    sortDir: sortOptions.direction,
    ...searchFilters,
  };

  // Utiliser les hooks de requête
  const vendorsQuery = useVendors(searchParams);
  const mutations = useVendorMutations();

  // Fonctions utilitaires
  const handleSearch = useCallback((filters: VendeurFilters) => {
    setSearchFilters(filters);
    setCurrentPage(0); // Reset à la première page
  }, []);

  const handleSort = useCallback((options: VendeurSortOptions) => {
    setSortOptions(options);
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  }, []);

  const selectVendor = useCallback((vendor: VendeurDto | null) => {
    setSelectedVendor(vendor);
  }, []);

  return {
    // État
    selectedVendor,
    searchFilters,
    sortOptions,
    currentPage,
    pageSize,
    
    // Données
    vendors: vendorsQuery.data,
    isLoading: vendorsQuery.isLoading,
    error: vendorsQuery.error,
    isError: vendorsQuery.isError,
    
    // Mutations
    mutations,
    
    // Actions
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    selectVendor,
    
    // Utilitaires
    refetch: vendorsQuery.refetch,
    isRefetching: vendorsQuery.isRefetching,
  };
};

// Hook pour la gestion des erreurs
export const useVendorErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiErrorHandler) {
      setError(error.message);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Une erreur inattendue est survenue');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};
