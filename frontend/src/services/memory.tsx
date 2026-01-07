/**
 * CHE·NU — Memory Service
 */

import api from './api';

export type MemoryType = 'stm' | 'mtm' | 'ltm' | 'semantic';
export type MemoryCategory = 
  | 'preference' 
  | 'fact' 
  | 'context' 
  | 'skill'
  | 'relationship' 
  | 'goal' 
  | 'routine' 
  | 'insight';

export interface Memory {
  id: string;
  user_id: string;
  type: MemoryType;
  category: MemoryCategory;
  content: string;
  sphere_id?: string;
  source?: string;
  confidence: number;
  access_count: number;
  is_active: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
  last_accessed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMemoryRequest {
  type: MemoryType;
  category: MemoryCategory;
  content: string;
  sphere_id?: string;
  source?: string;
  confidence?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface MemoryStats {
  total: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  active: number;
  inactive: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

class MemoryService {
  async list(params?: {
    type?: MemoryType;
    category?: MemoryCategory;
    sphere_id?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Memory>> {
    const queryParams: Record<string, string> = {};
    if (params?.type) queryParams.type = params.type;
    if (params?.category) queryParams.category = params.category;
    if (params?.sphere_id) queryParams.sphere_id = params.sphere_id;
    if (params?.is_active !== undefined) queryParams.is_active = String(params.is_active);
    if (params?.page) queryParams.page = String(params.page);
    if (params?.page_size) queryParams.page_size = String(params.page_size);

    return api.get<PaginatedResponse<Memory>>('/memory', queryParams);
  }

  async get(memoryId: string): Promise<Memory> {
    return api.get<Memory>(`/memory/${memoryId}`);
  }

  async create(data: CreateMemoryRequest): Promise<Memory> {
    return api.post<Memory>('/memory', data);
  }

  async update(memoryId: string, data: Partial<CreateMemoryRequest>): Promise<Memory> {
    return api.patch<Memory>(`/memory/${memoryId}`, data);
  }

  async delete(memoryId: string): Promise<void> {
    await api.delete(`/memory/${memoryId}`);
  }

  async search(query: string, params?: {
    types?: MemoryType[];
    categories?: MemoryCategory[];
    sphere_id?: string;
    limit?: number;
  }): Promise<Memory[]> {
    return api.post<Memory[]>('/memory/search', {
      query,
      ...params,
    });
  }

  async getStats(): Promise<MemoryStats> {
    return api.get<MemoryStats>('/memory/stats');
  }

  async export(params?: {
    types?: MemoryType[];
    categories?: MemoryCategory[];
    format?: 'json' | 'csv';
  }): Promise<Blob> {
    const response = await fetch(`${api['baseUrl']}/memory/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api.getToken()}`,
      },
      body: JSON.stringify(params || {}),
    });
    return response.blob();
  }
}

export const memoryService = new MemoryService();
export default memoryService;
