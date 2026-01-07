/**
 * CHE·NU™ - NOVA OVERLAY
 * The always-accessible Nova AI interface
 * Nova is the SYSTEM intelligence, always present
 * 
 * IMPORTANT: Nova is NOT a hired agent
 * Nova handles guidance, memory, governance
 */

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { SphereId, SPHERES } from '../../constants/spheres';
import { useSphere } from '../../contexts/SphereContext';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: Date;
  sphereContext?: SphereId;
}

interface NovaOverlayProps {
  sphereId?: SphereId;
  defaultOpen?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// NOVA OVERLAY COMPONENT
// ═══════════════════════════════════════════════════════════════

export const NovaOverlay: React.FC<NovaOverlayProps> = ({
  sphereId,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nova',
      content: 'Hello! I\'m Nova, your CHE·NU system intelligence. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const { activeSphere } = useSphere();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle Nova
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      sphereContext: activeSphere.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate Nova response (replace with actual API call)
    setTimeout(() => {
      const novaResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'nova',
        content: generateNovaResponse(inputValue, activeSphere.id),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, novaResponse]);
      setIsThinking(false);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <NovaButton onClick={() => setIsOpen(true)} />
    );
  }

  return (
    <div 
      className="nova-overlay"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isExpanded ? '600px' : '400px',
        height: isExpanded ? '80vh' : '500px',
        backgroundColor: '#0a0a0a',
        borderRadius: '20px',
        border: '1px solid #222',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 9999,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #1a1a1a',
        background: 'linear-gradient(135deg, #D8B26A15, transparent)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #D8B26A, #3EB4A2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>✨</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 600, 
            fontSize: '16px',
            color: '#fff'
          }}>
            Nova
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666' 
          }}>
            System Intelligence • {activeSphere.name}
          </div>
        </div>
        
        {/* Actions */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isExpanded ? '⊙' : '⤢'}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '18px',
            marginLeft: '4px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isThinking && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            color: '#666'
          }}>
            <ThinkingDots />
            <span style={{ fontSize: '13px' }}>Nova is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #1a1a1a',
        backgroundColor: '#0f0f0f'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nova anything..."
            style={{
              flex: 1,
              padding: '14px 18px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            style={{
              padding: '14px 20px',
              backgroundColor: inputValue.trim() ? '#D8B26A' : '#333',
              border: 'none',
              borderRadius: '12px',
              color: inputValue.trim() ? '#000' : '#666',
              fontWeight: 600,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Send
          </button>
        </div>
        <div style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#444',
          textAlign: 'center'
        }}>
          Press ⌘K to toggle • Context: {activeSphere.icon} {activeSphere.name}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NOVA BUTTON (Floating Action Button)
// ═══════════════════════════════════════════════════════════════

interface NovaButtonProps {
  onClick: () => void;
}

const NovaButton: React.FC<NovaButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '60px',
      height: '60px',
      borderRadius: '18px',
      background: 'linear-gradient(135deg, #D8B26A, #3EB4A2)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(216, 178, 106, 0.4)',
      transition: 'all 0.2s ease',
      zIndex: 9999
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.boxShadow = '0 6px 24px rgba(216, 178, 106, 0.6)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(216, 178, 106, 0.4)';
    }}
  >
    <span style={{ fontSize: '28px' }}>✨</span>
  </button>
);

// ═══════════════════════════════════════════════════════════════
// MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isNova = message.role === 'nova';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isNova ? 'flex-start' : 'flex-end',
      marginBottom: '12px'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isNova ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        backgroundColor: isNova ? '#1a1a1a' : '#D8B26A20',
        border: isNova ? '1px solid #222' : '1px solid #D8B26A40',
        color: '#fff'
      }}>
        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap'
        }}>
          {message.content}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#555',
          marginTop: '6px',
          textAlign: isNova ? 'left' : 'right'
        }}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// THINKING DOTS
// ═══════════════════════════════════════════════════════════════

const ThinkingDots: React.FC = () => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#D8B26A',
          animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
        }}
      />
    ))}
    <style>{`
      @keyframes pulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// HELPER: Generate Nova Response (placeholder)
// ═══════════════════════════════════════════════════════════════

const generateNovaResponse = (input: string, sphereId: SphereId): string => {
  const sphere = SPHERES[sphereId];
  
  // Simple keyword-based responses (replace with actual AI)
  if (input.toLowerCase().includes('help')) {
    return `I'm here to help you navigate ${sphere.name}. You can ask me about:\n\n• Managing your dashboard\n• Creating threads and tasks\n• Scheduling meetings\n• Working with agents\n• Budget and governance\n\nWhat would you like to explore?`;
  }
  
  if (input.toLowerCase().includes('thread')) {
    return `Threads (.chenu) are persistent lines of thought in CHE·NU. Each thread:\n\n• Has an owner and scope\n• Has a token budget\n• Records decisions and history\n• Is fully auditable\n\nWould you like to create a new thread?`;
  }
  
  if (input.toLowerCase().includes('agent')) {
    return `In ${sphere.name}, you can work with specialized agents. Remember:\n\n• Agents have specific scopes and costs\n• All agent actions require governance approval\n• I (Nova) supervise all agent activities\n\nWhat task would you like an agent to help with?`;
  }
  
  return `I understand you're working in the ${sphere.icon} ${sphere.name} sphere. I can help you with tasks, threads, meetings, and more. What would you like to accomplish?`;
};

export default NovaOverlay;
