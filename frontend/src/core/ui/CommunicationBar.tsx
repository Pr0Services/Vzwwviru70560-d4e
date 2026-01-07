/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — COMMUNICATION BAR                                                  ║
 * ║                                                                                  ║
 * ║     Barre de communication en bas de l'écran                                     ║
 * ║     • Messages (CHE·NU)                                                          ║
 * ║     • Courriel (CHE·NU)                                                          ║
 * ║     • Réunions                                                                   ║
 * ║     • Agents — Communication                                                     ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { LABELS } from './labels';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export interface CommunicationBarProps {
  unreadMessages?: number;
  unreadEmails?: number;
  upcomingMeetings?: number;
  activeAgents?: number;
  onOpenMessages?: () => void;
  onOpenEmail?: () => void;
  onOpenMeetings?: () => void;
  onOpenAgents?: () => void;
  position?: 'bottom' | 'floating';
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  containerBottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'var(--chenu-surface, #2A2B2E)',
    borderTop: '1px solid var(--chenu-border, #3A3B3E)',
    zIndex: 1000,
  },
  containerFloating: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'var(--chenu-surface, #2A2B2E)',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  itemHover: {
    background: 'var(--chenu-bg, #1E1F22)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  icon: {
    fontSize: '18px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    background: 'var(--chenu-error, #EF4444)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'var(--chenu-border, #3A3B3E)',
    margin: '0 4px',
  },
  agentIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--chenu-success, #3EB4A2)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const CommunicationBar: React.FC<CommunicationBarProps> = ({
  unreadMessages = 0,
  unreadEmails = 0,
  upcomingMeetings = 0,
  activeAgents = 0,
  onOpenMessages,
  onOpenEmail,
  onOpenMeetings,
  onOpenAgents,
  position = 'bottom',
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const containerStyle = position === 'bottom' 
    ? styles.containerBottom 
    : styles.containerFloating;

  const getItemStyle = (id: string) => ({
    ...styles.item,
    ...(hoveredItem === id ? styles.itemHover : {}),
  });

  return (
    <div style={containerStyle}>
      {/* Messages */}
      <Tooltip content={LABELS.COMMUNICATION.messages.tooltip} position="top">
        <button
          style={getItemStyle('messages')}
          onMouseEnter={() => setHoveredItem('messages')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={onOpenMessages}
        >
          <span style={styles.icon}>💬</span>
          <span style={styles.label}>{LABELS.COMMUNICATION.messages.label}</span>
          {unreadMessages > 0 && (
            <span style={styles.badge}>
              {unreadMessages > 99 ? '99+' : unreadMessages}
            </span>
          )}
        </button>
      </Tooltip>

      {/* Email */}
      <Tooltip content={LABELS.COMMUNICATION.email.tooltip} position="top">
        <button
          style={getItemStyle('email')}
          onMouseEnter={() => setHoveredItem('email')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={onOpenEmail}
        >
          <span style={styles.icon}>📧</span>
          <span style={styles.label}>{LABELS.COMMUNICATION.email.label}</span>
          {unreadEmails > 0 && (
            <span style={styles.badge}>
              {unreadEmails > 99 ? '99+' : unreadEmails}
            </span>
          )}
        </button>
      </Tooltip>

      {/* Meetings */}
      <Tooltip content={LABELS.COMMUNICATION.meetings.tooltip} position="top">
        <button
          style={getItemStyle('meetings')}
          onMouseEnter={() => setHoveredItem('meetings')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={onOpenMeetings}
        >
          <span style={styles.icon}>📅</span>
          <span style={styles.label}>{LABELS.COMMUNICATION.meetings.label}</span>
          {upcomingMeetings > 0 && (
            <span style={{ ...styles.badge, background: 'var(--chenu-accent, #3EB4A2)' }}>
              {upcomingMeetings}
            </span>
          )}
        </button>
      </Tooltip>

      <div style={styles.divider} />

      {/* Agents */}
      <Tooltip content={LABELS.COMMUNICATION.agents.tooltip} position="top">
        <button
          style={getItemStyle('agents')}
          onMouseEnter={() => setHoveredItem('agents')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={onOpenAgents}
        >
          <span style={styles.icon}>🤖</span>
          <span style={styles.label}>{LABELS.COMMUNICATION.agents.label}</span>
          {activeAgents > 0 && (
            <div style={styles.agentIndicator} title={`${activeAgents} agent(s) actif(s)`} />
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default CommunicationBar;
