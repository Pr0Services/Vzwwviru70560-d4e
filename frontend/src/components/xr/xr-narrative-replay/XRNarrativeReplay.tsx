/**
 * CHE·NU™ XR NARRATIVE REPLAY — COMPONENT
 * 
 * Re-experience the evolution of thought, decisions, and meaning.
 * This is NOT surveillance. This is reflective memory.
 * 
 * @version 1.0
 * @status V51-ready
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type {
  XRNarrativeReplayProps,
  NarrativeElement,
  NarrativeElementType,
  NarrativeConnection,
  NarrativeParticipant,
  PlaybackState,
  StartElement,
  BranchElement,
  PauseElement,
  DecisionElement,
  ConsequenceElement,
  EvolutionElement,
} from './xr-narrative-replay.types';

import {
  XR_NARRATIVE_REPLAY_TOKENS,
  DEFAULT_NARRATIVE_SPATIAL_CONFIG,
  DEFAULT_ETHICAL_SAFEGUARDS,
} from './xr-narrative-replay.types';

import { useXRNarrativeReplay } from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: '600px',
    background: XR_NARRATIVE_REPLAY_TOKENS.background.dark,
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_primary,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  
  canvas: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
  },
  
  panel: {
    position: 'absolute' as const,
    background: XR_NARRATIVE_REPLAY_TOKENS.ui.panel,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${XR_NARRATIVE_REPLAY_TOKENS.ui.border}`,
    backdropFilter: 'blur(10px)',
    pointerEvents: 'auto' as const,
  },
  
  timelinePanel: {
    bottom: '20px',
    left: '20px',
    right: '20px',
    height: '120px',
  },
  
  infoPanel: {
    top: '20px',
    left: '20px',
    maxWidth: '320px',
  },
  
  controlsPanel: {
    top: '20px',
    right: '20px',
    maxWidth: '200px',
  },
  
  agentPanel: {
    top: '140px',
    right: '20px',
    maxWidth: '300px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
  },
  
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_primary,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  label: {
    fontSize: '11px',
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_subtle,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  
  value: {
    fontSize: '13px',
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_secondary,
    marginBottom: '12px',
  },
  
  button: {
    padding: '8px 16px',
    background: 'rgba(136, 136, 170, 0.2)',
    border: `1px solid ${XR_NARRATIVE_REPLAY_TOKENS.ui.border}`,
    borderRadius: '6px',
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_primary,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  playButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  
  exitButton: {
    background: 'rgba(170, 136, 136, 0.2)',
    borderColor: 'rgba(170, 136, 136, 0.4)',
  },
  
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(136, 136, 170, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '12px',
  },
  
  progressFill: {
    height: '100%',
    background: XR_NARRATIVE_REPLAY_TOKENS.elements.decision.color,
    transition: 'width 0.3s ease',
  },
  
  elementCard: {
    padding: '12px',
    background: 'rgba(136, 136, 170, 0.1)',
    borderRadius: '8px',
    marginBottom: '8px',
    border: `1px solid ${XR_NARRATIVE_REPLAY_TOKENS.ui.border}`,
  },
  
  elementType: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  
  elementTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_primary,
    marginBottom: '4px',
  },
  
  elementDescription: {
    fontSize: '12px',
    color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_secondary,
    lineHeight: 1.4,
  },
  
  timelineElement: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT TYPE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const getElementColor = (type: NarrativeElementType): string => {
  return XR_NARRATIVE_REPLAY_TOKENS.elements[type]?.color || '#888888';
};

const getElementIcon = (type: NarrativeElementType): string => {
  const icons: Record<NarrativeElementType, string> = {
    start: '⊙',
    branch: '⑂',
    pause: '◦',
    decision: '◈',
    consequence: '→',
    evolution: '↺',
  };
  return icons[type] || '○';
};

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE PATH VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

interface NarrativePathVisualizationProps {
  elements: NarrativeElement[];
  connections: NarrativeConnection[];
  current_element_id: string | null;
  visited_elements: string[];
  onElementClick: (element_id: string) => void;
}

const NarrativePathVisualization: React.FC<NarrativePathVisualizationProps> = ({
  elements,
  connections,
  current_element_id,
  visited_elements,
  onElementClick,
}) => {
  // Calculate positions along a path
  const element_positions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    
    elements.forEach((el, idx) => {
      // Simple linear layout for now
      positions[el.id] = {
        x: 10 + (idx * 80 / Math.max(1, elements.length - 1)),
        y: 50 + (el.type === 'branch' ? -10 : el.type === 'consequence' ? 10 : 0),
      };
    });
    
    return positions;
  }, [elements]);
  
  return (
    <svg style={styles.canvas} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Background */}
      <rect width="100" height="100" fill={XR_NARRATIVE_REPLAY_TOKENS.background.dark} />
      
      {/* Connections */}
      {connections.map(conn => {
        const from = element_positions[conn.from_element_id];
        const to = element_positions[conn.to_element_id];
        if (!from || !to) return null;
        
        const is_branch = conn.connection_type === 'branch';
        
        return (
          <line
            key={conn.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={is_branch 
              ? XR_NARRATIVE_REPLAY_TOKENS.path.branch 
              : XR_NARRATIVE_REPLAY_TOKENS.path.main
            }
            strokeWidth={0.5}
            strokeDasharray={is_branch ? '2,2' : undefined}
          />
        );
      })}
      
      {/* Elements */}
      {elements.map(element => {
        const pos = element_positions[element.id];
        if (!pos) return null;
        
        const is_current = element.id === current_element_id;
        const is_visited = visited_elements.includes(element.id);
        const color = getElementColor(element.type);
        
        return (
          <g
            key={element.id}
            transform={`translate(${pos.x}, ${pos.y})`}
            style={styles.timelineElement}
            onClick={() => onElementClick(element.id)}
          >
            {/* Glow for current */}
            {is_current && (
              <circle
                r={4}
                fill={color}
                opacity={0.3}
              >
                <animate
                  attributeName="r"
                  from={3}
                  to={5}
                  dur="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from={0.3}
                  to={0.1}
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            
            {/* Element circle */}
            <circle
              r={is_current ? 2.5 : 2}
              fill={is_current ? color : is_visited ? color : 'rgba(136, 136, 170, 0.3)'}
              stroke={is_current ? 'white' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth={is_current ? 0.3 : 0.1}
              opacity={is_visited ? 1 : 0.5}
            />
            
            {/* Icon */}
            <text
              y={-4}
              textAnchor="middle"
              fontSize={2}
              fill={is_visited ? color : 'rgba(255, 255, 255, 0.3)'}
            >
              {getElementIcon(element.type)}
            </text>
          </g>
        );
      })}
      
      {/* Time direction arrow */}
      <g transform="translate(95, 50)">
        <line x1={0} y1={0} x2={-5} y2={0} stroke="rgba(255, 255, 255, 0.2)" strokeWidth={0.3} />
        <polygon
          points="0,0 -2,-1 -2,1"
          fill="rgba(255, 255, 255, 0.2)"
        />
        <text x={-2.5} y={3} textAnchor="middle" fontSize={1.5} fill="rgba(255, 255, 255, 0.3)">
          time
        </text>
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INFO PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface InfoPanelProps {
  narrative_title: string;
  playback_state: PlaybackState;
  current_element: NarrativeElement | null;
  progress_percentage: number;
  elapsed_time: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  narrative_title,
  playback_state,
  current_element,
  progress_percentage,
  elapsed_time,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div style={{ ...styles.panel, ...styles.infoPanel }}>
      <div style={styles.title}>
        <span>📖</span>
        <span>Narrative Replay</span>
      </div>
      
      <div style={styles.label}>Narrative</div>
      <div style={styles.value}>{narrative_title}</div>
      
      <div style={styles.label}>Status</div>
      <div style={{
        ...styles.value,
        color: playback_state === 'playing' 
          ? XR_NARRATIVE_REPLAY_TOKENS.controls.play
          : playback_state === 'paused'
            ? XR_NARRATIVE_REPLAY_TOKENS.controls.pause
            : XR_NARRATIVE_REPLAY_TOKENS.ui.text_secondary,
      }}>
        {playback_state.charAt(0).toUpperCase() + playback_state.slice(1)}
      </div>
      
      <div style={styles.label}>Session Time</div>
      <div style={styles.value}>{formatTime(elapsed_time)}</div>
      
      {current_element && (
        <>
          <div style={styles.label}>Current Point</div>
          <div style={styles.elementCard}>
            <div style={{
              ...styles.elementType,
              color: getElementColor(current_element.type),
            }}>
              {getElementIcon(current_element.type)} {current_element.type}
            </div>
            <div style={styles.elementTitle}>{current_element.title}</div>
            <div style={styles.elementDescription}>{current_element.description}</div>
          </div>
        </>
      )}
      
      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${progress_percentage}%`,
          }}
        />
      </div>
      <div style={{ ...styles.label, marginTop: '4px', textAlign: 'center' }}>
        {progress_percentage.toFixed(0)}% complete
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface ControlsPanelProps {
  playback_state: PlaybackState;
  playback_speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedChange: (speed: number) => void;
  onExit: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  playback_state,
  playback_speed,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSpeedChange,
  onExit,
}) => {
  const is_playing = playback_state === 'playing';
  
  return (
    <div style={{ ...styles.panel, ...styles.controlsPanel }}>
      <div style={styles.title}>
        <span>⏵</span>
        <span>Controls</span>
      </div>
      
      {/* Main controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        <button
          style={styles.button}
          onClick={onPrevious}
          title="Previous (←)"
        >
          ⏮
        </button>
        
        <button
          style={{
            ...styles.button,
            ...styles.playButton,
            background: is_playing 
              ? `rgba(170, 170, 136, 0.3)` 
              : `rgba(136, 170, 136, 0.3)`,
          }}
          onClick={is_playing ? onPause : onPlay}
          title={is_playing ? 'Pause (Space)' : 'Play (Space)'}
        >
          {is_playing ? '⏸' : '▶'}
        </button>
        
        <button
          style={styles.button}
          onClick={onNext}
          title="Next (→)"
        >
          ⏭
        </button>
      </div>
      
      {/* Speed control */}
      <div style={styles.label}>Speed: {playback_speed}x</div>
      <input
        type="range"
        min={0}
        max={5}
        step={0.5}
        value={playback_speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        style={{ width: '100%', marginBottom: '16px' }}
      />
      
      {/* Exit button */}
      <button
        style={{ ...styles.button, ...styles.exitButton, width: '100%' }}
        onClick={onExit}
        title="Exit (Escape)"
      >
        Exit Replay (ESC)
      </button>
      
      {/* Keyboard hints */}
      <div style={{ ...styles.label, marginTop: '12px', fontSize: '10px' }}>
        ← → Navigate | Space Play/Pause | ESC Exit
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentPanelProps {
  current_explanation: string | null;
  on_request_explanation: () => void;
  is_enabled: boolean;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  current_explanation,
  on_request_explanation,
  is_enabled,
}) => {
  if (!is_enabled) return null;
  
  return (
    <div style={{ ...styles.panel, ...styles.agentPanel }}>
      <div style={styles.title}>
        <span>💬</span>
        <span>Narrative Guide</span>
      </div>
      
      <div style={{ ...styles.label, marginBottom: '8px' }}>
        Agent may explain, clarify, and answer questions.
        <br />
        Agent may NOT reinterpret, justify, or rewrite.
      </div>
      
      {current_explanation ? (
        <div style={styles.elementCard}>
          <div style={styles.elementDescription}>
            {current_explanation}
          </div>
        </div>
      ) : (
        <div style={{ ...styles.value, textAlign: 'center', fontStyle: 'italic' }}>
          No explanation requested
        </div>
      )}
      
      <button
        style={{ ...styles.button, width: '100%', marginTop: '8px' }}
        onClick={on_request_explanation}
      >
        Explain this point
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface TimelinePanelProps {
  elements: NarrativeElement[];
  current_element_id: string | null;
  visited_elements: string[];
  onElementClick: (element_id: string) => void;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  elements,
  current_element_id,
  visited_elements,
  onElementClick,
}) => {
  return (
    <div style={{ ...styles.panel, ...styles.timelinePanel }}>
      <div style={{ ...styles.title, marginBottom: '8px' }}>
        <span>⏱</span>
        <span>Timeline ({elements.length} points)</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        overflowX: 'auto',
        paddingBottom: '8px',
      }}>
        {elements.map((element, idx) => {
          const is_current = element.id === current_element_id;
          const is_visited = visited_elements.includes(element.id);
          const color = getElementColor(element.type);
          
          return (
            <div
              key={element.id}
              onClick={() => onElementClick(element.id)}
              style={{
                flexShrink: 0,
                width: '60px',
                padding: '8px',
                background: is_current 
                  ? `${color}33`
                  : is_visited 
                    ? 'rgba(136, 136, 170, 0.15)'
                    : 'rgba(136, 136, 170, 0.05)',
                border: is_current 
                  ? `2px solid ${color}`
                  : `1px solid ${XR_NARRATIVE_REPLAY_TOKENS.ui.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                fontSize: '16px',
                textAlign: 'center',
                marginBottom: '4px',
                color: is_visited ? color : 'rgba(255, 255, 255, 0.3)',
              }}>
                {getElementIcon(element.type)}
              </div>
              <div style={{
                fontSize: '9px',
                textAlign: 'center',
                color: is_visited 
                  ? XR_NARRATIVE_REPLAY_TOKENS.ui.text_secondary
                  : XR_NARRATIVE_REPLAY_TOKENS.ui.text_subtle,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {element.title.slice(0, 10)}...
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ETHICAL NOTICE
// ═══════════════════════════════════════════════════════════════════════════════

const EthicalNotice: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '150px',
      left: '20px',
      fontSize: '10px',
      color: XR_NARRATIVE_REPLAY_TOKENS.ui.text_subtle,
      maxWidth: '200px',
    }}>
      <div style={{ marginBottom: '4px', fontWeight: 600 }}>
        ✓ Ethical Safeguards Active
      </div>
      <div>
        Meaning preserved as it was.
        <br />
        No retrospective optimization.
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const XRNarrativeReplay: React.FC<XRNarrativeReplayProps> = ({
  narrative,
  user_id,
  spatial_config,
  agent_enabled = true,
  agent,
  is_team_narrative = false,
  participants = [],
  onElementVisit,
  onPlaybackStateChange,
  onComparison,
  onExit,
  onAgentQuestion,
  exitKey = 'Escape',
}) => {
  // Use combined hook
  const {
    replay,
    elements,
    comparison,
    agent: agentHook,
    team,
  } = useXRNarrativeReplay({
    narrative,
    user_id,
    auto_start: true,
    spatial_config,
    agent_enabled,
    is_team: is_team_narrative,
    participants,
    onExit,
  });
  
  // Track element visits
  useEffect(() => {
    if (replay.current_element) {
      onElementVisit?.(replay.current_element);
    }
  }, [replay.current_element, onElementVisit]);
  
  // Track playback state changes
  useEffect(() => {
    onPlaybackStateChange?.(replay.playback_state);
  }, [replay.playback_state, onPlaybackStateChange]);
  
  // Handle explanation request
  const handleRequestExplanation = useCallback(async () => {
    if (replay.current_element) {
      await agentHook.request_explanation(replay.current_element);
    }
  }, [replay.current_element, agentHook]);
  
  // Handle exit
  const handleExit = useCallback(() => {
    replay.end_replay();
    onExit?.();
  }, [replay, onExit]);
  
  // Don't render if not active
  if (!replay.is_active) {
    return (
      <div style={styles.container}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <div style={styles.title}>Narrative Replay</div>
          <div style={{ ...styles.value, marginBottom: '24px' }}>
            {narrative.title}
          </div>
          <button
            style={styles.button}
            onClick={() => replay.start_replay()}
          >
            Start Replay
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      {/* Path visualization */}
      <NarrativePathVisualization
        elements={narrative.elements}
        connections={narrative.connections}
        current_element_id={replay.current_element?.id || null}
        visited_elements={replay.visited_elements}
        onElementClick={replay.jump_to_element}
      />
      
      {/* Overlay panels */}
      <div style={styles.overlay}>
        {/* Info panel */}
        <InfoPanel
          narrative_title={narrative.title}
          playback_state={replay.playback_state}
          current_element={replay.current_element}
          progress_percentage={replay.progress_percentage}
          elapsed_time={replay.elapsed_time}
        />
        
        {/* Controls panel */}
        <ControlsPanel
          playback_state={replay.playback_state}
          playback_speed={replay.playback_speed}
          onPlay={replay.play}
          onPause={replay.pause}
          onNext={replay.go_to_next}
          onPrevious={replay.go_to_previous}
          onSpeedChange={replay.set_speed}
          onExit={handleExit}
        />
        
        {/* Agent panel */}
        <AgentPanel
          current_explanation={agentHook.current_explanation}
          on_request_explanation={handleRequestExplanation}
          is_enabled={agent_enabled}
        />
        
        {/* Timeline panel */}
        <TimelinePanel
          elements={narrative.elements}
          current_element_id={replay.current_element?.id || null}
          visited_elements={replay.visited_elements}
          onElementClick={replay.jump_to_element}
        />
        
        {/* Ethical notice */}
        <EthicalNotice />
      </div>
    </div>
  );
};

export default XRNarrativeReplay;
