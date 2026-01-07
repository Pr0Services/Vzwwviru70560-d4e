/**
 * 🛡️ CHE·NU V71 — OPA GOVERNANCE GATE
 * Module 01 — Validation des permissions et règles
 * 
 * RÈGLE: Aucune action n'est exécutée sans validation OPA
 */

export interface OPADecision {
  allowed: boolean;
  reason: string;
  requiresCheckpoint: boolean;
  checkpointType?: 'governance' | 'cost' | 'identity' | 'sensitive';
  policies: string[];
}

export interface OPARequest {
  action: string;
  subject: { userId: string; identityId: string; roles: string[] };
  resource: { type: string; id: string; sphere: string };
  context: Record<string, unknown>;
}

export class OPAGate {
  private policies: Map<string, (req: OPARequest) => OPADecision> = new Map();

  constructor() {
    this.loadDefaultPolicies();
  }

  private loadDefaultPolicies(): void {
    // Policy: Identity Boundary
    this.policies.set('identity_boundary', (req) => ({
      allowed: req.resource.id.startsWith(req.subject.identityId) || req.resource.type === 'public',
      reason: 'Identity boundary check',
      requiresCheckpoint: false,
      policies: ['identity_boundary']
    }));

    // Policy: Sensitive Actions
    this.policies.set('sensitive_actions', (req) => {
      const sensitiveActions = ['delete', 'publish', 'send', 'transfer', 'approve'];
      const isSensitive = sensitiveActions.some(a => req.action.includes(a));
      return {
        allowed: true,
        reason: isSensitive ? 'Sensitive action requires checkpoint' : 'Action allowed',
        requiresCheckpoint: isSensitive,
        checkpointType: isSensitive ? 'sensitive' : undefined,
        policies: ['sensitive_actions']
      };
    });

    // Policy: Sphere Access
    this.policies.set('sphere_access', (req) => ({
      allowed: true, // Cross-sphere géré par workflow explicite
      reason: 'Sphere access check',
      requiresCheckpoint: req.resource.sphere !== req.context.currentSphere,
      checkpointType: req.resource.sphere !== req.context.currentSphere ? 'governance' : undefined,
      policies: ['sphere_access']
    }));
  }

  async evaluate(request: OPARequest): Promise<OPADecision> {
    const decisions: OPADecision[] = [];
    
    for (const [name, policy] of this.policies) {
      decisions.push(policy(request));
    }

    // Agrégation: si un refuse, tout refuse
    const denied = decisions.find(d => !d.allowed);
    if (denied) return denied;

    // Agrégation: si un checkpoint requis, checkpoint requis
    const checkpoint = decisions.find(d => d.requiresCheckpoint);
    if (checkpoint) return {
      allowed: true,
      reason: checkpoint.reason,
      requiresCheckpoint: true,
      checkpointType: checkpoint.checkpointType,
      policies: decisions.flatMap(d => d.policies)
    };

    return {
      allowed: true,
      reason: 'All policies passed',
      requiresCheckpoint: false,
      policies: decisions.flatMap(d => d.policies)
    };
  }
}

export const opaGate = new OPAGate();
