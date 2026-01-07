/**
 * CHE·NU™ Universe View — Main Component
 * 
 * The cognitive navigation layer of CHE·NU.
 * Makes continuity, context, and responsibility visible at a glance.
 * 
 * States:
 * - ORBITAL (default): User at center, spheres orbiting
 * - FOCUS: One sphere highlighted, others dimmed
 * - THREAD_LENS: Knowledge Thread activated
 * - DECISION_FOCUS: Decision with context and consequences
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ViewState,
  ZoomLevel,
  SphereId,
  SphereNode,
  MetaObject,
  AgentPresence,
  UniverseViewState,
  VisibilityToggles,
  HoveredObject,
  SelectedObject,
  NavigationAction,
  TooltipContent,
  SPHERE_META,
  VIEW_STATE_META,
  ZOOM_LEVEL_META,
  DEFAULT_VISIBILITY,
  UNIVERSE_COLORS,
} from './universe-view.types';

// ============================================================================
// PROPS
// ============================================================================

export interface UniverseViewProps {
  userId: string;
  initialState?: ViewState;
  initialZoom?: ZoomLevel;
  onSphereSelect?: (sphereId: SphereId) => void;
  onThreadActivate?: (threadId: string) => void;
  onSnapshotActivate?: (snapshotId: string) => void;
  onDecisionSelect?: (decisionId: string) => void;
  onAgentSelect?: (agentId: string) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_SPHERES: SphereNode[] = Object.entries(SPHERE_META).map(([id, meta], index) => {
  const angle = (index / 9) * Math.PI * 2;
  const radius = 280;
  return {
    id: id as SphereId,
    name: meta.name,
    icon: meta.icon,
    color: meta.color,
    position: {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 0,
    },
    size: 60,
    activity_level: ['high', 'medium', 'low', 'dormant'][Math.floor(Math.random() * 4)] as any,
    agent_count: Math.floor(Math.random() * 10) + 1,
    meta_objects: {
      threads: Math.floor(Math.random() * 5),
      snapshots: Math.floor(Math.random() * 3),
      decisions: Math.floor(Math.random() * 4),
    },
    is_focused: false,
    is_dimmed: false,
  };
});

const MOCK_THREADS: MetaObject[] = [
  {
    id: 'thread_001',
    type: 'thread' as const,
    title: 'Strategic Direction Q1',
    owner: 'user_001',
    created_at: '2025-12-01T10:00:00Z',
    last_activity: '2025-12-28T15:30:00Z',
    position: { x: 0, y: 0, z: 50 },
    is_visible: true,
    is_highlighted: false,
    path_points: [
      { x: -200, y: 100, z: 0 },
      { x: -50, y: 50, z: 0 },
      { x: 100, y: -100, z: 0 },
      { x: 250, y: -50, z: 0 },
    ],
    thickness: 3,
    color: UNIVERSE_COLORS.threadPath,
    linked_entity_ids: ['entity_1', 'entity_2', 'entity_3'],
    unresolved_count: 2,
    sphere_coverage: ['business', 'personal', 'studio'],
  },
];

const MOCK_SNAPSHOTS: MetaObject[] = [
  {
    id: 'snapshot_001',
    type: 'snapshot' as const,
    title: 'Pre-Launch State',
    owner: 'user_001',
    created_at: '2025-12-15T09:00:00Z',
    last_activity: '2025-12-15T09:00:00Z',
    position: { x: 150, y: -80, z: 30 },
    is_visible: true,
    is_highlighted: false,
    capture_reason: 'Capturing state before major deployment',
    scope: {
      spheres: ['business', 'studio'],
      agents: ['nova', 'creative_agent'],
      ui_state: 'orbital',
    },
    is_active_view: false,
  },
];

const MOCK_DECISIONS: MetaObject[] = [
  {
    id: 'decision_001',
    type: 'decision' as const,
    title: 'Technology Stack Selection',
    owner: 'user_001',
    created_at: '2025-12-10T14:00:00Z',
    last_activity: '2025-12-20T11:00:00Z',
    position: { x: -100, y: 150, z: 40 },
    is_visible: true,
    is_highlighted: false,
    question: 'Which framework should we use for the mobile app?',
    status: 'crystallized',
    option_count: 3,
    criteria_count: 5,
    linked_snapshot_id: 'snapshot_001',
    downstream_tasks: ['task_1', 'task_2'],
    downstream_threads: ['thread_001'],
    drift_status: {
      has_drift: true,
      drift_level: 'minor',
      changed_assumptions: ['Team size increased'],
      last_validated: '2025-12-20T11:00:00Z',
    },
  },
];

const MOCK_AGENTS: AgentPresence[] = [
  {
    agent_id: 'nova',
    agent_name: 'Nova',
    agent_icon: '🌟',
    contract_id: 'contract_nova_001',
    position: { x: 50, y: 50, z: 20 },
    aura_radius: 100,
    aura_intensity: 'subtle',
    aura_color: UNIVERSE_COLORS.agentAura,
    influenced_areas: ['business', 'personal'],
    has_pending_suggestions: true,
    suggestions: [
      {
        id: 'sug_001',
        agent_id: 'nova',
        suggestion_type: 'decision_drift',
        title: 'Decision may need review',
        description: 'The Technology Stack decision was made with different team assumptions.',
        target_id: 'decision_001',
        target_type: 'decision',
        priority: 'attention',
        created_at: '2025-12-28T10:00:00Z',
        dismissed: false,
      },
    ],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SphereNodeComponentProps {
  sphere: SphereNode;
  isSelected: boolean;
  isHovered: boolean;
  viewState: ViewState;
  onHover: (sphereId: SphereId | null) => void;
  onClick: (sphereId: SphereId) => void;
}

const SphereNodeComponent: React.FC<SphereNodeComponentProps> = ({
  sphere,
  isSelected,
  isHovered,
  viewState,
  onHover,
  onClick,
}) => {
  const opacity = sphere.is_dimmed ? 0.3 : 1;
  const scale = sphere.is_focused ? 1.2 : isHovered ? 1.1 : 1;
  
  const activityColor = {
    high: '#27AE60',
    medium: '#F39C12',
    low: '#E67E22',
    dormant: '#7F8C8D',
  }[sphere.activity_level];

  return (
    <g
      transform={`translate(${sphere.position.x}, ${sphere.position.y})`}
      style={{ 
        opacity,
        cursor: 'pointer',
        transition: 'all 0.3s ease-out',
      }}
      onMouseEnter={() => onHover(sphere.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(sphere.id)}
    >
      {/* Glow effect */}
      <circle
        r={sphere.size * scale + 15}
        fill={`url(#glow-${sphere.id})`}
        opacity={isSelected || isHovered ? 0.6 : 0.2}
      />
      
      {/* Main sphere */}
      <circle
        r={sphere.size * scale}
        fill={sphere.color}
        stroke={isSelected ? UNIVERSE_COLORS.sacredGold : 'transparent'}
        strokeWidth={isSelected ? 3 : 0}
      />
      
      {/* Icon */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={sphere.size * 0.5}
        fill={UNIVERSE_COLORS.starlight}
        style={{ pointerEvents: 'none' }}
      >
        {sphere.icon}
      </text>
      
      {/* Activity indicator */}
      <circle
        cx={sphere.size * 0.7}
        cy={-sphere.size * 0.7}
        r={8}
        fill={activityColor}
        stroke={UNIVERSE_COLORS.void}
        strokeWidth={2}
      />
      
      {/* Meta object count indicator */}
      {(sphere.meta_objects.threads > 0 || 
        sphere.meta_objects.decisions > 0) && (
        <g transform={`translate(${-sphere.size * 0.7}, ${-sphere.size * 0.7})`}>
          <circle
            r={10}
            fill={UNIVERSE_COLORS.sacredGold}
            opacity={0.8}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill={UNIVERSE_COLORS.void}
            fontWeight="bold"
          >
            {sphere.meta_objects.threads + sphere.meta_objects.decisions}
          </text>
        </g>
      )}
      
      {/* Gradient definition */}
      <defs>
        <radialGradient id={`glow-${sphere.id}`}>
          <stop offset="0%" stopColor={sphere.color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={sphere.color} stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
};

interface ThreadPathComponentProps {
  thread: MetaObject & { type: 'thread' };
  isActive: boolean;
  isHovered: boolean;
  onHover: (threadId: string | null) => void;
  onClick: (threadId: string) => void;
}

const ThreadPathComponent: React.FC<ThreadPathComponentProps> = ({
  thread,
  isActive,
  isHovered,
  onHover,
  onClick,
}) => {
  if (!thread.is_visible) return null;
  
  const pathD = thread.path_points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
  
  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(thread.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(thread.id)}
    >
      {/* Glow path */}
      <path
        d={pathD}
        fill="none"
        stroke={thread.color}
        strokeWidth={thread.thickness * 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isActive ? 0.4 : isHovered ? 0.3 : 0.15}
        style={{ filter: 'blur(8px)' }}
      />
      
      {/* Main path */}
      <path
        d={pathD}
        fill="none"
        stroke={isActive ? UNIVERSE_COLORS.focused : thread.color}
        strokeWidth={thread.thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isActive ? 1 : isHovered ? 0.8 : 0.5}
        strokeDasharray={isActive ? 'none' : '10 5'}
      />
      
      {/* Unresolved indicator */}
      {thread.unresolved_count > 0 && (
        <g transform={`translate(${thread.path_points[Math.floor(thread.path_points.length / 2)].x}, ${thread.path_points[Math.floor(thread.path_points.length / 2)].y - 20})`}>
          <circle r={12} fill={UNIVERSE_COLORS.driftWarning} opacity={0.9} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill={UNIVERSE_COLORS.void}
            fontWeight="bold"
          >
            {thread.unresolved_count}
          </text>
        </g>
      )}
    </g>
  );
};

interface SnapshotMarkerComponentProps {
  snapshot: MetaObject & { type: 'snapshot' };
  isActive: boolean;
  isHovered: boolean;
  onHover: (snapshotId: string | null) => void;
  onClick: (snapshotId: string) => void;
}

const SnapshotMarkerComponent: React.FC<SnapshotMarkerComponentProps> = ({
  snapshot,
  isActive,
  isHovered,
  onHover,
  onClick,
}) => {
  if (!snapshot.is_visible) return null;
  
  return (
    <g
      transform={`translate(${snapshot.position.x}, ${snapshot.position.y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(snapshot.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(snapshot.id)}
    >
      {/* Anchor marker ⦿ */}
      <circle
        r={isActive ? 18 : isHovered ? 16 : 14}
        fill={UNIVERSE_COLORS.snapshotAnchor}
        stroke={isActive ? UNIVERSE_COLORS.sacredGold : 'transparent'}
        strokeWidth={isActive ? 2 : 0}
        opacity={isActive ? 1 : 0.8}
      />
      <circle
        r={6}
        fill={UNIVERSE_COLORS.starlight}
        opacity={0.9}
      />
      
      {/* Snapshot icon */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={8}
        y={-24}
        fill={UNIVERSE_COLORS.starlight}
        opacity={isHovered || isActive ? 1 : 0}
      >
        📸
      </text>
    </g>
  );
};

interface DecisionCrystalComponentProps {
  decision: MetaObject & { type: 'decision' };
  isActive: boolean;
  isHovered: boolean;
  onHover: (decisionId: string | null) => void;
  onClick: (decisionId: string) => void;
}

const DecisionCrystalComponent: React.FC<DecisionCrystalComponentProps> = ({
  decision,
  isActive,
  isHovered,
  onHover,
  onClick,
}) => {
  if (!decision.is_visible) return null;
  
  const size = isActive ? 28 : isHovered ? 24 : 20;
  
  // Crystal shape (hexagon for faceted appearance)
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
  }).join(' ');
  
  const driftColor = {
    none: 'transparent',
    minor: UNIVERSE_COLORS.driftWarning,
    significant: UNIVERSE_COLORS.driftWarning,
    critical: UNIVERSE_COLORS.driftCritical,
  }[decision.drift_status.drift_level];

  return (
    <g
      transform={`translate(${decision.position.x}, ${decision.position.y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(decision.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(decision.id)}
    >
      {/* Glow when active */}
      {isActive && (
        <polygon
          points={points}
          fill={UNIVERSE_COLORS.decisionCrystal}
          opacity={0.3}
          style={{ filter: 'blur(10px)' }}
          transform="scale(1.5)"
        />
      )}
      
      {/* Crystal body */}
      <polygon
        points={points}
        fill={UNIVERSE_COLORS.decisionCrystal}
        stroke={isActive ? UNIVERSE_COLORS.starlight : UNIVERSE_COLORS.sacredGold}
        strokeWidth={2}
        opacity={isActive ? 1 : 0.85}
      />
      
      {/* Inner facet */}
      <polygon
        points={points}
        fill="none"
        stroke={UNIVERSE_COLORS.starlight}
        strokeWidth={1}
        opacity={0.3}
        transform="scale(0.6)"
      />
      
      {/* Status icon */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fill={UNIVERSE_COLORS.void}
      >
        {decision.status === 'crystallized' ? '⚖️' : '❓'}
      </text>
      
      {/* Drift warning halo */}
      {decision.drift_status.has_drift && (
        <circle
          r={size + 8}
          fill="none"
          stroke={driftColor}
          strokeWidth={3}
          strokeDasharray="5 3"
          opacity={0.8}
        />
      )}
    </g>
  );
};

interface AgentAuraComponentProps {
  agent: AgentPresence;
  isHovered: boolean;
  onHover: (agentId: string | null) => void;
  onClick: (agentId: string) => void;
}

const AgentAuraComponent: React.FC<AgentAuraComponentProps> = ({
  agent,
  isHovered,
  onHover,
  onClick,
}) => {
  const intensityOpacity = {
    none: 0,
    subtle: 0.1,
    medium: 0.2,
    strong: 0.3,
  }[agent.aura_intensity];

  return (
    <g
      transform={`translate(${agent.position.x}, ${agent.position.y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(agent.agent_id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(agent.agent_id)}
    >
      {/* Aura circle */}
      <circle
        r={agent.aura_radius}
        fill={agent.aura_color}
        opacity={isHovered ? intensityOpacity * 2 : intensityOpacity}
        style={{ transition: 'opacity 0.3s' }}
      />
      
      {/* Agent center marker */}
      <circle
        r={16}
        fill={UNIVERSE_COLORS.void}
        stroke={UNIVERSE_COLORS.focused}
        strokeWidth={2}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {agent.agent_icon}
      </text>
      
      {/* Pending suggestions indicator */}
      {agent.has_pending_suggestions && (
        <g transform="translate(12, -12)">
          <circle
            r={8}
            fill={UNIVERSE_COLORS.driftWarning}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill={UNIVERSE_COLORS.void}
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}
    </g>
  );
};

interface TooltipComponentProps {
  content: TooltipContent;
  position: { x: number; y: number };
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ content, position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x + 20,
        top: position.y - 10,
        background: UNIVERSE_COLORS.tooltipBg,
        border: `1px solid ${UNIVERSE_COLORS.tooltipBorder}`,
        borderRadius: '8px',
        padding: '12px 16px',
        maxWidth: '280px',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div style={{ 
        fontWeight: 600, 
        color: UNIVERSE_COLORS.starlight,
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {content.title}
      </div>
      {content.subtitle && (
        <div style={{ 
          fontSize: '12px', 
          color: UNIVERSE_COLORS.dimmed,
          marginBottom: '8px',
        }}>
          {content.subtitle}
        </div>
      )}
      {content.details.map((detail, i) => (
        <div 
          key={i}
          style={{ 
            fontSize: '12px',
            color: 'rgba(250, 249, 246, 0.7)',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}
        >
          <span>{detail.icon} {detail.label}</span>
          <span style={{ color: UNIVERSE_COLORS.sacredGold }}>{detail.value}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UniverseView: React.FC<UniverseViewProps> = ({
  userId,
  initialState = 'orbital',
  initialZoom = 'universe',
  onSphereSelect,
  onThreadActivate,
  onSnapshotActivate,
  onDecisionSelect,
  onAgentSelect,
}) => {
  // State
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(initialZoom);
  const [visibility, setVisibility] = useState<VisibilityToggles>(DEFAULT_VISIBILITY);
  const [hoveredObject, setHoveredObject] = useState<HoveredObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<SelectedObject | null>(null);
  const [focusedSphere, setFocusedSphere] = useState<SphereId | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [activeSnapshot, setActiveSnapshot] = useState<string | null>(null);
  const [activeDecision, setActiveDecision] = useState<string | null>(null);
  const [isSnapshotMode, setIsSnapshotMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Computed spheres with focus/dim state
  const spheres = useMemo(() => {
    return MOCK_SPHERES.map(sphere => ({
      ...sphere,
      is_focused: focusedSphere === sphere.id,
      is_dimmed: focusedSphere !== null && focusedSphere !== sphere.id,
    }));
  }, [focusedSphere]);

  // Meta objects
  const metaObjects = useMemo(() => {
    const all: MetaObject[] = [
      ...(visibility.show_threads ? MOCK_THREADS : []),
      ...(visibility.show_snapshots ? MOCK_SNAPSHOTS : []),
      ...(visibility.show_decisions ? MOCK_DECISIONS : []),
    ];
    return all;
  }, [visibility]);

  // Tooltip content
  const tooltipContent = useMemo((): TooltipContent | null => {
    if (!hoveredObject) return null;

    switch (hoveredObject.type) {
      case 'sphere': {
        const sphere = spheres.find(s => s.id === hoveredObject.id);
        if (!sphere) return null;
        return {
          type: 'sphere',
          title: `${sphere.icon} ${sphere.name}`,
          details: [
            { label: 'Activity', value: sphere.activity_level, icon: '📊' },
            { label: 'Agents', value: String(sphere.agent_count), icon: '🤖' },
            { label: 'Threads', value: String(sphere.meta_objects.threads), icon: '🧵' },
            { label: 'Decisions', value: String(sphere.meta_objects.decisions), icon: '⚖️' },
          ],
        };
      }
      case 'thread': {
        const thread = metaObjects.find(o => o.id === hoveredObject.id && o.type === 'thread');
        if (!thread || thread.type !== 'thread') return null;
        return {
          type: 'thread',
          title: `🧵 ${thread.title}`,
          subtitle: `Last activity: ${new Date(thread.last_activity).toLocaleDateString()}`,
          details: [
            { label: 'Linked entities', value: String(thread.linked_entity_ids.length), icon: '🔗' },
            { label: 'Unresolved', value: String(thread.unresolved_count), icon: '❓' },
            { label: 'Spheres', value: thread.sphere_coverage.length.toString(), icon: '🌐' },
          ],
        };
      }
      case 'snapshot': {
        const snapshot = metaObjects.find(o => o.id === hoveredObject.id && o.type === 'snapshot');
        if (!snapshot || snapshot.type !== 'snapshot') return null;
        return {
          type: 'snapshot',
          title: `📸 ${snapshot.title}`,
          subtitle: snapshot.capture_reason,
          details: [
            { label: 'Captured', value: new Date(snapshot.created_at).toLocaleDateString(), icon: '📅' },
            { label: 'Spheres', value: String(snapshot.scope.spheres.length), icon: '🌐' },
          ],
        };
      }
      case 'decision': {
        const decision = metaObjects.find(o => o.id === hoveredObject.id && o.type === 'decision');
        if (!decision || decision.type !== 'decision') return null;
        return {
          type: 'decision',
          title: `⚖️ ${decision.title}`,
          subtitle: decision.question,
          details: [
            { label: 'Status', value: decision.status, icon: '📊' },
            { label: 'Options', value: String(decision.option_count), icon: '🔢' },
            { label: 'Criteria', value: String(decision.criteria_count), icon: '📋' },
            { label: 'Drift', value: decision.drift_status.drift_level, icon: '⚠️' },
          ],
        };
      }
      case 'agent': {
        const agent = MOCK_AGENTS.find(a => a.agent_id === hoveredObject.id);
        if (!agent) return null;
        return {
          type: 'agent',
          title: `${agent.agent_icon} ${agent.agent_name}`,
          subtitle: `Contract: ${agent.contract_id}`,
          details: [
            { label: 'Influenced areas', value: agent.influenced_areas.join(', '), icon: '🎯' },
            { label: 'Suggestions', value: String(agent.suggestions.filter(s => !s.dismissed).length), icon: '💡' },
          ],
        };
      }
      default:
        return null;
    }
  }, [hoveredObject, spheres, metaObjects]);

  // Handlers
  const handleSphereHover = useCallback((sphereId: SphereId | null) => {
    if (sphereId) {
      setHoveredObject({ type: 'sphere', id: sphereId, position: mousePosition });
    } else {
      setHoveredObject(null);
    }
  }, [mousePosition]);

  const handleSphereClick = useCallback((sphereId: SphereId) => {
    if (viewState === 'orbital') {
      setViewState('focus');
      setFocusedSphere(sphereId);
    } else if (viewState === 'focus' && focusedSphere === sphereId) {
      setViewState('orbital');
      setFocusedSphere(null);
    } else {
      setFocusedSphere(sphereId);
    }
    onSphereSelect?.(sphereId);
  }, [viewState, focusedSphere, onSphereSelect]);

  const handleThreadHover = useCallback((threadId: string | null) => {
    if (threadId) {
      setHoveredObject({ type: 'thread', id: threadId, position: mousePosition });
    } else {
      setHoveredObject(null);
    }
  }, [mousePosition]);

  const handleThreadClick = useCallback((threadId: string) => {
    setViewState('thread_lens');
    setActiveThread(threadId);
    onThreadActivate?.(threadId);
  }, [onThreadActivate]);

  const handleSnapshotHover = useCallback((snapshotId: string | null) => {
    if (snapshotId) {
      setHoveredObject({ type: 'snapshot', id: snapshotId, position: mousePosition });
    } else {
      setHoveredObject(null);
    }
  }, [mousePosition]);

  const handleSnapshotClick = useCallback((snapshotId: string) => {
    setIsSnapshotMode(true);
    setActiveSnapshot(snapshotId);
    onSnapshotActivate?.(snapshotId);
  }, [onSnapshotActivate]);

  const handleDecisionHover = useCallback((decisionId: string | null) => {
    if (decisionId) {
      setHoveredObject({ type: 'decision', id: decisionId, position: mousePosition });
    } else {
      setHoveredObject(null);
    }
  }, [mousePosition]);

  const handleDecisionClick = useCallback((decisionId: string) => {
    setViewState('decision_focus');
    setActiveDecision(decisionId);
    onDecisionSelect?.(decisionId);
  }, [onDecisionSelect]);

  const handleAgentHover = useCallback((agentId: string | null) => {
    if (agentId) {
      setHoveredObject({ type: 'agent', id: agentId, position: mousePosition });
    } else {
      setHoveredObject(null);
    }
  }, [mousePosition]);

  const handleAgentClick = useCallback((agentId: string) => {
    onAgentSelect?.(agentId);
  }, [onAgentSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (hoveredObject) {
      setHoveredObject({ ...hoveredObject, position: { x: e.clientX, y: e.clientY } });
    }
  }, [hoveredObject]);

  const handleResetView = useCallback(() => {
    setViewState('orbital');
    setZoomLevel('universe');
    setFocusedSphere(null);
    setActiveThread(null);
    setActiveDecision(null);
    setIsSnapshotMode(false);
    setActiveSnapshot(null);
  }, []);

  const toggleVisibility = useCallback((key: keyof VisibilityToggles) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Exit snapshot mode
  const exitSnapshotMode = useCallback(() => {
    setIsSnapshotMode(false);
    setActiveSnapshot(null);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: UNIVERSE_COLORS.void,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Header Controls */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(10,10,11,0.9) 0%, transparent 100%)',
          zIndex: 100,
        }}
      >
        {/* View State Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ 
            color: UNIVERSE_COLORS.sacredGold, 
            margin: 0,
            fontSize: '18px',
            fontWeight: 500,
          }}>
            🌌 Universe View
          </h2>
          <span style={{
            padding: '4px 12px',
            background: 'rgba(212, 175, 55, 0.15)',
            borderRadius: '12px',
            fontSize: '12px',
            color: UNIVERSE_COLORS.sacredGold,
          }}>
            {VIEW_STATE_META[viewState].name}
          </span>
          {isSnapshotMode && (
            <span style={{
              padding: '4px 12px',
              background: 'rgba(139, 115, 85, 0.3)',
              borderRadius: '12px',
              fontSize: '12px',
              color: UNIVERSE_COLORS.snapshotAnchor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              📸 Snapshot View (Read-Only)
              <button
                onClick={exitSnapshotMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: UNIVERSE_COLORS.starlight,
                  cursor: 'pointer',
                  padding: '0 4px',
                }}
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* Visibility Toggles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'show_threads' as const, icon: '🧵', label: 'Threads' },
            { key: 'show_snapshots' as const, icon: '📸', label: 'Snapshots' },
            { key: 'show_decisions' as const, icon: '⚖️', label: 'Decisions' },
            { key: 'show_agent_auras' as const, icon: '🤖', label: 'Agents' },
          ].map(toggle => (
            <button
              key={toggle.key}
              onClick={() => toggleVisibility(toggle.key)}
              style={{
                padding: '6px 12px',
                background: visibility[toggle.key] 
                  ? 'rgba(212, 175, 55, 0.2)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${visibility[toggle.key] 
                  ? UNIVERSE_COLORS.sacredGold 
                  : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                color: visibility[toggle.key] 
                  ? UNIVERSE_COLORS.sacredGold 
                  : UNIVERSE_COLORS.dimmed,
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              {toggle.icon} {toggle.label}
            </button>
          ))}
          <button
            onClick={handleResetView}
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: UNIVERSE_COLORS.starlight,
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Main SVG Canvas */}
      <svg
        width="100%"
        height="100%"
        viewBox="-400 -400 800 800"
        style={{ display: 'block' }}
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="space-bg">
            <stop offset="0%" stopColor={UNIVERSE_COLORS.deepSpace} />
            <stop offset="100%" stopColor={UNIVERSE_COLORS.void} />
          </radialGradient>
        </defs>
        <rect x="-400" y="-400" width="800" height="800" fill="url(#space-bg)" />

        {/* Agent Auras (behind everything) */}
        {visibility.show_agent_auras && MOCK_AGENTS.map(agent => (
          <AgentAuraComponent
            key={agent.agent_id}
            agent={agent}
            isHovered={hoveredObject?.type === 'agent' && hoveredObject.id === agent.agent_id}
            onHover={handleAgentHover}
            onClick={handleAgentClick}
          />
        ))}

        {/* Thread Paths */}
        {visibility.show_threads && MOCK_THREADS.map(thread => (
          <ThreadPathComponent
            key={thread.id}
            thread={thread as any}
            isActive={activeThread === thread.id}
            isHovered={hoveredObject?.type === 'thread' && hoveredObject.id === thread.id}
            onHover={handleThreadHover}
            onClick={handleThreadClick}
          />
        ))}

        {/* Spheres */}
        {spheres.map(sphere => (
          <SphereNodeComponent
            key={sphere.id}
            sphere={sphere}
            isSelected={focusedSphere === sphere.id}
            isHovered={hoveredObject?.type === 'sphere' && hoveredObject.id === sphere.id}
            viewState={viewState}
            onHover={handleSphereHover}
            onClick={handleSphereClick}
          />
        ))}

        {/* Snapshots */}
        {visibility.show_snapshots && MOCK_SNAPSHOTS.map(snapshot => (
          <SnapshotMarkerComponent
            key={snapshot.id}
            snapshot={snapshot as any}
            isActive={activeSnapshot === snapshot.id}
            isHovered={hoveredObject?.type === 'snapshot' && hoveredObject.id === snapshot.id}
            onHover={handleSnapshotHover}
            onClick={handleSnapshotClick}
          />
        ))}

        {/* Decisions */}
        {visibility.show_decisions && MOCK_DECISIONS.map(decision => (
          <DecisionCrystalComponent
            key={decision.id}
            decision={decision as any}
            isActive={activeDecision === decision.id}
            isHovered={hoveredObject?.type === 'decision' && hoveredObject.id === decision.id}
            onHover={handleDecisionHover}
            onClick={handleDecisionClick}
          />
        ))}

        {/* User Center (in orbital view) */}
        {viewState === 'orbital' && (
          <g>
            <circle
              r={24}
              fill={UNIVERSE_COLORS.sacredGold}
              opacity={0.2}
            />
            <circle
              r={12}
              fill={UNIVERSE_COLORS.void}
              stroke={UNIVERSE_COLORS.sacredGold}
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10}
              fill={UNIVERSE_COLORS.sacredGold}
            >
              👤
            </text>
          </g>
        )}
      </svg>

      {/* Zoom Level Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          gap: '4px',
          background: 'rgba(10,10,11,0.8)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${UNIVERSE_COLORS.tooltipBorder}`,
        }}
      >
        {(['universe', 'sphere', 'category', 'item', 'meta'] as ZoomLevel[]).map(level => (
          <button
            key={level}
            onClick={() => setZoomLevel(level)}
            style={{
              width: '32px',
              height: '8px',
              background: zoomLevel === level 
                ? UNIVERSE_COLORS.sacredGold 
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title={ZOOM_LEVEL_META[level].name}
          />
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          background: 'rgba(10,10,11,0.8)',
          padding: '12px 16px',
          borderRadius: '8px',
          border: `1px solid ${UNIVERSE_COLORS.tooltipBorder}`,
          fontSize: '11px',
          color: UNIVERSE_COLORS.dimmed,
        }}
      >
        <div style={{ marginBottom: '8px', color: UNIVERSE_COLORS.starlight, fontWeight: 500 }}>
          Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>🧵 Thread (continuity)</div>
          <div>📸 Snapshot (context)</div>
          <div>⚖️ Decision (responsibility)</div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', marginTop: '4px' }}>
            Click sphere → Focus
          </div>
          <div>Click thread → Thread Lens</div>
          <div>Click decision → Decision Focus</div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipContent && hoveredObject && (
        <TooltipComponent
          content={tooltipContent}
          position={hoveredObject.position}
        />
      )}
    </div>
  );
};

export default UniverseView;
