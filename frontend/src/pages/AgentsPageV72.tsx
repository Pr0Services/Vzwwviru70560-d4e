/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — AGENTS MARKETPLACE                          ║
 * ║                                                                              ║
 * ║  Browse, filter and hire from 226 agents catalog                             ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// V72 Components
import { AgentGrid } from '../components/agents/AgentGrid';
import { AgentCardV72, LEVEL_CONFIG } from '../components/agents/AgentCardV72';
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// API Hooks
import { useHiredAgents, useHireAgent, useFireAgent } from '../hooks/api';

// Toast notifications
import { useToast } from '../components/toast/ToastProvider';

// Data (Static catalog)
import {
  ALL_AGENTS,
  AGENT_STATS,
  getAgentsByLevel,
  getHireableAgents,
  type AgentDefinition,
  type AgentLevel,
} from '../data/agents-catalog';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface HireModalProps {
  agent: AgentDefinition;
  onConfirm: () => void;
  onCancel: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HIRE MODAL
// ═══════════════════════════════════════════════════════════════════════════════

const HireModal: React.FC<HireModalProps> = ({ agent, onConfirm, onCancel }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(145deg, rgba(30, 35, 32, 0.98) 0%, rgba(25, 30, 28, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          overflow: 'hidden',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${LEVEL_CONFIG[agent.level].bg} 0%, transparent 100%)`,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: '#E8F0E8' }}>
            Embaucher un agent
          </h2>
        </div>

        {/* Agent Preview */}
        <div style={{ padding: 24 }}>
          <AgentCardV72 agent={agent} variant="detailed" showCapabilities />
        </div>

        {/* Confirmation */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#9BA89B' }}>Coût par tâche:</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A' }}>
                {agent.base_cost} ⓣ
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#6B7B6B', margin: 0 }}>
              L'agent sera disponible dans votre équipe et facturé selon votre abonnement.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#9BA89B',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#E8F0E8',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✓ Confirmer l'embauche
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════════

const AgentDetailPanel: React.FC<{
  agent: AgentDefinition | null;
  onClose: () => void;
  onHire: (agent: AgentDefinition) => void;
  isHired: boolean;
}> = ({ agent, onClose, onHire, isHired }) => {
  if (!agent) return null;

  const levelConfig = LEVEL_CONFIG[agent.level];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 420,
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(30, 35, 32, 0.98) 0%, rgba(25, 30, 28, 0.98) 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          background: `linear-gradient(135deg, ${levelConfig.bg} 0%, transparent 100%)`,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'sticky',
          top: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, color: '#E8F0E8' }}>
            Détails de l'agent
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7B6B',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {/* Avatar & Name */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: levelConfig.bg,
              border: `2px solid ${levelConfig.border}`,
              borderRadius: 20,
              fontSize: 40,
            }}
          >
            {agent.avatar}
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#E8F0E8' }}>
            {agent.name_fr}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <span
              style={{
                padding: '4px 10px',
                background: levelConfig.bg,
                border: `1px solid ${levelConfig.border}`,
                borderRadius: 6,
                fontSize: 11,
                color: levelConfig.color,
                fontWeight: 600,
              }}
            >
              {agent.level} • {LEVEL_CONFIG[agent.level].label}
            </span>
            <span
              style={{
                padding: '4px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 6,
                fontSize: 11,
                color: '#8B9B8B',
              }}
            >
              {agent.domain}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 8px' }}>Description</h4>
          <p style={{ fontSize: 13, color: '#9BA89B', lineHeight: 1.6, margin: 0 }}>
            {agent.description_fr}
          </p>
        </div>

        {/* Capabilities */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 12px' }}>Capacités</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {agent.capabilities.map((cap, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(62, 180, 162, 0.1)',
                  border: '1px solid rgba(62, 180, 162, 0.2)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: '#3EB4A2',
                }}
              >
                {cap.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 8px' }}>Personnalité</h4>
            <p style={{ fontSize: 12, color: '#9BA89B', margin: 0 }}>{agent.personality}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 8px' }}>Communication</h4>
            <p style={{ fontSize: 12, color: '#9BA89B', margin: 0 }}>{agent.communication_style}</p>
          </div>
        </div>

        {/* Cost & Hire */}
        {agent.is_hireable && (
          <div
            style={{
              padding: 16,
              background: 'rgba(216, 178, 106, 0.08)',
              border: '1px solid rgba(216, 178, 106, 0.2)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#9BA89B' }}>Coût par tâche</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#D8B26A' }}>
                {agent.base_cost} ⓣ
              </span>
            </div>
            <button
              onClick={() => onHire(agent)}
              disabled={isHired}
              style={{
                width: '100%',
                padding: '14px',
                background: isHired
                  ? 'rgba(107, 142, 107, 0.2)'
                  : 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)',
                border: 'none',
                borderRadius: 10,
                color: isHired ? '#6B8E6B' : '#E8F0E8',
                fontSize: 14,
                fontWeight: 600,
                cursor: isHired ? 'default' : 'pointer',
              }}
            >
              {isHired ? '✓ Déjà embauché' : 'Embaucher cet agent'}
            </button>
          </div>
        )}

        {!agent.is_hireable && (
          <div
            style={{
              padding: 16,
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: '#8B5CF6' }}>
              🔒 Agent système — Non disponible à l'embauche
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const AgentsPageV72: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // API Data
  const { data: hiredAgentsData, isLoading: hiredLoading } = useHiredAgents();
  const hireAgentMutation = useHireAgent();
  const fireAgentMutation = useFireAgent();
  
  // Toast notifications
  const toast = useToast();
  
  // Derive hired agent IDs from API data
  const hiredAgentIds = useMemo(() => {
    return hiredAgentsData?.map(a => a.id) || [];
  }, [hiredAgentsData]);

  // State
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const [agentToHire, setAgentToHire] = useState<AgentDefinition | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check for hire param on load
  React.useEffect(() => {
    const hireId = searchParams.get('hire');
    if (hireId) {
      const agent = ALL_AGENTS.find(a => a.id === hireId);
      if (agent && agent.is_hireable) {
        setAgentToHire(agent);
      }
    }
  }, [searchParams]);

  // Handlers
  const handleHire = useCallback((agent: AgentDefinition) => {
    setAgentToHire(agent);
  }, []);

  const handleConfirmHire = useCallback(() => {
    if (agentToHire) {
      hireAgentMutation.mutate(
        { agent_id: agentToHire.id },
        {
          onSuccess: () => {
            toast.success(`${agentToHire.name} engagé`, 'L\'agent est maintenant actif');
            setAgentToHire(null);
          },
          onError: () => {
            toast.error('Erreur', `Impossible d'engager ${agentToHire.name}`);
          },
        }
      );
    }
  }, [agentToHire, hireAgentMutation, toast]);

  const handleSelect = useCallback((agent: AgentDefinition) => {
    setSelectedAgent(agent);
  }, []);

  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action) {
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'nova-chat':
        navigate('/nova');
        break;
      default:
        break;
    }
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') {
        setSelectedAgent(null);
        setAgentToHire(null);
        setIsSearchOpen(false);
      }
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: selectedAgent ? 'calc(100% - 440px)' : 1400,
          margin: '0 auto',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6B7B6B',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ← Retour
            </button>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#E8F0E8', margin: '0 0 8px' }}>
            🤖 Marketplace Agents
          </h1>
          <p style={{ color: '#6B7B6B', fontSize: 13, margin: 0 }}>
            {AGENT_STATS.total} agents disponibles • {AGENT_STATS.hireable} embauchables • {hiredAgentIds.length} dans votre équipe
          </p>
        </div>

        {/* Level Stats */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >
          {(['L0', 'L1', 'L2', 'L3'] as AgentLevel[]).map((level) => {
            const config = LEVEL_CONFIG[level];
            const count = AGENT_STATS.by_level[level];
            
            return (
              <div
                key={level}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: 8,
                  minWidth: 140,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: config.color,
                  }}
                >
                  {level}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: config.color }}>{count}</div>
                  <div style={{ fontSize: 10, color: '#6B7B6B' }}>{config.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agent Grid */}
        <AgentGrid
          variant="default"
          onHire={handleHire}
          onSelect={handleSelect}
          hiredAgentIds={hiredAgentIds}
          selectedAgentId={selectedAgent?.id}
          showFilters
          showStats={false}
          columns={selectedAgent ? 2 : 3}
        />
      </div>

      {/* Detail Panel */}
      <AgentDetailPanel
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onHire={handleHire}
        isHired={selectedAgent ? hiredAgentIds.includes(selectedAgent.id) : false}
      />

      {/* Hire Modal */}
      {agentToHire && (
        <HireModal
          agent={agentToHire}
          onConfirm={handleConfirmHire}
          onCancel={() => setAgentToHire(null)}
        />
      )}

      {/* Quick Actions */}
      <QuickActionsFAB onAction={handleQuickAction} />

      {/* Search */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => {
          if (result.path) navigate(result.path);
        }}
        onNavigate={navigate}
      />
    </div>
  );
};

export default AgentsPageV72;
