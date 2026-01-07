// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — CANONICAL CONSTANTS TESTS
// Sprint 1 - Tâche 9: Architecture tests for 9 Spheres (FROZEN)
// canonical.ts is the single source of truth for CHE·NU architecture
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  SPHERES,
  SPHERES_MAP,
  BUREAU_SECTIONS,
  BUREAU_SECTIONS_MAP,
  COLORS,
  AGENT_LEVELS,
  GOVERNANCE,
  SCHOLAR_CONFIG,
  VERSION,
  type SphereId,
  type BureauSectionId,
  type AgentLevel,
} from '../canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// 9 SPHERES ARCHITECTURE TESTS (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

describe('9 Spheres Architecture (FROZEN)', () => {
  it('should have exactly 9 spheres', () => {
    expect(SPHERES.length).toBe(9);
  });

  it('should have all required sphere IDs', () => {
    const requiredIds: SphereId[] = [
      'personal', 'business', 'government', 'creative',
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    const actualIds = SPHERES.map(s => s.id);
    expect(actualIds).toEqual(requiredIds);
  });

  it('should include Scholar as 9th sphere', () => {
    const scholar = SPHERES.find(s => s.id === 'scholars');
    expect(scholar).toBeDefined();
    expect(scholar?.icon).toBe('📚');
    expect(scholar?.order).toBe(9);
  });

  it('spheres should be in correct order (1-9)', () => {
    const orders = SPHERES.map(s => s.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('each sphere should have unique ID', () => {
    const ids = SPHERES.map(s => s.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  it('each sphere should have unique icon', () => {
    const icons = SPHERES.map(s => s.icon);
    const uniqueIcons = [...new Set(icons)];
    expect(icons.length).toBe(uniqueIcons.length);
  });

  it('each sphere should have unique route', () => {
    const routes = SPHERES.map(s => s.route);
    const uniqueRoutes = [...new Set(routes)];
    expect(routes.length).toBe(uniqueRoutes.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE PROPERTIES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Properties', () => {
  it('each sphere should have all required properties', () => {
    SPHERES.forEach(sphere => {
      expect(sphere.id).toBeDefined();
      expect(sphere.name).toBeDefined();
      expect(sphere.nameFr).toBeDefined();
      expect(sphere.nameEs).toBeDefined();
      expect(sphere.icon).toBeDefined();
      expect(sphere.color).toBeDefined();
      expect(sphere.route).toBeDefined();
      expect(sphere.description).toBeDefined();
      expect(sphere.descriptionFr).toBeDefined();
      expect(sphere.order).toBeDefined();
    });
  });

  it('routes should start with /', () => {
    SPHERES.forEach(sphere => {
      expect(sphere.route.startsWith('/')).toBe(true);
    });
  });

  it('colors should be valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    SPHERES.forEach(sphere => {
      expect(sphere.color).toMatch(hexColorRegex);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERES MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Spheres Map', () => {
  it('should have entry for each sphere', () => {
    expect(Object.keys(SPHERES_MAP).length).toBe(9);
  });

  it('should retrieve sphere by ID', () => {
    expect(SPHERES_MAP['personal'].name).toBe('Personal');
    expect(SPHERES_MAP['scholar'].name).toBe('Scholar');
  });

  it('map entries should match array entries', () => {
    SPHERES.forEach(sphere => {
      expect(SPHERES_MAP[sphere.id]).toEqual(sphere);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIFIC SPHERE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Specific Spheres', () => {
  describe('Personal Sphere', () => {
    it('should be first sphere', () => {
      expect(SPHERES[0].id).toBe('personal');
    });

    it('should have 🏠 icon', () => {
      expect(SPHERES_MAP['personal'].icon).toBe('🏠');
    });

    it('should have Sacred Gold color', () => {
      expect(SPHERES_MAP['personal'].color).toBe('#D8B26A');
    });
  });

  describe('My Team Sphere', () => {
    it('should include IA Labs & Skills in description', () => {
      const team = SPHERES_MAP['team'];
      expect(team.description.toLowerCase()).toContain('skills');
    });

    it('should have 🤝 icon', () => {
      expect(SPHERES_MAP['team'].icon).toBe('🤝');
    });
  });

  describe('Scholar Sphere', () => {
    it('should be 9th sphere', () => {
      expect(SPHERES[8].id).toBe('scholar');
    });

    it('should have Scholar Gold color', () => {
      expect(SPHERES_MAP['scholar'].color).toBe('#E0C46B');
    });

    it('should have academic description', () => {
      const scholar = SPHERES_MAP['scholar'];
      expect(scholar.description.toLowerCase()).toContain('learning');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6 BUREAU SECTIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('6 Bureau Sections', () => {
  it('should have exactly 6 sections', () => {
    expect(BUREAU_SECTIONS.length).toBe(6);
  });

  it('should have correct section IDs', () => {
    const expectedIds: BureauSectionId[] = [
      'QUICK_CAPTURE', 'RESUME_WORKSPACE', 'THREADS',
      'DATA_FILES', 'ACTIVE_AGENTS', 'MEETINGS'
    ];
    
    const actualIds = BUREAU_SECTIONS.map(s => s.id);
    expect(actualIds).toEqual(expectedIds);
  });

  it('each section should have hierarchy level', () => {
    BUREAU_SECTIONS.forEach(section => {
      expect(section.hierarchyLevel).toBeGreaterThan(0);
      expect(section.hierarchyLevel).toBeLessThanOrEqual(6);
    });
  });

  it('sections should have trilingual support', () => {
    BUREAU_SECTIONS.forEach(section => {
      expect(section.name).toBeDefined();
      expect(section.nameFr).toBeDefined();
      expect(section.nameEs).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU COLORS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('CHE·NU Colors', () => {
  it('should have all 9 brand colors', () => {
    const expectedColors = [
      'sacredGold', 'ancientStone', 'jungleEmerald', 'cenoteTurquoise',
      'shadowMoss', 'earthEmber', 'uiSlate', 'softSand', 'scholarGold'
    ];
    
    expectedColors.forEach(color => {
      expect(COLORS[color as keyof typeof COLORS]).toBeDefined();
    });
  });

  it('Sacred Gold should be #D8B26A', () => {
    expect(COLORS.sacredGold).toBe('#D8B26A');
  });

  it('Ancient Stone should be #8D8371', () => {
    expect(COLORS.ancientStone).toBe('#8D8371');
  });

  it('Jungle Emerald should be #3F7249', () => {
    expect(COLORS.jungleEmerald).toBe('#3F7249');
  });

  it('Cenote Turquoise should be #3EB4A2', () => {
    expect(COLORS.cenoteTurquoise).toBe('#3EB4A2');
  });

  it('Scholar Gold should be #E0C46B', () => {
    expect(COLORS.scholarGold).toBe('#E0C46B');
  });

  it('all colors should be valid hex', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    Object.values(COLORS).forEach(color => {
      expect(color).toMatch(hexRegex);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT LEVELS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Levels (L0-L3)', () => {
  it('should have 4 agent levels', () => {
    const levels: AgentLevel[] = ['L0', 'L1', 'L2', 'L3'];
    levels.forEach(level => {
      expect(AGENT_LEVELS[level]).toBeDefined();
    });
  });

  it('L0 should be Nova (System Intelligence)', () => {
    expect(AGENT_LEVELS.L0.name).toBe('System Intelligence');
    expect(AGENT_LEVELS.L0.description).toContain('Nova');
    expect(AGENT_LEVELS.L0.description).toContain('never hired');
  });

  it('L1 should be Orchestrator', () => {
    expect(AGENT_LEVELS.L1.name).toBe('Orchestrator');
  });

  it('L2 should be Specialist', () => {
    expect(AGENT_LEVELS.L2.name).toBe('Specialist');
  });

  it('L3 should be Worker', () => {
    expect(AGENT_LEVELS.L3.name).toBe('Worker');
  });

  it('each level should have French translation', () => {
    Object.values(AGENT_LEVELS).forEach(level => {
      expect(level.nameFr).toBeDefined();
      expect(level.descriptionFr).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance', () => {
  it('should have default daily token limit', () => {
    expect(GOVERNANCE.DEFAULT_DAILY_LIMIT).toBe(100000);
  });

  it('should have warning threshold at 80%', () => {
    expect(GOVERNANCE.WARNING_THRESHOLD).toBe(0.8);
  });

  it('should have 5 scope levels', () => {
    expect(GOVERNANCE.SCOPE_LEVELS.length).toBe(5);
    expect(GOVERNANCE.SCOPE_LEVELS).toContain('selection');
    expect(GOVERNANCE.SCOPE_LEVELS).toContain('global');
  });

  it('should have 7 governance laws', () => {
    expect(Object.keys(GOVERNANCE.LAWS).length).toBe(7);
  });

  it('should include Agent Non-Autonomy law', () => {
    expect(GOVERNANCE.LAWS.AGENT_NON_AUTONOMY).toBe('L7');
  });

  it('should have 5 tree laws', () => {
    expect(Object.keys(GOVERNANCE.TREE_LAWS).length).toBe(5);
  });

  it('tree laws should include SAFE and NON_AUTONOMOUS', () => {
    expect(GOVERNANCE.TREE_LAWS.SAFE).toBeDefined();
    expect(GOVERNANCE.TREE_LAWS.NON_AUTONOMOUS).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCHOLAR CONFIG TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Scholar Configuration', () => {
  it('should have academic content types', () => {
    expect(SCHOLAR_CONFIG.contentTypes.length).toBeGreaterThan(0);
    expect(SCHOLAR_CONFIG.contentTypes).toContain('research_paper');
    expect(SCHOLAR_CONFIG.contentTypes).toContain('thesis');
  });

  it('should have academic integrations', () => {
    expect(SCHOLAR_CONFIG.integrations).toContain('google_scholar');
    expect(SCHOLAR_CONFIG.integrations).toContain('arxiv');
    expect(SCHOLAR_CONFIG.integrations).toContain('zotero');
  });

  it('should have citation styles', () => {
    expect(SCHOLAR_CONFIG.citationStyles).toContain('apa7');
    expect(SCHOLAR_CONFIG.citationStyles).toContain('mla9');
    expect(SCHOLAR_CONFIG.citationStyles).toContain('ieee');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Version Info', () => {
  it('should be version 40', () => {
    expect(VERSION.major).toBe(40);
  });

  it('should have version label', () => {
    expect(VERSION.label).toContain('40');
  });

  it('should document 9 spheres in changes', () => {
    const hasSpheresChange = VERSION.changes.some(c => c.includes('9 SPHÈRES'));
    expect(hasSpheresChange).toBe(true);
  });

  it('should document 6 sections in changes', () => {
    const hasSectionsChange = VERSION.changes.some(c => c.includes('6 SECTIONS'));
    expect(hasSectionsChange).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Compliance', () => {
  it('NO additional spheres allowed beyond 9', () => {
    expect(SPHERES.length).toBe(9);
    expect(SPHERES.length).not.toBeGreaterThan(9);
  });

  it('NO sphere may be split or merged', () => {
    // Verify each Memory Prompt sphere exists as single entry
    const memoryPromptSpheres = [
      'Personal', 'Business', 'Government & Institutions', 'Creative Studio',
      'Community', 'Social & Media', 'Entertainment', 'My Team', 'Scholar'
    ];
    
    const actualNames = SPHERES.map(s => s.name);
    memoryPromptSpheres.forEach(name => {
      const found = actualNames.some(n => n.includes(name.split(' ')[0]));
      expect(found).toBe(true);
    });
  });

  it('IA Labs and Skills should be in My Team (not separate)', () => {
    const team = SPHERES_MAP['team'];
    expect(team.description.toLowerCase()).toContain('skills');
    
    // Should NOT exist as separate sphere
    const iaLabsSphere = SPHERES.find(s => 
      s.name.toLowerCase().includes('ia labs') || 
      s.id === 'scholars'
    );
    expect(iaLabsSphere).toBeUndefined();
  });

  it('Nova should be L0 System Intelligence (never hired)', () => {
    expect(AGENT_LEVELS.L0.description).toContain('never hired');
  });
});
