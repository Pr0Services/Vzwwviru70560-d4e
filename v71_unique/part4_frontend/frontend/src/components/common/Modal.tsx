/**
 * CHE·NU™ Modal/Dialog System
 * 
 * Accessible modal dialogs with focus trap, keyboard navigation,
 * and multiple variants.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'centered' | 'drawer-right' | 'drawer-left' | 'drawer-bottom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  variant?: ModalVariant;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  initialFocus?: React.RefObject<HTMLElement>;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS TRAP HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useFocusTrap(isOpen: boolean, initialFocus?: React.RefObject<HTMLElement>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    // Store previous active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable
    const focusInitial = () => {
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else if (containerRef.current) {
        const focusable = containerRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    };

    // Delay to allow DOM update
    requestAnimationFrame(focusInitial);

    // Trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      previousActiveElement.current?.focus();
    };
  }, [isOpen, initialFocus]);

  return containerRef;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  variant = 'default',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
  initialFocus,
}) => {
  const containerRef = useFocusTrap(isOpen, initialFocus);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  const isDrawer = variant.startsWith('drawer');

  return (
    <div
      className={`modal-overlay modal-overlay--${variant}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={containerRef}
        className={`modal modal--${size} modal--${variant} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal__header">
            <div className="modal__titles">
              {title && (
                <h2 id="modal-title" className="modal__title">{title}</h2>
              )}
              {description && (
                <p id="modal-description" className="modal__description">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Fermer"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal__content">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 9999;
          animation: modalFadeIn 0.2s ease;
        }

        .modal-overlay--drawer-right,
        .modal-overlay--drawer-left,
        .modal-overlay--drawer-bottom {
          padding: 0;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: var(--color-bg-secondary, #fff);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 48px);
          animation: modalSlideIn 0.2s ease;
        }

        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Sizes */
        .modal--sm { width: 100%; max-width: 400px; }
        .modal--md { width: 100%; max-width: 560px; }
        .modal--lg { width: 100%; max-width: 720px; }
        .modal--xl { width: 100%; max-width: 960px; }
        .modal--full { width: calc(100% - 48px); height: calc(100% - 48px); max-width: none; }

        /* Centered variant */
        .modal--centered {
          text-align: center;
        }

        /* Drawer variants */
        .modal--drawer-right {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          max-height: 100vh;
          border-radius: 16px 0 0 16px;
          animation: drawerSlideLeft 0.3s ease;
        }

        .modal--drawer-left {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          max-height: 100vh;
          border-radius: 0 16px 16px 0;
          animation: drawerSlideRight 0.3s ease;
        }

        .modal--drawer-bottom {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          max-height: 90vh;
          max-width: none;
          width: 100%;
          border-radius: 16px 16px 0 0;
          animation: drawerSlideUp 0.3s ease;
        }

        @keyframes drawerSlideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes drawerSlideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @keyframes drawerSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* Header */
        .modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .modal__titles {
          flex: 1;
        }

        .modal__title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
        }

        .modal__description {
          margin: 4px 0 0;
          font-size: 14px;
          color: var(--color-text-secondary, #666);
        }

        .modal__close {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-tertiary, #f5f5f5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--color-text-secondary, #666);
          font-size: 16px;
          transition: all 0.15s;
        }

        .modal__close:hover {
          background: var(--color-bg-tertiary-hover, #e5e5e5);
          color: var(--color-text-primary, #1a1a1a);
        }

        /* Content */
        .modal__content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        /* Footer */
        .modal__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid var(--color-border, #e5e5e5);
        }

        .modal--centered .modal__footer {
          justify-content: center;
        }

        /* Dark mode */
        [data-theme="dark"] .modal {
          background: #1a1a1a;
        }

        [data-theme="dark"] .modal__header {
          border-color: #333;
        }

        [data-theme="dark"] .modal__title {
          color: #fff;
        }

        [data-theme="dark"] .modal__description {
          color: #aaa;
        }

        [data-theme="dark"] .modal__close {
          background: #2a2a2a;
          color: #aaa;
        }

        [data-theme="dark"] .modal__close:hover {
          background: #333;
          color: #fff;
        }

        [data-theme="dark"] .modal__footer {
          border-color: #333;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal {
            max-width: none;
            width: 100%;
            max-height: 90vh;
            border-radius: 16px 16px 0 0;
            animation: drawerSlideUp 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════════════════════════════════════════

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'info',
  isLoading = false,
}) => {
  const confirmRef = React.useRef<HTMLButtonElement>(null);

  const variantConfig = {
    danger: { icon: '⚠️', color: '#ef4444' },
    warning: { icon: '⚡', color: '#f59e0b' },
    info: { icon: 'ℹ️', color: '#6366f1' },
  };

  const config = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      variant="centered"
      initialFocus={confirmRef}
      footer={
        <>
          <button
            className="confirm-dialog__cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`confirm-dialog__confirm confirm-dialog__confirm--${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog__content">
        <span className="confirm-dialog__icon" style={{ color: config.color }}>
          {config.icon}
        </span>
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
      </div>

      <style>{`
        .confirm-dialog__content {
          text-align: center;
        }

        .confirm-dialog__icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .confirm-dialog__title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
        }

        .confirm-dialog__message {
          margin: 0;
          font-size: 14px;
          color: var(--color-text-secondary, #666);
          line-height: 1.5;
        }

        .confirm-dialog__cancel,
        .confirm-dialog__confirm {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .confirm-dialog__cancel {
          background: var(--color-bg-tertiary, #f5f5f5);
          color: var(--color-text-secondary, #666);
        }

        .confirm-dialog__cancel:hover:not(:disabled) {
          background: var(--color-bg-tertiary-hover, #e5e5e5);
        }

        .confirm-dialog__confirm {
          color: white;
        }

        .confirm-dialog__confirm--danger {
          background: #ef4444;
        }

        .confirm-dialog__confirm--danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .confirm-dialog__confirm--warning {
          background: #f59e0b;
        }

        .confirm-dialog__confirm--warning:hover:not(:disabled) {
          background: #d97706;
        }

        .confirm-dialog__confirm--info {
          background: #6366f1;
        }

        .confirm-dialog__confirm--info:hover:not(:disabled) {
          background: #4f46e5;
        }

        .confirm-dialog__cancel:disabled,
        .confirm-dialog__confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        [data-theme="dark"] .confirm-dialog__title {
          color: #fff;
        }

        [data-theme="dark"] .confirm-dialog__cancel {
          background: #2a2a2a;
          color: #aaa;
        }

        [data-theme="dark"] .confirm-dialog__cancel:hover:not(:disabled) {
          background: #333;
        }
      `}</style>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ALERT DIALOG
// ═══════════════════════════════════════════════════════════════════════════

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonLabel = 'OK',
  variant = 'info',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const variantConfig = {
    success: { icon: '✓', color: '#22c55e' },
    error: { icon: '✕', color: '#ef4444' },
    warning: { icon: '⚠', color: '#f59e0b' },
    info: { icon: 'ℹ', color: '#6366f1' },
  };

  const config = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      variant="centered"
      showCloseButton={false}
      initialFocus={buttonRef}
      footer={
        <button
          ref={buttonRef}
          className={`alert-dialog__button alert-dialog__button--${variant}`}
          onClick={onClose}
        >
          {buttonLabel}
        </button>
      }
    >
      <div className="alert-dialog__content">
        <span 
          className="alert-dialog__icon"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
        >
          {config.icon}
        </span>
        <h3 className="alert-dialog__title">{title}</h3>
        <p className="alert-dialog__message">{message}</p>
      </div>

      <style>{`
        .alert-dialog__content {
          text-align: center;
        }

        .alert-dialog__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .alert-dialog__title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary, #1a1a1a);
        }

        .alert-dialog__message {
          margin: 0;
          font-size: 14px;
          color: var(--color-text-secondary, #666);
          line-height: 1.5;
        }

        .alert-dialog__button {
          padding: 10px 32px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          color: white;
        }

        .alert-dialog__button--success { background: #22c55e; }
        .alert-dialog__button--success:hover { background: #16a34a; }

        .alert-dialog__button--error { background: #ef4444; }
        .alert-dialog__button--error:hover { background: #dc2626; }

        .alert-dialog__button--warning { background: #f59e0b; }
        .alert-dialog__button--warning:hover { background: #d97706; }

        .alert-dialog__button--info { background: #6366f1; }
        .alert-dialog__button--info:hover { background: #4f46e5; }

        [data-theme="dark"] .alert-dialog__title {
          color: #fff;
        }
      `}</style>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// USECONFIRM HOOK
// ═══════════════════════════════════════════════════════════════════════════

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function useConfirm() {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: { title: '', message: '' },
    resolve: null,
  });

  const confirm = React.useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    state.resolve?.(true);
    setState(s => ({ ...s, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const handleCancel = React.useCallback(() => {
    state.resolve?.(false);
    setState(s => ({ ...s, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const ConfirmDialogComponent = React.useMemo(() => (
    <ConfirmDialog
      isOpen={state.isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      {...state.options}
    />
  ), [state.isOpen, state.options, handleConfirm, handleCancel]);

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}

export default {
  Modal,
  ConfirmDialog,
  AlertDialog,
  useConfirm,
};
