/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 - PBR MATERIALS INITIALIZATION
 * Preload and initialize all PBR materials for the 7 spaces
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { getPBRLibrary } from './materials/PBRMaterials';
import { ALL_PRESETS } from './materials/MaterialPresets';
import { preloadAllSpaceMaterials } from './config/spacesConfig';

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize PBR materials system
 * Call this once at app startup
 */
export async function initPBRMaterials(): Promise<void> {
  if (isInitialized) {
    console.log('✅ PBR materials already initialized');
    return;
  }

  if (initPromise) {
    console.log('⏳ PBR materials initialization in progress...');
    return initPromise;
  }

  console.log('🎨 Initializing PBR materials system...');
  
  initPromise = (async () => {
    try {
      const startTime = performance.now();
      const library = getPBRLibrary();

      // Strategy 1: Preload only materials used by spaces (recommended)
      const spaceMaterials = await preloadAllSpaceMaterials();
      console.log(`📦 Preloading ${spaceMaterials.length} materials for spaces...`);
      
      const configs = ALL_PRESETS.filter(preset => 
        spaceMaterials.includes(preset.id as any)
      );
      
      await library.preloadMaterials(configs);

      // Strategy 2: Preload ALL 18 materials (use if you need all)
      // await library.preloadMaterials(ALL_PRESETS);

      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      const stats = library.getStats();
      console.log('✅ PBR Materials System initialized!');
      console.log(`   - Load time: ${loadTime}ms`);
      console.log(`   - Materials loaded: ${stats.loadedMaterials}/${stats.totalMaterials}`);
      console.log(`   - Textures cached: ${stats.cacheSize}`);
      console.log(`   - Errors: ${stats.erroredMaterials}`);

      isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize PBR materials:', error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Check if materials are initialized
 */
export function isPBRInitialized(): boolean {
  return isInitialized;
}

/**
 * Get initialization stats
 */
export function getPBRStats() {
  const library = getPBRLibrary();
  return library.getStats();
}

/**
 * Reset materials system (useful for testing)
 */
export function resetPBRMaterials(): void {
  const library = getPBRLibrary();
  library.dispose();
  isInitialized = false;
  initPromise = null;
  console.log('🔄 PBR materials system reset');
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-INIT (Optional)
// ═══════════════════════════════════════════════════════════════════════════════

// Uncomment to auto-initialize when module is imported
// initPBRMaterials().catch(console.error);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default initPBRMaterials;
