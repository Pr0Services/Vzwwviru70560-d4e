/**
 * ============================================================================
 * CHE·NU™ V70 — HEALTH SERVICE
 * ============================================================================
 * Health check service connecting to Backend V69 health endpoints
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type { HealthStatus } from '../../types/api.types';

class HealthService {
  /**
   * Get full health status
   */
  async getStatus(): Promise<HealthStatus> {
    return httpClient.get<HealthStatus>(API_ENDPOINTS.HEALTH);
  }

  /**
   * Check if API is ready
   */
  async isReady(): Promise<boolean> {
    try {
      const response = await httpClient.get<{ ready: boolean }>(API_ENDPOINTS.READY);
      return response.ready;
    } catch {
      return false;
    }
  }

  /**
   * Check if API is alive
   */
  async isAlive(): Promise<boolean> {
    try {
      const response = await httpClient.get<{ alive: boolean }>(API_ENDPOINTS.LIVE);
      return response.alive;
    } catch {
      return false;
    }
  }

  /**
   * Get component health
   */
  async getComponentHealth(component: string): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    const status = await this.getStatus();
    return status.components[component] || 'unhealthy';
  }

  /**
   * Check all components
   */
  async checkAll(): Promise<{ 
    healthy: boolean; 
    components: Record<string, 'healthy' | 'degraded' | 'unhealthy'> 
  }> {
    const status = await this.getStatus();
    const healthy = Object.values(status.components).every(c => c === 'healthy');
    return { healthy, components: status.components };
  }
}

export const healthService = new HealthService();
export default healthService;
