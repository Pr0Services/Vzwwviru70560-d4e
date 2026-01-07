/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — API CLIENT                                      ║
 * ║                    Sprint B3.2: TanStack Query Integration                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { QueryClient } from '@tanstack/react-query'
import type { APIError } from '@/types/api.generated'

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'
const API_TIMEOUT = 30000

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID()
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<APIError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          
          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)
          
          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// ============================================================================
// QUERY CLIENT
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache time - keep in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry logic
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status && status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Network mode
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
})

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    tokens: () => [...queryKeys.user.all, 'tokens'] as const,
  },
  
  // Spheres
  spheres: {
    all: ['spheres'] as const,
    list: () => [...queryKeys.spheres.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.spheres.all, 'detail', id] as const,
    stats: (id: string) => [...queryKeys.spheres.all, 'stats', id] as const,
    sections: (id: string) => [...queryKeys.spheres.all, 'sections', id] as const,
  },
  
  // Threads
  threads: {
    all: ['threads'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.threads.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.threads.all, 'detail', id] as const,
    messages: (id: string, page?: number) => 
      [...queryKeys.threads.all, 'messages', id, page] as const,
  },
  
  // Agents
  agents: {
    all: ['agents'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.agents.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.agents.all, 'detail', id] as const,
    hired: () => [...queryKeys.agents.all, 'hired'] as const,
    tasks: (hiredId: string) => [...queryKeys.agents.all, 'tasks', hiredId] as const,
  },
  
  // Nova
  nova: {
    all: ['nova'] as const,
    status: () => [...queryKeys.nova.all, 'status'] as const,
  },
  
  // Governance
  governance: {
    all: ['governance'] as const,
    checkpoints: (status?: string) => 
      [...queryKeys.governance.all, 'checkpoints', status] as const,
    checkpoint: (id: string) => [...queryKeys.governance.all, 'checkpoint', id] as const,
    stats: () => [...queryKeys.governance.all, 'stats'] as const,
    audit: (filters?: Record<string, unknown>) => 
      [...queryKeys.governance.all, 'audit', filters] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (unreadOnly?: boolean) => 
      [...queryKeys.notifications.all, 'list', unreadOnly] as const,
  },
} as const

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ParsedAPIError {
  message: string
  code: string
  field?: string
  status: number
}

export function parseAPIError(error: unknown): ParsedAPIError {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const data = error.response?.data as APIError | undefined
    
    return {
      message: data?.detail || error.message || 'An error occurred',
      code: data?.code || 'UNKNOWN_ERROR',
      field: data?.field,
      status,
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
      status: 0,
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 0,
  }
}

// ============================================================================
// API HELPERS
// ============================================================================

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

export async function apiPost<T, D = unknown>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

export async function apiPatch<T, D = unknown>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config)
  return response.data
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

// ============================================================================
// EXPORTS
// ============================================================================

export default apiClient
