/**
 * CHE·NU™ Authentication Services Index V72
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

// API Client
export { 
  authAPI,
  validatePasswordStrength,
  type User,
  type Session,
  type AuthTokens,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
  type TwoFactorSetup,
  type PasswordStrength,
  type LinkedAccount,
  type AuthProvider,
  type SessionStatus,
} from './authAPI';

// Store
export {
  useAuthStore,
  useIsAuthenticated,
  useUser,
  useAuthLoading,
  useAuthError,
  useRequires2FA,
  selectIsAuthenticated,
  selectUser,
  selectIsLoading,
  selectError,
  selectRequires2FA,
  selectHas2FAEnabled,
  type AuthState,
  type AuthStatus,
  type AuthError,
} from './authStore';

// Hooks
export { useAuth } from './useAuth';
