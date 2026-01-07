/**
 * CHE·NU™ - THREAD STORE
 * Threads (.chenu) are FIRST-CLASS OBJECTS
 * 
 * A thread:
 * - represents a persistent line of thought
 * - has an owner and scope
 * - has a token budget
 * - has encoding rules
 * - records decisions and history
 * - is auditable
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Thread {
  id: string;
  title: string;
  description?: string;
  
  // Ownership & Scope
  ownerId: string;
  sphereId: SphereId;
  visibility: 'private' | 'shared' | 'public';
  collaborators: string[];
  
  // Token Budget
  tokenBudget: number;
  tokensUsed: number;
  tokenAllocationRules: TokenAllocationRule[];
  
  // Encoding
  encodingMode: EncodingMode;
  encodingQualityScore: number;
  
  // Content
  messages: ThreadMessage[];
  decisions: ThreadDecision[];
  artifacts: ThreadArtifact[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  status: ThreadStatus;
  tags: string[];
  
  // Audit Trail
  auditLog: AuditEntry[];
}

export type ThreadStatus = 'active' | 'paused' | 'completed' | 'archived';

export type EncodingMode = 'standard' | 'compressed' | 'minimal' | 'verbose';

export interface TokenAllocationRule {
  agentType: string;
  maxTokens: number;
  priority: number;
}

export interface ThreadMessage {
  id: string;
  role: 'user' | 'nova' | 'agent' | 'system';
  content: string;
  encodedContent?: string;
  tokensUsed: number;
  timestamp: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}

export interface ThreadDecision {
  id: string;
  title: string;
  description: string;
  options: string[];
  selectedOption: number;
  rationale: string;
  decidedAt: string;
  decidedBy: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ThreadArtifact {
  id: string;
  type: 'document' | 'code' | 'image' | 'data' | 'link';
  name: string;
  url?: string;
  content?: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actorId: string;
  timestamp: string;
  details: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface ThreadState {
  // State
  threads: Record<string, Thread>;
  activeThreadId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Thread CRUD
  createThread: (data: CreateThreadData) => Thread;
  getThread: (id: string) => Thread | undefined;
  updateThread: (id: string, data: Partial<Thread>) => void;
  deleteThread: (id: string) => void;
  archiveThread: (id: string) => void;
  
  // Thread Navigation
  setActiveThread: (id: string | null) => void;
  getActiveThread: () => Thread | undefined;
  
  // Thread Filtering
  getThreadsBySphere: (sphereId: SphereId) => Thread[];
  getThreadsByStatus: (status: ThreadStatus) => Thread[];
  getThreadsByTag: (tag: string) => Thread[];
  searchThreads: (query: string) => Thread[];
  
  // Message Operations
  addMessage: (threadId: string, message: Omit<ThreadMessage, 'id' | 'timestamp'>) => void;
  
  // Decision Operations
  addDecision: (threadId: string, decision: Omit<ThreadDecision, 'id' | 'decidedAt'>) => void;
  
  // Token Operations
  allocateTokens: (threadId: string, amount: number) => boolean;
  consumeTokens: (threadId: string, amount: number) => boolean;
  getTokenUsage: (threadId: string) => { used: number; budget: number; remaining: number };
  
  // Audit
  logAuditEntry: (threadId: string, action: string, details: Record<string, unknown>) => void;
}

interface CreateThreadData {
  title: string;
  description?: string;
  sphereId: SphereId;
  ownerId: string;
  tokenBudget?: number;
  encodingMode?: EncodingMode;
  tags?: string[];
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createEmptyThread = (data: CreateThreadData): Thread => ({
  id: generateId(),
  title: data.title,
  description: data.description,
  ownerId: data.ownerId,
  sphereId: data.sphereId,
  visibility: 'private',
  collaborators: [],
  tokenBudget: data.tokenBudget ?? 5000,
  tokensUsed: 0,
  tokenAllocationRules: [
    { agentType: 'nova', maxTokens: 2000, priority: 1 },
    { agentType: 'orchestrator', maxTokens: 1500, priority: 2 },
    { agentType: 'specialist', maxTokens: 1000, priority: 3 },
  ],
  encodingMode: data.encodingMode ?? 'standard',
  encodingQualityScore: 100,
  messages: [],
  decisions: [],
  artifacts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastAccessedAt: new Date().toISOString(),
  status: 'active',
  tags: data.tags ?? [],
  auditLog: [],
});

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useThreadStore = create<ThreadState>()(
  persist(
    (set, get) => ({
      // Initial State
      threads: {},
      activeThreadId: null,
      isLoading: false,
      error: null,

      // ─────────────────────────────────────────────────────────
      // Thread CRUD
      // ─────────────────────────────────────────────────────────
      createThread: (data: CreateThreadData): Thread => {
        const thread = createEmptyThread(data);
        set((state) => ({
          threads: { ...state.threads, [thread.id]: thread },
        }));
        get().logAuditEntry(thread.id, 'THREAD_CREATED', { title: data.title });
        return thread;
      },

      getThread: (id: string): Thread | undefined => {
        return get().threads[id];
      },

      updateThread: (id: string, data: Partial<Thread>): void => {
        set((state) => {
          const thread = state.threads[id];
          if (!thread) return state;
          
          return {
            threads: {
              ...state.threads,
              [id]: {
                ...thread,
                ...data,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
        get().logAuditEntry(id, 'THREAD_UPDATED', { changes: Object.keys(data) });
      },

      deleteThread: (id: string): void => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.threads;
          return {
            threads: remaining,
            activeThreadId: state.activeThreadId === id ? null : state.activeThreadId,
          };
        });
      },

      archiveThread: (id: string): void => {
        get().updateThread(id, { status: 'archived' });
        get().logAuditEntry(id, 'THREAD_ARCHIVED', {});
      },

      // ─────────────────────────────────────────────────────────
      // Thread Navigation
      // ─────────────────────────────────────────────────────────
      setActiveThread: (id: string | null): void => {
        if (id) {
          get().updateThread(id, { lastAccessedAt: new Date().toISOString() });
        }
        set({ activeThreadId: id });
      },

      getActiveThread: (): Thread | undefined => {
        const { activeThreadId, threads } = get();
        return activeThreadId ? threads[activeThreadId] : undefined;
      },

      // ─────────────────────────────────────────────────────────
      // Thread Filtering
      // ─────────────────────────────────────────────────────────
      getThreadsBySphere: (sphereId: SphereId): Thread[] => {
        return Object.values(get().threads).filter((t) => t.sphereId === sphereId);
      },

      getThreadsByStatus: (status: ThreadStatus): Thread[] => {
        return Object.values(get().threads).filter((t) => t.status === status);
      },

      getThreadsByTag: (tag: string): Thread[] => {
        return Object.values(get().threads).filter((t) => t.tags.includes(tag));
      },

      searchThreads: (query: string): Thread[] => {
        const q = query.toLowerCase();
        return Object.values(get().threads).filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      },

      // ─────────────────────────────────────────────────────────
      // Message Operations
      // ─────────────────────────────────────────────────────────
      addMessage: (threadId: string, message: Omit<ThreadMessage, 'id' | 'timestamp'>): void => {
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;

          const newMessage: ThreadMessage = {
            ...message,
            id: `msg_${Date.now()}`,
            timestamp: new Date().toISOString(),
          };

          return {
            threads: {
              ...state.threads,
              [threadId]: {
                ...thread,
                messages: [...thread.messages, newMessage],
                tokensUsed: thread.tokensUsed + message.tokensUsed,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Decision Operations
      // ─────────────────────────────────────────────────────────
      addDecision: (threadId: string, decision: Omit<ThreadDecision, 'id' | 'decidedAt'>): void => {
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;

          const newDecision: ThreadDecision = {
            ...decision,
            id: `dec_${Date.now()}`,
            decidedAt: new Date().toISOString(),
          };

          return {
            threads: {
              ...state.threads,
              [threadId]: {
                ...thread,
                decisions: [...thread.decisions, newDecision],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
        
        get().logAuditEntry(threadId, 'DECISION_RECORDED', { 
          title: decision.title,
          selectedOption: decision.selectedOption 
        });
      },

      // ─────────────────────────────────────────────────────────
      // Token Operations
      // ─────────────────────────────────────────────────────────
      allocateTokens: (threadId: string, amount: number): boolean => {
        const thread = get().threads[threadId];
        if (!thread) return false;
        
        get().updateThread(threadId, { tokenBudget: thread.tokenBudget + amount });
        get().logAuditEntry(threadId, 'TOKENS_ALLOCATED', { amount });
        return true;
      },

      consumeTokens: (threadId: string, amount: number): boolean => {
        const thread = get().threads[threadId];
        if (!thread) return false;
        
        const remaining = thread.tokenBudget - thread.tokensUsed;
        if (amount > remaining) return false;
        
        get().updateThread(threadId, { tokensUsed: thread.tokensUsed + amount });
        return true;
      },

      getTokenUsage: (threadId: string) => {
        const thread = get().threads[threadId];
        if (!thread) return { used: 0, budget: 0, remaining: 0 };
        
        return {
          used: thread.tokensUsed,
          budget: thread.tokenBudget,
          remaining: thread.tokenBudget - thread.tokensUsed,
        };
      },

      // ─────────────────────────────────────────────────────────
      // Audit
      // ─────────────────────────────────────────────────────────
      logAuditEntry: (threadId: string, action: string, details: Record<string, unknown>): void => {
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;

          const entry: AuditEntry = {
            id: `audit_${Date.now()}`,
            action,
            actorId: 'current_user', // Would be real user ID
            timestamp: new Date().toISOString(),
            details,
          };

          return {
            threads: {
              ...state.threads,
              [threadId]: {
                ...thread,
                auditLog: [...thread.auditLog, entry],
              },
            },
          };
        });
      },
    }),
    {
      name: 'chenu-threads-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useActiveThread = () => useThreadStore((state) => state.getActiveThread());
export const useThreads = () => useThreadStore((state) => Object.values(state.threads));
export const useThreadById = (id: string) => useThreadStore((state) => state.threads[id]);

export default useThreadStore;
