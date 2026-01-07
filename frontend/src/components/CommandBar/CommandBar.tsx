// CHE·NU™ Command Bar & Keyboard Shortcuts System
// Comprehensive command palette with fuzzy search and shortcuts

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  KeyboardEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type CommandCategory = 
  | 'navigation'
  | 'actions'
  | 'search'
  | 'settings'
  | 'help'
  | 'agents'
  | 'threads'
  | 'spheres'
  | 'recent';

interface Command {
  id: string;
  title: string;
  description?: string;
  category: CommandCategory;
  keywords?: string[];
  shortcut?: string[];
  icon?: ReactNode;
  action: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
  badge?: string;
  group?: string;
}

interface CommandGroup {
  id: string;
  title: string;
  commands: Command[];
}

interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  action: () => void;
  global?: boolean;
  preventDefault?: boolean;
  context?: string;
}

interface CommandBarProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  maxResults?: number;
  showRecent?: boolean;
  recentCommands?: string[];
  onCommandExecute?: (command: Command) => void;
  customFooter?: ReactNode;
  className?: string;
}

interface CommandBarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  registerCommand: (command: Command) => void;
  unregisterCommand: (id: string) => void;
  executeCommand: (id: string) => void;
  commands: Command[];
}

interface ShortcutsProviderProps {
  shortcuts: KeyboardShortcut[];
  children: ReactNode;
  enabled?: boolean;
}

interface ShortcutsDialogProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: 'Navigation',
  actions: 'Actions',
  search: 'Search',
  settings: 'Settings',
  help: 'Help',
  agents: 'Agents',
  threads: 'Threads',
  spheres: 'Spheres',
  recent: 'Recent',
};

const CATEGORY_ICONS: Record<CommandCategory, string> = {
  navigation: '🧭',
  actions: '⚡',
  search: '🔍',
  settings: '⚙️',
  help: '❓',
  agents: '🤖',
  threads: '💬',
  spheres: '🌐',
  recent: '🕐',
};

const KEY_DISPLAY_MAP: Record<string, string> = {
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  enter: '↵',
  escape: 'Esc',
  backspace: '⌫',
  delete: '⌦',
  tab: '⇥',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  space: '␣',
};

// ============================================================
// UTILITIES
// ============================================================

function formatShortcut(keys: string[]): string {
  return keys
    .map((key) => KEY_DISPLAY_MAP[key.toLowerCase()] || key.toUpperCase())
    .join(' ');
}

function parseShortcut(shortcut: string[]): { key: string; modifiers: Set<string> } {
  const modifiers = new Set<string>();
  let key = '';

  shortcut.forEach((k) => {
    const lower = k.toLowerCase();
    if (['meta', 'ctrl', 'alt', 'shift', 'control', 'command'].includes(lower)) {
      if (lower === 'command') modifiers.add('meta');
      else if (lower === 'control') modifiers.add('ctrl');
      else modifiers.add(lower);
    } else {
      key = lower;
    }
  });

  return { key, modifiers };
}

function matchesShortcut(event: globalThis.KeyboardEvent, shortcut: string[]): boolean {
  const { key, modifiers } = parseShortcut(shortcut);

  const eventKey = event.key.toLowerCase();
  const eventModifiers = new Set<string>();

  if (event.metaKey) eventModifiers.add('meta');
  if (event.ctrlKey) eventModifiers.add('ctrl');
  if (event.altKey) eventModifiers.add('alt');
  if (event.shiftKey) eventModifiers.add('shift');

  if (eventKey !== key) return false;
  if (modifiers.size !== eventModifiers.size) return false;

  for (const mod of modifiers) {
    if (!eventModifiers.has(mod)) return false;
  }

  return true;
}

function fuzzyMatch(query: string, text: string): { matches: boolean; score: number } {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match
  if (textLower === queryLower) {
    return { matches: true, score: 100 };
  }

  // Starts with
  if (textLower.startsWith(queryLower)) {
    return { matches: true, score: 90 };
  }

  // Contains
  if (textLower.includes(queryLower)) {
    return { matches: true, score: 70 };
  }

  // Fuzzy match
  let queryIndex = 0;
  let score = 0;
  let consecutiveMatches = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
      consecutiveMatches++;
      score += consecutiveMatches * 2;
    } else {
      consecutiveMatches = 0;
    }
  }

  if (queryIndex === queryLower.length) {
    return { matches: true, score: Math.min(60, score) };
  }

  return { matches: false, score: 0 };
}

function searchCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands;

  const results: Array<{ command: Command; score: number }> = [];

  commands.forEach((command) => {
    if (command.hidden || command.disabled) return;

    const titleMatch = fuzzyMatch(query, command.title);
    const descMatch = command.description ? fuzzyMatch(query, command.description) : { matches: false, score: 0 };
    const keywordMatches = (command.keywords || []).map((kw) => fuzzyMatch(query, kw));
    const bestKeywordMatch = keywordMatches.reduce(
      (best, m) => (m.score > best.score ? m : best),
      { matches: false, score: 0 }
    );

    const bestScore = Math.max(titleMatch.score, descMatch.score * 0.8, bestKeywordMatch.score * 0.9);

    if (titleMatch.matches || descMatch.matches || bestKeywordMatch.matches) {
      results.push({ command, score: bestScore });
    }
  });

  return results.sort((a, b) => b.score - a.score).map((r) => r.command);
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
    animation: 'fadeIn 0.15s ease-out',
  },

  container: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out',
  },

  header: {
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  searchIcon: {
    fontSize: '18px',
    color: BRAND.ancientStone,
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: BRAND.uiSlate,
    backgroundColor: 'transparent',
    padding: 0,
  },

  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  kbd: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    backgroundColor: BRAND.softSand,
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'system-ui, sans-serif',
  },

  results: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },

  groupHeader: {
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
  },

  commandItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },

  commandItemHighlighted: {
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
  },

  commandItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  commandIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    fontSize: '16px',
  },

  commandContent: {
    flex: 1,
    minWidth: 0,
  },

  commandTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  commandDescription: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  commandShortcut: {
    display: 'flex',
    gap: '4px',
  },

  commandBadge: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: `${BRAND.sacredGold}20`,
    color: BRAND.earthEmber,
    borderRadius: '100px',
  },

  empty: {
    padding: '48px 16px',
    textAlign: 'center' as const,
  },

  emptyIcon: {
    fontSize: '36px',
    marginBottom: '12px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  footer: {
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
  },

  footerHints: {
    display: 'flex',
    gap: '16px',
  },

  footerHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Shortcuts dialog styles
  shortcutsDialog: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shortcutsContainer: {
    width: '100%',
    maxWidth: '700px',
    maxHeight: '80vh',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },

  shortcutsHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  shortcutsTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  shortcutsClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    color: BRAND.ancientStone,
    lineHeight: 1,
    padding: '4px',
    borderRadius: '4px',
  },

  shortcutsBody: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px 24px',
  },

  shortcutsSection: {
    marginBottom: '24px',
  },

  shortcutsSectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: BRAND.ancientStone,
    marginBottom: '12px',
  },

  shortcutsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px 24px',
  },

  shortcutItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
  },

  shortcutDescription: {
    fontSize: '14px',
    color: BRAND.uiSlate,
  },

  shortcutKeys: {
    display: 'flex',
    gap: '4px',
  },
};

// ============================================================
// CONTEXT
// ============================================================

const CommandBarContext = createContext<CommandBarContextValue | null>(null);

export function useCommandBar(): CommandBarContextValue {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error('useCommandBar must be used within CommandBarProvider');
  }
  return context;
}

// ============================================================
// COMMAND BAR PROVIDER
// ============================================================

interface CommandBarProviderProps {
  children: ReactNode;
  defaultCommands?: Command[];
}

export function CommandBarProvider({ children, defaultCommands = [] }: CommandBarProviderProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>(defaultCommands);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const registerCommand = useCallback((command: Command) => {
    setCommands((prev) => {
      const exists = prev.some((c) => c.id === command.id);
      if (exists) {
        return prev.map((c) => (c.id === command.id ? command : c));
      }
      return [...prev, command];
    });
  }, []);

  const unregisterCommand = useCallback((id: string) => {
    setCommands((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const executeCommand = useCallback((id: string) => {
    const command = commands.find((c) => c.id === id);
    if (command && !command.disabled) {
      command.action();
    }
  }, [commands]);

  // Global shortcut to open command bar
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const value: CommandBarContextValue = {
    isOpen,
    open,
    close,
    toggle,
    registerCommand,
    unregisterCommand,
    executeCommand,
    commands,
  };

  return (
    <CommandBarContext.Provider value={value}>
      {children}
    </CommandBarContext.Provider>
  );
}

// ============================================================
// COMMAND BAR COMPONENT
// ============================================================

export function CommandBar({
  commands,
  isOpen,
  onClose,
  placeholder = 'Search commands...',
  maxResults = 10,
  showRecent = true,
  recentCommands = [],
  onCommandExecute,
  customFooter,
  className,
}: CommandBarProps): JSX.Element | null {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter and group commands
  const filteredCommands = useMemo(() => {
    let results = searchCommands(commands, query);

    // Add recent commands at the top if no query
    if (!query && showRecent && recentCommands.length > 0) {
      const recentCmds = recentCommands
        .map((id) => commands.find((c) => c.id === id))
        .filter(Boolean) as Command[];
      
      results = [
        ...recentCmds.map((c) => ({ ...c, category: 'recent' as CommandCategory })),
        ...results.filter((c) => !recentCommands.includes(c.id)),
      ];
    }

    return results.slice(0, maxResults);
  }, [commands, query, showRecent, recentCommands, maxResults]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};

    filteredCommands.forEach((command) => {
      const category = command.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
    });

    return Object.entries(groups).map(([category, cmds]) => ({
      id: category,
      title: CATEGORY_LABELS[category as CommandCategory] || category,
      commands: cmds,
    }));
  }, [filteredCommands]);

  // Flat list for navigation
  const flatCommands = useMemo(() => {
    return groupedCommands.flatMap((g) => g.commands);
  }, [groupedCommands]);

  // Execute command
  const executeCommand = useCallback((command: Command) => {
    if (command.disabled) return;

    command.action();
    onCommandExecute?.(command);
    onClose();
    setQuery('');
    setHighlightedIndex(0);
  }, [onClose, onCommandExecute]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % flatCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[highlightedIndex]) {
          executeCommand(flatCommands[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatCommands, highlightedIndex, executeCommand, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!resultsRef.current) return;

    const highlighted = resultsRef.current.querySelector('[data-highlighted="true"]');
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let globalIndex = -1;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} className={className} onClick={(e) => e.stopPropagation()}>
        {/* Search header */}
        <div style={styles.header}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={styles.searchInput}
            />
            <div style={styles.shortcutHint}>
              <kbd style={styles.kbd}>Esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} style={styles.results}>
          {flatCommands.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🔎</div>
              <div style={styles.emptyText}>
                {query ? `No results for "${query}"` : 'No commands available'}
              </div>
            </div>
          ) : (
            groupedCommands.map((group) => (
              <div key={group.id}>
                <div style={styles.groupHeader}>
                  {CATEGORY_ICONS[group.id as CommandCategory]} {group.title}
                </div>
                {group.commands.map((command) => {
                  globalIndex++;
                  const isHighlighted = globalIndex === highlightedIndex;
                  const currentIndex = globalIndex;

                  return (
                    <div
                      key={command.id}
                      data-highlighted={isHighlighted}
                      style={{
                        ...styles.commandItem,
                        ...(isHighlighted && styles.commandItemHighlighted),
                        ...(command.disabled && styles.commandItemDisabled),
                      }}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setHighlightedIndex(currentIndex)}
                    >
                      <div style={styles.commandIcon}>
                        {command.icon || CATEGORY_ICONS[command.category]}
                      </div>

                      <div style={styles.commandContent}>
                        <div style={styles.commandTitle}>{command.title}</div>
                        {command.description && (
                          <div style={styles.commandDescription}>{command.description}</div>
                        )}
                      </div>

                      {command.badge && (
                        <span style={styles.commandBadge}>{command.badge}</span>
                      )}

                      {command.shortcut && (
                        <div style={styles.commandShortcut}>
                          {command.shortcut.map((key, i) => (
                            <kbd key={i} style={styles.kbd}>
                              {KEY_DISPLAY_MAP[key.toLowerCase()] || key.toUpperCase()}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerHints}>
            <div style={styles.footerHint}>
              <kbd style={styles.kbd}>↑</kbd>
              <kbd style={styles.kbd}>↓</kbd>
              <span>to navigate</span>
            </div>
            <div style={styles.footerHint}>
              <kbd style={styles.kbd}>↵</kbd>
              <span>to select</span>
            </div>
          </div>
          {customFooter || (
            <span>
              {flatCommands.length} command{flatCommands.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// SHORTCUTS PROVIDER
// ============================================================

export function ShortcutsProvider({ shortcuts, children, enabled = true }: ShortcutsProviderProps): JSX.Element {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (matchesShortcut(e, shortcut.keys)) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);

  return <>{children}</>;
}

// ============================================================
// SHORTCUTS DIALOG
// ============================================================

export function ShortcutsDialog({
  shortcuts,
  isOpen,
  onClose,
  className,
}: ShortcutsDialogProps): JSX.Element | null {
  // Group shortcuts by context
  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, KeyboardShortcut[]> = {};

    shortcuts.forEach((shortcut) => {
      const context = shortcut.context || 'General';
      if (!groups[context]) {
        groups[context] = [];
      }
      groups[context].push(shortcut);
    });

    return Object.entries(groups);
  }, [shortcuts]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.shortcutsDialog} onClick={onClose}>
      <div style={styles.shortcutsContainer} className={className} onClick={(e) => e.stopPropagation()}>
        <div style={styles.shortcutsHeader}>
          <h2 style={styles.shortcutsTitle}>Keyboard Shortcuts</h2>
          <button style={styles.shortcutsClose} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.shortcutsBody}>
          {groupedShortcuts.map(([context, ctxShortcuts]) => (
            <div key={context} style={styles.shortcutsSection}>
              <div style={styles.shortcutsSectionTitle}>{context}</div>
              <div style={styles.shortcutsGrid}>
                {ctxShortcuts.map((shortcut) => (
                  <div key={shortcut.id} style={styles.shortcutItem}>
                    <span style={styles.shortcutDescription}>{shortcut.description}</span>
                    <div style={styles.shortcutKeys}>
                      {shortcut.keys.map((key, i) => (
                        <kbd key={i} style={styles.kbd}>
                          {KEY_DISPLAY_MAP[key.toLowerCase()] || key.toUpperCase()}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOOK FOR REGISTERING COMMANDS
// ============================================================

export function useRegisterCommand(command: Command): void {
  const { registerCommand, unregisterCommand } = useCommandBar();

  useEffect(() => {
    registerCommand(command);
    return () => unregisterCommand(command.id);
  }, [command, registerCommand, unregisterCommand]);
}

// ============================================================
// HOOK FOR KEYBOARD SHORTCUT
// ============================================================

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: { preventDefault?: boolean; enabled?: boolean } = {}
): void {
  const { preventDefault = true, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (matchesShortcut(e, keys)) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, preventDefault, enabled]);
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  CommandCategory,
  Command,
  CommandGroup,
  KeyboardShortcut,
  CommandBarProps,
  CommandBarContextValue,
  ShortcutsProviderProps,
  ShortcutsDialogProps,
};

export {
  formatShortcut,
  parseShortcut,
  matchesShortcut,
  fuzzyMatch,
  searchCommands,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  KEY_DISPLAY_MAP,
};

export default {
  CommandBar,
  CommandBarProvider,
  ShortcutsProvider,
  ShortcutsDialog,
  useCommandBar,
  useRegisterCommand,
  useKeyboardShortcut,
};
