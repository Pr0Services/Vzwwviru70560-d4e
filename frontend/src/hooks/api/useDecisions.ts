/**
 * CHE·NU V75 — Decisions API Hooks
 * Hooks for decision points with aging system
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgingLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLINK' | 'ARCHIVE';
export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'deferred' | 'expired';
export type DecisionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  estimated_impact: 'low' | 'medium' | 'high';
}

export interface AISuggestion {
  id: string;
  type: 'recommendation' | 'warning' | 'info';
  content: string;
  confidence: number;
  source: string;
}

export interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  context: string;
  sphere_id: string;
  thread_id: string;
  status: DecisionStatus;
  priority: DecisionPriority;
  aging_level: AgingLevel;
  aging_started_at: string;
  deadline?: string;
  options: DecisionOption[];
  ai_suggestions: AISuggestion[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolved_by?: string;
  chosen_option_id?: string;
}

export interface DecisionFilters {
  status?: DecisionStatus;
  priority?: DecisionPriority;
  aging_level?: AgingLevel;
  sphere_id?: string;
  thread_id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all decisions with optional filters
 */
export function useDecisions(filters?: DecisionFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.DECISIONS, filters],
    queryFn: async () => {
      const response = await apiClient.get<DecisionPoint[]>(
        API_CONFIG.ENDPOINTS.DECISIONS.LIST,
        { params: filters }
      );
      return response;
    },
    staleTime: STALE_TIMES.FREQUENT,
  });
}

/**
 * Fetch a single decision by ID
 */
export function useDecision(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.DECISIONS, id],
    queryFn: async () => {
      const response = await apiClient.get<DecisionPoint>(
        API_CONFIG.ENDPOINTS.DECISIONS.DETAIL(id)
      );
      return response;
    },
    enabled: !!id,
  });
}

/**
 * Fetch pending decisions (not resolved)
 */
export function usePendingDecisions() {
  return useDecisions({ status: 'pending' });
}

/**
 * Fetch BLINK decisions (critical aging)
 */
export function useBlinkDecisions() {
  return useDecisions({ aging_level: 'BLINK' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface ResolveDecisionInput {
  decision_id: string;
  chosen_option_id: string;
  rationale?: string;
}

interface DeferDecisionInput {
  decision_id: string;
  defer_until: string;
  reason?: string;
}

/**
 * Resolve a decision by choosing an option
 */
export function useResolveDecision() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: ResolveDecisionInput) => {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.DECISIONS.MAKE,
        {
          decision_id: input.decision_id,
          chosen_option_id: input.chosen_option_id,
          rationale: input.rationale,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECISIONS] });
    },
  });
}

/**
 * Defer a decision to a later date
 */
export function useDeferDecision() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: DeferDecisionInput) => {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.DECISIONS.DEFER(input.decision_id),
        {
          defer_until: input.defer_until,
          reason: input.reason,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECISIONS] });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get decision counts by aging level
 */
export function useDecisionCounts() {
  const { data: decisions } = useDecisions();
  
  if (!decisions) {
    return { green: 0, yellow: 0, red: 0, blink: 0, archive: 0, total: 0 };
  }
  
  return {
    green: decisions.filter(d => d.aging_level === 'GREEN').length,
    yellow: decisions.filter(d => d.aging_level === 'YELLOW').length,
    red: decisions.filter(d => d.aging_level === 'RED').length,
    blink: decisions.filter(d => d.aging_level === 'BLINK').length,
    archive: decisions.filter(d => d.aging_level === 'ARCHIVE').length,
    total: decisions.length,
  };
}

/**
 * Aging level configuration
 */
export const AGING_CONFIG = {
  GREEN: {
    color: '#4ADE80',
    label: 'Récente',
    description: 'Décision récente, pas d\'urgence',
    days: '0-3 jours',
  },
  YELLOW: {
    color: '#FACC15',
    label: 'Attention',
    description: 'Décision nécessitant attention',
    days: '3-7 jours',
  },
  RED: {
    color: '#EF4444',
    label: 'Urgente',
    description: 'Décision urgente à prendre',
    days: '7-14 jours',
  },
  BLINK: {
    color: '#FF0000',
    label: 'Critique',
    description: 'Action immédiate requise',
    days: '14+ jours',
    animation: true,
  },
  ARCHIVE: {
    color: '#6B7B6B',
    label: 'Archivée',
    description: 'Décision expirée ou archivée',
    days: 'Expirée',
  },
};
