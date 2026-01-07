// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — TOAST / NOTIFICATION COMPONENT
// Production-grade toast system with context provider and hooks
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Toast variants
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

/**
 * Toast position
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Toast data structure
 */
export interface Toast {
  /** Unique identifier */
  id: string;
  
  /** Toast variant */
  variant: ToastVariant;
  
  /** Title text */
  title?: string;
  
  /** Description/message text */
  description?: string;
  
  /** Duration in ms (0 = no auto-dismiss) */
  duration?: number;
  
  /** Custom icon */
  icon?: ReactNode;
  
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /** Close callback */
  onClose?: () => void;
  
  /** Whether toast can be dismissed */
  dismissible?: boolean;
  
  /** Custom class */
  className?: string;
  
  /** Promise to track (for loading toasts) */
  promise?: Promise<unknown>;
}

/**
 * Toast options for creating a toast
 */
export type ToastOptions = Omit<Toast, 'id'>;

/**
 * Toast context value
 */
export interface ToastContextValue {
  /** All active toasts */
  toasts: Toast[];
  
  /** Add a toast */
  addToast: (options: ToastOptions) => string;
  
  /** Remove a toast by ID */
  removeToast: (id: string) => void;
  
  /** Update a toast */
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
  
  /** Remove all toasts */
  clearToasts: () => void;
  
  /** Shorthand methods */
  toast: (message: string, options?: Partial<ToastOptions>) => string;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  loading: (message: string, options?: Partial<ToastOptions>) => string;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<T>;
}

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  /** Children components */
  children: ReactNode;
  
  /** Default position */
  position?: ToastPosition;
  
  /** Default duration */
  defaultDuration?: number;
  
  /** Maximum number of toasts */
  maxToasts?: number;
  
  /** Gap between toasts */
  gap?: number;
  
  /** Container class */
  containerClassName?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;
const ANIMATION_DURATION = 300;

let toastCounter = 0;

// =============================================================================
// CONTEXT
// =============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
  return `toast-${++toastCounter}-${Date.now()}`;
}

// =============================================================================
// ICONS
// =============================================================================

const Icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  loading: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// =============================================================================
// STYLES
// =============================================================================

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  default: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-border-default)]',
    icon: '',
    iconColor: 'text-[var(--color-text-tertiary)]',
  },
  success: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-status-success)]',
    icon: 'success',
    iconColor: 'text-[var(--color-status-success)]',
  },
  error: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-status-error)]',
    icon: 'error',
    iconColor: 'text-[var(--color-status-error)]',
  },
  warning: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-status-warning)]',
    icon: 'warning',
    iconColor: 'text-[var(--color-status-warning)]',
  },
  info: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-status-info)]',
    icon: 'info',
    iconColor: 'text-[var(--color-status-info)]',
  },
  loading: {
    bg: 'bg-[var(--color-bg-secondary)]',
    border: 'border-[var(--color-brand-primary)]',
    icon: 'loading',
    iconColor: 'text-[var(--color-brand-primary)]',
  },
};

const positionStyles: Record<ToastPosition, { container: string; animation: { enter: string; exit: string } }> = {
  'top-left': {
    container: 'top-4 left-4 items-start',
    animation: { enter: 'translate-x-0 opacity-100', exit: '-translate-x-full opacity-0' },
  },
  'top-center': {
    container: 'top-4 left-1/2 -translate-x-1/2 items-center',
    animation: { enter: 'translate-y-0 opacity-100', exit: '-translate-y-full opacity-0' },
  },
  'top-right': {
    container: 'top-4 right-4 items-end',
    animation: { enter: 'translate-x-0 opacity-100', exit: 'translate-x-full opacity-0' },
  },
  'bottom-left': {
    container: 'bottom-4 left-4 items-start',
    animation: { enter: 'translate-x-0 opacity-100', exit: '-translate-x-full opacity-0' },
  },
  'bottom-center': {
    container: 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    animation: { enter: 'translate-y-0 opacity-100', exit: 'translate-y-full opacity-0' },
  },
  'bottom-right': {
    container: 'bottom-4 right-4 items-end',
    animation: { enter: 'translate-x-0 opacity-100', exit: 'translate-x-full opacity-0' },
  },
};

// =============================================================================
// TOAST ITEM COMPONENT
// =============================================================================

interface ToastItemProps {
  toast: Toast;
  position: ToastPosition;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, position, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration === 0 || toast.variant === 'loading') return;

    const duration = toast.duration ?? DEFAULT_DURATION;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.variant]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      toast.onClose?.();
      onDismiss(toast.id);
    }, ANIMATION_DURATION);
  }, [toast, onDismiss]);

  const variantConfig = variantStyles[toast.variant];
  const positionConfig = positionStyles[position];
  const animationClass = isExiting || !isVisible
    ? positionConfig.animation.exit
    : positionConfig.animation.enter;

  const icon = toast.icon || (variantConfig.icon && Icons[variantConfig.icon as keyof typeof Icons]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative
        w-full max-w-sm
        flex items-start gap-3
        p-4
        ${variantConfig.bg}
        border-l-4 ${variantConfig.border}
        rounded-lg
        shadow-lg
        transform transition-all duration-300 ease-out
        ${animationClass}
        ${toast.className || ''}
      `}
    >
      {/* Icon */}
      {icon && (
        <div className={`flex-shrink-0 ${variantConfig.iconColor}`}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className={`text-sm text-[var(--color-text-secondary)] ${toast.title ? 'mt-1' : ''}`}>
            {toast.description}
          </p>
        )}
        {/* Action button */}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              handleDismiss();
            }}
            className="
              mt-2
              text-sm font-medium
              text-[var(--color-brand-primary)]
              hover:text-[var(--color-brand-primary-hover)]
              focus:outline-none focus:underline
            "
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {toast.dismissible !== false && toast.variant !== 'loading' && (
        <button
          type="button"
          onClick={handleDismiss}
          className="
            flex-shrink-0
            p-1
            rounded
            text-[var(--color-text-tertiary)]
            hover:text-[var(--color-text-primary)]
            hover:bg-[var(--color-bg-hover)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]
            transition-colors duration-150
          "
          aria-label="Fermer"
        >
          {Icons.close}
        </button>
      )}

      {/* Progress bar for timed toasts */}
      {toast.duration !== 0 && toast.variant !== 'loading' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-bg-subtle)] overflow-hidden rounded-b-lg">
          <div
            className={`h-full ${variantConfig.iconColor.replace('text-', 'bg-')} opacity-30`}
            style={{
              animation: `shrink ${toast.duration || DEFAULT_DURATION}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Add shrink animation
if (typeof document !== 'undefined' && !document.querySelector('style[data-chenu-toast]')) {
  const style = document.createElement('style');
  style.setAttribute('data-chenu-toast', 'true');
  style.textContent = `
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// TOAST CONTAINER COMPONENT
// =============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  gap: number;
  onDismiss: (id: string) => void;
  className?: string;
}

function ToastContainer({ toasts, position, gap, onDismiss, className = '' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const positionConfig = positionStyles[position];
  const isBottom = position.startsWith('bottom');

  return createPortal(
    <div
      className={`
        fixed z-[var(--z-toast)]
        flex flex-col
        pointer-events-none
        ${positionConfig.container}
        ${className}
      `}
      style={{ gap: `${gap}px` }}
    >
      {(isBottom ? [...toasts].reverse() : toasts).map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} position={position} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// =============================================================================
// TOAST PROVIDER
// =============================================================================

/**
 * Toast Provider
 * 
 * Provides toast context and renders the toast container.
 * 
 * @example
 * ```tsx
 * <ToastProvider position="bottom-right">
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
  defaultDuration = DEFAULT_DURATION,
  maxToasts = MAX_TOASTS,
  gap = 12,
  containerClassName = '',
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a toast
  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = generateId();
      const toast: Toast = {
        id,
        variant: 'default',
        duration: defaultDuration,
        dismissible: true,
        ...options,
      };

      setToasts((prev) => {
        const newToasts = [...prev, toast];
        // Limit the number of toasts
        if (newToasts.length > maxToasts) {
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });

      return id;
    },
    [defaultDuration, maxToasts]
  );

  // Remove a toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update a toast
  const updateToast = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...options } : t))
    );
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Shorthand methods
  const toast = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, ...options }),
    [addToast]
  );

  const success = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, variant: 'success', ...options }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, variant: 'error', ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, variant: 'warning', ...options }),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, variant: 'info', ...options }),
    [addToast]
  );

  const loading = useCallback(
    (message: string, options?: Partial<ToastOptions>) =>
      addToast({ description: message, variant: 'loading', duration: 0, ...options }),
    [addToast]
  );

  // Promise-based toast
  const promiseToast = useCallback(
    async <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
      }
    ): Promise<T> => {
      const id = addToast({
        description: options.loading,
        variant: 'loading',
        duration: 0,
      });

      try {
        const result = await promise;
        updateToast(id, {
          description: typeof options.success === 'function' ? options.success(result) : options.success,
          variant: 'success',
          duration: defaultDuration,
        });
        return result;
      } catch (err) {
        updateToast(id, {
          description: typeof options.error === 'function' ? options.error(err) : options.error,
          variant: 'error',
          duration: defaultDuration,
        });
        throw err;
      }
    },
    [addToast, updateToast, defaultDuration]
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
      updateToast,
      clearToasts,
      toast,
      success,
      error,
      warning,
      info,
      loading,
      promise: promiseToast,
    }),
    [toasts, addToast, removeToast, updateToast, clearToasts, toast, success, error, warning, info, loading, promiseToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        gap={gap}
        onDismiss={removeToast}
        className={containerClassName}
      />
    </ToastContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access toast context
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// =============================================================================
// STANDALONE TOAST FUNCTION (for use outside React)
// =============================================================================

// Store for standalone toasts
let standaloneToastHandler: ToastContextValue | null = null;

/**
 * Set the toast handler for standalone usage
 */
export function setToastHandler(handler: ToastContextValue): void {
  standaloneToastHandler = handler;
}

/**
 * Standalone toast function
 * Must be used after ToastProvider is mounted and setToastHandler is called
 */
export const standaloneToast = {
  show: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) {
      logger.warn('Toast handler not initialized. Make sure ToastProvider is mounted.');
      return '';
    }
    return standaloneToastHandler.toast(message, options);
  },
  success: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) return '';
    return standaloneToastHandler.success(message, options);
  },
  error: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) return '';
    return standaloneToastHandler.error(message, options);
  },
  warning: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) return '';
    return standaloneToastHandler.warning(message, options);
  },
  info: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) return '';
    return standaloneToastHandler.info(message, options);
  },
  loading: (message: string, options?: Partial<ToastOptions>) => {
    if (!standaloneToastHandler) return '';
    return standaloneToastHandler.loading(message, options);
  },
  dismiss: (id: string) => {
    standaloneToastHandler?.removeToast(id);
  },
  clear: () => {
    standaloneToastHandler?.clearToasts();
  },
};

// =============================================================================
// INLINE ALERT COMPONENT (Non-toast alternative)
// =============================================================================

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert variant */
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  
  /** Title */
  title?: string;
  
  /** Custom icon */
  icon?: ReactNode;
  
  /** Show icon */
  showIcon?: boolean;
  
  /** Dismissible */
  dismissible?: boolean;
  
  /** On dismiss callback */
  onDismiss?: () => void;
}

/**
 * Alert Component
 * 
 * Inline alert for non-toast notifications.
 * 
 * @example
 * ```tsx
 * <Alert variant="warning" title="Attention">
 *   This action requires confirmation.
 * </Alert>
 * ```
 */
export function Alert({
  variant = 'default',
  title,
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
  children,
  ...props
}: AlertProps): JSX.Element {
  const variantConfig = variantStyles[variant === 'default' ? 'default' : variant];
  const defaultIcon = showIcon && !icon && variantConfig.icon
    ? Icons[variantConfig.icon as keyof typeof Icons]
    : null;

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3
        p-4
        ${variantConfig.bg}
        border-l-4 ${variantConfig.border}
        rounded-lg
        ${className}
      `}
      {...props}
    >
      {/* Icon */}
      {(icon || defaultIcon) && (
        <div className={`flex-shrink-0 ${variantConfig.iconColor}`}>
          {icon || defaultIcon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {title}
          </p>
        )}
        {children && (
          <div className={`text-sm text-[var(--color-text-secondary)] ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="
            flex-shrink-0
            p-1
            rounded
            text-[var(--color-text-tertiary)]
            hover:text-[var(--color-text-primary)]
            hover:bg-[var(--color-bg-hover)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]
            transition-colors duration-150
          "
          aria-label="Fermer"
        >
          {Icons.close}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ToastProvider;
