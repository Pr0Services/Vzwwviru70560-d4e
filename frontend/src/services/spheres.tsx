/**
 * CHE·NU — Spheres Service
 */

import api from './api';

export type SphereType = 
  | 'personal' 
  | 'enterprise' 
  | 'creative' 
  | 'architecture' 
  | 'social' 
  | 'community' 
  | 'entertainment' 
  | 'ai-labs' 
  | 'design';

export interface SphereModule {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Sphere {
  id: string;
  type: SphereType;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  modules: SphereModule[];
}

export interface UserSphere {
  id: string;
  sphere_id: string;
  sphere: Sphere;
  is_enabled: boolean;
  is_pinned: boolean;
  sort_order: number;
  settings?: Record<string, unknown>;
  last_accessed_at?: string;
}

export interface SphereListResponse {
  spheres: Sphere[];
  user_spheres: UserSphere[];
}

class SpheresService {
  async list(): Promise<SphereListResponse> {
    return api.get<SphereListResponse>('/spheres');
  }

  async getAvailable(): Promise<Sphere[]> {
    return api.get<Sphere[]>('/spheres/available');
  }

  async getMine(): Promise<UserSphere[]> {
    return api.get<UserSphere[]>('/spheres/mine');
  }

  async toggle(sphereId: string, enabled: boolean): Promise<UserSphere> {
    return api.post<UserSphere>(`/spheres/${sphereId}/toggle`, undefined, {
      params: { enabled: String(enabled) },
    } as never);
  }

  async updateSettings(
    sphereId: string,
    settings: {
      is_enabled?: boolean;
      is_pinned?: boolean;
      sort_order?: number;
      settings?: Record<string, unknown>;
    }
  ): Promise<UserSphere> {
    return api.patch<UserSphere>(`/spheres/${sphereId}/settings`, settings);
  }
}

export const spheresService = new SpheresService();
export default spheresService;
