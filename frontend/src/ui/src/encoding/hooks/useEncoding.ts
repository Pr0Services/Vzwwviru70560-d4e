/**
 * CHE·NU Encoding Hooks
 * React hooks for encoding operations
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  SemanticEncoding,
  EQSResult,
  ChenuThread,
  AgentEncodingSpec,
  CompatibilityResult,
  EncodingPreset,
  ValidationResult,
} from '../../../../sdk/core/encoding/encoding_types';
import {
  validateEncodingFull,
  computeEQSFull,
  optimizeEncodingFull,
  toBinary,
  checkCompatibility,
  findBestAgent,
  DEFAULT_ENCODING_AGENTS,
  ENCODING_PRESETS,
  createThread,
  estimateTokens,
} from '../../../../sdk/core/encoding';

// ═══════════════════════════════════════════════════════════════════════════
// ENCODING STATE HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseEncodingOptions {
  initialEncoding?: SemanticEncoding;
  autoValidate?: boolean;
  autoOptimize?: boolean;
}

export interface UseEncodingReturn {
  encoding: SemanticEncoding;
  setEncoding: (enc: SemanticEncoding) => void;
  updateField: <K extends keyof SemanticEncoding>(key: K, value: SemanticEncoding[K]) => void;
  validation: ValidationResult;
  isValid: boolean;
  reset: () => void;
  applyPreset: (presetId: string) => void;
}

const DEFAULT_ENCODING: SemanticEncoding = {
  ACT: 'SUM',
  SRC: 'DOC',
  SCOPE: 'SEL',
  MODE: 'ANA',
};

export function useEncoding(options: UseEncodingOptions = {}): UseEncodingReturn {
  const {
    initialEncoding = DEFAULT_ENCODING,
    autoValidate = true,
  } = options;

  const [encoding, setEncodingState] = useState<SemanticEncoding>(initialEncoding);

  const setEncoding = useCallback((enc: SemanticEncoding) => {
    setEncodingState(enc);
  }, []);

  const updateField = useCallback(<K extends keyof SemanticEncoding>(
    key: K,
    value: SemanticEncoding[K]
  ) => {
    setEncodingState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validation = useMemo(() => {
    if (!autoValidate) return { valid: true, errors: [], warnings: [] };
    return validateEncodingFull(encoding);
  }, [encoding, autoValidate]);

  const reset = useCallback(() => {
    setEncodingState(initialEncoding);
  }, [initialEncoding]);

  const applyPreset = useCallback((presetId: string) => {
    const preset = ENCODING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setEncodingState(preset.encoding);
    }
  }, []);

  return {
    encoding,
    setEncoding,
    updateField,
    validation,
    isValid: validation.valid,
    reset,
    applyPreset,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EQS HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseEQSOptions {
  humanText: string;
  encoding: SemanticEncoding;
}

export interface UseEQSReturn {
  eqs: EQSResult | null;
  score: number;
  grade: string;
  emoji: string;
  suggestions: string[];
  savings: { percentage: number; tokensReduced: number };
}

export function useEQS({ humanText, encoding }: UseEQSOptions): UseEQSReturn {
  const result = useMemo(() => {
    if (!humanText) {
      return null;
    }
    const humanTokens = estimateTokens(humanText);
    const encodedTokens = 50; // Estimate
    return computeEQSFull(humanTokens, encodedTokens, encoding);
  }, [humanText, encoding]);

  const savings = useMemo(() => {
    if (!humanText) return { percentage: 0, tokensReduced: 0 };
    const humanTokens = estimateTokens(humanText);
    const encodedTokens = 50;
    return {
      percentage: Math.round(((humanTokens - encodedTokens) / humanTokens) * 100),
      tokensReduced: humanTokens - encodedTokens,
    };
  }, [humanText]);

  return {
    eqs: result,
    score: result?.score ?? 0,
    grade: result?.grade ?? 'unknown',
    emoji: result?.emoji ?? '',
    suggestions: result?.suggestions ?? [],
    savings,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseOptimizationReturn {
  optimize: () => void;
  optimized: SemanticEncoding | null;
  changes: unknown[];
  tokensReduced: number;
  binary: string | null;
  isOptimized: boolean;
}

export function useOptimization(encoding: SemanticEncoding): UseOptimizationReturn {
  const [optimized, setOptimized] = useState<SemanticEncoding | null>(null);
  const [changes, setChanges] = useState<any[]>([]);
  const [tokensReduced, setTokensReduced] = useState(0);

  const optimize = useCallback(() => {
    const result = optimizeEncodingFull(encoding);
    setOptimized(result.optimized);
    setChanges(result.changes);
    setTokensReduced(result.tokensReduced);
  }, [encoding]);

  const binary = useMemo(() => {
    return optimized ? toBinary(optimized) : null;
  }, [optimized]);

  return {
    optimize,
    optimized,
    changes,
    tokensReduced,
    binary,
    isOptimized: optimized !== null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT COMPATIBILITY HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseAgentCompatibilityOptions {
  encoding: SemanticEncoding;
  sphereId?: string;
}

export interface UseAgentCompatibilityReturn {
  agents: AgentEncodingSpec[];
  selectedAgent: AgentEncodingSpec | null;
  selectAgent: (agentId: string) => void;
  compatibility: CompatibilityResult | null;
  isCompatible: boolean;
  bestAgent: AgentEncodingSpec | null;
}

export function useAgentCompatibility({
  encoding,
  sphereId,
}: UseAgentCompatibilityOptions): UseAgentCompatibilityReturn {
  const [selectedAgent, setSelectedAgent] = useState<AgentEncodingSpec | null>(null);

  // Filter agents by sphere
  const agents = useMemo(() => {
    if (!sphereId) return DEFAULT_ENCODING_AGENTS;
    return DEFAULT_ENCODING_AGENTS.filter(
      (a) => !a.sphereIds || a.sphereIds.includes(sphereId)
    );
  }, [sphereId]);

  // Check compatibility with selected agent
  const compatibility = useMemo(() => {
    if (!selectedAgent) return null;
    return checkCompatibility(encoding, selectedAgent);
  }, [encoding, selectedAgent]);

  // Find best agent
  const bestAgent = useMemo(() => {
    const result = findBestAgent(encoding, agents);
    return result?.agent ?? null;
  }, [encoding, agents]);

  const selectAgent = useCallback((agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    setSelectedAgent(agent ?? null);
  }, [agents]);

  return {
    agents,
    selectedAgent,
    selectAgent,
    compatibility,
    isCompatible: compatibility?.compatible ?? false,
    bestAgent,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// THREAD HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseThreadOptions {
  sphereId?: string;
  projectId?: string;
}

export interface UseThreadReturn {
  thread: ChenuThread | null;
  create: (human: string, encoding: SemanticEncoding) => ChenuThread;
  update: (encoding: SemanticEncoding) => void;
  clear: () => void;
}

export function useThread(options: UseThreadOptions = {}): UseThreadReturn {
  const [thread, setThread] = useState<ChenuThread | null>(null);

  const create = useCallback((human: string, encoding: SemanticEncoding) => {
    const newThread = createThread({
      human,
      encoding,
      sphereId: options.sphereId,
      projectId: options.projectId,
    });
    setThread(newThread);
    return newThread;
  }, [options.sphereId, options.projectId]);

  const update = useCallback((encoding: SemanticEncoding) => {
    if (!thread) return;
    // Import would be needed here
    // setThread(updateThreadEncoding(thread, encoding));
  }, [thread]);

  const clear = useCallback(() => {
    setThread(null);
  }, []);

  return {
    thread,
    create,
    update,
    clear,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESETS HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UsePresetsOptions {
  sphereId?: string;
  expertMode?: boolean;
  category?: string;
}

export interface UsePresetsReturn {
  presets: EncodingPreset[];
  search: (query: string) => void;
  searchQuery: string;
  categories: string[];
  filterByCategory: (category: string | null) => void;
  activeCategory: string | null;
}

export function usePresets(options: UsePresetsOptions = {}): UsePresetsReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const presets = useMemo(() => {
    let filtered = [...ENCODING_PRESETS];

    // Filter by sphere
    if (options.sphereId) {
      filtered = filtered.filter(
        (p) => !p.sphereIds || p.sphereIds.includes(options.sphereId!)
      );
    }

    // Filter by expert mode
    if (options.expertMode === false) {
      filtered = filtered.filter(
        (p) => p.level === 'beginner' || p.level === 'intermediate'
      );
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.label.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [options.sphereId, options.expertMode, activeCategory, searchQuery]);

  const categories = useMemo(() => {
    return [...new Set(ENCODING_PRESETS.map((p) => p.category))];
  }, []);

  return {
    presets,
    search: setSearchQuery,
    searchQuery,
    categories,
    filterByCategory: setActiveCategory,
    activeCategory,
  };
}
