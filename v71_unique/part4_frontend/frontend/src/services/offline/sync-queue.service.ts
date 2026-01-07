/**
 * CHE·NU™ Sync Queue Service
 * 
 * Manages the queue of pending operations to sync with the server.
 * Handles retry logic, batching, and prioritization.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import { 
  indexedDBService, 
  STORES,
  SyncQueueItem,
  OfflineThread,
  OfflineMessage,
  OfflineQuickCapture
} from './indexeddb.service';

// Types
export type SyncAction = 'create' | 'update' | 'delete';
export type SyncStore = keyof typeof STORES;
export type SyncStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface SyncResult {
  success: boolean;
  itemId: string;
  serverId?: string;
  error?: string;
}

export interface SyncBatchResult {
  total: number;
  successful: number;
  failed: number;
  results: SyncResult[];
}

export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
}

// API sync functions type
export interface SyncAPIFunctions {
  threads: {
    create: (data: OfflineThread) => Promise<{ id: string }>;
    update: (id: string, data: Partial<OfflineThread>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  messages: {
    create: (data: OfflineMessage) => Promise<{ id: string }>;
    update: (id: string, data: Partial<OfflineMessage>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  quick_captures: {
    create: (data: OfflineQuickCapture) => Promise<{ id: string }>;
    update: (id: string, data: Partial<OfflineQuickCapture>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

// Configuration
const DEFAULT_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  retryBackoffMultiplier: 2,
  batchSize: 10,
  syncIntervalMs: 30000, // 30 seconds
};

class SyncQueueService {
  private config = DEFAULT_CONFIG;
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private onProgressCallback?: (progress: SyncProgress) => void;
  private onOnlineCallback?: () => void;
  private apiFunctions?: SyncAPIFunctions;

  /**
   * Initialize the sync service with API functions
   */
  initialize(apiFunctions: SyncAPIFunctions): void {
    this.apiFunctions = apiFunctions;
    this.setupOnlineListener();
  }

  /**
   * Set progress callback
   */
  onProgress(callback: (progress: SyncProgress) => void): void {
    this.onProgressCallback = callback;
  }

  /**
   * Set online callback (called when connection restored)
   */
  onOnline(callback: () => void): void {
    this.onOnlineCallback = callback;
  }

  /**
   * Setup listener for online/offline events
   */
  private setupOnlineListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncQueue] Connection restored, starting sync...');
        this.onOnlineCallback?.();
        this.syncAll();
      });

      window.addEventListener('offline', () => {
        console.log('[SyncQueue] Connection lost, pausing sync...');
        this.stopAutoSync();
      });
    }
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUEUE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Add an item to the sync queue
   */
  async enqueue(
    action: SyncAction,
    store: SyncStore,
    entityId: string,
    data: unknown
  ): Promise<SyncQueueItem> {
    const item = await indexedDBService.addToSyncQueue({
      action,
      store,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      status: 'pending',
    });

    console.log(`[SyncQueue] Enqueued ${action} for ${store}/${entityId}`);

    // If online, try to sync immediately
    if (this.isOnline() && !this.syncInProgress) {
      this.syncAll();
    }

    return item;
  }

  /**
   * Get all pending items
   */
  async getPendingItems(): Promise<SyncQueueItem[]> {
    return indexedDBService.getPendingSyncItems();
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<{
    pending: number;
    processing: number;
    failed: number;
    total: number;
  }> {
    const all = await indexedDBService.getSyncQueue();
    return {
      pending: all.filter(i => i.status === 'pending').length,
      processing: all.filter(i => i.status === 'processing').length,
      failed: all.filter(i => i.status === 'failed').length,
      total: all.length,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNC OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sync all pending items
   */
  async syncAll(): Promise<SyncBatchResult> {
    if (this.syncInProgress) {
      console.log('[SyncQueue] Sync already in progress, skipping...');
      return { total: 0, successful: 0, failed: 0, results: [] };
    }

    if (!this.isOnline()) {
      console.log('[SyncQueue] Offline, skipping sync...');
      return { total: 0, successful: 0, failed: 0, results: [] };
    }

    if (!this.apiFunctions) {
      console.error('[SyncQueue] API functions not initialized');
      return { total: 0, successful: 0, failed: 0, results: [] };
    }

    this.syncInProgress = true;
    const results: SyncResult[] = [];

    try {
      const pendingItems = await this.getPendingItems();
      const total = pendingItems.length;

      if (total === 0) {
        return { total: 0, successful: 0, failed: 0, results: [] };
      }

      console.log(`[SyncQueue] Starting sync of ${total} items...`);

      // Process in order (oldest first)
      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];

        // Update progress
        this.onProgressCallback?.({
          total,
          completed: i,
          failed: results.filter(r => !r.success).length,
          current: `${item.action} ${item.store}/${item.entityId}`,
        });

        const result = await this.syncItem(item);
        results.push(result);

        // Small delay between items to avoid overwhelming the server
        if (i < pendingItems.length - 1) {
          await this.delay(100);
        }
      }

      // Final progress update
      this.onProgressCallback?.({
        total,
        completed: total,
        failed: results.filter(r => !r.success).length,
      });

      // Clean up completed items
      await indexedDBService.clearCompletedSyncItems();

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      console.log(`[SyncQueue] Sync complete: ${successful} successful, ${failed} failed`);

      return { total, successful, failed, results };

    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: SyncQueueItem): Promise<SyncResult> {
    // Mark as processing
    item.status = 'processing';
    await indexedDBService.updateSyncItem(item);

    try {
      const result = await this.executeSyncAction(item);

      // Mark as completed and remove from queue
      item.status = 'completed';
      await indexedDBService.updateSyncItem(item);

      return {
        success: true,
        itemId: item.id,
        serverId: result?.id,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[SyncQueue] Failed to sync ${item.id}:`, errorMessage);

      // Increment retry count
      item.retryCount++;
      item.error = errorMessage;

      if (item.retryCount >= item.maxRetries) {
        item.status = 'failed';
      } else {
        item.status = 'pending'; // Will retry later
      }

      await indexedDBService.updateSyncItem(item);

      return {
        success: false,
        itemId: item.id,
        error: errorMessage,
      };
    }
  }

  /**
   * Execute the actual API call for a sync item
   */
  private async executeSyncAction(item: SyncQueueItem): Promise<{ id?: string } | void> {
    if (!this.apiFunctions) {
      throw new Error('API functions not initialized');
    }

    const { action, store, entityId, data } = item;

    // Map store names to API functions
    const storeMap: Record<string, keyof SyncAPIFunctions> = {
      [STORES.THREADS]: 'threads',
      [STORES.MESSAGES]: 'messages',
      [STORES.QUICK_CAPTURES]: 'quick_captures',
    };

    const apiStore = storeMap[store];
    if (!apiStore) {
      throw new Error(`No API handler for store: ${store}`);
    }

    const api = this.apiFunctions[apiStore];

    switch (action) {
      case 'create':
        return api.create(data as never);
      case 'update':
        return api.update(entityId, data as never);
      case 'delete':
        return api.delete(entityId);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Retry failed items
   */
  async retryFailed(): Promise<SyncBatchResult> {
    const failedItems = await indexedDBService.getByIndex<SyncQueueItem>(
      STORES.SYNC_QUEUE,
      'status',
      'failed'
    );

    // Reset failed items to pending
    for (const item of failedItems) {
      item.status = 'pending';
      item.retryCount = 0;
      item.error = undefined;
      await indexedDBService.updateSyncItem(item);
    }

    // Run sync
    return this.syncAll();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO SYNC
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start automatic sync at intervals
   */
  startAutoSync(intervalMs: number = this.config.syncIntervalMs): void {
    this.stopAutoSync();

    this.syncInterval = setInterval(() => {
      if (this.isOnline() && !this.syncInProgress) {
        this.syncAll();
      }
    }, intervalMs);

    console.log(`[SyncQueue] Auto-sync started (every ${intervalMs}ms)`);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[SyncQueue] Auto-sync stopped');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Helper delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear all sync queue items
   */
  async clearQueue(): Promise<void> {
    await indexedDBService.clear(STORES.SYNC_QUEUE);
    console.log('[SyncQueue] Queue cleared');
  }

  /**
   * Remove a specific item from the queue
   */
  async removeFromQueue(itemId: string): Promise<void> {
    await indexedDBService.removeSyncItem(itemId);
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<typeof DEFAULT_CONFIG>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const syncQueueService = new SyncQueueService();
export default syncQueueService;
