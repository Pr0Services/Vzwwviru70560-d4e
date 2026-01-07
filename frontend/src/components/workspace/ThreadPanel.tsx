// CHE·NU™ Thread Panel — .chenu Conversation Interface

import React, { useState, useRef, useEffect } from 'react';
import type { Thread, Message, Decision, EncodingLevel } from '../../types';
import { CHENU_COLORS } from '../../types';

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#111113',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  
  header: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  badge: (color: string) => ({
    padding: '4px 8px',
    backgroundColor: `${color}22`,
    color,
    borderRadius: '4px',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  }),
  
  tokenInfo: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  
  message: (role: string) => ({
    maxWidth: '80%',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  
  messageContent: (role: string) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: role === 'user' ? CHENU_COLORS.sacredGold + '22' : '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    lineHeight: 1.5,
  }),
  
  messageMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
    display: 'flex',
    gap: '8px',
  },
  
  inputContainer: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    gap: '12px',
  },
  
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
  },
  
  sendButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  encodingToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  decisionCard: {
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    border: `1px solid ${CHENU_COLORS.sacredGold}33`,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  
  decisionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  optionButton: (selected: boolean) => ({
    padding: '10px 16px',
    borderRadius: '8px',
    border: `1px solid ${selected ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
    backgroundColor: selected ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: selected ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '8px',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease',
  }),
};

// ============================================================
// MESSAGE COMPONENT
// ============================================================

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const roleLabels = {
    user: 'You',
    assistant: 'Nova',
    system: 'System',
    agent: 'Agent',
  };

  return (
    <div style={styles.message(message.role)}>
      <div style={styles.messageContent(message.role)}>
        {message.content}
      </div>
      <div style={styles.messageMeta}>
        <span>{roleLabels[message.role]}</span>
        {message.encoding_applied && (
          <span style={{ color: CHENU_COLORS.jungleEmerald }}>
            🗜️ -{message.encoding_savings}%
          </span>
        )}
        <span>{message.tokens_used} tokens</span>
        <span>{new Date(message.created_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

// ============================================================
// DECISION COMPONENT
// ============================================================

interface DecisionCardProps {
  decision: Decision;
  onDecide: (optionId: string) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onDecide }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (decision.status === 'decided') {
    return (
      <div style={styles.decisionCard}>
        <div style={styles.decisionTitle}>
          ✅ Decision Made: {decision.title}
        </div>
        <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>
          Selected: {decision.selected_option?.label}
        </p>
        {decision.rationale && (
          <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '13px', marginTop: '8px' }}>
            Rationale: {decision.rationale}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={styles.decisionCard}>
      <div style={styles.decisionTitle}>
        ⏳ Decision Required: {decision.title}
      </div>
      {decision.description && (
        <p style={{ color: CHENU_COLORS.softSand, fontSize: '13px', marginBottom: '12px' }}>
          {decision.description}
        </p>
      )}
      <div>
        {decision.options.map((option) => (
          <button
            key={option.id}
            style={styles.optionButton(selectedOption === option.id)}
            onClick={() => setSelectedOption(option.id)}
          >
            {option.label}
            {option.description && (
              <span style={{ display: 'block', fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
      {selectedOption && (
        <button
          style={{ ...styles.sendButton, marginTop: '12px', width: '100%' }}
          onClick={() => onDecide(selectedOption)}
        >
          Confirm Decision
        </button>
      )}
    </div>
  );
};

// ============================================================
// THREAD PANEL
// ============================================================

interface ThreadPanelProps {
  thread: Thread;
  messages: Message[];
  decisions?: Decision[];
  onSendMessage: (content: string, applyEncoding: boolean) => Promise<void>;
  onDecide?: (decisionId: string, optionId: string) => Promise<void>;
  onClose?: () => void;
}

const ThreadPanel: React.FC<ThreadPanelProps> = ({
  thread,
  messages,
  decisions = [],
  onSendMessage,
  onDecide,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [applyEncoding, setApplyEncoding] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(input.trim(), applyEncoding);
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const typeColors: Record<string, string> = {
    discussion: CHENU_COLORS.cenoteTurquoise,
    decision: CHENU_COLORS.sacredGold,
    task: CHENU_COLORS.earthEmber,
    review: CHENU_COLORS.jungleEmerald,
    brainstorm: '#9b59b6',
    meeting: '#3498db',
  };

  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const usagePercent = Math.round((thread.tokens_used / thread.token_budget) * 100);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.badge(typeColors[thread.thread_type] || CHENU_COLORS.ancientStone)}>
            {thread.thread_type}
          </span>
          <span>{thread.title}</span>
        </div>
        <div style={styles.tokenInfo}>
          <span>
            {thread.tokens_used.toLocaleString()} / {thread.token_budget.toLocaleString()} tokens
          </span>
          <div style={{ 
            width: '60px', 
            height: '6px', 
            backgroundColor: '#0a0a0b', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${usagePercent}%`, 
              height: '100%', 
              backgroundColor: usagePercent > 80 ? CHENU_COLORS.earthEmber : CHENU_COLORS.sacredGold,
              borderRadius: '3px'
            }} />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: CHENU_COLORS.ancientStone, 
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Pending Decisions */}
      {pendingDecisions.length > 0 && (
        <div style={{ padding: '16px', borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22` }}>
          {pendingDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              onDecide={(optionId) => onDecide?.(decision.id, optionId)}
            />
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: CHENU_COLORS.ancientStone, padding: '40px' }}>
            <p style={{ fontSize: '32px', marginBottom: '16px' }}>💬</p>
            <p>Start a conversation in this thread.</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Thread type: {thread.thread_type} • Encoding: {thread.encoding_level}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{ ...styles.input, minHeight: '44px', maxHeight: '120px' }}
            disabled={isSending}
          />
          <div style={styles.encodingToggle}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={applyEncoding}
                onChange={(e) => setApplyEncoding(e.target.checked)}
                style={{ accentColor: CHENU_COLORS.sacredGold }}
              />
              Apply encoding ({thread.encoding_level})
            </label>
          </div>
        </div>
        <button
          onClick={handleSend}
          style={{ 
            ...styles.sendButton, 
            alignSelf: 'flex-start',
            opacity: isSending ? 0.6 : 1,
          }}
          disabled={isSending || !input.trim()}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// THREAD LIST ITEM
// ============================================================

interface ThreadListItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

export const ThreadListItem: React.FC<ThreadListItemProps> = ({ thread, isActive, onClick }) => {
  const typeColors: Record<string, string> = {
    discussion: CHENU_COLORS.cenoteTurquoise,
    decision: CHENU_COLORS.sacredGold,
    task: CHENU_COLORS.earthEmber,
    review: CHENU_COLORS.jungleEmerald,
    brainstorm: '#9b59b6',
    meeting: '#3498db',
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        backgroundColor: isActive ? CHENU_COLORS.sacredGold + '11' : '#0a0a0b',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '8px',
        borderLeft: `3px solid ${isActive ? CHENU_COLORS.sacredGold : 'transparent'}`,
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={styles.badge(typeColors[thread.thread_type] || CHENU_COLORS.ancientStone)}>
          {thread.thread_type}
        </span>
        <span style={{ 
          fontSize: '11px', 
          color: thread.status === 'active' ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone 
        }}>
          {thread.status}
        </span>
      </div>
      <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px', marginBottom: '4px' }}>
        {thread.title}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
          {thread.tokens_used.toLocaleString()} / {thread.token_budget.toLocaleString()} tokens
        </span>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
          {new Date(thread.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// CREATE THREAD FORM
// ============================================================

interface CreateThreadFormProps {
  onSubmit: (data: { title: string; description?: string; thread_type: string; encoding_level: EncodingLevel; token_budget: number }) => Promise<void>;
  onCancel: () => void;
}

export const CreateThreadForm: React.FC<CreateThreadFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threadType, setThreadType] = useState<string>('discussion');
  const [encodingLevel, setEncodingLevel] = useState<EncodingLevel>('standard');
  const [tokenBudget, setTokenBudget] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        thread_type: threadType,
        encoding_level: encodingLevel,
        token_budget: tokenBudget,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h3 style={{ color: CHENU_COLORS.softSand, marginBottom: '20px' }}>New Thread (.chenu)</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          placeholder="What is this thread about?"
          required
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, minHeight: '80px' }}
          placeholder="Optional context..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
            Type
          </label>
          <select
            value={threadType}
            onChange={(e) => setThreadType(e.target.value)}
            style={styles.input}
          >
            <option value="discussion">Discussion</option>
            <option value="task">Task</option>
            <option value="decision">Decision</option>
            <option value="brainstorm">Brainstorm</option>
            <option value="review">Review</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
            Encoding
          </label>
          <select
            value={encodingLevel}
            onChange={(e) => setEncodingLevel(e.target.value as EncodingLevel)}
            style={styles.input}
          >
            <option value="none">None</option>
            <option value="light">Light (~10%)</option>
            <option value="standard">Standard (~25%)</option>
            <option value="aggressive">Aggressive (~40%)</option>
            <option value="maximum">Maximum (~50%)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
          Token Budget: {tokenBudget.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={tokenBudget}
          onChange={(e) => setTokenBudget(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: CHENU_COLORS.sacredGold }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            backgroundColor: 'transparent',
            color: CHENU_COLORS.softSand,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          style={{
            ...styles.sendButton,
            flex: 1,
            opacity: isSubmitting || !title.trim() ? 0.6 : 1,
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Thread'}
        </button>
      </div>
    </form>
  );
};

export default ThreadPanel;
