/**
 * CHE·NU™ - WEBSOCKET HOOKS
 * React hooks for WebSocket integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  WebSocketService, 
  ConnectionState, 
  MessageType, 
  WSMessage,
  getWebSocketService,
  createWebSocketService,
} from '../services/websocket/WebSocketService';

// ═══════════════════════════════════════════════════════════════
// useWebSocket - Main WebSocket Hook
// ═══════════════════════════════════════════════════════════════

interface UseWebSocketOptions {
  userId: string;
  autoConnect?: boolean;
  debug?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  state: ConnectionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: <T>(message: WSMessage<T>) => boolean;
  subscribeSphere: (sphereId: string) => void;
  unsubscribeSphere: (sphereId: string) => void;
  subscribeThread: (threadId: string) => void;
  unsubscribeThread: (threadId: string) => void;
  sendTyping: (threadId: string, isTyping: boolean) => void;
  on: <T>(type: MessageType, handler: (message: WSMessage<T>) => void) => () => void;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const { userId, autoConnect = true, debug = false } = options;
  const [state, setState] = useState<ConnectionState>('disconnected');
  const serviceRef = useRef<WebSocketService | null>(null);

  // Initialize service
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = createWebSocketService(userId, {
        debug,
        url: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${userId}`,
      });
    }

    const service = serviceRef.current;

    // Listen for state changes
    const unsubscribe = service.onStateChange(setState);

    // Auto-connect if enabled
    if (autoConnect) {
      service.connect().catch(console.error);
    }

    return () => {
      unsubscribe();
      service.disconnect();
    };
  }, [userId, autoConnect, debug]);

  const connect = useCallback(async () => {
    await serviceRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    serviceRef.current?.disconnect();
  }, []);

  const send = useCallback(<T>(message: WSMessage<T>) => {
    return serviceRef.current?.send(message) || false;
  }, []);

  const subscribeSphere = useCallback((sphereId: string) => {
    serviceRef.current?.subscribeSphere(sphereId);
  }, []);

  const unsubscribeSphere = useCallback((sphereId: string) => {
    serviceRef.current?.unsubscribeSphere(sphereId);
  }, []);

  const subscribeThread = useCallback((threadId: string) => {
    serviceRef.current?.subscribeThread(threadId);
  }, []);

  const unsubscribeThread = useCallback((threadId: string) => {
    serviceRef.current?.unsubscribeThread(threadId);
  }, []);

  const sendTyping = useCallback((threadId: string, isTyping: boolean) => {
    serviceRef.current?.sendTyping(threadId, isTyping);
  }, []);

  const on = useCallback(<T>(type: MessageType, handler: (message: WSMessage<T>) => void) => {
    return serviceRef.current?.on(type, handler) || (() => {});
  }, []);

  return {
    isConnected: state === 'connected',
    state,
    connect,
    disconnect,
    send,
    subscribeSphere,
    unsubscribeSphere,
    subscribeThread,
    unsubscribeThread,
    sendTyping,
    on,
  };
}

// ═══════════════════════════════════════════════════════════════
// useThreadMessages - Thread-specific messages
// ═══════════════════════════════════════════════════════════════

interface ThreadMessage {
  id: string;
  role: string;
  content: string;
  tokens_used: number;
  timestamp: string;
}

interface UseThreadMessagesReturn {
  messages: ThreadMessage[];
  isTyping: boolean;
  typingUsers: string[];
}

export function useThreadMessages(ws: UseWebSocketReturn, threadId: string): UseThreadMessagesReturn {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!threadId) return;

    // Subscribe to thread
    ws.subscribeThread(threadId);

    // Listen for new messages
    const unsubMessage = ws.on<ThreadMessage>('thread_message', (msg) => {
      if (msg.target_id === threadId) {
        setMessages((prev) => [...prev, msg.data]);
      }
    });

    // Listen for typing indicators
    const unsubTyping = ws.on<{ user_id: string; is_typing: boolean }>('thread_typing', (msg) => {
      const { user_id, is_typing } = msg.data;
      setTypingUsers((prev) => {
        if (is_typing && !prev.includes(user_id)) {
          return [...prev, user_id];
        } else if (!is_typing) {
          return prev.filter((id) => id !== user_id);
        }
        return prev;
      });
    });

    return () => {
      ws.unsubscribeThread(threadId);
      unsubMessage();
      unsubTyping();
    };
  }, [ws, threadId]);

  return {
    messages,
    isTyping: typingUsers.length > 0,
    typingUsers,
  };
}

// ═══════════════════════════════════════════════════════════════
// useAgentStatus - Agent status updates
// ═══════════════════════════════════════════════════════════════

interface AgentStatus {
  agentId: string;
  status: string;
  taskId?: string;
  progress?: number;
  message?: string;
}

export function useAgentStatus(ws: UseWebSocketReturn): Map<string, AgentStatus> {
  const [statuses, setStatuses] = useState<Map<string, AgentStatus>>(new Map());

  useEffect(() => {
    const unsubStatus = ws.on<{ agent_id: string; status: string; task_id?: string }>('agent_status', (msg) => {
      setStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(msg.data.agent_id, {
          agentId: msg.data.agent_id,
          status: msg.data.status,
          taskId: msg.data.task_id,
        });
        return newMap;
      });
    });

    const unsubProgress = ws.on<{ task_id: string; progress: number; message: string }>('agent_task_progress', (msg) => {
      setStatuses((prev) => {
        const newMap = new Map(prev);
        // Find agent by task_id and update
        for (const [agentId, status] of newMap) {
          if (status.taskId === msg.data.task_id) {
            newMap.set(agentId, {
              ...status,
              progress: msg.data.progress,
              message: msg.data.message,
            });
            break;
          }
        }
        return newMap;
      });
    });

    return () => {
      unsubStatus();
      unsubProgress();
    };
  }, [ws]);

  return statuses;
}

// ═══════════════════════════════════════════════════════════════
// useTokenUpdates - Token budget updates
// ═══════════════════════════════════════════════════════════════

interface TokenUpdate {
  budgetId: string;
  used: number;
  remaining: number;
  timestamp: string;
}

interface TokenAlert {
  budgetId: string;
  alertType: string;
  message: string;
  timestamp: string;
}

export function useTokenUpdates(ws: UseWebSocketReturn): {
  updates: TokenUpdate[];
  alerts: TokenAlert[];
} {
  const [updates, setUpdates] = useState<TokenUpdate[]>([]);
  const [alerts, setAlerts] = useState<TokenAlert[]>([]);

  useEffect(() => {
    const unsubUpdate = ws.on<{ budget_id: string; used: number; remaining: number }>('token_update', (msg) => {
      setUpdates((prev) => [
        ...prev,
        {
          budgetId: msg.data.budget_id,
          used: msg.data.used,
          remaining: msg.data.remaining,
          timestamp: msg.timestamp,
        },
      ].slice(-50)); // Keep last 50
    });

    const unsubAlert = ws.on<{ budget_id: string; alert_type: string; message: string }>('token_alert', (msg) => {
      setAlerts((prev) => [
        ...prev,
        {
          budgetId: msg.data.budget_id,
          alertType: msg.data.alert_type,
          message: msg.data.message,
          timestamp: msg.timestamp,
        },
      ].slice(-20)); // Keep last 20
    });

    return () => {
      unsubUpdate();
      unsubAlert();
    };
  }, [ws]);

  return { updates, alerts };
}

// ═══════════════════════════════════════════════════════════════
// useNotifications - General notifications
// ═══════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export function useNotifications(ws: UseWebSocketReturn): {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
} {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubNotification = ws.on<{ title: string; message: string; notification_type: string }>('notification', (msg) => {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: msg.data.title,
          message: msg.data.message,
          type: msg.data.notification_type as Notification['type'],
          timestamp: msg.timestamp,
          read: false,
        },
        ...prev,
      ].slice(0, 100)); // Keep last 100
    });

    return () => {
      unsubNotification();
    };
  }, [ws]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAsRead, clearAll };
}

// ═══════════════════════════════════════════════════════════════
// useNovaResponses - Nova AI responses
// ═══════════════════════════════════════════════════════════════

interface NovaResponse {
  response: string;
  threadId?: string;
  timestamp: string;
}

interface NovaGovernanceAlert {
  alertType: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export function useNovaResponses(ws: UseWebSocketReturn): {
  lastResponse: NovaResponse | null;
  governanceAlerts: NovaGovernanceAlert[];
} {
  const [lastResponse, setLastResponse] = useState<NovaResponse | null>(null);
  const [governanceAlerts, setGovernanceAlerts] = useState<NovaGovernanceAlert[]>([]);

  useEffect(() => {
    const unsubResponse = ws.on<{ response: string; thread_id?: string }>('nova_response', (msg) => {
      setLastResponse({
        response: msg.data.response,
        threadId: msg.data.thread_id,
        timestamp: msg.timestamp,
      });
    });

    const unsubGovernance = ws.on<{ alert_type: string; message: string; details: Record<string, unknown> }>('nova_governance_alert', (msg) => {
      setGovernanceAlerts((prev) => [
        {
          alertType: msg.data.alert_type,
          message: msg.data.message,
          details: msg.data.details,
          timestamp: msg.timestamp,
        },
        ...prev,
      ].slice(0, 50));
    });

    return () => {
      unsubResponse();
      unsubGovernance();
    };
  }, [ws]);

  return { lastResponse, governanceAlerts };
}

export default useWebSocket;
