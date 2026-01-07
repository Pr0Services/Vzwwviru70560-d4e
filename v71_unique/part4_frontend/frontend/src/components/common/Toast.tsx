/**
 * CHE·NU™ Toast Notification System
 * 
 * Provides non-intrusive feedback to users with different severity levels.
 * Includes toast container, hooks, and utilities.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';
import { create } from 'zustand';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
  createdAt: number;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: Toast['action'];
  icon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST STORE
// ═══════════════════════════════════════════════════════════════════════════

interface ToastStore {
  toasts: Toast[];
  position: ToastPosition;
  maxToasts: number;
  
  addToast: (message: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  setPosition: (position: ToastPosition) => void;
  setMaxToasts: (max: number) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  position: 'bottom-right',
  maxToasts: 5,
  
  addToast: (message, options = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration ?? (options.type === 'loading' ? 0 : 5000),
      dismissible: options.dismissible ?? true,
      action: options.action,
      icon: options.icon,
      createdAt: Date.now(),
    };
    
    set(state => {
      const toasts = [toast, ...state.toasts].slice(0, state.maxToasts);
      return { toasts };
    });
    
    // Auto-dismiss
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  updateToast: (id, updates) => {
    set(state => ({
      toasts: state.toasts.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },
  
  setPosition: (position) => {
    set({ position });
  },
  
  setMaxToasts: (maxToasts) => {
    set({ maxToasts });
  },
}));

// ═══════════════════════════════════════════════════════════════════════════
// TOAST HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useToast() {
  const { addToast, removeToast, updateToast, clearToasts } = useToastStore();
  
  const toast = React.useCallback((message: string, options?: ToastOptions) => {
    return addToast(message, options);
  }, [addToast]);
  
  const success = React.useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return addToast(message, { ...options, type: 'success' });
  }, [addToast]);
  
  const error = React.useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return addToast(message, { ...options, type: 'error', duration: options?.duration ?? 8000 });
  }, [addToast]);
  
  const warning = React.useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return addToast(message, { ...options, type: 'warning' });
  }, [addToast]);
  
  const info = React.useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return addToast(message, { ...options, type: 'info' });
  }, [addToast]);
  
  const loading = React.useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return addToast(message, { ...options, type: 'loading', dismissible: false });
  }, [addToast]);
  
  const dismiss = React.useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);
  
  const update = React.useCallback((id: string, updates: Partial<Toast>) => {
    updateToast(id, updates);
  }, [updateToast]);
  
  const promise = React.useCallback(async <T,>(
    promiseFn: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ): Promise<T> => {
    const id = addToast(options.loading, { type: 'loading', dismissible: false });
    
    try {
      const result = await promiseFn;
      updateToast(id, {
        type: 'success',
        message: typeof options.success === 'function' 
          ? options.success(result) 
          : options.success,
        dismissible: true,
        duration: 5000,
      });
      
      // Auto dismiss after duration
      setTimeout(() => removeToast(id), 5000);
      
      return result;
    } catch (err) {
      updateToast(id, {
        type: 'error',
        message: typeof options.error === 'function' 
          ? options.error(err as Error) 
          : options.error,
        dismissible: true,
        duration: 8000,
      });
      
      setTimeout(() => removeToast(id), 8000);
      
      throw err;
    }
  }, [addToast, updateToast, removeToast]);
  
  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    update,
    promise,
    clear: clearToasts,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ICONS
// ═══════════════════════════════════════════════════════════════════════════

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  loading: '↻',
};

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.3)',
    icon: '#22c55e',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: '#ef4444',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: '#f59e0b',
  },
  info: {
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.3)',
    icon: '#6366f1',
  },
  loading: {
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.3)',
    icon: '#6366f1',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const colors = TOAST_COLORS[toast.type];
  const icon = toast.icon || TOAST_ICONS[toast.type];
  
  return (
    <div 
      className={`toast-item toast-item--${toast.type}`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div 
        className={`toast-item__icon ${toast.type === 'loading' ? 'toast-item__icon--spinning' : ''}`}
        style={{ color: colors.icon }}
      >
        {icon}
      </div>
      
      <div className="toast-item__content">
        {toast.title && (
          <div className="toast-item__title">{toast.title}</div>
        )}
        <div className="toast-item__message">{toast.message}</div>
        
        {toast.action && (
          <button 
            className="toast-item__action"
            onClick={toast.action.onClick}
            style={{ color: colors.icon }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      {toast.dismissible && (
        <button 
          className="toast-item__dismiss"
          onClick={() => onDismiss(toast.id)}
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ToastContainer: React.FC = () => {
  const { toasts, position, removeToast } = useToastStore();
  
  if (toasts.length === 0) return null;
  
  const positionStyles: Record<ToastPosition, React.CSSProperties> = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  };
  
  const isBottom = position.includes('bottom');
  
  return (
    <div 
      className="toast-container"
      style={positionStyles[position]}
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="toast-wrapper"
          style={{
            animationDelay: `${index * 50}ms`,
            '--index': index,
          } as React.CSSProperties}
        >
          <ToastItem toast={toast} onDismiss={removeToast} />
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          z-index: 99999;
          display: flex;
          flex-direction: ${isBottom ? 'column-reverse' : 'column'};
          gap: 8px;
          max-height: calc(100vh - 32px);
          overflow: hidden;
          pointer-events: none;
        }

        .toast-wrapper {
          pointer-events: auto;
          animation: toastSlideIn 0.3s ease forwards;
          animation-delay: calc(var(--index, 0) * 50ms);
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .toast-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 320px;
          max-width: 420px;
          padding: 14px 16px;
          background: var(--color-bg-secondary, #fff);
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .toast-item__icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          border-radius: 50%;
        }

        .toast-item__icon--spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .toast-item__content {
          flex: 1;
          min-width: 0;
        }

        .toast-item__title {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
          margin-bottom: 2px;
        }

        .toast-item__message {
          font-size: 13px;
          color: var(--color-text-secondary, #666);
          line-height: 1.4;
          word-break: break-word;
        }

        .toast-item__action {
          display: inline-block;
          margin-top: 8px;
          padding: 0;
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .toast-item__action:hover {
          opacity: 0.8;
        }

        .toast-item__dismiss {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--color-text-tertiary, #999);
          cursor: pointer;
          transition: all 0.2s;
        }

        .toast-item__dismiss:hover {
          background: var(--color-bg-tertiary, #f5f5f5);
          color: var(--color-text-primary, #1a1a1a);
        }

        /* Dark mode */
        [data-theme="dark"] .toast-item {
          background: #1a1a1a;
          border-color: #333;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        [data-theme="dark"] .toast-item__title {
          color: #fff;
        }

        [data-theme="dark"] .toast-item__message {
          color: #aaa;
        }

        [data-theme="dark"] .toast-item__dismiss:hover {
          background: #333;
          color: #fff;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .toast-container {
            left: 8px !important;
            right: 8px !important;
            transform: none !important;
          }

          .toast-item {
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS (for non-React usage)
// ═══════════════════════════════════════════════════════════════════════════

const store = useToastStore.getState();

export const toast = {
  show: (message: string, options?: ToastOptions) => store.addToast(message, options),
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    store.addToast(message, { ...options, type: 'success' }),
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    store.addToast(message, { ...options, type: 'error', duration: options?.duration ?? 8000 }),
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    store.addToast(message, { ...options, type: 'warning' }),
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    store.addToast(message, { ...options, type: 'info' }),
  loading: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    store.addToast(message, { ...options, type: 'loading', dismissible: false }),
  dismiss: (id: string) => store.removeToast(id),
  clear: () => store.clearToasts(),
};

export default ToastContainer;
