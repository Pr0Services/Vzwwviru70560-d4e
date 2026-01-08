/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — NOVA INTERFACE                              ║
 * ║                                                                              ║
 * ║  Nova chat with governance checkpoints, streaming, and agent suggestions    ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { AgentSuggestionEngine } from '../components/agents/AgentSuggestionEngine';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { AgentDefinition } from '../data/agents-catalog';

// API Hooks
import { useNovaStatus, useNovaQuery, useNovaHistory, NOVA_LANES } from '../hooks/api';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type MessageRole = 'user' | 'nova' | 'system';
type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  checkpoint?: Checkpoint;
}

interface Checkpoint {
  id: string;
  action_type: string;
  action_description: string;
  risk_level: RiskLevel;
  status: CheckpointStatus;
  proposed_action: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  low: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.1)', label: 'Faible' },
  medium: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.1)', label: 'Moyen' },
  high: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', label: 'Élevé' },
  critical: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Critique' },
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'nova',
    content: `Bonjour Jo ! 👋

Je suis Nova, votre intelligence système gouvernée. Je suis là pour vous aider dans vos projets tout en respectant le principe **GOUVERNANCE > EXÉCUTION**.

Voici ce que je peux faire pour vous:
• 🧵 Gérer vos threads et suivre leur maturité
• ⚡ Vous aider à prendre des décisions éclairées
• 🤖 Recommander des agents spécialisés
• 🔍 Rechercher dans vos données et documents
• 🛡️ Vérifier la conformité de vos actions

**Important**: Pour toute action à impact élevé, je vous demanderai une approbation via un checkpoint.

Comment puis-je vous aider aujourd'hui?`,
    timestamp: new Date().toISOString(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CheckpointCard: React.FC<{
  checkpoint: Checkpoint;
  onApprove: () => void;
  onReject: () => void;
}> = ({ checkpoint, onApprove, onReject }) => {
  const risk = RISK_CONFIG[checkpoint.risk_level];

  return (
    <div
      style={{
        margin: '16px 0',
        padding: 20,
        background: 'linear-gradient(135deg, rgba(216, 178, 106, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(216, 178, 106, 0.3)',
        borderRadius: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#D8B26A' }}>
            Point de contrôle requis
          </span>
        </div>
        <span
          style={{
            padding: '4px 10px',
            background: risk.bg,
            borderRadius: 6,
            fontSize: 11,
            color: risk.color,
            fontWeight: 500,
          }}
        >
          Risque {risk.label}
        </span>
      </div>

      {/* Action Details */}
      <div
        style={{
          padding: 16,
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 12, color: '#6B7B6B', marginBottom: 6 }}>Action proposée:</div>
        <div style={{ fontSize: 13, color: '#E8F0E8', marginBottom: 12 }}>
          {checkpoint.action_description}
        </div>
        
        {/* Details */}
        <div style={{ fontSize: 11, color: '#6B7B6B' }}>
          Type: <span style={{ color: '#9BA89B' }}>{checkpoint.action_type}</span>
        </div>
      </div>

      {/* Governance Message */}
      <p style={{ fontSize: 11, color: '#8B9B8B', margin: '0 0 16px', fontStyle: 'italic' }}>
        ⚖️ Conformément au principe GOUVERNANCE {'>'} EXÉCUTION, cette action nécessite votre approbation explicite.
      </p>

      {/* Actions */}
      {checkpoint.status === 'pending' ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onReject}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 10,
              color: '#EF4444',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ✕ Rejeter
          </button>
          <button
            onClick={onApprove}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)',
              border: 'none',
              borderRadius: 10,
              color: '#E8F0E8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✓ Approuver
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: '12px',
            background: checkpoint.status === 'approved' 
              ? 'rgba(74, 222, 128, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            borderRadius: 10,
            textAlign: 'center',
            color: checkpoint.status === 'approved' ? '#4ADE80' : '#EF4444',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {checkpoint.status === 'approved' ? '✓ Approuvé' : '✕ Rejeté'}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MessageBubble: React.FC<{
  message: Message;
  onCheckpointApprove?: () => void;
  onCheckpointReject?: () => void;
}> = ({ message, onCheckpointApprove, onCheckpointReject }) => {
  const isNova = message.role === 'nova';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '8px 16px',
          color: '#6B7B6B',
          fontSize: 11,
        }}
      >
        {message.content}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isNova ? 'flex-start' : 'flex-end',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          display: 'flex',
          flexDirection: isNova ? 'row' : 'row-reverse',
          gap: 12,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: isNova
              ? 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)'
              : 'linear-gradient(135deg, #3EB4A2 0%, #2F4C39 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {isNova ? '✨' : '👤'}
        </div>

        {/* Content */}
        <div>
          <div style={{ fontSize: 10, color: '#6B7B6B', marginBottom: 6 }}>
            {isNova ? 'Nova' : 'Vous'} • {new Date(message.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div
            style={{
              padding: '14px 18px',
              background: isNova
                ? 'rgba(255, 255, 255, 0.03)'
                : 'linear-gradient(135deg, rgba(62, 180, 162, 0.15) 0%, rgba(47, 76, 57, 0.15) 100%)',
              border: `1px solid ${isNova ? 'rgba(255, 255, 255, 0.06)' : 'rgba(62, 180, 162, 0.2)'}`,
              borderRadius: isNova ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
              color: '#E8F0E8',
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </div>

          {/* Checkpoint */}
          {message.checkpoint && onCheckpointApprove && onCheckpointReject && (
            <CheckpointCard
              checkpoint={message.checkpoint}
              onApprove={onCheckpointApprove}
              onReject={onCheckpointReject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaPageV72: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // API Data
  const { data: novaStatus } = useNovaStatus();
  const novaQueryMutation = useNovaQuery();

  // State
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send message
  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Try API first, fallback to simulation
    novaQueryMutation.mutate(
      { query: inputValue.trim() },
      {
        onSuccess: (response) => {
          const novaMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'nova',
            content: response.response,
            timestamp: new Date().toISOString(),
            checkpoint: response.checkpoint_required ? {
              id: `checkpoint-${Date.now()}`,
              action_type: 'external_action',
              action_description: `Exécuter l'action demandée`,
              risk_level: 'medium',
              status: 'pending',
              proposed_action: { original_request: inputValue.trim() },
            } : undefined,
          };
          setMessages(prev => [...prev, novaMessage]);
          setIsTyping(false);
        },
        onError: () => {
          // Fallback to simulation on API error
          const shouldShowCheckpoint = inputValue.toLowerCase().includes('envoyer') ||
                                       inputValue.toLowerCase().includes('supprimer') ||
                                       inputValue.toLowerCase().includes('payer');

          const novaMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'nova',
            content: shouldShowCheckpoint
              ? `Je comprends votre demande. Avant de procéder, je dois vous demander une approbation car cette action pourrait avoir un impact significatif.`
              : getNovaResponse(inputValue),
            timestamp: new Date().toISOString(),
            checkpoint: shouldShowCheckpoint ? {
              id: `checkpoint-${Date.now()}`,
              action_type: 'external_action',
              action_description: `Exécuter l'action: "${inputValue.trim()}"`,
              risk_level: inputValue.toLowerCase().includes('supprimer') ? 'high' : 'medium',
              status: 'pending',
              proposed_action: { original_request: inputValue.trim() },
            } : undefined,
          };

          setMessages(prev => [...prev, novaMessage]);
          setIsTyping(false);
        },
      }
    );
  }, [inputValue, novaQueryMutation]);

  // Handle checkpoint actions
  const handleCheckpointAction = useCallback((messageId: string, action: 'approve' | 'reject') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.checkpoint) {
        return {
          ...msg,
          checkpoint: {
            ...msg.checkpoint,
            status: action === 'approve' ? 'approved' : 'rejected',
          },
        };
      }
      return msg;
    }));

    // Add system message
    const systemMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'system',
      content: action === 'approve' 
        ? '✓ Checkpoint approuvé — Action exécutée'
        : '✕ Checkpoint rejeté — Action annulée',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  // Handle agent hire suggestion
  const handleAgentHire = useCallback((agent: AgentDefinition) => {
    navigate(`/agents?hire=${agent.id}`);
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') setIsSearchOpen(false);
    },
  });

  // Key press handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7B6B',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            ✨
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#E8F0E8' }}>
              Nova
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#6B7B6B' }}>
              Intelligence système gouvernée • En ligne
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              color: '#9BA89B',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            🔍 ⌘K
          </button>
          <button
            onClick={() => navigate('/governance')}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              color: '#9BA89B',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            🛡️ Gouvernance
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCheckpointApprove={message.checkpoint ? () => handleCheckpointAction(message.id, 'approve') : undefined}
              onCheckpointReject={message.checkpoint ? () => handleCheckpointAction(message.id, 'reject') : undefined}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                ✨
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px 16px 16px 16px',
                  color: '#6B7B6B',
                  fontSize: 14,
                }}
              >
                Nova réfléchit...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Agent Suggestions */}
      {showSuggestions && messages.length > 2 && (
        <div style={{ padding: '0 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <AgentSuggestionEngine
              context={{
                keywords: extractKeywords(messages),
              }}
              variant="inline"
              maxSuggestions={3}
              onHire={handleAgentHire}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Demandez quelque chose à Nova... (Entrée pour envoyer)"
            rows={1}
            style={{
              flex: 1,
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              color: '#E8F0E8',
              fontSize: 14,
              resize: 'none',
              outline: 'none',
              minHeight: 48,
              maxHeight: 150,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={{
              padding: '14px 20px',
              background: inputValue.trim()
                ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: 12,
              color: inputValue.trim() ? '#1A1A1A' : '#4B5B4B',
              fontSize: 14,
              fontWeight: 600,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Envoyer
          </button>
        </div>
        <div
          style={{
            maxWidth: 800,
            margin: '8px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: '#4B5B4B',
          }}
        >
          <span>⇧+Entrée pour nouvelle ligne</span>
          <span>Nova respecte GOUVERNANCE {'>'} EXÉCUTION</span>
        </div>
      </div>

      {/* Search Modal */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => result.path && navigate(result.path)}
        onNavigate={navigate}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getNovaResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('thread') || lower.includes('projet')) {
    return `Je vois que vous souhaitez travailler sur un projet. Voici quelques options:

1. **Créer un nouveau thread** — Je peux vous aider à définir l'intention fondatrice
2. **Voir vos threads actifs** — Vous avez 12 threads en cours
3. **Analyser la maturité** — Certains threads pourraient nécessiter votre attention

Que préférez-vous faire?`;
  }
  
  if (lower.includes('agent') || lower.includes('aide')) {
    return `Je peux vous recommander des agents spécialisés basés sur votre contexte actuel.

Actuellement, je détecte que vous pourriez bénéficier d'experts en:
• 📊 Estimation de coûts
• 📋 Gestion de projet
• 📝 Documentation

Voulez-vous voir les agents disponibles dans ces domaines?`;
  }
  
  if (lower.includes('décision') || lower.includes('choix')) {
    return `Vous avez actuellement **5 décisions en attente**:
• 2 en phase 🟢 GREEN (nouveau)
• 2 en phase 🟡 YELLOW (attention)
• 1 en phase 🔴 RED (urgent)

Je vous recommande de traiter en priorité les décisions en phase RED pour éviter qu'elles n'atteignent le stade BLINK.

Voulez-vous que je vous présente la décision la plus urgente?`;
  }
  
  return `Merci pour votre message! J'ai bien compris votre demande.

Je suis prête à vous aider. N'hésitez pas à me donner plus de détails sur ce que vous souhaitez accomplir, et je vous guiderai à travers les prochaines étapes.

💡 Conseil: Soyez précis dans vos demandes pour que je puisse vous fournir une assistance optimale.`;
}

function extractKeywords(messages: Message[]): string[] {
  const keywords: string[] = [];
  const keywordMap: Record<string, string[]> = {
    rénovation: ['construction', 'rénovation'],
    construction: ['construction', 'entrepreneur'],
    projet: ['projet', 'gestion'],
    immobilier: ['immobilier', 'propriété'],
    budget: ['finance', 'budget'],
    équipe: ['équipe', 'team'],
  };

  messages.forEach(msg => {
    if (msg.role === 'user') {
      const lower = msg.content.toLowerCase();
      Object.entries(keywordMap).forEach(([key, values]) => {
        if (lower.includes(key)) {
          keywords.push(...values);
        }
      });
    }
  });

  return [...new Set(keywords)];
}

export default NovaPageV72;
