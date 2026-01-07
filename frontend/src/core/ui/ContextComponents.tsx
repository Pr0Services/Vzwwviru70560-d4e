/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — MINI MAP VIEW & CLARIFICATION                                      ║
 * ║                                                                                  ║
 * ║     Composants de contexte et d'onboarding                                       ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import {
  LABELS,
  CLARIFICATION_PHRASES,
  hasSeenClarification,
  markClarificationSeen,
} from './labels';

// ═══════════════════════════════════════════════════════════════════════════════════
// MINI MAP VIEW
// ═══════════════════════════════════════════════════════════════════════════════════

export interface MiniMapViewProps {
  currentSphere: string;
  currentMode: 'DASHBOARD' | 'BUREAU';
  sphereColor?: string;
}

const miniMapStyles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: '70px',
    left: '20px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    background: 'var(--chenu-surface, #2A2B2E)',
    borderRadius: '12px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  label: {
    fontSize: '10px',
    color: 'var(--chenu-text-muted, #8D8371)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sphereIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sphereDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  sphereName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--chenu-text, #E9E4D6)',
  },
  modeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    background: 'var(--chenu-bg, #1E1F22)',
  },
  modeIcon: {
    fontSize: '14px',
  },
  modeName: {
    fontSize: '12px',
    color: 'var(--chenu-text-muted, #8D8371)',
  },
};

export const MiniMapView: React.FC<MiniMapViewProps> = ({
  currentSphere,
  currentMode,
  sphereColor = '#3EB4A2',
}) => {
  const modeLabel = currentMode === 'DASHBOARD' 
    ? LABELS.DASHBOARD.shortName 
    : LABELS.BUREAU.shortName;
  
  const modeIcon = currentMode === 'DASHBOARD' ? '🎛️' : '📝';

  return (
    <Tooltip content={LABELS.GLOBAL.contextTooltip} position="right">
      <div style={miniMapStyles.container}>
        <span style={miniMapStyles.label}>{LABELS.GLOBAL.contextLabel}</span>
        
        <div style={miniMapStyles.sphereIndicator}>
          <div style={{ ...miniMapStyles.sphereDot, background: sphereColor }} />
          <span style={miniMapStyles.sphereName}>{currentSphere}</span>
        </div>
        
        <div style={miniMapStyles.modeIndicator}>
          <span style={miniMapStyles.modeIcon}>{modeIcon}</span>
          <span style={miniMapStyles.modeName}>{modeLabel}</span>
        </div>
      </div>
    </Tooltip>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// CLARIFICATION BANNER
// ═══════════════════════════════════════════════════════════════════════════════════

export interface ClarificationBannerProps {
  mode: 'DASHBOARD' | 'BUREAU';
  onDismiss?: () => void;
  forceShow?: boolean;
}

const bannerStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '12px 24px',
    background: 'var(--chenu-info-subtle, rgba(62, 180, 162, 0.1))',
    borderBottom: '1px solid var(--chenu-accent, #3EB4A2)',
  },
  icon: {
    fontSize: '20px',
  },
  text: {
    fontSize: '14px',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  highlight: {
    color: 'var(--chenu-gold, #D8B26A)',
    fontWeight: 500,
  },
  dismissButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    background: 'var(--chenu-surface, #2A2B2E)',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease',
  },
};

export const ClarificationBanner: React.FC<ClarificationBannerProps> = ({
  mode,
  onDismiss,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      return;
    }
    
    const hasSeen = hasSeenClarification(mode);
    setIsVisible(!hasSeen);
  }, [mode, forceShow]);

  const handleDismiss = () => {
    markClarificationSeen(mode);
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const phrase = CLARIFICATION_PHRASES[mode];
  const icon = mode === 'DASHBOARD' ? '🎛️' : '📝';
  const zoneName = mode === 'DASHBOARD' 
    ? LABELS.DASHBOARD.name 
    : LABELS.BUREAU.name;

  // Parse phrase to highlight "Bureau" or "Centre de Commandement"
  const parts = phrase.split(/(Bureau|Centre de Commandement)/g);

  return (
    <div style={bannerStyles.container}>
      <span style={bannerStyles.icon}>{icon}</span>
      <span style={bannerStyles.text}>
        {parts.map((part, i) => {
          if (part === 'Bureau' || part === 'Centre de Commandement') {
            return <span key={i} style={bannerStyles.highlight}>{part}</span>;
          }
          return part;
        })}
      </span>
      <button style={bannerStyles.dismissButton} onClick={handleDismiss}>
        Compris ✓
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// WINDOW TITLE BAR
// ═══════════════════════════════════════════════════════════════════════════════════

export interface WindowTitleBarProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTooltip?: string;
  badgeVariant?: 'default' | 'warning' | 'success' | 'info';
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const titleBarStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'var(--chenu-surface, #2A2B2E)',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--chenu-text, #E9E4D6)',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--chenu-text-muted, #8D8371)',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  badgeDefault: {
    background: 'var(--chenu-surface-elevated, #3A3B3E)',
    color: 'var(--chenu-text-muted, #8D8371)',
  },
  badgeWarning: {
    background: 'var(--chenu-warning-subtle, rgba(217, 178, 106, 0.15))',
    color: 'var(--chenu-warning, #D8B26A)',
  },
  badgeSuccess: {
    background: 'var(--chenu-success-subtle, rgba(62, 180, 162, 0.15))',
    color: 'var(--chenu-success, #3EB4A2)',
  },
  badgeInfo: {
    background: 'var(--chenu-info-subtle, rgba(59, 130, 246, 0.15))',
    color: 'var(--chenu-info, #3B82F6)',
  },
  controls: {
    display: 'flex',
    gap: '6px',
  },
  controlButton: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
};

export const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  title,
  subtitle,
  badge,
  badgeTooltip,
  badgeVariant = 'default',
  onClose,
  onMinimize,
  onMaximize,
}) => {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'warning': return { ...titleBarStyles.badge, ...titleBarStyles.badgeWarning };
      case 'success': return { ...titleBarStyles.badge, ...titleBarStyles.badgeSuccess };
      case 'info': return { ...titleBarStyles.badge, ...titleBarStyles.badgeInfo };
      default: return { ...titleBarStyles.badge, ...titleBarStyles.badgeDefault };
    }
  };

  const BadgeElement = badge && (
    <span style={getBadgeStyle()}>{badge}</span>
  );

  return (
    <div style={titleBarStyles.container}>
      <div style={titleBarStyles.left}>
        <div style={titleBarStyles.titleGroup}>
          <span style={titleBarStyles.title}>{title}</span>
          {subtitle && <span style={titleBarStyles.subtitle}>{subtitle}</span>}
        </div>
        
        {badge && badgeTooltip ? (
          <Tooltip content={badgeTooltip} position="bottom">
            {BadgeElement}
          </Tooltip>
        ) : (
          BadgeElement
        )}
      </div>
      
      <div style={titleBarStyles.controls}>
        {onMinimize && (
          <button style={titleBarStyles.controlButton} onClick={onMinimize}>−</button>
        )}
        {onMaximize && (
          <button style={titleBarStyles.controlButton} onClick={onMaximize}>□</button>
        )}
        {onClose && (
          <button style={titleBarStyles.controlButton} onClick={onClose}>×</button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// AGENT ACCESS BADGE
// ═══════════════════════════════════════════════════════════════════════════════════

export interface AgentAccessBadgeProps {
  accessLevel: 'none' | 'limited' | 'authorized';
}

const accessBadgeStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
  },
  none: {
    background: 'var(--chenu-error-subtle, rgba(239, 68, 68, 0.15))',
    color: 'var(--chenu-error, #EF4444)',
  },
  limited: {
    background: 'var(--chenu-warning-subtle, rgba(217, 178, 106, 0.15))',
    color: 'var(--chenu-warning, #D8B26A)',
  },
  authorized: {
    background: 'var(--chenu-success-subtle, rgba(62, 180, 162, 0.15))',
    color: 'var(--chenu-success, #3EB4A2)',
  },
};

export const AgentAccessBadge: React.FC<AgentAccessBadgeProps> = ({ accessLevel }) => {
  const badges = LABELS.BUREAU_WINDOWS.AGENT.badges;
  
  const getLabel = () => {
    switch (accessLevel) {
      case 'none': return badges.NO_ACCESS;
      case 'limited': return badges.LIMITED;
      case 'authorized': return badges.AUTHORIZED;
    }
  };
  
  const getIcon = () => {
    switch (accessLevel) {
      case 'none': return '🚫';
      case 'limited': return '⚠️';
      case 'authorized': return '✓';
    }
  };

  return (
    <Tooltip 
      content={
        accessLevel === 'none' ? 'Cet agent n\'a pas accès à vos messages.' :
        accessLevel === 'limited' ? 'Accès sur demande uniquement.' :
        'Accès explicitement autorisé par vous.'
      }
      position="bottom"
    >
      <div style={{ 
        ...accessBadgeStyles.container, 
        ...accessBadgeStyles[accessLevel] 
      }}>
        <span>{getIcon()}</span>
        <span>{getLabel()}</span>
      </div>
    </Tooltip>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════════

export default {
  MiniMapView,
  ClarificationBanner,
  WindowTitleBar,
  AgentAccessBadge,
};
