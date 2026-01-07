/**
 * CHE·NU™ - AUTH STORE
 * Complete authentication state management with Zustand
 * Handles login, register, tokens, session management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

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

export interface AuthState {
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
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// ═══════════════════════════════════════════════════════════════
// API SIMULATION (Replace with real API calls)
// ═══════════════════════════════════════════════════════════════

const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

const generateTokens = (): AuthTokens => ({
  accessToken: `at_${Math.random().toString(36).substring(2)}`,
  refreshToken: `rt_${Math.random().toString(36).substring(2)}`,
  expiresAt: Date.now() + 3600000, // 1 hour
});

const createMockUser = (email: string, username: string): User => ({
  id: `user_${Math.random().toString(36).substring(2)}`,
  email,
  username,
  displayName: username,
  role: 'user',
  createdAt: new Date().toISOString(),
  tokenBalance: 10000, // Starting tokens
  subscription: 'free',
  preferences: {
    theme: 'dark',
    language: 'en',
    defaultSphere: 'personal',
    notifications: true,
    soundEnabled: true,
  },
});

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

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

      // ─────────────────────────────────────────────────────────
      // Login
      // ─────────────────────────────────────────────────────────
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          const tokens = await simulateApiCall(generateTokens());
          const user = await simulateApiCall(createMockUser(email, email.split('@')[0]));

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          return true;
        } catch (error) {
          set({
            error: 'Login failed. Please check your credentials.',
            isLoading: false,
          });
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Register
      // ─────────────────────────────────────────────────────────
      register: async (data: RegisterData): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const tokens = await simulateApiCall(generateTokens());
          const user = await simulateApiCall(
            createMockUser(data.email, data.username)
          );
          user.displayName = data.displayName;

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          return true;
        } catch (error) {
          set({
            error: 'Registration failed. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Logout
      // ─────────────────────────────────────────────────────────
      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // ─────────────────────────────────────────────────────────
      // Refresh Session
      // ─────────────────────────────────────────────────────────
      refreshSession: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return false;

        try {
          const newTokens = await simulateApiCall(generateTokens(), 500);
          set({ tokens: newTokens, lastActivity: Date.now() });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Update Profile
      // ─────────────────────────────────────────────────────────
      updateProfile: async (data: Partial<User>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        set({ isLoading: true });

        try {
          const updatedUser = await simulateApiCall({ ...user, ...data }, 500);
          set({ user: updatedUser, isLoading: false });
          return true;
        } catch {
          set({ error: 'Failed to update profile', isLoading: false });
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Update Preferences
      // ─────────────────────────────────────────────────────────
      updatePreferences: async (prefs: Partial<UserPreferences>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        try {
          const updatedUser = {
            ...user,
            preferences: { ...user.preferences, ...prefs },
          };
          set({ user: updatedUser });
          return true;
        } catch {
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Utility Actions
      // ─────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      checkSession: (): boolean => {
        const { tokens, isAuthenticated } = get();
        if (!isAuthenticated || !tokens) return false;
        
        // Check if token expired
        if (tokens.expiresAt < Date.now()) {
          get().logout();
          return false;
        }
        
        return true;
      },
    }),
    {
      name: 'chenu-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useTokenBalance = () => useAuthStore((state) => state.user?.tokenBalance ?? 0);

export default useAuthStore;
