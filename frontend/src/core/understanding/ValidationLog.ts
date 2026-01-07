/**
 * CHE·NU Validation Log
 * Version: V51
 * 
 * TRACEABILITY:
 * - Every accepted write links to conversation_id
 * - Every accepted write links to user_id
 * - Every action has timestamp
 * - Rejected proposals are logged (no memory write)
 */

import { Proposal, ProposalStatus, ProposalType } from './UnderstandingExtraction';

// ═══════════════════════════════════════════════════════════════════
// VALIDATED ORIGIN — LINKS MEMORY TO SOURCE
// ═══════════════════════════════════════════════════════════════════

export interface ValidatedOrigin {
  /** Unique origin ID */
  origin_id: string;
  
  /** Original proposal ID */
  proposal_id: string;
  
  /** Proposal type */
  proposal_type: ProposalType;
  
  /** Final content (after user edit if any) */
  final_content: string;
  
  /** Original extracted content */
  original_content: string;
  
  /** Was content edited by user? */
  was_edited: boolean;
  
  /** User's acceptance note */
  acceptance_note: string | null;
  
  /** Source conversation ID */
  conversation_id: string;
  
  /** User who validated */
  validated_by: string;
  
  /** Timestamp of validation */
  validated_at: string;
  
  /** Target dataset for write */
  target_dataset: string | null;
  
  /** Target sphere */
  target_sphere: string | null;
  
  /** Session ID */
  session_id: string;
  
  /** Was this a demo operation? */
  is_demo: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// REJECTION RECORD
// ═══════════════════════════════════════════════════════════════════

export interface RejectionRecord {
  /** Unique rejection ID */
  rejection_id: string;
  
  /** Original proposal ID */
  proposal_id: string;
  
  /** Proposal type */
  proposal_type: ProposalType;
  
  /** Content that was rejected */
  rejected_content: string;
  
  /** Source conversation ID */
  conversation_id: string;
  
  /** User who rejected */
  rejected_by: string;
  
  /** Timestamp of rejection */
  rejected_at: string;
  
  /** Session ID */
  session_id: string;
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION LOG STORE
// ═══════════════════════════════════════════════════════════════════

class ValidationLogStore {
  private readonly validatedOrigins: ValidatedOrigin[] = [];
  private readonly rejections: RejectionRecord[] = [];
  
  /**
   * Record an accepted/edited proposal.
   */
  recordAcceptance(
    proposal: Proposal,
    conversation_id: string,
    user_id: string,
    session_id: string,
    is_demo: boolean = false
  ): ValidatedOrigin {
    const origin: ValidatedOrigin = {
      origin_id: `VO-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      proposal_id: proposal.id,
      proposal_type: proposal.type,
      final_content: proposal.user_edit ?? proposal.summary,
      original_content: proposal.summary,
      was_edited: proposal.status === 'edited',
      acceptance_note: proposal.acceptance_note ?? null,
      conversation_id,
      validated_by: user_id,
      validated_at: new Date().toISOString(),
      target_dataset: proposal.target_dataset,
      target_sphere: proposal.target_sphere,
      session_id,
      is_demo
    };
    
    this.validatedOrigins.push(Object.freeze(origin));
    return origin;
  }
  
  /**
   * Record a rejected proposal.
   */
  recordRejection(
    proposal: Proposal,
    conversation_id: string,
    user_id: string,
    session_id: string
  ): RejectionRecord {
    const rejection: RejectionRecord = {
      rejection_id: `RJ-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      proposal_id: proposal.id,
      proposal_type: proposal.type,
      rejected_content: proposal.summary,
      conversation_id,
      rejected_by: user_id,
      rejected_at: new Date().toISOString(),
      session_id
    };
    
    this.rejections.push(Object.freeze(rejection));
    return rejection;
  }
  
  /**
   * Get all validated origins.
   */
  getAllOrigins(): readonly ValidatedOrigin[] {
    return Object.freeze([...this.validatedOrigins]);
  }
  
  /**
   * Get origins by conversation.
   */
  getOriginsByConversation(conversation_id: string): readonly ValidatedOrigin[] {
    return Object.freeze(
      this.validatedOrigins.filter(o => o.conversation_id === conversation_id)
    );
  }
  
  /**
   * Get origins by user.
   */
  getOriginsByUser(user_id: string): readonly ValidatedOrigin[] {
    return Object.freeze(
      this.validatedOrigins.filter(o => o.validated_by === user_id)
    );
  }
  
  /**
   * Get all rejections.
   */
  getAllRejections(): readonly RejectionRecord[] {
    return Object.freeze([...this.rejections]);
  }
  
  /**
   * Get rejections by conversation.
   */
  getRejectionsByConversation(conversation_id: string): readonly RejectionRecord[] {
    return Object.freeze(
      this.rejections.filter(r => r.conversation_id === conversation_id)
    );
  }
  
  /**
   * Get statistics.
   */
  getStats(): ValidationStats {
    return {
      total_validated: this.validatedOrigins.length,
      total_rejected: this.rejections.length,
      edited_count: this.validatedOrigins.filter(o => o.was_edited).length,
      demo_count: this.validatedOrigins.filter(o => o.is_demo).length,
      acceptance_rate: (this.validatedOrigins.length + this.rejections.length) > 0
        ? (this.validatedOrigins.length / (this.validatedOrigins.length + this.rejections.length)) * 100
        : 0
    };
  }
  
  /**
   * Get recent activity.
   */
  getRecentActivity(limit: number = 10): Array<ValidatedOrigin | RejectionRecord> {
    const all = [
      ...this.validatedOrigins.map(o => ({ ...o, _type: 'origin' as const })),
      ...this.rejections.map(r => ({ ...r, _type: 'rejection' as const }))
    ];
    
    return all
      .sort((a, b) => {
        const timeA = 'validated_at' in a ? a.validated_at : a.rejected_at;
        const timeB = 'validated_at' in b ? b.validated_at : b.rejected_at;
        return timeB.localeCompare(timeA);
      })
      .slice(0, limit);
  }
}

export interface ValidationStats {
  total_validated: number;
  total_rejected: number;
  edited_count: number;
  demo_count: number;
  acceptance_rate: number;
}

export const ValidationLog = new ValidationLogStore();
