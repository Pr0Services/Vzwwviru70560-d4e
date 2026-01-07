/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA PROGRESS INDICATOR                         ║
 * ║                    Indicateur de progression onboarding                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { getScriptOrder, NovaScriptId } from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaProgressIndicatorProps {
  currentScript: NovaScriptId | null;
  completedScripts: NovaScriptId[];
  variant?: 'bar' | 'dots' | 'steps';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  cenoteTurquoise: '#3EB4A2',
  sacredGold: '#D8B26A',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
};

const SCRIPT_LABELS: Record<NovaScriptId, string> = {
  welcome: 'Bienvenue',
  theme_selection: 'Thème',
  sphere_overview: 'Sphères',
  sphere_personal: 'Personnel',
  bureau_intro: 'Bureau',
  first_task: 'Première tâche',
  free_exploration: 'Exploration',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaProgressIndicator: React.FC<NovaProgressIndicatorProps> = ({
  currentScript,
  completedScripts,
  variant = 'dots',
}) => {
  const scripts = getScriptOrder();
  const currentIndex = currentScript ? scripts.indexOf(currentScript) : -1;
  const progress = Math.round((completedScripts.length / scripts.length) * 100);

  // ═══════════════════════════════════════════════════════════════════════════
  // BAR VARIANT
  // ═══════════════════════════════════════════════════════════════════════════

  if (variant === 'bar') {
    return (
      <div
        style={{
          width: '100%',
          height: 4,
          backgroundColor: COLORS.border,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: COLORS.cenoteTurquoise,
            transition: 'width 0.5s ease',
            borderRadius: 2,
          }}
        />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOTS VARIANT
  // ═══════════════════════════════════════════════════════════════════════════

  if (variant === 'dots') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {scripts.map((scriptId, index) => {
          const isCompleted = completedScripts.includes(scriptId);
          const isCurrent = currentScript === scriptId;
          const isPending = index > currentIndex;

          return (
            <div
              key={scriptId}
              style={{
                width: isCurrent ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isCompleted
                  ? COLORS.cenoteTurquoise
                  : isCurrent
                    ? COLORS.sacredGold
                    : COLORS.border,
                transition: 'all 0.3s ease',
                opacity: isPending ? 0.4 : 1,
              }}
              title={SCRIPT_LABELS[scriptId]}
            />
          );
        })}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS VARIANT
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {scripts.map((scriptId, index) => {
        const isCompleted = completedScripts.includes(scriptId);
        const isCurrent = currentScript === scriptId;
        const isPending = index > currentIndex;

        return (
          <React.Fragment key={scriptId}>
            {/* Step circle */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? COLORS.cenoteTurquoise
                  : isCurrent
                    ? COLORS.sacredGold
                    : 'transparent',
                border: `2px solid ${
                  isCompleted
                    ? COLORS.cenoteTurquoise
                    : isCurrent
                      ? COLORS.sacredGold
                      : COLORS.border
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                opacity: isPending ? 0.4 : 1,
              }}
              title={SCRIPT_LABELS[scriptId]}
            >
              {isCompleted ? (
                <span style={{ color: COLORS.uiDark, fontSize: 12 }}>✓</span>
              ) : (
                <span
                  style={{
                    color: isCurrent ? COLORS.uiDark : COLORS.ancientStone,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </span>
              )}
            </div>

            {/* Connector line */}
            {index < scripts.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  minWidth: 16,
                  maxWidth: 32,
                  backgroundColor: isCompleted
                    ? COLORS.cenoteTurquoise
                    : COLORS.border,
                  transition: 'background-color 0.3s ease',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default NovaProgressIndicator;
