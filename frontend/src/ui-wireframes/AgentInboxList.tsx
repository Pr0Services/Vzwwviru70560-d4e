// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — AGENT INBOX LIST VIEW
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type MessageType = 'TASK' | 'NOTE' | 'COMMENT' | 'QUESTION' | 'DECISION' | 'VOICE_TRANSCRIPT';
type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
type MessageStatus = 'NEW' | 'READ' | 'ACKNOWLEDGED' | 'ARCHIVED';
type SenderType = 'USER' | 'AGENT' | 'SYSTEM';

interface InboxMessage {
  id: string;
  message_type: MessageType;
  priority: Priority;
  status: MessageStatus;
  sender_type: SenderType;
  sender_name: string;
  content_text: string;
  created_at: string;
  related_task_id?: string;
}

interface AgentInfo {
  id: string;
  name: string;
  avatar?: string;
}

interface AgentInboxListProps {
  agent: AgentInfo;
  messages: InboxMessage[];
  onMessageClick: (message: InboxMessage) => void;
  onSearch?: (query: string) => void;
}

type FilterType = 'ALL' | MessageType;

// =============================================================================
// CONSTANTS
// =============================================================================

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'TASK', label: 'Tasks' },
  { id: 'NOTE', label: 'Notes' },
  { id: 'DECISION', label: 'Decisions' },
  { id: 'QUESTION', label: 'Questions' },
];

const MESSAGE_TYPE_CONFIG: Record<MessageType, { label: string; color: string }> = {
  TASK: { label: 'TASK', color: '#0066cc' },
  NOTE: { label: 'NOTE', color: '#737373' },
  COMMENT: { label: 'COMMENT', color: '#525252' },
  QUESTION: { label: 'QUESTION', color: '#f59e0b' },
  DECISION: { label: 'DECISION', color: '#10b981' },
  VOICE_TRANSCRIPT: { label: 'VOICE', color: '#8b5cf6' },
};

const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  LOW: { color: '#a3a3a3' },
  NORMAL: { color: '#525252' },
  HIGH: { color: '#f59e0b' },
  CRITICAL: { color: '#ef4444' },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
  },
  
  header: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e8e8e8',
  },
  
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  filtersRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid #f5f5f5',
    background: '#fafafa',
  },
  
  filterButton: {
    padding: '0.375rem 0.75rem',
    background: 'transparent',
    border: '1px solid #e8e8e8',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    color: '#525252',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  
  filterButtonActive: {
    background: '#0066cc',
    borderColor: '#0066cc',
    color: 'white',
  },
  
  searchButton: {
    marginLeft: 'auto',
    padding: '0.375rem 0.5rem',
    background: 'transparent',
    border: '1px solid #e8e8e8',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  
  messageList: {
    flex: 1,
    overflow: 'auto',
  },
  
  messageItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f5f5f5',
    cursor: 'pointer',
    transition: 'background 150ms ease',
  },
  
  unreadIndicator: {
    width: '8px',
    minWidth: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '6px',
  },
  
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0066cc',
  },
  
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  
  typeBadge: {
    padding: '0.125rem 0.375rem',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  
  priorityBadge: {
    padding: '0.125rem 0.375rem',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    fontWeight: 500,
    background: '#f5f5f5',
  },
  
  messageTitle: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: '#1a1a1a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  messageMeta: {
    margin: '0.25rem 0 0',
    fontSize: '0.8125rem',
    color: '#737373',
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: '#737373',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AgentInboxList: React.FC<AgentInboxListProps> = ({
  agent,
  messages,
  onMessageClick,
  onSearch,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (activeFilter === 'ALL') return true;
    return msg.message_type === activeFilter;
  });

  // Format relative time
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-CA');
  };

  // Truncate content for preview
  const truncate = (text: string, maxLen: number = 60): string => {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trim() + '...';
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>AGENT INBOX — {agent.name}</h2>
      </div>

      {/* FILTERS ROW */}
      <div style={styles.filtersRow}>
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              ...styles.filterButton,
              ...(activeFilter === filter.id ? styles.filterButtonActive : {}),
            }}
          >
            {filter.label}
          </button>
        ))}
        
        {/* Search */}
        {onSearch && (
          <button
            style={styles.searchButton}
            onClick={() => onSearch('')}
          >
            🔍
          </button>
        )}
      </div>

      {/* MESSAGE LIST */}
      <div style={styles.messageList}>
        {filteredMessages.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</span>
            <span>No messages</span>
          </div>
        ) : (
          filteredMessages.map(message => {
            const isUnread = message.status === 'NEW';
            const typeConfig = MESSAGE_TYPE_CONFIG[message.message_type];
            const priorityConfig = PRIORITY_CONFIG[message.priority];
            const isHovered = hoveredId === message.id;

            return (
              <div
                key={message.id}
                onClick={() => onMessageClick(message)}
                onMouseEnter={() => setHoveredId(message.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  ...styles.messageItem,
                  background: isHovered ? '#f9fafb' : 'transparent',
                }}
              >
                {/* Unread Indicator */}
                <div style={styles.unreadIndicator}>
                  {isUnread && <div style={styles.unreadDot} />}
                </div>

                {/* Content */}
                <div style={styles.messageContent}>
                  {/* Header with badges */}
                  <div style={styles.messageHeader}>
                    {/* Type Badge */}
                    <span style={{
                      ...styles.typeBadge,
                      background: `${typeConfig.color}15`,
                      color: typeConfig.color,
                    }}>
                      {typeConfig.label}
                    </span>

                    {/* Priority Badge (only for HIGH/CRITICAL) */}
                    {(message.priority === 'HIGH' || message.priority === 'CRITICAL') && (
                      <span style={{
                        ...styles.priorityBadge,
                        color: priorityConfig.color,
                      }}>
                        {message.priority}
                      </span>
                    )}

                    {/* Title */}
                    <h3 style={styles.messageTitle}>
                      {truncate(message.content_text)}
                    </h3>
                  </div>

                  {/* Meta */}
                  <p style={styles.messageMeta}>
                    From: {message.sender_name} — {formatRelativeTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default AgentInboxList;
