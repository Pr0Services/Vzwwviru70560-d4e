/**
 * CHE·NU™ Backlog Item Card Component
 * 
 * Displays a governance backlog item:
 * - Type (error, signal, decision, cost, governance_debt)
 * - Severity (low, medium, high, critical)
 * - Status and resolution
 * - Actions (resolve, escalate)
 * 
 * R&D Compliance:
 * - Rule #1: Resolution requires human action
 * - Rule #6: Full traceability
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type {
  BacklogItemCardProps,
  BacklogType,
  BacklogSeverity,
  BacklogStatus,
} from '../../types/governance-xr.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const TYPE_CONFIG: Record<BacklogType, { icon: string; label: string; color: string }> = {
  error: { icon: '🐛', label: 'Erreur', color: '#DC2626' },
  signal: { icon: '📡', label: 'Signal', color: '#3B82F6' },
  decision: { icon: '⚖️', label: 'Décision', color: '#8B5CF6' },
  cost: { icon: '💰', label: 'Coût', color: '#D97706' },
  governance_debt: { icon: '📋', label: 'Dette', color: '#6366F1' },
};

const SEVERITY_CONFIG: Record<BacklogSeverity, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Faible', color: '#059669', bgColor: '#D1FAE5' },
  medium: { label: 'Moyen', color: '#D97706', bgColor: '#FEF3C7' },
  high: { label: 'Élevé', color: '#DC2626', bgColor: '#FEE2E2' },
  critical: { label: 'Critique', color: '#7C2D12', bgColor: '#FCA5A5' },
};

const STATUS_CONFIG: Record<BacklogStatus, { label: string; icon: string }> = {
  open: { label: 'Ouvert', icon: '🔓' },
  in_progress: { label: 'En cours', icon: '🔄' },
  resolved: { label: 'Résolu', icon: '✅' },
  wont_fix: { label: 'Ignoré', icon: '🚫' },
  duplicate: { label: 'Doublon', icon: '📋' },
};

// =============================================================================
// BACKLOG ITEM CARD COMPONENT
// =============================================================================

export function BacklogItemCard({
  item,
  onResolve,
  onEscalate,
}: BacklogItemCardProps) {
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolution, setResolution] = useState('');

  const typeConfig = TYPE_CONFIG[item.backlog_type];
  const severityConfig = SEVERITY_CONFIG[item.severity];
  const statusConfig = STATUS_CONFIG[item.status];

  const isResolved = item.status === 'resolved' || item.status === 'wont_fix' || item.status === 'duplicate';

  const handleResolve = () => {
    if (resolution.trim() && onResolve) {
      onResolve(item.id, resolution);
      setShowResolveForm(false);
      setResolution('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className={`backlog-card ${isResolved ? 'backlog-resolved' : ''}`}
      style={{
        '--type-color': typeConfig.color,
        '--severity-color': severityConfig.color,
        '--severity-bg': severityConfig.bgColor,
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="backlog-header">
        {/* Type badge */}
        <span className="type-badge">
          <span className="type-icon">{typeConfig.icon}</span>
          <span className="type-label">{typeConfig.label}</span>
        </span>

        {/* Severity badge */}
        <span className="severity-badge">
          {severityConfig.label}
        </span>

        {/* Status */}
        <span className="status-badge">
          <span className="status-icon">{statusConfig.icon}</span>
          <span className="status-label">{statusConfig.label}</span>
        </span>

        {/* Date */}
        <span className="backlog-date">{formatDate(item.created_at)}</span>
      </div>

      {/* Content */}
      <div className="backlog-content">
        <h3 className="backlog-title">{item.title}</h3>
        {item.description && (
          <p className="backlog-description">{item.description}</p>
        )}

        {/* Source spec */}
        {item.source_spec && (
          <span className="source-spec">
            Source: <code>{item.source_spec}</code>
          </span>
        )}
      </div>

      {/* Resolution (if resolved) */}
      {item.resolution && (
        <div className="backlog-resolution">
          <span className="resolution-label">Résolution:</span>
          <p className="resolution-text">{item.resolution}</p>
          {item.resolved_at && (
            <span className="resolution-date">
              Résolu le {formatDate(item.resolved_at)}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {!isResolved && (onResolve || onEscalate) && (
        <div className="backlog-actions">
          {showResolveForm ? (
            <div className="resolve-form">
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Décrivez la résolution..."
                rows={2}
              />
              <div className="form-buttons">
                <button
                  className="cancel-button"
                  onClick={() => setShowResolveForm(false)}
                >
                  Annuler
                </button>
                <button
                  className="submit-button"
                  onClick={handleResolve}
                  disabled={!resolution.trim()}
                >
                  Résoudre
                </button>
              </div>
            </div>
          ) : (
            <>
              {onResolve && (
                <button
                  className="resolve-button"
                  onClick={() => setShowResolveForm(true)}
                >
                  ✓ Résoudre
                </button>
              )}
              {onEscalate && item.severity !== 'critical' && (
                <button
                  className="escalate-button"
                  onClick={() => onEscalate(item.id)}
                >
                  ⬆️ Escalader
                </button>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .backlog-card {
          background: white;
          border: 1px solid var(--color-border, #E5E7EB);
          border-left: 4px solid var(--type-color);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
        }

        .backlog-resolved {
          opacity: 0.7;
          background: var(--color-bg-secondary, #F9FAFB);
        }

        .backlog-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: color-mix(in srgb, var(--type-color) 10%, white);
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--type-color);
        }

        .type-icon {
          font-size: 0.875rem;
        }

        .severity-badge {
          padding: 0.125rem 0.5rem;
          background: var(--severity-bg);
          color: var(--severity-color);
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--color-text-secondary, #6B7280);
        }

        .backlog-date {
          margin-left: auto;
          font-size: 0.6875rem;
          color: var(--color-text-tertiary, #9CA3AF);
        }

        .backlog-content {
          margin-bottom: 0.75rem;
        }

        .backlog-title {
          margin: 0 0 0.375rem 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-text-primary, #111827);
        }

        .backlog-description {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--color-text-secondary, #6B7280);
          line-height: 1.5;
        }

        .source-spec {
          display: inline-block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--color-text-tertiary, #9CA3AF);
        }

        .source-spec code {
          padding: 0.125rem 0.25rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .backlog-resolution {
          padding: 0.75rem;
          background: #F0FDF4;
          border-radius: 0.375rem;
          margin-bottom: 0.75rem;
        }

        .resolution-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #166534;
        }

        .resolution-text {
          margin: 0.25rem 0 0 0;
          font-size: 0.8125rem;
          color: #14532D;
        }

        .resolution-date {
          display: block;
          margin-top: 0.375rem;
          font-size: 0.6875rem;
          color: #166534;
        }

        .backlog-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border, #E5E7EB);
        }

        .resolve-button, .escalate-button {
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .resolve-button {
          background: #D1FAE5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .resolve-button:hover {
          background: #A7F3D0;
        }

        .escalate-button {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .escalate-button:hover {
          background: #FECACA;
        }

        .resolve-form {
          width: 100%;
        }

        .resolve-form textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--color-border, #E5E7EB);
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          resize: vertical;
          font-family: inherit;
        }

        .resolve-form textarea:focus {
          outline: 2px solid #3B82F6;
          outline-offset: 1px;
        }

        .form-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          justify-content: flex-end;
        }

        .cancel-button, .submit-button {
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
        }

        .cancel-button {
          background: white;
          color: var(--color-text-secondary, #6B7280);
          border: 1px solid var(--color-border, #E5E7EB);
        }

        .submit-button {
          background: #059669;
          color: white;
          border: none;
        }

        .submit-button:disabled {
          background: #9CA3AF;
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// BACKLOG LIST COMPONENT
// =============================================================================

interface BacklogListProps {
  items: BacklogItemCardProps['item'][];
  onResolve?: (itemId: string, resolution: string) => void;
  onEscalate?: (itemId: string) => void;
}

export function BacklogList({ items, onResolve, onEscalate }: BacklogListProps) {
  if (items.length === 0) {
    return (
      <div className="backlog-empty">
        <span className="empty-icon">📋</span>
        <p>Aucun élément dans le backlog / No backlog items</p>
        
        <style>{`
          .backlog-empty {
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

          .backlog-empty p {
            margin: 0;
            color: var(--color-text-secondary, #6B7280);
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="backlog-list">
      {items.map((item) => (
        <BacklogItemCard
          key={item.id}
          item={item}
          onResolve={onResolve}
          onEscalate={onEscalate}
        />
      ))}
    </div>
  );
}

export default BacklogItemCard;
