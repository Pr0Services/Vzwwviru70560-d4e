/**
 * CHE·NU™ - THREAD VIEW COMPONENT
 * 
 * Threads (.chenu) are FIRST-CLASS OBJECTS
 * This component provides the complete thread interface
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Thread, ThreadMessage, useThreadStore } from '../../stores/thread.store';
import { useTokenStore } from '../../stores/token.store';
import { SPHERES, SphereId } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// THREAD HEADER
// ═══════════════════════════════════════════════════════════════

interface ThreadHeaderProps {
  thread: Thread;
  onClose: () => void;
  onSettings: () => void;
}

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread, onClose, onSettings }) => {
  const sphere = SPHERES[thread.sphereId];
  const tokenUsage = useThreadStore((state) => state.getTokenUsage(thread.id));
  const usagePercent = (tokenUsage.used / tokenUsage.budget) * 100;

  return (
    <header className="thread-header">
      <div className="thread-info">
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <div className="thread-title-section">
          <h1>{thread.title}</h1>
          <div className="thread-meta">
            <span className="sphere-badge" style={{ color: sphere.color }}>
              {sphere.icon} {sphere.name}
            </span>
            <span className="status-badge" data-status={thread.status}>
              {thread.status}
            </span>
            <span className="encoding-badge">
              📦 {thread.encodingMode}
            </span>
          </div>
        </div>
      </div>

      <div className="thread-budget">
        <div className="budget-bar">
          <div 
            className="budget-fill" 
            style={{ 
              width: `${Math.min(usagePercent, 100)}%`,
              backgroundColor: usagePercent > 80 ? '#e74c3c' : '#3F7249',
            }} 
          />
        </div>
        <span className="budget-text">
          {tokenUsage.used.toLocaleString()} / {tokenUsage.budget.toLocaleString()} tokens
        </span>
      </div>

      <div className="thread-actions">
        <button className="action-btn" title="Settings" onClick={onSettings}>
          ⚙️
        </button>
        <button className="action-btn" title="Archive">
          📁
        </button>
        <button className="action-btn" title="Share">
          🔗
        </button>
      </div>

      <style>{`
        .thread-header {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 16px 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .thread-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .back-btn {
          background: transparent;
          border: none;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .thread-title-section h1 {
          font-size: 18px;
          color: #fff;
          margin: 0 0 4px;
        }

        .thread-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
        }

        .sphere-badge {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: #888;
          text-transform: capitalize;
        }

        .status-badge[data-status="active"] {
          background: rgba(63, 114, 73, 0.2);
          color: #3F7249;
        }

        .encoding-badge {
          color: #666;
        }

        .thread-budget {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 200px;
        }

        .budget-bar {
          height: 6px;
          background: #222;
          border-radius: 3px;
          overflow: hidden;
        }

        .budget-fill {
          height: 100%;
          transition: width 0.3s;
        }

        .budget-text {
          font-size: 11px;
          color: #666;
          text-align: right;
        }

        .thread-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #444;
        }
      `}</style>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════
// MESSAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface MessageProps {
  message: ThreadMessage;
  showTokens?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, showTokens = true }) => {
  const roleStyles = {
    user: { bg: 'rgba(62, 180, 162, 0.15)', border: 'rgba(62, 180, 162, 0.3)', icon: '👤' },
    nova: { bg: 'rgba(216, 178, 106, 0.15)', border: 'rgba(216, 178, 106, 0.3)', icon: '✧' },
    agent: { bg: 'rgba(63, 114, 73, 0.15)', border: 'rgba(63, 114, 73, 0.3)', icon: '🤖' },
    system: { bg: 'rgba(141, 131, 113, 0.15)', border: 'rgba(141, 131, 113, 0.3)', icon: '⚙️' },
  };

  const style = roleStyles[message.role];
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`message message-${message.role}`}>
      <div className="message-avatar" style={{ backgroundColor: style.bg }}>
        {style.icon}
      </div>
      <div className="message-content" style={{ backgroundColor: style.bg, borderColor: style.border }}>
        <div className="message-header">
          <span className="message-role">{message.role}</span>
          {message.agentId && <span className="message-agent">{message.agentId}</span>}
          <span className="message-time">{time}</span>
          {showTokens && message.tokensUsed > 0 && (
            <span className="message-tokens">{message.tokensUsed} tokens</span>
          )}
        </div>
        <div className="message-body">
          {message.content}
        </div>
        {message.encodedContent && (
          <details className="encoded-content">
            <summary>📦 View encoded</summary>
            <pre>{message.encodedContent}</pre>
          </details>
        )}
      </div>

      <style>{`
        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid;
        }

        .message-user .message-content {
          border-top-right-radius: 4px;
        }

        .message-nova .message-content,
        .message-agent .message-content,
        .message-system .message-content {
          border-top-left-radius: 4px;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 11px;
        }

        .message-role {
          font-weight: 600;
          color: #fff;
          text-transform: capitalize;
        }

        .message-agent {
          color: #3F7249;
        }

        .message-time {
          color: #666;
        }

        .message-tokens {
          color: #D8B26A;
          margin-left: auto;
        }

        .message-body {
          color: #ddd;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .encoded-content {
          margin-top: 12px;
          font-size: 11px;
        }

        .encoded-content summary {
          color: #888;
          cursor: pointer;
        }

        .encoded-content pre {
          margin-top: 8px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 6px;
          overflow-x: auto;
          color: #3EB4A2;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// INPUT COMPOSER
// ═══════════════════════════════════════════════════════════════

interface InputComposerProps {
  threadId: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}

const InputComposer: React.FC<InputComposerProps> = ({ threadId, onSend, disabled }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  return (
    <div className="input-composer">
      <div className="composer-toolbar">
        <button className="toolbar-btn" title="Attach file">📎</button>
        <button className="toolbar-btn" title="Code block">💻</button>
        <button className="toolbar-btn" title="Encoding mode">📦</button>
      </div>
      
      <div className="composer-main">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
        />
        <button 
          className="send-btn" 
          onClick={handleSubmit}
          disabled={!content.trim() || disabled}
        >
          →
        </button>
      </div>

      <div className="composer-hints">
        <span>Nova is ready</span>
        <span className="hint-separator">•</span>
        <span>Encoding: Standard</span>
      </div>

      <style>{`
        .input-composer {
          padding: 16px 24px;
          background: #111;
          border-top: 1px solid #222;
        }

        .composer-toolbar {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .toolbar-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #444;
        }

        .composer-main {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .composer-main textarea {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 14px;
          resize: none;
          outline: none;
          min-height: 50px;
          max-height: 200px;
          font-family: inherit;
        }

        .composer-main textarea:focus {
          border-color: #D8B26A;
        }

        .composer-main textarea::placeholder {
          color: #555;
        }

        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          color: #1a1a1a;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .composer-hints {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 11px;
          color: #555;
        }

        .hint-separator {
          color: #333;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN THREAD VIEW
// ═══════════════════════════════════════════════════════════════

interface ThreadViewProps {
  threadId: string;
  onClose: () => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({ threadId, onClose }) => {
  const thread = useThreadStore((state) => state.threads[threadId]);
  const addMessage = useThreadStore((state) => state.addMessage);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length]);

  // Handle send
  const handleSend = useCallback((content: string) => {
    // Add user message
    addMessage(threadId, {
      role: 'user',
      content,
      tokensUsed: Math.ceil(content.length / 4), // Rough estimate
    });

    // Simulate Nova response
    setTimeout(() => {
      addMessage(threadId, {
        role: 'nova',
        content: `I understand you're asking about "${content.substring(0, 50)}...". Let me help you with that within the governed execution pipeline.`,
        tokensUsed: 150,
        encodedContent: `[ENCODED] intent: ${content.substring(0, 30)}...`,
      });
    }, 1000);
  }, [threadId, addMessage]);

  if (!thread) {
    return (
      <div className="thread-not-found">
        <h2>Thread not found</h2>
        <button onClick={onClose}>Go back</button>
      </div>
    );
  }

  return (
    <div className="thread-view">
      <ThreadHeader 
        thread={thread} 
        onClose={onClose} 
        onSettings={() => setShowSettings(true)} 
      />

      <div className="thread-messages">
        {thread.messages.length === 0 ? (
          <div className="empty-thread">
            <span className="empty-icon">🧵</span>
            <h3>New Thread</h3>
            <p>Start a conversation to begin this thread</p>
          </div>
        ) : (
          thread.messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <InputComposer 
        threadId={threadId} 
        onSend={handleSend}
      />

      <style>{`
        .thread-view {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0a0a0a;
        }

        .thread-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .empty-thread {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #666;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-thread h3 {
          color: #888;
          margin: 0 0 8px;
        }

        .empty-thread p {
          margin: 0;
          font-size: 14px;
        }

        .thread-not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 16px;
        }

        .thread-not-found h2 {
          color: #888;
        }

        .thread-not-found button {
          padding: 12px 24px;
          background: #D8B26A;
          border: none;
          border-radius: 8px;
          color: #1a1a1a;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ThreadView;
