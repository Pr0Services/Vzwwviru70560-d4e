/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT SUGGESTION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * Suggestions intelligentes d'agents basées sur le contexte
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { AgentDefinition } from '../../data/agents-catalog';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AgentSuggestionEngineProps {
  suggestions?: AgentDefinition[];
  onHire: (agent: AgentDefinition) => void;
  maxDisplay?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_SUGGESTIONS: Partial<AgentDefinition>[] = [
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Rédige articles, posts et contenus marketing',
    domain: 'studio',
    avatar: '✍️',
    level: 'L2',
    base_cost: 500,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyse données et génère des insights',
    domain: 'business',
    avatar: '📊',
    level: 'L2',
    base_cost: 800,
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Recherche et synthétise des informations',
    domain: 'scholar',
    avatar: '🔬',
    level: 'L3',
    base_cost: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 12,
    padding: 16,
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  } as React.CSSProperties,
  
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: 12,
    color: '#666',
  } as React.CSSProperties,
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  } as React.CSSProperties,
  
  card: {
    background: '#0a0a0b',
    border: '1px solid #1f1f23',
    borderRadius: 10,
    padding: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  cardHover: {
    background: '#1a1a1f',
    borderColor: '#D8B26A40',
    transform: 'translateY(-2px)',
  } as React.CSSProperties,
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  } as React.CSSProperties,
  
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: '#1f1f23',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  } as React.CSSProperties,
  
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  } as React.CSSProperties,
  
  sphere: {
    fontSize: 11,
    color: '#888',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,
  
  description: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
    lineHeight: 1.4,
  } as React.CSSProperties,
  
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  
  cost: {
    fontSize: 12,
    color: '#D8B26A',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  } as React.CSSProperties,
  
  hireBtn: {
    padding: '6px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#D8B26A',
    color: '#0a0a0b',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  hireBtnHover: {
    background: '#E8C27A',
    transform: 'scale(1.05)',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// AGENT CARD
// ═══════════════════════════════════════════════════════════════════════════

interface AgentCardProps {
  agent: Partial<AgentDefinition>;
  onHire: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onHire }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.icon}>{agent.avatar || '🤖'}</div>
        <div>
          <div style={styles.name}>{agent.name}</div>
          <div style={styles.sphere}>{agent.domain}</div>
        </div>
      </div>
      
      <div style={styles.description}>{agent.description}</div>
      
      <div style={styles.footer}>
        <div style={styles.cost}>
          💎 {agent.base_cost?.toLocaleString()} tokens
        </div>
        <button
          style={{
            ...styles.hireBtn,
            ...(btnHovered ? styles.hireBtnHover : {}),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onHire();
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          Engager
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AGENT SUGGESTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export const AgentSuggestionEngine: React.FC<AgentSuggestionEngineProps> = ({
  suggestions,
  onHire,
  maxDisplay = 3,
}) => {
  const displaySuggestions = (suggestions || MOCK_SUGGESTIONS).slice(0, maxDisplay);
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>✨</span>
          Agents Suggérés
        </div>
        <span style={styles.subtitle}>Basé sur votre activité</span>
      </div>
      
      <div style={styles.grid}>
        {displaySuggestions.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onHire={() => onHire(agent as AgentDefinition)}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentSuggestionEngine;
