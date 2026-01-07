/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — COMPONENT STORIES                           ║
 * ║                                                                              ║
 * ║  Storybook stories for all V72 design system components                     ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variantStyles = {
    primary: { background: colors.sacredGold, color: '#1E1F22' },
    secondary: { background: '#2A2B30', color: colors.softSand, border: '1px solid #3A3B40' },
    ghost: { background: 'transparent', color: colors.softSand },
    danger: { background: colors.error, color: 'white' },
  };

  return (
    <button
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
};

export const ButtonStory: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Approuver',
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    variant: 'secondary',
    children: 'Annuler',
  },
};

export const Danger: StoryObj<typeof Button> = {
  args: {
    variant: 'danger',
    children: 'Rejeter',
  },
};

export const AllButtons: StoryObj<typeof Button> = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  stats: {
    threads: number;
    decisions: number;
  };
  onClick?: () => void;
}

const SphereCard: React.FC<SphereCardProps> = ({ id, name, icon, color, stats, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#2A2B30' : '#1E1F22',
        borderRadius: '12px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${color}20` : 'none',
        border: `1px solid ${hovered ? color : '#2A2B30'}`,
        width: '200px',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ 
        margin: 0, 
        fontSize: '1.125rem', 
        color: colors.softSand,
        marginBottom: '0.5rem',
      }}>
        {name}
      </h3>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: colors.ancientStone }}>
        <span>{stats.threads} threads</span>
        <span>{stats.decisions} décisions</span>
      </div>
    </div>
  );
};

export const SphereCardStory: Meta<typeof SphereCard> = {
  title: 'Components/SphereCard',
  component: SphereCard,
  tags: ['autodocs'],
};

export const PersonalSphere: StoryObj<typeof SphereCard> = {
  args: {
    id: 'personal',
    name: 'Personnel',
    icon: '🏠',
    color: '#3EB4A2',
    stats: { threads: 5, decisions: 3 },
  },
};

export const BusinessSphere: StoryObj<typeof SphereCard> = {
  args: {
    id: 'business',
    name: 'Affaires',
    icon: '💼',
    color: '#D8B26A',
    stats: { threads: 12, decisions: 8 },
  },
};

export const AllSpheres: StoryObj<typeof SphereCard> = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <SphereCard id="personal" name="Personnel" icon="🏠" color="#3EB4A2" stats={{ threads: 5, decisions: 3 }} />
      <SphereCard id="business" name="Affaires" icon="💼" color="#D8B26A" stats={{ threads: 12, decisions: 8 }} />
      <SphereCard id="government" name="Gouvernement" icon="🏛️" color="#8B5CF6" stats={{ threads: 2, decisions: 1 }} />
      <SphereCard id="studio" name="Studio" icon="🎨" color="#EC4899" stats={{ threads: 4, decisions: 2 }} />
      <SphereCard id="community" name="Communauté" icon="👥" color="#F59E0B" stats={{ threads: 3, decisions: 1 }} />
      <SphereCard id="social" name="Social" icon="📱" color="#3B82F6" stats={{ threads: 6, decisions: 4 }} />
      <SphereCard id="entertainment" name="Divertissement" icon="🎮" color="#EF4444" stats={{ threads: 2, decisions: 0 }} />
      <SphereCard id="team" name="Mon Équipe" icon="👔" color="#10B981" stats={{ threads: 7, decisions: 6 }} />
      <SphereCard id="scholar" name="Scholar" icon="📚" color="#6366F1" stats={{ threads: 3, decisions: 1 }} />
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MATURITY BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MaturityBadgeProps {
  level: 'SEED' | 'SPROUTING' | 'GROWING' | 'MATURE' | 'RIPE';
  score?: number;
  showProgress?: boolean;
}

const maturityConfig = {
  SEED: { icon: '🌱', color: '#10B981', label: 'Graine' },
  SPROUTING: { icon: '🌿', color: '#34D399', label: 'Pousse' },
  GROWING: { icon: '🌳', color: '#F59E0B', label: 'Croissance' },
  MATURE: { icon: '🌾', color: '#D8B26A', label: 'Mature' },
  RIPE: { icon: '🍎', color: '#EF4444', label: 'Mûr' },
};

const MaturityBadge: React.FC<MaturityBadgeProps> = ({ level, score = 0, showProgress = false }) => {
  const config = maturityConfig[level];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: `${config.color}20`,
      borderRadius: '20px',
      border: `1px solid ${config.color}40`,
    }}>
      <span style={{ fontSize: '1.25rem' }}>{config.icon}</span>
      <span style={{ color: config.color, fontWeight: 500 }}>{config.label}</span>
      {showProgress && (
        <div style={{
          width: '60px',
          height: '4px',
          background: '#2A2B30',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${score}%`,
            height: '100%',
            background: config.color,
            borderRadius: '2px',
          }} />
        </div>
      )}
    </div>
  );
};

export const MaturityBadgeStory: Meta<typeof MaturityBadge> = {
  title: 'Components/MaturityBadge',
  component: MaturityBadge,
  tags: ['autodocs'],
};

export const AllMaturityLevels: StoryObj<typeof MaturityBadge> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MaturityBadge level="SEED" score={10} showProgress />
      <MaturityBadge level="SPROUTING" score={30} showProgress />
      <MaturityBadge level="GROWING" score={55} showProgress />
      <MaturityBadge level="MATURE" score={80} showProgress />
      <MaturityBadge level="RIPE" score={100} showProgress />
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGING INDICATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AgingIndicatorProps {
  level: 'GREEN' | 'YELLOW' | 'RED' | 'BLINK' | 'ARCHIVE';
  daysOld?: number;
}

const agingConfig = {
  GREEN: { icon: '🟢', color: '#10B981', label: 'Nouveau', bgColor: '#10B98120' },
  YELLOW: { icon: '🟡', color: '#F59E0B', label: 'Attention', bgColor: '#F59E0B20' },
  RED: { icon: '🔴', color: '#EF4444', label: 'Urgent', bgColor: '#EF444420' },
  BLINK: { icon: '🔥', color: '#F97316', label: 'Critique', bgColor: '#F9731620' },
  ARCHIVE: { icon: '📦', color: '#6B7280', label: 'Archivé', bgColor: '#6B728020' },
};

const AgingIndicator: React.FC<AgingIndicatorProps> = ({ level, daysOld }) => {
  const config = agingConfig[level];
  const isBlink = level === 'BLINK';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: config.bgColor,
      borderRadius: '8px',
      border: `2px solid ${config.color}`,
      animation: isBlink ? 'pulse 1s infinite' : 'none',
    }}>
      <span style={{ fontSize: '1.25rem' }}>{config.icon}</span>
      <span style={{ color: config.color, fontWeight: 600 }}>{config.label}</span>
      {daysOld !== undefined && (
        <span style={{ color: colors.ancientStone, fontSize: '0.75rem' }}>
          {daysOld}j
        </span>
      )}
    </div>
  );
};

export const AgingIndicatorStory: Meta<typeof AgingIndicator> = {
  title: 'Components/AgingIndicator',
  component: AgingIndicator,
  tags: ['autodocs'],
};

export const AllAgingLevels: StoryObj<typeof AgingIndicator> = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <AgingIndicator level="GREEN" daysOld={1} />
      <AgingIndicator level="YELLOW" daysOld={5} />
      <AgingIndicator level="RED" daysOld={10} />
      <AgingIndicator level="BLINK" daysOld={15} />
      <AgingIndicator level="ARCHIVE" daysOld={30} />
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CheckpointCardProps {
  actionType: string;
  description: string;
  requestedBy: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onApprove?: () => void;
  onReject?: () => void;
}

const riskColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

const CheckpointCard: React.FC<CheckpointCardProps> = ({
  actionType,
  description,
  requestedBy,
  riskLevel,
  onApprove,
  onReject,
}) => {
  return (
    <div style={{
      background: '#1E1F22',
      borderRadius: '12px',
      padding: '1.5rem',
      border: `2px solid ${colors.sacredGold}`,
      maxWidth: '400px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
        <h3 style={{ margin: 0, color: colors.sacredGold }}>Point de contrôle</h3>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.25rem' }}>
          Action
        </div>
        <div style={{ color: colors.softSand, fontWeight: 500 }}>{actionType}</div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.25rem' }}>
          Description
        </div>
        <div style={{ color: colors.softSand }}>{description}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone }}>Demandé par</div>
          <div style={{ color: colors.softSand }}>{requestedBy}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone }}>Niveau de risque</div>
          <div style={{ 
            color: riskColors[riskLevel], 
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            {riskLevel}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary" onClick={onApprove}>✓ Approuver</Button>
        <Button variant="danger" onClick={onReject}>✗ Rejeter</Button>
      </div>
    </div>
  );
};

export const CheckpointCardStory: Meta<typeof CheckpointCard> = {
  title: 'Components/CheckpointCard',
  component: CheckpointCard,
  tags: ['autodocs'],
};

export const MediumRisk: StoryObj<typeof CheckpointCard> = {
  args: {
    actionType: 'external_api_call',
    description: 'Envoyer le rapport financier au client externe',
    requestedBy: 'Nova',
    riskLevel: 'medium',
  },
};

export const HighRisk: StoryObj<typeof CheckpointCard> = {
  args: {
    actionType: 'data_export',
    description: 'Exporter toutes les données utilisateur vers le cloud',
    requestedBy: 'Agent-Export-1',
    riskLevel: 'high',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentCardProps {
  name: string;
  level: 0 | 1 | 2 | 3;
  domain: string;
  description: string;
  cost: number;
  isHired?: boolean;
  onHire?: () => void;
}

const levelColors = {
  0: '#6B7280',
  1: '#10B981',
  2: '#3B82F6',
  3: '#D8B26A',
};

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  level,
  domain,
  description,
  cost,
  isHired = false,
  onHire,
}) => {
  return (
    <div style={{
      background: '#1E1F22',
      borderRadius: '12px',
      padding: '1.5rem',
      border: `1px solid ${isHired ? colors.cenoteTurquoise : '#2A2B30'}`,
      width: '280px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.75rem',
          background: `${levelColors[level]}20`,
          color: levelColors[level],
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          L{level}
        </span>
        {isHired && (
          <span style={{ color: colors.cenoteTurquoise }}>✓ Embauché</span>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 0.5rem 0', color: colors.softSand }}>{name}</h3>
      <div style={{ fontSize: '0.875rem', color: colors.ancientStone, marginBottom: '0.75rem' }}>
        {domain}
      </div>
      <p style={{ 
        fontSize: '0.875rem', 
        color: colors.softSand, 
        margin: '0 0 1rem 0',
        lineHeight: 1.5,
      }}>
        {description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: colors.sacredGold, fontWeight: 600 }}>{cost} ⓣ</span>
        {!isHired && (
          <Button variant="primary" size="sm" onClick={onHire}>Embaucher</Button>
        )}
      </div>
    </div>
  );
};

export const AgentCardStory: Meta<typeof AgentCard> = {
  title: 'Components/AgentCard',
  component: AgentCard,
  tags: ['autodocs'],
};

export const AvailableAgent: StoryObj<typeof AgentCard> = {
  args: {
    name: 'Superviseur de Chantier',
    level: 2,
    domain: 'Construction',
    description: 'Expert en supervision de travaux de construction et rénovation',
    cost: 150,
    isHired: false,
  },
};

export const HiredAgent: StoryObj<typeof AgentCard> = {
  args: {
    name: 'Analyste Financier',
    level: 3,
    domain: 'Finance',
    description: 'Spécialiste en analyse financière et reporting',
    cost: 250,
    isHired: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATS WIDGET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface StatWidgetProps {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatWidget: React.FC<StatWidgetProps> = ({
  label,
  value,
  icon,
  color = colors.sacredGold,
  trend,
}) => {
  return (
    <div style={{
      background: '#1E1F22',
      borderRadius: '12px',
      padding: '1.25rem',
      minWidth: '150px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        {trend && (
          <span style={{ 
            color: trend.direction === 'up' ? colors.success : colors.error,
            fontSize: '0.875rem',
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', color: colors.ancientStone }}>{label}</div>
    </div>
  );
};

export const StatWidgetStory: Meta<typeof StatWidget> = {
  title: 'Components/StatWidget',
  component: StatWidget,
  tags: ['autodocs'],
};

export const AllStats: StoryObj<typeof StatWidget> = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <StatWidget 
        label="Décisions en attente" 
        value={15} 
        icon="⚖️" 
        color={colors.warning}
        trend={{ value: 12, direction: 'up' }}
      />
      <StatWidget 
        label="Threads actifs" 
        value={23} 
        icon="🧵" 
        color={colors.cenoteTurquoise}
      />
      <StatWidget 
        label="Agents embauchés" 
        value={8} 
        icon="🤖" 
        color={colors.info}
      />
      <StatWidget 
        label="Score gouvernance" 
        value="95%" 
        icon="🛡️" 
        color={colors.success}
        trend={{ value: 5, direction: 'up' }}
      />
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════════

export const ColorPalette: StoryObj = {
  render: () => (
    <div>
      <h2 style={{ color: colors.softSand, marginBottom: '1.5rem' }}>🎨 CHE·NU Brand Palette</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: value,
              borderRadius: '12px',
              margin: '0 auto 0.5rem',
              boxShadow: `0 4px 12px ${value}40`,
            }} />
            <div style={{ color: colors.softSand, fontSize: '0.875rem', fontWeight: 500 }}>
              {name}
            </div>
            <div style={{ color: colors.ancientStone, fontSize: '0.75rem' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

ColorPalette.storyName = 'Color Palette';
ColorPalette.parameters = {
  docs: {
    description: {
      story: 'The complete CHE·NU brand color palette used throughout the application.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const Typography: StoryObj = {
  render: () => (
    <div style={{ color: colors.softSand }}>
      <h2 style={{ marginBottom: '2rem' }}>📝 Typography</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.5rem' }}>
            Page Title (28px / Bold)
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
            Tableau de bord CHE·NU
          </h1>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.5rem' }}>
            Section Title (20px / Semibold)
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Mes Sphères
          </h2>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.5rem' }}>
            Card Title (16px / Medium)
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>
            Rénovation cuisine
          </h3>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.5rem' }}>
            Body (14px / Regular)
          </div>
          <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
            GOUVERNANCE {'>'} EXÉCUTION — La technologie ne remplace jamais l'humain,
            mais lui donne une vision claire, vérifiable et gouvernée.
          </p>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: colors.ancientStone, marginBottom: '0.5rem' }}>
            Caption (12px / Regular)
          </div>
          <span style={{ fontSize: '12px', color: colors.ancientStone }}>
            Dernière mise à jour: il y a 2 heures
          </span>
        </div>
      </div>
    </div>
  ),
};

Typography.storyName = 'Typography';
