/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — USE COMMAND PALETTE HOOK
   React hook for managing command palette state
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import type { RecentItem, SearchResult } from './types';

// ════════════════════════════════════════════════════════════════════════════════
// HOOK RETURN TYPE
// ════════════════════════════════════════════════════════════════════════════════

interface UseCommandPaletteReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  recentItems: RecentItem[];
  addToRecent: (item: Omit<RecentItem, 'timestamp'>) => void;
  clearRecent: () => void;
}

// ════════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE KEY
// ════════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'chenu-command-palette-recent';
const MAX_RECENT_ITEMS = 10;

// ════════════════════════════════════════════════════════════════════════════════
// HOOK
// ════════════════════════════════════════════════════════════════════════════════

export const useCommandPalette = (): UseCommandPaletteReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  // Load recent items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const items = parsed.map((item: unknown) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setRecentItems(items);
      }
    } catch (error) {
      logger.error('Failed to load recent items:', error);
    }
  }, []);

  // Save recent items to localStorage
  const saveRecent = useCallback((items: RecentItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      logger.error('Failed to save recent items:', error);
    }
  }, []);

  // Open palette
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close palette
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle palette
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Add item to recent
  const addToRecent = useCallback((item: Omit<RecentItem, 'timestamp'>) => {
    setRecentItems(prev => {
      // Remove existing item with same ID
      const filtered = prev.filter(i => i.id !== item.id);
      
      // Add new item at the beginning
      const newItems: RecentItem[] = [
        { ...item, timestamp: new Date() },
        ...filtered,
      ].slice(0, MAX_RECENT_ITEMS);
      
      saveRecent(newItems);
      return newItems;
    });
  }, [saveRecent]);

  // Clear recent items
  const clearRecent = useCallback(() => {
    setRecentItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Global keyboard shortcut (⌘+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘+K or Ctrl+K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
        return;
      }

      // ⌘+/ or Ctrl+/ for help/shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        open();
        return;
      }

      // Additional shortcuts when palette is closed
      if (!isOpen) {
        // g then h for home (vim-style)
        // Could implement g+key navigation here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, open]);

  return {
    isOpen,
    open,
    close,
    toggle,
    recentItems,
    addToRecent,
    clearRecent,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// SEARCH HOOK
// ════════════════════════════════════════════════════════════════════════════════

interface UseCommandSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export const useCommandSearch = (
  searchFn: (query: string) => Promise<SearchResult[]>,
  options: UseCommandSearchOptions = {}
) => {
  const { debounceMs = 200, minQueryLength = 2 } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (query.length < minQueryLength) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const searchResults = await searchFn(query);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, searchFn, debounceMs, minQueryLength]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clear: () => {
      setQuery('');
      setResults([]);
    },
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default useCommandPalette;
