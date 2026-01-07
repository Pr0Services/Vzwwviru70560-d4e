// CHE·NU™ Search & Autocomplete System
// Comprehensive search with suggestions, history, and filters

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SearchMode = 'search' | 'autocomplete' | 'command';
type SuggestionType = 'recent' | 'suggestion' | 'category' | 'action' | 'result';

interface SearchSuggestion<T = any> {
  id: string;
  type: SuggestionType;
  label: string;
  description?: string;
  icon?: ReactNode;
  category?: string;
  data?: T;
  highlighted?: boolean;
  disabled?: boolean;
  action?: () => void;
}

interface SearchCategory {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'range' | 'boolean';
  options?: { label: string; value: string | number }[];
  value?: unknown;
}

interface SearchResult<T = any> {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  category?: string;
  url?: string;
  score?: number;
  data?: T;
  highlights?: { field: string; matches: string[] }[];
}

interface SearchProps<T = any> {
  mode?: SearchMode;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  suggestions?: SearchSuggestion<T>[];
  categories?: SearchCategory[];
  filters?: SearchFilter[];
  results?: SearchResult<T>[];
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  minChars?: number;
  maxSuggestions?: number;
  showHistory?: boolean;
  showClear?: boolean;
  showFilters?: boolean;
  showCategories?: boolean;
  expandOnFocus?: boolean;
  hotkey?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string, filters?: Record<string, any>) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion<T>) => void;
  onResultSelect?: (result: SearchResult<T>) => void;
  onCategorySelect?: (category: SearchCategory) => void;
  onFilterChange?: (filterId: string, value: unknown) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  renderSuggestion?: (suggestion: SearchSuggestion<T>, isHighlighted: boolean) => ReactNode;
  renderResult?: (result: SearchResult<T>) => ReactNode;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

interface CommandPaletteProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  commands: SearchSuggestion<T>[];
  placeholder?: string;
  onCommandSelect: (command: SearchSuggestion<T>) => void;
  recentCommands?: SearchSuggestion<T>[];
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
// UTILITIES
// ============================================================

function debounce<T extends (...args: unknown[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function highlightText(text: string, query: string): ReactNode {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: `${BRAND.sacredGold}40`, padding: '0 2px' }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  let queryIndex = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === lowerQuery.length;
}

function scoreMatch(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match
  if (lowerText === lowerQuery) return 100;
  
  // Starts with
  if (lowerText.startsWith(lowerQuery)) return 80;
  
  // Contains
  if (lowerText.includes(lowerQuery)) return 60;
  
  // Fuzzy match
  if (fuzzyMatch(text, query)) return 40;
  
  return 0;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
  },

  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderRadius: '8px',
    transition: 'all 0.2s',
  },

  inputWrapperFocused: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}20`,
  },

  inputWrapperExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  searchIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    color: BRAND.ancientStone,
    fontSize: '18px',
  },

  input: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: 'transparent',
    width: '100%',
  },

  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: BRAND.ancientStone,
    fontSize: '16px',
    transition: 'color 0.2s',
  },

  hotkey: {
    padding: '4px 8px',
    marginRight: '8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    fontFamily: 'monospace',
  },

  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderTop: 'none',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    maxHeight: '400px',
    overflowY: 'auto' as const,
    zIndex: 1000,
  },

  section: {
    padding: '8px 0',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  sectionTitle: {
    padding: '8px 16px 4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: BRAND.ancientStone,
  },

  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },

  suggestionItemHighlighted: {
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
  },

  suggestionItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  suggestionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: BRAND.softSand,
    fontSize: '16px',
    color: BRAND.uiSlate,
    flexShrink: 0,
  },

  suggestionContent: {
    flex: 1,
    minWidth: 0,
  },

  suggestionLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  suggestionDescription: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '2px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  suggestionMeta: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    padding: '2px 8px',
    borderRadius: '4px',
    flexShrink: 0,
  },

  categoryTabs: {
    display: 'flex',
    gap: '4px',
    padding: '8px 12px',
    overflowX: 'auto' as const,
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
    border: 'none',
  },

  categoryTabActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  categoryCount: {
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  filters: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    flexWrap: 'wrap' as const,
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    backgroundColor: BRAND.softSand,
  },

  filterSelect: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}30`,
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: BRAND.uiSlate,
    cursor: 'pointer',
  },

  resultItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
  },

  resultItemHover: {
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
  },

  resultIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: BRAND.softSand,
    fontSize: '20px',
    flexShrink: 0,
  },

  resultContent: {
    flex: 1,
    minWidth: 0,
  },

  resultTitle: {
    fontSize: '15px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  resultDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
  },

  resultCategory: {
    fontSize: '11px',
    color: BRAND.cenoteTurquoise,
    marginTop: '4px',
  },

  noResults: {
    padding: '24px 16px',
    textAlign: 'center' as const,
    color: BRAND.ancientStone,
  },

  noResultsIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    opacity: 0.5,
  },

  noResultsText: {
    fontSize: '14px',
    marginBottom: '4px',
  },

  noResultsSubtext: {
    fontSize: '12px',
    opacity: 0.7,
  },

  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: BRAND.ancientStone,
  },

  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: `2px solid ${BRAND.softSand}`,
    borderTopColor: BRAND.cenoteTurquoise,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '12px',
  },

  commandPalette: {
    position: 'fixed' as const,
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    maxWidth: '90vw',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    zIndex: 10000,
  },

  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  },

  commandInput: {
    width: '100%',
    padding: '16px 20px',
    border: 'none',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    fontSize: '16px',
    color: BRAND.uiSlate,
    outline: 'none',
  },

  commandList: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },

  commandItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },

  commandItemHighlighted: {
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
  },

  commandShortcut: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '4px',
  },

  commandKey: {
    padding: '4px 8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    fontFamily: 'monospace',
  },
};

// ============================================================
// SEARCH COMPONENT
// ============================================================

export function Search<T = any>({
  mode = 'search',
  placeholder = 'Search...',
  defaultValue = '',
  value: controlledValue,
  suggestions = [],
  categories = [],
  filters = [],
  results = [],
  loading = false,
  disabled = false,
  autoFocus = false,
  debounceMs = 300,
  minChars = 1,
  maxSuggestions = 10,
  showHistory = true,
  showClear = true,
  showFilters = false,
  showCategories = false,
  expandOnFocus = true,
  hotkey,
  onChange,
  onSearch,
  onSuggestionSelect,
  onResultSelect,
  onCategorySelect,
  onFilterChange,
  onClear,
  onFocus,
  onBlur,
  renderSuggestion,
  renderResult,
  className,
  inputClassName,
  dropdownClassName,
}: SearchProps<T>): JSX.Element {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      if (query.length >= minChars) {
        onSearch?.(query, filterValues);
      }
    }, debounceMs),
    [minChars, debounceMs, filterValues, onSearch]
  );

  // Filter suggestions
  const filteredSuggestions = useMemo(() => {
    if (!value || value.length < minChars) {
      return showHistory ? suggestions.filter((s) => s.type === 'recent').slice(0, 5) : [];
    }

    const scored = suggestions
      .filter((s) => {
        if (activeCategory && s.category !== activeCategory) return false;
        return scoreMatch(s.label, value) > 0 || 
               (s.description && scoreMatch(s.description, value) > 0);
      })
      .map((s) => ({
        ...s,
        score: Math.max(
          scoreMatch(s.label, value),
          s.description ? scoreMatch(s.description, value) * 0.5 : 0
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, maxSuggestions);
  }, [suggestions, value, minChars, maxSuggestions, activeCategory, showHistory]);

  // Handle input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
    debouncedSearch(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [onChange, debouncedSearch]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (expandOnFocus) {
      setIsOpen(true);
    }
    onFocus?.();
  }, [expandOnFocus, onFocus]);

  // Handle blur
  const handleBlur = useCallback((e: FocusEvent) => {
    // Don't close if clicking within dropdown
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsFocused(false);
    setTimeout(() => setIsOpen(false), 150);
    onBlur?.();
  }, [onBlur]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  // Handle suggestion select
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion<T>) => {
    if (suggestion.disabled) return;

    if (suggestion.action) {
      suggestion.action();
    } else {
      setInternalValue(suggestion.label);
      onChange?.(suggestion.label);
      onSuggestionSelect?.(suggestion);
    }
    setIsOpen(false);
  }, [onChange, onSuggestionSelect]);

  // Handle result select
  const handleResultSelect = useCallback((result: SearchResult<T>) => {
    onResultSelect?.(result);
    setIsOpen(false);
  }, [onResultSelect]);

  // Handle category select
  const handleCategorySelect = useCallback((category: SearchCategory) => {
    setActiveCategory((prev) => prev === category.id ? null : category.id);
    onCategorySelect?.(category);
  }, [onCategorySelect]);

  // Handle filter change
  const handleFilterChange = useCallback((filterId: string, newValue: unknown) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: newValue }));
    onFilterChange?.(filterId, newValue);
  }, [onFilterChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const items = filteredSuggestions.length > 0 ? filteredSuggestions : results;
    const itemCount = items.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (filteredSuggestions.length > 0) {
            handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
          } else if (results.length > 0) {
            handleResultSelect(results[highlightedIndex]);
          }
        } else {
          onSearch?.(value, filterValues);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [filteredSuggestions, results, highlightedIndex, value, filterValues, handleSuggestionSelect, handleResultSelect, onSearch]);

  // Hotkey listener
  useEffect(() => {
    if (!hotkey) return;

    const handleHotkey = (e: globalThis.KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleHotkey);
    return () => document.removeEventListener('keydown', handleHotkey);
  }, [hotkey]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group suggestions by type
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, SearchSuggestion<T>[]> = {};
    filteredSuggestions.forEach((s) => {
      const type = s.type || 'suggestion';
      if (!groups[type]) groups[type] = [];
      groups[type].push(s);
    });
    return groups;
  }, [filteredSuggestions]);

  const showDropdown = isOpen && (
    filteredSuggestions.length > 0 || 
    results.length > 0 || 
    loading ||
    (showCategories && categories.length > 0) ||
    (showFilters && filters.length > 0)
  );

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      <div
        style={{
          ...styles.inputWrapper,
          ...(isFocused && styles.inputWrapperFocused),
          ...(showDropdown && styles.inputWrapperExpanded),
        }}
      >
        <span style={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          style={styles.input}
          className={inputClassName}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {showClear && value && (
          <button style={styles.clearButton} onClick={handleClear} type="button">
            ×
          </button>
        )}
        {hotkey && !isFocused && (
          <span style={styles.hotkey}>⌘{hotkey.toUpperCase()}</span>
        )}
      </div>

      {showDropdown && (
        <div style={styles.dropdown} className={dropdownClassName}>
          {/* Categories */}
          {showCategories && categories.length > 0 && (
            <div style={styles.categoryTabs}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  style={{
                    ...styles.categoryTab,
                    ...(activeCategory === category.id && styles.categoryTabActive),
                  }}
                  onClick={() => handleCategorySelect(category)}
                  type="button"
                >
                  {category.icon}
                  {category.label}
                  {category.count !== undefined && (
                    <span style={styles.categoryCount}>{category.count}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Filters */}
          {showFilters && filters.length > 0 && (
            <div style={styles.filters}>
              {filters.map((filter) => (
                <select
                  key={filter.id}
                  style={styles.filterSelect}
                  value={filterValues[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={styles.loading}>
              <div style={styles.loadingSpinner} />
              Searching...
            </div>
          )}

          {/* Suggestions */}
          {!loading && filteredSuggestions.length > 0 && (
            <>
              {Object.entries(groupedSuggestions).map(([type, items]) => (
                <div key={type} style={styles.section}>
                  <div style={styles.sectionTitle}>
                    {type === 'recent' ? 'Recent' : type === 'action' ? 'Actions' : 'Suggestions'}
                  </div>
                  {items.map((suggestion, index) => {
                    const globalIndex = filteredSuggestions.indexOf(suggestion);
                    const isHighlighted = globalIndex === highlightedIndex;

                    if (renderSuggestion) {
                      return (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {renderSuggestion(suggestion, isHighlighted)}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={suggestion.id}
                        style={{
                          ...styles.suggestionItem,
                          ...(isHighlighted && styles.suggestionItemHighlighted),
                          ...(suggestion.disabled && styles.suggestionItemDisabled),
                        }}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                      >
                        <div style={styles.suggestionIcon}>
                          {suggestion.icon || (type === 'recent' ? '🕒' : '🔍')}
                        </div>
                        <div style={styles.suggestionContent}>
                          <div style={styles.suggestionLabel}>
                            {highlightText(suggestion.label, value)}
                          </div>
                          {suggestion.description && (
                            <div style={styles.suggestionDescription}>
                              {suggestion.description}
                            </div>
                          )}
                        </div>
                        {suggestion.category && (
                          <span style={styles.suggestionMeta}>{suggestion.category}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Results</div>
              {results.map((result, index) => {
                const isHighlighted = filteredSuggestions.length === 0 && index === highlightedIndex;

                if (renderResult) {
                  return (
                    <div key={result.id} onClick={() => handleResultSelect(result)}>
                      {renderResult(result)}
                    </div>
                  );
                }

                return (
                  <div
                    key={result.id}
                    style={{
                      ...styles.resultItem,
                      ...(isHighlighted && styles.resultItemHover),
                    }}
                    onClick={() => handleResultSelect(result)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div style={styles.resultIcon}>{result.icon || '📄'}</div>
                    <div style={styles.resultContent}>
                      <div style={styles.resultTitle}>
                        {highlightText(result.title, value)}
                      </div>
                      {result.description && (
                        <div style={styles.resultDescription}>{result.description}</div>
                      )}
                      {result.category && (
                        <div style={styles.resultCategory}>{result.category}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!loading && filteredSuggestions.length === 0 && results.length === 0 && value.length >= minChars && (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <div style={styles.noResultsText}>No results found</div>
              <div style={styles.noResultsSubtext}>Try a different search term</div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// COMMAND PALETTE
// ============================================================

export function CommandPalette<T = any>({
  isOpen,
  onClose,
  commands,
  placeholder = 'Type a command...',
  onCommandSelect,
  recentCommands = [],
  className,
}: CommandPaletteProps<T>): JSX.Element | null {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = useMemo(() => {
    if (!query) return recentCommands.length > 0 ? recentCommands : commands.slice(0, 10);

    return commands
      .filter((cmd) => fuzzyMatch(cmd.label, query) || (cmd.description && fuzzyMatch(cmd.description, query)))
      .sort((a, b) => scoreMatch(b.label, query) - scoreMatch(a.label, query))
      .slice(0, 15);
  }, [commands, recentCommands, query]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCommands]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[highlightedIndex]) {
          onCommandSelect(filteredCommands[highlightedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [filteredCommands, highlightedIndex, onCommandSelect, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.commandPalette} className={className}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          style={styles.commandInput}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div style={styles.commandList}>
          {filteredCommands.map((cmd, index) => (
            <div
              key={cmd.id}
              style={{
                ...styles.commandItem,
                ...(index === highlightedIndex && styles.commandItemHighlighted),
              }}
              onClick={() => {
                onCommandSelect(cmd);
                onClose();
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div style={styles.suggestionIcon}>{cmd.icon || '⚡'}</div>
              <div style={styles.suggestionContent}>
                <div style={styles.suggestionLabel}>{cmd.label}</div>
                {cmd.description && (
                  <div style={styles.suggestionDescription}>{cmd.description}</div>
                )}
              </div>
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div style={styles.noResults}>
              <div style={styles.noResultsText}>No commands found</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  SearchMode,
  SuggestionType,
  SearchSuggestion,
  SearchCategory,
  SearchFilter,
  SearchResult,
  SearchProps,
  CommandPaletteProps,
};

export { highlightText, fuzzyMatch, scoreMatch };
export default Search;
