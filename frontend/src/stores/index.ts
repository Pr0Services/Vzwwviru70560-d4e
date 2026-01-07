/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — STORES INDEX                                ║
 * ║                    Canonical Store Exports                                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURE STORES:
 * - 9 Stores Canoniques (core functionality)
 * - 4 Stores Engine (domain engines)
 * - 1 Store Auth (authentication, separate from identity)
 * 
 * TOTAL: 14 stores
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL STORES (9)
// ═══════════════════════════════════════════════════════════════════════════════

/** Identity management - Multi-identity support */
export * from './identity.store';

/** Governance - Checkpoints, Audit, Constitution compliance */
export * from './governance.store';

/** Agents - Hired agents, execution, lifecycle */
export * from './agent.store';

/** Tokens - Budget, allocation, governance energy */
export * from './token.store';

/** Nova - System intelligence, pipeline orchestration */
export * from './nova.store';

/** Threads - Conversations, .chenu files */
export * from './thread.store';

/** Dataspace - Context, files, data management */
export * from './dataspace.store';

/** Memory - Proposals, lifecycle, knowledge */
export * from './memory.store';

/** UI - Navigation, sphère active, theme, modals, toasts */
export * from './ui.store';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STORE (separate from identity for authentication)
// ═══════════════════════════════════════════════════════════════════════════════

/** Authentication - Login, session, tokens */
export * from './auth.store';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE STORES (4)
// ═══════════════════════════════════════════════════════════════════════════════

/** OCW Engine - Orchestrated Collaborative Workspace */
export * from './ocwEngineStore';

/** Meeting Engine - Virtual meeting rooms */
export * from './meetingEngineStore';

/** OneClick Engine - Quick execution */
export * from './oneClickEngineStore';

/** Immobilier Engine - Real estate domain */
export * from './immobilierEngineStore';

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE RE-EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Re-export main hooks for convenience
export { useUIStore, useToast, useNavigation } from './ui.store';
export { useGovernanceStore } from './governance.store';
export { useAgentStore } from './agent.store';
export { useThreadStore } from './thread.store';
export { useNovaStore } from './nova.store';
export { useTokenStore } from './token.store';
export { useMemoryStore } from './memory.store';
export { useIdentityStore } from './identity.store';
export { useDataspaceStore } from './dataspace.store';
export { useAuthStore } from './auth.store';
