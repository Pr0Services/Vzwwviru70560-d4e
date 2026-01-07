/**
 * CHE·NU™ - WEBSOCKET SERVICE
 * Real-time communication client for threads, agents, and notifications
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type MessageType =
  | 'connect'
  | 'disconnect'
  | 'ping'
  | 'pong'
  | 'thread_message'
  | 'thread_update'
  | 'thread_typing'
  | 'agent_status'
  | 'agent_task_start'
  | 'agent_task_progress'
  | 'agent_task_complete'
  | 'agent_task_error'
  | 'nova_response'
  | 'nova_suggestion'
  | 'nova_governance_alert'
  | 'token_update'
  | 'token_alert'
  | 'notification'
  | 'sphere_update'
  | 'error';

export interface WSMessage<T = unknown> {
  type: MessageType;
  data: T;
  timestamp: string;
  sender_id?: string;
  target_id?: string;
}

export type MessageHandler<T = unknown> = (message: WSMessage<T>) => void;

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  pingInterval?: number;
  debug?: boolean;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

// ═══════════════════════════════════════════════════════════════
// DEFAULT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: Partial<WebSocketConfig> = {
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  pingInterval: 30000,
  debug: false,
};

// ═══════════════════════════════════════════════════════════════
// WEBSOCKET SERVICE CLASS
// ═══════════════════════════════════════════════════════════════

export class WebSocketService {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private userId: string;
  private state: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  
  // Event handlers
  private messageHandlers: Map<MessageType, Set<MessageHandler>> = new Map();
  private globalHandlers: Set<MessageHandler> = new Set();
  private stateChangeHandlers: Set<(state: ConnectionState) => void> = new Set();
  
  // Subscriptions tracking
  private subscriptions: Set<string> = new Set();

  constructor(userId: string, config: Partial<WebSocketConfig> = {}) {
    this.userId = userId;
    this.config = {
      url: config.url || `ws://localhost:8000/ws/${userId}`,
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Connection Management
  // ─────────────────────────────────────────────────────────────

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.setState('connecting');
      this.log('Connecting to WebSocket...');

      try {
        this.socket = new WebSocket(this.config.url);

        this.socket.onopen = () => {
          this.log('WebSocket connected');
          this.setState('connected');
          this.reconnectAttempts = 0;
          this.startPingInterval();
          
          // Resubscribe to previous subscriptions
          this.resubscribe();
          
          resolve();
        };

        this.socket.onclose = (event) => {
          this.log(`WebSocket closed: ${event.code} ${event.reason}`);
          this.handleDisconnect();
        };

        this.socket.onerror = (error) => {
          this.log('WebSocket error:', error);
          this.setState('error');
          reject(error);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        this.setState('error');
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.log('Disconnecting...');
    this.stopPingInterval();
    this.clearReconnectTimeout();
    
    if (this.socket) {
      this.socket.close(1000, 'User disconnect');
      this.socket = null;
    }
    
    this.setState('disconnected');
  }

  private handleDisconnect(): void {
    this.stopPingInterval();
    
    if (this.state !== 'disconnected') {
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      this.log('Max reconnect attempts reached');
      this.setState('error');
      return;
    }

    this.setState('reconnecting');
    this.reconnectAttempts++;
    
    this.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        // Will retry automatically
      });
    }, this.config.reconnectInterval);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Ping/Pong
  // ─────────────────────────────────────────────────────────────

  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping', data: { timestamp: new Date().toISOString() }, timestamp: new Date().toISOString() });
    }, this.config.pingInterval);
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // State Management
  // ─────────────────────────────────────────────────────────────

  private setState(state: ConnectionState): void {
    if (this.state !== state) {
      this.state = state;
      this.stateChangeHandlers.forEach((handler) => handler(state));
    }
  }

  getState(): ConnectionState {
    return this.state;
  }

  isConnected(): boolean {
    return this.state === 'connected' && this.socket?.readyState === WebSocket.OPEN;
  }

  // ─────────────────────────────────────────────────────────────
  // Message Handling
  // ─────────────────────────────────────────────────────────────

  private handleMessage(raw: string): void {
    try {
      const message: WSMessage = JSON.parse(raw);
      this.log('Received:', message.type, message.data);

      // Call type-specific handlers
      const typeHandlers = this.messageHandlers.get(message.type);
      if (typeHandlers) {
        typeHandlers.forEach((handler) => handler(message));
      }

      // Call global handlers
      this.globalHandlers.forEach((handler) => handler(message));
    } catch (error) {
      this.log('Error parsing message:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Sending Messages
  // ─────────────────────────────────────────────────────────────

  send<T>(message: WSMessage<T>): boolean {
    if (!this.isConnected()) {
      this.log('Cannot send: not connected');
      return false;
    }

    try {
      this.socket!.send(JSON.stringify(message));
      this.log('Sent:', message.type, message.data);
      return true;
    } catch (error) {
      this.log('Error sending message:', error);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────

  subscribeSphere(sphereId: string): boolean {
    this.subscriptions.add(`sphere:${sphereId}`);
    return this.send({
      type: 'subscribe_sphere' as MessageType,
      data: { sphere_id: sphereId },
      timestamp: new Date().toISOString(),
    });
  }

  unsubscribeSphere(sphereId: string): boolean {
    this.subscriptions.delete(`sphere:${sphereId}`);
    return this.send({
      type: 'unsubscribe_sphere' as MessageType,
      data: { sphere_id: sphereId },
      timestamp: new Date().toISOString(),
    });
  }

  subscribeThread(threadId: string): boolean {
    this.subscriptions.add(`thread:${threadId}`);
    return this.send({
      type: 'subscribe_thread' as MessageType,
      data: { thread_id: threadId },
      timestamp: new Date().toISOString(),
    });
  }

  unsubscribeThread(threadId: string): boolean {
    this.subscriptions.delete(`thread:${threadId}`);
    return this.send({
      type: 'unsubscribe_thread' as MessageType,
      data: { thread_id: threadId },
      timestamp: new Date().toISOString(),
    });
  }

  private resubscribe(): void {
    this.subscriptions.forEach((sub) => {
      const [type, id] = sub.split(':');
      if (type === 'sphere') {
        this.subscribeSphere(id);
      } else if (type === 'thread') {
        this.subscribeThread(id);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Specialized Sends
  // ─────────────────────────────────────────────────────────────

  sendTyping(threadId: string, isTyping: boolean): boolean {
    return this.send({
      type: 'thread_typing',
      data: { thread_id: threadId, is_typing: isTyping },
      timestamp: new Date().toISOString(),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Event Subscription
  // ─────────────────────────────────────────────────────────────

  on<T = unknown>(type: MessageType, handler: MessageHandler<T>): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler as MessageHandler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler as MessageHandler);
    };
  }

  onAny(handler: MessageHandler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  onStateChange(handler: (state: ConnectionState) => void): () => void {
    this.stateChangeHandlers.add(handler);
    return () => {
      this.stateChangeHandlers.delete(handler);
    };
  }

  off(type: MessageType, handler?: MessageHandler): void {
    if (handler) {
      this.messageHandlers.get(type)?.delete(handler);
    } else {
      this.messageHandlers.delete(type);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Utility
  // ─────────────────────────────────────────────────────────────

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      logger.debug('[CHE·NU WS]', ...args);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════

let instance: WebSocketService | null = null;

export function getWebSocketService(userId?: string): WebSocketService {
  if (!instance && userId) {
    instance = new WebSocketService(userId, {
      url: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${userId}`,
      debug: process.env.NODE_ENV === 'development',
    });
  }
  return instance!;
}

export function createWebSocketService(userId: string, config?: Partial<WebSocketConfig>): WebSocketService {
  instance = new WebSocketService(userId, config);
  return instance;
}

export default WebSocketService;
