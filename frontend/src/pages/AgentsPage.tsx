/**
 * CHE·NU — AGENTS PAGE
 * ====================
 * Visualisation hiérarchique des 168+ agents IA avec vue orbitale
 * 
 * @version 1.0.0
 * @safe true
 */

import React, { useState, useMemo, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';
type AgentStatus = 'active' | 'idle' | 'processing' | 'offline';
type ViewMode = 'hierarchy' | 'grid' | 'orbital';

interface Agent {
  id: string;
  name: string;
  level: AgentLevel;
  sphere?: string;
  domain?: string;
  description: string;
  status: AgentStatus;
  tasksCompleted: number;
  avgResponseTime: number; // ms
  accuracy: number; // %
  parentId?: string;
  children?: string[];
  capabilities: string[];
}

interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  domains: string[];
  agentCount: number;
}

// =============================================================================
// DATA
// =============================================================================

const spheres: Sphere[] = [
  { id: 'personal', name: 'Personal', icon: '👤', color: '#10b981', domains: ['Health', 'Finance', 'Habits', 'Energy', 'LifeMap'], agentCount: 15 },
  { id: 'business', name: 'Business', icon: '💼', color: '#3b82f6', domains: ['Construction', 'Finance', 'Market', 'Logistics', 'Operations'], agentCount: 22 },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#8b5cf6', domains: ['Design', 'Art', 'Media', 'Concept'], agentCount: 12 },
  { id: 'scholar', name: 'Scholar', icon: '📚', color: '#f59e0b', domains: ['Research', 'Study', 'Documentation', 'InfoArch'], agentCount: 14 },
  { id: 'social', name: 'Social', icon: '💬', color: '#ec4899', domains: ['Feed', 'Post', 'Comment', 'Message', 'Influence'], agentCount: 16 },
  { id: 'community', name: 'Community', icon: '🏘️', color: '#06b6d4', domains: ['Forum', 'Group', 'Page', 'Announcement', 'Civic'], agentCount: 15 },
  { id: 'xr', name: 'XR', icon: '🥽', color: '#a855f7', domains: ['Spatial', 'WorldBuilder', 'Scene'], agentCount: 10 },
  { id: 'myteam', name: 'MyTeam', icon: '👥', color: '#14b8a6', domains: ['Collaboration', 'Coordination', 'Delegation', 'Role'], agentCount: 13 },
  { id: 'ailab', name: 'AILab', icon: '🧪', color: '#f43f5e', domains: ['Cognitive', 'Sandbox', 'TestRig'], agentCount: 9 },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#eab308', domains: ['Game', 'Streaming', 'Interaction', 'Audience'], agentCount: 12 },
];

const mockAgents: Agent[] = [
  // L0 - Nova
  {
    id: 'nova-0',
    name: 'Nova',
    level: 'L0',
    description: 'Orchestrateur central CHE·NU - Coordonne tous les agents et routage intelligent',
    status: 'active',
    tasksCompleted: 15847,
    avgResponseTime: 45,
    accuracy: 99.2,
    capabilities: ['Orchestration', 'Routing', 'Context Analysis', 'Multi-Agent Coordination'],
    children: spheres.map(s => `sphere-${s.id}`),
  },
  // L1 - Sphere Agents
  ...spheres.map(sphere => ({
    id: `sphere-${sphere.id}`,
    name: `${sphere.name}SphereAgent`,
    level: 'L1' as AgentLevel,
    sphere: sphere.id,
    description: `Gestionnaire de la sphère ${sphere.name} - Coordonne ${sphere.agentCount} agents`,
    status: 'active' as AgentStatus,
    tasksCompleted: Math.floor(Math.random() * 5000) + 1000,
    avgResponseTime: Math.floor(Math.random() * 100) + 50,
    accuracy: 95 + Math.random() * 4,
    parentId: 'nova-0',
    capabilities: [`${sphere.name} Management`, 'Domain Routing', 'Context Preservation'],
    children: sphere.domains.map(d => `domain-${sphere.id}-${d.toLowerCase()}`),
  })),
  // L2 - Domain Agents (sample)
  ...spheres.flatMap(sphere => 
    sphere.domains.map(domain => ({
      id: `domain-${sphere.id}-${domain.toLowerCase()}`,
      name: `${domain}Agent`,
      level: 'L2' as AgentLevel,
      sphere: sphere.id,
      domain: domain,
      description: `Agent spécialisé ${domain} dans la sphère ${sphere.name}`,
      status: (['active', 'idle', 'processing'] as AgentStatus[])[Math.floor(Math.random() * 3)],
      tasksCompleted: Math.floor(Math.random() * 2000) + 200,
      avgResponseTime: Math.floor(Math.random() * 150) + 80,
      accuracy: 90 + Math.random() * 8,
      parentId: `sphere-${sphere.id}`,
      capabilities: [`${domain} Processing`, 'Task Execution', 'Reporting'],
    }))
  ),
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const levelConfig: Record<AgentLevel, { label: string; color: string; bg: string; size: number }> = {
  L0: { label: 'Orchestrateur', color: '#10b981', bg: 'rgba(16,185,129,0.15)', size: 80 },
  L1: { label: 'Sphère', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', size: 60 },
  L2: { label: 'Domaine', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', size: 48 },
  L3: { label: 'Worker', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', size: 36 },
};

const statusConfig: Record<AgentStatus, { label: string; color: string; pulse: boolean }> = {
  active: { label: 'Actif', color: '#10b981', pulse: true },
  idle: { label: 'En attente', color: '#6b7280', pulse: false },
  processing: { label: 'En cours', color: '#3b82f6', pulse: true },
  offline: { label: 'Hors ligne', color: '#ef4444', pulse: false },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
    padding: '24px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  } as React.CSSProperties,
  
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,
  
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    alignItems: 'center',
  } as React.CSSProperties,
  
  searchInput: {
    flex: '1',
    maxWidth: '320px',
    padding: '12px 16px',
    paddingLeft: '44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  } as React.CSSProperties,
  
  select: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  viewToggle: {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '4px',
    marginLeft: 'auto',
  } as React.CSSProperties,
  
  viewButton: (active: boolean) => ({
    padding: '8px 16px',
    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: active ? '#ffffff' : '#6b7280',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }) as React.CSSProperties,
  
  // Orbital View Styles
  orbitalContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '700px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
  } as React.CSSProperties,
  
  orbitRing: (radius: number, color: string) => ({
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    marginLeft: `-${radius}px`,
    marginTop: `-${radius}px`,
    border: `1px dashed ${color}40`,
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  }) as React.CSSProperties,
  
  agentNode: (x: number, y: number, size: number, color: string, isCenter: boolean) => ({
    position: 'absolute' as const,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    width: `${size}px`,
    height: `${size}px`,
    marginLeft: `-${size / 2}px`,
    marginTop: `-${size / 2}px`,
    background: isCenter 
      ? `radial-gradient(circle, ${color}40 0%, ${color}20 100%)`
      : `${color}20`,
    border: `2px solid ${color}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isCenter ? `0 0 40px ${color}60` : `0 0 20px ${color}30`,
  }) as React.CSSProperties,
  
  // Grid View Styles
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,
  
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  badge: (bg: string, color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 500,
    background: bg,
    color: color,
  }) as React.CSSProperties,
  
  // Hierarchy View Styles
  hierarchyContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  } as React.CSSProperties,
  
  levelSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
  } as React.CSSProperties,
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

function AgentCard({ agent, onClick }: AgentCardProps) {
  const level = levelConfig[agent.level];
  const status = statusConfig[agent.status];
  const sphere = spheres.find(s => s.id === agent.sphere);
  
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: level.bg,
          border: `2px solid ${level.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
        }}>
          {agent.level === 'L0' ? '🌟' : sphere?.icon || '🤖'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={styles.badge(level.bg, level.color)}>{agent.level}</span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: status.color,
              boxShadow: status.pulse ? `0 0 8px ${status.color}` : 'none',
            }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px' }}>
            {agent.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
            {agent.description.slice(0, 80)}...
          </p>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
            {agent.tasksCompleted.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Tâches</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
            {agent.avgResponseTime}ms
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Réponse</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#10b981' }}>
            {agent.accuracy.toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Précision</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
        {agent.capabilities.slice(0, 3).map((cap, i) => (
          <span key={i} style={{
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#9ca3af',
          }}>
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrbitalView({ agents, selectedSphere }: { agents: Agent[]; selectedSphere: string }) {
  const nova = agents.find(a => a.level === 'L0');
  const sphereAgents = agents.filter(a => a.level === 'L1');
  const filteredSphereAgents = selectedSphere === 'all' 
    ? sphereAgents 
    : sphereAgents.filter(a => a.sphere === selectedSphere);
  
  const orbitRadii = [0, 150, 280];
  
  return (
    <div style={styles.orbitalContainer}>
      {/* Orbit Rings */}
      {orbitRadii.slice(1).map((radius, i) => (
        <div key={i} style={styles.orbitRing(radius, '#ffffff')} />
      ))}
      
      {/* Center - Nova */}
      {nova && (
        <div 
          style={styles.agentNode(0, 0, 100, levelConfig.L0.color, true)}
          title={nova.name}
        >
          <span style={{ fontSize: '40px' }}>🌟</span>
        </div>
      )}
      
      {/* L1 - Sphere Agents */}
      {filteredSphereAgents.map((agent, i) => {
        const sphere = spheres.find(s => s.id === agent.sphere);
        const angle = (2 * Math.PI * i) / filteredSphereAgents.length - Math.PI / 2;
        const x = Math.cos(angle) * orbitRadii[1];
        const y = Math.sin(angle) * orbitRadii[1];
        
        return (
          <div
            key={agent.id}
            style={styles.agentNode(x, y, 70, sphere?.color || '#3b82f6', false)}
            title={agent.name}
          >
            <span style={{ fontSize: '28px' }}>{sphere?.icon || '🤖'}</span>
          </div>
        );
      })}
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
          Légende
        </div>
        {Object.entries(levelConfig).map(([level, config]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: config.bg,
              border: `2px solid ${config.color}`,
            }} />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{level} - {config.label}</span>
          </div>
        ))}
      </div>
      
      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>168</div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Agents Actifs</div>
      </div>
    </div>
  );
}

function HierarchyView({ agents, selectedSphere }: { agents: Agent[]; selectedSphere: string }) {
  const levels: AgentLevel[] = ['L0', 'L1', 'L2'];
  
  return (
    <div style={styles.hierarchyContainer}>
      {levels.map(level => {
        const levelAgents = agents.filter(a => {
          if (a.level !== level) return false;
          if (selectedSphere !== 'all' && level !== 'L0' && a.sphere !== selectedSphere) return false;
          return true;
        });
        
        if (levelAgents.length === 0) return null;
        
        const config = levelConfig[level];
        
        return (
          <div key={level} style={styles.levelSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={styles.badge(config.bg, config.color)}>{level}</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
                {config.label}s
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                ({levelAgents.length} agent{levelAgents.length > 1 ? 's' : ''})
              </span>
            </div>
            <div style={styles.grid}>
              {levelAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AgentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('orbital');
  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  const filteredAgents = useMemo(() => {
    return mockAgents.filter(agent => {
      if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedLevel !== 'all' && agent.level !== selectedLevel) return false;
      return true;
    });
  }, [searchQuery, selectedLevel]);
  
  const stats = useMemo(() => ({
    total: 168,
    l0: 1,
    l1: 10,
    l2: 47,
    l3: 110,
    active: mockAgents.filter(a => a.status === 'active').length,
  }), []);
  
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={{ fontSize: '32px' }}>🤖</span>
              Agents CHE·NU
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0' }}>
              Système multi-agents hiérarchique à 4 niveaux
            </p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Agents', value: stats.total, color: '#ffffff', icon: '🤖' },
            { label: 'L0 Nova', value: stats.l0, color: '#10b981', icon: '🌟' },
            { label: 'L1 Sphères', value: stats.l1, color: '#3b82f6', icon: '🔮' },
            { label: 'L2 Domaines', value: stats.l2, color: '#8b5cf6', icon: '⚙️' },
            { label: 'L3 Workers', value: stats.l3, color: '#f59e0b', icon: '👷' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher un agent..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            style={styles.select}
            value={selectedSphere}
            onChange={(e) => setSelectedSphere(e.target.value)}
          >
            <option value="all">Toutes les sphères</option>
            {spheres.map(sphere => (
              <option key={sphere.id} value={sphere.id}>
                {sphere.icon} {sphere.name}
              </option>
            ))}
          </select>
          
          <select
            style={styles.select}
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Tous les niveaux</option>
            <option value="L0">L0 - Orchestrateur</option>
            <option value="L1">L1 - Sphères</option>
            <option value="L2">L2 - Domaines</option>
            <option value="L3">L3 - Workers</option>
          </select>
          
          <div style={styles.viewToggle}>
            {([
              { mode: 'orbital' as ViewMode, icon: '◉', label: 'Orbital' },
              { mode: 'hierarchy' as ViewMode, icon: '≡', label: 'Hiérarchie' },
              { mode: 'grid' as ViewMode, icon: '⊞', label: 'Grille' },
            ]).map(({ mode, icon }) => (
              <button
                key={mode}
                style={styles.viewButton(viewMode === mode)}
                onClick={() => setViewMode(mode)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        {viewMode === 'orbital' && (
          <OrbitalView agents={filteredAgents} selectedSphere={selectedSphere} />
        )}
        
        {viewMode === 'hierarchy' && (
          <HierarchyView agents={filteredAgents} selectedSphere={selectedSphere} />
        )}
        
        {viewMode === 'grid' && (
          <div style={styles.grid}>
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
        
        {/* Architecture Info */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: '0 0 16px' }}>
            Architecture Multi-Agents CHE·NU
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { level: 'L0', name: 'Nova', desc: 'Orchestrateur central unique', count: 1, color: '#10b981' },
              { level: 'L1', name: 'Sphères', desc: 'Agents de coordination par sphère', count: 10, color: '#3b82f6' },
              { level: 'L2', name: 'Domaines', desc: 'Agents spécialisés par domaine', count: 47, color: '#8b5cf6' },
              { level: 'L3', name: 'Workers', desc: 'Agents d\'exécution de tâches', count: 110, color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px',
                background: `${item.color}10`,
                borderRadius: '12px',
                borderLeft: `4px solid ${item.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    ...styles.badge(`${item.color}30`, item.color),
                    fontWeight: 700,
                  }}>{item.level}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{item.name}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px' }}>{item.desc}</p>
                <div style={{ fontSize: '20px', fontWeight: 700, color: item.color }}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
