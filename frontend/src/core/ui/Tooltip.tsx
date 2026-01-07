/**
 * CHE·NU™ — Tooltip Component
 * Composant tooltip réutilisable avec support pour titre + description
 */

import React, { useState, useRef, useEffect, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 10000,
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'var(--chenu-surface-elevated, #3A3B3E)',
    border: '1px solid var(--chenu-border, #4A4B4E)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    maxWidth: '280px',
    pointerEvents: 'none',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--chenu-gold, #D8B26A)',
    marginBottom: '4px',
  },
  content: {
    fontSize: '12px',
    color: 'var(--chenu-text, #E9E4D6)',
    lineHeight: 1.4,
  },
  arrow: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: 'var(--chenu-surface-elevated, #3A3B3E)',
    border: '1px solid var(--chenu-border, #4A4B4E)',
    transform: 'rotate(45deg)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  title,
  position = 'top',
  delay = 300,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - 8;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + 8;
          break;
        case 'left':
          x = rect.left - 8;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + 8;
          y = rect.top + rect.height / 2;
          break;
      }
      
      setCoords({ x, y });
    }
  }, [isVisible, position]);

  const getTooltipStyle = (): React.CSSProperties => {
    const base = { ...styles.tooltip };
    
    switch (position) {
      case 'top':
        return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
      case 'bottom':
        return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
      case 'left':
        return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
      case 'right':
        return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
      default:
        return base;
    }
  };

  const getArrowStyle = (): React.CSSProperties => {
    const base = { ...styles.arrow };
    
    switch (position) {
      case 'top':
        return { ...base, bottom: '-4px', left: '50%', marginLeft: '-4px', borderTop: 'none', borderLeft: 'none' };
      case 'bottom':
        return { ...base, top: '-4px', left: '50%', marginLeft: '-4px', borderBottom: 'none', borderRight: 'none' };
      case 'left':
        return { ...base, right: '-4px', top: '50%', marginTop: '-4px', borderBottom: 'none', borderLeft: 'none' };
      case 'right':
        return { ...base, left: '-4px', top: '50%', marginTop: '-4px', borderTop: 'none', borderRight: 'none' };
      default:
        return base;
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={styles.wrapper}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div style={getTooltipStyle()}>
          {title && <div style={styles.title}>{title}</div>}
          <div style={styles.content}>{content}</div>
          <div style={getArrowStyle()} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
