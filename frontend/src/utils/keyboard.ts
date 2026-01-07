// CHE·NU™ Keyboard Shortcuts System
// Comprehensive keyboard navigation and shortcuts

import { useEffect, useCallback, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';
type KeyCode = string;

interface ShortcutConfig {
  key: KeyCode;
  modifiers?: ModifierKey[];
  description: string;
  category: ShortcutCategory;
  action: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  global?: boolean;
}

type ShortcutCategory =
  | 'navigation'
  | 'editing'
  | 'actions'
  | 'threads'
  | 'tasks'
  | 'search'
  | 'view'
  | 'help'
  | 'system';

interface ShortcutGroup {
  category: ShortcutCategory;
  label: string;
  shortcuts: ShortcutDisplay[];
}

interface ShortcutDisplay {
  keys: string;
  description: string;
}

interface KeyboardEvent {
  key: string;
  code: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const MODIFIER_MAP: Record<ModifierKey, keyof KeyboardEvent> = {
  ctrl: 'ctrlKey',
  alt: 'altKey',
  shift: 'shiftKey',
  meta: 'metaKey',
};

const KEY_DISPLAY_MAP: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↵',
  Escape: 'Esc',
  Backspace: '⌫',
  Delete: 'Del',
  Tab: '⇥',
  Space: '␣',
  ' ': '␣',
};

const MODIFIER_DISPLAY: Record<ModifierKey, string> = {
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  meta: '⌘',
};

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// ============================================================
// SHORTCUT MANAGER CLASS
// ============================================================

class ShortcutManager {
  private shortcuts: Map<string, ShortcutConfig> = new Map();
  private listeners: Set<(event: KeyboardEvent) => void> = new Set();
  private enabled: boolean = true;
  private scopeStack: string[] = ['global'];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private generateKey(config: ShortcutConfig): string {
    const modifiers = (config.modifiers || []).sort().join('+');
    return modifiers ? `${modifiers}+${config.key.toLowerCase()}` : config.key.toLowerCase();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    // Skip if typing in input/textarea unless global
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    // Build the key combination
    const modifiers: ModifierKey[] = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const key = this.generateKey({
      key: event.key,
      modifiers,
      description: '',
      category: 'system',
      action: () => {},
    });

    const shortcut = this.shortcuts.get(key);

    if (shortcut && shortcut.enabled !== false) {
      // Check if we should handle this shortcut
      if (isInput && !shortcut.global) return;

      if (shortcut.preventDefault !== false) {
        event.preventDefault();
      }
      if (shortcut.stopPropagation) {
        event.stopPropagation();
      }

      shortcut.action();
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(event));
  }

  register(config: ShortcutConfig): () => void {
    const key = this.generateKey(config);
    this.shortcuts.set(key, config);
    
    return () => {
      this.shortcuts.delete(key);
    };
  }

  registerMany(configs: ShortcutConfig[]): () => void {
    const unregisters = configs.map((config) => this.register(config));
    return () => {
      unregisters.forEach((unregister) => unregister());
    };
  }

  unregister(key: KeyCode, modifiers?: ModifierKey[]): void {
    const shortcutKey = this.generateKey({
      key,
      modifiers,
      description: '',
      category: 'system',
      action: () => {},
    });
    this.shortcuts.delete(shortcutKey);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  addListener(listener: (event: KeyboardEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  pushScope(scope: string): void {
    this.scopeStack.push(scope);
  }

  popScope(): string | undefined {
    if (this.scopeStack.length > 1) {
      return this.scopeStack.pop();
    }
    return undefined;
  }

  getCurrentScope(): string {
    return this.scopeStack[this.scopeStack.length - 1];
  }

  getShortcuts(): ShortcutConfig[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcutsByCategory(category: ShortcutCategory): ShortcutConfig[] {
    return this.getShortcuts().filter((s) => s.category === category);
  }

  formatShortcut(config: ShortcutConfig): string {
    const parts: string[] = [];
    
    if (config.modifiers) {
      config.modifiers.forEach((mod) => {
        parts.push(MODIFIER_DISPLAY[mod]);
      });
    }
    
    const keyDisplay = KEY_DISPLAY_MAP[config.key] || config.key.toUpperCase();
    parts.push(keyDisplay);
    
    return parts.join('');
  }

  getShortcutGroups(): ShortcutGroup[] {
    const categories: Record<ShortcutCategory, string> = {
      navigation: 'Navigation',
      editing: 'Editing',
      actions: 'Actions',
      threads: 'Threads',
      tasks: 'Tasks',
      search: 'Search',
      view: 'View',
      help: 'Help',
      system: 'System',
    };

    const groups: ShortcutGroup[] = [];

    Object.entries(categories).forEach(([category, label]) => {
      const shortcuts = this.getShortcutsByCategory(category as ShortcutCategory);
      if (shortcuts.length > 0) {
        groups.push({
          category: category as ShortcutCategory,
          label,
          shortcuts: shortcuts.map((s) => ({
            keys: this.formatShortcut(s),
            description: s.description,
          })),
        });
      }
    });

    return groups;
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    this.shortcuts.clear();
    this.listeners.clear();
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

export const shortcutManager = new ShortcutManager();

// ============================================================
// REACT HOOKS
// ============================================================

export function useKeyboardShortcut(
  key: KeyCode,
  action: () => void,
  options: {
    modifiers?: ModifierKey[];
    description?: string;
    category?: ShortcutCategory;
    enabled?: boolean;
    preventDefault?: boolean;
    global?: boolean;
  } = {}
): void {
  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    if (options.enabled === false) return;

    const config: ShortcutConfig = {
      key,
      modifiers: options.modifiers,
      description: options.description || '',
      category: options.category || 'actions',
      action: () => actionRef.current(),
      preventDefault: options.preventDefault,
      global: options.global,
    };

    return shortcutManager.register(config);
  }, [key, options.modifiers?.join(','), options.enabled, options.category]);
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]): void {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const configs = shortcutsRef.current.map((s) => ({
      ...s,
      action: () => s.action(),
    }));

    return shortcutManager.registerMany(configs);
  }, [shortcuts.length]);
}

export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler as any);
    window.addEventListener('keyup', upHandler as any);

    return () => {
      window.removeEventListener('keydown', downHandler as any);
      window.removeEventListener('keyup', upHandler as any);
    };
  }, [targetKey]);

  return pressed;
}

export function useHotkeys(
  keys: string,
  callback: (event: KeyboardEvent) => void,
  deps: unknown[] = []
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const parseKeys = (keyString: string): { key: string; modifiers: ModifierKey[] } => {
      const parts = keyString.toLowerCase().split('+');
      const modifiers: ModifierKey[] = [];
      let key = '';

      parts.forEach((part) => {
        if (part === 'ctrl' || part === 'control') {
          modifiers.push('ctrl');
        } else if (part === 'alt' || part === 'option') {
          modifiers.push('alt');
        } else if (part === 'shift') {
          modifiers.push('shift');
        } else if (part === 'meta' || part === 'cmd' || part === 'command') {
          modifiers.push('meta');
        } else {
          key = part;
        }
      });

      return { key, modifiers };
    };

    const { key, modifiers } = parseKeys(keys);

    const config: ShortcutConfig = {
      key,
      modifiers,
      description: '',
      category: 'actions',
      action: () => callbackRef.current({} as KeyboardEvent),
      global: true,
    };

    return shortcutManager.register(config);
  }, [keys, ...deps]);
}

export function useShortcutScope(scope: string): void {
  useEffect(() => {
    shortcutManager.pushScope(scope);
    return () => {
      shortcutManager.popScope();
    };
  }, [scope]);
}

// Missing useState import workaround
function useState<T>(initial: T): [T, (value: T) => void] {
  const ref = useRef(initial);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  
  const setState = useCallback((value: T) => {
    ref.current = value;
    forceUpdate();
  }, []);
  
  return [ref.current, setState];
}

function useReducer<T>(reducer: (state: T) => T, initial: T): [T, () => void] {
  const state = useRef(initial);
  const [, setTick] = useRefresh();
  
  const dispatch = useCallback(() => {
    state.current = reducer(state.current);
    setTick();
  }, [reducer]);
  
  return [state.current, dispatch];
}

function useRefresh(): [number, () => void] {
  const tick = useRef(0);
  const mounted = useRef(true);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  
  const refresh = useCallback(() => {
    if (mounted.current) {
      tick.current += 1;
    }
  }, []);
  
  return [tick.current, refresh];
}

// ============================================================
// DEFAULT SHORTCUTS
// ============================================================

export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  // Navigation
  {
    key: 'g',
    modifiers: ['ctrl'],
    description: 'Go to...',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'h',
    modifiers: ['ctrl'],
    description: 'Go to Home',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '1',
    modifiers: ['ctrl'],
    description: 'Go to Personal sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '2',
    modifiers: ['ctrl'],
    description: 'Go to Business sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '3',
    modifiers: ['ctrl'],
    description: 'Go to Government sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '4',
    modifiers: ['ctrl'],
    description: 'Go to Studio sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '5',
    modifiers: ['ctrl'],
    description: 'Go to Community sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '6',
    modifiers: ['ctrl'],
    description: 'Go to Social sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '7',
    modifiers: ['ctrl'],
    description: 'Go to Entertainment sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '8',
    modifiers: ['ctrl'],
    description: 'Go to My Team sphere',
    category: 'navigation',
    action: () => { /* TODO */ },
    global: true,
  },

  // Search
  {
    key: 'k',
    modifiers: ['ctrl'],
    description: 'Open command palette',
    category: 'search',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '/',
    description: 'Focus search',
    category: 'search',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'f',
    modifiers: ['ctrl'],
    description: 'Search in current view',
    category: 'search',
    action: () => { /* TODO */ },
    global: true,
  },

  // Threads
  {
    key: 'n',
    modifiers: ['ctrl'],
    description: 'New thread',
    category: 'threads',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'Enter',
    modifiers: ['ctrl'],
    description: 'Send message',
    category: 'threads',
    action: () => { /* TODO */ },
  },
  {
    key: 'e',
    modifiers: ['ctrl'],
    description: 'Toggle encoding',
    category: 'threads',
    action: () => { /* TODO */ },
  },

  // Tasks
  {
    key: 't',
    modifiers: ['ctrl'],
    description: 'New task',
    category: 'tasks',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'd',
    modifiers: ['ctrl'],
    description: 'Mark task done',
    category: 'tasks',
    action: () => { /* TODO */ },
  },

  // Actions
  {
    key: 's',
    modifiers: ['ctrl'],
    description: 'Save',
    category: 'actions',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'z',
    modifiers: ['ctrl'],
    description: 'Undo',
    category: 'actions',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'z',
    modifiers: ['ctrl', 'shift'],
    description: 'Redo',
    category: 'actions',
    action: () => { /* TODO */ },
    global: true,
  },

  // View
  {
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle sidebar',
    category: 'view',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: '\\',
    modifiers: ['ctrl'],
    description: 'Toggle right panel',
    category: 'view',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'F11',
    description: 'Toggle fullscreen',
    category: 'view',
    action: () => { /* TODO */ },
    global: true,
  },

  // Help
  {
    key: '?',
    modifiers: ['shift'],
    description: 'Show keyboard shortcuts',
    category: 'help',
    action: () => { /* TODO */ },
    global: true,
  },
  {
    key: 'F1',
    description: 'Open help',
    category: 'help',
    action: () => { /* TODO */ },
    global: true,
  },

  // System
  {
    key: 'Escape',
    description: 'Close modal / Cancel',
    category: 'system',
    action: () => { /* TODO */ },
    global: true,
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function formatKeyCombo(
  key: string,
  modifiers: ModifierKey[] = [],
  platform: 'mac' | 'win' = isMac ? 'mac' : 'win'
): string {
  const modSymbols: Record<ModifierKey, Record<'mac' | 'win', string>> = {
    ctrl: { mac: '⌃', win: 'Ctrl' },
    alt: { mac: '⌥', win: 'Alt' },
    shift: { mac: '⇧', win: 'Shift' },
    meta: { mac: '⌘', win: 'Win' },
  };

  const parts = modifiers.map((mod) => modSymbols[mod][platform]);
  const keyDisplay = KEY_DISPLAY_MAP[key] || key.toUpperCase();
  parts.push(keyDisplay);

  return platform === 'mac' ? parts.join('') : parts.join('+');
}

export function parseKeyCombo(combo: string): { key: string; modifiers: ModifierKey[] } {
  const parts = combo.toLowerCase().split('+');
  const modifiers: ModifierKey[] = [];
  let key = '';

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (['ctrl', 'control', '⌃'].includes(trimmed)) {
      modifiers.push('ctrl');
    } else if (['alt', 'option', '⌥'].includes(trimmed)) {
      modifiers.push('alt');
    } else if (['shift', '⇧'].includes(trimmed)) {
      modifiers.push('shift');
    } else if (['meta', 'cmd', 'command', '⌘', 'win'].includes(trimmed)) {
      modifiers.push('meta');
    } else {
      key = trimmed;
    }
  });

  return { key, modifiers };
}

export function isModifierKey(key: string): boolean {
  return ['Control', 'Alt', 'Shift', 'Meta'].includes(key);
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ModifierKey,
  KeyCode,
  ShortcutConfig,
  ShortcutCategory,
  ShortcutGroup,
  ShortcutDisplay,
};

export { ShortcutManager, isMac, MODIFIER_DISPLAY, KEY_DISPLAY_MAP };

export default shortcutManager;
