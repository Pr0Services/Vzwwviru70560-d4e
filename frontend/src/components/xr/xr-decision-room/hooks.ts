/**
 * CHE·NU™ XR DECISION ROOM — HOOKS
 * 
 * Hooks for managing XR Decision Room state and interactions.
 * 
 * Core principle: Decisions are not rushed. They are crystallized.
 * 
 * @version 1.0
 * @status V51-ready
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type {
  DecisionRoomState,
  DecisionRoomConfig,
  DecisionRoomEntryReason,
  XRDecisionCore,
  XRDecisionOption,
  XRDecisionCriterion,
  XRConsequence,
  XRDecisionMeaning,
  DecisionSnapshotState,
  DecisionLoadState,
  DecisionZone,
  DecisionZoneType,
  CrystallizationRequirements,
  CrystallizationEvent,
  DecisionInteractionEvent,
  DecisionInteractionType,
  DecisionRoomAgent,
  OptionAssumption,
  OptionRisk,
  DecisionReversibility,
  DEFAULT_DECISION_ROOM_CONFIG,
  DECISION_ROOM_AGENT_CAPABILITIES,
} from './xr-decision-room.types';
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

function calculateOptionPosition(angle: number, distance: number): Vector3 {
  return {
    x: Math.cos(angle) * distance,
    y: 0,
    z: Math.sin(angle) * distance,
  };
}

function calculateCriterionPosition(angle: number, radius: number, height: number): Vector3 {
  return {
    x: Math.cos(angle) * radius,
    y: height,
    z: Math.sin(angle) * radius,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionRoom — MAIN ROOM STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionRoomOptions {
  entry_reason: DecisionRoomEntryReason;
  decision?: XRDecisionCore;
  config?: Partial<DecisionRoomConfig>;
  onEnter?: (session_id: string) => void;
  onExit?: () => void;
  onCrystallize?: (event: CrystallizationEvent) => void;
}

export interface UseDecisionRoomReturn {
  // State
  room_state: DecisionRoomState | null;
  is_entered: boolean;
  session_id: string | null;
  
  // Entry/Exit
  enterRoom: (decision?: XRDecisionCore) => void;
  exitRoom: () => void;
  
  // Configuration
  updateConfig: (updates: Partial<DecisionRoomConfig>) => void;
  
  // Navigation
  moveToZone: (zone: DecisionZoneType) => void;
  setUserPosition: (position: Vector3) => void;
  
  // Selection
  selectOption: (option_id: string | null) => void;
  hoverElement: (element_id: string | null) => void;
  
  // Crystallization
  canCrystallize: boolean;
  beginCrystallization: () => void;
  confirmCrystallization: (rationale: string, reversibility: DecisionReversibility) => void;
  cancelCrystallization: () => void;
}

export function useDecisionRoom(options: UseDecisionRoomOptions): UseDecisionRoomReturn {
  const { entry_reason, decision, config, onEnter, onExit, onCrystallize } = options;
  
  const [roomState, setRoomState] = useState<DecisionRoomState | null>(null);
  const [isEntered, setIsEntered] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCrystallizing, setIsCrystallizing] = useState(false);
  
  // Enter room
  const enterRoom = useCallback((decisionOverride?: XRDecisionCore) => {
    const newSessionId = generateId();
    const targetDecision = decisionOverride || decision;
    
    if (!targetDecision) {
      logger.warn('Cannot enter Decision Room without a decision');
      return;
    }
    
    const mergedConfig: DecisionRoomConfig = {
      ...DEFAULT_DECISION_ROOM_CONFIG,
      ...config,
    };
    
    const initialState: DecisionRoomState = {
      id: generateId(),
      session_id: newSessionId,
      entered_at: new Date().toISOString(),
      entry_reason,
      config: mergedConfig,
      decision: targetDecision,
      options: [],
      criteria: [],
      consequences: [],
      meanings: [],
      snapshot_state: {
        loaded: false,
        snapshot_id: targetDecision.linked_snapshot_id || null,
        frozen_context: false,
        show_comparison: false,
        label_visible: true,
      },
      load_state: {
        overall: 'moderate',
        option_count: 0,
        criterion_count: 0,
        consequence_complexity: 0,
        context_volatility: 0.3,
        time_pressure: 0.2,
        air_density: 0.5,
        visual_density: 0.4,
      },
      zones: [],
      user_position: createVector3(0, 0, 0),
      current_zone: 'center',
      walking_option_id: null,
      selected_option_id: null,
      hovered_element_id: null,
      agents: [],
      crystallization_requirements: {
        user_confirmed: false,
        rationale_provided: false,
        reversibility_declared: false,
      },
      can_crystallize: false,
    };
    
    setRoomState(initialState);
    setSessionId(newSessionId);
    setIsEntered(true);
    onEnter?.(newSessionId);
  }, [entry_reason, decision, config, onEnter]);
  
  // Exit room
  const exitRoom = useCallback(() => {
    setRoomState(null);
    setSessionId(null);
    setIsEntered(false);
    setIsCrystallizing(false);
    onExit?.();
  }, [onExit]);
  
  // Update config
  const updateConfig = useCallback((updates: Partial<DecisionRoomConfig>) => {
    setRoomState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        config: { ...prev.config, ...updates },
      };
    });
  }, []);
  
  // Move to zone
  const moveToZone = useCallback((zone: DecisionZoneType) => {
    setRoomState(prev => {
      if (!prev) return prev;
      
      // Calculate position based on zone
      let position: Vector3;
      switch (zone) {
        case 'center':
          position = createVector3(0, 0, 0);
          break;
        case 'option_nodes':
          position = createVector3(3, 0, 0);
          break;
        case 'criteria_ring':
          position = createVector3(0, 2, 2);
          break;
        case 'context_plane':
          position = createVector3(0, 0, -3);
          break;
        case 'consequence_field':
          position = createVector3(0, 0, 5);
          break;
        case 'meaning_field':
          position = createVector3(-3, 0, 0);
          break;
        default:
          position = prev.user_position;
      }
      
      return {
        ...prev,
        current_zone: zone,
        user_position: position,
      };
    });
  }, []);
  
  // Set user position
  const setUserPosition = useCallback((position: Vector3) => {
    setRoomState(prev => {
      if (!prev) return prev;
      return { ...prev, user_position: position };
    });
  }, []);
  
  // Select option
  const selectOption = useCallback((option_id: string | null) => {
    setRoomState(prev => {
      if (!prev) return prev;
      return { ...prev, selected_option_id: option_id };
    });
  }, []);
  
  // Hover element
  const hoverElement = useCallback((element_id: string | null) => {
    setRoomState(prev => {
      if (!prev) return prev;
      return { ...prev, hovered_element_id: element_id };
    });
  }, []);
  
  // Can crystallize
  const canCrystallize = useMemo(() => {
    if (!roomState) return false;
    const reqs = roomState.crystallization_requirements;
    return reqs.user_confirmed && reqs.rationale_provided && reqs.reversibility_declared;
  }, [roomState]);
  
  // Begin crystallization
  const beginCrystallization = useCallback(() => {
    if (!roomState?.selected_option_id) {
      logger.warn('Must select an option before crystallization');
      return;
    }
    setIsCrystallizing(true);
  }, [roomState]);
  
  // Confirm crystallization
  const confirmCrystallization = useCallback((
    rationale: string,
    reversibility: DecisionReversibility
  ) => {
    if (!roomState || !roomState.selected_option_id) return;
    
    const event: CrystallizationEvent = {
      decision_id: roomState.decision.id,
      selected_option_id: roomState.selected_option_id,
      rationale,
      reversibility,
      snapshot_id: roomState.snapshot_state.snapshot_id || undefined,
      timestamp: new Date().toISOString(),
      crystallized_by: roomState.decision.created_by,
      xr_session_logged: roomState.config.log_session,
    };
    
    setRoomState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        decision: {
          ...prev.decision,
          state: 'crystallized',
          crystallized_at: event.timestamp,
          crystallized_by: event.crystallized_by,
          selected_option_id: event.selected_option_id,
          rationale: event.rationale,
          reversibility: event.reversibility,
        },
        crystallization_requirements: {
          user_confirmed: true,
          rationale_provided: true,
          reversibility_declared: true,
        },
        can_crystallize: true,
      };
    });
    
    setIsCrystallizing(false);
    onCrystallize?.(event);
  }, [roomState, onCrystallize]);
  
  // Cancel crystallization
  const cancelCrystallization = useCallback(() => {
    setIsCrystallizing(false);
  }, []);
  
  return {
    room_state: roomState,
    is_entered: isEntered,
    session_id: sessionId,
    enterRoom,
    exitRoom,
    updateConfig,
    moveToZone,
    setUserPosition,
    selectOption,
    hoverElement,
    canCrystallize,
    beginCrystallization,
    confirmCrystallization,
    cancelCrystallization,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionOptions — OPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionOptionsReturn {
  options: XRDecisionOption[];
  
  addOption: (title: string, description: string) => XRDecisionOption;
  removeOption: (option_id: string) => void;
  updateOption: (option_id: string, updates: Partial<XRDecisionOption>) => void;
  
  walkOption: (option_id: string) => void;
  stopWalking: () => void;
  walking_option_id: string | null;
  
  addAssumption: (option_id: string, statement: string, confidence: OptionAssumption['confidence']) => void;
  addRisk: (option_id: string, description: string, severity: OptionRisk['severity']) => void;
  
  setWeight: (option_id: string, weight: number) => void;
  clearWeight: (option_id: string) => void;
}

export function useDecisionOptions(decision_id: string): UseDecisionOptionsReturn {
  const [options, setOptions] = useState<XRDecisionOption[]>([]);
  const [walkingOptionId, setWalkingOptionId] = useState<string | null>(null);
  
  // Add option (equidistant positioning)
  const addOption = useCallback((title: string, description: string): XRDecisionOption => {
    const newOption: XRDecisionOption = {
      id: generateId(),
      decision_id,
      title,
      description,
      path_angle: 0, // Will be recalculated
      path_length: 5,
      position: createVector3(5, 0, 0),
      color: '#8B8BA8', // Neutral
      opacity: 1,
      glow: 0.3,
      assumptions: [],
      risks: [],
      explored: false,
      selected: false,
    };
    
    setOptions(prev => {
      const updated = [...prev, newOption];
      // Recalculate angles for equidistance
      const angleStep = (2 * Math.PI) / updated.length;
      return updated.map((opt, i) => ({
        ...opt,
        path_angle: i * angleStep,
        position: calculateOptionPosition(i * angleStep, 5),
      }));
    });
    
    return newOption;
  }, [decision_id]);
  
  // Remove option
  const removeOption = useCallback((option_id: string) => {
    setOptions(prev => {
      const filtered = prev.filter(o => o.id !== option_id);
      // Recalculate angles
      const angleStep = filtered.length > 0 ? (2 * Math.PI) / filtered.length : 0;
      return filtered.map((opt, i) => ({
        ...opt,
        path_angle: i * angleStep,
        position: calculateOptionPosition(i * angleStep, 5),
      }));
    });
  }, []);
  
  // Update option
  const updateOption = useCallback((option_id: string, updates: Partial<XRDecisionOption>) => {
    setOptions(prev => prev.map(o => 
      o.id === option_id ? { ...o, ...updates } : o
    ));
  }, []);
  
  // Walk option path
  const walkOption = useCallback((option_id: string) => {
    setWalkingOptionId(option_id);
    setOptions(prev => prev.map(o => 
      o.id === option_id ? { ...o, explored: true } : o
    ));
  }, []);
  
  // Stop walking
  const stopWalking = useCallback(() => {
    setWalkingOptionId(null);
  }, []);
  
  // Add assumption
  const addAssumption = useCallback((
    option_id: string,
    statement: string,
    confidence: OptionAssumption['confidence']
  ) => {
    setOptions(prev => prev.map(o => {
      if (o.id !== option_id) return o;
      return {
        ...o,
        assumptions: [...o.assumptions, {
          id: generateId(),
          statement,
          confidence,
        }],
      };
    }));
  }, []);
  
  // Add risk
  const addRisk = useCallback((
    option_id: string,
    description: string,
    severity: OptionRisk['severity']
  ) => {
    setOptions(prev => prev.map(o => {
      if (o.id !== option_id) return o;
      return {
        ...o,
        risks: [...o.risks, {
          id: generateId(),
          description,
          severity,
        }],
      };
    }));
  }, []);
  
  // Set weight (explicit only)
  const setWeight = useCallback((option_id: string, weight: number) => {
    setOptions(prev => prev.map(o => 
      o.id === option_id ? { ...o, explicit_weight: weight } : o
    ));
  }, []);
  
  // Clear weight
  const clearWeight = useCallback((option_id: string) => {
    setOptions(prev => prev.map(o => 
      o.id === option_id ? { ...o, explicit_weight: undefined } : o
    ));
  }, []);
  
  return {
    options,
    addOption,
    removeOption,
    updateOption,
    walkOption,
    stopWalking,
    walking_option_id: walkingOptionId,
    addAssumption,
    addRisk,
    setWeight,
    clearWeight,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionCriteria — CRITERIA MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionCriteriaReturn {
  criteria: XRDecisionCriterion[];
  
  addCriterion: (name: string, description: string) => XRDecisionCriterion;
  removeCriterion: (criterion_id: string) => void;
  
  toggleCriterion: (criterion_id: string) => void;
  setCriterionWeight: (criterion_id: string, weight: number) => void;
  clearCriterionWeight: (criterion_id: string) => void;
  
  showAllWeights: () => void;
  hideAllWeights: () => void;
}

export function useDecisionCriteria(decision_id: string): UseDecisionCriteriaReturn {
  const [criteria, setCriteria] = useState<XRDecisionCriterion[]>([]);
  
  // Add criterion (orbiting position)
  const addCriterion = useCallback((name: string, description: string): XRDecisionCriterion => {
    const newCriterion: XRDecisionCriterion = {
      id: generateId(),
      decision_id,
      name,
      description,
      orbit_radius: 3,
      orbit_angle: 0,
      position: createVector3(3, 1.5, 0),
      weight_visible: false,
      active: true,
    };
    
    setCriteria(prev => {
      const updated = [...prev, newCriterion];
      // Recalculate orbits
      const angleStep = (2 * Math.PI) / updated.length;
      return updated.map((crit, i) => ({
        ...crit,
        orbit_angle: i * angleStep,
        position: calculateCriterionPosition(i * angleStep, 3, 1.5),
      }));
    });
    
    return newCriterion;
  }, [decision_id]);
  
  // Remove criterion
  const removeCriterion = useCallback((criterion_id: string) => {
    setCriteria(prev => {
      const filtered = prev.filter(c => c.id !== criterion_id);
      const angleStep = filtered.length > 0 ? (2 * Math.PI) / filtered.length : 0;
      return filtered.map((crit, i) => ({
        ...crit,
        orbit_angle: i * angleStep,
        position: calculateCriterionPosition(i * angleStep, 3, 1.5),
      }));
    });
  }, []);
  
  // Toggle criterion visibility
  const toggleCriterion = useCallback((criterion_id: string) => {
    setCriteria(prev => prev.map(c => 
      c.id === criterion_id ? { ...c, active: !c.active } : c
    ));
  }, []);
  
  // Set weight
  const setCriterionWeight = useCallback((criterion_id: string, weight: number) => {
    setCriteria(prev => prev.map(c => 
      c.id === criterion_id ? { ...c, weight, weight_visible: true } : c
    ));
  }, []);
  
  // Clear weight
  const clearCriterionWeight = useCallback((criterion_id: string) => {
    setCriteria(prev => prev.map(c => 
      c.id === criterion_id ? { ...c, weight: undefined, weight_visible: false } : c
    ));
  }, []);
  
  // Show all weights
  const showAllWeights = useCallback(() => {
    setCriteria(prev => prev.map(c => ({ ...c, weight_visible: true })));
  }, []);
  
  // Hide all weights
  const hideAllWeights = useCallback(() => {
    setCriteria(prev => prev.map(c => ({ ...c, weight_visible: false })));
  }, []);
  
  return {
    criteria,
    addCriterion,
    removeCriterion,
    toggleCriterion,
    setCriterionWeight,
    clearCriterionWeight,
    showAllWeights,
    hideAllWeights,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionConsequences — CONSEQUENCE PROJECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionConsequencesReturn {
  consequences: XRConsequence[];
  
  addConsequence: (
    option_id: string,
    description: string,
    timeframe: XRConsequence['timeframe'],
    impact_type: XRConsequence['impact_type']
  ) => XRConsequence;
  
  removeConsequence: (consequence_id: string) => void;
  updateConsequence: (consequence_id: string, updates: Partial<XRConsequence>) => void;
  
  getConsequencesForOption: (option_id: string) => XRConsequence[];
  
  setCertainty: (consequence_id: string, certainty: number) => void;
}

export function useDecisionConsequences(): UseDecisionConsequencesReturn {
  const [consequences, setConsequences] = useState<XRConsequence[]>([]);
  
  // Add consequence
  const addConsequence = useCallback((
    option_id: string,
    description: string,
    timeframe: XRConsequence['timeframe'],
    impact_type: XRConsequence['impact_type']
  ): XRConsequence => {
    // Distance based on timeframe
    const distanceMap = {
      immediate: 2,
      short_term: 4,
      medium_term: 6,
      long_term: 8,
    };
    
    const distance = distanceMap[timeframe];
    const angle = Math.random() * Math.PI * 2;
    
    const newConsequence: XRConsequence = {
      id: generateId(),
      option_id,
      description,
      timeframe,
      position: {
        x: Math.cos(angle) * distance,
        y: 0,
        z: Math.sin(angle) * distance + 5,
      },
      distance_from_option: distance,
      certainty: 0.7,
      impact_type,
    };
    
    setConsequences(prev => [...prev, newConsequence]);
    return newConsequence;
  }, []);
  
  // Remove consequence
  const removeConsequence = useCallback((consequence_id: string) => {
    setConsequences(prev => prev.filter(c => c.id !== consequence_id));
  }, []);
  
  // Update consequence
  const updateConsequence = useCallback((
    consequence_id: string,
    updates: Partial<XRConsequence>
  ) => {
    setConsequences(prev => prev.map(c => 
      c.id === consequence_id ? { ...c, ...updates } : c
    ));
  }, []);
  
  // Get consequences for option
  const getConsequencesForOption = useCallback((option_id: string): XRConsequence[] => {
    return consequences.filter(c => c.option_id === option_id);
  }, [consequences]);
  
  // Set certainty
  const setCertainty = useCallback((consequence_id: string, certainty: number) => {
    setConsequences(prev => prev.map(c => 
      c.id === consequence_id ? { ...c, certainty: Math.max(0, Math.min(1, certainty)) } : c
    ));
  }, []);
  
  return {
    consequences,
    addConsequence,
    removeConsequence,
    updateConsequence,
    getConsequencesForOption,
    setCertainty,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionMeaning — MEANING ALIGNMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionMeaningReturn {
  meanings: XRDecisionMeaning[];
  
  addMeaning: (
    meaning_id: string,
    statement: string,
    purpose_domain: string
  ) => XRDecisionMeaning;
  
  removeMeaning: (id: string) => void;
  
  setOptionAlignment: (
    meaning_item_id: string,
    option_id: string,
    alignment: 'aligned' | 'neutral' | 'tension' | 'conflict'
  ) => void;
  
  getMeaningsForOption: (option_id: string) => XRDecisionMeaning[];
}

export function useDecisionMeaning(): UseDecisionMeaningReturn {
  const [meanings, setMeanings] = useState<XRDecisionMeaning[]>([]);
  
  // Add meaning
  const addMeaning = useCallback((
    meaning_id: string,
    statement: string,
    purpose_domain: string
  ): XRDecisionMeaning => {
    const newMeaning: XRDecisionMeaning = {
      id: generateId(),
      meaning_id,
      statement,
      purpose_domain,
      influence_center: createVector3(-3, 1, 0),
      influence_radius: 4,
      alignment_with_options: [],
    };
    
    setMeanings(prev => [...prev, newMeaning]);
    return newMeaning;
  }, []);
  
  // Remove meaning
  const removeMeaning = useCallback((id: string) => {
    setMeanings(prev => prev.filter(m => m.id !== id));
  }, []);
  
  // Set option alignment
  const setOptionAlignment = useCallback((
    meaning_item_id: string,
    option_id: string,
    alignment: 'aligned' | 'neutral' | 'tension' | 'conflict'
  ) => {
    setMeanings(prev => prev.map(m => {
      if (m.id !== meaning_item_id) return m;
      
      const existing = m.alignment_with_options.find(a => a.option_id === option_id);
      if (existing) {
        return {
          ...m,
          alignment_with_options: m.alignment_with_options.map(a =>
            a.option_id === option_id ? { ...a, alignment } : a
          ),
        };
      }
      
      return {
        ...m,
        alignment_with_options: [...m.alignment_with_options, { option_id, alignment }],
      };
    }));
  }, []);
  
  // Get meanings for option
  const getMeaningsForOption = useCallback((option_id: string): XRDecisionMeaning[] => {
    return meanings.filter(m => 
      m.alignment_with_options.some(a => a.option_id === option_id)
    );
  }, [meanings]);
  
  return {
    meanings,
    addMeaning,
    removeMeaning,
    setOptionAlignment,
    getMeaningsForOption,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionRoomAgents — AGENT PRESENCE
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionRoomAgentsReturn {
  agents: DecisionRoomAgent[];
  
  inviteAgent: (agent_id: string, name: string) => void;
  dismissAgent: (agent_id: string) => void;
  
  requestExplanation: (agent_id: string, topic: string) => void;
  requestConsequenceSimulation: (agent_id: string, option_id: string) => void;
  requestContradictionSurface: (agent_id: string) => void;
  
  getAgentCapabilities: () => typeof DECISION_ROOM_AGENT_CAPABILITIES;
}

export function useDecisionRoomAgents(): UseDecisionRoomAgentsReturn {
  const [agents, setAgents] = useState<DecisionRoomAgent[]>([]);
  
  // Invite agent
  const inviteAgent = useCallback((agent_id: string, name: string) => {
    setAgents(prev => {
      if (prev.some(a => a.agent_id === agent_id)) return prev;
      
      return [...prev, {
        id: generateId(),
        agent_id,
        name,
        present: true,
        position: createVector3(-2, 0, -2),
        cited_sources: [],
        contract_boundaries: [],
      }];
    });
  }, []);
  
  // Dismiss agent
  const dismissAgent = useCallback((agent_id: string) => {
    setAgents(prev => prev.filter(a => a.agent_id !== agent_id));
  }, []);
  
  // Request explanation (agent MAY do this)
  const requestExplanation = useCallback((agent_id: string, topic: string) => {
    logger.debug(`Agent ${agent_id} explaining: ${topic}`);
    // Agent provides explanation without recommendation
  }, []);
  
  // Request consequence simulation (agent MAY do this)
  const requestConsequenceSimulation = useCallback((agent_id: string, option_id: string) => {
    logger.debug(`Agent ${agent_id} simulating consequences for option: ${option_id}`);
    // Agent simulates without prioritizing
  }, []);
  
  // Request contradiction surface (agent MAY do this)
  const requestContradictionSurface = useCallback((agent_id: string) => {
    logger.debug(`Agent ${agent_id} surfacing contradictions`);
    // Agent surfaces contradictions without resolution
  }, []);
  
  // Get agent capabilities
  const getAgentCapabilities = useCallback(() => {
    return DECISION_ROOM_AGENT_CAPABILITIES;
  }, []);
  
  return {
    agents,
    inviteAgent,
    dismissAgent,
    requestExplanation,
    requestConsequenceSimulation,
    requestContradictionSurface,
    getAgentCapabilities,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionRoomInteractions — INTERACTION TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionRoomInteractionsReturn {
  interactions: DecisionInteractionEvent[];
  
  recordInteraction: (
    type: DecisionInteractionType,
    user_position: Vector3,
    target_id?: string,
    target_type?: string,
    data?: Record<string, unknown>
  ) => void;
  
  getInteractionHistory: () => DecisionInteractionEvent[];
  clearHistory: () => void;
}

export function useDecisionRoomInteractions(): UseDecisionRoomInteractionsReturn {
  const [interactions, setInteractions] = useState<DecisionInteractionEvent[]>([]);
  
  // Record interaction
  const recordInteraction = useCallback((
    type: DecisionInteractionType,
    user_position: Vector3,
    target_id?: string,
    target_type?: string,
    data?: Record<string, unknown>
  ) => {
    const event: DecisionInteractionEvent = {
      type,
      timestamp: new Date().toISOString(),
      target_id,
      target_type,
      user_position,
      data,
    };
    
    setInteractions(prev => [...prev, event]);
  }, []);
  
  // Get history
  const getInteractionHistory = useCallback(() => interactions, [interactions]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setInteractions([]);
  }, []);
  
  return {
    interactions,
    recordInteraction,
    getInteractionHistory,
    clearHistory,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useDecisionRoomAll — COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseDecisionRoomAllOptions extends UseDecisionRoomOptions {
  decision_id: string;
}

export function useDecisionRoomAll(options: UseDecisionRoomAllOptions) {
  const room = useDecisionRoom(options);
  const optionsHook = useDecisionOptions(options.decision_id);
  const criteriaHook = useDecisionCriteria(options.decision_id);
  const consequencesHook = useDecisionConsequences();
  const meaningHook = useDecisionMeaning();
  const agentsHook = useDecisionRoomAgents();
  const interactionsHook = useDecisionRoomInteractions();
  
  return {
    ...room,
    options: optionsHook,
    criteria: criteriaHook,
    consequences: consequencesHook,
    meaning: meaningHook,
    agents: agentsHook,
    interactions: interactionsHook,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useDecisionRoom,
  useDecisionOptions,
  useDecisionCriteria,
  useDecisionConsequences,
  useDecisionMeaning,
  useDecisionRoomAgents,
  useDecisionRoomInteractions,
  useDecisionRoomAll,
};
