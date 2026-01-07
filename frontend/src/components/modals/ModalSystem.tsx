// CHE·NU™ Modal & Dialog System
// Comprehensive modal, dialog, drawer, and sheet components

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  Fragment,
} from 'react';
import { createPortal } from 'react-dom';

// ============================================================
// TYPES
// ============================================================

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  position?: DrawerPosition;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
  loading?: boolean;
}

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  buttonText?: string;
}

// ============================================================
// BRAND COLORS
// ============================================================

const COLORS = {
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
// UTILITY HOOKS
// ============================================================

const useEscapeKey = (handler: () => void, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handler, enabled]);
};

const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
};

const useFocusTrap = (containerRef: React.RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element
    firstFocusable?.focus();

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerRef, enabled]);
};

// ============================================================
// PORTAL COMPONENT
// ============================================================

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

const Portal: React.FC<PortalProps> = ({ children, containerId = 'modal-root' }) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    let element = document.getElementById(containerId);

    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      if (element && element.childNodes.length === 0) {
        element.remove();
      }
    };
  }, [containerId]);

  if (!mounted || !container) return null;

  return createPortal(children, container);
};

// ============================================================
// OVERLAY COMPONENT
// ============================================================

interface OverlayProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClick, className = '' }) => (
  <div
    className={`
      fixed inset-0 bg-black/50 transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      ${className}
    `}
    onClick={onClick}
    aria-hidden="true"
  />
);

// ============================================================
// CLOSE BUTTON COMPONENT
// ============================================================

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
      transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500
      ${className}
    `}
    aria-label="Close"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

// ============================================================
// MODAL COMPONENT
// ============================================================

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen && closeOnEscape);
  useScrollLock(isOpen);
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Overlay isOpen={isOpen} onClick={closeOnOverlayClick ? onClose : undefined} />

        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          className={`
            relative w-full ${sizeClasses[size]}
            bg-white rounded-xl shadow-2xl
            transform transition-all duration-300
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                {title && (
                  <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="mt-1 text-sm text-gray-500">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && <CloseButton onClick={onClose} />}
            </div>
          )}

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

// ============================================================
// DRAWER COMPONENT
// ============================================================

const drawerSizeClasses: Record<DrawerPosition, Record<ModalSize, string>> = {
  left: { sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[30rem]', full: 'w-full max-w-lg' },
  right: { sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[30rem]', full: 'w-full max-w-lg' },
  top: { sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full max-h-[80vh]' },
  bottom: { sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full max-h-[80vh]' },
};

const drawerPositionClasses: Record<DrawerPosition, { base: string; open: string; closed: string }> = {
  left: {
    base: 'left-0 top-0 h-full',
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
  right: {
    base: 'right-0 top-0 h-full',
    open: 'translate-x-0',
    closed: 'translate-x-full',
  },
  top: {
    base: 'top-0 left-0 w-full',
    open: 'translate-y-0',
    closed: '-translate-y-full',
  },
  bottom: {
    base: 'bottom-0 left-0 w-full',
    open: 'translate-y-0',
    closed: 'translate-y-full',
  },
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const positionStyles = drawerPositionClasses[position];
  const sizeStyle = drawerSizeClasses[position][size];

  useEscapeKey(onClose, isOpen && closeOnEscape);
  useScrollLock(isOpen);
  useFocusTrap(drawerRef, isOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <Overlay isOpen={isOpen} onClick={closeOnOverlayClick ? onClose : undefined} />

        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          className={`
            fixed ${positionStyles.base} ${sizeStyle}
            bg-white shadow-2xl
            transform transition-transform duration-300 ease-out
            ${isOpen ? positionStyles.open : positionStyles.closed}
            flex flex-col
            ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                {title && (
                  <h2 id="drawer-title" className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
              {showCloseButton && <CloseButton onClick={onClose} />}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

// ============================================================
// CONFIRM DIALOG COMPONENT
// ============================================================

const alertTypeStyles: Record<AlertType, { icon: string; iconBg: string; buttonBg: string }> = {
  info: {
    icon: 'ℹ️',
    iconBg: 'bg-blue-100',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
  },
  success: {
    icon: '✓',
    iconBg: 'bg-green-100',
    buttonBg: 'bg-green-600 hover:bg-green-700',
  },
  warning: {
    icon: '⚠️',
    iconBg: 'bg-yellow-100',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
  },
  error: {
    icon: '✕',
    iconBg: 'bg-red-100',
    buttonBg: 'bg-red-600 hover:bg-red-700',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false,
}) => {
  const styles = alertTypeStyles[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center text-2xl mb-4`}>
          {styles.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 ${styles.buttonBg} text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2`}
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// ALERT DIALOG COMPONENT
// ============================================================

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK',
}) => {
  const styles = alertTypeStyles[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center text-2xl mb-4`}>
          {styles.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`px-6 py-2 ${styles.buttonBg} text-white rounded-lg transition-colors`}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

// ============================================================
// SHEET COMPONENT (Bottom Sheet for Mobile)
// ============================================================

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.5, 0.9],
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  useEscapeKey(onClose, isOpen);
  useScrollLock(isOpen);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = currentY - startY.current;
    setDragY(Math.max(0, diff));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      if (currentSnapPoint > 0) {
        setCurrentSnapPoint(currentSnapPoint - 1);
      } else {
        onClose();
      }
    }
    setDragY(0);
  };

  if (!isOpen) return null;

  const height = `${snapPoints[currentSnapPoint] * 100}vh`;

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <Overlay isOpen={isOpen} onClick={onClose} />

        <div
          ref={sheetRef}
          className={`
            fixed bottom-0 left-0 right-0
            bg-white rounded-t-3xl shadow-2xl
            transform transition-transform duration-300
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
          style={{ 
            height,
            transform: `translateY(${isDragging ? dragY : 0}px)`,
          }}
        >
          {/* Drag Handle */}
          <div
            className="pt-4 pb-2 cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
          </div>

          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: `calc(${height} - 100px)` }}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

// ============================================================
// COMMAND PALETTE COMPONENT
// ============================================================

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEscapeKey(onClose, isOpen);
  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
        break;
    }
  };

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  if (!isOpen) return null;

  let globalIndex = -1;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
        <Overlay isOpen={isOpen} onClick={onClose} />

        <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-4 text-lg border-b border-gray-200 focus:outline-none"
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  {category}
                </div>
                {categoryItems.map((item) => {
                  globalIndex++;
                  const itemIndex = globalIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`
                        w-full px-4 py-3 flex items-center gap-3 text-left
                        transition-colors
                        ${selectedIndex === itemIndex ? 'bg-amber-50' : 'hover:bg-gray-50'}
                      `}
                    >
                      {item.icon && (
                        <span className="text-gray-400">{item.icon}</span>
                      )}
                      <div className="flex-1">
                        <div className="text-gray-900">{item.label}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No results found for "{search}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// ============================================================
// TOAST SYSTEM
// ============================================================

interface Toast {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const toastTypeStyles: Record<AlertType, { bg: string; border: string; icon: string }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
  success: { bg: 'bg-green-50', border: 'border-green-200', icon: '✓' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: '✕' },
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
  toasts,
  removeToast,
}) => (
  <Portal containerId="toast-root">
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const styles = toastTypeStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              ${styles.bg} ${styles.border} border
              p-4 rounded-lg shadow-lg
              transform transition-all duration-300
              animate-slide-in-right
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{styles.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{toast.title}</h4>
                {toast.message && (
                  <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </Portal>
);

// ============================================================
// EXPORTS
// ============================================================

export default {
  Modal,
  Drawer,
  ConfirmDialog,
  AlertDialog,
  Sheet,
  CommandPalette,
  ToastProvider,
  useToast,
  Portal,
};
