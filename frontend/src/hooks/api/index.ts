/**
 * CHE·NU™ — API Hooks Index
 */

// Client & utilities
export {
  apiClient,
  queryClient,
  queryKeys,
  parseAPIError,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  type ParsedAPIError,
} from './client'

// Auth & User
export {
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useUpdateUser,
  useTokenBalance,
  useIsAuthenticated,
  prefetchUser,
} from './useAuth'

// Spheres
export {
  useSpheres,
  useSphere,
  useSphereStats,
  useBureauSections,
  useSphereFromCache,
  useActiveSpheres,
  useSphereColor,
  useSphereIcon,
  prefetchSphere,
  prefetchSpheres,
} from './useSpheres'

// Threads & Messages
export {
  useThreads,
  useInfiniteThreads,
  useThread,
  useCreateThread,
  useUpdateThread,
  useDeleteThread,
  useArchiveThread,
  useMessages,
  useInfiniteMessages,
  useSendMessage,
  useThreadFromCache,
  useInvalidateThreads,
  prefetchThread,
} from './useThreads'

// Agents
export {
  useAgents,
  useAgent,
  useHiredAgents,
  useAgentTasks,
  useHireAgent,
  usePauseAgent,
  useResumeAgent,
  useFireAgent,
  useAgentsByLevel,
  useActiveHiredAgents,
  useIsAgentHired,
  useHiredAgentByAgentId,
  useEstimatedCost,
  prefetchAgents,
} from './useAgents'

// Nova
export {
  useNovaStatus,
  useIsNovaAvailable,
  useNovaQuery,
  useNovaStream,
  useNovaWithContext,
  useNovaSuggestions,
  useNovaHistory,
} from './useNova'

// Governance
export {
  useCheckpoints,
  usePendingCheckpoints,
  useCheckpoint,
  useApproveCheckpoint,
  useRejectCheckpoint,
  useGovernanceStats,
  useHasHighRiskPending,
  useAuditLog,
  useInfiniteAuditLog,
  useCheckpointsByRisk,
  useUrgentCheckpoints,
  useCheckpointExpiration,
  useInvalidateGovernance,
} from './useGovernance'
