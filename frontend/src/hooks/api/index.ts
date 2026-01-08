/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — API HOOKS INDEX
 * ═══════════════════════════════════════════════════════════════════════════
 * Barrel export for all API hooks
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export {
  useDashboardStats,
  useRecentActivity,
  useQuickActions,
  useDashboardData,
  type DashboardStats,
  type RecentActivity,
  type QuickAction,
} from './useDashboardStats';

// ═══════════════════════════════════════════════════════════════════════════
// THREADS
// ═══════════════════════════════════════════════════════════════════════════
export {
  useThreads,
  useThread,
  useThreadEvents,
  useThreadsBySphere,
  useActiveThreads,
  useCreateThread,
  useUpdateThread,
  useArchiveThread,
  useDeleteThread,
  useAddThreadEvent,
  type Thread,
  type ThreadEvent,
  type ThreadStatus,
  type ThreadType,
  type ThreadVisibility,
  type CreateThreadInput,
  type UpdateThreadInput,
  type ThreadFilters,
} from './useThreads';

// ═══════════════════════════════════════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════════════════════════════════════
export {
  useAgents,
  useAgent,
  useHiredAgents,
  useAvailableAgents,
  useSuggestedAgents,
  useAgentsBySphere,
  useAgentsByLevel,
  useHireAgent,
  useFireAgent,
  useAgentCounts,
  type Agent,
  type AgentLevel,
  type AgentStatus,
  type AgentSuggestion,
  type AgentFilters,
  type HireAgentInput,
} from './useAgents';

// ═══════════════════════════════════════════════════════════════════════════
// GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════
export {
  useCheckpoints,
  usePendingCheckpoints,
  useCheckpoint,
  useAuditLog,
  useGovernancePolicies,
  useApproveCheckpoint,
  useRejectCheckpoint,
  useCheckpointCounts,
  useHasCriticalCheckpoints,
  type Checkpoint,
  type CheckpointType,
  type CheckpointStatus,
  type CheckpointPriority,
  type CheckpointOption,
  type AuditLogEntry,
  type GovernancePolicy,
  type PolicyRule,
  type CheckpointFilters,
} from './useGovernance';

// ═══════════════════════════════════════════════════════════════════════════
// SPHERES
// ═══════════════════════════════════════════════════════════════════════════
export {
  useSpheres,
  useSphere,
  useSphereStats,
  useSphereThreads,
  useActiveSpheres,
  getSphereIcon,
  getSphereColor,
  getSphereGradient,
  SPHERE_METADATA,
  type Sphere,
  type SphereId,
  type SphereStats,
  type SphereThread,
} from './useSpheres';

// ═══════════════════════════════════════════════════════════════════════════
// NOVA
// ═══════════════════════════════════════════════════════════════════════════
export {
  useNovaStatus,
  useNovaHistory,
  useNovaSuggestions,
  useNovaQuery,
  useNovaAnalysis,
  useNovaAvailable,
  useNovaTokenUsage,
  NOVA_LANES,
  type NovaSystemStatus,
  type NovaLane,
  type NovaStatus,
  type NovaLaneStatus,
  type NovaQuery,
  type NovaQueryResponse,
  type NovaSuggestion,
  type NovaHistoryEntry,
  type NovaAnalysis,
} from './useNova';

// ═══════════════════════════════════════════════════════════════════════════
// XR
// ═══════════════════════════════════════════════════════════════════════════
export {
  useXREnvironments,
  useXRTemplates,
  useXREnvironment,
  useXRPreview,
  useGenerateXR,
  CANONICAL_ZONES,
  XR_TEMPLATE_META,
  type XREnvironment,
  type XRZone,
  type XRTemplate,
  type XRTemplateId,
  type CanonicalZone,
  type GenerateXRInput,
  type XRPreview,
} from './useXR';

// ═══════════════════════════════════════════════════════════════════════════
// AUTH (Keep existing)
// ═══════════════════════════════════════════════════════════════════════════
export * from './useAuth';

// ═══════════════════════════════════════════════════════════════════════════
// DECISIONS
// ═══════════════════════════════════════════════════════════════════════════
export {
  useDecisions,
  useDecision,
  usePendingDecisions,
  useBlinkDecisions,
  useResolveDecision,
  useDeferDecision,
  useDecisionCounts,
  AGING_CONFIG,
  type DecisionPoint,
  type DecisionOption,
  type AISuggestion,
  type AgingLevel,
  type DecisionStatus,
  type DecisionPriority,
  type DecisionFilters,
} from './useDecisions';
