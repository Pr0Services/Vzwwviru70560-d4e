/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — ACTIVE AGENTS SECTION                           ║
 * ║                    🤖 Agents Actifs — Gestion des agents IA                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Interface pour gérer les agents IA:                                         ║
 * ║  • Agents en cours d'exécution                                               ║
 * ║  • Historique des tâches                                                     ║
 * ║  • Création de nouveaux agents                                               ║
 * ║  • Budget tokens                                                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

interface ActiveAgentsSectionProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'nova' | 'specialist' | 'assistant' | 'automation';
  description: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  currentTask?: string;
  tokensUsed: number;
  tokenBudget: number;
  lastActive: Date;
  tasksCompleted: number;
}

export const ActiveAgentsSection: React.FC<ActiveAgentsSectionProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'idle'>('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Nova',
      type: 'nova',
      description: 'Assistant IA principal - Orchestration et coordination',
      status: 'active',
      currentTask: 'Analyse du rapport Q4',
      tokensUsed: 45000,
      tokenBudget: 100000,
      lastActive: new Date(),
      tasksCompleted: 156,
    },
    {
      id: '2',
      name: 'Agent Recherche',
      type: 'specialist',
      description: 'Recherche et veille documentaire',
      status: 'processing',
      currentTask: 'Veille concurrentielle secteur tech',
      tokensUsed: 12000,
      tokenBudget: 50000,
      lastActive: new Date(Date.now() - 300000),
      tasksCompleted: 42,
    },
    {
      id: '3',
      name: 'Agent Rédaction',
      type: 'assistant',
      description: 'Aide à la rédaction et correction',
      status: 'idle',
      tokensUsed: 8500,
      tokenBudget: 30000,
      lastActive: new Date(Date.now() - 3600000),
      tasksCompleted: 89,
    },
    {
      id: '4',
      name: 'Agent Analytics',
      type: 'specialist',
      description: 'Analyse de données et rapports',
      status: 'idle',
      tokensUsed: 22000,
      tokenBudget: 40000,
      lastActive: new Date(Date.now() - 7200000),
      tasksCompleted: 34,
    },
    {
      id: '5',
      name: 'Auto-Organisateur',
      type: 'automation',
      description: 'Organisation automatique des fichiers',
      status: 'active',
      currentTask: 'Tri des documents entrants',
      tokensUsed: 5000,
      tokenBudget: 20000,
      lastActive: new Date(),
      tasksCompleted: 412,
    },
  ]);

  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    if (filter === 'active') return agent.status === 'active' || agent.status === 'processing';
    if (filter === 'idle') return agent.status === 'idle';
    return true;
  });

  const totalTokensUsed = agents.reduce((sum, a) => sum + a.tokensUsed, 0);
  const totalTokenBudget = agents.reduce((sum, a) => sum + a.tokenBudget, 0);
  const activeCount = agents.filter(a => a.status === 'active' || a.status === 'processing').length;

  const getStatusStyle = (status: Agent['status']) => {
    switch (status) {
      case 'active': return { color: '#4ade80', label: 'Actif', icon: '🟢' };
      case 'processing': return { color: '#f59e0b', label: 'En cours', icon: '🔄' };
      case 'idle': return { color: '#6b6560', label: 'En veille', icon: '💤' };
      case 'error': return { color: '#ef4444', label: 'Erreur', icon: '🔴' };
    }
  };

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'nova': return '🤖';
      case 'specialist': return '🔧';
      case 'assistant': return '💬';
      case 'automation': return '⚙️';
    }
  };

  return (
    <div className="agents-section">
      {/* Header */}
      <div className="section-header">
        <div className="header-title">
          <span className="header-icon">🤖</span>
          <h2>Agents Actifs</h2>
          <span className="sphere-badge" style={{ background: sphereColor }}>
            {sphereName}
          </span>
        </div>
        <button className="new-agent-btn" style={{ background: sphereColor }}>
          + Nouvel Agent
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🤖</span>
          <div className="stat-content">
            <span className="stat-value">{agents.length}</span>
            <span className="stat-label">Agents Total</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🟢</span>
          <div className="stat-content">
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">Actifs</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-value">{agents.reduce((s, a) => s + a.tasksCompleted, 0)}</span>
            <span className="stat-label">Tâches Complétées</span>
          </div>
        </div>
        <div className="stat-card budget-card">
          <span className="stat-icon">🪙</span>
          <div className="stat-content">
            <span className="stat-value">
              {Math.round(totalTokensUsed / 1000)}K / {Math.round(totalTokenBudget / 1000)}K
            </span>
            <span className="stat-label">Tokens Utilisés</span>
            <div className="budget-bar">
              <div 
                className="budget-fill" 
                style={{ 
                  width: `${(totalTokensUsed / totalTokenBudget) * 100}%`,
                  background: sphereColor 
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {[
          { id: 'all', label: 'Tous', count: agents.length },
          { id: 'active', label: 'Actifs', count: activeCount },
          { id: 'idle', label: 'En veille', count: agents.filter(a => a.status === 'idle').length },
        ].map(f => (
          <button
            key={f.id}
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id as any)}
            style={{ '--accent': sphereColor } as React.CSSProperties}
          >
            {f.label} <span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {filteredAgents.map(agent => {
          const status = getStatusStyle(agent.status);
          const budgetPercentage = (agent.tokensUsed / agent.tokenBudget) * 100;
          
          return (
            <div
              key={agent.id}
              className={`agent-card ${selectedAgent === agent.id ? 'selected' : ''}`}
              onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
              style={{ '--accent': sphereColor } as React.CSSProperties}
            >
              {/* Header */}
              <div className="agent-header">
                <div className="agent-avatar" style={{ background: agent.type === 'nova' ? sphereColor : '#2a2a2a' }}>
                  {getTypeIcon(agent.type)}
                </div>
                <div className="agent-info">
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-type">
                    {agent.type === 'nova' ? 'Nova Intelligence' :
                     agent.type === 'specialist' ? 'Spécialiste' :
                     agent.type === 'assistant' ? 'Assistant' : 'Automatisation'}
                  </span>
                </div>
                <div className="agent-status" style={{ color: status.color }}>
                  {status.icon}
                </div>
              </div>

              {/* Description */}
              <p className="agent-description">{agent.description}</p>

              {/* Current Task */}
              {agent.currentTask && (
                <div className="current-task">
                  <span className="task-label">Tâche en cours:</span>
                  <span className="task-text">{agent.currentTask}</span>
                </div>
              )}

              {/* Stats */}
              <div className="agent-stats">
                <div className="stat">
                  <span className="stat-num">{agent.tasksCompleted}</span>
                  <span className="stat-lbl">tâches</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{formatTime(agent.lastActive)}</span>
                  <span className="stat-lbl">dernière activité</span>
                </div>
              </div>

              {/* Token Budget */}
              <div className="token-budget">
                <div className="budget-header">
                  <span>Budget Tokens</span>
                  <span>{Math.round(agent.tokensUsed / 1000)}K / {Math.round(agent.tokenBudget / 1000)}K</span>
                </div>
                <div className="budget-bar">
                  <div 
                    className="budget-fill" 
                    style={{ 
                      width: `${budgetPercentage}%`,
                      background: budgetPercentage > 80 ? '#ef4444' : 
                                  budgetPercentage > 60 ? '#f59e0b' : sphereColor
                    }} 
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="agent-actions">
                {agent.status === 'idle' ? (
                  <button className="action-btn primary" style={{ background: sphereColor }}>
                    ▶️ Activer
                  </button>
                ) : (
                  <button className="action-btn secondary">
                    ⏸️ Pause
                  </button>
                )}
                <button className="action-btn secondary">💬 Chat</button>
                <button className="action-btn secondary">⚙️</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Agent Card */}
      <div className="add-agent-card" style={{ borderColor: sphereColor }}>
        <span className="add-icon">➕</span>
        <span className="add-text">Créer un nouvel agent</span>
        <p className="add-hint">Personnalisez un agent pour vos besoins spécifiques</p>
      </div>

      <style>{`
        .agents-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon { font-size: 28px; }

        .header-title h2 {
          font-size: 24px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .sphere-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #000;
        }

        .new-agent-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #1e2420;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-card.budget-card {
          grid-column: span 1;
        }

        .stat-icon { font-size: 32px; }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #e8e4dc;
        }

        .stat-label {
          font-size: 13px;
          color: #6b6560;
        }

        .budget-bar {
          height: 6px;
          background: #2a2a2a;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .budget-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .filter-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #a8a29e;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-btn:hover {
          border-color: var(--accent);
        }

        .filter-btn.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }

        .filter-count {
          background: rgba(0,0,0,0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .agent-card {
          background: #1e2420;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .agent-card:hover {
          border-color: var(--accent);
        }

        .agent-card.selected {
          border-color: var(--accent);
          background: rgba(74, 222, 128, 0.05);
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .agent-info { flex: 1; }

        .agent-name {
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0 0 4px;
        }

        .agent-type {
          font-size: 12px;
          color: #6b6560;
        }

        .agent-status { font-size: 16px; }

        .agent-description {
          font-size: 14px;
          color: #a8a29e;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .current-task {
          background: #252a27;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .task-label {
          display: block;
          font-size: 11px;
          color: #6b6560;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .task-text {
          font-size: 14px;
          color: #e8e4dc;
        }

        .agent-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .agent-stats .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
        }

        .stat-lbl {
          font-size: 11px;
          color: #6b6560;
        }

        .token-budget {
          margin-bottom: 16px;
        }

        .budget-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b6560;
          margin-bottom: 6px;
        }

        .agent-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn.primary {
          flex: 1;
          color: #000;
        }

        .action-btn.secondary {
          background: #2a2a2a;
          color: #a8a29e;
        }

        .action-btn.secondary:hover {
          background: #3a3a3a;
        }

        .add-agent-card {
          border: 2px dashed;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0.6;
        }

        .add-agent-card:hover {
          opacity: 1;
          background: rgba(74, 222, 128, 0.05);
        }

        .add-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 12px;
        }

        .add-text {
          font-size: 16px;
          font-weight: 600;
          color: #e8e4dc;
          display: block;
          margin-bottom: 8px;
        }

        .add-hint {
          font-size: 14px;
          color: #6b6560;
          margin: 0;
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .agents-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'maintenant';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}j`;
}

export default ActiveAgentsSection;
