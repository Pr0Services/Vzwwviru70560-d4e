/**
 * CHE·NU™ Governance Signal Card Component
 * 
 * Displays a governance signal from CEAs:
 * - Signal level (WARN, CORRECT, PAUSE, BLOCK, ESCALATE)
 * - Criterion and message
 * - Patch instruction if applicable
 * - Acknowledge action
 * 
 * R&D Compliance:
 * - Rule #1: Signals inform human decisions
 * - Rule #6: Full traceability display
 */

import React from 'react';
import { motion } from 'framer-motion';
import type {
  GovernanceSignalCardProps,
  GovernanceSignalLevel,
  GovernanceCriterion,
} from '../../types/governance-xr.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const LEVEL_CONFIG: Record<GovernanceSignalLevel, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}> = {
  WARN: {
    icon: '⚠️',
    label: 'Avertissement',
    color: '#D97706',
    bgColor: '#FEF3C7',
  },
  CORRECT: {
    icon: '🔧',
    label: 'Correction',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  PAUSE: {
    icon: '⏸️',
    label: 'Pause',
    color: '#6366F1',
    bgColor: '#E0E7FF',
  },
  BLOCK: {
    icon: '🛑',
    label: 'Bloqué',
    color: '#DC2626',
    bgColor: '#FEE2E2',
  },
  ESCALATE: {
    icon: '🚨',
    label: 'Escalade',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
  },
};

const CRITERION_LABELS: Record<GovernanceCriterion, string> = {
  SCHEMA: 'Validation schéma',
  CANON: 'Règles canon',
  SECURITY: 'Sécurité',
  COHERENCE: 'Cohérence',
  STYLE: 'Style',
  BUDGET: 'Budget',
  LEGAL: 'Conformité légale',
};

// =============================================================================
// GOVERNANCE SIGNAL CARD COMPONENT
// =============================================================================

export function GovernanceSignalCard({
  signal,
  onAcknowledge,
}: GovernanceSignalCardProps) {
  const levelConfig = LEVEL_CONFIG[signal.level];
  const criterionLabel = CRITERION_LABELS[signal.criterion] || signal.criterion;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-CA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className="signal-card"
      style={{
        '--signal-color': levelConfig.color,
        '--signal-bg': levelConfig.bgColor,
      } as React.CSSProperties}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Level badge */}
      <div className="signal-level">
        <span className="level-icon">{levelConfig.icon}</span>
        <span className="level-label">{levelConfig.label}</span>
      </div>

      {/* Content */}
      <div className="signal-content">
        {/* Header */}
        <div className="signal-header">
          <span className="signal-cea">{signal.cea_name}</span>
          <span className="signal-separator">•</span>
          <span className="signal-criterion">{criterionLabel}</span>
          <span className="signal-time">{formatTime(signal.created_at)}</span>
        </div>

        {/* Message */}
        <p className="signal-message">{signal.message}</p>

        {/* Patch instruction (if CORRECT level) */}
        {signal.patch_instruction && (
          <div className="patch-instruction">
            <span className="patch-label">Correction suggérée:</span>
            <code className="patch-target">{signal.patch_target}</code>
            <span className="patch-action">{signal.patch_instruction.action}</span>
            <p className="patch-reason">{signal.patch_instruction.reason}</p>
          </div>
        )}

        {/* Details (expandable) */}
        {signal.details && Object.keys(signal.details).length > 0 && (
          <details className="signal-details">
            <summary>Détails techniques</summary>
            <pre>{JSON.stringify(signal.details, null, 2)}</pre>
          </details>
        )}
      </div>

      {/* Actions */}
      {onAcknowledge && (
        <div className="signal-actions">
          <button
            className="acknowledge-button"
            onClick={() => onAcknowledge(signal.id)}
          >
            ✓ Acquitter
          </button>
        </div>
      )}

      <style>{`
        .signal-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid var(--color-border, #E5E7EB);
          border-left: 4px solid var(--signal-color);
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .signal-level {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          min-width: 4rem;
          padding: 0.5rem;
          background: var(--signal-bg);
          border-radius: 0.375rem;
        }

        .level-icon {
          font-size: 1.5rem;
        }

        .level-label {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--signal-color);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .signal-content {
          flex: 1;
          min-width: 0;
        }

        .signal-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.375rem;
        }

        .signal-cea {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-primary, #111827);
        }

        .signal-separator {
          color: var(--color-text-tertiary, #9CA3AF);
        }

        .signal-criterion {
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.25rem;
          color: var(--color-text-secondary, #6B7280);
        }

        .signal-time {
          font-size: 0.6875rem;
          color: var(--color-text-tertiary, #9CA3AF);
          margin-left: auto;
        }

        .signal-message {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-text-primary, #111827);
          line-height: 1.5;
        }

        .patch-instruction {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #F0F9FF;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
        }

        .patch-label {
          font-weight: 500;
          color: #0369A1;
        }

        .patch-target {
          display: block;
          margin: 0.375rem 0;
          padding: 0.25rem 0.5rem;
          background: #E0F2FE;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.75rem;
        }

        .patch-action {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          background: #0284C7;
          color: white;
          border-radius: 0.25rem;
          font-size: 0.6875rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .patch-reason {
          margin: 0.375rem 0 0 0;
          color: var(--color-text-secondary, #6B7280);
        }

        .signal-details {
          margin-top: 0.75rem;
        }

        .signal-details summary {
          font-size: 0.75rem;
          color: var(--color-text-secondary, #6B7280);
          cursor: pointer;
        }

        .signal-details pre {
          margin: 0.5rem 0 0 0;
          padding: 0.5rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.25rem;
          font-size: 0.6875rem;
          overflow-x: auto;
        }

        .signal-actions {
          display: flex;
          align-items: flex-start;
        }

        .acknowledge-button {
          padding: 0.375rem 0.75rem;
          background: var(--signal-bg);
          color: var(--signal-color);
          border: 1px solid var(--signal-color);
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .acknowledge-button:hover {
          background: var(--signal-color);
          color: white;
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// SIGNAL LIST COMPONENT
// =============================================================================

interface SignalListProps {
  signals: GovernanceSignalCardProps['signal'][];
  onAcknowledge?: (signalId: string) => void;
}

export function GovernanceSignalList({ signals, onAcknowledge }: SignalListProps) {
  if (signals.length === 0) {
    return (
      <div className="signal-list-empty">
        <span className="empty-icon">✅</span>
        <p>Aucun signal de gouvernance / No governance signals</p>
        
        <style>{`
          .signal-list-empty {
            text-align: center;
            padding: 2rem;
            background: var(--color-bg-secondary, #F9FAFB);
            border-radius: 0.5rem;
          }

          .empty-icon {
            font-size: 2rem;
            display: block;
            margin-bottom: 0.5rem;
          }

          .signal-list-empty p {
            margin: 0;
            color: var(--color-text-secondary, #6B7280);
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="signal-list">
      {signals.map((signal) => (
        <GovernanceSignalCard
          key={signal.id}
          signal={signal}
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  );
}

export default GovernanceSignalCard;
