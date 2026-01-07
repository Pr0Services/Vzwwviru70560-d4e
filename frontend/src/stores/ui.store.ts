/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — UI STORE                                    ║
 * ║                    Navigation + Sphère Active + UI State                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce store gère:
 * - Sphère ACTIVE (focus utilisateur, pas les sphères elles-mêmes)
 * - Navigation (level, section bureau)
 * - État UI (sidebar, modals, toasts, theme)
 * 
 * Les sphères sont définies dans CANON.ts (immuables)
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
  SphereId, 
  BureauSectionId, 
  NavigationLevel,
  DEFAULT_SPHERE_ID,
  DEFAULT_BUREAU_SECTION_ID,
  DEFAULT_NAVIGATION_LEVEL,
  isValidSphereId,
  isValidBureauSectionId,
} from '../constants/CANON';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Theme = 'dark' | 'light' | 'system';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';
export type WorkspaceMode = 'view' | 'edit' | 'focus' | 'present';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'checkpoint' | 'agent';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NavigationHistoryEntry {
  level: NavigationLevel;
  sphereId: SphereId | null;
  bureauSection: BureauSectionId | null;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

interface UIState {
  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION (Sphère Active + Level + Section)
  // ─────────────────────────────────────────────────────────────────────────────
  navigationLevel: NavigationLevel;
  activeSphereId: SphereId | null;
  activeBureauSection: BureauSectionId | null;
  workspaceMode: WorkspaceMode | null;
  dataSpaceId: string | null;
  
  // Navigation history
  navigationHistory: NavigationHistoryEntry[];
  historyIndex: number;
  
  // Navigation actions
  selectSphere: (sphereId: SphereId) => void;
  enterDashboard: () => void;
  enterBureau: () => void;
  selectBureauSection: (sectionId: BureauSectionId) => void;
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
  
  // ─────────────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────────────
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────────────────────────────────────
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // NOVA PANEL
  // ─────────────────────────────────────────────────────────────────────────────
  novaPanelOpen: boolean;
  setNovaPanelOpen: (open: boolean) => void;
  toggleNovaPanel: () => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COMMAND PALETTE
  // ─────────────────────────────────────────────────────────────────────────────
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TOASTS
  // ─────────────────────────────────────────────────────────────────────────────
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // MODALS
  // ─────────────────────────────────────────────────────────────────────────────
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  notifications: Notification[];
  unreadNotificationCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────────────────────
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING STATES
  // ─────────────────────────────────────────────────────────────────────────────
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (loading: boolean, message?: string) => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────────────────────────
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialNavigationState = {
  navigationLevel: DEFAULT_NAVIGATION_LEVEL,
  activeSphereId: null as SphereId | null,
  activeBureauSection: null as BureauSectionId | null,
  workspaceMode: null as WorkspaceMode | null,
  dataSpaceId: null as string | null,
  navigationHistory: [] as NavigationHistoryEntry[],
  historyIndex: -1,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // ─────────────────────────────────────────────────────────────────────────
        // NAVIGATION STATE
        // ─────────────────────────────────────────────────────────────────────────
        ...initialNavigationState,
        
        selectSphere: (sphereId: SphereId) => {
          if (!isValidSphereId(sphereId)) return;
          
          const entry: NavigationHistoryEntry = {
            level: 'L1',
            sphereId,
            bureauSection: null,
            timestamp: new Date().toISOString(),
          };
          
          set((state) => ({
            navigationLevel: 'L1',
            activeSphereId: sphereId,
            activeBureauSection: null,
            workspaceMode: null,
            dataSpaceId: null,
            navigationHistory: [...state.navigationHistory.slice(0, state.historyIndex + 1), entry],
            historyIndex: state.historyIndex + 1,
          }));
        },
        
        enterDashboard: () => {
          const { activeSphereId } = get();
          if (!activeSphereId) return;
          
          set({ navigationLevel: 'L1' });
        },
        
        enterBureau: () => {
          const { activeSphereId } = get();
          if (!activeSphereId) return;
          
          const entry: NavigationHistoryEntry = {
            level: 'L2',
            sphereId: activeSphereId,
            bureauSection: DEFAULT_BUREAU_SECTION_ID,
            timestamp: new Date().toISOString(),
          };
          
          set((state) => ({
            navigationLevel: 'L2',
            activeBureauSection: DEFAULT_BUREAU_SECTION_ID,
            navigationHistory: [...state.navigationHistory.slice(0, state.historyIndex + 1), entry],
            historyIndex: state.historyIndex + 1,
          }));
        },
        
        selectBureauSection: (sectionId: BureauSectionId) => {
          if (!isValidBureauSectionId(sectionId)) return;
          
          const { activeSphereId } = get();
          
          const entry: NavigationHistoryEntry = {
            level: 'L2',
            sphereId: activeSphereId,
            bureauSection: sectionId,
            timestamp: new Date().toISOString(),
          };
          
          set((state) => ({
            activeBureauSection: sectionId,
            navigationHistory: [...state.navigationHistory.slice(0, state.historyIndex + 1), entry],
            historyIndex: state.historyIndex + 1,
          }));
        },
        
        openWorkspace: (mode: WorkspaceMode, dataSpaceId: string) => {
          set({
            navigationLevel: 'L3',
            workspaceMode: mode,
            dataSpaceId,
          });
        },
        
        closeWorkspace: () => {
          set({
            navigationLevel: 'L2',
            workspaceMode: null,
            dataSpaceId: null,
          });
        },
        
        exitBureau: () => {
          set({
            navigationLevel: 'L1',
            activeBureauSection: null,
            workspaceMode: null,
            dataSpaceId: null,
          });
        },
        
        exitSphere: () => {
          set({
            navigationLevel: 'L0',
            activeSphereId: null,
            activeBureauSection: null,
            workspaceMode: null,
            dataSpaceId: null,
          });
        },
        
        returnToUniverse: () => {
          set({
            ...initialNavigationState,
            navigationHistory: get().navigationHistory,
            historyIndex: get().historyIndex,
          });
        },
        
        canGoBack: () => get().historyIndex > 0,
        canGoForward: () => get().historyIndex < get().navigationHistory.length - 1,
        
        goBack: () => {
          const { historyIndex, navigationHistory } = get();
          if (historyIndex > 0) {
            const prevEntry = navigationHistory[historyIndex - 1];
            set({
              navigationLevel: prevEntry.level,
              activeSphereId: prevEntry.sphereId,
              activeBureauSection: prevEntry.bureauSection,
              historyIndex: historyIndex - 1,
            });
          }
        },
        
        goForward: () => {
          const { historyIndex, navigationHistory } = get();
          if (historyIndex < navigationHistory.length - 1) {
            const nextEntry = navigationHistory[historyIndex + 1];
            set({
              navigationLevel: nextEntry.level,
              activeSphereId: nextEntry.sphereId,
              activeBureauSection: nextEntry.bureauSection,
              historyIndex: historyIndex + 1,
            });
          }
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // THEME
        // ─────────────────────────────────────────────────────────────────────────
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // SIDEBAR
        // ─────────────────────────────────────────────────────────────────────────
        sidebarState: 'expanded',
        setSidebarState: (sidebarState) => set({ sidebarState }),
        toggleSidebar: () => {
          const current = get().sidebarState;
          set({ sidebarState: current === 'expanded' ? 'collapsed' : 'expanded' });
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // NOVA PANEL
        // ─────────────────────────────────────────────────────────────────────────
        novaPanelOpen: false,
        setNovaPanelOpen: (novaPanelOpen) => set({ novaPanelOpen }),
        toggleNovaPanel: () => set((state) => ({ novaPanelOpen: !state.novaPanelOpen })),
        
        // ─────────────────────────────────────────────────────────────────────────
        // COMMAND PALETTE
        // ─────────────────────────────────────────────────────────────────────────
        commandPaletteOpen: false,
        setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // TOASTS
        // ─────────────────────────────────────────────────────────────────────────
        toasts: [],
        addToast: (toast) => {
          const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const newToast = { ...toast, id };
          set((state) => ({ toasts: [...state.toasts, newToast] }));
          
          const duration = toast.duration ?? 5000;
          if (duration > 0) {
            setTimeout(() => get().removeToast(id), duration);
          }
        },
        removeToast: (id) => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        },
        clearToasts: () => set({ toasts: [] }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // MODALS
        // ─────────────────────────────────────────────────────────────────────────
        activeModal: null,
        modalData: null,
        openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
        closeModal: () => set({ activeModal: null, modalData: null }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // NOTIFICATIONS
        // ─────────────────────────────────────────────────────────────────────────
        notifications: [],
        unreadNotificationCount: 0,
        addNotification: (notification) => {
          const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const newNotification: Notification = {
            ...notification,
            id,
            read: false,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadNotificationCount: state.unreadNotificationCount + 1,
          }));
        },
        markNotificationRead: (id) => {
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (!notification || notification.read) return state;
            
            return {
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
              unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
            };
          });
        },
        markAllNotificationsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadNotificationCount: 0,
          }));
        },
        dismissNotification: (id) => {
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.read;
            
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadNotificationCount: wasUnread
                ? Math.max(0, state.unreadNotificationCount - 1)
                : state.unreadNotificationCount,
            };
          });
        },
        clearNotifications: () => set({ notifications: [], unreadNotificationCount: 0 }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // SEARCH
        // ─────────────────────────────────────────────────────────────────────────
        searchQuery: '',
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        searchOpen: false,
        setSearchOpen: (searchOpen) => set({ searchOpen }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // LOADING
        // ─────────────────────────────────────────────────────────────────────────
        isLoading: false,
        loadingMessage: null,
        setLoading: (isLoading, message) => set({ 
          isLoading, 
          loadingMessage: message ?? null 
        }),
        
        // ─────────────────────────────────────────────────────────────────────────
        // RESET
        // ─────────────────────────────────────────────────────────────────────────
        reset: () => {
          set({
            ...initialNavigationState,
            theme: 'dark',
            sidebarState: 'expanded',
            novaPanelOpen: false,
            commandPaletteOpen: false,
            toasts: [],
            activeModal: null,
            modalData: null,
            notifications: [],
            unreadNotificationCount: 0,
            searchQuery: '',
            searchOpen: false,
            isLoading: false,
            loadingMessage: null,
          });
        },
      }),
      {
        name: 'chenu-ui-v68',
        partialize: (state) => ({
          theme: state.theme,
          sidebarState: state.sidebarState,
          activeSphereId: state.activeSphereId,
          activeBureauSection: state.activeBureauSection,
          navigationLevel: state.navigationLevel,
        }),
      }
    ),
    { name: 'CHE·NU UI Store' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const selectActiveSphere = (state: UIState) => state.activeSphereId;
export const selectActiveBureauSection = (state: UIState) => state.activeBureauSection;
export const selectNavigationLevel = (state: UIState) => state.navigationLevel;
export const selectIsInBureau = (state: UIState) => state.navigationLevel === 'L2';
export const selectIsInWorkspace = (state: UIState) => state.navigationLevel === 'L3';

export const selectBreadcrumb = (state: UIState) => {
  const crumbs: { label: string; level: NavigationLevel }[] = [];
  
  crumbs.push({ label: 'Universe', level: 'L0' });
  
  if (state.activeSphereId) {
    crumbs.push({ label: state.activeSphereId, level: 'L1' });
  }
  
  if (state.activeBureauSection) {
    crumbs.push({ label: state.activeBureauSection, level: 'L2' });
  }
  
  if (state.workspaceMode) {
    crumbs.push({ label: state.workspaceMode, level: 'L3' });
  }
  
  return crumbs;
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);
  
  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
  };
};

export const useNavigation = () => {
  const store = useUIStore();
  
  return {
    level: store.navigationLevel,
    sphereId: store.activeSphereId,
    sectionId: store.activeBureauSection,
    selectSphere: store.selectSphere,
    enterBureau: store.enterBureau,
    selectSection: store.selectBureauSection,
    exitBureau: store.exitBureau,
    exitSphere: store.exitSphere,
    goBack: store.goBack,
    goForward: store.goForward,
    canGoBack: store.canGoBack,
    canGoForward: store.canGoForward,
  };
};

export default useUIStore;
