/**
 * CHE·NU™ V75 — useIdentity Hook
 * 
 * Multi-Identity System API Hook
 * GOUVERNANCE > EXÉCUTION
 * 
 * Identity = User context (Personal, Enterprise, Creative, etc.)
 * Strict identity isolation enforced.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Identity {
  id: string;
  name: string;
  identity_type: IdentityType;
  description?: string;
  avatar_url?: string;
  is_active: boolean;
  is_default: boolean;
  sphere_ids: string[];
  permissions: Permission[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

export type IdentityType = 
  | 'personal'      // Personal life context
  | 'enterprise'    // Business/corporate context
  | 'creative'      // Creative/artistic context
  | 'professional'  // Freelance/consulting
  | 'family'        // Family shared context
  | 'community'     // Community/organization
  | 'custom';       // User-defined

export interface Permission {
  id: string;
  resource_type: string;
  resource_id?: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  granted_at: string;
  granted_by?: string;
}

export interface IdentityStats {
  total_identities: number;
  active_identity: Identity | null;
  identities_by_type: Record<IdentityType, number>;
  total_spheres: number;
  total_threads: number;
}

export interface CreateIdentityRequest {
  name: string;
  identity_type: IdentityType;
  description?: string;
  sphere_ids?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateIdentityRequest {
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
}

export interface IsolationCheckResult {
  is_isolated: boolean;
  violations: Array<{
    type: string;
    resource_id: string;
    message: string;
  }>;
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const identityKeys = {
  all: ['identity'] as const,
  lists: () => [...identityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...identityKeys.lists(), filters] as const,
  types: () => [...identityKeys.all, 'types'] as const,
  current: () => [...identityKeys.all, 'current'] as const,
  stats: () => [...identityKeys.all, 'stats'] as const,
  details: () => [...identityKeys.all, 'detail'] as const,
  detail: (id: string) => [...identityKeys.details(), id] as const,
  permissions: (id: string) => [...identityKeys.detail(id), 'permissions'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all identities for current user
 */
export function useIdentities(filters?: { type?: IdentityType; is_active?: boolean }) {
  return useQuery({
    queryKey: identityKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
      
      const response = await apiClient.get(`/identity?${params.toString()}`);
      return response.data as { identities: Identity[]; total: number };
    },
  });
}

/**
 * Fetch available identity types
 */
export function useIdentityTypes() {
  return useQuery({
    queryKey: identityKeys.types(),
    queryFn: async () => {
      const response = await apiClient.get('/identity/types');
      return response.data as { 
        types: Array<{
          id: IdentityType;
          name: string;
          description: string;
          icon: string;
          default_spheres: string[];
        }>;
      };
    },
    staleTime: Infinity, // Types don't change
  });
}

/**
 * Fetch current active identity
 */
export function useCurrentIdentity() {
  return useQuery({
    queryKey: identityKeys.current(),
    queryFn: async () => {
      const response = await apiClient.get('/identity/current');
      return response.data as Identity;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch identity stats
 */
export function useIdentityStats() {
  return useQuery({
    queryKey: identityKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/identity/stats');
      return response.data as IdentityStats;
    },
  });
}

/**
 * Fetch single identity by ID
 */
export function useIdentity(identityId: string) {
  return useQuery({
    queryKey: identityKeys.detail(identityId),
    queryFn: async () => {
      const response = await apiClient.get(`/identity/${identityId}`);
      return response.data as Identity;
    },
    enabled: !!identityId,
  });
}

/**
 * Create new identity
 */
export function useCreateIdentity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateIdentityRequest) => {
      const response = await apiClient.post('/identity', data);
      return response.data as Identity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.all });
    },
  });
}

/**
 * Update identity
 */
export function useUpdateIdentity(identityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateIdentityRequest) => {
      const response = await apiClient.patch(`/identity/${identityId}`, data);
      return response.data as Identity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.detail(identityId) });
      queryClient.invalidateQueries({ queryKey: identityKeys.lists() });
    },
  });
}

/**
 * Switch active identity
 * 
 * IMPORTANT: This changes the user's current context.
 * All subsequent API calls will be scoped to the new identity.
 */
export function useSwitchIdentity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (identityId: string) => {
      const response = await apiClient.post('/identity/switch', { identity_id: identityId });
      return response.data as Identity;
    },
    onSuccess: () => {
      // Invalidate all queries as context has changed
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Delete identity
 * 
 * WARNING: This is a destructive action.
 * Associated data may be orphaned or deleted.
 */
export function useDeleteIdentity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (identityId: string) => {
      await apiClient.delete(`/identity/${identityId}`);
      return identityId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.all });
    },
  });
}

/**
 * Fetch permissions for identity
 */
export function useIdentityPermissions(identityId: string) {
  return useQuery({
    queryKey: identityKeys.permissions(identityId),
    queryFn: async () => {
      const response = await apiClient.get(`/identity/${identityId}/permissions`);
      return response.data as { permissions: Permission[] };
    },
    enabled: !!identityId,
  });
}

/**
 * Add permission to identity
 */
export function useAddPermission(identityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { resource_type: string; resource_id?: string; action: string }) => {
      const response = await apiClient.post(`/identity/${identityId}/permissions`, data);
      return response.data as Permission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.permissions(identityId) });
    },
  });
}

/**
 * Remove permission from identity
 */
export function useRemovePermission(identityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (permission: string) => {
      await apiClient.delete(`/identity/${identityId}/permissions/${permission}`);
      return permission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.permissions(identityId) });
    },
  });
}

/**
 * Check identity isolation
 * 
 * Verifies that the identity has proper data isolation.
 * Returns any potential cross-identity data access violations.
 */
export function useCheckIsolation() {
  return useMutation({
    mutationFn: async (data?: { identity_id?: string }) => {
      const response = await apiClient.post('/identity/check-isolation', data || {});
      return response.data as IsolationCheckResult;
    },
  });
}

export default {
  useIdentities,
  useIdentityTypes,
  useCurrentIdentity,
  useIdentityStats,
  useIdentity,
  useCreateIdentity,
  useUpdateIdentity,
  useSwitchIdentity,
  useDeleteIdentity,
  useIdentityPermissions,
  useAddPermission,
  useRemovePermission,
  useCheckIsolation,
};
