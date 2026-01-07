/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — COMMAND PALETTE COMPONENT
   Unified Search & Quick Actions (⌘+K)
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { CommandItem, SearchResult, CommandCategory } from './types';
import { CommandRegistry } from './commandRegistry';

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.2)',
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
    zIndex: 9999,
  },
  
  container: {
    width: '100%',
    maxWidth: '640px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    animation: 'commandPaletteIn 0.15s ease-out',
  },
  
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
    gap: '12px',
  },
  
  searchIcon: {
    fontSize: '20px',
    color: COLORS.ancientStone,
  },
  
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: COLORS.softSand,
    fontFamily: 'inherit',
  },
  
  shortcutHint: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    padding: '4px 8px',
    backgroundColor: COLORS.background,
    borderRadius: '6px',
    fontFamily: 'monospace',
  },
  
  categories: {
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
    overflowX: 'auto' as const,
  },
  
  categoryButton: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
  },
  
  results: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
    padding: '8px',
  },
  
  groupTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '12px 12px 6px',
  },
  
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
  
  resultIcon: {
    fontSize: '20px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: COLORS.background,
  },
  
  resultContent: {
    flex: 1,
    minWidth: 0,
  },
  
  resultTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.softSand,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  resultSubtitle: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  resultShortcut: {
    fontSize: '11px',
    color: COLORS.ancientStone,
    padding: '3px 6px',
    backgroundColor: COLORS.background,
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderTop: `1px solid ${COLORS.border}`,
    fontSize: '11px',
    color: COLORS.ancientStone,
  },
  
  footerHints: {
    display: 'flex',
    gap: '16px',
  },
  
  footerHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  
  keyHint: {
    padding: '2px 5px',
    backgroundColor: COLORS.background,
    borderRadius: '3px',
    fontFamily: 'monospace',
    fontSize: '10px',
  },
  
  empty: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: COLORS.ancientStone,
  },
  
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// CATEGORY LABELS
// ════════════════════════════════════════════════════════════════════════════════

const CATEGORY_LABELS: Record<CommandCategory | 'all', { label: string; icon: string }> = {
  all: { label: 'All', icon: '🔍' },
  navigation: { label: 'Navigation', icon: '🧭' },
  action: { label: 'Actions', icon: '⚡' },
  search: { label: 'Search', icon: '🔎' },
  recent: { label: 'Recent', icon: '🕐' },
  agent: { label: 'Agents', icon: '🤖' },
  thread: { label: 'Threads', icon: '💬' },
  settings: { label: 'Settings', icon: '⚙️' },
  help: { label: 'Help', icon: '❓' },
};

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  actions?: Record<string, () => void>;
  recentItems?: Array<{ id: string; title: string; icon: string; action: () => void }>;
  locale?: 'en' | 'fr';
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  navigate,
  onSearch,
  actions = {},
  recentItems = [],
  locale = 'fr',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<CommandCategory | 'all'>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize command registry
  const registry = useMemo(() => {
    return new CommandRegistry(navigate, actions);
  }, [navigate, actions]);

  // Filter commands based on query and category
  const filteredCommands = useMemo(() => {
    let commands = query ? registry.search(query) : registry.getAll().filter(c => c.priority === 'high');
    
    if (activeCategory !== 'all') {
      commands = commands.filter(cmd => cmd.category === activeCategory);
    }
    
    return commands.slice(0, 15);
  }, [query, activeCategory, registry]);

  // All results (commands + search results)
  const allResults = useMemo(() => {
    const results: Array<CommandItem | SearchResult> = [];
    
    // Add recent items if no query
    if (!query && recentItems.length > 0) {
      // Recent items will be shown separately
    }
    
    // Add commands
    results.push(...filteredCommands);
    
    // Add search results
    if (searchResults.length > 0) {
      results.push(...searchResults);
    }
    
    return results;
  }, [filteredCommands, searchResults, query, recentItems]);

  // Search effect
  useEffect(() => {
    if (!query || !onSearch) return;
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await onSearch(query);
        setSearchResults(results);
      } catch (error) {
        logger.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('all');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, allResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (allResults[selectedIndex]) {
          const item = allResults[selectedIndex];
          item.action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        const categories = Object.keys(CATEGORY_LABELS) as (CommandCategory | 'all')[];
        const currentIndex = categories.indexOf(activeCategory);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + categories.length) % categories.length
          : (currentIndex + 1) % categories.length;
        setActiveCategory(categories[nextIndex]);
        break;
    }
  }, [allResults, selectedIndex, activeCategory, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = resultsRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // This should be handled by parent component
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTitle = (item: CommandItem) => locale === 'fr' && item.titleFr ? item.titleFr : item.title;
  const getSubtitle = (item: CommandItem) => locale === 'fr' && item.subtitleFr ? item.subtitleFr : item.subtitle;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.container} 
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={locale === 'fr' ? "Rechercher ou taper une commande..." : "Search or type a command..."}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={styles.searchInput}
          />
          <span style={styles.shortcutHint}>ESC</span>
        </div>

        {/* Categories */}
        <div style={styles.categories}>
          {(Object.keys(CATEGORY_LABELS) as (CommandCategory | 'all')[]).slice(0, 6).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              style={{
                ...styles.categoryButton,
                backgroundColor: activeCategory === cat ? COLORS.sacredGold : COLORS.background,
                color: activeCategory === cat ? COLORS.uiSlate : COLORS.softSand,
              }}
            >
              {CATEGORY_LABELS[cat].icon} {CATEGORY_LABELS[cat].label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div style={styles.results} ref={resultsRef}>
          {/* Recent Items (when no query) */}
          {!query && recentItems.length > 0 && (
            <>
              <div style={styles.groupTitle}>
                🕐 {locale === 'fr' ? 'Récents' : 'Recent'}
              </div>
              {recentItems.slice(0, 3).map((item, idx) => (
                <div
                  key={`recent-${item.id}`}
                  data-index={idx}
                  style={{
                    ...styles.resultItem,
                    backgroundColor: selectedIndex === idx ? COLORS.background : 'transparent',
                  }}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={styles.resultIcon}>{item.icon}</div>
                  <div style={styles.resultContent}>
                    <div style={styles.resultTitle}>{item.title}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Commands */}
          {filteredCommands.length > 0 && (
            <>
              <div style={styles.groupTitle}>
                {query ? (locale === 'fr' ? '⚡ Commandes' : '⚡ Commands') : (locale === 'fr' ? '⭐ Suggestions' : '⭐ Suggestions')}
              </div>
              {filteredCommands.map((cmd, idx) => {
                const adjustedIndex = recentItems.length > 0 && !query ? idx + 3 : idx;
                return (
                  <div
                    key={cmd.id}
                    data-index={adjustedIndex}
                    style={{
                      ...styles.resultItem,
                      backgroundColor: selectedIndex === adjustedIndex ? COLORS.background : 'transparent',
                    }}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                  >
                    <div style={styles.resultIcon}>{cmd.icon}</div>
                    <div style={styles.resultContent}>
                      <div style={styles.resultTitle}>{getTitle(cmd)}</div>
                      {getSubtitle(cmd) && (
                        <div style={styles.resultSubtitle}>{getSubtitle(cmd)}</div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <span style={styles.resultShortcut}>{cmd.shortcut}</span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <>
              <div style={styles.groupTitle}>
                🔎 {locale === 'fr' ? 'Résultats de recherche' : 'Search Results'}
              </div>
              {searchResults.map((result, idx) => {
                const adjustedIndex = filteredCommands.length + idx;
                return (
                  <div
                    key={result.id}
                    data-index={adjustedIndex}
                    style={{
                      ...styles.resultItem,
                      backgroundColor: selectedIndex === adjustedIndex ? COLORS.background : 'transparent',
                    }}
                    onClick={() => {
                      result.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                  >
                    <div style={styles.resultIcon}>{result.icon}</div>
                    <div style={styles.resultContent}>
                      <div style={styles.resultTitle}>{result.title}</div>
                      <div style={styles.resultSubtitle}>
                        {result.sphereName} • {result.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Empty State */}
          {!isSearching && query && filteredCommands.length === 0 && searchResults.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🔍</div>
              <div>{locale === 'fr' ? 'Aucun résultat pour' : 'No results for'} "{query}"</div>
            </div>
          )}

          {/* Loading */}
          {isSearching && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>⏳</div>
              <div>{locale === 'fr' ? 'Recherche en cours...' : 'Searching...'}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerHints}>
            <span style={styles.footerHint}>
              <span style={styles.keyHint}>↑↓</span> {locale === 'fr' ? 'naviguer' : 'navigate'}
            </span>
            <span style={styles.footerHint}>
              <span style={styles.keyHint}>↵</span> {locale === 'fr' ? 'sélectionner' : 'select'}
            </span>
            <span style={styles.footerHint}>
              <span style={styles.keyHint}>Tab</span> {locale === 'fr' ? 'catégorie' : 'category'}
            </span>
            <span style={styles.footerHint}>
              <span style={styles.keyHint}>ESC</span> {locale === 'fr' ? 'fermer' : 'close'}
            </span>
          </div>
          <span style={{ color: COLORS.sacredGold }}>CHE·NU™</span>
        </div>
      </div>

      {/* Keyframes for animation */}
      <style>{`
        @keyframes commandPaletteIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default CommandPalette;
