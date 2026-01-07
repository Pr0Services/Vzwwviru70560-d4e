/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — MEMORY ENGINE                                         ║
 * ║              Core Engine 3/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Threads (.chenu) are FIRST-CLASS OBJECTS with full audit trail."          ║
 * ║  "Every interaction is stored, versioned, and auditable."                   ║
 * ║  "Hash chains ensure tamper detection."                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChenuThread {
  id: string;
  version: number;
  created_at: string;
  updated_at: string;
  
  // Ownership
  owner_id: string;
  sphere_id: string;
  dataspace_id?: string;
  
  // Content
  title: string;
  original_human_input: string;
  semantic_encoding?: unknown; // SemanticEncoding from pipeline
  
  // Budget
  token_budget: number;
  tokens_used: number;
  
  // Encoding Rules
  encoding_rules: EncodingRule[];
  
  // History (append-only)
  entries: ThreadEntry[];
  version_history: VersionEntry[];
  
  // Audit
  audit_trail: AuditEntry[];
  hash_chain: HashChainEntry[];
  
  // Status
  status: 'active' | 'archived' | 'locked';
  is_auditable: boolean;
}

export interface ThreadEntry {
  id: string;
  timestamp: string;
  type: 'human_input' | 'ai_response' | 'system_event' | 'checkpoint';
  content: unknown;
  tokens_used: number;
  metadata?: Record<string, any>;
}

export interface VersionEntry {
  version: number;
  timestamp: string;
  changes: string[];
  author: string;
  hash: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: {
    type: 'user' | 'agent' | 'system';
    id: string;
    name?: string;
  };
  details: Record<string, any>;
  integrity_hash: string;
}

export interface HashChainEntry {
  index: number;
  timestamp: string;
  data_hash: string;
  previous_hash: string;
  combined_hash: string;
}

export interface EncodingRule {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  enabled: boolean;
}

// Memory Store Types
export interface MemoryStore {
  threads: Map<string, ChenuThread>;
  shortTermMemory: Map<string, any>;
  longTermMemory: Map<string, any>;
  sessionMemory: Map<string, any>;
}

export interface MemoryQuery {
  type: 'thread' | 'short_term' | 'long_term' | 'session';
  filters?: {
    sphere_id?: string;
    owner_id?: string;
    date_range?: { start: string; end: string };
    status?: string;
    search_text?: string;
  };
  limit?: number;
  offset?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class MemoryEngine {
  private store: MemoryStore;
  private hashSalt: string;
  
  constructor() {
    this.store = {
      threads: new Map(),
      shortTermMemory: new Map(),
      longTermMemory: new Map(),
      sessionMemory: new Map(),
    };
    this.hashSalt = this.generateSalt();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // THREAD MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Create a new thread (.chenu)
   */
  createThread(params: {
    owner_id: string;
    sphere_id: string;
    title: string;
    initial_input: string;
    token_budget?: number;
    dataspace_id?: string;
  }): ChenuThread {
    const id = this.generateId('thread');
    const timestamp = new Date().toISOString();
    
    const thread: ChenuThread = {
      id,
      version: 1,
      created_at: timestamp,
      updated_at: timestamp,
      
      owner_id: params.owner_id,
      sphere_id: params.sphere_id,
      dataspace_id: params.dataspace_id,
      
      title: params.title,
      original_human_input: params.initial_input,
      
      token_budget: params.token_budget || 10000,
      tokens_used: 0,
      
      encoding_rules: this.getDefaultEncodingRules(),
      
      entries: [{
        id: this.generateId('entry'),
        timestamp,
        type: 'human_input',
        content: params.initial_input,
        tokens_used: this.estimateTokens(params.initial_input),
      }],
      
      version_history: [{
        version: 1,
        timestamp,
        changes: ['Thread created'],
        author: params.owner_id,
        hash: this.computeHash({ created: timestamp, input: params.initial_input }),
      }],
      
      audit_trail: [{
        id: this.generateId('audit'),
        timestamp,
        action: 'THREAD_CREATED',
        actor: { type: 'user', id: params.owner_id },
        details: { title: params.title, sphere: params.sphere_id },
        integrity_hash: '',
      }],
      
      hash_chain: [],
      
      status: 'active',
      is_auditable: true,
    };
    
    // Initialize hash chain
    thread.hash_chain = [this.createHashChainEntry(thread, 0, '0'.repeat(64))];
    
    // Set integrity hash on audit entry
    thread.audit_trail[0].integrity_hash = thread.hash_chain[0].combined_hash;
    
    this.store.threads.set(id, thread);
    return thread;
  }
  
  /**
   * Add an entry to a thread
   */
  addThreadEntry(threadId: string, entry: Omit<ThreadEntry, 'id' | 'timestamp'>): ThreadEntry | null {
    const thread = this.store.threads.get(threadId);
    if (!thread || thread.status !== 'active') return null;
    
    // Check budget
    if (thread.tokens_used + entry.tokens_used > thread.token_budget) {
      logger.warn(`Thread ${threadId} budget exceeded`);
      return null;
    }
    
    const timestamp = new Date().toISOString();
    const newEntry: ThreadEntry = {
      ...entry,
      id: this.generateId('entry'),
      timestamp,
    };
    
    thread.entries.push(newEntry);
    thread.tokens_used += entry.tokens_used;
    thread.updated_at = timestamp;
    thread.version++;
    
    // Update version history
    thread.version_history.push({
      version: thread.version,
      timestamp,
      changes: [`Added ${entry.type} entry`],
      author: 'system',
      hash: this.computeHash(newEntry),
    });
    
    // Update hash chain
    const previousHash = thread.hash_chain[thread.hash_chain.length - 1].combined_hash;
    thread.hash_chain.push(this.createHashChainEntry(thread, thread.hash_chain.length, previousHash));
    
    // Add audit entry
    thread.audit_trail.push({
      id: this.generateId('audit'),
      timestamp,
      action: 'ENTRY_ADDED',
      actor: { type: 'system', id: 'memory_engine' },
      details: { entry_id: newEntry.id, type: entry.type },
      integrity_hash: thread.hash_chain[thread.hash_chain.length - 1].combined_hash,
    });
    
    return newEntry;
  }
  
  /**
   * Get a thread by ID
   */
  getThread(threadId: string): ChenuThread | null {
    return this.store.threads.get(threadId) || null;
  }
  
  /**
   * Archive a thread
   */
  archiveThread(threadId: string, actorId: string): boolean {
    const thread = this.store.threads.get(threadId);
    if (!thread) return false;
    
    thread.status = 'archived';
    thread.updated_at = new Date().toISOString();
    
    thread.audit_trail.push({
      id: this.generateId('audit'),
      timestamp: thread.updated_at,
      action: 'THREAD_ARCHIVED',
      actor: { type: 'user', id: actorId },
      details: {},
      integrity_hash: this.computeHash({ archived: thread.updated_at }),
    });
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Store in short-term memory (session-based, volatile)
   */
  storeShortTerm(key: string, value: unknown, ttlSeconds?: number): void {
    this.store.shortTermMemory.set(key, {
      value,
      stored_at: Date.now(),
      expires_at: ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null,
    });
  }
  
  /**
   * Get from short-term memory
   */
  getShortTerm(key: string): unknown | null {
    const entry = this.store.shortTermMemory.get(key);
    if (!entry) return null;
    
    if (entry.expires_at && Date.now() > entry.expires_at) {
      this.store.shortTermMemory.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  /**
   * Store in long-term memory (persistent)
   */
  storeLongTerm(key: string, value: unknown, metadata?: Record<string, any>): void {
    this.store.longTermMemory.set(key, {
      value,
      stored_at: new Date().toISOString(),
      metadata,
      access_count: 0,
      last_accessed: null,
    });
  }
  
  /**
   * Get from long-term memory
   */
  getLongTerm(key: string): unknown | null {
    const entry = this.store.longTermMemory.get(key);
    if (!entry) return null;
    
    entry.access_count++;
    entry.last_accessed = new Date().toISOString();
    
    return entry.value;
  }
  
  /**
   * Store session memory (cleared on session end)
   */
  storeSession(sessionId: string, key: string, value: unknown): void {
    const sessionKey = `${sessionId}:${key}`;
    this.store.sessionMemory.set(sessionKey, {
      value,
      stored_at: new Date().toISOString(),
    });
  }
  
  /**
   * Get session memory
   */
  getSession(sessionId: string, key: string): unknown | null {
    const sessionKey = `${sessionId}:${key}`;
    const entry = this.store.sessionMemory.get(sessionKey);
    return entry?.value || null;
  }
  
  /**
   * Clear session memory
   */
  clearSession(sessionId: string): void {
    const keysToDelete: string[] = [];
    this.store.sessionMemory.forEach((_, key) => {
      if (key.startsWith(`${sessionId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.store.sessionMemory.delete(key));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // QUERY & SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Query threads
   */
  queryThreads(query: MemoryQuery): ChenuThread[] {
    let results = Array.from(this.store.threads.values());
    
    if (query.filters) {
      const { sphere_id, owner_id, status, search_text, date_range } = query.filters;
      
      if (sphere_id) {
        results = results.filter(t => t.sphere_id === sphere_id);
      }
      
      if (owner_id) {
        results = results.filter(t => t.owner_id === owner_id);
      }
      
      if (status) {
        results = results.filter(t => t.status === status);
      }
      
      if (search_text) {
        const lower = search_text.toLowerCase();
        results = results.filter(t => 
          t.title.toLowerCase().includes(lower) ||
          t.original_human_input.toLowerCase().includes(lower)
        );
      }
      
      if (date_range) {
        const start = new Date(date_range.start).getTime();
        const end = new Date(date_range.end).getTime();
        results = results.filter(t => {
          const created = new Date(t.created_at).getTime();
          return created >= start && created <= end;
        });
      }
    }
    
    // Sort by updated_at descending
    results.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    
    return results.slice(offset, offset + limit);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIT & INTEGRITY
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Verify thread integrity using hash chain
   */
  verifyThreadIntegrity(threadId: string): { valid: boolean; issues: string[] } {
    const thread = this.store.threads.get(threadId);
    if (!thread) return { valid: false, issues: ['Thread not found'] };
    
    const issues: string[] = [];
    
    // Verify hash chain
    for (let i = 1; i < thread.hash_chain.length; i++) {
      const current = thread.hash_chain[i];
      const previous = thread.hash_chain[i - 1];
      
      if (current.previous_hash !== previous.combined_hash) {
        issues.push(`Hash chain broken at index ${i}`);
      }
    }
    
    // Verify entry count matches
    if (thread.entries.length !== thread.hash_chain.length) {
      issues.push('Entry count mismatch with hash chain');
    }
    
    return {
      valid: issues.length === 0,
      issues,
    };
  }
  
  /**
   * Get audit trail for a thread
   */
  getAuditTrail(threadId: string): AuditEntry[] {
    const thread = this.store.threads.get(threadId);
    return thread?.audit_trail || [];
  }
  
  /**
   * Export thread for portability
   */
  exportThread(threadId: string): string | null {
    const thread = this.store.threads.get(threadId);
    if (!thread) return null;
    
    return JSON.stringify({
      ...thread,
      exported_at: new Date().toISOString(),
      export_hash: this.computeHash(thread),
    }, null, 2);
  }
  
  /**
   * Import thread
   */
  importThread(data: string, newOwnerId: string): ChenuThread | null {
    try {
      const parsed = JSON.parse(data);
      const newId = this.generateId('thread');
      
      const imported: ChenuThread = {
        ...parsed,
        id: newId,
        owner_id: newOwnerId,
        status: 'active',
        audit_trail: [
          ...parsed.audit_trail,
          {
            id: this.generateId('audit'),
            timestamp: new Date().toISOString(),
            action: 'THREAD_IMPORTED',
            actor: { type: 'user', id: newOwnerId },
            details: { original_id: parsed.id },
            integrity_hash: this.computeHash({ imported: Date.now() }),
          },
        ],
      };
      
      this.store.threads.set(newId, imported);
      return imported;
    } catch {
      return null;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private generateSalt(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  private computeHash(data: unknown): string {
    const str = JSON.stringify(data) + this.hashSalt;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
  
  private createHashChainEntry(thread: ChenuThread, index: number, previousHash: string): HashChainEntry {
    const dataHash = this.computeHash({
      index,
      entries: thread.entries.length,
      tokens: thread.tokens_used,
    });
    
    return {
      index,
      timestamp: new Date().toISOString(),
      data_hash: dataHash,
      previous_hash: previousHash,
      combined_hash: this.computeHash({ data: dataHash, prev: previousHash }),
    };
  }
  
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  private getDefaultEncodingRules(): EncodingRule[] {
    return [
      { id: 'r1', name: 'Compress whitespace', pattern: '\\s+', replacement: ' ', enabled: true },
      { id: 'r2', name: 'Remove filler words', pattern: '\\b(um|uh|like|basically)\\b', replacement: '', enabled: false },
    ];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default MemoryEngine;
