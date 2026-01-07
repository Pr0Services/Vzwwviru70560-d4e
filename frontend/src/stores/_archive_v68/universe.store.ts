// =============================================================================
// CHE·NU™ — UNIVERSE STORE
// Version Finale V51
// State management avec Zustand
// =============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  ViewMode,
  ZoomLevel,
  SphereId,
  NavigationState,
  RenderConfig,
  ViewCamera,
  NavigationBreadcrumb,
  DEFAULT_CAMERA,
  DEFAULT_RENDER_CONFIG,
} from '../types';

// =============================================================================
// TYPES
// =============================================================================

interface UniverseStore {
  // Navigation state
  viewMode: ViewMode;
  zoomLevel: ZoomLevel;
  focusedSphereId: SphereId | null;
  focusedAgentId: string | null;
  hoveredSphereId: SphereId | null;
  hoveredAgentId: string | null;
  
  // Camera
  camera: ViewCamera;
  
  // Breadcrumbs
  breadcrumbs: NavigationBreadcrumb[];
  
  // Render config
  renderConfig: RenderConfig;
  
  // Loading state
  isLoading: boolean;
  error: string | null;
  
  // Actions - Navigation
  setViewMode: (mode: ViewMode) => void;
  setZoomLevel: (level: ZoomLevel, targetId?: string) => void;
  focusSphere: (sphereId: SphereId | null) => void;
  focusAgent: (agentId: string | null) => void;
  hoverSphere: (sphereId: SphereId | null) => void;
  hoverAgent: (agentId: string | null) => void;
  
  // Actions - Camera
  updateCamera: (camera: Partial<ViewCamera>) => void;
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (x: number, y: number) => void;
  
  // Actions - Breadcrumbs
  pushBreadcrumb: (crumb: NavigationBreadcrumb) => void;
  popBreadcrumb: () => void;
  navigateToBreadcrumb: (index: number) => void;
  clearBreadcrumbs: () => void;
  
  // Actions - Render
  setRenderConfig: (config: Partial<RenderConfig>) => void;
  toggleLabels: () => void;
  toggleConnections: () => void;
  toggleAgents: () => void;
  toggleMinimap: () => void;
  setQuality: (level: RenderConfig['qualityLevel']) => void;
  
  // Actions - State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  viewMode: '2d' as ViewMode,
  zoomLevel: 'universe' as ZoomLevel,
  focusedSphereId: null,
  focusedAgentId: null,
  hoveredSphereId: null,
  hoveredAgentId: null,
  camera: DEFAULT_CAMERA,
  breadcrumbs: [{ type: 'universe' as const, id: 'universe', label: 'Univers', icon: '🌌' }],
  renderConfig: DEFAULT_RENDER_CONFIG,
  isLoading: false,
  error: null,
};

// =============================================================================
// STORE
// =============================================================================

export const useUniverseStore = create<UniverseStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Navigation Actions
        setViewMode: (mode) => set({ viewMode: mode }),
        
        setZoomLevel: (level, targetId) => {
          const updates: Partial<UniverseStore> = { zoomLevel: level };
          
          // Adjust camera based on zoom level
          const camera = { ...get().camera };
          switch (level) {
            case 'universe':
              camera.zoom = 1;
              break;
            case 'cluster':
              camera.zoom = 1.5;
              break;
            case 'sphere':
              camera.zoom = 2;
              break;
            case 'category':
              camera.zoom = 3;
              break;
            case 'agent':
              camera.zoom = 4;
              break;
          }
          updates.camera = camera;
          
          set(updates);
        },
        
        focusSphere: (sphereId) => {
          const state = get();
          set({ 
            focusedSphereId: sphereId,
            focusedAgentId: null,
            zoomLevel: sphereId ? 'sphere' : 'universe',
          });
          
          if (sphereId) {
            const crumb: NavigationBreadcrumb = {
              type: 'sphere',
              id: sphereId,
              label: sphereId,
              icon: '🔮',
            };
            if (!state.breadcrumbs.find(b => b.id === sphereId)) {
              set({ breadcrumbs: [...state.breadcrumbs, crumb] });
            }
          }
        },
        
        focusAgent: (agentId) => {
          set({ 
            focusedAgentId: agentId,
            zoomLevel: agentId ? 'agent' : get().focusedSphereId ? 'sphere' : 'universe',
          });
        },
        
        hoverSphere: (sphereId) => set({ hoveredSphereId: sphereId }),
        hoverAgent: (agentId) => set({ hoveredAgentId: agentId }),
        
        // Camera Actions
        updateCamera: (updates) => set({ camera: { ...get().camera, ...updates } }),
        resetCamera: () => set({ camera: DEFAULT_CAMERA }),
        
        zoomIn: () => {
          const camera = get().camera;
          set({ camera: { ...camera, zoom: Math.min(camera.zoom * 1.2, 10) } });
        },
        
        zoomOut: () => {
          const camera = get().camera;
          set({ camera: { ...camera, zoom: Math.max(camera.zoom / 1.2, 0.1) } });
        },
        
        panTo: (x, y) => {
          const camera = get().camera;
          set({ camera: { ...camera, x, y, targetX: x, targetY: y } });
        },
        
        // Breadcrumb Actions
        pushBreadcrumb: (crumb) => {
          const breadcrumbs = get().breadcrumbs;
          if (!breadcrumbs.find(b => b.id === crumb.id)) {
            set({ breadcrumbs: [...breadcrumbs, crumb] });
          }
        },
        
        popBreadcrumb: () => {
          const breadcrumbs = get().breadcrumbs;
          if (breadcrumbs.length > 1) {
            set({ breadcrumbs: breadcrumbs.slice(0, -1) });
          }
        },
        
        navigateToBreadcrumb: (index) => {
          const breadcrumbs = get().breadcrumbs.slice(0, index + 1);
          const last = breadcrumbs[breadcrumbs.length - 1];
          
          set({
            breadcrumbs,
            focusedSphereId: last.type === 'sphere' ? last.id as SphereId : null,
            focusedAgentId: last.type === 'agent' ? last.id : null,
            zoomLevel: last.type as ZoomLevel,
          });
        },
        
        clearBreadcrumbs: () => set({ breadcrumbs: [initialState.breadcrumbs[0]] }),
        
        // Render Actions
        setRenderConfig: (config) => set({ renderConfig: { ...get().renderConfig, ...config } }),
        toggleLabels: () => set({ renderConfig: { ...get().renderConfig, showLabels: !get().renderConfig.showLabels } }),
        toggleConnections: () => set({ renderConfig: { ...get().renderConfig, showConnections: !get().renderConfig.showConnections } }),
        toggleAgents: () => set({ renderConfig: { ...get().renderConfig, showAgents: !get().renderConfig.showAgents } }),
        toggleMinimap: () => set({ renderConfig: { ...get().renderConfig, showMinimap: !get().renderConfig.showMinimap } }),
        setQuality: (level) => set({ renderConfig: { ...get().renderConfig, qualityLevel: level } }),
        
        // State Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        reset: () => set(initialState),
      }),
      {
        name: 'chenu-universe-store',
        partialize: (state) => ({
          viewMode: state.viewMode,
          renderConfig: state.renderConfig,
        }),
      }
    ),
    { name: 'UniverseStore' }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const selectViewMode = (state: UniverseStore) => state.viewMode;
export const selectZoomLevel = (state: UniverseStore) => state.zoomLevel;
export const selectFocusedSphere = (state: UniverseStore) => state.focusedSphereId;
export const selectFocusedAgent = (state: UniverseStore) => state.focusedAgentId;
export const selectCamera = (state: UniverseStore) => state.camera;
export const selectBreadcrumbs = (state: UniverseStore) => state.breadcrumbs;
export const selectRenderConfig = (state: UniverseStore) => state.renderConfig;
