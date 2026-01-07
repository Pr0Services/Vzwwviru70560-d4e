// CHE·NU™ Collaboration Meetings
// Objectif: Décisions synchrones
// Structure: Context → Agenda → Notes → Decisions → Action Items

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { CollaborationMeeting, MeetingStatus } from './collaboration.types';

interface CollaborationMeetingsProps {
  collaborationId: string;
  canFacilitate: boolean;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  
  // Tabs
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    width: 'fit-content',
  },
  tab: (isActive: boolean) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  
  // Meeting List
  meetingsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  
  // Meeting Card
  meetingCard: {
    backgroundColor: '#111113',
    borderRadius: '14px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  meetingCardHeader: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: '15px',
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
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusBadge: (status: MeetingStatus) => {
    const colors = {
      upcoming: { bg: '#3B82F622', color: '#3B82F6' },
      in_progress: { bg: '#10B98122', color: '#10B981' },
      completed: { bg: '#6B728022', color: '#6B7280' },
      cancelled: { bg: '#EF444422', color: '#EF4444' },
    };
    return {
      padding: '4px 10px',
      backgroundColor: colors[status].bg,
      color: colors[status].color,
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'capitalize' as const,
    };
  },
  
  // Meeting Preview (agenda, decisions)
  meetingPreview: {
    padding: '0 20px 16px',
    display: 'flex',
    gap: '24px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
    paddingTop: '12px',
  },
  previewSection: {
    flex: 1,
  },
  previewTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  previewItem: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    padding: '6px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
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
const MOCK_MEETINGS: CollaborationMeeting[] = [
  {
    id: '1',
    collaboration_id: '1',
    title: 'Sprint Planning - Module Collaboration',
    scheduled_at: '2025-12-30T14:00:00Z',
    duration_minutes: 60,
    status: 'upcoming',
    context: 'Planification du développement du module Collaboration',
    agenda: [
      { id: '1', title: 'Review specs', duration_minutes: 15, presenter: 'Jo', completed: false },
      { id: '2', title: 'Define tasks', duration_minutes: 30, presenter: null, completed: false },
      { id: '3', title: 'Assign ownership', duration_minutes: 15, presenter: null, completed: false },
    ],
    notes: '',
    decisions: [],
    action_items: [],
    participants: [
      { user_id: '1', name: 'Jonathan', email: 'jo@che-nu.com', status: 'accepted' },
      { user_id: '2', name: 'Claude', email: 'claude@anthropic.com', status: 'accepted' },
    ],
    created_by: '1',
    created_at: '2025-12-28T10:00:00Z',
  },
  {
    id: '2',
    collaboration_id: '1',
    title: 'Architecture Review - Vision Principles',
    scheduled_at: '2025-12-27T10:00:00Z',
    duration_minutes: 45,
    status: 'completed',
    context: 'Validation de l\'architecture du module Vision & Principles',
    agenda: [
      { id: '1', title: 'Present structure', duration_minutes: 15, presenter: 'Jo', completed: true },
      { id: '2', title: 'Discuss sections', duration_minutes: 20, presenter: null, completed: true },
      { id: '3', title: 'Finalize', duration_minutes: 10, presenter: null, completed: true },
    ],
    notes: 'Architecture validée. 5 sections confirmées.',
    decisions: [
      { id: '1', meeting_id: '2', title: '5 sections pour Vision: Mission, Values, Design Principles, Ethical Boundaries, Non-Negotiables', description: '', decided_at: '2025-12-27T11:00:00Z', decided_by: ['1'] },
    ],
    action_items: [
      { id: '1', source_type: 'meeting', source_id: '2', title: 'Implémenter composant VisionPrinciples', description: null, assignee_id: '1', assignee_name: 'Jo', due_date: '2025-12-29', status: 'completed', created_at: '2025-12-27T11:00:00Z', completed_at: '2025-12-28T15:00:00Z' },
    ],
    participants: [
      { user_id: '1', name: 'Jonathan', email: 'jo@che-nu.com', status: 'attended' },
    ],
    created_by: '1',
    created_at: '2025-12-26T10:00:00Z',
  },
];

const CollaborationMeetings: React.FC<CollaborationMeetingsProps> = ({
  collaborationId,
  canFacilitate,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const upcomingMeetings = MOCK_MEETINGS.filter(m => m.status === 'upcoming' || m.status === 'in_progress');
  const pastMeetings = MOCK_MEETINGS.filter(m => m.status === 'completed' || m.status === 'cancelled');
  
  const meetings = activeTab === 'upcoming' ? upcomingMeetings : pastMeetings;
  
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

  const getStatusLabel = (status: MeetingStatus) => {
    const labels = {
      upcoming: 'Upcoming',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status];
  };

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          style={styles.tab(activeTab === 'upcoming')}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingMeetings.length})
        </button>
        <button 
          style={styles.tab(activeTab === 'past')}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastMeetings.length})
        </button>
      </div>
      
      {/* Meetings List */}
      {meetings.length > 0 ? (
        <div style={styles.meetingsList}>
          {meetings.map(meeting => (
            <div 
              key={meeting.id} 
              style={styles.meetingCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = CHENU_COLORS.sacredGold + '44'}
              onMouseLeave={e => e.currentTarget.style.borderColor = CHENU_COLORS.ancientStone + '22'}
            >
              <div style={styles.meetingCardHeader}>
                <div style={styles.meetingInfo}>
                  <div style={styles.meetingTitle}>{meeting.title}</div>
                  <div style={styles.meetingMeta}>
                    <div style={styles.metaItem}>
                      <span>📅</span>
                      <span>{formatDate(meeting.scheduled_at)}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <span>⏱️</span>
                      <span>{meeting.duration_minutes} min</span>
                    </div>
                    <div style={styles.metaItem}>
                      <span>👥</span>
                      <span>{meeting.participants.length} participants</span>
                    </div>
                  </div>
                </div>
                <div style={styles.statusBadge(meeting.status)}>
                  {getStatusLabel(meeting.status)}
                </div>
              </div>
              
              {/* Preview */}
              <div style={styles.meetingPreview}>
                <div style={styles.previewSection}>
                  <div style={styles.previewTitle}>Agenda</div>
                  {meeting.agenda.slice(0, 3).map(item => (
                    <div key={item.id} style={styles.previewItem}>
                      <span style={{ color: item.completed ? '#10B981' : CHENU_COLORS.ancientStone }}>
                        {item.completed ? '✓' : '○'}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
                
                {meeting.decisions.length > 0 && (
                  <div style={styles.previewSection}>
                    <div style={styles.previewTitle}>Decisions ({meeting.decisions.length})</div>
                    {meeting.decisions.slice(0, 2).map(decision => (
                      <div key={decision.id} style={styles.previewItem}>
                        <span style={{ color: '#10B981' }}>✓</span>
                        <span style={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                        }}>
                          {decision.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <div style={styles.emptyTitle}>
            {activeTab === 'upcoming' ? 'No upcoming meetings' : 'No past meetings'}
          </div>
          <div style={styles.emptyText}>
            {activeTab === 'upcoming' 
              ? 'Schedule a meeting to align with your team'
              : 'Past meetings will appear here'
            }
          </div>
          {canFacilitate && activeTab === 'upcoming' && (
            <button style={styles.createButton}>
              <span>+</span>
              <span>Schedule Meeting</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationMeetings;
