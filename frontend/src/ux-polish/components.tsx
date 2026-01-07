// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — UX POLISH REACT COMPONENTS
// Implementing the UX Philosophy
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface Position3D {
  x: number;
  y: number;
  z: number;
}

interface CognitiveLoadLevel {
  level: 'low' | 'medium' | 'high' | 'overload';
  factors: {
    activeAgents: number;
    openThreads: number;
    pendingDecisions: number;
    timeInSession: number;
  };
}

// =============================================================================
// BACK BUTTON - Always visible, never scary
// =============================================================================

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Retour' 
}) => {
  return (
    <button
      onClick={onClick}
      className="btn-back"
      aria-label={label}
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '1.5rem',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 200ms ease',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
      {label}
    </button>
  );
};

// =============================================================================
// SCREEN CONTEXT - Answers the 4 Questions
// =============================================================================

interface ScreenContextProps {
  // Q1: Where am I?
  breadcrumb: string[];
  sphereName: string;
  sphereEmoji?: string;
  
  // Q2: Why am I here?
  objective: string;
  
  // Q3: What's happening now?
  status?: string;
  activeAgents?: string[];
  
  // Q4: What can I do next? (passed as children)
  children: React.ReactNode;
}

export const ScreenContext: React.FC<ScreenContextProps> = ({
  breadcrumb,
  sphereName,
  sphereEmoji,
  objective,
  status,
  activeAgents = [],
  children,
}) => {
  return (
    <div className="screen-context" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.5rem',
    }}>
      {/* Q1: Where am I? */}
      <div className="context-location" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#737373',
      }}>
        {sphereEmoji && <span>{sphereEmoji}</span>}
        <span style={{ fontWeight: 500 }}>{sphereName}</span>
        {breadcrumb.map((item, i) => (
          <React.Fragment key={i}>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>
      
      {/* Q2: Why am I here? */}
      <div className="context-objective" style={{
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '1rem',
      }}>
        <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>Objectif</span>
        <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{objective}</p>
      </div>
      
      {/* Q3: What's happening now? */}
      {(status || activeAgents.length > 0) && (
        <div className="context-status" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          color: '#737373',
        }}>
          {status && <span>{status}</span>}
          {activeAgents.length > 0 && (
            <AgentPresenceIndicator agents={activeAgents} />
          )}
        </div>
      )}
      
      {/* Q4: What can I do next? */}
      <div className="context-actions" style={{ marginTop: '1rem' }}>
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// COGNITIVE LOAD INDICATOR
// =============================================================================

interface CognitiveLoadIndicatorProps {
  load: CognitiveLoadLevel;
  onRequestCalmMode?: () => void;
}

export const CognitiveLoadIndicator: React.FC<CognitiveLoadIndicatorProps> = ({
  load,
  onRequestCalmMode,
}) => {
  const messages: Record<CognitiveLoadLevel['level'], string | null> = {
    low: null,
    medium: 'Beaucoup d\'éléments actifs',
    high: 'Suggérer une pause?',
    overload: 'Mode focus recommandé',
  };
  
  const colors: Record<CognitiveLoadLevel['level'], { bg: string; text: string }> = {
    low: { bg: '#ecfdf5', text: '#059669' },
    medium: { bg: '#fffbeb', text: '#d97706' },
    high: { bg: '#fef2f2', text: '#dc2626' },
    overload: { bg: '#fef2f2', text: '#dc2626' },
  };
  
  const message = messages[load.level];
  const color = colors[load.level];
  
  if (load.level === 'low') {
    return null; // No indicator when cognitive load is low
  }
  
  return (
    <div 
      className="cognitive-load-indicator"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        background: color.bg,
        color: color.text,
        borderRadius: '9999px',
        fontSize: '0.75rem',
      }}
    >
      <span>●</span>
      <span>{message}</span>
      {(load.level === 'high' || load.level === 'overload') && onRequestCalmMode && (
        <button
          onClick={onRequestCalmMode}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: 'inherit',
          }}
        >
          Activer
        </button>
      )}
    </div>
  );
};

// =============================================================================
// AGENT PRESENCE INDICATOR - Subtle, not prominent
// =============================================================================

interface AgentPresenceIndicatorProps {
  agents: string[];
}

export const AgentPresenceIndicator: React.FC<AgentPresenceIndicatorProps> = ({
  agents,
}) => {
  if (agents.length === 0) return null;
  
  return (
    <div 
      className="agent-presence"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.875rem',
        color: '#737373',
        opacity: 0.8,
      }}
    >
      <div 
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
          animation: 'gentle-pulse 3s ease-in-out infinite',
        }}
      />
      <span>
        {agents.length === 1 
          ? `${agents[0]} prêt` 
          : `${agents.length} agents prêts`
        }
      </span>
    </div>
  );
};

// =============================================================================
// GENTLE FEEDBACK - Toast notifications
// =============================================================================

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 400); // Wait for fade animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);
  
  const icons: Record<string, string> = {
    success: '✓',
    info: 'ℹ',
    warning: '!',
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: '#262626',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 400ms ease',
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
};

// =============================================================================
// CALM MODE TOGGLE
// =============================================================================

interface CalmModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export const CalmModeToggle: React.FC<CalmModeToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: isActive ? '#ecfdf5' : '#f5f5f5',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: isActive ? '#059669' : '#737373',
        transition: 'all 200ms ease',
      }}
    >
      <span>{isActive ? '🧘' : '○'}</span>
      <span>Mode Calme {isActive ? 'actif' : ''}</span>
    </button>
  );
};

// =============================================================================
// ACTION BUTTONS - Clear hierarchy
// =============================================================================

interface ActionButtonsProps {
  primary: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondary?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  primary,
  secondary = [],
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      {/* Primary action - prominent */}
      <button
        onClick={primary.onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          maxWidth: '300px',
          padding: '0.875rem 1.5rem',
          background: '#0084ff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
          transition: 'all 200ms ease',
        }}
      >
        {primary.icon}
        {primary.label}
      </button>
      
      {/* Secondary actions - available but not competing */}
      {secondary.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
        }}>
          {secondary.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#525252',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MEETING ROOM QUICK ACTIONS
// =============================================================================

interface MeetingQuickActionsProps {
  onSummarize: () => void;
  onDecide: () => void;
  onPause: () => void;
}

export const MeetingQuickActions: React.FC<MeetingQuickActionsProps> = ({
  onSummarize,
  onDecide,
  onPause,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1.5rem',
      background: '#fafafa',
      borderRadius: '12px',
    }}>
      <button
        onClick={onSummarize}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 2rem',
          background: '#0084ff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        📝 Résumer
      </button>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onDecide}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            color: '#525252',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ✅ Décider
        </button>
        <button
          onClick={onPause}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            color: '#525252',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ⏸️ Continuer plus tard
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// ONBOARDING HINT - Ultra-light, one at a time
// =============================================================================

interface OnboardingHintProps {
  content: string;
  targetRef?: React.RefObject<HTMLElement>;
  onDismiss: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const OnboardingHint: React.FC<OnboardingHintProps> = ({
  content,
  onDismiss,
  position = 'bottom',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000); // Auto-dismiss after 5 seconds
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div
      style={{
        position: 'absolute',
        padding: '0.75rem 1rem',
        background: '#262626',
        color: 'white',
        borderRadius: '8px',
        fontSize: '0.875rem',
        maxWidth: '250px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-5px)',
        transition: 'all 400ms ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {content}
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 400);
        }}
        style={{
          position: 'absolute',
          top: '4px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          fontSize: '0.75rem',
        }}
      >
        ✕
      </button>
    </div>
  );
};

// =============================================================================
// AGENDA COMPACT - Always visible, even when minimized
// =============================================================================

interface AgendaCompactProps {
  currentPhase: string;
  progress: number; // 0-100
  timeRemaining?: number; // minutes
  onExpand: () => void;
}

export const AgendaCompact: React.FC<AgendaCompactProps> = ({
  currentPhase,
  progress,
  timeRemaining,
  onExpand,
}) => {
  return (
    <button
      onClick={onExpand}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 1rem',
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 200ms ease',
      }}
    >
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {currentPhase}
      </span>
      
      {/* Progress bar */}
      <div style={{
        width: '60px',
        height: '4px',
        background: '#e8e8e8',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#0084ff',
          transition: 'width 400ms ease',
        }} />
      </div>
      
      {timeRemaining !== undefined && (
        <span style={{ fontSize: '0.75rem', color: '#737373' }}>
          {timeRemaining}min
        </span>
      )}
      
      <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>▼</span>
    </button>
  );
};

// =============================================================================
// LOADING STATE - Calm, not busy
// =============================================================================

export const LoadingCalm: React.FC<{ message?: string }> = ({ 
  message = 'Un moment...' 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
    }}>
      {/* Gentle pulsing circle instead of spinning */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #e0efff 0%, #b8dbff 100%)',
        animation: 'gentle-pulse 2s ease-in-out infinite',
      }} />
      <span style={{ 
        color: '#737373', 
        fontSize: '0.875rem',
      }}>
        {message}
      </span>
    </div>
  );
};

// =============================================================================
// NOVA ASSISTANT - Discreet presence
// =============================================================================

interface NovaPresenceProps {
  status: 'idle' | 'thinking' | 'ready';
  onActivate: () => void;
}

export const NovaPresence: React.FC<NovaPresenceProps> = ({
  status,
  onActivate,
}) => {
  return (
    <button
      onClick={onActivate}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '9999px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms ease',
        opacity: 0.8,
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: status === 'thinking' 
          ? 'linear-gradient(135deg, #b8dbff 0%, #7ac0ff 100%)'
          : '#e8e8e8',
        animation: status === 'thinking' 
          ? 'gentle-pulse 1.5s ease-in-out infinite' 
          : 'gentle-pulse 4s ease-in-out infinite',
      }} />
      <span style={{ 
        fontSize: '0.75rem', 
        color: '#737373',
      }}>
        Nova
      </span>
    </button>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  BackButton,
  ScreenContext,
  CognitiveLoadIndicator,
  AgentPresenceIndicator,
  Toast,
  CalmModeToggle,
  ActionButtons,
  MeetingQuickActions,
  OnboardingHint,
  AgendaCompact,
  LoadingCalm,
  NovaPresence,
};
