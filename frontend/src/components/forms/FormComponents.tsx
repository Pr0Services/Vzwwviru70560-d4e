// CHE·NU™ Form Components
// Comprehensive form system with validation

import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import { z } from 'zod';

// ============================================================
// TYPES
// ============================================================

export interface FormField<T = any> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export type FieldProps = {
  name: string;
  value: unknown;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: string;
  touched: boolean;
};

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
// USE FORM HOOK
// ============================================================

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [dirty, setDirty] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate single field
  const validateField = useCallback(
    (name: keyof T, value: unknown): string | undefined => {
      if (!validationSchema) return undefined;

      try {
        // Create partial schema for single field validation
        const partialValues = { ...values, [name]: value };
        validationSchema.parse(partialValues);
        return undefined;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldError = err.errors.find((e) => e.path[0] === name);
          return fieldError?.message;
        }
        return 'Validation error';
      }
    },
    [validationSchema, values]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as keyof T;
          if (!newErrors[field]) {
            newErrors[field] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema, values]);

  // Handle field change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));
      setDirty((prev) => ({ ...prev, [name]: true }));

      if (validateOnChange) {
        const error = validateField(name as keyof T, newValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name as keyof T, values[name as keyof T]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  // Set field value programmatically
  const setFieldValue = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setDirty((prev) => ({ ...prev, [name]: true }));

      if (validateOnChange) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField]
  );

  // Set field error
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty({});
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, [initialValues]);

  // Handle submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ) as Partial<Record<keyof T, boolean>>;
      setTouched(allTouched);

      // Validate
      const isValid = validateAll();
      if (!isValid) return;

      // Submit
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setIsSubmitted(true);
      } catch (error) {
        logger.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  // Get field props
  const getFieldProps = useCallback(
    (name: keyof T): FieldProps => ({
      name: name as string,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      error: errors[name],
      touched: touched[name] || false,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    return Object.values(dirty).some((d) => d);
  }, [dirty]);

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isDirty,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    getFieldProps,
    validateField,
    validateAll,
  };
}

// ============================================================
// FORM CONTEXT
// ============================================================

interface FormContextValue {
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  getFieldProps: (name: string) => FieldProps;
  isSubmitting: boolean;
}

const FormContext = React.createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
}

// ============================================================
// FORM COMPONENT
// ============================================================

interface FormProps<T extends Record<string, any>> extends UseFormOptions<T> {
  children: React.ReactNode;
  className?: string;
}

export function Form<T extends Record<string, any>>({
  children,
  className = '',
  ...options
}: FormProps<T>) {
  const form = useForm(options);

  return (
    <FormContext.Provider
      value={{
        values: form.values,
        errors: form.errors,
        touched: form.touched,
        handleChange: form.handleChange,
        handleBlur: form.handleBlur,
        getFieldProps: form.getFieldProps,
        isSubmitting: form.isSubmitting,
      }}
    >
      <form onSubmit={form.handleSubmit} className={className} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// ============================================================
// INPUT COMPONENT
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              block w-full rounded-lg border transition-colors duration-200
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              py-2.5
              ${hasError
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }
              focus:outline-none focus:ring-2
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================
// TEXTAREA COMPONENT
// ============================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, autoResize = false, className = '', ...props }, ref) => {
    const hasError = !!error;

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          onInput={handleInput}
          className={`
            block w-full rounded-lg border px-4 py-2.5 transition-colors duration-200
            ${hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            resize-none
            ${className}
          `}
        />
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================================
// SELECT COMPONENT
// ============================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          {...props}
          className={`
            block w-full rounded-lg border px-4 py-2.5 transition-colors duration-200
            ${hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================================
// CHECKBOX COMPONENT
// ============================================================

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            {...props}
            className={`
              w-5 h-5 rounded border-gray-300 text-amber-600
              focus:ring-amber-500 focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError ? 'border-red-500' : ''}
              ${className}
            `}
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================================
// RADIO GROUP COMPONENT
// ============================================================

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  direction = 'vertical',
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div className={`flex ${direction === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 cursor-pointer ${
              option.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
              className={`
                w-5 h-5 border-gray-300 text-amber-600
                focus:ring-amber-500 focus:ring-2
                ${hasError ? 'border-red-500' : ''}
              `}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// SWITCH COMPONENT
// ============================================================

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          ${sizes.track}
          relative inline-flex shrink-0 rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
          ${checked ? 'bg-amber-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            ${sizes.thumb}
            pointer-events-none inline-block rounded-full bg-white
            shadow-lg transform transition duration-200 ease-in-out
            ${checked ? sizes.translate : 'translate-x-0.5'}
            mt-0.5 ml-0.5
          `}
        />
      </button>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-gray-900">{label}</div>}
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      )}
    </div>
  );
};

// ============================================================
// SLIDER COMPONENT
// ============================================================

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  disabled = false,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          {showValue && (
            <span className="text-sm text-gray-500">{formatValue(value)}</span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`
            w-full h-2 rounded-lg appearance-none cursor-pointer
            bg-gray-200
            disabled:opacity-50 disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-600
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
          `}
          style={{
            background: `linear-gradient(to right, ${COLORS.sacredGold} 0%, ${COLORS.sacredGold} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

// ============================================================
// DATE PICKER COMPONENT
// ============================================================

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        className={`
          block w-full rounded-lg border px-4 py-2.5 transition-colors duration-200
          ${hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
          }
          focus:outline-none focus:ring-2
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// TIME PICKER COMPONENT
// ============================================================

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          block w-full rounded-lg border px-4 py-2.5 transition-colors duration-200
          ${hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
          }
          focus:outline-none focus:ring-2
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// TAG INPUT COMPONENT
// ============================================================

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Add tag...',
  maxTags,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const hasError = !!error;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && (!maxTags || value.length < maxTags)) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div
        className={`
          flex flex-wrap gap-2 p-2 rounded-lg border min-h-[46px]
          ${hasError
            ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
            : 'border-gray-300 focus-within:ring-amber-500 focus-within:border-amber-500'
          }
          focus-within:ring-2 focus-within:outline-none
          ${disabled ? 'bg-gray-100' : 'bg-white'}
        `}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-amber-900"
              >
                ×
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
          className="flex-1 min-w-[100px] outline-none bg-transparent disabled:cursor-not-allowed"
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// FILE INPUT COMPONENT
// ============================================================

interface FileInputProps {
  onChange: (files: FileList | null) => void;
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  label,
  error,
  helperText,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasError = !!error;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check file sizes
    if (maxSize) {
      const oversized = fileArray.filter((f) => f.size > maxSize);
      if (oversized.length > 0) {
        logger.error('Files too large:', oversized);
        return;
      }
    }

    setSelectedFiles(fileArray);
    onChange(files);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-gray-400'}
          ${hasError ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />
        <div className="text-4xl mb-2">📁</div>
        <p className="text-gray-600">
          Drag and drop files here, or <span className="text-amber-600">browse</span>
        </p>
        {accept && (
          <p className="text-sm text-gray-400 mt-1">Accepted: {accept}</p>
        )}
        {maxSize && (
          <p className="text-sm text-gray-400">Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
        )}
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span>📄</span>
              <span>{file.name}</span>
              <span className="text-gray-400">({(file.size / 1024).toFixed(1)}KB)</span>
            </div>
          ))}
        </div>
      )}
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// FORM FIELD WRAPPER
// ============================================================

interface FormFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  children: (props: FieldProps) => React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  helperText,
  children,
}) => {
  const { getFieldProps } = useFormContext();
  const fieldProps = getFieldProps(name);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      {children(fieldProps)}
      {(fieldProps.error || helperText) && (
        <p className={`mt-1 text-sm ${fieldProps.error ? 'text-red-500' : 'text-gray-500'}`}>
          {fieldProps.error || helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  DatePicker,
  TimePicker,
  TagInput,
  FileInput,
  useForm,
  useFormContext,
};
