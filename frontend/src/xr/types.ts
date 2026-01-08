/**
 * CHE·NU™ V75 — XR Environment Types & Hooks
 * ============================================
 * Types and hooks for XR environment generation
 */

// =============================================================================
// TYPES
// =============================================================================

export type XRTemplateType = 
  | 'personal_room'
  | 'business_room'
  | 'cause_room'
  | 'lab_room'
  | 'custom_room';

export type XRZoneType =
  | 'intent_wall'
  | 'decision_wall'
  | 'action_table'
  | 'memory_kiosk'
  | 'timeline_strip'
  | 'resource_shelf';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface XRZone {
  id: string;
  type: XRZoneType;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  content?: XRZoneContent;
  interactive: boolean;
  visible: boolean;
}

export interface XRZoneContent {
  title?: string;
  items?: Array<{
    id: string;
    type: string;
    label: string;
    data?: Record<string, any>;
  }>;
}

export interface XREnvironment {
  id: string;
  template: XRTemplateType;
  thread_id: string;
  sphere_id: string;
  zones: XRZone[];
  lighting: XRLighting;
  atmosphere: XRAtmosphere;
  created_at: string;
  updated_at: string;
}

export interface XRLighting {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: Vector3;
  };
  fog?: {
    color: string;
    near: number;
    far: number;
  };
}

export interface XRAtmosphere {
  skyColor: string;
  groundColor: string;
  particleSystem?: {
    type: 'dust' | 'stars' | 'none';
    density: number;
  };
}

export interface XRBlueprint {
  id: string;
  name: string;
  template: XRTemplateType;
  preview_url?: string;
  zones: XRZone[];
  default_lighting: XRLighting;
  default_atmosphere: XRAtmosphere;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const XR_TEMPLATES: Record<XRTemplateType, XRBlueprint> = {
  personal_room: {
    id: 'tpl_personal',
    name: 'Espace Personnel',
    template: 'personal_room',
    zones: [
      {
        id: 'z1',
        type: 'intent_wall',
        position: { x: 0, y: 1.5, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 2, z: 0.1 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z2',
        type: 'action_table',
        position: { x: 0, y: 0.8, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 0.1, z: 1.5 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z3',
        type: 'memory_kiosk',
        position: { x: 3, y: 1, z: 0 },
        rotation: { x: 0, y: -90, z: 0 },
        scale: { x: 1, y: 2, z: 0.5 },
        interactive: true,
        visible: true,
      },
    ],
    default_lighting: {
      ambient: { color: '#404060', intensity: 0.4 },
      directional: { color: '#ffffff', intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
      fog: { color: '#1a1f2e', near: 10, far: 50 },
    },
    default_atmosphere: {
      skyColor: '#0a0e17',
      groundColor: '#1a1f2e',
      particleSystem: { type: 'dust', density: 0.3 },
    },
  },
  business_room: {
    id: 'tpl_business',
    name: 'Salle de Réunion',
    template: 'business_room',
    zones: [
      {
        id: 'z1',
        type: 'intent_wall',
        position: { x: 0, y: 2, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6, y: 3, z: 0.1 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z2',
        type: 'decision_wall',
        position: { x: -4, y: 1.5, z: 0 },
        rotation: { x: 0, y: 90, z: 0 },
        scale: { x: 4, y: 2.5, z: 0.1 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z3',
        type: 'action_table',
        position: { x: 0, y: 0.75, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 0.1, z: 2 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z4',
        type: 'timeline_strip',
        position: { x: 4, y: 1, z: 0 },
        rotation: { x: 0, y: -90, z: 0 },
        scale: { x: 0.5, y: 2, z: 4 },
        interactive: true,
        visible: true,
      },
    ],
    default_lighting: {
      ambient: { color: '#d8b26a', intensity: 0.3 },
      directional: { color: '#ffffff', intensity: 1, position: { x: 0, y: 10, z: 5 } },
    },
    default_atmosphere: {
      skyColor: '#1a1510',
      groundColor: '#2a2520',
    },
  },
  cause_room: {
    id: 'tpl_cause',
    name: 'Espace Communautaire',
    template: 'cause_room',
    zones: [
      {
        id: 'z1',
        type: 'intent_wall',
        position: { x: 0, y: 2, z: -4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5, y: 2.5, z: 0.1 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z2',
        type: 'resource_shelf',
        position: { x: 3, y: 1.5, z: -2 },
        rotation: { x: 0, y: -45, z: 0 },
        scale: { x: 2, y: 3, z: 0.5 },
        interactive: true,
        visible: true,
      },
    ],
    default_lighting: {
      ambient: { color: '#3eb4a2', intensity: 0.4 },
      directional: { color: '#ffffff', intensity: 0.7, position: { x: 3, y: 8, z: 3 } },
    },
    default_atmosphere: {
      skyColor: '#0a1512',
      groundColor: '#1a2522',
      particleSystem: { type: 'stars', density: 0.5 },
    },
  },
  lab_room: {
    id: 'tpl_lab',
    name: 'Laboratoire',
    template: 'lab_room',
    zones: [
      {
        id: 'z1',
        type: 'intent_wall',
        position: { x: 0, y: 2, z: -4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 2, z: 0.1 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z2',
        type: 'action_table',
        position: { x: 0, y: 1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 0.1, z: 1.5 },
        interactive: true,
        visible: true,
      },
      {
        id: 'z3',
        type: 'memory_kiosk',
        position: { x: -3, y: 1.5, z: -1 },
        rotation: { x: 0, y: 45, z: 0 },
        scale: { x: 1.5, y: 2.5, z: 0.5 },
        interactive: true,
        visible: true,
      },
    ],
    default_lighting: {
      ambient: { color: '#8b5cf6', intensity: 0.3 },
      directional: { color: '#e0e0ff', intensity: 0.9, position: { x: 0, y: 10, z: 0 } },
      fog: { color: '#0a0815', near: 5, far: 30 },
    },
    default_atmosphere: {
      skyColor: '#0a0815',
      groundColor: '#15102a',
      particleSystem: { type: 'dust', density: 0.2 },
    },
  },
  custom_room: {
    id: 'tpl_custom',
    name: 'Espace Personnalisé',
    template: 'custom_room',
    zones: [],
    default_lighting: {
      ambient: { color: '#404040', intensity: 0.5 },
      directional: { color: '#ffffff', intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
    },
    default_atmosphere: {
      skyColor: '#0a0a0a',
      groundColor: '#1a1a1a',
    },
  },
};

export const ZONE_LABELS: Record<XRZoneType, string> = {
  intent_wall: 'Mur d\'Intention',
  decision_wall: 'Mur des Décisions',
  action_table: 'Table d\'Actions',
  memory_kiosk: 'Kiosque Mémoire',
  timeline_strip: 'Timeline',
  resource_shelf: 'Étagère Ressources',
};

// =============================================================================
// GENERATOR FUNCTIONS
// =============================================================================

export function generateEnvironment(
  threadId: string,
  sphereId: string,
  template: XRTemplateType = 'personal_room'
): XREnvironment {
  const blueprint = XR_TEMPLATES[template];
  
  return {
    id: `xr_${threadId}_${Date.now()}`,
    template,
    thread_id: threadId,
    sphere_id: sphereId,
    zones: blueprint.zones.map(zone => ({ ...zone, id: `${zone.id}_${threadId}` })),
    lighting: { ...blueprint.default_lighting },
    atmosphere: { ...blueprint.default_atmosphere },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getTemplateForSphere(sphereId: string): XRTemplateType {
  const sphereTemplateMap: Record<string, XRTemplateType> = {
    personal: 'personal_room',
    business: 'business_room',
    community: 'cause_room',
    scholar: 'lab_room',
    studio: 'lab_room',
    government: 'business_room',
    social: 'personal_room',
    entertainment: 'personal_room',
    myteam: 'business_room',
  };
  
  return sphereTemplateMap[sphereId] || 'custom_room';
}

// =============================================================================
// HOOKS
// =============================================================================

import { useState, useCallback, useEffect } from 'react';

export function useXREnvironment(threadId: string, sphereId: string) {
  const [environment, setEnvironment] = useState<XREnvironment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (template?: XRTemplateType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tpl = template || getTemplateForSphere(sphereId);
      const env = generateEnvironment(threadId, sphereId, tpl);
      setEnvironment(env);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate environment');
    } finally {
      setIsLoading(false);
    }
  }, [threadId, sphereId]);

  const updateZone = useCallback((zoneId: string, updates: Partial<XRZone>) => {
    setEnvironment(prev => {
      if (!prev) return null;
      return {
        ...prev,
        zones: prev.zones.map(zone =>
          zone.id === zoneId ? { ...zone, ...updates } : zone
        ),
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const updateLighting = useCallback((updates: Partial<XRLighting>) => {
    setEnvironment(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lighting: { ...prev.lighting, ...updates },
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const updateAtmosphere = useCallback((updates: Partial<XRAtmosphere>) => {
    setEnvironment(prev => {
      if (!prev) return null;
      return {
        ...prev,
        atmosphere: { ...prev.atmosphere, ...updates },
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const reset = useCallback(() => {
    setEnvironment(null);
    setError(null);
  }, []);

  return {
    environment,
    isLoading,
    error,
    generate,
    updateZone,
    updateLighting,
    updateAtmosphere,
    reset,
  };
}

export default useXREnvironment;
