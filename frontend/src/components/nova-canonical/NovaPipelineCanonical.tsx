/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — NOVA PIPELINE CANONICAL                     ║
 * ║                    Governed Execution Pipeline UI                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * RÈGLE ABSOLUE: GOUVERNANCE > EXÉCUTION
 * 
 * Ce composant visualise le pipeline d'exécution gouverné de Nova.
 * L'UI reflète EXACTEMENT l'état du pipeline — pas d'optimisme.
 *
 * ÉTAPES DU PIPELINE:
 * 1. 🎯 Intent Analysis — Analyser l'intention utilisateur
 * 2. 🔍 Scope Verification — Vérifier le scope autorisé
 * 3. 💰 Budget Check — Vérifier le budget tokens
 * 4. 🤖 Agent Compatibility — Matcher avec les agents
 * 5. 📝 Encoding Preparation — Préparer l'encodage sémantique
 * 6. ✅ Authorization — CHECKPOINT BLOQUANT
 * 7. ⚡ Execution — Exécution par les agents
 * 8. 🔬 Validation — Valider les résultats
 * 9. 📦 Encoding Output — Encoder la sortie
 * 10. 📋 Audit Logging — Logger pour audit
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useGovernanceStore } from '../../stores/governance.store';
import { useNovaStore } from '../../stores/nova.store';
import { useUIStore } from '../../stores/ui.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PipelineStepId = 
  | 'intent_analysis'
  | 'scope_verification'
  | 'budget_check'
  | 'agent_compatibility'
  | 'encoding_preparation'
  | 'authorization'
  | 'execution'
  | 'validation'
  | 'encoding_output'
  | 'audit_logging';

export type PipelineStepStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'blocked'
  | 'skipped';

export interface PipelineStep {
  id: PipelineStepId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  status: PipelineStepStatus;
  isCheckpoint: boolean;
  duration?: number;
  error?: string;
}

export interface EncodingPreview {
  id: string;
  input: string;
  intent: string;
  actions: EncodedAction[];
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
}

export interface EncodedAction {
  id: string;
  type: string;
  target: string;
  description: string;
  params: Record<string, unknown>;
}

export interface ExecutionOutput {
  id: string;
  status: 'success' | 'partial' | 'failed';
  results: ExecutionResult[];
  completedAt: string;
}

export interface ExecutionResult {
  actionId: string;
  status: 'success' | 'failed';
  output?: unknown;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PIPELINE_STEPS_CONFIG: Omit<PipelineStep, 'status' | 'duration' | 'error'>[] = [
  {
    id: 'intent_analysis',
    name: 'Intent Analysis',
    nameFr: 'Analyse d\'intention',
    icon: '🎯',
    description: 'Analyzing user intent and extracting semantic meaning',
    isCheckpoint: false,
  },
  {
    id: 'scope_verification',
    name: 'Scope Verification',
    nameFr: 'Vérification du scope',
    icon: '🔍',
    description: 'Verifying request is within allowed scope and permissions',
    isCheckpoint: false,
  },
  {
    id: 'budget_check',
    name: 'Budget Check',
    nameFr: 'Vérification budget',
    icon: '💰',
    description: 'Checking token budget availability',
    isCheckpoint: false,
  },
  {
    id: 'agent_compatibility',
    name: 'Agent Compatibility',
    nameFr: 'Compatibilité agents',
    icon: '🤖',
    description: 'Matching request with compatible agents',
    isCheckpoint: false,
  },
  {
    id: 'encoding_preparation',
    name: 'Encoding Preparation',
    nameFr: 'Préparation encodage',
    icon: '📝',
    description: 'Preparing semantic encoding for execution',
    isCheckpoint: false,
  },
  {
    id: 'authorization',
    name: 'Authorization',
    nameFr: 'Autorisation',
    icon: '✅',
    description: 'CHECKPOINT: User must approve before execution',
    isCheckpoint: true,
  },
  {
    id: 'execution',
    name: 'Execution',
    nameFr: 'Exécution',
    icon: '⚡',
    description: 'Executing approved actions via agents',
    isCheckpoint: false,
  },
  {
    id: 'validation',
    name: 'Validation',
    nameFr: 'Validation',
    icon: '🔬',
    description: 'Validating execution results',
    isCheckpoint: false,
  },
  {
    id: 'encoding_output',
    name: 'Encoding Output',
    nameFr: 'Encodage sortie',
    icon: '📦',
    description: 'Encoding output for storage and display',
    isCheckpoint: false,
  },
  {
    id: 'audit_logging',
    name: 'Audit Logging',
    nameFr: 'Journalisation audit',
    icon: '📋',
    description: 'Logging all actions for audit compliance',
    isCheckpoint: false,
  },
];

const SENSITIVITY_COLORS = {
  low: '#3EB4A2',      // Cenote Turquoise
  medium: '#D8B26A',   // Sacred Gold
  high: '#E67E22',     // Orange
  critical: '#E74C3C', // Red
};

const STATUS_COLORS = {
  pending: '#8D8371',
  in_progress: '#3EB4A2',
  completed: '#27AE60',
  failed: '#E74C3C',
  blocked: '#D8B26A',
  skipped: '#8D8371',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    padding: '24px',
    backgroundColor: '#1E1F22',
    borderRadius: '12px',
    border: '1px solid #2F4C39',
    color: '#E9E4D6',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#D8B26A',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 500,
  },
  pipeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(47, 76, 57, 0.3)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  stepIcon: {
    fontSize: '20px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#E9E4D6',
  },
  stepDescription: {
    fontSize: '12px',
    color: '#8D8371',
  },
  stepStatus: {
    fontSize: '12px',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '4px',
  },
  checkpointSection: {
    padding: '20px',
    backgroundColor: 'rgba(216, 178, 106, 0.1)',
    border: '2px solid #D8B26A',
    borderRadius: '12px',
  },
  checkpointTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#D8B26A',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkpointMessage: {
    fontSize: '14px',
    color: '#E9E4D6',
    marginBottom: '16px',
    lineHeight: 1.6,
  },
  checkpointActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  approveButton: {
    backgroundColor: '#3EB4A2',
    color: '#1E1F22',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    border: '1px solid #E74C3C',
    color: '#E74C3C',
  },
  encodingPreview: {
    padding: '16px',
    backgroundColor: 'rgba(62, 180, 162, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(62, 180, 162, 0.2)',
  },
  encodingHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  encodingTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#3EB4A2',
  },
  sensitivityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(30, 31, 34, 0.5)',
    borderRadius: '6px',
    fontSize: '13px',
  },
  actionIcon: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
  },
  outputSection: {
    padding: '16px',
    backgroundColor: 'rgba(39, 174, 96, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(39, 174, 96, 0.2)',
  },
  outputTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#27AE60',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  resultItem: {
    padding: '8px 12px',
    backgroundColor: 'rgba(30, 31, 34, 0.5)',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '8px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface PipelineStepRowProps {
  step: PipelineStep;
  isActive: boolean;
}

const PipelineStepRow: React.FC<PipelineStepRowProps> = ({ step, isActive }) => {
  const statusColor = STATUS_COLORS[step.status];
  
  return (
    <div 
      style={{
        ...styles.step,
        backgroundColor: isActive 
          ? 'rgba(62, 180, 162, 0.15)' 
          : step.isCheckpoint 
            ? 'rgba(216, 178, 106, 0.1)'
            : 'rgba(47, 76, 57, 0.3)',
        borderLeft: isActive ? '3px solid #3EB4A2' : step.isCheckpoint ? '3px solid #D8B26A' : 'none',
      }}
    >
      <div style={styles.stepIcon}>
        {step.status === 'in_progress' ? '⏳' : step.icon}
      </div>
      <div style={styles.stepInfo}>
        <div style={styles.stepName}>
          {step.nameFr}
          {step.isCheckpoint && ' 🔒'}
        </div>
        <div style={styles.stepDescription}>{step.description}</div>
      </div>
      <div 
        style={{
          ...styles.stepStatus,
          backgroundColor: `${statusColor}20`,
          color: statusColor,
        }}
      >
        {step.status === 'pending' && 'En attente'}
        {step.status === 'in_progress' && 'En cours...'}
        {step.status === 'completed' && '✓ Terminé'}
        {step.status === 'failed' && '✗ Échec'}
        {step.status === 'blocked' && '⏸ Bloqué'}
        {step.status === 'skipped' && '↷ Ignoré'}
      </div>
      {step.duration && (
        <div style={{ fontSize: '11px', color: '#8D8371' }}>
          {step.duration}ms
        </div>
      )}
    </div>
  );
};

interface CheckpointBlockingModalProps {
  isOpen: boolean;
  encoding?: EncodingPreview;
  onApprove: () => void;
  onReject: () => void;
}

const CheckpointBlockingModal: React.FC<CheckpointBlockingModalProps> = ({
  isOpen,
  encoding,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;
  
  return (
    <div style={styles.checkpointSection}>
      <div style={styles.checkpointTitle}>
        🔒 CHECKPOINT — Autorisation Requise
      </div>
      
      <div style={styles.checkpointMessage}>
        Approfondir cette analyse nécessite de dépasser le cadre actuel.
        <br />
        Souhaites-tu continuer ?
      </div>
      
      {encoding && (
        <div style={styles.encodingPreview}>
          <div style={styles.encodingHeader}>
            <span style={styles.encodingTitle}>📝 Actions prévues</span>
            <span 
              style={{
                ...styles.sensitivityBadge,
                backgroundColor: `${SENSITIVITY_COLORS[encoding.sensitivity]}20`,
                color: SENSITIVITY_COLORS[encoding.sensitivity],
              }}
            >
              {encoding.sensitivity.toUpperCase()}
            </span>
          </div>
          <div style={styles.actionsList}>
            {encoding.actions.map((action, idx) => (
              <div key={action.id} style={styles.actionItem}>
                <span style={styles.actionIcon}>
                  {action.type === 'analyze' && '🔍'}
                  {action.type === 'create' && '➕'}
                  {action.type === 'update' && '✏️'}
                  {action.type === 'delete' && '🗑️'}
                  {!['analyze', 'create', 'update', 'delete'].includes(action.type) && '⚡'}
                </span>
                <span style={{ color: '#E9E4D6' }}>{action.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={styles.checkpointActions}>
        <button 
          onClick={onReject}
          style={{ ...styles.button, ...styles.rejectButton }}
        >
          ✗ Annuler
        </button>
        <button 
          onClick={onApprove}
          style={{ ...styles.button, ...styles.approveButton }}
        >
          ✓ Approuver & Exécuter
        </button>
      </div>
    </div>
  );
};

interface ExecutionOutputDisplayProps {
  output: ExecutionOutput;
}

const ExecutionOutputDisplay: React.FC<ExecutionOutputDisplayProps> = ({ output }) => {
  return (
    <div style={styles.outputSection}>
      <div style={styles.outputTitle}>
        {output.status === 'success' && '✓ Exécution Réussie'}
        {output.status === 'partial' && '⚠ Exécution Partielle'}
        {output.status === 'failed' && '✗ Exécution Échouée'}
      </div>
      
      {output.results.map((result) => (
        <div 
          key={result.actionId} 
          style={{
            ...styles.resultItem,
            borderLeft: `3px solid ${result.status === 'success' ? '#27AE60' : '#E74C3C'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{result.actionId}</span>
            <span style={{ color: result.status === 'success' ? '#27AE60' : '#E74C3C' }}>
              {result.status === 'success' ? '✓' : '✗'}
            </span>
          </div>
          {result.error && (
            <div style={{ fontSize: '12px', color: '#E74C3C', marginTop: '4px' }}>
              {result.error}
            </div>
          )}
          {result.output && (
            <div style={{ fontSize: '12px', color: '#8D8371', marginTop: '4px' }}>
              {typeof result.output === 'string' 
                ? result.output 
                : JSON.stringify(result.output, null, 2).slice(0, 200)}
            </div>
          )}
        </div>
      ))}
      
      <div style={{ fontSize: '11px', color: '#8D8371', marginTop: '8px' }}>
        Terminé à {new Date(output.completedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaPipelineCanonicalProps {
  /** ID de la requête d'exécution */
  requestId?: string;
  /** Input utilisateur initial */
  userInput?: string;
  /** Callback quand le pipeline est terminé */
  onComplete?: (output: ExecutionOutput) => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** Mode compact */
  compact?: boolean;
}

export const NovaPipelineCanonical: React.FC<NovaPipelineCanonicalProps> = ({
  requestId,
  userInput,
  onComplete,
  onError,
  compact = false,
}) => {
  // State
  const [steps, setSteps] = useState<PipelineStep[]>(
    PIPELINE_STEPS_CONFIG.map(s => ({ ...s, status: 'pending' as PipelineStepStatus }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [checkpointOpen, setCheckpointOpen] = useState(false);
  const [encoding, setEncoding] = useState<EncodingPreview | null>(null);
  const [output, setOutput] = useState<ExecutionOutput | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'paused' | 'completed' | 'failed'>('idle');
  
  // Store hooks
  const { addToast } = useUIStore();
  
  // Start pipeline
  const startPipeline = useCallback(async () => {
    if (!userInput) return;
    
    setPipelineStatus('running');
    setCurrentStepIndex(0);
    setOutput(null);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' as PipelineStepStatus })));
    
    // Simulate pipeline execution
    for (let i = 0; i < PIPELINE_STEPS_CONFIG.length; i++) {
      const stepConfig = PIPELINE_STEPS_CONFIG[i];
      
      // Update current step to in_progress
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'in_progress' as PipelineStepStatus } : s
      ));
      setCurrentStepIndex(i);
      
      // Checkpoint step - pause and wait for approval
      if (stepConfig.isCheckpoint) {
        setCheckpointOpen(true);
        setPipelineStatus('paused');
        
        // Generate mock encoding preview
        setEncoding({
          id: `enc-${Date.now()}`,
          input: userInput,
          intent: 'Analyser et traiter la demande utilisateur',
          sensitivity: 'medium',
          requiresApproval: true,
          actions: [
            { id: 'act-1', type: 'analyze', target: 'input', description: 'Analyser l\'intention', params: {} },
            { id: 'act-2', type: 'create', target: 'response', description: 'Générer la réponse', params: {} },
          ],
        });
        
        return; // Wait for user approval
      }
      
      // Simulate step execution time
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      const duration = Date.now() - startTime;
      
      // Mark step as completed
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed' as PipelineStepStatus, duration } : s
      ));
    }
    
    // Pipeline completed
    const executionOutput: ExecutionOutput = {
      id: `out-${Date.now()}`,
      status: 'success',
      completedAt: new Date().toISOString(),
      results: [
        { actionId: 'act-1', status: 'success', output: 'Analyse terminée' },
        { actionId: 'act-2', status: 'success', output: 'Réponse générée avec succès' },
      ],
    };
    
    setOutput(executionOutput);
    setPipelineStatus('completed');
    onComplete?.(executionOutput);
  }, [userInput, onComplete]);
  
  // Handle checkpoint approval
  const handleApprove = useCallback(async () => {
    setCheckpointOpen(false);
    setPipelineStatus('running');
    
    // Mark authorization as completed
    const authIndex = PIPELINE_STEPS_CONFIG.findIndex(s => s.id === 'authorization');
    setSteps(prev => prev.map((s, idx) => 
      idx === authIndex ? { ...s, status: 'completed' as PipelineStepStatus, duration: 0 } : s
    ));
    
    // Continue pipeline from next step
    for (let i = authIndex + 1; i < PIPELINE_STEPS_CONFIG.length; i++) {
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'in_progress' as PipelineStepStatus } : s
      ));
      setCurrentStepIndex(i);
      
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      const duration = Date.now() - startTime;
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed' as PipelineStepStatus, duration } : s
      ));
    }
    
    // Pipeline completed
    const executionOutput: ExecutionOutput = {
      id: `out-${Date.now()}`,
      status: 'success',
      completedAt: new Date().toISOString(),
      results: [
        { actionId: 'act-1', status: 'success', output: 'Analyse terminée' },
        { actionId: 'act-2', status: 'success', output: 'Réponse générée avec succès' },
      ],
    };
    
    setOutput(executionOutput);
    setPipelineStatus('completed');
    addToast({ type: 'success', title: 'Exécution réussie', message: 'Le pipeline a été complété.' });
    onComplete?.(executionOutput);
  }, [addToast, onComplete]);
  
  // Handle checkpoint rejection
  const handleReject = useCallback(() => {
    setCheckpointOpen(false);
    setPipelineStatus('failed');
    
    const authIndex = PIPELINE_STEPS_CONFIG.findIndex(s => s.id === 'authorization');
    setSteps(prev => prev.map((s, idx) => 
      idx === authIndex 
        ? { ...s, status: 'blocked' as PipelineStepStatus, error: 'Rejeté par l\'utilisateur' } 
        : idx > authIndex 
          ? { ...s, status: 'skipped' as PipelineStepStatus }
          : s
    ));
    
    addToast({ type: 'warning', title: 'Exécution annulée', message: 'Vous avez refusé l\'autorisation.' });
    onError?.('Checkpoint rejected by user');
  }, [addToast, onError]);
  
  // Auto-start if input provided
  useEffect(() => {
    if (userInput && pipelineStatus === 'idle') {
      startPipeline();
    }
  }, [userInput, pipelineStatus, startPipeline]);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          🚀 Nova Pipeline
          {requestId && <span style={{ fontSize: '12px', color: '#8D8371' }}>#{requestId}</span>}
        </div>
        <div 
          style={{
            ...styles.statusBadge,
            backgroundColor: pipelineStatus === 'completed' ? '#27AE6020' : 
                            pipelineStatus === 'running' ? '#3EB4A220' :
                            pipelineStatus === 'paused' ? '#D8B26A20' :
                            pipelineStatus === 'failed' ? '#E74C3C20' : '#8D837120',
            color: pipelineStatus === 'completed' ? '#27AE60' : 
                   pipelineStatus === 'running' ? '#3EB4A2' :
                   pipelineStatus === 'paused' ? '#D8B26A' :
                   pipelineStatus === 'failed' ? '#E74C3C' : '#8D8371',
          }}
        >
          {pipelineStatus === 'idle' && '⏸ Inactif'}
          {pipelineStatus === 'running' && '▶ En cours'}
          {pipelineStatus === 'paused' && '⏸ En pause (Checkpoint)'}
          {pipelineStatus === 'completed' && '✓ Terminé'}
          {pipelineStatus === 'failed' && '✗ Échec'}
        </div>
      </div>
      
      {/* User Input */}
      {userInput && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: 'rgba(62, 180, 162, 0.05)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#E9E4D6',
        }}>
          <span style={{ color: '#3EB4A2', fontWeight: 500 }}>Input: </span>
          {userInput}
        </div>
      )}
      
      {/* Pipeline Steps */}
      {!compact && (
        <div style={styles.pipeline}>
          {steps.map((step, idx) => (
            <PipelineStepRow 
              key={step.id} 
              step={step} 
              isActive={idx === currentStepIndex}
            />
          ))}
        </div>
      )}
      
      {/* Checkpoint Modal */}
      <CheckpointBlockingModal
        isOpen={checkpointOpen}
        encoding={encoding || undefined}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      
      {/* Execution Output */}
      {output && <ExecutionOutputDisplay output={output} />}
      
      {/* Start Button (when idle) */}
      {pipelineStatus === 'idle' && !userInput && (
        <button
          onClick={() => startPipeline()}
          style={{ ...styles.button, ...styles.approveButton, justifyContent: 'center' }}
        >
          ▶ Démarrer le Pipeline
        </button>
      )}
    </div>
  );
};

export default NovaPipelineCanonical;
