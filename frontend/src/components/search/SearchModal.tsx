/**
 * CHE·NU™ V75 — SearchModal Component
 * =====================================
 * Global search with filters and keyboard shortcuts
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, SearchResultType, SearchResult } from '../../hooks/api/useSearch';

// =============================================================================
// ICONS
// =============================================================================

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ThreadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const DecisionIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AgentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// =============================================================================
// HELPERS
// =============================================================================

const getResultIcon = (type: SearchResultType) => {
  switch (type) {
    case 'thread': return <ThreadIcon />;
    case 'decision': return <DecisionIcon />;
    case 'agent': return <AgentIcon />;
    case 'file': return <FileIcon />;
    default: return <FileIcon />;
  }
};

const getResultColor = (type: SearchResultType) => {
  switch (type) {
    case 'thread': return 'text-cyan-400';
    case 'decision': return 'text-purple-400';
    case 'agent': return 'text-green-400';
    case 'file': return 'text-yellow-400';
    default: return 'text-white/60';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// =============================================================================
// TYPES
// =============================================================================

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}

type FilterType = SearchResultType | 'all';

// =============================================================================
// COMPONENT
// =============================================================================

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const {
    query,
    filters,
    results,
    total,
    facets,
    suggestions,
    recentSearches,
    took,
    isSearching,
    hasResults,
    updateQuery,
    updateFilters,
    clearFilters,
  } = useSearch({ debounceMs: 200 });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Handle filter change
  const handleFilterChange = useCallback((type: FilterType) => {
    setActiveFilter(type);
    if (type === 'all') {
      updateFilters({ types: undefined });
    } else {
      updateFilters({ types: [type] });
    }
  }, [updateFilters]);

  // Handle result selection
  const handleSelect = useCallback((result: SearchResult) => {
    onSelect?.(result);
    onClose();
    // Navigate to result URL
    window.location.href = result.url;
  }, [onSelect, onClose]);

  // Handle recent search click
  const handleRecentClick = useCallback((searchQuery: string) => {
    updateQuery(searchQuery);
  }, [updateQuery]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    updateQuery(suggestion);
  }, [updateQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="text-white/40">
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => updateQuery(e.target.value)}
              placeholder="Rechercher threads, décisions, agents, fichiers..."
              className="flex-1 bg-transparent text-white text-lg placeholder-white/30 outline-none"
            />
            {query && (
              <button
                onClick={() => updateQuery('')}
                className="text-white/40 hover:text-white/60"
              >
                <XIcon />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-white/10 text-cyan-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <FilterIcon />
            </button>
            <kbd className="hidden sm:block px-2 py-1 text-xs text-white/30 bg-white/5 rounded border border-white/10">
              ESC
            </kbd>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/10 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Type Filter */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'thread', 'decision', 'agent', 'file'] as FilterType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeFilter === type
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {type === 'all' ? 'Tout' : type.charAt(0).toUpperCase() + type.slice(1)}
                        {type !== 'all' && facets.types[type] !== undefined && (
                          <span className="ml-1.5 text-xs opacity-60">
                            ({facets.types[type]})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Sphere Filter */}
                  {Object.keys(facets.spheres).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(facets.spheres).map(([sphere, count]) => (
                        <button
                          key={sphere}
                          onClick={() => {
                            const currentSpheres = filters.sphere_ids || [];
                            if (currentSpheres.includes(sphere)) {
                              updateFilters({ sphere_ids: currentSpheres.filter(s => s !== sphere) });
                            } else {
                              updateFilters({ sphere_ids: [...currentSpheres, sphere] });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            filters.sphere_ids?.includes(sphere)
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {sphere}
                          <span className="ml-1.5 text-xs opacity-60">({count})</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Clear Filters */}
                  {(filters.types || filters.sphere_ids) && (
                    <button
                      onClick={() => {
                        clearFilters();
                        setActiveFilter('all');
                      }}
                      className="text-sm text-white/40 hover:text-white/60"
                    >
                      Effacer les filtres
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Loading */}
            {isSearching && (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-2 text-sm text-white/40">Recherche en cours...</p>
              </div>
            )}

            {/* Results */}
            {!isSearching && hasResults && (
              <div className="divide-y divide-white/5">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(result)}
                    className={`w-full p-4 text-left transition-colors ${
                      index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${getResultColor(result.type)}`}>
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium truncate">
                            {result.title}
                          </h4>
                          {result.sphere_name && (
                            <span className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">
                              {result.sphere_name}
                            </span>
                          )}
                        </div>
                        {result.description && (
                          <p className="mt-1 text-sm text-white/50 line-clamp-1">
                            {result.description}
                          </p>
                        )}
                        {result.highlights.length > 0 && (
                          <p className="mt-1 text-sm text-white/40 italic line-clamp-1">
                            ...{result.highlights[0]}...
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-white/30">
                        {formatDate(result.created_at)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && query.length >= 2 && !hasResults && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/60">Aucun résultat pour "{query}"</p>
                <p className="mt-1 text-sm text-white/40">
                  Essayez avec d'autres termes
                </p>
              </div>
            )}

            {/* Suggestions */}
            {!isSearching && query.length >= 1 && query.length < 2 && suggestions.length > 0 && (
              <div className="p-4">
                <p className="text-xs text-white/40 uppercase tracking-wide mb-2">
                  Suggestions
                </p>
                <div className="space-y-1">
                  {suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full p-2 text-left text-white/70 hover:bg-white/5 rounded-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!isSearching && !query && recentSearches.length > 0 && (
              <div className="p-4">
                <p className="text-xs text-white/40 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <ClockIcon />
                  Recherches récentes
                </p>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search.query)}
                      className="w-full p-2 text-left text-white/70 hover:bg-white/5 rounded-lg flex items-center gap-2"
                    >
                      <ClockIcon />
                      {search.query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isSearching && !query && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔎</div>
                <p className="text-white/60">Commencez à taper pour rechercher</p>
                <p className="mt-2 text-sm text-white/40">
                  Threads, décisions, agents, fichiers...
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasResults && (
            <div className="flex items-center justify-between p-3 border-t border-white/10 bg-white/5">
              <span className="text-xs text-white/40">
                {total} résultat{total > 1 ? 's' : ''} en {took}ms
              </span>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                  naviguer
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                  sélectionner
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================================================
// SEARCH TRIGGER HOOK
// =============================================================================

export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export default SearchModal;
