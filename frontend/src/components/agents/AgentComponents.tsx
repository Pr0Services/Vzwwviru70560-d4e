// CHE·NU™ Agent Components — AI Agent Interface

import React, { useState } from 'react';
import type { Agent, AgentLevel, AgentType, AgentExecution } from '../../types';
import { CHENU_COLORS } from '../../types';

// ============================================================
// STYLES
// ============================================================

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  
  card: (isActive: boolean, level: AgentLevel) => {
    const levelColors: Record<AgentLevel, string> = {
      L0: CHENU_COLORS.sacredGold,
      L1: CHENU_COLORS.cenoteTurquoise,
      L2: CHENU_COLORS.jungleEmerald,
      L3: CHENU_COLORS.ancientStone,
    };
    return {
      backgroundColor: '#111113',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${isActive ? levelColors[level] + '44' : CHENU_COLORS.ancientStone + '22'}`,
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    };
  },
  
  levelBadge: (level: AgentLevel) => {
    const colors: Record<AgentLevel, string> = {
      L0: CHENU_COLORS.sacredGold,
      L1: CHENU_COLORS.cenoteTurquoise,
      L2: CHENU_COLORS.jungleEmerald,
      L3: CHENU_COLORS.ancientStone,
    };
    return {
      position: 'absolute' as const,
      top: '16px',
      right: '16px',
      padding: '4px 10px',
      backgroundColor: colors[level] + '22',
      color: colors[level],
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 700,
    };
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  
  avatar: (level: AgentLevel) => {
    const colors: Record<AgentLevel, string> = {
      L0: CHENU_COLORS.sacredGold,
      L1: CHENU_COLORS.cenoteTurquoise,
      L2: CHENU_COLORS.jungleEmerald,
      L3: CHENU_COLORS.ancientStone,
    };
    return {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      backgroundColor: colors[level] + '22',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    };
  },
  
  name: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  
  code: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    fontFamily: 'monospace',
  },
  
  description: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  
  capabilities: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '16px',
  },
  
  capability: {
    padding: '4px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}15`,
  },
  
  status: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: isActive ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
  }),
  
  statusDot: (isActive: boolean) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isActive ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
  }),
  
  executeButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  systemBadge: {
    position: 'absolute' as const,
    top: '16px',
    left: '16px',
    padding: '2px 8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
  },
};

// ============================================================
// AGENT CARD
// ============================================================

interface AgentCardProps {
  agent: Agent;
  onExecute?: (agent: Agent) => void;
  onSelect?: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onExecute, onSelect }) => {
  const typeIcons: Record<AgentType, string> = {
    orchestrator: '🎭',
    specialist: '🔬',
    support: '🛠️',
    analyzer: '📊',
  };

  return (
    <div 
      style={styles.card(agent.is_active, agent.agent_level)}
      onClick={() => onSelect?.(agent)}
    >
      {agent.is_system && <span style={styles.systemBadge}>SYSTEM</span>}
      <span style={styles.levelBadge(agent.agent_level)}>{agent.agent_level}</span>
      
      <div style={styles.header}>
        <div style={styles.avatar(agent.agent_level)}>
          {typeIcons[agent.agent_type]}
        </div>
        <div>
          <div style={styles.name}>{agent.name_en}</div>
          <div style={styles.code}>{agent.code}</div>
        </div>
      </div>
      
      {agent.description && (
        <p style={styles.description}>{agent.description}</p>
      )}
      
      {agent.capabilities && agent.capabilities.length > 0 && (
        <div style={styles.capabilities}>
          {agent.capabilities.slice(0, 4).map((cap, idx) => (
            <span key={idx} style={styles.capability}>{cap}</span>
          ))}
          {agent.capabilities.length > 4 && (
            <span style={styles.capability}>+{agent.capabilities.length - 4}</span>
          )}
        </div>
      )}
      
      <div style={styles.footer}>
        <div style={styles.status(agent.is_active)}>
          <span style={styles.statusDot(agent.is_active)} />
          {agent.is_active ? 'Active' : 'Inactive'}
        </div>
        
        {agent.is_active && !agent.is_system && onExecute && (
          <button
            style={styles.executeButton}
            onClick={(e) => {
              e.stopPropagation();
              onExecute(agent);
            }}
          >
            Execute
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// AGENT GRID
// ============================================================

interface AgentGridProps {
  agents: Agent[];
  onExecute?: (agent: Agent) => void;
  onSelect?: (agent: Agent) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({ agents, onExecute, onSelect }) => (
  <div style={styles.grid}>
    {agents.map((agent) => (
      <AgentCard
        key={agent.id}
        agent={agent}
        onExecute={onExecute}
        onSelect={onSelect}
      />
    ))}
  </div>
);

// ============================================================
// AGENT LEVEL FILTER
// ============================================================

interface AgentLevelFilterProps {
  selectedLevels: AgentLevel[];
  onChange: (levels: AgentLevel[]) => void;
}

export const AgentLevelFilter: React.FC<AgentLevelFilterProps> = ({ selectedLevels, onChange }) => {
  const levels: AgentLevel[] = ['L0', 'L1', 'L2', 'L3'];
  const levelDescriptions: Record<AgentLevel, string> = {
    L0: 'Nova (System)',
    L1: 'Orchestrators',
    L2: 'Specialists',
    L3: 'Support',
  };
  const levelColors: Record<AgentLevel, string> = {
    L0: CHENU_COLORS.sacredGold,
    L1: CHENU_COLORS.cenoteTurquoise,
    L2: CHENU_COLORS.jungleEmerald,
    L3: CHENU_COLORS.ancientStone,
  };

  const toggleLevel = (level: AgentLevel) => {
    if (selectedLevels.includes(level)) {
      onChange(selectedLevels.filter(l => l !== level));
    } else {
      onChange([...selectedLevels, level]);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      {levels.map((level) => {
        const isSelected = selectedLevels.includes(level);
        return (
          <button
            key={level}
            onClick={() => toggleLevel(level)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${isSelected ? levelColors[level] : CHENU_COLORS.ancientStone}44`,
              backgroundColor: isSelected ? levelColors[level] + '22' : 'transparent',
              color: isSelected ? levelColors[level] : CHENU_COLORS.ancientStone,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isSelected ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {level} — {levelDescriptions[level]}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================
// AGENT EXECUTION PANEL
// ============================================================

interface AgentExecutionPanelProps {
  agent: Agent;
  onExecute: (inputData: unknown) => Promise<void>;
  onCancel: () => void;
}

export const AgentExecutionPanel: React.FC<AgentExecutionPanelProps> = ({ agent, onExecute, onCancel }) => {
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!input.trim()) return;
    setIsExecuting(true);
    try {
      await onExecute({ prompt: input.trim() });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#111113',
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.avatar(agent.agent_level)}>🤖</div>
          <div>
            <h3 style={{ color: CHENU_COLORS.softSand, fontSize: '18px', marginBottom: '4px' }}>
              Execute: {agent.name_en}
            </h3>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{agent.code}</span>
          </div>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: CHENU_COLORS.ancientStone,
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ×
        </button>
      </div>

      {agent.capabilities && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '8px' }}>Capabilities:</p>
          <div style={styles.capabilities}>
            {agent.capabilities.map((cap, idx) => (
              <span key={idx} style={styles.capability}>{cap}</span>
            ))}
          </div>
        </div>
      )}

      {agent.constraints && agent.constraints.length > 0 && (
        <div style={{
          backgroundColor: CHENU_COLORS.earthEmber + '11',
          border: `1px solid ${CHENU_COLORS.earthEmber}22`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '12px', color: CHENU_COLORS.earthEmber, marginBottom: '6px' }}>⚠️ Constraints:</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
            {agent.constraints.map((constraint, idx) => (
              <li key={idx}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '8px' }}>
          Input for Agent
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you want the agent to do..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            backgroundColor: '#0a0a0b',
            color: CHENU_COLORS.softSand,
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical' as const,
            fontFamily: 'inherit',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#0a0a0b',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Estimated Cost</p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: CHENU_COLORS.sacredGold }}>~150-300 tokens</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Provider</p>
          <p style={{ fontSize: '14px', color: CHENU_COLORS.softSand }}>{agent.llm_provider || 'Anthropic'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            backgroundColor: 'transparent',
            color: CHENU_COLORS.softSand,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleExecute}
          disabled={isExecuting || !input.trim()}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: CHENU_COLORS.sacredGold,
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            opacity: isExecuting || !input.trim() ? 0.6 : 1,
          }}
        >
          {isExecuting ? 'Executing...' : 'Execute Agent'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// EXECUTION STATUS
// ============================================================

interface ExecutionStatusProps {
  execution: AgentExecution;
}

export const ExecutionStatus: React.FC<ExecutionStatusProps> = ({ execution }) => {
  const statusColors: Record<string, string> = {
    pending: CHENU_COLORS.ancientStone,
    running: CHENU_COLORS.cenoteTurquoise,
    completed: CHENU_COLORS.jungleEmerald,
    failed: '#e74c3c',
    cancelled: CHENU_COLORS.earthEmber,
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#111113',
      borderRadius: '8px',
      border: `1px solid ${statusColors[execution.status]}44`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: statusColors[execution.status],
          }} />
          <span style={{ color: statusColors[execution.status], fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>
            {execution.status}
          </span>
        </div>
        <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>
          {execution.input_tokens + execution.output_tokens} tokens • ${execution.total_cost.toFixed(4)}
        </span>
      </div>
    </div>
  );
};

export default AgentCard;
