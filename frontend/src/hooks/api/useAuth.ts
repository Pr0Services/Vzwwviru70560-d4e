/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AUTH & USER HOOKS                               ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPatch, queryKeys, parseAPIError } from './client'
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest,
  TokenBalance,
} from '@/types/api.generated'

// ============================================================================
// AUTH HOOKS
// ============================================================================

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiPost<LoginResponse>('/auth/login', data)
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      return response
    },
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.user.me(), data.user)
    },
    onError: (error) => {
      const parsed = parseAPIError(error)
      logger.error('Login failed:', parsed.message)
    },
  })
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiPost<LoginResponse>('/auth/register', data)
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      return response
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.me(), data.user)
    },
  })
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      try {
        await apiPost('/auth/logout')
      } finally {
        // Always clear local storage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear()
    },
  })
}

// ============================================================================
// USER HOOKS
// ============================================================================

/**
 * Get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: () => apiGet<User>('/users/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  })
}

/**
 * Update current user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => 
      apiPatch<User>('/users/me', data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.user.me(), updatedUser)
    },
  })
}

/**
 * Get user token balance
 */
export function useTokenBalance() {
  return useQuery({
    queryKey: queryKeys.user.tokens(),
    queryFn: () => apiGet<TokenBalance>('/users/me/tokens'),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// ============================================================================
// AUTH STATE HELPERS
// ============================================================================

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser()
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  }
}

/**
 * Prefetch user data (for SSR or preloading)
 */
export async function prefetchUser(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.me(),
    queryFn: () => apiGet<User>('/users/me'),
  })
}
