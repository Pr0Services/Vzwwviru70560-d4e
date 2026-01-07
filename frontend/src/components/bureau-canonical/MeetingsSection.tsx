/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — MEETINGS SECTION                                      ║
 * ║              Bureau Section L2-6: 📅 Réunions                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  FEATURES:                                                                   ║
 * ║  - Meeting schedule                                                          ║
 * ║  - Meeting notes                                                             ║
 * ║  - Participants management                                                   ║
 * ║  - Recordings                                                                ║
 * ║  - Token governance for AI participation                                     ║
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

type MeetingStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
type MeetingType = 'instant' | 'scheduled' | 'recurring';
type ParticipantType = 'human' | 'agent';

interface Participant {
  id: string;
  name: string;
  type: ParticipantType;
  role: 'host' | 'participant' | 'observer';
  isOnline?: boolean;
}

interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  sphereId: string;
  
  // Schedule
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // minutes
  
  // Participants
  participants: Participant[];
  
  // Content
  agenda?: string[];
  notes?: string;
  decisionsCount: number;
  
  // Governance
  tokenBudget: number;
  tokenUsed: number;
  hasRecording: boolean;
}

interface MeetingsSectionProps {
  sphereId: string;
  onJoinMeeting?: (meeting: Meeting) => void;
  onCreateMeeting?: () => void;
  onViewNotes?: (meeting: Meeting) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_CONFIG = BUREAU_SECTIONS.meetings;

const STATUS_CONFIG: Record<MeetingStatus, { label: string; color: string; icon: string }> = {
  scheduled: { label: 'Planifiée', color: CHENU_COLORS.cenoteTurquoise, icon: '📅' },
  live: { label: 'En cours', color: CHENU_COLORS.jungleEmerald, icon: '🔴' },
  completed: { label: 'Terminée', color: CHENU_COLORS.ancientStone, icon: '✅' },
  cancelled: { label: 'Annulée', color: '#ef4444', icon: '❌' },
};

// Mock data
const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm-1',
    title: 'Réunion d\'équipe hebdomadaire',
    type: 'recurring',
    status: 'live',
    sphereId: 'business',
    startedAt: new Date(Date.now() - 1000 * 60 * 25),
    participants: [
      { id: 'p-1', name: 'Jo', type: 'human', role: 'host', isOnline: true },
      { id: 'p-2', name: 'Marie', type: 'human', role: 'participant', isOnline: true },
      { id: 'p-3', name: 'Nova', type: 'agent', role: 'observer', isOnline: true },
    ],
    agenda: ['Revue sprint', 'Blocages', 'Prochaines étapes'],
    decisionsCount: 2,
    tokenBudget: 1000,
    tokenUsed: 350,
    hasRecording: true,
  },
  {
    id: 'm-2',
    title: 'Review Architecture CHE·NU',
    type: 'scheduled',
    status: 'scheduled',
    sphereId: 'business',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    participants: [
      { id: 'p-1', name: 'Jo', type: 'human', role: 'host' },
      { id: 'p-4', name: 'Agent Architecte', type: 'agent', role: 'participant' },
    ],
    agenda: ['Structure sphères', 'Modèle bureau', 'Intégration agents'],
    decisionsCount: 0,
    tokenBudget: 2000,
    tokenUsed: 0,
    hasRecording: false,
  },
  {
    id: 'm-3',
    title: 'Brainstorm Marketing Q1',
    type: 'scheduled',
    status: 'completed',
    sphereId: 'business',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    endedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    duration: 60,
    participants: [
      { id: 'p-1', name: 'Jo', type: 'human', role: 'host' },
      { id: 'p-5', name: 'Agent Créatif', type: 'agent', role: 'participant' },
    ],
    notes: 'Discussion sur les nouvelles campagnes...',
    decisionsCount: 5,
    tokenBudget: 1500,
    tokenUsed: 1200,
    hasRecording: true,
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
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  instantBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.jungleEmerald,
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  scheduleBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.sacredGold,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  liveMeeting: {
    backgroundColor: CHENU_COLORS.jungleEmerald + '11',
    border: `2px solid ${CHENU_COLORS.jungleEmerald}`,
    borderRadius: '14px',
    padding: '20px',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  liveIndicator: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: CHENU_COLORS.jungleEmerald,
    borderRadius: '20px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    animation: 'pulse 1.5s infinite',
  },
  liveTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  liveMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    marginBottom: '16px',
  },
  participantsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  participantBadge: (type: ParticipantType, isOnline: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: type === 'agent' ? CHENU_COLORS.cenoteTurquoise + '22' : CHENU_COLORS.ancientStone + '22',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    border: isOnline ? `1px solid ${CHENU_COLORS.jungleEmerald}` : 'none',
  }),
  joinBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: CHENU_COLORS.jungleEmerald,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  meetingsList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
  },
  meetingCard: {
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
    marginBottom: '10px',
  },
  meetingTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  meetingMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  statusBadge: (status: MeetingStatus) => ({
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: STATUS_CONFIG[status].color + '22',
    color: STATUS_CONFIG[status].color,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  footerStats: {
    display: 'flex',
    gap: '12px',
  },
  viewNotesBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '11px',
    cursor: 'pointer',
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

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({
  sphereId,
  onJoinMeeting,
  onCreateMeeting,
  onViewNotes,
}) => {
  const [meetings] = useState<Meeting[]>(MOCK_MEETINGS);

  // Separate meetings by status
  const { liveMeetings, upcomingMeetings, pastMeetings } = useMemo(() => {
    const live = meetings.filter(m => m.status === 'live');
    const upcoming = meetings.filter(m => m.status === 'scheduled');
    const past = meetings.filter(m => m.status === 'completed' || m.status === 'cancelled');
    return { liveMeetings: live, upcomingMeetings: upcoming, pastMeetings: past };
  }, [meetings]);

  // Handlers
  const handleJoin = useCallback((meeting: Meeting) => {
    onJoinMeeting?.(meeting);
  }, [onJoinMeeting]);

  const handleViewNotes = useCallback((meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewNotes?.(meeting);
  }, [onViewNotes]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const getElapsedTime = (startDate: Date) => {
    const diff = Date.now() - startDate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} min`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
        </div>
        <div style={styles.headerActions}>
          <motion.button
            style={styles.instantBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateMeeting}
          >
            🔴 Réunion instantanée
          </motion.button>
          <motion.button
            style={styles.scheduleBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateMeeting}
          >
            📅 Planifier
          </motion.button>
        </div>
      </div>

      {/* Live Meetings */}
      <AnimatePresence>
        {liveMeetings.map(meeting => (
          <motion.div
            key={meeting.id}
            style={styles.liveMeeting}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={styles.liveIndicator}>
              <div style={styles.liveDot} />
              EN DIRECT
            </div>
            
            <div style={styles.liveTitle}>{meeting.title}</div>
            <div style={styles.liveMeta}>
              <span>⏱️ {getElapsedTime(meeting.startedAt!)}</span>
              <span>📋 {meeting.decisionsCount} décisions</span>
              <span>💎 {meeting.tokenUsed}/{meeting.tokenBudget} tokens</span>
            </div>
            
            <div style={styles.participantsRow}>
              {meeting.participants.map(p => (
                <span 
                  key={p.id} 
                  style={styles.participantBadge(p.type, p.isOnline || false)}
                >
                  {p.type === 'agent' ? '🤖' : '👤'} {p.name}
                </span>
              ))}
            </div>
            
            <motion.button
              style={styles.joinBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleJoin(meeting)}
            >
              ➡️ Rejoindre
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div>
          <div style={styles.sectionLabel}>📅 À venir ({upcomingMeetings.length})</div>
          <div style={styles.meetingsList}>
            {upcomingMeetings.map(meeting => (
              <motion.div
                key={meeting.id}
                style={styles.meetingCard}
                whileHover={{ borderColor: CHENU_COLORS.sacredGold + '44' }}
                onClick={() => handleJoin(meeting)}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.meetingTitle}>{meeting.title}</div>
                    <div style={styles.meetingMeta}>
                      <span>📅 {formatDate(meeting.scheduledAt!)}</span>
                      <span>🕐 {formatTime(meeting.scheduledAt!)}</span>
                      <span>👥 {meeting.participants.length} participants</span>
                    </div>
                  </div>
                  <div style={styles.statusBadge(meeting.status)}>
                    {STATUS_CONFIG[meeting.status].icon}
                    {STATUS_CONFIG[meeting.status].label}
                  </div>
                </div>
                
                {meeting.agenda && meeting.agenda.length > 0 && (
                  <div style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
                    Agenda: {meeting.agenda.slice(0, 2).join(', ')}
                    {meeting.agenda.length > 2 && ` +${meeting.agenda.length - 2}`}
                  </div>
                )}
                
                <div style={styles.cardFooter}>
                  <div style={styles.footerStats}>
                    <span>💎 Budget: {meeting.tokenBudget} tokens</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={styles.sectionLabel}>📋 Historique ({pastMeetings.length})</div>
          <div style={styles.meetingsList}>
            {pastMeetings.map(meeting => (
              <motion.div
                key={meeting.id}
                style={styles.meetingCard}
                whileHover={{ borderColor: CHENU_COLORS.ancientStone + '44' }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.meetingTitle}>{meeting.title}</div>
                    <div style={styles.meetingMeta}>
                      <span>📅 {formatDate(meeting.startedAt!)}</span>
                      <span>⏱️ {meeting.duration} min</span>
                      <span>📋 {meeting.decisionsCount} décisions</span>
                    </div>
                  </div>
                  <div style={styles.statusBadge(meeting.status)}>
                    {STATUS_CONFIG[meeting.status].icon}
                    {STATUS_CONFIG[meeting.status].label}
                  </div>
                </div>
                
                <div style={styles.cardFooter}>
                  <div style={styles.footerStats}>
                    <span>💎 {meeting.tokenUsed}/{meeting.tokenBudget} tokens</span>
                    {meeting.hasRecording && <span>🎥 Enregistrement</span>}
                  </div>
                  {meeting.notes && (
                    <motion.button
                      style={styles.viewNotesBtn}
                      whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                      onClick={(e) => handleViewNotes(meeting, e)}
                    >
                      📝 Voir notes
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {meetings.length === 0 && (
        <div style={styles.emptyState}>
          <span style={{ fontSize: '48px' }}>📅</span>
          <p style={{ fontSize: '16px', color: CHENU_COLORS.softSand }}>
            Aucune réunion
          </p>
          <p>Planifiez votre première réunion avec gouvernance intégrée</p>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default MeetingsSection;
