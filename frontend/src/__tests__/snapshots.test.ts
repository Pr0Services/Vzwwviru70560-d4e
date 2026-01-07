// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — SNAPSHOT TESTS
// Sprint 7: Snapshot tests for architecture constants
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL CONSTANTS (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

const CANONICAL_SPHERES = {
  count: 9,
  ids: [
    'personal',
    'business',
    'government',
    'creative',
    'community',
    'social',
    'entertainment',
    'my_team',
    'scholars',
  ],
  frozen: true,
};

const CANONICAL_BUREAU_SECTIONS = {
  count: 6,
  ids: [
    'QUICK_CAPTURE',
    'RESUME_WORKSPACE',
    'THREADS',
    'DATA_FILES',
    'ACTIVE_AGENTS',
    'MEETINGS',
  ],
  hardLimit: true,
};

const CANONICAL_GOVERNANCE_LAWS = {
  count: 10,
  laws: [
    { id: 'L1', code: 'CONSENT_PRIMACY' },
    { id: 'L2', code: 'TEMPORAL_SOVEREIGNTY' },
    { id: 'L3', code: 'CONTEXTUAL_FIDELITY' },
    { id: 'L4', code: 'HIERARCHICAL_RESPECT' },
    { id: 'L5', code: 'AUDIT_COMPLETENESS' },
    { id: 'L6', code: 'ENCODING_TRANSPARENCY' },
    { id: 'L7', code: 'AGENT_NON_AUTONOMY' },
    { id: 'L8', code: 'BUDGET_ACCOUNTABILITY' },
    { id: 'L9', code: 'CROSS_SPHERE_ISOLATION' },
    { id: 'L10', code: 'DELETION_COMPLETENESS' },
  ],
};

const CANONICAL_AGENT_LEVELS = {
  count: 4,
  levels: {
    L0: 'System Intelligence',
    L1: 'Orchestrator',
    L2: 'Specialist',
    L3: 'Worker',
  },
};

const CANONICAL_NOVA = {
  id: 'nova',
  name: 'Nova',
  level: 'L0',
  type: 'nova',
  isSystem: true,
  isHired: false, // NEVER hired
  capabilities: [
    'guidance',
    'memory',
    'governance',
    'supervision',
    'database_management',
    'thread_management',
  ],
};

const CANONICAL_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  scholarGold: '#E0C46B',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Snapshots', () => {
  it('should match sphere count snapshot', () => {
    expect(CANONICAL_SPHERES.count).toMatchInlineSnapshot(`9`);
  });

  it('should match sphere IDs snapshot', () => {
    expect(CANONICAL_SPHERES.ids).toMatchInlineSnapshot(`
      [
        "personal",
        "business",
        "government",
        "creative",
        "community",
        "social",
        "entertainment",
        "team",
        "scholar",
      ]
    `);
  });

  it('should match frozen status snapshot', () => {
    expect(CANONICAL_SPHERES.frozen).toMatchInlineSnapshot(`true`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Section Snapshots', () => {
  it('should match section count snapshot', () => {
    expect(CANONICAL_BUREAU_SECTIONS.count).toMatchInlineSnapshot(`6`);
  });

  it('should match section IDs snapshot', () => {
    expect(CANONICAL_BUREAU_SECTIONS.ids).toMatchInlineSnapshot(`
      [
        "QUICK_CAPTURE",
        "RESUME_WORKSPACE",
        "THREADS",
        "DATA_FILES",
        "ACTIVE_AGENTS",
        "MEETINGS",
      ]
    `);
  });

  it('should match hard limit status snapshot', () => {
    expect(CANONICAL_BUREAU_SECTIONS.hardLimit).toMatchInlineSnapshot(`true`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE LAWS SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Laws Snapshots', () => {
  it('should match law count snapshot', () => {
    expect(CANONICAL_GOVERNANCE_LAWS.count).toMatchInlineSnapshot(`10`);
  });

  it('should match L1 law snapshot', () => {
    expect(CANONICAL_GOVERNANCE_LAWS.laws[0]).toMatchInlineSnapshot(`
      {
        "code": "CONSENT_PRIMACY",
        "id": "L1",
      }
    `);
  });

  it('should match L7 law snapshot', () => {
    expect(CANONICAL_GOVERNANCE_LAWS.laws[6]).toMatchInlineSnapshot(`
      {
        "code": "AGENT_NON_AUTONOMY",
        "id": "L7",
      }
    `);
  });

  it('should match L10 law snapshot', () => {
    expect(CANONICAL_GOVERNANCE_LAWS.laws[9]).toMatchInlineSnapshot(`
      {
        "code": "DELETION_COMPLETENESS",
        "id": "L10",
      }
    `);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT LEVELS SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Levels Snapshots', () => {
  it('should match level count snapshot', () => {
    expect(CANONICAL_AGENT_LEVELS.count).toMatchInlineSnapshot(`4`);
  });

  it('should match levels snapshot', () => {
    expect(CANONICAL_AGENT_LEVELS.levels).toMatchInlineSnapshot(`
      {
        "L0": "System Intelligence",
        "L1": "Orchestrator",
        "L2": "Specialist",
        "L3": "Worker",
      }
    `);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Nova Snapshots', () => {
  it('should match Nova ID snapshot', () => {
    expect(CANONICAL_NOVA.id).toMatchInlineSnapshot(`"nova"`);
  });

  it('should match Nova level snapshot', () => {
    expect(CANONICAL_NOVA.level).toMatchInlineSnapshot(`"L0"`);
  });

  it('should match Nova isHired snapshot (always false)', () => {
    expect(CANONICAL_NOVA.isHired).toMatchInlineSnapshot(`false`);
  });

  it('should match Nova isSystem snapshot (always true)', () => {
    expect(CANONICAL_NOVA.isSystem).toMatchInlineSnapshot(`true`);
  });

  it('should match Nova capabilities snapshot', () => {
    expect(CANONICAL_NOVA.capabilities).toMatchInlineSnapshot(`
      [
        "guidance",
        "memory",
        "governance",
        "supervision",
        "database_management",
        "thread_management",
      ]
    `);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS SNAPSHOT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Colors Snapshots', () => {
  it('should match Sacred Gold snapshot', () => {
    expect(CANONICAL_COLORS.sacredGold).toMatchInlineSnapshot(`"#D8B26A"`);
  });

  it('should match Scholar Gold snapshot', () => {
    expect(CANONICAL_COLORS.scholarGold).toMatchInlineSnapshot(`"#E0C46B"`);
  });

  it('should match UI Slate snapshot', () => {
    expect(CANONICAL_COLORS.uiSlate).toMatchInlineSnapshot(`"#1E1F22"`);
  });

  it('should match all colors snapshot', () => {
    expect(CANONICAL_COLORS).toMatchInlineSnapshot(`
      {
        "ancientStone": "#8D8371",
        "cenoteTurquoise": "#3EB4A2",
        "earthEmber": "#7A593A",
        "jungleEmerald": "#3F7249",
        "sacredGold": "#D8B26A",
        "scholarGold": "#E0C46B",
        "shadowMoss": "#2F4C39",
        "softSand": "#E9E4D6",
        "uiSlate": "#1E1F22",
      }
    `);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FULL ARCHITECTURE SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Full Architecture Snapshot', () => {
  it('should match complete architecture snapshot', () => {
    const architecture = {
      spheres: CANONICAL_SPHERES.count,
      bureauSections: CANONICAL_BUREAU_SECTIONS.count,
      governanceLaws: CANONICAL_GOVERNANCE_LAWS.count,
      agentLevels: CANONICAL_AGENT_LEVELS.count,
      novaLevel: CANONICAL_NOVA.level,
      novaHired: CANONICAL_NOVA.isHired,
    };

    expect(architecture).toMatchInlineSnapshot(`
      {
        "agentLevels": 4,
        "bureauSections": 6,
        "governanceLaws": 10,
        "novaHired": false,
        "novaLevel": "L0",
        "spheres": 9,
      }
    `);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT FROZEN VALUES SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Frozen Values', () => {
  it('should match frozen architecture values', () => {
    const frozenValues = {
      // These values are FROZEN and should NEVER change
      sphereCount: 9,
      bureauSectionCount: 6,
      governanceLawCount: 10,
      agentLevelCount: 4,
      novaLevel: 'L0',
      novaIsHired: false,
      novaIsSystem: true,
    };

    expect(frozenValues).toMatchInlineSnapshot(`
      {
        "agentLevelCount": 4,
        "bureauSectionCount": 6,
        "governanceLawCount": 10,
        "novaIsHired": false,
        "novaIsSystem": true,
        "novaLevel": "L0",
        "sphereCount": 9,
      }
    `);
  });
});
