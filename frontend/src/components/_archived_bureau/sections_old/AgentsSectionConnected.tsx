/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENTS SECTION CONNECTED                        ║
 * ║                    Connecté au agentStore (Zustand)                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * AGENTS & ROLES:
 * 
 * Nova: System intelligence (NEVER hired, always present)
 * Orchestrator: User's main agent (hired, executes tasks)
 * Specialists: Domain experts (hired as needed)
 * 
 * Agents:
 * - have costs
 * - have scopes  
 * - have encoding compatibility
 * - act ONLY when authorized (Law 7)
 */

import React, { useCallback, useMemo } from 'react';
import { useAgentStore, Agent, AgentType, AgentStatus, AgentCapability } from '../../stores/agent.store';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentsSectionConnectedProps {
  sphereId: string;
  projectId?: string;
}

// Agent type config
const AGENT_TYPE_CONFIG: Record<AgentType, { icon: string; label: string; color: string }> = {
  nova: { icon: '🌟', label: 'Nova', color: CHENU_COLORS.sacredGold },
  orchestrator: { icon: '🎯', label: 'Orchestrator', color: CHENU_COLORS.cenoteTurquoise },
  specialist: { icon: '🔧', label: 'Specialist', color: CHENU_COLORS.jungleEmerald },
  assistant: { icon: '🤝', label: 'Assistant', color: '#9b59b6' },
  analyzer: { icon: '📊', label: 'Analyzer', color: CHENU_COLORS.earthEmber },
};

// Agent status config
const STATUS_CONFIG: Record<AgentStatus, { icon: string; label: string; color: string }> = {
  idle: { icon: '⚪', label: 'Disponible', color: CHENU_COLORS.jungleEmerald },
  thinking: { icon: '🤔', label: 'Réflexion', color: CHENU_COLORS.sacredGold },
  executing: { icon: '⚡', label: 'Exécution', color: CHENU_COLORS.cenoteTurquoise },
  waiting: { icon: '⏳', label: 'En attente', color: '#f39c12' },
  error: { icon: '❌', label: 'Erreur', color: '#e74c3c' },
  offline: { icon: '⭕', label: 'Hors ligne', color: CHENU_COLORS.ancientStone },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, color: CHENU_COLORS.softSand },
  storeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    borderRadius: '12px',
    fontSize: '10px',
    color: CHENU_COLORS.jungleEmerald,
  },
  // Nova Section
  novaSection: {
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: `2px solid ${CHENU_COLORS.sacredGold}44`,
  },
  novaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '12px',
  },
  novaTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  novaDescription: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '16px',
  },
  novaStats: {
    display: 'flex',
    gap: '24px',
  },
  novaStat: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  novaStatValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
  },
  novaStatLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  // Tabs
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    paddingBottom: '12px',
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
  // Agents Grid
  agentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  agentCard: (isHired: boolean, isSystem: boolean) => ({
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${isSystem ? CHENU_COLORS.sacredGold : isHired ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone}44`,
    transition: 'all 0.2s ease',
  }),
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  agentAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  agentInfo: {
    flex: 1,
    marginLeft: '12px',
  },
  agentName: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  agentType: (type: AgentType) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: AGENT_TYPE_CONFIG[type].color + '22',
    color: AGENT_TYPE_CONFIG[type].color,
    textTransform: 'uppercase' as const,
  }),
  agentStatus: (status: AgentStatus) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '11px',
    backgroundColor: STATUS_CONFIG[status].color + '22',
    color: STATUS_CONFIG[status].color,
  }),
  agentDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
    lineHeight: 1.4,
  },
  capabilitiesSection: {
    marginBottom: '12px',
  },
  capabilitiesLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '6px',
  },
  capabilitiesList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  capabilityBadge: {
    padding: '3px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  agentMetrics: {
    display: 'flex',
    gap: '16px',
    padding: '12px 0',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    marginTop: '12px',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  metricLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  agentActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  hireButton: (isHired: boolean) => ({
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isHired ? '#e74c3c22' : CHENU_COLORS.sacredGold,
    color: isHired ? '#e74c3c' : '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  }),
  configButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: CHENU_COLORS.ancientStone,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentCardProps {
  agent: Agent;
  isHired: boolean;
  onHire: () => void;
  onFire: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isHired, onHire, onFire }) => {
  return (
    <div style={styles.agentCard(isHired, agent.isSystem)}>
      <div style={styles.agentHeader}>
        <div style={styles.agentAvatar}>
          {agent.avatar || AGENT_TYPE_CONFIG[agent.type].icon}
        </div>
        <div style={styles.agentInfo}>
          <div style={styles.agentName}>{agent.name}</div>
          <span style={styles.agentType(agent.type)}>
            {AGENT_TYPE_CONFIG[agent.type].label}
          </span>
        </div>
        <span style={styles.agentStatus(agent.status)}>
          {STATUS_CONFIG[agent.status].icon} {STATUS_CONFIG[agent.status].label}
        </span>
      </div>

      <p style={styles.agentDescription}>{agent.description}</p>

      {agent.capabilities.length > 0 && (
        <div style={styles.capabilitiesSection}>
          <div style={styles.capabilitiesLabel}>Capacités</div>
          <div style={styles.capabilitiesList}>
            {agent.capabilities.slice(0, 4).map(cap => (
              <span key={cap.id} style={styles.capabilityBadge}>
                {cap.name} ({cap.proficiency}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={styles.agentMetrics}>
        <div style={styles.metric}>
          <span style={styles.metricValue}>{agent.metrics.tasksCompleted}</span>
          <span style={styles.metricLabel}>Tâches</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricValue}>{agent.metrics.userRating.toFixed(1)}⭐</span>
          <span style={styles.metricLabel}>Note</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricValue}>${agent.baseCostPerToken}</span>
          <span style={styles.metricLabel}>Coût/token</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricValue}>{agent.encodingCompatibility}%</span>
          <span style={styles.metricLabel}>Encodage</span>
        </div>
      </div>

      {!agent.isSystem && (
        <div style={styles.agentActions}>
          <button
            style={styles.hireButton(isHired)}
            onClick={isHired ? onFire : onHire}
          >
            {isHired ? '🚫 Licencier' : '✅ Engager'}
          </button>
          {isHired && (
            <button style={styles.configButton}>
              ⚙️ Config
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AgentsSectionConnected: React.FC<AgentsSectionConnectedProps> = ({
  sphereId,
  projectId,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNEXION AU STORE
  // ─────────────────────────────────────────────────────────────────────────────
  const {
    nova,
    hiredAgents,
    availableAgents,
    hireAgent,
    fireAgent,
    isAgentHired,
    getNovaStatus,
    getAgentsBySphere,
  } = useAgentStore();

  // Local state
  const [activeTab, setActiveTab] = React.useState<'hired' | 'available' | 'all'>('hired');

  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES
  // ─────────────────────────────────────────────────────────────────────────────
  const hiredAgentsList = useMemo(() => {
    return Object.values(hiredAgents);
  }, [hiredAgents]);

  const availableAgentsList = useMemo(() => {
    return availableAgents.filter(a => !isAgentHired(a.id));
  }, [availableAgents, isAgentHired]);

  // @ts-ignore
  const sphereAgents = useMemo(() => {
    return getAgentsBySphere(sphereId as any);
  }, [getAgentsBySphere, sphereId, hiredAgents]);

  const displayedAgents = useMemo(() => {
    switch (activeTab) {
      case 'hired':
        return hiredAgentsList;
      case 'available':
        return availableAgentsList;
      case 'all':
        return [...hiredAgentsList, ...availableAgentsList];
      default:
        return hiredAgentsList;
    }
  }, [activeTab, hiredAgentsList, availableAgentsList]);

  const novaStatus = getNovaStatus();

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleHireAgent = useCallback((agentId: string) => {
    hireAgent(agentId);
  }, [hireAgent]);

  const handleFireAgent = useCallback((agentId: string) => {
    fireAgent(agentId);
  }, [fireAgent]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={styles.title}>Agents</h2>
          <span style={styles.storeIndicator}>
            🔗 Store connecté • {hiredAgentsList.length} engagés
          </span>
        </div>
      </div>

      {/* Nova Section - System Agent */}
      <div style={styles.novaSection}>
        <div style={styles.novaBadge}>
          🌟 INTELLIGENCE SYSTÈME
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={styles.novaTitle}>{nova.name}</h3>
            <p style={styles.novaDescription}>{nova.description}</p>
          </div>
          <span style={styles.agentStatus(novaStatus)}>
            {STATUS_CONFIG[novaStatus].icon} {STATUS_CONFIG[novaStatus].label}
          </span>
        </div>
        <div style={styles.novaStats}>
          <div style={styles.novaStat}>
            <span style={styles.novaStatValue}>{nova.metrics.tasksCompleted}</span>
            <span style={styles.novaStatLabel}>Tâches complétées</span>
          </div>
          <div style={styles.novaStat}>
            <span style={styles.novaStatValue}>{nova.metrics.totalTokensUsed.toLocaleString()}</span>
            <span style={styles.novaStatLabel}>Tokens utilisés</span>
          </div>
          <div style={styles.novaStat}>
            <span style={styles.novaStatValue}>{(nova.metrics.tasksSuccessful / Math.max(1, nova.metrics.tasksCompleted) * 100).toFixed(1)}%</span>
            <span style={styles.novaStatLabel}>Taux de succès</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={styles.tab(activeTab === 'hired')}
          onClick={() => setActiveTab('hired')}
        >
          ✅ Engagés ({hiredAgentsList.length})
        </button>
        <button
          style={styles.tab(activeTab === 'available')}
          onClick={() => setActiveTab('available')}
        >
          🔍 Disponibles ({availableAgentsList.length})
        </button>
        <button
          style={styles.tab(activeTab === 'all')}
          onClick={() => setActiveTab('all')}
        >
          📋 Tous
        </button>
      </div>

      {/* Agents Grid */}
      <div style={styles.agentsGrid}>
        {displayedAgents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent as Agent}
            isHired={isAgentHired(agent.id)}
            onHire={() => handleHireAgent(agent.id)}
            onFire={() => handleFireAgent(agent.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayedAgents.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</p>
          <p>
            {activeTab === 'hired' 
              ? "Aucun agent engagé. Explorez les agents disponibles!"
              : "Aucun agent disponible dans cette catégorie."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentsSectionConnected;
