/* =====================================================
   CHEÂ·NU â€” Phase & Project React Hooks
   
   React hooks for phase and project preset management.
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
  PhaseState,
  PhaseEvent,
  PhaseDefinition,
  AllPhaseId,
} from './phasePreset.types';

import {
  Project,
  ProjectPresetState,
  ProjectPresetEvent,
  ProjectPresetContext,
  ResolvedPreset,
} from './projectPreset.types';

import {
  DEFAULT_PHASE_STATE,
  getPhaseById,
  getPhasesByCategory,
  getNextPhase,
  getPreviousPhase,
} from './phasePreset.defaults';

import {
  reducePhaseState,
  enterPhase,
  exitPhase,
  advancePhase,
  regressPhase,
  getCurrentPhasePreset,
  getCurrentPhaseDuration,
  getPhaseProgress,
  getValidNextPhases,
} from './phasePreset.engine';

import {
  DEFAULT_PROJECT_PRESET_STATE,
  reduceProjectPresetState,
  getProjectById,
  getActiveProject,
  getProjectPreset,
  resolvePreset,
  createProject,
  getRecentProjects,
} from './projectPreset.engine';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STORAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PHASE_STORAGE_KEY = 'che-nu.phases';
const PROJECT_STORAGE_KEY = 'che-nu.projects';

function loadPhaseState(): PhaseState {
  if (typeof localStorage === 'undefined') return DEFAULT_PHASE_STATE;
  try {
    const stored = localStorage.getItem(PHASE_STORAGE_KEY);
    return stored ? { ...DEFAULT_PHASE_STATE, ...JSON.parse(stored) } : DEFAULT_PHASE_STATE;
  } catch {
    return DEFAULT_PHASE_STATE;
  }
}

function savePhaseState(state: PhaseState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PHASE_STORAGE_KEY, JSON.stringify({
      activePhase: state.activePhase,
      transitions: state.transitions.slice(0, 50),
      autoSwitchEnabled: state.autoSwitchEnabled,
    }));
  } catch {}
}

function loadProjectState(): ProjectPresetState {
  if (typeof localStorage === 'undefined') return DEFAULT_PROJECT_PRESET_STATE;
  try {
    const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
    return stored ? { ...DEFAULT_PROJECT_PRESET_STATE, ...JSON.parse(stored) } : DEFAULT_PROJECT_PRESET_STATE;
  } catch {
    return DEFAULT_PROJECT_PRESET_STATE;
  }
}

function saveProjectState(state: ProjectPresetState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
      projects: state.projects,
      projectPresets: state.projectPresets,
      activeProjectId: state.activeProjectId,
      recentProjects: state.recentProjects,
    }));
  } catch {}
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// COMBINED CONTEXT
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface PhaseProjectContextValue {
  // Phase state
  phaseState: PhaseState;
  activePhase: PhaseDefinition | null;
  phaseDuration: number;
  phaseProgress: number;
  
  // Phase actions
  enterPhase: (phaseId: AllPhaseId) => void;
  exitPhase: () => void;
  advancePhase: () => void;
  regressPhase: () => void;
  toggleAutoSwitch: () => void;
  
  // Phase queries
  getPhase: (phaseId: AllPhaseId) => PhaseDefinition | undefined;
  getStandardPhases: () => PhaseDefinition[];
  getConstructionPhases: () => PhaseDefinition[];
  getNextPhase: () => PhaseDefinition | undefined;
  getPreviousPhase: () => PhaseDefinition | undefined;
  getValidNextPhases: () => PhaseDefinition[];
  
  // Project state
  projectState: ProjectPresetState;
  activeProject: Project | undefined;
  recentProjects: Project[];
  
  // Project actions
  createProject: (partial: Partial<Project> & Pick<Project, 'id' | 'name' | 'type'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  activateProject: (projectId: string) => void;
  deactivateProject: () => void;
  setProjectPreset: (projectId: string, presetId: string) => void;
  setProjectPhasePreset: (projectId: string, phaseId: AllPhaseId, presetId: string) => void;
  
  // Project queries
  getProject: (projectId: string) => Project | undefined;
  getProjectPreset: (projectId: string) => string | undefined;
  
  // Preset resolution
  resolvePreset: (context?: Partial<ProjectPresetContext>) => ResolvedPreset;
  currentPresetId: string | undefined;
}

const PhaseProjectContext = createContext<PhaseProjectContextValue | null>(null);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROVIDER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface PhaseProjectProviderProps {
  children: ReactNode;
  roleId?: string;
  device?: 'desktop' | 'mobile' | 'xr';
  onPresetChange?: (presetId: string, source: ResolvedPreset['source']) => void;
}

export function PhaseProjectProvider({
  children,
  roleId,
  device,
  onPresetChange,
}: PhaseProjectProviderProps) {
  const [phaseState, setPhaseState] = useState<PhaseState>(loadPhaseState);
  const [projectState, setProjectState] = useState<ProjectPresetState>(loadProjectState);
  
  // â”€â”€â”€ Phase dispatch â”€â”€â”€
  const dispatchPhase = useCallback((event: PhaseEvent) => {
    setPhaseState(prev => {
      const next = reducePhaseState(prev, event);
      savePhaseState(next);
      return next;
    });
  }, []);
  
  // â”€â”€â”€ Project dispatch â”€â”€â”€
  const dispatchProject = useCallback((event: ProjectPresetEvent) => {
    setProjectState(prev => {
      const next = reduceProjectPresetState(prev, event);
      saveProjectState(next);
      return next;
    });
  }, []);
  
  // â”€â”€â”€ Active phase â”€â”€â”€
  const activePhase = useMemo(() => {
    if (!phaseState.activePhase) return null;
    return getPhaseById(phaseState.phases, phaseState.activePhase) || null;
  }, [phaseState.phases, phaseState.activePhase]);
  
  // â”€â”€â”€ Active project â”€â”€â”€
  const activeProject = useMemo(() => 
    getActiveProject(projectState),
    [projectState]
  );
  
  // â”€â”€â”€ Recent projects â”€â”€â”€
  const recentProjectsList = useMemo(() =>
    getRecentProjects(projectState, 5),
    [projectState]
  );
  
  // â”€â”€â”€ Phase duration â”€â”€â”€
  const phaseDuration = useMemo(() =>
    getCurrentPhaseDuration(phaseState),
    [phaseState]
  );
  
  // â”€â”€â”€ Phase progress â”€â”€â”€
  const phaseProgress = useMemo(() =>
    getPhaseProgress(phaseState, activePhase?.category || 'standard'),
    [phaseState, activePhase]
  );
  
  // â”€â”€â”€ Resolved preset â”€â”€â”€
  const resolvedPreset = useMemo(() => {
    const context: ProjectPresetContext = {
      project: activeProject,
      currentPhase: phaseState.activePhase || undefined,
      roleId,
      device,
    };
    return resolvePreset(projectState, context);
  }, [projectState, activeProject, phaseState.activePhase, roleId, device]);
  
  // â”€â”€â”€ Notify on preset change â”€â”€â”€
  useEffect(() => {
    if (onPresetChange && resolvedPreset.presetId) {
      onPresetChange(resolvedPreset.presetId, resolvedPreset.source);
    }
  }, [resolvedPreset.presetId, resolvedPreset.source, onPresetChange]);
  
  // â”€â”€â”€ Phase actions â”€â”€â”€
  const enterPhaseAction = useCallback((phaseId: AllPhaseId) => {
    dispatchPhase({ type: 'PHASE_ENTERED', phase: phaseId, initiatedBy: 'user' });
  }, [dispatchPhase]);
  
  const exitPhaseAction = useCallback(() => {
    if (phaseState.activePhase) {
      dispatchPhase({ type: 'PHASE_EXITED', phase: phaseState.activePhase });
    }
  }, [phaseState.activePhase, dispatchPhase]);
  
  const advancePhaseAction = useCallback(() => {
    const next = getNextPhase(phaseState.phases, phaseState.activePhase!);
    if (next) {
      dispatchPhase({ type: 'PHASE_ENTERED', phase: next.id, initiatedBy: 'user' });
    }
  }, [phaseState.phases, phaseState.activePhase, dispatchPhase]);
  
  const regressPhaseAction = useCallback(() => {
    const prev = getPreviousPhase(phaseState.phases, phaseState.activePhase!);
    if (prev) {
      dispatchPhase({ type: 'PHASE_ENTERED', phase: prev.id, initiatedBy: 'user' });
    }
  }, [phaseState.phases, phaseState.activePhase, dispatchPhase]);
  
  const toggleAutoSwitch = useCallback(() => {
    dispatchPhase({ type: 'AUTO_SWITCH_TOGGLED', enabled: !phaseState.autoSwitchEnabled });
  }, [phaseState.autoSwitchEnabled, dispatchPhase]);
  
  // â”€â”€â”€ Phase queries â”€â”€â”€
  const getPhaseAction = useCallback((phaseId: AllPhaseId) =>
    getPhaseById(phaseState.phases, phaseId),
    [phaseState.phases]
  );
  
  const getStandardPhases = useCallback(() =>
    getPhasesByCategory(phaseState.phases, 'standard'),
    [phaseState.phases]
  );
  
  const getConstructionPhases = useCallback(() =>
    getPhasesByCategory(phaseState.phases, 'construction'),
    [phaseState.phases]
  );
  
  const getNextPhaseAction = useCallback(() =>
    phaseState.activePhase ? getNextPhase(phaseState.phases, phaseState.activePhase) : undefined,
    [phaseState.phases, phaseState.activePhase]
  );
  
  const getPreviousPhaseAction = useCallback(() =>
    phaseState.activePhase ? getPreviousPhase(phaseState.phases, phaseState.activePhase) : undefined,
    [phaseState.phases, phaseState.activePhase]
  );
  
  const getValidNextPhasesAction = useCallback(() =>
    getValidNextPhases(phaseState),
    [phaseState]
  );
  
  // â”€â”€â”€ Project actions â”€â”€â”€
  const createProjectAction = useCallback((partial: Partial<Project> & Pick<Project, 'id' | 'name' | 'type'>) => {
    const project = createProject(partial);
    dispatchProject({ type: 'PROJECT_CREATED', project });
  }, [dispatchProject]);
  
  const updateProjectAction = useCallback((project: Project) => {
    dispatchProject({ type: 'PROJECT_UPDATED', project: { ...project, updatedAt: Date.now() } });
  }, [dispatchProject]);
  
  const deleteProjectAction = useCallback((projectId: string) => {
    dispatchProject({ type: 'PROJECT_DELETED', projectId });
  }, [dispatchProject]);
  
  const activateProjectAction = useCallback((projectId: string) => {
    dispatchProject({ type: 'PROJECT_ACTIVATED', projectId });
  }, [dispatchProject]);
  
  const deactivateProjectAction = useCallback(() => {
    dispatchProject({ type: 'PROJECT_DEACTIVATED' });
  }, [dispatchProject]);
  
  const setProjectPresetAction = useCallback((projectId: string, presetId: string) => {
    dispatchProject({ type: 'PROJECT_PRESET_SET', projectId, presetId });
  }, [dispatchProject]);
  
  const setProjectPhasePresetAction = useCallback((projectId: string, phaseId: AllPhaseId, presetId: string) => {
    dispatchProject({ type: 'PROJECT_PHASE_PRESET_SET', projectId, phaseId, presetId });
  }, [dispatchProject]);
  
  // â”€â”€â”€ Project queries â”€â”€â”€
  const getProjectAction = useCallback((projectId: string) =>
    getProjectById(projectState, projectId),
    [projectState]
  );
  
  const getProjectPresetAction = useCallback((projectId: string) =>
    getProjectPreset(projectState, projectId),
    [projectState]
  );
  
  // â”€â”€â”€ Resolve preset with context â”€â”€â”€
  const resolvePresetAction = useCallback((context?: Partial<ProjectPresetContext>) => {
    const fullContext: ProjectPresetContext = {
      project: context?.project || activeProject,
      currentPhase: context?.currentPhase || phaseState.activePhase || undefined,
      roleId: context?.roleId || roleId,
      device: context?.device || device,
    };
    return resolvePreset(projectState, fullContext);
  }, [projectState, activeProject, phaseState.activePhase, roleId, device]);
  
  // â”€â”€â”€ Context value â”€â”€â”€
  const value: PhaseProjectContextValue = {
    // Phase state
    phaseState,
    activePhase,
    phaseDuration,
    phaseProgress,
    
    // Phase actions
    enterPhase: enterPhaseAction,
    exitPhase: exitPhaseAction,
    advancePhase: advancePhaseAction,
    regressPhase: regressPhaseAction,
    toggleAutoSwitch,
    
    // Phase queries
    getPhase: getPhaseAction,
    getStandardPhases,
    getConstructionPhases,
    getNextPhase: getNextPhaseAction,
    getPreviousPhase: getPreviousPhaseAction,
    getValidNextPhases: getValidNextPhasesAction,
    
    // Project state
    projectState,
    activeProject,
    recentProjects: recentProjectsList,
    
    // Project actions
    createProject: createProjectAction,
    updateProject: updateProjectAction,
    deleteProject: deleteProjectAction,
    activateProject: activateProjectAction,
    deactivateProject: deactivateProjectAction,
    setProjectPreset: setProjectPresetAction,
    setProjectPhasePreset: setProjectPhasePresetAction,
    
    // Project queries
    getProject: getProjectAction,
    getProjectPreset: getProjectPresetAction,
    
    // Preset resolution
    resolvePreset: resolvePresetAction,
    currentPresetId: resolvedPreset.presetId,
  };
  
  return (
    <PhaseProjectContext.Provider value={value}>
      {children}
    </PhaseProjectContext.Provider>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOOKS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Main phase/project hook.
 */
export function usePhaseProject(): PhaseProjectContextValue {
  const ctx = useContext(PhaseProjectContext);
  if (!ctx) {
    throw new Error('usePhaseProject must be used within PhaseProjectProvider');
  }
  return ctx;
}

/**
 * Phase-only hook.
 */
export function usePhase() {
  const ctx = usePhaseProject();
  return {
    state: ctx.phaseState,
    activePhase: ctx.activePhase,
    duration: ctx.phaseDuration,
    progress: ctx.phaseProgress,
    enter: ctx.enterPhase,
    exit: ctx.exitPhase,
    advance: ctx.advancePhase,
    regress: ctx.regressPhase,
    getPhase: ctx.getPhase,
    getStandardPhases: ctx.getStandardPhases,
    getConstructionPhases: ctx.getConstructionPhases,
    getNext: ctx.getNextPhase,
    getPrevious: ctx.getPreviousPhase,
    getValidNext: ctx.getValidNextPhases,
  };
}

/**
 * Project-only hook.
 */
export function useProject() {
  const ctx = usePhaseProject();
  return {
    state: ctx.projectState,
    activeProject: ctx.activeProject,
    recentProjects: ctx.recentProjects,
    create: ctx.createProject,
    update: ctx.updateProject,
    delete: ctx.deleteProject,
    activate: ctx.activateProject,
    deactivate: ctx.deactivateProject,
    setPreset: ctx.setProjectPreset,
    setPhasePreset: ctx.setProjectPhasePreset,
    getProject: ctx.getProject,
    getPreset: ctx.getProjectPreset,
  };
}

/**
 * Preset resolution hook.
 */
export function useResolvedPreset() {
  const ctx = usePhaseProject();
  return {
    presetId: ctx.currentPresetId,
    resolve: ctx.resolvePreset,
  };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EXPORTS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type { PhaseProjectContextValue };
