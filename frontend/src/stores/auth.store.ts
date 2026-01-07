/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AUTH STORE BRIDGE                               ║
 * ║                    Compatibility layer for identity.store                     ║
 * ║                    V68 CANONICAL                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file provides backward compatibility for components using useAuthStore.
 * The canonical store for identity/auth is identity.store.ts
 * 
 * Migration: Components should eventually migrate to useIdentityStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES (re-exported for compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'enterprise';
  createdAt: string;
  preferences: UserPreferences;
  tokenBalance: number;
  subscription: SubscriptionTier;
  isVerified: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'fr' | 'es';
  defaultSphere: string;
  notifications: boolean;
  soundEnabled: boolean;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  fetchUser: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK API (to be replaced with real API)
// ═══════════════════════════════════════════════════════════════════════════════

const mockApi = {
  login: async (email: string, _password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: {
        id: 'user-1',
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        tokenBalance: 10000,
        subscription: 'free' as const,
        isVerified: true,
        preferences: {
          theme: 'dark' as const,
          language: 'fr' as const,
          defaultSphere: 'personal',
          notifications: true,
          soundEnabled: true,
        },
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
      },
    };
  },
  register: async (data: RegisterData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: {
        id: 'user-' + Date.now(),
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        tokenBalance: 10000,
        subscription: 'free' as const,
        isVerified: false,
        preferences: {
          theme: 'dark' as const,
          language: 'fr' as const,
          defaultSphere: 'personal',
          notifications: true,
          soundEnabled: true,
        },
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
      },
    };
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: Date.now(),

      // Login
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await mockApi.login(email, password);
          
          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          return true;
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      // Register
      register: async (data: RegisterData): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await mockApi.register(data);

          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          return true;
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      // Logout
      logout: async (): Promise<void> => {
        try {
          await mockApi.logout();
        } catch {
          // Continue with local logout
        }
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Refresh Session
      refreshSession: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return false;
        
        // TODO: Implement real refresh
        return true;
      },

      // Fetch User
      fetchUser: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.accessToken) return false;
        
        // TODO: Implement real fetch
        return true;
      },

      // Update Profile
      updateProfile: async (data: Partial<User>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;
        
        set({ user: { ...user, ...data } });
        return true;
      },

      // Update Preferences
      updatePreferences: async (prefs: Partial<UserPreferences>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;
        
        set({ 
          user: { 
            ...user, 
            preferences: { ...user.preferences, ...prefs } 
          } 
        });
        return true;
      },

      // Clear Error
      clearError: () => set({ error: null }),

      // Set Loading
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Check Session
      checkSession: (): boolean => {
        const { tokens, isAuthenticated } = get();
        if (!tokens || !isAuthenticated) return false;
        return tokens.expiresAt > Date.now();
      },
    }),
    {
      name: 'chenu-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
