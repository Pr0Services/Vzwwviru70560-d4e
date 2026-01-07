// CHE·NU™ Collaboration Overview
// Contexte rapide, pas de surcharge
// ❌ Pas de graphiques, ❌ Pas de stats business

import React from 'react';
import { CHENU_COLORS } from '../../types';
import { CollaborationSpace, CollaborationMeeting, CollaborationNote } from './collaboration.types';

interface CollaborationOverviewProps {
  collaboration: CollaborationSpace;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    maxWidth: '900px',
  },
  
  // Vision Card
  visionCard: {
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.sacredGold}33`,
  },
  visionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '16px',
  },
  visionText: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: CHENU_COLORS.softSand,
  },
  
  // Grid pour les sections
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  
  // Card générique
  card: {
    backgroundColor: '#111113',
    borderRadius: '14px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  cardBadge: {
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 600,
  },
  
  // Objectives
  objectivesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  objectiveItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
  },
  objectiveStatus: (completed: boolean) => ({
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    backgroundColor: completed ? '#10B98122' : '#F59E0B22',
    color: completed ? '#10B981' : '#F59E0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
  }),
  objectiveText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.4,
  },
  
  // Next Meeting
  meetingCard: {
    padding: '16px',
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
  },
  meetingDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '8px',
  },
  meetingTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  meetingMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Recent Decisions
  decisionItem: {
    padding: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    marginBottom: '8px',
  },
  decisionTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  decisionMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '20px',
    color: CHENU_COLORS.ancientStone,
    fontSize: '13px',
  },
  
  // Quick Stats (simple, pas de graphiques)
  quickStats: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  stat: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 700,
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
};

// Mock data (à remplacer par vraies données)
const MOCK_OBJECTIVES = [
  { id: '1', text: 'Finaliser architecture module Collaboration', completed: true },
  { id: '2', text: 'Implémenter système d\'invitation', completed: false },
  { id: '3', text: 'Tests utilisateurs avec 3 collaborateurs', completed: false },
];

const MOCK_DECISIONS = [
  { id: '1', title: 'Collaboration dans Business Sphere, pas global', date: '27 Dec 2025' },
  { id: '2', title: 'Agents désactivés par défaut dans Collaboration', date: '26 Dec 2025' },
  { id: '3', title: 'Rôles simples: Observer, Contributor, Facilitator', date: '25 Dec 2025' },
];

const CollaborationOverview: React.FC<CollaborationOverviewProps> = ({ collaboration }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.container}>
      {/* Vision Card */}
      <div style={styles.visionCard}>
        <div style={styles.visionTitle}>
          <span>🎯</span>
          <span>Vision</span>
        </div>
        <div style={styles.visionText}>
          {collaboration.description || 
            `CHE·NU est un système d'exploitation pour intelligence gouvernée. 
            Cet espace de collaboration permet de co-construire la plateforme 
            avec une équipe alignée sur les principes de gouvernance, clarté, 
            et souveraineté utilisateur.`
          }
        </div>
      </div>
      
      {/* Grid: Objectives & Next Meeting */}
      <div style={styles.grid}>
        {/* Current Objectives */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <span>📌</span>
              <span>Current Objectives</span>
            </div>
            <span style={styles.cardBadge}>
              {MOCK_OBJECTIVES.filter(o => o.completed).length}/{MOCK_OBJECTIVES.length}
            </span>
          </div>
          
          <div style={styles.objectivesList}>
            {MOCK_OBJECTIVES.map(obj => (
              <div key={obj.id} style={styles.objectiveItem}>
                <div style={styles.objectiveStatus(obj.completed)}>
                  {obj.completed ? '✓' : '○'}
                </div>
                <div style={styles.objectiveText}>{obj.text}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Next Meeting */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <span>📅</span>
              <span>Next Meeting</span>
            </div>
          </div>
          
          {collaboration.next_meeting ? (
            <div style={styles.meetingCard}>
              <div style={styles.meetingDate}>
                <span>🕐</span>
                <span>{formatDate(collaboration.next_meeting.scheduled_at)}</span>
              </div>
              <div style={styles.meetingTitle}>{collaboration.next_meeting.title}</div>
              <div style={styles.meetingMeta}>
                <span>👥 {collaboration.next_meeting.participants.length} participants</span>
                <span>⏱️ {collaboration.next_meeting.duration_minutes} min</span>
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <span>No upcoming meetings</span>
            </div>
          )}
          
          {/* Quick Stats */}
          <div style={styles.quickStats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{collaboration.meetings_count}</div>
              <div style={styles.statLabel}>Meetings</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{collaboration.sessions_count}</div>
              <div style={styles.statLabel}>Sessions</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{collaboration.decisions_count}</div>
              <div style={styles.statLabel}>Decisions</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Decisions */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>
            <span>✅</span>
            <span>Recent Decisions</span>
          </div>
          <button style={{
            padding: '6px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            borderRadius: '8px',
            color: CHENU_COLORS.ancientStone,
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            View All →
          </button>
        </div>
        
        {MOCK_DECISIONS.map(decision => (
          <div key={decision.id} style={styles.decisionItem}>
            <div style={styles.decisionTitle}>
              <span style={{ color: '#10B981', marginRight: '8px' }}>✓</span>
              {decision.title}
            </div>
            <div style={styles.decisionMeta}>
              Decided on {decision.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationOverview;
