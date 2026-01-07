/**
 * CHE·NU Budget Component
 * Token/cost budget per project/sphere
 */

import React, { useState, useMemo } from 'react';

export interface BudgetConfig {
  sphereId: string;
  projectId?: string;
  daily: number;
  monthly: number;
  used: number;
  lastReset: string;
}

interface BudgetProps {
  config: BudgetConfig;
  estimatedTokens: number;
  onConfigChange?: (config: BudgetConfig) => void;
}

export const Budget: React.FC<BudgetProps> = ({
  config,
  estimatedTokens,
  onConfigChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);

  const dailyUsage = useMemo(() => {
    const pct = (config.used / config.daily) * 100;
    return {
      percentage: Math.min(100, pct),
      remaining: Math.max(0, config.daily - config.used),
      status: pct >= 100 ? 'exhausted' : pct >= 80 ? 'warning' : 'ok',
    };
  }, [config]);

  const canAfford = config.used + estimatedTokens <= config.daily;

  const handleSave = () => {
    onConfigChange?.(editConfig);
    setEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exhausted': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          background: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💰</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12 }}>Budget Tokens</div>
            <div style={{ fontSize: 10, color: '#666' }}>
              {config.sphereId}
              {config.projectId ? ` / ${config.projectId}` : ''}
            </div>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          style={{
            padding: '4px 8px',
            fontSize: 11,
            border: '1px solid #ddd',
            borderRadius: 4,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {editing ? 'Annuler' : '⚙️'}
        </button>
      </div>

      {/* Edit mode */}
      {editing ? (
        <div style={{ padding: 14 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>
              Budget journalier (tokens)
            </label>
            <input
              type="number"
              value={editConfig.daily}
              onChange={(e) =>
                setEditConfig({ ...editConfig, daily: parseInt(e.target.value) || 0 })
              }
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>
              Budget mensuel (tokens)
            </label>
            <input
              type="number"
              value={editConfig.monthly}
              onChange={(e) =>
                setEditConfig({ ...editConfig, monthly: parseInt(e.target.value) || 0 })
              }
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
              }}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              background: '#3b82f6',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <div style={{ padding: 14 }}>
          {/* Progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                marginBottom: 4,
              }}
            >
              <span>Utilisation journalière</span>
              <span>
                {config.used.toLocaleString()} / {config.daily.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: '#e0e0e0',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${dailyUsage.percentage}%`,
                  background: getStatusColor(dailyUsage.status),
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <StatBox
              label="Restant"
              value={dailyUsage.remaining.toLocaleString()}
              color={dailyUsage.status === 'ok' ? '#166534' : '#92400e'}
            />
            <StatBox
              label="Cette requête"
              value={`~${estimatedTokens}`}
              color={canAfford ? '#166534' : '#dc2626'}
            />
            <StatBox
              label="Mensuel"
              value={`${Math.round((config.used / config.monthly) * 100)}%`}
              color="#666"
            />
          </div>

          {/* Warning */}
          {!canAfford && (
            <div
              style={{
                padding: '8px 10px',
                fontSize: 11,
                background: '#fef2f2',
                borderRadius: 6,
                color: '#dc2626',
              }}
            >
              ⚠️ Cette requête dépasse votre budget journalier restant.
              {dailyUsage.remaining > 0
                ? ` Disponible: ${dailyUsage.remaining} tokens`
                : ' Budget épuisé pour aujourd\'hui.'}
            </div>
          )}

          {dailyUsage.status === 'warning' && canAfford && (
            <div
              style={{
                padding: '8px 10px',
                fontSize: 11,
                background: '#fffbeb',
                borderRadius: 6,
                color: '#92400e',
              }}
            >
              ⚠️ Proche de la limite journalière ({Math.round(dailyUsage.percentage)}% utilisé)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <div
    style={{
      padding: '8px',
      background: '#f5f5f5',
      borderRadius: 6,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color }}>{value}</div>
  </div>
);

// Default budget configuration
export const DEFAULT_BUDGET: BudgetConfig = {
  sphereId: 'construction',
  projectId: undefined,
  daily: 50000,
  monthly: 1000000,
  used: 12500,
  lastReset: new Date().toISOString().split('T')[0],
};

// Budget presets by sphere
export const SPHERE_BUDGETS: Record<string, Partial<BudgetConfig>> = {
  construction: { daily: 50000, monthly: 1000000 },
  finance: { daily: 30000, monthly: 600000 },
  hr: { daily: 20000, monthly: 400000 },
  marketing: { daily: 40000, monthly: 800000 },
  operations: { daily: 25000, monthly: 500000 },
};

export default Budget;
