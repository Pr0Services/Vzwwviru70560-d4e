/**
 * CHE·NU™ - HUB STORE
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * 3 Hubs:
 * - Communication (Nova, Threads, Chat)
 * - Navigation (Spheres, Bureau)
 * - Workspace (Create, Transform, Version)
 * 
 * Rules:
 * - Max 2 visible at once
 * - Nova always accessible
 * - Hidden execution NOT allowed
 */

import { create } from 'zustand';
import { 
  HubId, 
  HUB_RULES, 
  isValidHubCombination,
  DEFAULT_HUB_STATE,
} from '../config/hubs.config';

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

interface HubStoreState {
  // Visible hubs (max 2)
  visibleHubs: HubId[];
  
  // Expanded hub (for focus mode)
  expandedHub: HubId | null;
  
  // Nova quick access state
  novaOpen: boolean;
  novaMinimized: boolean;
  
  // Actions
  showHub: (hubId: HubId) => void;
  hideHub: (hubId: HubId) => void;
  toggleHub: (hubId: HubId) => void;
  expandHub: (hubId: HubId | null) => void;
  setVisibleHubs: (hubs: HubId[]) => boolean;
  
  // Nova
  openNova: () => void;
  closeNova: () => void;
  toggleNova: () => void;
  minimizeNova: () => void;
  
  // Presets
  showCommunicationWorkspace: () => void;
  showNavigationWorkspace: () => void;
  showCommunicationNavigation: () => void;
  
  // Queries
  isHubVisible: (hubId: HubId) => boolean;
  canShowHub: (hubId: HubId) => boolean;
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useHubStore = create<HubStoreState>((set, get) => ({
  visibleHubs: DEFAULT_HUB_STATE.activeHubs,
  expandedHub: DEFAULT_HUB_STATE.expandedHub,
  novaOpen: false,
  novaMinimized: false,

  // ─────────────────────────────────────────────────────────
  // Hub Visibility
  // ─────────────────────────────────────────────────────────
  showHub: (hubId: HubId): void => {
    set((state) => {
      const newHubs = [...state.visibleHubs];
      
      if (newHubs.includes(hubId)) return state;
      
      if (newHubs.length >= HUB_RULES.MAX_VISIBLE_HUBS) {
        // Replace first hub
        newHubs.shift();
      }
      newHubs.push(hubId);
      
      if (!isValidHubCombination(newHubs)) {
        console.warn(`[Hub] Invalid combination: ${newHubs.join(', ')}`);
        return state;
      }
      
      return { visibleHubs: newHubs };
    });
  },

  hideHub: (hubId: HubId): void => {
    set((state) => ({
      visibleHubs: state.visibleHubs.filter((h) => h !== hubId),
      expandedHub: state.expandedHub === hubId ? null : state.expandedHub,
    }));
  },

  toggleHub: (hubId: HubId): void => {
    const { visibleHubs, showHub, hideHub } = get();
    if (visibleHubs.includes(hubId)) {
      hideHub(hubId);
    } else {
      showHub(hubId);
    }
  },

  expandHub: (hubId: HubId | null): void => {
    set({ expandedHub: hubId });
  },

  setVisibleHubs: (hubs: HubId[]): boolean => {
    if (!isValidHubCombination(hubs)) {
      console.warn(`[Hub] Cannot set invalid combination: ${hubs.join(', ')}`);
      return false;
    }
    set({ visibleHubs: hubs });
    return true;
  },

  // ─────────────────────────────────────────────────────────
  // Nova (Always Accessible)
  // ─────────────────────────────────────────────────────────
  openNova: (): void => {
    set({ novaOpen: true, novaMinimized: false });
  },

  closeNova: (): void => {
    set({ novaOpen: false });
  },

  toggleNova: (): void => {
    set((state) => ({ novaOpen: !state.novaOpen }));
  },

  minimizeNova: (): void => {
    set({ novaMinimized: true });
  },

  // ─────────────────────────────────────────────────────────
  // Presets
  // ─────────────────────────────────────────────────────────
  showCommunicationWorkspace: (): void => {
    set({ visibleHubs: ['communication', 'workspace'] });
  },

  showNavigationWorkspace: (): void => {
    set({ visibleHubs: ['navigation', 'workspace'] });
  },

  showCommunicationNavigation: (): void => {
    set({ visibleHubs: ['communication', 'navigation'] });
  },

  // ─────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────
  isHubVisible: (hubId: HubId): boolean => {
    return get().visibleHubs.includes(hubId);
  },

  canShowHub: (hubId: HubId): boolean => {
    const { visibleHubs } = get();
    if (visibleHubs.includes(hubId)) return true;
    if (visibleHubs.length < HUB_RULES.MAX_VISIBLE_HUBS) return true;
    
    // Check if replacing would create valid combination
    const newHubs = [visibleHubs[1], hubId];
    return isValidHubCombination(newHubs as HubId[]);
  },
}));

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useVisibleHubs = () => useHubStore((s) => s.visibleHubs);
export const useExpandedHub = () => useHubStore((s) => s.expandedHub);
export const useNovaState = () => useHubStore((s) => ({ open: s.novaOpen, minimized: s.novaMinimized }));

export default useHubStore;
