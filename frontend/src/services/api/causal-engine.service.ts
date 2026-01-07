/**
 * ============================================================================
 * CHE·NU™ V70 — CAUSAL ENGINE SERVICE
 * ============================================================================
 * Causal inference service connecting to Backend V69 /causal endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - DAG validation required before inference
 * - NO DISCRIMINATORY CAUSATION (race, gender, age patterns blocked)
 * - All causal claims require governance validation
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  CreateDAGRequest,
  DAGResponse,
  AddNodeRequest,
  AddEdgeRequest,
  CausalInferenceRequest,
  CausalInferenceResponse,
  CausalNode,
  CausalEdge,
} from '../../types/api.types';

// Blocked causal patterns (CANON: NO DISCRIMINATORY CAUSATION)
const BLOCKED_PATTERNS = [
  'race', 'gender', 'age', 'ethnicity', 'religion', 'nationality',
  'sexual_orientation', 'disability', 'genetic_information'
];

class CausalEngineService {
  /**
   * Create a new causal DAG
   */
  async createDAG(request: CreateDAGRequest): Promise<DAGResponse> {
    return httpClient.post<DAGResponse>(
      API_ENDPOINTS.CAUSAL.CREATE_DAG,
      request
    );
  }

  /**
   * Get DAG by ID
   */
  async getDAG(dagId: string): Promise<DAGResponse> {
    return httpClient.get<DAGResponse>(
      API_ENDPOINTS.CAUSAL.GET_DAG(dagId)
    );
  }

  /**
   * Add node to DAG
   */
  async addNode(dagId: string, request: AddNodeRequest): Promise<CausalNode> {
    // Check for blocked patterns
    this.validateNotDiscriminatory(request.name);
    
    return httpClient.post<CausalNode>(
      API_ENDPOINTS.CAUSAL.ADD_NODE(dagId),
      request
    );
  }

  /**
   * Add edge to DAG
   */
  async addEdge(dagId: string, request: AddEdgeRequest): Promise<CausalEdge> {
    return httpClient.post<CausalEdge>(
      API_ENDPOINTS.CAUSAL.ADD_EDGE(dagId),
      request
    );
  }

  /**
   * Run causal inference
   * NOTE: May return HTTP 423 if checkpoint required (GOVERNANCE)
   */
  async runInference(request: CausalInferenceRequest): Promise<CausalInferenceResponse> {
    return httpClient.post<CausalInferenceResponse>(
      API_ENDPOINTS.CAUSAL.INFERENCE,
      request
    );
  }

  /**
   * Validate DAG structure
   */
  async validateDAG(dagId: string): Promise<{ valid: boolean; errors: string[] }> {
    const dag = await this.getDAG(dagId);
    return {
      valid: dag.validated,
      errors: dag.validation_errors || [],
    };
  }

  /**
   * Check for cycles in DAG
   */
  hasCycles(nodes: CausalNode[], edges: CausalEdge[]): boolean {
    const adjacency = new Map<string, string[]>();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    // Build adjacency list
    nodes.forEach(node => adjacency.set(node.node_id, []));
    edges.forEach(edge => {
      const sources = adjacency.get(edge.source_id) || [];
      sources.push(edge.target_id);
      adjacency.set(edge.source_id, sources);
    });

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjacency.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.node_id)) {
        if (dfs(node.node_id)) return true;
      }
    }

    return false;
  }

  /**
   * Get causal path between nodes
   */
  findCausalPath(
    nodes: CausalNode[], 
    edges: CausalEdge[], 
    sourceId: string, 
    targetId: string
  ): string[] | null {
    const adjacency = new Map<string, string[]>();
    
    nodes.forEach(node => adjacency.set(node.node_id, []));
    edges.forEach(edge => {
      const sources = adjacency.get(edge.source_id) || [];
      sources.push(edge.target_id);
      adjacency.set(edge.source_id, sources);
    });

    const visited = new Set<string>();
    const queue: { node: string; path: string[] }[] = [{ node: sourceId, path: [sourceId] }];

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      
      if (node === targetId) return path;
      
      if (visited.has(node)) continue;
      visited.add(node);

      const neighbors = adjacency.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null;
  }

  /**
   * Validate not discriminatory (CANON)
   */
  private validateNotDiscriminatory(text: string): void {
    const lowerText = text.toLowerCase();
    for (const pattern of BLOCKED_PATTERNS) {
      if (lowerText.includes(pattern)) {
        throw new Error(
          `GOVERNANCE VIOLATION: Discriminatory causal pattern detected (${pattern}). ` +
          `CHE·NU does not allow causal inference based on protected characteristics.`
        );
      }
    }
  }

  /**
   * Check if causal claim is discriminatory
   */
  isDiscriminatory(nodeName: string): boolean {
    const lowerName = nodeName.toLowerCase();
    return BLOCKED_PATTERNS.some(pattern => lowerName.includes(pattern));
  }
}

export const causalEngineService = new CausalEngineService();
export default causalEngineService;
