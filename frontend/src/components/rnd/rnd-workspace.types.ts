/**
 * CHE·NU™ R&D Workspace Types
 * 
 * Interface universelle de Recherche & Développement
 * (science, innovation, produit, stratégie)
 * 
 * "L'interface structure. L'agent R&D analyse. L'humain décide."
 */

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

export type RnDPhase = 1 | 2 | 3 | 4 | 5 | 6;

export type RnDPhaseId = 
  | 'exploration'
  | 'selection'
  | 'examples'
  | 'comparison'
  | 'refinement'
  | 'decision';

export interface RnDPhaseInfo {
  id: RnDPhaseId;
  phase: RnDPhase;
  name: string;
  objective: string;
  color: string;
  icon: string;
  agentAllowed: string[];
  agentForbidden: string[];
  quantitativeModulesAvailable: boolean;
}

export const RND_PHASES: Record<RnDPhase, RnDPhaseInfo> = {
  1: {
    id: 'exploration',
    phase: 1,
    name: 'Exploration / Brainstorm',
    objective: 'Explorer librement, sans jugement',
    color: '#3B82F6', // blue
    icon: '🔵',
    agentAllowed: ['regroup_ideas', 'reformulate', 'identify_themes'],
    agentForbidden: ['quantitative_analysis', 'make_decisions', 'delete_ideas'],
    quantitativeModulesAvailable: false,
  },
  2: {
    id: 'selection',
    phase: 2,
    name: 'Sélection',
    objective: 'Choisir ce qui mérite d\'être approfondi',
    color: '#EAB308', // yellow
    icon: '🟡',
    agentAllowed: ['comparative_synthesis', 'highlight_disagreements'],
    agentForbidden: ['impose_scores', 'delete_ideas', 'make_decisions'],
    quantitativeModulesAvailable: false,
  },
  3: {
    id: 'examples',
    phase: 3,
    name: 'Génération d\'Exemples',
    objective: 'Tester les idées sélectionnées par le concret',
    color: '#22C55E', // green
    icon: '🟢',
    agentAllowed: ['generate_variants', 'propose_counter_examples', 'simulate_scenarios'],
    agentForbidden: ['make_decisions', 'delete_ideas'],
    quantitativeModulesAvailable: true,
  },
  4: {
    id: 'comparison',
    phase: 4,
    name: 'Comparaison des Solutions',
    objective: 'Comparer objectivement les options',
    color: '#F97316', // orange
    icon: '🟠',
    agentAllowed: ['comparative_analysis', 'synthesis_pros_cons', 'detect_inconsistencies'],
    agentForbidden: ['make_decisions', 'impose_rankings'],
    quantitativeModulesAvailable: true,
  },
  5: {
    id: 'refinement',
    phase: 5,
    name: 'Perfectionnement',
    objective: 'Améliorer la meilleure option',
    color: '#EF4444', // red
    icon: '🔴',
    agentAllowed: ['optimization_suggestions', 'detect_hidden_risks', 'coherence_check'],
    agentForbidden: ['make_decisions', 'change_selection'],
    quantitativeModulesAvailable: true,
  },
  6: {
    id: 'decision',
    phase: 6,
    name: 'Décision & Output',
    objective: 'Clore proprement',
    color: '#A855F7', // purple
    icon: '🟣',
    agentAllowed: ['final_synthesis', 'executive_summary', 'vigilance_points'],
    agentForbidden: ['override_decision', 'modify_justification'],
    quantitativeModulesAvailable: false,
  },
};

// ============================================================================
// PROJECT DOMAIN
// ============================================================================

export type RnDDomain = 
  | 'science'
  | 'product'
  | 'strategy'
  | 'innovation'
  | 'technical'
  | 'other';

export const RND_DOMAINS: Record<RnDDomain, { label: string; icon: string }> = {
  science: { label: 'Science', icon: '🔬' },
  product: { label: 'Produit', icon: '📦' },
  strategy: { label: 'Stratégie', icon: '🎯' },
  innovation: { label: 'Innovation', icon: '💡' },
  technical: { label: 'Technique', icon: '⚙️' },
  other: { label: 'Autre', icon: '📋' },
};

// ============================================================================
// R&D PROJECT
// ============================================================================

export interface RnDProject {
  id: string;
  name: string;
  domain: RnDDomain;
  objective: string; // 1 phrase claire
  currentPhase: RnDPhase;
  status: 'active' | 'paused' | 'completed' | 'archived';
  created_at: string;
  created_by: string;
  updated_at: string;
  participants: RnDParticipant[];
  phaseData: RnDPhaseData;
}

export interface RnDParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'researcher' | 'reviewer';
  joined_at: string;
}

// ============================================================================
// PHASE 1: EXPLORATION - IDEAS
// ============================================================================

export type IdeaType = 'idea' | 'question' | 'hypothesis' | 'inspiration';

export interface RnDIdea {
  id: string;
  type: IdeaType;
  content: string;
  created_by: string;
  created_at: string;
  tags: string[];
  theme?: string; // regroupement par l'agent
  // NO hierarchy, NO score, NO deletion
}

// ============================================================================
// PHASE 2: SELECTION - CRITERIA & VOTES
// ============================================================================

export interface SelectionCriterion {
  id: string;
  name: string;
  description?: string;
  weight: number; // 0-100
}

export const DEFAULT_SELECTION_CRITERIA: SelectionCriterion[] = [
  { id: 'feasibility', name: 'Faisabilité', weight: 25 },
  { id: 'impact', name: 'Impact', weight: 30 },
  { id: 'cost', name: 'Coût', weight: 20 },
  { id: 'risk', name: 'Risque', weight: 25 },
];

export interface IdeaVote {
  idea_id: string;
  voter_id: string;
  criterion_id: string;
  score: number; // 1-5
  justification: string; // OBLIGATOIRE
  voted_at: string;
}

export interface IdeaSelection {
  idea_id: string;
  status: 'selected' | 'rejected' | 'pending';
  total_score: number;
  votes: IdeaVote[];
  rejection_reason?: string; // Archivé et visible
}

// ============================================================================
// PHASE 3: EXAMPLES - SCENARIOS
// ============================================================================

export type ScenarioType = 'standard' | 'edge_case' | 'counter_example' | 'simulation';

export interface RnDScenario {
  id: string;
  idea_id: string;
  type: ScenarioType;
  title: string;
  description: string;
  hypothesis: string;
  expected_outcome?: string;
  actual_outcome?: string;
  created_by: string;
  created_at: string;
  agent_generated: boolean;
}

// ============================================================================
// PHASE 4: COMPARISON - MATRIX
// ============================================================================

export interface ComparisonCriterion {
  id: string;
  name: string;
  weight: number;
  type: 'quantitative' | 'qualitative';
}

export interface SolutionEvaluation {
  solution_id: string; // idea_id from selected
  criterion_id: string;
  score: number;
  notes: string;
  evaluated_by: string;
  evaluated_at: string;
}

export interface ComparisonMatrix {
  criteria: ComparisonCriterion[];
  solutions: string[]; // idea_ids
  evaluations: SolutionEvaluation[];
  disagreements: ComparisonDisagreement[]; // Documented, not erased
}

export interface ComparisonDisagreement {
  id: string;
  criterion_id: string;
  solution_id: string;
  participant_a: string;
  participant_b: string;
  score_a: number;
  score_b: number;
  resolution?: string;
  resolved: boolean;
}

// ============================================================================
// PHASE 5: REFINEMENT - ITERATIONS
// ============================================================================

export interface RefinementIteration {
  id: string;
  solution_id: string;
  version: number;
  changes: string;
  rationale: string;
  created_by: string;
  created_at: string;
  risks_detected: string[];
  agent_suggestions?: string[];
}

// ============================================================================
// PHASE 6: DECISION - OUTPUT
// ============================================================================

export type OutputType = 
  | 'scientific_document'
  | 'rnd_plan'
  | 'conceptual_prototype'
  | 'strategic_recommendation'
  | 'technical_specification'
  | 'other';

export interface RnDDecision {
  id: string;
  project_id: string;
  final_solution_id: string;
  justification: string;
  rejected_hypotheses: RejectedHypothesis[];
  known_limitations: string[];
  next_steps: string[];
  decided_by: string;
  decided_at: string;
}

export interface RejectedHypothesis {
  idea_id: string;
  reason: string;
}

export interface RnDOutput {
  id: string;
  project_id: string;
  type: OutputType;
  title: string;
  content: string;
  attachments: string[];
  created_by: string;
  created_at: string;
}

// ============================================================================
// PHASE DATA CONTAINER
// ============================================================================

export interface RnDPhaseData {
  phase1: {
    ideas: RnDIdea[];
    themes: string[];
  };
  phase2: {
    criteria: SelectionCriterion[];
    selections: IdeaSelection[];
    shortlist: string[]; // idea_ids
  };
  phase3: {
    scenarios: RnDScenario[];
  };
  phase4: {
    matrix: ComparisonMatrix;
    rankings: { solution_id: string; total_score: number }[];
  };
  phase5: {
    focusedSolutions: string[]; // 1-2 solution_ids
    iterations: RefinementIteration[];
  };
  phase6: {
    decision?: RnDDecision;
    outputs: RnDOutput[];
  };
}

// ============================================================================
// R&D AGENT - CANONICAL ROLE
// ============================================================================

export interface RnDAgentConfig {
  enabled: boolean;
  currentPhase: RnDPhase;
}

export interface RnDAgentRequest {
  id: string;
  type: RnDAgentAction;
  phase: RnDPhase;
  context: Record<string, unknown>;
  requested_by: string;
  requested_at: string;
}

export type RnDAgentAction =
  // Phase 1
  | 'regroup_ideas'
  | 'reformulate'
  | 'identify_themes'
  // Phase 2
  | 'comparative_synthesis'
  | 'highlight_disagreements'
  // Phase 3
  | 'generate_variants'
  | 'propose_counter_examples'
  | 'simulate_scenarios'
  // Phase 4
  | 'comparative_analysis'
  | 'synthesis_pros_cons'
  | 'detect_inconsistencies'
  // Phase 5
  | 'optimization_suggestions'
  | 'detect_hidden_risks'
  | 'coherence_check'
  // Phase 6
  | 'final_synthesis'
  | 'executive_summary'
  | 'vigilance_points';

/**
 * R&D AGENT RULES (CANONICAL)
 * 
 * Fonction: Analyste et accélérateur cognitif, JAMAIS décideur.
 */
export const RND_AGENT_RULES = {
  role: 'analyst_and_cognitive_accelerator',
  never_decides: true,
  
  allowed: [
    'analyze_results',
    'compare_options',
    'detect_inconsistencies',
    'propose_paths',
    'synthesize',
  ],
  
  forbidden: [
    'make_final_decision',
    'delete_ideas',
    'impose_score',
    'act_without_explicit_request',
  ],
  
  principle: 'L\'agent répond, il ne dirige pas.',
};

// ============================================================================
// QUANTITATIVE MODULES
// ============================================================================

export type QuantitativeModuleType =
  | 'decision_matrix'
  | 'weighted_scoring'
  | 'parametric_simulation'
  | 'sensitivity_analysis'
  | 'probabilistic_estimation';

export interface QuantitativeModule {
  id: QuantitativeModuleType;
  name: string;
  description: string;
  availableInPhases: RnDPhase[];
  icon: string;
}

export const QUANTITATIVE_MODULES: QuantitativeModule[] = [
  {
    id: 'decision_matrix',
    name: 'Matrice de Décision',
    description: 'Évaluation multicritère structurée',
    availableInPhases: [4, 5],
    icon: '📊',
  },
  {
    id: 'weighted_scoring',
    name: 'Scoring Pondéré',
    description: 'Attribution de scores avec poids configurables',
    availableInPhases: [3, 4, 5],
    icon: '⚖️',
  },
  {
    id: 'parametric_simulation',
    name: 'Simulation Paramétrique',
    description: 'Tester des variations de paramètres',
    availableInPhases: [3, 4, 5],
    icon: '🔄',
  },
  {
    id: 'sensitivity_analysis',
    name: 'Analyse de Sensibilité',
    description: 'Impact des variations sur le résultat',
    availableInPhases: [4, 5],
    icon: '📈',
  },
  {
    id: 'probabilistic_estimation',
    name: 'Estimation Probabiliste',
    description: 'Distributions et intervalles de confiance',
    availableInPhases: [3, 4, 5],
    icon: '🎲',
  },
];

export interface QuantitativeModuleRequest {
  id: string;
  module_type: QuantitativeModuleType;
  input_data: Record<string, unknown>;
  requested_by: string;
  requested_at: string;
}

export interface QuantitativeModuleResult {
  request_id: string;
  output_data: Record<string, unknown>;
  interpretation?: string; // Agent interprets, human validates
  calculated_at: string;
}

/**
 * QUANTITATIVE MODULE PRINCIPLE
 * 
 * L'interface appelle le module → Le module calcule →
 * L'agent interprète → L'humain valide
 * 
 * Séparation claire: calcul / interprétation / décision
 */
export const QUANTITATIVE_PRINCIPLE = {
  flow: ['interface_calls', 'module_calculates', 'agent_interprets', 'human_validates'],
  separation: {
    calculation: 'module',
    interpretation: 'agent',
    decision: 'human',
  },
};

// ============================================================================
// MEMORY & TRACEABILITY (NON-NEGOTIABLE)
// ============================================================================

export interface TraceabilityRecord {
  id: string;
  project_id: string;
  event_type: 
    | 'idea_created'
    | 'idea_grouped'
    | 'selection_made'
    | 'selection_rejected'
    | 'criterion_changed'
    | 'scenario_created'
    | 'evaluation_made'
    | 'disagreement_logged'
    | 'iteration_made'
    | 'decision_made'
    | 'output_created';
  description: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  actor_id: string;
  actor_type: 'human' | 'agent';
  timestamp: string;
}

/**
 * TRACEABILITY REQUIREMENTS (NON-NEGOTIABLE)
 * 
 * À tout moment, l'interface permet de voir:
 * - Origine d'une idée
 * - Raisons d'un rejet
 * - Évolution d'un critère
 * - Décisions prises et par qui
 * 
 * Mémoire du raisonnement, pas seulement du résultat.
 */
export const TRACEABILITY_REQUIREMENTS = {
  always_visible: [
    'idea_origin',
    'rejection_reasons',
    'criterion_evolution',
    'decisions_and_actors',
  ],
  principle: 'Mémoire du raisonnement, pas seulement du résultat.',
};

// ============================================================================
// UI STATE
// ============================================================================

export interface RnDWorkspaceState {
  project: RnDProject | null;
  currentPhase: RnDPhase;
  agentPanelOpen: boolean;
  quantitativeModalOpen: boolean;
  selectedModuleType: QuantitativeModuleType | null;
  traceabilityPanelOpen: boolean;
}

// ============================================================================
// GOLDEN RULE
// ============================================================================

/**
 * RÈGLE D'OR DU WORKSPACE R&D
 * 
 * L'interface structure la pensée.
 * L'agent éclaire la complexité.
 * L'humain assume la décision.
 */
export const RND_GOLDEN_RULE = {
  interface: 'structure la pensée',
  agent: 'éclaire la complexité',
  human: 'assume la décision',
};
