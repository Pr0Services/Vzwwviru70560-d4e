/**
 * ============================================================================
 * CHE·NU™ V70 — SCENARIOS SERVICE
 * ============================================================================
 * Scenario management service connecting to Backend V69 /scenarios endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - All scenarios are SYNTHETIC (synthetic: true)
 * - Interventions require governance validation
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  CreateScenarioRequest,
  ScenarioResponse,
  CompareScenarioRequest,
  ComparisonResponse,
  Intervention,
} from '../../types/api.types';

class ScenariosService {
  /**
   * Create a new scenario
   */
  async create(request: CreateScenarioRequest): Promise<ScenarioResponse> {
    return httpClient.post<ScenarioResponse>(
      API_ENDPOINTS.SCENARIOS.CREATE,
      request
    );
  }

  /**
   * Get scenario by ID
   */
  async get(scenarioId: string): Promise<ScenarioResponse> {
    return httpClient.get<ScenarioResponse>(
      API_ENDPOINTS.SCENARIOS.GET(scenarioId)
    );
  }

  /**
   * Compare multiple scenarios
   */
  async compare(request: CompareScenarioRequest): Promise<ComparisonResponse> {
    return httpClient.post<ComparisonResponse>(
      API_ENDPOINTS.SCENARIOS.COMPARE,
      request
    );
  }

  /**
   * Create scenario with interventions
   */
  async createWithInterventions(
    simulationId: string,
    name: string,
    interventions: Intervention[],
    initialState?: Record<string, unknown>
  ): Promise<ScenarioResponse> {
    return this.create({
      simulation_id: simulationId,
      name,
      interventions,
      initial_state: initialState,
    });
  }

  /**
   * Create baseline scenario (no interventions)
   */
  async createBaseline(
    simulationId: string,
    name: string = 'Baseline',
    initialState?: Record<string, unknown>
  ): Promise<ScenarioResponse> {
    return this.create({
      simulation_id: simulationId,
      name,
      interventions: [],
      initial_state: initialState,
    });
  }

  /**
   * Create counterfactual scenario
   */
  async createCounterfactual(
    simulationId: string,
    baselineId: string,
    intervention: Intervention,
    name?: string
  ): Promise<ScenarioResponse> {
    const baseline = await this.get(baselineId);
    
    return this.create({
      simulation_id: simulationId,
      name: name || `Counterfactual: ${intervention.node_id}`,
      interventions: [intervention],
      initial_state: baseline.initial_state,
    });
  }

  /**
   * Compare with baseline
   */
  async compareWithBaseline(
    baselineId: string,
    scenarioIds: string[],
    metrics: string[]
  ): Promise<ComparisonResponse> {
    return this.compare({
      scenario_ids: [baselineId, ...scenarioIds],
      metrics,
    });
  }

  /**
   * Validate intervention
   */
  validateIntervention(intervention: Intervention): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (intervention.tick < 0) {
      errors.push('Intervention tick must be non-negative');
    }

    if (!intervention.node_id) {
      errors.push('Intervention must specify a node_id');
    }

    if (!['set', 'increment', 'multiply'].includes(intervention.type)) {
      errors.push('Invalid intervention type');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create intervention helper
   */
  createIntervention(
    tick: number,
    nodeId: string,
    value: unknown,
    type: 'set' | 'increment' | 'multiply' = 'set'
  ): Intervention {
    return { tick, node_id: nodeId, value, type };
  }
}

export const scenariosService = new ScenariosService();
export default scenariosService;
