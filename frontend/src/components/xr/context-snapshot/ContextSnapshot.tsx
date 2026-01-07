/**
 * CHE·NU™ V51 Meta-Layer
 * Context Snapshot V1.0 — Main Component
 * 
 * PURPOSE:
 * Captures the "where you were" moment for genuine return.
 * Enables resumption without loss of mental context.
 * 
 * CORE PRINCIPLE:
 * Snapshots are CAPTURES, not records.
 * The system preserves state, never surveils.
 * 
 * COMPONENTS:
 * - SnapshotList: List view with filtering
 * - SnapshotCard: Summary card
 * - SnapshotView: Detailed view
 * - SnapshotCapture: Capture flow
 * - SnapshotRestore: Restore flow
 * - QuickCapturePanel: Minimal capture UI
 * - ContextSnapshot: Main orchestrating component
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import React, { useState, useCallback, useMemo } from 'react';
import type {
  ContextSnapshot as ContextSnapshotType,
  SnapshotTrigger,
  SnapshotState,
  CapturedThread,
  CapturedAgent,
  ContextNotes,
  SnapshotFilters,
  ContextSnapshotUIState,
  CaptureFlowState,
  RestoreFlowState,
  CaptureConfig,
  RestoreOptions,
  RetentionSettings,
  QuickCapture
} from './context-snapshot.types';
import {
  SNAPSHOT_TRIGGER_LABELS,
  DEFAULT_CAPTURE_CONFIG,
  DEFAULT_RESTORE_OPTIONS,
  SNAPSHOT_DESIGN_TOKENS
} from './context-snapshot.types';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Trigger badge — Shows what initiated the snapshot
 */
interface TriggerBadgeProps {
  trigger: SnapshotTrigger;
}

const TriggerBadge: React.FC<TriggerBadgeProps> = ({ trigger }) => {
  const { colors } = SNAPSHOT_DESIGN_TOKENS;
  const triggerColor = colors.trigger[trigger];
  
  const icons: Record<SnapshotTrigger, string> = {
    manual: '📌',
    scheduled: '⏰',
    suggested: '💡',
    sphere_switch: '🔄',
    session_end: '🌙',
    before_break: '☕',
    high_volatility: '🌊'
  };
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '12px',
        backgroundColor: `${triggerColor}20`,
        color: triggerColor,
        fontSize: '12px',
        fontWeight: 500
      }}
    >
      <span>{icons[trigger]}</span>
      {SNAPSHOT_TRIGGER_LABELS[trigger]}
    </span>
  );
};

/**
 * State indicator — Shows snapshot lifecycle state
 */
interface StateIndicatorProps {
  state: SnapshotState;
}

const StateIndicator: React.FC<StateIndicatorProps> = ({ state }) => {
  const { colors } = SNAPSHOT_DESIGN_TOKENS;
  const stateColor = colors.state[state];
  
  const labels: Record<SnapshotState, string> = {
    active: 'Active',
    archived: 'Archived',
    restored: 'Restored',
    expired: 'Expired'
  };
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: stateColor,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: stateColor
        }}
      />
      {labels[state]}
    </span>
  );
};

/**
 * Time ago — Friendly time display
 */
const TimeAgo: React.FC<{ date: string }> = ({ date }) => {
  const getTimeAgo = (dateStr: string): string => {
    const now = new Date();
    const then = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return then.toLocaleDateString();
  };
  
  return (
    <span style={{ 
      fontSize: '12px', 
      color: SNAPSHOT_DESIGN_TOKENS.colors.text.muted 
    }}>
      {getTimeAgo(date)}
    </span>
  );
};

// ============================================================================
// SNAPSHOT CARD
// ============================================================================

/**
 * SnapshotCard — Summary card for a single snapshot
 */
interface SnapshotCardProps {
  snapshot: ContextSnapshotType;
  onSelect: (id: string) => void;
  onQuickRestore: (id: string) => void;
  selected?: boolean;
}

const SnapshotCard: React.FC<SnapshotCardProps> = ({
  snapshot,
  onSelect,
  onQuickRestore,
  selected = false
}) => {
  const { colors, effects, spacing } = SNAPSHOT_DESIGN_TOKENS;
  
  const displayTitle = snapshot.title || 
    snapshot.notes.current_focus || 
    `${snapshot.sphere} snapshot`;
  
  const threadCount = snapshot.threads.length;
  const agentCount = snapshot.agents.length;
  const hasNotes = !!(
    snapshot.notes.current_focus ||
    snapshot.notes.next_intention ||
    snapshot.notes.important_context
  );
  
  return (
    <div
      onClick={() => onSelect(snapshot.id)}
      style={{
        padding: spacing.md,
        backgroundColor: selected ? `${colors.primary}10` : colors.surface,
        borderRadius: effects.borderRadius,
        border: `1px solid ${selected ? colors.primary : colors.border}`,
        cursor: 'pointer',
        transition: effects.transition,
        boxShadow: effects.cardShadow
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm
      }}>
        <div>
          <h4 style={{ 
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: '4px'
          }}>
            {displayTitle}
          </h4>
          <TimeAgo date={snapshot.captured_at} />
        </div>
        <StateIndicator state={snapshot.state} />
      </div>
      
      {/* Trigger */}
      <div style={{ marginBottom: spacing.sm }}>
        <TriggerBadge trigger={snapshot.trigger} />
      </div>
      
      {/* Context preview */}
      {snapshot.notes.current_focus && (
        <p style={{ 
          margin: `0 0 ${spacing.sm}`,
          fontSize: '13px',
          color: colors.text.secondary,
          fontStyle: 'italic',
          lineHeight: 1.4
        }}>
          "{snapshot.notes.current_focus}"
        </p>
      )}
      
      {/* Metadata */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: spacing.md,
        paddingTop: spacing.sm,
        borderTop: `1px solid ${colors.border}`
      }}>
        <span style={{ 
          fontSize: '12px', 
          color: colors.text.muted,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>📂</span> {snapshot.sphere}
        </span>
        
        {threadCount > 0 && (
          <span style={{ 
            fontSize: '12px', 
            color: colors.text.muted 
          }}>
            {threadCount} thread{threadCount !== 1 ? 's' : ''}
          </span>
        )}
        
        {agentCount > 0 && (
          <span style={{ 
            fontSize: '12px', 
            color: colors.text.muted 
          }}>
            {agentCount} agent{agentCount !== 1 ? 's' : ''}
          </span>
        )}
        
        {hasNotes && (
          <span style={{ 
            fontSize: '12px', 
            color: colors.text.muted 
          }}>
            📝 Notes
          </span>
        )}
        
        {/* Quick restore button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickRestore(snapshot.id);
          }}
          style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.primary}`,
            borderRadius: '4px',
            color: colors.primary,
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: effects.transition
          }}
        >
          Restore
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SNAPSHOT LIST
// ============================================================================

/**
 * SnapshotList — List view with filtering
 */
interface SnapshotListProps {
  snapshots: ContextSnapshotType[];
  selectedId?: string;
  filters: SnapshotFilters;
  onSelect: (id: string) => void;
  onQuickRestore: (id: string) => void;
  onFiltersChange: (filters: SnapshotFilters) => void;
  onCapture: () => void;
}

const SnapshotList: React.FC<SnapshotListProps> = ({
  snapshots,
  selectedId,
  filters,
  onSelect,
  onQuickRestore,
  onFiltersChange,
  onCapture
}) => {
  const { colors, spacing, effects } = SNAPSHOT_DESIGN_TOKENS;
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  // Filter snapshots
  const filteredSnapshots = useMemo(() => {
    return snapshots.filter(s => {
      if (filters.triggers?.length && !filters.triggers.includes(s.trigger)) {
        return false;
      }
      if (filters.states?.length && !filters.states.includes(s.state)) {
        return false;
      }
      if (filters.spheres?.length && !filters.spheres.includes(s.sphere)) {
        return false;
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const searchable = [
          s.title,
          s.notes.current_focus,
          s.notes.next_intention,
          s.notes.important_context,
          s.sphere
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(search)) return false;
      }
      return true;
    });
  }, [snapshots, filters]);
  
  // Group by date
  const groupedSnapshots = useMemo(() => {
    const groups: Record<string, ContextSnapshotType[]> = {};
    
    filteredSnapshots.forEach(s => {
      const date = new Date(s.captured_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString(undefined, { 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    
    return groups;
  }, [filteredSnapshots]);
  
  const handleSearchSubmit = () => {
    onFiltersChange({ ...filters, search: searchInput });
  };
  
  const activeCount = snapshots.filter(s => s.state === 'active').length;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px',
              color: colors.text.primary
            }}>
              Context Snapshots
            </h3>
            <p style={{ 
              margin: '4px 0 0', 
              fontSize: '13px',
              color: colors.text.muted
            }}>
              {activeCount} active · {snapshots.length} total
            </p>
          </div>
          
          <button
            onClick={onCapture}
            style={{
              padding: '10px 20px',
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: effects.borderRadius,
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: effects.transition
            }}
          >
            📸 Capture Now
          </button>
        </div>
        
        {/* Search */}
        <div style={{ 
          display: 'flex', 
          gap: spacing.sm 
        }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search snapshots..."
            style={{
              flex: 1,
              padding: '10px 14px',
              border: `1px solid ${colors.border}`,
              borderRadius: effects.borderRadius,
              fontSize: '14px',
              backgroundColor: colors.surface,
              outline: 'none'
            }}
          />
        </div>
        
        {/* Filter chips */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginTop: spacing.sm
        }}>
          {(['active', 'archived', 'restored'] as SnapshotState[]).map(state => (
            <button
              key={state}
              onClick={() => {
                const current = filters.states || [];
                const newStates = current.includes(state)
                  ? current.filter(s => s !== state)
                  : [...current, state];
                onFiltersChange({ ...filters, states: newStates.length ? newStates : undefined });
              }}
              style={{
                padding: '4px 10px',
                backgroundColor: filters.states?.includes(state)
                  ? `${colors.state[state]}20`
                  : 'transparent',
                border: `1px solid ${
                  filters.states?.includes(state) 
                    ? colors.state[state] 
                    : colors.border
                }`,
                borderRadius: '12px',
                color: filters.states?.includes(state) 
                  ? colors.state[state] 
                  : colors.text.muted,
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
      
      {/* List */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: spacing.lg
      }}>
        {Object.keys(groupedSnapshots).length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: spacing.xxl,
            color: colors.text.muted
          }}>
            <p style={{ fontSize: '16px', marginBottom: spacing.sm }}>
              📸 No snapshots yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Capture your current context to return later
            </p>
          </div>
        ) : (
          Object.entries(groupedSnapshots).map(([date, items]) => (
            <div key={date} style={{ marginBottom: spacing.lg }}>
              <h4 style={{ 
                fontSize: '12px',
                fontWeight: 600,
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: spacing.sm
              }}>
                {date}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {items.map(snapshot => (
                  <SnapshotCard
                    key={snapshot.id}
                    snapshot={snapshot}
                    selected={snapshot.id === selectedId}
                    onSelect={onSelect}
                    onQuickRestore={onQuickRestore}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SNAPSHOT VIEW
// ============================================================================

/**
 * SnapshotView — Detailed view of a single snapshot
 */
interface SnapshotViewProps {
  snapshot: ContextSnapshotType;
  onBack: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

const SnapshotView: React.FC<SnapshotViewProps> = ({
  snapshot,
  onBack,
  onRestore,
  onDelete,
  onArchive
}) => {
  const { colors, spacing, effects } = SNAPSHOT_DESIGN_TOKENS;
  
  const displayTitle = snapshot.title || 
    snapshot.notes.current_focus || 
    `${snapshot.sphere} snapshot`;
  
  return (
    <div style={{ 
      height: '100%', 
      overflow: 'auto',
      backgroundColor: colors.background
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.primary,
            fontSize: '14px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Back to list
        </button>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ 
              margin: '0 0 8px',
              fontSize: '22px',
              color: colors.text.primary
            }}>
              {displayTitle}
            </h2>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: spacing.md
            }}>
              <TriggerBadge trigger={snapshot.trigger} />
              <StateIndicator state={snapshot.state} />
              <TimeAgo date={snapshot.captured_at} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <button
              onClick={onRestore}
              style={{
                padding: '10px 20px',
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: effects.borderRadius,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔄 Restore Context
            </button>
            <button
              onClick={onArchive}
              style={{
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: effects.borderRadius,
                color: colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📦 Archive
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ padding: spacing.lg }}>
        {/* Notes Section */}
        {(snapshot.notes.current_focus || 
          snapshot.notes.next_intention || 
          snapshot.notes.important_context) && (
          <section style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              📝 Context Notes
            </h3>
            
            <div style={{ 
              backgroundColor: colors.surface,
              borderRadius: effects.borderRadius,
              padding: spacing.lg,
              border: `1px solid ${colors.border}`
            }}>
              {snapshot.notes.current_focus && (
                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ 
                    fontSize: '11px',
                    fontWeight: 500,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    What I was doing
                  </label>
                  <p style={{ 
                    margin: '6px 0 0',
                    fontSize: '15px',
                    color: colors.text.primary,
                    fontStyle: 'italic'
                  }}>
                    "{snapshot.notes.current_focus}"
                  </p>
                </div>
              )}
              
              {snapshot.notes.next_intention && (
                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ 
                    fontSize: '11px',
                    fontWeight: 500,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    What I was about to do
                  </label>
                  <p style={{ 
                    margin: '6px 0 0',
                    fontSize: '15px',
                    color: colors.text.primary,
                    fontStyle: 'italic'
                  }}>
                    "{snapshot.notes.next_intention}"
                  </p>
                </div>
              )}
              
              {snapshot.notes.important_context && (
                <div>
                  <label style={{ 
                    fontSize: '11px',
                    fontWeight: 500,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Important to remember
                  </label>
                  <p style={{ 
                    margin: '6px 0 0',
                    fontSize: '15px',
                    color: colors.text.primary,
                    fontStyle: 'italic'
                  }}>
                    "{snapshot.notes.important_context}"
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Captured Threads */}
        {snapshot.threads.length > 0 && (
          <section style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              🧵 Active Threads ({snapshot.threads.length})
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: spacing.sm
            }}>
              {snapshot.threads.map(thread => (
                <div
                  key={thread.thread_id}
                  style={{
                    padding: spacing.md,
                    backgroundColor: colors.surface,
                    borderRadius: effects.borderRadius,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontWeight: 500,
                      color: colors.text.primary
                    }}>
                      {thread.title}
                    </span>
                    <span style={{ 
                      fontSize: '12px',
                      color: colors.text.muted,
                      backgroundColor: `${colors.primary}15`,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {thread.phase}
                    </span>
                  </div>
                  {thread.notes && (
                    <p style={{ 
                      margin: '8px 0 0',
                      fontSize: '13px',
                      color: colors.text.secondary,
                      fontStyle: 'italic'
                    }}>
                      {thread.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Captured Agents */}
        {snapshot.agents.length > 0 && (
          <section style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              🤖 Active Agents ({snapshot.agents.length})
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: spacing.sm
            }}>
              {snapshot.agents.map(agent => (
                <div
                  key={agent.agent_id}
                  style={{
                    padding: spacing.sm + ' ' + spacing.md,
                    backgroundColor: colors.surface,
                    borderRadius: effects.borderRadius,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm
                  }}
                >
                  <span style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: agent.status === 'active' 
                      ? '#68D391' 
                      : agent.status === 'waiting'
                        ? '#F6E05E'
                        : '#A0AEC0'
                  }} />
                  <span style={{ 
                    fontWeight: 500,
                    color: colors.text.primary
                  }}>
                    {agent.agent_name}
                  </span>
                  {agent.current_task && (
                    <span style={{ 
                      fontSize: '12px',
                      color: colors.text.muted
                    }}>
                      — {agent.current_task}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Navigation State */}
        <section style={{ marginBottom: spacing.xl }}>
          <h3 style={{ 
            fontSize: '14px',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: spacing.md
          }}>
            📍 Navigation State
          </h3>
          
          <div style={{ 
            padding: spacing.md,
            backgroundColor: colors.surface,
            borderRadius: effects.borderRadius,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              flexWrap: 'wrap'
            }}>
              <div>
                <label style={{ 
                  fontSize: '11px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Sphere
                </label>
                <span style={{ 
                  fontWeight: 500,
                  color: colors.text.primary
                }}>
                  📂 {snapshot.navigation.current_sphere}
                </span>
              </div>
              <div style={{ 
                width: '1px',
                height: '24px',
                backgroundColor: colors.border
              }} />
              <div>
                <label style={{ 
                  fontSize: '11px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  View
                </label>
                <span style={{ color: colors.text.primary }}>
                  {snapshot.navigation.current_view}
                </span>
              </div>
              <div style={{ 
                width: '1px',
                height: '24px',
                backgroundColor: colors.border
              }} />
              <div>
                <label style={{ 
                  fontSize: '11px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Path
                </label>
                <span style={{ 
                  color: colors.text.secondary,
                  fontSize: '13px'
                }}>
                  {snapshot.navigation.current_path.join(' / ')}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Restoration History */}
        {snapshot.restorations.length > 0 && (
          <section style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              🔄 Restoration History ({snapshot.restorations.length})
            </h3>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm
            }}>
              {snapshot.restorations.map((restoration, index) => (
                <div
                  key={index}
                  style={{
                    padding: spacing.sm + ' ' + spacing.md,
                    backgroundColor: colors.surface,
                    borderRadius: effects.borderRadius,
                    border: `1px solid ${colors.border}`,
                    fontSize: '13px',
                    color: colors.text.secondary
                  }}
                >
                  Restored {new Date(restoration.restored_at).toLocaleString()}
                  {restoration.partial && ' (partial)'}
                  {restoration.notes && ` — ${restoration.notes}`}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Tags */}
        {snapshot.tags.length > 0 && (
          <section style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              🏷️ Tags
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
              {snapshot.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: `${colors.primary}15`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: colors.primary
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Delete option */}
        <div style={{ 
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          marginTop: spacing.xl
        }}>
          <button
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#E53E3E',
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            🗑️ Delete this snapshot
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SNAPSHOT CAPTURE
// ============================================================================

/**
 * SnapshotCapture — Multi-step capture flow
 */
interface SnapshotCaptureProps {
  captureState: CaptureFlowState;
  onConfigChange: (config: Partial<CaptureConfig>) => void;
  onNotesChange: (notes: Partial<ContextNotes>) => void;
  onTitleChange: (title: string) => void;
  onTagsChange: (tags: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onCapture: () => void;
  onCancel: () => void;
}

const SnapshotCapture: React.FC<SnapshotCaptureProps> = ({
  captureState,
  onConfigChange,
  onNotesChange,
  onTitleChange,
  onTagsChange,
  onNext,
  onBack,
  onCapture,
  onCancel
}) => {
  const { colors, spacing, effects } = SNAPSHOT_DESIGN_TOKENS;
  const { step, config, notes, title, tags, progress, error } = captureState;
  
  const steps = ['config', 'notes', 'review', 'capturing', 'complete'];
  const currentStepIndex = steps.indexOf(step);
  
  return (
    <div style={{ 
      height: '100%',
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ 
            margin: 0,
            fontSize: '20px',
            color: colors.text.primary
          }}>
            📸 Capture Context
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: colors.text.muted,
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Progress */}
        {step !== 'capturing' && step !== 'complete' && (
          <div style={{ 
            display: 'flex',
            gap: spacing.xs,
            marginTop: spacing.md
          }}>
            {['config', 'notes', 'review'].map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: i <= currentStepIndex 
                    ? colors.primary 
                    : colors.border
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: spacing.lg }}>
        {/* Step: Config */}
        {step === 'config' && (
          <div>
            <h3 style={{ 
              fontSize: '16px',
              color: colors.text.primary,
              marginBottom: spacing.lg
            }}>
              What would you like to capture?
            </h3>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md
            }}>
              {[
                { key: 'capture_threads', label: 'Active Threads', icon: '🧵' },
                { key: 'capture_agents', label: 'Active Agents', icon: '🤖' },
                { key: 'capture_navigation', label: 'Navigation State', icon: '📍' },
                { key: 'capture_open_items', label: 'Open Items', icon: '📂' },
                { key: 'capture_decisions', label: 'Active Decisions', icon: '💎' },
                { key: 'capture_meanings', label: 'Active Meanings', icon: '🌿' },
              ].map(({ key, label, icon }) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.md,
                    backgroundColor: colors.surface,
                    borderRadius: effects.borderRadius,
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={config[key as keyof CaptureConfig] as boolean}
                    onChange={(e) => onConfigChange({ [key]: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '16px' }}>{icon}</span>
                  <span style={{ color: colors.text.primary }}>{label}</span>
                </label>
              ))}
              
              {/* Optional title */}
              <div style={{ marginTop: spacing.md }}>
                <label style={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Snapshot Title (optional)
                </label>
                <input
                  type="text"
                  value={title || ''}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="e.g., 'Before lunch break', 'End of sprint'"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: effects.borderRadius,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step: Notes */}
        {step === 'notes' && (
          <div>
            <h3 style={{ 
              fontSize: '16px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              Add context notes
            </h3>
            <p style={{ 
              fontSize: '14px',
              color: colors.text.muted,
              marginBottom: spacing.lg
            }}>
              Help your future self remember where you were
            </p>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg
            }}>
              <div>
                <label style={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colors.text.secondary,
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  What was I doing?
                </label>
                <textarea
                  value={notes.current_focus || ''}
                  onChange={(e) => onNotesChange({ current_focus: e.target.value })}
                  placeholder="Describe your current focus..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: effects.borderRadius,
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colors.text.secondary,
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  What was I about to do?
                </label>
                <textarea
                  value={notes.next_intention || ''}
                  onChange={(e) => onNotesChange({ next_intention: e.target.value })}
                  placeholder="What were you planning to do next?"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: effects.borderRadius,
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colors.text.secondary,
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  What should I remember?
                </label>
                <textarea
                  value={notes.important_context || ''}
                  onChange={(e) => onNotesChange({ important_context: e.target.value })}
                  placeholder="Any important context for later..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: effects.borderRadius,
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step: Review */}
        {step === 'review' && (
          <div>
            <h3 style={{ 
              fontSize: '16px',
              color: colors.text.primary,
              marginBottom: spacing.lg
            }}>
              Review your capture
            </h3>
            
            <div style={{ 
              backgroundColor: colors.surface,
              borderRadius: effects.borderRadiusLg,
              border: `1px solid ${colors.border}`,
              overflow: 'hidden'
            }}>
              {/* Title */}
              {title && (
                <div style={{ 
                  padding: spacing.md,
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <label style={{ 
                    fontSize: '11px',
                    fontWeight: 500,
                    color: colors.text.muted,
                    textTransform: 'uppercase'
                  }}>
                    Title
                  </label>
                  <p style={{ 
                    margin: '4px 0 0',
                    fontWeight: 500,
                    color: colors.text.primary
                  }}>
                    {title}
                  </p>
                </div>
              )}
              
              {/* What's being captured */}
              <div style={{ 
                padding: spacing.md,
                borderBottom: `1px solid ${colors.border}`
              }}>
                <label style={{ 
                  fontSize: '11px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: spacing.sm
                }}>
                  Capturing
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                  {config.capture_threads && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      🧵 Threads
                    </span>
                  )}
                  {config.capture_agents && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      🤖 Agents
                    </span>
                  )}
                  {config.capture_navigation && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      📍 Navigation
                    </span>
                  )}
                  {config.capture_open_items && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      📂 Open Items
                    </span>
                  )}
                  {config.capture_decisions && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      💎 Decisions
                    </span>
                  )}
                  {config.capture_meanings && (
                    <span style={{ 
                      padding: '4px 8px',
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.primary
                    }}>
                      🌿 Meanings
                    </span>
                  )}
                </div>
              </div>
              
              {/* Notes preview */}
              {(notes.current_focus || notes.next_intention || notes.important_context) && (
                <div style={{ padding: spacing.md }}>
                  <label style={{ 
                    fontSize: '11px',
                    fontWeight: 500,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: spacing.sm
                  }}>
                    Notes
                  </label>
                  {notes.current_focus && (
                    <p style={{ 
                      margin: '0 0 8px',
                      fontSize: '14px',
                      color: colors.text.secondary,
                      fontStyle: 'italic'
                    }}>
                      <strong>Focus:</strong> {notes.current_focus}
                    </p>
                  )}
                  {notes.next_intention && (
                    <p style={{ 
                      margin: '0 0 8px',
                      fontSize: '14px',
                      color: colors.text.secondary,
                      fontStyle: 'italic'
                    }}>
                      <strong>Next:</strong> {notes.next_intention}
                    </p>
                  )}
                  {notes.important_context && (
                    <p style={{ 
                      margin: 0,
                      fontSize: '14px',
                      color: colors.text.secondary,
                      fontStyle: 'italic'
                    }}>
                      <strong>Remember:</strong> {notes.important_context}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step: Capturing */}
        {step === 'capturing' && (
          <div style={{ 
            textAlign: 'center',
            padding: spacing.xxl
          }}>
            <div style={{ 
              fontSize: '48px',
              marginBottom: spacing.lg,
              animation: 'pulse 1s ease-in-out infinite'
            }}>
              📸
            </div>
            <h3 style={{ 
              fontSize: '18px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              Capturing context...
            </h3>
            <div style={{ 
              width: '200px',
              height: '4px',
              backgroundColor: colors.border,
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progress}%`,
                height: '100%',
                backgroundColor: colors.primary,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
        
        {/* Step: Complete */}
        {step === 'complete' && (
          <div style={{ 
            textAlign: 'center',
            padding: spacing.xxl
          }}>
            <div style={{ 
              fontSize: '48px',
              marginBottom: spacing.lg
            }}>
              ✅
            </div>
            <h3 style={{ 
              fontSize: '18px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              Context captured!
            </h3>
            <p style={{ 
              fontSize: '14px',
              color: colors.text.muted
            }}>
              You can return to this moment anytime
            </p>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div style={{ 
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: '#FED7D7',
            borderRadius: effects.borderRadius,
            color: '#C53030',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {step !== 'capturing' && step !== 'complete' && (
        <div style={{ 
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={step === 'config' ? onCancel : onBack}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: effects.borderRadius,
              color: colors.text.secondary,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {step === 'config' ? 'Cancel' : '← Back'}
          </button>
          
          {step === 'review' ? (
            <button
              onClick={onCapture}
              style={{
                padding: '10px 24px',
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: effects.borderRadius,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📸 Capture Now
            </button>
          ) : (
            <button
              onClick={onNext}
              style={{
                padding: '10px 24px',
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: effects.borderRadius,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Continue →
            </button>
          )}
        </div>
      )}
      
      {step === 'complete' && (
        <div style={{ 
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          textAlign: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: effects.borderRadius,
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SNAPSHOT RESTORE
// ============================================================================

/**
 * SnapshotRestore — Restore flow
 */
interface SnapshotRestoreProps {
  snapshot: ContextSnapshotType;
  restoreState: RestoreFlowState;
  onOptionsChange: (options: Partial<RestoreOptions>) => void;
  onRestore: () => void;
  onCancel: () => void;
}

const SnapshotRestore: React.FC<SnapshotRestoreProps> = ({
  snapshot,
  restoreState,
  onOptionsChange,
  onRestore,
  onCancel
}) => {
  const { colors, spacing, effects } = SNAPSHOT_DESIGN_TOKENS;
  const { step, options, progress, restored_elements, error } = restoreState;
  
  return (
    <div style={{ 
      height: '100%',
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: '20px',
          color: colors.text.primary
        }}>
          🔄 Restore Context
        </h2>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: spacing.lg }}>
        {/* Step: Options */}
        {step === 'options' && (
          <div>
            <h3 style={{ 
              fontSize: '16px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              What would you like to restore?
            </h3>
            
            {/* Snapshot preview */}
            <div style={{ 
              padding: spacing.md,
              backgroundColor: colors.surface,
              borderRadius: effects.borderRadius,
              border: `1px solid ${colors.border}`,
              marginBottom: spacing.lg
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontWeight: 500,
                  color: colors.text.primary
                }}>
                  {snapshot.title || snapshot.notes.current_focus || 'Snapshot'}
                </span>
                <TimeAgo date={snapshot.captured_at} />
              </div>
              {snapshot.notes.current_focus && (
                <p style={{ 
                  margin: '8px 0 0',
                  fontSize: '13px',
                  color: colors.text.secondary,
                  fontStyle: 'italic'
                }}>
                  "{snapshot.notes.current_focus}"
                </p>
              )}
            </div>
            
            {/* Options */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md
            }}>
              {[
                { key: 'restore_navigation', label: 'Navigation state', desc: 'Return to the same sphere and view' },
                { key: 'restore_threads', label: 'Active threads', desc: `Reopen ${snapshot.threads.length} thread${snapshot.threads.length !== 1 ? 's' : ''}` },
                { key: 'restore_agents', label: 'Active agents', desc: `Reactivate ${snapshot.agents.length} agent${snapshot.agents.length !== 1 ? 's' : ''}` },
                { key: 'restore_open_items', label: 'Open items', desc: 'Restore open documents and items' },
                { key: 'show_notes', label: 'Show notes', desc: 'Display context notes reminder' },
              ].map(({ key, label, desc }) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing.md,
                    padding: spacing.md,
                    backgroundColor: colors.surface,
                    borderRadius: effects.borderRadius,
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options[key as keyof RestoreOptions] as boolean}
                    onChange={(e) => onOptionsChange({ [key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', marginTop: '2px' }}
                  />
                  <div>
                    <span style={{ 
                      display: 'block',
                      fontWeight: 500,
                      color: colors.text.primary
                    }}>
                      {label}
                    </span>
                    <span style={{ 
                      fontSize: '13px',
                      color: colors.text.muted
                    }}>
                      {desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Step: Restoring */}
        {step === 'restoring' && (
          <div style={{ 
            textAlign: 'center',
            padding: spacing.xxl
          }}>
            <div style={{ 
              fontSize: '48px',
              marginBottom: spacing.lg,
              animation: 'pulse 1s ease-in-out infinite'
            }}>
              🔄
            </div>
            <h3 style={{ 
              fontSize: '18px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              Restoring context...
            </h3>
            <div style={{ 
              width: '200px',
              height: '4px',
              backgroundColor: colors.border,
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progress}%`,
                height: '100%',
                backgroundColor: colors.primary,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
        
        {/* Step: Complete */}
        {step === 'complete' && (
          <div style={{ 
            textAlign: 'center',
            padding: spacing.xxl
          }}>
            <div style={{ 
              fontSize: '48px',
              marginBottom: spacing.lg
            }}>
              ✅
            </div>
            <h3 style={{ 
              fontSize: '18px',
              color: colors.text.primary,
              marginBottom: spacing.sm
            }}>
              Context restored!
            </h3>
            
            {restored_elements.length > 0 && (
              <div style={{ 
                marginTop: spacing.lg,
                padding: spacing.md,
                backgroundColor: colors.surface,
                borderRadius: effects.borderRadius,
                border: `1px solid ${colors.border}`,
                textAlign: 'left',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: colors.text.muted,
                  margin: '0 0 8px',
                  textTransform: 'uppercase'
                }}>
                  Restored:
                </p>
                <ul style={{ 
                  margin: 0,
                  paddingLeft: '20px',
                  color: colors.text.secondary,
                  fontSize: '14px'
                }}>
                  {restored_elements.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Show notes reminder */}
            {options.show_notes && snapshot.notes.current_focus && (
              <div style={{ 
                marginTop: spacing.lg,
                padding: spacing.md,
                backgroundColor: `${colors.primary}10`,
                borderRadius: effects.borderRadius,
                border: `1px solid ${colors.primary}30`,
                maxWidth: '400px',
                margin: `${spacing.lg} auto 0`
              }}>
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: colors.primary,
                  margin: '0 0 8px'
                }}>
                  📝 Your notes from then:
                </p>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: colors.text.primary,
                  fontStyle: 'italic'
                }}>
                  "{snapshot.notes.current_focus}"
                </p>
                {snapshot.notes.next_intention && (
                  <p style={{ 
                    margin: '8px 0 0',
                    fontSize: '13px',
                    color: colors.text.secondary
                  }}>
                    <strong>You were about to:</strong> {snapshot.notes.next_intention}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div style={{ 
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: '#FED7D7',
            borderRadius: effects.borderRadius,
            color: '#C53030',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {step === 'options' && (
        <div style={{ 
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: effects.borderRadius,
              color: colors.text.secondary,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={onRestore}
            style={{
              padding: '10px 24px',
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: effects.borderRadius,
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Restore Now
          </button>
        </div>
      )}
      
      {step === 'complete' && (
        <div style={{ 
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          textAlign: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: effects.borderRadius,
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QUICK CAPTURE PANEL
// ============================================================================

/**
 * QuickCapturePanel — Minimal capture UI for fast saves
 */
interface QuickCapturePanelProps {
  onCapture: (focus?: string, intention?: string) => void;
  onClose: () => void;
  currentSphere: string;
}

const QuickCapturePanel: React.FC<QuickCapturePanelProps> = ({
  onCapture,
  onClose,
  currentSphere
}) => {
  const { colors, spacing, effects } = SNAPSHOT_DESIGN_TOKENS;
  const [focus, setFocus] = useState('');
  const [intention, setIntention] = useState('');
  
  return (
    <div style={{ 
      position: 'fixed',
      bottom: spacing.lg,
      right: spacing.lg,
      width: '320px',
      backgroundColor: colors.surface,
      borderRadius: effects.borderRadiusLg,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.md,
        backgroundColor: `${colors.primary}10`,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: '18px' }}>📸</span>
          <span style={{ 
            fontWeight: 600,
            color: colors.text.primary
          }}>
            Quick Capture
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: colors.text.muted,
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Content */}
      <div style={{ padding: spacing.md }}>
        <p style={{ 
          fontSize: '12px',
          color: colors.text.muted,
          margin: `0 0 ${spacing.sm}`
        }}>
          📂 {currentSphere}
        </p>
        
        <input
          type="text"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="What are you working on?"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: effects.borderRadius,
            fontSize: '14px',
            marginBottom: spacing.sm,
            boxSizing: 'border-box'
          }}
        />
        
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="What's next? (optional)"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: effects.borderRadius,
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      {/* Actions */}
      <div style={{ 
        padding: spacing.md,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        gap: spacing.sm
      }}>
        <button
          onClick={() => onCapture(focus || undefined, intention || undefined)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: colors.primary,
            border: 'none',
            borderRadius: effects.borderRadius,
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📸 Capture
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '10px 16px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: effects.borderRadius,
            color: colors.text.secondary,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ContextSnapshot — Main orchestrating component
 */
export interface ContextSnapshotProps {
  snapshots: ContextSnapshotType[];
  currentSphere: string;
  onSnapshotCreate: (config: CaptureConfig, notes: ContextNotes, title?: string, tags?: string[]) => Promise<string>;
  onSnapshotRestore: (id: string, options: RestoreOptions) => Promise<void>;
  onSnapshotDelete: (id: string) => void;
  onSnapshotArchive: (id: string) => void;
  onQuickCapture: (focus?: string, intention?: string) => Promise<string>;
}

const ContextSnapshot: React.FC<ContextSnapshotProps> = ({
  snapshots,
  currentSphere,
  onSnapshotCreate,
  onSnapshotRestore,
  onSnapshotDelete,
  onSnapshotArchive,
  onQuickCapture
}) => {
  const { colors, spacing } = SNAPSHOT_DESIGN_TOKENS;
  
  // UI State
  const [uiState, setUIState] = useState<ContextSnapshotUIState>({
    view: 'list',
    filters: {},
    sort: 'recent_first',
    capturing: false,
    restoring: false,
    show_quick_capture: false
  });
  
  // Capture state
  const [captureState, setCaptureState] = useState<CaptureFlowState>({
    step: 'config',
    config: DEFAULT_CAPTURE_CONFIG,
    notes: {},
    tags: [],
    progress: 0
  });
  
  // Restore state
  const [restoreState, setRestoreState] = useState<RestoreFlowState>({
    snapshot_id: '',
    step: 'options',
    options: DEFAULT_RESTORE_OPTIONS,
    progress: 0,
    restored_elements: []
  });
  
  // Selected snapshot
  const selectedSnapshot = useMemo(() => {
    if (!uiState.selected_snapshot_id) return null;
    return snapshots.find(s => s.id === uiState.selected_snapshot_id) || null;
  }, [snapshots, uiState.selected_snapshot_id]);
  
  // Handlers
  const handleSelect = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      view: 'detail',
      selected_snapshot_id: id
    }));
  }, []);
  
  const handleBackToList = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      view: 'list',
      selected_snapshot_id: undefined
    }));
  }, []);
  
  const handleStartCapture = useCallback(() => {
    setCaptureState({
      step: 'config',
      config: DEFAULT_CAPTURE_CONFIG,
      notes: {},
      tags: [],
      progress: 0
    });
    setUIState(prev => ({ ...prev, view: 'capture' }));
  }, []);
  
  const handleCaptureNext = useCallback(() => {
    setCaptureState(prev => {
      const steps: CaptureFlowState['step'][] = ['config', 'notes', 'review'];
      const currentIndex = steps.indexOf(prev.step);
      const nextStep = steps[currentIndex + 1] || 'review';
      return { ...prev, step: nextStep };
    });
  }, []);
  
  const handleCaptureBack = useCallback(() => {
    setCaptureState(prev => {
      const steps: CaptureFlowState['step'][] = ['config', 'notes', 'review'];
      const currentIndex = steps.indexOf(prev.step);
      const prevStep = steps[Math.max(0, currentIndex - 1)];
      return { ...prev, step: prevStep };
    });
  }, []);
  
  const handleCapture = useCallback(async () => {
    setCaptureState(prev => ({ ...prev, step: 'capturing', progress: 0 }));
    
    // Simulate progress
    const interval = setInterval(() => {
      setCaptureState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 20, 90)
      }));
    }, 200);
    
    try {
      await onSnapshotCreate(
        captureState.config,
        captureState.notes as ContextNotes,
        captureState.title,
        captureState.tags
      );
      
      clearInterval(interval);
      setCaptureState(prev => ({ ...prev, step: 'complete', progress: 100 }));
    } catch (error) {
      clearInterval(interval);
      setCaptureState(prev => ({
        ...prev,
        step: 'config',
        error: 'Failed to capture context. Please try again.'
      }));
    }
  }, [captureState, onSnapshotCreate]);
  
  const handleCaptureCancel = useCallback(() => {
    setUIState(prev => ({ ...prev, view: 'list' }));
    setCaptureState({
      step: 'config',
      config: DEFAULT_CAPTURE_CONFIG,
      notes: {},
      tags: [],
      progress: 0
    });
  }, []);
  
  const handleStartRestore = useCallback((id?: string) => {
    const snapshotId = id || uiState.selected_snapshot_id;
    if (!snapshotId) return;
    
    setRestoreState({
      snapshot_id: snapshotId,
      step: 'options',
      options: DEFAULT_RESTORE_OPTIONS,
      progress: 0,
      restored_elements: []
    });
    setUIState(prev => ({ ...prev, view: 'restore' }));
  }, [uiState.selected_snapshot_id]);
  
  const handleRestore = useCallback(async () => {
    setRestoreState(prev => ({ ...prev, step: 'restoring', progress: 0 }));
    
    // Simulate progress
    const interval = setInterval(() => {
      setRestoreState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 20, 90)
      }));
    }, 200);
    
    try {
      await onSnapshotRestore(restoreState.snapshot_id, restoreState.options);
      
      clearInterval(interval);
      
      // Build list of restored elements
      const elements: string[] = [];
      if (restoreState.options.restore_navigation) elements.push('Navigation state');
      if (restoreState.options.restore_threads) elements.push('Active threads');
      if (restoreState.options.restore_agents) elements.push('Active agents');
      if (restoreState.options.restore_open_items) elements.push('Open items');
      
      setRestoreState(prev => ({
        ...prev,
        step: 'complete',
        progress: 100,
        restored_elements: elements
      }));
    } catch (error) {
      clearInterval(interval);
      setRestoreState(prev => ({
        ...prev,
        step: 'options',
        error: 'Failed to restore context. Please try again.'
      }));
    }
  }, [restoreState, onSnapshotRestore]);
  
  const handleRestoreCancel = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      view: uiState.selected_snapshot_id ? 'detail' : 'list'
    }));
  }, [uiState.selected_snapshot_id]);
  
  const handleQuickCapture = useCallback(async (focus?: string, intention?: string) => {
    try {
      await onQuickCapture(focus, intention);
      setUIState(prev => ({ ...prev, show_quick_capture: false }));
    } catch (error) {
      logger.error('Quick capture failed:', error);
    }
  }, [onQuickCapture]);
  
  return (
    <div style={{ 
      height: '100%',
      position: 'relative'
    }}>
      {/* List View */}
      {uiState.view === 'list' && (
        <SnapshotList
          snapshots={snapshots}
          selectedId={uiState.selected_snapshot_id}
          filters={uiState.filters}
          onSelect={handleSelect}
          onQuickRestore={handleStartRestore}
          onFiltersChange={(filters) => setUIState(prev => ({ ...prev, filters }))}
          onCapture={handleStartCapture}
        />
      )}
      
      {/* Detail View */}
      {uiState.view === 'detail' && selectedSnapshot && (
        <SnapshotView
          snapshot={selectedSnapshot}
          onBack={handleBackToList}
          onRestore={() => handleStartRestore()}
          onDelete={() => {
            onSnapshotDelete(selectedSnapshot.id);
            handleBackToList();
          }}
          onArchive={() => {
            onSnapshotArchive(selectedSnapshot.id);
            handleBackToList();
          }}
        />
      )}
      
      {/* Capture Flow */}
      {uiState.view === 'capture' && (
        <SnapshotCapture
          captureState={captureState}
          onConfigChange={(config) => setCaptureState(prev => ({
            ...prev,
            config: { ...prev.config, ...config }
          }))}
          onNotesChange={(notes) => setCaptureState(prev => ({
            ...prev,
            notes: { ...prev.notes, ...notes }
          }))}
          onTitleChange={(title) => setCaptureState(prev => ({ ...prev, title }))}
          onTagsChange={(tags) => setCaptureState(prev => ({ ...prev, tags }))}
          onNext={handleCaptureNext}
          onBack={handleCaptureBack}
          onCapture={handleCapture}
          onCancel={handleCaptureCancel}
        />
      )}
      
      {/* Restore Flow */}
      {uiState.view === 'restore' && selectedSnapshot && (
        <SnapshotRestore
          snapshot={selectedSnapshot}
          restoreState={restoreState}
          onOptionsChange={(options) => setRestoreState(prev => ({
            ...prev,
            options: { ...prev.options, ...options }
          }))}
          onRestore={handleRestore}
          onCancel={handleRestoreCancel}
        />
      )}
      
      {/* Quick Capture Panel */}
      {uiState.show_quick_capture && (
        <QuickCapturePanel
          currentSphere={currentSphere}
          onCapture={handleQuickCapture}
          onClose={() => setUIState(prev => ({ ...prev, show_quick_capture: false }))}
        />
      )}
      
      {/* Quick Capture Trigger (FAB) */}
      {uiState.view === 'list' && !uiState.show_quick_capture && (
        <button
          onClick={() => setUIState(prev => ({ ...prev, show_quick_capture: true }))}
          title="Quick Capture"
          style={{
            position: 'fixed',
            bottom: spacing.lg,
            right: spacing.lg,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            border: 'none',
            color: '#FFFFFF',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          📸
        </button>
      )}
    </div>
  );
};

export default ContextSnapshot;

// Named exports
export {
  ContextSnapshot,
  SnapshotList,
  SnapshotCard,
  SnapshotView,
  SnapshotCapture,
  SnapshotRestore,
  QuickCapturePanel,
  TriggerBadge,
  StateIndicator
};
