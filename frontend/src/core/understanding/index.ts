/**
 * CHE·NU Understanding System
 * Version: V51
 * 
 * PROPOSAL-BASED EXTRACTION:
 * - Extract candidate signals from conversation
 * - User validates before memory write
 * - Full traceability
 */

// Extraction
export {
  type Proposal,
  type ProposalType,
  type ProposalStatus,
  type ConfidenceLevel,
  type ExtractionResult,
  createProposal,
  extractFromMessage,
  extractFromConversation,
  acceptProposal,
  editProposal,
  rejectProposal,
  PROPOSAL_TYPE_LABELS,
  CONFIDENCE_LABELS,
  STATUS_LABELS
} from './UnderstandingExtraction';

// Memory Write Gate
export {
  MemoryWriteGate,
  WriteAttemptLog,
  type WriteGateResult,
  type WriteAttempt,
  type WriteGateStats
} from './MemoryWriteGate';

// Validation Log
export {
  ValidationLog,
  type ValidatedOrigin,
  type RejectionRecord,
  type ValidationStats
} from './ValidationLog';
