/**
 * ============================================================================
 * CHE·NU™ V70 — CHECKPOINTS SERVICE (GOVERNANCE)
 * ============================================================================
 * Checkpoint management service - CRITICAL for human-in-the-loop governance
 * Connecting to Backend V69 /checkpoints endpoints
 * 
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - All sensitive actions require checkpoint approval
 * - Category C always requires HITL
 * - No execution without explicit human approval
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  CheckpointResponse,
  ResolveCheckpointRequest,
  CheckpointType,
  CheckpointCategory,
  CheckpointStatus,
  ListResponse,
  PaginationParams,
} from '../../types/api.types';

export interface CheckpointQueryParams extends PaginationParams {
  type?: CheckpointType;
  category?: CheckpointCategory;
  status?: CheckpointStatus;
  agent_id?: string;
  simulation_id?: string;
}

export interface CheckpointEventHandler {
  onPending?: (checkpoint: CheckpointResponse) => void;
  onApproved?: (checkpoint: CheckpointResponse) => void;
  onRejected?: (checkpoint: CheckpointResponse) => void;
  onTimeout?: (checkpoint: CheckpointResponse) => void;
}

class CheckpointsService {
  private eventHandlers: CheckpointEventHandler[] = [];

  /**
   * List all checkpoints
   */
  async list(params?: CheckpointQueryParams): Promise<ListResponse<CheckpointResponse>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return httpClient.get<ListResponse<CheckpointResponse>>(
      `${API_ENDPOINTS.CHECKPOINTS.LIST}${queryString}`
    );
  }

  /**
   * Get pending checkpoints requiring action
   * CRITICAL: These need human attention
   */
  async getPending(): Promise<ListResponse<CheckpointResponse>> {
    return httpClient.get<ListResponse<CheckpointResponse>>(
      API_ENDPOINTS.CHECKPOINTS.PENDING
    );
  }

  /**
   * Get checkpoint by ID
   */
  async get(checkpointId: string): Promise<CheckpointResponse> {
    return httpClient.get<CheckpointResponse>(
      API_ENDPOINTS.CHECKPOINTS.GET(checkpointId)
    );
  }

  /**
   * Approve a checkpoint
   * GOVERNANCE: Explicit human approval
   */
  async approve(checkpointId: string, reason?: string, resolvedBy?: string): Promise<CheckpointResponse> {
    return this.resolve(checkpointId, {
      resolution: 'approve',
      reason,
      resolved_by: resolvedBy || 'current_user',
    });
  }

  /**
   * Reject a checkpoint
   * GOVERNANCE: Explicit human rejection
   */
  async reject(checkpointId: string, reason: string, resolvedBy?: string): Promise<CheckpointResponse> {
    return this.resolve(checkpointId, {
      resolution: 'reject',
      reason,
      resolved_by: resolvedBy || 'current_user',
    });
  }

  /**
   * Escalate a checkpoint
   * GOVERNANCE: Requires higher authority
   */
  async escalate(checkpointId: string, reason: string, resolvedBy?: string): Promise<CheckpointResponse> {
    return this.resolve(checkpointId, {
      resolution: 'escalate',
      reason,
      resolved_by: resolvedBy || 'current_user',
    });
  }

  /**
   * Resolve a checkpoint
   */
  async resolve(
    checkpointId: string, 
    request: ResolveCheckpointRequest
  ): Promise<CheckpointResponse> {
    const response = await httpClient.post<CheckpointResponse>(
      API_ENDPOINTS.CHECKPOINTS.RESOLVE(checkpointId),
      request
    );

    // Notify handlers
    if (request.resolution === 'approve') {
      this.eventHandlers.forEach(h => h.onApproved?.(response));
    } else if (request.resolution === 'reject') {
      this.eventHandlers.forEach(h => h.onRejected?.(response));
    }

    return response;
  }

  /**
   * Get checkpoints by category
   * Category C = HITL OBLIGATOIRE
   */
  async getByCategory(category: CheckpointCategory): Promise<ListResponse<CheckpointResponse>> {
    return this.list({ category });
  }

  /**
   * Get checkpoints by type
   */
  async getByType(type: CheckpointType): Promise<ListResponse<CheckpointResponse>> {
    return this.list({ type });
  }

  /**
   * Get checkpoints for agent
   */
  async getForAgent(agentId: string): Promise<ListResponse<CheckpointResponse>> {
    return this.list({ agent_id: agentId });
  }

  /**
   * Get checkpoints for simulation
   */
  async getForSimulation(simulationId: string): Promise<ListResponse<CheckpointResponse>> {
    return this.list({ simulation_id: simulationId });
  }

  /**
   * Check if checkpoint is expired
   */
  isExpired(checkpoint: CheckpointResponse): boolean {
    if (!checkpoint.timeout_at) return false;
    return new Date(checkpoint.timeout_at) < new Date();
  }

  /**
   * Get time remaining before timeout
   */
  getTimeRemaining(checkpoint: CheckpointResponse): number | null {
    if (!checkpoint.timeout_at) return null;
    return new Date(checkpoint.timeout_at).getTime() - Date.now();
  }

  /**
   * Subscribe to checkpoint events
   */
  subscribe(handlers: CheckpointEventHandler): () => void {
    this.eventHandlers.push(handlers);
    return () => {
      const index = this.eventHandlers.indexOf(handlers);
      if (index > -1) {
        this.eventHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Notify pending checkpoint
   */
  notifyPending(checkpoint: CheckpointResponse): void {
    this.eventHandlers.forEach(h => h.onPending?.(checkpoint));
  }

  /**
   * Poll for pending checkpoints
   */
  async startPolling(
    intervalMs: number = 5000,
    onPending?: (checkpoints: CheckpointResponse[]) => void
  ): Promise<() => void> {
    let running = true;
    
    const poll = async () => {
      while (running) {
        try {
          const { items } = await this.getPending();
          if (items.length > 0 && onPending) {
            onPending(items);
          }
        } catch (error) {
          console.error('Checkpoint polling error:', error);
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    };

    poll();

    return () => { running = false; };
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const entries = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
    
    return entries.length > 0 ? `?${entries.join('&')}` : '';
  }
}

export const checkpointsService = new CheckpointsService();
export default checkpointsService;
