/**
 * CHE·NU™ XR TEAM REFLECTION — MAIN COMPONENT
 * 
 * XR Team Reflection exists to allow multiple humans to
 * reflect together on shared work WITHOUT:
 * - urgency
 * - hierarchy
 * - persuasion
 * - performance pressure
 * 
 * It is NOT a meeting room.
 * It is NOT a standup.
 * It is NOT a review board.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type {
  XRTeamReflectionProps,
  TeamReflectionParticipant,
  SharedMeaning,
  SharedThread,
  SharedDecision,
  TeamLoadState,
  TeamReflectionZoneType,
  ExitMethod,
} from './xr-team-reflection.types';
import {
  useTeamReflection,
  useSharedMeaning,
  useSharedThreads,
  useSharedDecisions,
  useTeamLoad,
  useTeamReflectionAgents,
  useTeamReflectionInteractions,
} from './hooks';
import type { Vector3 } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Center Focus Area — Shared focus point
 */
interface CenterFocusProps {
  scope_title: string;
  participant_count: number;
}

const CenterFocus: React.FC<CenterFocusProps> = ({ scope_title, participant_count }) => {
  return (
    <div
      className="center-focus"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180, 180, 200, 0.15) 0%, transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ 
        fontSize: '12px', 
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '4px',
      }}>
        {scope_title}
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.4)',
      }}>
        {participant_count} reflecting
      </div>
    </div>
  );
};

/**
 * Participant Avatar — Minimal, equal representation
 */
interface ParticipantAvatarProps {
  participant: TeamReflectionParticipant;
  is_current: boolean;
  total_participants: number;
}

const ParticipantAvatar: React.FC<ParticipantAvatarProps> = ({
  participant,
  is_current,
  total_participants,
}) => {
  // Calculate circular position (equidistant)
  const radius = 180;
  const angle = (participant.seat_index / total_participants) * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  // All same color for equality
  const baseColor = participant.silence_mode ? '#666688' : '#8888AA';
  
  return (
    <div
      className="participant-avatar"
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: is_current 
          ? `linear-gradient(135deg, ${baseColor}, ${baseColor}80)`
          : `${baseColor}40`,
        border: is_current ? `2px solid ${baseColor}` : `1px solid ${baseColor}60`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // NO status indicators
        // NO rank display
      }}
    >
      {participant.avatar_style !== 'hidden' && participant.display_name && (
        <span style={{ 
          fontSize: '12px', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: is_current ? 500 : 400,
        }}>
          {participant.display_name.charAt(0).toUpperCase()}
        </span>
      )}
      
      {/* Speaking indicator (subtle) */}
      {participant.is_speaking && (
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(153, 153, 187, 0.5)',
            animation: 'pulse 2s infinite',
          }}
        />
      )}
    </div>
  );
};

/**
 * Shared Meaning Field — Ambient meaning display
 */
interface SharedMeaningFieldProps {
  meanings: SharedMeaning[];
  onAcknowledge: (meaning_id: string) => void;
  onMarkMisalignment: (meaning_id: string) => void;
}

const SharedMeaningField: React.FC<SharedMeaningFieldProps> = ({
  meanings,
  onAcknowledge,
  onMarkMisalignment,
}) => {
  if (meanings.length === 0) return null;
  
  return (
    <div
      className="shared-meaning-field"
      style={{
        position: 'absolute',
        left: '5%',
        top: '20%',
        width: '220px',
        maxHeight: '60%',
        overflow: 'auto',
        padding: '16px',
        background: 'rgba(140, 160, 180, 0.05)',
        borderRadius: '12px',
        borderLeft: '2px solid rgba(140, 160, 180, 0.2)',
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.4)', 
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Shared Meaning
      </div>
      
      {meanings.map(meaning => (
        <div
          key={meaning.id}
          style={{
            marginBottom: '12px',
            padding: '10px',
            background: meaning.has_conflict 
              ? 'rgba(180, 160, 140, 0.15)' // Gentle conflict color
              : 'rgba(140, 160, 180, 0.1)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '11px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>{meaning.statement}</div>
          
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            opacity: 0.6,
            fontSize: '10px',
          }}>
            <button
              onClick={() => onAcknowledge(meaning.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(160, 180, 160, 0.8)',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Acknowledge ({meaning.acknowledged_by.length})
            </button>
            <button
              onClick={() => onMarkMisalignment(meaning.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(180, 160, 140, 0.8)',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Mark misalignment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Thread Map — Shared knowledge threads
 */
interface ThreadMapProps {
  threads: SharedThread[];
  onHighlight: (thread_id: string) => void;
}

const ThreadMap: React.FC<ThreadMapProps> = ({ threads, onHighlight }) => {
  if (threads.length === 0) return null;
  
  return (
    <div
      className="thread-map"
      style={{
        position: 'absolute',
        right: '5%',
        top: '20%',
        width: '200px',
        padding: '16px',
        background: 'rgba(160, 140, 180, 0.05)',
        borderRadius: '12px',
        borderRight: '2px solid rgba(160, 140, 180, 0.2)',
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.4)', 
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Shared Threads
      </div>
      
      {threads.map(thread => (
        <div
          key={thread.id}
          onClick={() => onHighlight(thread.thread_id)}
          style={{
            marginBottom: '8px',
            padding: '8px 12px',
            background: thread.highlighted 
              ? 'rgba(180, 160, 200, 0.2)'
              : 'rgba(160, 140, 180, 0.1)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ 
            fontSize: '11px', 
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '4px',
          }}>
            {thread.title}
          </div>
          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            {thread.contributors.length} contributors
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Decision Archive — Shared decisions (read-only)
 */
interface DecisionArchiveProps {
  decisions: SharedDecision[];
  onReview: (decision_id: string) => void;
}

const DecisionArchive: React.FC<DecisionArchiveProps> = ({ decisions, onReview }) => {
  if (decisions.length === 0) return null;
  
  return (
    <div
      className="decision-archive"
      style={{
        position: 'absolute',
        left: '50%',
        top: '5%',
        transform: 'translateX(-50%)',
        width: '300px',
        padding: '16px',
        background: 'rgba(140, 180, 180, 0.05)',
        borderRadius: '12px',
        borderTop: '2px solid rgba(140, 180, 180, 0.2)',
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.4)', 
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textAlign: 'center',
      }}>
        Shared Decisions (Read-Only)
      </div>
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {decisions.map(decision => (
          <div
            key={decision.id}
            onClick={() => onReview(decision.decision_id)}
            style={{
              minWidth: '120px',
              padding: '10px',
              background: decision.being_reviewed 
                ? 'rgba(160, 200, 200, 0.2)'
                : 'rgba(140, 180, 180, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <div style={{ 
              fontSize: '11px', 
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}>
              {decision.title}
            </div>
            <div style={{ 
              fontSize: '9px', 
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              {decision.selected_option}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Load Ambience — Environmental tone indicator
 */
interface LoadAmbienceProps {
  team_load: TeamLoadState;
}

const LoadAmbience: React.FC<LoadAmbienceProps> = ({ team_load }) => {
  const toneColors = {
    open: 'rgba(160, 180, 160, 0.1)',
    present: 'rgba(180, 180, 160, 0.15)',
    weighted: 'rgba(180, 160, 160, 0.2)',
    dense: 'rgba(180, 140, 140, 0.25)',
  };
  
  return (
    <div
      className="load-ambience"
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 80%, ${toneColors[team_load.environmental_tone]} 0%, transparent 50%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Silence Zone — Quiet reflection area
 */
interface SilenceZoneProps {
  active: boolean;
  participants_in_zone: number;
  onEnter: () => void;
}

const SilenceZoneComponent: React.FC<SilenceZoneProps> = ({
  active,
  participants_in_zone,
  onEnter,
}) => {
  return (
    <div
      className="silence-zone"
      onClick={onEnter}
      style={{
        position: 'absolute',
        left: '5%',
        bottom: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(80, 80, 100, 0.1)',
        border: '1px dashed rgba(100, 100, 120, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
      }}>
        Silence Zone
      </div>
      {participants_in_zone > 0 && (
        <div style={{ 
          fontSize: '9px', 
          color: 'rgba(255, 255, 255, 0.3)',
          marginTop: '4px',
        }}>
          {participants_in_zone} in quiet
        </div>
      )}
    </div>
  );
};

/**
 * Exit Controls — Always visible, one-gesture exit
 */
interface ExitControlsProps {
  onExit: (method: ExitMethod) => void;
}

const ExitControls: React.FC<ExitControlsProps> = ({ onExit }) => {
  return (
    <button
      onClick={() => onExit('button')}
      style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        padding: '10px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span>Leave Reflection</span>
      <span style={{ opacity: 0.5, fontSize: '10px' }}>ESC</span>
    </button>
  );
};

/**
 * Room Info — Session information
 */
interface RoomInfoProps {
  scope_title: string;
  focus_type: string;
  participant_count: number;
  is_in_silence: boolean;
}

const RoomInfo: React.FC<RoomInfoProps> = ({
  scope_title,
  focus_type,
  participant_count,
  is_in_silence,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        padding: '16px',
        background: 'rgba(10, 10, 18, 0.8)',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '11px',
        minWidth: '180px',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
        Team Reflection
      </div>
      <div style={{ opacity: 0.7, marginBottom: '6px' }}>
        {scope_title}
      </div>
      <div style={{ opacity: 0.5, marginBottom: '6px' }}>
        Focus: {focus_type.replace('_', ' ')}
      </div>
      <div style={{ opacity: 0.5, marginBottom: '6px' }}>
        Participants: {participant_count}
      </div>
      {is_in_silence && (
        <div style={{ 
          marginTop: '8px', 
          padding: '4px 8px', 
          background: 'rgba(100, 100, 120, 0.2)',
          borderRadius: '4px',
          fontSize: '10px',
        }}>
          In silence mode
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Team Reflection
 * 
 * A calm, opt-in XR space where participants can collectively
 * observe shared meaning, decisions, threads, and load.
 * 
 * The room is circular and non-hierarchical.
 * No "head of table". No dominant position.
 */
export const XRTeamReflection: React.FC<XRTeamReflectionProps> = ({
  session_id,
  scope,
  config,
  current_user_id,
  display_name,
  participants: initialParticipants = [],
  shared_meanings: initialMeanings = [],
  shared_threads: initialThreads = [],
  shared_decisions: initialDecisions = [],
  onJoin,
  onLeave,
  onAcknowledge,
  onMarkMisalignment,
  onEnterSilence,
  onExitSilence,
  onInteraction,
  onAgentRequest,
  xr_runtime = 'preview',
}) => {
  // Hooks
  const {
    room_state,
    is_joined,
    current_participant,
    joinSession,
    leaveSession,
    enterSilence,
    exitSilence,
    isInSilence,
  } = useTeamReflection({
    session_id,
    scope,
    current_user_id,
    config,
    onJoin,
    onLeave,
  });
  
  const meaningHook = useSharedMeaning();
  const threadsHook = useSharedThreads();
  const decisionsHook = useSharedDecisions();
  const loadHook = useTeamLoad(room_state?.participants.length ?? 1);
  const interactionsHook = useTeamReflectionInteractions();
  
  // Use provided data or hook data
  const displayParticipants = initialParticipants.length > 0 
    ? initialParticipants 
    : (room_state?.participants ?? []);
  const displayMeanings = initialMeanings.length > 0 
    ? initialMeanings 
    : meaningHook.meanings;
  const displayThreads = initialThreads.length > 0 
    ? initialThreads 
    : threadsHook.threads;
  const displayDecisions = initialDecisions.length > 0 
    ? initialDecisions 
    : decisionsHook.decisions;
  
  // Handle acknowledge
  const handleAcknowledge = useCallback((meaning_id: string) => {
    if (!current_participant) return;
    meaningHook.acknowledgeMeaning(meaning_id, current_participant.id);
    onAcknowledge?.(meaning_id);
    interactionsHook.recordInteraction(
      'acknowledge_meaning',
      current_participant.id,
      meaning_id,
      'meaning'
    );
  }, [current_participant, meaningHook, onAcknowledge, interactionsHook]);
  
  // Handle mark misalignment
  const handleMarkMisalignment = useCallback((meaning_id: string) => {
    if (!current_participant) return;
    meaningHook.markMisalignment(meaning_id, current_participant.id);
    onMarkMisalignment?.(meaning_id);
    interactionsHook.recordInteraction(
      'mark_misalignment',
      current_participant.id,
      meaning_id,
      'meaning'
    );
  }, [current_participant, meaningHook, onMarkMisalignment, interactionsHook]);
  
  // Handle thread highlight
  const handleHighlightThread = useCallback((thread_id: string) => {
    threadsHook.highlightThread(thread_id);
    if (current_participant) {
      interactionsHook.recordInteraction(
        'highlight_thread',
        current_participant.id,
        thread_id,
        'thread'
      );
    }
  }, [threadsHook, current_participant, interactionsHook]);
  
  // Handle decision review
  const handleReviewDecision = useCallback((decision_id: string) => {
    decisionsHook.setReviewing(decision_id, true);
    if (current_participant) {
      interactionsHook.recordInteraction(
        'review_decision',
        current_participant.id,
        decision_id,
        'decision'
      );
    }
  }, [decisionsHook, current_participant, interactionsHook]);
  
  // Handle enter silence
  const handleEnterSilence = useCallback(() => {
    enterSilence();
    onEnterSilence?.();
  }, [enterSilence, onEnterSilence]);
  
  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        leaveSession('button');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leaveSession]);
  
  // Silence zone participants count
  const silenceParticipants = useMemo(() => {
    return displayParticipants.filter(p => p.silence_mode).length;
  }, [displayParticipants]);
  
  // Not joined yet
  if (!is_joined) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          background: '#0a0a12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>
          Team Reflection
        </div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '8px' }}>
          {scope.title}
        </div>
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.4, 
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          A calm space for shared understanding and alignment.
          <br />
          No urgency. No hierarchy. No performance pressure.
        </div>
        <button
          onClick={() => joinSession(display_name, 'minimal')}
          style={{
            padding: '12px 32px',
            background: 'rgba(136, 136, 170, 0.4)',
            border: 'none',
            borderRadius: '24px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Join Reflection
        </button>
      </div>
    );
  }
  
  return (
    <div
      className="xr-team-reflection"
      data-session={session_id}
      data-runtime={xr_runtime}
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0a0a12 0%, #141420 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Load ambience (environmental) */}
      <LoadAmbience team_load={loadHook.team_load} />
      
      {/* Center focus */}
      <CenterFocus 
        scope_title={scope.title}
        participant_count={displayParticipants.length}
      />
      
      {/* Participants (circular, equal) */}
      {displayParticipants.map((participant, index) => (
        <ParticipantAvatar
          key={participant.id}
          participant={{ ...participant, seat_index: index }}
          is_current={participant.user_id === current_user_id}
          total_participants={displayParticipants.length}
        />
      ))}
      
      {/* Shared meaning field */}
      <SharedMeaningField
        meanings={displayMeanings}
        onAcknowledge={handleAcknowledge}
        onMarkMisalignment={handleMarkMisalignment}
      />
      
      {/* Thread map */}
      <ThreadMap
        threads={displayThreads}
        onHighlight={handleHighlightThread}
      />
      
      {/* Decision archive */}
      <DecisionArchive
        decisions={displayDecisions}
        onReview={handleReviewDecision}
      />
      
      {/* Silence zone */}
      <SilenceZoneComponent
        active={true}
        participants_in_zone={silenceParticipants}
        onEnter={handleEnterSilence}
      />
      
      {/* Room info */}
      <RoomInfo
        scope_title={scope.title}
        focus_type={scope.focus_type}
        participant_count={displayParticipants.length}
        is_in_silence={isInSilence}
      />
      
      {/* Exit controls (always visible) */}
      <ExitControls onExit={leaveSession} />
      
      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '10px',
        }}
      >
        Silence is allowed • Presence is equal • ESC to leave
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default XRTeamReflection;
