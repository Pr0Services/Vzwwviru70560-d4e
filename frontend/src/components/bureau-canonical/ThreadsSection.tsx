/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — THREADS SECTION (CANONICAL)                           ║
 * ║              Bureau Section L2-3: 💬 Threads (.chenu)                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  RÈGLES (MEMORY PROMPT):                                                     ║
 * ║  - Threads are FIRST-CLASS OBJECTS                                           ║
 * ║  - Has owner and scope                                                       ║
 * ║  - Has token budget                                                          ║
 * ║  - Has encoding rules                                                        ║
 * ║  - Records decisions and history                                             ║
 * ║  - Is auditable                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../constants/colors';
import { BUREAU_SECTIONS } from '../../types/bureau.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ThreadStatus = 'active' | 'paused' | 'archived' | 'completed';
type ThreadScope = 'private' | 'team' | 'sphere' | 'cross-sphere';

interface Thread {
  id: string;
  title: string;
  sphereId: string;
  ownerId: string;
  scope: ThreadScope;
  status: ThreadStatus;
  
  // Token governance
  tokenBudget: number;
  tokenUsed: number;
  
  // Encoding
  encodingRules: string[];
  qualityScore: number;
  
  // History
  messageCount: number;
  decisionCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  
  // Audit
  isAuditable: boolean;
  auditTrailHash?: string;
}

interface ThreadsSectionProps {
  sphereId: string;
  onOpenThread?: (thread: Thread) => void;
  onCreateThread?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_CONFIG = BUREAU_SECTIONS.threads;

const STATUS_CONFIG: Record<ThreadStatus, { label: string; color: string; icon: string }> = {
  active: { label: 'Actif', color: CHENU_COLORS.jungleEmerald, icon: '🟢' },
  paused: { label: 'Pausé', color: CHENU_COLORS.sacredGold, icon: '⏸️' },
  archived: { label: 'Archivé', color: CHENU_COLORS.ancientStone, icon: '📦' },
  completed: { label: 'Terminé', color: CHENU_COLORS.cenoteTurquoise, icon: '✅' },
};

const SCOPE_CONFIG: Record<ThreadScope, { label: string; icon: string }> = {
  private: { label: 'Privé', icon: '🔒' },
  team: { label: 'Équipe', icon: '👥' },
  sphere: { label: 'Sphère', icon: '🔵' },
  'cross-sphere': { label: 'Multi-sphères', icon: '🌐' },
};

// Mock data
const MOCK_THREADS: Thread[] = [
  {
    id: 'thread-1',
    title: 'Planification Stratégique Q1 2026',
    sphereId: 'business',
    ownerId: 'user-1',
    scope: 'team',
    status: 'active',
    tokenBudget: 5000,
    tokenUsed: 1250,
    encodingRules: ['business-context', 'decision-tracking'],
    qualityScore: 87,
    messageCount: 24,
    decisionCount: 3,
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 15),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    isAuditable: true,
    auditTrailHash: 'a1b2c3d4...',
  },
  {
    id: 'thread-2',
    title: 'Revue Architecture Technique',
    sphereId: 'business',
    ownerId: 'user-1',
    scope: 'sphere',
    status: 'active',
    tokenBudget: 3000,
    tokenUsed: 2100,
    encodingRules: ['technical-spec', 'code-review'],
    qualityScore: 92,
    messageCount: 42,
    decisionCount: 7,
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isAuditable: true,
  },
  {
    id: 'thread-3',
    title: 'Notes personnelles projet',
    sphereId: 'personal',
    ownerId: 'user-1',
    scope: 'private',
    status: 'paused',
    tokenBudget: 1000,
    tokenUsed: 450,
    encodingRules: ['minimal'],
    qualityScore: 75,
    messageCount: 12,
    decisionCount: 0,
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    isAuditable: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  createBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  filterBtn: (isActive: boolean) => ({
    padding: '6px 12px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : CHENU_COLORS.ancientStone + '22',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
  }),
  threadsList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
  },
  threadCard: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '16px',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  threadTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  threadMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  statusBadge: (status: ThreadStatus) => ({
    padding: '4px 8px',
    borderRadius: '10px',
    backgroundColor: STATUS_CONFIG[status].color + '22',
    color: STATUS_CONFIG[status].color,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),
  tokenBar: {
    marginTop: '12px',
  },
  tokenLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '4px',
  },
  tokenProgress: {
    height: '6px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  tokenFill: (percentage: number) => ({
    height: '100%',
    width: `${Math.min(percentage, 100)}%`,
    backgroundColor: percentage > 80 
      ? '#ef4444' 
      : percentage > 60 
        ? CHENU_COLORS.sacredGold 
        : CHENU_COLORS.cenoteTurquoise,
    borderRadius: '3px',
  }),
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  stats: {
    display: 'flex',
    gap: '16px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  qualityBadge: (score: number) => ({
    padding: '4px 8px',
    borderRadius: '8px',
    backgroundColor: score >= 80 
      ? CHENU_COLORS.jungleEmerald + '22' 
      : score >= 60 
        ? CHENU_COLORS.sacredGold + '22'
        : '#ef4444' + '22',
    color: score >= 80 
      ? CHENU_COLORS.jungleEmerald 
      : score >= 60 
        ? CHENU_COLORS.sacredGold
        : '#ef4444',
    fontSize: '11px',
    fontWeight: 600,
  }),
  auditBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.cenoteTurquoise,
    padding: '3px 6px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    borderRadius: '4px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
    gap: '16px',
    padding: '40px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ThreadsSection: React.FC<ThreadsSectionProps> = ({
  sphereId,
  onOpenThread,
  onCreateThread,
}) => {
  const [threads] = useState<Thread[]>(MOCK_THREADS);
  const [statusFilter, setStatusFilter] = useState<ThreadStatus | 'all'>('all');

  // Filter threads
  const filteredThreads = useMemo(() => {
    if (statusFilter === 'all') return threads;
    return threads.filter(t => t.status === statusFilter);
  }, [threads, statusFilter]);

  // Handlers
  const handleOpen = useCallback((thread: Thread) => {
    if (onOpenThread) {
      onOpenThread(thread);
    }
  }, [onOpenThread]);

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
          <span style={{ 
            fontSize: '12px', 
            color: CHENU_COLORS.ancientStone,
            fontWeight: 400,
          }}>
            (.chenu)
          </span>
        </div>
        <motion.button
          style={styles.createBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateThread}
        >
          ➕ Nouveau Thread
        </motion.button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {(['all', 'active', 'paused', 'completed', 'archived'] as const).map((status) => (
          <motion.button
            key={status}
            style={styles.filterBtn(statusFilter === status)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? '📋 Tous' : `${STATUS_CONFIG[status].icon} ${STATUS_CONFIG[status].label}`}
          </motion.button>
        ))}
      </div>

      {/* Threads List */}
      <div style={styles.threadsList}>
        <AnimatePresence>
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => {
              const tokenPercentage = (thread.tokenUsed / thread.tokenBudget) * 100;
              
              return (
                <motion.div
                  key={thread.id}
                  style={styles.threadCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    borderColor: CHENU_COLORS.sacredGold + '44',
                    boxShadow: `0 4px 20px ${CHENU_COLORS.sacredGold}11`,
                  }}
                  onClick={() => handleOpen(thread)}
                >
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.threadTitle}>{thread.title}</div>
                      <div style={styles.threadMeta}>
                        <span>{SCOPE_CONFIG[thread.scope].icon} {SCOPE_CONFIG[thread.scope].label}</span>
                        <span>•</span>
                        <span>Dernière activité: {formatTimeAgo(thread.lastActivityAt)}</span>
                      </div>
                    </div>
                    <div style={styles.statusBadge(thread.status)}>
                      {STATUS_CONFIG[thread.status].icon}
                      {STATUS_CONFIG[thread.status].label}
                    </div>
                  </div>

                  {/* Token Budget Bar */}
                  <div style={styles.tokenBar}>
                    <div style={styles.tokenLabel}>
                      <span>💎 Budget Tokens</span>
                      <span>{thread.tokenUsed.toLocaleString()} / {thread.tokenBudget.toLocaleString()}</span>
                    </div>
                    <div style={styles.tokenProgress}>
                      <motion.div 
                        style={styles.tokenFill(tokenPercentage)}
                        initial={{ width: 0 }}
                        animate={{ width: `${tokenPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <div style={styles.stats}>
                      <span style={styles.stat}>💬 {thread.messageCount} messages</span>
                      <span style={styles.stat}>📋 {thread.decisionCount} décisions</span>
                      {thread.isAuditable && (
                        <span style={styles.auditBadge}>
                          🔐 Auditable
                        </span>
                      )}
                    </div>
                    <div style={styles.qualityBadge(thread.qualityScore)}>
                      📊 {thread.qualityScore}%
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <span style={{ fontSize: '48px' }}>💬</span>
              <p style={{ fontSize: '16px', color: CHENU_COLORS.softSand }}>
                Aucun thread {statusFilter !== 'all' ? STATUS_CONFIG[statusFilter].label.toLowerCase() : ''}
              </p>
              <p>Les threads .chenu sont des objets de première classe avec gouvernance intégrée</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThreadsSection;
