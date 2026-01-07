/**
 * CHE·NU™ Offline Store
 * 
 * Zustand store for managing offline state.
 * Coordinates IndexedDB, sync queue, and conflict resolution.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { 
  indexedDBService, 
  OfflineThread,
  OfflineMessage,
  OfflineQuickCapture,
  SyncQueueItem
} from './indexeddb.service';
import { syncQueueService, SyncProgress, SyncBatchResult } from './sync-queue.service';
import { conflictResolver, ConflictInfo, ResolutionStrategy } from './conflict-resolver';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OfflineState {
  // Connection status
  isOnline: boolean;
  lastOnlineAt: string | null;
  lastSyncAt: string | null;

  // Sync status
  syncInProgress: boolean;
  syncProgress: SyncProgress | null;
  lastSyncResult: SyncBatchResult | null;

  // Queue status
  pendingCount: number;
  failedCount: number;

  // Conflicts
  conflicts: ConflictInfo[];
  hasUnresolvedConflicts: boolean;

  // Local data
  threads: OfflineThread[];
  messages: Record<string, OfflineMessage[]>; // threadId -> messages
  quickCaptures: OfflineQuickCapture[];

  // Storage info
  storageUsage: number | null;
  storageQuota: number | null;

  // Initialized flag
  initialized: boolean;
}

export interface OfflineActions {
  // Initialization
  initialize: () => Promise<void>;

  // Connection
  setOnline: (online: boolean) => void;
  
  // Threads
  createThread: (thread: Omit<OfflineThread, 'localId' | 'syncStatus' | 'localVersion'>) => Promise<OfflineThread>;
  updateThread: (localId: string, updates: Partial<OfflineThread>) => Promise<OfflineThread | undefined>;
  deleteThread: (localId: string) => Promise<void>;
  loadThreads: (sphereId?: string) => Promise<void>;

  // Messages
  sendMessage: (message: Omit<OfflineMessage, 'localId' | 'syncStatus'>) => Promise<OfflineMessage>;
  loadMessages: (threadId: string) => Promise<void>;

  // Quick Captures
  createQuickCapture: (capture: Omit<OfflineQuickCapture, 'localId' | 'syncStatus'>) => Promise<OfflineQuickCapture>;
  loadQuickCaptures: (sphereId?: string) => Promise<void>;

  // Sync
  syncNow: () => Promise<SyncBatchResult>;
  retryFailedSync: () => Promise<SyncBatchResult>;
  startAutoSync: () => void;
  stopAutoSync: () => void;

  // Conflicts
  loadConflicts: () => void;
  resolveConflict: (conflictId: string, strategy: ResolutionStrategy) => Promise<void>;
  resolveAllConflicts: (strategy: ResolutionStrategy) => Promise<void>;

  // Storage
  updateStorageInfo: () => Promise<void>;
  clearAllOfflineData: () => Promise<void>;
}

export type OfflineStore = OfflineState & OfflineActions;

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

const initialState: OfflineState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastOnlineAt: null,
  lastSyncAt: null,
  syncInProgress: false,
  syncProgress: null,
  lastSyncResult: null,
  pendingCount: 0,
  failedCount: 0,
  conflicts: [],
  hasUnresolvedConflicts: false,
  threads: [],
  messages: {},
  quickCaptures: [],
  storageUsage: null,
  storageQuota: null,
  initialized: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════

export const useOfflineStore = create<OfflineStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

      // ═════════════════════════════════════════════════════════════════════
      // INITIALIZATION
      // ═════════════════════════════════════════════════════════════════════

      initialize: async () => {
        if (get().initialized) return;

        try {
          // Initialize IndexedDB
          await indexedDBService.init();

          // Setup online/offline listeners
          if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
              set(state => {
                state.isOnline = true;
                state.lastOnlineAt = new Date().toISOString();
              });
            });

            window.addEventListener('offline', () => {
              set(state => {
                state.isOnline = false;
              });
            });
          }

          // Setup sync progress listener
          syncQueueService.onProgress((progress) => {
            set(state => {
              state.syncProgress = progress;
            });
          });

          // Setup conflict listener
          conflictResolver.onConflict((conflict) => {
            set(state => {
              state.conflicts.push(conflict);
              state.hasUnresolvedConflicts = true;
            });
          });

          // Load initial queue status
          const status = await syncQueueService.getQueueStatus();
          set(state => {
            state.pendingCount = status.pending;
            state.failedCount = status.failed;
          });

          // Update storage info
          await get().updateStorageInfo();

          set(state => {
            state.initialized = true;
          });

          console.log('[OfflineStore] Initialized');

        } catch (error) {
          console.error('[OfflineStore] Initialization failed:', error);
        }
      },

      // ═════════════════════════════════════════════════════════════════════
      // CONNECTION
      // ═════════════════════════════════════════════════════════════════════

      setOnline: (online: boolean) => {
        set(state => {
          state.isOnline = online;
          if (online) {
            state.lastOnlineAt = new Date().toISOString();
          }
        });
      },

      // ═════════════════════════════════════════════════════════════════════
      // THREADS
      // ═════════════════════════════════════════════════════════════════════

      createThread: async (threadData) => {
        const localId = indexedDBService.generateLocalId();
        const now = new Date().toISOString();

        const thread: OfflineThread = {
          ...threadData,
          id: '', // Will be assigned by server
          localId,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
          localVersion: 1,
          data: threadData.data || {},
        };

        // Save locally
        await indexedDBService.saveThread(thread);

        // Add to sync queue
        await syncQueueService.enqueue('create', 'THREADS', localId, thread);

        // Update store
        set(state => {
          state.threads.push(thread);
          state.pendingCount++;
        });

        return thread;
      },

      updateThread: async (localId, updates) => {
        const existing = await indexedDBService.getThread(localId);
        if (!existing) return undefined;

        const updated: OfflineThread = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
          syncStatus: 'pending',
          localVersion: existing.localVersion + 1,
        };

        // Save locally
        await indexedDBService.saveThread(updated);

        // Add to sync queue (if has server ID)
        if (existing.id) {
          await syncQueueService.enqueue('update', 'THREADS', existing.id, updates);
        }

        // Update store
        set(state => {
          const index = state.threads.findIndex(t => t.localId === localId);
          if (index !== -1) {
            state.threads[index] = updated;
          }
          state.pendingCount++;
        });

        return updated;
      },

      deleteThread: async (localId) => {
        const existing = await indexedDBService.getThread(localId);
        if (!existing) return;

        // Delete locally
        await indexedDBService.deleteThread(localId);

        // Add to sync queue (if has server ID)
        if (existing.id) {
          await syncQueueService.enqueue('delete', 'THREADS', existing.id, null);
        }

        // Update store
        set(state => {
          state.threads = state.threads.filter(t => t.localId !== localId);
          delete state.messages[localId];
          state.pendingCount++;
        });
      },

      loadThreads: async (sphereId?: string) => {
        const threads = sphereId
          ? await indexedDBService.getThreadsBySphere(sphereId)
          : await indexedDBService.getAll<OfflineThread>('threads');

        set(state => {
          state.threads = threads;
        });
      },

      // ═════════════════════════════════════════════════════════════════════
      // MESSAGES
      // ═════════════════════════════════════════════════════════════════════

      sendMessage: async (messageData) => {
        const localId = indexedDBService.generateLocalId();

        const message: OfflineMessage = {
          ...messageData,
          id: '', // Will be assigned by server
          localId,
          createdAt: new Date().toISOString(),
          syncStatus: 'pending',
        };

        // Save locally
        await indexedDBService.saveMessage(message);

        // Add to sync queue
        await syncQueueService.enqueue('create', 'MESSAGES', localId, message);

        // Update store
        set(state => {
          if (!state.messages[message.threadId]) {
            state.messages[message.threadId] = [];
          }
          state.messages[message.threadId].push(message);
          state.pendingCount++;
        });

        return message;
      },

      loadMessages: async (threadId: string) => {
        const messages = await indexedDBService.getMessagesByThread(threadId);

        set(state => {
          state.messages[threadId] = messages;
        });
      },

      // ═════════════════════════════════════════════════════════════════════
      // QUICK CAPTURES
      // ═════════════════════════════════════════════════════════════════════

      createQuickCapture: async (captureData) => {
        const localId = indexedDBService.generateLocalId();

        const capture: OfflineQuickCapture = {
          ...captureData,
          id: '', // Will be assigned by server
          localId,
          createdAt: new Date().toISOString(),
          syncStatus: 'pending',
        };

        // Save locally
        await indexedDBService.saveQuickCapture(capture);

        // Add to sync queue
        await syncQueueService.enqueue('create', 'QUICK_CAPTURES', localId, capture);

        // Update store
        set(state => {
          state.quickCaptures.push(capture);
          state.pendingCount++;
        });

        return capture;
      },

      loadQuickCaptures: async (sphereId?: string) => {
        const captures = sphereId
          ? await indexedDBService.getQuickCapturesBySphere(sphereId)
          : await indexedDBService.getAll<OfflineQuickCapture>('quick_captures');

        set(state => {
          state.quickCaptures = captures;
        });
      },

      // ═════════════════════════════════════════════════════════════════════
      // SYNC
      // ═════════════════════════════════════════════════════════════════════

      syncNow: async () => {
        set(state => {
          state.syncInProgress = true;
        });

        const result = await syncQueueService.syncAll();

        // Reload queue status
        const status = await syncQueueService.getQueueStatus();

        set(state => {
          state.syncInProgress = false;
          state.lastSyncResult = result;
          state.lastSyncAt = new Date().toISOString();
          state.pendingCount = status.pending;
          state.failedCount = status.failed;
          state.syncProgress = null;
        });

        return result;
      },

      retryFailedSync: async () => {
        set(state => {
          state.syncInProgress = true;
        });

        const result = await syncQueueService.retryFailed();

        // Reload queue status
        const status = await syncQueueService.getQueueStatus();

        set(state => {
          state.syncInProgress = false;
          state.lastSyncResult = result;
          state.lastSyncAt = new Date().toISOString();
          state.pendingCount = status.pending;
          state.failedCount = status.failed;
        });

        return result;
      },

      startAutoSync: () => {
        syncQueueService.startAutoSync();
      },

      stopAutoSync: () => {
        syncQueueService.stopAutoSync();
      },

      // ═════════════════════════════════════════════════════════════════════
      // CONFLICTS
      // ═════════════════════════════════════════════════════════════════════

      loadConflicts: () => {
        const pending = conflictResolver.getPendingConflicts();
        set(state => {
          state.conflicts = pending;
          state.hasUnresolvedConflicts = pending.length > 0;
        });
      },

      resolveConflict: async (conflictId: string, strategy: ResolutionStrategy) => {
        await conflictResolver.resolve(conflictId, strategy);

        set(state => {
          state.conflicts = state.conflicts.filter(c => c.id !== conflictId);
          state.hasUnresolvedConflicts = state.conflicts.length > 0;
        });
      },

      resolveAllConflicts: async (strategy: ResolutionStrategy) => {
        await conflictResolver.resolveAll(strategy);

        set(state => {
          state.conflicts = [];
          state.hasUnresolvedConflicts = false;
        });
      },

      // ═════════════════════════════════════════════════════════════════════
      // STORAGE
      // ═════════════════════════════════════════════════════════════════════

      updateStorageInfo: async () => {
        const estimate = await indexedDBService.getStorageEstimate();
        if (estimate) {
          set(state => {
            state.storageUsage = estimate.usage;
            state.storageQuota = estimate.quota;
          });
        }
      },

      clearAllOfflineData: async () => {
        await indexedDBService.deleteDatabase();
        conflictResolver.clearConflicts();
        
        set(state => {
          Object.assign(state, initialState);
        });
      },
    }))
  )
);

// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const selectIsOnline = (state: OfflineStore) => state.isOnline;
export const selectSyncInProgress = (state: OfflineStore) => state.syncInProgress;
export const selectPendingCount = (state: OfflineStore) => state.pendingCount;
export const selectHasUnresolvedConflicts = (state: OfflineStore) => state.hasUnresolvedConflicts;
export const selectConflicts = (state: OfflineStore) => state.conflicts;
export const selectThreads = (state: OfflineStore) => state.threads;
export const selectMessages = (threadId: string) => (state: OfflineStore) => state.messages[threadId] || [];
export const selectQuickCaptures = (state: OfflineStore) => state.quickCaptures;

export const selectStoragePercentage = (state: OfflineStore) => {
  if (!state.storageUsage || !state.storageQuota) return null;
  return Math.round((state.storageUsage / state.storageQuota) * 100);
};

export const selectNeedsSyncing = (state: OfflineStore) => 
  state.pendingCount > 0 || state.failedCount > 0;

// Export default
export default useOfflineStore;
