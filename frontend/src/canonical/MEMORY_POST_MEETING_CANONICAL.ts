/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — POST-MEETING MEMORY CANONICAL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES ABSOLUES - WHAT IS NEVER STORED:
 * - Raw reasoning (FORBIDDEN)
 * - Transcripts (FORBIDDEN)
 * - Intermediate thoughts (FORBIDDEN)
 * - Agent speculation (FORBIDDEN)
 * - Unvalidated content (FORBIDDEN)
 * 
 * ONLY validated outcomes survive.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { MeetingType } from './MEETING_TYPES_CANONICAL';
import { SphereId } from './SPHERES_CANONICAL_V2';

/**
 * MEMORY COMPLIANCE RULES - ABSOLUTE
 */
export const MEMORY_COMPLIANCE = {
  // FORBIDDEN content types
  FORBIDDEN: {
    RAW_REASONING: true,        // Never store raw reasoning
    TRANSCRIPTS: true,          // Never store transcripts
    INTERMEDIATE_THOUGHTS: true, // Never store intermediate thoughts
    AGENT_SPECULATION: true,    // Never store agent speculation
    UNVALIDATED_CONTENT: true,  // Never store unvalidated content
    CONVERSATION_LOGS: true,    // Never store conversation logs
    DRAFT_CONTENT: true,        // Never store draft content
    PROCESS_DATA: true          // Never store process/how data
  },
  
  // REQUIRED for storage
  REQUIRED: {
    USER_VALIDATION: true,      // Must be validated by user
    EXPLICIT_CONSENT: true,     // User must explicitly approve
    OUTCOME_ONLY: true,         // Only outcomes, not process
    SEMANTIC_SUMMARY: true      // Meaning, not raw content
  }
} as const;

/**
 * NEVER_STORED - Explicit list of forbidden content
 */
export const NEVER_STORED = [
  'Raw agent reasoning',
  'Meeting transcripts',
  'Conversation history',
  'Intermediate analysis',
  'Draft proposals',
  'Agent-to-agent communication',
  'Process logs',
  'Thinking traces',
  'Hypothesis before validation',
  'Speculative content',
  'User input verbatim',
  'Rejected content details'
] as const;

/**
 * ALLOWED_STORAGE - Only these types can be stored
 */
export const ALLOWED_STORAGE = [
  'Validated decision (summary only)',
  'Confirmed action item (summary only)',
  'User-approved insight (summary only)',
  'Explicit user note'
] as const;

/**
 * Memory Entry Type - Restricted
 */
export type MemoryEntryType = 
  | 'validated_decision'    // Decision validated by user
  | 'validated_action'      // Action item validated by user
  | 'validated_insight'     // Insight validated by user
  | 'user_note';            // Explicit user note

/**
 * Memory Entry State
 */
export type MemoryEntryState = 
  | 'proposed'              // System proposed, not yet validated
  | 'validated'             // User validated - CAN be stored
  | 'rejected';             // User rejected - NEVER stored

/**
 * Memory Destination
 */
export type MemoryDestination = 'personal' | 'sphere' | 'my_team';

/**
 * Memory Location
 */
export interface MemoryLocation {
  destination: MemoryDestination;
  sphereId?: SphereId;
}

/**
 * Post-Meeting Memory Entry
 */
export interface PostMeetingMemoryEntry {
  id: string;
  
  // Type (restricted)
  type: MemoryEntryType;
  
  // Content (semantic summary only, NEVER raw)
  content: string;              // Semantic summary
  
  // FORBIDDEN: These fields do NOT exist
  // rawContent: FORBIDDEN
  // transcript: FORBIDDEN
  // reasoning: FORBIDDEN
  // process: FORBIDDEN
  
  // Source
  meetingId: string;
  meetingType: MeetingType;
  
  // Destination
  proposedDestination: MemoryLocation;
  
  // State
  state: MemoryEntryState;
  
  // Validation (REQUIRED for storage)
  validatedBy?: string;         // User ID
  validatedAt?: number;         // Timestamp
  
  // User modification
  userModifiedContent?: string; // User can edit before validation
  
  // Metadata
  createdAt: number;
}

/**
 * Validate content before storage
 * Returns false if content violates rules.
 */
export function validateForStorage(entry: PostMeetingMemoryEntry): {
  canStore: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check state
  if (entry.state !== 'validated') {
    violations.push('UNVALIDATED: Content must be validated by user');
  }
  
  // Check for forbidden content indicators
  const contentLower = entry.content.toLowerCase();
  
  if (contentLower.includes('reasoning:') || contentLower.includes('thinking:')) {
    violations.push('RAW_REASONING: Content appears to contain raw reasoning');
  }
  
  if (contentLower.includes('transcript') || contentLower.includes('said:')) {
    violations.push('TRANSCRIPT: Content appears to contain transcript');
  }
  
  if (contentLower.includes('agent thinks') || contentLower.includes('speculation')) {
    violations.push('AGENT_SPECULATION: Content appears to contain speculation');
  }
  
  if (entry.content.length > 500) {
    violations.push('TOO_LONG: Content too long for semantic summary');
  }
  
  // Check validation
  if (!entry.validatedBy || !entry.validatedAt) {
    violations.push('NO_VALIDATION: Missing user validation');
  }
  
  return {
    canStore: violations.length === 0,
    violations
  };
}

/**
 * Memory storage rules reminder
 */
export const MEMORY_RULES = {
  rule1: 'NO raw reasoning - ever',
  rule2: 'NO transcripts - ever',
  rule3: 'NO unvalidated content - ever',
  rule4: 'ONLY semantic summaries',
  rule5: 'ONLY user-validated outcomes',
  rule6: 'User CAN edit before validation',
  rule7: 'Rejected content is DELETED, not stored'
} as const;

export default MEMORY_COMPLIANCE;
