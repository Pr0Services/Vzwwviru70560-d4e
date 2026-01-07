/**
 * CHE·NU™ R&D Workspace - Phase 5: Perfectionnement
 * 
 * Objectif: Améliorer la meilleure option
 * 
 * Interface:
 * - Focus sur 1-2 solutions
 * - Itérations
 * - Ajustements ciblés
 * - Suivi des modifications
 * 
 * Agent R&D autorisé:
 * - Suggestions d'optimisation
 * - Détection de risques cachés
 * - Vérification de cohérence
 * 
 * Modules quantitatifs:
 * - Optimisation
 * - Tests de scénarios
 * - Raffinement de paramètres
 * 
 * 👉 Travail fin, pas exploration.
 */

import React, { useState } from 'react';
import { RnDIdea, RefinementIteration } from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  refinementRed: '#EF4444',
};

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
  
  // Focus selection
  focusSection: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
  },
  focusTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E8E6E1',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  focusHint: {
    fontSize: '13px',
    color: '#9CA3AF',
    marginBottom: '16px',
  },
  solutionSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
  },
  solutionOption: {
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `2px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  solutionOptionSelected: {
    borderColor: CHENU_COLORS.refinementRed,
    backgroundColor: `${CHENU_COLORS.refinementRed}10`,
  },
  solutionRank: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: `${CHENU_COLORS.ancientStone}30`,
    fontSize: '12px',
    fontWeight: 600,
    color: '#9CA3AF',
    marginRight: '10px',
  },
  solutionContent: {
    fontSize: '14px',
    color: '#E8E6E1',
    lineHeight: 1.5,
  },
  solutionScore: {
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
    marginTop: '8px',
  },
  
  // Main layout
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  
  // Solution focus card
  focusCard: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    padding: '20px',
    border: `2px solid ${CHENU_COLORS.refinementRed}40`,
  },
  focusCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  focusLabel: {
    padding: '4px 10px',
    backgroundColor: `${CHENU_COLORS.refinementRed}20`,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.refinementRed,
  },
  focusContent: {
    fontSize: '15px',
    color: '#E8E6E1',
    lineHeight: 1.6,
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
  },
  
  // New iteration form
  iterationForm: {
    padding: '16px',
    backgroundColor: '#0D0D0E',
    borderRadius: '8px',
    marginTop: '16px',
  },
  formTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E8E6E1',
    marginBottom: '12px',
  },
  formGroup: {
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
    fontFamily: 'inherit',
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
  submitButton: {
    padding: '10px 20px',
    backgroundColor: CHENU_COLORS.refinementRed,
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-end',
    marginTop: '8px',
  },
  
  // Iterations timeline
  timelineSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timeline: {
    position: 'relative' as const,
  },
  timelineConnector: {
    position: 'absolute' as const,
    left: '15px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: `${CHENU_COLORS.ancientStone}40`,
  },
  iterationCard: {
    position: 'relative' as const,
    marginLeft: '40px',
    padding: '16px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
    marginBottom: '16px',
  },
  iterationDot: {
    position: 'absolute' as const,
    left: '-32px',
    top: '20px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.refinementRed,
    border: '3px solid #111113',
  },
  iterationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  iterationVersion: {
    fontSize: '14px',
    fontWeight: 700,
    color: CHENU_COLORS.refinementRed,
  },
  iterationDate: {
    fontSize: '11px',
    color: '#6B7280',
  },
  iterationChanges: {
    fontSize: '14px',
    color: '#E8E6E1',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  iterationRationale: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontStyle: 'italic' as const,
    paddingLeft: '12px',
    borderLeft: `2px solid ${CHENU_COLORS.ancientStone}40`,
    marginBottom: '10px',
  },
  
  // Risks section
  risksSection: {
    padding: '12px',
    backgroundColor: `${CHENU_COLORS.refinementRed}08`,
    borderRadius: '6px',
    marginTop: '10px',
  },
  risksTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.refinementRed,
    marginBottom: '8px',
  },
  riskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '12px',
    color: '#E8E6E1',
    marginBottom: '4px',
  },
  riskIcon: {
    color: CHENU_COLORS.refinementRed,
    flexShrink: 0,
  },
  
  // Agent suggestions
  suggestionsSection: {
    padding: '12px',
    backgroundColor: `${CHENU_COLORS.sacredGold}08`,
    borderRadius: '6px',
    marginTop: '10px',
  },
  suggestionsTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  suggestionItem: {
    fontSize: '12px',
    color: '#E8E6E1',
    marginBottom: '6px',
    paddingLeft: '12px',
    position: 'relative' as const,
  },
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#6B7280',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface RnDPhase5RefinementProps {
  focusedSolutions: string[];
  iterations: RefinementIteration[];
  allSolutions: RnDIdea[];
  rankings: { solution_id: string; total_score: number }[];
  onUpdateFocused: (focused: string[]) => void;
  onAddIteration: (iteration: RefinementIteration) => void;
  onAskAgent: () => void;
  onOpenQuantitative: () => void;
}

export const RnDPhase5Refinement: React.FC<RnDPhase5RefinementProps> = ({
  focusedSolutions,
  iterations,
  allSolutions,
  rankings,
  onUpdateFocused,
  onAddIteration,
  onAskAgent,
  onOpenQuantitative,
}) => {
  const [newIteration, setNewIteration] = useState({
    solutionId: '',
    changes: '',
    rationale: '',
  });
  
  // Sort solutions by ranking
  const sortedSolutions = [...allSolutions].sort((a, b) => {
    const rankA = rankings.find(r => r.solution_id === a.id)?.total_score ?? 0;
    const rankB = rankings.find(r => r.solution_id === b.id)?.total_score ?? 0;
    return rankB - rankA;
  });
  
  const toggleFocus = (solutionId: string) => {
    if (focusedSolutions.includes(solutionId)) {
      onUpdateFocused(focusedSolutions.filter(id => id !== solutionId));
    } else if (focusedSolutions.length < 2) {
      onUpdateFocused([...focusedSolutions, solutionId]);
    }
  };
  
  const handleSubmitIteration = (solutionId: string) => {
    if (!newIteration.changes.trim()) return;
    
    const solutionIterations = iterations.filter(i => i.solution_id === solutionId);
    const nextVersion = solutionIterations.length + 1;
    
    const iteration: RefinementIteration = {
      id: `iter-${Date.now()}`,
      solution_id: solutionId,
      version: nextVersion,
      changes: newIteration.changes,
      rationale: newIteration.rationale,
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      risks_detected: [],
    };
    
    onAddIteration(iteration);
    setNewIteration({ solutionId: '', changes: '', rationale: '' });
  };
  
  const getSolutionIterations = (solutionId: string) => {
    return iterations
      .filter(i => i.solution_id === solutionId)
      .sort((a, b) => b.version - a.version);
  };
  
  const getRankPosition = (solutionId: string): number => {
    const index = rankings.findIndex(r => r.solution_id === solutionId);
    return index + 1;
  };
  
  const getSolutionScore = (solutionId: string): number => {
    return rankings.find(r => r.solution_id === solutionId)?.total_score ?? 0;
  };
  
  if (allSolutions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🔴 Perfectionnement</h2>
          </div>
        </div>
        <div style={styles.emptyState}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            Aucune solution à perfectionner
          </p>
          <p style={{ fontSize: '13px' }}>
            Complétez d'abord les phases précédentes
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
          <h2 style={styles.title}>🔴 Perfectionnement</h2>
          <p style={styles.subtitle}>
            Focalisez sur 1-2 solutions et itérez pour les améliorer. 
            Travail fin, pas exploration.
          </p>
        </div>
        
        <div style={styles.headerActions}>
          <button
            style={{ ...styles.actionButton, ...styles.agentButton }}
            onClick={onAskAgent}
          >
            🤖 Suggestions d'optimisation
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.quantButton }}
            onClick={onOpenQuantitative}
          >
            📐 Tests de scénarios
          </button>
        </div>
      </div>
      
      {/* Focus Selection */}
      {focusedSolutions.length === 0 && (
        <div style={styles.focusSection}>
          <h3 style={styles.focusTitle}>
            🎯 Sélectionnez 1-2 solutions à perfectionner
          </h3>
          <p style={styles.focusHint}>
            Choisissez les meilleures options issues de la comparaison
          </p>
          <div style={styles.solutionSelector}>
            {sortedSolutions.slice(0, 4).map((solution) => {
              const isSelected = focusedSolutions.includes(solution.id);
              const rank = getRankPosition(solution.id);
              const score = getSolutionScore(solution.id);
              
              return (
                <div
                  key={solution.id}
                  style={{
                    ...styles.solutionOption,
                    ...(isSelected ? styles.solutionOptionSelected : {}),
                  }}
                  onClick={() => toggleFocus(solution.id)}
                >
                  <span style={styles.solutionRank}>#{rank}</span>
                  <span style={styles.solutionContent}>
                    {solution.content.slice(0, 80)}...
                  </span>
                  <div style={styles.solutionScore}>
                    Score: {score}/100
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Focused Solutions Work Area */}
      {focusedSolutions.length > 0 && (
        <div style={styles.mainLayout}>
          {/* Focus Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {focusedSolutions.map(solutionId => {
              const solution = allSolutions.find(s => s.id === solutionId);
              if (!solution) return null;
              
              const solutionIterations = getSolutionIterations(solutionId);
              const currentVersion = solutionIterations.length + 1;
              
              return (
                <div key={solutionId} style={styles.focusCard}>
                  <div style={styles.focusCardHeader}>
                    <span style={styles.focusLabel}>
                      EN FOCUS — v{currentVersion}
                    </span>
                    <button
                      style={{
                        ...styles.actionButton,
                        padding: '6px 12px',
                        fontSize: '12px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${CHENU_COLORS.ancientStone}40`,
                        color: '#9CA3AF',
                      }}
                      onClick={() => toggleFocus(solutionId)}
                    >
                      ✗ Retirer
                    </button>
                  </div>
                  
                  <div style={styles.focusContent}>
                    {solution.content}
                  </div>
                  
                  {/* New Iteration Form */}
                  <div style={styles.iterationForm}>
                    <h4 style={styles.formTitle}>
                      + Nouvelle itération (v{currentVersion})
                    </h4>
                    <div style={styles.formGroup}>
                      <textarea
                        placeholder="Décrivez les modifications apportées..."
                        value={newIteration.solutionId === solutionId ? newIteration.changes : ''}
                        onChange={(e) => setNewIteration({
                          solutionId,
                          changes: e.target.value,
                          rationale: newIteration.solutionId === solutionId ? newIteration.rationale : '',
                        })}
                        style={styles.textarea}
                      />
                      <input
                        type="text"
                        placeholder="Justification (pourquoi ce changement?)"
                        value={newIteration.solutionId === solutionId ? newIteration.rationale : ''}
                        onChange={(e) => setNewIteration(prev => ({
                          ...prev,
                          rationale: e.target.value,
                        }))}
                        style={styles.input}
                      />
                      <button
                        style={{
                          ...styles.submitButton,
                          opacity: newIteration.solutionId === solutionId && newIteration.changes ? 1 : 0.5,
                        }}
                        onClick={() => handleSubmitIteration(solutionId)}
                        disabled={newIteration.solutionId !== solutionId || !newIteration.changes}
                      >
                        Enregistrer l'itération
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Timeline Sidebar */}
          <div style={styles.timelineSection}>
            <h3 style={styles.timelineTitle}>
              📜 Historique des itérations
            </h3>
            
            {focusedSolutions.map(solutionId => {
              const solutionIterations = getSolutionIterations(solutionId);
              const solution = allSolutions.find(s => s.id === solutionId);
              
              if (solutionIterations.length === 0) {
                return (
                  <div key={solutionId} style={{
                    padding: '16px',
                    backgroundColor: CHENU_COLORS.nightSlate,
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}>
                    Aucune itération pour "{solution?.content.slice(0, 30)}..."
                  </div>
                );
              }
              
              return (
                <div key={solutionId} style={styles.timeline}>
                  <div style={styles.timelineConnector} />
                  
                  {solutionIterations.map(iteration => (
                    <div key={iteration.id} style={styles.iterationCard}>
                      <div style={styles.iterationDot} />
                      
                      <div style={styles.iterationHeader}>
                        <span style={styles.iterationVersion}>
                          Version {iteration.version}
                        </span>
                        <span style={styles.iterationDate}>
                          {new Date(iteration.created_at).toLocaleDateString('fr-CA')}
                        </span>
                      </div>
                      
                      <p style={styles.iterationChanges}>
                        {iteration.changes}
                      </p>
                      
                      {iteration.rationale && (
                        <p style={styles.iterationRationale}>
                          {iteration.rationale}
                        </p>
                      )}
                      
                      {iteration.risks_detected.length > 0 && (
                        <div style={styles.risksSection}>
                          <div style={styles.risksTitle}>
                            ⚠️ Risques détectés
                          </div>
                          {iteration.risks_detected.map((risk, i) => (
                            <div key={i} style={styles.riskItem}>
                              <span style={styles.riskIcon}>•</span>
                              {risk}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {iteration.agent_suggestions && iteration.agent_suggestions.length > 0 && (
                        <div style={styles.suggestionsSection}>
                          <div style={styles.suggestionsTitle}>
                            🤖 Suggestions agent
                          </div>
                          {iteration.agent_suggestions.map((suggestion, i) => (
                            <div key={i} style={styles.suggestionItem}>
                              → {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RnDPhase5Refinement;
