/**
 * CHE·NU™ Offline Services
 * 
 * Complete offline support module for CHE·NU.
 * Provides local storage, sync queue, and conflict resolution.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

// Core services
export { 
  indexedDBService, 
  STORES,
  type OfflineThread,
  type OfflineMessage,
  type OfflineQuickCapture,
  type SyncQueueItem,
  type OfflineUserData,
} from './indexeddb.service';

export { 
  syncQueueService,
  type SyncAction,
  type SyncStore,
  type SyncStatus,
  type SyncResult,
  type SyncBatchResult,
  type SyncProgress,
  type SyncAPIFunctions,
} from './sync-queue.service';

export { 
  conflictResolver,
  type ConflictEntity,
  type ConflictInfo,
  type ResolutionStrategy,
  type MergeResult,
  type ConflictResolutionResult,
} from './conflict-resolver';

// Store
export { 
  useOfflineStore,
  selectIsOnline,
  selectSyncInProgress,
  selectPendingCount,
  selectHasUnresolvedConflicts,
  selectConflicts,
  selectThreads,
  selectMessages,
  selectQuickCaptures,
  selectStoragePercentage,
  selectNeedsSyncing,
  type OfflineState,
  type OfflineActions,
  type OfflineStore,
} from './offline.store';
