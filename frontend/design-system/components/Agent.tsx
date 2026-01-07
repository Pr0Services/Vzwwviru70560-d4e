// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — AGENT COMPONENTS
// Specialized components for AI agent interactions
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
  type FormEvent,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type AgentStatus = 'idle' | 'thinking' | 'active' | 'error' | 'offline';

export interface Agent {
  id: string;
  name: string;
  level: AgentLevel;
  status: AgentStatus;
  description?: string;
  department?: string;
  sphereColor?: string;
  avatarUrl?: string;
  capabilities?: string[];
  lastActive?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  isStreaming?: boolean;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// AGENT CARD COMPONENT
// =============================================================================

export interface AgentCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Agent data */
  agent: Agent;
  
  /** Compact mode */
  compact?: boolean;
  
  /** Show status indicator */
  showStatus?: boolean;
  
  /** On click handler */
  onSelect?: (agent: Agent) => void;
  
  /** Selected state */
  selected?: boolean;
  
  /** Show capabilities */
  showCapabilities?: boolean;
}

const levelColors: Record<AgentLevel, { bg: string; text: string; glow: string }> = {
  L0: { bg: 'from-amber-400 to-orange-500', text: 'text-amber-500', glow: 'shadow-amber-500/30' },
  L1: { bg: 'from-sky-400 to-blue-500', text: 'text-sky-500', glow: 'shadow-sky-500/30' },
  L2: { bg: 'from-emerald-400 to-green-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/30' },
  L3: { bg: 'from-violet-400 to-purple-500', text: 'text-violet-500', glow: 'shadow-violet-500/30' },
};

const statusIndicators: Record<AgentStatus, { color: string; label: string; animate?: boolean }> = {
  idle: { color: 'bg-gray-400', label: 'En veille' },
  thinking: { color: 'bg-blue-500', label: 'Réflexion...', animate: true },
  active: { color: 'bg-green-500', label: 'Actif' },
  error: { color: 'bg-red-500', label: 'Erreur' },
  offline: { color: 'bg-gray-300', label: 'Hors ligne' },
};

/**
 * Agent Card Component
 * 
 * Displays an AI agent with its status, level, and capabilities.
 * 
 * @example
 * ```tsx
 * <AgentCard
 *   agent={{
 *     id: 'nova',
 *     name: 'Nova',
 *     level: 'L0',
 *     status: 'active',
 *     description: 'Agent central orchestrateur'
 *   }}
 *   onSelect={(agent) => console.log('Selected:', agent)}
 * />
 * ```
 */
export function AgentCard({
  agent,
  compact = false,
  showStatus = true,
  onSelect,
  selected = false,
  showCapabilities = false,
  className = '',
  ...props
}: AgentCardProps): JSX.Element {
  const levelStyle = levelColors[agent.level];
  const statusStyle = statusIndicators[agent.status];
  const initials = agent.name.substring(0, 2).toUpperCase();

  return (
    <div
      onClick={() => onSelect?.(agent)}
      className={`
        relative
        bg-[var(--color-bg-secondary)]
        border rounded-xl
        transition-all duration-200
        ${selected
          ? `border-[var(--color-brand-primary)] shadow-lg ${levelStyle.glow}`
          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]'
        }
        ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}
        ${compact ? 'p-3' : 'p-4'}
        ${className}
      `}
      {...props}
    >
      <div className={`flex ${compact ? 'items-center gap-3' : 'flex-col items-center text-center'}`}>
        {/* Avatar */}
        <div className={`relative ${compact ? '' : 'mb-3'}`}>
          <div
            className={`
              ${compact ? 'w-10 h-10' : 'w-16 h-16'}
              rounded-full
              bg-gradient-to-br ${levelStyle.bg}
              flex items-center justify-center
              text-white font-bold
              ${compact ? 'text-sm' : 'text-xl'}
              shadow-lg
            `}
          >
            {agent.avatarUrl ? (
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Level badge */}
          <span
            className={`
              absolute -top-1 -right-1
              ${compact ? 'w-4 h-4 text-[8px]' : 'w-6 h-6 text-xs'}
              rounded-full
              bg-gradient-to-br ${levelStyle.bg}
              text-white font-bold
              flex items-center justify-center
              shadow-md
            `}
          >
            {agent.level.replace('L', '')}
          </span>

          {/* Status indicator */}
          {showStatus && (
            <span
              className={`
                absolute bottom-0 right-0
                ${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'}
                rounded-full
                ${statusStyle.color}
                border-2 border-[var(--color-bg-secondary)]
                ${statusStyle.animate ? 'animate-pulse' : ''}
              `}
              title={statusStyle.label}
            />
          )}
        </div>

        {/* Info */}
        <div className={compact ? 'flex-1 min-w-0' : ''}>
          <h3 className={`font-semibold text-[var(--color-text-primary)] ${compact ? 'text-sm' : ''}`}>
            {agent.name}
          </h3>
          
          {!compact && agent.department && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {agent.department}
            </p>
          )}
          
          {!compact && agent.description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
              {agent.description}
            </p>
          )}

          {compact && (
            <p className="text-xs text-[var(--color-text-tertiary)] truncate">
              {agent.department || agent.description}
            </p>
          )}
        </div>

        {/* Status badge (compact) */}
        {compact && showStatus && (
          <span
            className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${agent.status === 'active' ? 'bg-green-100 text-green-700' : ''}
              ${agent.status === 'thinking' ? 'bg-blue-100 text-blue-700' : ''}
              ${agent.status === 'idle' ? 'bg-gray-100 text-gray-600' : ''}
              ${agent.status === 'error' ? 'bg-red-100 text-red-700' : ''}
              ${agent.status === 'offline' ? 'bg-gray-100 text-gray-400' : ''}
            `}
          >
            {statusStyle.label}
          </span>
        )}
      </div>

      {/* Capabilities */}
      {showCapabilities && agent.capabilities && agent.capabilities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((cap, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)]">
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CHAT MESSAGE COMPONENT
// =============================================================================

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: ChatMessage;
  showTimestamp?: boolean;
  showAvatar?: boolean;
}

/**
 * Chat Message Component
 */
export function ChatMessageBubble({
  message,
  showTimestamp = true,
  showAvatar = true,
  className = '',
  ...props
}: ChatMessageProps): JSX.Element {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className={`flex justify-center my-4 ${className}`} {...props}>
        <span className="px-3 py-1 text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-subtle)] rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`
        flex gap-3
        ${isUser ? 'flex-row-reverse' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
              {message.agentName?.substring(0, 1) || 'A'}
            </div>
          )}
        </div>
      )}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Agent name */}
        {!isUser && message.agentName && (
          <span className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            {message.agentName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl
            ${isUser
              ? 'bg-[var(--color-brand-primary)] text-white rounded-br-md'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-bl-md'
            }
            ${message.isStreaming ? 'animate-pulse' : ''}
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.isStreaming && (
            <span className="inline-flex gap-1 ml-1">
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <span className="text-xs text-[var(--color-text-tertiary)] mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// CHAT INPUT COMPONENT
// =============================================================================

export interface ChatInputProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Placeholder text */
  placeholder?: string;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** On submit callback */
  onSend: (message: string) => void;
  
  /** Show file upload */
  showAttachment?: boolean;
  
  /** On file upload */
  onAttachment?: (file: File) => void;
  
  /** Auto focus */
  autoFocus?: boolean;
}

/**
 * Chat Input Component
 */
export function ChatInput({
  placeholder = 'Écrivez votre message...',
  disabled = false,
  loading = false,
  onSend,
  showAttachment = false,
  onAttachment,
  autoFocus = true,
  className = '',
  ...props
}: ChatInputProps): JSX.Element {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !loading) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttachment) {
      onAttachment(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex items-end gap-2
        p-3
        bg-[var(--color-bg-secondary)]
        border-t border-[var(--color-border-subtle)]
        ${className}
      `}
      {...props}
    >
      {/* Attachment button */}
      {showAttachment && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="
              p-2 rounded-lg
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-text-secondary)]
              hover:bg-[var(--color-bg-hover)]
              transition-colors
              disabled:opacity-50
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
        </>
      )}

      {/* Input area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          autoFocus={autoFocus}
          rows={1}
          className="
            w-full
            px-4 py-2.5
            bg-[var(--color-bg-tertiary)]
            border border-[var(--color-border-default)]
            rounded-xl
            text-sm text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-tertiary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent
            resize-none
            disabled:opacity-50
          "
        />
      </div>

      {/* Send button */}
      <button
        type="submit"
        disabled={!value.trim() || disabled || loading}
        className="
          p-2.5 rounded-xl
          bg-[var(--color-brand-primary)]
          text-white
          hover:bg-[var(--color-brand-primary-hover)]
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </form>
  );
}

// =============================================================================
// AGENT CHAT CONTAINER
// =============================================================================

export interface AgentChatProps extends HTMLAttributes<HTMLDivElement> {
  /** Chat messages */
  messages: ChatMessage[];
  
  /** Active agent */
  agent?: Agent;
  
  /** On send message */
  onSend: (message: string) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** Header actions */
  headerActions?: ReactNode;
  
  /** Show header */
  showHeader?: boolean;
}

/**
 * Agent Chat Component
 * 
 * Complete chat interface for interacting with an AI agent.
 */
export function AgentChat({
  messages,
  agent,
  onSend,
  loading = false,
  headerActions,
  showHeader = true,
  className = '',
  ...props
}: AgentChatProps): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={`
        flex flex-col h-full
        bg-[var(--color-bg-primary)]
        border border-[var(--color-border-subtle)]
        rounded-xl
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {showHeader && agent && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${levelColors[agent.level].bg} flex items-center justify-center text-white font-bold`}>
              {agent.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {agent.name}
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {statusIndicators[agent.status].label}
              </p>
            </div>
          </div>
          {headerActions}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
}

// =============================================================================
// ORBITAL INDICATOR COMPONENT
// =============================================================================

export interface OrbitalIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Agent level */
  level: AgentLevel;
  
  /** Current status */
  status: AgentStatus;
  
  /** Size in pixels */
  size?: number;
  
  /** Show orbit rings */
  showOrbits?: boolean;
  
  /** Animate */
  animate?: boolean;
}

/**
 * Orbital Indicator Component
 * 
 * Visual indicator showing agent level and status with orbital animation.
 */
export function OrbitalIndicator({
  level,
  status,
  size = 120,
  showOrbits = true,
  animate = true,
  className = '',
  ...props
}: OrbitalIndicatorProps): JSX.Element {
  const levelConfig = levelColors[level];
  const statusConfig = statusIndicators[status];
  const levelNum = parseInt(level.replace('L', ''));

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Orbit rings */}
      {showOrbits && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute inset-0
                border border-[var(--color-border-subtle)]
                rounded-full
                opacity-${30 + i * 20}
              `}
              style={{
                transform: `scale(${0.6 + i * 0.2})`,
              }}
            />
          ))}
        </>
      )}

      {/* Center sphere */}
      <div
        className={`
          absolute
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-1/3 h-1/3
          rounded-full
          bg-gradient-to-br ${levelConfig.bg}
          shadow-lg ${levelConfig.glow}
          flex items-center justify-center
          text-white font-bold
          ${status === 'thinking' && animate ? 'animate-pulse' : ''}
        `}
      >
        {level}
      </div>

      {/* Orbiting dots */}
      {animate && status === 'active' && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2"
              style={{
                animation: `orbit ${3 + i}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
            </div>
          ))}
        </>
      )}

      {/* Status ring */}
      <div
        className={`
          absolute inset-0
          rounded-full
          border-2
          ${status === 'active' ? 'border-green-500' : ''}
          ${status === 'thinking' ? 'border-blue-500 animate-spin' : ''}
          ${status === 'error' ? 'border-red-500' : ''}
          ${status === 'idle' ? 'border-gray-400' : ''}
          ${status === 'offline' ? 'border-gray-300' : ''}
          opacity-50
        `}
        style={{
          borderStyle: status === 'thinking' ? 'dashed' : 'solid',
        }}
      />

      <style>{`
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(${size / 3}px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(${size / 3}px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// AGENT HIERARCHY TREE
// =============================================================================

export interface AgentNode {
  agent: Agent;
  children?: AgentNode[];
}

export interface AgentHierarchyProps extends HTMLAttributes<HTMLDivElement> {
  /** Root node */
  root: AgentNode;
  
  /** On agent select */
  onSelect?: (agent: Agent) => void;
  
  /** Selected agent ID */
  selectedId?: string;
}

/**
 * Agent Hierarchy Tree
 * 
 * Visual representation of agent hierarchy (L0 -> L1 -> L2 -> L3).
 */
export function AgentHierarchy({
  root,
  onSelect,
  selectedId,
  className = '',
  ...props
}: AgentHierarchyProps): JSX.Element {
  const renderNode = (node: AgentNode, depth: number = 0): JSX.Element => (
    <div key={node.agent.id} className={depth > 0 ? 'ml-8 mt-2' : ''}>
      <AgentCard
        agent={node.agent}
        compact
        selected={selectedId === node.agent.id}
        onSelect={onSelect}
      />
      {node.children && node.children.length > 0 && (
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-border-default)]" />
          {node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {renderNode(root)}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default AgentCard;
