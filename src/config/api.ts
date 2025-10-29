import axios from 'axios';
const getApiUrl = () => {
  // En production sur Render
  if (window.location.hostname !== 'localhost') {
    return 'https://afrizar-back-end.onrender.com';
  }
  // En développement local
  return 'http://localhost:8080';
};

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  // BASE_URL: REACT_APP_API_URL,
  // BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

console.log("BASE_URL:", API_CONFIG.BASE_URL); // <- Ajoute ici


// Instance axios configurée
export const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('afrizar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      // Vérifier si c'est vraiment un problème de token et pas juste une ressource non autorisée
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.includes('Token expiré') || errorMessage.includes('Token invalide')) {
        console.warn('🔐 Token expiré, déconnexion...');
        localStorage.removeItem('afrizar_token');
        localStorage.removeItem('afrizar_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// URLs complètes pour les endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_CONFIG.BASE_URL}/api/auth/connexion`,
  AUTH_REGISTER: `${API_CONFIG.BASE_URL}/api/auth/inscription`,
  AUTH_LOGOUT: `${API_CONFIG.BASE_URL}/api/auth/deconnexion`,
  AUTH_PROFILE: `${API_CONFIG.BASE_URL}/api/auth/profil`,
  AUTH_VALIDATE_TOKEN: `${API_CONFIG.BASE_URL}/api/auth/valider-token`,
  
  // Produits
  PRODUCTS: `${API_CONFIG.BASE_URL}/api/produits`,
  PRODUCTS_SEARCH: `${API_CONFIG.BASE_URL}/api/produits/recherche`,
  PRODUCTS_BY_VENDOR: (vendorId: number) => `${API_CONFIG.BASE_URL}/api/produits/vendeur/${vendorId}`,
  PRODUCTS_BY_CATEGORY: (categoryId: number) => `${API_CONFIG.BASE_URL}/api/produits/categorie/${categoryId}`,
  PRODUCTS_IN_STOCK: `${API_CONFIG.BASE_URL}/api/produits/en-stock`,
  PRODUCTS_TOP_RATED: `${API_CONFIG.BASE_URL}/api/produits/mieux-notes`,
  
  // Vendeurs
  VENDORS: `${API_CONFIG.BASE_URL}/api/vendeurs`,
  VENDORS_VERIFIED: `${API_CONFIG.BASE_URL}/api/vendeurs/verifies`,
  VENDORS_SEARCH: `${API_CONFIG.BASE_URL}/api/vendeurs/recherche`,
  
  // Categories
  CATEGORIES: `${API_CONFIG.BASE_URL}/api/categories`,
  
  // Commandes
  ORDERS: `${API_CONFIG.BASE_URL}/api/commandes`,
  ORDERS_BY_CLIENT: (clientId: number) => `${API_CONFIG.BASE_URL}/api/commandes/client/${clientId}`,
  
  // Admin
  ADMIN_PRODUCTS_PENDING: `${API_CONFIG.BASE_URL}/api/admin/produits/en-attente`,
  ADMIN_PRODUCTS_ALL: `${API_CONFIG.BASE_URL}/api/admin/produits/tous`,
  ADMIN_PRODUCT_VALIDATE: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/produits/${id}/valider`,
  ADMIN_PRODUCT_REJECT: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/produits/${id}/rejeter`,
  
  ADMIN_VENDORS_ALL: `${API_CONFIG.BASE_URL}/api/admin/vendeurs/tous`,
  ADMIN_VENDORS_UNVERIFIED: `${API_CONFIG.BASE_URL}/api/admin/vendeurs/non-verifies`,
  ADMIN_VENDOR_VERIFY: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/vendeurs/${id}/verifier`,
  ADMIN_VENDOR_DEACTIVATE: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/vendeurs/${id}/desactiver`,
  ADMIN_VENDOR_ACTIVATE: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/vendeurs/${id}/activer`,
  
  ADMIN_USERS_ALL: `${API_CONFIG.BASE_URL}/api/admin/utilisateurs/tous`,
  ADMIN_USER_DEACTIVATE: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/utilisateurs/${id}/desactiver`,
  ADMIN_USER_ACTIVATE: (id: number) => `${API_CONFIG.BASE_URL}/api/admin/utilisateurs/${id}/activer`,
  
  ADMIN_STATS_DASHBOARD: `${API_CONFIG.BASE_URL}/api/admin/statistiques/dashboard`,
  
  // Support
  SUPPORT_CLIENTS: `${API_CONFIG.BASE_URL}/api/support/clients`,
  SUPPORT_VENDORS: `${API_CONFIG.BASE_URL}/api/support/vendeurs`,
  SUPPORT_ORDERS: `${API_CONFIG.BASE_URL}/api/support/commandes`,
  SUPPORT_STATS_CLIENTS: `${API_CONFIG.BASE_URL}/api/support/statistiques/clients`,
  SUPPORT_STATS_VENDORS: `${API_CONFIG.BASE_URL}/api/support/statistiques/vendeurs`,
  
  // Email check
  EMAIL_CHECK: `${API_CONFIG.BASE_URL}/api/vendeurs/email`,
};

// Configuration des headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Fonction pour obtenir les headers avec authentification
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('afrizar_token');
  const headers: HeadersInit = { ...DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  TIMEOUT_ERROR: 'La requête a pris trop de temps',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur interne du serveur',
  VALIDATION_ERROR: 'Données invalides',
  UNAUTHORIZED: 'Non autorisé - Veuillez vous connecter',
  FORBIDDEN: 'Accès interdit - Vous n\'avez pas les permissions nécessaires',
};

// Fonction utilitaire pour obtenir l'URL complète d'une image
export const getImageUrl = (imageUrl: string | string[] | null | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop';
  
  // Si c'est un tableau, prendre le premier élément
  const photo = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  
  if (!photo) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop';
  if (photo.startsWith('http')) return photo;
  
  // Construire l'URL avec la base URL
  return `${API_CONFIG.BASE_URL}${photo}`;
};