/**
 * CHE·NU™ - TOKEN BUDGET DISPLAY
 * 
 * Tokens represent INTELLIGENCE ENERGY.
 * Tokens are: budgeted, traceable, governed, transferable with rules
 */

import React, { useState } from 'react';
import { useTokenStore, TokenBudget, TokenTransaction, TokenAnalytics } from '../../stores/token.store';
import { SPHERES, SphereId } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TOKEN METER
// ═══════════════════════════════════════════════════════════════

interface TokenMeterProps {
  used: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  compact?: boolean;
}

export const TokenMeter: React.FC<TokenMeterProps> = ({
  used,
  total,
  label,
  showPercentage = true,
  compact = false,
}) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const remaining = total - used;
  
  const getColor = () => {
    if (percentage >= 90) return '#e74c3c';
    if (percentage >= 70) return '#f39c12';
    return '#3F7249';
  };

  return (
    <div className={`token-meter ${compact ? 'compact' : ''}`}>
      {label && <span className="meter-label">{label}</span>}
      
      <div className="meter-bar">
        <div 
          className="meter-fill" 
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: getColor() }}
        />
      </div>
      
      <div className="meter-values">
        <span className="value-used">{used.toLocaleString()}</span>
        <span className="value-separator">/</span>
        <span className="value-total">{total.toLocaleString()}</span>
        {showPercentage && (
          <span className="value-percent" style={{ color: getColor() }}>
            ({percentage.toFixed(1)}%)
          </span>
        )}
      </div>

      <style>{`
        .token-meter {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .token-meter.compact {
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .meter-label {
          font-size: 12px;
          color: #888;
        }

        .meter-bar {
          height: 8px;
          background: #222;
          border-radius: 4px;
          overflow: hidden;
          flex: 1;
        }

        .compact .meter-bar {
          height: 6px;
          min-width: 100px;
        }

        .meter-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .meter-values {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }

        .compact .meter-values {
          font-size: 11px;
        }

        .value-used {
          color: #fff;
          font-weight: 600;
        }

        .value-separator {
          color: #444;
        }

        .value-total {
          color: #666;
        }

        .value-percent {
          margin-left: 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BUDGET CARD
// ═══════════════════════════════════════════════════════════════

interface BudgetCardProps {
  budget: TokenBudget;
  onAllocate?: (amount: number) => void;
  onViewDetails?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onAllocate, onViewDetails }) => {
  const sphere = SPHERES[budget.sphereId];
  const usagePercent = (budget.totalUsed / budget.totalAllocated) * 100;

  return (
    <div className="budget-card" onClick={onViewDetails}>
      <div className="card-header">
        <div className="budget-icon" style={{ backgroundColor: sphere.color }}>
          {sphere.icon}
        </div>
        <div className="budget-info">
          <h3>{budget.name}</h3>
          <span className="budget-period">{budget.period}</span>
        </div>
        <span className={`usage-badge ${usagePercent > 80 ? 'warning' : ''}`}>
          {usagePercent.toFixed(0)}%
        </span>
      </div>

      <TokenMeter used={budget.totalUsed} total={budget.totalAllocated} />

      <div className="card-footer">
        <div className="remaining">
          <span className="remaining-value">{budget.remaining.toLocaleString()}</span>
          <span className="remaining-label">remaining</span>
        </div>
        {budget.resetAt && (
          <span className="reset-time">
            Resets {new Date(budget.resetAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {budget.rules.some(r => r.enabled && r.type === 'alert' && usagePercent >= r.threshold * 100) && (
        <div className="budget-warning">
          ⚠️ Approaching budget limit
        </div>
      )}

      <style>{`
        .budget-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .budget-card:hover {
          border-color: #333;
          background: #151515;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .budget-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .budget-info {
          flex: 1;
        }

        .budget-info h3 {
          margin: 0;
          font-size: 14px;
          color: #fff;
        }

        .budget-period {
          font-size: 11px;
          color: #666;
          text-transform: capitalize;
        }

        .usage-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(63, 114, 73, 0.2);
          color: #3F7249;
        }

        .usage-badge.warning {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #222;
        }

        .remaining {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .remaining-value {
          font-size: 18px;
          font-weight: 700;
          color: #D8B26A;
        }

        .remaining-label {
          font-size: 11px;
          color: #666;
        }

        .reset-time {
          font-size: 11px;
          color: #555;
        }

        .budget-warning {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(243, 156, 18, 0.1);
          border: 1px solid rgba(243, 156, 18, 0.2);
          border-radius: 6px;
          font-size: 12px;
          color: #f39c12;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRANSACTION LIST
// ═══════════════════════════════════════════════════════════════

interface TransactionListProps {
  transactions: TokenTransaction[];
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, limit = 10 }) => {
  const displayTransactions = transactions.slice(0, limit);

  const getTypeIcon = (type: TokenTransaction['type']) => {
    switch (type) {
      case 'allocation': return '➕';
      case 'consumption': return '⚡';
      case 'transfer': return '↔️';
      case 'refund': return '↩️';
    }
  };

  const getTypeColor = (type: TokenTransaction['type']) => {
    switch (type) {
      case 'allocation': return '#3F7249';
      case 'consumption': return '#D8B26A';
      case 'transfer': return '#3EB4A2';
      case 'refund': return '#8D8371';
    }
  };

  return (
    <div className="transaction-list">
      {displayTransactions.length === 0 ? (
        <div className="empty-state">
          <span>💰</span>
          <p>No transactions yet</p>
        </div>
      ) : (
        displayTransactions.map((tx) => (
          <div key={tx.id} className="transaction-item">
            <span 
              className="tx-icon" 
              style={{ backgroundColor: `${getTypeColor(tx.type)}20`, color: getTypeColor(tx.type) }}
            >
              {getTypeIcon(tx.type)}
            </span>
            <div className="tx-info">
              <span className="tx-description">{tx.description}</span>
              <span className="tx-time">
                {new Date(tx.timestamp).toLocaleString()}
              </span>
            </div>
            <span className={`tx-amount ${tx.type === 'consumption' ? 'negative' : 'positive'}`}>
              {tx.type === 'consumption' ? '-' : '+'}{tx.amount.toLocaleString()}
            </span>
          </div>
        ))
      )}

      <style>{`
        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: #666;
        }

        .empty-state span {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .tx-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .tx-info {
          flex: 1;
        }

        .tx-description {
          display: block;
          font-size: 13px;
          color: #ccc;
        }

        .tx-time {
          font-size: 11px;
          color: #555;
        }

        .tx-amount {
          font-size: 14px;
          font-weight: 600;
          font-family: monospace;
        }

        .tx-amount.positive {
          color: #3F7249;
        }

        .tx-amount.negative {
          color: #D8B26A;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD
// ═══════════════════════════════════════════════════════════════

interface AnalyticsDashboardProps {
  analytics: TokenAnalytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  return (
    <div className="analytics-dashboard">
      <div className="analytics-grid">
        <div className="metric-card">
          <span className="metric-icon">📅</span>
          <div className="metric-content">
            <span className="metric-value">{analytics.totalUsedToday.toLocaleString()}</span>
            <span className="metric-label">Today</span>
          </div>
        </div>
        
        <div className="metric-card">
          <span className="metric-icon">📆</span>
          <div className="metric-content">
            <span className="metric-value">{analytics.totalUsedThisWeek.toLocaleString()}</span>
            <span className="metric-label">This Week</span>
          </div>
        </div>
        
        <div className="metric-card">
          <span className="metric-icon">📊</span>
          <div className="metric-content">
            <span className="metric-value">{analytics.totalUsedThisMonth.toLocaleString()}</span>
            <span className="metric-label">This Month</span>
          </div>
        </div>
        
        <div className="metric-card">
          <span className="metric-icon">⚡</span>
          <div className="metric-content">
            <span className="metric-value">{analytics.efficiency}%</span>
            <span className="metric-label">Efficiency</span>
          </div>
        </div>
      </div>

      <div className="analytics-sections">
        <div className="section">
          <h4>Top Agents</h4>
          {analytics.topAgents.map((agent, i) => (
            <div key={agent.agentId} className="ranking-item">
              <span className="rank">#{i + 1}</span>
              <span className="name">{agent.agentName}</span>
              <span className="value">{agent.tokensUsed.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="section">
          <h4>By Sphere</h4>
          {analytics.topSpheres.map((sphere, i) => {
            const s = SPHERES[sphere.sphereId];
            return (
              <div key={sphere.sphereId} className="ranking-item">
                <span className="rank">{s.icon}</span>
                <span className="name">{s.name}</span>
                <span className="value">{sphere.tokensUsed.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .analytics-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .metric-icon {
          font-size: 24px;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          color: #D8B26A;
        }

        .metric-label {
          font-size: 11px;
          color: #666;
        }

        .analytics-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .section h4 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .ranking-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .ranking-item .rank {
          width: 24px;
          color: #666;
          font-size: 12px;
        }

        .ranking-item .name {
          flex: 1;
          color: #ccc;
          font-size: 13px;
        }

        .ranking-item .value {
          color: #D8B26A;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .analytics-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN TOKEN BUDGET SECTION
// ═══════════════════════════════════════════════════════════════

export const TokenBudgetSection: React.FC = () => {
  const { budgets, globalBalance, transactions, getAnalytics } = useTokenStore();
  const [activeTab, setActiveTab] = useState<'budgets' | 'transactions' | 'analytics'>('budgets');
  
  const budgetList = Object.values(budgets);
  const analytics = getAnalytics();

  return (
    <div className="token-budget-section">
      <header className="section-header">
        <div className="header-info">
          <h2>💰 Token Budget & Governance</h2>
          <p>Tokens represent intelligence energy - budgeted, traceable, governed</p>
        </div>
        <div className="global-balance">
          <span className="balance-label">Global Balance</span>
          <span className="balance-value">{globalBalance.toLocaleString()}</span>
        </div>
      </header>

      <nav className="section-tabs">
        <button 
          className={activeTab === 'budgets' ? 'active' : ''} 
          onClick={() => setActiveTab('budgets')}
        >
          Budgets
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''} 
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="section-content">
        {activeTab === 'budgets' && (
          <div className="budgets-grid">
            {budgetList.length === 0 ? (
              <div className="empty-state">
                <span>💰</span>
                <h3>No budgets created</h3>
                <p>Create a token budget to start tracking AI usage</p>
                <button className="create-btn">+ Create Budget</button>
              </div>
            ) : (
              budgetList.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList transactions={transactions} limit={20} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} />
        )}
      </div>

      <style>{`
        .token-budget-section {
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .header-info h2 {
          margin: 0 0 4px;
          color: #D8B26A;
          font-size: 18px;
        }

        .header-info p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .global-balance {
          text-align: right;
        }

        .balance-label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }

        .balance-value {
          font-size: 28px;
          font-weight: 700;
          color: #D8B26A;
        }

        .section-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 24px;
          background: #0d0d0d;
          border-bottom: 1px solid #222;
        }

        .section-tabs button {
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-tabs button:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .section-tabs button.active {
          background: rgba(216, 178, 106, 0.1);
          color: #D8B26A;
        }

        .section-content {
          padding: 24px;
        }

        .budgets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #888;
          margin: 0 0 8px;
        }

        .empty-state p {
          margin: 0 0 24px;
          font-size: 14px;
        }

        .create-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 8px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default TokenBudgetSection;
