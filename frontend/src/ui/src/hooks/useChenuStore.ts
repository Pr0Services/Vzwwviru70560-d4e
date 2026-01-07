/**
 * CHE·NU™ — Store Principal (Zustand)
 * 
 * État global de l'application CHE·NU
 * Gère: Hubs, Sphères, Threads, Agents, Pipeline, XR
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SPHERES, getDefaultSphere } from '../config/spheres.config';
import type { 
  ChenuState, 
  HubState, 
  HubCenterState,
  ChenuThread, 
  Agent, 
  PipelineStage,
  XRState,
  HubId
} from '../types';

// Initial Hub States
const initialHubs: Record<HubId, HubState> = {
  center: { id: 'center', isVisible: true, isExpanded: true },
  left: { id: 'left', isVisible: true, isExpanded: true, activePanel: 'nova' },
  bottom: { id: 'bottom', isVisible: true, isExpanded: false },
  right: { id: 'right', isVisible: true, isExpanded: true, activePanel: 'document' },
};

const initialHubCenter: HubCenterState = {
  currentSphereId: getDefaultSphere().id,
  systemStatus: 'ok',
  governanceIndicators: {
    isGoverned: true,
    tokensUsed: 0,
    budgetRemaining: getDefaultSphere().defaultBudget,
    activePipeline: false,
  },
};

const initialXR: XRState = {
  enabled: false,
  supported: false,
  mode: null,
};

// Store Interface
interface ChenuStore extends ChenuState {
  // Hub Actions
  setHubVisible: (hubId: HubId, visible: boolean) => void;
  setHubExpanded: (hubId: HubId, expanded: boolean) => void;
  setHubActivePanel: (hubId: HubId, panel: string) => void;
  
  // Sphere Actions
  setSelectedSphere: (sphereId: string) => void;
  
  // Thread Actions
  addThread: (thread: ChenuThread) => void;
  updateThread: (threadId: string, updates: Partial<ChenuThread>) => void;
  deleteThread: (threadId: string) => void;
  setActiveThread: (threadId: string | null) => void;
  
  // Agent Actions
  addAgent: (agent: Agent) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  setActiveAgent: (agentId: string | null) => void;
  
  // Pipeline Actions
  setPipelineStage: (stage: PipelineStage) => void;
  setPipelineError: (error: string | null) => void;
  
  // XR Actions
  setXRState: (state: Partial<XRState>) => void;
  
  // Governance Actions
  updateGovernance: (updates: Partial<HubCenterState['governanceIndicators']>) => void;
  
  // Auth Actions
  setUser: (userId: string | null) => void;
  
  // Reset
  reset: () => void;
}

// Create Store
export const useChenuStore = create<ChenuStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ═══════════════════════════════════════════════════════════
        // INITIAL STATE
        // ═══════════════════════════════════════════════════════════
        hubs: initialHubs,
        hubCenter: initialHubCenter,
        spheres: [...SPHERES],
        selectedSphereId: getDefaultSphere().id,
        threads: [],
        activeThreadId: null,
        agents: [],
        activeAgentId: null,
        pipelineStage: 'IDLE',
        pipelineError: null,
        xr: initialXR,
        userId: null,
        isAuthenticated: false,

        // ═══════════════════════════════════════════════════════════
        // HUB ACTIONS
        // ═══════════════════════════════════════════════════════════
        setHubVisible: (hubId, visible) => set((state) => ({
          hubs: {
            ...state.hubs,
            [hubId]: { ...state.hubs[hubId], isVisible: visible },
          },
        })),

        setHubExpanded: (hubId, expanded) => set((state) => ({
          hubs: {
            ...state.hubs,
            [hubId]: { ...state.hubs[hubId], isExpanded: expanded },
          },
        })),

        setHubActivePanel: (hubId, panel) => set((state) => ({
          hubs: {
            ...state.hubs,
            [hubId]: { ...state.hubs[hubId], activePanel: panel },
          },
        })),

        // ═══════════════════════════════════════════════════════════
        // SPHERE ACTIONS
        // ═══════════════════════════════════════════════════════════
        setSelectedSphere: (sphereId) => {
          const sphere = SPHERES.find(s => s.id === sphereId);
          if (!sphere) return;
          
          set({
            selectedSphereId: sphereId,
            hubCenter: {
              ...get().hubCenter,
              currentSphereId: sphereId,
              governanceIndicators: {
                ...get().hubCenter.governanceIndicators,
                budgetRemaining: sphere.defaultBudget,
              },
            },
          });
        },

        // ═══════════════════════════════════════════════════════════
        // THREAD ACTIONS
        // ═══════════════════════════════════════════════════════════
        addThread: (thread) => set((state) => ({
          threads: [...state.threads, thread],
        })),

        updateThread: (threadId, updates) => set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
          ),
        })),

        deleteThread: (threadId) => set((state) => ({
          threads: state.threads.filter((t) => t.id !== threadId),
          activeThreadId: state.activeThreadId === threadId ? null : state.activeThreadId,
        })),

        setActiveThread: (threadId) => set({ activeThreadId: threadId }),

        // ═══════════════════════════════════════════════════════════
        // AGENT ACTIONS
        // ═══════════════════════════════════════════════════════════
        addAgent: (agent) => set((state) => ({
          agents: [...state.agents, agent],
        })),

        updateAgent: (agentId, updates) => set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
          ),
        })),

        setActiveAgent: (agentId) => set({ activeAgentId: agentId }),

        // ═══════════════════════════════════════════════════════════
        // PIPELINE ACTIONS
        // ═══════════════════════════════════════════════════════════
        setPipelineStage: (stage) => set((state) => ({
          pipelineStage: stage,
          hubCenter: {
            ...state.hubCenter,
            governanceIndicators: {
              ...state.hubCenter.governanceIndicators,
              activePipeline: !['IDLE', 'COMPLETED', 'FAILED'].includes(stage),
            },
          },
        })),

        setPipelineError: (error) => set({ pipelineError: error }),

        // ═══════════════════════════════════════════════════════════
        // XR ACTIONS
        // ═══════════════════════════════════════════════════════════
        setXRState: (updates) => set((state) => ({
          xr: { ...state.xr, ...updates },
        })),

        // ═══════════════════════════════════════════════════════════
        // GOVERNANCE ACTIONS
        // ═══════════════════════════════════════════════════════════
        updateGovernance: (updates) => set((state) => ({
          hubCenter: {
            ...state.hubCenter,
            governanceIndicators: {
              ...state.hubCenter.governanceIndicators,
              ...updates,
            },
          },
        })),

        // ═══════════════════════════════════════════════════════════
        // AUTH ACTIONS
        // ═══════════════════════════════════════════════════════════
        setUser: (userId) => set({
          userId,
          isAuthenticated: !!userId,
        }),

        // ═══════════════════════════════════════════════════════════
        // RESET
        // ═══════════════════════════════════════════════════════════
        reset: () => set({
          hubs: initialHubs,
          hubCenter: initialHubCenter,
          spheres: [...SPHERES],
          selectedSphereId: getDefaultSphere().id,
          threads: [],
          activeThreadId: null,
          agents: [],
          activeAgentId: null,
          pipelineStage: 'IDLE',
          pipelineError: null,
          xr: initialXR,
          userId: null,
          isAuthenticated: false,
        }),
      }),
      {
        name: 'chenu-store',
        partialize: (state) => ({
          selectedSphereId: state.selectedSphereId,
          threads: state.threads,
          userId: state.userId,
        }),
      }
    ),
    { name: 'CHE·NU Store' }
  )
);

export default useChenuStore;
