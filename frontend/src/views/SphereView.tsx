// =============================================================================
// CHE·NU™ — SPHERE VIEW
// Version Finale V51
// Vue détaillée d'une sphère avec catégories et agents
// =============================================================================

import React, { useMemo, useState } from 'react';
import { useThemeStore } from '../stores/theme.store';
import { useUniverseStore } from '../stores/universe.store';
import { useAgentStore } from '../stores/agent.store';
import { getSphereById, SPHERES_DATA } from '../data/spheres.data';
import { SphereId, SphereCategory, Agent } from '../types';

interface SphereViewProps {
  sphereId: SphereId;
  onBack?: () => void;
  onAgentSelect?: (agentId: string) => void;
}

export const SphereView: React.FC<SphereViewProps> = ({
  sphereId,
  onBack,
  onAgentSelect,
}) => {
  const theme = useThemeStore(state => state.theme);
  const { focusSphere } = useUniverseStore();
  const { getAgentsForSphere, selectAgent } = useAgentStore();
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const sphere = useMemo(() => getSphereById(sphereId), [sphereId]);
  const sphereAgents = useMemo(() => getAgentsForSphere(sphereId), [sphereId, getAgentsForSphere]);
  
  if (!sphere) {
    return (
      <div style={{ padding: 24, color: theme.palette.textMuted }}>
        Sphère non trouvée
      </div>
    );
  }
  
  const handleAgentClick = (agentId: string) => {
    selectAgent(agentId);
    onAgentSelect?.(agentId);
  };
  
  const handleBack = () => {
    focusSphere(null);
    onBack?.();
  };
  
  const filteredAgents = activeCategory
    ? sphereAgents.filter(a => a.categoryId === activeCategory)
    : sphereAgents;
  
  return (
    <div
      className="sphere-view"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.bgPrimary,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${theme.palette.borderDefault}`,
          backgroundColor: theme.palette.bgSecondary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Back button */}
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: theme.palette.textMuted,
              cursor: 'pointer',
              padding: 8,
              fontSize: 18,
            }}
          >
            ←
          </button>
          
          {/* Sphere info */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${sphere.color.primary}, ${sphere.color.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            {sphere.emoji}
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {sphere.nameFr}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: theme.palette.textMuted }}>
              {sphere.descriptionFr}
            </p>
          </div>
          
          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: sphere.color.primary }}>
                {sphere.agentCount}
              </div>
              <div style={{ color: theme.palette.textMuted }}>Agents</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: sphere.color.primary }}>
                {sphere.categories.length}
              </div>
              <div style={{ color: theme.palette.textMuted }}>Catégories</div>
            </div>
          </div>
          
          {/* View mode toggle */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 12px',
                  borderRadius: theme.radius.md,
                  border: 'none',
                  backgroundColor: viewMode === mode ? sphere.color.primary : 'transparent',
                  color: viewMode === mode ? '#FFFFFF' : theme.palette.textMuted,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {mode === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Categories sidebar */}
        <aside
          style={{
            width: 220,
            borderRight: `1px solid ${theme.palette.borderDefault}`,
            backgroundColor: theme.palette.bgSecondary,
            overflowY: 'auto',
            padding: 16,
          }}
        >
          <h3 style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            color: theme.palette.textMuted,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Catégories
          </h3>
          
          {/* All agents */}
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              width: '100%',
              padding: '10px 12px',
              marginBottom: 6,
              borderRadius: theme.radius.md,
              border: activeCategory === null 
                ? `2px solid ${sphere.color.primary}` 
                : `1px solid transparent`,
              backgroundColor: activeCategory === null 
                ? `${sphere.color.primary}15` 
                : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 16 }}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: theme.palette.textPrimary, 
                fontSize: 13,
                fontWeight: activeCategory === null ? 600 : 400,
              }}>
                Tous
              </div>
              <div style={{ color: theme.palette.textMuted, fontSize: 11 }}>
                {sphereAgents.length} agents
              </div>
            </div>
          </button>
          
          {/* Category buttons */}
          {sphere.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: 6,
                borderRadius: theme.radius.md,
                border: activeCategory === cat.id 
                  ? `2px solid ${sphere.color.primary}` 
                  : `1px solid transparent`,
                backgroundColor: activeCategory === cat.id 
                  ? `${sphere.color.primary}15` 
                  : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: theme.palette.textPrimary, 
                  fontSize: 13,
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                }}>
                  {cat.name}
                </div>
                <div style={{ color: theme.palette.textMuted, fontSize: 11 }}>
                  {cat.agentCount} agents
                </div>
              </div>
            </button>
          ))}
        </aside>
        
        {/* Agents grid/list */}
        <main
          style={{
            flex: 1,
            padding: 24,
            overflowY: 'auto',
          }}
        >
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              {activeCategory 
                ? sphere.categories.find(c => c.id === activeCategory)?.name 
                : 'Tous les agents'}
            </h2>
            <span style={{ fontSize: 13, color: theme.palette.textMuted }}>
              {filteredAgents.length} agents
            </span>
          </div>
          
          {viewMode === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  sphereColor={sphere.color.primary}
                  onClick={() => handleAgentClick(agent.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredAgents.map((agent) => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  sphereColor={sphere.color.primary}
                  onClick={() => handleAgentClick(agent.id)}
                />
              ))}
            </div>
          )}
          
          {filteredAgents.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: 48, 
              color: theme.palette.textMuted,
            }}>
              Aucun agent dans cette catégorie
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface AgentCardProps {
  agent: Agent;
  sphereColor: string;
  onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, sphereColor, onClick }) => {
  const theme = useThemeStore(state => state.theme);
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.palette.bgSecondary,
        border: `1px solid ${theme.palette.borderDefault}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = sphereColor;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.palette.borderDefault;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: theme.palette.bgTertiary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {agent.emoji}
        </div>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: getLevelColor(agent.level),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {agent.level}
        </div>
      </div>
      
      <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>
        {agent.name}
      </h3>
      <p style={{ margin: 0, fontSize: 12, color: theme.palette.textMuted }}>
        {agent.code}
      </p>
      
      {/* Status */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: agent.status === 'idle' ? '#22C55E' : theme.palette.textMuted,
          }}
        />
        <span style={{ fontSize: 11, color: theme.palette.textMuted }}>
          {agent.status}
        </span>
      </div>
    </div>
  );
};

interface AgentRowProps {
  agent: Agent;
  sphereColor: string;
  onClick: () => void;
}

const AgentRow: React.FC<AgentRowProps> = ({ agent, sphereColor, onClick }) => {
  const theme = useThemeStore(state => state.theme);
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        borderRadius: theme.radius.md,
        backgroundColor: theme.palette.bgSecondary,
        border: `1px solid ${theme.palette.borderDefault}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = sphereColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.palette.borderDefault;
      }}
    >
      <span style={{ fontSize: 20 }}>{agent.emoji}</span>
      
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: getLevelColor(agent.level),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: '#FFFFFF',
        }}
      >
        L{agent.level}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{agent.name}</div>
        <div style={{ fontSize: 12, color: theme.palette.textMuted }}>{agent.code}</div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: agent.status === 'idle' ? '#22C55E' : theme.palette.textMuted,
          }}
        />
        <span style={{ fontSize: 12, color: theme.palette.textMuted }}>
          {agent.status}
        </span>
      </div>
      
      <span style={{ color: theme.palette.textMuted }}>→</span>
    </div>
  );
};

// Helper
const getLevelColor = (level: number): string => {
  const colors: Record<number, string> = {
    0: '#E53935',
    1: '#8E24AA',
    2: '#1E88E5',
    3: '#43A047',
  };
  return colors[level] || '#9E9E9E';
};

export default SphereView;
