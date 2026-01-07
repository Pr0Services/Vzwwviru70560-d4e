/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — PBR MATERIALS TESTS
 * Unit tests for PBR Materials system
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import { PBRMaterialLibrary, getPBRLibrary, resetPBRLibrary } from './PBRMaterials';
import { ALL_PRESETS, getPresetById } from './MaterialPresets';
import { getTextureLoader, resetTextureLoader } from './TextureLoader';

// ═══════════════════════════════════════════════════════════════════════════════
// PBR MATERIAL LIBRARY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('PBRMaterialLibrary', () => {
  let library: PBRMaterialLibrary;

  beforeEach(() => {
    resetPBRLibrary();
    library = new PBRMaterialLibrary();
  });

  afterEach(() => {
    library.dispose();
    resetPBRLibrary();
  });

  it('should create a library instance', () => {
    expect(library).toBeInstanceOf(PBRMaterialLibrary);
  });

  it('should register a material', async () => {
    const config = {
      id: 'test_material',
      name: 'Test Material',
      category: 'wood' as const,
      maps: {},
      color: 0xff0000,
      roughness: 0.5,
      metalness: 0.0,
    };

    await library.registerMaterial(config);
    
    expect(library.hasMaterial('test_material')).toBe(true);
    expect(library.listMaterials()).toContain('test_material');
  });

  it('should get a registered material', async () => {
    const config = {
      id: 'test_oak',
      name: 'Test Oak',
      category: 'wood' as const,
      maps: {},
      color: 0x8B4513,
      roughness: 0.7,
    };

    await library.registerMaterial(config);
    const material = library.getMaterial('test_oak');

    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(material?.name).toBe('Test Oak');
  });

  it('should return null for non-existent material', () => {
    const material = library.getMaterial('non_existent');
    expect(material).toBeNull();
  });

  it('should preload multiple materials', async () => {
    const configs = [
      { id: 'mat1', name: 'Material 1', category: 'wood' as const, maps: {} },
      { id: 'mat2', name: 'Material 2', category: 'stone' as const, maps: {} },
    ];

    await library.preloadMaterials(configs);
    
    expect(library.hasMaterial('mat1')).toBe(true);
    expect(library.hasMaterial('mat2')).toBe(true);
  });

  it('should return correct stats', async () => {
    const config = {
      id: 'test',
      name: 'Test',
      category: 'metal' as const,
      maps: {},
    };

    await library.registerMaterial(config);
    const stats = library.getStats();

    expect(stats.totalMaterials).toBe(1);
    expect(stats.loadedMaterials).toBe(1);
    expect(stats.erroredMaterials).toBe(0);
  });

  it('should dispose all resources', async () => {
    const config = {
      id: 'test',
      name: 'Test',
      category: 'glass' as const,
      maps: {},
    };

    await library.registerMaterial(config);
    library.dispose();

    expect(library.listMaterials()).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL PRESETS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('MaterialPresets', () => {
  it('should have exactly 18 presets', () => {
    expect(ALL_PRESETS).toHaveLength(18);
  });

  it('should have 5 wood presets', () => {
    const woodPresets = ALL_PRESETS.filter(p => p.category === 'wood');
    expect(woodPresets).toHaveLength(5);
  });

  it('should have 5 stone presets', () => {
    const stonePresets = ALL_PRESETS.filter(p => p.category === 'stone');
    expect(stonePresets).toHaveLength(5);
  });

  it('should have 5 metal presets', () => {
    const metalPresets = ALL_PRESETS.filter(p => p.category === 'metal');
    expect(metalPresets).toHaveLength(5);
  });

  it('should have 3 glass presets', () => {
    const glassPresets = ALL_PRESETS.filter(p => p.category === 'glass');
    expect(glassPresets).toHaveLength(3);
  });

  it('should get preset by id', () => {
    const oak = getPresetById('oak');
    expect(oak).toBeDefined();
    expect(oak?.name).toBe('Oak Wood');
    expect(oak?.category).toBe('wood');
  });

  it('should return undefined for invalid id', () => {
    const preset = getPresetById('invalid_id');
    expect(preset).toBeUndefined();
  });

  it('should have unique IDs', () => {
    const ids = ALL_PRESETS.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('oak preset should have correct properties', () => {
    const oak = getPresetById('oak');
    expect(oak?.id).toBe('oak');
    expect(oak?.name).toBe('Oak Wood');
    expect(oak?.category).toBe('wood');
    expect(oak?.roughness).toBe(0.7);
    expect(oak?.metalness).toBe(0.0);
  });

  it('gold preset should have metalness = 1', () => {
    const gold = getPresetById('gold');
    expect(gold?.metalness).toBe(1.0);
    expect(gold?.category).toBe('metal');
  });

  it('glass presets should be transparent', () => {
    const clearGlass = getPresetById('clear_glass');
    const frostedGlass = getPresetById('frosted_glass');
    
    expect(clearGlass?.transparent).toBe(true);
    expect(frostedGlass?.transparent).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEXTURE LOADER TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('TextureLoader', () => {
  beforeEach(() => {
    resetTextureLoader();
  });

  afterEach(() => {
    resetTextureLoader();
  });

  it('should create loader instance', () => {
    const loader = getTextureLoader();
    expect(loader).toBeDefined();
  });

  it('should return singleton instance', () => {
    const loader1 = getTextureLoader();
    const loader2 = getTextureLoader();
    expect(loader1).toBe(loader2);
  });

  it('should have initial stats', () => {
    const loader = getTextureLoader();
    const stats = loader.getStats();
    
    expect(stats.cacheSize).toBe(0);
    expect(stats.totalLoaded).toBe(0);
    expect(stats.totalFailed).toBe(0);
  });

  it('should clear cache', () => {
    const loader = getTextureLoader();
    loader.clearCache();
    
    const stats = loader.getStats();
    expect(stats.cacheSize).toBe(0);
  });

  it('should calculate memory usage', () => {
    const loader = getTextureLoader();
    const memoryUsage = loader.getMemoryUsage();
    
    expect(typeof memoryUsage).toBe('number');
    expect(memoryUsage).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Integration: PBR System', () => {
  beforeEach(() => {
    resetPBRLibrary();
    resetTextureLoader();
  });

  afterEach(() => {
    resetPBRLibrary();
    resetTextureLoader();
  });

  it('should load all 18 presets', async () => {
    const library = getPBRLibrary();
    await library.preloadMaterials(ALL_PRESETS);
    
    const stats = library.getStats();
    expect(stats.totalMaterials).toBe(18);
    expect(stats.loadedMaterials).toBeGreaterThan(0);
  });

  it('should get materials for 7 spaces', async () => {
    const library = getPBRLibrary();
    await library.preloadMaterials(ALL_PRESETS);

    // Materials used by spaces
    const spaceMaterials = [
      'oak', 'weathered_wood', 'sandstone',           // Maison
      'brushed_aluminum', 'clear_glass', 'polished_steel', // Entreprise
      'concrete', 'iron_rusty', 'pine',               // Projets
      'marble', 'granite', 'gold',                    // Gouvernement
      'limestone', 'frosted_glass',                   // Immobilier
      'walnut', 'bamboo',                             // Associations
      'colored_glass',                                // Creative
    ];

    spaceMaterials.forEach(id => {
      const material = library.getMaterial(id);
      expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
    });
  });

  it('should handle missing materials gracefully', () => {
    const library = getPBRLibrary();
    const material = library.getMaterial('non_existent_material');
    
    expect(material).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('should load materials quickly', async () => {
    const library = new PBRMaterialLibrary();
    const config = {
      id: 'perf_test',
      name: 'Performance Test',
      category: 'wood' as const,
      maps: {},
    };

    const startTime = performance.now();
    await library.registerMaterial(config);
    const endTime = performance.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(100); // Should load in <100ms

    library.dispose();
  });

  it('should handle 18 presets efficiently', async () => {
    const library = new PBRMaterialLibrary();
    
    const startTime = performance.now();
    await library.preloadMaterials(ALL_PRESETS);
    const endTime = performance.now();
    
    const totalTime = endTime - startTime;
    console.log(`⏱️ Loaded 18 presets in ${totalTime.toFixed(2)}ms`);
    
    expect(totalTime).toBeLessThan(5000); // Should load all in <5s

    library.dispose();
  });

  it('should not leak memory on dispose', () => {
    const library = new PBRMaterialLibrary();
    
    library.dispose();
    const stats = library.getStats();
    
    expect(stats.totalMaterials).toBe(0);
    expect(stats.cacheSize).toBe(0);
  });
});
