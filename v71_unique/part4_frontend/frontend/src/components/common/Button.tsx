/**
 * CHE·NU™ Button Components
 * 
 * Comprehensive button system with multiple variants, sizes, and states.
 * Includes icon buttons, button groups, and loading states.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';
import { Spinner } from './Loading';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
}

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'loadingText'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: ButtonSize;
  variant?: ButtonVariant;
  isAttached?: boolean;
  spacing?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  loadingText,
  children,
  disabled,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      ref={ref}
      className={`
        btn 
        btn--${variant} 
        btn--${size} 
        ${isFullWidth ? 'btn--full-width' : ''} 
        ${isLoading ? 'btn--loading' : ''} 
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <span className="btn__spinner">
          <Spinner size="sm" />
        </span>
      )}
      
      {!isLoading && leftIcon && (
        <span className="btn__icon btn__icon--left">{leftIcon}</span>
      )}
      
      <span className="btn__text">
        {isLoading && loadingText ? loadingText : children}
      </span>
      
      {!isLoading && rightIcon && (
        <span className="btn__icon btn__icon--right">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// ═══════════════════════════════════════════════════════════════════════════
// ICON BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        icon-btn 
        icon-btn--${variant} 
        icon-btn--${size} 
        ${isLoading ? 'icon-btn--loading' : ''} 
        ${className}
      `.trim()}
      aria-label={ariaLabel}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size,
  variant,
  isAttached = false,
  spacing = 8,
}) => {
  // Clone children with size and variant if provided
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<ButtonProps>, {
        size: size || (child.props as ButtonProps).size,
        variant: variant || (child.props as ButtonProps).variant,
      });
    }
    return child;
  });

  return (
    <div 
      className={`
        btn-group 
        btn-group--${orientation} 
        ${isAttached ? 'btn-group--attached' : ''}
      `.trim()}
      style={{ gap: isAttached ? 0 : spacing }}
      role="group"
    >
      {enhancedChildren}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LINK BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isExternal?: boolean;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isExternal = false,
  children,
  className = '',
  ...props
}, ref) => {
  const externalProps = isExternal ? {
    target: '_blank',
    rel: 'noopener noreferrer',
  } : {};

  return (
    <a
      ref={ref}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...externalProps}
      {...props}
    >
      {leftIcon && (
        <span className="btn__icon btn__icon--left">{leftIcon}</span>
      )}
      <span className="btn__text">{children}</span>
      {rightIcon && (
        <span className="btn__icon btn__icon--right">{rightIcon}</span>
      )}
      {isExternal && (
        <span className="btn__icon btn__icon--right">↗</span>
      )}
    </a>
  );
});

LinkButton.displayName = 'LinkButton';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const ButtonStyles: React.FC = () => (
  <style>{`
    /* Base button styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      border: none;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
      position: relative;
      overflow: hidden;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-primary, #6366f1);
      outline-offset: 2px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn--full-width {
      width: 100%;
    }

    .btn--loading {
      cursor: wait;
    }

    .btn--loading .btn__text {
      opacity: 0.7;
    }

    /* Button sizes */
    .btn--xs {
      height: 28px;
      padding: 0 10px;
      font-size: 12px;
      border-radius: 6px;
    }

    .btn--sm {
      height: 32px;
      padding: 0 12px;
      font-size: 13px;
    }

    .btn--md {
      height: 40px;
      padding: 0 16px;
      font-size: 14px;
    }

    .btn--lg {
      height: 48px;
      padding: 0 24px;
      font-size: 16px;
    }

    .btn--xl {
      height: 56px;
      padding: 0 32px;
      font-size: 18px;
      border-radius: 12px;
    }

    /* Primary variant */
    .btn--primary {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .btn--primary:hover:not(:disabled) {
      background: var(--color-primary-hover, #4f46e5);
    }

    .btn--primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    /* Secondary variant */
    .btn--secondary {
      background: var(--color-bg-tertiary, #f3f4f6);
      color: var(--color-text-primary, #111827);
    }

    .btn--secondary:hover:not(:disabled) {
      background: var(--color-bg-tertiary-hover, #e5e7eb);
    }

    /* Outline variant */
    .btn--outline {
      background: transparent;
      border: 1px solid var(--color-border, #e5e7eb);
      color: var(--color-text-primary, #111827);
    }

    .btn--outline:hover:not(:disabled) {
      background: var(--color-bg-tertiary, #f3f4f6);
      border-color: var(--color-border-hover, #d1d5db);
    }

    /* Ghost variant */
    .btn--ghost {
      background: transparent;
      color: var(--color-text-primary, #111827);
    }

    .btn--ghost:hover:not(:disabled) {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    /* Danger variant */
    .btn--danger {
      background: var(--color-error, #ef4444);
      color: white;
    }

    .btn--danger:hover:not(:disabled) {
      background: #dc2626;
    }

    /* Success variant */
    .btn--success {
      background: var(--color-success, #22c55e);
      color: white;
    }

    .btn--success:hover:not(:disabled) {
      background: #16a34a;
    }

    /* Warning variant */
    .btn--warning {
      background: var(--color-warning, #f59e0b);
      color: white;
    }

    .btn--warning:hover:not(:disabled) {
      background: #d97706;
    }

    /* Button content */
    .btn__spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .btn__text {
      display: flex;
      align-items: center;
    }

    /* Icon button */
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      cursor: pointer;
      border: none;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
      padding: 0;
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--color-primary, #6366f1);
      outline-offset: 2px;
    }

    .icon-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Icon button sizes */
    .icon-btn--xs { width: 24px; height: 24px; font-size: 12px; }
    .icon-btn--sm { width: 32px; height: 32px; font-size: 14px; }
    .icon-btn--md { width: 40px; height: 40px; font-size: 16px; }
    .icon-btn--lg { width: 48px; height: 48px; font-size: 20px; }
    .icon-btn--xl { width: 56px; height: 56px; font-size: 24px; }

    /* Icon button variants */
    .icon-btn--primary {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .icon-btn--primary:hover:not(:disabled) {
      background: var(--color-primary-hover, #4f46e5);
    }

    .icon-btn--secondary {
      background: var(--color-bg-tertiary, #f3f4f6);
      color: var(--color-text-primary, #111827);
    }

    .icon-btn--secondary:hover:not(:disabled) {
      background: var(--color-bg-tertiary-hover, #e5e7eb);
    }

    .icon-btn--outline {
      background: transparent;
      border: 1px solid var(--color-border, #e5e7eb);
      color: var(--color-text-primary, #111827);
    }

    .icon-btn--outline:hover:not(:disabled) {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .icon-btn--ghost {
      background: transparent;
      color: var(--color-text-secondary, #6b7280);
    }

    .icon-btn--ghost:hover:not(:disabled) {
      background: var(--color-bg-tertiary, #f3f4f6);
      color: var(--color-text-primary, #111827);
    }

    .icon-btn--danger {
      background: transparent;
      color: var(--color-error, #ef4444);
    }

    .icon-btn--danger:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.1);
    }

    /* Button group */
    .btn-group {
      display: flex;
    }

    .btn-group--horizontal {
      flex-direction: row;
    }

    .btn-group--vertical {
      flex-direction: column;
    }

    .btn-group--attached .btn {
      border-radius: 0;
    }

    .btn-group--attached.btn-group--horizontal .btn:first-child {
      border-radius: var(--radius-md, 8px) 0 0 var(--radius-md, 8px);
    }

    .btn-group--attached.btn-group--horizontal .btn:last-child {
      border-radius: 0 var(--radius-md, 8px) var(--radius-md, 8px) 0;
    }

    .btn-group--attached.btn-group--vertical .btn:first-child {
      border-radius: var(--radius-md, 8px) var(--radius-md, 8px) 0 0;
    }

    .btn-group--attached.btn-group--vertical .btn:last-child {
      border-radius: 0 0 var(--radius-md, 8px) var(--radius-md, 8px);
    }

    .btn-group--attached .btn:not(:first-child) {
      margin-left: -1px;
    }

    .btn-group--attached.btn-group--vertical .btn:not(:first-child) {
      margin-left: 0;
      margin-top: -1px;
    }

    /* Dark mode */
    [data-theme="dark"] .btn--secondary {
      background: #2a2a2a;
      color: #f9fafb;
    }

    [data-theme="dark"] .btn--secondary:hover:not(:disabled) {
      background: #333;
    }

    [data-theme="dark"] .btn--outline {
      border-color: #333;
      color: #f9fafb;
    }

    [data-theme="dark"] .btn--outline:hover:not(:disabled) {
      background: #2a2a2a;
      border-color: #444;
    }

    [data-theme="dark"] .btn--ghost {
      color: #f9fafb;
    }

    [data-theme="dark"] .btn--ghost:hover:not(:disabled) {
      background: #2a2a2a;
    }

    [data-theme="dark"] .icon-btn--secondary {
      background: #2a2a2a;
      color: #f9fafb;
    }

    [data-theme="dark"] .icon-btn--secondary:hover:not(:disabled) {
      background: #333;
    }

    [data-theme="dark"] .icon-btn--ghost {
      color: #9ca3af;
    }

    [data-theme="dark"] .icon-btn--ghost:hover:not(:disabled) {
      background: #2a2a2a;
      color: #f9fafb;
    }
  `}</style>
);

export default {
  Button,
  IconButton,
  ButtonGroup,
  LinkButton,
  ButtonStyles,
};
