/**
 * CHE·NU™ R&D Workspace - Phase 3: Génération d'Exemples
 * 
 * Objectif: Tester les idées sélectionnées par le concret
 * 
 * Interface:
 * - Une section par idée
 * - Scénarios
 * - Exemples concrets
 * - Cas limites
 * - Hypothèses testables
 * 
 * Agent R&D autorisé:
 * - Générer variantes
 * - Proposer contre-exemples
 * - Simuler scénarios
 * 
 * Modules quantitatifs (optionnels):
 * - Calculs simples
 * - Simulations paramétriques
 * - Estimation d'ordre de grandeur
 * 
 * 👉 On confronte l'idée au réel.
 */

import React, { useState } from 'react';
import { RnDIdea, RnDScenario, ScenarioType } from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  examplesGreen: '#22C55E',
};

const SCENARIO_TYPES: { type: ScenarioType; label: string; icon: string; color: string }[] = [
  { type: 'standard', label: 'Standard', icon: '📋', color: '#3B82F6' },
  { type: 'edge_case', label: 'Cas Limite', icon: '⚠️', color: '#F97316' },
  { type: 'counter_example', label: 'Contre-exemple', icon: '🔄', color: '#EF4444' },
  { type: 'simulation', label: 'Simulation', icon: '🔬', color: '#A855F7' },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9CA3AF',
    maxWidth: '600px',
    lineHeight: 1.5,
    marginTop: '8px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  agentButton: {
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    border: `1px solid ${CHENU_COLORS.sacredGold}30`,
    color: CHENU_COLORS.sacredGold,
  },
  quantButton: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}15`,
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}30`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  
  // Ideas accordion
  ideaSection: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    overflow: 'hidden',
  },
  ideaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#111113',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  ideaTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  ideaBadge: {
    padding: '4px 10px',
    backgroundColor: `${CHENU_COLORS.examplesGreen}20`,
    borderRadius: '4px',
    fontSize: '12px',
    color: CHENU_COLORS.examplesGreen,
    fontWeight: 500,
  },
  ideaContent: {
    padding: '20px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  
  // Scenario input
  addScenarioSection: {
    padding: '16px',
    backgroundColor: '#0D0D0E',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  typeSelector: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  typeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '6px',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease',
  },
  typeButtonActive: {
    backgroundColor: `${CHENU_COLORS.examplesGreen}15`,
    borderColor: CHENU_COLORS.examplesGreen,
    color: CHENU_COLORS.examplesGreen,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  input: {
    padding: '12px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '6px',
    color: '#E8E6E1',
    fontSize: '14px',
  },
  textarea: {
    padding: '12px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '6px',
    color: '#E8E6E1',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: CHENU_COLORS.examplesGreen,
    border: 'none',
    borderRadius: '6px',
    color: '#111113',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-end',
    marginTop: '8px',
  },
  
  // Scenarios list
  scenariosList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  scenarioCard: {
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
    transition: 'border-color 0.2s ease',
  },
  scenarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  scenarioType: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },
  scenarioTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E8E6E1',
    marginBottom: '8px',
  },
  scenarioDescription: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  scenarioHypothesis: {
    padding: '10px 12px',
    backgroundColor: `${CHENU_COLORS.examplesGreen}08`,
    borderRadius: '6px',
    borderLeft: `3px solid ${CHENU_COLORS.examplesGreen}`,
    marginBottom: '10px',
  },
  hypothesisLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.examplesGreen,
    fontWeight: 600,
    marginBottom: '4px',
  },
  hypothesisText: {
    fontSize: '13px',
    color: '#E8E6E1',
  },
  scenarioOutcome: {
    display: 'flex',
    gap: '16px',
  },
  outcomeBox: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: '#0D0D0E',
    borderRadius: '6px',
  },
  outcomeLabel: {
    fontSize: '11px',
    color: '#6B7280',
    marginBottom: '4px',
  },
  outcomeText: {
    fontSize: '13px',
    color: '#E8E6E1',
  },
  scenarioMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}20`,
    fontSize: '11px',
    color: '#6B7280',
  },
  agentGenerated: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    borderRadius: '4px',
    color: CHENU_COLORS.sacredGold,
    fontSize: '11px',
  },
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#6B7280',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface RnDPhase3ExamplesProps {
  selectedIdeas: RnDIdea[];
  scenarios: RnDScenario[];
  onAddScenario: (scenario: RnDScenario) => void;
  onAskAgent: () => void;
  onOpenQuantitative: () => void;
}

export const RnDPhase3Examples: React.FC<RnDPhase3ExamplesProps> = ({
  selectedIdeas,
  scenarios,
  onAddScenario,
  onAskAgent,
  onOpenQuantitative,
}) => {
  const [expandedIdeas, setExpandedIdeas] = useState<Record<string, boolean>>(
    Object.fromEntries(selectedIdeas.map(i => [i.id, true]))
  );
  const [newScenario, setNewScenario] = useState<{
    ideaId: string;
    type: ScenarioType;
    title: string;
    description: string;
    hypothesis: string;
    expected: string;
  }>({
    ideaId: '',
    type: 'standard',
    title: '',
    description: '',
    hypothesis: '',
    expected: '',
  });
  
  const toggleIdea = (ideaId: string) => {
    setExpandedIdeas(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }));
  };
  
  const handleAddScenario = (ideaId: string) => {
    if (!newScenario.title.trim() || !newScenario.hypothesis.trim()) {
      return;
    }
    
    const scenario: RnDScenario = {
      id: `scenario-${Date.now()}`,
      idea_id: ideaId,
      type: newScenario.type,
      title: newScenario.title,
      description: newScenario.description,
      hypothesis: newScenario.hypothesis,
      expected_outcome: newScenario.expected,
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      agent_generated: false,
    };
    
    onAddScenario(scenario);
    setNewScenario({
      ideaId: '',
      type: 'standard',
      title: '',
      description: '',
      hypothesis: '',
      expected: '',
    });
  };
  
  const getTypeInfo = (type: ScenarioType) => {
    return SCENARIO_TYPES.find(t => t.type === type) || SCENARIO_TYPES[0];
  };
  
  const getScenariosForIdea = (ideaId: string) => {
    return scenarios.filter(s => s.idea_id === ideaId);
  };
  
  if (selectedIdeas.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🟢 Génération d'Exemples</h2>
          </div>
        </div>
        <div style={styles.emptyState}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            Aucune idée sélectionnée
          </p>
          <p style={{ fontSize: '13px' }}>
            Retournez à la Phase 2 pour sélectionner des idées à tester
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🟢 Génération d'Exemples</h2>
          <p style={styles.subtitle}>
            Testez chaque idée avec des scénarios concrets, cas limites et 
            contre-exemples. L'agent peut générer des variantes et simuler.
          </p>
        </div>
        
        <div style={styles.headerActions}>
          <button
            style={{ ...styles.actionButton, ...styles.agentButton }}
            onClick={onAskAgent}
          >
            🤖 Générer variantes
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.quantButton }}
            onClick={onOpenQuantitative}
          >
            📐 Simulation paramétrique
          </button>
        </div>
      </div>
      
      {/* Ideas with scenarios */}
      {selectedIdeas.map(idea => {
        const ideaScenarios = getScenariosForIdea(idea.id);
        const isExpanded = expandedIdeas[idea.id];
        
        return (
          <div key={idea.id} style={styles.ideaSection}>
            <div
              style={styles.ideaHeader}
              onClick={() => toggleIdea(idea.id)}
            >
              <span style={styles.ideaTitle}>
                {isExpanded ? '▼' : '▶'}
                {idea.content.slice(0, 60)}...
              </span>
              <span style={styles.ideaBadge}>
                {ideaScenarios.length} scénarios
              </span>
            </div>
            
            {isExpanded && (
              <div style={styles.ideaContent}>
                {/* Add scenario form */}
                <div style={styles.addScenarioSection}>
                  <div style={styles.typeSelector}>
                    {SCENARIO_TYPES.map(({ type, label, icon, color }) => (
                      <button
                        key={type}
                        style={{
                          ...styles.typeButton,
                          ...(newScenario.ideaId === idea.id && newScenario.type === type
                            ? {
                                ...styles.typeButtonActive,
                                borderColor: color,
                                color: color,
                              }
                            : {}),
                        }}
                        onClick={() => setNewScenario(prev => ({
                          ...prev,
                          ideaId: idea.id,
                          type,
                        }))}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                  
                  {newScenario.ideaId === idea.id && (
                    <div style={styles.inputGroup}>
                      <input
                        type="text"
                        placeholder="Titre du scénario"
                        value={newScenario.title}
                        onChange={(e) => setNewScenario(prev => ({
                          ...prev,
                          title: e.target.value,
                        }))}
                        style={styles.input}
                      />
                      <textarea
                        placeholder="Description du scénario..."
                        value={newScenario.description}
                        onChange={(e) => setNewScenario(prev => ({
                          ...prev,
                          description: e.target.value,
                        }))}
                        style={styles.textarea}
                      />
                      <input
                        type="text"
                        placeholder="Hypothèse testable (obligatoire)"
                        value={newScenario.hypothesis}
                        onChange={(e) => setNewScenario(prev => ({
                          ...prev,
                          hypothesis: e.target.value,
                        }))}
                        style={{
                          ...styles.input,
                          borderColor: `${CHENU_COLORS.examplesGreen}40`,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Résultat attendu"
                        value={newScenario.expected}
                        onChange={(e) => setNewScenario(prev => ({
                          ...prev,
                          expected: e.target.value,
                        }))}
                        style={styles.input}
                      />
                      <button
                        style={{
                          ...styles.addButton,
                          opacity: newScenario.title && newScenario.hypothesis ? 1 : 0.5,
                        }}
                        onClick={() => handleAddScenario(idea.id)}
                        disabled={!newScenario.title || !newScenario.hypothesis}
                      >
                        + Ajouter scénario
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Scenarios list */}
                <div style={styles.scenariosList}>
                  {ideaScenarios.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>Aucun scénario pour cette idée</p>
                      <p style={{ fontSize: '12px', marginTop: '4px' }}>
                        Créez des scénarios ou demandez à l'agent d'en générer
                      </p>
                    </div>
                  ) : (
                    ideaScenarios.map(scenario => {
                      const typeInfo = getTypeInfo(scenario.type);
                      
                      return (
                        <div
                          key={scenario.id}
                          style={styles.scenarioCard}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = typeInfo.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${CHENU_COLORS.ancientStone}30`;
                          }}
                        >
                          <div style={styles.scenarioHeader}>
                            <h4 style={styles.scenarioTitle}>{scenario.title}</h4>
                            <span
                              style={{
                                ...styles.scenarioType,
                                backgroundColor: `${typeInfo.color}15`,
                                color: typeInfo.color,
                              }}
                            >
                              {typeInfo.icon} {typeInfo.label}
                            </span>
                          </div>
                          
                          {scenario.description && (
                            <p style={styles.scenarioDescription}>
                              {scenario.description}
                            </p>
                          )}
                          
                          <div style={styles.scenarioHypothesis}>
                            <div style={styles.hypothesisLabel}>HYPOTHÈSE</div>
                            <div style={styles.hypothesisText}>
                              {scenario.hypothesis}
                            </div>
                          </div>
                          
                          <div style={styles.scenarioOutcome}>
                            {scenario.expected_outcome && (
                              <div style={styles.outcomeBox}>
                                <div style={styles.outcomeLabel}>Attendu</div>
                                <div style={styles.outcomeText}>
                                  {scenario.expected_outcome}
                                </div>
                              </div>
                            )}
                            {scenario.actual_outcome && (
                              <div style={styles.outcomeBox}>
                                <div style={styles.outcomeLabel}>Observé</div>
                                <div style={styles.outcomeText}>
                                  {scenario.actual_outcome}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div style={styles.scenarioMeta}>
                            <span>
                              {new Date(scenario.created_at).toLocaleDateString('fr-CA')}
                            </span>
                            {scenario.agent_generated && (
                              <span style={styles.agentGenerated}>
                                🤖 Généré par l'agent
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RnDPhase3Examples;
