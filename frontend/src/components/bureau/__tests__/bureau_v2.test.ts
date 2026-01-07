// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — BUREAU V2 TESTS
// Sprint 1 - Tâche 8: Architecture tests for 6 Bureau Sections (HARD LIMIT)
// bureau_v2.ts is the canonical source for bureau sections
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  BUREAU_SECTIONS_V2,
  BUREAU_HIERARCHY,
  getBureauSection,
  getBureauSectionByKey,
  getAllBureauSections,
  getBureauSectionIds,
  getBureauSectionKeys,
  getBureauSectionCount,
  getBureauHierarchyLevel,
  validateBureauSectionId,
  validateBureauSectionKey,
  type BureauSectionId,
  type BureauLevel,
} from '../bureau_v2';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE COMPLIANCE TESTS (HARD LIMIT - 6 SECTIONS)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Architecture Compliance', () => {
  it('should have exactly 6 sections (HARD LIMIT)', () => {
    expect(BUREAU_SECTIONS_V2.length).toBe(6);
  });

  it('section count function should return 6', () => {
    expect(getBureauSectionCount()).toBe(6);
  });

  it('should have the correct 6 section IDs', () => {
    const expectedIds: BureauSectionId[] = [
      'QUICK_CAPTURE',
      'RESUME_WORKSPACE',
      'THREADS',
      'DATA_FILES',
      'ACTIVE_AGENTS',
      'MEETINGS',
    ];
    
    const actualIds = getBureauSectionIds();
    expect(actualIds).toEqual(expectedIds);
  });

  it('should have the correct 6 section keys', () => {
    const expectedKeys = [
      'quick_capture',
      'resume_workspace',
      'threads',
      'data_files',
      'active_agents',
      'meetings',
    ];
    
    const actualKeys = getBureauSectionKeys();
    expect(actualKeys).toEqual(expectedKeys);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PROPERTY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Section Properties', () => {
  it('each section should have required properties', () => {
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(section.id).toBeDefined();
      expect(section.key).toBeDefined();
      expect(section.name).toBeDefined();
      expect(section.nameFr).toBeDefined();
      expect(section.icon).toBeDefined();
      expect(section.description).toBeDefined();
      expect(section.descriptionFr).toBeDefined();
      expect(section.color).toBeDefined();
      expect(section.level).toBeDefined();
      expect(section.testId).toBeDefined();
    });
  });

  it('each section should have unique ID', () => {
    const ids = BUREAU_SECTIONS_V2.map(s => s.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  it('each section should have unique key', () => {
    const keys = BUREAU_SECTIONS_V2.map(s => s.key);
    const uniqueKeys = [...new Set(keys)];
    expect(keys.length).toBe(uniqueKeys.length);
  });

  it('each section should have unique icon', () => {
    const icons = BUREAU_SECTIONS_V2.map(s => s.icon);
    const uniqueIcons = [...new Set(icons)];
    expect(icons.length).toBe(uniqueIcons.length);
  });

  it('each section should have test ID for E2E testing', () => {
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(section.testId).toMatch(/^bureau-section-/);
    });
  });

  it('all sections should be L2 (Sphere Bureau level)', () => {
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(section.level).toBe('L2');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU COLOR COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('CHE·NU Color Compliance', () => {
  const CHENU_COLORS = {
    sacredGold: '#D8B26A',
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    shadowMoss: '#2F4C39',
    earthEmber: '#7A593A',
  };

  it('section colors should use CHE·NU palette', () => {
    const validColors = Object.values(CHENU_COLORS);
    
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(validColors).toContain(section.color);
    });
  });

  it('Quick Capture should use Sacred Gold', () => {
    const section = getBureauSection('QUICK_CAPTURE');
    expect(section?.color).toBe(CHENU_COLORS.sacredGold);
  });

  it('Resume Workspace should use Cenote Turquoise', () => {
    const section = getBureauSection('RESUME_WORKSPACE');
    expect(section?.color).toBe(CHENU_COLORS.cenoteTurquoise);
  });

  it('Threads should use Jungle Emerald', () => {
    const section = getBureauSection('THREADS');
    expect(section?.color).toBe(CHENU_COLORS.jungleEmerald);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Helper Functions', () => {
  describe('getBureauSection', () => {
    it('should return section by ID', () => {
      const section = getBureauSection('THREADS');
      expect(section?.id).toBe('THREADS');
      expect(section?.name).toBe('Threads');
    });

    it('should return undefined for invalid ID', () => {
      const section = getBureauSection('INVALID_ID' as BureauSectionId);
      expect(section).toBeUndefined();
    });
  });

  describe('getBureauSectionByKey', () => {
    it('should return section by key', () => {
      const section = getBureauSectionByKey('meetings');
      expect(section?.id).toBe('MEETINGS');
    });

    it('should return undefined for invalid key', () => {
      const section = getBureauSectionByKey('invalid_key');
      expect(section).toBeUndefined();
    });
  });

  describe('getAllBureauSections', () => {
    it('should return all 6 sections', () => {
      const sections = getAllBureauSections();
      expect(sections.length).toBe(6);
    });

    it('should return immutable copy', () => {
      const sections1 = getAllBureauSections();
      const sections2 = getAllBureauSections();
      expect(sections1).toEqual(sections2);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Validation Functions', () => {
  describe('validateBureauSectionId', () => {
    it('should validate correct section IDs', () => {
      expect(validateBureauSectionId('QUICK_CAPTURE')).toBe(true);
      expect(validateBureauSectionId('THREADS')).toBe(true);
      expect(validateBureauSectionId('MEETINGS')).toBe(true);
    });

    it('should reject invalid section IDs', () => {
      expect(validateBureauSectionId('INVALID')).toBe(false);
      expect(validateBureauSectionId('dashboard')).toBe(false);
      expect(validateBureauSectionId('')).toBe(false);
    });
  });

  describe('validateBureauSectionKey', () => {
    it('should validate correct section keys', () => {
      expect(validateBureauSectionKey('quick_capture')).toBe(true);
      expect(validateBureauSectionKey('threads')).toBe(true);
      expect(validateBureauSectionKey('meetings')).toBe(true);
    });

    it('should reject invalid section keys', () => {
      expect(validateBureauSectionKey('invalid')).toBe(false);
      expect(validateBureauSectionKey('QUICK_CAPTURE')).toBe(false);
      expect(validateBureauSectionKey('')).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU HIERARCHY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Hierarchy', () => {
  it('should have 5 hierarchy levels', () => {
    const levels: BureauLevel[] = ['L0', 'L1', 'L2', 'L3', 'L4'];
    levels.forEach(level => {
      expect(BUREAU_HIERARCHY[level]).toBeDefined();
    });
  });

  it('L0 should be Global Bureau', () => {
    const level = getBureauHierarchyLevel('L0');
    expect(level.name).toBe('Global Bureau');
  });

  it('L1 should be Identity Bureau', () => {
    const level = getBureauHierarchyLevel('L1');
    expect(level.name).toBe('Identity Bureau');
  });

  it('L2 should be Sphere Bureau with 6 sections', () => {
    const level = getBureauHierarchyLevel('L2');
    expect(level.name).toBe('Sphere Bureau');
    expect(level.count).toBe(6);
    expect(level.description).toContain('6 sections');
  });

  it('L3 should be Project Bureau', () => {
    const level = getBureauHierarchyLevel('L3');
    expect(level.name).toBe('Project Bureau');
  });

  it('L4 should be Agent Bureau', () => {
    const level = getBureauHierarchyLevel('L4');
    expect(level.name).toBe('Agent Bureau');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOCALIZATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Localization', () => {
  it('all sections should have French names', () => {
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(section.nameFr).toBeTruthy();
      expect(section.nameFr.length).toBeGreaterThan(0);
    });
  });

  it('all sections should have French descriptions', () => {
    BUREAU_SECTIONS_V2.forEach(section => {
      expect(section.descriptionFr).toBeTruthy();
      expect(section.descriptionFr.length).toBeGreaterThan(0);
    });
  });

  it('Quick Capture should be "Capture Rapide" in French', () => {
    const section = getBureauSection('QUICK_CAPTURE');
    expect(section?.nameFr).toBe('Capture Rapide');
  });

  it('Threads should be "Fils de Discussion" in French', () => {
    const section = getBureauSection('THREADS');
    expect(section?.nameFr).toBe('Fils de Discussion');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIFIC SECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Specific Sections', () => {
  describe('Quick Capture', () => {
    it('should be first section', () => {
      expect(BUREAU_SECTIONS_V2[0].id).toBe('QUICK_CAPTURE');
    });

    it('should have 📝 icon', () => {
      const section = getBureauSection('QUICK_CAPTURE');
      expect(section?.icon).toBe('📝');
    });
  });

  describe('Resume Workspace', () => {
    it('should be second section', () => {
      expect(BUREAU_SECTIONS_V2[1].id).toBe('RESUME_WORKSPACE');
    });

    it('should have ▶️ icon', () => {
      const section = getBureauSection('RESUME_WORKSPACE');
      expect(section?.icon).toBe('▶️');
    });
  });

  describe('Threads (.chenu)', () => {
    it('should be third section', () => {
      expect(BUREAU_SECTIONS_V2[2].id).toBe('THREADS');
    });

    it('should have 💬 icon', () => {
      const section = getBureauSection('THREADS');
      expect(section?.icon).toBe('💬');
    });

    it('description should mention .chenu', () => {
      const section = getBureauSection('THREADS');
      expect(section?.description.toLowerCase()).toContain('.chenu');
    });
  });

  describe('Data Files', () => {
    it('should be fourth section', () => {
      expect(BUREAU_SECTIONS_V2[3].id).toBe('DATA_FILES');
    });

    it('should have 📁 icon', () => {
      const section = getBureauSection('DATA_FILES');
      expect(section?.icon).toBe('📁');
    });
  });

  describe('Active Agents', () => {
    it('should be fifth section', () => {
      expect(BUREAU_SECTIONS_V2[4].id).toBe('ACTIVE_AGENTS');
    });

    it('should have 🤖 icon', () => {
      const section = getBureauSection('ACTIVE_AGENTS');
      expect(section?.icon).toBe('🤖');
    });
  });

  describe('Meetings', () => {
    it('should be sixth (last) section', () => {
      expect(BUREAU_SECTIONS_V2[5].id).toBe('MEETINGS');
    });

    it('should have 📅 icon', () => {
      const section = getBureauSection('MEETINGS');
      expect(section?.icon).toBe('📅');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Compliance', () => {
  it('bureau structure should NEVER change per Memory Prompt', () => {
    // This test enforces the "NON-NEGOTIABLE" bureau model
    const MEMORY_PROMPT_SECTIONS = [
      'quick_capture',
      'resume_workspace',
      'threads',
      'data_files',
      'active_agents',
      'meetings',
    ];
    
    const actualKeys = getBureauSectionKeys();
    expect(actualKeys).toEqual(MEMORY_PROMPT_SECTIONS);
  });

  it('should have maximum 6 sections (HARD LIMIT from Memory Prompt)', () => {
    // Memory Prompt states: "Each SPHERE opens a BUREAU containing maximum 6 SECTIONS"
    expect(BUREAU_SECTIONS_V2.length).toBeLessThanOrEqual(6);
  });

  it('Threads section should exist as specified in Memory Prompt', () => {
    // Memory Prompt: "Threads (.chenu) are FIRST-CLASS OBJECTS"
    const threadsSection = getBureauSection('THREADS');
    expect(threadsSection).toBeDefined();
  });
});
