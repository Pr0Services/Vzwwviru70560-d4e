/* =====================================================
   CHEÂ·NU â€” Role Preset React Hook
   
   React hook for managing roles and preset advisor.
   ===================================================== */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import {
  UserRole,
  RoleState,
  RoleEvent,
  PresetAdvisorContext,
  PresetRecommendation,
  AdvisorLogEntry,
} from './rolePreset.types';

import {
  DEFAULT_ROLE_STATE,
  getRoleById,
  createRole,
  cloneRole,
} from './rolePreset.defaults';

import {
  getSuggestedPresetForRole,
  getAllowedPresetsForRole,
  isPresetAllowedForRole,
  recommendPresets,
  createAdvisorLogEntry,
  acceptAdvisorSuggestion,
  calculateAcceptanceRate,
  getMostAcceptedPresets,
  reduceRoleState,
  createDefaultAdvisorContext,
  getTimeOfDay,
} from './rolePreset.engine';

import { CheNuPreset } from '../presets/preset.types';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STORAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STORAGE_KEY = 'che-nu.roles';

/**
 * Load role state from localStorage.
 */
function loadRoleState(): RoleState {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_ROLE_STATE;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_ROLE_STATE;
    
    const parsed = JSON.parse(stored);
    
    // Merge with defaults to ensure new roles are included
    const systemRoles = DEFAULT_ROLE_STATE.roles.filter(r => r.isSystem);
    const customRoles = (parsed.roles || []).filter((r: UserRole) => !r.isSystem);
    
    return {
      ...DEFAULT_ROLE_STATE,
      ...parsed,
      roles: [...systemRoles, ...customRoles],
    };
  } catch {
    return DEFAULT_ROLE_STATE;
  }
}

/**
 * Save role state to localStorage.
 */
function saveRoleState(state: RoleState): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const toSave = {
      roles: state.roles.filter(r => !r.isSystem),
      activeRoleId: state.activeRoleId,
      roleHistory: state.roleHistory.slice(0, 20),
      advisorLog: state.advisorLog.slice(0, 50),
      advisorEnabled: state.advisorEnabled,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    logger.warn('Failed to save role state:', error);
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CONTEXT
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface RoleContextValue {
  // State
  state: RoleState;
  activeRole: UserRole | null;
  recommendations: PresetRecommendation[];
  advisorContext: PresetAdvisorContext;
  
  // Role actions
  selectRole: (roleId: string) => void;
  clearRole: () => void;
  createCustomRole: (role: Partial<UserRole>) => UserRole | null;
  updateRole: (role: UserRole) => void;
  deleteRole: (roleId: string) => boolean;
  duplicateRole: (roleId: string) => UserRole | null;
  
  // Preset integration
  getSuggestedPreset: (presets: CheNuPreset[]) => CheNuPreset | undefined;
  getAllowedPresets: (presets: CheNuPreset[]) => CheNuPreset[];
  isPresetAllowed: (presetId: string) => boolean;
  
  // Advisor
  updateAdvisorContext: (updates: Partial<PresetAdvisorContext>) => void;
  acceptRecommendation: (presetId: string) => void;
  dismissRecommendation: () => void;
  toggleAdvisor: () => void;
  getAcceptanceRate: () => number;
  
  // Utilities
  getRole: (roleId: string) => UserRole | undefined;
  refreshRecommendations: () => void;
}

const RoleReactContext = createContext<RoleContextValue | null>(null);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROVIDER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface RoleProviderProps {
  children: ReactNode;
  allPresets: CheNuPreset[];
  onPresetSelected?: (presetId: string) => void;
}

export function RoleProvider({
  children,
  allPresets,
  onPresetSelected,
}: RoleProviderProps) {
  // State
  const [state, setState] = useState<RoleState>(loadRoleState);
  const [advisorContext, setAdvisorContext] = useState<PresetAdvisorContext>(
    createDefaultAdvisorContext
  );
  const [recommendations, setRecommendations] = useState<PresetRecommendation[]>([]);
  const [pendingLogEntry, setPendingLogEntry] = useState<AdvisorLogEntry | null>(null);
  
  // â”€â”€â”€ Dispatch â”€â”€â”€
  const dispatch = useCallback((event: RoleEvent) => {
    setState(prev => {
      const next = reduceRoleState(prev, event);
      saveRoleState(next);
      return next;
    });
  }, []);
  
  // â”€â”€â”€ Active role â”€â”€â”€
  const activeRole = useMemo(() => {
    if (!state.activeRoleId) return null;
    return getRoleById(state.roles, state.activeRoleId) || null;
  }, [state.roles, state.activeRoleId]);
  
  // â”€â”€â”€ Select role â”€â”€â”€
  const selectRole = useCallback((roleId: string) => {
    const role = getRoleById(state.roles, roleId);
    if (!role) {
      logger.warn(`Role not found: ${roleId}`);
      return;
    }
    
    dispatch({ type: 'ROLE_SELECTED', roleId });
    
    // Auto-select default preset if available
    if (role.defaultPresetId && onPresetSelected) {
      onPresetSelected(role.defaultPresetId);
    }
  }, [state.roles, dispatch, onPresetSelected]);
  
  // â”€â”€â”€ Clear role â”€â”€â”€
  const clearRole = useCallback(() => {
    dispatch({ type: 'ROLE_CLEARED' });
  }, [dispatch]);
  
  // â”€â”€â”€ Create custom role â”€â”€â”€
  const createCustomRole = useCallback((partial: Partial<UserRole>): UserRole | null => {
    if (!partial.id || !partial.label) {
      logger.warn('Role requires id and label');
      return null;
    }
    
    if (getRoleById(state.roles, partial.id)) {
      logger.warn(`Role with ID "${partial.id}" already exists`);
      return null;
    }
    
    const role = createRole(partial as any);
    dispatch({ type: 'ROLE_CREATED', role });
    
    return role;
  }, [state.roles, dispatch]);
  
  // â”€â”€â”€ Update role â”€â”€â”€
  const updateRole = useCallback((role: UserRole) => {
    const existing = getRoleById(state.roles, role.id);
    if (existing?.isSystem) {
      logger.warn('Cannot update system roles');
      return;
    }
    
    dispatch({ 
      type: 'ROLE_UPDATED', 
      role: { ...role, updatedAt: Date.now() } 
    });
  }, [state.roles, dispatch]);
  
  // â”€â”€â”€ Delete role â”€â”€â”€
  const deleteRole = useCallback((roleId: string): boolean => {
    const role = getRoleById(state.roles, roleId);
    
    if (!role) {
      logger.warn(`Role not found: ${roleId}`);
      return false;
    }
    
    if (role.isSystem) {
      logger.warn('Cannot delete system roles');
      return false;
    }
    
    dispatch({ type: 'ROLE_DELETED', roleId });
    return true;
  }, [state.roles, dispatch]);
  
  // â”€â”€â”€ Duplicate role â”€â”€â”€
  const duplicateRole = useCallback((roleId: string): UserRole | null => {
    const source = getRoleById(state.roles, roleId);
    if (!source) {
      logger.warn(`Role not found: ${roleId}`);
      return null;
    }
    
    let newId = `${roleId}-copy`;
    let counter = 1;
    while (getRoleById(state.roles, newId)) {
      newId = `${roleId}-copy-${counter++}`;
    }
    
    const cloned = cloneRole(source, newId);
    dispatch({ type: 'ROLE_CREATED', role: cloned });
    
    return cloned;
  }, [state.roles, dispatch]);
  
  // â”€â”€â”€ Get suggested preset â”€â”€â”€
  const getSuggestedPreset = useCallback((presets: CheNuPreset[]) => {
    if (!activeRole) return undefined;
    return getSuggestedPresetForRole(activeRole, presets);
  }, [activeRole]);
  
  // â”€â”€â”€ Get allowed presets â”€â”€â”€
  const getAllowedPresets = useCallback((presets: CheNuPreset[]) => {
    if (!activeRole) return presets;
    return getAllowedPresetsForRole(activeRole, presets);
  }, [activeRole]);
  
  // â”€â”€â”€ Is preset allowed â”€â”€â”€
  const isPresetAllowed = useCallback((presetId: string) => {
    if (!activeRole) return true;
    return isPresetAllowedForRole(activeRole, presetId);
  }, [activeRole]);
  
  // â”€â”€â”€ Update advisor context â”€â”€â”€
  const updateAdvisorContext = useCallback((updates: Partial<PresetAdvisorContext>) => {
    setAdvisorContext(prev => ({ ...prev, ...updates }));
  }, []);
  
  // â”€â”€â”€ Refresh recommendations â”€â”€â”€
  const refreshRecommendations = useCallback(() => {
    if (!state.advisorEnabled) {
      setRecommendations([]);
      return;
    }
    
    const contextWithRole = {
      ...advisorContext,
      activeRole: state.activeRoleId || undefined,
    };
    
    const recs = recommendPresets(contextWithRole);
    setRecommendations(recs);
    
    // Create log entry for this recommendation
    if (recs.length > 0) {
      const entry = createAdvisorLogEntry(
        recs.map(r => r.presetId),
        contextWithRole
      );
      setPendingLogEntry(entry);
    }
  }, [state.advisorEnabled, state.activeRoleId, advisorContext]);
  
  // â”€â”€â”€ Accept recommendation â”€â”€â”€
  const acceptRecommendation = useCallback((presetId: string) => {
    if (pendingLogEntry) {
      const accepted = acceptAdvisorSuggestion(pendingLogEntry, presetId);
      dispatch({ type: 'ADVISOR_SUGGESTION', entry: accepted });
      setPendingLogEntry(null);
    }
    
    if (onPresetSelected) {
      onPresetSelected(presetId);
    }
  }, [pendingLogEntry, dispatch, onPresetSelected]);
  
  // â”€â”€â”€ Dismiss recommendation â”€â”€â”€
  const dismissRecommendation = useCallback(() => {
    if (pendingLogEntry) {
      dispatch({ type: 'ADVISOR_SUGGESTION', entry: pendingLogEntry });
      setPendingLogEntry(null);
    }
    setRecommendations([]);
  }, [pendingLogEntry, dispatch]);
  
  // â”€â”€â”€ Toggle advisor â”€â”€â”€
  const toggleAdvisor = useCallback(() => {
    dispatch({ type: 'ADVISOR_TOGGLED', enabled: !state.advisorEnabled });
  }, [state.advisorEnabled, dispatch]);
  
  // â”€â”€â”€ Get acceptance rate â”€â”€â”€
  const getAcceptanceRate = useCallback(() => {
    return calculateAcceptanceRate(state.advisorLog);
  }, [state.advisorLog]);
  
  // â”€â”€â”€ Get role â”€â”€â”€
  const getRole = useCallback((roleId: string) => {
    return getRoleById(state.roles, roleId);
  }, [state.roles]);
  
  // â”€â”€â”€ Auto-refresh recommendations â”€â”€â”€
  useEffect(() => {
    refreshRecommendations();
  }, [advisorContext, state.activeRoleId, refreshRecommendations]);
  
  // â”€â”€â”€ Update context time periodically â”€â”€â”€
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setAdvisorContext(prev => ({
        ...prev,
        timeOfDay: getTimeOfDay(hour),
        sessionDurationMin: prev.sessionDurationMin + 1,
      }));
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // â”€â”€â”€ Context value â”€â”€â”€
  const value: RoleContextValue = {
    state,
    activeRole,
    recommendations,
    advisorContext,
    selectRole,
    clearRole,
    createCustomRole,
    updateRole,
    deleteRole,
    duplicateRole,
    getSuggestedPreset,
    getAllowedPresets,
    isPresetAllowed,
    updateAdvisorContext,
    acceptRecommendation,
    dismissRecommendation,
    toggleAdvisor,
    getAcceptanceRate,
    getRole,
    refreshRecommendations,
  };
  
  return (
    <RoleReactContext.Provider value={value}>
      {children}
    </RoleReactContext.Provider>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOOKS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Main role hook.
 */
export function useRoles(): RoleContextValue {
  const ctx = useContext(RoleReactContext);
  if (!ctx) {
    throw new Error('useRoles must be used within RoleProvider');
  }
  return ctx;
}

/**
 * Hook for active role only.
 */
export function useActiveRole(): {
  role: UserRole | null;
  select: (roleId: string) => void;
  clear: () => void;
} {
  const { activeRole, selectRole, clearRole } = useRoles();
  return {
    role: activeRole,
    select: selectRole,
    clear: clearRole,
  };
}

/**
 * Hook for preset recommendations.
 */
export function usePresetAdvisor(): {
  recommendations: PresetRecommendation[];
  enabled: boolean;
  toggle: () => void;
  accept: (presetId: string) => void;
  dismiss: () => void;
  acceptanceRate: number;
} {
  const { 
    recommendations, 
    state, 
    toggleAdvisor, 
    acceptRecommendation, 
    dismissRecommendation,
    getAcceptanceRate,
  } = useRoles();
  
  return {
    recommendations,
    enabled: state.advisorEnabled,
    toggle: toggleAdvisor,
    accept: acceptRecommendation,
    dismiss: dismissRecommendation,
    acceptanceRate: getAcceptanceRate(),
  };
}

/**
 * Hook for role by ID.
 */
export function useRole(roleId: string): {
  role: UserRole | undefined;
  isActive: boolean;
  select: () => void;
} {
  const { getRole, activeRole, selectRole } = useRoles();
  
  const role = getRole(roleId);
  
  return {
    role,
    isActive: activeRole?.id === roleId,
    select: () => selectRole(roleId),
  };
}

/**
 * Hook for role-based preset filtering.
 */
export function useRolePresets(allPresets: CheNuPreset[]): {
  allowedPresets: CheNuPreset[];
  suggestedPreset: CheNuPreset | undefined;
  isAllowed: (presetId: string) => boolean;
} {
  const { getAllowedPresets, getSuggestedPreset, isPresetAllowed } = useRoles();
  
  const allowedPresets = useMemo(() => 
    getAllowedPresets(allPresets), 
    [getAllowedPresets, allPresets]
  );
  
  const suggestedPreset = useMemo(() => 
    getSuggestedPreset(allPresets), 
    [getSuggestedPreset, allPresets]
  );
  
  return {
    allowedPresets,
    suggestedPreset,
    isAllowed: isPresetAllowed,
  };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EXPORTS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type { RoleContextValue };
