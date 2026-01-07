/**
 * CHE·NU™ Agent Contract — Custom Hooks
 * 
 * Hooks for managing agent contracts, violations, and enforcement.
 * 
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AgentContract,
  ContractSummary,
  ContractStatus,
  ContractViolation,
  ContractCreationForm,
  AllowedAction,
  ForbiddenAction,
  AgentActionType,
  DEFAULT_PERMISSIONS,
  DEFAULT_DECISION_BOUNDARIES,
  DEFAULT_DATA_ACCESS,
  DEFAULT_INTERACTION_RULES,
  DEFAULT_LEARNING_CONSTRAINTS,
  DEFAULT_ENFORCEMENT,
} from './agent-contract.types';

// ============================================================================
// useContracts — List and filter contracts
// ============================================================================

interface UseContractsOptions {
  userId: string;
  initialFilter?: ContractStatus;
}

interface UseContractsReturn {
  contracts: ContractSummary[];
  isLoading: boolean;
  error: string | null;
  filterByStatus: (status: ContractStatus | 'all') => void;
  searchContracts: (query: string) => void;
  refresh: () => void;
  counts: Record<ContractStatus | 'all', number>;
}

export function useContracts(options: UseContractsOptions): UseContractsReturn {
  const { userId, initialFilter } = options;
  const [allContracts, setAllContracts] = useState<ContractSummary[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>(initialFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockContracts: ContractSummary[] = [
        {
          id: 'contract_001',
          agent_id: 'nova',
          agent_name: 'Nova',
          agent_role: 'System Intelligence',
          owner: userId,
          status: 'active',
          version: '1.2.0',
          mission_statement: 'System-wide insights and suggestions.',
          allowed_action_count: 5,
          forbidden_action_count: 4,
          violation_count: 0,
          last_activity: new Date().toISOString(),
        },
      ];
      
      setAllContracts(mockContracts);
    } catch (e) {
      setError('Failed to load contracts');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    let result = allContracts;
    
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.agent_name.toLowerCase().includes(q) ||
        c.agent_role.toLowerCase().includes(q) ||
        c.mission_statement.toLowerCase().includes(q)
      );
    }
    
    setFilteredContracts(result);
  }, [allContracts, statusFilter, searchQuery]);

  const counts = useMemo(() => ({
    all: allContracts.length,
    draft: allContracts.filter(c => c.status === 'draft').length,
    active: allContracts.filter(c => c.status === 'active').length,
    suspended: allContracts.filter(c => c.status === 'suspended').length,
    retired: allContracts.filter(c => c.status === 'retired').length,
  }), [allContracts]);

  return {
    contracts: filteredContracts,
    isLoading,
    error,
    filterByStatus: setStatusFilter,
    searchContracts: setSearchQuery,
    refresh: loadContracts,
    counts,
  };
}

// ============================================================================
// useContract — Single contract operations
// ============================================================================

interface UseContractOptions {
  contractId: string;
  userId: string;
}

interface UseContractReturn {
  contract: AgentContract | null;
  isLoading: boolean;
  error: string | null;
  activate: () => Promise<boolean>;
  suspend: (reason: string) => Promise<boolean>;
  retire: (reason: string) => Promise<boolean>;
  updatePermissions: (permissions: AgentContract['permissions']) => Promise<boolean>;
  refresh: () => void;
}

export function useContract(options: UseContractOptions): UseContractReturn {
  const { contractId, userId } = options;
  const [contract, setContract] = useState<AgentContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContract = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock contract
      const mockContract: AgentContract = {
        id: contractId,
        agent_id: 'nova',
        agent_role: 'System Intelligence',
        agent_name: 'Nova',
        owner: userId,
        version: '1.2.0',
        status: 'active',
        purpose: {
          mission_statement: 'Provide system-wide insights.',
          success_definition: 'Users feel informed without overwhelm.',
          non_goals: ['Autonomous decisions', 'Silent learning'],
        },
        permissions: DEFAULT_PERMISSIONS,
        decision_boundaries: DEFAULT_DECISION_BOUNDARIES,
        data_access: DEFAULT_DATA_ACCESS,
        interaction_rules: DEFAULT_INTERACTION_RULES,
        learning_constraints: DEFAULT_LEARNING_CONSTRAINTS,
        enforcement: DEFAULT_ENFORCEMENT,
        creation_context: {
          created_at: '2025-12-01T10:00:00Z',
          created_by: userId,
          creation_reason: 'Initial setup',
        },
        last_modified: new Date().toISOString(),
        last_modified_by: userId,
        violation_count: 0,
        last_audit: new Date().toISOString(),
      };
      
      setContract(mockContract);
    } catch (e) {
      setError('Failed to load contract');
    } finally {
      setIsLoading(false);
    }
  }, [contractId, userId]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const activate = useCallback(async (): Promise<boolean> => {
    if (!contract || contract.status !== 'draft') return false;
    
    try {
      // API call would go here
      setContract(prev => prev ? {
        ...prev,
        status: 'active',
        approval_timestamp: new Date().toISOString(),
        approved_by: userId,
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [contract, userId]);

  const suspend = useCallback(async (reason: string): Promise<boolean> => {
    if (!contract || contract.status !== 'active') return false;
    
    try {
      setContract(prev => prev ? { ...prev, status: 'suspended' } : null);
      return true;
    } catch {
      return false;
    }
  }, [contract]);

  const retire = useCallback(async (reason: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      setContract(prev => prev ? { ...prev, status: 'retired' } : null);
      return true;
    } catch {
      return false;
    }
  }, [contract]);

  const updatePermissions = useCallback(async (
    permissions: AgentContract['permissions']
  ): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      setContract(prev => prev ? {
        ...prev,
        permissions,
        last_modified: new Date().toISOString(),
        last_modified_by: userId,
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [contract, userId]);

  return {
    contract,
    isLoading,
    error,
    activate,
    suspend,
    retire,
    updatePermissions,
    refresh: loadContract,
  };
}

// ============================================================================
// useViolations — Contract violation history
// ============================================================================

interface UseViolationsOptions {
  contractId: string;
  includeResolved?: boolean;
}

interface UseViolationsReturn {
  violations: ContractViolation[];
  unresolvedCount: number;
  isLoading: boolean;
  resolve: (violationId: string, notes: string) => Promise<boolean>;
  refresh: () => void;
}

export function useViolations(options: UseViolationsOptions): UseViolationsReturn {
  const { contractId, includeResolved = true } = options;
  const [violations, setViolations] = useState<ContractViolation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadViolations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Mock - empty for now
      setViolations([]);
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    loadViolations();
  }, [loadViolations]);

  const filtered = useMemo(() => {
    if (includeResolved) return violations;
    return violations.filter(v => !v.resolved);
  }, [violations, includeResolved]);

  const unresolvedCount = useMemo(() => 
    violations.filter(v => !v.resolved).length,
  [violations]);

  const resolve = useCallback(async (violationId: string, notes: string): Promise<boolean> => {
    try {
      setViolations(prev => prev.map(v => 
        v.id === violationId 
          ? { ...v, resolved: true, resolution_notes: notes, resolved_at: new Date().toISOString() }
          : v
      ));
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    violations: filtered,
    unresolvedCount,
    isLoading,
    resolve,
    refresh: loadViolations,
  };
}

// ============================================================================
// useContractCreation — Contract creation flow
// ============================================================================

interface UseContractCreationReturn {
  form: ContractCreationForm;
  setField: <K extends keyof ContractCreationForm>(field: K, value: ContractCreationForm[K]) => void;
  addNonGoal: (goal: string) => void;
  removeNonGoal: (index: number) => void;
  reset: () => void;
  isValid: boolean;
  submit: () => Promise<AgentContract | null>;
  isSubmitting: boolean;
}

export function useContractCreation(userId: string): UseContractCreationReturn {
  const [form, setForm] = useState<ContractCreationForm>({
    agent_id: '',
    agent_role: '',
    agent_name: '',
    mission_statement: '',
    success_definition: '',
    non_goals: [],
    creation_reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback(<K extends keyof ContractCreationForm>(
    field: K, 
    value: ContractCreationForm[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const addNonGoal = useCallback((goal: string) => {
    if (goal.trim()) {
      setForm(prev => ({ ...prev, non_goals: [...prev.non_goals, goal.trim()] }));
    }
  }, []);

  const removeNonGoal = useCallback((index: number) => {
    setForm(prev => ({ 
      ...prev, 
      non_goals: prev.non_goals.filter((_, i) => i !== index) 
    }));
  }, []);

  const reset = useCallback(() => {
    setForm({
      agent_id: '',
      agent_role: '',
      agent_name: '',
      mission_statement: '',
      success_definition: '',
      non_goals: [],
      creation_reason: '',
    });
  }, []);

  const isValid = useMemo(() => {
    return !!(
      form.agent_id &&
      form.agent_name &&
      form.agent_role &&
      form.mission_statement &&
      form.creation_reason
    );
  }, [form]);

  const submit = useCallback(async (): Promise<AgentContract | null> => {
    if (!isValid) return null;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const contract: AgentContract = {
        id: `contract_${Date.now()}`,
        agent_id: form.agent_id,
        agent_role: form.agent_role,
        agent_name: form.agent_name,
        owner: userId,
        version: '1.0.0',
        status: 'draft',
        purpose: {
          mission_statement: form.mission_statement,
          success_definition: form.success_definition,
          non_goals: form.non_goals,
        },
        permissions: DEFAULT_PERMISSIONS,
        decision_boundaries: DEFAULT_DECISION_BOUNDARIES,
        data_access: DEFAULT_DATA_ACCESS,
        interaction_rules: DEFAULT_INTERACTION_RULES,
        learning_constraints: DEFAULT_LEARNING_CONSTRAINTS,
        enforcement: DEFAULT_ENFORCEMENT,
        creation_context: {
          created_at: new Date().toISOString(),
          created_by: userId,
          creation_reason: form.creation_reason,
          template_used: form.template_id,
        },
        last_modified: new Date().toISOString(),
        last_modified_by: userId,
        violation_count: 0,
        last_audit: new Date().toISOString(),
      };
      
      reset();
      return contract;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isValid, userId, reset]);

  return {
    form,
    setField,
    addNonGoal,
    removeNonGoal,
    reset,
    isValid,
    submit,
    isSubmitting,
  };
}

// ============================================================================
// useActionValidator — Validate agent actions against contract
// ============================================================================

interface UseActionValidatorOptions {
  contract: AgentContract | null;
}

interface ActionValidationResult {
  allowed: boolean;
  reason: string;
  requires_approval: boolean;
  matching_rule?: AllowedAction | ForbiddenAction;
}

interface UseActionValidatorReturn {
  validateAction: (action: AgentActionType, scope?: string) => ActionValidationResult;
  getAllowedActions: () => AgentActionType[];
  getForbiddenActions: () => AgentActionType[];
}

export function useActionValidator(options: UseActionValidatorOptions): UseActionValidatorReturn {
  const { contract } = options;

  const validateAction = useCallback((
    action: AgentActionType,
    scope?: string
  ): ActionValidationResult => {
    if (!contract) {
      return {
        allowed: false,
        reason: 'No contract loaded',
        requires_approval: false,
      };
    }

    // Check forbidden first
    const forbidden = contract.permissions.forbidden_actions.find(
      f => f.action_type === action
    );
    
    if (forbidden) {
      return {
        allowed: false,
        reason: forbidden.reason,
        requires_approval: false,
        matching_rule: forbidden,
      };
    }

    // Check allowed
    const allowed = contract.permissions.allowed_actions.find(
      a => a.action_type === action
    );

    if (!allowed) {
      return {
        allowed: false,
        reason: 'Action not explicitly permitted by contract',
        requires_approval: true,
      };
    }

    // Check scope if provided
    if (scope && !allowed.scope.includes('*') && !allowed.scope.includes(scope as any)) {
      return {
        allowed: false,
        reason: `Action not permitted in scope: ${scope}`,
        requires_approval: true,
        matching_rule: allowed,
      };
    }

    // Check conditions
    const hasApprovalCondition = allowed.conditions.some(
      c => c.type === 'approval_required'
    );

    return {
      allowed: true,
      reason: 'Action permitted by contract',
      requires_approval: hasApprovalCondition,
      matching_rule: allowed,
    };
  }, [contract]);

  const getAllowedActions = useCallback((): AgentActionType[] => {
    if (!contract) return [];
    return contract.permissions.allowed_actions.map(a => a.action_type);
  }, [contract]);

  const getForbiddenActions = useCallback((): AgentActionType[] => {
    if (!contract) return [];
    return contract.permissions.forbidden_actions.map(f => f.action_type);
  }, [contract]);

  return {
    validateAction,
    getAllowedActions,
    getForbiddenActions,
  };
}

// ============================================================================
// useContractComparison — Compare contract versions
// ============================================================================

interface ContractDiff {
  field: string;
  before: unknown;
  after: unknown;
  change_type: 'added' | 'removed' | 'modified';
}

interface UseContractComparisonReturn {
  differences: ContractDiff[];
  hasChanges: boolean;
  compare: (before: AgentContract, after: AgentContract) => void;
}

export function useContractComparison(): UseContractComparisonReturn {
  const [differences, setDifferences] = useState<ContractDiff[]>([]);

  const compare = useCallback((before: AgentContract, after: AgentContract) => {
    const diffs: ContractDiff[] = [];

    // Compare mission
    if (before.purpose.mission_statement !== after.purpose.mission_statement) {
      diffs.push({
        field: 'purpose.mission_statement',
        before: before.purpose.mission_statement,
        after: after.purpose.mission_statement,
        change_type: 'modified',
      });
    }

    // Compare allowed actions
    const beforeAllowed = new Set(before.permissions.allowed_actions.map(a => a.action_type));
    const afterAllowed = new Set(after.permissions.allowed_actions.map(a => a.action_type));

    for (const action of afterAllowed) {
      if (!beforeAllowed.has(action)) {
        diffs.push({
          field: 'permissions.allowed_actions',
          before: null,
          after: action,
          change_type: 'added',
        });
      }
    }

    for (const action of beforeAllowed) {
      if (!afterAllowed.has(action)) {
        diffs.push({
          field: 'permissions.allowed_actions',
          before: action,
          after: null,
          change_type: 'removed',
        });
      }
    }

    // Compare forbidden actions
    const beforeForbidden = new Set(before.permissions.forbidden_actions.map(f => f.action_type));
    const afterForbidden = new Set(after.permissions.forbidden_actions.map(f => f.action_type));

    for (const action of afterForbidden) {
      if (!beforeForbidden.has(action)) {
        diffs.push({
          field: 'permissions.forbidden_actions',
          before: null,
          after: action,
          change_type: 'added',
        });
      }
    }

    // Compare decision boundaries
    if (before.decision_boundaries.may_decide !== after.decision_boundaries.may_decide) {
      diffs.push({
        field: 'decision_boundaries.may_decide',
        before: before.decision_boundaries.may_decide,
        after: after.decision_boundaries.may_decide,
        change_type: 'modified',
      });
    }

    // Compare learning
    if (before.learning_constraints.learning_allowed !== after.learning_constraints.learning_allowed) {
      diffs.push({
        field: 'learning_constraints.learning_allowed',
        before: before.learning_constraints.learning_allowed,
        after: after.learning_constraints.learning_allowed,
        change_type: 'modified',
      });
    }

    setDifferences(diffs);
  }, []);

  return {
    differences,
    hasChanges: differences.length > 0,
    compare,
  };
}

// ============================================================================
// useContractEnforcement — Monitor enforcement state
// ============================================================================

interface UseContractEnforcementReturn {
  isEnforcing: boolean;
  lastCheck: string | null;
  violationsSinceLastCheck: number;
  checkNow: () => Promise<void>;
}

export function useContractEnforcement(contractId: string): UseContractEnforcementReturn {
  const [isEnforcing, setIsEnforcing] = useState(true);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [violationsSinceLastCheck, setViolationsSinceLastCheck] = useState(0);

  const checkNow = useCallback(async () => {
    // Mock enforcement check
    await new Promise(resolve => setTimeout(resolve, 100));
    setLastCheck(new Date().toISOString());
    setViolationsSinceLastCheck(0);
  }, []);

  useEffect(() => {
    // Initial check
    checkNow();
    
    // Periodic checks
    const interval = setInterval(checkNow, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [checkNow]);

  return {
    isEnforcing,
    lastCheck,
    violationsSinceLastCheck,
    checkNow,
  };
}
