/**
 * CHE·NU Memory Write Gate
 * Version: V51
 * 
 * NON-NEGOTIABLE RULES:
 * - No write without explicit user acceptance
 * - No write if module is not ACTIVE
 * - All attempts are logged
 * - Rejected proposals remain ephemeral
 */

import { 
  Proposal, 
  ProposalStatus 
} from './UnderstandingExtraction';

import {
  ModuleRegistry,
  ModuleState,
  initializeDefaultModules
} from '../modules';

// ═══════════════════════════════════════════════════════════════════
// WRITE GATE RESULT
// ═══════════════════════════════════════════════════════════════════

export interface WriteGateResult {
  allowed: boolean;
  reason: string;
  proposal_id: string;
  timestamp: string;
}

export interface WriteAttempt {
  attempt_id: string;
  proposal_id: string;
  proposal_summary: string;
  proposal_status: ProposalStatus;
  user_id: string;
  conversation_id: string;
  result: WriteGateResult;
  is_demo: boolean;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════
// WRITE ATTEMPT LOG — IMMUTABLE
// ═══════════════════════════════════════════════════════════════════

class WriteAttemptLogStore {
  private readonly attempts: WriteAttempt[] = [];
  
  append(attempt: WriteAttempt): void {
    this.attempts.push(Object.freeze({ ...attempt }));
  }
  
  getAll(): readonly WriteAttempt[] {
    return Object.freeze([...this.attempts]);
  }
  
  getByProposal(proposal_id: string): readonly WriteAttempt[] {
    return Object.freeze(
      this.attempts.filter(a => a.proposal_id === proposal_id)
    );
  }
  
  getByConversation(conversation_id: string): readonly WriteAttempt[] {
    return Object.freeze(
      this.attempts.filter(a => a.conversation_id === conversation_id)
    );
  }
  
  getRecent(limit: number = 20): readonly WriteAttempt[] {
    return Object.freeze(
      [...this.attempts]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, limit)
    );
  }
  
  get count(): number {
    return this.attempts.length;
  }
  
  getStats(): WriteGateStats {
    const allowed = this.attempts.filter(a => a.result.allowed).length;
    const blocked = this.attempts.filter(a => !a.result.allowed).length;
    
    return {
      total_attempts: this.attempts.length,
      allowed_count: allowed,
      blocked_count: blocked,
      block_rate: this.attempts.length > 0 
        ? (blocked / this.attempts.length) * 100 
        : 0
    };
  }
}

export interface WriteGateStats {
  total_attempts: number;
  allowed_count: number;
  blocked_count: number;
  block_rate: number;
}

export const WriteAttemptLog = new WriteAttemptLogStore();

// ═══════════════════════════════════════════════════════════════════
// MEMORY WRITE GATE
// ═══════════════════════════════════════════════════════════════════

class MemoryWriteGateImpl {
  
  /**
   * Check if a write is allowed for a proposal.
   * 
   * CONDITIONS (ALL must be true):
   * 1. Proposal status is ACCEPTED or EDITED
   * 2. Target module is ACTIVE
   * 3. User has confirmed
   */
  checkWrite(
    proposal: Proposal,
    user_id: string,
    conversation_id: string,
    user_confirmed: boolean,
    is_demo: boolean = false
  ): WriteGateResult {
    const timestamp = new Date().toISOString();
    
    // ─────────────────────────────────────────────────────────────────
    // CHECK 1: Proposal must be accepted or edited
    // ─────────────────────────────────────────────────────────────────
    if (proposal.status !== 'accepted' && proposal.status !== 'edited') {
      return this.createResult(
        false,
        `Proposal status is "${proposal.status}". Only ACCEPTED or EDITED proposals can be written.`,
        proposal.id,
        timestamp
      );
    }
    
    // ─────────────────────────────────────────────────────────────────
    // CHECK 2: User must have explicitly confirmed
    // ─────────────────────────────────────────────────────────────────
    if (!user_confirmed) {
      return this.createResult(
        false,
        'User has not explicitly confirmed the write operation.',
        proposal.id,
        timestamp
      );
    }
    
    // ─────────────────────────────────────────────────────────────────
    // CHECK 3: Target module must be ACTIVE
    // ─────────────────────────────────────────────────────────────────
    const moduleId = this.getTargetModuleId(proposal);
    
    if (moduleId) {
      initializeDefaultModules();
      const contract = ModuleRegistry.getContract(moduleId);
      
      if (!contract) {
        return this.createResult(
          false,
          `Target module "${moduleId}" not found in registry.`,
          proposal.id,
          timestamp
        );
      }
      
      if (contract.current_state !== ModuleState.ACTIVE) {
        return this.createResult(
          false,
          `Target module "${moduleId}" is ${contract.current_state}. Only ACTIVE modules can receive writes.`,
          proposal.id,
          timestamp
        );
      }
    }
    
    // ─────────────────────────────────────────────────────────────────
    // ALL CHECKS PASSED
    // ─────────────────────────────────────────────────────────────────
    return this.createResult(
      true,
      is_demo 
        ? 'Write allowed (DEMO MODE - simulated)' 
        : 'Write allowed. All conditions met.',
      proposal.id,
      timestamp
    );
  }
  
  /**
   * Attempt to write a proposal to memory.
   * Logs the attempt regardless of outcome.
   */
  attemptWrite(
    proposal: Proposal,
    user_id: string,
    conversation_id: string,
    user_confirmed: boolean,
    is_demo: boolean = false
  ): WriteAttempt {
    const result = this.checkWrite(
      proposal,
      user_id,
      conversation_id,
      user_confirmed,
      is_demo
    );
    
    const attempt: WriteAttempt = {
      attempt_id: `WA-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      proposal_id: proposal.id,
      proposal_summary: proposal.user_edit ?? proposal.summary,
      proposal_status: proposal.status,
      user_id,
      conversation_id,
      result,
      is_demo,
      timestamp: new Date().toISOString()
    };
    
    // Log the attempt (always)
    WriteAttemptLog.append(attempt);
    
    // If allowed and not demo, perform actual write
    if (result.allowed && !is_demo) {
      this.performWrite(proposal, user_id, conversation_id);
    }
    
    return attempt;
  }
  
  /**
   * Perform the actual memory write.
   * This is called ONLY when all gates pass.
   */
  private performWrite(
    proposal: Proposal,
    user_id: string,
    conversation_id: string
  ): void {
    // In production, this would:
    // 1. Create a memory unit from the proposal
    // 2. Add to the target dataset
    // 3. Update the enterprise index
    // 4. Trigger CI validation
    
    // For now, we just log that write would occur
    logger.debug(`[MEMORY_WRITE] Proposal ${proposal.id} written by ${user_id} from conversation ${conversation_id}`);
  }
  
  /**
   * Get the target module ID based on proposal type.
   */
  private getTargetModuleId(proposal: Proposal): string | null {
    // Map proposal types to modules
    const moduleMap: Record<string, string> = {
      memory: 'MOD-DATA-001',      // Memory Unit Manager
      decision: 'MOD-GOVERNANCE-001', // Tree Laws Engine
      relation: 'MOD-DATA-002',    // Enterprise Index
      topic: 'MOD-DATA-001',       // Memory Unit Manager
      intent: 'MOD-DATA-001'       // Memory Unit Manager
    };
    
    return moduleMap[proposal.type] ?? 'MOD-DATA-001';
  }
  
  private createResult(
    allowed: boolean,
    reason: string,
    proposal_id: string,
    timestamp: string
  ): WriteGateResult {
    return { allowed, reason, proposal_id, timestamp };
  }
}

export const MemoryWriteGate = new MemoryWriteGateImpl();
