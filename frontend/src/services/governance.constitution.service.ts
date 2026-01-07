/**
 * ============================================================================
 * CHE·NU™ V70 — GOVERNANCE CONSTITUTION SERVICE (PRODUCTION)
 * ============================================================================
 * Governance service with full API integration to Backend V69
 * Replaces the stub version from V68.6
 * Principle: GOUVERNANCE > EXÉCUTION
 * 
 * CANON RULES:
 * - All sensitive actions require checkpoint approval
 * - Category C always requires HITL
 * - No execution without explicit human approval
 * ============================================================================
 */

import { checkpointsService } from './api/checkpoints.service';
import { auditService } from './api/audit.service';
import type {
  CheckpointResponse,
  CheckpointType,
  CheckpointCategory,
  AuditEventResponse,
  AuditReportResponse,
} from '../types/api.types';

// ============================================================================
// TYPES
// ============================================================================

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  category: CheckpointCategory;
  enforced: boolean;
}

export interface GovernanceStatus {
  active: boolean;
  pendingCheckpoints: number;
  approvedToday: number;
  rejectedToday: number;
  rules: GovernanceRule[];
}

export interface GovernanceDecision {
  checkpointId: string;
  decision: 'approve' | 'reject' | 'escalate';
  reason?: string;
  decidedBy: string;
  decidedAt: string;
}

// ============================================================================
// GOVERNANCE EVENT HANDLERS
// ============================================================================

export interface GovernanceEventHandlers {
  onCheckpointPending?: (checkpoint: CheckpointResponse) => void;
  onCheckpointResolved?: (checkpoint: CheckpointResponse, decision: GovernanceDecision) => void;
  onRuleViolation?: (rule: GovernanceRule, context: unknown) => void;
}

// ============================================================================
// CANON GOVERNANCE RULES
// ============================================================================

export const CANON_RULES: GovernanceRule[] = [
  {
    id: 'GOV-001',
    name: 'Human Sovereignty',
    description: 'No action without human approval',
    category: 'A',
    enforced: true,
  },
  {
    id: 'GOV-002',
    name: 'Autonomy Isolation',
    description: 'AI operates in sandboxes only',
    category: 'A',
    enforced: true,
  },
  {
    id: 'GOV-003',
    name: 'HITL Category C',
    description: 'Category C always requires human-in-the-loop',
    category: 'C',
    enforced: true,
  },
  {
    id: 'GOV-004',
    name: 'XR Read Only',
    description: 'XR is for visualization only, never execution',
    category: 'B',
    enforced: true,
  },
  {
    id: 'GOV-005',
    name: 'No Discriminatory Causation',
    description: 'Causal inference cannot use protected characteristics',
    category: 'A',
    enforced: true,
  },
  {
    id: 'GOV-006',
    name: 'Synthetic Data Only',
    description: 'All simulations must be marked as synthetic',
    category: 'B',
    enforced: true,
  },
  {
    id: 'GOV-007',
    name: 'Audit Trail',
    description: 'Every meaningful event produces an immutable trace',
    category: 'A',
    enforced: true,
  },
];

// ============================================================================
// GOVERNANCE CONSTITUTION SERVICE (PRODUCTION)
// ============================================================================

class GovernanceConstitutionServiceImpl {
  private eventHandlers: GovernanceEventHandlers = {};
  private pollInterval: number | null = null;

  /**
   * Initialize governance with event handlers
   */
  init(handlers: GovernanceEventHandlers): void {
    this.eventHandlers = handlers;
  }

  /**
   * Get governance status
   */
  async getStatus(): Promise<GovernanceStatus> {
    try {
      const pending = await checkpointsService.getPending();
      
      // Get today's resolved checkpoints
      const today = new Date().toISOString().split('T')[0];
      const resolved = await checkpointsService.list({
        status: 'approved',
        from_date: today,
      });
      const rejected = await checkpointsService.list({
        status: 'rejected',
        from_date: today,
      });

      return {
        active: true,
        pendingCheckpoints: pending.items.length,
        approvedToday: resolved.total,
        rejectedToday: rejected.total,
        rules: CANON_RULES,
      };
    } catch (error) {
      return {
        active: false,
        pendingCheckpoints: 0,
        approvedToday: 0,
        rejectedToday: 0,
        rules: CANON_RULES,
      };
    }
  }

  /**
   * Get pending checkpoints
   */
  async getPendingCheckpoints(): Promise<CheckpointResponse[]> {
    const response = await checkpointsService.getPending();
    return response.items;
  }

  /**
   * Approve checkpoint
   */
  async approve(checkpointId: string, reason?: string): Promise<CheckpointResponse> {
    const checkpoint = await checkpointsService.approve(checkpointId, reason);
    
    const decision: GovernanceDecision = {
      checkpointId,
      decision: 'approve',
      reason,
      decidedBy: 'current_user',
      decidedAt: new Date().toISOString(),
    };

    this.eventHandlers.onCheckpointResolved?.(checkpoint, decision);
    
    return checkpoint;
  }

  /**
   * Reject checkpoint
   */
  async reject(checkpointId: string, reason: string): Promise<CheckpointResponse> {
    const checkpoint = await checkpointsService.reject(checkpointId, reason);
    
    const decision: GovernanceDecision = {
      checkpointId,
      decision: 'reject',
      reason,
      decidedBy: 'current_user',
      decidedAt: new Date().toISOString(),
    };

    this.eventHandlers.onCheckpointResolved?.(checkpoint, decision);
    
    return checkpoint;
  }

  /**
   * Escalate checkpoint
   */
  async escalate(checkpointId: string, reason: string): Promise<CheckpointResponse> {
    const checkpoint = await checkpointsService.escalate(checkpointId, reason);
    
    const decision: GovernanceDecision = {
      checkpointId,
      decision: 'escalate',
      reason,
      decidedBy: 'current_user',
      decidedAt: new Date().toISOString(),
    };

    this.eventHandlers.onCheckpointResolved?.(checkpoint, decision);
    
    return checkpoint;
  }

  /**
   * Get audit trail for entity
   */
  async getAuditTrail(entityType: string, entityId: string): Promise<AuditEventResponse[]> {
    const response = await auditService.getByEntity(entityType, entityId);
    return response.items;
  }

  /**
   * Get audit report for simulation
   */
  async getAuditReport(simulationId: string): Promise<AuditReportResponse> {
    return auditService.getSimulationReport(simulationId);
  }

  /**
   * Verify audit event
   */
  async verifyAuditEvent(eventId: string): Promise<boolean> {
    const result = await auditService.verifyEvent(eventId);
    return result.valid;
  }

  /**
   * Check if checkpoint is required for action
   */
  requiresCheckpoint(
    actionType: string, 
    riskScore: number
  ): { required: boolean; category: CheckpointCategory; type: CheckpointType } {
    // High risk always requires checkpoint
    if (riskScore >= 0.8) {
      return { required: true, category: 'C', type: 'hitl' };
    }

    // Medium risk
    if (riskScore >= 0.5) {
      return { required: true, category: 'B', type: 'governance' };
    }

    // Sensitive actions
    const sensitiveActions = ['delete', 'execute', 'publish', 'send', 'transfer'];
    if (sensitiveActions.includes(actionType.toLowerCase())) {
      return { required: true, category: 'A', type: 'sensitive' };
    }

    return { required: false, category: 'A', type: 'governance' };
  }

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): GovernanceRule | undefined {
    return CANON_RULES.find(r => r.id === ruleId);
  }

  /**
   * Check if action violates rules
   */
  checkRuleViolation(action: string, context: Record<string, unknown>): GovernanceRule | null {
    // Check for discriminatory causation
    if (action === 'causal_inference') {
      const blockedTerms = ['race', 'gender', 'age', 'ethnicity'];
      const contextStr = JSON.stringify(context).toLowerCase();
      
      if (blockedTerms.some(term => contextStr.includes(term))) {
        return CANON_RULES.find(r => r.id === 'GOV-005') || null;
      }
    }

    // Check for XR execution attempt
    if (action === 'xr_execute') {
      return CANON_RULES.find(r => r.id === 'GOV-004') || null;
    }

    return null;
  }

  /**
   * Start polling for pending checkpoints
   */
  startPolling(intervalMs: number = 5000): void {
    if (this.pollInterval) return;

    const poll = async () => {
      try {
        const pending = await this.getPendingCheckpoints();
        pending.forEach(checkpoint => {
          this.eventHandlers.onCheckpointPending?.(checkpoint);
        });
      } catch (error) {
        console.error('Governance polling error:', error);
      }
    };

    poll();
    this.pollInterval = window.setInterval(poll, intervalMs);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Get category description
   */
  getCategoryDescription(category: CheckpointCategory): string {
    const descriptions: Record<CheckpointCategory, string> = {
      'A': 'Standard governance check',
      'B': 'Enhanced review required',
      'C': 'HITL mandatory - human must decide',
    };
    return descriptions[category];
  }

  /**
   * Format checkpoint for display
   */
  formatCheckpoint(checkpoint: CheckpointResponse): {
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    timeRemaining: string | null;
  } {
    const urgency = checkpoint.category === 'C' ? 'high' : 
                    checkpoint.category === 'B' ? 'medium' : 'low';

    let timeRemaining: string | null = null;
    if (checkpoint.timeout_at) {
      const remaining = new Date(checkpoint.timeout_at).getTime() - Date.now();
      if (remaining > 0) {
        const minutes = Math.floor(remaining / 60000);
        timeRemaining = `${minutes} minutes remaining`;
      } else {
        timeRemaining = 'Expired';
      }
    }

    return {
      title: `${checkpoint.type.toUpperCase()} Checkpoint`,
      description: checkpoint.description,
      urgency,
      timeRemaining,
    };
  }
}

// Export singleton instance
export const GovernanceConstitutionService = new GovernanceConstitutionServiceImpl();
export default GovernanceConstitutionService;
