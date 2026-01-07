// CHE·NU™ Storybook Stories
// Complete visual documentation for all components

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// MOCK COMPONENTS
// ============================================================

// Button Component
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
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';
  
  const variantStyles = {
    primary: `bg-[${BRAND_COLORS.sacredGold}] text-white hover:opacity-90`,
    secondary: `bg-[${BRAND_COLORS.ancientStone}] text-white hover:opacity-90`,
    ghost: 'bg-transparent border border-gray-300 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="animate-spin mr-2">⟳</span>
      ) : null}
      {children}
    </button>
  );
};

// SphereCard Component
interface SphereCardProps {
  code: string;
  name: string;
  icon: string;
  tokenBudget: number;
  tokensUsed: number;
  isActive?: boolean;
  onClick?: () => void;
}

const SphereCard: React.FC<SphereCardProps> = ({
  code,
  name,
  icon,
  tokenBudget,
  tokensUsed,
  isActive = false,
  onClick,
}) => {
  const usagePercent = tokenBudget > 0 ? Math.round((tokensUsed / tokenBudget) * 100) : 0;

  return (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-amber-100 border-2 border-amber-500' : 'bg-white border border-gray-200 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <span className="text-xs text-gray-500">{code}</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Tokens</span>
          <span>{tokensUsed.toLocaleString()} / {tokenBudget.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// BureauSection Component
interface BureauSectionProps {
  name: string;
  icon: string;
  isActive?: boolean;
  count?: number;
  onClick?: () => void;
}

const BureauSection: React.FC<BureauSectionProps> = ({
  name,
  icon,
  isActive = false,
  count,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
        isActive ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 font-medium">{name}</span>
      {count !== undefined && (
        <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">{count}</span>
      )}
    </div>
  );
};

// ThreadCard Component
interface ThreadCardProps {
  title: string;
  lastMessage?: string;
  tokenBudget: number;
  tokensUsed: number;
  encodingEnabled: boolean;
  messageCount: number;
  updatedAt: string;
  onClick?: () => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  title,
  lastMessage,
  tokenBudget,
  tokensUsed,
  encodingEnabled,
  messageCount,
  updatedAt,
  onClick,
}) => {
  return (
    <div
      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
        {encodingEnabled && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
            Encoded
          </span>
        )}
      </div>
      {lastMessage && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{lastMessage}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{messageCount} messages</span>
        <span>{tokensUsed.toLocaleString()} / {tokenBudget.toLocaleString()} tokens</span>
      </div>
      <div className="mt-2 text-xs text-gray-400">{updatedAt}</div>
    </div>
  );
};

// TaskCard Component
interface TaskCardProps {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  assignee?: string;
  onStatusChange?: (status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  onStatusChange,
}) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const statusIcons = {
    todo: '○',
    in_progress: '◐',
    done: '●',
    archived: '◉',
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <button
          className="mt-1 text-lg"
          onClick={() => onStatusChange?.(status === 'done' ? 'todo' : 'done')}
        >
          {statusIcons[status]}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium ${status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {title}
            </h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[priority]}`}>
              {priority}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {dueDate && <span>📅 {dueDate}</span>}
            {assignee && <span>👤 {assignee}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// NoteCard Component
interface NoteCardProps {
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  tags,
  updatedAt,
  onClick,
}) => {
  return (
    <div
      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all"
      onClick={onClick}
    >
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{content}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-400">{updatedAt}</div>
    </div>
  );
};

// TokenBudgetWidget Component
interface TokenBudgetWidgetProps {
  sphereCode: string;
  allocated: number;
  used: number;
  showBreakdown?: boolean;
}

const TokenBudgetWidget: React.FC<TokenBudgetWidgetProps> = ({
  sphereCode,
  allocated,
  used,
  showBreakdown = false,
}) => {
  const remaining = allocated - used;
  const usagePercent = allocated > 0 ? Math.round((used / allocated) * 100) : 0;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Token Budget</h4>
        <span className="text-sm text-gray-500">{sphereCode}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{allocated.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Allocated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{used.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{remaining.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Usage</span>
          <span>{usagePercent}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Memory Prompt: Tokens are NOT cryptocurrency */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
        ℹ️ Tokens are internal utility credits, NOT cryptocurrency.
      </div>

      {showBreakdown && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">Breakdown by Category</div>
          <div className="flex items-center justify-between text-sm">
            <span>Threads</span>
            <span>45%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Agents</span>
            <span>35%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Meetings</span>
            <span>20%</span>
          </div>
        </div>
      )}
    </div>
  );
};

// NovaPanel Component
interface NovaPanelProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const NovaPanel: React.FC<NovaPanelProps> = ({
  isExpanded = false,
  onToggle,
}) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
            N
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">Nova</h4>
            <span className="text-xs text-amber-600">System Intelligence</span>
          </div>
        </div>
        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full">
          Always Active
        </span>
      </div>
      
      {/* Memory Prompt: Nova is NEVER a hired agent */}
      {isExpanded && (
        <div className="p-4 border-t border-amber-200">
          <p className="text-sm text-amber-800 mb-3">
            Nova handles guidance, memory, and governance. Nova is always present and cannot be hired or dismissed.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span>✓</span>
              <span>Guidance & Navigation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>✓</span>
              <span>Memory Management</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>✓</span>
              <span>Governance Enforcement</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>✓</span>
              <span>Database Supervision</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// GovernanceLawCard Component
interface GovernanceLawCardProps {
  number: number;
  name: string;
  description: string;
  status: 'enforced' | 'pending' | 'warning';
}

const GovernanceLawCard: React.FC<GovernanceLawCardProps> = ({
  number,
  name,
  description,
  status,
}) => {
  const statusStyles = {
    enforced: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    warning: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons = {
    enforced: '✓',
    pending: '○',
    warning: '!',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusStyles[status]}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{name}</h4>
            <span className="text-lg">{statusIcons[status]}</span>
          </div>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </div>
  );
};

// AgentCard Component
interface AgentCardProps {
  name: string;
  type: 'orchestrator' | 'specialist' | 'assistant';
  status: 'available' | 'busy' | 'disabled';
  capabilities: string[];
  tokenCost: number;
  onHire?: () => void;
  onDismiss?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  type,
  status,
  capabilities,
  tokenCost,
  onHire,
  onDismiss,
}) => {
  const typeIcons = {
    orchestrator: '🎯',
    specialist: '🔬',
    assistant: '🤝',
  };

  const statusColors = {
    available: 'bg-green-100 text-green-700',
    busy: 'bg-yellow-100 text-yellow-700',
    disabled: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
          {typeIcons[type]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 capitalize">{type}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {capabilities.map((cap) => (
          <span
            key={cap}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Cost: <span className="font-medium">{tokenCost}</span> tokens/msg
        </span>
        {status === 'available' ? (
          <Button variant="primary" size="sm" onClick={onHire}>
            Hire
          </Button>
        ) : status === 'busy' ? (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        ) : null}
      </div>
    </div>
  );
};

// MeetingCard Component
interface MeetingCardProps {
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  tokenBudget: number;
  onJoin?: () => void;
  onCancel?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  title,
  startTime,
  endTime,
  participants,
  status,
  tokenBudget,
  onJoin,
  onCancel,
}) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>🕐</span>
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>{participants.length} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🪙</span>
          <span>{tokenBudget.toLocaleString()} tokens allocated</span>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="flex -space-x-2 mb-3">
          {participants.slice(0, 3).map((p, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
            >
              {p.charAt(0).toUpperCase()}
            </div>
          ))}
          {participants.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
              +{participants.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {status === 'scheduled' && (
          <>
            <Button variant="primary" size="sm" onClick={onJoin}>
              Join
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}
        {status === 'in_progress' && (
          <Button variant="primary" size="sm" onClick={onJoin}>
            Rejoin
          </Button>
        )}
      </div>
    </div>
  );
};

// EncodingPreview Component
interface EncodingPreviewProps {
  originalText: string;
  encodedText: string;
  savings: number;
  quality: number;
}

const EncodingPreview: React.FC<EncodingPreviewProps> = ({
  originalText,
  encodedText,
  savings,
  quality,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Original
          </label>
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            {originalText}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {originalText.length} characters
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Encoded
          </label>
          <div className="p-3 bg-green-50 rounded-lg text-sm font-mono">
            {encodedText}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {encodedText.length} characters
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-600">{savings}%</div>
          <div className="text-sm text-amber-700">Token Savings</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{quality}%</div>
          <div className="text-sm text-green-700">Quality Score</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STORYBOOK STORIES
// ============================================================

// Button Stories
const ButtonMeta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default ButtonMeta;

type ButtonStory = StoryObj<typeof Button>;

export const Primary: ButtonStory = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: ButtonStory = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost: ButtonStory = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Danger: ButtonStory = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const Loading: ButtonStory = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: ButtonStory = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

export const AllSizes: ButtonStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// SphereCard Stories
export const SphereCardStory: StoryObj<typeof SphereCard> = {
  name: 'SphereCard',
  render: () => (
    <div className="grid grid-cols-4 gap-4 max-w-4xl">
      <SphereCard
        code="PERSONAL"
        name="Personal"
        icon="🏠"
        tokenBudget={100000}
        tokensUsed={25000}
        isActive
      />
      <SphereCard
        code="BUSINESS"
        name="Business"
        icon="💼"
        tokenBudget={100000}
        tokensUsed={75000}
      />
      <SphereCard
        code="STUDIO"
        name="Studio"
        icon="🎨"
        tokenBudget={50000}
        tokensUsed={10000}
      />
      <SphereCard
        code="TEAM"
        name="My Team"
        icon="🤝"
        tokenBudget={150000}
        tokensUsed={120000}
      />
    </div>
  ),
};

// All 8 Spheres
export const AllSpheresStory: StoryObj = {
  name: 'All 8 Spheres (FROZEN)',
  render: () => {
    const spheres = [
      { code: 'PERSONAL', name: 'Personal', icon: '🏠' },
      { code: 'BUSINESS', name: 'Business', icon: '💼' },
      { code: 'GOVERNMENT', name: 'Government & Institutions', icon: '🏛️' },
      { code: 'STUDIO', name: 'Studio de création', icon: '🎨' },
      { code: 'COMMUNITY', name: 'Community', icon: '👥' },
      { code: 'SOCIAL', name: 'Social & Media', icon: '📱' },
      { code: 'ENTERTAINMENT', name: 'Entertainment', icon: '🎬' },
      { code: 'TEAM', name: 'My Team', icon: '🤝' },
    ];

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">8 FROZEN Spheres (Memory Prompt)</h2>
        <div className="grid grid-cols-4 gap-4">
          {spheres.map((sphere) => (
            <SphereCard
              key={sphere.code}
              code={sphere.code}
              name={sphere.name}
              icon={sphere.icon}
              tokenBudget={100000}
              tokensUsed={Math.floor(Math.random() * 80000)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// Bureau Sections
export const BureauSectionsStory: StoryObj = {
  name: 'Bureau Sections (10 NON-NEGOTIABLE)',
  render: () => {
    const sections = [
      { name: 'Dashboard', icon: '📊', count: undefined },
      { name: 'Notes', icon: '📝', count: 12 },
      { name: 'Tasks', icon: '✅', count: 5 },
      { name: 'Projects', icon: '📁', count: 3 },
      { name: 'Threads', icon: '💬', count: 8 },
      { name: 'Meetings', icon: '📅', count: 2 },
      { name: 'Data', icon: '🗄️', count: undefined },
      { name: 'Agents', icon: '🤖', count: 4 },
      { name: 'Reports', icon: '📈', count: 6 },
      { name: 'Budget', icon: '💰', count: undefined },
    ];

    return (
      <div className="max-w-xs space-y-1 bg-white p-4 rounded-lg">
        <h3 className="text-sm font-bold text-gray-500 mb-3">
          10 NON-NEGOTIABLE Sections
        </h3>
        {sections.map((section, i) => (
          <BureauSection
            key={section.name}
            name={section.name}
            icon={section.icon}
            isActive={i === 0}
            count={section.count}
          />
        ))}
      </div>
    );
  },
};

// Thread Cards
export const ThreadCardsStory: StoryObj = {
  name: 'Thread Cards',
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <ThreadCard
        title="Q1 Planning Discussion"
        lastMessage="Let's review the roadmap for Q1..."
        tokenBudget={5000}
        tokensUsed={2500}
        encodingEnabled={true}
        messageCount={15}
        updatedAt="2 hours ago"
      />
      <ThreadCard
        title="Project Ideas"
        lastMessage="What if we built a new feature for..."
        tokenBudget={10000}
        tokensUsed={8000}
        encodingEnabled={false}
        messageCount={42}
        updatedAt="Yesterday"
      />
      <ThreadCard
        title="Weekly Sync Notes"
        lastMessage="Action items from today's meeting..."
        tokenBudget={3000}
        tokensUsed={500}
        encodingEnabled={true}
        messageCount={5}
        updatedAt="Just now"
      />
    </div>
  ),
};

// Task Cards
export const TaskCardsStory: StoryObj = {
  name: 'Task Cards',
  render: () => (
    <div className="space-y-3 max-w-md">
      <TaskCard
        title="Review Q1 budget"
        description="Analyze and approve the budget allocation for Q1"
        status="todo"
        priority="critical"
        dueDate="Dec 20, 2024"
        assignee="John Doe"
      />
      <TaskCard
        title="Update documentation"
        status="in_progress"
        priority="high"
        dueDate="Dec 25, 2024"
      />
      <TaskCard
        title="Send weekly report"
        description="Compile and send the weekly status report"
        status="done"
        priority="medium"
      />
      <TaskCard
        title="Archive old files"
        status="todo"
        priority="low"
      />
    </div>
  ),
};

// Token Budget Widget
export const TokenBudgetWidgetStory: StoryObj = {
  name: 'Token Budget Widget',
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <TokenBudgetWidget
        sphereCode="PERSONAL"
        allocated={100000}
        used={25000}
      />
      <TokenBudgetWidget
        sphereCode="BUSINESS"
        allocated={100000}
        used={75000}
        showBreakdown
      />
    </div>
  ),
};

// Nova Panel
export const NovaPanelStory: StoryObj = {
  name: 'Nova Panel (System Intelligence)',
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="max-w-sm space-y-4">
        <NovaPanel isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
        <div className="text-sm text-gray-500">
          ⚠️ Memory Prompt: Nova is NEVER a hired agent
        </div>
      </div>
    );
  },
};

// Governance Laws
export const GovernanceLawsStory: StoryObj = {
  name: 'Governance Laws (10 Laws)',
  render: () => {
    const laws = [
      { number: 1, name: 'Consent Primacy', description: 'User consent before any action' },
      { number: 2, name: 'Temporal Sovereignty', description: 'User controls their time' },
      { number: 3, name: 'Contextual Fidelity', description: 'Respect sphere boundaries' },
      { number: 4, name: 'Hierarchical Respect', description: 'Honor permission levels' },
      { number: 5, name: 'Audit Completeness', description: 'Log all actions' },
      { number: 6, name: 'Encoding Transparency', description: 'Clear token optimization' },
      { number: 7, name: 'Agent Non-Autonomy', description: 'Agents never act alone' },
      { number: 8, name: 'Budget Accountability', description: 'Respect token budgets' },
      { number: 9, name: 'Cross-Sphere Isolation', description: 'Data stays in context' },
      { number: 10, name: 'Deletion Completeness', description: 'Full data removal on request' },
    ];

    return (
      <div className="space-y-3 max-w-lg">
        <h2 className="text-lg font-bold">10 Laws of Governance</h2>
        {laws.map((law) => (
          <GovernanceLawCard
            key={law.number}
            number={law.number}
            name={law.name}
            description={law.description}
            status="enforced"
          />
        ))}
      </div>
    );
  },
};

// Agent Cards
export const AgentCardsStory: StoryObj = {
  name: 'Agent Cards',
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <AgentCard
        name="Research Agent"
        type="specialist"
        status="available"
        capabilities={['research', 'summarize', 'analyze']}
        tokenCost={100}
      />
      <AgentCard
        name="Task Orchestrator"
        type="orchestrator"
        status="busy"
        capabilities={['task', 'schedule', 'delegate']}
        tokenCost={150}
      />
      <AgentCard
        name="Writing Assistant"
        type="assistant"
        status="available"
        capabilities={['write', 'edit', 'proofread']}
        tokenCost={80}
      />
    </div>
  ),
};

// Meeting Cards
export const MeetingCardsStory: StoryObj = {
  name: 'Meeting Cards',
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <MeetingCard
        title="Team Standup"
        startTime="9:00 AM"
        endTime="9:30 AM"
        participants={['Alice', 'Bob', 'Carol', 'Dave', 'Eve']}
        status="scheduled"
        tokenBudget={500}
      />
      <MeetingCard
        title="Project Review"
        startTime="2:00 PM"
        endTime="3:00 PM"
        participants={['Alice', 'Bob']}
        status="in_progress"
        tokenBudget={2000}
      />
    </div>
  ),
};

// Encoding Preview
export const EncodingPreviewStory: StoryObj = {
  name: 'Encoding Preview',
  render: () => (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mb-4">Encoding System (Core IP)</h2>
      <EncodingPreview
        originalText="The quick brown fox and the lazy dog have found the way to the forest."
        encodedText="T quick brown fox & T lazy dog h found T way to T forest."
        savings={18}
        quality={92}
      />
    </div>
  ),
};

// Brand Colors
export const BrandColorsStory: StoryObj = {
  name: 'Brand Colors',
  render: () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">CHE·NU Brand Colors (Memory Prompt)</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(BRAND_COLORS).map(([name, color]) => (
          <div key={name} className="text-center">
            <div
              className="w-16 h-16 rounded-lg mx-auto mb-2"
              style={{ backgroundColor: color }}
            />
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-gray-500">{color}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
