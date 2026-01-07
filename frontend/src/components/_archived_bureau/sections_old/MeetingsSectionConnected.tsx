/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MEETINGS SECTION CONNECTED                      ║
 * ║                    Connecté au meetingStore (Zustand)                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ALIGNEMENT:
 * - Utilise le meetingStore au lieu de useState + mockData
 * - Types alignés avec le store (camelCase)
 * 
 * MeetingStatus: scheduled | in_progress | completed | cancelled | rescheduled
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { useMeetingStore, Meeting, MeetingStatus, Attendee } from '../../stores/meetingStore';
import { CHENU_COLORS } from '../../types';
import MeetingEditor from './MeetingEditor';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MeetingsSectionConnectedProps {
  sphereId: string;
  projectId?: string;
}

// Meeting type config
const MEETING_TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  sync: { icon: '🔄', label: 'Sync', color: CHENU_COLORS.cenoteTurquoise },
  review: { icon: '📋', label: 'Review', color: '#9b59b6' },
  planning: { icon: '📅', label: 'Planning', color: CHENU_COLORS.sacredGold },
  decision: { icon: '⚖️', label: 'Decision', color: CHENU_COLORS.jungleEmerald },
  other: { icon: '📝', label: 'Autre', color: CHENU_COLORS.ancientStone },
};

// Status config
const STATUS_CONFIG: Record<MeetingStatus, { icon: string; label: string; color: string }> = {
  scheduled: { icon: '📅', label: 'Planifié', color: CHENU_COLORS.cenoteTurquoise },
  in_progress: { icon: '▶️', label: 'En cours', color: CHENU_COLORS.sacredGold },
  completed: { icon: '✅', label: 'Terminé', color: CHENU_COLORS.jungleEmerald },
  cancelled: { icon: '❌', label: 'Annulé', color: '#e74c3c' },
  rescheduled: { icon: '🔄', label: 'Reporté', color: '#f39c12' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
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
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  viewButton: (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : '#111113',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  }),
  // Calendar View
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '24px',
  },
  calendarHeader: {
    padding: '8px',
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
  },
  calendarDay: (isToday: boolean, hasMeeting: boolean) => ({
    padding: '8px',
    minHeight: '80px',
    backgroundColor: isToday ? CHENU_COLORS.sacredGold + '11' : '#111113',
    borderRadius: '8px',
    border: `1px solid ${isToday ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone}22`,
  }),
  dayNumber: (isToday: boolean) => ({
    fontSize: '12px',
    fontWeight: isToday ? 600 : 400,
    color: isToday ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    marginBottom: '4px',
  }),
  // List View
  meetingsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  meetingCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  meetingTime: {
    minWidth: '80px',
    textAlign: 'center' as const,
  },
  meetingTimeText: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  meetingDate: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  meetingContent: { flex: 1 },
  meetingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  meetingTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  statusBadge: (status: MeetingStatus) => ({
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: STATUS_CONFIG[status].color + '22',
    color: STATUS_CONFIG[status].color,
    textTransform: 'uppercase' as const,
  }),
  meetingMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  attendeesList: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
    flexWrap: 'wrap' as const,
  },
  attendeeBadge: {
    padding: '2px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
  },
  tokenUsage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
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
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: CHENU_COLORS.ancientStone,
  },
  // Upcoming Section
  upcomingSection: {
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    border: `1px solid ${CHENU_COLORS.sacredGold}22`,
  },
  upcomingSectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '12px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getDuration = () => {
    const start = new Date(meeting.startTime);
    const end = new Date(meeting.endTime);
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    return `${minutes} min`;
  };

  const tokenPercent = meeting.tokenBudget > 0 
    ? (meeting.tokensUsed / meeting.tokenBudget) * 100 
    : 0;

  return (
    <div style={styles.meetingCard} onClick={onClick}>
      <div style={styles.meetingTime}>
        <div style={styles.meetingTimeText}>{formatTime(meeting.startTime)}</div>
        <div style={styles.meetingDate}>{formatDate(meeting.startTime)}</div>
      </div>
      
      <div style={styles.meetingContent}>
        <div style={styles.meetingHeader}>
          <span style={styles.meetingTitle}>{meeting.title}</span>
          <span style={styles.statusBadge(meeting.status)}>
            {STATUS_CONFIG[meeting.status].icon} {STATUS_CONFIG[meeting.status].label}
          </span>
        </div>
        
        <div style={styles.meetingMeta}>
          <span>⏱️ {getDuration()}</span>
          <span>👥 {meeting.attendees.length} participants</span>
          {meeting.agenda.length > 0 && (
            <span>📋 {meeting.agenda.length} points à l'ordre du jour</span>
          )}
        </div>
        
        {meeting.attendees.length > 0 && (
          <div style={styles.attendeesList}>
            {meeting.attendees.slice(0, 5).map((attendee, idx) => (
              <span key={idx} style={styles.attendeeBadge}>
                {attendee.name}
              </span>
            ))}
            {meeting.attendees.length > 5 && (
              <span style={styles.attendeeBadge}>+{meeting.attendees.length - 5}</span>
            )}
          </div>
        )}
      </div>
      
      <div style={styles.tokenUsage}>
        <div style={styles.tokenBar}>
          <div style={styles.tokenFill(tokenPercent)} />
        </div>
        <span style={styles.tokenText}>{meeting.tokensUsed}/{meeting.tokenBudget}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const MeetingsSectionConnected: React.FC<MeetingsSectionConnectedProps> = ({
  sphereId,
  projectId,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNEXION AU STORE
  // ─────────────────────────────────────────────────────────────────────────────
  const {
    meetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetingsBySphere,
    getUpcomingMeetings,
  } = useMeetingStore();

  // Local state
  const [view, setView] = React.useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = React.useState<MeetingStatus | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingMeetingId, setEditingMeetingId] = React.useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES
  // ─────────────────────────────────────────────────────────────────────────────
  const sphereMeetings = useMemo(() => {
    // @ts-ignore - sphereId type compatibility
    return getMeetingsBySphere(sphereId as any);
  }, [getMeetingsBySphere, sphereId, meetings]);

  const filteredMeetings = useMemo(() => {
    return sphereMeetings
      .filter(m => !statusFilter || m.status === statusFilter)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [sphereMeetings, statusFilter]);

  const upcomingMeetings = useMemo(() => {
    return getUpcomingMeetings(5);
  }, [getUpcomingMeetings, meetings]);

  const editingMeeting = useMemo(() => {
    if (!editingMeetingId) return null;
    return meetings[editingMeetingId] || null;
  }, [editingMeetingId, meetings]);

  const meetingCount = sphereMeetings.length;

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCreateMeeting = useCallback(() => {
    setEditingMeetingId(null);
    setShowEditor(true);
  }, []);

  const handleEditMeeting = useCallback((meeting: Meeting) => {
    setEditingMeetingId(meeting.id);
    setShowEditor(true);
  }, []);

  const handleSaveMeeting = useCallback(async (meetingData: any) => {
    if (editingMeetingId && editingMeeting) {
      updateMeeting(editingMeetingId, {
        title: meetingData.title,
        description: meetingData.description,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        status: meetingData.status,
        tokenBudget: meetingData.tokenBudget,
      });
    } else {
      createMeeting({
        title: meetingData.title || 'Nouvelle réunion',
        description: meetingData.description || '',
        // @ts-ignore
        sphereId: sphereId as any,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        organizerId: 'current_user',
        attendees: [],
        isVirtual: true,
      });
    }
    
    setShowEditor(false);
    setEditingMeetingId(null);
  }, [editingMeetingId, editingMeeting, updateMeeting, createMeeting, sphereId]);

  const handleDeleteMeeting = useCallback(async (meetingId: string) => {
    deleteMeeting(meetingId);
    setShowEditor(false);
    setEditingMeetingId(null);
  }, [deleteMeeting]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={styles.title}>Meetings</h2>
          <span style={styles.storeIndicator}>
            🔗 Store connecté • {meetingCount} réunions
          </span>
        </div>
        <button style={styles.createButton} onClick={handleCreateMeeting}>
          + Nouvelle réunion
        </button>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div style={styles.upcomingSection}>
          <div style={styles.upcomingSectionTitle}>
            📅 Prochaines réunions
          </div>
          {upcomingMeetings.slice(0, 3).map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onClick={() => handleEditMeeting(meeting)}
            />
          ))}
        </div>
      )}

      {/* View Toggle */}
      <div style={styles.viewToggle}>
        <button
          style={styles.viewButton(view === 'list')}
          onClick={() => setView('list')}
        >
          📋 Liste
        </button>
        <button
          style={styles.viewButton(view === 'calendar')}
          onClick={() => setView('calendar')}
        >
          📅 Calendrier
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          style={styles.filterButton(!statusFilter)}
          onClick={() => setStatusFilter(null)}
        >
          Toutes
        </button>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button
            key={status}
            style={styles.filterButton(statusFilter === status)}
            onClick={() => setStatusFilter(status as MeetingStatus)}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      {/* List View */}
      {view === 'list' && (
        <div style={styles.meetingsList}>
          {filteredMeetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onClick={() => handleEditMeeting(meeting)}
            />
          ))}
        </div>
      )}

      {/* Calendar View (simplified) */}
      {view === 'calendar' && (
        <div style={{ textAlign: 'center', padding: '40px', color: CHENU_COLORS.ancientStone }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <p>Vue calendrier - En développement</p>
          <p style={{ fontSize: '12px' }}>Utilisez la vue liste pour l'instant</p>
        </div>
      )}

      {/* Empty State */}
      {filteredMeetings.length === 0 && view === 'list' && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
          <p>Aucune réunion trouvée</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Créez votre première réunion pour commencer
          </p>
        </div>
      )}

      {/* Meeting Editor Modal */}
      {showEditor && (
        <MeetingEditor
          meeting={editingMeeting ? {
            id: editingMeeting.id,
            title: editingMeeting.title,
            description: editingMeeting.description,
            meetingType: 'sync',
            status: editingMeeting.status === 'in_progress' ? 'in_progress' : 
                   editingMeeting.status === 'completed' ? 'completed' :
                   editingMeeting.status === 'cancelled' ? 'cancelled' : 'scheduled',
            scheduledAt: editingMeeting.startTime,
            durationMinutes: Math.round(
              (new Date(editingMeeting.endTime).getTime() - new Date(editingMeeting.startTime).getTime()) / 60000
            ),
            isVirtual: editingMeeting.isVirtual,
            location: editingMeeting.location,
            virtualLink: editingMeeting.virtualLink,
            participants: editingMeeting.attendees.map(a => ({
              id: a.id,
              name: a.name,
              email: a.email || '',
              role: a.role,
              status: a.status,
            })),
            agenda: editingMeeting.agenda.map(a => ({
              id: a.id,
              title: a.title,
              duration: a.duration,
              presenter: a.presenter,
            })),
            tokenBudget: editingMeeting.tokenBudget,
            tokensUsed: editingMeeting.tokensUsed,
            linkedThreadId: editingMeeting.linkedThreadId,
            linkedProjectId: editingMeeting.linkedProjectId,
            sphereId: sphereId,
            createdAt: editingMeeting.createdAt,
            updatedAt: editingMeeting.updatedAt,
          } : undefined}
          sphereId={sphereId}
          onSave={handleSaveMeeting}
          onClose={() => {
            setShowEditor(false);
            setEditingMeetingId(null);
          }}
          onDelete={editingMeeting ? () => handleDeleteMeeting(editingMeeting.id) : undefined}
        />
      )}
    </div>
  );
};

export default MeetingsSectionConnected;
