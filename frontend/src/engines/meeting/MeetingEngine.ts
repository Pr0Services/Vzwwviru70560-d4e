/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — MEETING ENGINE                                        ║
 * ║              Knowledge Event Management System                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Meetings are KNOWLEDGE EVENTS that generate structured, actionable,        ║
 * ║   and replayable artifacts."                                                 ║
 * ║  "Time spent in meetings should compound, not evaporate."                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import {
  Meeting,
  MeetingType,
  MeetingStatus,
  MeetingPhase,
  MeetingParticipant,
  ParticipantRole,
  ParticipantStatus,
  AgendaItem,
  MeetingAgenda,
  TranscriptSegment,
  MeetingNotes,
  MeetingDecision,
  DecisionStatus,
  MeetingTask,
  MeetingSummaries,
  MeetingRecording,
  MeetingFollowUp,
  AgentContribution,
  MeetingGovernance,
  MeetingCreationRequest,
  MeetingQuery,
  StandupEntry,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class NoteEngine {
  /**
   * Process raw transcript into structured notes
   */
  processTranscript(segments: TranscriptSegment[]): MeetingNotes {
    // Group by speaker
    const speakerContributions = this.groupBySpeaker(segments);
    
    // Extract topics
    const topicSummaries = this.extractTopics(segments);
    
    // Find key moments
    const keyMoments = this.findKeyMoments(segments);
    
    // Generate structured notes
    const structuredNotes = this.generateStructuredNotes(segments, topicSummaries);
    
    return {
      raw_transcript: segments,
      structured_notes: structuredNotes,
      topic_summaries: topicSummaries,
      speaker_contributions: speakerContributions,
      key_moments: keyMoments,
    };
  }
  
  /**
   * Add transcript segment in real-time
   */
  addSegment(notes: MeetingNotes, segment: TranscriptSegment): MeetingNotes {
    notes.raw_transcript.push(segment);
    
    // Update speaker contribution
    const existing = notes.speaker_contributions.find(
      sc => sc.speaker_id === segment.speaker_id
    );
    
    if (existing) {
      const duration = new Date(segment.end_time).getTime() - new Date(segment.start_time).getTime();
      existing.total_speaking_time_seconds += duration / 1000;
    } else {
      const duration = new Date(segment.end_time).getTime() - new Date(segment.start_time).getTime();
      notes.speaker_contributions.push({
        speaker_id: segment.speaker_id,
        speaker_name: segment.speaker_name,
        total_speaking_time_seconds: duration / 1000,
        key_points: [],
        questions_raised: [],
      });
    }
    
    // Check for key moment
    if (segment.is_decision_related || segment.is_task_related) {
      notes.key_moments.push({
        timestamp: segment.start_time,
        type: segment.is_decision_related ? 'decision' : 'action',
        content: segment.text,
        speaker_id: segment.speaker_id,
      });
    }
    
    return notes;
  }
  
  private groupBySpeaker(segments: TranscriptSegment[]) {
    const groups = new Map<string, {
      speaker_id: string;
      speaker_name: string;
      total_speaking_time_seconds: number;
      segments: TranscriptSegment[];
    }>();
    
    segments.forEach(seg => {
      if (!groups.has(seg.speaker_id)) {
        groups.set(seg.speaker_id, {
          speaker_id: seg.speaker_id,
          speaker_name: seg.speaker_name,
          total_speaking_time_seconds: 0,
          segments: [],
        });
      }
      
      const group = groups.get(seg.speaker_id)!;
      const duration = new Date(seg.end_time).getTime() - new Date(seg.start_time).getTime();
      group.total_speaking_time_seconds += duration / 1000;
      group.segments.push(seg);
    });
    
    return Array.from(groups.values()).map(g => ({
      speaker_id: g.speaker_id,
      speaker_name: g.speaker_name,
      total_speaking_time_seconds: g.total_speaking_time_seconds,
      key_points: this.extractKeyPoints(g.segments),
      questions_raised: this.extractQuestions(g.segments),
    }));
  }
  
  private extractTopics(segments: TranscriptSegment[]) {
    // Simple topic extraction based on segment topics
    const topicMap = new Map<string, {
      topic: string;
      segments: TranscriptSegment[];
      speakers: Set<string>;
    }>();
    
    segments.forEach(seg => {
      (seg.topics || ['General Discussion']).forEach(topic => {
        if (!topicMap.has(topic)) {
          topicMap.set(topic, { topic, segments: [], speakers: new Set() });
        }
        const entry = topicMap.get(topic)!;
        entry.segments.push(seg);
        entry.speakers.add(seg.speaker_name);
      });
    });
    
    return Array.from(topicMap.values()).map(entry => ({
      topic: entry.topic,
      summary: this.summarizeSegments(entry.segments),
      speakers: Array.from(entry.speakers),
      key_points: this.extractKeyPoints(entry.segments),
    }));
  }
  
  private findKeyMoments(segments: TranscriptSegment[]) {
    return segments
      .filter(s => s.is_decision_related || s.is_task_related)
      .map(s => ({
        timestamp: s.start_time,
        type: s.is_decision_related ? 'decision' as const : 'action' as const,
        content: s.text,
        speaker_id: s.speaker_id,
      }));
  }
  
  private generateStructuredNotes(segments: TranscriptSegment[], topics: unknown[]): string {
    let notes = '# Meeting Notes\n\n';
    
    topics.forEach(topic => {
      notes += `## ${topic.topic}\n\n`;
      notes += `${topic.summary}\n\n`;
      
      if (topic.key_points.length > 0) {
        notes += '### Key Points\n';
        topic.key_points.forEach((point: string) => {
          notes += `- ${point}\n`;
        });
        notes += '\n';
      }
    });
    
    return notes;
  }
  
  private extractKeyPoints(segments: TranscriptSegment[]): string[] {
    // In production, would use NLP
    return segments
      .filter(s => s.text.length > 50)
      .slice(0, 3)
      .map(s => s.text.substring(0, 100) + '...');
  }
  
  private extractQuestions(segments: TranscriptSegment[]): string[] {
    return segments
      .filter(s => s.text.includes('?'))
      .map(s => s.text);
  }
  
  private summarizeSegments(segments: TranscriptSegment[]): string {
    // In production, would use AI summarization
    if (segments.length === 0) return '';
    const text = segments.map(s => s.text).join(' ');
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class DecisionEngine {
  private decisionPatterns = [
    /we('ve)? decided/i,
    /let's go with/i,
    /the decision is/i,
    /we('ll)? proceed with/i,
    /agreed to/i,
    /approved/i,
    /we('re)? going to/i,
    /final decision/i,
  ];
  
  /**
   * Detect decisions from transcript
   */
  detectDecisions(segments: TranscriptSegment[]): Partial<MeetingDecision>[] {
    const decisions: Partial<MeetingDecision>[] = [];
    
    segments.forEach(segment => {
      if (this.isDecisionStatement(segment.text)) {
        decisions.push({
          id: generateId('dec'),
          title: this.extractDecisionTitle(segment.text),
          description: segment.text,
          proposed_by: segment.speaker_id,
          proposed_at: segment.start_time,
          status: 'proposed',
        });
      }
    });
    
    return decisions;
  }
  
  /**
   * Create a confirmed decision
   */
  createDecision(
    meetingId: string,
    title: string,
    description: string,
    proposedBy: string,
    options?: Partial<MeetingDecision>
  ): MeetingDecision {
    return {
      id: generateId('dec'),
      meeting_id: meetingId,
      title,
      description,
      rationale: options?.rationale,
      agenda_item_id: options?.agenda_item_id,
      related_thread_id: options?.related_thread_id,
      proposed_by: proposedBy,
      approved_by: options?.approved_by || [proposedBy],
      affected_participants: options?.affected_participants || [],
      status: 'confirmed',
      proposed_at: now(),
      confirmed_at: now(),
      implementation_tasks: options?.implementation_tasks || [],
      deadline: options?.deadline,
    };
  }
  
  /**
   * Update decision status
   */
  updateStatus(decision: MeetingDecision, status: DecisionStatus, approvedBy?: string): MeetingDecision {
    decision.status = status;
    
    if (status === 'confirmed' || status === 'approved') {
      decision.confirmed_at = now();
      if (approvedBy && !decision.approved_by.includes(approvedBy)) {
        decision.approved_by.push(approvedBy);
      }
    }
    
    return decision;
  }
  
  /**
   * Check for conflicts with previous decisions
   */
  checkConflicts(newDecision: MeetingDecision, existingDecisions: MeetingDecision[]): string[] {
    const conflicts: string[] = [];
    
    // Simple keyword-based conflict detection
    // In production, would use semantic similarity
    const newKeywords = this.extractKeywords(newDecision.title + ' ' + newDecision.description);
    
    existingDecisions.forEach(existing => {
      if (existing.status === 'confirmed' || existing.status === 'approved') {
        const existingKeywords = this.extractKeywords(existing.title + ' ' + existing.description);
        const overlap = newKeywords.filter(k => existingKeywords.includes(k));
        
        if (overlap.length > 2) {
          conflicts.push(existing.id);
        }
      }
    });
    
    return conflicts;
  }
  
  private isDecisionStatement(text: string): boolean {
    return this.decisionPatterns.some(pattern => pattern.test(text));
  }
  
  private extractDecisionTitle(text: string): string {
    // Simple extraction - take first 50 chars
    const cleaned = text.replace(/^(we('ve)? decided|let's go with|the decision is)/i, '').trim();
    return cleaned.substring(0, 50) + (cleaned.length > 50 ? '...' : '');
  }
  
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    return text.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4)
      .filter(w => !['about', 'would', 'could', 'should', 'there', 'where', 'which'].includes(w));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK EXTRACTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class TaskExtractionEngine {
  private actionPatterns = [
    { pattern: /(\w+) will (.*)/i, assigneeGroup: 1, taskGroup: 2 },
    { pattern: /(\w+) needs to (.*)/i, assigneeGroup: 1, taskGroup: 2 },
    { pattern: /(\w+) should (.*)/i, assigneeGroup: 1, taskGroup: 2 },
    { pattern: /action item:?\s*(.*)/i, taskGroup: 1 },
    { pattern: /todo:?\s*(.*)/i, taskGroup: 1 },
    { pattern: /let's have (\w+) (.*)/i, assigneeGroup: 1, taskGroup: 2 },
  ];
  
  private deadlinePatterns = [
    /by (tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /by (next week|end of week|eow|eod)/i,
    /by (\d{1,2}\/\d{1,2})/i,
    /deadline:?\s*(\S+)/i,
  ];
  
  /**
   * Extract tasks from transcript
   */
  extractTasks(segments: TranscriptSegment[], meetingId: string): Partial<MeetingTask>[] {
    const tasks: Partial<MeetingTask>[] = [];
    
    segments.forEach(segment => {
      const extracted = this.extractFromText(segment.text, segment.speaker_id);
      if (extracted) {
        tasks.push({
          id: generateId('task'),
          meeting_id: meetingId,
          ...extracted,
          source_transcript_id: segment.id,
          extraction_confidence: 0.7,
          manually_confirmed: false,
          status: 'pending',
          priority: 'normal',
          dependencies: [],
          blocks: [],
        });
      }
    });
    
    return tasks;
  }
  
  /**
   * Create confirmed task
   */
  createTask(
    meetingId: string,
    title: string,
    assignedTo: string,
    assignedToName: string,
    options?: Partial<MeetingTask>
  ): MeetingTask {
    return {
      id: generateId('task'),
      meeting_id: meetingId,
      title,
      description: options?.description,
      assigned_to: assignedTo,
      assigned_to_name: assignedToName,
      assigned_by: options?.assigned_by,
      deadline: options?.deadline,
      estimated_hours: options?.estimated_hours,
      priority: options?.priority || 'normal',
      agenda_item_id: options?.agenda_item_id,
      decision_id: options?.decision_id,
      source_transcript_id: options?.source_transcript_id,
      target_dataspace_id: options?.target_dataspace_id,
      target_domain: options?.target_domain,
      dependencies: options?.dependencies || [],
      blocks: options?.blocks || [],
      status: 'pending',
      extraction_confidence: 1.0,
      manually_confirmed: true,
    };
  }
  
  /**
   * Update task status
   */
  updateTaskStatus(
    task: MeetingTask, 
    status: MeetingTask['status']
  ): MeetingTask {
    task.status = status;
    
    if (status === 'acknowledged') {
      task.acknowledged_at = now();
    } else if (status === 'completed') {
      task.completed_at = now();
    }
    
    return task;
  }
  
  private extractFromText(text: string, speakerId: string): Partial<MeetingTask> | null {
    for (const { pattern, assigneeGroup, taskGroup } of this.actionPatterns) {
      const match = text.match(pattern);
      if (match) {
        const title = taskGroup ? match[taskGroup] : match[0];
        const assignee = assigneeGroup ? match[assigneeGroup] : speakerId;
        
        return {
          title: title.substring(0, 100),
          assigned_to: assignee,
          assigned_to_name: assignee,
          deadline: this.extractDeadline(text),
        };
      }
    }
    
    return null;
  }
  
  private extractDeadline(text: string): string | undefined {
    for (const pattern of this.deadlinePatterns) {
      const match = text.match(pattern);
      if (match) {
        // In production, would parse to actual date
        return match[1];
      }
    }
    return undefined;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class SummaryEngine {
  /**
   * Generate all summary types
   */
  generateSummaries(meeting: Meeting): MeetingSummaries {
    return {
      micro: this.generateMicroSummary(meeting),
      executive: this.generateExecutiveSummary(meeting),
      technical: this.generateTechnicalSummary(meeting),
      task_summary: this.generateTaskSummary(meeting),
      risk_summary: this.generateRiskSummary(meeting),
      decision_summary: this.generateDecisionSummary(meeting),
      generated_at: now(),
      generator_version: '1.0.0',
    };
  }
  
  private generateMicroSummary(meeting: Meeting): string {
    const decisionCount = meeting.decisions.length;
    const taskCount = meeting.tasks.length;
    const participantCount = meeting.participants.filter(p => p.status === 'attended').length;
    
    return `${meeting.title} with ${participantCount} participants: ${decisionCount} decisions made, ${taskCount} tasks assigned.`;
  }
  
  private generateExecutiveSummary(meeting: Meeting): string {
    const decisions = meeting.decisions.filter(d => d.status === 'confirmed' || d.status === 'approved');
    const tasks = meeting.tasks.filter(t => t.status !== 'cancelled');
    
    let summary = `Meeting "${meeting.title}" took place on ${new Date(meeting.scheduled_start).toLocaleDateString()}. `;
    
    if (decisions.length > 0) {
      summary += `Key decisions include: ${decisions.map(d => d.title).slice(0, 3).join(', ')}. `;
    }
    
    if (tasks.length > 0) {
      summary += `${tasks.length} action items were identified. `;
    }
    
    return summary;
  }
  
  private generateTechnicalSummary(meeting: Meeting): string {
    const technicalDecisions = meeting.decisions.filter(d => 
      d.title.toLowerCase().includes('technical') ||
      d.description.toLowerCase().includes('architecture') ||
      d.description.toLowerCase().includes('implementation')
    );
    
    if (technicalDecisions.length === 0) {
      return 'No technical decisions were made in this meeting.';
    }
    
    return `Technical decisions:\n${technicalDecisions.map(d => `- ${d.title}: ${d.description}`).join('\n')}`;
  }
  
  private generateTaskSummary(meeting: Meeting): string {
    const tasks = meeting.tasks.filter(t => t.status !== 'cancelled');
    
    if (tasks.length === 0) {
      return 'No action items were identified.';
    }
    
    const byPriority = {
      urgent: tasks.filter(t => t.priority === 'urgent'),
      high: tasks.filter(t => t.priority === 'high'),
      normal: tasks.filter(t => t.priority === 'normal'),
      low: tasks.filter(t => t.priority === 'low'),
    };
    
    let summary = `## Action Items (${tasks.length} total)\n\n`;
    
    for (const [priority, priorityTasks] of Object.entries(byPriority)) {
      if (priorityTasks.length > 0) {
        summary += `### ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority\n`;
        priorityTasks.forEach(t => {
          summary += `- [ ] ${t.title} (${t.assigned_to_name})`;
          if (t.deadline) summary += ` - Due: ${t.deadline}`;
          summary += '\n';
        });
        summary += '\n';
      }
    }
    
    return summary;
  }
  
  private generateRiskSummary(meeting: Meeting): string {
    // In production, would extract risks from notes
    const riskMoments = meeting.notes.key_moments.filter(m => m.type === 'concern');
    
    if (riskMoments.length === 0) {
      return 'No significant risks were identified.';
    }
    
    return `## Identified Risks\n${riskMoments.map(r => `- ${r.content}`).join('\n')}`;
  }
  
  private generateDecisionSummary(meeting: Meeting): string {
    const decisions = meeting.decisions;
    
    if (decisions.length === 0) {
      return 'No formal decisions were recorded.';
    }
    
    let summary = `## Decisions Made (${decisions.length})\n\n`;
    
    decisions.forEach((d, i) => {
      summary += `### ${i + 1}. ${d.title}\n`;
      summary += `**Status:** ${d.status}\n`;
      summary += `**Description:** ${d.description}\n`;
      if (d.rationale) summary += `**Rationale:** ${d.rationale}\n`;
      summary += `**Proposed by:** ${d.proposed_by}\n`;
      if (d.deadline) summary += `**Deadline:** ${d.deadline}\n`;
      summary += '\n';
    });
    
    return summary;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MEETING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class MeetingEngine {
  private meetings: Map<string, Meeting> = new Map();
  private noteEngine: NoteEngine;
  private decisionEngine: DecisionEngine;
  private taskEngine: TaskExtractionEngine;
  private summaryEngine: SummaryEngine;
  
  constructor() {
    this.noteEngine = new NoteEngine();
    this.decisionEngine = new DecisionEngine();
    this.taskEngine = new TaskExtractionEngine();
    this.summaryEngine = new SummaryEngine();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MEETING LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Phase 1: Create meeting (Initiation)
   */
  async create(request: MeetingCreationRequest, userId: string): Promise<Meeting> {
    const id = generateId('mtg');
    const dataspaceId = generateId('ds');
    const timestamp = now();
    
    // Create participants
    const participants: MeetingParticipant[] = request.participant_ids.map((pid, idx) => ({
      id: generateId('part'),
      user_id: pid,
      name: `Participant ${idx + 1}`, // Would lookup actual name
      role: idx === 0 ? 'organizer' : 'required',
      status: 'pending',
      is_agent: false,
    }));
    
    // Add organizer if not in list
    if (!request.participant_ids.includes(userId)) {
      participants.unshift({
        id: generateId('part'),
        user_id: userId,
        name: 'Organizer',
        role: 'organizer',
        status: 'accepted',
        is_agent: false,
      });
    }
    
    // Create agenda
    const agendaItems: AgendaItem[] = (request.agenda_items || []).map((item, idx) => ({
      id: generateId('agenda'),
      title: item.title,
      description: item.description,
      duration_minutes: item.duration_minutes,
      presenter_id: item.presenter_id,
      order: idx,
      status: 'pending',
      attached_documents: [],
      related_decisions: [],
      related_tasks: [],
    }));
    
    const meeting: Meeting = {
      id,
      dataspace_id: dataspaceId,
      title: request.title,
      description: request.description,
      type: request.type,
      status: 'scheduled',
      phase: 'initiation',
      
      scheduled_start: request.scheduled_start,
      scheduled_end: request.scheduled_end,
      duration_minutes: Math.round(
        (new Date(request.scheduled_end).getTime() - new Date(request.scheduled_start).getTime()) / 60000
      ),
      timezone: request.timezone || 'America/Montreal',
      
      sphere_id: request.sphere_id,
      domain_ids: request.domain_ids || [],
      project_id: request.project_id,
      related_thread_ids: request.related_thread_ids || [],
      related_dataspace_ids: [],
      
      participants,
      organizer_id: userId,
      
      agenda: {
        items: agendaItems,
        total_planned_minutes: agendaItems.reduce((sum, a) => sum + a.duration_minutes, 0),
        auto_generated_items: [],
        agent_suggested_items: [],
      },
      
      notes: {
        raw_transcript: [],
        structured_notes: '',
        topic_summaries: [],
        speaker_contributions: [],
        key_moments: [],
      },
      
      decisions: [],
      tasks: [],
      recordings: [],
      attachments: [],
      
      follow_up: {
        triggered_workflows: [],
        scheduled_followups: [],
        pending_actions: [],
        completion_tracking: {
          total_tasks: 0,
          completed_tasks: 0,
          overdue_tasks: 0,
          total_decisions: 0,
          implemented_decisions: 0,
        },
      },
      
      agent_contributions: [],
      
      governance: {
        can_record: request.enable_recording || false,
        can_share_externally: false,
        requires_consent: true,
        consent_records: [],
        audit_trail: [{
          action: 'meeting_created',
          actor_id: userId,
          timestamp,
        }],
        retention_policy: {
          auto_archive_after_days: 90,
        },
      },
      
      created_at: timestamp,
      created_by: userId,
      updated_at: timestamp,
    };
    
    // Store
    this.meetings.set(id, meeting);
    
    return meeting;
  }
  
  /**
   * Phase 2: Prepare meeting
   */
  async prepare(meetingId: string): Promise<Meeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    meeting.phase = 'preparation';
    meeting.status = 'preparing';
    meeting.updated_at = now();
    
    // Add agent suggestions (would be from AI in production)
    meeting.agenda.agent_suggested_items = this.generateAgentSuggestions(meeting);
    
    meeting.governance.audit_trail.push({
      action: 'preparation_started',
      actor_id: 'system',
      timestamp: now(),
    });
    
    return meeting;
  }
  
  /**
   * Phase 3: Start meeting (Execution)
   */
  async start(meetingId: string, userId: string): Promise<Meeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    meeting.phase = 'execution';
    meeting.status = 'in_progress';
    meeting.actual_start = now();
    meeting.updated_at = now();
    
    // Mark participant as joined
    const participant = meeting.participants.find(p => p.user_id === userId);
    if (participant) {
      participant.joined_at = now();
      participant.status = 'attended';
    }
    
    meeting.governance.audit_trail.push({
      action: 'meeting_started',
      actor_id: userId,
      timestamp: now(),
    });
    
    return meeting;
  }
  
  /**
   * Add transcript segment during meeting
   */
  addTranscript(meetingId: string, segment: Omit<TranscriptSegment, 'id'>): Meeting {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    const fullSegment: TranscriptSegment = {
      ...segment,
      id: generateId('ts'),
    };
    
    // Process through note engine
    this.noteEngine.addSegment(meeting.notes, fullSegment);
    
    // Check for decisions
    const decisions = this.decisionEngine.detectDecisions([fullSegment]);
    decisions.forEach(d => {
      meeting.decisions.push(d as MeetingDecision);
    });
    
    // Check for tasks
    const tasks = this.taskEngine.extractTasks([fullSegment], meetingId);
    tasks.forEach(t => {
      meeting.tasks.push(t as MeetingTask);
    });
    
    meeting.updated_at = now();
    
    return meeting;
  }
  
  /**
   * Phase 4: End meeting (Conclusion)
   */
  async end(meetingId: string, userId: string): Promise<Meeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    meeting.phase = 'conclusion';
    meeting.status = 'concluding';
    meeting.actual_end = now();
    meeting.updated_at = now();
    
    // Mark participant as left
    const participant = meeting.participants.find(p => p.user_id === userId);
    if (participant) {
      participant.left_at = now();
    }
    
    // Generate summaries
    meeting.summaries = this.summaryEngine.generateSummaries(meeting);
    
    meeting.governance.audit_trail.push({
      action: 'meeting_ended',
      actor_id: userId,
      timestamp: now(),
    });
    
    return meeting;
  }
  
  /**
   * Phase 5: Complete meeting (Integration)
   */
  async complete(meetingId: string): Promise<Meeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    meeting.phase = 'integration';
    meeting.status = 'completed';
    meeting.updated_at = now();
    
    // Update follow-up tracking
    meeting.follow_up.completion_tracking = {
      total_tasks: meeting.tasks.length,
      completed_tasks: meeting.tasks.filter(t => t.status === 'completed').length,
      overdue_tasks: 0, // Would calculate based on deadlines
      total_decisions: meeting.decisions.length,
      implemented_decisions: meeting.decisions.filter(d => d.status === 'implemented').length,
    };
    
    meeting.governance.audit_trail.push({
      action: 'meeting_completed',
      actor_id: 'system',
      timestamp: now(),
    });
    
    return meeting;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DECISIONS & TASKS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add confirmed decision
   */
  addDecision(meetingId: string, decision: Omit<MeetingDecision, 'id' | 'meeting_id'>): MeetingDecision {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    const fullDecision: MeetingDecision = {
      ...decision,
      id: generateId('dec'),
      meeting_id: meetingId,
    };
    
    meeting.decisions.push(fullDecision);
    meeting.updated_at = now();
    
    return fullDecision;
  }
  
  /**
   * Add confirmed task
   */
  addTask(meetingId: string, task: Omit<MeetingTask, 'id' | 'meeting_id'>): MeetingTask {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    const fullTask: MeetingTask = {
      ...task,
      id: generateId('task'),
      meeting_id: meetingId,
    };
    
    meeting.tasks.push(fullTask);
    meeting.updated_at = now();
    
    return fullTask;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PARTICIPANTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Update participant status
   */
  updateParticipantStatus(
    meetingId: string, 
    participantId: string, 
    status: ParticipantStatus
  ): Meeting {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    const participant = meeting.participants.find(p => p.id === participantId);
    if (participant) {
      participant.status = status;
      meeting.updated_at = now();
    }
    
    return meeting;
  }
  
  /**
   * Record consent
   */
  recordConsent(
    meetingId: string, 
    participantId: string, 
    consentType: 'recording' | 'sharing' | 'ai_processing',
    granted: boolean
  ): Meeting {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');
    
    meeting.governance.consent_records.push({
      participant_id: participantId,
      consent_type: consentType,
      granted,
      timestamp: now(),
    });
    
    const participant = meeting.participants.find(p => p.id === participantId);
    if (participant && consentType === 'recording') {
      participant.recording_consent = granted;
      participant.consent_timestamp = now();
    }
    
    meeting.updated_at = now();
    
    return meeting;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // QUERIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get meeting by ID
   */
  get(meetingId: string): Meeting | null {
    return this.meetings.get(meetingId) || null;
  }
  
  /**
   * Query meetings
   */
  query(query: MeetingQuery): { meetings: Meeting[]; total: number } {
    let results = Array.from(this.meetings.values());
    
    if (query.sphere_id) {
      results = results.filter(m => m.sphere_id === query.sphere_id);
    }
    
    if (query.domain_id) {
      results = results.filter(m => m.domain_ids.includes(query.domain_id!));
    }
    
    if (query.type) {
      results = results.filter(m => m.type === query.type);
    }
    
    if (query.status) {
      results = results.filter(m => m.status === query.status);
    }
    
    if (query.participant_id) {
      results = results.filter(m => 
        m.participants.some(p => p.user_id === query.participant_id)
      );
    }
    
    if (query.organizer_id) {
      results = results.filter(m => m.organizer_id === query.organizer_id);
    }
    
    if (query.search_text) {
      const lower = query.search_text.toLowerCase();
      results = results.filter(m => 
        m.title.toLowerCase().includes(lower) ||
        m.description?.toLowerCase().includes(lower)
      );
    }
    
    // Sort
    const sortBy = query.sort_by || 'scheduled_start';
    const sortOrder = query.sort_order || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'scheduled_start':
          comparison = new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime();
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    const total = results.length;
    
    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    results = results.slice(offset, offset + limit);
    
    return { meetings: results, total };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateAgentSuggestions(meeting: Meeting): AgendaItem[] {
    // In production, would use AI to suggest agenda items based on context
    return [];
  }
  
  /**
   * Get engine statistics
   */
  getStats(): {
    total_meetings: number;
    by_status: Record<string, number>;
    by_type: Record<string, number>;
    total_decisions: number;
    total_tasks: number;
  } {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalDecisions = 0;
    let totalTasks = 0;
    
    this.meetings.forEach(m => {
      byStatus[m.status] = (byStatus[m.status] || 0) + 1;
      byType[m.type] = (byType[m.type] || 0) + 1;
      totalDecisions += m.decisions.length;
      totalTasks += m.tasks.length;
    });
    
    return {
      total_meetings: this.meetings.size,
      by_status: byStatus,
      by_type: byType,
      total_decisions: totalDecisions,
      total_tasks: totalTasks,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default MeetingEngine;
