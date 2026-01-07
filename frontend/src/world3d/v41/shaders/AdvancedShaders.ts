/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 2 — ADVANCED SHADERS SYSTEM
 * Custom shader materials for thematic worlds (Atlean, Futuristic, Cosmic)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import {
  createEnergyShader,
  createCrystalShader,
  createCircuitShader,
  createPlasmaShader,
  createGlyphShader,
} from './AdvancedShaders_Extended';

// ═══════════════════════════════════════════════════════════════════════════════
// SHADER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ShaderType = 
  | 'subsurface'      // SSS for Atlean (organic materials)
  | 'holographic'     // Holographic for Futuristic
  | 'nebula'          // Nebula clouds for Cosmic
  | 'water'           // Animated water/cenote for Atlean
  | 'energy'          // Energy fields for all themes
  | 'crystal'         // Glowing crystals for Atlean/Cosmic
  | 'circuit'         // Circuit patterns for Futuristic
  | 'plasma'          // Plasma effects for Cosmic/Futuristic
  | 'glyph';          // Animated glyphs for Atlean

export interface ShaderConfig {
  type: ShaderType;
  uniforms: { [key: string]: THREE.IUniform };
  vertexShader: string;
  fragmentShader: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSURFACE SCATTERING (ATLEAN THEME)
// ═══════════════════════════════════════════════════════════════════════════════

export const createSubsurfaceShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    color: { value: new THREE.Color(0xE9E4D6) }, // Soft Sand
    subsurfaceColor: { value: new THREE.Color(0xD8B26A) }, // Sacred Gold
    thickness: { value: 0.5 },
    power: { value: 2.0 },
    scale: { value: 1.0 },
    distortion: { value: 0.1 },
    ambient: { value: 0.4 },
    attenuation: { value: 0.8 },
    lightPos: { value: new THREE.Vector3(10, 10, 10) },
  };

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLightDirection;
    
    uniform vec3 lightPos;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vLightDirection = normalize(lightPos - mvPosition.xyz);
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 color;
    uniform vec3 subsurfaceColor;
    uniform float thickness;
    uniform float power;
    uniform float scale;
    uniform float distortion;
    uniform float ambient;
    uniform float attenuation;
    uniform float time;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLightDirection;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(vLightDirection);
      
      // Diffuse
      float diffuse = max(dot(normal, lightDir), 0.0);
      
      // Subsurface scattering
      vec3 H = normalize(lightDir + normal * distortion);
      float VdotH = pow(clamp(dot(viewDir, -H), 0.0, 1.0), power) * scale;
      float attenFactor = attenuation * (VdotH + ambient) * thickness;
      
      // Combine
      vec3 subsurface = subsurfaceColor * attenFactor;
      vec3 finalColor = color * diffuse + subsurface;
      
      // Add subtle animation
      float pulse = sin(time * 0.5) * 0.05 + 0.95;
      finalColor *= pulse;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return { type: 'subsurface', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOLOGRAPHIC SHADER (FUTURISTIC THEME)
// ═══════════════════════════════════════════════════════════════════════════════

export const createHolographicShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    baseColor: { value: new THREE.Color(0x00F0FF) }, // Cyan neon
    scanlineColor: { value: new THREE.Color(0xFF00FF) }, // Magenta
    glitchIntensity: { value: 0.1 },
    scanlineSpeed: { value: 2.0 },
    scanlineWidth: { value: 0.05 },
    fresnel: { value: 1.5 },
    opacity: { value: 0.7 },
  };

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 baseColor;
    uniform vec3 scanlineColor;
    uniform float time;
    uniform float glitchIntensity;
    uniform float scanlineSpeed;
    uniform float scanlineWidth;
    uniform float fresnel;
    uniform float opacity;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect
      float fresnelTerm = pow(1.0 - abs(dot(viewDir, normal)), fresnel);
      
      // Scanlines
      float scanline = step(scanlineWidth, fract(vUv.y * 50.0 + time * scanlineSpeed));
      vec3 scanlineEffect = mix(scanlineColor, baseColor, scanline);
      
      // Glitch effect
      float glitch = random(vec2(vUv.x, floor(time * 10.0))) * glitchIntensity;
      vec2 glitchedUV = vUv + vec2(glitch, 0.0);
      
      // Holographic shimmer
      float shimmer = sin(glitchedUV.x * 10.0 + time * 3.0) * 0.1 + 0.9;
      
      // Combine effects
      vec3 finalColor = scanlineEffect * fresnelTerm * shimmer;
      float finalOpacity = opacity * (fresnelTerm * 0.5 + 0.5);
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  return { type: 'holographic', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEBULA SHADER (COSMIC THEME)
// ═══════════════════════════════════════════════════════════════════════════════

export const createNebulaShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    color1: { value: new THREE.Color(0x6B2F8A) }, // Violet nébuleuse
    color2: { value: new THREE.Color(0x1E3A8A) }, // Bleu galaxie
    color3: { value: new THREE.Color(0x00CED1) }, // Cyan étoile
    speed: { value: 0.1 },
    scale: { value: 2.0 },
    brightness: { value: 1.5 },
    density: { value: 0.5 },
  };

  const vertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform float time;
    uniform float speed;
    uniform float scale;
    uniform float brightness;
    uniform float density;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    
    // 3D Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      // Multi-octave noise for nebula clouds
      vec3 pos = vPosition * scale;
      float n1 = snoise(pos + time * speed);
      float n2 = snoise(pos * 2.0 + time * speed * 1.5);
      float n3 = snoise(pos * 4.0 + time * speed * 2.0);
      
      float noise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * 0.5 + 0.5;
      noise = pow(noise, density);
      
      // Color mixing based on noise
      vec3 color = mix(color1, color2, noise);
      color = mix(color, color3, pow(noise, 2.0));
      
      // Add brightness and glow
      color *= brightness;
      
      // Add some stars (random bright spots)
      float stars = step(0.99, fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453));
      color += stars * 0.5;
      
      gl_FragColor = vec4(color, noise * 0.8);
    }
  `;

  return { type: 'nebula', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// WATER SHADER (ATLEAN CENOTE)
// ═══════════════════════════════════════════════════════════════════════════════

export const createWaterShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    waterColor: { value: new THREE.Color(0x3EB4A2) }, // Cenote Turquoise
    deepColor: { value: new THREE.Color(0x2F4C39) }, // Shadow Moss (deep)
    foamColor: { value: new THREE.Color(0xFFFFFF) },
    waveSpeed: { value: 1.0 },
    waveHeight: { value: 0.1 },
    waveFrequency: { value: 2.0 },
    transparency: { value: 0.7 },
    reflectivity: { value: 0.5 },
  };

  const vertexShader = `
    uniform float time;
    uniform float waveHeight;
    uniform float waveFrequency;
    uniform float waveSpeed;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vElevation;
    
    // Simple wave function
    float wave(vec2 pos) {
      return sin(pos.x * waveFrequency + time * waveSpeed) * 
             cos(pos.y * waveFrequency + time * waveSpeed * 0.8);
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Calculate wave displacement
      vec3 pos = position;
      float elevation = wave(pos.xz) * waveHeight;
      pos.y += elevation;
      vElevation = elevation;
      
      // Recalculate normal for lighting
      float offset = 0.1;
      float hL = wave(pos.xz - vec2(offset, 0.0)) * waveHeight;
      float hR = wave(pos.xz + vec2(offset, 0.0)) * waveHeight;
      float hD = wave(pos.xz - vec2(0.0, offset)) * waveHeight;
      float hU = wave(pos.xz + vec2(0.0, offset)) * waveHeight;
      
      vec3 vL = vec3(-offset, hL - elevation, 0.0);
      vec3 vR = vec3(offset, hR - elevation, 0.0);
      vec3 vD = vec3(0.0, hD - elevation, -offset);
      vec3 vU = vec3(0.0, hU - elevation, offset);
      
      vNormal = normalize(cross(vR - vL, vU - vD));
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 waterColor;
    uniform vec3 deepColor;
    uniform vec3 foamColor;
    uniform float time;
    uniform float transparency;
    uniform float reflectivity;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Water depth effect
      float depth = 1.0 - vElevation * 5.0;
      vec3 color = mix(waterColor, deepColor, clamp(depth, 0.0, 1.0));
      
      // Foam on wave peaks
      float foam = smoothstep(0.05, 0.1, vElevation);
      color = mix(color, foamColor, foam * 0.3);
      
      // Caustics pattern (simple)
      float caustic = sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 + time * 0.8);
      caustic = caustic * 0.5 + 0.5;
      color += caustic * 0.1;
      
      // Fresnel for edge transparency
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      float alpha = mix(transparency, 1.0, fresnel * reflectivity);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return { type: 'water', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHADER MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class AdvancedShaderManager {
  private static instance: AdvancedShaderManager;
  private shaders: Map<ShaderType, THREE.ShaderMaterial> = new Map();
  private animationFrameId: number | null = null;

  private constructor() {
    this.initializeShaders();
  }

  static getInstance(): AdvancedShaderManager {
    if (!AdvancedShaderManager.instance) {
      AdvancedShaderManager.instance = new AdvancedShaderManager();
    }
    return AdvancedShaderManager.instance;
  }

  private initializeShaders(): void {
    // Create all shader materials
    this.createShaderMaterial('subsurface', createSubsurfaceShader());
    this.createShaderMaterial('holographic', createHolographicShader());
    this.createShaderMaterial('nebula', createNebulaShader());
    this.createShaderMaterial('water', createWaterShader());
    this.createShaderMaterial('energy', createEnergyShader());
    this.createShaderMaterial('crystal', createCrystalShader());
    this.createShaderMaterial('circuit', createCircuitShader());
    this.createShaderMaterial('plasma', createPlasmaShader());
    this.createShaderMaterial('glyph', createGlyphShader());
    
    console.log('✅ Advanced Shaders initialized: 9 shader types loaded');
  }

  private createShaderMaterial(type: ShaderType, config: ShaderConfig): void {
    const material = new THREE.ShaderMaterial({
      uniforms: config.uniforms,
      vertexShader: config.vertexShader,
      fragmentShader: config.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.shaders.set(type, material);
  }

  getShader(type: ShaderType): THREE.ShaderMaterial | undefined {
    return this.shaders.get(type);
  }

  updateUniforms(type: ShaderType, uniforms: { [key: string]: any }): void {
    const material = this.shaders.get(type);
    if (material) {
      Object.keys(uniforms).forEach(key => {
        if (material.uniforms[key]) {
          material.uniforms[key].value = uniforms[key];
        }
      });
    }
  }

  startAnimation(): void {
    if (this.animationFrameId !== null) return;

    const animate = () => {
      const time = performance.now() * 0.001;

      // Update time uniform for all animated shaders
      this.shaders.forEach(material => {
        if (material.uniforms.time) {
          material.uniforms.time.value = time;
        }
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose(): void {
    this.stopAnimation();
    this.shaders.forEach(material => material.dispose());
    this.shaders.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getAdvancedShader(type: ShaderType): THREE.ShaderMaterial | undefined {
  return AdvancedShaderManager.getInstance().getShader(type);
}

export function updateShaderUniforms(
  type: ShaderType,
  uniforms: { [key: string]: any }
): void {
  AdvancedShaderManager.getInstance().updateUniforms(type, uniforms);
}

export function startShaderAnimations(): void {
  AdvancedShaderManager.getInstance().startAnimation();
}

export function stopShaderAnimations(): void {
  AdvancedShaderManager.getInstance().stopAnimation();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default AdvancedShaderManager;

export {
  // Shader creation functions
  createSubsurfaceShader,
  createHolographicShader,
  createNebulaShader,
  createWaterShader,
  createEnergyShader,
  createCrystalShader,
  createCircuitShader,
  createPlasmaShader,
  createGlyphShader,
};
