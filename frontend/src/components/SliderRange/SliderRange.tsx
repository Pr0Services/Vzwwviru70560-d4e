// CHE·NU™ Slider & Range Components
// Comprehensive slider, range, and rating inputs

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
  CSSProperties,
  MouseEvent,
  TouchEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SliderOrientation = 'horizontal' | 'vertical';
type SliderSize = 'sm' | 'md' | 'lg';

interface SliderMark {
  value: number;
  label?: string;
}

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  orientation?: SliderOrientation;
  size?: SliderSize;
  disabled?: boolean;
  showValue?: boolean;
  showTooltip?: boolean;
  marks?: SliderMark[] | boolean;
  color?: string;
  trackColor?: string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

interface RangeSliderProps extends Omit<SliderProps, 'value' | 'defaultValue' | 'onChange' | 'onChangeEnd'> {
  value?: [number, number];
  defaultValue?: [number, number];
  minRange?: number;
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
}

interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: 0.5 | 1;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  emptyIcon?: ReactNode;
  color?: string;
  emptyColor?: string;
  disabled?: boolean;
  readOnly?: boolean;
  highlightSelectedOnly?: boolean;
  onChange?: (value: number) => void;
  onHover?: (value: number | null) => void;
  className?: string;
}

interface StepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  allowInput?: boolean;
  onChange?: (value: number) => void;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
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
// CONSTANTS
// ============================================================

const SLIDER_SIZES: Record<SliderSize, { track: number; thumb: number }> = {
  sm: { track: 4, thumb: 12 },
  md: { track: 6, thumb: 16 },
  lg: { track: 8, thumb: 20 },
};

const RATING_SIZES: Record<string, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

const STEPPER_SIZES: Record<string, { height: number; fontSize: number; buttonWidth: number }> = {
  sm: { height: 32, fontSize: 13, buttonWidth: 28 },
  md: { height: 40, fontSize: 14, buttonWidth: 36 },
  lg: { height: 48, fontSize: 16, buttonWidth: 44 },
};

// ============================================================
// UTILITIES
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, step: number, min: number): number {
  const rounded = Math.round((value - min) / step) * step + min;
  return Number(rounded.toFixed(10));
}

function getPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

function getValueFromPercentage(percentage: number, min: number, max: number): number {
  return (percentage / 100) * (max - min) + min;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Slider styles
  sliderContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    touchAction: 'none',
    userSelect: 'none' as const,
  },

  sliderContainerVertical: {
    flexDirection: 'column' as const,
    height: '200px',
    width: 'auto',
  },

  sliderTrack: {
    position: 'relative' as const,
    borderRadius: '100px',
    cursor: 'pointer',
  },

  sliderTrackHorizontal: {
    width: '100%',
  },

  sliderTrackVertical: {
    height: '100%',
  },

  sliderTrackDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  sliderFill: {
    position: 'absolute' as const,
    borderRadius: '100px',
  },

  sliderFillHorizontal: {
    top: 0,
    left: 0,
    height: '100%',
  },

  sliderFillVertical: {
    bottom: 0,
    left: 0,
    width: '100%',
  },

  sliderThumb: {
    position: 'absolute' as const,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    cursor: 'grab',
    transition: 'transform 0.1s, box-shadow 0.1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sliderThumbActive: {
    cursor: 'grabbing',
    transform: 'scale(1.1)',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
  },

  sliderThumbDisabled: {
    cursor: 'not-allowed',
  },

  sliderThumbFocused: {
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}40`,
  },

  sliderTooltip: {
    position: 'absolute' as const,
    padding: '4px 8px',
    backgroundColor: BRAND.uiSlate,
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
    transform: 'translateX(-50%)',
  },

  sliderTooltipHorizontal: {
    bottom: '100%',
    left: '50%',
    marginBottom: '8px',
  },

  sliderTooltipVertical: {
    left: '100%',
    top: '50%',
    marginLeft: '8px',
    transform: 'translateY(-50%)',
  },

  sliderMarks: {
    position: 'absolute' as const,
  },

  sliderMarksHorizontal: {
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '8px',
  },

  sliderMarksVertical: {
    left: '100%',
    top: 0,
    bottom: 0,
    marginLeft: '8px',
  },

  sliderMark: {
    position: 'absolute' as const,
    fontSize: '11px',
    color: BRAND.ancientStone,
  },

  sliderMarkHorizontal: {
    transform: 'translateX(-50%)',
  },

  sliderMarkVertical: {
    transform: 'translateY(50%)',
  },

  sliderValue: {
    marginLeft: '12px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    minWidth: '40px',
  },

  // Rating styles
  ratingContainer: {
    display: 'inline-flex',
    alignItems: 'center',
  },

  ratingStar: {
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },

  ratingStarHover: {
    transform: 'scale(1.1)',
  },

  ratingStarDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  ratingStarReadOnly: {
    cursor: 'default',
  },

  // Stepper styles
  stepperContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderRadius: '6px',
    overflow: 'hidden',
  },

  stepperButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 600,
  },

  stepperButtonHover: {
    backgroundColor: `${BRAND.ancientStone}30`,
  },

  stepperButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  stepperInput: {
    border: 'none',
    borderLeft: `1px solid ${BRAND.ancientStone}30`,
    borderRight: `1px solid ${BRAND.ancientStone}30`,
    textAlign: 'center' as const,
    outline: 'none',
    color: BRAND.uiSlate,
    fontWeight: 500,
    backgroundColor: '#ffffff',
    width: '60px',
  },

  stepperInputDisabled: {
    backgroundColor: BRAND.softSand,
    color: BRAND.ancientStone,
  },
};

// ============================================================
// SLIDER COMPONENT
// ============================================================

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  size = 'md',
  disabled = false,
  showValue = false,
  showTooltip = false,
  marks,
  color = BRAND.sacredGold,
  trackColor = `${BRAND.ancientStone}30`,
  onChange,
  onChangeEnd,
  formatValue = (v) => v.toString(),
  className,
}: SliderProps): JSX.Element {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const sizeConfig = SLIDER_SIZES[size];
  const isHorizontal = orientation === 'horizontal';
  const percentage = getPercentage(value, min, max);

  // Calculate marks
  const marksList = useMemo(() => {
    if (!marks) return [];
    if (marks === true) {
      const count = Math.floor((max - min) / step) + 1;
      return Array.from({ length: Math.min(count, 11) }, (_, i) => {
        const val = min + (i * (max - min)) / (Math.min(count, 11) - 1);
        return { value: roundToStep(val, step, min), label: formatValue(roundToStep(val, step, min)) };
      });
    }
    return marks;
  }, [marks, min, max, step, formatValue]);

  // Get value from position
  const getValueFromPosition = useCallback((clientX: number, clientY: number): number => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    let percentage: number;

    if (isHorizontal) {
      percentage = ((clientX - rect.left) / rect.width) * 100;
    } else {
      percentage = ((rect.bottom - clientY) / rect.height) * 100;
    }

    percentage = clamp(percentage, 0, 100);
    const rawValue = getValueFromPercentage(percentage, min, max);
    return roundToStep(rawValue, step, min);
  }, [value, min, max, step, isHorizontal]);

  // Handle mouse/touch events
  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (disabled) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newValue = getValueFromPosition(clientX, clientY);

    setInternalValue(newValue);
    onChange?.(newValue);
    setIsDragging(true);
    setShowTooltipState(true);
  }, [disabled, getValueFromPosition, onChange]);

  const handleMove = useCallback((e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newValue = getValueFromPosition(clientX, clientY);

    setInternalValue(newValue);
    onChange?.(newValue);
  }, [isDragging, getValueFromPosition, onChange]);

  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setShowTooltipState(false);
      onChangeEnd?.(value);
    }
  }, [isDragging, value, onChangeEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    const largeStep = step * 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = clamp(value + step, min, max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = clamp(value - step, min, max);
        break;
      case 'PageUp':
        newValue = clamp(value + largeStep, min, max);
        break;
      case 'PageDown':
        newValue = clamp(value - largeStep, min, max);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    setInternalValue(newValue);
    onChange?.(newValue);
    onChangeEnd?.(newValue);
  }, [disabled, value, step, min, max, onChange, onChangeEnd]);

  const containerStyle: CSSProperties = {
    ...styles.sliderContainer,
    ...(isHorizontal ? { width: '100%' } : styles.sliderContainerVertical),
  };

  const trackStyle: CSSProperties = {
    ...styles.sliderTrack,
    backgroundColor: trackColor,
    height: isHorizontal ? sizeConfig.track : '100%',
    width: isHorizontal ? '100%' : sizeConfig.track,
    ...(disabled && styles.sliderTrackDisabled),
  };

  const fillStyle: CSSProperties = {
    ...styles.sliderFill,
    backgroundColor: color,
    ...(isHorizontal
      ? { ...styles.sliderFillHorizontal, width: `${percentage}%` }
      : { ...styles.sliderFillVertical, height: `${percentage}%` }),
  };

  const thumbStyle: CSSProperties = {
    ...styles.sliderThumb,
    width: sizeConfig.thumb,
    height: sizeConfig.thumb,
    border: `2px solid ${color}`,
    ...(isHorizontal
      ? { left: `${percentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${percentage}%`, left: '50%', transform: 'translate(-50%, 50%)' }),
    ...(isDragging && styles.sliderThumbActive),
    ...(isFocused && !isDragging && styles.sliderThumbFocused),
    ...(disabled && styles.sliderThumbDisabled),
  };

  return (
    <div style={containerStyle} className={className}>
      <div
        ref={trackRef}
        style={trackStyle}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div style={fillStyle} />

        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          style={thumbStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => showTooltip && setShowTooltipState(true)}
          onMouseLeave={() => !isDragging && setShowTooltipState(false)}
        >
          {showTooltip && showTooltipState && (
            <div
              style={{
                ...styles.sliderTooltip,
                ...(isHorizontal ? styles.sliderTooltipHorizontal : styles.sliderTooltipVertical),
              }}
            >
              {formatValue(value)}
            </div>
          )}
        </div>

        {marksList.length > 0 && (
          <div
            style={{
              ...styles.sliderMarks,
              ...(isHorizontal ? styles.sliderMarksHorizontal : styles.sliderMarksVertical),
            }}
          >
            {marksList.map((mark) => {
              const markPercentage = getPercentage(mark.value, min, max);
              return (
                <span
                  key={mark.value}
                  style={{
                    ...styles.sliderMark,
                    ...(isHorizontal
                      ? { ...styles.sliderMarkHorizontal, left: `${markPercentage}%` }
                      : { ...styles.sliderMarkVertical, bottom: `${markPercentage}%` }),
                  }}
                >
                  {mark.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {showValue && (
        <span style={styles.sliderValue}>{formatValue(value)}</span>
      )}
    </div>
  );
}

// ============================================================
// RANGE SLIDER COMPONENT
// ============================================================

export function RangeSlider({
  value: controlledValue,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  minRange = 0,
  orientation = 'horizontal',
  size = 'md',
  disabled = false,
  showValue = false,
  showTooltip = false,
  marks,
  color = BRAND.sacredGold,
  trackColor = `${BRAND.ancientStone}30`,
  onChange,
  onChangeEnd,
  formatValue = (v) => v.toString(),
  className,
}: RangeSliderProps): JSX.Element {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const sizeConfig = SLIDER_SIZES[size];
  const isHorizontal = orientation === 'horizontal';

  const percentageStart = getPercentage(value[0], min, max);
  const percentageEnd = getPercentage(value[1], min, max);

  const getValueFromPosition = useCallback((clientX: number, clientY: number): number => {
    if (!trackRef.current) return 0;

    const rect = trackRef.current.getBoundingClientRect();
    let percentage: number;

    if (isHorizontal) {
      percentage = ((clientX - rect.left) / rect.width) * 100;
    } else {
      percentage = ((rect.bottom - clientY) / rect.height) * 100;
    }

    percentage = clamp(percentage, 0, 100);
    const rawValue = getValueFromPercentage(percentage, min, max);
    return roundToStep(rawValue, step, min);
  }, [min, max, step, isHorizontal]);

  const handleThumbStart = useCallback((index: 0 | 1) => (e: MouseEvent | TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(index);
  }, [disabled]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (disabled || activeThumb !== null) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const clickValue = getValueFromPosition(clientX, clientY);

    // Determine which thumb to move
    const distToStart = Math.abs(clickValue - value[0]);
    const distToEnd = Math.abs(clickValue - value[1]);

    const newValue: [number, number] = [...value];

    if (distToStart <= distToEnd) {
      newValue[0] = clamp(clickValue, min, value[1] - minRange);
    } else {
      newValue[1] = clamp(clickValue, value[0] + minRange, max);
    }

    setInternalValue(newValue);
    onChange?.(newValue);
    onChangeEnd?.(newValue);
  }, [disabled, activeThumb, getValueFromPosition, value, min, max, minRange, onChange, onChangeEnd]);

  const handleMove = useCallback((e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (activeThumb === null) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newValue = getValueFromPosition(clientX, clientY);

    const updatedValue: [number, number] = [...value];

    if (activeThumb === 0) {
      updatedValue[0] = clamp(newValue, min, value[1] - minRange);
    } else {
      updatedValue[1] = clamp(newValue, value[0] + minRange, max);
    }

    setInternalValue(updatedValue);
    onChange?.(updatedValue);
  }, [activeThumb, getValueFromPosition, value, min, max, minRange, onChange]);

  const handleEnd = useCallback(() => {
    if (activeThumb !== null) {
      setActiveThumb(null);
      onChangeEnd?.(value);
    }
  }, [activeThumb, value, onChangeEnd]);

  useEffect(() => {
    if (activeThumb !== null) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [activeThumb, handleMove, handleEnd]);

  const containerStyle: CSSProperties = {
    ...styles.sliderContainer,
    ...(isHorizontal ? { width: '100%' } : styles.sliderContainerVertical),
  };

  const trackStyle: CSSProperties = {
    ...styles.sliderTrack,
    backgroundColor: trackColor,
    height: isHorizontal ? sizeConfig.track : '100%',
    width: isHorizontal ? '100%' : sizeConfig.track,
    ...(disabled && styles.sliderTrackDisabled),
  };

  const fillStyle: CSSProperties = {
    ...styles.sliderFill,
    backgroundColor: color,
    ...(isHorizontal
      ? { left: `${percentageStart}%`, width: `${percentageEnd - percentageStart}%`, height: '100%' }
      : { bottom: `${percentageStart}%`, height: `${percentageEnd - percentageStart}%`, width: '100%' }),
  };

  const getThumbStyle = (percentage: number, isActive: boolean): CSSProperties => ({
    ...styles.sliderThumb,
    width: sizeConfig.thumb,
    height: sizeConfig.thumb,
    border: `2px solid ${color}`,
    zIndex: isActive ? 2 : 1,
    ...(isHorizontal
      ? { left: `${percentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }
      : { bottom: `${percentage}%`, left: '50%', transform: 'translate(-50%, 50%)' }),
    ...(isActive && styles.sliderThumbActive),
    ...(disabled && styles.sliderThumbDisabled),
  });

  return (
    <div style={containerStyle} className={className}>
      <div
        ref={trackRef}
        style={trackStyle}
        onClick={handleTrackClick}
      >
        <div style={fillStyle} />

        {/* Start Thumb */}
        <div
          style={getThumbStyle(percentageStart, activeThumb === 0)}
          onMouseDown={handleThumbStart(0)}
          onTouchStart={handleThumbStart(0)}
        >
          {showTooltip && activeThumb === 0 && (
            <div style={{ ...styles.sliderTooltip, ...styles.sliderTooltipHorizontal }}>
              {formatValue(value[0])}
            </div>
          )}
        </div>

        {/* End Thumb */}
        <div
          style={getThumbStyle(percentageEnd, activeThumb === 1)}
          onMouseDown={handleThumbStart(1)}
          onTouchStart={handleThumbStart(1)}
        >
          {showTooltip && activeThumb === 1 && (
            <div style={{ ...styles.sliderTooltip, ...styles.sliderTooltipHorizontal }}>
              {formatValue(value[1])}
            </div>
          )}
        </div>
      </div>

      {showValue && (
        <span style={styles.sliderValue}>
          {formatValue(value[0])} - {formatValue(value[1])}
        </span>
      )}
    </div>
  );
}

// ============================================================
// RATING COMPONENT
// ============================================================

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  precision = 1,
  size = 'md',
  icon,
  emptyIcon,
  color = BRAND.sacredGold,
  emptyColor = `${BRAND.ancientStone}40`,
  disabled = false,
  readOnly = false,
  highlightSelectedOnly = false,
  onChange,
  onHover,
  className,
}: RatingProps): JSX.Element {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : value;
  const sizeValue = RATING_SIZES[size];

  const handleClick = useCallback((newValue: number) => {
    if (disabled || readOnly) return;
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [disabled, readOnly, onChange]);

  const handleMouseMove = useCallback((e: MouseEvent, index: number) => {
    if (disabled || readOnly) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfWidth = rect.width / 2;

    let newValue: number;
    if (precision === 0.5) {
      newValue = x < halfWidth ? index + 0.5 : index + 1;
    } else {
      newValue = index + 1;
    }

    setHoverValue(newValue);
    onHover?.(newValue);
  }, [disabled, readOnly, precision, onHover]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
    onHover?.(null);
  }, [onHover]);

  const renderIcon = (index: number): ReactNode => {
    const filled = displayValue >= index + 1;
    const halfFilled = precision === 0.5 && displayValue >= index + 0.5 && displayValue < index + 1;

    const iconColor = filled || halfFilled ? color : emptyColor;
    const defaultIcon = filled ? '★' : '☆';

    if (halfFilled) {
      return (
        <span style={{ position: 'relative', display: 'inline-block', width: sizeValue, height: sizeValue }}>
          <span style={{ position: 'absolute', overflow: 'hidden', width: '50%', color }}>
            {icon || '★'}
          </span>
          <span style={{ color: emptyColor }}>
            {emptyIcon || '☆'}
          </span>
        </span>
      );
    }

    return (
      <span style={{ color: iconColor }}>
        {filled ? (icon || '★') : (emptyIcon || '☆')}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      style={styles.ratingContainer}
      className={className}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          style={{
            ...styles.ratingStar,
            fontSize: sizeValue,
            ...(hoverValue !== null && hoverValue >= index + 1 && styles.ratingStarHover),
            ...(disabled && styles.ratingStarDisabled),
            ...(readOnly && styles.ratingStarReadOnly),
          }}
          onClick={() => handleClick(index + 1)}
          onMouseMove={(e) => handleMouseMove(e, index)}
        >
          {renderIcon(index)}
        </span>
      ))}
    </div>
  );
}

// ============================================================
// STEPPER COMPONENT
// ============================================================

export function Stepper({
  value: controlledValue,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'md',
  disabled = false,
  allowInput = true,
  onChange,
  formatValue = (v) => v.toString(),
  parseValue = (v) => parseFloat(v) || 0,
  className,
}: StepperProps): JSX.Element {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(formatValue(defaultValue));
  const [hoveredButton, setHoveredButton] = useState<'dec' | 'inc' | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const sizeConfig = STEPPER_SIZES[size];

  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value, formatValue]);

  const updateValue = useCallback((newValue: number) => {
    const clampedValue = clamp(roundToStep(newValue, step, min), min, max);
    setInternalValue(clampedValue);
    setInputValue(formatValue(clampedValue));
    onChange?.(clampedValue);
  }, [min, max, step, formatValue, onChange]);

  const handleDecrement = useCallback(() => {
    if (disabled || value <= min) return;
    updateValue(value - step);
  }, [disabled, value, min, step, updateValue]);

  const handleIncrement = useCallback(() => {
    if (disabled || value >= max) return;
    updateValue(value + step);
  }, [disabled, value, max, step, updateValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    const parsed = parseValue(inputValue);
    updateValue(parsed);
  }, [inputValue, parseValue, updateValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  }, [handleInputBlur, handleIncrement, handleDecrement]);

  const buttonStyle = (type: 'dec' | 'inc'): CSSProperties => ({
    ...styles.stepperButton,
    width: sizeConfig.buttonWidth,
    height: sizeConfig.height,
    fontSize: sizeConfig.fontSize + 4,
    ...(hoveredButton === type && !disabled && styles.stepperButtonHover),
    ...((disabled || (type === 'dec' && value <= min) || (type === 'inc' && value >= max)) &&
      styles.stepperButtonDisabled),
  });

  return (
    <div style={styles.stepperContainer} className={className}>
      <button
        type="button"
        style={buttonStyle('dec')}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        onMouseEnter={() => setHoveredButton('dec')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        −
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled || !allowInput}
        readOnly={!allowInput}
        style={{
          ...styles.stepperInput,
          height: sizeConfig.height,
          fontSize: sizeConfig.fontSize,
          ...(disabled && styles.stepperInputDisabled),
        }}
      />

      <button
        type="button"
        style={buttonStyle('inc')}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        onMouseEnter={() => setHoveredButton('inc')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        +
      </button>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  SliderOrientation,
  SliderSize,
  SliderMark,
  SliderProps,
  RangeSliderProps,
  RatingProps,
  StepperProps,
};

export {
  clamp,
  roundToStep,
  getPercentage,
  getValueFromPercentage,
};

export default {
  Slider,
  RangeSlider,
  Rating,
  Stepper,
};
