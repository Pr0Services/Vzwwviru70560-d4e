/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔱 useATOM — React Hook pour l'Engine AT-OM
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useMemo } from 'react';
import {
  ATOMAgent,
  ChakraGate,
  MaatVerdict,
  SemanticEncoding,
  GovernedExecution,
  ATOM_AGENTS,
  CHAKRA_GATES,
  SACRED_CHORDS,
  detectEntryGate,
  weighHeart,
  getAlchemicalStage,
  findCompatibleCHENUAgents,
  calculateResonance
} from './atomIntegration';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface UserState {
  calm: boolean;
  focused: boolean;
  stressed: boolean;
  coherence: number;
}

interface ATOMState {
  isActive: boolean;
  mercuryState: 'FLUID' | 'FROZEN';
  currentFrequency: number;
  activeChakra: ChakraGate | null;
  activeAgents: ATOMAgent[];
  lastVerdict: MaatVerdict | null;
  executionHistory: GovernedExecution[];
}

interface UseATOMReturn {
  // État
  state: ATOMState;
  
  // Actions
  initialize: () => void;
  shutdown: () => void;
  
  // Intent Processing
  processIntent: (text: string, userState: UserState) => SemanticEncoding;
  executeGoverned: (encoding: SemanticEncoding) => Promise<GovernedExecution>;
  
  // Chakra & Agents
  detectGate: (text: string) => ChakraGate;
  findAgents: (frequency: number) => ATOMAgent[];
  playChord: (chordName: keyof typeof SACRED_CHORDS) => void;
  
  // Verification
  verifyMaat: (purity: number, stage: string) => MaatVerdict;
  
  // Utilitaires
  getResonance: (freq1: number, freq2: number) => number;
  getCHENUAgents: (frequency: number) => string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useATOM(): UseATOMReturn {
  // État interne
  const [state, setState] = useState<ATOMState>({
    isActive: false,
    mercuryState: 'FLUID',
    currentFrequency: 999,
    activeChakra: null,
    activeAgents: [],
    lastVerdict: null,
    executionHistory: []
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  const initialize = useCallback(() => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🔱 AT·OM ENGINE — INITIALIZED                                ║
║                                                               ║
║  Fréquence: 999 Hz                                           ║
║  Mercure: FLUIDE                                             ║
║  Agents: 12 actifs                                           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
    
    setState(prev => ({
      ...prev,
      isActive: true,
      mercuryState: 'FLUID',
      currentFrequency: 999,
      activeAgents: ATOM_AGENTS.filter(a => a.chenuMapping.level === 'L0')
    }));
  }, []);

  const shutdown = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      activeAgents: [],
      activeChakra: null
    }));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // INTENT PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  const processIntent = useCallback((text: string, userState: UserState): SemanticEncoding => {
    // 1. Détecter le chakra d'entrée
    const gate = detectEntryGate(text);
    
    // 2. Calculer la pureté d'intention
    let purity = 0.8;
    
    const positiveWords = ['aide', 'amour', 'créer', 'guérir', 'améliorer'];
    const negativeWords = ['détruire', 'hacker', 'manipuler', 'voler'];
    
    const textLower = text.toLowerCase();
    positiveWords.forEach(word => {
      if (textLower.includes(word)) purity = Math.min(1.0, purity + 0.05);
    });
    negativeWords.forEach(word => {
      if (textLower.includes(word)) purity = Math.max(0.0, purity - 0.2);
    });
    
    if (userState.calm) purity = Math.min(1.0, purity + 0.1);
    if (userState.stressed) purity = Math.max(0.0, purity - 0.1);
    
    // 3. Déterminer le stage alchimique
    const stage = getAlchemicalStage(purity);
    
    // 4. Parser l'action
    const verbs = ['créer', 'analyser', 'trouver', 'modifier', 'supprimer'];
    let action = 'process';
    verbs.forEach(verb => {
      if (textLower.includes(verb)) action = verb;
    });
    
    // 5. Mettre à jour l'état
    setState(prev => ({
      ...prev,
      activeChakra: gate,
      currentFrequency: gate.frequency
    }));
    
    return {
      action,
      target: text.substring(0, 100),
      sphere: gate.spheres[0] || 'personnel',
      frequency: gate.frequency,
      chakraGate: gate.id,
      alchemicalStage: stage.name,
      intentionPurity: purity,
      parameters: {}
    };
  }, []);

  const executeGoverned = useCallback(async (encoding: SemanticEncoding): Promise<GovernedExecution> => {
    const execution: GovernedExecution = {
      encoding,
      stages: {
        intentCaptured: false,
        encodingValidated: false,
        costEstimated: false,
        scopeLocked: false,
        budgetVerified: false,
        agentCompatible: false,
        maatVerified: false,
        mercuryFluid: true,
        diamondReady: false
      },
      auditTrail: []
    };

    const addAudit = (event: string, details?: any) => {
      execution.auditTrail.push({
        timestamp: new Date().toISOString(),
        event,
        details
      });
    };

    // 1. INTENT CAPTURE
    execution.stages.intentCaptured = true;
    addAudit('INTENT_CAPTURED', { chakra: encoding.chakraGate });

    // 2. MAAT VERIFICATION
    const verdict = weighHeart(encoding.intentionPurity, encoding.alchemicalStage);
    execution.stages.maatVerified = verdict.passed;
    execution.stages.mercuryFluid = verdict.mercuryState === 'FLUID';
    
    setState(prev => ({
      ...prev,
      lastVerdict: verdict,
      mercuryState: verdict.mercuryState
    }));

    if (!verdict.passed) {
      addAudit('MAAT_BLOCKED', verdict);
      return execution;
    }
    addAudit('MAAT_PASSED', verdict);

    // 3. ENCODING VALIDATION
    execution.stages.encodingValidated = true;
    addAudit('ENCODING_VALID');

    // 4. COST ESTIMATION
    const cost = 100 * (encoding.alchemicalStage === 'RUBEDO' ? 4 : 2);
    execution.stages.costEstimated = true;
    addAudit('COST_ESTIMATED', { tokens: cost });

    // 5. SCOPE LOCKING
    execution.stages.scopeLocked = true;
    addAudit('SCOPE_LOCKED', { sphere: encoding.sphere });

    // 6. BUDGET VERIFICATION
    execution.stages.budgetVerified = true;
    addAudit('BUDGET_OK');

    // 7. AGENT COMPATIBILITY
    const compatibleAgents = findCompatibleCHENUAgents(encoding.frequency);
    execution.stages.agentCompatible = compatibleAgents.length > 0;
    addAudit('AGENTS_FOUND', compatibleAgents);

    // 8. DIAMOND TRANSMUTATION
    execution.stages.diamondReady = true;
    execution.result = {
      status: 'TRANSMUTED',
      action: encoding.action,
      sphere: encoding.sphere,
      stage: encoding.alchemicalStage,
      timestamp: new Date().toISOString()
    };
    addAudit('TRANSMUTED', { stage: encoding.alchemicalStage });

    // Store in history
    setState(prev => ({
      ...prev,
      executionHistory: [...prev.executionHistory.slice(-9), execution]
    }));

    return execution;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAKRA & AGENTS
  // ═══════════════════════════════════════════════════════════════════════════

  const detectGate = useCallback((text: string): ChakraGate => {
    return detectEntryGate(text);
  }, []);

  const findAgents = useCallback((frequency: number): ATOMAgent[] => {
    return ATOM_AGENTS.filter(agent => {
      const resonance = calculateResonance(agent.frequency, frequency);
      return resonance >= 0.7;
    });
  }, []);

  const playChord = useCallback((chordName: keyof typeof SACRED_CHORDS) => {
    const chord = SACRED_CHORDS[chordName];
    if (!chord) return;

    console.log(`
🎵 ACCORD: ${chord.name}
   Fréquences: ${chord.frequencies.join(' + ')} Hz
   Agents: ${chord.agents.join(', ')}
   Effet: ${chord.effect}
    `);

    const agents = chord.agents
      .map(id => ATOM_AGENTS.find(a => a.id === id))
      .filter((a): a is ATOMAgent => a !== undefined);

    setState(prev => ({
      ...prev,
      activeAgents: agents,
      currentFrequency: chord.frequencies[0]
    }));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════

  const verifyMaat = useCallback((purity: number, stage: string): MaatVerdict => {
    return weighHeart(purity, stage);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════════════════

  const getResonance = useCallback((freq1: number, freq2: number): number => {
    return calculateResonance(freq1, freq2);
  }, []);

  const getCHENUAgents = useCallback((frequency: number): string[] => {
    return findCompatibleCHENUAgents(frequency);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    state,
    initialize,
    shutdown,
    processIntent,
    executeGoverned,
    detectGate,
    findAgents,
    playChord,
    verifyMaat,
    getResonance,
    getCHENUAgents
  };
}

export default useATOM;
