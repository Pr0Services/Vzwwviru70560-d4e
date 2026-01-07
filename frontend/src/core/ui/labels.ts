/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — SYSTÈME DE LABELS & TOOLTIPS                                       ║
 * ║                                                                                  ║
 * ║     Clarification instantanée de la navigation                                   ║
 * ║     Dashboard = Centre de Commandement                                           ║
 * ║     Bureau = Bureau de Travail                                                   ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// LABELS OFFICIELS (NE PAS MODIFIER)
// ═══════════════════════════════════════════════════════════════════════════════════

export const LABELS = {
  // Dashboard → Centre de Commandement
  DASHBOARD: {
    name: 'Centre de Commandement',
    subtitle: 'Organiser · Décider · Accéder',
    shortName: 'Commandement',
    windowTitle: 'Centre de Commandement — Mode Gestion',
    badge: 'MODE GESTION',
  },
  
  // Bureau → Bureau de Travail
  BUREAU: {
    name: 'Bureau de Travail',
    subtitle: 'Produire · Collaborer · Exécuter',
    shortName: 'Bureau',
    workspaceActive: 'Bureau de Travail — Workspace actif',
    workspaceNamed: (name: string) => `Bureau de Travail — ${name}`,
  },
  
  // Fenêtres du Bureau
  BUREAU_WINDOWS: {
    DATABASE: {
      title: 'Bureau de Travail — Base de données',
      subtitle: 'Modification directe des données',
    },
    MESSAGES: {
      title: 'Bureau de Travail — Messages',
      subtitle: 'Communication humaine centralisée',
    },
    EMAIL: {
      title: 'Bureau de Travail — Courriel',
      subtitle: 'Boîte unifiée (Gmail · Outlook · IMAP)',
    },
    AGENT: {
      title: 'Bureau de Travail — Agent',
      badges: {
        NO_ACCESS: 'Aucun accès aux messages',
        LIMITED: 'Accès limité (sur demande)',
        AUTHORIZED: 'Accès autorisé (explicite)',
      },
    },
    NOTES: {
      title: 'Bureau de Travail — Notes',
      subtitle: 'Production et documentation',
    },
    TASKS: {
      title: 'Bureau de Travail — Tâches',
      subtitle: 'Actions exécutables',
    },
  },
  
  // Zone globale
  GLOBAL: {
    contextLabel: 'Contexte actuel',
    contextTooltip: 'Vous êtes ici dans l\'écosystème CHE·NU.',
  },
  
  // Barre de communication
  COMMUNICATION: {
    messages: {
      label: 'Messages (CHE·NU)',
      tooltip: 'Toutes vos conversations, au même endroit.',
    },
    email: {
      label: 'Courriel (CHE·NU)',
      tooltip: 'Boîte unifiée de courriels.',
    },
    meetings: {
      label: 'Réunions',
      tooltip: 'Planifier et rejoindre des réunions.',
    },
    agents: {
      label: 'Agents — Communication',
      tooltip: 'Les agents n\'interviennent que sur demande.',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════════
// TOOLTIPS
// ═══════════════════════════════════════════════════════════════════════════════════

export const TOOLTIPS = {
  // Navigation
  NAV_DASHBOARD: {
    title: 'Centre de Commandement',
    description: 'Organiser et accéder au travail',
  },
  NAV_BUREAU: {
    title: 'Bureau de Travail',
    description: 'Ouvrir un espace de production',
  },
  
  // Badge Mode Gestion
  MODE_GESTION: 'Vue de gestion. Aucun travail de production ici.',
  
  // Agents
  AGENT_ACCESS: {
    none: 'Cet agent n\'a pas accès à vos messages.',
    limited: 'Accès sur demande uniquement.',
    authorized: 'Accès explicitement autorisé par vous.',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════════
// PHRASES DE CLARIFICATION (ONBOARDING)
// ═══════════════════════════════════════════════════════════════════════════════════

export const CLARIFICATION_PHRASES = {
  DASHBOARD: 'Ici, vous organisez le travail. Le travail se fait dans le Bureau.',
  BUREAU: 'Ici, vous produisez. L\'organisation se fait dans le Centre de Commandement.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════════
// CTA STANDARDS
// ═══════════════════════════════════════════════════════════════════════════════════

export const CTA = {
  DASHBOARD: {
    openInBureau: 'Ouvrir dans le Bureau',
    accessWorkspace: 'Accéder au Workspace',
    viewFull: 'Voir en grand',
  },
  BUREAU: {
    backToCommand: 'Retour au Centre de Commandement',
    newDocument: 'Nouveau document',
    newWorkspace: 'Nouvel espace',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export type AgentAccessLevel = 'none' | 'limited' | 'authorized';

export interface WindowLabel {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTooltip?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Obtient le label complet pour une fenêtre du Bureau
 */
export function getBureauWindowLabel(
  windowType: keyof typeof LABELS.BUREAU_WINDOWS,
  options?: {
    workspaceName?: string;
    agentAccess?: AgentAccessLevel;
  }
): WindowLabel {
  const config = LABELS.BUREAU_WINDOWS[windowType];
  
  if (windowType === 'AGENT' && options?.agentAccess) {
    return {
      title: config.title,
      badge: (config as typeof LABELS.BUREAU_WINDOWS.AGENT).badges[
        options.agentAccess === 'none' ? 'NO_ACCESS' :
        options.agentAccess === 'limited' ? 'LIMITED' : 'AUTHORIZED'
      ],
      badgeTooltip: TOOLTIPS.AGENT_ACCESS[options.agentAccess],
    };
  }
  
  return {
    title: config.title,
    subtitle: 'subtitle' in config ? config.subtitle : undefined,
  };
}

/**
 * Obtient le titre de fenêtre du Bureau avec nom de workspace
 */
export function getBureauWorkspaceTitle(workspaceName?: string): string {
  if (workspaceName) {
    return LABELS.BUREAU.workspaceNamed(workspaceName);
  }
  return LABELS.BUREAU.workspaceActive;
}

/**
 * Vérifie si l'utilisateur a vu la phrase de clarification
 */
export function hasSeenClarification(zone: 'DASHBOARD' | 'BUREAU'): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`chenu_clarification_${zone}`) === 'true';
}

/**
 * Marque la phrase de clarification comme vue
 */
export function markClarificationSeen(zone: 'DASHBOARD' | 'BUREAU'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`chenu_clarification_${zone}`, 'true');
}

/**
 * Réinitialise les clarifications (pour tests ou nouveau compte)
 */
export function resetClarifications(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('chenu_clarification_DASHBOARD');
  localStorage.removeItem('chenu_clarification_BUREAU');
}

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORTS PAR DÉFAUT
// ═══════════════════════════════════════════════════════════════════════════════════

export default {
  LABELS,
  TOOLTIPS,
  CLARIFICATION_PHRASES,
  CTA,
  getBureauWindowLabel,
  getBureauWorkspaceTitle,
  hasSeenClarification,
  markClarificationSeen,
  resetClarifications,
};
