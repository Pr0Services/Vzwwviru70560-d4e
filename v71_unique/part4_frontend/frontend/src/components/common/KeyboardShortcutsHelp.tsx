/**
 * CHE·NU™ Keyboard Shortcuts Help Modal
 * 
 * Displays all available keyboard shortcuts organized by category.
 * Triggered by Cmd/Ctrl+?
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';
import { 
  ShortcutDefinition, 
  ShortcutGroup, 
  getGroupedShortcuts,
  formatShortcut 
} from '../../hooks/useKeyboardShortcuts';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutDefinition[];
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY ICONS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_ICONS: Record<string, string> = {
  global: '🌐',
  navigation: '🧭',
  threads: '💬',
  nova: '✨',
  editing: '✏️',
  dataspaces: '📁',
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts,
}) => {
  const groups = React.useMemo(() => getGroupedShortcuts(shortcuts), [shortcuts]);

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="shortcuts-help-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Raccourcis clavier"
    >
      <div 
        className="shortcuts-help-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shortcuts-help-header">
          <h2>⌨️ Raccourcis Clavier</h2>
          <button 
            className="shortcuts-help-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="shortcuts-help-content">
          <div className="shortcuts-help-grid">
            {groups.map(group => (
              <ShortcutGroup key={group.category} group={group} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shortcuts-help-footer">
          <span>
            Appuyez sur <kbd>Ctrl</kbd>+<kbd>K</kbd> pour ouvrir la Command Palette
          </span>
        </div>
      </div>

      <style>{`
        .shortcuts-help-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 9999;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .shortcuts-help-modal {
          width: 100%;
          max-width: 800px;
          max-height: 80vh;
          background: var(--color-bg-secondary, #fff);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .shortcuts-help-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .shortcuts-help-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
        }

        .shortcuts-help-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-tertiary, #f5f5f5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--color-text-secondary, #666);
          font-size: 16px;
          transition: all 0.15s;
        }

        .shortcuts-help-close:hover {
          background: var(--color-bg-tertiary-hover, #e5e5e5);
          color: var(--color-text-primary, #1a1a1a);
        }

        .shortcuts-help-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .shortcuts-help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .shortcuts-group {
          background: var(--color-bg-tertiary, #f9f9f9);
          border-radius: 12px;
          padding: 16px;
        }

        .shortcuts-group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .shortcuts-group-icon {
          font-size: 18px;
        }

        .shortcuts-group-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
        }

        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
        }

        .shortcut-description {
          font-size: 13px;
          color: var(--color-text-secondary, #666);
        }

        .shortcut-keys {
          display: flex;
          gap: 4px;
        }

        .shortcut-keys kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: var(--color-bg-secondary, #fff);
          border: 1px solid var(--color-border, #ddd);
          border-radius: 6px;
          font-size: 11px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
          color: var(--color-text-primary, #1a1a1a);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .shortcuts-help-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--color-border, #e5e5e5);
          text-align: center;
          font-size: 13px;
          color: var(--color-text-tertiary, #999);
        }

        .shortcuts-help-footer kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--color-bg-tertiary, #f5f5f5);
          border: 1px solid var(--color-border, #ddd);
          border-radius: 4px;
          font-size: 10px;
          font-family: monospace;
          margin: 0 2px;
        }

        /* Dark mode */
        [data-theme="dark"] .shortcuts-help-modal {
          background: #1a1a1a;
        }

        [data-theme="dark"] .shortcuts-help-header {
          border-color: #333;
        }

        [data-theme="dark"] .shortcuts-help-header h2 {
          color: #fff;
        }

        [data-theme="dark"] .shortcuts-help-close {
          background: #2a2a2a;
          color: #aaa;
        }

        [data-theme="dark"] .shortcuts-help-close:hover {
          background: #333;
          color: #fff;
        }

        [data-theme="dark"] .shortcuts-group {
          background: #222;
        }

        [data-theme="dark"] .shortcuts-group-header {
          border-color: #333;
        }

        [data-theme="dark"] .shortcuts-group-label {
          color: #fff;
        }

        [data-theme="dark"] .shortcut-description {
          color: #aaa;
        }

        [data-theme="dark"] .shortcut-keys kbd {
          background: #2a2a2a;
          border-color: #444;
          color: #fff;
        }

        [data-theme="dark"] .shortcuts-help-footer {
          border-color: #333;
        }

        [data-theme="dark"] .shortcuts-help-footer kbd {
          background: #2a2a2a;
          border-color: #444;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .shortcuts-help-modal {
            max-height: 90vh;
            border-radius: 16px 16px 0 0;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-width: none;
          }

          .shortcuts-help-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCUT GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ShortcutGroup: React.FC<{ group: ShortcutGroup }> = ({ group }) => {
  return (
    <div className="shortcuts-group">
      <div className="shortcuts-group-header">
        <span className="shortcuts-group-icon">
          {CATEGORY_ICONS[group.category] || '📋'}
        </span>
        <span className="shortcuts-group-label">{group.label}</span>
      </div>
      <div className="shortcuts-list">
        {group.shortcuts.map(shortcut => (
          <ShortcutItem key={shortcut.key + shortcut.description} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCUT ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ShortcutItem: React.FC<{ shortcut: ShortcutDefinition }> = ({ shortcut }) => {
  const formatted = formatShortcut(shortcut);
  const keys = formatted.split(/(?=[A-Z])|(?=⌘)|(?=⌃)|(?=⌥)|(?=⇧)/);
  
  return (
    <div className="shortcut-item">
      <span className="shortcut-description">{shortcut.description}</span>
      <div className="shortcut-keys">
        <kbd>{formatted}</kbd>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
