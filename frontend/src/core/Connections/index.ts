/**
 * CHE·NU™ — CONNECTIONS MODULE
 * 
 * Système de connexions réutilisables entre sphères
 * Optimisé pour les 60 scénarios et profils utilisateurs
 */

// Templates de connexion (15 templates réutilisables)
export * from './connectionTemplates';

// Moteur d'exécution
export * from './connectionEngine';

// User-Connection Matcher (recommandations automatiques)
export * from './userConnectionMatcher';

// Workflow Optimizer (chaînes et optimisations)
export * from './workflowOptimizer';

// Cross-User Learning (apprentissage croisé)
export * from './crossUserLearning';

// Types réexportés pour facilité d'utilisation
export type {
  ConnectionTemplate,
  SphereId,
  ConnectionTrigger,
  AutomationLevel,
  DataFlowDirection,
  DataElement,
  ConnectionConfig
} from './connectionTemplates';

export type {
  ConnectionInstance,
  ConnectionExecution
} from './connectionEngine';

export type {
  UserProfile,
  UserArchetype,
  ConnectionRecommendation,
  UserConnectionPlan
} from './userConnectionMatcher';

export type {
  WorkflowChain,
  WorkflowStep,
  OptimizationSuggestion,
  BatchOperation
} from './workflowOptimizer';

export type {
  UsagePattern,
  LearningInsight,
  ArchetypeProfile
} from './crossUserLearning';
