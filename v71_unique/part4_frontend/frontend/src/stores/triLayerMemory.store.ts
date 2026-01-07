/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TRI-LAYER MEMORY STORE                          ║
 * ║                    L1 Hot · L2 Warm · L3 Cold                                ║
 * ║                    Canonical Implementation v1.1                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ARCHITECTURE MÉMOIRE TRI-COUCHE:
 * 
 * L1 - HOT (Mémoire Chaude):
 *   - Raisonnement actif
 *   - Volatile, 1 par agent
 *   - SEULE couche utilisée pour raisonner
 *
 * L2 - WARM (Mémoire Subjective):
 *   - Continuité & intention
 *   - Compressée, révisable
 *   - Ce que l'agent "croit"
 *
 * L3 - COLD (Mémoire Froide):
 *   - Archive immuable
 *   - Jamais en contexte LLM
 *   - Source de vérité
 *
 * PRINCIPE: "Le contexte n'est JAMAIS empilé, il est ADRESSABLE."
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES (Inline pour autonomie)
// ═══════════════════════════════════════════════════════════════════════════════

type MemoryLayer = 'hot' | 'warm' | 'cold';

interface HotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  token_count: number;
}

interface ReasoningState {
  current_task: string | null;
  pending_actions: string[];
  active_hypotheses: string[];
  confidence_level: number;
  last_checkpoint_id: string | null;
}

interface HotMemory {
  agent_id: string;
  conversation_id: string;
  messages: HotMessage[];
  current_objectives: string[];
  active_constraints: string[];
  reasoning_state: ReasoningState;
  token_count: number;
  created_at: string;
  last_activity: string;
  max_tokens: number;
  utilization: number;
}

interface SemanticSummary {
  id: string;
  source_conversation_id: string;
  content: string;
  key_points: string[];
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  relevance_score: number;
  created_at: string;
}

interface DecisionRecord {
  id: string;
  conversation_id: string;
  decision: string;
  intention: string;
  context_snapshot: string;
  outcome?: 'success' | 'failure' | 'pending';
  created_at: string;
}

interface Hypothesis {
  id: string;
  statement: string;
  confidence: number;
  supporting_evidence: string[];
  contradicting_evidence: string[];
  status: 'active' | 'confirmed' | 'rejected' | 'revised';
  created_at: string;
}

interface Preference {
  id: string;
  category: string;
  key: string;
  value: string | number | boolean;
  confidence: number;
  created_at: string;
}

interface ColdReference {
  entry_id: string;
  type: string;
  summary: string;
  relevance_score: number;
  access_url: string;
  expires_at: string;
}

interface LoadedContext {
  summaries: SemanticSummary[];
  decisions: DecisionRecord[];
  hypotheses: Hypothesis[];
  preferences: Preference[];
  cold_references: ColdReference[];
  total_tokens: number;
  load_time_ms: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE TYPE
// ═══════════════════════════════════════════════════════════════════════════════

interface TriLayerMemoryState {
  // L1 - Hot Memory (per agent, volatile)
  hotMemories: Record<string, HotMemory>;
  activeAgentId: string | null;
  
  // L2 - Warm Memory (subjective, persisted)
  summaries: SemanticSummary[];
  decisions: DecisionRecord[];
  hypotheses: Hypothesis[];
  preferences: Preference[];
  
  // L3 - Cold Memory (references only, never content)
  coldReferences: ColdReference[];
  
  // Loaded Context (for current reasoning)
  loadedContext: LoadedContext | null;
  
  // Metrics
  hotUtilization: number;
  warmEntryCount: number;
  coldAccessCount: number;
  lastArchiveTime: string | null;
  
  // Status
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface TriLayerMemoryActions {
  // === INITIALIZATION ===
  initialize: (agentId: string, ownerId: string) => Promise<void>;
  
  // === L1 HOT ACTIONS ===
  initHot: (agentId: string, conversationId: string, maxTokens?: number) => void;
  addHotMessage: (agentId: string, message: Omit<HotMessage, 'id' | 'timestamp'>) => void;
  updateReasoning: (agentId: string, update: Partial<ReasoningState>) => void;
  setObjectives: (agentId: string, objectives: string[]) => void;
  setConstraints: (agentId: string, constraints: string[]) => void;
  clearHot: (agentId: string) => void;
  setActiveAgent: (agentId: string | null) => void;
  
  // === L2 WARM ACTIONS ===
  addSummary: (summary: Omit<SemanticSummary, 'id' | 'created_at'>) => void;
  addDecision: (decision: Omit<DecisionRecord, 'id' | 'created_at'>) => void;
  addHypothesis: (hypothesis: Omit<Hypothesis, 'id' | 'created_at'>) => void;
  updateHypothesis: (id: string, update: Partial<Hypothesis>) => void;
  addPreference: (preference: Omit<Preference, 'id' | 'created_at'>) => void;
  searchWarm: (query: string) => { summaries: SemanticSummary[]; decisions: DecisionRecord[] };
  compressWarm: () => void;
  
  // === L3 COLD ACTIONS ===
  addColdReference: (reference: ColdReference) => void;
  requestColdAccess: (entryId: string, reason: string) => Promise<ColdReference | null>;
  clearColdReferences: () => void;
  
  // === CONTEXT LOADING ===
  loadContext: (query?: string, maxSummaries?: number) => void;
  clearContext: () => void;
  
  // === ARCHIVING ===
  archiveHot: (agentId: string) => Promise<void>;
  
  // === FLUX COGNITIF ===
  /**
   * Flux standard:
   * Cold → [résumé] → Warm → [sélection] → Hot → Raisonnement
   */
  executeFlux: (agentId: string, query: string) => Promise<LoadedContext>;
  
  // === UTILITIES ===
  getHotUtilization: (agentId: string) => number;
  getActiveHot: () => HotMemory | null;
  reset: () => void;
}

type TriLayerMemoryStore = TriLayerMemoryState & TriLayerMemoryActions;

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState: TriLayerMemoryState = {
  hotMemories: {},
  activeAgentId: null,
  summaries: [],
  decisions: [],
  hypotheses: [],
  preferences: [],
  coldReferences: [],
  loadedContext: null,
  hotUtilization: 0,
  warmEntryCount: 0,
  coldAccessCount: 0,
  lastArchiveTime: null,
  isInitialized: false,
  isLoading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useTriLayerMemory = create<TriLayerMemoryStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZATION
        // ═══════════════════════════════════════════════════════════════════════

        initialize: async (agentId: string, ownerId: string) => {
          set((state) => { state.isLoading = true; });
          
          try {
            // Initialize hot memory for agent
            get().initHot(agentId, crypto.randomUUID());
            get().setActiveAgent(agentId);
            
            // Load existing warm memory from backend (if any)
            // TODO: API call to load warm memory
            
            set((state) => {
              state.isInitialized = true;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Init failed';
              state.isLoading = false;
            });
          }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // L1 HOT MEMORY
        // ═══════════════════════════════════════════════════════════════════════

        initHot: (agentId: string, conversationId: string, maxTokens = 8000) => {
          set((state) => {
            state.hotMemories[agentId] = {
              agent_id: agentId,
              conversation_id: conversationId,
              messages: [],
              current_objectives: [],
              active_constraints: [],
              reasoning_state: {
                current_task: null,
                pending_actions: [],
                active_hypotheses: [],
                confidence_level: 1.0,
                last_checkpoint_id: null,
              },
              token_count: 0,
              created_at: new Date().toISOString(),
              last_activity: new Date().toISOString(),
              max_tokens: maxTokens,
              utilization: 0,
            };
          });
        },

        addHotMessage: (agentId: string, message) => {
          set((state) => {
            const hot = state.hotMemories[agentId];
            if (!hot) return;
            
            const newMessage: HotMessage = {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            };
            
            // Check token limit
            const newTokenCount = hot.token_count + message.token_count;
            
            if (newTokenCount > hot.max_tokens) {
              // Auto-archive when limit reached
              console.warn(`[TriLayerMemory] Hot memory full for ${agentId}, archiving...`);
              // Trigger archive (async, don't block)
              get().archiveHot(agentId);
              return;
            }
            
            hot.messages.push(newMessage);
            hot.token_count = newTokenCount;
            hot.last_activity = new Date().toISOString();
            hot.utilization = newTokenCount / hot.max_tokens;
            
            // Update global metric
            if (state.activeAgentId === agentId) {
              state.hotUtilization = hot.utilization;
            }
          });
        },

        updateReasoning: (agentId: string, update) => {
          set((state) => {
            const hot = state.hotMemories[agentId];
            if (!hot) return;
            
            Object.assign(hot.reasoning_state, update);
            hot.last_activity = new Date().toISOString();
          });
        },

        setObjectives: (agentId: string, objectives) => {
          set((state) => {
            const hot = state.hotMemories[agentId];
            if (hot) hot.current_objectives = objectives;
          });
        },

        setConstraints: (agentId: string, constraints) => {
          set((state) => {
            const hot = state.hotMemories[agentId];
            if (hot) hot.active_constraints = constraints;
          });
        },

        clearHot: (agentId: string) => {
          set((state) => {
            delete state.hotMemories[agentId];
            if (state.activeAgentId === agentId) {
              state.activeAgentId = null;
              state.hotUtilization = 0;
            }
          });
        },

        setActiveAgent: (agentId: string | null) => {
          set((state) => {
            state.activeAgentId = agentId;
            if (agentId && state.hotMemories[agentId]) {
              state.hotUtilization = state.hotMemories[agentId].utilization;
            }
          });
        },

        // ═══════════════════════════════════════════════════════════════════════
        // L2 WARM MEMORY
        // ═══════════════════════════════════════════════════════════════════════

        addSummary: (summary) => {
          set((state) => {
            state.summaries.push({
              ...summary,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            });
            state.warmEntryCount = state.summaries.length + state.decisions.length;
          });
        },

        addDecision: (decision) => {
          set((state) => {
            state.decisions.push({
              ...decision,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            });
            state.warmEntryCount = state.summaries.length + state.decisions.length;
          });
        },

        addHypothesis: (hypothesis) => {
          set((state) => {
            state.hypotheses.push({
              ...hypothesis,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            });
          });
        },

        updateHypothesis: (id: string, update) => {
          set((state) => {
            const hyp = state.hypotheses.find(h => h.id === id);
            if (hyp) Object.assign(hyp, update);
          });
        },

        addPreference: (preference) => {
          set((state) => {
            // Update existing or add new
            const existing = state.preferences.find(
              p => p.category === preference.category && p.key === preference.key
            );
            
            if (existing) {
              Object.assign(existing, preference);
            } else {
              state.preferences.push({
                ...preference,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
              });
            }
          });
        },

        searchWarm: (query: string) => {
          const state = get();
          const queryLower = query.toLowerCase();
          
          const summaries = state.summaries.filter(s =>
            s.content.toLowerCase().includes(queryLower) ||
            s.key_points.some(kp => kp.toLowerCase().includes(queryLower))
          );
          
          const decisions = state.decisions.filter(d =>
            d.decision.toLowerCase().includes(queryLower) ||
            d.intention.toLowerCase().includes(queryLower)
          );
          
          return { summaries, decisions };
        },

        compressWarm: () => {
          set((state) => {
            // Keep only top 50% by relevance
            if (state.summaries.length > 100) {
              state.summaries.sort((a, b) => b.relevance_score - a.relevance_score);
              state.summaries = state.summaries.slice(0, 50);
            }
            
            // Keep only recent 100 decisions
            if (state.decisions.length > 100) {
              state.decisions.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              state.decisions = state.decisions.slice(0, 100);
            }
            
            state.warmEntryCount = state.summaries.length + state.decisions.length;
          });
        },

        // ═══════════════════════════════════════════════════════════════════════
        // L3 COLD MEMORY
        // ═══════════════════════════════════════════════════════════════════════

        addColdReference: (reference) => {
          set((state) => {
            state.coldReferences.push(reference);
          });
        },

        requestColdAccess: async (entryId: string, reason: string) => {
          // TODO: API call to backend
          set((state) => { state.coldAccessCount += 1; });
          
          // Return mock reference for now
          return {
            entry_id: entryId,
            type: 'conversation_full',
            summary: `Archive entry ${entryId}`,
            relevance_score: 1.0,
            access_url: `/cold-storage/${entryId}`,
            expires_at: new Date(Date.now() + 3600000).toISOString(),
          };
        },

        clearColdReferences: () => {
          set((state) => { state.coldReferences = []; });
        },

        // ═══════════════════════════════════════════════════════════════════════
        // CONTEXT LOADING
        // ═══════════════════════════════════════════════════════════════════════

        loadContext: (query?: string, maxSummaries = 5) => {
          const state = get();
          const startTime = Date.now();
          
          let summaries: SemanticSummary[];
          let decisions: DecisionRecord[];
          
          if (query) {
            const result = state.searchWarm(query);
            summaries = result.summaries.slice(0, maxSummaries);
            decisions = result.decisions.slice(0, 3);
          } else {
            summaries = [...state.summaries]
              .sort((a, b) => b.relevance_score - a.relevance_score)
              .slice(0, maxSummaries);
            decisions = [...state.decisions]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 3);
          }
          
          const hypotheses = state.hypotheses.filter(h => h.status === 'active');
          const preferences = state.preferences;
          
          set((s) => {
            s.loadedContext = {
              summaries,
              decisions,
              hypotheses,
              preferences,
              cold_references: s.coldReferences,
              total_tokens: summaries.reduce((acc, s) => acc + s.content.length / 4, 0),
              load_time_ms: Date.now() - startTime,
            };
          });
        },

        clearContext: () => {
          set((state) => { state.loadedContext = null; });
        },

        // ═══════════════════════════════════════════════════════════════════════
        // ARCHIVING
        // ═══════════════════════════════════════════════════════════════════════

        archiveHot: async (agentId: string) => {
          const hot = get().hotMemories[agentId];
          if (!hot) return;
          
          // Generate summary from hot memory
          const content = hot.messages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role}: ${m.content.substring(0, 200)}`)
            .join('\n');
          
          // Add to warm memory
          get().addSummary({
            source_conversation_id: hot.conversation_id,
            content: `Conversation summary (${hot.messages.length} messages)`,
            key_points: hot.current_objectives,
            entities: [],
            sentiment: 'neutral',
            relevance_score: 0.8,
          });
          
          // Add cold reference
          get().addColdReference({
            entry_id: crypto.randomUUID(),
            type: 'conversation_full',
            summary: `Archived conversation ${hot.conversation_id}`,
            relevance_score: 1.0,
            access_url: `/cold-storage/conversations/${hot.conversation_id}`,
            expires_at: new Date(Date.now() + 86400000 * 365).toISOString(),
          });
          
          // Reset hot with system message
          set((state) => {
            const newHot = state.hotMemories[agentId];
            if (newHot) {
              newHot.messages = [{
                id: crypto.randomUUID(),
                role: 'system',
                content: '[Contexte précédent archivé. Résumé disponible dans la mémoire subjective.]',
                timestamp: new Date().toISOString(),
                token_count: 20,
              }];
              newHot.token_count = 20;
              newHot.utilization = 20 / newHot.max_tokens;
            }
            state.lastArchiveTime = new Date().toISOString();
          });
        },

        // ═══════════════════════════════════════════════════════════════════════
        // FLUX COGNITIF
        // ═══════════════════════════════════════════════════════════════════════

        executeFlux: async (agentId: string, query: string) => {
          /**
           * FLUX STANDARD:
           * 
           * Mémoire Froide (Archive)
           *         ↓ (résumé)
           * Mémoire Subjective (Warm)
           *         ↓ (sélection)
           * Mémoire Chaude (Hot)
           *         ↓
           * Raisonnement / Action
           */
          
          // 1. Load relevant context from warm + cold references
          get().loadContext(query);
          
          const context = get().loadedContext;
          if (!context) {
            throw new Error('Failed to load context');
          }
          
          // 2. Inject into hot memory as system context
          if (context.summaries.length > 0) {
            get().addHotMessage(agentId, {
              role: 'system',
              content: `[CONTEXTE CHARGÉ]\n${context.summaries.map(s => 
                `• ${s.content}\n  Points clés: ${s.key_points.join(', ')}`
              ).join('\n')}`,
              token_count: context.total_tokens,
            });
          }
          
          return context;
        },

        // ═══════════════════════════════════════════════════════════════════════
        // UTILITIES
        // ═══════════════════════════════════════════════════════════════════════

        getHotUtilization: (agentId: string) => {
          return get().hotMemories[agentId]?.utilization ?? 0;
        },

        getActiveHot: () => {
          const { activeAgentId, hotMemories } = get();
          return activeAgentId ? hotMemories[activeAgentId] : null;
        },

        reset: () => {
          set(initialState);
        },
      }))
    ),
    { name: 'TriLayerMemory' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const selectActiveHotMemory = () => useTriLayerMemory.getState().getActiveHot();
export const selectHotUtilization = () => useTriLayerMemory.getState().hotUtilization;
export const selectLoadedContext = () => useTriLayerMemory.getState().loadedContext;
export const selectWarmEntryCount = () => useTriLayerMemory.getState().warmEntryCount;

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION FOR AUTO-ARCHIVE
// ═══════════════════════════════════════════════════════════════════════════════

// Auto-archive when utilization > 90%
useTriLayerMemory.subscribe(
  (state) => state.hotUtilization,
  (utilization) => {
    if (utilization > 0.9) {
      const agentId = useTriLayerMemory.getState().activeAgentId;
      if (agentId) {
        console.warn(`[TriLayerMemory] Auto-archiving at ${(utilization * 100).toFixed(1)}%`);
        useTriLayerMemory.getState().archiveHot(agentId);
      }
    }
  }
);

export default useTriLayerMemory;
