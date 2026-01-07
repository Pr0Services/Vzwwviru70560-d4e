/**
 * CHE·NU™ IndexedDB Service
 * 
 * Core persistence layer for offline mode.
 * Manages local storage of threads, messages, quick captures, and sync queue.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

// Database configuration
const DB_NAME = 'chenu_offline_db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  THREADS: 'threads',
  MESSAGES: 'messages',
  QUICK_CAPTURES: 'quick_captures',
  SYNC_QUEUE: 'sync_queue',
  USER_DATA: 'user_data',
  DATASPACES: 'dataspaces',
  AGENTS: 'agents',
} as const;

// Types
export interface OfflineThread {
  id: string;
  localId: string;
  sphereId: string;
  title: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  syncStatus: 'pending' | 'synced' | 'conflict';
  serverVersion?: number;
  localVersion: number;
  data: Record<string, unknown>;
}

export interface OfflineMessage {
  id: string;
  localId: string;
  threadId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  metadata?: Record<string, unknown>;
}

export interface OfflineQuickCapture {
  id: string;
  localId: string;
  sphereId: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'file';
  createdAt: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  attachments?: Array<{
    name: string;
    type: string;
    data: ArrayBuffer;
  }>;
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  store: keyof typeof STORES;
  entityId: string;
  data: unknown;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'failed' | 'completed';
  error?: string;
}

export interface OfflineUserData {
  id: string;
  userId: string;
  preferences: Record<string, unknown>;
  lastSyncAt: string;
  syncStatus: 'pending' | 'synced';
}

// IndexedDB Service Class
class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[IndexedDB] Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[IndexedDB] Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });

    return this.dbPromise;
  }

  /**
   * Create object stores on database upgrade
   */
  private createStores(db: IDBDatabase): void {
    // Threads store
    if (!db.objectStoreNames.contains(STORES.THREADS)) {
      const threadsStore = db.createObjectStore(STORES.THREADS, { keyPath: 'localId' });
      threadsStore.createIndex('id', 'id', { unique: false });
      threadsStore.createIndex('sphereId', 'sphereId', { unique: false });
      threadsStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      threadsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
    }

    // Messages store
    if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
      const messagesStore = db.createObjectStore(STORES.MESSAGES, { keyPath: 'localId' });
      messagesStore.createIndex('id', 'id', { unique: false });
      messagesStore.createIndex('threadId', 'threadId', { unique: false });
      messagesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      messagesStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Quick captures store
    if (!db.objectStoreNames.contains(STORES.QUICK_CAPTURES)) {
      const capturesStore = db.createObjectStore(STORES.QUICK_CAPTURES, { keyPath: 'localId' });
      capturesStore.createIndex('id', 'id', { unique: false });
      capturesStore.createIndex('sphereId', 'sphereId', { unique: false });
      capturesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      capturesStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Sync queue store
    if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
      const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
      syncStore.createIndex('status', 'status', { unique: false });
      syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      syncStore.createIndex('store', 'store', { unique: false });
    }

    // User data store
    if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
      const userStore = db.createObjectStore(STORES.USER_DATA, { keyPath: 'id' });
      userStore.createIndex('userId', 'userId', { unique: true });
    }

    // Dataspaces store
    if (!db.objectStoreNames.contains(STORES.DATASPACES)) {
      const dataspacesStore = db.createObjectStore(STORES.DATASPACES, { keyPath: 'localId' });
      dataspacesStore.createIndex('id', 'id', { unique: false });
      dataspacesStore.createIndex('sphereId', 'sphereId', { unique: false });
      dataspacesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
    }

    // Agents store
    if (!db.objectStoreNames.contains(STORES.AGENTS)) {
      const agentsStore = db.createObjectStore(STORES.AGENTS, { keyPath: 'id' });
      agentsStore.createIndex('sphereId', 'sphereId', { unique: false });
    }

    console.log('[IndexedDB] Object stores created');
  }

  /**
   * Get database instance
   */
  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERIC CRUD OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Add an item to a store
   */
  async add<T>(storeName: string, item: T): Promise<T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Put (upsert) an item in a store
   */
  async put<T>(storeName: string, item: T): Promise<T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get an item by key
   */
  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all items from a store
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get items by index
   */
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    value: IDBValidKey
  ): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete an item by key
   */
  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all items from a store
   */
  async clear(storeName: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Count items in a store
   */
  async count(storeName: string): Promise<number> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // THREADS OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async saveThread(thread: OfflineThread): Promise<OfflineThread> {
    thread.updatedAt = new Date().toISOString();
    thread.localVersion = (thread.localVersion || 0) + 1;
    return this.put(STORES.THREADS, thread);
  }

  async getThread(localId: string): Promise<OfflineThread | undefined> {
    return this.get(STORES.THREADS, localId);
  }

  async getThreadsBySphere(sphereId: string): Promise<OfflineThread[]> {
    return this.getByIndex(STORES.THREADS, 'sphereId', sphereId);
  }

  async getPendingThreads(): Promise<OfflineThread[]> {
    return this.getByIndex(STORES.THREADS, 'syncStatus', 'pending');
  }

  async deleteThread(localId: string): Promise<void> {
    // Also delete associated messages
    const messages = await this.getMessagesByThread(localId);
    for (const msg of messages) {
      await this.delete(STORES.MESSAGES, msg.localId);
    }
    return this.delete(STORES.THREADS, localId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MESSAGES OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async saveMessage(message: OfflineMessage): Promise<OfflineMessage> {
    return this.put(STORES.MESSAGES, message);
  }

  async getMessage(localId: string): Promise<OfflineMessage | undefined> {
    return this.get(STORES.MESSAGES, localId);
  }

  async getMessagesByThread(threadId: string): Promise<OfflineMessage[]> {
    const messages = await this.getByIndex<OfflineMessage>(
      STORES.MESSAGES,
      'threadId',
      threadId
    );
    return messages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getPendingMessages(): Promise<OfflineMessage[]> {
    return this.getByIndex(STORES.MESSAGES, 'syncStatus', 'pending');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUICK CAPTURES OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async saveQuickCapture(capture: OfflineQuickCapture): Promise<OfflineQuickCapture> {
    return this.put(STORES.QUICK_CAPTURES, capture);
  }

  async getQuickCapture(localId: string): Promise<OfflineQuickCapture | undefined> {
    return this.get(STORES.QUICK_CAPTURES, localId);
  }

  async getQuickCapturesBySphere(sphereId: string): Promise<OfflineQuickCapture[]> {
    return this.getByIndex(STORES.QUICK_CAPTURES, 'sphereId', sphereId);
  }

  async getPendingQuickCaptures(): Promise<OfflineQuickCapture[]> {
    return this.getByIndex(STORES.QUICK_CAPTURES, 'syncStatus', 'pending');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNC QUEUE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<SyncQueueItem> {
    const fullItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    return this.add(STORES.SYNC_QUEUE, fullItem);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const items = await this.getAll<SyncQueueItem>(STORES.SYNC_QUEUE);
    return items.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return this.getByIndex(STORES.SYNC_QUEUE, 'status', 'pending');
  }

  async updateSyncItem(item: SyncQueueItem): Promise<SyncQueueItem> {
    return this.put(STORES.SYNC_QUEUE, item);
  }

  async removeSyncItem(id: string): Promise<void> {
    return this.delete(STORES.SYNC_QUEUE, id);
  }

  async clearCompletedSyncItems(): Promise<void> {
    const items = await this.getByIndex<SyncQueueItem>(
      STORES.SYNC_QUEUE,
      'status',
      'completed'
    );
    for (const item of items) {
      await this.delete(STORES.SYNC_QUEUE, item.id);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // USER DATA OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async saveUserData(data: OfflineUserData): Promise<OfflineUserData> {
    return this.put(STORES.USER_DATA, data);
  }

  async getUserData(userId: string): Promise<OfflineUserData | undefined> {
    const results = await this.getByIndex<OfflineUserData>(
      STORES.USER_DATA,
      'userId',
      userId
    );
    return results[0];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generate a local ID
   */
  generateLocalId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Check if database is available
   */
  isAvailable(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  /**
   * Get storage usage estimate
   */
  async getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return null;
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbPromise = null;
    }
  }

  /**
   * Delete the entire database
   */
  async deleteDatabase(): Promise<void> {
    this.close();
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();
export default indexedDBService;
