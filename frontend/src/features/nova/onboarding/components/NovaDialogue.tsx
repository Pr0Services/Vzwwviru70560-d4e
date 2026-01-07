/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA DIALOGUE COMPONENT                         ║
 * ║                    Bulle de dialogue avec effet typing                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NovaScript, NovaAction } from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaDialogueProps {
  script: NovaScript;
  messageIndex: number;
  onNextMessage: () => void;
  onAction: (action: NovaAction) => void;
  onClose?: () => void;
  position?: 'center' | 'bottom-right' | 'top-right';
  compact?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  cenoteTurquoise: '#3EB4A2',
  sacredGold: '#D8B26A',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
};

const TYPING_SPEED = 25; // ms per character
const PAUSE_BETWEEN_SENTENCES = 400; // ms

// ═══════════════════════════════════════════════════════════════════════════════
// TYPING HOOK
// ═══════════════════════════════════════════════════════════════════════════════

function useTypingEffect(text: string, speed: number = TYPING_SPEED): {
  displayedText: string;
  isComplete: boolean;
  skip: () => void;
} {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  return { displayedText, isComplete, skip };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaDialogue: React.FC<NovaDialogueProps> = ({
  script,
  messageIndex,
  onNextMessage,
  onAction,
  onClose,
  position = 'bottom-right',
  compact = false,
}) => {
  const currentMessage = script.messages[messageIndex] || '';
  const isLastMessage = messageIndex >= script.messages.length - 1;
  const hasActions = script.actions && script.actions.length > 0;
  
  const { displayedText, isComplete, skip } = useTypingEffect(currentMessage);

  // Position styles
  const positionStyles = useMemo(() => {
    switch (position) {
      case 'center':
        return {
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      case 'top-right':
        return {
          position: 'fixed' as const,
          top: 80,
          right: 24,
        };
      case 'bottom-right':
      default:
        return {
          position: 'fixed' as const,
          bottom: 80,
          right: 24,
        };
    }
  }, [position]);

  // Handle click on dialogue (skip typing or go to next message)
  const handleClick = useCallback(() => {
    if (!isComplete) {
      skip();
    } else if (!isLastMessage) {
      onNextMessage();
    }
  }, [isComplete, isLastMessage, skip, onNextMessage]);

  // Progress dots
  const progressDots = useMemo(() => {
    return script.messages.map((_, i) => (
      <div
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: i === messageIndex 
            ? COLORS.cenoteTurquoise 
            : i < messageIndex 
              ? `${COLORS.cenoteTurquoise}60`
              : COLORS.border,
          transition: 'all 0.3s ease',
        }}
      />
    ));
  }, [script.messages, messageIndex]);

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={handleClick}
      />

      {/* Dialogue Box */}
      <div
        style={{
          ...positionStyles,
          width: compact ? 320 : 420,
          backgroundColor: COLORS.uiSlate,
          borderRadius: 16,
          border: `1px solid ${COLORS.cenoteTurquoise}40`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px ${COLORS.cenoteTurquoise}20`,
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideUp 0.4s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${COLORS.border}`,
            backgroundColor: `${COLORS.cenoteTurquoise}10`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span 
              style={{ 
                fontSize: 20,
                animation: 'novaGlow 2s ease-in-out infinite',
              }}
            >
              ✨
            </span>
            <span 
              style={{ 
                fontWeight: 600, 
                color: COLORS.cenoteTurquoise,
                fontSize: 14,
              }}
            >
              Nova
            </span>
            <span 
              style={{ 
                fontSize: 11, 
                color: COLORS.ancientStone,
                marginLeft: 4,
              }}
            >
              {script.title}
            </span>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.ancientStone,
                cursor: 'pointer',
                fontSize: 16,
                padding: 4,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: compact ? 16 : 20,
            minHeight: compact ? 80 : 100,
          }}
          onClick={handleClick}
        >
          <p
            style={{
              margin: 0,
              fontSize: compact ? 13 : 14,
              lineHeight: 1.7,
              color: COLORS.softSand,
            }}
          >
            {displayedText}
            {!isComplete && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  backgroundColor: COLORS.cenoteTurquoise,
                  marginLeft: 2,
                  animation: 'blink 0.8s infinite',
                }}
              />
            )}
          </p>
        </div>

        {/* Progress Dots */}
        {script.messages.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 16px',
            }}
          >
            {progressDots}
          </div>
        )}

        {/* Actions */}
        {isComplete && isLastMessage && hasActions && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 16px',
              borderTop: `1px solid ${COLORS.border}`,
              justifyContent: 'flex-end',
            }}
          >
            {script.actions!.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: action.primary 
                    ? 'none' 
                    : `1px solid ${COLORS.border}`,
                  backgroundColor: action.primary 
                    ? COLORS.cenoteTurquoise 
                    : 'transparent',
                  color: action.primary 
                    ? COLORS.uiDark 
                    : COLORS.softSand,
                  fontSize: 13,
                  fontWeight: action.primary ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Continue hint */}
        {isComplete && !isLastMessage && (
          <div
            style={{
              padding: '8px 16px 12px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: COLORS.ancientStone,
                animation: 'pulse 2s infinite',
              }}
            >
              Cliquez pour continuer...
            </span>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: ${position === 'center' ? 'translate(-50%, -45%)' : 'translateY(20px)'};
          }
          to { 
            opacity: 1;
            transform: ${position === 'center' ? 'translate(-50%, -50%)' : 'translateY(0)'};
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes novaGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 4px rgba(62, 180, 162, 0.5));
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(62, 180, 162, 0.8));
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default NovaDialogue;
