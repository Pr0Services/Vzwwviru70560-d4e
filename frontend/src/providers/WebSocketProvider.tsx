/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — WEBSOCKET PROVIDER                              ║
 * ║                    Task B5.6: Real-time sync and connection management       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback,
  useRef,
  type ReactNode 
} from 'react'

// ============================================================================
// TYPES
// ============================================================================

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

interface WebSocketMessage<T = unknown> {
  type: string
  payload: T
  timestamp: number
  id: string
}

interface WebSocketConfig {
  url: string
  reconnect: boolean
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
  debug: boolean
}

interface WebSocketContextValue {
  status: ConnectionStatus
  lastMessage: WebSocketMessage | null
  send: <T>(type: string, payload: T) => void
  subscribe: <T>(type: string, callback: (payload: T) => void) => () => void
  isConnected: boolean
  reconnect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

// ============================================================================
// WEBSOCKET PROVIDER
// ============================================================================

const DEFAULT_CONFIG: WebSocketConfig = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  debug: import.meta.env.DEV,
}

export function WebSocketProvider({ 
  children,
  config: userConfig = {},
}: { 
  children: ReactNode
  config?: Partial<WebSocketConfig>
}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig }
  
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeout = useRef<NodeJS.Timeout>()
  const heartbeatInterval = useRef<NodeJS.Timeout>()
  const subscribers = useRef<Map<string, Set<(payload: unknown) => void>>>(new Map())
  const messageQueue = useRef<WebSocketMessage[]>([])

  // Generate unique message ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Debug logger
  const log = useCallback((...args: unknown[]) => {
    if (config.debug) {
      logger.debug('[CHE·NU WebSocket]', ...args)
    }
  }, [config.debug])

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      log('Already connected')
      return
    }

    log('Connecting to', config.url)
    setStatus('connecting')

    try {
      const ws = new WebSocket(config.url)
      wsRef.current = ws

      ws.onopen = () => {
        log('Connected')
        setStatus('connected')
        reconnectAttempts.current = 0

        // Flush message queue
        while (messageQueue.current.length > 0) {
          const msg = messageQueue.current.shift()
          if (msg) {
            ws.send(JSON.stringify(msg))
            log('Sent queued message:', msg.type)
          }
        }

        // Start heartbeat
        heartbeatInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
          }
        }, config.heartbeatInterval)
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          log('Received:', message.type)

          // Handle pong
          if (message.type === 'pong') {
            return
          }

          setLastMessage(message)

          // Notify subscribers
          const typeSubscribers = subscribers.current.get(message.type)
          if (typeSubscribers) {
            typeSubscribers.forEach(callback => callback(message.payload))
          }

          // Notify wildcard subscribers
          const wildcardSubscribers = subscribers.current.get('*')
          if (wildcardSubscribers) {
            wildcardSubscribers.forEach(callback => callback(message))
          }
        } catch (error) {
          logger.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        log('Disconnected:', event.code, event.reason)
        setStatus('disconnected')
        clearInterval(heartbeatInterval.current)

        // Attempt reconnection
        if (config.reconnect && reconnectAttempts.current < config.maxReconnectAttempts) {
          setStatus('reconnecting')
          reconnectAttempts.current++
          log(`Reconnecting... Attempt ${reconnectAttempts.current}/${config.maxReconnectAttempts}`)
          
          reconnectTimeout.current = setTimeout(() => {
            connect()
          }, config.reconnectInterval * reconnectAttempts.current)
        }
      }

      ws.onerror = (error) => {
        logger.error('WebSocket error:', error)
      }
    } catch (error) {
      logger.error('Failed to create WebSocket:', error)
      setStatus('disconnected')
    }
  }, [config, log])

  // Disconnect
  const disconnect = useCallback(() => {
    log('Disconnecting...')
    clearTimeout(reconnectTimeout.current)
    clearInterval(heartbeatInterval.current)
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }
    
    setStatus('disconnected')
    reconnectAttempts.current = config.maxReconnectAttempts // Prevent auto-reconnect
  }, [config.maxReconnectAttempts, log])

  // Manual reconnect
  const manualReconnect = useCallback(() => {
    reconnectAttempts.current = 0
    disconnect()
    setTimeout(connect, 100)
  }, [connect, disconnect])

  // Send message
  const send = useCallback(<T,>(type: string, payload: T) => {
    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: generateId(),
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      log('Sent:', type)
    } else {
      // Queue message for when connection is restored
      messageQueue.current.push(message as WebSocketMessage)
      log('Queued:', type)
    }
  }, [log])

  // Subscribe to message type
  const subscribe = useCallback(<T,>(type: string, callback: (payload: T) => void) => {
    if (!subscribers.current.has(type)) {
      subscribers.current.set(type, new Set())
    }
    subscribers.current.get(type)!.add(callback as any)
    log('Subscribed to:', type)

    return () => {
      subscribers.current.get(type)?.delete(callback as any)
      log('Unsubscribed from:', type)
    }
  }, [log])

  // Auto-connect on mount
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle visibility change (reconnect when tab becomes visible)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && status === 'disconnected') {
        reconnectAttempts.current = 0
        connect()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [connect, status])

  const value: WebSocketContextValue = {
    status,
    lastMessage,
    send,
    subscribe,
    isConnected: status === 'connected',
    reconnect: manualReconnect,
    disconnect,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}

// Subscribe to specific message type
export function useSubscription<T>(
  type: string,
  callback: (payload: T) => void,
  deps: unknown[] = []
) {
  const { subscribe } = useWebSocket()

  useEffect(() => {
    return subscribe<T>(type, callback)
  }, [type, subscribe, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}

// Subscribe and get latest value
export function useLatestMessage<T>(type: string, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue)
  useSubscription<T>(type, setValue)
  return value
}

// ============================================================================
// MESSAGE TYPES (CHE·NU Specific)
// ============================================================================

export const MessageTypes = {
  // Thread updates
  THREAD_CREATED: 'thread:created',
  THREAD_UPDATED: 'thread:updated',
  THREAD_DELETED: 'thread:deleted',
  THREAD_ACTIVITY: 'thread:activity',

  // Agent updates
  AGENT_STATUS: 'agent:status',
  AGENT_TASK_START: 'agent:task:start',
  AGENT_TASK_PROGRESS: 'agent:task:progress',
  AGENT_TASK_COMPLETE: 'agent:task:complete',
  AGENT_TASK_ERROR: 'agent:task:error',

  // Nova updates
  NOVA_INSIGHT: 'nova:insight',
  NOVA_ALERT: 'nova:alert',
  NOVA_SUGGESTION: 'nova:suggestion',

  // Governance
  GOVERNANCE_APPROVAL_REQUIRED: 'governance:approval:required',
  GOVERNANCE_BUDGET_WARNING: 'governance:budget:warning',
  GOVERNANCE_BUDGET_EXCEEDED: 'governance:budget:exceeded',

  // Notifications
  NOTIFICATION: 'notification',

  // Presence (multi-user)
  USER_JOINED: 'presence:joined',
  USER_LEFT: 'presence:left',
  USER_TYPING: 'presence:typing',
  USER_CURSOR: 'presence:cursor',

  // Sync
  SYNC_REQUEST: 'sync:request',
  SYNC_RESPONSE: 'sync:response',
  SYNC_CONFLICT: 'sync:conflict',
} as const

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

// Thread real-time updates
export function useThreadUpdates(threadId: string, callbacks: {
  onUpdate?: (thread: unknown) => void
  onActivity?: (activity: unknown) => void
}) {
  const { send } = useWebSocket()

  useSubscription(MessageTypes.THREAD_UPDATED, (thread: unknown) => {
    if (thread.id === threadId) {
      callbacks.onUpdate?.(thread)
    }
  }, [threadId])

  useSubscription(MessageTypes.THREAD_ACTIVITY, (activity: unknown) => {
    if (activity.threadId === threadId) {
      callbacks.onActivity?.(activity)
    }
  }, [threadId])

  // Join thread room
  useEffect(() => {
    send('thread:join', { threadId })
    return () => {
      send('thread:leave', { threadId })
    }
  }, [threadId, send])
}

// Agent task tracking
export function useAgentTask(taskId: string) {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useSubscription(MessageTypes.AGENT_TASK_START, (data: unknown) => {
    if (data.taskId === taskId) {
      setStatus('running')
      setProgress(0)
    }
  }, [taskId])

  useSubscription(MessageTypes.AGENT_TASK_PROGRESS, (data: unknown) => {
    if (data.taskId === taskId) {
      setProgress(data.progress)
    }
  }, [taskId])

  useSubscription(MessageTypes.AGENT_TASK_COMPLETE, (data: unknown) => {
    if (data.taskId === taskId) {
      setStatus('complete')
      setProgress(100)
      setResult(data.result)
    }
  }, [taskId])

  useSubscription(MessageTypes.AGENT_TASK_ERROR, (data: unknown) => {
    if (data.taskId === taskId) {
      setStatus('error')
      setError(data.error)
    }
  }, [taskId])

  return { status, progress, result, error }
}

// Presence awareness
export function usePresence(roomId: string) {
  const { send } = useWebSocket()
  const [users, setUsers] = useState<Array<{
    id: string
    name: string
    avatar?: string
    cursor?: { x: number; y: number }
  }>>([])

  useSubscription(MessageTypes.USER_JOINED, (user: unknown) => {
    if (user.roomId === roomId) {
      setUsers(prev => [...prev, user])
    }
  }, [roomId])

  useSubscription(MessageTypes.USER_LEFT, (user: unknown) => {
    if (user.roomId === roomId) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }, [roomId])

  useSubscription(MessageTypes.USER_CURSOR, (data: unknown) => {
    if (data.roomId === roomId) {
      setUsers(prev => prev.map(u => 
        u.id === data.userId ? { ...u, cursor: data.cursor } : u
      ))
    }
  }, [roomId])

  const updateCursor = useCallback((x: number, y: number) => {
    send(MessageTypes.USER_CURSOR, { roomId, cursor: { x, y } })
  }, [roomId, send])

  const sendTyping = useCallback(() => {
    send(MessageTypes.USER_TYPING, { roomId })
  }, [roomId, send])

  return { users, updateCursor, sendTyping }
}

// ============================================================================
// CONNECTION STATUS UI
// ============================================================================

export function ConnectionStatus({ className = '' }: { className?: string }) {
  const { status, reconnect } = useWebSocket()

  const statusConfig = {
    connecting: { color: 'bg-sacred-gold', text: 'Connexion...', pulse: true },
    connected: { color: 'bg-jungle-emerald', text: 'Connecté', pulse: false },
    disconnected: { color: 'bg-red-500', text: 'Déconnecté', pulse: false },
    reconnecting: { color: 'bg-earth-ember', text: 'Reconnexion...', pulse: true },
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.color} animate-ping`} />
        )}
      </div>
      <span className="text-xs text-ancient-stone">{config.text}</span>
      {status === 'disconnected' && (
        <button
          onClick={reconnect}
          className="text-xs text-cenote-turquoise hover:underline"
        >
          Reconnecter
        </button>
      )}
    </div>
  )
}

// ============================================================================
// OFFLINE QUEUE
// ============================================================================

class OfflineQueue {
  private queue: Array<{ action: string; data: unknown; timestamp: number }> = []
  private storageKey = 'chenu_offline_queue'

  constructor() {
    this.load()
  }

  private load() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        this.queue = JSON.parse(saved)
      }
    } catch (e) {
      logger.error('Failed to load offline queue:', e)
    }
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue))
    } catch (e) {
      logger.error('Failed to save offline queue:', e)
    }
  }

  add(action: string, data: unknown) {
    this.queue.push({ action, data, timestamp: Date.now() })
    this.save()
  }

  getAll() {
    return [...this.queue]
  }

  clear() {
    this.queue = []
    this.save()
  }

  remove(timestamp: number) {
    this.queue = this.queue.filter(item => item.timestamp !== timestamp)
    this.save()
  }

  get length() {
    return this.queue.length
  }
}

export const offlineQueue = new OfflineQueue()

// Hook for offline-first operations
export function useOfflineFirst<T>(
  action: string,
  onlineOperation: (data: T) => Promise<void>
) {
  const { isConnected, send } = useWebSocket()

  const execute = useCallback(async (data: T) => {
    if (isConnected) {
      try {
        await onlineOperation(data)
        send(action, data)
      } catch (error) {
        offlineQueue.add(action, data)
        throw error
      }
    } else {
      offlineQueue.add(action, data)
    }
  }, [isConnected, action, onlineOperation, send])

  // Flush queue when connected
  useEffect(() => {
    if (isConnected && offlineQueue.length > 0) {
      const items = offlineQueue.getAll()
      items.forEach(async (item) => {
        try {
          await onlineOperation(item.data)
          send(item.action, item.data)
          offlineQueue.remove(item.timestamp)
        } catch (error) {
          logger.error('Failed to flush offline item:', error)
        }
      })
    }
  }, [isConnected, onlineOperation, send])

  return { execute, queueLength: offlineQueue.length }
}
