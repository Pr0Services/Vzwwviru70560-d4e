/**
 * CHE·NU — Expert Mode Hook
 * ============================================================
 * Manages expert mode state, shortcuts, and command palette.
 * 
 * Principles:
 * - Removes friction, not rules
 * - Final confirmation always required
 * - Never bypasses governance
 * - Can be disabled at any time
 * 
 * @version 1.0.0
 * @frozen true
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface ExpertModeConditions {
  completedActions: number;          // Must be > 0
  hasAcceptedProposals: boolean;     // Must be true
  hasRejectedProposals: boolean;     // Shows informed decisions
  orchestratorActive: boolean;       // Must be true
  explicitOptIn: boolean;            // Must be true
}

export interface ExpertModePreferences {
  defaultScope: 'selection' | 'document' | 'workspace' | null;
  defaultBudgetPreset: 'eco' | 'balanced' | 'pro' | null;
  defaultModel: string | null;
  reducedVerbosity: boolean;
}

export interface KeyboardShortcut {
  key: string;
  modifiers: ('meta' | 'ctrl' | 'shift' | 'alt')[];
  action: string;
  description: string;
  enabled: boolean;
}

export interface CommandPaletteCommand {
  id: string;
  name: string;
  description: string;
  action: () => void;
  keywords: string[];
}

export interface UseExpertModeReturn {
  // State
  isEnabled: boolean;
  isEligible: boolean;
  conditions: ExpertModeConditions;
  preferences: ExpertModePreferences;
  
  // Command Palette
  isCommandPaletteOpen: boolean;
  commandPaletteSearch: string;
  filteredCommands: CommandPaletteCommand[];
  
  // Shortcuts
  shortcuts: KeyboardShortcut[];
  
  // Condition Tracking
  recordCompletedAction: () => void;
  recordAcceptedProposal: () => void;
  recordRejectedProposal: () => void;
  setOrchestratorActive: (active: boolean) => void;
  
  // Enable/Disable
  enable: () => void;
  disable: () => void;
  
  // Command Palette
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setCommandPaletteSearch: (search: string) => void;
  executeCommand: (commandId: string) => void;
  
  // Preferences
  updatePreferences: (prefs: Partial<ExpertModePreferences>) => void;
  
  // Confirmation Behavior
  shouldSkipExplanation: (actionType: string) => boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'chenu_expert_mode';
const PREFERENCES_KEY = 'chenu_expert_preferences';
const MIN_COMPLETED_ACTIONS = 3;

// ============================================================
// SHORTCUTS
// ============================================================

const EXPERT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'Enter',
    modifiers: ['meta'],
    action: 'confirm_proposal',
    description: 'Confirm proposal',
    enabled: true
  },
  {
    key: 's',
    modifiers: ['meta', 'shift'],
    action: 'prepare_structured',
    description: 'Prepare structured version',
    enabled: true
  },
  {
    key: 'k',
    modifiers: ['meta'],
    action: 'open_command_palette',
    description: 'Open command palette',
    enabled: true
  },
  {
    key: 'Escape',
    modifiers: [],
    action: 'cancel',
    description: 'Cancel / Dismiss',
    enabled: true
  }
];

// ============================================================
// DEFAULT COMMANDS
// ============================================================

const DEFAULT_COMMANDS: Omit<CommandPaletteCommand, 'action'>[] = [
  {
    id: 'structure_selection',
    name: 'Structure selection',
    description: 'Organize selected content',
    keywords: ['structure', 'organize', 'format']
  },
  {
    id: 'summarize_document',
    name: 'Summarize document',
    description: 'Create a summary of the current document',
    keywords: ['summarize', 'summary', 'tldr']
  },
  {
    id: 'prepare_meeting_notes',
    name: 'Prepare meeting notes',
    description: 'Structure content as meeting notes',
    keywords: ['meeting', 'notes', 'minutes']
  },
  {
    id: 'compare_versions',
    name: 'Compare versions',
    description: 'Show differences between versions',
    keywords: ['compare', 'diff', 'versions']
  },
  {
    id: 'extract_action_items',
    name: 'Extract action items',
    description: 'Find and list action items',
    keywords: ['action', 'items', 'tasks', 'todo']
  }
];

// ============================================================
// NOVA MESSAGES
// ============================================================

export const NOVA_EXPERT_MESSAGES = {
  enable: `Expert Mode reduces confirmation steps
but never removes governance.
You remain in control.`,

  disable: `Expert Mode disabled. All safeguards remain active.`
};

// ============================================================
// HOOK
// ============================================================

export function useExpertMode(
  onCommandExecute?: (commandId: string) => void
): UseExpertModeReturn {
  
  // ============================================================
  // STATE
  // ============================================================
  
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).enabled : false;
    } catch {
      return false;
    }
  });
  
  const [conditions, setConditions] = useState<ExpertModeConditions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.conditions || getDefaultConditions();
      }
    } catch {}
    return getDefaultConditions();
  });
  
  const [preferences, setPreferences] = useState<ExpertModePreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      return saved ? JSON.parse(saved) : getDefaultPreferences();
    } catch {
      return getDefaultPreferences();
    }
  });
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteSearch, setCommandPaletteSearch] = useState('');
  
  // Track action types for explanation skipping
  const [actionHistory, setActionHistory] = useState<Map<string, number>>(new Map());
  
  // ============================================================
  // HELPERS
  // ============================================================
  
  function getDefaultConditions(): ExpertModeConditions {
    return {
      completedActions: 0,
      hasAcceptedProposals: false,
      hasRejectedProposals: false,
      orchestratorActive: false,
      explicitOptIn: false
    };
  }
  
  function getDefaultPreferences(): ExpertModePreferences {
    return {
      defaultScope: null,
      defaultBudgetPreset: null,
      defaultModel: null,
      reducedVerbosity: true
    };
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enabled: isEnabled,
      conditions
    }));
  }, [isEnabled, conditions]);
  
  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);
  
  // ============================================================
  // COMPUTED
  // ============================================================
  
  const isEligible = useMemo(() => {
    return (
      conditions.completedActions >= MIN_COMPLETED_ACTIONS &&
      conditions.hasAcceptedProposals &&
      conditions.orchestratorActive
    );
  }, [conditions]);
  
  const shortcuts = useMemo(() => {
    if (!isEnabled) return [];
    return EXPERT_SHORTCUTS;
  }, [isEnabled]);
  
  const filteredCommands = useMemo(() => {
    if (!isEnabled) return [];
    
    const search = commandPaletteSearch.toLowerCase();
    
    return DEFAULT_COMMANDS
      .filter(cmd => {
        if (!search) return true;
        return (
          cmd.name.toLowerCase().includes(search) ||
          cmd.description.toLowerCase().includes(search) ||
          cmd.keywords.some(k => k.includes(search))
        );
      })
      .map(cmd => ({
        ...cmd,
        action: () => executeCommand(cmd.id)
      }));
  }, [isEnabled, commandPaletteSearch]);
  
  // ============================================================
  // CONDITION TRACKING
  // ============================================================
  
  const recordCompletedAction = useCallback(() => {
    setConditions(prev => ({
      ...prev,
      completedActions: prev.completedActions + 1
    }));
  }, []);
  
  const recordAcceptedProposal = useCallback(() => {
    setConditions(prev => ({
      ...prev,
      hasAcceptedProposals: true,
      completedActions: prev.completedActions + 1
    }));
  }, []);
  
  const recordRejectedProposal = useCallback(() => {
    setConditions(prev => ({
      ...prev,
      hasRejectedProposals: true,
      completedActions: prev.completedActions + 1
    }));
  }, []);
  
  const setOrchestratorActive = useCallback((active: boolean) => {
    setConditions(prev => ({
      ...prev,
      orchestratorActive: active
    }));
  }, []);
  
  // ============================================================
  // ENABLE/DISABLE
  // ============================================================
  
  const enable = useCallback(() => {
    if (!isEligible) {
      logger.warn('[ExpertMode] Cannot enable - conditions not met');
      return;
    }
    
    setConditions(prev => ({ ...prev, explicitOptIn: true }));
    setIsEnabled(true);
    // logger.debug('[ExpertMode] Enabled');
  }, [isEligible]);
  
  const disable = useCallback(() => {
    setIsEnabled(false);
    // logger.debug('[ExpertMode] Disabled');
  }, []);
  
  // ============================================================
  // COMMAND PALETTE
  // ============================================================
  
  const openCommandPalette = useCallback(() => {
    if (!isEnabled) return;
    setIsCommandPaletteOpen(true);
    setCommandPaletteSearch('');
  }, [isEnabled]);
  
  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
    setCommandPaletteSearch('');
  }, []);
  
  const executeCommand = useCallback((commandId: string) => {
    // logger.debug('[ExpertMode] Execute command:', commandId);
    closeCommandPalette();
    
    if (onCommandExecute) {
      onCommandExecute(commandId);
    }
  }, [closeCommandPalette, onCommandExecute]);
  
  // ============================================================
  // KEYBOARD HANDLING
  // ============================================================
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }
      
      // Close command palette: Escape
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        closeCommandPalette();
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, isCommandPaletteOpen, openCommandPalette, closeCommandPalette]);
  
  // ============================================================
  // PREFERENCES
  // ============================================================
  
  const updatePreferences = useCallback((prefs: Partial<ExpertModePreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);
  
  // ============================================================
  // CONFIRMATION BEHAVIOR
  // ============================================================
  
  const shouldSkipExplanation = useCallback((actionType: string): boolean => {
    if (!isEnabled) return false;
    
    // Count how many times this action has been done
    const count = actionHistory.get(actionType) || 0;
    
    // Skip explanation after 2+ times
    return count >= 2;
  }, [isEnabled, actionHistory]);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    isEnabled,
    isEligible,
    conditions,
    preferences,
    isCommandPaletteOpen,
    commandPaletteSearch,
    filteredCommands,
    shortcuts,
    recordCompletedAction,
    recordAcceptedProposal,
    recordRejectedProposal,
    setOrchestratorActive,
    enable,
    disable,
    openCommandPalette,
    closeCommandPalette,
    setCommandPaletteSearch,
    executeCommand,
    updatePreferences,
    shouldSkipExplanation
  };
}

export default useExpertMode;
