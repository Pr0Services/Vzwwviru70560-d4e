/**
 * CHE·NU™ Mode Selector Component
 * 
 * Allows user to choose thread entry mode:
 * - Chat: Text-based interaction
 * - Live: Real-time collaboration
 * - XR: Spatial/immersive view
 * 
 * R&D Compliance:
 * - Rule #1: Mode selection is explicitly human-initiated
 * - Rule #3: XR is projection only (explained in UI)
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { ThreadEntryMode, MaturityLevel } from '../../types/governance-xr.types';

// =============================================================================
// TYPES
// =============================================================================

interface ModeSelectorProps {
  availableModes: ThreadEntryMode[];
  recommendedMode: ThreadEntryMode;
  modeDescriptions: Record<ThreadEntryMode, string>;
  onSelect: (mode: ThreadEntryMode) => void;
  onXRHover?: () => void;
  isLoading?: boolean;
  maturityLevel: MaturityLevel;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MODE_CONFIG: Record<ThreadEntryMode, {
  icon: string;
  label: string;
  labelFr: string;
  color: string;
  bgColor: string;
}> = {
  chat: {
    icon: '💬',
    label: 'Chat',
    labelFr: 'Discussion',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
  live: {
    icon: '🔴',
    label: 'Live',
    labelFr: 'En direct',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
  xr: {
    icon: '🥽',
    label: 'XR',
    labelFr: 'Immersif',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
};

// =============================================================================
// MODE SELECTOR COMPONENT
// =============================================================================

export function ModeSelector({
  availableModes,
  recommendedMode,
  modeDescriptions,
  onSelect,
  onXRHover,
  isLoading = false,
  maturityLevel,
}: ModeSelectorProps) {
  const allModes: ThreadEntryMode[] = ['chat', 'live', 'xr'];

  return (
    <div className="mode-selector">
      {allModes.map((mode) => {
        const config = MODE_CONFIG[mode];
        const isAvailable = availableModes.includes(mode);
        const isRecommended = mode === recommendedMode;

        return (
          <motion.button
            key={mode}
            className={`mode-card ${isAvailable ? '' : 'mode-disabled'} ${isRecommended ? 'mode-recommended' : ''}`}
            style={{
              '--mode-color': config.color,
              '--mode-bg': config.bgColor,
            } as React.CSSProperties}
            onClick={() => isAvailable && onSelect(mode)}
            onMouseEnter={() => mode === 'xr' && onXRHover?.()}
            disabled={!isAvailable || isLoading}
            whileHover={isAvailable ? { scale: 1.02 } : undefined}
            whileTap={isAvailable ? { scale: 0.98 } : undefined}
          >
            {/* Recommended badge */}
            {isRecommended && (
              <span className="recommended-badge">
                ✨ Recommandé
              </span>
            )}

            {/* Icon */}
            <span className="mode-icon">{config.icon}</span>

            {/* Labels */}
            <div className="mode-labels">
              <span className="mode-name">{config.label}</span>
              <span className="mode-name-fr">{config.labelFr}</span>
            </div>

            {/* Description */}
            <p className="mode-description">
              {modeDescriptions[mode] || getDefaultDescription(mode)}
            </p>

            {/* Availability */}
            {!isAvailable && (
              <span className="mode-unavailable">
                {getUnavailableReason(mode, maturityLevel)}
              </span>
            )}

            {/* Loading indicator */}
            {isLoading && isAvailable && (
              <span className="mode-loading">
                <LoadingSpinner />
              </span>
            )}
          </motion.button>
        );
      })}

      <style>{`
        .mode-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .mode-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem;
          background: var(--mode-bg);
          border: 2px solid transparent;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .mode-card:hover:not(.mode-disabled) {
          border-color: var(--mode-color);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--mode-color) 20%, transparent);
        }

        .mode-card:focus-visible {
          outline: 2px solid var(--mode-color);
          outline-offset: 2px;
        }

        .mode-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .mode-recommended {
          border-color: var(--mode-color);
        }

        .recommended-badge {
          position: absolute;
          top: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--mode-color);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .mode-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .mode-labels {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .mode-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--mode-color);
        }

        .mode-name-fr {
          font-size: 0.75rem;
          color: var(--color-text-secondary, #6B7280);
        }

        .mode-description {
          font-size: 0.75rem;
          color: var(--color-text-secondary, #6B7280);
          margin: 0;
          line-height: 1.4;
        }

        .mode-unavailable {
          font-size: 0.625rem;
          color: var(--color-text-tertiary, #9CA3AF);
          font-style: italic;
          margin-top: 0.25rem;
        }

        .mode-loading {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }

        @media (max-width: 480px) {
          .mode-selector {
            grid-template-columns: 1fr;
          }

          .mode-card {
            flex-direction: row;
            text-align: left;
            padding: 1rem;
          }

          .mode-icon {
            font-size: 2rem;
          }

          .mode-labels {
            flex: 1;
            margin-left: 0.75rem;
          }

          .mode-description {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// LOADING SPINNER
// =============================================================================

function LoadingSpinner() {
  return (
    <svg
      className="spinner"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M8 2C4.686 2 2 4.686 2 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="0.75s"
          repeatCount="indefinite"
        />
      </path>
      <style>{`
        .spinner {
          color: var(--mode-color);
        }
      `}</style>
    </svg>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function getDefaultDescription(mode: ThreadEntryMode): string {
  switch (mode) {
    case 'chat':
      return 'Échangez par messages texte / Text-based discussion';
    case 'live':
      return 'Collaborez en temps réel / Real-time collaboration';
    case 'xr':
      return 'Explorez en immersion / Immersive spatial view';
    default:
      return '';
  }
}

function getUnavailableReason(mode: ThreadEntryMode, maturityLevel: MaturityLevel): string {
  switch (mode) {
    case 'live':
      return 'Niveau Workshop requis / Requires Workshop level';
    case 'xr':
      if (maturityLevel < 2) {
        return 'Niveau Workshop requis / Requires Workshop level';
      }
      return 'Non disponible / Not available';
    default:
      return 'Non disponible / Not available';
  }
}

export default ModeSelector;
