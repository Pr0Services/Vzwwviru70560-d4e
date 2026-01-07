/**
 * CHE·NU™ — FINE-TUNING MODULE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Système complet de fine-tuning pour optimiser chaque aspect du système
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * COMPOSANTS:
 * - Token Optimizer: Réduction de 40-60% de la consommation de tokens
 * - Agent Performance Tuner: Optimisation des agents L0-L3
 * - UX Flow Optimizer: Réduction de la charge cognitive
 * - Data Pipeline Tuner: Optimisation des flux de données
 * - Fine-Tuning Orchestrator: Coordination de tous les systèmes
 */

// Token Optimization
export {
  TokenOptimizer,
  EncodingFineTuner,
  tokenOptimizer,
  encodingFineTuner,
  estimateTokens,
  OPTIMIZATION_RULES,
  ENCODING_PROFILES
} from './tokenOptimizer';

export type {
  TokenBudget,
  TokenUsageMetrics,
  OptimizationRule,
  OperationContext,
  CompressionResult,
  EncodingProfile
} from './tokenOptimizer';

// Agent Performance Tuning
export {
  AgentPerformanceTuner,
  agentPerformanceTuner,
  DEFAULT_TUNING_PARAMETERS,
  AGENT_PRESETS
} from './agentPerformanceTuner';

export type {
  AgentLevel,
  AgentMetrics,
  TuningParameter,
  AgentProfile,
  TuningRecommendation
} from './agentPerformanceTuner';

// UX Flow Optimization
export {
  UXFlowOptimizer,
  uxFlowOptimizer,
  UX_PRINCIPLES,
  STANDARD_FLOWS
} from './uxFlowOptimizer';

export type {
  UserFlow,
  FlowStep,
  CognitiveLoadMetrics,
  UXOptimization
} from './uxFlowOptimizer';

// Data Pipeline Tuning
export {
  DataPipelineTuner,
  dataPipelineTuner,
  STANDARD_PIPELINES,
  DATA_QUALITY_RULES
} from './dataPipelineTuner';

export type {
  DataPipeline,
  DataTransformation,
  PipelineOptimization,
  DataQualityRule
} from './dataPipelineTuner';

// Fine-Tuning Orchestrator
export {
  FineTuningOrchestrator,
  fineTuningOrchestrator,
  runSystemHealthCheck,
  runAutoTuning,
  generateOptimizationReport
} from './fineTuningOrchestrator';

export type {
  SystemHealth,
  OptimizationPlan,
  OptimizationAction,
  TuningSession
} from './fineTuningOrchestrator';
