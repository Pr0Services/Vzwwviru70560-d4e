/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — AUTH HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, tokenManager } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  created_at: string;
  last_login_at?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr';
  notifications_enabled: boolean;
  default_sphere?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  language?: 'en' | 'fr';
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch current user
 */
export function useCurrentUser() {
  return useQuery<User>({
    queryKey: QUERY_KEYS.USER_ME,
    queryFn: () => apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME),
    staleTime: STALE_TIMES.STATIC,
    enabled: tokenManager.isAuthenticated(),
    retry: false,
  });
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useCurrentUser();
  
  return {
    isAuthenticated: !!user && !isError,
    isLoading,
    user,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        input,
        { skipAuth: true }
      );
      
      // Store tokens
      tokenManager.setTokens(response.access_token, response.refresh_token);
      
      return response;
    },
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(QUERY_KEYS.USER_ME, data.user);
      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        input,
        { skipAuth: true }
      );
      
      // Store tokens
      tokenManager.setTokens(response.access_token, response.refresh_token);
      
      return response;
    },
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(QUERY_KEYS.USER_ME, data.user);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      } finally {
        // Always clear tokens, even if API call fails
        tokenManager.clearTokens();
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}

/**
 * Change password mutation
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      apiClient.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, input),
  });
}

/**
 * Update user preferences
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<UserPreferences>) =>
      apiClient.patch<User>(`${API_CONFIG.ENDPOINTS.AUTH.ME}/preferences`, preferences),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.USER_ME, updatedUser);
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get auth state for routing
 */
export function useAuthState() {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    hasToken: tokenManager.isAuthenticated(),
  };
}
