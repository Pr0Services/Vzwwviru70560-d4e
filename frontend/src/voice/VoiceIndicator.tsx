/**
 * CHE·NU — Voice Indicator Component
 * ============================================================
 * Shows voice status and provides push-to-talk control.
 * 
 * States:
 * - Available (grey mic)
 * - Listening (pulsing green)
 * - Processing (spinning)
 * - Speaking (animated waves)
 * - Muted (crossed mic)
 * 
 * @version 1.0.0
 */

import React, { useCallback } from 'react';
import type { VoiceState } from '../../hooks/useVoiceActivation';
import styles from './VoiceIndicator.module.css';

interface VoiceIndicatorProps {
  state: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onMute: () => void;
  onUnmute: () => void;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  state,
  onStartListening,
  onStopListening,
  onMute,
  onUnmute
}) => {
  // Only show if voice is enabled
  if (state === 'unavailable' || state === 'available' || 
      state === 'proposed' || state === 'declined') {
    return null;
  }
  
  const isListening = state === 'listening';
  const isMuted = state === 'muted';
  const isProcessing = state === 'processing';
  const isSpeaking = state === 'speaking';
  
  // Handle click
  const handleClick = useCallback(() => {
    if (isMuted) {
      onUnmute();
    } else if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  }, [isMuted, isListening, onUnmute, onStopListening, onStartListening]);
  
  // Handle long press for mute
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMuted) {
      onMute();
    }
  }, [isMuted, onMute]);
  
  // Get state class
  const stateClass = styles[state] || '';
  
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${stateClass}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        title={getTitle(state)}
        aria-label={getAriaLabel(state)}
        disabled={isProcessing || isSpeaking}
      >
        {/* Mic icon */}
        {!isMuted ? (
          <svg 
            className={styles.icon}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg 
            className={styles.icon}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
        
        {/* Listening animation */}
        {isListening && (
          <div className={styles.pulseRing} />
        )}
        
        {/* Processing spinner */}
        {isProcessing && (
          <div className={styles.spinner} />
        )}
        
        {/* Speaking waves */}
        {isSpeaking && (
          <div className={styles.waves}>
            <div className={styles.wave} />
            <div className={styles.wave} />
            <div className={styles.wave} />
          </div>
        )}
      </button>
      
      {/* State label */}
      <span className={styles.label}>
        {getLabel(state)}
      </span>
    </div>
  );
};

// Helper functions
function getTitle(state: VoiceState): string {
  switch (state) {
    case 'enabled': return 'Click to start listening';
    case 'listening': return 'Click to stop listening';
    case 'processing': return 'Processing...';
    case 'speaking': return 'Nova is speaking';
    case 'muted': return 'Click to unmute';
    default: return 'Voice';
  }
}

function getAriaLabel(state: VoiceState): string {
  switch (state) {
    case 'enabled': return 'Voice enabled, click to start listening';
    case 'listening': return 'Listening, click to stop';
    case 'processing': return 'Processing voice input';
    case 'speaking': return 'Nova is speaking';
    case 'muted': return 'Voice muted, click to unmute';
    default: return 'Voice control';
  }
}

function getLabel(state: VoiceState): string {
  switch (state) {
    case 'listening': return 'Listening...';
    case 'processing': return 'Processing...';
    case 'speaking': return 'Speaking';
    case 'muted': return 'Muted';
    default: return '';
  }
}

export default VoiceIndicator;
