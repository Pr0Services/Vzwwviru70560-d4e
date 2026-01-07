// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — MESSAGE DETAIL VIEW
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React from 'react';

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
  content_summary?: string;
  created_at: string;
  related_task_id?: string;
  requires_confirmation?: boolean;
}

interface MessageDetailProps {
  message: InboxMessage;
  onAcknowledge: () => void;
  onCreateTask: () => void;
  onAskQuestion: () => void;
  onOpenTask?: () => void;
  onBack?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  TASK: 'Task',
  NOTE: 'Note',
  COMMENT: 'Comment',
  QUESTION: 'Question',
  DECISION: 'Decision',
  VOICE_TRANSCRIPT: 'Voice Transcript',
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  LOW: { label: 'Low', color: '#a3a3a3' },
  NORMAL: { label: 'Normal', color: '#525252' },
  HIGH: { label: 'High', color: '#f59e0b' },
  CRITICAL: { label: 'Critical', color: '#ef4444' },
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
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  backButton: {
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    color: '#737373',
  },
  
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  metaSection: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f5f5f5',
    background: '#fafafa',
  },
  
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  
  metaItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  
  metaLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  
  metaValue: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: '#1a1a1a',
  },
  
  content: {
    flex: 1,
    padding: '1.25rem',
    overflow: 'auto',
  },
  
  contentLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  
  contentText: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#262626',
    whiteSpace: 'pre-wrap' as const,
  },
  
  divider: {
    height: '1px',
    background: '#e8e8e8',
    margin: '1.5rem 0',
  },
  
  relatedTask: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    background: '#f0f7ff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 150ms ease',
  },
  
  relatedTaskLabel: {
    fontSize: '0.875rem',
    color: '#0066cc',
  },
  
  footer: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    gap: '0.75rem',
  },
  
  primaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 150ms ease',
  },
  
  secondaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'white',
    color: '#525252',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onAcknowledge,
  onCreateTask,
  onAskQuestion,
  onOpenTask,
  onBack,
}) => {
  const priorityConfig = PRIORITY_CONFIG[message.priority];
  const isAcknowledged = message.status === 'ACKNOWLEDGED';
  
  // Format date
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        {onBack && (
          <button style={styles.backButton} onClick={onBack}>
            ←
          </button>
        )}
        <h2 style={styles.title}>MESSAGE DETAIL</h2>
      </div>

      {/* META SECTION */}
      <div style={styles.metaSection}>
        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Type</span>
            <span style={styles.metaValue}>
              {MESSAGE_TYPE_LABELS[message.message_type]}
            </span>
          </div>
          
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Priority</span>
            <span style={{
              ...styles.metaValue,
              color: priorityConfig.color,
            }}>
              {priorityConfig.label}
            </span>
          </div>
          
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Sender</span>
            <span style={styles.metaValue}>{message.sender_name}</span>
          </div>
          
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Time</span>
            <span style={styles.metaValue}>{formatDate(message.created_at)}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <div style={styles.contentLabel}>Title / Content</div>
        <hr style={{ border: 'none', borderTop: '1px solid #e8e8e8', margin: '0 0 1rem' }} />
        
        <p style={styles.contentText}>
          {message.content_text}
        </p>

        {/* Summary if available */}
        {message.content_summary && (
          <>
            <div style={styles.divider} />
            <div style={styles.contentLabel}>AI Summary</div>
            <p style={{
              ...styles.contentText,
              fontSize: '0.875rem',
              color: '#737373',
              fontStyle: 'italic',
            }}>
              {message.content_summary}
            </p>
          </>
        )}

        {/* Related Task */}
        {message.related_task_id && (
          <>
            <div style={styles.divider} />
            <div
              style={styles.relatedTask}
              onClick={onOpenTask}
            >
              <span>📋</span>
              <span style={styles.relatedTaskLabel}>
                Related Task: Open Task →
              </span>
            </div>
          </>
        )}
      </div>

      {/* FOOTER - Max 3 visible buttons */}
      <div style={styles.footer}>
        <button
          style={{
            ...styles.primaryButton,
            opacity: isAcknowledged ? 0.5 : 1,
          }}
          onClick={onAcknowledge}
          disabled={isAcknowledged}
        >
          {isAcknowledged ? '✓ Acknowledged' : 'Acknowledge'}
        </button>
        
        <button
          style={styles.secondaryButton}
          onClick={onCreateTask}
        >
          Create Task
        </button>
        
        <button
          style={styles.secondaryButton}
          onClick={onAskQuestion}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default MessageDetail;
