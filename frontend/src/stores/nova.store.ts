/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ — NOVA STORE (Zustand)                                  ║
 * ║                                                                              ║
 * ║              Nova System Intelligence state management                       ║
 * ║              GOVERNANCE CONSTITUTION v1.0 COMPLIANT                          ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * CONSTITUTION COMPLIANCE:
 * - LAW #1: No budget/token info in state
 * - LAW #2: Analysis never interrupted
 * - LAW #3: Depth suggestions are intellectual only
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import novaConstitutionService, {
  NovaRequest,
  NovaResponse,
  NovaMode,
  NovaAnalysisRequest,
  NovaAnalysisResponse,
  NovaGuidanceRequest,
  NovaGuidanceResponse,
  NovaStatus,
} from '../services/nova.constitution.service';
import type { DepthSuggestion } from '../services/governance.constitution.service';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface NovaMessage {
  id: string;
  role: 'user' | 'nova';
  content: string;
  timestamp: Date;
  mode?: NovaMode;
  suggestions?: Array<{ id: string; text: string }>;
  depthSuggestion?: DepthSuggestion;
}

interface NovaState {
  // Status
  status: NovaStatus | null;
  isOnline: boolean;
  
  // Conversation
  messages: NovaMessage[];
  currentMode: NovaMode;
  
  // Analysis
  currentAnalysis: NovaAnalysisResponse | null;
  analysisHistory: NovaAnalysisResponse[];
  
  // Depth suggestion (LAW #3)
  currentDepthSuggestion: DepthSuggestion | null;
  
  // UI State
  isProcessing: boolean;
  error: string | null;
  
  // ❌ FORBIDDEN STATE (Constitution LAW #1):
  // tokensUsed?: number;
  // budgetRemaining?: number;
  // costEstimate?: number;
}

interface NovaActions {
  // Query
  sendMessage: (message: string, context?: Record<string, unknown>) => Promise<NovaResponse | null>;
  askNova: (question: string) => Promise<string>;
  
  // Guidance
  getGuidance: (request: NovaGuidanceRequest) => Promise<NovaGuidanceResponse | null>;
  
  // Analysis (LAW #2 - Never interrupted)
  analyzeData: (request: NovaAnalysisRequest) => Promise<NovaAnalysisResponse | null>;
  requestDeepen: (analysisId: string) => Promise<void>;
  
  // Status
  fetchStatus: () => Promise<void>;
  
  // Depth suggestion (LAW #3)
  setDepthSuggestion: (suggestion: DepthSuggestion | null) => void;
  clearDepthSuggestion: () => void;
  
  // State management
  setMode: (mode: NovaMode) => void;
  clearMessages: () => void;
  clearAnalysis: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type NovaStore = NovaState & NovaActions;

// ══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ══════════════════════════════════════════════════════════════════════════════

const initialState: NovaState = {
  status: null,
  isOnline: true,
  messages: [],
  currentMode: 'conversation',
  currentAnalysis: null,
  analysisHistory: [],
  currentDepthSuggestion: null,
  isProcessing: false,
  error: null,
};

// ══════════════════════════════════════════════════════════════════════════════
// STORE
// ══════════════════════════════════════════════════════════════════════════════

export const useNovaStore = create<NovaStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ────────────────────────────────────────────────────────────────────────
      // QUERY
      // ────────────────────────────────────────────────────────────────────────

      sendMessage: async (message, context) => {
        const { messages, currentMode } = get();
        
        // Add user message
        const userMessage: NovaMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: new Date(),
        };
        
        set({
          messages: [...messages, userMessage],
          isProcessing: true,
          error: null,
        });
        
        try {
          const response = await novaConstitutionService.query({
            message,
            context: context as any,
            modeHint: currentMode,
            includeSuggestions: true,
          });
          
          // Add Nova response
          const novaMessage: NovaMessage = {
            id: response.responseId,
            role: 'nova',
            content: response.message,
            timestamp: new Date(),
            mode: response.detectedMode,
            suggestions: response.suggestions?.map((s) => ({ id: s.id, text: s.text })),
            depthSuggestion: response.depthSuggestion,
          };
          
          set({
            messages: [...get().messages, novaMessage],
            currentMode: response.detectedMode,
            currentDepthSuggestion: response.depthSuggestion || null,
            isProcessing: false,
          });
          
          return response;
        } catch (error: unknown) {
          set({
            isProcessing: false,
            error: (error as Error).message || 'Failed to get response from Nova',
          });
          return null;
        }
      },

      askNova: async (question) => {
        const response = await get().sendMessage(question);
        return response?.message || '';
      },

      // ────────────────────────────────────────────────────────────────────────
      // GUIDANCE
      // ────────────────────────────────────────────────────────────────────────

      getGuidance: async (request) => {
        set({ isProcessing: true, error: null });
        
        try {
          const response = await novaConstitutionService.getGuidance(typeof request === "string" ? request : request.topic);
          set({ isProcessing: false });
          return response;
        } catch (error: unknown) {
          set({
            isProcessing: false,
            error: (error as Error).message || 'Failed to get guidance',
          });
          return null;
        }
      },

      // ────────────────────────────────────────────────────────────────────────
      // ANALYSIS (LAW #2 - Never interrupted)
      // ────────────────────────────────────────────────────────────────────────

      analyzeData: async (request) => {
        set({ isProcessing: true, error: null });
        
        try {
          // LAW #2: Analysis is never interrupted for budget
          const response = await novaConstitutionService.analyze(request);
          
          set({
            currentAnalysis: response,
            analysisHistory: [...get().analysisHistory, response],
            currentDepthSuggestion: response.depthSuggestion || null,
            isProcessing: false,
          });
          
          return response;
        } catch (error: unknown) {
          set({
            isProcessing: false,
            error: (error as Error).message || 'Analysis failed',
          });
          return null;
        }
      },

      requestDeepen: async (analysisId) => {
        set({ isProcessing: true, error: null });
        
        try {
          const response = await novaConstitutionService.requestDeepen(analysisId);
          
          // Check if checkpoint was returned
          if ('checkpoint' in response && response.checkpoint) {
            // Trigger checkpoint modal via governance store
            const { default: useGovernanceStore } = await import('./governance.store');
            useGovernanceStore.getState().createCheckpoint(response.checkpoint as any);
          }
          
          set({
            isProcessing: false,
            currentDepthSuggestion: null,
          });
        } catch (error: unknown) {
          set({
            isProcessing: false,
            error: (error as Error).message || 'Failed to deepen analysis',
          });
        }
      },

      // ────────────────────────────────────────────────────────────────────────
      // STATUS
      // ────────────────────────────────────────────────────────────────────────

      fetchStatus: async () => {
        try {
          const status = await novaConstitutionService.getStatus();
          set({ status, isOnline: status.online });
        } catch (error) {
          set({ isOnline: false });
        }
      },

      // ────────────────────────────────────────────────────────────────────────
      // DEPTH SUGGESTION (LAW #3)
      // ────────────────────────────────────────────────────────────────────────

      setDepthSuggestion: (suggestion) => set({ currentDepthSuggestion: suggestion }),
      clearDepthSuggestion: () => set({ currentDepthSuggestion: null }),

      // ────────────────────────────────────────────────────────────────────────
      // STATE MANAGEMENT
      // ────────────────────────────────────────────────────────────────────────

      setMode: (mode) => set({ currentMode: mode }),
      clearMessages: () => set({ messages: [] }),
      clearAnalysis: () => set({ currentAnalysis: null }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    { name: 'NovaStore' }
  )
);

// ══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ══════════════════════════════════════════════════════════════════════════════

export const selectNovaMessages = (state: NovaState) => state.messages;
export const selectNovaMode = (state: NovaState) => state.currentMode;
export const selectNovaIsProcessing = (state: NovaState) => state.isProcessing;
export const selectCurrentAnalysis = (state: NovaState) => state.currentAnalysis;
export const selectDepthSuggestion = (state: NovaState) => state.currentDepthSuggestion;
export const selectNovaIsOnline = (state: NovaState) => state.isOnline;

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════

export const useNova = () => {
  const messages = useNovaStore(selectNovaMessages);
  const mode = useNovaStore(selectNovaMode);
  const isProcessing = useNovaStore(selectNovaIsProcessing);
  const isOnline = useNovaStore(selectNovaIsOnline);
  const error = useNovaStore((s) => s.error);
  const sendMessage = useNovaStore((s) => s.sendMessage);
  const askNova = useNovaStore((s) => s.askNova);
  const setMode = useNovaStore((s) => s.setMode);
  const clearMessages = useNovaStore((s) => s.clearMessages);
  
  return {
    messages,
    mode,
    isProcessing,
    isOnline,
    error,
    sendMessage,
    askNova,
    setMode,
    clearMessages,
  };
};

export const useNovaAnalysis = () => {
  const currentAnalysis = useNovaStore(selectCurrentAnalysis);
  const depthSuggestion = useNovaStore(selectDepthSuggestion);
  const isProcessing = useNovaStore(selectNovaIsProcessing);
  const analyzeData = useNovaStore((s) => s.analyzeData);
  const requestDeepen = useNovaStore((s) => s.requestDeepen);
  const clearDepthSuggestion = useNovaStore((s) => s.clearDepthSuggestion);
  
  return {
    currentAnalysis,
    depthSuggestion,
    isProcessing,
    analyzeData,
    requestDeepen,
    clearDepthSuggestion,
  };
};

// ══════════════════════════════════════════════════════════════════════════════
// NOVA INFO (Always available)
// ══════════════════════════════════════════════════════════════════════════════

export const NOVA_INFO = novaConstitutionService.getInfo();

export default useNovaStore;
