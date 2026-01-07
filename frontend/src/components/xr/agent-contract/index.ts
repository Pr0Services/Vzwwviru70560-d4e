/**
 * CHE·NU™ Agent Contract — Module Exports
 * 
 * Meta module for explicit, bounded, accountable agent governance.
 * Position: Mega-Tree → Meta Layer → Agent Contracts
 * 
 * Core principles:
 * - Contracts are readable by humans
 * - Contracts are enforceable by system
 * - Contracts are visible in Universe View
 * - Only human owner may approve/modify/retire
 * - Agents cannot modify their own contracts
 * 
 * @module agent-contract
 * @version 1.0.0
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core contract types
  ContractStatus,
  AgentActionType,
  AgentDecisionType,
  ActionRiskLevel,
  ViolationResponse,
  LoggingLevel,
  AuditFrequency,
  
  // Permission structures
  ActionCondition,
  AllowedAction,
  ForbiddenAction,
  Permissions,
  
  // Decision boundaries
  DecisionBoundaries,
  
  // Data access
  DataScope,
  DataAccess,
  
  // Interaction rules
  ContactPermission,
  InteractionRules,
  
  // Learning constraints
  LearningConstraints,
  
  // Enforcement
  Enforcement,
  
  // Purpose
  ContractPurpose,
  
  // Creation context
  CreationContext,
  
  // Main contract interface
  AgentContract,
  
  // Summary for list views
  ContractSummary,
  
  // Violations
  ContractViolation,
  
  // Creation form
  ContractCreationForm,
  
  // Templates
  ContractTemplate,
} from './agent-contract.types';

// ============================================================================
// Constant Exports
// ============================================================================

export {
  // Metadata constants
  CONTRACT_STATUS_META,
  ACTION_TYPE_META,
  DECISION_TYPE_META,
  VIOLATION_RESPONSE_META,
  
  // Default configurations
  DEFAULT_PERMISSIONS,
  DEFAULT_DECISION_BOUNDARIES,
  DEFAULT_DATA_ACCESS,
  DEFAULT_INTERACTION_RULES,
  DEFAULT_LEARNING_CONSTRAINTS,
  DEFAULT_ENFORCEMENT,
  
  // Design colors
  CONTRACT_COLORS,
} from './agent-contract.types';

// ============================================================================
// Component Exports
// ============================================================================

export {
  // Main list view
  AgentContracts,
  
  // Card component for list items
  ContractCard,
  
  // Detailed contract viewer
  ContractView,
  
  // Contract creation modal/flow
  ContractCreation,
} from './AgentContract';

// ============================================================================
// Hook Exports
// ============================================================================

export {
  // List and filter contracts
  useContracts,
  
  // Single contract operations
  useContract,
  
  // Violation history
  useViolations,
  
  // Contract creation flow
  useContractCreation,
  
  // Action validation against contract
  useActionValidator,
  
  // Contract version comparison
  useContractComparison,
  
  // Enforcement monitoring
  useContractEnforcement,
} from './hooks';

// ============================================================================
// Default Export
// ============================================================================

export { AgentContracts as default } from './AgentContract';

// ============================================================================
// Module Documentation
// ============================================================================

/**
 * Agent Contract Module
 * 
 * This module makes agent behavior:
 * - EXPLICIT: Every permission is stated
 * - BOUNDED: Clear limits on actions
 * - ACCOUNTABLE: Violations are tracked
 * - INSPECTABLE: Contracts are human-readable
 * 
 * Contract Lifecycle:
 * 1. DRAFT: Created, not yet active
 * 2. ACTIVE: Approved by human owner, enforced
 * 3. SUSPENDED: Temporarily disabled
 * 4. RETIRED: Permanently ended
 * 
 * Key Rules:
 * - Each agent MUST reference exactly ONE contract
 * - Contracts override prompts if conflict exists
 * - Agents cannot modify their own contracts
 * - All changes require human owner approval
 * - Violations are logged, never hidden
 * 
 * Integration Points:
 * - Universe View: Contracts visible as agent metadata
 * - Knowledge Threads: Contract scope limits thread access
 * - Decision Crystallizer: Decisions respect contract boundaries
 * - Context Snapshots: Contract state captured in snapshots
 * 
 * Usage Example:
 * ```tsx
 * import { AgentContracts, useContract, useActionValidator } from './agent-contract';
 * 
 * function ContractManager() {
 *   const { contract } = useContract({ contractId: 'xyz', userId: 'user_1' });
 *   const { validateAction } = useActionValidator({ contract });
 *   
 *   const result = validateAction('write_data', 'personal');
 *   if (!result.allowed) {
 *     logger.debug('Blocked:', result.reason);
 *   }
 *   
 *   return <AgentContracts userId="user_1" />;
 * }
 * ```
 */
