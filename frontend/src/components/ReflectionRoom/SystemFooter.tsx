/**
 * CHE·NU V51 — SYSTEM FOOTER
 * ==========================
 * 
 * Trace strip showing recent events.
 * Mode controller for light/dark_strict/incident.
 */

import React, { useState, useEffect } from 'react';
import { ModuleState } from '../../contracts/ModuleActivationContract';
import { CognitiveLoadSignals } from '../../stores/CognitiveLoadSignals';
import { getGlobalEventStore, SystemEvent } from '../../stores/SystemEventStore';

export interface SystemFooterProps {
  sessionId: string;
  moduleState: ModuleState;
  cognitiveLoad: CognitiveLoadSignals;
  uiMode: 'light' | 'dark_strict' | 'incident';
  onSetUIMode: (mode: 'light' | 'dark_strict' | 'incident') => void;
}

const SystemFooter: React.FC<SystemFooterProps> = ({
  sessionId,
  moduleState,
  cognitiveLoad,
  uiMode,
  onSetUIMode
}) => {
  const [recentEvents, setRecentEvents] = useState<SystemEvent[]>([]);

  // Subscribe to events
  useEffect(() => {
    const store = getGlobalEventStore();
    
    // Initial load
    setRecentEvents(store.getRecent(5) as SystemEvent[]);

    // Subscribe
    const unsubscribe = store.subscribe(event => {
      setRecentEvents(store.getRecent(5) as SystemEvent[]);
    });

    return unsubscribe;
  }, []);

  return (
    <footer style={getFooterStyles(uiMode)}>
      {/* Trace Strip */}
      <div style={styles.traceStrip}>
        <span style={styles.traceLabel}>Trace:</span>
        <div style={styles.events}>
          {recentEvents.map((event, i) => (
            <span 
              key={event.event_id} 
              style={{
                ...styles.event,
                opacity: 1 - (i * 0.15)
              }}
            >
              <span style={{
                ...styles.eventDot,
                backgroundColor: getSeverityColor(event.severity)
              }} />
              <span style={styles.eventType}>{event.event_type}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={styles.status}>
        <StatusItem label="Session" value={sessionId.substring(0, 12) + '...'} />
        <StatusItem label="State" value={moduleState} />
        <StatusItem label="Blocks" value={String(cognitiveLoad.active_blocks)} />
        <StatusItem label="Load" value={cognitiveLoad.load_state.toUpperCase()} />
      </div>

      {/* Mode Controller */}
      <div style={styles.modeController}>
        <ModeButton
          mode="light"
          label="☀️"
          isActive={uiMode === 'light'}
          onClick={() => onSetUIMode('light')}
        />
        <ModeButton
          mode="dark_strict"
          label="🌙"
          isActive={uiMode === 'dark_strict'}
          onClick={() => onSetUIMode('dark_strict')}
        />
        <ModeButton
          mode="incident"
          label="🚨"
          isActive={uiMode === 'incident'}
          onClick={() => onSetUIMode('incident')}
        />
      </div>
    </footer>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const StatusItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={styles.statusItem}>
    <span style={styles.statusLabel}>{label}:</span>
    <span style={styles.statusValue}>{value}</span>
  </div>
);

const ModeButton: React.FC<{
  mode: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ mode, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.modeButton,
      backgroundColor: isActive ? '#4a4a6a' : 'transparent',
      opacity: isActive ? 1 : 0.5
    }}
    title={`Switch to ${mode} mode`}
  >
    {label}
  </button>
);

// ============================================
// HELPERS
// ============================================

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#e57373';
    case 'warning': return '#ffb74d';
    case 'info': 
    default: return '#64b5f6';
  }
}

function getFooterStyles(uiMode: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    gap: '20px',
    borderTop: '1px solid',
    height: '40px',
    flexShrink: 0,
    fontSize: '11px'
  };

  switch (uiMode) {
    case 'light':
      return { ...base, backgroundColor: '#fff', borderColor: '#ddd', color: '#333' };
    case 'incident':
      return { ...base, backgroundColor: '#1a0505', borderColor: '#500', color: '#ff6b6b' };
    default:
      return { ...base, backgroundColor: '#0f0f1a', borderColor: '#333', color: '#888' };
  }
}

const styles: Record<string, React.CSSProperties> = {
  traceStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    overflow: 'hidden'
  },
  traceLabel: {
    color: '#666',
    fontWeight: 'bold'
  },
  events: {
    display: 'flex',
    gap: '15px',
    overflow: 'hidden'
  },
  event: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap'
  },
  eventDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  },
  eventType: {
    fontSize: '10px',
    fontFamily: 'monospace'
  },
  status: {
    display: 'flex',
    gap: '15px'
  },
  statusItem: {
    display: 'flex',
    gap: '5px'
  },
  statusLabel: {
    color: '#666'
  },
  statusValue: {
    fontFamily: 'monospace'
  },
  modeController: {
    display: 'flex',
    gap: '5px',
    marginLeft: '10px'
  },
  modeButton: {
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default SystemFooter;
