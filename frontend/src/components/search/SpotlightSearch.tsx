/**
 * CHE·NU - Spotlight Search
 * Recherche globale style macOS Spotlight
 */

import React, { useState, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  type: 'sphere' | 'project' | 'agent' | 'thread' | 'document';
  title: string;
  description?: string;
  icon: string;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}

const mockResults: SearchResult[] = [
  { id: '1', type: 'sphere', title: 'Personal', description: 'Sphère personnelle', icon: '🏠' },
  { id: '2', type: 'sphere', title: 'Business', description: 'Sphère professionnelle', icon: '💼' },
  { id: '3', type: 'project', title: 'CHE·NU v2', description: 'Projet principal', icon: '📁' },
  { id: '4', type: 'agent', title: 'Nova', description: 'Assistant principal', icon: '🌟' },
  { id: '5', type: 'thread', title: 'Roadmap Q1', description: 'Thread de planification', icon: '💬' },
];

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onSelect?.(results[selectedIndex]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '600px',
          maxHeight: '400px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher dans CHE·NU..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f9fafb',
              fontSize: '16px'
            }}
          />
          <kbd style={{
            padding: '2px 6px',
            backgroundColor: '#374151',
            borderRadius: '4px',
            color: '#9ca3af',
            fontSize: '12px'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={result.id}
                onClick={() => {
                  onSelect?.(result);
                  onClose();
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: index === selectedIndex ? '#374151' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{result.icon}</span>
                <div>
                  <div style={{ color: '#f9fafb', fontWeight: 500 }}>
                    {result.title}
                  </div>
                  {result.description && (
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                      {result.description}
                    </div>
                  )}
                </div>
                <span style={{
                  marginLeft: 'auto',
                  padding: '2px 8px',
                  backgroundColor: '#1f2937',
                  borderRadius: '4px',
                  color: '#6b7280',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}>
                  {result.type}
                </span>
              </div>
            ))
          ) : query.trim() ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Aucun résultat pour "{query}"
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Commencez à taper pour rechercher...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightSearch;
