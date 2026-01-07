/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — ORCHESTRATOR ENGINE                                   ║
 * ║              Core Engine 1/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "The central coordinator that routes requests, manages workflows,          ║
 * ║   and ensures system coherence."                                            ║
 * ║  "Every significant operation passes through the Orchestrator."             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type RequestPriority = 'critical' | 'high' | 'normal' | 'low' | 'background';
export type RequestStatus = 'queued' | 'routing' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type EngineType = 'core' | 'domain' | 'integration';

export interface OrchestratorRequest {
  id: string;
  timestamp: string;
  source: {
    type: 'user' | 'agent' | 'system' | 'scheduled';
    id: string;
  };
  target: {
    engine?: string;
    sphere?: string;
    domain?: string;
  };
  payload: unknown;
  priority: RequestPriority;
  status: RequestStatus;
  metadata: {
    user_id: string;
    session_id: string;
    thread_id?: string;
    requires_governance: boolean;
  };
}

export interface RoutingDecision {
  request_id: string;
  routed_to: {
    engine: string;
    type: EngineType;
    instance_id: string;
  };
  routing_reason: string;
  estimated_time_ms: number;
  fallback_engines?: string[];
}

export interface WorkflowStep {
  id: string;
  order: number;
  engine: string;
  action: string;
  input_from?: string; // Previous step ID
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: unknown;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  current_step: number;
  status: 'active' | 'completed' | 'failed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  engines: Record<string, {
    status: 'online' | 'offline' | 'overloaded';
    load: number; // 0-100
    last_heartbeat: string;
  }>;
  queue_depth: number;
  avg_response_time_ms: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATOR ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class OrchestratorEngine {
  private requestQueue: OrchestratorRequest[] = [];
  private activeWorkflows: Map<string, Workflow> = new Map();
  private engineRegistry: Map<string, { type: EngineType; status: string; load: number }> = new Map();
  private routingRules: Map<string, string[]> = new Map();
  
  constructor() {
    this.initializeEngineRegistry();
    this.initializeRoutingRules();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private initializeEngineRegistry(): void {
    // Core Engines
    const coreEngines = [
      'orchestrator', 'context', 'memory', 'permission', 'search', 'notification'
    ];
    coreEngines.forEach(e => {
      this.engineRegistry.set(e, { type: 'core', status: 'online', load: 0 });
    });
    
    // Domain Engines (from existing 42 engines)
    const domainEngines = [
      'health', 'habit', 'energy', 'personal_finance', 'life_map',
      'business_finance', 'operation', 'logistics', 'construction', 'market',
      'art', 'media_creation', 'design', 'concept',
      'study', 'research', 'documentation', 'info_arch',
      'post', 'comment', 'message', 'feed', 'influence',
      'group', 'page', 'forum', 'announcement', 'civic',
      'xr_scene', 'spatial', 'world_builder',
      'team_role', 'coordination', 'delegation', 'collaboration',
      'sandbox', 'cognitive_tool', 'test_rig',
      'streaming', 'interaction', 'game', 'audience_experience'
    ];
    domainEngines.forEach(e => {
      this.engineRegistry.set(e, { type: 'domain', status: 'online', load: 0 });
    });
    
    // Integration Engines
    const integrationEngines = ['api_gateway', 'sync', 'transform', 'import_export'];
    integrationEngines.forEach(e => {
      this.engineRegistry.set(e, { type: 'integration', status: 'online', load: 0 });
    });
  }
  
  private initializeRoutingRules(): void {
    // Sphere -> Engine mappings
    this.routingRules.set('personal', ['health', 'habit', 'energy', 'personal_finance', 'life_map']);
    this.routingRules.set('business', ['business_finance', 'operation', 'logistics', 'construction', 'market']);
    this.routingRules.set('creative', ['art', 'media_creation', 'design', 'concept']);
    this.routingRules.set('scholar', ['study', 'research', 'documentation', 'info_arch']);
    this.routingRules.set('social', ['post', 'comment', 'message', 'feed', 'influence']);
    this.routingRules.set('community', ['group', 'page', 'forum', 'announcement', 'civic']);
    this.routingRules.set('xr', ['xr_scene', 'spatial', 'world_builder']);
    this.routingRules.set('my_team', ['team_role', 'coordination', 'delegation', 'collaboration']);
    this.routingRules.set('ai_lab', ['sandbox', 'cognitive_tool', 'test_rig']);
    this.routingRules.set('entertainment', ['streaming', 'interaction', 'game', 'audience_experience']);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // REQUEST MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Submit a request to the orchestrator
   */
  async submitRequest(request: Omit<OrchestratorRequest, 'id' | 'timestamp' | 'status'>): Promise<string> {
    const fullRequest: OrchestratorRequest = {
      ...request,
      id: this.generateId('req'),
      timestamp: new Date().toISOString(),
      status: 'queued',
    };
    
    // Add to queue based on priority
    this.insertByPriority(fullRequest);
    
    // Process immediately if high priority
    if (fullRequest.priority === 'critical' || fullRequest.priority === 'high') {
      await this.processRequest(fullRequest);
    }
    
    return fullRequest.id;
  }
  
  /**
   * Route a request to the appropriate engine
   */
  async routeRequest(request: OrchestratorRequest): Promise<RoutingDecision> {
    request.status = 'routing';
    
    // Determine target engine
    let targetEngine: string;
    
    if (request.target.engine) {
      targetEngine = request.target.engine;
    } else if (request.target.sphere) {
      const sphereEngines = this.routingRules.get(request.target.sphere);
      targetEngine = sphereEngines?.[0] || 'context';
    } else if (request.target.domain) {
      targetEngine = request.target.domain;
    } else {
      targetEngine = 'context'; // Default to context engine
    }
    
    // Verify engine is available
    const engineInfo = this.engineRegistry.get(targetEngine);
    if (!engineInfo || engineInfo.status !== 'online') {
      // Find fallback
      const fallbacks = this.findFallbackEngines(targetEngine);
      if (fallbacks.length > 0) {
        targetEngine = fallbacks[0];
      }
    }
    
    return {
      request_id: request.id,
      routed_to: {
        engine: targetEngine,
        type: this.engineRegistry.get(targetEngine)?.type || 'core',
        instance_id: `${targetEngine}_${Date.now()}`,
      },
      routing_reason: request.target.engine 
        ? 'Direct engine specification'
        : request.target.sphere 
          ? `Sphere-based routing: ${request.target.sphere}`
          : 'Default routing',
      estimated_time_ms: this.estimateProcessingTime(targetEngine, request.payload),
      fallback_engines: this.findFallbackEngines(targetEngine),
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // WORKFLOW MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Create a new workflow
   */
  createWorkflow(name: string, steps: Omit<WorkflowStep, 'id' | 'status'>[]): Workflow {
    const workflow: Workflow = {
      id: this.generateId('wf'),
      name,
      steps: steps.map((step, index) => ({
        ...step,
        id: this.generateId('step'),
        status: index === 0 ? 'pending' : 'pending',
      })),
      current_step: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.activeWorkflows.set(workflow.id, workflow);
    return workflow;
  }
  
  /**
   * Execute the next step in a workflow
   */
  async executeWorkflowStep(workflowId: string): Promise<WorkflowStep | null> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow || workflow.status !== 'active') return null;
    
    const currentStep = workflow.steps[workflow.current_step];
    if (!currentStep) {
      workflow.status = 'completed';
      return null;
    }
    
    currentStep.status = 'running';
    
    try {
      // Route to engine
      const routing = await this.routeRequest({
        id: this.generateId('req'),
        timestamp: new Date().toISOString(),
        source: { type: 'system', id: workflowId },
        target: { engine: currentStep.engine },
        payload: { action: currentStep.action },
        priority: 'normal',
        status: 'queued',
        metadata: {
          user_id: 'system',
          session_id: workflowId,
          requires_governance: false,
        },
      });
      
      // Simulate execution
      currentStep.result = { routing, success: true };
      currentStep.status = 'completed';
      
      // Move to next step
      workflow.current_step++;
      workflow.updated_at = new Date().toISOString();
      
      if (workflow.current_step >= workflow.steps.length) {
        workflow.status = 'completed';
      }
      
    } catch (error) {
      currentStep.status = 'failed';
      currentStep.result = { error: (error as Error).message };
      workflow.status = 'failed';
    }
    
    return currentStep;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SYSTEM COHERENCE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get current system health status
   */
  getSystemHealth(): SystemHealth {
    const engines: SystemHealth['engines'] = {};
    
    this.engineRegistry.forEach((info, name) => {
      engines[name] = {
        status: info.status as any,
        load: info.load,
        last_heartbeat: new Date().toISOString(),
      };
    });
    
    const avgLoad = Array.from(this.engineRegistry.values())
      .reduce((sum, e) => sum + e.load, 0) / this.engineRegistry.size;
    
    return {
      status: avgLoad < 50 ? 'healthy' : avgLoad < 80 ? 'degraded' : 'critical',
      engines,
      queue_depth: this.requestQueue.length,
      avg_response_time_ms: 150, // Mock
    };
  }
  
  /**
   * Update engine status
   */
  updateEngineStatus(engineName: string, status: string, load: number): void {
    const engine = this.engineRegistry.get(engineName);
    if (engine) {
      engine.status = status;
      engine.load = Math.min(100, Math.max(0, load));
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private insertByPriority(request: OrchestratorRequest): void {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3, background: 4 };
    const requestPriority = priorityOrder[request.priority];
    
    let insertIndex = this.requestQueue.findIndex(
      r => priorityOrder[r.priority] > requestPriority
    );
    
    if (insertIndex === -1) {
      this.requestQueue.push(request);
    } else {
      this.requestQueue.splice(insertIndex, 0, request);
    }
  }
  
  private async processRequest(request: OrchestratorRequest): Promise<void> {
    const routing = await this.routeRequest(request);
    request.status = 'processing';
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, routing.estimated_time_ms));
    
    request.status = 'completed';
    
    // Remove from queue
    const index = this.requestQueue.findIndex(r => r.id === request.id);
    if (index !== -1) {
      this.requestQueue.splice(index, 1);
    }
  }
  
  private findFallbackEngines(primaryEngine: string): string[] {
    const fallbacks: string[] = [];
    const engineInfo = this.engineRegistry.get(primaryEngine);
    
    if (engineInfo?.type === 'domain') {
      // For domain engines, context engine is always a fallback
      fallbacks.push('context');
    }
    
    // Find similar engines
    this.engineRegistry.forEach((info, name) => {
      if (name !== primaryEngine && info.type === engineInfo?.type && info.status === 'online') {
        fallbacks.push(name);
      }
    });
    
    return fallbacks.slice(0, 3);
  }
  
  private estimateProcessingTime(engine: string, payload: unknown): number {
    const engineInfo = this.engineRegistry.get(engine);
    const baseTime = 100;
    const loadFactor = 1 + (engineInfo?.load || 0) / 100;
    const payloadFactor = JSON.stringify(payload).length / 1000;
    
    return Math.round(baseTime * loadFactor * (1 + payloadFactor));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default OrchestratorEngine;
