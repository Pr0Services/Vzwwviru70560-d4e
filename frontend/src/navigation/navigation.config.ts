// =============================================================================
// CHE·NU™ — NAVIGATION CONFIGURATION
// Version Finale V52 — ARCHITECTURE GELÉE
// =============================================================================
// 
// NAVIGATION HIERARCHY:
// L0: Universe (Root) - Sphere Selection
// L1: Sphere Context - Dashboard vs Bureau selection
// L2: Bureau Sections - 6 sections
// L3: Workspace - Document, Board, Timeline, etc.
//
// =============================================================================

import { SphereId } from '../types/sphere.types';
import { BureauSectionId } from '../types/bureau.types';

// =============================================================================
// NAVIGATION LEVELS
// =============================================================================

export type NavigationLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface NavigationState {
  level: NavigationLevel;
  sphereId: SphereId | null;
  viewMode: 'dashboard' | 'bureau' | null;
  bureauSection: BureauSectionId | null;
  workspaceMode: WorkspaceMode | null;
  dataSpaceId: string | null;
}

// =============================================================================
// WORKSPACE MODES (L3)
// =============================================================================

export type WorkspaceMode = 
  | 'document'      // 📄 Full word processing
  | 'board'         // 📋 Kanban-style
  | 'timeline'      // 📅 Chronological
  | 'spreadsheet'   // 📊 Tabular data
  | 'dashboard'     // 📈 KPI displays
  | 'diagram'       // 🔀 Flowcharts, architecture
  | 'whiteboard'    // 🎨 Brainstorming
  | 'xr'            // 🥽 3D immersive
  | 'hybrid';       // 🔄 Combined modes

export interface WorkspaceModeConfig {
  id: WorkspaceMode;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  supportedSpheres: SphereId[] | 'all';
  features: string[];
}

export const WORKSPACE_MODES: Record<WorkspaceMode, WorkspaceModeConfig> = {
  document: {
    id: 'document',
    name: 'Document',
    nameFr: 'Document',
    icon: '📄',
    description: 'Full word processing for long-form content',
    supportedSpheres: 'all',
    features: ['rich-text', 'formatting', 'export', 'collaboration'],
  },
  board: {
    id: 'board',
    name: 'Board',
    nameFr: 'Tableau',
    icon: '📋',
    description: 'Kanban-style task management',
    supportedSpheres: 'all',
    features: ['drag-drop', 'columns', 'cards', 'filters'],
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    nameFr: 'Chronologie',
    icon: '📅',
    description: 'Chronological project planning',
    supportedSpheres: 'all',
    features: ['gantt', 'milestones', 'dependencies', 'zoom'],
  },
  spreadsheet: {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    nameFr: 'Tableur',
    icon: '📊',
    description: 'Tabular data with formulas',
    supportedSpheres: ['business', 'government', 'team'],
    features: ['formulas', 'charts', 'pivot', 'import-export'],
  },
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    nameFr: 'Tableau de Bord',
    icon: '📈',
    description: 'KPI displays and monitoring',
    supportedSpheres: 'all',
    features: ['widgets', 'realtime', 'alerts', 'drill-down'],
  },
  diagram: {
    id: 'diagram',
    name: 'Diagram',
    nameFr: 'Diagramme',
    icon: '🔀',
    description: 'Flowcharts and architecture diagrams',
    supportedSpheres: ['business', 'studio', 'team', 'scholar'],
    features: ['shapes', 'connectors', 'templates', 'export'],
  },
  whiteboard: {
    id: 'whiteboard',
    name: 'Whiteboard',
    nameFr: 'Tableau Blanc',
    icon: '🎨',
    description: 'Free-form brainstorming space',
    supportedSpheres: 'all',
    features: ['draw', 'sticky-notes', 'infinite-canvas', 'collaborate'],
  },
  xr: {
    id: 'xr',
    name: 'XR Space',
    nameFr: 'Espace XR',
    icon: '🥽',
    description: '3D immersive environment',
    supportedSpheres: ['studio', 'entertainment', 'team', 'scholar'],
    features: ['3d-view', 'spatial', 'avatars', 'voice'],
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid',
    nameFr: 'Hybride',
    icon: '🔄',
    description: 'Combined workspace modes',
    supportedSpheres: 'all',
    features: ['split-view', 'mode-switch', 'sync'],
  },
};

// =============================================================================
// 3 HUBS STRUCTURE (Diamond Layout)
// =============================================================================

export type HubId = 'communication' | 'navigation' | 'workspace';

export interface HubConfig {
  id: HubId;
  name: string;
  nameFr: string;
  icon: string;
  position: 'left' | 'bottom' | 'right';
  description: string;
  components: string[];
}

export const HUBS: Record<HubId, HubConfig> = {
  communication: {
    id: 'communication',
    name: 'Communication',
    nameFr: 'Communication',
    icon: '💬',
    position: 'left',
    description: 'Nova chat, agents, meetings',
    components: ['NovaChat', 'AgentPanel', 'VoiceCalls', 'MeetingRoom'],
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation',
    nameFr: 'Navigation',
    icon: '🧭',
    position: 'bottom',
    description: 'Sphere selection, favorites, activity',
    components: ['SphereSelector', 'Dashboard', 'Favorites', 'ActivityFeed'],
  },
  workspace: {
    id: 'workspace',
    name: 'Workspace',
    nameFr: 'Espace de Travail',
    icon: '🗂️',
    position: 'right',
    description: 'Browser, documents, editors',
    components: ['Browser', 'Documents', 'Editors', 'Projects'],
  },
};

// =============================================================================
// DIAMOND LAYOUT POSITIONS
// =============================================================================

export interface DiamondLayoutConfig {
  center: 'logo';
  top: 'overview';
  topLeft: 'notifications';
  topRight: 'account';
  left: 'communication';
  right: 'workspace';
  bottom: 'spheres';
  bottomLeft: 'settings';
  bottomRight: 'search';
}

export const DIAMOND_LAYOUT: DiamondLayoutConfig = {
  center: 'logo',
  top: 'overview',
  topLeft: 'notifications',
  topRight: 'account',
  left: 'communication',
  right: 'workspace',
  bottom: 'spheres',
  bottomLeft: 'settings',
  bottomRight: 'search',
};

// =============================================================================
// MOBILE NAVIGATION (3 Tabs)
// =============================================================================

export type MobileTabId = 'communications' | 'hub' | 'browser';

export interface MobileTabConfig {
  id: MobileTabId;
  order: number;
  name: string;
  nameFr: string;
  icon: string;
  features: string[];
}

export const MOBILE_TABS: Record<MobileTabId, MobileTabConfig> = {
  communications: {
    id: 'communications',
    order: 1,
    name: 'Communications',
    nameFr: 'Communications',
    icon: '💬',
    features: ['nova-chat', 'agents', 'voice-calls', 'keyboard'],
  },
  hub: {
    id: 'hub',
    order: 2,
    name: 'Navigation Hub',
    nameFr: 'Hub Navigation',
    icon: '🏠',
    features: ['dashboard', 'spheres', 'favorites', 'activity'],
  },
  browser: {
    id: 'browser',
    order: 3,
    name: 'CHE·NU Browser',
    nameFr: 'Navigateur CHE·NU',
    icon: '🌐',
    features: ['chenu-protocol', 'https', 'workspace', 'documents'],
  },
};

// =============================================================================
// NAVIGATION FLOW
// =============================================================================

export interface NavigationFlow {
  from: NavigationLevel;
  to: NavigationLevel;
  trigger: string;
  animation: 'slide' | 'fade' | 'zoom' | 'morph';
}

export const NAVIGATION_FLOWS: NavigationFlow[] = [
  // L0 → L1: Select a sphere
  { from: 'L0', to: 'L1', trigger: 'sphere-click', animation: 'zoom' },
  
  // L1 → L2: Enter bureau mode
  { from: 'L1', to: 'L2', trigger: 'bureau-enter', animation: 'slide' },
  
  // L2 → L3: Open workspace
  { from: 'L2', to: 'L3', trigger: 'section-open', animation: 'fade' },
  
  // L3 → L2: Close workspace (back)
  { from: 'L3', to: 'L2', trigger: 'workspace-close', animation: 'fade' },
  
  // L2 → L1: Exit bureau
  { from: 'L2', to: 'L1', trigger: 'bureau-exit', animation: 'slide' },
  
  // L1 → L0: Return to universe
  { from: 'L1', to: 'L0', trigger: 'sphere-exit', animation: 'zoom' },
  
  // Direct jumps
  { from: 'L0', to: 'L3', trigger: 'quick-access', animation: 'morph' },
  { from: 'L3', to: 'L0', trigger: 'universe-return', animation: 'morph' },
];

// =============================================================================
// PAGES/SCREENS REGISTRY
// =============================================================================

export type ScreenId = 
  // L0 Screens
  | 'universe'
  | 'sphere-selector'
  // L1 Screens
  | 'sphere-home'
  | 'sphere-dashboard'
  // L2 Screens
  | 'bureau-main'
  | 'bureau-quickcapture'
  | 'bureau-resumeworkspace'
  | 'bureau-threads'
  | 'bureau-datafiles'
  | 'bureau-activeagents'
  | 'bureau-meetings'
  // L3 Screens
  | 'workspace-document'
  | 'workspace-board'
  | 'workspace-timeline'
  | 'workspace-spreadsheet'
  | 'workspace-dashboard'
  | 'workspace-diagram'
  | 'workspace-whiteboard'
  | 'workspace-xr'
  // Special Screens
  | 'onboarding'
  | 'settings'
  | 'profile'
  | 'notifications'
  | 'search'
  | 'help';

export interface ScreenConfig {
  id: ScreenId;
  level: NavigationLevel | 'special';
  path: string;
  name: string;
  nameFr: string;
  component: string;
  requiresAuth: boolean;
  requiresSphere: boolean;
}

export const SCREENS: Record<ScreenId, ScreenConfig> = {
  // L0 Screens
  universe: {
    id: 'universe',
    level: 'L0',
    path: '/',
    name: 'Universe',
    nameFr: 'Univers',
    component: 'UniverseView',
    requiresAuth: true,
    requiresSphere: false,
  },
  'sphere-selector': {
    id: 'sphere-selector',
    level: 'L0',
    path: '/spheres',
    name: 'Sphere Selector',
    nameFr: 'Sélecteur de Sphères',
    component: 'SphereSelectorView',
    requiresAuth: true,
    requiresSphere: false,
  },
  
  // L1 Screens
  'sphere-home': {
    id: 'sphere-home',
    level: 'L1',
    path: '/sphere/:sphereId',
    name: 'Sphere Home',
    nameFr: 'Accueil Sphère',
    component: 'SphereHomeView',
    requiresAuth: true,
    requiresSphere: true,
  },
  'sphere-dashboard': {
    id: 'sphere-dashboard',
    level: 'L1',
    path: '/sphere/:sphereId/dashboard',
    name: 'Sphere Dashboard',
    nameFr: 'Tableau de Bord Sphère',
    component: 'SphereDashboardView',
    requiresAuth: true,
    requiresSphere: true,
  },
  
  // L2 Screens - Bureau
  'bureau-main': {
    id: 'bureau-main',
    level: 'L2',
    path: '/sphere/:sphereId/bureau',
    name: 'Bureau',
    nameFr: 'Bureau',
    component: 'BureauMainView',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-quickcapture': {
    id: 'bureau-quickcapture',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/quickcapture',
    name: 'Quick Capture',
    nameFr: 'Capture Rapide',
    component: 'QuickCaptureSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-resumeworkspace': {
    id: 'bureau-resumeworkspace',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/resume',
    name: 'Resume Workspace',
    nameFr: 'Reprendre le Travail',
    component: 'ResumeWorkspaceSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-threads': {
    id: 'bureau-threads',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/threads',
    name: 'Threads',
    nameFr: 'Fils (.chenu)',
    component: 'ThreadsSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-datafiles': {
    id: 'bureau-datafiles',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/data',
    name: 'Data/Files',
    nameFr: 'Données/Fichiers',
    component: 'DataFilesSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-activeagents': {
    id: 'bureau-activeagents',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/agents',
    name: 'Active Agents',
    nameFr: 'Agents Actifs',
    component: 'ActiveAgentsSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  'bureau-meetings': {
    id: 'bureau-meetings',
    level: 'L2',
    path: '/sphere/:sphereId/bureau/meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    component: 'MeetingsSection',
    requiresAuth: true,
    requiresSphere: true,
  },
  
  // L3 Screens - Workspace modes
  'workspace-document': {
    id: 'workspace-document',
    level: 'L3',
    path: '/workspace/document/:dataSpaceId',
    name: 'Document Editor',
    nameFr: 'Éditeur de Document',
    component: 'DocumentWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-board': {
    id: 'workspace-board',
    level: 'L3',
    path: '/workspace/board/:dataSpaceId',
    name: 'Board',
    nameFr: 'Tableau',
    component: 'BoardWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-timeline': {
    id: 'workspace-timeline',
    level: 'L3',
    path: '/workspace/timeline/:dataSpaceId',
    name: 'Timeline',
    nameFr: 'Chronologie',
    component: 'TimelineWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-spreadsheet': {
    id: 'workspace-spreadsheet',
    level: 'L3',
    path: '/workspace/spreadsheet/:dataSpaceId',
    name: 'Spreadsheet',
    nameFr: 'Tableur',
    component: 'SpreadsheetWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-dashboard': {
    id: 'workspace-dashboard',
    level: 'L3',
    path: '/workspace/dashboard/:dataSpaceId',
    name: 'Dashboard',
    nameFr: 'Tableau de Bord',
    component: 'DashboardWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-diagram': {
    id: 'workspace-diagram',
    level: 'L3',
    path: '/workspace/diagram/:dataSpaceId',
    name: 'Diagram',
    nameFr: 'Diagramme',
    component: 'DiagramWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-whiteboard': {
    id: 'workspace-whiteboard',
    level: 'L3',
    path: '/workspace/whiteboard/:dataSpaceId',
    name: 'Whiteboard',
    nameFr: 'Tableau Blanc',
    component: 'WhiteboardWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  'workspace-xr': {
    id: 'workspace-xr',
    level: 'L3',
    path: '/workspace/xr/:dataSpaceId',
    name: 'XR Space',
    nameFr: 'Espace XR',
    component: 'XRWorkspace',
    requiresAuth: true,
    requiresSphere: true,
  },
  
  // Special Screens
  onboarding: {
    id: 'onboarding',
    level: 'special',
    path: '/onboarding',
    name: 'Onboarding',
    nameFr: 'Intégration',
    component: 'OnboardingView',
    requiresAuth: false,
    requiresSphere: false,
  },
  settings: {
    id: 'settings',
    level: 'special',
    path: '/settings',
    name: 'Settings',
    nameFr: 'Paramètres',
    component: 'SettingsView',
    requiresAuth: true,
    requiresSphere: false,
  },
  profile: {
    id: 'profile',
    level: 'special',
    path: '/profile',
    name: 'Profile',
    nameFr: 'Profil',
    component: 'ProfileView',
    requiresAuth: true,
    requiresSphere: false,
  },
  notifications: {
    id: 'notifications',
    level: 'special',
    path: '/notifications',
    name: 'Notifications',
    nameFr: 'Notifications',
    component: 'NotificationsView',
    requiresAuth: true,
    requiresSphere: false,
  },
  search: {
    id: 'search',
    level: 'special',
    path: '/search',
    name: 'Search',
    nameFr: 'Recherche',
    component: 'SearchView',
    requiresAuth: true,
    requiresSphere: false,
  },
  help: {
    id: 'help',
    level: 'special',
    path: '/help',
    name: 'Help',
    nameFr: 'Aide',
    component: 'HelpView',
    requiresAuth: false,
    requiresSphere: false,
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getScreensByLevel(level: NavigationLevel): ScreenConfig[] {
  return Object.values(SCREENS).filter(s => s.level === level);
}

export function getDefaultNavigationState(): NavigationState {
  return {
    level: 'L0',
    sphereId: null,
    viewMode: null,
    bureauSection: null,
    workspaceMode: null,
    dataSpaceId: null,
  };
}

export function buildPath(screen: ScreenId, params?: Record<string, string>): string {
  let path = SCREENS[screen].path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }
  return path;
}

export function getWorkspaceModesForSphere(sphereId: SphereId): WorkspaceModeConfig[] {
  return Object.values(WORKSPACE_MODES).filter(mode => 
    mode.supportedSpheres === 'all' || mode.supportedSpheres.includes(sphereId)
  );
}

// =============================================================================
// NAVIGATION STATE MACHINE
// =============================================================================

export type NavigationAction =
  | { type: 'SELECT_SPHERE'; sphereId: SphereId }
  | { type: 'ENTER_DASHBOARD' }
  | { type: 'ENTER_BUREAU' }
  | { type: 'SELECT_SECTION'; sectionId: BureauSectionId }
  | { type: 'OPEN_WORKSPACE'; mode: WorkspaceMode; dataSpaceId: string }
  | { type: 'CLOSE_WORKSPACE' }
  | { type: 'EXIT_BUREAU' }
  | { type: 'EXIT_SPHERE' }
  | { type: 'RETURN_TO_UNIVERSE' };

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'SELECT_SPHERE':
      return {
        ...state,
        level: 'L1',
        sphereId: action.sphereId,
        viewMode: null,
        bureauSection: null,
        workspaceMode: null,
        dataSpaceId: null,
      };
      
    case 'ENTER_DASHBOARD':
      return {
        ...state,
        viewMode: 'dashboard',
      };
      
    case 'ENTER_BUREAU':
      return {
        ...state,
        level: 'L2',
        viewMode: 'bureau',
        bureauSection: 'quickcapture', // Default section
      };
      
    case 'SELECT_SECTION':
      return {
        ...state,
        bureauSection: action.sectionId,
      };
      
    case 'OPEN_WORKSPACE':
      return {
        ...state,
        level: 'L3',
        workspaceMode: action.mode,
        dataSpaceId: action.dataSpaceId,
      };
      
    case 'CLOSE_WORKSPACE':
      return {
        ...state,
        level: 'L2',
        workspaceMode: null,
        dataSpaceId: null,
      };
      
    case 'EXIT_BUREAU':
      return {
        ...state,
        level: 'L1',
        viewMode: null,
        bureauSection: null,
      };
      
    case 'EXIT_SPHERE':
    case 'RETURN_TO_UNIVERSE':
      return getDefaultNavigationState();
      
    default:
      return state;
  }
}
