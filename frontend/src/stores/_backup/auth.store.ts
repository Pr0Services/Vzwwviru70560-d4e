/**
 * CHE·NU — Auth Store (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  email_verified: boolean;
  mfa_enabled: boolean;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string | null;
  language: string;
  timezone: string;
  onboarding_completed: boolean;
  onboarding_step: number;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, profile: Profile, tokens: { access_token: string; refresh_token: string }) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  setOnboardingComplete: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, profile, tokens) => set({
        user,
        profile,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      }),

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      })),

      setOnboardingComplete: () => set((state) => ({
        profile: state.profile ? { ...state.profile, onboarding_completed: true, onboarding_step: 6 } : null,
      })),

      logout: () => set({
        user: null,
        profile: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chenu-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
