/**
 * CHE·NU™ LOCAL INVESTMENT & INITIATIVE COMMITMENT — HOOKS
 * 
 * Custom hooks for managing initiative projects, decisions, and allocations.
 * All final decisions are human-made. Agents assist only with analysis.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  InitiativeProject,
  ProjectStatus,
  FundAllocation,
  AllowedFundUse,
  InvestmentDecision,
  EligibilityAssessment,
  ProgressReport,
  AgentAnalysis,
  InitiativeNarrative,
  NarrativeEvent,
  LocalContext,
  SupportRequest,
} from './initiative-commitment.types';
import {
  PROJECT_ELIGIBILITY,
  GOVERNANCE_MODEL,
  ETHICAL_CONSTRAINTS,
  RETURNS_POLICY,
} from './initiative-commitment.types';

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseInitiativeProjectsOptions {
  user_id: string;
  filter_status?: ProjectStatus[];
}

export interface UseInitiativeProjectsReturn {
  projects: InitiativeProject[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createProject: (draft: ProjectDraft) => Promise<InitiativeProject>;
  updateProject: (id: string, updates: Partial<InitiativeProject>) => Promise<void>;
  submitProject: (id: string) => Promise<void>;
  withdrawProject: (id: string, reason: string) => Promise<void>;
  
  // Queries
  getProject: (id: string) => InitiativeProject | undefined;
  getProjectsByStatus: (status: ProjectStatus) => InitiativeProject[];
  
  // Refresh
  refresh: () => Promise<void>;
}

export interface ProjectDraft {
  name: string;
  description: string;
  local_context: LocalContext;
  concrete_need: string;
  owner_name: string;
  owner_contact: string;
  owner_accountability_statement: string;
  requested_support: SupportRequest;
  timeline_start: string;
  expected_completion?: string;
}

export function useInitiativeProjects(options: UseInitiativeProjectsOptions): UseInitiativeProjectsReturn {
  const { user_id, filter_status } = options;
  
  const [projects, setProjects] = useState<InitiativeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Would fetch from backend
      const mockProjects: InitiativeProject[] = [];
      
      setProjects(filter_status 
        ? mockProjects.filter(p => filter_status.includes(p.status))
        : mockProjects
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [user_id, filter_status]);
  
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  const createProject = useCallback(async (draft: ProjectDraft): Promise<InitiativeProject> => {
    const project: InitiativeProject = {
      id: `project_${Date.now()}`,
      name: draft.name,
      description: draft.description,
      local_context: draft.local_context,
      concrete_need: draft.concrete_need,
      human_owner: {
        id: user_id,
        name: draft.owner_name,
        contact: draft.owner_contact,
        accountability_statement: draft.owner_accountability_statement,
      },
      requested_support: draft.requested_support,
      timeline: {
        start_date: draft.timeline_start,
        milestones: [],
        expected_completion: draft.expected_completion,
      },
      transparency_agreed: false,
      foundation_laws_confirmed: false,
      status: 'draft',
      funding_history: [],
      progress_reports: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, project]);
    return project;
  }, [user_id]);
  
  const updateProject = useCallback(async (id: string, updates: Partial<InitiativeProject>) => {
    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, updated_at: new Date().toISOString() }
        : p
    ));
  }, []);
  
  const submitProject = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    
    if (!project.transparency_agreed || !project.foundation_laws_confirmed) {
      throw new Error('Must agree to transparency and foundation laws before submitting');
    }
    
    await updateProject(id, { status: 'submitted' });
  }, [projects, updateProject]);
  
  const withdrawProject = useCallback(async (id: string, reason: string) => {
    await updateProject(id, { 
      status: 'withdrawn',
      // Would also log withdrawal reason
    });
  }, [updateProject]);
  
  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);
  
  const getProjectsByStatus = useCallback((status: ProjectStatus) => {
    return projects.filter(p => p.status === status);
  }, [projects]);
  
  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    submitProject,
    withdrawProject,
    getProject,
    getProjectsByStatus,
    refresh: loadProjects,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELIGIBILITY ASSESSMENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseEligibilityAssessmentOptions {
  project: InitiativeProject;
  assessor_id: string;
}

export interface UseEligibilityAssessmentReturn {
  assessment: EligibilityAssessment | null;
  isAssessing: boolean;
  
  // Check individual criteria
  checkLocalContext: () => boolean;
  checkConcreteNeed: () => boolean;
  checkHumanAccountability: () => boolean;
  checkTransparencyAgreement: () => boolean;
  checkFoundationLawsCompliance: () => boolean;
  
  // Full assessment (human action)
  performAssessment: (notes: string) => EligibilityAssessment;
  
  // Criteria summary
  criteriaResults: Record<string, boolean>;
  allCriteriaMet: boolean;
}

export function useEligibilityAssessment(options: UseEligibilityAssessmentOptions): UseEligibilityAssessmentReturn {
  const { project, assessor_id } = options;
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(project.eligibility || null);
  
  const checkLocalContext = useCallback((): boolean => {
    return !!(
      project.local_context.location &&
      project.local_context.community &&
      project.local_context.local_connection &&
      project.local_context.expected_local_impact
    );
  }, [project]);
  
  const checkConcreteNeed = useCallback((): boolean => {
    return project.concrete_need.length > 50; // Meaningful description
  }, [project]);
  
  const checkHumanAccountability = useCallback((): boolean => {
    return !!(
      project.human_owner.name &&
      project.human_owner.contact &&
      project.human_owner.accountability_statement
    );
  }, [project]);
  
  const checkTransparencyAgreement = useCallback((): boolean => {
    return project.transparency_agreed;
  }, [project]);
  
  const checkFoundationLawsCompliance = useCallback((): boolean => {
    return project.foundation_laws_confirmed;
  }, [project]);
  
  const criteriaResults = useMemo(() => ({
    local_context_required: checkLocalContext(),
    concrete_need_required: checkConcreteNeed(),
    human_accountability_required: checkHumanAccountability(),
    transparency_agreement_required: checkTransparencyAgreement(),
    foundation_laws_compliance_required: checkFoundationLawsCompliance(),
    tech_focus_not_required: true, // Always passes
    usefulness_over_innovation_theater: true, // Assessed qualitatively
  }), [checkLocalContext, checkConcreteNeed, checkHumanAccountability, checkTransparencyAgreement, checkFoundationLawsCompliance]);
  
  const allCriteriaMet = useMemo(() => {
    return Object.values(criteriaResults).every(v => v);
  }, [criteriaResults]);
  
  const performAssessment = useCallback((notes: string): EligibilityAssessment => {
    const result: EligibilityAssessment = {
      assessed_at: new Date().toISOString(),
      assessed_by: assessor_id,
      eligible: allCriteriaMet,
      criteria_results: criteriaResults as any,
      notes,
      ineligibility_reason: allCriteriaMet ? undefined : 'Not all criteria met',
    };
    
    setAssessment(result);
    return result;
  }, [assessor_id, allCriteriaMet, criteriaResults]);
  
  return {
    assessment,
    isAssessing,
    checkLocalContext,
    checkConcreteNeed,
    checkHumanAccountability,
    checkTransparencyAgreement,
    checkFoundationLawsCompliance,
    performAssessment,
    criteriaResults,
    allCriteriaMet,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVESTMENT DECISION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseInvestmentDecisionOptions {
  project_id: string;
  decision_maker_id: string;
}

export interface UseInvestmentDecisionReturn {
  /** Pending decision (if any) */
  pendingDecision: Partial<InvestmentDecision> | null;
  
  /** Past decisions for this project */
  decisions: InvestmentDecision[];
  
  /** Request agent analysis (agent assists, doesn't decide) */
  requestAgentAnalysis: (type: AgentAnalysis['type']) => Promise<AgentAnalysis>;
  
  /** Make decision (human action, FINAL) */
  makeDecision: (
    type: InvestmentDecision['type'],
    rationale: string,
    context_snapshot_id: string
  ) => Promise<InvestmentDecision>;
  
  /** Check if decision can be reversed */
  canReverseDecision: (decision_id: string) => boolean;
  
  /** Reverse a decision (if within window) */
  reverseDecision: (decision_id: string, reason: string) => Promise<void>;
  
  /** Loading state */
  isLoading: boolean;
}

export function useInvestmentDecision(options: UseInvestmentDecisionOptions): UseInvestmentDecisionReturn {
  const { project_id, decision_maker_id } = options;
  
  const [decisions, setDecisions] = useState<InvestmentDecision[]>([]);
  const [pendingDecision, setPendingDecision] = useState<Partial<InvestmentDecision> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const requestAgentAnalysis = useCallback(async (type: AgentAnalysis['type']): Promise<AgentAnalysis> => {
    setIsLoading(true);
    
    try {
      // Simulate agent analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analysis: AgentAnalysis = {
        agent_id: 'analysis_agent',
        type,
        content: `Analysis of project ${project_id}...`,
        factors: [
          {
            name: 'Local Impact',
            description: 'Assessment of expected local community impact',
            assessment: 'positive',
          },
          {
            name: 'Feasibility',
            description: 'Technical and operational feasibility',
            assessment: 'neutral',
          },
          {
            name: 'Risk Profile',
            description: 'Identified risks and uncertainties',
            assessment: 'concern',
          },
        ],
        is_not_recommendation: true,
        provided_at: new Date().toISOString(),
      };
      
      setPendingDecision(prev => ({
        ...prev,
        agent_analysis: analysis,
      }));
      
      return analysis;
    } finally {
      setIsLoading(false);
    }
  }, [project_id]);
  
  const makeDecision = useCallback(async (
    type: InvestmentDecision['type'],
    rationale: string,
    context_snapshot_id: string
  ): Promise<InvestmentDecision> => {
    // Validate this is a human action
    if (!decision_maker_id) {
      throw new Error('Decision maker ID required - agents cannot make investment decisions');
    }
    
    if (!rationale || rationale.length < 20) {
      throw new Error('Meaningful rationale required for all investment decisions');
    }
    
    const decision: InvestmentDecision = {
      id: `decision_${Date.now()}`,
      project_id,
      type,
      decision_maker: decision_maker_id,
      rationale,
      context_snapshot_id,
      agent_analysis: pendingDecision?.agent_analysis,
      decided_at: new Date().toISOString(),
      reversible: type !== 'reject', // Rejections may be reconsidered, approvals may be revoked
      reversal_window_days: 7,
    };
    
    setDecisions(prev => [...prev, decision]);
    setPendingDecision(null);
    
    return decision;
  }, [project_id, decision_maker_id, pendingDecision]);
  
  const canReverseDecision = useCallback((decision_id: string): boolean => {
    const decision = decisions.find(d => d.id === decision_id);
    if (!decision || !decision.reversible) return false;
    
    const decidedAt = new Date(decision.decided_at);
    const now = new Date();
    const daysSince = (now.getTime() - decidedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSince < (decision.reversal_window_days || 0);
  }, [decisions]);
  
  const reverseDecision = useCallback(async (decision_id: string, reason: string) => {
    if (!canReverseDecision(decision_id)) {
      throw new Error('Decision cannot be reversed');
    }
    
    // Would update decision status in backend
    setDecisions(prev => prev.map(d => 
      d.id === decision_id
        ? { ...d, reversible: false } // Mark as reversed
        : d
    ));
  }, [canReverseDecision]);
  
  return {
    pendingDecision,
    decisions,
    requestAgentAnalysis,
    makeDecision,
    canReverseDecision,
    reverseDecision,
    isLoading,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUND ALLOCATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseFundAllocationOptions {
  project_id: string;
  approver_id: string;
}

export interface UseFundAllocationReturn {
  allocations: FundAllocation[];
  totalAllocated: number;
  totalDisbursed: number;
  
  /** Create allocation (human action) */
  createAllocation: (
    amount: number,
    currency: string,
    intended_use: AllowedFundUse,
    description: string,
    rationale: string
  ) => Promise<FundAllocation>;
  
  /** Disburse allocation (human action) */
  disburseAllocation: (allocation_id: string) => Promise<void>;
  
  /** Reverse allocation (if reversible) */
  reverseAllocation: (allocation_id: string, reason: string) => Promise<void>;
  
  /** Validate fund use is allowed */
  isAllowedUse: (use: string) => use is AllowedFundUse;
  
  isLoading: boolean;
}

const ALLOWED_USES: AllowedFundUse[] = [
  'project_startup_costs',
  'tooling_and_infrastructure',
  'local_services_and_suppliers',
  'research_and_prototyping',
  'early_operational_stability',
];

export function useFundAllocation(options: UseFundAllocationOptions): UseFundAllocationReturn {
  const { project_id, approver_id } = options;
  
  const [allocations, setAllocations] = useState<FundAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalAllocated = useMemo(() => 
    allocations.reduce((sum, a) => sum + a.amount, 0),
  [allocations]);
  
  const totalDisbursed = useMemo(() =>
    allocations
      .filter(a => a.status === 'disbursed' || a.status === 'completed')
      .reduce((sum, a) => sum + a.amount, 0),
  [allocations]);
  
  const isAllowedUse = useCallback((use: string): use is AllowedFundUse => {
    return ALLOWED_USES.includes(use as AllowedFundUse);
  }, []);
  
  const createAllocation = useCallback(async (
    amount: number,
    currency: string,
    intended_use: AllowedFundUse,
    description: string,
    rationale: string
  ): Promise<FundAllocation> => {
    // Validate
    if (!isAllowedUse(intended_use)) {
      throw new Error(`Use type "${intended_use}" is not allowed`);
    }
    
    if (!rationale || rationale.length < 20) {
      throw new Error('Meaningful rationale required for fund allocation');
    }
    
    const allocation: FundAllocation = {
      id: `allocation_${Date.now()}`,
      project_id,
      amount,
      currency,
      intended_use,
      description,
      allocated_at: new Date().toISOString(),
      approved_by: approver_id,
      rationale,
      reversible: true,
      status: 'approved',
      audit_trail: [
        {
          timestamp: new Date().toISOString(),
          action: 'created',
          actor: approver_id,
          details: `Allocation of ${amount} ${currency} for ${intended_use}`,
        },
      ],
    };
    
    setAllocations(prev => [...prev, allocation]);
    return allocation;
  }, [project_id, approver_id, isAllowedUse]);
  
  const disburseAllocation = useCallback(async (allocation_id: string) => {
    setAllocations(prev => prev.map(a => {
      if (a.id !== allocation_id) return a;
      
      return {
        ...a,
        status: 'disbursed' as const,
        audit_trail: [
          ...a.audit_trail,
          {
            timestamp: new Date().toISOString(),
            action: 'disbursed',
            actor: approver_id,
            details: 'Funds disbursed',
          },
        ],
      };
    }));
  }, [approver_id]);
  
  const reverseAllocation = useCallback(async (allocation_id: string, reason: string) => {
    const allocation = allocations.find(a => a.id === allocation_id);
    if (!allocation?.reversible) {
      throw new Error('Allocation cannot be reversed');
    }
    
    setAllocations(prev => prev.map(a => {
      if (a.id !== allocation_id) return a;
      
      return {
        ...a,
        status: 'reversed' as const,
        reversible: false,
        audit_trail: [
          ...a.audit_trail,
          {
            timestamp: new Date().toISOString(),
            action: 'reversed',
            actor: approver_id,
            details: reason,
          },
        ],
      };
    }));
  }, [allocations, approver_id]);
  
  return {
    allocations,
    totalAllocated,
    totalDisbursed,
    createAllocation,
    disburseAllocation,
    reverseAllocation,
    isAllowedUse,
    isLoading,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIATIVE NARRATIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseInitiativeNarrativeOptions {
  project_id: string;
}

export interface UseInitiativeNarrativeReturn {
  narrative: InitiativeNarrative | null;
  isLoading: boolean;
  
  /** Build narrative from project history */
  buildNarrative: () => Promise<InitiativeNarrative>;
  
  /** Get events by type */
  getEventsByType: (type: NarrativeEvent['event_type']) => NarrativeEvent[];
  
  /** Export for sharing */
  exportNarrative: () => string;
}

export function useInitiativeNarrative(options: UseInitiativeNarrativeOptions): UseInitiativeNarrativeReturn {
  const { project_id } = options;
  
  const [narrative, setNarrative] = useState<InitiativeNarrative | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const buildNarrative = useCallback(async (): Promise<InitiativeNarrative> => {
    setIsLoading(true);
    
    try {
      // Would fetch project history and build narrative
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const built: InitiativeNarrative = {
        project_id,
        timeline: [],
        key_decisions: [],
        lessons_learned: [],
        shows_origin: true,
        tracks_decisions: true,
        preserves_lessons: true,
      };
      
      setNarrative(built);
      return built;
    } finally {
      setIsLoading(false);
    }
  }, [project_id]);
  
  const getEventsByType = useCallback((type: NarrativeEvent['event_type']): NarrativeEvent[] => {
    return narrative?.timeline.filter(e => e.event_type === type) ?? [];
  }, [narrative]);
  
  const exportNarrative = useCallback((): string => {
    if (!narrative) return '';
    
    // Build human-readable narrative export
    let output = `# Initiative Narrative: ${project_id}\n\n`;
    
    output += '## Timeline\n\n';
    for (const event of narrative.timeline) {
      output += `- **${event.title}** (${event.timestamp})\n`;
      output += `  ${event.description}\n\n`;
    }
    
    output += '## Key Decisions\n\n';
    for (const decision of narrative.key_decisions) {
      output += `- ${decision}\n`;
    }
    
    output += '\n## Lessons Learned\n\n';
    for (const lesson of narrative.lessons_learned) {
      output += `- ${lesson}\n`;
    }
    
    return output;
  }, [narrative, project_id]);
  
  return {
    narrative,
    isLoading,
    buildNarrative,
    getEventsByType,
    exportNarrative,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE COMPLIANCE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseGovernanceComplianceReturn {
  /** Check if action complies with governance model */
  checkCompliance: (action: string, actor: 'human' | 'agent') => {
    compliant: boolean;
    reason?: string;
  };
  
  /** Get ethical constraints */
  ethicalConstraints: typeof ETHICAL_CONSTRAINTS;
  
  /** Get governance model */
  governanceModel: typeof GOVERNANCE_MODEL;
  
  /** Get returns policy */
  returnsPolicy: typeof RETURNS_POLICY;
  
  /** Get eligibility criteria */
  eligibilityCriteria: typeof PROJECT_ELIGIBILITY;
}

export function useGovernanceCompliance(): UseGovernanceComplianceReturn {
  const checkCompliance = useCallback((action: string, actor: 'human' | 'agent'): {
    compliant: boolean;
    reason?: string;
  } => {
    // Agent restrictions
    const agentForbidden = ['approve_funding', 'allocate_resources', 'override_human_judgment'];
    
    if (actor === 'agent' && agentForbidden.some(f => action.includes(f))) {
      return {
        compliant: false,
        reason: `Agents may not: ${agentForbidden.join(', ')}. Final responsibility rests with humans.`,
      };
    }
    
    return { compliant: true };
  }, []);
  
  return {
    checkCompliance,
    ethicalConstraints: ETHICAL_CONSTRAINTS,
    governanceModel: GOVERNANCE_MODEL,
    returnsPolicy: RETURNS_POLICY,
    eligibilityCriteria: PROJECT_ELIGIBILITY,
  };
}
