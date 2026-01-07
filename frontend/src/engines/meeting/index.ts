/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — MEETING ENGINE INDEX                                  ║
 * ║              Knowledge Event Management System                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Meetings are KNOWLEDGE EVENTS that generate structured, actionable,        ║
 * ║   and replayable artifacts."                                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Classification
  MeetingType,
  MeetingStatus,
  MeetingPhase,
  
  // Participants
  ParticipantRole,
  ParticipantStatus,
  MeetingParticipant,
  
  // Agenda
  AgendaItem,
  MeetingAgenda,
  
  // Notes & Transcript
  TranscriptSegment,
  MeetingNotes,
  
  // Decisions
  DecisionStatus,
  MeetingDecision,
  
  // Tasks
  MeetingTask,
  
  // Summaries
  MeetingSummaries,
  
  // Recording & XR
  MeetingRecording,
  XRMeetingSpace,
  
  // Follow-Up
  MeetingFollowUp,
  
  // Agent Contributions
  AgentContribution,
  
  // Governance
  MeetingGovernance,
  
  // Main Interface
  Meeting,
  
  // Creation & Query
  MeetingCreationRequest,
  MeetingQuery,
  
  // Standup Specific
  StandupEntry,
  StandupMeetingExtras,
  
  // Async Specific
  AsyncContributionWindow,
  AsyncContribution,
  AsyncMeetingExtras,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  MeetingEngine,
  NoteEngine,
  DecisionEngine,
  TaskExtractionEngine,
  SummaryEngine,
} from './MeetingEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

import { 
  MeetingEngine,
  NoteEngine,
  DecisionEngine,
  TaskExtractionEngine,
  SummaryEngine,
} from './MeetingEngine';

export interface MeetingEngineSet {
  meeting: MeetingEngine;
  note: NoteEngine;
  decision: DecisionEngine;
  taskExtraction: TaskExtractionEngine;
  summary: SummaryEngine;
}

/**
 * Create a complete meeting engine set
 */
export function createMeetingEngines(): MeetingEngineSet {
  return {
    meeting: new MeetingEngine(),
    note: new NoteEngine(),
    decision: new DecisionEngine(),
    taskExtraction: new TaskExtractionEngine(),
    summary: new SummaryEngine(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  MeetingEngine,
  NoteEngine,
  DecisionEngine,
  TaskExtractionEngine,
  SummaryEngine,
  createMeetingEngines,
};
