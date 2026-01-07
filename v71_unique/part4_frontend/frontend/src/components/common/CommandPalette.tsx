/**
 * CHE·NU™ Command Palette
 * 
 * Quick action launcher with fuzzy search.
 * Triggered by Cmd/Ctrl+K.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  category: CommandCategory;
  action: () => void;
  keywords?: string[];
  disabled?: boolean;
}

export type CommandCategory = 
  | 'navigation'
  | 'threads'
  | 'nova'
  | 'dataspaces'
  | 'agents'
  | 'settings'
  | 'recent';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  recentCommands?: string[];
  onCommandExecute?: (command: CommandItem) => void;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUZZY SEARCH
// ═══════════════════════════════════════════════════════════════════════════

function fuzzyMatch(text: string, query: string): { match: boolean; score: number } {
  if (!query) return { match: true, score: 0 };
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower.includes(queryLower)) {
    return { match: true, score: 100 - textLower.indexOf(queryLower) };
  }
  
  // Fuzzy match (all characters must appear in order)
  let queryIndex = 0;
  let score = 0;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
      score += 10;
      // Bonus for consecutive matches
      if (i > 0 && textLower[i - 1] === queryLower[queryIndex - 2]) {
        score += 5;
      }
    }
  }
  
  return {
    match: queryIndex === queryLower.length,
    score,
  };
}

function searchCommands(commands: CommandItem[], query: string): CommandItem[] {
  if (!query.trim()) {
    return commands;
  }
  
  const results: Array<{ command: CommandItem; score: number }> = [];
  
  for (const command of commands) {
    // Search in label
    const labelMatch = fuzzyMatch(command.label, query);
    
    // Search in description
    const descMatch = command.description 
      ? fuzzyMatch(command.description, query)
      : { match: false, score: 0 };
    
    // Search in keywords
    let keywordScore = 0;
    if (command.keywords) {
      for (const keyword of command.keywords) {
        const match = fuzzyMatch(keyword, query);
        if (match.match) {
          keywordScore = Math.max(keywordScore, match.score);
        }
      }
    }
    
    const totalScore = Math.max(
      labelMatch.match ? labelMatch.score * 2 : 0,
      descMatch.score,
      keywordScore
    );
    
    if (totalScore > 0) {
      results.push({ command, score: totalScore });
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .map(r => r.command);
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY LABELS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: 'Navigation',
  threads: 'Threads',
  nova: 'Nova',
  dataspaces: 'DataSpaces',
  agents: 'Agents',
  settings: 'Paramètres',
  recent: 'Récent',
};

const CATEGORY_ORDER: CommandCategory[] = [
  'recent',
  'navigation',
  'threads',
  'nova',
  'dataspaces',
  'agents',
  'settings',
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  recentCommands = [],
  onCommandExecute,
  placeholder = 'Rechercher une commande...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter and sort commands
  const filteredCommands = useMemo(() => {
    let result = searchCommands(commands, query);
    
    // If no query, add recent commands at top
    if (!query.trim() && recentCommands.length > 0) {
      const recentItems = recentCommands
        .map(id => commands.find(c => c.id === id))
        .filter((c): c is CommandItem => c !== undefined)
        .map(c => ({ ...c, category: 'recent' as CommandCategory }));
      
      result = [...recentItems, ...result.filter(c => !recentCommands.includes(c.id))];
    }
    
    return result;
  }, [commands, query, recentCommands]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<CommandCategory, CommandItem[]> = {
      recent: [],
      navigation: [],
      threads: [],
      nova: [],
      dataspaces: [],
      agents: [],
      settings: [],
    };
    
    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });
    
    return CATEGORY_ORDER
      .filter(cat => groups[cat].length > 0)
      .map(cat => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
        commands: groups[cat],
      }));
  }, [filteredCommands]);

  // Flat list for keyboard navigation
  const flatCommands = useMemo(() => 
    groupedCommands.flatMap(g => g.commands),
    [groupedCommands]
  );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      selectedEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Execute command
  const executeCommand = useCallback((command: CommandItem) => {
    if (command.disabled) return;
    
    onCommandExecute?.(command);
    command.action();
    onClose();
  }, [onClose, onCommandExecute]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1));
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
        
      case 'Enter':
        event.preventDefault();
        if (flatCommands[selectedIndex]) {
          executeCommand(flatCommands[selectedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  }, [flatCommands, selectedIndex, executeCommand, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="command-palette-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div 
        className="command-palette"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="command-palette-header">
          <svg 
            className="command-palette-icon"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Rechercher"
            aria-autocomplete="list"
            aria-controls="command-palette-list"
          />
          <kbd className="command-palette-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div 
          ref={listRef}
          id="command-palette-list"
          className="command-palette-list"
          role="listbox"
        >
          {groupedCommands.length === 0 ? (
            <div className="command-palette-empty">
              Aucune commande trouvée
            </div>
          ) : (
            groupedCommands.map(group => (
              <div key={group.category} className="command-palette-group">
                <div className="command-palette-group-label">
                  {group.label}
                </div>
                {group.commands.map((command, idx) => {
                  const globalIndex = flatCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={command.id}
                      className={`command-palette-item ${isSelected ? 'selected' : ''} ${command.disabled ? 'disabled' : ''}`}
                      data-selected={isSelected}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={command.disabled}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      {command.icon && (
                        <span className="command-palette-item-icon">
                          {command.icon}
                        </span>
                      )}
                      <div className="command-palette-item-content">
                        <span className="command-palette-item-label">
                          {command.label}
                        </span>
                        {command.description && (
                          <span className="command-palette-item-description">
                            {command.description}
                          </span>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd className="command-palette-item-shortcut">
                          {command.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="command-palette-footer">
          <span>
            <kbd>↑↓</kbd> naviguer
          </span>
          <span>
            <kbd>↵</kbd> sélectionner
          </span>
          <span>
            <kbd>esc</kbd> fermer
          </span>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .command-palette-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          z-index: 9999;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .command-palette {
          width: 100%;
          max-width: 640px;
          background: var(--color-bg-secondary, #fff);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: slideDown 0.15s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .command-palette-header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
          gap: 12px;
        }

        .command-palette-icon {
          color: var(--color-text-secondary, #666);
          flex-shrink: 0;
        }

        .command-palette-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 16px;
          color: var(--color-text-primary, #1a1a1a);
          outline: none;
        }

        .command-palette-input::placeholder {
          color: var(--color-text-tertiary, #999);
        }

        .command-palette-kbd {
          padding: 4px 8px;
          background: var(--color-bg-tertiary, #f5f5f5);
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          color: var(--color-text-secondary, #666);
        }

        .command-palette-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 8px;
        }

        .command-palette-empty {
          padding: 24px;
          text-align: center;
          color: var(--color-text-tertiary, #999);
        }

        .command-palette-group {
          margin-bottom: 8px;
        }

        .command-palette-group-label {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-tertiary, #999);
          letter-spacing: 0.5px;
        }

        .command-palette-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          gap: 12px;
          transition: background 0.1s;
        }

        .command-palette-item:hover,
        .command-palette-item.selected {
          background: var(--color-bg-tertiary, #f5f5f5);
        }

        .command-palette-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .command-palette-item-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary, #666);
        }

        .command-palette-item-content {
          flex: 1;
          min-width: 0;
        }

        .command-palette-item-label {
          display: block;
          font-size: 14px;
          color: var(--color-text-primary, #1a1a1a);
        }

        .command-palette-item-description {
          display: block;
          font-size: 12px;
          color: var(--color-text-tertiary, #999);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .command-palette-item-shortcut {
          padding: 4px 8px;
          background: var(--color-bg-tertiary, #f5f5f5);
          border-radius: 4px;
          font-size: 11px;
          font-family: monospace;
          color: var(--color-text-secondary, #666);
          flex-shrink: 0;
        }

        .command-palette-footer {
          display: flex;
          gap: 16px;
          padding: 12px 16px;
          border-top: 1px solid var(--color-border, #e5e5e5);
          font-size: 12px;
          color: var(--color-text-tertiary, #999);
        }

        .command-palette-footer kbd {
          padding: 2px 6px;
          background: var(--color-bg-tertiary, #f5f5f5);
          border-radius: 4px;
          font-family: monospace;
          margin-right: 4px;
        }

        /* Dark mode */
        [data-theme="dark"] .command-palette {
          background: #1a1a1a;
        }

        [data-theme="dark"] .command-palette-header {
          border-color: #333;
        }

        [data-theme="dark"] .command-palette-input {
          color: #fff;
        }

        [data-theme="dark"] .command-palette-kbd,
        [data-theme="dark"] .command-palette-item-shortcut {
          background: #333;
          color: #aaa;
        }

        [data-theme="dark"] .command-palette-item:hover,
        [data-theme="dark"] .command-palette-item.selected {
          background: #2a2a2a;
        }

        [data-theme="dark"] .command-palette-item-label {
          color: #fff;
        }

        [data-theme="dark"] .command-palette-footer {
          border-color: #333;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;