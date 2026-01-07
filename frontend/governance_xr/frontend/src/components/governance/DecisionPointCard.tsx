/**
 * CHE·NU™ Decision Point Card Component
 * 
 * Displays pending decisions/confirmations/tasks with:
 * - Time-based aging colors (green → yellow → red → blink → archive)
 * - AI suggestion from Nova
 * - User response options (validate, redirect, comment)
 * 
 * R&D Compliance:
 * - Rule #1: Human Sovereignty - Nova suggests, human decides
 * - Rule #6: Full traceability
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  DecisionPointCardProps,
  DecisionPointListProps,
  DecisionPoint,
  AgingLevel,
  UserResponseType,
} from '../../types/governance-xr.types';
import {
  AGING_CONFIG,
  DECISION_TYPE_CONFIG,
  computeAgingLevel,
  formatAgingTime,
} from '../../types/governance-xr.types';

// =============================================================================
// DECISION POINT CARD COMPONENT
// =============================================================================

export function DecisionPointCard({
  point,
  onValidate,
  onRedirect,
  onComment,
  onDefer,
  onArchive,
  compact = false,
  showSuggestion = true,
}: DecisionPointCardProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [comment, setComment] = useState('');
  const [currentAging, setCurrentAging] = useState<AgingLevel>(point.aging_level);

  // Update aging level periodically
  useEffect(() => {
    const updateAging = () => {
      const newLevel = computeAgingLevel(point.created_at);
      if (newLevel !== currentAging) {
        setCurrentAging(newLevel);
      }
    };

    updateAging();
    const interval = setInterval(updateAging, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [point.created_at, currentAging]);

  const agingConfig = AGING_CONFIG[currentAging];
  const typeConfig = DECISION_TYPE_CONFIG[point.point_type];

  const handleValidate = () => {
    onValidate?.(point.id);
  };

  const handleRedirect = (alternative: string) => {
    onRedirect?.(point.id, alternative);
    setShowAlternatives(false);
  };

  const handleComment = () => {
    if (comment.trim()) {
      onComment?.(point.id, comment);
      setComment('');
      setShowCommentForm(false);
    }
  };

  const handleDefer = () => {
    onDefer?.(point.id);
  };

  const handleArchive = () => {
    onArchive?.(point.id);
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

  // Blink animation for critical items
  const blinkAnimation = currentAging === AgingLevel.BLINK ? {
    animate: {
      opacity: [1, 0.5, 1],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } : {};

  if (point.is_archived) {
    return (
      <motion.div
        className="decision-card decision-archived"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        style={{
          '--aging-color': agingConfig.color,
          '--aging-bg': agingConfig.bgColor,
          '--aging-border': agingConfig.borderColor,
        } as React.CSSProperties}
      >
        <div className="decision-header">
          <span className="type-badge">{typeConfig.icon} {typeConfig.labelFr}</span>
          <span className="archived-badge">📦 Archivé</span>
        </div>
        <h3 className="decision-title">{point.title}</h3>
        {point.archive_reason && (
          <p className="archive-reason">
            Raison: {point.archive_reason === 'timeout' ? 'Délai dépassé' : point.archive_reason}
          </p>
        )}
        <style>{styles}</style>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`decision-card ${compact ? 'decision-compact' : ''}`}
      style={{
        '--aging-color': agingConfig.color,
        '--aging-bg': agingConfig.bgColor,
        '--aging-border': agingConfig.borderColor,
        '--type-color': typeConfig.color,
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      {...blinkAnimation}
    >
      {/* Header with aging indicator */}
      <div className="decision-header">
        {/* Aging badge */}
        <span className={`aging-badge aging-${currentAging}`}>
          {agingConfig.icon}
          <span className="aging-time">{formatAgingTime(point.created_at)}</span>
          {currentAging === AgingLevel.BLINK && (
            <span className="blink-indicator">⚠️</span>
          )}
        </span>

        {/* Type badge */}
        <span className="type-badge">
          <span className="type-icon">{typeConfig.icon}</span>
          <span className="type-label">{typeConfig.labelFr}</span>
        </span>

        {/* Date */}
        <span className="decision-date">{formatDate(point.created_at)}</span>
      </div>

      {/* Content */}
      <div className="decision-content">
        <h3 className="decision-title">{point.title}</h3>
        {point.description && !compact && (
          <p className="decision-description">{point.description}</p>
        )}
      </div>

      {/* AI Suggestion */}
      {point.suggestion && showSuggestion && (
        <div className="suggestion-box">
          <div className="suggestion-header">
            <span className="suggestion-icon">🤖</span>
            <span className="suggestion-label">Suggestion Nova</span>
            <span className="confidence-badge">
              {Math.round(point.suggestion.confidence * 100)}%
            </span>
          </div>
          
          <p className="suggestion-summary">{point.suggestion.summary}</p>
          
          {!compact && point.suggestion.rationale && (
            <p className="suggestion-rationale">
              💡 {point.suggestion.rationale}
            </p>
          )}

          {/* Alternatives toggle */}
          {point.suggestion.alternatives.length > 0 && (
            <button
              className="alternatives-toggle"
              onClick={() => setShowAlternatives(!showAlternatives)}
            >
              {showAlternatives ? '▼' : '▶'} {point.suggestion.alternatives.length} alternatives
            </button>
          )}

          {/* Alternatives list */}
          <AnimatePresence>
            {showAlternatives && (
              <motion.div
                className="alternatives-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {point.suggestion.alternatives.map((alt, index) => (
                  <button
                    key={index}
                    className="alternative-option"
                    onClick={() => handleRedirect(alt)}
                  >
                    ↪ {alt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="decision-actions">
        {showCommentForm ? (
          <div className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={2}
              autoFocus
            />
            <div className="form-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCommentForm(false);
                  setComment('');
                }}
              >
                Annuler
              </button>
              <button
                className="submit-btn"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                Envoyer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Primary action: Validate */}
            {onValidate && (
              <button className="action-btn validate-btn" onClick={handleValidate}>
                ✓ Valider
              </button>
            )}

            {/* Secondary: Show alternatives */}
            {onRedirect && point.suggestion?.alternatives?.length > 0 && (
              <button
                className="action-btn redirect-btn"
                onClick={() => setShowAlternatives(!showAlternatives)}
              >
                ↪ Changer
              </button>
            )}

            {/* Tertiary: Comment */}
            {onComment && (
              <button
                className="action-btn comment-btn"
                onClick={() => setShowCommentForm(true)}
              >
                💬 Commenter
              </button>
            )}

            {/* Defer */}
            {onDefer && currentAging !== AgingLevel.BLINK && currentAging !== AgingLevel.RED && (
              <button className="action-btn defer-btn" onClick={handleDefer}>
                ⏸️ Reporter
              </button>
            )}

            {/* Archive (only for blink/red) */}
            {onArchive && (currentAging === AgingLevel.BLINK || currentAging === AgingLevel.RED) && (
              <button className="action-btn archive-btn" onClick={handleArchive}>
                📦 Archiver
              </button>
            )}
          </>
        )}
      </div>

      {/* Reminder count indicator */}
      {point.reminder_count > 0 && (
        <div className="reminder-indicator">
          🔔 {point.reminder_count} rappel{point.reminder_count > 1 ? 's' : ''} envoyé{point.reminder_count > 1 ? 's' : ''}
        </div>
      )}

      <style>{styles}</style>
    </motion.div>
  );
}

// =============================================================================
// DECISION POINT LIST COMPONENT
// =============================================================================

export function DecisionPointList({
  points,
  onValidate,
  onRedirect,
  onComment,
  onDefer,
  onArchive,
  filterByAging,
  filterByType,
  sortBy = 'aging',
  showArchived = false,
}: DecisionPointListProps) {
  // Filter points
  let filteredPoints = points.filter((p) => {
    if (!showArchived && p.is_archived) return false;
    if (filterByAging && !filterByAging.includes(p.aging_level)) return false;
    if (filterByType && !filterByType.includes(p.point_type)) return false;
    return true;
  });

  // Sort points
  filteredPoints = [...filteredPoints].sort((a, b) => {
    switch (sortBy) {
      case 'aging': {
        // Sort by urgency (blink first, then red, yellow, green, archive)
        const agingOrder = {
          [AgingLevel.BLINK]: 0,
          [AgingLevel.RED]: 1,
          [AgingLevel.YELLOW]: 2,
          [AgingLevel.GREEN]: 3,
          [AgingLevel.ARCHIVE]: 4,
        };
        return agingOrder[a.aging_level] - agingOrder[b.aging_level];
      }
      case 'created':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'type':
        return a.point_type.localeCompare(b.point_type);
      default:
        return 0;
    }
  });

  // Count by aging level
  const agingCounts = filteredPoints.reduce(
    (acc, p) => {
      acc[p.aging_level] = (acc[p.aging_level] || 0) + 1;
      return acc;
    },
    {} as Record<AgingLevel, number>
  );

  if (filteredPoints.length === 0) {
    return (
      <div className="decision-list-empty">
        <span className="empty-icon">✅</span>
        <p>Aucune décision en attente</p>
        <p className="empty-subtitle">Tout est à jour!</p>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="decision-list">
      {/* Summary header */}
      <div className="decision-list-header">
        <span className="list-title">
          {filteredPoints.length} point{filteredPoints.length > 1 ? 's' : ''} de décision
        </span>
        <div className="aging-summary">
          {Object.entries(agingCounts).map(([level, count]) => (
            <span key={level} className={`aging-count aging-${level}`}>
              {AGING_CONFIG[level as AgingLevel].icon} {count}
            </span>
          ))}
        </div>
      </div>

      {/* Urgent alert */}
      {(agingCounts[AgingLevel.BLINK] > 0 || agingCounts[AgingLevel.RED] > 0) && (
        <motion.div
          className="urgent-alert"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ⚠️ {(agingCounts[AgingLevel.BLINK] || 0) + (agingCounts[AgingLevel.RED] || 0)} décision(s) urgente(s) requièrent votre attention
        </motion.div>
      )}

      {/* Cards */}
      <div className="decision-cards">
        {filteredPoints.map((point) => (
          <DecisionPointCard
            key={point.id}
            point={point}
            onValidate={onValidate}
            onRedirect={onRedirect}
            onComment={onComment}
            onDefer={onDefer}
            onArchive={onArchive}
          />
        ))}
      </div>

      <style>{styles}</style>
    </div>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = `
  /* Card base */
  .decision-card {
    background: white;
    border: 2px solid var(--aging-border);
    border-left: 6px solid var(--aging-color);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
  }

  .decision-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .decision-compact {
    padding: 0.75rem;
  }

  .decision-archived {
    opacity: 0.6;
    background: var(--aging-bg);
  }

  /* Header */
  .decision-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  /* Aging badge */
  .aging-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--aging-bg);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--aging-color);
  }

  .aging-time {
    font-weight: 700;
  }

  .blink-indicator {
    margin-left: 0.25rem;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Type badge */
  .type-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: color-mix(in srgb, var(--type-color) 10%, white);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--type-color);
  }

  .type-icon {
    font-size: 0.875rem;
  }

  .archived-badge {
    padding: 0.25rem 0.5rem;
    background: #F3F4F6;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #6B7280;
  }

  .decision-date {
    margin-left: auto;
    font-size: 0.6875rem;
    color: #9CA3AF;
  }

  /* Content */
  .decision-content {
    margin-bottom: 0.75rem;
  }

  .decision-title {
    margin: 0 0 0.375rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .decision-description {
    margin: 0;
    font-size: 0.875rem;
    color: #6B7280;
    line-height: 1.5;
  }

  .archive-reason {
    margin: 0.5rem 0 0 0;
    font-size: 0.75rem;
    color: #9CA3AF;
    font-style: italic;
  }

  /* Suggestion box */
  .suggestion-box {
    background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
    border: 1px solid #BAE6FD;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .suggestion-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .suggestion-icon {
    font-size: 1.125rem;
  }

  .suggestion-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0369A1;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .confidence-badge {
    margin-left: auto;
    padding: 0.125rem 0.375rem;
    background: #0EA5E9;
    color: white;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 700;
  }

  .suggestion-summary {
    margin: 0 0 0.5rem 0;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #0C4A6E;
  }

  .suggestion-rationale {
    margin: 0;
    font-size: 0.8125rem;
    color: #0369A1;
    opacity: 0.8;
  }

  .alternatives-toggle {
    background: none;
    border: none;
    padding: 0.25rem 0;
    font-size: 0.75rem;
    color: #0369A1;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .alternatives-toggle:hover {
    text-decoration: underline;
  }

  .alternatives-list {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-top: 0.5rem;
    overflow: hidden;
  }

  .alternative-option {
    background: white;
    border: 1px solid #BAE6FD;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    color: #0369A1;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }

  .alternative-option:hover {
    background: #E0F2FE;
    border-color: #0EA5E9;
  }

  /* Actions */
  .decision-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding-top: 0.75rem;
    border-top: 1px solid #E5E7EB;
  }

  .action-btn {
    padding: 0.5rem 0.875rem;
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .validate-btn {
    background: #059669;
    color: white;
  }

  .validate-btn:hover {
    background: #047857;
  }

  .redirect-btn {
    background: #F59E0B;
    color: white;
  }

  .redirect-btn:hover {
    background: #D97706;
  }

  .comment-btn {
    background: #3B82F6;
    color: white;
  }

  .comment-btn:hover {
    background: #2563EB;
  }

  .defer-btn {
    background: white;
    color: #6B7280;
    border-color: #E5E7EB;
  }

  .defer-btn:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }

  .archive-btn {
    background: #FEE2E2;
    color: #991B1B;
    border-color: #FECACA;
  }

  .archive-btn:hover {
    background: #FECACA;
  }

  /* Comment form */
  .comment-form {
    width: 100%;
  }

  .comment-form textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    resize: vertical;
    font-family: inherit;
  }

  .comment-form textarea:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 1px;
  }

  .form-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }

  .cancel-btn, .submit-btn {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }

  .cancel-btn {
    background: white;
    color: #6B7280;
    border: 1px solid #E5E7EB;
  }

  .submit-btn {
    background: #3B82F6;
    color: white;
  }

  .submit-btn:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }

  /* Reminder indicator */
  .reminder-indicator {
    margin-top: 0.5rem;
    font-size: 0.6875rem;
    color: #9CA3AF;
    text-align: right;
  }

  /* List styles */
  .decision-list-empty {
    text-align: center;
    padding: 3rem 1rem;
    background: #F9FAFB;
    border-radius: 0.75rem;
  }

  .empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.75rem;
  }

  .decision-list-empty p {
    margin: 0;
    color: #6B7280;
    font-size: 1rem;
    font-weight: 500;
  }

  .empty-subtitle {
    font-weight: 400 !important;
    font-size: 0.875rem !important;
    margin-top: 0.25rem !important;
  }

  .decision-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #E5E7EB;
  }

  .list-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .aging-summary {
    display: flex;
    gap: 0.5rem;
  }

  .aging-count {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .aging-green {
    background: #D1FAE5;
    color: #059669;
  }

  .aging-yellow {
    background: #FEF3C7;
    color: #D97706;
  }

  .aging-red {
    background: #FEE2E2;
    color: #DC2626;
  }

  .aging-blink {
    background: #FCA5A5;
    color: #7C2D12;
    animation: pulse 1s ease-in-out infinite;
  }

  .aging-archive {
    background: #F3F4F6;
    color: #6B7280;
  }

  .urgent-alert {
    background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
    border: 1px solid #FECACA;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #991B1B;
    text-align: center;
  }

  .decision-cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// =============================================================================
// EXPORTS
// =============================================================================

export default DecisionPointCard;
