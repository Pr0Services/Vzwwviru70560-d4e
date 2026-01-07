/**
 * CHE·NU™ XR ARCHITECTURE SYSTEM — HOOKS
 * 
 * State management for coherent spatial language.
 * Validation, primitives, semantics.
 * 
 * @version 1.0
 * @status V51-ready
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  ArchitecturalPrimitive,
  ArchitecturalPrimitiveType,
  AnchorPrimitive,
  PathPrimitive,
  FieldPrimitive,
  NodePrimitive,
  BoundaryPrimitive,
  HorizonPrimitive,
  DepthPrimitive,
  SpatialSemantics,
  SemanticViolation,
  ColorPhilosophy,
  MaterialDefinition,
  NavigationConfig,
  RoomType,
  RoomTypeDefinition,
  RoomLayout,
  ComplianceCheckResult,
  ValidationRule,
  ValidationContext,
  ValidationResult,
  CreatePrimitiveRequest,
  ValidateRoomRequest,
  ValidateRoomResponse,
} from './xr-architecture-system.types';

import {
  DEFAULT_SPATIAL_SEMANTICS,
  DEFAULT_COLOR_PHILOSOPHY,
  DEFAULT_NAVIGATION_CONFIG,
  ARCHITECT_AGENT_CAPABILITIES,
  XR_ARCHITECTURE_TOKENS,
} from './xr-architecture-system.types';

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePrimitivesOptions {
  initial_primitives?: ArchitecturalPrimitive[];
  max_primitives?: number;
  validate_on_add?: boolean;
}

export interface UsePrimitivesReturn {
  // State
  primitives: ArchitecturalPrimitive[];
  primitive_count: number;
  
  // CRUD
  add_primitive: (primitive: ArchitecturalPrimitive) => boolean;
  remove_primitive: (id: string) => void;
  update_primitive: (id: string, updates: Partial<ArchitecturalPrimitive>) => void;
  clear_primitives: () => void;
  
  // Query
  get_primitive: (id: string) => ArchitecturalPrimitive | undefined;
  get_primitives_by_type: (type: ArchitecturalPrimitiveType) => ArchitecturalPrimitive[];
  get_primitives_by_source: (source_type: string, source_id: string) => ArchitecturalPrimitive[];
  
  // Validation
  last_validation: ComplianceCheckResult | null;
}

export function usePrimitives(options: UsePrimitivesOptions = {}): UsePrimitivesReturn {
  const {
    initial_primitives = [],
    max_primitives = 500,
    validate_on_add = true,
  } = options;
  
  const [primitives, setPrimitives] = useState<ArchitecturalPrimitive[]>(initial_primitives);
  const [last_validation, setLastValidation] = useState<ComplianceCheckResult | null>(null);
  
  const add_primitive = useCallback((primitive: ArchitecturalPrimitive): boolean => {
    if (primitives.length >= max_primitives) {
      logger.warn('[XR Architecture] Max primitives reached');
      return false;
    }
    
    // Basic validation
    if (!primitive.id || !primitive.type || !primitive.semantic_meaning) {
      logger.warn('[XR Architecture] Invalid primitive structure');
      return false;
    }
    
    setPrimitives(prev => [...prev, primitive]);
    return true;
  }, [primitives.length, max_primitives]);
  
  const remove_primitive = useCallback((id: string) => {
    setPrimitives(prev => prev.filter(p => p.id !== id));
  }, []);
  
  const update_primitive = useCallback((id: string, updates: Partial<ArchitecturalPrimitive>) => {
    setPrimitives(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);
  
  const clear_primitives = useCallback(() => {
    setPrimitives([]);
  }, []);
  
  const get_primitive = useCallback((id: string) => {
    return primitives.find(p => p.id === id);
  }, [primitives]);
  
  const get_primitives_by_type = useCallback((type: ArchitecturalPrimitiveType) => {
    return primitives.filter(p => p.type === type);
  }, [primitives]);
  
  const get_primitives_by_source = useCallback((source_type: string, source_id: string) => {
    return primitives.filter(p => 
      p.source_type === source_type && p.source_id === source_id
    );
  }, [primitives]);
  
  return {
    primitives,
    primitive_count: primitives.length,
    add_primitive,
    remove_primitive,
    update_primitive,
    clear_primitives,
    get_primitive,
    get_primitives_by_type,
    get_primitives_by_source,
    last_validation,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL SEMANTICS HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSpatialSemanticsOptions {
  custom_semantics?: Partial<SpatialSemantics>;
  strict_mode?: boolean;
}

export interface UseSpatialSemanticsReturn {
  // State
  semantics: SpatialSemantics;
  
  // Checks
  check_center_meaning: (element_id: string, implied_meaning: string) => SemanticViolation | null;
  check_height_meaning: (element_id: string, implied_meaning: string) => SemanticViolation | null;
  check_size_meaning: (element_id: string, implied_meaning: string) => SemanticViolation | null;
  check_brightness_meaning: (element_id: string, implied_meaning: string) => SemanticViolation | null;
  check_motion_meaning: (element_id: string, implied_meaning: string) => SemanticViolation | null;
  
  // Full validation
  validate_semantics: (primitives: ArchitecturalPrimitive[]) => SemanticViolation[];
  
  // Explanation
  explain_semantic: (rule: keyof SpatialSemantics) => string;
}

export function useSpatialSemantics(options: UseSpatialSemanticsOptions = {}): UseSpatialSemanticsReturn {
  const {
    custom_semantics = {},
    strict_mode = true,
  } = options;
  
  const semantics = useMemo<SpatialSemantics>(() => ({
    ...DEFAULT_SPATIAL_SEMANTICS,
    ...custom_semantics,
  }), [custom_semantics]);
  
  // Forbidden meanings (manipulative)
  const FORBIDDEN_CENTER = ['importance', 'priority', 'value', 'best'];
  const FORBIDDEN_HEIGHT = ['authority', 'power', 'rank', 'status'];
  const FORBIDDEN_SIZE = ['value', 'worth', 'importance', 'priority'];
  const FORBIDDEN_BRIGHTNESS = ['priority', 'urgency', 'importance', 'alert'];
  const FORBIDDEN_MOTION = ['urgency', 'emergency', 'rush', 'pressure'];
  
  const check_center_meaning = useCallback((element_id: string, implied_meaning: string): SemanticViolation | null => {
    const lower = implied_meaning.toLowerCase();
    if (FORBIDDEN_CENTER.some(f => lower.includes(f))) {
      return {
        rule: 'center_means',
        description: `CENTER should mean '${semantics.center_means}', not '${implied_meaning}'`,
        severity: strict_mode ? 'error' : 'warning',
        element_id,
      };
    }
    return null;
  }, [semantics.center_means, strict_mode]);
  
  const check_height_meaning = useCallback((element_id: string, implied_meaning: string): SemanticViolation | null => {
    const lower = implied_meaning.toLowerCase();
    if (FORBIDDEN_HEIGHT.some(f => lower.includes(f))) {
      return {
        rule: 'height_means',
        description: `HEIGHT should mean '${semantics.height_means}', not '${implied_meaning}'`,
        severity: strict_mode ? 'error' : 'warning',
        element_id,
      };
    }
    return null;
  }, [semantics.height_means, strict_mode]);
  
  const check_size_meaning = useCallback((element_id: string, implied_meaning: string): SemanticViolation | null => {
    const lower = implied_meaning.toLowerCase();
    if (FORBIDDEN_SIZE.some(f => lower.includes(f))) {
      return {
        rule: 'size_means',
        description: `SIZE should mean '${semantics.size_means}', not '${implied_meaning}'`,
        severity: strict_mode ? 'error' : 'warning',
        element_id,
      };
    }
    return null;
  }, [semantics.size_means, strict_mode]);
  
  const check_brightness_meaning = useCallback((element_id: string, implied_meaning: string): SemanticViolation | null => {
    const lower = implied_meaning.toLowerCase();
    if (FORBIDDEN_BRIGHTNESS.some(f => lower.includes(f))) {
      return {
        rule: 'brightness_means',
        description: `BRIGHTNESS should mean '${semantics.brightness_means}', not '${implied_meaning}'`,
        severity: strict_mode ? 'error' : 'warning',
        element_id,
      };
    }
    return null;
  }, [semantics.brightness_means, strict_mode]);
  
  const check_motion_meaning = useCallback((element_id: string, implied_meaning: string): SemanticViolation | null => {
    const lower = implied_meaning.toLowerCase();
    if (FORBIDDEN_MOTION.some(f => lower.includes(f))) {
      return {
        rule: 'motion_means',
        description: `MOTION should mean '${semantics.motion_means}', not '${implied_meaning}'`,
        severity: strict_mode ? 'error' : 'warning',
        element_id,
      };
    }
    return null;
  }, [semantics.motion_means, strict_mode]);
  
  const validate_semantics = useCallback((primitives: ArchitecturalPrimitive[]): SemanticViolation[] => {
    const violations: SemanticViolation[] = [];
    
    for (const primitive of primitives) {
      const meaning = primitive.semantic_meaning.toLowerCase();
      
      // Check for manipulative semantics in meaning description
      const centerCheck = check_center_meaning(primitive.id, meaning);
      if (centerCheck) violations.push(centerCheck);
      
      const heightCheck = check_height_meaning(primitive.id, meaning);
      if (heightCheck) violations.push(heightCheck);
      
      const sizeCheck = check_size_meaning(primitive.id, meaning);
      if (sizeCheck) violations.push(sizeCheck);
      
      const brightnessCheck = check_brightness_meaning(primitive.id, meaning);
      if (brightnessCheck) violations.push(brightnessCheck);
      
      const motionCheck = check_motion_meaning(primitive.id, meaning);
      if (motionCheck) violations.push(motionCheck);
    }
    
    return violations;
  }, [check_center_meaning, check_height_meaning, check_size_meaning, check_brightness_meaning, check_motion_meaning]);
  
  const explain_semantic = useCallback((rule: keyof SpatialSemantics): string => {
    const explanations: Record<keyof SpatialSemantics, string> = {
      center_means: `In CHE·NU XR, being at the CENTER means '${semantics.center_means}', NOT importance or priority. The center is where you look from, not what matters most.`,
      height_means: `HEIGHT represents '${semantics.height_means}', NOT authority or rank. Higher elements show broader scope, not higher status.`,
      size_means: `SIZE represents '${semantics.size_means}', NOT value or importance. Larger elements have more parts, not more worth.`,
      brightness_means: `BRIGHTNESS represents '${semantics.brightness_means}', NOT priority or urgency. Brighter elements are more certain, not more important.`,
      motion_means: `MOTION represents '${semantics.motion_means}', NOT urgency or pressure. Moving elements are changing, not demanding attention.`,
    };
    return explanations[rule];
  }, [semantics]);
  
  return {
    semantics,
    check_center_meaning,
    check_height_meaning,
    check_size_meaning,
    check_brightness_meaning,
    check_motion_meaning,
    validate_semantics,
    explain_semantic,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR PHILOSOPHY HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseColorPhilosophyOptions {
  custom_philosophy?: Partial<ColorPhilosophy>;
}

export interface UseColorPhilosophyReturn {
  // State
  philosophy: ColorPhilosophy;
  
  // Validation
  validate_color: (color: string) => { valid: boolean; reason?: string };
  validate_material: (material: MaterialDefinition) => { valid: boolean; violations: string[] };
  
  // Helpers
  get_state_color: (state: 'neutral' | 'positive' | 'negative' | 'uncertain') => string;
  desaturate_color: (color: string, target_saturation?: number) => string;
  
  // Tokens
  tokens: typeof XR_ARCHITECTURE_TOKENS.colors;
}

export function useColorPhilosophy(options: UseColorPhilosophyOptions = {}): UseColorPhilosophyReturn {
  const { custom_philosophy = {} } = options;
  
  const philosophy = useMemo<ColorPhilosophy>(() => ({
    ...DEFAULT_COLOR_PHILOSOPHY,
    ...custom_philosophy,
  }), [custom_philosophy]);
  
  // Parse hex color to HSL
  const hexToHSL = useCallback((hex: string): { h: number; s: number; l: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return { h, s, l };
  }, []);
  
  const validate_color = useCallback((color: string): { valid: boolean; reason?: string } => {
    const hsl = hexToHSL(color);
    if (!hsl) {
      return { valid: false, reason: 'Invalid color format' };
    }
    
    if (hsl.s > philosophy.max_saturation) {
      return { 
        valid: false, 
        reason: `Saturation ${(hsl.s * 100).toFixed(0)}% exceeds max ${(philosophy.max_saturation * 100).toFixed(0)}%` 
      };
    }
    
    if (hsl.l > philosophy.max_brightness) {
      return { 
        valid: false, 
        reason: `Brightness ${(hsl.l * 100).toFixed(0)}% exceeds max ${(philosophy.max_brightness * 100).toFixed(0)}%` 
      };
    }
    
    // Check for aggressive red
    if (philosophy.no_aggressive_red && hsl.h < 0.05 && hsl.s > 0.3) {
      return { valid: false, reason: 'Aggressive red colors are prohibited' };
    }
    
    return { valid: true };
  }, [philosophy, hexToHSL]);
  
  const validate_material = useCallback((material: MaterialDefinition): { valid: boolean; violations: string[] } => {
    const violations: string[] = [];
    
    // Check base color
    const colorCheck = validate_color(material.base_color);
    if (!colorCheck.valid) {
      violations.push(`Base color: ${colorCheck.reason}`);
    }
    
    // Check emissive
    if (material.emissive_color) {
      const emissiveCheck = validate_color(material.emissive_color);
      if (!emissiveCheck.valid) {
        violations.push(`Emissive color: ${emissiveCheck.reason}`);
      }
      
      if (material.emissive_intensity && material.emissive_intensity > 0.5) {
        violations.push('Emissive intensity too high (max 0.5)');
      }
    }
    
    // Prefer higher roughness (softer)
    if (material.roughness < 0.3) {
      violations.push('Roughness too low (prefer softer materials, min 0.3)');
    }
    
    return {
      valid: violations.length === 0,
      violations,
    };
  }, [validate_color]);
  
  const get_state_color = useCallback((state: 'neutral' | 'positive' | 'negative' | 'uncertain'): string => {
    switch (state) {
      case 'positive': return philosophy.state_positive;
      case 'negative': return philosophy.state_negative;
      case 'uncertain': return philosophy.state_uncertain;
      default: return philosophy.state_neutral;
    }
  }, [philosophy]);
  
  const desaturate_color = useCallback((color: string, target_saturation?: number): string => {
    const hsl = hexToHSL(color);
    if (!hsl) return color;
    
    const newS = Math.min(hsl.s, target_saturation ?? philosophy.max_saturation);
    const newL = Math.min(hsl.l, philosophy.max_brightness);
    
    // Convert back to hex (simplified)
    const h = hsl.h * 360;
    const s = newS * 100;
    const l = newL * 100;
    
    const c = (1 - Math.abs(2 * newL - 1)) * newS;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = newL - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, [philosophy, hexToHSL]);
  
  return {
    philosophy,
    validate_color,
    validate_material,
    get_state_color,
    desaturate_color,
    tokens: XR_ARCHITECTURE_TOKENS.colors,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNavigationConfigOptions {
  custom_config?: Partial<NavigationConfig>;
}

export interface UseNavigationConfigReturn {
  // State
  config: NavigationConfig;
  
  // Validation
  validate_navigation: () => { valid: boolean; violations: string[] };
  
  // Helpers
  get_locomotion_speed: () => number;
  is_exit_accessible: () => boolean;
}

export function useNavigationConfig(options: UseNavigationConfigOptions = {}): UseNavigationConfigReturn {
  const { custom_config = {} } = options;
  
  const config = useMemo<NavigationConfig>(() => ({
    ...DEFAULT_NAVIGATION_CONFIG,
    ...custom_config,
  }), [custom_config]);
  
  const validate_navigation = useCallback((): { valid: boolean; violations: string[] } => {
    const violations: string[] = [];
    
    // Forced paths are NEVER allowed
    if (config.forced_paths_allowed) {
      violations.push('Forced paths are prohibited');
    }
    
    // Multiple exits ALWAYS required
    if (!config.multiple_exits_required) {
      violations.push('Multiple exits must be required');
    }
    
    // Exit must ALWAYS be visible
    if (!config.exit_always_visible) {
      violations.push('Exit must always be visible');
    }
    
    // Exit must be simple
    if (!config.exit_gesture_simple) {
      violations.push('Exit gesture must be simple (one-gesture)');
    }
    
    return {
      valid: violations.length === 0,
      violations,
    };
  }, [config]);
  
  const get_locomotion_speed = useCallback((): number => {
    return config.default_locomotion_speed;
  }, [config.default_locomotion_speed]);
  
  const is_exit_accessible = useCallback((): boolean => {
    return config.exit_always_visible && config.exit_gesture_simple;
  }, [config.exit_always_visible, config.exit_gesture_simple]);
  
  return {
    config,
    validate_navigation,
    get_locomotion_speed,
    is_exit_accessible,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM VALIDATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseRoomValidationOptions {
  room_type: RoomType;
  strict_mode?: boolean;
}

export interface UseRoomValidationReturn {
  // State
  room_type: RoomType;
  
  // Validation
  validate_room: (primitives: ArchitecturalPrimitive[]) => ComplianceCheckResult;
  
  // Helpers
  get_room_definition: () => RoomTypeDefinition;
  is_primitive_allowed: (type: ArchitecturalPrimitiveType) => boolean;
}

export function useRoomValidation(options: UseRoomValidationOptions): UseRoomValidationReturn {
  const { room_type, strict_mode = true } = options;
  
  // Room type definitions
  const ROOM_DEFINITIONS: Record<RoomType, RoomTypeDefinition> = useMemo(() => ({
    meta_room: {
      type: 'meta_room',
      name: 'XR Meta Room',
      description: 'Personal cognitive environment',
      inherits_spatial_grammar: true,
      inherits_safety_rules: true,
      inherits_semantic_primitives: true,
      allowed_primitives: ['anchor', 'path', 'field', 'node', 'boundary', 'horizon', 'depth'],
      required_primitives: ['anchor'],
      default_layout: { shape: 'circular', symmetry: 'radial', center_defined: true, horizon_visible: true },
      max_primitive_count: 200,
      max_depth: 5,
    },
    decision_room: {
      type: 'decision_room',
      name: 'XR Decision Room',
      description: 'Conscious decision-making space',
      inherits_spatial_grammar: true,
      inherits_safety_rules: true,
      inherits_semantic_primitives: true,
      allowed_primitives: ['anchor', 'path', 'field', 'node', 'boundary'],
      required_primitives: ['anchor', 'node'],
      default_layout: { shape: 'circular', symmetry: 'radial', center_defined: true, horizon_visible: false },
      max_primitive_count: 100,
      max_depth: 3,
    },
    team_reflection: {
      type: 'team_reflection',
      name: 'XR Team Reflection',
      description: 'Shared reflection space',
      inherits_spatial_grammar: true,
      inherits_safety_rules: true,
      inherits_semantic_primitives: true,
      allowed_primitives: ['anchor', 'path', 'field', 'node', 'boundary'],
      required_primitives: ['field'],
      default_layout: { shape: 'circular', symmetry: 'radial', center_defined: true, horizon_visible: true },
      max_primitive_count: 150,
      max_depth: 3,
    },
    narrative_replay: {
      type: 'narrative_replay',
      name: 'XR Narrative Replay',
      description: 'Chronological reconstruction',
      inherits_spatial_grammar: true,
      inherits_safety_rules: true,
      inherits_semantic_primitives: true,
      allowed_primitives: ['anchor', 'path', 'field', 'node', 'horizon'],
      required_primitives: ['path', 'anchor'],
      default_layout: { shape: 'linear', symmetry: 'bilateral', center_defined: false, horizon_visible: true },
      max_primitive_count: 300,
      max_depth: 5,
    },
    custom: {
      type: 'custom',
      name: 'Custom Room',
      description: 'User-defined room',
      inherits_spatial_grammar: true,
      inherits_safety_rules: true,
      inherits_semantic_primitives: true,
      allowed_primitives: ['anchor', 'path', 'field', 'node', 'boundary', 'horizon', 'depth'],
      required_primitives: [],
      default_layout: { shape: 'organic', symmetry: 'none', center_defined: false, horizon_visible: true },
      max_primitive_count: 500,
      max_depth: 10,
    },
  }), []);
  
  const get_room_definition = useCallback((): RoomTypeDefinition => {
    return ROOM_DEFINITIONS[room_type];
  }, [room_type, ROOM_DEFINITIONS]);
  
  const is_primitive_allowed = useCallback((type: ArchitecturalPrimitiveType): boolean => {
    const def = ROOM_DEFINITIONS[room_type];
    return def.allowed_primitives.includes(type);
  }, [room_type, ROOM_DEFINITIONS]);
  
  const validate_room = useCallback((primitives: ArchitecturalPrimitive[]): ComplianceCheckResult => {
    const violations: SemanticViolation[] = [];
    const warnings: SemanticViolation[] = [];
    const def = ROOM_DEFINITIONS[room_type];
    
    // Check primitive count
    if (primitives.length > def.max_primitive_count) {
      violations.push({
        rule: 'size_means',
        description: `Too many primitives: ${primitives.length} > ${def.max_primitive_count}`,
        severity: 'error',
      });
    }
    
    // Check allowed primitives
    for (const primitive of primitives) {
      if (!def.allowed_primitives.includes(primitive.type)) {
        violations.push({
          rule: 'center_means',
          description: `Primitive type '${primitive.type}' not allowed in ${room_type}`,
          severity: strict_mode ? 'error' : 'warning',
          element_id: primitive.id,
        });
      }
    }
    
    // Check required primitives
    for (const required of def.required_primitives) {
      const hasRequired = primitives.some(p => p.type === required);
      if (!hasRequired) {
        warnings.push({
          rule: 'center_means',
          description: `Missing required primitive type: ${required}`,
          severity: 'warning',
        });
      }
    }
    
    // Check depth
    const depthPrimitives = primitives.filter(p => p.type === 'depth') as DepthPrimitive[];
    for (const depth of depthPrimitives) {
      if (depth.depth_level > def.max_depth) {
        violations.push({
          rule: 'height_means',
          description: `Depth level ${depth.depth_level} exceeds max ${def.max_depth}`,
          severity: 'error',
          element_id: depth.id,
        });
      }
    }
    
    return {
      compliant: violations.length === 0,
      violations,
      warnings,
      checked_at: new Date().toISOString(),
      checked_by: 'system',
    };
  }, [room_type, strict_mode, ROOM_DEFINITIONS]);
  
  return {
    room_type,
    validate_room,
    get_room_definition,
    is_primitive_allowed,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECT AGENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseArchitectAgentOptions {
  enabled?: boolean;
  auto_validate?: boolean;
}

export interface UseArchitectAgentReturn {
  // State
  enabled: boolean;
  capabilities: typeof ARCHITECT_AGENT_CAPABILITIES;
  
  // Actions
  request_validation: (primitives: ArchitecturalPrimitive[], room_type: RoomType) => Promise<ComplianceCheckResult>;
  block_violation: (violation: SemanticViolation) => void;
  
  // Status
  last_check: ComplianceCheckResult | null;
  is_validating: boolean;
}

export function useArchitectAgent(options: UseArchitectAgentOptions = {}): UseArchitectAgentReturn {
  const { enabled = true, auto_validate = false } = options;
  
  const [last_check, setLastCheck] = useState<ComplianceCheckResult | null>(null);
  const [is_validating, setIsValidating] = useState(false);
  
  const request_validation = useCallback(async (
    primitives: ArchitecturalPrimitive[],
    room_type: RoomType
  ): Promise<ComplianceCheckResult> => {
    if (!enabled) {
      return {
        compliant: true,
        violations: [],
        warnings: [],
        checked_at: new Date().toISOString(),
        checked_by: 'system',
      };
    }
    
    setIsValidating(true);
    
    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const violations: SemanticViolation[] = [];
    const warnings: SemanticViolation[] = [];
    
    // Validate all primitives
    for (const primitive of primitives) {
      // Check semantic meaning is verbal
      if (!primitive.semantic_verbal || primitive.semantic_verbal.length < 5) {
        warnings.push({
          rule: 'center_means',
          description: 'Primitive should have verbal explanation',
          severity: 'warning',
          element_id: primitive.id,
        });
      }
      
      // Check for manipulative patterns
      const meaning = primitive.semantic_meaning.toLowerCase();
      if (meaning.includes('important') || meaning.includes('priority') || meaning.includes('urgent')) {
        violations.push({
          rule: 'brightness_means',
          description: 'Semantic meaning suggests manipulative positioning',
          severity: 'error',
          element_id: primitive.id,
        });
      }
    }
    
    const result: ComplianceCheckResult = {
      compliant: violations.length === 0,
      violations,
      warnings,
      checked_at: new Date().toISOString(),
      checked_by: 'architect_agent',
    };
    
    setLastCheck(result);
    setIsValidating(false);
    
    return result;
  }, [enabled]);
  
  const block_violation = useCallback((violation: SemanticViolation) => {
    logger.error('[XR Architect] Blocking violation:', violation);
    // In real implementation, this would prevent the violating action
  }, []);
  
  return {
    enabled,
    capabilities: ARCHITECT_AGENT_CAPABILITIES,
    request_validation,
    block_violation,
    last_check,
    is_validating,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRArchitectureOptions {
  room_type: RoomType;
  initial_primitives?: ArchitecturalPrimitive[];
  color_philosophy?: Partial<ColorPhilosophy>;
  spatial_semantics?: Partial<SpatialSemantics>;
  navigation_config?: Partial<NavigationConfig>;
  architect_agent_enabled?: boolean;
  strict_mode?: boolean;
}

export interface UseXRArchitectureReturn {
  // Primitives
  primitives: UsePrimitivesReturn;
  
  // Semantics
  semantics: UseSpatialSemanticsReturn;
  
  // Colors
  colors: UseColorPhilosophyReturn;
  
  // Navigation
  navigation: UseNavigationConfigReturn;
  
  // Room
  room: UseRoomValidationReturn;
  
  // Architect
  architect: UseArchitectAgentReturn;
  
  // Combined validation
  validate_all: () => Promise<ComplianceCheckResult>;
}

export function useXRArchitecture(options: UseXRArchitectureOptions): UseXRArchitectureReturn {
  const {
    room_type,
    initial_primitives,
    color_philosophy,
    spatial_semantics,
    navigation_config,
    architect_agent_enabled = true,
    strict_mode = true,
  } = options;
  
  const primitives = usePrimitives({ initial_primitives });
  const semantics = useSpatialSemantics({ custom_semantics: spatial_semantics, strict_mode });
  const colors = useColorPhilosophy({ custom_philosophy: color_philosophy });
  const navigation = useNavigationConfig({ custom_config: navigation_config });
  const room = useRoomValidation({ room_type, strict_mode });
  const architect = useArchitectAgent({ enabled: architect_agent_enabled });
  
  const validate_all = useCallback(async (): Promise<ComplianceCheckResult> => {
    const all_violations: SemanticViolation[] = [];
    const all_warnings: SemanticViolation[] = [];
    
    // Semantic validation
    const semanticViolations = semantics.validate_semantics(primitives.primitives);
    all_violations.push(...semanticViolations.filter(v => v.severity !== 'warning'));
    all_warnings.push(...semanticViolations.filter(v => v.severity === 'warning'));
    
    // Room validation
    const roomResult = room.validate_room(primitives.primitives);
    all_violations.push(...roomResult.violations);
    all_warnings.push(...roomResult.warnings);
    
    // Navigation validation
    const navResult = navigation.validate_navigation();
    for (const violation of navResult.violations) {
      all_violations.push({
        rule: 'motion_means',
        description: violation,
        severity: 'error',
      });
    }
    
    // Color validation for materials
    for (const primitive of primitives.primitives) {
      const materialResult = colors.validate_material(primitive.material);
      for (const violation of materialResult.violations) {
        all_violations.push({
          rule: 'brightness_means',
          description: violation,
          severity: 'error',
          element_id: primitive.id,
        });
      }
    }
    
    // Architect agent validation
    if (architect.enabled) {
      const architectResult = await architect.request_validation(primitives.primitives, room_type);
      all_violations.push(...architectResult.violations);
      all_warnings.push(...architectResult.warnings);
    }
    
    return {
      compliant: all_violations.length === 0,
      violations: all_violations,
      warnings: all_warnings,
      checked_at: new Date().toISOString(),
      checked_by: architect.enabled ? 'architect_agent' : 'system',
    };
  }, [primitives, semantics, room, navigation, colors, architect, room_type]);
  
  return {
    primitives,
    semantics,
    colors,
    navigation,
    room,
    architect,
    validate_all,
  };
}
