/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 2 — SHADER SHOWCASE DEMO
 * Démonstration de tous les 9 shaders avec paramètres par thème
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import {
  getAdvancedShader,
  updateShaderUniforms,
  startShaderAnimations,
} from './AdvancedShaders';

// ═══════════════════════════════════════════════════════════════════════════════
// SHADER PRESETS PAR THÈME
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShaderPresetConfig {
  theme: 'normal' | 'atlean' | 'futuristic' | 'cosmic';
  shaderType: string;
  uniforms: Record<string, any>;
  description: string;
}

export const SHADER_PRESETS: ShaderPresetConfig[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ATLEAN THEME PRESETS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    theme: 'atlean',
    shaderType: 'subsurface',
    description: 'Temple stone with light penetration',
    uniforms: {
      color: 0xE9E4D6,          // Soft Sand
      subsurfaceColor: 0xD8B26A, // Sacred Gold
      thickness: 0.6,
      power: 2.5,
      scale: 1.2,
      distortion: 0.15,
      ambient: 0.5,
      attenuation: 0.7,
    },
  },
  {
    theme: 'atlean',
    shaderType: 'water',
    description: 'Sacred cenote turquoise water',
    uniforms: {
      waterColor: 0x3EB4A2,     // Cenote Turquoise
      deepColor: 0x2F4C39,      // Shadow Moss
      foamColor: 0xFFFFFF,
      waveSpeed: 0.8,
      waveHeight: 0.12,
      waveFrequency: 2.5,
      transparency: 0.75,
      reflectivity: 0.6,
    },
  },
  {
    theme: 'atlean',
    shaderType: 'crystal',
    description: 'Sacred energy crystals',
    uniforms: {
      crystalColor: 0x3EB4A2,   // Cenote Turquoise
      glowColor: 0xD8B26A,      // Sacred Gold
      glowIntensity: 2.5,
      pulseSpeed: 0.6,
      refractionStrength: 0.4,
      transparency: 0.65,
    },
  },
  {
    theme: 'atlean',
    shaderType: 'glyph',
    description: 'Ancient Maya inscriptions',
    uniforms: {
      glyphColor: 0xD8B26A,     // Sacred Gold
      backgroundColor: 0x2F4C39, // Shadow Moss
      glowColor: 0x3EB4A2,      // Cenote Turquoise
      animationSpeed: 0.25,
      glyphDensity: 6.0,
      glowIntensity: 1.8,
    },
  },
  {
    theme: 'atlean',
    shaderType: 'energy',
    description: 'Mystical portal energy',
    uniforms: {
      color1: 0xD8B26A,         // Sacred Gold
      color2: 0x3EB4A2,         // Cenote Turquoise
      speed: 0.6,
      intensity: 2.0,
      flowDirection: [0, 1, 0],
      turbulence: 0.7,
      opacity: 0.65,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUTURISTIC THEME PRESETS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    theme: 'futuristic',
    shaderType: 'holographic',
    description: 'Cyber hologram interface',
    uniforms: {
      baseColor: 0x00F0FF,      // Cyan neon
      scanlineColor: 0xFF00FF,  // Magenta
      glitchIntensity: 0.15,
      scanlineSpeed: 2.5,
      scanlineWidth: 0.04,
      fresnel: 1.8,
      opacity: 0.75,
    },
  },
  {
    theme: 'futuristic',
    shaderType: 'circuit',
    description: 'Electronic circuit panels',
    uniforms: {
      lineColor: 0x00F0FF,      // Cyan
      glowColor: 0xFF00FF,      // Magenta
      backgroundColor: 0x0A0A0A,
      lineWidth: 0.018,
      gridScale: 12.0,
      flowSpeed: 2.0,
      glowIntensity: 2.5,
    },
  },
  {
    theme: 'futuristic',
    shaderType: 'plasma',
    description: 'Energy shield plasma',
    uniforms: {
      color1: 0x00F0FF,         // Cyan
      color2: 0xFF00FF,         // Magenta
      color3: 0x0000FF,         // Blue
      color4: 0xFFFFFF,         // White
      speed: 0.8,
      complexity: 4.0,
      intensity: 2.0,
    },
  },
  {
    theme: 'futuristic',
    shaderType: 'energy',
    description: 'Tech force field',
    uniforms: {
      color1: 0x00F0FF,         // Cyan
      color2: 0xFF00FF,         // Magenta
      speed: 1.5,
      intensity: 1.8,
      flowDirection: [0, 1, 0],
      turbulence: 0.4,
      opacity: 0.85,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COSMIC THEME PRESETS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    theme: 'cosmic',
    shaderType: 'nebula',
    description: 'Cosmic nebula clouds',
    uniforms: {
      color1: 0x6B2F8A,         // Violet nébuleuse
      color2: 0x1E3A8A,         // Bleu galaxie
      color3: 0x00CED1,         // Cyan étoile
      speed: 0.08,
      scale: 2.5,
      brightness: 1.8,
      density: 0.6,
    },
  },
  {
    theme: 'cosmic',
    shaderType: 'plasma',
    description: 'Stellar plasma phenomena',
    uniforms: {
      color1: 0x6B2F8A,         // Violet nébuleuse
      color2: 0x1E3A8A,         // Bleu galaxie
      color3: 0x00CED1,         // Cyan étoile
      color4: 0xFF00FF,         // Magenta
      speed: 0.4,
      complexity: 3.5,
      intensity: 2.2,
    },
  },
  {
    theme: 'cosmic',
    shaderType: 'crystal',
    description: 'Stellar crystals',
    uniforms: {
      crystalColor: 0x00CED1,   // Cyan étoile
      glowColor: 0x6B2F8A,      // Violet nébuleuse
      glowIntensity: 3.0,
      pulseSpeed: 0.5,
      refractionStrength: 0.5,
      transparency: 0.6,
    },
  },
  {
    theme: 'cosmic',
    shaderType: 'energy',
    description: 'Cosmic energy field',
    uniforms: {
      color1: 0x00CED1,         // Cyan étoile
      color2: 0x6B2F8A,         // Violet nébuleuse
      speed: 0.5,
      intensity: 2.5,
      flowDirection: [0, 0, 1],
      turbulence: 0.6,
      opacity: 0.7,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHADER SHOWCASE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class ShaderShowcase {
  private scene: THREE.Scene;
  private currentTheme: 'normal' | 'atlean' | 'futuristic' | 'cosmic' = 'atlean';
  private shaderMeshes: Map<string, THREE.Mesh> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Create showcase grid of all shaders for current theme
   */
  createShowcaseGrid(): void {
    // Clear existing meshes
    this.clearShowcase();

    // Get presets for current theme
    const themePresets = SHADER_PRESETS.filter(p => p.theme === this.currentTheme);

    // Grid layout
    const spacing = 3;
    const cols = Math.ceil(Math.sqrt(themePresets.length));

    themePresets.forEach((preset, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Create mesh
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const shader = getAdvancedShader(preset.shaderType as any);

      if (!shader) {
        console.warn(`Shader ${preset.shaderType} not found`);
        return;
      }

      const mesh = new THREE.Mesh(geometry, shader.clone());
      mesh.position.set(
        (col - cols / 2) * spacing,
        (row - Math.floor(themePresets.length / cols) / 2) * spacing,
        0
      );

      // Apply preset uniforms
      updateShaderUniforms(preset.shaderType as any, preset.uniforms);

      // Add to scene
      this.scene.add(mesh);
      this.shaderMeshes.set(`${preset.shaderType}_${index}`, mesh);

      // Add label (in real app)
      console.log(`${preset.shaderType}: ${preset.description}`);
    });

    // Start animations
    startShaderAnimations();

    console.log(`✅ Shader showcase created for ${this.currentTheme} theme`);
    console.log(`   ${themePresets.length} shaders displayed`);
  }

  /**
   * Switch to different theme
   */
  switchTheme(theme: 'normal' | 'atlean' | 'futuristic' | 'cosmic'): void {
    this.currentTheme = theme;
    this.createShowcaseGrid();
  }

  /**
   * Apply specific preset to a mesh
   */
  applyPreset(mesh: THREE.Mesh, presetIndex: number): void {
    const preset = SHADER_PRESETS[presetIndex];
    if (!preset) {
      console.error(`Preset ${presetIndex} not found`);
      return;
    }

    const shader = getAdvancedShader(preset.shaderType as any);
    if (!shader) {
      console.error(`Shader ${preset.shaderType} not found`);
      return;
    }

    mesh.material = shader;
    updateShaderUniforms(preset.shaderType as any, preset.uniforms);

    console.log(`✅ Applied preset: ${preset.description}`);
  }

  /**
   * Clear all showcase meshes
   */
  clearShowcase(): void {
    this.shaderMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      }
    });
    this.shaderMeshes.clear();
  }

  /**
   * Get all presets for a theme
   */
  getPresetsForTheme(theme: 'normal' | 'atlean' | 'futuristic' | 'cosmic'): ShaderPresetConfig[] {
    return SHADER_PRESETS.filter(p => p.theme === theme);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get preset by theme and shader type
 */
export function getShaderPreset(
  theme: 'normal' | 'atlean' | 'futuristic' | 'cosmic',
  shaderType: string
): ShaderPresetConfig | undefined {
  return SHADER_PRESETS.find(p => p.theme === theme && p.shaderType === shaderType);
}

/**
 * Apply themed shader to mesh
 */
export function applyThemedShader(
  mesh: THREE.Mesh,
  theme: 'normal' | 'atlean' | 'futuristic' | 'cosmic',
  shaderType: string
): void {
  const preset = getShaderPreset(theme, shaderType);
  if (!preset) {
    console.error(`No preset found for ${theme}/${shaderType}`);
    return;
  }

  const shader = getAdvancedShader(shaderType as any);
  if (!shader) {
    console.error(`Shader ${shaderType} not available`);
    return;
  }

  mesh.material = shader;
  updateShaderUniforms(shaderType as any, preset.uniforms);
}

/**
 * Print all available shader presets
 */
export function printShaderPresets(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                   SHADER PRESETS AVAILABLE                       ║
╚═══════════════════════════════════════════════════════════════════╝
  `);

  const themes = ['atlean', 'futuristic', 'cosmic'] as const;

  themes.forEach(theme => {
    const presets = SHADER_PRESETS.filter(p => p.theme === theme);
    console.log(`\n${theme.toUpperCase()} (${presets.length} shaders):`);
    presets.forEach(preset => {
      console.log(`  - ${preset.shaderType}: ${preset.description}`);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ShaderShowcase;
