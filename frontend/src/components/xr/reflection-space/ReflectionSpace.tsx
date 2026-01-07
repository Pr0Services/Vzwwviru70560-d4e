/**
 * CHE·NU™ V51 Meta-Layer
 * Reflection Space V1.0 — Main Component
 * 
 * PURPOSE:
 * Provides a protected space for genuine reflection without
 * optimization pressure, productivity guilt, or judgment.
 * 
 * CORE PRINCIPLE:
 * Reflection is SACRED, not productive.
 * The system creates space for thought, never demands output.
 * 
 * COMPONENTS:
 * - ReflectionList: List view of reflections
 * - ReflectionCard: Summary card
 * - ReflectionEditor: Minimal editing space
 * - ReflectionView: Reading view
 * - SpaceEnvironment: The protected space itself
 * - GentlePrompt: Optional prompt display
 * - ReflectionSpace: Main orchestrating component
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type {
  Reflection,
  ReflectionType,
  ReflectionState,
  ReflectionContent,
  ReflectionEntry,
  ReflectionPrivacy,
  ReflectionFilters,
  ReflectionSort,
  ReflectionViewMode,
  ReflectionSpaceUIState,
  ReflectionEditState,
  ReflectionEnvironment,
  ReflectionProtections,
  ReflectionPrompt,
  PromptSettings,
  ReflectionSpark,
  ReflectionConnection,
  ReflectionSummary
} from './reflection-space.types';
import {
  REFLECTION_TYPE_LABELS,
  REFLECTION_TYPE_SYMBOLS,
  REFLECTION_STATE_LABELS,
  REFLECTION_ENTRY_LABELS,
  DEFAULT_REFLECTION_CONTENT,
  DEFAULT_REFLECTION_EDIT_STATE,
  DEFAULT_REFLECTION_ENVIRONMENT,
  DEFAULT_REFLECTION_PROTECTIONS,
  DEFAULT_PROMPT_SETTINGS,
  SAMPLE_REFLECTION_PROMPTS,
  REFLECTION_DESIGN_TOKENS
} from './reflection-space.types';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const { colors, spacing, typography, borders, transitions } = REFLECTION_DESIGN_TOKENS;

/**
 * Type indicator — gentle symbol
 */
interface TypeIndicatorProps {
  type: ReflectionType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TypeIndicator: React.FC<TypeIndicatorProps> = ({
  type,
  size = 'md',
  showLabel = false
}) => {
  const sizeMap = {
    sm: { symbol: '14px', label: typography.fontSizeXs },
    md: { symbol: '18px', label: typography.fontSizeSm },
    lg: { symbol: '24px', label: typography.fontSizeMd }
  };
  
  const color = colors[type as keyof typeof colors] || colors.primary;
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        color: color as string
      }}
    >
      <span style={{ fontSize: sizeMap[size].symbol }}>
        {REFLECTION_TYPE_SYMBOLS[type]}
      </span>
      {showLabel && (
        <span style={{ fontSize: sizeMap[size].label }}>
          {REFLECTION_TYPE_LABELS[type]}
        </span>
      )}
    </span>
  );
};

/**
 * State badge — subtle indicator
 */
interface StateBadgeProps {
  state: ReflectionState;
}

export const StateBadge: React.FC<StateBadgeProps> = ({ state }) => {
  const stateColor = colors[state as keyof typeof colors] || colors.textMuted;
  
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${spacing.xs} ${spacing.sm}`,
        backgroundColor: `${stateColor}15`,
        color: stateColor as string,
        fontSize: typography.fontSizeXs,
        borderRadius: borders.radius,
        fontFamily: typography.fontFamily
      }}
    >
      {REFLECTION_STATE_LABELS[state]}
    </span>
  );
};

/**
 * Privacy indicator — small lock/unlock
 */
interface PrivacyIndicatorProps {
  privacy: ReflectionPrivacy;
}

export const PrivacyIndicator: React.FC<PrivacyIndicatorProps> = ({ privacy }) => {
  const icons: Record<ReflectionPrivacy, string> = {
    private: '🔒',
    sealed: '🔐',
    shared: '👁️'
  };
  
  return (
    <span
      style={{
        fontSize: typography.fontSizeXs,
        opacity: 0.6
      }}
      title={privacy === 'private' ? 'Private' : privacy === 'sealed' ? 'Encrypted' : 'Shared'}
    >
      {icons[privacy]}
    </span>
  );
};

// ============================================================================
// REFLECTION CARD
// ============================================================================

interface ReflectionCardProps {
  reflection: ReflectionSummary;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({
  reflection,
  isSelected,
  onClick
}) => {
  const displayTitle = reflection.title || 
    reflection.preview || 
    `${REFLECTION_TYPE_LABELS[reflection.type]} reflection`;
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: spacing.md,
        backgroundColor: isSelected ? colors.primaryLight + '20' : colors.surface,
        border: `${borders.width} solid ${isSelected ? colors.primary : colors.border}`,
        borderRadius: borders.radius,
        cursor: 'pointer',
        transition: transitions.normal,
        marginBottom: spacing.sm
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.sm
        }}
      >
        <TypeIndicator type={reflection.type} size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <PrivacyIndicator privacy={reflection.privacy} />
          <StateBadge state={reflection.state} />
        </div>
      </div>
      
      {/* Title */}
      <h4
        style={{
          margin: 0,
          fontSize: typography.fontSizeMd,
          fontFamily: typography.fontFamily,
          color: colors.textPrimary,
          fontWeight: 500,
          lineHeight: typography.lineHeightTight
        }}
      >
        {displayTitle}
      </h4>
      
      {/* Preview if exists */}
      {reflection.preview && reflection.title && (
        <p
          style={{
            margin: `${spacing.sm} 0 0 0`,
            fontSize: typography.fontSizeSm,
            color: colors.textSecondary,
            fontStyle: 'italic',
            lineHeight: typography.lineHeightNormal
          }}
        >
          {reflection.preview}
        </p>
      )}
      
      {/* Tags if any */}
      {reflection.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.xs,
            marginTop: spacing.sm
          }}
        >
          {reflection.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              style={{
                fontSize: typography.fontSizeXs,
                color: colors.textMuted,
                backgroundColor: colors.backgroundAlt,
                padding: `2px ${spacing.xs}`,
                borderRadius: '4px'
              }}
            >
              {tag}
            </span>
          ))}
          {reflection.tags.length > 3 && (
            <span style={{ fontSize: typography.fontSizeXs, color: colors.textMuted }}>
              +{reflection.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Timestamp */}
      <div
        style={{
          marginTop: spacing.sm,
          fontSize: typography.fontSizeXs,
          color: colors.textMuted
        }}
      >
        {new Date(reflection.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: reflection.created_at.slice(0, 4) !== new Date().getFullYear().toString() 
            ? 'numeric' 
            : undefined
        })}
      </div>
    </div>
  );
};

// ============================================================================
// REFLECTION LIST
// ============================================================================

interface ReflectionListProps {
  reflections: ReflectionSummary[];
  filters: ReflectionFilters;
  sort: ReflectionSort;
  viewMode: ReflectionViewMode;
  selectedId?: string;
  onSelect: (id: string) => void;
  onFilterChange: (filters: ReflectionFilters) => void;
  onSortChange: (sort: ReflectionSort) => void;
  onEnterSpace: () => void;
}

export const ReflectionList: React.FC<ReflectionListProps> = ({
  reflections,
  filters,
  sort,
  viewMode,
  selectedId,
  onSelect,
  onFilterChange,
  onSortChange,
  onEnterSpace
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  
  // Apply filters
  const filteredReflections = useMemo(() => {
    let result = [...reflections];
    
    if (filters.type && filters.type.length > 0) {
      result = result.filter(r => filters.type!.includes(r.type));
    }
    
    if (filters.state && filters.state.length > 0) {
      result = result.filter(r => filters.state!.includes(r.state));
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(r => 
        filters.tags!.some(tag => r.tags.includes(tag))
      );
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(r =>
        r.title?.toLowerCase().includes(search) ||
        r.preview?.toLowerCase().includes(search) ||
        r.tags.some(t => t.toLowerCase().includes(search))
      );
    }
    
    // Sort
    switch (sort) {
      case 'recent_first':
        result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest_first':
        result.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'recently_updated':
        result.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
      case 'alphabetical':
        result.sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        );
        break;
    }
    
    return result;
  }, [reflections, filters, sort]);
  
  // Handle search
  const handleSearch = useCallback(() => {
    onFilterChange({ ...filters, search: searchValue || undefined });
  }, [filters, searchValue, onFilterChange]);
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: spacing.md,
          borderBottom: `${borders.width} solid ${colors.border}`,
          backgroundColor: colors.surface
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.md
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: typography.fontSizeXl,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
              fontWeight: 400
            }}
          >
            Reflections
          </h2>
          
          <button
            onClick={onEnterSpace}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: colors.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: borders.radius,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSizeSm,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
          >
            <span>◌</span>
            Enter Space
          </button>
        </div>
        
        {/* Search */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search reflections..."
            style={{
              flex: 1,
              padding: spacing.sm,
              border: `${borders.width} solid ${colors.border}`,
              borderRadius: borders.radius,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSizeSm,
              backgroundColor: colors.backgroundAlt
            }}
          />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: spacing.sm,
              backgroundColor: showFilters ? colors.primary + '20' : 'transparent',
              border: `${borders.width} solid ${colors.border}`,
              borderRadius: borders.radius,
              cursor: 'pointer'
            }}
          >
            ⚙️
          </button>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div
            style={{
              marginTop: spacing.md,
              padding: spacing.md,
              backgroundColor: colors.backgroundAlt,
              borderRadius: borders.radius
            }}
          >
            {/* Type filter */}
            <div style={{ marginBottom: spacing.md }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSizeXs,
                  color: colors.textSecondary,
                  marginBottom: spacing.xs
                }}
              >
                Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                {Object.entries(REFLECTION_TYPE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => {
                      const types = filters.type || [];
                      const newTypes = types.includes(type as ReflectionType)
                        ? types.filter(t => t !== type)
                        : [...types, type as ReflectionType];
                      onFilterChange({ ...filters, type: newTypes.length ? newTypes : undefined });
                    }}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      backgroundColor: filters.type?.includes(type as ReflectionType)
                        ? colors.primary + '20'
                        : 'transparent',
                      border: `${borders.width} solid ${colors.border}`,
                      borderRadius: borders.radius,
                      cursor: 'pointer',
                      fontSize: typography.fontSizeXs,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs
                    }}
                  >
                    <TypeIndicator type={type as ReflectionType} size="sm" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* State filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSizeXs,
                  color: colors.textSecondary,
                  marginBottom: spacing.xs
                }}
              >
                State
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                {Object.entries(REFLECTION_STATE_LABELS).map(([state, label]) => (
                  <button
                    key={state}
                    onClick={() => {
                      const states = filters.state || [];
                      const newStates = states.includes(state as ReflectionState)
                        ? states.filter(s => s !== state)
                        : [...states, state as ReflectionState];
                      onFilterChange({ ...filters, state: newStates.length ? newStates : undefined });
                    }}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      backgroundColor: filters.state?.includes(state as ReflectionState)
                        ? colors.primary + '20'
                        : 'transparent',
                      border: `${borders.width} solid ${colors.border}`,
                      borderRadius: borders.radius,
                      cursor: 'pointer',
                      fontSize: typography.fontSizeXs
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: spacing.md
        }}
      >
        {filteredReflections.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: spacing.xxl,
              color: colors.textMuted
            }}
          >
            <p style={{ fontSize: typography.fontSizeLg, marginBottom: spacing.sm }}>
              No reflections yet
            </p>
            <p style={{ fontSize: typography.fontSizeSm }}>
              Enter the space to begin reflecting
            </p>
          </div>
        ) : (
          filteredReflections.map(reflection => (
            <ReflectionCard
              key={reflection.id}
              reflection={reflection}
              isSelected={reflection.id === selectedId}
              onClick={() => onSelect(reflection.id)}
            />
          ))
        )}
      </div>
      
      {/* Count */}
      <div
        style={{
          padding: spacing.sm,
          borderTop: `${borders.width} solid ${colors.border}`,
          fontSize: typography.fontSizeXs,
          color: colors.textMuted,
          textAlign: 'center'
        }}
      >
        {filteredReflections.length} reflection{filteredReflections.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

// ============================================================================
// REFLECTION VIEW
// ============================================================================

interface ReflectionViewProps {
  reflection: Reflection;
  onEdit: () => void;
  onClose: () => void;
  onContinue: () => void;
  onChangeState: (state: ReflectionState) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  reflection,
  onEdit,
  onClose,
  onContinue,
  onChangeState
}) => {
  const displayTitle = reflection.title || REFLECTION_TYPE_LABELS[reflection.type] + ' reflection';
  
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.surface
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing.md,
          borderBottom: `${borders.width} solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: spacing.sm,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: colors.textSecondary,
            fontSize: typography.fontSizeMd
          }}
        >
          ← Back
        </button>
        
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <button
            onClick={onEdit}
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: 'transparent',
              border: `${borders.width} solid ${colors.border}`,
              borderRadius: borders.radius,
              cursor: 'pointer',
              fontSize: typography.fontSizeSm
            }}
          >
            Edit
          </button>
          <button
            onClick={onContinue}
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: borders.radius,
              cursor: 'pointer',
              fontSize: typography.fontSizeSm
            }}
          >
            Continue
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: spacing.lg
        }}
      >
        {/* Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            marginBottom: spacing.md
          }}
        >
          <TypeIndicator type={reflection.type} size="lg" showLabel />
          <PrivacyIndicator privacy={reflection.privacy} />
          <StateBadge state={reflection.state} />
        </div>
        
        {/* Title */}
        <h1
          style={{
            margin: `0 0 ${spacing.lg} 0`,
            fontSize: typography.fontSizeXl,
            fontFamily: typography.fontFamily,
            color: colors.textPrimary,
            fontWeight: 400,
            lineHeight: typography.lineHeightTight
          }}
        >
          {displayTitle}
        </h1>
        
        {/* Main content */}
        {reflection.content.text && (
          <div
            style={{
              fontSize: typography.fontSizeMd,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
              lineHeight: typography.lineHeightRelaxed,
              whiteSpace: 'pre-wrap',
              marginBottom: spacing.lg
            }}
          >
            {reflection.content.text}
          </div>
        )}
        
        {/* Fragments */}
        {reflection.content.fragments && reflection.content.fragments.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <h3
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
                fontWeight: 400
              }}
            >
              Fragments
            </h3>
            {reflection.content.fragments.map((fragment, i) => (
              <div
                key={i}
                style={{
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundAlt,
                  borderRadius: borders.radius,
                  marginBottom: spacing.xs,
                  fontSize: typography.fontSizeSm,
                  fontStyle: 'italic',
                  color: colors.textSecondary
                }}
              >
                {fragment}
              </div>
            ))}
          </div>
        )}
        
        {/* Questions */}
        {reflection.content.questions && reflection.content.questions.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <h3
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
                fontWeight: 400
              }}
            >
              Questions Held
            </h3>
            {reflection.content.questions.map((question, i) => (
              <div
                key={i}
                style={{
                  padding: spacing.sm,
                  borderLeft: `3px solid ${colors.questioning}`,
                  marginBottom: spacing.xs,
                  fontSize: typography.fontSizeSm,
                  color: colors.textPrimary
                }}
              >
                {question}
              </div>
            ))}
          </div>
        )}
        
        {/* Observations */}
        {reflection.content.observations && reflection.content.observations.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <h3
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
                fontWeight: 400
              }}
            >
              Observations
            </h3>
            {reflection.content.observations.map((obs, i) => (
              <div
                key={i}
                style={{
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundAlt,
                  borderRadius: borders.radius,
                  marginBottom: spacing.xs,
                  fontSize: typography.fontSizeSm
                }}
              >
                {obs}
              </div>
            ))}
          </div>
        )}
        
        {/* Feelings */}
        {reflection.content.feelings && reflection.content.feelings.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <h3
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
                fontWeight: 400
              }}
            >
              Feelings Named
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
              {reflection.content.feelings.map((feeling, i) => (
                <span
                  key={i}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    backgroundColor: colors.appreciating + '20',
                    color: colors.appreciating,
                    borderRadius: borders.radius,
                    fontSize: typography.fontSizeSm
                  }}
                >
                  {feeling}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Sparked by */}
        {reflection.sparked_by && (
          <div style={{ marginBottom: spacing.lg }}>
            <h3
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
                fontWeight: 400
              }}
            >
              Sparked By
            </h3>
            <div
              style={{
                padding: spacing.sm,
                backgroundColor: colors.backgroundAlt,
                borderRadius: borders.radius,
                fontSize: typography.fontSizeSm
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>
                {reflection.sparked_by.type}
              </span>
              {reflection.sparked_by.description && (
                <span>: {reflection.sparked_by.description}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {reflection.tags.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
              {reflection.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    backgroundColor: colors.backgroundAlt,
                    color: colors.textSecondary,
                    borderRadius: borders.radius,
                    fontSize: typography.fontSizeXs
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamps */}
        <div
          style={{
            marginTop: spacing.xxl,
            paddingTop: spacing.lg,
            borderTop: `${borders.width} solid ${colors.border}`,
            fontSize: typography.fontSizeXs,
            color: colors.textMuted
          }}
        >
          <p>Created: {new Date(reflection.created_at).toLocaleString()}</p>
          {reflection.updated_at !== reflection.created_at && (
            <p>Updated: {new Date(reflection.updated_at).toLocaleString()}</p>
          )}
        </div>
      </div>
      
      {/* State change footer */}
      <div
        style={{
          padding: spacing.md,
          borderTop: `${borders.width} solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.md
        }}
      >
        {(['open', 'paused', 'resting', 'closed', 'dissolved'] as ReflectionState[]).map(state => (
          <button
            key={state}
            onClick={() => onChangeState(state)}
            disabled={reflection.state === state}
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: reflection.state === state 
                ? colors.primary + '20' 
                : 'transparent',
              border: `${borders.width} solid ${
                reflection.state === state ? colors.primary : colors.border
              }`,
              borderRadius: borders.radius,
              cursor: reflection.state === state ? 'default' : 'pointer',
              fontSize: typography.fontSizeXs,
              color: reflection.state === state ? colors.primary : colors.textSecondary,
              opacity: reflection.state === state ? 1 : 0.7
            }}
          >
            {REFLECTION_STATE_LABELS[state]}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// REFLECTION EDITOR
// ============================================================================

interface ReflectionEditorProps {
  editState: ReflectionEditState;
  onChange: (state: Partial<ReflectionEditState>) => void;
  onSave: () => void;
  onCancel: () => void;
  prompt?: ReflectionPrompt | null;
  onDismissPrompt?: () => void;
}

export const ReflectionEditor: React.FC<ReflectionEditorProps> = ({
  editState,
  onChange,
  onSave,
  onCancel,
  prompt,
  onDismissPrompt
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleContentChange = useCallback((text: string) => {
    onChange({
      content: { ...editState.content, text },
      has_changes: true
    });
  }, [editState.content, onChange]);
  
  const addFragment = useCallback(() => {
    const fragment = prompt ? '' : undefined;
    const fragments = [...(editState.content.fragments || [])];
    if (fragment !== undefined || fragments.length === 0) {
      fragments.push('');
      onChange({
        content: { ...editState.content, fragments },
        has_changes: true
      });
    }
  }, [editState.content, onChange, prompt]);
  
  const updateFragment = useCallback((index: number, value: string) => {
    const fragments = [...(editState.content.fragments || [])];
    fragments[index] = value;
    onChange({
      content: { ...editState.content, fragments },
      has_changes: true
    });
  }, [editState.content, onChange]);
  
  const addQuestion = useCallback(() => {
    const questions = [...(editState.content.questions || []), ''];
    onChange({
      content: { ...editState.content, questions },
      has_changes: true
    });
  }, [editState.content, onChange]);
  
  const updateQuestion = useCallback((index: number, value: string) => {
    const questions = [...(editState.content.questions || [])];
    questions[index] = value;
    onChange({
      content: { ...editState.content, questions },
      has_changes: true
    });
  }, [editState.content, onChange]);
  
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background
      }}
    >
      {/* Minimal header */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: spacing.sm,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: colors.textSecondary,
            fontSize: typography.fontSizeSm
          }}
        >
          Cancel
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {/* Type selector */}
          <select
            value={editState.type}
            onChange={(e) => onChange({ type: e.target.value as ReflectionType })}
            style={{
              padding: spacing.sm,
              border: `${borders.width} solid ${colors.border}`,
              borderRadius: borders.radius,
              backgroundColor: colors.surface,
              fontSize: typography.fontSizeSm,
              fontFamily: typography.fontFamily
            }}
          >
            {Object.entries(REFLECTION_TYPE_LABELS).map(([type, label]) => (
              <option key={type} value={type}>
                {REFLECTION_TYPE_SYMBOLS[type as ReflectionType]} {label}
              </option>
            ))}
          </select>
          
          <button
            onClick={onSave}
            disabled={!editState.has_changes}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: editState.has_changes ? colors.primary : colors.border,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: borders.radius,
              cursor: editState.has_changes ? 'pointer' : 'default',
              fontSize: typography.fontSizeSm
            }}
          >
            {editState.is_new ? 'Save' : 'Update'}
          </button>
        </div>
      </div>
      
      {/* Prompt (if showing) */}
      {prompt && (
        <div
          style={{
            margin: `0 ${spacing.lg}`,
            padding: spacing.md,
            backgroundColor: colors.primaryLight + '20',
            borderRadius: borders.radius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <p
            style={{
              margin: 0,
              fontStyle: 'italic',
              color: colors.textSecondary,
              fontSize: typography.fontSizeMd
            }}
          >
            "{prompt.text}"
          </p>
          {onDismissPrompt && (
            <button
              onClick={onDismissPrompt}
              style={{
                padding: spacing.xs,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.textMuted,
                fontSize: typography.fontSizeXs
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}
      
      {/* Main content area */}
      <div
        style={{
          flex: 1,
          padding: spacing.lg,
          overflowY: 'auto'
        }}
      >
        {/* Optional title */}
        <input
          type="text"
          value={editState.title || ''}
          onChange={(e) => onChange({ title: e.target.value || undefined, has_changes: true })}
          placeholder="Title (optional)"
          style={{
            width: '100%',
            padding: spacing.sm,
            border: 'none',
            borderBottom: `${borders.width} solid ${colors.border}`,
            backgroundColor: 'transparent',
            fontSize: typography.fontSizeLg,
            fontFamily: typography.fontFamily,
            color: colors.textPrimary,
            marginBottom: spacing.lg
          }}
        />
        
        {/* Main text area */}
        <textarea
          ref={textareaRef}
          value={editState.content.text}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write freely, or leave empty..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: spacing.md,
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: typography.fontSizeMd,
            fontFamily: typography.fontFamily,
            color: colors.textPrimary,
            lineHeight: typography.lineHeightRelaxed,
            resize: 'none'
          }}
        />
        
        {/* Fragments section */}
        <div style={{ marginTop: spacing.lg }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.sm
            }}
          >
            <span
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary
              }}
            >
              Fragments (disconnected thoughts)
            </span>
            <button
              onClick={addFragment}
              style={{
                padding: spacing.xs,
                backgroundColor: 'transparent',
                border: `${borders.width} solid ${colors.border}`,
                borderRadius: borders.radius,
                cursor: 'pointer',
                fontSize: typography.fontSizeXs
              }}
            >
              + Add
            </button>
          </div>
          
          {editState.content.fragments?.map((fragment, i) => (
            <input
              key={i}
              type="text"
              value={fragment}
              onChange={(e) => updateFragment(i, e.target.value)}
              placeholder="A thought..."
              style={{
                width: '100%',
                padding: spacing.sm,
                marginBottom: spacing.xs,
                border: `${borders.width} solid ${colors.border}`,
                borderRadius: borders.radius,
                backgroundColor: colors.backgroundAlt,
                fontSize: typography.fontSizeSm,
                fontStyle: 'italic'
              }}
            />
          ))}
        </div>
        
        {/* Questions section */}
        <div style={{ marginTop: spacing.lg }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.sm
            }}
          >
            <span
              style={{
                fontSize: typography.fontSizeSm,
                color: colors.textSecondary
              }}
            >
              Questions (held, not needing answers)
            </span>
            <button
              onClick={addQuestion}
              style={{
                padding: spacing.xs,
                backgroundColor: 'transparent',
                border: `${borders.width} solid ${colors.border}`,
                borderRadius: borders.radius,
                cursor: 'pointer',
                fontSize: typography.fontSizeXs
              }}
            >
              + Add
            </button>
          </div>
          
          {editState.content.questions?.map((question, i) => (
            <input
              key={i}
              type="text"
              value={question}
              onChange={(e) => updateQuestion(i, e.target.value)}
              placeholder="A question..."
              style={{
                width: '100%',
                padding: spacing.sm,
                marginBottom: spacing.xs,
                border: 'none',
                borderLeft: `3px solid ${colors.questioning}`,
                backgroundColor: colors.backgroundAlt,
                fontSize: typography.fontSizeSm
              }}
            />
          ))}
        </div>
        
        {/* Tags */}
        <div style={{ marginTop: spacing.lg }}>
          <span
            style={{
              display: 'block',
              fontSize: typography.fontSizeSm,
              color: colors.textSecondary,
              marginBottom: spacing.sm
            }}
          >
            Tags (optional)
          </span>
          <input
            type="text"
            value={editState.tags.join(', ')}
            onChange={(e) => onChange({
              tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
              has_changes: true
            })}
            placeholder="comma, separated, tags"
            style={{
              width: '100%',
              padding: spacing.sm,
              border: `${borders.width} solid ${colors.border}`,
              borderRadius: borders.radius,
              backgroundColor: colors.backgroundAlt,
              fontSize: typography.fontSizeSm
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SPACE ENVIRONMENT
// ============================================================================

interface SpaceEnvironmentProps {
  environment: ReflectionEnvironment;
  protections: ReflectionProtections;
  editState: ReflectionEditState;
  prompt?: ReflectionPrompt | null;
  onEditChange: (state: Partial<ReflectionEditState>) => void;
  onSave: () => void;
  onExit: () => void;
  onNewPrompt?: () => void;
  onDismissPrompt?: () => void;
}

export const SpaceEnvironment: React.FC<SpaceEnvironmentProps> = ({
  environment,
  protections,
  editState,
  prompt,
  onEditChange,
  onSave,
  onExit,
  onNewPrompt,
  onDismissPrompt
}) => {
  const [showingTime, setShowingTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time if showing
  useEffect(() => {
    if (environment.show_time) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [environment.show_time]);
  
  // Theme backgrounds
  const themeBackgrounds: Record<string, string> = {
    calm: colors.background,
    minimal: '#FFFFFF',
    warm: '#FDF8F3',
    dark: '#2D2A33',
    custom: environment.custom_background || colors.background
  };
  
  const themeForegrounds: Record<string, string> = {
    calm: colors.textPrimary,
    minimal: '#333333',
    warm: '#4A4040',
    dark: '#E8E4E0',
    custom: colors.textPrimary
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: themeBackgrounds[environment.theme],
        color: themeForegrounds[environment.theme],
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      {/* Minimal top bar */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: 0.6
        }}
      >
        <button
          onClick={onExit}
          style={{
            padding: spacing.sm,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            fontSize: typography.fontSizeSm
          }}
        >
          Exit Space
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {environment.show_time && (
            <span style={{ fontSize: typography.fontSizeSm }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          
          <TypeIndicator type={editState.type} size="sm" />
          
          {editState.has_changes && (
            <button
              onClick={onSave}
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: borders.radius,
                cursor: 'pointer',
                fontSize: typography.fontSizeXs
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>
      
      {/* Prompt area */}
      {prompt && (
        <div
          style={{
            padding: `${spacing.md} ${spacing.xxl}`,
            textAlign: 'center'
          }}
        >
          <p
            style={{
              margin: 0,
              fontStyle: 'italic',
              color: themeForegrounds[environment.theme],
              opacity: 0.7,
              fontSize: typography.fontSizeMd,
              fontFamily: typography.fontFamily
            }}
          >
            "{prompt.text}"
          </p>
          <div style={{ marginTop: spacing.sm }}>
            {onDismissPrompt && (
              <button
                onClick={onDismissPrompt}
                style={{
                  padding: spacing.xs,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  opacity: 0.5,
                  fontSize: typography.fontSizeXs,
                  marginRight: spacing.sm
                }}
              >
                dismiss
              </button>
            )}
            {onNewPrompt && (
              <button
                onClick={onNewPrompt}
                style={{
                  padding: spacing.xs,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  opacity: 0.5,
                  fontSize: typography.fontSizeXs
                }}
              >
                another
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Main reflection area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: `0 ${spacing.xxl}`,
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Optional title */}
        <input
          type="text"
          value={editState.title || ''}
          onChange={(e) => onEditChange({ title: e.target.value || undefined, has_changes: true })}
          placeholder=""
          style={{
            width: '100%',
            padding: spacing.sm,
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: typography.fontSizeXl,
            fontFamily: typography.fontFamily,
            color: 'inherit',
            textAlign: 'center',
            marginBottom: spacing.lg
          }}
        />
        
        {/* Main text area - full height, minimal */}
        <textarea
          value={editState.content.text}
          onChange={(e) => onEditChange({
            content: { ...editState.content, text: e.target.value },
            has_changes: true
          })}
          placeholder=""
          style={{
            flex: 1,
            width: '100%',
            padding: spacing.md,
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: typography.fontSizeLg,
            fontFamily: typography.fontFamily,
            color: 'inherit',
            lineHeight: typography.lineHeightRelaxed,
            resize: 'none'
          }}
        />
      </div>
      
      {/* Type selector at bottom */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.sm,
          opacity: 0.5
        }}
      >
        {Object.entries(REFLECTION_TYPE_SYMBOLS).map(([type, symbol]) => (
          <button
            key={type}
            onClick={() => onEditChange({ type: type as ReflectionType })}
            style={{
              padding: spacing.sm,
              backgroundColor: editState.type === type 
                ? (colors[type as keyof typeof colors] as string || colors.primary) + '30'
                : 'transparent',
              border: 'none',
              borderRadius: borders.radius,
              cursor: 'pointer',
              color: 'inherit',
              fontSize: typography.fontSizeMd
            }}
            title={REFLECTION_TYPE_LABELS[type as ReflectionType]}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// GENTLE PROMPT
// ============================================================================

interface GentlePromptProps {
  prompt: ReflectionPrompt;
  onUse: () => void;
  onDismiss: () => void;
  onAnother: () => void;
}

export const GentlePrompt: React.FC<GentlePromptProps> = ({
  prompt,
  onUse,
  onDismiss,
  onAnother
}) => {
  return (
    <div
      style={{
        padding: spacing.lg,
        backgroundColor: colors.primaryLight + '15',
        borderRadius: borders.radiusLg,
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <p
        style={{
          margin: 0,
          fontStyle: 'italic',
          color: colors.textPrimary,
          fontSize: typography.fontSizeLg,
          fontFamily: typography.fontFamily,
          lineHeight: typography.lineHeightRelaxed
        }}
      >
        "{prompt.text}"
      </p>
      
      <div
        style={{
          marginTop: spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.md
        }}
      >
        <button
          onClick={onDismiss}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: 'transparent',
            border: `${borders.width} solid ${colors.border}`,
            borderRadius: borders.radius,
            cursor: 'pointer',
            fontSize: typography.fontSizeSm,
            color: colors.textSecondary
          }}
        >
          Not now
        </button>
        <button
          onClick={onAnother}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: 'transparent',
            border: `${borders.width} solid ${colors.border}`,
            borderRadius: borders.radius,
            cursor: 'pointer',
            fontSize: typography.fontSizeSm,
            color: colors.textSecondary
          }}
        >
          Another
        </button>
        <button
          onClick={onUse}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.primary,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: borders.radius,
            cursor: 'pointer',
            fontSize: typography.fontSizeSm
          }}
        >
          Begin
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ReflectionSpaceProps {
  // Data
  reflections: ReflectionSummary[];
  currentReflection?: Reflection;
  
  // Settings
  environment?: ReflectionEnvironment;
  protections?: ReflectionProtections;
  promptSettings?: PromptSettings;
  prompts?: ReflectionPrompt[];
  
  // Handlers
  onLoadReflection: (id: string) => void;
  onCreateReflection: (reflection: Omit<Reflection, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  onUpdateReflection: (id: string, updates: Partial<Reflection>) => void;
  onDeleteReflection: (id: string) => void;
  
  // Optional
  className?: string;
}

export const ReflectionSpace: React.FC<ReflectionSpaceProps> = ({
  reflections,
  currentReflection,
  environment = DEFAULT_REFLECTION_ENVIRONMENT,
  protections = DEFAULT_REFLECTION_PROTECTIONS,
  promptSettings = DEFAULT_PROMPT_SETTINGS,
  prompts = SAMPLE_REFLECTION_PROMPTS,
  onLoadReflection,
  onCreateReflection,
  onUpdateReflection,
  onDeleteReflection,
  className
}) => {
  // UI State
  const [uiState, setUIState] = useState<ReflectionSpaceUIState>({
    viewMode: 'list',
    filters: {},
    sort: 'recent_first',
    currentView: 'list',
    spaceActive: false,
    showPrompt: false,
    isCreating: false,
    isEditing: false,
    showConnections: false,
    isLoading: false
  });
  
  // Edit state
  const [editState, setEditState] = useState<ReflectionEditState>(
    DEFAULT_REFLECTION_EDIT_STATE
  );
  
  // Current prompt
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(null);
  
  // Get random prompt
  const getRandomPrompt = useCallback(() => {
    if (!promptSettings.show_prompts || prompts.length === 0) return null;
    
    const available = prompts.filter(p => 
      promptSettings.include_categories.includes(p.category) &&
      (promptSettings.repeat_used || !p.used_by_user)
    );
    
    if (available.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }, [prompts, promptSettings]);
  
  // Enter space
  const enterSpace = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      spaceActive: true,
      currentView: 'space',
      isCreating: true
    }));
    
    setEditState({
      ...DEFAULT_REFLECTION_EDIT_STATE,
      entry: 'spontaneous'
    });
    
    if (promptSettings.show_prompts) {
      setCurrentPrompt(getRandomPrompt());
    }
  }, [promptSettings.show_prompts, getRandomPrompt]);
  
  // Exit space
  const exitSpace = useCallback(() => {
    // Auto-save if has changes
    if (editState.has_changes && editState.content.text) {
      onCreateReflection({
        title: editState.title,
        content: editState.content,
        type: editState.type,
        state: 'open',
        privacy: editState.privacy,
        entry: editState.entry,
        sparked_by: editState.sparked_by,
        tags: editState.tags,
        retention: { keep_forever: true, include_in_export: true }
      });
    }
    
    setUIState(prev => ({
      ...prev,
      spaceActive: false,
      currentView: 'list',
      isCreating: false
    }));
    
    setEditState(DEFAULT_REFLECTION_EDIT_STATE);
    setCurrentPrompt(null);
  }, [editState, onCreateReflection]);
  
  // Save reflection
  const saveReflection = useCallback(() => {
    if (editState.is_new) {
      onCreateReflection({
        title: editState.title,
        content: editState.content,
        type: editState.type,
        state: 'open',
        privacy: editState.privacy,
        entry: editState.entry,
        sparked_by: editState.sparked_by,
        tags: editState.tags,
        retention: { keep_forever: true, include_in_export: true }
      });
    } else if (editState.reflection_id) {
      onUpdateReflection(editState.reflection_id, {
        title: editState.title,
        content: editState.content,
        type: editState.type,
        tags: editState.tags
      });
    }
    
    setEditState(prev => ({ ...prev, has_changes: false }));
  }, [editState, onCreateReflection, onUpdateReflection]);
  
  // Select reflection
  const selectReflection = useCallback((id: string) => {
    onLoadReflection(id);
    setUIState(prev => ({
      ...prev,
      selectedReflectionId: id,
      currentView: 'single'
    }));
  }, [onLoadReflection]);
  
  // Edit reflection
  const startEditing = useCallback(() => {
    if (currentReflection) {
      setEditState({
        reflection_id: currentReflection.id,
        is_new: false,
        title: currentReflection.title,
        content: currentReflection.content,
        type: currentReflection.type,
        privacy: currentReflection.privacy,
        entry: currentReflection.entry,
        sparked_by: currentReflection.sparked_by,
        tags: currentReflection.tags,
        has_changes: false,
        auto_save_enabled: true,
        is_recording: false,
        is_sketching: false
      });
      
      setUIState(prev => ({ ...prev, isEditing: true }));
    }
  }, [currentReflection]);
  
  // Continue reflection
  const continueReflection = useCallback(() => {
    if (currentReflection) {
      setEditState({
        ...DEFAULT_REFLECTION_EDIT_STATE,
        entry: 'continuing',
        sparked_by: {
          type: 'other',
          description: `Continuing from "${currentReflection.title || 'earlier reflection'}"`,
          reference_id: currentReflection.id,
          reference_type: 'reflection'
        }
      });
      
      setUIState(prev => ({
        ...prev,
        spaceActive: true,
        currentView: 'space',
        isCreating: true
      }));
    }
  }, [currentReflection]);
  
  // Change state
  const changeReflectionState = useCallback((state: ReflectionState) => {
    if (currentReflection) {
      onUpdateReflection(currentReflection.id, { state });
    }
  }, [currentReflection, onUpdateReflection]);
  
  // Back to list
  const backToList = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      currentView: 'list',
      selectedReflectionId: undefined,
      isEditing: false
    }));
  }, []);
  
  // Render based on current view
  const renderContent = () => {
    // Full-screen space
    if (uiState.spaceActive) {
      return (
        <SpaceEnvironment
          environment={environment}
          protections={protections}
          editState={editState}
          prompt={currentPrompt}
          onEditChange={(updates) => setEditState(prev => ({ ...prev, ...updates }))}
          onSave={saveReflection}
          onExit={exitSpace}
          onNewPrompt={() => setCurrentPrompt(getRandomPrompt())}
          onDismissPrompt={() => setCurrentPrompt(null)}
        />
      );
    }
    
    // Single reflection view
    if (uiState.currentView === 'single' && currentReflection) {
      if (uiState.isEditing) {
        return (
          <ReflectionEditor
            editState={editState}
            onChange={(updates) => setEditState(prev => ({ ...prev, ...updates }))}
            onSave={saveReflection}
            onCancel={() => setUIState(prev => ({ ...prev, isEditing: false }))}
          />
        );
      }
      
      return (
        <ReflectionView
          reflection={currentReflection}
          onEdit={startEditing}
          onClose={backToList}
          onContinue={continueReflection}
          onChangeState={changeReflectionState}
        />
      );
    }
    
    // List view
    return (
      <ReflectionList
        reflections={reflections}
        filters={uiState.filters}
        sort={uiState.sort}
        viewMode={uiState.viewMode}
        selectedId={uiState.selectedReflectionId}
        onSelect={selectReflection}
        onFilterChange={(filters) => setUIState(prev => ({ ...prev, filters }))}
        onSortChange={(sort) => setUIState(prev => ({ ...prev, sort }))}
        onEnterSpace={enterSpace}
      />
    );
  };
  
  return (
    <div
      className={className}
      style={{
        height: '100%',
        backgroundColor: colors.background,
        fontFamily: typography.fontFamily
      }}
    >
      {renderContent()}
    </div>
  );
};

export default ReflectionSpace;

// Named exports
export {
  ReflectionSpace,
  ReflectionList,
  ReflectionCard,
  ReflectionView,
  ReflectionEditor,
  SpaceEnvironment,
  GentlePrompt,
  TypeIndicator,
  StateBadge,
  PrivacyIndicator
};
