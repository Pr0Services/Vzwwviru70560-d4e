/**
 * CHE·NU™ - Offline Storage with IndexedDB
 */

const DB_NAME = 'chenu-offline';
const DB_VERSION = 1;

export class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Threads store
        if (!db.objectStoreNames.contains('threads')) {
          db.createObjectStore('threads', { keyPath: 'id' });
        }
        
        // Pending actions store
        if (!db.objectStoreNames.contains('pending-actions')) {
          const store = db.createObjectStore('pending-actions', { autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveThread(thread: unknown): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['threads'], 'readwrite');
    const store = transaction.objectStore('threads');
    store.put(thread);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getThread(id: string): Promise<any> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['threads'], 'readonly');
    const store = transaction.objectStore('threads');
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllThreads(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['threads'], 'readonly');
    const store = transaction.objectStore('threads');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async savePendingAction(action: unknown): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pending-actions'], 'readwrite');
    const store = transaction.objectStore('pending-actions');
    store.add({ ...action, timestamp: Date.now() });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getPendingActions(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pending-actions'], 'readonly');
    const store = transaction.objectStore('pending-actions');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPendingActions(): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pending-actions'], 'readwrite');
    const store = transaction.objectStore('pending-actions');
    store.clear();
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
