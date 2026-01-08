/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — GLOBAL SEARCH V72
 * ═══════════════════════════════════════════════════════════════════════════
 * Recherche globale style Spotlight/⌘K
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SearchResult {
  id: string;
  type: 'thread' | 'agent' | 'decision' | 'sphere' | 'action' | 'file';
  title: string;
  subtitle?: string;
  icon: string;
  path?: string;
  metadata?: Record<string, any>;
}

export interface GlobalSearchV72Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', type: 'thread', title: 'Projet Alpha', subtitle: 'Business • 12 events', icon: '🧵', path: '/thread/1' },
  { id: '2', type: 'thread', title: 'Formation React', subtitle: 'Scholar • 8 events', icon: '🧵', path: '/thread/2' },
  { id: '3', type: 'agent', title: 'Content Writer', subtitle: 'Creative Studio • Hired', icon: '🤖', path: '/agents' },
  { id: '4', type: 'agent', title: 'Data Analyst', subtitle: 'Business • Available', icon: '🤖', path: '/agents' },
  { id: '5', type: 'decision', title: 'Choix technologique', subtitle: 'Pending • 2 options', icon: '⚖️', path: '/decisions' },
  { id: '6', type: 'sphere', title: 'Business', subtitle: '43 agents • 24 threads', icon: '💼', path: '/sphere/business' },
  { id: '7', type: 'sphere', title: 'Creative Studio', subtitle: '42 agents • 18 threads', icon: '🎨', path: '/sphere/studio' },
  { id: '8', type: 'action', title: 'Nouveau Thread', subtitle: 'Créer un nouveau thread', icon: '➕', path: '/threads/new' },
  { id: '9', type: 'action', title: 'Parler à Nova', subtitle: 'Ouvrir le chat Nova', icon: '✨', path: '/nova' },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
  } as React.CSSProperties,
  
  container: {
    width: '100%',
    maxWidth: 640,
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  } as React.CSSProperties,
  
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  searchIcon: {
    fontSize: 20,
    color: '#666',
  } as React.CSSProperties,
  
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 16,
    color: '#fff',
  } as React.CSSProperties,
  
  shortcut: {
    fontSize: 11,
    color: '#666',
    background: '#1f1f23',
    padding: '4px 8px',
    borderRadius: 4,
  } as React.CSSProperties,
  
  results: {
    maxHeight: 400,
    overflow: 'auto',
  } as React.CSSProperties,
  
  category: {
    padding: '8px 20px',
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  
  result: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  resultActive: {
    background: '#1f1f23',
  } as React.CSSProperties,
  
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#1f1f23',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  } as React.CSSProperties,
  
  resultContent: {
    flex: 1,
  } as React.CSSProperties,
  
  resultTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 2,
  } as React.CSSProperties,
  
  resultSubtitle: {
    fontSize: 12,
    color: '#666',
  } as React.CSSProperties,
  
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderTop: '1px solid #1f1f23',
    fontSize: 12,
    color: '#666',
  } as React.CSSProperties,
  
  empty: {
    padding: 40,
    textAlign: 'center' as const,
    color: '#666',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL SEARCH V72
// ═══════════════════════════════════════════════════════════════════════════

export const GlobalSearchV72: React.FC<GlobalSearchV72Props> = ({
  isOpen,
  onClose,
  onSelect,
  placeholder = 'Rechercher threads, agents, décisions...',
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return MOCK_RESULTS.slice(0, 6);
    
    const q = query.toLowerCase();
    return MOCK_RESULTS.filter(
      r => r.title.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q)
    );
  }, [query]);
  
  // Group by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    filteredResults.forEach(r => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [filteredResults]);
  
  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          if (filteredResults[activeIndex]) {
            onSelect(filteredResults[activeIndex]);
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredResults, onSelect, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div style={styles.inputWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            style={styles.input}
          />
          <span style={styles.shortcut}>ESC</span>
        </div>
        
        {/* Results */}
        <div style={styles.results}>
          {filteredResults.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div>Aucun résultat pour "{query}"</div>
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, results]) => (
              <div key={type}>
                <div style={styles.category}>
                  {type === 'thread' ? 'Threads' : 
                   type === 'agent' ? 'Agents' :
                   type === 'decision' ? 'Décisions' :
                   type === 'sphere' ? 'Sphères' :
                   type === 'action' ? 'Actions' : type}
                </div>
                {results.map((result, idx) => {
                  const globalIdx = filteredResults.indexOf(result);
                  return (
                    <div
                      key={result.id}
                      style={{
                        ...styles.result,
                        ...(globalIdx === activeIndex ? styles.resultActive : {}),
                      }}
                      onClick={() => {
                        onSelect(result);
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                    >
                      <div style={styles.resultIcon}>{result.icon}</div>
                      <div style={styles.resultContent}>
                        <div style={styles.resultTitle}>{result.title}</div>
                        {result.subtitle && (
                          <div style={styles.resultSubtitle}>{result.subtitle}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <span>↑↓ Navigation</span>
          <span>↵ Sélectionner</span>
          <span>ESC Fermer</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchV72;
