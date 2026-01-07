/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — ACCESSIBLE NAVIGATION COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════
   
   WCAG 2.1 AA Compliant Navigation
   - Skip to content link
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Reduced motion support
   
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useCallback, useRef, useEffect } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars';

export interface SphereConfig {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  shortcut: string; // Keyboard shortcut
}

export interface NavigationProps {
  activeSphere: SphereId;
  onSphereChange: (sphere: SphereId) => void;
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

export const SPHERES: SphereConfig[] = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', icon: '🏠', color: '#3EB4A2', shortcut: '1' },
  { id: 'business', name: 'Business', nameFr: 'Affaires', icon: '💼', color: '#D8B26A', shortcut: '2' },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', icon: '🏛️', color: '#8D8371', shortcut: '3' },
  { id: 'design_studio', name: 'Studio', nameFr: 'Studio', icon: '🎨', color: '#3F7249', shortcut: '4' },
  { id: 'community', name: 'Community', nameFr: 'Communauté', icon: '👥', color: '#5DA9FF', shortcut: '5' },
  { id: 'social', name: 'Social', nameFr: 'Social', icon: '📱', color: '#9B59B6', shortcut: '6' },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', icon: '🎬', color: '#7A593A', shortcut: '7' },
  { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe', icon: '🤝', color: '#E74C3C', shortcut: '8' },
  { id: 'scholars', name: 'Scholar', nameFr: 'Études', icon: '📚', color: '#1ABC9C', shortcut: '9' },
];

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  skipLink: {
    position: 'absolute' as const,
    top: '-40px',
    left: 0,
    background: '#5DA9FF',
    color: '#fff',
    padding: '8px 16px',
    zIndex: 100,
    transition: 'top 0.3s',
    borderRadius: '0 0 4px 0',
    textDecoration: 'none',
    fontWeight: 600,
  },
  skipLinkFocus: {
    top: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    padding: '8px',
    background: '#151A21',
    borderRadius: '8px',
  },
  sphereButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    color: '#AEB6C3',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
    width: '100%',
  },
  sphereButtonActive: {
    background: '#232B3A',
    color: '#E6EAF0',
  },
  sphereButtonHover: {
    background: '#1B2230',
  },
  sphereIcon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center' as const,
  },
  sphereName: {
    flex: 1,
  },
  shortcut: {
    fontSize: '11px',
    color: '#525B6B',
    background: '#0F1216',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  focusRing: {
    outline: '2px solid #5DA9FF',
    outlineOffset: '2px',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// REDUCED MOTION HOOK
// ════════════════════════════════════════════════════════════════════════════════

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
};

// ════════════════════════════════════════════════════════════════════════════════
// SKIP LINK COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const SkipToContent: React.FC<{ targetId?: string }> = ({ targetId = 'main-content' }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <a
      href={`#${targetId}`}
      style={{
        ...styles.skipLink,
        ...(isFocused ? styles.skipLinkFocus : {}),
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="skip-to-content"
    >
      Aller au contenu principal
    </a>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE NAVIGATION COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const SphereNavigation: React.FC<NavigationProps> = ({
  activeSphere,
  onSphereChange,
  className,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % SPHERES.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + SPHERES.length) % SPHERES.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = SPHERES.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSphereChange(SPHERES[index].id);
        return;
      default:
        // Number shortcuts (1-9)
        if (e.key >= '1' && e.key <= '9') {
          const shortcutIndex = parseInt(e.key) - 1;
          if (shortcutIndex < SPHERES.length) {
            e.preventDefault();
            onSphereChange(SPHERES[shortcutIndex].id);
            buttonRefs.current[shortcutIndex]?.focus();
          }
        }
        return;
    }
    
    setFocusedIndex(newIndex);
    buttonRefs.current[newIndex]?.focus();
  }, [onSphereChange]);
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt + number for quick sphere switch
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < SPHERES.length) {
          e.preventDefault();
          onSphereChange(SPHERES[index].id);
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onSphereChange]);
  
  const transitionStyle = prefersReducedMotion 
    ? { transition: 'none' } 
    : { transition: 'all 0.2s ease' };
  
  return (
    <nav
      ref={navRef}
      aria-label="Navigation des sphères"
      role="navigation"
      style={styles.nav}
      className={className}
    >
      <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {SPHERES.map((sphere, index) => {
          const isActive = activeSphere === sphere.id;
          
          return (
            <li key={sphere.id} role="listitem">
              <button
                ref={(el) => (buttonRefs.current[index] = el)}
                role="button"
                aria-pressed={isActive}
                aria-label={`Aller à la sphère ${sphere.nameFr}. Raccourci: Alt + ${sphere.shortcut}`}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={focusedIndex === index || (focusedIndex === -1 && isActive) ? 0 : -1}
                style={{
                  ...styles.sphereButton,
                  ...(isActive ? styles.sphereButtonActive : {}),
                  ...transitionStyle,
                  borderLeft: `3px solid ${isActive ? sphere.color : 'transparent'}`,
                }}
                onClick={() => onSphereChange(sphere.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedIndex(index)}
              >
                <span style={styles.sphereIcon} aria-hidden="true">
                  {sphere.icon}
                </span>
                <span style={styles.sphereName}>
                  {sphere.nameFr}
                </span>
                <kbd style={styles.shortcut} aria-hidden="true">
                  Alt+{sphere.shortcut}
                </kbd>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// BREADCRUMB COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Fil d'Ariane" role="navigation">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          margin: 0,
          padding: '8px 16px',
          fontSize: '14px',
          color: '#AEB6C3',
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {index > 0 && (
              <span aria-hidden="true" style={{ color: '#525B6B' }}>
                /
              </span>
            )}
            {item.href || item.onClick ? (
              <a
                href={item.href || '#'}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                style={{
                  color: index === items.length - 1 ? '#E6EAF0' : '#5DA9FF',
                  textDecoration: 'none',
                }}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default SphereNavigation;
