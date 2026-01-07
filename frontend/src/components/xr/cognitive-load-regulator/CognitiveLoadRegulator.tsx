/**
 * CHE·NU™ Cognitive Load Regulator — Main Components
 * 
 * Makes mental overload VISIBLE, EXPLICIT, and RESPECTED.
 * The system adapts to the human, never the reverse.
 * 
 * Core principles:
 * - No nudging, no guilt framing
 * - No productivity pressure
 * - Tells what is happening, not what to do
 * 
 * @module cognitive-load-regulator
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  CognitiveLoadState,
  LoadState,
  LoadDimensions,
  ContributingFactor,
  ContributingFactorType,
  RegulatorUIState,
  LoadSuggestion,
  SystemAdaptation,
  IndicatorPosition,
  LOAD_STATE_META,
  FACTOR_META,
  REGULATOR_COLORS,
  AGENT_LOAD_PHRASINGS,
} from './cognitive-load-regulator.types';

// ============================================================================
// Shared Styles
// ============================================================================

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: REGULATOR_COLORS.text,
  },
  card: {
    backgroundColor: REGULATOR_COLORS.background,
    border: `1px solid ${REGULATOR_COLORS.border}`,
    borderRadius: '12px',
    padding: '16px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
};

// ============================================================================
// LoadIndicator — Ambient peripheral indicator
// ============================================================================

interface LoadIndicatorProps {
  loadState: CognitiveLoadState;
  position?: IndicatorPosition;
  onExpand?: () => void;
  onHide?: () => void;
}

export const LoadIndicator: React.FC<LoadIndicatorProps> = ({
  loadState,
  position = 'bottom-right',
  onExpand,
  onHide,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const stateMeta = LOAD_STATE_META[loadState.state];
  
  const positionStyles: Record<IndicatorPosition, React.CSSProperties> = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
  };

  // Calculate average load for size
  const avgLoad = useMemo(() => {
    const dims = loadState.dimensions;
    return (dims.density + dims.fragmentation + dims.ambiguity + 
            dims.volatility + dims.responsibility_weight) / 5;
  }, [loadState.dimensions]);

  const indicatorSize = 12 + Math.min(avgLoad / 10, 8); // 12-20px

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: isHovered ? 'rgba(30, 30, 40, 0.95)' : 'rgba(20, 20, 30, 0.7)',
        border: `1px solid ${isHovered ? stateMeta.color : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
    >
      {/* Indicator dot */}
      <div
        style={{
          width: `${indicatorSize}px`,
          height: `${indicatorSize}px`,
          borderRadius: '50%',
          backgroundColor: stateMeta.color,
          opacity: 0.8,
          transition: 'all 0.3s ease',
          boxShadow: isHovered ? `0 0 12px ${stateMeta.color}40` : 'none',
        }}
      />
      
      {/* Label (shown on hover) */}
      {isHovered && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{
            fontSize: '13px',
            color: REGULATOR_COLORS.text,
          }}>
            {stateMeta.icon} {stateMeta.label}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onHide?.(); }}
            style={{
              ...styles.button,
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: REGULATOR_COLORS.textMuted,
            }}
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// LoadBreakdown — Expanded view of contributing factors
// ============================================================================

interface LoadBreakdownProps {
  loadState: CognitiveLoadState;
  onClose?: () => void;
  onFactorClick?: (factor: ContributingFactor) => void;
}

export const LoadBreakdown: React.FC<LoadBreakdownProps> = ({
  loadState,
  onClose,
  onFactorClick,
}) => {
  const stateMeta = LOAD_STATE_META[loadState.state];
  
  // Sort factors by contribution
  const sortedFactors = useMemo(() => 
    [...loadState.factors].sort((a, b) => b.contribution - a.contribution),
  [loadState.factors]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      width: '380px',
      maxHeight: '70vh',
      overflowY: 'auto',
      ...styles.card,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      zIndex: 101,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${REGULATOR_COLORS.border}`,
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ 
              fontSize: '20px', 
              color: stateMeta.color 
            }}>
              {stateMeta.icon}
            </span>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: stateMeta.color,
            }}>
              {stateMeta.label}
            </span>
          </div>
          <p style={{
            fontSize: '13px',
            color: REGULATOR_COLORS.textMuted,
            margin: '4px 0 0 0',
          }}>
            {stateMeta.description}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            ...styles.button,
            backgroundColor: 'transparent',
            color: REGULATOR_COLORS.textMuted,
            padding: '4px 8px',
          }}
        >
          ×
        </button>
      </div>

      {/* Dimensions visualization */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '20px',
      }}>
        {(['density', 'fragmentation', 'ambiguity', 'volatility', 'responsibility_weight'] as const).map(dim => (
          <DimensionBar
            key={dim}
            label={dim.replace('_', ' ')}
            value={loadState.dimensions[dim]}
            color={stateMeta.color}
          />
        ))}
      </div>

      {/* Contributing factors */}
      <div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 600,
          color: REGULATOR_COLORS.textMuted,
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Contributing Factors
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedFactors.map(factor => (
            <FactorCard
              key={factor.type}
              factor={factor}
              onClick={() => onFactorClick?.(factor)}
            />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: `1px solid ${REGULATOR_COLORS.border}`,
        fontSize: '12px',
        color: REGULATOR_COLORS.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        This is an observation, not a judgment.
        <br />
        You decide what to do with this information.
      </div>
    </div>
  );
};

// ============================================================================
// DimensionBar — Visual bar for a single dimension
// ============================================================================

interface DimensionBarProps {
  label: string;
  value: number;
  color: string;
}

const DimensionBar: React.FC<DimensionBarProps> = ({ label, value, color }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        height: '60px',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{
          height: `${value}%`,
          backgroundColor: color,
          opacity: 0.6,
          transition: 'height 0.5s ease',
        }} />
      </div>
      <div style={{
        fontSize: '10px',
        color: REGULATOR_COLORS.textMuted,
        marginTop: '4px',
        textTransform: 'capitalize',
      }}>
        {label.substring(0, 4)}
      </div>
    </div>
  );
};

// ============================================================================
// FactorCard — Single contributing factor
// ============================================================================

interface FactorCardProps {
  factor: ContributingFactor;
  onClick?: () => void;
}

const FactorCard: React.FC<FactorCardProps> = ({ factor, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = FACTOR_META[factor.type];
  
  const contributionPct = Math.round(factor.contribution * 100);
  const isAboveBaseline = factor.value > factor.baseline;

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 30, 40, 0.8)',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '14px',
          color: REGULATOR_COLORS.text,
        }}>
          {meta.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '13px',
            color: isAboveBaseline ? '#F59E0B' : REGULATOR_COLORS.textMuted,
          }}>
            {factor.value}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: REGULATOR_COLORS.textMuted,
          }}>
            {contributionPct}%
          </span>
        </div>
      </div>
      
      {expanded && (
        <div style={{
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <p style={{
            fontSize: '12px',
            color: REGULATOR_COLORS.textMuted,
            margin: '0 0 8px 0',
          }}>
            {factor.explanation}
          </p>
          
          {factor.items && factor.items.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {factor.items.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                  style={{
                    fontSize: '12px',
                    color: '#3B82F6',
                    cursor: 'pointer',
                  }}
                >
                  → {item.name}
                </div>
              ))}
              {factor.items.length > 3 && (
                <span style={{ fontSize: '11px', color: REGULATOR_COLORS.textMuted }}>
                  +{factor.items.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// LoadSuggestionBanner — Optional suggestions
// ============================================================================

interface LoadSuggestionBannerProps {
  suggestion: LoadSuggestion;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export const LoadSuggestionBanner: React.FC<LoadSuggestionBannerProps> = ({
  suggestion,
  onAccept,
  onDismiss,
}) => {
  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <span style={{ fontSize: '16px' }}>💭</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '13px',
          color: REGULATOR_COLORS.text,
          margin: 0,
        }}>
          {suggestion.text}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {suggestion.action && (
          <button
            onClick={onAccept}
            style={{
              ...styles.button,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
            }}
          >
            {suggestion.type === 'pause' ? 'Pause' :
             suggestion.type === 'snapshot' ? 'Take Snapshot' :
             suggestion.type === 'reduce_scope' ? 'Reduce' : 'Continue'}
          </button>
        )}
        <button
          onClick={onDismiss}
          style={{
            ...styles.button,
            backgroundColor: 'transparent',
            color: REGULATOR_COLORS.textMuted,
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CognitiveLoadRegulator — Main component
// ============================================================================

interface CognitiveLoadRegulatorProps {
  userId: string;
  initiallyVisible?: boolean;
  position?: IndicatorPosition;
}

export const CognitiveLoadRegulator: React.FC<CognitiveLoadRegulatorProps> = ({
  userId,
  initiallyVisible = true,
  position = 'bottom-right',
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock load state - would come from hook
  const loadState: CognitiveLoadState = {
    id: 'load_001',
    timestamp: new Date().toISOString(),
    dimensions: {
      density: 45,
      fragmentation: 30,
      ambiguity: 25,
      volatility: 20,
      responsibility_weight: 35,
    },
    state: 'focused',
    trend: 'stable',
    factors: [
      {
        type: 'active_threads',
        label: 'Active Threads',
        value: 4,
        baseline: 3,
        contribution: 0.25,
        explanation: 'You have 4 active knowledge threads, slightly above typical.',
        items: [
          { id: 'thread_1', name: 'XR Collaboration Research', type: 'thread' },
          { id: 'thread_2', name: 'CHE·NU Development', type: 'thread' },
        ],
      },
      {
        type: 'unresolved_decisions',
        label: 'Unresolved Decisions',
        value: 2,
        baseline: 1,
        contribution: 0.30,
        explanation: 'Two decisions are awaiting your input.',
        items: [
          { id: 'dec_1', name: 'Platform selection', type: 'decision' },
        ],
      },
      {
        type: 'pending_approvals',
        label: 'Pending Approvals',
        value: 1,
        baseline: 0,
        contribution: 0.15,
        explanation: 'One agent action awaiting your approval.',
      },
      {
        type: 'context_switches',
        label: 'Context Switches',
        value: 3,
        baseline: 5,
        contribution: 0.10,
        explanation: 'You have switched contexts 3 times this session (below average).',
      },
    ],
    session_id: 'session_001',
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          ...styles.button,
          backgroundColor: 'rgba(20, 20, 30, 0.8)',
          color: REGULATOR_COLORS.textMuted,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        Show Load Indicator
      </button>
    );
  }

  return (
    <>
      <LoadIndicator
        loadState={loadState}
        position={position}
        onExpand={() => setIsExpanded(true)}
        onHide={() => setIsVisible(false)}
      />
      
      {isExpanded && (
        <LoadBreakdown
          loadState={loadState}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

// ============================================================================
// AdaptationNotice — Shows when system adapts
// ============================================================================

interface AdaptationNoticeProps {
  adaptation: SystemAdaptation;
  onDismiss?: () => void;
}

export const AdaptationNotice: React.FC<AdaptationNoticeProps> = ({
  adaptation,
  onDismiss,
}) => {
  if (!adaptation.active) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      backgroundColor: 'rgba(30, 30, 40, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13px',
      color: REGULATOR_COLORS.textMuted,
      zIndex: 99,
    }}>
      <span>🌙</span>
      <span>{adaptation.description}</span>
      <span style={{ color: '#10B981', fontSize: '11px' }}>
        (all features still available)
      </span>
      <button
        onClick={onDismiss}
        style={{
          ...styles.button,
          padding: '4px 8px',
          fontSize: '11px',
          backgroundColor: 'transparent',
          color: REGULATOR_COLORS.textMuted,
        }}
      >
        ×
      </button>
    </div>
  );
};

// ============================================================================
// LoadOverview — Full-page reflection view
// ============================================================================

interface LoadOverviewProps {
  userId: string;
  onClose?: () => void;
}

export const LoadOverview: React.FC<LoadOverviewProps> = ({
  userId,
  onClose,
}) => {
  // Would use hooks for data
  
  return (
    <div style={{
      ...styles.container,
      padding: '24px',
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: REGULATOR_COLORS.text,
          margin: 0,
        }}>
          Cognitive Load Overview
        </h1>
        <button
          onClick={onClose}
          style={{
            ...styles.button,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: REGULATOR_COLORS.text,
          }}
        >
          Close
        </button>
      </div>

      <p style={{
        color: REGULATOR_COLORS.textMuted,
        fontSize: '15px',
        marginBottom: '32px',
        maxWidth: '600px',
      }}>
        This overview shows the current complexity of your active work.
        It is not a productivity score — it's a visibility tool.
        You decide what, if anything, to do with this information.
      </p>

      {/* Current state card */}
      <div style={{
        ...styles.card,
        marginBottom: '24px',
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: REGULATOR_COLORS.text,
          margin: '0 0 16px 0',
        }}>
          Current State
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
        }}>
          {Object.entries(LOAD_STATE_META).map(([state, meta]) => (
            <div
              key={state}
              style={{
                padding: '16px',
                backgroundColor: state === 'focused' ? `${meta.color}20` : 'rgba(30, 30, 40, 0.5)',
                borderRadius: '8px',
                textAlign: 'center',
                border: state === 'focused' ? `1px solid ${meta.color}40` : '1px solid transparent',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{meta.icon}</div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: state === 'focused' ? 600 : 400,
                color: state === 'focused' ? meta.color : REGULATOR_COLORS.textMuted,
              }}>
                {meta.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{
        padding: '16px',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#10B981',
          margin: '0 0 8px 0',
        }}>
          🔒 Privacy Guarantee
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          color: REGULATOR_COLORS.textMuted,
          fontSize: '13px',
          lineHeight: 1.6,
        }}>
          <li>Load states are ephemeral — not stored long-term</li>
          <li>No profiling or pattern tracking</li>
          <li>No biometric or emotional data used</li>
          <li>You can hide or disable this feature permanently</li>
          <li>No one else can see your load state</li>
        </ul>
      </div>
    </div>
  );
};
