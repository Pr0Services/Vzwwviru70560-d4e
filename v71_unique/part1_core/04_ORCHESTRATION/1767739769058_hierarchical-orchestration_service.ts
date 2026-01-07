/**
 * 🏛️ CHE·NU™ V71 — SERVICE D'ORCHESTRATION HIÉRARCHIQUE
 * 
 * Implémente le modèle canonique:
 * - 1 Orchestrateur Général (OG) par utilisateur
 * - Orchestrateurs de Sphère (OS) optionnels, lazy-loaded
 * - Orchestrateurs Spécialisés (OSp) temporaires
 * 
 * RÈGLE: Aucun orchestrateur n'existe sans utilité réelle
 */

import type {
  GeneralOrchestrator,
  SphereOrchestrator,
  SpecializedOrchestrator,
  SphereId,
  SpecializationType,
  Agent,
  AgentStatus,
  Delegation,
  ContextCapsule,
  ExistenceJustification
} from '../shared/types/orchestration.types';

// ============================================================================
// ORCHESTRATION REGISTRY
// ============================================================================

/**
 * Registre central de tous les orchestrateurs
 * Un seul OG par utilisateur, OS et OSp créés à la demande
 */
class OrchestrationRegistry {
  private generalOrchestrators: Map<string, GeneralOrchestrator> = new Map();
  private sphereOrchestrators: Map<string, SphereOrchestrator> = new Map();
  private specializedOrchestrators: Map<string, SpecializedOrchestrator> = new Map();
  private agents: Map<string, Agent> = new Map();
  private justifications: Map<string, ExistenceJustification> = new Map();

  // ==========================================================================
  // ORCHESTRATEUR GÉNÉRAL (OG)
  // ==========================================================================

  /**
   * Obtient ou crée l'OG d'un utilisateur
   * RÈGLE: UN et UN SEUL OG par utilisateur
   */
  getOrCreateGeneralOrchestrator(userId: string): GeneralOrchestrator {
    const existing = Array.from(this.generalOrchestrators.values())
      .find(og => og.userId === userId);
    
    if (existing) {
      return existing;
    }

    // Créer le nouvel OG
    const og: GeneralOrchestrator = {
      id: crypto.randomUUID(),
      type: 'general',
      userId,
      status: 'active',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      metadata: {},
      sphereOrchestrators: [],
      preferences: {
        language: 'fr',
        timezone: 'America/Montreal',
        notificationLevel: 'normal',
        autoActivateSpheres: true
      },
      globalContext: {
        currentSphereId: null,
        currentThreadId: null,
        activeAgentCount: 0,
        pendingDecisions: 0
      },
      stats: {
        totalDecisions: 0,
        totalDelegations: 0,
        activeTime: 0,
        lastDecisionAt: null
      }
    };

    this.generalOrchestrators.set(og.id, og);
    
    // Justification automatique (OG toujours justifié)
    this.justifications.set(og.id, {
      entityId: og.id,
      entityType: 'orchestrator',
      reason: 'General Orchestrator - Required for every user',
      need: {
        type: 'activity',
        description: 'User account creation',
        createdAt: new Date()
      },
      stillNeeded: true
    });

    console.log(`[Registry] Created General Orchestrator for user ${userId}`);
    return og;
  }

  /**
   * L'OG ne peut JAMAIS être supprimé
   */
  deleteGeneralOrchestrator(_ogId: string): never {
    throw new Error('CANONICAL VIOLATION: General Orchestrator cannot be deleted');
  }

  // ==========================================================================
  // ORCHESTRATEURS DE SPHÈRE (OS)
  // ==========================================================================

  /**
   * Active un OS pour une sphère (lazy-loading)
   * RÈGLE: Activé UNIQUEMENT si activité réelle
   */
  activateSphereOrchestrator(
    generalOrchestratorId: string,
    sphereId: SphereId,
    reason: string
  ): SphereOrchestrator {
    // Vérifier que l'OG existe
    const og = this.generalOrchestrators.get(generalOrchestratorId);
    if (!og) {
      throw new Error(`General Orchestrator ${generalOrchestratorId} not found`);
    }

    // Vérifier si OS déjà existant pour cette sphère
    const existing = Array.from(this.sphereOrchestrators.values())
      .find(os => os.generalOrchestratorId === generalOrchestratorId && os.sphereId === sphereId);
    
    if (existing) {
      // Réactiver si inactif
      if (existing.status !== 'active') {
        existing.status = 'active';
        existing.lastActiveAt = new Date();
      }
      return existing;
    }

    // Créer nouvel OS
    const os: SphereOrchestrator = {
      id: crypto.randomUUID(),
      type: 'sphere',
      userId: og.userId,
      status: 'active',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      metadata: {},
      generalOrchestratorId,
      sphereId,
      specializedOrchestrators: [],
      activeAgents: [],
      sphereContext: {
        activeProjects: 0,
        activeThreads: 0,
        pendingTasks: 0,
        lastActivityAt: new Date()
      },
      activationReason: reason
    };

    this.sphereOrchestrators.set(os.id, os);
    og.sphereOrchestrators.push(os.id);

    // Justification
    this.justifications.set(os.id, {
      entityId: os.id,
      entityType: 'orchestrator',
      reason: `Sphere Orchestrator for ${sphereId}`,
      need: {
        type: 'activity',
        description: reason,
        createdAt: new Date()
      },
      stillNeeded: true
    });

    console.log(`[Registry] Activated Sphere Orchestrator for ${sphereId}`);
    return os;
  }

  /**
   * Désactive un OS (peut être supprimé)
   */
  deactivateSphereOrchestrator(osId: string): void {
    const os = this.sphereOrchestrators.get(osId);
    if (!os) return;

    // Révoquer tous les agents
    for (const agentId of os.activeAgents) {
      this.revokeAgent(agentId);
    }

    // Supprimer tous les OSp
    for (const ospId of os.specializedOrchestrators) {
      this.terminateSpecializedOrchestrator(ospId);
    }

    // Marquer comme terminé
    os.status = 'terminated';

    // Retirer de l'OG
    const og = this.generalOrchestrators.get(os.generalOrchestratorId);
    if (og) {
      og.sphereOrchestrators = og.sphereOrchestrators.filter(id => id !== osId);
    }

    // Supprimer justification
    this.justifications.delete(osId);

    console.log(`[Registry] Deactivated Sphere Orchestrator ${osId}`);
  }

  // ==========================================================================
  // ORCHESTRATEURS SPÉCIALISÉS (OSp)
  // ==========================================================================

  /**
   * Crée un OSp pour un besoin spécifique
   * RÈGLE: Toujours subordonné à un OS, durée limitée
   */
  createSpecializedOrchestrator(
    sphereOrchestratorId: string,
    specialization: SpecializationType,
    targetId: string,
    targetType: 'project' | 'crisis' | 'event' | 'cooperative',
    reason: string,
    expectedEndDate?: Date
  ): SpecializedOrchestrator {
    // Vérifier que l'OS existe
    const os = this.sphereOrchestrators.get(sphereOrchestratorId);
    if (!os) {
      throw new Error(`Sphere Orchestrator ${sphereOrchestratorId} not found`);
    }

    const osp: SpecializedOrchestrator = {
      id: crypto.randomUUID(),
      type: 'specialized',
      userId: os.userId,
      status: 'active',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      metadata: {},
      sphereOrchestratorId,
      specialization,
      targetId,
      targetType,
      assignedAgents: [],
      expectedEndDate,
      creationReason: reason
    };

    this.specializedOrchestrators.set(osp.id, osp);
    os.specializedOrchestrators.push(osp.id);

    // Justification
    this.justifications.set(osp.id, {
      entityId: osp.id,
      entityType: 'orchestrator',
      reason: `Specialized Orchestrator: ${specialization}`,
      need: {
        type: targetType === 'crisis' ? 'crisis' : 'project',
        description: reason,
        createdAt: new Date()
      },
      validUntil: expectedEndDate,
      stillNeeded: true
    });

    console.log(`[Registry] Created Specialized Orchestrator for ${targetType}: ${targetId}`);
    return osp;
  }

  /**
   * Termine un OSp (fin de projet/crise)
   */
  terminateSpecializedOrchestrator(ospId: string): void {
    const osp = this.specializedOrchestrators.get(ospId);
    if (!osp) return;

    // Révoquer tous les agents assignés
    for (const agentId of osp.assignedAgents) {
      this.revokeAgent(agentId);
    }

    // Marquer comme terminé
    osp.status = 'terminated';

    // Retirer de l'OS parent
    const os = this.sphereOrchestrators.get(osp.sphereOrchestratorId);
    if (os) {
      os.specializedOrchestrators = os.specializedOrchestrators.filter(id => id !== ospId);
    }

    // Supprimer justification
    this.justifications.delete(ospId);

    console.log(`[Registry] Terminated Specialized Orchestrator ${ospId}`);
  }

  // ==========================================================================
  // AGENTS
  // ==========================================================================

  /**
   * Assigne un agent à un orchestrateur
   * RÈGLE: Agent n'existe que si besoin concret
   */
  assignAgent(
    orchestratorId: string,
    agentConfig: Omit<Agent, 'id' | 'orchestratorId' | 'orchestratorType' | 'status' | 'createdAt' | 'lastActiveAt'>
  ): Agent {
    // Déterminer le type d'orchestrateur
    let orchestratorType: 'general' | 'sphere' | 'specialized';
    if (this.generalOrchestrators.has(orchestratorId)) {
      orchestratorType = 'general';
    } else if (this.sphereOrchestrators.has(orchestratorId)) {
      orchestratorType = 'sphere';
    } else if (this.specializedOrchestrators.has(orchestratorId)) {
      orchestratorType = 'specialized';
    } else {
      throw new Error(`Orchestrator ${orchestratorId} not found`);
    }

    const agent: Agent = {
      ...agentConfig,
      id: crypto.randomUUID(),
      orchestratorId,
      orchestratorType,
      status: 'assigned',
      createdAt: new Date(),
      lastActiveAt: new Date()
    };

    this.agents.set(agent.id, agent);

    // Ajouter à l'orchestrateur
    if (orchestratorType === 'sphere') {
      const os = this.sphereOrchestrators.get(orchestratorId)!;
      os.activeAgents.push(agent.id);
    } else if (orchestratorType === 'specialized') {
      const osp = this.specializedOrchestrators.get(orchestratorId)!;
      osp.assignedAgents.push(agent.id);
    }

    // Justification
    this.justifications.set(agent.id, {
      entityId: agent.id,
      entityType: 'agent',
      reason: `Agent: ${agent.name}`,
      need: {
        type: 'request',
        description: `Assigned to orchestrator ${orchestratorId}`,
        createdAt: new Date()
      },
      validUntil: agent.expiresAt,
      stillNeeded: true
    });

    console.log(`[Registry] Assigned agent ${agent.name} to ${orchestratorType} orchestrator`);
    return agent;
  }

  /**
   * Révoque un agent
   */
  revokeAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.status = 'revoked';

    // Retirer de l'orchestrateur
    if (agent.orchestratorType === 'sphere') {
      const os = this.sphereOrchestrators.get(agent.orchestratorId);
      if (os) {
        os.activeAgents = os.activeAgents.filter(id => id !== agentId);
      }
    } else if (agent.orchestratorType === 'specialized') {
      const osp = this.specializedOrchestrators.get(agent.orchestratorId);
      if (osp) {
        osp.assignedAgents = osp.assignedAgents.filter(id => id !== agentId);
      }
    }

    // Supprimer justification
    this.justifications.delete(agentId);

    console.log(`[Registry] Revoked agent ${agentId}`);
  }

  /**
   * Met à jour le statut d'un agent
   */
  updateAgentStatus(agentId: string, status: AgentStatus): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastActiveAt = new Date();
    }
  }

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  getGeneralOrchestrator(userId: string): GeneralOrchestrator | undefined {
    return Array.from(this.generalOrchestrators.values())
      .find(og => og.userId === userId);
  }

  getSphereOrchestrators(generalOrchestratorId: string): SphereOrchestrator[] {
    return Array.from(this.sphereOrchestrators.values())
      .filter(os => os.generalOrchestratorId === generalOrchestratorId);
  }

  getSpecializedOrchestrators(sphereOrchestratorId: string): SpecializedOrchestrator[] {
    return Array.from(this.specializedOrchestrators.values())
      .filter(osp => osp.sphereOrchestratorId === sphereOrchestratorId);
  }

  getAgents(orchestratorId: string): Agent[] {
    return Array.from(this.agents.values())
      .filter(a => a.orchestratorId === orchestratorId && a.status !== 'revoked');
  }

  /**
   * Vérifie si une entité est toujours justifiée
   */
  isStillJustified(entityId: string): boolean {
    const justification = this.justifications.get(entityId);
    if (!justification) return false;
    
    if (justification.validUntil && justification.validUntil < new Date()) {
      return false;
    }
    
    return justification.stillNeeded;
  }

  /**
   * Nettoyage des entités non justifiées
   */
  async cleanupUnjustified(): Promise<void> {
    console.log('[Registry] Starting cleanup of unjustified entities...');

    // Cleanup agents
    for (const [id, agent] of this.agents) {
      if (!this.isStillJustified(id) && agent.status !== 'revoked') {
        this.revokeAgent(id);
      }
    }

    // Cleanup OSp
    for (const [id, osp] of this.specializedOrchestrators) {
      if (!this.isStillJustified(id) && osp.status !== 'terminated') {
        this.terminateSpecializedOrchestrator(id);
      }
    }

    // Cleanup OS (sauf si agents actifs)
    for (const [id, os] of this.sphereOrchestrators) {
      if (!this.isStillJustified(id) && os.activeAgents.length === 0 && os.status !== 'terminated') {
        this.deactivateSphereOrchestrator(id);
      }
    }

    console.log('[Registry] Cleanup complete');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const orchestrationRegistry = new OrchestrationRegistry();

// ============================================================================
// HIERARCHICAL ORCHESTRATION SERVICE
// ============================================================================

/**
 * Service principal d'orchestration hiérarchique
 */
export class HierarchicalOrchestrationService {
  private registry = orchestrationRegistry;

  /**
   * Initialise l'orchestration pour un utilisateur
   */
  async initializeForUser(userId: string): Promise<GeneralOrchestrator> {
    return this.registry.getOrCreateGeneralOrchestrator(userId);
  }

  /**
   * Traite une intention en respectant la hiérarchie
   * USER → OG → OS → OSp → Agent
   */
  async processIntent(
    userId: string,
    sphereId: SphereId,
    intent: {
      type: string;
      action: string;
      payload: Record<string, unknown>;
    }
  ): Promise<{ delegationId: string; status: string }> {
    // 1. Obtenir l'OG
    const og = this.registry.getOrCreateGeneralOrchestrator(userId);

    // 2. Activer l'OS si nécessaire
    const os = this.registry.activateSphereOrchestrator(
      og.id,
      sphereId,
      `User activity: ${intent.type}`
    );

    // 3. Créer la délégation OG → OS
    const delegation: Delegation = {
      id: crypto.randomUUID(),
      fromOrchestratorId: og.id,
      fromType: 'general',
      toOrchestratorId: os.id,
      task: {
        type: intent.type,
        description: intent.action,
        priority: 'normal',
        payload: intent.payload
      },
      status: 'pending',
      createdAt: new Date()
    };

    // 4. Mettre à jour les stats
    og.stats.totalDelegations++;
    og.lastActiveAt = new Date();
    os.lastActiveAt = new Date();

    console.log(`[Orchestration] Delegated ${intent.type} from OG to OS ${sphereId}`);

    return {
      delegationId: delegation.id,
      status: 'delegated'
    };
  }

  /**
   * Crée un projet avec orchestration appropriée
   */
  async createProject(
    userId: string,
    sphereId: SphereId,
    projectId: string,
    projectName: string,
    needsSpecializedOrchestrator: boolean
  ): Promise<{ osId: string; ospId?: string }> {
    const og = this.registry.getOrCreateGeneralOrchestrator(userId);
    
    const os = this.registry.activateSphereOrchestrator(
      og.id,
      sphereId,
      `Project creation: ${projectName}`
    );

    let ospId: string | undefined;

    if (needsSpecializedOrchestrator) {
      const osp = this.registry.createSpecializedOrchestrator(
        os.id,
        'project',
        projectId,
        'project',
        `Orchestrating project: ${projectName}`
      );
      ospId = osp.id;
    }

    return { osId: os.id, ospId };
  }

  /**
   * Termine un projet et nettoie l'orchestration
   */
  async terminateProject(projectOspId: string): Promise<void> {
    this.registry.terminateSpecializedOrchestrator(projectOspId);
  }

  /**
   * Synchronise les hubs via une capsule de contexte
   */
  async syncHubs(userId: string): Promise<ContextCapsule> {
    const og = this.registry.getOrCreateGeneralOrchestrator(userId);
    
    // Compter les agents actifs
    let activeAgentCount = 0;
    for (const osId of og.sphereOrchestrators) {
      const agents = this.registry.getAgents(osId);
      activeAgentCount += agents.filter(a => a.status === 'active').length;
    }

    const capsule: ContextCapsule = {
      id: crypto.randomUUID(),
      orchestratorId: og.id,
      targetHubs: ['communication', 'navigation', 'execution'],
      context: {
        sphere: og.globalContext.currentSphereId as SphereId | undefined,
        thread: og.globalContext.currentThreadId || undefined,
        activeAgents: [], // IDs cachés au frontend
        pendingDecisions: og.globalContext.pendingDecisions,
        alerts: []
      },
      timestamp: new Date()
    };

    // Mettre à jour le contexte global
    og.globalContext.activeAgentCount = activeAgentCount;

    return capsule;
  }

  /**
   * Obtient le statut hiérarchique complet (pour debug/admin)
   */
  async getHierarchyStatus(userId: string): Promise<{
    og: GeneralOrchestrator;
    spheres: Array<{
      os: SphereOrchestrator;
      specialized: SpecializedOrchestrator[];
      agents: Agent[];
    }>;
  }> {
    const og = this.registry.getOrCreateGeneralOrchestrator(userId);
    const spheres = [];

    for (const osId of og.sphereOrchestrators) {
      const os = Array.from(orchestrationRegistry['sphereOrchestrators'].values())
        .find(s => s.id === osId);
      
      if (os) {
        const specialized = this.registry.getSpecializedOrchestrators(os.id);
        const agents = this.registry.getAgents(os.id);
        
        spheres.push({ os, specialized, agents });
      }
    }

    return { og, spheres };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const hierarchicalOrchestration = new HierarchicalOrchestrationService();
