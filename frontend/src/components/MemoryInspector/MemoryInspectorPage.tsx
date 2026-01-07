/**
 * CHE·NU V51 — MEMORY INSPECTOR
 * ==============================
 * 
 * READ-ONLY inspection of .chenu memory units.
 * 
 * RULES:
 * - NO write capability
 * - Full audit trails visible
 * - Filter by sphere, category, volatility
 * - Export for external analysis
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MEMORY_INSPECTOR_CONTRACT,
  MemoryInspectorState,
  MemoryUnit,
  MemoryFilter,
  createMemoryInspectorState,
  createMemoryInspectorEvent
} from '../../contracts/MemoryInspector.contract';
import {
  getGlobalEventStore,
  emitModuleEntered,
  emitModuleExited
} from '../../stores/SystemEventStore';
import { ModuleState } from '../../contracts/ModuleActivationContract';

// ============================================
// DEMO DATA
// ============================================

const DEMO_MEMORY_UNITS: MemoryUnit[] = [
  {
    unit_id: 'mem_001',
    category: 'project',
    volatility: 'persistent',
    priority: 'high',
    canonical_summary: 'CHE·NU V51 development - Tree Laws architecture implementation',
    tags: ['development', 'architecture', 'tree-laws'],
    projects: ['CHENU-V51'],
    spheres: ['work'],
    created_at: '2025-12-28T10:00:00Z',
    updated_at: '2025-12-30T15:00:00Z',
    created_by: 'user',
    source_module: 'reflection_room',
    audit_trail: [
      { action: 'created', timestamp: '2025-12-28T10:00:00Z', actor: 'user' },
      { action: 'updated', timestamp: '2025-12-29T14:00:00Z', actor: 'user' },
      { action: 'updated', timestamp: '2025-12-30T15:00:00Z', actor: 'user' }
    ]
  },
  {
    unit_id: 'mem_002',
    category: 'task',
    volatility: 'session',
    priority: 'normal',
    canonical_summary: 'Demo Trust Layer - Q&A checklist implementation',
    tags: ['demo', 'qa', 'investor'],
    projects: ['CHENU-V51'],
    spheres: ['work'],
    created_at: '2025-12-30T09:00:00Z',
    updated_at: '2025-12-30T12:00:00Z',
    created_by: 'user',
    source_module: 'reflection_room',
    audit_trail: [
      { action: 'created', timestamp: '2025-12-30T09:00:00Z', actor: 'user' }
    ]
  },
  {
    unit_id: 'mem_003',
    category: 'reference',
    volatility: 'persistent',
    priority: 'normal',
    canonical_summary: 'Quebec construction regulations - RBQ, CNESST, CCQ compliance requirements',
    tags: ['compliance', 'quebec', 'construction'],
    projects: ['CHENU-COMPLIANCE'],
    spheres: ['work', 'projects'],
    created_at: '2025-12-20T08:00:00Z',
    updated_at: '2025-12-20T08:00:00Z',
    created_by: 'user',
    source_module: 'reflection_room',
    audit_trail: [
      { action: 'created', timestamp: '2025-12-20T08:00:00Z', actor: 'user' }
    ]
  },
  {
    unit_id: 'mem_004',
    category: 'idea',
    volatility: 'medium',
    priority: 'low',
    canonical_summary: 'XR spatial memory integration concept for future development',
    tags: ['xr', 'spatial', 'future'],
    projects: [],
    spheres: ['ideas'],
    created_at: '2025-12-25T16:00:00Z',
    updated_at: '2025-12-25T16:00:00Z',
    created_by: 'user',
    source_module: 'reflection_room',
    audit_trail: [
      { action: 'created', timestamp: '2025-12-25T16:00:00Z', actor: 'user' }
    ]
  }
];

// ============================================
// PROPS
// ============================================

export interface MemoryInspectorPageProps {
  onNavigateToModule?: (moduleId: string) => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const MemoryInspectorPage: React.FC<MemoryInspectorPageProps> = ({
  onNavigateToModule,
  className = ''
}) => {
  // State
  const [state, setState] = useState<MemoryInspectorState>(() =>
    createMemoryInspectorState()
  );
  const [filter, setFilter] = useState<MemoryFilter>({});
  const [selectedUnit, setSelectedUnit] = useState<MemoryUnit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Lifecycle
  useEffect(() => {
    emitModuleEntered('memory_inspector');
    setState(prev => ({ ...prev, module_state: ModuleState.ACTIVE }));

    return () => {
      emitModuleExited('memory_inspector');
    };
  }, []);

  // Filtered units
  const filteredUnits = useMemo(() => {
    let units = DEMO_MEMORY_UNITS;

    // Apply filters
    if (filter.spheres && filter.spheres.length > 0) {
      units = units.filter(u => 
        u.spheres.some(s => filter.spheres!.includes(s))
      );
    }
    if (filter.categories && filter.categories.length > 0) {
      units = units.filter(u => filter.categories!.includes(u.category));
    }
    if (filter.volatility && filter.volatility.length > 0) {
      units = units.filter(u => filter.volatility!.includes(u.volatility));
    }

    // Apply search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      units = units.filter(u =>
        u.canonical_summary.toLowerCase().includes(q) ||
        u.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return units;
  }, [filter, searchQuery]);

  // Export handler
  const handleExport = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      filter,
      units: filteredUnits
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    getGlobalEventStore().emit(
      'memory_exported',
      'user',
      'memory_inspector',
      'info',
      { count: filteredUnits.length }
    );
  };

  return (
    <div className={`memory-inspector ${className}`} style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => onNavigateToModule?.('reflection_room')}
            style={styles.backButton}
          >
            ← Retour
          </button>
          <h1 style={styles.title}>Memory Inspector</h1>
          <span style={styles.badge}>READ-ONLY</span>
        </div>
        <button onClick={handleExport} style={styles.exportButton}>
          📤 Exporter ({filteredUnits.length})
        </button>
      </header>

      {/* Main Layout */}
      <div style={styles.main}>
        {/* Filters Panel */}
        <aside style={styles.filters}>
          <h3 style={styles.filterTitle}>Filtres</h3>

          {/* Search */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Recherche</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              style={styles.searchInput}
            />
          </div>

          {/* Spheres */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sphères</label>
            {['work', 'personal', 'projects', 'ideas'].map(sphere => (
              <label key={sphere} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filter.spheres?.includes(sphere) || false}
                  onChange={e => {
                    const current = filter.spheres || [];
                    setFilter({
                      ...filter,
                      spheres: e.target.checked
                        ? [...current, sphere]
                        : current.filter(s => s !== sphere)
                    });
                  }}
                />
                {sphere}
              </label>
            ))}
          </div>

          {/* Categories */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Catégories</label>
            {['project', 'task', 'reference', 'idea'].map(cat => (
              <label key={cat} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filter.categories?.includes(cat) || false}
                  onChange={e => {
                    const current = filter.categories || [];
                    setFilter({
                      ...filter,
                      categories: e.target.checked
                        ? [...current, cat]
                        : current.filter(c => c !== cat)
                    });
                  }}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Clear filters */}
          <button
            onClick={() => { setFilter({}); setSearchQuery(''); }}
            style={styles.clearButton}
          >
            Effacer les filtres
          </button>
        </aside>

        {/* Memory List */}
        <section style={styles.memoryList}>
          <div style={styles.listHeader}>
            <span>{filteredUnits.length} unités</span>
          </div>
          
          {filteredUnits.map(unit => (
            <MemoryUnitCard
              key={unit.unit_id}
              unit={unit}
              isSelected={selectedUnit?.unit_id === unit.unit_id}
              onClick={() => setSelectedUnit(
                selectedUnit?.unit_id === unit.unit_id ? null : unit
              )}
            />
          ))}
        </section>

        {/* Detail Panel */}
        {selectedUnit && (
          <aside style={styles.detailPanel}>
            <MemoryUnitDetail unit={selectedUnit} />
          </aside>
        )}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const MemoryUnitCard: React.FC<{
  unit: MemoryUnit;
  isSelected: boolean;
  onClick: () => void;
}> = ({ unit, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.unitCard,
      borderColor: isSelected ? '#4a9eff' : '#333'
    }}
  >
    <div style={styles.unitHeader}>
      <span style={styles.unitCategory}>{unit.category}</span>
      <span style={{
        ...styles.unitVolatility,
        backgroundColor: unit.volatility === 'persistent' ? '#4a6a4a' 
          : unit.volatility === 'medium' ? '#6a6a4a' 
          : '#6a4a4a'
      }}>
        {unit.volatility}
      </span>
    </div>
    <p style={styles.unitSummary}>{unit.canonical_summary}</p>
    <div style={styles.unitTags}>
      {unit.tags.slice(0, 3).map(tag => (
        <span key={tag} style={styles.unitTag}>{tag}</span>
      ))}
      {unit.tags.length > 3 && (
        <span style={styles.unitTagMore}>+{unit.tags.length - 3}</span>
      )}
    </div>
    <div style={styles.unitMeta}>
      <span>📅 {new Date(unit.updated_at).toLocaleDateString('fr-CA')}</span>
      <span>📝 {unit.audit_trail.length} actions</span>
    </div>
  </div>
);

const MemoryUnitDetail: React.FC<{ unit: MemoryUnit }> = ({ unit }) => (
  <div style={styles.detail}>
    <h3 style={styles.detailTitle}>Détails</h3>
    
    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>ID</label>
      <code style={styles.detailCode}>{unit.unit_id}</code>
    </div>

    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>Résumé</label>
      <p style={styles.detailText}>{unit.canonical_summary}</p>
    </div>

    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>Tags</label>
      <div style={styles.unitTags}>
        {unit.tags.map(tag => (
          <span key={tag} style={styles.unitTag}>{tag}</span>
        ))}
      </div>
    </div>

    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>Sphères</label>
      <div style={styles.unitTags}>
        {unit.spheres.map(sphere => (
          <span key={sphere} style={styles.sphereTag}>{sphere}</span>
        ))}
      </div>
    </div>

    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>Projets</label>
      <p style={styles.detailText}>
        {unit.projects.length > 0 ? unit.projects.join(', ') : '—'}
      </p>
    </div>

    <div style={styles.detailSection}>
      <label style={styles.detailLabel}>Historique d'audit</label>
      <div style={styles.auditTrail}>
        {unit.audit_trail.map((entry, i) => (
          <div key={i} style={styles.auditEntry}>
            <span style={styles.auditAction}>{entry.action}</span>
            <span style={styles.auditTime}>
              {new Date(entry.timestamp).toLocaleString('fr-CA')}
            </span>
            <span style={styles.auditActor}>{entry.actor}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
    backgroundColor: '#4a6a4a',
    borderRadius: '4px',
    color: '#81c784'
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
  main: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '220px 1fr 300px',
    overflow: 'hidden'
  },
  filters: {
    padding: '15px',
    borderRight: '1px solid #333',
    overflow: 'auto'
  },
  filterTitle: {
    fontSize: '14px',
    marginBottom: '15px'
  },
  filterGroup: {
    marginBottom: '20px'
  },
  filterLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px'
  },
  searchInput: {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#e0e0e0'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    marginBottom: '6px',
    cursor: 'pointer'
  },
  clearButton: {
    width: '100%',
    padding: '8px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#888',
    cursor: 'pointer'
  },
  memoryList: {
    padding: '15px',
    overflow: 'auto'
  },
  listHeader: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '15px'
  },
  unitCard: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  unitCategory: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#888'
  },
  unitVolatility: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#fff'
  },
  unitSummary: {
    fontSize: '14px',
    lineHeight: '1.4',
    margin: '0 0 10px 0'
  },
  unitTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '10px'
  },
  unitTag: {
    fontSize: '11px',
    padding: '2px 8px',
    backgroundColor: '#2a2a4e',
    borderRadius: '10px',
    color: '#a0a0ff'
  },
  unitTagMore: {
    fontSize: '11px',
    color: '#666'
  },
  sphereTag: {
    fontSize: '11px',
    padding: '2px 8px',
    backgroundColor: '#4a4a2e',
    borderRadius: '10px',
    color: '#c0c080'
  },
  unitMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '11px',
    color: '#666'
  },
  detailPanel: {
    borderLeft: '1px solid #333',
    overflow: 'auto'
  },
  detail: {
    padding: '15px'
  },
  detailTitle: {
    fontSize: '14px',
    marginBottom: '20px'
  },
  detailSection: {
    marginBottom: '15px'
  },
  detailLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#888',
    marginBottom: '5px'
  },
  detailCode: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#4a9eff'
  },
  detailText: {
    fontSize: '13px',
    margin: 0,
    lineHeight: '1.4'
  },
  auditTrail: {
    fontSize: '11px'
  },
  auditEntry: {
    display: 'flex',
    gap: '10px',
    padding: '6px 0',
    borderBottom: '1px solid #222'
  },
  auditAction: {
    color: '#81c784',
    minWidth: '60px'
  },
  auditTime: {
    color: '#888',
    flex: 1
  },
  auditActor: {
    color: '#4a9eff'
  }
};

export default MemoryInspectorPage;
