/**
 * CHE·NU V51 — PROPOSAL STORE
 * ============================
 * 
 * System prepares proposals but NEVER applies them.
 * All proposals are SESSION-SCOPED and expire at session end.
 * 
 * PRINCIPLE: "Proposals, not actions. Human validation always."
 */

import { getGlobalEventStore, SystemEvent } from './SystemEventStore';

// ============================================
// PROPOSAL TYPES
// ============================================

export type ProposalType = 'memory_unit' | 'sphere_update' | 'structure_change';
export type ProposalStatus = 'pending' | 'approved' | 'discarded' | 'edited' | 'expired';
export type ProposalConfidence = 'low' | 'medium' | 'high';

export interface Proposal {
  proposal_id: string;
  proposal_type: ProposalType;
  source_module: string;
  
  /** The proposed content */
  content: unknown;
  
  /** Affected spheres */
  affected_spheres: string[];
  
  /** User-adjustable confidence */
  confidence: ProposalConfidence;
  
  /** Always true - validation is MANDATORY */
  requires_validation: true;
  
  /** Current status */
  status: ProposalStatus;
  
  /** Timestamps */
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  
  /** Resolution actor */
  resolved_by?: 'user' | 'system';
  
  /** Edit history */
  edit_history: ProposalEdit[];
}

export interface ProposalEdit {
  edit_id: string;
  timestamp: string;
  field: string;
  old_value: unknown;
  new_value: unknown;
}

// ============================================
// DRAFT CHENU UNIT (for memory proposals)
// ============================================

export interface DraftChenuUnit {
  memory_system: 'library' | 'workspace';
  category: string;
  volatility: string;
  priority: string;
  canonical_summary: string;
  tags: string[];
  projects: string[];
  spheres: string[];
}

// ============================================
// PROPOSAL STORE
// ============================================

export class ProposalStore {
  private proposals: Map<string, Proposal> = new Map();
  private sessionId: string;
  private listeners: Set<(event: ProposalStoreEvent) => void> = new Set();

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  // ----------------------------------------
  // CREATE PROPOSAL
  // ----------------------------------------

  create(
    proposal_type: ProposalType,
    source_module: string,
    content: unknown,
    affected_spheres: string[] = [],
    confidence: ProposalConfidence = 'medium'
  ): Proposal {
    const now = new Date().toISOString();
    const proposal: Proposal = {
      proposal_id: this.generateProposalId(),
      proposal_type,
      source_module,
      content,
      affected_spheres,
      confidence,
      requires_validation: true,
      status: 'pending',
      created_at: now,
      updated_at: now,
      edit_history: []
    };

    this.proposals.set(proposal.proposal_id, proposal);
    
    // Emit system event
    getGlobalEventStore().emit(
      'proposal_created',
      'system',
      source_module,
      'info',
      { proposal_id: proposal.proposal_id, proposal_type }
    );

    this.notifyListeners({ type: 'created', proposal });
    
    return proposal;
  }

  // ----------------------------------------
  // APPROVE PROPOSAL (USER ACTION)
  // ----------------------------------------

  approve(proposal_id: string): Proposal | undefined {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      return undefined;
    }

    const now = new Date().toISOString();
    proposal.status = 'approved';
    proposal.updated_at = now;
    proposal.resolved_at = now;
    proposal.resolved_by = 'user';

    // Emit system event
    getGlobalEventStore().emit(
      'proposal_approved',
      'user',
      proposal.source_module,
      'info',
      { proposal_id }
    );

    this.notifyListeners({ type: 'approved', proposal });
    
    return proposal;
  }

  // ----------------------------------------
  // DISCARD PROPOSAL (USER ACTION)
  // ----------------------------------------

  discard(proposal_id: string): Proposal | undefined {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      return undefined;
    }

    const now = new Date().toISOString();
    proposal.status = 'discarded';
    proposal.updated_at = now;
    proposal.resolved_at = now;
    proposal.resolved_by = 'user';

    // Emit system event
    getGlobalEventStore().emit(
      'proposal_discarded',
      'user',
      proposal.source_module,
      'info',
      { proposal_id }
    );

    this.notifyListeners({ type: 'discarded', proposal });
    
    return proposal;
  }

  // ----------------------------------------
  // EDIT PROPOSAL (USER ACTION)
  // ----------------------------------------

  edit(proposal_id: string, field: string, new_value: unknown): Proposal | undefined {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      return undefined;
    }

    const old_value = (proposal.content as Record<string, unknown>)?.[field];
    const now = new Date().toISOString();

    // Record edit
    proposal.edit_history.push({
      edit_id: `edit_${Date.now()}`,
      timestamp: now,
      field,
      old_value,
      new_value
    });

    // Apply edit
    if (typeof proposal.content === 'object' && proposal.content !== null) {
      (proposal.content as Record<string, unknown>)[field] = new_value;
    }
    
    proposal.status = 'edited';
    proposal.updated_at = now;

    // Emit system event
    getGlobalEventStore().emit(
      'proposal_edited',
      'user',
      proposal.source_module,
      'info',
      { proposal_id, field }
    );

    this.notifyListeners({ type: 'edited', proposal });
    
    return proposal;
  }

  // ----------------------------------------
  // UPDATE CONFIDENCE
  // ----------------------------------------

  setConfidence(proposal_id: string, confidence: ProposalConfidence): Proposal | undefined {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      return undefined;
    }

    proposal.confidence = confidence;
    proposal.updated_at = new Date().toISOString();
    
    this.notifyListeners({ type: 'updated', proposal });
    
    return proposal;
  }

  // ----------------------------------------
  // QUERY PROPOSALS
  // ----------------------------------------

  getById(proposal_id: string): Proposal | undefined {
    return this.proposals.get(proposal_id);
  }

  getAll(): Proposal[] {
    return Array.from(this.proposals.values());
  }

  getPending(): Proposal[] {
    return this.getAll().filter(p => p.status === 'pending');
  }

  getApproved(): Proposal[] {
    return this.getAll().filter(p => p.status === 'approved');
  }

  getDiscarded(): Proposal[] {
    return this.getAll().filter(p => p.status === 'discarded');
  }

  getByModule(source_module: string): Proposal[] {
    return this.getAll().filter(p => p.source_module === source_module);
  }

  getByType(proposal_type: ProposalType): Proposal[] {
    return this.getAll().filter(p => p.proposal_type === proposal_type);
  }

  getBySphere(sphere_id: string): Proposal[] {
    return this.getAll().filter(p => p.affected_spheres.includes(sphere_id));
  }

  // ----------------------------------------
  // STATISTICS
  // ----------------------------------------

  getStats(): ProposalStoreStats {
    const all = this.getAll();
    return {
      total: all.length,
      pending: all.filter(p => p.status === 'pending').length,
      approved: all.filter(p => p.status === 'approved').length,
      discarded: all.filter(p => p.status === 'discarded').length,
      edited: all.filter(p => p.status === 'edited').length,
      expired: all.filter(p => p.status === 'expired').length,
      by_type: {
        memory_unit: all.filter(p => p.proposal_type === 'memory_unit').length,
        sphere_update: all.filter(p => p.proposal_type === 'sphere_update').length,
        structure_change: all.filter(p => p.proposal_type === 'structure_change').length
      },
      session_id: this.sessionId
    };
  }

  // ----------------------------------------
  // EXPIRE ALL PENDING (SESSION END)
  // ----------------------------------------

  expireAll(): void {
    const now = new Date().toISOString();
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'pending') {
        proposal.status = 'expired';
        proposal.updated_at = now;
        proposal.resolved_at = now;
        proposal.resolved_by = 'system';
      }
    }

    getGlobalEventStore().emit(
      'proposals_expired',
      'system',
      undefined,
      'info',
      { session_id: this.sessionId, expired_count: this.getAll().filter(p => p.status === 'expired').length }
    );
  }

  // ----------------------------------------
  // LISTENERS
  // ----------------------------------------

  subscribe(listener: (event: ProposalStoreEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(event: ProposalStoreEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('Proposal store listener error:', e);
      }
    });
  }

  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  private generateProposalId(): string {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// ============================================
// TYPES
// ============================================

export interface ProposalStoreStats {
  total: number;
  pending: number;
  approved: number;
  discarded: number;
  edited: number;
  expired: number;
  by_type: Record<ProposalType, number>;
  session_id: string;
}

export interface ProposalStoreEvent {
  type: 'created' | 'approved' | 'discarded' | 'edited' | 'updated' | 'expired';
  proposal: Proposal;
}

// ============================================
// SINGLETON INSTANCE (FOR DEMO)
// ============================================

let globalProposalStore: ProposalStore | null = null;

export function getGlobalProposalStore(): ProposalStore {
  if (!globalProposalStore) {
    globalProposalStore = new ProposalStore(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
  }
  return globalProposalStore;
}

export function resetGlobalProposalStore(): void {
  globalProposalStore = null;
}
