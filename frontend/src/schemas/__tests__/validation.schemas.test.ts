// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — ZOD SCHEMA VALIDATION TESTS
// Sprint 4: Tests for runtime type validation
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  SphereIdSchema,
  SphereSchema,
  SpheresArraySchema,
  BureauSectionIdSchema,
  BureauSectionKeySchema,
  BureauSectionSchema,
  BureauSectionsArraySchema,
  AgentSchema,
  NovaSchema,
  ThreadSchema,
  TokenBudgetSchema,
  GovernanceStatusSchema,
  UserSchema,
  LoginRequestSchema,
  EncodingResultSchema,
  ChenuColorSchema,
  CHENU_COLORS,
  validateSpheresCount,
  validateBureauSectionsCount,
  validateNova,
} from '../validation.schemas';

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE SCHEMA TESTS (9 SPHERES - FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Schemas', () => {
  describe('SphereIdSchema', () => {
    it('should accept valid sphere IDs', () => {
      const validIds = ['personal', 'business', 'government', 'creative', 
                       'community', 'social', 'entertainment', 'my_team', 'scholar'];
      
      validIds.forEach(id => {
        expect(() => SphereIdSchema.parse(id)).not.toThrow();
      });
    });

    it('should reject invalid sphere IDs', () => {
      expect(() => SphereIdSchema.parse('invalid')).toThrow();
      expect(() => SphereIdSchema.parse('scholars')).toThrow();
      expect(() => SphereIdSchema.parse('skills')).toThrow();
    });

    it('should have exactly 9 valid values', () => {
      const validValues = SphereIdSchema.options;
      expect(validValues.length).toBe(9);
    });

    it('should include scholar as 9th sphere', () => {
      expect(SphereIdSchema.options).toContain('scholar');
    });
  });

  describe('SphereSchema', () => {
    it('should validate a valid sphere', () => {
      const validSphere = {
        id: 'personal',
        name: 'Personal',
        nameFr: 'Personnel',
        icon: '🏠',
        color: '#D8B26A',
        route: '/personal',
        description: 'Personal sphere',
        order: 1,
        isUnlocked: true,
      };

      expect(() => SphereSchema.parse(validSphere)).not.toThrow();
    });

    it('should reject invalid hex color', () => {
      const invalidSphere = {
        id: 'personal',
        name: 'Personal',
        nameFr: 'Personnel',
        icon: '🏠',
        color: 'not-a-color',
        route: '/personal',
        description: 'Personal sphere',
        order: 1,
      };

      expect(() => SphereSchema.parse(invalidSphere)).toThrow();
    });

    it('should reject order outside 1-9', () => {
      const invalidSphere = {
        id: 'personal',
        name: 'Personal',
        nameFr: 'Personnel',
        icon: '🏠',
        color: '#D8B26A',
        route: '/personal',
        description: 'Personal sphere',
        order: 10, // Invalid - max is 9
      };

      expect(() => SphereSchema.parse(invalidSphere)).toThrow();
    });
  });

  describe('SpheresArraySchema', () => {
    it('should require exactly 9 spheres', () => {
      const spheres = Array(9).fill(null).map((_, i) => ({
        id: ['personal', 'business', 'government', 'creative', 
             'community', 'social', 'entertainment', 'my_team', 'scholar'][i],
        name: `Sphere ${i}`,
        nameFr: `Sphère ${i}`,
        icon: '🔵',
        color: '#D8B26A',
        route: `/sphere${i}`,
        description: 'Description',
        order: i + 1,
        isUnlocked: true,
      }));

      expect(() => SpheresArraySchema.parse(spheres)).not.toThrow();
    });

    it('should reject 8 spheres', () => {
      const spheres = Array(8).fill(null).map((_, i) => ({
        id: ['personal', 'business', 'government', 'creative', 
             'community', 'social', 'entertainment', 'team'][i],
        name: `Sphere ${i}`,
        nameFr: `Sphère ${i}`,
        icon: '🔵',
        color: '#D8B26A',
        route: `/sphere${i}`,
        description: 'Description',
        order: i + 1,
        isUnlocked: true,
      }));

      expect(() => SpheresArraySchema.parse(spheres)).toThrow();
    });

    it('should reject 10 spheres', () => {
      expect(() => validateSpheresCount(Array(10).fill({}))).toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION SCHEMA TESTS (6 SECTIONS - HARD LIMIT)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Section Schemas', () => {
  describe('BureauSectionIdSchema', () => {
    it('should accept valid section IDs', () => {
      const validIds = ['QUICK_CAPTURE', 'RESUME_WORKSPACE', 'THREADS', 
                       'DATA_FILES', 'ACTIVE_AGENTS', 'MEETINGS'];
      
      validIds.forEach(id => {
        expect(() => BureauSectionIdSchema.parse(id)).not.toThrow();
      });
    });

    it('should have exactly 6 valid values', () => {
      expect(BureauSectionIdSchema.options.length).toBe(6);
    });

    it('should reject old section IDs (10-section model)', () => {
      expect(() => BureauSectionIdSchema.parse('DASHBOARD')).toThrow();
      expect(() => BureauSectionIdSchema.parse('NOTES')).toThrow();
      expect(() => BureauSectionIdSchema.parse('TASKS')).toThrow();
      expect(() => BureauSectionIdSchema.parse('PROJECTS')).toThrow();
      expect(() => BureauSectionIdSchema.parse('REPORTS')).toThrow();
      expect(() => BureauSectionIdSchema.parse('BUDGET')).toThrow();
    });
  });

  describe('BureauSectionKeySchema', () => {
    it('should accept valid section keys', () => {
      const validKeys = ['quick_capture', 'resume_workspace', 'threads', 
                        'data_files', 'active_agents', 'meetings'];
      
      validKeys.forEach(key => {
        expect(() => BureauSectionKeySchema.parse(key)).not.toThrow();
      });
    });

    it('should have exactly 6 valid values', () => {
      expect(BureauSectionKeySchema.options.length).toBe(6);
    });
  });

  describe('BureauSectionSchema', () => {
    it('should validate a valid section', () => {
      const validSection = {
        id: 'QUICK_CAPTURE',
        key: 'quick_capture',
        name: 'Quick Capture',
        nameFr: 'Capture Rapide',
        icon: '📝',
        description: 'Quick capture section',
        color: '#D8B26A',
        level: 'L2',
        hierarchy: 1,
        testId: 'bureau-section-quick-capture',
      };

      expect(() => BureauSectionSchema.parse(validSection)).not.toThrow();
    });

    it('should require level to be L2', () => {
      const invalidSection = {
        id: 'QUICK_CAPTURE',
        key: 'quick_capture',
        name: 'Quick Capture',
        nameFr: 'Capture Rapide',
        icon: '📝',
        description: 'Quick capture section',
        color: '#D8B26A',
        level: 'L1', // Should be L2
        hierarchy: 1,
        testId: 'bureau-section-quick-capture',
      };

      expect(() => BureauSectionSchema.parse(invalidSection)).toThrow();
    });

    it('should reject hierarchy outside 1-6', () => {
      const invalidSection = {
        id: 'QUICK_CAPTURE',
        key: 'quick_capture',
        name: 'Quick Capture',
        nameFr: 'Capture Rapide',
        icon: '📝',
        description: 'Quick capture section',
        color: '#D8B26A',
        level: 'L2',
        hierarchy: 7, // Max is 6
        testId: 'bureau-section-quick-capture',
      };

      expect(() => BureauSectionSchema.parse(invalidSection)).toThrow();
    });
  });

  describe('BureauSectionsArraySchema', () => {
    it('should require exactly 6 sections', () => {
      expect(() => validateBureauSectionsCount(Array(5).fill({}))).toThrow();
      expect(() => validateBureauSectionsCount(Array(7).fill({}))).toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT SCHEMA TESTS (Nova L0, Hiring)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Schemas', () => {
  describe('AgentSchema', () => {
    it('should validate a valid agent', () => {
      const validAgent = {
        id: 'agent_1',
        name: 'Data Analyst',
        type: 'specialist',
        level: 'L2',
        status: 'idle',
        isSystem: false,
        isHired: false,
        costPerToken: 0.002,
        capabilities: ['analysis'],
        sphereScopes: ['personal', 'business'],
      };

      expect(() => AgentSchema.parse(validAgent)).not.toThrow();
    });

    it('should require at least one capability', () => {
      const invalidAgent = {
        id: 'agent_1',
        name: 'Data Analyst',
        type: 'specialist',
        level: 'L2',
        status: 'idle',
        isSystem: false,
        isHired: false,
        costPerToken: 0.002,
        capabilities: [], // Empty!
        sphereScopes: ['personal'],
      };

      expect(() => AgentSchema.parse(invalidAgent)).toThrow();
    });

    it('should require positive cost', () => {
      const invalidAgent = {
        id: 'agent_1',
        name: 'Data Analyst',
        type: 'specialist',
        level: 'L2',
        status: 'idle',
        isSystem: false,
        isHired: false,
        costPerToken: 0, // Should be positive
        capabilities: ['analysis'],
        sphereScopes: ['personal'],
      };

      expect(() => AgentSchema.parse(invalidAgent)).toThrow();
    });
  });

  describe('NovaSchema', () => {
    it('should validate Nova with correct properties', () => {
      const nova = {
        id: 'nova',
        name: 'Nova',
        type: 'nova',
        level: 'L0',
        status: 'idle',
        isSystem: true,
        isHired: false,
        costPerToken: 0.001,
        capabilities: ['guidance', 'memory', 'governance', 'supervision'],
        sphereScopes: ['all'],
      };

      const result = validateNova(nova);
      expect(result.success).toBe(true);
    });

    it('should reject Nova if id is not "nova"', () => {
      const invalidNova = {
        id: 'not_nova',
        name: 'Nova',
        type: 'nova',
        level: 'L0',
        status: 'idle',
        isSystem: true,
        isHired: false,
        costPerToken: 0.001,
        capabilities: ['governance'],
        sphereScopes: ['all'],
      };

      expect(() => NovaSchema.parse(invalidNova)).toThrow();
    });

    it('should reject Nova if isHired is true (NEVER hired)', () => {
      const invalidNova = {
        id: 'nova',
        name: 'Nova',
        type: 'nova',
        level: 'L0',
        status: 'idle',
        isSystem: true,
        isHired: true, // INVALID - Nova is NEVER hired
        costPerToken: 0.001,
        capabilities: ['governance'],
        sphereScopes: ['all'],
      };

      expect(() => NovaSchema.parse(invalidNova)).toThrow();
    });

    it('should reject Nova if isSystem is false', () => {
      const invalidNova = {
        id: 'nova',
        name: 'Nova',
        type: 'nova',
        level: 'L0',
        status: 'idle',
        isSystem: false, // Must be true
        isHired: false,
        costPerToken: 0.001,
        capabilities: ['governance'],
        sphereScopes: ['all'],
      };

      expect(() => NovaSchema.parse(invalidNova)).toThrow();
    });

    it('should reject Nova without governance capability', () => {
      const invalidNova = {
        id: 'nova',
        name: 'Nova',
        type: 'nova',
        level: 'L0',
        status: 'idle',
        isSystem: true,
        isHired: false,
        costPerToken: 0.001,
        capabilities: ['analysis'], // Missing governance!
        sphereScopes: ['all'],
      };

      expect(() => NovaSchema.parse(invalidNova)).toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET SCHEMA TESTS (Internal Credits - NOT Crypto!)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Token Budget Schemas', () => {
  describe('TokenBudgetSchema', () => {
    it('should validate a valid budget', () => {
      const validBudget = {
        total: 100000,
        used: 25000,
        remaining: 75000,
        reserved: 0,
        dailyLimit: 100000,
        warningThreshold: 0.8,
      };

      expect(() => TokenBudgetSchema.parse(validBudget)).not.toThrow();
    });

    it('should require remaining = total - used', () => {
      const invalidBudget = {
        total: 100000,
        used: 25000,
        remaining: 50000, // Should be 75000
        reserved: 0,
        dailyLimit: 100000,
        warningThreshold: 0.8,
      };

      expect(() => TokenBudgetSchema.parse(invalidBudget)).toThrow();
    });

    it('should reject used > total', () => {
      const invalidBudget = {
        total: 100000,
        used: 150000, // More than total!
        remaining: -50000,
        reserved: 0,
        dailyLimit: 100000,
        warningThreshold: 0.8,
      };

      expect(() => TokenBudgetSchema.parse(invalidBudget)).toThrow();
    });

    it('should require positive total', () => {
      const invalidBudget = {
        total: 0,
        used: 0,
        remaining: 0,
        reserved: 0,
        dailyLimit: 100000,
        warningThreshold: 0.8,
      };

      expect(() => TokenBudgetSchema.parse(invalidBudget)).toThrow();
    });

    it('should default dailyLimit to 100000', () => {
      const budget = {
        total: 50000,
        used: 0,
        remaining: 50000,
        reserved: 0,
      };

      const parsed = TokenBudgetSchema.parse(budget);
      expect(parsed.dailyLimit).toBe(100000);
    });

    it('should default warningThreshold to 0.8', () => {
      const budget = {
        total: 50000,
        used: 0,
        remaining: 50000,
        reserved: 0,
      };

      const parsed = TokenBudgetSchema.parse(budget);
      expect(parsed.warningThreshold).toBe(0.8);
    });
  });

  describe('GovernanceStatusSchema', () => {
    it('should validate complete governance status', () => {
      const status = {
        enabled: true,
        strictMode: false,
        budget: {
          total: 100000,
          used: 25000,
          remaining: 75000,
          reserved: 0,
          dailyLimit: 100000,
          warningThreshold: 0.8,
        },
        scopeLock: {
          active: false,
          level: 'document',
          targetId: null,
          targetName: null,
          lockedAt: null,
          lockedBy: null,
        },
        pendingApprovals: 0,
        activeViolations: 0,
      };

      expect(() => GovernanceStatusSchema.parse(status)).not.toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD SCHEMA TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thread Schemas', () => {
  describe('ThreadSchema', () => {
    it('should validate a valid thread', () => {
      const validThread = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Thread',
        type: 'chat',
        sphereId: 'personal',
        status: 'active',
        tokenBudget: 5000,
        tokensUsed: 0,
        encodingMode: 'standard',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      expect(() => ThreadSchema.parse(validThread)).not.toThrow();
    });

    it('should require valid sphereId', () => {
      const invalidThread = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Thread',
        type: 'chat',
        sphereId: 'invalid_sphere', // Not a valid sphere
        status: 'active',
        tokenBudget: 5000,
        tokensUsed: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      expect(() => ThreadSchema.parse(invalidThread)).toThrow();
    });

    it('should support scholar sphere', () => {
      const scholarThread = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Research Thread',
        type: 'chat',
        sphereId: 'scholars',
        status: 'active',
        tokenBudget: 5000,
        tokensUsed: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      expect(() => ThreadSchema.parse(scholarThread)).not.toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENCODING SCHEMA TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Encoding Schemas', () => {
  describe('EncodingResultSchema', () => {
    it('should validate a valid encoding result', () => {
      const validResult = {
        encodedText: 'TST:ENC',
        originalTokens: 100,
        encodedTokens: 30,
        compressionRatio: 3.33,
        qualityScore: 95,
        isReversible: true,
      };

      expect(() => EncodingResultSchema.parse(validResult)).not.toThrow();
    });

    it('should require qualityScore between 0-100', () => {
      const invalidResult = {
        encodedText: 'TST:ENC',
        originalTokens: 100,
        encodedTokens: 30,
        compressionRatio: 3.33,
        qualityScore: 150, // Max is 100
        isReversible: true,
      };

      expect(() => EncodingResultSchema.parse(invalidResult)).toThrow();
    });

    it('should require positive compressionRatio', () => {
      const invalidResult = {
        encodedText: 'TST:ENC',
        originalTokens: 100,
        encodedTokens: 30,
        compressionRatio: 0, // Must be positive
        qualityScore: 95,
        isReversible: true,
      };

      expect(() => EncodingResultSchema.parse(invalidResult)).toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCHEMA TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Auth Schemas', () => {
  describe('LoginRequestSchema', () => {
    it('should validate valid login request', () => {
      const validRequest = {
        email: 'test@chenu.ai',
        password: 'securepass123',
      };

      expect(() => LoginRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidRequest = {
        email: 'not-an-email',
        password: 'securepass123',
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject password less than 8 chars', () => {
      const invalidRequest = {
        email: 'test@chenu.ai',
        password: 'short', // Too short
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('UserSchema', () => {
    it('should validate a valid user', () => {
      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@chenu.ai',
        displayName: 'Test User',
        role: 'user',
        tokenBalance: 10000,
        subscription: 'free',
        createdAt: '2024-01-01T00:00:00Z',
      };

      expect(() => UserSchema.parse(validUser)).not.toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU COLORS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('CHE·NU Colors', () => {
  it('should have exactly 9 colors', () => {
    expect(Object.keys(CHENU_COLORS).length).toBe(9);
  });

  it('should have sacredGold as #D8B26A', () => {
    expect(CHENU_COLORS.sacredGold).toBe('#D8B26A');
  });

  it('should have scholarGold as #E0C46B', () => {
    expect(CHENU_COLORS.scholarGold).toBe('#E0C46B');
  });

  it('should validate with ChenuColorSchema', () => {
    expect(() => ChenuColorSchema.parse(CHENU_COLORS)).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Schema Compliance', () => {
  it('should enforce exactly 9 spheres', () => {
    expect(SphereIdSchema.options.length).toBe(9);
  });

  it('should enforce exactly 6 bureau sections', () => {
    expect(BureauSectionIdSchema.options.length).toBe(6);
  });

  it('should enforce Nova is never hired', () => {
    const novaWithHired = {
      id: 'nova',
      name: 'Nova',
      type: 'nova',
      level: 'L0',
      status: 'idle',
      isSystem: true,
      isHired: true, // This MUST fail
      costPerToken: 0.001,
      capabilities: ['governance'],
      sphereScopes: ['all'],
    };

    expect(() => NovaSchema.parse(novaWithHired)).toThrow();
  });

  it('should enforce Nova has governance capability', () => {
    const novaNoGov = {
      id: 'nova',
      name: 'Nova',
      type: 'nova',
      level: 'L0',
      status: 'idle',
      isSystem: true,
      isHired: false,
      costPerToken: 0.001,
      capabilities: ['memory'], // Missing governance!
      sphereScopes: ['all'],
    };

    expect(() => NovaSchema.parse(novaNoGov)).toThrow();
  });
});
