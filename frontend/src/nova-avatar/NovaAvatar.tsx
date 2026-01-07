/**
 * CHE·NU — Nova Avatar Component
 * ============================================================
 * Visual representation of Nova governance interface.
 * 
 * Principles:
 * - Reassure, not entertain
 * - Futuristic, calm, neutral
 * - Never increases cognitive load
 * - Can be minimized/disabled at any time
 * 
 * States:
 * - idle: Still, subtle breathing
 * - speaking: Light animation, lip sync
 * - listening: Eyes glow, attentive
 * - processing: Gentle pulse
 * - inactive: Faded
 * 
 * @version 1.0.0
 */

import React, { useMemo } from 'react';
import type { AvatarState, AvatarAppearance } from '../../hooks/useNovaAvatar';
import styles from './NovaAvatar.module.css';

// ============================================================
// TYPES
// ============================================================

interface NovaAvatarProps {
  state: AvatarState;
  appearance: AvatarAppearance;
  isVisible: boolean;
  onMinimize: () => void;
  onDisable: () => void;
}

// ============================================================
// AVATAR CORE (SVG-based)
// ============================================================

const AvatarCore: React.FC<{
  state: AvatarState;
  appearance: AvatarAppearance;
}> = ({ state, appearance }) => {
  
  // Eye glow intensity based on state
  const eyeGlow = useMemo(() => {
    switch (state) {
      case 'listening': return 0.8;
      case 'speaking': return 0.5;
      case 'processing': return 0.6;
      case 'idle': return 0.2;
      default: return 0;
    }
  }, [state]);
  
  return (
    <svg
      className={`${styles.avatarSvg} ${styles[state]}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definitions */}
      <defs>
        {/* Eye glow gradient */}
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#48bb78" stopOpacity={eyeGlow} />
          <stop offset="100%" stopColor="#48bb78" stopOpacity="0" />
        </radialGradient>
        
        {/* Face gradient */}
        <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#2d3748" />
        </linearGradient>
        
        {/* Pulse animation for processing */}
        <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#faceGradient)"
        className={styles.faceBase}
      />
      
      {/* Processing pulse ring */}
      {state === 'processing' && (
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#48bb78"
          strokeWidth="1"
          opacity="0.5"
          className={styles.pulseRing}
        />
      )}
      
      {/* Face outline */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="40"
        fill="none"
        stroke="#718096"
        strokeWidth="0.5"
        opacity="0.3"
      />
      
      {/* Left eye */}
      <g className={styles.eye}>
        <ellipse
          cx="38"
          cy="42"
          rx="6"
          ry="4"
          fill="#1a202c"
        />
        {/* Eye glow */}
        <circle
          cx="38"
          cy="42"
          r="8"
          fill="url(#eyeGlow)"
          className={styles.eyeGlow}
        />
        {/* Pupil */}
        <circle
          cx="38"
          cy="42"
          r="2"
          fill="#48bb78"
          opacity={eyeGlow}
        />
      </g>
      
      {/* Right eye */}
      <g className={styles.eye}>
        <ellipse
          cx="62"
          cy="42"
          rx="6"
          ry="4"
          fill="#1a202c"
        />
        {/* Eye glow */}
        <circle
          cx="62"
          cy="42"
          r="8"
          fill="url(#eyeGlow)"
          className={styles.eyeGlow}
        />
        {/* Pupil */}
        <circle
          cx="62"
          cy="42"
          r="2"
          fill="#48bb78"
          opacity={eyeGlow}
        />
      </g>
      
      {/* Mouth/speaker indicator */}
      <g className={styles.mouth}>
        {state === 'speaking' ? (
          /* Animated speaking indicator */
          <g className={styles.speakingBars}>
            <rect x="42" y="62" width="3" height="6" rx="1" fill="#718096" className={styles.bar1} />
            <rect x="47" y="60" width="3" height="10" rx="1" fill="#718096" className={styles.bar2} />
            <rect x="52" y="62" width="3" height="6" rx="1" fill="#718096" className={styles.bar3} />
            <rect x="57" y="61" width="3" height="8" rx="1" fill="#718096" className={styles.bar4} />
          </g>
        ) : (
          /* Static line */
          <line
            x1="42"
            y1="65"
            x2="58"
            y2="65"
            stroke="#718096"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        )}
      </g>
      
      {/* Listening indicator */}
      {state === 'listening' && (
        <g className={styles.listeningIndicator}>
          <circle cx="50" cy="85" r="3" fill="#48bb78" className={styles.dot1} />
          <circle cx="58" cy="83" r="2" fill="#48bb78" className={styles.dot2} />
          <circle cx="42" cy="83" r="2" fill="#48bb78" className={styles.dot3} />
        </g>
      )}
    </svg>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const NovaAvatar: React.FC<NovaAvatarProps> = ({
  state,
  appearance,
  isVisible,
  onMinimize,
  onDisable
}) => {
  
  if (!isVisible) return null;
  
  const sizeClass = styles[`size_${appearance.size}`] || styles.size_small;
  const positionClass = styles[`position_${appearance.position}`] || styles.position_docked;
  
  return (
    <div className={`${styles.container} ${sizeClass} ${positionClass}`}>
      {/* Avatar */}
      <div className={`${styles.avatarWrapper} ${state === 'inactive' ? styles.inactive : ''}`}>
        <AvatarCore state={state} appearance={appearance} />
      </div>
      
      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={onMinimize}
          title="Minimize"
          aria-label="Minimize avatar"
        >
          <svg viewBox="0 0 16 16" className={styles.controlIcon}>
            <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button
          className={styles.controlButton}
          onClick={onDisable}
          title="Disable avatar"
          aria-label="Disable avatar"
        >
          <svg viewBox="0 0 16 16" className={styles.controlIcon}>
            <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      
      {/* State indicator */}
      <div className={styles.stateIndicator}>
        <span className={`${styles.stateDot} ${styles[`state_${state}`]}`} />
        <span className={styles.stateLabel}>{getStateLabel(state)}</span>
      </div>
    </div>
  );
};

// Helper
function getStateLabel(state: AvatarState): string {
  switch (state) {
    case 'idle': return 'Ready';
    case 'speaking': return 'Speaking';
    case 'listening': return 'Listening';
    case 'processing': return 'Processing';
    case 'inactive': return 'Inactive';
    default: return '';
  }
}

export default NovaAvatar;
