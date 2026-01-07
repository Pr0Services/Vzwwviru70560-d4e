/**
 * CHE·NU™ — TOKEN OPTIMIZER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Fine-tuning de la consommation de tokens à tous les niveaux
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * OBJECTIF: Réduire de 40-60% la consommation sans perte de qualité
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TokenBudget {
  daily: number;
  weekly: number;
  monthly: number;
  perOperation: Record<string, number>;
}

export interface TokenUsageMetrics {
  timestamp: Date;
  operation: string;
  tokensUsed: number;
  tokensOptimized: number;
  savingsPercent: number;
  qualityScore: number;  // 0-100, must stay above 85
}

export interface OptimizationRule {
  id: string;
  name: string;
  nameFr: string;
  condition: (context: OperationContext) => boolean;
  optimization: (input: string) => string;
  expectedSavings: number;  // percent
  qualityImpact: number;    // negative = reduces quality
}

export interface OperationContext {
  operationType: string;
  sphereId: string;
  dataSize: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
  userTier: 'free' | 'pro' | 'enterprise';
  previousTokenUsage?: number;
}

export interface CompressionResult {
  original: string;
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  savingsPercent: number;
  reversible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN ESTIMATION (approximation based on GPT tokenization)
// ═══════════════════════════════════════════════════════════════════════════

export function estimateTokens(text: string): number {
  // Approximation: ~4 characters per token for English, ~2 for French
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil((words * 1.3) + (chars / 4));
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZATION RULES
// ═══════════════════════════════════════════════════════════════════════════

export const OPTIMIZATION_RULES: OptimizationRule[] = [
  
  // ─────────────────────────────────────────────────────────────────────────
  // TEXT COMPRESSION RULES
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'rule-remove-redundant-whitespace',
    name: 'Remove Redundant Whitespace',
    nameFr: 'Supprimer les espaces redondants',
    condition: (ctx) => ctx.dataSize > 100,
    optimization: (input) => input.replace(/\s+/g, ' ').trim(),
    expectedSavings: 5,
    qualityImpact: 0
  },
  
  {
    id: 'rule-abbreviate-common-terms',
    name: 'Abbreviate Common Terms',
    nameFr: 'Abréger les termes courants',
    condition: (ctx) => ctx.priority !== 'critical',
    optimization: (input) => {
      const abbreviations: Record<string, string> = {
        'transaction': 'txn',
        'information': 'info',
        'configuration': 'config',
        'application': 'app',
        'description': 'desc',
        'identification': 'id',
        'documentation': 'docs',
        'organization': 'org',
        'administration': 'admin',
        'communication': 'comm',
        'specification': 'spec',
        'implementation': 'impl',
        'authentication': 'auth',
        'authorization': 'authz',
        'approximately': '~',
        'environment': 'env',
        'development': 'dev',
        'production': 'prod',
        'government': 'gov',
        'entertainment': 'ent',
        'professional': 'pro'
      };
      
      let result = input;
      for (const [full, abbr] of Object.entries(abbreviations)) {
        result = result.replace(new RegExp(full, 'gi'), abbr);
      }
      return result;
    },
    expectedSavings: 12,
    qualityImpact: -2
  },
  
  {
    id: 'rule-remove-filler-words',
    name: 'Remove Filler Words',
    nameFr: 'Supprimer les mots de remplissage',
    condition: (ctx) => ctx.operationType !== 'creative-writing',
    optimization: (input) => {
      const fillers = [
        'basically', 'actually', 'literally', 'really', 'very',
        'just', 'simply', 'quite', 'rather', 'somewhat',
        'en fait', 'vraiment', 'simplement', 'assez', 'plutôt'
      ];
      
      let result = input;
      for (const filler of fillers) {
        result = result.replace(new RegExp(`\\b${filler}\\b`, 'gi'), '');
      }
      return result.replace(/\s+/g, ' ').trim();
    },
    expectedSavings: 8,
    qualityImpact: -1
  },
  
  {
    id: 'rule-compress-json-keys',
    name: 'Compress JSON Keys',
    nameFr: 'Compresser les clés JSON',
    condition: (ctx) => ctx.operationType === 'data-transfer',
    optimization: (input) => {
      // Shorten common JSON keys
      const keyMap: Record<string, string> = {
        'timestamp': 'ts',
        'created_at': 'ca',
        'updated_at': 'ua',
        'description': 'd',
        'amount': 'a',
        'category': 'c',
        'status': 's',
        'user_id': 'uid',
        'template_id': 'tid',
        'connection_id': 'cid'
      };
      
      let result = input;
      for (const [full, short] of Object.entries(keyMap)) {
        result = result.replace(new RegExp(`"${full}"`, 'g'), `"${short}"`);
      }
      return result;
    },
    expectedSavings: 15,
    qualityImpact: 0  // Reversible mapping
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT PRUNING RULES
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'rule-prune-old-history',
    name: 'Prune Old History',
    nameFr: 'Élaguer l\'historique ancien',
    condition: (ctx) => ctx.dataSize > 5000,
    optimization: (input) => {
      // Keep only last N entries in arrays
      try {
        const data = JSON.parse(input);
        if (Array.isArray(data) && data.length > 10) {
          return JSON.stringify(data.slice(-10));
        }
        return input;
      } catch {
        return input;
      }
    },
    expectedSavings: 40,
    qualityImpact: -5
  },
  
  {
    id: 'rule-summarize-large-text',
    name: 'Summarize Large Text Blocks',
    nameFr: 'Résumer les grands blocs de texte',
    condition: (ctx) => ctx.dataSize > 2000 && ctx.priority !== 'critical',
    optimization: (input) => {
      // Extract key sentences (first and last of each paragraph)
      const paragraphs = input.split(/\n\n+/);
      const summarized = paragraphs.map(p => {
        const sentences = p.split(/[.!?]+/);
        if (sentences.length <= 2) return p;
        return `${sentences[0]}. ... ${sentences[sentences.length - 2]}.`;
      });
      return summarized.join('\n\n');
    },
    expectedSavings: 50,
    qualityImpact: -15
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // SMART CACHING RULES
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'rule-use-reference-ids',
    name: 'Replace Repeated Data with References',
    nameFr: 'Remplacer les données répétées par des références',
    condition: (ctx) => ctx.operationType === 'batch-processing',
    optimization: (input) => {
      // Identify and reference repeated strings
      const strings = new Map<string, number>();
      const words = input.match(/\b\w{10,}\b/g) || [];
      
      for (const word of words) {
        strings.set(word, (strings.get(word) || 0) + 1);
      }
      
      let result = input;
      let refIndex = 0;
      const refs: Record<string, string> = {};
      
      for (const [str, count] of strings) {
        if (count >= 3 && str.length > 12) {
          const ref = `$${refIndex++}`;
          refs[ref] = str;
          result = result.replace(new RegExp(str, 'g'), ref);
        }
      }
      
      if (Object.keys(refs).length > 0) {
        return JSON.stringify({ _refs: refs, _data: result });
      }
      return input;
    },
    expectedSavings: 25,
    qualityImpact: 0  // Fully reversible
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN OPTIMIZER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class TokenOptimizer {
  private metrics: TokenUsageMetrics[] = [];
  private budgets: Map<string, TokenBudget> = new Map();
  
  constructor() {
    logger.debug('⚡ Token Optimizer initialized with', OPTIMIZATION_RULES.length, 'rules');
  }
  
  /**
   * Optimiser une entrée selon le contexte
   */
  optimize(input: string, context: OperationContext): CompressionResult {
    const originalTokens = estimateTokens(input);
    let optimized = input;
    let totalQualityImpact = 0;
    
    // Appliquer les règles applicables
    for (const rule of OPTIMIZATION_RULES) {
      if (rule.condition(context)) {
        // Vérifier que la qualité reste acceptable
        if (totalQualityImpact + rule.qualityImpact >= -15) {
          optimized = rule.optimization(optimized);
          totalQualityImpact += rule.qualityImpact;
        }
      }
    }
    
    const compressedTokens = estimateTokens(optimized);
    const savingsPercent = ((originalTokens - compressedTokens) / originalTokens) * 100;
    
    // Enregistrer les métriques
    this.recordMetrics({
      timestamp: new Date(),
      operation: context.operationType,
      tokensUsed: compressedTokens,
      tokensOptimized: originalTokens - compressedTokens,
      savingsPercent,
      qualityScore: 100 + totalQualityImpact
    });
    
    return {
      original: input,
      compressed: optimized,
      originalTokens,
      compressedTokens,
      savingsPercent,
      reversible: totalQualityImpact >= -5
    };
  }
  
  /**
   * Optimiser un batch de données
   */
  optimizeBatch(items: string[], context: OperationContext): CompressionResult[] {
    return items.map(item => this.optimize(item, context));
  }
  
  /**
   * Définir un budget de tokens pour un utilisateur
   */
  setBudget(userId: string, budget: TokenBudget): void {
    this.budgets.set(userId, budget);
  }
  
  /**
   * Vérifier si une opération respecte le budget
   */
  checkBudget(userId: string, estimatedTokens: number): {
    allowed: boolean;
    remaining: number;
    suggestion?: string;
  } {
    const budget = this.budgets.get(userId);
    if (!budget) {
      return { allowed: true, remaining: Infinity };
    }
    
    const todayUsage = this.getTodayUsage(userId);
    const remaining = budget.daily - todayUsage;
    
    if (estimatedTokens > remaining) {
      return {
        allowed: false,
        remaining,
        suggestion: `Consider optimizing input or waiting until tomorrow. Current: ${todayUsage}, Limit: ${budget.daily}`
      };
    }
    
    return { allowed: true, remaining: remaining - estimatedTokens };
  }
  
  /**
   * Obtenir des suggestions d'optimisation
   */
  getSuggestions(context: OperationContext): string[] {
    const suggestions: string[] = [];
    
    if (context.dataSize > 5000) {
      suggestions.push('Consider splitting large operations into smaller batches');
    }
    
    if (context.priority === 'low') {
      suggestions.push('Low priority operations can use aggressive compression');
    }
    
    if (context.userTier === 'free') {
      suggestions.push('Upgrade to Pro for 3x token budget');
    }
    
    return suggestions;
  }
  
  /**
   * Obtenir les statistiques d'optimisation
   */
  getStats(): {
    totalOptimized: number;
    averageSavings: number;
    averageQuality: number;
    operationBreakdown: Record<string, { count: number; savings: number }>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalOptimized: 0,
        averageSavings: 0,
        averageQuality: 100,
        operationBreakdown: {}
      };
    }
    
    const totalOptimized = this.metrics.reduce((sum, m) => sum + m.tokensOptimized, 0);
    const averageSavings = this.metrics.reduce((sum, m) => sum + m.savingsPercent, 0) / this.metrics.length;
    const averageQuality = this.metrics.reduce((sum, m) => sum + m.qualityScore, 0) / this.metrics.length;
    
    const breakdown: Record<string, { count: number; savings: number }> = {};
    for (const m of this.metrics) {
      if (!breakdown[m.operation]) {
        breakdown[m.operation] = { count: 0, savings: 0 };
      }
      breakdown[m.operation].count++;
      breakdown[m.operation].savings += m.tokensOptimized;
    }
    
    return { totalOptimized, averageSavings, averageQuality, operationBreakdown: breakdown };
  }
  
  /**
   * Enregistrer les métriques
   */
  private recordMetrics(metrics: TokenUsageMetrics): void {
    this.metrics.push(metrics);
    
    // Garder seulement les 1000 dernières métriques
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }
  
  /**
   * Obtenir l'usage du jour
   */
  private getTodayUsage(userId: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.metrics
      .filter(m => m.timestamp >= today)
      .reduce((sum, m) => sum + m.tokensUsed, 0);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENCODING FINE-TUNER
// ═══════════════════════════════════════════════════════════════════════════

export interface EncodingProfile {
  id: string;
  name: string;
  compressionLevel: 'minimal' | 'balanced' | 'aggressive';
  rules: string[];  // Rule IDs to apply
  targetSavings: number;
  maxQualityLoss: number;
}

export const ENCODING_PROFILES: EncodingProfile[] = [
  {
    id: 'profile-lossless',
    name: 'Lossless',
    compressionLevel: 'minimal',
    rules: ['rule-remove-redundant-whitespace', 'rule-compress-json-keys'],
    targetSavings: 15,
    maxQualityLoss: 0
  },
  {
    id: 'profile-balanced',
    name: 'Balanced',
    compressionLevel: 'balanced',
    rules: [
      'rule-remove-redundant-whitespace',
      'rule-abbreviate-common-terms',
      'rule-compress-json-keys',
      'rule-use-reference-ids'
    ],
    targetSavings: 35,
    maxQualityLoss: 5
  },
  {
    id: 'profile-aggressive',
    name: 'Aggressive',
    compressionLevel: 'aggressive',
    rules: [
      'rule-remove-redundant-whitespace',
      'rule-abbreviate-common-terms',
      'rule-remove-filler-words',
      'rule-compress-json-keys',
      'rule-prune-old-history',
      'rule-use-reference-ids'
    ],
    targetSavings: 55,
    maxQualityLoss: 15
  }
];

export class EncodingFineTuner {
  private optimizer: TokenOptimizer;
  
  constructor() {
    this.optimizer = new TokenOptimizer();
  }
  
  /**
   * Sélectionner le profil optimal selon le contexte
   */
  selectProfile(context: OperationContext): EncodingProfile {
    if (context.priority === 'critical') {
      return ENCODING_PROFILES[0]; // Lossless
    }
    
    if (context.userTier === 'free' || context.dataSize > 3000) {
      return ENCODING_PROFILES[2]; // Aggressive
    }
    
    return ENCODING_PROFILES[1]; // Balanced
  }
  
  /**
   * Encoder avec un profil spécifique
   */
  encodeWithProfile(input: string, profile: EncodingProfile, context: OperationContext): CompressionResult {
    return this.optimizer.optimize(input, {
      ...context,
      // Ajuster le contexte selon le profil
      priority: profile.compressionLevel === 'aggressive' ? 'low' : context.priority
    });
  }
  
  /**
   * Trouver le meilleur équilibre qualité/compression
   */
  findOptimalCompression(input: string, context: OperationContext, targetQuality: number = 90): {
    profile: EncodingProfile;
    result: CompressionResult;
  } {
    for (const profile of ENCODING_PROFILES) {
      const result = this.encodeWithProfile(input, profile, context);
      
      if (result.savingsPercent >= profile.targetSavings) {
        const qualityScore = 100 - (profile.maxQualityLoss);
        if (qualityScore >= targetQuality) {
          return { profile, result };
        }
      }
    }
    
    // Fallback to lossless
    return {
      profile: ENCODING_PROFILES[0],
      result: this.encodeWithProfile(input, ENCODING_PROFILES[0], context)
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const tokenOptimizer = new TokenOptimizer();
export const encodingFineTuner = new EncodingFineTuner();
