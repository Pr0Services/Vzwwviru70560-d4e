/**
 * CHE·NU™ Maturity Badge Component
 * 
 * Displays thread maturity level with:
 * - Level icon and name
 * - Score (optional)
 * - Signal breakdown (optional)
 * 
 * Maturity Levels:
 * - 0: Seed (0-9)
 * - 1: Sprout (10-24)
 * - 2: Workshop (25-44)
 * - 3: Studio (45-64)
 * - 4: Org (65-84)
 * - 5: Ecosystem (85-100)
 */

import React from 'react';
import { motion } from 'framer-motion';
import type {
  MaturityBadgeProps,
  MaturityLevel,
  MaturitySignals,
} from '../../types/governance-xr.types';
import {
  MATURITY_LEVEL_NAMES,
  MATURITY_LEVEL_COLORS,
  MATURITY_LEVEL_ICONS,
} from '../../types/governance-xr.types';

// =============================================================================
// MATURITY BADGE COMPONENT
// =============================================================================

export function MaturityBadge({
  maturity,
  size = 'md',
  showScore = false,
  showSignals = false,
}: MaturityBadgeProps) {
  const levelColor = MATURITY_LEVEL_COLORS[maturity.level as MaturityLevel];
  const levelIcon = MATURITY_LEVEL_ICONS[maturity.level as MaturityLevel];
  const levelName = MATURITY_LEVEL_NAMES[maturity.level as MaturityLevel];

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <motion.div
      className={`maturity-badge ${sizeClasses[size]}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ '--level-color': levelColor } as React.CSSProperties}
    >
      {/* Main badge */}
      <div className="badge-main">
        <span className="badge-icon">{levelIcon}</span>
        <div className="badge-info">
          <span className="badge-level">{levelName}</span>
          {showScore && (
            <span className="badge-score">{maturity.score}/100</span>
          )}
        </div>
      </div>

      {/* Score bar */}
      {showScore && (
        <div className="score-bar">
          <motion.div
            className="score-fill"
            initial={{ width: 0 }}
            animate={{ width: `${maturity.score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Signal breakdown */}
      {showSignals && (
        <div className="signals-breakdown">
          <SignalBreakdown signals={maturity.signals} />
        </div>
      )}

      <style>{`
        .maturity-badge {
          display: inline-flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--color-bg-primary, white);
          border: 2px solid var(--level-color);
          border-radius: 1rem;
          padding: 0.75rem 1rem;
        }

        .badge-sm {
          padding: 0.5rem 0.75rem;
        }

        .badge-sm .badge-icon {
          font-size: 1.25rem;
        }

        .badge-sm .badge-level {
          font-size: 0.75rem;
        }

        .badge-md .badge-icon {
          font-size: 1.5rem;
        }

        .badge-md .badge-level {
          font-size: 0.875rem;
        }

        .badge-lg .badge-icon {
          font-size: 2rem;
        }

        .badge-lg .badge-level {
          font-size: 1rem;
        }

        .badge-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .badge-icon {
          line-height: 1;
        }

        .badge-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .badge-level {
          font-weight: 600;
          color: var(--level-color);
        }

        .badge-score {
          font-size: 0.75rem;
          color: var(--color-text-secondary, #6B7280);
        }

        .score-bar {
          height: 4px;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 2px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: var(--level-color);
          border-radius: 2px;
        }

        .signals-breakdown {
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border, #E5E7EB);
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// SIGNAL BREAKDOWN COMPONENT
// =============================================================================

interface SignalBreakdownProps {
  signals: MaturitySignals;
}

function SignalBreakdown({ signals }: SignalBreakdownProps) {
  const signalItems = [
    { key: 'summary_count', label: '📝', value: signals.summary_count, max: 10 },
    { key: 'decision_count', label: '⚖️', value: signals.decision_count, max: 10 },
    { key: 'action_count', label: '✅', value: signals.action_count, max: 10 },
    { key: 'participant_count', label: '👥', value: signals.participant_count, max: 10 },
    { key: 'live_session_count', label: '🔴', value: signals.live_session_count, max: 10 },
  ];

  return (
    <div className="signal-breakdown">
      {signalItems.map((item) => (
        <div key={item.key} className="signal-item" title={item.key}>
          <span className="signal-icon">{item.label}</span>
          <span className="signal-value">
            {Math.min(item.value, item.max)}/{item.max}
          </span>
        </div>
      ))}

      <style>{`
        .signal-breakdown {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .signal-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .signal-icon {
          font-size: 0.875rem;
        }

        .signal-value {
          color: var(--color-text-secondary, #6B7280);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// COMPACT BADGE (for lists)
// =============================================================================

interface MaturityBadgeCompactProps {
  level: MaturityLevel;
  score?: number;
}

export function MaturityBadgeCompact({ level, score }: MaturityBadgeCompactProps) {
  const levelColor = MATURITY_LEVEL_COLORS[level];
  const levelIcon = MATURITY_LEVEL_ICONS[level];
  const levelName = MATURITY_LEVEL_NAMES[level];

  return (
    <span
      className="maturity-badge-compact"
      style={{ '--level-color': levelColor } as React.CSSProperties}
      title={`${levelName}${score !== undefined ? ` (${score}/100)` : ''}`}
    >
      <span className="compact-icon">{levelIcon}</span>
      <span className="compact-level">{levelName}</span>

      <style>{`
        .maturity-badge-compact {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: color-mix(in srgb, var(--level-color) 10%, transparent);
          border-radius: 9999px;
          font-size: 0.75rem;
        }

        .compact-icon {
          font-size: 0.875rem;
          line-height: 1;
        }

        .compact-level {
          color: var(--level-color);
          font-weight: 500;
        }
      `}</style>
    </span>
  );
}

export default MaturityBadge;
