/**
 * CHE·NU™ R&D Workspace - Quantitative Modules Modal
 * 
 * Optional quantitative analysis tools called on-demand:
 * - Decision Matrix
 * - Weighted Scoring
 * - Parametric Simulation
 * - Sensitivity Analysis
 * - Probabilistic Estimation
 * 
 * These are tools to inform human judgment, NOT to replace it.
 */

import React, { useState } from 'react';
import {
  RnDPhase,
  QuantitativeModule,
  DecisionMatrix,
  WeightedScore,
  ParametricSimulation,
  SensitivityAnalysis,
  ProbabilisticEstimate,
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
  
  examplesGreen: '#22C55E',
  comparisonOrange: '#F97316',
  refinementRed: '#EF4444',
};

// ============================================================================
// MODULE DEFINITIONS
// ============================================================================

interface ModuleDefinition {
  id: QuantitativeModule;
  name: string;
  description: string;
  icon: string;
  availableInPhases: RnDPhase[];
  complexity: 'simple' | 'medium' | 'advanced';
}

const MODULES: ModuleDefinition[] = [
  {
    id: 'decision_matrix',
    name: 'Matrice de Décision',
    description: 'Évalue les options selon des critères pondérés pour obtenir un score global.',
    icon: '📊',
    availableInPhases: [4, 5],
    complexity: 'simple',
  },
  {
    id: 'weighted_scoring',
    name: 'Scoring Pondéré',
    description: 'Calcule des scores composites avec des poids personnalisables.',
    icon: '⚖️',
    availableInPhases: [3, 4, 5],
    complexity: 'simple',
  },
  {
    id: 'parametric_simulation',
    name: 'Simulation Paramétrique',
    description: 'Explore les résultats en variant les paramètres clés.',
    icon: '🔬',
    availableInPhases: [3, 4, 5],
    complexity: 'medium',
  },
  {
    id: 'sensitivity_analysis',
    name: 'Analyse de Sensibilité',
    description: 'Identifie quels paramètres ont le plus d\'impact sur les résultats.',
    icon: '📈',
    availableInPhases: [4, 5],
    complexity: 'medium',
  },
  {
    id: 'probabilistic_estimation',
    name: 'Estimation Probabiliste',
    description: 'Calcule des intervalles de confiance et distributions de probabilité.',
    icon: '🎲',
    availableInPhases: [3, 4, 5],
    complexity: 'advanced',
  },
];

// ============================================================================
// PROPS
// ============================================================================

interface QuantitativeModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: RnDPhase;
  onModuleResult?: (moduleId: QuantitativeModule, result: unknown) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Decision Matrix Component
const DecisionMatrixTool: React.FC<{ onResult: (result: DecisionMatrix) => void }> = ({ onResult }) => {
  const [options, setOptions] = useState<string[]>(['Option A', 'Option B']);
  const [criteria, setCriteria] = useState<{ name: string; weight: number }[]>([
    { name: 'Faisabilité', weight: 0.3 },
    { name: 'Impact', weight: 0.4 },
    { name: 'Coût', weight: 0.3 },
  ]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  
  const addOption = () => setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
  const addCriterion = () => setCriteria([...criteria, { name: 'Nouveau critère', weight: 0.1 }]);
  
  const updateScore = (option: string, criterion: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [option]: {
        ...prev[option],
        [criterion]: score,
      },
    }));
  };
  
  const calculateTotals = (): Record<string, number> => {
    const totals: Record<string, number> = {};
    options.forEach(opt => {
      let total = 0;
      criteria.forEach(crit => {
        const score = scores[opt]?.[crit.name] || 0;
        total += score * crit.weight;
      });
      totals[opt] = Math.round(total * 100) / 100;
    });
    return totals;
  };
  
  const totals = calculateTotals();
  
  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ color: '#fff', marginBottom: '16px' }}>📊 Matrice de Décision</h4>
      
      {/* Criteria Weights */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>
          Critères et pondérations:
        </p>
        {criteria.map((crit, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={crit.name}
              onChange={(e) => {
                const newCriteria = [...criteria];
                newCriteria[i].name = e.target.value;
                setCriteria(newCriteria);
              }}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={crit.weight * 100}
              onChange={(e) => {
                const newCriteria = [...criteria];
                newCriteria[i].weight = parseInt(e.target.value) / 100;
                setCriteria(newCriteria);
              }}
              style={{ width: '80px' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', width: '40px' }}>
              {Math.round(crit.weight * 100)}%
            </span>
          </div>
        ))}
        <button onClick={addCriterion} style={{
          padding: '6px 12px',
          fontSize: '11px',
          backgroundColor: 'transparent',
          border: '1px dashed rgba(255,255,255,0.3)',
          borderRadius: '4px',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
        }}>
          + Ajouter critère
        </button>
      </div>
      
      {/* Matrix Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Options
              </th>
              {criteria.map((crit, i) => (
                <th key={i} style={{ padding: '8px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {crit.name}<br />
                  <span style={{ fontSize: '10px' }}>({Math.round(crit.weight * 100)}%)</span>
                </th>
              ))}
              <th style={{ padding: '8px', textAlign: 'center', color: CHENU_COLORS.sacredGold, fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Score Total
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt, i) => (
              <tr key={i}>
                <td style={{ padding: '8px', color: '#fff', fontSize: '12px' }}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[i] = e.target.value;
                      setOptions(newOptions);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      width: '100%',
                    }}
                  />
                </td>
                {criteria.map((crit, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores[opt]?.[crit.name] || 0}
                      onChange={(e) => updateScore(opt, crit.name, parseInt(e.target.value) || 0)}
                      style={{
                        width: '50px',
                        padding: '6px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '12px',
                        textAlign: 'center',
                      }}
                    />
                  </td>
                ))}
                <td style={{ padding: '8px', textAlign: 'center', color: CHENU_COLORS.sacredGold, fontWeight: 600, fontSize: '14px' }}>
                  {totals[opt] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button onClick={addOption} style={{
        marginTop: '12px',
        padding: '6px 12px',
        fontSize: '11px',
        backgroundColor: 'transparent',
        border: '1px dashed rgba(255,255,255,0.3)',
        borderRadius: '4px',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
      }}>
        + Ajouter option
      </button>
      
      {/* Results */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${CHENU_COLORS.sacredGold}`,
      }}>
        <p style={{ color: CHENU_COLORS.sacredGold, fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
          🏆 Classement:
        </p>
        {Object.entries(totals)
          .sort(([,a], [,b]) => b - a)
          .map(([opt, score], i) => (
            <div key={opt} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <span style={{ color: '#fff', fontSize: '12px' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {opt}
              </span>
              <span style={{ color: CHENU_COLORS.sacredGold, fontWeight: 600 }}>{score}</span>
            </div>
          ))}
      </div>
      
      <p style={{
        marginTop: '16px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        💡 Ces scores sont des outils d'aide à la réflexion, pas des verdicts.
      </p>
    </div>
  );
};

// Sensitivity Analysis Component
const SensitivityAnalysisTool: React.FC<{ onResult: (result: SensitivityAnalysis) => void }> = ({ onResult }) => {
  const [parameters, setParameters] = useState([
    { name: 'Coût développement', baseValue: 100, minValue: 50, maxValue: 200, unit: 'k€' },
    { name: 'Délai mise en marché', baseValue: 12, minValue: 6, maxValue: 24, unit: 'mois' },
    { name: 'Taux adoption', baseValue: 10, minValue: 2, maxValue: 25, unit: '%' },
  ]);
  
  const [selectedParam, setSelectedParam] = useState(0);
  
  // Generate sensitivity data points
  const generateSensitivityData = (param: typeof parameters[0]) => {
    const points = [];
    const range = param.maxValue - param.minValue;
    for (let i = 0; i <= 10; i++) {
      const value = param.minValue + (range * i / 10);
      // Simplified impact calculation (would be more complex in reality)
      const impact = ((value - param.baseValue) / param.baseValue) * 100;
      points.push({ value: Math.round(value * 10) / 10, impact: Math.round(impact * 10) / 10 });
    }
    return points;
  };
  
  const data = generateSensitivityData(parameters[selectedParam]);
  const maxImpact = Math.max(...data.map(d => Math.abs(d.impact)));
  
  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ color: '#fff', marginBottom: '16px' }}>📈 Analyse de Sensibilité</h4>
      
      {/* Parameter Selection */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>
          Paramètre à analyser:
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {parameters.map((param, i) => (
            <button
              key={i}
              onClick={() => setSelectedParam(i)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedParam === i ? CHENU_COLORS.comparisonOrange : 'rgba(255,255,255,0.05)',
                border: selectedParam === i ? `1px solid ${CHENU_COLORS.comparisonOrange}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: selectedParam === i ? '#000' : '#fff',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {param.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Parameter Config */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>
              Minimum
            </label>
            <input
              type="number"
              value={parameters[selectedParam].minValue}
              onChange={(e) => {
                const newParams = [...parameters];
                newParams[selectedParam].minValue = parseFloat(e.target.value);
                setParameters(newParams);
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>
              Valeur de base
            </label>
            <input
              type="number"
              value={parameters[selectedParam].baseValue}
              onChange={(e) => {
                const newParams = [...parameters];
                newParams[selectedParam].baseValue = parseFloat(e.target.value);
                setParameters(newParams);
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${CHENU_COLORS.sacredGold}`,
                borderRadius: '4px',
                color: CHENU_COLORS.sacredGold,
                fontSize: '12px',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>
              Maximum
            </label>
            <input
              type="number"
              value={parameters[selectedParam].maxValue}
              onChange={(e) => {
                const newParams = [...parameters];
                newParams[selectedParam].maxValue = parseFloat(e.target.value);
                setParameters(newParams);
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Sensitivity Chart (Simplified bar representation) */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px' }}>
          Impact de la variation sur le résultat:
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {data.map((point, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                width: '60px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'right',
              }}>
                {point.value} {parameters[selectedParam].unit}
              </span>
              <div style={{
                flex: 1,
                height: '16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Center line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }} />
                {/* Impact bar */}
                <div style={{
                  position: 'absolute',
                  left: point.impact >= 0 ? '50%' : `${50 - (Math.abs(point.impact) / maxImpact * 50)}%`,
                  width: `${Math.abs(point.impact) / maxImpact * 50}%`,
                  height: '100%',
                  backgroundColor: point.impact >= 0 ? CHENU_COLORS.examplesGreen : CHENU_COLORS.refinementRed,
                  opacity: 0.7,
                }} />
              </div>
              <span style={{
                width: '50px',
                fontSize: '10px',
                color: point.impact >= 0 ? CHENU_COLORS.examplesGreen : CHENU_COLORS.refinementRed,
                textAlign: 'left',
              }}>
                {point.impact >= 0 ? '+' : ''}{point.impact}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Insights */}
      <div style={{
        padding: '12px',
        backgroundColor: 'rgba(64, 224, 208, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${CHENU_COLORS.cenoteTurquoise}`,
      }}>
        <p style={{ color: CHENU_COLORS.cenoteTurquoise, fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
          💡 Insights:
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
          <li>
            Une variation de {parameters[selectedParam].maxValue - parameters[selectedParam].baseValue} {parameters[selectedParam].unit} 
            peut impacter le résultat jusqu'à +{Math.round((parameters[selectedParam].maxValue - parameters[selectedParam].baseValue) / parameters[selectedParam].baseValue * 100)}%
          </li>
          <li>
            Zone critique: en dessous de {Math.round(parameters[selectedParam].baseValue * 0.7)} {parameters[selectedParam].unit}
          </li>
        </ul>
      </div>
      
      <p style={{
        marginTop: '16px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        💡 L'analyse identifie les leviers, pas les décisions.
      </p>
    </div>
  );
};

// Probabilistic Estimation Component
const ProbabilisticEstimationTool: React.FC<{ onResult: (result: ProbabilisticEstimate) => void }> = ({ onResult }) => {
  const [estimates, setEstimates] = useState({
    optimistic: 50,
    mostLikely: 100,
    pessimistic: 200,
  });
  
  // PERT calculation
  const expectedValue = (estimates.optimistic + 4 * estimates.mostLikely + estimates.pessimistic) / 6;
  const standardDeviation = (estimates.pessimistic - estimates.optimistic) / 6;
  
  // Confidence intervals
  const ci68Low = expectedValue - standardDeviation;
  const ci68High = expectedValue + standardDeviation;
  const ci95Low = expectedValue - 2 * standardDeviation;
  const ci95High = expectedValue + 2 * standardDeviation;
  
  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ color: '#fff', marginBottom: '16px' }}>🎲 Estimation Probabiliste (PERT)</h4>
      
      {/* Three-point estimation */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px' }}>
          Estimation en trois points:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${CHENU_COLORS.examplesGreen}`,
            borderRadius: '8px',
          }}>
            <label style={{ fontSize: '10px', color: CHENU_COLORS.examplesGreen, display: 'block', marginBottom: '4px' }}>
              🟢 Optimiste
            </label>
            <input
              type="number"
              value={estimates.optimistic}
              onChange={(e) => setEstimates({ ...estimates, optimistic: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: CHENU_COLORS.examplesGreen,
                fontSize: '18px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            />
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: `1px solid ${CHENU_COLORS.sacredGold}`,
            borderRadius: '8px',
          }}>
            <label style={{ fontSize: '10px', color: CHENU_COLORS.sacredGold, display: 'block', marginBottom: '4px' }}>
              🟡 Plus probable
            </label>
            <input
              type="number"
              value={estimates.mostLikely}
              onChange={(e) => setEstimates({ ...estimates, mostLikely: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: CHENU_COLORS.sacredGold,
                fontSize: '18px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            />
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${CHENU_COLORS.refinementRed}`,
            borderRadius: '8px',
          }}>
            <label style={{ fontSize: '10px', color: CHENU_COLORS.refinementRed, display: 'block', marginBottom: '4px' }}>
              🔴 Pessimiste
            </label>
            <input
              type="number"
              value={estimates.pessimistic}
              onChange={(e) => setEstimates({ ...estimates, pessimistic: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: CHENU_COLORS.refinementRed,
                fontSize: '18px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div style={{
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h5 style={{ color: '#fff', fontSize: '13px', marginBottom: '16px' }}>📊 Résultats PERT:</h5>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Valeur attendue:</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.sacredGold }}>
            {Math.round(expectedValue * 10) / 10}
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            (σ = {Math.round(standardDeviation * 10) / 10})
          </span>
        </div>
        
        {/* Confidence Intervals */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
            Intervalles de confiance:
          </p>
          
          {/* 68% CI */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', width: '60px' }}>68%:</span>
            <div style={{
              flex: 1,
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: `${(ci68Low - estimates.optimistic) / (estimates.pessimistic - estimates.optimistic) * 100}%`,
                right: `${100 - (ci68High - estimates.optimistic) / (estimates.pessimistic - estimates.optimistic) * 100}%`,
                top: 0,
                bottom: 0,
                backgroundColor: CHENU_COLORS.cenoteTurquoise,
                opacity: 0.6,
              }} />
            </div>
            <span style={{ fontSize: '11px', color: CHENU_COLORS.cenoteTurquoise, width: '100px', textAlign: 'right' }}>
              [{Math.round(ci68Low)} - {Math.round(ci68High)}]
            </span>
          </div>
          
          {/* 95% CI */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', width: '60px' }}>95%:</span>
            <div style={{
              flex: 1,
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: `${Math.max(0, (ci95Low - estimates.optimistic) / (estimates.pessimistic - estimates.optimistic) * 100)}%`,
                right: `${Math.max(0, 100 - (ci95High - estimates.optimistic) / (estimates.pessimistic - estimates.optimistic) * 100)}%`,
                top: 0,
                bottom: 0,
                backgroundColor: CHENU_COLORS.sacredGold,
                opacity: 0.4,
              }} />
            </div>
            <span style={{ fontSize: '11px', color: CHENU_COLORS.sacredGold, width: '100px', textAlign: 'right' }}>
              [{Math.round(ci95Low)} - {Math.round(ci95High)}]
            </span>
          </div>
        </div>
      </div>
      
      {/* Interpretation */}
      <div style={{
        padding: '12px',
        backgroundColor: 'rgba(64, 224, 208, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${CHENU_COLORS.cenoteTurquoise}`,
      }}>
        <p style={{ color: CHENU_COLORS.cenoteTurquoise, fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
          📖 Interprétation:
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
          <li>68% de chances que le résultat soit entre {Math.round(ci68Low)} et {Math.round(ci68High)}</li>
          <li>95% de chances que le résultat soit entre {Math.round(ci95Low)} et {Math.round(ci95High)}</li>
          <li>Écart-type de {Math.round(standardDeviation)}: {standardDeviation > expectedValue * 0.3 ? '⚠️ Forte incertitude' : '✓ Incertitude modérée'}</li>
        </ul>
      </div>
      
      <p style={{
        marginTop: '16px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        💡 Les probabilités quantifient l'incertitude, elles ne l'éliminent pas.
      </p>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const QuantitativeModulesModal: React.FC<QuantitativeModulesModalProps> = ({
  isOpen,
  onClose,
  currentPhase,
  onModuleResult,
}) => {
  const [selectedModule, setSelectedModule] = useState<QuantitativeModule | null>(null);
  
  // Filter available modules for current phase
  const availableModules = MODULES.filter(m => m.availableInPhases.includes(currentPhase));
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: '#111113',
        borderRadius: '12px',
        border: `1px solid ${CHENU_COLORS.nightSlate}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${CHENU_COLORS.nightSlate}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0a0a0b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📐</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                Modules Quantitatifs
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                Outils d'analyse pour éclairer (pas décider)
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
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Module List */}
          <div style={{
            width: '250px',
            borderRight: `1px solid ${CHENU_COLORS.nightSlate}`,
            padding: '16px',
            overflowY: 'auto',
          }}>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Disponibles (Phase {currentPhase})
            </p>
            
            {availableModules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: selectedModule === module.id 
                    ? 'rgba(212, 175, 55, 0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: selectedModule === module.id
                    ? `1px solid ${CHENU_COLORS.sacredGold}`
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>{module.icon}</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: selectedModule === module.id ? CHENU_COLORS.sacredGold : '#fff',
                  }}>
                    {module.name}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {module.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  padding: '2px 6px',
                  fontSize: '9px',
                  backgroundColor: module.complexity === 'simple' 
                    ? 'rgba(34, 197, 94, 0.2)'
                    : module.complexity === 'medium'
                    ? 'rgba(234, 179, 8, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                  color: module.complexity === 'simple'
                    ? CHENU_COLORS.examplesGreen
                    : module.complexity === 'medium'
                    ? CHENU_COLORS.selectionYellow
                    : CHENU_COLORS.refinementRed,
                  borderRadius: '4px',
                }}>
                  {module.complexity}
                </span>
              </button>
            ))}
            
            {availableModules.length === 0 && (
              <p style={{
                padding: '20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px',
              }}>
                Aucun module disponible pour cette phase.
              </p>
            )}
          </div>
          
          {/* Module Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#0d0d0e',
          }}>
            {selectedModule === 'decision_matrix' && (
              <DecisionMatrixTool onResult={(result) => onModuleResult?.('decision_matrix', result)} />
            )}
            {selectedModule === 'sensitivity_analysis' && (
              <SensitivityAnalysisTool onResult={(result) => onModuleResult?.('sensitivity_analysis', result)} />
            )}
            {selectedModule === 'probabilistic_estimation' && (
              <ProbabilisticEstimationTool onResult={(result) => onModuleResult?.('probabilistic_estimation', result)} />
            )}
            {selectedModule === 'weighted_scoring' && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ fontSize: '48px' }}>⚖️</span>
                <p style={{ marginTop: '16px' }}>Module Scoring Pondéré</p>
                <p style={{ fontSize: '12px' }}>Similaire à la matrice de décision avec focus sur les poids</p>
              </div>
            )}
            {selectedModule === 'parametric_simulation' && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ fontSize: '48px' }}>🔬</span>
                <p style={{ marginTop: '16px' }}>Module Simulation Paramétrique</p>
                <p style={{ fontSize: '12px' }}>Exploration systématique des variations de paramètres</p>
              </div>
            )}
            
            {!selectedModule && (
              <div style={{
                padding: '60px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '64px', opacity: 0.3 }}>📐</span>
                <p style={{
                  marginTop: '20px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '14px',
                }}>
                  Sélectionnez un module pour commencer l'analyse
                </p>
                <p style={{
                  marginTop: '8px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '12px',
                  maxWidth: '400px',
                  margin: '8px auto 0',
                }}>
                  Ces outils quantitatifs aident à structurer la réflexion.<br />
                  Ils informent la décision, ils ne la remplacent pas.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: `1px solid ${CHENU_COLORS.nightSlate}`,
          backgroundColor: '#0a0a0b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: '10px',
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
          }}>
            💡 "L'interface structure la pensée. Les chiffres éclairent. L'humain décide."
          </p>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: CHENU_COLORS.sacredGold,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitativeModulesModal;
