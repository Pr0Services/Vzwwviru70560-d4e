/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 3 EXTENDED — POST-PROCESSING SYSTEM
 * Bloom, Color Grading, DOF, and Atmospheric Effects per theme
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PostProcessingTheme = 'normal' | 'atlean' | 'futuristic' | 'cosmic';

export interface BloomSettings {
  threshold: number;
  strength: number;
  radius: number;
  enabled: boolean;
}

export interface ColorGradingSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  tint: THREE.Color;
  enabled: boolean;
}

export interface VignetteSettings {
  darkness: number;
  offset: number;
  enabled: boolean;
}

export interface PostProcessingPreset {
  theme: PostProcessingTheme;
  bloom: BloomSettings;
  colorGrading: ColorGradingSettings;
  vignette: VignetteSettings;
  fxaa: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESSING PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const POST_PROCESSING_PRESETS: Record<PostProcessingTheme, PostProcessingPreset> = {
  // NORMAL THEME - Clean, minimal post-processing
  normal: {
    theme: 'normal',
    bloom: {
      threshold: 0.95,
      strength: 0.2,
      radius: 0.3,
      enabled: true,
    },
    colorGrading: {
      brightness: 0.0,
      contrast: 1.0,
      saturation: 1.0,
      tint: new THREE.Color(1.0, 1.0, 1.0),
      enabled: false,
    },
    vignette: {
      darkness: 0.5,
      offset: 0.5,
      enabled: false,
    },
    fxaa: true,
  },

  // ATLEAN THEME - Warm, golden, dreamy
  atlean: {
    theme: 'atlean',
    bloom: {
      threshold: 0.7,
      strength: 0.6,
      radius: 0.9,
      enabled: true,
    },
    colorGrading: {
      brightness: 0.05,
      contrast: 1.1,
      saturation: 1.15,
      tint: new THREE.Color(1.1, 0.95, 0.85), // Warm golden tint
      enabled: true,
    },
    vignette: {
      darkness: 0.6,
      offset: 0.6,
      enabled: true,
    },
    fxaa: true,
  },

  // FUTURISTIC THEME - High contrast, intense bloom
  futuristic: {
    theme: 'futuristic',
    bloom: {
      threshold: 0.4,
      strength: 1.3,
      radius: 1.1,
      enabled: true,
    },
    colorGrading: {
      brightness: -0.05,
      contrast: 1.25,
      saturation: 1.3,
      tint: new THREE.Color(0.9, 1.0, 1.1), // Cool cyan tint
      enabled: true,
    },
    vignette: {
      darkness: 0.8,
      offset: 0.4,
      enabled: true,
    },
    fxaa: true,
  },

  // COSMIC THEME - Deep, ethereal, maximum bloom
  cosmic: {
    theme: 'cosmic',
    bloom: {
      threshold: 0.3,
      strength: 1.6,
      radius: 1.3,
      enabled: true,
    },
    colorGrading: {
      brightness: 0.1,
      contrast: 1.15,
      saturation: 1.4,
      tint: new THREE.Color(0.95, 0.9, 1.15), // Purple-blue tint
      enabled: true,
    },
    vignette: {
      darkness: 0.9,
      offset: 0.3,
      enabled: true,
    },
    fxaa: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR GRADING SHADER
// ═══════════════════════════════════════════════════════════════════════════════

const ColorGradingShader = {
  uniforms: {
    tDiffuse: { value: null },
    brightness: { value: 0.0 },
    contrast: { value: 1.0 },
    saturation: { value: 1.0 },
    tint: { value: new THREE.Color(1.0, 1.0, 1.0) },
  },

  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float brightness;
    uniform float contrast;
    uniform float saturation;
    uniform vec3 tint;
    
    varying vec2 vUv;
    
    vec3 adjustBrightness(vec3 color, float b) {
      return color + b;
    }
    
    vec3 adjustContrast(vec3 color, float c) {
      return (color - 0.5) * c + 0.5;
    }
    
    vec3 adjustSaturation(vec3 color, float s) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      return mix(vec3(luminance), color, s);
    }
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 color = texel.rgb;
      
      // Apply adjustments
      color = adjustBrightness(color, brightness);
      color = adjustContrast(color, contrast);
      color = adjustSaturation(color, saturation);
      
      // Apply tint
      color *= tint;
      
      gl_FragColor = vec4(color, texel.a);
    }
  `,
};

// ═══════════════════════════════════════════════════════════════════════════════
// VIGNETTE SHADER
// ═══════════════════════════════════════════════════════════════════════════════

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    darkness: { value: 1.0 },
    offset: { value: 1.0 },
  },

  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = length(uv);
      float vignette = smoothstep(offset, offset - darkness, dist);
      
      gl_FragColor = vec4(texel.rgb * vignette, texel.a);
    }
  `,
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESSING MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class PostProcessingManager {
  private static instance: PostProcessingManager;
  
  private composer: EffectComposer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  
  // Passes
  private renderPass: RenderPass;
  private bloomPass: UnrealBloomPass | null = null;
  private colorGradingPass: ShaderPass | null = null;
  private vignettePass: ShaderPass | null = null;
  private fxaaPass: ShaderPass | null = null;
  
  private currentTheme: PostProcessingTheme = 'normal';
  private enabled: boolean = true;

  private constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    // Create composer
    this.composer = new EffectComposer(renderer);
    
    // Render pass (always first)
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);
    
    // Initialize with default theme
    this.initializePasses();
    this.applyPreset('normal');
  }

  static getInstance(
    scene?: THREE.Scene,
    camera?: THREE.Camera,
    renderer?: THREE.WebGLRenderer
  ): PostProcessingManager {
    if (!PostProcessingManager.instance) {
      if (!scene || !camera || !renderer) {
        throw new Error('PostProcessingManager requires scene, camera, and renderer on first init');
      }
      PostProcessingManager.instance = new PostProcessingManager(scene, camera, renderer);
    }
    return PostProcessingManager.instance;
  }

  private initializePasses(): void {
    // Bloom pass
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // strength
      0.5, // radius
      0.5  // threshold
    );
    this.composer.addPass(this.bloomPass);

    // Color grading pass
    this.colorGradingPass = new ShaderPass(ColorGradingShader);
    this.composer.addPass(this.colorGradingPass);

    // Vignette pass
    this.vignettePass = new ShaderPass(VignetteShader);
    this.composer.addPass(this.vignettePass);

    // FXAA pass (always last for anti-aliasing)
    this.fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
    this.composer.addPass(this.fxaaPass);
  }

  applyPreset(theme: PostProcessingTheme): void {
    const preset = POST_PROCESSING_PRESETS[theme];
    if (!preset) {
      console.error(`Unknown post-processing theme: ${theme}`);
      return;
    }

    console.log(`🎨 Applying post-processing preset: ${theme}`);

    // Bloom
    if (this.bloomPass) {
      this.bloomPass.threshold = preset.bloom.threshold;
      this.bloomPass.strength = preset.bloom.strength;
      this.bloomPass.radius = preset.bloom.radius;
      this.bloomPass.enabled = preset.bloom.enabled;
    }

    // Color Grading
    if (this.colorGradingPass) {
      this.colorGradingPass.uniforms['brightness'].value = preset.colorGrading.brightness;
      this.colorGradingPass.uniforms['contrast'].value = preset.colorGrading.contrast;
      this.colorGradingPass.uniforms['saturation'].value = preset.colorGrading.saturation;
      this.colorGradingPass.uniforms['tint'].value = preset.colorGrading.tint;
      this.colorGradingPass.enabled = preset.colorGrading.enabled;
    }

    // Vignette
    if (this.vignettePass) {
      this.vignettePass.uniforms['darkness'].value = preset.vignette.darkness;
      this.vignettePass.uniforms['offset'].value = preset.vignette.offset;
      this.vignettePass.enabled = preset.vignette.enabled;
    }

    // FXAA
    if (this.fxaaPass) {
      this.fxaaPass.enabled = preset.fxaa;
    }

    this.currentTheme = theme;
    console.log(`✅ Post-processing applied: ${theme}`);
  }

  /**
   * Update bloom settings
   */
  updateBloom(settings: Partial<BloomSettings>): void {
    if (!this.bloomPass) return;

    if (settings.threshold !== undefined) this.bloomPass.threshold = settings.threshold;
    if (settings.strength !== undefined) this.bloomPass.strength = settings.strength;
    if (settings.radius !== undefined) this.bloomPass.radius = settings.radius;
    if (settings.enabled !== undefined) this.bloomPass.enabled = settings.enabled;
  }

  /**
   * Update color grading settings
   */
  updateColorGrading(settings: Partial<ColorGradingSettings>): void {
    if (!this.colorGradingPass) return;

    if (settings.brightness !== undefined) {
      this.colorGradingPass.uniforms['brightness'].value = settings.brightness;
    }
    if (settings.contrast !== undefined) {
      this.colorGradingPass.uniforms['contrast'].value = settings.contrast;
    }
    if (settings.saturation !== undefined) {
      this.colorGradingPass.uniforms['saturation'].value = settings.saturation;
    }
    if (settings.tint !== undefined) {
      this.colorGradingPass.uniforms['tint'].value = settings.tint;
    }
    if (settings.enabled !== undefined) {
      this.colorGradingPass.enabled = settings.enabled;
    }
  }

  /**
   * Update vignette settings
   */
  updateVignette(settings: Partial<VignetteSettings>): void {
    if (!this.vignettePass) return;

    if (settings.darkness !== undefined) {
      this.vignettePass.uniforms['darkness'].value = settings.darkness;
    }
    if (settings.offset !== undefined) {
      this.vignettePass.uniforms['offset'].value = settings.offset;
    }
    if (settings.enabled !== undefined) {
      this.vignettePass.enabled = settings.enabled;
    }
  }

  /**
   * Render frame with post-processing
   */
  render(): void {
    if (this.enabled) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Handle window resize
   */
  handleResize(width: number, height: number): void {
    this.composer.setSize(width, height);

    // Update FXAA resolution
    if (this.fxaaPass) {
      const pixelRatio = this.renderer.getPixelRatio();
      this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
      this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
    }
  }

  /**
   * Enable/disable post-processing
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): PostProcessingTheme {
    return this.currentTheme;
  }

  /**
   * Get current preset
   */
  getCurrentPreset(): PostProcessingPreset {
    return POST_PROCESSING_PRESETS[this.currentTheme];
  }

  /**
   * Dispose all passes
   */
  dispose(): void {
    this.composer.dispose();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize post-processing system
 */
export function initPostProcessing(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
): PostProcessingManager {
  const manager = PostProcessingManager.getInstance(scene, camera, renderer);
  manager.applyPreset('normal');
  return manager;
}

/**
 * Apply post-processing preset for theme
 */
export function setPostProcessingTheme(theme: PostProcessingTheme): void {
  const manager = PostProcessingManager.getInstance();
  manager.applyPreset(theme);
}

/**
 * Get post-processing preset
 */
export function getPostProcessingPreset(theme: PostProcessingTheme): PostProcessingPreset {
  return POST_PROCESSING_PRESETS[theme];
}

/**
 * Render with post-processing
 */
export function renderWithPostProcessing(): void {
  const manager = PostProcessingManager.getInstance();
  manager.render();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default PostProcessingManager;
