/**
 * CHE·NU™ — UX FLOW OPTIMIZER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Optimisation des flux UX pour réduire la charge cognitive
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * PRINCIPE: "Fewer visible elements = higher cognitive power"
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UserFlow {
  id: string;
  name: string;
  nameFr: string;
  steps: FlowStep[];
  averageCompletionTime: number;  // seconds
  dropOffRate: number;            // 0-100
  userSatisfaction: number;       // 0-5
}

export interface FlowStep {
  id: string;
  name: string;
  type: 'input' | 'selection' | 'confirmation' | 'display' | 'action';
  cognitiveLoad: 'low' | 'medium' | 'high';
  requiredDecisions: number;
  elementsVisible: number;
  averageTime: number;            // seconds
  errorRate: number;              // 0-100
}

export interface CognitiveLoadMetrics {
  totalElements: number;
  decisionsRequired: number;
  contextSwitches: number;
  informationDensity: number;     // 0-100
  overallLoad: 'minimal' | 'low' | 'medium' | 'high' | 'overload';
}

export interface UXOptimization {
  id: string;
  type: 'simplify' | 'combine' | 'reorder' | 'remove' | 'automate' | 'progressive-disclosure';
  targetStep?: string;
  description: string;
  descriptionFr: string;
  expectedImpact: {
    timeReduction: number;        // percent
    errorReduction: number;       // percent
    satisfactionIncrease: number; // points (0-5 scale)
  };
  implementationEffort: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════════════════════
// UX PRINCIPLES (CHE·NU Design Guidelines)
// ═══════════════════════════════════════════════════════════════════════════

export const UX_PRINCIPLES = {
  maxVisibleElements: 7,          // Miller's Law
  maxDecisionsPerStep: 3,
  maxStepsPerFlow: 5,
  idealCognitiveLoad: 'low',
  
  // CHE·NU specifics
  oneSphereAtATime: true,
  oneBureauVisible: true,
  novaAlwaysAccessible: true,
  workspaceTransversal: true
};

// ═══════════════════════════════════════════════════════════════════════════
// COMMON USER FLOWS
// ═══════════════════════════════════════════════════════════════════════════

export const STANDARD_FLOWS: UserFlow[] = [
  {
    id: 'flow-create-thread',
    name: 'Create New Thread',
    nameFr: 'Créer un nouveau fil',
    steps: [
      { id: 's1', name: 'Select Sphere', type: 'selection', cognitiveLoad: 'low', requiredDecisions: 1, elementsVisible: 8, averageTime: 3, errorRate: 2 },
      { id: 's2', name: 'Open Bureau', type: 'action', cognitiveLoad: 'low', requiredDecisions: 0, elementsVisible: 6, averageTime: 1, errorRate: 0 },
      { id: 's3', name: 'Navigate to Threads', type: 'selection', cognitiveLoad: 'low', requiredDecisions: 1, elementsVisible: 6, averageTime: 2, errorRate: 1 },
      { id: 's4', name: 'Click Create', type: 'action', cognitiveLoad: 'low', requiredDecisions: 0, elementsVisible: 3, averageTime: 1, errorRate: 0 },
      { id: 's5', name: 'Enter Details', type: 'input', cognitiveLoad: 'medium', requiredDecisions: 3, elementsVisible: 5, averageTime: 15, errorRate: 5 }
    ],
    averageCompletionTime: 22,
    dropOffRate: 8,
    userSatisfaction: 4.2
  },
  {
    id: 'flow-execute-connection',
    name: 'Execute Connection',
    nameFr: 'Exécuter une connexion',
    steps: [
      { id: 's1', name: 'View Available Connections', type: 'display', cognitiveLoad: 'medium', requiredDecisions: 0, elementsVisible: 10, averageTime: 5, errorRate: 0 },
      { id: 's2', name: 'Select Connection', type: 'selection', cognitiveLoad: 'medium', requiredDecisions: 1, elementsVisible: 10, averageTime: 8, errorRate: 3 },
      { id: 's3', name: 'Review Data', type: 'display', cognitiveLoad: 'high', requiredDecisions: 2, elementsVisible: 12, averageTime: 20, errorRate: 5 },
      { id: 's4', name: 'Confirm Execution', type: 'confirmation', cognitiveLoad: 'low', requiredDecisions: 1, elementsVisible: 3, averageTime: 3, errorRate: 1 },
      { id: 's5', name: 'View Results', type: 'display', cognitiveLoad: 'low', requiredDecisions: 0, elementsVisible: 5, averageTime: 10, errorRate: 0 }
    ],
    averageCompletionTime: 46,
    dropOffRate: 15,
    userSatisfaction: 3.8
  },
  {
    id: 'flow-quick-capture',
    name: 'Quick Capture',
    nameFr: 'Capture rapide',
    steps: [
      { id: 's1', name: 'Open Quick Capture', type: 'action', cognitiveLoad: 'low', requiredDecisions: 0, elementsVisible: 1, averageTime: 1, errorRate: 0 },
      { id: 's2', name: 'Enter Content', type: 'input', cognitiveLoad: 'low', requiredDecisions: 1, elementsVisible: 3, averageTime: 10, errorRate: 2 },
      { id: 's3', name: 'Submit', type: 'action', cognitiveLoad: 'low', requiredDecisions: 0, elementsVisible: 2, averageTime: 1, errorRate: 0 }
    ],
    averageCompletionTime: 12,
    dropOffRate: 3,
    userSatisfaction: 4.7
  },
  {
    id: 'flow-agent-delegation',
    name: 'Delegate to Agent',
    nameFr: 'Déléguer à un agent',
    steps: [
      { id: 's1', name: 'Describe Task', type: 'input', cognitiveLoad: 'medium', requiredDecisions: 2, elementsVisible: 4, averageTime: 30, errorRate: 8 },
      { id: 's2', name: 'Select Agent', type: 'selection', cognitiveLoad: 'medium', requiredDecisions: 1, elementsVisible: 6, averageTime: 10, errorRate: 5 },
      { id: 's3', name: 'Set Budget', type: 'input', cognitiveLoad: 'medium', requiredDecisions: 2, elementsVisible: 4, averageTime: 15, errorRate: 10 },
      { id: 's4', name: 'Confirm Delegation', type: 'confirmation', cognitiveLoad: 'low', requiredDecisions: 1, elementsVisible: 5, averageTime: 5, errorRate: 2 }
    ],
    averageCompletionTime: 60,
    dropOffRate: 20,
    userSatisfaction: 3.9
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// UX FLOW OPTIMIZER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class UXFlowOptimizer {
  private flows: Map<string, UserFlow> = new Map();
  
  constructor() {
    // Charger les flows standards
    for (const flow of STANDARD_FLOWS) {
      this.flows.set(flow.id, flow);
    }
    logger.debug('🎨 UX Flow Optimizer initialized with', this.flows.size, 'flows');
  }
  
  /**
   * Calculer la charge cognitive d'un flow
   */
  calculateCognitiveLoad(flowId: string): CognitiveLoadMetrics {
    const flow = this.flows.get(flowId);
    if (!flow) {
      return {
        totalElements: 0,
        decisionsRequired: 0,
        contextSwitches: 0,
        informationDensity: 0,
        overallLoad: 'minimal'
      };
    }
    
    const totalElements = flow.steps.reduce((sum, s) => sum + s.elementsVisible, 0);
    const decisionsRequired = flow.steps.reduce((sum, s) => sum + s.requiredDecisions, 0);
    const contextSwitches = this.countContextSwitches(flow);
    const avgElements = totalElements / flow.steps.length;
    const informationDensity = Math.min(100, (avgElements / UX_PRINCIPLES.maxVisibleElements) * 100);
    
    // Calculer la charge globale
    let loadScore = 0;
    loadScore += (totalElements / 50) * 25;           // Max 25 points
    loadScore += (decisionsRequired / 15) * 25;       // Max 25 points
    loadScore += (contextSwitches / 5) * 25;          // Max 25 points
    loadScore += (informationDensity / 100) * 25;     // Max 25 points
    
    let overallLoad: CognitiveLoadMetrics['overallLoad'];
    if (loadScore < 20) overallLoad = 'minimal';
    else if (loadScore < 40) overallLoad = 'low';
    else if (loadScore < 60) overallLoad = 'medium';
    else if (loadScore < 80) overallLoad = 'high';
    else overallLoad = 'overload';
    
    return {
      totalElements,
      decisionsRequired,
      contextSwitches,
      informationDensity,
      overallLoad
    };
  }
  
  /**
   * Analyser un flow et suggérer des optimisations
   */
  analyzeFlow(flowId: string): UXOptimization[] {
    const flow = this.flows.get(flowId);
    if (!flow) return [];
    
    const optimizations: UXOptimization[] = [];
    const cognitiveLoad = this.calculateCognitiveLoad(flowId);
    
    // Analyser chaque étape
    for (const step of flow.steps) {
      // Trop d'éléments visibles?
      if (step.elementsVisible > UX_PRINCIPLES.maxVisibleElements) {
        optimizations.push({
          id: `opt-${step.id}-reduce-elements`,
          type: 'progressive-disclosure',
          targetStep: step.id,
          description: `Reduce visible elements from ${step.elementsVisible} to ${UX_PRINCIPLES.maxVisibleElements}`,
          descriptionFr: `Réduire les éléments visibles de ${step.elementsVisible} à ${UX_PRINCIPLES.maxVisibleElements}`,
          expectedImpact: {
            timeReduction: 15,
            errorReduction: 20,
            satisfactionIncrease: 0.3
          },
          implementationEffort: 'medium'
        });
      }
      
      // Trop de décisions?
      if (step.requiredDecisions > UX_PRINCIPLES.maxDecisionsPerStep) {
        optimizations.push({
          id: `opt-${step.id}-reduce-decisions`,
          type: 'simplify',
          targetStep: step.id,
          description: `Split step into multiple simpler steps or provide smart defaults`,
          descriptionFr: `Diviser l'étape en plusieurs étapes simples ou fournir des valeurs par défaut`,
          expectedImpact: {
            timeReduction: 10,
            errorReduction: 30,
            satisfactionIncrease: 0.4
          },
          implementationEffort: 'high'
        });
      }
      
      // Taux d'erreur élevé?
      if (step.errorRate > 5) {
        optimizations.push({
          id: `opt-${step.id}-reduce-errors`,
          type: 'simplify',
          targetStep: step.id,
          description: `Add validation, hints, or auto-complete to reduce ${step.errorRate}% error rate`,
          descriptionFr: `Ajouter validation, indices ou auto-complétion pour réduire le taux d'erreur de ${step.errorRate}%`,
          expectedImpact: {
            timeReduction: 5,
            errorReduction: 50,
            satisfactionIncrease: 0.2
          },
          implementationEffort: 'low'
        });
      }
    }
    
    // Analyse au niveau du flow
    
    // Trop d'étapes?
    if (flow.steps.length > UX_PRINCIPLES.maxStepsPerFlow) {
      optimizations.push({
        id: `opt-${flowId}-combine-steps`,
        type: 'combine',
        description: `Combine ${flow.steps.length} steps into ${UX_PRINCIPLES.maxStepsPerFlow} or fewer`,
        descriptionFr: `Combiner ${flow.steps.length} étapes en ${UX_PRINCIPLES.maxStepsPerFlow} ou moins`,
        expectedImpact: {
          timeReduction: 25,
          errorReduction: 15,
          satisfactionIncrease: 0.5
        },
        implementationEffort: 'high'
      });
    }
    
    // Drop-off rate élevé?
    if (flow.dropOffRate > 10) {
      optimizations.push({
        id: `opt-${flowId}-reduce-dropoff`,
        type: 'automate',
        description: `Automate or pre-fill common patterns to reduce ${flow.dropOffRate}% drop-off`,
        descriptionFr: `Automatiser ou pré-remplir les patterns courants pour réduire l'abandon de ${flow.dropOffRate}%`,
        expectedImpact: {
          timeReduction: 30,
          errorReduction: 20,
          satisfactionIncrease: 0.6
        },
        implementationEffort: 'medium'
      });
    }
    
    // Charge cognitive élevée?
    if (cognitiveLoad.overallLoad === 'high' || cognitiveLoad.overallLoad === 'overload') {
      optimizations.push({
        id: `opt-${flowId}-progressive-disclosure`,
        type: 'progressive-disclosure',
        description: `Implement progressive disclosure to reduce ${cognitiveLoad.overallLoad} cognitive load`,
        descriptionFr: `Implémenter la divulgation progressive pour réduire la charge cognitive ${cognitiveLoad.overallLoad}`,
        expectedImpact: {
          timeReduction: 20,
          errorReduction: 25,
          satisfactionIncrease: 0.7
        },
        implementationEffort: 'high'
      });
    }
    
    return optimizations;
  }
  
  /**
   * Générer un rapport d'optimisation UX complet
   */
  generateOptimizationReport(): {
    flows: Array<{
      flow: UserFlow;
      cognitiveLoad: CognitiveLoadMetrics;
      optimizations: UXOptimization[];
      priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
    summary: {
      totalFlows: number;
      criticalFlows: number;
      totalOptimizations: number;
      estimatedTimeReduction: number;
      estimatedSatisfactionIncrease: number;
    };
  } {
    const flowReports: Array<{
      flow: UserFlow;
      cognitiveLoad: CognitiveLoadMetrics;
      optimizations: UXOptimization[];
      priority: 'low' | 'medium' | 'high' | 'critical';
    }> = [];
    
    let totalOptimizations = 0;
    let totalTimeReduction = 0;
    let totalSatisfactionIncrease = 0;
    let criticalFlows = 0;
    
    for (const flow of this.flows.values()) {
      const cognitiveLoad = this.calculateCognitiveLoad(flow.id);
      const optimizations = this.analyzeFlow(flow.id);
      
      // Déterminer la priorité
      let priority: 'low' | 'medium' | 'high' | 'critical';
      if (cognitiveLoad.overallLoad === 'overload' || flow.dropOffRate > 25) {
        priority = 'critical';
        criticalFlows++;
      } else if (cognitiveLoad.overallLoad === 'high' || flow.dropOffRate > 15) {
        priority = 'high';
      } else if (optimizations.length > 3) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
      
      flowReports.push({ flow, cognitiveLoad, optimizations, priority });
      
      totalOptimizations += optimizations.length;
      for (const opt of optimizations) {
        totalTimeReduction += opt.expectedImpact.timeReduction;
        totalSatisfactionIncrease += opt.expectedImpact.satisfactionIncrease;
      }
    }
    
    // Trier par priorité
    flowReports.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return {
      flows: flowReports,
      summary: {
        totalFlows: this.flows.size,
        criticalFlows,
        totalOptimizations,
        estimatedTimeReduction: Math.round(totalTimeReduction / this.flows.size),
        estimatedSatisfactionIncrease: Number((totalSatisfactionIncrease / this.flows.size).toFixed(2))
      }
    };
  }
  
  /**
   * Compter les changements de contexte dans un flow
   */
  private countContextSwitches(flow: UserFlow): number {
    let switches = 0;
    let lastType = '';
    
    for (const step of flow.steps) {
      if (lastType && step.type !== lastType) {
        switches++;
      }
      lastType = step.type;
    }
    
    return switches;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const uxFlowOptimizer = new UXFlowOptimizer();
