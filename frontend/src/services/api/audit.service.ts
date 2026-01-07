/**
 * ============================================================================
 * CHE·NU™ V70 — AUDIT SERVICE
 * ============================================================================
 * Audit trail service connecting to Backend V69 /audit endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - Every meaningful event produces an immutable trace
 * - All artifacts are signed
 * - Merkle trees ensure integrity
 * ============================================================================
 */

import { httpClient } from './http-client';
import { API_ENDPOINTS } from './config';
import type {
  AuditEventResponse,
  AuditReportResponse,
  VerifyAuditRequest,
  VerifyAuditResponse,
  AuditEventType,
  ListResponse,
  PaginationParams,
} from '../../types/api.types';

export interface AuditQueryParams extends PaginationParams {
  event_type?: AuditEventType;
  entity_type?: string;
  entity_id?: string;
  actor_id?: string;
  actor_type?: 'user' | 'agent' | 'system';
  from_date?: string;
  to_date?: string;
}

class AuditService {
  /**
   * List audit events
   */
  async listEvents(params?: AuditQueryParams): Promise<ListResponse<AuditEventResponse>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return httpClient.get<ListResponse<AuditEventResponse>>(
      `${API_ENDPOINTS.AUDIT.EVENTS}${queryString}`
    );
  }

  /**
   * Get audit report for simulation
   */
  async getSimulationReport(simulationId: string): Promise<AuditReportResponse> {
    return httpClient.get<AuditReportResponse>(
      API_ENDPOINTS.AUDIT.REPORT(simulationId)
    );
  }

  /**
   * Verify audit event or artifact
   */
  async verify(request: VerifyAuditRequest): Promise<VerifyAuditResponse> {
    return httpClient.post<VerifyAuditResponse>(
      API_ENDPOINTS.AUDIT.VERIFY,
      request
    );
  }

  /**
   * Verify event by ID
   */
  async verifyEvent(eventId: string): Promise<VerifyAuditResponse> {
    return this.verify({ event_id: eventId });
  }

  /**
   * Verify artifact by ID
   */
  async verifyArtifact(artifactId: string): Promise<VerifyAuditResponse> {
    return this.verify({ artifact_id: artifactId });
  }

  /**
   * Verify signature
   */
  async verifySignature(signature: string): Promise<VerifyAuditResponse> {
    return this.verify({ signature });
  }

  /**
   * Get events by entity
   */
  async getByEntity(entityType: string, entityId: string): Promise<ListResponse<AuditEventResponse>> {
    return this.listEvents({ entity_type: entityType, entity_id: entityId });
  }

  /**
   * Get events by actor
   */
  async getByActor(actorId: string): Promise<ListResponse<AuditEventResponse>> {
    return this.listEvents({ actor_id: actorId });
  }

  /**
   * Get events in time range
   */
  async getInTimeRange(fromDate: string, toDate: string): Promise<ListResponse<AuditEventResponse>> {
    return this.listEvents({ from_date: fromDate, to_date: toDate });
  }

  /**
   * Check chain validity
   */
  async isChainValid(simulationId: string): Promise<boolean> {
    const report = await this.getSimulationReport(simulationId);
    return report.chain_valid;
  }

  /**
   * Get event type label
   */
  getEventTypeLabel(type: AuditEventType): string {
    const labels: Record<AuditEventType, string> = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      execute: 'Executed',
      approve: 'Approved',
      reject: 'Rejected',
    };
    return labels[type];
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  /**
   * Verify Merkle proof locally
   */
  verifyMerkleProofLocally(
    leafHash: string,
    proof: string[],
    root: string,
    leafIndex: number
  ): boolean {
    let currentHash = leafHash;
    let index = leafIndex;

    for (const sibling of proof) {
      if (index % 2 === 0) {
        currentHash = this.hashPair(currentHash, sibling);
      } else {
        currentHash = this.hashPair(sibling, currentHash);
      }
      index = Math.floor(index / 2);
    }

    return currentHash === root;
  }

  private hashPair(left: string, right: string): string {
    // In real implementation, use proper hashing
    return `hash(${left},${right})`;
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const entries = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
    
    return entries.length > 0 ? `?${entries.join('&')}` : '';
  }
}

export const auditService = new AuditService();
export default auditService;
