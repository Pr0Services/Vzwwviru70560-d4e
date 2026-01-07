/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — SECURITY UTILITIES v39
   XSS Prevention, Sanitization, and Security Helpers
   ═══════════════════════════════════════════════════════════════════════════════ */

import DOMPurify from 'dompurify';

// ════════════════════════════════════════════════════════════════════════════════
// DOM PURIFY CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Strict HTML sanitization - removes all potentially dangerous content
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Rich text sanitization - allows more formatting but still secure
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'b', 'i', 'u', 'em', 'strong', 'strike', 's',
      'a', 'span',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'class', 'id',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['rel'],
    ADD_TAGS: [],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed', 'svg'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
  });
}

/**
 * Plain text only - strips ALL HTML
 */
export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * URL sanitization - only allows safe protocols
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    
    if (!allowedProtocols.includes(parsed.protocol)) {
      logger.warn(`Blocked URL with unsafe protocol: ${parsed.protocol}`);
      return null;
    }
    
    return parsed.toString();
  } catch {
    logger.warn(`Invalid URL: ${url}`);
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// INPUT VALIDATION & SANITIZATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Escape HTML entities for safe display
 */
export function escapeHTML(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] ?? char);
}

/**
 * Unescape HTML entities
 */
export function unescapeHTML(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, (entity) => htmlEntities[entity] ?? entity);
}

/**
 * Strip all HTML tags
 */
export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '');
  
  // Remove or replace dangerous characters
  safe = safe.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  
  // Remove leading/trailing dots and spaces
  safe = safe.replace(/^[\s.]+|[\s.]+$/g, '');
  
  // Limit length
  if (safe.length > 255) {
    const ext = safe.slice(safe.lastIndexOf('.'));
    const name = safe.slice(0, 255 - ext.length);
    safe = name + ext;
  }
  
  return safe || 'unnamed';
}

/**
 * Validate and sanitize JSON string
 */
export function sanitizeJSON(jsonString: string): unknown | null {
  try {
    // First, try to parse
    const parsed = JSON.parse(jsonString);
    
    // Re-stringify to remove any prototype pollution attempts
    return JSON.parse(JSON.stringify(parsed));
  } catch {
    logger.warn('Invalid JSON string');
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// SQL INJECTION PREVENTION (for display purposes)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Escape SQL-like special characters (for display/logging only)
 * Note: Always use parameterized queries in actual SQL operations
 */
export function escapeSQLChars(str: string): string {
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/--/g, '\\-\\-');
}

// ════════════════════════════════════════════════════════════════════════════════
// CONTENT SECURITY
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Check if content contains potential XSS patterns
 */
export function containsXSSPatterns(content: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:\s*text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<svg[^>]*onload/gi,
    /<img[^>]*onerror/gi,
  ];
  
  return xssPatterns.some((pattern) => pattern.test(content));
}

/**
 * Check if URL is potentially malicious
 */
export function isMaliciousURL(url: string): boolean {
  const maliciousPatterns = [
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /file:/i,
    /about:blank/i,
  ];
  
  return maliciousPatterns.some((pattern) => pattern.test(url));
}

/**
 * Validate external link and add security attributes
 */
export function secureExternalLink(url: string): {
  href: string;
  rel: string;
  target: string;
} | null {
  const sanitized = sanitizeURL(url);
  
  if (!sanitized || isMaliciousURL(sanitized)) {
    return null;
  }
  
  return {
    href: sanitized,
    rel: 'noopener noreferrer nofollow',
    target: '_blank',
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// CSRF PROTECTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session storage
 */
export function storeCSRFToken(token: string): void {
  sessionStorage.setItem('csrf_token', token);
}

/**
 * Get stored CSRF token
 */
export function getCSRFToken(): string | null {
  return sessionStorage.getItem('csrf_token');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
}

// ════════════════════════════════════════════════════════════════════════════════
// RATE LIMITING HELPERS (Client-side)
// ════════════════════════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple client-side rate limiter
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    // Start new window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const security = {
  // Sanitization
  sanitizeHTML,
  sanitizeRichText,
  sanitizePlainText,
  sanitizeURL,
  sanitizeFilename,
  sanitizeJSON,
  
  // Escaping
  escapeHTML,
  unescapeHTML,
  stripTags,
  escapeSQLChars,
  
  // Validation
  containsXSSPatterns,
  isMaliciousURL,
  secureExternalLink,
  
  // CSRF
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  
  // Rate limiting
  checkRateLimit,
};

export default security;
