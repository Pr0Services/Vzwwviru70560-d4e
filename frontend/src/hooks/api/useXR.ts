/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — XR HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * XR = Mixed Reality Environment Generation
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type XRTemplateId = 
  | 'personal_room' 
  | 'business_room' 
  | 'cause_room' 
  | 'lab_room' 
  | 'custom_room';

export type CanonicalZone = 
  | 'intent_wall'
  | 'decision_wall'
  | 'action_table'
  | 'memory_kiosk'
  | 'timeline_strip'
  | 'resource_shelf';

export interface XREnvironment {
  id: string;
  name: string;
  template_id: XRTemplateId;
  thread_id: string;
  thread_title: string;
  sphere_id: string;
  zones: XRZone[];
  status: 'generating' | 'ready' | 'error';
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

export interface XRZone {
  id: string;
  type: CanonicalZone;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  content?: Record<string, unknown>;
  is_interactive: boolean;
}

export interface XRTemplate {
  id: XRTemplateId;
  name: string;
  name_fr: string;
  description: string;
  description_fr: string;
  preview_image: string;
  default_zones: CanonicalZone[];
  customization_options: string[];
}

export interface GenerateXRInput {
  thread_id: string;
  template_id: XRTemplateId;
  options?: {
    zones?: CanonicalZone[];
    theme?: 'light' | 'dark' | 'auto';
    density?: 'minimal' | 'standard' | 'detailed';
  };
}

export interface XRPreview {
  environment_id: string;
  preview_url: string;
  thumbnail_url: string;
  expires_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all XR environments
 */
export function useXREnvironments(threadId?: string) {
  return useQuery<XREnvironment[]>({
    queryKey: [...QUERY_KEYS.XR_ENVIRONMENTS, { threadId }],
    queryFn: () => apiClient.get<XREnvironment[]>(
      API_CONFIG.ENDPOINTS.XR.ENVIRONMENTS,
      { params: threadId ? { thread_id: threadId } : undefined }
    ),
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch XR templates
 */
export function useXRTemplates() {
  return useQuery<XRTemplate[]>({
    queryKey: QUERY_KEYS.XR_TEMPLATES,
    queryFn: () => apiClient.get<XRTemplate[]>(API_CONFIG.ENDPOINTS.XR.TEMPLATES),
    staleTime: STALE_TIMES.VERY_STATIC,
  });
}

/**
 * Fetch single XR environment
 */
export function useXREnvironment(environmentId: string | undefined) {
  return useQuery<XREnvironment>({
    queryKey: [...QUERY_KEYS.XR_ENVIRONMENTS, environmentId],
    queryFn: () => apiClient.get<XREnvironment>(`${API_CONFIG.ENDPOINTS.XR.ENVIRONMENTS}/${environmentId}`),
    enabled: !!environmentId,
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch XR preview
 */
export function useXRPreview(environmentId: string | undefined) {
  return useQuery<XRPreview>({
    queryKey: [...QUERY_KEYS.XR_ENVIRONMENTS, environmentId, 'preview'],
    queryFn: () => apiClient.get<XRPreview>(API_CONFIG.ENDPOINTS.XR.PREVIEW(environmentId!)),
    enabled: !!environmentId,
    staleTime: STALE_TIMES.FREQUENT,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate XR environment from thread
 */
export function useGenerateXR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateXRInput) =>
      apiClient.post<XREnvironment>(API_CONFIG.ENDPOINTS.XR.GENERATE, input),
    onSuccess: (newEnv) => {
      // Invalidate XR environments list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.XR_ENVIRONMENTS });
      // Invalidate thread's XR environments
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.XR_ENVIRONMENTS, { threadId: newEnv.thread_id }] 
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Canonical zone metadata
 */
export const CANONICAL_ZONES: Record<CanonicalZone, { name: string; description: string; icon: string }> = {
  intent_wall: {
    name: 'Intent Wall',
    description: 'Affiche l\'intention fondatrice du Thread',
    icon: '🎯',
  },
  decision_wall: {
    name: 'Decision Wall',
    description: 'Historique des décisions prises',
    icon: '⚖️',
  },
  action_table: {
    name: 'Action Table',
    description: 'Actions en cours et à venir',
    icon: '📋',
  },
  memory_kiosk: {
    name: 'Memory Kiosk',
    description: 'Accès à la mémoire du Thread',
    icon: '🧠',
  },
  timeline_strip: {
    name: 'Timeline Strip',
    description: 'Timeline des événements',
    icon: '📅',
  },
  resource_shelf: {
    name: 'Resource Shelf',
    description: 'Liens et ressources associés',
    icon: '📚',
  },
};

/**
 * Template metadata
 */
export const XR_TEMPLATE_META: Record<XRTemplateId, { icon: string; color: string }> = {
  personal_room: { icon: '🏠', color: '#3B82F6' },
  business_room: { icon: '💼', color: '#10B981' },
  cause_room: { icon: '🎯', color: '#8B5CF6' },
  lab_room: { icon: '🔬', color: '#EC4899' },
  custom_room: { icon: '✨', color: '#F59E0B' },
};
