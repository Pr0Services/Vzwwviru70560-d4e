// CHE·NU™ Utilities — Helper Functions

// ============================================================
// DATE UTILS
// ============================================================

export const formatDate = (date: string | Date, locale: 'fr' | 'en' = 'en'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date, locale: 'fr' | 'en' = 'en'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d);
};

export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const isFuture = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() > Date.now();
};

// ============================================================
// STRING UTILS
// ============================================================

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const initials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : (plural || `${singular}s`);
};

// ============================================================
// NUMBER UTILS
// ============================================================

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatCompact = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// ============================================================
// TOKEN UTILS (CHE·NU Specific)
// ============================================================

export const estimateTokens = (text: string): number => {
  // Rough estimate: ~4 characters per token on average
  return Math.ceil(text.length / 4);
};

export const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
};

export const calculateTokenCost = (tokens: number, rate: number = 0.00001): number => {
  return tokens * rate;
};

export const getEncodingSavings = (original: number, encoded: number): number => {
  if (original === 0) return 0;
  return Math.round(((original - encoded) / original) * 100);
};

// ============================================================
// ARRAY UTILS
// ============================================================

export const groupBy = <T, K extends keyof any>(arr: T[], key: (item: T) => K): Record<K, T[]> => {
  return arr.reduce((groups, item) => {
    const k = key(item);
    (groups[k] = groups[k] || []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// ============================================================
// VALIDATION UTILS
// ============================================================

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  return { valid: errors.length === 0, errors };
};

export const isNotEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// ============================================================
// COLOR UTILS
// ============================================================

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const adjustBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = clamp((num >> 16) + amt, 0, 255);
  const G = clamp((num >> 8 & 0x00FF) + amt, 0, 255);
  const B = clamp((num & 0x0000FF) + amt, 0, 255);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

// ============================================================
// ID GENERATION
// ============================================================

export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// ============================================================
// STORAGE UTILS
// ============================================================

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      logger.error('Storage error:', e);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  },
};

// ============================================================
// DEBOUNCE & THROTTLE
// ============================================================

export const debounce = <T extends (...args: unknown[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================================
// COPY TO CLIPBOARD
// ============================================================

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// ============================================================
// URL UTILS
// ============================================================

export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => { result[key] = value; });
  return result;
};

export const buildUrl = (base: string, params: Record<string, any>): string => {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  // Date
  formatDate, formatDateTime, formatRelativeTime, isToday, isFuture,
  // String
  truncate, capitalize, slugify, initials, pluralize,
  // Number
  formatNumber, formatCompact, formatCurrency, formatPercentage, clamp,
  // Tokens
  estimateTokens, formatTokens, calculateTokenCost, getEncodingSavings,
  // Array
  groupBy, sortBy, uniqueBy, chunk,
  // Validation
  isValidEmail, isValidPassword, isNotEmpty,
  // Color
  hexToRgba, adjustBrightness,
  // ID
  generateId, generateUUID,
  // Storage
  storage,
  // Async
  debounce, throttle, copyToClipboard,
  // URL
  getQueryParams, buildUrl,
};
