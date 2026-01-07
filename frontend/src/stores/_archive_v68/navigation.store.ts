// =============================================================================
// CHE·NU™ — NAVIGATION STORE
// Version Finale V52
// Zustand store for navigation state management
// =============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SphereId } from '../types/sphere.types';
import { BureauSectionId } from '../types/bureau.types';
import { 
  NavigationLevel, 
  NavigationState, 
  WorkspaceMode,
  getDefaultNavigationState,
  navigationReducer,
  NavigationAction,
} from '../navigation/navigation.config';

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface NavigationStore extends NavigationState {
  // History
  history: NavigationState[];
  historyIndex: number;
  
  // Actions
  selectSphere: (sphereId: SphereId) => void;
  enterDashboard: () => void;
  enterBureau: () => void;
  selectSection: (sectionId: BureauSectionId) => void;
  openWorkspace: (mode: WorkspaceMode, dataSpaceId: string) => void;
  closeWorkspace: () => void;
  exitBureau: () => void;
  exitSphere: () => void;
  returnToUniverse: () => void;
  
  // History navigation
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  goBack: () => void;
  goForward: () => void;
  
  // Utilities
  reset: () => void;
  dispatch: (action: NavigationAction) => void;
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useNavigationStore = create<NavigationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...getDefaultNavigationState(),
        history: [getDefaultNavigationState()],
        historyIndex: 0,
        
        // Actions
        selectSphere: (sphereId) => {
          const action: NavigationAction = { type: 'SELECT_SPHERE', sphereId };
          get().dispatch(action);
        },
        
        enterDashboard: () => {
          const action: NavigationAction = { type: 'ENTER_DASHBOARD' };
          get().dispatch(action);
        },
        
        enterBureau: () => {
          const action: NavigationAction = { type: 'ENTER_BUREAU' };
          get().dispatch(action);
        },
        
        selectSection: (sectionId) => {
          const action: NavigationAction = { type: 'SELECT_SECTION', sectionId };
          get().dispatch(action);
        },
        
        openWorkspace: (mode, dataSpaceId) => {
          const action: NavigationAction = { type: 'OPEN_WORKSPACE', mode, dataSpaceId };
          get().dispatch(action);
        },
        
        closeWorkspace: () => {
          const action: NavigationAction = { type: 'CLOSE_WORKSPACE' };
          get().dispatch(action);
        },
        
        exitBureau: () => {
          const action: NavigationAction = { type: 'EXIT_BUREAU' };
          get().dispatch(action);
        },
        
        exitSphere: () => {
          const action: NavigationAction = { type: 'EXIT_SPHERE' };
          get().dispatch(action);
        },
        
        returnToUniverse: () => {
          const action: NavigationAction = { type: 'RETURN_TO_UNIVERSE' };
          get().dispatch(action);
        },
        
        // History
        canGoBack: () => get().historyIndex > 0,
        canGoForward: () => get().historyIndex < get().history.length - 1,
        
        goBack: () => {
          const { historyIndex, history } = get();
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const prevState = history[newIndex];
            set({
              ...prevState,
              historyIndex: newIndex,
            });
          }
        },
        
        goForward: () => {
          const { historyIndex, history } = get();
          if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const nextState = history[newIndex];
            set({
              ...nextState,
              historyIndex: newIndex,
            });
          }
        },
        
        // Reset
        reset: () => {
          const initialState = getDefaultNavigationState();
          set({
            ...initialState,
            history: [initialState],
            historyIndex: 0,
          });
        },
        
        // Central dispatch
        dispatch: (action) => {
          const state = get();
          const currentNavState: NavigationState = {
            level: state.level,
            sphereId: state.sphereId,
            viewMode: state.viewMode,
            bureauSection: state.bureauSection,
            workspaceMode: state.workspaceMode,
            dataSpaceId: state.dataSpaceId,
          };
          
          const newNavState = navigationReducer(currentNavState, action);
          
          // Update history (trim forward history if we navigated back)
          const newHistory = [
            ...state.history.slice(0, state.historyIndex + 1),
            newNavState,
          ];
          
          set({
            ...newNavState,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          });
        },
      }),
      {
        name: 'chenu-navigation-storage',
        partialize: (state) => ({
          level: state.level,
          sphereId: state.sphereId,
          viewMode: state.viewMode,
          bureauSection: state.bureauSection,
        }),
      }
    ),
    { name: 'CHE·NU Navigation' }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const selectCurrentLevel = (state: NavigationStore) => state.level;
export const selectCurrentSphere = (state: NavigationStore) => state.sphereId;
export const selectCurrentViewMode = (state: NavigationStore) => state.viewMode;
export const selectCurrentSection = (state: NavigationStore) => state.bureauSection;
export const selectCurrentWorkspace = (state: NavigationStore) => ({
  mode: state.workspaceMode,
  dataSpaceId: state.dataSpaceId,
});

export const selectIsInBureau = (state: NavigationStore) => 
  state.level === 'L2' && state.viewMode === 'bureau';

export const selectIsInWorkspace = (state: NavigationStore) => 
  state.level === 'L3';

export const selectBreadcrumb = (state: NavigationStore) => {
  const crumbs: { label: string; level: NavigationLevel }[] = [];
  
  crumbs.push({ label: 'Universe', level: 'L0' });
  
  if (state.sphereId) {
    crumbs.push({ label: state.sphereId, level: 'L1' });
  }
  
  if (state.bureauSection) {
    crumbs.push({ label: state.bureauSection, level: 'L2' });
  }
  
  if (state.workspaceMode) {
    crumbs.push({ label: state.workspaceMode, level: 'L3' });
  }
  
  return crumbs;
};
