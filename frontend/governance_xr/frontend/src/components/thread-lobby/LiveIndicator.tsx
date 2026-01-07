/**
 * CHE·NU™ Live Indicator Component
 * 
 * Shows when a thread has an active live session:
 * - Pulsing animation
 * - Participant count
 * - Join prompt
 */

import React from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface LiveIndicatorProps {
  participantCount: number;
  onJoin?: () => void;
}

// =============================================================================
// LIVE INDICATOR COMPONENT
// =============================================================================

export function LiveIndicator({ participantCount, onJoin }: LiveIndicatorProps) {
  return (
    <motion.div
      className="live-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Pulsing dot */}
      <span className="live-dot">
        <span className="pulse-ring" />
        <span className="dot-core" />
      </span>

      {/* Text */}
      <div className="live-text">
        <span className="live-label">EN DIRECT / LIVE</span>
        <span className="participant-count">
          {participantCount} {participantCount === 1 ? 'personne' : 'personnes'} connectée{participantCount === 1 ? '' : 's'}
        </span>
      </div>

      {/* Join button */}
      {onJoin && (
        <button className="join-button" onClick={onJoin}>
          Rejoindre / Join
        </button>
      )}

      <style>{`
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
          border: 1px solid #FECACA;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .live-dot {
          position: relative;
          width: 1rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #EF4444;
          border-radius: 50%;
          animation: pulse-animation 1.5s ease-out infinite;
        }

        .dot-core {
          position: relative;
          width: 0.5rem;
          height: 0.5rem;
          background: #EF4444;
          border-radius: 50%;
        }

        @keyframes pulse-animation {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .live-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .live-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #DC2626;
          letter-spacing: 0.05em;
        }

        .participant-count {
          font-size: 0.8125rem;
          color: #7F1D1D;
        }

        .join-button {
          padding: 0.5rem 1rem;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .join-button:hover {
          background: #DC2626;
        }

        .join-button:focus-visible {
          outline: 2px solid #EF4444;
          outline-offset: 2px;
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// COMPACT VERSION (for lists)
// =============================================================================

interface LiveBadgeCompactProps {
  participantCount?: number;
}

export function LiveBadgeCompact({ participantCount }: LiveBadgeCompactProps) {
  return (
    <span className="live-badge-compact">
      <span className="compact-dot" />
      <span className="compact-text">LIVE</span>
      {participantCount !== undefined && participantCount > 0 && (
        <span className="compact-count">{participantCount}</span>
      )}

      <style>{`
        .live-badge-compact {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          background: #FEE2E2;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 600;
          color: #DC2626;
        }

        .compact-dot {
          width: 0.375rem;
          height: 0.375rem;
          background: #EF4444;
          border-radius: 50%;
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .compact-text {
          letter-spacing: 0.05em;
        }

        .compact-count {
          padding-left: 0.25rem;
          border-left: 1px solid #FECACA;
          margin-left: 0.25rem;
        }
      `}</style>
    </span>
  );
}

export default LiveIndicator;
