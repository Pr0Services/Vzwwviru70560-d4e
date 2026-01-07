/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ — NOVA CHAT (Updated)                                   ║
 * ║                                                                              ║
 * ║              Using new hooks and Constitution-compliant stores               ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNova, useNovaAnalysis } from '../../stores/nova.store';
import { useCheckpoint, useDepthSuggestion } from '../../stores/governanceStore.constitution';
import { CheckpointModal } from '../governance/CheckpointModal';
import DepthSuggestion from '../governance/DepthSuggestion';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface NovaChatProps {
  /** Initial sphere context */
  sphereId?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Show analysis features */
  showAnalysis?: boolean;
  /** Custom class name */
  className?: string;
  /** On message sent callback */
  onMessageSent?: (message: string) => void;
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#1E1F22',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(216, 178, 106, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(216, 178, 106, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  headerTitle: {
    color: '#D8B26A',
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
  },
  headerSubtitle: {
    color: '#8D8371',
    fontSize: '12px',
    margin: '2px 0 0 0',
  },
  headerStatus: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3F7249',
  },
  statusText: {
    color: '#8D8371',
    fontSize: '12px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
    lineHeight: 1.5,
  },
  userMessage: {
    alignSelf: 'flex-end' as const,
    backgroundColor: 'rgba(216, 178, 106, 0.15)',
    color: '#E9E4D6',
  },
  novaMessage: {
    alignSelf: 'flex-start' as const,
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    color: '#E9E4D6',
  },
  timestamp: {
    fontSize: '11px',
    color: '#8D8371',
    marginTop: '4px',
  },
  inputContainer: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(216, 178, 106, 0.1)',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(141, 131, 113, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#E9E4D6',
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
    minHeight: '44px',
    maxHeight: '120px',
  },
  inputFocused: {
    borderColor: '#D8B26A',
  },
  sendButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3F7249',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    color: '#D8B26A',
    fontSize: '18px',
    fontWeight: 500,
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#8D8371',
    fontSize: '14px',
    margin: 0,
    maxWidth: '300px',
    lineHeight: 1.5,
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '4px',
  },
  suggestionChip: {
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: 'rgba(62, 180, 162, 0.15)',
    color: '#3EB4A2',
    fontSize: '12px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  },
  processing: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#8D8371',
    fontSize: '13px',
    padding: '8px 0',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(141, 131, 113, 0.3)',
    borderTopColor: '#3EB4A2',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export const NovaChat: React.FC<NovaChatProps> = ({
  sphereId,
  placeholder = 'Pose une question à Nova...',
  showAnalysis = true,
  className,
  onMessageSent,
}) => {
  // Hooks
  const { messages, mode, isProcessing, isOnline, sendMessage, setMode } = useNova();
  const { depthSuggestion } = useNovaAnalysis();
  const { isActive: hasCheckpoint } = useCheckpoint();
  const { isAvailable: hasDepthSuggestion } = useDepthSuggestion();
  
  // Local state
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send
  const handleSend = useCallback(async () => {
    if (!input.trim() || isProcessing) return;
    
    const message = input.trim();
    setInput('');
    
    await sendMessage(message, { activeSphere: sphereId });
    
    if (onMessageSent) {
      onMessageSent(message);
    }
  }, [input, isProcessing, sendMessage, sphereId, onMessageSent]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div style={styles.container} className={className}>
      {/* Keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>✨</div>
        <div>
          <h3 style={styles.headerTitle}>Nova</h3>
          <p style={styles.headerSubtitle}>System Intelligence • L0</p>
        </div>
        <div style={styles.headerStatus}>
          <div
            style={{
              ...styles.statusDot,
              backgroundColor: isOnline ? '#3F7249' : '#7A593A',
            }}
          />
          <span style={styles.statusText}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🌟</div>
            <h4 style={styles.emptyTitle}>Bienvenue!</h4>
            <p style={styles.emptyText}>
              Je suis Nova, l'intelligence système de CHE·NU.
              Comment puis-je t'aider aujourd'hui?
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  style={{
                    ...styles.message,
                    ...(msg.role === 'user' ? styles.userMessage : styles.novaMessage),
                  }}
                >
                  {msg.content}
                </div>
                <div
                  style={{
                    ...styles.timestamp,
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}
                >
                  {formatTime(msg.timestamp)}
                </div>
                
                {/* Suggestions from Nova */}
                {msg.role === 'nova' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={styles.suggestions}>
                    {msg.suggestions.map((s) => (
                      <button
                        key={s.id}
                        style={styles.suggestionChip}
                        onClick={() => handleSuggestionClick(s.text)}
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div style={styles.processing}>
                <div style={styles.spinner} />
                <span>Nova réfléchit...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Depth Suggestion (LAW #3 compliant) */}
      {showAnalysis && hasDepthSuggestion && (
        <DepthSuggestion
          onDeepen={() => {
            // Depth suggestion will trigger checkpoint if needed
          }}
        />
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isProcessing}
            rows={1}
            style={{
              ...styles.input,
              ...(isFocused ? styles.inputFocused : {}),
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          style={{
            ...styles.sendButton,
            ...(!input.trim() || isProcessing ? styles.sendButtonDisabled : {}),
          }}
        >
          {isProcessing ? (
            <>
              <div style={{ ...styles.spinner, width: '14px', height: '14px' }} />
              Envoi...
            </>
          ) : (
            <>
              <span>↑</span>
              Envoyer
            </>
          )}
        </button>
      </div>

      {/* Checkpoint Modal (Constitution-compliant) */}
      <CheckpointModal />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export default NovaChat;
