/**
 * CHE·NU™ R&D Workspace Module
 * 
 * A specialized workspace for structured research and decision-making.
 * Implements 6-phase methodology with strict agent controls.
 * 
 * Access: Dashboard → Workspaces → R&D Workspace
 * 
 * Golden Rule: "L'interface structure la pensée. L'agent éclaire la complexité.
 *               L'humain assume la décision."
 */

// Types
export * from './rnd-workspace.types';

// Main Component
export { RnDWorkspace, default } from './RnDWorkspace';

// Phase Components
export { RnDPhase1Exploration } from './RnDPhase1Exploration';
export { RnDPhase2Selection } from './RnDPhase2Selection';
export { RnDPhase3Examples } from './RnDPhase3Examples';
export { RnDPhase4Comparison } from './RnDPhase4Comparison';
export { RnDPhase5Refinement } from './RnDPhase5Refinement';
export { RnDPhase6Decision } from './RnDPhase6Decision';

// Support Components
export { RnDAgentPanel } from './RnDAgentPanel';
export { QuantitativeModulesModal } from './QuantitativeModulesModal';
