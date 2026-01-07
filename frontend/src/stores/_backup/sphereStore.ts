// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — SPHERE STORE (ZUSTAND)
// State management pour navigation entre sphères
// DELTA APRÈS v38.2
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type SphereCode = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team'
  | 'scholars'; // 9ème sphère académique

export type BureauSectionId = 
  | 'quick_capture'
  | 'resume_workspace'
  | 'threads'
  | 'data_files'
  | 'active_agents'
  | 'meetings';

export interface SphereUnlockRequirement {
  sphereId: SphereCode;
  condition: 'onboarding_complete' | 'manual_unlock' | 'always_unlocked';
  prerequisiteSpheres?: SphereCode[];
}

// ═══════════════════════════════════════════════════════════════
// STORE STATE INTERFACE
// ═══════════════════════════════════════════════════════════════

interface SphereState {
  // Current navigation
  currentSphere: SphereCode;
  currentSection: BureauSectionId;
  
  // Navigation history
  previousSphere: SphereCode | null;
  previousSection: BureauSectionId | null;
  navigationHistory: Array<{ sphere: SphereCode; section: BureauSectionId; timestamp: number }>;
  
  // Sphere unlock status
  unlockedSpheres: Set<SphereCode>;
  
  // UI state
  sidebarCollapsed: boolean;
  novaOpen: boolean;
  xrModeActive: boolean;
  
  // Actions
  setCurrentSphere: (sphere: SphereCode) => void;
  setCurrentSection: (section: BureauSectionId) => void;
  navigateTo: (sphere: SphereCode, section?: BureauSectionId) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  toggleNova: () => void;
  toggleXRMode: () => void;
  unlockSphere: (sphere: SphereCode) => void;
  lockSphere: (sphere: SphereCode) => void;
  isSphereUnlocked: (sphere: SphereCode) => boolean;
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════

const DEFAULT_SPHERE: SphereCode = 'personal';
const DEFAULT_SECTION: BureauSectionId = 'quick_capture';
const MAX_HISTORY_LENGTH = 50;

// Initially unlocked spheres (9 sphères)
const INITIAL_UNLOCKED_SPHERES: SphereCode[] = [
  'personal',
  'business',
  'government',
  'design_studio',
  'community',
  'social',
  'entertainment',
  'my_team',
  'scholars', // 9ème sphère
];

// ═══════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════

export const useSphereStore = create<SphereState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSphere: DEFAULT_SPHERE,
      currentSection: DEFAULT_SECTION,
      previousSphere: null,
      previousSection: null,
      navigationHistory: [],
      unlockedSpheres: new Set(INITIAL_UNLOCKED_SPHERES),
      sidebarCollapsed: false,
      novaOpen: false,
      xrModeActive: false,

      // ─────────────────────────────────────────────────────────────
      // Navigation Actions
      // ─────────────────────────────────────────────────────────────

      setCurrentSphere: (sphere) => {
        const state = get();
        if (sphere === state.currentSphere) return;
        
        // Check if sphere is unlocked
        if (!state.unlockedSpheres.has(sphere)) {
          console.warn(`Sphere ${sphere} is locked`);
          return;
        }

        set({
          previousSphere: state.currentSphere,
          previousSection: state.currentSection,
          currentSphere: sphere,
          currentSection: DEFAULT_SECTION, // Reset section on sphere change
          navigationHistory: [
            ...state.navigationHistory.slice(-MAX_HISTORY_LENGTH + 1),
            { sphere, section: DEFAULT_SECTION, timestamp: Date.now() },
          ],
        });
      },

      setCurrentSection: (section) => {
        const state = get();
        if (section === state.currentSection) return;

        set({
          previousSection: state.currentSection,
          currentSection: section,
          navigationHistory: [
            ...state.navigationHistory.slice(-MAX_HISTORY_LENGTH + 1),
            { sphere: state.currentSphere, section, timestamp: Date.now() },
          ],
        });
      },

      navigateTo: (sphere, section = DEFAULT_SECTION) => {
        const state = get();
        
        // Check if sphere is unlocked
        if (!state.unlockedSpheres.has(sphere)) {
          console.warn(`Sphere ${sphere} is locked`);
          return;
        }

        set({
          previousSphere: state.currentSphere,
          previousSection: state.currentSection,
          currentSphere: sphere,
          currentSection: section,
          navigationHistory: [
            ...state.navigationHistory.slice(-MAX_HISTORY_LENGTH + 1),
            { sphere, section, timestamp: Date.now() },
          ],
        });
      },

      goBack: () => {
        const state = get();
        if (!state.previousSphere) return;

        set({
          currentSphere: state.previousSphere,
          currentSection: state.previousSection || DEFAULT_SECTION,
          previousSphere: null,
          previousSection: null,
        });
      },

      // ─────────────────────────────────────────────────────────────
      // UI Actions
      // ─────────────────────────────────────────────────────────────

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      toggleNova: () => {
        set((state) => ({ novaOpen: !state.novaOpen }));
      },

      toggleXRMode: () => {
        set((state) => ({ xrModeActive: !state.xrModeActive }));
      },

      // ─────────────────────────────────────────────────────────────
      // Unlock Actions
      // ─────────────────────────────────────────────────────────────

      unlockSphere: (sphere) => {
        set((state) => ({
          unlockedSpheres: new Set([...state.unlockedSpheres, sphere]),
        }));
      },

      lockSphere: (sphere) => {
        // Cannot lock personal sphere
        if (sphere === 'personal') return;

        set((state) => {
          const newUnlocked = new Set(state.unlockedSpheres);
          newUnlocked.delete(sphere);
          return { unlockedSpheres: newUnlocked };
        });
      },

      isSphereUnlocked: (sphere) => {
        return get().unlockedSpheres.has(sphere);
      },

      // ─────────────────────────────────────────────────────────────
      // Reset
      // ─────────────────────────────────────────────────────────────

      reset: () => {
        set({
          currentSphere: DEFAULT_SPHERE,
          currentSection: DEFAULT_SECTION,
          previousSphere: null,
          previousSection: null,
          navigationHistory: [],
          unlockedSpheres: new Set(INITIAL_UNLOCKED_SPHERES),
          sidebarCollapsed: false,
          novaOpen: false,
          xrModeActive: false,
        });
      },
    }),
    {
      name: 'chenu-sphere-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSphere: state.currentSphere,
        currentSection: state.currentSection,
        unlockedSpheres: Array.from(state.unlockedSpheres),
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════

export const useCurrentSphere = () => useSphereStore((state) => state.currentSphere);
export const useCurrentSection = () => useSphereStore((state) => state.currentSection);
export const useNavigationHistory = () => useSphereStore((state) => state.navigationHistory);
export const useSidebarCollapsed = () => useSphereStore((state) => state.sidebarCollapsed);
export const useNovaOpen = () => useSphereStore((state) => state.novaOpen);
export const useXRModeActive = () => useSphereStore((state) => state.xrModeActive);

export default useSphereStore;
