// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — TOOLTIP COMPONENT
// Production-grade tooltip with positioning and accessibility
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Tooltip placement options
 */
export type TooltipPlacement =
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

/**
 * Tooltip trigger type
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

/**
 * Tooltip props
 */
export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  
  /** Trigger element */
  children: ReactElement;
  
  /** Placement */
  placement?: TooltipPlacement;
  
  /** Trigger type */
  trigger?: TooltipTrigger | TooltipTrigger[];
  
  /** Delay before showing (ms) */
  showDelay?: number;
  
  /** Delay before hiding (ms) */
  hideDelay?: number;
  
  /** Controlled open state */
  isOpen?: boolean;
  
  /** Default open state */
  defaultOpen?: boolean;
  
  /** Callback when open changes */
  onOpenChange?: (isOpen: boolean) => void;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Show arrow */
  hasArrow?: boolean;
  
  /** Offset from trigger (px) */
  offset?: number;
  
  /** Max width */
  maxWidth?: number | string;
  
  /** Additional class for tooltip */
  className?: string;
  
  /** Z-index */
  zIndex?: number;
  
  /** Interactive tooltip (hoverable) */
  interactive?: boolean;
}

/**
 * Popover props (extended tooltip for richer content)
 */
export interface PopoverProps extends Omit<TooltipProps, 'hasArrow' | 'maxWidth'> {
  /** Title */
  title?: ReactNode;
  
  /** Close button */
  showCloseButton?: boolean;
  
  /** On close callback */
  onClose?: () => void;
  
  /** Popover width */
  width?: number | string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ARROW_SIZE = 8;
const DEFAULT_OFFSET = 8;
const VIEWPORT_PADDING = 8;

// =============================================================================
// POSITION CALCULATION
// =============================================================================

interface Position {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowRotation: number;
  actualPlacement: TooltipPlacement;
}

function calculatePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
  offset: number,
  hasArrow: boolean
): Position {
  const arrowOffset = hasArrow ? ARROW_SIZE : 0;
  const totalOffset = offset + arrowOffset;
  
  let top = 0;
  let left = 0;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  let arrowRotation = 0;
  let actualPlacement = placement;

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Calculate base position
  const positions: Record<string, () => void> = {
    top: () => {
      top = triggerRect.top - tooltipRect.height - totalOffset;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      arrowTop = tooltipRect.height;
      arrowLeft = tooltipRect.width / 2 - ARROW_SIZE / 2;
      arrowRotation = 180;
    },
    'top-start': () => {
      top = triggerRect.top - tooltipRect.height - totalOffset;
      left = triggerRect.left;
      arrowTop = tooltipRect.height;
      arrowLeft = Math.min(16, tooltipRect.width / 2 - ARROW_SIZE / 2);
      arrowRotation = 180;
    },
    'top-end': () => {
      top = triggerRect.top - tooltipRect.height - totalOffset;
      left = triggerRect.right - tooltipRect.width;
      arrowTop = tooltipRect.height;
      arrowLeft = tooltipRect.width - Math.min(16, tooltipRect.width / 2 - ARROW_SIZE / 2) - ARROW_SIZE;
      arrowRotation = 180;
    },
    bottom: () => {
      top = triggerRect.bottom + totalOffset;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      arrowTop = -ARROW_SIZE;
      arrowLeft = tooltipRect.width / 2 - ARROW_SIZE / 2;
      arrowRotation = 0;
    },
    'bottom-start': () => {
      top = triggerRect.bottom + totalOffset;
      left = triggerRect.left;
      arrowTop = -ARROW_SIZE;
      arrowLeft = Math.min(16, tooltipRect.width / 2 - ARROW_SIZE / 2);
      arrowRotation = 0;
    },
    'bottom-end': () => {
      top = triggerRect.bottom + totalOffset;
      left = triggerRect.right - tooltipRect.width;
      arrowTop = -ARROW_SIZE;
      arrowLeft = tooltipRect.width - Math.min(16, tooltipRect.width / 2 - ARROW_SIZE / 2) - ARROW_SIZE;
      arrowRotation = 0;
    },
    left: () => {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - totalOffset;
      arrowTop = tooltipRect.height / 2 - ARROW_SIZE / 2;
      arrowLeft = tooltipRect.width;
      arrowRotation = 90;
    },
    'left-start': () => {
      top = triggerRect.top;
      left = triggerRect.left - tooltipRect.width - totalOffset;
      arrowTop = Math.min(16, tooltipRect.height / 2 - ARROW_SIZE / 2);
      arrowLeft = tooltipRect.width;
      arrowRotation = 90;
    },
    'left-end': () => {
      top = triggerRect.bottom - tooltipRect.height;
      left = triggerRect.left - tooltipRect.width - totalOffset;
      arrowTop = tooltipRect.height - Math.min(16, tooltipRect.height / 2 - ARROW_SIZE / 2) - ARROW_SIZE;
      arrowLeft = tooltipRect.width;
      arrowRotation = 90;
    },
    right: () => {
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + totalOffset;
      arrowTop = tooltipRect.height / 2 - ARROW_SIZE / 2;
      arrowLeft = -ARROW_SIZE;
      arrowRotation = -90;
    },
    'right-start': () => {
      top = triggerRect.top;
      left = triggerRect.right + totalOffset;
      arrowTop = Math.min(16, tooltipRect.height / 2 - ARROW_SIZE / 2);
      arrowLeft = -ARROW_SIZE;
      arrowRotation = -90;
    },
    'right-end': () => {
      top = triggerRect.bottom - tooltipRect.height;
      left = triggerRect.right + totalOffset;
      arrowTop = tooltipRect.height - Math.min(16, tooltipRect.height / 2 - ARROW_SIZE / 2) - ARROW_SIZE;
      arrowLeft = -ARROW_SIZE;
      arrowRotation = -90;
    },
  };

  // Calculate initial position
  positions[placement]();

  // Flip if out of viewport
  const isTopOutOfBounds = top < VIEWPORT_PADDING;
  const isBottomOutOfBounds = top + tooltipRect.height > viewport.height - VIEWPORT_PADDING;
  const isLeftOutOfBounds = left < VIEWPORT_PADDING;
  const isRightOutOfBounds = left + tooltipRect.width > viewport.width - VIEWPORT_PADDING;

  // Simple flip logic
  if (placement.startsWith('top') && isTopOutOfBounds) {
    actualPlacement = placement.replace('top', 'bottom') as TooltipPlacement;
    positions[actualPlacement]();
  } else if (placement.startsWith('bottom') && isBottomOutOfBounds) {
    actualPlacement = placement.replace('bottom', 'top') as TooltipPlacement;
    positions[actualPlacement]();
  } else if (placement.startsWith('left') && isLeftOutOfBounds) {
    actualPlacement = placement.replace('left', 'right') as TooltipPlacement;
    positions[actualPlacement]();
  } else if (placement.startsWith('right') && isRightOutOfBounds) {
    actualPlacement = placement.replace('right', 'left') as TooltipPlacement;
    positions[actualPlacement]();
  }

  // Constrain to viewport
  left = Math.max(VIEWPORT_PADDING, Math.min(left, viewport.width - tooltipRect.width - VIEWPORT_PADDING));
  top = Math.max(VIEWPORT_PADDING, Math.min(top, viewport.height - tooltipRect.height - VIEWPORT_PADDING));

  return {
    top,
    left,
    arrowTop,
    arrowLeft,
    arrowRotation,
    actualPlacement,
  };
}

// =============================================================================
// ARROW COMPONENT
// =============================================================================

interface ArrowProps {
  top?: number;
  left?: number;
  rotation: number;
}

function Arrow({ top, left, rotation }: ArrowProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        width={ARROW_SIZE}
        height={ARROW_SIZE}
        viewBox="0 0 8 8"
        fill="currentColor"
        className="text-[var(--color-bg-inverse)]"
      >
        <path d="M0 8L4 0L8 8H0Z" />
      </svg>
    </div>
  );
}

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

/**
 * Tooltip Component
 * 
 * Displays additional information on hover, focus, or click.
 * 
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip content="This is helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * // With placement
 * <Tooltip content="Settings" placement="right">
 *   <IconButton icon={<IconSettings />} aria-label="Settings" />
 * </Tooltip>
 * 
 * // Click trigger
 * <Tooltip content="Click tooltip" trigger="click">
 *   <button>Click me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  showDelay = 200,
  hideDelay = 0,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  hasArrow = true,
  offset = DEFAULT_OFFSET,
  maxWidth = 250,
  className = '',
  zIndex,
  interactive = false,
}: TooltipProps): JSX.Element {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position | null>(null);
  
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  // Update position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const newPosition = calculatePosition(
      triggerRect,
      tooltipRect,
      placement,
      offset,
      hasArrow
    );
    
    setPosition(newPosition);
  }, [placement, offset, hasArrow]);

  // Show tooltip
  const show = useCallback(() => {
    if (disabled) return;
    
    clearTimeout(hideTimeoutRef.current);
    
    if (showDelay > 0) {
      showTimeoutRef.current = setTimeout(() => {
        setInternalIsOpen(true);
        onOpenChange?.(true);
      }, showDelay);
    } else {
      setInternalIsOpen(true);
      onOpenChange?.(true);
    }
  }, [disabled, showDelay, onOpenChange]);

  // Hide tooltip
  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    
    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setInternalIsOpen(false);
        onOpenChange?.(false);
      }, hideDelay);
    } else {
      setInternalIsOpen(false);
      onOpenChange?.(false);
    }
  }, [hideDelay, onOpenChange]);

  // Toggle tooltip
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
      // Small delay to ensure DOM is updated
      requestAnimationFrame(updatePosition);
      
      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Event handlers
  const triggerProps: Record<string, unknown> = {
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

  // Clone child with trigger props
  const triggerElement = cloneElement(children, {
    ...triggerProps,
    'aria-describedby': isOpen ? 'tooltip' : undefined,
  });

  // Tooltip content
  const tooltipContent = isOpen && content && (
    createPortal(
      <div
        ref={tooltipRef}
        id="tooltip"
        role="tooltip"
        className={`
          fixed
          px-3 py-2
          text-sm
          bg-[var(--color-bg-inverse)]
          text-[var(--color-text-inverse)]
          rounded-lg
          shadow-lg
          pointer-events-${interactive ? 'auto' : 'none'}
          transition-opacity duration-150
          ${isOpen ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          zIndex: zIndex ?? 'var(--z-tooltip)',
        }}
        onMouseEnter={interactive && triggers.includes('hover') ? show : undefined}
        onMouseLeave={interactive && triggers.includes('hover') ? hide : undefined}
      >
        {content}
        {hasArrow && position && (
          <Arrow
            top={position.arrowTop}
            left={position.arrowLeft}
            rotation={position.arrowRotation}
          />
        )}
      </div>,
      document.body
    )
  );

  return (
    <>
      {triggerElement}
      {tooltipContent}
    </>
  );
}

// =============================================================================
// POPOVER COMPONENT
// =============================================================================

/**
 * Popover Component
 * 
 * A richer tooltip-like component for more complex content.
 * 
 * @example
 * ```tsx
 * <Popover
 *   title="User Info"
 *   content={<UserDetails />}
 *   trigger="click"
 * >
 *   <Avatar src="/user.jpg" />
 * </Popover>
 * ```
 */
export function Popover({
  content,
  children,
  title,
  showCloseButton = false,
  onClose,
  width = 320,
  placement = 'bottom',
  trigger = 'click',
  className = '',
  ...tooltipProps
}: PopoverProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose?.();
    }
    tooltipProps.onOpenChange?.(open);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const popoverContent = (
    <div
      className={`
        bg-[var(--color-bg-secondary)]
        border border-[var(--color-border-default)]
        rounded-xl
        shadow-xl
        overflow-hidden
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
          {title && (
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
          )}
          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className="
                p-1 rounded
                text-[var(--color-text-tertiary)]
                hover:text-[var(--color-text-primary)]
                hover:bg-[var(--color-bg-hover)]
                transition-colors duration-150
              "
              aria-label="Fermer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        {content}
      </div>
    </div>
  );

  return (
    <Tooltip
      {...tooltipProps}
      content={popoverContent}
      placement={placement}
      trigger={trigger}
      hasArrow={false}
      offset={12}
      maxWidth="none"
      interactive
      isOpen={tooltipProps.isOpen ?? isOpen}
      onOpenChange={handleOpenChange}
      className="!p-0 !bg-transparent !text-inherit !shadow-none"
    >
      {children}
    </Tooltip>
  );
}

// =============================================================================
// INFO TOOLTIP COMPONENT (Pre-styled helper)
// =============================================================================

export interface InfoTooltipProps extends Omit<TooltipProps, 'children'> {
  /** Size of the info icon */
  size?: 'sm' | 'md' | 'lg';
  
  /** Icon color */
  color?: string;
}

const INFO_ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 20,
};

/**
 * Info Tooltip
 * 
 * A pre-styled tooltip with an info icon trigger.
 * 
 * @example
 * ```tsx
 * <label>
 *   Email <InfoTooltip content="We'll never share your email" />
 * </label>
 * ```
 */
export function InfoTooltip({
  size = 'sm',
  color,
  content,
  ...tooltipProps
}: InfoTooltipProps): JSX.Element {
  const iconSize = INFO_ICON_SIZES[size];

  return (
    <Tooltip content={content} {...tooltipProps}>
      <button
        type="button"
        className={`
          inline-flex items-center justify-center
          rounded-full
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]
          cursor-help
        `}
        style={{ color: color || 'var(--color-text-tertiary)' }}
        aria-label="Plus d'informations"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>
    </Tooltip>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Tooltip;
