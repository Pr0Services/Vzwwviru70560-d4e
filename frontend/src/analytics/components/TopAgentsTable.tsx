/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TOP AGENTS TABLE
 * Phase 6: Analytics & Reporting
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect } from 'react';
import { useAnalytics, AgentPerformance } from '../hooks/useAnalytics';

export const TopAgentsTable: React.FC = () => {
  const { topAgents, isLoading, fetchTopAgents } = useAnalytics();

  useEffect(() => {
    fetchTopAgents(10);
  }, [fetchTopAgents]);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  const getLevelColor = (level: string) => {
    const colors = {
      'L0': '#d8b26a',
      'L1': '#3f7249',
      'L2': '#3eb4a2',
      'L3': '#8d8371',
    };
    return colors[level as keyof typeof colors] || '#8d8371';
  };

  return (
    <div className="top-agents">
      <div className="table-header">
        <h2>Top 10 Agents</h2>
        <p>Classés par score d'efficacité</p>
      </div>

      <div className="agents-table">
        <div className="table-head">
          <div className="col rank">#</div>
          <div className="col agent">Agent</div>
          <div className="col executions">Exécutions</div>
          <div className="col success">Succès</div>
          <div className="col tokens">Tokens</div>
          <div className="col efficiency">Efficacité</div>
        </div>

        {topAgents.map((agent, idx) => (
          <div key={agent.agent_id} className="table-row">
            <div className="col rank">
              {idx === 0 && '🥇'}
              {idx === 1 && '🥈'}
              {idx === 2 && '🥉'}
              {idx > 2 && idx + 1}
            </div>
            <div className="col agent">
              <div className="agent-info">
                <span className="agent-name">{agent.agent_id}</span>
                <span
                  className="agent-level"
                  style={{ background: getLevelColor(agent.agent_level) }}
                >
                  {agent.agent_level}
                </span>
              </div>
            </div>
            <div className="col executions">
              {agent.total_executions.toLocaleString()}
            </div>
            <div className="col success">
              <div className="success-bar">
                <div
                  className="success-fill"
                  style={{ width: `${agent.success_rate}%` }}
                />
              </div>
              <span>{agent.success_rate.toFixed(0)}%</span>
            </div>
            <div className="col tokens">
              {agent.total_tokens_consumed.toLocaleString()}
            </div>
            <div className="col efficiency">
              <div className="efficiency-score">
                {agent.efficiency_score.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .top-agents {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 32px;
        }

        .table-header {
          margin-bottom: 24px;
        }

        .table-header h2 {
          font-size: 20px;
          color: #1e1f22;
          margin: 0 0 4px;
        }

        .table-header p {
          color: #8d8371;
          margin: 0;
          font-size: 14px;
        }

        .agents-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-head,
        .table-row {
          display: grid;
          grid-template-columns: 60px 1fr 120px 140px 120px 100px;
          gap: 16px;
          align-items: center;
        }

        .table-head {
          padding: 12px 16px;
          background: #e9e4d6;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          color: #2f4c39;
          text-transform: uppercase;
        }

        .table-row {
          padding: 16px;
          border-radius: 8px;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .table-row:hover {
          background: #e9e4d6;
          border-color: #d8b26a;
        }

        .col.rank {
          font-size: 20px;
          font-weight: 700;
          text-align: center;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-name {
          font-weight: 600;
          color: #1e1f22;
        }

        .agent-level {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: white;
        }

        .col.executions,
        .col.tokens {
          font-weight: 600;
          color: #2f4c39;
        }

        .col.success {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .success-bar {
          flex: 1;
          height: 8px;
          background: #e9e4d6;
          border-radius: 4px;
          overflow: hidden;
        }

        .success-fill {
          height: 100%;
          background: linear-gradient(90deg, #3f7249 0%, #3eb4a2 100%);
          border-radius: 4px;
        }

        .efficiency-score {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d8b26a 0%, #c9a159 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .loading {
          padding: 40px;
          text-align: center;
          color: #8d8371;
        }
      `}</style>
    </div>
  );
};
