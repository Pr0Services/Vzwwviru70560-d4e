/**
 * CHE·NU Understanding Extraction
 * Version: V51
 * 
 * PROPOSAL-ONLY SYSTEM:
 * - Extracts candidate signals from conversation
 * - Classifies into topics, intents, memory units
 * - OUTPUT IS PROPOSAL ONLY
 * - No writes without human validation
 */

// ═══════════════════════════════════════════════════════════════════
// PROPOSAL TYPES
// ═══════════════════════════════════════════════════════════════════

export type ProposalType = 'topic' | 'memory' | 'decision' | 'relation' | 'intent';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type ProposalStatus = 'proposed' | 'accepted' | 'edited' | 'rejected';

export interface Proposal {
  /** Unique proposal ID */
  id: string;
  
  /** Type of proposal */
  type: ProposalType;
  
  /** Human-readable summary */
  summary: string;
  
  /** Confidence level */
  confidence: ConfidenceLevel;
  
  /** Suggested target dataset */
  target_dataset: string | null;
  
  /** Suggested sphere */
  target_sphere: string | null;
  
  /** Current status - DEFAULT: proposed */
  status: ProposalStatus;
  
  /** Original text that triggered this proposal */
  source_text: string;
  
  /** Conversation message ID */
  source_message_id: string;
  
  /** Timestamp of extraction */
  extracted_at: string;
  
  /** User's edit (if status = edited) */
  user_edit?: string;
  
  /** User's note on acceptance */
  acceptance_note?: string;
  
  /** Timestamp of user action */
  action_at?: string;
}

// ═══════════════════════════════════════════════════════════════════
// PROPOSAL FACTORY
// ═══════════════════════════════════════════════════════════════════

let proposalCounter = 0;

export function createProposal(
  type: ProposalType,
  summary: string,
  confidence: ConfidenceLevel,
  source_text: string,
  source_message_id: string,
  target_dataset: string | null = null,
  target_sphere: string | null = null
): Proposal {
  proposalCounter++;
  
  return {
    id: `PROP-${Date.now()}-${proposalCounter.toString().padStart(4, '0')}`,
    type,
    summary,
    confidence,
    target_dataset,
    target_sphere,
    status: 'proposed',
    source_text,
    source_message_id,
    extracted_at: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════
// SIGNAL PATTERNS — KEYWORD-BASED EXTRACTION
// ═══════════════════════════════════════════════════════════════════

interface SignalPattern {
  type: ProposalType;
  patterns: RegExp[];
  confidence: ConfidenceLevel;
  target_sphere?: string;
  target_dataset?: string;
}

const SIGNAL_PATTERNS: SignalPattern[] = [
  // Decision patterns
  {
    type: 'decision',
    patterns: [
      /we decided to/i,
      /the decision is/i,
      /we agreed that/i,
      /we will (not )?proceed with/i,
      /approved:/i,
      /rejected:/i
    ],
    confidence: 'high',
    target_sphere: 'governance'
  },
  // Intent patterns
  {
    type: 'intent',
    patterns: [
      /i want to/i,
      /i need to/i,
      /we should/i,
      /we must/i,
      /it's important that/i,
      /the goal is/i,
      /our objective is/i
    ],
    confidence: 'medium',
    target_sphere: 'strategy'
  },
  // Topic patterns - Construction
  {
    type: 'topic',
    patterns: [
      /construction/i,
      /chantier/i,
      /building/i,
      /contractor/i,
      /rbq|cnesst|ccq/i,
      /permit|permis/i
    ],
    confidence: 'high',
    target_sphere: 'industry',
    target_dataset: 'VERTICAL_INDUSTRY_CONSTRUCTION'
  },
  // Topic patterns - Legal/Compliance
  {
    type: 'topic',
    patterns: [
      /compliance|conformité/i,
      /legal|légal/i,
      /regulation|réglementation/i,
      /contract|contrat/i,
      /privacy|confidentialité/i
    ],
    confidence: 'high',
    target_sphere: 'governance',
    target_dataset: 'LEGAL_AND_COMPLIANCE'
  },
  // Topic patterns - Finance
  {
    type: 'topic',
    patterns: [
      /budget/i,
      /revenue|revenu/i,
      /cost|coût/i,
      /invoice|facture/i,
      /payment|paiement/i,
      /financial|financier/i
    ],
    confidence: 'high',
    target_sphere: 'finance',
    target_dataset: 'FINANCIAL_OPERATIONS'
  },
  // Topic patterns - Product
  {
    type: 'topic',
    patterns: [
      /feature|fonctionnalité/i,
      /roadmap/i,
      /release|version/i,
      /bug|issue/i,
      /development|développement/i
    ],
    confidence: 'medium',
    target_sphere: 'product',
    target_dataset: 'PRODUCT_DEVELOPMENT'
  },
  // Memory unit patterns
  {
    type: 'memory',
    patterns: [
      /remember that/i,
      /note that/i,
      /important:/i,
      /key point:/i,
      /takeaway:/i,
      /à retenir/i
    ],
    confidence: 'high'
  },
  // Relation patterns
  {
    type: 'relation',
    patterns: [
      /is related to/i,
      /depends on/i,
      /connects to/i,
      /linked with/i,
      /impacts/i,
      /affects/i
    ],
    confidence: 'medium'
  }
];

// ═══════════════════════════════════════════════════════════════════
// EXTRACTION ENGINE
// ═══════════════════════════════════════════════════════════════════

export interface ExtractionResult {
  proposals: Proposal[];
  message_id: string;
  processed_at: string;
}

/**
 * Extract proposals from a single message.
 */
export function extractFromMessage(
  text: string,
  message_id: string
): ExtractionResult {
  const proposals: Proposal[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    for (const pattern of SIGNAL_PATTERNS) {
      for (const regex of pattern.patterns) {
        if (regex.test(trimmed)) {
          // Extract a clean summary
          const summary = trimmed.length > 100 
            ? trimmed.substring(0, 100) + '...'
            : trimmed;
          
          proposals.push(createProposal(
            pattern.type,
            summary,
            pattern.confidence,
            trimmed,
            message_id,
            pattern.target_dataset ?? null,
            pattern.target_sphere ?? null
          ));
          
          break; // One match per sentence per pattern type
        }
      }
    }
  }
  
  // Deduplicate similar proposals
  const unique = deduplicateProposals(proposals);
  
  return {
    proposals: unique,
    message_id,
    processed_at: new Date().toISOString()
  };
}

/**
 * Extract from multiple messages (conversation).
 */
export function extractFromConversation(
  messages: Array<{ id: string; text: string; role: 'user' | 'assistant' }>
): ExtractionResult[] {
  return messages
    .filter(m => m.role === 'user') // Only extract from user messages
    .map(m => extractFromMessage(m.text, m.id));
}

/**
 * Remove duplicate or very similar proposals.
 */
function deduplicateProposals(proposals: Proposal[]): Proposal[] {
  const seen = new Set<string>();
  const unique: Proposal[] = [];
  
  for (const proposal of proposals) {
    // Create a fingerprint
    const fingerprint = `${proposal.type}:${proposal.summary.toLowerCase().substring(0, 50)}`;
    
    if (!seen.has(fingerprint)) {
      seen.add(fingerprint);
      unique.push(proposal);
    }
  }
  
  return unique;
}

// ═══════════════════════════════════════════════════════════════════
// PROPOSAL ACTIONS
// ═══════════════════════════════════════════════════════════════════

export function acceptProposal(
  proposal: Proposal,
  note?: string
): Proposal {
  return {
    ...proposal,
    status: 'accepted',
    acceptance_note: note,
    action_at: new Date().toISOString()
  };
}

export function editProposal(
  proposal: Proposal,
  editedSummary: string,
  note?: string
): Proposal {
  return {
    ...proposal,
    status: 'edited',
    user_edit: editedSummary,
    acceptance_note: note,
    action_at: new Date().toISOString()
  };
}

export function rejectProposal(
  proposal: Proposal
): Proposal {
  return {
    ...proposal,
    status: 'rejected',
    action_at: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════
// TYPE LABELS
// ═══════════════════════════════════════════════════════════════════

export const PROPOSAL_TYPE_LABELS: Record<ProposalType, string> = {
  topic: 'Topic',
  memory: 'Memory Unit',
  decision: 'Decision',
  relation: 'Relation',
  intent: 'Intent'
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  low: 'Low Confidence',
  medium: 'Medium Confidence',
  high: 'High Confidence'
};

export const STATUS_LABELS: Record<ProposalStatus, string> = {
  proposed: 'Proposed',
  accepted: 'Accepted',
  edited: 'Edited & Accepted',
  rejected: 'Rejected'
};
