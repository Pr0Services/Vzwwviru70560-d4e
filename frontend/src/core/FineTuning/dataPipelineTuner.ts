/**
 * CHE·NU™ — DATA PIPELINE TUNER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Optimisation des flux de données entre sphères
 * ════════════════════════════════════════════════════════════════════════════
 */

import { SphereId } from '../Connections/connectionTemplates';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DataPipeline {
  id: string;
  name: string;
  nameFr: string;
  
  source: {
    sphere: SphereId;
    dataType: string;
    frequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  };
  
  destination: {
    sphere: SphereId;
    dataType: string;
  };
  
  transformations: DataTransformation[];
  
  // Performance metrics
  metrics: {
    throughput: number;           // records per minute
    latency: number;              // ms average
    errorRate: number;            // 0-100
    dataQuality: number;          // 0-100
  };
  
  // Configuration
  config: {
    batchSize: number;
    parallelism: number;
    retryPolicy: {
      maxRetries: number;
      backoffMs: number;
    };
    caching: {
      enabled: boolean;
      ttlMinutes: number;
    };
  };
}

export interface DataTransformation {
  id: string;
  type: 'filter' | 'map' | 'aggregate' | 'join' | 'encode' | 'validate' | 'enrich';
  name: string;
  config: Record<string, any>;
  
  // Performance
  avgProcessingTimeMs: number;
  inputOutputRatio: number;       // 0.1 = 10x reduction, 2.0 = 2x expansion
}

export interface PipelineOptimization {
  id: string;
  pipelineId: string;
  type: 'batch' | 'cache' | 'parallelize' | 'compress' | 'deduplicate' | 'reorder';
  description: string;
  descriptionFr: string;
  expectedImprovement: {
    throughputIncrease: number;   // percent
    latencyReduction: number;     // percent
    costReduction: number;        // percent
  };
  implementation: string;
}

export interface DataQualityRule {
  id: string;
  name: string;
  field: string;
  validation: 'required' | 'type' | 'range' | 'pattern' | 'unique' | 'reference';
  config: Record<string, any>;
  severity: 'warning' | 'error' | 'critical';
}

// ═══════════════════════════════════════════════════════════════════════════
// STANDARD PIPELINES
// ═══════════════════════════════════════════════════════════════════════════

export const STANDARD_PIPELINES: DataPipeline[] = [
  {
    id: 'pipeline-income-aggregation',
    name: 'Income Aggregation Pipeline',
    nameFr: 'Pipeline d\'agrégation des revenus',
    source: {
      sphere: 'business',
      dataType: 'transaction',
      frequency: 'daily'
    },
    destination: {
      sphere: 'personal',
      dataType: 'financial-summary'
    },
    transformations: [
      { id: 't1', type: 'filter', name: 'Filter Income', config: { type: 'income' }, avgProcessingTimeMs: 2, inputOutputRatio: 0.6 },
      { id: 't2', type: 'aggregate', name: 'Sum by Category', config: { groupBy: 'category', operation: 'sum' }, avgProcessingTimeMs: 5, inputOutputRatio: 0.1 },
      { id: 't3', type: 'encode', name: 'Compress Data', config: { algorithm: 'chenu-encode' }, avgProcessingTimeMs: 3, inputOutputRatio: 0.7 }
    ],
    metrics: { throughput: 100, latency: 50, errorRate: 0.5, dataQuality: 98 },
    config: {
      batchSize: 100,
      parallelism: 4,
      retryPolicy: { maxRetries: 3, backoffMs: 1000 },
      caching: { enabled: true, ttlMinutes: 60 }
    }
  },
  {
    id: 'pipeline-tax-preparation',
    name: 'Tax Preparation Pipeline',
    nameFr: 'Pipeline de préparation fiscale',
    source: {
      sphere: 'business',
      dataType: 'financial-records'
    },
    destination: {
      sphere: 'government',
      dataType: 'tax-filing'
    },
    transformations: [
      { id: 't1', type: 'validate', name: 'Validate Records', config: { strict: true }, avgProcessingTimeMs: 10, inputOutputRatio: 1 },
      { id: 't2', type: 'aggregate', name: 'Calculate Totals', config: { operations: ['sum', 'count'] }, avgProcessingTimeMs: 15, inputOutputRatio: 0.05 },
      { id: 't3', type: 'map', name: 'Map to Tax Fields', config: { mapping: 'tax-mapping-v2' }, avgProcessingTimeMs: 5, inputOutputRatio: 1 },
      { id: 't4', type: 'encode', name: 'Secure Encode', config: { algorithm: 'aes-256', compress: true }, avgProcessingTimeMs: 8, inputOutputRatio: 0.8 }
    ],
    metrics: { throughput: 50, latency: 150, errorRate: 1.2, dataQuality: 99 },
    config: {
      batchSize: 50,
      parallelism: 2,
      retryPolicy: { maxRetries: 5, backoffMs: 2000 },
      caching: { enabled: false, ttlMinutes: 0 }
    }
  },
  {
    id: 'pipeline-calendar-sync',
    name: 'Calendar Sync Pipeline',
    nameFr: 'Pipeline de synchronisation calendrier',
    source: {
      sphere: 'business',
      dataType: 'events',
      frequency: 'real-time'
    },
    destination: {
      sphere: 'personal',
      dataType: 'calendar'
    },
    transformations: [
      { id: 't1', type: 'filter', name: 'Filter Sync-Enabled', config: { field: 'syncToPersonal', value: true }, avgProcessingTimeMs: 1, inputOutputRatio: 0.7 },
      { id: 't2', type: 'map', name: 'Format for Calendar', config: { format: 'ical' }, avgProcessingTimeMs: 2, inputOutputRatio: 1 }
    ],
    metrics: { throughput: 500, latency: 20, errorRate: 0.1, dataQuality: 99.5 },
    config: {
      batchSize: 10,
      parallelism: 8,
      retryPolicy: { maxRetries: 2, backoffMs: 500 },
      caching: { enabled: true, ttlMinutes: 5 }
    }
  },
  {
    id: 'pipeline-royalty-tracking',
    name: 'Royalty Tracking Pipeline',
    nameFr: 'Pipeline de suivi des redevances',
    source: {
      sphere: 'design_studio',
      dataType: 'streaming-reports',
      frequency: 'weekly'
    },
    destination: {
      sphere: 'business',
      dataType: 'royalty-ledger'
    },
    transformations: [
      { id: 't1', type: 'validate', name: 'Validate Report Format', config: {}, avgProcessingTimeMs: 5, inputOutputRatio: 1 },
      { id: 't2', type: 'join', name: 'Join with Works Registry', config: { key: 'isrc' }, avgProcessingTimeMs: 20, inputOutputRatio: 1.2 },
      { id: 't3', type: 'aggregate', name: 'Aggregate by Period', config: { period: 'monthly' }, avgProcessingTimeMs: 10, inputOutputRatio: 0.1 },
      { id: 't4', type: 'enrich', name: 'Add Tax Categories', config: {}, avgProcessingTimeMs: 3, inputOutputRatio: 1.1 }
    ],
    metrics: { throughput: 1000, latency: 200, errorRate: 2, dataQuality: 95 },
    config: {
      batchSize: 500,
      parallelism: 4,
      retryPolicy: { maxRetries: 3, backoffMs: 5000 },
      caching: { enabled: true, ttlMinutes: 1440 }
    }
  },
  {
    id: 'pipeline-social-distribution',
    name: 'Social Distribution Pipeline',
    nameFr: 'Pipeline de distribution sociale',
    source: {
      sphere: 'design_studio',
      dataType: 'content-release',
      frequency: 'real-time'
    },
    destination: {
      sphere: 'social',
      dataType: 'social-posts'
    },
    transformations: [
      { id: 't1', type: 'map', name: 'Generate Captions', config: { ai: true, style: 'engaging' }, avgProcessingTimeMs: 500, inputOutputRatio: 3 },
      { id: 't2', type: 'map', name: 'Format per Platform', config: { platforms: ['instagram', 'twitter', 'facebook'] }, avgProcessingTimeMs: 50, inputOutputRatio: 3 },
      { id: 't3', type: 'validate', name: 'Check Content Guidelines', config: {}, avgProcessingTimeMs: 100, inputOutputRatio: 1 }
    ],
    metrics: { throughput: 10, latency: 800, errorRate: 5, dataQuality: 90 },
    config: {
      batchSize: 1,
      parallelism: 1,
      retryPolicy: { maxRetries: 2, backoffMs: 10000 },
      caching: { enabled: false, ttlMinutes: 0 }
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA QUALITY RULES
// ═══════════════════════════════════════════════════════════════════════════

export const DATA_QUALITY_RULES: DataQualityRule[] = [
  { id: 'dq-1', name: 'Amount Required', field: 'amount', validation: 'required', config: {}, severity: 'critical' },
  { id: 'dq-2', name: 'Amount Positive', field: 'amount', validation: 'range', config: { min: 0 }, severity: 'error' },
  { id: 'dq-3', name: 'Date Format', field: 'date', validation: 'pattern', config: { pattern: 'ISO8601' }, severity: 'error' },
  { id: 'dq-4', name: 'Category Valid', field: 'category', validation: 'reference', config: { ref: 'categories' }, severity: 'warning' },
  { id: 'dq-5', name: 'Email Format', field: 'email', validation: 'pattern', config: { pattern: 'email' }, severity: 'error' },
  { id: 'dq-6', name: 'ID Unique', field: 'id', validation: 'unique', config: {}, severity: 'critical' }
];

// ═══════════════════════════════════════════════════════════════════════════
// DATA PIPELINE TUNER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class DataPipelineTuner {
  private pipelines: Map<string, DataPipeline> = new Map();
  
  constructor() {
    for (const pipeline of STANDARD_PIPELINES) {
      this.pipelines.set(pipeline.id, pipeline);
    }
    logger.debug('🔄 Data Pipeline Tuner initialized with', this.pipelines.size, 'pipelines');
  }
  
  /**
   * Analyser un pipeline et suggérer des optimisations
   */
  analyzePipeline(pipelineId: string): PipelineOptimization[] {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return [];
    
    const optimizations: PipelineOptimization[] = [];
    
    // Analyser le throughput
    if (pipeline.metrics.throughput < 50) {
      optimizations.push({
        id: `opt-${pipelineId}-parallelize`,
        pipelineId,
        type: 'parallelize',
        description: `Increase parallelism from ${pipeline.config.parallelism} to ${pipeline.config.parallelism * 2}`,
        descriptionFr: `Augmenter le parallélisme de ${pipeline.config.parallelism} à ${pipeline.config.parallelism * 2}`,
        expectedImprovement: {
          throughputIncrease: 80,
          latencyReduction: 0,
          costReduction: 0
        },
        implementation: `config.parallelism = ${pipeline.config.parallelism * 2}`
      });
    }
    
    // Analyser la latence
    if (pipeline.metrics.latency > 100) {
      optimizations.push({
        id: `opt-${pipelineId}-cache`,
        pipelineId,
        type: 'cache',
        description: `Enable or increase caching to reduce ${pipeline.metrics.latency}ms latency`,
        descriptionFr: `Activer ou augmenter le cache pour réduire la latence de ${pipeline.metrics.latency}ms`,
        expectedImprovement: {
          throughputIncrease: 20,
          latencyReduction: 60,
          costReduction: 30
        },
        implementation: 'config.caching = { enabled: true, ttlMinutes: 30 }'
      });
    }
    
    // Analyser le taux d'erreur
    if (pipeline.metrics.errorRate > 2) {
      optimizations.push({
        id: `opt-${pipelineId}-retry`,
        pipelineId,
        type: 'batch',
        description: `Reduce batch size to improve error isolation (current error rate: ${pipeline.metrics.errorRate}%)`,
        descriptionFr: `Réduire la taille des lots pour améliorer l'isolation des erreurs (taux actuel: ${pipeline.metrics.errorRate}%)`,
        expectedImprovement: {
          throughputIncrease: -10,
          latencyReduction: 0,
          costReduction: 0
        },
        implementation: `config.batchSize = ${Math.max(1, Math.floor(pipeline.config.batchSize / 2))}`
      });
    }
    
    // Analyser les transformations
    const slowTransformations = pipeline.transformations.filter(t => t.avgProcessingTimeMs > 50);
    if (slowTransformations.length > 0) {
      optimizations.push({
        id: `opt-${pipelineId}-reorder`,
        pipelineId,
        type: 'reorder',
        description: `Reorder transformations: put filters before heavy operations`,
        descriptionFr: `Réordonner les transformations: placer les filtres avant les opérations lourdes`,
        expectedImprovement: {
          throughputIncrease: 25,
          latencyReduction: 30,
          costReduction: 20
        },
        implementation: 'Move filter transformations to beginning of pipeline'
      });
    }
    
    // Vérifier la compression
    const hasCompression = pipeline.transformations.some(t => t.type === 'encode');
    const hasHighExpansion = pipeline.transformations.some(t => t.inputOutputRatio > 2);
    if (!hasCompression && hasHighExpansion) {
      optimizations.push({
        id: `opt-${pipelineId}-compress`,
        pipelineId,
        type: 'compress',
        description: `Add compression after data expansion to reduce transfer size`,
        descriptionFr: `Ajouter la compression après l'expansion des données pour réduire la taille de transfert`,
        expectedImprovement: {
          throughputIncrease: 15,
          latencyReduction: 20,
          costReduction: 40
        },
        implementation: 'Add encode transformation with compression'
      });
    }
    
    // Vérifier les doublons
    if (pipeline.source.frequency === 'real-time' || pipeline.source.frequency === 'hourly') {
      optimizations.push({
        id: `opt-${pipelineId}-deduplicate`,
        pipelineId,
        type: 'deduplicate',
        description: `Add deduplication for high-frequency pipeline`,
        descriptionFr: `Ajouter la déduplication pour le pipeline à haute fréquence`,
        expectedImprovement: {
          throughputIncrease: 10,
          latencyReduction: 5,
          costReduction: 25
        },
        implementation: 'Add deduplicate transformation with sliding window'
      });
    }
    
    return optimizations;
  }
  
  /**
   * Calculer le score de santé d'un pipeline
   */
  calculateHealthScore(pipelineId: string): {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      return { score: 0, status: 'critical', issues: ['Pipeline not found'], recommendations: [] };
    }
    
    let score = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Throughput
    if (pipeline.metrics.throughput < 10) {
      score -= 30;
      issues.push('Very low throughput');
    } else if (pipeline.metrics.throughput < 50) {
      score -= 15;
      recommendations.push('Consider parallelization');
    }
    
    // Latency
    if (pipeline.metrics.latency > 500) {
      score -= 25;
      issues.push('High latency');
    } else if (pipeline.metrics.latency > 200) {
      score -= 10;
      recommendations.push('Enable caching');
    }
    
    // Error rate
    if (pipeline.metrics.errorRate > 5) {
      score -= 30;
      issues.push('High error rate');
    } else if (pipeline.metrics.errorRate > 2) {
      score -= 15;
      recommendations.push('Review validation rules');
    }
    
    // Data quality
    if (pipeline.metrics.dataQuality < 90) {
      score -= 20;
      issues.push('Data quality below threshold');
    } else if (pipeline.metrics.dataQuality < 95) {
      score -= 10;
      recommendations.push('Add data quality rules');
    }
    
    let status: 'excellent' | 'good' | 'warning' | 'critical';
    if (score >= 90) status = 'excellent';
    else if (score >= 70) status = 'good';
    else if (score >= 50) status = 'warning';
    else status = 'critical';
    
    return { score: Math.max(0, score), status, issues, recommendations };
  }
  
  /**
   * Générer un rapport complet de tous les pipelines
   */
  generateHealthReport(): {
    pipelines: Array<{
      pipeline: DataPipeline;
      health: ReturnType<DataPipelineTuner['calculateHealthScore']>;
      optimizations: PipelineOptimization[];
    }>;
    summary: {
      totalPipelines: number;
      averageHealth: number;
      criticalPipelines: number;
      totalOptimizations: number;
    };
  } {
    const pipelineReports: Array<{
      pipeline: DataPipeline;
      health: ReturnType<DataPipelineTuner['calculateHealthScore']>;
      optimizations: PipelineOptimization[];
    }> = [];
    
    let totalHealth = 0;
    let criticalCount = 0;
    let totalOpts = 0;
    
    for (const pipeline of this.pipelines.values()) {
      const health = this.calculateHealthScore(pipeline.id);
      const optimizations = this.analyzePipeline(pipeline.id);
      
      pipelineReports.push({ pipeline, health, optimizations });
      
      totalHealth += health.score;
      if (health.status === 'critical') criticalCount++;
      totalOpts += optimizations.length;
    }
    
    // Trier par score de santé (les plus bas en premier)
    pipelineReports.sort((a, b) => a.health.score - b.health.score);
    
    return {
      pipelines: pipelineReports,
      summary: {
        totalPipelines: this.pipelines.size,
        averageHealth: Math.round(totalHealth / this.pipelines.size),
        criticalPipelines: criticalCount,
        totalOptimizations: totalOpts
      }
    };
  }
  
  /**
   * Appliquer une optimisation à un pipeline
   */
  applyOptimization(optimization: PipelineOptimization): boolean {
    const pipeline = this.pipelines.get(optimization.pipelineId);
    if (!pipeline) return false;
    
    switch (optimization.type) {
      case 'parallelize':
        pipeline.config.parallelism *= 2;
        break;
      case 'cache':
        pipeline.config.caching = { enabled: true, ttlMinutes: 30 };
        break;
      case 'batch':
        pipeline.config.batchSize = Math.max(1, Math.floor(pipeline.config.batchSize / 2));
        break;
      default:
        logger.debug(`Applied ${optimization.type}: ${optimization.implementation}`);
    }
    
    logger.debug(`✅ Applied optimization: ${optimization.id}`);
    return true;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const dataPipelineTuner = new DataPipelineTuner();
