/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — DECISION TIMELINE                                 ║
 * ║                                                                              ║
 * ║  CANONICAL VISUALIZATION — Simple, Readable, Non-Intrusive                   ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * La Decision Timeline est STRICTEMENT READ-ONLY.
 * Aucune action de modification, création ou révision depuis la timeline.
 * 
 * La timeline est un outil de LECTURE, pas un outil d'ÉDITION.
 * 
 * EMPLACEMENTS AUTORISÉS:
 * - Dashboard → Decision Detail → Timeline
 * - Collaboration Space → Decision Detail → Timeline
 * 
 * EMPLACEMENTS INTERDITS:
 * - Notes
 * - Working Sessions
 * - Create Meeting flow
 * - Minimap
 */

import { Decision, DecisionStatus } from './DecisionSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TimelineItemStatus = 'active' | 'superseded' | 'initial';

/**
 * Mode de la timeline selon le contexte
 * - dashboard: Pilotage → compact, rapide, 3-5 items max
 * - collaboration: Compréhension → complet, scroll, toutes les décisions
 */
export type TimelineMode = 'dashboard' | 'collaboration';

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type KnowledgeRelationType = 
  | 'SUPERSEDES'      // DECISION → SUPERSEDES → DECISION
  | 'RELATES_TO'      // DECISION → RELATES_TO → TOPIC
  | 'AFFECTS'         // DECISION → AFFECTS → WORKSPACE
  | 'PRODUCED_IN';    // DECISION → PRODUCED_IN → MEETING

export interface KnowledgeNode {
  id: string;
  type: 'decision' | 'topic' | 'workspace' | 'meeting';
  title: string;
  status?: DecisionStatus;
  date?: string;
  impact?: string;
  meetingId?: string;
  workspaceId?: string;
}

export interface KnowledgeRelation {
  id: string;
  type: KnowledgeRelationType;
  sourceId: string;
  targetId: string;
  createdAt: string;
  createdBy: 'system' | 'agent' | 'user';
  validated: boolean; // Agent suggestions need validation
}

export interface RelatedKnowledge {
  topics: string[];      // "Related to: Navigation system, Minimap UX"
  workspaces: string[];  // "Affects: Workspace, Dashboard"
  meetings: string[];    // "Produced in: Decision Meeting #42"
}

export interface TimelineItem {
  id: string;
  decision: Decision;
  status: TimelineItemStatus;
  
  // Affichage
  title: string;
  date: string;
  meetingSource: {
    id: string;
    name: string;
  };
  impactSummary: string; // 1 ligne max
  
  // Relations
  supersedes?: string;      // "Supersedes decision from [date]"
  revisitedBy?: string;     // "Revisited by decision from [date]"
  hasConnection: boolean;   // Trait visuel vers décision liée
  
  // Knowledge Graph (optional, for Collaboration mode)
  relatedKnowledge?: RelatedKnowledge;
}

export interface Timeline {
  items: TimelineItem[];
  activeItemId: string | null;
  mode: TimelineMode;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const TIMELINE_MODE_CONFIG: Record<TimelineMode, {
  maxVisibleItems: number | null;
  showMeetingSource: boolean;
  showRelations: boolean;
  showRelatedKnowledge: boolean;
  scrollable: boolean;
  height: string;
  intention: string;
}> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD — PILOTAGE
  // "Je sais ce qui est en vigueur."
  // ─────────────────────────────────────────────────────────────────────────────
  dashboard: {
    maxVisibleItems: 5,
    showMeetingSource: false,
    showRelations: false,
    showRelatedKnowledge: false,
    scrollable: false,
    height: '320px',
    intention: 'Voir rapidement ce qui est en vigueur',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COLLABORATION — COMPRÉHENSION
  // "Je comprends pourquoi et comment on en est arrivé là."
  // ─────────────────────────────────────────────────────────────────────────────
  collaboration: {
    maxVisibleItems: null, // Toutes les décisions
    showMeetingSource: true,
    showRelations: true,
    showRelatedKnowledge: true,
    scrollable: true,
    height: 'auto',
    intention: 'Comprendre le raisonnement et les transitions',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UI TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const TIMELINE_UI = {
  // Container by mode
  container: {
    dashboard: {
      background: '#242A30',
      padding: '16px',
      borderRadius: '10px',
      border: 'rgba(255, 255, 255, 0.04)',
      maxWidth: '360px',
      maxHeight: '320px',
    },
    collaboration: {
      background: '#1F2429',
      padding: '24px',
      borderRadius: '12px',
      border: 'rgba(255, 255, 255, 0.04)',
      maxWidth: '480px',
      maxHeight: 'none',
    },
  },
  
  // Timeline line
  line: {
    color: 'rgba(255, 255, 255, 0.06)',
    width: '2px',
  },
  
  // Connection line (entre décisions liées)
  connection: {
    color: 'rgba(110, 175, 196, 0.2)',
    width: '1px',
    style: 'dashed',
  },
  
  // Status indicators (dots)
  status: {
    active: {
      dotFill: '#6EAFC4',
      dotBorder: '#6EAFC4',
      opacity: 1,
      size: '12px',
    },
    superseded: {
      dotFill: 'transparent',
      dotBorder: '#8B9096',
      opacity: 0.6,
      size: '10px',
    },
    initial: {
      dotFill: '#2A3138',
      dotBorder: '#8B9096',
      opacity: 0.7,
      size: '10px',
    },
  },
  
  // Item card by mode
  item: {
    dashboard: {
      background: '#2A3138',
      backgroundHover: '#303841',
      padding: '12px',
      borderRadius: '8px',
      border: 'rgba(255, 255, 255, 0.04)',
      gap: '6px',
      marginBottom: '10px',
    },
    collaboration: {
      background: '#2A3138',
      backgroundHover: '#303841',
      padding: '16px',
      borderRadius: '10px',
      border: 'rgba(255, 255, 255, 0.04)',
      gap: '8px',
      marginBottom: '16px',
    },
  },
  
  // Active item (légèrement plus contrasté)
  activeItem: {
    background: '#2D3540',
    border: 'rgba(110, 175, 196, 0.2)',
  },
  
  // Typography
  typography: {
    title: {
      size: '14px',
      weight: '500',
      color: '#E6E8EA',
    },
    titleSuperseded: {
      color: '#B8BDC3',
    },
    date: {
      size: '11px',
      weight: '400',
      color: '#8B9096',
    },
    meetingLink: {
      size: '11px',
      weight: '500',
      color: '#6EAFC4',
    },
    impact: {
      size: '12px',
      weight: '400',
      color: '#B8BDC3',
    },
    relation: {
      size: '10px',
      weight: '400',
      color: '#8B9096',
      fontStyle: 'italic',
    },
    badge: {
      size: '9px',
      weight: '600',
      textTransform: 'uppercase',
    },
  },
  
  // Badge colors
  badge: {
    active: {
      background: 'rgba(110, 175, 196, 0.15)',
      color: '#6EAFC4',
    },
    superseded: {
      background: 'rgba(139, 144, 150, 0.15)',
      color: '#8B9096',
    },
    initial: {
      background: 'rgba(139, 144, 150, 0.1)',
      color: '#8B9096',
    },
  },
  
  // Related Knowledge section (Collaboration mode only)
  relatedKnowledge: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '12px',
    fontSize: '11px',
    color: '#8B9096',
    labelColor: '#6EAFC4',
  },
  
  // View full history link (Dashboard only)
  viewFullHistory: {
    fontSize: '11px',
    color: '#8B9096',
    colorHover: '#B8BDC3',
  },
  
  // View details button (on hover)
  viewButton: {
    background: 'rgba(255, 255, 255, 0.04)',
    backgroundHover: 'rgba(255, 255, 255, 0.08)',
    color: '#B8BDC3',
    colorHover: '#E6E8EA',
    size: '11px',
    padding: '6px 12px',
    borderRadius: '6px',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// RULES (for reference)
// ═══════════════════════════════════════════════════════════════════════════════

export const TIMELINE_RULES = {
  structure: {
    direction: 'vertical',     // Pas horizontal
    order: 'oldest-first',     // Plus ancien en haut
    readOnly: true,            // STRICTEMENT read-only
  },
  
  interactions: {
    allowed: [
      'Hover → légère mise en avant + bouton "View details"',
      'Click → ouvre décision en lecture seule',
      'Scroll → navigation dans la timeline',
    ],
    forbidden: [
      'Édition',
      'Suppression',
      'Révision',
      'Drag & drop',
      'Réorganisation',
    ],
  },
  
  display: {
    shown: [
      'Titre',
      'Date',
      'Statut',
      'Meeting source',
      'Impact (résumé court)',
    ],
    hidden: [
      'Discussions complètes',
      'Notes longues',
      'Débats',
      'Opinions',
    ],
  },
  
  visual: {
    forbidden: [
      'Couleurs vives',
      'Animations',
      'Emphase dramatique',
      'Badges multiples',
      'Notifications',
    ],
    tone: 'neutre, calme, lisible, sans urgence',
    goal: '"Le système est maîtrisé."',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Détermine le statut visuel d'un item de timeline
 */
export function getTimelineItemStatus(
  decision: Decision,
  isFirst: boolean
): TimelineItemStatus {
  if (decision.status === 'active') {
    return 'active';
  }
  if (isFirst && decision.previousDecisionId === null) {
    return 'initial';
  }
  return 'superseded';
}

/**
 * Crée un item de timeline à partir d'une décision
 */
export function createTimelineItem(
  decision: Decision,
  meetingName: string,
  isFirst: boolean,
  linkedDecisions: { previous?: Decision; next?: Decision },
  relatedKnowledge?: RelatedKnowledge
): TimelineItem {
  const status = getTimelineItemStatus(decision, isFirst);
  
  return {
    id: decision.id,
    decision,
    status,
    
    title: decision.content.substring(0, 60) + (decision.content.length > 60 ? '...' : ''),
    date: formatTimelineDate(decision.createdAt),
    meetingSource: {
      id: decision.meetingId,
      name: meetingName,
    },
    impactSummary: decision.impact.substring(0, 80) + (decision.impact.length > 80 ? '...' : ''),
    
    supersedes: linkedDecisions.previous 
      ? `Supersedes decision from ${formatTimelineDate(linkedDecisions.previous.createdAt)}`
      : undefined,
    revisitedBy: linkedDecisions.next
      ? `Revisited by decision from ${formatTimelineDate(linkedDecisions.next.createdAt)}`
      : undefined,
    hasConnection: !!linkedDecisions.previous || !!linkedDecisions.next,
    
    relatedKnowledge,
  };
}

/**
 * Génère la timeline complète à partir d'une chaîne de décisions
 */
export function generateTimeline(
  decisions: Decision[],
  getMeetingName: (meetingId: string) => string,
  mode: TimelineMode = 'collaboration',
  getRelatedKnowledge?: (decisionId: string) => RelatedKnowledge | undefined
): Timeline {
  // Trier du plus ancien au plus récent
  const sorted = [...decisions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const config = TIMELINE_MODE_CONFIG[mode];
  
  // Limiter les items si mode dashboard
  let itemsToShow = sorted;
  if (config.maxVisibleItems !== null) {
    // Toujours inclure la décision active + les plus récentes
    const activeIndex = sorted.findIndex(d => d.status === 'active');
    if (activeIndex >= 0) {
      const start = Math.max(0, activeIndex - Math.floor(config.maxVisibleItems / 2));
      itemsToShow = sorted.slice(start, start + config.maxVisibleItems);
    } else {
      itemsToShow = sorted.slice(-config.maxVisibleItems);
    }
  }
  
  const items: TimelineItem[] = itemsToShow.map((decision, index) => {
    const globalIndex = sorted.indexOf(decision);
    const previous = globalIndex > 0 ? sorted[globalIndex - 1] : undefined;
    const next = globalIndex < sorted.length - 1 ? sorted[globalIndex + 1] : undefined;
    
    const relatedKnowledge = config.showRelatedKnowledge && getRelatedKnowledge
      ? getRelatedKnowledge(decision.id)
      : undefined;
    
    return createTimelineItem(
      decision,
      getMeetingName(decision.meetingId),
      globalIndex === 0,
      { previous, next },
      relatedKnowledge
    );
  });
  
  const activeItem = items.find(item => item.status === 'active');
  
  return {
    items,
    activeItemId: activeItem?.id || null,
    mode,
  };
}

/**
 * Formate une date pour la timeline
 */
export function formatTimelineDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Génère les styles pour le container selon le mode
 */
export function getContainerStyles(mode: TimelineMode): React.CSSProperties {
  const config = TIMELINE_UI.container[mode];
  return {
    backgroundColor: config.background,
    padding: config.padding,
    borderRadius: config.borderRadius,
    border: `1px solid ${config.border}`,
    maxWidth: config.maxWidth,
    maxHeight: config.maxHeight,
    overflow: mode === 'collaboration' ? 'auto' : 'hidden',
  };
}

/**
 * Génère les styles pour un item de timeline selon le mode
 */
export function getTimelineItemStyles(
  status: TimelineItemStatus,
  mode: TimelineMode
): React.CSSProperties {
  const itemConfig = TIMELINE_UI.item[mode];
  const baseStyles: React.CSSProperties = {
    backgroundColor: itemConfig.background,
    padding: itemConfig.padding,
    borderRadius: itemConfig.borderRadius,
    border: `1px solid ${itemConfig.border}`,
    marginBottom: itemConfig.marginBottom,
    transition: 'background-color 0.15s ease',
    opacity: TIMELINE_UI.status[status].opacity,
  };
  
  if (status === 'active') {
    return {
      ...baseStyles,
      backgroundColor: TIMELINE_UI.activeItem.background,
      border: `1px solid ${TIMELINE_UI.activeItem.border}`,
      opacity: 1,
    };
  }
  
  return baseStyles;
}

/**
 * Génère les styles pour le dot indicateur
 */
export function getStatusDotStyles(status: TimelineItemStatus): React.CSSProperties {
  const statusConfig = TIMELINE_UI.status[status];
  
  return {
    width: statusConfig.size,
    height: statusConfig.size,
    borderRadius: '50%',
    backgroundColor: statusConfig.dotFill,
    border: `2px solid ${statusConfig.dotBorder}`,
  };
}

/**
 * Génère les styles pour le badge
 */
export function getBadgeStyles(status: TimelineItemStatus): React.CSSProperties {
  const badgeConfig = TIMELINE_UI.badge[status];
  
  return {
    backgroundColor: badgeConfig.background,
    color: badgeConfig.color,
    fontSize: TIMELINE_UI.typography.badge.size,
    fontWeight: TIMELINE_UI.typography.badge.weight,
    textTransform: 'uppercase' as const,
    padding: '3px 8px',
    borderRadius: '4px',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Crée un nœud Knowledge Graph à partir d'une décision
 */
export function createDecisionNode(decision: Decision): KnowledgeNode {
  return {
    id: decision.id,
    type: 'decision',
    title: decision.content.substring(0, 60),
    status: decision.status,
    date: decision.createdAt,
    impact: decision.impact,
    meetingId: decision.meetingId,
    workspaceId: decision.sphere,
  };
}

/**
 * Crée une relation Knowledge Graph
 */
export function createKnowledgeRelation(
  type: KnowledgeRelationType,
  sourceId: string,
  targetId: string,
  createdBy: 'system' | 'agent' | 'user' = 'system'
): KnowledgeRelation {
  return {
    id: `${type}-${sourceId}-${targetId}`,
    type,
    sourceId,
    targetId,
    createdAt: new Date().toISOString(),
    createdBy,
    validated: createdBy === 'system' || createdBy === 'user',
  };
}

/**
 * Formate les relations pour l'affichage
 */
export function formatRelatedKnowledge(knowledge: RelatedKnowledge): string[] {
  const lines: string[] = [];
  
  if (knowledge.topics.length > 0) {
    lines.push(`Related to: ${knowledge.topics.join(', ')}`);
  }
  
  if (knowledge.workspaces.length > 0) {
    lines.push(`Affects: ${knowledge.workspaces.join(', ')}`);
  }
  
  if (knowledge.meetings.length > 0) {
    lines.push(`Produced in: ${knowledge.meetings.join(', ')}`);
  }
  
  return lines;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const TIMELINE_AGENT_RULES = {
  allowed: [
    'Générer un résumé court de la timeline (optionnel)',
    'Afficher les informations de la timeline',
    'Enrichir les relations (suggestions)',
    'Détecter incohérences entre décisions',
    'Proposer regroupements thématiques',
  ],
  forbidden: [
    'Modifier la timeline',
    'Suggérer une révision depuis la timeline',
    'Prioriser visuellement une décision',
    'Ajouter des badges ou notifications',
    'Créer des liens définitifs',
    'Modifier une décision',
    'Exposer le graphe sans validation humaine',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const KNOWLEDGE_GRAPH_RULES = {
  exposure: {
    dashboard: 'AUCUNE visualisation du graphe',
    collaboration: 'Section "Related Knowledge" (optionnelle, textuelle)',
    advanced: 'Mode graphe visuel via "Explore knowledge graph" uniquement',
  },
  
  access: {
    visual: 'Optionnel, non activé par défaut',
    mode: 'READ-ONLY',
    editing: 'Aucune édition directe',
  },
  
  automation: {
    allowed: [
      'Enrichir les relations (suggestions)',
      'Détecter incohérences',
      'Proposer regroupements thématiques',
    ],
    forbidden: [
      'Créer des liens définitifs sans validation',
      'Modifier une décision',
      'Exposer le graphe sans validation humaine',
    ],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valide qu'un emplacement peut afficher la timeline
 */
export function canShowTimeline(
  location: 'dashboard' | 'collaboration' | 'notes' | 'working' | 'create_meeting' | 'minimap'
): boolean {
  const allowedLocations = ['dashboard', 'collaboration'];
  return allowedLocations.includes(location);
}

/**
 * Détermine le mode approprié selon l'emplacement
 */
export function getTimelineModeForLocation(
  location: 'dashboard' | 'collaboration'
): TimelineMode {
  return location;
}

/**
 * Vérifie si le Knowledge Graph visuel peut être affiché
 */
export function canShowKnowledgeGraphVisual(
  location: 'dashboard' | 'collaboration' | 'advanced'
): boolean {
  return location === 'advanced';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * Dashboard:
 * "Je sais ce qui est en vigueur."
 * → En 2 secondes: décision active + si revisitée récemment
 * 
 * Collaboration Space:
 * "Je comprends pourquoi et comment on en est arrivé là."
 * → Raisonnement, transitions, mémoire collective
 * 
 * Knowledge Graph:
 * "Le système se souvient sans m'encombrer."
 * → Décisions → nœuds de connaissance, sans exposer la complexité
 * 
 * CHE·NU transforme les décisions en mémoire vivante,
 * sans perdre la clarté humaine.
 */

export default {
  TIMELINE_UI,
  TIMELINE_RULES,
  TIMELINE_MODE_CONFIG,
  KNOWLEDGE_GRAPH_RULES,
  getTimelineItemStatus,
  createTimelineItem,
  generateTimeline,
  formatTimelineDate,
  getContainerStyles,
  getTimelineItemStyles,
  getStatusDotStyles,
  getBadgeStyles,
  createDecisionNode,
  createKnowledgeRelation,
  formatRelatedKnowledge,
  canShowTimeline,
  getTimelineModeForLocation,
  canShowKnowledgeGraphVisual,
};
