import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  demoUsers: { role: UserRole; email: string; label: string; pass: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS: { role: UserRole; email: string; label: string; pass: string }[] = [
  { role: 'individual', email: 'maya.lin@student.org', label: 'Maya Lin (Individual Buyer)', pass: 'BuyerPass123!' },
  { role: 'organization', email: 'marcus.chen@pacific.edu', label: 'Pacific Coast Univ (Org Buyer)', pass: 'BuyerPass123!' },
  { role: 'supplier', email: 'supplier.apex@apexcomputing.com', label: 'Apex Enterprise Computing (Supplier)', pass: 'SupplierPass123!' },
  { role: 'admin', email: 'admin@needbridge.io', label: 'Dr. Eleanor Vance (Administrator)', pass: 'AdminPass123!' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Default initial mock active user for seamless instant demo inspection
    return {
      id: 'marcus-chen-pcu-demo',
      email: 'marcus.chen@pacific.edu',
      full_name: 'Prof. Marcus Chen',
      role: 'organization',
      organization_id: 'org-pacific-coast-univ',
      is_active: true,
      created_at: new Date().toISOString(),
    };
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('needbridge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verify session if token exists
    const stored = localStorage.getItem('needbridge_token');
    if (stored) {
      ApiService.getCurrentUser()
        .then((u) => setUser(u))
        .catch(() => {
          // Token expired or invalid
        });
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await ApiService.login(email, pass);
      localStorage.setItem('needbridge_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const newUser = await ApiService.register(data);
      // Auto login
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('needbridge_token');
    setToken(null);
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const matched = DEMO_ACCOUNTS.find((a) => a.role === newRole);
    if (matched) {
      setUser({
        id: `demo-user-${newRole}`,
        email: matched.email,
        full_name: matched.label.split('(')[0].trim(),
        role: newRole,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    } else {
      if (user) {
        setUser({ ...user, role: newRole });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'individual',
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        demoUsers: DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
