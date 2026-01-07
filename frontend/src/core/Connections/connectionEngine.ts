/**
 * CHE·NU™ — CONNECTION ENGINE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Moteur d'exécution des connexions réutilisables
 * ════════════════════════════════════════════════════════════════════════════
 */

import { 
  ConnectionTemplate, 
  SphereId, 
  ConnectionTrigger,
  AutomationLevel,
  DataElement,
  CONNECTION_TEMPLATES,
  getTemplatesForProfile,
  getTemplatesBetweenSpheres,
  estimateTokenCost
} from './connectionTemplates';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES D'INSTANCE DE CONNEXION
// ═══════════════════════════════════════════════════════════════════════════

export interface ConnectionInstance {
  id: string;
  templateId: string;
  userId: string;
  
  // Configuration spécifique à l'utilisateur
  customConfig: {
    enabled: boolean;
    schedule?: string;
    overrides: Record<string, any>;
  };
  
  // État d'exécution
  status: 'active' | 'paused' | 'error' | 'pending-approval';
  lastRun?: Date;
  nextRun?: Date;
  
  // Statistiques
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    tokensUsed: number;
    lastError?: string;
  };
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionExecution {
  id: string;
  instanceId: string;
  templateId: string;
  
  // Données
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  
  // Exécution
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'pending-approval' | 'cancelled';
  
  // Gouvernance
  tokensUsed: number;
  encodingApplied: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Erreurs
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONNECTION ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class ConnectionEngine {
  private instances: Map<string, ConnectionInstance> = new Map();
  private executions: Map<string, ConnectionExecution> = new Map();
  
  constructor() {
    logger.debug('🔌 CHE·NU Connection Engine initialized');
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // GESTION DES INSTANCES
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Créer une instance de connexion pour un utilisateur
   */
  createInstance(
    userId: string, 
    templateId: string, 
    customConfig?: Partial<ConnectionInstance['customConfig']>
  ): ConnectionInstance {
    const template = CONNECTION_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    const instance: ConnectionInstance = {
      id: `conn-inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      userId,
      customConfig: {
        enabled: true,
        schedule: template.defaultConfig.schedule,
        overrides: {},
        ...customConfig
      },
      status: 'active',
      stats: {
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        tokensUsed: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.instances.set(instance.id, instance);
    logger.debug(`✅ Connection instance created: ${instance.id} for user ${userId}`);
    
    return instance;
  }
  
  /**
   * Activer/désactiver une instance
   */
  toggleInstance(instanceId: string, enabled: boolean): void {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`);
    }
    
    instance.customConfig.enabled = enabled;
    instance.status = enabled ? 'active' : 'paused';
    instance.updatedAt = new Date();
    
    logger.debug(`🔄 Connection ${instanceId} ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Obtenir toutes les instances d'un utilisateur
   */
  getUserInstances(userId: string): ConnectionInstance[] {
    return Array.from(this.instances.values())
      .filter(i => i.userId === userId);
  }
  
  /**
   * Recommander des connexions pour un profil
   */
  recommendConnections(profileId: string, activeSpheres: SphereId[]): ConnectionTemplate[] {
    const profileTemplates = getTemplatesForProfile(profileId);
    
    // Filtrer pour ne garder que les templates où les deux sphères sont actives
    return profileTemplates.filter(t => 
      activeSpheres.includes(t.fromSphere) && activeSpheres.includes(t.toSphere)
    );
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // EXÉCUTION DES CONNEXIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Exécuter une connexion
   */
  async executeConnection(
    instanceId: string, 
    inputData: Record<string, any>
  ): Promise<ConnectionExecution> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`);
    }
    
    const template = CONNECTION_TEMPLATES.find(t => t.id === instance.templateId);
    if (!template) {
      throw new Error(`Template not found: ${instance.templateId}`);
    }
    
    // Créer l'exécution
    const execution: ConnectionExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      instanceId,
      templateId: instance.templateId,
      inputData,
      startedAt: new Date(),
      status: 'running',
      tokensUsed: 0,
      encodingApplied: false
    };
    
    this.executions.set(execution.id, execution);
    
    try {
      // Vérifier si approbation requise
      if (template.automationLevel === 'approval-required') {
        execution.status = 'pending-approval';
        instance.status = 'pending-approval';
        logger.debug(`⏳ Connection ${execution.id} pending approval`);
        return execution;
      }
      
      // Valider les données d'entrée
      this.validateInputData(template, inputData);
      
      // Appliquer l'encodage si requis
      if (template.requiresEncoding) {
        execution.encodingApplied = true;
        // Simuler l'encodage - dans la vraie implémentation, appeler le service d'encodage
      }
      
      // Estimer et consommer les tokens
      const tokenCost = estimateTokenCost(template);
      execution.tokensUsed = tokenCost;
      
      // Exécuter la transformation de données
      const outputData = await this.transformData(template, inputData);
      execution.outputData = outputData;
      
      // Marquer comme complété
      execution.status = 'completed';
      execution.completedAt = new Date();
      
      // Mettre à jour les stats de l'instance
      instance.stats.totalRuns++;
      instance.stats.successfulRuns++;
      instance.stats.tokensUsed += tokenCost;
      instance.lastRun = new Date();
      instance.updatedAt = new Date();
      
      logger.debug(`✅ Connection ${execution.id} completed successfully`);
      
    } catch (error: unknown) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.error = {
        code: 'EXECUTION_ERROR',
        message: error.message,
        details: error
      };
      
      instance.stats.totalRuns++;
      instance.stats.failedRuns++;
      instance.stats.lastError = error.message;
      instance.status = 'error';
      instance.updatedAt = new Date();
      
      logger.error(`❌ Connection ${execution.id} failed:`, error.message);
    }
    
    return execution;
  }
  
  /**
   * Approuver une exécution en attente
   */
  async approveExecution(executionId: string, approverId: string): Promise<ConnectionExecution> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`);
    }
    
    if (execution.status !== 'pending-approval') {
      throw new Error(`Execution ${executionId} is not pending approval`);
    }
    
    execution.approvedBy = approverId;
    execution.approvedAt = new Date();
    
    // Continuer l'exécution
    const instance = this.instances.get(execution.instanceId);
    if (instance) {
      instance.status = 'active';
    }
    
    // Re-exécuter avec les données originales
    return this.executeConnection(execution.instanceId, execution.inputData);
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // MÉTHODES PRIVÉES
  // ─────────────────────────────────────────────────────────────────────────
  
  private validateInputData(template: ConnectionTemplate, data: Record<string, any>): void {
    for (const element of template.dataElements) {
      if (element.required && !(element.id in data)) {
        throw new Error(`Missing required field: ${element.id}`);
      }
    }
  }
  
  private async transformData(
    template: ConnectionTemplate, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    // Dans la vraie implémentation, appliquer les transformations spécifiques au template
    return {
      ...inputData,
      _transformed: true,
      _templateId: template.id,
      _timestamp: new Date().toISOString()
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATISTIQUES & REPORTING
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Obtenir les statistiques globales
   */
  getGlobalStats(): {
    totalInstances: number;
    activeInstances: number;
    totalExecutions: number;
    successRate: number;
    totalTokensUsed: number;
  } {
    const instances = Array.from(this.instances.values());
    const executions = Array.from(this.executions.values());
    
    const totalRuns = instances.reduce((sum, i) => sum + i.stats.totalRuns, 0);
    const successfulRuns = instances.reduce((sum, i) => sum + i.stats.successfulRuns, 0);
    
    return {
      totalInstances: instances.length,
      activeInstances: instances.filter(i => i.status === 'active').length,
      totalExecutions: executions.length,
      successRate: totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0,
      totalTokensUsed: instances.reduce((sum, i) => sum + i.stats.tokensUsed, 0)
    };
  }
  
  /**
   * Obtenir les connexions les plus utilisées
   */
  getMostUsedConnections(limit: number = 10): Array<{
    templateId: string;
    templateName: string;
    totalRuns: number;
    successRate: number;
  }> {
    const templateStats = new Map<string, { runs: number; successes: number }>();
    
    for (const instance of this.instances.values()) {
      const current = templateStats.get(instance.templateId) || { runs: 0, successes: 0 };
      current.runs += instance.stats.totalRuns;
      current.successes += instance.stats.successfulRuns;
      templateStats.set(instance.templateId, current);
    }
    
    return Array.from(templateStats.entries())
      .map(([templateId, stats]) => {
        const template = CONNECTION_TEMPLATES.find(t => t.id === templateId);
        return {
          templateId,
          templateName: template?.name || 'Unknown',
          totalRuns: stats.runs,
          successRate: stats.runs > 0 ? (stats.successes / stats.runs) * 100 : 0
        };
      })
      .sort((a, b) => b.totalRuns - a.totalRuns)
      .slice(0, limit);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

export const connectionEngine = new ConnectionEngine();
