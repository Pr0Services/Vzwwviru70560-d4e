/**
 * ============================================================================
 * CHE·NU™ V70 — XR PACKS SERVICE
 * ============================================================================
 * XR visualization service connecting to Backend V69 /xr-packs endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - XR = READ ONLY (never execution)
 * - All XR manifests must have read_only: true
 * - XR is for comprehension, not action
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  GenerateXRPackRequest,
  XRPackResponse,
  XRManifest,
  XRPackStatus,
  XRVisualizationType,
} from '../../types/api.types';

class XRPacksService {
  /**
   * Generate a new XR pack
   * CANON: XR is for visualization only
   */
  async generate(request: GenerateXRPackRequest): Promise<XRPackResponse> {
    const response = await httpClient.post<XRPackResponse>(
      API_ENDPOINTS.XR.GENERATE,
      request
    );

    // CANON: Verify read_only flag
    if (!response.read_only) {
      console.warn('XR Pack generated without read_only flag - this violates CANON');
    }

    return response;
  }

  /**
   * Get XR pack by ID
   */
  async get(packId: string): Promise<XRPackResponse> {
    return httpClient.get<XRPackResponse>(
      API_ENDPOINTS.XR.GET(packId)
    );
  }

  /**
   * Get XR pack manifest
   */
  async getManifest(packId: string): Promise<XRManifest> {
    return httpClient.get<XRManifest>(
      API_ENDPOINTS.XR.MANIFEST(packId)
    );
  }

  /**
   * Get XR pack chunk
   */
  async getChunk(packId: string, chunkId: string): Promise<ArrayBuffer> {
    const response = await fetch(
      `${API_ENDPOINTS.XR.CHUNKS(packId, chunkId)}`,
      { method: 'GET' }
    );
    return response.arrayBuffer();
  }

  /**
   * Download complete XR pack
   */
  async download(packId: string): Promise<Blob> {
    const response = await fetch(
      API_ENDPOINTS.XR.DOWNLOAD(packId),
      { method: 'GET' }
    );
    return response.blob();
  }

  /**
   * Wait for XR pack to be ready
   */
  async waitForReady(
    packId: string,
    pollInterval: number = 1000,
    maxWait: number = 60000
  ): Promise<XRPackResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const pack = await this.get(packId);

      if (pack.status === 'ready') {
        return pack;
      }

      if (pack.status === 'failed') {
        throw new Error(`XR Pack generation failed: ${packId}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`XR Pack generation timed out: ${packId}`);
  }

  /**
   * Check if pack is ready
   */
  isReady(status: XRPackStatus): boolean {
    return status === 'ready';
  }

  /**
   * Get visualization type label
   */
  getVisualizationLabel(type: XRVisualizationType): string {
    const labels: Record<XRVisualizationType, string> = {
      timeline: 'Timeline View',
      causal_graph: 'Causal Graph',
      state_evolution: 'State Evolution',
      comparison: 'Scenario Comparison',
    };
    return labels[type];
  }

  /**
   * Validate XR pack (CANON: must be read_only)
   */
  validateCanon(pack: XRPackResponse): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!pack.read_only) {
      violations.push('XR Pack must be read_only (CANON: XR = READ ONLY)');
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}

export const xrPacksService = new XRPacksService();
export default xrPacksService;
