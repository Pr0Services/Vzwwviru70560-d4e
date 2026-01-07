/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 MODULE INDEX
 * Complete 3D/XR system with PBR, Advanced Shaders, HDR, Post-Processing
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Phase 1: PBR Materials
export * from './materials/initPBRMaterials';
export * from './materials/world3d_materials_PBRMaterials';
export * from './materials/world3d_materials_MaterialPresets';
export * from './materials/world3d_materials_types';
export * from './materials/TextureLoader';
export * from './materials/PBRValidation';

// Phase 2: Advanced Shaders
export * from './shaders/AdvancedShaders';
export * from './shaders/AdvancedShaders_Extended';
export * from './shaders/ShaderShowcase';

// Phase 3: HDR + Effects
export * from './effects/HDRLighting';
export * from './effects/PostProcessing';
export * from './effects/AtmosphericEffects';
export * from './effects/CustomHDRI';
export * from './effects/ThemeTransitions';
export * from './effects/PerformanceMonitor';
export * from './effects/QualityAutoDetect';

// UI Components
export * from './ui/SettingsPanel';
export * from './ui/ThemeSwitcher';
export * from './ui/QualityPresetsSelector';
export * from './ui/V41Example';
export * from './ui/V41UIController';

// Integration (Main Entry Point)
export * from './integration/V41Complete';
export { default as V41IntegrationManager } from './integration/V41Complete';

// ═══════════════════════════════════════════════════════════════════════════
// QUICK START
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Usage:
 * 
 * import { initV41Complete, switchV41Theme } from './world3d/v41';
 * 
 * // In your scene setup:
 * const v41 = await initV41Complete(scene, renderer, camera);
 * 
 * // In animation loop:
 * v41.update();  // Updates atmospheric effects
 * v41.render();  // Renders with post-processing
 * 
 * // Theme switching:
 * await v41.switchTheme('atlean'); // 'normal' | 'atlean' | 'futuristic' | 'cosmic'
 */
