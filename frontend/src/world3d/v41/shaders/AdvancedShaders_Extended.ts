/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 2 EXTENDED — ADDITIONAL ADVANCED SHADERS
 * Energy, Crystal, Circuit, Plasma, and Glyph shaders
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import type { ShaderConfig } from './AdvancedShaders';

// ═══════════════════════════════════════════════════════════════════════════════
// ENERGY FIELD SHADER (ALL THEMES)
// ═══════════════════════════════════════════════════════════════════════════════

export const createEnergyShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    color1: { value: new THREE.Color(0x00F0FF) }, // Primary energy color
    color2: { value: new THREE.Color(0xFF00FF) }, // Secondary energy color
    speed: { value: 1.0 },
    intensity: { value: 1.5 },
    flowDirection: { value: new THREE.Vector3(0, 1, 0) },
    turbulence: { value: 0.5 },
    opacity: { value: 0.8 },
  };

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    uniform float speed;
    uniform float intensity;
    uniform vec3 flowDirection;
    uniform float turbulence;
    uniform float opacity;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Noise functions
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      // Energy flow along direction
      float flow = dot(vPosition, flowDirection) * 0.5 + time * speed;
      
      // Multi-layer energy waves
      float wave1 = sin(flow * 2.0) * 0.5 + 0.5;
      float wave2 = sin(flow * 3.0 + time * 2.0) * 0.5 + 0.5;
      float wave3 = sin(flow * 5.0 + time * 3.0) * 0.5 + 0.5;
      
      // Turbulence
      vec2 noiseCoord = vUv * 5.0 + time * 0.3;
      float turb = noise(noiseCoord) * turbulence;
      
      // Combine waves
      float energy = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) + turb;
      energy = pow(energy, intensity);
      
      // Color gradient
      vec3 color = mix(color1, color2, energy);
      
      // Fresnel for edge glow
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      color += color1 * fresnel * 0.5;
      
      gl_FragColor = vec4(color, opacity * energy);
    }
  `;

  return { type: 'energy', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// CRYSTAL GLOW SHADER (ATLEAN / COSMIC)
// ═══════════════════════════════════════════════════════════════════════════════

export const createCrystalShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    crystalColor: { value: new THREE.Color(0x3EB4A2) }, // Cenote Turquoise
    glowColor: { value: new THREE.Color(0xD8B26A) }, // Sacred Gold
    glowIntensity: { value: 2.0 },
    pulseSpeed: { value: 0.8 },
    refractionStrength: { value: 0.3 },
    transparency: { value: 0.7 },
  };

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 crystalColor;
    uniform vec3 glowColor;
    uniform float time;
    uniform float glowIntensity;
    uniform float pulseSpeed;
    uniform float refractionStrength;
    uniform float transparency;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    // Voronoi-like pattern for crystal structure
    float voronoi(vec2 uv) {
      vec2 p = floor(uv);
      vec2 f = fract(uv);
      float minDist = 1.0;
      
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 neighbor = vec2(float(i), float(j));
          vec2 point = vec2(
            sin(dot(p + neighbor, vec2(127.1, 311.7)) * 0.1) * 0.5 + 0.5,
            cos(dot(p + neighbor, vec2(269.5, 183.3)) * 0.1) * 0.5 + 0.5
          );
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          minDist = min(minDist, dist);
        }
      }
      return minDist;
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Crystal facets using Voronoi
      vec2 crystalUV = vPosition.xy * 3.0;
      float facets = voronoi(crystalUV);
      facets = smoothstep(0.0, 0.5, facets);
      
      // Pulsing glow
      float pulse = sin(time * pulseSpeed) * 0.3 + 0.7;
      
      // Fresnel for edge glow
      float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
      
      // Internal glow (Subsurface-like)
      float internalGlow = (1.0 - facets) * pulse * glowIntensity;
      
      // Combine crystal color with glow
      vec3 color = crystalColor * facets;
      color += glowColor * (fresnel + internalGlow) * 0.5;
      
      // Specular highlight
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      color += vec3(1.0) * spec * 0.3;
      
      float alpha = transparency + fresnel * (1.0 - transparency);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return { type: 'crystal', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCUIT PATTERN SHADER (FUTURISTIC)
// ═══════════════════════════════════════════════════════════════════════════════

export const createCircuitShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    lineColor: { value: new THREE.Color(0x00F0FF) }, // Cyan
    glowColor: { value: new THREE.Color(0xFF00FF) }, // Magenta
    backgroundColor: { value: new THREE.Color(0x0A0A0A) }, // Almost black
    lineWidth: { value: 0.02 },
    gridScale: { value: 10.0 },
    flowSpeed: { value: 1.5 },
    glowIntensity: { value: 2.0 },
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 lineColor;
    uniform vec3 glowColor;
    uniform vec3 backgroundColor;
    uniform float time;
    uniform float lineWidth;
    uniform float gridScale;
    uniform float flowSpeed;
    uniform float glowIntensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Hash function for pseudo-random
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    // Circuit line pattern
    float circuitPattern(vec2 uv) {
      vec2 grid = fract(uv * gridScale);
      vec2 id = floor(uv * gridScale);
      
      // Random circuit layout
      float h = hash(id);
      float pattern = 0.0;
      
      // Horizontal lines
      if (h < 0.33) {
        pattern = step(abs(grid.y - 0.5), lineWidth);
      }
      // Vertical lines
      else if (h < 0.66) {
        pattern = step(abs(grid.x - 0.5), lineWidth);
      }
      // L-shaped connections
      else {
        float horiz = step(abs(grid.y - 0.5), lineWidth) * step(grid.x, 0.5);
        float vert = step(abs(grid.x - 0.5), lineWidth) * step(grid.y, 0.5);
        pattern = max(horiz, vert);
      }
      
      return pattern;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Circuit pattern
      float circuit = circuitPattern(uv);
      
      // Animated flow along circuits
      vec2 flowUV = uv + vec2(time * flowSpeed * 0.1, 0.0);
      float flow = fract(hash(floor(flowUV * gridScale)) + time * flowSpeed);
      flow = smoothstep(0.3, 0.7, flow);
      
      // Glow effect
      float glow = circuit * flow;
      
      // Color mixing
      vec3 color = backgroundColor;
      color = mix(color, lineColor, circuit);
      color += glowColor * glow * glowIntensity;
      
      // Scanline effect
      float scanline = sin(uv.y * 100.0 + time * 5.0) * 0.05 + 0.95;
      color *= scanline;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return { type: 'circuit', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLASMA EFFECT SHADER (COSMIC / FUTURISTIC)
// ═══════════════════════════════════════════════════════════════════════════════

export const createPlasmaShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    color1: { value: new THREE.Color(0x6B2F8A) }, // Violet nébuleuse
    color2: { value: new THREE.Color(0x1E3A8A) }, // Bleu galaxie
    color3: { value: new THREE.Color(0x00CED1) }, // Cyan étoile
    color4: { value: new THREE.Color(0xFF00FF) }, // Magenta
    speed: { value: 0.5 },
    complexity: { value: 3.0 },
    intensity: { value: 1.5 },
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
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
    uniform vec3 color4;
    uniform float time;
    uniform float speed;
    uniform float complexity;
    uniform float intensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv;
      float t = time * speed;
      
      // Classic plasma effect with multiple sine waves
      float plasma = 0.0;
      
      // Wave 1: Horizontal
      plasma += sin((uv.x * 10.0 + t) * complexity);
      
      // Wave 2: Vertical
      plasma += sin((uv.y * 10.0 + t * 0.8) * complexity);
      
      // Wave 3: Diagonal
      plasma += sin(((uv.x + uv.y) * 7.0 + t * 1.2) * complexity);
      
      // Wave 4: Circular
      float dist = length(uv - 0.5) * 2.0;
      plasma += sin((dist * 8.0 - t * 1.5) * complexity);
      
      // Wave 5: Spiral
      float angle = atan(uv.y - 0.5, uv.x - 0.5);
      plasma += sin((angle * 4.0 + dist * 6.0 - t * 2.0) * complexity);
      
      // Normalize
      plasma = plasma * 0.2 + 0.5;
      
      // Multi-color gradient
      vec3 color;
      if (plasma < 0.33) {
        color = mix(color1, color2, plasma * 3.0);
      } else if (plasma < 0.66) {
        color = mix(color2, color3, (plasma - 0.33) * 3.0);
      } else {
        color = mix(color3, color4, (plasma - 0.66) * 3.0);
      }
      
      // Intensity boost
      color *= intensity;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return { type: 'plasma', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED GLYPH SHADER (ATLEAN)
// ═══════════════════════════════════════════════════════════════════════════════

export const createGlyphShader = (): ShaderConfig => {
  const uniforms = {
    time: { value: 0 },
    glyphColor: { value: new THREE.Color(0xD8B26A) }, // Sacred Gold
    backgroundColor: { value: new THREE.Color(0x2F4C39) }, // Shadow Moss
    glowColor: { value: new THREE.Color(0x3EB4A2) }, // Cenote Turquoise
    animationSpeed: { value: 0.3 },
    glyphDensity: { value: 5.0 },
    glowIntensity: { value: 1.5 },
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 glyphColor;
    uniform vec3 backgroundColor;
    uniform vec3 glowColor;
    uniform float time;
    uniform float animationSpeed;
    uniform float glyphDensity;
    uniform float glowIntensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Hash for pseudo-random
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    // Simple glyph pattern (Maya-inspired geometric)
    float glyphPattern(vec2 uv) {
      vec2 grid = fract(uv * glyphDensity);
      vec2 id = floor(uv * glyphDensity);
      
      float h = hash(id);
      float glyph = 0.0;
      
      // Different glyph shapes based on hash
      if (h < 0.2) {
        // Circle
        float dist = length(grid - 0.5);
        glyph = smoothstep(0.4, 0.35, dist) - smoothstep(0.35, 0.3, dist);
      } else if (h < 0.4) {
        // Square
        vec2 d = abs(grid - 0.5);
        glyph = smoothstep(0.4, 0.35, max(d.x, d.y)) - smoothstep(0.35, 0.3, max(d.x, d.y));
      } else if (h < 0.6) {
        // Triangle
        float tri = abs(grid.y - grid.x * 0.5 - 0.25);
        glyph = smoothstep(0.2, 0.15, tri);
      } else if (h < 0.8) {
        // Cross
        float cross = min(
          abs(grid.x - 0.5),
          abs(grid.y - 0.5)
        );
        glyph = smoothstep(0.15, 0.1, cross);
      } else {
        // Spiral
        vec2 centered = grid - 0.5;
        float angle = atan(centered.y, centered.x);
        float dist = length(centered);
        float spiral = sin(angle * 3.0 + dist * 10.0);
        glyph = smoothstep(0.2, 0.5, spiral);
      }
      
      return glyph;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Animated glyphs (some appear/disappear over time)
      vec2 id = floor(uv * glyphDensity);
      float h = hash(id);
      float appear = sin(time * animationSpeed + h * 6.28) * 0.5 + 0.5;
      appear = smoothstep(0.3, 0.7, appear);
      
      // Get glyph pattern
      float glyph = glyphPattern(uv) * appear;
      
      // Pulsing glow
      float pulse = sin(time * animationSpeed * 2.0) * 0.3 + 0.7;
      float glow = glyph * pulse * glowIntensity;
      
      // Color mixing
      vec3 color = backgroundColor;
      color = mix(color, glyphColor, glyph);
      color += glowColor * glow * 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return { type: 'glyph', uniforms, vertexShader, fragmentShader };
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  createEnergyShader,
  createCrystalShader,
  createCircuitShader,
  createPlasmaShader,
  createGlyphShader,
};
