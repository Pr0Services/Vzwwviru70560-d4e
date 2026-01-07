/**
 * CHE·NU™ - CORE LOOP SYSTEM
 * 
 * CANONICAL LOOP (NON-NEGOTIABLE):
 * THINK → WORK → ASSIST → STAGING → REVIEW → VERSION
 * 
 * Hard laws:
 * - Agents NEVER write directly to user data
 * - All agent output goes to STAGING
 * - REVIEW is mandatory before VERSION
 * - Versions are immutable
 * - Human authority is always final
 */

import { create } from 'zustand';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// CORE LOOP PHASES (FROZEN - NON-NEGOTIABLE)
// ═══════════════════════════════════════════════════════════════

export type CoreLoopPhase = 
  | 'THINK'    // Phase 1: User captures intent, defines what they want
  | 'WORK'     // Phase 2: Agent processes in ISOLATED SANDBOX
  | 'ASSIST'   // Phase 3: AI suggestions generated, shown to user
  | 'STAGING'  // Phase 4: Output placed in staging area (NOT user data)
  | 'REVIEW'   // Phase 5: User reviews staged content (MANDATORY)
  | 'VERSION'; // Phase 6: User approves → immutable version created

export const CORE_LOOP_PHASES: CoreLoopPhase[] = [
  'THINK',
  'WORK', 
  'ASSIST',
  'STAGING',
  'REVIEW',
  'VERSION',
];

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Intent {
  id: string;
  userId: string;
  sphereId: SphereId;
  description: string;
  context?: Record<string, unknown>;
  createdAt: string;
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled';
}

export interface WorkSession {
  id: string;
  intentId: string;
  agentId: string;
  sandboxId: string; // ISOLATED - agents work in sandbox ONLY
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
  output?: StagedContent;
}

export interface StagedContent {
  id: string;
  workSessionId: string;
  type: 'text' | 'data' | 'file' | 'code' | 'mixed';
  content: unknown;
  preview: string;
  metadata: {
    agentId: string;
    tokensUsed: number;
    confidence: number;
    warnings: string[];
  };
  stagedAt: string;
}

export interface ReviewDecision {
  id: string;
  stagedContentId: string;
  userId: string;
  decision: 'accept' | 'reject' | 'modify' | 'defer';
  modifications?: unknown;
  rationale?: string;
  reviewedAt: string;
}

export interface Version {
  id: string;
  reviewDecisionId: string;
  sphereId: SphereId;
  parentVersionId?: string;
  content: unknown;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  isImmutable: true; // ALWAYS TRUE - versions are immutable
  checksum: string;
}

export interface CoreLoopState {
  // Current state
  currentPhase: CoreLoopPhase;
  currentIntent: Intent | null;
  currentWorkSession: WorkSession | null;
  stagedContent: StagedContent[];
  pendingReviews: StagedContent[];
  
  // History
  intents: Record<string, Intent>;
  workSessions: Record<string, WorkSession>;
  reviews: Record<string, ReviewDecision>;
  versions: Record<string, Version>;
  
  // Phase Actions
  startThink: (sphereId: SphereId, description: string) => Intent;
  submitIntent: (intentId: string) => boolean;
  
  startWork: (intentId: string, agentId: string) => WorkSession;
  completeWork: (sessionId: string, content: Omit<StagedContent, 'id' | 'stagedAt'>) => void;
  
  stageContent: (content: StagedContent) => void;
  
  submitReview: (decision: Omit<ReviewDecision, 'id' | 'reviewedAt'>) => ReviewDecision;
  
  createVersion: (reviewId: string) => Version | null;
  
  // Navigation
  goToPhase: (phase: CoreLoopPhase) => void;
  canAdvance: () => boolean;
  getNextPhase: () => CoreLoopPhase | null;
  getPreviousPhase: () => CoreLoopPhase | null;
  
  // Validation
  validatePhaseTransition: (from: CoreLoopPhase, to: CoreLoopPhase) => boolean;
  getPhaseStatus: (phase: CoreLoopPhase) => 'pending' | 'active' | 'completed' | 'blocked';
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = (prefix: string) => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateChecksum = (content: unknown): string => {
  const str = JSON.stringify(content);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `chk_${Math.abs(hash).toString(16)}`;
};

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useCoreLoopStore = create<CoreLoopState>((set, get) => ({
  // Initial state
  currentPhase: 'THINK',
  currentIntent: null,
  currentWorkSession: null,
  stagedContent: [],
  pendingReviews: [],
  intents: {},
  workSessions: {},
  reviews: {},
  versions: {},

  // ─────────────────────────────────────────────────────────────
  // PHASE 1: THINK - User captures intent
  // ─────────────────────────────────────────────────────────────
  startThink: (sphereId: SphereId, description: string): Intent => {
    const intent: Intent = {
      id: generateId('intent'),
      userId: 'current_user', // Would be from auth
      sphereId,
      description,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    set((state) => ({
      currentIntent: intent,
      currentPhase: 'THINK',
      intents: { ...state.intents, [intent.id]: intent },
    }));

    return intent;
  },

  submitIntent: (intentId: string): boolean => {
    const intent = get().intents[intentId];
    if (!intent || intent.status !== 'draft') return false;

    set((state) => ({
      intents: {
        ...state.intents,
        [intentId]: { ...intent, status: 'submitted' },
      },
      currentPhase: 'WORK',
    }));

    return true;
  },

  // ─────────────────────────────────────────────────────────────
  // PHASE 2: WORK - Agent processes in ISOLATED SANDBOX
  // ─────────────────────────────────────────────────────────────
  startWork: (intentId: string, agentId: string): WorkSession => {
    const session: WorkSession = {
      id: generateId('work'),
      intentId,
      agentId,
      sandboxId: generateId('sandbox'), // ISOLATED SANDBOX
      startedAt: new Date().toISOString(),
      status: 'running',
    };

    set((state) => ({
      currentWorkSession: session,
      workSessions: { ...state.workSessions, [session.id]: session },
      intents: {
        ...state.intents,
        [intentId]: { ...state.intents[intentId], status: 'processing' },
      },
    }));

    return session;
  },

  completeWork: (sessionId: string, content: Omit<StagedContent, 'id' | 'stagedAt'>): void => {
    const staged: StagedContent = {
      ...content,
      id: generateId('staged'),
      stagedAt: new Date().toISOString(),
    };

    set((state) => {
      const session = state.workSessions[sessionId];
      if (!session) return state;

      return {
        workSessions: {
          ...state.workSessions,
          [sessionId]: {
            ...session,
            status: 'completed',
            completedAt: new Date().toISOString(),
            output: staged,
          },
        },
        currentPhase: 'ASSIST',
      };
    });
  },

  // ─────────────────────────────────────────────────────────────
  // PHASE 3 & 4: ASSIST & STAGING - Output to staging (NOT user data)
  // ─────────────────────────────────────────────────────────────
  stageContent: (content: StagedContent): void => {
    set((state) => ({
      stagedContent: [...state.stagedContent, content],
      pendingReviews: [...state.pendingReviews, content],
      currentPhase: 'STAGING',
    }));
  },

  // ─────────────────────────────────────────────────────────────
  // PHASE 5: REVIEW - User reviews (MANDATORY)
  // ─────────────────────────────────────────────────────────────
  submitReview: (decision: Omit<ReviewDecision, 'id' | 'reviewedAt'>): ReviewDecision => {
    const review: ReviewDecision = {
      ...decision,
      id: generateId('review'),
      reviewedAt: new Date().toISOString(),
    };

    set((state) => ({
      reviews: { ...state.reviews, [review.id]: review },
      pendingReviews: state.pendingReviews.filter((s) => s.id !== decision.stagedContentId),
      currentPhase: decision.decision === 'accept' ? 'VERSION' : 'REVIEW',
    }));

    return review;
  },

  // ─────────────────────────────────────────────────────────────
  // PHASE 6: VERSION - Create immutable version
  // ─────────────────────────────────────────────────────────────
  createVersion: (reviewId: string): Version | null => {
    const review = get().reviews[reviewId];
    if (!review || review.decision !== 'accept') return null;

    const staged = get().stagedContent.find((s) => s.id === review.stagedContentId);
    if (!staged) return null;

    const workSession = get().workSessions[staged.workSessionId];
    if (!workSession) return null;

    const intent = get().intents[workSession.intentId];
    if (!intent) return null;

    // Get latest version number for this sphere
    const sphereVersions = Object.values(get().versions)
      .filter((v) => v.sphereId === intent.sphereId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
    
    const nextVersionNumber = (sphereVersions[0]?.versionNumber ?? 0) + 1;

    const version: Version = {
      id: generateId('version'),
      reviewDecisionId: reviewId,
      sphereId: intent.sphereId,
      parentVersionId: sphereVersions[0]?.id,
      content: review.modifications ?? staged.content,
      versionNumber: nextVersionNumber,
      createdAt: new Date().toISOString(),
      createdBy: review.userId,
      isImmutable: true, // ALWAYS TRUE
      checksum: generateChecksum(review.modifications ?? staged.content),
    };

    set((state) => ({
      versions: { ...state.versions, [version.id]: version },
      intents: {
        ...state.intents,
        [intent.id]: { ...intent, status: 'completed' },
      },
      stagedContent: state.stagedContent.filter((s) => s.id !== review.stagedContentId),
      currentPhase: 'THINK', // Loop back to start
      currentIntent: null,
      currentWorkSession: null,
    }));

    return version;
  },

  // ─────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────
  goToPhase: (phase: CoreLoopPhase): void => {
    const current = get().currentPhase;
    if (get().validatePhaseTransition(current, phase)) {
      set({ currentPhase: phase });
    }
  },

  canAdvance: (): boolean => {
    const { currentPhase, currentIntent, currentWorkSession, pendingReviews } = get();
    
    switch (currentPhase) {
      case 'THINK':
        return currentIntent !== null && currentIntent.status === 'submitted';
      case 'WORK':
        return currentWorkSession !== null && currentWorkSession.status === 'completed';
      case 'ASSIST':
      case 'STAGING':
        return pendingReviews.length > 0;
      case 'REVIEW':
        // Must complete all reviews
        return pendingReviews.length === 0;
      case 'VERSION':
        return true;
      default:
        return false;
    }
  },

  getNextPhase: (): CoreLoopPhase | null => {
    const idx = CORE_LOOP_PHASES.indexOf(get().currentPhase);
    if (idx < CORE_LOOP_PHASES.length - 1) {
      return CORE_LOOP_PHASES[idx + 1];
    }
    return 'THINK'; // Loop back
  },

  getPreviousPhase: (): CoreLoopPhase | null => {
    const idx = CORE_LOOP_PHASES.indexOf(get().currentPhase);
    if (idx > 0) {
      return CORE_LOOP_PHASES[idx - 1];
    }
    return null;
  },

  // ─────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────
  validatePhaseTransition: (from: CoreLoopPhase, to: CoreLoopPhase): boolean => {
    const fromIdx = CORE_LOOP_PHASES.indexOf(from);
    const toIdx = CORE_LOOP_PHASES.indexOf(to);
    
    // Can only go forward one step at a time (unless completing loop)
    if (to === 'THINK' && from === 'VERSION') return true;
    if (toIdx !== fromIdx + 1) return false;
    
    // REVIEW is MANDATORY before VERSION
    if (to === 'VERSION' && from !== 'REVIEW') return false;
    
    return get().canAdvance();
  },

  getPhaseStatus: (phase: CoreLoopPhase): 'pending' | 'active' | 'completed' | 'blocked' => {
    const { currentPhase } = get();
    const currentIdx = CORE_LOOP_PHASES.indexOf(currentPhase);
    const phaseIdx = CORE_LOOP_PHASES.indexOf(phase);
    
    if (phaseIdx < currentIdx) return 'completed';
    if (phaseIdx === currentIdx) return 'active';
    if (!get().canAdvance() && phaseIdx === currentIdx + 1) return 'blocked';
    return 'pending';
  },
}));

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useCurrentPhase = () => useCoreLoopStore((s) => s.currentPhase);
export const useCurrentIntent = () => useCoreLoopStore((s) => s.currentIntent);
export const usePendingReviews = () => useCoreLoopStore((s) => s.pendingReviews);
export const useVersions = () => useCoreLoopStore((s) => Object.values(s.versions));

export default useCoreLoopStore;
