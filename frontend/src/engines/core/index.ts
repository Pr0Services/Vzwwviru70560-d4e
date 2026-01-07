/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — CORE ENGINES INDEX                                    ║
 * ║              6 Moteurs Fondamentaux du Système                               ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  1. OrchestratorEngine - Coordination centrale                               ║
 * ║  2. ContextEngine - Gestion des Sphères et Bureaux                          ║
 * ║  3. MemoryEngine - Threads, mémoire, audit trail                            ║
 * ║  4. PermissionEngine - Contrôle d'accès et Tree Laws                        ║
 * ║  5. SearchEngine - Recherche unifiée cross-sphère                           ║
 * ║  6. NotificationEngine - Notifications gouvernées                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { OrchestratorEngine } from './OrchestratorEngine';
export type {
  RequestPriority,
  RequestStatus,
  EngineType,
  OrchestratorRequest,
  RoutingDecision,
  WorkflowStep,
  Workflow,
  SystemHealth,
} from './OrchestratorEngine';

export { ContextEngine, SPHERE_ORDER, BUREAU_SECTION_ORDER } from './ContextEngine';
export type {
  SphereId,
  Sphere,
  BureauSectionId,
  BureauSection,
  Bureau,
  ContextState,
} from './ContextEngine';

export { MemoryEngine } from './MemoryEngine';
export type {
  ChenuThread,
  ThreadEntry,
  VersionEntry,
  AuditEntry,
  HashChainEntry,
  EncodingRule,
  MemoryStore,
  MemoryQuery,
} from './MemoryEngine';

export { PermissionEngine, TREE_LAWS } from './PermissionEngine';
export type {
  PermissionAction,
  ResourceType,
  Role,
  Permission,
  PermissionCondition,
  RoleDefinition,
  UserPermissions,
  TreeLaw,
  GovernanceCheckResult,
} from './PermissionEngine';

export { SearchEngine } from './SearchEngine';
export type {
  SearchableType,
  SearchScope,
  SearchQuery,
  SearchFilters,
  SearchOptions,
  SearchResult,
  SearchResponse,
  SearchFacets,
  SearchIndex,
} from './SearchEngine';

export { NotificationEngine } from './NotificationEngine';
export type {
  NotificationType,
  NotificationPriority,
  DeliveryChannel,
  Notification,
  NotificationAction,
  NotificationPreferences,
  NotificationBatch,
} from './NotificationEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

import { OrchestratorEngine } from './OrchestratorEngine';
import { ContextEngine } from './ContextEngine';
import { MemoryEngine } from './MemoryEngine';
import { PermissionEngine } from './PermissionEngine';
import { SearchEngine } from './SearchEngine';
import { NotificationEngine } from './NotificationEngine';

export interface CoreEngineSet {
  orchestrator: OrchestratorEngine;
  context: ContextEngine;
  memory: MemoryEngine;
  permission: PermissionEngine;
  search: SearchEngine;
  notification: NotificationEngine;
}

/**
 * Create a complete set of core engines for a user session
 */
export function createCoreEngines(userId: string, sessionId: string): CoreEngineSet {
  const orchestrator = new OrchestratorEngine();
  const context = new ContextEngine(userId, sessionId);
  const memory = new MemoryEngine();
  const permission = new PermissionEngine();
  const search = new SearchEngine();
  const notification = new NotificationEngine();
  
  // Register user in permission system
  permission.registerUser(userId, 'owner');
  
  return {
    orchestrator,
    context,
    memory,
    permission,
    search,
    notification,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  OrchestratorEngine,
  ContextEngine,
  MemoryEngine,
  PermissionEngine,
  SearchEngine,
  NotificationEngine,
  createCoreEngines,
};
