// CHE·NU™ Collaboration Working Sessions
// Objectif: Travail réel (synchrone ou asynchrone)
// 👉 Pas de blabla. Une session = un objectif clair.

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { WorkingSession, WorkingSessionStatus } from './collaboration.types';

interface CollaborationWorkingSessionsProps {
  collaborationId: string;
  canContribute: boolean;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  
  // Filters
  filters: {
    display: 'flex',
    gap: '8px',
  },
  filterChip: (isActive: boolean) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : '#111113',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone + '22'}`,
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  
  // Session Grid
  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '16px',
  },
  
  // Session Card
  sessionCard: (status: WorkingSessionStatus) => {
    const borderColors = {
      active: CHENU_COLORS.cenoteTurquoise,
      planned: CHENU_COLORS.sacredGold,
      completed: CHENU_COLORS.ancientStone,
      cancelled: '#EF4444',
    };
    return {
      backgroundColor: '#111113',
      borderRadius: '14px',
      border: `1px solid ${borderColors[status]}33`,
      overflow: 'hidden',
      transition: 'all 0.15s ease',
    };
  },
  sessionHeader: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },
  sessionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  statusIndicator: (status: WorkingSessionStatus) => {
    const colors = {
      active: { bg: '#10B98122', color: '#10B981', dot: '#10B981' },
      planned: { bg: '#F59E0B22', color: '#F59E0B', dot: '#F59E0B' },
      completed: { bg: '#6B728022', color: '#6B7280', dot: '#6B7280' },
      cancelled: { bg: '#EF444422', color: '#EF4444', dot: '#EF4444' },
    };
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      backgroundColor: colors[status].bg,
      color: colors[status].color,
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 600,
    };
  },
  statusDot: (status: WorkingSessionStatus) => {
    const colors = {
      active: '#10B981',
      planned: '#F59E0B',
      completed: '#6B7280',
      cancelled: '#EF4444',
    };
    return {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: colors[status],
      animation: status === 'active' ? 'pulse 2s infinite' : 'none',
    };
  },
  
  sessionBody: {
    padding: '0 20px 16px',
  },
  
  // Goal & Scope
  goalSection: {
    marginBottom: '16px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  goalText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.5,
    padding: '10px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
  },
  
  // Participants
  participantsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  avatarStack: {
    display: 'flex',
  },
  avatar: (index: number) => ({
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    border: '2px solid #111113',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 600,
    marginLeft: index > 0 ? '-8px' : '0',
  }),
  
  // Outputs
  outputsSection: {
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
    padding: '12px 0 0',
  },
  outputItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    marginTop: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  outputIcon: (type: string) => {
    const icons: Record<string, string> = {
      document: '📄',
      code: '💻',
      design: '🎨',
      decision: '✅',
      other: '📎',
    };
    return icons[type] || '📎';
  },
  
  // Actions
  sessionActions: {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
    backgroundColor: '#0a0a0b',
  },
  actionBtn: (primary: boolean) => ({
    flex: 1,
    padding: '8px 12px',
    backgroundColor: primary ? CHENU_COLORS.sacredGold : 'transparent',
    color: primary ? '#000' : CHENU_COLORS.softSand,
    border: primary ? 'none' : `1px solid ${CHENU_COLORS.ancientStone}44`,
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  }),
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: '#111113',
    borderRadius: '14px',
    border: `1px dashed ${CHENU_COLORS.ancientStone}44`,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '20px',
  },
  createButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

// Mock data
const MOCK_SESSIONS: WorkingSession[] = [
  {
    id: '1',
    collaboration_id: '1',
    title: 'Implémenter Collaboration Types',
    goal: 'Définir tous les types TypeScript pour le module Collaboration',
    scope: 'Types, interfaces, enums pour Meetings, Sessions, Notes, Vision',
    status: 'completed',
    scheduled_at: '2025-12-28T09:00:00Z',
    started_at: '2025-12-28T09:15:00Z',
    completed_at: '2025-12-28T11:30:00Z',
    participants: ['Jonathan', 'Claude'],
    work_notes: 'Types créés avec succès. 250+ lignes de définitions.',
    outputs: [
      { id: '1', session_id: '1', title: 'collaboration.types.ts', type: 'code', url: null, description: 'Tous les types du module', created_at: '2025-12-28T11:30:00Z' },
    ],
    created_by: '1',
    created_at: '2025-12-27T16:00:00Z',
  },
  {
    id: '2',
    collaboration_id: '1',
    title: 'Build CollaborationSpace Component',
    goal: 'Créer le composant principal avec navigation interne',
    scope: 'Layout, sidebar, navigation entre sections',
    status: 'active',
    scheduled_at: null,
    started_at: '2025-12-28T14:00:00Z',
    completed_at: null,
    participants: ['Jonathan', 'Claude'],
    work_notes: 'En cours de développement...',
    outputs: [],
    created_by: '1',
    created_at: '2025-12-28T13:00:00Z',
  },
  {
    id: '3',
    collaboration_id: '1',
    title: 'Système d\'invitation',
    goal: 'Permettre d\'inviter des collaborateurs par email ou recherche',
    scope: 'Modal invitation, validation email, rôles',
    status: 'planned',
    scheduled_at: '2025-12-29T10:00:00Z',
    started_at: null,
    completed_at: null,
    participants: ['Jonathan'],
    work_notes: '',
    outputs: [],
    created_by: '1',
    created_at: '2025-12-28T13:00:00Z',
  },
];

const CollaborationWorkingSessions: React.FC<CollaborationWorkingSessionsProps> = ({
  collaborationId,
  canContribute,
}) => {
  const [filter, setFilter] = useState<'all' | WorkingSessionStatus>('all');
  
  const filteredSessions = filter === 'all' 
    ? MOCK_SESSIONS 
    : MOCK_SESSIONS.filter(s => s.status === filter);
  
  const getStatusLabel = (status: WorkingSessionStatus) => {
    const labels = {
      active: 'In Progress',
      planned: 'Planned',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status];
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.container}>
      {/* Filters */}
      <div style={styles.filters}>
        {(['all', 'active', 'planned', 'completed'] as const).map(f => (
          <button
            key={f}
            style={styles.filterChip(filter === f)}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Sessions' : getStatusLabel(f as WorkingSessionStatus)}
            {f !== 'all' && (
              <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                ({MOCK_SESSIONS.filter(s => s.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div style={styles.sessionsGrid}>
          {filteredSessions.map(session => (
            <div key={session.id} style={styles.sessionCard(session.status)}>
              <div style={styles.sessionHeader}>
                <div style={{ flex: 1 }}>
                  <div style={styles.sessionTitle}>{session.title}</div>
                </div>
                <div style={styles.statusIndicator(session.status)}>
                  <span style={styles.statusDot(session.status)} />
                  {getStatusLabel(session.status)}
                </div>
              </div>
              
              <div style={styles.sessionBody}>
                {/* Goal */}
                <div style={styles.goalSection}>
                  <div style={styles.sectionLabel}>🎯 Goal</div>
                  <div style={styles.goalText}>{session.goal}</div>
                </div>
                
                {/* Scope */}
                <div style={styles.goalSection}>
                  <div style={styles.sectionLabel}>📐 Scope</div>
                  <div style={styles.goalText}>{session.scope}</div>
                </div>
                
                {/* Participants */}
                <div style={styles.participantsRow}>
                  <div style={styles.avatarStack}>
                    {session.participants.map((p, i) => (
                      <div key={i} style={styles.avatar(i)} title={p}>
                        {getInitials(p)}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                    {session.participants.length} participant{session.participants.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Outputs */}
                {session.outputs.length > 0 && (
                  <div style={styles.outputsSection}>
                    <div style={styles.sectionLabel}>📦 Outputs ({session.outputs.length})</div>
                    {session.outputs.map(output => (
                      <div key={output.id} style={styles.outputItem}>
                        <span>{styles.outputIcon(output.type)}</span>
                        <span>{output.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              {canContribute && (
                <div style={styles.sessionActions}>
                  {session.status === 'planned' && (
                    <button style={styles.actionBtn(true)}>
                      <span>▶️</span>
                      <span>Start Session</span>
                    </button>
                  )}
                  {session.status === 'active' && (
                    <>
                      <button style={styles.actionBtn(false)}>
                        <span>📝</span>
                        <span>Add Notes</span>
                      </button>
                      <button style={styles.actionBtn(true)}>
                        <span>✓</span>
                        <span>Complete</span>
                      </button>
                    </>
                  )}
                  {session.status === 'completed' && (
                    <button style={styles.actionBtn(false)}>
                      <span>👁️</span>
                      <span>View Details</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🛠️</div>
          <div style={styles.emptyTitle}>No working sessions</div>
          <div style={styles.emptyText}>
            Create a session to start working on specific goals
          </div>
          {canContribute && (
            <button style={styles.createButton}>
              <span>+</span>
              <span>New Working Session</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationWorkingSessions;
