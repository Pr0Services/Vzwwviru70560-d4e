/**
 * CHE·NU™ — ATLAS 3D MODULE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Visualisation 3D immersive des 8 sphères CHE·NU
 * ════════════════════════════════════════════════════════════════════════════
 */

export {
  Atlas3DEngine,
  createAtlas3D,
  CHENU_COLORS,
  CHENU_SPHERES,
  DEFAULT_ATLAS_CONFIG
} from './atlas3DEngine';

export type {
  Sphere3D,
  SphereConnection,
  Atlas3DConfig,
  AtlasViewState,
  AtlasInteraction
} from './atlas3DEngine';

// ═══════════════════════════════════════════════════════════════════════════
// REACT COMPONENT HELPER (for React Three Fiber integration)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration pour React Three Fiber
 */
export const Atlas3DReactConfig = {
  // Camera settings
  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: [0, 5, 15] as [number, number, number]
  },
  
  // Controls
  controls: {
    enableZoom: true,
    enablePan: false,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 50,
    autoRotate: true,
    autoRotateSpeed: 0.5
  },
  
  // Post-processing
  postProcessing: {
    bloom: {
      intensity: 0.5,
      luminanceThreshold: 0.9,
      luminanceSmoothing: 0.025
    },
    vignette: {
      offset: 0.5,
      darkness: 0.5
    }
  }
};

/**
 * Sphere positions calculator
 */
export function calculateSpherePositions(
  sphereCount: number,
  orbitRadius: number = 8
): Array<{ x: number; y: number; z: number }> {
  const positions: Array<{ x: number; y: number; z: number }> = [];
  
  for (let i = 0; i < sphereCount; i++) {
    const angle = (i / sphereCount) * Math.PI * 2;
    positions.push({
      x: Math.cos(angle) * orbitRadius,
      y: 0,
      z: Math.sin(angle) * orbitRadius
    });
  }
  
  return positions;
}

/**
 * Activity color calculator
 */
export function getActivityColor(level: 'dormant' | 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'high': return '#4CAF50';
    case 'medium': return '#FFC107';
    case 'low': return '#FF9800';
    case 'dormant': return '#9E9E9E';
  }
}

/**
 * Quick API for Atlas3D
 */
export const Atlas3DAPI = {
  create: createAtlas3D,
  colors: CHENU_COLORS,
  spheres: CHENU_SPHERES,
  defaultConfig: DEFAULT_ATLAS_CONFIG,
  reactConfig: Atlas3DReactConfig,
  utils: {
    calculateSpherePositions,
    getActivityColor
  }
};

export default Atlas3DAPI;
