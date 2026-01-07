/**
 * CHE·NU™ — WORKFLOW OPTIMIZER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Optimise les flux pour réduire les tokens et les actions manuelles
 * ════════════════════════════════════════════════════════════════════════════
 */

import { ConnectionTemplate, SphereId, CONNECTION_TEMPLATES } from './connectionTemplates';
import { UserProfile, UserConnectionMatcher, UserConnectionPlan } from './userConnectionMatcher';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface WorkflowChain {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  
  // Séquence de connexions
  steps: WorkflowStep[];
  
  // Optimisations
  tokenSavings: number;          // % économisé vs exécution séparée
  timeSavings: number;           // minutes économisées
  
  // Trigger
  triggerEvent: string;
  triggerSphere: SphereId;
  
  // Applicable à
  applicableArchetypes: string[];
}

export interface WorkflowStep {
  order: number;
  connectionId: string;
  connectionName: string;
  
  // Conditions
  condition?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
    value: unknown;
  };
  
  // Mappings de données entre étapes
  inputMapping?: Record<string, string>;  // previousStep.field -> thisStep.field
  
  // Gestion d'erreur
  onError: 'stop' | 'skip' | 'retry';
}

export interface OptimizationSuggestion {
  type: 'chain' | 'batch' | 'schedule' | 'encode';
  description: string;
  descriptionFr: string;
  potentialSavings: {
    tokens: number;
    timeMinutes: number;
  };
  implementation: string;
}

export interface BatchOperation {
  id: string;
  name: string;
  connections: string[];           // Template IDs
  schedule: string;                // Cron expression
  batchSize: number;
  
  // Stats
  avgTokensPerBatch: number;
  avgTimePerBatch: number;         // minutes
  runsPerMonth: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW CHAINS PRÉDÉFINIES
// ═══════════════════════════════════════════════════════════════════════════

export const PREDEFINED_WORKFLOWS: WorkflowChain[] = [
  
  // ─────────────────────────────────────────────────────────────────────────
  // FREELANCER / CREATIVE WORKFLOWS
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'wf-gig-to-payment',
    name: 'Gig Complete to Payment Received',
    nameFr: 'Contrat complété au paiement reçu',
    description: 'Complete workflow from finishing a gig to receiving and tracking payment',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-work-invoice',
        connectionName: 'Generate Invoice',
        onError: 'stop'
      },
      {
        order: 2,
        connectionId: 'tpl-income-tracking',
        connectionName: 'Track in Personal Finance',
        inputMapping: { 'invoice.amount': 'income-amount' },
        condition: { field: 'invoice.status', operator: 'equals', value: 'paid' },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-income-tax-filing',
        connectionName: 'Update Tax Records',
        inputMapping: { 'income.amount': 'gross-income' },
        onError: 'retry'
      }
    ],
    tokenSavings: 35,
    timeSavings: 45,
    triggerEvent: 'project.completed',
    triggerSphere: 'design_studio',
    applicableArchetypes: ['freelancer-creative', 'entrepreneur-service']
  },
  
  {
    id: 'wf-release-promotion',
    name: 'New Release Full Promotion',
    nameFr: 'Nouvelle sortie promotion complète',
    description: 'Automatically promote new releases across all channels',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-content-share',
        connectionName: 'Share on Social Media',
        onError: 'skip'
      },
      {
        order: 2,
        connectionId: 'tpl-event-promotion',
        connectionName: 'Create Event Announcement',
        condition: { field: 'release.hasLaunchEvent', operator: 'equals', value: true },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-royalty-tracking',
        connectionName: 'Initialize Royalty Tracking',
        inputMapping: { 'release.id': 'work-id' },
        onError: 'retry'
      }
    ],
    tokenSavings: 40,
    timeSavings: 60,
    triggerEvent: 'release.published',
    triggerSphere: 'design_studio',
    applicableArchetypes: ['freelancer-creative']
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // ENTREPRENEUR / BUSINESS WORKFLOWS
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'wf-project-milestone',
    name: 'Project Milestone Billing',
    nameFr: 'Facturation de jalon de projet',
    description: 'Bill client when project milestone is reached',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-project-billing',
        connectionName: 'Generate Progress Invoice',
        onError: 'stop'
      },
      {
        order: 2,
        connectionId: 'tpl-income-tracking',
        connectionName: 'Update Cash Flow',
        condition: { field: 'invoice.status', operator: 'equals', value: 'sent' },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-deadline-reminder',
        connectionName: 'Set Payment Follow-up',
        inputMapping: { 
          'invoice.dueDate': 'due-date',
          'invoice.id': 'deadline-name' 
        },
        onError: 'skip'
      }
    ],
    tokenSavings: 30,
    timeSavings: 30,
    triggerEvent: 'milestone.completed',
    triggerSphere: 'business',
    applicableArchetypes: ['entrepreneur-service', 'freelancer-creative']
  },
  
  {
    id: 'wf-quarterly-tax',
    name: 'Quarterly Tax Preparation',
    nameFr: 'Préparation fiscale trimestrielle',
    description: 'Prepare and file quarterly tax obligations',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-income-tax-filing',
        connectionName: 'Aggregate Quarterly Income',
        onError: 'stop'
      },
      {
        order: 2,
        connectionId: 'tpl-sales-tax-remittance',
        connectionName: 'Calculate Sales Tax',
        condition: { field: 'business.collectsSalesTax', operator: 'equals', value: true },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-gov-deadline-calendar',
        connectionName: 'Update Deadline Calendar',
        onError: 'retry'
      }
    ],
    tokenSavings: 45,
    timeSavings: 120,
    triggerEvent: 'quarter.end',
    triggerSphere: 'business',
    applicableArchetypes: ['entrepreneur-service', 'freelancer-creative', 'ecommerce-retail']
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // PROFESSIONAL / LICENSED WORKFLOWS  
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'wf-ce-credit-tracking',
    name: 'CE Credit Completion Flow',
    nameFr: 'Flux de complétion de crédits FC',
    description: 'Track CE credits from completion to license renewal',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-license-renewal',
        connectionName: 'Log CE Credits',
        onError: 'stop'
      },
      {
        order: 2,
        connectionId: 'tpl-gov-deadline-calendar',
        connectionName: 'Update Renewal Deadline',
        inputMapping: { 'credits.remaining': 'description' },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-income-tracking',
        connectionName: 'Track CE Expenses',
        condition: { field: 'ce.cost', operator: 'greater', value: 0 },
        onError: 'skip'
      }
    ],
    tokenSavings: 25,
    timeSavings: 20,
    triggerEvent: 'ce.completed',
    triggerSphere: 'community',
    applicableArchetypes: ['professional-licensed']
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // EVENT ORGANIZER WORKFLOWS
  // ─────────────────────────────────────────────────────────────────────────
  
  {
    id: 'wf-event-launch',
    name: 'Event Launch Campaign',
    nameFr: 'Campagne de lancement d\'événement',
    description: 'Complete event launch with promotion and registration',
    steps: [
      {
        order: 1,
        connectionId: 'tpl-event-promotion',
        connectionName: 'Create Social Announcement',
        onError: 'stop'
      },
      {
        order: 2,
        connectionId: 'tpl-appointment-sync',
        connectionName: 'Block Calendar',
        inputMapping: { 'event.date': 'start-time' },
        onError: 'skip'
      },
      {
        order: 3,
        connectionId: 'tpl-membership-payment',
        connectionName: 'Setup Registration Tracking',
        condition: { field: 'event.isPaid', operator: 'equals', value: true },
        onError: 'skip'
      }
    ],
    tokenSavings: 35,
    timeSavings: 45,
    triggerEvent: 'event.created',
    triggerSphere: 'entertainment',
    applicableArchetypes: ['event-organizer', 'freelancer-creative']
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW OPTIMIZER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class WorkflowOptimizer {
  private matcher: UserConnectionMatcher;
  
  constructor() {
    this.matcher = new UserConnectionMatcher();
  }
  
  /**
   * Trouver les workflows applicables à un profil
   */
  getApplicableWorkflows(profile: UserProfile): WorkflowChain[] {
    return PREDEFINED_WORKFLOWS.filter(wf => {
      // Vérifier l'archétype
      if (!wf.applicableArchetypes.includes(profile.archetype)) {
        return false;
      }
      
      // Vérifier que toutes les sphères des connexions sont actives
      for (const step of wf.steps) {
        const template = CONNECTION_TEMPLATES.find(t => t.id === step.connectionId);
        if (template) {
          if (!profile.activeSpheres.includes(template.fromSphere) ||
              !profile.activeSpheres.includes(template.toSphere)) {
            return false;
          }
        }
      }
      
      return true;
    });
  }
  
  /**
   * Analyser et suggérer des optimisations
   */
  analyzePlanForOptimizations(plan: UserConnectionPlan): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 1. Chercher des opportunités de chaînage
    const chainOpportunities = this.findChainOpportunities(plan);
    suggestions.push(...chainOpportunities);
    
    // 2. Chercher des opportunités de batch
    const batchOpportunities = this.findBatchOpportunities(plan);
    suggestions.push(...batchOpportunities);
    
    // 3. Suggérer des optimisations de schedule
    const scheduleOptimizations = this.suggestScheduleOptimizations(plan);
    suggestions.push(...scheduleOptimizations);
    
    // 4. Suggérer des encodages pour économiser des tokens
    const encodingOptimizations = this.suggestEncodingOptimizations(plan);
    suggestions.push(...encodingOptimizations);
    
    return suggestions;
  }
  
  /**
   * Trouver les opportunités de chaîner des connexions
   */
  private findChainOpportunities(plan: UserConnectionPlan): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Chercher des connexions qui partagent des sphères
    const templateIds = plan.recommendations.map(r => r.template.id);
    
    for (const workflow of PREDEFINED_WORKFLOWS) {
      const workflowTemplates = workflow.steps.map(s => s.connectionId);
      const matchCount = workflowTemplates.filter(id => templateIds.includes(id)).length;
      
      if (matchCount >= 2) {
        suggestions.push({
          type: 'chain',
          description: `Chain "${workflow.name}" workflow - ${matchCount} of ${workflowTemplates.length} connections match`,
          descriptionFr: `Chaîner le flux "${workflow.nameFr}" - ${matchCount} sur ${workflowTemplates.length} connexions correspondent`,
          potentialSavings: {
            tokens: Math.round(workflow.tokenSavings * 10),
            timeMinutes: workflow.timeSavings
          },
          implementation: `Enable workflow: ${workflow.id}`
        });
      }
    }
    
    return suggestions;
  }
  
  /**
   * Trouver les opportunités de batch
   */
  private findBatchOpportunities(plan: UserConnectionPlan): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Grouper les connexions par schedule similaire
    const scheduledConnections = plan.recommendations
      .filter(r => r.template.trigger === 'scheduled');
    
    if (scheduledConnections.length >= 3) {
      suggestions.push({
        type: 'batch',
        description: `Batch ${scheduledConnections.length} scheduled connections together`,
        descriptionFr: `Regrouper ${scheduledConnections.length} connexions planifiées`,
        potentialSavings: {
          tokens: scheduledConnections.length * 20,
          timeMinutes: scheduledConnections.length * 5
        },
        implementation: 'Create batch operation for scheduled connections'
      });
    }
    
    return suggestions;
  }
  
  /**
   * Suggérer des optimisations de schedule
   */
  private suggestScheduleOptimizations(plan: UserConnectionPlan): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Suggérer de regrouper les tâches mensuelles
    const monthlyConnections = plan.recommendations
      .filter(r => r.template.defaultConfig.schedule?.includes('0 0 1 * *'));
    
    if (monthlyConnections.length >= 2) {
      suggestions.push({
        type: 'schedule',
        description: 'Consolidate monthly tasks to single "Month-End Review" session',
        descriptionFr: 'Consolider les tâches mensuelles en une session "Revue de fin de mois"',
        potentialSavings: {
          tokens: monthlyConnections.length * 15,
          timeMinutes: monthlyConnections.length * 10
        },
        implementation: 'Create "Month-End Review" batch at 0 0 1 * *'
      });
    }
    
    return suggestions;
  }
  
  /**
   * Suggérer des optimisations d'encodage
   */
  private suggestEncodingOptimizations(plan: UserConnectionPlan): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Trouver les connexions à haut coût de tokens sans encodage
    const highCostWithoutEncoding = plan.recommendations
      .filter(r => r.template.tokenCost === 'high' && !r.template.requiresEncoding);
    
    if (highCostWithoutEncoding.length > 0) {
      suggestions.push({
        type: 'encode',
        description: `Enable encoding for ${highCostWithoutEncoding.length} high-cost connections`,
        descriptionFr: `Activer l'encodage pour ${highCostWithoutEncoding.length} connexions à coût élevé`,
        potentialSavings: {
          tokens: highCostWithoutEncoding.length * 100,
          timeMinutes: 0
        },
        implementation: 'Add encoding to: ' + highCostWithoutEncoding.map(r => r.template.id).join(', ')
      });
    }
    
    return suggestions;
  }
  
  /**
   * Calculer les économies totales si toutes les optimisations sont appliquées
   */
  calculateTotalOptimizationSavings(suggestions: OptimizationSuggestion[]): {
    totalTokensSaved: number;
    totalTimeSaved: number;
    percentageImprovement: number;
  } {
    const totalTokens = suggestions.reduce((sum, s) => sum + s.potentialSavings.tokens, 0);
    const totalTime = suggestions.reduce((sum, s) => sum + s.potentialSavings.timeMinutes, 0);
    
    // Estimer le pourcentage d'amélioration (basé sur des valeurs moyennes)
    const baselineTokens = 1000;  // Tokens mensuels moyens sans optimisation
    const baselineTime = 300;     // Minutes mensuelles moyennes sans optimisation
    
    const percentageImprovement = Math.round(
      ((totalTokens / baselineTokens + totalTime / baselineTime) / 2) * 100
    );
    
    return {
      totalTokensSaved: totalTokens,
      totalTimeSaved: totalTime,
      percentageImprovement: Math.min(percentageImprovement, 75) // Plafonner à 75%
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const workflowOptimizer = new WorkflowOptimizer();
