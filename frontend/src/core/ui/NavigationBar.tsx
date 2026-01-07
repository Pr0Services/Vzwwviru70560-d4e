/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — NAVIGATION BAR                                                     ║
 * ║                                                                                  ║
 * ║     Barre de navigation avec labels officiels                                    ║
 * ║     • Centre de Commandement (Dashboard)                                         ║
 * ║     • Bureau de Travail (Workspace)                                              ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { LABELS, TOOLTIPS, type AgentAccessLevel } from './labels';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export type NavigationMode = 'DASHBOARD' | 'BUREAU';

export interface NavigationBarProps {
  currentMode: NavigationMode;
  sphereName?: string;
  workspaceName?: string;
  onModeChange: (mode: NavigationMode) => void;
  onOpenMessages?: () => void;
  onOpenEmail?: () => void;
  onOpenMeetings?: () => void;
  onOpenAgents?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '56px',
    background: 'var(--chenu-surface, #2A2B2E)',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    fontSize: '16px',
    color: 'var(--chenu-gold, #D8B26A)',
  },
  contextBadge: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 12px',
    background: 'var(--chenu-bg, #1E1F22)',
    borderRadius: '6px',
  },
  contextLabel: {
    fontSize: '10px',
    color: 'var(--chenu-text-muted, #8D8371)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contextValue: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--chenu-text, #E9E4D6)',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px',
    background: 'var(--chenu-bg, #1E1F22)',
    borderRadius: '8px',
  },
  modeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '140px',
  },
  modeButtonActive: {
    background: 'var(--chenu-surface, #2A2B2E)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  modeLabel: {
    fontSize: '13px',
    fontWeight: 500,
  },
  modeSubtitle: {
    fontSize: '10px',
    opacity: 0.7,
    marginTop: '2px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.2s ease',
  },
  iconButtonHover: {
    background: 'var(--chenu-bg, #1E1F22)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'var(--chenu-border, #3A3B3E)',
    margin: '0 8px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentMode,
  sphereName = 'Personnel',
  workspaceName,
  onModeChange,
  onOpenMessages,
  onOpenEmail,
  onOpenMeetings,
  onOpenAgents,
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <nav style={styles.container}>
      {/* Left: Logo + Context */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <span>◆</span>
          <span>CHE·NU</span>
        </div>
        
        <Tooltip
          content={LABELS.GLOBAL.contextTooltip}
          position="bottom"
        >
          <div style={styles.contextBadge}>
            <span style={styles.contextLabel}>{LABELS.GLOBAL.contextLabel}</span>
            <span style={styles.contextValue}>{sphereName}</span>
          </div>
        </Tooltip>
      </div>

      {/* Center: Mode Switcher */}
      <div style={styles.center}>
        <Tooltip
          title={TOOLTIPS.NAV_DASHBOARD.title}
          content={TOOLTIPS.NAV_DASHBOARD.description}
          position="bottom"
        >
          <button
            style={{
              ...styles.modeButton,
              ...(currentMode === 'DASHBOARD' ? styles.modeButtonActive : {}),
            }}
            onClick={() => onModeChange('DASHBOARD')}
          >
            <span style={styles.modeLabel}>🎛️ {LABELS.DASHBOARD.shortName}</span>
            <span style={styles.modeSubtitle}>{LABELS.DASHBOARD.subtitle}</span>
          </button>
        </Tooltip>

        <Tooltip
          title={TOOLTIPS.NAV_BUREAU.title}
          content={TOOLTIPS.NAV_BUREAU.description}
          position="bottom"
        >
          <button
            style={{
              ...styles.modeButton,
              ...(currentMode === 'BUREAU' ? styles.modeButtonActive : {}),
            }}
            onClick={() => onModeChange('BUREAU')}
          >
            <span style={styles.modeLabel}>📝 {LABELS.BUREAU.shortName}</span>
            <span style={styles.modeSubtitle}>{LABELS.BUREAU.subtitle}</span>
          </button>
        </Tooltip>
      </div>

      {/* Right: Communication Icons */}
      <div style={styles.right}>
        <Tooltip
          content={LABELS.COMMUNICATION.messages.tooltip}
          position="bottom"
        >
          <button
            style={{
              ...styles.iconButton,
              ...(hoveredButton === 'messages' ? styles.iconButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('messages')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onOpenMessages}
            title={LABELS.COMMUNICATION.messages.label}
          >
            💬
          </button>
        </Tooltip>

        <Tooltip
          content={LABELS.COMMUNICATION.email.tooltip}
          position="bottom"
        >
          <button
            style={{
              ...styles.iconButton,
              ...(hoveredButton === 'email' ? styles.iconButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('email')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onOpenEmail}
            title={LABELS.COMMUNICATION.email.label}
          >
            📧
          </button>
        </Tooltip>

        <Tooltip
          content={LABELS.COMMUNICATION.meetings.tooltip}
          position="bottom"
        >
          <button
            style={{
              ...styles.iconButton,
              ...(hoveredButton === 'meetings' ? styles.iconButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('meetings')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onOpenMeetings}
            title={LABELS.COMMUNICATION.meetings.label}
          >
            📅
          </button>
        </Tooltip>

        <div style={styles.divider} />

        <Tooltip
          content={LABELS.COMMUNICATION.agents.tooltip}
          position="bottom"
        >
          <button
            style={{
              ...styles.iconButton,
              ...(hoveredButton === 'agents' ? styles.iconButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('agents')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onOpenAgents}
            title={LABELS.COMMUNICATION.agents.label}
          >
            🤖
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};

export default NavigationBar;
