/**
 * CHE·NU™ R&D Workspace - Phase 2: Sélection
 * 
 * Objectif: Choisir ce qui mérite d'être approfondi
 * 
 * Interface:
 * - Liste issue de la phase 1
 * - Critères explicites configurables
 * - Votes / pondérations humaines
 * - Justification textuelle OBLIGATOIRE
 * 
 * Résultat:
 * - Shortlist
 * - Idées rejetées archivées ET VISIBLES
 * 
 * La sélection est argumentée, jamais instinctive.
 */

import React, { useState } from 'react';
import {
  RnDIdea,
  SelectionCriterion,
  IdeaSelection,
  IdeaVote,
  DEFAULT_SELECTION_CRITERIA,
} from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  selectionYellow: '#EAB308',
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
  askAgentButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    border: `1px solid ${CHENU_COLORS.sacredGold}30`,
    borderRadius: '8px',
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
    fontSize: '13px',
  },
  
  // Criteria section
  criteriaSection: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
  },
  criteriaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  criteriaTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E8E6E1',
  },
  criteriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  criterionCard: {
    padding: '14px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  criterionName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E8E6E1',
    marginBottom: '8px',
  },
  criterionWeight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  weightSlider: {
    flex: 1,
    accentColor: CHENU_COLORS.selectionYellow,
  },
  weightValue: {
    fontSize: '13px',
    color: CHENU_COLORS.selectionYellow,
    fontWeight: 600,
    minWidth: '36px',
  },
  
  // Layout
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  
  // Ideas to evaluate
  ideasSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ideaEvalCard: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  ideaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  ideaContent: {
    fontSize: '15px',
    color: '#E8E6E1',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  ideaStatus: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
  },
  statusPending: {
    backgroundColor: `${CHENU_COLORS.ancientStone}30`,
    color: '#9CA3AF',
  },
  statusSelected: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  statusRejected: {
    backgroundColor: '#EF444420',
    color: '#EF4444',
  },
  
  // Voting section within card
  votingSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
  },
  votingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  votingCriterion: {
    fontSize: '13px',
    color: '#9CA3AF',
    width: '100px',
  },
  votingStars: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  justificationInput: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0D0D0E',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '6px',
    color: '#E8E6E1',
    fontSize: '13px',
    marginTop: '8px',
  },
  
  // Action buttons
  ideaActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  actionButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectButton: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: '#111113',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}60`,
    color: '#9CA3AF',
  },
  
  // Shortlist sidebar
  shortlistSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  shortlistCard: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}40`,
  },
  shortlistTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  shortlistItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#111113',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  shortlistText: {
    fontSize: '13px',
    color: '#E8E6E1',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  shortlistScore: {
    fontSize: '14px',
    fontWeight: 700,
    color: CHENU_COLORS.selectionYellow,
    marginLeft: '12px',
  },
  
  // Rejected section
  rejectedSection: {
    backgroundColor: '#111113',
    borderRadius: '10px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  rejectedTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#9CA3AF',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rejectedItem: {
    padding: '10px 12px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '6px',
    marginBottom: '8px',
  },
  rejectedText: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '6px',
  },
  rejectedReason: {
    fontSize: '11px',
    color: '#EF4444',
    fontStyle: 'italic' as const,
  },
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#6B7280',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface RnDPhase2SelectionProps {
  ideas: RnDIdea[];
  criteria: SelectionCriterion[];
  selections: IdeaSelection[];
  shortlist: string[];
  onUpdateCriteria: (criteria: SelectionCriterion[]) => void;
  onUpdateSelections: (selections: IdeaSelection[]) => void;
  onUpdateShortlist: (shortlist: string[]) => void;
  onAskAgent: () => void;
}

export const RnDPhase2Selection: React.FC<RnDPhase2SelectionProps> = ({
  ideas,
  criteria,
  selections,
  shortlist,
  onUpdateCriteria,
  onUpdateSelections,
  onUpdateShortlist,
  onAskAgent,
}) => {
  const [votingState, setVotingState] = useState<Record<string, Record<string, number>>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  
  const handleWeightChange = (criterionId: string, weight: number) => {
    const updated = criteria.map(c =>
      c.id === criterionId ? { ...c, weight } : c
    );
    onUpdateCriteria(updated);
  };
  
  const handleVote = (ideaId: string, criterionId: string, score: number) => {
    setVotingState(prev => ({
      ...prev,
      [ideaId]: {
        ...(prev[ideaId] || {}),
        [criterionId]: score,
      },
    }));
  };
  
  const calculateScore = (ideaId: string): number => {
    const votes = votingState[ideaId] || {};
    let totalScore = 0;
    let totalWeight = 0;
    
    criteria.forEach(c => {
      const vote = votes[c.id];
      if (vote !== undefined) {
        totalScore += vote * c.weight;
        totalWeight += c.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 20) : 0;
  };
  
  const handleSelect = (ideaId: string) => {
    const justification = justifications[ideaId];
    if (!justification?.trim()) {
      alert('Justification obligatoire pour sélectionner une idée');
      return;
    }
    
    const votes = votingState[ideaId] || {};
    const allVoted = criteria.every(c => votes[c.id] !== undefined);
    if (!allVoted) {
      alert('Veuillez voter sur tous les critères');
      return;
    }
    
    const score = calculateScore(ideaId);
    
    const newSelection: IdeaSelection = {
      idea_id: ideaId,
      status: 'selected',
      total_score: score,
      votes: criteria.map(c => ({
        idea_id: ideaId,
        voter_id: 'current-user',
        criterion_id: c.id,
        score: votes[c.id],
        justification: justification,
        voted_at: new Date().toISOString(),
      })),
    };
    
    const updatedSelections = selections.filter(s => s.idea_id !== ideaId);
    onUpdateSelections([...updatedSelections, newSelection]);
    onUpdateShortlist([...shortlist, ideaId]);
  };
  
  const handleReject = (ideaId: string) => {
    const reason = rejectReasons[ideaId];
    if (!reason?.trim()) {
      alert('Raison du rejet obligatoire');
      return;
    }
    
    const newSelection: IdeaSelection = {
      idea_id: ideaId,
      status: 'rejected',
      total_score: 0,
      votes: [],
      rejection_reason: reason,
    };
    
    const updatedSelections = selections.filter(s => s.idea_id !== ideaId);
    onUpdateSelections([...updatedSelections, newSelection]);
  };
  
  const getIdeaStatus = (ideaId: string): 'pending' | 'selected' | 'rejected' => {
    const selection = selections.find(s => s.idea_id === ideaId);
    return selection?.status || 'pending';
  };
  
  const pendingIdeas = ideas.filter(i => getIdeaStatus(i.id) === 'pending');
  const selectedIdeas = ideas.filter(i => getIdeaStatus(i.id) === 'selected');
  const rejectedIdeas = ideas.filter(i => getIdeaStatus(i.id) === 'rejected');
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            🟡 Sélection
          </h2>
          <p style={styles.subtitle}>
            Évaluez chaque idée selon les critères configurés. La justification 
            textuelle est OBLIGATOIRE. Les idées rejetées restent visibles.
          </p>
        </div>
        
        <button style={styles.askAgentButton} onClick={onAskAgent}>
          🤖 Synthèse comparative
        </button>
      </div>
      
      {/* Criteria Configuration */}
      <div style={styles.criteriaSection}>
        <div style={styles.criteriaHeader}>
          <span style={styles.criteriaTitle}>⚖️ Critères d'évaluation</span>
        </div>
        
        <div style={styles.criteriaGrid}>
          {criteria.map(c => (
            <div key={c.id} style={styles.criterionCard}>
              <div style={styles.criterionName}>{c.name}</div>
              <div style={styles.criterionWeight}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.weight}
                  onChange={(e) => handleWeightChange(c.id, parseInt(e.target.value))}
                  style={styles.weightSlider}
                />
                <span style={styles.weightValue}>{c.weight}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Layout */}
      <div style={styles.mainLayout}>
        {/* Ideas to evaluate */}
        <div style={styles.ideasSection}>
          <h3 style={styles.sectionTitle}>
            📋 Idées à évaluer ({pendingIdeas.length})
          </h3>
          
          {pendingIdeas.length === 0 ? (
            <div style={styles.emptyState}>
              Toutes les idées ont été évaluées ✓
            </div>
          ) : (
            pendingIdeas.map(idea => {
              const votes = votingState[idea.id] || {};
              
              return (
                <div key={idea.id} style={styles.ideaEvalCard}>
                  <div style={styles.ideaHeader}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      {idea.type.toUpperCase()}
                    </span>
                    <span style={{ ...styles.ideaStatus, ...styles.statusPending }}>
                      En attente
                    </span>
                  </div>
                  
                  <p style={styles.ideaContent}>{idea.content}</p>
                  
                  {/* Voting */}
                  <div style={styles.votingSection}>
                    {criteria.map(c => (
                      <div key={c.id} style={styles.votingRow}>
                        <span style={styles.votingCriterion}>{c.name}</span>
                        <div style={styles.votingStars}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              style={{
                                ...styles.star,
                                color: (votes[c.id] || 0) >= star 
                                  ? CHENU_COLORS.selectionYellow 
                                  : '#4B5563',
                              }}
                              onClick={() => handleVote(idea.id, c.id, star)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <input
                      type="text"
                      placeholder="Justification (obligatoire pour sélection)"
                      value={justifications[idea.id] || ''}
                      onChange={(e) => setJustifications(prev => ({
                        ...prev,
                        [idea.id]: e.target.value,
                      }))}
                      style={styles.justificationInput}
                    />
                    
                    <input
                      type="text"
                      placeholder="Raison du rejet (obligatoire pour rejeter)"
                      value={rejectReasons[idea.id] || ''}
                      onChange={(e) => setRejectReasons(prev => ({
                        ...prev,
                        [idea.id]: e.target.value,
                      }))}
                      style={{
                        ...styles.justificationInput,
                        borderColor: '#EF444440',
                      }}
                    />
                  </div>
                  
                  <div style={styles.ideaActions}>
                    <button
                      style={{ ...styles.actionButton, ...styles.selectButton }}
                      onClick={() => handleSelect(idea.id)}
                    >
                      ✓ Sélectionner ({calculateScore(idea.id)}pts)
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.rejectButton }}
                      onClick={() => handleReject(idea.id)}
                    >
                      ✗ Rejeter
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Shortlist Sidebar */}
        <div style={styles.shortlistSection}>
          {/* Selected */}
          <div style={styles.shortlistCard}>
            <h4 style={styles.shortlistTitle}>
              ✓ Shortlist ({selectedIdeas.length})
            </h4>
            {selectedIdeas.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Aucune idée sélectionnée
              </p>
            ) : (
              selectedIdeas.map(idea => {
                const selection = selections.find(s => s.idea_id === idea.id);
                return (
                  <div key={idea.id} style={styles.shortlistItem}>
                    <span style={styles.shortlistText}>{idea.content}</span>
                    <span style={styles.shortlistScore}>
                      {selection?.total_score || 0}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Rejected (always visible) */}
          <div style={styles.rejectedSection}>
            <h4 style={styles.rejectedTitle}>
              📦 Archivées ({rejectedIdeas.length})
            </h4>
            {rejectedIdeas.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#4B5563' }}>
                Aucune idée rejetée
              </p>
            ) : (
              rejectedIdeas.map(idea => {
                const selection = selections.find(s => s.idea_id === idea.id);
                return (
                  <div key={idea.id} style={styles.rejectedItem}>
                    <p style={styles.rejectedText}>{idea.content}</p>
                    <p style={styles.rejectedReason}>
                      Raison: {selection?.rejection_reason}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RnDPhase2Selection;
