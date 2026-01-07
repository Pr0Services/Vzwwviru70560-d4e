/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — GOVERNED EXECUTION PIPELINE ENGINE                    ║
 * ║              Implementation des 10 Étapes                                    ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  PRINCIPE: "GOUVERNANCE > EXÉCUTION"                                         ║
 * ║  "Failure at any stage prevents execution."                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import {
  PipelineStage,
  PipelineState,
  PipelineEvent,
  StageStatus,
  IntentCapture,
  SemanticEncoding,
  ValidationResult,
  TokenEstimation,
  ScopeLock,
  BudgetVerification,
  AgentCompatibilityResult,
  ControlledExecution,
  ResultCapture,
  ThreadUpdate,
  PIPELINE_STAGES_ORDER,
  STAGE_CAN_BLOCK,
  ActionType,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Generate IDs and Hashes
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateHash(data: unknown): string {
  // Simplified hash - in production use crypto.createHash('sha256')
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

function now(): string {
  return new Date().toISOString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT EMITTER
// ═══════════════════════════════════════════════════════════════════════════════

type EventHandler = (event: PipelineEvent) => void;

class PipelineEventEmitter {
  private handlers: EventHandler[] = [];
  
  subscribe(handler: EventHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }
  
  emit(event: PipelineEvent): void {
    this.handlers.forEach(h => h(event));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNED EXECUTION PIPELINE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class GovernedExecutionPipeline {
  private state: PipelineState;
  private events: PipelineEventEmitter;
  
  constructor(userId: string, sessionId: string) {
    this.events = new PipelineEventEmitter();
    this.state = this.createInitialState(userId, sessionId);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private createInitialState(userId: string, sessionId: string): PipelineState {
    const stages: PipelineState['stages'] = {} as any;
    
    PIPELINE_STAGES_ORDER.forEach(stage => {
      stages[stage] = { status: 'PENDING' };
    });
    
    return {
      pipeline_id: generateId('pipeline'),
      created_at: now(),
      updated_at: now(),
      current_stage: 'INTENT_CAPTURE',
      overall_status: 'active',
      stages,
      requires_human_approval: false,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════
  
  getState(): PipelineState {
    return { ...this.state };
  }
  
  onEvent(handler: EventHandler): () => void {
    return this.events.subscribe(handler);
  }
  
  /**
   * Execute le pipeline complet avec l'input humain
   * "Failure at any stage prevents execution."
   */
  async execute(rawInput: string, context?: Record<string, any>): Promise<PipelineState> {
    try {
      // Stage 1: Intent Capture
      const intent = await this.stage1_IntentCapture(rawInput, context);
      if (!intent) return this.fail('INTENT_CAPTURE', 'Failed to capture intent');
      
      // Stage 2: Semantic Encoding
      const encoding = await this.stage2_SemanticEncoding(intent);
      if (!encoding) return this.fail('SEMANTIC_ENCODING', 'Failed to encode intent');
      
      // Stage 3: Encoding Validation
      const validation = await this.stage3_EncodingValidation(encoding);
      if (!validation.is_valid) {
        return this.fail('ENCODING_VALIDATION', 'Encoding validation failed', validation.errors);
      }
      
      // Stage 4: Token & Cost Estimation
      const estimation = await this.stage4_TokenCostEstimation(encoding);
      
      // Stage 5: Scope Locking
      const scopeLock = await this.stage5_ScopeLocking(encoding);
      if (!scopeLock) return this.fail('SCOPE_LOCKING', 'Scope too broad, please reduce');
      
      // Stage 6: Budget Verification
      const budget = await this.stage6_BudgetVerification(estimation);
      if (!budget.has_sufficient_budget) {
        return this.fail('BUDGET_VERIFICATION', budget.block_reason || 'Insufficient budget');
      }
      
      // Stage 7: Agent Compatibility Check
      const agentMatch = await this.stage7_AgentCompatibility(encoding, scopeLock);
      if (!agentMatch.is_compatible) {
        return this.fail('AGENT_COMPATIBILITY', agentMatch.block_reason || 'No compatible agent');
      }
      
      // Stage 8: Controlled Execution
      const execution = await this.stage8_ControlledExecution(encoding, agentMatch);
      if (execution.status === 'FAILED') {
        return this.fail('CONTROLLED_EXECUTION', 'Execution failed');
      }
      
      // Stage 9: Result Capture
      const result = await this.stage9_ResultCapture(execution);
      
      // Stage 10: Thread Update
      const threadUpdate = await this.stage10_ThreadUpdate(intent, encoding, result);
      
      // Mark as completed
      this.state.overall_status = 'completed';
      this.state.updated_at = now();
      
      this.emitEvent('PIPELINE_COMPLETED', { success: true });
      
      return this.state;
      
    } catch (error) {
      this.state.overall_status = 'failed';
      this.emitEvent('PIPELINE_FAILED', { error: (error as Error).message });
      throw error;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 1: INTENT CAPTURE
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage1_IntentCapture(
    rawInput: string,
    context?: Record<string, any>
  ): Promise<IntentCapture | null> {
    this.startStage('INTENT_CAPTURE');
    
    const intent: IntentCapture = {
      id: generateId('intent'),
      timestamp: now(),
      source: 'text',
      raw_input: rawInput,
      language: this.detectLanguage(rawInput),
      confidence: this.calculateIntentConfidence(rawInput),
      context: {
        sphere_id: context?.sphere_id,
        dataspace_id: context?.dataspace_id,
        thread_id: context?.thread_id,
        previous_intent_id: context?.previous_intent_id,
      },
      user_id: context?.user_id || 'anonymous',
      session_id: context?.session_id || generateId('session'),
    };
    
    this.state.intent = intent;
    this.completeStage('INTENT_CAPTURE', intent);
    
    return intent;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 2: SEMANTIC ENCODING
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage2_SemanticEncoding(intent: IntentCapture): Promise<SemanticEncoding | null> {
    this.startStage('SEMANTIC_ENCODING');
    
    const actionType = this.extractActionType(intent.raw_input);
    
    const encoding: SemanticEncoding = {
      id: generateId('encoding'),
      version: '1.0',
      timestamp: now(),
      
      action_type: actionType,
      data_source: this.inferDataSource(intent),
      scope_boundary: 'strict',
      
      operational_mode: 'production',
      focus_parameters: this.extractFocusParameters(intent.raw_input),
      
      permissions: this.generatePermissions(actionType),
      rewrite_constraints: false,
      
      traceability: 'full',
      sensitivity: 'internal',
      
      estimated_tokens: this.estimateTokens(intent.raw_input),
      
      encoding_quality_score: this.calculateEncodingQuality(intent),
    };
    
    this.state.encoding = encoding;
    this.completeStage('SEMANTIC_ENCODING', encoding);
    
    return encoding;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 3: ENCODING VALIDATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage3_EncodingValidation(encoding: SemanticEncoding): Promise<ValidationResult> {
    this.startStage('ENCODING_VALIDATION');
    
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];
    const suggestions: string[] = [];
    
    // Validate action type
    if (!encoding.action_type) {
      errors.push({
        code: 'MISSING_ACTION',
        message: 'Action type is required',
        field: 'action_type',
        severity: 'critical',
      });
    }
    
    // Validate scope
    if (encoding.scope_boundary === 'expandable') {
      warnings.push({
        code: 'EXPANDABLE_SCOPE',
        message: 'Expandable scope may lead to unpredictable costs',
        field: 'scope_boundary',
      });
    }
    
    // Validate quality score
    if (encoding.encoding_quality_score < 50) {
      warnings.push({
        code: 'LOW_QUALITY',
        message: 'Encoding quality is below recommended threshold',
      });
      suggestions.push('Consider rephrasing your request for better clarity');
    }
    
    // Validate permissions
    if (encoding.permissions.length === 0) {
      errors.push({
        code: 'NO_PERMISSIONS',
        message: 'At least one permission must be defined',
        field: 'permissions',
        severity: 'error',
      });
    }
    
    const result: ValidationResult = {
      is_valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
    
    this.state.validation = result;
    
    if (result.is_valid) {
      this.completeStage('ENCODING_VALIDATION', result);
    } else {
      this.failStage('ENCODING_VALIDATION', 'Validation errors found');
    }
    
    return result;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 4: TOKEN & COST ESTIMATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage4_TokenCostEstimation(encoding: SemanticEncoding): Promise<TokenEstimation> {
    this.startStage('TOKEN_COST_ESTIMATION');
    
    const inputTokens = encoding.estimated_tokens;
    const outputTokensEstimated = Math.ceil(inputTokens * 2); // Rough estimate
    
    const estimation: TokenEstimation = {
      input_tokens: inputTokens,
      output_tokens_estimated: outputTokensEstimated,
      total_tokens: inputTokens + outputTokensEstimated,
      
      cost_breakdown: {
        input_cost: inputTokens * 0.001, // Example rate
        output_cost: outputTokensEstimated * 0.002,
        total_cost: (inputTokens * 0.001) + (outputTokensEstimated * 0.002),
        currency: 'CHE_TOKEN',
      },
      
      model_recommendation: this.recommendModel(encoding),
      confidence: 0.85,
    };
    
    this.state.token_estimation = estimation;
    this.completeStage('TOKEN_COST_ESTIMATION', estimation);
    
    return estimation;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 5: SCOPE LOCKING
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage5_ScopeLocking(encoding: SemanticEncoding): Promise<ScopeLock | null> {
    this.startStage('SCOPE_LOCKING');
    
    const scopeLock: ScopeLock = {
      locked_at: now(),
      scope_hash: generateHash(encoding),
      
      boundaries: {
        spheres: this.inferSpheres(encoding),
        dataspaces: [],
        data_types: [encoding.data_source],
      },
      
      restrictions: {
        max_results: 100,
        max_depth: 3,
      },
      
      expansion_allowed: encoding.scope_boundary !== 'strict',
      requires_approval_for_expansion: true,
    };
    
    // Check if scope is too broad
    if (scopeLock.boundaries.spheres.length > 3) {
      this.failStage('SCOPE_LOCKING', 'Scope too broad - limit to 3 spheres');
      return null;
    }
    
    this.state.scope_lock = scopeLock;
    this.completeStage('SCOPE_LOCKING', scopeLock);
    
    return scopeLock;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 6: BUDGET VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage6_BudgetVerification(estimation: TokenEstimation): Promise<BudgetVerification> {
    this.startStage('BUDGET_VERIFICATION');
    
    // In production, this would check real user budget
    const userBalance = 1000; // Mock balance
    const requiredAmount = estimation.cost_breakdown.total_cost;
    
    const verification: BudgetVerification = {
      user_balance: userBalance,
      required_amount: requiredAmount,
      has_sufficient_budget: userBalance >= requiredAmount,
      
      allocation: {
        from_personal: requiredAmount,
      },
    };
    
    if (!verification.has_sufficient_budget) {
      verification.block_reason = `Insufficient budget: need ${requiredAmount}, have ${userBalance}`;
      this.failStage('BUDGET_VERIFICATION', verification.block_reason);
    } else {
      this.completeStage('BUDGET_VERIFICATION', verification);
    }
    
    this.state.budget_verification = verification;
    return verification;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 7: AGENT COMPATIBILITY (ACM)
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage7_AgentCompatibility(
    encoding: SemanticEncoding,
    scopeLock: ScopeLock
  ): Promise<AgentCompatibilityResult> {
    this.startStage('AGENT_COMPATIBILITY');
    
    // Agent Compatibility Matrix check
    const selectedAgent = this.findCompatibleAgent(encoding, scopeLock);
    
    const result: AgentCompatibilityResult = {
      is_compatible: selectedAgent !== null,
      
      selected_agent: selectedAgent || {
        id: 'none',
        name: 'No compatible agent',
        level: 'L0',
      },
      
      compatibility_score: selectedAgent ? 85 : 0,
      
      matrix_check: {
        action_compatible: true,
        scope_compatible: scopeLock.boundaries.spheres.length <= 3,
        permission_compatible: encoding.permissions.some(p => p.allowed),
        budget_compatible: true,
      },
      
      alternatives: selectedAgent ? [] : [
        { agent_id: 'nova', score: 70, reason: 'General purpose assistant' },
      ],
    };
    
    if (!result.is_compatible) {
      result.block_reason = 'No agent compatible with this request';
      this.failStage('AGENT_COMPATIBILITY', result.block_reason);
    } else {
      this.completeStage('AGENT_COMPATIBILITY', result);
    }
    
    this.state.agent_compatibility = result;
    return result;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 8: CONTROLLED EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage8_ControlledExecution(
    encoding: SemanticEncoding,
    agentMatch: AgentCompatibilityResult
  ): Promise<ControlledExecution> {
    this.startStage('CONTROLLED_EXECUTION');
    
    const execution: ControlledExecution = {
      execution_id: generateId('exec'),
      started_at: now(),
      status: 'RUNNING',
      
      monitoring: {
        tokens_used: 0,
        time_elapsed_ms: 0,
        checkpoints_passed: 0,
        warnings: [],
      },
      
      can_pause: true,
      can_cancel: true,
      requires_human_approval: encoding.sensitivity === 'secret',
      
      checkpoint_history: [],
    };
    
    // Simulate execution with checkpoints
    const checkpoints = ['init', 'process', 'validate', 'finalize'];
    
    for (const checkpoint of checkpoints) {
      execution.checkpoint_history.push({
        id: generateId('checkpoint'),
        timestamp: now(),
        stage: checkpoint,
        status: 'passed',
      });
      execution.monitoring.checkpoints_passed++;
      
      this.emitEvent('CHECKPOINT_REACHED', { checkpoint });
    }
    
    execution.status = 'COMPLETED';
    execution.ended_at = now();
    execution.monitoring.time_elapsed_ms = 150; // Mock
    execution.monitoring.tokens_used = encoding.estimated_tokens;
    
    this.state.execution = execution;
    this.completeStage('CONTROLLED_EXECUTION', execution);
    
    return execution;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 9: RESULT CAPTURE
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage9_ResultCapture(execution: ControlledExecution): Promise<ResultCapture> {
    this.startStage('RESULT_CAPTURE');
    
    const result: ResultCapture = {
      result_id: generateId('result'),
      timestamp: now(),
      
      output: {
        type: 'structured',
        content: {
          success: true,
          message: 'Execution completed successfully',
          data: {},
        },
        format: 'json',
      },
      
      metadata: {
        tokens_actual: execution.monitoring.tokens_used,
        cost_actual: execution.monitoring.tokens_used * 0.0015,
        duration_ms: execution.monitoring.time_elapsed_ms,
        model_used: 'claude-sonnet-4-20250514',
      },
      
      quality: {
        confidence: 0.92,
        completeness: 0.95,
        accuracy_estimate: 0.88,
      },
    };
    
    this.state.result = result;
    this.completeStage('RESULT_CAPTURE', result);
    
    return result;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 10: THREAD UPDATE
  // ═══════════════════════════════════════════════════════════════════════════
  
  private async stage10_ThreadUpdate(
    intent: IntentCapture,
    encoding: SemanticEncoding,
    result: ResultCapture
  ): Promise<ThreadUpdate> {
    this.startStage('THREAD_UPDATE');
    
    const previousHash = intent.context.thread_id 
      ? generateHash(intent.context.thread_id)
      : '0000000000000000';
    
    const threadData = {
      intent_id: intent.id,
      encoding_id: encoding.id,
      result_id: result.result_id,
    };
    
    const threadUpdate: ThreadUpdate = {
      thread_id: intent.context.thread_id || generateId('thread'),
      version: 1,
      updated_at: now(),
      
      changes: {
        type: 'append',
        content: threadData,
      },
      
      audit_entry: {
        id: generateId('audit'),
        timestamp: now(),
        action: 'PIPELINE_EXECUTION',
        actor: {
          type: 'system',
          id: 'governance_pipeline',
        },
        details: {
          pipeline_id: this.state.pipeline_id,
          stages_passed: PIPELINE_STAGES_ORDER.length,
          total_cost: result.metadata.cost_actual,
        },
        integrity_hash: generateHash(threadData),
      },
      
      hash_chain: {
        previous_hash: previousHash,
        current_hash: generateHash({ ...threadData, previous_hash: previousHash }),
        algorithm: 'sha256',
      },
    };
    
    this.state.thread_update = threadUpdate;
    this.state.total_cost = result.metadata.cost_actual;
    this.completeStage('THREAD_UPDATE', threadUpdate);
    
    return threadUpdate;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private startStage(stage: PipelineStage): void {
    this.state.current_stage = stage;
    this.state.stages[stage].status = 'IN_PROGRESS';
    this.state.stages[stage].started_at = now();
    this.state.updated_at = now();
    
    this.emitEvent('STAGE_STARTED', { stage });
  }
  
  private completeStage(stage: PipelineStage, result: unknown): void {
    this.state.stages[stage].status = 'PASSED';
    this.state.stages[stage].completed_at = now();
    this.state.stages[stage].result = result;
    this.state.updated_at = now();
    
    this.emitEvent('STAGE_COMPLETED', { stage, result });
  }
  
  private failStage(stage: PipelineStage, error: string): void {
    this.state.stages[stage].status = 'FAILED';
    this.state.stages[stage].completed_at = now();
    this.state.stages[stage].error = error;
    this.state.updated_at = now();
    
    this.emitEvent('STAGE_FAILED', { stage, error });
  }
  
  private fail(stage: PipelineStage, message: string, details?: unknown): PipelineState {
    this.failStage(stage, message);
    this.state.overall_status = 'failed';
    
    if (STAGE_CAN_BLOCK[stage]) {
      logger.error(`[PIPELINE BLOCKED] Stage ${stage}: ${message}`);
    }
    
    return this.state;
  }
  
  private emitEvent(type: PipelineEvent['type'], data?: unknown): void {
    this.events.emit({
      id: generateId('event'),
      timestamp: now(),
      type,
      pipeline_id: this.state.pipeline_id,
      data,
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACTION HELPERS (Would use NLP in production)
  // ═══════════════════════════════════════════════════════════════════════════
  
  private detectLanguage(input: string): string {
    // Simplified - check for French characters
    const frenchPattern = /[àâäéèêëïîôùûüç]/i;
    return frenchPattern.test(input) ? 'fr' : 'en';
  }
  
  private calculateIntentConfidence(input: string): number {
    // Simplified - longer inputs = more confidence
    const length = input.trim().length;
    if (length < 10) return 0.3;
    if (length < 50) return 0.6;
    if (length < 200) return 0.8;
    return 0.9;
  }
  
  private extractActionType(input: string): ActionType {
    const lower = input.toLowerCase();
    
    if (/^(create|créer|add|ajouter|new|nouveau)/i.test(lower)) return 'create';
    if (/^(read|lire|show|montrer|display|afficher)/i.test(lower)) return 'read';
    if (/^(update|modifier|edit|éditer|change)/i.test(lower)) return 'update';
    if (/^(delete|supprimer|remove|enlever)/i.test(lower)) return 'delete';
    if (/^(analyze|analyser|study|étudier)/i.test(lower)) return 'analyze';
    if (/^(generate|générer|create|produire)/i.test(lower)) return 'generate';
    if (/^(search|chercher|find|trouver)/i.test(lower)) return 'search';
    if (/^(summarize|résumer|brief)/i.test(lower)) return 'summarize';
    
    return 'analyze'; // Default
  }
  
  private inferDataSource(intent: IntentCapture): 'sphere' | 'dataspace' | 'external' | 'mixed' {
    if (intent.context.sphere_id && intent.context.dataspace_id) return 'mixed';
    if (intent.context.dataspace_id) return 'dataspace';
    if (intent.context.sphere_id) return 'sphere';
    return 'mixed';
  }
  
  private extractFocusParameters(input: string): SemanticEncoding['focus_parameters'] {
    return [
      {
        area: 'primary_task',
        priority: 'high',
      },
    ];
  }
  
  private generatePermissions(action: ActionType): SemanticEncoding['permissions'] {
    return [
      { action, resource: '*', allowed: true },
      { action: 'delete', resource: 'system', allowed: false },
    ];
  }
  
  private estimateTokens(input: string): number {
    // Rough estimate: ~4 chars per token
    return Math.ceil(input.length / 4);
  }
  
  private calculateEncodingQuality(intent: IntentCapture): number {
    // Quality based on confidence and input clarity
    return Math.round(intent.confidence * 100);
  }
  
  private recommendModel(encoding: SemanticEncoding): string {
    if (encoding.action_type === 'generate') return 'claude-sonnet-4-20250514';
    if (encoding.action_type === 'analyze') return 'claude-sonnet-4-20250514';
    return 'claude-haiku-4-5-20251001';
  }
  
  private inferSpheres(encoding: SemanticEncoding): string[] {
    // Default to personal sphere
    return ['personal'];
  }
  
  private findCompatibleAgent(
    encoding: SemanticEncoding,
    scopeLock: ScopeLock
  ): AgentCompatibilityResult['selected_agent'] | null {
    // Simple agent selection based on action type
    const agentMap: Record<ActionType, { id: string; name: string; level: 'L0' | 'L1' | 'L2' | 'L3' }> = {
      create: { id: 'builder', name: 'Builder Agent', level: 'L2' },
      read: { id: 'reader', name: 'Reader Agent', level: 'L2' },
      update: { id: 'editor', name: 'Editor Agent', level: 'L2' },
      delete: { id: 'cleaner', name: 'Cleaner Agent', level: 'L2' },
      analyze: { id: 'analyst', name: 'Analyst Agent', level: 'L2' },
      generate: { id: 'creator', name: 'Creator Agent', level: 'L2' },
      transform: { id: 'transformer', name: 'Transformer Agent', level: 'L2' },
      summarize: { id: 'summarizer', name: 'Summarizer Agent', level: 'L2' },
      search: { id: 'searcher', name: 'Search Agent', level: 'L2' },
      filter: { id: 'filter', name: 'Filter Agent', level: 'L3' },
      sort: { id: 'sorter', name: 'Sort Agent', level: 'L3' },
      aggregate: { id: 'aggregator', name: 'Aggregator Agent', level: 'L2' },
      schedule: { id: 'scheduler', name: 'Scheduler Agent', level: 'L2' },
      notify: { id: 'notifier', name: 'Notifier Agent', level: 'L2' },
      share: { id: 'sharer', name: 'Share Agent', level: 'L2' },
      export: { id: 'exporter', name: 'Export Agent', level: 'L2' },
    };
    
    return agentMap[encoding.action_type] || { id: 'nova', name: 'Nova', level: 'L0' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default GovernedExecutionPipeline;
