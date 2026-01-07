/**
 * CHE·NU™ Knowledge Threads - Main Component
 * 
 * Entry point for the Knowledge Threads module.
 * Displays thread list with discovery, filtering, and navigation.
 * 
 * Features:
 * - Thread list with activity indicators
 * - Status filtering (active/dormant/closed)
 * - Search and discovery
 * - Quick actions (create, open, archive)
 * - Pending agent suggestions
 * 
 * Design:
 * - Dormant threads fade visually (never disappear)
 * - Activity level shown, not priority
 * - Jump from any entity → related threads
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  KnowledgeThread,
  ThreadSummary,
  ThreadStatus,
  VisibilityScope,
  ThreadListState,
  AgentThreadSuggestion,
} from './knowledge-threads.types';
import {
  THREAD_STATUS_META,
  THREAD_COLORS,
} from './knowledge-threads.types';

// ============================================================================
// PROPS
// ============================================================================

export interface KnowledgeThreadsProps {
  /** User ID for ownership checks */
  userId: string;
  /** Optional initial thread to highlight */
  highlightThreadId?: string;
  /** Callback when thread is selected */
  onSelectThread?: (threadId: string) => void;
  /** Callback when create is requested */
  onCreateThread?: () => void;
  /** Optional entity context for "related threads" view */
  entityContext?: {
    type: string;
    id: string;
    title: string;
  };
}

// ============================================================================
// MOCK DATA (Replace with API)
// ============================================================================

const MOCK_THREADS: ThreadSummary[] = [
  {
    id: 'thread_001',
    title: 'Stratégie de lancement CHE·NU',
    description: 'Réflexions continues sur le positionnement marché et le go-to-market',
    status: 'active',
    owner: 'user_001',
    owner_name: 'Jo',
    created_at: '2025-11-15T10:00:00Z',
    last_activity_at: '2025-12-28T15:30:00Z',
    entity_count: 24,
    unresolved_count: 3,
    activity_level: 'high',
    color: '#D4AF37',
    icon: '🚀',
    sphere_coverage: ['Business', 'Personal', 'Creative Studio'],
  },
  {
    id: 'thread_002',
    title: 'Architecture Quantum Framework',
    description: 'Évolution du système quantique de gouvernance',
    status: 'active',
    owner: 'user_001',
    owner_name: 'Jo',
    created_at: '2025-10-01T08:00:00Z',
    last_activity_at: '2025-12-27T09:00:00Z',
    entity_count: 42,
    unresolved_count: 1,
    activity_level: 'medium',
    color: '#8B5CF6',
    icon: '⚛️',
    sphere_coverage: ['Scholar', 'Business'],
  },
  {
    id: 'thread_003',
    title: 'Réflexions sur la souveraineté des données',
    description: 'Principes fondamentaux et implications techniques',
    status: 'dormant',
    owner: 'user_001',
    owner_name: 'Jo',
    created_at: '2025-08-20T14:00:00Z',
    last_activity_at: '2025-11-10T16:00:00Z',
    entity_count: 18,
    unresolved_count: 5,
    activity_level: 'dormant',
    color: '#22C55E',
    icon: '🔐',
    sphere_coverage: ['Government', 'Personal'],
  },
  {
    id: 'thread_004',
    title: 'Partenariats potentiels',
    description: 'Exploration des opportunités de collaboration',
    status: 'active',
    owner: 'user_001',
    owner_name: 'Jo',
    created_at: '2025-12-01T10:00:00Z',
    last_activity_at: '2025-12-29T08:00:00Z',
    entity_count: 8,
    unresolved_count: 2,
    activity_level: 'high',
    color: '#F97316',
    icon: '🤝',
    sphere_coverage: ['Business', 'Community'],
  },
  {
    id: 'thread_005',
    title: 'Recherche sur les interfaces XR',
    description: 'Notes et explorations sur la réalité mixte pour CHE·NU',
    status: 'closed',
    owner: 'user_001',
    owner_name: 'Jo',
    created_at: '2025-06-01T09:00:00Z',
    last_activity_at: '2025-09-15T11:00:00Z',
    entity_count: 31,
    unresolved_count: 0,
    activity_level: 'dormant',
    color: '#06B6D4',
    icon: '🥽',
    sphere_coverage: ['Creative Studio', 'Scholar'],
  },
];

const MOCK_SUGGESTIONS: AgentThreadSuggestion[] = [
  {
    id: 'sug_001',
    suggestion_type: 'link_existing',
    agent_id: 'agent_nova',
    agent_name: 'Nova',
    timestamp: '2025-12-29T12:00:00Z',
    target_thread_id: 'thread_001',
    target_thread_title: 'Stratégie de lancement CHE·NU',
    entity: {
      type: 'decision',
      id: 'dec_123',
      title: 'Choix du pricing model',
    },
    reason: 'Cette décision semble directement liée à votre stratégie de lancement. Elle pourrait contextualiser les choix de positionnement.',
    confidence: 0.85,
    status: 'pending',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const KnowledgeThreads: React.FC<KnowledgeThreadsProps> = ({
  userId,
  highlightThreadId,
  onSelectThread,
  onCreateThread,
  entityContext,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [state, setState] = useState<ThreadListState>({
    threads: [],
    loading: true,
    error: null,
    status_filter: 'all',
    visibility_filter: 'all',
    sort_by: 'recent',
    sort_order: 'desc',
    search_query: '',
    page: 1,
    page_size: 20,
    total_count: 0,
  });

  const [suggestions, setSuggestions] = useState<AgentThreadSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // ============================================================================
  // LOAD DATA
  // ============================================================================

  useEffect(() => {
    // Simulate API call
    const loadThreads = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        threads: MOCK_THREADS as unknown as KnowledgeThread[],
        loading: false,
        total_count: MOCK_THREADS.length,
      }));
      
      setSuggestions(MOCK_SUGGESTIONS);
    };

    loadThreads();
  }, [userId]);

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================

  const filteredThreads = useMemo(() => {
    let result = [...state.threads] as ThreadSummary[];

    // Status filter
    if (state.status_filter !== 'all') {
      result = result.filter(t => t.status === state.status_filter);
    }

    // Search filter
    if (state.search_query.trim()) {
      const query = state.search_query.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.sphere_coverage.some(s => s.toLowerCase().includes(query))
      );
    }

    // Entity context filter
    if (entityContext) {
      // In real implementation, would filter by related threads
      // For now, show all
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sort_by) {
        case 'recent':
          comparison = new Date(b.last_activity_at).getTime() - 
                      new Date(a.last_activity_at).getTime();
          break;
        case 'created':
          comparison = new Date(b.created_at).getTime() - 
                      new Date(a.created_at).getTime();
          break;
        case 'activity':
          const activityOrder = { high: 3, medium: 2, low: 1, dormant: 0 };
          comparison = activityOrder[b.activity_level] - activityOrder[a.activity_level];
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return state.sort_order === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [state.threads, state.status_filter, state.search_query, state.sort_by, state.sort_order, entityContext]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleStatusFilter = useCallback((status: ThreadStatus | 'all') => {
    setState(prev => ({ ...prev, status_filter: status }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, search_query: query }));
  }, []);

  const handleSort = useCallback((sortBy: typeof state.sort_by) => {
    setState(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const handleThreadClick = useCallback((threadId: string) => {
    onSelectThread?.(threadId);
  }, [onSelectThread]);

  const handleAcceptSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, status: 'accepted' as const } : s)
    );
    // In real implementation, would call API to create link
  }, []);

  const handleRejectSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev =>
      prev.map(s => s.id === suggestionId ? { ...s, status: 'rejected' as const } : s)
    );
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getActivityColor = (level: string): string => {
    switch (level) {
      case 'high': return '#22C55E';
      case 'medium': return '#EAB308';
      case 'low': return '#F97316';
      case 'dormant': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  // ============================================================================
  // RENDER
  // ============================================================================

  if (state.loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#9CA3AF',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '32px', 
            marginBottom: '12px',
            animation: 'pulse 2s infinite',
          }}>
            🧵
          </div>
          <div>Chargement des fils de connaissance...</div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span>🧵</span>
            <span>Knowledge Threads</span>
          </h1>
          <p style={{
            margin: '4px 0 0 36px',
            color: '#9CA3AF',
            fontSize: '14px',
          }}>
            {entityContext 
              ? `Fils liés à: ${entityContext.title}`
              : 'Continuité sémantique à travers le temps et les sphères'
            }
          </p>
        </div>

        <button
          onClick={onCreateThread}
          style={{
            padding: '10px 20px',
            background: THREAD_COLORS.sacredGold,
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          title="Créer un nouveau fil de connaissance"
        >
          <span>+</span>
          <span>Nouveau Fil</span>
        </button>
      </header>

      {/* ================================================================ */}
      {/* PENDING SUGGESTIONS */}
      {/* ================================================================ */}
      {pendingSuggestions.length > 0 && showSuggestions && (
        <div style={{
          padding: '16px 32px',
          background: `${THREAD_COLORS.sacredGold}10`,
          borderBottom: `1px solid ${THREAD_COLORS.sacredGold}30`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: THREAD_COLORS.sacredGold,
              fontWeight: 500,
            }}>
              <span>🤖</span>
              <span>Suggestions d'agent ({pendingSuggestions.length})</span>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Masquer
            </button>
          </div>

          {pendingSuggestions.map(suggestion => (
            <div
              key={suggestion.id}
              style={{
                padding: '16px',
                background: THREAD_COLORS.nightSlate,
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                    {suggestion.suggestion_type === 'link_existing' 
                      ? `Lier à "${suggestion.target_thread_title}"`
                      : `Créer: "${suggestion.suggested_title}"`
                    }
                  </div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                    Élément: {suggestion.entity.title}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                }}>
                  {Math.round(suggestion.confidence * 100)}% confiance
                </div>
              </div>

              <p style={{
                margin: '0 0 12px 0',
                fontSize: '13px',
                color: '#9CA3AF',
                fontStyle: 'italic',
              }}>
                "{suggestion.reason}"
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleAcceptSuggestion(suggestion.id)}
                  style={{
                    padding: '6px 16px',
                    background: '#22C55E',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ✓ Accepter
                </button>
                <button
                  onClick={() => handleRejectSuggestion(suggestion.id)}
                  style={{
                    padding: '6px 16px',
                    background: 'transparent',
                    border: '1px solid #6B7280',
                    borderRadius: '6px',
                    color: '#9CA3AF',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ✗ Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* FILTERS & SEARCH */}
      {/* ================================================================ */}
      <div style={{
        padding: '16px 32px',
        borderBottom: `1px solid ${THREAD_COLORS.nightSlate}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'active', 'dormant', 'closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              style={{
                padding: '8px 16px',
                background: state.status_filter === status 
                  ? THREAD_COLORS.nightSlate 
                  : 'transparent',
                border: state.status_filter === status
                  ? `1px solid ${THREAD_COLORS.sacredGold}40`
                  : `1px solid ${THREAD_COLORS.nightSlate}`,
                borderRadius: '6px',
                color: state.status_filter === status 
                  ? THREAD_COLORS.sacredGold 
                  : '#9CA3AF',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {status !== 'all' && (
                <span style={{ fontSize: '10px' }}>
                  {THREAD_STATUS_META[status].icon}
                </span>
              )}
              {status === 'all' ? 'Tous' : THREAD_STATUS_META[status].label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={state.search_query}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                background: THREAD_COLORS.nightSlate,
                border: `1px solid ${THREAD_COLORS.nightSlate}`,
                borderRadius: '6px',
                color: '#E5E7EB',
                fontSize: '14px',
                width: '200px',
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

          <select
            value={state.sort_by}
            onChange={(e) => handleSort(e.target.value as typeof state.sort_by)}
            style={{
              padding: '8px 12px',
              background: THREAD_COLORS.nightSlate,
              border: `1px solid ${THREAD_COLORS.nightSlate}`,
              borderRadius: '6px',
              color: '#E5E7EB',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <option value="recent">Plus récent</option>
            <option value="created">Date création</option>
            <option value="activity">Activité</option>
            <option value="name">Nom</option>
          </select>
        </div>
      </div>

      {/* ================================================================ */}
      {/* THREAD LIST */}
      {/* ================================================================ */}
      <div style={{ padding: '24px 32px' }}>
        {filteredThreads.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>
              🧵
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#9CA3AF' }}>
              Aucun fil trouvé
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {state.search_query 
                ? 'Essayez une autre recherche'
                : 'Créez votre premier fil de connaissance'
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {filteredThreads.map(thread => (
              <article
                key={thread.id}
                onClick={() => handleThreadClick(thread.id)}
                style={{
                  padding: '20px',
                  background: thread.id === highlightThreadId 
                    ? `${THREAD_COLORS.sacredGold}10`
                    : THREAD_COLORS.nightSlate,
                  border: thread.id === highlightThreadId
                    ? `1px solid ${THREAD_COLORS.sacredGold}40`
                    : `1px solid ${THREAD_COLORS.nightSlate}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: thread.status === 'dormant' ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = thread.color || THREAD_COLORS.sacredGold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = thread.id === highlightThreadId
                    ? `${THREAD_COLORS.sacredGold}40`
                    : THREAD_COLORS.nightSlate;
                }}
              >
                {/* Thread Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${thread.color || THREAD_COLORS.sacredGold}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}>
                      {thread.icon || '🧵'}
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#E5E7EB',
                      }}>
                        {thread.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '4px',
                        fontSize: '12px',
                        color: '#6B7280',
                      }}>
                        <span style={{ 
                          color: THREAD_STATUS_META[thread.status].color,
                          fontSize: '10px',
                        }}>
                          {THREAD_STATUS_META[thread.status].icon}
                        </span>
                        <span>{THREAD_STATUS_META[thread.status].label}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(thread.last_activity_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: `${getActivityColor(thread.activity_level)}15`,
                    borderRadius: '20px',
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getActivityColor(thread.activity_level),
                    }} />
                    <span style={{
                      fontSize: '11px',
                      color: getActivityColor(thread.activity_level),
                      textTransform: 'capitalize',
                    }}>
                      {thread.activity_level}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {thread.description && (
                  <p style={{
                    margin: '0 0 12px 52px',
                    color: '#9CA3AF',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}>
                    {thread.description}
                  </p>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginLeft: '52px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${THREAD_COLORS.obsidianBlack}`,
                }}>
                  {/* Sphere Coverage */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}>
                    {thread.sphere_coverage.slice(0, 4).map(sphere => (
                      <span
                        key={sphere}
                        style={{
                          padding: '2px 8px',
                          background: THREAD_COLORS.obsidianBlack,
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#9CA3AF',
                        }}
                      >
                        {sphere}
                      </span>
                    ))}
                    {thread.sphere_coverage.length > 4 && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '11px',
                        color: '#6B7280',
                      }}>
                        +{thread.sphere_coverage.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '12px',
                    color: '#6B7280',
                  }}>
                    <span title="Éléments liés">
                      🔗 {thread.entity_count}
                    </span>
                    {thread.unresolved_count > 0 && (
                      <span 
                        title="Questions non résolues"
                        style={{ color: '#EAB308' }}
                      >
                        ❓ {thread.unresolved_count}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <footer style={{
        padding: '16px 32px',
        borderTop: `1px solid ${THREAD_COLORS.nightSlate}`,
        textAlign: 'center',
        color: '#6B7280',
        fontSize: '12px',
      }}>
        {filteredThreads.length} fil{filteredThreads.length > 1 ? 's' : ''} affiché{filteredThreads.length > 1 ? 's' : ''} 
        {' '}• Threads = continuité sémantique, pas organisation
      </footer>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default KnowledgeThreads;
