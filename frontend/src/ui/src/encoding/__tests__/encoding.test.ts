/**
 * CHE·NU Encoding SDK Tests
 * Comprehensive test suite for semantic encoding system
 */

import {
  // Types
  SemanticEncoding,
  AgentEncodingSpec,
  ChenuThread,
  ThreadSummary,
  EQSResult,
  ValidationResult,
  OptimizationResult,
  ExecutionResult,
  
  // Functions
  validateEncoding,
  computeEQS,
  computeEQSFull,
  optimizeEncoding,
  optimizeEncodingFull,
  toBinary,
  fromBinary,
  estimateTokens,
  createThread,
  getThread,
  updateThread,
  listThreads,
  getThreadSummary,
  filterThreads,
  sortThreads,
  checkCompatibility,
  findCompatibleAgents,
  
  // Constants
  DEFAULT_ENCODING_AGENTS,
  ENCODING_PRESETS,
  SPHERE_PRESETS,
  
  // Presets
  getPreset,
  listPresets,
  createCustomPreset,
} from '../../../../sdk/core/encoding';

describe('Encoding Types', () => {
  test('SemanticEncoding has required fields', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    expect(encoding.ACT).toBe('SUM');
    expect(encoding.SRC).toBe('DOC');
    expect(encoding.SCOPE).toBe('SEL');
    expect(encoding.MODE).toBe('ANA');
  });

  test('SemanticEncoding optional fields', () => {
    const encoding: SemanticEncoding = {
      ACT: 'ANA',
      SRC: 'MTG',
      SCOPE: 'LOCK',
      MODE: 'CHECK',
      FOCUS: ['RISK', 'DEC', 'NEXT'],
      OUT: 'MD',
      LEN: 'M',
      RW: 1,
      UNC: 1,
      SENS: 1,
      TRACE: 1,
    };
    
    expect(encoding.FOCUS).toHaveLength(3);
    expect(encoding.OUT).toBe('MD');
    expect(encoding.SENS).toBe(1);
  });
});

describe('Validation', () => {
  test('validates correct encoding', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      FOCUS: ['RISK'],
    };
    
    const result = validateEncoding(encoding);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects invalid ACT', () => {
    const encoding: SemanticEncoding = {
      ACT: 'INVALID' as any,
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const result = validateEncoding(encoding);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('ACT'))).toBe(true);
  });

  test('rejects RW=1 in ANA mode', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      RW: 1,
    };
    
    const result = validateEncoding(encoding);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('RW'))).toBe(true);
  });

  test('warns SENS=1 without LOCK scope', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      SENS: 1,
    };
    
    const result = validateEncoding(encoding);
    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes('SENS'))).toBe(true);
  });

  test('warns too many FOCUS items', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      FOCUS: ['RISK', 'DEC', 'NEXT', 'OPP', 'GAP', 'CONS'],
    };
    
    const result = validateEncoding(encoding);
    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes('FOCUS'))).toBe(true);
  });
});

describe('EQS Computation', () => {
  test('computes basic EQS', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      FOCUS: ['RISK', 'NEXT'],
    };
    
    const score = computeEQS(1000, 100, encoding);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('computes full EQS with breakdown', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'LOCK',
      MODE: 'CHECK',
      FOCUS: ['RISK', 'NEXT'],
      TRACE: 1,
    };
    
    const result = computeEQSFull(1000, 100, encoding);
    expect(result.score).toBeGreaterThan(0);
    expect(result.grade).toBeDefined();
    expect(result.emoji).toBeDefined();
    expect(result.breakdown.compression).toBeGreaterThan(0);
    expect(result.breakdown.scopeControl).toBeGreaterThan(0);
    expect(result.breakdown.focusClarity).toBeGreaterThan(0);
    expect(result.breakdown.riskManagement).toBeGreaterThan(0);
  });

  test('higher compression ratio = higher score', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const highCompression = computeEQS(1000, 50, encoding);
    const lowCompression = computeEQS(1000, 500, encoding);
    
    expect(highCompression).toBeGreaterThan(lowCompression);
  });

  test('LOCK scope improves score', () => {
    const base: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const locked: SemanticEncoding = {
      ...base,
      SCOPE: 'LOCK',
    };
    
    const baseScore = computeEQS(1000, 100, base);
    const lockedScore = computeEQS(1000, 100, locked);
    
    expect(lockedScore).toBeGreaterThan(baseScore);
  });

  test('optimal FOCUS count (2-3) gives best score', () => {
    const base: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const noFocus = computeEQSFull(1000, 100, { ...base, FOCUS: [] });
    const twoFocus = computeEQSFull(1000, 100, { ...base, FOCUS: ['RISK', 'NEXT'] });
    const manyFocus = computeEQSFull(1000, 100, { ...base, FOCUS: ['RISK', 'NEXT', 'DEC', 'OPP', 'GAP'] });
    
    expect(twoFocus.breakdown.focusClarity).toBeGreaterThan(noFocus.breakdown.focusClarity);
    expect(twoFocus.breakdown.focusClarity).toBeGreaterThan(manyFocus.breakdown.focusClarity);
  });

  test('TRACE improves risk management score', () => {
    const base: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const withTrace: SemanticEncoding = {
      ...base,
      TRACE: 1,
    };
    
    const baseResult = computeEQSFull(1000, 100, base);
    const traceResult = computeEQSFull(1000, 100, withTrace);
    
    expect(traceResult.breakdown.riskManagement).toBeGreaterThan(baseResult.breakdown.riskManagement);
  });
});

describe('Optimization', () => {
  test('optimizes encoding', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'SEL',
      SCOPE: 'DOC',
      MODE: 'ANA',
      FOCUS: ['RISK', 'NEXT', 'DEC', 'OPP', 'GAP'],
      LEN: 'AUTO',
    };
    
    const optimized = optimizeEncoding(encoding);
    
    // Should tighten scope
    expect(optimized.SCOPE).toBe('SEL');
    // Should limit FOCUS to 3
    expect(optimized.FOCUS?.length).toBeLessThanOrEqual(3);
    // Should remove AUTO LEN
    expect(optimized.LEN).toBeUndefined();
  });

  test('full optimization returns changes', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'SEL',
      SCOPE: 'DOC',
      MODE: 'ANA',
      SENS: 1,
    };
    
    const result = optimizeEncodingFull(encoding);
    
    expect(result.optimized).toBeDefined();
    expect(result.changes).toBeInstanceOf(Array);
    expect(result.tokensReduced).toBeGreaterThanOrEqual(0);
    // Should add TRACE for SENS=1
    expect(result.optimized.TRACE).toBe(1);
  });

  test('optimization preserves essential flags', () => {
    const encoding: SemanticEncoding = {
      ACT: 'GEN',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'DRAFT',
      RW: 1,
      SENS: 1,
    };
    
    const optimized = optimizeEncoding(encoding);
    
    expect(optimized.RW).toBe(1);
    expect(optimized.SENS).toBe(1);
  });
});

describe('Binary Encoding', () => {
  test('converts to binary', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      FOCUS: ['RISK', 'NEXT'],
    };
    
    const binary = toBinary(encoding);
    
    expect(binary).toMatch(/^E/); // Version marker
    expect(binary.length).toBeGreaterThan(5);
  });

  test('roundtrip encoding', () => {
    const encoding: SemanticEncoding = {
      ACT: 'ANA',
      SRC: 'MTG',
      SCOPE: 'LOCK',
      MODE: 'CHECK',
      FOCUS: ['RISK', 'DEC'],
      RW: 1,
      TRACE: 1,
    };
    
    const binary = toBinary(encoding);
    const decoded = fromBinary(binary);
    
    expect(decoded.ACT).toBe(encoding.ACT);
    expect(decoded.SRC).toBe(encoding.SRC);
    expect(decoded.SCOPE).toBe(encoding.SCOPE);
    expect(decoded.MODE).toBe(encoding.MODE);
    expect(decoded.RW).toBe(encoding.RW);
    expect(decoded.TRACE).toBe(encoding.TRACE);
  });

  test('binary is compact', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
      FOCUS: ['RISK', 'NEXT', 'DEC'],
      RW: 1,
      UNC: 1,
      SENS: 1,
      TRACE: 1,
    };
    
    const json = JSON.stringify(encoding);
    const binary = toBinary(encoding);
    
    expect(binary.length).toBeLessThan(json.length);
  });
});

describe('Thread Management', () => {
  test('creates thread', () => {
    const thread = createThread({
      human: 'Analyze project risks and provide recommendations',
      encoding: {
        ACT: 'ANA',
        SRC: 'DOC',
        SCOPE: 'SEL',
        MODE: 'ANA',
        FOCUS: ['RISK', 'NEXT'],
      },
      sphereId: 'construction',
    });
    
    expect(thread.id).toMatch(/^thread_/);
    expect(thread.human).toBeDefined();
    expect(thread.encoded).toBeDefined();
    expect(thread.eqs).toBeGreaterThan(0);
    expect(thread.state).toBe('draft');
    expect(thread.versions).toHaveLength(1);
  });

  test('retrieves thread', () => {
    const created = createThread({
      human: 'Test thread',
      encoding: {
        ACT: 'SUM',
        SRC: 'DOC',
        SCOPE: 'SEL',
        MODE: 'ANA',
      },
    });
    
    const retrieved = getThread(created.id);
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
  });

  test('updates thread', () => {
    const thread = createThread({
      human: 'Test thread',
      encoding: {
        ACT: 'SUM',
        SRC: 'DOC',
        SCOPE: 'SEL',
        MODE: 'ANA',
      },
    });
    
    const updated = updateThread(thread.id, {
      state: 'analyzed',
      tags: ['important'],
    });
    
    expect(updated?.state).toBe('analyzed');
    expect(updated?.tags).toContain('important');
    expect(updated?.versions.length).toBeGreaterThan(1);
  });

  test('lists threads with filters', () => {
    // Create test threads
    createThread({
      human: 'Thread 1',
      encoding: { ACT: 'SUM', SRC: 'DOC', SCOPE: 'SEL', MODE: 'ANA' },
      sphereId: 'construction',
    });
    
    createThread({
      human: 'Thread 2',
      encoding: { ACT: 'ANA', SRC: 'MTG', SCOPE: 'SEL', MODE: 'ANA' },
      sphereId: 'finance',
    });
    
    const constructionThreads = listThreads({ sphereId: 'construction' });
    expect(constructionThreads.every(t => t.sphereId === 'construction')).toBe(true);
  });

  test('gets thread summary', () => {
    const thread = createThread({
      human: 'Test thread',
      encoding: { ACT: 'SUM', SRC: 'DOC', SCOPE: 'SEL', MODE: 'ANA' },
    });
    
    const summary = getThreadSummary(thread);
    
    expect(summary.id).toBe(thread.id);
    expect(summary.state).toBe(thread.state);
    expect(summary.eqs).toBe(thread.eqs);
    expect(summary.versions).toBe(thread.versions.length);
  });
});

describe('Agent Compatibility', () => {
  test('checks agent compatibility', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const agent: AgentEncodingSpec = {
      id: 'test-agent',
      name: 'Test Agent',
      actions: ['SUM', 'EXT'],
      sources: ['DOC', 'SEL'],
      encodingLevel: 'L1',
    };
    
    const result = checkCompatibility(encoding, agent);
    expect(result.compatible).toBe(true);
  });

  test('rejects incompatible action', () => {
    const encoding: SemanticEncoding = {
      ACT: 'GEN',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const agent: AgentEncodingSpec = {
      id: 'test-agent',
      name: 'Test Agent',
      actions: ['SUM', 'EXT'],
      sources: ['DOC'],
      encodingLevel: 'L1',
    };
    
    const result = checkCompatibility(encoding, agent);
    expect(result.compatible).toBe(false);
    expect(result.issues.some(i => i.field === 'ACT')).toBe(true);
  });

  test('finds compatible agents', () => {
    const encoding: SemanticEncoding = {
      ACT: 'SUM',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'ANA',
    };
    
    const agents = findCompatibleAgents(encoding);
    
    expect(agents.length).toBeGreaterThan(0);
    agents.forEach(agent => {
      const compat = checkCompatibility(encoding, agent);
      expect(compat.compatible).toBe(true);
    });
  });

  test('filters agents by sphere', () => {
    const encoding: SemanticEncoding = {
      ACT: 'VER',
      SRC: 'DOC',
      SCOPE: 'SEL',
      MODE: 'CHECK',
    };
    
    const agents = findCompatibleAgents(encoding, 'construction');
    
    expect(agents.length).toBeGreaterThan(0);
    agents.forEach(agent => {
      expect(agent.sphere).toBe('construction');
    });
  });
});

describe('Presets', () => {
  test('gets preset by name', () => {
    const preset = getPreset('quick-summary');
    
    expect(preset).toBeDefined();
    expect(preset?.name).toBe('quick-summary');
    expect(preset?.encoding.ACT).toBeDefined();
  });

  test('lists all presets', () => {
    const presets = listPresets();
    
    expect(presets.length).toBeGreaterThan(0);
    expect(presets.every(p => p.name && p.encoding)).toBe(true);
  });

  test('lists presets by sphere', () => {
    const presets = listPresets('construction');
    
    expect(presets.length).toBeGreaterThan(0);
    expect(presets.every(p => p.sphere === 'construction' || !p.sphere)).toBe(true);
  });

  test('creates custom preset', () => {
    const custom = createCustomPreset('my-preset', {
      ACT: 'ANA',
      SRC: 'MTG',
      SCOPE: 'LOCK',
      MODE: 'CHECK',
      FOCUS: ['RISK', 'DEC'],
    }, {
      description: 'Custom analysis preset',
      sphere: 'construction',
    });
    
    expect(custom.name).toBe('my-preset');
    expect(custom.encoding.ACT).toBe('ANA');
    expect(custom.description).toBe('Custom analysis preset');
  });
});

describe('Token Estimation', () => {
  test('estimates tokens', () => {
    const text = 'This is a test message with some content.';
    const tokens = estimateTokens(text);
    
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(text.length);
  });

  test('empty string returns 0', () => {
    expect(estimateTokens('')).toBe(0);
  });

  test('longer text = more tokens', () => {
    const short = 'Short text.';
    const long = 'This is a much longer piece of text that should require more tokens to encode properly.';
    
    expect(estimateTokens(long)).toBeGreaterThan(estimateTokens(short));
  });
});

describe('Integration', () => {
  test('full workflow: create, optimize, validate, save', () => {
    // 1. Start with human intent
    const human = 'Review the meeting notes and extract key decisions with associated risks';
    
    // 2. Get a preset
    const preset = getPreset('meeting-analysis');
    expect(preset).toBeDefined();
    
    // 3. Customize encoding
    const encoding: SemanticEncoding = {
      ...preset!.encoding,
      FOCUS: ['DEC', 'RISK', 'NEXT'],
      TRACE: 1,
    };
    
    // 4. Validate
    const validation = validateEncoding(encoding);
    expect(validation.valid).toBe(true);
    
    // 5. Optimize
    const optimized = optimizeEncodingFull(encoding);
    expect(optimized.optimized).toBeDefined();
    
    // 6. Compute EQS
    const eqs = computeEQSFull(estimateTokens(human), 50, optimized.optimized);
    expect(eqs.score).toBeGreaterThan(50);
    
    // 7. Find compatible agents
    const agents = findCompatibleAgents(optimized.optimized);
    expect(agents.length).toBeGreaterThan(0);
    
    // 8. Create thread
    const thread = createThread({
      human,
      encoding: optimized.optimized,
      sphereId: 'construction',
    });
    
    expect(thread.id).toBeDefined();
    expect(thread.eqs).toBeGreaterThan(0);
    expect(thread.binary).toBeDefined();
    
    // 9. Get binary representation
    const binary = toBinary(optimized.optimized);
    expect(binary.length).toBeLessThan(20);
  });

  test('governance: LOCK scope with SENS=1', () => {
    const encoding: SemanticEncoding = {
      ACT: 'VER',
      SRC: 'DOC',
      SCOPE: 'LOCK',
      MODE: 'CHECK',
      SENS: 1,
      TRACE: 1,
    };
    
    // Should be valid
    const validation = validateEncoding(encoding);
    expect(validation.valid).toBe(true);
    expect(validation.warnings).toHaveLength(0);
    
    // Should have high EQS
    const eqs = computeEQSFull(1000, 50, encoding);
    expect(eqs.score).toBeGreaterThan(70);
    expect(eqs.breakdown.scopeControl).toBeGreaterThan(80);
    expect(eqs.breakdown.riskManagement).toBeGreaterThan(80);
  });
});
