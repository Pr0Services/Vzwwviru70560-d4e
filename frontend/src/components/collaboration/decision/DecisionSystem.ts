/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — DECISION SYSTEM                                   ║
 * ║                                                                              ║
 * ║  REVISIT DECISION FLOW — Simple & Safe                                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * Une décision CHE·NU est IMMUTABLE.
 * Revisiter une décision crée TOUJOURS une nouvelle décision.
 * 
 * L'historique est préservé.
 * La traçabilité est obligatoire.
 * 
 * POINTS D'ENTRÉE AUTORISÉS:
 * - Dashboard → Decision (read-only) → bouton "Revisit"
 * - Decision Meeting source → bouton "Revisit decision"
 * 
 * POINTS D'ENTRÉE INTERDITS:
 * - Notes
 * - Working Sessions
 * - Agents
 * - Quick actions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type DecisionStatus = 'active' | 'superseded';

export type RevisitReason = 
  | 'new_information'
  | 'changed_constraints'
  | 'unexpected_impact'
  | 'strategic_shift'
  | 'other';

export interface Decision {
  id: string;
  createdAt: string;
  meetingId: string;
  meetingType: 'decision'; // Seul type autorisé
  
  // Contenu
  content: string;
  rationale: string;
  impact: string;
  
  // Statut
  status: DecisionStatus;
  
  // Chaînage (historique)
  previousDecisionId: string | null;
  nextDecisionId: string | null;
  
  // Métadonnées
  createdBy: string;
  sphere: string;
}

export interface RevisitContext {
  originalDecision: Decision;
  reason: RevisitReason;
  reasonText: string;
  newMeetingId: string | null;
}

export type RevisitStep = 
  | 'context'      // Step 1: Contexte & Confirmation
  | 'reason'       // Step 2: Raison de la révision
  | 'meeting'      // Step 3: Création du Decision Meeting
  | 'complete';    // Step 4: Nouvelle décision créée

export interface RevisitFlowState {
  step: RevisitStep;
  decision: Decision;
  reason: RevisitReason | null;
  reasonText: string;
  newMeetingId: string | null;
  newDecisionId: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REASON OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const REVISIT_REASONS: Record<RevisitReason, { label: string; description: string }> = {
  new_information: {
    label: 'New Information',
    description: 'New facts or data have emerged since the decision',
  },
  changed_constraints: {
    label: 'Changed Constraints',
    description: 'Resources, timeline, or other constraints have changed',
  },
  unexpected_impact: {
    label: 'Unexpected Impact',
    description: 'The decision had unforeseen consequences',
  },
  strategic_shift: {
    label: 'Strategic Shift',
    description: 'Overall strategy or priorities have changed',
  },
  other: {
    label: 'Other',
    description: 'Another reason not listed above',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UI TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const DECISION_UI = {
  // Active decision
  active: {
    background: '#2A3138',
    surface: '#2F363D',
    border: 'rgba(110, 175, 196, 0.3)',
    accent: '#6EAFC4',
    badge: {
      background: 'rgba(110, 175, 196, 0.15)',
      color: '#6EAFC4',
    },
  },
  
  // Superseded decision (atténuée)
  superseded: {
    background: '#252A30',
    surface: '#2A3036',
    border: 'rgba(255, 255, 255, 0.03)',
    accent: '#8B9096',
    badge: {
      background: 'rgba(139, 144, 150, 0.15)',
      color: '#8B9096',
    },
  },
  
  // Revisit flow
  flow: {
    background: '#1F2429',
    surface: '#2A3138',
    surfaceFocus: '#303841',
    border: 'rgba(255, 255, 255, 0.04)',
    radius: '12px',
    padding: '24px',
  },
  
  // Buttons
  buttons: {
    primary: {
      background: '#6EAFC4',
      color: '#1B1F23',
      hover: '#7EBFD4',
    },
    secondary: {
      background: 'transparent',
      color: '#B8BDC3',
      border: 'rgba(255, 255, 255, 0.08)',
      hover: 'rgba(255, 255, 255, 0.04)',
    },
    danger: {
      background: 'rgba(196, 112, 112, 0.15)',
      color: '#C47070',
      hover: 'rgba(196, 112, 112, 0.25)',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// FLOW MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export const FLOW_MESSAGES = {
  context: {
    title: 'Revisit this decision',
    description: 'This decision is active and visible in the Dashboard. Revisiting it will create a new decision, not edit the existing one.',
    warning: 'The original decision will be preserved in history.',
  },
  reason: {
    title: 'Why are you revisiting this decision?',
    placeholder: 'What has changed since this decision was made?',
    hint: 'Keep it brief — this is for context, not justification.',
  },
  meeting: {
    title: 'Decision Meeting Required',
    description: 'A Decision Meeting will be created to revisit this decision. The original decision will be shown as reference.',
    action: 'Create Decision Meeting',
  },
  complete: {
    title: 'Decision Revisited',
    newActive: 'New decision is now active.',
    superseded: 'Original decision has been superseded.',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Vérifie si une décision peut être revisitée
 */
export function canRevisitDecision(decision: Decision): boolean {
  return decision.status === 'active';
}

/**
 * Crée l'état initial du flow de révision
 */
export function createRevisitFlowState(decision: Decision): RevisitFlowState {
  return {
    step: 'context',
    decision,
    reason: null,
    reasonText: '',
    newMeetingId: null,
    newDecisionId: null,
  };
}

/**
 * Passe à l'étape suivante du flow
 */
export function nextRevisitStep(state: RevisitFlowState): RevisitFlowState {
  const steps: RevisitStep[] = ['context', 'reason', 'meeting', 'complete'];
  const currentIndex = steps.indexOf(state.step);
  
  if (currentIndex < steps.length - 1) {
    return {
      ...state,
      step: steps[currentIndex + 1],
    };
  }
  
  return state;
}

/**
 * Revient à l'étape précédente
 */
export function previousRevisitStep(state: RevisitFlowState): RevisitFlowState {
  const steps: RevisitStep[] = ['context', 'reason', 'meeting', 'complete'];
  const currentIndex = steps.indexOf(state.step);
  
  if (currentIndex > 0) {
    return {
      ...state,
      step: steps[currentIndex - 1],
    };
  }
  
  return state;
}

/**
 * Vérifie si l'étape actuelle est valide pour continuer
 */
export function canProceed(state: RevisitFlowState): boolean {
  switch (state.step) {
    case 'context':
      return true; // Juste confirmation
    case 'reason':
      return state.reason !== null && state.reasonText.trim().length > 0;
    case 'meeting':
      return state.newMeetingId !== null;
    case 'complete':
      return false; // Fin du flow
    default:
      return false;
  }
}

/**
 * Met à jour le statut d'une décision après révision
 */
export function supersededDecision(
  originalDecision: Decision,
  newDecisionId: string
): Decision {
  return {
    ...originalDecision,
    status: 'superseded',
    nextDecisionId: newDecisionId,
  };
}

/**
 * Crée une nouvelle décision qui remplace l'ancienne
 */
export function createRevisedDecision(
  originalDecision: Decision,
  newContent: {
    content: string;
    rationale: string;
    impact: string;
  },
  newMeetingId: string,
  newId: string,
  createdBy: string
): Decision {
  return {
    id: newId,
    createdAt: new Date().toISOString(),
    meetingId: newMeetingId,
    meetingType: 'decision',
    
    content: newContent.content,
    rationale: newContent.rationale,
    impact: newContent.impact,
    
    status: 'active',
    
    previousDecisionId: originalDecision.id,
    nextDecisionId: null,
    
    createdBy,
    sphere: originalDecision.sphere,
  };
}

/**
 * Formate l'affichage du lien de décision
 */
export function formatDecisionLink(decision: Decision, type: 'supersedes' | 'revisited_by'): string {
  const date = new Date(decision.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  if (type === 'supersedes') {
    return `Supersedes decision from ${date}`;
  } else {
    return `Revisited by decision from ${date}`;
  }
}

/**
 * Récupère l'historique complet d'une chaîne de décisions
 */
export function getDecisionHistory(
  decision: Decision,
  allDecisions: Decision[]
): Decision[] {
  const history: Decision[] = [];
  let current: Decision | undefined = decision;
  
  // Remonter vers les décisions précédentes
  while (current?.previousDecisionId) {
    current = allDecisions.find(d => d.id === current!.previousDecisionId);
    if (current) {
      history.unshift(current);
    }
  }
  
  // Ajouter la décision courante
  history.push(decision);
  
  // Descendre vers les décisions suivantes
  current = decision;
  while (current?.nextDecisionId) {
    current = allDecisions.find(d => d.id === current!.nextDecisionId);
    if (current) {
      history.push(current);
    }
  }
  
  return history;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const DECISION_AGENT_RULES = {
  allowed: [
    'Détecter qu\'une décision est obsolète',
    'Suggérer une révision (notification)',
    'Afficher l\'historique des décisions',
    'Comparer les décisions liées',
  ],
  forbidden: [
    'Initier une révision',
    'Créer une décision',
    'Changer un statut',
    'Modifier une décision existante',
    'Supprimer une décision',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const DASHBOARD_DECISION_RULES = {
  display: [
    'Afficher uniquement les décisions ACTIVE',
    'Historique accessible en détail',
    'Une seule décision active par sujet',
    'Décisions superseded atténuées',
  ],
  actions: [
    'Bouton "Revisit" visible sur décision active',
    'Lien vers meeting source',
    'Lien vers historique',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valide qu'une révision peut être effectuée
 */
export function validateRevisitRequest(
  decision: Decision,
  entryPoint: 'dashboard' | 'meeting' | 'notes' | 'working' | 'agent' | 'quick_action'
): { valid: boolean; error?: string } {
  // Vérifier le statut
  if (decision.status !== 'active') {
    return {
      valid: false,
      error: 'Only active decisions can be revisited.',
    };
  }
  
  // Vérifier le point d'entrée
  const allowedEntryPoints = ['dashboard', 'meeting'];
  if (!allowedEntryPoints.includes(entryPoint)) {
    return {
      valid: false,
      error: `Revisit is not allowed from ${entryPoint}. Use Dashboard or Decision Meeting.`,
    };
  }
  
  return { valid: true };
}

export default {
  REVISIT_REASONS,
  DECISION_UI,
  FLOW_MESSAGES,
  canRevisitDecision,
  createRevisitFlowState,
  nextRevisitStep,
  previousRevisitStep,
  canProceed,
  supersededDecision,
  createRevisedDecision,
  formatDecisionLink,
  getDecisionHistory,
  validateRevisitRequest,
};
