/**
 * CHE·NU™ - STAGING STORE
 * 
 * HARD LAW: Agents NEVER write directly to user data
 * All agent output goes to STAGING first
 * 
 * User must explicitly:
 * - Review staged content
 * - Approve before merge
 * - Compare with current version
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface StagedItem {
  id: string;
  sphereId: SphereId;
  threadId?: string;
  
  // Source
  agentId: string;
  agentName: string;
  workSessionId: string;
  
  // Content
  type: 'text' | 'document' | 'data' | 'code' | 'task' | 'note' | 'mixed';
  title: string;
  content: unknown;
  preview: string;
  
  // Diff against current
  targetId?: string; // ID of item being modified (if any)
  targetVersion?: number;
  changeType: 'create' | 'update' | 'delete' | 'suggest';
  diff?: ContentDiff;
  
  // Metadata
  tokensUsed: number;
  confidence: number; // 0-100
  warnings: string[];
  suggestions: string[];
  
  // Status
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'modified' | 'expired';
  stagedAt: string;
  expiresAt?: string; // Staged items can expire
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ContentDiff {
  type: 'text' | 'structured';
  additions: number;
  deletions: number;
  modifications: number;
  hunks?: DiffHunk[];
}

export interface DiffHunk {
  lineStart: number;
  lineEnd: number;
  type: 'add' | 'remove' | 'modify';
  oldContent?: string;
  newContent?: string;
}

export interface StagingArea {
  sphereId: SphereId;
  items: StagedItem[];
  lastUpdated: string;
}

export interface ApprovalOptions {
  acceptAll?: boolean;
  rejectAll?: boolean;
  selectedIds?: string[];
  modifications?: Record<string, unknown>; // User modifications to staged content
  mergeStrategy?: 'replace' | 'merge' | 'append';
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

interface StagingState {
  // Staging areas by sphere
  stagingAreas: Record<SphereId, StagingArea>;
  
  // Global counts
  totalPending: number;
  totalExpiring: number;
  
  // Actions
  stageItem: (item: Omit<StagedItem, 'id' | 'stagedAt' | 'status'>) => StagedItem;
  removeItem: (sphereId: SphereId, itemId: string) => void;
  clearSphere: (sphereId: SphereId) => void;
  clearAll: () => void;
  
  // Review Actions
  startReview: (sphereId: SphereId, itemId: string) => void;
  approveItem: (sphereId: SphereId, itemId: string, modifications?: unknown) => StagedItem;
  rejectItem: (sphereId: SphereId, itemId: string, reason?: string) => void;
  batchApprove: (sphereId: SphereId, options: ApprovalOptions) => StagedItem[];
  
  // Query
  getItemsBySphere: (sphereId: SphereId) => StagedItem[];
  getPendingCount: (sphereId?: SphereId) => number;
  getExpiringItems: () => StagedItem[];
  
  // Diff
  compareStagedWithCurrent: (sphereId: SphereId, itemId: string) => ContentDiff | null;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `staged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createEmptyStagingArea = (sphereId: SphereId): StagingArea => ({
  sphereId,
  items: [],
  lastUpdated: new Date().toISOString(),
});

const SPHERE_IDS: SphereId[] = [
  'personal', 'business', 'government', 'design_studio', 
  'community', 'social', 'entertainment', 'team'
];

// ═══════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════

export const useStagingStore = create<StagingState>()(
  persist(
    (set, get) => ({
      // Initialize empty staging areas for all spheres
      stagingAreas: SPHERE_IDS.reduce((acc, id) => {
        acc[id] = createEmptyStagingArea(id);
        return acc;
      }, {} as Record<SphereId, StagingArea>),
      
      totalPending: 0,
      totalExpiring: 0,

      // ─────────────────────────────────────────────────────────
      // Stage Item - ONLY WAY for agents to "write" data
      // ─────────────────────────────────────────────────────────
      stageItem: (item): StagedItem => {
        const staged: StagedItem = {
          ...item,
          id: generateId(),
          status: 'pending',
          stagedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
        };

        set((state) => {
          const area = state.stagingAreas[item.sphereId] || createEmptyStagingArea(item.sphereId);
          
          return {
            stagingAreas: {
              ...state.stagingAreas,
              [item.sphereId]: {
                ...area,
                items: [...area.items, staged],
                lastUpdated: new Date().toISOString(),
              },
            },
            totalPending: state.totalPending + 1,
          };
        });

        return staged;
      },

      removeItem: (sphereId, itemId) => {
        set((state) => {
          const area = state.stagingAreas[sphereId];
          if (!area) return state;

          const item = area.items.find((i) => i.id === itemId);
          const wasPending = item?.status === 'pending';

          return {
            stagingAreas: {
              ...state.stagingAreas,
              [sphereId]: {
                ...area,
                items: area.items.filter((i) => i.id !== itemId),
                lastUpdated: new Date().toISOString(),
              },
            },
            totalPending: wasPending ? state.totalPending - 1 : state.totalPending,
          };
        });
      },

      clearSphere: (sphereId) => {
        set((state) => {
          const area = state.stagingAreas[sphereId];
          const pendingCount = area?.items.filter((i) => i.status === 'pending').length || 0;

          return {
            stagingAreas: {
              ...state.stagingAreas,
              [sphereId]: createEmptyStagingArea(sphereId),
            },
            totalPending: state.totalPending - pendingCount,
          };
        });
      },

      clearAll: () => {
        set({
          stagingAreas: SPHERE_IDS.reduce((acc, id) => {
            acc[id] = createEmptyStagingArea(id);
            return acc;
          }, {} as Record<SphereId, StagingArea>),
          totalPending: 0,
          totalExpiring: 0,
        });
      },

      // ─────────────────────────────────────────────────────────
      // Review Actions - MANDATORY before data becomes permanent
      // ─────────────────────────────────────────────────────────
      startReview: (sphereId, itemId) => {
        set((state) => {
          const area = state.stagingAreas[sphereId];
          if (!area) return state;

          return {
            stagingAreas: {
              ...state.stagingAreas,
              [sphereId]: {
                ...area,
                items: area.items.map((i) =>
                  i.id === itemId ? { ...i, status: 'reviewing' as const } : i
                ),
              },
            },
          };
        });
      },

      approveItem: (sphereId, itemId, modifications?) => {
        const area = get().stagingAreas[sphereId];
        const item = area?.items.find((i) => i.id === itemId);
        if (!item) throw new Error('Staged item not found');

        const approved: StagedItem = {
          ...item,
          status: modifications ? 'modified' : 'approved',
          content: modifications ?? item.content,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'current_user', // Would be from auth
        };

        set((state) => ({
          stagingAreas: {
            ...state.stagingAreas,
            [sphereId]: {
              ...area,
              items: area.items.map((i) => (i.id === itemId ? approved : i)),
              lastUpdated: new Date().toISOString(),
            },
          },
          totalPending: state.totalPending - 1,
        }));

        return approved;
      },

      rejectItem: (sphereId, itemId, reason?) => {
        set((state) => {
          const area = state.stagingAreas[sphereId];
          if (!area) return state;

          return {
            stagingAreas: {
              ...state.stagingAreas,
              [sphereId]: {
                ...area,
                items: area.items.map((i) =>
                  i.id === itemId
                    ? {
                        ...i,
                        status: 'rejected' as const,
                        reviewedAt: new Date().toISOString(),
                        reviewedBy: 'current_user',
                        warnings: reason ? [...i.warnings, `Rejected: ${reason}`] : i.warnings,
                      }
                    : i
                ),
                lastUpdated: new Date().toISOString(),
              },
            },
            totalPending: state.totalPending - 1,
          };
        });
      },

      batchApprove: (sphereId, options) => {
        const area = get().stagingAreas[sphereId];
        if (!area) return [];

        const toApprove = options.selectedIds
          ? area.items.filter((i) => options.selectedIds!.includes(i.id) && i.status === 'pending')
          : options.acceptAll
          ? area.items.filter((i) => i.status === 'pending')
          : [];

        const approved: StagedItem[] = [];

        toApprove.forEach((item) => {
          const mod = options.modifications?.[item.id];
          approved.push(get().approveItem(sphereId, item.id, mod));
        });

        return approved;
      },

      // ─────────────────────────────────────────────────────────
      // Query
      // ─────────────────────────────────────────────────────────
      getItemsBySphere: (sphereId) => {
        return get().stagingAreas[sphereId]?.items || [];
      },

      getPendingCount: (sphereId?) => {
        if (sphereId) {
          return get().stagingAreas[sphereId]?.items.filter((i) => i.status === 'pending').length || 0;
        }
        return get().totalPending;
      },

      getExpiringItems: () => {
        const now = Date.now();
        const soonMs = 2 * 60 * 60 * 1000; // 2 hours
        
        const expiring: StagedItem[] = [];
        Object.values(get().stagingAreas).forEach((area) => {
          area.items.forEach((item) => {
            if (item.expiresAt && item.status === 'pending') {
              const expiresAt = new Date(item.expiresAt).getTime();
              if (expiresAt - now < soonMs) {
                expiring.push(item);
              }
            }
          });
        });
        
        return expiring.sort((a, b) => 
          new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime()
        );
      },

      // ─────────────────────────────────────────────────────────
      // Diff - Compare staged with current
      // ─────────────────────────────────────────────────────────
      compareStagedWithCurrent: (sphereId, itemId) => {
        const area = get().stagingAreas[sphereId];
        const item = area?.items.find((i) => i.id === itemId);
        
        if (!item || !item.diff) {
          return null;
        }
        
        return item.diff;
      },
    }),
    {
      name: 'chenu-staging-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useStagedItems = (sphereId: SphereId) => 
  useStagingStore((s) => s.stagingAreas[sphereId]?.items || []);

export const usePendingCount = () => 
  useStagingStore((s) => s.totalPending);

export const useExpiringItems = () => 
  useStagingStore((s) => s.getExpiringItems());

export default useStagingStore;
