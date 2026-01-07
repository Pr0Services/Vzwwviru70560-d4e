/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — COMPONENT STORIES                           ║
 * ║                                                                              ║
 * ║  Storybook stories for V72 design system                                    ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THEME COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  gold: '#D8B26A',
  stone: '#8D8371',
  emerald: '#3F7249',
  turquoise: '#3EB4A2',
  moss: '#2F4C39',
  ember: '#7A593A',
  slate: '#1E1F22',
  sand: '#E9E4D6',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  threadsCount: number;
  decisionsCount: number;
  onClick?: () => void;
}

const SphereCard: React.FC<SphereCardProps> = ({
  id,
  name,
  icon,
  color,
  threadsCount,
  decisionsCount,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: '#2A2B2F',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: `2px solid transparent`,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '16px' }}>{name}</h3>
    <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
      {threadsCount} threads • {decisionsCount} décisions
    </div>
    <div
      style={{
        width: '100%',
        height: '4px',
        background: color,
        borderRadius: '2px',
        marginTop: '12px',
        opacity: 0.6,
      }}
    />
  </div>
);

const sphereCardMeta: Meta<typeof SphereCard> = {
  title: 'V72/SphereCard',
  component: SphereCard,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    onClick: { action: 'clicked' },
  },
};

export default sphereCardMeta;
type SphereStory = StoryObj<typeof SphereCard>;

export const Personnel: SphereStory = {
  args: {
    id: 'personal',
    name: 'Personnel',
    icon: '🏠',
    color: '#3EB4A2',
    threadsCount: 5,
    decisionsCount: 3,
  },
};

export const Affaires: SphereStory = {
  args: {
    id: 'business',
    name: 'Affaires',
    icon: '💼',
    color: '#D8B26A',
    threadsCount: 8,
    decisionsCount: 5,
  },
};

export const AllSpheres: SphereStory = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px', background: '#1E1F22' }}>
      {[
        { id: 'personal', name: 'Personnel', icon: '🏠', color: '#3EB4A2' },
        { id: 'business', name: 'Affaires', icon: '💼', color: '#D8B26A' },
        { id: 'government', name: 'Gouvernement', icon: '🏛️', color: '#8B5CF6' },
        { id: 'studio', name: 'Studio', icon: '🎨', color: '#EC4899' },
        { id: 'community', name: 'Communauté', icon: '👥', color: '#F59E0B' },
        { id: 'social', name: 'Social', icon: '📱', color: '#3B82F6' },
        { id: 'entertainment', name: 'Divertissement', icon: '🎮', color: '#EF4444' },
        { id: 'team', name: 'Mon Équipe', icon: '👔', color: '#10B981' },
        { id: 'scholar', name: 'Scholar', icon: '📚', color: '#6366F1' },
      ].map((sphere) => (
        <SphereCard
          key={sphere.id}
          {...sphere}
          threadsCount={Math.floor(Math.random() * 10)}
          decisionsCount={Math.floor(Math.random() * 5)}
        />
      ))}
    </div>
  ),
};
