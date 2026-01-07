/**
 * CHE·NU™ V72 - Pipeline Components
 * React components for Nova Pipeline and Data Processing UI
 * 
 * Components:
 * - PipelineQuery: Execute pipeline queries
 * - CheckpointModal: Approve/reject checkpoints
 * - PipelineStatus: Display pipeline execution status
 * - DataProcessingForm: Data processing job creation
 * - ValidationResults: Display validation errors
 * - SchemaBuilder: Create data schemas
 * 
 * Principle: GOVERNANCE > EXECUTION
 */

import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface LaneResult {
  lane_type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  data: Record<string, any>;
  error: string | null;
}

interface Checkpoint {
  id: string;
  pipeline_id: string;
  checkpoint_type: string;
  reason: string;
  decision: string;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
  options: string[];
  timeout_minutes: number;
  is_expired: boolean;
}

interface PipelineMetrics {
  total_time_ms: number;
  tokens_used: number;
  tokens_input: number;
  tokens_output: number;
  llm_calls: number;
  api_calls: number;
}

interface PipelineResult {
  pipeline_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  lanes: Record<string, LaneResult>;
  result: any;
  checkpoint: Checkpoint | null;
  metrics: PipelineMetrics;
  error: string | null;
  audit_id: string | null;
}

interface ValidationError {
  field: string;
  message: string;
  value: any;
  rule: string;
  severity: string;
}

interface ValidationResult {
  status: string;
  errors: ValidationError[];
  warnings: ValidationError[];
  validated_at: string;
  metadata: Record<string, any>;
}

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  enum?: any[];
  default?: any;
  description?: string;
}

interface DataSchema {
  schema_id: string;
  name: string;
  version: string;
  fields: SchemaField[];
  created_at: string;
  updated_at: string;
  description?: string;
}

interface ProcessingJob {
  job_id: string;
  source_type: string;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
  input_records: number;
  output_records: number;
  error_records: number;
  validation_result: ValidationResult | null;
  error: string | null;
}

// =============================================================================
// API CLIENT
// =============================================================================

const API_BASE = '/api/pipeline';

export const pipelineAPI = {
  // Nova Pipeline
  async executeQuery(
    query: string,
    identityId: string,
    context?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<{ result: PipelineResult; isCheckpoint: boolean }> {
    const response = await fetch(`${API_BASE}/nova/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        identity_id: identityId,
        context,
        options,
      }),
    });

    if (response.status === 423) {
      const detail = await response.json();
      return { result: detail.detail, isCheckpoint: true };
    }

    if (!response.ok) {
      throw new Error(`Pipeline execution failed: ${response.statusText}`);
    }

    return { result: await response.json(), isCheckpoint: false };
  },

  async approveCheckpoint(checkpointId: string, userId: string): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/nova/checkpoint/${checkpointId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(`Checkpoint approval failed: ${response.statusText}`);
    }

    return response.json();
  },

  async rejectCheckpoint(
    checkpointId: string,
    userId: string,
    reason?: string
  ): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/nova/checkpoint/${checkpointId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, reason }),
    });

    if (!response.ok) {
      throw new Error(`Checkpoint rejection failed: ${response.statusText}`);
    }

    return response.json();
  },

  async getPipelineStatus(pipelineId: string): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/nova/pipeline/${pipelineId}/status`);
    if (!response.ok) {
      throw new Error(`Failed to get pipeline status: ${response.statusText}`);
    }
    return response.json();
  },

  async getPendingCheckpoints(userId?: string): Promise<Checkpoint[]> {
    const url = userId
      ? `${API_BASE}/nova/checkpoints?user_id=${userId}`
      : `${API_BASE}/nova/checkpoints`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get checkpoints: ${response.statusText}`);
    }
    return response.json();
  },

  async getAuditLog(userId?: string, limit = 100): Promise<any[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (userId) params.append('user_id', userId);
    const response = await fetch(`${API_BASE}/nova/audit?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to get audit log: ${response.statusText}`);
    }
    return response.json();
  },

  // Data Processing
  async createSchema(
    name: string,
    version: string,
    fields: SchemaField[],
    description?: string
  ): Promise<DataSchema> {
    const response = await fetch(`${API_BASE}/data/schemas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, version, fields, description }),
    });

    if (!response.ok) {
      throw new Error(`Schema creation failed: ${response.statusText}`);
    }

    return response.json();
  },

  async listSchemas(): Promise<DataSchema[]> {
    const response = await fetch(`${API_BASE}/data/schemas`);
    if (!response.ok) {
      throw new Error(`Failed to list schemas: ${response.statusText}`);
    }
    return response.json();
  },

  async validateData(
    data: Record<string, any>[],
    schemaId: string,
    level = 'normal'
  ): Promise<ValidationResult> {
    const response = await fetch(`${API_BASE}/data/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, schema_id: schemaId, level }),
    });

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`);
    }

    return response.json();
  },

  async createJob(
    data: Record<string, any>[],
    transformations?: { type: string; config: Record<string, any> }[],
    schemaId?: string,
    validationLevel = 'normal'
  ): Promise<ProcessingJob> {
    const response = await fetch(`${API_BASE}/data/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_type: 'memory',
        data,
        transformations,
        schema_id: schemaId,
        validation_level: validationLevel,
      }),
    });

    if (!response.ok) {
      throw new Error(`Job creation failed: ${response.statusText}`);
    }

    return response.json();
  },

  async listJobs(status?: string, limit = 100): Promise<ProcessingJob[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (status) params.append('status', status);
    const response = await fetch(`${API_BASE}/data/jobs?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to list jobs: ${response.statusText}`);
    }
    return response.json();
  },
};

// =============================================================================
// PIPELINE QUERY COMPONENT
// =============================================================================

interface PipelineQueryProps {
  identityId: string;
  onResult?: (result: PipelineResult) => void;
  onCheckpoint?: (checkpoint: Checkpoint) => void;
  className?: string;
}

export const PipelineQuery: React.FC<PipelineQueryProps> = ({
  identityId,
  onResult,
  onCheckpoint,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { result: pipelineResult, isCheckpoint } = await pipelineAPI.executeQuery(
        query,
        identityId
      );

      if (isCheckpoint && pipelineResult.checkpoint) {
        onCheckpoint?.(pipelineResult.checkpoint);
      } else {
        setResult(pipelineResult);
        onResult?.(pipelineResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pipeline execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pipeline-query ${className}`}>
      <form onSubmit={handleSubmit} className="pipeline-query-form">
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query..."
            disabled={loading}
            className="query-input"
          />
          <button type="submit" disabled={loading || !query.trim()} className="submit-button">
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              <span>Execute</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {result && <PipelineStatusDisplay result={result} />}

      <style>{`
        .pipeline-query-form {
          margin-bottom: 1rem;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
        }
        .query-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }
        .query-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
        }
        .submit-button {
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fee;
          border: 1px solid #f88;
          border-radius: 8px;
          color: #c00;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// CHECKPOINT MODAL COMPONENT
// =============================================================================

interface CheckpointModalProps {
  checkpoint: Checkpoint;
  userId: string;
  onApprove?: (result: PipelineResult) => void;
  onReject?: (result: PipelineResult) => void;
  onClose?: () => void;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  checkpoint,
  userId,
  onApprove,
  onReject,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await pipelineAPI.approveCheckpoint(checkpoint.id, userId);
      onApprove?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await pipelineAPI.rejectCheckpoint(checkpoint.id, userId, rejectReason);
      onReject?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejection failed');
    } finally {
      setLoading(false);
    }
  };

  const getCheckpointTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      governance: '⚖️',
      cost: '💰',
      identity: '🔐',
      sensitive: '🔒',
      data_modification: '📝',
      external_api: '🌐',
      high_risk: '⚠️',
      custom: '📌',
    };
    return icons[type] || '❓';
  };

  const getCheckpointTypeName = (type: string) => {
    const names: Record<string, string> = {
      governance: 'Governance Check',
      cost: 'Cost Threshold',
      identity: 'Identity Verification',
      sensitive: 'Sensitive Data',
      data_modification: 'Data Modification',
      external_api: 'External API Call',
      high_risk: 'High Risk Operation',
      custom: 'Custom Checkpoint',
    };
    return names[type] || type;
  };

  return (
    <div className="checkpoint-modal-overlay">
      <div className="checkpoint-modal">
        <div className="modal-header">
          <div className="header-icon">
            {getCheckpointTypeIcon(checkpoint.checkpoint_type)}
          </div>
          <h2>Approval Required</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="checkpoint-type">
            <span className="label">Type:</span>
            <span className="value">{getCheckpointTypeName(checkpoint.checkpoint_type)}</span>
          </div>

          <div className="checkpoint-reason">
            <span className="label">Reason:</span>
            <p className="value">{checkpoint.reason}</p>
          </div>

          <div className="checkpoint-info">
            <div className="info-item">
              <span className="label">Pipeline ID:</span>
              <code>{checkpoint.pipeline_id.slice(0, 8)}...</code>
            </div>
            <div className="info-item">
              <span className="label">Timeout:</span>
              <span>{checkpoint.timeout_minutes} minutes</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`status ${checkpoint.is_expired ? 'expired' : 'pending'}`}>
                {checkpoint.is_expired ? 'Expired' : 'Pending'}
              </span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {showRejectInput && (
            <div className="reject-reason-input">
              <label>Reason for rejection (optional):</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="reject-button"
            onClick={handleReject}
            disabled={loading || checkpoint.is_expired}
          >
            {showRejectInput ? 'Confirm Reject' : 'Reject'}
          </button>
          <button
            className="approve-button"
            onClick={handleApprove}
            disabled={loading || checkpoint.is_expired}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>

      <style>{`
        .checkpoint-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .checkpoint-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 500px;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        .header-icon {
          font-size: 1.5rem;
        }
        .modal-header h2 {
          flex: 1;
          margin: 0;
          font-size: 1.25rem;
          color: #212529;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .close-button:hover {
          color: #212529;
        }
        .modal-content {
          padding: 1.25rem;
        }
        .checkpoint-type, .checkpoint-reason {
          margin-bottom: 1rem;
        }
        .label {
          display: block;
          font-size: 0.875rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }
        .value {
          color: #212529;
        }
        .checkpoint-reason .value {
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 8px;
          margin: 0;
        }
        .checkpoint-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #dee2e6;
        }
        .info-item {
          text-align: center;
        }
        .info-item .label {
          margin-bottom: 0.5rem;
        }
        .info-item code {
          background: #f8f9fa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .status.expired {
          color: #dc3545;
        }
        .status.pending {
          color: #ffc107;
        }
        .error-message {
          background: #fee;
          border: 1px solid #f88;
          border-radius: 8px;
          padding: 0.75rem;
          margin-top: 1rem;
          color: #c00;
        }
        .reject-reason-input {
          margin-top: 1rem;
        }
        .reject-reason-input label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
        }
        .reject-reason-input textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          resize: vertical;
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
        }
        .reject-button, .approve-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .reject-button {
          background: #dc3545;
          color: white;
        }
        .approve-button {
          background: #28a745;
          color: white;
        }
        .reject-button:disabled, .approve-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// PIPELINE STATUS DISPLAY COMPONENT
// =============================================================================

interface PipelineStatusDisplayProps {
  result: PipelineResult;
  showDetails?: boolean;
  className?: string;
}

export const PipelineStatusDisplay: React.FC<PipelineStatusDisplayProps> = ({
  result,
  showDetails = true,
  className = '',
}) => {
  const [expandedLane, setExpandedLane] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#6c757d',
      running: '#007bff',
      completed: '#28a745',
      failed: '#dc3545',
      checkpoint_pending: '#ffc107',
      checkpoint_approved: '#28a745',
      checkpoint_rejected: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const getLaneIcon = (laneType: string) => {
    const icons: Record<string, string> = {
      lane_a_intent: '🎯',
      lane_b_context: '📋',
      lane_c_encoding: '🔤',
      lane_d_governance: '⚖️',
      lane_e_checkpoint: '🚦',
      lane_f_execution: '⚡',
      lane_g_audit: '📝',
    };
    return icons[laneType] || '⬜';
  };

  const getLaneName = (laneType: string) => {
    const names: Record<string, string> = {
      lane_a_intent: 'Intent Analysis',
      lane_b_context: 'Context Snapshot',
      lane_c_encoding: 'Semantic Encoding',
      lane_d_governance: 'Governance Rules',
      lane_e_checkpoint: 'Checkpoint',
      lane_f_execution: 'Execution',
      lane_g_audit: 'Audit',
    };
    return names[laneType] || laneType;
  };

  return (
    <div className={`pipeline-status ${className}`}>
      <div className="status-header">
        <div className="status-badge" style={{ background: getStatusColor(result.status) }}>
          {result.status.replace(/_/g, ' ').toUpperCase()}
        </div>
        <span className="pipeline-id">Pipeline: {result.pipeline_id.slice(0, 8)}...</span>
      </div>

      <div className="metrics-bar">
        <div className="metric">
          <span className="metric-value">{result.metrics.total_time_ms}ms</span>
          <span className="metric-label">Duration</span>
        </div>
        <div className="metric">
          <span className="metric-value">{result.metrics.tokens_used}</span>
          <span className="metric-label">Tokens</span>
        </div>
        <div className="metric">
          <span className="metric-value">{result.metrics.api_calls}</span>
          <span className="metric-label">API Calls</span>
        </div>
      </div>

      {showDetails && (
        <div className="lanes-list">
          {Object.entries(result.lanes).map(([key, lane]) => (
            <div
              key={key}
              className={`lane-item ${expandedLane === key ? 'expanded' : ''}`}
              onClick={() => setExpandedLane(expandedLane === key ? null : key)}
            >
              <div className="lane-header">
                <span className="lane-icon">{getLaneIcon(lane.lane_type)}</span>
                <span className="lane-name">{getLaneName(lane.lane_type)}</span>
                <span
                  className="lane-status"
                  style={{ color: getStatusColor(lane.status) }}
                >
                  {lane.status}
                </span>
                {lane.duration_ms !== null && (
                  <span className="lane-duration">{lane.duration_ms}ms</span>
                )}
              </div>
              
              {expandedLane === key && (
                <div className="lane-details">
                  <pre>{JSON.stringify(lane.data, null, 2)}</pre>
                  {lane.error && (
                    <div className="lane-error">Error: {lane.error}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result.result && (
        <div className="result-section">
          <h4>Result</h4>
          <pre>{JSON.stringify(result.result, null, 2)}</pre>
        </div>
      )}

      {result.error && (
        <div className="error-section">
          <h4>Error</h4>
          <p>{result.error}</p>
        </div>
      )}

      <style>{`
        .pipeline-status {
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
        }
        .status-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .pipeline-id {
          color: #6c757d;
          font-family: monospace;
        }
        .metrics-bar {
          display: flex;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .metric {
          flex: 1;
          padding: 0.75rem;
          text-align: center;
          border-right: 1px solid #dee2e6;
        }
        .metric:last-child {
          border-right: none;
        }
        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: #212529;
        }
        .metric-label {
          font-size: 0.75rem;
          color: #6c757d;
        }
        .lanes-list {
          padding: 0.5rem;
        }
        .lane-item {
          background: white;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          overflow: hidden;
        }
        .lane-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
        }
        .lane-icon {
          font-size: 1.25rem;
        }
        .lane-name {
          flex: 1;
          font-weight: 500;
        }
        .lane-status {
          font-size: 0.875rem;
          font-weight: 500;
        }
        .lane-duration {
          font-size: 0.75rem;
          color: #6c757d;
        }
        .lane-details {
          padding: 1rem;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
        }
        .lane-details pre {
          margin: 0;
          font-size: 0.75rem;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .lane-error {
          margin-top: 0.5rem;
          color: #dc3545;
        }
        .result-section, .error-section {
          padding: 1rem;
          background: white;
          margin: 0.5rem;
          border-radius: 8px;
        }
        .result-section h4, .error-section h4 {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
        }
        .result-section pre {
          margin: 0;
          font-size: 0.75rem;
          white-space: pre-wrap;
        }
        .error-section {
          background: #fee;
        }
        .error-section p {
          margin: 0;
          color: #c00;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// VALIDATION RESULTS COMPONENT
// =============================================================================

interface ValidationResultsProps {
  result: ValidationResult;
  className?: string;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  result,
  className = '',
}) => {
  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      valid: '✅',
      invalid: '❌',
      warning: '⚠️',
    };
    return icons[status] || '❓';
  };

  return (
    <div className={`validation-results ${className}`}>
      <div className="validation-header">
        <span className="status-icon">{getStatusIcon(result.status)}</span>
        <span className="status-text">
          {result.status === 'valid'
            ? 'Validation Passed'
            : result.status === 'invalid'
            ? 'Validation Failed'
            : 'Validation Warnings'}
        </span>
      </div>

      {result.errors.length > 0 && (
        <div className="errors-section">
          <h4>Errors ({result.errors.length})</h4>
          <ul>
            {result.errors.map((error, idx) => (
              <li key={idx} className="error-item">
                <span className="field">{error.field}</span>
                <span className="message">{error.message}</span>
                <span className="rule">[{error.rule}]</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="warnings-section">
          <h4>Warnings ({result.warnings.length})</h4>
          <ul>
            {result.warnings.map((warning, idx) => (
              <li key={idx} className="warning-item">
                <span className="field">{warning.field}</span>
                <span className="message">{warning.message}</span>
                <span className="rule">[{warning.rule}]</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .validation-results {
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        .validation-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .status-icon {
          font-size: 1.25rem;
        }
        .status-text {
          font-weight: 500;
        }
        .errors-section, .warnings-section {
          padding: 1rem;
        }
        .errors-section h4, .warnings-section h4 {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
        }
        .errors-section ul, .warnings-section ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .error-item, .warning-item {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }
        .error-item {
          border-left: 3px solid #dc3545;
        }
        .warning-item {
          border-left: 3px solid #ffc107;
        }
        .field {
          font-family: monospace;
          background: #f8f9fa;
          padding: 0 0.25rem;
          border-radius: 2px;
        }
        .message {
          flex: 1;
        }
        .rule {
          color: #6c757d;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// PENDING CHECKPOINTS LIST
// =============================================================================

interface PendingCheckpointsListProps {
  userId?: string;
  onSelect?: (checkpoint: Checkpoint) => void;
  className?: string;
}

export const PendingCheckpointsList: React.FC<PendingCheckpointsListProps> = ({
  userId,
  onSelect,
  className = '',
}) => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckpoints = useCallback(async () => {
    try {
      const data = await pipelineAPI.getPendingCheckpoints(userId);
      setCheckpoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checkpoints');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCheckpoints();
    // Poll every 30 seconds
    const interval = setInterval(fetchCheckpoints, 30000);
    return () => clearInterval(interval);
  }, [fetchCheckpoints]);

  if (loading) {
    return <div className="loading">Loading checkpoints...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (checkpoints.length === 0) {
    return (
      <div className={`pending-checkpoints empty ${className}`}>
        <p>No pending checkpoints</p>
      </div>
    );
  }

  return (
    <div className={`pending-checkpoints ${className}`}>
      <h3>Pending Approvals ({checkpoints.length})</h3>
      <ul>
        {checkpoints.map((cp) => (
          <li key={cp.id} onClick={() => onSelect?.(cp)}>
            <span className="type">{cp.checkpoint_type}</span>
            <span className="reason">{cp.reason}</span>
            <span className="time">
              {Math.round((Date.now() - new Date(cp.created_at).getTime()) / 60000)}m ago
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        .pending-checkpoints {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 1rem;
        }
        .pending-checkpoints.empty {
          background: #f8f9fa;
          border-color: #dee2e6;
          text-align: center;
          color: #6c757d;
        }
        .pending-checkpoints h3 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
        }
        .pending-checkpoints ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .pending-checkpoints li {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }
        .pending-checkpoints li:hover {
          background: #f8f9fa;
        }
        .type {
          font-weight: 500;
          text-transform: capitalize;
        }
        .reason {
          flex: 1;
          color: #6c757d;
        }
        .time {
          font-size: 0.75rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  pipelineAPI,
};

export type {
  LaneResult,
  Checkpoint,
  PipelineMetrics,
  PipelineResult,
  ValidationError,
  ValidationResult,
  SchemaField,
  DataSchema,
  ProcessingJob,
};
