/**
 * CHE·NU™ Authentication Store V72
 * 
 * Zustand store for authentication state management:
 * - User state
 * - Auth status
 * - Loading states
 * - Error handling
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { 
  authAPI, 
  User, 
  Session, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  TwoFactorSetup,
  LinkedAccount,
  AuthProvider
} from './authAPI';


// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AuthStatus = 
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'requires_2fa';

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  // Status
  status: AuthStatus;
  isLoading: boolean;
  isInitialized: boolean;
  
  // User
  user: User | null;
  
  // 2FA
  twoFactorToken: string | null;
  twoFactorSetup: TwoFactorSetup | null;
  
  // Sessions
  sessions: Session[];
  linkedAccounts: LinkedAccount[];
  
  // Errors
  error: AuthError | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (request: LoginRequest) => Promise<AuthResponse>;
  register: (request: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<number>;
  
  // 2FA
  verify2FA: (code: string, isBackupCode?: boolean) => Promise<AuthResponse>;
  enable2FA: () => Promise<TwoFactorSetup | null>;
  confirm2FA: (code: string) => Promise<boolean>;
  disable2FA: (password: string) => Promise<boolean>;
  regenerateBackupCodes: (password: string) => Promise<string[] | null>;
  
  // OAuth
  loginWithOAuth: (provider: AuthProvider) => Promise<void>;
  handleOAuthCallback: (provider: AuthProvider, code: string, state: string) => Promise<AuthResponse>;
  linkOAuthAccount: (provider: AuthProvider) => Promise<void>;
  unlinkOAuthAccount: (provider: AuthProvider) => Promise<boolean>;
  fetchLinkedAccounts: () => Promise<void>;
  
  // Sessions
  fetchSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  
  // Password
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // User
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
  
  // Utilities
  clearError: () => void;
  setError: (error: AuthError) => void;
}


// ═══════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // ─────────────────────────────────────────────────────────────────────
        // Initial State
        // ─────────────────────────────────────────────────────────────────────
        status: 'idle',
        isLoading: false,
        isInitialized: false,
        user: null,
        twoFactorToken: null,
        twoFactorSetup: null,
        sessions: [],
        linkedAccounts: [],
        error: null,

        // ─────────────────────────────────────────────────────────────────────
        // Initialize
        // ─────────────────────────────────────────────────────────────────────
        initialize: async () => {
          if (get().isInitialized) return;
          
          set({ isLoading: true });
          
          try {
            if (authAPI.isAuthenticated()) {
              const user = await authAPI.getCurrentUser();
              
              if (user) {
                set({
                  status: 'authenticated',
                  user,
                  isInitialized: true,
                  isLoading: false,
                });
              } else {
                set({
                  status: 'unauthenticated',
                  isInitialized: true,
                  isLoading: false,
                });
              }
            } else {
              set({
                status: 'unauthenticated',
                isInitialized: true,
                isLoading: false,
              });
            }
          } catch {
            set({
              status: 'unauthenticated',
              isInitialized: true,
              isLoading: false,
            });
          }
        },

        // ─────────────────────────────────────────────────────────────────────
        // Authentication
        // ─────────────────────────────────────────────────────────────────────
        login: async (request: LoginRequest) => {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.login(request);
          
          if (response.success) {
            if (response.requires2FA) {
              set({
                status: 'requires_2fa',
                twoFactorToken: response.twoFactorToken || null,
                isLoading: false,
              });
            } else {
              set({
                status: 'authenticated',
                user: response.user || null,
                isLoading: false,
              });
            }
          } else {
            set({
              isLoading: false,
              error: {
                message: response.error || 'Login failed',
                code: response.errorCode,
              },
            });
          }
          
          return response;
        },

        register: async (request: RegisterRequest) => {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.register(request);
          
          if (response.success) {
            set({
              status: 'authenticated',
              user: response.user || null,
              isLoading: false,
            });
          } else {
            set({
              isLoading: false,
              error: {
                message: response.error || 'Registration failed',
                code: response.errorCode,
              },
            });
          }
          
          return response;
        },

        logout: async () => {
          set({ isLoading: true });
          
          await authAPI.logout();
          
          set({
            status: 'unauthenticated',
            user: null,
            sessions: [],
            linkedAccounts: [],
            twoFactorToken: null,
            twoFactorSetup: null,
            isLoading: false,
            error: null,
          });
        },

        logoutAllDevices: async () => {
          set({ isLoading: true });
          
          const count = await authAPI.logoutAllDevices();
          
          // Refresh sessions list
          await get().fetchSessions();
          
          set({ isLoading: false });
          
          return count;
        },

        // ─────────────────────────────────────────────────────────────────────
        // 2FA
        // ─────────────────────────────────────────────────────────────────────
        verify2FA: async (code: string, isBackupCode = false) => {
          set({ isLoading: true, error: null });
          
          const token = get().twoFactorToken;
          if (!token) {
            const error = { message: 'No 2FA session', code: 'NO_2FA_SESSION' };
            set({ isLoading: false, error });
            return { success: false, error: error.message, errorCode: error.code };
          }
          
          const response = await authAPI.verify2FA(token, code, isBackupCode);
          
          if (response.success) {
            set({
              status: 'authenticated',
              user: response.user || null,
              twoFactorToken: null,
              isLoading: false,
            });
          } else {
            set({
              isLoading: false,
              error: {
                message: response.error || 'Verification failed',
                code: response.errorCode,
              },
            });
          }
          
          return response;
        },

        enable2FA: async () => {
          set({ isLoading: true, error: null });
          
          const setup = await authAPI.enable2FA();
          
          set({
            twoFactorSetup: setup,
            isLoading: false,
          });
          
          return setup;
        },

        confirm2FA: async (code: string) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.confirm2FA(code);
          
          if (success) {
            // Refresh user to get updated 2FA status
            await get().refreshUser();
            set({ twoFactorSetup: null, isLoading: false });
          } else {
            set({
              isLoading: false,
              error: {
                message: 'Invalid verification code',
                code: 'INVALID_CODE',
              },
            });
          }
          
          return success;
        },

        disable2FA: async (password: string) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.disable2FA(password);
          
          if (success) {
            await get().refreshUser();
          } else {
            set({
              error: {
                message: 'Failed to disable 2FA',
                code: 'DISABLE_2FA_FAILED',
              },
            });
          }
          
          set({ isLoading: false });
          return success;
        },

        regenerateBackupCodes: async (password: string) => {
          set({ isLoading: true, error: null });
          
          const codes = await authAPI.regenerateBackupCodes(password);
          
          set({ isLoading: false });
          return codes;
        },

        // ─────────────────────────────────────────────────────────────────────
        // OAuth
        // ─────────────────────────────────────────────────────────────────────
        loginWithOAuth: async (provider: AuthProvider) => {
          set({ isLoading: true, error: null });
          
          const url = await authAPI.getOAuthUrl(provider);
          
          if (url) {
            window.location.href = url;
          } else {
            set({
              isLoading: false,
              error: {
                message: 'Failed to get OAuth URL',
                code: 'OAUTH_URL_ERROR',
              },
            });
          }
        },

        handleOAuthCallback: async (provider: AuthProvider, code: string, state: string) => {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.handleOAuthCallback(provider, code, state);
          
          if (response.success) {
            set({
              status: 'authenticated',
              user: response.user || null,
              isLoading: false,
            });
          } else {
            set({
              status: 'unauthenticated',
              isLoading: false,
              error: {
                message: response.error || 'OAuth login failed',
                code: response.errorCode,
              },
            });
          }
          
          return response;
        },

        linkOAuthAccount: async (provider: AuthProvider) => {
          set({ isLoading: true, error: null });
          
          const url = await authAPI.linkOAuthAccount(provider);
          
          if (url) {
            window.location.href = url;
          } else {
            set({
              isLoading: false,
              error: {
                message: 'Failed to link account',
                code: 'LINK_ERROR',
              },
            });
          }
        },

        unlinkOAuthAccount: async (provider: AuthProvider) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.unlinkOAuthAccount(provider);
          
          if (success) {
            await get().fetchLinkedAccounts();
          }
          
          set({ isLoading: false });
          return success;
        },

        fetchLinkedAccounts: async () => {
          const accounts = await authAPI.getLinkedAccounts();
          set({ linkedAccounts: accounts });
        },

        // ─────────────────────────────────────────────────────────────────────
        // Sessions
        // ─────────────────────────────────────────────────────────────────────
        fetchSessions: async () => {
          const sessions = await authAPI.getSessions();
          set({ sessions });
        },

        revokeSession: async (sessionId: string) => {
          const success = await authAPI.revokeSession(sessionId);
          
          if (success) {
            set(state => ({
              sessions: state.sessions.filter(s => s.id !== sessionId),
            }));
          }
          
          return success;
        },

        // ─────────────────────────────────────────────────────────────────────
        // Password
        // ─────────────────────────────────────────────────────────────────────
        requestPasswordReset: async (email: string) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.requestPasswordReset(email);
          
          set({ isLoading: false });
          return success;
        },

        resetPassword: async (token: string, newPassword: string) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.resetPassword(token, newPassword);
          
          set({ isLoading: false });
          return success;
        },

        changePassword: async (currentPassword: string, newPassword: string) => {
          set({ isLoading: true, error: null });
          
          const success = await authAPI.changePassword(currentPassword, newPassword);
          
          if (!success) {
            set({
              error: {
                message: 'Failed to change password',
                code: 'PASSWORD_CHANGE_FAILED',
              },
            });
          }
          
          set({ isLoading: false });
          return success;
        },

        // ─────────────────────────────────────────────────────────────────────
        // User
        // ─────────────────────────────────────────────────────────────────────
        refreshUser: async () => {
          const user = await authAPI.getCurrentUser();
          set({ user });
        },

        updateProfile: async (updates: Partial<User>) => {
          set({ isLoading: true, error: null });
          
          const user = await authAPI.updateProfile(updates);
          
          if (user) {
            set({ user, isLoading: false });
          } else {
            set({
              isLoading: false,
              error: {
                message: 'Failed to update profile',
                code: 'UPDATE_FAILED',
              },
            });
          }
          
          return user;
        },

        // ─────────────────────────────────────────────────────────────────────
        // Utilities
        // ─────────────────────────────────────────────────────────────────────
        clearError: () => set({ error: null }),
        
        setError: (error: AuthError) => set({ error }),
      }),
      {
        name: 'chenu-auth',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          // Only persist minimal state
          status: state.status,
          user: state.user,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);


// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const selectIsAuthenticated = (state: AuthState) => 
  state.status === 'authenticated';

export const selectUser = (state: AuthState) => state.user;

export const selectIsLoading = (state: AuthState) => state.isLoading;

export const selectError = (state: AuthState) => state.error;

export const selectRequires2FA = (state: AuthState) => 
  state.status === 'requires_2fa';

export const selectHas2FAEnabled = (state: AuthState) => 
  state.user?.twoFactorEnabled ?? false;


// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useIsAuthenticated(): boolean {
  return useAuthStore(selectIsAuthenticated);
}

export function useUser(): User | null {
  return useAuthStore(selectUser);
}

export function useAuthLoading(): boolean {
  return useAuthStore(selectIsLoading);
}

export function useAuthError(): AuthError | null {
  return useAuthStore(selectError);
}

export function useRequires2FA(): boolean {
  return useAuthStore(selectRequires2FA);
}


export default useAuthStore;
