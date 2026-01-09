/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — AUTH PROVIDER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  created_at: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('chenu_user');
        const savedToken = localStorage.getItem('chenu_token');
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('chenu_user');
        localStorage.removeItem('chenu_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For development: accept any email/password
      if (email && password) {
        const mockUser: User = {
          id: 'user-' + Date.now(),
          email,
          username: email.split('@')[0],
          displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          created_at: new Date().toISOString(),
        };
        
        const mockToken = 'chenu-token-' + Date.now();
        
        // Save to localStorage
        localStorage.setItem('chenu_user', JSON.stringify(mockUser));
        localStorage.setItem('chenu_token', mockToken);
        
        setUser(mockUser);
        
        // Redirect to intended page or dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        throw new Error('Email et mot de passe requis');
      }
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location]);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Clear storage
      localStorage.removeItem('chenu_user');
      localStorage.removeItem('chenu_token');
      
      setUser(null);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
