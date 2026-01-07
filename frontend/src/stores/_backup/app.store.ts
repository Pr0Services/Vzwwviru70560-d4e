/**
 * CHE·NU — App Store (Global State)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface AppState {
  // Navigation
  currentPath: string;
  currentSphere: string | null;
  sidebarOpen: boolean;
  novaOpen: boolean;
  
  // Spheres
  enabledSpheres: string[];
  defaultSphere: string;
  
  // Theme
  theme: 'dark' | 'light';
  
  // Search
  searchOpen: boolean;
  searchQuery: string;
  
  // Actions
  setCurrentPath: (path: string) => void;
  setCurrentSphere: (sphere: string | null) => void;
  toggleSidebar: () => void;
  toggleNova: () => void;
  openNova: () => void;
  closeNova: () => void;
  setEnabledSpheres: (spheres: string[]) => void;
  setDefaultSphere: (sphere: string) => void;
  toggleTheme: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPath: '/',
      currentSphere: null,
      sidebarOpen: true,
      novaOpen: false,
      enabledSpheres: ['personal', 'enterprise', 'ai-labs'],
      defaultSphere: 'personal',
      theme: 'dark',
      searchOpen: false,
      searchQuery: '',

      setCurrentPath: (path) => set({ currentPath: path }),
      setCurrentSphere: (sphere) => set({ currentSphere: sphere }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleNova: () => set((state) => ({ novaOpen: !state.novaOpen })),
      openNova: () => set({ novaOpen: true }),
      closeNova: () => set({ novaOpen: false }),
      setEnabledSpheres: (spheres) => set({ enabledSpheres: spheres }),
      setDefaultSphere: (sphere) => set({ defaultSphere: sphere }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'chenu-app',
      partialize: (state) => ({
        enabledSpheres: state.enabledSpheres,
        defaultSphere: state.defaultSphere,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export default useAppStore;
