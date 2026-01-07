/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — CANON TYPES (TypeScript)                        ║
 * ║                                                                              ║
 * ║  TypeScript types for Need Canon, Module Catalog, and Scenarios             ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NEED CANON TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type RiskIfUnmet =
  | 'drift' | 'paralysis' | 'scope_creep'
  | 'delay' | 'abandonment' | 'missed_deadlines'
  | 'context_loss' | 'rework' | 'duplicated_effort'
  | 'system_failure' | 'security_incident' | 'irreversible_damage'
  | 'breach' | 'harm' | 'trust_loss'
  | 'abandon' | 'fear' | 'avoidance'
  | 'stagnation' | 'repeat_mistakes'
  | 'conflict' | 'duplication' | 'misalignment'
  | 'silence' | 'confusion' | 'missed_context'
  | 'poor_decisions' | 'missed_opportunities'
  | 'mess' | 'slowdown' | 'loss_of_control'
  | 'cross_tenant_leak' | 'legal_risk'
  | 'disengagement' | 'cognitive_overload'
  | 'downtime' | 'data_loss' | 'fragility'
  | 'lag' | 'cost_spike' | 'user_frustration';

export interface Need {
  id: string;
  label: string;
  description: string;
  urgencyLevels: UrgencyLevel[];
  risksIfUnmet: RiskIfUnmet[];
}

export interface NeedMapping {
  primaryNeeds: string[];
  secondaryNeeds?: string[];
}

// The 15 Fundamental Needs
export const NEED_IDS = [
  'need.clarity',
  'need.execution',
  'need.memory',
  'need.governance',
  'need.safety',
  'need.trust',
  'need.learning',
  'need.coordination',
  'need.communication',
  'need.discovery',
  'need.organization',
  'need.identity',
  'need.presence',
  'need.resilience',
  'need.performance',
] as const;

export type NeedId = typeof NEED_IDS[number];

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE CATALOG TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ActivationMode =
  | 'disabled'
  | 'enabled_passive'
  | 'enabled_guided'
  | 'enabled_balanced'
  | 'enabled_autonomous'
  | 'enabled_restricted'
  | 'enabled_overclocked';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type CostProfile = 'free' | 'low' | 'medium' | 'high' | 'variable';

export type ModuleCategory =
  | 'core'
  | 'communication'
  | 'governance'
  | 'agents'
  | 'simulation'
  | 'xr'
  | 'integration'
  | 'analytics';

export interface Module {
  id: string;
  category: ModuleCategory;
  needsServed: string[];
  dependencies: string[];
  riskLevel: RiskLevel;
  costProfile: CostProfile;
  riskProfile: string[];
  activationModes: ActivationMode[];
  knownUsages: string[];
  label?: string;
  description?: string;
  requiresGovernance?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGIAIRE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type UserSignal = 'silent' | 'rephrase' | 'correct' | 'approve' | 'unknown';
export type LearningValue = 'low' | 'med' | 'high';
export type RecurrenceEstimate = 'low' | 'med' | 'high';
export type Priority = 'low' | 'med' | 'high';
export type PromotionStatus = 'none' | 'candidate' | 'promoted' | 'rejected';

export interface StagiaireNote {
  noteId: string;
  timestamp: string;
  sphere: string;
  sector?: string;
  intentSummary: string;
  ambiguities: string[];
  outsourcingUsed: boolean;
  outsourcingReason?: string;
  userSignal: UserSignal;
  learningValue: LearningValue;
  recurrenceEstimate: RecurrenceEstimate;
  priority: Priority;
  questionCandidate?: string;
  promotionStatus: PromotionStatus;
}

export interface PromotionCandidate {
  noteId: string;
  sphere: string;
  sector?: string;
  intentSummary: string;
  questionCandidate?: string;
  reason: string;
  timestamp: string;
}

export interface CooldownState {
  lastActivation?: string;
  cooldownMinutes: number;
  isInCooldown: boolean;
  remainingSeconds: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSEUR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type FailureType =
  // Échec de compréhension d'intention
  | 'intent_misread'
  | 'intent_no_convergence'
  | 'intent_correct_but_wrong'
  // Échec de stabilité
  | 'stability_reconfirm'
  | 'stability_excessive_doubt'
  | 'stability_oscillation'
  // Échec de récupération de contexte
  | 'context_lost_thread'
  | 'context_too_many_reformulations'
  | 'context_drift'
  // Échec de jugement de confiance
  | 'confidence_unnecessary_outsource'
  | 'confidence_over_verification'
  | 'confidence_false_uncertainty';

export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RecenteringStatus = 'pending' | 'applied' | 'rejected' | 'expired';

export interface FailureMarker {
  markerId: string;
  timestamp: string;
  failureType: FailureType;
  severity: FailureSeverity;
  description: string;
  sphere: string;
  threadId?: string;
  conversationId?: string;
  evidence: string[];
  resolved: boolean;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface RecenteringFile {
  fileId: string;
  createdAt: string;
  sphere: string;
  threadId?: string;
  validatedIntents: string[];
  explicitDecisions: string[];
  grantedPermissions: string[];
  workingStructures: string[];
  closedHypotheses: string[];
  status: RecenteringStatus;
  appliedAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type FactorCategory = 'profile' | 'circumstance' | 'tool' | 'cadence' | 'stress';
export type StepType = 'action' | 'system' | 'checkpoint' | 'wait' | 'decision';
export type RunStatus = 'planned' | 'running' | 'completed' | 'failed' | 'aborted';

export interface Factor {
  id: string;
  category: FactorCategory;
  label: string;
  description: string;
  possibleValues: string[];
  defaultValue: string;
}

export interface ScenarioStep {
  id: string;
  stepType: StepType;
  label: string;
  needs: string[];
  modulesRequired: string[];
  description?: string;
  durationMinutes: number;
}

export interface ScenarioPhase {
  id: string;
  label: string;
  steps: ScenarioStep[];
}

export interface ScenarioTemplate {
  templateId: string;
  label: string;
  description: string;
  durationDays: number;
  phases: ScenarioPhase[];
  requiredFactors: string[];
}

export interface FactorSelection {
  [factorId: string]: string;
}

export interface SimulationRun {
  runId: string;
  templateId: string;
  factors: FactorSelection;
  modules: string[];
  status: RunStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  currentPhase?: string;
  currentStep?: string;
  events: SimulationEvent[];
  metrics: Record<string, unknown>;
}

export interface SimulationEvent {
  timestamp: string;
  type: string;
  data: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CanonApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface NeedCanonResponse {
  version: string;
  needs: Need[];
}

export interface ModuleCatalogResponse {
  version: string;
  modules: Module[];
}

export interface ScenarioTemplatesResponse {
  templates: ScenarioTemplate[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS (React Query compatible)
// ═══════════════════════════════════════════════════════════════════════════════

export const CANON_QUERY_KEYS = {
  needs: ['canon', 'needs'] as const,
  modules: ['canon', 'modules'] as const,
  scenarios: ['canon', 'scenarios'] as const,
  stagiaire: {
    notes: (sphere?: string) => ['stagiaire', 'notes', sphere] as const,
    promotions: ['stagiaire', 'promotions'] as const,
  },
  professeur: {
    failures: (resolved?: boolean) => ['professeur', 'failures', resolved] as const,
    recentering: (fileId?: string) => ['professeur', 'recentering', fileId] as const,
  },
  simulation: {
    runs: ['simulation', 'runs'] as const,
    run: (runId: string) => ['simulation', 'run', runId] as const,
  },
} as const;
