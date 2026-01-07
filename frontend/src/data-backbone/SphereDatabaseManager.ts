// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — SPHERE DATABASE MANAGER
// Manages per-sphere data storage with isolation and permission controls
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  SphereId,
  SphereDatabase,
  SphereDatabaseMeta,
  SphereRecord,
  VisibilityLevel,
  EncryptionLevel,
  RetentionPolicy,
} from "./DataBackboneCore";

/* =========================================================
1. SPHERE DATABASE MANAGER
========================================================= */

export class SphereDatabaseManager<T = unknown> {
  private databases: Map<SphereId, SphereDatabase<T>> = new Map();
  private listeners: Map<SphereId, Set<() => void>> = new Map();

  /**
   * Create a new sphere database
   */
  createSphere(
    sphereId: SphereId,
    ownerUserId: string,
    options?: {
      displayName?: string;
      description?: string;
      visibility?: VisibilityLevel;
      encryptionLevel?: EncryptionLevel;
      retentionPolicy?: RetentionPolicy;
    }
  ): SphereDatabase<T> {
    if (this.databases.has(sphereId)) {
      throw new Error(`Sphere ${sphereId} already exists`);
    }

    const now = Date.now();
    const db: SphereDatabase<T> = {
      meta: {
        sphereId,
        ownerUserId,
        displayName: options?.displayName || sphereId,
        description: options?.description,
        visibility: options?.visibility || "private",
        encryptionLevel: options?.encryptionLevel || "none",
        retentionPolicy: options?.retentionPolicy || "long_term",
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
      records: new Map(),
    };

    this.databases.set(sphereId, db);
    this.listeners.set(sphereId, new Set());

    return db;
  }

  /**
   * Get a sphere database
   */
  getSphere(sphereId: SphereId): SphereDatabase<T> | undefined {
    return this.databases.get(sphereId);
  }

  /**
   * Check if sphere exists
   */
  hasSphere(sphereId: SphereId): boolean {
    return this.databases.has(sphereId);
  }

  /**
   * Get all sphere IDs
   */
  getAllSphereIds(): SphereId[] {
    return Array.from(this.databases.keys());
  }

  /**
   * Get all sphere metadata
   */
  getAllSphereMeta(): SphereDatabaseMeta[] {
    return Array.from(this.databases.values()).map((db) => db.meta);
  }

  /**
   * Update sphere metadata
   */
  updateSphereMeta(
    sphereId: SphereId,
    updates: Partial<Omit<SphereDatabaseMeta, "sphereId" | "createdAt">>
  ): boolean {
    const db = this.databases.get(sphereId);
    if (!db) return false;

    db.meta = {
      ...db.meta,
      ...updates,
      updatedAt: Date.now(),
      version: db.meta.version + 1,
    };

    this.notify(sphereId);
    return true;
  }

  /**
   * Delete a sphere (with all records)
   */
  deleteSphere(sphereId: SphereId): boolean {
    const deleted = this.databases.delete(sphereId);
    if (deleted) {
      this.listeners.delete(sphereId);
    }
    return deleted;
  }

  /* ==============================
   * RECORD OPERATIONS
   * ============================== */

  /**
   * Create a record in a sphere
   */
  createRecord(
    sphereId: SphereId,
    authorId: string,
    data: T,
    options?: {
      authorType?: "user" | "agent" | "system";
      tags?: string[];
      sensitivity?: "public" | "private" | "restricted";
      expiresAt?: number;
    }
  ): SphereRecord<T> | null {
    const db = this.databases.get(sphereId);
    if (!db) return null;

    const now = Date.now();
    const record: SphereRecord<T> = {
      id: `rec_${sphereId}_${now}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      authorId,
      authorType: options?.authorType || "user",
      data,
      tags: options?.tags,
      sensitivity: options?.sensitivity || "private",
      expiresAt: options?.expiresAt,
    };

    db.records.set(record.id, record);
    db.meta.updatedAt = now;

    this.notify(sphereId);
    return record;
  }

  /**
   * Get a record by ID
   */
  getRecord(sphereId: SphereId, recordId: string): SphereRecord<T> | undefined {
    const db = this.databases.get(sphereId);
    return db?.records.get(recordId);
  }

  /**
   * Update a record
   */
  updateRecord(
    sphereId: SphereId,
    recordId: string,
    updates: Partial<Pick<SphereRecord<T>, "data" | "tags" | "sensitivity" | "expiresAt">>
  ): boolean {
    const db = this.databases.get(sphereId);
    if (!db) return false;

    const record = db.records.get(recordId);
    if (!record) return false;

    const updated: SphereRecord<T> = {
      ...record,
      ...updates,
      updatedAt: Date.now(),
    };

    db.records.set(recordId, updated);
    db.meta.updatedAt = Date.now();

    this.notify(sphereId);
    return true;
  }

  /**
   * Delete a record
   */
  deleteRecord(sphereId: SphereId, recordId: string): boolean {
    const db = this.databases.get(sphereId);
    if (!db) return false;

    const deleted = db.records.delete(recordId);
    if (deleted) {
      db.meta.updatedAt = Date.now();
      this.notify(sphereId);
    }
    return deleted;
  }

  /**
   * Get all records in a sphere
   */
  getAllRecords(sphereId: SphereId): SphereRecord<T>[] {
    const db = this.databases.get(sphereId);
    if (!db) return [];
    return Array.from(db.records.values());
  }

  /**
   * Query records by tags
   */
  queryByTags(sphereId: SphereId, tags: string[]): SphereRecord<T>[] {
    const db = this.databases.get(sphereId);
    if (!db) return [];

    return Array.from(db.records.values()).filter((record) => {
      if (!record.tags) return false;
      return tags.some((tag) => record.tags?.includes(tag));
    });
  }

  /**
   * Query records by date range
   */
  queryByDateRange(
    sphereId: SphereId,
    from: number,
    to: number
  ): SphereRecord<T>[] {
    const db = this.databases.get(sphereId);
    if (!db) return [];

    return Array.from(db.records.values()).filter(
      (record) => record.createdAt >= from && record.createdAt <= to
    );
  }

  /**
   * Get expired records (for cleanup)
   */
  getExpiredRecords(sphereId: SphereId): SphereRecord<T>[] {
    const db = this.databases.get(sphereId);
    if (!db) return [];

    const now = Date.now();
    return Array.from(db.records.values()).filter(
      (record) => record.expiresAt && record.expiresAt < now
    );
  }

  /**
   * Clean up expired records
   */
  cleanupExpired(sphereId: SphereId): number {
    const expired = this.getExpiredRecords(sphereId);
    expired.forEach((record) => this.deleteRecord(sphereId, record.id));
    return expired.length;
  }

  /* ==============================
   * CROSS-SPHERE OPERATIONS
   * ============================== */

  /**
   * Search across multiple spheres
   */
  searchAcrossSpheres(
    sphereIds: SphereId[],
    predicate: (record: SphereRecord<T>) => boolean
  ): Array<{ sphereId: SphereId; record: SphereRecord<T> }> {
    const results: Array<{ sphereId: SphereId; record: SphereRecord<T> }> = [];

    sphereIds.forEach((sphereId) => {
      const db = this.databases.get(sphereId);
      if (!db) return;

      db.records.forEach((record) => {
        if (predicate(record)) {
          results.push({ sphereId, record });
        }
      });
    });

    return results;
  }

  /**
   * Get statistics across all spheres
   */
  getGlobalStats(): {
    totalSpheres: number;
    totalRecords: number;
    recordsBySphere: Record<string, number>;
    visibilityBreakdown: Record<VisibilityLevel, number>;
  } {
    const recordsBySphere: Record<string, number> = {};
    const visibilityBreakdown: Record<VisibilityLevel, number> = {
      private: 0,
      shared: 0,
      public: 0,
    };

    let totalRecords = 0;

    this.databases.forEach((db, sphereId) => {
      const count = db.records.size;
      recordsBySphere[sphereId] = count;
      totalRecords += count;
      visibilityBreakdown[db.meta.visibility]++;
    });

    return {
      totalSpheres: this.databases.size,
      totalRecords,
      recordsBySphere,
      visibilityBreakdown,
    };
  }

  /* ==============================
   * SUBSCRIPTION
   * ============================== */

  /**
   * Subscribe to sphere changes
   */
  subscribe(sphereId: SphereId, listener: () => void): () => void {
    if (!this.listeners.has(sphereId)) {
      this.listeners.set(sphereId, new Set());
    }
    this.listeners.get(sphereId)!.add(listener);

    return () => {
      this.listeners.get(sphereId)?.delete(listener);
    };
  }

  private notify(sphereId: SphereId): void {
    this.listeners.get(sphereId)?.forEach((l) => l());
  }

  /* ==============================
   * EXPORT / IMPORT
   * ============================== */

  /**
   * Export sphere data (for backup)
   */
  exportSphere(sphereId: SphereId): { meta: SphereDatabaseMeta; records: SphereRecord<T>[] } | null {
    const db = this.databases.get(sphereId);
    if (!db) return null;

    return {
      meta: { ...db.meta },
      records: Array.from(db.records.values()),
    };
  }

  /**
   * Import sphere data (from backup)
   */
  importSphere(data: { meta: SphereDatabaseMeta; records: SphereRecord<T>[] }): boolean {
    const { meta, records } = data;

    if (this.databases.has(meta.sphereId)) {
      return false; // Already exists
    }

    const db: SphereDatabase<T> = {
      meta: { ...meta, updatedAt: Date.now() },
      records: new Map(),
    };

    records.forEach((record) => {
      db.records.set(record.id, record);
    });

    this.databases.set(meta.sphereId, db);
    this.listeners.set(meta.sphereId, new Set());

    return true;
  }

  /**
   * Export all spheres
   */
  exportAll(): Array<{ meta: SphereDatabaseMeta; records: SphereRecord<T>[] }> {
    return this.getAllSphereIds()
      .map((id) => this.exportSphere(id))
      .filter((data): data is NonNullable<typeof data> => data !== null);
  }
}

/* =========================================================
2. EXPORTS
========================================================= */

export default SphereDatabaseManager;
