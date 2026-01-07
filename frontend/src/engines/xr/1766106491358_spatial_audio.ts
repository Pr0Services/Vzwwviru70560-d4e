/**
 * CHE·NU SPATIAL AUDIO SYSTEM (Module 35)
 * ========================================
 * SAFE · NON-AUTONOMOUS · AUDIO DESCRIPTORS ONLY
 * 
 * Spatial audio configuration for immersive XR experiences.
 * Generates audio scene descriptors without playback.
 * 
 * @version 1.0.0
 * @module 35
 * @safe true
 */

// ============================================================
// TYPES
// ============================================================

export type AudioSourceType = 
  | 'point'
  | 'directional'
  | 'ambient'
  | 'zone'
  | 'surface';

export type AudioCategory = 
  | 'music'
  | 'sfx'
  | 'voice'
  | 'ambient'
  | 'ui'
  | 'notification';

export type DistanceModel = 
  | 'linear'
  | 'inverse'
  | 'exponential';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface AudioSource {
  id: string;
  name: string;
  type: AudioSourceType;
  category: AudioCategory;
  asset: string;
  position: Vector3;
  rotation?: Vector3;
  volume: number;
  pitch: number;
  loop: boolean;
  autoplay: boolean;
  spatialBlend: number;
  spread: number;
  dopplerLevel: number;
  distanceModel: DistanceModel;
  minDistance: number;
  maxDistance: number;
  rolloffFactor: number;
  cone?: AudioCone;
  filters?: AudioFilter[];
  envelope?: AudioEnvelope;
  triggers?: AudioTrigger[];
}

export interface AudioCone {
  innerAngle: number;
  outerAngle: number;
  outerGain: number;
}

export interface AudioFilter {
  type: 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'peaking' | 'lowshelf' | 'highshelf';
  frequency: number;
  q: number;
  gain?: number;
}

export interface AudioEnvelope {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface AudioTrigger {
  id: string;
  type: 'enter-zone' | 'exit-zone' | 'proximity' | 'event' | 'time';
  condition: Record<string, any>;
  action: 'play' | 'stop' | 'pause' | 'fade-in' | 'fade-out' | 'crossfade';
  duration?: number;
}

export interface AudioZone {
  id: string;
  name: string;
  type: 'box' | 'sphere' | 'cylinder' | 'mesh';
  position: Vector3;
  size: Vector3 | number;
  sources: string[];
  reverb?: ReverbConfig;
  occlusion?: OcclusionConfig;
  priority: number;
}

export interface ReverbConfig {
  preset: 'none' | 'small-room' | 'large-room' | 'hall' | 'cathedral' | 'cave' | 'outdoor';
  roomSize: number;
  damping: number;
  wetLevel: number;
  dryLevel: number;
  earlyReflections: number;
  lateReflections: number;
}

export interface OcclusionConfig {
  enabled: boolean;
  lowPassFrequency: number;
  volumeReduction: number;
  raycastLayers?: string[];
}

export interface AudioListener {
  id: string;
  position: Vector3;
  rotation: Vector3;
  velocity?: Vector3;
}

export interface AudioMixer {
  id: string;
  name: string;
  channels: AudioChannel[];
  masterVolume: number;
  masterMute: boolean;
}

export interface AudioChannel {
  id: string;
  name: string;
  category: AudioCategory;
  volume: number;
  mute: boolean;
  solo: boolean;
  effects?: AudioEffect[];
}

export interface AudioEffect {
  type: 'reverb' | 'delay' | 'distortion' | 'compressor' | 'equalizer' | 'chorus';
  enabled: boolean;
  params: Record<string, any>;
}

export interface SpatialAudioScene {
  id: string;
  timestamp: string;
  listener: AudioListener;
  sources: AudioSource[];
  zones: AudioZone[];
  mixer: AudioMixer;
  globalReverb?: ReverbConfig;
  dopplerFactor: number;
  speedOfSound: number;
  safe: {
    isRepresentational: true;
    noAutonomy: true;
    descriptorOnly: true;
  };
}

// ============================================================
// REVERB PRESETS
// ============================================================

export const REVERB_PRESETS: Record<string, ReverbConfig> = {
  'none': {
    preset: 'none',
    roomSize: 0,
    damping: 0,
    wetLevel: 0,
    dryLevel: 1,
    earlyReflections: 0,
    lateReflections: 0
  },
  'small-room': {
    preset: 'small-room',
    roomSize: 0.3,
    damping: 0.7,
    wetLevel: 0.2,
    dryLevel: 0.8,
    earlyReflections: 0.1,
    lateReflections: 0.05
  },
  'large-room': {
    preset: 'large-room',
    roomSize: 0.6,
    damping: 0.5,
    wetLevel: 0.35,
    dryLevel: 0.65,
    earlyReflections: 0.15,
    lateReflections: 0.1
  },
  'hall': {
    preset: 'hall',
    roomSize: 0.8,
    damping: 0.4,
    wetLevel: 0.5,
    dryLevel: 0.5,
    earlyReflections: 0.2,
    lateReflections: 0.15
  },
  'cathedral': {
    preset: 'cathedral',
    roomSize: 0.95,
    damping: 0.3,
    wetLevel: 0.7,
    dryLevel: 0.3,
    earlyReflections: 0.25,
    lateReflections: 0.2
  },
  'cave': {
    preset: 'cave',
    roomSize: 0.85,
    damping: 0.2,
    wetLevel: 0.6,
    dryLevel: 0.4,
    earlyReflections: 0.3,
    lateReflections: 0.25
  },
  'outdoor': {
    preset: 'outdoor',
    roomSize: 0.4,
    damping: 0.9,
    wetLevel: 0.1,
    dryLevel: 0.9,
    earlyReflections: 0.05,
    lateReflections: 0.02
  }
};

// ============================================================
// SPATIAL AUDIO CLASS
// ============================================================

export class SpatialAudio {
  private sources: Map<string, AudioSource>;
  private zones: Map<string, AudioZone>;
  private listener: AudioListener;
  private mixer: AudioMixer;
  private globalReverb: ReverbConfig;
  private dopplerFactor: number;
  private speedOfSound: number;

  constructor() {
    this.sources = new Map();
    this.zones = new Map();
    this.listener = {
      id: 'listener-main',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    };
    this.mixer = this.createDefaultMixer();
    this.globalReverb = REVERB_PRESETS['none'];
    this.dopplerFactor = 1;
    this.speedOfSound = 343;
  }

  /**
   * Create default mixer
   */
  private createDefaultMixer(): AudioMixer {
    return {
      id: 'mixer-main',
      name: 'Main Mixer',
      channels: [
        { id: 'ch-music', name: 'Music', category: 'music', volume: 0.7, mute: false, solo: false },
        { id: 'ch-sfx', name: 'SFX', category: 'sfx', volume: 1, mute: false, solo: false },
        { id: 'ch-voice', name: 'Voice', category: 'voice', volume: 1, mute: false, solo: false },
        { id: 'ch-ambient', name: 'Ambient', category: 'ambient', volume: 0.5, mute: false, solo: false },
        { id: 'ch-ui', name: 'UI', category: 'ui', volume: 0.8, mute: false, solo: false },
        { id: 'ch-notification', name: 'Notification', category: 'notification', volume: 1, mute: false, solo: false }
      ],
      masterVolume: 1,
      masterMute: false
    };
  }

  /**
   * Create audio source
   * SAFE: Creates descriptor only
   */
  createSource(
    name: string,
    asset: string,
    position: Vector3,
    options?: Partial<Omit<AudioSource, 'id' | 'name' | 'asset' | 'position'>>
  ): AudioSource {
    const source: AudioSource = {
      id: `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: options?.type || 'point',
      category: options?.category || 'sfx',
      asset,
      position,
      rotation: options?.rotation || { x: 0, y: 0, z: 0 },
      volume: options?.volume ?? 1,
      pitch: options?.pitch ?? 1,
      loop: options?.loop ?? false,
      autoplay: options?.autoplay ?? false,
      spatialBlend: options?.spatialBlend ?? 1,
      spread: options?.spread ?? 0,
      dopplerLevel: options?.dopplerLevel ?? 1,
      distanceModel: options?.distanceModel || 'inverse',
      minDistance: options?.minDistance ?? 1,
      maxDistance: options?.maxDistance ?? 100,
      rolloffFactor: options?.rolloffFactor ?? 1,
      cone: options?.cone,
      filters: options?.filters,
      envelope: options?.envelope,
      triggers: options?.triggers
    };

    this.sources.set(source.id, source);
    return source;
  }

  /**
   * Create ambient source (non-spatial)
   */
  createAmbient(name: string, asset: string, options?: { volume?: number; loop?: boolean }): AudioSource {
    return this.createSource(name, asset, { x: 0, y: 0, z: 0 }, {
      type: 'ambient',
      category: 'ambient',
      spatialBlend: 0,
      loop: options?.loop ?? true,
      volume: options?.volume ?? 0.3,
      autoplay: true
    });
  }

  /**
   * Create directional source
   */
  createDirectional(
    name: string,
    asset: string,
    position: Vector3,
    direction: Vector3,
    options?: { innerAngle?: number; outerAngle?: number; outerGain?: number }
  ): AudioSource {
    return this.createSource(name, asset, position, {
      type: 'directional',
      rotation: direction,
      cone: {
        innerAngle: options?.innerAngle ?? 60,
        outerAngle: options?.outerAngle ?? 120,
        outerGain: options?.outerGain ?? 0.2
      }
    });
  }

  /**
   * Create audio zone
   * SAFE: Creates descriptor only
   */
  createZone(
    name: string,
    type: AudioZone['type'],
    position: Vector3,
    size: Vector3 | number,
    options?: {
      reverb?: ReverbConfig | string;
      occlusion?: OcclusionConfig;
      priority?: number;
    }
  ): AudioZone {
    const zone: AudioZone = {
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      position,
      size,
      sources: [],
      reverb: typeof options?.reverb === 'string' 
        ? REVERB_PRESETS[options.reverb] 
        : options?.reverb,
      occlusion: options?.occlusion,
      priority: options?.priority ?? 0
    };

    this.zones.set(zone.id, zone);
    return zone;
  }

  /**
   * Add source to zone
   */
  addSourceToZone(zoneId: string, sourceId: string): boolean {
    const zone = this.zones.get(zoneId);
    if (!zone) return false;
    
    if (!zone.sources.includes(sourceId)) {
      zone.sources.push(sourceId);
    }
    return true;
  }

  /**
   * Update listener position
   */
  setListenerPosition(position: Vector3, rotation?: Vector3): void {
    this.listener.position = position;
    if (rotation) {
      this.listener.rotation = rotation;
    }
  }

  /**
   * Set channel volume
   */
  setChannelVolume(category: AudioCategory, volume: number): boolean {
    const channel = this.mixer.channels.find(c => c.category === category);
    if (!channel) return false;
    channel.volume = Math.max(0, Math.min(1, volume));
    return true;
  }

  /**
   * Set channel mute
   */
  setChannelMute(category: AudioCategory, mute: boolean): boolean {
    const channel = this.mixer.channels.find(c => c.category === category);
    if (!channel) return false;
    channel.mute = mute;
    return true;
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.mixer.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set global reverb
   */
  setGlobalReverb(preset: string | ReverbConfig): void {
    this.globalReverb = typeof preset === 'string'
      ? REVERB_PRESETS[preset] || REVERB_PRESETS['none']
      : preset;
  }

  /**
   * Calculate distance attenuation
   * SAFE: Calculation only
   */
  calculateAttenuation(source: AudioSource, listenerPos: Vector3): number {
    const dx = source.position.x - listenerPos.x;
    const dy = source.position.y - listenerPos.y;
    const dz = source.position.z - listenerPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance <= source.minDistance) return 1;
    if (distance >= source.maxDistance) return 0;

    const clamped = Math.max(source.minDistance, Math.min(distance, source.maxDistance));

    switch (source.distanceModel) {
      case 'linear':
        return 1 - source.rolloffFactor * (clamped - source.minDistance) / (source.maxDistance - source.minDistance);
      
      case 'inverse':
        return source.minDistance / (source.minDistance + source.rolloffFactor * (clamped - source.minDistance));
      
      case 'exponential':
        return Math.pow(clamped / source.minDistance, -source.rolloffFactor);
      
      default:
        return 1;
    }
  }

  /**
   * Calculate cone attenuation
   * SAFE: Calculation only
   */
  calculateConeAttenuation(source: AudioSource, listenerPos: Vector3): number {
    if (!source.cone || source.type !== 'directional') return 1;

    // Calculate angle between source direction and listener
    const dx = listenerPos.x - source.position.x;
    const dy = listenerPos.y - source.position.y;
    const dz = listenerPos.z - source.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (distance === 0) return 1;

    // Simplified angle calculation
    const angle = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * (180 / Math.PI);

    const innerAngle = source.cone.innerAngle / 2;
    const outerAngle = source.cone.outerAngle / 2;

    if (angle <= innerAngle) return 1;
    if (angle >= outerAngle) return source.cone.outerGain;

    // Interpolate between inner and outer
    const t = (angle - innerAngle) / (outerAngle - innerAngle);
    return 1 - t * (1 - source.cone.outerGain);
  }

  /**
   * Get source
   */
  getSource(sourceId: string): AudioSource | undefined {
    return this.sources.get(sourceId);
  }

  /**
   * Get zone
   */
  getZone(zoneId: string): AudioZone | undefined {
    return this.zones.get(zoneId);
  }

  /**
   * Get all sources
   */
  getAllSources(): AudioSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Get all zones
   */
  getAllZones(): AudioZone[] {
    return Array.from(this.zones.values());
  }

  /**
   * Remove source
   */
  removeSource(sourceId: string): boolean {
    return this.sources.delete(sourceId);
  }

  /**
   * Remove zone
   */
  removeZone(zoneId: string): boolean {
    return this.zones.delete(zoneId);
  }

  /**
   * Export audio scene
   * SAFE: Export only
   */
  export(): SpatialAudioScene {
    return {
      id: `audio-scene-${Date.now()}`,
      timestamp: new Date().toISOString(),
      listener: { ...this.listener },
      sources: Array.from(this.sources.values()),
      zones: Array.from(this.zones.values()),
      mixer: { ...this.mixer },
      globalReverb: { ...this.globalReverb },
      dopplerFactor: this.dopplerFactor,
      speedOfSound: this.speedOfSound,
      safe: {
        isRepresentational: true,
        noAutonomy: true,
        descriptorOnly: true
      }
    };
  }

  /**
   * Clear all
   */
  clear(): void {
    this.sources.clear();
    this.zones.clear();
    this.globalReverb = REVERB_PRESETS['none'];
  }
}

// ============================================================
// SAFE COMPLIANCE MARKER
// ============================================================

export const SPATIAL_AUDIO_SAFE = {
  isRepresentational: true,
  noAutonomy: true,
  descriptorOnly: true,
  noPlayback: true,
  noAgents: true,
  noInternalMemory: true
} as const;
