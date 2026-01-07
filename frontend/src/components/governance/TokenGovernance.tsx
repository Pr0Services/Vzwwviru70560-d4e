/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TOKEN GOVERNANCE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES CRITIQUES (NE PAS MALINTERPRÉTER):
 * 
 * CHE·NU Tokens sont:
 * - des crédits utilitaires INTERNES
 * - PAS une cryptomonnaie
 * - PAS spéculatifs
 * - PAS basés sur le marché
 * 
 * Les Tokens représentent l'ÉNERGIE D'INTELLIGENCE.
 * 
 * Les Tokens servent à:
 * - financer les threads
 * - financer les agents
 * - financer les meetings
 * - gouverner l'exécution IA
 * - rendre le coût visible et contrôlable
 * 
 * Les Tokens sont:
 * - budgétés
 * - traçables
 * - gouvernés
 * - transférables avec règles
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { SphereId } from '../../canonical/SPHERES_CANONICAL_V2';

// Token Types
export interface TokenBudget {
  id: string;
  ownerId: string;
  sphereId?: SphereId;
  type: 'personal' | 'sphere' | 'project' | 'thread' | 'meeting';
  
  // Amounts
  allocated: number;
  used: number;
  reserved: number;
  
  // Limits
  dailyLimit?: number;
  monthlyLimit?: number;
  
  // Tracking
  lastUsed?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TokenTransaction {
  id: string;
  timestamp: number;
  type: 'allocation' | 'usage' | 'transfer' | 'refund';
  fromBudgetId?: string;
  toBudgetId?: string;
  amount: number;
  description: string;
  agentId?: string;
  threadId?: string;
  meetingId?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface TokenGovernanceRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'approve' | 'deny' | 'require_approval';
  threshold?: number;
  active: boolean;
}

interface TokenGovernanceProps {
  userId: string;
  budgets: TokenBudget[];
  transactions: TokenTransaction[];
  rules: TokenGovernanceRule[];
  onAllocate: (targetBudgetId: string, amount: number) => void;
  onTransfer: (fromBudgetId: string, toBudgetId: string, amount: number) => void;
  onUpdateRule: (ruleId: string, active: boolean) => void;
  language?: 'en' | 'fr';
}

export const TokenGovernance: React.FC<TokenGovernanceProps> = ({
  userId,
  budgets,
  transactions,
  rules,
  onAllocate,
  onTransfer,
  onUpdateRule,
  language = 'fr'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'transactions' | 'rules'>('overview');
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<TokenBudget | null>(null);

  const labels = {
    en: {
      title: 'Token Governance',
      subtitle: 'Intelligence energy management',
      overview: 'Overview',
      budgets: 'Budgets',
      transactions: 'Transactions',
      rules: 'Rules',
      totalBalance: 'Total Balance',
      available: 'Available',
      used: 'Used',
      reserved: 'Reserved',
      allocate: 'Allocate',
      transfer: 'Transfer',
      recentActivity: 'Recent Activity',
      activeRules: 'Active Rules',
      warning: 'Tokens are internal utility credits, NOT cryptocurrency',
      budgetTypes: {
        personal: 'Personal',
        sphere: 'Sphere',
        project: 'Project',
        thread: 'Thread',
        meeting: 'Meeting'
      },
      transactionTypes: {
        allocation: 'Allocation',
        usage: 'Usage',
        transfer: 'Transfer',
        refund: 'Refund'
      }
    },
    fr: {
      title: 'Gouvernance Tokens',
      subtitle: 'Gestion de l\'énergie d\'intelligence',
      overview: 'Vue d\'ensemble',
      budgets: 'Budgets',
      transactions: 'Transactions',
      rules: 'Règles',
      totalBalance: 'Solde Total',
      available: 'Disponible',
      used: 'Utilisé',
      reserved: 'Réservé',
      allocate: 'Allouer',
      transfer: 'Transférer',
      recentActivity: 'Activité Récente',
      activeRules: 'Règles Actives',
      warning: 'Les tokens sont des crédits utilitaires internes, PAS une cryptomonnaie',
      budgetTypes: {
        personal: 'Personnel',
        sphere: 'Sphère',
        project: 'Projet',
        thread: 'Fil',
        meeting: 'Meeting'
      },
      transactionTypes: {
        allocation: 'Allocation',
        usage: 'Utilisation',
        transfer: 'Transfert',
        refund: 'Remboursement'
      }
    }
  };

  const t = labels[language];

  // Calculate totals
  const totals = useMemo(() => {
    return budgets.reduce((acc, budget) => ({
      allocated: acc.allocated + budget.allocated,
      used: acc.used + budget.used,
      reserved: acc.reserved + budget.reserved,
      available: acc.available + (budget.allocated - budget.used - budget.reserved)
    }), { allocated: 0, used: 0, reserved: 0, available: 0 });
  }, [budgets]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }, [transactions]);

  const activeRules = useMemo(() => {
    return rules.filter(r => r.active);
  }, [rules]);

  const getTransactionIcon = (type: TokenTransaction['type']): string => {
    const icons = {
      allocation: '📥',
      usage: '⚡',
      transfer: '↔️',
      refund: '↩️'
    };
    return icons[type];
  };

  const getTransactionColor = (type: TokenTransaction['type']): string => {
    const colors = {
      allocation: '#3F7249',
      usage: '#D8B26A',
      transfer: '#3B82F6',
      refund: '#8B5CF6'
    };
    return colors[type];
  };

  return (
    <div
      className="token-governance"
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
          <span style={{ fontSize: '24px' }}>💰</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#D8B26A' }}>{t.title}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#8D8371' }}>{t.subtitle}</p>
          </div>
        </div>

        {/* Warning Banner */}
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
          {(['overview', 'budgets', 'transactions', 'rules'] as const).map(tab => (
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
              {t[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeTab === 'overview' && (
          <div>
            {/* Total Balance Card */}
            <div
              style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #2F4C39 0%, #3F7249 100%)',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                {t.totalBalance}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>
                🪙 {totals.allocated.toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>{t.available}</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{totals.available.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>{t.used}</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{totals.used.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>{t.reserved}</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{totals.reserved.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => setShowAllocateModal(true)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#2A2B2E',
                  border: '1px solid #3A3B3E',
                  borderRadius: '8px',
                  color: '#E9E4D6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📥 {t.allocate}
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#2A2B2E',
                  border: '1px solid #3A3B3E',
                  borderRadius: '8px',
                  color: '#E9E4D6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                ↔️ {t.transfer}
              </button>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#8D8371' }}>
                {t.recentActivity}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentTransactions.slice(0, 5).map(tx => (
                  <div
                    key={tx.id}
                    style={{
                      padding: '12px',
                      background: '#2A2B2E',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>{getTransactionIcon(tx.type)}</span>
                      <div>
                        <div style={{ fontSize: '13px' }}>{tx.description}</div>
                        <div style={{ fontSize: '11px', color: '#8D8371' }}>
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: tx.type === 'usage' ? '#EF4444' : '#3F7249'
                      }}
                    >
                      {tx.type === 'usage' ? '-' : '+'}{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgets.map(budget => (
              <div
                key={budget.id}
                style={{
                  padding: '16px',
                  background: '#2A2B2E',
                  borderRadius: '8px',
                  border: '1px solid #3A3B3E'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      {t.budgetTypes[budget.type]}
                      {budget.sphereId && ` - ${budget.sphereId}`}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8D8371' }}>ID: {budget.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#D8B26A' }}>
                      🪙 {budget.allocated.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      height: '8px',
                      background: '#1E1F22',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex'
                    }}
                  >
                    <div
                      style={{
                        width: `${(budget.used / budget.allocated) * 100}%`,
                        background: '#EF4444',
                        transition: 'width 0.3s ease'
                      }}
                    />
                    <div
                      style={{
                        width: `${(budget.reserved / budget.allocated) * 100}%`,
                        background: '#D8B26A',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#8D8371' }}>
                    <span>{t.used}: {budget.used.toLocaleString()}</span>
                    <span>{t.reserved}: {budget.reserved.toLocaleString()}</span>
                    <span>{t.available}: {(budget.allocated - budget.used - budget.reserved).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTransactions.map(tx => (
              <div
                key={tx.id}
                style={{
                  padding: '12px',
                  background: '#2A2B2E',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${getTransactionColor(tx.type)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{getTransactionIcon(tx.type)}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{tx.description}</div>
                      <div style={{ fontSize: '11px', color: '#8D8371', marginTop: '2px' }}>
                        {t.transactionTypes[tx.type]} • {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: tx.type === 'usage' ? '#EF4444' : '#3F7249'
                    }}
                  >
                    {tx.type === 'usage' ? '-' : '+'}{tx.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rules.map(rule => (
              <div
                key={rule.id}
                style={{
                  padding: '16px',
                  background: '#2A2B2E',
                  borderRadius: '8px',
                  opacity: rule.active ? 1 : 0.6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{rule.name}</div>
                    <div style={{ fontSize: '12px', color: '#8D8371', marginTop: '4px' }}>
                      {rule.description}
                    </div>
                    {rule.threshold && (
                      <div style={{ fontSize: '11px', color: '#D8B26A', marginTop: '4px' }}>
                        Seuil: {rule.threshold.toLocaleString()} tokens
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onUpdateRule(rule.id, !rule.active)}
                    style={{
                      padding: '8px 16px',
                      background: rule.active ? '#3F7249' : '#3A3B3E',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {rule.active ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenGovernance;
