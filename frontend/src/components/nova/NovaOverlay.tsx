/**
 * CHE·NU™ - NOVA OVERLAY
 * Nova is the SYSTEM intelligence - always present, always accessible
 * This overlay can be summoned from anywhere in the app
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
}

interface NovaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentSphere: string;
  currentSection: string;
}

// ═══════════════════════════════════════════════════════════════
// NOVA OVERLAY COMPONENT
// ═══════════════════════════════════════════════════════════════

export const NovaOverlay: React.FC<NovaOverlayProps> = ({
  isOpen,
  onClose,
  currentSphere,
  currentSection,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nova',
      content: `Hello! I'm Nova, your system intelligence. I see you're in ${currentSphere} / ${currentSection}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle would be handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate Nova response (would be API call in production)
    setTimeout(() => {
      const novaResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: generateNovaResponse(userMessage.content, currentSphere, currentSection),
        timestamp: new Date(),
        tokens: Math.floor(Math.random() * 500) + 100,
      };
      setMessages((prev) => [...prev, novaResponse]);
      setIsThinking(false);
    }, 1000 + Math.random() * 1000);
  }, [input, currentSphere, currentSection]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nova-overlay">
      <div className="nova-backdrop" onClick={onClose} />
      
      <div className="nova-panel">
        {/* Header */}
        <header className="nova-header">
          <div className="nova-identity">
            <div className="nova-avatar">
              <span className="nova-icon">✧</span>
            </div>
            <div className="nova-info">
              <h2 className="nova-name">Nova</h2>
              <span className="nova-role">System Intelligence</span>
            </div>
          </div>
          
          <div className="nova-context">
            <span className="context-badge">{currentSphere}</span>
            <span className="context-separator">/</span>
            <span className="context-section">{currentSection}</span>
          </div>
          
          <button className="nova-close" onClick={onClose}>
            <span>✕</span>
          </button>
        </header>

        {/* Messages */}
        <div className="nova-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`nova-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'nova' ? '✧' : '👤'}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-meta">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.tokens && <span className="token-count">{msg.tokens} tokens</span>}
                </span>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="nova-message nova thinking">
              <div className="message-avatar">✧</div>
              <div className="message-content">
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="nova-input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nova anything... (Enter to send)"
            className="nova-input"
          />
          <button 
            className="nova-send" 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
          >
            <span>→</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="nova-footer">
          <span className="keyboard-hint">
            <kbd>⌘</kbd> + <kbd>K</kbd> to toggle
          </span>
          <span className="governance-badge">Governed Execution Active</span>
        </footer>
      </div>

      <style>{`
        .nova-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nova-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }

        .nova-panel {
          position: relative;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
          border-radius: 16px;
          border: 1px solid rgba(216, 178, 106, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .nova-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .nova-identity {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nova-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D8B26A 0%, #7A593A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nova-icon {
          font-size: 20px;
          color: #1a1a1a;
        }

        .nova-name {
          font-size: 16px;
          font-weight: 600;
          color: #D8B26A;
          margin: 0;
        }

        .nova-role {
          font-size: 11px;
          color: #666;
        }

        .nova-context {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .context-badge {
          background: rgba(216, 178, 106, 0.2);
          color: #D8B26A;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .context-separator {
          color: #444;
        }

        .context-section {
          color: #888;
        }

        .nova-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid #333;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .nova-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .nova-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nova-message {
          display: flex;
          gap: 12px;
          max-width: 90%;
        }

        .nova-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .nova-message.nova .message-avatar {
          background: linear-gradient(135deg, #D8B26A 0%, #7A593A 100%);
          color: #1a1a1a;
        }

        .message-content {
          background: #1f1f1f;
          padding: 12px 16px;
          border-radius: 16px;
          border-top-left-radius: 4px;
        }

        .nova-message.user .message-content {
          background: rgba(62, 180, 162, 0.2);
          border-top-left-radius: 16px;
          border-top-right-radius: 4px;
        }

        .message-content p {
          margin: 0;
          color: #ddd;
          font-size: 14px;
          line-height: 1.5;
        }

        .message-meta {
          display: flex;
          gap: 12px;
          font-size: 10px;
          color: #555;
          margin-top: 6px;
        }

        .token-count {
          color: #D8B26A;
        }

        .thinking-dots {
          display: flex;
          gap: 4px;
        }

        .thinking-dots span {
          width: 8px;
          height: 8px;
          background: #D8B26A;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .nova-input-area {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .nova-input {
          flex: 1;
          background: #1f1f1f;
          border: 1px solid #333;
          border-radius: 24px;
          padding: 12px 20px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .nova-input:focus {
          border-color: #D8B26A;
        }

        .nova-input::placeholder {
          color: #555;
        }

        .nova-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D8B26A 0%, #7A593A 100%);
          border: none;
          color: #1a1a1a;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
        }

        .nova-send:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .nova-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nova-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.4);
          font-size: 11px;
        }

        .keyboard-hint {
          color: #555;
        }

        .keyboard-hint kbd {
          background: #2a2a2a;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: inherit;
        }

        .governance-badge {
          color: #3F7249;
          background: rgba(63, 114, 73, 0.15);
          padding: 4px 10px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function generateNovaResponse(userInput: string, sphere: string, section: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('help')) {
    return `I can help you with anything in ${sphere}. In the ${section} section, you can manage your related data and tasks. What would you like to do?`;
  }
  
  if (input.includes('create') || input.includes('new')) {
    return `To create something new in ${section}, I'll need to verify your token budget and check governance rules. Shall I proceed with the governed execution pipeline?`;
  }
  
  if (input.includes('token') || input.includes('budget')) {
    return `Your current token budget for ${sphere} is being tracked. All AI operations consume tokens based on complexity. Would you like to see your usage breakdown?`;
  }
  
  return `I understand you're asking about "${userInput}" in the context of ${sphere}/${section}. Let me process this through the governed execution pipeline to ensure compliance with all rules. How would you like me to proceed?`;
}

export default NovaOverlay;
