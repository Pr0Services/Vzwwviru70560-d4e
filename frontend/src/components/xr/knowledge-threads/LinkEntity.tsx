/**
 * CHE·NU™ Knowledge Threads - Link Entity Component
 * 
 * Modal for linking entities to a Knowledge Thread.
 * Enforces explicit link type declaration.
 * 
 * Rules (from spec):
 * - Every link MUST declare its nature
 * - No implicit semantics
 * - No inferred meaning without declaration
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import type {
  LinkedEntity,
  LinkedEntityType,
  LinkType,
  KnowledgeThread,
} from './knowledge-threads.types';
import {
  LINK_TYPE_META,
  ENTITY_TYPE_META,
  THREAD_COLORS,
} from './knowledge-threads.types';

// ============================================================================
// PROPS
// ============================================================================

export interface LinkEntityProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Submit the link */
  onSubmit: (link: Omit<LinkedEntity, 'id' | 'timestamp' | 'linked_by'>) => void;
  /** The thread being linked to */
  thread: KnowledgeThread;
  /** Current user ID */
  userId: string;
  /** Pre-selected entity (optional) */
  preselectedEntity?: {
    type: LinkedEntityType;
    id: string;
    title: string;
    sphere?: string;
  };
}

// ============================================================================
// MOCK RECENT ENTITIES (Replace with API)
// ============================================================================

interface RecentEntity {
  type: LinkedEntityType;
  id: string;
  title: string;
  sphere: string;
  timestamp: string;
}

const MOCK_RECENT_ENTITIES: RecentEntity[] = [
  { type: 'note', id: 'note_001', title: 'Notes réunion stratégie', sphere: 'Business', timestamp: '2025-12-28T15:00:00Z' },
  { type: 'decision', id: 'dec_001', title: 'Choix framework frontend', sphere: 'Business', timestamp: '2025-12-27T10:00:00Z' },
  { type: 'task', id: 'task_001', title: 'Préparer demo investisseurs', sphere: 'Business', timestamp: '2025-12-26T14:00:00Z' },
  { type: 'meeting', id: 'meet_001', title: 'Call avec partenaire potentiel', sphere: 'Business', timestamp: '2025-12-25T11:00:00Z' },
  { type: 'document', id: 'doc_001', title: 'Business Plan v3', sphere: 'Business', timestamp: '2025-12-24T09:00:00Z' },
  { type: 'memory', id: 'mem_001', title: 'Insight sur pricing', sphere: 'Personal', timestamp: '2025-12-23T16:00:00Z' },
  { type: 'rnd_project', id: 'rnd_001', title: 'Recherche UX patterns', sphere: 'Scholar', timestamp: '2025-12-22T13:00:00Z' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const LinkEntity: React.FC<LinkEntityProps> = ({
  isOpen,
  onClose,
  onSubmit,
  thread,
  userId,
  preselectedEntity,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [selectedEntity, setSelectedEntity] = useState<RecentEntity | null>(
    preselectedEntity ? {
      type: preselectedEntity.type,
      id: preselectedEntity.id,
      title: preselectedEntity.title,
      sphere: preselectedEntity.sphere || 'Unknown',
      timestamp: new Date().toISOString(),
    } : null
  );
  const [selectedLinkType, setSelectedLinkType] = useState<LinkType | null>(null);
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<LinkedEntityType | 'all'>('all');

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const filteredEntities = useMemo(() => {
    let entities = MOCK_RECENT_ENTITIES;

    // Exclude already linked entities
    const linkedIds = new Set(thread.linked_entities.map(e => e.entity_id));
    entities = entities.filter(e => !linkedIds.has(e.id));

    // Type filter
    if (filterType !== 'all') {
      entities = entities.filter(e => e.type === filterType);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      entities = entities.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.sphere.toLowerCase().includes(query)
      );
    }

    return entities;
  }, [searchQuery, filterType, thread.linked_entities]);

  const isValid = selectedEntity !== null && selectedLinkType !== null;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSubmit = useCallback(() => {
    if (!selectedEntity || !selectedLinkType) return;

    onSubmit({
      entity_type: selectedEntity.type,
      entity_id: selectedEntity.id,
      link_type: selectedLinkType,
      reason: reason.trim() || undefined,
      display_title: selectedEntity.title,
      sphere_origin: selectedEntity.sphere,
    });

    // Reset and close
    setSelectedEntity(null);
    setSelectedLinkType(null);
    setReason('');
    onClose();
  }, [selectedEntity, selectedLinkType, reason, onSubmit, onClose]);

  const handleEntitySelect = useCallback((entity: RecentEntity) => {
    setSelectedEntity(entity);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    }}>
      <div
        style={{
          background: '#111113',
          borderRadius: '16px',
          border: `1px solid ${THREAD_COLORS.nightSlate}`,
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-entity-title"
      >
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <header style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${THREAD_COLORS.nightSlate}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 
              id="link-entity-title"
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🔗</span>
              <span>Lier un élément</span>
            </h2>
            <p style={{
              margin: '4px 0 0 32px',
              fontSize: '13px',
              color: '#6B7280',
            }}>
              au fil: {thread.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        {/* ============================================================ */}
        {/* CONTENT */}
        {/* ============================================================ */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: THREAD_COLORS.nightSlate,
        }}>
          {/* Left: Entity Selection */}
          <div style={{
            background: '#111113',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 500,
              color: '#9CA3AF',
            }}>
              1. Choisir l'élément
            </h3>

            {/* Search */}
            <div style={{
              position: 'relative',
              marginBottom: '12px',
            }}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  background: THREAD_COLORS.nightSlate,
                  border: `1px solid ${THREAD_COLORS.nightSlate}`,
                  borderRadius: '8px',
                  color: '#E5E7EB',
                  fontSize: '14px',
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
              }}>
                🔍
              </span>
            </div>

            {/* Type Filter */}
            <div style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  padding: '4px 10px',
                  background: filterType === 'all' 
                    ? THREAD_COLORS.nightSlate 
                    : 'transparent',
                  border: `1px solid ${THREAD_COLORS.nightSlate}`,
                  borderRadius: '6px',
                  color: filterType === 'all' ? '#E5E7EB' : '#6B7280',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Tous
              </button>
              {(['note', 'decision', 'task', 'meeting', 'document'] as LinkedEntityType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '4px 10px',
                    background: filterType === type 
                      ? THREAD_COLORS.nightSlate 
                      : 'transparent',
                    border: `1px solid ${THREAD_COLORS.nightSlate}`,
                    borderRadius: '6px',
                    color: filterType === type ? '#E5E7EB' : '#6B7280',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{ENTITY_TYPE_META[type]?.icon}</span>
                  <span>{ENTITY_TYPE_META[type]?.label}</span>
                </button>
              ))}
            </div>

            {/* Entity List */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {filteredEntities.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#6B7280',
                }}>
                  Aucun élément trouvé
                </div>
              ) : (
                filteredEntities.map(entity => (
                  <button
                    key={entity.id}
                    onClick={() => handleEntitySelect(entity)}
                    style={{
                      padding: '10px 12px',
                      background: selectedEntity?.id === entity.id 
                        ? `${THREAD_COLORS.sacredGold}15`
                        : THREAD_COLORS.nightSlate,
                      border: selectedEntity?.id === entity.id
                        ? `1px solid ${THREAD_COLORS.sacredGold}40`
                        : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>
                      {ENTITY_TYPE_META[entity.type]?.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        color: '#E5E7EB',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {entity.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6B7280',
                      }}>
                        {entity.sphere} • {new Date(entity.timestamp).toLocaleDateString('fr-CA')}
                      </div>
                    </div>
                    {selectedEntity?.id === entity.id && (
                      <span style={{ color: THREAD_COLORS.sacredGold }}>✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Link Type Selection */}
          <div style={{
            background: '#111113',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 500,
              color: '#9CA3AF',
            }}>
              2. Définir la nature du lien
            </h3>

            <p style={{
              margin: '0 0 16px 0',
              fontSize: '12px',
              color: '#6B7280',
              fontStyle: 'italic',
            }}>
              Chaque lien doit explicitement déclarer sa nature.
              Pas de sémantique implicite.
            </p>

            {/* Link Type Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {(Object.entries(LINK_TYPE_META) as [LinkType, typeof LINK_TYPE_META[LinkType]][]).map(([type, meta]) => (
                <button
                  key={type}
                  onClick={() => setSelectedLinkType(type)}
                  style={{
                    padding: '10px',
                    background: selectedLinkType === type 
                      ? `${meta.color}15`
                      : THREAD_COLORS.nightSlate,
                    border: selectedLinkType === type
                      ? `1px solid ${meta.color}60`
                      : '1px solid transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{meta.icon}</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: selectedLinkType === type ? meta.color : '#E5E7EB',
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6B7280',
                    lineHeight: 1.3,
                  }}>
                    {meta.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Reason (optional) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '6px',
                color: '#9CA3AF',
              }}>
                Pourquoi ce lien? (optionnel)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Expliquez brièvement pourquoi cet élément est pertinent..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: THREAD_COLORS.nightSlate,
                  border: `1px solid ${THREAD_COLORS.nightSlate}`,
                  borderRadius: '8px',
                  color: '#E5E7EB',
                  fontSize: '13px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Preview */}
            {selectedEntity && selectedLinkType && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: `${LINK_TYPE_META[selectedLinkType].color}10`,
                border: `1px solid ${LINK_TYPE_META[selectedLinkType].color}30`,
                borderRadius: '8px',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#6B7280',
                  marginBottom: '6px',
                }}>
                  Aperçu du lien:
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>{ENTITY_TYPE_META[selectedEntity.type]?.icon}</span>
                  <span style={{ fontSize: '13px' }}>{selectedEntity.title}</span>
                  <span style={{ color: '#6B7280' }}>→</span>
                  <span style={{
                    padding: '2px 8px',
                    background: `${LINK_TYPE_META[selectedLinkType].color}20`,
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: LINK_TYPE_META[selectedLinkType].color,
                  }}>
                    {LINK_TYPE_META[selectedLinkType].icon} {LINK_TYPE_META[selectedLinkType].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer style={{
          padding: '16px 24px',
          borderTop: `1px solid ${THREAD_COLORS.nightSlate}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${THREAD_COLORS.nightSlate}`,
              borderRadius: '8px',
              color: '#9CA3AF',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              padding: '10px 24px',
              background: isValid ? THREAD_COLORS.sacredGold : THREAD_COLORS.nightSlate,
              border: 'none',
              borderRadius: '8px',
              color: isValid ? '#000' : '#6B7280',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔗</span>
            <span>Créer le lien</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default LinkEntity;
