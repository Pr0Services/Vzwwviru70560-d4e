/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT CARD V72
 * ═══════════════════════════════════════════════════════════════════════════
 * Carte d'agent avec statut et actions - Version V72
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { AgentDefinition } from '../../data/agents-catalog';

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export const LEVEL_CONFIG = {
  L0: { label: 'Nova', color: '#D8B26A', description: 'Intelligence système' },
  L1: { label: 'Orchestrator', color: '#A78BFA', description: 'Coordinateur' },
  L2: { label: 'Specialist', color: '#3EB4A2', description: 'Spécialisé' },
  L3: { label: 'Worker', color: '#3F7249', description: 'Exécution' },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AgentCardV72Props {
  agent: AgentDefinition;
  isHired?: boolean;
  onHire?: (agent: AgentDefinition) => void;
  onFire?: (agent: AgentDefinition) => void;
  onView?: (agent: AgentDefinition) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  card: {
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 12,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  } as React.CSSProperties,
  
  cardHover: {
    background: '#1a1a1f',
    borderColor: '#2a2a30',
    transform: 'translateY(-2px)',
  } as React.CSSProperties,
  
  cardHired: {
    borderColor: '#D8B26A40',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  } as React.CSSProperties,
  
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    flexShrink: 0,
  } as React.CSSProperties,
  
  info: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
  
  name: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 4,
  } as React.CSSProperties,
  
  level: {
    fontSize: 11,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 4,
    display: 'inline-block',
  } as React.CSSProperties,
  
  description: {
    fontSize: 13,
    color: '#888',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTop: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#666',
  } as React.CSSProperties,
  
  actions: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  } as React.CSSProperties,
  
  btn: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  btnPrimary: {
    background: '#D8B26A',
    color: '#0a0a0b',
  } as React.CSSProperties,
  
  btnSecondary: {
    background: '#1f1f23',
    color: '#fff',
  } as React.CSSProperties,
  
  btnDanger: {
    background: '#EF444420',
    color: '#EF4444',
  } as React.CSSProperties,
  
  status: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#3F7249',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// AGENT CARD V72
// ═══════════════════════════════════════════════════════════════════════════

export const AgentCardV72: React.FC<AgentCardV72Props> = ({
  agent,
  isHired = false,
  onHire,
  onFire,
  onView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const level = agent.level || 'L3';
  const levelInfo = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.L3;
  
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        ...(isHired ? styles.cardHired : {}),
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(agent)}
    >
      {isHired && <div style={{ ...styles.status, background: '#3F7249' }} />}
      
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.icon, background: `${levelInfo.color}20` }}>
          {agent.avatar || '🤖'}
        </div>
        <div style={styles.info}>
          <div style={styles.name}>{agent.name}</div>
          <span style={{ 
            ...styles.level, 
            background: `${levelInfo.color}20`,
            color: levelInfo.color,
          }}>
            {levelInfo.label}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <div style={styles.description}>{agent.description}</div>
      
      {/* Meta */}
      <div style={styles.meta}>
        <div style={styles.metaItem}>
          <span>💎</span>
          <span>{agent.base_cost?.toLocaleString() || 0}</span>
        </div>
        <div style={styles.metaItem}>
          <span>📍</span>
          <span style={{ textTransform: 'capitalize' }}>{agent.domain}</span>
        </div>
      </div>
      
      {/* Actions */}
      {isHovered && (
        <div style={styles.actions}>
          {isHired ? (
            <>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={(e) => { e.stopPropagation(); onView?.(agent); }}
              >
                Détails
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnDanger }}
                onClick={(e) => { e.stopPropagation(); onFire?.(agent); }}
              >
                Retirer
              </button>
            </>
          ) : (
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={(e) => { e.stopPropagation(); onHire?.(agent); }}
            >
              Engager
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentCardV72;
