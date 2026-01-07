// CHE·NU™ Nova Panel — System Intelligence Interface
// Nova is the SYSTEM intelligence — always present, never hired

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface NovaMessage {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  suggestions?: string[];
  actions?: NovaAction[];
}

interface NovaAction {
  id: string;
  label: string;
  type: 'navigate' | 'create' | 'search' | 'execute';
  payload: unknown;
}

interface NovaContext {
  sphere: string;
  section: string;
  activeThread?: string;
  recentActions: string[];
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    width: '420px',
    height: '560px',
    backgroundColor: '#0d0d0f',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 100px rgba(62, 180, 162, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    zIndex: 1000,
  },
  
  header: {
    padding: '16px 20px',
    background: `linear-gradient(135deg, ${CHENU_COLORS.cenoteTurquoise}22 0%, transparent 100%)`,
    borderBottom: `1px solid ${CHENU_COLORS.cenoteTurquoise}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  novaAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${CHENU_COLORS.cenoteTurquoise} 0%, ${CHENU_COLORS.jungleEmerald} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  
  titleText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  novaName: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  
  novaStatus: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '20px',
    padding: '4px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  
  contextBar: {
    padding: '10px 16px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}15`,
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  
  contextTag: {
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    color: CHENU_COLORS.ancientStone,
    borderRadius: '12px',
    fontSize: '11px',
  },
  
  messagesArea: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  
  messageWrapper: (role: string) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: role === 'user' ? 'flex-end' : 'flex-start',
    maxWidth: '85%',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  
  messageBubble: (role: string) => ({
    padding: '12px 16px',
    borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    backgroundColor: role === 'user' 
      ? CHENU_COLORS.sacredGold + '22' 
      : role === 'system' 
        ? CHENU_COLORS.ancientStone + '22'
        : '#1a1a1c',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    lineHeight: 1.5,
  }),
  
  messageTime: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
    display: 'flex',
    gap: '8px',
  },
  
  suggestionsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px',
  },
  
  suggestionChip: {
    padding: '6px 12px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '15',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    color: CHENU_COLORS.cenoteTurquoise,
    borderRadius: '16px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginTop: '10px',
  },
  
  actionButton: {
    padding: '8px 14px',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    border: `1px solid ${CHENU_COLORS.jungleEmerald}33`,
    color: CHENU_COLORS.jungleEmerald,
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
  },
  
  inputArea: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}15`,
    backgroundColor: '#0a0a0b',
  },
  
  inputWrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  
  textInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#111113',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
    minHeight: '44px',
    maxHeight: '100px',
    fontFamily: 'inherit',
  },
  
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: '#000',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  
  quickActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },
  
  quickAction: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    color: CHENU_COLORS.ancientStone,
    borderRadius: '16px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    backgroundColor: '#1a1a1c',
    borderRadius: '16px 16px 16px 4px',
    width: 'fit-content',
  },
  
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    animation: 'typing 1.4s infinite ease-in-out',
  },
};

// ============================================================
// NOVA MESSAGE COMPONENT
// ============================================================

interface NovaMessageProps {
  message: NovaMessage;
  onSuggestionClick: (suggestion: string) => void;
  onActionClick: (action: NovaAction) => void;
}

const NovaMessageComponent: React.FC<NovaMessageProps> = ({ message, onSuggestionClick, onActionClick }) => {
  const actionIcons: Record<string, string> = {
    navigate: '🧭',
    create: '➕',
    search: '🔍',
    execute: '⚡',
  };

  return (
    <div style={styles.messageWrapper(message.role)}>
      <div style={styles.messageBubble(message.role)}>
        {message.content}
      </div>
      
      {message.suggestions && message.suggestions.length > 0 && (
        <div style={styles.suggestionsContainer}>
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              style={styles.suggestionChip}
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {message.actions && message.actions.length > 0 && (
        <div style={styles.actionsContainer}>
          {message.actions.map((action) => (
            <button
              key={action.id}
              style={styles.actionButton}
              onClick={() => onActionClick(action)}
            >
              <span>{actionIcons[action.type] || '▶'}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <div style={styles.messageTime}>
        <span>{message.timestamp.toLocaleTimeString()}</span>
        {message.tokens && <span>• {message.tokens} tokens</span>}
      </div>
    </div>
  );
};

// ============================================================
// TYPING INDICATOR
// ============================================================

const TypingIndicator: React.FC = () => (
  <div style={styles.typingIndicator}>
    <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
    <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
    <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
  </div>
);

// ============================================================
// MAIN NOVA PANEL
// ============================================================

interface NovaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: NovaContext;
  onNavigate?: (sphere: string, section: string) => void;
  onCreateThread?: (title: string) => void;
}

const NovaPanel: React.FC<NovaPanelProps> = ({
  isOpen,
  onClose,
  context = { sphere: 'personal', section: 'dashboard', recentActions: [] },
  onNavigate,
  onCreateThread,
}) => {
  const [messages, setMessages] = useState<NovaMessage[]>([
    {
      id: '1',
      role: 'nova',
      content: "Hello! I'm Nova, your CHE·NU system intelligence. I'm here to help you navigate, organize, and govern your digital life. What would you like to do?",
      timestamp: new Date(),
      suggestions: ['Show my dashboard', 'Create a new thread', 'Check token budget'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateNovaResponse = useCallback((userMessage: string): NovaMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple intent detection
    if (lowerMessage.includes('thread') || lowerMessage.includes('conversation')) {
      return {
        id: `nova-${Date.now()}`,
        role: 'nova',
        content: "I can help you create a new thread (.chenu). Threads are persistent conversations with token budgets and encoding rules. What would you like to discuss?",
        timestamp: new Date(),
        tokens: 45,
        actions: [
          { id: 'create-thread', label: 'Create Discussion Thread', type: 'create', payload: { type: 'discussion' } },
          { id: 'create-task', label: 'Create Task Thread', type: 'create', payload: { type: 'task' } },
          { id: 'create-decision', label: 'Create Decision Thread', type: 'create', payload: { type: 'decision' } },
        ],
      };
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('token')) {
      return {
        id: `nova-${Date.now()}`,
        role: 'nova',
        content: "Your current token budget shows 7,550 tokens used out of 10,000 allocated this period. That's 75.5% utilization. Remember, tokens are internal utility credits — not cryptocurrency — representing your intelligence energy usage.",
        timestamp: new Date(),
        tokens: 62,
        actions: [
          { id: 'view-budget', label: 'View Budget Details', type: 'navigate', payload: { section: 'budget' } },
          { id: 'view-history', label: 'View Usage History', type: 'navigate', payload: { section: 'reports' } },
        ],
      };
    }
    
    if (lowerMessage.includes('agent') || lowerMessage.includes('help')) {
      return {
        id: `nova-${Date.now()}`,
        role: 'nova',
        content: "You have 168 agents available organized in 4 levels: L0 (me, Nova), L1 Orchestrators, L2 Specialists, and L3 Support. Agents have costs, scopes, and act only when authorized. Which type of agent would you like to use?",
        timestamp: new Date(),
        tokens: 58,
        suggestions: ['Show available agents', 'Document analyzer', 'Task planner'],
      };
    }
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
      return {
        id: `nova-${Date.now()}`,
        role: 'nova',
        content: `I'm taking you to the ${context.sphere} dashboard. Here you'll see your activity overview, pending decisions, and quick actions.`,
        timestamp: new Date(),
        tokens: 32,
        actions: [
          { id: 'go-dashboard', label: 'Go to Dashboard', type: 'navigate', payload: { section: 'dashboard' } },
        ],
      };
    }
    
    // Default response
    return {
      id: `nova-${Date.now()}`,
      role: 'nova',
      content: `I understand you're asking about "${userMessage}". In the current ${context.sphere} context, I can help you navigate, create threads, manage agents, or check your governance settings. What specific action would you like to take?`,
      timestamp: new Date(),
      tokens: 48,
      suggestions: ['Create thread', 'View agents', 'Check budget', 'Navigate spheres'],
    };
  }, [context]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: NovaMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate Nova thinking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const novaResponse = generateNovaResponse(userMessage.content);
    setIsTyping(false);
    setMessages(prev => [...prev, novaResponse]);
  }, [input, generateNovaResponse]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  const handleActionClick = useCallback((action: NovaAction) => {
    if (action.type === 'navigate' && onNavigate) {
      onNavigate(context.sphere, action.payload.section);
      
      const systemMessage: NovaMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: `Navigating to ${action.payload.section}...`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
    } else if (action.type === 'create' && onCreateThread) {
      onCreateThread(action.payload.type);
    }
  }, [context.sphere, onNavigate, onCreateThread]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <div style={styles.novaAvatar}>✨</div>
          <div style={styles.titleText}>
            <span style={styles.novaName}>Nova</span>
            <span style={styles.novaStatus}>System Intelligence • Always Active</span>
          </div>
        </div>
        <button style={styles.closeButton} onClick={onClose}>×</button>
      </div>

      {/* Context Bar */}
      <div style={styles.contextBar}>
        <span style={styles.contextTag}>🌐 {context.sphere}</span>
        <span style={styles.contextTag}>📍 {context.section}</span>
        {context.activeThread && (
          <span style={{ ...styles.contextTag, backgroundColor: CHENU_COLORS.cenoteTurquoise + '22', color: CHENU_COLORS.cenoteTurquoise }}>
            💬 Active Thread
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={styles.messagesArea}>
        {messages.map((message) => (
          <NovaMessageComponent
            key={message.id}
            message={message}
            onSuggestionClick={handleSuggestionClick}
            onActionClick={handleActionClick}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nova anything..."
            style={styles.textInput}
            rows={1}
          />
          <button
            style={{ ...styles.sendButton, opacity: input.trim() ? 1 : 0.5 }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            ↑
          </button>
        </div>
        
        <div style={styles.quickActions}>
          <button style={styles.quickAction} onClick={() => setInput('Create a new thread')}>
            + Thread
          </button>
          <button style={styles.quickAction} onClick={() => setInput('Show my agents')}>
            🤖 Agents
          </button>
          <button style={styles.quickAction} onClick={() => setInput('Check token budget')}>
            💰 Budget
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// NOVA TRIGGER BUTTON
// ============================================================

interface NovaTriggerProps {
  onClick: () => void;
  hasNotification?: boolean;
}

export const NovaTrigger: React.FC<NovaTriggerProps> = ({ onClick, hasNotification }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      border: 'none',
      background: `linear-gradient(135deg, ${CHENU_COLORS.cenoteTurquoise} 0%, ${CHENU_COLORS.jungleEmerald} 100%)`,
      color: '#fff',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(62, 180, 162, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 999,
    }}
  >
    ✨
    {hasNotification && (
      <span style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '12px',
        height: '12px',
        backgroundColor: CHENU_COLORS.sacredGold,
        borderRadius: '50%',
        border: '2px solid #0d0d0f',
      }} />
    )}
  </button>
);

export default NovaPanel;
