/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 3 EXTENDED — ATMOSPHERIC EFFECTS
 * Particle systems, volumetric fog, god rays per theme
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AtmosphericTheme = 'normal' | 'atlean' | 'futuristic' | 'cosmic';

export interface ParticleSystemConfig {
  count: number;
  size: number;
  color: THREE.Color;
  opacity: number;
  speed: number;
  range: number;
  enabled: boolean;
}

export interface VolumetricFogConfig {
  color: THREE.Color;
  density: number;
  near: number;
  far: number;
  enabled: boolean;
}

export interface AtmosphericPreset {
  theme: AtmosphericTheme;
  particles: ParticleSystemConfig;
  volumetricFog: VolumetricFogConfig;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATMOSPHERIC PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const ATMOSPHERIC_PRESETS: Record<AtmosphericTheme, AtmosphericPreset> = {
  // NORMAL THEME - Minimal atmospheric effects
  normal: {
    theme: 'normal',
    description: 'Clean studio environment',
    particles: {
      count: 500,
      size: 0.02,
      color: new THREE.Color(0xFFFFFF),
      opacity: 0.3,
      speed: 0.1,
      range: 20,
      enabled: false,
    },
    volumetricFog: {
      color: new THREE.Color(0xCCCCCC),
      density: 0.001,
      near: 100,
      far: 300,
      enabled: false,
    },
  },

  // ATLEAN THEME - Jungle mist, floating pollen
  atlean: {
    theme: 'atlean',
    description: 'Mystical jungle atmosphere with golden particles',
    particles: {
      count: 2000,
      size: 0.05,
      color: new THREE.Color(0xD8B26A), // Sacred Gold
      opacity: 0.6,
      speed: 0.15,
      range: 30,
      enabled: true,
    },
    volumetricFog: {
      color: new THREE.Color(0xE9E4D6), // Soft Sand
      density: 0.008,
      near: 10,
      far: 100,
      enabled: true,
    },
  },

  // FUTURISTIC THEME - Neon particles, digital fog
  futuristic: {
    theme: 'futuristic',
    description: 'Digital particles and cyber fog',
    particles: {
      count: 3000,
      size: 0.03,
      color: new THREE.Color(0x00F0FF), // Cyan neon
      opacity: 0.8,
      speed: 0.25,
      range: 40,
      enabled: true,
    },
    volumetricFog: {
      color: new THREE.Color(0x0F0F1E), // Dark purple
      density: 0.012,
      near: 5,
      far: 80,
      enabled: true,
    },
  },

  // COSMIC THEME - Stardust, nebula fog
  cosmic: {
    theme: 'cosmic',
    description: 'Cosmic stardust and nebula fog',
    particles: {
      count: 5000,
      size: 0.04,
      color: new THREE.Color(0x00CED1), // Cyan étoile
      opacity: 0.7,
      speed: 0.08,
      range: 100,
      enabled: true,
    },
    volumetricFog: {
      color: new THREE.Color(0x1E3A8A), // Bleu galaxie
      density: 0.003,
      near: 50,
      far: 500,
      enabled: true,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export class ThematicParticleSystem {
  private particles: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private velocities: Float32Array;
  private config: ParticleSystemConfig;
  private time: number = 0;

  constructor(config: ParticleSystemConfig) {
    this.config = config;
    
    // Geometry
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    this.velocities = new Float32Array(config.count * 3);

    // Initialize particle positions and velocities
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;
      
      // Random position within range
      positions[i3] = (Math.random() - 0.5) * config.range;
      positions[i3 + 1] = (Math.random() - 0.5) * config.range;
      positions[i3 + 2] = (Math.random() - 0.5) * config.range;
      
      // Random velocity
      this.velocities[i3] = (Math.random() - 0.5) * config.speed;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * config.speed;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * config.speed;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material
    this.material = new THREE.PointsMaterial({
      size: config.size,
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Mesh
    this.particles = new THREE.Points(this.geometry, this.material);
    this.particles.visible = config.enabled;
  }

  update(deltaTime: number): void {
    if (!this.config.enabled) return;

    this.time += deltaTime;
    const positions = this.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.config.count; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += this.velocities[i3] * deltaTime;
      positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime;
      positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime;

      // Wrap around boundaries
      const halfRange = this.config.range / 2;
      if (Math.abs(positions[i3]) > halfRange) {
        positions[i3] = -Math.sign(positions[i3]) * halfRange;
      }
      if (Math.abs(positions[i3 + 1]) > halfRange) {
        positions[i3 + 1] = -Math.sign(positions[i3 + 1]) * halfRange;
      }
      if (Math.abs(positions[i3 + 2]) > halfRange) {
        positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * halfRange;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  getMesh(): THREE.Points {
    return this.particles;
  }

  setVisible(visible: boolean): void {
    this.particles.visible = visible;
    this.config.enabled = visible;
  }

  updateConfig(config: Partial<ParticleSystemConfig>): void {
    if (config.size !== undefined) this.material.size = config.size;
    if (config.color !== undefined) this.material.color = config.color;
    if (config.opacity !== undefined) this.material.opacity = config.opacity;
    if (config.enabled !== undefined) this.setVisible(config.enabled);
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATMOSPHERIC MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class AtmosphericManager {
  private static instance: AtmosphericManager;
  
  private scene: THREE.Scene;
  private particleSystem: ThematicParticleSystem | null = null;
  private currentTheme: AtmosphericTheme = 'normal';
  private clock: THREE.Clock;

  private constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.clock = new THREE.Clock();
  }

  static getInstance(scene?: THREE.Scene): AtmosphericManager {
    if (!AtmosphericManager.instance) {
      if (!scene) {
        throw new Error('AtmosphericManager requires scene on first initialization');
      }
      AtmosphericManager.instance = new AtmosphericManager(scene);
    }
    return AtmosphericManager.instance;
  }

  applyPreset(theme: AtmosphericTheme): void {
    const preset = ATMOSPHERIC_PRESETS[theme];
    if (!preset) {
      console.error(`Unknown atmospheric theme: ${theme}`);
      return;
    }

    console.log(`🌫️ Applying atmospheric preset: ${theme}`);

    // Clear existing particle system
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem.getMesh());
      this.particleSystem.dispose();
      this.particleSystem = null;
    }

    // Create new particle system
    if (preset.particles.enabled) {
      this.particleSystem = new ThematicParticleSystem(preset.particles);
      this.scene.add(this.particleSystem.getMesh());
    }

    // Apply volumetric fog
    if (preset.volumetricFog.enabled) {
      this.scene.fog = new THREE.FogExp2(
        preset.volumetricFog.color,
        preset.volumetricFog.density
      );
    } else {
      this.scene.fog = null;
    }

    this.currentTheme = theme;
    console.log(`✅ Atmospheric effects applied: ${theme}`);
  }

  /**
   * Update particles (call in animation loop)
   */
  update(): void {
    const deltaTime = this.clock.getDelta();
    
    if (this.particleSystem) {
      this.particleSystem.update(deltaTime);
    }
  }

  /**
   * Update particle settings
   */
  updateParticles(config: Partial<ParticleSystemConfig>): void {
    if (this.particleSystem) {
      this.particleSystem.updateConfig(config);
    }
  }

  /**
   * Update fog settings
   */
  updateFog(config: Partial<VolumetricFogConfig>): void {
    if (config.enabled === false) {
      this.scene.fog = null;
      return;
    }

    if (this.scene.fog instanceof THREE.FogExp2) {
      if (config.color !== undefined) {
        this.scene.fog.color = config.color;
      }
      if (config.density !== undefined) {
        this.scene.fog.density = config.density;
      }
    } else if (config.enabled && config.color && config.density !== undefined) {
      this.scene.fog = new THREE.FogExp2(config.color, config.density);
    }
  }

  getCurrentTheme(): AtmosphericTheme {
    return this.currentTheme;
  }

  getCurrentPreset(): AtmosphericPreset {
    return ATMOSPHERIC_PRESETS[this.currentTheme];
  }

  dispose(): void {
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem.getMesh());
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
    this.scene.fog = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize atmospheric system
 */
export function initAtmosphericEffects(scene: THREE.Scene): AtmosphericManager {
  const manager = AtmosphericManager.getInstance(scene);
  manager.applyPreset('normal');
  return manager;
}

/**
 * Apply atmospheric preset for theme
 */
export function setAtmosphericTheme(theme: AtmosphericTheme): void {
  const manager = AtmosphericManager.getInstance();
  manager.applyPreset(theme);
}

/**
 * Update atmospheric effects (call in animation loop)
 */
export function updateAtmosphericEffects(): void {
  const manager = AtmosphericManager.getInstance();
  manager.update();
}

/**
 * Get atmospheric preset
 */
export function getAtmosphericPreset(theme: AtmosphericTheme): AtmosphericPreset {
  return ATMOSPHERIC_PRESETS[theme];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default AtmosphericManager;
