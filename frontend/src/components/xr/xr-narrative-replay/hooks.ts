/**
 * CHE·NU™ XR NARRATIVE REPLAY — HOOKS
 * 
 * State management for chronological reconstruction.
 * Playback, navigation, comparison.
 * 
 * @version 1.0
 * @status V51-ready
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  NarrativePath,
  NarrativeElement,
  NarrativeElementType,
  NarrativeConnection,
  NarrativeSource,
  NarrativeSessionState,
  NarrativeUserControls,
  NarrativeSpatialConfig,
  NarrativeAgent,
  NarrativeAgentCapabilities,
  NarrativeParticipant,
  NarrativeComparison,
  ComparisonDifference,
  PlaybackState,
  StartElement,
  BranchElement,
  PauseElement,
  DecisionElement,
  ConsequenceElement,
  EvolutionElement,
} from './xr-narrative-replay.types';

import {
  DEFAULT_NARRATIVE_SPATIAL_CONFIG,
  DEFAULT_NARRATIVE_USER_CONTROLS,
  NARRATIVE_AGENT_CAPABILITIES,
  DEFAULT_ETHICAL_SAFEGUARDS,
  DEFAULT_TEAM_NARRATIVE_CONFIG,
  XR_NARRATIVE_REPLAY_TOKENS,
} from './xr-narrative-replay.types';

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE REPLAY HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNarrativeReplayOptions {
  narrative: NarrativePath;
  user_id: string;
  auto_start?: boolean;
  spatial_config?: Partial<NarrativeSpatialConfig>;
}

export interface UseNarrativeReplayReturn {
  // Session
  session: NarrativeSessionState | null;
  is_active: boolean;
  
  // Navigation
  start_replay: (from_element_id?: string) => void;
  end_replay: () => void;
  
  // Playback
  play: () => void;
  pause: () => void;
  toggle_playback: () => void;
  set_speed: (speed: number) => void;
  
  // Position
  jump_to_element: (element_id: string) => void;
  jump_to_time: (timestamp: string) => void;
  go_to_next: () => void;
  go_to_previous: () => void;
  
  // Current state
  current_element: NarrativeElement | null;
  visited_elements: string[];
  playback_state: PlaybackState;
  playback_speed: number;
  
  // Progress
  progress_percentage: number;
  elapsed_time: number;
}

export function useNarrativeReplay(options: UseNarrativeReplayOptions): UseNarrativeReplayReturn {
  const {
    narrative,
    user_id,
    auto_start = false,
    spatial_config = {},
  } = options;
  
  const [session, setSession] = useState<NarrativeSessionState | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Merged spatial config
  const config = useMemo(() => ({
    ...DEFAULT_NARRATIVE_SPATIAL_CONFIG,
    ...spatial_config,
  }), [spatial_config]);
  
  // Start replay
  const start_replay = useCallback((from_element_id?: string) => {
    const start_element = from_element_id
      ? narrative.elements.find(e => e.id === from_element_id)
      : narrative.elements[0];
    
    const new_session: NarrativeSessionState = {
      session_id: `session-${Date.now()}`,
      narrative_id: narrative.id,
      playback_state: 'paused',
      current_time: start_element?.timestamp || new Date().toISOString(),
      elapsed_real_time: 0,
      current_element: start_element || null,
      visited_elements: start_element ? [start_element.id] : [],
      user_id,
      controls: { ...DEFAULT_NARRATIVE_USER_CONTROLS },
      started_at: new Date().toISOString(),
    };
    
    setSession(new_session);
  }, [narrative, user_id]);
  
  // End replay
  const end_replay = useCallback(() => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    setSession(prev => prev ? {
      ...prev,
      playback_state: 'exiting',
      ended_at: new Date().toISOString(),
    } : null);
    
    setTimeout(() => setSession(null), 500);
  }, []);
  
  // Play
  const play = useCallback(() => {
    setSession(prev => prev ? {
      ...prev,
      playback_state: 'playing',
      controls: { ...prev.controls, playback_speed: prev.controls.playback_speed || 1 },
    } : null);
  }, []);
  
  // Pause
  const pause = useCallback(() => {
    setSession(prev => prev ? {
      ...prev,
      playback_state: 'paused',
    } : null);
  }, []);
  
  // Toggle playback
  const toggle_playback = useCallback(() => {
    if (session?.playback_state === 'playing') {
      pause();
    } else {
      play();
    }
  }, [session?.playback_state, play, pause]);
  
  // Set speed
  const set_speed = useCallback((speed: number) => {
    const clamped = Math.max(0, Math.min(speed, DEFAULT_NARRATIVE_USER_CONTROLS.max_speed));
    setSession(prev => prev ? {
      ...prev,
      controls: { ...prev.controls, playback_speed: clamped },
    } : null);
  }, []);
  
  // Jump to element
  const jump_to_element = useCallback((element_id: string) => {
    const element = narrative.elements.find(e => e.id === element_id);
    if (!element) return;
    
    setSession(prev => prev ? {
      ...prev,
      playback_state: 'exploring',
      current_element: element,
      current_time: element.timestamp,
      visited_elements: prev.visited_elements.includes(element_id)
        ? prev.visited_elements
        : [...prev.visited_elements, element_id],
      controls: {
        ...prev.controls,
        current_element_id: element_id,
        current_position: element.position,
      },
    } : null);
  }, [narrative.elements]);
  
  // Jump to time
  const jump_to_time = useCallback((timestamp: string) => {
    const target = new Date(timestamp).getTime();
    
    // Find closest element
    let closest: NarrativeElement | null = null;
    let closest_diff = Infinity;
    
    for (const element of narrative.elements) {
      const diff = Math.abs(new Date(element.timestamp).getTime() - target);
      if (diff < closest_diff) {
        closest_diff = diff;
        closest = element;
      }
    }
    
    if (closest) {
      jump_to_element(closest.id);
    }
  }, [narrative.elements, jump_to_element]);
  
  // Go to next
  const go_to_next = useCallback(() => {
    if (!session?.current_element) return;
    
    const current_idx = narrative.elements.findIndex(e => e.id === session.current_element?.id);
    if (current_idx < narrative.elements.length - 1) {
      jump_to_element(narrative.elements[current_idx + 1].id);
    }
  }, [session?.current_element, narrative.elements, jump_to_element]);
  
  // Go to previous
  const go_to_previous = useCallback(() => {
    if (!session?.current_element) return;
    
    const current_idx = narrative.elements.findIndex(e => e.id === session.current_element?.id);
    if (current_idx > 0) {
      jump_to_element(narrative.elements[current_idx - 1].id);
    }
  }, [session?.current_element, narrative.elements, jump_to_element]);
  
  // Calculate progress
  const progress_percentage = useMemo(() => {
    if (!session?.current_element) return 0;
    const idx = narrative.elements.findIndex(e => e.id === session.current_element?.id);
    return ((idx + 1) / narrative.elements.length) * 100;
  }, [session?.current_element, narrative.elements]);
  
  // Auto-advance when playing
  useEffect(() => {
    if (session?.playback_state === 'playing' && session.controls.playback_speed > 0) {
      playbackIntervalRef.current = setInterval(() => {
        go_to_next();
      }, 2000 / session.controls.playback_speed);  // 2 seconds base, modified by speed
    } else if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [session?.playback_state, session?.controls.playback_speed, go_to_next]);
  
  // Track elapsed time
  useEffect(() => {
    if (!session || session.playback_state === 'exiting') return;
    
    const interval = setInterval(() => {
      setSession(prev => prev ? {
        ...prev,
        elapsed_real_time: prev.elapsed_real_time + 1,
      } : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [session?.playback_state]);
  
  // Auto-start
  useEffect(() => {
    if (auto_start && !session) {
      start_replay();
    }
  }, [auto_start, session, start_replay]);
  
  return {
    session,
    is_active: session !== null && session.playback_state !== 'exiting',
    start_replay,
    end_replay,
    play,
    pause,
    toggle_playback,
    set_speed,
    jump_to_element,
    jump_to_time,
    go_to_next,
    go_to_previous,
    current_element: session?.current_element || null,
    visited_elements: session?.visited_elements || [],
    playback_state: session?.playback_state || 'idle',
    playback_speed: session?.controls.playback_speed || 0,
    progress_percentage,
    elapsed_time: session?.elapsed_real_time || 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE ELEMENTS HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNarrativeElementsOptions {
  elements: NarrativeElement[];
  connections: NarrativeConnection[];
}

export interface UseNarrativeElementsReturn {
  // Elements by type
  starts: StartElement[];
  branches: BranchElement[];
  pauses: PauseElement[];
  decisions: DecisionElement[];
  consequences: ConsequenceElement[];
  evolutions: EvolutionElement[];
  
  // Query
  get_element: (id: string) => NarrativeElement | undefined;
  get_connections_from: (element_id: string) => NarrativeConnection[];
  get_connections_to: (element_id: string) => NarrativeConnection[];
  get_next_elements: (element_id: string) => NarrativeElement[];
  get_previous_elements: (element_id: string) => NarrativeElement[];
  
  // Timeline
  timeline: NarrativeElement[];  // Sorted by timestamp
  total_duration: number;  // Seconds
}

export function useNarrativeElements(options: UseNarrativeElementsOptions): UseNarrativeElementsReturn {
  const { elements, connections } = options;
  
  // Elements by type
  const starts = useMemo(() => 
    elements.filter(e => e.type === 'start') as StartElement[],
  [elements]);
  
  const branches = useMemo(() => 
    elements.filter(e => e.type === 'branch') as BranchElement[],
  [elements]);
  
  const pauses = useMemo(() => 
    elements.filter(e => e.type === 'pause') as PauseElement[],
  [elements]);
  
  const decisions = useMemo(() => 
    elements.filter(e => e.type === 'decision') as DecisionElement[],
  [elements]);
  
  const consequences = useMemo(() => 
    elements.filter(e => e.type === 'consequence') as ConsequenceElement[],
  [elements]);
  
  const evolutions = useMemo(() => 
    elements.filter(e => e.type === 'evolution') as EvolutionElement[],
  [elements]);
  
  // Query functions
  const get_element = useCallback((id: string) => 
    elements.find(e => e.id === id),
  [elements]);
  
  const get_connections_from = useCallback((element_id: string) => 
    connections.filter(c => c.from_element_id === element_id),
  [connections]);
  
  const get_connections_to = useCallback((element_id: string) => 
    connections.filter(c => c.to_element_id === element_id),
  [connections]);
  
  const get_next_elements = useCallback((element_id: string) => {
    const conns = get_connections_from(element_id);
    return conns.map(c => get_element(c.to_element_id)).filter(Boolean) as NarrativeElement[];
  }, [get_connections_from, get_element]);
  
  const get_previous_elements = useCallback((element_id: string) => {
    const conns = get_connections_to(element_id);
    return conns.map(c => get_element(c.from_element_id)).filter(Boolean) as NarrativeElement[];
  }, [get_connections_to, get_element]);
  
  // Timeline
  const timeline = useMemo(() => 
    [...elements].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ),
  [elements]);
  
  const total_duration = useMemo(() => {
    if (timeline.length < 2) return 0;
    const start = new Date(timeline[0].timestamp).getTime();
    const end = new Date(timeline[timeline.length - 1].timestamp).getTime();
    return (end - start) / 1000;
  }, [timeline]);
  
  return {
    starts,
    branches,
    pauses,
    decisions,
    consequences,
    evolutions,
    get_element,
    get_connections_from,
    get_connections_to,
    get_next_elements,
    get_previous_elements,
    timeline,
    total_duration,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNarrativeComparisonOptions {
  current_element: NarrativeElement | null;
}

export interface UseNarrativeComparisonReturn {
  // State
  comparison: NarrativeComparison | null;
  is_comparing: boolean;
  
  // Actions
  start_comparison: (past_element: NarrativeElement, present_context?: string) => void;
  end_comparison: () => void;
  add_note: (note: string) => void;
  
  // Differences
  differences: ComparisonDifference[];
}

export function useNarrativeComparison(options: UseNarrativeComparisonOptions): UseNarrativeComparisonReturn {
  const { current_element } = options;
  
  const [comparison, setComparison] = useState<NarrativeComparison | null>(null);
  
  const start_comparison = useCallback((past_element: NarrativeElement, present_context?: string) => {
    // Generate differences (simplified)
    const differences: ComparisonDifference[] = [];
    
    // Example difference
    if (past_element.context_at_time !== present_context) {
      differences.push({
        aspect: 'Context',
        past_value: past_element.context_at_time,
        present_value: present_context || 'Current context',
        significance: 'moderate',
      });
    }
    
    const new_comparison: NarrativeComparison = {
      id: `comparison-${Date.now()}`,
      past_element_id: past_element.id,
      past_timestamp: past_element.timestamp,
      past_meaning: past_element.description,
      present_meaning: present_context,
      present_context: present_context,
      differences,
    };
    
    setComparison(new_comparison);
  }, []);
  
  const end_comparison = useCallback(() => {
    setComparison(null);
  }, []);
  
  const add_note = useCallback((note: string) => {
    setComparison(prev => prev ? {
      ...prev,
      user_notes: note,
    } : null);
  }, []);
  
  return {
    comparison,
    is_comparing: comparison !== null,
    start_comparison,
    end_comparison,
    add_note,
    differences: comparison?.differences || [],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE AGENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNarrativeAgentOptions {
  enabled?: boolean;
  agent?: Partial<NarrativeAgent>;
}

export interface UseNarrativeAgentReturn {
  // State
  agent: NarrativeAgent | null;
  is_enabled: boolean;
  capabilities: NarrativeAgentCapabilities;
  
  // Actions
  ask_question: (question: string, context: NarrativeElement) => Promise<string>;
  request_explanation: (element: NarrativeElement) => Promise<string>;
  request_clarification: (element: NarrativeElement, aspect: string) => Promise<string>;
  
  // Current
  current_explanation: string | null;
  cited_sources: NarrativeSource[];
}

export function useNarrativeAgent(options: UseNarrativeAgentOptions = {}): UseNarrativeAgentReturn {
  const { enabled = true, agent: initial_agent } = options;
  
  const [agent, setAgent] = useState<NarrativeAgent | null>(
    enabled ? {
      id: 'narrative-agent',
      name: 'Narrative Guide',
      capabilities: NARRATIVE_AGENT_CAPABILITIES,
      is_present: true,
      ...initial_agent,
    } : null
  );
  
  const [current_explanation, setCurrentExplanation] = useState<string | null>(null);
  const [cited_sources, setCitedSources] = useState<NarrativeSource[]>([]);
  
  const ask_question = useCallback(async (question: string, context: NarrativeElement): Promise<string> => {
    if (!enabled) return 'Agent not enabled';
    
    // Simulate agent response
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = `Based on the narrative at "${context.title}", ${question.toLowerCase()} relates to the context: "${context.context_at_time}". [Source: ${context.source.type}]`;
    
    setCurrentExplanation(response);
    setCitedSources([context.source]);
    
    return response;
  }, [enabled]);
  
  const request_explanation = useCallback(async (element: NarrativeElement): Promise<string> => {
    if (!enabled) return 'Agent not enabled';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const explanation = `At this point ("${element.title}"), ${element.description}. The context was: "${element.context_at_time}".${element.intention_at_time ? ` The intention was: "${element.intention_at_time}".` : ''}`;
    
    setCurrentExplanation(explanation);
    setCitedSources([element.source]);
    
    return explanation;
  }, [enabled]);
  
  const request_clarification = useCallback(async (element: NarrativeElement, aspect: string): Promise<string> => {
    if (!enabled) return 'Agent not enabled';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const clarification = `Regarding "${aspect}" in "${element.title}": This ${element.type} occurred because ${element.description}. The uncertainty level at that time was ${(element.uncertainty_level || 0) * 100}%.`;
    
    setCurrentExplanation(clarification);
    setCitedSources([element.source]);
    
    return clarification;
  }, [enabled]);
  
  return {
    agent,
    is_enabled: enabled && agent !== null,
    capabilities: NARRATIVE_AGENT_CAPABILITIES,
    ask_question,
    request_explanation,
    request_clarification,
    current_explanation,
    cited_sources,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM NARRATIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTeamNarrativeOptions {
  is_team: boolean;
  participants?: NarrativeParticipant[];
  current_user_id: string;
}

export interface UseTeamNarrativeReturn {
  // State
  is_team_narrative: boolean;
  participants: NarrativeParticipant[];
  viewing_count: number;
  
  // Current user
  current_participant: NarrativeParticipant | null;
  
  // Perspectives
  get_contributor: (element_id: string) => NarrativeParticipant | undefined;
  get_perspective_color: (participant_id: string) => string;
  
  // Filtering
  filter_by_participant: (participant_id: string | null) => void;
  active_filter: string | null;
}

export function useTeamNarrative(options: UseTeamNarrativeOptions): UseTeamNarrativeReturn {
  const { is_team, participants: initial_participants = [], current_user_id } = options;
  
  const [participants, setParticipants] = useState<NarrativeParticipant[]>(initial_participants);
  const [active_filter, setActiveFilter] = useState<string | null>(null);
  
  // Perspective colors (subtle, distinct)
  const PERSPECTIVE_COLORS = [
    '#7A8B99',  // Blue-gray
    '#8B8899',  // Purple-gray
    '#8B9988',  // Green-gray
    '#99887A',  // Amber-gray
    '#8A9988',  // Teal-gray
    '#998B8A',  // Rose-gray
  ];
  
  const get_perspective_color = useCallback((participant_id: string): string => {
    const idx = participants.findIndex(p => p.id === participant_id);
    return PERSPECTIVE_COLORS[idx % PERSPECTIVE_COLORS.length];
  }, [participants]);
  
  const current_participant = useMemo(() => 
    participants.find(p => p.id === current_user_id) || null,
  [participants, current_user_id]);
  
  const viewing_count = useMemo(() => 
    participants.filter(p => p.is_viewing).length,
  [participants]);
  
  const get_contributor = useCallback((element_id: string) => 
    participants.find(p => p.elements_contributed.includes(element_id)),
  [participants]);
  
  const filter_by_participant = useCallback((participant_id: string | null) => {
    setActiveFilter(participant_id);
  }, []);
  
  return {
    is_team_narrative: is_team,
    participants,
    viewing_count,
    current_participant,
    get_contributor,
    get_perspective_color,
    filter_by_participant,
    active_filter,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEYBOARD CONTROLS HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNarrativeKeyboardOptions {
  enabled?: boolean;
  onExit: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedUp?: () => void;
  onSlowDown?: () => void;
  exitKey?: string;
}

export function useNarrativeKeyboard(options: UseNarrativeKeyboardOptions): void {
  const {
    enabled = true,
    onExit,
    onPlayPause,
    onNext,
    onPrevious,
    onSpeedUp,
    onSlowDown,
    exitKey = 'Escape',
  } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case exitKey:
          e.preventDefault();
          onExit();
          break;
        case ' ':  // Space
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onSpeedUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onSlowDown?.();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, exitKey, onExit, onPlayPause, onNext, onPrevious, onSpeedUp, onSlowDown]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRNarrativeReplayOptions {
  narrative: NarrativePath;
  user_id: string;
  auto_start?: boolean;
  spatial_config?: Partial<NarrativeSpatialConfig>;
  agent_enabled?: boolean;
  is_team?: boolean;
  participants?: NarrativeParticipant[];
  onExit?: () => void;
}

export interface UseXRNarrativeReplayReturn {
  // Replay
  replay: UseNarrativeReplayReturn;
  
  // Elements
  elements: UseNarrativeElementsReturn;
  
  // Comparison
  comparison: UseNarrativeComparisonReturn;
  
  // Agent
  agent: UseNarrativeAgentReturn;
  
  // Team
  team: UseTeamNarrativeReturn;
}

export function useXRNarrativeReplay(options: UseXRNarrativeReplayOptions): UseXRNarrativeReplayReturn {
  const {
    narrative,
    user_id,
    auto_start,
    spatial_config,
    agent_enabled = true,
    is_team = false,
    participants,
    onExit,
  } = options;
  
  const replay = useNarrativeReplay({
    narrative,
    user_id,
    auto_start,
    spatial_config,
  });
  
  const elements = useNarrativeElements({
    elements: narrative.elements,
    connections: narrative.connections,
  });
  
  const comparison = useNarrativeComparison({
    current_element: replay.current_element,
  });
  
  const agent = useNarrativeAgent({
    enabled: agent_enabled,
  });
  
  const team = useTeamNarrative({
    is_team,
    participants,
    current_user_id: user_id,
  });
  
  // Keyboard controls
  useNarrativeKeyboard({
    enabled: replay.is_active,
    onExit: () => {
      replay.end_replay();
      onExit?.();
    },
    onPlayPause: replay.toggle_playback,
    onNext: replay.go_to_next,
    onPrevious: replay.go_to_previous,
    onSpeedUp: () => replay.set_speed(replay.playback_speed + 0.5),
    onSlowDown: () => replay.set_speed(Math.max(0, replay.playback_speed - 0.5)),
  });
  
  return {
    replay,
    elements,
    comparison,
    agent,
    team,
  };
}
