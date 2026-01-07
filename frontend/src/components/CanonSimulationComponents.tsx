/**
 * CHE·NU™ — Canon & Simulation Frontend Components
 * Version: V1.0
 * Date: 2026-01-07
 * 
 * Components pour:
 * - Need Canon Browser
 * - Module Catalog
 * - Scenario-Lock Simulation Dashboard
 * 
 * GOUVERNANCE > EXÉCUTION
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Need {
  id: string;
  category: string;
  name_en: string;
  name_fr: string;
  description: string;
  priority: number;
  frequency: string;
  served_by_modules: string[];
}

interface Module {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in_development' | 'beta' | 'stable' | 'deprecated';
  version: string;
  needs_served: string[];
  dependencies: string[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  requires_checkpoint: boolean;
  checkpoint_reason?: string;
  activation_mode: 'auto' | 'manual' | 'checkpoint';
}

interface SimulationRun {
  run_id: string;
  template_id: string;
  status: 'planned' | 'running' | 'completed' | 'failed' | 'paused';
  duration_days: number;
  factors: Record<string, any>;
  modules_activated: string[];
  metrics: {
    total_events: number;
    successful_events: number;
    success_rate: number;
    faults_injected: number;
    checkpoints_triggered: number;
    expectations_met: number;
    expectations_total: number;
    expectation_success_rate: number;
  };
  governance_violations: any[];
}

interface Factor {
  id: string;
  name: string;
  description: string;
  value_type: string;
  possible_values: any[];
  default_value: any;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_COLORS: Record<string, string> = {
  organize: '#3EB4A2',
  communicate: '#D8B26A',
  remember: '#3F7249',
  decide: '#E74C3C',
  create: '#9B59B6',
  protect: '#2C3E50',
  learn: '#1ABC9C',
  automate: '#F39C12',
  collaborate: '#E67E22',
};

const CATEGORY_ICONS: Record<string, string> = {
  organize: '📋',
  communicate: '💬',
  remember: '🧠',
  decide: '⚖️',
  create: '🎨',
  protect: '🔒',
  learn: '📚',
  automate: '⚙️',
  collaborate: '🤝',
};

const STATUS_COLORS: Record<string, string> = {
  planned: '#8D8371',
  in_development: '#F39C12',
  beta: '#D8B26A',
  stable: '#3F7249',
  deprecated: '#E74C3C',
};

const RISK_COLORS: Record<string, string> = {
  low: '#3EB4A2',
  medium: '#D8B26A',
  high: '#E74C3C',
  critical: '#8E44AD',
};

const RUN_STATUS_COLORS: Record<string, string> = {
  planned: '#8D8371',
  running: '#3EB4A2',
  completed: '#3F7249',
  failed: '#E74C3C',
  paused: '#D8B26A',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEED CANON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Carte de besoin
 */
export const NeedCard: React.FC<{
  need: Need;
  onSelect?: (needId: string) => void;
}> = ({ need, onSelect }) => {
  const color = CATEGORY_COLORS[need.category] || '#8D8371';
  const icon = CATEGORY_ICONS[need.category] || '❓';
  
  return (
    <div
      onClick={() => onSelect?.(need.id)}
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        borderLeft: `4px solid ${color}`,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => onSelect && (e.currentTarget.style.transform = 'translateX(4px)')}
      onMouseLeave={e => onSelect && (e.currentTarget.style.transform = 'translateX(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{icon}</span>
          <div>
            <div style={{ color: '#E9E4D6', fontWeight: 600 }}>{need.name_fr}</div>
            <div style={{ color: '#8D8371', fontSize: '12px' }}>{need.name_en}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              style={{
                color: i < need.priority ? color : '#2F4C39',
                fontSize: '12px',
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      
      <p style={{ color: '#8D8371', marginTop: '8px', marginBottom: '8px', fontSize: '14px' }}>
        {need.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            padding: '2px 8px',
            backgroundColor: color,
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {need.category.toUpperCase()}
        </span>
        
        {need.served_by_modules.length > 0 && (
          <span style={{ color: '#3EB4A2', fontSize: '12px' }}>
            📦 {need.served_by_modules.length} module(s)
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Browser de besoins
 */
export const NeedCanonBrowser: React.FC<{
  needs: Need[];
  selectedNeedId?: string;
  onSelectNeed?: (needId: string) => void;
}> = ({ needs, selectedNeedId, onSelectNeed }) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [...new Set(needs.map(n => n.category))];
  
  const filteredNeeds = needs.filter(need => {
    if (filterCategory && need.category !== filterCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        need.name_fr.toLowerCase().includes(query) ||
        need.name_en.toLowerCase().includes(query) ||
        need.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  return (
    <div style={{ backgroundColor: '#0D0D0D', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#D8B26A', marginBottom: '16px' }}>
        📜 Need Canon ({needs.length} besoins)
      </h2>
      
      {/* Filters */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#1E1F22',
            border: '1px solid #2F4C39',
            borderRadius: '4px',
            color: '#E9E4D6',
            marginBottom: '12px',
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <CategoryFilter
            active={filterCategory === null}
            onClick={() => setFilterCategory(null)}
            label="Tous"
            color="#8D8371"
          />
          {categories.map(cat => (
            <CategoryFilter
              key={cat}
              active={filterCategory === cat}
              onClick={() => setFilterCategory(cat)}
              label={cat}
              color={CATEGORY_COLORS[cat]}
            />
          ))}
        </div>
      </div>
      
      {/* Needs List */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {filteredNeeds.map(need => (
          <NeedCard
            key={need.id}
            need={need}
            onSelect={onSelectNeed}
          />
        ))}
        
        {filteredNeeds.length === 0 && (
          <p style={{ color: '#8D8371', fontStyle: 'italic' }}>
            Aucun besoin trouvé
          </p>
        )}
      </div>
    </div>
  );
};

const CategoryFilter: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
}> = ({ active, onClick, label, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 12px',
      backgroundColor: active ? color : '#1E1F22',
      color: active ? '#FFFFFF' : color,
      border: `1px solid ${color}`,
      borderRadius: '16px',
      cursor: 'pointer',
      fontSize: '12px',
      textTransform: 'capitalize',
    }}
  >
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE CATALOG COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Carte de module
 */
export const ModuleCard: React.FC<{
  module: Module;
  onSelect?: (moduleId: string) => void;
}> = ({ module: mod, onSelect }) => {
  const statusColor = STATUS_COLORS[mod.status];
  const riskColor = RISK_COLORS[mod.risk_level];
  
  return (
    <div
      onClick={() => onSelect?.(mod.id)}
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: onSelect ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#E9E4D6', fontWeight: 600, fontSize: '16px' }}>
            {mod.name}
          </div>
          <div style={{ color: '#8D8371', fontSize: '12px' }}>
            {mod.id} • v{mod.version}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              padding: '2px 8px',
              backgroundColor: statusColor,
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {mod.status.toUpperCase()}
          </span>
          <span
            style={{
              padding: '2px 8px',
              backgroundColor: riskColor,
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {mod.risk_level.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p style={{ color: '#8D8371', marginTop: '8px', marginBottom: '8px', fontSize: '14px' }}>
        {mod.description}
      </p>
      
      {/* Dependencies */}
      {mod.dependencies.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <span style={{ color: '#8D8371', fontSize: '12px' }}>Dépendances: </span>
          {mod.dependencies.map(dep => (
            <span
              key={dep}
              style={{
                display: 'inline-block',
                padding: '2px 6px',
                backgroundColor: '#2F4C39',
                color: '#3EB4A2',
                borderRadius: '4px',
                fontSize: '11px',
                marginRight: '4px',
              }}
            >
              {dep}
            </span>
          ))}
        </div>
      )}
      
      {/* Checkpoint */}
      {mod.requires_checkpoint && (
        <div style={{ marginTop: '8px', color: '#D8B26A', fontSize: '12px' }}>
          🔐 Checkpoint requis: {mod.checkpoint_reason}
        </div>
      )}
      
      {/* Needs served */}
      <div style={{ marginTop: '8px', color: '#3EB4A2', fontSize: '12px' }}>
        🎯 {mod.needs_served.length} besoin(s) servi(s)
      </div>
    </div>
  );
};

/**
 * Catalogue de modules
 */
export const ModuleCatalogBrowser: React.FC<{
  modules: Module[];
  onSelectModule?: (moduleId: string) => void;
}> = ({ modules, onSelectModule }) => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  
  const filteredModules = modules.filter(mod => {
    if (filterStatus && mod.status !== filterStatus) return false;
    if (filterRisk && mod.risk_level !== filterRisk) return false;
    return true;
  });
  
  const stableCount = modules.filter(m => m.status === 'stable').length;
  const highRiskCount = modules.filter(m => ['high', 'critical'].includes(m.risk_level)).length;
  
  return (
    <div style={{ backgroundColor: '#0D0D0D', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#3EB4A2', marginBottom: '8px' }}>
        📦 Module Catalog ({modules.length})
      </h2>
      <p style={{ color: '#8D8371', marginBottom: '16px', fontSize: '12px' }}>
        {stableCount} stable • {highRiskCount} haute risque
      </p>
      
      {/* Filters */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ color: '#8D8371', fontSize: '12px', marginRight: '8px' }}>Statut:</span>
          <select
            value={filterStatus || ''}
            onChange={e => setFilterStatus(e.target.value || null)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#1E1F22',
              border: '1px solid #2F4C39',
              borderRadius: '4px',
              color: '#E9E4D6',
            }}
          >
            <option value="">Tous</option>
            <option value="stable">Stable</option>
            <option value="beta">Beta</option>
            <option value="in_development">En dev</option>
            <option value="planned">Planifié</option>
          </select>
        </div>
        
        <div>
          <span style={{ color: '#8D8371', fontSize: '12px', marginRight: '8px' }}>Risque:</span>
          <select
            value={filterRisk || ''}
            onChange={e => setFilterRisk(e.target.value || null)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#1E1F22',
              border: '1px solid #2F4C39',
              borderRadius: '4px',
              color: '#E9E4D6',
            }}
          >
            <option value="">Tous</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      
      {/* Modules List */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {filteredModules.map(mod => (
          <ModuleCard key={mod.id} module={mod} onSelect={onSelectModule} />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rapport de simulation
 */
export const SimulationRunReport: React.FC<{
  run: SimulationRun;
}> = ({ run }) => {
  const statusColor = RUN_STATUS_COLORS[run.status];
  const successRate = Math.round(run.metrics.success_rate * 100);
  const expectationRate = Math.round(run.metrics.expectation_success_rate * 100);
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '20px',
        borderTop: `4px solid ${statusColor}`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: '#E9E4D6', margin: 0 }}>
            {run.template_id}
          </h3>
          <div style={{ color: '#8D8371', fontSize: '12px' }}>
            Run: {run.run_id.slice(0, 8)}... • {run.duration_days} jours
          </div>
        </div>
        
        <span
          style={{
            padding: '4px 12px',
            backgroundColor: statusColor,
            color: '#FFFFFF',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {run.status.toUpperCase()}
        </span>
      </div>
      
      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <MetricCard label="Événements" value={run.metrics.total_events} color="#3EB4A2" />
        <MetricCard label="Succès" value={`${successRate}%`} color={successRate >= 90 ? '#3F7249' : '#D8B26A'} />
        <MetricCard label="Expectations" value={`${expectationRate}%`} color={expectationRate >= 90 ? '#3F7249' : '#D8B26A'} />
        <MetricCard label="Fautes injectées" value={run.metrics.faults_injected} color="#E74C3C" />
        <MetricCard label="Checkpoints" value={run.metrics.checkpoints_triggered} color="#D8B26A" />
        <MetricCard label="Violations" value={run.governance_violations.length} color={run.governance_violations.length === 0 ? '#3F7249' : '#E74C3C'} />
      </div>
      
      {/* Factors */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#8D8371', marginBottom: '8px', fontSize: '14px' }}>Facteurs:</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(run.factors).map(([key, value]) => (
            <span
              key={key}
              style={{
                padding: '4px 8px',
                backgroundColor: '#2F4C39',
                color: '#E9E4D6',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {key}: {String(value)}
            </span>
          ))}
        </div>
      </div>
      
      {/* Modules */}
      <div>
        <h4 style={{ color: '#8D8371', marginBottom: '8px', fontSize: '14px' }}>
          Modules activés ({run.modules_activated.length}):
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {run.modules_activated.map(mod => (
            <span
              key={mod}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3F7249',
                color: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {mod}
            </span>
          ))}
        </div>
      </div>
      
      {/* Governance Violations */}
      {run.governance_violations.length > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#E74C3C20', borderRadius: '4px' }}>
          <h4 style={{ color: '#E74C3C', marginBottom: '8px' }}>
            ⚠️ Violations de gouvernance
          </h4>
          {run.governance_violations.map((v, i) => (
            <div key={i} style={{ color: '#E9E4D6', fontSize: '12px' }}>
              {JSON.stringify(v)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number | string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      backgroundColor: '#0D0D0D',
      padding: '12px',
      borderRadius: '4px',
      textAlign: 'center',
    }}
  >
    <div style={{ color, fontSize: '24px', fontWeight: 700 }}>{value}</div>
    <div style={{ color: '#8D8371', fontSize: '11px' }}>{label}</div>
  </div>
);

/**
 * Dashboard de simulation
 */
export const SimulationDashboard: React.FC<{
  templates: { id: string; name: string; description: string; duration_days: number }[];
  factors: Factor[];
  runs: SimulationRun[];
  onCreateRun?: (templateId: string, factors: Record<string, any>, modules: string[]) => void;
}> = ({ templates, factors, runs, onCreateRun }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<Record<string, any>>({});
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#0D0D0D', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#D8B26A', marginBottom: '8px' }}>
          🔐 Scenario-Lock Simulation
        </h1>
        <p style={{ color: '#8D8371' }}>
          run = template × factors × module_set
        </p>
      </div>
      
      {/* Templates */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#E9E4D6', marginBottom: '12px' }}>Templates disponibles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {templates.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              style={{
                backgroundColor: selectedTemplate === t.id ? '#2F4C39' : '#1E1F22',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                border: selectedTemplate === t.id ? '2px solid #3EB4A2' : '2px solid transparent',
              }}
            >
              <h3 style={{ color: '#E9E4D6', margin: 0 }}>{t.name}</h3>
              <p style={{ color: '#8D8371', marginTop: '8px', marginBottom: '8px', fontSize: '14px' }}>
                {t.description}
              </p>
              <span style={{ color: '#3EB4A2', fontSize: '12px' }}>
                📅 {t.duration_days} jours
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Factors Configuration */}
      {selectedTemplate && (
        <div style={{ marginBottom: '24px', backgroundColor: '#1E1F22', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ color: '#E9E4D6', marginBottom: '16px' }}>Configuration des facteurs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {factors.slice(0, 6).map(f => (
              <div key={f.id}>
                <label style={{ color: '#8D8371', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  {f.name}
                </label>
                {f.value_type === 'enum' ? (
                  <select
                    value={selectedFactors[f.id] || f.default_value || ''}
                    onChange={e => setSelectedFactors({ ...selectedFactors, [f.id]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #2F4C39',
                      borderRadius: '4px',
                      color: '#E9E4D6',
                    }}
                  >
                    {f.possible_values.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.value_type === 'int' ? 'number' : 'text'}
                    value={selectedFactors[f.id] || f.default_value || ''}
                    onChange={e => setSelectedFactors({ ...selectedFactors, [f.id]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #2F4C39',
                      borderRadius: '4px',
                      color: '#E9E4D6',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => onCreateRun?.(selectedTemplate, selectedFactors, [])}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#3F7249',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            🚀 Lancer la simulation
          </button>
        </div>
      )}
      
      {/* Previous Runs */}
      <div>
        <h2 style={{ color: '#E9E4D6', marginBottom: '16px' }}>Runs précédents ({runs.length})</h2>
        {runs.length === 0 ? (
          <p style={{ color: '#8D8371', fontStyle: 'italic' }}>Aucun run effectué</p>
        ) : (
          runs.map(run => (
            <div key={run.run_id} style={{ marginBottom: '16px' }}>
              <SimulationRunReport run={run} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default SimulationDashboard;
