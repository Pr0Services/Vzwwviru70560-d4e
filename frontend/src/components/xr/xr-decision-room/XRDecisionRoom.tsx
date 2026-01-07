/**
 * CHE·NU™ XR DECISION ROOM — MAIN COMPONENT
 * 
 * XR Decision Room exists to support conscious, accountable
 * decision-making in complex contexts.
 * 
 * It is NOT a debate arena.
 * It is NOT a persuasion space.
 * It is NOT a productivity accelerator.
 * 
 * Decisions are not rushed here. They are crystallized.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type {
  XRDecisionRoomProps,
  XRDecisionCore,
  XRDecisionOption,
  XRDecisionCriterion,
  XRConsequence,
  XRDecisionMeaning,
  DecisionRoomState,
  DecisionZoneType,
  DecisionInteractionEvent,
  CrystallizationEvent,
  DecisionReversibility,
  XR_DECISION_ROOM_TOKENS,
} from './xr-decision-room.types';
import {
  useDecisionRoom,
  useDecisionOptions,
  useDecisionCriteria,
  useDecisionConsequences,
  useDecisionMeaning,
  useDecisionRoomAgents,
  useDecisionRoomInteractions,
} from './hooks';
import type { Vector3 } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Decision Core — Center of the room
 */
interface DecisionCoreProps {
  decision: XRDecisionCore;
  selected_option_id: string | null;
  onHover?: (hovered: boolean) => void;
}

const DecisionCore: React.FC<DecisionCoreProps> = ({
  decision,
  selected_option_id,
  onHover,
}) => {
  const stateColors = {
    exploring: '#6B8DD6',
    evaluating: '#7B9DE6',
    deliberating: '#8BADF0',
    crystallized: '#ABABD8',
    reconsidering: '#5B7DC6',
  };
  
  return (
    <div
      className="decision-core"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${stateColors[decision.state]} 0%, transparent 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        padding: '16px',
        boxShadow: `0 0 40px ${stateColors[decision.state]}40`,
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
        {decision.title}
      </div>
      <div style={{ fontSize: '11px', opacity: 0.7 }}>
        {decision.state}
      </div>
      {selected_option_id && (
        <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
          Option selected
        </div>
      )}
    </div>
  );
};

/**
 * Option Path — Spatial representation of an option
 */
interface OptionPathProps {
  option: XRDecisionOption;
  is_selected: boolean;
  is_hovered: boolean;
  is_walking: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onWalk: () => void;
}

const OptionPath: React.FC<OptionPathProps> = ({
  option,
  is_selected,
  is_hovered,
  is_walking,
  onSelect,
  onHover,
  onWalk,
}) => {
  // Calculate position based on angle (centered around room)
  const distance = 200; // pixels from center
  const x = Math.cos(option.path_angle) * distance;
  const y = Math.sin(option.path_angle) * distance;
  
  // All options same base color for neutrality
  const baseColor = is_selected ? '#ABABD8' : is_hovered ? '#9B9BC8' : '#8B8BA8';
  
  return (
    <div
      className="option-path"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
      onDoubleClick={onWalk}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: '100px',
        height: '100px',
        cursor: 'pointer',
      }}
    >
      {/* Path line from center */}
      <svg
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${option.path_angle * (180 / Math.PI)}deg)`,
          width: `${distance}px`,
          height: '4px',
          overflow: 'visible',
        }}
      >
        <line
          x1="0"
          y1="2"
          x2={-distance + 50}
          y2="2"
          stroke={baseColor}
          strokeWidth={is_walking ? 3 : 2}
          strokeDasharray={option.explored ? 'none' : '8 4'}
          opacity={0.6}
        />
      </svg>
      
      {/* Option node */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${baseColor}40, ${baseColor}20)`,
          border: `2px solid ${baseColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '11px',
          textAlign: 'center',
          padding: '8px',
          boxShadow: is_selected 
            ? `0 0 20px ${baseColor}60` 
            : is_hovered 
              ? `0 0 12px ${baseColor}40` 
              : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontWeight: 500 }}>{option.title}</span>
        {option.explored && (
          <span style={{ fontSize: '9px', opacity: 0.6, marginTop: '2px' }}>
            explored
          </span>
        )}
      </div>
      
      {/* Weight indicator (only if explicitly set) */}
      {option.explicit_weight !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            background: '#ABABD8',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#1a1a2e',
            fontWeight: 600,
          }}
        >
          {option.explicit_weight}
        </div>
      )}
    </div>
  );
};

/**
 * Criterion Marker — Orbiting criterion
 */
interface CriterionMarkerProps {
  criterion: XRDecisionCriterion;
  is_hovered: boolean;
  onToggle: () => void;
  onHover: (hovered: boolean) => void;
}

const CriterionMarker: React.FC<CriterionMarkerProps> = ({
  criterion,
  is_hovered,
  onToggle,
  onHover,
}) => {
  const orbitRadius = 140;
  const x = Math.cos(criterion.orbit_angle) * orbitRadius;
  const y = Math.sin(criterion.orbit_angle) * orbitRadius - 80; // Offset upward
  
  const color = criterion.active ? '#A8A8C8' : '#686888';
  
  return (
    <div
      className="criterion-marker"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onToggle}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        padding: '6px 12px',
        borderRadius: '16px',
        background: `${color}20`,
        border: `1px solid ${color}`,
        color: color,
        fontSize: '11px',
        cursor: 'pointer',
        opacity: criterion.active ? 1 : 0.5,
        transition: 'all 0.3s ease',
        boxShadow: is_hovered ? `0 0 8px ${color}40` : 'none',
      }}
    >
      {criterion.name}
      {criterion.weight_visible && criterion.weight !== undefined && (
        <span style={{ marginLeft: '6px', opacity: 0.7 }}>
          ({criterion.weight})
        </span>
      )}
    </div>
  );
};

/**
 * Consequence Node — Downstream impact projection
 */
interface ConsequenceNodeProps {
  consequence: XRConsequence;
  is_hovered: boolean;
  onHover: (hovered: boolean) => void;
}

const ConsequenceNode: React.FC<ConsequenceNodeProps> = ({
  consequence,
  is_hovered,
  onHover,
}) => {
  const typeColors = {
    positive: '#6B9B6B',
    negative: '#9B6B6B',
    neutral: '#8B8B9B',
    uncertain: '#9B9B8B',
  };
  
  const color = typeColors[consequence.impact_type];
  
  // Position based on distance (timeframe) and option
  const baseX = consequence.position.x * 30;
  const baseY = consequence.position.z * 20;
  
  return (
    <div
      className="consequence-node"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        position: 'absolute',
        left: `calc(50% + ${baseX}px)`,
        top: `calc(70% + ${baseY}px)`,
        transform: 'translate(-50%, -50%)',
        padding: '8px 12px',
        borderRadius: '8px',
        background: `${color}${Math.round(consequence.certainty * 40).toString(16).padStart(2, '0')}`,
        border: `1px solid ${color}`,
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '10px',
        maxWidth: '120px',
        textAlign: 'center',
        opacity: consequence.certainty,
        transition: 'all 0.3s ease',
        boxShadow: is_hovered ? `0 0 12px ${color}40` : 'none',
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: '2px' }}>
        {consequence.timeframe}
      </div>
      <div style={{ opacity: 0.9 }}>
        {consequence.description.slice(0, 50)}...
      </div>
    </div>
  );
};

/**
 * Meaning Ambient — Background meaning field
 */
interface MeaningAmbientProps {
  meanings: XRDecisionMeaning[];
}

const MeaningAmbient: React.FC<MeaningAmbientProps> = ({ meanings }) => {
  if (meanings.length === 0) return null;
  
  return (
    <div
      className="meaning-ambient"
      style={{
        position: 'absolute',
        left: '5%',
        top: '20%',
        width: '200px',
        padding: '16px',
        background: 'rgba(139, 122, 168, 0.1)',
        borderRadius: '12px',
        borderLeft: '2px solid rgba(139, 122, 168, 0.3)',
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.5)', 
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Meaning Field
      </div>
      {meanings.slice(0, 3).map(meaning => (
        <div
          key={meaning.id}
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            paddingLeft: '8px',
            borderLeft: '1px solid rgba(139, 122, 168, 0.4)',
          }}
        >
          {meaning.statement}
        </div>
      ))}
    </div>
  );
};

/**
 * Crystallization Panel — Confirm and commit decision
 */
interface CrystallizationPanelProps {
  decision: XRDecisionCore;
  selected_option: XRDecisionOption | null;
  onConfirm: (rationale: string, reversibility: DecisionReversibility) => void;
  onCancel: () => void;
}

const CrystallizationPanel: React.FC<CrystallizationPanelProps> = ({
  decision,
  selected_option,
  onConfirm,
  onCancel,
}) => {
  const [rationale, setRationale] = useState('');
  const [reversibility, setReversibility] = useState<DecisionReversibility>('fully_reversible');
  
  const canConfirm = rationale.trim().length > 10 && selected_option;
  
  return (
    <div
      className="crystallization-panel"
      style={{
        position: 'absolute',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '320px',
        background: 'rgba(12, 12, 24, 0.95)',
        border: '1px solid rgba(107, 141, 214, 0.4)',
        borderRadius: '16px',
        padding: '24px',
        color: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>
        Crystallize Decision
      </div>
      
      <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px' }}>
        {decision.question}
      </div>
      
      {selected_option && (
        <div style={{ 
          background: 'rgba(171, 171, 216, 0.2)', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>
            Selected Option
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            {selected_option.title}
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', opacity: 0.7, display: 'block', marginBottom: '6px' }}>
          Rationale (required)
        </label>
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Why are you making this decision?"
          style={{
            width: '100%',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: 'inherit',
            fontSize: '12px',
            resize: 'none',
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '11px', opacity: 0.7, display: 'block', marginBottom: '6px' }}>
          Reversibility
        </label>
        <select
          value={reversibility}
          onChange={(e) => setReversibility(e.target.value as DecisionReversibility)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            color: 'inherit',
            fontSize: '12px',
          }}
        >
          <option value="fully_reversible">Fully Reversible</option>
          <option value="partially_reversible">Partially Reversible</option>
          <option value="time_limited">Time Limited</option>
          <option value="irreversible">Irreversible</option>
        </select>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '10px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => canConfirm && onConfirm(rationale, reversibility)}
          disabled={!canConfirm}
          style={{
            flex: 1,
            padding: '10px',
            background: canConfirm ? 'rgba(107, 141, 214, 0.6)' : 'rgba(107, 141, 214, 0.2)',
            border: 'none',
            borderRadius: '8px',
            color: canConfirm ? 'white' : 'rgba(255, 255, 255, 0.4)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          Crystallize
        </button>
      </div>
    </div>
  );
};

/**
 * Exit Controls — Always visible exit
 */
interface ExitControlsProps {
  onExit: () => void;
}

const ExitControls: React.FC<ExitControlsProps> = ({ onExit }) => {
  return (
    <button
      onClick={onExit}
      style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        padding: '10px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span>Exit Room</span>
      <span style={{ opacity: 0.6, fontSize: '10px' }}>ESC</span>
    </button>
  );
};

/**
 * Room Info Panel — Current state information
 */
interface RoomInfoPanelProps {
  decision: XRDecisionCore;
  current_zone: DecisionZoneType;
  option_count: number;
  criterion_count: number;
}

const RoomInfoPanel: React.FC<RoomInfoPanelProps> = ({
  decision,
  current_zone,
  option_count,
  criterion_count,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        padding: '16px',
        background: 'rgba(12, 12, 24, 0.8)',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '11px',
        minWidth: '200px',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
        Decision Room
      </div>
      <div style={{ opacity: 0.7, marginBottom: '8px' }}>
        State: <span style={{ opacity: 1 }}>{decision.state}</span>
      </div>
      <div style={{ opacity: 0.7, marginBottom: '8px' }}>
        Zone: <span style={{ opacity: 1 }}>{current_zone}</span>
      </div>
      <div style={{ opacity: 0.7, marginBottom: '8px' }}>
        Options: <span style={{ opacity: 1 }}>{option_count}</span>
      </div>
      <div style={{ opacity: 0.7 }}>
        Criteria: <span style={{ opacity: 1 }}>{criterion_count}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Decision Room
 * 
 * A focused XR environment where a SINGLE decision is examined
 * spatially. The room is structured, symmetrical, and calm.
 * 
 * No asymmetry. No visual bias.
 */
export const XRDecisionRoom: React.FC<XRDecisionRoomProps> = ({
  entry_reason,
  decision: initialDecision,
  initial_config,
  options: initialOptions = [],
  criteria: initialCriteria = [],
  consequences: initialConsequences = [],
  meanings: initialMeanings = [],
  onEnter,
  onExit,
  onOptionWalk,
  onCrystallize,
  onInteraction,
  onAgentRequest,
  xr_runtime = 'preview',
}) => {
  // Hooks
  const {
    room_state,
    is_entered,
    session_id,
    enterRoom,
    exitRoom,
    moveToZone,
    selectOption,
    hoverElement,
    canCrystallize,
    beginCrystallization,
    confirmCrystallization,
    cancelCrystallization,
  } = useDecisionRoom({
    entry_reason,
    decision: initialDecision,
    config: initial_config,
    onEnter,
    onExit,
    onCrystallize,
  });
  
  const optionsHook = useDecisionOptions(initialDecision?.id || '');
  const criteriaHook = useDecisionCriteria(initialDecision?.id || '');
  const consequencesHook = useDecisionConsequences();
  const meaningHook = useDecisionMeaning();
  const agentsHook = useDecisionRoomAgents();
  const interactionsHook = useDecisionRoomInteractions();
  
  // Local state
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredCriterion, setHoveredCriterion] = useState<string | null>(null);
  const [hoveredConsequence, setHoveredConsequence] = useState<string | null>(null);
  const [showCrystallization, setShowCrystallization] = useState(false);
  
  // Initialize with provided data
  useEffect(() => {
    if (initialDecision) {
      enterRoom(initialDecision);
    }
  }, []);
  
  // Use provided options or hook options
  const displayOptions = initialOptions.length > 0 ? initialOptions : optionsHook.options;
  const displayCriteria = initialCriteria.length > 0 ? initialCriteria : criteriaHook.criteria;
  const displayConsequences = initialConsequences.length > 0 ? initialConsequences : consequencesHook.consequences;
  const displayMeanings = initialMeanings.length > 0 ? initialMeanings : meaningHook.meanings;
  
  // Handle option selection
  const handleSelectOption = useCallback((option_id: string) => {
    selectOption(option_id);
    interactionsHook.recordInteraction(
      'walk_option_path',
      room_state?.user_position || { x: 0, y: 0, z: 0 },
      option_id,
      'option'
    );
  }, [selectOption, interactionsHook, room_state]);
  
  // Handle option walk
  const handleWalkOption = useCallback((option_id: string) => {
    optionsHook.walkOption(option_id);
    onOptionWalk?.(option_id);
  }, [optionsHook, onOptionWalk]);
  
  // Handle crystallization
  const handleConfirmCrystallization = useCallback((
    rationale: string,
    reversibility: DecisionReversibility
  ) => {
    confirmCrystallization(rationale, reversibility);
    setShowCrystallization(false);
  }, [confirmCrystallization]);
  
  // Handle begin crystallization
  const handleBeginCrystallization = useCallback(() => {
    if (room_state?.selected_option_id) {
      setShowCrystallization(true);
      beginCrystallization();
    }
  }, [room_state, beginCrystallization]);
  
  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCrystallization) {
          setShowCrystallization(false);
          cancelCrystallization();
        } else {
          exitRoom();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCrystallization, cancelCrystallization, exitRoom]);
  
  // Get selected option
  const selectedOption = useMemo(() => {
    return displayOptions.find(o => o.id === room_state?.selected_option_id) || null;
  }, [displayOptions, room_state?.selected_option_id]);
  
  // Not entered yet
  if (!is_entered || !room_state || !initialDecision) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          background: '#0c0c18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>
          XR Decision Room
        </div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '24px' }}>
          {entry_reason === 'creating_new' && 'Create a new decision'}
          {entry_reason === 'reviewing_existing' && 'Review existing decision'}
          {entry_reason === 'resolving_drift' && 'Resolve decision drift'}
          {entry_reason === 'before_irreversible' && 'Before irreversible action'}
        </div>
        <button
          onClick={() => enterRoom(initialDecision)}
          style={{
            padding: '12px 32px',
            background: 'rgba(107, 141, 214, 0.6)',
            border: 'none',
            borderRadius: '24px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Enter Room
        </button>
      </div>
    );
  }
  
  return (
    <div
      className="xr-decision-room"
      data-session={session_id}
      data-runtime={xr_runtime}
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0c0c18 0%, #1a1a2e 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 141, 214, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Meaning Field (ambient) */}
      <MeaningAmbient meanings={displayMeanings} />
      
      {/* Criteria Ring */}
      {displayCriteria.map(criterion => (
        <CriterionMarker
          key={criterion.id}
          criterion={criterion}
          is_hovered={hoveredCriterion === criterion.id}
          onToggle={() => criteriaHook.toggleCriterion(criterion.id)}
          onHover={(h) => setHoveredCriterion(h ? criterion.id : null)}
        />
      ))}
      
      {/* Option Paths */}
      {displayOptions.map(option => (
        <OptionPath
          key={option.id}
          option={option}
          is_selected={room_state.selected_option_id === option.id}
          is_hovered={hoveredOption === option.id}
          is_walking={optionsHook.walking_option_id === option.id}
          onSelect={() => handleSelectOption(option.id)}
          onHover={(h) => setHoveredOption(h ? option.id : null)}
          onWalk={() => handleWalkOption(option.id)}
        />
      ))}
      
      {/* Decision Core */}
      <DecisionCore
        decision={room_state.decision}
        selected_option_id={room_state.selected_option_id}
      />
      
      {/* Consequence Field */}
      {displayConsequences.map(consequence => (
        <ConsequenceNode
          key={consequence.id}
          consequence={consequence}
          is_hovered={hoveredConsequence === consequence.id}
          onHover={(h) => setHoveredConsequence(h ? consequence.id : null)}
        />
      ))}
      
      {/* Room Info Panel */}
      <RoomInfoPanel
        decision={room_state.decision}
        current_zone={room_state.current_zone}
        option_count={displayOptions.length}
        criterion_count={displayCriteria.length}
      />
      
      {/* Exit Controls (always visible) */}
      <ExitControls onExit={exitRoom} />
      
      {/* Crystallization Button */}
      {room_state.selected_option_id && !showCrystallization && (
        <button
          onClick={handleBeginCrystallization}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 32px',
            background: 'rgba(107, 141, 214, 0.6)',
            border: 'none',
            borderRadius: '24px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 20px rgba(107, 141, 214, 0.3)',
          }}
        >
          Crystallize Decision
        </button>
      )}
      
      {/* Crystallization Panel */}
      {showCrystallization && (
        <CrystallizationPanel
          decision={room_state.decision}
          selected_option={selectedOption}
          onConfirm={handleConfirmCrystallization}
          onCancel={() => {
            setShowCrystallization(false);
            cancelCrystallization();
          }}
        />
      )}
      
      {/* Zone navigation hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '10px',
        }}
      >
        Double-click option to walk path • ESC to exit
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default XRDecisionRoom;
