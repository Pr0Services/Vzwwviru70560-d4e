/**
 * CHE·NU™ - ENCODING SERVICE
 * 
 * CORE INTELLECTUAL PROPERTY
 * 
 * CHE·NU includes an ENCODING LAYER before and after AI execution.
 * 
 * Purpose:
 * - reduce token usage
 * - clarify intent
 * - enforce scope
 * - improve agent efficiency
 * 
 * Encoding is:
 * - reversible for humans
 * - compatible with agents
 * - measurable (quality score)
 * - a key competitive advantage
 * 
 * Encoding ALWAYS happens BEFORE execution.
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type EncodingMode = 'standard' | 'compressed' | 'minimal' | 'verbose' | 'custom';

export interface EncodingConfig {
  mode: EncodingMode;
  preserveContext: boolean;
  maxTokenReduction: number; // percentage (0-100)
  qualityThreshold: number; // 0-100
  customRules?: EncodingRule[];
}

export interface EncodingRule {
  id: string;
  name: string;
  pattern: RegExp | string;
  replacement: string | ((match: string) => string);
  priority: number;
  enabled: boolean;
  category: EncodingRuleCategory;
}

export type EncodingRuleCategory = 
  | 'whitespace'
  | 'redundancy'
  | 'abbreviation'
  | 'structure'
  | 'semantic'
  | 'custom';

export interface EncodingResult {
  original: string;
  encoded: string;
  metrics: EncodingMetrics;
  appliedRules: string[];
  reversible: boolean;
  timestamp: string;
}

export interface EncodingMetrics {
  originalTokens: number;
  encodedTokens: number;
  tokenReduction: number;
  reductionPercent: number;
  qualityScore: number;
  processingTimeMs: number;
  compressionRatio: number;
}

export interface DecodingResult {
  encoded: string;
  decoded: string;
  fidelity: number; // 0-100, how close to original
  lossySegments: string[];
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT ENCODING RULES
// ═══════════════════════════════════════════════════════════════

const DEFAULT_ENCODING_RULES: EncodingRule[] = [
  // Whitespace Rules
  {
    id: 'ws_multispace',
    name: 'Multiple Spaces',
    pattern: /\s{2,}/g,
    replacement: ' ',
    priority: 1,
    enabled: true,
    category: 'whitespace',
  },
  {
    id: 'ws_trim',
    name: 'Trim Lines',
    pattern: /^\s+|\s+$/gm,
    replacement: '',
    priority: 1,
    enabled: true,
    category: 'whitespace',
  },
  {
    id: 'ws_empty_lines',
    name: 'Empty Lines',
    pattern: /\n{3,}/g,
    replacement: '\n\n',
    priority: 2,
    enabled: true,
    category: 'whitespace',
  },

  // Redundancy Rules
  {
    id: 'red_please',
    name: 'Remove Politeness',
    pattern: /\b(please|kindly|would you mind|could you please)\b/gi,
    replacement: '',
    priority: 3,
    enabled: true,
    category: 'redundancy',
  },
  {
    id: 'red_fillers',
    name: 'Remove Fillers',
    pattern: /\b(basically|actually|literally|obviously|clearly|simply|just)\b/gi,
    replacement: '',
    priority: 3,
    enabled: true,
    category: 'redundancy',
  },
  {
    id: 'red_that',
    name: 'Remove Unnecessary That',
    pattern: /\bthat\s+that\b/gi,
    replacement: 'that',
    priority: 4,
    enabled: true,
    category: 'redundancy',
  },

  // Abbreviation Rules
  {
    id: 'abbr_information',
    name: 'Information → Info',
    pattern: /\binformation\b/gi,
    replacement: 'info',
    priority: 5,
    enabled: true,
    category: 'abbreviation',
  },
  {
    id: 'abbr_application',
    name: 'Application → App',
    pattern: /\bapplication\b/gi,
    replacement: 'app',
    priority: 5,
    enabled: true,
    category: 'abbreviation',
  },
  {
    id: 'abbr_configuration',
    name: 'Configuration → Config',
    pattern: /\bconfiguration\b/gi,
    replacement: 'config',
    priority: 5,
    enabled: true,
    category: 'abbreviation',
  },
  {
    id: 'abbr_documentation',
    name: 'Documentation → Docs',
    pattern: /\bdocumentation\b/gi,
    replacement: 'docs',
    priority: 5,
    enabled: true,
    category: 'abbreviation',
  },
  {
    id: 'abbr_example',
    name: 'For Example → e.g.',
    pattern: /\bfor example\b/gi,
    replacement: 'e.g.',
    priority: 5,
    enabled: true,
    category: 'abbreviation',
  },

  // Structure Rules
  {
    id: 'struct_bullet_normalize',
    name: 'Normalize Bullets',
    pattern: /^[\*\-\•]\s*/gm,
    replacement: '- ',
    priority: 6,
    enabled: true,
    category: 'structure',
  },
  {
    id: 'struct_number_normalize',
    name: 'Normalize Numbers',
    pattern: /^\d+[\.\)]\s*/gm,
    replacement: (match) => match.replace(/[\.\)]/, '.'),
    priority: 6,
    enabled: true,
    category: 'structure',
  },
];

// ═══════════════════════════════════════════════════════════════
// MODE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

const MODE_CONFIGS: Record<EncodingMode, Partial<EncodingConfig>> = {
  standard: {
    preserveContext: true,
    maxTokenReduction: 30,
    qualityThreshold: 85,
  },
  compressed: {
    preserveContext: true,
    maxTokenReduction: 50,
    qualityThreshold: 70,
  },
  minimal: {
    preserveContext: false,
    maxTokenReduction: 70,
    qualityThreshold: 50,
  },
  verbose: {
    preserveContext: true,
    maxTokenReduction: 10,
    qualityThreshold: 95,
  },
  custom: {
    preserveContext: true,
    maxTokenReduction: 40,
    qualityThreshold: 80,
  },
};

// ═══════════════════════════════════════════════════════════════
// ENCODING SERVICE CLASS
// ═══════════════════════════════════════════════════════════════

export class EncodingService {
  private rules: EncodingRule[];
  private config: EncodingConfig;
  private history: EncodingResult[];

  constructor(config?: Partial<EncodingConfig>) {
    this.config = {
      mode: config?.mode || 'standard',
      preserveContext: config?.preserveContext ?? true,
      maxTokenReduction: config?.maxTokenReduction ?? 30,
      qualityThreshold: config?.qualityThreshold ?? 85,
      customRules: config?.customRules || [],
    };

    this.rules = [...DEFAULT_ENCODING_RULES, ...(config?.customRules || [])];
    this.history = [];
  }

  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────

  setMode(mode: EncodingMode): void {
    this.config.mode = mode;
    const modeConfig = MODE_CONFIGS[mode];
    Object.assign(this.config, modeConfig);
  }

  setConfig(config: Partial<EncodingConfig>): void {
    Object.assign(this.config, config);
  }

  addRule(rule: EncodingRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((r) => r.id !== ruleId);
  }

  enableRule(ruleId: string, enabled: boolean): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) rule.enabled = enabled;
  }

  // ─────────────────────────────────────────────────────────────
  // Token Estimation
  // ─────────────────────────────────────────────────────────────

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English
    // More accurate would use a tokenizer like tiktoken
    return Math.ceil(text.length / 4);
  }

  // ─────────────────────────────────────────────────────────────
  // Quality Scoring
  // ─────────────────────────────────────────────────────────────

  private calculateQualityScore(original: string, encoded: string): number {
    // Factors for quality:
    // 1. Semantic preservation (simplified check)
    // 2. Readability maintenance
    // 3. Key information retention

    const originalWords = new Set(original.toLowerCase().match(/\b\w{4,}\b/g) || []);
    const encodedWords = new Set(encoded.toLowerCase().match(/\b\w{4,}\b/g) || []);
    
    // Calculate word preservation
    let preservedCount = 0;
    originalWords.forEach((word) => {
      if (encodedWords.has(word)) preservedCount++;
    });
    
    const wordPreservation = originalWords.size > 0 
      ? (preservedCount / originalWords.size) * 100 
      : 100;

    // Calculate length ratio (penalize extreme compression)
    const lengthRatio = encoded.length / original.length;
    const lengthScore = lengthRatio > 0.3 ? 100 : lengthRatio * 333;

    // Combined score
    return Math.round((wordPreservation * 0.7) + (lengthScore * 0.3));
  }

  // ─────────────────────────────────────────────────────────────
  // Encoding
  // ─────────────────────────────────────────────────────────────

  encode(input: string): EncodingResult {
    const startTime = performance.now();
    const originalTokens = this.estimateTokens(input);
    const appliedRules: string[] = [];

    let encoded = input;

    // Apply rules based on priority
    const enabledRules = this.rules
      .filter((r) => r.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of enabledRules) {
      const before = encoded;
      
      if (typeof rule.pattern === 'string') {
        encoded = encoded.replace(new RegExp(rule.pattern, 'g'), rule.replacement as string);
      } else {
        encoded = encoded.replace(
          rule.pattern,
          typeof rule.replacement === 'function' ? rule.replacement : rule.replacement
        );
      }

      if (before !== encoded) {
        appliedRules.push(rule.id);
      }
    }

    // Final cleanup
    encoded = encoded.trim();

    const encodedTokens = this.estimateTokens(encoded);
    const qualityScore = this.calculateQualityScore(input, encoded);
    const processingTimeMs = performance.now() - startTime;

    const result: EncodingResult = {
      original: input,
      encoded,
      metrics: {
        originalTokens,
        encodedTokens,
        tokenReduction: originalTokens - encodedTokens,
        reductionPercent: Math.round(((originalTokens - encodedTokens) / originalTokens) * 100),
        qualityScore,
        processingTimeMs: Math.round(processingTimeMs * 100) / 100,
        compressionRatio: Math.round((encoded.length / input.length) * 100) / 100,
      },
      appliedRules,
      reversible: qualityScore >= this.config.qualityThreshold,
      timestamp: new Date().toISOString(),
    };

    this.history.push(result);
    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // Batch Encoding
  // ─────────────────────────────────────────────────────────────

  encodeBatch(inputs: string[]): EncodingResult[] {
    return inputs.map((input) => this.encode(input));
  }

  // ─────────────────────────────────────────────────────────────
  // Decoding (Best Effort)
  // ─────────────────────────────────────────────────────────────

  decode(encoded: string): DecodingResult {
    // Note: Full decoding requires stored mappings
    // This is a best-effort expansion
    
    let decoded = encoded;
    const lossySegments: string[] = [];

    // Reverse abbreviations
    const abbreviationReversals: [RegExp, string][] = [
      [/\binfo\b/gi, 'information'],
      [/\bapp\b/gi, 'application'],
      [/\bconfig\b/gi, 'configuration'],
      [/\bdocs\b/gi, 'documentation'],
      [/\be\.g\./gi, 'for example'],
    ];

    for (const [pattern, replacement] of abbreviationReversals) {
      decoded = decoded.replace(pattern, replacement);
    }

    // Calculate fidelity (simplified)
    const fidelity = Math.min(
      100,
      Math.round((decoded.length / Math.max(encoded.length, 1)) * 50 + 50)
    );

    return {
      encoded,
      decoded,
      fidelity,
      lossySegments,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Intent Extraction (Semantic Encoding)
  // ─────────────────────────────────────────────────────────────

  extractIntent(input: string): {
    action: string;
    target: string;
    context: string[];
    confidence: number;
  } {
    // Simple intent extraction using patterns
    const actionPatterns = [
      { pattern: /\b(create|make|build|generate)\b/i, action: 'CREATE' },
      { pattern: /\b(update|modify|change|edit)\b/i, action: 'UPDATE' },
      { pattern: /\b(delete|remove|destroy)\b/i, action: 'DELETE' },
      { pattern: /\b(find|search|get|fetch|retrieve)\b/i, action: 'READ' },
      { pattern: /\b(analyze|evaluate|assess)\b/i, action: 'ANALYZE' },
      { pattern: /\b(summarize|condense|brief)\b/i, action: 'SUMMARIZE' },
      { pattern: /\b(explain|describe|elaborate)\b/i, action: 'EXPLAIN' },
      { pattern: /\b(schedule|plan|organize)\b/i, action: 'SCHEDULE' },
      { pattern: /\b(send|email|message|notify)\b/i, action: 'COMMUNICATE' },
    ];

    let action = 'UNKNOWN';
    let confidence = 0;

    for (const { pattern, action: detectedAction } of actionPatterns) {
      if (pattern.test(input)) {
        action = detectedAction;
        confidence = 0.8;
        break;
      }
    }

    // Extract potential targets (nouns after action)
    const targetMatch = input.match(/\b(?:the|a|my|our)\s+(\w+)/i);
    const target = targetMatch?.[1] || 'unknown';

    // Extract context keywords
    const contextWords = input.match(/\b[A-Z][a-z]+\b/g) || [];

    return {
      action,
      target,
      context: contextWords,
      confidence,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Scope Enforcement
  // ─────────────────────────────────────────────────────────────

  enforceScope(input: string, allowedScopes: string[]): {
    valid: boolean;
    violations: string[];
    sanitized: string;
  } {
    const violations: string[] = [];
    let sanitized = input;

    // Check for scope violations (simplified)
    const sensitivePatterns = [
      { pattern: /\b(password|secret|key|token)\b/gi, scope: 'security' },
      { pattern: /\b(ssn|social security|credit card)\b/gi, scope: 'pii' },
      { pattern: /\b(delete all|drop table|truncate)\b/gi, scope: 'destructive' },
    ];

    for (const { pattern, scope } of sensitivePatterns) {
      if (pattern.test(input) && !allowedScopes.includes(scope)) {
        violations.push(`Scope violation: ${scope}`);
        sanitized = sanitized.replace(pattern, '[REDACTED]');
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      sanitized,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // History & Analytics
  // ─────────────────────────────────────────────────────────────

  getHistory(): EncodingResult[] {
    return [...this.history];
  }

  getAverageMetrics(): Omit<EncodingMetrics, 'processingTimeMs'> & { count: number } {
    if (this.history.length === 0) {
      return {
        originalTokens: 0,
        encodedTokens: 0,
        tokenReduction: 0,
        reductionPercent: 0,
        qualityScore: 0,
        compressionRatio: 0,
        count: 0,
      };
    }

    const totals = this.history.reduce(
      (acc, r) => ({
        originalTokens: acc.originalTokens + r.metrics.originalTokens,
        encodedTokens: acc.encodedTokens + r.metrics.encodedTokens,
        tokenReduction: acc.tokenReduction + r.metrics.tokenReduction,
        reductionPercent: acc.reductionPercent + r.metrics.reductionPercent,
        qualityScore: acc.qualityScore + r.metrics.qualityScore,
        compressionRatio: acc.compressionRatio + r.metrics.compressionRatio,
      }),
      {
        originalTokens: 0,
        encodedTokens: 0,
        tokenReduction: 0,
        reductionPercent: 0,
        qualityScore: 0,
        compressionRatio: 0,
      }
    );

    const count = this.history.length;

    return {
      originalTokens: Math.round(totals.originalTokens / count),
      encodedTokens: Math.round(totals.encodedTokens / count),
      tokenReduction: Math.round(totals.tokenReduction / count),
      reductionPercent: Math.round(totals.reductionPercent / count),
      qualityScore: Math.round(totals.qualityScore / count),
      compressionRatio: Math.round((totals.compressionRatio / count) * 100) / 100,
      count,
    };
  }

  clearHistory(): void {
    this.history = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════

export const encodingService = new EncodingService();

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo } from 'react';

export function useEncoding(initialMode: EncodingMode = 'standard') {
  const [mode, setMode] = useState<EncodingMode>(initialMode);
  const [lastResult, setLastResult] = useState<EncodingResult | null>(null);

  const service = useMemo(() => {
    const svc = new EncodingService({ mode });
    return svc;
  }, [mode]);

  const encode = useCallback((text: string): EncodingResult => {
    const result = service.encode(text);
    setLastResult(result);
    return result;
  }, [service]);

  const decode = useCallback((encoded: string): DecodingResult => {
    return service.decode(encoded);
  }, [service]);

  const extractIntent = useCallback((text: string) => {
    return service.extractIntent(text);
  }, [service]);

  return {
    mode,
    setMode,
    encode,
    decode,
    extractIntent,
    lastResult,
    averageMetrics: service.getAverageMetrics(),
  };
}

export default EncodingService;
