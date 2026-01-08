/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V75 — TOAST NOTIFICATIONS                         ║
 * ║                                                                              ║
 * ║  Global toast system with animations and auto-dismiss                         ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'checkpoint';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  // Convenience methods
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  checkpoint: (title: string, message?: string, action?: Toast['action']) => string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const TOAST_CONFIG: Record<ToastType, { icon: string; color: string; bgColor: string }> = {
  success: {
    icon: '✓',
    color: '#4ADE80',
    bgColor: 'rgba(74, 222, 128, 0.1)',
  },
  error: {
    icon: '✕',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
  warning: {
    icon: '⚠',
    color: '#FACC15',
    bgColor: 'rgba(250, 204, 21, 0.1)',
  },
  info: {
    icon: 'ℹ',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  checkpoint: {
    icon: '🛡️',
    color: '#D8B26A',
    bgColor: 'rgba(216, 178, 106, 0.1)',
  },
};

const DEFAULT_DURATION = 5000; // 5 seconds

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLE TOAST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = TOAST_CONFIG[toast.type];

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration === 0) return; // Persistent toast
    
    const duration = toast.duration || DEFAULT_DURATION;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        background: config.bgColor,
        border: `1px solid ${config.color}33`,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        maxWidth: 400,
        minWidth: 300,
        animation: isExiting 
          ? 'toastSlideOut 0.3s ease forwards'
          : 'toastSlideIn 0.3s ease',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: `${config.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14, color: config.color }}>{config.icon}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#E8F0E8',
            marginBottom: toast.message ? 4 : 0,
          }}
        >
          {toast.title}
        </div>
        {toast.message && (
          <div
            style={{
              fontSize: 13,
              color: '#9BA89B',
              lineHeight: 1.4,
            }}
          >
            {toast.message}
          </div>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleClose();
            }}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              background: config.color,
              border: 'none',
              borderRadius: 6,
              color: '#1A1A1A',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: 'rgba(255, 255, 255, 0.05)',
          border: 'none',
          color: '#6B7B6B',
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = '#9BA89B';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#6B7B6B';
        }}
      >
        ×
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
      }}
    >
      <style>
        {`
          @keyframes toastSlideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes toastSlideOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }
        `}
      </style>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      // Remove oldest if exceeding max
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    return addToast({ type: 'error', title, message, duration: 8000 }); // Longer for errors
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const checkpoint = useCallback((title: string, message?: string, action?: Toast['action']) => {
    return addToast({ type: 'checkpoint', title, message, action, duration: 0 }); // Persistent
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
    checkpoint,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
