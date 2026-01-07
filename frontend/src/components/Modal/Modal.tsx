// CHE·NU™ Modal/Dialog System
// Comprehensive modal management with animations

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  KeyboardEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalAnimation = 'fade' | 'slide' | 'scale' | 'none';

interface ModalConfig {
  id: string;
  content: ReactNode;
  size?: ModalSize;
  animation?: ModalAnimation;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  preventClose?: boolean;
  zIndex?: number;
}

interface ModalState {
  modals: ModalConfig[];
  activeModalId: string | null;
}

interface ModalContextValue {
  state: ModalState;
  open: (config: Omit<ModalConfig, 'id'> | ReactNode) => string;
  close: (id?: string) => void;
  closeAll: () => void;
  update: (id: string, updates: Partial<ModalConfig>) => void;
  isOpen: (id: string) => boolean;
}

interface ConfirmDialogConfig {
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  icon?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface AlertDialogConfig {
  title: string;
  message: string | ReactNode;
  buttonText?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

interface PromptDialogConfig {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'password' | 'email' | 'number' | 'textarea';
  confirmText?: string;
  cancelText?: string;
  validation?: (value: string) => string | null;
  onConfirm?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
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

const SIZE_WIDTHS: Record<ModalSize, string> = {
  sm: '400px',
  md: '560px',
  lg: '800px',
  xl: '1140px',
  full: '100%',
};

const ANIMATIONS: Record<ModalAnimation, { enter: string; exit: string }> = {
  fade: {
    enter: 'modalFadeIn 0.2s ease-out',
    exit: 'modalFadeOut 0.15s ease-in',
  },
  slide: {
    enter: 'modalSlideIn 0.3s ease-out',
    exit: 'modalSlideOut 0.2s ease-in',
  },
  scale: {
    enter: 'modalScaleIn 0.2s ease-out',
    exit: 'modalScaleOut 0.15s ease-in',
  },
  none: {
    enter: 'none',
    exit: 'none',
  },
};

// ============================================================
// UTILITIES
// ============================================================

function generateId(): string {
  return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function lockBodyScroll(): void {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockBodyScroll(): void {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

// ============================================================
// CONTEXT
// ============================================================

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backdropFilter: 'blur(4px)',
  },
  
  container: {
    position: 'relative' as const,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxHeight: 'calc(100vh - 32px)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
  },
  
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
    lineHeight: 1.4,
  },
  
  subtitle: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '16px',
    marginTop: '-4px',
    marginRight: '-8px',
    fontSize: '24px',
    color: BRAND.ancientStone,
    lineHeight: 1,
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  
  body: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
  },
  
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px 20px',
    borderTop: `1px solid ${BRAND.ancientStone}20`,
  },
  
  button: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },
  
  primaryButton: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    color: BRAND.uiSlate,
    border: `1px solid ${BRAND.ancientStone}40`,
  },
  
  dangerButton: {
    backgroundColor: '#E53E3E',
    color: '#ffffff',
  },
  
  warningButton: {
    backgroundColor: BRAND.earthEmber,
    color: '#ffffff',
  },
  
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}40`,
    fontSize: '14px',
    color: BRAND.uiSlate,
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}40`,
    fontSize: '14px',
    color: BRAND.uiSlate,
    resize: 'vertical' as const,
    minHeight: '100px',
    outline: 'none',
  },
  
  errorText: {
    color: '#E53E3E',
    fontSize: '12px',
    marginTop: '4px',
  },
  
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    marginBottom: '16px',
    fontSize: '28px',
  },
  
  dialogContent: {
    textAlign: 'center' as const,
    padding: '8px 0',
  },
  
  dialogTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '8px',
  },
  
  dialogMessage: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
  },
};

// ============================================================
// COMPONENTS
// ============================================================

interface ModalComponentProps {
  config: ModalConfig;
  onClose: () => void;
  isClosing: boolean;
}

function ModalComponent({ config, onClose, isClosing }: ModalComponentProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const animation = config.animation || 'scale';
  const animationStyle = isClosing ? ANIMATIONS[animation].exit : ANIMATIONS[animation].enter;

  useEffect(() => {
    // Store previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    modalRef.current?.focus();

    // Cleanup
    return () => {
      previousActiveElement.current?.focus();
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && config.closeOnEscape !== false && !config.preventClose) {
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [config.closeOnEscape, config.preventClose, onClose]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (
        event.target === event.currentTarget &&
        config.closeOnOverlayClick !== false &&
        !config.preventClose
      ) {
        onClose();
      }
    },
    [config.closeOnOverlayClick, config.preventClose, onClose]
  );

  return (
    <div
      style={{
        ...styles.overlay,
        animation: isClosing ? 'overlayFadeOut 0.15s ease-in' : 'overlayFadeIn 0.2s ease-out',
        zIndex: config.zIndex || 1000,
      }}
      className={config.overlayClassName}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        style={{
          ...styles.container,
          width: SIZE_WIDTHS[config.size || 'md'],
          maxWidth: config.size === 'full' ? '100%' : 'calc(100% - 32px)',
          animation: animationStyle,
        }}
        className={config.className}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {(config.title || config.showCloseButton !== false) && (
          <div style={styles.header}>
            <div style={styles.headerContent}>
              {config.title && <h2 style={styles.title}>{config.title}</h2>}
              {config.subtitle && <p style={styles.subtitle}>{config.subtitle}</p>}
            </div>
            {config.showCloseButton !== false && !config.preventClose && (
              <button
                style={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={styles.body}>{config.content}</div>
        {config.footer && <div style={styles.footer}>{config.footer}</div>}
      </div>
    </div>
  );
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps): JSX.Element {
  const [state, setState] = useState<ModalState>({
    modals: [],
    activeModalId: null,
  });
  const [closingIds, setClosingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (state.modals.length > 0) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    return () => {
      unlockBodyScroll();
    };
  }, [state.modals.length]);

  const open = useCallback((configOrContent: Omit<ModalConfig, 'id'> | ReactNode): string => {
    const id = generateId();
    const config: ModalConfig =
      React.isValidElement(configOrContent) || typeof configOrContent !== 'object'
        ? { id, content: configOrContent as ReactNode }
        : { ...configOrContent, id };

    setState((prev) => ({
      modals: [...prev.modals, config],
      activeModalId: id,
    }));

    config.onOpen?.();
    return id;
  }, []);

  const close = useCallback((id?: string) => {
    const modalId = id || state.activeModalId;
    if (!modalId) return;

    const modal = state.modals.find((m) => m.id === modalId);
    if (!modal || modal.preventClose) return;

    // Start closing animation
    setClosingIds((prev) => new Set(prev).add(modalId));

    // Remove after animation
    setTimeout(() => {
      setState((prev) => {
        const newModals = prev.modals.filter((m) => m.id !== modalId);
        return {
          modals: newModals,
          activeModalId: newModals.length > 0 ? newModals[newModals.length - 1].id : null,
        };
      });
      setClosingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(modalId);
        return newSet;
      });
      modal.onClose?.();
    }, 150);
  }, [state.activeModalId, state.modals]);

  const closeAll = useCallback(() => {
    state.modals.forEach((modal) => {
      if (!modal.preventClose) {
        close(modal.id);
      }
    });
  }, [state.modals, close]);

  const update = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setState((prev) => ({
      ...prev,
      modals: prev.modals.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const isOpen = useCallback(
    (id: string) => state.modals.some((m) => m.id === id),
    [state.modals]
  );

  const contextValue: ModalContextValue = {
    state,
    open,
    close,
    closeAll,
    update,
    isOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {state.modals.map((modal) => (
        <ModalComponent
          key={modal.id}
          config={modal}
          onClose={() => close(modal.id)}
          isClosing={closingIds.has(modal.id)}
        />
      ))}
      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes overlayFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalScaleOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
      `}</style>
    </ModalContext.Provider>
  );
}

// ============================================================
// DIALOG HOOKS
// ============================================================

export function useConfirm() {
  const { open, close } = useModal();

  return useCallback(
    (config: ConfirmDialogConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        const handleConfirm = async () => {
          try {
            await config.onConfirm?.();
            close(id);
            resolve(true);
          } catch (error) {
            logger.error('Confirm action failed:', error);
          }
        };

        const handleCancel = () => {
          config.onCancel?.();
          close(id);
          resolve(false);
        };

        const iconColors: Record<string, string> = {
          primary: BRAND.sacredGold,
          danger: '#E53E3E',
          warning: BRAND.earthEmber,
        };

        const content = (
          <div style={styles.dialogContent}>
            {config.icon && (
              <div
                style={{
                  ...styles.iconContainer,
                  backgroundColor: `${iconColors[config.confirmVariant || 'primary']}20`,
                  margin: '0 auto 16px',
                }}
              >
                {config.icon}
              </div>
            )}
            <h3 style={styles.dialogTitle}>{config.title}</h3>
            <p style={styles.dialogMessage}>{config.message}</p>
          </div>
        );

        const footer = (
          <>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleCancel}
            >
              {config.cancelText || 'Cancel'}
            </button>
            <button
              style={{
                ...styles.button,
                ...(config.confirmVariant === 'danger'
                  ? styles.dangerButton
                  : config.confirmVariant === 'warning'
                  ? styles.warningButton
                  : styles.primaryButton),
              }}
              onClick={handleConfirm}
            >
              {config.confirmText || 'Confirm'}
            </button>
          </>
        );

        const id = open({
          content,
          footer,
          size: 'sm',
          closeOnOverlayClick: false,
          showCloseButton: false,
        });
      });
    },
    [open, close]
  );
}

export function useAlert() {
  const { open, close } = useModal();

  return useCallback(
    (config: AlertDialogConfig): Promise<void> => {
      return new Promise((resolve) => {
        const handleClose = () => {
          config.onClose?.();
          close(id);
          resolve();
        };

        const content = (
          <div style={styles.dialogContent}>
            {config.icon && (
              <div
                style={{
                  ...styles.iconContainer,
                  backgroundColor: `${BRAND.cenoteTurquoise}20`,
                  margin: '0 auto 16px',
                }}
              >
                {config.icon}
              </div>
            )}
            <h3 style={styles.dialogTitle}>{config.title}</h3>
            <p style={styles.dialogMessage}>{config.message}</p>
          </div>
        );

        const footer = (
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleClose}
          >
            {config.buttonText || 'OK'}
          </button>
        );

        const id = open({
          content,
          footer,
          size: 'sm',
          closeOnOverlayClick: true,
          showCloseButton: false,
        });
      });
    },
    [open, close]
  );
}

export function usePrompt() {
  const { open, close } = useModal();

  return useCallback(
    (config: PromptDialogConfig): Promise<string | null> => {
      return new Promise((resolve) => {
        let inputValue = config.defaultValue || '';
        let errorMessage: string | null = null;

        const updateContent = () => {
          update(id, { content: renderContent() });
        };

        const handleConfirm = async () => {
          if (config.validation) {
            errorMessage = config.validation(inputValue);
            if (errorMessage) {
              updateContent();
              return;
            }
          }

          try {
            await config.onConfirm?.(inputValue);
            close(id);
            resolve(inputValue);
          } catch (error) {
            logger.error('Prompt action failed:', error);
          }
        };

        const handleCancel = () => {
          config.onCancel?.();
          close(id);
          resolve(null);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          inputValue = e.target.value;
          if (errorMessage) {
            errorMessage = null;
            updateContent();
          }
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && config.inputType !== 'textarea') {
            handleConfirm();
          }
        };

        const renderContent = () => (
          <div>
            <h3 style={{ ...styles.dialogTitle, textAlign: 'left', marginBottom: '16px' }}>
              {config.title}
            </h3>
            {config.message && (
              <p style={{ ...styles.dialogMessage, textAlign: 'left', marginBottom: '12px' }}>
                {config.message}
              </p>
            )}
            {config.inputType === 'textarea' ? (
              <textarea
                style={styles.textarea}
                placeholder={config.placeholder}
                defaultValue={config.defaultValue}
                onChange={handleInputChange}
                autoFocus
              />
            ) : (
              <input
                type={config.inputType || 'text'}
                style={styles.input}
                placeholder={config.placeholder}
                defaultValue={config.defaultValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            )}
            {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
          </div>
        );

        const footer = (
          <>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleCancel}
            >
              {config.cancelText || 'Cancel'}
            </button>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleConfirm}
            >
              {config.confirmText || 'Submit'}
            </button>
          </>
        );

        const { update } = useModal();
        const id = open({
          content: renderContent(),
          footer,
          size: 'sm',
          closeOnOverlayClick: false,
        });
      });
    },
    [open, close]
  );
}

// ============================================================
// STANDALONE MODAL
// ============================================================

interface StandaloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: ModalSize;
  animation?: ModalAnimation;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  animation = 'scale',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className,
  children,
}: StandaloneModalProps): JSX.Element | null {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      lockBodyScroll();
    } else if (shouldRender) {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        unlockBodyScroll();
      }, 150);
    }

    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const config: ModalConfig = {
    id: 'standalone',
    content: children,
    title,
    subtitle,
    size,
    animation,
    closeOnOverlayClick,
    closeOnEscape,
    showCloseButton,
    footer,
    className,
  };

  return (
    <>
      <ModalComponent config={config} onClose={onClose} isClosing={isClosing} />
      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes overlayFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalScaleOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ModalConfig,
  ModalSize,
  ModalAnimation,
  ModalContextValue,
  ConfirmDialogConfig,
  AlertDialogConfig,
  PromptDialogConfig,
};

export default {
  Provider: ModalProvider,
  useModal,
  useConfirm,
  useAlert,
  usePrompt,
  Modal,
};
