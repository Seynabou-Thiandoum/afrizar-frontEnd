// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/afrizar',
  VENDORS_ENDPOINT: '/api/vendeurs',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

// URLs complètes pour les endpoints
export const API_ENDPOINTS = {
  VENDORS: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}`,
  VENDORS_VERIFIED: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}/verifies`,
  VENDORS_FEATURED: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}/vedettes`,
  VENDORS_SEARCH: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}/recherche`,
  VENDORS_STATS: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}/statistiques-globales`,
  EMAIL_CHECK: `${API_CONFIG.BASE_URL}${API_CONFIG.VENDORS_ENDPOINT}/email`,
};

// Configuration des headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  TIMEOUT_ERROR: 'La requête a pris trop de temps',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur interne du serveur',
  VALIDATION_ERROR: 'Données invalides',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
};
