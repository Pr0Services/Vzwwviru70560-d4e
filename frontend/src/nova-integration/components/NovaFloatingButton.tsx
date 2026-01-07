// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA FLOATING BUTTON
// Bouton flottant Nova pour un accès rapide
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from 'react';
import { useNovaContext } from '../providers/NovaProvider';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface NovaFloatingButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
  pulse?: boolean;
  customStyle?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function NovaFloatingButton({
  position = 'bottom-right',
  size = 'medium',
  showLabel = false,
  showBadge = false,
  badgeCount = 0,
  pulse = false,
  customStyle = {},
}: NovaFloatingButtonProps) {
  const { state, toggleNova } = useNovaContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Pulse animation on new suggestions
  useEffect(() => {
    if (state.suggestions.length > 0 && pulse) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.suggestions.length, pulse]);

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  
  const sizeValues = {
    small: { button: 48, icon: 24, label: 12 },
    medium: { button: 56, icon: 28, label: 14 },
    large: { button: 64, icon: 32, label: 16 },
  };

  const positionValues = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 },
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionValues[position],
    width: sizeValues[size].button,
    height: sizeValues[size].button,
    borderRadius: '50%',
    background: state.isOpen
      ? 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)'
      : 'linear-gradient(135deg, #D8B26A 0%, #8D8371 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isHovered
      ? '0 8px 32px rgba(216, 178, 106, 0.4)'
      : '0 4px 16px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    zIndex: 9998,
    ...customStyle,
  };

  const iconStyle: React.CSSProperties = {
    width: sizeValues[size].icon,
    height: sizeValues[size].icon,
    transition: 'transform 0.3s ease',
    transform: state.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: sizeValues[size].button + 8,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--chenu-bg-primary, #1E1F22)',
    color: 'var(--chenu-text-primary, #fff)',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: sizeValues[size].label,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: '10px',
    backgroundColor: '#E53935',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const pulseStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D8B26A 0%, #8D8371 100%)',
    opacity: 0.6,
    animation: isAnimating ? 'nova-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      <button
        onClick={toggleNova}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={buttonStyle}
        aria-label="Toggle Nova assistant"
        title="Nova (appuie sur / pour ouvrir)"
      >
        {/* Pulse ring */}
        {isAnimating && <div style={pulseStyle} />}
        
        {/* Icon */}
        <svg
          style={iconStyle}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {state.isOpen ? (
            // Close icon
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            // Nova brain icon
            <>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
              <path
                d="M12 7V12L15 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="2" fill="white" />
            </>
          )}
        </svg>
        
        {/* Badge */}
        {showBadge && badgeCount > 0 && (
          <div style={badgeStyle}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </div>
        )}
        
        {/* Label */}
        {showLabel && (
          <div style={labelStyle}>
            {state.isOpen ? 'Fermer Nova' : 'Ouvrir Nova'}
          </div>
        )}
      </button>

      <style>{`
        @keyframes nova-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export default NovaFloatingButton;
