/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — MEETING TYPES CANONICAL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES STRICTES:
 * - Meetings MUST have: SCOPE, GOAL, CLOSURE
 * - NO indefinite meetings
 * - NO passive meetings
 * - Meetings are FINITE and BOUNDED
 * - Agents NEVER start meetings
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { SphereId } from './SPHERES_CANONICAL_V2';

/**
 * Meeting types - Each has specific purpose and closure criteria
 */
export type MeetingType = 
  | 'reflection'      // Explore ideas → Closure: insights documented
  | 'team_alignment'  // Align team → Closure: alignment confirmed
  | 'decision'        // Make decision → Closure: decision made or deferred
  | 'review_audit';   // Review/audit → Closure: findings documented

/**
 * Meeting status - Explicit lifecycle
 */
export type MeetingStatus = 
  | 'scheduled'   // Not yet started
  | 'active'      // In progress (bounded time)
  | 'closing'     // Generating closure
  | 'completed'   // Properly closed
  | 'cancelled';  // Cancelled before completion

/**
 * COMPLIANCE RULES - MEETINGS
 */
export const MEETING_COMPLIANCE = {
  // Meetings MUST have scope
  SCOPE_REQUIRED: true,
  
  // Meetings MUST have goal
  GOAL_REQUIRED: true,
  
  // Meetings MUST have closure criteria
  CLOSURE_REQUIRED: true,
  
  // Meetings are time-bounded
  TIME_BOUNDED: true,
  
  // No indefinite meetings
  NO_INDEFINITE: true,
  
  // No passive meetings (must have active purpose)
  NO_PASSIVE: true,
  
  // Agents NEVER start meetings
  AGENTS_NEVER_START: true,
  
  // User MUST initiate
  USER_INITIATES: true
} as const;

/**
 * Meeting Definition - REQUIRED fields
 */
export interface MeetingDefinition {
  // REQUIRED: Scope
  scope: {
    spheres: SphereId[];        // Which spheres involved
    boundaries: string;          // What is in/out of scope
  };
  
  // REQUIRED: Goal
  goal: {
    objective: string;           // What we're trying to achieve
    successCriteria: string[];   // How we know we succeeded
  };
  
  // REQUIRED: Closure
  closure: {
    criteria: string[];          // What triggers closure
    maxDuration?: number;        // Max time in minutes
    outputs: string[];           // What must be produced
  };
}

/**
 * Meeting Agent - Participant with constraints
 */
export interface MeetingAgent {
  agentId: string;
  role: 'facilitator' | 'participant' | 'observer';
  required: boolean;
  
  // COMPLIANCE: Agents never initiate
  constraints: {
    canInitiate: false;
    canClose: false;
    respondsOnly: true;
  };
}

/**
 * Meeting - Full structure
 */
export interface Meeting {
  id: string;
  type: MeetingType;
  status: MeetingStatus;
  
  // REQUIRED components
  definition: MeetingDefinition;
  
  // Participants
  initiatedBy: string;          // User ID - ALWAYS user
  agents: MeetingAgent[];
  
  // Timeline (bounded)
  createdAt: number;
  startedAt?: number;
  closingAt?: number;           // When closure began
  completedAt?: number;
  
  // Max duration enforcement
  maxDurationMs: number;
  
  // Outputs
  outputs: MeetingOutput[];
}

/**
 * Meeting Output - What the meeting produces
 */
export interface MeetingOutput {
  id: string;
  type: 'proposal' | 'decision' | 'insight' | 'action_item';
  content: string;
  status: 'draft' | 'validated' | 'rejected';
  validatedBy?: string;
  validatedAt?: number;
}

/**
 * MEETING TYPES CONFIGURATION
 * Each type has specific requirements.
 */
export const MEETING_TYPES: Record<MeetingType, {
  name: { en: string; fr: string };
  purpose: string;
  closureCriteria: string[];
  maxDurationMinutes: number;
  requiredOutputs: string[];
}> = {
  reflection: {
    name: { en: 'Reflection', fr: 'Réflexion' },
    purpose: 'Explore and develop ideas',
    closureCriteria: [
      'Key insights identified',
      'Next steps defined OR topic parked'
    ],
    maxDurationMinutes: 30,
    requiredOutputs: ['insights_summary']
  },
  
  team_alignment: {
    name: { en: 'Team Alignment', fr: 'Alignement Équipe' },
    purpose: 'Align team on direction or approach',
    closureCriteria: [
      'Alignment reached OR disagreements documented',
      'Action items assigned'
    ],
    maxDurationMinutes: 45,
    requiredOutputs: ['alignment_status', 'action_items']
  },
  
  decision: {
    name: { en: 'Decision', fr: 'Décision' },
    purpose: 'Make a specific decision',
    closureCriteria: [
      'Decision made OR explicitly deferred',
      'Rationale documented'
    ],
    maxDurationMinutes: 60,
    requiredOutputs: ['decision_record', 'rationale']
  },
  
  review_audit: {
    name: { en: 'Review/Audit', fr: 'Revue/Audit' },
    purpose: 'Review work or audit compliance',
    closureCriteria: [
      'All items reviewed',
      'Findings documented',
      'Actions identified'
    ],
    maxDurationMinutes: 90,
    requiredOutputs: ['review_findings', 'action_items']
  }
};

/**
 * Validate meeting has required components
 */
export function validateMeetingCompliance(meeting: Partial<Meeting>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!meeting.definition?.scope?.spheres?.length) {
    errors.push('SCOPE_REQUIRED: Meeting must have defined spheres');
  }
  
  if (!meeting.definition?.goal?.objective) {
    errors.push('GOAL_REQUIRED: Meeting must have objective');
  }
  
  if (!meeting.definition?.closure?.criteria?.length) {
    errors.push('CLOSURE_REQUIRED: Meeting must have closure criteria');
  }
  
  if (!meeting.initiatedBy) {
    errors.push('USER_INITIATES: Meeting must be initiated by user');
  }
  
  if (!meeting.maxDurationMs || meeting.maxDurationMs <= 0) {
    errors.push('TIME_BOUNDED: Meeting must have max duration');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default MEETING_COMPLIANCE;
