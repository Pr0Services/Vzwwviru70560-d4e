/**
 * 🧠 CHE·NU™ V71 — CORE MODULES INDEX
 * 
 * Zone Sacrée — Ces modules ne sont JAMAIS mutés directement
 * 
 * Exports:
 * - OPA Gate (Module 01)
 * - Causal Engine (Module 03)
 * - World Engine (Module 04)
 * - Artifact Ledger (Module 00)
 */

// ============================================================================
// OPA GATE (Module 01)
// ============================================================================
export { 
  OPAGate, 
  opaGate,
  type OPADecision,
  type OPARequest 
} from './opa/opa-gate';

// ============================================================================
// CAUSAL ENGINE (Module 03)
// ============================================================================
export { 
  CausalEngine, 
  causalEngine,
  type CausalChain,
  type CausalStep,
  type CausalQuery 
} from './causal/causal-engine';

// ============================================================================
// WORLD ENGINE (Module 04)
// ============================================================================
export { 
  WorldEngine, 
  worldEngine,
  type Simulation,
  type SimulationOutcome,
  type SimulationRequest 
} from './worldengine/world-engine';

// ============================================================================
// ARTIFACT LEDGER (Module 00)
// ============================================================================
export { 
  ArtifactLedger, 
  artifactLedger,
  type Artifact,
  type ArtifactQuery 
} from './ledger/artifact-ledger';

// ============================================================================
// CORE VERSION
// ============================================================================
export const CORE_VERSION = '71.0';
export const CORE_MODULES = {
  ledger: { id: 0, name: 'Artifact Ledger' },
  opa: { id: 1, name: 'OPA Gate' },
  causal: { id: 3, name: 'Causal Engine' },
  worldengine: { id: 4, name: 'World Engine' },
} as const;
