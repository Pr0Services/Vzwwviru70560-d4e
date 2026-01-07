// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — CHAT & VOCAL COMPONENTS
// CANONICAL BLOCK — COPY/PASTE SAFE
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type {
  Message,
  MessageType,
  MessagePriority,
  Thread,
  AgentInbox,
  VoiceState,
  VoiceSession,
  ChatConfig,
} from './types';
import { DEFAULT_CHAT_CONFIG } from './types';

/* =========================================================
   1. MESSAGE BUBBLE
========================================================= */

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onReact,
}) => {
  const bubbleStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isOwn ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '12px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    backgroundColor: isOwn ? '#6366f1' : '#374151',
    color: '#ffffff',
  };

  const avatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: message.senderType === 'agent' ? '#10b981' : '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  };

  const metaStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const typeIndicator = getTypeIndicator(message.type);

  return (
    <div style={bubbleStyle}>
      {showAvatar && (
        <div style={avatarStyle}>
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            message.senderName.charAt(0).toUpperCase()
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
        <div style={contentStyle}>
          {typeIndicator && (
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>
              {typeIndicator}
            </div>
          )}
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {message.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  📎 {att.name}
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={metaStyle}>
          <span>{message.senderName}</span>
          {showTimestamp && (
            <span>{formatTime(message.timestamp)}</span>
          )}
          {message.priority === 'urgent' && (
            <span style={{ color: '#ef4444' }}>⚡ Urgent</span>
          )}
        </div>
      </div>
    </div>
  );
};

function getTypeIndicator(type: MessageType): string | null {
  switch (type) {
    case 'TASK': return '📋 Tâche';
    case 'QUESTION': return '❓ Question';
    case 'DECISION': return '✅ Décision';
    case 'VOICE_TRANSCRIPT': return '🎤 Transcription';
    default: return null;
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
}

/* =========================================================
   2. CHAT INPUT
========================================================= */

interface ChatInputProps {
  threadId: string;
  config?: ChatConfig;
  onSend: (content: string, type: MessageType, priority: MessagePriority) => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  onAttach?: (files: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  threadId,
  config = DEFAULT_CHAT_CONFIG,
  onSend,
  onVoiceStart,
  onVoiceStop,
  onAttach,
  disabled = false,
  placeholder = 'Écrivez votre message...',
}) => {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('NOTE');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!content.trim() || disabled) return;
    onSend(content.trim(), messageType, priority);
    setContent('');
    setMessageType('NOTE');
    setPriority('normal');
  }, [content, messageType, priority, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      onVoiceStop?.();
    } else {
      setIsRecording(true);
      onVoiceStart?.();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttach?.(files);
    }
    e.target.value = '';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#1f2937',
    borderTop: '1px solid #374151',
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '40px',
    maxHeight: '120px',
    padding: '10px 12px',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 12px',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const iconButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #4b5563',
  };

  return (
    <div style={containerStyle}>
      {/* Type & Priority Row */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value as MessageType)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '12px',
          }}
        >
          <option value="NOTE">💬 Note</option>
          <option value="TASK">📋 Tâche</option>
          <option value="QUESTION">❓ Question</option>
          <option value="DECISION">✅ Décision</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as MessagePriority)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '12px',
          }}
        >
          <option value="low">🔽 Basse</option>
          <option value="normal">➖ Normale</option>
          <option value="high">🔼 Haute</option>
          <option value="urgent">⚡ Urgente</option>
        </select>
      </div>

      {/* Input Row */}
      <div style={inputRowStyle}>
        {config.attachmentsEnabled && (
          <>
            <button
              type="button"
              style={iconButtonStyle}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={textareaStyle}
          rows={1}
        />

        {config.voiceEnabled && (
          <button
            type="button"
            style={{
              ...iconButtonStyle,
              backgroundColor: isRecording ? '#ef4444' : 'transparent',
            }}
            onClick={handleVoiceToggle}
            disabled={disabled}
          >
            {isRecording ? '⏹️' : '🎤'}
          </button>
        )}

        <button
          type="button"
          style={buttonStyle}
          onClick={handleSend}
          disabled={disabled || !content.trim()}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   3. MESSAGE LIST
========================================================= */

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  config?: ChatConfig;
  onReply?: (messageId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  config = DEFAULT_CHAT_CONFIG,
  onReply,
  onLoadMore,
  hasMore = false,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Load more when scrolled to top
    if (scrollTop < 50 && hasMore && !loading) {
      onLoadMore?.();
    }
    
    // Auto-scroll when near bottom
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div ref={containerRef} style={containerStyle} onScroll={handleScroll}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '12px', color: '#9ca3af' }}>
          Chargement...
        </div>
      )}
      
      {messages.map((message, index) => {
        const isOwn = message.senderId === currentUserId;
        const showAvatar = config.showAvatars && (
          index === 0 ||
          messages[index - 1].senderId !== message.senderId
        );

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={isOwn}
            showAvatar={showAvatar}
            showTimestamp={config.showTimestamps}
            onReply={onReply}
          />
        );
      })}
    </div>
  );
};

/* =========================================================
   4. VOICE INPUT OVERLAY
========================================================= */

interface VoiceInputOverlayProps {
  session: VoiceSession;
  onConfirm: (transcript: string) => void;
  onCancel: () => void;
  onRetry: () => void;
}

export const VoiceInputOverlay: React.FC<VoiceInputOverlayProps> = ({
  session,
  onConfirm,
  onCancel,
  onRetry,
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  };

  const transcriptStyle: React.CSSProperties = {
    backgroundColor: '#374151',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    minHeight: '80px',
    fontSize: '16px',
    color: '#ffffff',
  };

  const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  const getStateIcon = (state: VoiceState): string => {
    switch (state) {
      case 'listening': return '🎤';
      case 'processing': return '⏳';
      case 'confirming': return '✅';
      case 'error': return '❌';
      default: return '🎤';
    }
  };

  const getStateText = (state: VoiceState): string => {
    switch (state) {
      case 'listening': return 'Écoute en cours...';
      case 'processing': return 'Transcription...';
      case 'confirming': return 'Confirmez le texte';
      case 'error': return 'Erreur';
      default: return '';
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {getStateIcon(session.state)}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 500, color: '#ffffff' }}>
          {getStateText(session.state)}
        </div>

        {session.state === 'listening' && session.duration && (
          <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
            {Math.floor(session.duration / 1000)}s
          </div>
        )}

        {(session.state === 'confirming' || session.transcript) && (
          <div style={transcriptStyle}>
            {session.transcript || '...'}
          </div>
        )}

        {session.confidence !== undefined && (
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            Confiance: {Math.round(session.confidence * 100)}%
          </div>
        )}

        {session.error && (
          <div style={{ color: '#ef4444', marginTop: '8px' }}>
            {session.error.message}
          </div>
        )}

        <div style={buttonRowStyle}>
          <button
            type="button"
            style={{ ...buttonStyle, backgroundColor: '#374151', color: '#ffffff' }}
            onClick={onCancel}
          >
            Annuler
          </button>

          {session.state === 'error' && (
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: '#6366f1', color: '#ffffff' }}
              onClick={onRetry}
            >
              Réessayer
            </button>
          )}

          {session.state === 'confirming' && session.transcript && (
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: '#10b981', color: '#ffffff' }}
              onClick={() => onConfirm(session.transcript!)}
            >
              Confirmer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   5. AGENT INBOX CARD
========================================================= */

interface AgentInboxCardProps {
  inbox: AgentInbox;
  onClick?: (agentId: string) => void;
  selected?: boolean;
}

export const AgentInboxCard: React.FC<AgentInboxCardProps> = ({
  inbox,
  onClick,
  selected = false,
}) => {
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: selected ? '#374151' : '#1f2937',
    borderRadius: '8px',
    cursor: 'pointer',
    border: selected ? '2px solid #6366f1' : '2px solid transparent',
    transition: 'all 0.2s',
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    position: 'relative',
  };

  const statusDotStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: inbox.isOnline ? '#10b981' : '#6b7280',
    border: '2px solid #1f2937',
  };

  return (
    <div style={cardStyle} onClick={() => onClick?.(inbox.agentId)}>
      <div style={avatarStyle}>
        {inbox.agentName.charAt(0).toUpperCase()}
        <div style={statusDotStyle} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: '#ffffff' }}>
          {inbox.agentName}
        </div>
        {inbox.lastMessagePreview && (
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {inbox.lastMessagePreview}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        {inbox.unreadMessages > 0 && (
          <div style={{
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '20px',
            textAlign: 'center',
          }}>
            {inbox.unreadMessages}
          </div>
        )}
        {inbox.pendingTasks > 0 && (
          <div style={{
            backgroundColor: '#f59e0b',
            color: '#000000',
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '10px',
          }}>
            {inbox.pendingTasks} tâches
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   6. CHAT CONTAINER
========================================================= */

interface ChatContainerProps {
  thread: Thread;
  messages: Message[];
  currentUserId: string;
  agentInboxes?: AgentInbox[];
  config?: ChatConfig;
  onSend: (content: string, type: MessageType, priority: MessagePriority) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  thread,
  messages,
  currentUserId,
  agentInboxes = [],
  config = DEFAULT_CHAT_CONFIG,
  onSend,
  onLoadMore,
  hasMore = false,
  loading = false,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <div style={{ fontWeight: 600, color: '#ffffff' }}>
            {thread.title || 'Conversation'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {thread.participantIds.length + thread.agentIds.length} participants
          </div>
        </div>
        {agentInboxes.length > 0 && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {agentInboxes.slice(0, 3).map((inbox) => (
              <div
                key={inbox.agentId}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {inbox.agentName.charAt(0)}
              </div>
            ))}
            {agentInboxes.length > 3 && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#9ca3af',
              }}>
                +{agentInboxes.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        config={config}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
      />

      <ChatInput
        threadId={thread.id}
        config={config}
        onSend={onSend}
      />
    </div>
  );
};

/* =========================================================
   7. EXPORTS
========================================================= */

export default {
  MessageBubble,
  ChatInput,
  MessageList,
  VoiceInputOverlay,
  AgentInboxCard,
  ChatContainer,
};
