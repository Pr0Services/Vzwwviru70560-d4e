/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — SCHEMA TESTS v39
   Comprehensive validation tests for all Zod schemas
   ═══════════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import {
  SphereIdSchema,
  BureauSectionIdSchema,
  ThreadSchema,
  AgentSchema,
  MeetingSchema,
  QuickCaptureSchema,
  TokenBudgetSchema,
  UserSchema,
  safeParse,
  validateOrThrow,
} from '../schemas';

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('SphereIdSchema', () => {
  it('accepts valid sphere IDs', () => {
    const validIds = [
      'personal',
      'business',
      'government',
      'creative',
      'community',
      'social',
      'entertainment',
      'scholars',
      'my_team',
    ];

    validIds.forEach((id) => {
      expect(SphereIdSchema.safeParse(id).success).toBe(true);
    });
  });

  it('rejects invalid sphere IDs', () => {
    const invalidIds = ['invalid', 'PERSONAL', 'Personal', 'home', '', null, undefined, 123];

    invalidIds.forEach((id) => {
      expect(SphereIdSchema.safeParse(id).success).toBe(false);
    });
  });

  it('has exactly 9 spheres (frozen architecture with Scholar)', () => {
    const result = SphereIdSchema.options;
    expect(result.length).toBe(9);
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('BureauSectionIdSchema', () => {
  it('accepts valid bureau section IDs', () => {
    const validIds = [
      'QUICK_CAPTURE',
      'RESUME_WORKSPACE',
      'THREADS',
      'DATA_FILES',
      'ACTIVE_AGENTS',
      'MEETINGS',
    ];

    validIds.forEach((id) => {
      expect(BureauSectionIdSchema.safeParse(id).success).toBe(true);
    });
  });

  it('rejects invalid bureau section IDs', () => {
    const invalidIds = [
      'quick_capture',
      'DASHBOARD',
      'NOTES',
      'TASKS',
      'PROJECTS',
      'invalid',
      '',
      null,
    ];

    invalidIds.forEach((id) => {
      expect(BureauSectionIdSchema.safeParse(id).success).toBe(false);
    });
  });

  it('has exactly 6 sections (frozen architecture)', () => {
    const result = BureauSectionIdSchema.options;
    expect(result.length).toBe(6);
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// THREAD TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('ThreadSchema', () => {
  const validThread = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Thread',
    sphereId: 'personal',
    ownerId: '123e4567-e89b-12d3-a456-426614174001',
    tokenBudget: 10000,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('accepts valid thread data', () => {
    const result = ThreadSchema.safeParse(validThread);
    expect(result.success).toBe(true);
  });

  it('rejects thread with invalid UUID', () => {
    const invalid = { ...validThread, id: 'not-a-uuid' };
    const result = ThreadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects thread with title too long', () => {
    const invalid = { ...validThread, title: 'a'.repeat(201) };
    const result = ThreadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects thread with empty title', () => {
    const invalid = { ...validThread, title: '' };
    const result = ThreadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects thread with invalid sphere ID', () => {
    const invalid = { ...validThread, sphereId: 'invalid-sphere' };
    const result = ThreadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects thread with negative token budget', () => {
    const invalid = { ...validThread, tokenBudget: -100 };
    const result = ThreadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('applies default values correctly', () => {
    const result = ThreadSchema.safeParse(validThread);
    if (result.success) {
      expect(result.data.status).toBe('active');
      expect(result.data.tokensUsed).toBe(0);
      expect(result.data.unread).toBe(0);
      expect(result.data.participants).toEqual([]);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// AGENT TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('AgentSchema', () => {
  const validAgent = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Agent',
    nameFr: 'Agent Test',
    level: 'L2',
    category: 'analysis',
    description: 'A test agent for analysis tasks',
    costPerToken: 0.001,
    maxTokensPerTask: 10000,
  };

  it('accepts valid agent data', () => {
    const result = AgentSchema.safeParse(validAgent);
    expect(result.success).toBe(true);
  });

  it('accepts all valid agent levels', () => {
    ['L0', 'L1', 'L2', 'L3'].forEach((level) => {
      const agent = { ...validAgent, level };
      const result = AgentSchema.safeParse(agent);
      expect(result.success).toBe(true);
    });
  });

  it('rejects invalid agent level', () => {
    const invalid = { ...validAgent, level: 'L4' };
    const result = AgentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('accepts all valid agent categories', () => {
    const categories = [
      'system',
      'orchestration',
      'analysis',
      'writing',
      'research',
      'coding',
      'data',
      'communication',
      'creativity',
      'productivity',
      'finance',
      'legal',
      'health',
      'education',
      'real_estate',
      'media',
      'support',
      'security',
      'governance',
    ];

    categories.forEach((category) => {
      const agent = { ...validAgent, category };
      const result = AgentSchema.safeParse(agent);
      expect(result.success).toBe(true);
    });
  });

  it('applies default values correctly', () => {
    const result = AgentSchema.safeParse(validAgent);
    if (result.success) {
      expect(result.data.status).toBe('idle');
      expect(result.data.isHired).toBe(false);
      expect(result.data.capabilities).toEqual([]);
      expect(result.data.sphereAccess).toEqual([]);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// QUICK CAPTURE TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('QuickCaptureSchema', () => {
  const validCapture = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test capture note',
    type: 'note',
    timestamp: Date.now(),
  };

  it('accepts valid quick capture', () => {
    const result = QuickCaptureSchema.safeParse(validCapture);
    expect(result.success).toBe(true);
  });

  it('enforces 500 character max limit', () => {
    const valid = { ...validCapture, content: 'a'.repeat(500) };
    expect(QuickCaptureSchema.safeParse(valid).success).toBe(true);

    const invalid = { ...validCapture, content: 'a'.repeat(501) };
    expect(QuickCaptureSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects empty content', () => {
    const invalid = { ...validCapture, content: '' };
    const result = QuickCaptureSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('accepts all capture types', () => {
    ['note', 'voice', 'image', 'link'].forEach((type) => {
      const capture = { ...validCapture, type };
      const result = QuickCaptureSchema.safeParse(capture);
      expect(result.success).toBe(true);
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('TokenBudgetSchema', () => {
  const validBudget = {
    total: 100000,
    used: 25000,
    remaining: 75000,
    lastUpdated: Date.now(),
  };

  it('accepts valid token budget', () => {
    const result = TokenBudgetSchema.safeParse(validBudget);
    expect(result.success).toBe(true);
  });

  it('rejects negative values', () => {
    const invalid = { ...validBudget, total: -100 };
    expect(TokenBudgetSchema.safeParse(invalid).success).toBe(false);
  });

  it('applies default reserved value', () => {
    const result = TokenBudgetSchema.safeParse(validBudget);
    if (result.success) {
      expect(result.data.reserved).toBe(0);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// USER TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('UserSchema', () => {
  const validUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: Date.now(),
  };

  it('accepts valid user data', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalid = { ...validUser, email: 'not-an-email' };
    const result = UserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('applies default preferences', () => {
    const result = UserSchema.safeParse(validUser);
    if (result.success) {
      expect(result.data.role).toBe('user');
      expect(result.data.locale).toBe('en');
      expect(result.data.timezone).toBe('UTC');
      expect(result.data.preferences.theme).toBe('dark');
      expect(result.data.preferences.governance.dailyTokenLimit).toBe(100000);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('safeParse helper', () => {
  it('returns success true with data for valid input', () => {
    const result = safeParse(SphereIdSchema, 'personal');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('personal');
    }
  });

  it('returns success false with errors for invalid input', () => {
    const result = safeParse(SphereIdSchema, 'invalid');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});

describe('validateOrThrow helper', () => {
  it('returns data for valid input', () => {
    const result = validateOrThrow(SphereIdSchema, 'personal');
    expect(result).toBe('personal');
  });

  it('throws error for invalid input', () => {
    expect(() => validateOrThrow(SphereIdSchema, 'invalid')).toThrow('Validation failed');
  });

  it('includes context in error message', () => {
    expect(() => validateOrThrow(SphereIdSchema, 'invalid', 'sphere selection')).toThrow(
      'sphere selection'
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// MEETING TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('MeetingSchema', () => {
  const validMeeting = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Team Standup',
    sphereId: 'business',
    organizerId: '123e4567-e89b-12d3-a456-426614174001',
    participants: [
      {
        userId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'John Doe',
        role: 'organizer',
        status: 'accepted',
      },
    ],
    startTime: Date.now() + 3600000, // 1 hour from now
    endTime: Date.now() + 7200000, // 2 hours from now
    duration: 60,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('accepts valid meeting data', () => {
    const result = MeetingSchema.safeParse(validMeeting);
    expect(result.success).toBe(true);
  });

  it('rejects meeting without participants', () => {
    const invalid = { ...validMeeting, participants: [] };
    // Empty array is valid, but let's test with missing field
    const { participants: _, ...noParticipants } = validMeeting;
    const result = MeetingSchema.safeParse(noParticipants);
    expect(result.success).toBe(false);
  });

  it('applies default status', () => {
    const result = MeetingSchema.safeParse(validMeeting);
    if (result.success) {
      expect(result.data.status).toBe('scheduled');
      expect(result.data.hasRecording).toBe(false);
    }
  });
});
