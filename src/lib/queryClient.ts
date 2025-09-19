import { QueryClient } from '@tanstack/react-query';

// Configuration du client React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache par défaut (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Temps de cache en arrière-plan (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Nombre de tentatives en cas d'erreur
      retry: (failureCount, error) => {
        // Ne pas réessayer pour les erreurs 4xx (erreurs client)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Réessayer jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      // Délai entre les tentatives (exponentiel)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
      // Refetch automatique lors de la reconnexion réseau
      refetchOnReconnect: true,
    },
    mutations: {
      // Nombre de tentatives pour les mutations
      retry: 1,
      // Délai entre les tentatives pour les mutations
      retryDelay: 1000,
    },
  },
});

// Fonction utilitaire pour invalider les caches
export const invalidateVendorQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['vendors'] });
};

// Fonction utilitaire pour précharger les données
export const prefetchVendorData = async (vendorId: number) => {
  await queryClient.prefetchQuery({
    queryKey: ['vendors', 'detail', vendorId],
    queryFn: async () => {
      const { VendorService } = await import('../services/vendorService');
      return VendorService.getVendorById(vendorId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fonction utilitaire pour mettre à jour le cache d'un vendeur
export const updateVendorCache = (vendorId: number, updatedVendor: any) => {
  queryClient.setQueryData(['vendors', 'detail', vendorId], updatedVendor);
  
  // Mettre à jour aussi dans les listes
  queryClient.setQueriesData(
    { queryKey: ['vendors', 'list'] },
    (oldData: any) => {
      if (!oldData?.content) return oldData;
      
      return {
        ...oldData,
        content: oldData.content.map((vendor: any) =>
          vendor.id === vendorId ? { ...vendor, ...updatedVendor } : vendor
        ),
      };
    }
  );
};
