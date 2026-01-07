/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 POLISH — SMOOTH THEME TRANSITIONS
 * Crossfade lighting, post-processing, and atmospheric effects
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { LightingManager, type LightingTheme } from '../CHENU_V41_PHASE3/HDRLighting';
import { PostProcessingManager } from '../CHENU_V41_PHASE3/PostProcessing';
import { AtmosphericManager } from '../CHENU_V41_PHASE3/AtmosphericEffects';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type V41Theme = 'normal' | 'atlean' | 'futuristic' | 'cosmic';

export interface TransitionConfig {
  duration: number;           // ms
  easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  crossfade: boolean;         // Enable lighting crossfade
  animateParticles: boolean;  // Animate particle count changes
  smoothFog: boolean;         // Smooth fog density transitions
}

export interface TransitionState {
  active: boolean;
  fromTheme: V41Theme;
  toTheme: V41Theme;
  progress: number;           // 0.0 to 1.0
  startTime: number;
  config: TransitionConfig;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const EasingFunctions = {
  linear: (t: number): number => t,
  
  easeInOut: (t: number): number => {
    return t < 0.5 
      ? 2 * t * t 
      : -1 + (4 - 2 * t) * t;
  },
  
  easeIn: (t: number): number => t * t,
  
  easeOut: (t: number): number => t * (2 - t),
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITION MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class ThemeTransitionManager {
  private static instance: ThemeTransitionManager;
  
  private lightingManager: LightingManager;
  private postProcessingManager: PostProcessingManager;
  private atmosphericManager: AtmosphericManager;
  
  private currentState: TransitionState | null = null;
  private animationFrameId: number | null = null;

  private constructor() {
    this.lightingManager = LightingManager.getInstance();
    this.postProcessingManager = PostProcessingManager.getInstance();
    this.atmosphericManager = AtmosphericManager.getInstance();
  }

  static getInstance(): ThemeTransitionManager {
    if (!ThemeTransitionManager.instance) {
      ThemeTransitionManager.instance = new ThemeTransitionManager();
    }
    return ThemeTransitionManager.instance;
  }

  /**
   * Start smooth transition from current theme to new theme
   */
  async transitionTo(
    toTheme: V41Theme,
    config: Partial<TransitionConfig> = {}
  ): Promise<void> {
    // Cancel any existing transition
    this.cancelTransition();

    const fromTheme = this.lightingManager.getCurrentTheme();
    
    // No transition needed if already on target theme
    if (fromTheme === toTheme) {
      console.log(`Already on theme: ${toTheme}`);
      return;
    }

    const fullConfig: TransitionConfig = {
      duration: 2000,
      easing: 'easeInOut',
      crossfade: true,
      animateParticles: true,
      smoothFog: true,
      ...config,
    };

    console.log(`🎨 Starting smooth transition: ${fromTheme} → ${toTheme} (${fullConfig.duration}ms)`);

    this.currentState = {
      active: true,
      fromTheme,
      toTheme,
      progress: 0.0,
      startTime: performance.now(),
      config: fullConfig,
    };

    // Start animation loop
    this.animate();

    // Wait for transition to complete
    return new Promise((resolve) => {
      const checkComplete = () => {
        if (!this.currentState || !this.currentState.active) {
          resolve();
        } else {
          requestAnimationFrame(checkComplete);
        }
      };
      checkComplete();
    });
  }

  /**
   * Animation loop for smooth transitions
   */
  private animate = (): void => {
    if (!this.currentState || !this.currentState.active) return;

    const now = performance.now();
    const elapsed = now - this.currentState.startTime;
    const rawProgress = Math.min(elapsed / this.currentState.config.duration, 1.0);
    
    // Apply easing
    const easingFn = EasingFunctions[this.currentState.config.easing];
    const progress = easingFn(rawProgress);
    
    this.currentState.progress = progress;

    // Update all systems with interpolated values
    this.updateTransition(progress);

    // Check if complete
    if (rawProgress >= 1.0) {
      this.completeTransition();
      return;
    }

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Update all systems during transition
   */
  private updateTransition(progress: number): void {
    if (!this.currentState) return;

    const { fromTheme, toTheme, config } = this.currentState;

    // Interpolate lighting
    if (config.crossfade) {
      this.interpolateLighting(fromTheme, toTheme, progress);
    }

    // Interpolate post-processing
    this.interpolatePostProcessing(fromTheme, toTheme, progress);

    // Interpolate atmospheric effects
    if (config.animateParticles || config.smoothFog) {
      this.interpolateAtmospheric(fromTheme, toTheme, progress, config);
    }
  }

  /**
   * Interpolate lighting between themes
   */
  private interpolateLighting(from: V41Theme, to: V41Theme, progress: number): void {
    // Get presets
    const fromPreset = this.lightingManager.getPreset(from);
    const toPreset = this.lightingManager.getPreset(to);

    // Interpolate ambient light intensity
    const ambientIntensity = THREE.MathUtils.lerp(
      fromPreset.ambientLight.intensity,
      toPreset.ambientLight.intensity,
      progress
    );

    // Interpolate ambient color
    const fromColor = new THREE.Color(fromPreset.ambientLight.color);
    const toColor = new THREE.Color(toPreset.ambientLight.color);
    const ambientColor = fromColor.clone().lerp(toColor, progress);

    // Interpolate directional light
    const dirIntensity = THREE.MathUtils.lerp(
      fromPreset.directionalLight.intensity,
      toPreset.directionalLight.intensity,
      progress
    );

    const fromDirColor = new THREE.Color(fromPreset.directionalLight.color);
    const toDirColor = new THREE.Color(toPreset.directionalLight.color);
    const dirColor = fromDirColor.clone().lerp(toDirColor, progress);

    // Apply interpolated values
    this.lightingManager.updateAmbientLight({
      intensity: ambientIntensity,
      color: ambientColor,
    });

    this.lightingManager.updateDirectionalLight({
      intensity: dirIntensity,
      color: dirColor,
    });

    // Tone mapping exposure
    const exposure = THREE.MathUtils.lerp(
      fromPreset.toneMapping.exposure,
      toPreset.toneMapping.exposure,
      progress
    );
    this.lightingManager.updateToneMapping({ exposure });
  }

  /**
   * Interpolate post-processing between themes
   */
  private interpolatePostProcessing(from: V41Theme, to: V41Theme, progress: number): void {
    const fromPreset = this.postProcessingManager.getCurrentPreset();
    const toPreset = { theme: to, ...this.postProcessingManager.constructor.prototype };

    // Get actual presets
    const { POST_PROCESSING_PRESETS } = require('../CHENU_V41_PHASE3/PostProcessing');
    const fromPP = POST_PROCESSING_PRESETS[from];
    const toPP = POST_PROCESSING_PRESETS[to];

    // Interpolate bloom
    const bloomStrength = THREE.MathUtils.lerp(
      fromPP.bloom.strength,
      toPP.bloom.strength,
      progress
    );
    const bloomThreshold = THREE.MathUtils.lerp(
      fromPP.bloom.threshold,
      toPP.bloom.threshold,
      progress
    );
    const bloomRadius = THREE.MathUtils.lerp(
      fromPP.bloom.radius,
      toPP.bloom.radius,
      progress
    );

    this.postProcessingManager.updateBloom({
      strength: bloomStrength,
      threshold: bloomThreshold,
      radius: bloomRadius,
    });

    // Interpolate color grading
    if (fromPP.colorGrading.enabled && toPP.colorGrading.enabled) {
      const brightness = THREE.MathUtils.lerp(
        fromPP.colorGrading.brightness,
        toPP.colorGrading.brightness,
        progress
      );
      const contrast = THREE.MathUtils.lerp(
        fromPP.colorGrading.contrast,
        toPP.colorGrading.contrast,
        progress
      );
      const saturation = THREE.MathUtils.lerp(
        fromPP.colorGrading.saturation,
        toPP.colorGrading.saturation,
        progress
      );

      const fromTint = fromPP.colorGrading.tint;
      const toTint = toPP.colorGrading.tint;
      const tint = fromTint.clone().lerp(toTint, progress);

      this.postProcessingManager.updateColorGrading({
        brightness,
        contrast,
        saturation,
        tint,
      });
    }

    // Interpolate vignette
    if (fromPP.vignette.enabled && toPP.vignette.enabled) {
      const darkness = THREE.MathUtils.lerp(
        fromPP.vignette.darkness,
        toPP.vignette.darkness,
        progress
      );
      const offset = THREE.MathUtils.lerp(
        fromPP.vignette.offset,
        toPP.vignette.offset,
        progress
      );

      this.postProcessingManager.updateVignette({
        darkness,
        offset,
      });
    }
  }

  /**
   * Interpolate atmospheric effects between themes
   */
  private interpolateAtmospheric(
    from: V41Theme,
    to: V41Theme,
    progress: number,
    config: TransitionConfig
  ): void {
    const { ATMOSPHERIC_PRESETS } = require('../CHENU_V41_PHASE3/AtmosphericEffects');
    const fromAtmo = ATMOSPHERIC_PRESETS[from];
    const toAtmo = ATMOSPHERIC_PRESETS[to];

    // Interpolate particles
    if (config.animateParticles && fromAtmo.particles.enabled && toAtmo.particles.enabled) {
      const particleCount = Math.round(THREE.MathUtils.lerp(
        fromAtmo.particles.count,
        toAtmo.particles.count,
        progress
      ));
      const particleOpacity = THREE.MathUtils.lerp(
        fromAtmo.particles.opacity,
        toAtmo.particles.opacity,
        progress
      );

      const fromColor = fromAtmo.particles.color;
      const toColor = toAtmo.particles.color;
      const particleColor = fromColor.clone().lerp(toColor, progress);

      this.atmosphericManager.updateParticles({
        count: particleCount,
        opacity: particleOpacity,
        color: particleColor,
      });
    }

    // Interpolate fog
    if (config.smoothFog && fromAtmo.volumetricFog.enabled && toAtmo.volumetricFog.enabled) {
      const fogDensity = THREE.MathUtils.lerp(
        fromAtmo.volumetricFog.density,
        toAtmo.volumetricFog.density,
        progress
      );

      const fromFogColor = fromAtmo.volumetricFog.color;
      const toFogColor = toAtmo.volumetricFog.color;
      const fogColor = fromFogColor.clone().lerp(toFogColor, progress);

      this.atmosphericManager.updateFog({
        density: fogDensity,
        color: fogColor,
      });
    }
  }

  /**
   * Complete transition and apply final theme
   */
  private completeTransition(): void {
    if (!this.currentState) return;

    const { toTheme } = this.currentState;

    console.log(`✅ Transition complete: ${toTheme}`);

    // Apply final theme state (ensures exact values)
    this.postProcessingManager.applyPreset(toTheme);
    this.atmosphericManager.applyPreset(toTheme);

    // Clean up
    this.currentState.active = false;
    this.currentState = null;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Cancel active transition
   */
  cancelTransition(): void {
    if (this.currentState) {
      console.log('⚠️ Cancelling active transition');
      this.currentState.active = false;
      this.currentState = null;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Check if transition is active
   */
  isTransitioning(): boolean {
    return this.currentState?.active ?? false;
  }

  /**
   * Get current transition progress (0.0 to 1.0)
   */
  getProgress(): number {
    return this.currentState?.progress ?? 0.0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Start smooth theme transition
 */
export async function smoothTransitionTo(
  theme: V41Theme,
  duration: number = 2000,
  easing: TransitionConfig['easing'] = 'easeInOut'
): Promise<void> {
  const manager = ThemeTransitionManager.getInstance();
  
  await manager.transitionTo(theme, {
    duration,
    easing,
    crossfade: true,
    animateParticles: true,
    smoothFog: true,
  });
}

/**
 * Quick fade (0.5s)
 */
export async function quickFadeTo(theme: V41Theme): Promise<void> {
  return smoothTransitionTo(theme, 500, 'easeOut');
}

/**
 * Slow cinematic transition (4s)
 */
export async function cinematicTransitionTo(theme: V41Theme): Promise<void> {
  return smoothTransitionTo(theme, 4000, 'easeInOut');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ThemeTransitionManager;
