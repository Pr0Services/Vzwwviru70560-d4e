/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — KNOWLEDGE EXPLORATION                             ║
 * ║                                                                              ║
 * ║  Visual Readability & "What Changed Recently" View                           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * La lisibilité prime sur la densité.
 * Le changement doit être visible, jamais bruyant.
 * 
 * Aucune vue ici n'autorise une action de modification.
 * 
 * OBJECTIF:
 * L'utilisateur doit ressentir: "Je suis au courant."
 * Pas: "Je dois réagir."
 */

import { Decision, DecisionStatus } from './DecisionSystem';
import { Topic, SystemDomain } from './KnowledgeTopics';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ChangeType = 
  | 'new_decision'        // Nouvelle décision validée
  | 'decision_revisited'  // Décision revisitée
  | 'topic_impacted';     // Topic impacté par une nouvelle décision

export type TimePeriod = '7_days' | '30_days';

export interface RecentChange {
  id: string;
  type: ChangeType;
  decisionId: string;
  decisionTitle: string;
  date: string;
  topicId: string;
  topicName: string;
  isRecent: boolean; // true = recent, false = older (atténué)
}

export interface WhatChangedSummary {
  period: TimePeriod;
  totalChanges: number;
  newDecisions: number;
  revisitedDecisions: number;
  impactedTopics: number;
}

export interface TopicExploration {
  topic: Topic;
  overview: string;
  relatedDecisions: Decision[];
  impactSummary: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL READABILITY TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PRINCIPES VISUELS:
 * - hiérarchie claire
 * - contraste modéré
 * - rythme lent
 * - aucun élément décoratif
 * 
 * RÈGLES DE BASE:
 * - une information clé par ligne
 * - jamais plus de 2 niveaux de profondeur visibles
 * - espaces > lignes
 * - texte > icônes
 */
export const READABILITY_TOKENS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // TYPOGRAPHY
  // ─────────────────────────────────────────────────────────────────────────────
  typography: {
    title: {
      size: '15px',
      weight: '500',
      color: '#E6E8EA',
    },
    body: {
      size: '13px',
      weight: '400',
      color: '#B8BDC3',
    },
    meta: {
      size: '11px',
      weight: '400',
      color: '#8B9096',
    },
    // INTERDIT: capitales excessives, icônes illustratives
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COULEURS & CONTRASTE
  // ─────────────────────────────────────────────────────────────────────────────
  colors: {
    // Décision active: contraste +10%
    activeDecision: {
      background: '#2D3540',
      border: 'rgba(110, 175, 196, 0.2)',
      text: '#E6E8EA',
    },
    // Décision passée: opacité réduite
    pastDecision: {
      background: '#2A3138',
      border: 'rgba(255, 255, 255, 0.04)',
      text: '#B8BDC3',
      opacity: 0.7,
    },
    // Topics: texte neutre, JAMAIS coloré
    topic: {
      text: '#B8BDC3',
      background: 'transparent',
    },
    // Liens: soulignement subtil au hover uniquement
    link: {
      color: '#8B9096',
      colorHover: '#B8BDC3',
      underline: 'hover', // Only on hover
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SÉPARATION VISUELLE
  // ─────────────────────────────────────────────────────────────────────────────
  separation: {
    // Utiliser:
    spacing: {
      vertical: '16px',
      horizontal: '12px',
    },
    border: {
      color: 'rgba(255, 255, 255, 0.04)',
      width: '1px',
      style: 'solid',
    },
    // ÉVITER: lignes horizontales visibles, cadres multiples, fonds alternés
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONTAINERS
  // ─────────────────────────────────────────────────────────────────────────────
  containers: {
    list: {
      background: '#1F2429',
      padding: '20px',
      borderRadius: '12px',
      gap: '12px',
    },
    item: {
      background: '#2A3138',
      padding: '14px 16px',
      borderRadius: '10px',
      gap: '8px',
    },
    overview: {
      maxWidth: '600px',
      background: 'transparent',
      padding: '0',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// EXPLORE BY TOPIC — CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const TOPIC_EXPLORATION_CONFIG = {
  // Liste de Topics
  topicList: {
    format: 'vertical_simple',
    itemsPerPage: null, // Show all
    showIcons: false,
    showCounts: false, // No decision counts
    spacing: 'generous',
  },
  
  // Détail d'un Topic
  topicDetail: {
    overview: {
      maxLength: 200,
      style: 'calm_text',
    },
    relatedDecisions: {
      order: 'active_first', // Active decision always first
      pastDecisionStyle: 'attenuated',
      showPerDecision: ['title', 'date', 'status', 'link'],
    },
    impactSummary: {
      maxLength: 150,
      style: 'plain_text',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION IMPACT MAP — CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const IMPACT_MAP_CONFIG = {
  // Format: lecture de gauche à droite ou haut en bas
  layout: {
    direction: 'left_to_right', // or 'top_to_bottom'
    type: 'hierarchical', // Not free graph
  },
  
  // Nœuds
  nodes: {
    shape: 'simple', // Rectangle or circle, no complex shapes
    showIcons: false,
    showText: true,
  },
  
  // Hiérarchie
  hierarchy: {
    center: 'topic', // Topic = centre ou origine
    firstCircle: 'decisions',
    secondCircle: 'related_topics_workspaces',
  },
  
  // Contraste
  contrast: {
    activeDecision: 'soft_highlight',
    otherElements: 'attenuated',
  },
  
  // Interactions
  interactions: {
    hover: 'light_highlight',
    click: 'navigation',
    animation: 'none', // Aucune animation continue
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// WHAT CHANGED RECENTLY — CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const WHAT_CHANGED_CONFIG = {
  // Emplacement
  location: {
    primary: 'collaboration_knowledge',
    secondary: 'dashboard_summary',
  },
  
  // Période par défaut
  defaultPeriod: '7_days' as TimePeriod,
  
  // Options de période (simples)
  periodOptions: ['7_days', '30_days'] as TimePeriod[],
  
  // Pas de filtre avancé
  advancedFilters: false,
  
  // Types de changements
  changeTypes: [
    'new_decision',
    'decision_revisited',
    'topic_impacted',
  ] as ChangeType[],
  
  // Format visuel
  visual: {
    format: 'vertical_list',
    readable: true,
    showIcons: false, // Aucune icône forte
    colorCoding: false, // Aucun code couleur agressif
  },
  
  // Statuts visuels
  statusStyles: {
    recent: {
      opacity: 1,
      fontWeight: '400',
    },
    older: {
      opacity: 0.6,
      fontWeight: '400',
    },
  },
  
  // Interactions
  interactions: {
    click: 'open_decision_or_timeline',
    actionButtons: false, // Aucun bouton d'action
    revisionShortcut: false, // Aucun raccourci vers la révision
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SUMMARY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const DASHBOARD_SUMMARY_CONFIG = {
  // Format très court
  format: 'summary_only',
  
  // Template: "X decisions updated in the last Y days"
  template: '{count} decisions updated in the last {period}',
  
  // Click → redirige vers Collaboration
  clickAction: 'redirect_to_collaboration',
  
  // Le Dashboard ne détaille JAMAIS les changements
  showDetails: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UI TOKENS FOR WHAT CHANGED
// ═══════════════════════════════════════════════════════════════════════════════

export const WHAT_CHANGED_UI = {
  container: {
    background: '#1F2429',
    padding: '24px',
    borderRadius: '12px',
    border: 'rgba(255, 255, 255, 0.04)',
    maxWidth: '600px',
  },
  
  header: {
    title: {
      size: '16px',
      weight: '600',
      color: '#E6E8EA',
    },
    periodSelector: {
      size: '12px',
      color: '#8B9096',
      activeColor: '#6EAFC4',
    },
  },
  
  changeItem: {
    background: '#2A3138',
    backgroundHover: '#303841',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'background-color 0.15s ease',
  },
  
  changeType: {
    new_decision: {
      label: 'New Decision',
      color: '#B8BDC3', // Pas coloré agressivement
    },
    decision_revisited: {
      label: 'Revisited',
      color: '#B8BDC3',
    },
    topic_impacted: {
      label: 'Topic Impacted',
      color: '#B8BDC3',
    },
  },
  
  viewLink: {
    text: 'View details',
    color: '#8B9096',
    colorHover: '#B8BDC3',
    underline: 'hover',
  },
  
  dashboardSummary: {
    background: 'rgba(110, 175, 196, 0.08)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#B8BDC3',
    cursor: 'pointer',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcule si un changement est récent (dans les 3 premiers jours)
 */
export function isRecentChange(changeDate: string, period: TimePeriod): boolean {
  const now = new Date();
  const change = new Date(changeDate);
  const diffDays = Math.floor((now.getTime() - change.getTime()) / (1000 * 60 * 60 * 24));
  
  // Récent = moins de 3 jours dans une période de 7, ou moins de 10 dans 30
  if (period === '7_days') {
    return diffDays <= 3;
  }
  return diffDays <= 10;
}

/**
 * Filtre les changements par période
 */
export function filterChangesByPeriod(
  changes: RecentChange[],
  period: TimePeriod
): RecentChange[] {
  const now = new Date();
  const days = period === '7_days' ? 7 : 30;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  return changes
    .filter(c => new Date(c.date) >= cutoff)
    .map(c => ({
      ...c,
      isRecent: isRecentChange(c.date, period),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Génère le résumé pour le Dashboard
 */
export function generateDashboardSummary(
  changes: RecentChange[],
  period: TimePeriod
): string {
  const filtered = filterChangesByPeriod(changes, period);
  const count = filtered.length;
  const periodText = period === '7_days' ? '7 days' : '30 days';
  
  return DASHBOARD_SUMMARY_CONFIG.template
    .replace('{count}', count.toString())
    .replace('{period}', periodText);
}

/**
 * Calcule le résumé détaillé
 */
export function calculateChangeSummary(
  changes: RecentChange[],
  period: TimePeriod
): WhatChangedSummary {
  const filtered = filterChangesByPeriod(changes, period);
  
  return {
    period,
    totalChanges: filtered.length,
    newDecisions: filtered.filter(c => c.type === 'new_decision').length,
    revisitedDecisions: filtered.filter(c => c.type === 'decision_revisited').length,
    impactedTopics: new Set(filtered.map(c => c.topicId)).size,
  };
}

/**
 * Crée un changement récent
 */
export function createRecentChange(
  type: ChangeType,
  decision: Decision,
  topicId: string,
  topicName: string
): RecentChange {
  return {
    id: `change-${decision.id}-${Date.now()}`,
    type,
    decisionId: decision.id,
    decisionTitle: decision.content.substring(0, 60),
    date: new Date().toISOString(),
    topicId,
    topicName,
    isRecent: true,
  };
}

/**
 * Génère les styles pour un item de changement
 */
export function getChangeItemStyles(isRecent: boolean): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    backgroundColor: WHAT_CHANGED_UI.changeItem.background,
    padding: WHAT_CHANGED_UI.changeItem.padding,
    borderRadius: WHAT_CHANGED_UI.changeItem.borderRadius,
    marginBottom: WHAT_CHANGED_UI.changeItem.marginBottom,
    transition: WHAT_CHANGED_UI.changeItem.transition,
    cursor: 'pointer',
  };
  
  if (!isRecent) {
    return {
      ...baseStyles,
      opacity: WHAT_CHANGED_CONFIG.statusStyles.older.opacity,
    };
  }
  
  return baseStyles;
}

/**
 * Formate une date pour l'affichage
 */
export function formatChangeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Obtient le label d'un type de changement
 */
export function getChangeTypeLabel(type: ChangeType): string {
  return WHAT_CHANGED_UI.changeType[type].label;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPLORE BY TOPIC HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Trie les décisions avec active en premier
 */
export function sortDecisionsForExploration(decisions: Decision[]): Decision[] {
  return [...decisions].sort((a, b) => {
    // Active first
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    // Then by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Génère les styles pour une décision dans l'exploration
 */
export function getExplorationDecisionStyles(
  status: DecisionStatus
): React.CSSProperties {
  if (status === 'active') {
    return {
      backgroundColor: READABILITY_TOKENS.colors.activeDecision.background,
      border: `1px solid ${READABILITY_TOKENS.colors.activeDecision.border}`,
      color: READABILITY_TOKENS.colors.activeDecision.text,
    };
  }
  
  return {
    backgroundColor: READABILITY_TOKENS.colors.pastDecision.background,
    border: `1px solid ${READABILITY_TOKENS.colors.pastDecision.border}`,
    color: READABILITY_TOKENS.colors.pastDecision.text,
    opacity: READABILITY_TOKENS.colors.pastDecision.opacity,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const EXPLORATION_AGENT_RULES = {
  allowed: [
    'Résumer les changements récents',
    'Détecter patterns de changement',
    'Générer des insights sur l\'évolution',
  ],
  forbidden: [
    'Prioriser visuellement un changement',
    'Déclencher des notifications urgentes',
    'Interpréter l\'importance stratégique',
    'Modifier l\'ordre d\'affichage',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// FORBIDDEN PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_PATTERNS = [
  'Timeline animée',
  'Feed type réseau social',
  'Badges "new" agressifs',
  'Notifications automatiques',
  'Mélange avec tâches ou messages',
  'Couleurs vives',
  'Icônes décoratives',
  'Fonds alternés agressifs',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * L'utilisateur doit ressentir:
 * "Je suis au courant."
 * 
 * Pas:
 * "Je dois réagir."
 * 
 * CHE·NU montre le changement sans créer de pression.
 */

export default {
  READABILITY_TOKENS,
  TOPIC_EXPLORATION_CONFIG,
  IMPACT_MAP_CONFIG,
  WHAT_CHANGED_CONFIG,
  DASHBOARD_SUMMARY_CONFIG,
  WHAT_CHANGED_UI,
  isRecentChange,
  filterChangesByPeriod,
  generateDashboardSummary,
  calculateChangeSummary,
  createRecentChange,
  getChangeItemStyles,
  formatChangeDate,
  getChangeTypeLabel,
  sortDecisionsForExploration,
  getExplorationDecisionStyles,
};
