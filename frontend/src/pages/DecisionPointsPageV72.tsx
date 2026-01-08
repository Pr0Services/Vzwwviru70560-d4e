/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — DECISION POINTS                             ║
 * ║                                                                              ║
 * ║  Decision aging system: GREEN → YELLOW → RED → BLINK → ARCHIVE              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { AgentSuggestionEngine } from '../components/agents/AgentSuggestionEngine';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { SPHERES } from '../hooks/useSpheres';
import type { AgentDefinition } from '../data/agents-catalog';

// API Hooks
import { 
  useDecisions, 
  useResolveDecision,
  useDeferDecision,
  AGING_CONFIG,
  type DecisionPoint as APIDecisionPoint
} from '../hooks/api';

// Toast notifications
import { useToast } from '../components/toast/ToastProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type AgingLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLINK' | 'ARCHIVE';
type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'deferred' | 'expired';
type DecisionPriority = 'low' | 'medium' | 'high' | 'critical';

interface AISuggestion {
  id: string;
  type: 'recommendation' | 'warning' | 'info';
  content: string;
  confidence: number;
  source: string;
}

interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  context: string;
  sphere_id: string;
  thread_id?: string;
  status: DecisionStatus;
  priority: DecisionPriority;
  aging_level: AgingLevel;
  aging_started_at: string;
  deadline?: string;
  options: DecisionOption[];
  ai_suggestions: AISuggestion[];
  created_at: string;
  updated_at: string;
}

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  estimated_impact: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const AGING_CONFIG: Record<AgingLevel, {
  color: string;
  bg: string;
  border: string;
  icon: string;
  label: string;
  description: string;
}> = {
  GREEN: {
    color: '#4ADE80',
    bg: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.3)',
    icon: '🟢',
    label: 'Nouveau',
    description: 'Décision récente, temps disponible',
  },
  YELLOW: {
    color: '#FACC15',
    bg: 'rgba(250, 204, 21, 0.1)',
    border: 'rgba(250, 204, 21, 0.3)',
    icon: '🟡',
    label: 'Attention',
    description: 'Nécessite votre attention prochainement',
  },
  RED: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: '🔴',
    label: 'Urgent',
    description: 'Action requise rapidement',
  },
  BLINK: {
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    icon: '🔥',
    label: 'CRITIQUE',
    description: 'Décision bloquante — action immédiate requise',
  },
  ARCHIVE: {
    color: '#6B7280',
    bg: 'rgba(107, 114, 128, 0.1)',
    border: 'rgba(107, 114, 128, 0.2)',
    icon: '📦',
    label: 'Archivé',
    description: 'Décision traitée ou expirée',
  },
};

const PRIORITY_CONFIG: Record<DecisionPriority, { color: string; label: string }> = {
  low: { color: '#6B7280', label: 'Basse' },
  medium: { color: '#3B82F6', label: 'Moyenne' },
  high: { color: '#F59E0B', label: 'Haute' },
  critical: { color: '#EF4444', label: 'Critique' },
};

// Mock decisions
const MOCK_DECISIONS: DecisionPoint[] = [
  {
    id: 'dec-1',
    title: 'Choix du contracteur pour la toiture',
    description: 'Sélectionner le contracteur pour les travaux de toiture du projet Laval',
    context: 'Trois soumissions reçues. Budget approuvé de 45,000$. Travaux à débuter avant avril.',
    sphere_id: 'business',
    thread_id: 'thread-4',
    status: 'pending',
    priority: 'high',
    aging_level: 'RED',
    aging_started_at: '2025-01-03T10:00:00Z',
    deadline: '2025-01-10T17:00:00Z',
    options: [
      {
        id: 'opt-1',
        label: 'Toitures Pro Inc.',
        description: 'Soumission: 42,500$, délai 3 semaines',
        pros: ['Meilleur prix', 'Références solides', 'Garantie 10 ans'],
        cons: ['Disponibilité en mars seulement'],
        estimated_impact: 'medium',
      },
      {
        id: 'opt-2',
        label: 'Rénovations Laval',
        description: 'Soumission: 48,000$, délai 2 semaines',
        pros: ['Disponible immédiatement', 'Travaux antérieurs satisfaisants'],
        cons: ['Prix plus élevé', 'Garantie 5 ans'],
        estimated_impact: 'medium',
      },
    ],
    ai_suggestions: [
      {
        id: 'sug-1',
        type: 'recommendation',
        content: 'Basé sur l\'analyse des soumissions, Toitures Pro Inc. offre le meilleur rapport qualité-prix avec une garantie supérieure.',
        confidence: 0.85,
        source: 'Analyse comparative',
      },
      {
        id: 'sug-2',
        type: 'warning',
        content: 'Le délai de mars pourrait impacter le calendrier global du projet.',
        confidence: 0.72,
        source: 'Analyse de calendrier',
      },
    ],
    created_at: '2025-01-01T09:00:00Z',
    updated_at: '2025-01-07T08:00:00Z',
  },
  {
    id: 'dec-2',
    title: 'Stratégie de lancement Q1',
    description: 'Définir l\'approche marketing pour le lancement produit',
    context: 'Nouveau produit prêt. Budget marketing: 25,000$. Objectif: 500 inscriptions.',
    sphere_id: 'business',
    thread_id: 'thread-2',
    status: 'pending',
    priority: 'critical',
    aging_level: 'BLINK',
    aging_started_at: '2024-12-28T10:00:00Z',
    deadline: '2025-01-08T12:00:00Z',
    options: [
      {
        id: 'opt-3',
        label: 'Lancement progressif (soft launch)',
        description: 'Déploiement graduel avec early adopters',
        pros: ['Risque réduit', 'Feedback itératif', 'Coût initial faible'],
        cons: ['Impact médiatique limité', 'Croissance plus lente'],
        estimated_impact: 'medium',
      },
      {
        id: 'opt-4',
        label: 'Lancement massif (big bang)',
        description: 'Campagne coordonnée multi-canal',
        pros: ['Impact maximal', 'Buzz médiatique', 'Momentum fort'],
        cons: ['Risque élevé', 'Budget engagé d\'emblée'],
        estimated_impact: 'high',
      },
    ],
    ai_suggestions: [
      {
        id: 'sug-3',
        type: 'info',
        content: 'Les lancements progressifs ont 23% plus de chances de succès selon les données historiques.',
        confidence: 0.78,
        source: 'Benchmark industrie',
      },
    ],
    created_at: '2024-12-20T14:00:00Z',
    updated_at: '2025-01-07T09:30:00Z',
  },
  {
    id: 'dec-3',
    title: 'Renouvellement assurance entreprise',
    description: 'Choisir le plan d\'assurance pour l\'année 2025',
    context: 'Assurance actuelle expire le 31 janvier. Deux offres reçues.',
    sphere_id: 'business',
    status: 'pending',
    priority: 'medium',
    aging_level: 'YELLOW',
    aging_started_at: '2025-01-05T10:00:00Z',
    deadline: '2025-01-25T17:00:00Z',
    options: [
      {
        id: 'opt-5',
        label: 'Renouveler avec assureur actuel',
        description: 'Prime: 4,200$/an (+5%)',
        pros: ['Continuité', 'Processus simple'],
        cons: ['Augmentation de 5%'],
        estimated_impact: 'low',
      },
      {
        id: 'opt-6',
        label: 'Changer pour Nouveau Assureur',
        description: 'Prime: 3,800$/an',
        pros: ['Économie de 400$/an', 'Couverture équivalente'],
        cons: ['Nouveau fournisseur', 'Paperasse de changement'],
        estimated_impact: 'low',
      },
    ],
    ai_suggestions: [],
    created_at: '2025-01-02T11:00:00Z',
    updated_at: '2025-01-06T15:00:00Z',
  },
  {
    id: 'dec-4',
    title: 'Formation équipe: React ou Vue?',
    description: 'Choisir le framework pour la formation développeurs',
    context: 'Budget formation: 5,000$. 4 développeurs à former.',
    sphere_id: 'team',
    thread_id: 'thread-3',
    status: 'pending',
    priority: 'low',
    aging_level: 'GREEN',
    aging_started_at: '2025-01-06T10:00:00Z',
    options: [
      {
        id: 'opt-7',
        label: 'React + TypeScript',
        description: 'Formation intensive 3 jours',
        pros: ['Écosystème CHE·NU actuel', 'Plus de ressources disponibles'],
        cons: ['Courbe d\'apprentissage'],
        estimated_impact: 'medium',
      },
      {
        id: 'opt-8',
        label: 'Vue.js',
        description: 'Formation 2 jours',
        pros: ['Plus facile à apprendre', 'Documentation excellente'],
        cons: ['Migration potentielle nécessaire'],
        estimated_impact: 'medium',
      },
    ],
    ai_suggestions: [
      {
        id: 'sug-4',
        type: 'recommendation',
        content: 'React aligné avec la stack existante minimiserait les frictions.',
        confidence: 0.91,
        source: 'Analyse stack',
      },
    ],
    created_at: '2025-01-06T09:00:00Z',
    updated_at: '2025-01-06T09:00:00Z',
  },
  {
    id: 'dec-5',
    title: 'Achat équipement photo studio',
    description: 'Investir dans nouveau matériel photo pour le studio',
    context: 'Budget disponible: 8,000$. Équipement actuel vieillissant.',
    sphere_id: 'studio',
    status: 'approved',
    priority: 'medium',
    aging_level: 'ARCHIVE',
    aging_started_at: '2024-12-15T10:00:00Z',
    options: [],
    ai_suggestions: [],
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2025-01-04T14:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const DecisionCard: React.FC<{
  decision: DecisionPoint;
  onClick: () => void;
  isSelected?: boolean;
}> = ({ decision, onClick, isSelected }) => {
  const aging = AGING_CONFIG[decision.aging_level];
  const priority = PRIORITY_CONFIG[decision.priority];
  const sphere = SPHERES.find(s => s.id === decision.sphere_id);

  const getTimeRemaining = () => {
    if (!decision.deadline) return null;
    const diff = new Date(decision.deadline).getTime() - Date.now();
    if (diff < 0) return 'Expiré';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h restantes`;
    const days = Math.floor(hours / 24);
    return `${days}j restants`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: 20,
        background: isSelected ? aging.bg : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isSelected ? aging.border : 'rgba(255, 255, 255, 0.06)'}`,
        borderLeft: `4px solid ${aging.color}`,
        borderRadius: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        animation: decision.aging_level === 'BLINK' ? 'blink 1s infinite' : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{aging.icon}</span>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#E8F0E8' }}>
              {decision.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '2px 8px',
                background: aging.bg,
                border: `1px solid ${aging.border}`,
                borderRadius: 4,
                fontSize: 10,
                color: aging.color,
                fontWeight: 600,
              }}
            >
              {aging.label}
            </span>
            <span
              style={{
                padding: '2px 8px',
                background: `${priority.color}15`,
                borderRadius: 4,
                fontSize: 10,
                color: priority.color,
              }}
            >
              {priority.label}
            </span>
            {sphere && (
              <span
                style={{
                  padding: '2px 8px',
                  background: `${sphere.color}15`,
                  borderRadius: 4,
                  fontSize: 10,
                  color: sphere.color,
                }}
              >
                {sphere.icon} {sphere.name_fr}
              </span>
            )}
          </div>
        </div>
        
        {timeRemaining && (
          <div
            style={{
              padding: '6px 10px',
              background: decision.aging_level === 'BLINK' || decision.aging_level === 'RED'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: 6,
              fontSize: 11,
              color: decision.aging_level === 'BLINK' || decision.aging_level === 'RED'
                ? '#EF4444'
                : '#9BA89B',
              fontWeight: 500,
            }}
          >
            ⏱️ {timeRemaining}
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ margin: '0 0 12px', fontSize: 12, color: '#8B9B8B', lineHeight: 1.5 }}>
        {decision.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#6B7B6B' }}>
            📋 {decision.options.length} options
          </span>
          {decision.ai_suggestions.length > 0 && (
            <span style={{ fontSize: 11, color: '#8B5CF6' }}>
              🤖 {decision.ai_suggestions.length} suggestions IA
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: '#4B5B4B' }}>
          Créé le {new Date(decision.created_at).toLocaleDateString('fr-CA')}
        </span>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════════

const DecisionDetailPanel: React.FC<{
  decision: DecisionPoint | null;
  onClose: () => void;
  onDecide: (decisionId: string, optionId: string) => void;
}> = ({ decision, onClose, onDecide }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!decision) return null;

  const aging = AGING_CONFIG[decision.aging_level];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 480,
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(30, 35, 32, 0.98) 0%, rgba(25, 30, 28, 0.98) 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          background: aging.bg,
          borderBottom: `1px solid ${aging.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{aging.icon}</span>
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: aging.color,
                  fontWeight: 600,
                }}
              >
                {aging.label}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 18, color: '#E8F0E8' }}>
              {decision.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7B6B',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 8px' }}>Description</h4>
          <p style={{ fontSize: 13, color: '#9BA89B', margin: 0, lineHeight: 1.6 }}>
            {decision.description}
          </p>
        </div>

        {/* Context */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 8px' }}>Contexte</h4>
          <div
            style={{
              padding: 14,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 10,
              fontSize: 13,
              color: '#8B9B8B',
              lineHeight: 1.6,
            }}
          >
            {decision.context}
          </div>
        </div>

        {/* AI Suggestions */}
        {decision.ai_suggestions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, color: '#8B5CF6', margin: '0 0 12px' }}>
              🤖 Suggestions IA
            </h4>
            {decision.ai_suggestions.map((sug) => (
              <div
                key={sug.id}
                style={{
                  padding: 14,
                  marginBottom: 8,
                  background: sug.type === 'warning'
                    ? 'rgba(249, 115, 22, 0.1)'
                    : sug.type === 'recommendation'
                    ? 'rgba(74, 222, 128, 0.1)'
                    : 'rgba(139, 92, 246, 0.1)',
                  border: `1px solid ${
                    sug.type === 'warning'
                      ? 'rgba(249, 115, 22, 0.2)'
                      : sug.type === 'recommendation'
                      ? 'rgba(74, 222, 128, 0.2)'
                      : 'rgba(139, 92, 246, 0.2)'
                  }`,
                  borderRadius: 10,
                }}
              >
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#E8F0E8' }}>
                  {sug.content}
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#6B7B6B' }}>
                  <span>Confiance: {Math.round(sug.confidence * 100)}%</span>
                  <span>Source: {sug.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 12px' }}>
            Options disponibles
          </h4>
          {decision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              style={{
                width: '100%',
                padding: 16,
                marginBottom: 12,
                background: selectedOption === option.id
                  ? 'rgba(216, 178, 106, 0.1)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `2px solid ${
                  selectedOption === option.id
                    ? '#D8B26A'
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <h5 style={{ margin: 0, fontSize: 14, color: '#E8F0E8', fontWeight: 600 }}>
                  {option.label}
                </h5>
                {selectedOption === option.id && (
                  <span style={{ color: '#D8B26A' }}>✓</span>
                )}
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: '#8B9B8B' }}>
                {option.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#4ADE80', marginBottom: 4 }}>✓ Avantages</div>
                  {option.pros.map((pro, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#6B7B6B', marginBottom: 2 }}>
                      • {pro}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#EF4444', marginBottom: 4 }}>✗ Inconvénients</div>
                  {option.cons.map((con, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#6B7B6B', marginBottom: 2 }}>
                      • {con}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {decision.status === 'pending' && decision.options.length > 0 && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                // Defer decision
              }}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#9BA89B',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Reporter
            </button>
            <button
              onClick={() => selectedOption && onDecide(decision.id, selectedOption)}
              disabled={!selectedOption}
              style={{
                flex: 2,
                padding: '14px',
                background: selectedOption
                  ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: 10,
                color: selectedOption ? '#1A1A1A' : '#4B5B4B',
                fontSize: 13,
                fontWeight: 600,
                cursor: selectedOption ? 'pointer' : 'not-allowed',
              }}
            >
              ✓ Confirmer cette décision
            </button>
          </div>
        )}

        {/* Governance Notice */}
        <div
          style={{
            marginTop: 24,
            padding: 14,
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 10,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: '#8B5CF6' }}>
            🛡️ Cette décision sera enregistrée dans votre historique de gouvernance
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGING TIMELINE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const AgingTimeline: React.FC = () => {
  const levels: AgingLevel[] = ['GREEN', 'YELLOW', 'RED', 'BLINK'];
  
  return (
    <div
      style={{
        padding: 20,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        marginBottom: 24,
      }}
    >
      <h3 style={{ fontSize: 13, color: '#9BA89B', margin: '0 0 16px' }}>
        Cycle de vieillissement des décisions
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {levels.map((level, i) => {
          const config = AGING_CONFIG[level];
          return (
            <React.Fragment key={level}>
              <div
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{config.icon}</div>
                <div style={{ fontSize: 11, color: config.color, fontWeight: 600 }}>
                  {config.label}
                </div>
              </div>
              {i < levels.length - 1 && (
                <span style={{ color: '#4B5B4B', fontSize: 16 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 11, color: '#6B7B6B', textAlign: 'center' }}>
        Les décisions non traitées progressent automatiquement vers des niveaux d'urgence supérieurs
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

// Fallback mock data for when API is not available
const FALLBACK_DECISIONS: DecisionPoint[] = [];

export const DecisionPointsPageV72: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // API Data
  const { data: apiDecisions, isLoading, isError, refetch } = useDecisions();
  const resolveMutation = useResolveDecision();
  const deferMutation = useDeferDecision();
  
  // Toast notifications
  const toast = useToast();

  // Transform API data to local format
  const decisions: DecisionPoint[] = useMemo(() => {
    if (!apiDecisions) return FALLBACK_DECISIONS;
    return apiDecisions as unknown as DecisionPoint[];
  }, [apiDecisions]);

  // State
  const [selectedDecision, setSelectedDecision] = useState<DecisionPoint | null>(null);
  const [filterAging, setFilterAging] = useState<AgingLevel | 'ALL'>('ALL');
  const [filterSphere, setFilterSphere] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtered decisions
  const filteredDecisions = useMemo(() => {
    let result = [...decisions].filter(d => d.status === 'pending');
    
    if (filterAging !== 'ALL') {
      result = result.filter(d => d.aging_level === filterAging);
    }
    
    if (filterSphere) {
      result = result.filter(d => d.sphere_id === filterSphere);
    }

    // Sort by aging priority
    const agingOrder: AgingLevel[] = ['BLINK', 'RED', 'YELLOW', 'GREEN', 'ARCHIVE'];
    result.sort((a, b) => agingOrder.indexOf(a.aging_level) - agingOrder.indexOf(b.aging_level));

    return result;
  }, [decisions, filterAging, filterSphere]);

  // Stats
  const stats = useMemo(() => ({
    total: decisions.filter(d => d.status === 'pending').length,
    blink: decisions.filter(d => d.aging_level === 'BLINK' && d.status === 'pending').length,
    red: decisions.filter(d => d.aging_level === 'RED' && d.status === 'pending').length,
    yellow: decisions.filter(d => d.aging_level === 'YELLOW' && d.status === 'pending').length,
    green: decisions.filter(d => d.aging_level === 'GREEN' && d.status === 'pending').length,
  }), [decisions]);

  // Handlers
  const handleDecide = useCallback((decisionId: string, optionId: string) => {
    resolveMutation.mutate(
      { decision_id: decisionId, chosen_option_id: optionId, rationale: 'User decision' },
      {
        onSuccess: () => {
          toast.success('Décision prise', 'Enregistrée dans l\'historique');
          setSelectedDecision(null);
        },
        onError: () => {
          toast.error('Erreur', 'Impossible d\'enregistrer la décision');
        },
      }
    );
  }, [resolveMutation, toast]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action) {
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'nova-chat':
        navigate('/nova');
        break;
      case 'new-decision':
        // TODO: New decision modal
        break;
    }
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') {
        setSelectedDecision(null);
        setIsSearchOpen(false);
      }
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div
        style={{
          maxWidth: selectedDecision ? 'calc(100% - 500px)' : 1200,
          margin: '0 auto',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', color: '#6B7B6B', fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
          >
            ← Retour au dashboard
          </button>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#E8F0E8', margin: '0 0 8px' }}>
            ⚡ Points de Décision
          </h1>
          <p style={{ color: '#6B7B6B', fontSize: 13, margin: 0 }}>
            {stats.total} décisions en attente
            {stats.blink > 0 && <span style={{ color: '#F97316' }}> • {stats.blink} critique{stats.blink > 1 ? 's' : ''}</span>}
            {stats.red > 0 && <span style={{ color: '#EF4444' }}> • {stats.red} urgent{stats.red > 1 ? 's' : ''}</span>}
          </p>
        </div>

        {/* Aging Timeline */}
        <AgingTimeline />

        {/* Stats Bar */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            overflowX: 'auto',
            paddingBottom: 8,
          }}
        >
          {(['ALL', 'BLINK', 'RED', 'YELLOW', 'GREEN'] as const).map((level) => {
            const config = level === 'ALL' ? null : AGING_CONFIG[level];
            const count = level === 'ALL' ? stats.total : stats[level.toLowerCase() as keyof typeof stats];
            
            return (
              <button
                key={level}
                onClick={() => setFilterAging(level)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: filterAging === level
                    ? (config ? config.bg : 'rgba(216, 178, 106, 0.15)')
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${
                    filterAging === level
                      ? (config ? config.border : '#D8B26A')
                      : 'rgba(255, 255, 255, 0.06)'
                  }`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 16 }}>{config ? config.icon : '📊'}</span>
                <span style={{ fontSize: 13, color: config ? config.color : '#D8B26A', fontWeight: 500 }}>
                  {level === 'ALL' ? 'Tous' : config?.label}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 4,
                    fontSize: 11,
                    color: '#9BA89B',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Decisions List */}
        {filteredDecisions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onClick={() => setSelectedDecision(decision)}
                isSelected={selectedDecision?.id === decision.id}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
            <h3 style={{ color: '#4ADE80', fontSize: 16, margin: '0 0 8px' }}>
              Aucune décision en attente!
            </h3>
            <p style={{ color: '#6B7B6B', fontSize: 13, margin: 0 }}>
              Vous êtes à jour. Toutes les décisions ont été traitées.
            </p>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <DecisionDetailPanel
        decision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
        onDecide={handleDecide}
      />

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

export default DecisionPointsPageV72;
