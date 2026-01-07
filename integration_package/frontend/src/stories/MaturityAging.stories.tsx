/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — MATURITY & AGING STORIES                    ║
 * ║                                                                              ║
 * ║  Thread maturity and decision aging components                              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MATURITY BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type MaturityLevel = 'SEED' | 'SPROUTING' | 'GROWING' | 'MATURE' | 'RIPE';

interface MaturityBadgeProps {
  level: MaturityLevel;
  score: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MATURITY_CONFIG = {
  SEED: { icon: '🌱', label: 'Graine', color: '#9CA3AF', range: [0, 20] },
  SPROUTING: { icon: '🌿', label: 'Germination', color: '#86EFAC', range: [20, 40] },
  GROWING: { icon: '🌳', label: 'Croissance', color: '#4ADE80', range: [40, 60] },
  MATURE: { icon: '🌾', label: 'Mature', color: '#22C55E', range: [60, 80] },
  RIPE: { icon: '🍎', label: 'Mûr', color: '#D8B26A', range: [80, 100] },
};

const MaturityBadge: React.FC<MaturityBadgeProps> = ({
  level,
  score,
  showProgress = false,
  size = 'md',
}) => {
  const config = MATURITY_CONFIG[level];
  const sizes = {
    sm: { icon: '16px', text: '10px', padding: '4px 8px' },
    md: { icon: '20px', text: '12px', padding: '6px 12px' },
    lg: { icon: '28px', text: '14px', padding: '8px 16px' },
  };
  const s = sizes[size];

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: `${config.color}20`,
          border: `1px solid ${config.color}40`,
          borderRadius: '20px',
          padding: s.padding,
        }}
      >
        <span style={{ fontSize: s.icon }}>{config.icon}</span>
        <span style={{ color: config.color, fontSize: s.text, fontWeight: 500 }}>
          {config.label}
        </span>
        <span style={{ color: '#9CA3AF', fontSize: s.text }}>
          {score}%
        </span>
      </div>
      {showProgress && (
        <div style={{ width: '100%', height: '4px', background: '#374151', borderRadius: '2px' }}>
          <div
            style={{
              width: `${score}%`,
              height: '100%',
              background: config.color,
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  );
};

const maturityMeta: Meta<typeof MaturityBadge> = {
  title: 'V72/MaturityBadge',
  component: MaturityBadge,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['SEED', 'SPROUTING', 'GROWING', 'MATURE', 'RIPE'],
    },
    score: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default maturityMeta;
type MaturityStory = StoryObj<typeof MaturityBadge>;

export const Seed: MaturityStory = {
  args: { level: 'SEED', score: 10, showProgress: true },
};

export const Sprouting: MaturityStory = {
  args: { level: 'SPROUTING', score: 35, showProgress: true },
};

export const Growing: MaturityStory = {
  args: { level: 'GROWING', score: 55, showProgress: true },
};

export const Mature: MaturityStory = {
  args: { level: 'MATURE', score: 75, showProgress: true },
};

export const Ripe: MaturityStory = {
  args: { level: 'RIPE', score: 95, showProgress: true },
};

export const AllLevels: MaturityStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: '#1E1F22' }}>
      <MaturityBadge level="SEED" score={10} showProgress size="lg" />
      <MaturityBadge level="SPROUTING" score={30} showProgress size="lg" />
      <MaturityBadge level="GROWING" score={50} showProgress size="lg" />
      <MaturityBadge level="MATURE" score={70} showProgress size="lg" />
      <MaturityBadge level="RIPE" score={90} showProgress size="lg" />
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGING BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type AgingLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLINK' | 'ARCHIVE';

interface AgingBadgeProps {
  level: AgingLevel;
  daysOld?: number;
  animate?: boolean;
}

const AGING_CONFIG = {
  GREEN: { icon: '🟢', label: 'Nouveau', color: '#22C55E', bg: '#22C55E20' },
  YELLOW: { icon: '🟡', label: 'Attention', color: '#EAB308', bg: '#EAB30820' },
  RED: { icon: '🔴', label: 'Urgent', color: '#EF4444', bg: '#EF444420' },
  BLINK: { icon: '🔥', label: 'CRITIQUE', color: '#F97316', bg: '#F9731620' },
  ARCHIVE: { icon: '📦', label: 'Archivé', color: '#6B7280', bg: '#6B728020' },
};

const AgingBadge: React.FC<AgingBadgeProps> = ({
  level,
  daysOld,
  animate = true,
}) => {
  const config = AGING_CONFIG[level];
  const shouldBlink = level === 'BLINK' && animate;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: config.bg,
        border: `2px solid ${config.color}`,
        borderRadius: '8px',
        padding: '8px 16px',
        animation: shouldBlink ? 'blink 0.5s infinite' : undefined,
      }}
    >
      <span style={{ fontSize: '20px' }}>{config.icon}</span>
      <div>
        <div style={{ color: config.color, fontWeight: 600, fontSize: '14px' }}>
          {config.label}
        </div>
        {daysOld !== undefined && (
          <div style={{ color: '#9CA3AF', fontSize: '11px' }}>
            {daysOld} jour{daysOld > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export const AgingGreen: StoryObj<typeof AgingBadge> = {
  render: () => <AgingBadge level="GREEN" daysOld={1} />,
};

export const AgingYellow: StoryObj<typeof AgingBadge> = {
  render: () => <AgingBadge level="YELLOW" daysOld={5} />,
};

export const AgingRed: StoryObj<typeof AgingBadge> = {
  render: () => <AgingBadge level="RED" daysOld={10} />,
};

export const AgingBlink: StoryObj<typeof AgingBadge> = {
  render: () => <AgingBadge level="BLINK" daysOld={15} animate />,
};

export const AgingTimeline: StoryObj<typeof AgingBadge> = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '20px', background: '#1E1F22', alignItems: 'center' }}>
      <AgingBadge level="GREEN" daysOld={1} />
      <span style={{ color: '#4B5563' }}>→</span>
      <AgingBadge level="YELLOW" daysOld={5} />
      <span style={{ color: '#4B5563' }}>→</span>
      <AgingBadge level="RED" daysOld={10} />
      <span style={{ color: '#4B5563' }}>→</span>
      <AgingBadge level="BLINK" daysOld={15} animate />
    </div>
  ),
};
