/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 POLISH — MOBILE QUALITY AUTO-DETECT
 * Automatic quality adjustment based on device capabilities
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type DeviceTier = 'high-end' | 'mid-range' | 'low-end' | 'potato';
export type QualityPreset = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

export interface DeviceCapabilities {
  tier: DeviceTier;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  gpu: string;
  cores: number;
  memory: number; // GB
  pixelRatio: number;
  maxTextureSize: number;
  webGLVersion: number;
  supportsWebGL2: boolean;
}

export interface QualitySettings {
  preset: QualityPreset;
  
  // Rendering
  pixelRatio: number;
  shadowMapSize: number;
  antialias: boolean;
  
  // Post-processing
  enablePostProcessing: boolean;
  bloomQuality: 'high' | 'medium' | 'low' | 'off';
  
  // Atmospheric
  enableAtmospheric: boolean;
  particleCount: number;
  enableFog: boolean;
  
  // Shaders
  enableAdvancedShaders: boolean;
  shaderComplexity: 'high' | 'medium' | 'low';
  
  // Textures
  textureQuality: number; // 0.25 to 1.0
  anisotropy: number;
  
  // Performance
  targetFPS: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

export class DeviceDetector {
  private static instance: DeviceDetector;
  private capabilities: DeviceCapabilities | null = null;

  private constructor() {}

  static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector();
    }
    return DeviceDetector.instance;
  }

  /**
   * Detect device capabilities
   */
  detect(): DeviceCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    const ua = navigator.userAgent;
    
    // Detect device type
    const isMobile = /iPhone|iPod|Android.*Mobile/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    const isDesktop = !isMobile && !isTablet;

    // Detect GPU
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    let gpu = 'Unknown';
    let maxTextureSize = 2048;
    let supportsWebGL2 = false;
    let webGLVersion = 1;

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      
      if (gl instanceof WebGL2RenderingContext) {
        supportsWebGL2 = true;
        webGLVersion = 2;
      }
    }

    // Detect cores (approximation)
    const cores = navigator.hardwareConcurrency || 4;

    // Detect memory (approximation, Chrome only)
    let memory = 4; // Default assumption
    if ('deviceMemory' in navigator) {
      memory = (navigator as any).deviceMemory || 4;
    }

    // Detect pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;

    // Determine tier based on multiple factors
    const tier = this.determineTier({
      isMobile,
      isTablet,
      gpu,
      cores,
      memory,
      pixelRatio,
      maxTextureSize,
      supportsWebGL2,
    });

    this.capabilities = {
      tier,
      isMobile,
      isTablet,
      isDesktop,
      gpu,
      cores,
      memory,
      pixelRatio,
      maxTextureSize,
      webGLVersion,
      supportsWebGL2,
    };

    console.log('🔍 Device capabilities detected:', this.capabilities);

    return this.capabilities;
  }

  /**
   * Determine device tier
   */
  private determineTier(info: {
    isMobile: boolean;
    isTablet: boolean;
    gpu: string;
    cores: number;
    memory: number;
    pixelRatio: number;
    maxTextureSize: number;
    supportsWebGL2: boolean;
  }): DeviceTier {
    const { isMobile, isTablet, gpu, cores, memory, maxTextureSize, supportsWebGL2 } = info;

    // Score calculation
    let score = 0;

    // GPU scoring
    if (gpu.includes('Apple M1') || gpu.includes('Apple M2') || gpu.includes('Apple M3')) {
      score += 100; // Apple Silicon is beast
    } else if (gpu.includes('RTX') || gpu.includes('RX 6') || gpu.includes('RX 7')) {
      score += 90; // High-end desktop GPU
    } else if (gpu.includes('GTX 16') || gpu.includes('GTX 10') || gpu.includes('RX 5')) {
      score += 70; // Mid-range desktop GPU
    } else if (gpu.includes('Intel Iris') || gpu.includes('AMD Radeon')) {
      score += 50; // Integrated GPU
    } else if (gpu.includes('Mali') || gpu.includes('Adreno')) {
      score += 30; // Mobile GPU
    } else {
      score += 20; // Unknown/old GPU
    }

    // CPU cores
    if (cores >= 8) score += 30;
    else if (cores >= 4) score += 20;
    else score += 10;

    // Memory
    if (memory >= 16) score += 30;
    else if (memory >= 8) score += 20;
    else if (memory >= 4) score += 10;
    else score += 5;

    // Texture size support
    if (maxTextureSize >= 16384) score += 20;
    else if (maxTextureSize >= 8192) score += 15;
    else if (maxTextureSize >= 4096) score += 10;
    else score += 5;

    // WebGL2 support
    if (supportsWebGL2) score += 10;

    // Platform penalties
    if (isMobile) score -= 40;
    else if (isTablet) score -= 20;

    // Determine tier
    if (score >= 140) return 'high-end';
    if (score >= 90) return 'mid-range';
    if (score >= 50) return 'low-end';
    return 'potato';
  }

  /**
   * Get capabilities (cached)
   */
  getCapabilities(): DeviceCapabilities {
    if (!this.capabilities) {
      return this.detect();
    }
    return this.capabilities;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const QUALITY_PRESETS: Record<QualityPreset, QualitySettings> = {
  // ULTRA - High-end desktop only
  ultra: {
    preset: 'ultra',
    pixelRatio: 2.0,
    shadowMapSize: 4096,
    antialias: true,
    enablePostProcessing: true,
    bloomQuality: 'high',
    enableAtmospheric: true,
    particleCount: 5000,
    enableFog: true,
    enableAdvancedShaders: true,
    shaderComplexity: 'high',
    textureQuality: 1.0,
    anisotropy: 16,
    targetFPS: 60,
  },

  // HIGH - Mid-range desktop / high-end mobile
  high: {
    preset: 'high',
    pixelRatio: 1.5,
    shadowMapSize: 2048,
    antialias: true,
    enablePostProcessing: true,
    bloomQuality: 'medium',
    enableAtmospheric: true,
    particleCount: 2000,
    enableFog: true,
    enableAdvancedShaders: true,
    shaderComplexity: 'medium',
    textureQuality: 0.75,
    anisotropy: 8,
    targetFPS: 60,
  },

  // MEDIUM - Low-end desktop / mid-range mobile
  medium: {
    preset: 'medium',
    pixelRatio: 1.0,
    shadowMapSize: 1024,
    antialias: false,
    enablePostProcessing: true,
    bloomQuality: 'low',
    enableAtmospheric: true,
    particleCount: 1000,
    enableFog: true,
    enableAdvancedShaders: false,
    shaderComplexity: 'low',
    textureQuality: 0.5,
    anisotropy: 4,
    targetFPS: 30,
  },

  // LOW - Low-end mobile
  low: {
    preset: 'low',
    pixelRatio: 1.0,
    shadowMapSize: 512,
    antialias: false,
    enablePostProcessing: false,
    bloomQuality: 'off',
    enableAtmospheric: false,
    particleCount: 0,
    enableFog: false,
    enableAdvancedShaders: false,
    shaderComplexity: 'low',
    textureQuality: 0.25,
    anisotropy: 1,
    targetFPS: 30,
  },

  // MINIMAL - Potato devices
  minimal: {
    preset: 'minimal',
    pixelRatio: 0.75,
    shadowMapSize: 256,
    antialias: false,
    enablePostProcessing: false,
    bloomQuality: 'off',
    enableAtmospheric: false,
    particleCount: 0,
    enableFog: false,
    enableAdvancedShaders: false,
    shaderComplexity: 'low',
    textureQuality: 0.25,
    anisotropy: 1,
    targetFPS: 20,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class QualityManager {
  private static instance: QualityManager;
  
  private detector: DeviceDetector;
  private currentSettings: QualitySettings;
  private autoQuality: boolean = true;

  private constructor() {
    this.detector = DeviceDetector.getInstance();
    
    // Auto-detect and apply quality
    const capabilities = this.detector.detect();
    this.currentSettings = this.getRecommendedQuality(capabilities);
    
    console.log(`🎨 Auto quality preset: ${this.currentSettings.preset}`);
  }

  static getInstance(): QualityManager {
    if (!QualityManager.instance) {
      QualityManager.instance = new QualityManager();
    }
    return QualityManager.instance;
  }

  /**
   * Get recommended quality based on device capabilities
   */
  getRecommendedQuality(capabilities: DeviceCapabilities): QualitySettings {
    switch (capabilities.tier) {
      case 'high-end':
        return QUALITY_PRESETS.ultra;
      case 'mid-range':
        return QUALITY_PRESETS.high;
      case 'low-end':
        return QUALITY_PRESETS.medium;
      case 'potato':
        return QUALITY_PRESETS.low;
      default:
        return QUALITY_PRESETS.medium;
    }
  }

  /**
   * Apply quality settings to renderer
   */
  applyToRenderer(renderer: THREE.WebGLRenderer): void {
    const settings = this.currentSettings;

    renderer.setPixelRatio(Math.min(settings.pixelRatio, window.devicePixelRatio));
    renderer.shadowMap.enabled = settings.shadowMapSize > 0;
    
    if (renderer.shadowMap.enabled) {
      renderer.shadowMap.type = settings.shadowMapSize >= 2048 
        ? THREE.PCFSoftShadowMap 
        : THREE.BasicShadowMap;
    }

    console.log(`✅ Quality settings applied to renderer: ${settings.preset}`);
  }

  /**
   * Get current quality settings
   */
  getSettings(): QualitySettings {
    return this.currentSettings;
  }

  /**
   * Set quality preset manually
   */
  setQuality(preset: QualityPreset): void {
    this.currentSettings = QUALITY_PRESETS[preset];
    this.autoQuality = false;
    console.log(`🎨 Manual quality preset: ${preset}`);
  }

  /**
   * Enable/disable auto quality
   */
  setAutoQuality(enabled: boolean): void {
    this.autoQuality = enabled;
    
    if (enabled) {
      const capabilities = this.detector.getCapabilities();
      this.currentSettings = this.getRecommendedQuality(capabilities);
      console.log(`🎨 Auto quality enabled: ${this.currentSettings.preset}`);
    }
  }

  /**
   * Check if auto quality is enabled
   */
  isAutoQuality(): boolean {
    return this.autoQuality;
  }

  /**
   * Get device capabilities
   */
  getCapabilities(): DeviceCapabilities {
    return this.detector.getCapabilities();
  }

  /**
   * Print quality report
   */
  printReport(): void {
    const caps = this.detector.getCapabilities();
    const settings = this.currentSettings;

    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                  QUALITY AUTO-DETECT REPORT                       ║
╚═══════════════════════════════════════════════════════════════════╝

DEVICE:
  Type: ${caps.isMobile ? 'Mobile' : caps.isTablet ? 'Tablet' : 'Desktop'}
  Tier: ${caps.tier}
  GPU: ${caps.gpu}
  Cores: ${caps.cores}
  Memory: ${caps.memory}GB
  Pixel Ratio: ${caps.pixelRatio}
  WebGL: ${caps.webGLVersion}
  Max Texture: ${caps.maxTextureSize}px

QUALITY PRESET: ${settings.preset.toUpperCase()}
  Pixel Ratio: ${settings.pixelRatio}
  Shadow Map: ${settings.shadowMapSize}px
  Antialias: ${settings.antialias}
  Post-Processing: ${settings.enablePostProcessing}
  Bloom: ${settings.bloomQuality}
  Atmospheric: ${settings.enableAtmospheric}
  Particles: ${settings.particleCount}
  Fog: ${settings.enableFog}
  Advanced Shaders: ${settings.enableAdvancedShaders}
  Texture Quality: ${settings.textureQuality * 100}%
  Target FPS: ${settings.targetFPS}

Auto Quality: ${this.autoQuality ? 'ENABLED' : 'DISABLED'}
    `);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Auto-detect and return recommended quality
 */
export function autoDetectQuality(): QualitySettings {
  const manager = QualityManager.getInstance();
  return manager.getSettings();
}

/**
 * Apply quality settings to renderer
 */
export function applyQualityToRenderer(renderer: THREE.WebGLRenderer): void {
  const manager = QualityManager.getInstance();
  manager.applyToRenderer(renderer);
}

/**
 * Get device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  const detector = DeviceDetector.getInstance();
  return detector.detect();
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  const caps = getDeviceCapabilities();
  return caps.isMobile;
}

/**
 * Check if device is low-end
 */
export function isLowEndDevice(): boolean {
  const caps = getDeviceCapabilities();
  return caps.tier === 'low-end' || caps.tier === 'potato';
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default QualityManager;
