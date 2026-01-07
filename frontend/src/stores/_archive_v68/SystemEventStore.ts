/**
 * CHE·NU V51 — SYSTEM EVENT STORE
 * ================================
 * 
 * Every meaningful action emits a visible system event.
 * Events are APPEND-ONLY and NEVER hidden.
 * 
 * PRINCIPLE: "If it happened, it's logged. If it's logged, it's visible."
 */

// ============================================
// EVENT TYPES
// ============================================

export type EventSeverity = 'info' | 'warning' | 'critical';
export type EventActor = 'user' | 'system' | 'agent' | 'presenter';

export interface SystemEvent {
  event_id: string;
  event_type: string;
  timestamp: string;
  actor: EventActor;
  module_id?: string;
  severity: EventSeverity;
  payload?: Record<string, unknown>;
}

// ============================================
// REQUIRED EVENT TYPES
// ============================================

export const REQUIRED_EVENT_TYPES = [
  'module_entered',
  'module_exited',
  'ui_mode_changed',
  'proposal_created',
  'proposal_approved',
  'proposal_discarded',
  'incident_mode_activated',
  'export_print_triggered'
] as const;

// ============================================
// SYSTEM EVENT STORE
// ============================================

export class SystemEventStore {
  private events: SystemEvent[] = [];
  private listeners: Set<(event: SystemEvent) => void> = new Set();
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.emit('system_init', 'system', undefined, 'info', {
      session_id: sessionId,
      app_version: 'V51',
      timestamp: new Date().toISOString()
    });
  }

  // ----------------------------------------
  // EMIT EVENT (APPEND-ONLY)
  // ----------------------------------------

  emit(
    event_type: string,
    actor: EventActor,
    module_id?: string,
    severity: EventSeverity = 'info',
    payload?: Record<string, unknown>
  ): SystemEvent {
    const event: SystemEvent = {
      event_id: this.generateEventId(),
      event_type,
      timestamp: new Date().toISOString(),
      actor,
      module_id,
      severity,
      payload
    };

    // APPEND-ONLY: Events cannot be modified or deleted
    this.events.push(Object.freeze(event));

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('Event listener error:', e);
      }
    });

    return event;
  }

  // ----------------------------------------
  // QUERY EVENTS (READ-ONLY)
  // ----------------------------------------

  getAll(): readonly SystemEvent[] {
    return Object.freeze([...this.events]);
  }

  getByType(event_type: string): readonly SystemEvent[] {
    return Object.freeze(this.events.filter(e => e.event_type === event_type));
  }

  getBySeverity(severity: EventSeverity): readonly SystemEvent[] {
    return Object.freeze(this.events.filter(e => e.severity === severity));
  }

  getByModule(module_id: string): readonly SystemEvent[] {
    return Object.freeze(this.events.filter(e => e.module_id === module_id));
  }

  getByActor(actor: EventActor): readonly SystemEvent[] {
    return Object.freeze(this.events.filter(e => e.actor === actor));
  }

  getByDateRange(from: string, to: string): readonly SystemEvent[] {
    return Object.freeze(
      this.events.filter(e => e.timestamp >= from && e.timestamp <= to)
    );
  }

  getRecent(count: number): readonly SystemEvent[] {
    return Object.freeze(this.events.slice(-count));
  }

  getById(event_id: string): SystemEvent | undefined {
    return this.events.find(e => e.event_id === event_id);
  }

  // ----------------------------------------
  // STATISTICS
  // ----------------------------------------

  getStats(): EventStoreStats {
    const byType: Record<string, number> = {};
    const bySeverity: Record<EventSeverity, number> = { info: 0, warning: 0, critical: 0 };
    const byActor: Record<EventActor, number> = { user: 0, system: 0, agent: 0, presenter: 0 };

    for (const event of this.events) {
      byType[event.event_type] = (byType[event.event_type] || 0) + 1;
      bySeverity[event.severity]++;
      byActor[event.actor]++;
    }

    return {
      total_events: this.events.length,
      events_by_type: byType,
      events_by_severity: bySeverity,
      events_by_actor: byActor,
      first_timestamp: this.events[0]?.timestamp,
      last_timestamp: this.events[this.events.length - 1]?.timestamp,
      session_id: this.sessionId
    };
  }

  // ----------------------------------------
  // LISTENERS
  // ----------------------------------------

  subscribe(listener: (event: SystemEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ----------------------------------------
  // EXPORT (FOR INCIDENT MODE)
  // ----------------------------------------

  exportToJSON(): string {
    return JSON.stringify({
      session_id: this.sessionId,
      exported_at: new Date().toISOString(),
      event_count: this.events.length,
      events: this.events
    }, null, 2);
  }

  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ----------------------------------------
  // SESSION INFO
  // ----------------------------------------

  getSessionId(): string {
    return this.sessionId;
  }

  getEventCount(): number {
    return this.events.length;
  }
}

// ============================================
// STATISTICS TYPE
// ============================================

export interface EventStoreStats {
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_severity: Record<EventSeverity, number>;
  events_by_actor: Record<EventActor, number>;
  first_timestamp?: string;
  last_timestamp?: string;
  session_id: string;
}

// ============================================
// SINGLETON INSTANCE (FOR DEMO)
// ============================================

let globalEventStore: SystemEventStore | null = null;

export function getGlobalEventStore(): SystemEventStore {
  if (!globalEventStore) {
    globalEventStore = new SystemEventStore(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
  }
  return globalEventStore;
}

export function resetGlobalEventStore(): void {
  globalEventStore = null;
}

// ============================================
// CONVENIENCE EVENT EMITTERS
// ============================================

export function emitModuleEntered(module_id: string): SystemEvent {
  return getGlobalEventStore().emit('module_entered', 'user', module_id, 'info');
}

export function emitModuleExited(module_id: string): SystemEvent {
  return getGlobalEventStore().emit('module_exited', 'user', module_id, 'info');
}

export function emitUIModeChanged(mode: string, module_id?: string): SystemEvent {
  return getGlobalEventStore().emit('ui_mode_changed', 'user', module_id, 'info', { mode });
}

export function emitProposalCreated(proposal_id: string, module_id?: string): SystemEvent {
  return getGlobalEventStore().emit('proposal_created', 'system', module_id, 'info', { proposal_id });
}

export function emitProposalApproved(proposal_id: string, module_id?: string): SystemEvent {
  return getGlobalEventStore().emit('proposal_approved', 'user', module_id, 'info', { proposal_id });
}

export function emitProposalDiscarded(proposal_id: string, module_id?: string): SystemEvent {
  return getGlobalEventStore().emit('proposal_discarded', 'user', module_id, 'info', { proposal_id });
}

export function emitIncidentModeActivated(): SystemEvent {
  return getGlobalEventStore().emit('incident_mode_activated', 'user', 'incident_room', 'warning');
}

export function emitIncidentModeDeactivated(): SystemEvent {
  return getGlobalEventStore().emit('incident_mode_deactivated', 'user', 'incident_room', 'info');
}
