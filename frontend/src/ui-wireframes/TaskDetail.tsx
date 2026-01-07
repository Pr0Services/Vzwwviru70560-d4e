// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — TASK DETAIL VIEW
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
type TaskType = 'EXECUTE' | 'ANALYZE' | 'REVIEW' | 'DECIDE' | 'RESEARCH';
type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

interface TaskUpdate {
  id: string;
  update_type: 'STATUS_CHANGE' | 'COMMENT' | 'RESULT' | 'BLOCKER';
  content: string;
  created_at: string;
  actor_name?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: TaskType;
  priority: Priority;
  status: TaskStatus;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

interface TaskDetailProps {
  task: Task;
  updates: TaskUpdate[];
  onUpdateStatus: (status: TaskStatus) => void;
  onAddComment: (comment: string) => void;
  onMarkDone: () => void;
  onBack?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: '#a3a3a3' },
  IN_PROGRESS: { label: 'In Progress', color: '#0066cc' },
  BLOCKED: { label: 'Blocked', color: '#f59e0b' },
  COMPLETED: { label: 'Completed', color: '#10b981' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444' },
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
  
  headerTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  metaSection: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f5f5f5',
  },
  
  title: {
    margin: '0 0 0.75rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  
  metaLabel: {
    color: '#737373',
  },
  
  metaValue: {
    fontWeight: 500,
  },
  
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  
  content: {
    flex: 1,
    padding: '1.25rem',
    overflow: 'auto',
  },
  
  section: {
    marginBottom: '1.5rem',
  },
  
  sectionLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  
  description: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#262626',
    whiteSpace: 'pre-wrap' as const,
    padding: '1rem',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px solid #f5f5f5',
  },
  
  divider: {
    height: '1px',
    background: '#e8e8e8',
    margin: '1.5rem 0',
  },
  
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  
  timelineItem: {
    display: 'flex',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: '#525252',
  },
  
  timelineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0066cc',
    marginTop: '6px',
    flexShrink: 0,
  },
  
  timelineTime: {
    color: '#a3a3a3',
    fontSize: '0.75rem',
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
  
  successButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 150ms ease',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  updates,
  onUpdateStatus,
  onAddComment,
  onMarkDone,
  onBack,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isCompleted = task.status === 'COMPLETED' || task.status === 'CANCELLED';
  
  // Format date
  const formatDate = (isoString?: string): string => {
    if (!isoString) return 'Not set';
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  };
  
  // Format time
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle comment submit
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
      setShowCommentInput(false);
    }
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
        <h2 style={styles.headerTitle}>TASK DETAIL</h2>
      </div>

      {/* META SECTION */}
      <div style={styles.metaSection}>
        <h1 style={styles.title}>Title: {task.title}</h1>
        
        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Priority:</span>
            <span style={{
              ...styles.metaValue,
              color: priorityConfig.color,
            }}>
              {priorityConfig.label}
            </span>
          </div>
          
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Status:</span>
            <span style={{
              ...styles.statusBadge,
              background: `${statusConfig.color}15`,
              color: statusConfig.color,
            }}>
              {statusConfig.label}
            </span>
          </div>
          
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Due:</span>
            <span style={styles.metaValue}>{formatDate(task.due_at)}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {/* Description */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Description</div>
          <hr style={{ border: 'none', borderTop: '1px solid #e8e8e8', margin: '0 0 0.75rem' }} />
          <p style={styles.description}>
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div style={styles.divider} />

        {/* Updates Timeline */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Updates Timeline</div>
          
          {updates.length === 0 ? (
            <p style={{ color: '#a3a3a3', fontSize: '0.875rem', fontStyle: 'italic' }}>
              No updates yet.
            </p>
          ) : (
            <div style={styles.timeline}>
              {updates.map(update => (
                <div key={update.id} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  <div>
                    <span>{update.content}</span>
                    <span style={styles.timelineTime}>
                      {' '}({formatTime(update.created_at)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        {showCommentInput && (
          <div style={{ marginTop: '1rem' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleCommentSubmit}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Add Comment
              </button>
              <button
                onClick={() => {
                  setShowCommentInput(false);
                  setCommentText('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER - Max 3 buttons */}
      <div style={styles.footer}>
        <button
          style={styles.primaryButton}
          onClick={() => {
            if (task.status === 'PENDING') {
              onUpdateStatus('IN_PROGRESS');
            } else if (task.status === 'BLOCKED') {
              onUpdateStatus('IN_PROGRESS');
            }
          }}
          disabled={isCompleted}
        >
          Update Status
        </button>
        
        <button
          style={styles.secondaryButton}
          onClick={() => setShowCommentInput(true)}
          disabled={showCommentInput}
        >
          Add Comment
        </button>
        
        <button
          style={{
            ...styles.successButton,
            opacity: isCompleted ? 0.5 : 1,
          }}
          onClick={onMarkDone}
          disabled={isCompleted}
        >
          {isCompleted ? '✓ Done' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default TaskDetail;
