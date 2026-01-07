/**
 * CHE·NU V51 — AGENT WORKSPACE
 * =============================
 * 
 * Interface to interact with specialized agents.
 * 
 * RULES:
 * - All agent output goes through ProposalStore
 * - User validates all suggestions
 * - Trace level ≥ debug for all agent calls
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AGENT_WORKSPACE_CONTRACT,
  AgentWorkspaceState,
  AgentDefinition,
  AgentInteraction,
  createAgentWorkspaceState,
  DEMO_AGENTS
} from '../../contracts/AgentWorkspace.contract';
import {
  getGlobalEventStore,
  emitModuleEntered,
  emitModuleExited
} from '../../stores/SystemEventStore';
import { getGlobalProposalStore } from '../../stores/ProposalStore';
import { ModuleState } from '../../contracts/ModuleActivationContract';

// ============================================
// PROPS
// ============================================

export interface AgentWorkspacePageProps {
  onNavigateToModule?: (moduleId: string) => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const AgentWorkspacePage: React.FC<AgentWorkspacePageProps> = ({
  onNavigateToModule,
  className = ''
}) => {
  // State
  const [state, setState] = useState<AgentWorkspaceState>(() =>
    createAgentWorkspaceState()
  );
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const [userInput, setUserInput] = useState('');
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lifecycle
  useEffect(() => {
    emitModuleEntered('agent_workspace');
    setState(prev => ({ ...prev, module_state: ModuleState.ACTIVE }));

    return () => {
      emitModuleExited('agent_workspace');
    };
  }, []);

  // Handle agent selection
  const handleSelectAgent = useCallback((agent: AgentDefinition) => {
    setSelectedAgent(agent);
    setInteractions([]);
    setUserInput('');

    getGlobalEventStore().emit(
      'agent_selected',
      'user',
      'agent_workspace',
      'info',
      { agent_id: agent.agent_id }
    );
  }, []);

  // Handle user message
  const handleSendMessage = useCallback(async () => {
    if (!selectedAgent || !userInput.trim() || isProcessing) return;

    const userInteraction: AgentInteraction = {
      interaction_id: `int_${Date.now()}`,
      agent_id: selectedAgent.agent_id,
      timestamp: new Date().toISOString(),
      user_input: userInput.trim(),
      agent_response: '',
      status: 'pending'
    };

    setInteractions(prev => [...prev, userInteraction]);
    setUserInput('');
    setIsProcessing(true);

    // Emit event
    getGlobalEventStore().emit(
      'agent_query_sent',
      'user',
      'agent_workspace',
      'debug',
      { agent_id: selectedAgent.agent_id, input_length: userInteraction.user_input.length }
    );

    // Simulate agent response (in real app, this would call the agent API)
    setTimeout(() => {
      const response = generateDemoResponse(selectedAgent, userInteraction.user_input);
      
      setInteractions(prev => prev.map(i => 
        i.interaction_id === userInteraction.interaction_id
          ? { ...i, agent_response: response, status: 'completed' as const }
          : i
      ));
      
      setIsProcessing(false);

      // Emit event
      getGlobalEventStore().emit(
        'agent_response_received',
        'agent',
        'agent_workspace',
        'debug',
        { agent_id: selectedAgent.agent_id, response_length: response.length }
      );
    }, 1500);
  }, [selectedAgent, userInput, isProcessing]);

  // Create proposal from response
  const handleCreateProposal = useCallback((response: string) => {
    if (!selectedAgent) return;

    getGlobalProposalStore().create(
      'memory_unit',
      'agent_workspace',
      {
        memory_system: 'workspace',
        category: 'agent_output',
        volatility: 'session',
        priority: 'normal',
        canonical_summary: response,
        tags: ['agent', selectedAgent.agent_id],
        projects: [],
        spheres: []
      },
      [],
      'medium'
    );

    getGlobalEventStore().emit(
      'proposal_created_from_agent',
      'user',
      'agent_workspace',
      'info',
      { agent_id: selectedAgent.agent_id }
    );
  }, [selectedAgent]);

  return (
    <div className={`agent-workspace ${className}`} style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => onNavigateToModule?.('reflection_room')}
            style={styles.backButton}
          >
            ← Retour
          </button>
          <h1 style={styles.title}>Agent Workspace</h1>
          <span style={styles.badge}>ASSISTED REASONING</span>
        </div>
      </header>

      {/* Main Layout */}
      <div style={styles.main}>
        {/* Agent List */}
        <aside style={styles.agentList}>
          <h3 style={styles.listTitle}>Agents disponibles</h3>
          {DEMO_AGENTS.map(agent => (
            <AgentCard
              key={agent.agent_id}
              agent={agent}
              isSelected={selectedAgent?.agent_id === agent.agent_id}
              onClick={() => handleSelectAgent(agent)}
            />
          ))}
        </aside>

        {/* Chat Area */}
        <section style={styles.chatArea}>
          {selectedAgent ? (
            <>
              {/* Agent Header */}
              <div style={styles.agentHeader}>
                <span style={styles.agentIcon}>{selectedAgent.icon}</span>
                <div>
                  <h2 style={styles.agentName}>{selectedAgent.name}</h2>
                  <p style={styles.agentDesc}>{selectedAgent.description}</p>
                </div>
              </div>

              {/* Governance Notice */}
              <div style={styles.notice}>
                <span>🛡️</span>
                <span>
                  Toutes les suggestions de l'agent sont des PROPOSITIONS.
                  Vous devez les valider avant qu'elles deviennent mémoire.
                </span>
              </div>

              {/* Interactions */}
              <div style={styles.interactions}>
                {interactions.length === 0 ? (
                  <div style={styles.emptyChat}>
                    <p>Commencez une conversation avec {selectedAgent.name}</p>
                    <p style={styles.emptySuggestion}>
                      Exemples: "{selectedAgent.example_queries[0]}"
                    </p>
                  </div>
                ) : (
                  interactions.map(interaction => (
                    <InteractionBubble
                      key={interaction.interaction_id}
                      interaction={interaction}
                      onCreateProposal={() => handleCreateProposal(interaction.agent_response)}
                    />
                  ))
                )}
                {isProcessing && (
                  <div style={styles.processing}>
                    <span style={styles.spinner}>⏳</span>
                    <span>{selectedAgent.name} réfléchit...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div style={styles.inputArea}>
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.metaKey) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Posez une question à ${selectedAgent.name}...`}
                  style={styles.input}
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isProcessing}
                  style={{
                    ...styles.sendButton,
                    opacity: !userInput.trim() || isProcessing ? 0.5 : 1
                  }}
                >
                  Envoyer (⌘+Enter)
                </button>
              </div>
            </>
          ) : (
            <div style={styles.noAgent}>
              <span style={styles.noAgentIcon}>🤖</span>
              <p>Sélectionnez un agent pour commencer</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const AgentCard: React.FC<{
  agent: AgentDefinition;
  isSelected: boolean;
  onClick: () => void;
}> = ({ agent, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.agentCard,
      borderColor: isSelected ? '#4a9eff' : 'transparent',
      backgroundColor: isSelected ? '#1a2a4a' : '#1a1a2e'
    }}
  >
    <span style={styles.cardIcon}>{agent.icon}</span>
    <div style={styles.cardInfo}>
      <span style={styles.cardName}>{agent.name}</span>
      <span style={styles.cardCategory}>{agent.category}</span>
    </div>
  </div>
);

const InteractionBubble: React.FC<{
  interaction: AgentInteraction;
  onCreateProposal: () => void;
}> = ({ interaction, onCreateProposal }) => (
  <div style={styles.interaction}>
    {/* User message */}
    <div style={styles.userBubble}>
      <span style={styles.bubbleLabel}>Vous</span>
      <p style={styles.bubbleText}>{interaction.user_input}</p>
    </div>

    {/* Agent response */}
    {interaction.agent_response && (
      <div style={styles.agentBubble}>
        <span style={styles.bubbleLabel}>Agent</span>
        <p style={styles.bubbleText}>{interaction.agent_response}</p>
        <button
          onClick={onCreateProposal}
          style={styles.proposalButton}
        >
          📝 Créer une proposition
        </button>
      </div>
    )}
  </div>
);

// ============================================
// DEMO RESPONSE GENERATOR
// ============================================

function generateDemoResponse(agent: AgentDefinition, input: string): string {
  const responses: Record<string, string[]> = {
    'nova': [
      "D'après mon analyse, je suggère de structurer cette réflexion en trois axes principaux. Voulez-vous que je détaille chaque axe?",
      "Je vois plusieurs connexions possibles avec vos projets existants. Le plus pertinent semble être le lien avec CHE·NU V51.",
      "Cette idée présente un potentiel intéressant. Je recommande de la documenter dans une unité mémoire de type 'idea' avec volatilité 'medium'."
    ],
    'materials_calc': [
      "Pour un projet de cette envergure, je calcule les quantités suivantes: béton 45m³, armature 2.5 tonnes, coffrage 120m². Ces estimations sont basées sur les normes québécoises.",
      "Selon les tarifs actuels du marché québécois, le coût estimé des matériaux serait d'environ 35,000$ à 42,000$. Je recommande de valider avec 3 fournisseurs locaux.",
      "Les délais de livraison typiques pour ces matériaux sont de 2-3 semaines. Je suggère de commander avec 20% de marge pour imprévus."
    ],
    'compliance': [
      "Ce type de travaux nécessite: licence RBQ catégorie 1.2, certification CNESST pour travail en hauteur, déclaration CCQ si main-d'oeuvre syndicale. Voulez-vous la liste complète?",
      "Attention: selon le Code de construction du Québec, ce type de modification structurale requiert l'approbation d'un ingénieur. La documentation doit être conservée 10 ans.",
      "Les normes de sécurité CNESST exigent: plan de prévention, équipements de protection, formation documentée. Je peux générer un template de conformité."
    ],
    'archiviste': [
      "J'ai identifié 12 unités mémoire reliées à ce sujet. Les plus pertinentes datent de la semaine dernière et concernent l'architecture V51.",
      "Votre historique montre une progression logique: concept → prototype → validation. Je suggère de documenter la prochaine étape.",
      "Cette information pourrait être classifiée comme 'reference' avec persistance 'long-term'. Voulez-vous que je prépare la proposition?"
    ]
  };

  const agentResponses = responses[agent.agent_id] || [
    "Je comprends votre demande. Permettez-moi d'analyser cela plus en détail.",
    "C'est une question intéressante. Voici mon analyse préliminaire basée sur le contexte disponible.",
    "Je suggère d'approfondir ce sujet. Voulez-vous que je génère une proposition pour documenter cette réflexion?"
  ];

  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0a0a1a',
    color: '#e0e0e0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #333',
    backgroundColor: '#0f0f1a'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  backButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#888',
    cursor: 'pointer'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0
  },
  badge: {
    fontSize: '10px',
    padding: '3px 8px',
    backgroundColor: '#4a4a6a',
    borderRadius: '4px',
    color: '#a0a0ff'
  },
  main: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    overflow: 'hidden'
  },
  agentList: {
    padding: '15px',
    borderRight: '1px solid #333',
    overflow: 'auto'
  },
  listTitle: {
    fontSize: '14px',
    marginBottom: '15px'
  },
  agentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  cardIcon: {
    fontSize: '24px'
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardName: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cardCategory: {
    fontSize: '11px',
    color: '#888'
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  agentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 20px',
    borderBottom: '1px solid #333'
  },
  agentIcon: {
    fontSize: '32px'
  },
  agentName: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0
  },
  agentDesc: {
    fontSize: '12px',
    color: '#888',
    margin: 0
  },
  notice: {
    display: 'flex',
    gap: '10px',
    padding: '10px 20px',
    backgroundColor: '#1a2e1a',
    borderBottom: '1px solid #333',
    fontSize: '12px',
    color: '#81c784'
  },
  interactions: {
    flex: 1,
    padding: '20px',
    overflow: 'auto'
  },
  emptyChat: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  emptySuggestion: {
    fontSize: '13px',
    fontStyle: 'italic',
    marginTop: '10px'
  },
  interaction: {
    marginBottom: '20px'
  },
  userBubble: {
    marginBottom: '10px'
  },
  agentBubble: {
    backgroundColor: '#1a1a2e',
    padding: '15px',
    borderRadius: '8px',
    marginLeft: '20px'
  },
  bubbleLabel: {
    fontSize: '11px',
    color: '#888',
    marginBottom: '5px',
    display: 'block'
  },
  bubbleText: {
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0
  },
  proposalButton: {
    marginTop: '10px',
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#4a4a6a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  processing: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    color: '#888'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  },
  inputArea: {
    padding: '15px 20px',
    borderTop: '1px solid #333',
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e0e0e0',
    resize: 'none',
    minHeight: '60px'
  },
  sendButton: {
    padding: '12px 20px',
    fontSize: '13px',
    backgroundColor: '#4a6a4a',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    alignSelf: 'flex-end'
  },
  noAgent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666'
  },
  noAgentIcon: {
    fontSize: '48px',
    marginBottom: '15px',
    opacity: 0.5
  }
};

export default AgentWorkspacePage;
