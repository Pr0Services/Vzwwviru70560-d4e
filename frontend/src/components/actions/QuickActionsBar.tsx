/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — QUICK ACTIONS BAR & FAB
 * ═══════════════════════════════════════════════════════════════════════════
 * Actions rapides et bouton flottant
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  shortcut?: string;
  category?: string;
  action?: () => void;
}

export interface QuickActionsFABProps {
  actions?: QuickAction[];
  onAction?: (action: QuickAction) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: 'new-thread', icon: '🧵', label: 'Nouveau Thread', shortcut: 'N', category: 'Create' },
  { id: 'quick-capture', icon: '📝', label: 'Capture Rapide', shortcut: 'Q', category: 'Create' },
  { id: 'nova-chat', icon: '✨', label: 'Parler à Nova', shortcut: 'Space', category: 'AI' },
  { id: 'search', icon: '🔍', label: 'Recherche', shortcut: '⌘K', category: 'Navigation' },
  { id: 'new-decision', icon: '⚖️', label: 'Nouvelle Décision', shortcut: 'D', category: 'Create' },
  { id: 'hire-agent', icon: '🤖', label: 'Engager Agent', shortcut: 'A', category: 'AI' },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    position: 'fixed' as const,
    zIndex: 50,
  } as React.CSSProperties,
  
  positions: {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 },
  },
  
  fab: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D8B26A 0%, #B8924A 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    boxShadow: '0 4px 20px rgba(216, 178, 106, 0.4)',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  
  fabHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 30px rgba(216, 178, 106, 0.6)',
  } as React.CSSProperties,
  
  fabExpanded: {
    borderRadius: 16,
    width: 'auto',
    height: 'auto',
    padding: 8,
  } as React.CSSProperties,
  
  menu: {
    position: 'absolute' as const,
    bottom: 70,
    right: 0,
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 12,
    padding: 8,
    minWidth: 220,
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  } as React.CSSProperties,
  
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    color: '#fff',
  } as React.CSSProperties,
  
  menuItemHover: {
    background: '#1f1f23',
  } as React.CSSProperties,
  
  menuIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  } as React.CSSProperties,
  
  menuShortcut: {
    fontSize: 11,
    color: '#666',
    background: '#1f1f23',
    padding: '2px 6px',
    borderRadius: 4,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS FAB
// ═══════════════════════════════════════════════════════════════════════════

export const QuickActionsFAB: React.FC<QuickActionsFABProps> = ({
  actions = DEFAULT_QUICK_ACTIONS,
  onAction,
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAction = useCallback((action: QuickAction) => {
    onAction?.(action);
    action.action?.();
    setIsOpen(false);
  }, [onAction]);
  
  return (
    <div style={{ ...styles.container, ...styles.positions[position] }}>
      {/* Menu */}
      {isOpen && (
        <div style={styles.menu}>
          {actions.map((action) => (
            <button
              key={action.id}
              style={{
                ...styles.menuItem,
                ...(hoveredItem === action.id ? styles.menuItemHover : {}),
              }}
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHoveredItem(action.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span style={styles.menuIcon}>{action.icon}</span>
              <span style={styles.menuLabel}>{action.label}</span>
              {action.shortcut && (
                <span style={styles.menuShortcut}>{action.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* FAB Button */}
      <button
        style={{
          ...styles.fab,
          ...(isHovered ? styles.fabHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isOpen ? '✕' : '⚡'}
      </button>
    </div>
  );
};

export default QuickActionsFAB;
