/**
 * CHE·NU — Interface Thread/Chat
 */

import React, { useState, useRef, useEffect } from 'react';
import { Message, LLMModel } from '../../types/thread.types';
import { LLM_MODELS } from '../../services/thread.service';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  user: '#1E3A5F',
  assistant: '#1E2922',
};

interface ThreadChatProps {
  threadId: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  currentModel: LLMModel;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onModelChange: (model: LLMModel) => void;
  onFeedback: (messageId: string, rating: 'positive' | 'negative') => void;
  onClose?: () => void;
}

export const ThreadChat: React.FC<ThreadChatProps> = ({
  threadId,
  title,
  messages,
  isLoading,
  currentModel,
  onSendMessage,
  onModelChange,
  onFeedback,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    
    onSendMessage(input, attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-CA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: COLORS.bg,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.muted,
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
          )}
          <h2 style={{ color: COLORS.text, fontSize: 16, margin: 0 }}>{title}</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Model Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowModelSelect(!showModelSelect)}
              style={{
                padding: '8px 12px',
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.text,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🧠</span>
              <span>{currentModel.name}</span>
              <span style={{ color: COLORS.muted }}>▼</span>
            </button>

            {showModelSelect && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: 280,
                marginTop: 8,
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                maxHeight: 400,
                overflowY: 'auto',
                zIndex: 100,
              }}>
                {['premium', 'standard', 'speed', 'local'].map(tier => (
                  <div key={tier}>
                    <div style={{
                      padding: '12px 16px',
                      background: COLORS.bg,
                      color: COLORS.muted,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}>
                      {tier}
                    </div>
                    {LLM_MODELS.filter(m => m.tier === tier).map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelChange(model);
                          setShowModelSelect(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: model.id === currentModel.id ? `${COLORS.cyan}15` : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ color: COLORS.text, fontSize: 13, marginBottom: 2 }}>
                          {model.name}
                        </div>
                        <div style={{ color: COLORS.muted, fontSize: 11 }}>
                          {model.description}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button style={{
            padding: '8px',
            background: 'none',
            border: 'none',
            color: COLORS.muted,
            cursor: 'pointer',
            fontSize: 16,
          }}>
            ⚙️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
      }}>
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '14px 18px',
              background: message.role === 'user' ? COLORS.user : COLORS.assistant,
              borderRadius: message.role === 'user' 
                ? '16px 16px 4px 16px' 
                : '16px 16px 16px 4px',
              border: `1px solid ${COLORS.border}`,
            }}>
              {/* Role indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 14 }}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>
                  {message.role === 'user' ? 'Vous' : 'Nova'}
                </span>
                <span style={{ color: COLORS.muted, fontSize: 11 }}>
                  {formatTime(message.created_at)}
                </span>
              </div>

              {/* Content */}
              <div style={{
                color: COLORS.text,
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {message.content}
              </div>

              {/* Attachments */}
              {message.attachments?.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {message.attachments.map(att => (
                    <div
                      key={att.id}
                      style={{
                        padding: '8px 12px',
                        background: COLORS.bg,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>📎</span>
                      <span style={{ color: COLORS.text, fontSize: 12 }}>{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Metadata + Feedback */}
              {message.role === 'assistant' && message.ai_metadata && (
                <div style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ color: COLORS.muted, fontSize: 11 }}>
                    {message.ai_metadata.model} • {message.ai_metadata.tokens_output} tokens • {message.ai_metadata.latency_ms}ms
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onFeedback(message.id, 'positive')}
                      style={{
                        padding: '4px 8px',
                        background: message.feedback?.rating === 'positive' ? `${COLORS.sage}30` : 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => onFeedback(message.id, 'negative')}
                      style={{
                        padding: '4px 8px',
                        background: message.feedback?.rating === 'negative' ? '#FF6B6B30' : 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      👎
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: COLORS.assistant,
            borderRadius: '16px 16px 16px 4px',
            border: `1px solid ${COLORS.border}`,
            maxWidth: '80%',
          }}>
            <span>🤖</span>
            <span style={{ color: COLORS.muted, fontSize: 14 }}>Nova réfléchit...</span>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COLORS.cyan,
              animation: 'pulse 1s infinite',
            }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 20px',
        background: COLORS.card,
        borderTop: `1px solid ${COLORS.border}`,
      }}>
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {attachments.map((file, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  background: COLORS.bg,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>📎</span>
                <span style={{ color: COLORS.text, fontSize: 12 }}>{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.muted,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '12px',
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            📎
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message à Nova..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              color: COLORS.text,
              fontSize: 14,
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            style={{
              padding: '12px 20px',
              background: input.trim() || attachments.length > 0
                ? `linear-gradient(135deg, ${COLORS.sage} 0%, ${COLORS.cyan} 100%)`
                : COLORS.border,
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              cursor: input.trim() || attachments.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading ? '...' : '➤'}
          </button>
        </form>

        {/* Tools Bar */}
        <div style={{
          marginTop: 12,
          display: 'flex',
          gap: 8,
        }}>
          {[
            { icon: '📊', label: 'Calcul' },
            { icon: '📝', label: 'Document' },
            { icon: '📁', label: 'Fichiers' },
            { icon: '🔍', label: 'Recherche' },
          ].map(tool => (
            <button
              key={tool.label}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                color: COLORS.muted,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadChat;
