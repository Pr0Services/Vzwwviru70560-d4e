/**
 * CHE·NU™ useAuth Hook V72
 * 
 * Convenience hook for authentication operations.
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

import { useCallback, useEffect } from 'react';
import { useAuthStore } from './authStore';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  TwoFactorSetup,
  Session,
  LinkedAccount,
  AuthProvider,
} from './authAPI';


// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: { message: string; code?: string } | null;
  requires2FA: boolean;
  
  // Auth Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResponse>;
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<number>;
  
  // 2FA
  verify2FA: (code: string, isBackupCode?: boolean) => Promise<AuthResponse>;
  enable2FA: () => Promise<TwoFactorSetup | null>;
  confirm2FA: (code: string) => Promise<boolean>;
  disable2FA: (password: string) => Promise<boolean>;
  regenerateBackupCodes: (password: string) => Promise<string[] | null>;
  has2FAEnabled: boolean;
  twoFactorSetup: TwoFactorSetup | null;
  
  // OAuth
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  handleOAuthCallback: (provider: AuthProvider, code: string, state: string) => Promise<AuthResponse>;
  linkAccount: (provider: AuthProvider) => Promise<void>;
  unlinkAccount: (provider: AuthProvider) => Promise<boolean>;
  linkedAccounts: LinkedAccount[];
  
  // Sessions
  sessions: Session[];
  fetchSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  
  // Password
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // User
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
  refreshUser: () => Promise<void>;
  
  // Utilities
  clearError: () => void;
}


// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useAuth(): UseAuthReturn {
  const store = useAuthStore();
  
  // Initialize on mount
  useEffect(() => {
    if (!store.isInitialized) {
      store.initialize();
    }
  }, [store.isInitialized, store.initialize]);
  
  // Memoized actions
  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      return store.login({ email, password, rememberMe });
    },
    [store.login]
  );
  
  const register = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      return store.register({ 
        email, 
        password, 
        confirmPassword, 
        acceptTerms: true 
      });
    },
    [store.register]
  );
  
  const loginWithGoogle = useCallback(
    () => store.loginWithOAuth('google'),
    [store.loginWithOAuth]
  );
  
  const loginWithMicrosoft = useCallback(
    () => store.loginWithOAuth('microsoft'),
    [store.loginWithOAuth]
  );
  
  const loginWithGitHub = useCallback(
    () => store.loginWithOAuth('github'),
    [store.loginWithOAuth]
  );
  
  const linkAccount = useCallback(
    (provider: AuthProvider) => store.linkOAuthAccount(provider),
    [store.linkOAuthAccount]
  );
  
  return {
    // State
    user: store.user,
    isAuthenticated: store.status === 'authenticated',
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    error: store.error,
    requires2FA: store.status === 'requires_2fa',
    
    // Auth Actions
    login,
    register,
    logout: store.logout,
    logoutAllDevices: store.logoutAllDevices,
    
    // 2FA
    verify2FA: store.verify2FA,
    enable2FA: store.enable2FA,
    confirm2FA: store.confirm2FA,
    disable2FA: store.disable2FA,
    regenerateBackupCodes: store.regenerateBackupCodes,
    has2FAEnabled: store.user?.twoFactorEnabled ?? false,
    twoFactorSetup: store.twoFactorSetup,
    
    // OAuth
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithGitHub,
    handleOAuthCallback: store.handleOAuthCallback,
    linkAccount,
    unlinkAccount: store.unlinkOAuthAccount,
    linkedAccounts: store.linkedAccounts,
    
    // Sessions
    sessions: store.sessions,
    fetchSessions: store.fetchSessions,
    revokeSession: store.revokeSession,
    
    // Password
    requestPasswordReset: store.requestPasswordReset,
    resetPassword: store.resetPassword,
    changePassword: store.changePassword,
    
    // User
    updateProfile: store.updateProfile,
    refreshUser: store.refreshUser,
    
    // Utilities
    clearError: store.clearError,
  };
}


export default useAuth;
