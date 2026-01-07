/**
 * ============================================================================
 * CHE·NU™ V70 — SIMULATIONS SERVICE (NOVA PIPELINE)
 * ============================================================================
 * Simulation service connecting to Backend V69 /simulations endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  CreateSimulationRequest,
  SimulationResponse,
  RunSimulationRequest,
  SimulationResultResponse,
  ListResponse,
  PaginationParams,
  FilterParams,
} from '../../types/api.types';

export interface SimulationQueryParams extends PaginationParams, FilterParams {
  tags?: string[];
}

class SimulationsService {
  /**
   * Create a new simulation
   */
  async create(request: CreateSimulationRequest): Promise<SimulationResponse> {
    return httpClient.post<SimulationResponse>(
      API_ENDPOINTS.SIMULATIONS.CREATE,
      request
    );
  }

  /**
   * List all simulations
   */
  async list(params?: SimulationQueryParams): Promise<ListResponse<SimulationResponse>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return httpClient.get<ListResponse<SimulationResponse>>(
      `${API_ENDPOINTS.SIMULATIONS.LIST}${queryString}`
    );
  }

  /**
   * Get simulation by ID
   */
  async get(simulationId: string): Promise<SimulationResponse> {
    return httpClient.get<SimulationResponse>(
      API_ENDPOINTS.SIMULATIONS.GET(simulationId)
    );
  }

  /**
   * Run a simulation
   * NOTE: May return HTTP 423 if checkpoint required (GOVERNANCE)
   */
  async run(
    simulationId: string, 
    request?: RunSimulationRequest
  ): Promise<SimulationResultResponse[]> {
    return httpClient.post<SimulationResultResponse[]>(
      API_ENDPOINTS.SIMULATIONS.RUN(simulationId),
      request || { sign_artifacts: true }
    );
  }

  /**
   * Delete a simulation
   */
  async delete(simulationId: string): Promise<void> {
    return httpClient.delete(
      API_ENDPOINTS.SIMULATIONS.DELETE(simulationId)
    );
  }

  /**
   * Get simulation status
   */
  async getStatus(simulationId: string): Promise<SimulationResponse> {
    return this.get(simulationId);
  }

  /**
   * Wait for simulation completion
   */
  async waitForCompletion(
    simulationId: string,
    pollInterval: number = 1000,
    maxWait: number = 300000
  ): Promise<SimulationResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      const simulation = await this.get(simulationId);
      
      if (simulation.status === 'completed' || simulation.status === 'failed') {
        return simulation;
      }
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error(`Simulation ${simulationId} timed out after ${maxWait}ms`);
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const entries = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return v.map(item => `${k}=${encodeURIComponent(String(item))}`).join('&');
        }
        return `${k}=${encodeURIComponent(String(v))}`;
      });
    
    return entries.length > 0 ? `?${entries.join('&')}` : '';
  }
}

export const simulationsService = new SimulationsService();
export default simulationsService;
