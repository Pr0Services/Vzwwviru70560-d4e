/**
 * CHE·NU™ Conflict Resolver
 * 
 * Handles conflicts between local and server data.
 * Implements last-write-wins with user notification and manual resolution option.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import { 
  indexedDBService, 
  STORES,
  OfflineThread,
  OfflineMessage,
  OfflineQuickCapture
} from './indexeddb.service';

// Types
export type ConflictEntity = OfflineThread | OfflineMessage | OfflineQuickCapture;

export interface ConflictInfo<T = ConflictEntity> {
  id: string;
  entityId: string;
  entityType: 'thread' | 'message' | 'quick_capture';
  localData: T;
  serverData: T;
  localVersion: number;
  serverVersion: number;
  localUpdatedAt: string;
  serverUpdatedAt: string;
  conflictFields: string[];
  detectedAt: string;
  status: 'pending' | 'resolved_local' | 'resolved_server' | 'resolved_merged';
}

export type ResolutionStrategy = 'local' | 'server' | 'merge';

export interface MergeResult<T> {
  merged: T;
  conflicts: string[];
}

export interface ConflictResolutionResult {
  success: boolean;
  resolution: ResolutionStrategy;
  finalData: ConflictEntity;
  error?: string;
}

// Conflict store (in-memory for quick access)
const conflictStore: Map<string, ConflictInfo> = new Map();

// Event callbacks
type ConflictCallback = (conflict: ConflictInfo) => void;
const conflictCallbacks: ConflictCallback[] = [];

class ConflictResolver {
  /**
   * Subscribe to conflict events
   */
  onConflict(callback: ConflictCallback): () => void {
    conflictCallbacks.push(callback);
    return () => {
      const index = conflictCallbacks.indexOf(callback);
      if (index > -1) {
        conflictCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify callbacks of a conflict
   */
  private notifyConflict(conflict: ConflictInfo): void {
    conflictCallbacks.forEach(cb => cb(conflict));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Detect conflict between local and server data
   */
  detectConflict<T extends ConflictEntity>(
    entityType: 'thread' | 'message' | 'quick_capture',
    localData: T,
    serverData: T
  ): ConflictInfo<T> | null {
    // Get versions
    const localVersion = this.getVersion(localData);
    const serverVersion = this.getVersion(serverData);

    // No conflict if server is ahead and local has no pending changes
    if (serverVersion > localVersion && localData.syncStatus === 'synced') {
      return null;
    }

    // No conflict if local is current with server
    if (localVersion === serverVersion) {
      return null;
    }

    // Detect conflicting fields
    const conflictFields = this.detectConflictingFields(localData, serverData);

    // If no actual field conflicts, no conflict
    if (conflictFields.length === 0) {
      return null;
    }

    const conflict: ConflictInfo<T> = {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      entityId: localData.id || localData.localId,
      entityType,
      localData,
      serverData,
      localVersion,
      serverVersion,
      localUpdatedAt: localData.updatedAt || localData.createdAt,
      serverUpdatedAt: serverData.updatedAt || serverData.createdAt,
      conflictFields,
      detectedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store conflict
    conflictStore.set(conflict.id, conflict as ConflictInfo);

    // Notify listeners
    this.notifyConflict(conflict as ConflictInfo);

    console.log(`[ConflictResolver] Conflict detected: ${conflict.id}`, {
      entityType,
      entityId: conflict.entityId,
      fields: conflictFields,
    });

    return conflict;
  }

  /**
   * Get version from entity
   */
  private getVersion(entity: ConflictEntity): number {
    return (entity as OfflineThread).localVersion || 
           (entity as OfflineThread).serverVersion || 
           0;
  }

  /**
   * Detect which fields have conflicting values
   */
  private detectConflictingFields<T extends ConflictEntity>(
    local: T,
    server: T
  ): string[] {
    const conflicts: string[] = [];
    const ignoreFields = ['localId', 'syncStatus', 'localVersion', 'serverVersion'];

    // Get all keys from both objects
    const allKeys = new Set([
      ...Object.keys(local),
      ...Object.keys(server),
    ]);

    for (const key of allKeys) {
      if (ignoreFields.includes(key)) continue;

      const localValue = (local as Record<string, unknown>)[key];
      const serverValue = (server as Record<string, unknown>)[key];

      // Skip if values are equal
      if (JSON.stringify(localValue) === JSON.stringify(serverValue)) {
        continue;
      }

      // Skip if only local has value (new field)
      if (localValue !== undefined && serverValue === undefined) {
        continue;
      }

      // Conflict detected
      conflicts.push(key);
    }

    return conflicts;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT RESOLUTION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Resolve conflict using specified strategy
   */
  async resolve(
    conflictId: string,
    strategy: ResolutionStrategy,
    customMerge?: ConflictEntity
  ): Promise<ConflictResolutionResult> {
    const conflict = conflictStore.get(conflictId);
    if (!conflict) {
      return {
        success: false,
        resolution: strategy,
        finalData: {} as ConflictEntity,
        error: 'Conflict not found',
      };
    }

    try {
      let finalData: ConflictEntity;

      switch (strategy) {
        case 'local':
          finalData = await this.resolveWithLocal(conflict);
          conflict.status = 'resolved_local';
          break;
        case 'server':
          finalData = await this.resolveWithServer(conflict);
          conflict.status = 'resolved_server';
          break;
        case 'merge':
          if (customMerge) {
            finalData = customMerge;
          } else {
            const merged = this.autoMerge(conflict.localData, conflict.serverData);
            finalData = merged.merged;
          }
          conflict.status = 'resolved_merged';
          break;
        default:
          throw new Error(`Unknown resolution strategy: ${strategy}`);
      }

      // Remove from conflict store
      conflictStore.delete(conflictId);

      console.log(`[ConflictResolver] Resolved conflict ${conflictId} with strategy: ${strategy}`);

      return {
        success: true,
        resolution: strategy,
        finalData,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ConflictResolver] Failed to resolve ${conflictId}:`, errorMessage);

      return {
        success: false,
        resolution: strategy,
        finalData: {} as ConflictEntity,
        error: errorMessage,
      };
    }
  }

  /**
   * Resolve using local data (discard server changes)
   */
  private async resolveWithLocal(conflict: ConflictInfo): Promise<ConflictEntity> {
    const { entityType, localData } = conflict;
    const store = this.getStoreForType(entityType);

    // Update local data with incremented version
    const updated = {
      ...localData,
      localVersion: conflict.serverVersion + 1,
      syncStatus: 'pending' as const,
    };

    await indexedDBService.put(store, updated);
    return updated;
  }

  /**
   * Resolve using server data (discard local changes)
   */
  private async resolveWithServer(conflict: ConflictInfo): Promise<ConflictEntity> {
    const { entityType, localData, serverData } = conflict;
    const store = this.getStoreForType(entityType);

    // Update local with server data
    const updated = {
      ...serverData,
      localId: localData.localId,
      localVersion: conflict.serverVersion,
      syncStatus: 'synced' as const,
    };

    await indexedDBService.put(store, updated);
    return updated;
  }

  /**
   * Auto-merge data (last-write-wins per field)
   */
  autoMerge<T extends ConflictEntity>(local: T, server: T): MergeResult<T> {
    const merged = { ...server } as T;
    const conflicts: string[] = [];

    const localTime = new Date(local.updatedAt || local.createdAt).getTime();
    const serverTime = new Date(server.updatedAt || server.createdAt).getTime();

    // If local is newer overall, prefer local for conflicting fields
    if (localTime > serverTime) {
      Object.keys(local).forEach(key => {
        if (key === 'localId' || key === 'syncStatus') return;

        const localValue = (local as Record<string, unknown>)[key];
        const serverValue = (server as Record<string, unknown>)[key];

        if (JSON.stringify(localValue) !== JSON.stringify(serverValue)) {
          (merged as Record<string, unknown>)[key] = localValue;
          conflicts.push(key);
        }
      });
    }

    return { merged, conflicts };
  }

  /**
   * Get store name for entity type
   */
  private getStoreForType(entityType: 'thread' | 'message' | 'quick_capture'): string {
    const storeMap = {
      thread: STORES.THREADS,
      message: STORES.MESSAGES,
      quick_capture: STORES.QUICK_CAPTURES,
    };
    return storeMap[entityType];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get all pending conflicts
   */
  getPendingConflicts(): ConflictInfo[] {
    return Array.from(conflictStore.values())
      .filter(c => c.status === 'pending');
  }

  /**
   * Get conflict by ID
   */
  getConflict(conflictId: string): ConflictInfo | undefined {
    return conflictStore.get(conflictId);
  }

  /**
   * Check if entity has conflicts
   */
  hasConflicts(entityId: string): boolean {
    return Array.from(conflictStore.values())
      .some(c => c.entityId === entityId && c.status === 'pending');
  }

  /**
   * Get conflicts for entity
   */
  getConflictsForEntity(entityId: string): ConflictInfo[] {
    return Array.from(conflictStore.values())
      .filter(c => c.entityId === entityId);
  }

  /**
   * Clear all conflicts
   */
  clearConflicts(): void {
    conflictStore.clear();
  }

  /**
   * Resolve all conflicts with a default strategy
   */
  async resolveAll(strategy: ResolutionStrategy): Promise<number> {
    const pending = this.getPendingConflicts();
    let resolved = 0;

    for (const conflict of pending) {
      const result = await this.resolve(conflict.id, strategy);
      if (result.success) {
        resolved++;
      }
    }

    return resolved;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Create a conflict preview (for UI display)
   */
  createConflictPreview(conflict: ConflictInfo): {
    field: string;
    localValue: unknown;
    serverValue: unknown;
  }[] {
    return conflict.conflictFields.map(field => ({
      field,
      localValue: (conflict.localData as Record<string, unknown>)[field],
      serverValue: (conflict.serverData as Record<string, unknown>)[field],
    }));
  }

  /**
   * Get conflict statistics
   */
  getStats(): {
    total: number;
    pending: number;
    resolved: number;
    byType: Record<string, number>;
  } {
    const all = Array.from(conflictStore.values());
    const byType: Record<string, number> = {};

    all.forEach(c => {
      byType[c.entityType] = (byType[c.entityType] || 0) + 1;
    });

    return {
      total: all.length,
      pending: all.filter(c => c.status === 'pending').length,
      resolved: all.filter(c => c.status !== 'pending').length,
      byType,
    };
  }
}

// Export singleton instance
export const conflictResolver = new ConflictResolver();
export default conflictResolver;
