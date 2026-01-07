/**
 * CHE·NU™ — Governed Execution Pipeline Service
 * 
 * "No AI execution occurs until human intent has been clarified, 
 * encoded, governed, validated, cost-estimated, scope-restricted, 
 * and matched with compatible AI agents."
 * 
 * FAILURE AT ANY STAGE PREVENTS EXECUTION.
 * 
 * Les 10 Étapes:
 * 1. Intent Capture
 * 2. Semantic Encoding
 * 3. Encoding Validation
 * 4. Token & Cost Estimation
 * 5. Scope Locking
 * 6. Budget Verification
 * 7. Agent Compatibility Check (ACM)
 * 8. Controlled Execution
 * 9. Result Capture
 * 10. Thread Update (audit trail)
 */

import type {
  ChenuEncoding,
  ChenuThread,
  Agent,
  CapturedIntent,
  ValidationResult,
  CostEstimate,
  ScopeLock,
  BudgetVerification,
  AgentCompatibilityResult,
  ExecutionResult,
  CapturedResult,
  AuditEntry,
  PipelineStage,
} from '../types';

export interface PipelineState {
  stage: PipelineStage;
  thread_id: string;
  intent?: CapturedIntent;
  encoding?: ChenuEncoding;
  validation?: ValidationResult;
  cost_estimate?: CostEstimate;
  scope_lock?: ScopeLock;
  budget_verification?: BudgetVerification;
  acm_result?: AgentCompatibilityResult;
  execution?: ExecutionResult;
  result?: CapturedResult;
  error?: string;
  started_at: string;
  completed_at?: string;
}

export interface PipelineCallbacks {
  onStageChange?: (stage: PipelineStage) => void;
  onError?: (error: string) => void;
  onComplete?: (result: CapturedResult) => void;
}

/**
 * Governed Execution Pipeline
 * 
 * Chaque étape doit réussir pour que le pipeline continue.
 * Un échec à n'importe quelle étape BLOQUE l'exécution.
 */
export class GovernedExecutionPipeline {
  private state: PipelineState;
  private callbacks: PipelineCallbacks;

  constructor(callbacks: PipelineCallbacks = {}) {
    this.state = {
      stage: 'IDLE',
      thread_id: '',
      started_at: new Date().toISOString(),
    };
    this.callbacks = callbacks;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 1: INTENT CAPTURE
  // ═══════════════════════════════════════════════════════════════════
  async captureIntent(
    rawInput: string,
    context: { sphere_id: string; project_id?: string }
  ): Promise<CapturedIntent> {
    this.setStage('INTENT_CAPTURE');

    const intent: CapturedIntent = {
      original_text: rawInput,
      timestamp: new Date().toISOString(),
      source: 'user_input',
      context: {
        sphere_id: context.sphere_id,
        project_id: context.project_id,
      },
    };

    this.state.intent = intent;
    return intent;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 2: SEMANTIC ENCODING
  // ═══════════════════════════════════════════════════════════════════
  async generateEncoding(
    intent: CapturedIntent,
    threadId: string
  ): Promise<ChenuEncoding> {
    this.setStage('SEMANTIC_ENCODING');
    this.state.thread_id = threadId;

    const action = this.parseAction(intent.original_text);
    const source = this.parseSource(intent.original_text);

    const encoding: ChenuEncoding = {
      encoding_version: '1.0',
      intent_hash: this.hashString(intent.original_text + intent.timestamp),
      action: {
        type: action,
        verb: this.extractVerb(intent.original_text),
        target: source,
      },
      source: {
        type: source as any,
        identifier: '',
        selection: null,
      },
      scope: {
        lock: 'DOC',
        boundary: 'strict',
        expansion_allowed: false,
      },
      mode: {
        type: 'analysis',
        depth: 'standard',
        format: 'text',
      },
      focus: {
        primary: intent.original_text.substring(0, 100),
        secondary: [],
        exclude: [],
      },
      permissions: {
        rewrite_allowed: false,
        create_new: false,
        external_access: false,
        human_approval_required: true,
      },
      governance: {
        token_estimate: 0,
        budget_impact: 0,
        sensitivity: 'medium',
        audit_level: 'standard',
      },
      traceability: {
        thread_id: threadId,
        parent_encoding: null,
        version: 1,
        created_at: new Date().toISOString(),
      },
    };

    this.state.encoding = encoding;
    return encoding;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 3: ENCODING VALIDATION
  // ═══════════════════════════════════════════════════════════════════
  validateEncoding(encoding: ChenuEncoding): ValidationResult {
    this.setStage('ENCODING_VALIDATION');

    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!encoding.action.type) errors.push('ACTION_TYPE_MISSING');
    if (!encoding.scope.lock) errors.push('SCOPE_LOCK_MISSING');
    if (!encoding.encoding_version) errors.push('VERSION_MISSING');
    if (!encoding.traceability.thread_id) errors.push('THREAD_ID_MISSING');

    // Warnings
    if (!encoding.focus.primary) warnings.push('NO_PRIMARY_FOCUS');
    if (encoding.permissions.rewrite_allowed && !encoding.permissions.human_approval_required) {
      errors.push('REWRITE_WITHOUT_APPROVAL');
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      encoding,
    };

    this.state.validation = result;

    if (!result.valid) {
      this.failPipeline(`Validation failed: ${errors.join(', ')}`);
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 4: COST ESTIMATION
  // ═══════════════════════════════════════════════════════════════════
  estimateCost(encoding: ChenuEncoding): CostEstimate {
    this.setStage('COST_ESTIMATION');

    const baseTokens = this.calculateBaseTokens(encoding.action.type);
    const depthMultiplier = this.getDepthMultiplier(encoding.mode.depth);
    const actionMultiplier = this.getActionMultiplier(encoding.action.type);

    const estimatedTokens = Math.ceil(baseTokens * depthMultiplier * actionMultiplier);

    const estimate: CostEstimate = {
      token_estimate: estimatedTokens,
      cost_usd: estimatedTokens * 0.00003, // Example pricing
      confidence: 0.85,
      breakdown: {
        base: baseTokens,
        depth_multiplier: depthMultiplier,
        action_multiplier: actionMultiplier,
      },
    };

    this.state.cost_estimate = estimate;

    // Update encoding with estimate
    if (this.state.encoding) {
      this.state.encoding.governance.token_estimate = estimatedTokens;
      this.state.encoding.governance.budget_impact = estimate.cost_usd;
    }

    return estimate;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 5: SCOPE LOCKING
  // ═══════════════════════════════════════════════════════════════════
  lockScope(encoding: ChenuEncoding): ScopeLock {
    this.setStage('SCOPE_LOCKING');

    const lock: ScopeLock = {
      lock_type: encoding.scope.lock,
      locked_at: new Date().toISOString(),
      locked_by: 'governed_pipeline',
      can_expand: encoding.scope.expansion_allowed,
      boundary: encoding.scope.boundary,
      hash: this.hashString(JSON.stringify(encoding.scope)),
    };

    this.state.scope_lock = lock;
    return lock;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 6: BUDGET VERIFICATION
  // ═══════════════════════════════════════════════════════════════════
  async verifyBudget(
    sphereId: string,
    estimate: CostEstimate,
    sphereBudget: { allocated: number; used: number }
  ): Promise<BudgetVerification> {
    this.setStage('BUDGET_VERIFICATION');

    const remaining = sphereBudget.allocated - sphereBudget.used;
    const approved = estimate.token_estimate <= remaining;

    const verification: BudgetVerification = {
      approved,
      remaining_budget: remaining,
      required_tokens: estimate.token_estimate,
      sphere_id: sphereId,
      timestamp: new Date().toISOString(),
    };

    this.state.budget_verification = verification;

    if (!approved) {
      this.failPipeline(`Budget insuffisant: ${estimate.token_estimate} requis, ${remaining} disponibles`);
    }

    return verification;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 7: AGENT COMPATIBILITY CHECK (ACM)
  // ═══════════════════════════════════════════════════════════════════
  checkAgentCompatibility(
    encoding: ChenuEncoding,
    availableAgents: Agent[]
  ): AgentCompatibilityResult {
    this.setStage('ACM_CHECK');

    const compatibleAgents = availableAgents.filter((agent) => {
      const caps = this.parseCapabilities(agent.capabilities);
      const supportsAction = caps.actions?.includes(encoding.action.type);
      const supportsScope = caps.scopes?.includes(encoding.scope.lock);
      const levelOk = this.checkLevelCompatibility(agent.level, encoding.governance.sensitivity);
      return supportsAction && supportsScope && levelOk;
    });

    const sortedAgents = compatibleAgents.sort((a, b) => {
      const rankA = this.getLevelRank(a.level);
      const rankB = this.getLevelRank(b.level);
      return rankB - rankA;
    });

    const result: AgentCompatibilityResult = {
      compatible_agents: sortedAgents.map((a) => a.id),
      recommended_agent: sortedAgents[0]?.id || null,
      compatibility_score: availableAgents.length > 0 ? sortedAgents.length / availableAgents.length : 0,
      acm_version: '1.0',
    };

    this.state.acm_result = result;

    if (!result.recommended_agent) {
      this.failPipeline('Aucun agent compatible trouvé');
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 8: CONTROLLED EXECUTION
  // ═══════════════════════════════════════════════════════════════════
  async execute(
    encoding: ChenuEncoding,
    agentId: string,
    executor: (encoding: ChenuEncoding, agentId: string) => Promise<any>
  ): Promise<ExecutionResult> {
    this.setStage('EXECUTION');

    const startTime = Date.now();
    const executionId = crypto.randomUUID();

    try {
      const result = await executor(encoding, agentId);

      const execution: ExecutionResult = {
        success: true,
        result,
        actual_tokens: result?.tokens_used || this.state.cost_estimate?.token_estimate || 0,
        duration_ms: Date.now() - startTime,
        execution_id: executionId,
        agent_id: agentId,
      };

      this.state.execution = execution;
      return execution;
    } catch (error: unknown) {
      const execution: ExecutionResult = {
        success: false,
        error: error.message,
        actual_tokens: 0,
        duration_ms: Date.now() - startTime,
        execution_id: executionId,
        agent_id: agentId,
      };

      this.state.execution = execution;
      this.failPipeline(error.message);
      return execution;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 9: RESULT CAPTURE
  // ═══════════════════════════════════════════════════════════════════
  captureResult(execution: ExecutionResult): CapturedResult {
    this.setStage('RESULT_CAPTURE');

    const captured: CapturedResult = {
      execution_id: execution.execution_id,
      captured_at: new Date().toISOString(),
      data: execution.result,
      tokens_used: execution.actual_tokens,
      duration_ms: execution.duration_ms,
      status: execution.success ? 'success' : 'failed',
      error: execution.error,
    };

    this.state.result = captured;
    return captured;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 10: THREAD UPDATE (AUDIT TRAIL)
  // ═══════════════════════════════════════════════════════════════════
  async updateThread(
    thread: ChenuThread,
    encoding: ChenuEncoding,
    result: CapturedResult
  ): Promise<ChenuThread> {
    this.setStage('THREAD_UPDATE');

    const auditEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: 'EXECUTION_COMPLETED',
      actor: 'governed_pipeline',
      details: {
        encoding_hash: encoding.intent_hash,
        tokens_used: result.tokens_used,
        status: result.status,
        duration_ms: result.duration_ms,
        agent_id: this.state.execution?.agent_id,
      },
    };

    const updatedThread: ChenuThread = {
      ...thread,
      status: result.status === 'success' ? 'completed' : 'failed',
      encoding_optimized: encoding,
      execution: {
        status: result.status,
        result: result.data,
        actual_tokens: result.tokens_used,
        duration_ms: result.duration_ms,
        executed_at: result.captured_at,
        agent_id: this.state.execution?.agent_id || '',
      },
      audit_trail: [...(thread.audit_trail || []), auditEntry],
      updated_at: new Date().toISOString(),
    };

    this.setStage('COMPLETED');
    this.state.completed_at = new Date().toISOString();
    this.callbacks.onComplete?.(result);

    return updatedThread;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FULL PIPELINE EXECUTION
  // ═══════════════════════════════════════════════════════════════════
  async runFullPipeline(
    rawInput: string,
    context: { sphere_id: string; project_id?: string },
    thread: ChenuThread,
    availableAgents: Agent[],
    sphereBudget: { allocated: number; used: number },
    executor: (encoding: ChenuEncoding, agentId: string) => Promise<any>
  ): Promise<{ success: boolean; thread?: ChenuThread; error?: string }> {
    try {
      // 1. Intent Capture
      const intent = await this.captureIntent(rawInput, context);

      // 2. Semantic Encoding
      const encoding = await this.generateEncoding(intent, thread.id);

      // 3. Encoding Validation
      const validation = this.validateEncoding(encoding);
      if (!validation.valid) {
        return { success: false, error: this.state.error };
      }

      // 4. Cost Estimation
      const estimate = this.estimateCost(encoding);

      // 5. Scope Locking
      this.lockScope(encoding);

      // 6. Budget Verification
      const budget = await this.verifyBudget(context.sphere_id, estimate, sphereBudget);
      if (!budget.approved) {
        return { success: false, error: this.state.error };
      }

      // 7. ACM Check
      const acm = this.checkAgentCompatibility(encoding, availableAgents);
      if (!acm.recommended_agent) {
        return { success: false, error: this.state.error };
      }

      // 8. Controlled Execution
      const execution = await this.execute(encoding, acm.recommended_agent, executor);
      if (!execution.success) {
        return { success: false, error: this.state.error };
      }

      // 9. Result Capture
      const result = this.captureResult(execution);

      // 10. Thread Update
      const updatedThread = await this.updateThread(thread, encoding, result);

      return { success: true, thread: updatedThread };
    } catch (error: unknown) {
      this.failPipeline(error.message);
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════
  private setStage(stage: PipelineStage) {
    this.state.stage = stage;
    this.callbacks.onStageChange?.(stage);
  }

  private failPipeline(error: string) {
    this.state.stage = 'FAILED';
    this.state.error = error;
    this.callbacks.onError?.(error);
  }

  getState(): PipelineState {
    return { ...this.state };
  }

  canProceed(): boolean {
    return this.state.stage !== 'FAILED' && this.state.stage !== 'COMPLETED';
  }

  private parseAction(text: string): string {
    const actionMap: Record<string, string[]> = {
      ANALYZE: ['analyze', 'analyse', 'examiner', 'étudier', 'review'],
      PREPARE: ['prepare', 'préparer', 'create', 'créer', 'build'],
      DRAFT: ['draft', 'rédiger', 'write', 'écrire', 'compose'],
      COMPARE: ['compare', 'comparer', 'versus', 'vs', 'contrast'],
      STRUCTURE: ['structure', 'structurer', 'organize', 'organiser'],
      SUMMARIZE: ['summarize', 'résumer', 'summary', 'recap'],
    };
    const lower = text.toLowerCase();
    for (const [action, keywords] of Object.entries(actionMap)) {
      if (keywords.some((k) => lower.includes(k))) return action;
    }
    return 'ANALYZE';
  }

  private parseSource(text: string): string {
    if (text.includes('document') || text.includes('fichier')) return 'DOC';
    if (text.includes('selection') || text.includes('sélection')) return 'SEL';
    if (text.includes('workspace') || text.includes('espace')) return 'WS';
    return 'DOC';
  }

  private extractVerb(text: string): string {
    return text.split(' ')[0] || 'process';
  }

  private hashString(str: string): string {
    return btoa(str).slice(0, 16);
  }

  private calculateBaseTokens(action: string): number {
    const costs: Record<string, number> = {
      ANALYZE: 500,
      PREPARE: 800,
      DRAFT: 1200,
      COMPARE: 600,
      STRUCTURE: 400,
      SUMMARIZE: 300,
    };
    return costs[action] || 500;
  }

  private getDepthMultiplier(depth: string): number {
    return { surface: 0.5, standard: 1, deep: 2 }[depth] || 1;
  }

  private getActionMultiplier(action: string): number {
    const m: Record<string, number> = {
      ANALYZE: 1,
      PREPARE: 1.5,
      DRAFT: 2,
      COMPARE: 1.2,
      STRUCTURE: 0.8,
      SUMMARIZE: 0.6,
    };
    return m[action] || 1;
  }

  private parseCapabilities(caps: string | object | null): unknown {
    if (!caps) return { actions: [], scopes: [] };
    if (typeof caps === 'string') {
      try {
        return JSON.parse(caps);
      } catch {
        return { actions: [], scopes: [] };
      }
    }
    return caps;
  }

  private checkLevelCompatibility(level: string, sensitivity: string): boolean {
    const lr: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 3 };
    const sr: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
    return (lr[level] || 0) >= (sr[sensitivity] || 0);
  }

  private getLevelRank(level: string): number {
    return { L0: 0, L1: 1, L2: 2, L3: 3 }[level] || 0;
  }
}

// Export singleton
export const governedPipeline = new GovernedExecutionPipeline();
