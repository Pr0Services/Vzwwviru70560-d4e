/**
 * CHE·NU™ - GOVERNED EXECUTION PIPELINE
 * 
 * Governance is ALWAYS enforced before execution.
 * This component visualizes and manages the 10-step governance pipeline.
 * 
 * Governance is not a restriction - Governance is empowerment.
 */

import React, { useState, useEffect } from 'react';
import { useTokenStore } from '../../stores/token.store';
import { useThreadStore } from '../../stores/thread.store';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type PipelineStep = 
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

export interface ExecutionRequest {
  id: string;
  threadId: string;
  userId: string;
  intent: string;
  targetAgents: string[];
  estimatedTokens: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
  metadata: Record<string, unknown>;
}

export interface PipelineState {
  currentStep: PipelineStep;
  completedSteps: PipelineStep[];
  failedStep?: PipelineStep;
  warnings: PipelineWarning[];
  blockers: PipelineBlocker[];
  metrics: PipelineMetrics;
}

export interface PipelineWarning {
  step: PipelineStep;
  message: string;
  severity: 'info' | 'warning';
}

export interface PipelineBlocker {
  step: PipelineStep;
  message: string;
  resolution?: string;
}

export interface PipelineMetrics {
  startTime: number;
  stepTimes: Record<PipelineStep, number>;
  totalTokensReserved: number;
  encodingEfficiency: number;
}

// ═══════════════════════════════════════════════════════════════
// PIPELINE STEPS DEFINITION
// ═══════════════════════════════════════════════════════════════

const PIPELINE_STEPS: { id: PipelineStep; name: string; description: string; icon: string }[] = [
  {
    id: 'intent_analysis',
    name: 'Intent Analysis',
    description: 'Analyze and validate user intent',
    icon: '🎯',
  },
  {
    id: 'scope_verification',
    name: 'Scope Verification',
    description: 'Verify request is within allowed scope',
    icon: '🔍',
  },
  {
    id: 'budget_check',
    name: 'Budget Check',
    description: 'Check token budget availability',
    icon: '💰',
  },
  {
    id: 'agent_compatibility',
    name: 'Agent Compatibility',
    description: 'Match request with compatible agents',
    icon: '🤖',
  },
  {
    id: 'encoding_preparation',
    name: 'Encoding Preparation',
    description: 'Prepare encoding for efficiency',
    icon: '📦',
  },
  {
    id: 'authorization',
    name: 'Authorization',
    description: 'Final governance authorization',
    icon: '✅',
  },
  {
    id: 'execution',
    name: 'Execution',
    description: 'Execute the governed request',
    icon: '⚡',
  },
  {
    id: 'validation',
    name: 'Validation',
    description: 'Validate execution results',
    icon: '🔒',
  },
  {
    id: 'encoding_output',
    name: 'Encoding Output',
    description: 'Encode output for efficiency',
    icon: '📤',
  },
  {
    id: 'audit_logging',
    name: 'Audit Logging',
    description: 'Log complete audit trail',
    icon: '📝',
  },
];

// ═══════════════════════════════════════════════════════════════
// STEP STATUS COMPONENT
// ═══════════════════════════════════════════════════════════════

interface StepStatusProps {
  step: typeof PIPELINE_STEPS[0];
  status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
  warning?: PipelineWarning;
  duration?: number;
}

const StepStatus: React.FC<StepStatusProps> = ({ step, status, warning, duration }) => {
  const statusColors = {
    pending: '#444',
    active: '#D8B26A',
    completed: '#3F7249',
    failed: '#e74c3c',
    skipped: '#666',
  };

  return (
    <div className={`pipeline-step ${status}`}>
      <div className="step-indicator" style={{ backgroundColor: statusColors[status] }}>
        {status === 'completed' && '✓'}
        {status === 'failed' && '✕'}
        {status === 'active' && <span className="pulse" />}
        {status === 'pending' && step.icon}
        {status === 'skipped' && '—'}
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <span className="step-name">{step.name}</span>
          {duration !== undefined && (
            <span className="step-duration">{duration}ms</span>
          )}
        </div>
        <p className="step-description">{step.description}</p>
        {warning && (
          <div className={`step-warning ${warning.severity}`}>
            <span className="icon">{warning.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
            {warning.message}
          </div>
        )}
      </div>

      <style>{`
        .pipeline-step {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .pipeline-step.active {
          background: rgba(216, 178, 106, 0.1);
          border: 1px solid rgba(216, 178, 106, 0.3);
        }

        .pipeline-step.completed {
          opacity: 0.8;
        }

        .pipeline-step.failed {
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .step-indicator {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #fff;
          flex-shrink: 0;
        }

        .pulse {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }

        .step-content {
          flex: 1;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .step-name {
          font-weight: 600;
          color: #fff;
        }

        .step-duration {
          font-size: 12px;
          color: #888;
          font-family: monospace;
        }

        .step-description {
          margin: 0;
          font-size: 13px;
          color: #888;
        }

        .step-warning {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
        }

        .step-warning.warning {
          background: rgba(243, 156, 18, 0.1);
          color: #f39c12;
        }

        .step-warning.info {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PIPELINE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface GovernedExecutionPipelineProps {
  request?: ExecutionRequest;
  onComplete?: (result: unknown) => void;
  onCancel?: () => void;
  showMetrics?: boolean;
}

export const GovernedExecutionPipeline: React.FC<GovernedExecutionPipelineProps> = ({
  request,
  onComplete,
  onCancel,
  showMetrics = true,
}) => {
  const { checkRules } = useTokenStore();
  const [state, setState] = useState<PipelineState>({
    currentStep: 'intent_analysis',
    completedSteps: [],
    warnings: [],
    blockers: [],
    metrics: {
      startTime: Date.now(),
      stepTimes: {} as Record<PipelineStep, number>,
      totalTokensReserved: 0,
      encodingEfficiency: 0,
    },
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Get step status
  const getStepStatus = (stepId: PipelineStep): StepStatusProps['status'] => {
    if (state.failedStep === stepId) return 'failed';
    if (state.completedSteps.includes(stepId)) return 'completed';
    if (state.currentStep === stepId && isRunning) return 'active';
    return 'pending';
  };

  // Simulate pipeline execution
  const runPipeline = async () => {
    if (!request) return;
    
    setIsRunning(true);
    const startTime = Date.now();

    for (const step of PIPELINE_STEPS) {
      if (isPaused) break;
      
      setState((prev) => ({
        ...prev,
        currentStep: step.id,
      }));

      // Simulate step execution
      const stepStart = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
      
      // Check for blockers at budget check step
      if (step.id === 'budget_check') {
        // Simulate budget check
        if (request.estimatedTokens > 10000) {
          setState((prev) => ({
            ...prev,
            failedStep: 'budget_check',
            blockers: [...prev.blockers, {
              step: 'budget_check',
              message: 'Insufficient token budget for this operation',
              resolution: 'Allocate more tokens or reduce scope',
            }],
          }));
          setIsRunning(false);
          return;
        }
      }

      setState((prev) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, step.id],
        metrics: {
          ...prev.metrics,
          stepTimes: {
            ...prev.metrics.stepTimes,
            [step.id]: Date.now() - stepStart,
          },
        },
      }));
    }

    setIsRunning(false);
    onComplete?.({ success: true, totalTime: Date.now() - startTime });
  };

  // Calculate totals
  const totalTime = Object.values(state.metrics.stepTimes).reduce((a, b) => a + b, 0);
  const completionPercent = (state.completedSteps.length / PIPELINE_STEPS.length) * 100;

  return (
    <div className="governance-pipeline">
      {/* Header */}
      <header className="pipeline-header">
        <div className="header-info">
          <h2>🔒 Governed Execution Pipeline</h2>
          <p>Governance is empowerment, not restriction</p>
        </div>
        
        <div className="header-actions">
          {!isRunning ? (
            <button className="btn-start" onClick={runPipeline} disabled={!request}>
              ▶ Start Pipeline
            </button>
          ) : (
            <>
              <button className="btn-pause" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <span className="progress-text">
          {state.completedSteps.length} / {PIPELINE_STEPS.length} steps
        </span>
      </div>

      {/* Steps */}
      <div className="pipeline-steps">
        {PIPELINE_STEPS.map((step) => (
          <StepStatus
            key={step.id}
            step={step}
            status={getStepStatus(step.id)}
            warning={state.warnings.find((w) => w.step === step.id)}
            duration={state.metrics.stepTimes[step.id]}
          />
        ))}
      </div>

      {/* Blockers */}
      {state.blockers.length > 0 && (
        <div className="blockers-section">
          <h3>⛔ Execution Blocked</h3>
          {state.blockers.map((blocker, i) => (
            <div key={i} className="blocker-card">
              <strong>{blocker.step}</strong>
              <p>{blocker.message}</p>
              {blocker.resolution && (
                <span className="resolution">💡 {blocker.resolution}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      {showMetrics && (
        <div className="metrics-section">
          <h3>📊 Pipeline Metrics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-value">{totalTime}ms</span>
              <span className="metric-label">Total Time</span>
            </div>
            <div className="metric">
              <span className="metric-value">{request?.estimatedTokens || 0}</span>
              <span className="metric-label">Tokens Reserved</span>
            </div>
            <div className="metric">
              <span className="metric-value">{state.warnings.length}</span>
              <span className="metric-label">Warnings</span>
            </div>
            <div className="metric">
              <span className="metric-value">{Math.round(completionPercent)}%</span>
              <span className="metric-label">Progress</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .governance-pipeline {
          background: #111;
          border-radius: 16px;
          border: 1px solid #222;
          padding: 24px;
        }

        .pipeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .header-info h2 {
          color: #D8B26A;
          margin: 0 0 4px;
          font-size: 18px;
        }

        .header-info p {
          color: #666;
          margin: 0;
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .btn-start,
        .btn-pause,
        .btn-cancel {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-start {
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          color: #1a1a1a;
        }

        .btn-start:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-pause {
          background: rgba(243, 156, 18, 0.2);
          border: 1px solid rgba(243, 156, 18, 0.3);
          color: #f39c12;
        }

        .btn-cancel {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid rgba(231, 76, 60, 0.3);
          color: #e74c3c;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #222;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D8B26A, #3F7249);
          transition: width 0.3s ease;
        }

        .progress-text {
          color: #888;
          font-size: 12px;
          white-space: nowrap;
        }

        .pipeline-steps {
          margin-bottom: 24px;
        }

        .blockers-section {
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .blockers-section h3 {
          color: #e74c3c;
          font-size: 14px;
          margin: 0 0 12px;
        }

        .blocker-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 12px;
        }

        .blocker-card strong {
          color: #fff;
          text-transform: uppercase;
          font-size: 11px;
        }

        .blocker-card p {
          color: #ccc;
          margin: 8px 0;
          font-size: 14px;
        }

        .resolution {
          color: #3EB4A2;
          font-size: 12px;
        }

        .metrics-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 16px;
        }

        .metrics-section h3 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin: 0 0 16px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #D8B26A;
        }

        .metric-label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-top: 4px;
        }

        @media (max-width: 600px) {
          .pipeline-header {
            flex-direction: column;
            gap: 16px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default GovernedExecutionPipeline;
