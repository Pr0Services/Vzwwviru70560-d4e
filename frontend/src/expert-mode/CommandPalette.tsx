/**
 * CHE·NU — Command Palette Component
 * ============================================================
 * Text-based command interface for Expert Mode.
 * 
 * Principles:
 * - Commands prepare proposals only
 * - Never execute directly
 * - Always show scope & cost before execution
 * 
 * @version 1.0.0
 */

import React, { useRef, useEffect, useCallback } from 'react';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  searchValue: string;
  commands: Command[];
  onSearch: (value: string) => void;
  onSelect: (commandId: string) => void;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  searchValue,
  commands,
  onSearch,
  onSelect,
  onClose
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Reset selection when commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [commands]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < commands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (commands[selectedIndex]) {
          onSelect(commands[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [commands, selectedIndex, onSelect, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.palette}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>⌘K</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        
        {/* Commands list */}
        <div className={styles.commands}>
          {commands.length === 0 ? (
            <div className={styles.empty}>
              No commands found
            </div>
          ) : (
            commands.map((cmd, index) => (
              <button
                key={cmd.id}
                className={`${styles.command} ${index === selectedIndex ? styles.selected : ''}`}
                onClick={() => onSelect(cmd.id)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={styles.commandName}>{cmd.name}</span>
                <span className={styles.commandDescription}>{cmd.description}</span>
              </button>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.hint}>
            <kbd>↑↓</kbd> navigate
          </span>
          <span className={styles.hint}>
            <kbd>↵</kbd> select
          </span>
          <span className={styles.hint}>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
