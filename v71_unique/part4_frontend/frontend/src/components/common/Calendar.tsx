/**
 * CHE·NU™ Calendar, DatePicker & TimePicker Components
 * 
 * Date and time selection components with full localization support.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CALENDAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  locale?: string;
  showWeekNumbers?: boolean;
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
  onMonthChange?: (month: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  locale = 'en-US',
  showWeekNumbers = false,
  firstDayOfWeek = 1,
  onMonthChange,
}) => {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const weekDays = useMemo(() => {
    const days = [];
    const baseDate = new Date(2024, 0, firstDayOfWeek === 0 ? 7 : 1);
    for (let i = 0; i < 7; i++) {
      days.push(
        new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
          new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000)
        )
      );
    }
    return days;
  }, [locale, firstDayOfWeek]);

  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, i))
    );
  }, [locale]);

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust for first day of week
    let startOffset = firstDay.getDay() - firstDayOfWeek;
    if (startOffset < 0) startOffset += 7;
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  }, [year, month, firstDayOfWeek]);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
    return disabledDates.some(d => isSameDay(d, date));
  };

  const isHighlighted = (date: Date): boolean => {
    return highlightedDates.some(d => isSameDay(d, date));
  };

  const isToday = (date: Date): boolean => isSameDay(date, new Date());
  const isSelected = (date: Date): boolean => value ? isSameDay(date, value) : false;

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange?.(date);
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    setViewDate(new Date(year, monthIndex));
    setViewMode('days');
  };

  const handleYearClick = (selectedYear: number) => {
    setViewDate(new Date(selectedYear, month));
    setViewMode('months');
  };

  const renderDaysView = () => (
    <>
      <div className="calendar__weekdays">
        {showWeekNumbers && <span className="calendar__weekday calendar__weekday--week-num">#</span>}
        {weekDays.map(day => (
          <span key={day} className="calendar__weekday">{day}</span>
        ))}
      </div>
      
      <div className="calendar__days">
        {calendarDays.map((date, index) => {
          // Add week number at start of each week
          const weekStart = (index % 7 === 0 && showWeekNumbers);
          
          return (
            <React.Fragment key={index}>
              {weekStart && date && (
                <span className="calendar__week-number">
                  {getWeekNumber(date)}
                </span>
              )}
              {weekStart && !date && <span className="calendar__week-number" />}
              
              {date ? (
                <button
                  className={`
                    calendar__day
                    ${isToday(date) ? 'calendar__day--today' : ''}
                    ${isSelected(date) ? 'calendar__day--selected' : ''}
                    ${isDateDisabled(date) ? 'calendar__day--disabled' : ''}
                    ${isHighlighted(date) ? 'calendar__day--highlighted' : ''}
                  `}
                  onClick={() => handleDateClick(date)}
                  disabled={isDateDisabled(date)}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span className="calendar__day calendar__day--empty" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );

  const renderMonthsView = () => (
    <div className="calendar__months">
      {monthNames.map((name, index) => (
        <button
          key={index}
          className={`calendar__month ${month === index ? 'calendar__month--selected' : ''}`}
          onClick={() => handleMonthClick(index)}
        >
          {name.slice(0, 3)}
        </button>
      ))}
    </div>
  );

  const renderYearsView = () => {
    const startYear = Math.floor(year / 10) * 10 - 1;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);
    
    return (
      <div className="calendar__years">
        {years.map(y => (
          <button
            key={y}
            className={`calendar__year ${year === y ? 'calendar__year--selected' : ''}`}
            onClick={() => handleYearClick(y)}
          >
            {y}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button className="calendar__nav" onClick={handlePrevMonth}>‹</button>
        
        <div className="calendar__title">
          <button 
            className="calendar__title-btn"
            onClick={() => setViewMode(viewMode === 'days' ? 'months' : viewMode === 'months' ? 'years' : 'days')}
          >
            {viewMode === 'days' && `${monthNames[month]} ${year}`}
            {viewMode === 'months' && year}
            {viewMode === 'years' && `${Math.floor(year / 10) * 10} - ${Math.floor(year / 10) * 10 + 9}`}
          </button>
        </div>
        
        <button className="calendar__nav" onClick={handleNextMonth}>›</button>
      </div>
      
      <div className="calendar__body">
        {viewMode === 'days' && renderDaysView()}
        {viewMode === 'months' && renderMonthsView()}
        {viewMode === 'years' && renderYearsView()}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DATE PICKER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface DatePickerProps extends Omit<CalendarProps, 'value' | 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  format = 'short',
  clearable = true,
  disabled = false,
  error,
  size = 'md',
  locale = 'en-US',
  ...calendarProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedValue = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: format as any }).format(value)
    : '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div ref={containerRef} className={`date-picker date-picker--${size}`}>
      <button
        className={`
          date-picker__trigger
          ${isOpen ? 'date-picker__trigger--open' : ''}
          ${disabled ? 'date-picker__trigger--disabled' : ''}
          ${error ? 'date-picker__trigger--error' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="date-picker__icon">📅</span>
        <span className={`date-picker__value ${!value ? 'date-picker__value--placeholder' : ''}`}>
          {value ? formattedValue : placeholder}
        </span>
        {clearable && value && (
          <button className="date-picker__clear" onClick={handleClear}>×</button>
        )}
      </button>
      
      {error && <span className="date-picker__error">{error}</span>}
      
      {isOpen && (
        <div className="date-picker__dropdown">
          <Calendar
            value={value || undefined}
            onChange={handleSelect}
            locale={locale}
            {...calendarProps}
          />
        </div>
      )}
    </div>
  );
};

// Date Range Picker
export interface DateRangePickerProps extends Omit<CalendarProps, 'value' | 'onChange'> {
  value?: [Date | null, Date | null];
  onChange?: (range: [Date | null, Date | null]) => void;
  placeholder?: [string, string];
  disabled?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = [null, null],
  onChange,
  placeholder = ['Start date', 'End date'],
  disabled = false,
  locale = 'en-US',
  ...calendarProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => 
    date ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date) : '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    if (selecting === 'start') {
      onChange?.([date, value[1]]);
      setSelecting('end');
    } else {
      if (value[0] && date < value[0]) {
        onChange?.([date, value[0]]);
      } else {
        onChange?.([value[0], date]);
      }
      setIsOpen(false);
      setSelecting('start');
    }
  };

  return (
    <div ref={containerRef} className="date-range-picker">
      <button
        className={`date-range-picker__trigger ${isOpen ? 'date-range-picker__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="date-range-picker__icon">📅</span>
        <span className={`date-range-picker__value ${!value[0] ? 'date-range-picker__value--placeholder' : ''}`}>
          {value[0] ? formatDate(value[0]) : placeholder[0]}
        </span>
        <span className="date-range-picker__separator">→</span>
        <span className={`date-range-picker__value ${!value[1] ? 'date-range-picker__value--placeholder' : ''}`}>
          {value[1] ? formatDate(value[1]) : placeholder[1]}
        </span>
      </button>
      
      {isOpen && (
        <div className="date-range-picker__dropdown">
          <div className="date-range-picker__header">
            <span className={selecting === 'start' ? 'active' : ''}>Start: {formatDate(value[0]) || '—'}</span>
            <span className={selecting === 'end' ? 'active' : ''}>End: {formatDate(value[1]) || '—'}</span>
          </div>
          <Calendar
            value={selecting === 'start' ? value[0] || undefined : value[1] || undefined}
            onChange={handleSelect}
            locale={locale}
            highlightedDates={value[0] && value[1] ? getDatesInRange(value[0], value[1]) : []}
            {...calendarProps}
          />
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TIME PICKER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface TimePickerProps {
  value?: string; // HH:mm format
  onChange?: (time: string) => void;
  min?: string;
  max?: string;
  step?: number; // minutes
  format?: '12h' | '24h';
  disabled?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  min = '00:00',
  max = '23:59',
  step = 30,
  format = '24h',
  disabled = false,
  placeholder = 'Select time',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [minHour, minMin] = min.split(':').map(Number);
    const [maxHour, maxMin] = max.split(':').map(Number);
    
    for (let h = minHour; h <= maxHour; h++) {
      for (let m = 0; m < 60; m += step) {
        if (h === minHour && m < minMin) continue;
        if (h === maxHour && m > maxMin) continue;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return slots;
  }, [min, max, step]);

  const formatTime = (time: string): string => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    if (format === '12h') {
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
    }
    return time;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (time: string) => {
    onChange?.(time);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`time-picker time-picker--${size}`}>
      <button
        className={`time-picker__trigger ${isOpen ? 'time-picker__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="time-picker__icon">🕐</span>
        <span className={`time-picker__value ${!value ? 'time-picker__value--placeholder' : ''}`}>
          {value ? formatTime(value) : placeholder}
        </span>
      </button>
      
      {isOpen && (
        <div className="time-picker__dropdown">
          <div className="time-picker__list">
            {timeSlots.map(time => (
              <button
                key={time}
                className={`time-picker__option ${time === value ? 'time-picker__option--selected' : ''}`}
                onClick={() => handleSelect(time)}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const CalendarStyles: React.FC = () => (
  <style>{`
    /* Calendar */
    .calendar {
      width: 280px;
      padding: 12px;
      background: white;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
    }

    .calendar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .calendar__nav {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--color-text-secondary, #6b7280);
      font-size: 18px;
      cursor: pointer;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
    }

    .calendar__nav:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
      color: var(--color-text-primary, #111827);
    }

    .calendar__title-btn {
      border: none;
      background: transparent;
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-primary, #111827);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm, 4px);
    }

    .calendar__title-btn:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .calendar__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      margin-bottom: 8px;
    }

    .calendar__weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-tertiary, #9ca3af);
      padding: 4px;
    }

    .calendar__weekday--week-num {
      color: var(--color-text-tertiary, #9ca3af);
      font-size: 10px;
    }

    .calendar__days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .calendar__week-number {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .calendar__day {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      cursor: pointer;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
    }

    .calendar__day:hover:not(:disabled) {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .calendar__day--empty {
      cursor: default;
    }

    .calendar__day--today {
      font-weight: 600;
      color: var(--color-primary, #6366f1);
    }

    .calendar__day--selected {
      background: var(--color-primary, #6366f1) !important;
      color: white !important;
    }

    .calendar__day--highlighted {
      background: rgba(99, 102, 241, 0.1);
    }

    .calendar__day--disabled {
      color: var(--color-text-tertiary, #9ca3af);
      cursor: not-allowed;
    }

    .calendar__months,
    .calendar__years {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .calendar__month,
    .calendar__year {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      cursor: pointer;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
    }

    .calendar__month:hover,
    .calendar__year:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .calendar__month--selected,
    .calendar__year--selected {
      background: var(--color-primary, #6366f1) !important;
      color: white !important;
    }

    /* Date Picker */
    .date-picker {
      position: relative;
      display: inline-block;
    }

    .date-picker__trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
      font-size: 14px;
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
      min-width: 160px;
    }

    .date-picker--sm .date-picker__trigger { padding: 6px 10px; font-size: 13px; }
    .date-picker--lg .date-picker__trigger { padding: 10px 14px; font-size: 15px; }

    .date-picker__trigger:hover {
      border-color: var(--color-primary, #6366f1);
    }

    .date-picker__trigger--open {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .date-picker__trigger--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .date-picker__trigger--error {
      border-color: var(--color-error, #ef4444);
    }

    .date-picker__icon {
      font-size: 16px;
    }

    .date-picker__value {
      flex: 1;
      text-align: left;
      color: var(--color-text-primary, #111827);
    }

    .date-picker__value--placeholder {
      color: var(--color-text-tertiary, #9ca3af);
    }

    .date-picker__clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border: none;
      background: var(--color-bg-tertiary, #e5e7eb);
      color: var(--color-text-secondary, #6b7280);
      font-size: 14px;
      border-radius: 50%;
      cursor: pointer;
    }

    .date-picker__clear:hover {
      background: var(--color-error, #ef4444);
      color: white;
    }

    .date-picker__error {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      color: var(--color-error, #ef4444);
    }

    .date-picker__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      z-index: 1000;
    }

    /* Date Range Picker */
    .date-range-picker {
      position: relative;
      display: inline-block;
    }

    .date-range-picker__trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
      font-size: 14px;
      cursor: pointer;
    }

    .date-range-picker__trigger:hover {
      border-color: var(--color-primary, #6366f1);
    }

    .date-range-picker__separator {
      color: var(--color-text-tertiary, #9ca3af);
    }

    .date-range-picker__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      z-index: 1000;
    }

    .date-range-picker__header {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--color-bg-secondary, #f9fafb);
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      font-size: 13px;
      color: var(--color-text-secondary, #6b7280);
    }

    .date-range-picker__header .active {
      color: var(--color-primary, #6366f1);
      font-weight: 500;
    }

    /* Time Picker */
    .time-picker {
      position: relative;
      display: inline-block;
    }

    .time-picker__trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
      font-size: 14px;
      cursor: pointer;
      min-width: 120px;
    }

    .time-picker--sm .time-picker__trigger { padding: 6px 10px; font-size: 13px; }
    .time-picker--lg .time-picker__trigger { padding: 10px 14px; font-size: 15px; }

    .time-picker__trigger:hover {
      border-color: var(--color-primary, #6366f1);
    }

    .time-picker__trigger--open {
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .time-picker__icon {
      font-size: 16px;
    }

    .time-picker__value {
      flex: 1;
      text-align: left;
      color: var(--color-text-primary, #111827);
    }

    .time-picker__value--placeholder {
      color: var(--color-text-tertiary, #9ca3af);
    }

    .time-picker__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      width: 100%;
      background: white;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      box-shadow: var(--shadow-lg, 0 10px 25px -5px rgba(0,0,0,0.1));
      z-index: 1000;
    }

    .time-picker__list {
      max-height: 200px;
      overflow-y: auto;
      padding: 4px;
    }

    .time-picker__option {
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: var(--color-text-primary, #111827);
      text-align: left;
      cursor: pointer;
      border-radius: var(--radius-sm, 4px);
    }

    .time-picker__option:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .time-picker__option--selected {
      background: var(--color-primary, #6366f1) !important;
      color: white !important;
    }

    /* Dark mode */
    [data-theme="dark"] .calendar {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .calendar__title-btn {
      color: #f9fafb;
    }

    [data-theme="dark"] .calendar__title-btn:hover,
    [data-theme="dark"] .calendar__nav:hover {
      background: #333;
    }

    [data-theme="dark"] .calendar__day {
      color: #f9fafb;
    }

    [data-theme="dark"] .calendar__day:hover:not(:disabled) {
      background: #333;
    }

    [data-theme="dark"] .calendar__month,
    [data-theme="dark"] .calendar__year {
      color: #f9fafb;
    }

    [data-theme="dark"] .calendar__month:hover,
    [data-theme="dark"] .calendar__year:hover {
      background: #333;
    }

    [data-theme="dark"] .date-picker__trigger,
    [data-theme="dark"] .date-range-picker__trigger,
    [data-theme="dark"] .time-picker__trigger {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .date-picker__value,
    [data-theme="dark"] .time-picker__value {
      color: #f9fafb;
    }

    [data-theme="dark"] .time-picker__dropdown {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .time-picker__option {
      color: #f9fafb;
    }

    [data-theme="dark"] .time-picker__option:hover {
      background: #333;
    }
  `}</style>
);

export default {
  Calendar,
  DatePicker,
  DateRangePicker,
  TimePicker,
  CalendarStyles,
};
