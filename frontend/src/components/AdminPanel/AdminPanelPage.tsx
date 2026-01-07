/**
 * CHE·NU V51 — ADMIN PANEL
 * =========================
 * 
 * System administration and governance configuration.
 * 
 * FEATURES:
 * - System status overview
 * - Module readiness check
 * - Connection management
 * - Policy configuration
 * - Event log viewer
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ADMIN_PANEL_CONTRACT,
  AdminPanelState,
  SystemStatus,
  ModuleReadiness,
  ConnectionStatus,
  createAdminPanelState,
  createSystemStatus
} from '../../contracts/AdminPanel.contract';
import {
  getGlobalEventStore,
  SystemEvent,
  emitModuleEntered,
  emitModuleExited
} from '../../stores/SystemEventStore';
import { checkStoreHealth, StoreHealthStatus } from '../../stores';
import { ModuleState } from '../../contracts/ModuleActivationContract';

// ============================================
// PROPS
// ============================================

export interface AdminPanelPageProps {
  onNavigateToModule?: (moduleId: string) => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onNavigateToModule,
  className = ''
}) => {
  // State
  const [state, setState] = useState<AdminPanelState>(() =>
    createAdminPanelState()
  );
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(() =>
    createSystemStatus()
  );
  const [storeHealth, setStoreHealth] = useState<StoreHealthStatus | null>(null);
  const [recentEvents, setRecentEvents] = useState<SystemEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'modules' | 'connections' | 'events'>('status');

  // Lifecycle
  useEffect(() => {
    emitModuleEntered('admin_panel');
    setState(prev => ({ ...prev, module_state: ModuleState.ACTIVE }));

    // Initial data load
    setStoreHealth(checkStoreHealth());
    setRecentEvents(getGlobalEventStore().getRecent(50) as SystemEvent[]);

    // Subscribe to events
    const unsubscribe = getGlobalEventStore().subscribe(event => {
      setRecentEvents(getGlobalEventStore().getRecent(50) as SystemEvent[]);
    });

    return () => {
      emitModuleExited('admin_panel');
      unsubscribe();
    };
  }, []);

  // Refresh health
  const handleRefreshHealth = () => {
    setStoreHealth(checkStoreHealth());
    setSystemStatus(createSystemStatus());
    
    getGlobalEventStore().emit(
      'health_check_performed',
      'user',
      'admin_panel',
      'info'
    );
  };

  // Export events
  const handleExportEvents = () => {
    const exportData = getGlobalEventStore().exportToJSON();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Module readiness data
  const moduleReadiness: ModuleReadiness[] = [
    { module_id: 'reflection_room', name: 'Reflection Room', status: 'ready', last_check: new Date().toISOString() },
    { module_id: 'memory_inspector', name: 'Memory Inspector', status: 'ready', last_check: new Date().toISOString() },
    { module_id: 'agent_workspace', name: 'Agent Workspace', status: 'ready', last_check: new Date().toISOString() },
    { module_id: 'admin_panel', name: 'Admin Panel', status: 'active', last_check: new Date().toISOString() },
    { module_id: 'incident_room', name: 'Incident Room', status: 'standby', last_check: new Date().toISOString() }
  ];

  // Connection status data
  const connections: ConnectionStatus[] = [
    { service: 'Local Storage', status: 'connected', latency_ms: 1 },
    { service: 'Event Store', status: 'connected', latency_ms: 0 },
    { service: 'LLM Provider', status: 'disconnected', error: 'API key not configured' },
    { service: 'Cloud Sync', status: 'disconnected', error: 'Not enabled in demo' }
  ];

  return (
    <div className={`admin-panel ${className}`} style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => onNavigateToModule?.('reflection_room')}
            style={styles.backButton}
          >
            ← Retour
          </button>
          <h1 style={styles.title}>Admin Panel</h1>
          <span style={styles.badge}>SYSTEM GOVERNANCE</span>
        </div>
        <button onClick={handleRefreshHealth} style={styles.refreshButton}>
          🔄 Actualiser
        </button>
      </header>

      {/* Tabs */}
      <nav style={styles.tabs}>
        {(['status', 'modules', 'connections', 'events'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === tab ? '#4a9eff' : 'transparent',
              color: activeTab === tab ? '#fff' : '#888'
            }}
          >
            {tab === 'status' && '📊 Statut'}
            {tab === 'modules' && '📦 Modules'}
            {tab === 'connections' && '🔗 Connexions'}
            {tab === 'events' && '📋 Événements'}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {activeTab === 'status' && (
          <StatusTab 
            systemStatus={systemStatus} 
            storeHealth={storeHealth} 
          />
        )}
        {activeTab === 'modules' && (
          <ModulesTab modules={moduleReadiness} />
        )}
        {activeTab === 'connections' && (
          <ConnectionsTab connections={connections} />
        )}
        {activeTab === 'events' && (
          <EventsTab 
            events={recentEvents} 
            onExport={handleExportEvents}
          />
        )}
      </main>
    </div>
  );
};

// ============================================
// TAB COMPONENTS
// ============================================

const StatusTab: React.FC<{
  systemStatus: SystemStatus;
  storeHealth: StoreHealthStatus | null;
}> = ({ systemStatus, storeHealth }) => (
  <div style={styles.tabContent}>
    <h2 style={styles.sectionTitle}>Vue d'ensemble du système</h2>
    
    <div style={styles.statusGrid}>
      <StatusCard
        title="Version"
        value={systemStatus.version}
        status="info"
      />
      <StatusCard
        title="Uptime"
        value={formatUptime(systemStatus.uptime_seconds)}
        status="info"
      />
      <StatusCard
        title="Santé globale"
        value={storeHealth?.overall ? 'OK' : 'Attention'}
        status={storeHealth?.overall ? 'success' : 'warning'}
      />
      <StatusCard
        title="Mode incident"
        value={systemStatus.incident_mode ? 'ACTIF' : 'Inactif'}
        status={systemStatus.incident_mode ? 'danger' : 'success'}
      />
    </div>

    <h3 style={styles.subsectionTitle}>Stores</h3>
    <div style={styles.healthGrid}>
      {storeHealth && (
        <>
          <HealthItem
            label="Event Store"
            value={`${storeHealth.eventStore.eventCount} événements`}
            healthy={storeHealth.eventStore.healthy}
          />
          <HealthItem
            label="Proposal Store"
            value={`${storeHealth.proposalStore.pendingCount} en attente`}
            healthy={storeHealth.proposalStore.healthy}
          />
          <HealthItem
            label="Profile Store"
            value={storeHealth.profileStore.hasProfile ? 'Configuré' : 'Non configuré'}
            healthy={storeHealth.profileStore.healthy}
          />
          <HealthItem
            label="Cognitive Load"
            value={storeHealth.cognitiveLoadStore.loadState}
            healthy={storeHealth.cognitiveLoadStore.healthy}
          />
        </>
      )}
    </div>

    <h3 style={styles.subsectionTitle}>Tree Laws</h3>
    <div style={styles.lawsGrid}>
      <LawStatus law="No Auto-Memory Write" enforced={true} />
      <LawStatus law="No Autonomous Decision" enforced={true} />
      <LawStatus law="Full Auditability" enforced={true} />
    </div>
  </div>
);

const ModulesTab: React.FC<{ modules: ModuleReadiness[] }> = ({ modules }) => (
  <div style={styles.tabContent}>
    <h2 style={styles.sectionTitle}>État des modules</h2>
    
    <div style={styles.moduleList}>
      {modules.map(module => (
        <div key={module.module_id} style={styles.moduleCard}>
          <div style={styles.moduleInfo}>
            <span style={styles.moduleName}>{module.name}</span>
            <code style={styles.moduleId}>{module.module_id}</code>
          </div>
          <span style={{
            ...styles.moduleStatus,
            backgroundColor: module.status === 'active' ? '#4a9eff'
              : module.status === 'ready' ? '#81c784'
              : module.status === 'standby' ? '#ffb74d'
              : '#e57373'
          }}>
            {module.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ConnectionsTab: React.FC<{ connections: ConnectionStatus[] }> = ({ connections }) => (
  <div style={styles.tabContent}>
    <h2 style={styles.sectionTitle}>État des connexions</h2>
    
    <div style={styles.connectionList}>
      {connections.map(conn => (
        <div key={conn.service} style={styles.connectionCard}>
          <div style={styles.connectionInfo}>
            <span style={styles.connectionName}>{conn.service}</span>
            {conn.latency_ms !== undefined && (
              <span style={styles.connectionLatency}>{conn.latency_ms}ms</span>
            )}
            {conn.error && (
              <span style={styles.connectionError}>{conn.error}</span>
            )}
          </div>
          <span style={{
            ...styles.connectionStatus,
            backgroundColor: conn.status === 'connected' ? '#4a6a4a'
              : conn.status === 'connecting' ? '#6a6a4a'
              : '#6a4a4a'
          }}>
            {conn.status === 'connected' ? '✓' : conn.status === 'connecting' ? '⏳' : '✗'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const EventsTab: React.FC<{
  events: SystemEvent[];
  onExport: () => void;
}> = ({ events, onExport }) => (
  <div style={styles.tabContent}>
    <div style={styles.eventsHeader}>
      <h2 style={styles.sectionTitle}>Journal des événements</h2>
      <button onClick={onExport} style={styles.exportButton}>
        📤 Exporter JSON
      </button>
    </div>
    
    <div style={styles.eventsList}>
      {events.map(event => (
        <div key={event.event_id} style={styles.eventRow}>
          <span style={{
            ...styles.eventSeverity,
            backgroundColor: event.severity === 'critical' ? '#e57373'
              : event.severity === 'warning' ? '#ffb74d'
              : '#64b5f6'
          }} />
          <span style={styles.eventTime}>
            {new Date(event.timestamp).toLocaleTimeString('fr-CA')}
          </span>
          <span style={styles.eventType}>{event.event_type}</span>
          <span style={styles.eventModule}>{event.module_id || '—'}</span>
          <span style={styles.eventActor}>{event.actor}</span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// SUB-COMPONENTS
// ============================================

const StatusCard: React.FC<{
  title: string;
  value: string;
  status: 'info' | 'success' | 'warning' | 'danger';
}> = ({ title, value, status }) => (
  <div style={{
    ...styles.statusCard,
    borderLeftColor: status === 'success' ? '#81c784'
      : status === 'warning' ? '#ffb74d'
      : status === 'danger' ? '#e57373'
      : '#4a9eff'
  }}>
    <span style={styles.cardLabel}>{title}</span>
    <span style={styles.cardValue}>{value}</span>
  </div>
);

const HealthItem: React.FC<{
  label: string;
  value: string;
  healthy: boolean;
}> = ({ label, value, healthy }) => (
  <div style={styles.healthItem}>
    <span style={{
      ...styles.healthDot,
      backgroundColor: healthy ? '#81c784' : '#e57373'
    }} />
    <span style={styles.healthLabel}>{label}</span>
    <span style={styles.healthValue}>{value}</span>
  </div>
);

const LawStatus: React.FC<{
  law: string;
  enforced: boolean;
}> = ({ law, enforced }) => (
  <div style={styles.lawItem}>
    <span style={styles.lawIcon}>{enforced ? '🛡️' : '⚠️'}</span>
    <span style={styles.lawName}>{law}</span>
    <span style={{
      ...styles.lawStatus,
      color: enforced ? '#81c784' : '#e57373'
    }}>
      {enforced ? 'ENFORCED' : 'NOT ENFORCED'}
    </span>
  </div>
);

// ============================================
// HELPERS
// ============================================

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0a0a1a',
    color: '#e0e0e0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #333',
    backgroundColor: '#0f0f1a'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  backButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#888',
    cursor: 'pointer'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0
  },
  badge: {
    fontSize: '10px',
    padding: '3px 8px',
    backgroundColor: '#6a4a6a',
    borderRadius: '4px',
    color: '#c080c0'
  },
  refreshButton: {
    padding: '8px 16px',
    fontSize: '13px',
    backgroundColor: '#4a4a6a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #333'
  },
  tab: {
    padding: '12px 20px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer'
  },
  main: {
    flex: 1,
    overflow: 'auto'
  },
  tabContent: {
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '16px',
    marginBottom: '20px'
  },
  subsectionTitle: {
    fontSize: '14px',
    marginTop: '25px',
    marginBottom: '15px',
    color: '#888'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px'
  },
  statusCard: {
    padding: '15px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    borderLeft: '4px solid'
  },
  cardLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#888',
    marginBottom: '5px'
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  healthItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#1a1a2e',
    borderRadius: '6px'
  },
  healthDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  healthLabel: {
    flex: 1,
    fontSize: '13px'
  },
  healthValue: {
    fontSize: '12px',
    color: '#888'
  },
  lawsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  lawItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#1a2e1a',
    borderRadius: '6px'
  },
  lawIcon: {
    fontSize: '18px'
  },
  lawName: {
    flex: 1,
    fontSize: '14px'
  },
  lawStatus: {
    fontSize: '11px',
    fontWeight: 'bold'
  },
  moduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  moduleCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px'
  },
  moduleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  moduleName: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  moduleId: {
    fontSize: '11px',
    color: '#666',
    fontFamily: 'monospace'
  },
  moduleStatus: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase'
  },
  connectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  connectionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px'
  },
  connectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  connectionName: {
    fontSize: '14px'
  },
  connectionLatency: {
    fontSize: '11px',
    color: '#81c784'
  },
  connectionError: {
    fontSize: '11px',
    color: '#e57373'
  },
  connectionStatus: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#fff'
  },
  eventsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  exportButton: {
    padding: '8px 16px',
    fontSize: '13px',
    backgroundColor: '#4a4a6a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  eventRow: {
    display: 'grid',
    gridTemplateColumns: '10px 80px 200px 150px 80px',
    gap: '15px',
    padding: '8px 10px',
    backgroundColor: '#1a1a2e',
    borderRadius: '4px',
    fontSize: '12px',
    alignItems: 'center'
  },
  eventSeverity: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  eventTime: {
    fontFamily: 'monospace',
    color: '#888'
  },
  eventType: {
    fontFamily: 'monospace'
  },
  eventModule: {
    color: '#4a9eff'
  },
  eventActor: {
    color: '#888'
  }
};

export default AdminPanelPage;
