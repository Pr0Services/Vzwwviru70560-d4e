/**
 * CHE·NU™ Nova Pipeline Components
 * 
 * Frontend components for Nova Multi-Lane Pipeline:
 * - Checkpoint approval modal (HTTP 423 handling)
 * - Pipeline status display
 * - Real-time updates via WebSocket
 * 
 * CANON: GOUVERNANCE > EXÉCUTION
 * 
 * @author CHE·NU Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface LaneStatus {
  lane_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  duration_ms: number;
  error?: string;
}

export interface PipelineCheckpoint {
  id: string;
  type: string;
  reason: string;
  requires_approval: boolean;
  options: string[];
  created_at: string;
  expires_at?: string;
  is_pending: boolean;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
}

export interface PipelineMetrics {
  total_tokens_used: number;
  total_time_ms: number;
}

export interface PipelineResult {
  pipeline_id: string;
  query_id: string;
  status: 'pending' | 'running' | 'checkpoint_pending' | 'approved' | 'rejected' | 'completed' | 'failed' | 'cancelled';
  lanes: Record<string, LaneStatus | null>;
  result?: any;
  error?: string;
  checkpoint?: PipelineCheckpoint;
  metrics: PipelineMetrics;
}

// =============================================================================
// API CLIENT
// =============================================================================

const API_BASE = '/api/v2/nova';

export const pipelineAPI = {
  async executeQuery(request: {
    query: string;
    identity_id: string;
    sphere_id?: string;
    context?: Record<string, any>;
    options?: Record<string, any>;
  }): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (response.status === 423) {
      const data = await response.json();
      return {
        pipeline_id: data.pipeline_id,
        query_id: '',
        status: 'checkpoint_pending',
        lanes: {},
        checkpoint: data.checkpoint,
        metrics: { total_tokens_used: 0, total_time_ms: 0 },
      };
    }
    
    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.detail?.message || 'Identity violation');
    }
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Query failed');
    }
    
    return response.json();
  },
  
  async approveCheckpoint(checkpointId: string, approverId: string, notes?: string): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/checkpoint/${checkpointId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approver_id: approverId, notes }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Approval failed');
    }
    
    return response.json();
  },
  
  async rejectCheckpoint(checkpointId: string, rejectorId: string, reason?: string): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/checkpoint/${checkpointId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejector_id: rejectorId, reason }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Rejection failed');
    }
    
    return response.json();
  },
  
  async getPipeline(pipelineId: string): Promise<PipelineResult> {
    const response = await fetch(`${API_BASE}/pipeline/${pipelineId}`);
    if (!response.ok) throw new Error('Failed to get pipeline');
    return response.json();
  },
  
  async listCheckpoints(identityId?: string): Promise<{ checkpoints: PipelineCheckpoint[]; total: number }> {
    const url = identityId 
      ? `${API_BASE}/checkpoints?identity_id=${encodeURIComponent(identityId)}`
      : `${API_BASE}/checkpoints`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to list checkpoints');
    return response.json();
  },
  
  async getMetrics(): Promise<Record<string, number>> {
    const response = await fetch(`${API_BASE}/metrics`);
    if (!response.ok) throw new Error('Failed to get metrics');
    return response.json();
  },
};

// =============================================================================
// WEBSOCKET HOOK
// =============================================================================

interface NovaEvent {
  type: string;
  pipeline_id: string;
  status: string;
  checkpoint_id?: string;
  timestamp: string;
}

export function usePipelineWebSocket(identityId: string) {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<NovaEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${API_BASE}/ws/${identityId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 5000);
    };
    ws.onmessage = (e) => {
      try {
        setLastEvent(JSON.parse(e.data));
      } catch {}
    };
  }, [identityId]);
  
  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);
  
  return { connected, lastEvent };
}

// =============================================================================
// CHECKPOINT APPROVAL MODAL
// =============================================================================

interface CheckpointModalProps {
  checkpoint: PipelineCheckpoint;
  onApprove: (notes?: string) => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const CheckpointApprovalModal: React.FC<CheckpointModalProps> = ({
  checkpoint,
  onApprove,
  onReject,
  onClose,
  loading = false,
}) => {
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState<'approve' | 'reject'>('approve');
  
  const expiresAt = checkpoint.expires_at ? new Date(checkpoint.expires_at) : null;
  const minutesLeft = expiresAt 
    ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000))
    : null;
  
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 style={styles.title}>Action Requires Approval</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        {/* Content */}
        <div style={styles.content}>
          {/* Warning */}
          <div style={styles.warning}>
            <span style={styles.badge}>{checkpoint.type.toUpperCase()}</span>
            <p style={styles.warningText}>{checkpoint.reason}</p>
          </div>
          
          {/* Details */}
          <div style={styles.details}>
            <div style={styles.row}>
              <span style={styles.label}>ID:</span>
              <code style={styles.code}>{checkpoint.id.slice(0, 12)}...</code>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Created:</span>
              <span>{new Date(checkpoint.created_at).toLocaleString()}</span>
            </div>
            {minutesLeft !== null && (
              <div style={styles.row}>
                <span style={styles.label}>Expires:</span>
                <span style={{ color: minutesLeft < 60 ? '#ef4444' : '#fff' }}>
                  {minutesLeft} minutes
                </span>
              </div>
            )}
          </div>
          
          {/* CANON Notice */}
          <div style={styles.canon}>
            <strong>CANON: GOUVERNANCE &gt; EXÉCUTION</strong>
            <p>This action has been blocked pending human approval.</p>
          </div>
          
          {/* Input */}
          {mode === 'approve' ? (
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Notes (optional):</label>
              <textarea
                style={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for audit trail..."
                rows={3}
              />
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Rejection Reason:</label>
              <textarea
                style={styles.textarea}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide rejection reason..."
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div style={styles.actions}>
          {mode === 'approve' ? (
            <>
              <button
                style={{ ...styles.btn, ...styles.btnReject }}
                onClick={() => setMode('reject')}
                disabled={loading}
              >
                Reject
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnApprove }}
                onClick={() => onApprove(notes || undefined)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Approve & Continue'}
              </button>
            </>
          ) : (
            <>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={() => setMode('approve')}
                disabled={loading}
              >
                Back
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnReject }}
                onClick={() => onReject(reason || undefined)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PIPELINE STATUS
// =============================================================================

const LANE_NAMES: Record<string, string> = {
  lane_a_intent: 'A: Intent',
  lane_b_context: 'B: Context',
  lane_c_encoding: 'C: Encoding',
  lane_d_governance: 'D: Governance',
  lane_e_checkpoint: 'E: Checkpoint',
  lane_f_execution: 'F: Execution',
  lane_g_audit: 'G: Audit',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#888',
  running: '#ffa500',
  completed: '#4ade80',
  failed: '#ef4444',
  skipped: '#666',
};

interface PipelineStatusProps {
  pipeline: PipelineResult;
  compact?: boolean;
}

export const PipelineStatus: React.FC<PipelineStatusProps> = ({ pipeline, compact = false }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'failed': return '✗';
      case 'running': return '●';
      default: return '○';
    }
  };
  
  return (
    <div style={styles.pipelineStatus}>
      {/* Header */}
      <div style={styles.pipelineHeader}>
        <span style={{
          ...styles.statusBadge,
          background: pipeline.status === 'completed' ? '#22c55e' 
            : pipeline.status === 'failed' ? '#ef4444'
            : pipeline.status === 'checkpoint_pending' ? '#ffa500'
            : '#667eea'
        }}>
          {pipeline.status.replace('_', ' ').toUpperCase()}
        </span>
        <code style={styles.pipelineId}>{pipeline.pipeline_id.slice(0, 8)}</code>
      </div>
      
      {/* Lanes */}
      {!compact && (
        <div style={styles.lanes}>
          {Object.entries(LANE_NAMES).map(([key, label]) => {
            const lane = pipeline.lanes[key];
            const status = lane?.status || 'pending';
            return (
              <div key={key} style={styles.lane}>
                <span style={{ ...styles.laneIcon, color: STATUS_COLORS[status] }}>
                  {getIcon(status)}
                </span>
                <span style={styles.laneName}>{label}</span>
                {lane?.duration_ms ? (
                  <span style={styles.laneDuration}>{lane.duration_ms}ms</span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Metrics */}
      <div style={styles.metrics}>
        <span>Tokens: {pipeline.metrics.total_tokens_used.toLocaleString()}</span>
        <span>Time: {pipeline.metrics.total_time_ms}ms</span>
      </div>
      
      {/* Error */}
      {pipeline.error && (
        <div style={styles.error}>{pipeline.error}</div>
      )}
    </div>
  );
};

// =============================================================================
// PIPELINE QUERY COMPONENT
// =============================================================================

interface PipelineQueryProps {
  identityId: string;
  sphereId?: string;
  onResult?: (result: PipelineResult) => void;
  onError?: (error: Error) => void;
}

export const PipelineQuery: React.FC<PipelineQueryProps> = ({
  identityId,
  sphereId,
  onResult,
  onError,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await pipelineAPI.executeQuery({
        query: query.trim(),
        identity_id: identityId,
        sphere_id: sphereId,
      });
      
      setResult(response);
      if (response.status === 'checkpoint_pending') {
        setShowCheckpoint(true);
      }
      onResult?.(response);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Query failed'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (notes?: string) => {
    if (!result?.checkpoint) return;
    setLoading(true);
    try {
      const response = await pipelineAPI.approveCheckpoint(
        result.checkpoint.id,
        identityId,
        notes
      );
      setResult(response);
      setShowCheckpoint(false);
      onResult?.(response);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Approval failed'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleReject = async (reason?: string) => {
    if (!result?.checkpoint) return;
    setLoading(true);
    try {
      const response = await pipelineAPI.rejectCheckpoint(
        result.checkpoint.id,
        identityId,
        reason
      );
      setResult(response);
      setShowCheckpoint(false);
      onResult?.(response);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Rejection failed'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.queryComponent}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Nova..."
          disabled={loading}
          style={styles.input}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={styles.submitBtn}
        >
          {loading ? '...' : '→'}
        </button>
      </form>
      
      {result && <PipelineStatus pipeline={result} />}
      
      {showCheckpoint && result?.checkpoint && (
        <CheckpointApprovalModal
          checkpoint={result.checkpoint}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setShowCheckpoint(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#1a1a2e',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    border: '1px solid rgba(255,165,0,0.3)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,165,0,0.2)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    background: 'rgba(255,165,0,0.1)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 18,
    padding: 8,
  },
  content: {
    padding: 24,
  },
  warning: {
    background: 'rgba(255,165,0,0.1)',
    border: '1px solid rgba(255,165,0,0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  badge: {
    display: 'inline-block',
    background: '#ffa500',
    color: '#000',
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: 4,
    marginBottom: 8,
  },
  warningText: {
    margin: 0,
    color: '#fff',
    fontSize: 14,
  },
  details: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: 13,
    color: '#fff',
  },
  label: {
    color: '#888',
  },
  code: {
    fontFamily: 'monospace',
    color: '#a8b4ff',
  },
  canon: {
    background: 'rgba(102,126,234,0.1)',
    border: '1px solid rgba(102,126,234,0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    color: '#a8b4ff',
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    display: 'block',
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
  },
  textarea: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: 12,
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  btn: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  btnApprove: {
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    color: '#000',
  },
  btnReject: {
    background: 'linear-gradient(135deg, #f87171, #ef4444)',
    color: '#fff',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
  },
  
  // Pipeline Status
  pipelineStatus: {
    background: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.1)',
    marginTop: 16,
  },
  pipelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
  },
  pipelineId: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  lanes: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  lane: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    fontSize: 13,
  },
  laneIcon: {
    fontSize: 12,
    width: 16,
    textAlign: 'center',
  },
  laneName: {
    flex: 1,
    color: '#fff',
  },
  laneDuration: {
    color: '#666',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  metrics: {
    display: 'flex',
    gap: 20,
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: 13,
    color: '#888',
  },
  error: {
    marginTop: 12,
    padding: 12,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#fca5a5',
    fontSize: 13,
  },
  
  // Query Component
  queryComponent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  form: {
    display: 'flex',
    gap: 8,
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    padding: '8px 12px',
    outline: 'none',
  },
  submitBtn: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  CheckpointApprovalModal,
  PipelineStatus,
  PipelineQuery,
  pipelineAPI,
  usePipelineWebSocket,
};
