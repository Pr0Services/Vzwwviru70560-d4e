import apiClient, { ApiResponse } from './api.client';
import { API_ENDPOINTS, CHENU_ARCHITECTURE } from '../config/api.config';

// Types
export interface Sphere { id: string; code: string; name_fr: string; name_en: string; icon: string; order: number; }
export interface BureauSection { id: string; key: string; name_fr: string; name_en: string; order: number; }
export interface Thread { id: string; title: string; thread_type: string; status: string; created_at: string; }
export interface Agent { id: string; name: string; level: string; type: string; is_system: boolean; hireable: boolean; }
export interface NovaStatus { name: string; level: string; type: string; status: string; hireable: boolean; description: string; }
export interface GovernanceLaw { id: string; name: string; description: string; }

// Spheres Service (9 - FROZEN)
class SpheresService {
  async list(): Promise<ApiResponse<Sphere[]>> { return apiClient.get<Sphere[]>(API_ENDPOINTS.SPHERES.LIST); }
  async get(id: string): Promise<ApiResponse<Sphere>> { return apiClient.get<Sphere>(API_ENDPOINTS.SPHERES.GET(id)); }
  getLocalSpheres(): Sphere[] { return CHENU_ARCHITECTURE.SPHERES.map(s => ({ id: s.id, code: s.code, name_fr: s.name, name_en: s.name, icon: s.icon, order: s.order })); }
}

// Bureau Service (6 - FROZEN)
class BureauService {
  async listSections(): Promise<ApiResponse<BureauSection[]>> { return apiClient.get<BureauSection[]>(API_ENDPOINTS.BUREAU.SECTIONS); }
  getLocalSections(): BureauSection[] { return CHENU_ARCHITECTURE.BUREAU_SECTIONS.map(s => ({ id: s.id, key: s.key, name_fr: s.name, name_en: s.name, order: s.order })); }
}

// Threads Service
class ThreadsService {
  async list(params?: { sphere_id?: string }): Promise<ApiResponse<{ threads: Thread[]; total: number }>> { return apiClient.get(API_ENDPOINTS.THREADS.LIST, { params }); }
  async create(data: { title: string; thread_type?: string }): Promise<ApiResponse<Thread>> { return apiClient.post<Thread>(API_ENDPOINTS.THREADS.CREATE, data); }
  async sendMessage(threadId: string, content: string): Promise<ApiResponse<{ message_id: string }>> { return apiClient.post(API_ENDPOINTS.THREADS.MESSAGES(threadId), { content }); }
}

// Agents Service
class AgentsService {
  async list(): Promise<ApiResponse<{ agents: Agent[]; total: number }>> { return apiClient.get(API_ENDPOINTS.AGENTS.LIST); }
  async hire(agentId: string): Promise<ApiResponse<{ status: string }>> {
    if (agentId === 'nova') return { success: false, error: { code: 403, message: 'Nova (L0) is NEVER hireable' } };
    return apiClient.post(API_ENDPOINTS.AGENTS.HIRE(agentId));
  }
}

// Nova Service (L0 - NEVER hireable)
class NovaService {
  async getStatus(): Promise<ApiResponse<NovaStatus>> { return apiClient.get<NovaStatus>(API_ENDPOINTS.NOVA.STATUS); }
  async ask(question: string, sphereId?: string): Promise<ApiResponse<{ response: string }>> { return apiClient.post(API_ENDPOINTS.NOVA.ASK, { question, sphere_id: sphereId }); }
  getInfo(): NovaStatus { return { name: 'Nova', level: 'L0', type: 'System Intelligence', status: 'active', hireable: false, description: 'Nova is SYSTEM intelligence. NEVER hireable.' }; }
}

// Governance Service
class GovernanceService {
  async getLaws(): Promise<ApiResponse<{ laws: GovernanceLaw[]; total: number }>> { return apiClient.get(API_ENDPOINTS.GOVERNANCE.LAWS); }
  async validateAction(action: { action_type: string; resource_type: string; resource_id: string }): Promise<ApiResponse<{ valid: boolean }>> { return apiClient.post(API_ENDPOINTS.GOVERNANCE.VALIDATE, action); }
  getLocalLaws(): string[] { return CHENU_ARCHITECTURE.GOVERNANCE_LAWS; }
}

export const spheresService = new SpheresService();
export const bureauService = new BureauService();
export const threadsService = new ThreadsService();
export const agentsService = new AgentsService();
export const novaService = new NovaService();
export const governanceService = new GovernanceService();

export default { spheres: spheresService, bureau: bureauService, threads: threadsService, agents: agentsService, nova: novaService, governance: governanceService };
