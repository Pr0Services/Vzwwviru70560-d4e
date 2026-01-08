/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — SPHERES HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team' 
  | 'scholar';

export interface Sphere {
  id: SphereId;
  name: string;
  name_fr: string;
  description: string;
  description_fr: string;
  icon: string;
  color: string;
  gradient: string;
  is_active: boolean;
  thread_count: number;
  agent_count: number;
  created_at: string;
}

export interface SphereStats {
  sphere_id: SphereId;
  threads: {
    active: number;
    total: number;
    recent: number;
  };
  agents: {
    hired: number;
    available: number;
  };
  decisions: {
    pending: number;
    total: number;
  };
  tokens: {
    used: number;
    budget: number;
  };
  activity: {
    events_today: number;
    events_week: number;
  };
}

export interface SphereThread {
  id: string;
  title: string;
  status: string;
  last_activity_at: string;
  event_count: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all spheres
 */
export function useSpheres() {
  return useQuery<Sphere[]>({
    queryKey: QUERY_KEYS.SPHERES,
    queryFn: () => apiClient.get<Sphere[]>(API_CONFIG.ENDPOINTS.SPHERES.LIST),
    staleTime: STALE_TIMES.VERY_STATIC,
  });
}

/**
 * Fetch single sphere by ID
 */
export function useSphere(sphereId: SphereId | string | undefined) {
  return useQuery<Sphere>({
    queryKey: QUERY_KEYS.SPHERE(sphereId || ''),
    queryFn: () => apiClient.get<Sphere>(API_CONFIG.ENDPOINTS.SPHERES.DETAIL(sphereId!)),
    enabled: !!sphereId,
    staleTime: STALE_TIMES.STATIC,
  });
}

/**
 * Fetch sphere stats
 */
export function useSphereStats(sphereId: SphereId | string | undefined) {
  return useQuery<SphereStats>({
    queryKey: QUERY_KEYS.SPHERE_STATS(sphereId || ''),
    queryFn: () => apiClient.get<SphereStats>(API_CONFIG.ENDPOINTS.SPHERES.STATS(sphereId!)),
    enabled: !!sphereId,
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch threads in a sphere
 */
export function useSphereThreads(sphereId: SphereId | string | undefined) {
  return useQuery<SphereThread[]>({
    queryKey: [...QUERY_KEYS.SPHERE(sphereId || ''), 'threads'],
    queryFn: () => apiClient.get<SphereThread[]>(API_CONFIG.ENDPOINTS.SPHERES.THREADS(sphereId!)),
    enabled: !!sphereId,
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch active spheres only
 */
export function useActiveSpheres() {
  const { data: spheres, ...rest } = useSpheres();
  return {
    data: spheres?.filter(s => s.is_active),
    ...rest,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Static sphere metadata (for when API is unavailable)
 */
export const SPHERE_METADATA: Record<SphereId, { icon: string; color: string; gradient: string }> = {
  personal: {
    icon: '🏠',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
  },
  business: {
    icon: '💼',
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  government: {
    icon: '🏛️',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  studio: {
    icon: '🎨',
    color: '#EC4899',
    gradient: 'from-pink-500 to-pink-600',
  },
  community: {
    icon: '👥',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-600',
  },
  social: {
    icon: '📱',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-violet-600',
  },
  entertainment: {
    icon: '🎬',
    color: '#EF4444',
    gradient: 'from-red-500 to-red-600',
  },
  my_team: {
    icon: '🤝',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-teal-600',
  },
  scholar: {
    icon: '📚',
    color: '#0EA5E9',
    gradient: 'from-sky-500 to-sky-600',
  },
};

/**
 * Get sphere icon
 */
export function getSphereIcon(sphereId: SphereId): string {
  return SPHERE_METADATA[sphereId]?.icon || '🔮';
}

/**
 * Get sphere color
 */
export function getSphereColor(sphereId: SphereId): string {
  return SPHERE_METADATA[sphereId]?.color || '#6B7280';
}

/**
 * Get sphere gradient
 */
export function getSphereGradient(sphereId: SphereId): string {
  return SPHERE_METADATA[sphereId]?.gradient || 'from-gray-500 to-gray-600';
}
