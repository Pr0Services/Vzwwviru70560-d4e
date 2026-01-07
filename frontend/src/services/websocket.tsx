// CHE·NU™ WebSocket Service — Real-time Updates
// Governed real-time communication system

import { create } from 'zustand';

// ============================================================
// TYPES
// ============================================================

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: unknown;
  timestamp: string;
  sphere_code?: string;
  thread_id?: string;
  governance_verified: boolean;
}

export type WebSocketEventType =
  // Thread events
  | 'thread.created'
  | 'thread.updated'
  | 'thread.archived'
  | 'thread.message.new'
  | 'thread.message.updated'
  | 'thread.typing'
  // Token events
  | 'token.used'
  | 'token.budget.updated'
  | 'token.alert'
  // Agent events
  | 'agent.execution.started'
  | 'agent.execution.progress'
  | 'agent.execution.completed'
  | 'agent.execution.failed'
  // Nova events
  | 'nova.insight'
  | 'nova.suggestion'
  | 'nova.alert'
  // Governance events
  | 'governance.check.passed'
  | 'governance.check.failed'
  | 'governance.audit.entry'
  // Notification events
  | 'notification.new'
  | 'notification.read'
  | 'notification.dismissed'
  // Sphere events
  | 'sphere.activity'
  | 'sphere.stats.updated'
  // System events
  | 'system.maintenance'
  | 'system.update'
  | 'connection.ping'
  | 'connection.pong';

export interface WebSocketSubscription {
  id: string;
  event: WebSocketEventType | WebSocketEventType[];
  sphere_code?: string;
  thread_id?: string;
  callback: (message: WebSocketMessage) => void;
}

// ============================================================
// WEBSOCKET CONFIGURATION
// ============================================================

const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'wss://ws.chenu.io',
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  pingInterval: 30000,
  pongTimeout: 5000,
};

// ============================================================
// WEBSOCKET SERVICE
// ============================================================

class ChenuWebSocketService {
  private socket: WebSocket | null = null;
  private status: WebSocketStatus = 'disconnected';
  private subscriptions: Map<string, WebSocketSubscription> = new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private pongTimer: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private authToken: string | null = null;
  private listeners: Set<(status: WebSocketStatus) => void> = new Set();

  // ============================================================
  // CONNECTION MANAGEMENT
  // ============================================================

  connect(token: string): void {
    this.authToken = token;
    this.attemptConnection();
  }

  private attemptConnection(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus('connecting');

    try {
      this.socket = new WebSocket(`${WS_CONFIG.url}?token=${this.authToken}`);
      this.setupEventHandlers();
    } catch (error) {
      logger.error('[WS] Connection error:', error);
      this.handleDisconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      logger.debug('[WS] Connected');
      this.updateStatus('connected');
      this.reconnectAttempts = 0;
      this.startPingInterval();
      this.flushMessageQueue();
    };

    this.socket.onclose = (event) => {
      logger.debug('[WS] Disconnected:', event.code, event.reason);
      this.handleDisconnect();
    };

    this.socket.onerror = (error) => {
      logger.error('[WS] Error:', error);
      this.updateStatus('error');
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  private handleDisconnect(): void {
    this.updateStatus('disconnected');
    this.stopPingInterval();

    if (this.reconnectAttempts < WS_CONFIG.maxReconnectAttempts) {
      this.reconnectAttempts++;
      logger.debug(`[WS] Reconnecting... (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.attemptConnection();
      }, WS_CONFIG.reconnectInterval * this.reconnectAttempts);
    } else {
      logger.error('[WS] Max reconnect attempts reached');
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.stopPingInterval();
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.updateStatus('disconnected');
    this.authToken = null;
  }

  // ============================================================
  // PING/PONG HEARTBEAT
  // ============================================================

  private startPingInterval(): void {
    this.pingTimer = setInterval(() => {
      this.sendPing();
    }, WS_CONFIG.pingInterval);
  }

  private stopPingInterval(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private sendPing(): void {
    this.send({
      type: 'connection.ping',
      payload: { timestamp: Date.now() },
      timestamp: new Date().toISOString(),
      governance_verified: true,
    });

    this.pongTimer = setTimeout(() => {
      logger.warn('[WS] Pong timeout, reconnecting...');
      this.socket?.close();
    }, WS_CONFIG.pongTimeout);
  }

  private handlePong(): void {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  // ============================================================
  // MESSAGE HANDLING
  // ============================================================

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      // Handle pong
      if (message.type === 'connection.pong') {
        this.handlePong();
        return;
      }

      // Verify governance (Memory Prompt: Governance ALWAYS enforced)
      if (!message.governance_verified) {
        logger.warn('[WS] Message without governance verification:', message.type);
        return;
      }

      // Dispatch to subscribers
      this.dispatchMessage(message);
    } catch (error) {
      logger.error('[WS] Message parse error:', error);
    }
  }

  private dispatchMessage(message: WebSocketMessage): void {
    this.subscriptions.forEach((subscription) => {
      const eventMatch = Array.isArray(subscription.event)
        ? subscription.event.includes(message.type)
        : subscription.event === message.type;

      if (!eventMatch) return;

      // Filter by sphere if specified
      if (subscription.sphere_code && message.sphere_code !== subscription.sphere_code) {
        return;
      }

      // Filter by thread if specified
      if (subscription.thread_id && message.thread_id !== subscription.thread_id) {
        return;
      }

      try {
        subscription.callback(message);
      } catch (error) {
        logger.error('[WS] Subscription callback error:', error);
      }
    });
  }

  // ============================================================
  // SENDING MESSAGES
  // ============================================================

  send(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  subscribe(subscription: Omit<WebSocketSubscription, 'id'>): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { ...subscription, id });
    return id;
  }

  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
  }

  unsubscribeAll(): void {
    this.subscriptions.clear();
  }

  // ============================================================
  // STATUS
  // ============================================================

  private updateStatus(status: WebSocketStatus): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  onStatusChange(callback: (status: WebSocketStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  isConnected(): boolean {
    return this.status === 'connected';
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

export const wsService = new ChenuWebSocketService();

// ============================================================
// ZUSTAND STORE FOR WEBSOCKET STATE
// ============================================================

interface WebSocketState {
  status: WebSocketStatus;
  lastMessage: WebSocketMessage | null;
  messageHistory: WebSocketMessage[];
  
  // Actions
  setStatus: (status: WebSocketStatus) => void;
  addMessage: (message: WebSocketMessage) => void;
  clearHistory: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  status: 'disconnected',
  lastMessage: null,
  messageHistory: [],

  setStatus: (status) => set({ status }),
  
  addMessage: (message) => set((state) => ({
    lastMessage: message,
    messageHistory: [...state.messageHistory.slice(-99), message],
  })),
  
  clearHistory: () => set({ messageHistory: [], lastMessage: null }),
}));

// ============================================================
// REACT HOOKS
// ============================================================

import { useEffect, useCallback, useState } from 'react';

/**
 * Hook for WebSocket connection status
 */
export function useWebSocketStatus(): WebSocketStatus {
  const [status, setStatus] = useState<WebSocketStatus>(wsService.getStatus());

  useEffect(() => {
    const unsubscribe = wsService.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

/**
 * Hook for subscribing to WebSocket events
 */
export function useWebSocketEvent(
  event: WebSocketEventType | WebSocketEventType[],
  callback: (message: WebSocketMessage) => void,
  options?: { sphere_code?: string; thread_id?: string }
): void {
  useEffect(() => {
    const id = wsService.subscribe({
      event,
      callback,
      sphere_code: options?.sphere_code,
      thread_id: options?.thread_id,
    });

    return () => wsService.unsubscribe(id);
  }, [event, callback, options?.sphere_code, options?.thread_id]);
}

/**
 * Hook for thread real-time updates
 */
export function useThreadRealtime(threadId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState<string | null>(null);

  useWebSocketEvent(
    ['thread.message.new', 'thread.message.updated', 'thread.typing'],
    useCallback((message) => {
      if (message.type === 'thread.message.new') {
        setMessages((prev) => [...prev, message.payload]);
      } else if (message.type === 'thread.typing') {
        setTyping(message.payload.user);
        setTimeout(() => setTyping(null), 3000);
      }
    }, []),
    { thread_id: threadId }
  );

  return { messages, typing };
}

/**
 * Hook for Nova real-time insights
 */
export function useNovaRealtime() {
  const [insights, setInsights] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useWebSocketEvent(
    ['nova.insight', 'nova.suggestion', 'nova.alert'],
    useCallback((message) => {
      if (message.type === 'nova.insight') {
        setInsights((prev) => [...prev.slice(-9), message.payload]);
      } else if (message.type === 'nova.suggestion') {
        setSuggestions((prev) => [...prev.slice(-4), message.payload]);
      }
    }, [])
  );

  return { insights, suggestions };
}

/**
 * Hook for token budget alerts
 */
export function useTokenAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useWebSocketEvent(
    ['token.alert', 'token.budget.updated'],
    useCallback((message) => {
      if (message.type === 'token.alert') {
        setAlerts((prev) => [...prev, message.payload]);
      }
    }, [])
  );

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return { alerts, clearAlerts };
}

/**
 * Hook for agent execution progress
 */
export function useAgentExecution(executionId?: string) {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  useWebSocketEvent(
    [
      'agent.execution.started',
      'agent.execution.progress',
      'agent.execution.completed',
      'agent.execution.failed',
    ],
    useCallback((message) => {
      if (executionId && message.payload.execution_id !== executionId) {
        return;
      }

      switch (message.type) {
        case 'agent.execution.started':
          setStatus('running');
          setProgress(0);
          break;
        case 'agent.execution.progress':
          setProgress(message.payload.progress);
          break;
        case 'agent.execution.completed':
          setStatus('completed');
          setProgress(100);
          setResult(message.payload.result);
          break;
        case 'agent.execution.failed':
          setStatus('failed');
          setResult(message.payload.error);
          break;
      }
    }, [executionId])
  );

  return { status, progress, result };
}

/**
 * Hook for governance real-time checks
 */
export function useGovernanceRealtime() {
  const [lastCheck, setLastCheck] = useState<any>(null);
  const [auditEntries, setAuditEntries] = useState<any[]>([]);

  useWebSocketEvent(
    ['governance.check.passed', 'governance.check.failed', 'governance.audit.entry'],
    useCallback((message) => {
      if (message.type === 'governance.audit.entry') {
        setAuditEntries((prev) => [...prev.slice(-49), message.payload]);
      } else {
        setLastCheck({
          passed: message.type === 'governance.check.passed',
          ...message.payload,
        });
      }
    }, [])
  );

  return { lastCheck, auditEntries };
}

/**
 * Hook for sphere activity feed
 */
export function useSphereActivity(sphereCode?: string) {
  const [activities, setActivities] = useState<any[]>([]);

  useWebSocketEvent(
    ['sphere.activity', 'sphere.stats.updated'],
    useCallback((message) => {
      setActivities((prev) => [...prev.slice(-19), message.payload]);
    }, []),
    { sphere_code: sphereCode }
  );

  return activities;
}

// ============================================================
// WEBSOCKET CONNECTION COMPONENT
// ============================================================

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps): JSX.Element {
  const status = useWebSocketStatus();

  useEffect(() => {
    // Get auth token from localStorage or auth store
    const token = localStorage.getItem('chenu_access_token');
    
    if (token) {
      wsService.connect(token);
    }

    return () => {
      wsService.disconnect();
    };
  }, []);

  // Update Zustand store
  useEffect(() => {
    useWebSocketStore.getState().setStatus(status);
  }, [status]);

  return <>{children}</>;
}

// ============================================================
// CONNECTION STATUS INDICATOR
// ============================================================

export function WebSocketStatusIndicator(): JSX.Element {
  const status = useWebSocketStatus();

  const statusConfig = {
    connecting: { color: 'bg-yellow-500', label: 'Connecting...' },
    connected: { color: 'bg-green-500', label: 'Connected' },
    disconnected: { color: 'bg-gray-500', label: 'Disconnected' },
    error: { color: 'bg-red-500', label: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-gray-500">{config.label}</span>
    </div>
  );
}

export default wsService;
