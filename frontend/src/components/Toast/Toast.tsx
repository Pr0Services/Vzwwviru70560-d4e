// CHE·NU™ Toast & Notification System
// Comprehensive notification management with stacking, actions, and persistence

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'custom';
type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'link';
}

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string | ReactNode;
  duration?: number;
  dismissible?: boolean;
  icon?: ReactNode;
  actions?: ToastAction[];
  progress?: boolean;
  persistent?: boolean;
  onDismiss?: () => void;
  className?: string;
  createdAt: number;
}

interface ToastOptions extends Omit<Toast, 'id' | 'createdAt'> {
  id?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions | string) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  loading: (message: string, options?: Partial<ToastOptions>) => string;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
  gap?: number;
  containerClassName?: string;
}

interface ToastContainerProps {
  position?: ToastPosition;
  toasts: Toast[];
  onDismiss: (id: string) => void;
  gap?: number;
  className?: string;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
  isExiting?: boolean;
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

// ============================================================
// CONSTANTS
// ============================================================

const TOAST_TYPES: Record<ToastType, { icon: string; color: string; bgColor: string }> = {
  info: {
    icon: 'ℹ️',
    color: '#3182CE',
    bgColor: '#EBF8FF',
  },
  success: {
    icon: '✅',
    color: '#38A169',
    bgColor: '#F0FFF4',
  },
  warning: {
    icon: '⚠️',
    color: '#DD6B20',
    bgColor: '#FFFAF0',
  },
  error: {
    icon: '❌',
    color: '#E53E3E',
    bgColor: '#FFF5F5',
  },
  loading: {
    icon: '⏳',
    color: BRAND.cenoteTurquoise,
    bgColor: `${BRAND.cenoteTurquoise}10`,
  },
  custom: {
    icon: '',
    color: BRAND.uiSlate,
    bgColor: '#ffffff',
  },
};

const DEFAULT_DURATION = 5000;
const DEFAULT_MAX_TOASTS = 5;
const DEFAULT_GAP = 12;

// ============================================================
// UTILITIES
// ============================================================

let toastIdCounter = 0;

function generateToastId(): string {
  return `toast-${++toastIdCounter}-${Date.now()}`;
}

function getPositionStyles(position: ToastPosition): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'none',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: 20, left: 20, alignItems: 'flex-start' };
    case 'top-center':
      return { ...base, top: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
    case 'top-right':
      return { ...base, top: 20, right: 20, alignItems: 'flex-end' };
    case 'bottom-left':
      return { ...base, bottom: 20, left: 20, alignItems: 'flex-start', flexDirection: 'column-reverse' };
    case 'bottom-center':
      return { ...base, bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center', flexDirection: 'column-reverse' };
    case 'bottom-right':
      return { ...base, bottom: 20, right: 20, alignItems: 'flex-end', flexDirection: 'column-reverse' };
    default:
      return { ...base, top: 20, right: 20, alignItems: 'flex-end' };
  }
}

function getEnterAnimation(position: ToastPosition): string {
  if (position.includes('left')) return 'slideInLeft';
  if (position.includes('right')) return 'slideInRight';
  if (position.includes('top')) return 'slideInDown';
  return 'slideInUp';
}

function getExitAnimation(position: ToastPosition): string {
  if (position.includes('left')) return 'slideOutLeft';
  if (position.includes('right')) return 'slideOutRight';
  if (position.includes('top')) return 'slideOutUp';
  return 'slideOutDown';
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    minWidth: '300px',
    maxWidth: '420px',
    pointerEvents: 'auto' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  toastIcon: {
    fontSize: '20px',
    lineHeight: 1,
    flexShrink: 0,
    marginTop: '2px',
  },

  toastContent: {
    flex: 1,
    minWidth: 0,
  },

  toastTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  toastMessage: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  },

  toastActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },

  toastActionButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: 'none',
  },

  toastActionPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  toastActionSecondary: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
  },

  toastActionLink: {
    backgroundColor: 'transparent',
    color: BRAND.cenoteTurquoise,
    padding: '6px 0',
  },

  toastDismiss: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    color: BRAND.ancientStone,
    fontSize: '16px',
    lineHeight: 1,
    transition: 'all 0.15s',
    opacity: 0.6,
  },

  toastDismissHover: {
    opacity: 1,
    backgroundColor: `${BRAND.ancientStone}15`,
  },

  toastProgress: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    backgroundColor: `${BRAND.ancientStone}20`,
  },

  toastProgressBar: {
    height: '100%',
    transition: 'width linear',
  },

  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: `2px solid ${BRAND.ancientStone}30`,
    borderTopColor: BRAND.cenoteTurquoise,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Notification center styles
  notificationCenter: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '400px',
    maxWidth: '100vw',
    backgroundColor: '#ffffff',
    boxShadow: '-4px 0 30px rgba(0, 0, 0, 0.15)',
    zIndex: 10001,
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideInRight 0.3s ease-out',
  },

  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  notificationTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  notificationHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  notificationClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    color: BRAND.ancientStone,
    lineHeight: 1,
    padding: '4px',
    borderRadius: '4px',
  },

  notificationClearAll: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.cenoteTurquoise,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.15s',
  },

  notificationBody: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
  },

  notificationEmpty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    textAlign: 'center' as const,
  },

  notificationEmptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  notificationEmptyText: {
    fontSize: '15px',
    color: BRAND.ancientStone,
  },

  notificationItem: {
    display: 'flex',
    gap: '12px',
    padding: '14px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    transition: 'all 0.15s',
    cursor: 'pointer',
  },

  notificationItemHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 1px ${BRAND.sacredGold}`,
  },

  notificationItemUnread: {
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
    borderLeftWidth: '3px',
    borderLeftColor: BRAND.cenoteTurquoise,
  },

  notificationItemIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },

  notificationItemContent: {
    flex: 1,
    minWidth: 0,
  },

  notificationItemTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  notificationItemMessage: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },

  notificationItemTime: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    marginTop: '6px',
    opacity: 0.8,
  },

  notificationItemDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: BRAND.cenoteTurquoise,
    flexShrink: 0,
    marginTop: '6px',
  },

  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10000,
    animation: 'fadeIn 0.2s ease-out',
  },
};

// ============================================================
// CONTEXT
// ============================================================

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ============================================================
// TOAST ITEM COMPONENT
// ============================================================

function ToastItem({ toast, onDismiss, isExiting }: ToastItemProps): JSX.Element {
  const [timeLeft, setTimeLeft] = useState(toast.duration || DEFAULT_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissHovered, setDismissHovered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timeLeftRef = useRef(timeLeft);

  const typeConfig = TOAST_TYPES[toast.type];

  useEffect(() => {
    if (toast.persistent || toast.duration === 0 || isPaused) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = timeLeftRef.current - elapsed;

      if (remaining <= 0) {
        onDismiss();
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, toast.persistent, toast.duration, onDismiss]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  }, []);

  const progress = toast.duration
    ? (timeLeft / toast.duration) * 100
    : 100;

  return (
    <div
      style={{
        ...styles.toast,
        backgroundColor: toast.type !== 'custom' ? typeConfig.bgColor : '#ffffff',
        borderLeftColor: typeConfig.color,
        borderLeftWidth: '4px',
        animation: isExiting ? 'slideOutRight 0.2s ease-out forwards' : 'slideInRight 0.2s ease-out',
      }}
      className={toast.className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon */}
      <div style={styles.toastIcon}>
        {toast.icon || (
          toast.type === 'loading' ? (
            <div style={styles.loadingSpinner} />
          ) : (
            typeConfig.icon
          )
        )}
      </div>

      {/* Content */}
      <div style={styles.toastContent}>
        {toast.title && <div style={styles.toastTitle}>{toast.title}</div>}
        <div style={styles.toastMessage}>{toast.message}</div>

        {/* Actions */}
        {toast.actions && toast.actions.length > 0 && (
          <div style={styles.toastActions}>
            {toast.actions.map((action, index) => (
              <button
                key={index}
                style={{
                  ...styles.toastActionButton,
                  ...(action.variant === 'primary' && styles.toastActionPrimary),
                  ...(action.variant === 'secondary' && styles.toastActionSecondary),
                  ...(action.variant === 'link' && styles.toastActionLink),
                }}
                onClick={() => {
                  action.onClick();
                  onDismiss();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      {toast.dismissible !== false && (
        <button
          style={{
            ...styles.toastDismiss,
            ...(dismissHovered && styles.toastDismissHover),
          }}
          onClick={onDismiss}
          onMouseEnter={() => setDismissHovered(true)}
          onMouseLeave={() => setDismissHovered(false)}
        >
          ×
        </button>
      )}

      {/* Progress bar */}
      {toast.progress && toast.duration && !toast.persistent && (
        <div style={styles.toastProgress}>
          <div
            style={{
              ...styles.toastProgressBar,
              width: `${progress}%`,
              backgroundColor: typeConfig.color,
              transitionDuration: isPaused ? '0s' : '100ms',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOAST CONTAINER COMPONENT
// ============================================================

function ToastContainer({
  position = 'top-right',
  toasts,
  onDismiss,
  gap = DEFAULT_GAP,
  className,
}: ToastContainerProps): JSX.Element {
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((id: string) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onDismiss(id);
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  }, [onDismiss]);

  return (
    <div style={{ ...getPositionStyles(position), gap }} className={className}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => handleDismiss(toast.id)}
          isExiting={exitingIds.has(toast.id)}
        />
      ))}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-100%); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-100%); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(100%); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TOAST PROVIDER COMPONENT
// ============================================================

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = DEFAULT_MAX_TOASTS,
  defaultDuration = DEFAULT_DURATION,
  gap = DEFAULT_GAP,
  containerClassName,
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: ToastOptions | string): string => {
    const normalizedOptions = typeof options === 'string'
      ? { message: options, type: 'info' as ToastType }
      : options;

    const id = normalizedOptions.id || generateToastId();

    const toast: Toast = {
      id,
      type: normalizedOptions.type || 'info',
      title: normalizedOptions.title,
      message: normalizedOptions.message,
      duration: normalizedOptions.duration ?? defaultDuration,
      dismissible: normalizedOptions.dismissible ?? true,
      icon: normalizedOptions.icon,
      actions: normalizedOptions.actions,
      progress: normalizedOptions.progress ?? true,
      persistent: normalizedOptions.persistent ?? false,
      onDismiss: normalizedOptions.onDismiss,
      className: normalizedOptions.className,
      createdAt: Date.now(),
    };

    setToasts((prev) => {
      const updated = [...prev, toast];
      // Remove oldest if exceeding max
      if (updated.length > maxToasts) {
        const removed = updated.shift();
        removed?.onDismiss?.();
      }
      return updated;
    });

    return id;
  }, [defaultDuration, maxToasts]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      toast?.onDismiss?.();
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((t) => t.onDismiss?.());
      return [];
    });
  }, []);

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...options } : t
      )
    );
  }, []);

  const info = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return addToast({ ...options, message, type: 'info' });
  }, [addToast]);

  const success = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return addToast({ ...options, message, type: 'success' });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return addToast({ ...options, message, type: 'warning' });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return addToast({ ...options, message, type: 'error' });
  }, [addToast]);

  const loading = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return addToast({ ...options, message, type: 'loading', persistent: true, progress: false });
  }, [addToast]);

  const promise = useCallback(async <T,>(
    promiseToResolve: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ): Promise<T> => {
    const id = loading(options.loading);

    try {
      const data = await promiseToResolve;
      const successMessage = typeof options.success === 'function'
        ? options.success(data)
        : options.success;
      
      update(id, {
        type: 'success',
        message: successMessage,
        persistent: false,
        progress: true,
        duration: defaultDuration,
      });

      return data;
    } catch (err) {
      const errorMessage = typeof options.error === 'function'
        ? options.error(err)
        : options.error;
      
      update(id, {
        type: 'error',
        message: errorMessage,
        persistent: false,
        progress: true,
        duration: defaultDuration,
      });

      throw err;
    }
  }, [loading, update, defaultDuration]);

  const value: ToastContextValue = {
    toasts,
    toast: addToast,
    info,
    success,
    warning,
    error,
    loading,
    promise,
    dismiss,
    dismissAll,
    update,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position={position}
        toasts={toasts}
        onDismiss={dismiss}
        gap={gap}
        className={containerClassName}
      />
    </ToastContext.Provider>
  );
}

// ============================================================
// NOTIFICATION CENTER COMPONENT
// ============================================================

interface Notification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationCenter({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  className,
}: NotificationCenterProps): JSX.Element | null {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.notificationCenter} className={className}>
        {/* Header */}
        <div style={styles.notificationHeader}>
          <h2 style={styles.notificationTitle}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: BRAND.cenoteTurquoise,
                color: '#ffffff',
                borderRadius: '100px',
              }}>
                {unreadCount}
              </span>
            )}
          </h2>
          <div style={styles.notificationHeaderActions}>
            {unreadCount > 0 && onMarkAllAsRead && (
              <button style={styles.notificationClearAll} onClick={onMarkAllAsRead}>
                Mark all read
              </button>
            )}
            {notifications.length > 0 && onClearAll && (
              <button style={styles.notificationClearAll} onClick={onClearAll}>
                Clear all
              </button>
            )}
            <button style={styles.notificationClose} onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={styles.notificationBody}>
          {notifications.length === 0 ? (
            <div style={styles.notificationEmpty}>
              <div style={styles.notificationEmptyIcon}>🔔</div>
              <div style={styles.notificationEmptyText}>No notifications yet</div>
            </div>
          ) : (
            notifications.map((notification) => {
              const typeConfig = TOAST_TYPES[notification.type];
              const isHovered = hoveredId === notification.id;

              return (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    ...(isHovered && styles.notificationItemHover),
                    ...(!notification.read && styles.notificationItemUnread),
                  }}
                  onClick={() => {
                    onMarkAsRead?.(notification.id);
                    onNotificationClick?.(notification);
                    notification.onClick?.();
                  }}
                  onMouseEnter={() => setHoveredId(notification.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Unread dot */}
                  {!notification.read && <div style={styles.notificationItemDot} />}

                  {/* Icon */}
                  <div
                    style={{
                      ...styles.notificationItemIcon,
                      backgroundColor: typeConfig.bgColor,
                    }}
                  >
                    {notification.icon || typeConfig.icon}
                  </div>

                  {/* Content */}
                  <div style={styles.notificationItemContent}>
                    <div style={styles.notificationItemTitle}>{notification.title}</div>
                    <div style={styles.notificationItemMessage}>{notification.message}</div>
                    <div style={styles.notificationItemTime}>
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
// NOTIFICATION BADGE COMPONENT
// ============================================================

interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  showZero = false,
  dot = false,
  onClick,
  children,
  className,
}: NotificationBadgeProps): JSX.Element {
  const shouldShow = dot || count > 0 || showZero;
  const displayCount = count > max ? `${max}+` : count;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      className={className}
    >
      {children}
      {shouldShow && (
        <span
          style={{
            position: 'absolute',
            top: dot ? 0 : -4,
            right: dot ? 0 : -4,
            minWidth: dot ? '10px' : '18px',
            height: dot ? '10px' : '18px',
            padding: dot ? 0 : '0 5px',
            borderRadius: '100px',
            backgroundColor: '#E53E3E',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff',
          }}
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ToastType,
  ToastPosition,
  ToastAction,
  Toast,
  ToastOptions,
  ToastContextValue,
  ToastProviderProps,
  ToastContainerProps,
  ToastItemProps,
  Notification,
  NotificationCenterProps,
  NotificationBadgeProps,
};

export {
  generateToastId,
  getPositionStyles,
  getEnterAnimation,
  getExitAnimation,
  TOAST_TYPES,
  DEFAULT_DURATION,
  DEFAULT_MAX_TOASTS,
  DEFAULT_GAP,
};

export default {
  ToastProvider,
  useToast,
  NotificationCenter,
  NotificationBadge,
};
