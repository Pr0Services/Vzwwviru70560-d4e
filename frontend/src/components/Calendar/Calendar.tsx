// CHE·NU™ Calendar & Scheduler Components
// Comprehensive calendar with events, scheduling, and multiple views

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'year';
type EventRecurrence = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  category?: string;
  location?: string;
  attendees?: Array<{
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    status?: 'accepted' | 'declined' | 'tentative' | 'pending';
  }>;
  recurrence?: EventRecurrence;
  reminders?: number[];
  isPrivate?: boolean;
  meta?: Record<string, any>;
}

interface CalendarContextValue {
  currentDate: Date;
  view: CalendarView;
  events: CalendarEvent[];
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  navigateToday: () => void;
  navigatePrev: () => void;
  navigateNext: () => void;
}

interface CalendarProps {
  events?: CalendarEvent[];
  defaultView?: CalendarView;
  defaultDate?: Date;
  views?: CalendarView[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minTime?: number;
  maxTime?: number;
  slotDuration?: number;
  showWeekNumbers?: boolean;
  showAllDayRow?: boolean;
  selectable?: boolean;
  editable?: boolean;
  onSelectDate?: (date: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDoubleClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
  onNavigate?: (date: Date, view: CalendarView) => void;
  renderEvent?: (event: CalendarEvent) => ReactNode;
  renderDayHeader?: (date: Date) => ReactNode;
  className?: string;
}

interface MiniCalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  highlightedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  className?: string;
}

interface TimeSlotPickerProps {
  date: Date;
  selectedSlot?: { start: Date; end: Date };
  onSelectSlot?: (start: Date, end: Date) => void;
  availableSlots?: Array<{ start: Date; end: Date }>;
  slotDuration?: number;
  minTime?: number;
  maxTime?: number;
  className?: string;
}

interface EventFormProps {
  event?: Partial<CalendarEvent>;
  onSubmit: (event: CalendarEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
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

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const EVENT_COLORS = [
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795',
  '#3182CE', '#5A67D8', '#805AD5', '#D53F8C', BRAND.sacredGold,
];

const DEFAULT_MIN_TIME = 8;
const DEFAULT_MAX_TIME = 20;
const DEFAULT_SLOT_DURATION = 30;

// ============================================================
// CONTEXT
// ============================================================

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendar(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within Calendar');
  }
  return context;
}

// ============================================================
// UTILITIES
// ============================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const start = startOfWeek(date, weekStartsOn);
  start.setDate(start.getDate() + 6);
  start.setHours(23, 59, 59, 999);
  return start;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateRange(start: Date, end: Date): string {
  if (isSameDay(start, end)) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  return `${start.toLocaleDateString()} ${formatTime(start)} - ${end.toLocaleDateString()} ${formatTime(end)}`;
}

function getMonthDays(date: Date, weekStartsOn: number = 0): Date[] {
  const start = startOfWeek(startOfMonth(date), weekStartsOn);
  const end = endOfWeek(endOfMonth(date), weekStartsOn);
  
  const days: Date[] = [];
  let current = new Date(start);
  
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return days;
}

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      isSameDay(eventStart, date) ||
      isSameDay(eventEnd, date) ||
      (eventStart < date && eventEnd > date)
    );
  });
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  headerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: '14px',
    color: BRAND.uiSlate,
  },

  navButtonHover: {
    borderColor: BRAND.sacredGold,
    color: BRAND.sacredGold,
  },

  todayButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    transition: 'all 0.15s',
  },

  todayButtonHover: {
    borderColor: BRAND.sacredGold,
    color: BRAND.sacredGold,
  },

  viewSelector: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
  },

  viewButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    transition: 'all 0.15s',
  },

  viewButtonActive: {
    backgroundColor: '#ffffff',
    color: BRAND.uiSlate,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  // Month view styles
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
  },

  weekHeader: {
    display: 'contents',
  },

  weekDay: {
    padding: '12px 8px',
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
  },

  weekNumber: {
    padding: '8px',
    fontSize: '11px',
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    textAlign: 'center' as const,
  },

  dayCell: {
    minHeight: '100px',
    padding: '4px',
    borderRight: `1px solid ${BRAND.ancientStone}08`,
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  dayCellHover: {
    backgroundColor: `${BRAND.sacredGold}08`,
  },

  dayCellToday: {
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
  },

  dayCellSelected: {
    backgroundColor: `${BRAND.sacredGold}15`,
  },

  dayCellOtherMonth: {
    backgroundColor: BRAND.softSand,
    opacity: 0.6,
  },

  dayCellWeekend: {
    backgroundColor: `${BRAND.ancientStone}05`,
  },

  dayNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    borderRadius: '50%',
  },

  dayNumberToday: {
    backgroundColor: BRAND.cenoteTurquoise,
    color: '#ffffff',
  },

  dayEvents: {
    marginTop: '4px',
  },

  dayEvent: {
    padding: '2px 6px',
    marginBottom: '2px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    color: '#ffffff',
    cursor: 'pointer',
  },

  dayEventMore: {
    padding: '2px 6px',
    fontSize: '11px',
    color: BRAND.ancientStone,
    cursor: 'pointer',
  },

  // Week/Day view styles
  timeGrid: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  timeColumn: {
    width: '60px',
    flexShrink: 0,
    borderRight: `1px solid ${BRAND.ancientStone}10`,
  },

  timeSlot: {
    height: '60px',
    padding: '4px 8px',
    fontSize: '11px',
    color: BRAND.ancientStone,
    textAlign: 'right' as const,
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  dayColumns: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
  },

  dayColumn: {
    flex: 1,
    minWidth: '120px',
    borderRight: `1px solid ${BRAND.ancientStone}10`,
    position: 'relative' as const,
  },

  dayColumnHeader: {
    padding: '12px 8px',
    textAlign: 'center' as const,
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
  },

  dayColumnHeaderDay: {
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  dayColumnHeaderDate: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginTop: '4px',
  },

  dayColumnHeaderToday: {
    color: BRAND.cenoteTurquoise,
  },

  allDayRow: {
    padding: '8px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    minHeight: '40px',
    backgroundColor: BRAND.softSand,
  },

  hourSlot: {
    height: '60px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
    position: 'relative' as const,
  },

  hourSlotHalf: {
    borderBottom: `1px dashed ${BRAND.ancientStone}05`,
    height: '30px',
  },

  // Event in time grid
  timeEvent: {
    position: 'absolute' as const,
    left: '4px',
    right: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#ffffff',
    overflow: 'hidden',
    cursor: 'pointer',
    zIndex: 1,
  },

  timeEventTitle: {
    fontWeight: 600,
    marginBottom: '2px',
  },

  timeEventTime: {
    fontSize: '11px',
    opacity: 0.9,
  },

  // Agenda view styles
  agendaList: {
    padding: '16px',
  },

  agendaGroup: {
    marginBottom: '24px',
  },

  agendaDate: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: BRAND.softSand,
    borderRadius: '6px',
  },

  agendaDateToday: {
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
    color: BRAND.cenoteTurquoise,
  },

  agendaEvent: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  agendaEventHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },

  agendaEventColor: {
    width: '4px',
    borderRadius: '2px',
    flexShrink: 0,
  },

  agendaEventContent: {
    flex: 1,
  },

  agendaEventTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  agendaEventTime: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  agendaEventLocation: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Mini calendar styles
  miniCalendar: {
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  miniCalendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  miniCalendarTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  miniCalendarNav: {
    display: 'flex',
    gap: '4px',
  },

  miniCalendarNavButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '12px',
    color: BRAND.ancientStone,
    transition: 'all 0.15s',
  },

  miniCalendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },

  miniCalendarWeekDay: {
    padding: '4px',
    textAlign: 'center' as const,
    fontSize: '10px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  miniCalendarDay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    fontSize: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    color: BRAND.uiSlate,
  },

  miniCalendarDayHover: {
    backgroundColor: BRAND.softSand,
  },

  miniCalendarDayToday: {
    fontWeight: 600,
    color: BRAND.cenoteTurquoise,
  },

  miniCalendarDaySelected: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  miniCalendarDayOtherMonth: {
    color: BRAND.ancientStone,
    opacity: 0.5,
  },

  miniCalendarDayHighlighted: {
    position: 'relative' as const,
  },

  miniCalendarDayDot: {
    position: 'absolute' as const,
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: BRAND.cenoteTurquoise,
  },

  // Time slot picker styles
  timePicker: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    maxHeight: '300px',
    overflowY: 'auto' as const,
  },

  timePickerSlot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 16px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}20`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  timePickerSlotHover: {
    borderColor: BRAND.sacredGold,
    backgroundColor: `${BRAND.sacredGold}08`,
  },

  timePickerSlotSelected: {
    backgroundColor: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  timePickerSlotUnavailable: {
    opacity: 0.4,
    cursor: 'not-allowed',
    backgroundColor: BRAND.softSand,
  },
};

// ============================================================
// MINI CALENDAR COMPONENT
// ============================================================

export function MiniCalendar({
  selectedDate,
  onSelectDate,
  highlightedDates = [],
  minDate,
  maxDate,
  weekStartsOn = 0,
  showWeekNumbers = false,
  className,
}: MiniCalendarProps): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const days = useMemo(() => getMonthDays(currentMonth, weekStartsOn), [currentMonth, weekStartsOn]);

  const weekDays = useMemo(() => {
    const days = [...DAYS_OF_WEEK];
    for (let i = 0; i < weekStartsOn; i++) {
      days.push(days.shift()!);
    }
    return days;
  }, [weekStartsOn]);

  const isHighlighted = useCallback((date: Date) => {
    return highlightedDates.some((d) => isSameDay(d, date));
  }, [highlightedDates]);

  const isDisabled = useCallback((date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  return (
    <div style={styles.miniCalendar} className={className}>
      {/* Header */}
      <div style={styles.miniCalendarHeader}>
        <span style={styles.miniCalendarTitle}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <div style={styles.miniCalendarNav}>
          <button
            style={styles.miniCalendarNavButton}
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            ‹
          </button>
          <button
            style={styles.miniCalendarNavButton}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            ›
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.miniCalendarGrid}>
        {/* Week days */}
        {weekDays.map((day) => (
          <div key={day} style={styles.miniCalendarWeekDay}>
            {day.charAt(0)}
          </div>
        ))}

        {/* Days */}
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDay = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isHovered = hoveredDay && isSameDay(day, hoveredDay);
          const hasHighlight = isHighlighted(day);
          const disabled = isDisabled(day);

          return (
            <div
              key={index}
              style={{
                ...styles.miniCalendarDay,
                ...(!isCurrentMonth && styles.miniCalendarDayOtherMonth),
                ...(isTodayDay && styles.miniCalendarDayToday),
                ...(isSelected && styles.miniCalendarDaySelected),
                ...(isHovered && !isSelected && styles.miniCalendarDayHover),
                ...(hasHighlight && styles.miniCalendarDayHighlighted),
                ...(disabled && { opacity: 0.3, cursor: 'not-allowed' }),
              }}
              onClick={() => !disabled && onSelectDate?.(day)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day.getDate()}
              {hasHighlight && !isSelected && <div style={styles.miniCalendarDayDot} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TIME SLOT PICKER COMPONENT
// ============================================================

export function TimeSlotPicker({
  date,
  selectedSlot,
  onSelectSlot,
  availableSlots,
  slotDuration = DEFAULT_SLOT_DURATION,
  minTime = DEFAULT_MIN_TIME,
  maxTime = DEFAULT_MAX_TIME,
  className,
}: TimeSlotPickerProps): JSX.Element {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const slots = useMemo(() => {
    const result: Array<{ start: Date; end: Date }> = [];
    const baseDate = new Date(date);
    baseDate.setHours(minTime, 0, 0, 0);

    while (baseDate.getHours() < maxTime || (baseDate.getHours() === maxTime && baseDate.getMinutes() === 0)) {
      const start = new Date(baseDate);
      const end = new Date(baseDate);
      end.setMinutes(end.getMinutes() + slotDuration);

      result.push({ start, end });
      baseDate.setMinutes(baseDate.getMinutes() + slotDuration);
    }

    return result;
  }, [date, minTime, maxTime, slotDuration]);

  const isAvailable = useCallback((slot: { start: Date; end: Date }) => {
    if (!availableSlots) return true;
    return availableSlots.some(
      (available) =>
        slot.start >= available.start && slot.end <= available.end
    );
  }, [availableSlots]);

  const isSelected = useCallback((slot: { start: Date; end: Date }) => {
    if (!selectedSlot) return false;
    return (
      slot.start.getTime() === selectedSlot.start.getTime() &&
      slot.end.getTime() === selectedSlot.end.getTime()
    );
  }, [selectedSlot]);

  return (
    <div style={styles.timePicker} className={className}>
      {slots.map((slot, index) => {
        const available = isAvailable(slot);
        const selected = isSelected(slot);
        const hovered = hoveredSlot === index;

        return (
          <div
            key={index}
            style={{
              ...styles.timePickerSlot,
              ...(hovered && available && !selected && styles.timePickerSlotHover),
              ...(selected && styles.timePickerSlotSelected),
              ...(!available && styles.timePickerSlotUnavailable),
            }}
            onClick={() => available && onSelectSlot?.(slot.start, slot.end)}
            onMouseEnter={() => setHoveredSlot(index)}
            onMouseLeave={() => setHoveredSlot(null)}
          >
            {formatTime(slot.start)} - {formatTime(slot.end)}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MONTH VIEW COMPONENT
// ============================================================

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  weekStartsOn: number;
  showWeekNumbers: boolean;
  onSelectDate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => ReactNode;
}

function MonthView({
  currentDate,
  events,
  selectedDate,
  weekStartsOn,
  showWeekNumbers,
  onSelectDate,
  onEventClick,
  renderEvent,
}: MonthViewProps): JSX.Element {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const days = useMemo(() => getMonthDays(currentDate, weekStartsOn), [currentDate, weekStartsOn]);

  const weekDays = useMemo(() => {
    const daysArr = [...DAYS_OF_WEEK];
    for (let i = 0; i < weekStartsOn; i++) {
      daysArr.push(daysArr.shift()!);
    }
    return daysArr;
  }, [weekStartsOn]);

  return (
    <div style={styles.monthGrid}>
      {/* Week header */}
      {showWeekNumbers && <div style={styles.weekDay}>Wk</div>}
      {weekDays.map((day) => (
        <div key={day} style={styles.weekDay}>
          {day}
        </div>
      ))}

      {/* Days */}
      {days.map((day, index) => {
        const dayEvents = getEventsForDate(events, day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isTodayDay = isToday(day);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isHovered = hoveredDay && isSameDay(day, hoveredDay);
        const isWeekendDay = isWeekend(day);

        // Week number at start of each week
        const showWeekNum = showWeekNumbers && index % 7 === 0;

        return (
          <React.Fragment key={index}>
            {showWeekNum && (
              <div style={styles.weekNumber}>{getWeekNumber(day)}</div>
            )}
            <div
              style={{
                ...styles.dayCell,
                ...(isHovered && styles.dayCellHover),
                ...(isTodayDay && styles.dayCellToday),
                ...(isSelected && styles.dayCellSelected),
                ...(!isCurrentMonth && styles.dayCellOtherMonth),
                ...(isWeekendDay && isCurrentMonth && styles.dayCellWeekend),
              }}
              onClick={() => onSelectDate(day)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                style={{
                  ...styles.dayNumber,
                  ...(isTodayDay && styles.dayNumberToday),
                }}
              >
                {day.getDate()}
              </div>

              <div style={styles.dayEvents}>
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    style={{
                      ...styles.dayEvent,
                      backgroundColor: event.color || BRAND.cenoteTurquoise,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {renderEvent ? renderEvent(event) : event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div style={styles.dayEventMore}>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// AGENDA VIEW COMPONENT
// ============================================================

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

function AgendaView({ currentDate, events, onEventClick }: AgendaViewProps): JSX.Element {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // Group events by date for the next 30 days
  const groupedEvents = useMemo(() => {
    const groups: Array<{ date: Date; events: CalendarEvent[] }> = [];
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      const dayEvents = getEventsForDate(events, date).sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

      if (dayEvents.length > 0) {
        groups.push({ date, events: dayEvents });
      }
    }

    return groups;
  }, [currentDate, events]);

  return (
    <div style={styles.agendaList}>
      {groupedEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: BRAND.ancientStone }}>
          No upcoming events
        </div>
      ) : (
        groupedEvents.map(({ date, events: dayEvents }) => (
          <div key={date.toISOString()} style={styles.agendaGroup}>
            <div
              style={{
                ...styles.agendaDate,
                ...(isToday(date) && styles.agendaDateToday),
              }}
            >
              {isToday(date) ? 'Today' : date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {dayEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  ...styles.agendaEvent,
                  ...(hoveredEvent === event.id && styles.agendaEventHover),
                }}
                onClick={() => onEventClick(event)}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div
                  style={{
                    ...styles.agendaEventColor,
                    backgroundColor: event.color || BRAND.cenoteTurquoise,
                  }}
                />
                <div style={styles.agendaEventContent}>
                  <div style={styles.agendaEventTitle}>{event.title}</div>
                  <div style={styles.agendaEventTime}>
                    {event.allDay ? 'All day' : formatDateRange(new Date(event.start), new Date(event.end))}
                  </div>
                  {event.location && (
                    <div style={styles.agendaEventLocation}>
                      📍 {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ============================================================
// MAIN CALENDAR COMPONENT
// ============================================================

export function Calendar({
  events = [],
  defaultView = 'month',
  defaultDate = new Date(),
  views = ['month', 'week', 'day', 'agenda'],
  weekStartsOn = 0,
  minTime = DEFAULT_MIN_TIME,
  maxTime = DEFAULT_MAX_TIME,
  slotDuration = DEFAULT_SLOT_DURATION,
  showWeekNumbers = false,
  showAllDayRow = true,
  selectable = true,
  editable = false,
  onSelectDate,
  onSelectEvent,
  onEventClick,
  onEventDoubleClick,
  onEventDrop,
  onEventResize,
  onRangeSelect,
  onNavigate,
  renderEvent,
  renderDayHeader,
  className,
}: CalendarProps): JSX.Element {
  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [view, setView] = useState<CalendarView>(defaultView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [todayHovered, setTodayHovered] = useState(false);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);

  const navigateToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    onNavigate?.(today, view);
  }, [view, onNavigate]);

  const navigatePrev = useCallback(() => {
    let newDate: Date;
    switch (view) {
      case 'month':
        newDate = addMonths(currentDate, -1);
        break;
      case 'week':
        newDate = addDays(currentDate, -7);
        break;
      case 'day':
        newDate = addDays(currentDate, -1);
        break;
      case 'year':
        newDate = addYears(currentDate, -1);
        break;
      default:
        newDate = addMonths(currentDate, -1);
    }
    setCurrentDate(newDate);
    onNavigate?.(newDate, view);
  }, [currentDate, view, onNavigate]);

  const navigateNext = useCallback(() => {
    let newDate: Date;
    switch (view) {
      case 'month':
        newDate = addMonths(currentDate, 1);
        break;
      case 'week':
        newDate = addDays(currentDate, 7);
        break;
      case 'day':
        newDate = addDays(currentDate, 1);
        break;
      case 'year':
        newDate = addYears(currentDate, 1);
        break;
      default:
        newDate = addMonths(currentDate, 1);
    }
    setCurrentDate(newDate);
    onNavigate?.(newDate, view);
  }, [currentDate, view, onNavigate]);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  }, [onSelectDate]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
    onSelectEvent?.(event);
  }, [onEventClick, onSelectEvent]);

  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView);
    onNavigate?.(currentDate, newView);
  }, [currentDate, onNavigate]);

  const getHeaderTitle = useCallback(() => {
    switch (view) {
      case 'month':
        return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week':
        const weekStart = startOfWeek(currentDate, weekStartsOn);
        const weekEnd = endOfWeek(currentDate, weekStartsOn);
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        }
        return `${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'agenda':
        return 'Upcoming Events';
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  }, [view, currentDate, weekStartsOn]);

  const contextValue: CalendarContextValue = {
    currentDate,
    view,
    events,
    selectedDate,
    selectedEvent,
    setCurrentDate,
    setView,
    setSelectedDate,
    setSelectedEvent,
    navigateToday,
    navigatePrev,
    navigateNext,
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      <div style={styles.container} className={className}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerNav}>
            <button
              style={{
                ...styles.todayButton,
                ...(todayHovered && styles.todayButtonHover),
              }}
              onClick={navigateToday}
              onMouseEnter={() => setTodayHovered(true)}
              onMouseLeave={() => setTodayHovered(false)}
            >
              Today
            </button>
            <button
              style={{
                ...styles.navButton,
                ...(prevHovered && styles.navButtonHover),
              }}
              onClick={navigatePrev}
              onMouseEnter={() => setPrevHovered(true)}
              onMouseLeave={() => setPrevHovered(false)}
            >
              ‹
            </button>
            <button
              style={{
                ...styles.navButton,
                ...(nextHovered && styles.navButtonHover),
              }}
              onClick={navigateNext}
              onMouseEnter={() => setNextHovered(true)}
              onMouseLeave={() => setNextHovered(false)}
            >
              ›
            </button>
            <span style={styles.headerTitle}>{getHeaderTitle()}</span>
          </div>

          {/* View selector */}
          <div style={styles.viewSelector}>
            {views.map((v) => (
              <button
                key={v}
                style={{
                  ...styles.viewButton,
                  ...(view === v && styles.viewButtonActive),
                }}
                onClick={() => handleViewChange(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar view */}
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            weekStartsOn={weekStartsOn}
            showWeekNumbers={showWeekNumbers}
            onSelectDate={handleSelectDate}
            onEventClick={handleEventClick}
            renderEvent={renderEvent}
          />
        )}

        {view === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </div>
    </CalendarContext.Provider>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  CalendarView,
  EventRecurrence,
  CalendarEvent,
  CalendarContextValue,
  CalendarProps,
  MiniCalendarProps,
  TimeSlotPickerProps,
  EventFormProps,
};

export {
  DAYS_OF_WEEK,
  MONTHS,
  EVENT_COLORS,
  DEFAULT_MIN_TIME,
  DEFAULT_MAX_TIME,
  DEFAULT_SLOT_DURATION,
  isSameDay,
  isSameMonth,
  isToday,
  isWeekend,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addYears,
  getWeekNumber,
  formatTime,
  formatDateRange,
  getMonthDays,
  getEventsForDate,
};

export default {
  Calendar,
  MiniCalendar,
  TimeSlotPicker,
  useCalendar,
};
