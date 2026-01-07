/**
 * CHE·NU™ - AGENT PANEL
 * 
 * Visual interface for agent management
 * Shows Nova (system), Orchestrator, and specialist agents
 */

import React, { useState, useCallback } from 'react';
import { 
  useAgentStore, 
  useNova, 
  useHiredAgents, 
  useAvailableAgents,
  Agent,
  AgentStatus,
  AgentCapability,
} from '../../stores/agent.store';
import { SPHERES, SphereId } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// AGENT CARD
// ═══════════════════════════════════════════════════════════════

interface AgentCardProps {
  agent: Agent;
  isHired?: boolean;
  onHire?: () => void;
  onFire?: () => void;
  onSelect?: () => void;
  isActive?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  isHired, 
  onHire, 
  onFire, 
  onSelect,
  isActive 
}) => {
  const statusColors: Record<AgentStatus, string> = {
    idle: '#3F7249',
    thinking: '#D8B26A',
    executing: '#3EB4A2',
    waiting: '#f39c12',
    error: '#e74c3c',
    offline: '#666',
  };

  return (
    <div 
      className={`agent-card ${isActive ? 'active' : ''} ${agent.isSystem ? 'system' : ''}`}
      onClick={onSelect}
    >
      <div className="agent-header">
        <div className="agent-avatar">{agent.avatar || '🤖'}</div>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <span className="agent-type">{agent.type}</span>
        </div>
        <div 
          className="agent-status" 
          style={{ backgroundColor: statusColors[agent.status] }}
          title={agent.status}
        />
      </div>

      <p className="agent-description">{agent.description}</p>

      <div className="agent-capabilities">
        {agent.capabilities.slice(0, 3).map((cap) => (
          <span key={cap.id} className="capability-tag">
            {cap.name}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="capability-more">+{agent.capabilities.length - 3}</span>
        )}
      </div>

      <div className="agent-scopes">
        {agent.sphereScopes.slice(0, 4).map((scope) => {
          const sphere = SPHERES[scope];
          return (
            <span key={scope} className="scope-icon" title={sphere.name}>
              {sphere.icon}
            </span>
          );
        })}
      </div>

      <div className="agent-footer">
        <div className="agent-cost">
          <span className="cost-label">Cost:</span>
          <span className="cost-value">{agent.baseCostPerToken * 1000}/1k tokens</span>
        </div>
        
        {!agent.isSystem && (
          <div className="agent-actions">
            {isHired ? (
              <button className="action-btn fire" onClick={(e) => { e.stopPropagation(); onFire?.(); }}>
                Fire
              </button>
            ) : (
              <button className="action-btn hire" onClick={(e) => { e.stopPropagation(); onHire?.(); }}>
                Hire
              </button>
            )}
          </div>
        )}

        {agent.isSystem && (
          <span className="system-badge">SYSTEM</span>
        )}
      </div>

      <style>{`
        .agent-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .agent-card:hover {
          border-color: #333;
          background: #151515;
        }

        .agent-card.active {
          border-color: #D8B26A;
          background: rgba(216, 178, 106, 0.05);
        }

        .agent-card.system {
          border-color: rgba(62, 180, 162, 0.3);
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .agent-info {
          flex: 1;
        }

        .agent-info h3 {
          margin: 0;
          font-size: 15px;
          color: #fff;
        }

        .agent-type {
          font-size: 11px;
          color: #666;
          text-transform: capitalize;
        }

        .agent-status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .agent-description {
          font-size: 12px;
          color: #888;
          margin: 0 0 12px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .agent-capabilities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .capability-tag {
          padding: 4px 8px;
          background: rgba(62, 180, 162, 0.1);
          border-radius: 6px;
          font-size: 10px;
          color: #3EB4A2;
        }

        .capability-more {
          padding: 4px 8px;
          font-size: 10px;
          color: #666;
        }

        .agent-scopes {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .scope-icon {
          font-size: 14px;
          opacity: 0.7;
        }

        .agent-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #222;
        }

        .agent-cost {
          font-size: 11px;
        }

        .cost-label {
          color: #666;
        }

        .cost-value {
          color: #D8B26A;
          margin-left: 4px;
        }

        .agent-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.hire {
          background: rgba(63, 114, 73, 0.2);
          border: 1px solid rgba(63, 114, 73, 0.3);
          color: #3F7249;
        }

        .action-btn.hire:hover {
          background: rgba(63, 114, 73, 0.3);
        }

        .action-btn.fire {
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .action-btn.fire:hover {
          background: rgba(231, 76, 60, 0.2);
        }

        .system-badge {
          padding: 4px 10px;
          background: rgba(62, 180, 162, 0.1);
          border-radius: 6px;
          font-size: 10px;
          color: #3EB4A2;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NOVA STATUS PANEL
// ═══════════════════════════════════════════════════════════════

const NovaStatusPanel: React.FC = () => {
  const nova = useNova();

  return (
    <div className="nova-status-panel">
      <div className="nova-header">
        <div className="nova-avatar">✧</div>
        <div className="nova-info">
          <h2>Nova</h2>
          <p>System Intelligence - Always Present</p>
        </div>
        <div className={`nova-status-indicator ${nova.status}`}>
          {nova.status}
        </div>
      </div>

      <div className="nova-capabilities">
        <h4>Core Functions</h4>
        <ul>
          <li>🔒 Governance Enforcement</li>
          <li>🧠 Memory Management</li>
          <li>📊 Database Supervision</li>
          <li>🎯 User Guidance</li>
          <li>👁️ Agent Supervision</li>
        </ul>
      </div>

      <div className="nova-metrics">
        <div className="metric">
          <span className="value">{nova.metrics.tasksCompleted}</span>
          <span className="label">Tasks</span>
        </div>
        <div className="metric">
          <span className="value">{nova.metrics.totalTokensUsed.toLocaleString()}</span>
          <span className="label">Tokens Used</span>
        </div>
        <div className="metric">
          <span className="value">{nova.metrics.userRating.toFixed(1)}</span>
          <span className="label">Rating</span>
        </div>
      </div>

      <style>{`
        .nova-status-panel {
          background: linear-gradient(135deg, rgba(62, 180, 162, 0.1) 0%, rgba(63, 114, 73, 0.1) 100%);
          border: 1px solid rgba(62, 180, 162, 0.2);
          border-radius: 16px;
          padding: 20px;
        }

        .nova-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .nova-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3EB4A2 0%, #3F7249 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #fff;
        }

        .nova-info {
          flex: 1;
        }

        .nova-info h2 {
          margin: 0;
          font-size: 20px;
          color: #3EB4A2;
        }

        .nova-info p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #888;
        }

        .nova-status-indicator {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .nova-status-indicator.idle {
          background: rgba(63, 114, 73, 0.2);
          color: #3F7249;
        }

        .nova-status-indicator.thinking {
          background: rgba(216, 178, 106, 0.2);
          color: #D8B26A;
        }

        .nova-status-indicator.executing {
          background: rgba(62, 180, 162, 0.2);
          color: #3EB4A2;
        }

        .nova-capabilities h4 {
          color: #888;
          font-size: 11px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .nova-capabilities ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .nova-capabilities li {
          font-size: 12px;
          color: #ccc;
          background: rgba(0, 0, 0, 0.3);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .nova-metrics {
          display: flex;
          gap: 24px;
        }

        .nova-metrics .metric {
          text-align: center;
        }

        .nova-metrics .value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #3EB4A2;
        }

        .nova-metrics .label {
          display: block;
          font-size: 11px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// AGENT MARKETPLACE
// ═══════════════════════════════════════════════════════════════

const AgentMarketplace: React.FC = () => {
  const availableAgents = useAvailableAgents();
  const hiredAgents = useHiredAgents();
  const { hireAgent, fireAgent, isAgentHired, setActiveOrchestrator } = useAgentStore();
  const [filter, setFilter] = useState<'all' | 'hired' | 'available'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hiredIds = new Set(hiredAgents.map((a) => a.id));

  const filteredAgents = availableAgents.filter((agent) => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'hired' && hiredIds.has(agent.id)) ||
      (filter === 'available' && !hiredIds.has(agent.id));
    
    const matchesSearch = 
      !searchQuery ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="agent-marketplace">
      <div className="marketplace-header">
        <h3>Agent Marketplace</h3>
        <div className="marketplace-controls">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'hired' ? 'active' : ''} 
              onClick={() => setFilter('hired')}
            >
              Hired ({hiredAgents.length})
            </button>
            <button 
              className={filter === 'available' ? 'active' : ''} 
              onClick={() => setFilter('available')}
            >
              Available
            </button>
          </div>
        </div>
      </div>

      <div className="agents-grid">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent as Agent}
            isHired={hiredIds.has(agent.id)}
            onHire={() => hireAgent(agent.id)}
            onFire={() => fireAgent(agent.id)}
            onSelect={() => {
              if (agent.type === 'orchestrator' && hiredIds.has(agent.id)) {
                setActiveOrchestrator(agent.id);
              }
            }}
          />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="empty-state">
          <span>🤖</span>
          <p>No agents found</p>
        </div>
      )}

      <style>{`
        .agent-marketplace {
          background: #0a0a0a;
          border-radius: 12px;
          padding: 20px;
        }

        .marketplace-header {
          margin-bottom: 20px;
        }

        .marketplace-header h3 {
          color: #fff;
          margin: 0 0 16px;
          font-size: 16px;
        }

        .marketplace-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
        }

        .search-input:focus {
          outline: none;
          border-color: #D8B26A;
        }

        .filter-tabs {
          display: flex;
          background: #111;
          border-radius: 8px;
          overflow: hidden;
        }

        .filter-tabs button {
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: #666;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tabs button:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-tabs button.active {
          background: rgba(216, 178, 106, 0.2);
          color: #D8B26A;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #666;
        }

        .empty-state span {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN AGENT PANEL
// ═══════════════════════════════════════════════════════════════

interface AgentPanelProps {
  sphereId?: SphereId;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ sphereId }) => {
  const [activeTab, setActiveTab] = useState<'nova' | 'marketplace' | 'hired'>('nova');

  return (
    <div className="agent-panel">
      <header className="panel-header">
        <h2>🤖 Agent System</h2>
        <p>Nova supervises all, Orchestrator executes, Specialists assist</p>
      </header>

      <nav className="panel-tabs">
        <button 
          className={activeTab === 'nova' ? 'active' : ''} 
          onClick={() => setActiveTab('nova')}
        >
          ✧ Nova
        </button>
        <button 
          className={activeTab === 'marketplace' ? 'active' : ''} 
          onClick={() => setActiveTab('marketplace')}
        >
          🏪 Marketplace
        </button>
        <button 
          className={activeTab === 'hired' ? 'active' : ''} 
          onClick={() => setActiveTab('hired')}
        >
          👥 My Team
        </button>
      </nav>

      <div className="panel-content">
        {activeTab === 'nova' && <NovaStatusPanel />}
        {activeTab === 'marketplace' && <AgentMarketplace />}
        {activeTab === 'hired' && <AgentMarketplace />}
      </div>

      <style>{`
        .agent-panel {
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
        }

        .panel-header {
          padding: 20px 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .panel-header h2 {
          margin: 0 0 4px;
          color: #D8B26A;
          font-size: 18px;
        }

        .panel-header p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .panel-tabs {
          display: flex;
          background: #0d0d0d;
          border-bottom: 1px solid #222;
        }

        .panel-tabs button {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .panel-tabs button:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #888;
        }

        .panel-tabs button.active {
          background: rgba(216, 178, 106, 0.1);
          color: #D8B26A;
          border-bottom: 2px solid #D8B26A;
        }

        .panel-content {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default AgentPanel;
