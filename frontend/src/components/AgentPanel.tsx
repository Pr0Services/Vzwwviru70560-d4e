/**
 * CHE·NU - Agent Panel (Simple)
 * Panel latéral pour afficher les agents actifs
 */

import React, { useState } from 'react';

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'working';
  avatar?: string;
}

const mockAgents: AgentInfo[] = [
  { id: '1', name: 'Nova', role: 'Assistant Principal', status: 'active' },
  { id: '2', name: 'Orchestrator', role: 'Coordinateur', status: 'idle' },
  { id: '3', name: 'Analyzer', role: 'Analyse de données', status: 'working' },
];

const statusColors = {
  active: '#22c55e',
  idle: '#9ca3af',
  working: '#f59e0b'
};

const statusLabels = {
  active: 'Actif',
  idle: 'En attente',
  working: 'En cours'
};

const AgentPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [agents] = useState<AgentInfo[]>(mockAgents);

  return (
    <div style={{
      position: 'fixed',
      right: isExpanded ? '0' : '-280px',
      top: '60px',
      width: '320px',
      height: 'calc(100vh - 60px)',
      backgroundColor: '#1f2937',
      borderLeft: '1px solid #374151',
      transition: 'right 0.3s ease',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '20px',
          width: '40px',
          height: '40px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px 0 0 8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        {isExpanded ? '→' : '🤖'}
      </button>

      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #374151'
      }}>
        <h3 style={{ margin: 0, color: '#f9fafb', fontSize: '16px' }}>
          Agents CHE·NU
        </h3>
        <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '12px' }}>
          {agents.filter(a => a.status !== 'idle').length} agent(s) actif(s)
        </p>
      </div>

      {/* Agent List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {agents.map(agent => (
          <div
            key={agent.id}
            style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              {agent.name === 'Nova' ? '🌟' : '🤖'}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ color: '#f9fafb', fontWeight: 500, fontSize: '14px' }}>
                {agent.name}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                {agent.role}
              </div>
            </div>

            {/* Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: statusColors[agent.status]
              }} />
              <span style={{
                color: statusColors[agent.status],
                fontSize: '11px'
              }}>
                {statusLabels[agent.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #374151',
        display: 'flex',
        gap: '8px'
      }}>
        <button style={{
          flex: 1,
          padding: '8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px'
        }}>
          Nouveau Agent
        </button>
        <button style={{
          padding: '8px 12px',
          backgroundColor: '#374151',
          color: '#d1d5db',
          border: '1px solid #4b5563',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px'
        }}>
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default AgentPanel;
