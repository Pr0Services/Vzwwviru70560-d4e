/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — THREADS SECTION CONNECTED                       ║
 * ║                    Connecté au threadStore (Zustand)                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Cette version utilise le threadStore au lieu de useState + mockData
 * 
 * PRINCIPE: Les données viennent du store, pas de l'état local
 */

import React, { useCallback, useMemo } from 'react';
import { useThreadStore, Thread, ThreadStatus } from '../../stores/thread.store';
import { CHENU_COLORS } from '../../types';
import ThreadEditor from './ThreadEditor';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ThreadsSectionConnectedProps {
  sphereId: string;
  projectId?: string;
}

type FilterStatus = ThreadStatus | 'all';
type FilterVisibility = 'all' | 'private' | 'shared' | 'public';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES (réutilisées de ThreadsSection)
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, color: CHENU_COLORS.softSand },
  createButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  filterButton: (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  }),
  threadsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  threadCard: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  threadIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  threadContent: { flex: 1 },
  threadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  threadTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      active: CHENU_COLORS.jungleEmerald,
      paused: '#f39c12',
      completed: CHENU_COLORS.cenoteTurquoise,
      archived: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: (colors[status] || CHENU_COLORS.ancientStone) + '22',
      color: colors[status] || CHENU_COLORS.ancientStone,
      textTransform: 'uppercase' as const,
    };
  },
  visibilityBadge: (visibility: string) => {
    const colors: Record<string, string> = {
      private: CHENU_COLORS.sacredGold,
      shared: CHENU_COLORS.cenoteTurquoise,
      public: CHENU_COLORS.jungleEmerald,
    };
    return {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: (colors[visibility] || CHENU_COLORS.ancientStone) + '22',
      color: colors[visibility] || CHENU_COLORS.ancientStone,
    };
  },
  threadMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  threadStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '8px',
  },
  tokenUsage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tokenBar: {
    width: '80px',
    height: '6px',
    backgroundColor: '#0a0a0b',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  tokenFill: (percent: number) => ({
    width: `${Math.min(percent, 100)}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
    transition: 'width 0.3s ease',
  }),
  tokenText: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    minWidth: '60px',
    textAlign: 'right' as const,
  },
  messageCount: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  tagsRow: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
    flexWrap: 'wrap' as const,
  },
  tag: {
    padding: '2px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
  },
  notice: {
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: `1px solid ${CHENU_COLORS.sacredGold}22`,
  },
  noticeText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: CHENU_COLORS.ancientStone,
  },
  storeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    borderRadius: '12px',
    fontSize: '10px',
    color: CHENU_COLORS.jungleEmerald,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const ThreadsSectionConnected: React.FC<ThreadsSectionConnectedProps> = ({
  sphereId,
  projectId,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNEXION AU STORE (au lieu de useState)
  // ─────────────────────────────────────────────────────────────────────────────
  const {
    threads,
    activeThreadId,
    createThread,
    updateThread,
    deleteThread,
    setActiveThread,
    getThreadsBySphere,
  } = useThreadStore();

  // État local pour les filtres et l'éditeur seulement
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>('all');
  const [visibilityFilter, setVisibilityFilter] = React.useState<FilterVisibility>('all');
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingThreadId, setEditingThreadId] = React.useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES FILTRÉES (depuis le store)
  // ─────────────────────────────────────────────────────────────────────────────
  const sphereThreads = useMemo(() => {
    // @ts-ignore - sphereId type compatibility
    return getThreadsBySphere(sphereId as any);
  }, [getThreadsBySphere, sphereId, threads]);

  const filteredThreads = useMemo(() => {
    return sphereThreads
      .filter(t => statusFilter === 'all' || t.status === statusFilter)
      .filter(t => visibilityFilter === 'all' || t.visibility === visibilityFilter)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [sphereThreads, statusFilter, visibilityFilter]);

  const editingThread = useMemo(() => {
    if (!editingThreadId) return null;
    return threads[editingThreadId] || null;
  }, [editingThreadId, threads]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCreateThread = useCallback(() => {
    setEditingThreadId(null);
    setShowEditor(true);
  }, []);

  const handleEditThread = useCallback((thread: Thread) => {
    setEditingThreadId(thread.id);
    setShowEditor(true);
  }, []);

  const handleSaveThread = useCallback(async (threadData: unknown) => {
    if (editingThreadId && editingThread) {
      // Update existing thread via store
      updateThread(editingThreadId, {
        title: threadData.title || editingThread.title,
        description: threadData.description,
        visibility: threadData.scope || editingThread.visibility,
        status: threadData.status || editingThread.status,
        tokenBudget: threadData.tokenBudget || editingThread.tokenBudget,
        tags: threadData.tags || editingThread.tags,
      });
    } else {
      // Create new thread via store
      createThread({
        title: threadData.title || 'Nouveau Thread',
        description: threadData.description,
        // @ts-ignore
        sphereId: sphereId as any,
        ownerId: 'current_user',
        tokenBudget: threadData.tokenBudget || 5000,
        tags: threadData.tags || [],
      });
    }

    setShowEditor(false);
    setEditingThreadId(null);
  }, [editingThreadId, editingThread, updateThread, createThread, sphereId]);

  const handleDeleteThread = useCallback(async (threadId: string) => {
    deleteThread(threadId);
    setShowEditor(false);
    setEditingThreadId(null);
  }, [deleteThread]);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setEditingThreadId(null);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const threadCount = sphereThreads.length;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={styles.title}>Threads (.chenu)</h2>
          <span style={styles.storeIndicator}>
            🔗 Store connecté • {threadCount} threads
          </span>
        </div>
        <button style={styles.createButton} onClick={handleCreateThread}>
          + New Thread
        </button>
      </div>

      {/* Notice */}
      <div style={styles.notice}>
        <span style={{ fontSize: '20px' }}>💬</span>
        <span style={styles.noticeText}>
          Threads sont des <strong>OBJETS DE PREMIÈRE CLASSE</strong> — lignes de pensée persistantes avec 
          budgets tokens, règles d'encodage, et historique complet d'audit.
        </span>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button 
          style={styles.filterButton(statusFilter === 'all')} 
          onClick={() => setStatusFilter('all')}
        >
          Tous
        </button>
        <button 
          style={styles.filterButton(statusFilter === 'active')} 
          onClick={() => setStatusFilter('active')}
        >
          Actifs
        </button>
        <button 
          style={styles.filterButton(statusFilter === 'completed')} 
          onClick={() => setStatusFilter('completed')}
        >
          Complétés
        </button>
        <button 
          style={styles.filterButton(statusFilter === 'paused')} 
          onClick={() => setStatusFilter('paused')}
        >
          En pause
        </button>
        
        <span style={{ width: '1px', backgroundColor: CHENU_COLORS.ancientStone + '44', margin: '0 8px' }} />
        
        <button 
          style={styles.filterButton(visibilityFilter === 'private')} 
          onClick={() => setVisibilityFilter(visibilityFilter === 'private' ? 'all' : 'private')}
        >
          Privé
        </button>
        <button 
          style={styles.filterButton(visibilityFilter === 'shared')} 
          onClick={() => setVisibilityFilter(visibilityFilter === 'shared' ? 'all' : 'shared')}
        >
          Partagé
        </button>
        <button 
          style={styles.filterButton(visibilityFilter === 'public')} 
          onClick={() => setVisibilityFilter(visibilityFilter === 'public' ? 'all' : 'public')}
        >
          Public
        </button>
      </div>

      {/* Threads List */}
      <div style={styles.threadsList}>
        {filteredThreads.map(thread => {
          const tokenPercent = thread.tokenBudget > 0 
            ? (thread.tokensUsed / thread.tokenBudget) * 100 
            : 0;
          const isActive = activeThreadId === thread.id;
          
          return (
            <div
              key={thread.id}
              style={styles.threadCard(isActive)}
              onClick={() => handleEditThread(thread)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleEditThread(thread)}
            >
              <div style={styles.threadIcon}>💬</div>
              
              <div style={styles.threadContent}>
                <div style={styles.threadHeader}>
                  <span style={styles.threadTitle}>{thread.title}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={styles.visibilityBadge(thread.visibility)}>
                      {thread.visibility}
                    </span>
                    <span style={styles.statusBadge(thread.status)}>
                      {thread.status}
                    </span>
                  </div>
                </div>
                
                <div style={styles.threadMeta}>
                  <span>📅 {formatTime(thread.updatedAt)}</span>
                  <span>💬 {thread.messages.length} messages</span>
                  <span>📋 {thread.decisions.length} décisions</span>
                </div>
                
                {thread.tags.length > 0 && (
                  <div style={styles.tagsRow}>
                    {thread.tags.map((tag, idx) => (
                      <span key={idx} style={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div style={styles.threadStats}>
                <div style={styles.tokenUsage}>
                  <div style={styles.tokenBar}>
                    <div style={styles.tokenFill(tokenPercent)} />
                  </div>
                  <span style={styles.tokenText}>
                    {thread.tokensUsed}/{thread.tokenBudget}
                  </span>
                </div>
                <span style={styles.messageCount}>
                  Score: {thread.encodingQualityScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredThreads.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>💬</p>
          <p>Aucun thread trouvé</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Créez votre premier thread pour commencer
          </p>
        </div>
      )}

      {/* Thread Editor Modal */}
      {showEditor && (
        <ThreadEditor
          thread={editingThread ? {
            id: editingThread.id,
            title: editingThread.title,
            description: editingThread.description || '',
            owner: { 
              id: editingThread.ownerId, 
              name: 'Current User', 
              role: 'owner', 
              addedAt: editingThread.createdAt 
            },
            scope: editingThread.visibility,
            status: editingThread.status,
            priority: 'normal',
            participants: editingThread.collaborators.map((c, i) => ({
              id: `p${i}`,
              name: c,
              role: 'contributor',
              addedAt: editingThread.createdAt,
            })),
            tokenBudget: editingThread.tokenBudget,
            tokensUsed: editingThread.tokensUsed,
            tokenReserve: 0,
            sphereId: sphereId,
            projectId: projectId,
            tags: editingThread.tags,
            encoding: { 
              level: editingThread.encodingMode, 
              autoOptimize: true, 
              preserveContext: true 
            },
            governance: {
              requireApprovalFor: ['share', 'delete'],
              approvers: [],
              maxTokensPerMessage: 500,
              allowAgentExecution: false,
              auditLevel: 'standard',
            },
            messageCount: editingThread.messages.length,
            lastMessageAt: editingThread.updatedAt,
            createdAt: editingThread.createdAt,
            updatedAt: editingThread.updatedAt,
            linkedDataspaces: [],
            linkedMeetings: [],
          } : undefined}
          sphereId={sphereId}
          projectId={projectId}
          onSave={handleSaveThread}
          onClose={handleCloseEditor}
          onDelete={editingThread ? handleDeleteThread : undefined}
        />
      )}
    </div>
  );
};

export default ThreadsSectionConnected;
