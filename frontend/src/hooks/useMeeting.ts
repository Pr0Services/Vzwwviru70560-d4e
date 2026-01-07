/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — USE MEETING HOOK
 * ═══════════════════════════════════════════════════════════════════════════
 * Hook pour gérer les meetings selon les règles canoniques
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import {
  Meeting,
  MeetingType,
  MeetingStatus,
  MeetingAgent,
  MEETING_TYPES,
  MEETING_FLOW
} from '../canonical/MEETING_TYPES_CANONICAL';
import { MeetingProposal, MeetingUIState } from '../canonical/MEETING_UI_CANONICAL';
import { PostMeetingMemoryEntry, MemoryLocation } from '../canonical/MEMORY_POST_MEETING_CANONICAL';
import { SphereId } from '../canonical/SPHERES_CANONICAL_V2';

interface UseMeetingReturn {
  // State
  currentMeeting: Meeting | null;
  meetingUIState: MeetingUIState;
  proposals: MeetingProposal[];
  memoryEntries: PostMeetingMemoryEntry[];
  
  // Actions
  startMeeting: (type: MeetingType, spheres: SphereId[], objective: string) => void;
  closeMeeting: () => void;
  addProposal: (proposal: Omit<MeetingProposal, 'id' | 'status'>) => void;
  validateProposals: (proposalIds: string[]) => void;
  rejectProposal: (proposalId: string) => void;
  
  // Memory
  generateMemoryEntries: () => void;
  validateMemoryEntries: (entryIds: string[]) => void;
  rejectMemoryEntry: (entryId: string) => void;
  
  // Checks
  canStartMeeting: (type: MeetingType) => boolean;
  getMeetingAgents: (type: MeetingType, spheres: SphereId[]) => MeetingAgent[];
}

export function useMeeting(): UseMeetingReturn {
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [meetingUIState, setMeetingUIState] = useState<MeetingUIState>('closed');
  const [proposals, setProposals] = useState<MeetingProposal[]>([]);
  const [memoryEntries, setMemoryEntries] = useState<PostMeetingMemoryEntry[]>([]);

  /**
   * Get agents required for a meeting type
   */
  const getMeetingAgents = useCallback((type: MeetingType, spheres: SphereId[]): MeetingAgent[] => {
    const config = MEETING_TYPES[type];
    const agents: MeetingAgent[] = [...config.requiredAgents];

    // Add context reasoning agents for each sphere
    spheres.forEach(sphereId => {
      if (sphereId !== 'personal' && sphereId !== 'my_team') {
        const contextAgent: MeetingAgent = {
          agentId: `${sphereId}-reasoning`,
          role: 'participant',
          required: false
        };
        agents.push(contextAgent);
      }
    });

    return agents;
  }, []);

  /**
   * Check if a meeting type can be started
   */
  const canStartMeeting = useCallback((type: MeetingType): boolean => {
    // Cannot start if a meeting is already in progress
    if (currentMeeting && meetingUIState !== 'closed') {
      return false;
    }
    return true;
  }, [currentMeeting, meetingUIState]);

  /**
   * Start a new meeting
   * RULE: Meetings are ALWAYS explicit, never automatic
   */
  const startMeeting = useCallback((
    type: MeetingType,
    spheres: SphereId[],
    objective: string
  ) => {
    if (!canStartMeeting(type)) {
      logger.warn('Cannot start meeting: another meeting is in progress');
      return;
    }

    const agents = getMeetingAgents(type, spheres);

    const meeting: Meeting = {
      id: `meeting-${Date.now()}`,
      type,
      status: 'active',
      title: MEETING_TYPES[type].name.fr,
      objective,
      scope: spheres.join(', '),
      agents,
      spheres,
      createdAt: Date.now(),
      startedAt: Date.now(),
      trace: [{
        timestamp: Date.now(),
        agentId: 'system-orchestrator',
        action: 'meeting_started',
        content: `Meeting ${type} started with objective: ${objective}`
      }]
    };

    setCurrentMeeting(meeting);
    setMeetingUIState('open');
    setProposals([]);
    setMemoryEntries([]);
  }, [canStartMeeting, getMeetingAgents]);

  /**
   * Add a proposal
   */
  const addProposal = useCallback((
    proposal: Omit<MeetingProposal, 'id' | 'status'>
  ) => {
    const newProposal: MeetingProposal = {
      ...proposal,
      id: `proposal-${Date.now()}`,
      status: 'pending'
    };

    setProposals(prev => [...prev, newProposal]);
    setMeetingUIState('proposal_ready');
  }, []);

  /**
   * Validate proposals
   * RULE: No decision without explicit user validation
   */
  const validateProposals = useCallback((proposalIds: string[]) => {
    setProposals(prev =>
      prev.map(p =>
        proposalIds.includes(p.id)
          ? { ...p, status: 'accepted', validatedAt: Date.now() }
          : p
      )
    );

    // Add to meeting trace
    if (currentMeeting) {
      const traceEntry = {
        timestamp: Date.now(),
        agentId: 'user',
        action: 'proposals_validated',
        content: `Validated proposals: ${proposalIds.join(', ')}`
      };
      setCurrentMeeting(prev => prev ? {
        ...prev,
        trace: [...prev.trace, traceEntry]
      } : null);
    }

    setMeetingUIState('validated');
  }, [currentMeeting]);

  /**
   * Reject a proposal
   */
  const rejectProposal = useCallback((proposalId: string) => {
    setProposals(prev =>
      prev.map(p =>
        p.id === proposalId
          ? { ...p, status: 'rejected' }
          : p
      )
    );
  }, []);

  /**
   * Generate memory entries from validated proposals
   * RULE: No memory write without user consent
   */
  const generateMemoryEntries = useCallback(() => {
    if (!currentMeeting) return;

    const validatedProposals = proposals.filter(p => p.status === 'accepted');
    const rejectedProposals = proposals.filter(p => p.status === 'rejected');

    const entries: PostMeetingMemoryEntry[] = [];

    // Summary entry
    entries.push({
      id: `mem-${Date.now()}-summary`,
      type: 'summary',
      content: `Meeting ${currentMeeting.type}: ${currentMeeting.objective}. ${validatedProposals.length} proposals validated.`,
      meetingId: currentMeeting.id,
      meetingType: currentMeeting.type,
      proposedDestination: { destination: 'personal' },
      state: 'draft',
      createdAt: Date.now()
    });

    // Decision entries
    validatedProposals.forEach(p => {
      entries.push({
        id: `mem-${Date.now()}-decision-${p.id}`,
        type: 'decision',
        content: `${p.title}: ${p.content}`,
        meetingId: currentMeeting.id,
        meetingType: currentMeeting.type,
        proposedDestination: { destination: currentMeeting.spheres[0] as any },
        state: 'draft',
        createdAt: Date.now()
      });
    });

    // Rejected proposals (for audit trail)
    if (rejectedProposals.length > 0) {
      entries.push({
        id: `mem-${Date.now()}-rejected`,
        type: 'rejected_proposal',
        content: `Rejected: ${rejectedProposals.map(p => p.title).join(', ')}`,
        meetingId: currentMeeting.id,
        meetingType: currentMeeting.type,
        proposedDestination: { destination: 'personal' },
        state: 'draft',
        createdAt: Date.now()
      });
    }

    setMemoryEntries(entries);
  }, [currentMeeting, proposals]);

  /**
   * Validate memory entries for storage
   */
  const validateMemoryEntries = useCallback((entryIds: string[]) => {
    setMemoryEntries(prev =>
      prev.map(e =>
        entryIds.includes(e.id)
          ? { ...e, state: 'approved', validatedAt: Date.now() }
          : e
      )
    );
  }, []);

  /**
   * Reject a memory entry
   */
  const rejectMemoryEntry = useCallback((entryId: string) => {
    setMemoryEntries(prev => prev.filter(e => e.id !== entryId));
  }, []);

  /**
   * Close the meeting
   */
  const closeMeeting = useCallback(() => {
    if (currentMeeting) {
      setCurrentMeeting(prev => prev ? {
        ...prev,
        status: 'completed',
        endedAt: Date.now()
      } : null);
    }
    setMeetingUIState('closed');
  }, [currentMeeting]);

  return {
    currentMeeting,
    meetingUIState,
    proposals,
    memoryEntries,
    startMeeting,
    closeMeeting,
    addProposal,
    validateProposals,
    rejectProposal,
    generateMemoryEntries,
    validateMemoryEntries,
    rejectMemoryEntry,
    canStartMeeting,
    getMeetingAgents
  };
}

export default useMeeting;
