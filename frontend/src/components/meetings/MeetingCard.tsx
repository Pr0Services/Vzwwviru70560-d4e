/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — MEETING CARD                                ║
 * ║                    Card pour Afficher un Meeting                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Titre et description
 * - Date/heure avec indicateur live
 * - Participants (humains + agents)
 * - Actions: Join, Edit, Cancel
 * - Status: scheduled, live, completed, cancelled
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MeetingStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface MeetingParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'agent' | 'nova';
  isHost?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  sphereId: string;
  status: MeetingStatus;
  scheduledAt: string;
  duration: number; // minutes
  participants: MeetingParticipant[];
  threadId?: string;
  dataspaceId?: string;
  recordingUrl?: string;
  createdBy: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
  onView?: (meeting: Meeting) => void;
  compact?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<MeetingStatus, { label: string; color: string; bg: string; icon: string }> = {
  scheduled: { 
    label: 'Planifié', 
    color: '#8D8371', 
    bg: 'bg-[#8D8371]/10',
    icon: '📅'
  },
  live: { 
    label: 'En cours', 
    color: '#3EB4A2', 
    bg: 'bg-[#3EB4A2]/10',
    icon: '🔴'
  },
  completed: { 
    label: 'Terminé', 
    color: '#5A5B5E', 
    bg: 'bg-[#5A5B5E]/10',
    icon: '✓'
  },
  cancelled: { 
    label: 'Annulé', 
    color: '#EF4444', 
    bg: 'bg-red-500/10',
    icon: '✕'
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatDateTime(dateStr: string): { date: string; time: string; relative: string } {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const diffMins = Math.round(diff / 60000);
  
  let relative = '';
  if (diffMins < 0) {
    relative = Math.abs(diffMins) < 60 
      ? `Il y a ${Math.abs(diffMins)} min`
      : `Passé`;
  } else if (diffMins === 0) {
    relative = 'Maintenant';
  } else if (diffMins < 60) {
    relative = `Dans ${diffMins} min`;
  } else if (diffMins < 1440) {
    relative = `Dans ${Math.round(diffMins / 60)}h`;
  } else {
    relative = `Dans ${Math.round(diffMins / 1440)}j`;
  }
  
  return {
    date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    relative,
  };
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function MeetingCard({
  meeting,
  onJoin,
  onEdit,
  onCancel,
  onView,
  compact = false,
}: MeetingCardProps) {
  const statusConfig = STATUS_CONFIG[meeting.status];
  const { date, time, relative } = formatDateTime(meeting.scheduledAt);
  const isLive = meeting.status === 'live';
  const isPast = meeting.status === 'completed' || meeting.status === 'cancelled';
  const canJoin = meeting.status === 'live' || meeting.status === 'scheduled';

  // ─────────────────────────────────────────────────────────────────────────────
  // Compact Mode
  // ─────────────────────────────────────────────────────────────────────────────

  if (compact) {
    return (
      <button
        onClick={() => canJoin ? onJoin?.(meeting) : onView?.(meeting)}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg text-left
          transition-all duration-200
          ${isLive 
            ? 'bg-[#3EB4A2]/10 border border-[#3EB4A2]/30' 
            : 'bg-[#1E1F22] border border-transparent hover:bg-[#2A2B2E]'
          }
        `}
        data-testid={`meeting-card-compact-${meeting.id}`}
      >
        {/* Time */}
        <div className={`text-center ${isLive ? 'text-[#3EB4A2]' : 'text-[#8D8371]'}`}>
          <p className="text-xs font-medium">{time}</p>
          <p className="text-[10px] opacity-70">{date}</p>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#E9E4D6] truncate">{meeting.title}</p>
          <p className="text-xs text-[#5A5B5E]">
            {meeting.participants.length} participants • {formatDuration(meeting.duration)}
          </p>
        </div>
        
        {/* Status */}
        {isLive && (
          <span className="px-2 py-0.5 text-xs bg-[#3EB4A2] text-white rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Full Mode
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className={`
        bg-[#1E1F22] border rounded-xl overflow-hidden
        transition-all duration-200
        ${isLive 
          ? 'border-[#3EB4A2] ring-1 ring-[#3EB4A2]/20' 
          : 'border-[#2A2B2E] hover:border-[#3A3B3E]'
        }
      `}
      data-testid={`meeting-card-${meeting.id}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2A2B2E]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-[#E9E4D6] truncate">
                {meeting.title}
              </h3>
              {isLive && (
                <span className="px-2 py-0.5 text-[10px] bg-[#3EB4A2] text-white rounded-full animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  LIVE
                </span>
              )}
            </div>
            {meeting.description && (
              <p className="text-xs text-[#5A5B5E] line-clamp-2">
                {meeting.description}
              </p>
            )}
          </div>
          
          {/* Status badge */}
          {!isLive && (
            <span 
              className={`px-2 py-0.5 text-[10px] rounded ${statusConfig.bg}`}
              style={{ color: statusConfig.color }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
          )}
        </div>
      </div>

      {/* Time info */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#1A1B1E]">
        <div className="flex items-center gap-3">
          <div className={`text-center ${isLive ? 'text-[#3EB4A2]' : 'text-[#8D8371]'}`}>
            <p className="text-lg font-bold">{time}</p>
            <p className="text-xs opacity-70">{date}</p>
          </div>
          <div className="h-8 w-px bg-[#2A2B2E]" />
          <div>
            <p className="text-sm text-[#E9E4D6]">{relative}</p>
            <p className="text-xs text-[#5A5B5E]">{formatDuration(meeting.duration)}</p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="px-4 py-3 border-t border-[#2A2B2E]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#5A5B5E]">Participants</span>
          <span className="text-xs text-[#8D8371]">{meeting.participants.length}</span>
        </div>
        <div className="flex -space-x-2">
          {meeting.participants.slice(0, 5).map((p, i) => (
            <div
              key={p.id}
              className={`
                w-8 h-8 rounded-full border-2 border-[#1E1F22] flex items-center justify-center
                ${p.type === 'nova' 
                  ? 'bg-[#D8B26A]/20 text-[#D8B26A]' 
                  : p.type === 'agent'
                    ? 'bg-[#3EB4A2]/20 text-[#3EB4A2]'
                    : 'bg-[#2A2B2E] text-[#8D8371]'
                }
              `}
              title={p.name}
              style={{ zIndex: 5 - i }}
            >
              {p.avatar ? (
                <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-xs">
                  {p.type === 'nova' ? '✨' : p.type === 'agent' ? '🤖' : p.name[0]}
                </span>
              )}
            </div>
          ))}
          {meeting.participants.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#1E1F22] bg-[#2A2B2E] flex items-center justify-center text-xs text-[#5A5B5E]">
              +{meeting.participants.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-[#2A2B2E] flex gap-2">
        {canJoin && onJoin && (
          <button
            onClick={() => onJoin(meeting)}
            className={`
              flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-colors
              ${isLive 
                ? 'bg-[#3EB4A2] text-white hover:bg-[#4EC5B3]' 
                : 'bg-[#D8B26A]/10 text-[#D8B26A] border border-[#D8B26A]/30 hover:bg-[#D8B26A]/20'
              }
            `}
            data-testid={`meeting-join-${meeting.id}`}
          >
            {isLive ? '🔴 Rejoindre' : '📅 Rejoindre'}
          </button>
        )}
        
        {isPast && onView && (
          <button
            onClick={() => onView(meeting)}
            className="flex-1 px-4 py-2 text-xs font-medium rounded-lg bg-[#2A2B2E] text-[#8D8371] hover:bg-[#3A3B3E] transition-colors"
            data-testid={`meeting-view-${meeting.id}`}
          >
            📋 Voir les notes
          </button>
        )}
        
        {!isPast && onEdit && (
          <button
            onClick={() => onEdit(meeting)}
            className="px-3 py-2 text-xs text-[#5A5B5E] hover:text-[#8D8371] hover:bg-[#2A2B2E] rounded-lg transition-colors"
            data-testid={`meeting-edit-${meeting.id}`}
          >
            ✏️
          </button>
        )}
        
        {!isPast && onCancel && (
          <button
            onClick={() => onCancel(meeting)}
            className="px-3 py-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            data-testid={`meeting-cancel-${meeting.id}`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MeetingListProps {
  meetings: Meeting[];
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
  onView?: (meeting: Meeting) => void;
  layout?: 'grid' | 'list';
  emptyMessage?: string;
}

export function MeetingList({
  meetings,
  onJoin,
  onEdit,
  onCancel,
  onView,
  layout = 'list',
  emptyMessage = 'Aucune réunion',
}: MeetingListProps) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">📅</span>
        <p className="text-[#5A5B5E]">{emptyMessage}</p>
      </div>
    );
  }

  // Sort: live first, then by date
  const sortedMeetings = [...meetings].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  return (
    <div 
      className={
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
          : 'space-y-3'
      }
      data-testid="meeting-list"
    >
      {sortedMeetings.map(meeting => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onJoin={onJoin}
          onEdit={onEdit}
          onCancel={onCancel}
          onView={onView}
          compact={layout === 'list'}
        />
      ))}
    </div>
  );
}

export default MeetingCard;
