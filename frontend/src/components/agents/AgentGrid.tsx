/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT GRID V72
 * ═══════════════════════════════════════════════════════════════════════════
 * Grille d'affichage des agents avec filtres
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { AgentCardV72 } from './AgentCardV72';
import type { AgentDefinition } from '../../data/agents-catalog';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AgentGridProps {
  agents: AgentDefinition[];
  hiredAgentIds?: string[];
  onHire?: (agent: AgentDefinition) => void;
  onFire?: (agent: AgentDefinition) => void;
  onView?: (agent: AgentDefinition) => void;
  sphereFilter?: string;
  tierFilter?: string;
  searchQuery?: string;
  showFilters?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

const SPHERE_OPTIONS = [
  { value: 'all', label: 'Toutes les sphères', icon: '🌐' },
  { value: 'personal', label: 'Personal', icon: '🏠' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'studio', label: 'Creative Studio', icon: '🎨' },
  { value: 'scholar', label: 'Scholar', icon: '📚' },
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'social', label: 'Social', icon: '📱' },
  { value: 'team', label: 'My Team', icon: '🤝' },
  { value: 'government', label: 'Government', icon: '🏛️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

const TIER_OPTIONS = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'L0', label: 'Nova (L0)' },
  { value: 'L1', label: 'Orchestrator (L1)' },
  { value: 'L2', label: 'Specialist (L2)' },
  { value: 'L3', label: 'Worker (L3)' },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  } as React.CSSProperties,
  
  filters: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  
  select: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #1f1f23',
    background: '#111113',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  searchInput: {
    flex: 1,
    minWidth: 200,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #1f1f23',
    background: '#111113',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
  } as React.CSSProperties,
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  } as React.CSSProperties,
  
  empty: {
    padding: 40,
    textAlign: 'center' as const,
    color: '#666',
    gridColumn: '1 / -1',
  } as React.CSSProperties,
  
  stats: {
    display: 'flex',
    gap: 16,
    fontSize: 13,
    color: '#888',
  } as React.CSSProperties,
  
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// AGENT GRID
// ═══════════════════════════════════════════════════════════════════════════

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  hiredAgentIds = [],
  onHire,
  onFire,
  onView,
  sphereFilter: initialSphereFilter = 'all',
  tierFilter: initialTierFilter = 'all',
  searchQuery: initialSearchQuery = '',
  showFilters = true,
}) => {
  const [sphereFilter, setSphereFilter] = useState(initialSphereFilter);
  const [tierFilter, setTierFilter] = useState(initialTierFilter);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  
  // Filter agents
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      // Sphere/Domain filter
      if (sphereFilter !== 'all' && agent.domain !== sphereFilter) return false;
      
      // Tier/Level filter
      if (tierFilter !== 'all' && agent.level !== tierFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(query);
        const matchesDesc = agent.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      
      return true;
    });
  }, [agents, sphereFilter, tierFilter, searchQuery]);
  
  // Stats
  const hiredCount = filteredAgents.filter(a => hiredAgentIds.includes(a.id)).length;
  
  return (
    <div style={styles.container}>
      {/* Filters */}
      {showFilters && (
        <div style={styles.filters}>
          <select
            value={sphereFilter}
            onChange={(e) => setSphereFilter(e.target.value)}
            style={styles.select}
          >
            {SPHERE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
          
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={styles.select}
          >
            {TIER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Rechercher un agent..."
            style={styles.searchInput}
          />
        </div>
      )}
      
      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span>📊</span>
          <span>{filteredAgents.length} agents</span>
        </div>
        <div style={styles.statItem}>
          <span>✅</span>
          <span>{hiredCount} engagés</span>
        </div>
      </div>
      
      {/* Grid */}
      <div style={styles.grid}>
        {filteredAgents.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div>Aucun agent trouvé</div>
          </div>
        ) : (
          filteredAgents.map(agent => (
            <AgentCardV72
              key={agent.id}
              agent={agent}
              isHired={hiredAgentIds.includes(agent.id)}
              onHire={onHire}
              onFire={onFire}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentGrid;
