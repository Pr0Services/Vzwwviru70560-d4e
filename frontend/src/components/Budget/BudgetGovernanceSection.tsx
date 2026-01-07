/**
 * CHE·NU™ - BUDGET & GOVERNANCE SECTION
 * 
 * Budget & Governance - Bureau Section 10
 * 
 * Governance is not a restriction - Governance is empowerment.
 * 
 * CHE·NU:
 * - does NOT sell attention
 * - does NOT sell user data
 * - does NOT optimize for addiction
 * - makes cost explicit
 * - allows user control at every step
 */

import React, { useState } from 'react';
import { useTokenStore, TokenBudget, TokenRule } from '../../stores/token.store';
import { SPHERES, SphereId } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// GOVERNANCE RULES PANEL
// ═══════════════════════════════════════════════════════════════

interface GovernanceRulesPanelProps {
  budgetId?: string;
  sphereId?: SphereId;
}

const GovernanceRulesPanel: React.FC<GovernanceRulesPanelProps> = ({ budgetId, sphereId }) => {
  const { budgets, addRule, updateRule, removeRule } = useTokenStore();
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'alert' as TokenRule['type'],
    threshold: 0.8,
    action: 'notify',
  });

  const budget = budgetId ? budgets[budgetId] : null;
  const rules = budget?.rules || [];

  const handleAddRule = () => {
    if (!budgetId || !newRule.name) return;
    
    addRule(budgetId, {
      name: newRule.name,
      type: newRule.type,
      threshold: newRule.threshold,
      action: newRule.action,
      enabled: true,
    });
    
    setShowAddRule(false);
    setNewRule({ name: '', type: 'alert', threshold: 0.8, action: 'notify' });
  };

  return (
    <div className="governance-rules-panel">
      <div className="panel-header">
        <h3>🔒 Governance Rules</h3>
        <button className="add-btn" onClick={() => setShowAddRule(!showAddRule)}>
          {showAddRule ? '✕ Cancel' : '+ Add Rule'}
        </button>
      </div>

      {showAddRule && (
        <div className="add-rule-form">
          <input
            type="text"
            placeholder="Rule name..."
            value={newRule.name}
            onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
          />
          <select
            value={newRule.type}
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value as TokenRule['type'] })}
          >
            <option value="alert">Alert</option>
            <option value="limit">Limit</option>
            <option value="block">Block</option>
            <option value="approve">Require Approval</option>
          </select>
          <div className="threshold-input">
            <label>Threshold: {Math.round(newRule.threshold * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={newRule.threshold}
              onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
            />
          </div>
          <button className="save-btn" onClick={handleAddRule}>Save Rule</button>
        </div>
      )}

      <div className="rules-list">
        {rules.length === 0 ? (
          <div className="empty-rules">
            <span>🔓</span>
            <p>No governance rules defined</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className={`rule-item ${rule.enabled ? '' : 'disabled'}`}>
              <div className="rule-icon">
                {rule.type === 'alert' && '⚠️'}
                {rule.type === 'limit' && '📊'}
                {rule.type === 'block' && '🚫'}
                {rule.type === 'approve' && '✅'}
              </div>
              <div className="rule-info">
                <span className="rule-name">{rule.name}</span>
                <span className="rule-config">
                  {rule.type} at {Math.round(rule.threshold * 100)}%
                </span>
              </div>
              <div className="rule-actions">
                <button
                  className={`toggle-btn ${rule.enabled ? 'active' : ''}`}
                  onClick={() => budgetId && updateRule(budgetId, rule.id, { enabled: !rule.enabled })}
                >
                  {rule.enabled ? 'ON' : 'OFF'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => budgetId && removeRule(budgetId, rule.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .governance-rules-panel {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 14px;
          color: #fff;
        }

        .add-btn {
          padding: 6px 14px;
          background: rgba(216, 178, 106, 0.1);
          border: 1px solid rgba(216, 178, 106, 0.3);
          border-radius: 6px;
          color: #D8B26A;
          font-size: 12px;
          cursor: pointer;
        }

        .add-rule-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .add-rule-form input[type="text"],
        .add-rule-form select {
          padding: 10px 14px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
        }

        .threshold-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .threshold-input label {
          font-size: 12px;
          color: #888;
        }

        .threshold-input input[type="range"] {
          width: 100%;
          accent-color: #D8B26A;
        }

        .save-btn {
          padding: 10px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 6px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .empty-rules {
          text-align: center;
          padding: 32px;
          color: #666;
        }

        .empty-rules span {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }

        .rule-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          transition: opacity 0.2s;
        }

        .rule-item.disabled {
          opacity: 0.5;
        }

        .rule-icon {
          font-size: 18px;
        }

        .rule-info {
          flex: 1;
        }

        .rule-name {
          display: block;
          font-size: 13px;
          color: #fff;
        }

        .rule-config {
          font-size: 11px;
          color: #666;
        }

        .rule-actions {
          display: flex;
          gap: 8px;
        }

        .toggle-btn {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          background: rgba(102, 102, 102, 0.2);
          border: 1px solid #444;
          color: #666;
        }

        .toggle-btn.active {
          background: rgba(63, 114, 73, 0.2);
          border-color: rgba(63, 114, 73, 0.3);
          color: #3F7249;
        }

        .delete-btn {
          padding: 4px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.5;
        }

        .delete-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BUDGET ALLOCATION PANEL
// ═══════════════════════════════════════════════════════════════

interface BudgetAllocationPanelProps {
  sphereId: SphereId;
}

const BudgetAllocationPanel: React.FC<BudgetAllocationPanelProps> = ({ sphereId }) => {
  const { budgets, globalBalance, createBudget, allocateTokens } = useTokenStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: 1000,
    period: 'monthly' as TokenBudget['period'],
  });

  const sphereBudgets = Object.values(budgets).filter((b) => b.sphereId === sphereId);
  const totalAllocated = sphereBudgets.reduce((sum, b) => sum + b.totalAllocated, 0);

  const handleCreateBudget = () => {
    if (!newBudget.name || newBudget.amount <= 0) return;
    
    createBudget({
      name: newBudget.name,
      sphereId,
      totalAllocated: newBudget.amount,
      period: newBudget.period,
    });
    
    setShowCreate(false);
    setNewBudget({ name: '', amount: 1000, period: 'monthly' });
  };

  const sphere = SPHERES[sphereId];

  return (
    <div className="budget-allocation-panel">
      <div className="panel-header">
        <h3>💰 Budget Allocation</h3>
        <span className="sphere-tag" style={{ color: sphere.color }}>
          {sphere.icon} {sphere.name}
        </span>
      </div>

      <div className="budget-overview">
        <div className="overview-item">
          <span className="overview-label">Global Balance</span>
          <span className="overview-value">{globalBalance.toLocaleString()}</span>
        </div>
        <div className="overview-item">
          <span className="overview-label">Sphere Allocated</span>
          <span className="overview-value">{totalAllocated.toLocaleString()}</span>
        </div>
        <div className="overview-item">
          <span className="overview-label">Budgets</span>
          <span className="overview-value">{sphereBudgets.length}</span>
        </div>
      </div>

      <div className="budget-actions">
        <button className="create-btn" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ Create Budget'}
        </button>
      </div>

      {showCreate && (
        <div className="create-budget-form">
          <input
            type="text"
            placeholder="Budget name..."
            value={newBudget.name}
            onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
          />
          <div className="amount-input">
            <label>Amount: {newBudget.amount.toLocaleString()} tokens</label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: parseInt(e.target.value) })}
            />
          </div>
          <select
            value={newBudget.period}
            onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as TokenBudget['period'] })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="unlimited">Unlimited</option>
          </select>
          <button className="save-btn" onClick={handleCreateBudget}>Create Budget</button>
        </div>
      )}

      <div className="budgets-list">
        {sphereBudgets.map((budget) => {
          const usagePercent = (budget.totalUsed / budget.totalAllocated) * 100;
          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-header">
                <span className="budget-name">{budget.name}</span>
                <span className="budget-period">{budget.period}</span>
              </div>
              <div className="budget-bar">
                <div 
                  className="budget-fill" 
                  style={{ 
                    width: `${Math.min(usagePercent, 100)}%`,
                    backgroundColor: usagePercent > 80 ? '#e74c3c' : '#3F7249',
                  }} 
                />
              </div>
              <div className="budget-stats">
                <span>{budget.totalUsed.toLocaleString()} / {budget.totalAllocated.toLocaleString()}</span>
                <span className="usage-percent">{usagePercent.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .budget-allocation-panel {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 14px;
          color: #fff;
        }

        .sphere-tag {
          font-size: 12px;
        }

        .budget-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 16px;
          background: rgba(216, 178, 106, 0.05);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .overview-item {
          text-align: center;
        }

        .overview-label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }

        .overview-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #D8B26A;
        }

        .budget-actions {
          margin-bottom: 16px;
        }

        .create-btn {
          width: 100%;
          padding: 12px;
          background: rgba(216, 178, 106, 0.1);
          border: 1px dashed rgba(216, 178, 106, 0.3);
          border-radius: 8px;
          color: #D8B26A;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .create-btn:hover {
          background: rgba(216, 178, 106, 0.15);
        }

        .create-budget-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .create-budget-form input[type="text"],
        .create-budget-form select {
          padding: 10px 14px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
        }

        .amount-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .amount-input label {
          font-size: 12px;
          color: #888;
        }

        .amount-input input[type="range"] {
          width: 100%;
          accent-color: #D8B26A;
        }

        .save-btn {
          padding: 10px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 6px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
        }

        .budgets-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .budget-item {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .budget-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .budget-name {
          font-size: 13px;
          color: #fff;
        }

        .budget-period {
          font-size: 11px;
          color: #666;
          text-transform: capitalize;
        }

        .budget-bar {
          height: 6px;
          background: #222;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .budget-fill {
          height: 100%;
          transition: width 0.3s;
        }

        .budget-stats {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #666;
        }

        .usage-percent {
          color: #D8B26A;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// GOVERNANCE PRINCIPLES
// ═══════════════════════════════════════════════════════════════

const GovernancePrinciples: React.FC = () => {
  const principles = [
    { icon: '🚫', title: 'No Attention Selling', description: 'We never sell your attention to advertisers' },
    { icon: '🔒', title: 'Data Sovereignty', description: 'Your data belongs to you, always' },
    { icon: '💡', title: 'Transparent Costs', description: 'Every token cost is visible and controllable' },
    { icon: '🎯', title: 'No Addiction Optimization', description: 'We don\'t optimize for engagement over value' },
    { icon: '✅', title: 'User Control', description: 'You control every step of AI execution' },
    { icon: '⚖️', title: 'Ethical AI', description: 'Governance ensures ethical AI behavior' },
  ];

  return (
    <div className="governance-principles">
      <h3>🌟 CHE·NU Governance Principles</h3>
      <p className="tagline">Governance is not a restriction — Governance is empowerment.</p>
      
      <div className="principles-grid">
        {principles.map((p, i) => (
          <div key={i} className="principle-card">
            <span className="principle-icon">{p.icon}</span>
            <h4>{p.title}</h4>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .governance-principles {
          background: linear-gradient(135deg, rgba(62, 180, 162, 0.1) 0%, rgba(63, 114, 73, 0.1) 100%);
          border: 1px solid rgba(62, 180, 162, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .governance-principles h3 {
          margin: 0 0 8px;
          color: #3EB4A2;
          font-size: 16px;
        }

        .tagline {
          margin: 0 0 24px;
          color: #888;
          font-size: 13px;
          font-style: italic;
        }

        .principles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .principle-card {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .principle-icon {
          font-size: 28px;
          display: block;
          margin-bottom: 8px;
        }

        .principle-card h4 {
          margin: 0 0 4px;
          color: #fff;
          font-size: 13px;
        }

        .principle-card p {
          margin: 0;
          color: #888;
          font-size: 11px;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .principles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN BUDGET & GOVERNANCE SECTION
// ═══════════════════════════════════════════════════════════════

interface BudgetGovernanceSectionProps {
  sphereId: SphereId;
}

export const BudgetGovernanceSection: React.FC<BudgetGovernanceSectionProps> = ({ sphereId }) => {
  const { budgets } = useTokenStore();
  const [activeTab, setActiveTab] = useState<'budgets' | 'rules' | 'principles'>('budgets');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const sphereBudgets = Object.values(budgets).filter((b) => b.sphereId === sphereId);

  return (
    <div className="budget-governance-section">
      <header className="section-header">
        <div className="header-info">
          <h2>💰 Budget & Governance</h2>
          <p>Control costs, enforce rules, maintain sovereignty</p>
        </div>
      </header>

      <nav className="section-tabs">
        <button 
          className={activeTab === 'budgets' ? 'active' : ''} 
          onClick={() => setActiveTab('budgets')}
        >
          💰 Budgets
        </button>
        <button 
          className={activeTab === 'rules' ? 'active' : ''} 
          onClick={() => setActiveTab('rules')}
        >
          🔒 Rules
        </button>
        <button 
          className={activeTab === 'principles' ? 'active' : ''} 
          onClick={() => setActiveTab('principles')}
        >
          🌟 Principles
        </button>
      </nav>

      <div className="section-content">
        {activeTab === 'budgets' && (
          <BudgetAllocationPanel sphereId={sphereId} />
        )}

        {activeTab === 'rules' && (
          <div className="rules-content">
            {sphereBudgets.length === 0 ? (
              <div className="empty-state">
                <span>🔒</span>
                <h3>Create a budget first</h3>
                <p>Rules are attached to budgets</p>
              </div>
            ) : (
              <>
                <div className="budget-selector">
                  <label>Select Budget:</label>
                  <select
                    value={selectedBudgetId || ''}
                    onChange={(e) => setSelectedBudgetId(e.target.value || null)}
                  >
                    <option value="">Choose a budget...</option>
                    {sphereBudgets.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                {selectedBudgetId && (
                  <GovernanceRulesPanel budgetId={selectedBudgetId} sphereId={sphereId} />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'principles' && (
          <GovernancePrinciples />
        )}
      </div>

      <style>{`
        .budget-governance-section {
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
        }

        .section-header {
          padding: 20px 24px;
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

        .section-tabs {
          display: flex;
          background: #0d0d0d;
          border-bottom: 1px solid #222;
        }

        .section-tabs button {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-tabs button:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #888;
        }

        .section-tabs button.active {
          background: rgba(216, 178, 106, 0.1);
          color: #D8B26A;
        }

        .section-content {
          padding: 24px;
        }

        .rules-content .budget-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .rules-content label {
          font-size: 13px;
          color: #888;
        }

        .rules-content select {
          flex: 1;
          padding: 10px 14px;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
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

        .empty-state h3 {
          color: #888;
          margin: 0 0 8px;
        }
      `}</style>
    </div>
  );
};

export default BudgetGovernanceSection;
