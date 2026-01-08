/**
 * CHE·NU™ V75 — useWorkspaces Hook
 * 
 * Workspace Engine API Hook
 * GOUVERNANCE > EXÉCUTION
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  mode: WorkspaceMode;
  layout_type: 'freeform' | 'grid' | 'split' | 'stacked';
  panels: Panel[];
  states: WorkspaceState[];
  transformations: Transformation[];
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export type WorkspaceMode = 
  | 'focus'      // Single task focus
  | 'research'   // Research & exploration
  | 'creation'   // Creative work
  | 'review'     // Review & approval
  | 'planning'   // Planning & strategy
  | 'execution'  // Task execution
  | 'custom';    // User-defined

export interface Panel {
  id: string;
  panel_type: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, unknown>;
  is_visible: boolean;
  z_index: number;
}

export interface WorkspaceState {
  id: string;
  name: string;
  snapshot: Record<string, unknown>;
  created_at: string;
}

export interface Transformation {
  id: string;
  type: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  created_at: string;
  can_undo: boolean;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  mode?: WorkspaceMode;
  layout_type?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  mode?: WorkspaceMode;
  layout_type?: string;
}

export interface CreatePanelRequest {
  panel_type: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...workspaceKeys.lists(), filters] as const,
  modes: () => [...workspaceKeys.all, 'modes'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  panels: (id: string) => [...workspaceKeys.detail(id), 'panels'] as const,
  states: (id: string) => [...workspaceKeys.detail(id), 'states'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all workspaces
 */
export function useWorkspaces(filters?: { mode?: WorkspaceMode }) {
  return useQuery({
    queryKey: workspaceKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.mode) params.append('mode', filters.mode);
      
      const response = await apiClient.get(`/workspaces?${params.toString()}`);
      return response.data as { workspaces: Workspace[]; total: number };
    },
  });
}

/**
 * Fetch workspace modes
 */
export function useWorkspaceModes() {
  return useQuery({
    queryKey: workspaceKeys.modes(),
    queryFn: async () => {
      const response = await apiClient.get('/workspaces/modes');
      return response.data as { modes: { id: string; name: string; description: string; icon: string }[] };
    },
    staleTime: Infinity, // Modes don't change often
  });
}

/**
 * Fetch single workspace
 */
export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces/${workspaceId}`);
      return response.data as Workspace;
    },
    enabled: !!workspaceId,
  });
}

/**
 * Create workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateWorkspaceRequest) => {
      const response = await apiClient.post('/workspaces', data);
      return response.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

/**
 * Update workspace
 */
export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateWorkspaceRequest) => {
      const response = await apiClient.patch(`/workspaces/${workspaceId}`, data);
      return response.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Delete workspace
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      await apiClient.delete(`/workspaces/${workspaceId}`);
      return workspaceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

/**
 * Add panel to workspace
 */
export function useAddPanel(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePanelRequest) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/panels`, data);
      return response.data as Panel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.panels(workspaceId) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Update panel
 */
export function useUpdatePanel(workspaceId: string, panelId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Panel>) => {
      const response = await apiClient.patch(`/workspaces/${workspaceId}/panels/${panelId}`, data);
      return response.data as Panel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Delete panel
 */
export function useDeletePanel(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (panelId: string) => {
      await apiClient.delete(`/workspaces/${workspaceId}/panels/${panelId}`);
      return panelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Save workspace state
 */
export function useSaveWorkspaceState(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/states`, data);
      return response.data as WorkspaceState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.states(workspaceId) });
    },
  });
}

/**
 * Restore workspace state
 */
export function useRestoreWorkspaceState(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stateId: string) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/states/${stateId}/restore`);
      return response.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Transform workspace
 */
export function useTransformWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { transformation_type: string; params?: Record<string, unknown> }) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/transform`, data);
      return response.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Undo transformation
 */
export function useUndoTransformation(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transformationId: string) => {
      const response = await apiClient.post(`/workspaces/${workspaceId}/transformations/${transformationId}/undo`);
      return response.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });
}

/**
 * Detect intent for workspace mode suggestion
 */
export function useDetectWorkspaceIntent() {
  return useMutation({
    mutationFn: async (data: { context: string; current_mode?: string }) => {
      const response = await apiClient.post('/workspaces/detect-intent', data);
      return response.data as { suggested_mode: WorkspaceMode; confidence: number; reasoning: string };
    },
  });
}

export default {
  useWorkspaces,
  useWorkspaceModes,
  useWorkspace,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useAddPanel,
  useUpdatePanel,
  useDeletePanel,
  useSaveWorkspaceState,
  useRestoreWorkspaceState,
  useTransformWorkspace,
  useUndoTransformation,
  useDetectWorkspaceIntent,
};
