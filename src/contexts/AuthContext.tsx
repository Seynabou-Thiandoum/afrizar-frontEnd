import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthResponse, User as BackendUser } from '../services/authService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'vendor' | 'support' | 'admin';
  avatar?: string;
  businessName?: string;
  permissions: string[];
  isActive: boolean;
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  pointsFidelite?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string; user?: User }>;
  register: (userData: any, userType: 'client' | 'vendor') => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  forceLogout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  switchRole: (role: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const rolePermissions = {
  client: ['view_products', 'place_orders', 'track_orders', 'manage_profile'],
  vendor: ['manage_products', 'view_orders', 'manage_inventory', 'view_analytics', 'customer_communication'],
  support: ['manage_all_orders', 'customer_support', 'vendor_support', 'view_all_products', 'moderate_content'],
  admin: ['manage_users', 'view_analytics', 'manage_platform', 'financial_reports', 'system_settings', 'validate_products', 'verify_vendors', 'full_access'],
};

// Mapper les rôles du backend vers les rôles du frontend
const mapBackendRole = (backendRole: 'ADMIN' | 'CLIENT' | 'VENDEUR' | 'SUPPORT'): 'admin' | 'client' | 'vendor' | 'support' => {
  const roleMap = {
    'ADMIN': 'admin' as const,
    'CLIENT': 'client' as const,
    'VENDEUR': 'vendor' as const,
    'SUPPORT': 'support' as const,
  };
  return roleMap[backendRole];
};

// Convertir l'utilisateur du backend vers le format frontend
const convertBackendUser = (backendUser: BackendUser): User => {
  const frontendRole = mapBackendRole(backendUser.role);
  
  return {
    id: backendUser.id,
    email: backendUser.email,
    firstName: backendUser.prenom,
    lastName: backendUser.nom,
    role: frontendRole,
    businessName: backendUser.nomBoutique,
    permissions: rolePermissions[frontendRole],
    isActive: backendUser.actif,
    isApproved: backendUser.verifie !== undefined ? backendUser.verifie : true,
    approvalStatus: backendUser.verifie === false ? 'pending' : 'approved',
    createdAt: new Date().toISOString(),
    pointsFidelite: backendUser.pointsFidelite,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour nettoyer les tokens corrompus
  const cleanCorruptedToken = (token: string | null): boolean => {
    if (!token) return false;
    
    // Vérifier que le token a le bon format JWT (2 points)
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error('❌ Token JWT corrompu détecté, nettoyage...');
      localStorage.removeItem('afrizar_token');
      localStorage.removeItem('afrizar_user');
      return false;
    }
    
    return true;
  };

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = authService.getUser();
      const token = authService.getToken();

      if (savedUser && token && cleanCorruptedToken(token)) {
        // TEMPORAIRE : Désactiver la validation du token car elle cause des erreurs
        // TODO : Corriger l'endpoint /api/auth/valider-token côté backend
        console.log('✅ Utilisateur trouvé dans localStorage:', savedUser.email);
        setUser(convertBackendUser(savedUser));
        
        /* DÉSACTIVÉ TEMPORAIREMENT
        const isValid = await authService.validateToken();
        
        if (isValid) {
          setUser(convertBackendUser(savedUser));
        } else {
          // Token invalide, déconnecter
          authService.removeToken();
        }
        */
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string; error?: string }> => {
    try {
      setLoading(true);
      const response: AuthResponse = await authService.login(email, password);
      
      const backendUser: BackendUser = {
        id: response.utilisateurId,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        role: response.role,
        actif: response.actif,
        nomBoutique: response.nomBoutique,
        verifie: response.verifie,
        pointsFidelite: response.pointsFidelite,
      };

      const frontendUser = convertBackendUser(backendUser);
      setUser(frontendUser);

      // Déterminer la redirection selon le rôle
      let redirectTo = '/';
      switch (frontendUser.role) {
        case 'admin':
          redirectTo = '/admin/dashboard';
          break;
        case 'vendor':
          redirectTo = '/vendor/dashboard';
          break;
        case 'client':
          redirectTo = '/';
          break;
        case 'support':
          redirectTo = '/support/dashboard';
          break;
      }

      return { success: true, redirectTo, user: frontendUser };
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        error: error.message || 'Email ou mot de passe incorrect'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any, userType: 'client' | 'vendor'): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setLoading(true);
      
      // Mapper le type d'utilisateur vers le rôle backend
      const role = userType === 'client' ? 'CLIENT' : 'VENDEUR';
      
      const registerData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        motDePasse: userData.password,
        telephone: userData.phone,
        role,
        // Champs client
        adresse: userData.address,
        ville: userData.city,
        codePostal: userData.postalCode,
        pays: userData.country || 'Sénégal',
        // Champs vendeur
        nomBoutique: userData.businessName,
        description: userData.description,
        adresseBoutique: userData.businessAddress,
        specialites: userData.specialties,
      };

      const response: AuthResponse = await authService.register(registerData);
      
      const backendUser: BackendUser = {
        id: response.utilisateurId,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        role: response.role,
        actif: response.actif,
        nomBoutique: response.nomBoutique,
        verifie: response.verifie,
        pointsFidelite: response.pointsFidelite,
      };

      const frontendUser = convertBackendUser(backendUser);
      setUser(frontendUser);

      let message = 'Inscription réussie !';
      if (userType === 'vendor' && !response.verifie) {
        message = 'Inscription réussie ! Votre compte sera vérifié par un administrateur avant que vous puissiez commencer à vendre.';
      }

      return { success: true, message };
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de l\'inscription'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer les données locales
      localStorage.removeItem('afrizar_token');
      localStorage.removeItem('afrizar_user');
      setUser(null);
      // Rediriger vers la page d'accueil après déconnexion
      window.location.href = '/';
    }
  };

  // Fonction pour forcer la déconnexion en cas de token corrompu
  const forceLogout = () => {
    console.log('🔄 Déconnexion forcée due à un token corrompu');
    localStorage.removeItem('afrizar_token');
    localStorage.removeItem('afrizar_user');
    setUser(null);
    window.location.href = '/';
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('full_access');
  };

  const switchRole = (role: string) => {
    // Cette fonction n'est plus utilisée avec le vrai backend
    // Le rôle est déterminé par le serveur
    console.warn('switchRole is not supported with real backend authentication');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      forceLogout,
      isAuthenticated: !!user,
      hasPermission,
      switchRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};