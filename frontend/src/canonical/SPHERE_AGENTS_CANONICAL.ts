// =============================================================================
// CHE·NU™ — AGENTS PAR SPHÈRE (MINIMAL OPÉRATIONNEL)
// =============================================================================
// ⚠️ VERROUILLÉ — UN AGENT PAR RESPONSABILITÉ IRRÉDUCTIBLE
// 
// Principe: Chaque sphère a le minimum vital pour:
// - Raisonner
// - Coordonner
// - Tracer
// - Décider sous contrôle humain
// =============================================================================

import { SphereId } from './SPHERES_CANONICAL_V2';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type SphereAgentRole = 
  | 'core'           // Agent central de la sphère
  | 'memory'         // Mémoire spécifique
  | 'coordination'   // Coordination (My Team)
  | 'roles'          // Rôles & Responsabilités
  | 'reasoning'      // Raisonnement contextuel
  ;

export interface SphereAgent {
  id: string;
  name: string;
  nameFr: string;
  sphereId: SphereId | 'transversal';
  role: SphereAgentRole;
  
  // Responsabilités
  responsibilities: string[];
  
  // Restrictions
  restrictions: string[];
  
  // Gouvernance
  requiresValidation: boolean;
  governedBy?: string;  // ID de l'agent superviseur
  
  // Visuel
  emoji: string;
  color: string;
}

// =============================================================================
// 🔴 SPHÈRE PERSONAL (CENTRE)
// =============================================================================

/**
 * Personal Core Agent
 * Déjà défini dans MINIMAL_AGENTS - référence
 */
export const PERSONAL_CORE: SphereAgent = {
  id: 'personal-core',
  name: 'Personal Core Agent',
  nameFr: 'Agent Cœur Personnel',
  sphereId: 'personal',
  role: 'core',
  
  responsibilities: [
    'Porte l\'identité utilisateur',
    'Porte le contexte dominant',
    'Centralise les décisions validées',
    'Point d\'entrée logique pour tout raisonnement'
  ],
  
  restrictions: [
    'Pas d\'autonomie',
    'Pas d\'exécution directe',
    'Pas de décisions finales sans validation'
  ],
  
  requiresValidation: true,
  
  emoji: '🔴',
  color: '#EF4444'
};

/**
 * Personal Memory Agent
 * Mémoire personnelle contextualisée
 */
export const PERSONAL_MEMORY: SphereAgent = {
  id: 'personal-memory',
  name: 'Personal Memory Agent',
  nameFr: 'Agent Mémoire Personnel',
  sphereId: 'personal',
  role: 'memory',
  
  responsibilities: [
    'Mémoire personnelle contextualisée',
    'Résumés validés',
    'Décisions personnelles',
    'Préférences utilisateur',
    'Historique validé'
  ],
  
  restrictions: [
    'Écrit UNIQUEMENT avec validation',
    'Jamais de résumé sans confirmation',
    'Pas d\'interprétation libre'
  ],
  
  requiresValidation: true,
  governedBy: 'memory-governance',
  
  emoji: '📝',
  color: '#6366F1'
};

// 👉 Sans Personal Memory: pas de continuité personnelle

// =============================================================================
// 🔵 SPHÈRE MY TEAM (SPHÈRE SPÉCIALE)
// =============================================================================

/**
 * Team Coordination Agent
 * Déjà défini dans MINIMAL_AGENTS - référence
 */
export const TEAM_COORDINATION: SphereAgent = {
  id: 'team-coordination',
  name: 'Team Coordination Agent',
  nameFr: 'Agent Coordination Équipe',
  sphereId: 'my_team',
  role: 'coordination',
  
  responsibilities: [
    'Gère la structure de l\'équipe',
    'Gère humains + agents',
    'Maintient la cohérence collective',
    'Route les actions collaboratives',
    'Applique les règles de collaboration'
  ],
  
  restrictions: [
    'Pas de décisions métier',
    'Pas d\'autorité sur le Personal'
  ],
  
  requiresValidation: true,
  
  emoji: '🔵',
  color: '#3B82F6'
};

/**
 * Role & Responsibility Agent
 * Clarifie qui fait quoi
 */
export const ROLE_RESPONSIBILITY: SphereAgent = {
  id: 'role-responsibility',
  name: 'Role & Responsibility Agent',
  nameFr: 'Agent Rôles & Responsabilités',
  sphereId: 'my_team',
  role: 'roles',
  
  responsibilities: [
    'Définit qui fait quoi',
    'Clarifie responsabilités humaines',
    'Clarifie responsabilités agents',
    'Empêche les zones grises',
    'Utilisé avant tout meeting collectif'
  ],
  
  restrictions: [
    'Aucun agent métier ne peut agir sans rôle explicite',
    'Pas de création de rôle automatique'
  ],
  
  requiresValidation: true,
  
  emoji: '📋',
  color: '#06B6D4'
};

// 👉 Sans Role & Responsibility: la collaboration devient implicite (interdit)

// =============================================================================
// 🌐 SPHÈRES CONTEXTUELLES (Template)
// =============================================================================

/**
 * Crée un Context Reasoning Agent pour une sphère
 */
export const createContextReasoningAgent = (
  sphereId: SphereId,
  sphereName: string,
  sphereNameFr: string,
  color: string
): SphereAgent => ({
  id: `${sphereId}-reasoning`,
  name: `${sphereName} Reasoning Agent`,
  nameFr: `Agent Raisonnement ${sphereNameFr}`,
  sphereId,
  role: 'reasoning',
  
  responsibilities: [
    `Raisonne dans le cadre ${sphereNameFr}`,
    'Applique contraintes du domaine',
    'Produit des propositions',
    'Structure les options',
    'Analyse contextuelle'
  ],
  
  restrictions: [
    'Jamais de décisions finales',
    'Propositions uniquement',
    'Pas d\'exécution'
  ],
  
  requiresValidation: true,
  
  emoji: '🧠',
  color
});

/**
 * Crée un Context Memory Agent pour une sphère
 */
export const createContextMemoryAgent = (
  sphereId: SphereId,
  sphereName: string,
  sphereNameFr: string,
  color: string
): SphereAgent => ({
  id: `${sphereId}-memory`,
  name: `${sphereName} Memory Agent`,
  nameFr: `Agent Mémoire ${sphereNameFr}`,
  sphereId,
  role: 'memory',
  
  responsibilities: [
    `Mémoire spécifique ${sphereNameFr}`,
    'Décisions du domaine',
    'Documents contextuels',
    'Historique traçable'
  ],
  
  restrictions: [
    'Séparée de la mémoire personnelle',
    'Gouvernée par Memory Governance Agent',
    'Écrit uniquement avec validation'
  ],
  
  requiresValidation: true,
  governedBy: 'memory-governance',
  
  emoji: '📚',
  color
});

// =============================================================================
// AGENTS PAR SPHÈRE CONTEXTUELLE (INSTANCES)
// =============================================================================

// 💼 ENTERPRISE
export const ENTERPRISE_REASONING = createContextReasoningAgent(
  'business', 'Enterprise', 'Entreprise', '#10B981'
);
export const ENTERPRISE_MEMORY = createContextMemoryAgent(
  'business', 'Enterprise', 'Entreprise', '#10B981'
);

// 🎨 DESIGN STUDIO
export const STUDIO_REASONING = createContextReasoningAgent(
  'design_studio', 'Design Studio', 'Studio Créatif', '#EC4899'
);
export const STUDIO_MEMORY = createContextMemoryAgent(
  'design_studio', 'Design Studio', 'Studio Créatif', '#EC4899'
);

// 📱 SOCIAL
export const SOCIAL_REASONING = createContextReasoningAgent(
  'social', 'Social', 'Social & Médias', '#3B82F6'
);
export const SOCIAL_MEMORY = createContextMemoryAgent(
  'social', 'Social', 'Social & Médias', '#3B82F6'
);

// 👥 COMMUNITY
export const COMMUNITY_REASONING = createContextReasoningAgent(
  'community', 'Community', 'Communauté', '#F97316'
);
export const COMMUNITY_MEMORY = createContextMemoryAgent(
  'community', 'Community', 'Communauté', '#F97316'
);

// 🏛️ GOVERNMENT
export const GOVERNMENT_REASONING = createContextReasoningAgent(
  'government', 'Government', 'Gouvernement', '#EF4444'
);
export const GOVERNMENT_MEMORY = createContextMemoryAgent(
  'government', 'Government', 'Gouvernement', '#EF4444'
);

// 🎓 SCHOLARS
export const SCHOLAR_REASONING = createContextReasoningAgent(
  'scholars', 'Scholars', 'Études & Recherche', '#7C3AED'
);
export const SCHOLAR_MEMORY = createContextMemoryAgent(
  'scholars', 'Scholars', 'Études & Recherche', '#7C3AED'
);

// 🎬 ENTERTAINMENT
export const ENTERTAINMENT_REASONING = createContextReasoningAgent(
  'entertainment', 'Entertainment', 'Divertissement', '#8B5CF6'
);
export const ENTERTAINMENT_MEMORY = createContextMemoryAgent(
  'entertainment', 'Entertainment', 'Divertissement', '#8B5CF6'
);

// =============================================================================
// EXPORTS PAR SPHÈRE
// =============================================================================

export const SPHERE_AGENTS: Record<SphereId, SphereAgent[]> = {
  personal: [PERSONAL_CORE, PERSONAL_MEMORY],
  team: [TEAM_COORDINATION, ROLE_RESPONSIBILITY],
  business: [ENTERPRISE_REASONING, ENTERPRISE_MEMORY],
  studio: [STUDIO_REASONING, STUDIO_MEMORY],
  social: [SOCIAL_REASONING, SOCIAL_MEMORY],
  community: [COMMUNITY_REASONING, COMMUNITY_MEMORY],
  government: [GOVERNMENT_REASONING, GOVERNMENT_MEMORY],
  scholar: [SCHOLAR_REASONING, SCHOLAR_MEMORY],
  entertainment: [ENTERTAINMENT_REASONING, ENTERTAINMENT_MEMORY]
};

// =============================================================================
// ALL SPHERE AGENTS
// =============================================================================

export const ALL_SPHERE_AGENTS: SphereAgent[] = Object.values(SPHERE_AGENTS).flat();

// =============================================================================
// VALIDATION
// =============================================================================

export const validateSphereAgents = (): boolean => {
  // Each sphere must have exactly 2 agents
  for (const [sphereId, agents] of Object.entries(SPHERE_AGENTS)) {
    if (agents.length !== 2) {
      logger.error(`❌ Sphere ${sphereId} must have exactly 2 agents`);
      return false;
    }
  }
  
  // Personal must have core + memory
  const personal = SPHERE_AGENTS.personal;
  if (!personal.find(a => a.role === 'core') || !personal.find(a => a.role === 'memory')) {
    logger.error('❌ Personal must have core + memory agents');
    return false;
  }
  
  // Team must have coordination + roles
  const team = SPHERE_AGENTS.team;
  if (!team.find(a => a.role === 'coordination') || !team.find(a => a.role === 'roles')) {
    logger.error('❌ Team must have coordination + roles agents');
    return false;
  }
  
  return true;
};

// Run validation
if (!validateSphereAgents()) {
  logger.error('❌ SPHERE AGENTS VALIDATION FAILED');
}
