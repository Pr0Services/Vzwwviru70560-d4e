// CHE·NU™ Date & Time Utilities
// Comprehensive date/time handling for the application

// ============================================================
// TYPES
// ============================================================

type DateInput = Date | string | number;

interface DateRange {
  start: Date;
  end: Date;
}

interface RelativeTimeOptions {
  addSuffix?: boolean;
  includeSeconds?: boolean;
  roundingMethod?: 'floor' | 'ceil' | 'round';
}

interface FormatOptions {
  locale?: string;
  timezone?: string;
}

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
  label?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAYS_MIN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ============================================================
// PARSING
// ============================================================

export function parseDate(input: DateInput): Date {
  if (input instanceof Date) {
    return new Date(input);
  }
  if (typeof input === 'number') {
    return new Date(input);
  }
  if (typeof input === 'string') {
    // ISO 8601 format
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    throw new Error(`Invalid date string: ${input}`);
  }
  throw new Error(`Invalid date input: ${input}`);
}

export function isValidDate(input: DateInput): boolean {
  try {
    const date = parseDate(input);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

export function toISOString(input: DateInput): string {
  return parseDate(input).toISOString();
}

export function toTimestamp(input: DateInput): number {
  return parseDate(input).getTime();
}

// ============================================================
// FORMATTING
// ============================================================

export function formatDate(
  input: DateInput,
  format: string = 'yyyy-MM-dd',
  options: FormatOptions = {}
): string {
  const date = parseDate(input);
  const { locale = 'en-US', timezone } = options;

  // If timezone is specified, adjust the date
  let adjustedDate = date;
  if (timezone) {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const values: Record<string, string> = {};
    parts.forEach((part) => {
      values[part.type] = part.value;
    });
    adjustedDate = new Date(
      `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
    );
  }

  const tokens: Record<string, () => string> = {
    yyyy: () => String(adjustedDate.getFullYear()),
    yy: () => String(adjustedDate.getFullYear()).slice(-2),
    MM: () => String(adjustedDate.getMonth() + 1).padStart(2, '0'),
    M: () => String(adjustedDate.getMonth() + 1),
    dd: () => String(adjustedDate.getDate()).padStart(2, '0'),
    d: () => String(adjustedDate.getDate()),
    HH: () => String(adjustedDate.getHours()).padStart(2, '0'),
    H: () => String(adjustedDate.getHours()),
    hh: () => String(adjustedDate.getHours() % 12 || 12).padStart(2, '0'),
    h: () => String(adjustedDate.getHours() % 12 || 12),
    mm: () => String(adjustedDate.getMinutes()).padStart(2, '0'),
    m: () => String(adjustedDate.getMinutes()),
    ss: () => String(adjustedDate.getSeconds()).padStart(2, '0'),
    s: () => String(adjustedDate.getSeconds()),
    SSS: () => String(adjustedDate.getMilliseconds()).padStart(3, '0'),
    a: () => (adjustedDate.getHours() < 12 ? 'AM' : 'PM'),
    MMMM: () => MONTHS[adjustedDate.getMonth()],
    MMM: () => MONTHS_SHORT[adjustedDate.getMonth()],
    EEEE: () => DAYS[adjustedDate.getDay()],
    EEE: () => DAYS_SHORT[adjustedDate.getDay()],
    EE: () => DAYS_MIN[adjustedDate.getDay()],
  };

  let result = format;
  Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .forEach((token) => {
      result = result.replace(new RegExp(token, 'g'), tokens[token]());
    });

  return result;
}

export function formatTime(input: DateInput, use24Hour: boolean = true): string {
  const date = parseDate(input);
  if (use24Hour) {
    return formatDate(date, 'HH:mm');
  }
  return formatDate(date, 'h:mm a');
}

export function formatDateTime(input: DateInput): string {
  return formatDate(input, 'MMM d, yyyy h:mm a');
}

export function formatDateShort(input: DateInput): string {
  return formatDate(input, 'MMM d, yyyy');
}

export function formatDateLong(input: DateInput): string {
  return formatDate(input, 'EEEE, MMMM d, yyyy');
}

// ============================================================
// RELATIVE TIME
// ============================================================

export function formatRelativeTime(
  input: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const { addSuffix = true, includeSeconds = false, roundingMethod = 'round' } = options;
  const date = parseDate(input);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs < 0;

  const round = (n: number) => {
    switch (roundingMethod) {
      case 'floor':
        return Math.floor(n);
      case 'ceil':
        return Math.ceil(n);
      default:
        return Math.round(n);
    }
  };

  let value: number;
  let unit: string;

  if (absDiff < MINUTE) {
    if (includeSeconds) {
      value = round(absDiff / SECOND);
      unit = value === 1 ? 'second' : 'seconds';
    } else {
      return isPast ? 'just now' : 'in a moment';
    }
  } else if (absDiff < HOUR) {
    value = round(absDiff / MINUTE);
    unit = value === 1 ? 'minute' : 'minutes';
  } else if (absDiff < DAY) {
    value = round(absDiff / HOUR);
    unit = value === 1 ? 'hour' : 'hours';
  } else if (absDiff < WEEK) {
    value = round(absDiff / DAY);
    unit = value === 1 ? 'day' : 'days';
  } else if (absDiff < MONTH) {
    value = round(absDiff / WEEK);
    unit = value === 1 ? 'week' : 'weeks';
  } else if (absDiff < YEAR) {
    value = round(absDiff / MONTH);
    unit = value === 1 ? 'month' : 'months';
  } else {
    value = round(absDiff / YEAR);
    unit = value === 1 ? 'year' : 'years';
  }

  const timeString = `${value} ${unit}`;
  
  if (!addSuffix) {
    return timeString;
  }
  
  return isPast ? `${timeString} ago` : `in ${timeString}`;
}

export function timeAgo(input: DateInput): string {
  return formatRelativeTime(input, { addSuffix: true });
}

export function timeUntil(input: DateInput): string {
  return formatRelativeTime(input, { addSuffix: true });
}

// ============================================================
// DATE MANIPULATION
// ============================================================

export function addDays(input: DateInput, days: number): Date {
  const date = parseDate(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function addWeeks(input: DateInput, weeks: number): Date {
  return addDays(input, weeks * 7);
}

export function addMonths(input: DateInput, months: number): Date {
  const date = parseDate(input);
  date.setMonth(date.getMonth() + months);
  return date;
}

export function addYears(input: DateInput, years: number): Date {
  const date = parseDate(input);
  date.setFullYear(date.getFullYear() + years);
  return date;
}

export function addHours(input: DateInput, hours: number): Date {
  const date = parseDate(input);
  date.setTime(date.getTime() + hours * HOUR);
  return date;
}

export function addMinutes(input: DateInput, minutes: number): Date {
  const date = parseDate(input);
  date.setTime(date.getTime() + minutes * MINUTE);
  return date;
}

export function subDays(input: DateInput, days: number): Date {
  return addDays(input, -days);
}

export function subWeeks(input: DateInput, weeks: number): Date {
  return addWeeks(input, -weeks);
}

export function subMonths(input: DateInput, months: number): Date {
  return addMonths(input, -months);
}

export function subYears(input: DateInput, years: number): Date {
  return addYears(input, -years);
}

// ============================================================
// DATE COMPARISONS
// ============================================================

export function isBefore(date1: DateInput, date2: DateInput): boolean {
  return parseDate(date1).getTime() < parseDate(date2).getTime();
}

export function isAfter(date1: DateInput, date2: DateInput): boolean {
  return parseDate(date1).getTime() > parseDate(date2).getTime();
}

export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isSameMonth(date1: DateInput, date2: DateInput): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth()
  );
}

export function isSameYear(date1: DateInput, date2: DateInput): boolean {
  return parseDate(date1).getFullYear() === parseDate(date2).getFullYear();
}

export function isToday(input: DateInput): boolean {
  return isSameDay(input, new Date());
}

export function isTomorrow(input: DateInput): boolean {
  return isSameDay(input, addDays(new Date(), 1));
}

export function isYesterday(input: DateInput): boolean {
  return isSameDay(input, subDays(new Date(), 1));
}

export function isThisWeek(input: DateInput): boolean {
  const date = parseDate(input);
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);
  return date >= startOfWeek && date <= endOfWeek;
}

export function isThisMonth(input: DateInput): boolean {
  return isSameMonth(input, new Date());
}

export function isThisYear(input: DateInput): boolean {
  return isSameYear(input, new Date());
}

export function isPast(input: DateInput): boolean {
  return parseDate(input).getTime() < Date.now();
}

export function isFuture(input: DateInput): boolean {
  return parseDate(input).getTime() > Date.now();
}

export function isWeekend(input: DateInput): boolean {
  const day = parseDate(input).getDay();
  return day === 0 || day === 6;
}

export function isWeekday(input: DateInput): boolean {
  return !isWeekend(input);
}

// ============================================================
// DATE BOUNDARIES
// ============================================================

export function getStartOfDay(input: DateInput): Date {
  const date = parseDate(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getEndOfDay(input: DateInput): Date {
  const date = parseDate(input);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function getStartOfWeek(input: DateInput, weekStartsOn: number = 0): Date {
  const date = parseDate(input);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  return getStartOfDay(date);
}

export function getEndOfWeek(input: DateInput, weekStartsOn: number = 0): Date {
  const date = getStartOfWeek(input, weekStartsOn);
  date.setDate(date.getDate() + 6);
  return getEndOfDay(date);
}

export function getStartOfMonth(input: DateInput): Date {
  const date = parseDate(input);
  date.setDate(1);
  return getStartOfDay(date);
}

export function getEndOfMonth(input: DateInput): Date {
  const date = parseDate(input);
  date.setMonth(date.getMonth() + 1, 0);
  return getEndOfDay(date);
}

export function getStartOfYear(input: DateInput): Date {
  const date = parseDate(input);
  date.setMonth(0, 1);
  return getStartOfDay(date);
}

export function getEndOfYear(input: DateInput): Date {
  const date = parseDate(input);
  date.setMonth(11, 31);
  return getEndOfDay(date);
}

// ============================================================
// DATE RANGES
// ============================================================

export function getDaysInMonth(input: DateInput): number {
  const date = parseDate(input);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDaysInYear(input: DateInput): number {
  const year = parseDate(input).getFullYear();
  return isLeapYear(year) ? 366 : 365;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getWeekNumber(input: DateInput): number {
  const date = parseDate(input);
  const startOfYear = getStartOfYear(date);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.ceil((diff / DAY + startOfYear.getDay() + 1) / 7);
}

export function getDayOfYear(input: DateInput): number {
  const date = parseDate(input);
  const startOfYear = getStartOfYear(date);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / DAY) + 1;
}

export function diffInDays(date1: DateInput, date2: DateInput): number {
  const d1 = getStartOfDay(date1);
  const d2 = getStartOfDay(date2);
  return Math.round((d1.getTime() - d2.getTime()) / DAY);
}

export function diffInWeeks(date1: DateInput, date2: DateInput): number {
  return Math.floor(diffInDays(date1, date2) / 7);
}

export function diffInMonths(date1: DateInput, date2: DateInput): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
}

export function diffInYears(date1: DateInput, date2: DateInput): number {
  return parseDate(date1).getFullYear() - parseDate(date2).getFullYear();
}

export function diffInHours(date1: DateInput, date2: DateInput): number {
  return Math.floor((parseDate(date1).getTime() - parseDate(date2).getTime()) / HOUR);
}

export function diffInMinutes(date1: DateInput, date2: DateInput): number {
  return Math.floor((parseDate(date1).getTime() - parseDate(date2).getTime()) / MINUTE);
}

// ============================================================
// CALENDAR HELPERS
// ============================================================

export function getCalendarDays(year: number, month: number): CalendarDate[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: CalendarDate[] = [];
  
  // Previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      year: prevYear,
      month: prevMonth,
      day: daysInPrevMonth - i,
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ year, month, day });
  }
  
  // Next month's leading days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      year: nextYear,
      month: nextMonth,
      day,
    });
  }
  
  return days;
}

export function getMonthName(month: number, short: boolean = false): string {
  return short ? MONTHS_SHORT[month] : MONTHS[month];
}

export function getDayName(day: number, short: boolean = false): string {
  return short ? DAYS_SHORT[day] : DAYS[day];
}

// ============================================================
// TIME SLOTS FOR MEETINGS
// ============================================================

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 18,
  intervalMinutes: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const endMinute = minute + intervalMinutes;
      const endHourAdjusted = hour + Math.floor(endMinute / 60);
      const endMinuteAdjusted = endMinute % 60;
      const end = `${String(endHourAdjusted).padStart(2, '0')}:${String(endMinuteAdjusted).padStart(2, '0')}`;
      
      slots.push({ start, end });
    }
  }
  
  return slots;
}

export function isTimeInSlot(time: string, slot: TimeSlot): boolean {
  return time >= slot.start && time < slot.end;
}

export function findAvailableSlots(
  date: DateInput,
  busyPeriods: DateRange[],
  slotDuration: number = 30
): TimeSlot[] {
  const slots = generateTimeSlots(9, 18, slotDuration);
  const dateStart = getStartOfDay(date);
  
  return slots.filter((slot) => {
    const slotStart = new Date(dateStart);
    const [startHour, startMin] = slot.start.split(':').map(Number);
    slotStart.setHours(startHour, startMin, 0, 0);
    
    const slotEnd = new Date(dateStart);
    const [endHour, endMin] = slot.end.split(':').map(Number);
    slotEnd.setHours(endHour, endMin, 0, 0);
    
    return !busyPeriods.some(
      (busy) =>
        (slotStart >= busy.start && slotStart < busy.end) ||
        (slotEnd > busy.start && slotEnd <= busy.end) ||
        (slotStart <= busy.start && slotEnd >= busy.end)
    );
  });
}

// ============================================================
// TIMEZONE HELPERS
// ============================================================

export function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  
  const localTime = now.getTime();
  const tzTime = new Date(formatter.format(now)).getTime();
  
  return (tzTime - localTime) / MINUTE;
}

export function getTimezoneAbbreviation(timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  
  const parts = formatter.formatToParts(new Date());
  const tzPart = parts.find((p) => p.type === 'timeZoneName');
  return tzPart?.value || timezone;
}

export function convertTimezone(
  input: DateInput,
  fromTimezone: string,
  toTimezone: string
): Date {
  const date = parseDate(input);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  return new Date(formatter.format(date));
}

// ============================================================
// DURATION FORMATTING
// ============================================================

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  const seconds = Math.floor((ms % MINUTE) / SECOND);
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

export function formatDurationVerbose(ms: number): string {
  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  const seconds = Math.floor((ms % MINUTE) / SECOND);
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }
  
  return parts.join(', ');
}

export function parseDuration(duration: string): number {
  const regex = /(\d+)\s*(h|hr|hour|hours|m|min|minute|minutes|s|sec|second|seconds)/gi;
  let totalMs = 0;
  let match;
  
  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    
    if (unit.startsWith('h')) {
      totalMs += value * HOUR;
    } else if (unit.startsWith('m')) {
      totalMs += value * MINUTE;
    } else if (unit.startsWith('s')) {
      totalMs += value * SECOND;
    }
  }
  
  return totalMs;
}

// ============================================================
// EXPORTS
// ============================================================

export const dateUtils = {
  // Parsing
  parseDate,
  isValidDate,
  toISOString,
  toTimestamp,
  
  // Formatting
  formatDate,
  formatTime,
  formatDateTime,
  formatDateShort,
  formatDateLong,
  formatRelativeTime,
  timeAgo,
  timeUntil,
  
  // Manipulation
  addDays,
  addWeeks,
  addMonths,
  addYears,
  addHours,
  addMinutes,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  
  // Comparisons
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isPast,
  isFuture,
  isWeekend,
  isWeekday,
  
  // Boundaries
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  
  // Ranges
  getDaysInMonth,
  getDaysInYear,
  isLeapYear,
  getWeekNumber,
  getDayOfYear,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
  diffInHours,
  diffInMinutes,
  
  // Calendar
  getCalendarDays,
  getMonthName,
  getDayName,
  
  // Time slots
  generateTimeSlots,
  isTimeInSlot,
  findAvailableSlots,
  
  // Timezone
  getTimezoneOffset,
  getTimezoneAbbreviation,
  convertTimezone,
  
  // Duration
  formatDuration,
  formatDurationVerbose,
  parseDuration,
  
  // Constants
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
  MONTHS,
  MONTHS_SHORT,
  DAYS,
  DAYS_SHORT,
  DAYS_MIN,
};

export default dateUtils;
