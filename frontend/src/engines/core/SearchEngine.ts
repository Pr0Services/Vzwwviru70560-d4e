/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — SEARCH ENGINE                                         ║
 * ║              Core Engine 5/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Find anything, anywhere, with governance."                                 ║
 * ║  "Cross-sphere search respects scope boundaries and permissions."           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SearchableType = 
  | 'thread' | 'document' | 'note' | 'task' | 'project'
  | 'meeting' | 'contact' | 'agent' | 'dataspace' | 'all';

export type SearchScope = 
  | 'current_sphere'     // Only current sphere
  | 'specified_spheres'  // List of specific spheres
  | 'all_accessible'     // All spheres user can access
  | 'global';            // Everything (admin only)

export interface SearchQuery {
  text: string;
  type?: SearchableType;
  scope: SearchScope;
  spheres?: string[];
  filters?: SearchFilters;
  options?: SearchOptions;
}

export interface SearchFilters {
  date_range?: {
    start: string;
    end: string;
  };
  owner_id?: string;
  status?: string;
  tags?: string[];
  has_attachments?: boolean;
  min_relevance?: number;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sort_by?: 'relevance' | 'date' | 'title';
  sort_order?: 'asc' | 'desc';
  highlight?: boolean;
  include_snippets?: boolean;
  snippet_length?: number;
}

export interface SearchResult {
  id: string;
  type: SearchableType;
  title: string;
  snippet?: string;
  highlights?: string[];
  relevance_score: number;
  sphere_id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  access_level: 'full' | 'partial' | 'restricted';
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_count: number;
  returned_count: number;
  search_time_ms: number;
  scope_info: {
    spheres_searched: string[];
    types_searched: SearchableType[];
  };
  suggestions?: string[];
  facets?: SearchFacets;
}

export interface SearchFacets {
  by_type: Record<SearchableType, number>;
  by_sphere: Record<string, number>;
  by_date: Record<string, number>;
}

// Index Types
export interface SearchIndex {
  id: string;
  type: SearchableType;
  sphere_id: string;
  title: string;
  content: string;
  tokens: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class SearchEngine {
  private indices: Map<string, SearchIndex> = new Map();
  private invertedIndex: Map<string, Set<string>> = new Map(); // token -> document IDs
  private sphereIndices: Map<string, Set<string>> = new Map(); // sphere -> document IDs
  private typeIndices: Map<SearchableType, Set<string>> = new Map(); // type -> document IDs
  
  constructor() {
    this.initializeTypeIndices();
  }
  
  private initializeTypeIndices(): void {
    const types: SearchableType[] = [
      'thread', 'document', 'note', 'task', 'project',
      'meeting', 'contact', 'agent', 'dataspace'
    ];
    types.forEach(t => this.typeIndices.set(t, new Set()));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INDEXING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Index a document for searching
   */
  indexDocument(doc: Omit<SearchIndex, 'tokens'>): void {
    // Tokenize content
    const tokens = this.tokenize(`${doc.title} ${doc.content}`);
    
    const index: SearchIndex = {
      ...doc,
      tokens,
    };
    
    // Store in main index
    this.indices.set(doc.id, index);
    
    // Update inverted index
    tokens.forEach(token => {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token)!.add(doc.id);
    });
    
    // Update sphere index
    if (!this.sphereIndices.has(doc.sphere_id)) {
      this.sphereIndices.set(doc.sphere_id, new Set());
    }
    this.sphereIndices.get(doc.sphere_id)!.add(doc.id);
    
    // Update type index
    if (doc.type !== 'all') {
      this.typeIndices.get(doc.type)?.add(doc.id);
    }
  }
  
  /**
   * Remove a document from the index
   */
  removeFromIndex(docId: string): void {
    const doc = this.indices.get(docId);
    if (!doc) return;
    
    // Remove from inverted index
    doc.tokens.forEach(token => {
      this.invertedIndex.get(token)?.delete(docId);
    });
    
    // Remove from sphere index
    this.sphereIndices.get(doc.sphere_id)?.delete(docId);
    
    // Remove from type index
    this.typeIndices.get(doc.type)?.delete(docId);
    
    // Remove from main index
    this.indices.delete(docId);
  }
  
  /**
   * Update a document in the index
   */
  updateIndex(doc: Omit<SearchIndex, 'tokens'>): void {
    this.removeFromIndex(doc.id);
    this.indexDocument(doc);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCHING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Perform a search
   */
  search(query: SearchQuery, userId: string, accessibleSpheres: string[]): SearchResponse {
    const startTime = Date.now();
    
    // Determine searchable spheres based on scope
    const spheresToSearch = this.determineSpheres(query, accessibleSpheres);
    
    // Get candidate document IDs
    let candidateIds = this.getCandidateIds(query, spheresToSearch);
    
    // Apply filters
    if (query.filters) {
      candidateIds = this.applyFilters(candidateIds, query.filters);
    }
    
    // Score and rank results
    const scoredResults = this.scoreResults(query.text, candidateIds, query.options);
    
    // Apply pagination
    const offset = query.options?.offset || 0;
    const limit = query.options?.limit || 20;
    const paginatedResults = scoredResults.slice(offset, offset + limit);
    
    // Build response
    const results = paginatedResults.map(r => this.buildSearchResult(r, query.options));
    
    // Calculate facets
    const facets = this.calculateFacets(scoredResults);
    
    // Generate suggestions if no results
    const suggestions = results.length === 0 ? this.generateSuggestions(query.text) : undefined;
    
    return {
      query: query.text,
      results,
      total_count: scoredResults.length,
      returned_count: results.length,
      search_time_ms: Date.now() - startTime,
      scope_info: {
        spheres_searched: spheresToSearch,
        types_searched: query.type ? [query.type] : ['all'],
      },
      suggestions,
      facets,
    };
  }
  
  /**
   * Quick search - optimized for autocomplete
   */
  quickSearch(text: string, sphereId: string, limit: number = 5): SearchResult[] {
    const query: SearchQuery = {
      text,
      scope: 'current_sphere',
      spheres: [sphereId],
      options: { limit, highlight: false },
    };
    
    const response = this.search(query, '', [sphereId]);
    return response.results;
  }
  
  /**
   * Semantic search - finds conceptually related content
   */
  semanticSearch(
    text: string,
    spheres: string[],
    options?: { minRelevance?: number; limit?: number }
  ): SearchResult[] {
    // In production, this would use embeddings and vector search
    // Simplified implementation using keyword expansion
    const expandedTokens = this.expandQuery(text);
    
    const query: SearchQuery = {
      text: expandedTokens.join(' '),
      scope: 'specified_spheres',
      spheres,
      filters: {
        min_relevance: options?.minRelevance || 0.3,
      },
      options: {
        limit: options?.limit || 10,
        sort_by: 'relevance',
      },
    };
    
    return this.search(query, '', spheres).results;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED FEATURES
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Find similar documents
   */
  findSimilar(docId: string, limit: number = 5): SearchResult[] {
    const doc = this.indices.get(docId);
    if (!doc) return [];
    
    // Use document tokens as query
    const queryText = doc.tokens.slice(0, 10).join(' ');
    
    const results = this.search({
      text: queryText,
      scope: 'current_sphere',
      spheres: [doc.sphere_id],
      options: { limit: limit + 1 }, // +1 to exclude the source doc
    }, '', [doc.sphere_id]).results;
    
    // Remove the source document from results
    return results.filter(r => r.id !== docId).slice(0, limit);
  }
  
  /**
   * Get recent items of a type
   */
  getRecent(type: SearchableType, sphereId: string, limit: number = 10): SearchResult[] {
    const typeIds = this.typeIndices.get(type);
    const sphereIds = this.sphereIndices.get(sphereId);
    
    if (!typeIds || !sphereIds) return [];
    
    // Intersection of type and sphere
    const ids = [...typeIds].filter(id => sphereIds.has(id));
    
    // Sort by date
    const sorted = ids
      .map(id => this.indices.get(id)!)
      .filter(Boolean)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
    
    return sorted.map(doc => this.buildSearchResult({ doc, score: 1 }, {}));
  }
  
  /**
   * Get trending items (most accessed/updated)
   */
  getTrending(sphereId: string, limit: number = 5): SearchResult[] {
    const sphereIds = this.sphereIndices.get(sphereId);
    if (!sphereIds) return [];
    
    // In production, this would track access patterns
    // Simplified: return most recently updated
    return this.getRecent('all', sphereId, limit);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2)
      .filter((t, i, arr) => arr.indexOf(t) === i); // Unique
  }
  
  private determineSpheres(query: SearchQuery, accessible: string[]): string[] {
    switch (query.scope) {
      case 'current_sphere':
        return query.spheres?.slice(0, 1) || [];
      case 'specified_spheres':
        return (query.spheres || []).filter(s => accessible.includes(s));
      case 'all_accessible':
        return accessible;
      case 'global':
        return [...this.sphereIndices.keys()];
      default:
        return [];
    }
  }
  
  private getCandidateIds(query: SearchQuery, spheres: string[]): string[] {
    // Get IDs matching query tokens
    const queryTokens = this.tokenize(query.text);
    let tokenMatches: Set<string> | null = null;
    
    queryTokens.forEach(token => {
      const matches = this.invertedIndex.get(token);
      if (matches) {
        if (tokenMatches === null) {
          tokenMatches = new Set(matches);
        } else {
          // Intersection for AND logic, or union for OR logic
          // Using union (OR) for broader results
          matches.forEach(id => tokenMatches!.add(id));
        }
      }
    });
    
    let candidates = tokenMatches ? [...tokenMatches] : [];
    
    // Filter by spheres
    if (spheres.length > 0) {
      const sphereIds = new Set<string>();
      spheres.forEach(s => {
        this.sphereIndices.get(s)?.forEach(id => sphereIds.add(id));
      });
      candidates = candidates.filter(id => sphereIds.has(id));
    }
    
    // Filter by type
    if (query.type && query.type !== 'all') {
      const typeIds = this.typeIndices.get(query.type);
      if (typeIds) {
        candidates = candidates.filter(id => typeIds.has(id));
      }
    }
    
    return candidates;
  }
  
  private applyFilters(ids: string[], filters: SearchFilters): string[] {
    return ids.filter(id => {
      const doc = this.indices.get(id);
      if (!doc) return false;
      
      // Date range filter
      if (filters.date_range) {
        const docDate = new Date(doc.created_at).getTime();
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        if (docDate < start || docDate > end) return false;
      }
      
      // Owner filter
      if (filters.owner_id && doc.metadata.owner_id !== filters.owner_id) {
        return false;
      }
      
      // Status filter
      if (filters.status && doc.metadata.status !== filters.status) {
        return false;
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const docTags = doc.metadata.tags || [];
        if (!filters.tags.some(t => docTags.includes(t))) return false;
      }
      
      return true;
    });
  }
  
  private scoreResults(
    queryText: string,
    candidateIds: string[],
    options?: SearchOptions
  ): Array<{ doc: SearchIndex; score: number }> {
    const queryTokens = this.tokenize(queryText);
    
    const scored = candidateIds.map(id => {
      const doc = this.indices.get(id)!;
      let score = 0;
      
      // Token match scoring
      queryTokens.forEach(token => {
        if (doc.tokens.includes(token)) score += 1;
        if (doc.title.toLowerCase().includes(token)) score += 2; // Title boost
      });
      
      // Normalize score
      score = score / (queryTokens.length * 3);
      
      // Recency boost
      const ageHours = (Date.now() - new Date(doc.updated_at).getTime()) / (1000 * 60 * 60);
      if (ageHours < 24) score *= 1.2;
      else if (ageHours < 168) score *= 1.1;
      
      return { doc, score };
    });
    
    // Sort
    const sortBy = options?.sort_by || 'relevance';
    const sortOrder = options?.sort_order || 'desc';
    
    scored.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'relevance':
          comparison = a.score - b.score;
          break;
        case 'date':
          comparison = new Date(a.doc.updated_at).getTime() - new Date(b.doc.updated_at).getTime();
          break;
        case 'title':
          comparison = a.doc.title.localeCompare(b.doc.title);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    // Filter by minimum relevance
    const minRelevance = options?.sort_by === 'relevance' ? 0.1 : 0;
    return scored.filter(r => r.score >= minRelevance);
  }
  
  private buildSearchResult(
    item: { doc: SearchIndex; score: number },
    options?: SearchOptions
  ): SearchResult {
    const { doc, score } = item;
    
    const result: SearchResult = {
      id: doc.id,
      type: doc.type,
      title: doc.title,
      relevance_score: score,
      sphere_id: doc.sphere_id,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      metadata: doc.metadata,
      access_level: 'full', // Would be determined by permission check
    };
    
    if (options?.include_snippets) {
      const snippetLength = options.snippet_length || 150;
      result.snippet = doc.content.substring(0, snippetLength) + '...';
    }
    
    return result;
  }
  
  private calculateFacets(results: Array<{ doc: SearchIndex; score: number }>): SearchFacets {
    const byType: Record<string, number> = {};
    const bySphere: Record<string, number> = {};
    const byDate: Record<string, number> = {};
    
    results.forEach(({ doc }) => {
      byType[doc.type] = (byType[doc.type] || 0) + 1;
      bySphere[doc.sphere_id] = (bySphere[doc.sphere_id] || 0) + 1;
      
      const dateKey = doc.created_at.substring(0, 7); // YYYY-MM
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
    });
    
    return {
      by_type: byType as Record<SearchableType, number>,
      by_sphere: bySphere,
      by_date: byDate,
    };
  }
  
  private generateSuggestions(text: string): string[] {
    const tokens = this.tokenize(text);
    const suggestions: string[] = [];
    
    // Find similar tokens in index
    this.invertedIndex.forEach((_, token) => {
      tokens.forEach(queryToken => {
        if (token.startsWith(queryToken) && token !== queryToken) {
          suggestions.push(token);
        }
      });
    });
    
    return suggestions.slice(0, 5);
  }
  
  private expandQuery(text: string): string[] {
    const tokens = this.tokenize(text);
    const expanded = [...tokens];
    
    // Add synonyms (simplified - would use proper thesaurus)
    const synonyms: Record<string, string[]> = {
      'create': ['make', 'build', 'generate'],
      'delete': ['remove', 'destroy', 'erase'],
      'find': ['search', 'locate', 'discover'],
    };
    
    tokens.forEach(token => {
      if (synonyms[token]) {
        expanded.push(...synonyms[token]);
      }
    });
    
    return expanded;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get index statistics
   */
  getStats(): {
    total_documents: number;
    documents_by_type: Record<string, number>;
    documents_by_sphere: Record<string, number>;
    unique_tokens: number;
  } {
    const docsByType: Record<string, number> = {};
    this.typeIndices.forEach((ids, type) => {
      docsByType[type] = ids.size;
    });
    
    const docsBySphere: Record<string, number> = {};
    this.sphereIndices.forEach((ids, sphere) => {
      docsBySphere[sphere] = ids.size;
    });
    
    return {
      total_documents: this.indices.size,
      documents_by_type: docsByType,
      documents_by_sphere: docsBySphere,
      unique_tokens: this.invertedIndex.size,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default SearchEngine;
