/**
 * CHE·NU™ V75 — useDataspaces Hook
 * 
 * Dataspace Management API Hook
 * GOUVERNANCE > EXÉCUTION
 * 
 * Dataspace = Organized data container within a Thread
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Dataspace {
  id: string;
  thread_id: string;
  name: string;
  description?: string;
  dataspace_type: DataspaceType;
  status: 'active' | 'archived' | 'locked';
  schema: DataspaceSchema;
  items_count: number;
  storage_used: number;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type DataspaceType = 
  | 'documents'    // Files, PDFs, docs
  | 'media'        // Images, videos, audio
  | 'data'         // Structured data, tables
  | 'code'         // Code snippets, repos
  | 'links'        // URLs, bookmarks
  | 'notes'        // Quick notes
  | 'mixed';       // Multiple types

export interface DataspaceSchema {
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'reference';
    required: boolean;
    default?: unknown;
  }>;
  indexes: string[];
}

export interface DataspaceItem {
  id: string;
  dataspace_id: string;
  item_type: string;
  title: string;
  content?: string;
  file_url?: string;
  metadata: Record<string, unknown>;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDataspaceRequest {
  thread_id: string;
  name: string;
  description?: string;
  dataspace_type?: DataspaceType;
  schema?: Partial<DataspaceSchema>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const dataspaceKeys = {
  all: ['dataspaces'] as const,
  lists: () => [...dataspaceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...dataspaceKeys.lists(), filters] as const,
  byThread: (threadId: string) => [...dataspaceKeys.all, 'thread', threadId] as const,
  details: () => [...dataspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataspaceKeys.details(), id] as const,
  items: (id: string) => [...dataspaceKeys.detail(id), 'items'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all dataspaces
 */
export function useDataspaces(filters?: { thread_id?: string; type?: DataspaceType; status?: string }) {
  return useQuery({
    queryKey: dataspaceKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.thread_id) params.append('thread_id', filters.thread_id);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await apiClient.get(`/dataspaces?${params.toString()}`);
      return response.data as { dataspaces: Dataspace[]; total: number };
    },
  });
}

/**
 * Fetch dataspaces for a specific thread
 */
export function useThreadDataspaces(threadId: string) {
  return useQuery({
    queryKey: dataspaceKeys.byThread(threadId),
    queryFn: async () => {
      const response = await apiClient.get(`/dataspaces?thread_id=${threadId}`);
      return response.data as { dataspaces: Dataspace[]; total: number };
    },
    enabled: !!threadId,
  });
}

/**
 * Fetch single dataspace
 */
export function useDataspace(dataspaceId: string) {
  return useQuery({
    queryKey: dataspaceKeys.detail(dataspaceId),
    queryFn: async () => {
      const response = await apiClient.get(`/dataspaces/${dataspaceId}`);
      return response.data as Dataspace;
    },
    enabled: !!dataspaceId,
  });
}

/**
 * Create dataspace
 */
export function useCreateDataspace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDataspaceRequest) => {
      const response = await apiClient.post('/dataspaces', data);
      return response.data as Dataspace;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dataspaceKeys.all });
      if (data.thread_id) {
        queryClient.invalidateQueries({ queryKey: dataspaceKeys.byThread(data.thread_id) });
      }
    },
  });
}

/**
 * Update dataspace
 */
export function useUpdateDataspace(dataspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Dataspace>) => {
      const response = await apiClient.patch(`/dataspaces/${dataspaceId}`, data);
      return response.data as Dataspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataspaceKeys.detail(dataspaceId) });
    },
  });
}

/**
 * Delete dataspace
 */
export function useDeleteDataspace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dataspaceId: string) => {
      await apiClient.delete(`/dataspaces/${dataspaceId}`);
      return dataspaceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataspaceKeys.all });
    },
  });
}

/**
 * Fetch items in dataspace
 */
export function useDataspaceItems(dataspaceId: string, filters?: { type?: string; tag?: string }) {
  return useQuery({
    queryKey: [...dataspaceKeys.items(dataspaceId), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.tag) params.append('tag', filters.tag);
      
      const response = await apiClient.get(`/dataspaces/${dataspaceId}/items?${params.toString()}`);
      return response.data as { items: DataspaceItem[]; total: number };
    },
    enabled: !!dataspaceId,
  });
}

/**
 * Add item to dataspace
 */
export function useAddDataspaceItem(dataspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<DataspaceItem, 'id' | 'dataspace_id' | 'created_by' | 'created_at' | 'updated_at'>) => {
      const response = await apiClient.post(`/dataspaces/${dataspaceId}/items`, data);
      return response.data as DataspaceItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataspaceKeys.items(dataspaceId) });
      queryClient.invalidateQueries({ queryKey: dataspaceKeys.detail(dataspaceId) });
    },
  });
}

export default {
  useDataspaces,
  useThreadDataspaces,
  useDataspace,
  useCreateDataspace,
  useUpdateDataspace,
  useDeleteDataspace,
  useDataspaceItems,
  useAddDataspaceItem,
};
