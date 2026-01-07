/**
 * 🌍 CHE·NU V71 — WORLD ENGINE
 * Module 04 — Simulation et prédiction
 * 
 * RÈGLE: Toute action complexe est simulée avant exécution
 */

export interface Simulation {
  id: string;
  scenario: string;
  inputs: Record<string, unknown>;
  outcomes: SimulationOutcome[];
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface SimulationOutcome {
  probability: number;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  affectedEntities: string[];
}

export interface SimulationRequest {
  scenario: string;
  variables: Record<string, unknown>;
  constraints: string[];
  maxOutcomes: number;
}

export class WorldEngine {
  private simulations: Map<string, Simulation> = new Map();

  /**
   * Simule les conséquences d'une action
   */
  async simulate(request: SimulationRequest): Promise<Simulation> {
    const simulation: Simulation = {
      id: crypto.randomUUID(),
      scenario: request.scenario,
      inputs: request.variables,
      outcomes: [],
      recommendation: '',
      riskLevel: 'low',
      timestamp: new Date()
    };

    // Génération d'outcomes basée sur le scénario
    simulation.outcomes = this.generateOutcomes(request);
    simulation.riskLevel = this.assessRisk(simulation.outcomes);
    simulation.recommendation = this.generateRecommendation(simulation);

    this.simulations.set(simulation.id, simulation);
    return simulation;
  }

  private generateOutcomes(request: SimulationRequest): SimulationOutcome[] {
    // Simulation simplifiée - en prod serait un modèle ML
    return [
      {
        probability: 0.7,
        description: 'Action succeeds as expected',
        impact: 'positive',
        affectedEntities: ['user', 'target_resource']
      },
      {
        probability: 0.2,
        description: 'Partial success with minor issues',
        impact: 'neutral',
        affectedEntities: ['user']
      },
      {
        probability: 0.1,
        description: 'Action fails or has unintended consequences',
        impact: 'negative',
        affectedEntities: ['user', 'system']
      }
    ];
  }

  private assessRisk(outcomes: SimulationOutcome[]): Simulation['riskLevel'] {
    const negativeProb = outcomes
      .filter(o => o.impact === 'negative')
      .reduce((sum, o) => sum + o.probability, 0);
    
    if (negativeProb > 0.5) return 'critical';
    if (negativeProb > 0.3) return 'high';
    if (negativeProb > 0.1) return 'medium';
    return 'low';
  }

  private generateRecommendation(sim: Simulation): string {
    if (sim.riskLevel === 'critical') return 'Action not recommended - high failure probability';
    if (sim.riskLevel === 'high') return 'Proceed with caution - consider alternatives';
    if (sim.riskLevel === 'medium') return 'Action acceptable with monitoring';
    return 'Action recommended - low risk';
  }

  getSimulation(id: string): Simulation | undefined {
    return this.simulations.get(id);
  }
}

export const worldEngine = new WorldEngine();
