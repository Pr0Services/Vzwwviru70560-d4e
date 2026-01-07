/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — COMMAND PALETTE TYPES
   Unified Search & Quick Actions System
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// CORE TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type CommandCategory = 
  | 'navigation'    // Go to sphere, section, page
  | 'action'        // Create, edit, delete
  | 'search'        // Search results
  | 'recent'        // Recent items
  | 'agent'         // Agent commands
  | 'thread'        // Thread operations
  | 'settings'      // Settings & preferences
  | 'help';         // Help & documentation

export type CommandPriority = 'high' | 'medium' | 'low';

export interface CommandItem {
  id: string;
  title: string;
  titleFr?: string;
  subtitle?: string;
  subtitleFr?: string;
  category: CommandCategory;
  icon: string;
  keywords: string[];
  shortcut?: string;
  priority: CommandPriority;
  sphereId?: string;
  sectionId?: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface SearchResult {
  id: string;
  type: 'thread' | 'document' | 'task' | 'project' | 'meeting' | 'agent' | 'dataspace';
  title: string;
  subtitle: string;
  icon: string;
  sphereId: string;
  sphereName: string;
  score: number;
  highlight?: string;
  timestamp?: Date;
  action: () => void;
}

export interface RecentItem {
  id: string;
  type: SearchResult['type'];
  title: string;
  sphereId: string;
  sphereName: string;
  icon: string;
  timestamp: Date;
  action: () => void;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  activeCategory: CommandCategory | 'all';
  selectedIndex: number;
  isLoading: boolean;
  results: CommandItem[];
  searchResults: SearchResult[];
  recentItems: RecentItem[];
}

export interface CommandPaletteActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  setCategory: (category: CommandCategory | 'all') => void;
  selectItem: (index: number) => void;
  executeSelected: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  clearRecent: () => void;
}

// ════════════════════════════════════════════════════════════════════════════════
// SEARCH API TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface SearchQuery {
  query: string;
  sphereIds?: string[];
  types?: SearchResult['type'][];
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  took: number; // ms
  hasMore: boolean;
}

// ════════════════════════════════════════════════════════════════════════════════
// COMMAND REGISTRY TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface CommandRegistryOptions {
  sphereId?: string;
  userRole?: 'admin' | 'user' | 'guest';
  enabledFeatures?: string[];
}

export interface CommandGroup {
  id: string;
  title: string;
  titleFr: string;
  icon: string;
  commands: CommandItem[];
}

// ════════════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════════════════════════════════════

export interface KeyboardShortcut {
  key: string;
  meta?: boolean;   // ⌘ on Mac, Ctrl on Windows
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  descriptionFr: string;
  action: () => void;
  global?: boolean; // Works even when palette is closed
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'k',
    meta: true,
    description: 'Open command palette',
    descriptionFr: 'Ouvrir la palette de commandes',
    action: () => {},
    global: true,
  },
  {
    key: 'Escape',
    description: 'Close palette',
    descriptionFr: 'Fermer la palette',
    action: () => {},
  },
  {
    key: 'ArrowUp',
    description: 'Navigate up',
    descriptionFr: 'Naviguer vers le haut',
    action: () => {},
  },
  {
    key: 'ArrowDown',
    description: 'Navigate down',
    descriptionFr: 'Naviguer vers le bas',
    action: () => {},
  },
  {
    key: 'Enter',
    description: 'Execute command',
    descriptionFr: 'Exécuter la commande',
    action: () => {},
  },
  {
    key: 'Tab',
    description: 'Next category',
    descriptionFr: 'Catégorie suivante',
    action: () => {},
  },
];
