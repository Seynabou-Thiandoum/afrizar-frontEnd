import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'vendor' | 'support' | 'admin' | 'developer' | 'founder';
  avatar?: string;
  businessName?: string;
  permissions: string[];
  isActive: boolean;
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>;
  register: (userData: any, userType: 'client' | 'vendor') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  switchRole: (role: string) => void;
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
  admin: ['manage_users', 'view_analytics', 'manage_platform', 'financial_reports', 'system_settings'],
  developer: ['system_access', 'debug_mode', 'manage_platform', 'view_logs', 'technical_support'],
  founder: ['full_access', 'strategic_decisions', 'financial_oversight', 'team_management']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Utilisateurs de démonstration
  const demoUsers = {
    'client@afrizar.sn': {
      id: '1',
      email: 'client@afrizar.sn',
      firstName: 'Aminata',
      lastName: 'Diallo',
      role: 'client' as const,
      permissions: rolePermissions.client,
      isActive: true,
      createdAt: '2025-01-01'
    },
    'vendor@afrizar.sn': {
      id: '2',
      email: 'vendor@afrizar.sn',
      firstName: 'Fatou',
      lastName: 'Sall',
      role: 'vendor' as const,
      businessName: 'Atelier Fatou',
      permissions: rolePermissions.vendor,
      isActive: true,
      createdAt: '2025-01-01'
    },
    'support@afrizar.sn': {
      id: '3',
      email: 'support@afrizar.sn',
      firstName: 'Moussa',
      lastName: 'Ba',
      role: 'support' as const,
      permissions: rolePermissions.support,
      isActive: true,
      createdAt: '2025-01-01'
    },
    'admin@afrizar.sn': {
      id: '4',
      email: 'admin@afrizar.sn',
      firstName: 'Ibrahima',
      lastName: 'Ndiaye',
      role: 'admin' as const,
      permissions: rolePermissions.admin,
      isActive: true,
      createdAt: '2025-01-01'
    },
    'dev@afrizar.sn': {
      id: '5',
      email: 'dev@afrizar.sn',
      firstName: 'Cheikh',
      lastName: 'Fall',
      role: 'developer' as const,
      permissions: rolePermissions.developer,
      isActive: true,
      createdAt: '2025-01-01'
    },
    'founder@afrizar.sn': {
      id: '6',
      email: 'founder@afrizar.sn',
      firstName: 'Ousmane',
      lastName: 'Diop',
      role: 'founder' as const,
      permissions: rolePermissions.founder,
      isActive: true,
      createdAt: '2025-01-01'
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string }> => {
    // Simulation de connexion
    const userData = demoUsers[email as keyof typeof demoUsers];
    if (userData && password === 'demo123') {
      setUser(userData);
      localStorage.setItem('afrizar_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    }
    return { success: false };
  };

  const register = async (userData: any, userType: 'client' | 'vendor'): Promise<{ success: boolean; message?: string }> => {
    // Simulation d'inscription
    return { success: true, message: 'Inscription réussie' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('afrizar_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('full_access');
  };

  const switchRole = (role: string) => {
    if (user && hasPermission('full_access')) {
      setUser({
        ...user,
        role: role as User['role'],
        permissions: rolePermissions[role as keyof typeof rolePermissions]
      });
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('afrizar_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      hasPermission,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};