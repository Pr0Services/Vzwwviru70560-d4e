/**
 * CHE·NU — Nova Assistant Panel
 */

import React, { useState, useRef, useEffect } from 'react';
import { Message, LLMModel } from '../../types/thread.types';
import { LLM_MODELS } from '../../services/thread.service';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

interface NovaPanelProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export const NovaPanel: React.FC<NovaPanelProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      thread_id: 'nova-quick',
      role: 'assistant',
      content: 'Bonjour! 👋 Je suis Nova, votre assistant IA. Comment puis-je vous aider aujourd\'hui?',
      content_type: 'text',
      attachments: [],
      status: 'sent',
      created_at: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<LLMModel>(LLM_MODELS[0]);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      thread_id: 'nova-quick',
      role: 'user',
      content: input,
      content_type: 'text',
      attachments: [],
      status: 'sent',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

    const aiMessage: Message = {
      id: `msg_${Date.now()}_ai`,
      thread_id: 'nova-quick',
      role: 'assistant',
      content: `Je comprends votre demande concernant "${input}". Voici quelques suggestions...\n\n• Point 1: Analyse contextuelle\n• Point 2: Recommandations\n• Point 3: Prochaines étapes\n\nSouhaitez-vous que j'approfondisse un point en particulier?`,
      content_type: 'markdown',
      attachments: [],
      ai_metadata: {
        model: currentModel.id,
        provider: currentModel.provider,
        tokens_input: input.split(' ').length * 4,
        tokens_output: 50,
        latency_ms: 850,
      },
      status: 'sent',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const quickActions = [
    { label: '📋 Résumer', action: 'Résume ce document' },
    { label: '✍️ Rédiger', action: 'Aide-moi à rédiger' },
    { label: '🔍 Analyser', action: 'Analyse ces données' },
    { label: '💡 Idées', action: 'Propose des idées pour' },
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: isMinimized ? 20 : 80,
      right: 20,
      width: isMinimized ? 280 : 420,
      height: isMinimized ? 'auto' : 560,
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1001,
      fontFamily: "'Inter', sans-serif",
      transition: 'all 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${COLORS.cyan}10 0%, ${COLORS.sage}10 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.sage} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}>
            🤖
          </div>
          <div>
            <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>Nova</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>
              {currentModel.name}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onMinimize}
            style={{
              width: 28,
              height: 28,
              background: 'transparent',
              border: 'none',
              color: COLORS.muted,
              cursor: 'pointer',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMinimized ? '□' : '−'}
          </button>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              background: 'transparent',
              border: 'none',
              color: COLORS.muted,
              cursor: 'pointer',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
          }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  marginBottom: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  background: message.role === 'user' ? `${COLORS.sage}30` : COLORS.bg,
                  borderRadius: message.role === 'user' 
                    ? '14px 14px 4px 14px' 
                    : '14px 14px 14px 4px',
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{
                    color: COLORS.text,
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: COLORS.bg,
                borderRadius: '14px 14px 14px 4px',
                border: `1px solid ${COLORS.border}`,
                maxWidth: '85%',
              }}>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>Nova réfléchit</span>
                <span style={{ animation: 'blink 1s infinite' }}>...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 16px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {quickActions.map(qa => (
                <button
                  key={qa.label}
                  onClick={() => setInput(qa.action)}
                  style={{
                    padding: '6px 12px',
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 20,
                    color: COLORS.text,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: 16,
            borderTop: `1px solid ${COLORS.border}`,
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Demandez à Nova..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  padding: '10px 16px',
                  background: input.trim() 
                    ? `linear-gradient(135deg, ${COLORS.sage} 0%, ${COLORS.cyan} 100%)`
                    : COLORS.border,
                  border: 'none',
                  borderRadius: 10,
                  color: 'white',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                ➤
              </button>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NovaPanel;
