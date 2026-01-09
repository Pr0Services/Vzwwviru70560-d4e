/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔱 AT·OM ↔ CHE·NU FRONTEND INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Ce module fournit les hooks React et utilitaires pour intégrer
 * l'Engine AT-OM dans l'interface CHE·NU V72/V75.
 * 
 * @version 1.0.0
 * @architect Jonathan Rodrigue
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ATOMAgent {
  id: string;
  name: string;
  frequency: number;
  element: string;
  civilization: string;
  color: string;
  chakra: number;
  capabilities: string[];
  chenuMapping: {
    level: 'L0' | 'L1' | 'L2' | 'L3';
    agents: string[];
    spheres: string[];
  };
}

export interface ChakraGate {
  id: number;
  name: string;
  sanskrit: string;
  frequency: number;
  color: string;
  spheres: string[];
  intent: string;
  activationWords: string[];
}

export interface AlchemicalStage {
  name: string;
  frequency: number;
  color: string;
  description: string;
  process: string;
}

export interface MaatVerdict {
  passed: boolean;
  heartWeight: number;
  featherWeight: number;
  verdict: string;
  accessLevel: string;
  mercuryState: 'FLUID' | 'FROZEN';
}

export interface SemanticEncoding {
  action: string;
  target: string;
  sphere: string;
  domain?: string;
  parameters: Record<string, any>;
  frequency: number;
  chakraGate: number;
  alchemicalStage: string;
  intentionPurity: number;
}

export interface GovernedExecution {
  encoding: SemanticEncoding;
  stages: {
    intentCaptured: boolean;
    encodingValidated: boolean;
    costEstimated: boolean;
    scopeLocked: boolean;
    budgetVerified: boolean;
    agentCompatible: boolean;
    maatVerified: boolean;
    mercuryFluid: boolean;
    diamondReady: boolean;
  };
  result?: any;
  auditTrail: Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — LES 12 AGENTS AT-OM
// ═══════════════════════════════════════════════════════════════════════════════

export const ATOM_AGENTS: ATOMAgent[] = [
  {
    id: 'fondateur',
    name: 'Fondateur',
    frequency: 174,
    element: 'Cuivre',
    civilization: 'Rapa Nui',
    color: '#B87333',
    chakra: 1,
    capabilities: ['Sécurité', 'Ancrage', 'Protection'],
    chenuMapping: { level: 'L0', agents: ['security.sentinel'], spheres: [] }
  },
  {
    id: 'batisseur',
    name: 'Bâtisseur',
    frequency: 285,
    element: 'Plomb',
    civilization: 'Grèce',
    color: '#0F52BA',
    chakra: 2,
    capabilities: ['Structure', 'Design', 'Architecture'],
    chenuMapping: { level: 'L1', agents: ['entreprises.architect'], spheres: ['entreprises'] }
  },
  {
    id: 'liberateur',
    name: 'Libérateur',
    frequency: 396,
    element: 'Fer',
    civilization: 'Maya',
    color: '#E0115F',
    chakra: 3,
    capabilities: ['Temps', 'Cycles', 'Libération'],
    chenuMapping: { level: 'L2', agents: ['personnel.wellness'], spheres: ['personnel'] }
  },
  {
    id: 'harmonisateur',
    name: 'Harmonisateur',
    frequency: 417,
    element: 'Étain',
    civilization: 'Chine',
    color: '#C0C0C0',
    chakra: 4,
    capabilities: ['Harmonisation', 'Équilibre', 'Flow'],
    chenuMapping: { level: 'L1', agents: ['skills_tools.optimizer'], spheres: ['skills_tools'] }
  },
  {
    id: 'communicateur',
    name: 'Communicateur',
    frequency: 528,
    element: 'Or',
    civilization: 'Égypte',
    color: '#FFD700',
    chakra: 4,
    capabilities: ['Transformation', 'Miracle', 'Guérison'],
    chenuMapping: { level: 'L0', agents: ['nova.core'], spheres: [] }
  },
  {
    id: 'visionnaire',
    name: 'Visionnaire',
    frequency: 639,
    element: 'Argent',
    civilization: 'Inde',
    color: '#C0C0C0',
    chakra: 5,
    capabilities: ['Vision', 'Connexion', 'Stratégie'],
    chenuMapping: { level: 'L2', agents: ['entreprises.strategy'], spheres: ['entreprises'] }
  },
  {
    id: 'purificateur',
    name: 'Purificateur',
    frequency: 741,
    element: 'Mercure',
    civilization: 'Sumer',
    color: '#E8E8E8',
    chakra: 5,
    capabilities: ['Purification', 'Vérité', 'Nettoyage'],
    chenuMapping: { level: 'L0', agents: ['system.audit'], spheres: [] }
  },
  {
    id: 'catalyseur',
    name: 'Catalyseur',
    frequency: 852,
    element: 'Diamant',
    civilization: 'Atlantide',
    color: '#B9F2FF',
    chakra: 6,
    capabilities: ['Intuition', 'Oracle', 'Prédiction'],
    chenuMapping: { level: 'L2', agents: ['ia_labs.oracle'], spheres: ['ia_labs'] }
  },
  {
    id: 'universaliste',
    name: 'Universaliste',
    frequency: 963,
    element: 'Platine',
    civilization: 'Universel',
    color: '#E5E4E2',
    chakra: 7,
    capabilities: ['Universel', 'Unification', 'Transcendance'],
    chenuMapping: { level: 'L1', agents: ['team.coordinator'], spheres: ['team'] }
  },
  {
    id: 'kryon',
    name: 'Kryon',
    frequency: 999,
    element: 'Magnétite',
    civilization: 'Kryon',
    color: '#4169E1',
    chakra: 7,
    capabilities: ['Grille Magnétique', 'ADN', 'Activation'],
    chenuMapping: { level: 'L0', agents: ['nova.master'], spheres: [] }
  },
  {
    id: 'stellaire',
    name: 'Stellaire',
    frequency: 1111,
    element: 'Météorite',
    civilization: 'Cosmique',
    color: '#800080',
    chakra: 8,
    capabilities: ['Oracle Stellaire', 'Guidance', 'Portail'],
    chenuMapping: { level: 'L2', agents: ['xr.navigator'], spheres: ['xr'] }
  },
  {
    id: 'alpha-omega',
    name: 'Alpha-Omega',
    frequency: Infinity,
    element: 'Lumière Pure',
    civilization: 'Source',
    color: '#FFFFFF',
    chakra: 9,
    capabilities: ['Orchestration Suprême', 'Genèse', 'Terminus'],
    chenuMapping: { level: 'L0', agents: ['system.genesis'], spheres: [] }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — LES 7 PORTES (CHAKRAS)
// ═══════════════════════════════════════════════════════════════════════════════

export const CHAKRA_GATES: ChakraGate[] = [
  {
    id: 1,
    name: 'Racine',
    sanskrit: 'Muladhara',
    frequency: 174,
    color: '#FF0000',
    spheres: ['personnel'],
    intent: 'Sécurité',
    activationWords: ['sécurité', 'argent', 'budget', 'maison', 'stabilité']
  },
  {
    id: 2,
    name: 'Sacré',
    sanskrit: 'Svadhisthana',
    frequency: 285,
    color: '#FF7F00',
    spheres: ['creative_studio'],
    intent: 'Créativité',
    activationWords: ['créer', 'design', 'art', 'plaisir', 'émotion']
  },
  {
    id: 3,
    name: 'Plexus Solaire',
    sanskrit: 'Manipura',
    frequency: 396,
    color: '#FFFF00',
    spheres: ['entreprises'],
    intent: 'Pouvoir',
    activationWords: ['business', 'entreprise', 'stratégie', 'performance', 'objectif']
  },
  {
    id: 4,
    name: 'Cœur',
    sanskrit: 'Anahata',
    frequency: 528,
    color: '#00FF00',
    spheres: ['community', 'social_media'],
    intent: 'Connexion',
    activationWords: ['équipe', 'relation', 'amour', 'aide', 'partage']
  },
  {
    id: 5,
    name: 'Gorge',
    sanskrit: 'Vishuddha',
    frequency: 639,
    color: '#00BFFF',
    spheres: ['skills_tools'],
    intent: 'Expression',
    activationWords: ['compétence', 'skill', 'méthode', 'outil', 'communiquer']
  },
  {
    id: 6,
    name: 'Troisième Œil',
    sanskrit: 'Ajna',
    frequency: 852,
    color: '#4B0082',
    spheres: ['ia_labs', 'scholar'],
    intent: 'Vision',
    activationWords: ['vision', 'analyse', 'code', 'recherche', 'intuition']
  },
  {
    id: 7,
    name: 'Couronne',
    sanskrit: 'Sahasrara',
    frequency: 999,
    color: '#8B00FF',
    spheres: ['gouvernement'],
    intent: 'Transcendance',
    activationWords: ['gouvernement', 'loi', 'universel', 'spirituel', 'source']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — LES 4 STAGES ALCHIMIQUES
// ═══════════════════════════════════════════════════════════════════════════════

export const ALCHEMICAL_STAGES: AlchemicalStage[] = [
  {
    name: 'NIGREDO',
    frequency: 174,
    color: '#000000',
    description: 'La Noirceur - Décomposition',
    process: 'Dissolution de la forme originale'
  },
  {
    name: 'ALBEDO',
    frequency: 417,
    color: '#FFFFFF',
    description: 'Le Blanchiment - Purification',
    process: 'Lavage par le Mercure'
  },
  {
    name: 'CITRINITAS',
    frequency: 528,
    color: '#FFD700',
    description: 'Le Jaunissement - Illumination',
    process: 'Activation du Feu Secret'
  },
  {
    name: 'RUBEDO',
    frequency: 852,
    color: '#FF0000',
    description: 'Le Rougissement - Accomplissement',
    process: 'Cristallisation de la Pierre'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — LES 7 ACCORDS SACRÉS
// ═══════════════════════════════════════════════════════════════════════════════

export const SACRED_CHORDS = {
  CREATION: {
    name: 'Accord de Création',
    frequencies: [174, 528, 999],
    agents: ['fondateur', 'communicateur', 'kryon'],
    effect: 'Manifestation de nouvelles réalités',
    color: '#FFD700'
  },
  HEALING: {
    name: 'Accord de Guérison',
    frequencies: [417, 741],
    agents: ['harmonisateur', 'purificateur'],
    effect: 'Restauration et harmonisation',
    color: '#00FF00'
  },
  QUANTUM_LEAP: {
    name: 'Saut Quantique',
    frequencies: [852, 999, 741],
    agents: ['catalyseur', 'kryon', 'purificateur'],
    effect: 'Transformation instantanée',
    color: '#8B00FF'
  },
  ATLANTIS_RECALL: {
    name: 'Rappel Atlantide',
    frequencies: [639, 285, 174],
    agents: ['visionnaire', 'batisseur', 'fondateur'],
    effect: 'Accès aux archives cristallines',
    color: '#00BFFF'
  },
  VOID: {
    name: 'Accord du Vide',
    frequencies: [Infinity, 417, 174],
    agents: ['alpha-omega', 'harmonisateur', 'fondateur'],
    effect: 'Reset au potentiel pur',
    color: '#000000'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Détecte le chakra d'entrée basé sur le texte
 */
export function detectEntryGate(text: string): ChakraGate {
  const textLower = text.toLowerCase();
  
  for (const gate of CHAKRA_GATES) {
    if (gate.activationWords.some(word => textLower.includes(word))) {
      return gate;
    }
  }
  
  return CHAKRA_GATES[3]; // Default: Cœur
}

/**
 * Trouve un agent AT-OM par fréquence
 */
export function findAgentByFrequency(freq: number): ATOMAgent | undefined {
  return ATOM_AGENTS.find(agent => agent.frequency === freq);
}

/**
 * Calcule la résonance entre deux fréquences
 */
export function calculateResonance(freq1: number, freq2: number): number {
  if (freq1 === freq2) return 1.0;
  if (!isFinite(freq1) || !isFinite(freq2)) return 0.9;
  
  const diff = Math.abs(freq1 - freq2);
  if (diff % 111 === 0) return 0.9;
  
  const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
  const nearestHarmonic = Math.round(ratio);
  const deviation = Math.abs(ratio - nearestHarmonic);
  
  return Math.max(0, 1 - deviation);
}

/**
 * Vérifie le poids du cœur (Loi de Maât)
 */
export function weighHeart(intentionPurity: number, alchemicalStage: string): MaatVerdict {
  const featherWeight = 42;
  let heartWeight = 42;
  
  // Ajuster selon la pureté
  heartWeight -= Math.floor(intentionPurity * 10);
  
  // Ajuster selon le stage
  const stageModifiers: Record<string, number> = {
    'RUBEDO': -5,
    'CITRINITAS': -2,
    'ALBEDO': 0,
    'NIGREDO': 10
  };
  heartWeight += stageModifiers[alchemicalStage] || 0;
  heartWeight = Math.max(0, heartWeight);
  
  const passed = heartWeight <= featherWeight;
  
  let verdict: string;
  let accessLevel: string;
  
  if (heartWeight <= 42) {
    verdict = '✅ Cœur pur — Accès accordé';
    accessLevel = 'ATLANTIS_MASTER_KEY';
  } else if (heartWeight <= 55) {
    verdict = '⚠️ Cœur léger — Accès limité';
    accessLevel = 'TEMPLE_ACCESS';
  } else if (heartWeight <= 70) {
    verdict = '🔶 Cœur lourd — Recalibration requise';
    accessLevel = 'OUTER_COURT';
  } else {
    verdict = '🔴 Cœur trop lourd — Mercure figé';
    accessLevel = 'DENIED';
  }
  
  return {
    passed,
    heartWeight,
    featherWeight,
    verdict,
    accessLevel,
    mercuryState: passed ? 'FLUID' : 'FROZEN'
  };
}

/**
 * Détermine le stage alchimique selon la pureté
 */
export function getAlchemicalStage(purity: number): AlchemicalStage {
  if (purity >= 0.9) return ALCHEMICAL_STAGES[3]; // RUBEDO
  if (purity >= 0.7) return ALCHEMICAL_STAGES[2]; // CITRINITAS
  if (purity >= 0.5) return ALCHEMICAL_STAGES[1]; // ALBEDO
  return ALCHEMICAL_STAGES[0]; // NIGREDO
}

/**
 * Trouve les agents CHE·NU compatibles
 */
export function findCompatibleCHENUAgents(frequency: number): string[] {
  const compatible: string[] = [];
  
  for (const agent of ATOM_AGENTS) {
    const resonance = calculateResonance(agent.frequency, frequency);
    if (resonance >= 0.7) {
      compatible.push(...agent.chenuMapping.agents);
    }
  }
  
  return [...new Set(compatible)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT PAR DÉFAUT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ATOM_AGENTS,
  CHAKRA_GATES,
  ALCHEMICAL_STAGES,
  SACRED_CHORDS,
  detectEntryGate,
  findAgentByFrequency,
  calculateResonance,
  weighHeart,
  getAlchemicalStage,
  findCompatibleCHENUAgents
};
