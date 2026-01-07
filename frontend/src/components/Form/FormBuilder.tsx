// CHE·NU™ Form Builder System
// Comprehensive form generation and management

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  FormEvent,
  ChangeEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'range'
  | 'color'
  | 'hidden'
  | 'custom';

type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'url'; message?: string }
  | { type: 'match'; field: string; message?: string }
  | { type: 'custom'; validate: (value: unknown, values: Record<string, any>) => string | null };

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  className?: string;
  
  // Type-specific options
  options?: SelectOption[];
  multiple?: boolean;
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  accept?: string;
  autoComplete?: string;
  
  // Conditional display
  showIf?: (values: Record<string, any>) => boolean;
  
  // Dependencies
  dependsOn?: string[];
  
  // Custom render
  render?: (props: FieldRenderProps) => ReactNode;
  
  // Events
  onChange?: (value: unknown, values: Record<string, any>) => void;
  onBlur?: (value: unknown) => void;
}

interface FieldRenderProps {
  field: FieldConfig;
  value: unknown;
  error: string | null;
  touched: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  disabled: boolean;
}

interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

interface FormConfig {
  id: string;
  sections: FormSection[];
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  showCancel?: boolean;
  layout?: 'vertical' | 'horizontal' | 'inline';
  labelWidth?: string;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  preserveValues?: boolean;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface FormProps {
  config: FormConfig;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  onChange?: (values: Record<string, any>) => void;
  disabled?: boolean;
  className?: string;
}

interface UseFormOptions {
  initialValues?: Record<string, any>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Record<string, any>) => void;
  setError: (name: string, error: string | null) => void;
  setTouched: (name: string, touched?: boolean) => void;
  reset: () => void;
  validate: () => boolean;
  validateField: (name: string) => string | null;
  handleSubmit: (e?: FormEvent) => Promise<void>;
  handleChange: (name: string) => (e: ChangeEvent<any>) => void;
  handleBlur: (name: string) => () => void;
  getFieldProps: (name: string) => {
    value: unknown;
    onChange: (e: ChangeEvent<any>) => void;
    onBlur: () => void;
  };
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
// VALIDATION
// ============================================================

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateField(
  field: FieldConfig,
  value: unknown,
  values: Record<string, any>
): string | null {
  if (!field.validation) return null;

  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          return rule.message || `${field.label || field.name} is required`;
        }
        break;

      case 'minLength':
        if (value && String(value).length < rule.value) {
          return rule.message || `${field.label || field.name} must be at least ${rule.value} characters`;
        }
        break;

      case 'maxLength':
        if (value && String(value).length > rule.value) {
          return rule.message || `${field.label || field.name} must be at most ${rule.value} characters`;
        }
        break;

      case 'min':
        if (value !== undefined && value !== '' && Number(value) < rule.value) {
          return rule.message || `${field.label || field.name} must be at least ${rule.value}`;
        }
        break;

      case 'max':
        if (value !== undefined && value !== '' && Number(value) > rule.value) {
          return rule.message || `${field.label || field.name} must be at most ${rule.value}`;
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(String(value))) {
          return rule.message || `${field.label || field.name} has invalid format`;
        }
        break;

      case 'email':
        if (value && !validateEmail(String(value))) {
          return rule.message || 'Please enter a valid email address';
        }
        break;

      case 'url':
        if (value && !validateUrl(String(value))) {
          return rule.message || 'Please enter a valid URL';
        }
        break;

      case 'match':
        if (value !== values[rule.field]) {
          return rule.message || `${field.label || field.name} must match ${rule.field}`;
        }
        break;

      case 'custom':
        const customError = rule.validate(value, values);
        if (customError) return customError;
        break;
    }
  }

  return null;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    overflow: 'hidden',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: BRAND.softSand,
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    cursor: 'pointer',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  sectionDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },

  sectionContent: {
    padding: '20px',
  },

  fieldsGrid: {
    display: 'grid',
    gap: '20px',
  },

  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },

  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  required: {
    color: '#E53E3E',
    marginLeft: '4px',
  },

  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}40`,
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },

  inputFocus: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}20`,
  },

  inputError: {
    borderColor: '#E53E3E',
    boxShadow: `0 0 0 3px rgba(229, 62, 62, 0.1)`,
  },

  inputDisabled: {
    backgroundColor: BRAND.softSand,
    cursor: 'not-allowed',
    opacity: 0.7,
  },

  textarea: {
    resize: 'vertical' as const,
    minHeight: '100px',
  },

  select: {
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  },

  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },

  checkboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: BRAND.sacredGold,
  },

  switch: {
    position: 'relative' as const,
    width: '44px',
    height: '24px',
    backgroundColor: BRAND.ancientStone,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  switchChecked: {
    backgroundColor: BRAND.jungleEmerald,
  },

  switchThumb: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.2s',
  },

  switchThumbChecked: {
    transform: 'translateX(20px)',
  },

  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },

  radioInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: BRAND.sacredGold,
  },

  description: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },

  error: {
    fontSize: '12px',
    color: '#E53E3E',
    marginTop: '4px',
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
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

  tertiaryButton: {
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
    border: 'none',
    textDecoration: 'underline',
  },

  fileInput: {
    display: 'none',
  },

  fileLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '6px',
    border: `1px dashed ${BRAND.ancientStone}40`,
    backgroundColor: BRAND.softSand,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  range: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    appearance: 'none' as const,
    backgroundColor: BRAND.softSand,
    outline: 'none',
  },

  colorInput: {
    width: '48px',
    height: '36px',
    padding: '2px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}40`,
    cursor: 'pointer',
  },

  collapseIcon: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    transition: 'transform 0.2s',
  },
};

// ============================================================
// HOOKS
// ============================================================

export function useForm(
  fields: FieldConfig[],
  options: UseFormOptions = {}
): UseFormReturn {
  const {
    initialValues = {},
    validateOnBlur = true,
    validateOnChange = false,
    onSubmit,
  } = options;

  // Compute initial values from fields
  const computedInitialValues = useMemo(() => {
    const values: Record<string, any> = { ...initialValues };
    fields.forEach((field) => {
      if (values[field.name] === undefined && field.defaultValue !== undefined) {
        values[field.name] = field.defaultValue;
      }
    });
    return values;
  }, [fields, initialValues]);

  const [values, setValuesState] = useState<Record<string, any>>(computedInitialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldMap = useMemo(
    () => new Map(fields.map((f) => [f.name, f])),
    [fields]
  );

  const isDirty = useMemo(() => {
    return Object.keys(values).some(
      (key) => values[key] !== computedInitialValues[key]
    );
  }, [values, computedInitialValues]);

  const isValid = useMemo(() => {
    return !Object.values(errors).some((error) => error !== null);
  }, [errors]);

  const setValue = useCallback((name: string, value: unknown) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      const field = fieldMap.get(name);
      if (field) {
        const error = validateField(field, value, { ...values, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  }, [fieldMap, validateOnChange, values]);

  const setValues = useCallback((newValues: Record<string, any>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setTouched = useCallback((name: string, isTouched = true) => {
    setTouchedState((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const reset = useCallback(() => {
    setValuesState(computedInitialValues);
    setErrors({});
    setTouchedState({});
  }, [computedInitialValues]);

  const validateFieldByName = useCallback((name: string): string | null => {
    const field = fieldMap.get(name);
    if (!field) return null;
    
    const error = validateField(field, values[name], values);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  }, [fieldMap, values]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {};
    let hasErrors = false;

    fields.forEach((field) => {
      if (field.hidden || (field.showIf && !field.showIf(values))) {
        return;
      }

      const error = validateField(field, values[field.name], values);
      newErrors[field.name] = error;
      if (error) hasErrors = true;
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [fields, values]);

  const handleSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();

    // Touch all fields
    const touchedAll: Record<string, boolean> = {};
    fields.forEach((field) => {
      touchedAll[field.name] = true;
    });
    setTouchedState(touchedAll);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, validate, values, onSubmit]);

  const handleChange = useCallback((name: string) => (e: ChangeEvent<any>) => {
    const target = e.target;
    let value: unknown;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.type === 'file') {
      value = target.files;
    } else if (target.multiple) {
      value = Array.from(target.selectedOptions || []).map((opt: unknown) => opt.value);
    } else {
      value = target.value;
    }

    setValue(name, value);

    const field = fieldMap.get(name);
    field?.onChange?.(value, { ...values, [name]: value });
  }, [setValue, fieldMap, values]);

  const handleBlur = useCallback((name: string) => () => {
    setTouched(name, true);
    
    if (validateOnBlur) {
      validateFieldByName(name);
    }

    const field = fieldMap.get(name);
    field?.onBlur?.(values[name]);
  }, [setTouched, validateOnBlur, validateFieldByName, fieldMap, values]);

  const getFieldProps = useCallback((name: string) => ({
    value: values[name] ?? '',
    onChange: handleChange(name),
    onBlur: handleBlur(name),
  }), [values, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    setTouched,
    reset,
    validate,
    validateField: validateFieldByName,
    handleSubmit,
    handleChange,
    handleBlur,
    getFieldProps,
  };
}

// ============================================================
// FIELD COMPONENTS
// ============================================================

interface BaseFieldProps {
  field: FieldConfig;
  value: unknown;
  error: string | null;
  touched: boolean;
  disabled: boolean;
  onChange: (e: ChangeEvent<any>) => void;
  onBlur: () => void;
}

function TextField({ field, value, error, touched, disabled, onChange, onBlur }: BaseFieldProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;

  return (
    <input
      type={field.type === 'textarea' ? undefined : field.type}
      name={field.name}
      value={value}
      placeholder={field.placeholder}
      disabled={disabled || field.disabled}
      readOnly={field.readOnly}
      autoComplete={field.autoComplete}
      min={field.min as string}
      max={field.max as string}
      step={field.step as string}
      style={{
        ...styles.input,
        ...(isFocused && !hasError && styles.inputFocus),
        ...(hasError && styles.inputError),
        ...((disabled || field.disabled) && styles.inputDisabled),
      }}
      onChange={onChange}
      onBlur={() => {
        setIsFocused(false);
        onBlur();
      }}
      onFocus={() => setIsFocused(true)}
    />
  );
}

function TextareaField({ field, value, error, touched, disabled, onChange, onBlur }: BaseFieldProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;

  return (
    <textarea
      name={field.name}
      value={value}
      placeholder={field.placeholder}
      disabled={disabled || field.disabled}
      readOnly={field.readOnly}
      rows={field.rows || 4}
      style={{
        ...styles.input,
        ...styles.textarea,
        ...(isFocused && !hasError && styles.inputFocus),
        ...(hasError && styles.inputError),
        ...((disabled || field.disabled) && styles.inputDisabled),
      }}
      onChange={onChange}
      onBlur={() => {
        setIsFocused(false);
        onBlur();
      }}
      onFocus={() => setIsFocused(true)}
    />
  );
}

function SelectField({ field, value, error, touched, disabled, onChange, onBlur }: BaseFieldProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;

  const groupedOptions = useMemo(() => {
    if (!field.options) return { ungrouped: [] };
    
    return field.options.reduce((acc, option) => {
      const group = option.group || 'ungrouped';
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {} as Record<string, SelectOption[]>);
  }, [field.options]);

  return (
    <select
      name={field.name}
      value={value}
      multiple={field.multiple}
      disabled={disabled || field.disabled}
      style={{
        ...styles.input,
        ...styles.select,
        ...(isFocused && !hasError && styles.inputFocus),
        ...(hasError && styles.inputError),
        ...((disabled || field.disabled) && styles.inputDisabled),
      }}
      onChange={onChange}
      onBlur={() => {
        setIsFocused(false);
        onBlur();
      }}
      onFocus={() => setIsFocused(true)}
    >
      {!field.multiple && <option value="">{field.placeholder || 'Select...'}</option>}
      {Object.entries(groupedOptions).map(([group, options]) =>
        group === 'ungrouped' ? (
          options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))
        ) : (
          <optgroup key={group} label={group}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        )
      )}
    </select>
  );
}

function CheckboxField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  return (
    <label style={styles.checkbox}>
      <input
        type="checkbox"
        name={field.name}
        checked={Boolean(value)}
        disabled={disabled || field.disabled}
        style={styles.checkboxInput}
        onChange={onChange}
      />
      <span style={{ fontSize: '14px', color: BRAND.uiSlate }}>{field.label}</span>
    </label>
  );
}

function SwitchField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  const isChecked = Boolean(value);

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: disabled || field.disabled ? 'not-allowed' : 'pointer' }}>
      <div
        style={{
          ...styles.switch,
          ...(isChecked && styles.switchChecked),
          ...((disabled || field.disabled) && { opacity: 0.5 }),
        }}
        onClick={() => {
          if (!disabled && !field.disabled) {
            onChange({ target: { checked: !isChecked } } as any);
          }
        }}
      >
        <div
          style={{
            ...styles.switchThumb,
            ...(isChecked && styles.switchThumbChecked),
          }}
        />
      </div>
      {field.label && <span style={{ fontSize: '14px', color: BRAND.uiSlate }}>{field.label}</span>}
    </label>
  );
}

function RadioField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  return (
    <div style={styles.radioGroup}>
      {field.options?.map((option) => (
        <label key={option.value} style={styles.radioOption}>
          <input
            type="radio"
            name={field.name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled || field.disabled || option.disabled}
            style={styles.radioInput}
            onChange={onChange}
          />
          <span style={{ fontSize: '14px', color: BRAND.uiSlate }}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function FileField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = value as FileList | null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={field.name}
        accept={field.accept}
        multiple={field.multiple}
        disabled={disabled || field.disabled}
        style={styles.fileInput}
        onChange={onChange}
      />
      <div
        style={{
          ...styles.fileLabel,
          ...((disabled || field.disabled) && styles.inputDisabled),
        }}
        onClick={() => inputRef.current?.click()}
      >
        📎 {files && files.length > 0
          ? `${files.length} file(s) selected`
          : field.placeholder || 'Choose files...'}
      </div>
    </div>
  );
}

function RangeField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <input
        type="range"
        name={field.name}
        value={value}
        min={field.min as number}
        max={field.max as number}
        step={field.step as number}
        disabled={disabled || field.disabled}
        style={styles.range}
        onChange={onChange}
      />
      <span style={{ fontSize: '14px', color: BRAND.uiSlate, minWidth: '40px' }}>{value}</span>
    </div>
  );
}

function ColorField({ field, value, disabled, onChange }: BaseFieldProps): JSX.Element {
  return (
    <input
      type="color"
      name={field.name}
      value={value || '#000000'}
      disabled={disabled || field.disabled}
      style={styles.colorInput}
      onChange={onChange}
    />
  );
}

// ============================================================
// FORM FIELD WRAPPER
// ============================================================

interface FormFieldProps {
  field: FieldConfig;
  value: unknown;
  error: string | null;
  touched: boolean;
  disabled: boolean;
  onChange: (e: ChangeEvent<any>) => void;
  onBlur: () => void;
}

function FormField({ field, value, error, touched, disabled, onChange, onBlur }: FormFieldProps): JSX.Element | null {
  if (field.hidden) return null;

  const isRequired = field.validation?.some((v) => v.type === 'required');
  const showError = touched && error;

  const renderField = () => {
    const baseProps: BaseFieldProps = { field, value, error, touched, disabled, onChange, onBlur };

    if (field.render) {
      return field.render({
        field,
        value,
        error,
        touched,
        onChange: (val) => onChange({ target: { value: val } } as any),
        onBlur,
        disabled: disabled || !!field.disabled,
      });
    }

    switch (field.type) {
      case 'textarea':
        return <TextareaField {...baseProps} />;
      case 'select':
      case 'multiselect':
        return <SelectField {...baseProps} />;
      case 'checkbox':
        return <CheckboxField {...baseProps} />;
      case 'switch':
        return <SwitchField {...baseProps} />;
      case 'radio':
        return <RadioField {...baseProps} />;
      case 'file':
        return <FileField {...baseProps} />;
      case 'range':
        return <RangeField {...baseProps} />;
      case 'color':
        return <ColorField {...baseProps} />;
      case 'hidden':
        return <input type="hidden" name={field.name} value={value} />;
      default:
        return <TextField {...baseProps} />;
    }
  };

  // Checkbox and switch have inline labels
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div style={styles.fieldWrapper} className={field.className}>
        {renderField()}
        {field.description && <p style={styles.description}>{field.description}</p>}
        {showError && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={styles.fieldWrapper} className={field.className}>
      {field.label && field.type !== 'hidden' && (
        <label style={styles.label}>
          {field.label}
          {isRequired && <span style={styles.required}>*</span>}
        </label>
      )}
      {renderField()}
      {field.description && <p style={styles.description}>{field.description}</p>}
      {showError && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// ============================================================
// FORM COMPONENT
// ============================================================

export function Form({
  config,
  initialValues = {},
  onSubmit,
  onCancel,
  onChange,
  disabled = false,
  className,
}: FormProps): JSX.Element {
  const allFields = useMemo(
    () => config.sections.flatMap((s) => s.fields),
    [config.sections]
  );

  const form = useForm(allFields, {
    initialValues,
    validateOnBlur: config.validateOnBlur,
    validateOnChange: config.validateOnChange,
    onSubmit,
  });

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const collapsed = new Set<string>();
    config.sections.forEach((section) => {
      if (section.collapsible && section.defaultCollapsed) {
        collapsed.add(section.id);
      }
    });
    return collapsed;
  });

  useEffect(() => {
    onChange?.(form.values);
  }, [form.values, onChange]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <form style={styles.form} className={className} onSubmit={form.handleSubmit}>
      {config.sections.map((section) => {
        const isCollapsed = collapsedSections.has(section.id);
        const visibleFields = section.fields.filter(
          (field) => !field.hidden && (!field.showIf || field.showIf(form.values))
        );

        if (visibleFields.length === 0) return null;

        return (
          <div key={section.id} style={styles.section}>
            {(section.title || section.collapsible) && (
              <div
                style={styles.sectionHeader}
                onClick={() => section.collapsible && toggleSection(section.id)}
              >
                <div>
                  {section.title && <h3 style={styles.sectionTitle}>{section.title}</h3>}
                  {section.description && (
                    <p style={styles.sectionDescription}>{section.description}</p>
                  )}
                </div>
                {section.collapsible && (
                  <span
                    style={{
                      ...styles.collapseIcon,
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0)',
                    }}
                  >
                    ▼
                  </span>
                )}
              </div>
            )}
            {!isCollapsed && (
              <div style={styles.sectionContent}>
                <div
                  style={{
                    ...styles.fieldsGrid,
                    gridTemplateColumns: `repeat(${section.columns || 1}, 1fr)`,
                  }}
                >
                  {visibleFields.map((field) => (
                    <FormField
                      key={field.name}
                      field={field}
                      value={form.values[field.name]}
                      error={form.errors[field.name]}
                      touched={form.touched[field.name]}
                      disabled={disabled}
                      onChange={form.handleChange(field.name)}
                      onBlur={form.handleBlur(field.name)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.actions}>
        {config.showReset && (
          <button
            type="button"
            style={{ ...styles.button, ...styles.tertiaryButton }}
            onClick={form.reset}
            disabled={disabled || !form.isDirty}
          >
            {config.resetLabel || 'Reset'}
          </button>
        )}
        {config.showCancel && onCancel && (
          <button
            type="button"
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={onCancel}
            disabled={disabled}
          >
            {config.cancelLabel || 'Cancel'}
          </button>
        )}
        <button
          type="submit"
          style={{
            ...styles.button,
            ...styles.primaryButton,
            opacity: form.isSubmitting || disabled ? 0.7 : 1,
          }}
          disabled={form.isSubmitting || disabled}
        >
          {form.isSubmitting ? 'Submitting...' : config.submitLabel || 'Submit'}
        </button>
      </div>
    </form>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  FieldType,
  ValidationRule,
  SelectOption,
  FieldConfig,
  FieldRenderProps,
  FormSection,
  FormConfig,
  FormState,
  FormProps,
  UseFormOptions,
  UseFormReturn,
};

export default Form;
