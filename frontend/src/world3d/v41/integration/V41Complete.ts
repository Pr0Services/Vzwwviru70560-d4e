/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — COMPLETE INTEGRATION (PHASES 1-3)
 * Integrated system: PBR Materials + Advanced Shaders + HDR Lighting
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { getPBRLibrary, initPBRMaterials } from '../CHENU_V41_DEVELOPMENT/initPBRMaterials';
import { 
  AdvancedShaderManager, 
  startShaderAnimations,
  stopShaderAnimations,
  type ShaderType 
} from '../CHENU_V41_PHASE2/AdvancedShaders';
import { 
  LightingManager,
  setLightingTheme,
  type LightingTheme 
} from '../CHENU_V41_PHASE3/HDRLighting';
import {
  PostProcessingManager,
  setPostProcessingTheme,
} from '../CHENU_V41_PHASE3/PostProcessing';
import {
  AtmosphericManager,
  setAtmosphericTheme,
  updateAtmosphericEffects,
} from '../CHENU_V41_PHASE3/AtmosphericEffects';
import {
  ThemeTransitionManager,
  smoothTransitionTo,
} from '../CHENU_V41_POLISH/ThemeTransitions';
import {
  QualityManager,
  autoDetectQuality,
  applyQualityToRenderer,
  type QualitySettings,
} from '../CHENU_V41_POLISH/QualityAutoDetect';
import {
  HDRIManager,
  loadHDRIForTheme,
} from '../CHENU_V41_POLISH/CustomHDRI';
import {
  AdaptiveQualityManager,
  updatePerformance,
  enableAdaptiveQuality,
  type PerformanceStats,
} from '../CHENU_V41_POLISH/PerformanceMonitor';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type V41Theme = LightingTheme; // 'normal' | 'atlean' | 'futuristic' | 'cosmic'

export interface V41InitOptions {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  enableShaders?: boolean;
  enableHDR?: boolean;
  enablePostProcessing?: boolean;
  enableAtmospheric?: boolean;
  enableAdaptiveQuality?: boolean;
  defaultTheme?: V41Theme;
  preloadMaterials?: boolean;
}

export interface V41Stats {
  phase1: {
    materialsLoaded: number;
    texturesCached: number;
    errors: number;
  };
  phase2: {
    shadersActive: number;
    animationsRunning: boolean;
  };
  phase3: {
    currentTheme: V41Theme;
    hdriLoaded: boolean;
    toneMappingEnabled: boolean;
    postProcessingEnabled: boolean;
    atmosphericEnabled: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// V41 INTEGRATION MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class V41IntegrationManager {
  private static instance: V41IntegrationManager;
  
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.Camera;
  private pbrLibrary: any;
  private shaderManager: AdvancedShaderManager;
  private lightingManager: LightingManager;
  private postProcessingManager: PostProcessingManager;
  private atmosphericManager: AtmosphericManager;
  private transitionManager: ThemeTransitionManager;
  private qualityManager: QualityManager;
  private hdriManager: HDRIManager;
  private performanceManager: AdaptiveQualityManager;
  
  private initialized: boolean = false;
  private currentTheme: V41Theme = 'normal';

  private constructor(options: V41InitOptions) {
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.camera = options.camera;
    
    // Initialize managers
    this.pbrLibrary = getPBRLibrary();
    this.shaderManager = AdvancedShaderManager.getInstance();
    this.lightingManager = LightingManager.getInstance(this.scene, this.renderer);
    this.postProcessingManager = PostProcessingManager.getInstance(this.scene, this.camera, this.renderer);
    this.atmosphericManager = AtmosphericManager.getInstance(this.scene);
    this.transitionManager = ThemeTransitionManager.getInstance();
    this.qualityManager = QualityManager.getInstance();
    this.hdriManager = HDRIManager.getInstance(this.scene, this.renderer);
    this.performanceManager = AdaptiveQualityManager.getInstance();
  }

  static async initialize(options: V41InitOptions): Promise<V41IntegrationManager> {
    console.log('🚀 Initializing CHE·NU V41 Complete System...');
    
    if (!V41IntegrationManager.instance) {
      V41IntegrationManager.instance = new V41IntegrationManager(options);
      await V41IntegrationManager.instance.init(options);
    }
    
    return V41IntegrationManager.instance;
  }

  static getInstance(): V41IntegrationManager {
    if (!V41IntegrationManager.instance) {
      throw new Error('V41IntegrationManager not initialized. Call initialize() first.');
    }
    return V41IntegrationManager.instance;
  }

  private async init(options: V41InitOptions): Promise<void> {
    const startTime = performance.now();

    try {
      // PHASE 0: Quality Auto-Detect & Configuration
      console.log('⚙️ Phase 0: Configuring quality settings...');
      const qualitySettings = autoDetectQuality();
      applyQualityToRenderer(this.renderer);
      console.log(`✅ Phase 0: Quality preset "${qualitySettings.preset}" applied`);
      
      // Enable adaptive quality if requested
      if (options.enableAdaptiveQuality !== false) {
        enableAdaptiveQuality({
          enabled: true,
          thresholds: {
            target: qualitySettings.targetFPS,
            warning: qualitySettings.targetFPS * 0.75,
            critical: qualitySettings.targetFPS * 0.5,
            upgradeAfter: 180,
            downgradeAfter: 60,
          },
          allowUpgrade: true,
          allowDowngrade: true,
          minPreset: 'low',
          maxPreset: qualitySettings.preset,
        });
        console.log('✅ Adaptive quality enabled');
      }

      // PHASE 1: PBR Materials
      console.log('📦 Phase 1: Loading PBR Materials...');
      await initPBRMaterials();
      console.log('✅ Phase 1: PBR Materials loaded');

      // PHASE 2: Advanced Shaders (if enabled)
      if (options.enableShaders !== false) {
        console.log('🎨 Phase 2: Initializing Advanced Shaders...');
        startShaderAnimations();
        console.log('✅ Phase 2: Advanced Shaders ready');
      }

      // PHASE 3: HDR Lighting + Post-Processing + Atmospheric (if enabled)
      if (options.enableHDR !== false) {
        console.log('💡 Phase 3: Setting up HDR Lighting + Effects...');
        const theme = options.defaultTheme || 'normal';
        
        // Lighting
        await this.lightingManager.applyPreset(theme);
        
        // Post-Processing
        if (options.enablePostProcessing !== false) {
          this.postProcessingManager.applyPreset(theme);
        }
        
        // Atmospheric
        if (options.enableAtmospheric !== false) {
          this.atmosphericManager.applyPreset(theme);
        }
        
        this.currentTheme = theme;
        console.log(`✅ Phase 3: Complete effects applied (${theme})`);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.initialized = true;

      console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ✅ CHE·NU V41 COMPLETE SYSTEM INITIALIZED! ✅                 ║
║                                                                   ║
║   Phase 1: PBR Materials ✅                                      ║
║   Phase 2: Advanced Shaders (9) ✅                               ║
║   Phase 3: HDR + Post-FX + Atmospheric ✅                        ║
║                                                                   ║
║   Load time: ${duration.toFixed(2)}ms                                     ║
║   Theme: ${this.currentTheme}                                         ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
      `);

    } catch (error) {
      console.error('❌ V41 Initialization failed:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async switchTheme(newTheme: V41Theme, smooth: boolean = true): Promise<void> {
    if (!this.initialized) {
      throw new Error('V41IntegrationManager not initialized');
    }

    console.log(`🎨 Switching theme: ${this.currentTheme} → ${newTheme}`);

    if (smooth) {
      // Use smooth transition system
      await smoothTransitionTo(newTheme, 2000, 'easeInOut');
    } else {
      // Instant switch
      await this.lightingManager.applyPreset(newTheme);
      this.postProcessingManager.applyPreset(newTheme);
      this.atmosphericManager.applyPreset(newTheme);
    }
    
    // Load HDRI for theme (async, non-blocking)
    loadHDRIForTheme(newTheme).catch(err => {
      console.warn(`Failed to load HDRI for ${newTheme}:`, err);
    });

    this.currentTheme = newTheme;
    console.log(`✅ Theme switched to: ${newTheme}`);
  }

  getCurrentTheme(): V41Theme {
    return this.currentTheme;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION LOOP METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update atmospheric effects and performance monitoring (call in animation loop)
   */
  update(): void {
    updateAtmosphericEffects();
    updatePerformance(); // Adaptive quality monitoring
  }

  /**
   * Render with post-processing (call in animation loop)
   */
  render(): void {
    this.postProcessingManager.render();
  }

  /**
   * Handle window resize
   */
  handleResize(width: number, height: number): void {
    this.postProcessingManager.handleResize(width, height);
  }

  /**
   * Get performance stats
   */
  getPerformanceStats(): PerformanceStats {
    return this.performanceManager.getStats();
  }

  /**
   * Get quality settings
   */
  getQualitySettings(): QualitySettings {
    return this.qualityManager.getSettings();
  }

  /**
   * Enable/disable adaptive quality
   */
  setAdaptiveQuality(enabled: boolean): void {
    if (enabled) {
      this.performanceManager.enable();
    } else {
      this.performanceManager.disable();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MATERIAL MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  getMaterial(materialId: string): THREE.Material | null {
    return this.pbrLibrary.getMaterial(materialId);
  }

  getShaderMaterial(shaderType: ShaderType): THREE.ShaderMaterial | undefined {
    return this.shaderManager.getShader(shaderType);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATS & MONITORING
  // ═══════════════════════════════════════════════════════════════════════════

  getStats(): V41Stats {
    const pbrStats = this.pbrLibrary.getStats();
    
    return {
      phase1: {
        materialsLoaded: pbrStats.materialsLoaded,
        texturesCached: pbrStats.texturesCached,
        errors: pbrStats.errors,
      },
      phase2: {
        shadersActive: 9, // subsurface, holographic, nebula, water, energy, crystal, circuit, plasma, glyph
        animationsRunning: true, // TODO: track actual state
      },
      phase3: {
        currentTheme: this.currentTheme,
        hdriLoaded: this.scene.environment !== null,
        toneMappingEnabled: this.renderer.toneMapping !== THREE.NoToneMapping,
        postProcessingEnabled: true, // TODO: track actual state
        atmosphericEnabled: true, // TODO: track actual state
      },
    };
  }

  printStats(): void {
    const stats = this.getStats();
    
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                  CHE·NU V41 SYSTEM STATS                         ║
╚═══════════════════════════════════════════════════════════════════╝

PHASE 1 (PBR Materials):
  Materials loaded: ${stats.phase1.materialsLoaded}
  Textures cached: ${stats.phase1.texturesCached}
  Errors: ${stats.phase1.errors}

PHASE 2 (Advanced Shaders):
  Shaders active: ${stats.phase2.shadersActive}
  Animations running: ${stats.phase2.animationsRunning}

PHASE 3 (Lighting + Effects):
  Current theme: ${stats.phase3.currentTheme}
  HDRI loaded: ${stats.phase3.hdriLoaded}
  Tone mapping: ${stats.phase3.toneMappingEnabled}
  Post-processing: ${stats.phase3.postProcessingEnabled}
  Atmospheric FX: ${stats.phase3.atmosphericEnabled}
    `);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════

  dispose(): void {
    console.log('🧹 Disposing V41 Integration Manager...');
    
    stopShaderAnimations();
    this.shaderManager.dispose();
    this.lightingManager.dispose();
    this.postProcessingManager.dispose();
    this.atmosphericManager.dispose();
    this.hdriManager.dispose();
    
    this.initialized = false;
    console.log('✅ V41 Integration Manager disposed');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize complete V41 system with all phases
 */
export async function initV41Complete(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  options?: Partial<V41InitOptions>
): Promise<V41IntegrationManager> {
  return await V41IntegrationManager.initialize({
    scene,
    renderer,
    camera,
    enableShaders: true,
    enableHDR: true,
    enablePostProcessing: true,
    enableAtmospheric: true,
    enableAdaptiveQuality: true,
    defaultTheme: 'normal',
    preloadMaterials: true,
    ...options,
  });
}

/**
 * Quick switch theme
 */
export async function switchV41Theme(theme: V41Theme, smooth: boolean = true): Promise<void> {
  const manager = V41IntegrationManager.getInstance();
  await manager.switchTheme(theme, smooth);
}

/**
 * Get current V41 stats
 */
export function getV41Stats(): V41Stats {
  const manager = V41IntegrationManager.getInstance();
  return manager.getStats();
}

/**
 * Check if V41 is initialized
 */
export function isV41Initialized(): boolean {
  try {
    V41IntegrationManager.getInstance();
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default V41IntegrationManager;
