/**
 * CHE·NU™ Knowledge Threads - Thread View Component
 * 
 * Detailed view of a single Knowledge Thread.
 * Shows timeline, linked entities, agent activity, unresolved elements.
 * 
 * Features:
 * - Visual timeline (filtered to relevant events)
 * - Linked entities grouped by type
 * - Unresolved elements highlighted
 * - Agent activity panel
 * - Jump to related threads
 * 
 * Design:
 * - Entering a thread dims unrelated context
 * - Shows WHY events matter, not just WHEN
 * - Surfaces forgotten decisions and unresolved questions
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import type {
  KnowledgeThread,
  LinkedEntity,
  ThreadTimelineEvent,
  UnresolvedElement,
  ThreadViewFilters,
  ThreadViewState,
  LinkType,
  LinkedEntityType,
} from './knowledge-threads.types';
import {
  LINK_TYPE_META,
  ENTITY_TYPE_META,
  THREAD_STATUS_META,
  THREAD_COLORS,
  DEFAULT_VIEW_FILTERS,
} from './knowledge-threads.types';

// ============================================================================
// PROPS
// ============================================================================

export interface ThreadViewProps {
  /** The thread to display */
  thread: KnowledgeThread;
  /** Current user ID */
  userId: string;
  /** Callback to close the view */
  onClose?: () => void;
  /** Callback when an entity is selected */
  onSelectEntity?: (entityType: LinkedEntityType, entityId: string) => void;
  /** Callback to link a new entity */
  onLinkEntity?: () => void;
  /** Callback to jump to another thread */
  onNavigateToThread?: (threadId: string) => void;
  /** Initial entity to highlight */
  highlightEntityId?: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Timeline Event Card
 */
const TimelineEventCard: React.FC<{
  event: ThreadTimelineEvent;
  onEntityClick?: (type: LinkedEntityType, id: string) => void;
}> = ({ event, onEntityClick }) => {
  const getEventIcon = (): string => {
    switch (event.event_type) {
      case 'created': return '🌱';
      case 'linked': return '🔗';
      case 'unlinked': return '✂️';
      case 'status_changed': return '📊';
      case 'agent_suggested': return '🤖';
      case 'human_reflected': return '💭';
      case 'snapshot_taken': return '📸';
      case 'decision_made': return '⚖️';
      case 'question_raised': return '❓';
      case 'question_resolved': return '✅';
      default: return '📌';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '12px 0',
      borderBottom: `1px solid ${THREAD_COLORS.nightSlate}`,
    }}>
      {/* Timeline Dot */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: event.actor_type === 'human' 
            ? `${THREAD_COLORS.sacredGold}20`
            : `${THREAD_COLORS.cenoteTurquoise}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}>
          {getEventIcon()}
        </div>
        <div style={{
          flex: 1,
          width: '2px',
          background: THREAD_COLORS.nightSlate,
          marginTop: '4px',
        }} />
      </div>

      {/* Event Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '13px',
            color: event.actor_type === 'human' ? '#E5E7EB' : '#9CA3AF',
          }}>
            <strong>{event.actor_name}</strong>
            {event.actor_type === 'agent' && (
              <span style={{
                marginLeft: '6px',
                padding: '2px 6px',
                background: `${THREAD_COLORS.cenoteTurquoise}20`,
                borderRadius: '4px',
                fontSize: '10px',
                color: THREAD_COLORS.cenoteTurquoise,
              }}>
                Agent
              </span>
            )}
          </span>
          <span style={{
            fontSize: '11px',
            color: '#6B7280',
          }}>
            {formatDate(event.timestamp)}
          </span>
        </div>

        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#9CA3AF',
          lineHeight: 1.5,
        }}>
          {event.description}
        </p>

        {event.entity_reference && (
          <button
            onClick={() => onEntityClick?.(
              event.entity_reference!.type,
              event.entity_reference!.id
            )}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: THREAD_COLORS.obsidianBlack,
              border: `1px solid ${THREAD_COLORS.nightSlate}`,
              borderRadius: '6px',
              color: '#E5E7EB',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{ENTITY_TYPE_META[event.entity_reference.type]?.icon}</span>
            <span>{event.entity_reference.title}</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Linked Entity Card
 */
const LinkedEntityCard: React.FC<{
  entity: LinkedEntity;
  isHighlighted?: boolean;
  onClick?: () => void;
}> = ({ entity, isHighlighted, onClick }) => {
  const meta = ENTITY_TYPE_META[entity.entity_type];
  const linkMeta = LINK_TYPE_META[entity.link_type];

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        background: isHighlighted 
          ? `${THREAD_COLORS.sacredGold}15`
          : THREAD_COLORS.obsidianBlack,
        border: isHighlighted
          ? `1px solid ${THREAD_COLORS.sacredGold}40`
          : `1px solid ${THREAD_COLORS.nightSlate}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>{meta?.icon || '📎'}</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#E5E7EB',
          }}>
            {entity.display_title || `${meta?.label} ${entity.entity_id.slice(-6)}`}
          </span>
        </div>
        
        {entity.is_resolved !== undefined && (
          <span style={{
            fontSize: '12px',
            color: entity.is_resolved ? '#22C55E' : '#EAB308',
          }}>
            {entity.is_resolved ? '✓ Résolu' : '⏳ Ouvert'}
          </span>
        )}
      </div>

      {/* Link Type Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{
          padding: '2px 8px',
          background: `${linkMeta?.color || '#6B7280'}20`,
          borderRadius: '4px',
          fontSize: '11px',
          color: linkMeta?.color || '#6B7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{linkMeta?.icon}</span>
          <span>{linkMeta?.label}</span>
        </span>
        
        {entity.sphere_origin && (
          <span style={{
            fontSize: '11px',
            color: '#6B7280',
          }}>
            • {entity.sphere_origin}
          </span>
        )}
      </div>

      {entity.reason && (
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '12px',
          color: '#6B7280',
          fontStyle: 'italic',
        }}>
          "{entity.reason}"
        </p>
      )}
    </div>
  );
};

/**
 * Unresolved Element Alert
 */
const UnresolvedAlert: React.FC<{
  elements: UnresolvedElement[];
  onElementClick?: (id: string) => void;
}> = ({ elements, onElementClick }) => {
  if (elements.length === 0) return null;

  return (
    <div style={{
      padding: '16px',
      background: `${THREAD_COLORS.sacredGold}10`,
      border: `1px solid ${THREAD_COLORS.sacredGold}30`,
      borderRadius: '8px',
      marginBottom: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        color: THREAD_COLORS.sacredGold,
        fontWeight: 500,
      }}>
        <span>⚠️</span>
        <span>Éléments non résolus ({elements.length})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {elements.map(element => (
          <button
            key={element.id}
            onClick={() => onElementClick?.(element.id)}
            style={{
              padding: '10px 12px',
              background: THREAD_COLORS.nightSlate,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{
                fontSize: '13px',
                color: '#E5E7EB',
                marginBottom: '2px',
              }}>
                {element.type === 'question' && '❓ '}
                {element.type === 'decision' && '⚖️ '}
                {element.type === 'exploration' && '🔍 '}
                {element.title}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Soulevé le {new Date(element.raised_at).toLocaleDateString('fr-CA')}
              </div>
            </div>
            {element.priority && (
              <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                background: element.priority === 'high' ? '#EF444420' :
                           element.priority === 'medium' ? '#EAB30820' : '#6B728020',
                color: element.priority === 'high' ? '#EF4444' :
                       element.priority === 'medium' ? '#EAB308' : '#6B7280',
              }}>
                {element.priority}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ThreadView: React.FC<ThreadViewProps> = ({
  thread,
  userId,
  onClose,
  onSelectEntity,
  onLinkEntity,
  onNavigateToThread,
  highlightEntityId,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [viewMode, setViewMode] = useState<'timeline' | 'entities' | 'summary'>('timeline');
  const [filters, setFilters] = useState<ThreadViewFilters>(DEFAULT_VIEW_FILTERS);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(highlightEntityId || null);

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const unresolved = useMemo((): UnresolvedElement[] => {
    // Extract unresolved from linked entities
    return thread.linked_entities
      .filter(e => e.link_type === 'QUESTION' && !e.is_resolved)
      .map(e => ({
        id: e.id,
        type: 'question' as const,
        title: e.display_title || 'Question sans titre',
        raised_at: e.timestamp,
        raised_by: e.linked_by,
        entity_id: e.entity_id,
      }));
  }, [thread.linked_entities]);

  const groupedEntities = useMemo(() => {
    const groups: Record<LinkType, LinkedEntity[]> = {} as any;
    
    for (const entity of thread.linked_entities) {
      if (!groups[entity.link_type]) {
        groups[entity.link_type] = [];
      }
      groups[entity.link_type].push(entity);
    }
    
    return groups;
  }, [thread.linked_entities]);

  const filteredTimeline = useMemo(() => {
    let events = [...thread.timeline];
    
    if (filters.date_range) {
      const start = new Date(filters.date_range.start);
      const end = new Date(filters.date_range.end);
      events = events.filter(e => {
        const date = new Date(e.timestamp);
        return date >= start && date <= end;
      });
    }
    
    // Sort by most recent first
    events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return events;
  }, [thread.timeline, filters]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleEntityClick = useCallback((type: LinkedEntityType, id: string) => {
    setSelectedEntityId(id);
    onSelectEntity?.(type, id);
  }, [onSelectEntity]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{
      minHeight: '100vh',
      background: THREAD_COLORS.obsidianBlack,
      color: '#E5E7EB',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}
      <header style={{
        padding: '24px 32px',
        borderBottom: `1px solid ${THREAD_COLORS.nightSlate}`,
        position: 'sticky',
        top: 0,
        background: THREAD_COLORS.obsidianBlack,
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Back Button */}
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                background: 'transparent',
                border: `1px solid ${THREAD_COLORS.nightSlate}`,
                borderRadius: '8px',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: '18px',
              }}
              title="Retour à la liste"
            >
              ←
            </button>

            {/* Thread Icon & Title */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${thread.color || THREAD_COLORS.sacredGold}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {thread.icon || '🧵'}
                </div>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 600,
                  }}>
                    {thread.title}
                  </h1>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px',
                    fontSize: '13px',
                    color: '#6B7280',
                  }}>
                    <span style={{ color: THREAD_STATUS_META[thread.status].color }}>
                      {THREAD_STATUS_META[thread.status].icon} {THREAD_STATUS_META[thread.status].label}
                    </span>
                    <span>•</span>
                    <span>Créé par {thread.owner_name}</span>
                    <span>•</span>
                    <span>{thread.entity_count} éléments</span>
                  </div>
                </div>
              </div>

              {thread.description && (
                <p style={{
                  margin: '0 0 0 60px',
                  color: '#9CA3AF',
                  fontSize: '14px',
                  maxWidth: '600px',
                }}>
                  {thread.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onLinkEntity}
              style={{
                padding: '10px 16px',
                background: `${THREAD_COLORS.sacredGold}20`,
                border: `1px solid ${THREAD_COLORS.sacredGold}40`,
                borderRadius: '8px',
                color: THREAD_COLORS.sacredGold,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🔗</span>
              <span>Lier un élément</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginTop: '20px',
          marginLeft: '60px',
        }}>
          {(['timeline', 'entities', 'summary'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                background: viewMode === mode 
                  ? THREAD_COLORS.nightSlate 
                  : 'transparent',
                border: viewMode === mode
                  ? `1px solid ${THREAD_COLORS.sacredGold}40`
                  : '1px solid transparent',
                borderRadius: '6px',
                color: viewMode === mode 
                  ? THREAD_COLORS.sacredGold 
                  : '#6B7280',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {mode === 'timeline' && '📅 Timeline'}
              {mode === 'entities' && '🔗 Éléments'}
              {mode === 'summary' && '📋 Résumé'}
            </button>
          ))}
        </div>
      </header>

      {/* ================================================================ */}
      {/* CONTENT */}
      {/* ================================================================ */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '24px',
        padding: '24px 32px',
        minHeight: 'calc(100vh - 200px)',
      }}>
        {/* Main Content Area */}
        <div>
          {/* Unresolved Alert */}
          <UnresolvedAlert 
            elements={unresolved}
            onElementClick={(id) => setSelectedEntityId(id)}
          />

          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>📅</span>
                <span>Timeline</span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6B7280',
                  fontWeight: 400,
                }}>
                  ({filteredTimeline.length} événements)
                </span>
              </h2>

              {filteredTimeline.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6B7280',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>
                    📅
                  </div>
                  <p>Aucun événement dans cette période</p>
                </div>
              ) : (
                <div style={{
                  background: THREAD_COLORS.nightSlate,
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  {filteredTimeline.map((event, index) => (
                    <TimelineEventCard
                      key={event.id}
                      event={event}
                      onEntityClick={handleEntityClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Entities View */}
          {viewMode === 'entities' && (
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>🔗</span>
                <span>Éléments Liés</span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6B7280',
                  fontWeight: 400,
                }}>
                  ({thread.entity_count} total)
                </span>
              </h2>

              {Object.entries(groupedEntities).map(([linkType, entities]) => (
                <div key={linkType} style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '12px',
                    color: LINK_TYPE_META[linkType as LinkType]?.color || '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{LINK_TYPE_META[linkType as LinkType]?.icon}</span>
                    <span>{LINK_TYPE_META[linkType as LinkType]?.label}</span>
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#6B7280',
                      fontWeight: 400,
                    }}>
                      ({entities.length})
                    </span>
                  </h3>

                  <div style={{
                    display: 'grid',
                    gap: '8px',
                  }}>
                    {entities.map(entity => (
                      <LinkedEntityCard
                        key={entity.id}
                        entity={entity}
                        isHighlighted={selectedEntityId === entity.id}
                        onClick={() => handleEntityClick(entity.entity_type, entity.entity_id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary View */}
          {viewMode === 'summary' && (
            <div style={{
              background: THREAD_COLORS.nightSlate,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>📋</span>
                <span>Résumé du Fil</span>
              </h2>

              <div style={{
                display: 'grid',
                gap: '16px',
              }}>
                {/* Creation Context */}
                <div>
                  <h4 style={{ 
                    fontSize: '13px', 
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}>
                    Contexte de création
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    {thread.creation_context.reason}
                  </p>
                </div>

                {/* Sphere Coverage */}
                <div>
                  <h4 style={{ 
                    fontSize: '13px', 
                    color: '#6B7280',
                    marginBottom: '8px',
                  }}>
                    Sphères touchées
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {thread.sphere_coverage.map(sphere => (
                      <span
                        key={sphere}
                        style={{
                          padding: '4px 12px',
                          background: THREAD_COLORS.obsidianBlack,
                          borderRadius: '6px',
                          fontSize: '13px',
                        }}
                      >
                        {sphere}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  padding: '16px',
                  background: THREAD_COLORS.obsidianBlack,
                  borderRadius: '8px',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: THREAD_COLORS.sacredGold }}>
                      {thread.entity_count}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Éléments</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#8B5CF6' }}>
                      {thread.timeline.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Événements</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#EAB308' }}>
                      {thread.unresolved_count}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Non résolus</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#22C55E' }}>
                      {thread.agents_linked.length}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Agents</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Quick Stats */}
          <div style={{
            padding: '16px',
            background: THREAD_COLORS.nightSlate,
            borderRadius: '12px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '12px',
              color: '#9CA3AF',
            }}>
              Aperçu
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6B7280' }}>Créé</span>
                <span>{new Date(thread.created_at).toLocaleDateString('fr-CA')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6B7280' }}>Dernière activité</span>
                <span>{new Date(thread.last_activity_at).toLocaleDateString('fr-CA')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6B7280' }}>Visibilité</span>
                <span style={{ textTransform: 'capitalize' }}>{thread.visibility_scope}</span>
              </div>
            </div>
          </div>

          {/* Linked Agents */}
          {thread.agents_linked.length > 0 && (
            <div style={{
              padding: '16px',
              background: THREAD_COLORS.nightSlate,
              borderRadius: '12px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '12px',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>🤖</span>
                <span>Agents Liés</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {thread.agents_linked.map(agent => (
                  <div
                    key={agent.id}
                    style={{
                      padding: '10px',
                      background: THREAD_COLORS.obsidianBlack,
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '13px' }}>{agent.agent_name}</span>
                    <span style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      textTransform: 'capitalize',
                    }}>
                      {agent.role_in_thread}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{
                margin: '12px 0 0 0',
                fontSize: '11px',
                color: '#6B7280',
                fontStyle: 'italic',
              }}>
                Les agents peuvent lire et suggérer, mais ne peuvent pas modifier sans approbation.
              </p>
            </div>
          )}

          {/* Related Threads */}
          <div style={{
            padding: '16px',
            background: THREAD_COLORS.nightSlate,
            borderRadius: '12px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '12px',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>🔀</span>
              <span>Fils Connexes</span>
            </h3>

            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#6B7280',
              fontStyle: 'italic',
            }}>
              Basé sur les éléments partagés
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ThreadView;
