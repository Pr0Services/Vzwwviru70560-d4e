// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — MODAL / DIALOG COMPONENT
// Production-grade modal with animations, accessibility, and variants
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  useEffect,
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Modal size variants
 */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal position
 */
export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

/**
 * Modal props
 */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
  
  /** Modal size */
  size?: ModalSize;
  
  /** Modal position */
  position?: ModalPosition;
  
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  
  /** Close on Escape key */
  closeOnEscape?: boolean;
  
  /** Show close button */
  showCloseButton?: boolean;
  
  /** Lock body scroll when open */
  lockScroll?: boolean;
  
  /** Initial focus element ref */
  initialFocusRef?: React.RefObject<HTMLElement>;
  
  /** Return focus to trigger on close */
  returnFocusOnClose?: boolean;
  
  /** Overlay blur effect */
  overlayBlur?: boolean;
  
  /** Custom overlay class */
  overlayClassName?: string;
  
  /** Prevent close (for confirmation dialogs) */
  preventClose?: boolean;
  
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * Modal Header props
 */
export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text */
  title?: ReactNode;
  
  /** Subtitle text */
  subtitle?: ReactNode;
  
  /** Icon */
  icon?: ReactNode;
  
  /** Show divider */
  divider?: boolean;
  
  /** On close callback (for close button) */
  onClose?: () => void;
  
  /** Show close button */
  showCloseButton?: boolean;
}

/**
 * Modal Body props
 */
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable scroll */
  scrollable?: boolean;
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Modal Footer props
 */
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Show divider */
  divider?: boolean;
  
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between';
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ANIMATION_DURATION = 200;

// =============================================================================
// STYLES
// =============================================================================

const sizeStyles: Record<ModalSize, string> = {
  xs: 'max-w-xs w-full',
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
  xl: 'max-w-2xl w-full',
  full: 'max-w-[calc(100vw-2rem)] w-full max-h-[calc(100vh-2rem)]',
};

const positionStyles: Record<ModalPosition, { container: string; animation: { enter: string; exit: string } }> = {
  center: {
    container: 'items-center justify-center',
    animation: {
      enter: 'scale-100 opacity-100',
      exit: 'scale-95 opacity-0',
    },
  },
  top: {
    container: 'items-start justify-center pt-16',
    animation: {
      enter: 'translate-y-0 opacity-100',
      exit: '-translate-y-8 opacity-0',
    },
  },
  bottom: {
    container: 'items-end justify-center pb-16',
    animation: {
      enter: 'translate-y-0 opacity-100',
      exit: 'translate-y-8 opacity-0',
    },
  },
  left: {
    container: 'items-center justify-start pl-4',
    animation: {
      enter: 'translate-x-0 opacity-100',
      exit: '-translate-x-8 opacity-0',
    },
  },
  right: {
    container: 'items-center justify-end pr-4',
    animation: {
      enter: 'translate-x-0 opacity-100',
      exit: 'translate-x-8 opacity-0',
    },
  },
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

// =============================================================================
// FOCUS TRAP HOOK
// =============================================================================

function useFocusTrap(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>,
  initialFocusRef?: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isOpen, containerRef, initialFocusRef]);
}

// =============================================================================
// SCROLL LOCK HOOK
// =============================================================================

function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
}

// =============================================================================
// CLOSE BUTTON COMPONENT
// =============================================================================

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

function CloseButton({ onClick, className = '' }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-1.5 rounded-lg
        text-[var(--color-text-tertiary)]
        hover:text-[var(--color-text-primary)]
        hover:bg-[var(--color-bg-hover)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]
        transition-colors duration-150
        ${className}
      `}
      aria-label="Fermer"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

// =============================================================================
// MODAL COMPONENT
// =============================================================================

/**
 * Modal Component
 * 
 * A fully accessible modal dialog with focus trapping, animations,
 * and multiple size/position variants.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalHeader title="Confirmation" onClose={() => setIsOpen(false)} />
 *   <ModalBody>
 *     <p>Are you sure you want to proceed?</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button variant="primary">Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  function Modal(
    {
      isOpen,
      onClose,
      size = 'md',
      position = 'center',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      lockScroll = true,
      initialFocusRef,
      returnFocusOnClose = true,
      overlayBlur = true,
      overlayClassName = '',
      preventClose = false,
      animationDuration = ANIMATION_DURATION,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    // Focus management
    useFocusTrap(isOpen && !isAnimating, containerRef, initialFocusRef);
    useScrollLock(isOpen && lockScroll);

    // Store trigger element for focus return
    useEffect(() => {
      if (isOpen) {
        triggerRef.current = document.activeElement as HTMLElement;
      }
    }, [isOpen]);

    // Handle open/close animation
    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      } else if (shouldRender) {
        setIsAnimating(false);
        const timer = setTimeout(() => {
          setShouldRender(false);
          // Return focus
          if (returnFocusOnClose && triggerRef.current) {
            triggerRef.current.focus();
          }
        }, animationDuration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, shouldRender, returnFocusOnClose, animationDuration]);

    // Handle escape key
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape && !preventClose) {
          onClose();
        }
      },
      [closeOnEscape, preventClose, onClose]
    );

    // Handle overlay click
    const handleOverlayClick = useCallback(
      (e: MouseEvent) => {
        if (e.target === e.currentTarget && closeOnOverlayClick && !preventClose) {
          onClose();
        }
      },
      [closeOnOverlayClick, preventClose, onClose]
    );

    // Don't render if not needed
    if (!shouldRender) return null;

    const positionConfig = positionStyles[position];
    const animationState = isAnimating && isOpen ? positionConfig.animation.enter : positionConfig.animation.exit;

    const modalContent = (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`
          fixed inset-0 z-[var(--z-modal)]
          flex ${positionConfig.container}
          p-4
        `}
        onKeyDown={handleKeyDown}
      >
        {/* Overlay */}
        <div
          className={`
            fixed inset-0 z-[var(--z-modal-backdrop)]
            bg-[var(--color-bg-overlay)]
            ${overlayBlur ? 'backdrop-blur-sm' : ''}
            transition-opacity
            ${isAnimating && isOpen ? 'opacity-100' : 'opacity-0'}
            ${overlayClassName}
          `}
          style={{ transitionDuration: `${animationDuration}ms` }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal container */}
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={`
            relative z-[var(--z-modal)]
            ${sizeStyles[size]}
            bg-[var(--color-bg-secondary)]
            rounded-xl
            shadow-2xl
            border border-[var(--color-border-subtle)]
            transform transition-all
            ${animationState}
            ${className}
          `}
          style={{ transitionDuration: `${animationDuration}ms` }}
          {...props}
        >
          {/* Close button (absolute positioned) */}
          {showCloseButton && !preventClose && (
            <div className="absolute top-3 right-3 z-10">
              <CloseButton onClick={onClose} />
            </div>
          )}

          {children}
        </div>
      </div>
    );

    // Render in portal
    return createPortal(modalContent, document.body);
  }
);

// =============================================================================
// MODAL HEADER COMPONENT
// =============================================================================

/**
 * Modal Header
 */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(
    {
      title,
      subtitle,
      icon,
      divider = true,
      onClose,
      showCloseButton = false,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`
          flex items-start gap-4
          px-6 py-4
          ${divider ? 'border-b border-[var(--color-border-subtle)]' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)]">
            {icon}
          </div>
        )}

        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0 pr-8">
          {title && (
            <h2
              id="modal-title"
              className="text-lg font-semibold text-[var(--color-text-primary)]"
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {/* Close button (inline) */}
        {showCloseButton && onClose && (
          <CloseButton onClick={onClose} />
        )}
      </div>
    );
  }
);

// =============================================================================
// MODAL BODY COMPONENT
// =============================================================================

/**
 * Modal Body
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody(
    { scrollable = true, padding = 'md', className = '', children, ...props },
    ref
  ) {
    const paddingClass = {
      none: 'p-0',
      sm: 'px-4 py-3',
      md: 'px-6 py-4',
      lg: 'px-6 py-6',
    };

    return (
      <div
        ref={ref}
        id="modal-description"
        className={`
          ${paddingClass[padding]}
          ${scrollable ? 'overflow-y-auto max-h-[60vh]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// MODAL FOOTER COMPONENT
// =============================================================================

/**
 * Modal Footer
 */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(
    { divider = true, justify = 'end', className = '', children, ...props },
    ref
  ) {
    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3
          px-6 py-4
          ${justifyStyles[justify]}
          ${divider ? 'border-t border-[var(--color-border-subtle)]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// CONFIRMATION DIALOG
// =============================================================================

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  
  /** Callback when dialog should close */
  onClose: () => void;
  
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  
  /** Title */
  title: string;
  
  /** Description */
  description?: string;
  
  /** Confirm button text */
  confirmText?: string;
  
  /** Cancel button text */
  cancelText?: string;
  
  /** Variant (affects confirm button style) */
  variant?: 'default' | 'danger';
  
  /** Loading state */
  loading?: boolean;
  
  /** Icon */
  icon?: ReactNode;
}

/**
 * Confirmation Dialog
 * 
 * A pre-composed modal for confirmation actions.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item?"
 *   description="This action cannot be undone."
 *   confirmText="Delete"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  loading = false,
  icon,
}: ConfirmDialogProps): JSX.Element {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const defaultIcon = variant === 'danger' ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--color-status-error)]"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--color-brand-primary)]"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={false}
      preventClose={loading}
    >
      <ModalHeader
        icon={icon || defaultIcon}
        title={title}
        subtitle={description}
        divider={false}
      />
      <ModalFooter justify="end" divider={false}>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="
            px-4 py-2 rounded-lg
            text-sm font-medium
            text-[var(--color-text-secondary)]
            hover:text-[var(--color-text-primary)]
            hover:bg-[var(--color-bg-hover)]
            disabled:opacity-50
            transition-colors duration-150
          "
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={`
            px-4 py-2 rounded-lg
            text-sm font-medium
            text-white
            disabled:opacity-50
            transition-colors duration-150
            ${variant === 'danger'
              ? 'bg-[var(--color-status-error)] hover:bg-[var(--rust-600)]'
              : 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)]'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Chargement...
            </span>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// =============================================================================
// DRAWER COMPONENT (Slide-in modal variant)
// =============================================================================

export interface DrawerProps extends Omit<ModalProps, 'position' | 'size'> {
  /** Drawer position */
  position?: 'left' | 'right' | 'top' | 'bottom';
  
  /** Drawer size (width for left/right, height for top/bottom) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const drawerSizeStyles: Record<DrawerProps['position'] & string, Record<NonNullable<DrawerProps['size']>, string>> = {
  left: {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[28rem]',
    xl: 'w-[36rem]',
    full: 'w-screen',
  },
  right: {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[28rem]',
    xl: 'w-[36rem]',
    full: 'w-screen',
  },
  top: {
    xs: 'h-32',
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-96',
    xl: 'h-[32rem]',
    full: 'h-screen',
  },
  bottom: {
    xs: 'h-32',
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-96',
    xl: 'h-[32rem]',
    full: 'h-screen',
  },
};

const drawerPositionStyles: Record<string, { container: string; panel: string; enter: string; exit: string }> = {
  left: {
    container: 'justify-start',
    panel: 'h-full rounded-r-xl rounded-l-none',
    enter: 'translate-x-0',
    exit: '-translate-x-full',
  },
  right: {
    container: 'justify-end',
    panel: 'h-full rounded-l-xl rounded-r-none',
    enter: 'translate-x-0',
    exit: 'translate-x-full',
  },
  top: {
    container: 'items-start',
    panel: 'w-full rounded-b-xl rounded-t-none',
    enter: 'translate-y-0',
    exit: '-translate-y-full',
  },
  bottom: {
    container: 'items-end',
    panel: 'w-full rounded-t-xl rounded-b-none',
    enter: 'translate-y-0',
    exit: 'translate-y-full',
  },
};

/**
 * Drawer Component
 * 
 * A slide-in panel variant of the modal.
 * 
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} position="right">
 *   <ModalHeader title="Settings" onClose={() => setIsOpen(false)} />
 *   <ModalBody>Drawer content</ModalBody>
 * </Drawer>
 * ```
 */
export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  lockScroll = true,
  overlayBlur = true,
  overlayClassName = '',
  animationDuration = ANIMATION_DURATION,
  className = '',
  children,
  ...props
}: DrawerProps): JSX.Element | null {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useScrollLock(isOpen && lockScroll);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else if (shouldRender) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, animationDuration]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  const handleOverlayClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  if (!shouldRender) return null;

  const posConfig = drawerPositionStyles[position];
  const sizeClass = drawerSizeStyles[position]?.[size] || '';
  const animationState = isAnimating && isOpen ? posConfig.enter : posConfig.exit;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={`
        fixed inset-0 z-[var(--z-modal)]
        flex ${posConfig.container}
      `}
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-[var(--z-modal-backdrop)]
          bg-[var(--color-bg-overlay)]
          ${overlayBlur ? 'backdrop-blur-sm' : ''}
          transition-opacity
          ${isAnimating && isOpen ? 'opacity-100' : 'opacity-0'}
          ${overlayClassName}
        `}
        style={{ transitionDuration: `${animationDuration}ms` }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          relative z-[var(--z-modal)]
          ${sizeClass}
          ${posConfig.panel}
          bg-[var(--color-bg-secondary)]
          shadow-2xl
          border border-[var(--color-border-subtle)]
          transform transition-transform
          ${animationState}
          ${className}
        `}
        style={{ transitionDuration: `${animationDuration}ms` }}
        {...props}
      >
        {showCloseButton && (
          <div className="absolute top-3 right-3 z-10">
            <CloseButton onClick={onClose} />
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Modal;
