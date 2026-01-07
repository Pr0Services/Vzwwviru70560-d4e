/**
 * CHE·NU™ — AGENT PERFORMANCE TUNER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Fine-tuning des performances des agents pour qualité et efficacité maximales
 * ════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface AgentMetrics {
  agentId: string;
  level: AgentLevel;
  
  // Performance
  averageResponseTime: number;      // ms
  successRate: number;              // 0-100
  errorRate: number;                // 0-100
  
  // Quality
  accuracyScore: number;            // 0-100
  relevanceScore: number;           // 0-100
  completenessScore: number;        // 0-100
  
  // Efficiency
  tokensPerTask: number;
  tasksPerHour: number;
  retryRate: number;                // 0-100
  
  // User satisfaction
  userRating: number;               // 0-5
  escalationRate: number;           // 0-100 (to higher level agent or human)
}

export interface TuningParameter {
  id: string;
  name: string;
  nameFr: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  impact: 'speed' | 'quality' | 'cost' | 'reliability';
  description: string;
}

export interface AgentProfile {
  agentId: string;
  level: AgentLevel;
  specialization: string;
  
  // Tuning parameters
  parameters: TuningParameter[];
  
  // Performance targets
  targets: {
    maxResponseTime: number;
    minSuccessRate: number;
    minAccuracy: number;
    maxTokensPerTask: number;
  };
  
  // Current performance
  currentMetrics: AgentMetrics;
  
  // History
  performanceHistory: Array<{
    date: Date;
    metrics: AgentMetrics;
  }>;
}

export interface TuningRecommendation {
  parameterId: string;
  currentValue: number;
  recommendedValue: number;
  expectedImprovement: string;
  expectedImprovementFr: string;
  confidence: number;
  tradeoffs: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT TUNING PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_TUNING_PARAMETERS: TuningParameter[] = [
  {
    id: 'param-temperature',
    name: 'Response Temperature',
    nameFr: 'Température de réponse',
    currentValue: 0.7,
    minValue: 0,
    maxValue: 1,
    step: 0.1,
    impact: 'quality',
    description: 'Controls creativity vs consistency. Lower = more consistent, Higher = more creative'
  },
  {
    id: 'param-max-tokens',
    name: 'Max Response Tokens',
    nameFr: 'Tokens max de réponse',
    currentValue: 1000,
    minValue: 100,
    maxValue: 4000,
    step: 100,
    impact: 'cost',
    description: 'Maximum tokens per response. Lower = cheaper but may truncate'
  },
  {
    id: 'param-context-window',
    name: 'Context Window Size',
    nameFr: 'Taille de la fenêtre de contexte',
    currentValue: 4000,
    minValue: 1000,
    maxValue: 16000,
    step: 1000,
    impact: 'quality',
    description: 'How much context to include. More = better understanding but higher cost'
  },
  {
    id: 'param-retry-attempts',
    name: 'Retry Attempts',
    nameFr: 'Tentatives de réessai',
    currentValue: 2,
    minValue: 0,
    maxValue: 5,
    step: 1,
    impact: 'reliability',
    description: 'Number of retry attempts on failure'
  },
  {
    id: 'param-timeout',
    name: 'Timeout (seconds)',
    nameFr: 'Délai d\'expiration (secondes)',
    currentValue: 30,
    minValue: 5,
    maxValue: 120,
    step: 5,
    impact: 'speed',
    description: 'Maximum wait time before timeout'
  },
  {
    id: 'param-batch-size',
    name: 'Batch Size',
    nameFr: 'Taille du lot',
    currentValue: 5,
    minValue: 1,
    maxValue: 20,
    step: 1,
    impact: 'speed',
    description: 'Number of items to process in parallel'
  },
  {
    id: 'param-cache-ttl',
    name: 'Cache TTL (minutes)',
    nameFr: 'Durée du cache (minutes)',
    currentValue: 60,
    minValue: 0,
    maxValue: 1440,
    step: 15,
    impact: 'cost',
    description: 'How long to cache responses. Longer = fewer API calls'
  },
  {
    id: 'param-confidence-threshold',
    name: 'Confidence Threshold',
    nameFr: 'Seuil de confiance',
    currentValue: 0.8,
    minValue: 0.5,
    maxValue: 0.99,
    step: 0.05,
    impact: 'quality',
    description: 'Minimum confidence to accept response without escalation'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// AGENT PRESETS BY LEVEL
// ═══════════════════════════════════════════════════════════════════════════

export const AGENT_PRESETS: Record<AgentLevel, Partial<Record<string, number>>> = {
  L0: {
    'param-temperature': 0.3,
    'param-max-tokens': 500,
    'param-context-window': 2000,
    'param-retry-attempts': 1,
    'param-timeout': 10,
    'param-batch-size': 10,
    'param-cache-ttl': 120,
    'param-confidence-threshold': 0.9
  },
  L1: {
    'param-temperature': 0.5,
    'param-max-tokens': 1000,
    'param-context-window': 4000,
    'param-retry-attempts': 2,
    'param-timeout': 30,
    'param-batch-size': 5,
    'param-cache-ttl': 60,
    'param-confidence-threshold': 0.85
  },
  L2: {
    'param-temperature': 0.7,
    'param-max-tokens': 2000,
    'param-context-window': 8000,
    'param-retry-attempts': 3,
    'param-timeout': 60,
    'param-batch-size': 3,
    'param-cache-ttl': 30,
    'param-confidence-threshold': 0.8
  },
  L3: {
    'param-temperature': 0.8,
    'param-max-tokens': 4000,
    'param-context-window': 16000,
    'param-retry-attempts': 3,
    'param-timeout': 120,
    'param-batch-size': 1,
    'param-cache-ttl': 0,
    'param-confidence-threshold': 0.75
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// AGENT PERFORMANCE TUNER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class AgentPerformanceTuner {
  private profiles: Map<string, AgentProfile> = new Map();
  
  constructor() {
    logger.debug('🤖 Agent Performance Tuner initialized');
  }
  
  /**
   * Créer un profil d'agent avec les paramètres par défaut
   */
  createProfile(agentId: string, level: AgentLevel, specialization: string): AgentProfile {
    const preset = AGENT_PRESETS[level];
    const parameters = DEFAULT_TUNING_PARAMETERS.map(p => ({
      ...p,
      currentValue: preset[p.id] ?? p.currentValue
    }));
    
    const profile: AgentProfile = {
      agentId,
      level,
      specialization,
      parameters,
      targets: this.getDefaultTargets(level),
      currentMetrics: this.createEmptyMetrics(agentId, level),
      performanceHistory: []
    };
    
    this.profiles.set(agentId, profile);
    return profile;
  }
  
  /**
   * Mettre à jour les métriques d'un agent
   */
  updateMetrics(agentId: string, metrics: Partial<AgentMetrics>): void {
    const profile = this.profiles.get(agentId);
    if (!profile) return;
    
    // Mise à jour avec moyenne mobile
    const current = profile.currentMetrics;
    const alpha = 0.1; // Facteur de lissage
    
    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value === 'number' && key in current) {
        (current as any)[key] = (current as any)[key] * (1 - alpha) + value * alpha;
      }
    }
    
    // Ajouter à l'historique
    profile.performanceHistory.push({
      date: new Date(),
      metrics: { ...current }
    });
    
    // Garder seulement les 100 dernières entrées
    if (profile.performanceHistory.length > 100) {
      profile.performanceHistory = profile.performanceHistory.slice(-100);
    }
  }
  
  /**
   * Analyser les performances et générer des recommandations
   */
  analyzeAndRecommend(agentId: string): TuningRecommendation[] {
    const profile = this.profiles.get(agentId);
    if (!profile) return [];
    
    const recommendations: TuningRecommendation[] = [];
    const metrics = profile.currentMetrics;
    const targets = profile.targets;
    
    // Analyser chaque métrique vs target
    
    // Response time trop lent?
    if (metrics.averageResponseTime > targets.maxResponseTime) {
      recommendations.push({
        parameterId: 'param-context-window',
        currentValue: this.getParamValue(profile, 'param-context-window'),
        recommendedValue: Math.max(1000, this.getParamValue(profile, 'param-context-window') - 1000),
        expectedImprovement: 'Reduce response time by ~20%',
        expectedImprovementFr: 'Réduire le temps de réponse de ~20%',
        confidence: 75,
        tradeoffs: ['May reduce context understanding']
      });
      
      recommendations.push({
        parameterId: 'param-timeout',
        currentValue: this.getParamValue(profile, 'param-timeout'),
        recommendedValue: Math.min(120, this.getParamValue(profile, 'param-timeout') + 15),
        expectedImprovement: 'Fewer timeout errors',
        expectedImprovementFr: 'Moins d\'erreurs de délai',
        confidence: 85,
        tradeoffs: ['Longer wait times on slow responses']
      });
    }
    
    // Success rate trop bas?
    if (metrics.successRate < targets.minSuccessRate) {
      recommendations.push({
        parameterId: 'param-retry-attempts',
        currentValue: this.getParamValue(profile, 'param-retry-attempts'),
        recommendedValue: Math.min(5, this.getParamValue(profile, 'param-retry-attempts') + 1),
        expectedImprovement: 'Improve success rate by ~10%',
        expectedImprovementFr: 'Améliorer le taux de succès de ~10%',
        confidence: 80,
        tradeoffs: ['Higher latency on failures', 'More token usage']
      });
      
      recommendations.push({
        parameterId: 'param-temperature',
        currentValue: this.getParamValue(profile, 'param-temperature'),
        recommendedValue: Math.max(0, this.getParamValue(profile, 'param-temperature') - 0.2),
        expectedImprovement: 'More consistent responses',
        expectedImprovementFr: 'Réponses plus cohérentes',
        confidence: 70,
        tradeoffs: ['Less creative outputs']
      });
    }
    
    // Accuracy trop basse?
    if (metrics.accuracyScore < targets.minAccuracy) {
      recommendations.push({
        parameterId: 'param-context-window',
        currentValue: this.getParamValue(profile, 'param-context-window'),
        recommendedValue: Math.min(16000, this.getParamValue(profile, 'param-context-window') + 2000),
        expectedImprovement: 'Better context understanding',
        expectedImprovementFr: 'Meilleure compréhension du contexte',
        confidence: 75,
        tradeoffs: ['Higher cost', 'Slower responses']
      });
      
      recommendations.push({
        parameterId: 'param-confidence-threshold',
        currentValue: this.getParamValue(profile, 'param-confidence-threshold'),
        recommendedValue: Math.min(0.95, this.getParamValue(profile, 'param-confidence-threshold') + 0.05),
        expectedImprovement: 'Filter out low-confidence responses',
        expectedImprovementFr: 'Filtrer les réponses à faible confiance',
        confidence: 85,
        tradeoffs: ['More escalations to higher level']
      });
    }
    
    // Token usage trop élevé?
    if (metrics.tokensPerTask > targets.maxTokensPerTask) {
      recommendations.push({
        parameterId: 'param-max-tokens',
        currentValue: this.getParamValue(profile, 'param-max-tokens'),
        recommendedValue: Math.max(100, this.getParamValue(profile, 'param-max-tokens') - 200),
        expectedImprovement: 'Reduce token usage by ~15%',
        expectedImprovementFr: 'Réduire l\'utilisation de tokens de ~15%',
        confidence: 90,
        tradeoffs: ['May truncate long responses']
      });
      
      recommendations.push({
        parameterId: 'param-cache-ttl',
        currentValue: this.getParamValue(profile, 'param-cache-ttl'),
        recommendedValue: Math.min(1440, this.getParamValue(profile, 'param-cache-ttl') + 30),
        expectedImprovement: 'More cache hits, fewer API calls',
        expectedImprovementFr: 'Plus de cache hits, moins d\'appels API',
        confidence: 85,
        tradeoffs: ['Potentially stale responses']
      });
    }
    
    return recommendations;
  }
  
  /**
   * Appliquer une recommandation
   */
  applyRecommendation(agentId: string, recommendation: TuningRecommendation): void {
    const profile = this.profiles.get(agentId);
    if (!profile) return;
    
    const param = profile.parameters.find(p => p.id === recommendation.parameterId);
    if (param) {
      param.currentValue = recommendation.recommendedValue;
      logger.debug(`✅ Applied: ${param.name} = ${recommendation.recommendedValue}`);
    }
  }
  
  /**
   * Auto-tune basé sur l'historique
   */
  autoTune(agentId: string): { applied: TuningRecommendation[]; skipped: TuningRecommendation[] } {
    const recommendations = this.analyzeAndRecommend(agentId);
    const applied: TuningRecommendation[] = [];
    const skipped: TuningRecommendation[] = [];
    
    for (const rec of recommendations) {
      // Appliquer seulement si confiance > 80%
      if (rec.confidence >= 80) {
        this.applyRecommendation(agentId, rec);
        applied.push(rec);
      } else {
        skipped.push(rec);
      }
    }
    
    return { applied, skipped };
  }
  
  /**
   * Obtenir un rapport de performance
   */
  getPerformanceReport(agentId: string): {
    current: AgentMetrics;
    targets: AgentProfile['targets'];
    health: 'excellent' | 'good' | 'needs-attention' | 'critical';
    issues: string[];
    improvements: string[];
  } {
    const profile = this.profiles.get(agentId);
    if (!profile) {
      return {
        current: this.createEmptyMetrics(agentId, 'L1'),
        targets: this.getDefaultTargets('L1'),
        health: 'critical',
        issues: ['Agent profile not found'],
        improvements: []
      };
    }
    
    const issues: string[] = [];
    const improvements: string[] = [];
    const metrics = profile.currentMetrics;
    const targets = profile.targets;
    
    // Analyser les métriques
    if (metrics.averageResponseTime > targets.maxResponseTime) {
      issues.push(`Response time ${metrics.averageResponseTime}ms exceeds target ${targets.maxResponseTime}ms`);
    } else if (metrics.averageResponseTime < targets.maxResponseTime * 0.5) {
      improvements.push('Response time is excellent');
    }
    
    if (metrics.successRate < targets.minSuccessRate) {
      issues.push(`Success rate ${metrics.successRate}% below target ${targets.minSuccessRate}%`);
    } else if (metrics.successRate > 95) {
      improvements.push('Success rate is excellent');
    }
    
    if (metrics.accuracyScore < targets.minAccuracy) {
      issues.push(`Accuracy ${metrics.accuracyScore}% below target ${targets.minAccuracy}%`);
    }
    
    if (metrics.tokensPerTask > targets.maxTokensPerTask) {
      issues.push(`Token usage ${metrics.tokensPerTask} exceeds budget ${targets.maxTokensPerTask}`);
    }
    
    // Déterminer la santé globale
    let health: 'excellent' | 'good' | 'needs-attention' | 'critical';
    if (issues.length === 0 && improvements.length >= 2) {
      health = 'excellent';
    } else if (issues.length === 0) {
      health = 'good';
    } else if (issues.length <= 2) {
      health = 'needs-attention';
    } else {
      health = 'critical';
    }
    
    return {
      current: metrics,
      targets,
      health,
      issues,
      improvements
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  private getDefaultTargets(level: AgentLevel): AgentProfile['targets'] {
    const targets: Record<AgentLevel, AgentProfile['targets']> = {
      L0: { maxResponseTime: 500, minSuccessRate: 95, minAccuracy: 90, maxTokensPerTask: 100 },
      L1: { maxResponseTime: 2000, minSuccessRate: 90, minAccuracy: 85, maxTokensPerTask: 500 },
      L2: { maxResponseTime: 5000, minSuccessRate: 85, minAccuracy: 80, maxTokensPerTask: 1500 },
      L3: { maxResponseTime: 30000, minSuccessRate: 80, minAccuracy: 85, maxTokensPerTask: 3000 }
    };
    return targets[level];
  }
  
  private createEmptyMetrics(agentId: string, level: AgentLevel): AgentMetrics {
    return {
      agentId,
      level,
      averageResponseTime: 0,
      successRate: 100,
      errorRate: 0,
      accuracyScore: 100,
      relevanceScore: 100,
      completenessScore: 100,
      tokensPerTask: 0,
      tasksPerHour: 0,
      retryRate: 0,
      userRating: 5,
      escalationRate: 0
    };
  }
  
  private getParamValue(profile: AgentProfile, paramId: string): number {
    const param = profile.parameters.find(p => p.id === paramId);
    return param?.currentValue ?? 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const agentPerformanceTuner = new AgentPerformanceTuner();
