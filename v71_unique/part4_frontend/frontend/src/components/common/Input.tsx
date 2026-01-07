/**
 * CHE·NU™ Input & Form Components
 * 
 * Comprehensive form system with validation, error states, and accessibility.
 * Includes text inputs, textareas, selects, checkboxes, radios, and switches.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useId, forwardRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'flushed';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  isRequired?: boolean;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  isIndeterminate?: boolean;
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: InputSize;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical';
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: InputSize;
}

// ═══════════════════════════════════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  size = 'md',
  variant = 'outline',
  leftElement,
  rightElement,
  isRequired,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {isRequired && <span className="form-label__required">*</span>}
        </label>
      )}
      
      <div className={`input-wrapper input-wrapper--${size} input-wrapper--${variant}`}>
        {leftElement && (
          <span className="input-element input-element--left">{leftElement}</span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`input input--${size} input--${variant} ${leftElement ? 'input--has-left' : ''} ${rightElement ? 'input--has-right' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        
        {rightElement && (
          <span className="input-element input-element--right">{rightElement}</span>
        )}
      </div>
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ═══════════════════════════════════════════════════════════════════════════
// TEXTAREA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  helperText,
  error,
  size = 'md',
  variant = 'outline',
  isRequired,
  resize = 'vertical',
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
          {isRequired && <span className="form-label__required">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={`textarea textarea--${size} textarea--${variant}`}
        style={{ resize }}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ═══════════════════════════════════════════════════════════════════════════
// SELECT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  size = 'md',
  variant = 'outline',
  isRequired,
  placeholder,
  options,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {isRequired && <span className="form-label__required">*</span>}
        </label>
      )}
      
      <div className={`select-wrapper select-wrapper--${size}`}>
        <select
          ref={ref}
          id={selectId}
          className={`select select--${size} select--${variant}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
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
        <span className="select-icon">▼</span>
      </div>
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// ═══════════════════════════════════════════════════════════════════════════
// CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  helperText,
  error,
  size = 'md',
  isIndeterminate,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const errorId = `${checkboxId}-error`;

  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = isIndeterminate || false;
    }
  }, [isIndeterminate, ref]);

  return (
    <div className={`form-field form-field--inline ${error ? 'form-field--error' : ''} ${className}`}>
      <label className={`checkbox checkbox--${size}`}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className="checkbox__input"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <span className="checkbox__box">
          <svg className="checkbox__check" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="checkbox__indeterminate" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        {label && <span className="checkbox__label">{label}</span>}
      </label>
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span className="form-helper">{helperText}</span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ═══════════════════════════════════════════════════════════════════════════
// RADIO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  size = 'md',
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label className={`radio radio--${size} ${className}`}>
      <input
        ref={ref}
        type="radio"
        id={radioId}
        className="radio__input"
        {...props}
      />
      <span className="radio__circle" />
      {label && <span className="radio__label">{label}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';

// ═══════════════════════════════════════════════════════════════════════════
// RADIO GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  orientation = 'vertical',
  size = 'md',
  label,
  helperText,
  error,
  isRequired,
}) => {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;

  return (
    <fieldset 
      className={`form-field ${error ? 'form-field--error' : ''}`}
      aria-describedby={error ? errorId : helperText ? helperId : undefined}
    >
      {label && (
        <legend className="form-label">
          {label}
          {isRequired && <span className="form-label__required">*</span>}
        </legend>
      )}
      
      <div className={`radio-group radio-group--${orientation}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            disabled={option.disabled}
            label={option.label}
            size={size}
          />
        ))}
      </div>
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      )}
    </fieldset>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SWITCH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  size = 'md',
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const switchId = id || generatedId;

  return (
    <label className={`switch switch--${size} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        id={switchId}
        className="switch__input"
        role="switch"
        {...props}
      />
      <span className="switch__track">
        <span className="switch__thumb" />
      </span>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';

// ═══════════════════════════════════════════════════════════════════════════
// FORM GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface FormGroupProps {
  children: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  label,
  helperText,
  error,
  isRequired,
}) => {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;

  return (
    <div className={`form-group ${error ? 'form-group--error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {isRequired && <span className="form-label__required">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FORM STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const FormStyles: React.FC = () => (
  <style>{`
    /* Form field container */
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-field--inline {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Labels */
    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary, #111827);
    }

    .form-label__required {
      color: var(--color-error, #ef4444);
      margin-left: 2px;
    }

    /* Helper & error text */
    .form-helper {
      font-size: 13px;
      color: var(--color-text-secondary, #6b7280);
    }

    .form-error {
      font-size: 13px;
      color: var(--color-error, #ef4444);
    }

    /* Input wrapper */
    .input-wrapper {
      display: flex;
      align-items: center;
      position: relative;
    }

    .input-element {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary, #6b7280);
      pointer-events: none;
      z-index: 1;
    }

    .input-element--left { left: 12px; }
    .input-element--right { right: 12px; }

    /* Base input styles */
    .input {
      width: 100%;
      font-family: inherit;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      transition: all var(--transition-fast, 0.15s);
    }

    .input::placeholder {
      color: var(--color-text-tertiary, #9ca3af);
    }

    .input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Input sizes */
    .input--sm { height: 32px; padding: 0 10px; font-size: 13px; }
    .input--md { height: 40px; padding: 0 12px; font-size: 14px; }
    .input--lg { height: 48px; padding: 0 16px; font-size: 16px; }

    .input--has-left.input--sm { padding-left: 36px; }
    .input--has-left.input--md { padding-left: 40px; }
    .input--has-left.input--lg { padding-left: 48px; }

    .input--has-right.input--sm { padding-right: 36px; }
    .input--has-right.input--md { padding-right: 40px; }
    .input--has-right.input--lg { padding-right: 48px; }

    /* Input variants */
    .input--outline {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: var(--color-bg-primary, #ffffff);
    }

    .input--outline:focus {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-field--error .input--outline {
      border-color: var(--color-error, #ef4444);
    }

    .form-field--error .input--outline:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input--filled {
      border-radius: var(--radius-md, 8px);
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .input--filled:focus {
      background: var(--color-bg-primary, #ffffff);
      box-shadow: 0 0 0 2px var(--color-primary, #6366f1);
    }

    .input--flushed {
      border-bottom: 2px solid var(--color-border, #e5e7eb);
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;
    }

    .input--flushed:focus {
      border-color: var(--color-primary, #6366f1);
    }

    /* Textarea */
    .textarea {
      width: 100%;
      font-family: inherit;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      transition: all var(--transition-fast, 0.15s);
      line-height: 1.5;
    }

    .textarea::placeholder {
      color: var(--color-text-tertiary, #9ca3af);
    }

    .textarea--sm { padding: 8px 10px; font-size: 13px; }
    .textarea--md { padding: 10px 12px; font-size: 14px; }
    .textarea--lg { padding: 12px 16px; font-size: 16px; }

    .textarea--outline {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: var(--color-bg-primary, #ffffff);
    }

    .textarea--outline:focus {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    /* Select */
    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .select {
      width: 100%;
      font-family: inherit;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      cursor: pointer;
      appearance: none;
      padding-right: 40px;
    }

    .select--sm { height: 32px; padding: 0 10px; font-size: 13px; }
    .select--md { height: 40px; padding: 0 12px; font-size: 14px; }
    .select--lg { height: 48px; padding: 0 16px; font-size: 16px; }

    .select--outline {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: var(--color-bg-primary, #ffffff);
    }

    .select--outline:focus {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .select-icon {
      position: absolute;
      right: 12px;
      font-size: 10px;
      color: var(--color-text-secondary, #6b7280);
      pointer-events: none;
    }

    /* Checkbox */
    .checkbox {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .checkbox__box {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--color-border, #d1d5db);
      border-radius: 4px;
      background: var(--color-bg-primary, #ffffff);
      transition: all var(--transition-fast, 0.15s);
      flex-shrink: 0;
    }

    .checkbox--sm .checkbox__box { width: 16px; height: 16px; }
    .checkbox--md .checkbox__box { width: 20px; height: 20px; }
    .checkbox--lg .checkbox__box { width: 24px; height: 24px; }

    .checkbox__check,
    .checkbox__indeterminate {
      color: white;
      opacity: 0;
      transition: opacity var(--transition-fast, 0.15s);
    }

    .checkbox--sm .checkbox__check,
    .checkbox--sm .checkbox__indeterminate { width: 10px; height: 10px; }
    .checkbox--md .checkbox__check,
    .checkbox--md .checkbox__indeterminate { width: 12px; height: 12px; }
    .checkbox--lg .checkbox__check,
    .checkbox--lg .checkbox__indeterminate { width: 14px; height: 14px; }

    .checkbox__input:checked + .checkbox__box {
      background: var(--color-primary, #6366f1);
      border-color: var(--color-primary, #6366f1);
    }

    .checkbox__input:checked + .checkbox__box .checkbox__check {
      opacity: 1;
    }

    .checkbox__input:indeterminate + .checkbox__box {
      background: var(--color-primary, #6366f1);
      border-color: var(--color-primary, #6366f1);
    }

    .checkbox__input:indeterminate + .checkbox__box .checkbox__indeterminate {
      opacity: 1;
    }

    .checkbox__input:focus-visible + .checkbox__box {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }

    .checkbox__label {
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      user-select: none;
    }

    /* Radio */
    .radio {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .radio__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .radio__circle {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--color-border, #d1d5db);
      border-radius: 50%;
      background: var(--color-bg-primary, #ffffff);
      transition: all var(--transition-fast, 0.15s);
      flex-shrink: 0;
    }

    .radio--sm .radio__circle { width: 16px; height: 16px; }
    .radio--md .radio__circle { width: 20px; height: 20px; }
    .radio--lg .radio__circle { width: 24px; height: 24px; }

    .radio__circle::after {
      content: '';
      width: 0;
      height: 0;
      border-radius: 50%;
      background: white;
      transition: all var(--transition-fast, 0.15s);
    }

    .radio__input:checked + .radio__circle {
      background: var(--color-primary, #6366f1);
      border-color: var(--color-primary, #6366f1);
    }

    .radio--sm .radio__input:checked + .radio__circle::after { width: 6px; height: 6px; }
    .radio--md .radio__input:checked + .radio__circle::after { width: 8px; height: 8px; }
    .radio--lg .radio__input:checked + .radio__circle::after { width: 10px; height: 10px; }

    .radio__input:focus-visible + .radio__circle {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }

    .radio__label {
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      user-select: none;
    }

    .radio-group {
      display: flex;
      gap: 16px;
    }

    .radio-group--vertical {
      flex-direction: column;
      gap: 12px;
    }

    /* Switch */
    .switch {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .switch__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .switch__track {
      position: relative;
      background: var(--color-bg-tertiary, #d1d5db);
      border-radius: 999px;
      transition: all var(--transition-fast, 0.15s);
    }

    .switch--sm .switch__track { width: 32px; height: 18px; }
    .switch--md .switch__track { width: 44px; height: 24px; }
    .switch--lg .switch__track { width: 56px; height: 30px; }

    .switch__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      background: white;
      border-radius: 50%;
      transition: all var(--transition-fast, 0.15s);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .switch--sm .switch__thumb { width: 14px; height: 14px; }
    .switch--md .switch__thumb { width: 20px; height: 20px; }
    .switch--lg .switch__thumb { width: 26px; height: 26px; }

    .switch__input:checked + .switch__track {
      background: var(--color-primary, #6366f1);
    }

    .switch--sm .switch__input:checked + .switch__track .switch__thumb { transform: translateX(14px); }
    .switch--md .switch__input:checked + .switch__track .switch__thumb { transform: translateX(20px); }
    .switch--lg .switch__input:checked + .switch__track .switch__thumb { transform: translateX(26px); }

    .switch__input:focus-visible + .switch__track {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }

    .switch__label {
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      user-select: none;
    }

    /* Dark mode */
    [data-theme="dark"] .form-label {
      color: #f9fafb;
    }

    [data-theme="dark"] .input {
      color: #f9fafb;
    }

    [data-theme="dark"] .input--outline {
      border-color: #333;
      background: #1a1a1a;
    }

    [data-theme="dark"] .input--filled {
      background: #2a2a2a;
    }

    [data-theme="dark"] .textarea {
      color: #f9fafb;
    }

    [data-theme="dark"] .textarea--outline {
      border-color: #333;
      background: #1a1a1a;
    }

    [data-theme="dark"] .select {
      color: #f9fafb;
    }

    [data-theme="dark"] .select--outline {
      border-color: #333;
      background: #1a1a1a;
    }

    [data-theme="dark"] .checkbox__box {
      border-color: #444;
      background: #1a1a1a;
    }

    [data-theme="dark"] .checkbox__label {
      color: #f9fafb;
    }

    [data-theme="dark"] .radio__circle {
      border-color: #444;
      background: #1a1a1a;
    }

    [data-theme="dark"] .radio__label {
      color: #f9fafb;
    }

    [data-theme="dark"] .switch__track {
      background: #444;
    }

    [data-theme="dark"] .switch__label {
      color: #f9fafb;
    }
  `}</style>
);

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  FormGroup,
  FormStyles,
};
