/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT MANAGER (CANONICAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES FONDAMENTALES:
 * 
 * Nova:
 * - est l'intelligence SYSTÈME
 * - est toujours présente
 * - gère la guidance, la mémoire, la gouvernance
 * - supervise les bases de données et les threads
 * - N'EST JAMAIS un agent engagé
 * 
 * User Orchestrator:
 * - est engagé par l'utilisateur
 * - exécute les tâches
 * - gère les agents
 * - respecte la portée, le budget et la gouvernance
 * - peut être remplacé ou personnalisé
 * 
 * Agents:
 * - ont des coûts
 * - ont des portées
 * - ont une compatibilité d'encodage
 * - agissent SEULEMENT quand autorisés
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import {
  MinimalAgent,
  AgentCapability,
  SYSTEM_AGENTS,
  AGENT_HIERARCHY
} from '../../canonical/MINIMAL_AGENTS_CANONICAL';
import { SphereId } from '../../canonical/SPHERES_CANONICAL_V2';

interface AgentManagerCanonicalProps {
  userId: string;
  activeSphere?: SphereId;
  agents: MinimalAgent[];
  onHireAgent: (agentId: string) => void;
  onFireAgent: (agentId: string) => void;
  onConfigureAgent: (agentId: string, config: Record<string, any>) => void;
  language?: 'en' | 'fr';
}

export const AgentManagerCanonical: React.FC<AgentManagerCanonicalProps> = ({
  userId,
  activeSphere,
  agents,
  onHireAgent,
  onFireAgent,
  onConfigureAgent,
  language = 'fr'
}) => {
  const [selectedAgent, setSelectedAgent] = useState<MinimalAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'system' | 'hired' | 'available'>('system');

  const labels = {
    en: {
      title: 'Agent Manager',
      subtitle: 'AI agents management',
      system: 'System Agents',
      hired: 'Hired Agents',
      available: 'Available',
      nova: 'Nova - System Intelligence',
      novaDesc: 'Always present. Handles guidance, memory, governance.',
      orchestrator: 'User Orchestrator',
      orchestratorDesc: 'Executes tasks, manages agents, respects governance.',
      hire: 'Hire',
      fire: 'Fire',
      configure: 'Configure',
      cost: 'Cost',
      scope: 'Scope',
      capabilities: 'Capabilities',
      level: 'Level',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      warning: 'Nova is NEVER a hired agent. Always present.',
      levels: {
        L0: 'System (L0)',
        L1: 'Domain Director (L1)',
        L2: 'Specialist (L2)',
        L3: 'Task Agent (L3)'
      }
    },
    fr: {
      title: 'Gestionnaire d\'Agents',
      subtitle: 'Gestion des agents IA',
      system: 'Agents Système',
      hired: 'Agents Engagés',
      available: 'Disponibles',
      nova: 'Nova - Intelligence Système',
      novaDesc: 'Toujours présente. Gère guidance, mémoire, gouvernance.',
      orchestrator: 'Orchestrateur Utilisateur',
      orchestratorDesc: 'Exécute les tâches, gère les agents, respecte la gouvernance.',
      hire: 'Engager',
      fire: 'Licencier',
      configure: 'Configurer',
      cost: 'Coût',
      scope: 'Portée',
      capabilities: 'Capacités',
      level: 'Niveau',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      warning: 'Nova N\'EST JAMAIS un agent engagé. Toujours présente.',
      levels: {
        L0: 'Système (L0)',
        L1: 'Directeur Domaine (L1)',
        L2: 'Spécialiste (L2)',
        L3: 'Agent Tâche (L3)'
      }
    }
  };

  const t = labels[language];

  // Categorize agents
  const systemAgents = useMemo(() => 
    agents.filter(a => a.level === 'L0'),
    [agents]
  );

  const hiredAgents = useMemo(() =>
    agents.filter(a => a.level !== 'L0' && a.status === 'active'),
    [agents]
  );

  const availableAgents = useMemo(() =>
    agents.filter(a => a.level !== 'L0' && a.status !== 'active'),
    [agents]
  );

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      L0: '#D8B26A',
      L1: '#3B82F6',
      L2: '#8B5CF6',
      L3: '#3F7249'
    };
    return colors[level] || '#8D8371';
  };

  const getCapabilityIcon = (capability: AgentCapability): string => {
    const icons: Record<AgentCapability, string> = {
      reasoning: '🧠',
      search: '🔍',
      memory: '💾',
      governance: '⚖️',
      execution: '⚡',
      communication: '💬',
      analysis: '📊',
      creation: '✨'
    };
    return icons[capability] || '📦';
  };

  const renderAgentCard = (agent: MinimalAgent, showActions: boolean = false) => (
    <div
      key={agent.id}
      onClick={() => setSelectedAgent(agent)}
      style={{
        padding: '16px',
        background: selectedAgent?.id === agent.id ? '#2F4C39' : '#2A2B2E',
        borderRadius: '8px',
        border: `1px solid ${selectedAgent?.id === agent.id ? '#3F7249' : '#3A3B3E'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{agent.icon}</span>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>
              {language === 'fr' ? agent.nameFr : agent.name}
            </div>
            <div style={{ fontSize: '12px', color: '#8D8371', marginTop: '2px' }}>
              {language === 'fr' ? agent.descriptionFr : agent.description}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '4px 8px',
            background: getLevelColor(agent.level),
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 600
          }}
        >
          {t.levels[agent.level as keyof typeof t.levels]}
        </div>
      </div>

      {/* Capabilities */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
        {agent.capabilities.map(cap => (
          <span
            key={cap}
            style={{
              padding: '2px 6px',
              background: '#1E1F22',
              borderRadius: '4px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {getCapabilityIcon(cap)} {cap}
          </span>
        ))}
      </div>

      {/* Cost & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ fontSize: '12px', color: '#8D8371' }}>
          {t.cost}: <span style={{ color: '#D8B26A' }}>🪙 {agent.tokenCost}/task</span>
        </div>
        <span
          style={{
            padding: '4px 8px',
            background: agent.status === 'active' ? 'rgba(63,114,73,0.3)' : 'rgba(141,131,113,0.3)',
            borderRadius: '4px',
            fontSize: '11px',
            color: agent.status === 'active' ? '#3F7249' : '#8D8371'
          }}
        >
          {agent.status === 'active' ? t.active : t.inactive}
        </span>
      </div>

      {/* Actions */}
      {showActions && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {agent.status !== 'active' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onHireAgent(agent.id); }}
              style={{
                flex: 1,
                padding: '8px',
                background: '#3F7249',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {t.hire}
            </button>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onConfigureAgent(agent.id, {}); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#3B82F6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {t.configure}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onFireAgent(agent.id); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#7A593A',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {t.fire}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="agent-manager-canonical"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1E1F22',
        color: '#E9E4D6'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #3A3B3E',
          background: '#2A2B2E'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#D8B26A' }}>{t.title}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#8D8371' }}>{t.subtitle}</p>
          </div>
        </div>

        {/* Warning */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'rgba(216,178,106,0.1)',
            borderLeft: '3px solid #D8B26A',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#D8B26A'
          }}
        >
          ⚠️ {t.warning}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
          {(['system', 'hired', 'available'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab ? '#3A3B3E' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: activeTab === tab ? '#E9E4D6' : '#8D8371',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {t[tab]} ({
                tab === 'system' ? systemAgents.length :
                tab === 'hired' ? hiredAgents.length :
                availableAgents.length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {/* System Agents */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Nova - Special Display */}
            <div
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #2F4C39 0%, #1E1F22 100%)',
                borderRadius: '12px',
                border: '2px solid #D8B26A'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '40px' }}>🌟</span>
                <div>
                  <h3 style={{ margin: 0, color: '#D8B26A', fontSize: '18px' }}>{t.nova}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#E9E4D6', fontSize: '13px' }}>{t.novaDesc}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <span style={{ padding: '4px 8px', background: '#D8B26A', borderRadius: '4px', fontSize: '11px', color: '#1E1F22', fontWeight: 600 }}>
                      SYSTÈME
                    </span>
                    <span style={{ padding: '4px 8px', background: 'rgba(216,178,106,0.2)', borderRadius: '4px', fontSize: '11px', color: '#D8B26A' }}>
                      TOUJOURS ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other System Agents */}
            {systemAgents.filter(a => a.id !== 'nova').map(agent => renderAgentCard(agent, false))}
          </div>
        )}

        {/* Hired Agents */}
        {activeTab === 'hired' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hiredAgents.length > 0 ? (
              hiredAgents.map(agent => renderAgentCard(agent, true))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8D8371' }}>
                {language === 'fr' ? 'Aucun agent engagé' : 'No hired agents'}
              </div>
            )}
          </div>
        )}

        {/* Available Agents */}
        {activeTab === 'available' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availableAgents.length > 0 ? (
              availableAgents.map(agent => renderAgentCard(agent, true))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8D8371' }}>
                {language === 'fr' ? 'Aucun agent disponible' : 'No available agents'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagerCanonical;
