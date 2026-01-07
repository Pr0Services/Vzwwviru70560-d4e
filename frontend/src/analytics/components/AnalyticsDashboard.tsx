/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ANALYTICS DASHBOARD
 * Phase 6: Analytics & Reporting
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const { metrics, isLoading, refreshMetrics } = useAnalytics();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    refreshMetrics(period);
  }, [period, refreshMetrics]);

  if (isLoading || !metrics) {
    return <div className="loading">Chargement des analytics...</div>;
  }

  const cards: MetricCard[] = [
    {
      title: 'Utilisateurs Actifs',
      value: metrics.active_users,
      change: 12,
      trend: 'up',
      icon: '👥',
    },
    {
      title: 'Tokens Consommés',
      value: metrics.total_tokens_spent.toLocaleString(),
      change: -5,
      trend: 'down',
      icon: '🪙',
    },
    {
      title: 'Threads Créés',
      value: metrics.threads_created,
      change: 8,
      trend: 'up',
      icon: '🧵',
    },
    {
      title: 'Agents Actifs',
      value: metrics.agent_executions,
      change: 15,
      trend: 'up',
      icon: '🤖',
    },
    {
      title: 'Taux de Succès',
      value: `${metrics.agent_success_rate.toFixed(1)}%`,
      trend: metrics.agent_success_rate > 90 ? 'up' : 'neutral',
      icon: '✅',
    },
    {
      title: 'Durée Session Moy.',
      value: `${metrics.avg_session_duration_minutes.toFixed(0)}m`,
      icon: '⏱️',
    },
  ];

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Vue d'ensemble de votre utilisation CHE·NU</p>
        </div>

        <div className="period-selector">
          <button
            className={period === '7d' ? 'active' : ''}
            onClick={() => setPeriod('7d')}
          >
            7 jours
          </button>
          <button
            className={period === '30d' ? 'active' : ''}
            onClick={() => setPeriod('30d')}
          >
            30 jours
          </button>
          <button
            className={period === '90d' ? 'active' : ''}
            onClick={() => setPeriod('90d')}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">{card.icon}</span>
              <h3>{card.title}</h3>
            </div>
            <div className="metric-value">{card.value}</div>
            {card.change !== undefined && (
              <div className={`metric-change ${card.trend}`}>
                {card.trend === 'up' && '↑'}
                {card.trend === 'down' && '↓'}
                {Math.abs(card.change)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sphere Usage */}
      <div className="section">
        <h2>Utilisation par Sphere</h2>
        <div className="sphere-usage">
          {Object.entries(metrics.sphere_usage).map(([sphere, count]) => {
            const total = Object.values(metrics.sphere_usage).reduce((a, b) => a + b, 0);
            const percentage = (count / total * 100).toFixed(0);
            
            return (
              <div key={sphere} className="sphere-bar">
                <div className="sphere-info">
                  <span className="sphere-name">{sphere}</span>
                  <span className="sphere-count">{count} sessions</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="sphere-percentage">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-row">
          <div className="stat">
            <span className="stat-label">Sphere Préférée</span>
            <span className="stat-value">{metrics.most_used_sphere}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Threads Complétés</span>
            <span className="stat-value">
              {metrics.threads_completed}/{metrics.threads_created}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Durée Moy. Thread</span>
            <span className="stat-value">
              {metrics.avg_thread_duration_hours.toFixed(1)}h
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Tokens/Utilisateur</span>
            <span className="stat-value">
              {metrics.avg_tokens_per_user.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          color: #1e1f22;
          margin: 0 0 8px;
        }

        .dashboard-header p {
          color: #8d8371;
          margin: 0;
        }

        .period-selector {
          display: flex;
          gap: 8px;
          background: #e9e4d6;
          border-radius: 8px;
          padding: 4px;
        }

        .period-selector button {
          padding: 8px 16px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .period-selector button.active {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .metric-card {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
        }

        .metric-card:hover {
          border-color: #d8b26a;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .metric-icon {
          font-size: 24px;
        }

        .metric-header h3 {
          font-size: 14px;
          color: #8d8371;
          margin: 0;
          font-weight: 500;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e1f22;
          margin-bottom: 8px;
        }

        .metric-change {
          font-size: 14px;
          font-weight: 600;
        }

        .metric-change.up {
          color: #3f7249;
        }

        .metric-change.down {
          color: #e74c3c;
        }

        .metric-change.neutral {
          color: #8d8371;
        }

        .section {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
        }

        .section h2 {
          font-size: 20px;
          color: #1e1f22;
          margin: 0 0 24px;
        }

        .sphere-usage {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sphere-bar {
          display: grid;
          grid-template-columns: 200px 1fr 60px;
          gap: 16px;
          align-items: center;
        }

        .sphere-info {
          display: flex;
          flex-direction: column;
        }

        .sphere-name {
          font-weight: 600;
          color: #1e1f22;
        }

        .sphere-count {
          font-size: 12px;
          color: #8d8371;
        }

        .progress-bar {
          height: 12px;
          background: #e9e4d6;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #d8b26a 0%, #c9a159 100%);
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        .sphere-percentage {
          text-align: right;
          font-weight: 600;
          color: #8d8371;
        }

        .quick-stats {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 32px;
        }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          font-size: 12px;
          color: #8d8371;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e1f22;
        }

        .loading {
          padding: 60px;
          text-align: center;
          color: #8d8371;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};
