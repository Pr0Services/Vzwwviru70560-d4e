/**
 * CHE·NU™ - AUTH STORE (CONNECTED)
 * Authentication state management with real backend connection
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../services/chenuApi';

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
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  fetchUser: () => Promise<boolean>;
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
// HELPERS
// ═══════════════════════════════════════════════════════════════

const mapUserResponse = (response: unknown): User => ({
  id: response.id,
  email: response.email,
  username: response.username || response.email.split('@')[0],
  displayName: response.display_name || response.displayName || response.email.split('@')[0],
  avatar: response.avatar,
  role: response.role || 'user',
  createdAt: response.created_at || response.createdAt,
  tokenBalance: response.token_balance || response.tokenBalance || 10000,
  subscription: response.subscription || 'free',
  isVerified: response.is_verified || response.isVerified || false,
  preferences: response.preferences || {
    theme: 'dark',
    language: 'fr',
    defaultSphere: 'personal',
    notifications: true,
    soundEnabled: true,
  },
});

const mapTokens = (response: unknown): AuthTokens => ({
  accessToken: response.access_token || response.accessToken,
  refreshToken: response.refresh_token || response.refreshToken,
  expiresAt: response.expires_at 
    ? new Date(response.expires_at).getTime() 
    : Date.now() + 3600000,
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
          const response = await api.login(email, password);
          
          const user = mapUserResponse(response.user);
          const tokens = mapTokens(response.tokens);

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          console.log('✅ Login successful:', user.email);
          return true;
        } catch (error: unknown) {
          console.error('❌ Login failed:', error);
          set({
            error: error.message || 'Login failed. Please check your credentials.',
            isLoading: false,
            isAuthenticated: false,
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
          const response = await api.register({
            email: data.email,
            password: data.password,
            username: data.username,
            display_name: data.displayName,
          });

          const user = mapUserResponse(response.user);
          const tokens = mapTokens(response.tokens);

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
          });

          console.log('✅ Registration successful:', user.email);
          return true;
        } catch (error: unknown) {
          console.error('❌ Registration failed:', error);
          set({
            error: error.message || 'Registration failed. Please try again.',
            isLoading: false,
          });
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Logout
      // ─────────────────────────────────────────────────────────
      logout: async (): Promise<void> => {
        try {
          await api.logout();
        } catch (error) {
          console.warn('Logout API call failed, clearing local state anyway');
        }
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });
        
        console.log('✅ Logged out');
      },

      // ─────────────────────────────────────────────────────────
      // Refresh Session
      // ─────────────────────────────────────────────────────────
      refreshSession: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          return false;
        }

        try {
          const response = await api.refreshToken(tokens.refreshToken);
          const newTokens = mapTokens(response);

          set({
            tokens: newTokens,
            lastActivity: Date.now(),
          });

          console.log('✅ Session refreshed');
          return true;
        } catch (error) {
          console.error('❌ Session refresh failed:', error);
          // Force logout on refresh failure
          get().logout();
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Fetch Current User
      // ─────────────────────────────────────────────────────────
      fetchUser: async (): Promise<boolean> => {
        try {
          const response = await api.getMe();
          const user = mapUserResponse(response);

          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('❌ Fetch user failed:', error);
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Update Profile
      // ─────────────────────────────────────────────────────────
      updateProfile: async (data: Partial<User>): Promise<boolean> => {
        set({ isLoading: true });

        try {
          // TODO: Implement API call
          // const response = await api.updateProfile(data);
          
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
            lastActivity: Date.now(),
          }));

          return true;
        } catch (error: unknown) {
          set({
            error: error.message || 'Failed to update profile',
            isLoading: false,
          });
          return false;
        }
      },

      // ─────────────────────────────────────────────────────────
      // Update Preferences
      // ─────────────────────────────────────────────────────────
      updatePreferences: async (prefs: Partial<UserPreferences>): Promise<boolean> => {
        try {
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  preferences: { ...state.user.preferences, ...prefs },
                }
              : null,
          }));
          return true;
        } catch (error) {
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
        if (!isAuthenticated || !tokens) {
          return false;
        }
        // Check if token is expired
        if (tokens.expiresAt < Date.now()) {
          get().refreshSession();
          return false;
        }
        return true;
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

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  };
};

export const useUser = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    tokenBalance: store.user?.tokenBalance ?? 0,
    preferences: store.user?.preferences,
    updateProfile: store.updateProfile,
    updatePreferences: store.updatePreferences,
  };
};

export default useAuthStore;
