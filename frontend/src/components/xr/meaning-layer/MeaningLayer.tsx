/**
 * CHE·NU™ Meaning Layer — Main Components
 * 
 * UI for capturing, viewing, and reflecting on human-authored meaning.
 * 
 * Core principles:
 * - Meaning is DECLARED, never inferred
 * - Agents may read, never write
 * - Calm, reflective design
 * - No persuasion or optimization
 * 
 * @module meaning-layer
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  MeaningEntry,
  MeaningSummary,
  MeaningType,
  MeaningScope,
  MeaningStability,
  MeaningState,
  MeaningConflict,
  MeaningCreationForm,
  LinkedEntity,
  MeaningPromptContext,
  ReviewReminder,
  MEANING_TYPE_META,
  MEANING_SCOPE_META,
  MEANING_STABILITY_META,
  MEANING_STATE_META,
  MEANING_COLORS,
  DEFAULT_REVIEW_REMINDER,
} from './meaning-layer.types';

// ============================================================================
// Shared Styles
// ============================================================================

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#E8E6E3',
    backgroundColor: '#0a0a0f',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    border: `1px solid ${MEANING_COLORS.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E8E6E3',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E8E6E3',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical' as const,
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 500,
  },
};

// ============================================================================
// MeaningList — List of meaning entries
// ============================================================================

interface MeaningListProps {
  userId: string;
  onSelect?: (meaning: MeaningSummary) => void;
  onCreateNew?: () => void;
}

export const MeaningList: React.FC<MeaningListProps> = ({
  userId,
  onSelect,
  onCreateNew,
}) => {
  const [filter, setFilter] = useState<{
    type: MeaningType | 'all';
    state: MeaningState | 'all';
    search: string;
  }>({
    type: 'all',
    state: 'active',
    search: '',
  });

  // Mock data - would come from hook
  const meanings: MeaningSummary[] = [
    {
      id: 'meaning_001',
      title: 'Technology for Connection',
      statement: 'I want technology to reduce isolation, not increase it.',
      type: 'value',
      scope: 'personal',
      stability: 'foundational',
      state: 'active',
      linked_count: 3,
      created_at: '2025-12-01T10:00:00Z',
      updated_at: '2025-12-20T15:00:00Z',
    },
    {
      id: 'meaning_002',
      title: 'Work-Life Harmony',
      statement: 'Success includes time for family and personal growth.',
      type: 'purpose',
      scope: 'personal',
      stability: 'foundational',
      state: 'active',
      linked_count: 5,
      created_at: '2025-11-15T09:00:00Z',
      updated_at: '2025-12-15T12:00:00Z',
    },
    {
      id: 'meaning_003',
      title: 'Learning Approach',
      statement: 'Understanding deeply matters more than completing quickly.',
      type: 'intention',
      scope: 'personal',
      stability: 'evolving',
      state: 'active',
      linked_count: 2,
      created_at: '2025-12-10T14:00:00Z',
      updated_at: '2025-12-10T14:00:00Z',
    },
  ];

  const filteredMeanings = useMemo(() => {
    return meanings.filter(m => {
      if (filter.type !== 'all' && m.type !== filter.type) return false;
      if (filter.state !== 'all' && m.state !== filter.state) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return (
          m.statement.toLowerCase().includes(q) ||
          (m.title?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [meanings, filter]);

  const typeCounts = useMemo(() => {
    const counts: Record<MeaningType | 'all', number> = {
      all: meanings.length,
      purpose: 0,
      value: 0,
      intention: 0,
      belief: 0,
      commitment: 0,
    };
    meanings.forEach(m => counts[m.type]++);
    return counts;
  }, [meanings]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: MEANING_COLORS.purpose,
            margin: 0,
          }}>
            ◎ Meaning Layer
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            marginTop: '4px',
          }}>
            Your declared purposes, values, and intentions
          </p>
        </div>
        <button
          onClick={onCreateNew}
          style={{
            ...styles.button,
            backgroundColor: MEANING_COLORS.purpose,
            color: '#0a0a0f',
          }}
        >
          + Add Meaning
        </button>
      </div>

      {/* Type filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        {(['all', 'purpose', 'value', 'intention', 'belief', 'commitment'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(f => ({ ...f, type }))}
            style={{
              ...styles.button,
              padding: '8px 16px',
              backgroundColor: filter.type === type
                ? (type === 'all' ? 'rgba(255, 255, 255, 0.2)' : MEANING_TYPE_META[type as MeaningType]?.color || '#fff')
                : 'transparent',
              color: filter.type === type && type !== 'all' ? '#0a0a0f' : '#E8E6E3',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {type === 'all' ? 'All' : MEANING_TYPE_META[type].icon} {type === 'all' ? '' : MEANING_TYPE_META[type].label}
            <span style={{ marginLeft: '6px', opacity: 0.7 }}>
              ({typeCounts[type]})
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search meanings..."
        value={filter.search}
        onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        style={{ ...styles.input, marginBottom: '20px' }}
      />

      {/* Meaning cards */}
      <div>
        {filteredMeanings.map(meaning => (
          <MeaningCard
            key={meaning.id}
            meaning={meaning}
            onClick={() => onSelect?.(meaning)}
          />
        ))}
        {filteredMeanings.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            No meanings found. Would you like to add one?
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MeaningCard — Single meaning entry card
// ============================================================================

interface MeaningCardProps {
  meaning: MeaningSummary;
  onClick?: () => void;
}

export const MeaningCard: React.FC<MeaningCardProps> = ({ meaning, onClick }) => {
  const typeMeta = MEANING_TYPE_META[meaning.type];
  const stabilityMeta = MEANING_STABILITY_META[meaning.stability];
  const stateMeta = MEANING_STATE_META[meaning.state];

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        borderLeftWidth: '4px',
        borderLeftColor: typeMeta.color,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = MEANING_COLORS.hoverBackground;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(20, 20, 30, 0.9)';
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div>
          <span style={{
            color: typeMeta.color,
            fontSize: '16px',
            marginRight: '8px',
          }}>
            {typeMeta.icon}
          </span>
          <span style={{
            color: typeMeta.color,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {typeMeta.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: `${stabilityMeta.color}20`,
            color: stabilityMeta.color,
          }}>
            {stabilityMeta.label}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: `${stateMeta.color}20`,
            color: stateMeta.color,
          }}>
            {stateMeta.label}
          </span>
        </div>
      </div>

      {/* Title */}
      {meaning.title && (
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#E8E6E3',
          margin: '0 0 8px 0',
        }}>
          {meaning.title}
        </h3>
      )}

      {/* Statement */}
      <p style={{
        fontSize: '15px',
        lineHeight: 1.6,
        color: 'rgba(255, 255, 255, 0.85)',
        margin: 0,
        fontStyle: 'italic',
      }}>
        "{meaning.statement}"
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
      }}>
        <span>
          Linked to {meaning.linked_count} {meaning.linked_count === 1 ? 'entity' : 'entities'}
        </span>
        <span>
          Updated {new Date(meaning.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// MeaningView — Detailed view of a meaning entry
// ============================================================================

interface MeaningViewProps {
  meaningId: string;
  onBack?: () => void;
  onEdit?: () => void;
}

export const MeaningView: React.FC<MeaningViewProps> = ({
  meaningId,
  onBack,
  onEdit,
}) => {
  // Mock data - would come from hook
  const meaning: MeaningEntry = {
    id: meaningId,
    author: 'user_001',
    author_name: 'Jonathan',
    created_at: '2025-12-01T10:00:00Z',
    updated_at: '2025-12-20T15:00:00Z',
    title: 'Technology for Connection',
    statement: 'I want technology to reduce isolation, not increase it. Every tool I build or use should bring people closer together, not create more distance. Digital should enhance human connection, not replace it.',
    type: 'value',
    scope: 'personal',
    stability: 'foundational',
    state: 'active',
    linked_entities: [
      { entity_type: 'thread', entity_id: 'thread_001', entity_name: 'XR Collaboration Research', linked_at: '2025-12-05T10:00:00Z' },
      { entity_type: 'decision', entity_id: 'decision_001', entity_name: 'Choose collaboration platform', linked_at: '2025-12-10T14:00:00Z' },
      { entity_type: 'project', entity_id: 'project_001', entity_name: 'CHE·NU Development', linked_at: '2025-12-01T10:00:00Z' },
    ],
    review_reminder: { enabled: true, frequency: 'quarterly', next_review: '2026-03-01T00:00:00Z' },
    revisions: [
      {
        revision: 1,
        timestamp: '2025-12-20T15:00:00Z',
        previous_statement: 'Technology should reduce isolation.',
        new_statement: 'I want technology to reduce isolation, not increase it.',
        change_reason: 'Made it more personal and actionable',
      },
    ],
    tags: ['technology', 'values', 'connection'],
  };

  const typeMeta = MEANING_TYPE_META[meaning.type];
  const scopeMeta = MEANING_SCOPE_META[meaning.scope];
  const stabilityMeta = MEANING_STABILITY_META[meaning.stability];
  const stateMeta = MEANING_STATE_META[meaning.state];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <button
          onClick={onBack}
          style={{
            ...styles.button,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#E8E6E3',
          }}
        >
          ← Back to Meanings
        </button>
        <button
          onClick={onEdit}
          style={{
            ...styles.button,
            backgroundColor: MEANING_COLORS.purpose,
            color: '#0a0a0f',
          }}
        >
          Edit Meaning
        </button>
      </div>

      {/* Main card */}
      <div style={{
        ...styles.card,
        borderLeftWidth: '4px',
        borderLeftColor: typeMeta.color,
      }}>
        {/* Type badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '24px',
            color: typeMeta.color,
          }}>
            {typeMeta.icon}
          </span>
          <span style={{
            color: typeMeta.color,
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {typeMeta.label}
          </span>
        </div>

        {/* Title */}
        {meaning.title && (
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#E8E6E3',
            margin: '0 0 16px 0',
          }}>
            {meaning.title}
          </h1>
        )}

        {/* Statement */}
        <blockquote style={{
          fontSize: '18px',
          lineHeight: 1.7,
          color: 'rgba(255, 255, 255, 0.9)',
          margin: '0 0 24px 0',
          padding: '20px',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '8px',
          fontStyle: 'italic',
        }}>
          "{meaning.statement}"
        </blockquote>

        {/* Metadata */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div>
            <div style={styles.label}>Scope</div>
            <div style={{ color: '#E8E6E3' }}>{scopeMeta.icon} {scopeMeta.label}</div>
          </div>
          <div>
            <div style={styles.label}>Stability</div>
            <div style={{ color: stabilityMeta.color }}>{stabilityMeta.label}</div>
          </div>
          <div>
            <div style={styles.label}>State</div>
            <div style={{ color: stateMeta.color }}>{stateMeta.label}</div>
          </div>
          <div>
            <div style={styles.label}>Review</div>
            <div style={{ color: '#E8E6E3' }}>
              {meaning.review_reminder.enabled 
                ? `Every ${meaning.review_reminder.frequency}`
                : 'Not scheduled'}
            </div>
          </div>
        </div>

        {/* Tags */}
        {meaning.tags && meaning.tags.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={styles.label}>Tags</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {meaning.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Linked Entities */}
      <div style={styles.card}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#E8E6E3',
          margin: '0 0 16px 0',
        }}>
          Linked Entities ({meaning.linked_entities.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {meaning.linked_entities.map(entity => (
            <div
              key={entity.entity_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'rgba(30, 30, 40, 0.8)',
                borderRadius: '8px',
              }}
            >
              <div>
                <span style={{
                  color: MEANING_COLORS.purpose,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginRight: '8px',
                }}>
                  {entity.entity_type}
                </span>
                <span style={{ color: '#E8E6E3' }}>{entity.entity_name}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Linked {new Date(entity.linked_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revision History */}
      {meaning.revisions.length > 0 && (
        <div style={styles.card}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#E8E6E3',
            margin: '0 0 16px 0',
          }}>
            Evolution History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {meaning.revisions.map(rev => (
              <div
                key={rev.revision}
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(30, 30, 40, 0.8)',
                  borderRadius: '8px',
                  borderLeft: '3px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  <span>Revision {rev.revision}</span>
                  <span>{new Date(rev.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>Before: </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                    "{rev.previous_statement}"
                  </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: MEANING_COLORS.active, fontSize: '13px' }}>After: </span>
                  <span style={{ color: '#E8E6E3', fontStyle: 'italic' }}>
                    "{rev.new_statement}"
                  </span>
                </div>
                {rev.change_reason && (
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    Reason: {rev.change_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit info */}
      <div style={{
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: '24px',
      }}>
        Created by {meaning.author_name} on {new Date(meaning.created_at).toLocaleDateString()}
        <br />
        Last updated {new Date(meaning.updated_at).toLocaleDateString()}
      </div>
    </div>
  );
};

// ============================================================================
// MeaningCreation — Create new meaning entry
// ============================================================================

interface MeaningCreationProps {
  userId: string;
  prefill?: Partial<MeaningCreationForm>;
  linkedEntity?: LinkedEntity;
  onSuccess?: (meaning: MeaningEntry) => void;
  onCancel?: () => void;
}

export const MeaningCreation: React.FC<MeaningCreationProps> = ({
  userId,
  prefill,
  linkedEntity,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState<MeaningCreationForm>({
    title: prefill?.title || '',
    statement: prefill?.statement || '',
    type: prefill?.type || 'purpose',
    scope: prefill?.scope || 'personal',
    stability: prefill?.stability || 'evolving',
    linked_entities: linkedEntity ? [linkedEntity] : (prefill?.linked_entities || []),
    review_reminder: prefill?.review_reminder || DEFAULT_REVIEW_REMINDER,
    tags: prefill?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.statement.trim()) return;
    
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMeaning: MeaningEntry = {
      id: `meaning_${Date.now()}`,
      author: userId,
      author_name: 'You',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: form.title || undefined,
      statement: form.statement,
      type: form.type,
      scope: form.scope,
      stability: form.stability,
      state: 'active',
      linked_entities: form.linked_entities,
      review_reminder: form.review_reminder,
      revisions: [],
      tags: form.tags,
    };
    
    setIsSubmitting(false);
    onSuccess?.(newMeaning);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...(f.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags?.filter(t => t !== tag) || [] }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: MEANING_COLORS.purpose,
          margin: '0 0 24px 0',
        }}>
          ◎ Add Meaning
        </h2>

        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px',
          marginBottom: '24px',
          lineHeight: 1.6,
        }}>
          Meaning entries are your explicit declarations of purpose, value, or intention.
          They are never inferred or generated — only you can write them.
        </p>

        {/* Type selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>What type of meaning is this?</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(Object.keys(MEANING_TYPE_META) as MeaningType[]).map(type => {
              const meta = MEANING_TYPE_META[type];
              return (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, type }))}
                  style={{
                    ...styles.button,
                    padding: '10px 16px',
                    backgroundColor: form.type === type ? meta.color : 'transparent',
                    color: form.type === type ? '#0a0a0f' : '#E8E6E3',
                    border: `1px solid ${form.type === type ? meta.color : 'rgba(255, 255, 255, 0.2)'}`,
                  }}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '8px',
          }}>
            {MEANING_TYPE_META[form.type].description}
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Title (optional)</label>
          <input
            type="text"
            placeholder="A brief name for this meaning..."
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={styles.input}
          />
        </div>

        {/* Statement */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>
            Your Statement *
            <span style={{ fontWeight: 400, marginLeft: '8px' }}>
              {MEANING_TYPE_META[form.type].prompt}
            </span>
          </label>
          <textarea
            placeholder="Write in your own words..."
            value={form.statement}
            onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
            style={styles.textarea}
          />
        </div>

        {/* Stability */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>How stable is this meaning?</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(Object.keys(MEANING_STABILITY_META) as MeaningStability[]).map(stability => {
              const meta = MEANING_STABILITY_META[stability];
              return (
                <button
                  key={stability}
                  onClick={() => setForm(f => ({ ...f, stability }))}
                  style={{
                    ...styles.button,
                    flex: 1,
                    backgroundColor: form.stability === stability ? meta.color : 'transparent',
                    color: form.stability === stability ? '#0a0a0f' : '#E8E6E3',
                    border: `1px solid ${form.stability === stability ? meta.color : 'rgba(255, 255, 255, 0.2)'}`,
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>Tags (optional)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              style={{ ...styles.input, flex: 1 }}
            />
            <button
              onClick={addTag}
              style={{
                ...styles.button,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#E8E6E3',
              }}
            >
              Add
            </button>
          </div>
          {form.tags && form.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {form.tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                  }}
                >
                  #{tag} ×
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Linked entity preview */}
        {form.linked_entities.length > 0 && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '8px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
              Will be linked to:
            </div>
            {form.linked_entities.map(entity => (
              <div key={entity.entity_id} style={{ color: '#E8E6E3', fontSize: '14px' }}>
                {entity.entity_type}: {entity.entity_name}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              ...styles.button,
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#E8E6E3',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.statement.trim() || isSubmitting}
            style={{
              ...styles.button,
              backgroundColor: form.statement.trim() ? MEANING_COLORS.purpose : 'rgba(255, 255, 255, 0.1)',
              color: form.statement.trim() ? '#0a0a0f' : 'rgba(255, 255, 255, 0.5)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Meaning'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MeaningPrompt — Agent prompt for adding meaning
// ============================================================================

interface MeaningPromptProps {
  context: MeaningPromptContext;
  onAccept: () => void;
  onDismiss: () => void;
}

export const MeaningPrompt: React.FC<MeaningPromptProps> = ({
  context,
  onAccept,
  onDismiss,
}) => {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      border: `1px solid ${MEANING_COLORS.border}`,
      borderRadius: '12px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <span style={{ fontSize: '20px', color: MEANING_COLORS.purpose }}>◎</span>
        <div style={{ flex: 1 }}>
          <p style={{
            color: '#E8E6E3',
            fontSize: '14px',
            margin: '0 0 8px 0',
            lineHeight: 1.5,
          }}>
            Would you like to add meaning here?
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '13px',
            margin: '0 0 12px 0',
          }}>
            {context.prompt_reason}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onAccept}
              style={{
                ...styles.button,
                padding: '8px 16px',
                backgroundColor: MEANING_COLORS.purpose,
                color: '#0a0a0f',
              }}
            >
              Add Meaning
            </button>
            <button
              onClick={onDismiss}
              style={{
                ...styles.button,
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MeaningConflictBanner — Display meaning conflict
// ============================================================================

interface MeaningConflictBannerProps {
  conflict: MeaningConflict;
  onAcknowledge: (response: MeaningConflict['user_response']) => void;
}

export const MeaningConflictBanner: React.FC<MeaningConflictBannerProps> = ({
  conflict,
  onAcknowledge,
}) => {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: conflict.severity === 'significant' 
        ? 'rgba(239, 68, 68, 0.1)' 
        : 'rgba(245, 158, 11, 0.1)',
      border: `1px solid ${conflict.severity === 'significant' 
        ? MEANING_COLORS.conflictSignificant 
        : MEANING_COLORS.conflictWarning}`,
      borderRadius: '12px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <span style={{ 
          fontSize: '20px', 
          color: conflict.severity === 'significant' 
            ? MEANING_COLORS.conflictSignificant 
            : MEANING_COLORS.conflictWarning,
        }}>
          ⚠
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            color: '#E8E6E3',
            fontSize: '14px',
            fontWeight: 600,
            margin: '0 0 8px 0',
          }}>
            Possible conflict with your stated meaning
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            margin: '0 0 8px 0',
            fontStyle: 'italic',
          }}>
            "{conflict.meaning_statement}"
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '13px',
            margin: '0 0 16px 0',
          }}>
            {conflict.conflict_description}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onAcknowledge('accept_conflict')}
              style={{
                ...styles.button,
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#E8E6E3',
              }}
            >
              Continue Anyway
            </button>
            <button
              onClick={() => onAcknowledge('modify_action')}
              style={{
                ...styles.button,
                padding: '8px 16px',
                backgroundColor: MEANING_COLORS.purpose,
                color: '#0a0a0f',
              }}
            >
              Modify Action
            </button>
            <button
              onClick={() => onAcknowledge('dismiss')}
              style={{
                ...styles.button,
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.5)',
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
