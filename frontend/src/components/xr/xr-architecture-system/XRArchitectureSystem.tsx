/**
 * CHE·NU™ XR ARCHITECTURE SYSTEM — COMPONENT
 * 
 * Coherent, intentional spatial language.
 * XR is not decoration. XR is structural cognition.
 * 
 * @version 1.0
 * @status V51-ready
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type {
  XRArchitectureSystemProps,
  ArchitecturalPrimitive,
  ArchitecturalPrimitiveType,
  AnchorPrimitive,
  PathPrimitive,
  FieldPrimitive,
  NodePrimitive,
  BoundaryPrimitive,
  HorizonPrimitive,
  DepthPrimitive,
  SemanticViolation,
  ComplianceCheckResult,
  RoomType,
} from './xr-architecture-system.types';

import {
  XR_ARCHITECTURE_TOKENS,
  DEFAULT_SPATIAL_SEMANTICS,
  DEFAULT_COLOR_PHILOSOPHY,
  DEFAULT_NAVIGATION_CONFIG,
} from './xr-architecture-system.types';

import { useXRArchitecture } from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: '600px',
    background: XR_ARCHITECTURE_TOKENS.colors.background,
    color: 'rgba(255, 255, 255, 0.85)',
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
    background: 'rgba(20, 20, 35, 0.9)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(136, 136, 170, 0.2)',
    backdropFilter: 'blur(10px)',
    pointerEvents: 'auto' as const,
  },
  
  infoPanel: {
    top: '20px',
    left: '20px',
    maxWidth: '320px',
  },
  
  primitivesPanel: {
    top: '20px',
    right: '20px',
    maxWidth: '300px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  
  validationPanel: {
    bottom: '20px',
    left: '20px',
    right: '20px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  
  semanticsPanel: {
    bottom: '20px',
    right: '20px',
    maxWidth: '350px',
  },
  
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  label: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  
  value: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '12px',
  },
  
  primitiveItem: {
    padding: '10px',
    background: 'rgba(136, 136, 170, 0.1)',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(136, 136, 170, 0.15)',
  },
  
  primitiveType: {
    fontSize: '12px',
    fontWeight: 600,
    color: XR_ARCHITECTURE_TOKENS.colors.neutral,
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
  },
  
  primitiveMeaning: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic' as const,
  },
  
  violation: {
    padding: '10px',
    background: 'rgba(170, 170, 136, 0.15)',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(170, 170, 136, 0.3)',
  },
  
  warning: {
    padding: '10px',
    background: 'rgba(136, 136, 170, 0.15)',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(136, 136, 170, 0.3)',
  },
  
  compliant: {
    padding: '12px',
    background: 'rgba(136, 170, 136, 0.15)',
    borderRadius: '8px',
    border: '1px solid rgba(136, 170, 136, 0.3)',
    textAlign: 'center' as const,
  },
  
  semanticRule: {
    padding: '8px',
    background: 'rgba(136, 136, 170, 0.1)',
    borderRadius: '6px',
    marginBottom: '6px',
    fontSize: '12px',
  },
  
  semanticKey: {
    color: XR_ARCHITECTURE_TOKENS.colors.neutral,
    fontWeight: 600,
  },
  
  semanticValue: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  button: {
    padding: '8px 16px',
    background: 'rgba(136, 136, 170, 0.2)',
    border: '1px solid rgba(136, 136, 170, 0.3)',
    borderRadius: '6px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  buttonRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE VISUALIZATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface PrimitiveVisualizationProps {
  primitive: ArchitecturalPrimitive;
  scale?: number;
}

/**
 * Anchor visualization
 */
const AnchorVisualization: React.FC<{ primitive: AnchorPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const size = XR_ARCHITECTURE_TOKENS.primitives.anchor.default_size * scale;
  const glowColor = XR_ARCHITECTURE_TOKENS.primitives.anchor.glow_color;
  
  const x = 50 + primitive.position.x * 10;
  const y = 50 + primitive.position.z * 10;
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow */}
      <circle
        r={size * 100 * 1.5}
        fill={glowColor}
        opacity={0.3}
      />
      {/* Core */}
      <circle
        r={size * 100}
        fill={primitive.material.base_color}
        opacity={primitive.opacity}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={1}
      />
      {/* Pulse (if active) */}
      {primitive.pulse_rate > 0 && (
        <circle
          r={size * 100 * 1.2}
          fill="none"
          stroke={primitive.material.base_color}
          strokeWidth={0.5}
          opacity={0.5}
        >
          <animate
            attributeName="r"
            from={size * 100}
            to={size * 100 * 1.5}
            dur={`${1 / primitive.pulse_rate}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from={0.5}
            to={0}
            dur={`${1 / primitive.pulse_rate}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
};

/**
 * Path visualization
 */
const PathVisualization: React.FC<{ primitive: PathPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const thickness = XR_ARCHITECTURE_TOKENS.primitives.path.default_thickness * scale;
  const color = XR_ARCHITECTURE_TOKENS.primitives.path.color;
  
  const points = primitive.waypoints.map(wp => ({
    x: 50 + wp.x * 10,
    y: 50 + wp.z * 10,
  }));
  
  if (points.length < 2) return null;
  
  const pathD = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '');
  
  const dashArray = primitive.continuity === 'dashed' ? '5,5' 
    : primitive.continuity === 'dotted' ? '2,4'
    : undefined;
  
  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={thickness * 100}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={primitive.opacity}
      />
      {/* Direction indicator */}
      {primitive.direction_shown && points.length >= 2 && (
        <polygon
          points="0,-4 8,0 0,4"
          fill={color}
          transform={`translate(${points[points.length - 1].x}, ${points[points.length - 1].y})`}
          opacity={0.7}
        />
      )}
    </g>
  );
};

/**
 * Field visualization
 */
const FieldVisualization: React.FC<{ primitive: FieldPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const radius = primitive.influence_radius * 10 * scale;
  const x = 50 + primitive.influence_center.x * 10;
  const y = 50 + primitive.influence_center.z * 10;
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Gradient field */}
      <defs>
        <radialGradient id={`field-gradient-${primitive.id}`}>
          <stop offset="0%" stopColor={primitive.ambient_color} stopOpacity={primitive.intensity * 0.5} />
          <stop offset="100%" stopColor={primitive.ambient_color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle
        r={radius}
        fill={`url(#field-gradient-${primitive.id})`}
        opacity={primitive.opacity}
      />
    </g>
  );
};

/**
 * Node visualization
 */
const NodeVisualization: React.FC<{ primitive: NodePrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const size = XR_ARCHITECTURE_TOKENS.primitives.node.default_size * scale;
  const x = 50 + primitive.position.x * 10;
  const y = 50 + primitive.position.z * 10;
  
  const renderShape = () => {
    switch (primitive.shape) {
      case 'sphere':
        return <circle r={size * 50} />;
      case 'cube':
        return <rect x={-size * 50} y={-size * 50} width={size * 100} height={size * 100} />;
      case 'cylinder':
        return <ellipse rx={size * 50} ry={size * 30} />;
      case 'cone':
        return <polygon points={`0,${-size * 50} ${size * 50},${size * 50} ${-size * 50},${size * 50}`} />;
      case 'torus':
        return (
          <>
            <circle r={size * 50} fill="none" strokeWidth={size * 20} />
          </>
        );
      default:
        return <circle r={size * 50} />;
    }
  };
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Selection glow */}
      {primitive.selected && (
        <circle
          r={size * 60}
          fill="none"
          stroke={primitive.highlight_color || XR_ARCHITECTURE_TOKENS.primitives.node.highlight_color}
          strokeWidth={2}
          opacity={primitive.selection_glow}
        />
      )}
      {/* Shape */}
      <g
        fill={primitive.material.base_color}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
        opacity={primitive.opacity}
      >
        {renderShape()}
      </g>
    </g>
  );
};

/**
 * Boundary visualization
 */
const BoundaryVisualization: React.FC<{ primitive: BoundaryPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const bounds = primitive.bounds;
  const x = 50 + bounds.center.x * 10;
  const y = 50 + bounds.center.z * 10;
  
  // Simplified to box bounds
  const width = (bounds.max?.x || 5) * 20 * scale;
  const height = (bounds.max?.z || 5) * 20 * scale;
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={XR_ARCHITECTURE_TOKENS.primitives.boundary.fill_color}
        stroke={XR_ARCHITECTURE_TOKENS.primitives.boundary.border_color}
        strokeWidth={primitive.border_style === 'line' ? 2 : 1}
        strokeDasharray={primitive.permeability === 'permeable' ? '5,5' : undefined}
        opacity={primitive.border_opacity}
        rx={4}
      />
    </g>
  );
};

/**
 * Horizon visualization
 */
const HorizonVisualization: React.FC<{ primitive: HorizonPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const distance = primitive.distance * 10 * scale;
  
  return (
    <g>
      <defs>
        <linearGradient id={`horizon-gradient-${primitive.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset={`${primitive.fade_start * 100}%`} stopColor={primitive.atmosphere_color} stopOpacity={0} />
          <stop offset={`${primitive.fade_end * 100}%`} stopColor={XR_ARCHITECTURE_TOKENS.primitives.horizon.fade_color} stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={100 - distance}
        width={100}
        height={distance}
        fill={`url(#horizon-gradient-${primitive.id})`}
        opacity={primitive.opacity}
      />
    </g>
  );
};

/**
 * Depth visualization
 */
const DepthVisualization: React.FC<{ primitive: DepthPrimitive; scale?: number }> = ({
  primitive,
  scale = 1,
}) => {
  const x = 50 + primitive.position.x * 10;
  const y = 50 + primitive.position.z * 10;
  const levelSize = 20 * scale;
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Depth layers */}
      {Array.from({ length: primitive.depth_level + 1 }, (_, i) => (
        <rect
          key={i}
          x={-levelSize / 2 + i * 2}
          y={-levelSize / 2 + i * 2}
          width={levelSize - i * 4}
          height={levelSize - i * 4}
          fill="none"
          stroke={XR_ARCHITECTURE_TOKENS.primitives.depth.fog_color}
          strokeWidth={1}
          opacity={(1 - i * XR_ARCHITECTURE_TOKENS.primitives.depth.level_tint) * primitive.opacity}
          rx={2}
        />
      ))}
      {/* Level indicator */}
      <text
        y={levelSize / 2 + 12}
        textAnchor="middle"
        fontSize={10}
        fill="rgba(255, 255, 255, 0.5)"
      >
        L{primitive.depth_level}
      </text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INFO PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface InfoPanelProps {
  room_type: RoomType;
  primitive_count: number;
  compliant: boolean | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  room_type,
  primitive_count,
  compliant,
}) => {
  return (
    <div style={{ ...styles.panel, ...styles.infoPanel }}>
      <div style={styles.title}>
        <span>🏛️</span>
        <span>XR Architecture System</span>
      </div>
      
      <div style={styles.label}>Room Type</div>
      <div style={styles.value}>{room_type.replace('_', ' ').toUpperCase()}</div>
      
      <div style={styles.label}>Primitives</div>
      <div style={styles.value}>{primitive_count}</div>
      
      <div style={styles.label}>Compliance</div>
      <div style={{
        ...styles.value,
        color: compliant === null 
          ? 'rgba(255, 255, 255, 0.5)'
          : compliant 
            ? XR_ARCHITECTURE_TOKENS.colors.positive
            : XR_ARCHITECTURE_TOKENS.colors.negative,
      }}>
        {compliant === null ? 'Not validated' : compliant ? 'Compliant' : 'Violations detected'}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface PrimitivesPanelProps {
  primitives: ArchitecturalPrimitive[];
  onRemove?: (id: string) => void;
}

const PrimitivesPanel: React.FC<PrimitivesPanelProps> = ({
  primitives,
  onRemove,
}) => {
  if (primitives.length === 0) return null;
  
  const typeIcons: Record<ArchitecturalPrimitiveType, string> = {
    anchor: '⚓',
    path: '〰️',
    field: '🌫️',
    node: '⬡',
    boundary: '▢',
    horizon: '🌅',
    depth: '📊',
  };
  
  return (
    <div style={{ ...styles.panel, ...styles.primitivesPanel }}>
      <div style={styles.title}>
        <span>📦</span>
        <span>Primitives ({primitives.length})</span>
      </div>
      
      {primitives.slice(0, 10).map(primitive => (
        <div key={primitive.id} style={styles.primitiveItem}>
          <div style={styles.primitiveType}>
            {typeIcons[primitive.type]} {primitive.type}
          </div>
          <div style={styles.primitiveMeaning}>
            "{primitive.semantic_meaning}"
          </div>
        </div>
      ))}
      
      {primitives.length > 10 && (
        <div style={{ ...styles.label, textAlign: 'center', marginTop: '8px' }}>
          +{primitives.length - 10} more
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface ValidationPanelProps {
  result: ComplianceCheckResult | null;
  onValidate: () => void;
  isValidating: boolean;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  result,
  onValidate,
  isValidating,
}) => {
  return (
    <div style={{ ...styles.panel, ...styles.validationPanel }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={styles.title}>
          <span>✓</span>
          <span>Validation</span>
        </div>
        <button
          style={styles.button}
          onClick={onValidate}
          disabled={isValidating}
        >
          {isValidating ? 'Validating...' : 'Validate'}
        </button>
      </div>
      
      {result === null && (
        <div style={{ ...styles.label, textAlign: 'center' }}>
          Click "Validate" to check compliance
        </div>
      )}
      
      {result && result.compliant && result.violations.length === 0 && (
        <div style={styles.compliant}>
          ✓ All checks passed — Room is compliant
        </div>
      )}
      
      {result && result.violations.length > 0 && (
        <div>
          <div style={{ ...styles.label, marginBottom: '8px' }}>
            {result.violations.length} violation(s)
          </div>
          {result.violations.map((v, i) => (
            <div key={i} style={styles.violation}>
              <div style={{ fontWeight: 600, marginBottom: '4px', color: XR_ARCHITECTURE_TOKENS.colors.negative }}>
                {v.severity.toUpperCase()}: {v.rule}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {v.description}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {result && result.warnings.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ ...styles.label, marginBottom: '8px' }}>
            {result.warnings.length} warning(s)
          </div>
          {result.warnings.map((w, i) => (
            <div key={i} style={styles.warning}>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {w.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEMANTICS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface SemanticsPanelProps {
  semantics: typeof DEFAULT_SPATIAL_SEMANTICS;
}

const SemanticsPanel: React.FC<SemanticsPanelProps> = ({
  semantics,
}) => {
  const rules = [
    { key: 'center_means', label: 'CENTER', notLabel: 'importance' },
    { key: 'height_means', label: 'HEIGHT', notLabel: 'authority' },
    { key: 'size_means', label: 'SIZE', notLabel: 'value' },
    { key: 'brightness_means', label: 'BRIGHTNESS', notLabel: 'priority' },
    { key: 'motion_means', label: 'MOTION', notLabel: 'urgency' },
  ] as const;
  
  return (
    <div style={{ ...styles.panel, ...styles.semanticsPanel }}>
      <div style={styles.title}>
        <span>📐</span>
        <span>Spatial Semantics</span>
      </div>
      
      <div style={{ ...styles.label, marginBottom: '8px' }}>
        Non-negotiable rules
      </div>
      
      {rules.map(rule => (
        <div key={rule.key} style={styles.semanticRule}>
          <span style={styles.semanticKey}>{rule.label}</span>
          <span style={styles.semanticValue}> = {semantics[rule.key]}</span>
          <span style={{ color: 'rgba(170, 170, 136, 0.7)', marginLeft: '8px' }}>
            (≠ {rule.notLabel})
          </span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════════════════════════════════

interface ArchitectureCanvasProps {
  primitives: ArchitecturalPrimitive[];
  render_mode: 'full' | 'wireframe' | 'debug';
}

const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  primitives,
  render_mode,
}) => {
  // Sort primitives by type for layering
  const sortedPrimitives = useMemo(() => {
    const order: Record<ArchitecturalPrimitiveType, number> = {
      horizon: 0,
      field: 1,
      boundary: 2,
      path: 3,
      depth: 4,
      node: 5,
      anchor: 6,
    };
    return [...primitives].sort((a, b) => order[a.type] - order[b.type]);
  }, [primitives]);
  
  const renderPrimitive = (primitive: ArchitecturalPrimitive) => {
    switch (primitive.type) {
      case 'anchor':
        return <AnchorVisualization key={primitive.id} primitive={primitive as AnchorPrimitive} />;
      case 'path':
        return <PathVisualization key={primitive.id} primitive={primitive as PathPrimitive} />;
      case 'field':
        return <FieldVisualization key={primitive.id} primitive={primitive as FieldPrimitive} />;
      case 'node':
        return <NodeVisualization key={primitive.id} primitive={primitive as NodePrimitive} />;
      case 'boundary':
        return <BoundaryVisualization key={primitive.id} primitive={primitive as BoundaryPrimitive} />;
      case 'horizon':
        return <HorizonVisualization key={primitive.id} primitive={primitive as HorizonPrimitive} />;
      case 'depth':
        return <DepthVisualization key={primitive.id} primitive={primitive as DepthPrimitive} />;
      default:
        return null;
    }
  };
  
  return (
    <svg style={styles.canvas} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Background */}
      <rect width="100" height="100" fill={XR_ARCHITECTURE_TOKENS.colors.background} />
      
      {/* Grid (debug mode) */}
      {render_mode === 'debug' && (
        <g stroke="rgba(136, 136, 170, 0.1)" strokeWidth={0.2}>
          {Array.from({ length: 10 }, (_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 10} y1={0} x2={i * 10} y2={100} />
              <line x1={0} y1={i * 10} x2={100} y2={i * 10} />
            </React.Fragment>
          ))}
        </g>
      )}
      
      {/* Center marker */}
      <circle cx={50} cy={50} r={1} fill="rgba(136, 136, 170, 0.3)" />
      
      {/* Primitives */}
      <g opacity={render_mode === 'wireframe' ? 0.5 : 1}>
        {sortedPrimitives.map(renderPrimitive)}
      </g>
      
      {/* Empty state */}
      {primitives.length === 0 && (
        <text
          x={50}
          y={50}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.3)"
          fontSize={3}
        >
          No primitives
        </text>
      )}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const XRArchitectureSystem: React.FC<XRArchitectureSystemProps> = ({
  room_type,
  primitives: initial_primitives = [],
  color_philosophy,
  spatial_semantics,
  navigation_config,
  validate_on_change = false,
  architect_agent_enabled = true,
  onPrimitiveAdd,
  onPrimitiveRemove,
  onValidationResult,
  onViolation,
  render_mode = 'full',
}) => {
  // Use combined architecture hook
  const architecture = useXRArchitecture({
    room_type,
    initial_primitives,
    color_philosophy,
    spatial_semantics,
    navigation_config,
    architect_agent_enabled,
  });
  
  const [validationResult, setValidationResult] = useState<ComplianceCheckResult | null>(null);
  
  // Handle validation
  const handleValidate = useCallback(async () => {
    const result = await architecture.validate_all();
    setValidationResult(result);
    
    onValidationResult?.(result);
    
    // Report violations
    for (const violation of result.violations) {
      onViolation?.(violation);
    }
  }, [architecture, onValidationResult, onViolation]);
  
  // Auto-validate on change
  useEffect(() => {
    if (validate_on_change && architecture.primitives.primitives.length > 0) {
      handleValidate();
    }
  }, [validate_on_change, architecture.primitives.primitives.length]);
  
  return (
    <div style={styles.container}>
      {/* Canvas */}
      <ArchitectureCanvas
        primitives={architecture.primitives.primitives}
        render_mode={render_mode}
      />
      
      {/* Overlay panels */}
      <div style={styles.overlay}>
        {/* Info panel */}
        <InfoPanel
          room_type={room_type}
          primitive_count={architecture.primitives.primitive_count}
          compliant={validationResult?.compliant ?? null}
        />
        
        {/* Primitives panel */}
        <PrimitivesPanel
          primitives={architecture.primitives.primitives}
          onRemove={onPrimitiveRemove}
        />
        
        {/* Semantics panel */}
        <SemanticsPanel
          semantics={architecture.semantics.semantics}
        />
        
        {/* Validation panel */}
        <ValidationPanel
          result={validationResult}
          onValidate={handleValidate}
          isValidating={architecture.architect.is_validating}
        />
      </div>
    </div>
  );
};

export default XRArchitectureSystem;
