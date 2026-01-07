/* =========================================
   CHE·NU — CENTRALIZED LOGGER
   
   Remplace tous les console.log du projet.
   Désactivé automatiquement en production.
   
   Usage:
   import { logger, presetLogger } from '@/utils/logger';
   logger.info('Message');
   presetLogger.debug('Preset changed', { from, to });
   ========================================= */

// === TYPES ===

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
  module?: string;
}

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  bufferSize: number;
  prefix: string;
}

// === CONFIG ===

const isDev = typeof process !== 'undefined' 
  ? process.env.NODE_ENV === 'development'
  : !import.meta.env?.PROD;

const config: LoggerConfig = {
  enabled: true,
  minLevel: isDev ? 'debug' : 'warn',
  bufferSize: 1000,
  prefix: 'CHE·NU',
};

// === LEVEL PRIORITY ===

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// === BUFFER ===

const logBuffer: LogEntry[] = [];

function bufferLog(entry: LogEntry): void {
  logBuffer.push(entry);
  if (logBuffer.length > config.bufferSize) {
    logBuffer.shift();
  }
}

// === HELPERS ===

function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[config.minLevel];
}

function formatMessage(module: string | undefined, message: string): string {
  const prefix = module ? `[${config.prefix}:${module}]` : `[${config.prefix}]`;
  return `${prefix} ${message}`;
}

function createEntry(
  level: LogLevel,
  message: string,
  data?: unknown,
  module?: string
): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: Date.now(),
    module,
  };
}

// === COLORS (Terminal) ===

const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m',  // Cyan
  info: '\x1b[32m',   // Green
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
};

function colorize(level: LogLevel, text: string): string {
  if (typeof window !== 'undefined') return text; // Browser
  return `${colors[level]}${text}${colors.reset}`;
}

// === MAIN LOGGER ===

export const logger = {
  /**
   * Debug level - development only
   */
  debug(message: string, data?: unknown, module?: string): void {
    if (!shouldLog('debug')) return;
    const entry = createEntry('debug', message, data, module);
    bufferLog(entry);
    console.debug(colorize('debug', formatMessage(module, message)), data ?? '');
  },

  /**
   * Info level - general information
   */
  info(message: string, data?: unknown, module?: string): void {
    if (!shouldLog('info')) return;
    const entry = createEntry('info', message, data, module);
    bufferLog(entry);
    console.info(colorize('info', formatMessage(module, message)), data ?? '');
  },

  /**
   * Warn level - potential issues
   */
  warn(message: string, data?: unknown, module?: string): void {
    if (!shouldLog('warn')) return;
    const entry = createEntry('warn', message, data, module);
    bufferLog(entry);
    console.warn(colorize('warn', formatMessage(module, message)), data ?? '');
  },

  /**
   * Error level - always logged
   */
  error(message: string, error?: unknown, module?: string): void {
    const entry = createEntry('error', message, error, module);
    bufferLog(entry);
    console.error(colorize('error', formatMessage(module, message)), error ?? '');
    
    // En production, on pourrait envoyer à un service de monitoring
    // if (!isDev) sendToMonitoring(entry);
  },

  /**
   * Créer un logger scopé pour un module
   */
  scope(module: string) {
    return {
      debug: (msg: string, data?: unknown) => logger.debug(msg, data, module),
      info: (msg: string, data?: unknown) => logger.info(msg, data, module),
      warn: (msg: string, data?: unknown) => logger.warn(msg, data, module),
      error: (msg: string, err?: unknown) => logger.error(msg, err, module),
    };
  },

  /**
   * Log avec niveau dynamique
   */
  log(level: LogLevel, message: string, data?: unknown, module?: string): void {
    switch (level) {
      case 'debug': this.debug(message, data, module); break;
      case 'info': this.info(message, data, module); break;
      case 'warn': this.warn(message, data, module); break;
      case 'error': this.error(message, data, module); break;
    }
  },

  /**
   * Mesurer le temps d'exécution
   */
  time(label: string, module?: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.debug(`${label}: ${duration}ms`, undefined, module);
    };
  },

  /**
   * Group de logs
   */
  group(label: string, fn: () => void, module?: string): void {
    console.group(formatMessage(module, label));
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  },

  // === BUFFER MANAGEMENT ===

  /**
   * Récupérer le buffer de logs
   */
  getBuffer(): readonly LogEntry[] {
    return [...logBuffer];
  },

  /**
   * Vider le buffer
   */
  clearBuffer(): void {
    logBuffer.length = 0;
  },

  /**
   * Exporter les logs en JSON
   */
  exportLogs(): string {
    return JSON.stringify(logBuffer, null, 2);
  },

  /**
   * Filtrer les logs par niveau
   */
  filterByLevel(level: LogLevel): LogEntry[] {
    return logBuffer.filter((e) => e.level === level);
  },

  /**
   * Filtrer les logs par module
   */
  filterByModule(module: string): LogEntry[] {
    return logBuffer.filter((e) => e.module === module);
  },

  // === CONFIG ===

  /**
   * Activer/désactiver le logger
   */
  setEnabled(enabled: boolean): void {
    config.enabled = enabled;
  },

  /**
   * Définir le niveau minimum
   */
  setMinLevel(level: LogLevel): void {
    config.minLevel = level;
  },

  /**
   * Obtenir la config actuelle
   */
  getConfig(): Readonly<LoggerConfig> {
    return { ...config };
  },
};

// === LOGGERS SCOPÉS PRÉ-DÉFINIS ===

// Core
export const presetLogger = logger.scope('Preset');
export const xrLogger = logger.scope('XR');
export const timelineLogger = logger.scope('Timeline');
export const apiLogger = logger.scope('API');

// CHE·NU Stores (Canonical)
export const identityLogger = logger.scope('Identity');
export const governanceLogger = logger.scope('Governance');
export const agentLogger = logger.scope('Agent');
export const tokenLogger = logger.scope('Token');
export const novaLogger = logger.scope('Nova');
export const threadLogger = logger.scope('Thread');
export const dataspaceLogger = logger.scope('Dataspace');
export const memoryLogger = logger.scope('Memory');
export const uiLogger = logger.scope('UI');
export const authLogger = logger.scope('Auth');

// CHE·NU Engines
export const ocwLogger = logger.scope('OCWEngine');
export const meetingLogger = logger.scope('MeetingEngine');
export const oneclickLogger = logger.scope('OneClickEngine');
export const immobilierLogger = logger.scope('ImmobilierEngine');

// Convenience object for all store loggers
export const storeLoggers = {
  identity: identityLogger,
  governance: governanceLogger,
  agent: agentLogger,
  token: tokenLogger,
  nova: novaLogger,
  thread: threadLogger,
  dataspace: dataspaceLogger,
  memory: memoryLogger,
  ui: uiLogger,
  auth: authLogger,
  ocw: ocwLogger,
  meeting: meetingLogger,
  oneclick: oneclickLogger,
  immobilier: immobilierLogger,
};

// === EXPORT TYPE ===

export type { LogLevel, LogEntry, LoggerConfig };
