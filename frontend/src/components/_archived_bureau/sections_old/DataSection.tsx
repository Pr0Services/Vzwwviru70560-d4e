// CHE·NU™ Data Section — Bureau Database & Dataspace Management

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Dataspace {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'shared' | 'project' | 'my_team';
  record_count: number;
  storage_mb: number;
  access_level: 'private' | 'restricted' | 'public';
  last_updated: string;
  created_at: string;
}

interface DataRecord {
  id: string;
  dataspace_id: string;
  record_type: string;
  title: string;
  data: Record<string, any>;
  tags: string[];
  created_at: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockDataspaces: Dataspace[] = [
  {
    id: 'ds1',
    name: 'Contacts',
    description: 'Personal and professional contacts database',
    type: 'personal',
    record_count: 156,
    storage_mb: 2.4,
    access_level: 'private',
    last_updated: '2024-01-15T14:30:00Z',
    created_at: '2023-06-10T10:00:00Z',
  },
  {
    id: 'ds2',
    name: 'Project Assets',
    description: 'Shared assets and resources for active projects',
    type: 'project',
    record_count: 89,
    storage_mb: 45.2,
    access_level: 'restricted',
    last_updated: '2024-01-15T12:00:00Z',
    created_at: '2023-09-15T09:00:00Z',
  },
  {
    id: 'ds3',
    name: 'Knowledge Base',
    description: 'Team knowledge and documentation',
    type: 'my_team',
    record_count: 234,
    storage_mb: 12.8,
    access_level: 'restricted',
    last_updated: '2024-01-14T18:00:00Z',
    created_at: '2023-04-20T14:00:00Z',
  },
  {
    id: 'ds4',
    name: 'Analytics Data',
    description: 'Collected analytics and metrics',
    type: 'shared',
    record_count: 1024,
    storage_mb: 8.5,
    access_level: 'restricted',
    last_updated: '2024-01-15T08:00:00Z',
    created_at: '2023-08-01T11:00:00Z',
  },
];

const mockRecords: DataRecord[] = [
  { id: 'r1', dataspace_id: 'ds1', record_type: 'contact', title: 'John Smith', data: { email: 'john@example.com', company: 'Acme Inc' }, tags: ['client', 'vip'], created_at: '2024-01-10T10:00:00Z' },
  { id: 'r2', dataspace_id: 'ds1', record_type: 'contact', title: 'Jane Doe', data: { email: 'jane@example.com', company: 'Tech Corp' }, tags: ['partner'], created_at: '2024-01-08T09:00:00Z' },
  { id: 'r3', dataspace_id: 'ds2', record_type: 'asset', title: 'Brand Guidelines PDF', data: { type: 'document', size: '2.4MB' }, tags: ['brand', 'design'], created_at: '2024-01-12T14:00:00Z' },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, color: CHENU_COLORS.softSand },
  createButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    backgroundColor: '#0a0a0b',
    padding: '4px',
    borderRadius: '10px',
    width: 'fit-content',
  },
  tab: (isActive: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  dataspaceCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  cardDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '16px',
  },
  typeBadge: (type: string) => {
    const colors: Record<string, string> = {
      personal: CHENU_COLORS.sacredGold,
      shared: CHENU_COLORS.cenoteTurquoise,
      project: CHENU_COLORS.jungleEmerald,
      team: '#9b59b6',
    };
    return {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[type] + '22',
      color: colors[type],
      textTransform: 'uppercase' as const,
    };
  },
  accessBadge: (level: string) => ({
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: level === 'private' ? '#e74c3c22' : CHENU_COLORS.ancientStone + '22',
    color: level === 'private' ? '#e74c3c' : CHENU_COLORS.ancientStone,
  }),
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    marginTop: '12px',
  },
  stat: {
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  // Records table
  recordsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    backgroundColor: '#0a0a0b',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  tag: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
    marginRight: '4px',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const DataSection: React.FC = () => {
  const [dataspaces] = useState<Dataspace[]>(mockDataspaces);
  const [records] = useState<DataRecord[]>(mockRecords);
  const [activeTab, setActiveTab] = useState<'dataspaces' | 'records'>('dataspaces');
  const [selectedDataspace, setSelectedDataspace] = useState<string | null>(null);

  const getDataspaceIcon = (type: string) => {
    const icons: Record<string, string> = {
      personal: '👤',
      shared: '🔗',
      project: '📁',
      team: '👥',
    };
    return icons[type] || '📊';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredRecords = selectedDataspace
    ? records.filter(r => r.dataspace_id === selectedDataspace)
    : records;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data / Database</h2>
        <button style={styles.createButton}>+ New Dataspace</button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === 'dataspaces')} onClick={() => { setActiveTab('dataspaces'); setSelectedDataspace(null); }}>
          📊 Dataspaces
        </button>
        <button style={styles.tab(activeTab === 'records')} onClick={() => setActiveTab('records')}>
          📋 Records
        </button>
      </div>

      {activeTab === 'dataspaces' && (
        <div style={styles.grid}>
          {dataspaces.map(ds => (
            <div 
              key={ds.id} 
              style={styles.dataspaceCard}
              onClick={() => { setSelectedDataspace(ds.id); setActiveTab('records'); }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>{getDataspaceIcon(ds.type)}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={styles.typeBadge(ds.type)}>{ds.type}</span>
                  <span style={styles.accessBadge(ds.access_level)}>
                    {ds.access_level === 'private' ? '🔒' : '🔓'} {ds.access_level}
                  </span>
                </div>
              </div>
              
              <h3 style={styles.cardTitle}>{ds.name}</h3>
              <p style={styles.cardDescription}>{ds.description}</p>

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <div style={styles.statValue}>{ds.record_count}</div>
                  <div style={styles.statLabel}>Records</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statValue}>{ds.storage_mb}MB</div>
                  <div style={styles.statLabel}>Storage</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statValue}>{formatTime(ds.last_updated)}</div>
                  <div style={styles.statLabel}>Updated</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'records' && (
        <div style={{ backgroundColor: '#111113', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={styles.recordsTable}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Tags</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td style={styles.td}>{record.title}</td>
                  <td style={styles.td}>{record.record_type}</td>
                  <td style={styles.td}>
                    {record.tags.map((tag, idx) => (
                      <span key={idx} style={styles.tag}>#{tag}</span>
                    ))}
                  </td>
                  <td style={styles.td}>{formatTime(record.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataSection;
