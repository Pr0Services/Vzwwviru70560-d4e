/**
 * CHE·NU™ V75 — useSearch Hook
 * =============================
 * Advanced search with filters and suggestions
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { QUERY_KEYS } from '../config/api.config';
import { debounce } from '../utils/debounce';

// =============================================================================
// TYPES
// =============================================================================

export type SearchResultType = 'thread' | 'decision' | 'agent' | 'file' | 'note' | 'checkpoint';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  sphere_id?: string;
  sphere_name?: string;
  created_at: string;
  updated_at?: string;
  relevance_score: number;
  highlights: string[];
  url: string;
  metadata: Record<string, any>;
}

export interface SearchFilters {
  types?: SearchResultType[];
  sphere_ids?: string[];
  date_from?: string;
  date_to?: string;
  status?: string[];
}

export interface SearchResponse {
  query: string;
  total: number;
  page: number;
  limit: number;
  results: SearchResult[];
  facets: {
    types: Record<string, number>;
    spheres: Record<string, number>;
    status: Record<string, number>;
  };
  suggestions: string[];
  took_ms: number;
}

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  initialFilters?: SearchFilters;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

async function performSearch(
  query: string,
  filters: SearchFilters,
  page: number,
  limit: number
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('page', page.toString());
  params.set('limit', limit.toString());

  if (filters.types?.length) {
    params.set('types', filters.types.join(','));
  }
  if (filters.sphere_ids?.length) {
    params.set('sphere_ids', filters.sphere_ids.join(','));
  }
  if (filters.date_from) {
    params.set('date_from', filters.date_from);
  }
  if (filters.date_to) {
    params.set('date_to', filters.date_to);
  }
  if (filters.status?.length) {
    params.set('status', filters.status.join(','));
  }

  const response = await apiClient.get<SearchResponse>(`/search/advanced?${params.toString()}`);
  return response.data;
}

async function getSuggestions(query: string): Promise<string[]> {
  const response = await apiClient.get<{ data: { suggestions: string[] } }>(
    `/search/suggestions?q=${encodeURIComponent(query)}`
  );
  return response.data.data.suggestions;
}

async function getRecentSearches(): Promise<Array<{ query: string; timestamp: string }>> {
  const response = await apiClient.get<{ data: { searches: Array<{ query: string; timestamp: string }> } }>(
    '/search/recent'
  );
  return response.data.data.searches;
}

// =============================================================================
// HOOK
// =============================================================================

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    initialFilters = {},
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();

  // Debounce query
  const debouncedSetQuery = useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    if (query.length >= minQueryLength) {
      debouncedSetQuery(query);
    } else {
      setDebouncedQuery('');
    }
  }, [query, minQueryLength, debouncedSetQuery]);

  // Search query
  const searchQuery = useQuery({
    queryKey: [QUERY_KEYS.SEARCH, debouncedQuery, filters, page, limit],
    queryFn: () => performSearch(debouncedQuery, filters, page, limit),
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: 30000,
  });

  // Suggestions query
  const suggestionsQuery = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => getSuggestions(query),
    enabled: query.length >= 1 && query.length < minQueryLength,
    staleTime: 60000,
  });

  // Recent searches query
  const recentSearchesQuery = useQuery({
    queryKey: ['search-recent'],
    queryFn: getRecentSearches,
    staleTime: 300000,
  });

  // Actions
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (searchQuery.data && page * limit < searchQuery.data.total) {
      setPage(p => p + 1);
    }
  }, [searchQuery.data, page, limit]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearRecentSearches = useCallback(async () => {
    await apiClient.delete('/search/recent');
    queryClient.invalidateQueries({ queryKey: ['search-recent'] });
  }, [queryClient]);

  return {
    // State
    query,
    filters,
    page,
    limit,
    
    // Results
    results: searchQuery.data?.results ?? [],
    total: searchQuery.data?.total ?? 0,
    facets: searchQuery.data?.facets ?? { types: {}, spheres: {}, status: {} },
    suggestions: suggestionsQuery.data ?? [],
    recentSearches: recentSearchesQuery.data ?? [],
    took: searchQuery.data?.took_ms ?? 0,
    
    // Status
    isLoading: searchQuery.isLoading,
    isSearching: searchQuery.isFetching,
    hasResults: (searchQuery.data?.results.length ?? 0) > 0,
    hasMore: searchQuery.data ? page * limit < searchQuery.data.total : false,
    
    // Actions
    updateQuery,
    updateFilters,
    clearFilters,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    clearRecentSearches,
  };
}

// =============================================================================
// UTILITY - Debounce
// =============================================================================

// If not in utils/debounce.ts, here's a simple implementation
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default useSearch;
