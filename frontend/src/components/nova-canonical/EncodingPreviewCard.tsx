/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — ENCODING PREVIEW CARD                       ║
 * ║                    Visualisation de l'Encodage Sémantique                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Affiche la transformation:
 *   Input Naturel → Intention → Actions Encodées
 *
 * AVANT exécution, l'utilisateur voit exactement ce qui va se passer.
 */

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface EncodedAction {
  id: string;
  type: EncodedActionType;
  target: string;
  targetType: EncodedTargetType;
  description: string;
  params: Record<string, unknown>;
  requiresCheckpoint: boolean;
}

export type EncodedActionType = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'analyze' | 'summarize' | 'generate'
  | 'search' | 'compare' | 'extract'
  | 'transform' | 'validate'
  | 'notify' | 'schedule' | 'delegate';

export type EncodedTargetType =
  | 'thread' | 'dataspace' | 'agent'
  | 'meeting' | 'document' | 'memory'
  | 'user' | 'system';

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SemanticEncoding {
  id: string;
  input: string;
  intent: string;
  intentConfidence: number;
  actions: EncodedAction[];
  sensitivity: SensitivityLevel;
  requiresApproval: boolean;
  encodedAt: string;
}

export interface EncodingPreviewCardProps {
  /** L'encodage sémantique à afficher */
  encoding: SemanticEncoding;
  /** Mode compact */
  compact?: boolean;
  /** Actions détaillées visibles */
  showDetails?: boolean;
  /** Callback quand on clique sur une action */
  onActionClick?: (action: EncodedAction) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const ACTION_ICONS: Record<EncodedActionType, string> = {
  create: '➕',
  read: '👁️',
  update: '✏️',
  delete: '🗑️',
  analyze: '🔍',
  summarize: '📝',
  generate: '✨',
  search: '🔎',
  compare: '⚖️',
  extract: '📤',
  transform: '🔄',
  validate: '✓',
  notify: '🔔',
  schedule: '📅',
  delegate: '👥',
};

const ACTION_COLORS: Record<EncodedActionType, { bg: string; text: string }> = {
  create: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
  read: { bg: 'rgba(52, 152, 219, 0.15)', text: '#3498DB' },
  update: { bg: 'rgba(243, 156, 18, 0.15)', text: '#F39C12' },
  delete: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C' },
  analyze: { bg: 'rgba(155, 89, 182, 0.15)', text: '#9B59B6' },
  summarize: { bg: 'rgba(62, 180, 162, 0.15)', text: '#3EB4A2' },
  generate: { bg: 'rgba(216, 178, 106, 0.15)', text: '#D8B26A' },
  search: { bg: 'rgba(52, 152, 219, 0.15)', text: '#3498DB' },
  compare: { bg: 'rgba(155, 89, 182, 0.15)', text: '#9B59B6' },
  extract: { bg: 'rgba(230, 126, 34, 0.15)', text: '#E67E22' },
  transform: { bg: 'rgba(62, 180, 162, 0.15)', text: '#3EB4A2' },
  validate: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
  notify: { bg: 'rgba(241, 196, 15, 0.15)', text: '#F1C40F' },
  schedule: { bg: 'rgba(52, 152, 219, 0.15)', text: '#3498DB' },
  delegate: { bg: 'rgba(155, 89, 182, 0.15)', text: '#9B59B6' },
};

const TARGET_ICONS: Record<EncodedTargetType, string> = {
  thread: '💬',
  dataspace: '📁',
  agent: '🤖',
  meeting: '📅',
  document: '📄',
  memory: '🧠',
  user: '👤',
  system: '⚙️',
};

const SENSITIVITY_CONFIG: Record<SensitivityLevel, { bg: string; text: string; label: string }> = {
  low: { bg: 'rgba(62, 180, 162, 0.15)', text: '#3EB4A2', label: 'Faible' },
  medium: { bg: 'rgba(216, 178, 106, 0.15)', text: '#D8B26A', label: 'Moyen' },
  high: { bg: 'rgba(230, 126, 34, 0.15)', text: '#E67E22', label: 'Élevé' },
  critical: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C', label: 'Critique' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  card: {
    backgroundColor: '#1E1F22',
    borderRadius: '12px',
    border: '1px solid #2F4C39',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    backgroundColor: 'rgba(62, 180, 162, 0.05)',
    borderBottom: '1px solid #2F4C39',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#3EB4A2',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: '#8D8371',
  },
  sensitivityBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
  },
  body: {
    padding: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#8D8371',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  inputBox: {
    padding: '12px 16px',
    backgroundColor: 'rgba(141, 131, 113, 0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E9E4D6',
    lineHeight: 1.5,
  },
  intentBox: {
    padding: '12px 16px',
    backgroundColor: 'rgba(62, 180, 162, 0.08)',
    borderRadius: '8px',
    borderLeft: '3px solid #3EB4A2',
  },
  intentText: {
    fontSize: '14px',
    color: '#E9E4D6',
    fontStyle: 'italic' as const,
  },
  confidenceBar: {
    marginTop: '8px',
    height: '4px',
    backgroundColor: 'rgba(62, 180, 162, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#3EB4A2',
    transition: 'width 0.3s ease',
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(30, 31, 34, 0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionIconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  actionContent: {
    flex: 1,
    minWidth: 0,
  },
  actionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  actionType: {
    fontSize: '13px',
    fontWeight: 500,
    textTransform: 'capitalize' as const,
  },
  actionTarget: {
    fontSize: '11px',
    color: '#8D8371',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionDescription: {
    fontSize: '13px',
    color: '#E9E4D6',
    lineHeight: 1.4,
  },
  actionParams: {
    marginTop: '8px',
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#8D8371',
    overflow: 'auto',
    maxHeight: '80px',
  },
  checkpointBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(216, 178, 106, 0.15)',
    color: '#D8B26A',
    marginLeft: 'auto',
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid #2F4C39',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#8D8371',
  },
  expandButton: {
    background: 'none',
    border: 'none',
    color: '#3EB4A2',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const EncodingPreviewCard: React.FC<EncodingPreviewCardProps> = ({
  encoding,
  compact = false,
  showDetails: initialShowDetails = false,
  onActionClick,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(initialShowDetails);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  
  const sensitivityConfig = SENSITIVITY_CONFIG[encoding.sensitivity];
  
  const toggleActionExpanded = (actionId: string) => {
    setExpandedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };
  
  const checkpointCount = encoding.actions.filter(a => a.requiresCheckpoint).length;
  
  return (
    <div style={styles.card} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>📝</div>
          <div>
            <div style={styles.headerTitle}>Encodage Sémantique</div>
            <div style={styles.headerSubtitle}>
              {encoding.actions.length} action{encoding.actions.length > 1 ? 's' : ''} prévue{encoding.actions.length > 1 ? 's' : ''}
              {checkpointCount > 0 && ` • ${checkpointCount} checkpoint${checkpointCount > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
        <span 
          style={{
            ...styles.sensitivityBadge,
            backgroundColor: sensitivityConfig.bg,
            color: sensitivityConfig.text,
          }}
        >
          {sensitivityConfig.label}
        </span>
      </div>
      
      {/* Body */}
      <div style={styles.body}>
        {/* Input */}
        {!compact && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Input</div>
            <div style={styles.inputBox}>{encoding.input}</div>
          </div>
        )}
        
        {/* Intent */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Intention Détectée</div>
          <div style={styles.intentBox}>
            <div style={styles.intentText}>"{encoding.intent}"</div>
            <div style={styles.confidenceBar}>
              <div 
                style={{
                  ...styles.confidenceFill,
                  width: `${encoding.intentConfidence * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Actions à Exécuter</div>
          <div style={styles.actionsList}>
            {encoding.actions.map((action) => {
              const actionColor = ACTION_COLORS[action.type];
              const isExpanded = expandedActions.has(action.id);
              
              return (
                <div
                  key={action.id}
                  style={styles.actionItem}
                  onClick={() => {
                    if (showDetails) {
                      toggleActionExpanded(action.id);
                    }
                    onActionClick?.(action);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(62, 180, 162, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(30, 31, 34, 0.5)';
                  }}
                >
                  <div 
                    style={{
                      ...styles.actionIconWrapper,
                      backgroundColor: actionColor.bg,
                    }}
                  >
                    {ACTION_ICONS[action.type]}
                  </div>
                  <div style={styles.actionContent}>
                    <div style={styles.actionHeader}>
                      <span style={{ ...styles.actionType, color: actionColor.text }}>
                        {action.type}
                      </span>
                      <span style={styles.actionTarget}>
                        → {TARGET_ICONS[action.targetType]} {action.target}
                      </span>
                      {action.requiresCheckpoint && (
                        <span style={styles.checkpointBadge}>🔒 Checkpoint</span>
                      )}
                    </div>
                    <div style={styles.actionDescription}>{action.description}</div>
                    
                    {showDetails && isExpanded && Object.keys(action.params).length > 0 && (
                      <div style={styles.actionParams}>
                        <pre style={{ margin: 0 }}>
                          {JSON.stringify(action.params, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={styles.footer}>
        <span>ID: {encoding.id.slice(0, 8)}...</span>
        <button
          style={styles.expandButton}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▲ Moins de détails' : '▼ Plus de détails'}
        </button>
        <span>{new Date(encoding.encodedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default EncodingPreviewCard;
