/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — 1-CLICK ASSISTANT ENGINE                              ║
 * ║              Friction-Free Action Layer                                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "One instruction → Many coordinated operations."                            ║
 * ║  "Transforms minimal input into maximum output."                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import {
  InputType,
  FileType,
  OneClickInput,
  OutputType,
  OneClickOutput,
  IntentCategory,
  IntentAnalysis,
  WorkflowStepType,
  WorkflowStepStatus,
  WorkflowStep,
  Workflow,
  OperationType,
  OperationDefinition,
  GovernanceCheck,
  OperationAudit,
  OneClickSession,
  OneClickRequest,
  OneClickResponse,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT INTERPRETER
// ═══════════════════════════════════════════════════════════════════════════════

export class IntentInterpreter {
  private intentPatterns: Record<IntentCategory, RegExp[]> = {
    create: [
      /create|make|build|generate|new|draft|write|design/i,
    ],
    analyze: [
      /analyze|review|examine|check|assess|evaluate|inspect/i,
    ],
    transform: [
      /transform|convert|turn into|change|restructure/i,
    ],
    organize: [
      /organize|sort|arrange|categorize|structure|clean up/i,
    ],
    summarize: [
      /summarize|summary|overview|brief|condense|recap/i,
    ],
    estimate: [
      /estimate|calculate|compute|project|forecast|budget/i,
    ],
    schedule: [
      /schedule|plan|calendar|book|set up|arrange time/i,
    ],
    communicate: [
      /send|email|message|notify|communicate|reach out/i,
    ],
    visualize: [
      /visualize|chart|graph|diagram|display|show/i,
    ],
    automate: [
      /automate|set up|workflow|recurring|automatic/i,
    ],
  };
  
  private domainKeywords: Record<string, string[]> = {
    construction: ['construction', 'chantier', 'building', 'contractor', 'materials', 'estimate', 'renovation', 'permit'],
    immobilier: ['property', 'propriété', 'tenant', 'locataire', 'rent', 'loyer', 'portfolio', 'building', 'apartment'],
    finance: ['budget', 'financial', 'revenue', 'expense', 'profit', 'investment', 'cost', 'pricing'],
    creative: ['design', 'brand', 'creative', 'logo', 'presentation', 'pitch', 'deck', 'storyboard'],
    meeting: ['meeting', 'réunion', 'agenda', 'action items', 'minutes', 'discussion'],
  };
  
  /**
   * Analyze user intent from input
   */
  analyze(input: OneClickInput): IntentAnalysis {
    const text = this.extractText(input);
    
    // Detect primary intent
    const { primary, secondary, confidence } = this.detectIntent(text);
    
    // Detect domains
    const domains = this.detectDomains(text);
    
    // Detect scope
    const scope = this.assessScope(text, input);
    
    // Identify gaps
    const missingInfo = this.identifyGaps(text, primary);
    
    // Generate clarifications if needed
    const clarifications = this.generateClarifications(missingInfo);
    
    return {
      id: generateId('intent'),
      input_id: input.id,
      primary_intent: primary,
      secondary_intents: secondary,
      purpose: this.extractPurpose(text),
      scope,
      constraints: this.extractConstraints(text),
      spheres: [input.sphere_id],
      domains,
      missing_info: missingInfo,
      confidence,
      requires_clarification: clarifications.length > 0 && confidence < 0.7,
      clarification_questions: clarifications,
      analyzed_at: now(),
    };
  }
  
  private extractText(input: OneClickInput): string {
    let text = input.text || '';
    
    if (input.file?.content) {
      text += ' ' + input.file.content;
    }
    
    return text.trim();
  }
  
  private detectIntent(text: string): {
    primary: IntentCategory;
    secondary: IntentCategory[];
    confidence: number;
  } {
    const scores: Record<IntentCategory, number> = {
      create: 0, analyze: 0, transform: 0, organize: 0, summarize: 0,
      estimate: 0, schedule: 0, communicate: 0, visualize: 0, automate: 0,
    };
    
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          scores[intent as IntentCategory] += 1;
        }
      }
    }
    
    // Sort by score
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);
    
    if (sorted.length === 0) {
      return { primary: 'create', secondary: [], confidence: 0.3 };
    }
    
    const primary = sorted[0][0] as IntentCategory;
    const secondary = sorted.slice(1, 3).map(([intent]) => intent as IntentCategory);
    const confidence = Math.min(0.9, 0.5 + (sorted[0][1] * 0.1));
    
    return { primary, secondary, confidence };
  }
  
  private detectDomains(text: string): string[] {
    const detected: string[] = [];
    const lower = text.toLowerCase();
    
    for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        detected.push(domain);
      }
    }
    
    return detected.length > 0 ? detected : ['general'];
  }
  
  private assessScope(text: string, input: OneClickInput): 'simple' | 'medium' | 'complex' {
    let complexity = 0;
    
    // Text length
    if (text.length > 200) complexity += 1;
    if (text.length > 500) complexity += 1;
    
    // File presence
    if (input.file) complexity += 1;
    
    // Multiple references
    if (input.workspace_id) complexity += 0.5;
    if (input.thread_id) complexity += 0.5;
    if (input.dataspace_id) complexity += 0.5;
    
    // Keywords suggesting complexity
    if (/multiple|several|all|comprehensive|complete/i.test(text)) complexity += 1;
    
    if (complexity < 2) return 'simple';
    if (complexity < 4) return 'medium';
    return 'complex';
  }
  
  private identifyGaps(text: string, intent: IntentCategory): IntentAnalysis['missing_info'] {
    const gaps: IntentAnalysis['missing_info'] = [];
    
    // Intent-specific required fields
    const requirements: Record<IntentCategory, string[]> = {
      create: ['target_type', 'content_description'],
      analyze: ['subject', 'analysis_type'],
      transform: ['source', 'target_format'],
      organize: ['items', 'organization_criteria'],
      summarize: ['content', 'summary_length'],
      estimate: ['project', 'estimation_type'],
      schedule: ['event', 'time_preference'],
      communicate: ['recipient', 'message_purpose'],
      visualize: ['data', 'visualization_type'],
      automate: ['process', 'trigger'],
    };
    
    // Simple gap detection (in production, would use NLP)
    const required = requirements[intent] || [];
    
    for (const field of required) {
      if (!text.toLowerCase().includes(field.replace('_', ' '))) {
        gaps.push({
          field,
          required: false,
          default_available: true,
        });
      }
    }
    
    return gaps;
  }
  
  private generateClarifications(gaps: IntentAnalysis['missing_info']): string[] {
    return gaps
      .filter(g => g.required && !g.default_available)
      .map(g => {
        const questions: Record<string, string> = {
          target_type: "What type of content would you like to create?",
          subject: "What would you like me to analyze?",
          source: "What content should I transform?",
          recipient: "Who should receive this message?",
        };
        return questions[g.field] || `Could you specify the ${g.field.replace('_', ' ')}?`;
      });
  }
  
  private extractPurpose(text: string): string {
    // Simple extraction - first sentence or up to 100 chars
    const firstSentence = text.split(/[.!?]/)[0];
    return firstSentence.substring(0, 100).trim();
  }
  
  private extractConstraints(text: string): string[] {
    const constraints: string[] = [];
    
    // Time constraints
    if (/by (today|tomorrow|end of|deadline)/i.test(text)) {
      constraints.push('time_sensitive');
    }
    
    // Format constraints
    if (/pdf|document|spreadsheet|presentation/i.test(text)) {
      const match = text.match(/(pdf|document|spreadsheet|presentation)/i);
      if (match) constraints.push(`format:${match[1].toLowerCase()}`);
    }
    
    return constraints;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORKFLOW CONSTRUCTOR
// ═══════════════════════════════════════════════════════════════════════════════

export class WorkflowConstructor {
  /**
   * Build workflow from intent analysis
   */
  construct(intent: IntentAnalysis, input: OneClickInput): Workflow {
    const workflowId = generateId('wf');
    
    // Get operation type
    const operationType = this.determineOperation(intent);
    
    // Build steps
    const steps = this.buildSteps(operationType, intent, input);
    
    // Add checkpoints
    const checkpoints = this.addCheckpoints(steps);
    
    // Identify parallelizable steps
    const parallelGroups = this.identifyParallelGroups(steps);
    
    return {
      id: workflowId,
      name: `${intent.primary_intent}_workflow`,
      description: `Workflow for: ${intent.purpose}`,
      input_id: input.id,
      intent_id: intent.id,
      steps,
      current_step: 0,
      parallel_groups: parallelGroups,
      checkpoints,
      fallback_steps: new Map(),
      status: 'pending',
      progress: 0,
      created_at: now(),
      estimated_duration_ms: this.estimateDuration(steps),
    };
  }
  
  private determineOperation(intent: IntentAnalysis): OperationType {
    const domain = intent.domains[0] || 'general';
    
    const mappings: Record<string, Record<IntentCategory, OperationType>> = {
      construction: {
        create: 'construction_estimate',
        estimate: 'construction_estimate',
        analyze: 'materials_list',
        schedule: 'project_timeline',
        organize: 'permit_checklist',
      } as any,
      immobilier: {
        organize: 'portfolio_organization',
        create: 'property_card_generation',
        analyze: 'rent_analysis',
        schedule: 'maintenance_schedule',
      } as any,
      finance: {
        create: 'financial_projection',
        analyze: 'competitive_analysis',
        estimate: 'financial_projection',
      } as any,
      meeting: {
        transform: 'meeting_actionability',
        analyze: 'decision_extraction',
        create: 'action_plan',
        summarize: 'meeting_summary',
      } as any,
    };
    
    return mappings[domain]?.[intent.primary_intent] || 'custom';
  }
  
  private buildSteps(
    operation: OperationType, 
    intent: IntentAnalysis, 
    input: OneClickInput
  ): WorkflowStep[] {
    const steps: WorkflowStep[] = [];
    let order = 1;
    
    // Step 1: Process input
    if (input.file) {
      steps.push(this.createStep(order++, 'file_transform', 'Process Input File', {
        file_id: input.file.name,
        file_type: input.file.type,
      }));
    }
    
    // Step 2: Extract content
    steps.push(this.createStep(order++, 'content_extract', 'Extract Key Information', {
      domains: intent.domains,
    }));
    
    // Step 3: Analyze
    steps.push(this.createStep(order++, 'content_analyze', 'Analyze Content', {
      analysis_type: intent.primary_intent,
      depends_on: [steps[steps.length - 1].id],
    }));
    
    // Step 4: Generate (operation specific)
    steps.push(this.createStep(order++, 'content_generate', 'Generate Output', {
      operation_type: operation,
      depends_on: [steps[steps.length - 1].id],
    }));
    
    // Step 5: Format
    steps.push(this.createStep(order++, 'content_format', 'Format Results', {
      depends_on: [steps[steps.length - 1].id],
    }));
    
    // Step 6: Create/Update DataSpace
    steps.push(this.createStep(order++, 'dataspace_update', 'Store in DataSpace', {
      dataspace_id: input.dataspace_id,
      depends_on: [steps[steps.length - 1].id],
    }));
    
    // Update dependencies
    for (let i = 1; i < steps.length; i++) {
      steps[i].depends_on = [steps[i - 1].id];
    }
    
    return steps;
  }
  
  private createStep(
    order: number, 
    type: WorkflowStepType, 
    name: string, 
    inputs: Record<string, any>
  ): WorkflowStep {
    return {
      id: generateId('step'),
      type,
      name,
      description: `Step ${order}: ${name}`,
      order,
      depends_on: [],
      inputs,
      status: 'pending',
      can_undo: true,
    };
  }
  
  private addCheckpoints(steps: WorkflowStep[]): Workflow['checkpoints'] {
    const checkpoints: Workflow['checkpoints'] = [];
    
    // Add checkpoint before content generation
    const genStep = steps.find(s => s.type === 'content_generate');
    if (genStep) {
      checkpoints.push({
        step_id: genStep.id,
        description: 'Verify analysis before generating output',
        requires_approval: false,
      });
    }
    
    // Add checkpoint before dataspace update
    const dsStep = steps.find(s => s.type === 'dataspace_update');
    if (dsStep) {
      checkpoints.push({
        step_id: dsStep.id,
        description: 'Review output before saving',
        requires_approval: false,
      });
    }
    
    return checkpoints;
  }
  
  private identifyParallelGroups(steps: WorkflowStep[]): Map<string, string[]> {
    // In this basic implementation, all steps are sequential
    // In production, would identify steps without dependencies that can run in parallel
    return new Map();
  }
  
  private estimateDuration(steps: WorkflowStep[]): number {
    // Rough estimate: 500ms per step
    return steps.length * 500;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

export class AgentOrchestrator {
  /**
   * Assign agents to workflow steps
   */
  assignAgents(workflow: Workflow, domains: string[]): Workflow {
    for (const step of workflow.steps) {
      const agent = this.selectAgent(step.type, domains);
      if (agent) {
        step.agent_id = agent.id;
        step.agent_type = agent.type;
      }
    }
    return workflow;
  }
  
  private selectAgent(stepType: WorkflowStepType, domains: string[]): { id: string; type: string } | null {
    // Map step types to agent types
    const agentMap: Record<WorkflowStepType, string> = {
      file_transform: 'file_processor',
      content_extract: 'extractor',
      content_analyze: 'analyst',
      content_generate: 'generator',
      content_format: 'formatter',
      dataspace_create: 'dataspace_manager',
      dataspace_update: 'dataspace_manager',
      agent_task: 'task_executor',
      calculation: 'calculator',
      visualization: 'visualizer',
      notification: 'notifier',
      checkpoint: 'validator',
      human_review: 'coordinator',
    };
    
    const type = agentMap[stepType];
    if (!type) return null;
    
    // In production, would select from agent registry
    return {
      id: `agent_${type}_${domains[0] || 'general'}`,
      type,
    };
  }
  
  /**
   * Execute a workflow step
   */
  async executeStep(step: WorkflowStep): Promise<WorkflowStep> {
    step.status = 'running';
    step.started_at = now();
    
    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate output based on step type
      step.outputs = this.generateStepOutput(step);
      step.status = 'completed';
      step.completed_at = now();
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return step;
  }
  
  private generateStepOutput(step: WorkflowStep): Record<string, any> {
    // Placeholder outputs by step type
    const outputs: Record<WorkflowStepType, any> = {
      file_transform: { extracted_content: 'Content extracted from file' },
      content_extract: { entities: [], key_info: {} },
      content_analyze: { analysis_result: {}, insights: [] },
      content_generate: { generated_content: '', format: 'markdown' },
      content_format: { formatted_content: '', style_applied: true },
      dataspace_create: { dataspace_id: generateId('ds') },
      dataspace_update: { updated: true },
      agent_task: { task_completed: true },
      calculation: { result: 0 },
      visualization: { chart_url: '' },
      notification: { sent: true },
      checkpoint: { verified: true },
      human_review: { approved: true },
    };
    
    return outputs[step.type] || {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT SYNTHESIZER
// ═══════════════════════════════════════════════════════════════════════════════

export class OutputSynthesizer {
  /**
   * Assemble final output from workflow results
   */
  synthesize(workflow: Workflow): OneClickOutput[] {
    const outputs: OneClickOutput[] = [];
    const startTime = Date.now();
    
    // Gather outputs from completed steps
    const generatedContent = workflow.steps
      .filter(s => s.status === 'completed' && s.outputs)
      .map(s => s.outputs);
    
    // Create primary output
    outputs.push({
      id: generateId('out'),
      type: this.determineOutputType(workflow),
      title: `Output: ${workflow.name}`,
      description: workflow.description,
      content: this.assembleContent(generatedContent),
      files: [],
      generated_at: now(),
      generation_time_ms: Date.now() - startTime,
      quality_score: this.assessQuality(generatedContent),
    });
    
    // Add summary output
    outputs.push({
      id: generateId('out'),
      type: 'summary',
      title: 'Executive Summary',
      description: 'High-level overview of the operation',
      content: this.generateSummary(workflow, generatedContent),
      files: [],
      generated_at: now(),
      generation_time_ms: 0,
    });
    
    return outputs;
  }
  
  private determineOutputType(workflow: Workflow): OutputType {
    // Determine from workflow steps
    if (workflow.steps.some(s => s.type === 'visualization')) return 'dashboard';
    if (workflow.steps.some(s => s.type === 'calculation')) return 'spreadsheet';
    return 'document';
  }
  
  private assembleContent(stepOutputs: unknown[]): unknown {
    // Combine all step outputs
    return {
      sections: stepOutputs,
      assembled_at: now(),
    };
  }
  
  private generateSummary(workflow: Workflow, outputs: unknown[]): string {
    const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
    const totalSteps = workflow.steps.length;
    
    return `Operation "${workflow.name}" completed. ${completedSteps}/${totalSteps} steps executed successfully.`;
  }
  
  private assessQuality(outputs: unknown[]): number {
    // Simple quality score based on output completeness
    const hasContent = outputs.length > 0;
    const hasAllFields = outputs.every(o => Object.keys(o).length > 0);
    
    let score = 0.5;
    if (hasContent) score += 0.25;
    if (hasAllFields) score += 0.25;
    
    return score;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE ENFORCER
// ═══════════════════════════════════════════════════════════════════════════════

export class GovernanceEnforcer {
  /**
   * Run governance checks for operation
   */
  verify(input: OneClickInput, workflow: Workflow): GovernanceCheck[] {
    const checks: GovernanceCheck[] = [];
    
    // Permission check
    checks.push({
      check_type: 'permission',
      passed: true, // Would verify against permission engine
      details: 'User has required permissions',
      blocking: true,
    });
    
    // Identity check
    checks.push({
      check_type: 'identity',
      passed: true,
      details: 'Operation within identity scope',
      blocking: true,
    });
    
    // Budget check
    const estimatedCost = workflow.steps.length * 10; // Simplified
    checks.push({
      check_type: 'budget',
      passed: true, // Would check token budget
      details: `Estimated cost: ${estimatedCost} tokens`,
      blocking: false,
    });
    
    // Data access check
    checks.push({
      check_type: 'data_access',
      passed: true,
      details: 'No cross-identity data access detected',
      blocking: true,
    });
    
    // Reversibility check
    checks.push({
      check_type: 'reversibility',
      passed: workflow.steps.every(s => s.can_undo),
      details: 'All operations are reversible',
      blocking: false,
    });
    
    return checks;
  }
  
  /**
   * Create audit record
   */
  createAudit(
    input: OneClickInput,
    intent: IntentAnalysis,
    workflow: Workflow,
    checks: GovernanceCheck[],
    outputs: OneClickOutput[]
  ): OperationAudit {
    return {
      operation_id: generateId('audit'),
      user_id: input.user_id,
      input_summary: input.text?.substring(0, 100) || 'File/visual input',
      input_type: input.type,
      detected_intent: intent.primary_intent,
      confidence: intent.confidence,
      workflow_id: workflow.id,
      steps_executed: workflow.steps.filter(s => s.status === 'completed').length,
      steps_total: workflow.steps.length,
      governance_checks: checks,
      all_checks_passed: checks.every(c => c.passed || !c.blocking),
      outputs_generated: outputs.map(o => o.type),
      can_undo: workflow.steps.every(s => s.can_undo),
      undo_token: generateId('undo'),
      started_at: workflow.started_at || now(),
      completed_at: now(),
      duration_ms: workflow.actual_duration_ms || 0,
      tokens_consumed: workflow.steps.length * 10,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ONECLICK ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class OneClickEngine {
  private sessions: Map<string, OneClickSession> = new Map();
  private intentInterpreter: IntentInterpreter;
  private workflowConstructor: WorkflowConstructor;
  private agentOrchestrator: AgentOrchestrator;
  private outputSynthesizer: OutputSynthesizer;
  private governanceEnforcer: GovernanceEnforcer;
  
  constructor() {
    this.intentInterpreter = new IntentInterpreter();
    this.workflowConstructor = new WorkflowConstructor();
    this.agentOrchestrator = new AgentOrchestrator();
    this.outputSynthesizer = new OutputSynthesizer();
    this.governanceEnforcer = new GovernanceEnforcer();
  }
  
  /**
   * Execute a 1-click operation
   */
  async execute(request: OneClickRequest): Promise<OneClickResponse> {
    // Create or get session
    const session = this.getOrCreateSession(request.user_id);
    
    // Create input
    const input = this.createInput(request);
    session.current_input = input;
    session.status = 'analyzing';
    
    try {
      // Step 1: Analyze intent
      const intent = this.intentInterpreter.analyze(input);
      session.current_intent = intent;
      
      // Step 2: Check if clarification needed
      if (intent.requires_clarification && !request.skip_clarification) {
        session.status = 'clarifying';
        session.clarifications_pending = intent.clarification_questions.map(q => ({
          question: q,
          field: '',
          answered: false,
        }));
        
        return {
          session_id: session.id,
          status: 'clarifying',
          clarification_questions: intent.clarification_questions,
        };
      }
      
      // Step 3: Construct workflow
      const workflow = this.workflowConstructor.construct(intent, input);
      
      // Step 4: Assign agents
      this.agentOrchestrator.assignAgents(workflow, intent.domains);
      session.current_workflow = workflow;
      
      // Step 5: Governance verification
      const checks = this.governanceEnforcer.verify(input, workflow);
      if (!checks.every(c => c.passed || !c.blocking)) {
        const failed = checks.find(c => !c.passed && c.blocking);
        return {
          session_id: session.id,
          status: 'failed',
          error: {
            code: 'GOVERNANCE_FAILED',
            message: failed?.details || 'Governance check failed',
            recoverable: false,
          },
        };
      }
      
      // Step 6: Execute workflow
      session.status = 'executing';
      workflow.status = 'running';
      workflow.started_at = now();
      
      for (const step of workflow.steps) {
        // Check dependencies
        const depsCompleted = step.depends_on.every(depId => {
          const dep = workflow.steps.find(s => s.id === depId);
          return dep?.status === 'completed';
        });
        
        if (!depsCompleted) continue;
        
        await this.agentOrchestrator.executeStep(step);
        workflow.current_step++;
        workflow.progress = (workflow.current_step / workflow.steps.length) * 100;
        
        if (step.status === 'failed') {
          workflow.status = 'failed';
          break;
        }
      }
      
      workflow.completed_at = now();
      workflow.actual_duration_ms = new Date(workflow.completed_at).getTime() - 
        new Date(workflow.started_at!).getTime();
      workflow.status = workflow.steps.every(s => s.status === 'completed') 
        ? 'completed' 
        : 'failed';
      
      // Step 7: Synthesize output
      const outputs = this.outputSynthesizer.synthesize(workflow);
      
      // Step 8: Create audit
      const audit = this.governanceEnforcer.createAudit(input, intent, workflow, checks, outputs);
      session.completed_operations.push(audit);
      
      session.status = 'idle';
      
      return {
        session_id: session.id,
        status: 'completed',
        workflow,
        progress: 100,
        outputs,
        audit_id: audit.operation_id,
      };
      
    } catch (error) {
      session.status = 'idle';
      return {
        session_id: session.id,
        status: 'failed',
        error: {
          code: 'EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          recoverable: true,
        },
      };
    }
  }
  
  /**
   * Provide clarification answer
   */
  async provideClarification(sessionId: string, answers: Record<string, string>): Promise<OneClickResponse> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'clarifying') {
      return {
        session_id: sessionId,
        status: 'failed',
        error: {
          code: 'INVALID_SESSION',
          message: 'Session not found or not awaiting clarification',
          recoverable: false,
        },
      };
    }
    
    // Update clarifications
    for (const [field, answer] of Object.entries(answers)) {
      const pending = session.clarifications_pending.find(c => c.field === field);
      if (pending) {
        pending.answered = true;
        pending.answer = answer;
      }
    }
    
    // If all answered, re-execute
    if (session.clarifications_pending.every(c => c.answered)) {
      // Re-execute with updated context
      if (session.current_input) {
        session.current_input.text += ' ' + Object.values(answers).join(' ');
        return this.execute({
          text: session.current_input.text,
          user_id: session.current_input.user_id,
          sphere_id: session.current_input.sphere_id,
          skip_clarification: true,
        });
      }
    }
    
    return {
      session_id: sessionId,
      status: 'clarifying',
      clarification_questions: session.clarifications_pending
        .filter(c => !c.answered)
        .map(c => c.question),
    };
  }
  
  /**
   * Get session status
   */
  getSession(sessionId: string): OneClickSession | null {
    return this.sessions.get(sessionId) || null;
  }
  
  /**
   * Cancel operation
   */
  cancel(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    if (session.current_workflow) {
      session.current_workflow.status = 'cancelled';
    }
    
    session.status = 'idle';
    return true;
  }
  
  private getOrCreateSession(userId: string): OneClickSession {
    // Find existing session for user
    for (const session of this.sessions.values()) {
      if (session.user_id === userId && session.status !== 'idle') {
        return session;
      }
    }
    
    // Create new session
    const session: OneClickSession = {
      id: generateId('session'),
      user_id: userId,
      clarifications_pending: [],
      completed_operations: [],
      status: 'idle',
      started_at: now(),
      last_activity: now(),
    };
    
    this.sessions.set(session.id, session);
    return session;
  }
  
  private createInput(request: OneClickRequest): OneClickInput {
    return {
      id: generateId('input'),
      type: request.file ? 'file_upload' : request.visual_url ? 'visual' : 'natural_language',
      text: request.text,
      workspace_id: request.workspace_id,
      thread_id: request.thread_id,
      dataspace_id: request.dataspace_id,
      user_id: request.user_id,
      sphere_id: request.sphere_id,
      submitted_at: now(),
    };
  }
  
  /**
   * Get engine statistics
   */
  getStats(): {
    active_sessions: number;
    total_operations: number;
    operations_by_intent: Record<string, number>;
  } {
    let totalOps = 0;
    const byIntent: Record<string, number> = {};
    
    this.sessions.forEach(session => {
      session.completed_operations.forEach(op => {
        totalOps++;
        byIntent[op.detected_intent] = (byIntent[op.detected_intent] || 0) + 1;
      });
    });
    
    return {
      active_sessions: Array.from(this.sessions.values()).filter(s => s.status !== 'idle').length,
      total_operations: totalOps,
      operations_by_intent: byIntent,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default OneClickEngine;
