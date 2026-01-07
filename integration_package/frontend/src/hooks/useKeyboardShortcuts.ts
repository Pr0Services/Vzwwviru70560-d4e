/**
 * CHE·NU™ Keyboard Shortcuts Hook
 * 
 * Global keyboard shortcuts for power users.
 * Supports Command Palette (Cmd/Ctrl+K) and context-aware shortcuts.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import { useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  category: ShortcutCategory;
  action: () => void;
  enabled?: boolean;
  context?: ShortcutContext;
}

export type ShortcutCategory = 
  | 'global' 
  | 'navigation' 
  | 'threads' 
  | 'nova' 
  | 'editing'
  | 'dataspaces';

export type ShortcutContext = 
  | 'all' 
  | 'thread' 
  | 'nova' 
  | 'dataspace' 
  | 'bureau'
  | 'input';

export interface ShortcutGroup {
  category: ShortcutCategory;
  label: string;
  shortcuts: ShortcutDefinition[];
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  context?: ShortcutContext;
}

// Legacy type for backwards compatibility
type ShortcutHandler = () => void;
type ShortcutsMap = Record<string, ShortcutHandler>;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const isMac = typeof navigator !== 'undefined' 
  ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 
  : false;

export const getModifierLabel = (modifier: 'ctrl' | 'meta' | 'alt' | 'shift'): string => {
  switch (modifier) {
    case 'ctrl': return isMac ? '⌃' : 'Ctrl';
    case 'meta': return isMac ? '⌘' : 'Win';
    case 'alt': return isMac ? '⌥' : 'Alt';
    case 'shift': return isMac ? '⇧' : 'Shift';
    default: return modifier;
  }
};

export const formatShortcut = (shortcut: ShortcutDefinition): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrl || (shortcut.meta && !isMac)) parts.push(getModifierLabel('ctrl'));
  if (shortcut.meta && isMac) parts.push(getModifierLabel('meta'));
  if (shortcut.alt) parts.push(getModifierLabel('alt'));
  if (shortcut.shift) parts.push(getModifierLabel('shift'));
  
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  parts.push(key);
  
  return parts.join(isMac ? '' : '+');
};

const matchesShortcut = (event: KeyboardEvent, shortcut: ShortcutDefinition): boolean => {
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;
  
  const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
  const eventCtrlOrMeta = event.ctrlKey || event.metaKey;
  
  if (ctrlOrMeta !== eventCtrlOrMeta) return false;
  if ((shortcut.shift ?? false) !== event.shiftKey) return false;
  if ((shortcut.alt ?? false) !== event.altKey) return false;

  return true;
};

const isInputElement = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) return false;
  
  const tagName = target.tagName.toLowerCase();
  if (['input', 'textarea', 'select'].includes(tagName)) return true;
  if (target.isContentEditable) return true;
  
  return false;
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT SHORTCUTS FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export const createDefaultShortcuts = (actions: {
  openCommandPalette: () => void;
  showHelp: () => void;
  quickCapture: () => void;
  goToSphere: (index: number) => void;
  toggleBureau: () => void;
  navigateSectionLeft: () => void;
  navigateSectionRight: () => void;
  goToUniverse: () => void;
  newThread: () => void;
  sendMessage: () => void;
  attachFile: () => void;
  exportThread: () => void;
  focusNova: () => void;
  approveCheckpoint: () => void;
  rejectCheckpoint: () => void;
  closeModal: () => void;
  save: () => void;
  undo: () => void;
  redo: () => void;
}): ShortcutDefinition[] => [
  // GLOBAL
  { key: 'k', ctrl: true, description: 'Command Palette', category: 'global', action: actions.openCommandPalette },
  { key: '/', ctrl: true, description: 'Aide raccourcis', category: 'global', action: actions.showHelp },
  { key: 'p', ctrl: true, shift: true, description: 'Quick Capture', category: 'global', action: actions.quickCapture },
  { key: 'Escape', description: 'Fermer / retour', category: 'global', action: actions.closeModal },
  { key: 's', ctrl: true, description: 'Sauvegarder', category: 'global', action: actions.save, context: 'input' },

  // NAVIGATION (spheres 1-9)
  { key: '1', ctrl: true, description: 'Personal', category: 'navigation', action: () => actions.goToSphere(0) },
  { key: '2', ctrl: true, description: 'Business', category: 'navigation', action: () => actions.goToSphere(1) },
  { key: '3', ctrl: true, description: 'Government', category: 'navigation', action: () => actions.goToSphere(2) },
  { key: '4', ctrl: true, description: 'Studio', category: 'navigation', action: () => actions.goToSphere(3) },
  { key: '5', ctrl: true, description: 'Community', category: 'navigation', action: () => actions.goToSphere(4) },
  { key: '6', ctrl: true, description: 'Social', category: 'navigation', action: () => actions.goToSphere(5) },
  { key: '7', ctrl: true, description: 'Entertainment', category: 'navigation', action: () => actions.goToSphere(6) },
  { key: '8', ctrl: true, description: 'My Team', category: 'navigation', action: () => actions.goToSphere(7) },
  { key: '9', ctrl: true, description: 'Scholar', category: 'navigation', action: () => actions.goToSphere(8) },
  { key: 'b', ctrl: true, description: 'Toggle Bureau', category: 'navigation', action: actions.toggleBureau },
  { key: 'ArrowLeft', ctrl: true, description: 'Section ←', category: 'navigation', action: actions.navigateSectionLeft },
  { key: 'ArrowRight', ctrl: true, description: 'Section →', category: 'navigation', action: actions.navigateSectionRight },
  { key: 'Home', ctrl: true, description: 'Univers (L0)', category: 'navigation', action: actions.goToUniverse },

  // THREADS
  { key: 'n', ctrl: true, description: 'Nouveau thread', category: 'threads', action: actions.newThread, context: 'thread' },
  { key: 'Enter', ctrl: true, description: 'Envoyer message', category: 'threads', action: actions.sendMessage, context: 'thread' },
  { key: 'a', ctrl: true, shift: true, description: 'Attacher fichier', category: 'threads', action: actions.attachFile, context: 'thread' },
  { key: 'e', ctrl: true, description: 'Exporter', category: 'threads', action: actions.exportThread, context: 'thread' },

  // NOVA
  { key: ' ', ctrl: true, description: 'Focus Nova', category: 'nova', action: actions.focusNova },
  { key: '.', ctrl: true, description: 'Approuver checkpoint', category: 'nova', action: actions.approveCheckpoint, context: 'nova' },
  { key: ',', ctrl: true, description: 'Rejeter checkpoint', category: 'nova', action: actions.rejectCheckpoint, context: 'nova' },

  // EDITING
  { key: 'z', ctrl: true, description: 'Annuler', category: 'editing', action: actions.undo, context: 'input' },
  { key: 'z', ctrl: true, shift: true, description: 'Rétablir', category: 'editing', action: actions.redo, context: 'input' },
];

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enhanced keyboard shortcuts hook with full shortcut definitions
 */
export function useKeyboardShortcutsEnhanced(
  shortcuts: ShortcutDefinition[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { enabled = true, context = 'all' } = options;
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const isInput = isInputElement(event.target);

    for (const shortcut of shortcutsRef.current) {
      if (shortcut.enabled === false) continue;

      // Context checking
      if (shortcut.context && shortcut.context !== 'all') {
        if (shortcut.context === 'input' && !isInput) continue;
        if (shortcut.context !== 'input' && isInput) continue;
        if (shortcut.context !== context && context !== 'all') continue;
      } else {
        if (isInput && !['Escape', 'Enter'].includes(shortcut.key)) continue;
      }

      if (matchesShortcut(event, shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        return;
      }
    }
  }, [enabled, context]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Legacy hook for backwards compatibility
 */
export const useKeyboardShortcuts = (shortcuts: ShortcutsMap) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = [];
    
    if (event.metaKey || event.ctrlKey) key.push('cmd');
    if (event.shiftKey) key.push('shift');
    if (event.altKey) key.push('alt');
    
    if (!['Meta', 'Control', 'Shift', 'Alt'].includes(event.key)) {
      key.push(event.key.toLowerCase());
    }
    
    const combo = key.join('+');
    const handler = shortcuts[combo];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export const getGroupedShortcuts = (shortcuts: ShortcutDefinition[]): ShortcutGroup[] => {
  const groups: Record<ShortcutCategory, ShortcutDefinition[]> = {
    global: [], navigation: [], threads: [], nova: [], editing: [], dataspaces: [],
  };

  shortcuts.forEach(s => groups[s.category].push(s));

  const labels: Record<ShortcutCategory, string> = {
    global: 'Global', navigation: 'Navigation', threads: 'Threads',
    nova: 'Nova', editing: 'Édition', dataspaces: 'DataSpaces',
  };

  return Object.entries(groups)
    .filter(([_, shortcuts]) => shortcuts.length > 0)
    .map(([category, shortcuts]) => ({
      category: category as ShortcutCategory,
      label: labels[category as ShortcutCategory],
      shortcuts,
    }));
};

export default useKeyboardShortcuts;
