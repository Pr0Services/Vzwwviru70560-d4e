// CHE·NU™ Tooltip & Popover System
// Comprehensive floating UI components

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  createContext,
  useContext,
  ReactNode,
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

type TriggerType = 'hover' | 'click' | 'focus' | 'manual';

interface Position {
  top: number;
  left: number;
}

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  trigger?: TriggerType | TriggerType[];
  delay?: number | { show: number; hide: number };
  offset?: number;
  arrow?: boolean;
  maxWidth?: number | string;
  disabled?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
}

interface PopoverProps extends Omit<TooltipProps, 'arrow' | 'maxWidth'> {
  title?: ReactNode;
  showClose?: boolean;
  interactive?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  width?: number | string;
  maxHeight?: number | string;
}

interface HoverCardProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  delay?: number | { show: number; hide: number };
  offset?: number;
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

interface DropdownMenuProps {
  trigger: ReactElement;
  items: DropdownMenuItem[];
  placement?: Placement;
  offset?: number;
  disabled?: boolean;
  className?: string;
}

interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  submenu?: DropdownMenuItem[];
  onClick?: () => void;
}

interface ContextMenuProps {
  items: DropdownMenuItem[];
  children: ReactElement;
  disabled?: boolean;
  className?: string;
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
// UTILITIES
// ============================================================

function getPlacementStyles(
  placement: Placement,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  offset: number,
  containerRect?: DOMRect
): Position {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let top = 0;
  let left = 0;

  // Base positions
  const positions: Record<string, Position> = {
    'top': {
      top: triggerRect.top + scrollY - contentRect.height - offset,
      left: triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2,
    },
    'top-start': {
      top: triggerRect.top + scrollY - contentRect.height - offset,
      left: triggerRect.left + scrollX,
    },
    'top-end': {
      top: triggerRect.top + scrollY - contentRect.height - offset,
      left: triggerRect.right + scrollX - contentRect.width,
    },
    'bottom': {
      top: triggerRect.bottom + scrollY + offset,
      left: triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2,
    },
    'bottom-start': {
      top: triggerRect.bottom + scrollY + offset,
      left: triggerRect.left + scrollX,
    },
    'bottom-end': {
      top: triggerRect.bottom + scrollY + offset,
      left: triggerRect.right + scrollX - contentRect.width,
    },
    'left': {
      top: triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2,
      left: triggerRect.left + scrollX - contentRect.width - offset,
    },
    'left-start': {
      top: triggerRect.top + scrollY,
      left: triggerRect.left + scrollX - contentRect.width - offset,
    },
    'left-end': {
      top: triggerRect.bottom + scrollY - contentRect.height,
      left: triggerRect.left + scrollX - contentRect.width - offset,
    },
    'right': {
      top: triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2,
      left: triggerRect.right + scrollX + offset,
    },
    'right-start': {
      top: triggerRect.top + scrollY,
      left: triggerRect.right + scrollX + offset,
    },
    'right-end': {
      top: triggerRect.bottom + scrollY - contentRect.height,
      left: triggerRect.right + scrollX + offset,
    },
  };

  const position = positions[placement] || positions['bottom'];
  top = position.top;
  left = position.left;

  // Boundary detection and adjustment
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Horizontal bounds
  if (left < 8) {
    left = 8;
  } else if (left + contentRect.width > viewportWidth - 8) {
    left = viewportWidth - contentRect.width - 8;
  }

  // Vertical bounds
  if (top < 8) {
    top = 8;
  } else if (top + contentRect.height > viewportHeight + scrollY - 8) {
    top = viewportHeight + scrollY - contentRect.height - 8;
  }

  return { top, left };
}

function getArrowStyles(placement: Placement): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    backgroundColor: 'inherit',
    transform: 'rotate(45deg)',
  };

  if (placement.startsWith('top')) {
    return { ...base, bottom: '-4px', left: '50%', marginLeft: '-4px' };
  }
  if (placement.startsWith('bottom')) {
    return { ...base, top: '-4px', left: '50%', marginLeft: '-4px' };
  }
  if (placement.startsWith('left')) {
    return { ...base, right: '-4px', top: '50%', marginTop: '-4px' };
  }
  if (placement.startsWith('right')) {
    return { ...base, left: '-4px', top: '50%', marginTop: '-4px' };
  }
  return base;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Tooltip styles
  tooltip: {
    position: 'fixed' as const,
    zIndex: 10000,
    padding: '6px 12px',
    backgroundColor: BRAND.uiSlate,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'none' as const,
    animation: 'tooltipFadeIn 0.15s ease-out',
  },

  tooltipArrow: {
    position: 'absolute' as const,
    width: '8px',
    height: '8px',
    backgroundColor: BRAND.uiSlate,
    transform: 'rotate(45deg)',
  },

  // Popover styles
  popover: {
    position: 'fixed' as const,
    zIndex: 10000,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    animation: 'popoverFadeIn 0.2s ease-out',
  },

  popoverHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  popoverTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  popoverClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '18px',
    color: BRAND.ancientStone,
    lineHeight: 1,
    borderRadius: '4px',
    transition: 'all 0.2s',
  },

  popoverContent: {
    padding: '16px',
  },

  // Hover card styles
  hoverCard: {
    position: 'fixed' as const,
    zIndex: 10000,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    animation: 'hoverCardFadeIn 0.2s ease-out',
  },

  // Dropdown menu styles
  dropdownMenu: {
    position: 'fixed' as const,
    zIndex: 10000,
    minWidth: '180px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}15`,
    padding: '4px 0',
    animation: 'dropdownFadeIn 0.15s ease-out',
  },

  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontSize: '14px',
    color: BRAND.uiSlate,
    transition: 'background-color 0.1s',
  },

  dropdownItemHover: {
    backgroundColor: `${BRAND.ancientStone}10`,
  },

  dropdownItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  dropdownItemDanger: {
    color: '#E53E3E',
  },

  dropdownItemDangerHover: {
    backgroundColor: '#FFF5F5',
  },

  dropdownItemIcon: {
    fontSize: '16px',
    width: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownItemLabel: {
    flex: 1,
  },

  dropdownItemShortcut: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    fontFamily: 'monospace',
  },

  dropdownItemSubmenuIcon: {
    fontSize: '10px',
    color: BRAND.ancientStone,
  },

  dropdownDivider: {
    height: '1px',
    backgroundColor: `${BRAND.ancientStone}15`,
    margin: '4px 0',
  },

  // Context menu styles
  contextMenu: {
    position: 'fixed' as const,
    zIndex: 10001,
    minWidth: '180px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${BRAND.ancientStone}15`,
    padding: '4px 0',
    animation: 'contextMenuFadeIn 0.1s ease-out',
  },
};

// ============================================================
// TOOLTIP COMPONENT
// ============================================================

export function Tooltip({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  delay = { show: 200, hide: 0 },
  offset = 8,
  arrow = true,
  maxWidth = 300,
  disabled = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
}: TooltipProps): JSX.Element {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const showDelay = typeof delay === 'number' ? delay : delay.show;
  const hideDelay = typeof delay === 'number' ? 0 : delay.hide;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const newPosition = getPlacementStyles(placement, triggerRect, contentRect, offset);
    setPosition(newPosition);
  }, [placement, offset]);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(true);
      }
      onOpenChange?.(true);
    }, showDelay);
  }, [disabled, showDelay, controlledOpen, onOpenChange]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    }, hideDelay);
  }, [hideDelay, controlledOpen, onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }, [isOpen, show, hide]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Build trigger props
  const triggerProps: Record<string, any> = {
    ref: triggerRef,
  };

  if (triggers.includes('hover')) {
    triggerProps.onMouseEnter = show;
    triggerProps.onMouseLeave = hide;
  }
  if (triggers.includes('focus')) {
    triggerProps.onFocus = show;
    triggerProps.onBlur = hide;
  }
  if (triggers.includes('click')) {
    triggerProps.onClick = toggle;
  }

  const triggerElement = isValidElement(children)
    ? cloneElement(children, triggerProps)
    : children;

  return (
    <>
      {triggerElement}
      {isOpen && content && (
        <div
          ref={contentRef}
          role="tooltip"
          style={{
            ...styles.tooltip,
            top: position.top,
            left: position.left,
            maxWidth,
          }}
          className={`${className || ''} ${contentClassName || ''}`}
        >
          {content}
          {arrow && <div style={{ ...styles.tooltipArrow, ...getArrowStyles(placement) }} />}
        </div>
      )}
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// POPOVER COMPONENT
// ============================================================

export function Popover({
  content,
  children,
  placement = 'bottom',
  trigger = 'click',
  delay = { show: 0, hide: 0 },
  offset = 8,
  disabled = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  title,
  showClose = true,
  interactive = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  width = 'auto',
  maxHeight,
  className,
  contentClassName,
}: PopoverProps): JSX.Element {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const showDelay = typeof delay === 'number' ? delay : delay.show;
  const hideDelay = typeof delay === 'number' ? 0 : delay.hide;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const newPosition = getPlacementStyles(placement, triggerRect, contentRect, offset);
    setPosition(newPosition);
  }, [placement, offset]);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(true);
      }
      onOpenChange?.(true);
    }, showDelay);
  }, [disabled, showDelay, controlledOpen, onOpenChange]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    }, hideDelay);
  }, [hideDelay, controlledOpen, onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }, [isOpen, show, hide]);

  // Update position when open
  useEffect(() => {
    if (isOpen) {
      // Small delay to let content render
      requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        hide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, hide]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, hide]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Build trigger props
  const triggerProps: Record<string, any> = {
    ref: triggerRef,
  };

  if (triggers.includes('hover')) {
    triggerProps.onMouseEnter = show;
    triggerProps.onMouseLeave = interactive ? undefined : hide;
  }
  if (triggers.includes('focus')) {
    triggerProps.onFocus = show;
    triggerProps.onBlur = hide;
  }
  if (triggers.includes('click')) {
    triggerProps.onClick = toggle;
  }

  const triggerElement = isValidElement(children)
    ? cloneElement(children, triggerProps)
    : children;

  return (
    <>
      {triggerElement}
      {isOpen && (
        <div
          ref={contentRef}
          role="dialog"
          style={{
            ...styles.popover,
            top: position.top,
            left: position.left,
            width,
            maxHeight,
            overflowY: maxHeight ? 'auto' : undefined,
          }}
          className={className}
          onMouseEnter={interactive && triggers.includes('hover') ? show : undefined}
          onMouseLeave={interactive && triggers.includes('hover') ? hide : undefined}
        >
          {(title || showClose) && (
            <div style={styles.popoverHeader}>
              {title && <h4 style={styles.popoverTitle}>{title}</h4>}
              {showClose && (
                <button style={styles.popoverClose} onClick={hide}>
                  ×
                </button>
              )}
            </div>
          )}
          <div style={styles.popoverContent} className={contentClassName}>
            {content}
          </div>
        </div>
      )}
      <style>{`
        @keyframes popoverFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// HOVER CARD COMPONENT
// ============================================================

export function HoverCard({
  content,
  children,
  placement = 'bottom',
  delay = { show: 500, hide: 300 },
  offset = 8,
  width = 320,
  disabled = false,
  className,
}: HoverCardProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const showDelay = typeof delay === 'number' ? delay : delay.show;
  const hideDelay = typeof delay === 'number' ? 300 : delay.hide;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const newPosition = getPlacementStyles(placement, triggerRect, contentRect, offset);
    setPosition(newPosition);
  }, [placement, offset]);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, showDelay);
  }, [disabled, showDelay]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, hideDelay);
  }, [hideDelay]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const triggerElement = isValidElement(children)
    ? cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: show,
        onMouseLeave: hide,
      })
    : children;

  return (
    <>
      {triggerElement}
      {isOpen && (
        <div
          ref={contentRef}
          style={{
            ...styles.hoverCard,
            top: position.top,
            left: position.left,
            width,
          }}
          className={className}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {content}
        </div>
      )}
      <style>{`
        @keyframes hoverCardFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// DROPDOWN MENU COMPONENT
// ============================================================

export function DropdownMenu({
  trigger,
  items,
  placement = 'bottom-start',
  offset = 4,
  disabled = false,
  className,
}: DropdownMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const newPosition = getPlacementStyles(placement, triggerRect, menuRect, offset);
    setPosition(newPosition);
  }, [placement, offset]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(updatePosition);
      
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          close();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition, close]);

  const handleItemClick = useCallback((item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    if (!item.submenu) {
      close();
    }
  }, [close]);

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: triggerRef,
        onClick: toggle,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
      })
    : trigger;

  const renderItem = (item: DropdownMenuItem) => {
    if (item.divider) {
      return <div key={item.id} style={styles.dropdownDivider} />;
    }

    const isHovered = hoveredId === item.id;
    const isDanger = item.danger;

    return (
      <button
        key={item.id}
        style={{
          ...styles.dropdownItem,
          ...(isHovered && !isDanger && styles.dropdownItemHover),
          ...(isDanger && styles.dropdownItemDanger),
          ...(isHovered && isDanger && styles.dropdownItemDangerHover),
          ...(item.disabled && styles.dropdownItemDisabled),
        }}
        disabled={item.disabled}
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {item.icon && <span style={styles.dropdownItemIcon}>{item.icon}</span>}
        <span style={styles.dropdownItemLabel}>{item.label}</span>
        {item.shortcut && <span style={styles.dropdownItemShortcut}>{item.shortcut}</span>}
        {item.submenu && <span style={styles.dropdownItemSubmenuIcon}>▶</span>}
      </button>
    );
  };

  return (
    <>
      {triggerElement}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            ...styles.dropdownMenu,
            top: position.top,
            left: position.left,
          }}
          className={className}
        >
          {items.map(renderItem)}
        </div>
      )}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// CONTEXT MENU COMPONENT
// ============================================================

export function ContextMenu({
  items,
  children,
  disabled = false,
  className,
}: ContextMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    event.preventDefault();
    setPosition({ top: event.clientY, left: event.clientX });
    setIsOpen(true);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleClick = () => close();
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      };
      const handleScroll = () => close();

      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, close]);

  // Adjust position to stay in viewport
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedLeft = position.left;
      let adjustedTop = position.top;

      if (position.left + rect.width > viewportWidth) {
        adjustedLeft = viewportWidth - rect.width - 8;
      }
      if (position.top + rect.height > viewportHeight) {
        adjustedTop = viewportHeight - rect.height - 8;
      }

      if (adjustedLeft !== position.left || adjustedTop !== position.top) {
        setPosition({ top: adjustedTop, left: adjustedLeft });
      }
    }
  }, [isOpen, position]);

  const handleItemClick = useCallback((item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    close();
  }, [close]);

  const triggerElement = isValidElement(children)
    ? cloneElement(children, { onContextMenu: handleContextMenu })
    : children;

  const renderItem = (item: DropdownMenuItem) => {
    if (item.divider) {
      return <div key={item.id} style={styles.dropdownDivider} />;
    }

    const isHovered = hoveredId === item.id;
    const isDanger = item.danger;

    return (
      <button
        key={item.id}
        style={{
          ...styles.dropdownItem,
          ...(isHovered && !isDanger && styles.dropdownItemHover),
          ...(isDanger && styles.dropdownItemDanger),
          ...(isHovered && isDanger && styles.dropdownItemDangerHover),
          ...(item.disabled && styles.dropdownItemDisabled),
        }}
        disabled={item.disabled}
        onClick={(e) => {
          e.stopPropagation();
          handleItemClick(item);
        }}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {item.icon && <span style={styles.dropdownItemIcon}>{item.icon}</span>}
        <span style={styles.dropdownItemLabel}>{item.label}</span>
        {item.shortcut && <span style={styles.dropdownItemShortcut}>{item.shortcut}</span>}
      </button>
    );
  };

  return (
    <>
      {triggerElement}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            ...styles.contextMenu,
            top: position.top,
            left: position.left,
          }}
          className={className}
        >
          {items.map(renderItem)}
        </div>
      )}
      <style>{`
        @keyframes contextMenuFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  Placement,
  TriggerType,
  Position,
  TooltipProps,
  PopoverProps,
  HoverCardProps,
  DropdownMenuProps,
  DropdownMenuItem,
  ContextMenuProps,
};

export default {
  Tooltip,
  Popover,
  HoverCard,
  DropdownMenu,
  ContextMenu,
};
