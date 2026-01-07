/**
 * CHE·NU V51 — INCIDENT ROOM
 * ===========================
 * 
 * Forensic visibility state for crisis investigation.
 * 
 * FEATURES:
 * - Timeline navigation of all system events
 * - Flag events for investigation
 * - Create investigation notes
 * - Export for external review
 * 
 * RULES:
 * - Trace level: FORENSIC (maximum detail)
 * - All UI in incident mode (high contrast)
 * - Full read access, no memory writes
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  INCIDENT_ROOM_CONTRACT,
  IncidentRoomState,
  Investigation,
  FlaggedEvent,
  InvestigationNote,
  createIncidentRoomState
} from '../../contracts/IncidentRoom.contract';
import {
  getGlobalEventStore,
  SystemEvent,
  emitModuleEntered,
  emitModuleExited
} from '../../stores/SystemEventStore';
import { ModuleState } from '../../contracts/ModuleActivationContract';

// ============================================
// PROPS
// ============================================

export interface IncidentRoomPageProps {
  onNavigateToModule?: (moduleId: string) => void;
  onExitIncidentMode?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const IncidentRoomPage: React.FC<IncidentRoomPageProps> = ({
  onNavigateToModule,
  onExitIncidentMode,
  className = ''
}) => {
  // State
  const [state, setState] = useState<IncidentRoomState>(() =>
    createIncidentRoomState()
  );
  const [allEvents, setAllEvents] = useState<SystemEvent[]>([]);
  const [flaggedEvents, setFlaggedEvents] = useState<FlaggedEvent[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<{
    severity?: string[];
    module?: string[];
    search?: string;
  }>({});
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Lifecycle
  useEffect(() => {
    emitModuleEntered('incident_room');
    setState(prev => ({ ...prev, module_state: ModuleState.ACTIVE }));

    // Load all events
    setAllEvents(getGlobalEventStore().getAll() as SystemEvent[]);

    // Subscribe to new events
    const unsubscribe = getGlobalEventStore().subscribe(event => {
      setAllEvents(getGlobalEventStore().getAll() as SystemEvent[]);
    });

    return () => {
      emitModuleExited('incident_room');
      unsubscribe();
    };
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    if (timelineFilter.severity && timelineFilter.severity.length > 0) {
      events = events.filter(e => timelineFilter.severity!.includes(e.severity));
    }

    if (timelineFilter.module && timelineFilter.module.length > 0) {
      events = events.filter(e => e.module_id && timelineFilter.module!.includes(e.module_id));
    }

    if (timelineFilter.search) {
      const q = timelineFilter.search.toLowerCase();
      events = events.filter(e =>
        e.event_type.toLowerCase().includes(q) ||
        JSON.stringify(e.payload).toLowerCase().includes(q)
      );
    }

    return events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [allEvents, timelineFilter]);

  // Selected event details
  const selectedEvent = useMemo(() => 
    selectedEventId ? allEvents.find(e => e.event_id === selectedEventId) : null,
    [selectedEventId, allEvents]
  );

  // Flag event
  const handleFlagEvent = useCallback((eventId: string) => {
    const event = allEvents.find(e => e.event_id === eventId);
    if (!event) return;

    const flagged: FlaggedEvent = {
      event_id: eventId,
      flagged_at: new Date().toISOString(),
      flagged_by: 'user',
      reason: 'Flagged for investigation'
    };

    setFlaggedEvents(prev => [...prev, flagged]);

    getGlobalEventStore().emit(
      'event_flagged',
      'user',
      'incident_room',
      'warning',
      { flagged_event_id: eventId }
    );
  }, [allEvents]);

  // Unflag event
  const handleUnflagEvent = useCallback((eventId: string) => {
    setFlaggedEvents(prev => prev.filter(f => f.event_id !== eventId));
  }, []);

  // Check if flagged
  const isEventFlagged = useCallback((eventId: string) => 
    flaggedEvents.some(f => f.event_id === eventId),
    [flaggedEvents]
  );

  // Create investigation
  const handleCreateInvestigation = useCallback(() => {
    const investigation: Investigation = {
      investigation_id: `inv_${Date.now()}`,
      title: `Investigation ${investigations.length + 1}`,
      created_at: new Date().toISOString(),
      status: 'open',
      flagged_events: [...flaggedEvents],
      notes: [],
      created_by: 'user'
    };

    setInvestigations(prev => [...prev, investigation]);
    setFlaggedEvents([]);

    getGlobalEventStore().emit(
      'investigation_created',
      'user',
      'incident_room',
      'info',
      { investigation_id: investigation.investigation_id }
    );
  }, [flaggedEvents, investigations]);

  // Add note to investigation
  const handleAddNote = useCallback((investigationId: string) => {
    if (!newNoteContent.trim()) return;

    const note: InvestigationNote = {
      note_id: `note_${Date.now()}`,
      content: newNoteContent.trim(),
      created_at: new Date().toISOString(),
      created_by: 'user'
    };

    setInvestigations(prev => prev.map(inv =>
      inv.investigation_id === investigationId
        ? { ...inv, notes: [...inv.notes, note] }
        : inv
    ));

    setNewNoteContent('');
    setIsAddingNote(false);
  }, [newNoteContent]);

  // Export investigation
  const handleExportInvestigation = useCallback((investigation: Investigation) => {
    const exportData = {
      ...investigation,
      events: investigation.flagged_events.map(f =>
        allEvents.find(e => e.event_id === f.event_id)
      ),
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investigation_${investigation.investigation_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allEvents]);

  return (
    <div className={`incident-room ${className}`} style={styles.container}>
      {/* Header - INCIDENT MODE STYLING */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => onNavigateToModule?.('reflection_room')}
            style={styles.backButton}
          >
            ← Sortir
          </button>
          <h1 style={styles.title}>🚨 INCIDENT ROOM</h1>
          <span style={styles.badge}>FORENSIC MODE</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.eventCount}>{allEvents.length} événements</span>
          <span style={styles.flagCount}>🚩 {flaggedEvents.length} flaggés</span>
        </div>
      </header>

      {/* Warning Banner */}
      <div style={styles.warningBanner}>
        ⚠️ MODE INCIDENT ACTIF — Trace niveau FORENSIC — Toutes les actions sont enregistrées
      </div>

      {/* Main Layout */}
      <div style={styles.main}>
        {/* Timeline */}
        <section style={styles.timeline}>
          <div style={styles.timelineHeader}>
            <h2 style={styles.sectionTitle}>Chronologie</h2>
            <input
              type="text"
              placeholder="Rechercher..."
              value={timelineFilter.search || ''}
              onChange={e => setTimelineFilter(prev => ({ ...prev, search: e.target.value }))}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterRow}>
            {['critical', 'warning', 'info'].map(sev => (
              <button
                key={sev}
                onClick={() => {
                  const current = timelineFilter.severity || [];
                  setTimelineFilter(prev => ({
                    ...prev,
                    severity: current.includes(sev)
                      ? current.filter(s => s !== sev)
                      : [...current, sev]
                  }));
                }}
                style={{
                  ...styles.filterButton,
                  backgroundColor: (timelineFilter.severity || []).includes(sev)
                    ? sev === 'critical' ? '#6a2a2a'
                    : sev === 'warning' ? '#6a5a2a'
                    : '#2a3a6a'
                    : 'transparent'
                }}
              >
                {sev}
              </button>
            ))}
          </div>

          <div style={styles.eventsList}>
            {filteredEvents.map(event => (
              <EventRow
                key={event.event_id}
                event={event}
                isSelected={event.event_id === selectedEventId}
                isFlagged={isEventFlagged(event.event_id)}
                onClick={() => setSelectedEventId(event.event_id)}
                onFlag={() => handleFlagEvent(event.event_id)}
                onUnflag={() => handleUnflagEvent(event.event_id)}
              />
            ))}
          </div>
        </section>

        {/* Detail Panel */}
        <aside style={styles.detailPanel}>
          {selectedEvent ? (
            <EventDetail
              event={selectedEvent}
              isFlagged={isEventFlagged(selectedEvent.event_id)}
              onFlag={() => handleFlagEvent(selectedEvent.event_id)}
              onUnflag={() => handleUnflagEvent(selectedEvent.event_id)}
            />
          ) : (
            <div style={styles.noSelection}>
              <span style={styles.noSelectionIcon}>🔍</span>
              <p>Sélectionnez un événement pour voir les détails</p>
            </div>
          )}
        </aside>

        {/* Investigations Panel */}
        <aside style={styles.investigationsPanel}>
          <h2 style={styles.sectionTitle}>Investigations</h2>

          {/* Create Investigation */}
          {flaggedEvents.length > 0 && (
            <button
              onClick={handleCreateInvestigation}
              style={styles.createInvestigationButton}
            >
              📋 Créer investigation ({flaggedEvents.length} events)
            </button>
          )}

          {/* Investigation List */}
          <div style={styles.investigationList}>
            {investigations.map(inv => (
              <InvestigationCard
                key={inv.investigation_id}
                investigation={inv}
                onAddNote={(id) => { setIsAddingNote(true); }}
                onExport={() => handleExportInvestigation(inv)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const EventRow: React.FC<{
  event: SystemEvent;
  isSelected: boolean;
  isFlagged: boolean;
  onClick: () => void;
  onFlag: () => void;
  onUnflag: () => void;
}> = ({ event, isSelected, isFlagged, onClick, onFlag, onUnflag }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.eventRow,
      backgroundColor: isSelected ? '#2a1a1a' : isFlagged ? '#1a1a2a' : '#1a0a0a',
      borderLeftColor: event.severity === 'critical' ? '#ff4444'
        : event.severity === 'warning' ? '#ffaa44'
        : '#4488ff'
    }}
  >
    <span style={styles.eventTime}>
      {new Date(event.timestamp).toLocaleTimeString('fr-CA', { hour12: false })}
    </span>
    <span style={styles.eventType}>{event.event_type}</span>
    <span style={styles.eventModule}>{event.module_id || '—'}</span>
    <button
      onClick={(e) => { e.stopPropagation(); isFlagged ? onUnflag() : onFlag(); }}
      style={styles.flagButton}
    >
      {isFlagged ? '🚩' : '⚪'}
    </button>
  </div>
);

const EventDetail: React.FC<{
  event: SystemEvent;
  isFlagged: boolean;
  onFlag: () => void;
  onUnflag: () => void;
}> = ({ event, isFlagged, onFlag, onUnflag }) => (
  <div style={styles.detail}>
    <div style={styles.detailHeader}>
      <h3 style={styles.detailTitle}>{event.event_type}</h3>
      <button
        onClick={isFlagged ? onUnflag : onFlag}
        style={{
          ...styles.detailFlagButton,
          backgroundColor: isFlagged ? '#6a4a4a' : '#4a4a6a'
        }}
      >
        {isFlagged ? '🚩 Unflag' : '⚪ Flag'}
      </button>
    </div>

    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>ID</span>
      <code style={styles.detailValue}>{event.event_id}</code>
    </div>

    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>Timestamp</span>
      <code style={styles.detailValue}>
        {new Date(event.timestamp).toISOString()}
      </code>
    </div>

    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>Severity</span>
      <span style={{
        ...styles.severityBadge,
        backgroundColor: event.severity === 'critical' ? '#6a2a2a'
          : event.severity === 'warning' ? '#6a5a2a'
          : '#2a3a6a'
      }}>
        {event.severity}
      </span>
    </div>

    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>Actor</span>
      <span style={styles.detailValue}>{event.actor}</span>
    </div>

    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>Module</span>
      <span style={styles.detailValue}>{event.module_id || '—'}</span>
    </div>

    <div style={styles.detailSection}>
      <span style={styles.detailLabel}>Payload</span>
      <pre style={styles.payload}>
        {JSON.stringify(event.payload, null, 2)}
      </pre>
    </div>
  </div>
);

const InvestigationCard: React.FC<{
  investigation: Investigation;
  onAddNote: (id: string) => void;
  onExport: () => void;
}> = ({ investigation, onAddNote, onExport }) => (
  <div style={styles.investigationCard}>
    <div style={styles.investigationHeader}>
      <span style={styles.investigationTitle}>{investigation.title}</span>
      <span style={{
        ...styles.investigationStatus,
        color: investigation.status === 'open' ? '#ffaa44' : '#81c784'
      }}>
        {investigation.status}
      </span>
    </div>
    <div style={styles.investigationMeta}>
      <span>{investigation.flagged_events.length} événements</span>
      <span>{investigation.notes.length} notes</span>
    </div>
    <div style={styles.investigationActions}>
      <button onClick={onExport} style={styles.smallButton}>
        📤 Export
      </button>
    </div>
  </div>
);

// ============================================
// STYLES (INCIDENT MODE - HIGH CONTRAST)
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0a0505',
    color: '#ff9999'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '2px solid #ff4444',
    backgroundColor: '#1a0505'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  headerRight: {
    display: 'flex',
    gap: '20px'
  },
  backButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#4a2a2a',
    border: '1px solid #ff4444',
    borderRadius: '4px',
    color: '#ff9999',
    cursor: 'pointer'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    color: '#ff4444'
  },
  badge: {
    fontSize: '10px',
    padding: '3px 8px',
    backgroundColor: '#ff4444',
    borderRadius: '4px',
    color: '#fff'
  },
  eventCount: {
    fontSize: '12px'
  },
  flagCount: {
    fontSize: '12px',
    color: '#ffaa44'
  },
  warningBanner: {
    padding: '10px 20px',
    backgroundColor: '#4a2a0a',
    borderBottom: '1px solid #ff8800',
    fontSize: '12px',
    textAlign: 'center',
    color: '#ffaa44'
  },
  main: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 350px 280px',
    overflow: 'hidden'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #4a2a2a',
    overflow: 'hidden'
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #3a1a1a'
  },
  sectionTitle: {
    fontSize: '14px',
    margin: 0
  },
  searchInput: {
    padding: '6px 10px',
    fontSize: '12px',
    backgroundColor: '#1a0a0a',
    border: '1px solid #4a2a2a',
    borderRadius: '4px',
    color: '#ff9999',
    width: '150px'
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    padding: '10px 15px',
    borderBottom: '1px solid #3a1a1a'
  },
  filterButton: {
    padding: '4px 10px',
    fontSize: '11px',
    border: '1px solid #4a2a2a',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#ff9999'
  },
  eventsList: {
    flex: 1,
    overflow: 'auto',
    padding: '10px'
  },
  eventRow: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr 100px 30px',
    gap: '10px',
    padding: '8px 10px',
    marginBottom: '4px',
    borderRadius: '4px',
    borderLeft: '3px solid',
    cursor: 'pointer',
    alignItems: 'center',
    fontSize: '12px'
  },
  eventTime: {
    fontFamily: 'monospace',
    color: '#888'
  },
  eventType: {
    fontFamily: 'monospace'
  },
  eventModule: {
    color: '#ff6666'
  },
  flagButton: {
    padding: '2px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  detailPanel: {
    borderRight: '1px solid #4a2a2a',
    overflow: 'auto'
  },
  noSelection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666'
  },
  noSelectionIcon: {
    fontSize: '32px',
    marginBottom: '10px'
  },
  detail: {
    padding: '15px'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  detailTitle: {
    fontSize: '14px',
    margin: 0
  },
  detailFlagButton: {
    padding: '6px 12px',
    fontSize: '11px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #2a1a1a',
    fontSize: '12px'
  },
  detailLabel: {
    color: '#888'
  },
  detailValue: {
    fontFamily: 'monospace'
  },
  severityBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  },
  detailSection: {
    marginTop: '15px'
  },
  payload: {
    padding: '10px',
    backgroundColor: '#1a0a0a',
    borderRadius: '4px',
    fontSize: '11px',
    overflow: 'auto',
    maxHeight: '200px',
    fontFamily: 'monospace',
    color: '#ff9999'
  },
  investigationsPanel: {
    padding: '15px',
    overflow: 'auto'
  },
  createInvestigationButton: {
    width: '100%',
    padding: '10px',
    marginTop: '15px',
    fontSize: '12px',
    backgroundColor: '#4a2a2a',
    border: '1px solid #ff4444',
    borderRadius: '4px',
    color: '#ff9999',
    cursor: 'pointer'
  },
  investigationList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  investigationCard: {
    padding: '12px',
    backgroundColor: '#1a0a0a',
    borderRadius: '6px',
    border: '1px solid #3a1a1a'
  },
  investigationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  investigationTitle: {
    fontSize: '13px',
    fontWeight: 'bold'
  },
  investigationStatus: {
    fontSize: '10px',
    textTransform: 'uppercase'
  },
  investigationMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '11px',
    color: '#888',
    marginBottom: '10px'
  },
  investigationActions: {
    display: 'flex',
    gap: '8px'
  },
  smallButton: {
    padding: '4px 10px',
    fontSize: '11px',
    backgroundColor: '#4a4a6a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default IncidentRoomPage;
