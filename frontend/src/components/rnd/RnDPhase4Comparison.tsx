/**
 * CHE·NU™ R&D Workspace - Phase 4: Comparaison des Solutions
 * 
 * Objectif: Comparer objectivement les options
 * 
 * Interface:
 * - Tableau comparatif
 * - Critères visibles
 * - Pondérations ajustables
 * - Visualisations simples
 * 
 * Agent R&D autorisé:
 * - Analyse comparative
 * - Synthèse avantages / limites
 * - Détection incohérences
 * 
 * Modules quantitatifs:
 * - Scoring multicritère
 * - Matrices de décision
 * - Analyses de sensibilité
 * 
 * 👉 Les désaccords sont documentés, pas effacés.
 */

import React, { useState } from 'react';
import {
  RnDIdea,
  ComparisonMatrix,
  ComparisonCriterion,
  SolutionEvaluation,
  ComparisonDisagreement,
} from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  comparisonOrange: '#F97316',
};

const DEFAULT_COMPARISON_CRITERIA: ComparisonCriterion[] = [
  { id: 'effectiveness', name: 'Efficacité', weight: 30, type: 'quantitative' },
  { id: 'feasibility', name: 'Faisabilité', weight: 25, type: 'quantitative' },
  { id: 'scalability', name: 'Scalabilité', weight: 20, type: 'qualitative' },
  { id: 'risk', name: 'Risque', weight: 15, type: 'quantitative' },
  { id: 'innovation', name: 'Innovation', weight: 10, type: 'qualitative' },
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
  
  // Matrix container
  matrixSection: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    overflowX: 'auto' as const,
  },
  matrixTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '600px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    borderBottom: `2px solid ${CHENU_COLORS.comparisonOrange}40`,
    fontSize: '13px',
    fontWeight: 600,
    color: '#E8E6E1',
    backgroundColor: '#111113',
  },
  thSolution: {
    minWidth: '180px',
  },
  thCriterion: {
    minWidth: '120px',
    textAlign: 'center' as const,
  },
  thTotal: {
    minWidth: '100px',
    textAlign: 'center' as const,
    backgroundColor: `${CHENU_COLORS.comparisonOrange}15`,
    color: CHENU_COLORS.comparisonOrange,
  },
  tr: {
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  trHover: {
    backgroundColor: '#111113',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#E8E6E1',
    verticalAlign: 'middle' as const,
  },
  tdSolution: {
    fontWeight: 500,
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tdScore: {
    textAlign: 'center' as const,
  },
  tdTotal: {
    textAlign: 'center' as const,
    fontWeight: 700,
    fontSize: '16px',
    color: CHENU_COLORS.comparisonOrange,
  },
  
  // Score input
  scoreInput: {
    width: '50px',
    padding: '6px 8px',
    backgroundColor: '#0D0D0E',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '4px',
    color: '#E8E6E1',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  
  // Weight indicator
  weightBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: `${CHENU_COLORS.ancientStone}30`,
    borderRadius: '3px',
    fontSize: '10px',
    color: '#9CA3AF',
    marginLeft: '6px',
  },
  
  // Criteria configuration
  criteriaConfig: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
  },
  criteriaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  criteriaTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E8E6E1',
  },
  criteriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  criterionItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    padding: '10px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '6px',
  },
  criterionName: {
    fontSize: '13px',
    color: '#E8E6E1',
  },
  criterionWeight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  weightSlider: {
    flex: 1,
    accentColor: CHENU_COLORS.comparisonOrange,
  },
  weightValue: {
    fontSize: '12px',
    color: CHENU_COLORS.comparisonOrange,
    fontWeight: 600,
    minWidth: '32px',
  },
  
  // Rankings section
  rankingsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  rankingCard: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
  },
  rankingPosition: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  rankFirst: {
    backgroundColor: `${CHENU_COLORS.sacredGold}30`,
    color: CHENU_COLORS.sacredGold,
    border: `2px solid ${CHENU_COLORS.sacredGold}`,
  },
  rankSecond: {
    backgroundColor: '#C0C0C030',
    color: '#C0C0C0',
    border: '2px solid #C0C0C0',
  },
  rankThird: {
    backgroundColor: '#CD7F3230',
    color: '#CD7F32',
    border: '2px solid #CD7F32',
  },
  rankOther: {
    backgroundColor: `${CHENU_COLORS.ancientStone}20`,
    color: '#9CA3AF',
    border: `1px solid ${CHENU_COLORS.ancientStone}`,
  },
  rankingContent: {
    fontSize: '14px',
    color: '#E8E6E1',
    marginBottom: '8px',
    lineHeight: 1.4,
  },
  rankingScore: {
    fontSize: '20px',
    fontWeight: 700,
    color: CHENU_COLORS.comparisonOrange,
  },
  
  // Disagreements section
  disagreementsSection: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid #EF444440`,
  },
  disagreementsTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#EF4444',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  disagreementCard: {
    padding: '14px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '3px solid #EF4444',
  },
  disagreementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  disagreementContext: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  disagreementScores: {
    display: 'flex',
    gap: '16px',
    marginBottom: '8px',
  },
  scoreBox: {
    padding: '6px 12px',
    backgroundColor: '#111113',
    borderRadius: '4px',
    fontSize: '13px',
  },
  resolutionInput: {
    width: '100%',
    padding: '8px 10px',
    backgroundColor: '#0D0D0E',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '4px',
    color: '#E8E6E1',
    fontSize: '12px',
    marginTop: '8px',
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

interface RnDPhase4ComparisonProps {
  solutions: RnDIdea[];
  matrix: ComparisonMatrix;
  rankings: { solution_id: string; total_score: number }[];
  onUpdateMatrix: (matrix: ComparisonMatrix) => void;
  onUpdateRankings: (rankings: { solution_id: string; total_score: number }[]) => void;
  onAskAgent: () => void;
  onOpenQuantitative: () => void;
}

export const RnDPhase4Comparison: React.FC<RnDPhase4ComparisonProps> = ({
  solutions,
  matrix,
  rankings,
  onUpdateMatrix,
  onUpdateRankings,
  onAskAgent,
  onOpenQuantitative,
}) => {
  // Initialize criteria if empty
  const criteria = matrix.criteria.length > 0 
    ? matrix.criteria 
    : DEFAULT_COMPARISON_CRITERIA;
  
  const [evaluations, setEvaluations] = useState<Record<string, Record<string, number>>>(
    () => {
      const init: Record<string, Record<string, number>> = {};
      matrix.evaluations.forEach(e => {
        if (!init[e.solution_id]) init[e.solution_id] = {};
        init[e.solution_id][e.criterion_id] = e.score;
      });
      return init;
    }
  );
  
  const handleWeightChange = (criterionId: string, weight: number) => {
    const updatedCriteria = criteria.map(c =>
      c.id === criterionId ? { ...c, weight } : c
    );
    onUpdateMatrix({
      ...matrix,
      criteria: updatedCriteria,
    });
    recalculateRankings(updatedCriteria, evaluations);
  };
  
  const handleScoreChange = (solutionId: string, criterionId: string, score: number) => {
    const updated = {
      ...evaluations,
      [solutionId]: {
        ...(evaluations[solutionId] || {}),
        [criterionId]: Math.min(10, Math.max(0, score)),
      },
    };
    setEvaluations(updated);
    
    // Update matrix evaluations
    const newEvaluations: SolutionEvaluation[] = [];
    Object.entries(updated).forEach(([solId, crits]) => {
      Object.entries(crits).forEach(([critId, score]) => {
        newEvaluations.push({
          solution_id: solId,
          criterion_id: critId,
          score,
          notes: '',
          evaluated_by: 'current-user',
          evaluated_at: new Date().toISOString(),
        });
      });
    });
    
    onUpdateMatrix({
      ...matrix,
      criteria,
      evaluations: newEvaluations,
    });
    
    recalculateRankings(criteria, updated);
  };
  
  const recalculateRankings = (
    crits: ComparisonCriterion[],
    evals: Record<string, Record<string, number>>
  ) => {
    const newRankings = solutions.map(solution => {
      const scores = evals[solution.id] || {};
      let total = 0;
      let totalWeight = 0;
      
      crits.forEach(c => {
        const score = scores[c.id];
        if (score !== undefined) {
          total += score * c.weight;
          totalWeight += c.weight;
        }
      });
      
      return {
        solution_id: solution.id,
        total_score: totalWeight > 0 ? Math.round(total / totalWeight * 10) : 0,
      };
    }).sort((a, b) => b.total_score - a.total_score);
    
    onUpdateRankings(newRankings);
  };
  
  const getSolutionById = (id: string) => solutions.find(s => s.id === id);
  
  const getRankStyle = (position: number) => {
    switch (position) {
      case 1: return styles.rankFirst;
      case 2: return styles.rankSecond;
      case 3: return styles.rankThird;
      default: return styles.rankOther;
    }
  };
  
  if (solutions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🟠 Comparaison des Solutions</h2>
          </div>
        </div>
        <div style={styles.emptyState}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            Aucune solution à comparer
          </p>
          <p style={{ fontSize: '13px' }}>
            Retournez à la Phase 2 pour sélectionner des idées
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
          <h2 style={styles.title}>🟠 Comparaison des Solutions</h2>
          <p style={styles.subtitle}>
            Évaluez chaque solution selon les critères pondérés. Les désaccords 
            sont documentés, pas effacés.
          </p>
        </div>
        
        <div style={styles.headerActions}>
          <button
            style={{ ...styles.actionButton, ...styles.agentButton }}
            onClick={onAskAgent}
          >
            🤖 Analyse comparative
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.quantButton }}
            onClick={onOpenQuantitative}
          >
            📐 Matrice de décision
          </button>
        </div>
      </div>
      
      {/* Criteria Configuration */}
      <div style={styles.matrixSection}>
        <div style={styles.criteriaConfig}>
          <div style={styles.criteriaHeader}>
            <span style={styles.criteriaTitle}>⚖️ Pondération des critères</span>
          </div>
          <div style={styles.criteriaGrid}>
            {criteria.map(c => (
              <div key={c.id} style={styles.criterionItem}>
                <span style={styles.criterionName}>
                  {c.name}
                  <span style={{
                    ...styles.weightBadge,
                    color: c.type === 'quantitative' ? '#3B82F6' : '#A855F7',
                  }}>
                    {c.type === 'quantitative' ? 'Quant' : 'Qual'}
                  </span>
                </span>
                <div style={styles.criterionWeight}>
                  <input
                    type="range"
                    min="0"
                    max="50"
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
        
        {/* Comparison Matrix */}
        <table style={styles.matrixTable}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.thSolution }}>Solution</th>
              {criteria.map(c => (
                <th key={c.id} style={{ ...styles.th, ...styles.thCriterion }}>
                  {c.name}
                  <span style={styles.weightBadge}>{c.weight}%</span>
                </th>
              ))}
              <th style={{ ...styles.th, ...styles.thTotal }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map(solution => {
              const solutionScores = evaluations[solution.id] || {};
              const ranking = rankings.find(r => r.solution_id === solution.id);
              
              return (
                <tr
                  key={solution.id}
                  style={styles.tr}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111113';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ ...styles.td, ...styles.tdSolution }}>
                    {solution.content.slice(0, 50)}...
                  </td>
                  {criteria.map(c => (
                    <td key={c.id} style={{ ...styles.td, ...styles.tdScore }}>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={solutionScores[c.id] ?? ''}
                        onChange={(e) => handleScoreChange(
                          solution.id,
                          c.id,
                          parseInt(e.target.value) || 0
                        )}
                        style={styles.scoreInput}
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td style={{ ...styles.td, ...styles.tdTotal }}>
                    {ranking?.total_score ?? '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Rankings */}
      {rankings.length > 0 && (
        <div style={styles.rankingsSection}>
          {rankings.map((ranking, index) => {
            const solution = getSolutionById(ranking.solution_id);
            if (!solution) return null;
            
            return (
              <div key={ranking.solution_id} style={styles.rankingCard}>
                <div style={{
                  ...styles.rankingPosition,
                  ...getRankStyle(index + 1),
                }}>
                  #{index + 1}
                </div>
                <p style={styles.rankingContent}>
                  {solution.content}
                </p>
                <span style={styles.rankingScore}>
                  {ranking.total_score}/100
                </span>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Disagreements (if any) */}
      {matrix.disagreements.length > 0 && (
        <div style={styles.disagreementsSection}>
          <h3 style={styles.disagreementsTitle}>
            ⚠️ Désaccords documentés ({matrix.disagreements.length})
          </h3>
          
          {matrix.disagreements.map(d => {
            const solution = getSolutionById(d.solution_id);
            const criterion = criteria.find(c => c.id === d.criterion_id);
            
            return (
              <div key={d.id} style={styles.disagreementCard}>
                <div style={styles.disagreementHeader}>
                  <span style={styles.disagreementContext}>
                    {criterion?.name} pour "{solution?.content.slice(0, 30)}..."
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: d.resolved ? '#22C55E' : '#EF4444',
                  }}>
                    {d.resolved ? '✓ Résolu' : 'Non résolu'}
                  </span>
                </div>
                
                <div style={styles.disagreementScores}>
                  <span style={styles.scoreBox}>
                    {d.participant_a}: <strong>{d.score_a}</strong>
                  </span>
                  <span style={styles.scoreBox}>
                    {d.participant_b}: <strong>{d.score_b}</strong>
                  </span>
                </div>
                
                {d.resolution ? (
                  <p style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                    Résolution: {d.resolution}
                  </p>
                ) : (
                  <input
                    type="text"
                    placeholder="Ajouter une résolution..."
                    style={styles.resolutionInput}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RnDPhase4Comparison;
