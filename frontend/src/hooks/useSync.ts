// ============================================================
// CHE·NU - Sync Hook
// ============================================================
// Offline-first data synchronization hook
// Auto-sync, conflict resolution, optimistic updates
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

// ============================================================
// TYPES
// ============================================================

interface SyncOperation {
  id: string
  operation: 'create' | 'update' | 'delete'
  entityType: string
  entityId: string
  data: Record<string, any>
  clientTimestamp: number
  version: number
  baseVersion: number
  status: 'pending' | 'synced' | 'conflict' | 'failed'
}

interface SyncState {
  clientId: string
  lastSync: number
  pendingCount: number
  conflictCount: number
  cursor: string | null
}

interface SyncConflict {
  id: string
  entityType: string
  entityId: string
  serverVersion: number
  serverData: Record<string, any>
  clientVersion: number
  clientData: Record<string, any>
}

interface UseSyncOptions {
  apiBaseUrl?: string
  autoSync?: boolean
  syncInterval?: number // ms
  onConflict?: (conflict: SyncConflict) => void
  onSyncComplete?: (results: SyncResults) => void
  onError?: (error: Error) => void
}

interface SyncResults {
  synced: number
  conflicts: number
  failed: number
}

interface UseSyncReturn {
  // State
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  conflicts: SyncConflict[]
  lastSyncTime: number | null
  
  // Actions
  sync: () => Promise<SyncResults>
  push: (operations: SyncOperation[]) => Promise<SyncResults>
  pull: () => Promise<any[]>
  resolveConflict: (conflictId: string, resolution: 'server' | 'client' | 'merge', data?: unknown) => Promise<void>
  
  // Helpers
  createOperation: (type: string, entityType: string, entityId: string, data: unknown) => SyncOperation
  queueOperation: (operation: SyncOperation) => void
  clearPending: () => void
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

const STORAGE_KEYS = {
  CLIENT_ID: 'chenu_sync_client_id',
  PENDING_OPS: 'chenu_sync_pending',
  LAST_SYNC: 'chenu_sync_last',
  VERSIONS: 'chenu_sync_versions'
}

function getClientId(): string {
  let clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID)
  if (!clientId) {
    clientId = uuidv4()
    localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId)
  }
  return clientId
}

function getPendingOperations(): SyncOperation[] {
  const data = localStorage.getItem(STORAGE_KEYS.PENDING_OPS)
  return data ? JSON.parse(data) : []
}

function savePendingOperations(operations: SyncOperation[]): void {
  localStorage.setItem(STORAGE_KEYS.PENDING_OPS, JSON.stringify(operations))
}

function getEntityVersion(entityType: string, entityId: string): number {
  const versions = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERSIONS) || '{}')
  return versions[`${entityType}:${entityId}`] || 0
}

function setEntityVersion(entityType: string, entityId: string, version: number): void {
  const versions = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERSIONS) || '{}')
  versions[`${entityType}:${entityId}`] = version
  localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions))
}

// ============================================================
// HOOK
// ============================================================

export function useSync(options: UseSyncOptions = {}): UseSyncReturn {
  const {
    apiBaseUrl = '/api',
    autoSync = true,
    syncInterval = 30000, // 30 seconds
    onConflict,
    onSyncComplete,
    onError
  } = options

  // State
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingOps, setPendingOps] = useState<SyncOperation[]>(() => getPendingOperations())
  const [conflicts, setConflicts] = useState<SyncConflict[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(
    () => Number(localStorage.getItem(STORAGE_KEYS.LAST_SYNC)) || null
  )

  const clientId = useRef(getClientId())
  const syncTimeoutRef = useRef<NodeJS.Timeout>()

  // ============================================================
  // ONLINE STATUS
  // ============================================================

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // ============================================================
  // AUTO SYNC
  // ============================================================

  useEffect(() => {
    if (!autoSync) return

    const scheduleSync = () => {
      syncTimeoutRef.current = setTimeout(async () => {
        if (isOnline && pendingOps.length > 0) {
          await sync()
        }
        scheduleSync()
      }, syncInterval)
    }

    scheduleSync()

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [autoSync, syncInterval, isOnline, pendingOps.length])

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && pendingOps.length > 0) {
      sync()
    }
  }, [isOnline])

  // ============================================================
  // CREATE OPERATION
  // ============================================================

  const createOperation = useCallback((
    type: 'create' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    data: unknown
  ): SyncOperation => {
    const baseVersion = getEntityVersion(entityType, entityId)
    
    return {
      id: uuidv4(),
      operation: type,
      entityType,
      entityId,
      data,
      clientTimestamp: Date.now(),
      version: baseVersion + 1,
      baseVersion,
      status: 'pending'
    }
  }, [])

  // ============================================================
  // QUEUE OPERATION
  // ============================================================

  const queueOperation = useCallback((operation: SyncOperation) => {
    setPendingOps(prev => {
      // Merge with existing operation for same entity if update
      const existing = prev.findIndex(
        op => op.entityType === operation.entityType && 
              op.entityId === operation.entityId &&
              op.status === 'pending'
      )

      let newOps: SyncOperation[]
      if (existing >= 0 && operation.operation === 'update') {
        // Merge updates
        newOps = [...prev]
        newOps[existing] = {
          ...newOps[existing],
          data: { ...newOps[existing].data, ...operation.data },
          clientTimestamp: operation.clientTimestamp
        }
      } else {
        newOps = [...prev, operation]
      }

      savePendingOperations(newOps)
      return newOps
    })
  }, [])

  // ============================================================
  // PUSH
  // ============================================================

  const push = useCallback(async (operations: SyncOperation[]): Promise<SyncResults> => {
    if (!isOnline) {
      return { synced: 0, conflicts: 0, failed: operations.length }
    }

    try {
      const response = await fetch(`${apiBaseUrl}/sync/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.current,
          operations: operations.map(op => ({
            id: op.id,
            operation: op.operation,
            entityType: op.entityType,
            entityId: op.entityId,
            data: op.data,
            clientTimestamp: op.clientTimestamp,
            version: op.version,
            baseVersion: op.baseVersion
          }))
        })
      })

      const results = await response.json()

      // Update local versions for synced items
      results.synced?.forEach((item: unknown) => {
        setEntityVersion(
          operations.find(o => o.id === item.id)?.entityType || '',
          operations.find(o => o.id === item.id)?.entityId || '',
          item.version
        )
      })

      // Handle conflicts
      if (results.conflicts?.length > 0) {
        const newConflicts = results.conflicts.map((c: unknown) => ({
          id: c.conflictId,
          entityType: operations.find(o => o.id === c.id)?.entityType || '',
          entityId: operations.find(o => o.id === c.id)?.entityId || '',
          serverVersion: c.serverVersion,
          serverData: {},
          clientVersion: c.clientVersion,
          clientData: operations.find(o => o.id === c.id)?.data || {}
        }))

        setConflicts(prev => [...prev, ...newConflicts])
        newConflicts.forEach((c: SyncConflict) => onConflict?.(c))
      }

      // Remove synced operations from pending
      const syncedIds = new Set(results.synced?.map((s: unknown) => s.id) || [])
      setPendingOps(prev => {
        const newOps = prev.filter(op => !syncedIds.has(op.id))
        savePendingOperations(newOps)
        return newOps
      })

      return {
        synced: results.synced?.length || 0,
        conflicts: results.conflicts?.length || 0,
        failed: results.failed?.length || 0
      }

    } catch (error) {
      onError?.(error as Error)
      return { synced: 0, conflicts: 0, failed: operations.length }
    }
  }, [apiBaseUrl, isOnline, onConflict, onError])

  // ============================================================
  // PULL
  // ============================================================

  const pull = useCallback(async (): Promise<any[]> => {
    if (!isOnline) return []

    try {
      const since = lastSyncTime || 0
      const response = await fetch(
        `${apiBaseUrl}/sync/pull?clientId=${clientId.current}&since=${since}`
      )
      const results = await response.json()

      // Update local versions
      results.changes?.forEach((change: unknown) => {
        setEntityVersion(change.entityType, change.entityId, change.version)
      })

      return results.changes || []

    } catch (error) {
      onError?.(error as Error)
      return []
    }
  }, [apiBaseUrl, isOnline, lastSyncTime, onError])

  // ============================================================
  // SYNC (Push + Pull)
  // ============================================================

  const sync = useCallback(async (): Promise<SyncResults> => {
    if (isSyncing || !isOnline) {
      return { synced: 0, conflicts: 0, failed: 0 }
    }

    setIsSyncing(true)

    try {
      // Push pending operations
      let results: SyncResults = { synced: 0, conflicts: 0, failed: 0 }
      
      if (pendingOps.length > 0) {
        results = await push(pendingOps.filter(op => op.status === 'pending'))
      }

      // Pull server changes
      await pull()

      // Update last sync time
      const now = Date.now()
      setLastSyncTime(now)
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(now))

      onSyncComplete?.(results)
      return results

    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, isOnline, pendingOps, push, pull, onSyncComplete])

  // ============================================================
  // RESOLVE CONFLICT
  // ============================================================

  const resolveConflict = useCallback(async (
    conflictId: string,
    resolution: 'server' | 'client' | 'merge',
    data?: unknown
  ): Promise<void> => {
    try {
      await fetch(`${apiBaseUrl}/sync/conflicts/${conflictId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution: resolution === 'server' ? 'server_wins' : 
                      resolution === 'client' ? 'client_wins' : 'merge',
          resolved_data: data,
          resolved_by: clientId.current
        })
      })

      setConflicts(prev => prev.filter(c => c.id !== conflictId))

    } catch (error) {
      onError?.(error as Error)
    }
  }, [apiBaseUrl, onError])

  // ============================================================
  // CLEAR PENDING
  // ============================================================

  const clearPending = useCallback(() => {
    setPendingOps([])
    savePendingOperations([])
  }, [])

  // ============================================================
  // RETURN
  // ============================================================

  return {
    isOnline,
    isSyncing,
    pendingCount: pendingOps.filter(op => op.status === 'pending').length,
    conflicts,
    lastSyncTime,
    
    sync,
    push,
    pull,
    resolveConflict,
    
    createOperation,
    queueOperation,
    clearPending
  }
}

export default useSync
