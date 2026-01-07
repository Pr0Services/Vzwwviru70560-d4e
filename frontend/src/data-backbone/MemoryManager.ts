// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — MEMORY MANAGER
// Manages unified memory layers across spheres with proper guards
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  SphereId,
  MemoryLayer,
  MemoryEntry,
  MemoryIndex,
  MemoryIndexPointer,
  AccessContext,
  AgentMemoryQuery,
  AgentMemoryResponse,
  DecisionTrace,
  DecisionLedger,
  RetentionRule,
} from "./DataBackboneCore";

import {
  canAccessMemory,
  queryMemoryForAgent,
  getExpiredEntries,
  DEFAULT_RETENTION_RULES,
} from "./DataBackboneCore";

/* =========================================================
1. MEMORY MANAGER CLASS
========================================================= */

export class MemoryManager {
  private entries: Map<string, MemoryEntry> = new Map();
  private index: MemoryIndex = { pointers: [], version: 0, lastUpdated: Date.now() };
  private decisionLedger: DecisionLedger = { traces: [], version: 0, lastUpdated: Date.now() };
  private retentionRules: RetentionRule[] = [...DEFAULT_RETENTION_RULES];
  private listeners: Set<() => void> = new Set();

  /* ==============================
   * ENTRY MANAGEMENT
   * ============================== */

  /**
   * Add a memory entry
   */
  addEntry(entry: Omit<MemoryEntry, "id" | "version">): MemoryEntry {
    const id = `mem_${entry.layer}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullEntry: MemoryEntry = {
      ...entry,
      id,
      version: 1,
    };

    this.entries.set(id, fullEntry);
    this.updateIndex(fullEntry, "add");
    this.notify();

    return fullEntry;
  }

  /**
   * Get an entry by ID
   */
  getEntry(id: string): MemoryEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Update an entry
   */
  updateEntry(
    id: string,
    updates: Partial<Pick<MemoryEntry, "content" | "relatedEntityIds" | "sensitivity" | "ttl">>
  ): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;

    const updated: MemoryEntry = {
      ...entry,
      ...updates,
      version: entry.version + 1,
    };

    this.entries.set(id, updated);
    this.updateIndex(updated, "update");
    this.notify();

    return true;
  }

  /**
   * Delete an entry
   */
  deleteEntry(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;

    this.entries.delete(id);
    this.updateIndex(entry, "delete");
    this.notify();

    return true;
  }

  /**
   * Get all entries
   */
  getAllEntries(): MemoryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get entries by layer
   */
  getEntriesByLayer(layer: MemoryLayer): MemoryEntry[] {
    return Array.from(this.entries.values()).filter((e) => e.layer === layer);
  }

  /**
   * Get entries by sphere
   */
  getEntriesBySphere(sphereId: SphereId): MemoryEntry[] {
    return Array.from(this.entries.values()).filter((e) => e.sphereId === sphereId);
  }

  /* ==============================
   * INDEX MANAGEMENT
   * ============================== */

  private updateIndex(entry: MemoryEntry, action: "add" | "update" | "delete"): void {
    if (action === "delete") {
      this.index.pointers = this.index.pointers.filter((p) => p.entryId !== entry.id);
    } else if (action === "add") {
      const pointer: MemoryIndexPointer = {
        entryId: entry.id,
        sourceSphere: entry.sphereId,
        layer: entry.layer,
        sensitivity: entry.sensitivity,
        permissions: this.derivePermissions(entry),
        lastAccessed: Date.now(),
      };
      this.index.pointers.push(pointer);
    } else {
      const existing = this.index.pointers.find((p) => p.entryId === entry.id);
      if (existing) {
        existing.sensitivity = entry.sensitivity;
        existing.permissions = this.derivePermissions(entry);
        existing.lastAccessed = Date.now();
      }
    }

    this.index.version++;
    this.index.lastUpdated = Date.now();
  }

  /**
   * Derive permissions from entry
   */
  private derivePermissions(entry: MemoryEntry): string[] {
    const permissions: string[] = [];

    // Author always has permission
    if (entry.authorId) {
      permissions.push(entry.authorId);
    }

    // Public = everyone
    if (entry.sensitivity === "public") {
      permissions.push("*");
    }

    // Sphere-based permissions
    if (entry.sphereId) {
      permissions.push(`sphere:${entry.sphereId}`);
    }

    return permissions;
  }

  /**
   * Get current index
   */
  getIndex(): MemoryIndex {
    return { ...this.index };
  }

  /**
   * Get index statistics
   */
  getIndexStats(): {
    totalPointers: number;
    byLayer: Record<MemoryLayer, number>;
    bySensitivity: Record<MemoryEntry["sensitivity"], number>;
  } {
    const byLayer: Record<MemoryLayer, number> = {
      sphere_local: 0,
      cross_sphere: 0,
      collective: 0,
      narrative: 0,
      archive: 0,
    };

    const bySensitivity: Record<MemoryEntry["sensitivity"], number> = {
      public: 0,
      private: 0,
      restricted: 0,
    };

    this.index.pointers.forEach((p) => {
      byLayer[p.layer]++;
      bySensitivity[p.sensitivity]++;
    });

    return {
      totalPointers: this.index.pointers.length,
      byLayer,
      bySensitivity,
    };
  }

  /* ==============================
   * AGENT QUERIES (GUARDED)
   * ============================== */

  /**
   * Query memory for an agent (with all guards applied)
   */
  queryForAgent(query: AgentMemoryQuery, ctx: AccessContext): AgentMemoryResponse {
    return queryMemoryForAgent(
      query,
      ctx,
      this.index,
      this.getAllEntries()
    );
  }

  /**
   * Check if agent can access an entry
   */
  canAgentAccess(agentId: string, entryId: string, purpose: AccessContext["purpose"]): boolean {
    const pointer = this.index.pointers.find((p) => p.entryId === entryId);
    if (!pointer) return false;

    const ctx: AccessContext = {
      requesterId: agentId,
      requesterType: "agent",
      purpose,
      timestamp: Date.now(),
    };

    return canAccessMemory(ctx, pointer);
  }

  /* ==============================
   * DECISION LEDGER
   * ============================== */

  /**
   * Add a decision trace
   */
  addDecisionTrace(trace: DecisionTrace): void {
    this.decisionLedger.traces.push(trace);
    this.decisionLedger.version++;
    this.decisionLedger.lastUpdated = Date.now();

    // Also add as narrative memory
    this.addEntry({
      layer: "narrative",
      timestamp: trace.timestamp,
      author: trace.decidedBy === "user" ? "user" : trace.decidedBy === "agent" ? "agent" : "system",
      authorId: trace.agentId,
      content: {
        type: "decision",
        trace,
      },
      contentType: "decision",
      sensitivity: "private",
      sphereId: trace.sphereContext,
    });

    this.notify();
  }

  /**
   * Get all decision traces
   */
  getDecisionTraces(): DecisionTrace[] {
    return [...this.decisionLedger.traces];
  }

  /**
   * Get decision traces by date range
   */
  getDecisionsByDateRange(from: number, to: number): DecisionTrace[] {
    return this.decisionLedger.traces.filter(
      (t) => t.timestamp >= from && t.timestamp <= to
    );
  }

  /**
   * Get decision traces by agent
   */
  getDecisionsByAgent(agentId: string): DecisionTrace[] {
    return this.decisionLedger.traces.filter((t) => t.agentId === agentId);
  }

  /**
   * Get decision traces by sphere
   */
  getDecisionsBySphere(sphereId: SphereId): DecisionTrace[] {
    return this.decisionLedger.traces.filter((t) => t.sphereContext === sphereId);
  }

  /**
   * Get high-impact decisions
   */
  getHighImpactDecisions(): DecisionTrace[] {
    return this.decisionLedger.traces.filter((t) => t.impactLevel === "high");
  }

  /* ==============================
   * RETENTION & CLEANUP
   * ============================== */

  /**
   * Set retention rules
   */
  setRetentionRules(rules: RetentionRule[]): void {
    this.retentionRules = [...rules];
  }

  /**
   * Get entries scheduled for deletion
   */
  getExpiredEntries(): string[] {
    return getExpiredEntries(this.getAllEntries(), this.retentionRules);
  }

  /**
   * Run cleanup (delete expired entries)
   */
  runCleanup(): { deleted: number; ids: string[] } {
    const expiredIds = this.getExpiredEntries();
    expiredIds.forEach((id) => this.deleteEntry(id));

    return {
      deleted: expiredIds.length,
      ids: expiredIds,
    };
  }

  /**
   * Force forget an entry (immediate deletion)
   */
  forceForget(id: string): boolean {
    return this.deleteEntry(id);
  }

  /**
   * Archive old entries (move to archive layer)
   */
  archiveOld(olderThan: number): number {
    const now = Date.now();
    let archived = 0;

    this.entries.forEach((entry) => {
      if (entry.layer !== "archive" && now - entry.timestamp > olderThan) {
        this.updateEntry(entry.id, {});
        // Note: In real implementation, this would move to archive layer
        archived++;
      }
    });

    return archived;
  }

  /* ==============================
   * CROSS-SPHERE LINKING
   * ============================== */

  /**
   * Link entries across spheres
   */
  linkCrossSphere(entryIds: string[], linkReason: string): string | null {
    const entries = entryIds.map((id) => this.entries.get(id)).filter(Boolean) as MemoryEntry[];

    if (entries.length < 2) return null;

    // Create a cross-sphere link entry
    const linkEntry = this.addEntry({
      layer: "cross_sphere",
      timestamp: Date.now(),
      author: "system",
      content: {
        type: "link",
        linkedEntryIds: entryIds,
        reason: linkReason,
      },
      contentType: "reference",
      sensitivity: "restricted",
      relatedEntityIds: entryIds,
      relatedSpheres: entries.map((e) => e.sphereId).filter(Boolean) as SphereId[],
    });

    return linkEntry.id;
  }

  /**
   * Get cross-sphere links for an entry
   */
  getCrossSphereLinks(entryId: string): MemoryEntry[] {
    return Array.from(this.entries.values()).filter(
      (e) =>
        e.layer === "cross_sphere" &&
        e.relatedEntityIds?.includes(entryId)
    );
  }

  /* ==============================
   * SUBSCRIPTION
   * ============================== */

  /**
   * Subscribe to memory changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  /* ==============================
   * EXPORT / IMPORT
   * ============================== */

  /**
   * Export all memory data
   */
  export(): {
    entries: MemoryEntry[];
    index: MemoryIndex;
    decisionLedger: DecisionLedger;
  } {
    return {
      entries: this.getAllEntries(),
      index: this.getIndex(),
      decisionLedger: { ...this.decisionLedger },
    };
  }

  /**
   * Import memory data
   */
  import(data: {
    entries: MemoryEntry[];
    index?: MemoryIndex;
    decisionLedger?: DecisionLedger;
  }): void {
    // Clear existing
    this.entries.clear();
    this.index.pointers = [];

    // Import entries
    data.entries.forEach((entry) => {
      this.entries.set(entry.id, entry);
      this.updateIndex(entry, "add");
    });

    // Import decision ledger if provided
    if (data.decisionLedger) {
      this.decisionLedger = { ...data.decisionLedger };
    }

    this.notify();
  }

  /**
   * Get memory statistics
   */
  getStats(): {
    totalEntries: number;
    totalDecisions: number;
    indexStats: ReturnType<MemoryManager["getIndexStats"]>;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const entries = this.getAllEntries();
    const timestamps = entries.map((e) => e.timestamp);

    return {
      totalEntries: entries.length,
      totalDecisions: this.decisionLedger.traces.length,
      indexStats: this.getIndexStats(),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }
}

/* =========================================================
2. EXPORTS
========================================================= */

export default MemoryManager;
