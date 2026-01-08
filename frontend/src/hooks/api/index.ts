/**
 * CHE·NU™ V75 — API Hooks Index
 * 
 * Centralized export of all API hooks
 * GOUVERNANCE > EXÉCUTION
 */

// Core Hooks
export * from './useAuth';
export * from './useThreads';
export * from './useDecisions';
export * from './useAgents';
export * from './useSpheres';
export * from './useNova';
export * from './useGovernance';

// Extended Hooks
export * from './useSearch';
export * from './useXR';
export * from './useFileUpload';
export * from './useDashboardStats';

// Phase 8 Hooks - P0 Core
export * from './useIdentity';
export * from './useWorkspaces';
export * from './useDataspaces';
export * from './useMeetings';

// Phase 8 Hooks - P1
export * from './useNotifications';
export * from './useActivity';
export * from './useTokens';

// Re-export types for convenience
export type { Thread, ThreadEvent, CreateThreadRequest } from './useThreads';
export type { Decision, CreateDecisionRequest } from './useDecisions';
export type { Agent, HireAgentRequest } from './useAgents';
export type { Sphere } from './useSpheres';
export type { NovaResponse, NovaIntent } from './useNova';
export type { SearchResult, SearchFilters } from './useSearch';
export type { XREnvironment, XRBlueprint } from './useXR';
export type { Identity, IdentityType } from './useIdentity';
export type { Workspace, WorkspaceMode, Panel } from './useWorkspaces';
export type { Dataspace, DataspaceItem } from './useDataspaces';
export type { Meeting, Participant, MeetingNote } from './useMeetings';
export type { Notification, NotificationType } from './useNotifications';
export type { Activity, ActivityType } from './useActivity';
export type { TokenBalance, TokenTransaction, TokenBudget } from './useTokens';
