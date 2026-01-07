// CHE·NU™ Date & Time Picker Components
// Comprehensive date/time selection system

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type DatePickerMode = 'single' | 'range' | 'multiple';
type CalendarView = 'days' | 'months' | 'years';

interface DateValue {
  year: number;
  month: number;
  day: number;
}

interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  mode?: DatePickerMode;
  onChange?: (date: Date | null) => void;
  onRangeChange?: (range: DateRange) => void;
  onMultipleChange?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  showToday?: boolean;
  showClear?: boolean;
  inline?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  className?: string;
}

interface TimePickerProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (time: TimeValue | null) => void;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  step?: number;
  use24Hours?: boolean;
  showSeconds?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

interface DateTimePickerProps extends Omit<DatePickerProps, 'mode' | 'onRangeChange' | 'onMultipleChange'> {
  timeProps?: Omit<TimePickerProps, 'value' | 'onChange'>;
  showTime?: boolean;
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

const DAYS_OF_WEEK_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAYS_OF_WEEK_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ============================================================
// UTILITIES
// ============================================================

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function formatDate(date: Date | null, format: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return format
    .replace('yyyy', year.toString())
    .replace('yy', year.toString().slice(-2))
    .replace('MMMM', MONTHS_LONG[month])
    .replace('MMM', MONTHS_SHORT[month])
    .replace('MM', (month + 1).toString().padStart(2, '0'))
    .replace('M', (month + 1).toString())
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('d', day.toString());
}

function formatTime(time: TimeValue | null, use24Hours: boolean = true, showSeconds: boolean = false): string {
  if (!time) return '';
  
  let hours = time.hours;
  const minutes = time.minutes.toString().padStart(2, '0');
  const seconds = (time.seconds || 0).toString().padStart(2, '0');
  let period = '';
  
  if (!use24Hours) {
    period = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }
  
  const hoursStr = hours.toString().padStart(2, '0');
  
  if (showSeconds) {
    return `${hoursStr}:${minutes}:${seconds}${period}`;
  }
  return `${hoursStr}:${minutes}${period}`;
}

function parseTimeString(str: string): TimeValue | null {
  const match = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  const period = match[4]?.toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }
  
  return { hours, minutes, seconds };
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    position: 'relative' as const,
    display: 'inline-block',
  },

  input: {
    width: '100%',
    padding: '10px 12px',
    paddingRight: '36px',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderRadius: '6px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },

  inputFocused: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}20`,
  },

  inputDisabled: {
    backgroundColor: BRAND.softSand,
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  inputIcon: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: BRAND.ancientStone,
    pointerEvents: 'none' as const,
  },

  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '4px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    zIndex: 1000,
    animation: 'fadeIn 0.15s ease-out',
  },

  calendar: {
    width: '280px',
    padding: '12px',
  },

  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  calendarTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },

  calendarNav: {
    display: 'flex',
    gap: '4px',
  },

  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    color: BRAND.ancientStone,
    transition: 'all 0.2s',
  },

  navButtonHover: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
  },

  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },

  weekdayCell: {
    textAlign: 'center' as const,
    fontSize: '11px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    padding: '4px',
    textTransform: 'uppercase' as const,
  },

  days: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },

  dayCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    margin: '0 auto',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    transition: 'all 0.15s',
  },

  dayCellOtherMonth: {
    color: BRAND.ancientStone,
    opacity: 0.4,
  },

  dayCellToday: {
    fontWeight: 600,
    color: BRAND.cenoteTurquoise,
    border: `1px solid ${BRAND.cenoteTurquoise}`,
  },

  dayCellSelected: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    fontWeight: 600,
  },

  dayCellInRange: {
    backgroundColor: `${BRAND.sacredGold}20`,
    borderRadius: 0,
  },

  dayCellRangeStart: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
  },

  dayCellRangeEnd: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px',
  },

  dayCellDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },

  dayCellHover: {
    backgroundColor: BRAND.softSand,
  },

  months: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    padding: '8px',
  },

  monthCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    transition: 'all 0.15s',
  },

  monthCellSelected: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    fontWeight: 600,
  },

  years: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '8px',
    maxHeight: '240px',
    overflowY: 'auto' as const,
  },

  yearCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    transition: 'all 0.15s',
  },

  yearCellSelected: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    fontWeight: 600,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
  },

  footerButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  todayButton: {
    backgroundColor: 'transparent',
    color: BRAND.cenoteTurquoise,
  },

  clearButton: {
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
  },

  // Time picker styles
  timePicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '12px',
  },

  timeInput: {
    width: '50px',
    padding: '8px',
    textAlign: 'center' as const,
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    outline: 'none',
  },

  timeSeparator: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.ancientStone,
  },

  periodToggle: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    marginLeft: '8px',
  },

  periodButton: {
    padding: '4px 8px',
    border: `1px solid ${BRAND.ancientStone}30`,
    background: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    transition: 'all 0.2s',
  },

  periodButtonActive: {
    backgroundColor: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  periodButtonTop: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    borderBottom: 'none',
  },

  periodButtonBottom: {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },

  timeSpinner: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },

  spinnerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: BRAND.ancientStone,
    fontSize: '10px',
    transition: 'all 0.2s',
  },

  spinnerButtonHover: {
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
  },
};

// ============================================================
// DATE PICKER COMPONENT
// ============================================================

export function DatePicker({
  value,
  defaultValue,
  mode = 'single',
  onChange,
  onRangeChange,
  onMultipleChange,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  locale = 'en-US',
  firstDayOfWeek = 0,
  showWeekNumbers = false,
  showToday = true,
  showClear = true,
  inline = false,
  disabled = false,
  placeholder = 'Select date',
  format = 'MMM d, yyyy',
  className,
}: DatePickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(inline);
  const [viewDate, setViewDate] = useState(() => value || defaultValue || new Date());
  const [view, setView] = useState<CalendarView>('days');
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || defaultValue || null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysFromPrevMonth = (firstDay - firstDayOfWeek + 7) % 7;

    // Previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const remainingDays = 42 - days.length;

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth, firstDayOfWeek]);

  // Check if date is disabled
  const isDateDisabled = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabledDaysOfWeek.includes(date.getDay())) return true;
    return disabledDates.some((d) => isSameDay(d, date));
  }, [minDate, maxDate, disabledDates, disabledDaysOfWeek]);

  // Handle day click
  const handleDayClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === 'single') {
      setSelectedDate(date);
      onChange?.(date);
      if (!inline) setIsOpen(false);
    } else if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        if (date < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
          onRangeChange?.({ start: date, end: rangeStart });
        } else {
          setRangeEnd(date);
          onRangeChange?.({ start: rangeStart, end: date });
        }
        if (!inline) setIsOpen(false);
      }
    } else if (mode === 'multiple') {
      const isSelected = selectedDates.some((d) => isSameDay(d, date));
      const newDates = isSelected
        ? selectedDates.filter((d) => !isSameDay(d, date))
        : [...selectedDates, date];
      setSelectedDates(newDates);
      onMultipleChange?.(newDates);
    }
  }, [mode, rangeStart, rangeEnd, selectedDates, isDateDisabled, onChange, onRangeChange, onMultipleChange, inline]);

  // Handle month navigation
  const navigateMonth = useCallback((delta: number) => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }, []);

  // Handle year navigation
  const navigateYear = useCallback((delta: number) => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + delta);
      return newDate;
    });
  }, []);

  // Handle today click
  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setViewDate(today);
    if (mode === 'single') {
      setSelectedDate(today);
      onChange?.(today);
    }
  }, [mode, onChange]);

  // Handle clear click
  const handleClearClick = useCallback(() => {
    if (mode === 'single') {
      setSelectedDate(null);
      onChange?.(null);
    } else if (mode === 'range') {
      setRangeStart(null);
      setRangeEnd(null);
      onRangeChange?.({ start: null, end: null });
    } else if (mode === 'multiple') {
      setSelectedDates([]);
      onMultipleChange?.([]);
    }
  }, [mode, onChange, onRangeChange, onMultipleChange]);

  // Handle month select
  const handleMonthSelect = useCallback((month: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), month, 1));
    setView('days');
  }, []);

  // Handle year select
  const handleYearSelect = useCallback((year: number) => {
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
    setView('months');
  }, []);

  // Click outside handler
  useEffect(() => {
    if (!isOpen || inline) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, inline]);

  // Get day cell styles
  const getDayCellStyles = (date: Date, isCurrentMonth: boolean): React.CSSProperties => {
    let style: React.CSSProperties = { ...styles.dayCell };

    if (!isCurrentMonth) {
      style = { ...style, ...styles.dayCellOtherMonth };
    }

    if (isDateDisabled(date)) {
      style = { ...style, ...styles.dayCellDisabled };
    }

    if (isToday(date)) {
      style = { ...style, ...styles.dayCellToday };
    }

    if (mode === 'single' && isSameDay(date, selectedDate)) {
      style = { ...style, ...styles.dayCellSelected };
    }

    if (mode === 'range') {
      if (isSameDay(date, rangeStart)) {
        style = { ...style, ...styles.dayCellRangeStart };
      } else if (isSameDay(date, rangeEnd)) {
        style = { ...style, ...styles.dayCellRangeEnd };
      } else if (isInRange(date, rangeStart, rangeEnd)) {
        style = { ...style, ...styles.dayCellInRange };
      }
    }

    if (mode === 'multiple' && selectedDates.some((d) => isSameDay(d, date))) {
      style = { ...style, ...styles.dayCellSelected };
    }

    return style;
  };

  // Get display value
  const getDisplayValue = (): string => {
    if (mode === 'single') {
      return formatDate(selectedDate, format);
    } else if (mode === 'range') {
      if (rangeStart && rangeEnd) {
        return `${formatDate(rangeStart, format)} - ${formatDate(rangeEnd, format)}`;
      } else if (rangeStart) {
        return `${formatDate(rangeStart, format)} - ...`;
      }
    } else if (mode === 'multiple') {
      if (selectedDates.length === 0) return '';
      if (selectedDates.length === 1) return formatDate(selectedDates[0], format);
      return `${selectedDates.length} dates selected`;
    }
    return '';
  };

  // Reorder days of week based on firstDayOfWeek
  const orderedDays = useMemo(() => {
    return [...DAYS_OF_WEEK_SHORT.slice(firstDayOfWeek), ...DAYS_OF_WEEK_SHORT.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  // Generate years for year view
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    const endYear = currentYear + 50;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, []);

  const renderCalendar = () => (
    <div style={styles.calendar}>
      {/* Header */}
      <div style={styles.calendarHeader}>
        <div style={styles.calendarNav}>
          <button
            style={styles.navButton}
            onClick={() => view === 'years' ? navigateYear(-10) : navigateYear(-1)}
          >
            ‹‹
          </button>
          <button
            style={styles.navButton}
            onClick={() => navigateMonth(-1)}
            disabled={view !== 'days'}
          >
            ‹
          </button>
        </div>

        <span
          style={styles.calendarTitle}
          onClick={() => setView(view === 'days' ? 'months' : view === 'months' ? 'years' : 'days')}
        >
          {view === 'days' && `${MONTHS_LONG[currentMonth]} ${currentYear}`}
          {view === 'months' && currentYear}
          {view === 'years' && `${years[0]} - ${years[years.length - 1]}`}
        </span>

        <div style={styles.calendarNav}>
          <button
            style={styles.navButton}
            onClick={() => navigateMonth(1)}
            disabled={view !== 'days'}
          >
            ›
          </button>
          <button
            style={styles.navButton}
            onClick={() => view === 'years' ? navigateYear(10) : navigateYear(1)}
          >
            ››
          </button>
        </div>
      </div>

      {/* Days View */}
      {view === 'days' && (
        <>
          <div style={styles.weekdays}>
            {orderedDays.map((day) => (
              <div key={day} style={styles.weekdayCell}>
                {day}
              </div>
            ))}
          </div>

          <div style={styles.days}>
            {calendarDays.map(({ date, isCurrentMonth }, index) => (
              <button
                key={index}
                style={getDayCellStyles(date, isCurrentMonth)}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => setHoveredDay(date)}
                onMouseLeave={() => setHoveredDay(null)}
                disabled={isDateDisabled(date)}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Months View */}
      {view === 'months' && (
        <div style={styles.months}>
          {MONTHS_SHORT.map((month, index) => (
            <button
              key={month}
              style={{
                ...styles.monthCell,
                ...(index === currentMonth && styles.monthCellSelected),
              }}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {/* Years View */}
      {view === 'years' && (
        <div style={styles.years}>
          {years.map((year) => (
            <button
              key={year}
              style={{
                ...styles.yearCell,
                ...(year === currentYear && styles.yearCellSelected),
              }}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      {(showToday || showClear) && (
        <div style={styles.footer}>
          {showToday && (
            <button style={{ ...styles.footerButton, ...styles.todayButton }} onClick={handleTodayClick}>
              Today
            </button>
          )}
          {showClear && (
            <button style={{ ...styles.footerButton, ...styles.clearButton }} onClick={handleClearClick}>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (inline) {
    return (
      <div className={className}>
        {renderCalendar()}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          readOnly
          value={getDisplayValue()}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...styles.input,
            ...(isOpen && styles.inputFocused),
            ...(disabled && styles.inputDisabled),
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <span style={styles.inputIcon}>📅</span>
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          {renderCalendar()}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TIME PICKER COMPONENT
// ============================================================

export function TimePicker({
  value,
  defaultValue,
  onChange,
  minTime,
  maxTime,
  step = 1,
  use24Hours = true,
  showSeconds = false,
  disabled = false,
  placeholder = 'Select time',
  className,
}: TimePickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<TimeValue | null>(value || defaultValue || null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateTime = useCallback((field: keyof TimeValue, delta: number) => {
    setTime((prev) => {
      const current = prev || { hours: 0, minutes: 0, seconds: 0 };
      let newValue = (current[field] || 0) + delta;

      if (field === 'hours') {
        newValue = ((newValue % 24) + 24) % 24;
      } else {
        newValue = ((newValue % 60) + 60) % 60;
      }

      const updated = { ...current, [field]: newValue };
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  const setTimeField = useCallback((field: keyof TimeValue, value: number) => {
    setTime((prev) => {
      const current = prev || { hours: 0, minutes: 0, seconds: 0 };
      const updated = { ...current, [field]: value };
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayValue = formatTime(time, use24Hours, showSeconds);

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...styles.input,
            ...(isOpen && styles.inputFocused),
            ...(disabled && styles.inputDisabled),
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <span style={styles.inputIcon}>🕐</span>
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.timePicker}>
            {/* Hours */}
            <div style={styles.timeSpinner}>
              <button style={styles.spinnerButton} onClick={() => updateTime('hours', 1)}>▲</button>
              <input
                type="text"
                value={(time?.hours || 0).toString().padStart(2, '0')}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 0 && val <= 23) {
                    setTimeField('hours', val);
                  }
                }}
                style={styles.timeInput}
              />
              <button style={styles.spinnerButton} onClick={() => updateTime('hours', -1)}>▼</button>
            </div>

            <span style={styles.timeSeparator}>:</span>

            {/* Minutes */}
            <div style={styles.timeSpinner}>
              <button style={styles.spinnerButton} onClick={() => updateTime('minutes', step)}>▲</button>
              <input
                type="text"
                value={(time?.minutes || 0).toString().padStart(2, '0')}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 0 && val <= 59) {
                    setTimeField('minutes', val);
                  }
                }}
                style={styles.timeInput}
              />
              <button style={styles.spinnerButton} onClick={() => updateTime('minutes', -step)}>▼</button>
            </div>

            {/* Seconds */}
            {showSeconds && (
              <>
                <span style={styles.timeSeparator}>:</span>
                <div style={styles.timeSpinner}>
                  <button style={styles.spinnerButton} onClick={() => updateTime('seconds', 1)}>▲</button>
                  <input
                    type="text"
                    value={(time?.seconds || 0).toString().padStart(2, '0')}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0 && val <= 59) {
                        setTimeField('seconds', val);
                      }
                    }}
                    style={styles.timeInput}
                  />
                  <button style={styles.spinnerButton} onClick={() => updateTime('seconds', -1)}>▼</button>
                </div>
              </>
            )}

            {/* AM/PM Toggle */}
            {!use24Hours && (
              <div style={styles.periodToggle}>
                <button
                  style={{
                    ...styles.periodButton,
                    ...styles.periodButtonTop,
                    ...((time?.hours || 0) < 12 && styles.periodButtonActive),
                  }}
                  onClick={() => {
                    if ((time?.hours || 0) >= 12) {
                      setTimeField('hours', (time?.hours || 0) - 12);
                    }
                  }}
                >
                  AM
                </button>
                <button
                  style={{
                    ...styles.periodButton,
                    ...styles.periodButtonBottom,
                    ...((time?.hours || 0) >= 12 && styles.periodButtonActive),
                  }}
                  onClick={() => {
                    if ((time?.hours || 0) < 12) {
                      setTimeField('hours', (time?.hours || 0) + 12);
                    }
                  }}
                >
                  PM
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DATE TIME PICKER COMPONENT
// ============================================================

export function DateTimePicker({
  value,
  defaultValue,
  onChange,
  showTime = true,
  timeProps,
  ...dateProps
}: DateTimePickerProps): JSX.Element {
  const [date, setDate] = useState<Date | null>(value || defaultValue || null);
  const [time, setTime] = useState<TimeValue | null>(() => {
    const d = value || defaultValue;
    if (d) {
      return {
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: d.getSeconds(),
      };
    }
    return null;
  });

  const handleDateChange = useCallback((newDate: Date | null) => {
    setDate(newDate);
    if (newDate && time) {
      const combined = new Date(newDate);
      combined.setHours(time.hours, time.minutes, time.seconds || 0);
      onChange?.(combined);
    } else {
      onChange?.(newDate);
    }
  }, [time, onChange]);

  const handleTimeChange = useCallback((newTime: TimeValue | null) => {
    setTime(newTime);
    if (date && newTime) {
      const combined = new Date(date);
      combined.setHours(newTime.hours, newTime.minutes, newTime.seconds || 0);
      onChange?.(combined);
    }
  }, [date, onChange]);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      <DatePicker
        {...dateProps}
        value={date}
        onChange={handleDateChange}
      />
      {showTime && (
        <TimePicker
          {...timeProps}
          value={time}
          onChange={handleTimeChange}
        />
      )}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  DatePickerMode,
  CalendarView,
  DateValue,
  TimeValue,
  DateRange,
  DatePickerProps,
  TimePickerProps,
  DateTimePickerProps,
};

export {
  formatDate,
  formatTime,
  parseTimeString,
  isSameDay,
  isToday,
  getDaysInMonth,
  getWeekNumber,
  MONTHS_LONG,
  MONTHS_SHORT,
  DAYS_OF_WEEK_LONG,
  DAYS_OF_WEEK_SHORT,
};

export default {
  DatePicker,
  TimePicker,
  DateTimePicker,
};
