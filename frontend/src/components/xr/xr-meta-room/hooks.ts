/**
 * CHE·NU™ XR META ROOM — HOOKS
 * 
 * State management hooks for the XR Meta Room spatial environment.
 * All interactions are calm, intentional, and never urgent.
 * 
 * @version 1.0
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type {
  RoomState,
  RoomConfig,
  NavigationState,
  NavigationMode,
  InteractionEvent,
  InteractionType,
  SelectedObject,
  SnapshotModeState,
  ExitMethod,
  RoomEntrySource,
  Vector3,
  Rotation3,
  XRThread,
  XRDecision,
  XRSnapshot,
  XRMeaning,
  XRCognitiveLoad,
  XRAgentPresence,
  SpatialZone,
  ZoneType,
  EnterRoomRequest,
  EnterRoomResponse,
  RoomUpdate,
  DEFAULT_ROOM_CONFIG,
} from './xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// useXRMetaRoom — Main Room State Hook
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRMetaRoomOptions {
  entry_source: RoomEntrySource;
  initial_config?: Partial<RoomConfig>;
  auto_enter?: boolean;
}

export interface UseXRMetaRoomReturn {
  // State
  room_state: RoomState | null;
  is_active: boolean;
  session_id: string | null;
  
  // Config
  config: RoomConfig;
  updateConfig: (updates: Partial<RoomConfig>) => void;
  
  // Entry/Exit
  enter: (request?: EnterRoomRequest) => Promise<EnterRoomResponse>;
  exit: (method: ExitMethod) => void;
  
  // Navigation
  navigation: NavigationState;
  moveTo: (position: Vector3) => void;
  lookAt: (position: Vector3) => void;
  followThread: (thread_id: string) => void;
  stopFollowing: () => void;
  
  // Selection
  selected: SelectedObject | null;
  select: (id: string, type: string) => void;
  deselect: () => void;
  inspect: (id: string, type: string) => void;
  closeInspection: () => void;
  
  // Snapshot Mode
  snapshot_mode: SnapshotModeState;
  enterSnapshotMode: (snapshot_id: string) => void;
  exitSnapshotMode: () => void;
  
  // Interactions
  lastInteraction: InteractionEvent | null;
  recordInteraction: (type: InteractionType, target_id?: string, target_type?: string) => void;
}

/**
 * Main hook for XR Meta Room state management
 */
export function useXRMetaRoom(options: UseXRMetaRoomOptions): UseXRMetaRoomReturn {
  const { entry_source, initial_config, auto_enter = false } = options;
  
  // Session
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  // Config
  const [config, setConfig] = useState<RoomConfig>({
    ...DEFAULT_ROOM_CONFIG,
    ...initial_config,
  });
  
  // Room state
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  
  // User position
  const [userPosition, setUserPosition] = useState<Vector3>({ x: 50, y: 50, z: 0 });
  const [userOrientation, setUserOrientation] = useState<Rotation3>({ pitch: 0, yaw: 0, roll: 0 });
  
  // Navigation
  const [navigation, setNavigation] = useState<NavigationState>({
    mode: 'free',
    speed: config.movement_speed,
    transition_progress: 0,
  });
  
  // Selection
  const [selected, setSelected] = useState<SelectedObject | null>(null);
  
  // Snapshot mode
  const [snapshotMode, setSnapshotMode] = useState<SnapshotModeState>({
    active: false,
    snapshot_id: null,
    original_room_state: null,
    label_visible: true,
    time_entered: null,
  });
  
  // Interactions
  const [lastInteraction, setLastInteraction] = useState<InteractionEvent | null>(null);
  
  // Auto-enter
  useEffect(() => {
    if (auto_enter && !isActive) {
      enter();
    }
  }, [auto_enter]);
  
  // Enter room
  const enter = useCallback(async (request?: EnterRoomRequest): Promise<EnterRoomResponse> => {
    const newSessionId = `xr-session-${Date.now()}`;
    setSessionId(newSessionId);
    setIsActive(true);
    
    // Create initial room state
    const newRoomState: RoomState = {
      id: `room-${Date.now()}`,
      session_id: newSessionId,
      entered_at: new Date().toISOString(),
      entry_source: request?.entry_source ?? entry_source,
      config: {
        ...config,
        ...request?.config_overrides,
      },
      user_position: { x: 50, y: 50, z: 0 },
      user_orientation: { pitch: 0, yaw: 0, roll: 0 },
      zones: [],
      active_zone: 'center',
      threads: [],
      decisions: [],
      snapshots: [],
      meanings: [],
      cognitive_load: {
        load_state: 'present',
        air_density: 0.2,
        movement_resistance: 0.1,
        sound_dampening: 0.3,
        visual_density: 0.2,
        color_temperature: 0.5,
        perception_cues: [],
      },
      agent_presences: [],
      snapshot_mode: {
        active: false,
        snapshot_id: null,
        original_room_state: null,
        label_visible: true,
        time_entered: null,
      },
      selected_object: null,
      hover_object: null,
    };
    
    setRoomState(newRoomState);
    
    // Focus on initial object if specified
    if (request?.initial_focus) {
      setSelected({
        id: request.initial_focus.id,
        type: request.initial_focus.type,
        inspection_open: false,
      });
    }
    
    return {
      success: true,
      session_id: newSessionId,
      room_state: newRoomState,
    };
  }, [config, entry_source]);
  
  // Exit room
  const exit = useCallback((method: ExitMethod) => {
    setIsActive(false);
    setRoomState(null);
    setSelected(null);
    setSnapshotMode({
      active: false,
      snapshot_id: null,
      original_room_state: null,
      label_visible: true,
      time_entered: null,
    });
    setNavigation({
      mode: 'free',
      speed: config.movement_speed,
      transition_progress: 0,
    });
    
    // Record exit interaction
    setLastInteraction({
      type: method === 'voice' ? 'exit_voice' : 'exit_gesture',
      timestamp: new Date().toISOString(),
      position: userPosition,
      user_position: userPosition,
    });
  }, [config.movement_speed, userPosition]);
  
  // Config update
  const updateConfig = useCallback((updates: Partial<RoomConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    if (roomState) {
      setRoomState(prev => prev ? {
        ...prev,
        config: { ...prev.config, ...updates },
      } : null);
    }
  }, [roomState]);
  
  // Navigation
  const moveTo = useCallback((position: Vector3) => {
    setNavigation(prev => ({
      ...prev,
      mode: 'transitioning',
      destination: position,
      transition_progress: 0,
    }));
    
    // Simulate slow movement (always slow in XR Meta Room)
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startPos = { ...userPosition };
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      
      setUserPosition({
        x: startPos.x + (position.x - startPos.x) * eased,
        y: startPos.y + (position.y - startPos.y) * eased,
        z: startPos.z + (position.z - startPos.z) * eased,
      });
      
      setNavigation(prev => ({
        ...prev,
        transition_progress: progress,
      }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setNavigation(prev => ({
          ...prev,
          mode: 'free',
          destination: undefined,
          transition_progress: 0,
        }));
      }
    };
    
    requestAnimationFrame(animate);
  }, [userPosition]);
  
  const lookAt = useCallback((position: Vector3) => {
    const dx = position.x - userPosition.x;
    const dy = position.y - userPosition.y;
    const yaw = Math.atan2(dy, dx);
    
    setUserOrientation(prev => ({
      ...prev,
      yaw,
    }));
  }, [userPosition]);
  
  const followThread = useCallback((thread_id: string) => {
    setNavigation(prev => ({
      ...prev,
      mode: 'guided',
      following_thread: thread_id,
    }));
    
    recordInteraction('walk_along', thread_id, 'thread');
  }, []);
  
  const stopFollowing = useCallback(() => {
    setNavigation(prev => ({
      ...prev,
      mode: 'free',
      following_thread: undefined,
    }));
  }, []);
  
  // Selection
  const select = useCallback((id: string, type: string) => {
    setSelected({
      id,
      type: type as any,
      inspection_open: false,
    });
    
    recordInteraction('touch', id, type);
  }, []);
  
  const deselect = useCallback(() => {
    setSelected(null);
    recordInteraction('step_back');
  }, []);
  
  const inspect = useCallback((id: string, type: string) => {
    setSelected({
      id,
      type: type as any,
      inspection_open: true,
    });
    
    recordInteraction('gesture_open', id, type);
  }, []);
  
  const closeInspection = useCallback(() => {
    if (selected) {
      setSelected({
        ...selected,
        inspection_open: false,
      });
    }
    
    recordInteraction('gesture_close');
  }, [selected]);
  
  // Snapshot mode
  const enterSnapshotMode = useCallback((snapshot_id: string) => {
    setSnapshotMode({
      active: true,
      snapshot_id,
      original_room_state: roomState,
      label_visible: true,
      time_entered: new Date().toISOString(),
    });
  }, [roomState]);
  
  const exitSnapshotMode = useCallback(() => {
    setSnapshotMode({
      active: false,
      snapshot_id: null,
      original_room_state: null,
      label_visible: true,
      time_entered: null,
    });
  }, []);
  
  // Record interaction
  const recordInteraction = useCallback((
    type: InteractionType,
    target_id?: string,
    target_type?: string
  ) => {
    setLastInteraction({
      type,
      timestamp: new Date().toISOString(),
      target_id,
      target_type,
      position: userPosition,
      user_position: userPosition,
    });
  }, [userPosition]);
  
  return {
    room_state: roomState,
    is_active: isActive,
    session_id: sessionId,
    config,
    updateConfig,
    enter,
    exit,
    navigation,
    moveTo,
    lookAt,
    followThread,
    stopFollowing,
    selected,
    select,
    deselect,
    inspect,
    closeInspection,
    snapshot_mode: snapshotMode,
    enterSnapshotMode,
    exitSnapshotMode,
    lastInteraction,
    recordInteraction,
  };
}

// Easing function for smooth movement
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRThreads — Thread Management
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRThreadsOptions {
  initial_threads?: XRThread[];
  user_position?: Vector3;
}

export interface UseXRThreadsReturn {
  threads: XRThread[];
  loadThreads: (threads: XRThread[]) => void;
  addThread: (thread: XRThread) => void;
  removeThread: (id: string) => void;
  updateThread: (id: string, updates: Partial<XRThread>) => void;
  
  // Spatial
  nearbyThreads: XRThread[];
  distanceToThread: (thread_id: string) => number;
  
  // Walking
  walkingThread: XRThread | null;
  startWalking: (thread_id: string) => void;
  stopWalking: () => void;
  walkProgress: number;
}

/**
 * Hook for managing XR thread visualizations
 */
export function useXRThreads(options: UseXRThreadsOptions = {}): UseXRThreadsReturn {
  const { initial_threads = [], user_position = { x: 50, y: 50, z: 0 } } = options;
  
  const [threads, setThreads] = useState<XRThread[]>(initial_threads);
  const [walkingThreadId, setWalkingThreadId] = useState<string | null>(null);
  const [walkProgress, setWalkProgress] = useState(0);
  
  const loadThreads = useCallback((newThreads: XRThread[]) => {
    setThreads(newThreads);
  }, []);
  
  const addThread = useCallback((thread: XRThread) => {
    setThreads(prev => [...prev, thread]);
  }, []);
  
  const removeThread = useCallback((id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (walkingThreadId === id) {
      setWalkingThreadId(null);
      setWalkProgress(0);
    }
  }, [walkingThreadId]);
  
  const updateThread = useCallback((id: string, updates: Partial<XRThread>) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  
  // Calculate nearby threads
  const nearbyThreads = useMemo(() => {
    const threshold = 30; // Within 30% distance
    return threads.filter(thread => {
      if (thread.path.length < 2) return false;
      const startDist = distance2D(user_position, thread.path[0]);
      return startDist < threshold;
    });
  }, [threads, user_position]);
  
  const distanceToThread = useCallback((thread_id: string): number => {
    const thread = threads.find(t => t.id === thread_id);
    if (!thread || thread.path.length < 2) return Infinity;
    return distance2D(user_position, thread.path[0]);
  }, [threads, user_position]);
  
  const walkingThread = useMemo(() => {
    return threads.find(t => t.id === walkingThreadId) ?? null;
  }, [threads, walkingThreadId]);
  
  const startWalking = useCallback((thread_id: string) => {
    const thread = threads.find(t => t.id === thread_id);
    if (thread && thread.walkable) {
      setWalkingThreadId(thread_id);
      setWalkProgress(0);
    }
  }, [threads]);
  
  const stopWalking = useCallback(() => {
    setWalkingThreadId(null);
    setWalkProgress(0);
  }, []);
  
  return {
    threads,
    loadThreads,
    addThread,
    removeThread,
    updateThread,
    nearbyThreads,
    distanceToThread,
    walkingThread,
    startWalking,
    stopWalking,
    walkProgress,
  };
}

function distance2D(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRDecisions — Decision Management
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRDecisionsOptions {
  initial_decisions?: XRDecision[];
}

export interface UseXRDecisionsReturn {
  decisions: XRDecision[];
  loadDecisions: (decisions: XRDecision[]) => void;
  addDecision: (decision: XRDecision) => void;
  removeDecision: (id: string) => void;
  updateDecision: (id: string, updates: Partial<XRDecision>) => void;
  
  // Inspection
  inspectedDecision: XRDecision | null;
  startInspection: (id: string) => void;
  endInspection: () => void;
}

/**
 * Hook for managing XR decision visualizations
 */
export function useXRDecisions(options: UseXRDecisionsOptions = {}): UseXRDecisionsReturn {
  const { initial_decisions = [] } = options;
  
  const [decisions, setDecisions] = useState<XRDecision[]>(initial_decisions);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  
  const loadDecisions = useCallback((newDecisions: XRDecision[]) => {
    setDecisions(newDecisions);
  }, []);
  
  const addDecision = useCallback((decision: XRDecision) => {
    setDecisions(prev => [...prev, decision]);
  }, []);
  
  const removeDecision = useCallback((id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
    if (inspectedId === id) {
      setInspectedId(null);
    }
  }, [inspectedId]);
  
  const updateDecision = useCallback((id: string, updates: Partial<XRDecision>) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);
  
  const inspectedDecision = useMemo(() => {
    return decisions.find(d => d.id === inspectedId) ?? null;
  }, [decisions, inspectedId]);
  
  const startInspection = useCallback((id: string) => {
    setInspectedId(id);
  }, []);
  
  const endInspection = useCallback(() => {
    setInspectedId(null);
  }, []);
  
  return {
    decisions,
    loadDecisions,
    addDecision,
    removeDecision,
    updateDecision,
    inspectedDecision,
    startInspection,
    endInspection,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRSnapshots — Snapshot Management
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRSnapshotsOptions {
  initial_snapshots?: XRSnapshot[];
}

export interface UseXRSnapshotsReturn {
  snapshots: XRSnapshot[];
  loadSnapshots: (snapshots: XRSnapshot[]) => void;
  addSnapshot: (snapshot: XRSnapshot) => void;
  removeSnapshot: (id: string) => void;
  
  // Snapshot mode
  active_snapshot: XRSnapshot | null;
  is_in_snapshot_mode: boolean;
  enterSnapshot: (id: string) => void;
  exitSnapshot: () => void;
}

/**
 * Hook for managing XR snapshot visualizations
 */
export function useXRSnapshots(options: UseXRSnapshotsOptions = {}): UseXRSnapshotsReturn {
  const { initial_snapshots = [] } = options;
  
  const [snapshots, setSnapshots] = useState<XRSnapshot[]>(initial_snapshots);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  
  const loadSnapshots = useCallback((newSnapshots: XRSnapshot[]) => {
    setSnapshots(newSnapshots);
  }, []);
  
  const addSnapshot = useCallback((snapshot: XRSnapshot) => {
    setSnapshots(prev => [...prev, snapshot]);
  }, []);
  
  const removeSnapshot = useCallback((id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    if (activeSnapshotId === id) {
      setActiveSnapshotId(null);
    }
  }, [activeSnapshotId]);
  
  const active_snapshot = useMemo(() => {
    return snapshots.find(s => s.id === activeSnapshotId) ?? null;
  }, [snapshots, activeSnapshotId]);
  
  const enterSnapshot = useCallback((id: string) => {
    const snapshot = snapshots.find(s => s.id === id);
    if (snapshot && snapshot.enterable) {
      setActiveSnapshotId(id);
    }
  }, [snapshots]);
  
  const exitSnapshot = useCallback(() => {
    setActiveSnapshotId(null);
  }, []);
  
  return {
    snapshots,
    loadSnapshots,
    addSnapshot,
    removeSnapshot,
    active_snapshot,
    is_in_snapshot_mode: activeSnapshotId !== null,
    enterSnapshot,
    exitSnapshot,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRCognitiveLoad — Environmental Load
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRCognitiveLoadOptions {
  initial_load?: XRCognitiveLoad;
  update_interval?: number;  // ms
}

export interface UseXRCognitiveLoadReturn {
  load: XRCognitiveLoad;
  updateLoad: (updates: Partial<XRCognitiveLoad>) => void;
  setLoadState: (state: XRCognitiveLoad['load_state']) => void;
  
  // Environmental effects
  air_density: number;
  movement_resistance: number;
  visual_density: number;
}

/**
 * Hook for managing cognitive load environmental effects
 */
export function useXRCognitiveLoad(options: UseXRCognitiveLoadOptions = {}): UseXRCognitiveLoadReturn {
  const { initial_load, update_interval = 5000 } = options;
  
  const defaultLoad: XRCognitiveLoad = {
    load_state: 'present',
    air_density: 0.2,
    movement_resistance: 0.1,
    sound_dampening: 0.3,
    visual_density: 0.2,
    color_temperature: 0.5,
    perception_cues: [],
  };
  
  const [load, setLoad] = useState<XRCognitiveLoad>(initial_load ?? defaultLoad);
  
  const updateLoad = useCallback((updates: Partial<XRCognitiveLoad>) => {
    setLoad(prev => ({ ...prev, ...updates }));
  }, []);
  
  const setLoadState = useCallback((state: XRCognitiveLoad['load_state']) => {
    // Automatically adjust environmental effects based on state
    const stateEffects: Record<string, Partial<XRCognitiveLoad>> = {
      open: {
        air_density: 0.1,
        movement_resistance: 0.05,
        visual_density: 0.1,
      },
      present: {
        air_density: 0.2,
        movement_resistance: 0.1,
        visual_density: 0.2,
      },
      weighted: {
        air_density: 0.4,
        movement_resistance: 0.2,
        visual_density: 0.4,
      },
      heavy: {
        air_density: 0.6,
        movement_resistance: 0.3,
        visual_density: 0.6,
      },
    };
    
    setLoad(prev => ({
      ...prev,
      load_state: state,
      ...stateEffects[state],
    }));
  }, []);
  
  return {
    load,
    updateLoad,
    setLoadState,
    air_density: load.air_density,
    movement_resistance: load.movement_resistance,
    visual_density: load.visual_density,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRAgents — Agent Presence Management
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRAgentsOptions {
  initial_agents?: XRAgentPresence[];
}

export interface UseXRAgentsReturn {
  agents: XRAgentPresence[];
  invited_agents: XRAgentPresence[];
  
  inviteAgent: (agent_id: string) => void;
  dismissAgent: (agent_id: string) => void;
  
  // Agent capabilities reminder
  getAgentCapabilities: (agent_id: string) => AgentCapabilities | null;
}

interface AgentCapabilities {
  can_explain: boolean;
  can_answer: boolean;
  can_reflect: boolean;
  can_persuade: boolean;  // Always false
  can_optimize: boolean;  // Always false
  can_lead: boolean;      // Always false
}

/**
 * Hook for managing agent presence in XR Meta Room
 * Agents may explain, answer, reflect - NEVER persuade, optimize, or lead
 */
export function useXRAgents(options: UseXRAgentsOptions = {}): UseXRAgentsReturn {
  const { initial_agents = [] } = options;
  
  const [agents, setAgents] = useState<XRAgentPresence[]>(initial_agents);
  
  const invited_agents = useMemo(() => {
    return agents.filter(a => a.invited);
  }, [agents]);
  
  const inviteAgent = useCallback((agent_id: string) => {
    setAgents(prev => prev.map(a => 
      a.agent_id === agent_id ? { ...a, invited: true } : a
    ));
  }, []);
  
  const dismissAgent = useCallback((agent_id: string) => {
    setAgents(prev => prev.map(a =>
      a.agent_id === agent_id ? { ...a, invited: false } : a
    ));
  }, []);
  
  const getAgentCapabilities = useCallback((agent_id: string): AgentCapabilities | null => {
    const agent = agents.find(a => a.agent_id === agent_id);
    if (!agent) return null;
    
    return {
      can_explain: agent.can_explain,
      can_answer: agent.can_answer,
      can_reflect: agent.can_reflect,
      can_persuade: false,  // NEVER
      can_optimize: false,  // NEVER
      can_lead: false,      // NEVER
    };
  }, [agents]);
  
  return {
    agents,
    invited_agents,
    inviteAgent,
    dismissAgent,
    getAgentCapabilities,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRMetaRoomUI — UI State
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRMetaRoomUIReturn {
  // Panels
  inspection_panel_open: boolean;
  toggleInspectionPanel: () => void;
  closeInspectionPanel: () => void;
  
  // Overlays
  snapshot_mode_label_visible: boolean;
  setSnapshotModeLabel: (visible: boolean) => void;
  
  // Exit
  exit_controls_visible: boolean;
  setExitControlsVisible: (visible: boolean) => void;
  
  // XR runtime
  xr_runtime: 'webxr' | 'mock' | 'preview';
  setXRRuntime: (runtime: 'webxr' | 'mock' | 'preview') => void;
  is_preview_mode: boolean;
}

/**
 * Hook for XR Meta Room UI state
 */
export function useXRMetaRoomUI(): UseXRMetaRoomUIReturn {
  const [inspectionPanelOpen, setInspectionPanelOpen] = useState(false);
  const [snapshotModeLabelVisible, setSnapshotModeLabelVisible] = useState(true);
  const [exitControlsVisible, setExitControlsVisible] = useState(true);
  const [xrRuntime, setXRRuntime] = useState<'webxr' | 'mock' | 'preview'>('preview');
  
  return {
    inspection_panel_open: inspectionPanelOpen,
    toggleInspectionPanel: useCallback(() => setInspectionPanelOpen(prev => !prev), []),
    closeInspectionPanel: useCallback(() => setInspectionPanelOpen(false), []),
    
    snapshot_mode_label_visible: snapshotModeLabelVisible,
    setSnapshotModeLabel: setSnapshotModeLabelVisible,
    
    exit_controls_visible: exitControlsVisible,
    setExitControlsVisible,
    
    xr_runtime: xrRuntime,
    setXRRuntime,
    is_preview_mode: xrRuntime === 'preview',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useXRMetaRoomAll — Combined Hook
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRMetaRoomAllOptions {
  entry_source: RoomEntrySource;
  initial_config?: Partial<RoomConfig>;
  initial_threads?: XRThread[];
  initial_decisions?: XRDecision[];
  initial_snapshots?: XRSnapshot[];
  initial_load?: XRCognitiveLoad;
  initial_agents?: XRAgentPresence[];
}

/**
 * Combined hook for all XR Meta Room functionality
 */
export function useXRMetaRoomAll(options: UseXRMetaRoomAllOptions) {
  const room = useXRMetaRoom({
    entry_source: options.entry_source,
    initial_config: options.initial_config,
  });
  
  const threads = useXRThreads({
    initial_threads: options.initial_threads,
  });
  
  const decisions = useXRDecisions({
    initial_decisions: options.initial_decisions,
  });
  
  const snapshots = useXRSnapshots({
    initial_snapshots: options.initial_snapshots,
  });
  
  const cognitiveLoad = useXRCognitiveLoad({
    initial_load: options.initial_load,
  });
  
  const agents = useXRAgents({
    initial_agents: options.initial_agents,
  });
  
  const ui = useXRMetaRoomUI();
  
  return {
    room,
    threads,
    decisions,
    snapshots,
    cognitiveLoad,
    agents,
    ui,
  };
}
