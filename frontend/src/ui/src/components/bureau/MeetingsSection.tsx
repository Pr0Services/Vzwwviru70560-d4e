// CHE·NU™ Meetings Section — Bureau Meetings Management

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Meeting {
  id: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_type: 'sync' | 'review' | 'planning' | 'decision' | 'other';
  scheduled_at: string;
  duration_minutes: number;
  participants: { name: string; role: string }[];
  agenda: string[];
  notes: string;
  decisions: string[];
  action_items: { task: string; assignee: string }[];
  token_budget: number;
  tokens_used: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Weekly Team Sync',
    status: 'scheduled',
    meeting_type: 'sync',
    scheduled_at: '2024-01-16T10:00:00Z',
    duration_minutes: 30,
    participants: [
      { name: 'John Doe', role: 'Host' },
      { name: 'Jane Smith', role: 'Participant' },
      { name: 'Mike Johnson', role: 'Participant' },
    ],
    agenda: ['Project updates', 'Blockers discussion', 'Next week priorities'],
    notes: '',
    decisions: [],
    action_items: [],
    token_budget: 500,
    tokens_used: 0,
  },
  {
    id: 'm2',
    title: 'Q4 Strategy Review',
    status: 'completed',
    meeting_type: 'review',
    scheduled_at: '2024-01-15T14:00:00Z',
    duration_minutes: 60,
    participants: [
      { name: 'John Doe', role: 'Host' },
      { name: 'Leadership Team', role: 'Participant' },
    ],
    agenda: ['Q4 results', 'Lessons learned', 'Q1 planning'],
    notes: 'Discussed Q4 performance. Revenue targets met. Customer satisfaction improved.',
    decisions: ['Increase marketing budget by 15%', 'Hire 3 new engineers'],
    action_items: [
      { task: 'Prepare hiring plan', assignee: 'HR Team' },
      { task: 'Review marketing proposals', assignee: 'John Doe' },
    ],
    token_budget: 1000,
    tokens_used: 856,
  },
  {
    id: 'm3',
    title: 'Product Roadmap Planning',
    status: 'scheduled',
    meeting_type: 'planning',
    scheduled_at: '2024-01-17T15:00:00Z',
    duration_minutes: 90,
    participants: [
      { name: 'Jane Smith', role: 'Host' },
      { name: 'Product Team', role: 'Participant' },
      { name: 'Engineering Team', role: 'Participant' },
    ],
    agenda: ['Feature prioritization', 'Technical feasibility', 'Timeline discussion'],
    notes: '',
    decisions: [],
    action_items: [],
    token_budget: 800,
    tokens_used: 0,
  },
];

// ============================================================
// STYLES
// ============================================================

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
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    backgroundColor: '#0a0a0b',
    padding: '4px',
    borderRadius: '10px',
    width: 'fit-content',
  },
  tab: (isActive: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
  }),
  meetingsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  meetingCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  meetingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  meetingTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      scheduled: CHENU_COLORS.cenoteTurquoise,
      in_progress: CHENU_COLORS.sacredGold,
      completed: CHENU_COLORS.jungleEmerald,
      cancelled: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },
  meetingMeta: {
    display: 'flex',
    gap: '20px',
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
  },
  section: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  agendaList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  agendaItem: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    paddingLeft: '16px',
    position: 'relative' as const,
  },
  participantsList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  participant: {
    padding: '4px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.sacredGold,
    fontSize: '12px',
    cursor: 'pointer',
  },
  primaryButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const MeetingsSection: React.FC = () => {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const now = new Date();
  const filteredMeetings = meetings
    .filter(m => {
      const meetingDate = new Date(m.scheduled_at);
      return activeTab === 'upcoming' 
        ? meetingDate >= now || m.status === 'scheduled'
        : meetingDate < now || m.status === 'completed';
    })
    .sort((a, b) => {
      const dateA = new Date(a.scheduled_at);
      const dateB = new Date(b.scheduled_at);
      return activeTab === 'upcoming' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Meetings</h2>
        <button style={styles.createButton}>+ Schedule Meeting</button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === 'upcoming')} onClick={() => setActiveTab('upcoming')}>
          📅 Upcoming
        </button>
        <button style={styles.tab(activeTab === 'past')} onClick={() => setActiveTab('past')}>
          ✅ Past
        </button>
      </div>

      <div style={styles.meetingsList}>
        {filteredMeetings.map(meeting => (
          <div key={meeting.id} style={styles.meetingCard}>
            <div style={styles.meetingHeader}>
              <div>
                <h3 style={styles.meetingTitle}>{meeting.title}</h3>
                <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
                  {meeting.meeting_type.charAt(0).toUpperCase() + meeting.meeting_type.slice(1)}
                </span>
              </div>
              <span style={styles.statusBadge(meeting.status)}>{meeting.status}</span>
            </div>

            <div style={styles.meetingMeta}>
              <span>📅 {formatDateTime(meeting.scheduled_at)}</span>
              <span>⏱️ {meeting.duration_minutes} min</span>
              <span>👥 {meeting.participants.length} participants</span>
              <span>🎯 {meeting.tokens_used}/{meeting.token_budget} tokens</span>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionLabel}>Participants</div>
              <div style={styles.participantsList}>
                {meeting.participants.map((p, idx) => (
                  <span key={idx} style={styles.participant}>
                    {p.name} {p.role === 'Host' && '👑'}
                  </span>
                ))}
              </div>
            </div>

            {meeting.agenda.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Agenda</div>
                <div style={styles.agendaList}>
                  {meeting.agenda.map((item, idx) => (
                    <div key={idx} style={styles.agendaItem}>• {item}</div>
                  ))}
                </div>
              </div>
            )}

            {meeting.status === 'completed' && meeting.decisions.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Decisions Made</div>
                <div style={styles.agendaList}>
                  {meeting.decisions.map((d, idx) => (
                    <div key={idx} style={{ ...styles.agendaItem, color: CHENU_COLORS.jungleEmerald }}>✓ {d}</div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.actionButtons}>
              {meeting.status === 'scheduled' && (
                <>
                  <button style={styles.primaryButton}>Join Meeting</button>
                  <button style={styles.actionButton}>Edit</button>
                </>
              )}
              {meeting.status === 'completed' && (
                <>
                  <button style={styles.actionButton}>View Notes</button>
                  <button style={styles.actionButton}>Export Summary</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
          <p>No {activeTab} meetings</p>
        </div>
      )}
    </div>
  );
};

export default MeetingsSection;
