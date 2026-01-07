/**
 * ============================================================================
 * CHE·NU™ V70 — API SERVICES INDEX
 * ============================================================================
 * Central export for all API services connecting Frontend V68.6 to Backend V69
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

// Configuration
export * from './config';

// HTTP Client
export * from './http-client';

// Services
export { authService } from './auth.service';
export { simulationsService } from './simulations.service';
export { scenariosService } from './scenarios.service';
export { agentsService } from './agents.service';
export { checkpointsService } from './checkpoints.service';
export { causalEngineService } from './causal-engine.service';
export { xrPacksService } from './xr-packs.service';
export { auditService } from './audit.service';
export { healthService } from './health.service';
export { webSocketService } from './websocket.service';

// Types
export type * from '../../types/api.types';

// Re-export default instances
import { authService } from './auth.service';
import { simulationsService } from './simulations.service';
import { scenariosService } from './scenarios.service';
import { agentsService } from './agents.service';
import { checkpointsService } from './checkpoints.service';
import { causalEngineService } from './causal-engine.service';
import { xrPacksService } from './xr-packs.service';
import { auditService } from './audit.service';
import { healthService } from './health.service';
import { webSocketService } from './websocket.service';

/**
 * API Services object for convenient access
 */
export const api = {
  auth: authService,
  simulations: simulationsService,
  scenarios: scenariosService,
  agents: agentsService,
  checkpoints: checkpointsService,
  causal: causalEngineService,
  xr: xrPacksService,
  audit: auditService,
  health: healthService,
  ws: webSocketService,
} as const;

export default api;
