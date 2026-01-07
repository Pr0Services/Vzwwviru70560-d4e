/**
 * CHE·NU™ R&D Workspace - Agent Panel
 * 
 * R&D Agent interaction panel with strict role constraints.
 * Agent Role: "Analyste et accélérateur cognitif, jamais décideur"
 * 
 * CRITICAL RULES:
 * - Agent NEVER makes decisions
 * - Agent NEVER deletes ideas
 * - Agent NEVER imposes scores
 * - Agent NEVER acts without explicit request
 * - All suggestions require human validation
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  RnDPhase,
  RnDPhaseInfo,
  RND_AGENT_RULES,
  AgentSuggestion,
  RND_GOLDEN_RULE,
} from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM COLORS
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  deepBlue: '#1E3A5F',
  
  // Phase colors
  explorationBlue: '#3B82F6',
  selectionYellow: '#EAB308',
  examplesGreen: '#22C55E',
  comparisonOrange: '#F97316',
  refinementRed: '#EF4444',
  decisionPurple: '#A855F7',
};

// ============================================================================
// AGENT CAPABILITIES BY PHASE
// ============================================================================

interface AgentCapability {
  id: string;
  label: string;
  description: string;
  icon: string;
  requiresSelection?: boolean;
}

const PHASE_CAPABILITIES: Record<RnDPhase, AgentCapability[]> = {
  1: [
    { id: 'regroup_ideas', label: 'Regrouper les idées', description: 'Identifier des thèmes communs entre les idées', icon: '🔗' },
    { id: 'reformulate', label: 'Reformuler une idée', description: 'Clarifier ou structurer une idée', icon: '✏️', requiresSelection: true },
    { id: 'identify_themes', label: 'Identifier les thèmes', description: 'Détecter les patterns et tendances', icon: '🏷️' },
    { id: 'expand_idea', label: 'Développer une idée', description: 'Proposer des extensions ou variantes', icon: '🌱', requiresSelection: true },
  ],
  2: [
    { id: 'comparative_synthesis', label: 'Synthèse comparative', description: 'Comparer les forces/faiblesses des idées', icon: '⚖️' },
    { id: 'highlight_disagreements', label: 'Mettre en évidence désaccords', description: 'Identifier les points de tension', icon: '⚠️' },
    { id: 'criteria_analysis', label: 'Analyser critères', description: 'Évaluer la pertinence des critères', icon: '📊' },
    { id: 'gap_detection', label: 'Détecter les lacunes', description: 'Identifier ce qui manque dans l\'évaluation', icon: '🔍' },
  ],
  3: [
    { id: 'generate_variants', label: 'Générer variantes', description: 'Proposer des scénarios alternatifs', icon: '🔄' },
    { id: 'propose_counter_examples', label: 'Contre-exemples', description: 'Challenger avec des cas contraires', icon: '🔀' },
    { id: 'simulate_scenarios', label: 'Simulation', description: 'Explorer les conséquences possibles', icon: '🔬' },
    { id: 'stress_test', label: 'Test de stress', description: 'Pousser les hypothèses aux limites', icon: '💪' },
  ],
  4: [
    { id: 'comparative_analysis', label: 'Analyse comparative', description: 'Comparer systématiquement les solutions', icon: '📊' },
    { id: 'synthesis_pros_cons', label: 'Synthèse pour/contre', description: 'Résumer avantages et inconvénients', icon: '⚖️' },
    { id: 'detect_inconsistencies', label: 'Détecter incohérences', description: 'Trouver les contradictions', icon: '⚡' },
    { id: 'trade_off_analysis', label: 'Analyse trade-offs', description: 'Clarifier les compromis', icon: '🔄' },
  ],
  5: [
    { id: 'optimization_suggestions', label: 'Suggestions d\'optimisation', description: 'Proposer des améliorations', icon: '🎯' },
    { id: 'detect_hidden_risks', label: 'Risques cachés', description: 'Identifier les risques non évidents', icon: '🔴' },
    { id: 'coherence_check', label: 'Vérifier cohérence', description: 'S\'assurer de la cohérence globale', icon: '✓' },
    { id: 'implementation_hints', label: 'Pistes d\'implémentation', description: 'Suggérer des approches pratiques', icon: '🛠️' },
  ],
  6: [
    { id: 'final_synthesis', label: 'Synthèse finale', description: 'Résumer le parcours de réflexion', icon: '📋' },
    { id: 'executive_summary', label: 'Résumé exécutif', description: 'Créer un condensé pour communication', icon: '📄' },
    { id: 'vigilance_points', label: 'Points de vigilance', description: 'Lister les éléments à surveiller', icon: '👁️' },
    { id: 'next_steps', label: 'Prochaines étapes', description: 'Suggérer les actions de suivi', icon: '➡️' },
  ],
};

// ============================================================================
// AGENT MESSAGE TYPES
// ============================================================================

interface AgentMessage {
  id: string;
  type: 'user_request' | 'agent_response' | 'suggestion' | 'warning' | 'system';
  content: string;
  timestamp: Date;
  capability?: string;
  suggestions?: AgentSuggestion[];
}

// ============================================================================
// PROPS
// ============================================================================

interface RnDAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: RnDPhase;
  phaseInfo: RnDPhaseInfo;
  projectTitle: string;
  onSuggestionAccepted?: (suggestion: AgentSuggestion) => void;
  onSuggestionRejected?: (suggestion: AgentSuggestion, reason: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RnDAgentPanel: React.FC<RnDAgentPanelProps> = ({
  isOpen,
  onClose,
  currentPhase,
  phaseInfo,
  projectTitle,
  onSuggestionAccepted,
  onSuggestionRejected,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      type: 'system',
      content: `Agent R&D activé pour "${projectTitle}". Je suis votre analyste et accélérateur cognitif. Comment puis-je vous aider dans cette phase de ${phaseInfo.name}?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const capabilities = PHASE_CAPABILITIES[currentPhase];
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Get phase color
  const getPhaseColor = (): string => {
    const colors: Record<RnDPhase, string> = {
      1: CHENU_COLORS.explorationBlue,
      2: CHENU_COLORS.selectionYellow,
      3: CHENU_COLORS.examplesGreen,
      4: CHENU_COLORS.comparisonOrange,
      5: CHENU_COLORS.refinementRed,
      6: CHENU_COLORS.decisionPurple,
    };
    return colors[currentPhase];
  };
  
  // Handle capability selection
  const handleCapabilityClick = (capability: AgentCapability) => {
    setSelectedCapability(capability.id);
    
    // Add user request message
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      type: 'user_request',
      content: `Demande: ${capability.label}`,
      timestamp: new Date(),
      capability: capability.id,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate agent response (in real implementation, this would call the AI)
    setTimeout(() => {
      const agentResponse: AgentMessage = {
        id: `msg-${Date.now()}-response`,
        type: 'agent_response',
        content: getAgentResponse(capability),
        timestamp: new Date(),
        capability: capability.id,
        suggestions: generateMockSuggestions(capability),
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);
      setSelectedCapability(null);
    }, 1500);
  };
  
  // Get mock agent response based on capability
  const getAgentResponse = (capability: AgentCapability): string => {
    const responses: Record<string, string> = {
      regroup_ideas: 'J\'ai analysé les idées et identifié plusieurs thèmes potentiels. Voici mes observations (qui restent à votre validation):',
      reformulate: 'Voici une reformulation possible de l\'idée sélectionnée. Vous décidez si elle capture mieux l\'intention:',
      identify_themes: 'Après analyse des patterns, voici les thèmes que je détecte. C\'est une lecture possible parmi d\'autres:',
      comparative_synthesis: 'Voici une synthèse comparative des options. Les conclusions finales vous appartiennent:',
      generate_variants: 'J\'ai généré quelques variantes de scénarios. À vous de juger leur pertinence:',
      propose_counter_examples: 'Voici des contre-exemples pour challenger vos hypothèses. La décision de les intégrer vous revient:',
      optimization_suggestions: 'Quelques pistes d\'optimisation que je soumets à votre jugement:',
      final_synthesis: 'Voici une synthèse du parcours de réflexion. C\'est un miroir, pas une prescription:',
    };
    
    return responses[capability.id] || `Analyse en cours pour "${capability.label}"... Voici mes observations:`;
  };
  
  // Generate mock suggestions
  const generateMockSuggestions = (capability: AgentCapability): AgentSuggestion[] => {
    return [
      {
        id: `sug-${Date.now()}-1`,
        type: 'observation',
        content: 'Point d\'attention identifié dans l\'analyse',
        rationale: 'Basé sur les patterns observés dans les données',
        confidence: 0.75,
        createdAt: new Date(),
        status: 'pending',
      },
      {
        id: `sug-${Date.now()}-2`,
        type: 'alternative',
        content: 'Alternative possible à considérer',
        rationale: 'Pourrait ouvrir de nouvelles perspectives',
        confidence: 0.65,
        createdAt: new Date(),
        status: 'pending',
      },
    ];
  };
  
  // Handle free-form input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      type: 'user_request',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate response
    setTimeout(() => {
      const agentResponse: AgentMessage = {
        id: `msg-${Date.now()}-response`,
        type: 'agent_response',
        content: 'J\'ai analysé votre demande. Voici mes observations (à votre appréciation):',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 1500);
  };
  
  // Handle suggestion actions
  const handleAcceptSuggestion = (suggestion: AgentSuggestion) => {
    // Add confirmation message
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}-accepted`,
      type: 'system',
      content: `✓ Suggestion acceptée: "${suggestion.content.substring(0, 50)}..."`,
      timestamp: new Date(),
    }]);
    
    onSuggestionAccepted?.(suggestion);
  };
  
  const handleRejectSuggestion = (suggestion: AgentSuggestion) => {
    const reason = prompt('Raison du rejet (optionnel):') || 'Non pertinent';
    
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}-rejected`,
      type: 'system',
      content: `✗ Suggestion rejetée: "${suggestion.content.substring(0, 50)}..." - Raison: ${reason}`,
      timestamp: new Date(),
    }]);
    
    onSuggestionRejected?.(suggestion, reason);
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '450px',
      height: '100vh',
      backgroundColor: '#111113',
      borderLeft: `1px solid ${CHENU_COLORS.nightSlate}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${CHENU_COLORS.nightSlate}`,
        backgroundColor: '#0a0a0b',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
              }}>
                Agent R&D
              </h3>
              <p style={{
                margin: 0,
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
              }}>
                {RND_AGENT_RULES.role.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>
        
        {/* Current Phase Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>{phaseInfo.icon}</span>
          <span style={{
            fontSize: '13px',
            color: getPhaseColor(),
            fontWeight: 500,
          }}>
            Phase {currentPhase}: {phaseInfo.name}
          </span>
        </div>
        
        {/* Rules Toggle */}
        <button
          onClick={() => setShowRules(!showRules)}
          style={{
            marginTop: '8px',
            padding: '6px 10px',
            fontSize: '11px',
            color: CHENU_COLORS.sacredGold,
            backgroundColor: 'transparent',
            border: `1px solid ${CHENU_COLORS.sacredGold}`,
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {showRules ? '▼ Masquer les règles de l\'agent' : '▶ Voir les règles de l\'agent'}
        </button>
        
        {/* Rules Panel */}
        {showRules && (
          <div style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '6px',
            border: `1px solid ${CHENU_COLORS.sacredGold}`,
          }}>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '11px',
              color: CHENU_COLORS.sacredGold,
              fontWeight: 600,
            }}>
              🔒 Règles non-négociables:
            </p>
            <ul style={{
              margin: 0,
              padding: '0 0 0 16px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.7)',
            }}>
              {RND_AGENT_RULES.forbidden.map((rule, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  ❌ {rule.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
            <p style={{
              margin: '8px 0 0 0',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              fontStyle: 'italic',
            }}>
              "{RND_GOLDEN_RULE}"
            </p>
          </div>
        )}
      </div>
      
      {/* Capabilities Grid */}
      <div style={{
        padding: '12px',
        borderBottom: `1px solid ${CHENU_COLORS.nightSlate}`,
        backgroundColor: '#0d0d0e',
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Actions disponibles (Phase {currentPhase})
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}>
          {capabilities.map((cap) => (
            <button
              key={cap.id}
              onClick={() => handleCapabilityClick(cap)}
              disabled={isProcessing}
              title={cap.description}
              style={{
                padding: '10px',
                backgroundColor: selectedCapability === cap.id 
                  ? getPhaseColor() 
                  : 'rgba(255,255,255,0.05)',
                border: selectedCapability === cap.id
                  ? `1px solid ${getPhaseColor()}`
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: selectedCapability === cap.id ? '#000' : '#fff',
                fontSize: '12px',
                cursor: isProcessing ? 'wait' : 'pointer',
                textAlign: 'left',
                opacity: isProcessing ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ marginRight: '6px' }}>{cap.icon}</span>
              {cap.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '16px',
            }}
          >
            {/* Message Bubble */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: msg.type === 'user_request'
                ? 'rgba(59, 130, 246, 0.2)'
                : msg.type === 'system'
                ? 'rgba(212, 175, 55, 0.1)'
                : 'rgba(255,255,255,0.05)',
              border: msg.type === 'system'
                ? `1px solid ${CHENU_COLORS.sacredGold}`
                : '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: msg.type === 'user_request'
                    ? CHENU_COLORS.explorationBlue
                    : msg.type === 'system'
                    ? CHENU_COLORS.sacredGold
                    : 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                }}>
                  {msg.type === 'user_request' ? '👤 Vous' : msg.type === 'system' ? '⚙️ Système' : '🤖 Agent R&D'}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#fff',
                lineHeight: 1.5,
              }}>
                {msg.content}
              </p>
            </div>
            
            {/* Suggestions */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{
                marginTop: '8px',
                marginLeft: '12px',
              }}>
                {msg.suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      border: `1px solid ${CHENU_COLORS.cenoteTurquoise}`,
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '6px',
                    }}>
                      <span style={{
                        fontSize: '10px',
                        color: CHENU_COLORS.cenoteTurquoise,
                        textTransform: 'uppercase',
                      }}>
                        💡 Suggestion ({Math.round(sug.confidence * 100)}% confiance)
                      </span>
                    </div>
                    <p style={{
                      margin: '0 0 6px 0',
                      fontSize: '12px',
                      color: '#fff',
                    }}>
                      {sug.content}
                    </p>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)',
                      fontStyle: 'italic',
                    }}>
                      Rationale: {sug.rationale}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => handleAcceptSuggestion(sug)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          backgroundColor: CHENU_COLORS.examplesGreen,
                          color: '#000',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        ✓ Accepter
                      </button>
                      <button
                        onClick={() => handleRejectSuggestion(sug)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          backgroundColor: 'transparent',
                          color: 'rgba(255,255,255,0.7)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        ✗ Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${getPhaseColor()}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
            }}>
              Agent R&D analyse...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '16px',
          borderTop: `1px solid ${CHENU_COLORS.nightSlate}`,
          backgroundColor: '#0a0a0b',
        }}
      >
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Poser une question à l'agent..."
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            style={{
              padding: '12px 20px',
              backgroundColor: getPhaseColor(),
              color: currentPhase === 2 ? '#000' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing || !inputValue.trim() ? 0.5 : 1,
            }}
          >
            Envoyer
          </button>
        </div>
        
        {/* Reminder */}
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
        }}>
          💡 L'agent analyse et suggère. Vous décidez et validez.
        </p>
      </form>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RnDAgentPanel;
