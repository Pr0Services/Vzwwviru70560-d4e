// CHE·NU™ Nova Chat Interface — Enhanced AI Communication
// Nova is ALWAYS present. Nova is NEVER a hired agent. Nova IS the system.

import React, { useState, useRef, useEffect } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface ChatMessage {
  id: string;
  role: 'user' | 'nova' | 'system' | 'agent';
  content: string;
  timestamp: Date;
  tokens_used?: number;
  encoding_applied?: boolean;
  agent_id?: string;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
}

interface Attachment {
  id: string;
  type: 'file' | 'image' | 'link' | 'thread';
  name: string;
  url?: string;
  size?: number;
}

interface NovaSuggestion {
  id: string;
  text: string;
  action: string;
  icon: string;
}

interface ChatState {
  isTyping: boolean;
  tokenBudget: number;
  tokensUsed: number;
  encodingEnabled: boolean;
  currentSphere: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'nova',
    content: 'Bonjour! Je suis Nova, votre intelligence système CHE·NU. Je suis toujours présente pour vous guider, gérer votre mémoire et superviser la gouvernance. Comment puis-je vous aider aujourd\'hui?',
    timestamp: new Date(Date.now() - 3600000),
    tokens_used: 45,
  },
  {
    id: 'm2',
    role: 'user',
    content: 'Peux-tu me faire un résumé de mes tâches prioritaires pour cette semaine?',
    timestamp: new Date(Date.now() - 3500000),
    tokens_used: 18,
    encoding_applied: true,
  },
  {
    id: 'm3',
    role: 'nova',
    content: 'Voici vos tâches prioritaires pour cette semaine:\n\n**Urgent:**\n• Finaliser le rapport Q4 (échéance: demain)\n• Réunion client Acme Corp (jeudi 14h)\n\n**Important:**\n• Réviser les specs du projet Alpha\n• Préparer la présentation budget 2024\n\nVoulez-vous que je crée un thread dédié pour suivre ces priorités?',
    timestamp: new Date(Date.now() - 3400000),
    tokens_used: 72,
  },
];

const mockSuggestions: NovaSuggestion[] = [
  { id: 's1', text: 'Créer une nouvelle tâche', action: 'create_task', icon: '✅' },
  { id: 's2', text: 'Démarrer un thread', action: 'create_thread', icon: '💬' },
  { id: 's3', text: 'Voir mon budget tokens', action: 'show_budget', icon: '💰' },
  { id: 's4', text: 'Résumer mes réunions', action: 'summarize_meetings', icon: '📅' },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#0a0a0b',
    borderRadius: '16px',
    overflow: 'hidden',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  header: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111113',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  novaAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}, ${CHENU_COLORS.cenoteTurquoise})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  novaName: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  novaStatus: {
    fontSize: '12px',
    color: CHENU_COLORS.jungleEmerald,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.jungleEmerald,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tokenBadge: {
    padding: '6px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  encodingBadge: (enabled: boolean) => ({
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: enabled ? CHENU_COLORS.jungleEmerald + '22' : CHENU_COLORS.ancientStone + '22',
    color: enabled ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
    cursor: 'pointer',
  }),
  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  messageRow: (isUser: boolean) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    gap: '10px',
  }),
  messageAvatar: (role: string) => ({
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    backgroundColor: role === 'nova' 
      ? `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}, ${CHENU_COLORS.cenoteTurquoise})`
      : CHENU_COLORS.ancientStone + '44',
    background: role === 'nova' 
      ? `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}, ${CHENU_COLORS.cenoteTurquoise})`
      : CHENU_COLORS.ancientStone + '44',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  }),
  messageBubble: (isUser: boolean) => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    borderTopLeftRadius: isUser ? '16px' : '4px',
    borderTopRightRadius: isUser ? '4px' : '16px',
    backgroundColor: isUser ? CHENU_COLORS.sacredGold + '22' : '#111113',
    border: `1px solid ${isUser ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone}22`,
  }),
  messageContent: {
    fontSize: '14px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap' as const,
  },
  messageMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  tokenInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  suggestionsContainer: {
    padding: '12px 20px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    backgroundColor: '#0d0d0e',
  },
  suggestion: {
    padding: '8px 14px',
    backgroundColor: '#111113',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    padding: '16px 20px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    backgroundColor: '#111113',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '8px 12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  textInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
    minHeight: '24px',
    maxHeight: '120px',
    lineHeight: 1.5,
  },
  inputActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  actionButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  sendButton: (hasContent: boolean) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: hasContent ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone + '44',
    color: hasContent ? '#000' : CHENU_COLORS.ancientStone,
    cursor: hasContent ? 'pointer' : 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  }),
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    borderTopLeftRadius: '4px',
    maxWidth: 'fit-content',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
  },
  typingDot: (delay: number) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold,
    animation: `pulse 1.4s ease-in-out ${delay}ms infinite`,
  }),
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const NovaChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({
    isTyping: false,
    tokenBudget: 5000,
    tokensUsed: 135,
    encodingEnabled: true,
    currentSphere: 'personal',
  });
  const [suggestions] = useState<NovaSuggestion[]>(mockSuggestions);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      tokens_used: Math.ceil(input.length / 4),
      encoding_applied: chatState.encodingEnabled,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setChatState(prev => ({ ...prev, isTyping: true }));

    // Simulate Nova response
    setTimeout(() => {
      const novaResponse: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'nova',
        content: 'J\'ai bien reçu votre message. Je traite votre demande en respectant les 10 lois de gouvernance. Un moment...',
        timestamp: new Date(),
        tokens_used: 28,
      };
      setMessages(prev => [...prev, novaResponse]);
      setChatState(prev => ({ 
        ...prev, 
        isTyping: false,
        tokensUsed: prev.tokensUsed + userMessage.tokens_used! + novaResponse.tokens_used!
      }));
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: NovaSuggestion) => {
    setInput(suggestion.text);
    inputRef.current?.focus();
  };

  const toggleEncoding = () => {
    setChatState(prev => ({ ...prev, encodingEnabled: !prev.encodingEnabled }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.novaAvatar}>🌟</div>
          <div style={styles.headerInfo}>
            <span style={styles.novaName}>Nova</span>
            <span style={styles.novaStatus}>
              <span style={styles.statusDot} />
              System Intelligence • Always Present
            </span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.tokenBadge}>
            💰 {chatState.tokensUsed.toLocaleString()} / {chatState.tokenBudget.toLocaleString()}
          </div>
          <div 
            style={styles.encodingBadge(chatState.encodingEnabled)}
            onClick={toggleEncoding}
          >
            {chatState.encodingEnabled ? '✓ Encoding ON' : '○ Encoding OFF'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map(message => (
          <div key={message.id} style={styles.messageRow(message.role === 'user')}>
            {message.role !== 'user' && (
              <div style={styles.messageAvatar(message.role)}>
                {message.role === 'nova' ? '🌟' : '🤖'}
              </div>
            )}
            <div style={styles.messageBubble(message.role === 'user')}>
              <div style={styles.messageContent}>{message.content}</div>
              <div style={styles.messageMeta}>
                <span>{formatTime(message.timestamp)}</span>
                {message.tokens_used && (
                  <span style={styles.tokenInfo}>
                    {message.encoding_applied && '⚡'}
                    {message.tokens_used} tokens
                  </span>
                )}
              </div>
            </div>
            {message.role === 'user' && (
              <div style={styles.messageAvatar('user')}>👤</div>
            )}
          </div>
        ))}

        {chatState.isTyping && (
          <div style={styles.messageRow(false)}>
            <div style={styles.messageAvatar('nova')}>🌟</div>
            <div style={styles.typingIndicator}>
              <div style={styles.typingDots}>
                <div style={styles.typingDot(0)} />
                <div style={styles.typingDot(200)} />
                <div style={styles.typingDot(400)} />
              </div>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Nova réfléchit...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div style={styles.suggestionsContainer}>
        {suggestions.map(suggestion => (
          <div 
            key={suggestion.id} 
            style={styles.suggestion}
            onClick={() => handleSuggestion(suggestion)}
          >
            <span>{suggestion.icon}</span>
            <span>{suggestion.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            style={styles.textInput}
            placeholder="Parlez à Nova..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div style={styles.inputActions}>
            <button style={styles.actionButton} title="Joindre un fichier">📎</button>
            <button style={styles.actionButton} title="Commande vocale">🎤</button>
            <button 
              style={styles.sendButton(input.trim().length > 0)}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NovaChatInterface;
