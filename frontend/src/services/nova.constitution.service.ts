/**
 * ============================================================================
 * CHE·NU™ V70 — NOVA CONSTITUTION SERVICE (PRODUCTION)
 * ============================================================================
 * Nova service with full API integration to Backend V69
 * Replaces the stub version from V68.6
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

import { simulationsService } from './api/simulations.service';
import { checkpointsService } from './api/checkpoints.service';
import { webSocketService } from './api/websocket.service';
import type {
  SimulationResponse,
  CheckpointResponse,
  SimulationTickPayload,
  CheckpointPendingPayload,
} from '../types/api.types';

// ============================================================================
// TYPES
// ============================================================================

export type NovaMode = 
  | 'thinking' 
  | 'analyzing' 
  | 'encoding' 
  | 'executing' 
  | 'waiting' 
  | 'conversation'
  | 'checkpoint';

export interface Suggestion {
  id: string;
  text: string;
  action?: string;
}

export interface NovaRequest {
  message: string;
  context?: Record<string, unknown>;
  modeHint?: NovaMode;
  includeSuggestions?: boolean;
}

export interface NovaResponse {
  message: string;
  encoding?: string;
  checkpoint?: CheckpointResponse;
  responseId?: string;
  detectedMode?: NovaMode;
  suggestions?: Suggestion[];
  simulation?: SimulationResponse;
}

export interface NovaStatus {
  online: boolean;
  mode: NovaMode;
  health: number;
  activeSessions: number;
  version: string;
  pendingCheckpoints: number;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

export interface NovaEventHandlers {
  onModeChange?: (mode: NovaMode) => void;
  onCheckpointPending?: (checkpoint: CheckpointResponse) => void;
  onSimulationTick?: (tick: SimulationTickPayload) => void;
  onSimulationComplete?: (simulation: SimulationResponse) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// NOVA CONSTITUTION SERVICE (PRODUCTION)
// ============================================================================

class NovaConstitutionServiceImpl {
  private currentMode: NovaMode = 'waiting';
  private eventHandlers: NovaEventHandlers = {};
  private currentSimulationId: string | null = null;

  /**
   * Initialize Nova with event handlers
   */
  init(handlers: NovaEventHandlers): void {
    this.eventHandlers = handlers;
  }

  /**
   * Get Nova status
   */
  async getStatus(): Promise<NovaStatus> {
    try {
      const pendingCheckpoints = await checkpointsService.getPending();
      
      return {
        online: true,
        mode: this.currentMode,
        health: 100,
        activeSessions: this.currentSimulationId ? 1 : 0,
        version: '2.0',
        pendingCheckpoints: pendingCheckpoints.items.length,
      };
    } catch (error) {
      return {
        online: false,
        mode: 'waiting',
        health: 0,
        activeSessions: 0,
        version: '2.0',
        pendingCheckpoints: 0,
      };
    }
  }

  /**
   * Main query method - creates and runs simulation
   */
  async query(params: NovaRequest): Promise<NovaResponse> {
    this.setMode('thinking');

    try {
      // Create simulation from query
      const simulation = await simulationsService.create({
        name: `Query: ${params.message.substring(0, 50)}...`,
        description: params.message,
        tags: ['nova-query'],
      });

      this.currentSimulationId = simulation.simulation_id;

      // Connect WebSocket for real-time updates
      this.connectWebSocket(simulation.simulation_id);

      this.setMode('analyzing');

      // Run simulation (may return HTTP 423 for checkpoint)
      try {
        const results = await simulationsService.run(simulation.simulation_id);
        
        this.setMode('waiting');

        return {
          message: `Simulation completed with ${results.length} results`,
          responseId: simulation.simulation_id,
          detectedMode: 'analyzing',
          simulation,
          suggestions: this.generateSuggestions(results),
        };
      } catch (error: any) {
        // Handle checkpoint required (HTTP 423)
        if (error.status === 423) {
          this.setMode('checkpoint');
          
          const checkpoint = error.details as CheckpointResponse;
          this.eventHandlers.onCheckpointPending?.(checkpoint);

          return {
            message: 'Checkpoint required - human approval needed',
            checkpoint,
            responseId: simulation.simulation_id,
            detectedMode: 'checkpoint',
          };
        }
        throw error;
      }
    } catch (error) {
      this.setMode('waiting');
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Approve checkpoint and continue
   */
  async approveCheckpoint(checkpointId: string, reason?: string): Promise<NovaResponse> {
    this.setMode('executing');

    try {
      await checkpointsService.approve(checkpointId, reason);
      
      // Continue simulation if active
      if (this.currentSimulationId) {
        const simulation = await simulationsService.waitForCompletion(this.currentSimulationId);
        
        this.setMode('waiting');

        return {
          message: 'Checkpoint approved - execution continued',
          simulation,
          responseId: this.currentSimulationId,
          detectedMode: 'executing',
        };
      }

      this.setMode('waiting');
      return {
        message: 'Checkpoint approved',
        responseId: checkpointId,
        detectedMode: 'waiting',
      };
    } catch (error) {
      this.setMode('waiting');
      throw error;
    }
  }

  /**
   * Reject checkpoint
   */
  async rejectCheckpoint(checkpointId: string, reason: string): Promise<NovaResponse> {
    await checkpointsService.reject(checkpointId, reason);
    
    this.setMode('waiting');
    this.currentSimulationId = null;

    return {
      message: `Checkpoint rejected: ${reason}`,
      responseId: checkpointId,
      detectedMode: 'waiting',
    };
  }

  /**
   * Get pending checkpoints
   */
  async getPendingCheckpoints(): Promise<CheckpointResponse[]> {
    const response = await checkpointsService.getPending();
    return response.items;
  }

  /**
   * Simple ask method
   */
  async ask(question: string): Promise<string> {
    const response = await this.query({ message: question });
    return response.message;
  }

  /**
   * Get current mode
   */
  getCurrentMode(): NovaMode {
    return this.currentMode;
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    webSocketService.disconnect();
    this.currentSimulationId = null;
    this.setMode('waiting');
  }

  // Private methods

  private setMode(mode: NovaMode): void {
    this.currentMode = mode;
    this.eventHandlers.onModeChange?.(mode);
  }

  private connectWebSocket(simulationId: string): void {
    webSocketService.connect(simulationId);

    webSocketService.onTick((tick) => {
      this.eventHandlers.onSimulationTick?.(tick);
    });

    webSocketService.onCheckpointPending((checkpoint) => {
      this.setMode('checkpoint');
      // Create full checkpoint response
      const fullCheckpoint: CheckpointResponse = {
        checkpoint_id: checkpoint.checkpoint_id,
        type: checkpoint.type,
        category: checkpoint.category,
        status: 'pending',
        description: checkpoint.description,
        context: {
          agent_id: '',
          action_id: '',
          data: {},
          risk_score: 0,
        },
        created_at: new Date().toISOString(),
        timeout_at: checkpoint.timeout_at,
      };
      this.eventHandlers.onCheckpointPending?.(fullCheckpoint);
    });

    webSocketService.onComplete(async () => {
      if (this.currentSimulationId) {
        const simulation = await simulationsService.get(this.currentSimulationId);
        this.eventHandlers.onSimulationComplete?.(simulation);
      }
      this.setMode('waiting');
    });
  }

  private generateSuggestions(results: any[]): Suggestion[] {
    return [
      { id: '1', text: 'View detailed results', action: 'view_results' },
      { id: '2', text: 'Run another scenario', action: 'new_scenario' },
      { id: '3', text: 'Export to XR', action: 'export_xr' },
    ];
  }
}

// Export singleton instance
export const NovaConstitutionService = new NovaConstitutionServiceImpl();
export default NovaConstitutionService;
