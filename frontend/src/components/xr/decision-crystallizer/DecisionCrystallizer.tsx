/**
 * CHE·NU™ V51 Meta-Layer
 * Decision Crystallizer V1.0 — Main Component
 * 
 * Crystalline visibility for human decisions.
 * Records and respects choices without judgment.
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import React, { useMemo, useCallback } from 'react';
import {
  DecisionEntry,
  DecisionNature,
  CertaintyLevel,
  DecisionState,
  DecisionFilters,
  DecisionSortOption,
  DecisionDrift,
  EmergingDecision,
  DecisionCreationStep,
  DecisionCreationState,
  AlternativeConsidered,
  DecisionLinkedEntity,
  DecisionContext,
  DECISION_NATURE_SYMBOLS,
  DECISION_NATURE_LABELS,
  DECISION_NATURE_DESCRIPTIONS,
  CERTAINTY_INDICATORS,
  DECISION_STATE_DESCRIPTIONS,
  DECISION_DESIGN_TOKENS as TOKENS
} from './decision-crystallizer.types';

// ============================================================================
// DECISION LIST COMPONENT
// ============================================================================

interface DecisionListProps {
  decisions: DecisionEntry[];
  filters: DecisionFilters;
  sort: DecisionSortOption;
  onSelectDecision: (id: string) => void;
  onFilterChange: (filters: DecisionFilters) => void;
  onSortChange: (sort: DecisionSortOption) => void;
  selectedId?: string;
}

/**
 * DecisionList — List view of crystallized decisions
 * 
 * Shows decisions with filtering and sorting.
 * No ranking or quality indicators.
 */
export const DecisionList: React.FC<DecisionListProps> = ({
  decisions,
  filters,
  sort,
  onSelectDecision,
  onFilterChange,
  onSortChange,
  selectedId
}) => {
  // Count by nature
  const natureCounts = useMemo(() => {
    const counts: Record<DecisionNature, number> = {
      commitment: 0, direction: 0, boundary: 0, priority: 0,
      allocation: 0, delegation: 0, deferral: 0, acceptance: 0,
      release: 0, unknown: 0
    };
    decisions.forEach(d => counts[d.nature]++);
    return counts;
  }, [decisions]);

  // Count by state
  const stateCounts = useMemo(() => {
    const counts: Record<DecisionState, number> = {
      emerging: 0, crystallized: 0, active: 0, dormant: 0,
      revisited: 0, superseded: 0, dissolved: 0
    };
    decisions.forEach(d => counts[d.state]++);
    return counts;
  }, [decisions]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: TOKENS.spacing.md,
      padding: TOKENS.spacing.md
    }}>
      {/* Filter bar */}
      <div style={{
        display: 'flex',
        gap: TOKENS.spacing.sm,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search decisions..."
          value={filters.search || ''}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: TOKENS.spacing.sm,
            border: `1px solid ${TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            fontSize: TOKENS.typography.body.fontSize,
            outline: 'none'
          }}
        />

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value as DecisionSortOption)}
          style={{
            padding: TOKENS.spacing.sm,
            border: `1px solid ${TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            fontSize: TOKENS.typography.body.fontSize,
            background: TOKENS.colors.surface
          }}
        >
          <option value="recent_first">Most Recent</option>
          <option value="oldest_first">Oldest First</option>
          <option value="by_nature">By Nature</option>
          <option value="by_state">By State</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Nature filter chips */}
      <div style={{
        display: 'flex',
        gap: TOKENS.spacing.xs,
        flexWrap: 'wrap'
      }}>
        {(Object.keys(DECISION_NATURE_SYMBOLS) as DecisionNature[]).map(nature => {
          const count = natureCounts[nature];
          if (count === 0) return null;
          
          const isActive = filters.natures?.includes(nature);
          
          return (
            <button
              key={nature}
              onClick={() => {
                const current = filters.natures || [];
                const updated = isActive
                  ? current.filter(n => n !== nature)
                  : [...current, nature];
                onFilterChange({ ...filters, natures: updated.length ? updated : undefined });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: TOKENS.spacing.xs,
                padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                border: `1px solid ${isActive ? TOKENS.colors.nature[nature] : TOKENS.colors.border}`,
                borderRadius: '16px',
                background: isActive ? `${TOKENS.colors.nature[nature]}15` : 'transparent',
                color: isActive ? TOKENS.colors.nature[nature] : TOKENS.colors.text.secondary,
                fontSize: '12px',
                cursor: 'pointer',
                transition: TOKENS.effects.transition
              }}
            >
              <span>{DECISION_NATURE_SYMBOLS[nature]}</span>
              <span>{DECISION_NATURE_LABELS[nature]}</span>
              <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* State filter chips */}
      <div style={{
        display: 'flex',
        gap: TOKENS.spacing.xs,
        flexWrap: 'wrap'
      }}>
        {(['active', 'crystallized', 'revisited', 'dormant', 'superseded', 'dissolved'] as DecisionState[]).map(state => {
          const count = stateCounts[state];
          if (count === 0) return null;
          
          const isActive = filters.states?.includes(state);
          
          return (
            <button
              key={state}
              onClick={() => {
                const current = filters.states || [];
                const updated = isActive
                  ? current.filter(s => s !== state)
                  : [...current, state];
                onFilterChange({ ...filters, states: updated.length ? updated : undefined });
              }}
              style={{
                padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                border: `1px solid ${isActive ? TOKENS.colors.state[state] : TOKENS.colors.border}`,
                borderRadius: '16px',
                background: isActive ? `${TOKENS.colors.state[state]}15` : 'transparent',
                color: isActive ? TOKENS.colors.state[state] : TOKENS.colors.text.secondary,
                fontSize: '12px',
                cursor: 'pointer',
                transition: TOKENS.effects.transition
              }}
            >
              {state} ({count})
            </button>
          );
        })}
      </div>

      {/* Decision cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: TOKENS.spacing.sm
      }}>
        {decisions.length === 0 ? (
          <div style={{
            padding: TOKENS.spacing.xl,
            textAlign: 'center',
            color: TOKENS.colors.text.muted
          }}>
            No decisions crystallized yet.
          </div>
        ) : (
          decisions.map(decision => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              isSelected={decision.id === selectedId}
              onClick={() => onSelectDecision(decision.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DECISION CARD COMPONENT
// ============================================================================

interface DecisionCardProps {
  decision: DecisionEntry;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * DecisionCard — Summary card for a decision
 * 
 * Shows nature, title, certainty, and state.
 * Clean, non-judgmental presentation.
 */
export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  isSelected,
  onClick
}) => {
  const natureColor = TOKENS.colors.nature[decision.nature];
  const stateColor = TOKENS.colors.state[decision.state];

  return (
    <div
      onClick={onClick}
      style={{
        padding: TOKENS.spacing.md,
        background: isSelected ? `${TOKENS.colors.primary}08` : TOKENS.colors.surface,
        border: `1px solid ${isSelected ? TOKENS.colors.primary : TOKENS.colors.border}`,
        borderRadius: TOKENS.effects.borderRadius,
        cursor: 'pointer',
        transition: TOKENS.effects.transition
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: TOKENS.spacing.sm,
        marginBottom: TOKENS.spacing.sm
      }}>
        {/* Nature badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: TOKENS.spacing.xs,
          padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
          background: `${natureColor}15`,
          borderRadius: '12px',
          fontSize: '12px',
          color: natureColor
        }}>
          <span>{DECISION_NATURE_SYMBOLS[decision.nature]}</span>
          <span>{DECISION_NATURE_LABELS[decision.nature]}</span>
        </div>

        {/* State indicator */}
        <div style={{
          padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
          background: `${stateColor}15`,
          borderRadius: '12px',
          fontSize: '11px',
          color: stateColor,
          textTransform: 'capitalize'
        }}>
          {decision.state}
        </div>

        {/* Certainty indicator */}
        <div style={{
          marginLeft: 'auto',
          fontSize: '11px',
          color: TOKENS.colors.certainty[decision.certainty],
          letterSpacing: '1px'
        }}>
          {CERTAINTY_INDICATORS[decision.certainty]}
        </div>
      </div>

      {/* Title */}
      <div style={{
        ...TOKENS.typography.title,
        color: TOKENS.colors.text.primary,
        marginBottom: TOKENS.spacing.xs
      }}>
        {decision.title}
      </div>

      {/* Statement preview */}
      <div style={{
        ...TOKENS.typography.body,
        color: TOKENS.colors.text.secondary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {decision.statement}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: TOKENS.spacing.sm,
        fontSize: '11px',
        color: TOKENS.colors.text.muted
      }}>
        <span>
          {new Date(decision.crystallized_at).toLocaleDateString()}
        </span>
        
        {decision.tags.length > 0 && (
          <div style={{ display: 'flex', gap: TOKENS.spacing.xs }}>
            {decision.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{ opacity: 0.7 }}>#{tag}</span>
            ))}
            {decision.tags.length > 2 && (
              <span style={{ opacity: 0.5 }}>+{decision.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DECISION VIEW COMPONENT
// ============================================================================

interface DecisionViewProps {
  decision: DecisionEntry;
  onClose: () => void;
  onEdit: () => void;
  onRevisit: () => void;
  relatedDecisions?: DecisionEntry[];
}

/**
 * DecisionView — Detailed view of a crystallized decision
 * 
 * Full context display without judgment.
 */
export const DecisionView: React.FC<DecisionViewProps> = ({
  decision,
  onClose,
  onEdit,
  onRevisit,
  relatedDecisions = []
}) => {
  const natureColor = TOKENS.colors.nature[decision.nature];
  const stateColor = TOKENS.colors.state[decision.state];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: TOKENS.spacing.lg,
      padding: TOKENS.spacing.lg
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          {/* Nature and state badges */}
          <div style={{
            display: 'flex',
            gap: TOKENS.spacing.sm,
            marginBottom: TOKENS.spacing.sm
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: TOKENS.spacing.xs,
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              background: `${natureColor}15`,
              borderRadius: '12px',
              fontSize: '13px',
              color: natureColor
            }}>
              <span style={{ fontSize: '16px' }}>{DECISION_NATURE_SYMBOLS[decision.nature]}</span>
              <span>{DECISION_NATURE_LABELS[decision.nature]}</span>
            </div>

            <div style={{
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              background: `${stateColor}15`,
              borderRadius: '12px',
              fontSize: '12px',
              color: stateColor,
              textTransform: 'capitalize'
            }}>
              {decision.state}
            </div>
          </div>

          {/* Title */}
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 600,
            color: TOKENS.colors.text.primary
          }}>
            {decision.title}
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            padding: TOKENS.spacing.sm,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '20px',
            color: TOKENS.colors.text.muted
          }}
        >
          ×
        </button>
      </div>

      {/* Statement - the heart of the decision */}
      <div style={{
        padding: TOKENS.spacing.lg,
        background: `${TOKENS.colors.primary}05`,
        borderLeft: `4px solid ${natureColor}`,
        borderRadius: TOKENS.effects.borderRadius
      }}>
        <div style={{
          ...TOKENS.typography.statement,
          color: TOKENS.colors.text.primary,
          fontStyle: 'normal'
        }}>
          {decision.statement}
        </div>
      </div>

      {/* Certainty display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: TOKENS.spacing.md
      }}>
        <span style={{
          ...TOKENS.typography.label,
          color: TOKENS.colors.text.muted
        }}>
          Certainty
        </span>
        <span style={{
          fontSize: '14px',
          color: TOKENS.colors.certainty[decision.certainty],
          letterSpacing: '2px'
        }}>
          {CERTAINTY_INDICATORS[decision.certainty]}
        </span>
        <span style={{
          fontSize: '14px',
          color: TOKENS.colors.text.secondary,
          textTransform: 'capitalize'
        }}>
          {decision.certainty}
        </span>
      </div>

      {/* Rationale (if provided) */}
      {decision.rationale && (
        <div>
          <div style={{
            ...TOKENS.typography.label,
            color: TOKENS.colors.text.muted,
            marginBottom: TOKENS.spacing.sm
          }}>
            Rationale
          </div>
          <div style={{
            ...TOKENS.typography.body,
            color: TOKENS.colors.text.secondary,
            padding: TOKENS.spacing.md,
            background: TOKENS.colors.background,
            borderRadius: TOKENS.effects.borderRadius
          }}>
            {decision.rationale}
          </div>
        </div>
      )}

      {/* Alternatives considered */}
      {decision.alternatives.length > 0 && (
        <div>
          <div style={{
            ...TOKENS.typography.label,
            color: TOKENS.colors.text.muted,
            marginBottom: TOKENS.spacing.sm
          }}>
            Alternatives Considered
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: TOKENS.spacing.sm
          }}>
            {decision.alternatives.map((alt, idx) => (
              <div
                key={alt.id}
                style={{
                  padding: TOKENS.spacing.md,
                  background: TOKENS.colors.background,
                  borderRadius: TOKENS.effects.borderRadius,
                  border: `1px solid ${TOKENS.colors.border}`
                }}
              >
                <div style={{
                  ...TOKENS.typography.body,
                  color: TOKENS.colors.text.primary,
                  marginBottom: alt.reason_not_chosen ? TOKENS.spacing.xs : 0
                }}>
                  {idx + 1}. {alt.description}
                </div>
                {alt.reason_not_chosen && (
                  <div style={{
                    fontSize: '13px',
                    color: TOKENS.colors.text.muted,
                    fontStyle: 'italic'
                  }}>
                    Why not: {alt.reason_not_chosen}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context at decision time */}
      <div>
        <div style={{
          ...TOKENS.typography.label,
          color: TOKENS.colors.text.muted,
          marginBottom: TOKENS.spacing.sm
        }}>
          Context When Decided
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: TOKENS.spacing.md
        }}>
          {decision.context.constraints.length > 0 && (
            <ContextSection
              title="Constraints"
              items={decision.context.constraints}
            />
          )}
          {decision.context.information_available.length > 0 && (
            <ContextSection
              title="Information Available"
              items={decision.context.information_available}
            />
          )}
          {decision.context.information_gaps.length > 0 && (
            <ContextSection
              title="Information Gaps"
              items={decision.context.information_gaps}
            />
          )}
          {decision.context.pressures.length > 0 && (
            <ContextSection
              title="Pressures Present"
              items={decision.context.pressures}
            />
          )}
        </div>
        {decision.context.notes && (
          <div style={{
            marginTop: TOKENS.spacing.md,
            padding: TOKENS.spacing.md,
            background: TOKENS.colors.background,
            borderRadius: TOKENS.effects.borderRadius,
            fontSize: '13px',
            color: TOKENS.colors.text.secondary,
            fontStyle: 'italic'
          }}>
            {decision.context.notes}
          </div>
        )}
      </div>

      {/* Linked entities */}
      {decision.linked_entities.length > 0 && (
        <div>
          <div style={{
            ...TOKENS.typography.label,
            color: TOKENS.colors.text.muted,
            marginBottom: TOKENS.spacing.sm
          }}>
            Linked To
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: TOKENS.spacing.sm
          }}>
            {decision.linked_entities.map(entity => (
              <div
                key={entity.id}
                style={{
                  padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                  background: TOKENS.colors.background,
                  border: `1px solid ${TOKENS.colors.border}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: TOKENS.colors.text.secondary
                }}
              >
                <span style={{ opacity: 0.6 }}>{entity.type}: </span>
                {entity.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related decisions */}
      {relatedDecisions.length > 0 && (
        <div>
          <div style={{
            ...TOKENS.typography.label,
            color: TOKENS.colors.text.muted,
            marginBottom: TOKENS.spacing.sm
          }}>
            Related Decisions
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: TOKENS.spacing.sm
          }}>
            {relatedDecisions.map(related => (
              <div
                key={related.id}
                style={{
                  padding: TOKENS.spacing.sm,
                  background: TOKENS.colors.background,
                  border: `1px solid ${TOKENS.colors.border}`,
                  borderRadius: TOKENS.effects.borderRadius,
                  fontSize: '13px'
                }}
              >
                <span style={{ color: TOKENS.colors.nature[related.nature] }}>
                  {DECISION_NATURE_SYMBOLS[related.nature]}
                </span>{' '}
                <span style={{ color: TOKENS.colors.text.primary }}>
                  {related.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revisitation history */}
      {decision.revisitations.length > 0 && (
        <div>
          <div style={{
            ...TOKENS.typography.label,
            color: TOKENS.colors.text.muted,
            marginBottom: TOKENS.spacing.sm
          }}>
            Revisitation History
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: TOKENS.spacing.sm
          }}>
            {decision.revisitations.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  padding: TOKENS.spacing.md,
                  background: TOKENS.colors.background,
                  borderRadius: TOKENS.effects.borderRadius,
                  border: `1px solid ${TOKENS.colors.border}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: TOKENS.spacing.xs
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: TOKENS.colors.text.muted
                  }}>
                    {new Date(rev.revisited_at).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: TOKENS.colors.state[rev.outcome === 'reaffirmed' ? 'active' : 'revisited'],
                    textTransform: 'capitalize'
                  }}>
                    {rev.outcome}
                  </span>
                </div>
                {rev.notes && (
                  <div style={{
                    fontSize: '13px',
                    color: TOKENS.colors.text.secondary
                  }}>
                    {rev.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: TOKENS.spacing.md,
        borderTop: `1px solid ${TOKENS.colors.border}`,
        fontSize: '12px',
        color: TOKENS.colors.text.muted
      }}>
        <div>
          Crystallized: {new Date(decision.crystallized_at).toLocaleString()}
        </div>
        <div style={{ display: 'flex', gap: TOKENS.spacing.sm }}>
          <button
            onClick={onEdit}
            style={{
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              border: `1px solid ${TOKENS.colors.border}`,
              borderRadius: TOKENS.effects.borderRadius,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '12px',
              color: TOKENS.colors.text.secondary
            }}
          >
            Edit
          </button>
          <button
            onClick={onRevisit}
            style={{
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              border: `1px solid ${TOKENS.colors.primary}`,
              borderRadius: TOKENS.effects.borderRadius,
              background: `${TOKENS.colors.primary}15`,
              cursor: 'pointer',
              fontSize: '12px',
              color: TOKENS.colors.primary
            }}
          >
            Revisit
          </button>
        </div>
      </div>

      {/* Tags */}
      {decision.tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: TOKENS.spacing.xs,
          flexWrap: 'wrap'
        }}>
          {decision.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: `2px ${TOKENS.spacing.sm}`,
                background: TOKENS.colors.background,
                borderRadius: '12px',
                fontSize: '11px',
                color: TOKENS.colors.text.muted
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Context section helper
const ContextSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div style={{
    padding: TOKENS.spacing.md,
    background: TOKENS.colors.background,
    borderRadius: TOKENS.effects.borderRadius
  }}>
    <div style={{
      fontSize: '11px',
      fontWeight: 500,
      color: TOKENS.colors.text.muted,
      marginBottom: TOKENS.spacing.xs,
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
    <ul style={{
      margin: 0,
      padding: 0,
      paddingLeft: TOKENS.spacing.md,
      fontSize: '13px',
      color: TOKENS.colors.text.secondary
    }}>
      {items.map((item, idx) => (
        <li key={idx} style={{ marginBottom: '2px' }}>{item}</li>
      ))}
    </ul>
  </div>
);

// ============================================================================
// DECISION CREATION COMPONENT
// ============================================================================

interface DecisionCreationProps {
  state: DecisionCreationState;
  onStateChange: (state: DecisionCreationState) => void;
  onCancel: () => void;
  onCrystallize: () => void;
}

/**
 * DecisionCreation — Guided flow for crystallizing a decision
 * 
 * Multi-step form without pressure.
 * Only the statement is required.
 */
export const DecisionCreation: React.FC<DecisionCreationProps> = ({
  state,
  onStateChange,
  onCancel,
  onCrystallize
}) => {
  const stepOrder: DecisionCreationStep[] = [
    'nature', 'statement', 'certainty', 'context', 
    'alternatives', 'rationale', 'links', 'review'
  ];
  
  const currentIndex = stepOrder.indexOf(state.step);
  
  const goToStep = useCallback((step: DecisionCreationStep) => {
    onStateChange({ ...state, step });
  }, [state, onStateChange]);

  const goNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < stepOrder.length) {
      goToStep(stepOrder[nextIndex]);
    }
  }, [currentIndex, stepOrder, goToStep]);

  const goPrev = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      goToStep(stepOrder[prevIndex]);
    }
  }, [currentIndex, stepOrder, goToStep]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: TOKENS.spacing.lg,
      padding: TOKENS.spacing.lg,
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        gap: TOKENS.spacing.xs,
        justifyContent: 'center'
      }}>
        {stepOrder.map((step, idx) => (
          <div
            key={step}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: idx === currentIndex 
                ? TOKENS.colors.primary 
                : idx < currentIndex 
                  ? `${TOKENS.colors.primary}60`
                  : TOKENS.colors.border,
              cursor: 'pointer',
              transition: TOKENS.effects.transition
            }}
            onClick={() => goToStep(step)}
          />
        ))}
      </div>

      {/* Step content */}
      {state.step === 'nature' && (
        <NatureStep
          selected={state.nature}
          onSelect={nature => onStateChange({ ...state, nature })}
        />
      )}

      {state.step === 'statement' && (
        <StatementStep
          title={state.title}
          statement={state.statement}
          onTitleChange={title => onStateChange({ ...state, title })}
          onStatementChange={statement => onStateChange({ ...state, statement })}
        />
      )}

      {state.step === 'certainty' && (
        <CertaintyStep
          selected={state.certainty}
          onSelect={certainty => onStateChange({ ...state, certainty })}
        />
      )}

      {state.step === 'context' && (
        <ContextStep
          context={state.context}
          onChange={context => onStateChange({ ...state, context })}
        />
      )}

      {state.step === 'alternatives' && (
        <AlternativesStep
          alternatives={state.alternatives}
          onChange={alternatives => onStateChange({ ...state, alternatives })}
        />
      )}

      {state.step === 'rationale' && (
        <RationaleStep
          rationale={state.rationale}
          onChange={rationale => onStateChange({ ...state, rationale })}
        />
      )}

      {state.step === 'links' && (
        <LinksStep
          links={state.linked_entities}
          tags={state.tags}
          onLinksChange={linked_entities => onStateChange({ ...state, linked_entities })}
          onTagsChange={tags => onStateChange({ ...state, tags })}
        />
      )}

      {state.step === 'review' && (
        <ReviewStep state={state} />
      )}

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: TOKENS.spacing.md,
        borderTop: `1px solid ${TOKENS.colors.border}`
      }}>
        <button
          onClick={currentIndex === 0 ? onCancel : goPrev}
          style={{
            padding: `${TOKENS.spacing.sm} ${TOKENS.spacing.md}`,
            border: `1px solid ${TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            color: TOKENS.colors.text.secondary
          }}
        >
          {currentIndex === 0 ? 'Cancel' : 'Back'}
        </button>

        {state.step === 'review' ? (
          <button
            onClick={onCrystallize}
            disabled={!state.is_valid}
            style={{
              padding: `${TOKENS.spacing.sm} ${TOKENS.spacing.lg}`,
              border: 'none',
              borderRadius: TOKENS.effects.borderRadius,
              background: state.is_valid ? TOKENS.colors.primary : TOKENS.colors.border,
              cursor: state.is_valid ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 500,
              color: state.is_valid ? '#FFFFFF' : TOKENS.colors.text.muted
            }}
          >
            Crystallize Decision
          </button>
        ) : (
          <button
            onClick={goNext}
            style={{
              padding: `${TOKENS.spacing.sm} ${TOKENS.spacing.md}`,
              border: `1px solid ${TOKENS.colors.primary}`,
              borderRadius: TOKENS.effects.borderRadius,
              background: `${TOKENS.colors.primary}15`,
              cursor: 'pointer',
              fontSize: '14px',
              color: TOKENS.colors.primary
            }}
          >
            {state.step === 'statement' && !state.statement ? 'Skip' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

// Creation step components
const NatureStep: React.FC<{
  selected?: DecisionNature;
  onSelect: (nature: DecisionNature) => void;
}> = ({ selected, onSelect }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      What kind of decision is this?
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      No type is better than another. This helps with organization.
    </p>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: TOKENS.spacing.sm
    }}>
      {(Object.keys(DECISION_NATURE_SYMBOLS) as DecisionNature[]).map(nature => (
        <button
          key={nature}
          onClick={() => onSelect(nature)}
          style={{
            padding: TOKENS.spacing.md,
            border: `1px solid ${selected === nature ? TOKENS.colors.nature[nature] : TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            background: selected === nature ? `${TOKENS.colors.nature[nature]}15` : 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: TOKENS.effects.transition
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: TOKENS.spacing.sm,
            marginBottom: TOKENS.spacing.xs
          }}>
            <span style={{
              fontSize: '18px',
              color: TOKENS.colors.nature[nature]
            }}>
              {DECISION_NATURE_SYMBOLS[nature]}
            </span>
            <span style={{
              fontWeight: 500,
              color: selected === nature ? TOKENS.colors.nature[nature] : TOKENS.colors.text.primary
            }}>
              {DECISION_NATURE_LABELS[nature]}
            </span>
          </div>
          <div style={{
            fontSize: '12px',
            color: TOKENS.colors.text.muted
          }}>
            {DECISION_NATURE_DESCRIPTIONS[nature]}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const StatementStep: React.FC<{
  title: string;
  statement: string;
  onTitleChange: (title: string) => void;
  onStatementChange: (statement: string) => void;
}> = ({ title, statement, onTitleChange, onStatementChange }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      What is the decision?
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      State it in your own words. There's no right way to phrase it.
    </p>
    
    <div style={{ marginBottom: TOKENS.spacing.md }}>
      <label style={{
        display: 'block',
        ...TOKENS.typography.label,
        color: TOKENS.colors.text.muted,
        marginBottom: TOKENS.spacing.xs
      }}>
        Title (brief)
      </label>
      <input
        type="text"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="e.g., Focus on mobile first"
        style={{
          width: '100%',
          padding: TOKENS.spacing.sm,
          border: `1px solid ${TOKENS.colors.border}`,
          borderRadius: TOKENS.effects.borderRadius,
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>

    <div>
      <label style={{
        display: 'block',
        ...TOKENS.typography.label,
        color: TOKENS.colors.text.muted,
        marginBottom: TOKENS.spacing.xs
      }}>
        Statement
      </label>
      <textarea
        value={statement}
        onChange={e => onStatementChange(e.target.value)}
        placeholder="I have decided to..."
        rows={4}
        style={{
          width: '100%',
          padding: TOKENS.spacing.sm,
          border: `1px solid ${TOKENS.colors.border}`,
          borderRadius: TOKENS.effects.borderRadius,
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      />
    </div>
  </div>
);

const CertaintyStep: React.FC<{
  selected?: CertaintyLevel;
  onSelect: (certainty: CertaintyLevel) => void;
}> = ({ selected, onSelect }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      How certain do you feel?
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      This is for your own reference. Uncertainty is valid and valuable.
    </p>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: TOKENS.spacing.sm
    }}>
      {(['certain', 'confident', 'leaning', 'uncertain', 'torn', 'forced'] as CertaintyLevel[]).map(certainty => (
        <button
          key={certainty}
          onClick={() => onSelect(certainty)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: TOKENS.spacing.md,
            border: `1px solid ${selected === certainty ? TOKENS.colors.certainty[certainty] : TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            background: selected === certainty ? `${TOKENS.colors.certainty[certainty]}15` : 'transparent',
            cursor: 'pointer',
            transition: TOKENS.effects.transition
          }}
        >
          <span style={{
            textTransform: 'capitalize',
            fontWeight: selected === certainty ? 500 : 400,
            color: selected === certainty ? TOKENS.colors.certainty[certainty] : TOKENS.colors.text.primary
          }}>
            {certainty === 'torn' ? "I'm torn" : certainty === 'forced' ? 'Forced to choose' : certainty}
          </span>
          <span style={{
            color: TOKENS.colors.certainty[certainty],
            letterSpacing: '2px'
          }}>
            {CERTAINTY_INDICATORS[certainty]}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const ContextStep: React.FC<{
  context: Partial<DecisionContext>;
  onChange: (context: Partial<DecisionContext>) => void;
}> = ({ context, onChange }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      What context matters?
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      Optional. This helps you remember the circumstances later.
    </p>
    
    {/* Simplified context input */}
    <div style={{ marginBottom: TOKENS.spacing.md }}>
      <label style={{
        display: 'block',
        ...TOKENS.typography.label,
        color: TOKENS.colors.text.muted,
        marginBottom: TOKENS.spacing.xs
      }}>
        Notes about circumstances
      </label>
      <textarea
        value={context.notes || ''}
        onChange={e => onChange({ ...context, notes: e.target.value })}
        placeholder="What was going on when you made this decision?"
        rows={3}
        style={{
          width: '100%',
          padding: TOKENS.spacing.sm,
          border: `1px solid ${TOKENS.colors.border}`,
          borderRadius: TOKENS.effects.borderRadius,
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      />
    </div>
  </div>
);

const AlternativesStep: React.FC<{
  alternatives: Partial<AlternativeConsidered>[];
  onChange: (alternatives: Partial<AlternativeConsidered>[]) => void;
}> = ({ alternatives, onChange }) => {
  const addAlternative = () => {
    onChange([...alternatives, { id: crypto.randomUUID(), description: '', consideration_order: alternatives.length + 1 }]);
  };

  const updateAlternative = (index: number, field: string, value: string) => {
    const updated = [...alternatives];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <h3 style={{
        margin: 0,
        marginBottom: TOKENS.spacing.sm,
        fontSize: '18px',
        fontWeight: 500,
        color: TOKENS.colors.text.primary
      }}>
        What else was considered?
      </h3>
      <p style={{
        margin: 0,
        marginBottom: TOKENS.spacing.lg,
        fontSize: '14px',
        color: TOKENS.colors.text.muted
      }}>
        Optional. Recording alternatives helps future you understand the choice.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: TOKENS.spacing.md
      }}>
        {alternatives.map((alt, idx) => (
          <div
            key={alt.id || idx}
            style={{
              padding: TOKENS.spacing.md,
              border: `1px solid ${TOKENS.colors.border}`,
              borderRadius: TOKENS.effects.borderRadius
            }}
          >
            <input
              type="text"
              value={alt.description || ''}
              onChange={e => updateAlternative(idx, 'description', e.target.value)}
              placeholder={`Alternative ${idx + 1}`}
              style={{
                width: '100%',
                padding: TOKENS.spacing.sm,
                border: `1px solid ${TOKENS.colors.border}`,
                borderRadius: TOKENS.effects.borderRadius,
                fontSize: '14px',
                marginBottom: TOKENS.spacing.sm,
                outline: 'none'
              }}
            />
            <input
              type="text"
              value={alt.reason_not_chosen || ''}
              onChange={e => updateAlternative(idx, 'reason_not_chosen', e.target.value)}
              placeholder="Why not chosen? (optional)"
              style={{
                width: '100%',
                padding: TOKENS.spacing.sm,
                border: `1px solid ${TOKENS.colors.border}`,
                borderRadius: TOKENS.effects.borderRadius,
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        ))}
        
        <button
          onClick={addAlternative}
          style={{
            padding: TOKENS.spacing.sm,
            border: `1px dashed ${TOKENS.colors.border}`,
            borderRadius: TOKENS.effects.borderRadius,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            color: TOKENS.colors.text.muted
          }}
        >
          + Add alternative
        </button>
      </div>
    </div>
  );
};

const RationaleStep: React.FC<{
  rationale?: string;
  onChange: (rationale: string) => void;
}> = ({ rationale, onChange }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      Why this choice?
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      Optional. You don't need to justify your decisions. This is for your own reference.
    </p>
    
    <textarea
      value={rationale || ''}
      onChange={e => onChange(e.target.value)}
      placeholder="What led you to this decision? What matters most?"
      rows={5}
      style={{
        width: '100%',
        padding: TOKENS.spacing.sm,
        border: `1px solid ${TOKENS.colors.border}`,
        borderRadius: TOKENS.effects.borderRadius,
        fontSize: '14px',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit'
      }}
    />
  </div>
);

const LinksStep: React.FC<{
  links: DecisionLinkedEntity[];
  tags: string[];
  onLinksChange: (links: DecisionLinkedEntity[]) => void;
  onTagsChange: (tags: string[]) => void;
}> = ({ links, tags, onLinksChange, onTagsChange }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      Connect this decision
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      Optional. Add tags or link to threads, projects, or other items.
    </p>
    
    <div style={{ marginBottom: TOKENS.spacing.md }}>
      <label style={{
        display: 'block',
        ...TOKENS.typography.label,
        color: TOKENS.colors.text.muted,
        marginBottom: TOKENS.spacing.xs
      }}>
        Tags
      </label>
      <input
        type="text"
        value={tags.join(', ')}
        onChange={e => onTagsChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
        placeholder="work, personal, q1-2025"
        style={{
          width: '100%',
          padding: TOKENS.spacing.sm,
          border: `1px solid ${TOKENS.colors.border}`,
          borderRadius: TOKENS.effects.borderRadius,
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
    
    {/* Links would be more sophisticated in production */}
    <div style={{
      padding: TOKENS.spacing.md,
      background: TOKENS.colors.background,
      borderRadius: TOKENS.effects.borderRadius,
      fontSize: '13px',
      color: TOKENS.colors.text.muted
    }}>
      Linking to threads, projects, and other items will be available in the full interface.
    </div>
  </div>
);

const ReviewStep: React.FC<{ state: DecisionCreationState }> = ({ state }) => (
  <div>
    <h3 style={{
      margin: 0,
      marginBottom: TOKENS.spacing.sm,
      fontSize: '18px',
      fontWeight: 500,
      color: TOKENS.colors.text.primary
    }}>
      Review your decision
    </h3>
    <p style={{
      margin: 0,
      marginBottom: TOKENS.spacing.lg,
      fontSize: '14px',
      color: TOKENS.colors.text.muted
    }}>
      Once crystallized, this decision will be recorded. You can always revisit it later.
    </p>

    <div style={{
      padding: TOKENS.spacing.lg,
      background: `${TOKENS.colors.primary}05`,
      borderRadius: TOKENS.effects.borderRadius,
      border: `1px solid ${TOKENS.colors.border}`
    }}>
      {/* Nature badge */}
      {state.nature && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: TOKENS.spacing.xs,
          padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
          background: `${TOKENS.colors.nature[state.nature]}15`,
          borderRadius: '12px',
          fontSize: '12px',
          color: TOKENS.colors.nature[state.nature],
          marginBottom: TOKENS.spacing.md
        }}>
          {DECISION_NATURE_SYMBOLS[state.nature]} {DECISION_NATURE_LABELS[state.nature]}
        </div>
      )}

      {/* Title */}
      <div style={{
        ...TOKENS.typography.title,
        color: TOKENS.colors.text.primary,
        marginBottom: TOKENS.spacing.sm
      }}>
        {state.title || '(No title)'}
      </div>

      {/* Statement */}
      <div style={{
        ...TOKENS.typography.statement,
        color: TOKENS.colors.text.secondary,
        marginBottom: TOKENS.spacing.md
      }}>
        {state.statement || '(No statement)'}
      </div>

      {/* Certainty */}
      {state.certainty && (
        <div style={{
          fontSize: '13px',
          color: TOKENS.colors.text.muted
        }}>
          Certainty: <span style={{ color: TOKENS.colors.certainty[state.certainty] }}>
            {state.certainty} {CERTAINTY_INDICATORS[state.certainty]}
          </span>
        </div>
      )}

      {/* Tags */}
      {state.tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: TOKENS.spacing.xs,
          marginTop: TOKENS.spacing.sm
        }}>
          {state.tags.map(tag => (
            <span key={tag} style={{
              padding: `2px ${TOKENS.spacing.sm}`,
              background: TOKENS.colors.background,
              borderRadius: '12px',
              fontSize: '11px',
              color: TOKENS.colors.text.muted
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>

    {!state.statement && (
      <div style={{
        marginTop: TOKENS.spacing.md,
        padding: TOKENS.spacing.md,
        background: '#FFF3E0',
        borderRadius: TOKENS.effects.borderRadius,
        fontSize: '13px',
        color: '#E65100'
      }}>
        A decision statement is needed to crystallize.
      </div>
    )}
  </div>
);

// ============================================================================
// DRIFT NOTICE COMPONENT
// ============================================================================

interface DriftNoticeProps {
  drift: DecisionDrift;
  decision: DecisionEntry;
  onAcknowledge: () => void;
  onDismiss: () => void;
  onViewDecision: () => void;
}

/**
 * DriftNotice — Gentle notification of potential misalignment
 * 
 * NO judgment. Simply visibility.
 * Human decides what to do with this information.
 */
export const DriftNotice: React.FC<DriftNoticeProps> = ({
  drift,
  decision,
  onAcknowledge,
  onDismiss,
  onViewDecision
}) => {
  return (
    <div style={{
      padding: TOKENS.spacing.md,
      background: '#FFF8E1',
      border: `1px solid #FFE082`,
      borderRadius: TOKENS.effects.borderRadius,
      marginBottom: TOKENS.spacing.md
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: TOKENS.spacing.sm
      }}>
        <span style={{ fontSize: '18px' }}>◐</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 500,
            color: TOKENS.colors.text.primary,
            marginBottom: TOKENS.spacing.xs
          }}>
            Potential drift from: {decision.title}
          </div>
          <div style={{
            fontSize: '13px',
            color: TOKENS.colors.text.secondary,
            marginBottom: TOKENS.spacing.sm
          }}>
            {drift.description}
          </div>
          <div style={{
            display: 'flex',
            gap: TOKENS.spacing.sm
          }}>
            <button
              onClick={onViewDecision}
              style={{
                padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                border: `1px solid ${TOKENS.colors.border}`,
                borderRadius: TOKENS.effects.borderRadius,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                color: TOKENS.colors.text.secondary
              }}
            >
              View Decision
            </button>
            <button
              onClick={onAcknowledge}
              style={{
                padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                border: `1px solid #FFB300`,
                borderRadius: TOKENS.effects.borderRadius,
                background: '#FFF8E1',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#FF8F00'
              }}
            >
              Acknowledge
            </button>
            <button
              onClick={onDismiss}
              style={{
                padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                color: TOKENS.colors.text.muted
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EMERGING DECISIONS COMPONENT
// ============================================================================

interface EmergingDecisionsProps {
  decisions: EmergingDecision[];
  onSelect: (id: string) => void;
  onCrystallize: (id: string) => void;
}

/**
 * EmergingDecisions — Decisions not yet crystallized
 * 
 * A space for decisions that are forming.
 * NO pressure to crystallize.
 */
export const EmergingDecisions: React.FC<EmergingDecisionsProps> = ({
  decisions,
  onSelect,
  onCrystallize
}) => {
  if (decisions.length === 0) {
    return (
      <div style={{
        padding: TOKENS.spacing.xl,
        textAlign: 'center',
        color: TOKENS.colors.text.muted
      }}>
        No emerging decisions.
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: TOKENS.spacing.sm
    }}>
      {decisions.map(decision => (
        <div
          key={decision.id}
          onClick={() => onSelect(decision.id)}
          style={{
            padding: TOKENS.spacing.md,
            background: `${TOKENS.colors.state.emerging}10`,
            border: `1px dashed ${TOKENS.colors.state.emerging}`,
            borderRadius: TOKENS.effects.borderRadius,
            cursor: 'pointer'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: TOKENS.spacing.sm
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: TOKENS.spacing.xs
            }}>
              <span style={{ color: TOKENS.colors.state.emerging }}>◎</span>
              <span style={{
                fontWeight: 500,
                color: TOKENS.colors.text.primary
              }}>
                {decision.working_title}
              </span>
            </div>
            {decision.tentative_nature && (
              <span style={{
                fontSize: '12px',
                color: TOKENS.colors.text.muted
              }}>
                {DECISION_NATURE_SYMBOLS[decision.tentative_nature]}
              </span>
            )}
          </div>
          
          {decision.current_thinking && (
            <div style={{
              fontSize: '13px',
              color: TOKENS.colors.text.secondary,
              marginBottom: TOKENS.spacing.sm
            }}>
              {decision.current_thinking}
            </div>
          )}

          {decision.options.length > 0 && (
            <div style={{
              fontSize: '12px',
              color: TOKENS.colors.text.muted
            }}>
              {decision.options.length} option{decision.options.length !== 1 ? 's' : ''} being considered
            </div>
          )}

          <button
            onClick={e => {
              e.stopPropagation();
              onCrystallize(decision.id);
            }}
            style={{
              marginTop: TOKENS.spacing.sm,
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              border: `1px solid ${TOKENS.colors.primary}`,
              borderRadius: TOKENS.effects.borderRadius,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '12px',
              color: TOKENS.colors.primary
            }}
          >
            Ready to crystallize →
          </button>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN DECISION CRYSTALLIZER COMPONENT
// ============================================================================

interface DecisionCrystallizerProps {
  /** Current UI state */
  uiState: {
    view: 'list' | 'detail' | 'emerging' | 'create';
    selected_decision_id?: string;
    filters: DecisionFilters;
    sort: DecisionSortOption;
    show_emerging: boolean;
    show_drift_notices: boolean;
  };
  
  /** Crystallized decisions */
  decisions: DecisionEntry[];
  
  /** Emerging decisions */
  emerging: EmergingDecision[];
  
  /** Active drift notices */
  drifts: DecisionDrift[];
  
  /** Creation state (if creating) */
  creationState?: DecisionCreationState;
  
  /** Callbacks */
  onUIStateChange: (state: unknown) => void;
  onSelectDecision: (id: string) => void;
  onStartCreate: () => void;
  onCreationStateChange: (state: DecisionCreationState) => void;
  onCrystallize: () => void;
  onCancelCreate: () => void;
  onEditDecision: (id: string) => void;
  onRevisitDecision: (id: string) => void;
  onAcknowledgeDrift: (driftId: string) => void;
  onDismissDrift: (driftId: string) => void;
  onCrystallizeEmerging: (id: string) => void;
}

/**
 * DecisionCrystallizer — Main orchestrating component
 * 
 * Provides complete decision crystallization experience.
 */
export const DecisionCrystallizer: React.FC<DecisionCrystallizerProps> = ({
  uiState,
  decisions,
  emerging,
  drifts,
  creationState,
  onUIStateChange,
  onSelectDecision,
  onStartCreate,
  onCreationStateChange,
  onCrystallize,
  onCancelCreate,
  onEditDecision,
  onRevisitDecision,
  onAcknowledgeDrift,
  onDismissDrift,
  onCrystallizeEmerging
}) => {
  const selectedDecision = useMemo(() => 
    decisions.find(d => d.id === uiState.selected_decision_id),
    [decisions, uiState.selected_decision_id]
  );

  const relatedDecisions = useMemo(() => {
    if (!selectedDecision) return [];
    return decisions.filter(d => 
      selectedDecision.related_decisions.includes(d.id)
    );
  }, [decisions, selectedDecision]);

  // Filter and sort decisions
  const filteredDecisions = useMemo(() => {
    let result = [...decisions];

    // Apply filters
    if (uiState.filters.natures?.length) {
      result = result.filter(d => uiState.filters.natures!.includes(d.nature));
    }
    if (uiState.filters.states?.length) {
      result = result.filter(d => uiState.filters.states!.includes(d.state));
    }
    if (uiState.filters.search) {
      const search = uiState.filters.search.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(search) ||
        d.statement.toLowerCase().includes(search)
      );
    }

    // Apply sort
    switch (uiState.sort) {
      case 'recent_first':
        result.sort((a, b) => new Date(b.crystallized_at).getTime() - new Date(a.crystallized_at).getTime());
        break;
      case 'oldest_first':
        result.sort((a, b) => new Date(a.crystallized_at).getTime() - new Date(b.crystallized_at).getTime());
        break;
      case 'by_nature':
        result.sort((a, b) => a.nature.localeCompare(b.nature));
        break;
      case 'by_state':
        result.sort((a, b) => a.state.localeCompare(b.state));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [decisions, uiState.filters, uiState.sort]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: TOKENS.colors.background
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: TOKENS.spacing.md,
        borderBottom: `1px solid ${TOKENS.colors.border}`,
        background: TOKENS.colors.surface
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: TOKENS.spacing.sm
        }}>
          <span style={{ fontSize: '20px', color: TOKENS.colors.primary }}>◆</span>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: TOKENS.colors.text.primary
          }}>
            Decision Crystallizer
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: TOKENS.spacing.sm }}>
          {/* Toggle emerging */}
          <button
            onClick={() => onUIStateChange({
              ...uiState,
              view: uiState.view === 'emerging' ? 'list' : 'emerging'
            })}
            style={{
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.sm}`,
              border: `1px solid ${uiState.view === 'emerging' ? TOKENS.colors.state.emerging : TOKENS.colors.border}`,
              borderRadius: TOKENS.effects.borderRadius,
              background: uiState.view === 'emerging' ? `${TOKENS.colors.state.emerging}15` : 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              color: uiState.view === 'emerging' ? TOKENS.colors.state.emerging : TOKENS.colors.text.secondary
            }}
          >
            Emerging ({emerging.length})
          </button>
          
          {/* Create button */}
          <button
            onClick={onStartCreate}
            style={{
              padding: `${TOKENS.spacing.xs} ${TOKENS.spacing.md}`,
              border: 'none',
              borderRadius: TOKENS.effects.borderRadius,
              background: TOKENS.colors.primary,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#FFFFFF'
            }}
          >
            + New Decision
          </button>
        </div>
      </div>

      {/* Drift notices */}
      {uiState.show_drift_notices && drifts.filter(d => d.status === 'unacknowledged').length > 0 && (
        <div style={{ padding: TOKENS.spacing.md, paddingBottom: 0 }}>
          {drifts.filter(d => d.status === 'unacknowledged').map(drift => {
            const decision = decisions.find(d => d.id === drift.decision_id);
            if (!decision) return null;
            return (
              <DriftNotice
                key={drift.decision_id + drift.detected_at}
                drift={drift}
                decision={decision}
                onAcknowledge={() => onAcknowledgeDrift(drift.decision_id)}
                onDismiss={() => onDismissDrift(drift.decision_id)}
                onViewDecision={() => onSelectDecision(drift.decision_id)}
              />
            );
          })}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {uiState.view === 'create' && creationState ? (
          <DecisionCreation
            state={creationState}
            onStateChange={onCreationStateChange}
            onCancel={onCancelCreate}
            onCrystallize={onCrystallize}
          />
        ) : uiState.view === 'detail' && selectedDecision ? (
          <DecisionView
            decision={selectedDecision}
            onClose={() => onUIStateChange({ ...uiState, view: 'list', selected_decision_id: undefined })}
            onEdit={() => onEditDecision(selectedDecision.id)}
            onRevisit={() => onRevisitDecision(selectedDecision.id)}
            relatedDecisions={relatedDecisions}
          />
        ) : uiState.view === 'emerging' ? (
          <div style={{ padding: TOKENS.spacing.md }}>
            <EmergingDecisions
              decisions={emerging}
              onSelect={id => {}}
              onCrystallize={onCrystallizeEmerging}
            />
          </div>
        ) : (
          <DecisionList
            decisions={filteredDecisions}
            filters={uiState.filters}
            sort={uiState.sort}
            selectedId={uiState.selected_decision_id}
            onSelectDecision={id => {
              onSelectDecision(id);
              onUIStateChange({ ...uiState, view: 'detail', selected_decision_id: id });
            }}
            onFilterChange={filters => onUIStateChange({ ...uiState, filters })}
            onSortChange={sort => onUIStateChange({ ...uiState, sort })}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  DecisionList,
  DecisionCard,
  DecisionView,
  DecisionCreation,
  DriftNotice,
  EmergingDecisions
};

export default DecisionCrystallizer;
