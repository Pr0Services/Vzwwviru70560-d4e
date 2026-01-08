/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — GOVERNANCE DASHBOARD                        ║
 * ║                                                                              ║
 * ║  CEA (Contrôle, Éthique, Audit) Dashboard                                    ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { SPHERES } from '../hooks/useSpheres';

// API Hooks
import { 
  useCheckpoints, 
  usePendingCheckpoints,
  useApproveCheckpoint,
  useRejectCheckpoint,
  useAuditLog,
  useCheckpointCounts 
} from '../hooks/api';

// Toast notifications
import { useToast } from '../components/toast/ToastProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type GovernanceSignalLevel = 'info' | 'attention' | 'warning' | 'critical' | 'blocked';
type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired';
type AuditEventType = 'checkpoint' | 'decision' | 'agent_action' | 'data_access' | 'config_change';

interface GovernanceSignal {
  id: string;
  level: GovernanceSignalLevel;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  resolved: boolean;
}

interface CheckpointRecord {
  id: string;
  action_type: string;
  description: string;
  requested_by: string;
  status: CheckpointStatus;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

interface AuditEvent {
  id: string;
  type: AuditEventType;
  action: string;
  actor: string;
  target?: string;
  sphere_id?: string;
  details: Record<string, any>;
  timestamp: string;
}

interface CEAMetrics {
  checkpoints: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    approval_rate: number;
    avg_response_time_hours: number;
  };
  agents: {
    total_hired: number;
    active: number;
    actions_today: number;
    blocked_actions: number;
  };
  decisions: {
    total_pending: number;
    blink_count: number;
    avg_aging_days: number;
  };
  data: {
    total_threads: number;
    total_events: number;
    data_points_protected: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SIGNAL_CONFIG: Record<GovernanceSignalLevel, {
  color: string;
  bg: string;
  border: string;
  icon: string;
  label: string;
}> = {
  info: {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    icon: 'ℹ️',
    label: 'Info',
  },
  attention: {
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    icon: '👀',
    label: 'Attention',
  },
  warning: {
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.2)',
    icon: '⚠️',
    label: 'Avertissement',
  },
  critical: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    icon: '🚨',
    label: 'Critique',
  },
  blocked: {
    color: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.15)',
    border: 'rgba(220, 38, 38, 0.3)',
    icon: '🛑',
    label: 'Bloqué',
  },
};

const AUDIT_TYPE_CONFIG: Record<AuditEventType, { icon: string; label: string; color: string }> = {
  checkpoint: { icon: '🛡️', label: 'Checkpoint', color: '#8B5CF6' },
  decision: { icon: '⚡', label: 'Décision', color: '#D8B26A' },
  agent_action: { icon: '🤖', label: 'Action Agent', color: '#3EB4A2' },
  data_access: { icon: '📄', label: 'Accès Données', color: '#3B82F6' },
  config_change: { icon: '⚙️', label: 'Config', color: '#F59E0B' },
};

// Mock data
const metrics: CEAMetrics = {
  checkpoints: {
    total: 156,
    pending: 3,
    approved: 142,
    rejected: 11,
    approval_rate: 92.8,
    avg_response_time_hours: 2.4,
  },
  agents: {
    total_hired: 8,
    active: 5,
    actions_today: 47,
    blocked_actions: 2,
  },
  decisions: {
    total_pending: 5,
    blink_count: 1,
    avg_aging_days: 3.2,
  },
  data: {
    total_threads: 47,
    total_events: 1247,
    data_points_protected: 8432,
  },
};

const MOCK_SIGNALS: GovernanceSignal[] = [
  {
    id: 'sig-1',
    level: 'critical',
    title: 'Décision en phase BLINK',
    description: 'Une décision critique requiert une action immédiate avant expiration.',
    source: 'Decision Engine',
    timestamp: '2025-01-07T09:30:00Z',
    resolved: false,
  },
  {
    id: 'sig-2',
    level: 'warning',
    title: 'Agent bloqué',
    description: 'L\'agent "Estimateur Construction" a été bloqué suite à une action non autorisée.',
    source: 'Agent Monitor',
    timestamp: '2025-01-07T08:15:00Z',
    resolved: false,
  },
  {
    id: 'sig-3',
    level: 'attention',
    title: 'Checkpoint en attente prolongée',
    description: '3 checkpoints sont en attente depuis plus de 24h.',
    source: 'Checkpoint Manager',
    timestamp: '2025-01-07T07:00:00Z',
    resolved: false,
  },
  {
    id: 'sig-4',
    level: 'info',
    title: 'Nouvel agent embauché',
    description: 'L\'agent "Analyste Financier L2" a été ajouté à votre équipe.',
    source: 'Agent Manager',
    timestamp: '2025-01-06T16:00:00Z',
    resolved: true,
  },
];

const MOCK_CHECKPOINTS: CheckpointRecord[] = [
  {
    id: 'cp-1',
    action_type: 'external_api_call',
    description: 'Envoi de données au service de comptabilité externe',
    requested_by: 'Comptable L2',
    status: 'pending',
    risk_level: 'high',
    created_at: '2025-01-07T09:00:00Z',
  },
  {
    id: 'cp-2',
    action_type: 'data_modification',
    description: 'Mise à jour du budget projet Laval',
    requested_by: 'Gestionnaire Projet L2',
    status: 'pending',
    risk_level: 'medium',
    created_at: '2025-01-07T08:30:00Z',
  },
  {
    id: 'cp-3',
    action_type: 'notification_send',
    description: 'Notification aux parties prenantes du projet',
    requested_by: 'Coordinateur L3',
    status: 'approved',
    risk_level: 'low',
    created_at: '2025-01-07T07:45:00Z',
    resolved_at: '2025-01-07T07:50:00Z',
    resolved_by: 'Jo',
  },
  {
    id: 'cp-4',
    action_type: 'file_access',
    description: 'Accès aux documents financiers Q4',
    requested_by: 'Analyste Financier L2',
    status: 'rejected',
    risk_level: 'high',
    created_at: '2025-01-06T16:00:00Z',
    resolved_at: '2025-01-06T16:15:00Z',
    resolved_by: 'Jo',
  },
];

const MOCK_AUDIT: AuditEvent[] = [
  {
    id: 'audit-1',
    type: 'checkpoint',
    action: 'Checkpoint approuvé',
    actor: 'Jo',
    target: 'Notification projet',
    timestamp: '2025-01-07T09:45:00Z',
    details: { checkpoint_id: 'cp-3' },
  },
  {
    id: 'audit-2',
    type: 'decision',
    action: 'Décision prise',
    actor: 'Jo',
    target: 'Choix assurance 2025',
    sphere_id: 'business',
    timestamp: '2025-01-07T09:30:00Z',
    details: { decision_id: 'dec-3', option_selected: 'opt-6' },
  },
  {
    id: 'audit-3',
    type: 'agent_action',
    action: 'Action bloquée',
    actor: 'Estimateur Construction L2',
    target: 'API externe',
    timestamp: '2025-01-07T08:15:00Z',
    details: { reason: 'Unauthorized external call', blocked: true },
  },
  {
    id: 'audit-4',
    type: 'data_access',
    action: 'Données consultées',
    actor: 'Gestionnaire Projet L2',
    target: 'Thread: Projet Laval',
    sphere_id: 'business',
    timestamp: '2025-01-07T08:00:00Z',
    details: { thread_id: 'thread-4' },
  },
  {
    id: 'audit-5',
    type: 'config_change',
    action: 'Configuration modifiée',
    actor: 'Jo',
    target: 'Permissions Agent',
    timestamp: '2025-01-06T17:00:00Z',
    details: { agent_id: 'l2-construction-estimator', permission: 'external_api', value: false },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MetricCard: React.FC<{
  title: string;
  icon: string;
  value: number | string;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
  color?: string;
  onClick?: () => void;
}> = ({ title, icon, value, subtitle, trend, color = '#D8B26A', onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: 20,
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 16,
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left',
      transition: 'all 0.2s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#6B7B6B' }}>{title}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>
      {value}
    </div>
    {subtitle && (
      <div style={{ fontSize: 11, color: '#6B7B6B' }}>{subtitle}</div>
    )}
    {trend && (
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: trend.positive ? '#4ADE80' : '#EF4444',
        }}
      >
        {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs hier
      </div>
    )}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SignalCard: React.FC<{
  signal: GovernanceSignal;
  onResolve: () => void;
}> = ({ signal, onResolve }) => {
  const config = SIGNAL_CONFIG[signal.level];

  return (
    <div
      style={{
        padding: 16,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderLeft: `4px solid ${config.color}`,
        borderRadius: 12,
        opacity: signal.resolved ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{config.icon}</span>
            <span
              style={{
                padding: '2px 8px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 4,
                fontSize: 10,
                color: config.color,
                fontWeight: 600,
              }}
            >
              {config.label}
            </span>
            <span style={{ fontSize: 10, color: '#6B7B6B' }}>
              {new Date(signal.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h4 style={{ margin: '0 0 4px', fontSize: 13, color: '#E8F0E8', fontWeight: 600 }}>
            {signal.title}
          </h4>
          <p style={{ margin: 0, fontSize: 12, color: '#8B9B8B' }}>
            {signal.description}
          </p>
          <div style={{ marginTop: 8, fontSize: 10, color: '#6B7B6B' }}>
            Source: {signal.source}
          </div>
        </div>
        
        {!signal.resolved && (
          <button
            onClick={onResolve}
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 6,
              color: '#9BA89B',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ✓ Résoudre
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CheckpointList: React.FC<{
  checkpoints: CheckpointRecord[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ checkpoints, onApprove, onReject }) => {
  const riskColors = {
    low: '#4ADE80',
    medium: '#FACC15',
    high: '#F97316',
    critical: '#EF4444',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {checkpoints.map((cp) => (
        <div
          key={cp.id}
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>🛡️</span>
                <span
                  style={{
                    padding: '2px 8px',
                    background: `${riskColors[cp.risk_level]}15`,
                    borderRadius: 4,
                    fontSize: 10,
                    color: riskColors[cp.risk_level],
                  }}
                >
                  {cp.risk_level.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    background: cp.status === 'pending'
                      ? 'rgba(250, 204, 21, 0.15)'
                      : cp.status === 'approved'
                      ? 'rgba(74, 222, 128, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                    borderRadius: 4,
                    fontSize: 10,
                    color: cp.status === 'pending'
                      ? '#FACC15'
                      : cp.status === 'approved'
                      ? '#4ADE80'
                      : '#EF4444',
                  }}
                >
                  {cp.status === 'pending' ? 'En attente' : cp.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                </span>
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: '#E8F0E8' }}>
                {cp.description}
              </p>
              <div style={{ fontSize: 11, color: '#6B7B6B' }}>
                Demandé par: <span style={{ color: '#9BA89B' }}>{cp.requested_by}</span>
                {' • '}
                {new Date(cp.created_at).toLocaleString('fr-CA')}
              </div>
            </div>
            
            {cp.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onReject(cp.id)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 8,
                    color: '#EF4444',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
                <button
                  onClick={() => onApprove(cp.id)}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#E8F0E8',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const AuditLog: React.FC<{ events: AuditEvent[] }> = ({ events }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.map((event) => {
        const config = AUDIT_TYPE_CONFIG[event.type];
        const sphere = event.sphere_id ? SPHERES.find(s => s.id === event.sphere_id) : null;

        return (
          <div
            key={event.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${config.color}15`,
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              {config.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#E8F0E8' }}>
                {event.action}
                {event.target && (
                  <span style={{ color: '#6B7B6B' }}> → {event.target}</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: '#6B7B6B' }}>
                {event.actor}
                {sphere && <span> • {sphere.icon} {sphere.name_fr}</span>}
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#4B5B4B' }}>
              {new Date(event.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const GovernancePageV72: React.FC = () => {
  const navigate = useNavigate();

  // API Data
  const { data: checkpointsData, isLoading: checkpointsLoading, isError: checkpointsError } = useCheckpoints();
  const { data: auditData } = useAuditLog();
  const { pending: pendingCount, approved: approvedCount, total: totalCount } = useCheckpointCounts();
  
  // Toast notifications
  const toast = useToast();
  
  const approveMutation = useApproveCheckpoint();
  const rejectMutation = useRejectCheckpoint();

  // Transform API data to local format
  const checkpoints: CheckpointRecord[] = useMemo(() => {
    if (!checkpointsData) return [];
    return checkpointsData.map(cp => ({
      id: cp.id,
      type: cp.type as CheckpointRecord['type'],
      status: cp.status as CheckpointStatus,
      title: cp.title,
      description: cp.description,
      priority: cp.priority as 'low' | 'medium' | 'high' | 'critical',
      sphere_id: cp.sphere_id || 'personal',
      requested_at: cp.created_at,
      requested_by: cp.initiated_by || 'system',
      resolved_at: cp.resolved_at,
      resolved_by: cp.resolved_by,
    }));
  }, [checkpointsData]);

  // Generate signals from pending checkpoints
  const signals: GovernanceSignal[] = useMemo(() => {
    return checkpoints
      .filter(cp => cp.status === 'pending')
      .map(cp => ({
        id: `signal-${cp.id}`,
        level: cp.priority === 'critical' ? 'critical' as const : 
               cp.priority === 'high' ? 'warning' as const : 
               cp.priority === 'medium' ? 'attention' as const : 'info' as const,
        title: cp.title,
        description: cp.description,
        sphere_id: cp.sphere_id,
        timestamp: cp.requested_at,
        resolved: false,
      }));
  }, [checkpoints]);

  // Computed metrics from API data
  const metrics = useMemo(() => {
    const approved = checkpoints.filter(cp => cp.status === 'approved').length;
    const pending = checkpoints.filter(cp => cp.status === 'pending').length;
    const total = checkpoints.length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 100;
    
    return {
      checkpoints: {
        approval_rate: approvalRate,
        approved,
        pending,
        avg_response_time_hours: 2.4, // TODO: calculate from actual data
      },
      agents: {
        active: 12,
        total_hired: 18,
        actions_today: 47,
      },
      decisions: {
        blink_count: pending > 3 ? pending - 3 : 0, // Critical decisions
      },
      data: {
        data_points_protected: 127453,
      },
    };
  }, [checkpoints]);

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'checkpoints' | 'audit'>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handlers
  const handleResolveSignal = useCallback((id: string) => {
    // Signals are derived from checkpoints, so no local state to update
    console.log('Signal resolved:', id);
  }, []);

  const handleApproveCheckpoint = useCallback((id: string) => {
    approveMutation.mutate(
      { checkpoint_id: id },
      {
        onSuccess: () => toast.success('Checkpoint approuvé', 'L\'action peut maintenant s\'exécuter'),
        onError: () => toast.error('Erreur', 'Impossible d\'approuver le checkpoint'),
      }
    );
  }, [approveMutation, toast]);

  const handleRejectCheckpoint = useCallback((id: string) => {
    rejectMutation.mutate(
      { checkpoint_id: id, reason: 'Rejected by user' },
      {
        onSuccess: () => toast.warning('Checkpoint rejeté', 'L\'action a été annulée'),
        onError: () => toast.error('Erreur', 'Impossible de rejeter le checkpoint'),
      }
    );
  }, [rejectMutation, toast]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    if (action === 'search') setIsSearchOpen(true);
    if (action === 'nova-chat') navigate('/nova');
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') setIsSearchOpen(false);
    },
  });

  // Computed
  const unresolvedSignals = signals.filter(s => !s.resolved);
  const pendingCheckpoints = checkpoints.filter(cp => cp.status === 'pending');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', color: '#6B7B6B', fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
          >
            ← Retour au dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(216, 178, 106, 0.2) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              🛡️
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#E8F0E8', margin: 0 }}>
                CEA — Gouvernance
              </h1>
              <p style={{ color: '#6B7B6B', fontSize: 13, margin: '4px 0 0' }}>
                Contrôle • Éthique • Audit — GOUVERNANCE {'>'} EXÉCUTION
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            padding: 4,
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 12,
            width: 'fit-content',
          }}
        >
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
            { id: 'checkpoints', label: 'Checkpoints', icon: '🛡️', badge: pendingCheckpoints.length },
            { id: 'audit', label: 'Journal', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: activeTab === tab.id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeTab === tab.id ? '#8B5CF6' : '#6B7B6B',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span
                  style={{
                    padding: '2px 6px',
                    background: '#EF4444',
                    borderRadius: 4,
                    fontSize: 10,
                    color: '#FFF',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 32,
              }}
            >
              <MetricCard
                title="Taux d'approbation"
                icon="✅"
                value={`${metrics.checkpoints.approval_rate}%`}
                subtitle={`${metrics.checkpoints.approved} approuvés`}
                color="#4ADE80"
              />
              <MetricCard
                title="Checkpoints en attente"
                icon="🛡️"
                value={metrics.checkpoints.pending}
                subtitle="Action requise"
                color={metrics.checkpoints.pending > 0 ? '#FACC15' : '#4ADE80'}
                onClick={() => setActiveTab('checkpoints')}
              />
              <MetricCard
                title="Agents actifs"
                icon="🤖"
                value={`${metrics.agents.active}/${metrics.agents.total_hired}`}
                subtitle={`${metrics.agents.actions_today} actions aujourd'hui`}
                color="#3EB4A2"
              />
              <MetricCard
                title="Décisions BLINK"
                icon="🔥"
                value={metrics.decisions.blink_count}
                subtitle="Action immédiate"
                color={metrics.decisions.blink_count > 0 ? '#EF4444' : '#4ADE80'}
                onClick={() => navigate('/decisions')}
              />
              <MetricCard
                title="Temps de réponse"
                icon="⏱️"
                value={`${metrics.checkpoints.avg_response_time_hours}h`}
                subtitle="Moyenne checkpoints"
                color="#3B82F6"
              />
              <MetricCard
                title="Données protégées"
                icon="🔒"
                value={metrics.data.data_points_protected.toLocaleString()}
                subtitle="Points de données"
                color="#8B5CF6"
              />
            </div>

            {/* Signals Section */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, color: '#E8F0E8', margin: '0 0 16px' }}>
                Signaux actifs ({unresolvedSignals.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {unresolvedSignals.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    onResolve={() => handleResolveSignal(signal.id)}
                  />
                ))}
                {unresolvedSignals.length === 0 && (
                  <div
                    style={{
                      padding: 40,
                      textAlign: 'center',
                      background: 'rgba(74, 222, 128, 0.05)',
                      borderRadius: 12,
                    }}
                  >
                    <span style={{ fontSize: 32 }}>✨</span>
                    <p style={{ color: '#4ADE80', margin: '12px 0 0' }}>
                      Aucun signal actif — Tout est sous contrôle
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Audit */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, color: '#E8F0E8', margin: 0 }}>
                  Activité récente
                </h2>
                <button
                  onClick={() => setActiveTab('audit')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8B5CF6',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Voir tout →
                </button>
              </div>
              <AuditLog events={MOCK_AUDIT.slice(0, 5)} />
            </div>
          </>
        )}

        {activeTab === 'checkpoints' && (
          <div>
            <h2 style={{ fontSize: 16, color: '#E8F0E8', margin: '0 0 16px' }}>
              Checkpoints ({checkpoints.length})
            </h2>
            <CheckpointList
              checkpoints={checkpoints}
              onApprove={handleApproveCheckpoint}
              onReject={handleRejectCheckpoint}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h2 style={{ fontSize: 16, color: '#E8F0E8', margin: '0 0 16px' }}>
              Journal d'audit
            </h2>
            <AuditLog events={MOCK_AUDIT} />
          </div>
        )}

        {/* Governance Principles */}
        <div
          style={{
            marginTop: 40,
            padding: 24,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(216, 178, 106, 0.08) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 16,
          }}
        >
          <h3 style={{ fontSize: 14, color: '#D8B26A', margin: '0 0 12px' }}>
            🏛️ Principes de Gouvernance CHE·NU™
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '🛡️', title: 'GOUVERNANCE > EXÉCUTION', desc: 'Toute action sensible requiert approbation humaine' },
              { icon: '🔒', title: 'READ-ONLY XR', desc: 'L\'interface XR ne peut pas modifier de données' },
              { icon: '🤖', title: 'AGENTS GOUVERNÉS', desc: 'Aucun agent ne peut agir de façon autonome' },
              { icon: '📝', title: 'AUDIT COMPLET', desc: 'Toutes les actions sont tracées et vérifiables' },
            ].map((principle, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{principle.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: '#E8F0E8', fontWeight: 600, marginBottom: 4 }}>
                    {principle.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7B6B' }}>{principle.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <QuickActionsFAB onAction={handleQuickAction} />

      {/* Search */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => result.path && navigate(result.path)}
        onNavigate={navigate}
      />
    </div>
  );
};

export default GovernancePageV72;
