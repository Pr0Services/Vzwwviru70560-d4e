// CHE·NU™ Component Stories
// Visual documentation for all UI components

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// ============================================================
// SPHERE SELECTOR STORIES
// ============================================================

// 8 Spheres (FROZEN - Memory Prompt)
const SPHERES = [
  { code: 'personal', name: 'Personal', icon: '🏠', color: '#4CAF50' },
  { code: 'business', name: 'Business', icon: '💼', color: '#2196F3' },
  { code: 'government', name: 'Government & Institutions', icon: '🏛️', color: '#9C27B0' },
  { code: 'design_studio', name: 'Creative Studio', icon: '🎨', color: '#FF5722' },
  { code: 'community', name: 'Community', icon: '👥', color: '#00BCD4' },
  { code: 'social', name: 'Social & Media', icon: '📱', color: '#E91E63' },
  { code: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF9800' },
  { code: 'my_team', name: 'My Team', icon: '🤝', color: '#795548' },
];

// SphereSelector Component
interface SphereSelectorProps {
  activeCode: string;
  onSelect: (code: string) => void;
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
}

function SphereSelector({ activeCode, onSelect, variant = 'horizontal', size = 'md' }: SphereSelectorProps) {
  const sizeClasses = {
    sm: 'text-sm p-2',
    md: 'text-base p-3',
    lg: 'text-lg p-4',
  };

  const variantClasses = {
    horizontal: 'flex gap-2 overflow-x-auto',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-4 gap-2',
  };

  return (
    <div className={variantClasses[variant]}>
      {SPHERES.map((sphere) => (
        <button
          key={sphere.code}
          onClick={() => onSelect(sphere.code)}
          className={`
            ${sizeClasses[size]}
            rounded-lg flex items-center gap-2 transition-all
            ${activeCode === sphere.code
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <span className="text-xl">{sphere.icon}</span>
          {variant !== 'grid' && <span>{sphere.name}</span>}
        </button>
      ))}
    </div>
  );
}

const sphereMeta: Meta<typeof SphereSelector> = {
  title: 'CHE·NU/Navigation/SphereSelector',
  component: SphereSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Selector for the 8 CHE·NU spheres. Structure is FROZEN per Memory Prompt.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical', 'grid'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default sphereMeta;

type SphereStory = StoryObj<typeof SphereSelector>;

export const Horizontal: SphereStory = {
  args: {
    activeCode: 'personal',
    variant: 'horizontal',
    size: 'md',
    onSelect: (code) => logger.debug('Selected:', code),
  },
};

export const Vertical: SphereStory = {
  args: {
    activeCode: 'business',
    variant: 'vertical',
    size: 'md',
    onSelect: (code) => logger.debug('Selected:', code),
  },
};

export const Grid: SphereStory = {
  args: {
    activeCode: 'design_studio',
    variant: 'grid',
    size: 'lg',
    onSelect: (code) => logger.debug('Selected:', code),
  },
};

export const Interactive: SphereStory = {
  render: () => {
    const [active, setActive] = useState('personal');
    return (
      <div className="space-y-4">
        <SphereSelector activeCode={active} onSelect={setActive} variant="horizontal" />
        <p className="text-center text-gray-600">Selected: {active}</p>
      </div>
    );
  },
};

// ============================================================
// BUREAU TABS STORIES (Separate file in production)
// ============================================================

// 10 Bureau Sections (NON-NEGOTIABLE - Memory Prompt)
const BUREAU_SECTIONS = [
  { id: 1, name: 'Dashboard', icon: '📊' },
  { id: 2, name: 'Notes', icon: '📝' },
  { id: 3, name: 'Tasks', icon: '✅' },
  { id: 4, name: 'Projects', icon: '📁' },
  { id: 5, name: 'Threads', icon: '💬' },
  { id: 6, name: 'Meetings', icon: '📅' },
  { id: 7, name: 'Data', icon: '🗄️' },
  { id: 8, name: 'Agents', icon: '🤖' },
  { id: 9, name: 'Reports', icon: '📈' },
  { id: 10, name: 'Budget', icon: '💰' },
];

interface BureauTabsProps {
  activeSection: number;
  onSectionChange: (id: number) => void;
  variant?: 'pills' | 'underline' | 'cards';
}

function BureauTabs({ activeSection, onSectionChange, variant = 'pills' }: BureauTabsProps) {
  const renderPills = () => (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {BUREAU_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors
            ${activeSection === section.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }
          `}
        >
          <span>{section.icon}</span>
          <span>{section.name}</span>
        </button>
      ))}
    </div>
  );

  const renderUnderline = () => (
    <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {BUREAU_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 transition-colors
            ${activeSection === section.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }
          `}
        >
          <span>{section.icon}</span>
          <span>{section.name}</span>
        </button>
      ))}
    </div>
  );

  const renderCards = () => (
    <div className="grid grid-cols-5 gap-2">
      {BUREAU_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-xl transition-all
            ${activeSection === section.id
              ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100'
            }
          `}
        >
          <span className="text-2xl">{section.icon}</span>
          <span className="text-sm font-medium">{section.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {variant === 'pills' && renderPills()}
      {variant === 'underline' && renderUnderline()}
      {variant === 'cards' && renderCards()}
    </div>
  );
}

// ============================================================
// TOKEN BUDGET DISPLAY
// ============================================================

interface TokenBudgetProps {
  allocated: number;
  used: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function TokenBudget({ allocated, used, showDetails = false, size = 'md' }: TokenBudgetProps) {
  const remaining = allocated - used;
  const usagePercent = (used / allocated) * 100;
  
  const getStatusColor = () => {
    if (usagePercent > 90) return 'bg-red-500';
    if (usagePercent > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`${sizeClasses[size]}`}>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStatusColor()} transition-all`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-1 text-gray-500 dark:text-gray-400">
        <span>{used.toLocaleString()} / {allocated.toLocaleString()}</span>
        <span>{remaining.toLocaleString()} remaining</span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">
            ⚠️ Tokens are internal utility credits, not cryptocurrency.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-semibold">{allocated.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Allocated</div>
            </div>
            <div>
              <div className="font-semibold">{used.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Used</div>
            </div>
            <div>
              <div className="font-semibold">{remaining.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// THREAD CARD
// ============================================================

interface ThreadCardProps {
  id: string;
  title: string;
  description?: string;
  sphereIcon: string;
  status: 'active' | 'paused' | 'archived';
  tokenBudget: number;
  tokensUsed: number;
  lastActivity: string;
  onClick?: () => void;
}

function ThreadCard({
  id,
  title,
  description,
  sphereIcon,
  status,
  tokenBudget,
  tokensUsed,
  lastActivity,
  onClick,
}: ThreadCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    archived: 'bg-gray-400',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Sphere Icon */}
        <div className="text-2xl">{sphereIcon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600">
              .chenu
            </span>
          </div>

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {description}
            </p>
          )}

          {/* Token Usage */}
          <div className="mt-3">
            <TokenBudget allocated={tokenBudget} used={tokensUsed} size="sm" />
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>ID: {id}</span>
            <span>{lastActivity}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
      </div>
    </div>
  );
}

// ============================================================
// NOVA ASSISTANT BUBBLE
// ============================================================

interface NovaBubbleProps {
  message: string;
  type: 'insight' | 'suggestion' | 'alert' | 'guidance';
  timestamp?: string;
}

function NovaBubble({ message, type, timestamp }: NovaBubbleProps) {
  const typeConfig = {
    insight: { icon: '💡', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200' },
    suggestion: { icon: '✨', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200' },
    alert: { icon: '⚠️', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200' },
    guidance: { icon: '🧭', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200' },
  };

  const config = typeConfig[type];

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        {/* Nova Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
          🌟
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-white">Nova</span>
            <span className="text-xs text-gray-500">System Intelligence</span>
            <span>{config.icon}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
          {timestamp && (
            <p className="text-xs text-gray-400 mt-2">{timestamp}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GOVERNANCE BADGE
// ============================================================

interface GovernanceBadgeProps {
  lawNumber: number;
  lawName: string;
  status: 'compliant' | 'warning' | 'violation';
}

function GovernanceBadge({ lawNumber, lawName, status }: GovernanceBadgeProps) {
  const statusConfig = {
    compliant: { icon: '✅', bg: 'bg-green-100', text: 'text-green-700' },
    warning: { icon: '⚠️', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    violation: { icon: '❌', bg: 'bg-red-100', text: 'text-red-700' },
  };

  const config = statusConfig[status];

  return (
    <div className={`${config.bg} ${config.text} rounded-lg px-3 py-2 flex items-center gap-2`}>
      <span>{config.icon}</span>
      <span className="font-medium">Law {lawNumber}:</span>
      <span>{lawName}</span>
    </div>
  );
}

// ============================================================
// EXPORT ALL STORIES
// ============================================================

export const BureauTabsPills: StoryObj<typeof BureauTabs> = {
  render: () => {
    const [active, setActive] = useState(1);
    return <BureauTabs activeSection={active} onSectionChange={setActive} variant="pills" />;
  },
  name: 'Bureau Tabs - Pills',
};

export const BureauTabsUnderline: StoryObj<typeof BureauTabs> = {
  render: () => {
    const [active, setActive] = useState(5);
    return <BureauTabs activeSection={active} onSectionChange={setActive} variant="underline" />;
  },
  name: 'Bureau Tabs - Underline',
};

export const BureauTabsCards: StoryObj<typeof BureauTabs> = {
  render: () => {
    const [active, setActive] = useState(8);
    return <BureauTabs activeSection={active} onSectionChange={setActive} variant="cards" />;
  },
  name: 'Bureau Tabs - Cards',
};

export const TokenBudgetBasic: StoryObj<typeof TokenBudget> = {
  render: () => <TokenBudget allocated={10000} used={3500} />,
  name: 'Token Budget - Basic',
};

export const TokenBudgetWithDetails: StoryObj<typeof TokenBudget> = {
  render: () => <TokenBudget allocated={50000} used={42000} showDetails size="lg" />,
  name: 'Token Budget - With Details (Warning)',
};

export const ThreadCardActive: StoryObj<typeof ThreadCard> = {
  render: () => (
    <div className="w-96">
      <ThreadCard
        id="thread_abc123"
        title="Q4 Marketing Strategy"
        description="Planning the marketing campaigns for Q4 2024"
        sphereIcon="💼"
        status="active"
        tokenBudget={25000}
        tokensUsed={8500}
        lastActivity="2 hours ago"
        onClick={() => logger.debug('Thread clicked')}
      />
    </div>
  ),
  name: 'Thread Card - Active',
};

export const ThreadCardPaused: StoryObj<typeof ThreadCard> = {
  render: () => (
    <div className="w-96">
      <ThreadCard
        id="thread_xyz789"
        title="Home Renovation Plans"
        description="Kitchen and bathroom updates"
        sphereIcon="🏠"
        status="paused"
        tokenBudget={15000}
        tokensUsed={12000}
        lastActivity="3 days ago"
      />
    </div>
  ),
  name: 'Thread Card - Paused',
};

export const NovaInsight: StoryObj<typeof NovaBubble> = {
  render: () => (
    <div className="max-w-md">
      <NovaBubble
        message="Based on your thread activity, you've been highly productive in the Business sphere this week. Consider allocating more tokens to maintain momentum."
        type="insight"
        timestamp="Just now"
      />
    </div>
  ),
  name: 'Nova - Insight',
};

export const NovaSuggestion: StoryObj<typeof NovaBubble> = {
  render: () => (
    <div className="max-w-md">
      <NovaBubble
        message="Your marketing thread could benefit from enabling encoding. This could save up to 30% of your token budget."
        type="suggestion"
        timestamp="5 minutes ago"
      />
    </div>
  ),
  name: 'Nova - Suggestion',
};

export const NovaAlert: StoryObj<typeof NovaBubble> = {
  render: () => (
    <div className="max-w-md">
      <NovaBubble
        message="Token budget for 'Q4 Strategy' thread is at 85%. Consider allocating additional tokens or archiving completed sub-threads."
        type="alert"
        timestamp="10 minutes ago"
      />
    </div>
  ),
  name: 'Nova - Alert',
};

export const GovernanceLaws: StoryObj<typeof GovernanceBadge> = {
  render: () => (
    <div className="space-y-2">
      <GovernanceBadge lawNumber={1} lawName="Consent Primacy" status="compliant" />
      <GovernanceBadge lawNumber={7} lawName="Agent Non-Autonomy" status="compliant" />
      <GovernanceBadge lawNumber={8} lawName="Budget Accountability" status="warning" />
      <GovernanceBadge lawNumber={9} lawName="Cross-Sphere Isolation" status="violation" />
    </div>
  ),
  name: 'Governance Badges',
};
