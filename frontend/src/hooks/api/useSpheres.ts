/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SPHERE HOOKS                                    ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, queryKeys } from './client'
import type { Sphere, SphereId, SphereStats, BureauSection } from '@/types/api.generated'

// ============================================================================
// SPHERE HOOKS
// ============================================================================

/**
 * Get all spheres
 */
export function useSpheres() {
  return useQuery({
    queryKey: queryKeys.spheres.list(),
    queryFn: () => apiGet<Sphere[]>('/spheres'),
    staleTime: 5 * 60 * 1000, // 5 minutes - spheres don't change often
  })
}

/**
 * Get single sphere by ID
 */
export function useSphere(sphereId: SphereId | undefined) {
  return useQuery({
    queryKey: queryKeys.spheres.detail(sphereId || ''),
    queryFn: () => apiGet<Sphere>(`/spheres/${sphereId}`),
    enabled: !!sphereId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get sphere statistics
 */
export function useSphereStats(sphereId: SphereId | undefined) {
  return useQuery({
    queryKey: queryKeys.spheres.stats(sphereId || ''),
    queryFn: () => apiGet<SphereStats>(`/spheres/${sphereId}/stats`),
    enabled: !!sphereId,
    staleTime: 60 * 1000, // 1 minute - stats update more frequently
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Get bureau sections for a sphere
 */
export function useBureauSections(sphereId: SphereId | undefined) {
  return useQuery({
    queryKey: queryKeys.spheres.sections(sphereId || ''),
    queryFn: () => apiGet<BureauSection[]>(`/spheres/${sphereId}/sections`),
    enabled: !!sphereId,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// SPHERE UTILITIES
// ============================================================================

/**
 * Get sphere from cache or fetch
 */
export function useSphereFromCache(sphereId: SphereId | undefined) {
  const queryClient = useQueryClient()
  
  // Try to get from list cache first
  const spheres = queryClient.getQueryData<Sphere[]>(queryKeys.spheres.list())
  const cachedSphere = spheres?.find(s => s.id === sphereId)
  
  // If not in cache, fetch
  const { data: fetchedSphere, ...rest } = useSphere(cachedSphere ? undefined : sphereId)
  
  return {
    data: cachedSphere || fetchedSphere,
    ...rest,
  }
}

/**
 * Prefetch sphere data
 */
export async function prefetchSphere(
  queryClient: ReturnType<typeof useQueryClient>,
  sphereId: SphereId
) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.spheres.detail(sphereId),
      queryFn: () => apiGet<Sphere>(`/spheres/${sphereId}`),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.spheres.sections(sphereId),
      queryFn: () => apiGet<BureauSection[]>(`/spheres/${sphereId}/sections`),
    }),
  ])
}

/**
 * Prefetch all spheres
 */
export async function prefetchSpheres(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.spheres.list(),
    queryFn: () => apiGet<Sphere[]>('/spheres'),
  })
}

// ============================================================================
// SPHERE SELECTORS
// ============================================================================

/**
 * Select active spheres only
 */
export function useActiveSpheres() {
  const { data: spheres, ...rest } = useSpheres()
  
  return {
    data: spheres?.filter(s => s.is_active),
    ...rest,
  }
}

/**
 * Get sphere color by ID
 */
export function useSphereColor(sphereId: SphereId | undefined): string {
  const { data: sphere } = useSphereFromCache(sphereId)
  return sphere?.color || '#6B7280' // Default gray
}

/**
 * Get sphere icon by ID
 */
export function useSphereIcon(sphereId: SphereId | undefined): string {
  const { data: sphere } = useSphereFromCache(sphereId)
  return sphere?.icon || '📁'
}
