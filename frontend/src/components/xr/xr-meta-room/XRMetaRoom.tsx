/**
 * CHE·NU™ XR META ROOM — MAIN COMPONENT
 * 
 * XR Meta Room is a spatial environment for reflection, alignment,
 * and high-level sense-making. The calm center of CHE·NU.
 * 
 * NOT for execution. NOT for productivity. NOT for performance.
 * 
 * @version 1.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  XRMetaRoomProps,
  RoomState,
  RoomConfig,
  NavigationState,
  InteractionEvent,
  InteractionType,
  SelectedObject,
  XRThread,
  XRDecision,
  XRSnapshot,
  XRMeaning,
  XRCognitiveLoad,
  XRAgentPresence,
  SpatialZone,
  Vector3,
  ZoneType,
  ExitMethod,
  SnapshotModeState,
  DEFAULT_ROOM_CONFIG,
  XR_META_ROOM_TOKENS,
} from './xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Environment backdrop - calm, minimal, grounded
 */
interface EnvironmentProps {
  config: RoomConfig;
  load_state: XRCognitiveLoad;
}

const Environment: React.FC<EnvironmentProps> = ({ config, load_state }) => {
  // Environmental density based on cognitive load
  const density = load_state?.air_density ?? 0.3;
  const resistance = load_state?.movement_resistance ?? 0.2;
  
  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(ellipse at center, 
      ${XR_META_ROOM_TOKENS.environment.background} 0%,
      ${XR_META_ROOM_TOKENS.environment.fog_color} 100%)`,
    opacity: config.light_level,
    transition: 'opacity 2s ease',
  };
  
  // Fog/density overlay
  const fogStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: XR_META_ROOM_TOKENS.environment.fog_color,
    opacity: density * 0.4,
    transition: 'opacity 3s ease',
    pointerEvents: 'none',
  };
  
  // Ambient particles (subtle, floating)
  const particleCount = Math.floor((1 - density) * 20) + 5;
  
  return (
    <div className="xr-environment">
      <div style={backgroundStyle} />
      <div style={fogStyle} />
      
      {/* Subtle ambient particles */}
      <div className="xr-ambient-particles">
        {Array.from({ length: particleCount }).map((_, i) => (
          <AmbientParticle key={i} index={i} density={density} />
        ))}
      </div>
    </div>
  );
};

/**
 * Ambient particle - soft, floating, never distracting
 */
const AmbientParticle: React.FC<{ index: number; density: number }> = ({ index, density }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: `rgba(255, 255, 255, ${0.1 - density * 0.05})`,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    animation: `float-particle ${10 + (index % 5) * 2}s ease-in-out infinite`,
    animationDelay: `${index * 0.5}s`,
    pointerEvents: 'none',
  };
  
  return <div style={style} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Thread field - floating semantic paths
 * Threads invite exploration, never pull attention
 */
interface ThreadFieldProps {
  threads: XRThread[];
  config: RoomConfig;
  selected_id: string | null;
  hovered_id: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onWalkStart: (id: string) => void;
}

const ThreadField: React.FC<ThreadFieldProps> = ({
  threads,
  config,
  selected_id,
  hovered_id,
  onSelect,
  onHover,
  onWalkStart,
}) => {
  if (!threads || threads.length === 0) return null;
  
  return (
    <div className="xr-thread-field" style={{ position: 'absolute', inset: 0 }}>
      {threads.map(thread => (
        <ThreadVisualization
          key={thread.id}
          thread={thread}
          config={config}
          is_selected={thread.id === selected_id}
          is_hovered={thread.id === hovered_id}
          onSelect={() => onSelect(thread.id)}
          onHover={onHover}
          onWalkStart={() => onWalkStart(thread.id)}
        />
      ))}
    </div>
  );
};

/**
 * Single thread visualization
 * Soft, continuous spatial path
 */
interface ThreadVisualizationProps {
  thread: XRThread;
  config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  onWalkStart: () => void;
}

const ThreadVisualization: React.FC<ThreadVisualizationProps> = ({
  thread,
  config,
  is_selected,
  is_hovered,
  onSelect,
  onHover,
  onWalkStart,
}) => {
  // Convert 3D path to 2D for preview mode
  // In actual WebXR, this would be a 3D line
  const pathPoints = thread.path.map(p => `${p.x}% ${p.y}%`).join(', ');
  
  const baseOpacity = config.object_opacity * thread.opacity;
  const glowIntensity = config.thread_glow_intensity * thread.glow_intensity;
  
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  };
  
  // Thread path visualization (simplified for 2D preview)
  const threadStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${thread.path[0]?.x ?? 20}%`,
    top: `${thread.path[0]?.y ?? 20}%`,
    width: `${Math.abs((thread.path[1]?.x ?? 80) - (thread.path[0]?.x ?? 20))}%`,
    height: thread.thickness * 4,
    background: `linear-gradient(90deg, 
      ${thread.color}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')},
      ${XR_META_ROOM_TOKENS.threads.glow}${Math.round(baseOpacity * 200).toString(16).padStart(2, '0')})`,
    borderRadius: thread.thickness * 2,
    boxShadow: is_selected 
      ? `0 0 ${glowIntensity * 40}px ${thread.color}`
      : is_hovered
      ? `0 0 ${glowIntensity * 20}px ${thread.color}`
      : `0 0 ${glowIntensity * 10}px ${thread.color}`,
    transition: 'box-shadow 1s ease, opacity 1s ease',
    cursor: 'pointer',
    pointerEvents: 'auto',
    animation: 'thread-breathe 8s ease-in-out infinite',
  };
  
  // Thread label
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${thread.path[0]?.x ?? 20}%`,
    top: `${(thread.path[0]?.y ?? 20) - 3}%`,
    fontSize: 12,
    color: XR_META_ROOM_TOKENS.text.secondary,
    opacity: is_hovered || is_selected ? 1 : 0.5,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
  };
  
  // Linked elements along thread
  const linkedElements = thread.linked_elements.map((elem, i) => {
    const posX = thread.path[0]?.x + 
      (thread.path[1]?.x - thread.path[0]?.x) * elem.position_on_thread;
    
    return (
      <div
        key={elem.id}
        className="thread-linked-element"
        style={{
          position: 'absolute',
          left: `${posX}%`,
          top: `${thread.path[0]?.y + 2}%`,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: XR_META_ROOM_TOKENS.threads.primary,
          opacity: baseOpacity * 0.7,
          boxShadow: `0 0 8px ${thread.color}`,
        }}
        title={elem.preview_text}
      />
    );
  });
  
  return (
    <div style={containerStyle}>
      <div style={labelStyle}>{thread.title}</div>
      <div
        style={threadStyle}
        onClick={onSelect}
        onMouseEnter={() => onHover(thread.id)}
        onMouseLeave={() => onHover(null)}
        onDoubleClick={onWalkStart}
        role="button"
        tabIndex={0}
        aria-label={`Thread: ${thread.title}. Phase: ${thread.phase}. Double-click to walk along.`}
      />
      {linkedElements}
      
      {/* Unresolved segments (dimmer) */}
      {thread.unresolved_segments.map((seg, i) => (
        <div
          key={i}
          className="thread-unresolved-segment"
          style={{
            position: 'absolute',
            left: `${thread.path[0]?.x + (thread.path[1]?.x - thread.path[0]?.x) * seg.start}%`,
            top: `${thread.path[0]?.y}%`,
            width: `${Math.abs((seg.end - seg.start) * (thread.path[1]?.x - thread.path[0]?.x))}%`,
            height: thread.thickness * 4,
            background: XR_META_ROOM_TOKENS.threads.unresolved,
            opacity: baseOpacity * 0.4,
            borderRadius: thread.thickness * 2,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: thread.color,
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Decision anchors - crystalline nodes
 */
interface DecisionAnchorsProps {
  decisions: XRDecision[];
  config: RoomConfig;
  selected_id: string | null;
  hovered_id: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onInspect: (id: string) => void;
}

const DecisionAnchors: React.FC<DecisionAnchorsProps> = ({
  decisions,
  config,
  selected_id,
  hovered_id,
  onSelect,
  onHover,
  onInspect,
}) => {
  if (!decisions || decisions.length === 0) return null;
  
  return (
    <div className="xr-decision-anchors" style={{ position: 'absolute', inset: 0 }}>
      {decisions.map(decision => (
        <DecisionCrystal
          key={decision.id}
          decision={decision}
          config={config}
          is_selected={decision.id === selected_id}
          is_hovered={decision.id === hovered_id}
          onSelect={() => onSelect(decision.id)}
          onHover={onHover}
          onInspect={() => onInspect(decision.id)}
        />
      ))}
    </div>
  );
};

/**
 * Single decision crystal
 * Suspended crystal forms with facets
 */
interface DecisionCrystalProps {
  decision: XRDecision;
  config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  onInspect: () => void;
}

const DecisionCrystal: React.FC<DecisionCrystalProps> = ({
  decision,
  config,
  is_selected,
  is_hovered,
  onSelect,
  onHover,
  onInspect,
}) => {
  const baseOpacity = config.object_opacity;
  const size = 40 + decision.facet_count * 5;
  
  // Crystal appearance based on clarity (certainty)
  const clarity = decision.clarity;
  
  const crystalStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${decision.position.x}%`,
    top: `${decision.position.y}%`,
    width: size,
    height: size,
    transform: `translate(-50%, -50%) rotate(${decision.rotation.yaw * 180 / Math.PI}deg)`,
    background: `linear-gradient(135deg, 
      ${decision.crystal_color}${Math.round(clarity * 255).toString(16).padStart(2, '0')},
      ${XR_META_ROOM_TOKENS.decisions.facet}${Math.round(clarity * 200).toString(16).padStart(2, '0')})`,
    clipPath: generateCrystalPath(decision.facet_count),
    boxShadow: is_selected
      ? `0 0 30px ${decision.crystal_color}, inset 0 0 20px rgba(255,255,255,0.3)`
      : is_hovered
      ? `0 0 20px ${decision.crystal_color}, inset 0 0 10px rgba(255,255,255,0.2)`
      : `0 0 10px ${decision.crystal_color}`,
    transition: 'box-shadow 1s ease, transform 2s ease',
    cursor: 'pointer',
    animation: 'crystal-float 6s ease-in-out infinite',
  };
  
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${decision.position.x}%`,
    top: `${decision.position.y + 5}%`,
    transform: 'translateX(-50%)',
    fontSize: 11,
    color: XR_META_ROOM_TOKENS.text.secondary,
    opacity: is_hovered || is_selected ? 1 : 0.4,
    transition: 'opacity 0.5s ease',
    textAlign: 'center',
    maxWidth: 120,
    pointerEvents: 'none',
  };
  
  return (
    <>
      <div
        style={crystalStyle}
        onClick={onSelect}
        onMouseEnter={() => onHover(decision.id)}
        onMouseLeave={() => onHover(null)}
        onDoubleClick={onInspect}
        role="button"
        tabIndex={0}
        aria-label={`Decision: ${decision.title}. Nature: ${decision.nature}. Double-click to inspect.`}
      />
      <div style={labelStyle}>{decision.title}</div>
    </>
  );
};

/**
 * Generate crystal clip-path based on facet count
 */
function generateCrystalPath(facets: number): string {
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / facets;
  
  for (let i = 0; i < facets; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const radius = i % 2 === 0 ? 50 : 35; // Alternating for crystal effect
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    points.push(`${x}% ${y}%`);
  }
  
  return `polygon(${points.join(', ')})`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SNAPSHOT VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Snapshot markers - temporal pillars
 */
interface SnapshotMarkersProps {
  snapshots: XRSnapshot[];
  config: RoomConfig;
  selected_id: string | null;
  hovered_id: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onEnter: (id: string) => void;
}

const SnapshotMarkers: React.FC<SnapshotMarkersProps> = ({
  snapshots,
  config,
  selected_id,
  hovered_id,
  onSelect,
  onHover,
  onEnter,
}) => {
  if (!snapshots || snapshots.length === 0) return null;
  
  return (
    <div className="xr-snapshot-markers" style={{ position: 'absolute', inset: 0 }}>
      {snapshots.map(snapshot => (
        <SnapshotPillar
          key={snapshot.id}
          snapshot={snapshot}
          config={config}
          is_selected={snapshot.id === selected_id}
          is_hovered={snapshot.id === hovered_id}
          onSelect={() => onSelect(snapshot.id)}
          onHover={onHover}
          onEnter={() => onEnter(snapshot.id)}
        />
      ))}
    </div>
  );
};

/**
 * Single snapshot pillar
 * Light column with rising particles
 */
interface SnapshotPillarProps {
  snapshot: XRSnapshot;
  config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  onEnter: () => void;
}

const SnapshotPillar: React.FC<SnapshotPillarProps> = ({
  snapshot,
  config,
  is_selected,
  is_hovered,
  onSelect,
  onHover,
  onEnter,
}) => {
  const baseOpacity = config.object_opacity;
  
  const pillarStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${snapshot.position.x}%`,
    top: `${snapshot.position.y - snapshot.height / 2}%`,
    width: snapshot.radius * 2,
    height: `${snapshot.height}%`,
    transform: 'translateX(-50%)',
    background: `linear-gradient(180deg,
      ${snapshot.column_color}00 0%,
      ${snapshot.column_color}${Math.round(baseOpacity * 100).toString(16).padStart(2, '0')} 20%,
      ${XR_META_ROOM_TOKENS.snapshots.light}${Math.round(baseOpacity * 150).toString(16).padStart(2, '0')} 50%,
      ${snapshot.column_color}${Math.round(baseOpacity * 100).toString(16).padStart(2, '0')} 80%,
      ${snapshot.column_color}00 100%)`,
    borderRadius: snapshot.radius,
    boxShadow: is_selected
      ? `0 0 40px ${snapshot.column_color}`
      : is_hovered
      ? `0 0 25px ${snapshot.column_color}`
      : `0 0 15px ${snapshot.column_color}`,
    transition: 'box-shadow 1s ease',
    cursor: 'pointer',
    overflow: 'hidden',
  };
  
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${snapshot.position.x}%`,
    top: `${snapshot.position.y + 2}%`,
    transform: 'translateX(-50%)',
    fontSize: 10,
    color: XR_META_ROOM_TOKENS.text.secondary,
    opacity: is_hovered || is_selected ? 1 : 0.4,
    transition: 'opacity 0.5s ease',
    textAlign: 'center',
    maxWidth: 100,
    pointerEvents: 'none',
  };
  
  const timestampStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${snapshot.position.x}%`,
    top: `${snapshot.position.y + 4}%`,
    transform: 'translateX(-50%)',
    fontSize: 9,
    color: XR_META_ROOM_TOKENS.text.subtle,
    opacity: is_hovered || is_selected ? 0.8 : 0.3,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
  };
  
  // Rising particles
  const particles = Array.from({ length: Math.floor(snapshot.particle_density * 10) }).map((_, i) => (
    <div
      key={i}
      className="snapshot-particle"
      style={{
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: '50%',
        background: XR_META_ROOM_TOKENS.snapshots.particles,
        left: `${20 + (i * 17) % 60}%`,
        bottom: 0,
        opacity: 0.6,
        animation: `particle-rise ${3 + (i % 3)}s ease-in-out infinite`,
        animationDelay: `${i * 0.3}s`,
      }}
    />
  ));
  
  return (
    <>
      <div
        style={pillarStyle}
        onClick={onSelect}
        onMouseEnter={() => onHover(snapshot.id)}
        onMouseLeave={() => onHover(null)}
        onDoubleClick={onEnter}
        role="button"
        tabIndex={0}
        aria-label={`Snapshot: ${snapshot.title}. Captured ${formatTime(snapshot.captured_at)}. Double-click to enter.`}
      >
        {particles}
      </div>
      <div style={labelStyle}>{snapshot.title}</div>
      <div style={timestampStyle}>{formatTime(snapshot.captured_at)}</div>
    </>
  );
};

function formatTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEANING HALO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Meaning halo - ambient layer
 * Meaning is ambient, not objectified
 * It frames objects, never competes with them
 */
interface MeaningHaloProps {
  meanings: XRMeaning[];
  config: RoomConfig;
}

const MeaningHalo: React.FC<MeaningHaloProps> = ({ meanings, config }) => {
  if (!meanings || meanings.length === 0) return null;
  
  return (
    <div 
      className="xr-meaning-halo" 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {meanings.map(meaning => (
        <MeaningAmbience key={meaning.id} meaning={meaning} config={config} />
      ))}
    </div>
  );
};

/**
 * Single meaning ambience
 * Subtle light, gentle text fragments, atmospheric tone
 */
interface MeaningAmbienceProps {
  meaning: XRMeaning;
  config: RoomConfig;
}

const MeaningAmbience: React.FC<MeaningAmbienceProps> = ({ meaning, config }) => {
  const rep = meaning.representation;
  
  // Position in space
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${meaning.influence_center.x}%`,
    top: `${meaning.influence_center.y}%`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  };
  
  if (rep.type === 'light') {
    return (
      <div
        style={{
          ...style,
          width: meaning.influence_radius * 4,
          height: meaning.influence_radius * 4,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            ${rep.light_color}${Math.round((rep.light_intensity ?? 0.3) * 100).toString(16).padStart(2, '0')} 0%,
            transparent 70%)`,
          filter: `blur(${(rep.light_softness ?? 0.5) * 40}px)`,
        }}
      />
    );
  }
  
  if (rep.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontSize: 14,
          color: XR_META_ROOM_TOKENS.meaning.text,
          opacity: rep.text_opacity ?? 0.4,
          fontStyle: 'italic',
          animation: rep.text_float ? 'meaning-float 12s ease-in-out infinite' : undefined,
        }}
      >
        {rep.text_content}
      </div>
    );
  }
  
  if (rep.type === 'atmosphere' || rep.type === 'tone') {
    return (
      <div
        style={{
          ...style,
          width: meaning.influence_radius * 6,
          height: meaning.influence_radius * 6,
          borderRadius: '50%',
          background: rep.ambient_hue ?? XR_META_ROOM_TOKENS.meaning.atmosphere,
          opacity: (rep.ambient_saturation ?? 0.2) * 0.3,
          filter: 'blur(60px)',
        }}
      />
    );
  }
  
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOAD FIELD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load field - environmental density
 * Load is perception, not alerts
 */
interface LoadFieldProps {
  load: XRCognitiveLoad;
  config: RoomConfig;
}

const LoadField: React.FC<LoadFieldProps> = ({ load, config }) => {
  if (!load) return null;
  
  // Environmental effects based on load state
  const stateEffects: Record<string, React.CSSProperties> = {
    open: {
      background: 'transparent',
      backdropFilter: 'none',
    },
    present: {
      background: `${XR_META_ROOM_TOKENS.load.present}10`,
      backdropFilter: 'blur(1px)',
    },
    weighted: {
      background: `${XR_META_ROOM_TOKENS.load.weighted}20`,
      backdropFilter: 'blur(3px)',
    },
    heavy: {
      background: `${XR_META_ROOM_TOKENS.load.heavy}30`,
      backdropFilter: 'blur(5px)',
    },
  };
  
  const effectStyle = stateEffects[load.load_state] ?? stateEffects.present;
  
  const fieldStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...effectStyle,
    transition: 'all 3s ease',
    pointerEvents: 'none',
  };
  
  // Visual density overlay
  const densityStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(circle at center,
      transparent 30%,
      ${XR_META_ROOM_TOKENS.environment.fog_color}${Math.round(load.visual_density * 60).toString(16).padStart(2, '0')} 100%)`,
    pointerEvents: 'none',
  };
  
  return (
    <div className="xr-load-field">
      <div style={fieldStyle} />
      <div style={densityStyle} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT BOUNDARIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Agent boundaries - visible perimeter outlines
 * Agents appear ONLY if invited
 */
interface AgentBoundariesProps {
  agents: XRAgentPresence[];
  config: RoomConfig;
  onInvite: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AgentBoundaries: React.FC<AgentBoundariesProps> = ({
  agents,
  config,
  onInvite,
  onDismiss,
}) => {
  const invited = agents?.filter(a => a.invited) ?? [];
  
  if (invited.length === 0) return null;
  
  return (
    <div className="xr-agent-boundaries" style={{ position: 'absolute', inset: 0 }}>
      {invited.map(agent => (
        <AgentPresenceVisualization
          key={agent.id}
          agent={agent}
          config={config}
          onDismiss={() => onDismiss(agent.id)}
        />
      ))}
    </div>
  );
};

/**
 * Single agent presence
 * Minimal avatar or marker
 */
interface AgentPresenceVisualizationProps {
  agent: XRAgentPresence;
  config: RoomConfig;
  onDismiss: () => void;
}

const AgentPresenceVisualization: React.FC<AgentPresenceVisualizationProps> = ({
  agent,
  config,
}) => {
  if (!agent.invited || !agent.position) return null;
  
  const boundaryOpacity = config.boundary_visibility;
  
  // Boundary zone visualization
  const boundaryStyle: React.CSSProperties = agent.boundary_zone ? {
    position: 'absolute',
    left: `${agent.boundary_zone.center.x - agent.boundary_zone.radius}%`,
    top: `${agent.boundary_zone.center.y - agent.boundary_zone.radius}%`,
    width: `${agent.boundary_zone.radius * 2}%`,
    height: `${agent.boundary_zone.radius * 2}%`,
    border: `2px dashed ${XR_META_ROOM_TOKENS.agents.boundary}`,
    borderRadius: '50%',
    opacity: boundaryOpacity * 0.6,
    pointerEvents: 'none',
  } : {};
  
  // Agent marker
  const markerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${agent.position.x}%`,
    top: `${agent.position.y}%`,
    transform: 'translate(-50%, -50%)',
    width: agent.avatar_type === 'minimal_form' ? 30 : 16,
    height: agent.avatar_type === 'minimal_form' ? 30 : 16,
    borderRadius: '50%',
    background: XR_META_ROOM_TOKENS.agents.presence,
    boxShadow: `0 0 15px ${XR_META_ROOM_TOKENS.agents.presence}`,
    opacity: 0.8,
  };
  
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${agent.position.x}%`,
    top: `${agent.position.y + 3}%`,
    transform: 'translateX(-50%)',
    fontSize: 10,
    color: XR_META_ROOM_TOKENS.text.secondary,
    opacity: 0.7,
    pointerEvents: 'none',
  };
  
  return (
    <>
      {agent.boundary_zone && <div style={boundaryStyle} title="Agent boundary - cannot cross" />}
      <div style={markerStyle} title={`${agent.agent_name}: Can explain, answer, reflect. Cannot persuade, optimize, or lead.`} />
      <div style={labelStyle}>{agent.agent_name}</div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER PRESENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * User presence indicator at center
 */
interface UserPresenceProps {
  position: Vector3;
}

const UserPresence: React.FC<UserPresenceProps> = ({ position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
    boxShadow: '0 0 20px rgba(255,255,255,0.3)',
    pointerEvents: 'none',
  };
  
  return <div className="xr-user-presence" style={style} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SNAPSHOT MODE OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Snapshot mode overlay
 * Clearly labeled, exit is instant
 */
interface SnapshotModeOverlayProps {
  state: SnapshotModeState;
  onExit: () => void;
}

const SnapshotModeOverlay: React.FC<SnapshotModeOverlayProps> = ({ state, onExit }) => {
  if (!state.active) return null;
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 24px',
    background: `${XR_META_ROOM_TOKENS.snapshots.column}20`,
    border: `1px solid ${XR_META_ROOM_TOKENS.snapshots.column}40`,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    zIndex: 100,
  };
  
  const labelStyle: React.CSSProperties = {
    color: XR_META_ROOM_TOKENS.snapshots.light,
    fontSize: 14,
    fontWeight: 500,
  };
  
  const exitButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 4,
    color: XR_META_ROOM_TOKENS.text.primary,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'background 0.2s',
  };
  
  return (
    <div style={overlayStyle}>
      <span style={labelStyle}>📍 SNAPSHOT MODE</span>
      <button 
        style={exitButtonStyle} 
        onClick={onExit}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        Exit Instantly (Esc)
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXIT CONTROLS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Exit controls - always visible
 * User is NEVER trapped
 */
interface ExitControlsProps {
  onExit: (method: ExitMethod) => void;
}

const ExitControls: React.FC<ExitControlsProps> = ({ onExit }) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    gap: 8,
    zIndex: 100,
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    color: XR_META_ROOM_TOKENS.text.secondary,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };
  
  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={() => onExit('gesture')}
        title="Exit with gesture"
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = XR_META_ROOM_TOKENS.text.primary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = XR_META_ROOM_TOKENS.text.secondary;
        }}
      >
        Exit Room
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INSPECTION PANEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Inspection panel for selected objects
 */
interface InspectionPanelProps {
  selected: SelectedObject | null;
  threads: XRThread[];
  decisions: XRDecision[];
  snapshots: XRSnapshot[];
  onClose: () => void;
}

const InspectionPanel: React.FC<InspectionPanelProps> = ({
  selected,
  threads,
  decisions,
  snapshots,
  onClose,
}) => {
  if (!selected || !selected.inspection_open) return null;
  
  let content: React.ReactNode = null;
  let title = '';
  
  if (selected.type === 'thread') {
    const thread = threads.find(t => t.id === selected.id);
    if (thread) {
      title = thread.title;
      content = (
        <div>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            Phase: {thread.phase}
          </p>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            {thread.linked_elements.length} linked elements
          </p>
          {thread.unresolved_segments.length > 0 && (
            <p style={{ color: XR_META_ROOM_TOKENS.threads.unresolved, margin: '8px 0' }}>
              {thread.unresolved_segments.length} unresolved segments
            </p>
          )}
        </div>
      );
    }
  } else if (selected.type === 'decision') {
    const decision = decisions.find(d => d.id === selected.id);
    if (decision) {
      title = decision.title;
      content = (
        <div>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            Nature: {decision.nature}
          </p>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            {decision.facet_count} facets (options/criteria)
          </p>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            Clarity: {Math.round(decision.clarity * 100)}%
          </p>
          {decision.downstream_decisions.length > 0 && (
            <p style={{ color: XR_META_ROOM_TOKENS.text.subtle, margin: '8px 0' }}>
              → {decision.downstream_decisions.length} downstream decisions
            </p>
          )}
        </div>
      );
    }
  } else if (selected.type === 'snapshot') {
    const snapshot = snapshots.find(s => s.id === selected.id);
    if (snapshot) {
      title = snapshot.title;
      content = (
        <div>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            Captured: {formatTime(snapshot.captured_at)}
          </p>
          <p style={{ color: XR_META_ROOM_TOKENS.text.secondary, margin: '8px 0' }}>
            Trigger: {snapshot.trigger}
          </p>
          {snapshot.context_notes && (
            <p style={{ color: XR_META_ROOM_TOKENS.text.subtle, margin: '8px 0', fontStyle: 'italic' }}>
              "{snapshot.context_notes}"
            </p>
          )}
        </div>
      );
    }
  }
  
  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 280,
    padding: 20,
    background: 'rgba(10, 10, 20, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    zIndex: 100,
  };
  
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  };
  
  const titleStyle: React.CSSProperties = {
    color: XR_META_ROOM_TOKENS.text.primary,
    fontSize: 16,
    fontWeight: 500,
    margin: 0,
  };
  
  const closeStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: XR_META_ROOM_TOKENS.text.secondary,
    fontSize: 18,
    cursor: 'pointer',
    padding: 0,
  };
  
  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <button style={closeStyle} onClick={onClose}>×</button>
      </div>
      {content}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Meta Room - Main Component
 * 
 * A spatial environment for reflection, alignment, and sense-making.
 * The calm center of CHE·NU.
 */
export const XRMetaRoom: React.FC<XRMetaRoomProps> = ({
  entry_source,
  initial_config,
  threads = [],
  decisions = [],
  snapshots = [],
  meanings = [],
  cognitive_load,
  agents = [],
  onEnter,
  onExit,
  onInteraction,
  onNavigate,
  onSelect,
  onSnapshotEnter,
  onSnapshotExit,
  onAgentInvite,
  onAgentDismiss,
  xr_runtime = 'preview',
}) => {
  // State
  const [config, setConfig] = useState<RoomConfig>({
    ...DEFAULT_ROOM_CONFIG,
    ...initial_config,
  });
  
  const [userPosition, setUserPosition] = useState<Vector3>({ x: 50, y: 50, z: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [snapshotMode, setSnapshotMode] = useState<SnapshotModeState>({
    active: false,
    snapshot_id: null,
    original_room_state: null,
    label_visible: true,
    time_entered: null,
  });
  
  const sessionIdRef = useRef<string>(`xr-session-${Date.now()}`);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (snapshotMode.active) {
          handleSnapshotExit();
        } else if (inspectionOpen) {
          setInspectionOpen(false);
        } else {
          handleExit('gesture');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snapshotMode.active, inspectionOpen]);
  
  // Entry callback
  useEffect(() => {
    onEnter?.(sessionIdRef.current);
  }, []);
  
  // Handlers
  const handleSelect = useCallback((id: string, type: string) => {
    setSelectedId(id);
    setSelectedType(type);
    setInspectionOpen(false);
    
    const selected: SelectedObject = {
      id,
      type: type as any,
      inspection_open: false,
    };
    onSelect?.(selected);
  }, [onSelect]);
  
  const handleInspect = useCallback((id: string, type: string) => {
    setSelectedId(id);
    setSelectedType(type);
    setInspectionOpen(true);
    
    const selected: SelectedObject = {
      id,
      type: type as any,
      inspection_open: true,
    };
    onSelect?.(selected);
  }, [onSelect]);
  
  const handleDeselect = useCallback(() => {
    setSelectedId(null);
    setSelectedType(null);
    setInspectionOpen(false);
    onSelect?.(null);
  }, [onSelect]);
  
  const handleSnapshotEnterMode = useCallback((snapshot_id: string) => {
    setSnapshotMode({
      active: true,
      snapshot_id,
      original_room_state: null, // Would store current state
      label_visible: true,
      time_entered: new Date().toISOString(),
    });
    onSnapshotEnter?.(snapshot_id);
  }, [onSnapshotEnter]);
  
  const handleSnapshotExit = useCallback(() => {
    setSnapshotMode({
      active: false,
      snapshot_id: null,
      original_room_state: null,
      label_visible: true,
      time_entered: null,
    });
    onSnapshotExit?.();
  }, [onSnapshotExit]);
  
  const handleExit = useCallback((method: ExitMethod) => {
    onExit?.(method);
  }, [onExit]);
  
  const handleWalkStart = useCallback((thread_id: string) => {
    // In actual XR, this would start walking along the thread
    onInteraction?.({
      type: 'walk_along',
      timestamp: new Date().toISOString(),
      target_id: thread_id,
      target_type: 'thread',
      position: userPosition,
      user_position: userPosition,
    });
  }, [onInteraction, userPosition]);
  
  // Default cognitive load
  const defaultLoad: XRCognitiveLoad = cognitive_load ?? {
    load_state: 'present',
    air_density: 0.2,
    movement_resistance: 0.1,
    sound_dampening: 0.3,
    visual_density: 0.2,
    color_temperature: 0.5,
    perception_cues: [],
  };
  
  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: XR_META_ROOM_TOKENS.environment.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };
  
  return (
    <div 
      className="xr-meta-room" 
      style={containerStyle}
      onClick={(e) => {
        // Deselect when clicking empty space
        if (e.target === e.currentTarget) {
          handleDeselect();
        }
      }}
    >
      {/* Environment */}
      <Environment config={config} load_state={defaultLoad} />
      
      {/* Load field (environmental perception) */}
      <LoadField load={defaultLoad} config={config} />
      
      {/* Meaning halo (ambient, frames objects) */}
      <MeaningHalo meanings={meanings} config={config} />
      
      {/* Thread field (floating semantic paths) */}
      <ThreadField
        threads={threads}
        config={config}
        selected_id={selectedType === 'thread' ? selectedId : null}
        hovered_id={hoveredId}
        onSelect={(id) => handleSelect(id, 'thread')}
        onHover={setHoveredId}
        onWalkStart={handleWalkStart}
      />
      
      {/* Decision anchors (crystalline nodes) */}
      <DecisionAnchors
        decisions={decisions}
        config={config}
        selected_id={selectedType === 'decision' ? selectedId : null}
        hovered_id={hoveredId}
        onSelect={(id) => handleSelect(id, 'decision')}
        onHover={setHoveredId}
        onInspect={(id) => handleInspect(id, 'decision')}
      />
      
      {/* Snapshot markers (temporal pillars) */}
      <SnapshotMarkers
        snapshots={snapshots}
        config={config}
        selected_id={selectedType === 'snapshot' ? selectedId : null}
        hovered_id={hoveredId}
        onSelect={(id) => handleSelect(id, 'snapshot')}
        onHover={setHoveredId}
        onEnter={handleSnapshotEnterMode}
      />
      
      {/* Agent boundaries */}
      <AgentBoundaries
        agents={agents}
        config={config}
        onInvite={onAgentInvite ?? (() => {})}
        onDismiss={onAgentDismiss ?? (() => {})}
      />
      
      {/* User presence */}
      <UserPresence position={userPosition} />
      
      {/* Snapshot mode overlay */}
      <SnapshotModeOverlay state={snapshotMode} onExit={handleSnapshotExit} />
      
      {/* Inspection panel */}
      <InspectionPanel
        selected={selectedId && selectedType ? {
          id: selectedId,
          type: selectedType as any,
          inspection_open: inspectionOpen,
        } : null}
        threads={threads}
        decisions={decisions}
        snapshots={snapshots}
        onClose={() => setInspectionOpen(false)}
      />
      
      {/* Exit controls - user is NEVER trapped */}
      <ExitControls onExit={handleExit} />
      
      {/* XR runtime indicator (preview mode) */}
      {xr_runtime === 'preview' && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          fontSize: 10,
          color: XR_META_ROOM_TOKENS.text.subtle,
          opacity: 0.5,
        }}>
          XR Preview Mode • Full XR requires WebXR runtime
        </div>
      )}
      
      {/* Global styles */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes thread-breathe {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.95; }
        }
        
        @keyframes crystal-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        
        @keyframes particle-rise {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        
        @keyframes meaning-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        
        .xr-meta-room * {
          box-sizing: border-box;
        }
        
        .xr-meta-room button:focus {
          outline: 2px solid ${XR_META_ROOM_TOKENS.text.secondary};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default XRMetaRoom;
