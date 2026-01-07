/**
 * CHE·NU™ R&D Workspace - Phase 6: Decision & Output
 * 
 * Final phase of the R&D process where:
 * - Final decision is documented with justification
 * - Rejected hypotheses are archived with reasons
 * - Known limitations are documented
 * - Next steps are defined
 * - Outputs are generated (scientific document, R&D plan, prototype, recommendation)
 * 
 * GOLDEN RULE: "L'interface structure la pensée. L'agent éclaire la complexité. L'humain assume la décision."
 */

import React, { useState } from 'react';
import {
  RnDPhaseData,
  RnDDecision,
  RejectedHypothesis,
  RnDOutput,
  RnDOutputType,
  ComparisonSolution,
  CHENU_COLORS,
  RND_AGENT_RULES,
  TraceabilityRecord,
  RND_GOLDEN_RULE
} from './rnd-workspace.types';

// ============================================================================
// TYPES
// ============================================================================

interface RnDPhase6DecisionProps {
  phaseData: RnDPhaseData;
  projectId: string;
  onUpdatePhaseData: (data: Partial<RnDPhaseData>) => void;
  onAskAgent: (action: string, context?: string) => void;
}

interface DecisionFormState {
  selectedSolutionId: string;
  justification: string;
  limitations: string[];
  nextSteps: string[];
  confidenceLevel: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const OUTPUT_TYPES: { type: RnDOutputType; label: string; icon: string; description: string }[] = [
  {
    type: 'scientific_document',
    label: 'Document Scientifique',
    icon: '📄',
    description: 'Article, rapport de recherche, note technique'
  },
  {
    type: 'rnd_plan',
    label: 'Plan R&D',
    icon: '📋',
    description: 'Roadmap, plan de développement, jalons'
  },
  {
    type: 'conceptual_prototype',
    label: 'Prototype Conceptuel',
    icon: '🔧',
    description: 'Maquette, preuve de concept, spécifications'
  },
  {
    type: 'strategic_recommendation',
    label: 'Recommandation Stratégique',
    icon: '🎯',
    description: 'Avis, conseil, orientation stratégique'
  }
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Très faible', color: '#EF4444' },
  { value: 2, label: 'Faible', color: '#F97316' },
  { value: 3, label: 'Modéré', color: '#EAB308' },
  { value: 4, label: 'Élevé', color: '#22C55E' },
  { value: 5, label: 'Très élevé', color: '#10B981' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RnDPhase6Decision: React.FC<RnDPhase6DecisionProps> = ({
  phaseData,
  projectId,
  onUpdatePhaseData,
  onAskAgent
}) => {
  // Get refined solutions from Phase 5
  const refinedSolutionIds = phaseData.phase5?.focusSolutionIds || [];
  const allSolutions = phaseData.phase4?.solutions || [];
  const refinedSolutions = allSolutions.filter(s => refinedSolutionIds.includes(s.id));
  
  // Get existing decision or create empty
  const existingDecision = phaseData.phase6?.decision;
  
  // Form state
  const [formState, setFormState] = useState<DecisionFormState>({
    selectedSolutionId: existingDecision?.selectedSolution?.id || '',
    justification: existingDecision?.justification || '',
    limitations: existingDecision?.knownLimitations || [''],
    nextSteps: existingDecision?.nextSteps || [''],
    confidenceLevel: existingDecision?.confidenceLevel || 3
  });
  
  // Rejected hypotheses state
  const [rejectedHypotheses, setRejectedHypotheses] = useState<RejectedHypothesis[]>(
    phaseData.phase6?.rejectedHypotheses || []
  );
  const [newRejection, setNewRejection] = useState({ hypothesis: '', reason: '' });
  
  // Output state
  const [selectedOutputType, setSelectedOutputType] = useState<RnDOutputType | null>(
    phaseData.phase6?.outputs?.[0]?.type || null
  );
  const [outputTitle, setOutputTitle] = useState(
    phaseData.phase6?.outputs?.[0]?.title || ''
  );
  const [executiveSummary, setExecutiveSummary] = useState(
    phaseData.phase6?.outputs?.[0]?.executiveSummary || ''
  );
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSelectSolution = (solutionId: string) => {
    setFormState(prev => ({ ...prev, selectedSolutionId: solutionId }));
  };
  
  const handleJustificationChange = (value: string) => {
    setFormState(prev => ({ ...prev, justification: value }));
  };
  
  const handleAddLimitation = () => {
    setFormState(prev => ({
      ...prev,
      limitations: [...prev.limitations, '']
    }));
  };
  
  const handleLimitationChange = (index: number, value: string) => {
    setFormState(prev => ({
      ...prev,
      limitations: prev.limitations.map((l, i) => i === index ? value : l)
    }));
  };
  
  const handleRemoveLimitation = (index: number) => {
    if (formState.limitations.length > 1) {
      setFormState(prev => ({
        ...prev,
        limitations: prev.limitations.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleAddNextStep = () => {
    setFormState(prev => ({
      ...prev,
      nextSteps: [...prev.nextSteps, '']
    }));
  };
  
  const handleNextStepChange = (index: number, value: string) => {
    setFormState(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((s, i) => i === index ? value : s)
    }));
  };
  
  const handleRemoveNextStep = (index: number) => {
    if (formState.nextSteps.length > 1) {
      setFormState(prev => ({
        ...prev,
        nextSteps: prev.nextSteps.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleConfidenceChange = (level: number) => {
    setFormState(prev => ({ ...prev, confidenceLevel: level }));
  };
  
  const handleAddRejectedHypothesis = () => {
    if (newRejection.hypothesis.trim() && newRejection.reason.trim()) {
      const rejection: RejectedHypothesis = {
        id: `rejection-${Date.now()}`,
        hypothesis: newRejection.hypothesis.trim(),
        rejectionReason: newRejection.reason.trim(),
        phase: 6,
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'current-user' // Would be actual user ID
      };
      
      const updated = [...rejectedHypotheses, rejection];
      setRejectedHypotheses(updated);
      setNewRejection({ hypothesis: '', reason: '' });
      
      onUpdatePhaseData({
        phase6: {
          ...phaseData.phase6,
          rejectedHypotheses: updated
        }
      });
    }
  };
  
  const handleSaveDecision = () => {
    const selectedSolution = refinedSolutions.find(s => s.id === formState.selectedSolutionId);
    
    if (!selectedSolution || !formState.justification.trim()) {
      return; // Validation failed
    }
    
    const decision: RnDDecision = {
      id: existingDecision?.id || `decision-${Date.now()}`,
      selectedSolution,
      justification: formState.justification.trim(),
      knownLimitations: formState.limitations.filter(l => l.trim()),
      nextSteps: formState.nextSteps.filter(s => s.trim()),
      confidenceLevel: formState.confidenceLevel,
      decidedAt: new Date().toISOString(),
      decidedBy: 'current-user' // Would be actual user ID
    };
    
    // Create traceability record
    const trace: TraceabilityRecord = {
      id: `trace-${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      phase: 6,
      action: existingDecision ? 'update_decision' : 'create_decision',
      actor: { type: 'human', id: 'current-user' },
      details: {
        selectedSolutionId: selectedSolution.id,
        confidenceLevel: formState.confidenceLevel
      },
      previousState: existingDecision ? JSON.stringify(existingDecision) : undefined,
      newState: JSON.stringify(decision)
    };
    
    onUpdatePhaseData({
      phase6: {
        ...phaseData.phase6,
        decision,
        rejectedHypotheses,
        traceability: [...(phaseData.phase6?.traceability || []), trace]
      }
    });
  };
  
  const handleGenerateOutput = () => {
    if (!selectedOutputType || !outputTitle.trim()) {
      return;
    }
    
    const output: RnDOutput = {
      id: `output-${Date.now()}`,
      type: selectedOutputType,
      title: outputTitle.trim(),
      executiveSummary: executiveSummary.trim() || undefined,
      generatedAt: new Date().toISOString(),
      generatedBy: 'current-user'
    };
    
    const existingOutputs = phaseData.phase6?.outputs || [];
    
    onUpdatePhaseData({
      phase6: {
        ...phaseData.phase6,
        outputs: [...existingOutputs, output]
      }
    });
    
    // Reset form
    setOutputTitle('');
    setExecutiveSummary('');
    setSelectedOutputType(null);
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  const selectedSolution = refinedSolutions.find(s => s.id === formState.selectedSolutionId);
  const isDecisionValid = formState.selectedSolutionId && formState.justification.trim().length >= 50;
  
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Golden Rule Reminder */}
      <div style={{
        background: `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}15, ${CHENU_COLORS.decisionPurple}10)`,
        border: `1px solid ${CHENU_COLORS.sacredGold}40`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>🟣</span>
        <div>
          <div style={{ fontWeight: 600, color: CHENU_COLORS.decisionPurple, marginBottom: '4px' }}>
            Phase 6 — Décision & Output
          </div>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>
            {RND_GOLDEN_RULE}
          </div>
        </div>
      </div>
      
      {/* No refined solutions warning */}
      {refinedSolutions.length === 0 && (
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#92400E' }}>
              Aucune solution affinée disponible
            </div>
            <div style={{ fontSize: '14px', color: '#B45309' }}>
              Retournez à la Phase 5 (Perfectionnement) pour affiner au moins une solution.
            </div>
          </div>
        </div>
      )}
      
      {refinedSolutions.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Solution Selection */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🎯</span> Sélection de la Solution Finale
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {refinedSolutions.map(solution => (
                  <div
                    key={solution.id}
                    onClick={() => handleSelectSolution(solution.id)}
                    style={{
                      background: formState.selectedSolutionId === solution.id 
                        ? `${CHENU_COLORS.decisionPurple}20`
                        : CHENU_COLORS.nightSlate,
                      border: `2px solid ${
                        formState.selectedSolutionId === solution.id 
                          ? CHENU_COLORS.decisionPurple 
                          : 'transparent'
                      }`,
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          color: '#F3F4F6',
                          marginBottom: '4px'
                        }}>
                          {solution.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                          {solution.description}
                        </div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2px solid ${
                          formState.selectedSolutionId === solution.id 
                            ? CHENU_COLORS.decisionPurple 
                            : '#4B5563'
                        }`,
                        background: formState.selectedSolutionId === solution.id 
                          ? CHENU_COLORS.decisionPurple 
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formState.selectedSolutionId === solution.id && (
                          <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Show iterations count if available */}
                    {phaseData.phase5?.iterations && (
                      <div style={{ 
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        {phaseData.phase5.iterations.filter(i => i.solutionId === solution.id).length} itération(s) de perfectionnement
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Justification */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📝</span> Justification de la Décision
                <span style={{ 
                  fontSize: '12px', 
                  color: '#EF4444',
                  fontWeight: 400 
                }}>
                  (OBLIGATOIRE)
                </span>
              </h3>
              
              <textarea
                value={formState.justification}
                onChange={e => handleJustificationChange(e.target.value)}
                placeholder="Expliquez pourquoi cette solution a été choisie. Mentionnez les critères décisifs, les compromis acceptés, et les raisons d'écarter les alternatives..."
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  background: CHENU_COLORS.nightSlate,
                  border: `1px solid ${formState.justification.length < 50 ? '#EF4444' : '#374151'}`,
                  borderRadius: '8px',
                  color: '#E5E7EB',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical'
                }}
              />
              <div style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: formState.justification.length < 50 ? '#EF4444' : '#6B7280'
              }}>
                {formState.justification.length}/50 caractères minimum
              </div>
            </section>
            
            {/* Confidence Level */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📊</span> Niveau de Confiance
              </h3>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {CONFIDENCE_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => handleConfidenceChange(level.value)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      background: formState.confidenceLevel === level.value 
                        ? `${level.color}20`
                        : CHENU_COLORS.nightSlate,
                      border: `2px solid ${
                        formState.confidenceLevel === level.value 
                          ? level.color 
                          : 'transparent'
                      }`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      fontSize: '24px', 
                      marginBottom: '4px',
                      filter: formState.confidenceLevel === level.value ? 'none' : 'grayscale(1)'
                    }}>
                      {'⭐'.repeat(level.value)}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: formState.confidenceLevel === level.value ? level.color : '#6B7280',
                      fontWeight: formState.confidenceLevel === level.value ? 600 : 400
                    }}>
                      {level.label}
                    </div>
                  </button>
                ))}
              </div>
            </section>
            
            {/* Known Limitations */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span> Limites Connues
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formState.limitations.map((limitation, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={limitation}
                      onChange={e => handleLimitationChange(index, e.target.value)}
                      placeholder={`Limite ${index + 1}...`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: CHENU_COLORS.nightSlate,
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#E5E7EB',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => handleRemoveLimitation(index)}
                      disabled={formState.limitations.length === 1}
                      style={{
                        padding: '10px 12px',
                        background: 'transparent',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: formState.limitations.length === 1 ? '#4B5563' : '#EF4444',
                        cursor: formState.limitations.length === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={handleAddLimitation}
                  style={{
                    padding: '10px 16px',
                    background: 'transparent',
                    border: `1px dashed ${CHENU_COLORS.decisionPurple}40`,
                    borderRadius: '8px',
                    color: CHENU_COLORS.decisionPurple,
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Ajouter une limite
                </button>
              </div>
            </section>
            
            {/* Next Steps */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🚀</span> Prochaines Étapes
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formState.nextSteps.map((step, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ 
                      color: CHENU_COLORS.decisionPurple,
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: '24px'
                    }}>
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={e => handleNextStepChange(index, e.target.value)}
                      placeholder={`Étape ${index + 1}...`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: CHENU_COLORS.nightSlate,
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#E5E7EB',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => handleRemoveNextStep(index)}
                      disabled={formState.nextSteps.length === 1}
                      style={{
                        padding: '10px 12px',
                        background: 'transparent',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: formState.nextSteps.length === 1 ? '#4B5563' : '#EF4444',
                        cursor: formState.nextSteps.length === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={handleAddNextStep}
                  style={{
                    padding: '10px 16px',
                    background: 'transparent',
                    border: `1px dashed ${CHENU_COLORS.decisionPurple}40`,
                    borderRadius: '8px',
                    color: CHENU_COLORS.decisionPurple,
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Ajouter une étape
                </button>
              </div>
            </section>
            
            {/* Save Decision Button */}
            <button
              onClick={handleSaveDecision}
              disabled={!isDecisionValid}
              style={{
                padding: '16px 32px',
                background: isDecisionValid 
                  ? `linear-gradient(135deg, ${CHENU_COLORS.decisionPurple}, ${CHENU_COLORS.sacredGold})`
                  : '#374151',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isDecisionValid ? 'pointer' : 'not-allowed',
                opacity: isDecisionValid ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              {existingDecision ? '💾 Mettre à jour la décision' : '✅ Enregistrer la décision'}
            </button>
          </div>
          
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Rejected Hypotheses */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🚫</span> Hypothèses Rejetées
              </h3>
              
              {rejectedHypotheses.length === 0 ? (
                <div style={{ 
                  fontSize: '13px', 
                  color: '#6B7280',
                  fontStyle: 'italic',
                  marginBottom: '12px'
                }}>
                  Documentez les hypothèses que vous avez explorées mais finalement écartées.
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {rejectedHypotheses.map(rejection => (
                    <div
                      key={rejection.id}
                      style={{
                        background: `${CHENU_COLORS.nightSlate}`,
                        borderLeft: '3px solid #EF4444',
                        borderRadius: '0 8px 8px 0',
                        padding: '10px 12px'
                      }}
                    >
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#E5E7EB',
                        marginBottom: '4px'
                      }}>
                        {rejection.hypothesis}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#EF4444'
                      }}>
                        ↳ {rejection.rejectionReason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new rejection */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                borderTop: `1px solid ${CHENU_COLORS.nightSlate}`,
                paddingTop: '12px'
              }}>
                <input
                  type="text"
                  value={newRejection.hypothesis}
                  onChange={e => setNewRejection(prev => ({ ...prev, hypothesis: e.target.value }))}
                  placeholder="Hypothèse rejetée..."
                  style={{
                    padding: '8px 10px',
                    background: CHENU_COLORS.nightSlate,
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#E5E7EB',
                    fontSize: '13px'
                  }}
                />
                <input
                  type="text"
                  value={newRejection.reason}
                  onChange={e => setNewRejection(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Raison du rejet..."
                  style={{
                    padding: '8px 10px',
                    background: CHENU_COLORS.nightSlate,
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#E5E7EB',
                    fontSize: '13px'
                  }}
                />
                <button
                  onClick={handleAddRejectedHypothesis}
                  disabled={!newRejection.hypothesis.trim() || !newRejection.reason.trim()}
                  style={{
                    padding: '8px 12px',
                    background: newRejection.hypothesis.trim() && newRejection.reason.trim()
                      ? CHENU_COLORS.nightSlate
                      : 'transparent',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: newRejection.hypothesis.trim() && newRejection.reason.trim()
                      ? '#E5E7EB'
                      : '#4B5563',
                    fontSize: '13px',
                    cursor: newRejection.hypothesis.trim() && newRejection.reason.trim()
                      ? 'pointer'
                      : 'not-allowed'
                  }}
                >
                  + Ajouter
                </button>
              </div>
            </section>
            
            {/* Generate Output */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📤</span> Générer un Output
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                {OUTPUT_TYPES.map(output => (
                  <button
                    key={output.type}
                    onClick={() => setSelectedOutputType(output.type)}
                    style={{
                      padding: '12px 8px',
                      background: selectedOutputType === output.type 
                        ? `${CHENU_COLORS.decisionPurple}20`
                        : CHENU_COLORS.nightSlate,
                      border: `1px solid ${
                        selectedOutputType === output.type 
                          ? CHENU_COLORS.decisionPurple 
                          : '#374151'
                      }`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                      {output.icon}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: selectedOutputType === output.type 
                        ? CHENU_COLORS.decisionPurple 
                        : '#9CA3AF',
                      fontWeight: selectedOutputType === output.type ? 600 : 400
                    }}>
                      {output.label}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedOutputType && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={outputTitle}
                    onChange={e => setOutputTitle(e.target.value)}
                    placeholder="Titre de l'output..."
                    style={{
                      padding: '10px 12px',
                      background: CHENU_COLORS.nightSlate,
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#E5E7EB',
                      fontSize: '13px'
                    }}
                  />
                  
                  <textarea
                    value={executiveSummary}
                    onChange={e => setExecutiveSummary(e.target.value)}
                    placeholder="Résumé exécutif (optionnel)..."
                    style={{
                      padding: '10px 12px',
                      background: CHENU_COLORS.nightSlate,
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#E5E7EB',
                      fontSize: '13px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                  
                  <button
                    onClick={handleGenerateOutput}
                    disabled={!outputTitle.trim()}
                    style={{
                      padding: '10px 16px',
                      background: outputTitle.trim() 
                        ? CHENU_COLORS.decisionPurple 
                        : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: outputTitle.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    📄 Créer l'output
                  </button>
                </div>
              )}
              
              {/* Existing outputs */}
              {phaseData.phase6?.outputs && phaseData.phase6.outputs.length > 0 && (
                <div style={{ 
                  marginTop: '12px',
                  borderTop: `1px solid ${CHENU_COLORS.nightSlate}`,
                  paddingTop: '12px'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6B7280',
                    marginBottom: '8px'
                  }}>
                    Outputs générés:
                  </div>
                  {phaseData.phase6.outputs.map(output => (
                    <div
                      key={output.id}
                      style={{
                        background: CHENU_COLORS.nightSlate,
                        borderRadius: '6px',
                        padding: '8px 10px',
                        marginBottom: '6px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px'
                      }}>
                        <span>{OUTPUT_TYPES.find(t => t.type === output.type)?.icon}</span>
                        <span style={{ fontSize: '13px', color: '#E5E7EB' }}>
                          {output.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Agent Actions */}
            <section style={{
              background: '#111113',
              border: `1px solid ${CHENU_COLORS.nightSlate}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ 
                color: '#F3F4F6', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🤖</span> Agent R&D
              </h3>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                marginBottom: '12px',
                fontStyle: 'italic'
              }}>
                {RND_AGENT_RULES.role_description}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => onAskAgent('final_synthesis', 'Generate final synthesis of the decision process')}
                  style={{
                    padding: '10px 12px',
                    background: CHENU_COLORS.nightSlate,
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#E5E7EB',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📋</span> Synthèse finale
                </button>
                
                <button
                  onClick={() => onAskAgent('executive_summary', 'Generate executive summary')}
                  style={{
                    padding: '10px 12px',
                    background: CHENU_COLORS.nightSlate,
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#E5E7EB',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📊</span> Résumé exécutif
                </button>
                
                <button
                  onClick={() => onAskAgent('vigilance_points', 'Identify vigilance points for decision')}
                  style={{
                    padding: '10px 12px',
                    background: CHENU_COLORS.nightSlate,
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#E5E7EB',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>⚠️</span> Points de vigilance
                </button>
              </div>
              
              {/* Forbidden actions reminder */}
              <div style={{
                marginTop: '12px',
                padding: '8px 10px',
                background: '#7F1D1D20',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#FCA5A5'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  ❌ L'agent ne peut PAS:
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {RND_AGENT_RULES.forbidden_actions.map((action, i) => (
                    <li key={i}>{action.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            </section>
            
            {/* Decision Summary (if saved) */}
            {existingDecision && (
              <section style={{
                background: `linear-gradient(135deg, ${CHENU_COLORS.decisionPurple}10, ${CHENU_COLORS.sacredGold}10)`,
                border: `1px solid ${CHENU_COLORS.decisionPurple}40`,
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h3 style={{ 
                  color: CHENU_COLORS.decisionPurple, 
                  marginBottom: '12px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>✅</span> Décision Enregistrée
                </h3>
                
                <div style={{ fontSize: '13px', color: '#E5E7EB', marginBottom: '8px' }}>
                  <strong>Solution:</strong> {existingDecision.selectedSolution.name}
                </div>
                
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>
                  Confiance: {'⭐'.repeat(existingDecision.confidenceLevel)}
                </div>
                
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  Décidé le: {new Date(existingDecision.decidedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RnDPhase6Decision;
