/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — MEETING TEMPLATES CANON                          ║
 * ║                                                                              ║
 * ║  COLLABORATION SPACE — Automatic Meeting Templates & UI                      ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * Le type de meeting détermine:
 * - la structure du contenu
 * - la densité de l'UI
 * - le rythme visuel
 * - la nature des outputs
 * 
 * Un meeting ne peut PAS changer de type après création.
 * 
 * Il existe EXACTEMENT 4 types de meetings:
 * 1. Alignment
 * 2. Decision
 * 3. Working
 * 4. Review / Retrospective
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MeetingType = 'alignment' | 'decision' | 'working' | 'review';

export interface MeetingSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export interface MeetingUITokens {
  borderRadius: string;
  shadow: string;
  shadowInset: string;
  background: string;
  surface: string;
  surfaceFocus: string;
  border: string;
  gap: string;
  padding: string;
  typography: {
    title: string;
    body: string;
    emphasis: string;
  };
  accentColor: string | null;
  scrollBehavior: 'short' | 'medium' | 'long';
  animation: boolean;
}

export interface MeetingOutput {
  type: 'notes' | 'decisions' | 'drafts' | 'outputs' | 'learnings' | 'questions' | 'actions';
  required: boolean;
  description: string;
}

export interface MeetingTemplate {
  type: MeetingType;
  icon: string;
  name: string;
  intention: string;
  description: string;
  sections: MeetingSection[];
  outputs: MeetingOutput[];
  ui: MeetingUITokens;
  rules: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI TOKENS PAR TYPE
// ═══════════════════════════════════════════════════════════════════════════════

const UI_TOKENS: Record<MeetingType, MeetingUITokens> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // ALIGNMENT — Surface compacte, sections strictes
  // ─────────────────────────────────────────────────────────────────────────────
  alignment: {
    borderRadius: '10px',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
    shadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
    background: '#2A3036',
    surface: '#2F363D',
    surfaceFocus: '#353D46',
    border: 'rgba(255, 255, 255, 0.035)',
    gap: '12px',
    padding: '16px',
    typography: {
      title: '500',    // medium
      body: '400',     // regular
      emphasis: '500', // medium
    },
    accentColor: null, // Aucun accent coloré
    scrollBehavior: 'short',
    animation: false,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DECISION — Densité élevée, zéro distraction
  // ─────────────────────────────────────────────────────────────────────────────
  decision: {
    borderRadius: '8px',
    shadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    shadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
    background: '#282E34',
    surface: '#2D343B',
    surfaceFocus: '#333A42',
    border: 'rgba(255, 255, 255, 0.04)',
    gap: '10px',
    padding: '14px',
    typography: {
      title: '600',    // semibold
      body: '500',     // medium
      emphasis: '600', // semibold pour décisions
    },
    accentColor: '#6EAFC4', // Accent discret sur "Decision Taken"
    scrollBehavior: 'short',
    animation: false,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // WORKING — Surfaces claires, beaucoup d'espace, atelier
  // ─────────────────────────────────────────────────────────────────────────────
  working: {
    borderRadius: '14px',
    shadow: '0 10px 28px rgba(0, 0, 0, 0.28)',
    shadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.035)',
    background: '#2E353D',
    surface: '#353D46',
    surfaceFocus: '#3C4650',
    border: 'rgba(255, 255, 255, 0.05)',
    gap: '20px',
    padding: '24px',
    typography: {
      title: '500',    // medium
      body: '400',     // regular
      emphasis: '400', // regular (pas de mise en avant forte)
    },
    accentColor: null, // Aucune mise en avant forte
    scrollBehavior: 'long',
    animation: true, // Transitions lentes
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // REVIEW — Neutre, lisibilité maximale, rythme lent
  // ─────────────────────────────────────────────────────────────────────────────
  review: {
    borderRadius: '12px',
    shadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
    shadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
    background: '#2C3238',
    surface: '#31383F',
    surfaceFocus: '#373E46',
    border: 'rgba(255, 255, 255, 0.03)',
    gap: '16px',
    padding: '20px',
    typography: {
      title: '500',    // medium
      body: '400',     // regular
      emphasis: '400', // regular
    },
    accentColor: null, // Aucun accent dominant
    scrollBehavior: 'medium',
    animation: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES AUTOMATIQUES
// ═══════════════════════════════════════════════════════════════════════════════

export const MEETING_TEMPLATES: Record<MeetingType, MeetingTemplate> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ALIGNMENT MEETING
  // ─────────────────────────────────────────────────────────────────────────────
  alignment: {
    type: 'alignment',
    icon: '🎯',
    name: 'Alignment Meeting',
    intention: 'Aligner les compréhensions et réduire l\'ambiguïté',
    description: 'Pas de décision finale. Partage de l\'état du système.',
    sections: [
      {
        id: 'context',
        title: 'Context',
        description: 'Pourquoi ce meeting existe',
        required: true,
      },
      {
        id: 'current-understanding',
        title: 'Current Understanding',
        description: 'État partagé du système',
        required: true,
      },
      {
        id: 'points-of-divergence',
        title: 'Points of Divergence',
        description: 'Où les compréhensions diffèrent',
        required: false,
      },
      {
        id: 'open-questions',
        title: 'Open Questions',
        description: 'Questions non résolues',
        required: true,
      },
      {
        id: 'next-alignment-needs',
        title: 'Next Alignment Needs',
        description: 'Ce qui doit être clarifié plus tard',
        required: false,
      },
    ],
    outputs: [
      { type: 'notes', required: true, description: 'Notes de discussion' },
      { type: 'questions', required: true, description: 'Questions ouvertes' },
    ],
    ui: UI_TOKENS.alignment,
    rules: [
      'Pas de décision finale',
      'Pas de brainstorming',
      'Pas de status report passif',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DECISION MEETING
  // ─────────────────────────────────────────────────────────────────────────────
  decision: {
    type: 'decision',
    icon: '⚖️',
    name: 'Decision Meeting',
    intention: 'Trancher clairement une ou plusieurs décisions',
    description: 'Meeting court, préparé, cadré.',
    sections: [
      {
        id: 'context',
        title: 'Context',
        description: 'Situation à résoudre',
        required: true,
      },
      {
        id: 'options-considered',
        title: 'Options Considered',
        description: 'Liste courte des options',
        required: true,
      },
      {
        id: 'decision-taken',
        title: 'Decision Taken',
        description: 'Choix final (OBLIGATOIRE)',
        required: true,
      },
      {
        id: 'rationale',
        title: 'Rationale',
        description: 'Pourquoi ce choix',
        required: true,
      },
      {
        id: 'impact',
        title: 'Impact',
        description: 'Conséquences attendues',
        required: true,
      },
      {
        id: 'follow-up',
        title: 'Follow-up',
        description: 'Actions ou vérifications',
        required: false,
      },
    ],
    outputs: [
      { type: 'decisions', required: true, description: 'Décisions prises (OBLIGATOIRE)' },
      { type: 'notes', required: false, description: 'Raisons et alternatives rejetées' },
    ],
    ui: UI_TOKENS.decision,
    rules: [
      'Au moins une décision DOIT être prise',
      'Préparation obligatoire avant le meeting',
      'Court et cadré',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 3. WORKING MEETING
  // ─────────────────────────────────────────────────────────────────────────────
  working: {
    type: 'working',
    icon: '🔧',
    name: 'Working Meeting',
    intention: 'Travailler ensemble en temps réel',
    description: 'Explorer, produire, itérer. Collaboratif et long.',
    sections: [
      {
        id: 'goal',
        title: 'Goal',
        description: 'Objectif clair de la session',
        required: true,
      },
      {
        id: 'scope',
        title: 'Scope',
        description: 'Ce qui est inclus / exclu',
        required: true,
      },
      {
        id: 'live-notes',
        title: 'Live Notes',
        description: 'Notes collaboratives',
        required: false,
      },
      {
        id: 'intermediate-outputs',
        title: 'Intermediate Outputs',
        description: 'Résultats partiels',
        required: false,
      },
      {
        id: 'open-threads',
        title: 'Open Threads',
        description: 'Sujets à poursuivre',
        required: false,
      },
      {
        id: 'outputs',
        title: 'Outputs',
        description: 'Résultats produits',
        required: true,
      },
    ],
    outputs: [
      { type: 'notes', required: true, description: 'Notes de travail' },
      { type: 'drafts', required: false, description: 'Brouillons' },
      { type: 'outputs', required: true, description: 'Résultats produits' },
    ],
    ui: UI_TOKENS.working,
    rules: [
      'Aucun engagement figé par défaut',
      'Collaboratif et itératif',
      'Sensation d\'atelier',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 4. REVIEW / RETROSPECTIVE MEETING
  // ─────────────────────────────────────────────────────────────────────────────
  review: {
    type: 'review',
    icon: '🔄',
    name: 'Review / Retrospective',
    intention: 'Analyser, apprendre, améliorer',
    description: 'Réflexif, calme, sans pression de livraison.',
    sections: [
      {
        id: 'what-worked',
        title: 'What Worked',
        description: 'Points positifs',
        required: true,
      },
      {
        id: 'what-didnt',
        title: 'What Didn\'t',
        description: 'Frictions / limites',
        required: true,
      },
      {
        id: 'learnings',
        title: 'Learnings',
        description: 'Enseignements',
        required: true,
      },
      {
        id: 'improvements',
        title: 'Improvements',
        description: 'Propositions d\'amélioration',
        required: false,
      },
      {
        id: 'actions',
        title: 'Actions',
        description: 'Ajustements concrets (optionnel)',
        required: false,
      },
    ],
    outputs: [
      { type: 'notes', required: true, description: 'Notes de réflexion' },
      { type: 'learnings', required: true, description: 'Enseignements' },
      { type: 'actions', required: false, description: 'Actions optionnelles' },
    ],
    ui: UI_TOKENS.review,
    rules: [
      'Pas de pression de livraison',
      'Rythme lent',
      'Lisibilité maximale',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Récupère le template pour un type de meeting
 */
export function getMeetingTemplate(type: MeetingType): MeetingTemplate {
  return MEETING_TEMPLATES[type];
}

/**
 * Récupère les tokens UI pour un type de meeting
 */
export function getMeetingUITokens(type: MeetingType): MeetingUITokens {
  return UI_TOKENS[type];
}

/**
 * Génère les sections initiales pour un nouveau meeting
 */
export function generateMeetingSections(type: MeetingType): Record<string, string> {
  const template = MEETING_TEMPLATES[type];
  const sections: Record<string, string> = {};
  
  for (const section of template.sections) {
    sections[section.id] = '';
  }
  
  return sections;
}

/**
 * Vérifie si un meeting a les outputs obligatoires
 */
export function validateMeetingOutputs(
  type: MeetingType,
  outputs: { type: string; content: string }[]
): { valid: boolean; missing: string[] } {
  const template = MEETING_TEMPLATES[type];
  const requiredOutputs = template.outputs.filter(o => o.required);
  const missing: string[] = [];
  
  for (const required of requiredOutputs) {
    const found = outputs.find(o => o.type === required.type && o.content.trim() !== '');
    if (!found) {
      missing.push(required.type);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Génère les styles CSS pour un type de meeting
 */
export function getMeetingStyles(type: MeetingType): React.CSSProperties {
  const tokens = UI_TOKENS[type];
  
  return {
    backgroundColor: tokens.background,
    borderRadius: tokens.borderRadius,
    border: `1px solid ${tokens.border}`,
    boxShadow: `${tokens.shadowInset}, ${tokens.shadow}`,
    padding: tokens.padding,
    gap: tokens.gap,
  };
}

/**
 * Génère les styles pour une surface de meeting
 */
export function getMeetingSurfaceStyles(type: MeetingType, isFocused: boolean = false): React.CSSProperties {
  const tokens = UI_TOKENS[type];
  
  return {
    backgroundColor: isFocused ? tokens.surfaceFocus : tokens.surface,
    borderRadius: tokens.borderRadius,
    border: `1px solid ${tokens.border}`,
    boxShadow: `${tokens.shadowInset}, ${tokens.shadow}`,
    padding: tokens.padding,
    transition: tokens.animation ? 'all 0.3s ease' : 'none',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_RULES = {
  allowed: [
    'Structurer les notes',
    'Résumer les meetings',
    'Rappeler les décisions',
    'Alerter sur incohérences',
  ],
  forbidden: [
    'Décider',
    'Reformuler une décision',
    'Créer un meeting',
    'Changer le type de meeting',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION BLOCK STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Decision {
  id: string;
  date: string;
  meetingId: string;
  meetingType: 'decision'; // Seul type autorisé
  content: string;
  rationale: string;
  impact: string;
  status: 'active' | 'revisit';
}

/**
 * RÈGLE ABSOLUE:
 * Aucune Decision ne peut exister sans Decision Meeting.
 */

export default MEETING_TEMPLATES;
