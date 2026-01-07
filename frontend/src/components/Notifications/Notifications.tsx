// CHE·NU™ Notification System
// Comprehensive toast/notification management

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'loading';
type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  icon?: ReactNode;
  actions?: NotificationAction[];
  progress?: boolean;
  onDismiss?: () => void;
  createdAt: number;
  pausedAt?: number;
  remainingTime?: number;
}

interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  dismissible?: boolean;
  icon?: ReactNode;
  actions?: NotificationAction[];
  progress?: boolean;
  onDismiss?: () => void;
}

interface NotificationState {
  notifications: Notification[];
  position: NotificationPosition;
  maxNotifications: number;
  defaultDuration: number;
}

type NotificationActionType =
  | { type: 'ADD'; notification: Notification }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE'; id: string; updates: Partial<Notification> }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESUME'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_POSITION'; position: NotificationPosition }
  | { type: 'SET_MAX'; max: number };

interface NotificationContextValue {
  state: NotificationState;
  notify: (message: string, options?: NotificationOptions) => string;
  success: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  error: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  info: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  loading: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  update: (id: string, updates: Partial<Notification>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: Omit<NotificationOptions, 'type'>
  ) => Promise<T>;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const TYPE_COLORS: Record<NotificationType, { bg: string; border: string; icon: string }> = {
  info: { bg: '#EBF8FF', border: '#3182CE', icon: '#3182CE' },
  success: { bg: '#F0FFF4', border: BRAND.jungleEmerald, icon: BRAND.jungleEmerald },
  warning: { bg: '#FFFAF0', border: BRAND.sacredGold, icon: BRAND.sacredGold },
  error: { bg: '#FFF5F5', border: '#E53E3E', icon: '#E53E3E' },
  loading: { bg: '#F7FAFC', border: BRAND.cenoteTurquoise, icon: BRAND.cenoteTurquoise },
};

const TYPE_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠',
  error: '✕',
  loading: '◌',
};

// ============================================================
// UTILITIES
// ============================================================

function generateId(): string {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getPositionStyles(position: NotificationPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '400px',
    width: '100%',
    pointerEvents: 'none',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: '16px', left: '16px' };
    case 'top-center':
      return { ...base, top: '16px', left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':
      return { ...base, top: '16px', right: '16px' };
    case 'bottom-left':
      return { ...base, bottom: '16px', left: '16px', flexDirection: 'column-reverse' };
    case 'bottom-center':
      return { ...base, bottom: '16px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' };
    case 'bottom-right':
      return { ...base, bottom: '16px', right: '16px', flexDirection: 'column-reverse' };
    default:
      return { ...base, top: '16px', right: '16px' };
  }
}

// ============================================================
// REDUCER
// ============================================================

const initialState: NotificationState = {
  notifications: [],
  position: 'top-right',
  maxNotifications: 5,
  defaultDuration: 5000,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationActionType
): NotificationState {
  switch (action.type) {
    case 'ADD': {
      const notifications = [action.notification, ...state.notifications];
      // Remove oldest if exceeding max
      if (notifications.length > state.maxNotifications) {
        notifications.pop();
      }
      return { ...state, notifications };
    }
    case 'REMOVE':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    case 'UPDATE':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, ...action.updates } : n
        ),
      };
    case 'PAUSE':
      return {
        ...state,
        notifications: state.notifications.map((n) => {
          if (n.id !== action.id || !n.duration) return n;
          const elapsed = Date.now() - n.createdAt;
          return { ...n, pausedAt: Date.now(), remainingTime: n.duration - elapsed };
        }),
      };
    case 'RESUME':
      return {
        ...state,
        notifications: state.notifications.map((n) => {
          if (n.id !== action.id || !n.pausedAt) return n;
          return { ...n, createdAt: Date.now(), pausedAt: undefined, duration: n.remainingTime };
        }),
      };
    case 'CLEAR_ALL':
      return { ...state, notifications: [] };
    case 'SET_POSITION':
      return { ...state, position: action.position };
    case 'SET_MAX':
      return { ...state, maxNotifications: action.max };
    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// ============================================================
// COMPONENTS
// ============================================================

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

function NotificationItem({
  notification,
  onDismiss,
  onPause,
  onResume,
}: NotificationItemProps): JSX.Element {
  const [isExiting, setIsExiting] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const colors = TYPE_COLORS[notification.type];

  useEffect(() => {
    if (!notification.duration || notification.type === 'loading' || notification.pausedAt) {
      return;
    }

    const startTime = notification.createdAt;
    const duration = notification.duration;

    // Progress timer
    if (notification.progress) {
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 50);
    }

    // Dismiss timer
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [notification.duration, notification.pausedAt, notification.createdAt]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      notification.onDismiss?.();
      onDismiss(notification.id);
    }, 200);
  }, [notification, onDismiss]);

  const handleMouseEnter = useCallback(() => {
    if (notification.duration && !notification.pausedAt) {
      onPause(notification.id);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    }
  }, [notification, onPause]);

  const handleMouseLeave = useCallback(() => {
    if (notification.pausedAt) {
      onResume(notification.id);
    }
  }, [notification, onResume]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.bg,
    borderLeft: `4px solid ${colors.border}`,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    pointerEvents: 'auto',
    animation: isExiting ? 'slideOut 0.2s ease-out forwards' : 'slideIn 0.3s ease-out',
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
    transition: 'opacity 0.2s, transform 0.2s',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: colors.border,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
    animation: notification.type === 'loading' ? 'spin 1s linear infinite' : 'none',
  };

  const textStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: notification.title ? '4px' : 0,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  };

  const dismissStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '18px',
    color: BRAND.ancientStone,
    opacity: 0.6,
    transition: 'opacity 0.2s',
    flexShrink: 0,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  };

  const actionButtonStyle = (variant: NotificationAction['variant']): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    backgroundColor:
      variant === 'primary'
        ? BRAND.sacredGold
        : variant === 'danger'
        ? '#E53E3E'
        : 'transparent',
    color: variant === 'secondary' ? BRAND.uiSlate : '#fff',
    textDecoration: variant === 'secondary' ? 'underline' : 'none',
  });

  const progressStyle: React.CSSProperties = {
    height: '3px',
    backgroundColor: colors.border,
    width: `${progress}%`,
    transition: 'width 0.05s linear',
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <div style={contentStyle}>
        <div style={iconStyle}>
          {notification.icon || TYPE_ICONS[notification.type]}
        </div>
        <div style={textStyle}>
          {notification.title && <div style={titleStyle}>{notification.title}</div>}
          <div style={messageStyle}>{notification.message}</div>
          {notification.actions && notification.actions.length > 0 && (
            <div style={actionsStyle}>
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  style={actionButtonStyle(action.variant)}
                  onClick={() => {
                    action.onClick();
                    handleDismiss();
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {notification.dismissible !== false && (
          <button
            style={dismissStyle}
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        )}
      </div>
      {notification.progress && notification.duration && (
        <div style={{ backgroundColor: `${colors.border}30` }}>
          <div style={progressStyle} />
        </div>
      )}
    </div>
  );
}

interface NotificationProviderProps {
  children: ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
  defaultDuration?: number;
}

export function NotificationProvider({
  children,
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000,
}: NotificationProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(notificationReducer, {
    ...initialState,
    position,
    maxNotifications,
    defaultDuration,
  });

  const notify = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      const id = generateId();
      const notification: Notification = {
        id,
        type: options.type || 'info',
        title: options.title,
        message,
        duration: options.duration ?? (options.type === 'loading' ? undefined : defaultDuration),
        dismissible: options.dismissible ?? true,
        icon: options.icon,
        actions: options.actions,
        progress: options.progress ?? true,
        onDismiss: options.onDismiss,
        createdAt: Date.now(),
      };
      dispatch({ type: 'ADD', notification });
      return id;
    },
    [defaultDuration]
  );

  const success = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'success' }),
    [notify]
  );

  const error = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'error' }),
    [notify]
  );

  const warning = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'warning' }),
    [notify]
  );

  const info = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'info' }),
    [notify]
  );

  const loading = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'loading', dismissible: false, progress: false }),
    [notify]
  );

  const update = useCallback((id: string, updates: Partial<Notification>) => {
    dispatch({ type: 'UPDATE', id, updates });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const pause = useCallback((id: string) => {
    dispatch({ type: 'PAUSE', id });
  }, []);

  const resume = useCallback((id: string) => {
    dispatch({ type: 'RESUME', id });
  }, []);

  const promiseNotification = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      },
      options?: Omit<NotificationOptions, 'type'>
    ): Promise<T> => {
      const id = loading(messages.loading, options);

      try {
        const result = await promise;
        update(id, {
          type: 'success',
          message: typeof messages.success === 'function' ? messages.success(result) : messages.success,
          dismissible: true,
          duration: defaultDuration,
          progress: true,
          createdAt: Date.now(),
        });
        return result;
      } catch (err) {
        const errorMessage =
          typeof messages.error === 'function'
            ? messages.error(err as Error)
            : messages.error;
        update(id, {
          type: 'error',
          message: errorMessage,
          dismissible: true,
          duration: defaultDuration * 1.5,
          progress: true,
          createdAt: Date.now(),
        });
        throw err;
      }
    },
    [loading, update, defaultDuration]
  );

  const contextValue: NotificationContextValue = {
    state,
    notify,
    success,
    error,
    warning,
    info,
    loading,
    update,
    dismiss,
    dismissAll,
    promise: promiseNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div style={getPositionStyles(state.position)}>
        {state.notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
            onPause={pause}
            onResume={resume}
          />
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

// ============================================================
// STANDALONE TOAST FUNCTION
// ============================================================

let globalNotify: NotificationContextValue['notify'] | null = null;
let globalSuccess: NotificationContextValue['success'] | null = null;
let globalError: NotificationContextValue['error'] | null = null;
let globalWarning: NotificationContextValue['warning'] | null = null;
let globalInfo: NotificationContextValue['info'] | null = null;
let globalLoading: NotificationContextValue['loading'] | null = null;
let globalDismiss: NotificationContextValue['dismiss'] | null = null;
let globalDismissAll: NotificationContextValue['dismissAll'] | null = null;
let globalPromise: NotificationContextValue['promise'] | null = null;

export function initToast(context: NotificationContextValue): void {
  globalNotify = context.notify;
  globalSuccess = context.success;
  globalError = context.error;
  globalWarning = context.warning;
  globalInfo = context.info;
  globalLoading = context.loading;
  globalDismiss = context.dismiss;
  globalDismissAll = context.dismissAll;
  globalPromise = context.promise;
}

export const toast = {
  notify: (message: string, options?: NotificationOptions) => {
    if (!globalNotify) throw new Error('Toast not initialized. Wrap your app with NotificationProvider.');
    return globalNotify(message, options);
  },
  success: (message: string, options?: Omit<NotificationOptions, 'type'>) => {
    if (!globalSuccess) throw new Error('Toast not initialized.');
    return globalSuccess(message, options);
  },
  error: (message: string, options?: Omit<NotificationOptions, 'type'>) => {
    if (!globalError) throw new Error('Toast not initialized.');
    return globalError(message, options);
  },
  warning: (message: string, options?: Omit<NotificationOptions, 'type'>) => {
    if (!globalWarning) throw new Error('Toast not initialized.');
    return globalWarning(message, options);
  },
  info: (message: string, options?: Omit<NotificationOptions, 'type'>) => {
    if (!globalInfo) throw new Error('Toast not initialized.');
    return globalInfo(message, options);
  },
  loading: (message: string, options?: Omit<NotificationOptions, 'type'>) => {
    if (!globalLoading) throw new Error('Toast not initialized.');
    return globalLoading(message, options);
  },
  dismiss: (id: string) => {
    if (!globalDismiss) throw new Error('Toast not initialized.');
    return globalDismiss(id);
  },
  dismissAll: () => {
    if (!globalDismissAll) throw new Error('Toast not initialized.');
    return globalDismissAll();
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: Omit<NotificationOptions, 'type'>
  ) => {
    if (!globalPromise) throw new Error('Toast not initialized.');
    return globalPromise(promise, messages, options);
  },
};

// ============================================================
// HOOK FOR INITIALIZATION
// ============================================================

export function useToastInit(): void {
  const context = useNotifications();
  useEffect(() => {
    initToast(context);
  }, [context]);
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  Notification,
  NotificationOptions,
  NotificationType,
  NotificationPosition,
  NotificationAction,
  NotificationContextValue,
};

export default {
  Provider: NotificationProvider,
  useNotifications,
  useToastInit,
  toast,
};
