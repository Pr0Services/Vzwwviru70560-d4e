/**
 * ============================================================================
 * CHE·NU™ V70 — AGENTS SERVICE
 * ============================================================================
 * Agent management service connecting to Backend V69 /agents endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  CreateAgentRequest,
  AgentResponse,
  AgentActionRequest,
  AgentActionResponse,
  AgentHierarchy,
  ListResponse,
  PaginationParams,
  FilterParams,
  AgentType,
  AgentLevel,
  AgentStatus,
} from '../../types/api.types';

export interface AgentQueryParams extends PaginationParams, FilterParams {
  type?: AgentType;
  level?: AgentLevel;
  status?: AgentStatus;
  parent_id?: string;
}

class AgentsService {
  /**
   * Create a new agent
   */
  async create(request: CreateAgentRequest): Promise<AgentResponse> {
    return httpClient.post<AgentResponse>(
      API_ENDPOINTS.AGENTS.CREATE,
      request
    );
  }

  /**
   * List all agents
   */
  async list(params?: AgentQueryParams): Promise<ListResponse<AgentResponse>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return httpClient.get<ListResponse<AgentResponse>>(
      `${API_ENDPOINTS.AGENTS.LIST}${queryString}`
    );
  }

  /**
   * Get agent by ID
   */
  async get(agentId: string): Promise<AgentResponse> {
    return httpClient.get<AgentResponse>(
      API_ENDPOINTS.AGENTS.GET(agentId)
    );
  }

  /**
   * Activate an agent
   */
  async activate(agentId: string): Promise<AgentResponse> {
    return httpClient.post<AgentResponse>(
      API_ENDPOINTS.AGENTS.ACTIVATE(agentId)
    );
  }

  /**
   * Pause an agent
   */
  async pause(agentId: string): Promise<AgentResponse> {
    return httpClient.post<AgentResponse>(
      API_ENDPOINTS.AGENTS.PAUSE(agentId)
    );
  }

  /**
   * Execute an agent action
   * NOTE: May return HTTP 423 if checkpoint required (GOVERNANCE)
   */
  async executeAction(
    agentId: string, 
    request: AgentActionRequest
  ): Promise<AgentActionResponse> {
    return httpClient.post<AgentActionResponse>(
      API_ENDPOINTS.AGENTS.ACTIONS(agentId),
      request
    );
  }

  /**
   * Get agent hierarchy
   */
  async getHierarchy(): Promise<AgentHierarchy> {
    return httpClient.get<AgentHierarchy>(
      API_ENDPOINTS.AGENTS.HIERARCHY
    );
  }

  /**
   * Get agents by level
   */
  async getByLevel(level: AgentLevel): Promise<ListResponse<AgentResponse>> {
    return this.list({ level });
  }

  /**
   * Get agents by type
   */
  async getByType(type: AgentType): Promise<ListResponse<AgentResponse>> {
    return this.list({ type });
  }

  /**
   * Get children of an agent
   */
  async getChildren(parentId: string): Promise<ListResponse<AgentResponse>> {
    return this.list({ parent_id: parentId });
  }

  /**
   * Get active agents
   */
  async getActive(): Promise<ListResponse<AgentResponse>> {
    return this.list({ status: 'active' });
  }

  /**
   * Check if agent can perform action
   */
  async canPerformAction(agentId: string, actionType: string): Promise<boolean> {
    const agent = await this.get(agentId);
    return agent.capabilities.includes(actionType);
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const entries = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
    
    return entries.length > 0 ? `?${entries.join('&')}` : '';
  }
}

export const agentsService = new AgentsService();
export default agentsService;
