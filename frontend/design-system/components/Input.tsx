// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — INPUT COMPONENT
// Production-grade input with all variants and states
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Input variants
 */
export type InputVariant = 'default' | 'filled' | 'flushed';

/**
 * Input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input states
 */
export type InputState = 'default' | 'error' | 'success' | 'warning';

/**
 * Base input props (shared between Input and Textarea)
 */
interface BaseInputProps {
  /** Visual variant */
  variant?: InputVariant;
  
  /** Size */
  size?: InputSize;
  
  /** Validation state */
  state?: InputState;
  
  /** Label text */
  label?: string;
  
  /** Helper text below input */
  helperText?: string;
  
  /** Error message (overrides helperText when state is error) */
  errorMessage?: string;
  
  /** Icon to display at the start */
  leftIcon?: ReactNode;
  
  /** Icon/element to display at the end */
  rightElement?: ReactNode;
  
  /** Full width */
  fullWidth?: boolean;
  
  /** Required field */
  required?: boolean;
  
  /** Hide label visually (still accessible) */
  hideLabel?: boolean;
  
  /** Additional wrapper class */
  wrapperClassName?: string;
}

/**
 * Input props
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    BaseInputProps {}

/**
 * Textarea props
 */
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    BaseInputProps {
  /** Auto-resize to fit content */
  autoResize?: boolean;
  
  /** Minimum number of rows */
  minRows?: number;
  
  /** Maximum number of rows */
  maxRows?: number;
}

// =============================================================================
// STYLES
// =============================================================================

const baseInputStyles = `
  w-full
  font-normal
  transition-all duration-200 ease-out
  placeholder:text-[var(--color-text-tertiary)]
  disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-subtle)]
`;

const variantStyles: Record<InputVariant, { wrapper: string; input: string; focus: string }> = {
  default: {
    wrapper: `
      border border-[var(--color-border-default)]
      rounded-md
      bg-[var(--color-bg-secondary)]
      hover:border-[var(--color-border-strong)]
    `,
    input: 'bg-transparent',
    focus: `
      focus-within:border-[var(--color-brand-primary)]
      focus-within:ring-2 focus-within:ring-[var(--color-brand-primary)] focus-within:ring-opacity-20
    `,
  },
  filled: {
    wrapper: `
      border border-transparent
      rounded-md
      bg-[var(--color-bg-subtle)]
      hover:bg-[var(--color-bg-hover)]
    `,
    input: 'bg-transparent',
    focus: `
      focus-within:bg-[var(--color-bg-secondary)]
      focus-within:border-[var(--color-brand-primary)]
      focus-within:ring-2 focus-within:ring-[var(--color-brand-primary)] focus-within:ring-opacity-20
    `,
  },
  flushed: {
    wrapper: `
      border-b-2 border-[var(--color-border-default)]
      rounded-none
      bg-transparent
      hover:border-[var(--color-border-strong)]
    `,
    input: 'bg-transparent px-0',
    focus: `
      focus-within:border-[var(--color-brand-primary)]
    `,
  },
};

const stateStyles: Record<InputState, { wrapper: string; text: string }> = {
  default: {
    wrapper: '',
    text: 'text-[var(--color-text-tertiary)]',
  },
  error: {
    wrapper: `
      border-[var(--color-status-error)] 
      focus-within:border-[var(--color-status-error)]
      focus-within:ring-[var(--color-status-error)]
    `,
    text: 'text-[var(--color-status-error)]',
  },
  success: {
    wrapper: `
      border-[var(--color-status-success)]
      focus-within:border-[var(--color-status-success)]
      focus-within:ring-[var(--color-status-success)]
    `,
    text: 'text-[var(--color-status-success)]',
  },
  warning: {
    wrapper: `
      border-[var(--color-status-warning)]
      focus-within:border-[var(--color-status-warning)]
      focus-within:ring-[var(--color-status-warning)]
    `,
    text: 'text-[var(--color-status-warning)]',
  },
};

const sizeStyles: Record<InputSize, { wrapper: string; input: string; label: string; icon: string }> = {
  sm: {
    wrapper: 'min-h-[var(--size-input-sm)]',
    input: 'px-2.5 py-1.5 text-sm',
    label: 'text-xs mb-1',
    icon: 'w-4 h-4',
  },
  md: {
    wrapper: 'min-h-[var(--size-input-md)]',
    input: 'px-3 py-2 text-sm',
    label: 'text-sm mb-1.5',
    icon: 'w-5 h-5',
  },
  lg: {
    wrapper: 'min-h-[var(--size-input-lg)]',
    input: 'px-4 py-3 text-base',
    label: 'text-base mb-2',
    icon: 'w-5 h-5',
  },
};

// =============================================================================
// LABEL COMPONENT
// =============================================================================

interface LabelProps {
  htmlFor: string;
  required?: boolean;
  hidden?: boolean;
  size: InputSize;
  children: ReactNode;
}

function Label({ htmlFor, required, hidden, size, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block font-medium text-[var(--color-text-primary)]
        ${sizeStyles[size].label}
        ${hidden ? 'sr-only' : ''}
      `}
    >
      {children}
      {required && (
        <span className="text-[var(--color-status-error)] ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

// =============================================================================
// HELPER TEXT COMPONENT
// =============================================================================

interface HelperTextProps {
  id: string;
  state: InputState;
  children: ReactNode;
}

function HelperText({ id, state, children }: HelperTextProps) {
  return (
    <p
      id={id}
      className={`
        mt-1.5 text-xs
        ${stateStyles[state].text}
      `}
    >
      {children}
    </p>
  );
}

// =============================================================================
// INPUT COMPONENT
// =============================================================================

/**
 * Input Component
 * 
 * A versatile text input with support for labels, validation states,
 * icons, and multiple visual variants.
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * 
 * // With error
 * <Input
 *   label="Password"
 *   type="password"
 *   state="error"
 *   errorMessage="Password is required"
 * />
 * 
 * // With icons
 * <Input
 *   label="Search"
 *   leftIcon={<IconSearch />}
 *   rightElement={<IconButton icon={<IconX />} aria-label="Clear" />}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightElement,
      fullWidth = true,
      required = false,
      hideLabel = false,
      wrapperClassName = '',
      className = '',
      id: propId,
      disabled,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = propId || generatedId;
    const helperId = `${id}-helper`;
    const hasError = state === 'error';
    const displayHelperText = hasError && errorMessage ? errorMessage : helperText;

    const variantConfig = variantStyles[variant];
    const sizeConfig = sizeStyles[size];
    const stateConfig = stateStyles[state];

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} required={required} hidden={hideLabel} size={size}>
            {label}
          </Label>
        )}

        {/* Input wrapper */}
        <div
          className={`
            relative flex items-center
            ${variantConfig.wrapper}
            ${variantConfig.focus}
            ${stateConfig.wrapper}
            ${sizeConfig.wrapper}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Left icon */}
          {leftIcon && (
            <span
              className={`
                absolute left-3 flex items-center justify-center
                text-[var(--color-text-tertiary)]
                ${sizeConfig.icon}
              `}
            >
              {leftIcon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? helperId : undefined}
            className={`
              ${baseInputStyles}
              ${variantConfig.input}
              ${sizeConfig.input}
              ${leftIcon ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              focus:outline-none
              ${className}
            `}
            {...props}
          />

          {/* Right element */}
          {rightElement && (
            <span
              className={`
                absolute right-2 flex items-center justify-center
                text-[var(--color-text-tertiary)]
              `}
            >
              {rightElement}
            </span>
          )}
        </div>

        {/* Helper text */}
        {displayHelperText && (
          <HelperText id={helperId} state={state}>
            {displayHelperText}
          </HelperText>
        )}
      </div>
    );
  }
);

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================

/**
 * Textarea Component
 * 
 * A multi-line text input with optional auto-resize functionality.
 * 
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea label="Description" placeholder="Enter description..." />
 * 
 * // Auto-resize
 * <Textarea
 *   label="Bio"
 *   autoResize
 *   minRows={3}
 *   maxRows={10}
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightElement,
      fullWidth = true,
      required = false,
      hideLabel = false,
      wrapperClassName = '',
      className = '',
      id: propId,
      disabled,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      onInput,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = propId || generatedId;
    const helperId = `${id}-helper`;
    const hasError = state === 'error';
    const displayHelperText = hasError && errorMessage ? errorMessage : helperText;

    const variantConfig = variantStyles[variant];
    const sizeConfig = sizeStyles[size];
    const stateConfig = stateStyles[state];

    // Auto-resize handler
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.currentTarget;
        target.style.height = 'auto';
        const lineHeight = parseInt(getComputedStyle(target).lineHeight) || 20;
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;
        const newHeight = Math.min(Math.max(target.scrollHeight, minHeight), maxHeight);
        target.style.height = `${newHeight}px`;
      }
      onInput?.(e);
    };

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} required={required} hidden={hideLabel} size={size}>
            {label}
          </Label>
        )}

        {/* Textarea wrapper */}
        <div
          className={`
            relative
            ${variantConfig.wrapper}
            ${variantConfig.focus}
            ${stateConfig.wrapper}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Textarea element */}
          <textarea
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? helperId : undefined}
            rows={minRows}
            onInput={handleInput}
            className={`
              ${baseInputStyles}
              ${variantConfig.input}
              ${sizeConfig.input}
              min-h-[80px]
              resize-y
              ${autoResize ? 'resize-none overflow-hidden' : ''}
              focus:outline-none
              ${className}
            `}
            {...props}
          />
        </div>

        {/* Helper text */}
        {displayHelperText && (
          <HelperText id={helperId} state={state}>
            {displayHelperText}
          </HelperText>
        )}
      </div>
    );
  }
);

// =============================================================================
// SELECT COMPONENT
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<BaseInputProps, 'leftIcon' | 'rightElement'> {
  /** Options to display */
  options: SelectOption[];
  
  /** Placeholder option */
  placeholder?: string;
}

/**
 * Select Component
 * 
 * A styled select dropdown.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'us', label: 'United States' },
 *   ]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      fullWidth = true,
      required = false,
      hideLabel = false,
      wrapperClassName = '',
      className = '',
      id: propId,
      disabled,
      options,
      placeholder,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = propId || generatedId;
    const helperId = `${id}-helper`;
    const hasError = state === 'error';
    const displayHelperText = hasError && errorMessage ? errorMessage : helperText;

    const variantConfig = variantStyles[variant];
    const sizeConfig = sizeStyles[size];
    const stateConfig = stateStyles[state];

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} required={required} hidden={hideLabel} size={size}>
            {label}
          </Label>
        )}

        {/* Select wrapper */}
        <div
          className={`
            relative flex items-center
            ${variantConfig.wrapper}
            ${variantConfig.focus}
            ${stateConfig.wrapper}
            ${sizeConfig.wrapper}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Select element */}
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? helperId : undefined}
            className={`
              ${baseInputStyles}
              ${variantConfig.input}
              ${sizeConfig.input}
              pr-10
              appearance-none
              cursor-pointer
              focus:outline-none
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <span className="absolute right-3 pointer-events-none text-[var(--color-text-tertiary)]">
            <svg
              className={sizeConfig.icon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Helper text */}
        {displayHelperText && (
          <HelperText id={helperId} state={state}>
            {displayHelperText}
          </HelperText>
        )}
      </div>
    );
  }
);

// =============================================================================
// CHECKBOX COMPONENT
// =============================================================================

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Label text */
  label?: string;
  
  /** Size */
  size?: InputSize;
  
  /** Indeterminate state */
  indeterminate?: boolean;
  
  /** Description below label */
  description?: string;
}

/**
 * Checkbox Component
 * 
 * @example
 * ```tsx
 * <Checkbox label="I agree to the terms" />
 * <Checkbox label="Select all" indeterminate />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      size = 'md',
      indeterminate = false,
      description,
      className = '',
      id: propId,
      disabled,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = propId || generatedId;
    const [internalRef, setInternalRef] = useState<HTMLInputElement | null>(null);

    // Handle indeterminate state
    React.useEffect(() => {
      if (internalRef) {
        internalRef.indeterminate = indeterminate;
      }
    }, [indeterminate, internalRef]);

    const checkboxSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={(node) => {
            setInternalRef(node);
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="checkbox"
          id={id}
          disabled={disabled}
          className={`
            ${checkboxSizes[size]}
            rounded
            border-2 border-[var(--color-border-default)]
            text-[var(--color-brand-primary)]
            bg-[var(--color-bg-secondary)]
            focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-opacity-20
            focus:ring-offset-0
            cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-150
          `}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={id}
                className={`
                  font-medium text-[var(--color-text-primary)]
                  cursor-pointer
                  ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-sm'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

// =============================================================================
// RADIO COMPONENT
// =============================================================================

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Label text */
  label?: string;
  
  /** Size */
  size?: InputSize;
  
  /** Description below label */
  description?: string;
}

/**
 * Radio Component
 * 
 * @example
 * ```tsx
 * <Radio name="plan" value="basic" label="Basic Plan" />
 * <Radio name="plan" value="pro" label="Pro Plan" />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      label,
      size = 'md',
      description,
      className = '',
      id: propId,
      disabled,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = propId || generatedId;

    const radioSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={ref}
          type="radio"
          id={id}
          disabled={disabled}
          className={`
            ${radioSizes[size]}
            border-2 border-[var(--color-border-default)]
            text-[var(--color-brand-primary)]
            bg-[var(--color-bg-secondary)]
            focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-opacity-20
            focus:ring-offset-0
            cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-150
          `}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={id}
                className={`
                  font-medium text-[var(--color-text-primary)]
                  cursor-pointer
                  ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-sm'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Input;
