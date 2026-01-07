/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — NOVA INTERFACE                               ║
 * ║                       Intelligence Système Centrale                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Nova est l'INTELLIGENCE SYSTÈME de CHE·NU:
 * - Toujours présente, jamais "engagée"
 * - Supervise les 226 agents
 * - Gère la gouvernance et les checkpoints
 * - Coordonne les actions cross-sphères
 * 
 * @version 2.0.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NovaState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'action';

export interface NovaMessage {
  id: string;
  role: 'user' | 'nova' | 'system' | 'agent';
  content: string;
  timestamp: Date;
  tokens?: number;
  agentId?: string;
  agentName?: string;
  suggestions?: NovaSuggestion[];
  checkpoint?: NovaCheckpoint;
}

export interface NovaSuggestion {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export interface NovaCheckpoint {
  id: string;
  type: 'action' | 'data' | 'cost' | 'external';
  title: string;
  description: string;
  estimatedTokens?: number;
  requiresApproval: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NovaContext {
  sphereId: string;
  sphereName: string;
  sectionId?: string;
  activeThreadId?: string;
  tokensUsed: number;
  tokenBudget: number;
}

export interface NovaInterfaceProps {
  defaultOpen?: boolean;
  context?: NovaContext;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onCheckpointResolve?: (checkpointId: string, approved: boolean) => void;
  onNavigate?: (path: string) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  gold: '#D8B26A',
  turquoise: '#3EB4A2',
  emerald: '#3F7249',
  moss: '#2F4C39',
  slate: '#1E1F22',
  sand: '#E9E4D6',
  stone: '#8D8371',
  ember: '#7A593A',
  novaIdle: '#3EB4A2',
  novaActive: '#4ADE80',
  novaThinking: '#D8B26A',
  novaError: '#FF6B6B',
  bgDark: '#0d0d0f',
  bgCard: '#151A18',
  border: '#2A3530',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: NOVA AVATAR
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaAvatarProps {
  state: NovaState;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const NovaAvatar: React.FC<NovaAvatarProps> = ({ state, size = 'md', onClick }) => {
  const sizes = {
    sm: { container: 40, icon: 20, ring: 44 },
    md: { container: 56, icon: 28, ring: 64 },
    lg: { container: 80, icon: 40, ring: 92 },
  };
  const s = sizes[size];
  const stateColors = {
    idle: COLORS.novaIdle,
    listening: COLORS.novaActive,
    thinking: COLORS.novaThinking,
    speaking: COLORS.turquoise,
    action: COLORS.gold,
  };
  const color = stateColors[state];

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: s.container,
        height: s.container,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}22 0%, ${COLORS.moss}44 100%)`,
        border: `2px solid ${color}66`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      aria-label={`Nova - État: ${state}`}
    >
      {(state === 'listening' || state === 'thinking') && (
        <div
          style={{
            position: 'absolute',
            width: s.ring,
            height: s.ring,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            animation: 'novaPulse 2s ease-in-out infinite',
          }}
        />
      )}
      <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none"
        style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}>
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
          fill={color} stroke={color} strokeWidth="1" />
        {state === 'thinking' && (
          <circle cx="12" cy="12" r="3" fill={COLORS.bgDark}
            style={{ animation: 'novaThink 1s ease-in-out infinite' }} />
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          border: `2px solid ${COLORS.bgDark}`,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: MESSAGE BULLE
// ═══════════════════════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: NovaMessage;
  onSuggestionClick?: (suggestion: NovaSuggestion) => void;
  onCheckpointResolve?: (approved: boolean) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message, onSuggestionClick, onCheckpointResolve,
}) => {
  const isNova = message.role === 'nova';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isNova || isAgent || isSystem ? 'flex-start' : 'flex-end',
      marginBottom: 16,
    }}>
      {isAgent && message.agentName && (
        <span style={{ fontSize: 11, color: COLORS.gold, marginBottom: 4, paddingLeft: 12 }}>
          🤖 {message.agentName}
        </span>
      )}
      <div style={{
        maxWidth: '85%',
        padding: '12px 16px',
        borderRadius: isNova || isAgent ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        backgroundColor: isNova || isAgent 
          ? `${COLORS.turquoise}15` 
          : isSystem ? `${COLORS.stone}22` : `${COLORS.gold}15`,
        border: `1px solid ${isNova || isAgent ? COLORS.turquoise : isSystem ? COLORS.stone : COLORS.gold}33`,
      }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: COLORS.textPrimary, whiteSpace: 'pre-wrap' }}>
          {message.content}
        </p>
        {message.tokens && (
          <span style={{ display: 'block', marginTop: 8, fontSize: 10, color: COLORS.textSecondary }}>
            {message.tokens} tokens
          </span>
        )}
      </div>
      
      {message.suggestions && message.suggestions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingLeft: 4 }}>
          {message.suggestions.map((sug) => (
            <button key={sug.id} onClick={() => onSuggestionClick?.(sug)}
              style={{
                padding: '6px 12px', fontSize: 12, borderRadius: 20,
                border: `1px solid ${COLORS.turquoise}44`,
                backgroundColor: `${COLORS.turquoise}11`,
                color: COLORS.turquoise, cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {sug.icon && <span style={{ marginRight: 4 }}>{sug.icon}</span>}
              {sug.label}
            </button>
          ))}
        </div>
      )}
      
      {message.checkpoint && message.checkpoint.status === 'pending' && (
        <div style={{
          marginTop: 12, padding: 16, borderRadius: 12,
          backgroundColor: `${COLORS.gold}11`, border: `1px solid ${COLORS.gold}44`, maxWidth: '90%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <span style={{ fontWeight: 600, color: COLORS.gold, fontSize: 14 }}>
              CHECKPOINT: {message.checkpoint.title}
            </span>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: '0 0 12px 0' }}>
            {message.checkpoint.description}
          </p>
          {message.checkpoint.estimatedTokens && (
            <p style={{ fontSize: 11, color: COLORS.stone, margin: '0 0 12px 0' }}>
              Coût estimé: {message.checkpoint.estimatedTokens} tokens
            </p>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onCheckpointResolve?.(true)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                backgroundColor: COLORS.emerald, color: 'white', fontWeight: 600, cursor: 'pointer',
              }}>
              ✓ Approuver
            </button>
            <button onClick={() => onCheckpointResolve?.(false)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 8,
                border: `1px solid ${COLORS.stone}`, backgroundColor: 'transparent',
                color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer',
              }}>
              ✕ Refuser
            </button>
          </div>
        </div>
      )}
      
      <span style={{
        fontSize: 10, color: COLORS.textSecondary, marginTop: 4,
        paddingLeft: isNova ? 12 : 0, paddingRight: isNova ? 0 : 12,
      }}>
        {message.timestamp.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: CONTEXT BAR
// ═══════════════════════════════════════════════════════════════════════════════

const ContextBar: React.FC<{ context?: NovaContext }> = ({ context }) => {
  if (!context) return null;
  const tokensPercent = (context.tokensUsed / context.tokenBudget) * 100;
  const isLow = tokensPercent > 80;

  return (
    <div style={{
      padding: '8px 16px', backgroundColor: `${COLORS.moss}44`,
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: COLORS.turquoise }}>●</span>
        <span style={{ color: COLORS.textSecondary }}>
          {context.sphereName}{context.sectionId && ` › ${context.sectionId}`}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 60, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${tokensPercent}%`, height: '100%',
            backgroundColor: isLow ? COLORS.novaError : COLORS.turquoise,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ color: isLow ? COLORS.novaError : COLORS.textSecondary }}>
          {context.tokensUsed.toLocaleString()} / {context.tokenBudget.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL: NOVA INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaInterface: React.FC<NovaInterfaceProps> = ({
  defaultOpen = false, context, position = 'bottom-right',
  onCheckpointResolve, onNavigate, className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [novaState, setNovaState] = useState<NovaState>('idle');
  const [messages, setMessages] = useState<NovaMessage[]>([{
    id: 'welcome', role: 'nova',
    content: `Bonjour! Je suis Nova, l'intelligence système de CHE·NU. Je supervise vos 226 agents et assure la gouvernance de votre espace. Comment puis-je vous aider?`,
    timestamp: new Date(),
    suggestions: [
      { id: 's1', label: 'Voir mes tâches', action: 'tasks', icon: '📋' },
      { id: 's2', label: 'État des agents', action: 'agents', icon: '🤖' },
      { id: 's3', label: 'Budget tokens', action: 'budget', icon: '💰' },
    ],
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 },
  };

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const userMessage: NovaMessage = {
      id: `msg_${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setNovaState('thinking');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const novaResponse: NovaMessage = {
        id: `msg_${Date.now()}_nova`, role: 'nova',
        content: `J'ai bien reçu votre message. Je coordonne avec les agents pertinents pour vous fournir la meilleure réponse.`,
        timestamp: new Date(), tokens: Math.floor(Math.random() * 100) + 50,
      };
      setMessages(prev => [...prev, novaResponse]);
      setNovaState('idle');
    } catch {
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_error`, role: 'system',
        content: 'Connexion interrompue. Veuillez réessayer.', timestamp: new Date(),
      }]);
      setNovaState('idle');
    } finally {
      setIsTyping(false);
    }
  }, [input]);

  const handleSuggestionClick = useCallback((suggestion: NovaSuggestion) => {
    setInput(suggestion.label);
  }, []);

  const handleCheckpointResolve = useCallback((checkpointId: string, approved: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.checkpoint?.id === checkpointId) {
        return { ...msg, checkpoint: { ...msg.checkpoint, status: approved ? 'approved' : 'rejected' as const } };
      }
      return msg;
    }));
    setMessages(prev => [...prev, {
      id: `msg_${Date.now()}_checkpoint`, role: 'nova',
      content: approved ? '✓ Action approuvée. Exécution en cours...' : '✕ Action refusée. Aucune modification effectuée.',
      timestamp: new Date(),
    }]);
    onCheckpointResolve?.(checkpointId, approved);
  }, [onCheckpointResolve]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @keyframes novaPulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 0.3; } }
        @keyframes novaThink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {!isOpen && (
        <div style={{ position: 'fixed', ...positionStyles[position], zIndex: 1000 }}>
          <NovaAvatar state={novaState} size="lg" onClick={() => setIsOpen(true)} />
        </div>
      )}

      {isOpen && (
        <div className={className} style={{
          position: 'fixed', ...positionStyles[position],
          width: 420, height: 600, backgroundColor: COLORS.bgDark, borderRadius: 20,
          border: `1px solid ${COLORS.turquoise}33`,
          boxShadow: `0 25px 50px rgba(0,0,0,0.5), 0 0 100px ${COLORS.turquoise}11`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1001,
          animation: 'slideIn 0.3s ease-out',
        }} role="dialog" aria-label="Nova - Assistant CHE·NU">
          
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: `linear-gradient(135deg, ${COLORS.turquoise}22 0%, transparent 100%)`,
            borderBottom: `1px solid ${COLORS.turquoise}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <NovaAvatar state={novaState} size="sm" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.turquoise }}>NOVA</div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary }}>
                  {novaState === 'thinking' ? 'Réflexion en cours...' : 'Intelligence système'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setIsOpen(false)} style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                backgroundColor: `${COLORS.stone}33`, color: COLORS.textSecondary, cursor: 'pointer', fontSize: 18,
              }} aria-label="Réduire">−</button>
              <button onClick={() => setIsOpen(false)} style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                backgroundColor: `${COLORS.stone}33`, color: COLORS.textSecondary, cursor: 'pointer', fontSize: 14,
              }} aria-label="Fermer">✕</button>
            </div>
          </div>

          <ContextBar context={context} />

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg}
                onSuggestionClick={handleSuggestionClick}
                onCheckpointResolve={(approved) => msg.checkpoint && handleCheckpointResolve(msg.checkpoint.id, approved)}
              />
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                <div style={{ display: 'flex', gap: 4, padding: '8px 12px', backgroundColor: `${COLORS.turquoise}15`, borderRadius: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.turquoise,
                      animation: `novaThink 1s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`, backgroundColor: `${COLORS.bgCard}88` }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input ref={inputRef} type="text" value={input}
                onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                placeholder="Demandez à Nova..."
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bgDark,
                  color: COLORS.textPrimary, fontSize: 14, outline: 'none',
                }}
                aria-label="Message pour Nova"
              />
              <button onClick={sendMessage} disabled={!input.trim() || isTyping}
                style={{
                  width: 44, height: 44, borderRadius: 12, border: 'none',
                  backgroundColor: input.trim() ? COLORS.turquoise : COLORS.border,
                  color: 'white', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                }} aria-label="Envoyer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NovaInterface;
