/**
 * ============================================================================
 * CHE·NU™ V70 — WEBSOCKET SERVICE
 * ============================================================================
 * Real-time communication service connecting to Backend V69 WebSocket
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - Checkpoint events require immediate UI response
 * - All events are logged for audit
 * ============================================================================
 */

import { API_CONFIG } from './config';
import type {
  WSMessage,
  WSMessageType,
  SimulationTickPayload,
  CheckpointPendingPayload,
} from '../../types/api.types';
import { getAccessToken } from './http-client';

export type WSEventHandler<T = unknown> = (message: WSMessage<T>) => void;

export interface WSConnectionOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

const defaultOptions: WSConnectionOptions = {
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: Map<WSMessageType | '*', WSEventHandler[]> = new Map();
  private reconnectAttempts: number = 0;
  private options: WSConnectionOptions;
  private heartbeatTimer: number | null = null;
  private simulationId: string | null = null;

  constructor() {
    this.options = defaultOptions;
  }

  /**
   * Connect to WebSocket for simulation
   */
  connect(simulationId: string, options?: WSConnectionOptions): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.options = { ...defaultOptions, ...options };
    this.simulationId = simulationId;

    const token = getAccessToken();
    const wsUrl = `${API_CONFIG.WS_URL}/simulation/${simulationId}${token ? `?token=${token}` : ''}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(`[WS] Connected to simulation: ${simulationId}`);
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('[WS] Failed to parse message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('[WS] Error:', error);
    };

    this.socket.onclose = (event) => {
      console.log(`[WS] Disconnected: ${event.code} - ${event.reason}`);
      this.stopHeartbeat();

      if (this.options.autoReconnect && this.reconnectAttempts < (this.options.maxReconnectAttempts || 10)) {
        this.reconnectAttempts++;
        console.log(`[WS] Reconnecting in ${this.options.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(simulationId, this.options), this.options.reconnectInterval);
      }
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.stopHeartbeat();
    this.simulationId = null;
  }

  /**
   * Subscribe to specific event type
   */
  on<T>(eventType: WSMessageType | '*', handler: WSEventHandler<T>): () => void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler as WSEventHandler);
    this.eventHandlers.set(eventType, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.eventHandlers.get(eventType) || [];
      const index = currentHandlers.indexOf(handler as WSEventHandler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        this.eventHandlers.set(eventType, currentHandlers);
      }
    };
  }

  /**
   * Subscribe to simulation tick events
   */
  onTick(handler: (payload: SimulationTickPayload) => void): () => void {
    return this.on<SimulationTickPayload>('simulation.tick', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to simulation completion
   */
  onComplete(handler: (payload: unknown) => void): () => void {
    return this.on('simulation.completed', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to checkpoint pending events
   * CRITICAL: These require immediate human action
   */
  onCheckpointPending(handler: (payload: CheckpointPendingPayload) => void): () => void {
    return this.on<CheckpointPendingPayload>('checkpoint.pending', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to checkpoint resolved events
   */
  onCheckpointResolved(handler: (payload: unknown) => void): () => void {
    return this.on('checkpoint.resolved', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to agent action events
   */
  onAgentAction(handler: (payload: unknown) => void): () => void {
    return this.on('agent.action', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to XR chunk ready events
   */
  onXRChunkReady(handler: (payload: unknown) => void): () => void {
    return this.on('xr.chunk_ready', (msg) => handler(msg.payload));
  }

  /**
   * Subscribe to all events
   */
  onAny(handler: WSEventHandler): () => void {
    return this.on('*', handler);
  }

  /**
   * Send message through WebSocket
   */
  send(message: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('[WS] Cannot send message: socket not connected');
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Get current simulation ID
   */
  getCurrentSimulation(): string | null {
    return this.simulationId;
  }

  private handleMessage(message: WSMessage): void {
    // Call specific handlers
    const handlers = this.eventHandlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    // Call wildcard handlers
    const wildcardHandlers = this.eventHandlers.get('*') || [];
    wildcardHandlers.forEach(handler => handler(message));

    // Log for audit
    console.log(`[WS] Event: ${message.type}`, message.payload);
  }

  private startHeartbeat(): void {
    if (this.options.heartbeatInterval) {
      this.heartbeatTimer = window.setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.send({ type: 'ping', timestamp: new Date().toISOString() });
        }
      }, this.options.heartbeatInterval);
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
