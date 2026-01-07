/**
 * CHE·NU™ LOCAL INVESTMENT & INITIATIVE COMMITMENT — TYPE DEFINITIONS
 * 
 * Governance module ensuring CHE·NU does not extract value from
 * communities without reinvesting in them.
 * 
 * This is NOT:
 * - a token sale
 * - an investment fund pitch
 * - a DAO experiment
 * - a financial product promise
 * 
 * It IS a responsibility mechanism.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 * @category Governance
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE PRINCIPLES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Foundation principle: Value generated within CHE·NU should partially
 * return to the environments where it is created.
 */
export interface InitiativeCommitmentPrinciple {
  /** Core commitment */
  commitment: 'Value returns to communities where created';
  
  /** What CHE·NU supports */
  supports: [
    'local projects',
    'early-stage initiatives',
    'community-rooted startups',
    'practical real-world needs'
  ];
  
  /** Priority criteria */
  priority: [
    'utility',
    'sustainability',
    'accountability',
    'long-term impact'
  ];
  
  /** What this is NOT */
  not_charity: true;
  not_speculation: true;
  is_infrastructure_backed_reinvestment: true;
}

/**
 * Ethical constraints that govern all initiative funding
 */
export interface EthicalConstraints {
  no_coercion: true;
  no_dependency_creation: true;
  no_opaque_financial_mechanisms: true;
  no_extraction_first_logic: true;
  participation_voluntary: true;
  exit_always_possible: true;
}

export const ETHICAL_CONSTRAINTS: EthicalConstraints = {
  no_coercion: true,
  no_dependency_creation: true,
  no_opaque_financial_mechanisms: true,
  no_extraction_first_logic: true,
  participation_voluntary: true,
  exit_always_possible: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIATIVE CRYPTO INSTRUMENT (ABSTRACTED)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The CHE·NU Initiative Crypto instrument characteristics
 * Designed exclusively for initiative funding, not speculation
 */
export interface InitiativeCryptoInstrument {
  /** What it IS */
  characteristics: {
    utility_oriented: true;
    non_speculative_by_design: true;
    governed_by_transparent_rules: true;
    disconnected_from_attention_mechanics: true;
    disconnected_from_hype_mechanics: true;
  };
  
  /** What it exists FOR */
  purposes: [
    'allocate resources',
    'track contributions',
    'support project lifecycles'
  ];
  
  /** What it does NOT exist for */
  forbidden_purposes: [
    'promise financial returns',
    'encourage trading',
    'extract value from volatility'
  ];
}

/**
 * Instrument configuration (abstracted)
 */
export interface InstrumentConfiguration {
  /** Name of the instrument */
  name: string;
  
  /** Symbol (if applicable) */
  symbol?: string;
  
  /** Governance rules reference */
  governance_rules: string;
  
  /** Transparency requirements */
  transparency_level: 'full' | 'auditable';
  
  /** Trading restrictions */
  trading_restrictions: {
    speculative_trading_prohibited: true;
    utility_only: true;
    transfer_limits?: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUND USAGE SCOPE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Allowed uses of initiative funds
 */
export type AllowedFundUse =
  | 'project_startup_costs'
  | 'tooling_and_infrastructure'
  | 'local_services_and_suppliers'
  | 'research_and_prototyping'
  | 'early_operational_stability';

/**
 * Forbidden uses of initiative funds
 */
export type ForbiddenFundUse =
  | 'speculation'
  | 'unrelated_financial_instruments'
  | 'personal_enrichment_without_accountability';

/**
 * Fund allocation record
 */
export interface FundAllocation {
  /** Unique allocation ID */
  id: string;
  
  /** Project receiving funds */
  project_id: string;
  
  /** Amount allocated */
  amount: number;
  
  /** Currency/instrument */
  currency: string;
  
  /** Intended use (must be allowed) */
  intended_use: AllowedFundUse;
  
  /** Detailed description */
  description: string;
  
  /** Allocation date */
  allocated_at: string;
  
  /** Approved by (human, never agent) */
  approved_by: string;
  
  /** Decision rationale */
  rationale: string;
  
  /** Context snapshot reference */
  context_snapshot_id?: string;
  
  /** Is this reversible? */
  reversible: boolean;
  
  /** Reversal conditions (if reversible) */
  reversal_conditions?: string;
  
  /** Status */
  status: 'pending' | 'approved' | 'disbursed' | 'completed' | 'reversed';
  
  /** Traceability */
  audit_trail: AllocationAuditEntry[];
}

export interface AllocationAuditEntry {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT ELIGIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Requirements for projects to be eligible for support
 */
export interface ProjectEligibilityCriteria {
  /** Must be rooted in a real local context */
  local_context_required: true;
  
  /** Must address a concrete need */
  concrete_need_required: true;
  
  /** Must have a human owner accountable for outcomes */
  human_accountability_required: true;
  
  /** Must agree to transparency requirements */
  transparency_agreement_required: true;
  
  /** Must respect CHE·NU Foundation Laws */
  foundation_laws_compliance_required: true;
  
  /** NOT required to be tech-focused */
  tech_focus_not_required: true;
  
  /** Value defined by usefulness, not innovation theater */
  usefulness_over_innovation_theater: true;
}

export const PROJECT_ELIGIBILITY: ProjectEligibilityCriteria = {
  local_context_required: true,
  concrete_need_required: true,
  human_accountability_required: true,
  transparency_agreement_required: true,
  foundation_laws_compliance_required: true,
  tech_focus_not_required: true,
  usefulness_over_innovation_theater: true,
};

/**
 * Project application
 */
export interface InitiativeProject {
  /** Unique project ID */
  id: string;
  
  /** Project name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Local context description */
  local_context: LocalContext;
  
  /** The concrete need being addressed */
  concrete_need: string;
  
  /** Human owner (accountable) */
  human_owner: ProjectOwner;
  
  /** Team members (if any) */
  team?: TeamMember[];
  
  /** Requested support */
  requested_support: SupportRequest;
  
  /** Timeline */
  timeline: ProjectTimeline;
  
  /** Transparency agreement signed */
  transparency_agreed: boolean;
  
  /** Foundation laws compliance confirmed */
  foundation_laws_confirmed: boolean;
  
  /** Application status */
  status: ProjectStatus;
  
  /** Eligibility assessment */
  eligibility?: EligibilityAssessment;
  
  /** Funding history */
  funding_history: FundAllocation[];
  
  /** Progress reports */
  progress_reports: ProgressReport[];
  
  /** Created at */
  created_at: string;
  
  /** Last updated */
  updated_at: string;
}

export interface LocalContext {
  /** Geographic location */
  location: string;
  
  /** Community description */
  community: string;
  
  /** Local connection explanation */
  local_connection: string;
  
  /** Expected local impact */
  expected_local_impact: string;
}

export interface ProjectOwner {
  /** Owner ID */
  id: string;
  
  /** Name */
  name: string;
  
  /** Contact information */
  contact: string;
  
  /** Accountability statement */
  accountability_statement: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface SupportRequest {
  /** Type of support needed */
  type: AllowedFundUse;
  
  /** Amount requested */
  amount: number;
  
  /** Currency */
  currency: string;
  
  /** Detailed breakdown */
  breakdown: SupportBreakdown[];
  
  /** How funds will be used */
  usage_plan: string;
}

export interface SupportBreakdown {
  category: string;
  amount: number;
  description: string;
}

export interface ProjectTimeline {
  /** Start date */
  start_date: string;
  
  /** Expected milestones */
  milestones: Milestone[];
  
  /** Expected completion */
  expected_completion?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  target_date: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'delayed';
}

export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'eligible'
  | 'ineligible'
  | 'approved'
  | 'active'
  | 'completed'
  | 'withdrawn';

export interface EligibilityAssessment {
  /** Assessed at */
  assessed_at: string;
  
  /** Assessed by (human) */
  assessed_by: string;
  
  /** Is eligible? */
  eligible: boolean;
  
  /** Criteria check results */
  criteria_results: Record<keyof ProjectEligibilityCriteria, boolean>;
  
  /** Notes */
  notes: string;
  
  /** If ineligible, reason */
  ineligibility_reason?: string;
}

export interface ProgressReport {
  id: string;
  project_id: string;
  report_date: string;
  submitted_by: string;
  milestone_updates: MilestoneUpdate[];
  funds_utilized: number;
  funds_remaining: number;
  challenges: string;
  next_steps: string;
  lessons_learned: string;
}

export interface MilestoneUpdate {
  milestone_id: string;
  status: 'completed' | 'in_progress' | 'delayed' | 'blocked';
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION & GOVERNANCE MODEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Investment decisions follow CHE·NU principles
 */
export interface GovernanceModel {
  /** Explicit decision ownership */
  explicit_decision_ownership: true;
  
  /** Documented rationale */
  documented_rationale: true;
  
  /** Context snapshots */
  context_snapshots: true;
  
  /** No silent allocation */
  no_silent_allocation: true;
  
  /** Agent capabilities */
  agent_capabilities: {
    may_assist_with: ['analysis', 'risk_clarification', 'scenario_simulation'];
    may_not: ['approve_funding', 'allocate_resources', 'override_human_judgment'];
  };
  
  /** Final responsibility */
  final_responsibility: 'humans';
}

export const GOVERNANCE_MODEL: GovernanceModel = {
  explicit_decision_ownership: true,
  documented_rationale: true,
  context_snapshots: true,
  no_silent_allocation: true,
  agent_capabilities: {
    may_assist_with: ['analysis', 'risk_clarification', 'scenario_simulation'],
    may_not: ['approve_funding', 'allocate_resources', 'override_human_judgment'],
  },
  final_responsibility: 'humans',
};

/**
 * Investment decision record
 */
export interface InvestmentDecision {
  /** Decision ID */
  id: string;
  
  /** Project being considered */
  project_id: string;
  
  /** Decision type */
  type: 'approve' | 'reject' | 'request_changes' | 'defer';
  
  /** Decision maker (human) */
  decision_maker: string;
  
  /** Decision rationale */
  rationale: string;
  
  /** Context at decision time */
  context_snapshot_id: string;
  
  /** Agent analysis (if any) */
  agent_analysis?: AgentAnalysis;
  
  /** Decision date */
  decided_at: string;
  
  /** Is this reversible? */
  reversible: boolean;
  
  /** Reversal window (if applicable) */
  reversal_window_days?: number;
}

export interface AgentAnalysis {
  /** Agent that provided analysis */
  agent_id: string;
  
  /** Analysis type */
  type: 'risk_clarification' | 'scenario_simulation' | 'general_analysis';
  
  /** Analysis content */
  content: string;
  
  /** Factors identified */
  factors: AnalysisFactor[];
  
  /** Explicitly NOT a recommendation */
  is_not_recommendation: true;
  
  /** Timestamp */
  provided_at: string;
}

export interface AnalysisFactor {
  name: string;
  description: string;
  assessment: 'positive' | 'neutral' | 'concern' | 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPARENCY & TRACEABILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * All initiative funding is logged, auditable, narratively traceable
 */
export interface TransparencyRequirements {
  /** All allocations logged */
  allocations_logged: true;
  
  /** All decisions auditable */
  decisions_auditable: true;
  
  /** Narrative replay available */
  narrative_replay_available: true;
  
  /** Purpose of transparency */
  purpose: 'build trust, not perform accountability theater';
}

/**
 * Narrative for initiative funding journey
 */
export interface InitiativeNarrative {
  /** Project ID */
  project_id: string;
  
  /** Narrative timeline */
  timeline: NarrativeEvent[];
  
  /** Key decisions */
  key_decisions: string[];
  
  /** Lessons learned */
  lessons_learned: string[];
  
  /** Can be used to show how project started */
  shows_origin: true;
  
  /** Can track decision evolution */
  tracks_decisions: true;
  
  /** Preserves lessons */
  preserves_lessons: true;
}

export interface NarrativeEvent {
  timestamp: string;
  event_type: 'application' | 'review' | 'decision' | 'allocation' | 'milestone' | 'report' | 'completion';
  title: string;
  description: string;
  actor: string;
  context_snapshot_id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFIT & RETURNS RELATIONSHIP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CHE·NU does not guarantee financial returns
 */
export interface ReturnsPolicy {
  /** No guaranteed returns */
  no_guaranteed_returns: true;
  
  /** What value generated may be used for */
  value_may_be: [
    'reinvested into ecosystem',
    'used to support future initiatives',
    'allocated according to predefined governance rules'
  ];
  
  /** Priorities */
  priorities: ['continuity', 'resilience', 'shared_growth'];
}

export const RETURNS_POLICY: ReturnsPolicy = {
  no_guaranteed_returns: true,
  value_may_be: [
    'reinvested into ecosystem',
    'used to support future initiatives',
    'allocated according to predefined governance rules',
  ],
  priorities: ['continuity', 'resilience', 'shared_growth'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * What this commitment is NOT
 */
export type InitiativeCommitmentNonGoal =
  | 'token_sale'
  | 'investment_fund_pitch'
  | 'dao_experiment'
  | 'financial_product_promise';

export const INITIATIVE_NON_GOALS: InitiativeCommitmentNonGoal[] = [
  'token_sale',
  'investment_fund_pitch',
  'dao_experiment',
  'financial_product_promise',
];

/**
 * It IS a responsibility mechanism
 */
export const INITIATIVE_IS = 'A RESPONSIBILITY MECHANISM' as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC STATEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const PUBLIC_COMMITMENT_STATEMENT = `
CHE·NU publicly commits to:

"Using its infrastructure not only to organize thought
and decision-making, but also to support concrete,
local, human-scale projects that strengthen communities."

This commitment is structural, not promotional.
`;

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const INITIATIVE_COMMITMENT_METADATA = {
  name: 'Local Investment & Initiative Commitment',
  version: '1.0.0',
  status: 'V51-extension',
  base: 'V51 (FROZEN)',
  category: 'Governance',
  modifies_core: false,
  
  purpose: 'Ensure CHE·NU does not extract value without reinvesting in communities',
  
  core_principle: 'Value returns to communities where created',
  
  what_it_is: INITIATIVE_IS,
  
  what_it_is_not: INITIATIVE_NON_GOALS,
  
  ethical_constraints: Object.keys(ETHICAL_CONSTRAINTS),
  
  final_responsibility: 'humans',
} as const;
