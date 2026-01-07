/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — 1-CLICK ASSISTANT ENGINE INDEX                        ║
 * ║              Friction-Free Action Layer                                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "One instruction → Many coordinated operations."                            ║
 * ║  "Governed, Reversible, Explainable, Identity-Scoped"                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Input
  InputType,
  FileType,
  OneClickInput,
  
  // Output
  OutputType,
  OneClickOutput,
  
  // Intent
  IntentCategory,
  IntentAnalysis,
  
  // Workflow
  WorkflowStepType,
  WorkflowStepStatus,
  WorkflowStep,
  Workflow,
  
  // Operations
  OperationType,
  OperationDefinition,
  
  // Governance
  GovernanceCheck,
  OperationAudit,
  
  // Session
  OneClickSession,
  
  // Request/Response
  OneClickRequest,
  OneClickResponse,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  OneClickEngine,
  IntentInterpreter,
  WorkflowConstructor,
  AgentOrchestrator,
  OutputSynthesizer,
  GovernanceEnforcer,
} from './OneClickEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

import {
  OneClickEngine,
  IntentInterpreter,
  WorkflowConstructor,
  AgentOrchestrator,
  OutputSynthesizer,
  GovernanceEnforcer,
} from './OneClickEngine';

export interface OneClickEngineSet {
  oneclick: OneClickEngine;
  interpreter: IntentInterpreter;
  workflow: WorkflowConstructor;
  orchestrator: AgentOrchestrator;
  synthesizer: OutputSynthesizer;
  governance: GovernanceEnforcer;
}

/**
 * Create a complete 1-click engine set
 */
export function createOneClickEngines(): OneClickEngineSet {
  return {
    oneclick: new OneClickEngine(),
    interpreter: new IntentInterpreter(),
    workflow: new WorkflowConstructor(),
    orchestrator: new AgentOrchestrator(),
    synthesizer: new OutputSynthesizer(),
    governance: new GovernanceEnforcer(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  OneClickEngine,
  IntentInterpreter,
  WorkflowConstructor,
  AgentOrchestrator,
  OutputSynthesizer,
  GovernanceEnforcer,
  createOneClickEngines,
};
