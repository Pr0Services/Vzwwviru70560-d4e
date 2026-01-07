// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — AGENT INBOX SYSTEM
// React Components - UI Implementation
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  AgentInbox,
  AgentInfo,
  InboxMessage,
  Task,
  TaskUpdate,
  VoiceRecording,
  MessageType,
  MessageStatus,
  Priority,
  TaskStatus,
  TaskType,
  SenderType,
  MESSAGE_TYPE_CONFIG,
  PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  TASK_TYPE_CONFIG,
  SendMessageRequest,
  ConfirmVoiceRequest,
  needsConfirmation,
  isHighPriority,
  canTransitionTo,
} from './types';

// =============================================================================
// AGENT INBOX CARD
// =============================================================================

interface AgentInboxCardProps {
  inbox: AgentInbox;
  agent: AgentInfo;
  onClick: () => void;
  onMuteToggle?: () => void;
}

export const AgentInboxCard: React.FC<AgentInboxCardProps> = ({
  inbox,
  agent,
  onClick,
  onMuteToggle,
}) => {
  const hasUnread = inbox.unreadCount > 0;
  const hasPendingTasks = inbox.pendingTaskCount > 0;
  
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        borderLeft: hasUnread ? '4px solid #0084ff' : '4px solid transparent',
      }}
    >
      {/* Agent Avatar */}
      <div style={{
        position: 'relative',
        width: '48px',
        height: '48px',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e0efff 0%, #b8dbff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
        }}>
          {agent.avatar || '🤖'}
        </div>
        
        {/* Unread badge */}
        {hasUnread && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '20px',
            height: '20px',
            padding: '0 6px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {inbox.unreadCount > 99 ? '99+' : inbox.unreadCount}
          </div>
        )}
      </div>
      
      {/* Agent Info */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>
            {agent.name}
          </span>
          {inbox.isMuted && (
            <span style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>🔇</span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '0.25rem',
          fontSize: '0.875rem',
          color: '#737373',
        }}>
          {hasPendingTasks && (
            <span>📋 {inbox.pendingTaskCount} tâche{inbox.pendingTaskCount > 1 ? 's' : ''}</span>
          )}
          <span>🕐 {formatRelativeTime(inbox.lastActivityAt)}</span>
        </div>
      </div>
      
      {/* Arrow */}
      <span style={{ color: '#a3a3a3', fontSize: '1.25rem' }}>→</span>
    </div>
  );
};

// =============================================================================
// MESSAGE TYPE SELECTOR
// =============================================================================

interface MessageTypeSelectorProps {
  selected: MessageType;
  onChange: (type: MessageType) => void;
  suggestedType?: MessageType;
  disabled?: boolean;
}

export const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({
  selected,
  onChange,
  suggestedType,
  disabled = false,
}) => {
  const types = Object.values(MessageType).filter(
    t => t !== MessageType.VOICE_TRANSCRIPT
  );

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    }}>
      {types.map(type => {
        const config = MESSAGE_TYPE_CONFIG[type];
        const isSelected = selected === type;
        const isSuggested = suggestedType === type && !isSelected;
        
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 0.75rem',
              background: isSelected ? config.color : 'white',
              color: isSelected ? 'white' : '#525252',
              border: isSuggested 
                ? `2px solid ${config.color}` 
                : '1px solid #e8e8e8',
              borderRadius: '8px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 200ms ease',
              fontSize: '0.875rem',
            }}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// =============================================================================
// PRIORITY SELECTOR
// =============================================================================

interface PrioritySelectorProps {
  selected: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {Object.values(Priority).map(priority => {
        const config = PRIORITY_CONFIG[priority];
        const isSelected = selected === priority;
        
        return (
          <button
            key={priority}
            onClick={() => onChange(priority)}
            disabled={disabled}
            style={{
              padding: '0.375rem 0.625rem',
              background: isSelected ? config.color : 'transparent',
              color: isSelected ? 'white' : config.color,
              border: `1px solid ${isSelected ? config.color : '#e8e8e8'}`,
              borderRadius: '6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '0.75rem',
              transition: 'all 200ms ease',
            }}
          >
            {config.icon} {config.label}
          </button>
        );
      })}
    </div>
  );
};

// =============================================================================
// MESSAGE COMPOSER
// =============================================================================

interface MessageComposerProps {
  targetAgent: AgentInfo;
  onSend: (request: SendMessageRequest) => void;
  onVoiceStart?: () => void;
  onVoiceComplete?: (recording: VoiceRecording) => void;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  targetAgent,
  onSend,
  onVoiceStart,
  onVoiceComplete,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.NOTE);
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSend = useCallback(() => {
    if (!content.trim()) return;
    
    onSend({
      agent_id: targetAgent.id,
      message_type: messageType,
      priority,
      content_text: content.trim(),
    });
    
    setContent('');
  }, [content, messageType, priority, targetAgent, onSend]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#737373',
      }}>
        <span>À:</span>
        <span style={{
          padding: '0.25rem 0.5rem',
          background: '#f5f5f5',
          borderRadius: '4px',
          fontWeight: 500,
          color: '#262626',
        }}>
          {targetAgent.name}
        </span>
      </div>
      
      {/* Type Selector */}
      <MessageTypeSelector
        selected={messageType}
        onChange={setMessageType}
        disabled={disabled}
      />
      
      {/* Content Input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message..."
          disabled={disabled}
          style={{
            flex: 1,
            minHeight: '80px',
            padding: '0.75rem',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '1rem',
          }}
        />
        
        {/* Voice Button */}
        {onVoiceStart && (
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              isRecording ? undefined : onVoiceStart();
            }}
            disabled={disabled}
            style={{
              width: '48px',
              height: '48px',
              background: isRecording ? '#ef4444' : '#f5f5f5',
              color: isRecording ? 'white' : '#525252',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.25rem',
              transition: 'all 200ms ease',
            }}
          >
            🎙️
          </button>
        )}
      </div>
      
      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <PrioritySelector
          selected={priority}
          onChange={setPriority}
          disabled={disabled}
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || !content.trim()}
          style={{
            padding: '0.5rem 1.5rem',
            background: content.trim() ? '#0084ff' : '#e8e8e8',
            color: content.trim() ? 'white' : '#a3a3a3',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 200ms ease',
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// MESSAGE BUBBLE
// =============================================================================

interface MessageBubbleProps {
  message: InboxMessage;
  isOwn: boolean;
  onAcknowledge?: () => void;
  onReply?: () => void;
  onCreateTask?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onAcknowledge,
  onReply,
  onCreateTask,
}) => {
  const [showActions, setShowActions] = useState(false);
  const config = MESSAGE_TYPE_CONFIG[message.messageType];
  const priorityConfig = PRIORITY_CONFIG[message.priority];
  
  const isUnconfirmedVoice = needsConfirmation(message);
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '1rem',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.25rem',
        fontSize: '0.75rem',
        color: '#737373',
      }}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
        {isHighPriority(message) && (
          <span style={{ color: priorityConfig.color }}>
            {priorityConfig.icon}
          </span>
        )}
        {isUnconfirmedVoice && (
          <span style={{ color: '#f59e0b' }}>⚠️ Non confirmé</span>
        )}
      </div>
      
      {/* Content */}
      <div style={{
        maxWidth: '70%',
        padding: '0.75rem 1rem',
        background: isOwn ? '#0084ff' : '#f5f5f5',
        color: isOwn ? 'white' : '#262626',
        borderRadius: isOwn ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
        opacity: isUnconfirmedVoice ? 0.7 : 1,
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {message.contentText}
        </p>
        
        {/* Task link */}
        {message.relatedTaskId && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
            fontSize: '0.75rem',
          }}>
            📋 Tâche liée
          </div>
        )}
      </div>
      
      {/* Timestamp */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '0.25rem',
        fontSize: '0.75rem',
        color: '#a3a3a3',
      }}>
        <span>{formatTime(message.createdAt)}</span>
        {message.status === MessageStatus.ACKNOWLEDGED && (
          <span>✓✓</span>
        )}
      </div>
      
      {/* Actions */}
      {showActions && !isOwn && (
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          marginTop: '0.25rem',
        }}>
          {onAcknowledge && message.status !== MessageStatus.ACKNOWLEDGED && (
            <ActionButton onClick={onAcknowledge} label="Accuser réception" />
          )}
          {onReply && (
            <ActionButton onClick={onReply} label="Répondre" />
          )}
          {onCreateTask && message.messageType !== MessageType.TASK && (
            <ActionButton onClick={onCreateTask} label="→ Tâche" />
          )}
        </div>
      )}
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.25rem 0.5rem',
      background: 'transparent',
      border: '1px solid #e8e8e8',
      borderRadius: '4px',
      fontSize: '0.75rem',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// =============================================================================
// TASK CARD
// =============================================================================

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onClick?: () => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onClick,
  compact = false,
}) => {
  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const typeConfig = TASK_TYPE_CONFIG[task.taskType];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  
  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && 
    task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED;
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: compact ? '0.75rem' : '1rem',
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        borderLeft: `4px solid ${statusConfig.color}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            <span>{statusConfig.icon}</span>
            <span style={{ fontWeight: 600 }}>{task.title}</span>
            <span style={{
              padding: '0.125rem 0.375rem',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#737373',
            }}>
              {typeConfig.icon} {typeConfig.label}
            </span>
            {isHighPriority(task) && (
              <span style={{ color: priorityConfig.color }}>
                {priorityConfig.icon}
              </span>
            )}
          </div>
          
          {!compact && (
            <p style={{
              margin: '0.5rem 0 0',
              fontSize: '0.875rem',
              color: '#737373',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Footer */}
      {!compact && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f5f5f5',
        }}>
          {/* Due date */}
          <div style={{
            fontSize: '0.75rem',
            color: isOverdue ? '#ef4444' : '#737373',
          }}>
            {task.dueAt && (
              <>
                ⏰ {isOverdue ? 'En retard: ' : ''}
                {formatDate(task.dueAt)}
              </>
            )}
          </div>
          
          {/* Status actions */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {task.status === TaskStatus.PENDING && (
              <StatusButton
                onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
                label="Démarrer"
              />
            )}
            {task.status === TaskStatus.IN_PROGRESS && (
              <>
                <StatusButton
                  onClick={() => onStatusChange(TaskStatus.COMPLETED)}
                  label="Terminer"
                  color="#10b981"
                />
                <StatusButton
                  onClick={() => onStatusChange(TaskStatus.BLOCKED)}
                  label="Bloquer"
                  color="#f59e0b"
                />
              </>
            )}
            {task.status === TaskStatus.BLOCKED && (
              <StatusButton
                onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
                label="Débloquer"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Blocked reason */}
      {task.status === TaskStatus.BLOCKED && task.blockedReason && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: '#fffbeb',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: '#92400e',
        }}>
          🚫 {task.blockedReason}
        </div>
      )}
    </div>
  );
};

const StatusButton: React.FC<{
  onClick: () => void;
  label: string;
  color?: string;
}> = ({ onClick, label, color }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    style={{
      padding: '0.25rem 0.5rem',
      background: 'transparent',
      color: color || '#525252',
      border: `1px solid ${color || '#e8e8e8'}`,
      borderRadius: '4px',
      fontSize: '0.75rem',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// =============================================================================
// VOICE CONFIRMATION DIALOG
// =============================================================================

interface VoiceConfirmationDialogProps {
  recording: VoiceRecording;
  targetAgent: AgentInfo;
  onConfirm: (request: ConfirmVoiceRequest) => void;
  onCancel: () => void;
  onReRecord: () => void;
}

export const VoiceConfirmationDialog: React.FC<VoiceConfirmationDialogProps> = ({
  recording,
  targetAgent,
  onConfirm,
  onCancel,
  onReRecord,
}) => {
  const [editedContent, setEditedContent] = useState(
    recording.cleanedTranscript || recording.rawTranscript || ''
  );
  const [messageType, setMessageType] = useState<MessageType>(
    recording.detectedMessageType || MessageType.NOTE
  );
  const [priority, setPriority] = useState<Priority>(
    recording.detectedPriority || Priority.NORMAL
  );
  const [createTask, setCreateTask] = useState(messageType === MessageType.TASK);
  
  const handleConfirm = () => {
    onConfirm({
      recording_id: recording.id,
      edited_content: editedContent,
      message_type: messageType,
      priority,
      create_task: createTask && messageType === MessageType.TASK,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.25rem' }}>🎙️</span>
          <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
            Confirmer le message vocal
          </h3>
        </div>
        
        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Target */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#737373',
          }}>
            <span>À:</span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontWeight: 500,
              color: '#262626',
            }}>
              {targetAgent.name}
            </span>
          </div>
          
          {/* AI Summary */}
          {recording.summary && (
            <div style={{
              padding: '1rem',
              background: '#f0f7ff',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#0066cc',
                marginBottom: '0.5rem',
              }}>
                Résumé IA
              </div>
              <p style={{ margin: 0 }}>{recording.summary}</p>
            </div>
          )}
          
          {/* Type Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: '#525252',
              marginBottom: '0.5rem',
            }}>
              Type de message
            </label>
            <MessageTypeSelector
              selected={messageType}
              onChange={(type) => {
                setMessageType(type);
                setCreateTask(type === MessageType.TASK);
              }}
              suggestedType={recording.detectedMessageType}
            />
          </div>
          
          {/* Editable Content */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: '#525252',
              marginBottom: '0.5rem',
            }}>
              Contenu
            </label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical',
              }}
            />
          </div>
          
          {/* Priority */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: '#525252',
              marginBottom: '0.5rem',
            }}>
              Priorité
            </label>
            <PrioritySelector
              selected={priority}
              onChange={setPriority}
            />
          </div>
          
          {/* Create Task option */}
          {messageType === MessageType.TASK && (
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={createTask}
                onChange={(e) => setCreateTask(e.target.checked)}
              />
              Créer aussi une tâche
            </label>
          )}
          
          {/* Confidence */}
          {recording.transcriptionConfidence !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#737373',
            }}>
              <span>Confiance:</span>
              <div style={{
                flex: 1,
                maxWidth: '100px',
                height: '4px',
                background: '#e8e8e8',
                borderRadius: '2px',
              }}>
                <div style={{
                  width: `${recording.transcriptionConfidence * 100}%`,
                  height: '100%',
                  background: recording.transcriptionConfidence > 0.8 
                    ? '#10b981' 
                    : recording.transcriptionConfidence > 0.6 
                      ? '#f59e0b' 
                      : '#ef4444',
                  borderRadius: '2px',
                }} />
              </div>
              <span>{Math.round(recording.transcriptionConfidence * 100)}%</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e8e8e8',
          background: '#fafafa',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onReRecord}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🎙️ Réenregistrer
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleConfirm}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#0084ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ✅ Confirmer & Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PUSH-TO-TALK VOICE RECORDER
// =============================================================================

interface VoiceRecorderButtonProps {
  onRecordingComplete: (audioBlob: Blob, durationSeconds: number) => void;
  onError?: (error: Error) => void;
  maxDuration?: number;
  disabled?: boolean;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({
  onRecordingComplete,
  onError,
  maxDuration = 120,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const startRecording = useCallback(async () => {
    if (disabled) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = window.setInterval(() => {
        setDuration(d => {
          if (d >= maxDuration) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
      
    } catch (err) {
      onError?.(err as Error);
    }
  }, [disabled, maxDuration, onError]);
  
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      onRecordingComplete(blob, duration);
    };
    
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  }, [isRecording, duration, onRecordingComplete]);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={isRecording ? stopRecording : undefined}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={disabled}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isRecording 
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : disabled
              ? '#e8e8e8'
              : 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isRecording
            ? '0 0 0 4px rgba(239, 68, 68, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 200ms ease',
          transform: isRecording ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {isRecording ? '⏹️' : '🎙️'}
      </button>
      
      {isRecording && (
        <span style={{
          fontSize: '0.875rem',
          color: '#ef4444',
          fontWeight: 500,
        }}>
          {formatDuration(duration)}
        </span>
      )}
      
      <span style={{
        fontSize: '0.75rem',
        color: '#a3a3a3',
      }}>
        {isRecording ? 'Relâchez pour arrêter' : 'Maintenez pour parler'}
      </span>
    </div>
  );
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}j`;
  return date.toLocaleDateString('fr-CA');
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('fr-CA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('fr-CA', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  AgentInboxCard,
  MessageTypeSelector,
  PrioritySelector,
  MessageComposer,
  MessageBubble,
  TaskCard,
  VoiceConfirmationDialog,
  VoiceRecorderButton,
};
