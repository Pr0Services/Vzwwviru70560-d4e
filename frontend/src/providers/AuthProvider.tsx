/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — AUTH PROVIDER                               ║
 * ║                    Contexte d'authentification + Protection Routes           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../mocks';
import { useIdentityStore } from '../stores/identity.store';
import { useUIStore } from '../stores/ui.store';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  sphereAccess: string[];
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextType | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser: setStoreUser, setAuthenticated } = useIdentityStore();
  const { addToast } = useUIStore();
  
  // Check existing auth on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('chenu_token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      logger.auth('Checking existing session...');
      const result = await api.auth.getMe();
      
      if (result.success && result.data) {
        setUser(result.data as User);
        setStoreUser(result.data);
        setAuthenticated(true);
        logger.auth('Session restored', { userId: result.data.id });
      } else {
        localStorage.removeItem('chenu_token');
      }
    } catch (error) {
      logger.error('Auth check failed', error);
      localStorage.removeItem('chenu_token');
    } finally {
      setIsLoading(false);
    }
  }, [setStoreUser, setAuthenticated]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      logger.auth('Login attempt', { email });
      const result = await api.auth.login(email, password);
      
      if (result.success && result.data) {
        const { user: loggedUser, token } = result.data;
        
        localStorage.setItem('chenu_token', token);
        setUser(loggedUser as User);
        setStoreUser(loggedUser);
        setAuthenticated(true);
        
        addToast({
          type: 'success',
          title: 'Bienvenue!',
          message: `Connecté en tant que ${loggedUser.name}`,
        });
        
        logger.auth('Login successful', { userId: loggedUser.id });
        setIsLoading(false);
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Erreur de connexion',
          message: result.error || 'Email ou mot de passe incorrect',
        });
        
        logger.auth('Login failed', { error: result.error });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      logger.error('Login error', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de se connecter',
      });
      setIsLoading(false);
      return false;
    }
  }, [setStoreUser, setAuthenticated, addToast]);
  
  // Logout
  const logout = useCallback(async () => {
    logger.auth('Logging out...');
    
    try {
      await api.auth.logout();
    } catch (error) {
      logger.error('Logout API error', error);
    }
    
    localStorage.removeItem('chenu_token');
    setUser(null);
    setStoreUser(null);
    setAuthenticated(false);
    
    addToast({
      type: 'info',
      title: 'Déconnexion',
      message: 'À bientôt!',
    });
    
    logger.auth('Logged out');
  }, [setStoreUser, setAuthenticated, addToast]);
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROTECTED ROUTE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.auth('Access denied, redirecting to login', { from: location.pathname });
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1F22] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D8B26A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#E9E4D6] text-lg">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/personal/quickcapture';
      logger.auth('Already authenticated, redirecting', { to: from });
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1F22] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D8B26A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}

export default AuthProvider;
