/**
 * CHE·NU — UI Store (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Sidebar
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  
  // Nova Panel
  novaPanelOpen: boolean;
  setNovaPanelOpen: (open: boolean) => void;
  toggleNovaPanel: () => void;
  
  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Current sphere
  currentSphereId: string | null;
  setCurrentSphere: (sphereId: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarState: 'expanded',
      setSidebarState: (sidebarState) => set({ sidebarState }),
      toggleSidebar: () => {
        const current = get().sidebarState;
        set({ 
          sidebarState: current === 'expanded' ? 'collapsed' : 'expanded' 
        });
      },

      // Nova Panel
      novaPanelOpen: false,
      setNovaPanelOpen: (novaPanelOpen) => set({ novaPanelOpen }),
      toggleNovaPanel: () => set((state) => ({ novaPanelOpen: !state.novaPanelOpen })),

      // Command Palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        const newToast = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        
        // Auto remove
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      removeToast: (id) => {
        set((state) => ({ 
          toasts: state.toasts.filter((t) => t.id !== id) 
        }));
      },

      // Modals
      activeModal: null,
      modalData: null,
      openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Current sphere
      currentSphereId: null,
      setCurrentSphere: (currentSphereId) => set({ currentSphereId }),
    }),
    {
      name: 'chenu-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
        currentSphereId: state.currentSphereId,
      }),
    }
  )
);

// Helper hook for toasts
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);
  
  return {
    success: (title: string, message?: string) => 
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => 
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => 
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => 
      addToast({ type: 'info', title, message }),
  };
};

export default useUIStore;
