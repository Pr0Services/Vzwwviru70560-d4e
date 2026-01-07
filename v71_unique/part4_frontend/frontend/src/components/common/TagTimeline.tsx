/**
 * CHE·NU™ Tag, Timeline, Rating & Slider Components
 * 
 * Advanced UI components for tagging, timeline visualization,
 * ratings, and range selection.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TAG / CHIP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export type TagVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  onClick,
  disabled = false,
  outline = false,
}) => {
  return (
    <span
      className={`
        tag
        tag--${variant}
        tag--${size}
        ${outline ? 'tag--outline' : ''}
        ${onClick ? 'tag--clickable' : ''}
        ${disabled ? 'tag--disabled' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {icon && <span className="tag__icon">{icon}</span>}
      <span className="tag__label">{children}</span>
      {removable && (
        <button
          className="tag__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          disabled={disabled}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
};

// Tag Input for multiple tags
export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  variant?: TagVariant;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tag...',
  maxTags = Infinity,
  allowDuplicates = false,
  disabled = false,
  variant = 'primary',
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!allowDuplicates && tags.includes(trimmed)) return;
    if (tags.length >= maxTags) return;
    
    onChange([...tags, trimmed]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div 
      className={`tag-input ${disabled ? 'tag-input--disabled' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          variant={variant}
          size="sm"
          removable
          onRemove={() => removeTag(index)}
          disabled={disabled}
        >
          {tag}
        </Tag>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="tag-input__field"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(inputValue)}
        placeholder={tags.length === 0 ? placeholder : ''}
        disabled={disabled || tags.length >= maxTags}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  color?: string;
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternate' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'default',
  size = 'md',
}) => {
  return (
    <div className={`timeline timeline--${variant} timeline--${size}`}>
      {items.map((item, index) => (
        <div key={item.id} className="timeline__item">
          <div className="timeline__marker">
            <div 
              className="timeline__dot"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
            {index < items.length - 1 && <div className="timeline__line" />}
          </div>
          
          <div className="timeline__content">
            {item.date && (
              <span className="timeline__date">{item.date}</span>
            )}
            <h4 className="timeline__title">{item.title}</h4>
            {item.description && (
              <p className="timeline__description">{item.description}</p>
            )}
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RATING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onChange?: (value: number) => void;
  precision?: 0.5 | 1;
  icon?: 'star' | 'heart' | 'circle';
  color?: string;
  showValue?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  readOnly = false,
  onChange,
  precision = 1,
  icon = 'star',
  color = '#fbbf24',
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const getIcon = (filled: 'full' | 'half' | 'empty') => {
    const icons = {
      star: {
        full: '★',
        half: '★',
        empty: '☆',
      },
      heart: {
        full: '♥',
        half: '♥',
        empty: '♡',
      },
      circle: {
        full: '●',
        half: '◐',
        empty: '○',
      },
    };
    return icons[icon][filled];
  };

  const handleClick = (index: number, isHalf: boolean) => {
    if (readOnly || !onChange) return;
    const newValue = precision === 0.5 && isHalf ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = precision === 0.5 && (e.clientX - rect.left) < rect.width / 2;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={`rating rating--${size} ${readOnly ? 'rating--readonly' : ''}`}>
      <div className="rating__stars">
        {Array.from({ length: max }).map((_, index) => {
          const filled = displayValue >= index + 1 ? 'full' 
            : displayValue >= index + 0.5 ? 'half' 
            : 'empty';
          
          return (
            <span
              key={index}
              className={`rating__icon rating__icon--${filled}`}
              style={{ color: filled !== 'empty' ? color : undefined }}
              onClick={(e) => handleClick(index, precision === 0.5 && (e.nativeEvent.offsetX < (e.currentTarget as HTMLElement).offsetWidth / 2))}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHoverValue(null)}
            >
              {getIcon(filled)}
              {filled === 'half' && (
                <span className="rating__icon-half" style={{ color }}>
                  {getIcon('full')}
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="rating__value">{value.toFixed(precision === 0.5 ? 1 : 0)}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SLIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  marks?: { value: number; label: string }[];
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  showTicks = false,
  marks,
  color = 'var(--color-primary, #6366f1)',
  size = 'md',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const calculateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onChange(calculateValue(e.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onChange(calculateValue(e.clientX));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, calculateValue, onChange]);

  return (
    <div className={`slider slider--${size} ${disabled ? 'slider--disabled' : ''}`}>
      <div 
        ref={trackRef}
        className="slider__track"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="slider__fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        <div
          className={`slider__thumb ${isDragging ? 'slider__thumb--active' : ''}`}
          style={{ left: `${percentage}%`, borderColor: color }}
        />
        
        {showTicks && (
          <div className="slider__ticks">
            {Array.from({ length: Math.floor((max - min) / step) + 1 }).map((_, i) => (
              <div 
                key={i} 
                className="slider__tick"
                style={{ left: `${(i * step / (max - min)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
      
      {marks && (
        <div className="slider__marks">
          {marks.map((mark) => (
            <span
              key={mark.value}
              className="slider__mark"
              style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
            >
              {mark.label}
            </span>
          ))}
        </div>
      )}
      
      {showValue && (
        <span className="slider__value">{value}</span>
      )}
    </div>
  );
};

// Range Slider (two thumbs)
export interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  color?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  color = 'var(--color-primary, #6366f1)',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);

  const percentageStart = ((value[0] - min) / (max - min)) * 100;
  const percentageEnd = ((value[1] - min) / (max - min)) * 100;

  const calculateValue = useCallback((clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    return Math.round(rawValue / step) * step;
  }, [min, max, step]);

  const handleMouseDown = (thumb: 0 | 1) => (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setActiveThumb(thumb);
  };

  useEffect(() => {
    if (activeThumb === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = calculateValue(e.clientX);
      const newRange: [number, number] = [...value];
      newRange[activeThumb] = Math.max(min, Math.min(max, newValue));
      
      // Ensure min <= max
      if (activeThumb === 0 && newRange[0] > newRange[1]) {
        newRange[0] = newRange[1];
      } else if (activeThumb === 1 && newRange[1] < newRange[0]) {
        newRange[1] = newRange[0];
      }
      
      onChange(newRange);
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeThumb, calculateValue, onChange, value, min, max]);

  return (
    <div className={`slider slider--range ${disabled ? 'slider--disabled' : ''}`}>
      <div ref={trackRef} className="slider__track">
        <div 
          className="slider__fill"
          style={{ 
            left: `${percentageStart}%`,
            width: `${percentageEnd - percentageStart}%`,
            backgroundColor: color,
          }}
        />
        <div
          className={`slider__thumb ${activeThumb === 0 ? 'slider__thumb--active' : ''}`}
          style={{ left: `${percentageStart}%`, borderColor: color }}
          onMouseDown={handleMouseDown(0)}
        />
        <div
          className={`slider__thumb ${activeThumb === 1 ? 'slider__thumb--active' : ''}`}
          style={{ left: `${percentageEnd}%`, borderColor: color }}
          onMouseDown={handleMouseDown(1)}
        />
      </div>
      
      {showValue && (
        <div className="slider__range-values">
          <span>{value[0]}</span>
          <span>—</span>
          <span>{value[1]}</span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PICKER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showInput?: boolean;
  disabled?: boolean;
}

const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#fbbf24', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  showInput = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`color-picker ${disabled ? 'color-picker--disabled' : ''}`}>
      <button
        className="color-picker__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span 
          className="color-picker__swatch"
          style={{ backgroundColor: value }}
        />
        {showInput && <span className="color-picker__value">{value}</span>}
      </button>
      
      {isOpen && (
        <div className="color-picker__dropdown">
          <div className="color-picker__presets">
            {presets.map((color) => (
              <button
                key={color}
                className={`color-picker__preset ${value === color ? 'color-picker__preset--selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <input
            type="color"
            className="color-picker__native"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const TagTimelineStyles: React.FC = () => (
  <style>{`
    /* Tag */
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: var(--radius-full, 9999px);
      font-size: 12px;
      font-weight: 500;
      transition: all var(--transition-fast, 0.15s);
    }

    .tag--sm { padding: 1px 6px; font-size: 11px; }
    .tag--lg { padding: 4px 12px; font-size: 14px; }

    .tag--default { background: var(--color-bg-tertiary, #e5e7eb); color: var(--color-text-primary, #111827); }
    .tag--primary { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .tag--secondary { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    .tag--success { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
    .tag--warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .tag--error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .tag--info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

    .tag--outline {
      background: transparent;
      border: 1px solid currentColor;
    }

    .tag--clickable { cursor: pointer; }
    .tag--clickable:hover { opacity: 0.8; }
    .tag--disabled { opacity: 0.5; cursor: not-allowed; }

    .tag__icon { display: flex; font-size: 0.85em; }
    .tag__remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      margin-left: 2px;
      margin-right: -4px;
      border: none;
      background: transparent;
      color: inherit;
      font-size: 14px;
      cursor: pointer;
      border-radius: 50%;
      opacity: 0.6;
    }
    .tag__remove:hover { opacity: 1; background: rgba(0,0,0,0.1); }

    /* Tag Input */
    .tag-input {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      min-height: 42px;
      cursor: text;
      transition: border-color var(--transition-fast, 0.15s);
    }

    .tag-input:focus-within {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .tag-input--disabled {
      background: var(--color-bg-secondary, #f9fafb);
      cursor: not-allowed;
    }

    .tag-input__field {
      flex: 1;
      min-width: 80px;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
    }

    /* Timeline */
    .timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline__item {
      display: flex;
      position: relative;
      padding-bottom: 24px;
    }

    .timeline__item:last-child { padding-bottom: 0; }

    .timeline__marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;
    }

    .timeline__dot {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--color-primary, #6366f1);
      color: white;
      font-size: 12px;
      flex-shrink: 0;
      z-index: 1;
    }

    .timeline--sm .timeline__dot { width: 16px; height: 16px; font-size: 10px; }
    .timeline--lg .timeline__dot { width: 32px; height: 32px; font-size: 14px; }

    .timeline__line {
      position: absolute;
      top: 24px;
      left: 11px;
      width: 2px;
      height: calc(100% - 24px);
      background: var(--color-border, #e5e7eb);
    }

    .timeline__content { flex: 1; padding-top: 2px; }
    .timeline__date {
      display: block;
      font-size: 12px;
      color: var(--color-text-tertiary, #9ca3af);
      margin-bottom: 4px;
    }
    .timeline__title {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-primary, #111827);
    }
    .timeline__description {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
    }

    /* Rating */
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .rating__stars { display: flex; gap: 2px; }

    .rating__icon {
      position: relative;
      cursor: pointer;
      font-size: 20px;
      color: var(--color-border, #e5e7eb);
      transition: transform var(--transition-fast, 0.15s);
    }

    .rating--sm .rating__icon { font-size: 16px; }
    .rating--lg .rating__icon { font-size: 28px; }

    .rating--readonly .rating__icon { cursor: default; }

    .rating__icon:not(.rating--readonly .rating__icon):hover {
      transform: scale(1.1);
    }

    .rating__icon--full,
    .rating__icon--half { color: inherit; }

    .rating__icon-half {
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      overflow: hidden;
    }

    .rating__value {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-secondary, #6b7280);
    }

    /* Slider */
    .slider {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .slider__track {
      position: relative;
      flex: 1;
      height: 6px;
      background: var(--color-bg-tertiary, #e5e7eb);
      border-radius: var(--radius-full, 9999px);
      cursor: pointer;
    }

    .slider--sm .slider__track { height: 4px; }
    .slider--lg .slider__track { height: 8px; }

    .slider__fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border-radius: var(--radius-full, 9999px);
      transition: width 0.1s;
    }

    .slider__thumb {
      position: absolute;
      top: 50%;
      width: 18px;
      height: 18px;
      background: white;
      border: 2px solid var(--color-primary, #6366f1);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      cursor: grab;
      transition: box-shadow var(--transition-fast, 0.15s);
    }

    .slider--sm .slider__thumb { width: 14px; height: 14px; }
    .slider--lg .slider__thumb { width: 22px; height: 22px; }

    .slider__thumb:hover,
    .slider__thumb--active {
      box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.15);
    }

    .slider__thumb--active { cursor: grabbing; }

    .slider__value {
      min-width: 32px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary, #111827);
      text-align: right;
    }

    .slider__range-values {
      display: flex;
      gap: 4px;
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
    }

    .slider__ticks {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      height: 4px;
    }

    .slider__tick {
      position: absolute;
      width: 1px;
      height: 4px;
      background: var(--color-border, #e5e7eb);
      transform: translateX(-50%);
    }

    .slider__marks {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 8px;
    }

    .slider__mark {
      position: absolute;
      transform: translateX(-50%);
      font-size: 12px;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .slider--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Color Picker */
    .color-picker {
      position: relative;
      display: inline-block;
    }

    .color-picker__trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
      cursor: pointer;
      transition: border-color var(--transition-fast, 0.15s);
    }

    .color-picker__trigger:hover {
      border-color: var(--color-primary, #6366f1);
    }

    .color-picker__swatch {
      width: 20px;
      height: 20px;
      border-radius: var(--radius-sm, 4px);
      border: 1px solid rgba(0,0,0,0.1);
    }

    .color-picker__value {
      font-size: 13px;
      font-family: monospace;
      color: var(--color-text-secondary, #6b7280);
    }

    .color-picker__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      padding: 8px;
      background: white;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-lg, 0 10px 25px -5px rgba(0,0,0,0.1));
      z-index: 1000;
    }

    .color-picker__presets {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 4px;
      margin-bottom: 8px;
    }

    .color-picker__preset {
      width: 28px;
      height: 28px;
      border: 2px solid transparent;
      border-radius: var(--radius-sm, 4px);
      cursor: pointer;
      transition: transform var(--transition-fast, 0.15s);
    }

    .color-picker__preset:hover { transform: scale(1.1); }
    .color-picker__preset--selected { border-color: var(--color-text-primary, #111827); }

    .color-picker__native {
      width: 100%;
      height: 32px;
      border: none;
      cursor: pointer;
    }

    .color-picker--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Dark mode */
    [data-theme="dark"] .tag--default {
      background: #333;
      color: #f9fafb;
    }

    [data-theme="dark"] .tag-input {
      border-color: #333;
      background: #1a1a1a;
    }

    [data-theme="dark"] .timeline__line { background: #333; }
    [data-theme="dark"] .timeline__title { color: #f9fafb; }

    [data-theme="dark"] .slider__track { background: #333; }
    [data-theme="dark"] .slider__thumb { background: #1a1a1a; }
    [data-theme="dark"] .slider__value { color: #f9fafb; }

    [data-theme="dark"] .color-picker__trigger {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .color-picker__dropdown {
      background: #1a1a1a;
      border-color: #333;
    }
  `}</style>
);

export default {
  Tag,
  TagInput,
  Timeline,
  Rating,
  Slider,
  RangeSlider,
  ColorPicker,
  TagTimelineStyles,
};
