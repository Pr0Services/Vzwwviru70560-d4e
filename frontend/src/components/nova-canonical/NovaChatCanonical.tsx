/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — NOVA CHAT CANONICAL                         ║
 * ║                    Interface de Chat Nova Gouvernée                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Interface de conversation avec Nova qui:
 * - Affiche le pipeline d'exécution
 * - Montre les checkpoints BLOQUANTS
 * - Visualise l'encodage avant exécution
 * - Affiche les résultats après exécution
 *
 * "Nova est l'intelligence système — JAMAIS un agent hireable"
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNovaStore } from '../../stores/nova.store';
import { useUIStore } from '../../stores/ui.store';
import { NovaPipelineCanonical, ExecutionOutput } from './NovaPipelineCanonical';
import { CheckpointModalCanonical } from './CheckpointModalCanonical';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: string;
  pipelineId?: string;
  encoding?: {
    intent: string;
    actions: { type: string; description: string }[];
  };
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface NovaChatCanonicalProps {
  /** ID de la sphère courante */
  sphereId?: string;
  /** ID du thread courant */
  threadId?: string;
  /** Mode compact */
  compact?: boolean;
  /** Placeholder pour l'input */
  placeholder?: string;
  /** Callback quand un message est envoyé */
  onSendMessage?: (message: string) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#1E1F22',
    borderRadius: '12px',
    border: '1px solid #2F4C39',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #2F4C39',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3EB4A2 0%, #D8B26A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E9E4D6',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: '#3EB4A2',
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#8D8371',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#27AE60',
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    gap: '12px',
  },
  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  userAvatar: {
    backgroundColor: 'rgba(141, 131, 113, 0.2)',
  },
  novaAvatar: {
    background: 'linear-gradient(135deg, #3EB4A2 0%, #D8B26A 100%)',
  },
  systemAvatar: {
    backgroundColor: 'rgba(216, 178, 106, 0.2)',
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  messageName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#E9E4D6',
  },
  messageTime: {
    fontSize: '11px',
    color: '#8D8371',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: 1.5,
    color: '#E9E4D6',
  },
  userMessage: {
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    padding: '12px 16px',
    borderRadius: '12px 12px 4px 12px',
  },
  novaMessage: {
    backgroundColor: 'rgba(30, 31, 34, 0.5)',
    padding: '12px 16px',
    borderRadius: '4px 12px 12px 12px',
  },
  systemMessage: {
    backgroundColor: 'rgba(216, 178, 106, 0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#D8B26A',
  },
  pipelineContainer: {
    marginTop: '12px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  inputArea: {
    padding: '16px 20px',
    borderTop: '1px solid #2F4C39',
    backgroundColor: 'rgba(30, 31, 34, 0.5)',
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textareaWrapper: {
    flex: 1,
    position: 'relative' as const,
  },
  textarea: {
    width: '100%',
    minHeight: '44px',
    maxHeight: '120px',
    padding: '12px 16px',
    backgroundColor: '#1E1F22',
    border: '1px solid #2F4C39',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E9E4D6',
    resize: 'none' as const,
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    backgroundColor: '#3EB4A2',
    border: 'none',
    color: '#1E1F22',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  sendButtonDisabled: {
    backgroundColor: '#2F4C39',
    cursor: 'not-allowed',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3EB4A2',
    animation: 'typingBounce 1.4s infinite ease-in-out both',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: '#8D8371',
    textAlign: 'center' as const,
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '48px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#E9E4D6',
  },
  emptySubtitle: {
    fontSize: '14px',
    maxWidth: '300px',
    lineHeight: 1.5,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaChatCanonical: React.FC<NovaChatCanonicalProps> = ({
  sphereId,
  threadId,
  compact = false,
  placeholder = 'Demande quelque chose à Nova...',
  onSendMessage,
  className,
}) => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Stores
  const { addToast } = useUIStore();
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);
  
  // Send message
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    
    const pipelineId = `pipeline-${Date.now()}`;
    
    const novaMessage: ChatMessage = {
      id: `msg-nova-${Date.now()}`,
      role: 'nova',
      content: '',
      timestamp: new Date().toISOString(),
      pipelineId,
      status: 'processing',
    };
    
    setMessages(prev => [...prev, userMessage, novaMessage]);
    setInputValue('');
    setIsProcessing(true);
    setActivePipelineId(pipelineId);
    
    onSendMessage?.(inputValue.trim());
  }, [inputValue, isProcessing, onSendMessage]);
  
  // Handle pipeline completion
  const handlePipelineComplete = useCallback((output: ExecutionOutput) => {
    setIsProcessing(false);
    setActivePipelineId(null);
    
    setMessages(prev => prev.map(msg => 
      msg.pipelineId === activePipelineId
        ? {
            ...msg,
            content: output.status === 'success' 
              ? 'Exécution terminée avec succès. Les résultats sont affichés ci-dessus.'
              : 'L\'exécution a rencontré des problèmes.',
            status: output.status === 'success' ? 'completed' : 'failed',
          }
        : msg
    ));
  }, [activePipelineId]);
  
  // Handle pipeline error
  const handlePipelineError = useCallback((error: string) => {
    setIsProcessing(false);
    setActivePipelineId(null);
    
    setMessages(prev => prev.map(msg => 
      msg.pipelineId === activePipelineId
        ? {
            ...msg,
            content: `Erreur: ${error}`,
            status: 'failed',
          }
        : msg
    ));
  }, [activePipelineId]);
  
  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Animation keyframes */}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
      
      <div style={styles.container} className={className}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerAvatar}>🌟</div>
          <div style={styles.headerInfo}>
            <div style={styles.headerTitle}>Nova</div>
            <div style={styles.headerSubtitle}>Intelligence Système CHE·NU</div>
          </div>
          <div style={styles.headerStatus}>
            <div style={styles.statusDot} />
            <span>En ligne</span>
          </div>
        </div>
        
        {/* Messages */}
        <div style={styles.messages}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🌟</div>
              <div style={styles.emptyTitle}>Bonjour, je suis Nova</div>
              <div style={styles.emptySubtitle}>
                Je suis l'intelligence système de CHE·NU. Pose-moi une question ou demande-moi d'effectuer une action.
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.role !== 'user' && (
                  <div 
                    style={{
                      ...styles.messageAvatar,
                      ...(message.role === 'nova' ? styles.novaAvatar : styles.systemAvatar),
                    }}
                  >
                    {message.role === 'nova' ? '🌟' : '⚙️'}
                  </div>
                )}
                
                <div style={styles.messageContent}>
                  {message.role !== 'system' && (
                    <div style={styles.messageHeader}>
                      <span style={styles.messageName}>
                        {message.role === 'user' ? 'Vous' : 'Nova'}
                      </span>
                      <span style={styles.messageTime}>{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  
                  {message.role === 'system' ? (
                    <div style={styles.systemMessage}>{message.content}</div>
                  ) : (
                    <div 
                      style={{
                        ...(message.role === 'user' ? styles.userMessage : styles.novaMessage),
                      }}
                    >
                      {message.status === 'processing' && !message.content ? (
                        <div style={styles.typingIndicator}>
                          <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
                          <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                          <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
                        </div>
                      ) : (
                        <div style={styles.messageText}>{message.content}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Pipeline for Nova messages */}
                  {message.pipelineId && message.role === 'nova' && (
                    <div style={styles.pipelineContainer}>
                      <NovaPipelineCanonical
                        requestId={message.pipelineId}
                        userInput={messages.find(m => 
                          m.role === 'user' && 
                          new Date(m.timestamp) < new Date(message.timestamp)
                        )?.content}
                        onComplete={handlePipelineComplete}
                        onError={handlePipelineError}
                        compact={compact}
                      />
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div 
                    style={{
                      ...styles.messageAvatar,
                      ...styles.userAvatar,
                    }}
                  >
                    👤
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <div style={styles.textareaWrapper}>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isProcessing}
                rows={1}
              />
            </div>
            <button
              style={{
                ...styles.sendButton,
                ...((!inputValue.trim() || isProcessing) ? styles.sendButtonDisabled : {}),
              }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              title="Envoyer (Enter)"
            >
              {isProcessing ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NovaChatCanonical;
