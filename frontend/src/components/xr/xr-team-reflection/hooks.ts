/**
 * CHE·NU™ XR TEAM REFLECTION — HOOKS
 * 
 * Hooks for managing XR Team Reflection state and interactions.
 * 
 * Core principle: Presence is equal by design.
 * 
 * @version 1.0
 * @status V51-ready
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  TeamReflectionRoomState,
  TeamReflectionConfig,
  TeamReflectionParticipant,
  TeamReflectionInvitation,
  ReflectionScope,
  TeamReflectionZone,
  TeamReflectionZoneType,
  SharedMeaning,
  SharedThread,
  SharedDecision,
  TeamLoadState,
  SilenceZone,
  TeamReflectionAgent,
  TeamReflectionInteractionEvent,
  TeamReflectionInteractionType,
  ExitEvent,
  ExitMethod,
  DEFAULT_TEAM_REFLECTION_CONFIG,
  TEAM_REFLECTION_AGENT_CAPABILITIES,
} from './xr-team-reflection.types';
import type { Vector3 } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createVector3(x = 0, y = 0, z = 0): Vector3 {
  return { x, y, z };
}

function calculateCircularPosition(index: number, total: number, radius: number): Vector3 {
  const angle = (index / total) * Math.PI * 2;
  return {
    x: Math.cos(angle) * radius,
    y: 0,
    z: Math.sin(angle) * radius,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTeamReflection — MAIN ROOM STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTeamReflectionOptions {
  session_id: string;
  scope: ReflectionScope;
  current_user_id: string;
  config?: Partial<TeamReflectionConfig>;
  onJoin?: (participant: TeamReflectionParticipant) => void;
  onLeave?: (exit: ExitEvent) => void;
}

export interface UseTeamReflectionReturn {
  // State
  room_state: TeamReflectionRoomState | null;
  is_joined: boolean;
  current_participant: TeamReflectionParticipant | null;
  
  // Join/Leave
  joinSession: (display_name?: string, avatar_style?: TeamReflectionParticipant['avatar_style']) => void;
  leaveSession: (method: ExitMethod) => void;
  
  // Configuration
  updateConfig: (updates: Partial<TeamReflectionConfig>) => void;
  
  // Zone navigation
  moveToZone: (zone: TeamReflectionZoneType) => void;
  getCurrentZone: () => TeamReflectionZoneType | null;
  
  // Silence
  enterSilence: () => void;
  exitSilence: () => void;
  isInSilence: boolean;
}

export function useTeamReflection(options: UseTeamReflectionOptions): UseTeamReflectionReturn {
  const { session_id, scope, current_user_id, config, onJoin, onLeave } = options;
  
  const [roomState, setRoomState] = useState<TeamReflectionRoomState | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<TeamReflectionParticipant | null>(null);
  const [isInSilence, setIsInSilence] = useState(false);
  
  // Join session
  const joinSession = useCallback((
    display_name?: string,
    avatar_style: TeamReflectionParticipant['avatar_style'] = 'minimal'
  ) => {
    const mergedConfig: TeamReflectionConfig = {
      ...DEFAULT_TEAM_REFLECTION_CONFIG,
      ...config,
    };
    
    const participant: TeamReflectionParticipant = {
      id: generateId(),
      user_id: current_user_id,
      display_name,
      avatar_style,
      position: createVector3(0, 0, 0), // Will be recalculated
      seat_index: 0,
      present: true,
      joined_at: new Date().toISOString(),
      consent_given: true,
      is_speaking: false,
      has_acknowledged: false,
      silence_mode: false,
    };
    
    const initialState: TeamReflectionRoomState = {
      id: generateId(),
      session_id,
      started_at: new Date().toISOString(),
      config: mergedConfig,
      scope,
      participants: [participant],
      max_participants: 12,
      shared_meanings: [],
      shared_threads: [],
      shared_decisions: [],
      zones: [],
      silence_zone: {
        id: generateId(),
        position: createVector3(-5, 0, 0),
        radius: 2,
        participants: [],
        active: true,
      },
      team_load: {
        aggregated_level: 'moderate',
        environmental_tone: 'present',
        participants_in_light: 1,
        participants_in_heavy: 0,
      },
      agents: [],
      is_active: true,
      recording_consented: false,
    };
    
    setRoomState(initialState);
    setCurrentParticipant(participant);
    setIsJoined(true);
    onJoin?.(participant);
  }, [session_id, scope, current_user_id, config, onJoin]);
  
  // Leave session
  const leaveSession = useCallback((method: ExitMethod) => {
    if (!currentParticipant) return;
    
    const exitEvent: ExitEvent = {
      participant_id: currentParticipant.id,
      method,
      timestamp: new Date().toISOString(),
      session_still_active: (roomState?.participants.length ?? 0) > 1,
      presence_cleared: true,
    };
    
    setRoomState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.filter(p => p.id !== currentParticipant.id),
      };
    });
    
    setCurrentParticipant(null);
    setIsJoined(false);
    setIsInSilence(false);
    onLeave?.(exitEvent);
  }, [currentParticipant, roomState, onLeave]);
  
  // Update config
  const updateConfig = useCallback((updates: Partial<TeamReflectionConfig>) => {
    setRoomState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        config: { ...prev.config, ...updates },
      };
    });
  }, []);
  
  // Move to zone
  const moveToZone = useCallback((zone: TeamReflectionZoneType) => {
    if (!currentParticipant) return;
    
    let position: Vector3;
    switch (zone) {
      case 'center':
        position = createVector3(0, 0, 0);
        break;
      case 'meaning_field':
        position = createVector3(-3, 0, 0);
        break;
      case 'thread_map':
        position = createVector3(3, 0, 0);
        break;
      case 'decision_archive':
        position = createVector3(0, 0, -3);
        break;
      case 'load_ambience':
        position = createVector3(0, 0, 3);
        break;
      case 'silence_zone':
        position = createVector3(-5, 0, 0);
        setIsInSilence(true);
        break;
      default:
        position = currentParticipant.position;
    }
    
    setCurrentParticipant(prev => {
      if (!prev) return prev;
      return { ...prev, position };
    });
    
    setRoomState(prev => {
      if (!prev || !currentParticipant) return prev;
      return {
        ...prev,
        participants: prev.participants.map(p =>
          p.id === currentParticipant.id ? { ...p, position } : p
        ),
      };
    });
  }, [currentParticipant]);
  
  // Get current zone
  const getCurrentZone = useCallback((): TeamReflectionZoneType | null => {
    if (!currentParticipant) return null;
    
    const { x, z } = currentParticipant.position;
    const dist = Math.sqrt(x * x + z * z);
    
    if (dist < 1) return 'center';
    if (x < -4) return 'silence_zone';
    if (x < -2) return 'meaning_field';
    if (x > 2) return 'thread_map';
    if (z < -2) return 'decision_archive';
    if (z > 2) return 'load_ambience';
    
    return 'center';
  }, [currentParticipant]);
  
  // Enter silence
  const enterSilence = useCallback(() => {
    moveToZone('silence_zone');
    setIsInSilence(true);
    
    setCurrentParticipant(prev => {
      if (!prev) return prev;
      return { ...prev, silence_mode: true };
    });
  }, [moveToZone]);
  
  // Exit silence
  const exitSilence = useCallback(() => {
    setIsInSilence(false);
    
    setCurrentParticipant(prev => {
      if (!prev) return prev;
      return { ...prev, silence_mode: false };
    });
    
    moveToZone('center');
  }, [moveToZone]);
  
  return {
    room_state: roomState,
    is_joined: isJoined,
    current_participant: currentParticipant,
    joinSession,
    leaveSession,
    updateConfig,
    moveToZone,
    getCurrentZone,
    enterSilence,
    exitSilence,
    isInSilence,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useSharedMeaning — SHARED MEANING MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSharedMeaningReturn {
  meanings: SharedMeaning[];
  
  addMeaning: (statement: string, domain: string) => SharedMeaning;
  acknowledgeMeaning: (meaning_id: string, participant_id: string) => void;
  markMisalignment: (meaning_id: string, participant_id: string, notes?: string) => void;
  
  getAcknowledgedBy: (meaning_id: string) => string[];
  hasConflict: (meaning_id: string) => boolean;
}

export function useSharedMeaning(): UseSharedMeaningReturn {
  const [meanings, setMeanings] = useState<SharedMeaning[]>([]);
  
  // Add meaning
  const addMeaning = useCallback((statement: string, domain: string): SharedMeaning => {
    const newMeaning: SharedMeaning = {
      id: generateId(),
      meaning_id: generateId(),
      statement,
      domain,
      position: createVector3(-3 + Math.random() * 2, 1 + Math.random(), Math.random() * 2 - 1),
      influence_radius: 2,
      visibility: 'visible',
      acknowledged_by: [],
      conflict_marked_by: [],
      has_conflict: false,
    };
    
    setMeanings(prev => [...prev, newMeaning]);
    return newMeaning;
  }, []);
  
  // Acknowledge meaning
  const acknowledgeMeaning = useCallback((meaning_id: string, participant_id: string) => {
    setMeanings(prev => prev.map(m => {
      if (m.id !== meaning_id) return m;
      if (m.acknowledged_by.includes(participant_id)) return m;
      
      return {
        ...m,
        acknowledged_by: [...m.acknowledged_by, participant_id],
      };
    }));
  }, []);
  
  // Mark misalignment (gently)
  const markMisalignment = useCallback((
    meaning_id: string,
    participant_id: string,
    notes?: string
  ) => {
    setMeanings(prev => prev.map(m => {
      if (m.id !== meaning_id) return m;
      
      return {
        ...m,
        conflict_marked_by: [...m.conflict_marked_by, participant_id],
        conflict_notes: notes ? [...(m.conflict_notes || []), notes] : m.conflict_notes,
        has_conflict: true,
      };
    }));
  }, []);
  
  // Get acknowledged by
  const getAcknowledgedBy = useCallback((meaning_id: string): string[] => {
    const meaning = meanings.find(m => m.id === meaning_id);
    return meaning?.acknowledged_by || [];
  }, [meanings]);
  
  // Has conflict
  const hasConflict = useCallback((meaning_id: string): boolean => {
    const meaning = meanings.find(m => m.id === meaning_id);
    return meaning?.has_conflict || false;
  }, [meanings]);
  
  return {
    meanings,
    addMeaning,
    acknowledgeMeaning,
    markMisalignment,
    getAcknowledgedBy,
    hasConflict,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useSharedThreads — SHARED THREADS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSharedThreadsReturn {
  threads: SharedThread[];
  
  loadThread: (thread_id: string, title: string, summary: string, contributors: string[]) => SharedThread;
  highlightThread: (thread_id: string) => void;
  unhighlightThread: (thread_id: string) => void;
  setDiscussing: (thread_id: string, discussing: boolean) => void;
  
  getHighlightedThreads: () => SharedThread[];
}

export function useSharedThreads(): UseSharedThreadsReturn {
  const [threads, setThreads] = useState<SharedThread[]>([]);
  
  // Load thread
  const loadThread = useCallback((
    thread_id: string,
    title: string,
    summary: string,
    contributors: string[]
  ): SharedThread => {
    const newThread: SharedThread = {
      id: generateId(),
      thread_id,
      title,
      summary,
      path_points: [
        createVector3(3, 0, -1),
        createVector3(4, 0.5, 0),
        createVector3(3, 0, 1),
      ],
      thickness: 0.1,
      contributors,
      highlighted: false,
      being_discussed: false,
    };
    
    setThreads(prev => [...prev, newThread]);
    return newThread;
  }, []);
  
  // Highlight thread
  const highlightThread = useCallback((thread_id: string) => {
    setThreads(prev => prev.map(t =>
      t.thread_id === thread_id ? { ...t, highlighted: true } : t
    ));
  }, []);
  
  // Unhighlight thread
  const unhighlightThread = useCallback((thread_id: string) => {
    setThreads(prev => prev.map(t =>
      t.thread_id === thread_id ? { ...t, highlighted: false } : t
    ));
  }, []);
  
  // Set discussing
  const setDiscussing = useCallback((thread_id: string, discussing: boolean) => {
    setThreads(prev => prev.map(t =>
      t.thread_id === thread_id ? { ...t, being_discussed: discussing } : t
    ));
  }, []);
  
  // Get highlighted
  const getHighlightedThreads = useCallback((): SharedThread[] => {
    return threads.filter(t => t.highlighted);
  }, [threads]);
  
  return {
    threads,
    loadThread,
    highlightThread,
    unhighlightThread,
    setDiscussing,
    getHighlightedThreads,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useSharedDecisions — SHARED DECISIONS MANAGEMENT (READ-ONLY)
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSharedDecisionsReturn {
  decisions: SharedDecision[];
  
  loadDecision: (
    decision_id: string,
    title: string,
    question: string,
    selected_option: string,
    rationale: string,
    crystallized_by: string
  ) => SharedDecision;
  
  setReviewing: (decision_id: string, reviewing: boolean) => void;
  
  // Reflection ≠ decision-making
  // All decisions are read-only
}

export function useSharedDecisions(): UseSharedDecisionsReturn {
  const [decisions, setDecisions] = useState<SharedDecision[]>([]);
  
  // Load decision (read-only)
  const loadDecision = useCallback((
    decision_id: string,
    title: string,
    question: string,
    selected_option: string,
    rationale: string,
    crystallized_by: string
  ): SharedDecision => {
    const newDecision: SharedDecision = {
      id: generateId(),
      decision_id,
      title,
      question,
      selected_option,
      rationale,
      position: createVector3(0, 0, -3 - decisions.length * 0.5),
      crystallized_by,
      is_read_only: true,  // Always read-only
      being_reviewed: false,
    };
    
    setDecisions(prev => [...prev, newDecision]);
    return newDecision;
  }, [decisions.length]);
  
  // Set reviewing
  const setReviewing = useCallback((decision_id: string, reviewing: boolean) => {
    setDecisions(prev => prev.map(d =>
      d.decision_id === decision_id ? { ...d, being_reviewed: reviewing } : d
    ));
  }, []);
  
  return {
    decisions,
    loadDecision,
    setReviewing,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTeamLoad — AGGREGATED TEAM LOAD
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTeamLoadReturn {
  team_load: TeamLoadState;
  
  // Load is aggregated and anonymized
  // No individual exposure
  getEnvironmentalTone: () => TeamLoadState['environmental_tone'];
}

export function useTeamLoad(participant_count: number): UseTeamLoadReturn {
  const [teamLoad, setTeamLoad] = useState<TeamLoadState>({
    aggregated_level: 'moderate',
    environmental_tone: 'present',
    participants_in_light: participant_count,
    participants_in_heavy: 0,
  });
  
  // Update based on participant count (simulated aggregation)
  useEffect(() => {
    const inLight = Math.floor(participant_count * 0.7);
    const inHeavy = participant_count - inLight;
    
    let level: TeamLoadState['aggregated_level'] = 'moderate';
    let tone: TeamLoadState['environmental_tone'] = 'present';
    
    if (inHeavy > participant_count * 0.5) {
      level = 'heavy';
      tone = 'weighted';
    } else if (inHeavy > participant_count * 0.3) {
      level = 'moderate';
      tone = 'present';
    } else {
      level = 'light';
      tone = 'open';
    }
    
    setTeamLoad({
      aggregated_level: level,
      environmental_tone: tone,
      participants_in_light: inLight,
      participants_in_heavy: inHeavy,
    });
  }, [participant_count]);
  
  const getEnvironmentalTone = useCallback(() => teamLoad.environmental_tone, [teamLoad]);
  
  return {
    team_load: teamLoad,
    getEnvironmentalTone,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTeamReflectionAgents — AGENT PRESENCE (OBSERVERS ONLY)
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTeamReflectionAgentsReturn {
  agents: TeamReflectionAgent[];
  
  inviteAgent: (agent_id: string, name: string) => void;
  dismissAgent: (agent_id: string) => void;
  
  requestSummary: (agent_id: string) => void;
  requestClarification: (agent_id: string, topic: string) => void;
  
  getAgentCapabilities: () => typeof TEAM_REFLECTION_AGENT_CAPABILITIES;
}

export function useTeamReflectionAgents(): UseTeamReflectionAgentsReturn {
  const [agents, setAgents] = useState<TeamReflectionAgent[]>([]);
  
  // Invite agent (as observer only)
  const inviteAgent = useCallback((agent_id: string, name: string) => {
    setAgents(prev => {
      if (prev.some(a => a.agent_id === agent_id)) return prev;
      
      return [...prev, {
        id: generateId(),
        agent_id,
        name,
        present: true,
        position: createVector3(0, 0, 4),
        role: 'observer' as const,  // Always observer
      }];
    });
  }, []);
  
  // Dismiss agent
  const dismissAgent = useCallback((agent_id: string) => {
    setAgents(prev => prev.filter(a => a.agent_id !== agent_id));
  }, []);
  
  // Request summary (agent MAY do this)
  const requestSummary = useCallback((agent_id: string) => {
    logger.debug(`Agent ${agent_id} providing summary`);
    // Agent summarizes without moderating
  }, []);
  
  // Request clarification (agent MAY do this)
  const requestClarification = useCallback((agent_id: string, topic: string) => {
    logger.debug(`Agent ${agent_id} clarifying: ${topic}`);
    // Agent clarifies without steering
  }, []);
  
  // Get capabilities
  const getAgentCapabilities = useCallback(() => TEAM_REFLECTION_AGENT_CAPABILITIES, []);
  
  return {
    agents,
    inviteAgent,
    dismissAgent,
    requestSummary,
    requestClarification,
    getAgentCapabilities,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTeamReflectionInteractions — INTERACTION TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTeamReflectionInteractionsReturn {
  interactions: TeamReflectionInteractionEvent[];
  
  recordInteraction: (
    type: TeamReflectionInteractionType,
    participant_id: string,
    target_id?: string,
    target_type?: string,
    data?: Record<string, unknown>
  ) => void;
  
  getInteractionHistory: () => TeamReflectionInteractionEvent[];
}

export function useTeamReflectionInteractions(): UseTeamReflectionInteractionsReturn {
  const [interactions, setInteractions] = useState<TeamReflectionInteractionEvent[]>([]);
  
  const recordInteraction = useCallback((
    type: TeamReflectionInteractionType,
    participant_id: string,
    target_id?: string,
    target_type?: string,
    data?: Record<string, unknown>
  ) => {
    const event: TeamReflectionInteractionEvent = {
      type,
      participant_id,
      timestamp: new Date().toISOString(),
      target_id,
      target_type,
      data,
    };
    
    setInteractions(prev => [...prev, event]);
  }, []);
  
  const getInteractionHistory = useCallback(() => interactions, [interactions]);
  
  return {
    interactions,
    recordInteraction,
    getInteractionHistory,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useTeamReflectionAll — COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useTeamReflectionAll(options: UseTeamReflectionOptions) {
  const room = useTeamReflection(options);
  const meaningHook = useSharedMeaning();
  const threadsHook = useSharedThreads();
  const decisionsHook = useSharedDecisions();
  const loadHook = useTeamLoad(room.room_state?.participants.length ?? 0);
  const agentsHook = useTeamReflectionAgents();
  const interactionsHook = useTeamReflectionInteractions();
  
  return {
    ...room,
    meaning: meaningHook,
    threads: threadsHook,
    decisions: decisionsHook,
    load: loadHook,
    agents: agentsHook,
    interactions: interactionsHook,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useTeamReflection,
  useSharedMeaning,
  useSharedThreads,
  useSharedDecisions,
  useTeamLoad,
  useTeamReflectionAgents,
  useTeamReflectionInteractions,
  useTeamReflectionAll,
};
