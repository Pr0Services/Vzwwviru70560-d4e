// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — GOVERNANCE STORE (ZUSTAND)
// State management pour gouvernance, budgets, scope lock
// DELTA APRÈS v38.2
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type ScopeLevel = 'selection' | 'document' | 'project' | 'sphere' | 'global';

export interface TokenBudget {
  total: number;
  used: number;
  remaining: number;
  reserved: number;
  lastUpdated: number;
}

export interface ScopeLock {
  active: boolean;
  level: ScopeLevel;
  targetId: string | null;
  targetName: string | null;
  lockedAt: number | null;
  lockedBy: string | null;
}

export interface PendingApproval {
  id: string;
  type: 'execution' | 'budget' | 'scope_change' | 'agent_action';
  description: string;
  estimatedTokens: number;
  agentId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface GovernanceViolation {
  id: string;
  rule: string;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: number;
  resolved: boolean;
}

// ═══════════════════════════════════════════════════════════════
// GOVERNANCE LAWS
// ═══════════════════════════════════════════════════════════════

export const GOVERNANCE_LAWS = {
  CONSENT_PRIMACY: {
    code: 'L1',
    name: 'Consent Primacy',
    nameFr: 'Primauté du Consentement',
    description: 'Nothing happens without user approval',
    enforcement: 'STRICT',
  },
  TEMPORAL_SOVEREIGNTY: {
    code: 'L2',
    name: 'Temporal Sovereignty',
    nameFr: 'Souveraineté Temporelle',
    description: 'User controls when actions happen',
    enforcement: 'STRICT',
  },
  CONTEXTUAL_FIDELITY: {
    code: 'L3',
    name: 'Contextual Fidelity',
    nameFr: 'Fidélité Contextuelle',
    description: 'Actions respect current context',
    enforcement: 'STRICT',
  },
  HIERARCHICAL_RESPECT: {
    code: 'L4',
    name: 'Hierarchical Respect',
    nameFr: 'Respect Hiérarchique',
    description: 'Agent hierarchy is maintained',
    enforcement: 'STANDARD',
  },
  AUDIT_COMPLETENESS: {
    code: 'L5',
    name: 'Audit Completeness',
    nameFr: 'Exhaustivité de l\'Audit',
    description: 'Everything is logged and traceable',
    enforcement: 'STRICT',
  },
  ENCODING_TRANSPARENCY: {
    code: 'L6',
    name: 'Encoding Transparency',
    nameFr: 'Transparence de l\'Encodage',
    description: 'Encoding is visible and explainable',
    enforcement: 'STANDARD',
  },
  AGENT_NON_AUTONOMY: {
    code: 'L7',
    name: 'Agent Non-Autonomy',
    nameFr: 'Non-Autonomie des Agents',
    description: 'Agents never act autonomously',
    enforcement: 'STRICT',
  },
  BUDGET_ACCOUNTABILITY: {
    code: 'L8',
    name: 'Budget Accountability',
    nameFr: 'Responsabilité Budgétaire',
    description: 'Token costs are transparent',
    enforcement: 'STRICT',
  },
  CROSS_SPHERE_ISOLATION: {
    code: 'L9',
    name: 'Cross-Sphere Isolation',
    nameFr: 'Isolation Inter-Sphères',
    description: 'Spheres are isolated by default',
    enforcement: 'STRICT',
  },
  DELETION_COMPLETENESS: {
    code: 'L10',
    name: 'Deletion Completeness',
    nameFr: 'Exhaustivité de la Suppression',
    description: 'Deletions are complete and verifiable',
    enforcement: 'STRICT',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// STORE STATE INTERFACE
// ═══════════════════════════════════════════════════════════════

interface GovernanceState {
  // Budget
  budget: TokenBudget;
  sphereBudgets: Record<string, TokenBudget>;
  
  // Scope Lock
  scopeLock: ScopeLock;
  
  // Pending Approvals
  pendingApprovals: PendingApproval[];
  
  // Violations
  violations: GovernanceViolation[];
  
  // Governance Status
  governanceEnabled: boolean;
  strictMode: boolean;
  
  // Actions - Budget
  setBudget: (budget: Partial<TokenBudget>) => void;
  useTokens: (amount: number, sphereId?: string) => boolean;
  reserveTokens: (amount: number) => boolean;
  releaseReservedTokens: (amount: number) => void;
  resetBudget: () => void;
  
  // Actions - Scope Lock
  lockScope: (level: ScopeLevel, targetId: string, targetName: string, lockedBy: string) => void;
  unlockScope: () => void;
  isScopeLocked: () => boolean;
  getScopeLevel: () => ScopeLevel;
  
  // Actions - Approvals
  addPendingApproval: (approval: Omit<PendingApproval, 'id' | 'createdAt' | 'expiresAt'>) => string;
  approvePending: (id: string) => void;
  rejectPending: (id: string) => void;
  clearExpiredApprovals: () => void;
  
  // Actions - Violations
  addViolation: (violation: Omit<GovernanceViolation, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveViolation: (id: string) => void;
  clearResolvedViolations: () => void;
  
  // Actions - Settings
  toggleGovernance: () => void;
  toggleStrictMode: () => void;
  
  // Validation
  validateExecution: (estimatedTokens: number, agentId?: string) => { allowed: boolean; reason?: string };
  
  // Reset
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════

const DEFAULT_BUDGET: TokenBudget = {
  total: 100000,
  used: 0,
  remaining: 100000,
  reserved: 0,
  lastUpdated: Date.now(),
};

const DEFAULT_SCOPE_LOCK: ScopeLock = {
  active: false,
  level: 'document',
  targetId: null,
  targetName: null,
  lockedAt: null,
  lockedBy: null,
};

const APPROVAL_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// ═══════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════

export const useGovernanceStore = create<GovernanceState>()(
  persist(
    (set, get) => ({
      // Initial State
      budget: DEFAULT_BUDGET,
      sphereBudgets: {},
      scopeLock: DEFAULT_SCOPE_LOCK,
      pendingApprovals: [],
      violations: [],
      governanceEnabled: true,
      strictMode: false,

      // ─────────────────────────────────────────────────────────────
      // Budget Actions
      // ─────────────────────────────────────────────────────────────

      setBudget: (budget) => {
        set((state) => ({
          budget: {
            ...state.budget,
            ...budget,
            lastUpdated: Date.now(),
          },
        }));
      },

      useTokens: (amount, sphereId) => {
        const state = get();
        if (amount > state.budget.remaining) {
          // Add violation
          get().addViolation({
            rule: 'BUDGET_ACCOUNTABILITY',
            description: `Attempted to use ${amount} tokens but only ${state.budget.remaining} available`,
            severity: 'error',
          });
          return false;
        }

        set((state) => ({
          budget: {
            ...state.budget,
            used: state.budget.used + amount,
            remaining: state.budget.remaining - amount,
            lastUpdated: Date.now(),
          },
          sphereBudgets: sphereId
            ? {
                ...state.sphereBudgets,
                [sphereId]: {
                  ...state.sphereBudgets[sphereId],
                  used: (state.sphereBudgets[sphereId]?.used || 0) + amount,
                  remaining: (state.sphereBudgets[sphereId]?.remaining || 0) - amount,
                },
              }
            : state.sphereBudgets,
        }));

        return true;
      },

      reserveTokens: (amount) => {
        const state = get();
        if (amount > state.budget.remaining - state.budget.reserved) {
          return false;
        }

        set((state) => ({
          budget: {
            ...state.budget,
            reserved: state.budget.reserved + amount,
            lastUpdated: Date.now(),
          },
        }));

        return true;
      },

      releaseReservedTokens: (amount) => {
        set((state) => ({
          budget: {
            ...state.budget,
            reserved: Math.max(0, state.budget.reserved - amount),
            lastUpdated: Date.now(),
          },
        }));
      },

      resetBudget: () => {
        set({
          budget: DEFAULT_BUDGET,
          sphereBudgets: {},
        });
      },

      // ─────────────────────────────────────────────────────────────
      // Scope Lock Actions
      // ─────────────────────────────────────────────────────────────

      lockScope: (level, targetId, targetName, lockedBy) => {
        set({
          scopeLock: {
            active: true,
            level,
            targetId,
            targetName,
            lockedAt: Date.now(),
            lockedBy,
          },
        });
      },

      unlockScope: () => {
        set({ scopeLock: DEFAULT_SCOPE_LOCK });
      },

      isScopeLocked: () => {
        return get().scopeLock.active;
      },

      getScopeLevel: () => {
        return get().scopeLock.level;
      },

      // ─────────────────────────────────────────────────────────────
      // Approval Actions
      // ─────────────────────────────────────────────────────────────

      addPendingApproval: (approval) => {
        const id = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();

        set((state) => ({
          pendingApprovals: [
            ...state.pendingApprovals,
            {
              ...approval,
              id,
              createdAt: now,
              expiresAt: now + APPROVAL_EXPIRY_MS,
            },
          ],
        }));

        return id;
      },

      approvePending: (id) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.filter((a) => a.id !== id),
        }));
      },

      rejectPending: (id) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.filter((a) => a.id !== id),
        }));
      },

      clearExpiredApprovals: () => {
        const now = Date.now();
        set((state) => ({
          pendingApprovals: state.pendingApprovals.filter((a) => a.expiresAt > now),
        }));
      },

      // ─────────────────────────────────────────────────────────────
      // Violation Actions
      // ─────────────────────────────────────────────────────────────

      addViolation: (violation) => {
        const id = `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        set((state) => ({
          violations: [
            ...state.violations,
            {
              ...violation,
              id,
              timestamp: Date.now(),
              resolved: false,
            },
          ],
        }));
      },

      resolveViolation: (id) => {
        set((state) => ({
          violations: state.violations.map((v) =>
            v.id === id ? { ...v, resolved: true } : v
          ),
        }));
      },

      clearResolvedViolations: () => {
        set((state) => ({
          violations: state.violations.filter((v) => !v.resolved),
        }));
      },

      // ─────────────────────────────────────────────────────────────
      // Settings Actions
      // ─────────────────────────────────────────────────────────────

      toggleGovernance: () => {
        set((state) => ({ governanceEnabled: !state.governanceEnabled }));
      },

      toggleStrictMode: () => {
        set((state) => ({ strictMode: !state.strictMode }));
      },

      // ─────────────────────────────────────────────────────────────
      // Validation
      // ─────────────────────────────────────────────────────────────

      validateExecution: (estimatedTokens, agentId) => {
        const state = get();

        // Check if governance is enabled
        if (!state.governanceEnabled) {
          return { allowed: true };
        }

        // Check budget
        if (estimatedTokens > state.budget.remaining) {
          return {
            allowed: false,
            reason: `Insufficient budget. Required: ${estimatedTokens}, Available: ${state.budget.remaining}`,
          };
        }

        // Check scope lock
        if (!state.scopeLock.active && state.strictMode) {
          return {
            allowed: false,
            reason: 'Scope must be locked before execution in strict mode',
          };
        }

        // Check pending approvals limit
        if (state.pendingApprovals.length >= 10) {
          return {
            allowed: false,
            reason: 'Too many pending approvals. Please resolve existing approvals first.',
          };
        }

        return { allowed: true };
      },

      // ─────────────────────────────────────────────────────────────
      // Reset
      // ─────────────────────────────────────────────────────────────

      reset: () => {
        set({
          budget: DEFAULT_BUDGET,
          sphereBudgets: {},
          scopeLock: DEFAULT_SCOPE_LOCK,
          pendingApprovals: [],
          violations: [],
          governanceEnabled: true,
          strictMode: false,
        });
      },
    }),
    {
      name: 'chenu-governance-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        budget: state.budget,
        governanceEnabled: state.governanceEnabled,
        strictMode: state.strictMode,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════

export const useBudget = () => useGovernanceStore((state) => state.budget);
export const useScopeLock = () => useGovernanceStore((state) => state.scopeLock);
export const usePendingApprovals = () => useGovernanceStore((state) => state.pendingApprovals);
export const useViolations = () => useGovernanceStore((state) => state.violations);
export const useGovernanceEnabled = () => useGovernanceStore((state) => state.governanceEnabled);

export default useGovernanceStore;
